import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Compass,
  Eye,
  EyeOff,
  Headphones,
  Info,
  Lightbulb,
  MapPin,
  MessageCircle,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Square,
  Stamp,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import type {
  AppLanguage,
  AustraliaPerformChallengeRecord,
  AustraliaPerformPracticeMode,
  AustraliaPerformReflectionState,
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
  AUSTRALIA_PERFORM_CHALLENGES,
  AUSTRALIA_PERFORM_CHALLENGE_ORDER,
  AUSTRALIA_PERFORM_REFLECTION_ITEMS,
  AUSTRALIA_PERFORM_XP_REWARD,
  TOTAL_AUSTRALIA_MISSION_XP,
  buildAustraliaPerformSummaryFeedback,
  getAustraliaPerformChallengeSpec,
} from '../../data/australiaPerform';
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
  EgyptNextPreviewCard,
  SYDNEY_CELEBRATION_HERO_IMAGE,
} from './AustraliaPerformArtwork';
import { AustraliaSydneyStampSVG } from '../common/AustraliaSydneyStampSVG';

export type AustraliaPerformModalView =
  | { kind: 'challenge'; landmarkId: AustraliaLandmarkId }
  | { kind: 'reflection' }
  | { kind: 'celebration' };

type ReflectionDraftKey = keyof Omit<AustraliaPerformReflectionState, 'completedAt'>;

export interface AustraliaPerformReflectionDraft {
  selectedChoices: Record<ReflectionDraftKey, string>;
  customNotes: Record<ReflectionDraftKey, string>;
}

interface AustraliaPerformModalProps {
  initialView: AustraliaPerformModalView;
  language: AppLanguage;
  appearance: ResolvedAppearance;
  reducedMotion: boolean;
  alreadyCompletedChallenge: boolean;
  completedPerformCount: number;
  allFiveChallengesDone: boolean;
  attemptPerformCompleted: boolean;
  performAlreadyRewarded: boolean;
  completedAt?: string;
  currentTotalXp: number;
  builtDialogues: Record<string, string>;
  performEvidence: Record<string, AustraliaPerformChallengeRecord>;
  existingReflection?: AustraliaPerformReflectionState;
  reflectionDraft?: AustraliaPerformReflectionDraft;
  canReplayCountry: boolean;
  difficultyMode: AustraliaDifficultyMode;
  onDifficultyChange: (mode: AustraliaDifficultyMode) => void;
  onReflectionDraftChange?: (draft: AustraliaPerformReflectionDraft) => void;
  onReflectionExitedWithoutSubmit?: () => void;
  onCompleteChallenge: (
    landmarkId: AustraliaLandmarkId,
    record: AustraliaPerformChallengeRecord,
  ) => void;
  onCompletePerformMission: (
    reflection: AustraliaPerformReflectionState,
  ) => { firstCompletion: boolean };
  onClose: () => void;
  onViewPassport: () => void;
  onReturnWorldMap: () => void;
  onRequestReplayCountry?: () => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'mode' | 'reward') => void;
}

type ChallengeStep = 'briefing' | 'interact' | 'respond' | 'review' | 'complete';

const SPARKLE_SPOTS: readonly { left: string; top: string; delay: string }[] = [
  { left: '8%', top: '16%', delay: '0s' },
  { left: '19%', top: '72%', delay: '0.35s' },
  { left: '34%', top: '12%', delay: '0.6s' },
  { left: '52%', top: '80%', delay: '0.25s' },
  { left: '68%', top: '14%', delay: '0.8s' },
  { left: '84%', top: '26%', delay: '0.45s' },
  { left: '91%', top: '68%', delay: '0.95s' },
];

function formatElapsed(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function AustraliaPerformModal({
  initialView,
  language,
  appearance,
  reducedMotion,
  alreadyCompletedChallenge: _alreadyCompletedChallenge,
  completedPerformCount,
  allFiveChallengesDone,
  attemptPerformCompleted,
  performAlreadyRewarded,
  completedAt,
  currentTotalXp,
  builtDialogues,
  performEvidence,
  existingReflection,
  reflectionDraft,
  canReplayCountry,
  difficultyMode,
  onDifficultyChange,
  onReflectionDraftChange,
  onReflectionExitedWithoutSubmit,
  onCompleteChallenge,
  onCompletePerformMission,
  onClose,
  onViewPassport,
  onReturnWorldMap,
  onRequestReplayCountry,
  onPlaySfx,
}: AustraliaPerformModalProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';

  const [viewMode, setViewMode] = useState<AustraliaPerformModalView['kind']>(() => {
    if (
      initialView.kind === 'celebration' &&
      !attemptPerformCompleted &&
      !performAlreadyRewarded &&
      !existingReflection
    ) {
      return allFiveChallengesDone ? 'reflection' : 'challenge';
    }
    return initialView.kind;
  });
  const activeLandmarkId: AustraliaLandmarkId =
    initialView.kind === 'challenge' ? initialView.landmarkId : 'circular_quay_plaza';
  const challenge =
    getAustraliaPerformChallengeSpec(activeLandmarkId) ?? AUSTRALIA_PERFORM_CHALLENGES[0];
  const landmark =
    AUSTRALIA_LANDMARKS.find((l) => l.id === challenge.landmarkId) ?? AUSTRALIA_LANDMARKS[0];
  const npcEntry = AUSTRALIA_NPC_DIALOGUES[challenge.npcId];
  const builtDialogue = builtDialogues[challenge.landmarkId];
  const totalChallenges = AUSTRALIA_PERFORM_CHALLENGES.length;

  // Challenge workflow state
  const [step, setStep] = useState<ChallengeStep>('briefing');
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [completedTurnModes, setCompletedTurnModes] = useState<
    Record<string, AustraliaPerformPracticeMode>
  >({});

  // Reduced-scaffolding optional drawers (default collapsed in Stage 4 PERFORM)
  const [showBuildScript, setShowBuildScript] = useState(false);
  const [usedScriptPreview, setUsedScriptPreview] = useState(false);
  const [showVocab, setShowVocab] = useState(false);
  const [showStarters, setShowStarters] = useState(false);
  const [showStrategy, setShowStrategy] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Audio / Mic state
  const micSupported = isMicrophoneRecordingSupported();
  const [practiceMode, setPracticeMode] = useState<AustraliaPerformPracticeMode>(
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
  const [recordingWarning, setRecordingWarning] = useState(false);
  const [submittedChallengeRecord, setSubmittedChallengeRecord] =
    useState<AustraliaPerformChallengeRecord | null>(null);

  // Final Guided Reflection state (5 required items; A2 preset selection + optional B1 note)
  const [selectedReflectionChoices, setSelectedReflectionChoices] = useState<
    Record<ReflectionDraftKey, string>
  >(
    () =>
      reflectionDraft?.selectedChoices ?? {
        easiestPart: '',
        mostChallengingPart: '',
        keptConversationGoing: '',
        usefulExpression: '',
        nextImprovement: '',
      },
  );
  const [customReflectionNotes, setCustomReflectionNotes] = useState<
    Record<ReflectionDraftKey, string>
  >(
    () =>
      reflectionDraft?.customNotes ?? {
        easiestPart: existingReflection?.easiestPart ?? '',
        mostChallengingPart: existingReflection?.mostChallengingPart ?? '',
        keptConversationGoing: existingReflection?.keptConversationGoing ?? '',
        usefulExpression: existingReflection?.usefulExpression ?? '',
        nextImprovement: existingReflection?.nextImprovement ?? '',
      },
  );

  // Track celebration banner / firstCompletion state
  const [celebrationFirstReward, setCelebrationFirstReward] = useState<boolean>(false);
  const [celebrationHeroFailed, setCelebrationHeroFailed] = useState(false);
  const [savedReflection, setSavedReflection] = useState<
    AustraliaPerformReflectionState | undefined
  >(existingReflection);

  // Transient refs for cleanup (no audio stored in localStorage)
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

  // Reset when opened with a new initialView target
  useEffect(() => {
    releaseAllRecordings();
    stopSpeech();
    if (
      initialView.kind === 'celebration' &&
      !attemptPerformCompleted &&
      !performAlreadyRewarded &&
      !existingReflection
    ) {
      setViewMode(allFiveChallengesDone ? 'reflection' : 'challenge');
    } else {
      setViewMode(initialView.kind);
    }
    setStep('briefing');
    setCurrentTurnIndex(0);
    setCompletedTurnModes({});
    setNoMicConfirmedTurnIds({});
    setMicError(null);
    setRecordingWarning(false);
    setShowBuildScript(false);
    setUsedScriptPreview(false);
    setShowVocab(false);
    setShowStarters(false);
    setShowStrategy(false);
    setShowHint(false);
    setSubmittedChallengeRecord(null);
    // Intentionally sync only when initialView identity changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialView.kind, initialView.kind === 'challenge' ? initialView.landmarkId : 'none']);

  useEffect(() => {
    onReflectionDraftChange?.({
      selectedChoices: selectedReflectionChoices,
      customNotes: customReflectionNotes,
    });
  }, [customReflectionNotes, onReflectionDraftChange, selectedReflectionChoices]);

  useEffect(() => {
    return () => {
      releaseAllRecordings();
      stopSpeech();
    };
  }, [releaseAllRecordings, stopSpeech]);

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
    if (viewMode === 'reflection' && !attemptPerformCompleted && !savedReflection) {
      onReflectionExitedWithoutSubmit?.();
    }
    onPlaySfx('click');
    onClose();
  }, [
    attemptPerformCompleted,
    onClose,
    onPlaySfx,
    onReflectionExitedWithoutSubmit,
    releaseAllRecordings,
    savedReflection,
    stopSpeech,
    viewMode,
  ]);

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

  const activeTurn = challenge.turns[currentTurnIndex] ?? challenge.turns[0];
  const currentTurnAudioUrl = turnAudioUrls[activeTurn.turnId] ?? null;
  const allTurnsDone = challenge.turns.every((t) => Boolean(completedTurnModes[t.turnId]));

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

  const handleSwitchMode = (nextMode: AustraliaPerformPracticeMode) => {
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
    const modeUsed: AustraliaPerformPracticeMode =
      practiceMode === 'microphone_recording' && Boolean(currentTurnAudioUrl)
        ? 'microphone_recording'
        : 'no_mic_rehearsal';

    setCompletedTurnModes((prev) => ({
      ...prev,
      [activeTurn.turnId]: modeUsed,
    }));
    onPlaySfx('select');

    if (currentTurnIndex < challenge.turns.length - 1) {
      const nextIndex = currentTurnIndex + 1;
      const nextTurn = challenge.turns[nextIndex];
      setCurrentTurnIndex(nextIndex);
      setMicError(null);
      setElapsedSec(0);
      setRecordingState(turnAudioUrls[nextTurn.turnId] ? 'recorded' : 'idle');
      setShowHint(false);
      setShowVocab(false);
      setShowStarters(false);
      setShowStrategy(false);
    }
  };

  const canConfirmCurrentTurn =
    practiceMode === 'microphone_recording'
      ? Boolean(currentTurnAudioUrl) &&
        recordingState !== 'recording' &&
        recordingState !== 'requesting'
      : Boolean(noMicConfirmedTurnIds[activeTurn.turnId]);

  const allChallengesReadyForReflection =
    allFiveChallengesDone || completedPerformCount >= totalChallenges;

  const celebrationUnlocked = Boolean(
    attemptPerformCompleted || performAlreadyRewarded || savedReflection,
  );

  const displayPerformCount = celebrationUnlocked
    ? totalChallenges
    : Math.min(completedPerformCount, totalChallenges - 1);

  const handleSaveChallenge = () => {
    if (!allTurnsDone) return;
    stopSpeech();
    stopPlayback();

    const allTurnsUsedMic = challenge.turns.every(
      (t) => completedTurnModes[t.turnId] === 'microphone_recording',
    );
    const record: AustraliaPerformChallengeRecord = {
      practiceMode: allTurnsUsedMic ? 'microphone_recording' : 'no_mic_rehearsal',
      completedTurnIds: challenge.turns.map((t) => t.turnId),
      difficultyUsed: difficultyMode,
      usedScriptPreview,
      completedAt: new Date().toISOString(),
    };

    const completesAllRequiredChallenges = AUSTRALIA_PERFORM_CHALLENGE_ORDER.every(
      (id) => id === challenge.id || Boolean(performEvidence[id]),
    );

    releaseAllRecordings();
    onPlaySfx('reward');
    onCompleteChallenge(challenge.id, record);
    setSubmittedChallengeRecord(record);
    if (completesAllRequiredChallenges && !attemptPerformCompleted) {
      // Seamlessly transition straight into mandatory Self-Reflection without closing modal
      setViewMode('reflection');
    } else {
      setStep('complete');
    }
  };

  const handleReplayCurrentChallenge = () => {
    releaseAllRecordings();
    stopSpeech();
    onPlaySfx('click');
    setCurrentTurnIndex(0);
    setCompletedTurnModes({});
    setNoMicConfirmedTurnIds({});
    setMicError(null);
    setRecordingWarning(false);
    setSubmittedChallengeRecord(null);
    setStep('briefing');
  };

  // Reflection helpers
  const getReflectionValue = (key: ReflectionDraftKey): string => {
    const custom = customReflectionNotes[key].trim();
    if (custom.length >= 2) return custom.slice(0, 180);
    return selectedReflectionChoices[key];
  };

  const isReflectionComplete = AUSTRALIA_PERFORM_REFLECTION_ITEMS.every(
    (item) => getReflectionValue(item.key).trim().length >= 2,
  );

  const handleSubmitReflection = () => {
    if (!isReflectionComplete || !allChallengesReadyForReflection) return;
    stopSpeech();
    stopPlayback();
    const reflectionState: AustraliaPerformReflectionState = {
      easiestPart: getReflectionValue('easiestPart'),
      mostChallengingPart: getReflectionValue('mostChallengingPart'),
      keptConversationGoing: getReflectionValue('keptConversationGoing'),
      usefulExpression: getReflectionValue('usefulExpression'),
      nextImprovement: getReflectionValue('nextImprovement'),
      completedAt: new Date().toISOString(),
    };
    const result = onCompletePerformMission(reflectionState);
    setSavedReflection(reflectionState);
    setCelebrationFirstReward(result.firstCompletion);
    onPlaySfx('reward');
    setViewMode('celebration');
  };

  const cardSurfaceClass = isNight
    ? 'border-white/15 bg-[#13203E] text-[#F8FAFC]'
    : 'border-[#BAE6FD] bg-white text-[#1E2E46]';

  const subtlePanelClass = isNight
    ? 'border-white/12 bg-[#0E172E] text-[#E2E8F0]'
    : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#334155]';

  const renderQuickReferenceCard = () => {
    if (challenge.usesCafeMenu) {
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

    if (challenge.usesVisitorBoard) {
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

    if (challenge.fictionalTransitCard) {
      return (
        <div className={`rounded-2xl border p-3.5 ${subtlePanelClass}`}>
          <div className="flex items-start gap-2.5">
            <MapPin className="h-4 w-4 shrink-0 text-[#0EA5E9] mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-xs font-extrabold text-[#0EA5E9]">
                {challenge.fictionalTransitCard.lineName[language]}
              </p>
              <p className="mt-0.5 text-xs font-semibold leading-relaxed">
                {challenge.fictionalTransitCard.stopNote[language]}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Evidence tallies for summary feedback
  const effectiveEvidenceList = Object.values(performEvidence);
  const micChallengesCount = effectiveEvidenceList.filter(
    (e) => e.practiceMode === 'microphone_recording',
  ).length;
  const noMicChallengesCount = effectiveEvidenceList.filter(
    (e) => e.practiceMode === 'no_mic_rehearsal',
  ).length;
  const usedScriptCount = effectiveEvidenceList.filter((e) => e.usedScriptPreview).length;

  const summaryFeedback = buildAustraliaPerformSummaryFeedback({
    reflection: savedReflection ?? {
      easiestPart: getReflectionValue('easiestPart') || 'Small talk & greetings',
      mostChallengingPart: getReflectionValue('mostChallengingPart') || 'Detour clarification',
      keptConversationGoing: getReflectionValue('keptConversationGoing') || 'Follow-up questions',
      usefulExpression: getReflectionValue('usefulExpression') || 'Could you repeat that?',
      nextImprovement: getReflectionValue('nextImprovement') || 'Speak with confidence',
    },
    micChallengesCount,
    noMicChallengesCount,
    usedScriptPreviewCount: usedScriptCount,
  });

  const stepTabs: { id: ChallengeStep; label: string }[] = [
    { id: 'briefing', label: copy.australiaPerformStepBriefing },
    { id: 'interact', label: copy.australiaPerformStepInteract },
    { id: 'respond', label: copy.australiaPerformStepRespond },
    { id: 'review', label: copy.australiaPerformStepReview },
    { id: 'complete', label: copy.australiaPerformStepComplete },
  ];

  const turnNpcLine = difficultyMode === 'b1' ? activeTurn.npcLineB1 : activeTurn.npcLineA2;
  const turnTask =
    difficultyMode === 'b1' ? activeTurn.communicativeTaskB1 : activeTurn.communicativeTaskA2;
  const turnStarters =
    difficultyMode === 'b1' ? activeTurn.sentenceStartersB1 : activeTurn.sentenceStartersA2;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="australia-perform-modal-title"
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
        {/* Top Modal Header */}
        <div
          className={`border-b px-4 py-3.5 sm:px-6 ${
            viewMode === 'celebration'
              ? isNight
                ? 'border-[#F2C66D]/35 bg-gradient-to-r from-[#1A294B] via-[#13354C] to-[#292214]'
                : 'border-[#F2C66D]/50 bg-gradient-to-r from-[#FFFBEB] via-[#E0F2FE] to-[#ECFDF5]'
              : isNight
                ? 'border-white/12 bg-gradient-to-r from-[#17284E] via-[#132C52] to-[#0E3F53]'
                : 'border-[#BAE6FD] bg-gradient-to-r from-[#E0F2FE] via-[#F0F9FF] to-[#E6FAF6]'
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              {viewMode === 'challenge' ? (
                <div
                  className={`rounded-2xl p-1 shadow-md ${
                    isNight
                      ? 'bg-[#0B1429] ring-1 ring-[#38BDF8]/40'
                      : 'bg-white ring-1 ring-[#168FE5]/20'
                  }`}
                >
                  <AustraliaNpcPortraitSVG
                    npcId={challenge.npcId}
                    className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-xl"
                  />
                </div>
              ) : (
                <div className="shrink-0">
                  <AustraliaContextObjectSVG
                    propId="ambassador_emblem"
                    className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl shadow-md"
                  />
                </div>
              )}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center rounded-md bg-[#0EA5E9] px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-white shadow-sm">
                    {viewMode === 'celebration'
                      ? copy.australiaPerformCelebrationBadge
                      : copy.australiaPerformMissionBadge}
                  </span>
                  {viewMode === 'challenge' && challenge.isHelpPointReuse && (
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
                  id="australia-perform-modal-title"
                  className="mt-1 font-display text-base sm:text-lg font-extrabold leading-tight truncate"
                >
                  {viewMode === 'challenge'
                    ? challenge.title[language]
                    : viewMode === 'reflection'
                      ? copy.australiaPerformReflectionHeading
                      : copy.australiaPerformAmbassadorTitle}
                </h2>

                <p className={`text-xs truncate ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                  {viewMode === 'challenge' ? (
                    <>
                      {npcEntry.name} · {landmark.title[language]} ·{' '}
                      <span className="font-mono-num font-bold text-[#0EA5E9] dark:text-[#38BDF8]">
                        {displayPerformCount}/{totalChallenges}
                      </span>
                    </>
                  ) : viewMode === 'reflection' ? (
                    <>
                      {copy.australiaPerformReflectionSubtitle} ·{' '}
                      <span className="font-mono-num font-bold text-[#D97706] dark:text-[#FBBF24]">
                        {displayPerformCount}/{totalChallenges}
                      </span>
                    </>
                  ) : (
                    countrySubtitleLine(language, celebrationUnlocked)
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {viewMode !== 'celebration' && (
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
              )}

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

          {viewMode === 'challenge' && (
            <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {stepTabs.map((tab, idx) => {
                const currentIdx = stepTabs.findIndex((s) => s.id === step);
                const isCurrent = tab.id === step;
                const isDone =
                  idx < currentIdx || (tab.id === 'complete' && submittedChallengeRecord !== null);
                const canJump =
                  tab.id !== 'complete' &&
                  step !== 'complete' &&
                  recordingState !== 'recording' &&
                  recordingState !== 'requesting' &&
                  (tab.id === 'briefing' ||
                    tab.id === 'interact' ||
                    tab.id === 'respond' ||
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
          )}
        </div>

        {recordingWarning && (
          <div
            role="status"
            className="border-b border-[#F59E0B]/40 bg-[#FFFBEB] px-4 py-2 text-xs font-bold text-[#92400E]"
          >
            {copy.australiaPracticeRecordingDeferredNotice}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {viewMode === 'challenge' && step === 'briefing' && (
            <div className="space-y-4">
              <AustraliaSceneHeroBanner
                landmarkId={challenge.landmarkId}
                title={challenge.scenarioName[language]}
                subtitle={`${npcEntry.name} · ${landmark.title[language]}`}
                badgeLabel={landmark.districtBadge[language]}
                accentColor={landmark.accentColor}
                isNight={isNight}
              />

              <div className={`rounded-2xl border p-4 sm:p-5 space-y-3.5 shadow-sm ${cardSurfaceClass}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold text-[#0EA5E9]">
                      {challenge.locationName[language]}
                    </p>
                    <h3 className="mt-1 font-display text-base sm:text-lg font-extrabold">
                      {challenge.communicationGoal[language]}
                    </h3>
                    <p className={`mt-1.5 text-xs sm:text-sm leading-relaxed ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                      {challenge.briefingSummary[language]}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {challenge.contextProps.map((propId) => (
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

                <div
                  className={`rounded-xl border p-3 text-xs font-semibold flex items-start gap-2 ${
                    isNight
                      ? 'border-[#F2C66D]/35 bg-[#2A2215] text-[#FDE68A]'
                      : 'border-[#FCD34D] bg-[#FFFBEB] text-[#92400E]'
                  }`}
                >
                  <Info className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{copy.australiaPerformNoAutoAnswerNote}</span>
                </div>

                {/* Optional Stage 2 BUILD Script Drawer */}
                {builtDialogue && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        onPlaySfx('select');
                        setShowBuildScript((prev) => {
                          const next = !prev;
                          if (next) setUsedScriptPreview(true);
                          return next;
                        });
                      }}
                      className={`inline-flex min-h-[38px] items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-extrabold cursor-pointer ${
                        showBuildScript
                          ? 'border-[#00BFA5] bg-[#00BFA5]/15 text-[#0F766E] dark:text-[#5EEAD4]'
                          : subtlePanelClass
                      }`}
                    >
                      {showBuildScript ? (
                        <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      <span>
                        {showBuildScript
                          ? copy.australiaPerformHideBuildScriptButton
                          : copy.australiaPerformShowBuildScriptButton}
                      </span>
                    </button>

                    {showBuildScript && (
                      <div
                        className={`rounded-xl border p-3 text-xs space-y-1 ${
                          isNight
                            ? 'border-[#00BFA5]/40 bg-[#0D2B24] text-[#D1FAE5]'
                            : 'border-[#00BFA5]/35 bg-[#E6FAF6] text-[#0F5132]'
                        }`}
                      >
                        <p className="font-extrabold">{copy.australiaPerformBuildScriptLabel}:</p>
                        <p className="text-sm font-bold">“{builtDialogue}”</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {renderQuickReferenceCard()}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <p className={`text-xs ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                  {challenge.turns.length} turns · CEFR {difficultyMode.toUpperCase()}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    onPlaySfx('click');
                    setStep('interact');
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#0EA5E9] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#0284C7] cursor-pointer"
                >
                  <span>{copy.australiaPerformBeginChallengeButton}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {viewMode === 'challenge' && (step === 'interact' || step === 'respond') && (
            <div className="space-y-4">
              {/* Turn Progress Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {challenge.turns.map((turn, idx) => {
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

                {step === 'respond' && (
                  <button
                    type="button"
                    disabled={recordingState === 'recording' || recordingState === 'requesting'}
                    onClick={() => {
                      stopSpeech();
                      onPlaySfx('click');
                      setStep('interact');
                    }}
                    className={`inline-flex min-h-[34px] items-center gap-1 rounded-xl border px-3 py-1 text-xs font-bold cursor-pointer ${subtlePanelClass}`}
                  >
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.australiaPerformBackToInteractButton}</span>
                  </button>
                )}
              </div>

              <AustraliaSceneHeroBanner
                landmarkId={challenge.landmarkId}
                title={`${npcEntry.name} · ${activeTurn.turnLabel[language]}`}
                subtitle={landmark.title[language]}
                badgeLabel={`${copy.australiaPracticeTurnProgressLabel} ${activeTurn.turnNumber}/${challenge.turns.length}`}
                accentColor={landmark.accentColor}
                isNight={isNight}
                compact={true}
              />

              {renderQuickReferenceCard()}

              {/* NPC Turn Card */}
              <div className={`rounded-2xl border p-4 sm:p-5 space-y-3 shadow-sm ${cardSurfaceClass}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <AustraliaNpcPortraitSVG
                      npcId={challenge.npcId}
                      className="h-10 w-10 rounded-xl shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="h-4 w-4 text-[#0EA5E9]" aria-hidden="true" />
                        <span className="text-xs font-extrabold text-[#0EA5E9]">
                          {npcEntry.name} · {activeTurn.turnLabel[language]}
                        </span>
                      </div>
                      <p className="text-[11px] opacity-75">{npcEntry.role[language]}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={recordingState === 'recording' || recordingState === 'requesting'}
                    onClick={() => speakEnglish(turnNpcLine.en)}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl bg-[#168FE5] px-3 py-1.5 text-xs font-extrabold text-white shadow-sm hover:bg-[#0284C7] disabled:opacity-50 cursor-pointer"
                  >
                    <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.australiaPracticeReplayTurnButton}</span>
                  </button>
                </div>

                <p className="text-base font-bold leading-relaxed">“{turnNpcLine[language]}”</p>

                <div
                  className={`rounded-xl border p-3 text-xs ${
                    isNight ? 'border-[#38BDF8]/30 bg-[#10203E]' : 'border-[#BAE6FD] bg-[#F0F9FF]'
                  }`}
                >
                  <p className="font-extrabold text-[#0EA5E9]">{turnTask[language]}</p>
                </div>

                {/* Reduced-Scaffolding Optional Toggles (never shows automatic full model answers) */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('select');
                      setShowVocab((p) => !p);
                    }}
                    className={`inline-flex min-h-[32px] items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                      showVocab
                        ? 'border-[#0EA5E9] bg-[#0EA5E9]/15 text-[#0EA5E9]'
                        : subtlePanelClass
                    }`}
                  >
                    <BookOpen className="h-3 w-3" aria-hidden="true" />
                    <span>{copy.australiaPerformVocabToggleLabel}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('select');
                      setShowStarters((p) => !p);
                    }}
                    className={`inline-flex min-h-[32px] items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                      showStarters
                        ? 'border-[#10B981] bg-[#10B981]/15 text-[#10B981]'
                        : subtlePanelClass
                    }`}
                  >
                    <span>{copy.australiaPerformStartersToggleLabel}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('select');
                      setShowStrategy((p) => !p);
                    }}
                    className={`inline-flex min-h-[32px] items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                      showStrategy
                        ? 'border-[#8B5CF6] bg-[#8B5CF6]/15 text-[#7C3AED] dark:text-[#C4B5FD]'
                        : subtlePanelClass
                    }`}
                  >
                    <Compass className="h-3 w-3" aria-hidden="true" />
                    <span>{copy.australiaPerformStrategyToggleLabel}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('select');
                      setShowHint((p) => !p);
                    }}
                    className={`inline-flex min-h-[32px] items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                      showHint
                        ? 'border-[#F59E0B] bg-[#F59E0B]/15 text-[#D97706]'
                        : subtlePanelClass
                    }`}
                  >
                    <Lightbulb className="h-3 w-3" aria-hidden="true" />
                    <span>
                      {showHint
                        ? copy.australiaPerformHintToggleHide
                        : copy.australiaPerformHintToggleShow}
                    </span>
                  </button>

                  {builtDialogue && (
                    <button
                      type="button"
                      onClick={() => {
                        onPlaySfx('select');
                        setShowBuildScript((prev) => {
                          const next = !prev;
                          if (next) setUsedScriptPreview(true);
                          return next;
                        });
                      }}
                      className={`inline-flex min-h-[32px] items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                        showBuildScript
                          ? 'border-[#00BFA5] bg-[#00BFA5]/15 text-[#0F766E]'
                          : subtlePanelClass
                      }`}
                    >
                      <span>
                        {showBuildScript
                          ? copy.australiaPerformHideBuildScriptButton
                          : copy.australiaPerformShowBuildScriptButton}
                      </span>
                    </button>
                  )}
                </div>

                {showVocab && (
                  <div className={`rounded-xl border p-2.5 text-xs ${subtlePanelClass}`}>
                    <p className="font-extrabold text-[#0EA5E9] mb-1">
                      {copy.australiaPerformVocabToggleLabel}
                    </p>
                    <p className="font-semibold">{activeTurn.usefulVocab.join(' · ')}</p>
                  </div>
                )}

                {showStarters && turnStarters.length > 0 && (
                  <div className={`rounded-xl border p-2.5 text-xs space-y-1 ${subtlePanelClass}`}>
                    {turnStarters.map((st, idx) => (
                      <p key={idx} className="font-semibold">
                        • {st[language]}
                      </p>
                    ))}
                  </div>
                )}

                {showStrategy && (
                  <div
                    className={`rounded-xl border p-2.5 text-xs ${
                      isNight
                        ? 'border-[#8B5CF6]/40 bg-[#1B1936] text-[#DDD6FE]'
                        : 'border-[#DDD6FE] bg-[#F5F3FF] text-[#5B21B6]'
                    }`}
                  >
                    <p className="font-extrabold">{copy.australiaPerformStrategyToggleLabel}:</p>
                    <p className="mt-0.5 font-semibold">{activeTurn.communicationStrategy[language]}</p>
                  </div>
                )}

                {showHint && (
                  <div
                    className={`rounded-xl border p-2.5 text-xs ${
                      isNight
                        ? 'border-[#F59E0B]/40 bg-[#2A2013] text-[#FDE68A]'
                        : 'border-[#FCD34D] bg-[#FFFBEB] text-[#92400E]'
                    }`}
                  >
                    <p className="font-semibold">{activeTurn.hintTip[language]}</p>
                  </div>
                )}

                {showBuildScript && builtDialogue && (
                  <div
                    className={`rounded-xl border p-2.5 text-xs ${
                      isNight
                        ? 'border-[#00BFA5]/40 bg-[#0D2B24] text-[#D1FAE5]'
                        : 'border-[#00BFA5]/35 bg-[#E6FAF6] text-[#0F5132]'
                    }`}
                  >
                    <p className="font-extrabold">{copy.australiaPerformBuildScriptLabel}:</p>
                    <p className="mt-0.5 font-bold">“{builtDialogue}”</p>
                  </div>
                )}
              </div>

              {step === 'interact' ? (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      stopSpeech();
                      onPlaySfx('click');
                      setStep('respond');
                    }}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#0EA5E9] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#0284C7] cursor-pointer"
                  >
                    <Mic className="h-4 w-4" aria-hidden="true" />
                    <span>{copy.australiaPerformProceedRespondButton}</span>
                  </button>
                </div>
              ) : (
                /* Step 3: RESPOND — Microphone Recording OR No-Mic Rehearsal */
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
                                className="h-2.5 w-2.5 rounded-full bg-[#EF4444]"
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
                        <span>{copy.australiaPerformProceedReviewButton}</span>
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {step === 'respond' && allTurnsDone && (
                <div
                  className={`rounded-2xl border p-4 flex flex-wrap items-center justify-between gap-3 ${
                    isNight
                      ? 'border-[#10B981]/45 bg-[#0D2B24] text-[#D1FAE5]'
                      : 'border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold">{npcEntry.name}</p>
                    <p className="mt-0.5 text-sm font-bold">“{challenge.npcClosingLine[language]}”</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakEnglish(challenge.npcClosingLine.en)}
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#10B981] px-3.5 py-2 text-xs font-extrabold text-white hover:bg-[#059669] cursor-pointer shrink-0"
                  >
                    <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.australiaPracticeHearClosingButton}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {viewMode === 'challenge' && step === 'review' && (
            <div className="space-y-4">
              <div className={`rounded-2xl border p-4 sm:p-5 space-y-3 ${cardSurfaceClass}`}>
                <h3 className="font-display text-base sm:text-lg font-extrabold">
                  {copy.australiaPerformReviewPromptLabel}
                </h3>

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

                <div className="grid sm:grid-cols-3 gap-2">
                  {challenge.turns.map((turn) => {
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

                <div
                  className={`rounded-xl border p-3.5 text-xs sm:text-sm font-semibold ${
                    isNight
                      ? 'border-[#10B981]/35 bg-[#0D2B24] text-[#D1FAE5]'
                      : 'border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]'
                  }`}
                >
                  {difficultyMode === 'b1'
                    ? challenge.completionEncouragementB1[language]
                    : challenge.completionEncouragementA2[language]}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('click');
                    setStep('respond');
                  }}
                  className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${subtlePanelClass}`}
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  <span>{copy.australiaPerformStepRespond}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveChallenge}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#10B981] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#059669] cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  <span>{copy.australiaPerformStepComplete}</span>
                </button>
              </div>
            </div>
          )}

          {viewMode === 'challenge' && step === 'complete' && (
            <div className="space-y-4">
              <AustraliaSceneHeroBanner
                landmarkId={challenge.landmarkId}
                title={challenge.title[language]}
                subtitle={`${npcEntry.name} · ${landmark.title[language]}`}
                badgeLabel={copy.australiaPerformCompletedBadge}
                accentColor="#00BFA5"
                isNight={isNight}
                compact={true}
              />

              <div
                className={`rounded-2xl border p-5 space-y-3 shadow-sm ${
                  isNight
                    ? 'border-[#00BFA5]/50 bg-[#0D2B24] text-[#ECFDF5]'
                    : 'border-[#00BFA5]/40 bg-[#E6FAF6] text-[#065F46]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-[#10B981]" aria-hidden="true" />
                  <p className="font-display text-base sm:text-lg font-extrabold">
                    {copy.australiaPerformCompletedBadge}
                  </p>
                </div>

                <p className="text-xs sm:text-sm font-semibold">
                  {difficultyMode === 'b1'
                    ? challenge.completionEncouragementB1[language]
                    : challenge.completionEncouragementA2[language]}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold">
                  <span className="rounded-lg bg-black/10 px-2.5 py-1 dark:bg-white/10">
                    {submittedChallengeRecord?.practiceMode === 'microphone_recording'
                      ? copy.australiaPracticeEvidenceBadgeMic
                      : copy.australiaPracticeEvidenceBadgeNoMic}
                  </span>
                  <span className="rounded-lg bg-black/10 px-2.5 py-1 dark:bg-white/10">
                    +0 XP · {allChallengesReadyForReflection
                      ? copy.australiaPerformObjectiveReflection
                      : copy.australiaPerformObjectiveInProgress}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleReplayCurrentChallenge}
                  className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${subtlePanelClass}`}
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.australiaPracticeReplayMissionButton}</span>
                </button>

                {allChallengesReadyForReflection ? (
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('reward');
                      setViewMode('reflection');
                    }}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2.5 font-display text-sm font-extrabold text-[#131E31] shadow hover:bg-[#f6d388] cursor-pointer"
                  >
                    <Award className="h-4 w-4" aria-hidden="true" />
                    <span>{copy.australiaPerformStartReflectionButton}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#0EA5E9] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#0284C7] cursor-pointer"
                  >
                    <span>{copy.australiaPracticeReturnCityButton}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* FINAL GUIDED REFLECTION VIEW */}
          {viewMode === 'reflection' && (
            <div className="space-y-4">
              {!celebrationUnlocked && (
                <div
                  className={`rounded-2xl border p-4 text-xs sm:text-sm font-bold flex items-start gap-2.5 ${
                    isNight
                      ? 'border-[#F2C66D]/45 bg-[#2A2215] text-[#FDE68A]'
                      : 'border-[#F59E0B]/45 bg-[#FFFBEB] text-[#92400E]'
                  }`}
                >
                  <Award className="h-4 w-4 shrink-0 mt-0.5 text-[#F59E0B]" aria-hidden="true" />
                  <span>{copy.australiaPerformReflectionGateNotice}</span>
                </div>
              )}

              <div
                className={`rounded-2xl border p-4 text-xs sm:text-sm font-semibold flex items-start gap-2.5 ${
                  isNight
                    ? 'border-[#38BDF8]/35 bg-[#10203E] text-[#BAE6FD]'
                    : 'border-[#BAE6FD] bg-[#F0F9FF] text-[#0369A1]'
                }`}
              >
                <Info className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{copy.australiaPracticeReviewDisclaimer}</span>
              </div>

              <div className="space-y-3.5">
                {AUSTRALIA_PERFORM_REFLECTION_ITEMS.map((item) => {
                  const chosenId = selectedReflectionChoices[item.key];
                  const customText = customReflectionNotes[item.key];
                  return (
                    <div
                      key={item.key}
                      className={`rounded-2xl border p-4 space-y-2.5 ${cardSurfaceClass}`}
                    >
                      <p className="font-display text-sm sm:text-base font-extrabold">
                        {difficultyMode === 'b1'
                          ? item.questionB1[language]
                          : item.questionA2[language]}
                      </p>

                      <div className="grid sm:grid-cols-2 gap-2">
                        {item.options.map((opt) => {
                          const optionValue = opt.label[language];
                          const isSelected = chosenId === optionValue && customText.trim().length < 2;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                onPlaySfx('select');
                                setSelectedReflectionChoices((prev) => ({
                                  ...prev,
                                  [item.key]: optionValue,
                                }));
                                setCustomReflectionNotes((prev) => ({
                                  ...prev,
                                  [item.key]: '',
                                }));
                              }}
                              className={`flex items-start gap-2 rounded-xl border p-3 text-left text-xs font-semibold transition-colors cursor-pointer ${
                                isSelected
                                  ? 'border-[#0EA5E9] bg-[#0EA5E9] text-white'
                                  : subtlePanelClass
                              }`}
                            >
                              <CheckCircle2
                                className={`h-4 w-4 shrink-0 mt-0.5 ${
                                  isSelected ? 'text-white' : 'opacity-40'
                                }`}
                                aria-hidden="true"
                              />
                              <span>{optionValue}</span>
                            </button>
                          );
                        })}
                      </div>

                      <input
                        type="text"
                        maxLength={180}
                        value={customText}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomReflectionNotes((prev) => ({
                            ...prev,
                            [item.key]: val,
                          }));
                        }}
                        placeholder={item.b1Placeholder[language]}
                        className={`w-full rounded-xl border px-3 py-2 text-xs font-medium ${
                          isNight
                            ? 'border-white/15 bg-[#0B1429] text-white placeholder:text-[#64748B]'
                            : 'border-[#CBD5E1] bg-[#FFFDF8] text-[#1E2E46] placeholder:text-[#94A3B8]'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {!isReflectionComplete && (
                <p className="text-xs font-bold text-[#D97706] dark:text-[#FBBF24]">
                  {copy.australiaPerformReflectionRequiredNote}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${subtlePanelClass}`}
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  <span>{copy.australiaPracticeReturnCityButton}</span>
                </button>

                <button
                  type="button"
                  disabled={!isReflectionComplete}
                  onClick={handleSubmitReflection}
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2.5 font-display text-sm font-extrabold text-[#131E31] shadow hover:bg-[#f6d388] disabled:opacity-45 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Award className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {performAlreadyRewarded
                      ? copy.australiaPerformFinishReplayButton
                      : copy.australiaPerformFinishReflectionButton}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* CELEBRATION CEREMONY VIEW (strictly gated behind canonical completion/submitted reflection) */}
          {viewMode === 'celebration' && celebrationUnlocked && (
            <div className="space-y-4">
              {/* Sydney Harbour Celebration Banner + Optional Subtle Sparkles */}
              <div className="relative overflow-hidden rounded-3xl border border-[#F2C66D]/50 shadow-xl">
                {!celebrationHeroFailed ? (
                  <img
                    src={SYDNEY_CELEBRATION_HERO_IMAGE}
                    alt={copy.australiaPerformAmbassadorTitle}
                    referrerPolicy="no-referrer"
                    onError={() => setCelebrationHeroFailed(true)}
                    className="h-40 sm:h-48 w-full object-cover"
                  />
                ) : (
                  <div className="h-40 sm:h-48 w-full bg-gradient-to-r from-[#168FE5] via-[#00BFA5] to-[#253B80]" />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#081229]/92 via-[#081229]/50 to-transparent" />

                {!reducedMotion &&
                  SPARKLE_SPOTS.map((spot, idx) => (
                    <span
                      key={idx}
                      aria-hidden="true"
                      className="vv-gold-sparkle pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-[#FFCC4D]"
                      style={{
                        left: spot.left,
                        top: spot.top,
                        animationDelay: spot.delay,
                      }}
                    />
                  ))}

                <div className="relative sm:absolute sm:inset-x-5 sm:bottom-4 p-4 sm:p-0 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#F2C66D] px-2.5 py-0.5 font-display text-[10px] font-extrabold text-[#131E31]">
                      <Award className="h-3 w-3" aria-hidden="true" />
                      <span>{copy.australiaPerformCelebrationBadge}</span>
                    </span>
                    <h3 className="mt-1 font-display text-lg sm:text-2xl font-extrabold text-white drop-shadow">
                      {copy.australiaPerformAmbassadorTitle}
                    </h3>
                    <p className="text-xs font-semibold text-[#E0F2FE]">
                      {celebrationFirstReward
                        ? copy.australiaPerformCelebrationSubtitle
                        : copy.australiaPerformCelebrationReplaySubtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Passport Stamp + Reward Breakdown Row */}
              <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
                <div
                  className={`flex flex-col items-center justify-center rounded-2xl border p-4 ${cardSurfaceClass}`}
                >
                  <AustraliaSydneyStampSVG
                    language={language}
                    appearance={appearance}
                    earned={true}
                    completedAt={completedAt ?? savedReflection?.completedAt}
                    sizeClass="h-32 w-32"
                  />
                  <p className="mt-2 font-display text-xs font-extrabold text-[#0EA5E9]">
                    stamp_australia_sydney
                  </p>
                </div>

                <div className={`rounded-2xl border p-4 space-y-3 ${cardSurfaceClass}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-display text-sm sm:text-base font-extrabold">
                      {summaryFeedback.headline[language]}
                    </p>
                    {celebrationFirstReward ? (
                      <span className="rounded-lg bg-[#F2C66D] px-2.5 py-1 font-mono-num text-xs font-extrabold text-[#131E31]">
                        +{AUSTRALIA_PERFORM_XP_REWARD} XP
                      </span>
                    ) : (
                      <span
                        className={`rounded-lg px-2.5 py-1 text-xs font-extrabold ${
                          isNight
                            ? 'bg-[#2ED6A3]/20 text-[#2ED6A3]'
                            : 'bg-[#ECFDF5] text-[#047857]'
                        }`}
                      >
                        {copy.replayNoExtraXpLabel}
                      </span>
                    )}
                  </div>

                  <p className={`text-xs leading-relaxed ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                    {summaryFeedback.strengthNote[language]}
                  </p>

                  <p className={`text-xs font-semibold ${isNight ? 'text-[#5EEAD4]' : 'text-[#0F766E]'}`}>
                    {summaryFeedback.nextStepNote[language]}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className={`rounded-xl border p-2.5 text-xs ${subtlePanelClass}`}>
                      <p className="opacity-75">{copy.australiaPerformTotalXpNote}</p>
                      <p className="font-mono-num text-sm font-extrabold text-[#0EA5E9]">
                        {TOTAL_AUSTRALIA_MISSION_XP} XP (50+50+50+{AUSTRALIA_PERFORM_XP_REWARD})
                      </p>
                    </div>
                    <div className={`rounded-xl border p-2.5 text-xs ${subtlePanelClass}`}>
                      <p className="opacity-75">{copy.australiaPerformCumulativeXpNote}</p>
                      <p className="font-mono-num text-sm font-extrabold text-[#F59E0B]">
                        {currentTotalXp} XP
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Honest Evidence Disclaimer */}
              <div
                className={`rounded-xl border px-3.5 py-2.5 text-xs font-semibold flex items-start gap-2 ${subtlePanelClass}`}
              >
                <Info className="h-4 w-4 shrink-0 mt-0.5 text-[#0EA5E9]" aria-hidden="true" />
                <span>{summaryFeedback.evidenceHonestyNote[language]}</span>
              </div>

              {/* Egypt Next Destination Preview Card (Unlocked — Coming Soon, Playable Disabled) */}
              <EgyptNextPreviewCard language={language} isNight={isNight} />

              {/* Ceremony Navigation Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('click');
                      handleClose();
                    }}
                    className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${subtlePanelClass}`}
                  >
                    <span>{copy.australiaPerformStaySydneyButton}</span>
                  </button>

                  {canReplayCountry && onRequestReplayCountry && (
                    <button
                      type="button"
                      onClick={() => {
                        onPlaySfx('click');
                        onRequestReplayCountry();
                      }}
                      className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${
                        isNight
                          ? 'border-[#24B8B0]/45 bg-[#18313D] text-[#E6FAF5] hover:bg-[#1E404F]'
                          : 'border-[#24B8B0]/35 bg-[#E9FBF7] text-[#0E7A74] hover:bg-[#D5F5EE]'
                      }`}
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{copy.australiaPerformReplayCountryButton}</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('select');
                      onViewPassport();
                    }}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#0EA5E9] px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white hover:bg-[#0284C7] cursor-pointer"
                  >
                    <Stamp className="h-4 w-4" aria-hidden="true" />
                    <span>{copy.australiaPerformViewPassportButton}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('click');
                      onReturnWorldMap();
                    }}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2.5 font-display text-xs sm:text-sm font-extrabold text-[#131E31] shadow hover:bg-[#f6d388] cursor-pointer"
                  >
                    <span>{copy.australiaPerformReturnMapButton}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function countrySubtitleLine(language: AppLanguage, completed: boolean): string {
  if (language === 'th') {
    return completed
      ? 'ซิดนีย์ ประเทศออสเตรเลีย · พิชิตครบทั้ง 4 ด่านแล้ว'
      : 'ซิดนีย์ ประเทศออสเตรเลีย';
  }
  return completed
    ? 'Sydney, Australia · All 4 Stages Complete'
    : 'Sydney, Australia · Final Stage Ceremony';
}
