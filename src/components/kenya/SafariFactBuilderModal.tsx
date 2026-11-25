import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Languages,
  Lightbulb,
  Mic,
  MicOff,
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
import {
  assembleSentenceFromSelections,
  validateKenyaBuildSelections,
  type BuildSlotSpec,
  type KenyaBuildLevel,
  type KenyaBuildStationSpec,
  type KenyaBuildValidationResult,
} from '../../data/kenyaBuild';
import { getKenyaDiscoveryTask } from '../../data/kenyaDiscovery';
import type { KenyaLandmarkId } from '../../data/kenyaWorld';
import {
  isMicrophoneRecordingSupported,
  startTransientMicRecording,
  type ActiveRecordingHandle,
  type RecorderErrorCode,
} from '../../utils/audioRecorder';
import { KenyaWildlifeIllustrationSVG } from './KenyaWildlifeIllustrationSVG';
import { KenyaSafariHeaderBannerSVG } from './KenyaMiniGameArtwork';
import { shuffleArray } from '../../utils/shuffle';

const STUDIO_BAR_HEIGHTS = [42, 76, 54, 92, 62, 82, 48];

interface SafariFactBuilderModalProps {
  station: KenyaBuildStationSpec;
  totalCount: number;
  language: AppLanguage;
  appearance: ResolvedAppearance;
  existingSentence?: string;
  onPlaySfx: (kind?: 'click' | 'select' | 'mode' | 'reward') => void;
  onSpeakText: (englishText: string) => void;
  onStopSpeech: () => void;
  onSaveStationSentence: (stationId: KenyaLandmarkId, sentence: string) => boolean;
  onClose: () => void;
}

type BuilderPhase = 'build' | 'speak' | 'saved';

function formatElapsed(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function SafariFactBuilderModal({
  station,
  totalCount,
  language,
  appearance,
  existingSentence,
  onPlaySfx,
  onSpeakText,
  onStopSpeech,
  onSaveStationSentence,
  onClose,
}: SafariFactBuilderModalProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';

  const [level, setLevel] = useState<KenyaBuildLevel>('a2');
  const [showThaiHelper, setShowThaiHelper] = useState<boolean>(language === 'th');
  const [showHint, setShowHint] = useState(false);
  const [phase, setPhase] = useState<BuilderPhase>('build');
  const [attemptShuffleNonce, setAttemptShuffleNonce] = useState(0);

  // Interactive slot selections per station
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const slot of station.slots) {
      if (slot.fixedText && slot.options[0]) {
        initial[slot.id] = slot.options[0].id;
      } else if (slot.optionalB1Extension && slot.options[0]) {
        const noneOpt = slot.options.find((o) => o.id === 'ext_none') ?? slot.options[0];
        initial[slot.id] = noneOpt.id;
      }
    }
    return initial;
  });

  const [validation, setValidation] = useState<KenyaBuildValidationResult | null>(null);
  const [completedAllNow, setCompletedAllNow] = useState(false);

  // Optional transient speaking recorder (never stored in localStorage)
  const micSupported = isMicrophoneRecordingSupported();
  const [noMicMode, setNoMicMode] = useState(!micSupported);
  const [recordingState, setRecordingState] = useState<
    'idle' | 'requesting' | 'recording' | 'recorded'
  >('idle');
  const [elapsedSec, setElapsedSec] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [micError, setMicError] = useState<RecorderErrorCode | null>(null);
  const [readAloudChecked, setReadAloudChecked] = useState(false);

  const recorderRef = useRef<ActiveRecordingHandle | null>(null);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  audioUrlRef.current = audioUrl;

  const discoveryInfo = useMemo(() => getKenyaDiscoveryTask(station.id), [station.id]);

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

  const visibleSlots = useMemo(() => {
    return station.slots.filter((slot) => !(slot.optionalB1Extension && level === 'a2'));
  }, [level, station.slots]);

  // Shuffle selectable options per slot once per attempt/station/clear-board so toggling A2/B1 or EN/TH never reshuffles existing cards.
  const shuffledFullSlotOptions = useMemo(() => {
    const map: Record<string, BuildSlotSpec['options']> = {};
    for (const slot of station.slots) {
      if (slot.fixedText) {
        map[slot.id] = slot.options;
      } else {
        const combined = slot.b1ExtraOptions
          ? [...slot.options, ...slot.b1ExtraOptions]
          : slot.options;
        map[slot.id] = shuffleArray(combined);
      }
    }
    return map;
  }, [station, attemptShuffleNonce]);

  const getSlotOptions = (slot: BuildSlotSpec) => {
    const fullShuffled = shuffledFullSlotOptions[slot.id] ?? slot.options;
    if (level === 'b1' || slot.fixedText || !slot.b1ExtraOptions) {
      return fullShuffled;
    }
    const a2Ids = new Set(slot.options.map((o) => o.id));
    return fullShuffled.filter((o) => a2Ids.has(o.id));
  };

  const handleSwitchLevel = (nextLevel: KenyaBuildLevel) => {
    if (nextLevel === level) return;
    onPlaySfx('click');
    setLevel(nextLevel);
    setValidation(null);
    // Prune B1-only distractor/extension selections when switching back to A2
    if (nextLevel === 'a2') {
      setSelections((prev) => {
        const cleaned: Record<string, string> = {};
        for (const slot of station.slots) {
          if (slot.optionalB1Extension) continue;
          const currentId = prev[slot.id];
          if (currentId && slot.options.some((o) => o.id === currentId)) {
            cleaned[slot.id] = currentId;
          } else if (slot.fixedText && slot.options[0]) {
            cleaned[slot.id] = slot.options[0].id;
          }
        }
        return cleaned;
      });
    }
  };

  const handleSelectToken = (slotId: string, optionId: string) => {
    onPlaySfx('select');
    setSelections((prev) => ({
      ...prev,
      [slotId]: optionId,
    }));
    setValidation(null);
  };

  const handleClearBoard = () => {
    onPlaySfx('click');
    const reset: Record<string, string> = {};
    for (const slot of station.slots) {
      if (slot.fixedText && slot.options[0]) {
        reset[slot.id] = slot.options[0].id;
      } else if (slot.optionalB1Extension && slot.options[0]) {
        const noneOpt = slot.options.find((o) => o.id === 'ext_none') ?? slot.options[0];
        reset[slot.id] = noneOpt.id;
      }
    }
    setSelections(reset);
    setValidation(null);
    setAttemptShuffleNonce((n) => n + 1);
    setPhase('build');
  };

  const livePreviewSentence = useMemo(
    () => assembleSentenceFromSelections(station, selections, level),
    [level, selections, station],
  );

  const handleCheckSentence = () => {
    const result = validateKenyaBuildSelections(station, selections, level);
    setValidation(result);
    onPlaySfx(result.valid ? 'select' : 'click');
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
      onRecordingStarted: () => setRecordingState('recording'),
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

  const readyToSave = noMicMode ? readAloudChecked : recordingState === 'recorded';

  const handleSaveSentence = () => {
    const sentenceToSave = validation?.valid
      ? validation.assembledSentence
      : livePreviewSentence;
    if (!sentenceToSave) return;
    const allCompletedNow = onSaveStationSentence(station.id, sentenceToSave);
    setCompletedAllNow(allCompletedNow);
    onPlaySfx(allCompletedNow ? 'reward' : 'select');
    releaseRecordingResources();
    setPhase('saved');
  };

  const modelSentence = level === 'b1' ? station.modelSentenceB1 : station.modelSentenceA2;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="safari-builder-board-title"
      className={`fixed inset-0 z-30 flex items-end sm:items-center justify-center p-2.5 sm:p-5 overflow-y-auto ${
        isNight ? 'bg-[#090F1E]/64' : 'bg-[#20304A]/24'
      }`}
    >
      {/* Physical Wooden Wildlife Information Board Container */}
      <div
        className={`flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border-4 shadow-2xl transition-colors ${
          isNight
            ? 'border-[#8C6239] bg-[#131E36] text-[#F7F9FC]'
            : 'border-[#7D512D] bg-[#FAF2DF] text-[#241B11]'
        }`}
      >
        {/* Carved Timber Board Header with Brass Corner Rivets & Savanna Strip */}
        <div
          className={`relative border-b-2 px-4 pt-3 pb-3.5 sm:px-5 ${
            isNight
              ? 'border-[#8C6239]/60 bg-[#231B16] text-[#F7EFE0]'
              : 'border-[#633E20] bg-[#754B29] text-[#FFF8EA]'
          }`}
        >
          {/* Brass Rivet Accents */}
          <span className="absolute top-2.5 left-2.5 h-2 w-2 rounded-full bg-[#F2C66D]/80" aria-hidden="true" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#F2C66D]/80" aria-hidden="true" />

          <KenyaSafariHeaderBannerSVG
            spotId={station.id}
            isNight={isNight}
            className="mb-2.5 h-10 w-full rounded-xl border border-black/20 object-cover"
          />

          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="rounded-xl border-2 border-[#F2C66D]/75 bg-[#FFFDF8]/10 p-0.5 shadow-sm shrink-0">
                <KenyaWildlifeIllustrationSVG
                  spotId={station.id}
                  className="h-12 w-12 rounded-lg"
                />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-[#F2C66D]">
                  <span className="font-mono-num">
                    {station.order}/{totalCount}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{copy.kenyaBoardStationBadge}</span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{station.mechanicLabel[language]}</span>
                </div>
                <h2
                  id="safari-builder-board-title"
                  className="font-display text-base sm:text-lg font-extrabold leading-tight truncate text-white"
                >
                  {station.locationName[language]} — {station.topic[language]}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onPlaySfx('click');
                  setShowThaiHelper((s) => !s);
                }}
                className="inline-flex min-h-[38px] items-center gap-1 rounded-xl border border-white/25 bg-black/25 px-2.5 py-1 text-xs font-bold text-[#FFF8EA] hover:bg-black/40 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Languages className="h-3.5 w-3.5 text-[#F2C66D]" aria-hidden="true" />
                <span>{showThaiHelper ? copy.kenyaHideThaiLabel : copy.kenyaShowThaiLabel}</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                aria-label={copy.closeSettings}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-black/25 text-white hover:bg-black/45 cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Sub-bar: Numbered Step Progress + A2 / B1 Support Level Segmented Selector */}
        <div
          className={`flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5 sm:px-5 ${
            isNight
              ? 'border-white/10 bg-[#182647]'
              : 'border-[#DFC69B] bg-[#F1E2C2]'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold">
            <span
              className={`inline-flex items-center gap-1.5 ${
                phase === 'build'
                  ? isNight
                    ? 'text-[#F2C66D]'
                    : 'text-[#7A4A12]'
                  : isNight
                    ? 'text-[#2ED6A3]'
                    : 'text-[#0E7A74]'
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-md font-mono-num text-[11px] font-extrabold ${
                  phase === 'build'
                    ? 'bg-[#F2C66D] text-[#131E31]'
                    : 'bg-[#2ED6A3] text-[#131E31]'
                }`}
                aria-hidden="true"
              >
                1
              </span>
              <span>{copy.kenyaBuildStepStudyBuild}</span>
            </span>
            <span aria-hidden="true" className="opacity-45">
              →
            </span>
            <span
              className={`inline-flex items-center gap-1.5 ${
                phase === 'speak'
                  ? isNight
                    ? 'text-[#F2C66D]'
                    : 'text-[#7A4A12]'
                  : phase === 'saved'
                    ? isNight
                      ? 'text-[#2ED6A3]'
                      : 'text-[#0E7A74]'
                    : 'opacity-55'
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-md font-mono-num text-[11px] font-extrabold ${
                  phase === 'speak'
                    ? 'bg-[#F2C66D] text-[#131E31]'
                    : phase === 'saved'
                      ? 'bg-[#2ED6A3] text-[#131E31]'
                      : isNight
                        ? 'bg-white/10 text-[#B6C7DE]'
                        : 'bg-[#D7C096] text-[#4B3619]'
                }`}
                aria-hidden="true"
              >
                2
              </span>
              <span>{copy.kenyaBuildStepSpeak}</span>
            </span>
            <span aria-hidden="true" className="opacity-45">
              →
            </span>
            <span
              className={`inline-flex items-center gap-1.5 ${
                phase === 'saved'
                  ? isNight
                    ? 'text-[#2ED6A3]'
                    : 'text-[#0E7A74]'
                  : 'opacity-55'
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-md font-mono-num text-[11px] font-extrabold ${
                  phase === 'saved'
                    ? 'bg-[#2ED6A3] text-[#131E31]'
                    : isNight
                      ? 'bg-white/10 text-[#B6C7DE]'
                      : 'bg-[#D7C096] text-[#4B3619]'
                }`}
                aria-hidden="true"
              >
                3
              </span>
              <span>{copy.kenyaBuildStepSaved}</span>
            </span>
          </div>

          <div
            role="group"
            aria-label="CEFR Support Level"
            className={`inline-flex items-center gap-1 rounded-xl p-1 ${
              isNight ? 'bg-[#0F172D]' : 'bg-[#DFC99E]'
            }`}
          >
            {(['a2', 'b1'] as const).map((lvl) => {
              const active = level === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleSwitchLevel(lvl)}
                  aria-pressed={active}
                  className={`rounded-lg px-2.5 py-1 text-xs font-extrabold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#2ED6A3] text-[#131E31] shadow-sm'
                      : isNight
                        ? 'text-[#B6C7DE] hover:text-white'
                        : 'text-[#4B3619] hover:text-[#1F1507]'
                  }`}
                >
                  {lvl === 'a2' ? copy.kenyaBuildLevelA2 : copy.kenyaBuildLevelB1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Board Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {existingSentence && phase !== 'saved' && (
            <div
              className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3.5 py-2 text-xs ${
                isNight
                  ? 'border-[#2ED6A3]/40 bg-[#102E2C] text-[#D8F7EE]'
                  : 'border-[#1B9E77]/35 bg-[#E6FAF4] text-[#11423A]'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2ED6A3]" aria-hidden="true" />
                <span>
                  {copy.kenyaBuildAlreadySavedNote} “{existingSentence}”
                </span>
              </div>
            </div>
          )}

          {phase === 'build' && (
            <>
              {/* STEP 2: STUDY — Model, Vocabulary & Objective */}
              <div
                className={`rounded-2xl border p-3.5 ${
                  isNight
                    ? 'border-white/15 bg-[#19284A]'
                    : 'border-[#DFC69B] bg-[#FFFDF7]'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2.5">
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-bold ${
                        isNight ? 'text-[#F2C66D]' : 'text-[#8A5416]'
                      }`}
                    >
                      {station.objective[language]} ·{' '}
                      <span className="font-mono-num">{station.patternLabel}</span>
                    </p>
                    <p className="mt-1.5 text-sm sm:text-base font-bold leading-snug">
                      <span
                        className={`mr-1.5 text-xs font-semibold ${
                          isNight ? 'text-[#B6C7DE]' : 'text-[#6A5337]'
                        }`}
                      >
                        {copy.kenyaBuildModelLabel}:
                      </span>
                      “{modelSentence.en}”
                    </p>
                    {showThaiHelper && (
                      <p
                        className={`mt-1 text-xs leading-relaxed ${
                          isNight ? 'text-[#B6C7DE]' : 'text-[#6A5337]'
                        }`}
                      >
                        {modelSentence.th}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSpeakText(modelSentence.en)}
                    className={`inline-flex shrink-0 min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                      isNight
                        ? 'border-white/20 bg-[#131E31] text-[#F7F9FC] hover:bg-[#273B5E]'
                        : 'border-[#24B8B0]/35 bg-[#E6F5FB] text-[#0E7A74] hover:bg-[#D4ECF8]'
                    }`}
                  >
                    <Volume2 className="h-4 w-4 text-[#24B8B0]" aria-hidden="true" />
                    <span>{copy.jaipurListenButton}</span>
                  </button>
                </div>

                {/* Discovery Vocabulary Strip (unboxed clean metadata strip) */}
                <div
                  className={`mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t pt-2 text-xs ${
                    isNight
                      ? 'border-white/10 text-[#C3CFE0]'
                      : 'border-[#E6D5B8] text-[#5B472E]'
                  }`}
                >
                  <span className="font-bold">{copy.kenyaVocabHeading}:</span>
                  {(discoveryInfo?.vocabulary ?? []).map((v) => (
                    <span key={v.word} className="font-semibold">
                      <strong className={isNight ? 'text-[#F2C66D]' : 'text-[#7A4A12]'}>
                        {v.word}
                      </strong>
                      {showThaiHelper ? ` (${v.th})` : ''}
                    </span>
                  ))}
                </div>
              </div>

              {/* STEP 3: BUILD — Interactive Numbered Wooden Plaque Construction Slots */}
              <div className="space-y-3">
                {visibleSlots.map((slot, slotIdx) => {
                  const slotOpts = getSlotOptions(slot);
                  const chosenId = slot.fixedText ? slot.options[0]?.id : selections[slot.id];

                  return (
                    <div
                      key={slot.id}
                      className={`rounded-2xl border p-3.5 shadow-xs ${
                        isNight
                          ? 'border-white/15 bg-[#182544]'
                          : 'border-[#DFC69B] bg-[#FFFDF7]'
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md font-mono-num text-[11px] font-extrabold ${
                            isNight
                              ? 'bg-[#F2C66D]/20 text-[#F2C66D]'
                              : 'bg-[#E9D7B2] text-[#5C3D12]'
                          }`}
                          aria-hidden="true"
                        >
                          {slotIdx + 1}
                        </span>
                        <p
                          className={`text-xs font-extrabold ${
                            isNight ? 'text-[#B6C7DE]' : 'text-[#6A5337]'
                          }`}
                        >
                          {slot.label[language]}
                        </p>
                      </div>

                      {slot.fixedText ? (
                        <div
                          className={`inline-flex items-center gap-1.5 rounded-xl border-2 px-3.5 py-2 text-sm font-extrabold ${
                            isNight
                              ? 'border-[#F2C66D]/60 bg-[#27385D] text-[#F2C66D]'
                              : 'border-[#8C5E3A] bg-[#F2E3C2] text-[#3F2A10]'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{slot.fixedText}</span>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {slotOpts.map((opt) => {
                            const selected = chosenId === opt.id;
                            const labelText =
                              opt.text || (language === 'th' ? 'ไม่มีส่วนขยาย' : 'No extra ending');
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => handleSelectToken(slot.id, opt.id)}
                                aria-pressed={selected}
                                className={`min-h-[42px] rounded-xl border-2 px-3.5 py-2 text-left text-xs sm:text-sm font-bold transition-transform active:scale-[0.98] cursor-pointer ${
                                  selected
                                    ? isNight
                                      ? 'border-[#2ED6A3] bg-[#16423E] text-white shadow'
                                      : 'border-[#0E7A74] bg-[#E3F8F1] text-[#0D3D38] shadow'
                                    : isNight
                                      ? 'border-white/15 bg-[#131E31] text-[#E2ECF9] hover:border-[#F2C66D]/60'
                                      : 'border-[#DFC69B] bg-[#FAF2DF] text-[#261E14] hover:border-[#8C5E3A]'
                                }`}
                              >
                                <span className="block">{labelText}</span>
                                {showThaiHelper && opt.thHint && (
                                  <span
                                    className={`mt-0.5 block text-[11px] font-normal ${
                                      isNight ? 'text-[#B6C7DE]' : 'text-[#6A5337]'
                                    }`}
                                  >
                                    {opt.thHint}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Live Safari Signboard Parchment Chalkboard Preview */}
              <div
                className={`relative rounded-2xl border-2 p-4 shadow-sm ${
                  isNight
                    ? 'border-[#F2C66D]/55 bg-[#0F182F]'
                    : 'border-[#8C5E3A]/65 bg-[#F6E8CA]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`text-[11px] font-extrabold uppercase tracking-wider ${
                      isNight ? 'text-[#F2C66D]' : 'text-[#6A4519]'
                    }`}
                  >
                    {copy.kenyaBuildPreviewLabel}
                  </p>
                  <BookOpen
                    className={`h-4 w-4 ${isNight ? 'text-[#F2C66D]' : 'text-[#7A4A12]'}`}
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-1.5 font-display text-base sm:text-lg font-extrabold leading-snug">
                  {livePreviewSentence || '—'}
                </p>
              </div>

              {/* Optional Hint Box (never deducts XP) */}
              {showHint && (
                <div
                  className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs ${
                    isNight
                      ? 'border-[#F2C66D]/45 bg-[#232A42] text-[#FFF3D1]'
                      : 'border-[#D99B26]/45 bg-[#FFF8E4] text-[#5C3D0E]'
                  }`}
                >
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#F2C66D]" aria-hidden="true" />
                  <div>
                    <p className="font-semibold leading-relaxed">{station.hint[language]}</p>
                    <p className="mt-0.5 text-[11px] opacity-80">{copy.kenyaBuildHintXpSafe}</p>
                  </div>
                </div>
              )}

              {/* STEP 4: CHECK FEEDBACK */}
              {validation && (
                <div
                  role="status"
                  className={`rounded-2xl border-2 p-4 ${
                    validation.valid
                      ? isNight
                        ? 'border-[#2ED6A3]/60 bg-[#113632] text-[#D8F7EE]'
                        : 'border-[#1B9E77]/50 bg-[#E6FAF4] text-[#0E3F35]'
                      : isNight
                        ? 'border-[#E86D4E]/60 bg-[#361E24] text-[#FFD7CE]'
                        : 'border-[#D95338]/50 bg-[#FFF1EE] text-[#8F2816]'
                  }`}
                >
                  <div className="grid grid-cols-3 gap-2 text-xs font-extrabold">
                    <span
                      className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-2 py-1.5 ${
                        isNight ? 'border-white/10 bg-black/20' : 'border-black/10 bg-white/75'
                      }`}
                    >
                      {validation.checks.complete ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2ED6A3]" aria-hidden="true" />
                      ) : (
                        <AlertCircle className="h-4 w-4 shrink-0 text-[#E86D4E]" aria-hidden="true" />
                      )}
                      <span className="truncate">{copy.kenyaBuildCheckComplete}</span>
                    </span>
                    <span
                      className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-2 py-1.5 ${
                        isNight ? 'border-white/10 bg-black/20' : 'border-black/10 bg-white/75'
                      }`}
                    >
                      {validation.checks.grammar ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2ED6A3]" aria-hidden="true" />
                      ) : (
                        <AlertCircle className="h-4 w-4 shrink-0 text-[#E86D4E]" aria-hidden="true" />
                      )}
                      <span className="truncate">{copy.kenyaBuildCheckGrammar}</span>
                    </span>
                    <span
                      className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-2 py-1.5 ${
                        isNight ? 'border-white/10 bg-black/20' : 'border-black/10 bg-white/75'
                      }`}
                    >
                      {validation.checks.factual ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2ED6A3]" aria-hidden="true" />
                      ) : (
                        <AlertCircle className="h-4 w-4 shrink-0 text-[#E86D4E]" aria-hidden="true" />
                      )}
                      <span className="truncate">{copy.kenyaBuildCheckFactual}</span>
                    </span>
                  </div>
                  <p className="mt-2.5 text-xs sm:text-sm font-semibold leading-relaxed">
                    {validation.feedback[language]}
                  </p>
                </div>
              )}

              {/* Board Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('click');
                      setShowHint((s) => !s);
                    }}
                    className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold cursor-pointer ${
                      isNight
                        ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                        : 'border-[#8C5E3A]/30 bg-white text-[#4B3619] hover:bg-[#F5E9CE]'
                    }`}
                  >
                    <Lightbulb className="h-4 w-4 text-[#D99B26]" aria-hidden="true" />
                    <span>{showHint ? copy.kenyaBuildHideHint : copy.kenyaBuildShowHint}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearBoard}
                    className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold cursor-pointer ${
                      isNight
                        ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                        : 'border-[#8C5E3A]/30 bg-white text-[#4B3619] hover:bg-[#F5E9CE]'
                    }`}
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.kenyaBuildClearSlots}</span>
                  </button>
                </div>

                {validation?.valid ? (
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('select');
                      setPhase('speak');
                    }}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#49e2b3] cursor-pointer"
                  >
                    <span>{copy.kenyaBuildGoSpeakButton}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCheckSentence}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#f7d487] cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    <span>{copy.kenyaBuildCheckButton}</span>
                  </button>
                )}
              </div>
            </>
          )}

          {/* STEP 5: SPEAK YOUR COMPLETED SAFARI FACT */}
          {phase === 'speak' && (
            <div className="space-y-4">
              <div
                className={`rounded-2xl border-2 p-4 ${
                  isNight
                    ? 'border-[#F2C66D]/55 bg-[#19284A]'
                    : 'border-[#8C5E3A] bg-[#FFFDF7]'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p
                      className={`text-xs font-extrabold uppercase tracking-wider ${
                        isNight ? 'text-[#2ED6A3]' : 'text-[#0E7A74]'
                      }`}
                    >
                      {copy.kenyaBuildSpeakHeading}
                    </p>
                    <p className="mt-1.5 font-display text-lg sm:text-xl font-extrabold leading-snug">
                      “{validation?.assembledSentence || livePreviewSentence}”
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onSpeakText(validation?.assembledSentence || livePreviewSentence)
                    }
                    className={`inline-flex shrink-0 min-h-[40px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold cursor-pointer ${
                      isNight
                        ? 'border-white/20 bg-[#131E31] text-[#F7F9FC] hover:bg-[#273B5E]'
                        : 'border-[#24B8B0]/35 bg-[#E6F5FB] text-[#0E7A74] hover:bg-[#D4ECF8]'
                    }`}
                  >
                    <Volume2 className="h-4 w-4 text-[#24B8B0]" aria-hidden="true" />
                    <span>{copy.jaipurListenButton}</span>
                  </button>
                </div>
                <p
                  className={`mt-2 text-xs leading-relaxed ${
                    isNight ? 'text-[#B6C7DE]' : 'text-[#6A5337]'
                  }`}
                >
                  {copy.kenyaBuildSpeakNote}
                </p>
              </div>

              {micError && (
                <div
                  role="status"
                  className={`rounded-xl border px-3.5 py-2 text-xs font-semibold ${
                    isNight
                      ? 'border-[#F2C66D]/40 bg-[#28243A] text-[#FFE8B8]'
                      : 'border-[#D99B26]/40 bg-[#FFF8E4] text-[#5C3D0E]'
                  }`}
                >
                  {micError === 'permission_denied'
                    ? copy.spotSpeakMicDeniedNotice
                    : copy.spotSpeakMicUnavailableNotice}
                </div>
              )}

              {/* Transient Microphone Recorder OR Honest No-Microphone Self-Practice */}
              <div
                className={`rounded-2xl border p-4 ${
                  isNight
                    ? 'border-white/15 bg-[#182544]'
                    : 'border-[#DFC69B] bg-[#FFFDF7]'
                }`}
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold">
                    {noMicMode ? copy.spotSpeakNoMicToggle : copy.spotSpeakMicToggle}
                  </span>
                  {micSupported && (
                    <button
                      type="button"
                      onClick={() => {
                        onPlaySfx('click');
                        releaseRecordingResources();
                        setRecordingState('idle');
                        setNoMicMode((m) => !m);
                      }}
                      className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold cursor-pointer ${
                        isNight
                          ? 'border-white/20 bg-[#131E31] text-[#E2ECF9] hover:bg-[#22345B]'
                          : 'border-[#DFC69B] bg-[#FAF2DF] text-[#4B3619] hover:bg-[#F2E3C2]'
                      }`}
                    >
                      {noMicMode ? (
                        <Mic className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
                      ) : (
                        <MicOff className="h-3.5 w-3.5 text-[#D99B26]" aria-hidden="true" />
                      )}
                      <span>{noMicMode ? copy.spotSpeakMicToggle : copy.spotSpeakNoMicToggle}</span>
                    </button>
                  )}
                </div>

                {!noMicMode ? (
                  <div className="flex flex-wrap items-center gap-2.5">
                    {recordingState === 'idle' || recordingState === 'requesting' ? (
                      <button
                        type="button"
                        disabled={recordingState === 'requesting'}
                        onClick={handleStartRecording}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#24B8B0] px-4 py-2 font-display text-sm font-extrabold text-[#131E31] shadow hover:bg-[#3ad1c9] cursor-pointer disabled:opacity-60"
                      >
                        <Mic className="h-4 w-4" aria-hidden="true" />
                        <span>{copy.spotSpeakStartMicButton}</span>
                      </button>
                    ) : recordingState === 'recording' ? (
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex h-7 items-end gap-1 rounded-lg bg-[#E86D4E]/12 px-2.5 py-1" aria-hidden="true">
                          {STUDIO_BAR_HEIGHTS.map((h, i) => (
                            <span
                              key={i}
                              style={{ height: `${h}%` }}
                              className="w-1 rounded-full bg-[#E86D4E]"
                            />
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={handleStopRecording}
                          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#E86D4E] px-4 py-2 font-display text-sm font-extrabold text-white shadow hover:bg-[#f07d60] cursor-pointer"
                        >
                          <Square className="h-4 w-4" aria-hidden="true" />
                          <span>
                            {copy.spotSpeakStopMicButton} · {formatElapsed(elapsedSec)}
                          </span>
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={handleTogglePlayback}
                          className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-4 py-2 font-display text-sm font-extrabold text-[#131E31] shadow hover:bg-[#49e2b3] cursor-pointer"
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
                          onClick={() => {
                            onPlaySfx('click');
                            releaseRecordingResources();
                            setRecordingState('idle');
                          }}
                          className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold cursor-pointer ${
                            isNight
                              ? 'border-white/20 bg-[#131E31] text-white'
                              : 'border-[#DFC69B] bg-[#FAF2DF] text-[#261E14]'
                          }`}
                        >
                          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{copy.spotSpeakRetryButton}</span>
                        </button>
                      </>
                    )}
                    <p
                      className={`w-full text-[11px] ${
                        isNight ? 'text-[#B6C7DE]' : 'text-[#6A5337]'
                      }`}
                    >
                      {copy.spotSpeakSelfReviewDisclaimer}
                    </p>
                  </div>
                ) : (
                  <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#8C5E3A]/45 px-3.5 py-2.5 text-xs sm:text-sm font-bold">
                    <input
                      type="checkbox"
                      checked={readAloudChecked}
                      onChange={(e) => {
                        onPlaySfx('click');
                        setReadAloudChecked(e.target.checked);
                      }}
                      className="h-5 w-5 accent-[#2ED6A3]"
                    />
                    <span>{copy.spotSpeakNoMicAloudCheck}</span>
                  </label>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('click');
                    setPhase('build');
                  }}
                  className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold cursor-pointer ${
                    isNight
                      ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC]'
                      : 'border-[#8C5E3A]/30 bg-white text-[#4B3619]'
                  }`}
                >
                  <span>{copy.backButton}</span>
                </button>

                <button
                  type="button"
                  disabled={!readyToSave}
                  onClick={handleSaveSentence}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#f7d487] disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
                >
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  <span>{copy.kenyaBuildSaveButton}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: SAVED TO FIELD GUIDE */}
          {phase === 'saved' && (
            <div
              className={`rounded-2xl border p-5 text-center space-y-3 ${
                isNight
                  ? 'border-[#2ED6A3]/55 bg-[#102E2C] text-[#E6FCF5]'
                  : 'border-[#1B9E77]/45 bg-[#E8FBF5] text-[#113D31]'
              }`}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2ED6A3] text-[#131E31] shadow">
                {completedAllNow ? (
                  <Sparkles className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                )}
              </div>
              <h3 className="font-display text-lg font-extrabold">
                {completedAllNow
                  ? copy.kenyaBuildCompleteInlineNote
                  : copy.kenyaFieldGuideSentenceBuiltBadge}
              </h3>
              <p className="font-display text-base font-bold">
                “{validation?.assembledSentence || livePreviewSentence}”
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    onSpeakText(validation?.assembledSentence || livePreviewSentence)
                  }
                  className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${
                    isNight
                      ? 'border-white/25 bg-[#131E31] text-white'
                      : 'border-[#24B8B0]/40 bg-white text-[#0E7A74]'
                  }`}
                >
                  <Volume2 className="h-4 w-4 text-[#24B8B0]" aria-hidden="true" />
                  <span>{copy.jaipurListenButton}</span>
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow hover:bg-[#f7d487] cursor-pointer"
                >
                  <span>{copy.jaipurNextButton}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
