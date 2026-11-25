import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Headphones,
  Info,
  Languages,
  MapPin,
  MessageCircle,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Square,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import type {
  AppLanguage,
  AustraliaPracticeMode,
  AustraliaSpeakingEvidenceRecord,
  ResolvedAppearance,
} from '../../types/game';
import { GAME_COPY } from '../../data/i18n';
import {
  AUSTRALIA_LANDMARKS,
  AUSTRALIA_NPC_DIALOGUES,
  type AustraliaLandmarkId,
} from '../../data/australiaWorld';
import type { AustraliaDifficultyMode } from '../../data/australiaDiscovery';
import {
  DARLING_HARBOUR_BUILD_BOARD,
  HARBOUR_CAFE_BUILD_MENU,
} from '../../data/australiaBuild';
import {
  AUSTRALIA_PRACTICE_MISSIONS,
  AUSTRALIA_PRACTICE_REFLECTION_ITEMS,
  AUSTRALIA_PRACTICE_XP_REWARD,
  buildAustraliaPracticeFeedback,
  getAustraliaPracticeMissionSpec,
} from '../../data/australiaPractice';
import {
  isMicrophoneRecordingSupported,
  startTransientMicRecording,
  type ActiveRecordingHandle,
  type RecorderErrorCode,
} from '../../utils/audioRecorder';
import { AustraliaNpcPortraitSVG } from './AustraliaSvgArtwork';
import {
  AustraliaContextObjectSVG,
  AustraliaSceneHeroBanner,
  type AustraliaContextPropId,
} from './AustraliaPerformArtwork';

const LANDMARK_CONTEXT_PROPS: Record<AustraliaLandmarkId, AustraliaContextPropId[]> = {
  circular_quay_plaza: ['tourist_brochure', 'sydney_visitor_map'],
  city_transit_station: ['direction_sign', 'ferry_ticket', 'train_ticket'],
  harbour_market_cafe: ['cafe_menu', 'sandwich', 'orange_juice'],
  darling_harbour_hub: ['visitor_info_board', 'attraction_ticket'],
  harbour_gardens_help_point: ['garden_signpost', 'sydney_visitor_map'],
};

interface AustraliaPracticeModalProps {
  landmarkId: AustraliaLandmarkId;
  language: AppLanguage;
  appearance: ResolvedAppearance;
  reducedMotion: boolean;
  alreadyCompletedMission: boolean;
  completedPracticeCount: number;
  builtDialogue?: string;
  existingEvidence?: AustraliaSpeakingEvidenceRecord;
  difficultyMode: AustraliaDifficultyMode;
  onDifficultyChange: (mode: AustraliaDifficultyMode) => void;
  onCompleteMission: (
    landmarkId: AustraliaLandmarkId,
    evidence: AustraliaSpeakingEvidenceRecord,
  ) => void;
  onClose: () => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'mode' | 'reward') => void;
}

type PracticeStep = 'listen' | 'prepare' | 'speak' | 'review' | 'complete';

function formatElapsed(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function AustraliaPracticeModal({
  landmarkId,
  language,
  appearance,
  reducedMotion,
  alreadyCompletedMission,
  completedPracticeCount,
  builtDialogue,
  existingEvidence,
  difficultyMode,
  onDifficultyChange,
  onCompleteMission,
  onClose,
  onPlaySfx,
}: AustraliaPracticeModalProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';
  const mission = getAustraliaPracticeMissionSpec(landmarkId) ?? AUSTRALIA_PRACTICE_MISSIONS[0];
  const landmark =
    AUSTRALIA_LANDMARKS.find((l) => l.id === mission.landmarkId) ?? AUSTRALIA_LANDMARKS[0];
  const npcEntry = AUSTRALIA_NPC_DIALOGUES[mission.npcId];
  const totalMissions = AUSTRALIA_PRACTICE_MISSIONS.length;

  const [step, setStep] = useState<PracticeStep>('listen');
  const [showStarters, setShowStarters] = useState(true);
  const [showModel, setShowModel] = useState(difficultyMode === 'a2');
  const [showThaiTip, setShowThaiTip] = useState(language === 'th');

  // Role-play turn progress inside SPEAK step
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [completedTurnModes, setCompletedTurnModes] = useState<
    Record<string, AustraliaPracticeMode>
  >({});
  const [recordingWarning, setRecordingWarning] = useState(false);

  // Audio playback & transient mic recording state
  const micSupported = isMicrophoneRecordingSupported();
  const [practiceMode, setPracticeMode] = useState<AustraliaPracticeMode>(
    micSupported ? 'microphone_recording' : 'no_mic_rehearsal',
  );
  const [recordingState, setRecordingState] = useState<
    'idle' | 'requesting' | 'recording' | 'recorded'
  >('idle');
  const [elapsedSec, setElapsedSec] = useState(0);
  const [turnAudioUrls, setTurnAudioUrls] = useState<Record<string, string>>({});
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [micError, setMicError] = useState<RecorderErrorCode | null>(null);
  const [noMicConfirmedTurnIds, setNoMicConfirmedTurnIds] = useState<Record<string, boolean>>({});
  const [isSpeakingTts, setIsSpeakingTts] = useState(false);

  // Self-review checklist state
  const [reflectionChecks, setReflectionChecks] = useState({
    askedClearQuestion: Boolean(existingEvidence?.reflectionChecks.askedClearQuestion),
    respondedToNpc: Boolean(existingEvidence?.reflectionChecks.respondedToNpc),
    usedPoliteExpression: Boolean(existingEvidence?.reflectionChecks.usedPoliteExpression),
    checkedOrClarifiedMeaning: Boolean(
      existingEvidence?.reflectionChecks.checkedOrClarifiedMeaning,
    ),
  });

  // Final saved mission summary for step === 'complete'
  const [submittedRecord, setSubmittedRecord] = useState<AustraliaSpeakingEvidenceRecord | null>(
    null,
  );
  const [wasAlreadyDoneAtOpen] = useState(alreadyCompletedMission);

  // Refs for cleanup (never store audio blobs in localStorage)
  const recorderRef = useRef<ActiveRecordingHandle | null>(null);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);
  const turnAudioUrlsRef = useRef<Record<string, string>>({});
  turnAudioUrlsRef.current = turnAudioUrls;

  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingTts(false);
  }, []);

  const stopPlayback = useCallback(() => {
    if (playbackAudioRef.current) {
      playbackAudioRef.current.pause();
      playbackAudioRef.current.currentTime = 0;
    }
    setIsPlayingBack(false);
  }, []);

  const revokeUrlIfAny = useCallback((url: string | undefined) => {
    if (!url) return;
    try {
      URL.revokeObjectURL(url);
    } catch {
      // Ignore already revoked URLs
    }
  }, []);

  const releaseAllRecordings = useCallback(() => {
    stopPlayback();
    if (playbackAudioRef.current) {
      playbackAudioRef.current.removeAttribute('src');
    }
    if (recorderRef.current) {
      recorderRef.current.dispose();
      recorderRef.current = null;
    }
    const urls = Object.values(turnAudioUrlsRef.current);
    urls.forEach(revokeUrlIfAny);
    turnAudioUrlsRef.current = {};
    setTurnAudioUrls({});
    setRecordingState('idle');
    setElapsedSec(0);
  }, [revokeUrlIfAny, stopPlayback]);

  // Reset mission workspace when landmarkId changes
  useEffect(() => {
    releaseAllRecordings();
    stopSpeech();
    setStep('listen');
    setCurrentTurnIndex(0);
    setCompletedTurnModes({});
    setNoMicConfirmedTurnIds({});
    setMicError(null);
    setRecordingWarning(false);
    setSubmittedRecord(null);
    setShowModel(difficultyMode === 'a2');
    setShowThaiTip(language === 'th');
    setReflectionChecks({
      askedClearQuestion: Boolean(existingEvidence?.reflectionChecks.askedClearQuestion),
      respondedToNpc: Boolean(existingEvidence?.reflectionChecks.respondedToNpc),
      usedPoliteExpression: Boolean(existingEvidence?.reflectionChecks.usedPoliteExpression),
      checkedOrClarifiedMeaning: Boolean(
        existingEvidence?.reflectionChecks.checkedOrClarifiedMeaning,
      ),
    });
    // Intentionally only reset on landmark switch, NOT on language/difficulty switch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [landmarkId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      releaseAllRecordings();
      stopSpeech();
    };
  }, [releaseAllRecordings, stopSpeech]);

  // Recording elapsed timer
  useEffect(() => {
    if (recordingState !== 'recording') return;
    const timer = window.setInterval(() => {
      setElapsedSec((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [recordingState]);

  const speakEnglish = useCallback(
    (text: string) => {
      if (recordingState === 'recording' || recordingState === 'requesting') {
        setRecordingWarning(true);
        return;
      }
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      stopPlayback();
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-AU';
      utterance.rate = npcEntry.voiceRate;
      utterance.pitch = npcEntry.voicePitch;
      utterance.onstart = () => setIsSpeakingTts(true);
      utterance.onend = () => setIsSpeakingTts(false);
      utterance.onerror = () => setIsSpeakingTts(false);
      setIsSpeakingTts(true);
      window.speechSynthesis.speak(utterance);
    },
    [npcEntry.voicePitch, npcEntry.voiceRate, recordingState, stopPlayback],
  );

  const handleClose = useCallback(() => {
    releaseAllRecordings();
    stopSpeech();
    onPlaySfx('click');
    onClose();
  }, [onClose, onPlaySfx, releaseAllRecordings, stopSpeech]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleClose]);

  const activeTurn = mission.turns[currentTurnIndex] ?? mission.turns[0];
  const currentTurnAudioUrl = turnAudioUrls[activeTurn.turnId] ?? null;
  const allTurnsDone = mission.turns.every((t) => Boolean(completedTurnModes[t.turnId]));

  const handleDifficultyToggle = (nextMode: AustraliaDifficultyMode) => {
    if (recordingState === 'recording' || recordingState === 'requesting') {
      setRecordingWarning(true);
      return;
    }
    setRecordingWarning(false);
    onPlaySfx('mode');
    onDifficultyChange(nextMode);
  };

  const handleStartMicRecording = async () => {
    stopSpeech();
    stopPlayback();
    setRecordingWarning(false);
    setMicError(null);
    onPlaySfx('select');

    if (recorderRef.current) {
      recorderRef.current.dispose();
      recorderRef.current = null;
    }
    const existingUrl = turnAudioUrls[activeTurn.turnId];
    if (existingUrl) {
      revokeUrlIfAny(existingUrl);
      setTurnAudioUrls((prev) => {
        const next = { ...prev };
        delete next[activeTurn.turnId];
        return next;
      });
    }

    setRecordingState('requesting');
    setElapsedSec(0);
    const turnIdAtStart = activeTurn.turnId;

    const handle = await startTransientMicRecording({
      onRecordingStarted: () => {
        setRecordingState('recording');
      },
      onAudioReady: (objectUrl) => {
        setTurnAudioUrls((prev) => {
          const old = prev[turnIdAtStart];
          if (old && old !== objectUrl) {
            revokeUrlIfAny(old);
          }
          return { ...prev, [turnIdAtStart]: objectUrl };
        });
        setRecordingState('recorded');
      },
      onError: (code) => {
        setMicError(code);
        setRecordingState('idle');
      },
    });
    recorderRef.current = handle;
  };

  const handleStopMicRecording = () => {
    onPlaySfx('click');
    recorderRef.current?.stop();
  };

  const handlePlaybackRecording = () => {
    if (!currentTurnAudioUrl) return;
    stopSpeech();
    setRecordingWarning(false);
    if (isPlayingBack) {
      stopPlayback();
      return;
    }
    if (!playbackAudioRef.current) {
      playbackAudioRef.current = new Audio();
      playbackAudioRef.current.onended = () => setIsPlayingBack(false);
      playbackAudioRef.current.onerror = () => setIsPlayingBack(false);
    }
    playbackAudioRef.current.src = currentTurnAudioUrl;
    playbackAudioRef.current.currentTime = 0;
    playbackAudioRef.current
      .play()
      .then(() => setIsPlayingBack(true))
      .catch(() => setIsPlayingBack(false));
  };

  const handleRetryCurrentTurn = () => {
    stopSpeech();
    stopPlayback();
    setRecordingWarning(false);
    setMicError(null);
    if (recorderRef.current) {
      recorderRef.current.dispose();
      recorderRef.current = null;
    }
    const existingUrl = turnAudioUrls[activeTurn.turnId];
    if (existingUrl) {
      revokeUrlIfAny(existingUrl);
      setTurnAudioUrls((prev) => {
        const next = { ...prev };
        delete next[activeTurn.turnId];
        return next;
      });
    }
    setNoMicConfirmedTurnIds((prev) => ({ ...prev, [activeTurn.turnId]: false }));
    setCompletedTurnModes((prev) => {
      const next = { ...prev };
      delete next[activeTurn.turnId];
      return next;
    });
    setRecordingState('idle');
    setElapsedSec(0);
    onPlaySfx('click');
  };

  const handleSwitchMode = (nextMode: AustraliaPracticeMode) => {
    if (recordingState === 'recording' || recordingState === 'requesting') {
      recorderRef.current?.dispose();
      recorderRef.current = null;
    }
    stopPlayback();
    setMicError(null);
    setRecordingWarning(false);
    setRecordingState(
      nextMode === 'microphone_recording' && turnAudioUrls[activeTurn.turnId] ? 'recorded' : 'idle',
    );
    setPracticeMode(nextMode);
    onPlaySfx('mode');
  };

  const handleConfirmTurn = () => {
    if (recordingState === 'recording' || recordingState === 'requesting') {
      setRecordingWarning(true);
      return;
    }
    stopSpeech();
    stopPlayback();
    const modeUsed: AustraliaPracticeMode =
      practiceMode === 'microphone_recording' && Boolean(currentTurnAudioUrl)
        ? 'microphone_recording'
        : 'no_mic_rehearsal';

    setCompletedTurnModes((prev) => ({
      ...prev,
      [activeTurn.turnId]: modeUsed,
    }));
    onPlaySfx('select');

    if (currentTurnIndex < mission.turns.length - 1) {
      const nextIndex = currentTurnIndex + 1;
      const nextTurn = mission.turns[nextIndex];
      setCurrentTurnIndex(nextIndex);
      setMicError(null);
      setElapsedSec(0);
      setRecordingState(turnAudioUrls[nextTurn.turnId] ? 'recorded' : 'idle');
    }
  };

  const canConfirmCurrentTurn =
    practiceMode === 'microphone_recording'
      ? Boolean(currentTurnAudioUrl) && recordingState !== 'recording' && recordingState !== 'requesting'
      : Boolean(noMicConfirmedTurnIds[activeTurn.turnId]);

  const reflectionSelectedCount = Object.values(reflectionChecks).filter(Boolean).length;

  const handleCompleteMission = () => {
    if (!allTurnsDone || reflectionSelectedCount < 1) return;
    stopSpeech();
    stopPlayback();

    const allTurnsUsedMic = mission.turns.every(
      (t) => completedTurnModes[t.turnId] === 'microphone_recording',
    );
    const record: AustraliaSpeakingEvidenceRecord = {
      practiceMode: allTurnsUsedMic ? 'microphone_recording' : 'no_mic_rehearsal',
      completedTurnIds: mission.turns.map((t) => t.turnId),
      reflectionChecks: { ...reflectionChecks },
      difficultyUsed: difficultyMode,
      completedAt: new Date().toISOString(),
    };

    releaseAllRecordings();
    onPlaySfx('reward');
    onCompleteMission(mission.id, record);
    setSubmittedRecord(record);
    setStep('complete');
  };

  const handleReplayMission = () => {
    releaseAllRecordings();
    stopSpeech();
    onPlaySfx('click');
    setCurrentTurnIndex(0);
    setCompletedTurnModes({});
    setNoMicConfirmedTurnIds({});
    setMicError(null);
    setRecordingWarning(false);
    setSubmittedRecord(null);
    setStep('listen');
  };

  const cardSurfaceClass = isNight
    ? 'border-white/15 bg-[#13203E] text-[#F8FAFC]'
    : 'border-[#BAE6FD] bg-white text-[#1E2E46]';

  const subtlePanelClass = isNight
    ? 'border-white/12 bg-[#0E172E] text-[#E2E8F0]'
    : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#334155]';

  const stepTabs: { id: PracticeStep; label: string }[] = [
    { id: 'listen', label: copy.australiaPracticeStepListen },
    { id: 'prepare', label: copy.australiaPracticeStepPrepare },
    { id: 'speak', label: copy.australiaPracticeStepSpeak },
    { id: 'review', label: copy.australiaPracticeStepReview },
    { id: 'complete', label: copy.australiaPracticeStepComplete },
  ];

  const predictedWillCompleteAllFive =
    !wasAlreadyDoneAtOpen && completedPracticeCount + 1 >= totalMissions;

  const feedbackResult = buildAustraliaPracticeFeedback({
    landmarkId: mission.id,
    practiceMode: submittedRecord?.practiceMode ?? practiceMode,
    difficultyUsed: submittedRecord?.difficultyUsed ?? difficultyMode,
    turnCount: mission.turns.length,
    allFinished:
      submittedRecord !== null
        ? wasAlreadyDoneAtOpen
          ? completedPracticeCount >= totalMissions
          : completedPracticeCount + 1 >= totalMissions || predictedWillCompleteAllFive
        : false,
  });

  const turnPromptText =
    difficultyMode === 'b1' ? activeTurn.npcPromptB1 : activeTurn.npcPromptA2;
  const turnTaskText =
    difficultyMode === 'b1' ? activeTurn.learnerTaskB1 : activeTurn.learnerTaskA2;
  const turnStarters =
    difficultyMode === 'b1' ? activeTurn.sentenceStartersB1 : activeTurn.sentenceStartersA2;
  const turnModel =
    difficultyMode === 'b1' ? activeTurn.modelResponseB1 : activeTurn.modelResponseA2;

  const renderQuickReferenceCard = () => {
    if (mission.usesCafeMenu) {
      return (
        <div className={`rounded-2xl border p-3.5 ${subtlePanelClass}`}>
          <p className="text-xs font-extrabold text-[#0EA5E9] mb-2">
            {copy.australiaPracticeMenuQuickRefTitle}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {HARBOUR_CAFE_BUILD_MENU.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className={`rounded-xl border px-2.5 py-2 text-xs ${
                  isNight ? 'border-white/10 bg-[#162344]' : 'border-[#E2E8F0] bg-white'
                }`}
              >
                <p className="font-bold truncate">{item.name[language]}</p>
                <p className="font-mono-num text-[11px] font-extrabold text-[#0EA5E9]">
                  {item.priceText}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (mission.usesVisitorBoard) {
      return (
        <div className={`rounded-2xl border p-3.5 ${subtlePanelClass}`}>
          <p className="text-xs font-extrabold text-[#0EA5E9] mb-2">
            {copy.australiaPracticeBoardQuickRefTitle}
          </p>
          <div className="grid sm:grid-cols-3 gap-2">
            {DARLING_HARBOUR_BUILD_BOARD.slice(0, 3).map((item, idx) => (
              <div
                key={`${item.tab}_${idx}`}
                className={`rounded-xl border px-2.5 py-2 text-xs ${
                  isNight ? 'border-white/10 bg-[#162344]' : 'border-[#E2E8F0] bg-white'
                }`}
              >
                <p className="font-bold">{item.itemTitle[language]}</p>
                <p className="mt-0.5 text-[11px] opacity-85">{item.detailLine[language]}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (mission.fictionalRouteSummary) {
      return (
        <div className={`rounded-2xl border p-3.5 ${subtlePanelClass}`}>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-[#0EA5E9] mt-0.5" aria-hidden="true" />
            <p className="text-xs font-semibold leading-relaxed">
              {mission.fictionalRouteSummary[language]}
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  const contextProps = LANDMARK_CONTEXT_PROPS[mission.landmarkId] ?? ['sydney_visitor_map'];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="australia-practice-modal-title"
      className={`fixed inset-0 z-40 flex items-center justify-center p-2.5 sm:p-5 ${
        isNight ? 'bg-[#081229]/84' : 'bg-[#0F2942]/45'
      }`}
    >
      <div
        className={`flex max-h-[93dvh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border shadow-2xl ${
          isNight
            ? 'border-[#38BDF8]/50 bg-[#0F1A33] text-[#F8FAFC]'
            : 'border-[#168FE5]/25 bg-[#FFFDF8] text-[#1E2E46]'
        }`}
      >
        {/* Top Header */}
        <div
          className={`border-b px-4 py-3.5 sm:px-6 ${
            isNight
              ? 'border-white/12 bg-gradient-to-r from-[#17284E] via-[#132C52] to-[#0E3F53]'
              : 'border-[#BAE6FD] bg-gradient-to-r from-[#E0F2FE] via-[#F0F9FF] to-[#E6FAF6]'
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={`rounded-2xl p-1 shadow-md ${
                  isNight
                    ? 'bg-[#0B1429] ring-1 ring-[#38BDF8]/40'
                    : 'bg-white ring-1 ring-[#168FE5]/20'
                }`}
              >
                <AustraliaNpcPortraitSVG
                  npcId={mission.npcId}
                  className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-xl"
                />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center rounded-md bg-[#168FE5] px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-white shadow-sm">
                    {copy.australiaPracticeModeBadge}
                  </span>
                  {mission.isHelpPointReuse && (
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        isNight ? 'bg-[#00BFA5]/20 text-[#5EEAD4]' : 'bg-[#E6FAF6] text-[#0F766E]'
                      }`}
                    >
                      {copy.australiaPracticeHelpPointReuseBadge}
                    </span>
                  )}
                </div>
                <h2
                  id="australia-practice-modal-title"
                  className="mt-1 font-display text-base sm:text-lg font-extrabold leading-tight truncate"
                >
                  {mission.title[language]}
                </h2>
                <p className={`text-xs truncate ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                  {npcEntry.name} · {landmark.title[language]} ·{' '}
                  <span className="font-mono-num font-bold text-[#168FE5] dark:text-[#38BDF8]">
                    {completedPracticeCount}/{totalMissions}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* A2 / B1 Difficulty Toggle */}
              <div
                className={`inline-flex rounded-xl border p-0.5 ${
                  isNight ? 'border-white/15 bg-[#0B1429]' : 'border-[#BAE6FD] bg-white'
                }`}
                role="group"
                aria-label="CEFR Level"
              >
                {(['a2', 'b1'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleDifficultyToggle(mode)}
                    className={`min-h-[34px] rounded-lg px-2.5 text-xs font-extrabold uppercase transition-colors cursor-pointer ${
                      difficultyMode === mode
                        ? 'bg-[#0EA5E9] text-white'
                        : isNight
                          ? 'text-[#CBD5E1] hover:bg-white/10'
                          : 'text-[#475569] hover:bg-[#F0F9FF]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {isSpeakingTts && (
                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    onPlaySfx('click');
                  }}
                  className="inline-flex min-h-[36px] items-center gap-1 rounded-xl bg-[#EF4444] px-2.5 py-1.5 text-xs font-bold text-white hover:bg-[#DC2626] cursor-pointer"
                >
                  <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">{copy.australiaPracticeStopAudioButton}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleClose}
                aria-label={copy.closeSettings}
                className={`flex h-9 w-9 items-center justify-center rounded-xl border cursor-pointer ${
                  isNight
                    ? 'border-white/15 bg-white/10 text-white hover:bg-white/20'
                    : 'border-[#0284C7]/25 bg-white text-[#1E2E46] hover:bg-[#F8FAFC]'
                }`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* 5-Step Progress Strip */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {stepTabs.map((tab, idx) => {
              const currentIdx = stepTabs.findIndex((s) => s.id === step);
              const isCurrent = tab.id === step;
              const isDone = idx < currentIdx || (tab.id === 'complete' && submittedRecord !== null);
              const canJump =
                tab.id !== 'complete' &&
                step !== 'complete' &&
                recordingState !== 'recording' &&
                recordingState !== 'requesting' &&
                (tab.id === 'listen' ||
                  tab.id === 'prepare' ||
                  tab.id === 'speak' ||
                  (tab.id === 'review' && allTurnsDone));
              return (
                <button
                  key={tab.id}
                  type="button"
                  disabled={!canJump}
                  onClick={() => {
                    if (!canJump) return;
                    stopSpeech();
                    onPlaySfx('select');
                    setStep(tab.id);
                  }}
                  className={`inline-flex min-h-[32px] items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-extrabold whitespace-nowrap shrink-0 transition-colors ${
                    isCurrent
                      ? 'bg-[#0EA5E9] text-white shadow-sm'
                      : isDone
                        ? isNight
                          ? 'bg-[#10B981]/25 text-[#6EE7B7]'
                          : 'bg-[#ECFDF5] text-[#047857]'
                        : isNight
                          ? 'bg-white/8 text-[#94A3B8]'
                          : 'bg-white/75 text-[#64748B]'
                  } ${canJump ? 'cursor-pointer hover:opacity-90' : 'cursor-default'}`}
                >
                  {isDone && <CheckCircle2 className="h-3 w-3" aria-hidden="true" />}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Deferred warning if user tried to switch mode/difficulty during active recording */}
        {recordingWarning && (
          <div
            role="status"
            className="border-b border-[#F59E0B]/40 bg-[#FFFBEB] px-4 py-2 text-xs font-bold text-[#92400E]"
          >
            {copy.australiaPracticeRecordingDeferredNotice}
          </div>
        )}

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {step === 'listen' && (
            <div className="space-y-4">
              <AustraliaSceneHeroBanner
                landmarkId={mission.landmarkId}
                title={landmark.title[language]}
                subtitle={`${npcEntry.name} · ${npcEntry.role[language]}`}
                badgeLabel={landmark.districtBadge[language]}
                accentColor={landmark.accentColor}
                isNight={isNight}
              />

              <div className={`rounded-2xl border p-4 sm:p-5 space-y-4 shadow-sm ${cardSurfaceClass}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold text-[#168FE5] dark:text-[#38BDF8]">
                      {mission.contextBanner[language]}
                    </p>
                    <h3 className="mt-1 font-display text-base sm:text-lg font-extrabold">
                      {mission.goal[language]}
                    </h3>
                  </div>

                  {/* Contextual SVG Object Strip */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {contextProps.map((propId) => (
                      <div
                        key={propId}
                        className={`rounded-xl border p-1 shadow-sm ${
                          isNight ? 'border-white/12 bg-[#10203E]' : 'border-[#BAE6FD] bg-[#F8FAFC]'
                        }`}
                      >
                        <AustraliaContextObjectSVG propId={propId} className="h-10 w-10" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview Turn 1 NPC Prompt Speech Bubble + Listen */}
                <div
                  className={`rounded-2xl border p-4 shadow-sm ${
                    isNight
                      ? 'border-[#38BDF8]/35 bg-gradient-to-br from-[#102447] to-[#0D2E3F]'
                      : 'border-[#BAE6FD] bg-gradient-to-br from-[#F0F9FF] to-[#ECFEFF]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <AustraliaNpcPortraitSVG
                        npcId={mission.npcId}
                        className="h-9 w-9 rounded-xl shrink-0"
                      />
                      <span className="text-xs font-extrabold text-[#168FE5] dark:text-[#38BDF8]">
                        {npcEntry.name} · {mission.turns[0].stageLabel[language]}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        speakEnglish(
                          difficultyMode === 'b1'
                            ? mission.turns[0].npcPromptB1.en
                            : mission.turns[0].npcPromptA2.en,
                        )
                      }
                      className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl bg-[#168FE5] px-3.5 py-1.5 text-xs font-extrabold text-white shadow-sm hover:bg-[#0284C7] cursor-pointer"
                    >
                      <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{copy.australiaPracticeListenPromptButton}</span>
                    </button>
                  </div>
                  <p className="text-sm sm:text-base font-bold leading-relaxed">
                    “
                    {difficultyMode === 'b1'
                      ? mission.turns[0].npcPromptB1[language]
                      : mission.turns[0].npcPromptA2[language]}
                    ”
                  </p>
                </div>
              </div>

              {builtDialogue && (
                <div
                  className={`rounded-2xl border p-4 shadow-sm ${
                    isNight
                      ? 'border-[#00BFA5]/40 bg-[#0D2B24] text-[#D1FAE5]'
                      : 'border-[#00BFA5]/35 bg-[#E6FAF6] text-[#0F5132]'
                  }`}
                >
                  <p className="text-xs font-extrabold text-[#00A896] dark:text-[#2DD4BF]">
                    {copy.australiaPracticeYourBuiltDialogueLabel}
                  </p>
                  <p className="mt-1 text-sm font-bold">“{builtDialogue}”</p>
                </div>
              )}

              {renderQuickReferenceCard()}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <p className={`text-xs ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                  {mission.turns.length} speaking turns · {copy.australiaPracticeXpRewardOnceNote}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    onPlaySfx('click');
                    setStep('prepare');
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#0EA5E9] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#0284C7] cursor-pointer"
                >
                  <span>{copy.australiaPracticeProceedPrepareButton}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {step === 'prepare' && (
            <div className="space-y-4">
              {builtDialogue && (
                <div className={`rounded-2xl border p-3.5 ${subtlePanelClass}`}>
                  <p className="text-[11px] font-extrabold text-[#10B981]">
                    {copy.australiaPracticeYourBuiltDialogueLabel}
                  </p>
                  <p className="mt-0.5 text-sm font-bold">“{builtDialogue}”</p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('select');
                    setShowStarters((prev) => !prev);
                  }}
                  className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                    showStarters
                      ? 'border-[#0EA5E9] bg-[#0EA5E9]/15 text-[#0EA5E9]'
                      : subtlePanelClass
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.australiaPracticeShowStartersButton}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('select');
                    setShowModel((prev) => !prev);
                  }}
                  className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                    showModel
                      ? 'border-[#10B981] bg-[#10B981]/15 text-[#10B981]'
                      : subtlePanelClass
                  }`}
                >
                  {showModel ? (
                    <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span>{copy.australiaPracticeShowModelButton}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('select');
                    setShowThaiTip((prev) => !prev);
                  }}
                  className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                    showThaiTip
                      ? 'border-[#F59E0B] bg-[#F59E0B]/15 text-[#D97706]'
                      : subtlePanelClass
                  }`}
                >
                  <Languages className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.australiaPracticeShowThaiTipButton}</span>
                </button>
              </div>

              <div className="space-y-3">
                {mission.turns.map((turn) => {
                  const starters =
                    difficultyMode === 'b1' ? turn.sentenceStartersB1 : turn.sentenceStartersA2;
                  const model =
                    difficultyMode === 'b1' ? turn.modelResponseB1 : turn.modelResponseA2;
                  const task = difficultyMode === 'b1' ? turn.learnerTaskB1 : turn.learnerTaskA2;
                  return (
                    <div key={turn.turnId} className={`rounded-2xl border p-4 space-y-2.5 ${cardSurfaceClass}`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-[#0EA5E9]">
                          {turn.stageLabel[language]}
                        </span>
                        <span className="text-xs font-semibold opacity-75">
                          {turn.usefulExpressions.slice(0, 2).join(' · ')}
                        </span>
                      </div>
                      <p className="text-sm font-bold">{task[language]}</p>

                      {showStarters && starters.length > 0 && (
                        <div className={`rounded-xl border p-3 text-xs space-y-1 ${subtlePanelClass}`}>
                          <p className="font-extrabold text-[#0EA5E9]">
                            {copy.australiaPracticeUsefulExpressionsLabel}:
                          </p>
                          <p className="font-semibold">{turn.usefulExpressions.join(' · ')}</p>
                          {starters.map((st, idx) => (
                            <p key={idx} className="pt-1 font-bold">
                              • {st[language]}
                            </p>
                          ))}
                        </div>
                      )}

                      {showModel && (
                        <div
                          className={`rounded-xl border p-3 text-xs flex flex-wrap items-center justify-between gap-2 ${
                            isNight
                              ? 'border-[#10B981]/35 bg-[#0D2B24] text-[#D1FAE5]'
                              : 'border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-extrabold">{copy.australiaPracticeShowModelButton}</p>
                            <p className="mt-0.5 font-semibold">{model[language]}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => speakEnglish(model.en)}
                            className="inline-flex min-h-[34px] items-center gap-1 rounded-lg bg-[#10B981] px-2.5 py-1 text-xs font-extrabold text-white hover:bg-[#059669] cursor-pointer shrink-0"
                          >
                            <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{copy.australiaPracticeHearModelButton}</span>
                          </button>
                        </div>
                      )}

                      {showThaiTip && (
                        <p className="text-xs font-semibold text-[#D97706] dark:text-[#FBBF24]">
                          {turn.thaiTip}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    onPlaySfx('click');
                    setStep('listen');
                  }}
                  className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${subtlePanelClass}`}
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  <span>{copy.australiaPracticeStepListen}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    onPlaySfx('click');
                    setStep('speak');
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#0EA5E9] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#0284C7] cursor-pointer"
                >
                  <Mic className="h-4 w-4" aria-hidden="true" />
                  <span>{copy.australiaPracticeProceedSpeakButton}</span>
                </button>
              </div>
            </div>
          )}

          {step === 'speak' && (
            <div className="space-y-4">
              {/* Turn Progress Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {mission.turns.map((turn, idx) => {
                    const done = Boolean(completedTurnModes[turn.turnId]);
                    const isCurrent = idx === currentTurnIndex;
                    return (
                      <button
                        key={turn.turnId}
                        type="button"
                        disabled={recordingState === 'recording' || recordingState === 'requesting'}
                        onClick={() => {
                          if (recordingState === 'recording' || recordingState === 'requesting') {
                            return;
                          }
                          stopSpeech();
                          stopPlayback();
                          setCurrentTurnIndex(idx);
                          setMicError(null);
                          setRecordingState(turnAudioUrls[turn.turnId] ? 'recorded' : 'idle');
                        }}
                        className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-extrabold cursor-pointer ${
                          isCurrent
                            ? 'border-[#0EA5E9] bg-[#0EA5E9] text-white'
                            : done
                              ? isNight
                                ? 'border-[#10B981]/50 bg-[#0D2B24] text-[#6EE7B7]'
                                : 'border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]'
                              : subtlePanelClass
                        }`}
                      >
                        {done && <Check className="h-3 w-3" aria-hidden="true" />}
                        <span>
                          {copy.australiaPracticeTurnProgressLabel} {turn.turnNumber}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={recordingState === 'recording' || recordingState === 'requesting'}
                  onClick={() => {
                    stopSpeech();
                    onPlaySfx('click');
                    setStep('prepare');
                  }}
                  className={`inline-flex min-h-[34px] items-center gap-1 rounded-xl border px-3 py-1 text-xs font-bold cursor-pointer ${subtlePanelClass}`}
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.australiaPracticeBackToPrepareButton}</span>
                </button>
              </div>

              <AustraliaSceneHeroBanner
                landmarkId={mission.landmarkId}
                title={`${npcEntry.name} · ${activeTurn.stageLabel[language]}`}
                subtitle={landmark.title[language]}
                badgeLabel={`${copy.australiaPracticeTurnProgressLabel} ${activeTurn.turnNumber}/${mission.turns.length}`}
                accentColor={landmark.accentColor}
                isNight={isNight}
                compact={true}
              />

              {renderQuickReferenceCard()}

              {/* Scripted NPC Prompt Card */}
              <div className={`rounded-2xl border p-4 sm:p-5 space-y-3 shadow-sm ${cardSurfaceClass}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <AustraliaNpcPortraitSVG
                      npcId={mission.npcId}
                      className="h-10 w-10 rounded-xl shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="h-4 w-4 text-[#168FE5] dark:text-[#38BDF8]" aria-hidden="true" />
                        <span className="text-xs font-extrabold text-[#168FE5] dark:text-[#38BDF8]">
                          {npcEntry.name} · {activeTurn.stageLabel[language]}
                        </span>
                      </div>
                      <p className="text-[11px] opacity-75">{npcEntry.role[language]}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={recordingState === 'recording' || recordingState === 'requesting'}
                    onClick={() => speakEnglish(turnPromptText.en)}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl bg-[#168FE5] px-3 py-1.5 text-xs font-extrabold text-white shadow-sm hover:bg-[#0284C7] disabled:opacity-50 cursor-pointer"
                  >
                    <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.australiaPracticeReplayTurnButton}</span>
                  </button>
                </div>

                <p className="text-base font-bold leading-relaxed">“{turnPromptText[language]}”</p>

                <div
                  className={`rounded-xl border p-3 text-xs space-y-1.5 ${
                    isNight ? 'border-[#38BDF8]/30 bg-[#10203E]' : 'border-[#BAE6FD] bg-[#F0F9FF]'
                  }`}
                >
                  <p className="font-extrabold text-[#0EA5E9]">{turnTaskText[language]}</p>
                  <p className="font-semibold opacity-90">
                    {copy.australiaPracticeUsefulExpressionsLabel}:{' '}
                    {activeTurn.usefulExpressions.join(' · ')}
                  </p>
                </div>

                {/* Collapsible Scaffold Inside Turn */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowStarters((p) => !p)}
                    className={`inline-flex min-h-[32px] items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold cursor-pointer ${subtlePanelClass}`}
                  >
                    <span>{copy.australiaPracticeShowStartersButton}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModel((p) => !p)}
                    className={`inline-flex min-h-[32px] items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold cursor-pointer ${subtlePanelClass}`}
                  >
                    <span>{copy.australiaPracticeShowModelButton}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowThaiTip((p) => !p)}
                    className={`inline-flex min-h-[32px] items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold cursor-pointer ${subtlePanelClass}`}
                  >
                    <span>{copy.australiaPracticeShowThaiTipButton}</span>
                  </button>
                </div>

                {showStarters && turnStarters.length > 0 && (
                  <div className={`rounded-xl border p-2.5 text-xs space-y-1 ${subtlePanelClass}`}>
                    {turnStarters.map((st, idx) => (
                      <p key={idx} className="font-semibold">
                        • {st[language]}
                      </p>
                    ))}
                  </div>
                )}

                {showModel && (
                  <div
                    className={`rounded-xl border p-2.5 text-xs flex flex-wrap items-center justify-between gap-2 ${
                      isNight
                        ? 'border-[#10B981]/35 bg-[#0D2B24] text-[#D1FAE5]'
                        : 'border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]'
                    }`}
                  >
                    <span className="font-semibold">{turnModel[language]}</span>
                    <button
                      type="button"
                      disabled={recordingState === 'recording' || recordingState === 'requesting'}
                      onClick={() => speakEnglish(turnModel.en)}
                      className="inline-flex min-h-[32px] items-center gap-1 rounded-lg bg-[#10B981] px-2.5 py-1 text-[11px] font-extrabold text-white hover:bg-[#059669] disabled:opacity-50 cursor-pointer"
                    >
                      <Volume2 className="h-3 w-3" aria-hidden="true" />
                      <span>{copy.australiaPracticeHearModelButton}</span>
                    </button>
                  </div>
                )}

                {showThaiTip && (
                  <p className="text-xs font-semibold text-[#D97706] dark:text-[#FBBF24]">
                    {activeTurn.thaiTip}
                  </p>
                )}
              </div>

              {/* Speaking Action Area: Mic Mode vs No-Mic Fallback Mode */}
              <div className={`rounded-2xl border p-4 sm:p-5 space-y-3 ${cardSurfaceClass}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {practiceMode === 'microphone_recording' ? (
                      <Mic className="h-4 w-4 text-[#0EA5E9]" aria-hidden="true" />
                    ) : (
                      <Headphones className="h-4 w-4 text-[#10B981]" aria-hidden="true" />
                    )}
                    <span className="text-xs sm:text-sm font-extrabold">
                      {practiceMode === 'microphone_recording'
                        ? copy.australiaPracticeStartMicButton
                        : copy.australiaPracticeNoMicTitle}
                    </span>
                  </div>

                  {practiceMode === 'microphone_recording' ? (
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('no_mic_rehearsal')}
                      className={`inline-flex min-h-[34px] items-center gap-1 rounded-xl border px-3 py-1 text-xs font-bold cursor-pointer ${subtlePanelClass}`}
                    >
                      <span>{copy.australiaPracticeSwitchNoMicButton}</span>
                    </button>
                  ) : micSupported ? (
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('microphone_recording')}
                      className={`inline-flex min-h-[34px] items-center gap-1 rounded-xl border px-3 py-1 text-xs font-bold cursor-pointer ${subtlePanelClass}`}
                    >
                      <span>{copy.australiaPracticeSwitchMicButton}</span>
                    </button>
                  ) : null}
                </div>

                {practiceMode === 'microphone_recording' ? (
                  <div className="space-y-3">
                    <p className={`text-xs ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                      {copy.australiaPracticeMicPrivacyNote}
                    </p>

                    {micError && (
                      <div
                        role="alert"
                        className="rounded-xl border border-[#F59E0B]/50 bg-[#FFFBEB] p-3 text-xs font-bold text-[#92400E] space-y-2"
                      >
                        <p>
                          {micError === 'permission_denied'
                            ? copy.australiaPracticeMicErrorDenied
                            : micError === 'not_found'
                              ? copy.australiaPracticeMicErrorNotFound
                              : micError === 'unsupported'
                                ? copy.australiaPracticeMicErrorUnsupported
                                : copy.australiaPracticeMicErrorUnknown}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleSwitchMode('no_mic_rehearsal')}
                          className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-[#0D9488] px-3 py-1.5 text-xs font-extrabold text-white hover:bg-[#0F766E] cursor-pointer"
                        >
                          <span>{copy.australiaPracticeSwitchNoMicButton}</span>
                        </button>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2.5">
                      {recordingState === 'recording' ? (
                        <>
                          <div
                            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-extrabold ${
                              isNight
                                ? 'border-[#F87171]/60 bg-[#450A0A] text-[#FECACA]'
                                : 'border-[#EF4444]/40 bg-[#FEF2F2] text-[#B91C1C]'
                            }`}
                          >
                            <span
                              className={`h-2.5 w-2.5 rounded-full bg-[#EF4444] ${
                                reducedMotion ? '' : 'opacity-90'
                              }`}
                              aria-hidden="true"
                            />
                            <span>{copy.australiaPracticeRecordingActiveLabel}</span>
                            <span className="font-mono-num">{formatElapsed(elapsedSec)}</span>
                          </div>

                          <button
                            type="button"
                            onClick={handleStopMicRecording}
                            className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#EF4444] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#DC2626] cursor-pointer"
                          >
                            <Square className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{copy.australiaPracticeStopMicButton}</span>
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          disabled={recordingState === 'requesting'}
                          onClick={handleStartMicRecording}
                          className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#0284C7] disabled:opacity-60 cursor-pointer"
                        >
                          <Mic className="h-4 w-4" aria-hidden="true" />
                          <span>
                            {currentTurnAudioUrl
                              ? copy.australiaPracticeRetryRecordingButton
                              : copy.australiaPracticeStartMicButton}
                          </span>
                        </button>
                      )}

                      {currentTurnAudioUrl && recordingState !== 'recording' && (
                        <>
                          <button
                            type="button"
                            onClick={handlePlaybackRecording}
                            className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-4 py-2 text-xs font-extrabold cursor-pointer ${
                              isNight
                                ? 'border-[#38BDF8]/50 bg-[#10203E] text-[#BAE6FD]'
                                : 'border-[#BAE6FD] bg-[#F0F9FF] text-[#0369A1]'
                            }`}
                          >
                            {isPlayingBack ? (
                              <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                            ) : (
                              <Play className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                            <span>
                              {isPlayingBack
                                ? copy.australiaPracticeStopPlaybackButton
                                : copy.australiaPracticePlaybackButton}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={handleRetryCurrentTurn}
                            className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold cursor-pointer ${subtlePanelClass}`}
                          >
                            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{copy.australiaPracticeRetryRecordingButton}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div
                      className={`rounded-xl border p-3 text-xs leading-relaxed ${
                        isNight
                          ? 'border-[#10B981]/35 bg-[#0D2B24] text-[#D1FAE5]'
                          : 'border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]'
                      }`}
                    >
                      {copy.australiaPracticeNoMicNotice}
                    </div>

                    <label
                      className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs font-bold cursor-pointer ${
                        noMicConfirmedTurnIds[activeTurn.turnId]
                          ? isNight
                            ? 'border-[#10B981] bg-[#0D2B24]/70'
                            : 'border-[#10B981] bg-[#ECFDF5]'
                          : subtlePanelClass
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(noMicConfirmedTurnIds[activeTurn.turnId])}
                        onChange={(e) => {
                          onPlaySfx('select');
                          setNoMicConfirmedTurnIds((prev) => ({
                            ...prev,
                            [activeTurn.turnId]: e.target.checked,
                          }));
                        }}
                        className="mt-0.5 h-4 w-4 accent-[#10B981]"
                      />
                      <span>{copy.australiaPracticeNoMicConfirmCheck}</span>
                    </label>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-black/10 dark:border-white/10">
                  <button
                    type="button"
                    disabled={!canConfirmCurrentTurn}
                    onClick={handleConfirmTurn}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#10B981] px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white hover:bg-[#059669] disabled:opacity-45 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    <span>{copy.australiaPracticeAcceptTurnButton}</span>
                  </button>

                  {allTurnsDone && (
                    <button
                      type="button"
                      disabled={recordingState === 'recording' || recordingState === 'requesting'}
                      onClick={() => {
                        stopSpeech();
                        stopPlayback();
                        onPlaySfx('click');
                        setStep('review');
                      }}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#0EA5E9] px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white hover:bg-[#0284C7] cursor-pointer"
                    >
                      <span>{copy.australiaPracticeProceedReviewButton}</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>

              {allTurnsDone && (
                <div
                  className={`rounded-2xl border p-4 flex flex-wrap items-center justify-between gap-3 ${
                    isNight
                      ? 'border-[#10B981]/45 bg-[#0D2B24] text-[#D1FAE5]'
                      : 'border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold">{npcEntry.name}</p>
                    <p className="mt-0.5 text-sm font-bold">
                      “{mission.closingNpcLine[language]}”
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakEnglish(mission.closingNpcLine.en)}
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#10B981] px-3.5 py-2 text-xs font-extrabold text-white hover:bg-[#059669] cursor-pointer shrink-0"
                  >
                    <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.australiaPracticeHearClosingButton}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-4">
              <div className={`rounded-2xl border p-4 sm:p-5 space-y-3 ${cardSurfaceClass}`}>
                <h3 className="font-display text-base sm:text-lg font-extrabold">
                  {copy.australiaPracticeReviewTitle}
                </h3>

                {/* Honest Disclaimer — No fake AI scoring or fake transcripts */}
                <div
                  className={`rounded-xl border p-3 text-xs font-semibold flex items-start gap-2 ${
                    isNight
                      ? 'border-[#38BDF8]/35 bg-[#10203E] text-[#BAE6FD]'
                      : 'border-[#BAE6FD] bg-[#F0F9FF] text-[#0369A1]'
                  }`}
                >
                  <Info className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{copy.australiaPracticeReviewDisclaimer}</span>
                </div>

                {/* Turn Practice Summary */}
                <div className="grid sm:grid-cols-3 gap-2">
                  {mission.turns.map((turn) => {
                    const modeUsed = completedTurnModes[turn.turnId] ?? 'no_mic_rehearsal';
                    return (
                      <div key={turn.turnId} className={`rounded-xl border p-3 text-xs ${subtlePanelClass}`}>
                        <p className="font-extrabold">
                          {copy.australiaPracticeTurnProgressLabel} {turn.turnNumber}
                        </p>
                        <p className="mt-1 font-semibold opacity-85">
                          {modeUsed === 'microphone_recording'
                            ? copy.australiaPracticeEvidenceBadgeMic
                            : copy.australiaPracticeEvidenceBadgeNoMic}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Self-Reflection Checklist */}
                <div className="space-y-2 pt-1">
                  {AUSTRALIA_PRACTICE_REFLECTION_ITEMS.map((item) => {
                    const checked = reflectionChecks[item.key];
                    return (
                      <label
                        key={item.key}
                        className={`flex items-start gap-3 rounded-xl border p-3 text-xs sm:text-sm font-semibold cursor-pointer ${
                          checked
                            ? isNight
                              ? 'border-[#10B981] bg-[#0D2B24]/65 text-[#D1FAE5]'
                              : 'border-[#10B981] bg-[#ECFDF5] text-[#065F46]'
                            : subtlePanelClass
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            onPlaySfx('select');
                            setReflectionChecks((prev) => ({
                              ...prev,
                              [item.key]: e.target.checked,
                            }));
                          }}
                          className="mt-0.5 h-4 w-4 accent-[#10B981]"
                        />
                        <span>
                          {difficultyMode === 'b1'
                            ? item.labelB1[language]
                            : item.labelA2[language]}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {reflectionSelectedCount < 1 && (
                  <p className="text-xs font-bold text-[#D97706] dark:text-[#FBBF24]">
                    {copy.australiaPracticeSelectAtLeastOneCheck}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('click');
                    setStep('speak');
                  }}
                  className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${subtlePanelClass}`}
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  <span>{copy.australiaPracticeStepSpeak}</span>
                </button>

                <button
                  type="button"
                  disabled={reflectionSelectedCount < 1}
                  onClick={handleCompleteMission}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#10B981] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#059669] disabled:opacity-45 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  <span>{copy.australiaPracticeCompleteMissionButton}</span>
                </button>
              </div>
            </div>
          )}

          {step === 'complete' && (
            <div className="space-y-4">
              <AustraliaSceneHeroBanner
                landmarkId={mission.landmarkId}
                title={copy.australiaPracticeCompletedTitle}
                subtitle={`${npcEntry.name} · ${landmark.title[language]}`}
                badgeLabel={feedbackResult.reviewTypeLabel[language]}
                accentColor="#00BFA5"
                isNight={isNight}
                compact={true}
              />

              <div
                className={`rounded-2xl border p-5 space-y-3 shadow-sm ${
                  isNight
                    ? 'border-[#00BFA5]/50 bg-[#0D2B24] text-[#ECFDF5]'
                    : 'border-[#00BFA5] bg-[#E6FAF6] text-[#065F46]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AustraliaNpcPortraitSVG
                    npcId={mission.npcId}
                    className="h-12 w-12 shrink-0 rounded-2xl shadow-sm"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#00BFA5]" aria-hidden="true" />
                      <h3 className="font-display text-lg font-extrabold">
                        {copy.australiaPracticeCompletedTitle}
                      </h3>
                    </div>
                    <p className="text-xs font-bold opacity-90">
                      {feedbackResult.reviewTypeLabel[language]}
                    </p>
                  </div>
                </div>

                <p className="text-xs font-semibold opacity-90">
                  {feedbackResult.evidenceSummary[language]}
                </p>

                <div
                  className={`rounded-xl border p-3.5 text-xs sm:text-sm leading-relaxed font-semibold ${
                    isNight
                      ? 'border-white/15 bg-[#091F1A] text-[#D1FAE5]'
                      : 'border-[#99F6E4] bg-white text-[#065F46]'
                  }`}
                >
                  <p>{feedbackResult.strengthNote[language]}</p>
                  <p className="mt-2 font-bold">{feedbackResult.nextStepNote[language]}</p>
                </div>

                <p className="text-xs font-bold">
                  {predictedWillCompleteAllFive || completedPracticeCount >= totalMissions
                    ? `+${AUSTRALIA_PRACTICE_XP_REWARD} XP · ${copy.australiaPracticePerformUnlockedTitle}`
                    : copy.australiaPracticeXpRewardOnceNote}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleReplayMission}
                  className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${subtlePanelClass}`}
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  <span>{copy.australiaPracticeReplayMissionButton}</span>
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#168FE5] px-5 py-2.5 text-sm font-extrabold text-white shadow-sm hover:bg-[#0284C7] cursor-pointer"
                >
                  <span>{copy.australiaPracticeReturnCityButton}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
