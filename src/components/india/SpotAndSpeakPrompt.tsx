import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
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
  Volume2,
  X,
} from 'lucide-react';
import type { AppLanguage, ResolvedAppearance } from '../../types/game';
import { GAME_COPY } from '../../data/i18n';
import type { SpotAndSpeakChallenge } from '../../data/jaipurSpotAndSpeak';
import {
  isMicrophoneRecordingSupported,
  startTransientMicRecording,
  type ActiveRecordingHandle,
  type RecorderErrorCode,
} from '../../utils/audioRecorder';
import { JaipurObjectIllustrationSVG } from './JaipurMiniGameArtwork';
import { shuffleArray } from '../../utils/shuffle';

interface SpotAndSpeakPromptProps {
  challenge: SpotAndSpeakChallenge;
  language: AppLanguage;
  appearance: ResolvedAppearance;
  alreadyDone: boolean;
  completedCount: number;
  totalCount: number;
  onPlaySfx: (kind?: 'click' | 'select' | 'mode' | 'reward') => void;
  onSpeakText: (text: string) => void;
  onStopSpeech: () => void;
  onCompleteChallenge: () => void;
  onClose: () => void;
}

type PromptStep = 'look' | 'listen' | 'speak' | 'review';

function formatElapsed(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function SpotAndSpeakPrompt({
  challenge,
  language,
  appearance,
  alreadyDone,
  completedCount,
  totalCount,
  onPlaySfx,
  onSpeakText,
  onStopSpeech,
  onCompleteChallenge,
  onClose,
}: SpotAndSpeakPromptProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';

  const [step, setStep] = useState<PromptStep>('look');
  const [showHints, setShowHints] = useState(false);

  const micSupported = isMicrophoneRecordingSupported();
  const [noMicMode, setNoMicMode] = useState(!micSupported);
  const [recordingState, setRecordingState] = useState<'idle' | 'requesting' | 'recording' | 'recorded'>('idle');
  const [elapsedSec, setElapsedSec] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [micError, setMicError] = useState<RecorderErrorCode | null>(null);

  // Accessible no-microphone engagement state
  const [selectedNoMicPhrase, setSelectedNoMicPhrase] = useState<string | null>(null);
  const [readAloudConfirmed, setReadAloudConfirmed] = useState(false);

  // Step 4 honest self-reflection state
  const [selfConfidence, setSelfConfidence] = useState<'clear' | 'retry'>('clear');
  const [attemptNonce, setAttemptNonce] = useState(0);

  const recorderRef = useRef<ActiveRecordingHandle | null>(null);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  audioUrlRef.current = audioUrl;

  const phraseOptions = useMemo(() => {
    const raw = [challenge.noMicFocusPhrase, ...challenge.noMicDistractors];
    return shuffleArray(raw);
  }, [challenge, attemptNonce]);

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

  // Clean up all microphone tracks, object URLs, and speech on unmount
  useEffect(() => {
    return () => {
      releaseRecordingResources();
      onStopSpeech();
    };
  }, [onStopSpeech, releaseRecordingResources]);

  // Recording elapsed seconds timer
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
    setSelectedNoMicPhrase(null);
    setReadAloudConfirmed(false);
    setAttemptNonce((n) => n + 1);
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

  const noMicReady =
    selectedNoMicPhrase === challenge.noMicFocusPhrase && readAloudConfirmed;

  const steps: { id: PromptStep; label: string }[] = [
    { id: 'look', label: copy.spotSpeakStepLook },
    { id: 'listen', label: copy.spotSpeakStepListen },
    { id: 'speak', label: copy.spotSpeakStepSpeak },
    { id: 'review', label: copy.spotSpeakStepReview },
  ];

  const waveBars = [42, 74, 56, 90, 64, 80, 48];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="spot-speak-modal-title"
      className={`fixed inset-0 z-30 flex items-end sm:items-center justify-center p-3 sm:p-6 ${
        isNight ? 'bg-[#090F1E]/62' : 'bg-[#20304A]/24'
      }`}
    >
      <div
        className={`w-full max-w-xl max-h-[92dvh] overflow-y-auto rounded-3xl border-2 transition-colors ${
          isNight
            ? 'border-[#F2C66D]/55 bg-[#121C36]/97 text-[#F7F9FC] shadow-2xl'
            : 'border-[#E5B88E] bg-[#FFFDF8]/98 text-[#1E2E46] shadow-[0_22px_52px_rgba(32,48,74,0.22)]'
        }`}
      >
        {/* Jaipur Sandstone & Peacock Teal Accent Strip */}
        <div
          className="h-2 w-full"
          aria-hidden="true"
          style={{
            backgroundImage:
              'linear-gradient(90deg, #E07A68 0%, #F2C66D 50%, #24B8B0 100%)',
          }}
        />

        <div className="p-5 sm:p-6">
          {/* Header: Illustrated Landmark + Identity + Progress + Close */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative shrink-0">
                <JaipurObjectIllustrationSVG
                  objectId={challenge.id}
                  isNight={isNight}
                  className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl border-2 border-[#F2C66D]/80 shadow-sm"
                />
                <span
                  style={{ backgroundColor: challenge.accentColor }}
                  className="absolute -bottom-1 -right-1 rounded-lg border-2 border-white px-1.5 py-0.5 font-mono-num text-[10px] font-extrabold text-white shadow"
                >
                  {challenge.order}/{totalCount}
                </span>
              </div>

              <div className="min-w-0">
                <p
                  className={`text-xs font-semibold truncate ${
                    isNight ? 'text-[#B6C7DE]' : 'text-[#4F6482]'
                  }`}
                >
                  {challenge.locationHint[language]} <span aria-hidden="true">·</span>{' '}
                  <span className="font-mono-num font-bold">
                    {copy.spotSpeakProgressLabel}: {completedCount}/{totalCount}
                  </span>
                </p>
                <h2
                  id="spot-speak-modal-title"
                  className={`mt-0.5 font-display text-lg sm:text-xl font-extrabold truncate ${
                    isNight ? 'text-[#F2C66D]' : 'text-[#C4503B]'
                  }`}
                >
                  {challenge.title[language]}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              aria-label={copy.closeSettings}
              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border cursor-pointer ${
                isNight
                  ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                  : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A] hover:bg-[#DCE8F5]'
              }`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* 4-Step Connected Journey Stepper: LOOK -> LISTEN -> SPEAK -> REVIEW */}
          <div className="mt-4 grid grid-cols-4 gap-1.5" aria-label="Speaking Practice Steps">
            {steps.map((s, idx) => {
              const active = s.id === step;
              const orderMap: Record<PromptStep, number> = {
                look: 0,
                listen: 1,
                speak: 2,
                review: 3,
              };
              const done = orderMap[s.id] < orderMap[step];
              return (
                <div
                  key={s.id}
                  className={`flex items-center justify-center gap-1 rounded-xl border px-2 py-1.5 text-center text-[11px] font-bold transition-colors whitespace-nowrap truncate ${
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

          {alreadyDone && (
            <p
              className={`mt-2.5 text-xs font-semibold ${
                isNight ? 'text-[#2ED6A3]' : 'text-[#0E7A74]'
              }`}
            >
              {copy.spotSpeakAlreadyDoneNote}
            </p>
          )}

          {/* STEP 1: LOOK */}
          {step === 'look' && (
            <div className="mt-4 space-y-3.5">
              <div
                className={`rounded-2xl border p-4 ${
                  isNight
                    ? 'border-[#F2C66D]/25 bg-[#1A2847]'
                    : 'border-[#E6CCB0] bg-[#FFF7EA]'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <JaipurObjectIllustrationSVG
                    objectId={challenge.id}
                    isNight={isNight}
                    className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border-2 border-[#F2C66D]/85 shadow-md shrink-0"
                  />
                  <div className="min-w-0 flex-1 text-center sm:text-left">
                    <p className="text-sm sm:text-base font-semibold leading-relaxed">
                      {challenge.speakingPrompt[language]}
                    </p>
                    <div
                      className={`mt-2.5 inline-block rounded-xl border px-3 py-1.5 font-display text-sm font-extrabold ${
                        isNight
                          ? 'border-[#F2C66D]/40 bg-[#131E31] text-[#F2C66D]'
                          : 'border-[#24B8B0]/35 bg-white text-[#0E7A74]'
                      }`}
                    >
                      {challenge.sentenceStarter}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('click');
                    setShowHints((h) => !h);
                  }}
                  className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                    isNight
                      ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                      : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A] hover:bg-[#DCE8F5]'
                  }`}
                >
                  {showHints ? (
                    <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span>
                    {showHints ? copy.spotSpeakHintsToggleHide : copy.spotSpeakHintsToggleShow}
                  </span>
                </button>

                {showHints && (
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {challenge.vocabularyHints.map((hint) => (
                      <span
                        key={hint.word}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold shadow-2xs ${
                          isNight
                            ? 'border-[#24B8B0]/40 bg-[#153440] text-[#D8FAF0]'
                            : 'border-[#24B8B0]/35 bg-[#E6FAF5] text-[#0E5B56]'
                        }`}
                      >
                        <strong className="font-display">{hint.word}</strong>{' '}
                        <span className="opacity-75">· {hint.th}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('select');
                    setStep('listen');
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#f7d487] cursor-pointer"
                >
                  <span>{copy.spotSpeakStepListen}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: LISTEN (Model Before Practice) */}
          {step === 'listen' && (
            <div className="mt-4 space-y-3.5">
              <div
                className={`rounded-2xl border p-4 ${
                  isNight
                    ? 'border-[#F2C66D]/25 bg-[#1A2847]'
                    : 'border-[#E6CCB0] bg-[#FFF7EA]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                      isNight ? 'text-[#2ED6A3]' : 'text-[#0E7A74]'
                    }`}
                  >
                    <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.spotSpeakModelLabel}</span>
                  </span>
                  <span
                    className={`text-[11px] ${
                      isNight ? 'text-[#9CB2D1]' : 'text-[#5A708F]'
                    }`}
                  >
                    {copy.spotSpeakAudioNotice}
                  </span>
                </div>

                <p
                  className={`mt-2.5 font-display text-lg sm:text-xl font-extrabold ${
                    isNight ? 'text-[#F7F9FC]' : 'text-[#1E2E46]'
                  }`}
                >
                  “{challenge.modelSentence}”
                </p>
                {language === 'th' && (
                  <p
                    className={`mt-1 text-xs ${
                      isNight ? 'text-[#B6C7DE]' : 'text-[#4F6482]'
                    }`}
                  >
                    {challenge.modelSentenceTh}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => onSpeakText(challenge.modelSentence)}
                  className={`mt-3.5 inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer shadow-xs ${
                    isNight
                      ? 'border-[#24B8B0]/50 bg-[#143640] text-[#E6FAF5] hover:bg-[#1B4855]'
                      : 'border-[#24B8B0]/40 bg-[#E6F5FB] text-[#0E7A74] hover:bg-[#D4ECF8]'
                  }`}
                >
                  <Volume2 className="h-4 w-4 text-[#24B8B0]" aria-hidden="true" />
                  <span>{copy.jaipurListenButton}</span>
                </button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onStopSpeech();
                    onPlaySfx('click');
                    setStep('look');
                  }}
                  className={`inline-flex min-h-[40px] items-center rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${
                    isNight
                      ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                      : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A] hover:bg-[#DCE8F5]'
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
                  <span>{copy.spotSpeakStepSpeak}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SPEAK (Microphone MediaRecorder OR Meaningful No-Mic Practice) */}
          {step === 'speak' && (
            <div className="mt-4 space-y-3.5">
              <div
                className={`rounded-2xl border p-3.5 ${
                  isNight
                    ? 'border-[#F2C66D]/25 bg-[#1A2847]'
                    : 'border-[#E6CCB0] bg-[#FFF7EA]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-display text-base sm:text-lg font-extrabold">
                    “{challenge.modelSentence}”
                  </p>
                  <button
                    type="button"
                    onClick={() => onSpeakText(challenge.modelSentence)}
                    className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                      isNight
                        ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                        : 'border-[#24B8B0]/30 bg-[#E6F5FB] text-[#0E7A74] hover:bg-[#D4ECF8]'
                    }`}
                  >
                    <Volume2 className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
                    <span>{copy.jaipurListenButton}</span>
                  </button>
                </div>
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
                /* Transient MediaRecorder Voice Studio Card */
                <div
                  className={`rounded-2xl border-2 p-4 space-y-3 ${
                    isNight
                      ? 'border-[#24B8B0]/30 bg-[#192645]'
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

                        {/* Voice Studio Equalizer Bars */}
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
                          className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold cursor-pointer ${
                            isNight
                              ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                              : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A] hover:bg-[#DCE8F5]'
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
                /* Accessible No-Microphone Practice Path (Requires Aloud + Phrase Comprehension Check) */
                <div
                  className={`rounded-2xl border-2 p-4 space-y-3 ${
                    isNight
                      ? 'border-white/15 bg-[#192645]'
                      : 'border-[#C9DCF0] bg-[#F7FBFF]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold">{copy.spotSpeakNoMicPrompt}</p>
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

                  <div className="flex flex-wrap gap-2">
                    {phraseOptions.map((phrase) => {
                      const selected = selectedNoMicPhrase === phrase;
                      const correct = selected && phrase === challenge.noMicFocusPhrase;
                      return (
                        <button
                          key={phrase}
                          type="button"
                          onClick={() => {
                            onPlaySfx('click');
                            setSelectedNoMicPhrase(phrase);
                          }}
                          className={`min-h-[42px] rounded-xl border-2 px-3.5 py-1.5 font-display text-xs sm:text-sm font-bold cursor-pointer ${
                            correct
                              ? 'border-[#2ED6A3] bg-[#2ED6A3]/20 text-[#0E7A74] dark:text-[#2ED6A3]'
                              : selected
                                ? 'border-[#E86D4E] bg-[#FFF2EE] text-[#8E321C] dark:bg-[#35202D] dark:text-[#FFD8CE]'
                                : isNight
                                  ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                                  : 'border-[#20304A]/15 bg-white text-[#20304A] hover:bg-[#E8F2FA]'
                          }`}
                        >
                          {phrase}
                        </button>
                      );
                    })}
                  </div>

                  <label className="flex min-h-[44px] items-center gap-2.5 text-xs sm:text-sm font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={readAloudConfirmed}
                      onChange={(e) => setReadAloudConfirmed(e.target.checked)}
                      className="h-4 w-4 accent-[#24B8B0]"
                    />
                    <span>{copy.spotSpeakNoMicAloudCheck}</span>
                  </label>
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    stopPlayback();
                    onPlaySfx('click');
                    setStep('listen');
                  }}
                  className={`inline-flex min-h-[40px] items-center rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${
                    isNight
                      ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                      : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A] hover:bg-[#DCE8F5]'
                  }`}
                >
                  {copy.backButton}
                </button>

                <button
                  type="button"
                  disabled={noMicMode ? !noMicReady : recordingState !== 'recorded'}
                  onClick={() => {
                    stopPlayback();
                    onPlaySfx('select');
                    setStep('review');
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#49e2b3] cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <span>
                    {noMicMode ? copy.spotSpeakNoMicReadyButton : copy.spotSpeakStepReview}
                  </span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & CONTINUE (Playback + Honest Self-Reflection + Sandwich Feedback) */}
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
                    {copy.spotSpeakSelfReviewHeading}
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
                        : isNight
                          ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC]'
                          : 'border-[#20304A]/15 bg-white text-[#20304A]'
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
                        : isNight
                          ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC]'
                          : 'border-[#20304A]/15 bg-white text-[#20304A]'
                    }`}
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.spotSpeakConfidenceRetry}</span>
                  </button>
                </div>
              </div>

              {/* Sandwich Feedback (1. Positive · 2. Actionable Tip · 3. Next Step) */}
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
                    {challenge.sandwichFeedback.positive[language]}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#D99B26]" aria-hidden="true" />
                  <p>
                    <strong className="font-display">{copy.spotSpeakFeedbackTipLabel}:</strong>{' '}
                    {challenge.sandwichFeedback.improvement[language]}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Compass className="mt-0.5 h-4 w-4 shrink-0 text-[#24B8B0]" aria-hidden="true" />
                  <p>
                    <strong className="font-display">{copy.spotSpeakFeedbackNextLabel}:</strong>{' '}
                    {challenge.sandwichFeedback.nextStep[language]}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleRetryRecording}
                  className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${
                    isNight
                      ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                      : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A] hover:bg-[#DCE8F5]'
                  }`}
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.spotSpeakRetryButton}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    releaseRecordingResources();
                    onStopSpeech();
                    onCompleteChallenge();
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#49e2b3] cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  <span>{copy.spotSpeakContinueButton}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
