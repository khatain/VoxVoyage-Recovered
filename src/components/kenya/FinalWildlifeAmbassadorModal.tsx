import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Award,
  Binoculars,
  BookOpen,
  Camera,
  Check,
  CheckCircle2,
  Compass,
  Eye,
  EyeOff,
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
import type { AppLanguage, ResolvedAppearance } from '../../types/game';
import { GAME_COPY } from '../../data/i18n';
import type { KenyaLandmarkId } from '../../data/kenyaWorld';
import { KENYA_TOURIST_NPCS } from '../../data/kenyaPractice';
import {
  KENYA_AMBASSADOR_ACTIONS,
  KENYA_AMBASSADOR_FACT_CARDS,
  KENYA_AMBASSADOR_GOALS,
  KENYA_AMBASSADOR_MODEL_SPEECH,
  KENYA_AMBASSADOR_QA_QUESTIONS,
  KENYA_AMBASSADOR_REASONS,
  KENYA_AMBASSADOR_RUBRIC,
  KENYA_AMBASSADOR_SANDWICH_FEEDBACK,
  KENYA_AMBASSADOR_STARTERS,
  KENYA_AMBASSADOR_VOCAB_REVIEW,
  KENYA_PERFORM_XP_REWARD,
  TOTAL_KENYA_MISSION_XP,
} from '../../data/kenyaPerform';
import {
  isMicrophoneRecordingSupported,
  startTransientMicRecording,
  type ActiveRecordingHandle,
  type RecorderErrorCode,
} from '../../utils/audioRecorder';
import { shuffleArray } from '../../utils/shuffle';
import { KenyaWildSpeakStampSVG } from '../common/KenyaWildSpeakStampSVG';
import { DioramaImage } from '../common/DioramaImage';
import kenyaDioramaImg from '../../assets/images/kenya_day_safari_1795070977300.jpg';
import {
  KenyaSafariHeaderBannerSVG,
  KenyaSpotMiniature,
  KenyaTouristPortraitSVG,
} from './KenyaMiniGameArtwork';

const STAGE_WAVE_BARS = [40, 74, 52, 90, 62, 82, 46];

interface FinalWildlifeAmbassadorModalProps {
  language: AppLanguage;
  appearance: ResolvedAppearance;
  reducedMotion: boolean;
  alreadyCompleted: boolean;
  completedAt?: string;
  currentTotalXp: number;
  builtSentences: Record<string, string>;
  onPlaySfx: (kind?: 'click' | 'select' | 'mode' | 'reward') => void;
  onSpeakText: (text: string, voiceOpts?: { pitch?: number; rate?: number }) => void;
  onStopSpeech: () => void;
  onCompletePerform: () => { firstCompletion: boolean };
  onCeremonyTrigger?: () => void;
  onViewPassport: () => void;
  onReturnWorldMap: () => void;
  onClose: () => void;
}

type AmbassadorStep = 'briefing' | 'prepare' | 'speech' | 'qa' | 'reflect' | 'ceremony';
type AudioSlotId = 'speech' | 'qa_emma' | 'qa_daniel';
type RubricChoice = 'strong' | 'practice';

function formatElapsed(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function FinalWildlifeAmbassadorModal({
  language,
  appearance,
  reducedMotion,
  alreadyCompleted,
  completedAt,
  currentTotalXp,
  builtSentences,
  onPlaySfx,
  onSpeakText,
  onStopSpeech,
  onCompletePerform,
  onCeremonyTrigger,
  onViewPassport,
  onReturnWorldMap,
  onClose,
}: FinalWildlifeAmbassadorModalProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';

  const [step, setStep] = useState<AmbassadorStep>('briefing');
  const [hideScaffolding, setHideScaffolding] = useState(false);

  const shuffledFactCards = useMemo(() => shuffleArray(KENYA_AMBASSADOR_FACT_CARDS), []);
  const shuffledReasons = useMemo(() => shuffleArray(KENYA_AMBASSADOR_REASONS), []);
  const shuffledActions = useMemo(() => shuffleArray(KENYA_AMBASSADOR_ACTIONS), []);

  // Step 2: Preparation choices (integrating Field Guide & BUILD sentences)
  const [selectedFactIds, setSelectedFactIds] = useState<KenyaLandmarkId[]>(() => [
    'elephant_grassland',
    'giraffe_acacia_grove',
  ]);
  const [selectedReasonIds, setSelectedReasonIds] = useState<string[]>(() => ['reason_balance']);
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>(() => ['action_trails']);
  const [customMessage, setCustomMessage] = useState('');

  // Recording state shared safely per slot ('speech', 'qa_emma', 'qa_daniel')
  const micSupported = isMicrophoneRecordingSupported();
  const [noMicMode, setNoMicMode] = useState(!micSupported);
  const [activeRecSlot, setActiveRecSlot] = useState<AudioSlotId | null>(null);
  const [requestingSlot, setRequestingSlot] = useState<AudioSlotId | null>(null);
  const [recElapsedBySlot, setRecElapsedBySlot] = useState<Record<AudioSlotId, number>>({
    speech: 0,
    qa_emma: 0,
    qa_daniel: 0,
  });
  const [audioUrls, setAudioUrls] = useState<Record<AudioSlotId, string | null>>({
    speech: null,
    qa_emma: null,
    qa_daniel: null,
  });
  const [playingSlot, setPlayingSlot] = useState<AudioSlotId | null>(null);
  const [micError, setMicError] = useState<RecorderErrorCode | null>(null);

  // Accessible No-Mic aloud confirmation toggles
  const [speechAloudConfirmed, setSpeechAloudConfirmed] = useState(false);
  const [qaAloudConfirmed, setQaAloudConfirmed] = useState<Record<'qa_emma' | 'qa_daniel', boolean>>({
    qa_emma: false,
    qa_daniel: false,
  });
  const [qaShowHint, setQaShowHint] = useState<Record<'qa_emma' | 'qa_daniel', boolean>>({
    qa_emma: false,
    qa_daniel: false,
  });

  // Step 5: Honest Self-Reflection across all 6 Ambassador Rubric dimensions
  const [rubricRatings, setRubricRatings] = useState<Record<string, RubricChoice | null>>({
    wildlife_info: null,
    factual_accuracy: null,
    reasons_explanations: null,
    persuasive_recommendation: null,
    interaction: null,
    communication_clarity: null,
  });
  const [wasFirstCompletion, setWasFirstCompletion] = useState(!alreadyCompleted);

  const recorderRef = useRef<ActiveRecordingHandle | null>(null);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlsRef = useRef(audioUrls);
  audioUrlsRef.current = audioUrls;

  const stopPlayback = useCallback(() => {
    if (playbackAudioRef.current) {
      playbackAudioRef.current.pause();
      playbackAudioRef.current.currentTime = 0;
    }
    setPlayingSlot(null);
  }, []);

  const releaseSlotAudio = useCallback(
    (slot: AudioSlotId) => {
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
    (['speech', 'qa_emma', 'qa_daniel'] as const).forEach((slot) => {
      const url = audioUrlsRef.current[slot];
      if (url) {
        URL.revokeObjectURL(url);
      }
    });
    setActiveRecSlot(null);
    setRequestingSlot(null);
    setAudioUrls({ speech: null, qa_emma: null, qa_daniel: null });
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

  const handleStartRecordingSlot = async (slot: AudioSlotId) => {
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

  const handleRetrySlot = (slot: AudioSlotId) => {
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

  const handleTogglePlaybackSlot = (slot: AudioSlotId) => {
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

  const toggleFactId = (id: KenyaLandmarkId) => {
    onPlaySfx('click');
    setSelectedFactIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleReasonId = (id: string) => {
    onPlaySfx('click');
    setSelectedReasonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleActionId = (id: string) => {
    onPlaySfx('click');
    setSelectedActionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const getFactSentence = (cardId: KenyaLandmarkId, fallbackText: string): string => {
    const built = builtSentences[cardId]?.trim();
    return built && built.length > 0 ? built : fallbackText;
  };

  const prepReady =
    selectedFactIds.length >= 2 &&
    selectedReasonIds.length >= 1 &&
    selectedActionIds.length >= 1;

  const speechReady = noMicMode ? speechAloudConfirmed : Boolean(audioUrls.speech);
  const qaEmmaReady = noMicMode ? qaAloudConfirmed.qa_emma : Boolean(audioUrls.qa_emma);
  const qaDanielReady = noMicMode ? qaAloudConfirmed.qa_daniel : Boolean(audioUrls.qa_daniel);
  const allQaReady = qaEmmaReady && qaDanielReady;
  const reflectionReady = KENYA_AMBASSADOR_RUBRIC.every(
    (dim) => rubricRatings[dim.id] !== null,
  );

  const handleFinishMission = () => {
    if (!reflectionReady) return;
    stopPlayback();
    onStopSpeech();
    const result = onCompletePerform();
    setWasFirstCompletion(result.firstCompletion);
    onPlaySfx('reward');
    onCeremonyTrigger?.();
    setStep('ceremony');
  };

  const stepTabs: { id: AmbassadorStep; label: string }[] = [
    { id: 'briefing', label: copy.kenyaPerformStepBriefing },
    { id: 'prepare', label: copy.kenyaPerformStepPrepare },
    { id: 'speech', label: copy.kenyaPerformStepSpeech },
    { id: 'qa', label: copy.kenyaPerformStepQa },
    { id: 'reflect', label: copy.kenyaPerformStepReflect },
  ];

  const stepIndexMap: Record<AmbassadorStep, number> = {
    briefing: 0,
    prepare: 1,
    speech: 2,
    qa: 3,
    reflect: 4,
    ceremony: 4,
  };

  const cardSurface = isNight
    ? 'border-[#F2C66D]/50 bg-[#121C36]/96 text-[#F7F9FC] shadow-2xl'
    : 'border-white bg-[#FFFDF8]/98 text-[#1E2E46] shadow-[0_22px_54px_rgba(32,48,74,0.22)]';

  const insetSurface = isNight
    ? 'border-white/12 bg-[#1A2847]'
    : 'border-[#20304A]/10 bg-[#F2F7FC]';

  const neutralBtnClass = isNight
    ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
    : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A] hover:bg-[#DCE8F5]';

  const chosenFacts = KENYA_AMBASSADOR_FACT_CARDS.filter((c) =>
    selectedFactIds.includes(c.id),
  );
  const chosenReasons = KENYA_AMBASSADOR_REASONS.filter((r) =>
    selectedReasonIds.includes(r.id),
  );
  const chosenActions = KENYA_AMBASSADOR_ACTIONS.filter((a) =>
    selectedActionIds.includes(a.id),
  );

  const renderCueCardSummary = () => (
    <div
      className={`overflow-hidden rounded-2xl border-2 text-xs shadow-sm ${
        isNight ? 'border-[#24B8B0]/45 bg-[#132934]' : 'border-[#24B8B0]/40 bg-[#EFFAF8]'
      }`}
    >
      <div
        className={`flex items-center justify-between border-b px-3.5 py-2 ${
          isNight ? 'border-[#24B8B0]/30 bg-[#0F2029]' : 'border-[#24B8B0]/25 bg-[#DDF4F0]'
        }`}
      >
        <p className="font-display text-xs font-extrabold text-[#0E7A74] dark:text-[#2ED6A3]">
          {copy.kenyaPerformCueCardHeading}
        </p>
        <span className="h-2 w-8 rounded-full bg-[#24B8B0]/45" aria-hidden="true" />
      </div>
      <div className="space-y-1.5 p-3.5 leading-relaxed">
        <p>
          <strong>1. Opening:</strong> “Jambo everyone! Welcome to the Maasai Mara in Kenya.”
        </p>
        <div>
          <strong>2. Wildlife Facts ({chosenFacts.length}):</strong>
          <ul className="mt-0.5 space-y-0.5 pl-4 list-disc">
            {chosenFacts.map((card) => (
              <li key={card.id}>
                {getFactSentence(card.id, card.defaultFact.en)}
              </li>
            ))}
          </ul>
        </div>
        {chosenReasons.length > 0 && (
          <p>
            <strong>3. Why It Matters:</strong> {chosenReasons.map((r) => r.en).join(' ')}
          </p>
        )}
        {chosenActions.length > 0 && (
          <p>
            <strong>4. Call to Action:</strong> {chosenActions.map((a) => a.en).join(' ')}
          </p>
        )}
        {customMessage.trim() && (
          <p className="font-semibold text-[#D99B26]">
            ★ Personal Note: “{customMessage.trim()}”
          </p>
        )}
        <p>
          <strong>5. Closing:</strong> “Thank you for helping save the savanna!”
        </p>
      </div>
    </div>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="kenya-ambassador-title"
      className={`fixed inset-0 z-30 flex items-end sm:items-center justify-center p-3 sm:p-6 ${
        isNight ? 'bg-[#090F1E]/64' : 'bg-[#20304A]/24'
      }`}
    >
      <div
        className={`w-full max-w-2xl max-h-[92dvh] overflow-y-auto rounded-3xl border-2 ${
          reducedMotion ? '' : 'transition-colors duration-200'
        } ${cardSurface}`}
      >
        {/* Conservation Amphitheater Scenic Header */}
        <div
          className={`border-b px-5 pt-4 pb-4 sm:px-6 ${
            isNight ? 'border-white/10 bg-[#172342]' : 'border-[#EAD8B6] bg-[#FBF4E4]'
          }`}
        >
          <KenyaSafariHeaderBannerSVG
            isNight={isNight}
            className="mb-3 h-11 w-full rounded-xl border border-black/10 object-cover"
          />

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-14 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-[#F2C66D]/80 shadow-md">
                <DioramaImage
                  src={kenyaDioramaImg}
                  alt={copy.kenyaPerformTitle}
                  title={copy.kenyaPerformTitle}
                  accentColor="#F2C66D"
                  appearance={appearance}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p
                  className={`text-xs font-extrabold uppercase tracking-wide ${
                    isNight ? 'text-[#2ED6A3]' : 'text-[#0E7A74]'
                  }`}
                >
                  {copy.kenyaPerformMissionBadge} <span aria-hidden="true">·</span>{' '}
                  {copy.kenyaPerformTargetDuration}
                </p>
                <h2
                  id="kenya-ambassador-title"
                  className={`mt-0.5 font-display text-lg sm:text-2xl font-extrabold leading-tight ${
                    isNight ? 'text-[#F2C66D]' : 'text-[#C46B2B]'
                  }`}
                >
                  {copy.kenyaPerformTitle}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              aria-label={copy.closeSettings}
              className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border cursor-pointer ${neutralBtnClass}`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Numbered 5-Stage Ambassador Stepper */}
          <div className="mt-3.5 grid grid-cols-5 gap-1.5" aria-label="Wildlife Ambassador Steps">
            {stepTabs.map((s, idx) => {
              const currentIdx = stepIndexMap[step];
              const active = idx === currentIdx && step !== 'ceremony';
              const done = idx < currentIdx || step === 'ceremony';
              return (
                <div
                  key={s.id}
                  className={`flex items-center justify-center gap-1 rounded-xl border px-1.5 py-1.5 text-center text-[11px] font-bold whitespace-nowrap truncate ${
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
                  <span className="truncate">{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-5 sm:p-6">

        {/* STEP 1: BRIEFING & 5 AMBASSADOR GOALS */}
        {step === 'briefing' && (
          <div className="mt-4 space-y-4">
            <div className={`rounded-2xl border p-4 space-y-3 ${insetSurface}`}>
              <p className="text-sm font-semibold leading-relaxed">
                {copy.kenyaPerformBriefIntro}
              </p>

              <p
                className={`font-display text-xs font-extrabold ${
                  isNight ? 'text-[#F2C66D]' : 'text-[#20304A]'
                }`}
              >
                {copy.kenyaPerformGoalsHeading}
              </p>

              <ul className="space-y-2 text-xs sm:text-sm">
                {KENYA_AMBASSADOR_GOALS.map((goal, idx) => (
                  <li key={goal.id} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#24B8B0]/20 font-mono-num text-[11px] font-extrabold text-[#24B8B0]">
                      {idx + 1}
                    </span>
                    <span>{goal.label[language]}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  onStopSpeech();
                  onPlaySfx('select');
                  setStep('prepare');
                }}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2.5 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#f7d487] cursor-pointer"
              >
                <span>{copy.kenyaPerformGoPrepareButton}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PREPARE (Field Guide & BUILD Sentences + Reasons + Actions + Cue Cards) */}
        {step === 'prepare' && (
          <div className="mt-4 space-y-4">
            {/* Fact Cards (incorporating Stage 2 BUILD sentences) */}
            <div className={`rounded-2xl border p-4 space-y-2.5 ${insetSurface}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-sm font-extrabold">
                    {copy.kenyaPerformPrepFactsHeading}
                  </h3>
                  <p className={`text-[11px] ${isNight ? 'text-[#B6C7DE]' : 'text-[#526785]'}`}>
                    {copy.kenyaPerformPrepFactsHint}
                  </p>
                </div>
                <span className="font-mono-num text-xs font-extrabold text-[#24B8B0]">
                  {selectedFactIds.length}/2+
                </span>
              </div>

              <div className="space-y-2">
                {shuffledFactCards.map((card) => {
                  const selected = selectedFactIds.includes(card.id);
                  const builtCustom = Boolean(builtSentences[card.id]?.trim());
                  const textEn = getFactSentence(card.id, card.defaultFact.en);
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => toggleFactId(card.id)}
                      aria-pressed={selected}
                      className={`flex w-full items-start gap-3 text-left rounded-xl border-2 p-3 transition-colors cursor-pointer ${
                        selected
                          ? 'border-[#2ED6A3] bg-[#2ED6A3]/15'
                          : neutralBtnClass
                      }`}
                    >
                      <KenyaSpotMiniature spotId={card.id} className="mt-0.5 h-11 w-11" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              style={{ backgroundColor: card.accentColor }}
                              className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                              aria-hidden="true"
                            />
                            <span className="font-display text-xs font-extrabold">
                              {card.title[language]}
                            </span>
                            {builtCustom && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-[#24B8B0]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#0E7A74] dark:text-[#2ED6A3]">
                                <BookOpen className="h-3 w-3" aria-hidden="true" />
                                {copy.kenyaPerformFromBuildTag}
                              </span>
                            )}
                          </div>
                          {selected && (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2ED6A3]" aria-hidden="true" />
                          )}
                        </div>
                        <p className="mt-1 text-xs sm:text-sm font-medium leading-snug">
                          “{textEn}”
                        </p>
                        {!builtCustom && language === 'th' && (
                          <p className={`mt-0.5 text-[11px] ${isNight ? 'text-[#B6C7DE]' : 'text-[#526785]'}`}>
                            {card.defaultFact.th}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reasons (using because / so) */}
            <div className={`rounded-2xl border p-4 space-y-2 ${insetSurface}`}>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-sm font-extrabold">
                  {copy.kenyaPerformPrepReasonsHeading}
                </h3>
                <span className="font-mono-num text-xs font-extrabold text-[#24B8B0]">
                  {selectedReasonIds.length}/1+
                </span>
              </div>
              <div className="space-y-1.5">
                {shuffledReasons.map((r) => {
                  const active = selectedReasonIds.includes(r.id);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => toggleReasonId(r.id)}
                      aria-pressed={active}
                      className={`w-full text-left rounded-xl border-2 px-3 py-2 text-xs font-semibold cursor-pointer ${
                        active ? 'border-[#2ED6A3] bg-[#2ED6A3]/15' : neutralBtnClass
                      }`}
                    >
                      <p>{r.en}</p>
                      {language === 'th' && (
                        <p className="mt-0.5 text-[11px] opacity-75">{r.th}</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Persuasive Actions (using should) */}
            <div className={`rounded-2xl border p-4 space-y-2 ${insetSurface}`}>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-sm font-extrabold">
                  {copy.kenyaPerformPrepActionsHeading}
                </h3>
                <span className="font-mono-num text-xs font-extrabold text-[#24B8B0]">
                  {selectedActionIds.length}/1+
                </span>
              </div>
              <div className="space-y-1.5">
                {shuffledActions.map((a) => {
                  const active = selectedActionIds.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => toggleActionId(a.id)}
                      aria-pressed={active}
                      className={`w-full text-left rounded-xl border-2 px-3 py-2 text-xs font-semibold cursor-pointer ${
                        active ? 'border-[#2ED6A3] bg-[#2ED6A3]/15' : neutralBtnClass
                      }`}
                    >
                      <p>{a.en}</p>
                      {language === 'th' && (
                        <p className="mt-0.5 text-[11px] opacity-75">{a.th}</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Custom Message Input */}
            <div className={`rounded-2xl border p-4 space-y-2 ${insetSurface}`}>
              <label htmlFor="kenya-ambassador-note" className="block text-xs font-bold">
                {copy.kenyaPerformCustomNoteLabel}
              </label>
              <input
                id="kenya-ambassador-note"
                type="text"
                maxLength={140}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder={copy.kenyaPerformCustomNotePlaceholder}
                className={`w-full rounded-xl border px-3 py-2 text-xs sm:text-sm ${
                  isNight
                    ? 'border-white/20 bg-[#131E31] text-white placeholder:text-[#7E94B3]'
                    : 'border-[#20304A]/20 bg-white text-[#1E2E46] placeholder:text-[#7E94B3]'
                }`}
              />
            </div>

            {/* Scaffolding Toggle + Starters / Vocab / Model Speech */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={`text-xs font-bold ${isNight ? 'text-[#C3CFE0]' : 'text-[#4F6482]'}`}>
                {copy.kenyaPerformModelSpeechHeading}
              </span>
              <button
                type="button"
                onClick={() => {
                  onPlaySfx('click');
                  setHideScaffolding((h) => !h);
                }}
                className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${neutralBtnClass}`}
              >
                {hideScaffolding ? (
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span>
                  {hideScaffolding ? copy.kenyaPerformScaffoldShow : copy.kenyaPerformScaffoldHide}
                </span>
              </button>
            </div>

            {!hideScaffolding ? (
              <div className={`rounded-2xl border p-4 space-y-3 ${insetSurface}`}>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  “{KENYA_AMBASSADOR_MODEL_SPEECH.en}”
                </p>
                {language === 'th' && (
                  <p
                    className={`text-xs leading-relaxed border-t pt-2 ${
                      isNight
                        ? 'border-white/10 text-[#B6C7DE]'
                        : 'border-[#20304A]/10 text-[#4F6482]'
                    }`}
                  >
                    {KENYA_AMBASSADOR_MODEL_SPEECH.th}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => onSpeakText(KENYA_AMBASSADOR_MODEL_SPEECH.en, { pitch: 1.0, rate: 0.94 })}
                  className={`inline-flex min-h-[38px] items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-bold cursor-pointer ${
                    isNight
                      ? 'border-[#24B8B0]/50 bg-[#143640] text-[#E6FAF5] hover:bg-[#1B4855]'
                      : 'border-[#24B8B0]/40 bg-[#E6F5FB] text-[#0E7A74] hover:bg-[#D4ECF8]'
                  }`}
                >
                  <Volume2 className="h-4 w-4 text-[#24B8B0]" aria-hidden="true" />
                  <span>{copy.kenyaPerformHearOpeningButton}</span>
                </button>

                <div>
                  <p className="font-display text-xs font-extrabold">
                    {copy.kenyaPerformStartersHeading}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {KENYA_AMBASSADOR_STARTERS.map((s) => (
                      <span
                        key={s.id}
                        className={`rounded-xl border px-2.5 py-1 text-xs font-semibold ${
                          isNight
                            ? 'border-[#F2C66D]/35 bg-[#242945] text-[#FBE1A6]'
                            : 'border-[#E0A938]/40 bg-[#FFF9E6] text-[#7A4E07]'
                        }`}
                      >
                        “{s.starter}” <span className="opacity-75">· {s.hint[language]}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-display text-xs font-extrabold">
                    {copy.kenyaPerformVocabHeading}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {KENYA_AMBASSADOR_VOCAB_REVIEW.map((v) => (
                      <span
                        key={v.word}
                        className={`rounded-xl border px-2.5 py-1 text-xs font-semibold ${
                          isNight
                            ? 'border-[#24B8B0]/40 bg-[#153440] text-[#D8FAF0]'
                            : 'border-[#24B8B0]/35 bg-[#E6FAF5] text-[#0E5B56]'
                        }`}
                      >
                        <strong>{v.word}</strong> <span className="opacity-75">· {v.th}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className={`rounded-2xl border p-3.5 text-xs font-semibold text-center ${insetSurface}`}>
                {copy.kenyaPerformScaffoldHiddenNote}
              </div>
            )}

            {/* Cue Card Preview */}
            {renderCueCardSummary()}

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  onStopSpeech();
                  onPlaySfx('click');
                  setStep('briefing');
                }}
                className={`inline-flex min-h-[40px] items-center rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${neutralBtnClass}`}
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
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2.5 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#f7d487] cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
              >
                <span>{copy.kenyaPerformStepOntoStageButton}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DELIVER SPEECH (Soft 60-90s timer + Mic Recording / No-Mic Mode) */}
        {step === 'speech' && (
          <div className="mt-4 space-y-3.5">
            <div className={`rounded-2xl border p-3.5 space-y-2.5 ${insetSurface}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs sm:text-sm font-semibold">{copy.kenyaPerformStageHint}</p>
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('click');
                    setHideScaffolding((h) => !h);
                  }}
                  className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold cursor-pointer ${neutralBtnClass}`}
                >
                  {hideScaffolding ? (
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span>
                    {hideScaffolding ? copy.kenyaPerformScaffoldShow : copy.kenyaPerformCueCardsToggle}
                  </span>
                </button>
              </div>

              {!hideScaffolding ? (
                <div className="space-y-2">
                  {renderCueCardSummary()}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        onSpeakText(KENYA_AMBASSADOR_MODEL_SPEECH.en, { pitch: 1.0, rate: 0.94 })
                      }
                      className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold cursor-pointer ${
                        isNight
                          ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC]'
                          : 'border-[#24B8B0]/35 bg-[#E6F5FB] text-[#0E7A74]'
                      }`}
                    >
                      <Volume2 className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
                      <span>{copy.kenyaPerformHearOpeningButton}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <p className={`text-xs font-semibold ${isNight ? 'text-[#B6C7DE]' : 'text-[#4F6482]'}`}>
                  {copy.kenyaPerformScaffoldHiddenNote}
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
                  isNight ? 'border-white/15 bg-[#192645]' : 'border-[#C9DCF0] bg-[#F7FBFF]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {activeRecSlot === 'speech' ? (
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
                        <span className="font-mono-num">
                          {formatElapsed(recElapsedBySlot.speech)}
                        </span>
                        <span className="opacity-75">({copy.kenyaPerformTimerSuggestedLabel})</span>
                      </span>
                      <div className="flex h-6 items-end gap-1" aria-hidden="true">
                        {STAGE_WAVE_BARS.map((h, i) => (
                          <span
                            key={i}
                            style={{ height: reducedMotion ? '60%' : `${h}%` }}
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
                  ) : audioUrls.speech ? (
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleTogglePlaybackSlot('speech')}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#24B8B0] px-4 py-2 font-display text-sm font-extrabold text-[#131E31] shadow hover:bg-[#34c8c0] cursor-pointer"
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

                      <span className="font-mono-num text-xs font-bold opacity-80">
                        {formatElapsed(recElapsedBySlot.speech)}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRetrySlot('speech')}
                        className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold cursor-pointer ${neutralBtnClass}`}
                      >
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{copy.spotSpeakRetryButton}</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={requestingSlot !== null || activeRecSlot !== null}
                      onClick={() => handleStartRecordingSlot('speech')}
                      className="inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-[#E07A68] px-5 py-2.5 font-display text-sm font-extrabold text-white shadow-md hover:bg-[#d36855] cursor-pointer disabled:opacity-60"
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
                      isNight ? 'text-[#B6C7DE] hover:text-white' : 'text-[#4F6482] hover:text-[#20304A]'
                    }`}
                  >
                    {copy.spotSpeakNoMicToggle}
                  </button>
                </div>

                {activeRecSlot === 'speech' && recElapsedBySlot.speech >= 60 && (
                  <p className="text-xs font-bold text-[#2ED6A3]">
                    {copy.kenyaPerformTimerSweetSpotNote}
                  </p>
                )}
              </div>
            ) : (
              <div
                className={`rounded-2xl border p-4 space-y-3 ${
                  isNight ? 'border-white/15 bg-[#192645]' : 'border-[#C9DCF0] bg-[#F7FBFF]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold">{copy.kenyaPerformTimerSuggestedLabel}</span>
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
                    checked={speechAloudConfirmed}
                    onChange={(e) => setSpeechAloudConfirmed(e.target.checked)}
                    className="h-4 w-4 accent-[#24B8B0]"
                  />
                  <span>{copy.kenyaPerformNoMicAloudCheck}</span>
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
                className={`inline-flex min-h-[40px] items-center rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer disabled:opacity-50 ${neutralBtnClass}`}
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
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#49e2b3] cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
              >
                <span>{copy.kenyaPerformGoQaButton}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: GUIDED LIVE TOURIST Q&A (Emma + Daniel) */}
        {step === 'qa' && (
          <div className="mt-4 space-y-4">
            <div className={`rounded-2xl border p-3.5 ${insetSurface}`}>
              <h3 className="font-display text-sm font-extrabold">{copy.kenyaPerformQaHeading}</h3>
              <p className={`mt-0.5 text-xs ${isNight ? 'text-[#B6C7DE]' : 'text-[#526785]'}`}>
                {copy.kenyaPerformQaIntro}
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

            {KENYA_AMBASSADOR_QA_QUESTIONS.map((q) => {
              const npc = KENYA_TOURIST_NPCS[q.npcId];
              const isRecordingThis = activeRecSlot === q.id;
              const isRequestingThis = requestingSlot === q.id;
              const recordedUrl = audioUrls[q.id];
              const isDone = noMicMode ? qaAloudConfirmed[q.id] : Boolean(recordedUrl);
              const showHint = qaShowHint[q.id];

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
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <div
                          style={{ borderColor: npc.accentColor }}
                          className={`rounded-2xl border-2 p-0.5 shadow-sm ${
                            isNight ? 'bg-[#1D2B4B]' : 'bg-white'
                          }`}
                        >
                          <KenyaTouristPortraitSVG
                            npcId={q.npcId}
                            isNight={isNight}
                            className="h-11 w-11 rounded-xl"
                          />
                        </div>
                        <span
                          style={{ backgroundColor: npc.accentColor }}
                          className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-lg text-white shadow"
                          aria-hidden="true"
                        >
                          {q.npcId === 'emma' ? (
                            <Binoculars className="h-3 w-3" />
                          ) : (
                            <Camera className="h-3 w-3" />
                          )}
                        </span>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold opacity-80">
                          {npc.name[language]} · {q.focusBadge[language]}
                        </p>
                        <p className="font-display text-sm sm:text-base font-extrabold leading-snug">
                          “{q.question.en}”
                        </p>
                        {language === 'th' && (
                          <p className={`text-xs ${isNight ? 'text-[#B6C7DE]' : 'text-[#526785]'}`}>
                            {q.question.th}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isDone && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-[#2ED6A3] px-2 py-0.5 text-[11px] font-extrabold text-[#131E31]">
                          <Check className="h-3 w-3" aria-hidden="true" />
                          {copy.kenyaPerformQaAnsweredBadge}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          onPlaySfx('click');
                          onSpeakText(q.question.en, {
                            pitch: npc.voicePitch,
                            rate: npc.voiceRate,
                          });
                        }}
                        className={`inline-flex min-h-[34px] items-center gap-1 rounded-xl border px-2.5 py-1 text-xs font-bold cursor-pointer ${neutralBtnClass}`}
                      >
                        <Volume2 className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
                        <span>{copy.jaipurListenButton}</span>
                      </button>
                    </div>
                  </div>

                  {/* Starter + Toggleable Hint */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className={`font-semibold ${isNight ? 'text-[#F2C66D]' : 'text-[#0E7A74]'}`}>
                      {copy.kenyaPracticeStarterLabel}: “{q.starter}”
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onPlaySfx('click');
                        setQaShowHint((prev) => ({ ...prev, [q.id]: !prev[q.id] }));
                      }}
                      className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold cursor-pointer ${neutralBtnClass}`}
                    >
                      <HelpCircle className="h-3 w-3" aria-hidden="true" />
                      <span>{showHint ? copy.kenyaBuildHideHint : copy.kenyaBuildShowHint}</span>
                    </button>
                  </div>

                  {showHint && (
                    <div
                      className={`rounded-xl border p-2.5 text-xs space-y-1 ${
                        isNight ? 'border-white/10 bg-[#101A30]' : 'border-[#20304A]/10 bg-white'
                      }`}
                    >
                      <p>{q.hint[language]}</p>
                      <p className="italic opacity-85">{q.modelIdea[language]}</p>
                    </div>
                  )}

                  {/* Per-Question Answer Input: Mic OR No-Mic Aloud Confirm */}
                  {!noMicMode && micSupported ? (
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      {isRecordingThis ? (
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span
                            className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold ${
                              isNight
                                ? 'bg-[#3C1E28] text-[#FFB5A7]'
                                : 'bg-[#FFEBE7] text-[#A43220]'
                            }`}
                          >
                            <span className="h-2 w-2 rounded-full bg-[#E04D3B]" aria-hidden="true" />
                            <span>{copy.spotSpeakRecordingStatus}</span>
                            <span className="font-mono-num">
                              {formatElapsed(recElapsedBySlot[q.id])}
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={handleStopRecording}
                            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#20304A] px-3.5 py-1.5 text-xs font-bold text-white cursor-pointer"
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
                            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#24B8B0] px-3.5 py-1.5 text-xs font-extrabold text-[#131E31] cursor-pointer"
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
                            className={`inline-flex min-h-[38px] items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${neutralBtnClass}`}
                          >
                            <RotateCcw className="h-3 w-3" aria-hidden="true" />
                            <span>{copy.spotSpeakRetryButton}</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={
                            isRequestingThis || activeRecSlot !== null || requestingSlot !== null
                          }
                          onClick={() => handleStartRecordingSlot(q.id)}
                          className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-[#E07A68] px-4 py-2 text-xs font-extrabold text-white shadow hover:bg-[#d36855] cursor-pointer disabled:opacity-55"
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
                          releaseSlotAudio('qa_emma');
                          releaseSlotAudio('qa_daniel');
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
                      <label className="flex min-h-[40px] items-center gap-2 text-xs font-semibold cursor-pointer">
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
                        <span>{copy.kenyaPerformQaNoMicCheck}</span>
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

                  {/* Appreciative Guided NPC Dialogue Reply once completed */}
                  {isDone && (
                    <div
                      className={`rounded-xl border p-2.5 text-xs font-semibold ${
                        isNight
                          ? 'border-[#2ED6A3]/40 bg-[#123030] text-[#D8FAF0]'
                          : 'border-[#24B8B0]/35 bg-[#EAF9F6] text-[#153B38]'
                      }`}
                    >
                      <strong>{npc.name[language]}:</strong> “{q.npcReply[language]}”
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
                className={`inline-flex min-h-[40px] items-center rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer disabled:opacity-50 ${neutralBtnClass}`}
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
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#49e2b3] cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
              >
                <span>{copy.kenyaPerformGoReflectButton}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: HONEST RUBRIC SELF-REFLECTION + SANDWICH COACHING FEEDBACK */}
        {step === 'reflect' && (
          <div className="mt-4 space-y-4">
            <div className={`rounded-2xl border p-4 space-y-3 ${insetSurface}`}>
              <h3 className="font-display text-sm sm:text-base font-extrabold">
                {copy.kenyaPerformReflectHeading}
              </h3>

              {/* Recorded Audio Playback Review Row */}
              {(audioUrls.speech || audioUrls.qa_emma || audioUrls.qa_daniel) && (
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { id: 'speech', label: copy.kenyaPerformReflectSpeechAudioLabel },
                      { id: 'qa_emma', label: 'Emma Q&A' },
                      { id: 'qa_daniel', label: 'Daniel Q&A' },
                    ] as const
                  )
                    .filter((slot) => Boolean(audioUrls[slot.id]))
                    .map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => handleTogglePlaybackSlot(slot.id)}
                        className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl bg-[#24B8B0] px-3 py-1.5 text-xs font-extrabold text-[#131E31] cursor-pointer"
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
              )}

              <p
                className={`text-[11px] leading-snug ${
                  isNight ? 'text-[#9CB2D1]' : 'text-[#5A708F]'
                }`}
              >
                {copy.kenyaPerformReflectDisclaimer}
              </p>

              {/* All 6 Required Ambassador Rubric Self-Reflection Dimensions */}
              <div className="space-y-2 pt-1">
                <p className="text-xs font-bold">{copy.kenyaPerformReflectPrompt}</p>
                <div className="space-y-2">
                  {KENYA_AMBASSADOR_RUBRIC.map((dim) => {
                    const value = rubricRatings[dim.id];
                    return (
                      <div
                        key={dim.id}
                        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border p-2.5 ${
                          value
                            ? isNight
                              ? 'border-[#2ED6A3]/45 bg-[#132934]'
                              : 'border-[#2ED6A3]/50 bg-white'
                            : isNight
                              ? 'border-white/10 bg-[#15223D]'
                              : 'border-[#20304A]/10 bg-white'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="font-display text-xs font-extrabold">{dim.title[language]}</p>
                          <p
                            className={`text-[11px] ${
                              isNight ? 'text-[#B6C7DE]' : 'text-[#526785]'
                            }`}
                          >
                            {dim.description[language]}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              onPlaySfx('click');
                              setRubricRatings((prev) => ({ ...prev, [dim.id]: 'strong' }));
                            }}
                            aria-pressed={value === 'strong'}
                            className={`min-h-[34px] rounded-lg border px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                              value === 'strong'
                                ? 'border-[#2ED6A3] bg-[#2ED6A3] text-[#131E31]'
                                : neutralBtnClass
                            }`}
                          >
                            {copy.kenyaPerformRubricStrongLabel}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onPlaySfx('click');
                              setRubricRatings((prev) => ({ ...prev, [dim.id]: 'practice' }));
                            }}
                            aria-pressed={value === 'practice'}
                            className={`min-h-[34px] rounded-lg border px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                              value === 'practice'
                                ? 'border-[#F2C66D] bg-[#F2C66D] text-[#131E31]'
                                : neutralBtnClass
                            }`}
                          >
                            {copy.kenyaPerformRubricPracticeLabel}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Honest 3-Part Sandwich Coaching Feedback */}
            <div
              className={`rounded-2xl border p-4 space-y-2 text-xs sm:text-sm ${
                isNight
                  ? 'border-[#2ED6A3]/40 bg-[#123030] text-[#E6FAF5]'
                  : 'border-[#24B8B0]/35 bg-[#EAF9F6] text-[#153B38]'
              }`}
            >
              <p>
                <strong className="font-display">{copy.spotSpeakFeedbackPositiveLabel}:</strong>{' '}
                {KENYA_AMBASSADOR_SANDWICH_FEEDBACK.positive[language]}
              </p>
              <p>
                <strong className="font-display">{copy.spotSpeakFeedbackTipLabel}:</strong>{' '}
                {KENYA_AMBASSADOR_SANDWICH_FEEDBACK.improvement[language]}
              </p>
              <p>
                <strong className="font-display">{copy.spotSpeakFeedbackNextLabel}:</strong>{' '}
                {KENYA_AMBASSADOR_SANDWICH_FEEDBACK.nextStep[language]}
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
                className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${neutralBtnClass}`}
              >
                <span>{copy.backButton}</span>
              </button>

              <button
                type="button"
                disabled={!reflectionReady}
                onClick={handleFinishMission}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2.5 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#f7d487] cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Award className="h-4 w-4" aria-hidden="true" />
                <span>
                  {alreadyCompleted
                    ? copy.kenyaPerformReplayFinishButton
                    : copy.kenyaPerformFinishButton}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* CEREMONY: KENYA WILDLIFE AMBASSADOR PASSPORT STAMP + XP BREAKDOWN */}
        {step === 'ceremony' && (
          <div className="mt-4 space-y-4">
            <div
              className={`rounded-3xl border-2 p-5 sm:p-6 text-center ${
                isNight
                  ? 'border-[#F2C66D]/70 bg-[#172342]'
                  : 'border-[#F2C66D] bg-gradient-to-b from-[#FFF8E8] to-[#FFFDF8]'
              }`}
            >
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#24B8B0]">
                <Sparkles className="h-4 w-4 text-[#F2C66D]" aria-hidden="true" />
                <span>{copy.kenyaPerformCeremonyBadge}</span>
              </div>

              <h3
                className={`mt-1 font-display text-2xl font-extrabold ${
                  isNight ? 'text-[#F2C66D]' : 'text-[#C46B2B]'
                }`}
              >
                {copy.kenyaPerformCeremonyTitle}
              </h3>

              <div className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-[#2ED6A3] px-3 py-1 font-display text-xs font-extrabold text-[#131E31]">
                <Award className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{copy.kenyaPerformAmbassadorTitle}</span>
              </div>

              <p
                className={`mt-2 text-xs sm:text-sm font-medium ${
                  isNight ? 'text-[#D6E1F0]' : 'text-[#48607E]'
                }`}
              >
                {wasFirstCompletion
                  ? copy.kenyaPerformCeremonySubtitle
                  : copy.kenyaPerformCeremonyReplaySubtitle}
              </p>

              {/* Kenya Circular Passport Stamp with Warm Medallion Halo */}
              <div className="my-5 flex justify-center">
                <div
                  className={`rounded-full border-2 p-3 shadow-md ${
                    isNight
                      ? 'border-[#F2C66D]/50 bg-[#F2C66D]/10'
                      : 'border-[#F2C66D]/75 bg-[#FFF6DC]'
                  }`}
                >
                  <KenyaWildSpeakStampSVG
                    language={language}
                    appearance={appearance}
                    earned={true}
                    completedAt={completedAt}
                    sizeClass="h-40 w-40"
                  />
                </div>
              </div>

              {/* XP Breakdown */}
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {wasFirstCompletion && (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#F2C66D] px-3.5 py-1.5 font-mono-num text-sm font-extrabold text-[#131E31] shadow">
                    +{KENYA_PERFORM_XP_REWARD} {copy.xpLabel}
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold ${insetSurface}`}
                >
                  <span className="font-mono-num">
                    50 + 50 + 50 + 100 = {TOTAL_KENYA_MISSION_XP} {copy.xpLabel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{copy.kenyaPerformTotalXpNote}</span>
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold ${insetSurface}`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
                  <span className="font-mono-num">
                    {currentTotalXp} {copy.xpLabel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{copy.kenyaPerformCumulativeXpNote}</span>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => {
                  releaseAllAudioResources();
                  onStopSpeech();
                  onPlaySfx('click');
                  onClose();
                }}
                className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-4 py-2 text-xs sm:text-sm font-bold cursor-pointer ${neutralBtnClass}`}
              >
                <span>{copy.kenyaPerformStayKenyaButton}</span>
              </button>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    releaseAllAudioResources();
                    onStopSpeech();
                    onViewPassport();
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#24B8B0] px-4 py-2.5 font-display text-xs sm:text-sm font-extrabold text-[#131E31] shadow hover:bg-[#34c8c0] cursor-pointer"
                >
                  <Stamp className="h-4 w-4" aria-hidden="true" />
                  <span>{copy.kenyaPerformViewPassportButton}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    releaseAllAudioResources();
                    onStopSpeech();
                    onReturnWorldMap();
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#F2C66D] px-4 py-2.5 font-display text-xs sm:text-sm font-extrabold text-[#131E31] shadow hover:bg-[#f7d487] cursor-pointer"
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
