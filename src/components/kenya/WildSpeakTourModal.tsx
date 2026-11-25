import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Binoculars,
  BookOpen,
  Camera,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Languages,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Square,
  Volume2,
  X,
} from 'lucide-react';
import type { AppLanguage, ResolvedAppearance } from '../../types/game';
import { GAME_COPY } from '../../data/i18n';
import { getKenyaDiscoveryTask } from '../../data/kenyaDiscovery';
import {
  KENYA_PRACTICE_XP_REWARD,
  KENYA_TOURIST_NPCS,
  type KenyaPracticeConversation,
  type PracticeSupportMode,
} from '../../data/kenyaPractice';
import type { KenyaLandmarkId } from '../../data/kenyaWorld';
import {
  isMicrophoneRecordingSupported,
  startTransientMicRecording,
  type ActiveRecordingHandle,
  type RecorderErrorCode,
} from '../../utils/audioRecorder';
import { KenyaWildlifeIllustrationSVG } from './KenyaWildlifeIllustrationSVG';
import {
  KenyaSafariHeaderBannerSVG,
  KenyaTouristPortraitSVG,
} from './KenyaMiniGameArtwork';

interface WildSpeakTourModalProps {
  conversation: KenyaPracticeConversation;
  totalCount: number;
  completedCount: number;
  language: AppLanguage;
  appearance: ResolvedAppearance;
  reducedMotion: boolean;
  savedBuiltSentence?: string;
  alreadyCompleted: boolean;
  onPlaySfx: (kind?: 'click' | 'select' | 'mode' | 'reward') => void;
  onSpeakText: (text: string, voiceOpts?: { pitch?: number; rate?: number }) => void;
  onStopSpeech: () => void;
  onCompleteConversation: (conversationId: KenyaLandmarkId) => boolean;
  onClose: () => void;
}

type TourStep = 'listen' | 'prepare' | 'speak' | 'review' | 'done';

function formatElapsed(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function WildSpeakTourModal({
  conversation,
  totalCount,
  completedCount,
  language,
  appearance,
  reducedMotion,
  savedBuiltSentence,
  alreadyCompleted,
  onPlaySfx,
  onSpeakText,
  onStopSpeech,
  onCompleteConversation,
  onClose,
}: WildSpeakTourModalProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';
  const npc = KENYA_TOURIST_NPCS[conversation.npcId];
  const discoveryTask = getKenyaDiscoveryTask(conversation.id);

  const [step, setStep] = useState<TourStep>('listen');
  const [supportMode, setSupportMode] = useState<PracticeSupportMode>(
    conversation.recommendedDefaultMode,
  );
  const [showHelpPanel, setShowHelpPanel] = useState(
    conversation.recommendedDefaultMode === 'guided',
  );
  const [revealModel, setRevealModel] = useState(
    conversation.recommendedDefaultMode === 'guided',
  );
  const [showThaiHelper, setShowThaiHelper] = useState(language === 'th');

  // Step 3: Recording or No-Mic state
  const micSupported = isMicrophoneRecordingSupported();
  const [noMicMode, setNoMicMode] = useState(!micSupported);
  const [recordingState, setRecordingState] = useState<
    'idle' | 'requesting' | 'recording' | 'recorded'
  >('idle');
  const [elapsedSec, setElapsedSec] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [micError, setMicError] = useState<RecorderErrorCode | null>(null);
  const [aloudConfirmed, setAloudConfirmed] = useState(false);

  // Step 4: Self-Reflection Checklist (never auto-completes without student reflection)
  const [checkAnswered, setCheckAnswered] = useState(false);
  const [checkFact, setCheckFact] = useState(false);
  const [checkClear, setCheckClear] = useState(false);
  const [checkConnector, setCheckConnector] = useState(false);

  // Step 5: Outcome celebration
  const [justFinishedAll, setJustFinishedAll] = useState(false);

  const recorderRef = useRef<ActiveRecordingHandle | null>(null);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  audioUrlRef.current = audioUrl;

  const stopPlayback = useCallback(() => {
    if (playbackAudioRef.current) {
      playbackAudioRef.current.pause();
      playbackAudioRef.current.currentTime = 0;
    }
    setIsPlayingBack(false);
  }, []);

  const releaseRecordingResources = useCallback(() => {
    stopPlayback();
    if (playbackAudioRef.current) {
      playbackAudioRef.current.removeAttribute('src');
    }
    if (recorderRef.current) {
      recorderRef.current.dispose();
      recorderRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setAudioUrl(null);
  }, [stopPlayback]);

  useEffect(() => {
    return () => {
      releaseRecordingResources();
      onStopSpeech();
    };
  }, [onStopSpeech, releaseRecordingResources]);

  useEffect(() => {
    if (recordingState !== 'recording') return;
    const id = window.setInterval(() => {
      setElapsedSec((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [recordingState]);

  const handleClose = useCallback(() => {
    releaseRecordingResources();
    onStopSpeech();
    onPlaySfx('click');
    onClose();
  }, [onClose, onPlaySfx, onStopSpeech, releaseRecordingResources]);

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

  const handleSelectMode = (mode: PracticeSupportMode) => {
    onPlaySfx('click');
    setSupportMode(mode);
    if (mode === 'guided') {
      setShowHelpPanel(true);
      setRevealModel(true);
    } else if (mode === 'supported') {
      setShowHelpPanel(true);
      setRevealModel(false);
    } else {
      setShowHelpPanel(false);
      setRevealModel(false);
    }
  };

  const handleSpeakQuestion = () => {
    onPlaySfx('click');
    onSpeakText(conversation.question.en, {
      pitch: npc.voicePitch,
      rate: npc.voiceRate,
    });
  };

  const handleSpeakModel = () => {
    onPlaySfx('click');
    onSpeakText(conversation.modelAnswer.en, { pitch: 1.0, rate: 0.92 });
  };

  const handleStartRecording = async () => {
    onStopSpeech();
    stopPlayback();
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
      setAudioUrl(null);
    }
    setMicError(null);
    setElapsedSec(0);
    setRecordingState('requesting');

    const handle = await startTransientMicRecording({
      onRecordingStarted: () => {
        setRecordingState('recording');
      },
      onAudioReady: (url) => {
        recorderRef.current = null;
        setAudioUrl(url);
        setRecordingState('recorded');
      },
      onError: (code) => {
        recorderRef.current = null;
        setMicError(code);
        setRecordingState('idle');
        if (code === 'permission_denied' || code === 'unsupported' || code === 'not_found') {
          setNoMicMode(true);
        }
      },
    });
    if (handle) {
      recorderRef.current = handle;
    }
  };

  const handleStopRecording = () => {
    onPlaySfx('click');
    if (recorderRef.current) {
      recorderRef.current.stop();
    } else {
      setRecordingState('idle');
    }
  };

  const handleRetryRecording = () => {
    onPlaySfx('click');
    releaseRecordingResources();
    setElapsedSec(0);
    setRecordingState('idle');
    setAloudConfirmed(false);
    setStep('speak');
  };

  const handleTogglePlayback = () => {
    if (!audioUrl) return;
    if (isPlayingBack) {
      stopPlayback();
      return;
    }
    onStopSpeech();
    if (!playbackAudioRef.current) {
      playbackAudioRef.current = new Audio(audioUrl);
      playbackAudioRef.current.onended = () => setIsPlayingBack(false);
      playbackAudioRef.current.onerror = () => setIsPlayingBack(false);
    } else if (playbackAudioRef.current.src !== audioUrl) {
      playbackAudioRef.current.src = audioUrl;
    }
    playbackAudioRef.current
      .play()
      .then(() => setIsPlayingBack(true))
      .catch(() => setIsPlayingBack(false));
  };

  const speakStepReady = noMicMode ? aloudConfirmed : recordingState === 'recorded';
  const checklistAnyChecked = checkAnswered || checkFact || checkClear || checkConnector;

  const handleComplete = () => {
    if (!checklistAnyChecked || !speakStepReady) return;
    stopPlayback();
    onStopSpeech();
    const completedAllNow = onCompleteConversation(conversation.id);
    setJustFinishedAll(completedAllNow);
    onPlaySfx('reward');
    setStep('done');
  };

  const stepTabs: { id: TourStep; label: string }[] = [
    { id: 'listen', label: copy.kenyaPracticeStepListen },
    { id: 'prepare', label: copy.kenyaPracticeStepPrepare },
    { id: 'speak', label: copy.kenyaPracticeStepSpeak },
    { id: 'review', label: copy.kenyaPracticeStepReview },
    { id: 'done', label: copy.kenyaPracticeStepDone },
  ];

  const stepOrder: Record<TourStep, number> = {
    listen: 0,
    prepare: 1,
    speak: 2,
    review: 3,
    done: 4,
  };

  const soundBarHeights = [36, 72, 54, 88, 44, 78, 50];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wildspeak-tour-title"
      className={`fixed inset-0 z-30 flex items-end sm:items-center justify-center p-3 sm:p-5 ${
        isNight ? 'bg-[#090F1E]/64' : 'bg-[#20304A]/24'
      }`}
    >
      <div
        className={`max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-3xl border-2 transition-colors ${
          isNight
            ? 'border-[#F2C66D]/50 bg-[#121C36] text-[#F7F9FC] shadow-2xl'
            : 'border-[#E6CFA5] bg-[#FFFDF8] text-[#1E2E46] shadow-[0_22px_50px_rgba(32,48,74,0.22)]'
        }`}
      >
        {/* Savanna Expedition Header Strip */}
        <div
          className={`border-b px-5 pt-4 pb-4 sm:px-6 ${
            isNight ? 'border-white/10 bg-[#172342]' : 'border-[#EAD8B6] bg-[#FBF4E4]'
          }`}
        >
          <KenyaSafariHeaderBannerSVG
            spotId={conversation.id}
            isNight={isNight}
            className="mb-3 h-11 w-full rounded-xl border border-black/10 object-cover"
          />

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* Tourist Portrait + Wildlife Specimen Corner Pair */}
              <div className="relative shrink-0 flex items-center">
                <div
                  style={{ borderColor: npc.accentColor }}
                  className={`relative rounded-2xl border-2 p-0.5 shadow-sm ${
                    isNight ? 'bg-[#1D2B4B]' : 'bg-white'
                  }`}
                >
                  <KenyaTouristPortraitSVG
                    npcId={conversation.npcId}
                    isNight={isNight}
                    className="h-13 w-13 rounded-xl"
                  />
                  <span
                    style={{ backgroundColor: npc.accentColor }}
                    className="absolute -bottom-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-lg text-white shadow"
                    aria-hidden="true"
                  >
                    {conversation.npcId === 'emma' ? (
                      <Binoculars className="h-3 w-3" />
                    ) : (
                      <Camera className="h-3 w-3" />
                    )}
                  </span>
                </div>
                <KenyaWildlifeIllustrationSVG
                  spotId={conversation.id}
                  className="-ml-2 h-11 w-11 rounded-xl border-2 border-[#FFFDF8] shadow-sm"
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    style={{ backgroundColor: npc.accentColor }}
                    className="rounded-lg px-2 py-0.5 font-display text-[11px] font-extrabold text-white"
                  >
                    {npc.name[language]} · {npc.role[language]}
                  </span>
                  <span
                    className={`rounded-lg px-2 py-0.5 font-mono-num text-[11px] font-bold ${
                      isNight ? 'bg-white/10 text-[#E2ECF9]' : 'bg-white text-[#354E70]'
                    }`}
                  >
                    {conversation.order}/{totalCount}
                  </span>
                  <span
                    className={`text-[11px] font-semibold ${
                      isNight ? 'text-[#9CB2D1]' : 'text-[#526785]'
                    }`}
                  >
                    {conversation.locationName[language]}
                  </span>
                </div>
                <h2
                  id="wildspeak-tour-title"
                  className={`mt-1 font-display text-base sm:text-lg font-extrabold truncate ${
                    isNight ? 'text-[#F2C66D]' : 'text-[#20304A]'
                  }`}
                >
                  {npc.focus[language]}
                </h2>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onPlaySfx('click');
                  setShowThaiHelper((s) => !s);
                }}
                className={`inline-flex min-h-[38px] items-center gap-1 rounded-xl border px-2.5 py-1 text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 ${
                  showThaiHelper
                    ? 'border-[#24B8B0] bg-[#24B8B0]/18 text-[#0E7A74] dark:text-[#2ED6A3]'
                    : isNight
                      ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC]'
                      : 'border-[#20304A]/15 bg-white text-[#20304A]'
                }`}
              >
                <Languages className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{showThaiHelper ? copy.kenyaHideThaiLabel : copy.kenyaShowThaiLabel}</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                aria-label={copy.closeSettings}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border cursor-pointer ${
                  isNight
                    ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                    : 'border-[#20304A]/15 bg-white text-[#20304A] hover:bg-[#DCE8F5]'
                }`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Numbered 5-Phase Tour Stepper */}
          <div className="mt-3.5 grid grid-cols-5 gap-1.5" aria-label="Safari Speaking Phases">
            {stepTabs.map((tab, idx) => {
              const active = tab.id === step;
              const done = stepOrder[tab.id] < stepOrder[step];
              return (
                <div
                  key={tab.id}
                  className={`flex items-center justify-center gap-1 rounded-xl border px-1.5 py-1.5 text-center text-[11px] font-bold whitespace-nowrap truncate transition-colors ${
                    active
                      ? 'border-[#D99B26] bg-[#F2C66D] text-[#131E31] shadow-xs'
                      : done
                        ? 'border-[#2ED6A3]/45 bg-[#2ED6A3]/25 text-[#0E7A74] dark:text-[#2ED6A3]'
                        : isNight
                          ? 'border-white/10 bg-[#121D38] text-[#8EA4C4]'
                          : 'border-[#E6CFA5] bg-white/75 text-[#5B708E]'
                  }`}
                >
                  <span className="font-mono-num opacity-80">{idx + 1}.</span>
                  <span className="truncate">{tab.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-5 sm:p-6">

        {/* Scaffold Mode Selector + Tour Progress Summary (Never Deducts XP) */}
        {step !== 'done' && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Support Mode">
              {(
                [
                  { id: 'guided', label: copy.kenyaPracticeModeGuided },
                  { id: 'supported', label: copy.kenyaPracticeModeSupported },
                  { id: 'independent', label: copy.kenyaPracticeModeIndependent },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelectMode(m.id)}
                  className={`min-h-[34px] rounded-xl border px-3 py-1 text-xs font-bold cursor-pointer transition-colors ${
                    supportMode === m.id
                      ? 'border-[#24B8B0] bg-[#24B8B0] text-[#131E31]'
                      : isNight
                        ? 'border-white/15 bg-[#1A2847] text-[#C3CFE0] hover:bg-[#22345B]'
                        : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#394E6E] hover:bg-[#DCE8F5]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <span
              className={`text-[11px] font-semibold ${
                isNight ? 'text-[#9CB2D1]' : 'text-[#526785]'
              }`}
            >
              {copy.kenyaPracticeCountLabel}:{' '}
              <strong className="font-mono-num">
                {completedCount}/{totalCount}
              </strong>{' '}
              · {copy.kenyaPracticeHelpXpSafe}
            </span>
          </div>
        )}

        {alreadyCompleted && step !== 'done' && (
          <p
            className={`mt-2 text-xs font-semibold ${
              isNight ? 'text-[#2ED6A3]' : 'text-[#0E7A74]'
            }`}
          >
            {copy.kenyaPracticeAlreadyDoneNote}
          </p>
        )}

        {conversation.encouragesIndependent && step === 'listen' && (
          <div
            className={`mt-2.5 flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold ${
              isNight
                ? 'border-[#2ED6A3]/40 bg-[#143232] text-[#D2F5EA]'
                : 'border-[#24B8B0]/35 bg-[#E7F8F5] text-[#0E5E59]'
            }`}
          >
            <Sparkles className="h-4 w-4 shrink-0 text-[#24B8B0]" aria-hidden="true" />
            <span>{copy.kenyaPracticeIndependentEncourage}</span>
          </div>
        )}

        {/* PHASE 1: LISTEN (NPC Question + Subtitles + Replay Audio) */}
        {step === 'listen' && (
          <div className="mt-4 space-y-4">
            <div
              className={`rounded-2xl border p-4 sm:p-5 ${
                isNight
                  ? 'border-white/12 bg-[#1A2847]'
                  : 'border-[#20304A]/10 bg-[#F2F7FC]'
              }`}
            >
              <p
                className={`text-xs font-bold ${
                  isNight ? 'text-[#9CB2D1]' : 'text-[#4F6482]'
                }`}
              >
                {npc.name[language]} ({npc.personality[language]})
              </p>

              <p
                className={`mt-2 font-display text-lg sm:text-2xl font-extrabold leading-snug ${
                  isNight ? 'text-[#F7F9FC]' : 'text-[#1E2E46]'
                }`}
              >
                “{conversation.question.en}”
              </p>

              {showThaiHelper && (
                <p
                  className={`mt-1.5 text-xs sm:text-sm font-medium ${
                    isNight ? 'text-[#B6C7DE]' : 'text-[#4F6482]'
                  }`}
                >
                  {conversation.question.th}
                </p>
              )}

              <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={handleSpeakQuestion}
                  className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-4 py-2 text-xs sm:text-sm font-bold cursor-pointer ${
                    isNight
                      ? 'border-[#24B8B0]/50 bg-[#143640] text-[#E6FAF5] hover:bg-[#1B4855]'
                      : 'border-[#24B8B0]/40 bg-[#E6F5FB] text-[#0E7A74] hover:bg-[#D4ECF8]'
                  }`}
                >
                  <Volume2 className="h-4 w-4 text-[#24B8B0]" aria-hidden="true" />
                  <span>{copy.kenyaPracticeReplayQuestion}</span>
                </button>

                <span
                  className={`text-[11px] font-medium ${
                    isNight ? 'text-[#9CB2D1]' : 'text-[#5A708F]'
                  }`}
                >
                  {copy.spotSpeakAudioNotice}
                </span>
              </div>
            </div>

            <div
              className={`rounded-2xl border p-3.5 text-xs sm:text-sm ${
                isNight
                  ? 'border-[#F2C66D]/30 bg-[#1C2744] text-[#FCE6B4]'
                  : 'border-[#F2C66D]/60 bg-[#FFF8E8] text-[#4C3914]'
              }`}
            >
              <strong className="font-display">{copy.kenyaPracticeQuestionTargetLabel}:</strong>{' '}
              {conversation.targetObjective[language]}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  onStopSpeech();
                  onPlaySfx('select');
                  setStep('prepare');
                }}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#f7d487] cursor-pointer"
              >
                <span>{copy.kenyaPracticeStepPrepare}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* PHASE 2: PREPARE (Field Guide Vocab, Built Sentence, Optional Starter/Model) */}
        {step === 'prepare' && (
          <div className="mt-4 space-y-3.5">
            <div
              className={`rounded-2xl border p-3.5 ${
                isNight
                  ? 'border-white/12 bg-[#1A2847]'
                  : 'border-[#20304A]/10 bg-[#F2F7FC]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display text-sm sm:text-base font-extrabold">
                  {npc.name[language]}: “{conversation.question.en}”
                </p>
                <button
                  type="button"
                  onClick={handleSpeakQuestion}
                  className={`inline-flex min-h-[34px] items-center gap-1 rounded-xl border px-2.5 py-1 text-xs font-bold cursor-pointer ${
                    isNight
                      ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC]'
                      : 'border-[#24B8B0]/35 bg-[#E6F5FB] text-[#0E7A74]'
                  }`}
                >
                  <Volume2 className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
                  <span>{copy.jaipurListenButton}</span>
                </button>
              </div>
              <p
                className={`mt-1 text-xs font-medium ${
                  isNight ? 'text-[#B6C7DE]' : 'text-[#4F6482]'
                }`}
              >
                {conversation.targetObjective[language]}
              </p>
            </div>

            {savedBuiltSentence && (
              <div
                className={`rounded-2xl border p-3.5 ${
                  isNight
                    ? 'border-[#2ED6A3]/40 bg-[#123030]'
                    : 'border-[#24B8B0]/35 bg-[#EAF9F6]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#24B8B0]">
                  <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.kenyaPracticeSavedSentenceLabel} (Stage 2)</span>
                </div>
                <p
                  className={`mt-1 font-display text-sm sm:text-base font-extrabold ${
                    isNight ? 'text-[#E6FAF5]' : 'text-[#153B38]'
                  }`}
                >
                  “{savedBuiltSentence}”
                </p>
              </div>
            )}

            {/* Scaffolding Help Controls (Always Free, Zero XP Penalty) */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onPlaySfx('click');
                  setShowHelpPanel((s) => !s);
                }}
                className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                  isNight
                    ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                    : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A] hover:bg-[#DCE8F5]'
                }`}
              >
                {showHelpPanel ? (
                  <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span>
                  {showHelpPanel ? copy.kenyaPracticeHelpHide : copy.kenyaPracticeHelpShow}
                </span>
              </button>

              {showHelpPanel && (
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('click');
                    setRevealModel((r) => !r);
                  }}
                  className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                    isNight
                      ? 'border-[#F2C66D]/45 bg-[#2A261C] text-[#FCE6B4]'
                      : 'border-[#F2C66D] bg-[#FFF8E8] text-[#5C410C]'
                  }`}
                >
                  <span>
                    {revealModel ? copy.kenyaPracticeHideModel : copy.kenyaPracticeRevealModel}
                  </span>
                </button>
              )}
            </div>

            {showHelpPanel && (
              <div
                className={`rounded-2xl border p-4 space-y-3 ${
                  isNight
                    ? 'border-white/15 bg-[#172442]'
                    : 'border-[#C9DCF0] bg-[#F7FBFF]'
                }`}
              >
                {/* Field Guide Key Words */}
                {discoveryTask && (
                  <div>
                    <p
                      className={`mb-1.5 text-xs font-bold ${
                        isNight ? 'text-[#9CB2D1]' : 'text-[#4F6482]'
                      }`}
                    >
                      {copy.kenyaVocabHeading}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {discoveryTask.vocabulary.map((v) => (
                        <span
                          key={v.word}
                          className={`rounded-xl border px-2.5 py-1 text-xs font-semibold ${
                            isNight
                              ? 'border-[#24B8B0]/40 bg-[#153440] text-[#D8FAF0]'
                              : 'border-[#24B8B0]/35 bg-[#E6FAF5] text-[#0E5B56]'
                          }`}
                        >
                          <strong className="font-display">{v.word}</strong>
                          {showThaiHelper && <span className="opacity-75"> · {v.th}</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sentence Starter */}
                <div>
                  <p
                    className={`text-xs font-bold ${
                      isNight ? 'text-[#9CB2D1]' : 'text-[#4F6482]'
                    }`}
                  >
                    {copy.kenyaPracticeStarterLabel}
                  </p>
                  <p
                    className={`mt-0.5 font-display text-sm sm:text-base font-extrabold ${
                      isNight ? 'text-[#F2C66D]' : 'text-[#0E7A74]'
                    }`}
                  >
                    {conversation.suggestedStarter}
                  </p>
                </div>

                {/* Optional Revealable Model Answer */}
                {revealModel && (
                  <div
                    className={`border-t pt-2.5 ${
                      isNight ? 'border-white/12' : 'border-[#20304A]/10'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`text-xs font-bold ${
                          isNight ? 'text-[#2ED6A3]' : 'text-[#0E7A74]'
                        }`}
                      >
                        {copy.kenyaPracticeModelLabel}
                      </span>
                      <button
                        type="button"
                        onClick={handleSpeakModel}
                        className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold cursor-pointer ${
                          isNight
                            ? 'border-[#24B8B0]/50 bg-[#143640] text-[#E6FAF5]'
                            : 'border-[#24B8B0]/40 bg-[#E6F5FB] text-[#0E7A74]'
                        }`}
                      >
                        <Volume2 className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
                        <span>{copy.kenyaPracticeListenModel}</span>
                      </button>
                    </div>
                    <p className="mt-1 font-display text-sm sm:text-base font-extrabold">
                      “{conversation.modelAnswer.en}”
                    </p>
                    {showThaiHelper && (
                      <p
                        className={`mt-0.5 text-xs ${
                          isNight ? 'text-[#B6C7DE]' : 'text-[#4F6482]'
                        }`}
                      >
                        {conversation.modelAnswer.th}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  onStopSpeech();
                  onPlaySfx('click');
                  setStep('listen');
                }}
                className={`inline-flex min-h-[40px] items-center rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${
                  isNight
                    ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC]'
                    : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A]'
                }`}
              >
                {copy.backButton}
              </button>

              <button
                type="button"
                onClick={() => {
                  onStopSpeech();
                  onPlaySfx('select');
                  setStep('speak');
                }}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#f7d487] cursor-pointer"
              >
                <span>{copy.kenyaPracticeStepSpeak}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* PHASE 3: SPEAK (Transient Mic Record/Playback OR Honest No-Mic Mode) */}
        {step === 'speak' && (
          <div className="mt-4 space-y-3.5">
            <div
              className={`rounded-2xl border p-4 ${
                isNight
                  ? 'border-white/12 bg-[#1A2847]'
                  : 'border-[#20304A]/10 bg-[#F2F7FC]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display text-base sm:text-lg font-extrabold">
                  {npc.name[language]}: “{conversation.question.en}”
                </p>
                <button
                  type="button"
                  onClick={handleSpeakQuestion}
                  className={`inline-flex min-h-[34px] items-center gap-1 rounded-xl border px-3 py-1 text-xs font-bold cursor-pointer ${
                    isNight
                      ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC]'
                      : 'border-[#24B8B0]/35 bg-[#E6F5FB] text-[#0E7A74]'
                  }`}
                >
                  <Volume2 className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
                  <span>{copy.kenyaPracticeReplayQuestion}</span>
                </button>
              </div>
              <p
                className={`mt-1 text-xs font-medium ${
                  isNight ? 'text-[#B6C7DE]' : 'text-[#4F6482]'
                }`}
              >
                {copy.kenyaPracticeSpeakingPromptNote}
              </p>

              {(supportMode === 'guided' || revealModel) && (
                <p
                  className={`mt-2 font-display text-xs sm:text-sm font-bold ${
                    isNight ? 'text-[#F2C66D]' : 'text-[#0E7A74]'
                  }`}
                >
                  {supportMode === 'guided'
                    ? conversation.modelAnswer.en
                    : conversation.suggestedStarter}
                </p>
              )}
              {supportMode === 'supported' && !revealModel && (
                <p
                  className={`mt-2 font-display text-xs sm:text-sm font-bold ${
                    isNight ? 'text-[#F2C66D]' : 'text-[#0E7A74]'
                  }`}
                >
                  {conversation.suggestedStarter}
                </p>
              )}
            </div>

            {micError && (
              <div
                role="status"
                className={`rounded-xl border p-3 text-xs font-semibold ${
                  isNight
                    ? 'border-[#FF9478]/50 bg-[#35202D] text-[#FFD8CE]'
                    : 'border-[#E86D4E]/45 bg-[#FFF2EE] text-[#8E321C]'
                }`}
              >
                {micError === 'permission_denied'
                  ? copy.spotSpeakMicDeniedNotice
                  : copy.spotSpeakMicUnavailableNotice}
              </div>
            )}

            {!noMicMode && micSupported ? (
              <div
                className={`rounded-2xl border p-4 space-y-3 ${
                  isNight
                    ? 'border-white/15 bg-[#192645]'
                    : 'border-[#C9DCF0] bg-[#F7FBFF]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {recordingState === 'idle' || recordingState === 'requesting' ? (
                    <button
                      type="button"
                      disabled={recordingState === 'requesting'}
                      onClick={handleStartRecording}
                      className="inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-[#E07A68] px-5 py-2.5 font-display text-sm font-extrabold text-white shadow-md hover:bg-[#d36855] cursor-pointer disabled:opacity-60"
                    >
                      <Mic className="h-4 w-4" aria-hidden="true" />
                      <span>{copy.spotSpeakStartMicButton}</span>
                    </button>
                  ) : recordingState === 'recording' ? (
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${
                          isNight
                            ? 'bg-[#3C1E28] text-[#FFB5A7]'
                            : 'bg-[#FFEBE7] text-[#A43220]'
                        }`}
                      >
                        <span className="h-2.5 w-2.5 rounded-full bg-[#E04D3B]" aria-hidden="true" />
                        <span>{copy.spotSpeakRecordingStatus}</span>
                        <span className="font-mono-num">{formatElapsed(elapsedSec)}</span>
                      </span>

                      <div className="flex h-6 items-end gap-1" aria-hidden="true">
                        {soundBarHeights.map((h, i) => (
                          <span
                            key={i}
                            style={{
                              height: reducedMotion ? '60%' : `${h}%`,
                              transition: 'height 0.2s ease',
                            }}
                            className="w-1 rounded-full bg-[#E07A68]"
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleStopRecording}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#20304A] px-4 py-2 font-display text-sm font-bold text-white shadow hover:bg-[#2C4163] cursor-pointer"
                      >
                        <Square className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{copy.spotSpeakStopMicButton}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={handleTogglePlayback}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#24B8B0] px-4 py-2 font-display text-sm font-extrabold text-[#131E31] shadow hover:bg-[#34c8c0] cursor-pointer"
                      >
                        {isPlayingBack ? (
                          <Pause className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Play className="h-4 w-4" aria-hidden="true" />
                        )}
                        <span>
                          {isPlayingBack
                            ? copy.spotSpeakPauseAudioButton
                            : copy.spotSpeakPlaybackButton}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRetryRecording}
                        className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold cursor-pointer ${
                          isNight
                            ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC]'
                            : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A]'
                        }`}
                      >
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{copy.spotSpeakRetryButton}</span>
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      releaseRecordingResources();
                      setRecordingState('idle');
                      setNoMicMode(true);
                    }}
                    className={`text-xs font-semibold underline underline-offset-2 cursor-pointer ${
                      isNight ? 'text-[#B6C7DE] hover:text-white' : 'text-[#4F6482] hover:text-[#20304A]'
                    }`}
                  >
                    {copy.spotSpeakNoMicToggle}
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`rounded-2xl border p-4 space-y-3 ${
                  isNight
                    ? 'border-white/15 bg-[#192645]'
                    : 'border-[#C9DCF0] bg-[#F7FBFF]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-semibold">{copy.kenyaPracticeSpeakingPromptNote}</p>
                  {micSupported && (
                    <button
                      type="button"
                      onClick={() => {
                        setMicError(null);
                        setNoMicMode(false);
                      }}
                      className={`text-xs font-semibold underline underline-offset-2 cursor-pointer ${
                        isNight ? 'text-[#B6C7DE]' : 'text-[#4F6482]'
                      }`}
                    >
                      {copy.spotSpeakMicToggle}
                    </button>
                  )}
                </div>

                <label className="flex min-h-[44px] items-center gap-2.5 text-xs sm:text-sm font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aloudConfirmed}
                    onChange={(e) => setAloudConfirmed(e.target.checked)}
                    className="h-4 w-4 accent-[#24B8B0]"
                  />
                  <span>{copy.kenyaPracticeNoMicAloudCheck}</span>
                </label>
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  stopPlayback();
                  onPlaySfx('click');
                  setStep('prepare');
                }}
                className={`inline-flex min-h-[40px] items-center rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${
                  isNight
                    ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC]'
                    : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A]'
                }`}
              >
                {copy.backButton}
              </button>

              <button
                type="button"
                disabled={!speakStepReady}
                onClick={() => {
                  stopPlayback();
                  onPlaySfx('select');
                  setStep('review');
                }}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#49e2b3] cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
              >
                <span>{copy.kenyaPracticeStepReview}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* PHASE 4: REVIEW & HONEST SELF-REFLECTION + SANDWICH GUIDANCE */}
        {step === 'review' && (
          <div className="mt-4 space-y-3.5">
            <div
              className={`rounded-2xl border p-4 space-y-2.5 ${
                isNight
                  ? 'border-white/12 bg-[#1A2847]'
                  : 'border-[#20304A]/10 bg-[#F2F7FC]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-sm font-extrabold">
                  {copy.kenyaPracticeChecklistHeading}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  {audioUrl && (
                    <button
                      type="button"
                      onClick={handleTogglePlayback}
                      className="inline-flex min-h-[34px] items-center gap-1.5 rounded-xl bg-[#24B8B0] px-3 py-1 text-xs font-extrabold text-[#131E31] cursor-pointer"
                    >
                      {isPlayingBack ? (
                        <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <Play className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      <span>
                        {isPlayingBack
                          ? copy.spotSpeakPauseAudioButton
                          : copy.spotSpeakPlaybackButton}
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleSpeakModel}
                    className={`inline-flex min-h-[34px] items-center gap-1 rounded-xl border px-3 py-1 text-xs font-bold cursor-pointer ${
                      isNight
                        ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC]'
                        : 'border-[#24B8B0]/35 bg-[#E6F5FB] text-[#0E7A74]'
                    }`}
                  >
                    <Volume2 className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
                    <span>{copy.kenyaPracticeListenModel}</span>
                  </button>
                </div>
              </div>

              <p
                className={`text-xs ${
                  isNight ? 'text-[#B6C7DE]' : 'text-[#4F6482]'
                }`}
              >
                {conversation.selfCheckFocusPrompt[language]}
              </p>

              <p
                className={`text-[11px] font-medium ${
                  isNight ? 'text-[#9CB2D1]' : 'text-[#5A708F]'
                }`}
              >
                {copy.kenyaPracticeChecklistHint}
              </p>

              <div className="grid gap-1.5 pt-1">
                {[
                  {
                    checked: checkAnswered,
                    toggle: () => setCheckAnswered((v) => !v),
                    label: copy.kenyaPracticeCheckAnswered,
                  },
                  {
                    checked: checkFact,
                    toggle: () => setCheckFact((v) => !v),
                    label: copy.kenyaPracticeCheckFact,
                  },
                  {
                    checked: checkClear,
                    toggle: () => setCheckClear((v) => !v),
                    label: copy.kenyaPracticeCheckClear,
                  },
                  {
                    checked: checkConnector,
                    toggle: () => setCheckConnector((v) => !v),
                    label: copy.kenyaPracticeCheckConnector,
                  },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onPlaySfx('click');
                      item.toggle();
                    }}
                    className={`flex min-h-[40px] w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-xs font-semibold cursor-pointer transition-colors ${
                      item.checked
                        ? 'border-[#2ED6A3] bg-[#2ED6A3]/18 text-[#0E7A74] dark:text-[#2ED6A3]'
                        : isNight
                          ? 'border-white/15 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#25385A]'
                          : 'border-[#20304A]/15 bg-white text-[#20304A] hover:bg-[#EDF5FD]'
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                        item.checked
                          ? 'border-[#2ED6A3] bg-[#2ED6A3] text-[#131E31]'
                          : isNight
                            ? 'border-white/30 bg-transparent'
                            : 'border-[#20304A]/25 bg-white'
                      }`}
                    >
                      {item.checked && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                    </span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Clearly Labeled Honest Sandwich Feedback */}
            <div
              className={`rounded-2xl border p-4 space-y-2 text-xs sm:text-sm ${
                isNight
                  ? 'border-[#2ED6A3]/40 bg-[#123030] text-[#E6FAF5]'
                  : 'border-[#24B8B0]/35 bg-[#EAF9F6] text-[#153B38]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-display text-xs font-extrabold uppercase tracking-wide">
                  {copy.kenyaPracticeFeedbackHeading}
                </span>
                <span
                  className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                    isNight ? 'bg-white/10 text-[#B6E6D8]' : 'bg-white/80 text-[#0E5B56]'
                  }`}
                >
                  {copy.kenyaPracticeFeedbackHonestBadge}
                </span>
              </div>
              <p>
                <strong className="font-display">{copy.spotSpeakFeedbackPositiveLabel}:</strong>{' '}
                {conversation.sandwichFeedback.positive[language]}
              </p>
              <p>
                <strong className="font-display">{copy.spotSpeakFeedbackTipLabel}:</strong>{' '}
                {conversation.sandwichFeedback.improvement[language]}
              </p>
              <p>
                <strong className="font-display">{copy.spotSpeakFeedbackNextLabel}:</strong>{' '}
                {conversation.sandwichFeedback.nextStep[language]}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleRetryRecording}
                className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${
                  isNight
                    ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC]'
                    : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A]'
                }`}
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{copy.spotSpeakRetryButton}</span>
              </button>

              <button
                type="button"
                disabled={!checklistAnyChecked}
                onClick={handleComplete}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#49e2b3] cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>{copy.kenyaPracticeCompleteButton}</span>
              </button>
            </div>
          </div>
        )}

        {/* PHASE 5: DONE (Visitor Thank-You + Tour Milestone Celebration) */}
        {step === 'done' && (
          <div className="mt-4 space-y-4">
            <div
              className={`rounded-2xl border-2 p-5 ${
                isNight
                  ? 'border-[#2ED6A3]/50 bg-[#123030] text-[#E6FAF5]'
                  : 'border-[#24B8B0]/45 bg-[#EAF9F6] text-[#153B38]'
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-extrabold text-[#2ED6A3]">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                <span>{copy.kenyaPracticeDoneHeading}</span>
              </div>
              <p className="mt-2 font-display text-base sm:text-lg font-extrabold">
                {npc.name[language]}: “{conversation.thankYouReply[language]}”
              </p>
              {showThaiHelper && language === 'th' && (
                <p className="mt-1 text-xs opacity-80">“{conversation.thankYouReply.en}”</p>
              )}

              {justFinishedAll && (
                <div className="mt-3.5 flex flex-wrap items-center gap-2 rounded-xl bg-[#131E31] px-4 py-2.5 text-white shadow">
                  <Sparkles className="h-4 w-4 text-[#F2C66D]" aria-hidden="true" />
                  <span className="font-display text-xs sm:text-sm font-extrabold text-[#F2C66D]">
                    +{KENYA_PRACTICE_XP_REWARD} {copy.xpLabel}
                  </span>
                  <span className="text-xs font-semibold text-[#2ED6A3]">
                    {copy.kenyaPerformUnlockedBadge}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#f7d487] cursor-pointer"
              >
                <span>{copy.kenyaPracticeContinueTour}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
