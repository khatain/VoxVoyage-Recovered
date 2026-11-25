import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Compass,
  Eye,
  EyeOff,
  Hammer,
  Languages,
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
  ResolvedAppearance,
  ScotlandSpeakingReflectionState,
} from '../../types/game';
import { GAME_COPY } from '../../data/i18n';
import {
  SCOTLAND_EVIDENCE_ITEMS,
  type ScotlandDifficultyMode,
} from '../../data/scotlandDiscovery';
import {
  getScotlandPracticeMission,
  SCOTLAND_PRACTICE_MISSIONS,
  SCOTLAND_PRACTICE_SPEAKERS,
  SCOTLAND_PRACTICE_XP_REWARD,
} from '../../data/scotlandPractice';
import { SCOTLAND_LANDMARKS, type ScotlandLandmarkId } from '../../data/scotlandWorld';
import {
  isMicrophoneRecordingSupported,
  startTransientMicRecording,
  type ActiveRecordingHandle,
  type RecorderErrorCode,
} from '../../utils/audioRecorder';
import { ScotlandStationIllustrationSVG } from './ScotlandCulturalIllustrationSVG';
import {
  ScotlandExchangeHeaderBannerSVG,
  ScotlandNpcPortraitSVG,
  ScotlandTartanRibbonDivider,
} from './ScotlandMiniGameArtwork';

interface ScotlandPracticeModalProps {
  stationId: ScotlandLandmarkId;
  language: AppLanguage;
  appearance: ResolvedAppearance;
  reducedMotion: boolean;
  builtSentences: Record<string, string>;
  discoveredEvidenceIds: ScotlandLandmarkId[];
  completedSpeakingIds: ScotlandLandmarkId[];
  existingReflection?: ScotlandSpeakingReflectionState;
  difficultyMode: ScotlandDifficultyMode;
  alreadyRewardedPractice: boolean;
  onDifficultyChange: (mode: ScotlandDifficultyMode) => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'mode' | 'reward') => void;
  onSpeakText: (text: string, voiceOpts?: { pitch?: number; rate?: number }) => void;
  onStopSpeech: () => void;
  onCompleteMission: (
    stationId: ScotlandLandmarkId,
    reflection: ScotlandSpeakingReflectionState,
  ) => boolean;
  onOpenBuildReview: (stationId: ScotlandLandmarkId) => void;
  onOpenDiscoverReview: (stationId: ScotlandLandmarkId) => void;
  onOpenJournal: (stationId: ScotlandLandmarkId) => void;
  onInspectLandmarkInfo: () => void;
  onClose: () => void;
}

type PracticeStep = 'listen' | 'prepare' | 'speak' | 'review' | 'complete';

function formatElapsed(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function ScotlandPracticeModal({
  stationId,
  language,
  appearance,
  reducedMotion,
  builtSentences,
  discoveredEvidenceIds,
  completedSpeakingIds,
  existingReflection,
  difficultyMode,
  alreadyRewardedPractice,
  onDifficultyChange,
  onPlaySfx,
  onSpeakText,
  onStopSpeech,
  onCompleteMission,
  onOpenBuildReview,
  onOpenDiscoverReview,
  onOpenJournal,
  onInspectLandmarkInfo,
  onClose,
}: ScotlandPracticeModalProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';
  const mission = getScotlandPracticeMission(stationId) ?? SCOTLAND_PRACTICE_MISSIONS[0];
  const primaryNpc = SCOTLAND_PRACTICE_SPEAKERS[mission.primaryNpcId];
  const secondaryNpc = mission.secondaryNpcId
    ? SCOTLAND_PRACTICE_SPEAKERS[mission.secondaryNpcId]
    : null;
  const evidenceItem = SCOTLAND_EVIDENCE_ITEMS.find((e) => e.id === mission.id);
  const totalMissions = SCOTLAND_PRACTICE_MISSIONS.length;
  const completedCount = completedSpeakingIds.length;
  const alreadyCompleted = completedSpeakingIds.includes(mission.id);
  const hasFollowUp = Boolean(mission.followUpQuestion);

  const [step, setStep] = useState<PracticeStep>('listen');
  const [questionReviewed, setQuestionReviewed] = useState(true);
  const [preparedStepVisited, setPreparedStepVisited] = useState(false);
  const [showThaiHelper, setShowThaiHelper] = useState(language === 'th');
  const [showFrames, setShowFrames] = useState(true);
  const [revealModel, setRevealModel] = useState(difficultyMode === 'a2');

  // Mic / No-mic state for Primary Response
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

  // Mission 5 Separate Follow-Up Recording / No-Mic Practice State (Fiona's follow-up)
  const [followUpState, setFollowUpState] = useState<
    'idle' | 'requesting' | 'recording' | 'recorded'
  >('idle');
  const [followUpElapsedSec, setFollowUpElapsedSec] = useState(0);
  const [followUpAudioUrl, setFollowUpAudioUrl] = useState<string | null>(null);
  const [followUpPlaying, setFollowUpPlaying] = useState(false);
  const [followUpAloudConfirmed, setFollowUpAloudConfirmed] = useState(false);

  // Step 4 Self-Reflection Checklist
  const [checkCompared, setCheckCompared] = useState(
    Boolean(existingReflection?.checks.comparedCultures),
  );
  const [checkExample, setCheckExample] = useState(
    Boolean(existingReflection?.checks.usedSpecificExample),
  );
  const [checkSimDiff, setCheckSimDiff] = useState(
    Boolean(existingReflection?.checks.explainedSimilarityOrDifference),
  );
  const [checkClear, setCheckClear] = useState(
    Boolean(existingReflection?.checks.spokeClearly),
  );

  // Step 5 Completion outcome
  const [justFinishedAll, setJustFinishedAll] = useState(false);

  // Refs for cleanup (no persistent audio ever stored)
  const mainRecorderRef = useRef<ActiveRecordingHandle | null>(null);
  const followUpRecorderRef = useRef<ActiveRecordingHandle | null>(null);
  const mainPlaybackRef = useRef<HTMLAudioElement | null>(null);
  const followUpPlaybackRef = useRef<HTMLAudioElement | null>(null);
  const mainAudioUrlRef = useRef<string | null>(null);
  const followUpAudioUrlRef = useRef<string | null>(null);
  mainAudioUrlRef.current = audioUrl;
  followUpAudioUrlRef.current = followUpAudioUrl;

  const stopMainPlayback = useCallback(() => {
    if (mainPlaybackRef.current) {
      mainPlaybackRef.current.pause();
      mainPlaybackRef.current.currentTime = 0;
    }
    setIsPlayingBack(false);
  }, []);

  const stopFollowUpPlayback = useCallback(() => {
    if (followUpPlaybackRef.current) {
      followUpPlaybackRef.current.pause();
      followUpPlaybackRef.current.currentTime = 0;
    }
    setFollowUpPlaying(false);
  }, []);

  const releaseAllRecordings = useCallback(() => {
    stopMainPlayback();
    stopFollowUpPlayback();
    if (mainPlaybackRef.current) {
      mainPlaybackRef.current.removeAttribute('src');
    }
    if (followUpPlaybackRef.current) {
      followUpPlaybackRef.current.removeAttribute('src');
    }
    if (mainRecorderRef.current) {
      mainRecorderRef.current.dispose();
      mainRecorderRef.current = null;
    }
    if (followUpRecorderRef.current) {
      followUpRecorderRef.current.dispose();
      followUpRecorderRef.current = null;
    }
    if (mainAudioUrlRef.current) {
      URL.revokeObjectURL(mainAudioUrlRef.current);
      mainAudioUrlRef.current = null;
    }
    if (followUpAudioUrlRef.current) {
      URL.revokeObjectURL(followUpAudioUrlRef.current);
      followUpAudioUrlRef.current = null;
    }
    setAudioUrl(null);
    setFollowUpAudioUrl(null);
  }, [stopFollowUpPlayback, stopMainPlayback]);

  useEffect(() => {
    return () => {
      releaseAllRecordings();
      onStopSpeech();
    };
  }, [onStopSpeech, releaseAllRecordings]);

  useEffect(() => {
    if (recordingState !== 'recording') return;
    const id = window.setInterval(() => {
      setElapsedSec((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [recordingState]);

  useEffect(() => {
    if (followUpState !== 'recording') return;
    const id = window.setInterval(() => {
      setFollowUpElapsedSec((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [followUpState]);

  const handleClose = useCallback(() => {
    releaseAllRecordings();
    onStopSpeech();
    onPlaySfx('click');
    onClose();
  }, [onClose, onPlaySfx, onStopSpeech, releaseAllRecordings]);

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

  const handleSpeakQuestion = () => {
    setQuestionReviewed(true);
    onPlaySfx('click');
    onSpeakText(mission.question.en, {
      pitch: primaryNpc.voicePitch,
      rate: primaryNpc.voiceRate,
    });
  };

  const handleSpeakFollowUp = () => {
    if (!mission.followUpQuestion || !secondaryNpc) return;
    onPlaySfx('click');
    onSpeakText(mission.followUpQuestion.en, {
      pitch: secondaryNpc.voicePitch,
      rate: secondaryNpc.voiceRate,
    });
  };

  const handleSpeakModel = () => {
    onPlaySfx('click');
    const modelText =
      difficultyMode === 'b1' ? mission.modelAnswerB1.en : mission.modelAnswerA2.en;
    onSpeakText(modelText, { pitch: 1.0, rate: 0.92 });
  };

  const handleStartMainRecording = async () => {
    onStopSpeech();
    stopMainPlayback();
    stopFollowUpPlayback();
    if (followUpRecorderRef.current) {
      followUpRecorderRef.current.dispose();
      followUpRecorderRef.current = null;
      setFollowUpState(followUpAudioUrlRef.current ? 'recorded' : 'idle');
    }
    if (mainAudioUrlRef.current) {
      URL.revokeObjectURL(mainAudioUrlRef.current);
      mainAudioUrlRef.current = null;
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
        mainRecorderRef.current = null;
        setAudioUrl(url);
        setRecordingState('recorded');
      },
      onError: (code) => {
        mainRecorderRef.current = null;
        setMicError(code);
        setRecordingState('idle');
        if (code === 'permission_denied' || code === 'unsupported' || code === 'not_found') {
          setNoMicMode(true);
        }
      },
    });
    if (handle) {
      mainRecorderRef.current = handle;
    }
  };

  const handleStopMainRecording = () => {
    onPlaySfx('click');
    if (mainRecorderRef.current) {
      mainRecorderRef.current.stop();
    } else {
      setRecordingState('idle');
    }
  };

  const handleRetryMainRecording = () => {
    onPlaySfx('click');
    stopMainPlayback();
    if (mainRecorderRef.current) {
      mainRecorderRef.current.dispose();
      mainRecorderRef.current = null;
    }
    if (mainAudioUrlRef.current) {
      URL.revokeObjectURL(mainAudioUrlRef.current);
      mainAudioUrlRef.current = null;
    }
    setAudioUrl(null);
    setElapsedSec(0);
    setRecordingState('idle');
    setAloudConfirmed(false);
    setStep('speak');
  };

  const handleStartFollowUpRecording = async () => {
    onStopSpeech();
    stopMainPlayback();
    stopFollowUpPlayback();
    if (mainRecorderRef.current) {
      mainRecorderRef.current.dispose();
      mainRecorderRef.current = null;
      setRecordingState(mainAudioUrlRef.current ? 'recorded' : 'idle');
    }
    if (followUpAudioUrlRef.current) {
      URL.revokeObjectURL(followUpAudioUrlRef.current);
      followUpAudioUrlRef.current = null;
      setFollowUpAudioUrl(null);
    }
    setMicError(null);
    setFollowUpElapsedSec(0);
    setFollowUpState('requesting');

    const handle = await startTransientMicRecording({
      onRecordingStarted: () => {
        setFollowUpState('recording');
      },
      onAudioReady: (url) => {
        followUpRecorderRef.current = null;
        setFollowUpAudioUrl(url);
        setFollowUpState('recorded');
      },
      onError: (code) => {
        followUpRecorderRef.current = null;
        setMicError(code);
        setFollowUpState('idle');
        if (code === 'permission_denied' || code === 'unsupported' || code === 'not_found') {
          setNoMicMode(true);
        }
      },
    });
    if (handle) {
      followUpRecorderRef.current = handle;
    }
  };

  const handleStopFollowUpRecording = () => {
    onPlaySfx('click');
    if (followUpRecorderRef.current) {
      followUpRecorderRef.current.stop();
    } else {
      setFollowUpState('idle');
    }
  };

  const handleRetryFollowUpRecording = () => {
    onPlaySfx('click');
    stopFollowUpPlayback();
    if (followUpRecorderRef.current) {
      followUpRecorderRef.current.dispose();
      followUpRecorderRef.current = null;
    }
    if (followUpAudioUrlRef.current) {
      URL.revokeObjectURL(followUpAudioUrlRef.current);
      followUpAudioUrlRef.current = null;
    }
    setFollowUpAudioUrl(null);
    setFollowUpElapsedSec(0);
    setFollowUpState('idle');
    setFollowUpAloudConfirmed(false);
  };

  const handleToggleMainPlayback = () => {
    if (!audioUrl) return;
    if (isPlayingBack) {
      stopMainPlayback();
      return;
    }
    stopFollowUpPlayback();
    onStopSpeech();
    if (!mainPlaybackRef.current) {
      mainPlaybackRef.current = new Audio(audioUrl);
      mainPlaybackRef.current.onended = () => setIsPlayingBack(false);
      mainPlaybackRef.current.onerror = () => setIsPlayingBack(false);
    } else if (mainPlaybackRef.current.src !== audioUrl) {
      mainPlaybackRef.current.src = audioUrl;
    }
    mainPlaybackRef.current
      .play()
      .then(() => setIsPlayingBack(true))
      .catch(() => setIsPlayingBack(false));
  };

  const handleToggleFollowUpPlayback = () => {
    if (!followUpAudioUrl) return;
    if (followUpPlaying) {
      stopFollowUpPlayback();
      return;
    }
    stopMainPlayback();
    onStopSpeech();
    if (!followUpPlaybackRef.current) {
      followUpPlaybackRef.current = new Audio(followUpAudioUrl);
      followUpPlaybackRef.current.onended = () => setFollowUpPlaying(false);
      followUpPlaybackRef.current.onerror = () => setFollowUpPlaying(false);
    } else if (followUpPlaybackRef.current.src !== followUpAudioUrl) {
      followUpPlaybackRef.current.src = followUpAudioUrl;
    }
    followUpPlaybackRef.current
      .play()
      .then(() => setFollowUpPlaying(true))
      .catch(() => setFollowUpPlaying(false));
  };

  const mainPracticed = recordingState === 'recorded' || aloudConfirmed;
  const followUpPracticed = !hasFollowUp || followUpState === 'recorded' || followUpAloudConfirmed;
  const speakStepReady = mainPracticed && followUpPracticed;
  const checklistAnyChecked = checkCompared || checkExample || checkSimDiff || checkClear;

  const currentStationSentence = builtSentences[mission.id];
  const otherBuiltEntries = SCOTLAND_LANDMARKS.filter(
    (lm) => lm.id !== mission.id && Boolean(builtSentences[lm.id]),
  ).map((lm) => ({
    id: lm.id,
    title: lm.title[language],
    sentence: builtSentences[lm.id],
  }));

  const handleComplete = () => {
    if (!questionReviewed || !preparedStepVisited || !speakStepReady || !checklistAnyChecked) {
      return;
    }
    stopMainPlayback();
    stopFollowUpPlayback();
    onStopSpeech();

    const practiceMode: 'recorded_mic' | 'self_reported_no_mic' =
      recordingState === 'recorded' ? 'recorded_mic' : 'self_reported_no_mic';

    const reflectionPayload: ScotlandSpeakingReflectionState = {
      practiceMode,
      checks: {
        comparedCultures: checkCompared,
        usedSpecificExample: checkExample,
        explainedSimilarityOrDifference: checkSimDiff,
        spokeClearly: checkClear,
      },
      ...(hasFollowUp ? { followUpPracticed: true } : {}),
      completedAt: new Date().toISOString(),
    };

    const completedAllNow = onCompleteMission(mission.id, reflectionPayload);
    setJustFinishedAll(completedAllNow);
    onPlaySfx('reward');
    setStep('complete');
  };

  const stepTabs: { id: PracticeStep; label: string }[] = [
    { id: 'listen', label: copy.scotlandPracticeStepListen },
    { id: 'prepare', label: copy.scotlandPracticeStepPrepare },
    { id: 'speak', label: copy.scotlandPracticeStepSpeak },
    { id: 'review', label: copy.scotlandPracticeStepReview },
    { id: 'complete', label: copy.scotlandPracticeStepComplete },
  ];

  const stepOrder: Record<PracticeStep, number> = {
    listen: 0,
    prepare: 1,
    speak: 2,
    review: 3,
    complete: 4,
  };

  const soundBarHeights = [34, 70, 52, 86, 42, 76, 48];
  const activeFrames =
    difficultyMode === 'b1' ? mission.sentenceFramesB1 : mission.sentenceFramesA2;
  const activeModel =
    difficultyMode === 'b1' ? mission.modelAnswerB1 : mission.modelAnswerA2;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="scotland-practice-title"
      className={`fixed inset-0 z-30 flex items-end sm:items-center justify-center p-3 sm:p-5 ${
        isNight ? 'bg-[#090F1E]/72' : 'bg-[#20304A]/28'
      }`}
    >
      <div
        className={`max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-3xl border-2 transition-colors ${
          isNight
            ? 'border-[#3A7D6C]/70 bg-[#121C36] text-[#F7F9FC] shadow-2xl'
            : 'border-[#CBD5E1] bg-[#FFFDF8] text-[#1E2E46] shadow-[0_22px_50px_rgba(32,48,74,0.22)]'
        }`}
      >
        <ScotlandTartanRibbonDivider />

        {/* Highland Exhibition Header Strip */}
        <div
          className={`border-b px-5 pt-4 pb-4 sm:px-6 ${
            isNight ? 'border-white/10 bg-[#172342]' : 'border-[#E2E8F0] bg-[#F2F7F5]'
          }`}
        >
          <ScotlandExchangeHeaderBannerSVG
            stationId={mission.id}
            isNight={isNight}
            className="mb-3 h-11 w-full rounded-xl border border-black/10 object-cover"
          />

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex shrink-0 items-center">
                <div
                  style={{ borderColor: primaryNpc.accentColor }}
                  className={`rounded-2xl border-2 p-0.5 shadow-sm ${
                    isNight ? 'bg-[#1D2B4B]' : 'bg-white'
                  }`}
                >
                  <ScotlandNpcPortraitSVG
                    npcId={mission.primaryNpcId}
                    isNight={isNight}
                    className="h-13 w-13 rounded-xl"
                  />
                </div>
                {secondaryNpc ? (
                  <div
                    style={{ borderColor: secondaryNpc.accentColor }}
                    className={`-ml-2.5 rounded-2xl border-2 p-0.5 shadow-sm ${
                      isNight ? 'bg-[#1D2B4B]' : 'bg-white'
                    }`}
                  >
                    <ScotlandNpcPortraitSVG
                      npcId={secondaryNpc.id}
                      isNight={isNight}
                      className="h-12 w-12 rounded-xl"
                    />
                  </div>
                ) : (
                  <ScotlandStationIllustrationSVG
                    stationId={mission.id}
                    className="-ml-2 h-11 w-11 rounded-xl border-2 border-[#FFFDF8] shadow-sm"
                  />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    style={{ backgroundColor: primaryNpc.accentColor }}
                    className="rounded-lg px-2 py-0.5 font-display text-[11px] font-extrabold text-white"
                  >
                    {secondaryNpc
                      ? `${primaryNpc.name[language]} & ${secondaryNpc.name[language]}`
                      : `${primaryNpc.name[language]} · ${primaryNpc.role[language]}`}
                  </span>
                  <span
                    className={`rounded-lg px-2 py-0.5 font-mono-num text-[11px] font-bold ${
                      isNight ? 'bg-white/10 text-[#E2ECF9]' : 'bg-white text-[#354E70]'
                    }`}
                  >
                    {mission.order}/{totalMissions}
                  </span>
                  <span
                    className={`text-[11px] font-semibold ${
                      isNight ? 'text-[#9CB2D1]' : 'text-[#526785]'
                    }`}
                  >
                    {mission.locationName[language]}
                  </span>
                </div>
                <h2
                  id="scotland-practice-title"
                  className={`mt-1 font-display text-base sm:text-lg font-extrabold truncate ${
                    isNight ? 'text-[#2ED6A3]' : 'text-[#235B4E]'
                  }`}
                >
                  {mission.title[language]}
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
                aria-label={copy.scotlandCloseButton}
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

          {/* 5-Step Speaking Progress Stepper */}
          <div className="mt-3.5 grid grid-cols-5 gap-1.5" aria-label="Conversation Steps">
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
                          : 'border-[#CBD5E1] bg-white/80 text-[#5B708E]'
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
          {/* Top Utility Bar: A2 / B1 Switch + Quick Navigation to Journal / BUILD / Overview */}
          {step !== 'complete' && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div
                className={`inline-flex rounded-xl border p-0.5 text-xs font-bold ${
                  isNight ? 'border-white/15 bg-[#0F182F]' : 'border-[#CBD5E1] bg-white'
                }`}
                role="group"
                aria-label={copy.scotlandScaffoldModeLabel}
              >
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('click');
                    onDifficultyChange('a2');
                  }}
                  className={`min-h-[34px] rounded-lg px-2.5 py-1 transition-colors cursor-pointer ${
                    difficultyMode === 'a2'
                      ? 'bg-[#2ED6A3] text-[#131E31]'
                      : isNight
                        ? 'text-[#C2D0E3] hover:text-white'
                        : 'text-[#475569] hover:text-[#1E2E46]'
                  }`}
                >
                  {copy.scotlandModeA2Label}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('click');
                    onDifficultyChange('b1');
                  }}
                  className={`min-h-[34px] rounded-lg px-2.5 py-1 transition-colors cursor-pointer ${
                    difficultyMode === 'b1'
                      ? 'bg-[#F2C66D] text-[#131E31]'
                      : isNight
                        ? 'text-[#C2D0E3] hover:text-white'
                        : 'text-[#475569] hover:text-[#1E2E46]'
                  }`}
                >
                  {copy.scotlandModeB1Label}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    releaseAllRecordings();
                    onStopSpeech();
                    onPlaySfx('select');
                    onOpenJournal(mission.id);
                  }}
                  className={`inline-flex min-h-[34px] items-center gap-1 rounded-xl border px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                    isNight
                      ? 'border-white/15 bg-[#1A2847] text-[#E2ECF9] hover:bg-[#23345B]'
                      : 'border-[#CBD5E1] bg-white text-[#20304A] hover:bg-[#EEF4FA]'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5 text-[#2B8C7E]" aria-hidden="true" />
                  <span>
                    {copy.scotlandOpenJournalButton} ({discoveredEvidenceIds.length}/{totalMissions})
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    releaseAllRecordings();
                    onStopSpeech();
                    onPlaySfx('select');
                    onOpenBuildReview(mission.id);
                  }}
                  className={`inline-flex min-h-[34px] items-center gap-1 rounded-xl border px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                    isNight
                      ? 'border-white/15 bg-[#1A2847] text-[#E2ECF9] hover:bg-[#23345B]'
                      : 'border-[#CBD5E1] bg-white text-[#20304A] hover:bg-[#EEF4FA]'
                  }`}
                >
                  <Hammer className="h-3.5 w-3.5 text-[#D99B26]" aria-hidden="true" />
                  <span>{copy.scotlandPracticeReviewBuildButton}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    releaseAllRecordings();
                    onStopSpeech();
                    onPlaySfx('click');
                    onInspectLandmarkInfo();
                  }}
                  className={`inline-flex min-h-[34px] items-center gap-1 rounded-xl border px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                    isNight
                      ? 'border-white/15 bg-[#1A2847] text-[#E2ECF9] hover:bg-[#23345B]'
                      : 'border-[#CBD5E1] bg-white text-[#20304A] hover:bg-[#EEF4FA]'
                  }`}
                >
                  <Compass className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
                  <span>{copy.scotlandReadLandmarkNoteButton}</span>
                </button>
              </div>
            </div>
          )}

          {alreadyCompleted && step !== 'complete' && (
            <p
              className={`mt-2.5 text-xs font-semibold ${
                isNight ? 'text-[#2ED6A3]' : 'text-[#0E7A74]'
              }`}
            >
              {copy.kenyaPracticeAlreadyDoneNote}{' '}
              <button
                type="button"
                onClick={() => {
                  onPlaySfx('click');
                  onOpenDiscoverReview(mission.id);
                }}
                className="ml-1 underline underline-offset-2 cursor-pointer"
              >
                ({copy.scotlandBuildInspectDiscoverCardButton})
              </button>
            </p>
          )}

          {/* STEP 1: LISTEN */}
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
                  {primaryNpc.name[language]} · {primaryNpc.personality[language]}
                </p>

                <p
                  className={`mt-2 font-display text-lg sm:text-2xl font-extrabold leading-snug ${
                    isNight ? 'text-[#F7F9FC]' : 'text-[#1E2E46]'
                  }`}
                >
                  “{mission.question.en}”
                </p>

                {showThaiHelper && (
                  <p
                    className={`mt-1.5 text-xs sm:text-sm font-medium ${
                      isNight ? 'text-[#B6C7DE]' : 'text-[#4F6482]'
                    }`}
                  >
                    {mission.question.th}
                  </p>
                )}

                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-2">
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

                    <button
                      type="button"
                      onClick={() => {
                        onStopSpeech();
                        onPlaySfx('click');
                      }}
                      className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold cursor-pointer ${
                        isNight
                          ? 'border-white/20 bg-[#1D2C46] text-[#E2ECF9] hover:bg-[#273B5E]'
                          : 'border-[#CBD5E1] bg-white text-[#354E70] hover:bg-[#EEF4FA]'
                      }`}
                    >
                      <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{copy.scotlandPracticeStopAudioButton}</span>
                    </button>
                  </div>

                  <span
                    className={`text-[11px] font-medium ${
                      isNight ? 'text-[#9CB2D1]' : 'text-[#5A708F]'
                    }`}
                  >
                    {copy.spotSpeakAudioNotice}
                  </span>
                </div>
              </div>

              {mission.followUpQuestion && secondaryNpc && (
                <div
                  className={`rounded-2xl border p-4 ${
                    isNight
                      ? 'border-[#7B5EA7]/55 bg-[#221D3D]'
                      : 'border-[#7B5EA7]/35 bg-[#F5F1FC]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#7B5EA7] dark:text-[#C4B5FD]">
                      <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {copy.scotlandPracticeFollowUpBadge} ({secondaryNpc.name[language]})
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={handleSpeakFollowUp}
                      className={`inline-flex min-h-[34px] items-center gap-1 rounded-xl border px-2.5 py-1 text-xs font-bold cursor-pointer ${
                        isNight
                          ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC]'
                          : 'border-[#7B5EA7]/30 bg-white text-[#533A82]'
                      }`}
                    >
                      <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{copy.scotlandPracticeListenPromptButton}</span>
                    </button>
                  </div>
                  <p className="mt-1.5 font-display text-sm sm:text-base font-extrabold">
                    “{mission.followUpQuestion.en}”
                  </p>
                  {showThaiHelper && (
                    <p className={`mt-0.5 text-xs ${isNight ? 'text-[#C8BFE6]' : 'text-[#5B4982]'}`}>
                      {mission.followUpQuestion.th}
                    </p>
                  )}
                </div>
              )}

              <div
                className={`rounded-2xl border p-3.5 space-y-1.5 text-xs sm:text-sm ${
                  isNight
                    ? 'border-[#F2C66D]/30 bg-[#1C2744] text-[#FCE6B4]'
                    : 'border-[#F2C66D]/60 bg-[#FFF8E8] text-[#4C3914]'
                }`}
              >
                <p>
                  <strong className="font-display">{copy.kenyaPracticeQuestionTargetLabel}:</strong>{' '}
                  {mission.speakingGoal[language]}
                </p>
                {mission.targetDurationNote && (
                  <p className="font-mono-num text-[11px] font-bold opacity-90">
                    {mission.targetDurationNote[language]}
                  </p>
                )}
                <p className="text-xs opacity-90">{mission.accuracyGuidanceNote[language]}</p>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[11px] font-semibold ${
                    isNight ? 'text-[#9CB2D1]' : 'text-[#526785]'
                  }`}
                >
                  {copy.kenyaPracticeCountLabel}:{' '}
                  <strong className="font-mono-num">
                    {completedCount}/{totalMissions}
                  </strong>{' '}
                  · {copy.kenyaPracticeHelpXpSafe}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    onStopSpeech();
                    onPlaySfx('select');
                    setPreparedStepVisited(true);
                    setStep('prepare');
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#f7d487] cursor-pointer"
                >
                  <span>{copy.scotlandPracticeStepPrepare}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PREPARE (Journal Evidence + Saved BUILD Sentence + Key Terms + Optional Frames/Models) */}
          {step === 'prepare' && (
            <div className="mt-4 space-y-3.5">
              {/* Compact Question Reminder */}
              <div
                className={`rounded-2xl border p-3.5 ${
                  isNight ? 'border-white/12 bg-[#1A2847]' : 'border-[#20304A]/10 bg-[#F2F7FC]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-display text-sm sm:text-base font-extrabold">
                    {primaryNpc.name[language]}: “{mission.question.en}”
                  </p>
                  <div className="flex items-center gap-1.5">
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
                    <button
                      type="button"
                      onClick={() => {
                        onStopSpeech();
                        onPlaySfx('click');
                      }}
                      aria-label={copy.scotlandPracticeStopAudioButton}
                      className={`inline-flex min-h-[34px] items-center rounded-xl border px-2.5 py-1 text-xs font-bold cursor-pointer ${
                        isNight
                          ? 'border-white/20 bg-[#1D2C46] text-[#E2ECF9]'
                          : 'border-[#CBD5E1] bg-white text-[#354E70]'
                      }`}
                    >
                      <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <p className={`mt-1 text-xs font-medium ${isNight ? 'text-[#B6C7DE]' : 'text-[#4F6482]'}`}>
                  {mission.speakingGoal[language]}
                </p>
              </div>

              {/* Saved BUILD Comparison Sentence (Current Station + Mission 5 Synthesis) */}
              {currentStationSentence && (
                <div
                  className={`rounded-2xl border p-3.5 ${
                    isNight
                      ? 'border-[#2ED6A3]/40 bg-[#123030]'
                      : 'border-[#24B8B0]/35 bg-[#EAF9F6]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#24B8B0]">
                    <Hammer className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.scotlandPracticeBuildLinkHeading}</span>
                  </div>
                  <p
                    className={`mt-1 font-display text-sm sm:text-base font-extrabold ${
                      isNight ? 'text-[#E6FAF5]' : 'text-[#153B38]'
                    }`}
                  >
                    “{currentStationSentence}”
                  </p>
                </div>
              )}

              {hasFollowUp && otherBuiltEntries.length > 0 && (
                <div
                  className={`rounded-2xl border p-3.5 ${
                    isNight
                      ? 'border-[#3B78A8]/45 bg-[#152844]'
                      : 'border-[#BAE6FD] bg-[#F0F9FF]'
                  }`}
                >
                  <p className="text-xs font-extrabold text-[#0284C7] dark:text-[#7DD3FC]">
                    {copy.scotlandPracticeOtherBuiltHeading}
                  </p>
                  <ul className="mt-1.5 space-y-1 text-xs">
                    {otherBuiltEntries.map((item) => (
                      <li key={item.id}>
                        <strong>{item.title}:</strong> “{item.sentence}”
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cultural Explorer Journal Evidence Card */}
              {evidenceItem && (
                <div
                  className={`rounded-2xl border p-3.5 space-y-2 ${
                    isNight
                      ? 'border-white/15 bg-[#172442]'
                      : 'border-[#CBD5E1] bg-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#2B8C7E] dark:text-[#2ED6A3]">
                    <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.scotlandPracticeEvidenceLinkHeading}</span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 text-xs leading-relaxed">
                    <div
                      className={`rounded-xl border p-2.5 ${
                        isNight ? 'border-white/10 bg-[#121D38]' : 'border-[#E2E8F0] bg-[#F8FAFC]'
                      }`}
                    >
                      <p className="font-bold text-[#2B8C7E] dark:text-[#2ED6A3]">
                        {copy.scotlandSimilarityShortLabel}
                      </p>
                      <p className="mt-0.5">{evidenceItem.similarityNote[language]}</p>
                    </div>
                    <div
                      className={`rounded-xl border p-2.5 ${
                        isNight ? 'border-white/10 bg-[#121D38]' : 'border-[#E2E8F0] bg-[#F8FAFC]'
                      }`}
                    >
                      <p className="font-bold text-[#D99B26]">{copy.scotlandDifferenceShortLabel}</p>
                      <p className="mt-0.5">{evidenceItem.differenceNote[language]}</p>
                    </div>
                  </div>
                  <div>
                    <p
                      className={`mb-1 text-[11px] font-bold ${
                        isNight ? 'text-[#9CB2D1]' : 'text-[#4F6482]'
                      }`}
                    >
                      {copy.scotlandPracticeKeyTermsHeading}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {mission.suggestedLanguage.map((phrase) => (
                        <span
                          key={phrase}
                          className="rounded-lg bg-[#F2C66D] px-2 py-0.5 font-display text-[11px] font-extrabold text-[#131E31]"
                        >
                          {phrase}
                        </span>
                      ))}
                      {evidenceItem.keyVocab.map((v) => (
                        <span
                          key={v.term}
                          className={`rounded-lg border px-2 py-0.5 text-[11px] font-bold ${
                            isNight
                              ? 'border-[#24B8B0]/40 bg-[#153440] text-[#D8FAF0]'
                              : 'border-[#24B8B0]/35 bg-[#E6FAF5] text-[#0E5B56]'
                          }`}
                        >
                          {v.term}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Scaffolding Help Toggles */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('click');
                    setShowFrames((s) => !s);
                  }}
                  className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                    isNight
                      ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                      : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A] hover:bg-[#DCE8F5]'
                  }`}
                >
                  {showFrames ? (
                    <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span>
                    {showFrames
                      ? copy.scotlandPracticeHideFramesLabel
                      : copy.scotlandPracticeShowFramesLabel}
                  </span>
                </button>

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
              </div>

              {showFrames && (
                <div
                  className={`rounded-2xl border p-4 space-y-2.5 ${
                    isNight
                      ? 'border-white/15 bg-[#172442]'
                      : 'border-[#C9DCF0] bg-[#F7FBFF]'
                  }`}
                >
                  <p className="text-xs font-extrabold uppercase tracking-wide text-[#2B8C7E] dark:text-[#2ED6A3]">
                    {copy.scotlandPracticeFramesHeading} ({difficultyMode.toUpperCase()})
                  </p>
                  <div className="space-y-1.5">
                    {activeFrames.map((frame, i) => (
                      <div
                        key={i}
                        className={`rounded-xl border px-3 py-2 text-xs sm:text-sm font-semibold ${
                          isNight
                            ? 'border-white/10 bg-[#121D38] text-[#F2C66D]'
                            : 'border-[#E2E8F0] bg-white text-[#0E7A74]'
                        }`}
                      >
                        <p>{frame.en}</p>
                        {showThaiHelper && (
                          <p
                            className={`mt-0.5 text-[11px] font-normal ${
                              isNight ? 'text-[#B6C7DE]' : 'text-[#526785]'
                            }`}
                          >
                            {frame.th}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  {mission.followUpModelHint && (
                    <p
                      className={`text-xs font-semibold ${
                        isNight ? 'text-[#C4B5FD]' : 'text-[#533A82]'
                      }`}
                    >
                      {mission.followUpModelHint[language]}
                    </p>
                  )}
                </div>
              )}

              {revealModel && (
                <div
                  className={`rounded-2xl border p-4 space-y-2 ${
                    isNight
                      ? 'border-[#2ED6A3]/40 bg-[#123030]'
                      : 'border-[#24B8B0]/35 bg-[#EAF9F6]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-[#2B8C7E] dark:text-[#2ED6A3]">
                      {copy.scotlandPracticeModelHeading} ({difficultyMode.toUpperCase()})
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleSpeakModel}
                        className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold cursor-pointer ${
                          isNight
                            ? 'border-[#24B8B0]/50 bg-[#143640] text-[#E6FAF5]'
                            : 'border-[#24B8B0]/40 bg-white text-[#0E7A74]'
                        }`}
                      >
                        <Volume2 className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
                        <span>{copy.scotlandPracticeListenModelButton}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onStopSpeech();
                          onPlaySfx('click');
                        }}
                        aria-label={copy.scotlandPracticeStopAudioButton}
                        className={`inline-flex min-h-[34px] items-center rounded-xl border px-2.5 py-1 text-xs font-bold cursor-pointer ${
                          isNight
                            ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC]'
                            : 'border-[#CBD5E1] bg-white text-[#354E70]'
                        }`}
                      >
                        <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <p className="font-display text-sm sm:text-base font-extrabold leading-relaxed">
                    “{activeModel.en}”
                  </p>
                  {showThaiHelper && (
                    <p
                      className={`text-xs ${
                        isNight ? 'text-[#B6E6D8]' : 'text-[#285E5A]'
                      }`}
                    >
                      {activeModel.th}
                    </p>
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
                    setPreparedStepVisited(true);
                    setStep('speak');
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#f7d487] cursor-pointer"
                >
                  <span>{copy.scotlandPracticeStepSpeak}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SPEAK (Real Transient Mic OR Explicit No-Mic Practice + Mission 5 Fiona Follow-Up) */}
          {step === 'speak' && (
            <div className="mt-4 space-y-3.5">
              {/* Primary Speaking Prompt */}
              <div
                className={`rounded-2xl border p-4 ${
                  isNight ? 'border-white/12 bg-[#1A2847]' : 'border-[#20304A]/10 bg-[#F2F7FC]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-display text-base sm:text-lg font-extrabold">
                    {primaryNpc.name[language]}: “{mission.question.en}”
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
                  {copy.scotlandPracticeSpeakPromptNote}
                </p>
                {mission.targetDurationNote && (
                  <p className="mt-1 font-mono-num text-[11px] font-bold text-[#D99B26]">
                    {mission.targetDurationNote[language]}
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
                        onClick={handleStartMainRecording}
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
                          onClick={handleStopMainRecording}
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
                          onClick={handleToggleMainPlayback}
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
                          onClick={handleRetryMainRecording}
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
                        releaseAllRecordings();
                        setRecordingState('idle');
                        setFollowUpState('idle');
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
                    <p className="text-xs font-semibold">{copy.scotlandPracticeNoMicIntro}</p>
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
                    <span>{copy.scotlandPracticeNoMicAloudCheck}</span>
                  </label>
                </div>
              )}

              {/* Mission 5: Separate Fiona Follow-Up Speaking Response Panel */}
              {mission.followUpQuestion && secondaryNpc && (
                <div
                  className={`rounded-2xl border p-4 space-y-3 ${
                    isNight
                      ? 'border-[#7B5EA7]/55 bg-[#221D3D]'
                      : 'border-[#7B5EA7]/35 bg-[#F5F1FC]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#7B5EA7] dark:text-[#C4B5FD]">
                      <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {copy.scotlandPracticeFollowUpBadge} · {secondaryNpc.name[language]}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={handleSpeakFollowUp}
                      className={`inline-flex min-h-[34px] items-center gap-1 rounded-xl border px-2.5 py-1 text-xs font-bold cursor-pointer ${
                        isNight
                          ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC]'
                          : 'border-[#7B5EA7]/30 bg-white text-[#533A82]'
                      }`}
                    >
                      <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{copy.scotlandPracticeListenPromptButton}</span>
                    </button>
                  </div>

                  <p className="text-xs font-medium opacity-85">
                    {copy.scotlandPracticeFollowUpInstruction}
                  </p>
                  <p className="font-display text-sm sm:text-base font-extrabold">
                    {secondaryNpc.name[language]}: “{mission.followUpQuestion.en}”
                  </p>
                  {showThaiHelper && (
                    <p className="text-xs opacity-80">{mission.followUpQuestion.th}</p>
                  )}

                  {!noMicMode && micSupported ? (
                    <div className="flex flex-wrap items-center gap-2.5">
                      {followUpState === 'idle' || followUpState === 'requesting' ? (
                        <button
                          type="button"
                          disabled={followUpState === 'requesting'}
                          onClick={handleStartFollowUpRecording}
                          className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#7B5EA7] px-4 py-2 font-display text-xs sm:text-sm font-extrabold text-white shadow hover:bg-[#6a4e94] cursor-pointer disabled:opacity-60"
                        >
                          <Mic className="h-4 w-4" aria-hidden="true" />
                          <span>{copy.spotSpeakStartMicButton}</span>
                        </button>
                      ) : followUpState === 'recording' ? (
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="inline-flex items-center gap-2 rounded-xl bg-[#3C1E28] px-3 py-1.5 text-xs font-bold text-[#FFB5A7]">
                            <span className="h-2 w-2 rounded-full bg-[#E04D3B]" aria-hidden="true" />
                            <span>{copy.spotSpeakRecordingStatus}</span>
                            <span className="font-mono-num">{formatElapsed(followUpElapsedSec)}</span>
                          </span>
                          <button
                            type="button"
                            onClick={handleStopFollowUpRecording}
                            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#20304A] px-3.5 py-1.5 text-xs font-bold text-white cursor-pointer"
                          >
                            <Square className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{copy.spotSpeakStopMicButton}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={handleToggleFollowUpPlayback}
                            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#24B8B0] px-3.5 py-1.5 font-display text-xs font-extrabold text-[#131E31] cursor-pointer"
                          >
                            {followUpPlaying ? (
                              <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                            ) : (
                              <Play className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                            <span>
                              {followUpPlaying
                                ? copy.spotSpeakPauseAudioButton
                                : copy.spotSpeakPlaybackButton}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={handleRetryFollowUpRecording}
                            className={`inline-flex min-h-[40px] items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                              isNight
                                ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC]'
                                : 'border-[#20304A]/15 bg-white text-[#20304A]'
                            }`}
                          >
                            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{copy.spotSpeakRetryButton}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <label className="flex min-h-[40px] items-center gap-2.5 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={followUpAloudConfirmed}
                        onChange={(e) => setFollowUpAloudConfirmed(e.target.checked)}
                        className="h-4 w-4 accent-[#7B5EA7]"
                      />
                      <span>{copy.scotlandPracticeFollowUpNoMicCheck}</span>
                    </label>
                  )}

                  {mainPracticed && !followUpPracticed && (
                    <p className="text-[11px] font-semibold text-[#D98218] dark:text-[#F2C66D]">
                      {copy.scotlandPracticeFollowUpRequiredNote}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    stopMainPlayback();
                    stopFollowUpPlayback();
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
                    stopMainPlayback();
                    stopFollowUpPlayback();
                    onPlaySfx('select');
                    setStep('review');
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#49e2b3] cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <span>{copy.scotlandPracticeStepReview}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & HONEST SELF-REFLECTION + PRACTICE GUIDANCE */}
          {step === 'review' && (
            <div className="mt-4 space-y-3.5">
              <div
                className={`rounded-2xl border p-4 space-y-2.5 ${
                  isNight ? 'border-white/12 bg-[#1A2847]' : 'border-[#20304A]/10 bg-[#F2F7FC]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-sm font-extrabold">
                    {copy.kenyaPracticeChecklistHeading}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {audioUrl && (
                      <button
                        type="button"
                        onClick={handleToggleMainPlayback}
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

                    {followUpAudioUrl && (
                      <button
                        type="button"
                        onClick={handleToggleFollowUpPlayback}
                        className="inline-flex min-h-[34px] items-center gap-1.5 rounded-xl bg-[#7B5EA7] px-3 py-1 text-xs font-extrabold text-white cursor-pointer"
                      >
                        {followUpPlaying ? (
                          <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <Play className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        <span>{copy.scotlandPracticeFollowUpBadge}</span>
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
                      <span>{copy.scotlandPracticeListenModelButton}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onStopSpeech();
                        onPlaySfx('click');
                      }}
                      aria-label={copy.scotlandPracticeStopAudioButton}
                      className={`inline-flex min-h-[34px] items-center rounded-xl border px-2.5 py-1 text-xs font-bold cursor-pointer ${
                        isNight
                          ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC]'
                          : 'border-[#CBD5E1] bg-white text-[#354E70]'
                      }`}
                    >
                      <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <p className={`text-[11px] font-medium ${isNight ? 'text-[#9CB2D1]' : 'text-[#5A708F]'}`}>
                  {copy.scotlandPracticeChecklistHint}
                </p>

                <div className="grid gap-1.5 pt-1">
                  {[
                    {
                      checked: checkCompared,
                      toggle: () => setCheckCompared((v) => !v),
                      label: copy.scotlandPracticeCheckCompare,
                    },
                    {
                      checked: checkExample,
                      toggle: () => setCheckExample((v) => !v),
                      label: copy.scotlandPracticeCheckExample,
                    },
                    {
                      checked: checkSimDiff,
                      toggle: () => setCheckSimDiff((v) => !v),
                      label: copy.scotlandPracticeCheckSimDiff,
                    },
                    {
                      checked: checkClear,
                      toggle: () => setCheckClear((v) => !v),
                      label: copy.scotlandPracticeCheckClear,
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

              {/* Clearly Labeled Honest Practice Guidance (No AI Evaluation / Scores / Transcripts) */}
              <div
                className={`rounded-2xl border p-4 space-y-2 text-xs sm:text-sm ${
                  isNight
                    ? 'border-[#2ED6A3]/40 bg-[#123030] text-[#E6FAF5]'
                    : 'border-[#24B8B0]/35 bg-[#EAF9F6] text-[#153B38]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display text-xs font-extrabold uppercase tracking-wide">
                    {copy.scotlandPracticeGuidanceHeading}
                  </span>
                  <span
                    className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                      isNight ? 'bg-white/10 text-[#B6E6D8]' : 'bg-white/80 text-[#0E5B56]'
                    }`}
                  >
                    {copy.scotlandPracticeGuidanceHonestNote}
                  </span>
                </div>
                <p>
                  <strong className="font-display">{copy.spotSpeakFeedbackPositiveLabel}:</strong>{' '}
                  {mission.sandwichGuidance.positive[language]}
                </p>
                <p>
                  <strong className="font-display">{copy.spotSpeakFeedbackTipLabel}:</strong>{' '}
                  {mission.sandwichGuidance.improvement[language]}
                </p>
                <p>
                  <strong className="font-display">{copy.spotSpeakFeedbackNextLabel}:</strong>{' '}
                  {mission.sandwichGuidance.nextStep[language]}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleRetryMainRecording}
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
                  <span>{copy.scotlandPracticeSaveCompleteButton}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: COMPLETE */}
          {step === 'complete' && (
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
                  {primaryNpc.name[language]}: “{mission.thankYouReply[language]}”
                </p>
                {showThaiHelper && language === 'th' && (
                  <p className="mt-1 text-xs opacity-80">“{mission.thankYouReply.en}”</p>
                )}

                {justFinishedAll && (
                  <div className="mt-3.5 flex flex-wrap items-center gap-2 rounded-xl bg-[#131E31] px-4 py-2.5 text-white shadow">
                    <Sparkles className="h-4 w-4 text-[#F2C66D]" aria-hidden="true" />
                    {!alreadyRewardedPractice ? (
                      <span className="font-display text-xs sm:text-sm font-extrabold text-[#F2C66D]">
                        +{SCOTLAND_PRACTICE_XP_REWARD} {copy.xpLabel}
                      </span>
                    ) : (
                      <span className="font-display text-xs sm:text-sm font-extrabold text-[#F2C66D]">
                        {copy.replayNoExtraXpLabel}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-[#2ED6A3]">
                      {copy.scotlandPracticeAllFiveEarnedNote}
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
                  <span>{copy.scotlandPracticeReturnWorldButton}</span>
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
