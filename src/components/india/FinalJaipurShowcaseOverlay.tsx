import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  Compass,
  Eye,
  EyeOff,
  Lightbulb,
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
import type { JaipurVocabObjectId } from '../../data/jaipurWorld';
import {
  FINAL_JAIPUR_SHOWCASE_XP_REWARD,
  JAIPUR_SHOWCASE_CHECKLIST,
  JAIPUR_SHOWCASE_LANDMARK_OPTIONS,
  JAIPUR_SHOWCASE_MODEL_TOUR,
  JAIPUR_SHOWCASE_SANDWICH_FEEDBACK,
  JAIPUR_SHOWCASE_STARTERS,
  JAIPUR_SHOWCASE_VOCAB_REVIEW,
  TOTAL_JAIPUR_MISSION_XP,
} from '../../data/jaipurShowcase';
import {
  isMicrophoneRecordingSupported,
  startTransientMicRecording,
  type ActiveRecordingHandle,
  type RecorderErrorCode,
} from '../../utils/audioRecorder';
import { IndiaJaipurStampSVG } from '../common/IndiaJaipurStampSVG';
import { DioramaImage } from '../common/DioramaImage';
import jaipurDioramaImg from '../../assets/images/india_day_jaipur_1795070996084.jpg';
import {
  JaipurObjectIllustrationSVG,
  JaipurStageBannerSVG,
} from './JaipurMiniGameArtwork';
import { shuffleArray } from '../../utils/shuffle';

interface FinalJaipurShowcaseOverlayProps {
  language: AppLanguage;
  appearance: ResolvedAppearance;
  reducedMotion: boolean;
  alreadyCompleted: boolean;
  totalJaipurXp?: number;
  completedAt?: string;
  onPlaySfx: (kind?: 'click' | 'select' | 'mode' | 'reward') => void;
  onSpeakText: (text: string) => void;
  onStopSpeech: () => void;
  onCompleteShowcase: () => { firstCompletion: boolean };
  onViewPassport: () => void;
  onReturnWorldMap: () => void;
  onClose: () => void;
}

type ShowcaseStep = 'prepare' | 'perform' | 'reflect' | 'ceremony';

function formatElapsed(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function FinalJaipurShowcaseOverlay({
  language,
  appearance,
  reducedMotion,
  alreadyCompleted,
  completedAt,
  onPlaySfx,
  onSpeakText,
  onStopSpeech,
  onCompleteShowcase,
  onViewPassport,
  onReturnWorldMap,
  onClose,
}: FinalJaipurShowcaseOverlayProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';

  const [step, setStep] = useState<ShowcaseStep>('prepare');
  const [hideScaffolding, setHideScaffolding] = useState(false);

  const micSupported = isMicrophoneRecordingSupported();
  const [noMicMode, setNoMicMode] = useState(!micSupported);
  const [recordingState, setRecordingState] = useState<
    'idle' | 'requesting' | 'recording' | 'recorded'
  >('idle');
  const [elapsedSec, setElapsedSec] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [micError, setMicError] = useState<RecorderErrorCode | null>(null);

  // Accessible no-microphone structured tour outline state
  const [selectedLandmarks, setSelectedLandmarks] = useState<JaipurVocabObjectId[]>([
    'palace',
    'archway',
    'fountain',
  ]);
  const [customTourSentence, setCustomTourSentence] = useState('');
  const [readAloudConfirmed, setReadAloudConfirmed] = useState(false);

  // Required reflection checklist & self-evaluation
  const [checkedElements, setCheckedElements] = useState<Record<string, boolean>>({
    greeting: false,
    intro: false,
    landmarks: false,
    closing: false,
  });
  const [selfConfidence, setSelfConfidence] = useState<'clear' | 'retry'>('clear');
  const [wasFirstCompletion, setWasFirstCompletion] = useState(!alreadyCompleted);
  const shuffledLandmarkOptions = useMemo(
    () => shuffleArray(JAIPUR_SHOWCASE_LANDMARK_OPTIONS),
    [],
  );

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
    setStep('perform');
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

  const toggleLandmarkOption = (id: JaipurVocabObjectId) => {
    onPlaySfx('click');
    setSelectedLandmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleReflectElement = (id: string) => {
    onPlaySfx('click');
    setCheckedElements((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const noMicReady = selectedLandmarks.length >= 3 && readAloudConfirmed;
  const performReady = noMicMode ? noMicReady : recordingState === 'recorded';
  const reflectionReady = JAIPUR_SHOWCASE_CHECKLIST.every((item) => checkedElements[item.id]);

  const handleFinishMission = () => {
    stopPlayback();
    onStopSpeech();
    const result = onCompleteShowcase();
    setWasFirstCompletion(result.firstCompletion);
    setStep('ceremony');
  };

  const steps: { id: ShowcaseStep; label: string }[] = [
    { id: 'prepare', label: copy.showcaseStepPrepare },
    { id: 'perform', label: copy.showcaseStepPerform },
    { id: 'reflect', label: copy.showcaseStepReflect },
    { id: 'ceremony', label: copy.showcaseStepCeremony },
  ];

  const cardSurface = isNight
    ? 'border-[#F2C66D]/55 bg-[#121C36]/97 text-[#F7F9FC] shadow-2xl'
    : 'border-[#E5B88E] bg-[#FFFDF8]/98 text-[#1E2E46] shadow-[0_24px_56px_rgba(32,48,74,0.24)]';

  const insetSurface = isNight
    ? 'border-white/12 bg-[#1A2847]'
    : 'border-[#E6CCB0] bg-[#FFF8EE]';

  const neutralBtnClass = isNight
    ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
    : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A] hover:bg-[#DCE8F5]';

  const waveBars = [46, 80, 56, 94, 62, 86, 52];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="jaipur-showcase-title"
      className={`fixed inset-0 z-30 flex items-end sm:items-center justify-center p-3 sm:p-6 ${
        isNight ? 'bg-[#090F1E]/65' : 'bg-[#20304A]/24'
      }`}
    >
      <div
        className={`w-full max-w-2xl max-h-[92dvh] overflow-y-auto rounded-3xl border-2 ${
          reducedMotion ? '' : 'transition-colors duration-200'
        } ${cardSurface}`}
      >
        {/* Jaipur Festival Top Stripe */}
        <div
          className="h-2 w-full"
          aria-hidden="true"
          style={{
            backgroundImage:
              'linear-gradient(90deg, #C4503B 0%, #F2C66D 50%, #24B8B0 100%)',
          }}
        />

        <div className="p-5 sm:p-6">
          {/* Header with Scenic Thumbnail + Title */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-14 w-16 sm:h-16 sm:w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-[#F2C66D]/80 shadow-sm">
                <DioramaImage
                  src={jaipurDioramaImg}
                  alt={copy.showcaseTitle}
                  title={copy.showcaseTitle}
                  appearance={appearance}
                  accentColor="#E07A68"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p
                  className={`text-xs font-bold ${
                    isNight ? 'text-[#2ED6A3]' : 'text-[#0E7A74]'
                  }`}
                >
                  {copy.showcaseMissionBadge} <span aria-hidden="true">·</span>{' '}
                  {copy.showcaseTargetDuration}
                </p>
                <h2
                  id="jaipur-showcase-title"
                  className={`mt-0.5 font-display text-xl sm:text-2xl font-extrabold truncate ${
                    isNight ? 'text-[#F2C66D]' : 'text-[#C4503B]'
                  }`}
                >
                  {copy.showcaseTitle}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              aria-label={copy.closeSettings}
              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border cursor-pointer ${neutralBtnClass}`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Royal Courtyard Amphitheater Decorative Banner */}
          {step !== 'ceremony' && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-[#D9B896]/40">
              <JaipurStageBannerSVG isNight={isNight} className="h-12 sm:h-14 w-full" />
            </div>
          )}

          {/* 4-Step Progress Bar */}
          <div className="mt-3.5 grid grid-cols-4 gap-1.5" aria-label="Final Showcase Steps">
            {steps.map((s, idx) => {
              const orderMap: Record<ShowcaseStep, number> = {
                prepare: 0,
                perform: 1,
                reflect: 2,
                ceremony: 3,
              };
              const currentIdx = orderMap[step];
              const active = s.id === step;
              const done = idx < currentIdx;
              return (
                <div
                  key={s.id}
                  className={`flex items-center justify-center gap-1 rounded-xl border px-2 py-1.5 text-center text-[11px] font-bold whitespace-nowrap truncate ${
                    active
                      ? 'border-[#C4503B]/40 bg-[#F2C66D] text-[#131E31] shadow-xs'
                      : done
                        ? 'border-[#2ED6A3]/40 bg-[#2ED6A3]/20 text-[#0E7A74] dark:text-[#2ED6A3]'
                        : isNight
                          ? 'border-white/10 bg-[#1A2847] text-[#8EA4C4]'
                          : 'border-[#E2E8F0] bg-[#EEF4FA] text-[#5B708E]'
                  }`}
                >
                  <span className="font-mono-num opacity-75">{idx + 1}.</span>
                  <span className="truncate">{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* STEP 1: BRIEF & MODEL BEFORE PERFORMANCE */}
          {step === 'prepare' && (
            <div className="mt-4 space-y-3.5">
              <div className={`rounded-2xl border p-4 ${insetSurface}`}>
                <p className="text-sm font-semibold leading-relaxed">{copy.showcaseBriefText}</p>
                <p
                  className={`mt-3 font-display text-xs font-extrabold ${
                    isNight ? 'text-[#F2C66D]' : 'text-[#9E4226]'
                  }`}
                >
                  {copy.showcaseRequirementsHeading}
                </p>
                <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {JAIPUR_SHOWCASE_CHECKLIST.map((item) => (
                    <li
                      key={item.id}
                      className={`flex items-start gap-2 rounded-xl border p-2.5 ${
                        isNight
                          ? 'border-white/10 bg-[#121C36]/60'
                          : 'border-[#E6CCB0]/70 bg-white/80'
                      }`}
                    >
                      <CheckCircle2
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#24B8B0]"
                        aria-hidden="true"
                      />
                      <span>{item.label[language]}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Scaffolding Visibility Control */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className={`text-xs font-bold ${
                    isNight ? 'text-[#C3CFE0]' : 'text-[#4F6482]'
                  }`}
                >
                  {copy.showcaseModelHeading} <span aria-hidden="true">·</span>{' '}
                  {copy.spotSpeakAudioNotice}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('click');
                    setHideScaffolding((h) => !h);
                  }}
                  className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${neutralBtnClass}`}
                >
                  {hideScaffolding ? (
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span>
                    {hideScaffolding
                      ? copy.showcaseShowScaffoldButton
                      : copy.showcaseHideScaffoldButton}
                  </span>
                </button>
              </div>

              {!hideScaffolding ? (
                <>
                  {/* Short Example Tour Model */}
                  <div className={`rounded-2xl border p-4 space-y-2.5 ${insetSurface}`}>
                    <p className="text-sm font-medium leading-relaxed">
                      “{JAIPUR_SHOWCASE_MODEL_TOUR.en}”
                    </p>
                    {language === 'th' && (
                      <p
                        className={`text-xs leading-relaxed border-t pt-2 ${
                          isNight
                            ? 'border-white/10 text-[#B6C7DE]'
                            : 'border-[#20304A]/10 text-[#4F6482]'
                        }`}
                      >
                        {JAIPUR_SHOWCASE_MODEL_TOUR.th}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => onSpeakText(JAIPUR_SHOWCASE_MODEL_TOUR.en)}
                      className={`inline-flex min-h-[40px] items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-bold cursor-pointer ${
                        isNight
                          ? 'border-[#24B8B0]/50 bg-[#143640] text-[#E6FAF5] hover:bg-[#1B4855]'
                          : 'border-[#24B8B0]/40 bg-[#E6F5FB] text-[#0E7A74] hover:bg-[#D4ECF8]'
                      }`}
                    >
                      <Volume2 className="h-4 w-4 text-[#24B8B0]" aria-hidden="true" />
                      <span>{copy.jaipurListenButton}</span>
                    </button>
                  </div>

                  {/* Useful Starters & Vocabulary Review */}
                  <div className={`rounded-2xl border p-4 space-y-3 ${insetSurface}`}>
                    <div>
                      <p className="font-display text-xs font-extrabold">
                        {copy.showcaseStartersHeading}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {JAIPUR_SHOWCASE_STARTERS.map((item) => (
                          <span
                            key={item.id}
                            className={`rounded-xl border px-2.5 py-1 text-xs font-semibold ${
                              isNight
                                ? 'border-[#F2C66D]/35 bg-[#242945] text-[#FBE1A6]'
                                : 'border-[#E0A938]/40 bg-[#FFFDF8] text-[#7A4E07]'
                            }`}
                          >
                            “{item.starter}”{' '}
                            <span className="opacity-75">· {item.hint[language]}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-display text-xs font-extrabold">
                        {copy.showcaseVocabHeading}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {JAIPUR_SHOWCASE_VOCAB_REVIEW.map((v) => (
                          <span
                            key={v.word}
                            className={`rounded-xl border px-2.5 py-1 text-xs font-semibold ${
                              isNight
                                ? 'border-[#24B8B0]/40 bg-[#153440] text-[#D8FAF0]'
                                : 'border-[#24B8B0]/35 bg-[#E6FAF5] text-[#0E5B56]'
                            }`}
                          >
                            <strong>{v.word}</strong>{' '}
                            <span className="opacity-75">· {v.th}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className={`rounded-2xl border p-4 text-xs font-semibold text-center ${insetSurface}`}
                >
                  {copy.showcaseScaffoldHiddenNote}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onStopSpeech();
                    onPlaySfx('select');
                    setStep('perform');
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2.5 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#f7d487] cursor-pointer"
                >
                  <span>{copy.showcaseGoPerformButton}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PERFORM TOUR (Mic Recording OR No-Mic Structured Tour Builder) */}
          {step === 'perform' && (
            <div className="mt-4 space-y-3.5">
              <div className={`rounded-2xl border p-3.5 space-y-2 ${insetSurface}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs sm:text-sm font-semibold">{copy.showcaseRecordingHint}</p>
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('click');
                      setHideScaffolding((h) => !h);
                    }}
                    className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold cursor-pointer ${neutralBtnClass}`}
                  >
                    {hideScaffolding ? (
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    <span>
                      {hideScaffolding
                        ? copy.showcaseShowScaffoldButton
                        : copy.showcaseHideScaffoldButton}
                    </span>
                  </button>
                </div>

                {!hideScaffolding ? (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {JAIPUR_SHOWCASE_STARTERS.map((s) => (
                      <span
                        key={s.id}
                        className={`rounded-lg border px-2 py-0.5 text-[11px] font-semibold ${
                          isNight
                            ? 'border-[#F2C66D]/30 bg-[#242945] text-[#FBE1A6]'
                            : 'border-[#E0A938]/35 bg-[#FFFDF8] text-[#7A4E07]'
                        }`}
                      >
                        “{s.starter}”
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => onSpeakText(JAIPUR_SHOWCASE_MODEL_TOUR.en)}
                      className={`ml-auto inline-flex min-h-[34px] items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold cursor-pointer ${
                        isNight
                          ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC]'
                          : 'border-[#24B8B0]/35 bg-[#E6F5FB] text-[#0E7A74]'
                      }`}
                    >
                      <Volume2 className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
                      <span>{copy.jaipurListenButton}</span>
                    </button>
                  </div>
                ) : (
                  <p
                    className={`text-xs font-semibold ${
                      isNight ? 'text-[#B6C7DE]' : 'text-[#4F6482]'
                    }`}
                  >
                    {copy.showcaseScaffoldHiddenNote}
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
                  className={`rounded-2xl border-2 p-4 space-y-3 ${
                    isNight ? 'border-[#24B8B0]/30 bg-[#192645]' : 'border-[#C9DCF0] bg-[#F7FBFF]'
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
                          <span className="font-mono-num">{formatElapsed(elapsedSec)} / 1:00</span>
                        </span>

                        <div className="flex h-6 items-end gap-1" aria-hidden="true">
                          {waveBars.map((h, i) => (
                            <span
                              key={i}
                              style={{ height: `${h}%` }}
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
                          className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold cursor-pointer ${neutralBtnClass}`}
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
                        isNight
                          ? 'text-[#B6C7DE] hover:text-white'
                          : 'text-[#4F6482] hover:text-[#20304A]'
                      }`}
                    >
                      {copy.spotSpeakNoMicToggle}
                    </button>
                  </div>
                </div>
              ) : (
                /* Accessible No-Microphone Tour Builder & Aloud Delivery */
                <div
                  className={`rounded-2xl border-2 p-4 space-y-3 ${
                    isNight ? 'border-white/15 bg-[#192645]' : 'border-[#C9DCF0] bg-[#F7FBFF]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-display text-xs font-extrabold">{copy.showcaseNoMicHeading}</p>
                      <p className="text-xs font-semibold mt-0.5">
                        {copy.showcaseNoMicPickThreeLabel}{' '}
                        <span className="font-mono-num text-[#24B8B0]">
                          ({copy.showcaseNoMicPickedCountLabel}: {selectedLandmarks.length}/3+)
                        </span>
                      </p>
                    </div>
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

                  {/* Landmark Tour Picker Cards with Illustrated Miniatures */}
                  <div className="flex flex-wrap gap-2">
                    {shuffledLandmarkOptions.map((opt) => {
                      const active = selectedLandmarks.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => toggleLandmarkOption(opt.id)}
                          aria-pressed={active}
                          className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border-2 px-3 py-1.5 font-display text-xs font-bold cursor-pointer ${
                            active
                              ? 'border-[#2ED6A3] bg-[#2ED6A3]/20 text-[#0E7A74] dark:text-[#2ED6A3]'
                              : neutralBtnClass
                          }`}
                        >
                          <JaipurObjectIllustrationSVG
                            objectId={opt.id}
                            isNight={isNight}
                            className="h-7 w-7 rounded-lg border border-black/10 shrink-0"
                          />
                          <span>{opt.label[language]}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Live Guided Tour Outline Scroll */}
                  <div className={`rounded-xl border p-3 text-xs space-y-1.5 ${insetSurface}`}>
                    <p className="font-semibold">1. Welcome to Jaipur! This city is famous for its pink sandstone buildings.</p>
                    {JAIPUR_SHOWCASE_LANDMARK_OPTIONS.filter((o) =>
                      selectedLandmarks.includes(o.id),
                    ).map((o, idx) => (
                      <p key={o.id}>
                        {idx + 2}. {o.sampleLine}
                      </p>
                    ))}
                    {customTourSentence.trim() && (
                      <p className="font-semibold text-[#24B8B0]">
                        ★ {customTourSentence.trim()}
                      </p>
                    )}
                    <p className="font-semibold">
                      {selectedLandmarks.length + 2}. Thank you for visiting Jaipur!
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="showcase-custom-line"
                      className="block text-xs font-semibold mb-1"
                    >
                      {copy.showcaseNoMicCustomNoteLabel}
                    </label>
                    <input
                      id="showcase-custom-line"
                      type="text"
                      maxLength={140}
                      value={customTourSentence}
                      onChange={(e) => setCustomTourSentence(e.target.value)}
                      placeholder={copy.showcaseNoMicCustomNotePlaceholder}
                      className={`w-full rounded-xl border px-3 py-2 text-xs sm:text-sm ${
                        isNight
                          ? 'border-white/20 bg-[#131E31] text-white placeholder:text-[#7E94B3]'
                          : 'border-[#20304A]/20 bg-white text-[#1E2E46] placeholder:text-[#7E94B3]'
                      }`}
                    />
                  </div>

                  <label className="flex min-h-[44px] items-center gap-2.5 text-xs sm:text-sm font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={readAloudConfirmed}
                      onChange={(e) => setReadAloudConfirmed(e.target.checked)}
                      className="h-4 w-4 accent-[#24B8B0]"
                    />
                    <span>{copy.showcaseNoMicAloudCheck}</span>
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
                  className={`inline-flex min-h-[40px] items-center rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${neutralBtnClass}`}
                >
                  {copy.backButton}
                </button>

                <button
                  type="button"
                  disabled={!performReady}
                  onClick={() => {
                    stopPlayback();
                    onStopSpeech();
                    onPlaySfx('select');
                    setStep('reflect');
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#49e2b3] cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <span>{copy.showcaseGoReflectButton}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: HONEST SELF-REFLECTION & SANDWICH FEEDBACK */}
          {step === 'reflect' && (
            <div className="mt-4 space-y-3.5">
              <div className={`rounded-2xl border p-4 space-y-3 ${insetSurface}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-sm font-extrabold">
                    {copy.showcaseReflectHeading}
                  </h3>
                  {audioUrl && (
                    <button
                      type="button"
                      onClick={handleTogglePlayback}
                      className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl bg-[#24B8B0] px-3 py-1 text-xs font-extrabold text-[#131E31] cursor-pointer"
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
                </div>

                <p
                  className={`text-[11px] leading-snug ${
                    isNight ? 'text-[#9CB2D1]' : 'text-[#5A708F]'
                  }`}
                >
                  {copy.spotSpeakSelfReviewDisclaimer}
                </p>

                <div className="space-y-2 pt-1">
                  <p className="text-xs font-bold">{copy.showcaseReflectChecklistPrompt}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {JAIPUR_SHOWCASE_CHECKLIST.map((item) => {
                      const checked = Boolean(checkedElements[item.id]);
                      return (
                        <label
                          key={item.id}
                          className={`flex min-h-[42px] items-center gap-2.5 rounded-xl border px-3 py-2 text-xs font-semibold cursor-pointer ${
                            checked
                              ? 'border-[#2ED6A3] bg-[#2ED6A3]/18 text-[#0E7A74] dark:text-[#2ED6A3]'
                              : neutralBtnClass
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleReflectElement(item.id)}
                            className="h-4 w-4 accent-[#24B8B0]"
                          />
                          <span>{item.label[language]}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('click');
                      setSelfConfidence('clear');
                    }}
                    className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                      selfConfidence === 'clear'
                        ? 'border-[#2ED6A3] bg-[#2ED6A3]/20 text-[#0E7A74] dark:text-[#2ED6A3]'
                        : neutralBtnClass
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.spotSpeakConfidenceGood}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('click');
                      setSelfConfidence('retry');
                    }}
                    className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                      selfConfidence === 'retry'
                        ? 'border-[#F2C66D] bg-[#F2C66D]/25 text-[#8E5B08] dark:text-[#F2C66D]'
                        : neutralBtnClass
                    }`}
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.spotSpeakConfidenceRetry}</span>
                  </button>
                </div>
              </div>

              {/* Honest Sandwich Feedback */}
              <div
                className={`rounded-2xl border p-4 space-y-2.5 text-xs sm:text-sm ${
                  isNight
                    ? 'border-[#2ED6A3]/40 bg-[#123030] text-[#E6FAF5]'
                    : 'border-[#24B8B0]/35 bg-[#EAF9F6] text-[#153B38]'
                }`}
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#2ED6A3]" aria-hidden="true" />
                  <p>
                    <strong className="font-display">{copy.spotSpeakFeedbackPositiveLabel}:</strong>{' '}
                    {JAIPUR_SHOWCASE_SANDWICH_FEEDBACK.positive[language]}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#D99B26]" aria-hidden="true" />
                  <p>
                    <strong className="font-display">{copy.spotSpeakFeedbackTipLabel}:</strong>{' '}
                    {JAIPUR_SHOWCASE_SANDWICH_FEEDBACK.improvement[language]}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Compass className="mt-0.5 h-4 w-4 shrink-0 text-[#24B8B0]" aria-hidden="true" />
                  <p>
                    <strong className="font-display">{copy.spotSpeakFeedbackNextLabel}:</strong>{' '}
                    {JAIPUR_SHOWCASE_SANDWICH_FEEDBACK.nextStep[language]}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleRetryRecording}
                  className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${neutralBtnClass}`}
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.spotSpeakRetryButton}</span>
                </button>

                <button
                  type="button"
                  disabled={!reflectionReady}
                  onClick={handleFinishMission}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2.5 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#f7d487] cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <Award className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {alreadyCompleted ? copy.showcaseReplayFinishButton : copy.showcaseFinishButton}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: INDIA PASSPORT STAMP CEREMONY */}
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
                  <span>{copy.showcaseCeremonyBadge}</span>
                </div>

                <h3
                  className={`mt-1 font-display text-2xl font-extrabold ${
                    isNight ? 'text-[#F2C66D]' : 'text-[#C4503B]'
                  }`}
                >
                  {copy.showcaseCeremonyTitle}
                </h3>
                <p
                  className={`mt-1 text-xs sm:text-sm font-medium ${
                    isNight ? 'text-[#D6E1F0]' : 'text-[#48607E]'
                  }`}
                >
                  {wasFirstCompletion
                    ? copy.showcaseCeremonySubtitle
                    : copy.showcaseCeremonyReplaySubtitle}
                </p>

                {/* India Circular Passport Stamp with Warm Medallion Halo */}
                <div className="my-5 flex justify-center">
                  <div
                    className={`rounded-full p-2.5 shadow-[0_0_28px_rgba(242,198,109,0.35)] ${
                      reducedMotion ? '' : 'transition-transform duration-300 scale-100'
                    }`}
                  >
                    <IndiaJaipurStampSVG
                      language={language}
                      appearance={appearance}
                      earned={true}
                      completedAt={completedAt}
                      sizeClass="h-40 w-40"
                    />
                  </div>
                </div>

                {/* XP Breakdown (50 + 50 + 50 + 100 = 250 XP) */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {wasFirstCompletion && (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#F2C66D] px-3.5 py-1.5 font-mono-num text-sm font-extrabold text-[#131E31] shadow">
                      +{FINAL_JAIPUR_SHOWCASE_XP_REWARD} {copy.xpLabel}
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold ${insetSurface}`}
                  >
                    <span className="font-mono-num">
                      50 + 50 + 50 + 100 = {TOTAL_JAIPUR_MISSION_XP} {copy.xpLabel}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{copy.showcaseTotalXpNote}</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    releaseRecordingResources();
                    onStopSpeech();
                    onPlaySfx('click');
                    onClose();
                  }}
                  className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-4 py-2 text-xs sm:text-sm font-bold cursor-pointer ${neutralBtnClass}`}
                >
                  <span>{copy.showcaseStayJaipurButton}</span>
                </button>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      releaseRecordingResources();
                      onStopSpeech();
                      onViewPassport();
                    }}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#24B8B0] px-4 py-2.5 font-display text-xs sm:text-sm font-extrabold text-[#131E31] shadow hover:bg-[#34c8c0] cursor-pointer"
                  >
                    <Stamp className="h-4 w-4" aria-hidden="true" />
                    <span>{copy.showcaseViewPassportButton}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      releaseRecordingResources();
                      onStopSpeech();
                      onReturnWorldMap();
                    }}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2.5 font-display text-xs sm:text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#f7d487] cursor-pointer"
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
