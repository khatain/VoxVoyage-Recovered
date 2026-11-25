import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  Compass,
  HelpCircle,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Square,
  Stamp,
  Volume2,
  X,
} from 'lucide-react';
import type {
  AppLanguage,
  AvatarConfig,
  ResolvedAppearance,
  ScotlandPerformOutline,
  ScotlandPerformPracticeMode,
  ScotlandPerformQaQuestionId,
  ScotlandPerformQaStates,
  ScotlandPerformReflectionState,
} from '../../types/game';
import { GAME_COPY } from '../../data/i18n';
import type { ScotlandDifficultyMode } from '../../data/scotlandDiscovery';
import {
  areValidScotlandPerformQaStates,
  createEmptyScotlandPerformOutline,
  EILIDH_PERFORM_DIALOGUE,
  FIONA_PERFORM_DIALOGUE,
  isValidScotlandPerformOutline,
  SCOTLAND_PERFORM_CONNECTORS,
  SCOTLAND_PERFORM_EVIDENCE_TOPICS,
  SCOTLAND_PERFORM_GUIDANCE_FEEDBACK,
  SCOTLAND_PERFORM_PLANNER_FIELDS,
  SCOTLAND_PERFORM_QA_QUESTIONS,
  SCOTLAND_PERFORM_REFLECTION_ITEMS,
  SCOTLAND_PERFORM_SAMPLE_REFERENCE,
  SCOTLAND_PERFORM_XP_REWARD,
  TOTAL_SCOTLAND_MISSION_XP,
  type ScotlandPerformCompletionPayload,
  type ScotlandPerformOutlineFieldKey,
  type ScotlandPerformReflectionCheckKey,
} from '../../data/scotlandPerform';
import type { ScotlandLandmarkId } from '../../data/scotlandWorld';
import {
  isMicrophoneRecordingSupported,
  startTransientMicRecording,
  type ActiveRecordingHandle,
  type RecorderErrorCode,
} from '../../utils/audioRecorder';
import { AvatarPortraitSVG } from '../avatar/AvatarPortraitSVG';
import { ScotlandHighlandsStampSVG } from '../common/ScotlandHighlandsStampSVG';
import {
  ScotlandExchangeHeaderBannerSVG,
  ScotlandNpcPortraitSVG,
  ScotlandTartanRibbonDivider,
} from './ScotlandMiniGameArtwork';

export type ScotlandPerformStep =
  | 'invitation'
  | 'prepare'
  | 'speech'
  | 'qa'
  | 'reflect'
  | 'ceremony';

type PerformAudioSlotId = 'speech' | ScotlandPerformQaQuestionId;

interface ScotlandPerformModalProps {
  language: AppLanguage;
  appearance: ResolvedAppearance;
  reducedMotion: boolean;
  avatar: AvatarConfig;
  difficultyMode: ScotlandDifficultyMode;
  builtSentences: Record<string, string>;
  alreadyCompleted: boolean;
  completedAt?: string;
  currentTotalXp: number;
  initialSelectedEvidenceIds?: string[];
  initialOutline?: ScotlandPerformOutline;
  initialSpeechMode?: ScotlandPerformPracticeMode;
  initialQaStates?: ScotlandPerformQaStates;
  initialReflectionState?: ScotlandPerformReflectionState;
  canReplayCountry?: boolean;
  onDifficultyChange: (mode: ScotlandDifficultyMode) => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'mode' | 'reward') => void;
  onSpeakText: (text: string, voiceOpts?: { pitch?: number; rate?: number }) => void;
  onStopSpeech: () => void;
  onCompletePerform: (payload: ScotlandPerformCompletionPayload) => {
    firstCompletion: boolean;
  };
  onReviewPractice: () => void;
  onOpenJournal: () => void;
  onViewPassport: () => void;
  onReturnWorldMap: () => void;
  onRequestReplayCountry?: () => void;
  onClose: () => void;
}

function formatTimerSeconds(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function ScotlandPerformModal({
  language,
  appearance,
  reducedMotion,
  avatar,
  difficultyMode,
  builtSentences,
  alreadyCompleted,
  completedAt,
  currentTotalXp,
  initialSelectedEvidenceIds,
  initialOutline,
  initialSpeechMode,
  initialQaStates,
  initialReflectionState,
  canReplayCountry = false,
  onDifficultyChange,
  onPlaySfx,
  onSpeakText,
  onStopSpeech,
  onCompletePerform,
  onReviewPractice,
  onOpenJournal,
  onViewPassport,
  onReturnWorldMap,
  onRequestReplayCountry,
  onClose,
}: ScotlandPerformModalProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';
  const micSupported = isMicrophoneRecordingSupported();

  const [step, setStep] = useState<ScotlandPerformStep>('invitation');
  const [showThaiSupport, setShowThaiSupport] = useState(language === 'th');
  const [showSampleRef, setShowSampleRef] = useState(false);

  // Step 2: Preparation
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<ScotlandLandmarkId[]>(() => {
    const seeded = (initialSelectedEvidenceIds ?? []).filter((id): id is ScotlandLandmarkId =>
      SCOTLAND_PERFORM_EVIDENCE_TOPICS.some((t) => t.id === id),
    );
    return seeded;
  });
  const [outline, setOutline] = useState<ScotlandPerformOutline>(() =>
    initialOutline ? { ...initialOutline } : createEmptyScotlandPerformOutline(),
  );

  // Step 3 & Step 4: Speaking & Q&A Transient Audio + No-Mic Rehearsal
  const [noMicMode, setNoMicMode] = useState<boolean>(
    !micSupported || initialSpeechMode === 'self_reported_no_mic',
  );
  const [micError, setMicError] = useState<RecorderErrorCode | null>(null);
  const [requestingSlot, setRequestingSlot] = useState<PerformAudioSlotId | null>(null);
  const [activeRecSlot, setActiveRecSlot] = useState<PerformAudioSlotId | null>(null);
  const [recElapsedBySlot, setRecElapsedBySlot] = useState<Record<PerformAudioSlotId, number>>({
    speech: 0,
    qa_eilidh: 0,
    qa_fiona: 0,
  });
  const [audioUrls, setAudioUrls] = useState<Record<PerformAudioSlotId, string | null>>({
    speech: null,
    qa_eilidh: null,
    qa_fiona: null,
  });
  const [playingSlot, setPlayingSlot] = useState<PerformAudioSlotId | null>(null);

  const [showSpeechNotes, setShowSpeechNotes] = useState(true);
  const [speechAloudConfirmed, setSpeechAloudConfirmed] = useState(false);
  const [qaAloudConfirmed, setQaAloudConfirmed] = useState<
    Record<ScotlandPerformQaQuestionId, boolean>
  >({
    qa_eilidh: false,
    qa_fiona: false,
  });
  const [qaShowHint, setQaShowHint] = useState<Record<ScotlandPerformQaQuestionId, boolean>>({
    qa_eilidh: false,
    qa_fiona: false,
  });

  // Step 5: Honest Self-Reflection (always starts unchecked in session)
  const [reflectionChecks, setReflectionChecks] = useState<
    ScotlandPerformReflectionState['checks']
  >({
    introducedComparison: false,
    explainedSimilarity: false,
    explainedDifference: false,
    usedSpecificExamples: false,
    answeredBothQuestions: false,
    spokeClearlyConfidently: false,
  });

  const [wasFirstCompletion, setWasFirstCompletion] = useState(!alreadyCompleted);

  const recorderRef = useRef<ActiveRecordingHandle | null>(null);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlsRef = useRef(audioUrls);
  audioUrlsRef.current = audioUrls;

  // Silence unused lint notice if initial props are read only in tests or future resume hooks
  void initialQaStates;
  void initialReflectionState;

  const stopPlayback = useCallback(() => {
    if (playbackAudioRef.current) {
      playbackAudioRef.current.pause();
      playbackAudioRef.current.currentTime = 0;
    }
    setPlayingSlot(null);
  }, []);

  const releaseSlotAudio = useCallback(
    (slot: PerformAudioSlotId) => {
      if (playingSlot === slot) {
        stopPlayback();
      }
      const existingUrl = audioUrlsRef.current[slot];
      if (existingUrl) {
        URL.revokeObjectURL(existingUrl);
      }
      setAudioUrls((prev) => ({ ...prev, [slot]: null }));
    },
    [playingSlot, stopPlayback],
  );

  const releaseAllAudioResources = useCallback(() => {
    stopPlayback();
    if (playbackAudioRef.current) {
      playbackAudioRef.current.removeAttribute('src');
    }
    if (recorderRef.current) {
      recorderRef.current.dispose();
      recorderRef.current = null;
    }
    (['speech', 'qa_eilidh', 'qa_fiona'] as const).forEach((slot) => {
      const url = audioUrlsRef.current[slot];
      if (url) {
        URL.revokeObjectURL(url);
      }
    });
    setActiveRecSlot(null);
    setRequestingSlot(null);
    setAudioUrls({ speech: null, qa_eilidh: null, qa_fiona: null });
  }, [stopPlayback]);

  useEffect(() => {
    return () => {
      releaseAllAudioResources();
      onStopSpeech();
    };
  }, [onStopSpeech, releaseAllAudioResources]);

  useEffect(() => {
    if (!activeRecSlot) return;
    const id = window.setInterval(() => {
      setRecElapsedBySlot((prev) => ({
        ...prev,
        [activeRecSlot]: prev[activeRecSlot] + 1,
      }));
    }, 1000);
    return () => window.clearInterval(id);
  }, [activeRecSlot]);

  const handleClose = useCallback(() => {
    releaseAllAudioResources();
    onStopSpeech();
    onPlaySfx('click');
    onClose();
  }, [onClose, onPlaySfx, onStopSpeech, releaseAllAudioResources]);

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

  const handleStartRecordingSlot = async (slot: PerformAudioSlotId) => {
    if (activeRecSlot || requestingSlot) return;
    onStopSpeech();
    stopPlayback();
    releaseSlotAudio(slot);
    setMicError(null);
    setRecElapsedBySlot((prev) => ({ ...prev, [slot]: 0 }));
    setRequestingSlot(slot);

    const handle = await startTransientMicRecording({
      onRecordingStarted: () => {
        setRequestingSlot(null);
        setActiveRecSlot(slot);
      },
      onAudioReady: (url) => {
        recorderRef.current = null;
        setRequestingSlot(null);
        setActiveRecSlot(null);
        setAudioUrls((prev) => ({ ...prev, [slot]: url }));
      },
      onError: (code) => {
        recorderRef.current = null;
        setRequestingSlot(null);
        setActiveRecSlot(null);
        setMicError(code);
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
      setActiveRecSlot(null);
      setRequestingSlot(null);
    }
  };

  const handleRetrySlot = (slot: PerformAudioSlotId) => {
    onPlaySfx('click');
    if (recorderRef.current) {
      recorderRef.current.dispose();
      recorderRef.current = null;
    }
    setActiveRecSlot(null);
    setRequestingSlot(null);
    releaseSlotAudio(slot);
    setRecElapsedBySlot((prev) => ({ ...prev, [slot]: 0 }));
    if (slot === 'speech') {
      setSpeechAloudConfirmed(false);
    } else {
      setQaAloudConfirmed((prev) => ({ ...prev, [slot]: false }));
    }
  };

  const handleTogglePlaybackSlot = (slot: PerformAudioSlotId) => {
    const url = audioUrls[slot];
    if (!url) return;
    if (playingSlot === slot) {
      stopPlayback();
      return;
    }
    onStopSpeech();
    stopPlayback();
    if (!playbackAudioRef.current) {
      playbackAudioRef.current = new Audio(url);
      playbackAudioRef.current.onended = () => setPlayingSlot(null);
      playbackAudioRef.current.onerror = () => setPlayingSlot(null);
    } else {
      playbackAudioRef.current.src = url;
    }
    playbackAudioRef.current
      .play()
      .then(() => setPlayingSlot(slot))
      .catch(() => setPlayingSlot(null));
  };

  const toggleEvidenceTopic = (id: ScotlandLandmarkId) => {
    onPlaySfx('click');
    setSelectedEvidenceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const updateOutlineField = (key: ScotlandPerformOutlineFieldKey, value: string) => {
    setOutline((prev) => ({ ...prev, [key]: value }));
  };

  const insertStarterPhrase = (key: ScotlandPerformOutlineFieldKey, phrase: string) => {
    onPlaySfx('select');
    setOutline((prev) => {
      const existing = prev[key].trim();
      if (!existing) {
        return { ...prev, [key]: phrase };
      }
      if (existing.toLowerCase().includes(phrase.toLowerCase())) {
        return prev;
      }
      return { ...prev, [key]: `${existing} ${phrase}`.trim() };
    });
  };

  const toggleReflectionCheck = (key: ScotlandPerformReflectionCheckKey) => {
    onPlaySfx('click');
    setReflectionChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const prepReady =
    selectedEvidenceIds.length >= 2 && isValidScotlandPerformOutline(outline);
  const speechPracticeMode: ScotlandPerformPracticeMode | null = audioUrls.speech
    ? 'recorded_mic'
    : speechAloudConfirmed
      ? 'self_reported_no_mic'
      : null;
  const speechReady = speechPracticeMode !== null;

  const qaEilidhMode: ScotlandPerformPracticeMode | null = audioUrls.qa_eilidh
    ? 'recorded_mic'
    : qaAloudConfirmed.qa_eilidh
      ? 'self_reported_no_mic'
      : null;
  const qaFionaMode: ScotlandPerformPracticeMode | null = audioUrls.qa_fiona
    ? 'recorded_mic'
    : qaAloudConfirmed.qa_fiona
      ? 'self_reported_no_mic'
      : null;
  const qaStates: ScotlandPerformQaStates = {
    ...(qaEilidhMode ? { qa_eilidh: qaEilidhMode } : {}),
    ...(qaFionaMode ? { qa_fiona: qaFionaMode } : {}),
  };
  const allQaReady = areValidScotlandPerformQaStates(qaStates);

  const anyReflectionChecked = SCOTLAND_PERFORM_REFLECTION_ITEMS.some(
    (item) => reflectionChecks[item.key],
  );

  const maxUnlockedStepIndex =
    allQaReady && speechReady && prepReady
      ? 4
      : speechReady && prepReady
        ? 3
        : prepReady
          ? 2
          : 1;

  const handleFinishPerform = () => {
    if (!prepReady || !speechPracticeMode || !allQaReady || !anyReflectionChecked) {
      return;
    }
    stopPlayback();
    onStopSpeech();
    const completionPayload: ScotlandPerformCompletionPayload = {
      selectedEvidenceIds,
      outline: {
        introduction: outline.introduction.trim(),
        similarity: outline.similarity.trim(),
        difference: outline.difference.trim(),
        evidenceNotes: outline.evidenceNotes.trim(),
        conclusion: outline.conclusion.trim(),
      },
      speechPracticeMode,
      questionPracticeStates: qaStates,
      reflectionState: {
        checks: { ...reflectionChecks },
        completedAt: new Date().toISOString(),
      },
    };
    const res = onCompletePerform(completionPayload);
    setWasFirstCompletion(res.firstCompletion);
    onPlaySfx('reward');
    setStep('ceremony');
  };

  const stepTabs: { id: Exclude<ScotlandPerformStep, 'ceremony'>; label: string }[] = [
    { id: 'invitation', label: copy.scotlandPerformStepInvitation },
    { id: 'prepare', label: copy.scotlandPerformStepPrepare },
    { id: 'speech', label: copy.scotlandPerformStepSpeech },
    { id: 'qa', label: copy.scotlandPerformStepQa },
    { id: 'reflect', label: copy.scotlandPerformStepReflect },
  ];

  const stepIndexMap: Record<ScotlandPerformStep, number> = {
    invitation: 0,
    prepare: 1,
    speech: 2,
    qa: 3,
    reflect: 4,
    ceremony: 4,
  };

  const cardSurface = isNight
    ? 'border-[#3A7D6C]/70 bg-[#121C36] text-[#F7F9FC] shadow-2xl'
    : 'border-[#20304A]/12 bg-[#FFFDF8] text-[#1E2E46] shadow-[0_22px_54px_rgba(32,48,74,0.24)]';

  const insetSurface = isNight
    ? 'border-white/12 bg-[#1A2847]'
    : 'border-[#20304A]/12 bg-[#F2F7FC]';

  const neutralBtnClass = isNight
    ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
    : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A] hover:bg-[#DCE8F5]';

  const chosenTopics = SCOTLAND_PERFORM_EVIDENCE_TOPICS.filter((topic) =>
    selectedEvidenceIds.includes(topic.id),
  );

  const instructionReadAloudText = `${EILIDH_PERFORM_DIALOGUE.ready.en} ${FIONA_PERFORM_DIALOGUE.ready.en} Prepare a short 60 to 90 second comparison of Scotland and Thailand. Choose at least two cultural evidence topics, explain at least one similarity and one difference, include a clear introduction and conclusion, and answer two questions from Eilidh and Fiona.`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="scotland-perform-title"
      className={`fixed inset-0 z-30 flex items-end sm:items-center justify-center p-3 sm:p-6 ${
        isNight ? 'bg-[#090F1E]/72' : 'bg-[#20304A]/32'
      }`}
    >
      <div
        className={`w-full max-w-2xl max-h-[92dvh] overflow-y-auto rounded-3xl border-2 ${
          reducedMotion ? '' : 'transition-colors duration-200'
        } ${cardSurface}`}
      >
        <ScotlandTartanRibbonDivider />

        {/* Lochside Castle Exhibition Scenic Header */}
        <div
          className={`border-b px-5 pt-4 pb-4 sm:px-6 ${
            isNight ? 'border-white/12 bg-[#172342]' : 'border-[#D9E7E2] bg-[#F4FBF8]'
          }`}
        >
          <ScotlandExchangeHeaderBannerSVG
            stationId="lochside_castle_viewpoint"
            isNight={isNight}
            className="mb-3 h-12 w-full rounded-xl border border-black/10 object-cover"
          />

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p
                className={`text-xs font-extrabold uppercase tracking-wide ${
                  isNight ? 'text-[#2ED6A3]' : 'text-[#1E5B4C]'
                }`}
              >
                {copy.scotlandPerformMissionBadge} <span aria-hidden="true">·</span>{' '}
                {copy.scotlandPerformLocationLabel} <span aria-hidden="true">·</span>{' '}
                {copy.scotlandPerformTargetDuration}
              </p>
              <h2
                id="scotland-perform-title"
                className={`mt-0.5 font-display text-lg sm:text-2xl font-extrabold leading-tight ${
                  isNight ? 'text-[#F2C66D]' : 'text-[#1E2E46]'
                }`}
              >
                {copy.scotlandPerformTitle}
              </h2>
              <p
                className={`mt-0.5 text-xs font-semibold ${
                  isNight ? 'text-[#B8CAE0]' : 'text-[#48607E]'
                }`}
              >
                {copy.scotlandPerformAmbassadorTitle}
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              aria-label={copy.scotlandCloseButton}
              className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border cursor-pointer ${neutralBtnClass}`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Interactive 5-Step Progress Bar (Allows reviewing earlier steps safely) */}
          <div
            className="mt-3.5 grid grid-cols-5 gap-1.5"
            aria-label="Cultural Exchange Challenge Steps"
          >
            {stepTabs.map((tab, idx) => {
              const currentIdx = stepIndexMap[step];
              const active = idx === currentIdx && step !== 'ceremony';
              const done = idx < currentIdx || step === 'ceremony';
              const canJump = step !== 'ceremony' && idx <= Math.max(currentIdx, maxUnlockedStepIndex) && activeRecSlot === null;
              return (
                <button
                  key={tab.id}
                  type="button"
                  disabled={!canJump}
                  onClick={() => {
                    if (!canJump) return;
                    stopPlayback();
                    onStopSpeech();
                    onPlaySfx('click');
                    setStep(tab.id);
                  }}
                  className={`flex items-center justify-center gap-1 rounded-xl border px-1.5 py-2 text-center text-[11px] font-bold whitespace-nowrap truncate ${
                    active
                      ? 'border-[#D99B26] bg-[#F2C66D] text-[#131E31] shadow-xs cursor-default'
                      : done
                        ? 'border-[#2ED6A3]/55 bg-[#2ED6A3]/25 text-[#134E4A] dark:text-[#2ED6A3] cursor-pointer hover:bg-[#2ED6A3]/35'
                        : canJump
                          ? 'border-[#20304A]/20 bg-white/85 text-[#20304A] dark:bg-[#1C2A4B] dark:text-[#E2ECF9] cursor-pointer'
                          : isNight
                            ? 'border-white/10 bg-[#121D38] text-[#8EA4C4] cursor-not-allowed opacity-75'
                            : 'border-[#DCE7E3] bg-white/60 text-[#5B708E] cursor-not-allowed opacity-75'
                  }`}
                >
                  <span className="font-mono-num opacity-80">{idx + 1}.</span>
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {/* Shared Scaffolding & Language Toolbar */}
          {step !== 'ceremony' && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('mode');
                    onDifficultyChange('a2');
                  }}
                  aria-pressed={difficultyMode === 'a2'}
                  className={`min-h-[34px] rounded-xl border px-3 py-1 text-xs font-extrabold whitespace-nowrap shrink-0 cursor-pointer ${
                    difficultyMode === 'a2'
                      ? 'border-[#2ED6A3] bg-[#2ED6A3] text-[#131E31]'
                      : neutralBtnClass
                  }`}
                >
                  {copy.scotlandModeA2Label}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('mode');
                    onDifficultyChange('b1');
                  }}
                  aria-pressed={difficultyMode === 'b1'}
                  className={`min-h-[34px] rounded-xl border px-3 py-1 text-xs font-extrabold whitespace-nowrap shrink-0 cursor-pointer ${
                    difficultyMode === 'b1'
                      ? 'border-[#F2C66D] bg-[#F2C66D] text-[#131E31]'
                      : neutralBtnClass
                  }`}
                >
                  {copy.scotlandModeB1Label}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('click');
                    setShowThaiSupport((prev) => !prev);
                  }}
                  className={`inline-flex min-h-[34px] items-center rounded-xl border px-3 py-1 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer ${neutralBtnClass}`}
                >
                  {showThaiSupport
                    ? copy.scotlandPerformHideThaiSupport
                    : copy.scotlandPerformShowThaiSupport}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    stopPlayback();
                    onStopSpeech();
                    onOpenJournal();
                  }}
                  className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer ${neutralBtnClass}`}
                >
                  <BookOpen className="h-3.5 w-3.5 text-[#2B8C7E]" aria-hidden="true" />
                  <span>{copy.scotlandOpenJournalButton}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: INVITATION */}
          {step === 'invitation' && (
            <div className="space-y-4">
              <div className={`rounded-2xl border p-4 space-y-4 ${insetSurface}`}>
                <h3 className="font-display text-base font-extrabold">
                  {copy.scotlandPerformInvitationHeading}
                </h3>

                {/* Eilidh Invitation Card */}
                <div
                  className={`flex items-start gap-3 rounded-2xl border p-3.5 ${
                    isNight ? 'border-[#2E6B5E]/60 bg-[#132934]' : 'border-[#2E6B5E]/25 bg-white'
                  }`}
                >
                  <ScotlandNpcPortraitSVG
                    npcId="eilidh"
                    isNight={isNight}
                    className="h-12 w-12 rounded-xl"
                  />
                  <div className="min-w-0 space-y-1">
                    <p className="font-display text-xs font-extrabold text-[#2E6B5E] dark:text-[#2ED6A3]">
                      Eilidh MacLeod · Highland Exchange Host
                    </p>
                    <p className="text-sm font-semibold leading-relaxed">
                      “{EILIDH_PERFORM_DIALOGUE.ready.en}”
                    </p>
                    {showThaiSupport && (
                      <p className={`text-xs ${isNight ? 'text-[#B6C7DE]' : 'text-[#526785]'}`}>
                        {EILIDH_PERFORM_DIALOGUE.ready.th}
                      </p>
                    )}
                  </div>
                </div>

                {/* Fiona Guidance Card */}
                <div
                  className={`flex items-start gap-3 rounded-2xl border p-3.5 ${
                    isNight ? 'border-[#7B5EA7]/60 bg-[#1B1E3C]' : 'border-[#7B5EA7]/25 bg-white'
                  }`}
                >
                  <ScotlandNpcPortraitSVG
                    npcId="fiona"
                    isNight={isNight}
                    className="h-12 w-12 rounded-xl"
                  />
                  <div className="min-w-0 space-y-1">
                    <p className="font-display text-xs font-extrabold text-[#6A448E] dark:text-[#C09CEB]">
                      Fiona Campbell · Cultural Heritage Guide
                    </p>
                    <p className="text-sm font-semibold leading-relaxed">
                      “{FIONA_PERFORM_DIALOGUE.ready.en}”
                    </p>
                    {showThaiSupport && (
                      <p className={`text-xs ${isNight ? 'text-[#B6C7DE]' : 'text-[#526785]'}`}>
                        {FIONA_PERFORM_DIALOGUE.ready.th}
                      </p>
                    )}
                  </div>
                </div>

                {/* Challenge Expectations */}
                <div
                  className={`rounded-xl border p-3.5 space-y-2 ${
                    isNight ? 'border-white/10 bg-[#131F39]' : 'border-[#20304A]/10 bg-white'
                  }`}
                >
                  <p className="font-display text-xs font-extrabold uppercase tracking-wide text-[#24B8B0]">
                    {copy.scotlandPerformExpectationsHeading}
                  </p>
                  <ul className="space-y-1.5 text-xs sm:text-sm font-medium">
                    <li>1. Speak for about 60–90 seconds (guided pace, never cuts you off).</li>
                    <li>2. Select and reference at least 2 Scottish–Thai cultural examples.</li>
                    <li>3. Compare at least 1 clear similarity and 1 real difference.</li>
                    <li>4. Include a clear introduction and thoughtful conclusion.</li>
                    <li>5. Answer 2 audience Q&A questions from Eilidh and Fiona.</li>
                  </ul>
                  {showThaiSupport && (
                    <p className={`pt-1 text-xs ${isNight ? 'text-[#B6C7DE]' : 'text-[#526785]'}`}>
                      เตรียมพูดเปรียบเทียบสกอตแลนด์–ไทย ประมาณ 60–90 วินาที: เลือกหลักฐานอย่างน้อย 2 หัวข้อ บอกความเหมือนและความต่างอย่างละ 1 ข้อขึ้นไป มีบทนำ–สรุป และตอบคำถาม 2 ข้อจากไอลีดและฟิโอนา
                    </p>
                  )}
                </div>

                {/* Audio Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('click');
                      onSpeakText(instructionReadAloudText, { rate: 0.94, pitch: 1.02 });
                    }}
                    className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer ${neutralBtnClass}`}
                  >
                    <Volume2 className="h-4 w-4 text-[#24B8B0]" aria-hidden="true" />
                    <span>{copy.scotlandPerformListenInstructions}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('click');
                      onStopSpeech();
                    }}
                    className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer ${neutralBtnClass}`}
                  >
                    <Square className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.scotlandPracticeStopAudioButton}</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onStopSpeech();
                    onPlaySfx('click');
                    onReviewPractice();
                  }}
                  className={`inline-flex min-h-[40px] items-center rounded-xl border px-4 py-2 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer ${neutralBtnClass}`}
                >
                  {copy.scotlandLochsideReviewPracticeButton}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onStopSpeech();
                    onPlaySfx('select');
                    setStep('prepare');
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2.5 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#49e2b3] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>{copy.scotlandPerformStartPrepButton}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PREPARE YOUR SHOWCASE */}
          {step === 'prepare' && (
            <div className="space-y-5">
              {/* Part 1: Select at least 2 of the 5 Cultural Evidence Topics */}
              <div className={`rounded-2xl border p-4 space-y-3 ${insetSurface}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display text-sm sm:text-base font-extrabold">
                      {copy.scotlandPerformEvidenceHeading}
                    </h3>
                    <p
                      className={`mt-0.5 text-xs ${
                        isNight ? 'text-[#B6C7DE]' : 'text-[#526785]'
                      }`}
                    >
                      {copy.scotlandPerformEvidenceHint}
                    </p>
                  </div>
                  <span
                    className={`font-mono-num text-xs font-extrabold ${
                      selectedEvidenceIds.length >= 2
                        ? isNight
                          ? 'text-[#2ED6A3]'
                          : 'text-[#0E7A74]'
                        : isNight
                          ? 'text-[#F2C66D]'
                          : 'text-[#B45309]'
                    }`}
                  >
                    {selectedEvidenceIds.length}/5 {copy.scotlandPerformEvidenceCountLabel}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {SCOTLAND_PERFORM_EVIDENCE_TOPICS.map((topic) => {
                    const selected = selectedEvidenceIds.includes(topic.id);
                    const userBuildSentence = builtSentences[topic.id]?.trim();
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => toggleEvidenceTopic(topic.id)}
                        aria-pressed={selected}
                        className={`w-full rounded-2xl border-2 p-3 text-left transition-colors cursor-pointer ${
                          selected
                            ? isNight
                              ? 'border-[#2ED6A3] bg-[#132D33]'
                              : 'border-[#2E6B5E] bg-[#ECFDF7]'
                            : isNight
                              ? 'border-white/10 bg-[#15223D] hover:border-white/25'
                              : 'border-[#20304A]/12 bg-white hover:border-[#2E6B5E]/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[11px] font-extrabold uppercase tracking-wide opacity-80">
                              {topic.categoryLabel[language]} <span aria-hidden="true">·</span>{' '}
                              {topic.title[language]}
                            </p>
                            <p className="mt-1 text-xs font-semibold leading-relaxed">
                              <strong>Similar:</strong> {topic.similaritySummary.en}
                            </p>
                            <p className="mt-0.5 text-xs leading-relaxed opacity-90">
                              <strong>Contrast:</strong> {topic.differenceSummary.en}
                            </p>
                            {difficultyMode === 'b1' && (
                              <p
                                className={`mt-1 text-[11px] italic ${
                                  isNight ? 'text-[#C8D4E6]' : 'text-[#48607E]'
                                }`}
                              >
                                {topic.b1Context[language]}
                              </p>
                            )}
                            {userBuildSentence && (
                              <p
                                className={`mt-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${
                                  isNight
                                    ? 'border-[#F2C66D]/35 bg-[#1E2B48] text-[#F2C66D]'
                                    : 'border-[#F59E0B]/35 bg-[#FFFBEB] text-[#92400E]'
                                }`}
                              >
                                {copy.scotlandPerformYourBuildQuoteLabel}: “{userBuildSentence}”
                              </p>
                            )}
                            <p
                              className={`mt-1.5 text-[11px] font-semibold ${
                                isNight ? 'text-[#8EE3D8]' : 'text-[#0E7A74]'
                              }`}
                            >
                              {topic.keywords.join(' · ')}
                            </p>
                          </div>

                          <span
                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 ${
                              selected
                                ? 'border-[#2ED6A3] bg-[#2ED6A3] text-[#131E31]'
                                : 'border-current/25'
                            }`}
                          >
                            {selected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Part 2: Build Your Own 5-Part Comparison Outline */}
              <div className={`rounded-2xl border p-4 space-y-3.5 ${insetSurface}`}>
                <div>
                  <h3 className="font-display text-sm sm:text-base font-extrabold">
                    {copy.scotlandPerformPlannerHeading}
                  </h3>
                  <p
                    className={`mt-0.5 text-xs ${isNight ? 'text-[#B6C7DE]' : 'text-[#526785]'}`}
                  >
                    {copy.scotlandPerformPlannerHint}
                  </p>
                </div>

                {/* Vocabulary & Connector Reference Strip */}
                <div
                  className={`rounded-xl border p-2.5 ${
                    isNight ? 'border-white/10 bg-[#121D36]' : 'border-[#20304A]/10 bg-white'
                  }`}
                >
                  <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#24B8B0]">
                    {copy.scotlandPerformConnectorsHeading}
                  </p>
                  <p className="mt-1 text-xs font-bold leading-relaxed">
                    {SCOTLAND_PERFORM_CONNECTORS.map((c) =>
                      showThaiSupport ? `${c.phrase} (${c.th})` : c.phrase,
                    ).join(' · ')}
                  </p>
                </div>

                {/* 5 Structured Note Fields */}
                <div className="space-y-3">
                  {SCOTLAND_PERFORM_PLANNER_FIELDS.map((field) => {
                    const value = outline[field.key];
                    const starter =
                      difficultyMode === 'a2' ? field.starterChipA2 : field.starterChipB1;
                    return (
                      <div
                        key={field.key}
                        className={`rounded-xl border p-3 space-y-1.5 ${
                          isNight
                            ? 'border-white/12 bg-[#14203C]'
                            : 'border-[#20304A]/12 bg-white'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label
                            htmlFor={`perform-outline-${field.key}`}
                            className="font-display text-xs font-extrabold"
                          >
                            {field.label[language]}
                          </label>
                          <button
                            type="button"
                            onClick={() => insertStarterPhrase(field.key, starter)}
                            className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] font-bold whitespace-nowrap shrink-0 cursor-pointer ${neutralBtnClass}`}
                          >
                            <span>+ {copy.scotlandPerformInsertStarterButton}</span>
                          </button>
                        </div>
                        <p
                          className={`text-[11px] ${
                            isNight ? 'text-[#B6C7DE]' : 'text-[#526785]'
                          }`}
                        >
                          {difficultyMode === 'a2'
                            ? field.promptA2[language]
                            : field.promptB1[language]}
                        </p>
                        <textarea
                          id={`perform-outline-${field.key}`}
                          rows={2}
                          maxLength={field.maxLength}
                          value={value}
                          onChange={(e) => updateOutlineField(field.key, e.target.value)}
                          placeholder={field.placeholder[language]}
                          className={`w-full rounded-xl border px-3 py-2 text-xs sm:text-sm font-medium focus:outline-2 focus:outline-[#24B8B0] ${
                            isNight
                              ? 'border-white/15 bg-[#0F182D] text-[#F7F9FC] placeholder:text-[#7E92B2]'
                              : 'border-[#20304A]/15 bg-[#F8FBFD] text-[#1E2E46] placeholder:text-[#7E92B2]'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Optional Collapsible A2 Sample Reference */}
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('click');
                      setShowSampleRef((s) => !s);
                    }}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold underline underline-offset-2 cursor-pointer ${
                      isNight ? 'text-[#F2C66D]' : 'text-[#0E7A74]'
                    }`}
                  >
                    <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>
                      {showSampleRef
                        ? copy.scotlandPerformHideSampleButton
                        : copy.scotlandPerformShowSampleButton}
                    </span>
                  </button>
                  {showSampleRef && (
                    <div
                      className={`mt-2 rounded-xl border p-3 text-xs leading-relaxed ${
                        isNight
                          ? 'border-[#F2C66D]/35 bg-[#1B233D] text-[#E2ECF9]'
                          : 'border-[#F59E0B]/35 bg-[#FFFDF2] text-[#394E6E]'
                      }`}
                    >
                      <p>{SCOTLAND_PERFORM_SAMPLE_REFERENCE.en}</p>
                      {showThaiSupport && (
                        <p className="mt-1.5 opacity-85">{SCOTLAND_PERFORM_SAMPLE_REFERENCE.th}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('click');
                    setStep('invitation');
                  }}
                  className={`inline-flex min-h-[40px] items-center rounded-xl border px-4 py-2 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer ${neutralBtnClass}`}
                >
                  {copy.backButton}
                </button>

                <button
                  type="button"
                  disabled={!prepReady}
                  onClick={() => {
                    onStopSpeech();
                    onPlaySfx('select');
                    setStep('speech');
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2.5 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#49e2b3] whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <span>{copy.scotlandPerformGoSpeechButton}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DELIVER YOUR SPEECH */}
          {step === 'speech' && (
            <div className="space-y-4">
              {/* Showcase Audience Header */}
              <div
                className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 ${insetSurface}`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 overflow-hidden rounded-2xl border-2 border-[#2ED6A3]">
                    <AvatarPortraitSVG
                      avatar={avatar}
                      variant="bust"
                      appearance={appearance}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-sm sm:text-base font-extrabold">
                      {copy.scotlandPerformSpeechHeading}
                    </h3>
                    <p className={`text-xs ${isNight ? 'text-[#B6C7DE]' : 'text-[#526785]'}`}>
                      {copy.scotlandPerformSpeechSubtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <ScotlandNpcPortraitSVG
                    npcId="eilidh"
                    isNight={isNight}
                    className="h-10 w-10 rounded-xl"
                  />
                  <ScotlandNpcPortraitSVG
                    npcId="fiona"
                    isNight={isNight}
                    className="h-10 w-10 rounded-xl"
                  />
                </div>
              </div>

              {/* Collapsible Outline & Selected Evidence Reference */}
              <div
                className={`rounded-2xl border-2 overflow-hidden ${
                  isNight ? 'border-[#2ED6A3]/45 bg-[#122931]' : 'border-[#2E6B5E]/35 bg-[#F2FBF8]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('click');
                    setShowSpeechNotes((s) => !s);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-xs font-extrabold cursor-pointer ${
                    isNight ? 'bg-[#0F2027] text-[#2ED6A3]' : 'bg-[#DFF4EE] text-[#154B41]'
                  }`}
                >
                  <span>
                    {copy.scotlandPerformToggleNotesButton} ({chosenTopics.length})
                  </span>
                  <span>{showSpeechNotes ? '−' : '+'}</span>
                </button>

                {showSpeechNotes && (
                  <div className="space-y-1.5 p-4 text-xs leading-relaxed">
                    <p>
                      <strong>1. Intro:</strong> {outline.introduction}
                    </p>
                    <p>
                      <strong>2. Similarity:</strong> {outline.similarity}
                    </p>
                    <p>
                      <strong>3. Difference:</strong> {outline.difference}
                    </p>
                    <p>
                      <strong>4. Evidence:</strong> {outline.evidenceNotes}
                    </p>
                    <p>
                      <strong>Topics:</strong>{' '}
                      {chosenTopics.map((t) => t.title[language]).join(' · ')}
                    </p>
                    <p>
                      <strong>5. Conclusion:</strong> {outline.conclusion}
                    </p>
                  </div>
                )}
              </div>

              {/* Pace Guidance Notice (Never auto-stops or penalizes) */}
              <div
                className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold ${
                  isNight
                    ? 'border-white/12 bg-[#172542] text-[#C8D4E6]'
                    : 'border-[#20304A]/12 bg-white text-[#394E6E]'
                }`}
              >
                <span>{copy.scotlandPerformTimerGuidanceLabel}</span>
                <span className="font-mono-num font-extrabold text-[#24B8B0]">
                  {formatTimerSeconds(recElapsedBySlot.speech)}
                </span>
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

              {/* Mic Controls OR No-Mic Aloud Fallback */}
              {!noMicMode && micSupported ? (
                <div className={`rounded-2xl border p-4 space-y-3 ${insetSurface}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {activeRecSlot === 'speech' ? (
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span
                          className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold ${
                            isNight
                              ? 'bg-[#3C1E28] text-[#FFB5A7]'
                              : 'bg-[#FFEBE7] text-[#A43220]'
                          }`}
                        >
                          <span>{copy.spotSpeakRecordingStatus}</span>
                          <span className="font-mono-num">
                            {formatTimerSeconds(recElapsedBySlot.speech)}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={handleStopRecording}
                          className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-[#20304A] px-4 py-2 text-xs font-extrabold text-white whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <Square className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{copy.spotSpeakStopMicButton}</span>
                        </button>
                      </div>
                    ) : audioUrls.speech ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleTogglePlaybackSlot('speech')}
                          className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-[#24B8B0] px-4 py-2 text-xs font-extrabold text-[#131E31] whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          {playingSlot === 'speech' ? (
                            <Pause className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Play className="h-4 w-4" aria-hidden="true" />
                          )}
                          <span>
                            {playingSlot === 'speech'
                              ? copy.spotSpeakPauseAudioButton
                              : copy.spotSpeakPlaybackButton}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRetrySlot('speech')}
                          className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer ${neutralBtnClass}`}
                        >
                          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{copy.spotSpeakRetryButton}</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={
                          requestingSlot === 'speech' ||
                          activeRecSlot !== null ||
                          requestingSlot !== null
                        }
                        onClick={() => handleStartRecordingSlot('speech')}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#E07A68] px-5 py-2.5 text-sm font-extrabold text-white shadow hover:bg-[#d36855] whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-55"
                      >
                        <Mic className="h-4 w-4" aria-hidden="true" />
                        <span>{copy.spotSpeakStartMicButton}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (recorderRef.current) {
                          recorderRef.current.dispose();
                          recorderRef.current = null;
                        }
                        setActiveRecSlot(null);
                        setRequestingSlot(null);
                        releaseSlotAudio('speech');
                        setNoMicMode(true);
                      }}
                      className={`text-xs font-semibold underline underline-offset-2 cursor-pointer ${
                        isNight ? 'text-[#B6C7DE]' : 'text-[#4F6482]'
                      }`}
                    >
                      {copy.spotSpeakNoMicToggle}
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`rounded-2xl border p-4 space-y-3 ${insetSurface}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold opacity-90">
                      {copy.scotlandPracticeNoMicIntro}
                    </p>
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

                  <label className="flex min-h-[44px] items-center gap-2.5 text-xs sm:text-sm font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={speechAloudConfirmed}
                      onChange={(e) => {
                        onPlaySfx('click');
                        setSpeechAloudConfirmed(e.target.checked);
                      }}
                      className="h-4 w-4 accent-[#24B8B0]"
                    />
                    <span>{copy.scotlandPerformNoMicAloudCheck}</span>
                  </label>
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  disabled={activeRecSlot !== null}
                  onClick={() => {
                    stopPlayback();
                    onPlaySfx('click');
                    setStep('prepare');
                  }}
                  className={`inline-flex min-h-[40px] items-center rounded-xl border px-4 py-2 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50 ${neutralBtnClass}`}
                >
                  {copy.backButton}
                </button>

                <button
                  type="button"
                  disabled={!speechReady || activeRecSlot !== null}
                  onClick={() => {
                    stopPlayback();
                    onStopSpeech();
                    onPlaySfx('select');
                    setStep('qa');
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2.5 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#49e2b3] whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <span>{copy.scotlandPerformGoQaButton}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: LIVE CULTURAL Q&A (Eilidh & Fiona) */}
          {step === 'qa' && (
            <div className="space-y-4">
              <div className={`rounded-2xl border p-3.5 ${insetSurface}`}>
                <h3 className="font-display text-sm sm:text-base font-extrabold">
                  {copy.scotlandPerformQaHeading}
                </h3>
                <p className={`mt-0.5 text-xs ${isNight ? 'text-[#B6C7DE]' : 'text-[#526785]'}`}>
                  {copy.scotlandPerformQaIntro}
                </p>
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

              {SCOTLAND_PERFORM_QA_QUESTIONS.map((q) => {
                const isRec = activeRecSlot === q.id;
                const isReq = requestingSlot === q.id;
                const recordedUrl = audioUrls[q.id];
                const isDone = Boolean(recordedUrl) || qaAloudConfirmed[q.id];
                const showHint = qaShowHint[q.id];
                const questionAudioText =
                  difficultyMode === 'a2' ? q.question.en : `${q.question.en} ${q.b1ExtensionPrompt.en}`;

                return (
                  <div
                    key={q.id}
                    className={`rounded-2xl border p-4 space-y-3 ${
                      isDone
                        ? isNight
                          ? 'border-[#2ED6A3]/60 bg-[#142D31]'
                          : 'border-[#2ED6A3] bg-[#F2FCF9]'
                        : insetSurface
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-start gap-3 min-w-0">
                        <ScotlandNpcPortraitSVG
                          npcId={q.speakerId}
                          isNight={isNight}
                          className="h-12 w-12 rounded-xl"
                        />
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold opacity-80">
                            {q.speakerName[language]} <span aria-hidden="true">·</span>{' '}
                            {q.focusLabel[language]}
                          </p>
                          <p className="font-display text-sm sm:text-base font-extrabold leading-snug">
                            “{q.question.en}”
                          </p>
                          {difficultyMode === 'a2' && (
                            <p
                              className={`mt-0.5 text-xs ${
                                isNight ? 'text-[#B6C7DE]' : 'text-[#526785]'
                              }`}
                            >
                              {q.a2SupportQuestion[language]}
                            </p>
                          )}
                          {difficultyMode === 'b1' && (
                            <p
                              className={`mt-0.5 text-xs italic ${
                                isNight ? 'text-[#F2C66D]' : 'text-[#8E5B08]'
                              }`}
                            >
                              {q.b1ExtensionPrompt[language]}
                            </p>
                          )}
                          {showThaiSupport && (
                            <p
                              className={`mt-1 text-xs ${
                                isNight ? 'text-[#B6C7DE]' : 'text-[#526785]'
                              }`}
                            >
                              {q.question.th}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isDone && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-[#2ED6A3] px-2 py-1 text-[11px] font-extrabold text-[#131E31]">
                            <Check className="h-3 w-3" aria-hidden="true" />
                            <span>{copy.scotlandPerformQaDoneBadge}</span>
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            onPlaySfx('click');
                            onSpeakText(questionAudioText, {
                              pitch: q.speakerId === 'eilidh' ? 1.04 : 0.98,
                              rate: q.speakerId === 'eilidh' ? 0.93 : 0.91,
                            });
                          }}
                          className={`inline-flex min-h-[34px] items-center gap-1 rounded-xl border px-2.5 py-1 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer ${neutralBtnClass}`}
                        >
                          <Volume2 className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
                          <span>{copy.scotlandPracticeListenPromptButton}</span>
                        </button>
                      </div>
                    </div>

                    {/* Starter + Toggleable Hint */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className={`font-semibold ${isNight ? 'text-[#F2C66D]' : 'text-[#0E7A74]'}`}>
                        “{difficultyMode === 'a2' ? q.starterA2 : q.starterB1}”
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onPlaySfx('click');
                          setQaShowHint((prev) => ({ ...prev, [q.id]: !prev[q.id] }));
                        }}
                        className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold whitespace-nowrap shrink-0 cursor-pointer ${neutralBtnClass}`}
                      >
                        <HelpCircle className="h-3 w-3" aria-hidden="true" />
                        <span>{showHint ? copy.scotlandPracticeHideFramesLabel : copy.scotlandPracticeShowFramesLabel}</span>
                      </button>
                    </div>

                    {showHint && (
                      <div
                        className={`rounded-xl border p-2.5 text-xs ${
                          isNight ? 'border-white/10 bg-[#101A30]' : 'border-[#20304A]/10 bg-white'
                        }`}
                      >
                        {q.hint[language]}
                      </div>
                    )}

                    {/* Recording or No-Mic Answer Control */}
                    {!noMicMode && micSupported ? (
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        {isRec ? (
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span
                              className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold ${
                                isNight
                                  ? 'bg-[#3C1E28] text-[#FFB5A7]'
                                  : 'bg-[#FFEBE7] text-[#A43220]'
                              }`}
                            >
                              <span>{copy.spotSpeakRecordingStatus}</span>
                              <span className="font-mono-num">
                                {formatTimerSeconds(recElapsedBySlot[q.id])}
                              </span>
                            </span>
                            <button
                              type="button"
                              onClick={handleStopRecording}
                              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#20304A] px-3.5 py-1.5 text-xs font-bold text-white whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <Square className="h-3 w-3" aria-hidden="true" />
                              <span>{copy.spotSpeakStopMicButton}</span>
                            </button>
                          </div>
                        ) : recordedUrl ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleTogglePlaybackSlot(q.id)}
                              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#24B8B0] px-3.5 py-1.5 text-xs font-extrabold text-[#131E31] whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              {playingSlot === q.id ? (
                                <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                              ) : (
                                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                              )}
                              <span>
                                {playingSlot === q.id
                                  ? copy.spotSpeakPauseAudioButton
                                  : copy.spotSpeakPlaybackButton}
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRetrySlot(q.id)}
                              className={`inline-flex min-h-[38px] items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer ${neutralBtnClass}`}
                            >
                              <RotateCcw className="h-3 w-3" aria-hidden="true" />
                              <span>{copy.spotSpeakRetryButton}</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={
                              isReq || activeRecSlot !== null || requestingSlot !== null
                            }
                            onClick={() => handleStartRecordingSlot(q.id)}
                            className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-[#E07A68] px-4 py-2 text-xs font-extrabold text-white shadow hover:bg-[#d36855] whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-55"
                          >
                            <Mic className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{copy.spotSpeakStartMicButton}</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (recorderRef.current) {
                              recorderRef.current.dispose();
                              recorderRef.current = null;
                            }
                            setActiveRecSlot(null);
                            setRequestingSlot(null);
                            releaseSlotAudio('qa_eilidh');
                            releaseSlotAudio('qa_fiona');
                            setNoMicMode(true);
                          }}
                          className={`text-[11px] font-semibold underline underline-offset-2 cursor-pointer ${
                            isNight ? 'text-[#B6C7DE]' : 'text-[#4F6482]'
                          }`}
                        >
                          {copy.spotSpeakNoMicToggle}
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <label className="flex min-h-[40px] items-center gap-2 text-xs font-bold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={qaAloudConfirmed[q.id]}
                            onChange={(e) => {
                              onPlaySfx('click');
                              setQaAloudConfirmed((prev) => ({
                                ...prev,
                                [q.id]: e.target.checked,
                              }));
                            }}
                            className="h-4 w-4 accent-[#24B8B0]"
                          />
                          <span>{copy.scotlandPerformQaNoMicCheck}</span>
                        </label>
                        {micSupported && (
                          <button
                            type="button"
                            onClick={() => {
                              setMicError(null);
                              setNoMicMode(false);
                            }}
                            className={`text-[11px] font-semibold underline underline-offset-2 cursor-pointer ${
                              isNight ? 'text-[#B6C7DE]' : 'text-[#4F6482]'
                            }`}
                          >
                            {copy.spotSpeakMicToggle}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Scripted Appreciative NPC Reply */}
                    {isDone && (
                      <div
                        className={`rounded-xl border p-2.5 text-xs font-semibold ${
                          isNight
                            ? 'border-[#2ED6A3]/40 bg-[#123030] text-[#D8FAF0]'
                            : 'border-[#24B8B0]/35 bg-[#EAF9F6] text-[#153B38]'
                        }`}
                      >
                        <strong>{q.speakerName[language]}:</strong> “{q.npcReply[language]}”
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  disabled={activeRecSlot !== null}
                  onClick={() => {
                    stopPlayback();
                    onPlaySfx('click');
                    setStep('speech');
                  }}
                  className={`inline-flex min-h-[40px] items-center rounded-xl border px-4 py-2 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50 ${neutralBtnClass}`}
                >
                  {copy.backButton}
                </button>

                <button
                  type="button"
                  disabled={!allQaReady || activeRecSlot !== null}
                  onClick={() => {
                    stopPlayback();
                    onStopSpeech();
                    onPlaySfx('select');
                    setStep('reflect');
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2.5 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#49e2b3] whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <span>{copy.scotlandPerformGoReflectButton}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: SELF-REFLECTION & REPLAY */}
          {step === 'reflect' && (
            <div className="space-y-4">
              <div className={`rounded-2xl border p-4 space-y-3 ${insetSurface}`}>
                <h3 className="font-display text-sm sm:text-base font-extrabold">
                  {copy.scotlandPerformReflectHeading}
                </h3>

                {/* Temporary Audio Self-Playback Review Row */}
                {(audioUrls.speech || audioUrls.qa_eilidh || audioUrls.qa_fiona) && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold opacity-85">
                      {copy.scotlandPerformReflectAudioHeading}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          { id: 'speech', label: copy.scotlandPerformStepSpeech },
                          { id: 'qa_eilidh', label: 'Eilidh Q&A' },
                          { id: 'qa_fiona', label: 'Fiona Q&A' },
                        ] as const
                      )
                        .filter((slot) => Boolean(audioUrls[slot.id]))
                        .map((slot) => (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => handleTogglePlaybackSlot(slot.id)}
                            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl bg-[#24B8B0] px-3 py-1.5 text-xs font-extrabold text-[#131E31] whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            {playingSlot === slot.id ? (
                              <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                            ) : (
                              <Play className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                            <span>{slot.label}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {/* Honest 6-Item Self-Reflection Checklist (All start unchecked) */}
                <p className="text-xs font-bold pt-1">
                  {copy.scotlandPerformReflectChecklistPrompt}
                </p>
                <div className="space-y-2">
                  {SCOTLAND_PERFORM_REFLECTION_ITEMS.map((item) => {
                    const checked = reflectionChecks[item.key];
                    return (
                      <label
                        key={item.key}
                        className={`flex min-h-[42px] items-center gap-3 rounded-xl border px-3 py-2 text-xs sm:text-sm font-semibold cursor-pointer ${
                          checked
                            ? isNight
                              ? 'border-[#2ED6A3]/60 bg-[#132D33]'
                              : 'border-[#2E6B5E] bg-[#F2FCF9]'
                            : isNight
                              ? 'border-white/10 bg-[#15223D]'
                              : 'border-[#20304A]/12 bg-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleReflectionCheck(item.key)}
                          className="h-4 w-4 shrink-0 accent-[#24B8B0]"
                        />
                        <span>{item.label[language]}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Honest Non-AI Self-Reflection & Practice Guidance */}
              <div
                className={`rounded-2xl border p-4 space-y-2 text-xs sm:text-sm ${
                  isNight
                    ? 'border-[#2ED6A3]/40 bg-[#123030] text-[#E6FAF5]'
                    : 'border-[#24B8B0]/35 bg-[#EAF9F6] text-[#153B38]'
                }`}
              >
                <p className="font-display text-xs font-extrabold uppercase tracking-wide text-[#24B8B0]">
                  {copy.scotlandPerformReflectGuidanceTitle}
                </p>
                <p>
                  <strong className="font-display">{copy.spotSpeakFeedbackPositiveLabel}:</strong>{' '}
                  {SCOTLAND_PERFORM_GUIDANCE_FEEDBACK.positive[language]}
                </p>
                <p>
                  <strong className="font-display">{copy.spotSpeakFeedbackTipLabel}:</strong>{' '}
                  {SCOTLAND_PERFORM_GUIDANCE_FEEDBACK.improvement[language]}
                </p>
                <p>
                  <strong className="font-display">{copy.spotSpeakFeedbackNextLabel}:</strong>{' '}
                  {SCOTLAND_PERFORM_GUIDANCE_FEEDBACK.nextStep[language]}
                </p>
                <p
                  className={`pt-1 text-[11px] leading-snug ${
                    isNight ? 'text-[#9CB2D1]' : 'text-[#48607E]'
                  }`}
                >
                  {copy.scotlandPerformReflectDisclaimer}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    stopPlayback();
                    onPlaySfx('click');
                    setStep('qa');
                  }}
                  className={`inline-flex min-h-[42px] items-center rounded-xl border px-4 py-2 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer ${neutralBtnClass}`}
                >
                  {copy.backButton}
                </button>

                <button
                  type="button"
                  disabled={!anyReflectionChecked}
                  onClick={handleFinishPerform}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2.5 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#f7d487] whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <Award className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {alreadyCompleted
                      ? copy.scotlandPerformReplayFinishButton
                      : copy.scotlandPerformFinishButton}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* CEREMONY: SCOTLAND HIGHLANDS PASSPORT STAMP + XP CELEBRATION */}
          {step === 'ceremony' && (
            <div className="space-y-4">
              <div
                className={`rounded-3xl border-2 p-5 sm:p-6 text-center ${
                  isNight
                    ? 'border-[#2ED6A3]/65 bg-[#15243E]'
                    : 'border-[#2E6B5E]/40 bg-gradient-to-b from-[#EFF9F6] to-[#FFFDF8]'
                }`}
              >
                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#24B8B0]">
                  <Sparkles className="h-4 w-4 text-[#F2C66D]" aria-hidden="true" />
                  <span>{copy.scotlandPerformCeremonyBadge}</span>
                </div>

                <h3
                  className={`mt-1 font-display text-2xl font-extrabold ${
                    isNight ? 'text-[#2ED6A3]' : 'text-[#1E5B4C]'
                  }`}
                >
                  {copy.scotlandPerformCeremonyTitle}
                </h3>

                <div className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-[#F2C66D] px-3.5 py-1 font-display text-xs font-extrabold text-[#131E31]">
                  <Award className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.scotlandPerformAmbassadorTitle}</span>
                </div>

                <p
                  className={`mt-2 text-xs sm:text-sm font-medium ${
                    isNight ? 'text-[#D6E1F0]' : 'text-[#48607E]'
                  }`}
                >
                  {wasFirstCompletion
                    ? copy.scotlandPerformCeremonySubtitle
                    : copy.scotlandPerformCeremonyReplaySubtitle}
                </p>

                {/* Scottish Highlands Stamp Medallion */}
                <div className="my-5 flex justify-center">
                  <div
                    className={`rounded-full border-2 p-3 shadow-md ${
                      isNight
                        ? 'border-[#2ED6A3]/55 bg-[#2ED6A3]/10'
                        : 'border-[#2E6B5E]/50 bg-[#E6F7F1]'
                    }`}
                  >
                    <ScotlandHighlandsStampSVG
                      language={language}
                      appearance={appearance}
                      earned={true}
                      completedAt={completedAt}
                      sizeClass="h-40 w-40"
                    />
                  </div>
                </div>

                {/* XP Breakdown Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  {wasFirstCompletion && (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#F2C66D] px-3.5 py-1.5 font-mono-num text-sm font-extrabold text-[#131E31] shadow">
                      +{SCOTLAND_PERFORM_XP_REWARD} {copy.xpLabel}
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold ${insetSurface}`}
                  >
                    <span className="font-mono-num">
                      50 + 50 + 50 + 100 = {TOTAL_SCOTLAND_MISSION_XP} {copy.xpLabel}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{copy.scotlandPerformTotalXpNote}</span>
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold ${insetSurface}`}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
                    <span className="font-mono-num">
                      {currentTotalXp} {copy.xpLabel}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{copy.scotlandPerformCumulativeXpNote}</span>
                  </span>
                </div>

                {/* Eilidh & Fiona Congratulations */}
                <div
                  className={`mt-4 rounded-2xl border p-3.5 text-left text-xs space-y-1.5 ${insetSurface}`}
                >
                  <p>
                    <strong>Eilidh MacLeod:</strong> “{EILIDH_PERFORM_DIALOGUE.completed[language]}”
                  </p>
                  <p>
                    <strong>Fiona Campbell:</strong> “{FIONA_PERFORM_DIALOGUE.completed[language]}”
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      releaseAllAudioResources();
                      onStopSpeech();
                      onPlaySfx('click');
                      onClose();
                    }}
                    className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-4 py-2 text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 cursor-pointer ${neutralBtnClass}`}
                  >
                    <span>{copy.scotlandPerformStayScotlandButton}</span>
                  </button>

                  {canReplayCountry && onRequestReplayCountry && (
                    <button
                      type="button"
                      onClick={() => {
                        releaseAllAudioResources();
                        onStopSpeech();
                        onPlaySfx('click');
                        onClose();
                        onRequestReplayCountry();
                      }}
                      className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 cursor-pointer ${neutralBtnClass}`}
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{copy.scotlandPerformReplayButton}</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      releaseAllAudioResources();
                      onStopSpeech();
                      onViewPassport();
                    }}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#24B8B0] px-4 py-2.5 font-display text-xs sm:text-sm font-extrabold text-[#131E31] shadow hover:bg-[#34c8c0] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Stamp className="h-4 w-4" aria-hidden="true" />
                    <span>{copy.scotlandPerformViewPassportButton}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      releaseAllAudioResources();
                      onStopSpeech();
                      onReturnWorldMap();
                    }}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#F2C66D] px-4 py-2.5 font-display text-xs sm:text-sm font-extrabold text-[#131E31] shadow hover:bg-[#f7d487] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Compass className="h-4 w-4" aria-hidden="true" />
                    <span>{copy.backToMap}</span>
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
