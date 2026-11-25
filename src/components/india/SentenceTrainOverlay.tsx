import { useCallback, useEffect, useState, type DragEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Lightbulb,
  MapPin,
  RotateCcw,
  TrainFront,
  Undo2,
  Volume2,
  X,
} from 'lucide-react';
import type { AppLanguage, ResolvedAppearance } from '../../types/game';
import { GAME_COPY } from '../../data/i18n';
import {
  checkSentenceOrder,
  createShuffledTiles,
  getSentenceTrainClue,
  JAIPUR_SENTENCE_CHALLENGES,
  type SentenceWordTile,
} from '../../data/jaipurSentenceTrain';
import {
  JaipurObjectIllustrationSVG,
  JaipurTrainBannerSVG,
} from './JaipurMiniGameArtwork';

interface SentenceTrainOverlayProps {
  language: AppLanguage;
  appearance: ResolvedAppearance;
  reducedMotion: boolean;
  alreadyCompleted: boolean;
  onPlaySfx: (kind?: 'click' | 'select' | 'mode' | 'reward') => void;
  onSpeakText: (text: string) => void;
  onStopSpeech: () => void;
  onClose: () => void;
  onFinishAllChallenges: () => void;
}

const DAY_TILE_CLASSES = [
  'border-[#E5B85C] bg-[#FFF4D6] text-[#2A2110] hover:bg-[#FFEBB8]',
  'border-[#65C4DC] bg-[#E3F6FC] text-[#112A38] hover:bg-[#CEF0FA]',
  'border-[#5BCBAE] bg-[#E0F9F1] text-[#0E332A] hover:bg-[#C9F4E6]',
  'border-[#EE937B] bg-[#FFEBE5] text-[#3A1B14] hover:bg-[#FFDAD0]',
  'border-[#8DA4EC] bg-[#EAEEFE] text-[#1B2547] hover:bg-[#DCE3FD]',
];

const NIGHT_TILE_CLASSES = [
  'border-[#F2C66D]/60 bg-[#3B2F1D] text-[#FFF4D6] hover:bg-[#4A3B24]',
  'border-[#5AC8EA]/55 bg-[#193449] text-[#E6F6FC] hover:bg-[#21445E]',
  'border-[#2ED6A3]/55 bg-[#153B36] text-[#DCF9F0] hover:bg-[#1C4D46]',
  'border-[#FF9478]/55 bg-[#452328] text-[#FFE8E2] hover:bg-[#572D33]',
  'border-[#9BB2FA]/55 bg-[#242C52] text-[#EBEEFE] hover:bg-[#2F3969]',
];

export function SentenceTrainOverlay({
  language,
  appearance,
  reducedMotion,
  alreadyCompleted,
  onPlaySfx,
  onSpeakText,
  onStopSpeech,
  onClose,
  onFinishAllChallenges,
}: SentenceTrainOverlayProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';

  const [challengeIdx, setChallengeIdx] = useState(0);
  const challenge = JAIPUR_SENTENCE_CHALLENGES[challengeIdx];

  const [bankTiles, setBankTiles] = useState<SentenceWordTile[]>(() =>
    createShuffledTiles(JAIPUR_SENTENCE_CHALLENGES[0]),
  );
  const [placedTiles, setPlacedTiles] = useState<SentenceWordTile[]>([]);
  const [feedback, setFeedback] = useState<
    | { type: 'idle' }
    | { type: 'correct' }
    | { type: 'incorrect'; message: string }
  >({ type: 'idle' });
  const [dragInfo, setDragInfo] = useState<{
    source: 'bank' | 'track';
    uid: string;
  } | null>(null);

  const loadChallenge = useCallback((idx: number) => {
    const next = JAIPUR_SENTENCE_CHALLENGES[idx];
    setChallengeIdx(idx);
    setBankTiles(createShuffledTiles(next));
    setPlacedTiles([]);
    setFeedback({ type: 'idle' });
    setDragInfo(null);
  }, []);

  const isSolved = feedback.type === 'correct';

  const handleSelectBankTile = useCallback(
    (tile: SentenceWordTile) => {
      if (isSolved) return;
      onPlaySfx('click');
      setBankTiles((prev) => prev.filter((t) => t.uid !== tile.uid));
      setPlacedTiles((prev) => [...prev, tile]);
      setFeedback({ type: 'idle' });
    },
    [isSolved, onPlaySfx],
  );

  const handleRemovePlacedTile = useCallback(
    (tile: SentenceWordTile) => {
      if (isSolved) return;
      onPlaySfx('click');
      setPlacedTiles((prev) => prev.filter((t) => t.uid !== tile.uid));
      setBankTiles((prev) => [...prev, tile]);
      setFeedback({ type: 'idle' });
    },
    [isSolved, onPlaySfx],
  );

  const handleMovePlacedTile = useCallback(
    (index: number, delta: -1 | 1) => {
      if (isSolved) return;
      const targetIndex = index + delta;
      if (targetIndex < 0 || targetIndex >= placedTiles.length) return;
      onPlaySfx('click');
      setPlacedTiles((prev) => {
        const next = [...prev];
        [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
        return next;
      });
      setFeedback({ type: 'idle' });
    },
    [isSolved, onPlaySfx, placedTiles.length],
  );

  const handleUndo = useCallback(() => {
    if (isSolved || placedTiles.length === 0) return;
    onPlaySfx('click');
    const last = placedTiles[placedTiles.length - 1];
    setPlacedTiles((prev) => prev.slice(0, -1));
    setBankTiles((prev) => [...prev, last]);
    setFeedback({ type: 'idle' });
  }, [isSolved, onPlaySfx, placedTiles]);

  const handleReset = useCallback(() => {
    if (isSolved || placedTiles.length === 0) return;
    onPlaySfx('click');
    setBankTiles((prev) => [...prev, ...placedTiles]);
    setPlacedTiles([]);
    setFeedback({ type: 'idle' });
  }, [isSolved, onPlaySfx, placedTiles]);

  const handleCheckAnswer = useCallback(() => {
    if (isSolved) return;
    const words = placedTiles.map((t) => t.word);
    if (checkSentenceOrder(words, challenge)) {
      onPlaySfx('reward');
      setFeedback({ type: 'correct' });
      onSpeakText(challenge.targetSentence);
    } else {
      onPlaySfx('click');
      const clue = getSentenceTrainClue(words, challenge);
      setFeedback({ type: 'incorrect', message: clue[language] });
    }
  }, [challenge, isSolved, language, onPlaySfx, onSpeakText, placedTiles]);

  const handleNextChallenge = useCallback(() => {
    onStopSpeech();
    if (challengeIdx < JAIPUR_SENTENCE_CHALLENGES.length - 1) {
      onPlaySfx('select');
      loadChallenge(challengeIdx + 1);
    } else {
      onFinishAllChallenges();
    }
  }, [challengeIdx, loadChallenge, onFinishAllChallenges, onPlaySfx, onStopSpeech]);

  // Keyboard shortcuts: Escape to close, Backspace to Undo, 1..6 to pick available bank tiles
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Escape') {
        e.preventDefault();
        onStopSpeech();
        onClose();
        return;
      }
      if (e.code === 'Backspace' && !isSolved) {
        e.preventDefault();
        handleUndo();
        return;
      }
      if (!isSolved && /^Digit[1-6]$/.test(e.code)) {
        const idx = Number(e.code.slice(-1)) - 1;
        if (bankTiles[idx]) {
          e.preventDefault();
          handleSelectBankTile(bankTiles[idx]);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [bankTiles, handleSelectBankTile, handleUndo, isSolved, onClose, onStopSpeech]);

  // Drag-and-drop handlers
  const onDragStartTile = (source: 'bank' | 'track', uid: string) => (e: DragEvent) => {
    if (isSolved) return;
    setDragInfo({ source, uid });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${source}:${uid}`);
  };

  const onDropOnTrackSlot = (targetIndex: number) => (e: DragEvent) => {
    e.preventDefault();
    if (isSolved || !dragInfo) return;
    if (dragInfo.source === 'bank') {
      const dragged = bankTiles.find((t) => t.uid === dragInfo.uid);
      if (!dragged) return;
      onPlaySfx('click');
      setBankTiles((prev) => prev.filter((t) => t.uid !== dragged.uid));
      setPlacedTiles((prev) => {
        const next = [...prev];
        next.splice(targetIndex, 0, dragged);
        return next;
      });
      setFeedback({ type: 'idle' });
    } else {
      const fromIdx = placedTiles.findIndex((t) => t.uid === dragInfo.uid);
      if (fromIdx < 0 || fromIdx === targetIndex) return;
      onPlaySfx('click');
      setPlacedTiles((prev) => {
        const next = [...prev];
        const [moved] = next.splice(fromIdx, 1);
        const insertIdx = fromIdx < targetIndex ? targetIndex - 1 : targetIndex;
        next.splice(insertIdx, 0, moved);
        return next;
      });
      setFeedback({ type: 'idle' });
    }
    setDragInfo(null);
  };

  const onDropOnTrackEnd = (e: DragEvent) => {
    e.preventDefault();
    if (isSolved || !dragInfo) return;
    if (dragInfo.source === 'bank') {
      const dragged = bankTiles.find((t) => t.uid === dragInfo.uid);
      if (dragged) handleSelectBankTile(dragged);
    } else {
      const fromIdx = placedTiles.findIndex((t) => t.uid === dragInfo.uid);
      if (fromIdx >= 0 && fromIdx < placedTiles.length - 1) {
        onPlaySfx('click');
        setPlacedTiles((prev) => {
          const next = [...prev];
          const [moved] = next.splice(fromIdx, 1);
          next.push(moved);
          return next;
        });
        setFeedback({ type: 'idle' });
      }
    }
    setDragInfo(null);
  };

  const onDropOnBank = (e: DragEvent) => {
    e.preventDefault();
    if (isSolved || !dragInfo || dragInfo.source !== 'track') return;
    const dragged = placedTiles.find((t) => t.uid === dragInfo.uid);
    if (dragged) handleRemovePlacedTile(dragged);
    setDragInfo(null);
  };

  const tileClasses = isNight ? NIGHT_TILE_CLASSES : DAY_TILE_CLASSES;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sentence-train-title"
      className={`fixed inset-0 z-30 flex items-center justify-center p-3 sm:p-6 ${
        isNight ? 'bg-[#090F1E]/65' : 'bg-[#20304A]/24'
      }`}
    >
      <div
        className={`w-full max-w-2xl max-h-[92dvh] overflow-y-auto rounded-3xl border-2 transition-colors ${
          isNight
            ? 'border-[#F2C66D]/55 bg-[#121C36]/97 text-[#F7F9FC] shadow-2xl'
            : 'border-[#E5B88E] bg-[#FFFDF8]/98 text-[#1E2E46] shadow-[0_24px_54px_rgba(32,48,74,0.24)]'
        }`}
      >
        {/* Jaipur Marigold & Terracotta Top Accent */}
        <div
          className="h-2 w-full"
          aria-hidden="true"
          style={{
            backgroundImage:
              'linear-gradient(90deg, #D95D48 0%, #F2C66D 50%, #24B8B0 100%)',
          }}
        />

        <div className="p-4 sm:p-6">
          {/* Header: Illustrated Stop Landmark + Title + Train Stop Progress + Listen + Close */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <JaipurObjectIllustrationSVG
                  objectId={challenge.vocabId}
                  isNight={isNight}
                  className="h-14 w-14 rounded-2xl border-2 border-[#F2C66D]/80 shadow-sm"
                />
                <span
                  style={{ backgroundColor: challenge.accentColor }}
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-lg border-2 border-white text-white shadow"
                >
                  <TrainFront className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </div>

              <div className="min-w-0">
                <h2
                  id="sentence-train-title"
                  className={`font-display text-lg sm:text-xl font-extrabold truncate ${
                    isNight ? 'text-[#F2C66D]' : 'text-[#C4503B]'
                  }`}
                >
                  {copy.sentenceTrainTitle}
                </h2>
                <p
                  className={`text-xs font-semibold ${
                    isNight ? 'text-[#B6C7DE]' : 'text-[#4F6482]'
                  }`}
                >
                  {copy.sentenceTrainCounterLabel}{' '}
                  <span className="font-mono-num font-bold">
                    {challengeIdx + 1}/{JAIPUR_SENTENCE_CHALLENGES.length}
                  </span>{' '}
                  <span aria-hidden="true">·</span> {challenge.targetLabel[language]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onSpeakText(challenge.targetSentence)}
                className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 shadow-xs ${
                  isNight
                    ? 'border-[#24B8B0]/45 bg-[#143640] text-[#E6FAF5] hover:bg-[#1B4855]'
                    : 'border-[#24B8B0]/35 bg-[#E6F5FB] text-[#0E7A74] hover:bg-[#D4ECF8]'
                }`}
              >
                <Volume2 className="h-4 w-4 text-[#24B8B0]" aria-hidden="true" />
                <span>{copy.jaipurListenButton}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onStopSpeech();
                  onPlaySfx('click');
                  onClose();
                }}
                aria-label={copy.closeSettings}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border cursor-pointer shrink-0 ${
                  isNight
                    ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                    : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A] hover:bg-[#DCE8F5]'
                }`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Scenic Palace-on-Wheels Locomotive Progress Banner */}
          <div className="mt-3.5 overflow-hidden rounded-2xl border border-[#D9B896]/45 shadow-xs">
            <JaipurTrainBannerSVG
              completedStops={challengeIdx}
              totalStops={JAIPUR_SENTENCE_CHALLENGES.length}
              solved={isSolved}
              isNight={isNight}
              className="h-14 sm:h-16 w-full"
            />
          </div>

          {/* 5-Stop Train Station Progress Nodes */}
          <div className="mt-3 flex items-center gap-2" aria-label="Sentence Train Progress">
            {JAIPUR_SENTENCE_CHALLENGES.map((item, idx) => {
              const done = idx < challengeIdx || (idx === challengeIdx && isSolved);
              const active = idx === challengeIdx && !isSolved;
              return (
                <div key={item.id} className="flex flex-1 items-center gap-1.5">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 font-mono-num text-xs font-extrabold transition-transform ${
                      done
                        ? 'border-[#2ED6A3] bg-[#2ED6A3] text-[#131E31]'
                        : active
                          ? `border-[#C4503B] bg-[#F2C66D] text-[#131E31] shadow ${reducedMotion ? '' : 'scale-110'}`
                          : isNight
                            ? 'border-white/15 bg-[#1D2C46] text-[#8EA4C4]'
                            : 'border-[#C9DCF0] bg-[#E8F1FA] text-[#5B708E]'
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : item.order}
                  </div>
                  {idx < JAIPUR_SENTENCE_CHALLENGES.length - 1 && (
                    <div
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        idx < challengeIdx
                          ? 'bg-[#2ED6A3]'
                          : isNight
                            ? 'bg-[#1D2C46]'
                            : 'bg-[#E3EEF8]'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Aarav Conductor Dispatch Cue Card */}
          <div
            className={`mt-3.5 flex flex-wrap items-center justify-between gap-2 rounded-2xl border px-3.5 py-2.5 ${
              isNight
                ? 'border-[#F2C66D]/25 bg-[#1A2847]'
                : 'border-[#E6CCB0] bg-[#FFF7EA]'
            }`}
          >
            <div className="flex items-center gap-2">
              <MapPin
                className={`h-4 w-4 shrink-0 ${isNight ? 'text-[#F2C66D]' : 'text-[#C4503B]'}`}
                aria-hidden="true"
              />
              <p
                className={`text-sm font-bold ${
                  isNight ? 'text-[#E2ECF9]' : 'text-[#263C5A]'
                }`}
              >
                {challenge.meaningCue[language]}
              </p>
            </div>
            {alreadyCompleted && (
              <span
                className={`text-xs font-semibold ${
                  isNight ? 'text-[#2ED6A3]' : 'text-[#0E7A74]'
                }`}
              >
                {copy.sentenceTrainReplayNotice}
              </span>
            )}
          </div>

          {/* Train Track Drop & Carriage Assembly Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDropOnTrackEnd}
            className={`relative mt-3 min-h-[106px] rounded-2xl border-2 p-3.5 pb-5 transition-colors ${
              isSolved
                ? isNight
                  ? 'border-[#2ED6A3] bg-[#123332]'
                  : 'border-[#24B8B0] bg-[#E8FBF6]'
                : feedback.type === 'incorrect'
                  ? isNight
                    ? 'border-[#FF9478]/80 bg-[#2C1E2E]'
                    : 'border-[#E86D4E] bg-[#FFF2EE]'
                  : isNight
                    ? 'border-[#F2C66D]/30 bg-[#192645]'
                    : 'border-[#D9B896] bg-[#FDF5E6]'
            }`}
          >
            {/* Subtle Railway Track Baseline */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-x-4 bottom-2.5 h-1.5 rounded-full ${
                isNight ? 'bg-white/15' : 'bg-[#8C5E3C]/25'
              }`}
            />

            <div className="relative flex flex-wrap items-center gap-2">
              {/* Train Locomotive Engine */}
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 font-bold shadow-sm ${
                  isSolved
                    ? 'border-[#1B9E77] bg-[#2ED6A3] text-[#131E31]'
                    : 'border-[#B45309]/60 bg-[#F2C66D] text-[#131E31]'
                }`}
                aria-hidden="true"
              >
                <TrainFront className="h-6 w-6" />
              </div>

              {placedTiles.length === 0 ? (
                <p
                  className={`text-xs sm:text-sm font-medium ${
                    isNight ? 'text-[#B6C7DE]' : 'text-[#5A4733]'
                  }`}
                >
                  {copy.sentenceTrainTrackHint}
                </p>
              ) : (
                placedTiles.map((tile, idx) => (
                  <div key={tile.uid} className="inline-flex items-center gap-1.5">
                    {/* Brass Coupling Connector */}
                    <span
                      aria-hidden="true"
                      className={`h-1 w-2 rounded-full ${
                        isNight ? 'bg-[#F2C66D]/60' : 'bg-[#8C5E3C]/50'
                      }`}
                    />
                    <div
                      draggable={!isSolved}
                      onDragStart={onDragStartTile('track', tile.uid)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={onDropOnTrackSlot(idx)}
                      className={`relative inline-flex items-center gap-1 rounded-xl border-2 px-1.5 py-1 shadow-[0_3px_0_rgba(32,48,74,0.16)] transition-transform ${
                        tileClasses[tile.colorIndex]
                      } ${isSolved && !reducedMotion ? '-translate-y-0.5' : ''}`}
                    >
                      {!isSolved && placedTiles.length > 1 && idx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMovePlacedTile(idx, -1)}
                          aria-label={`Move ${tile.word} left`}
                          className="flex h-8 w-6 items-center justify-center rounded-lg opacity-75 hover:bg-black/10 hover:opacity-100 cursor-pointer"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={isSolved}
                        onClick={() => handleRemovePlacedTile(tile)}
                        aria-label={
                          isSolved ? tile.word : `Remove ${tile.word} from train`
                        }
                        className={`min-h-[36px] px-2 font-display text-sm sm:text-base font-bold ${
                          isSolved ? 'cursor-default' : 'cursor-pointer'
                        }`}
                      >
                        {tile.word}
                      </button>

                      {!isSolved && placedTiles.length > 1 && idx < placedTiles.length - 1 && (
                        <button
                          type="button"
                          onClick={() => handleMovePlacedTile(idx, 1)}
                          aria-label={`Move ${tile.word} right`}
                          className="flex h-8 w-6 items-center justify-center rounded-lg opacity-75 hover:bg-black/10 hover:opacity-100 cursor-pointer"
                        >
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      )}

                      {/* Miniature Train Carriage Wheels */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-2 left-2.5 h-2 w-2 rounded-full bg-[#20304A]"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-2 right-2.5 h-2 w-2 rounded-full bg-[#20304A]"
                      />
                    </div>
                  </div>
                ))
              )}

              {isSolved && (
                <span className="font-display text-xl font-extrabold text-[#24B8B0]">.</span>
              )}
            </div>
          </div>

          {/* Tactile Word Tile Bank */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDropOnBank}
            className="mt-4"
          >
            <p
              className={`mb-2 text-xs font-bold ${
                isNight ? 'text-[#B6C7DE]' : 'text-[#4F6482]'
              }`}
            >
              {copy.sentenceTrainBankLabel}
            </p>
            <div className="flex min-h-[56px] flex-wrap items-center gap-2.5">
              {bankTiles.map((tile, idx) => (
                <button
                  key={tile.uid}
                  type="button"
                  disabled={isSolved}
                  draggable={!isSolved}
                  onDragStart={onDragStartTile('bank', tile.uid)}
                  onClick={() => handleSelectBankTile(tile)}
                  className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border-2 px-4 py-2 font-display text-sm sm:text-base font-bold shadow-[0_3px_0_rgba(32,48,74,0.14)] transition-transform active:translate-y-0.5 cursor-pointer ${
                    tileClasses[tile.colorIndex]
                  }`}
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-black/10 font-mono-num text-[11px] font-extrabold">
                    {idx + 1}
                  </span>
                  <span>{tile.word}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Supportive Feedback Banner */}
          {feedback.type !== 'idle' && (
            <div
              role="status"
              aria-live="polite"
              className={`mt-4 flex items-start gap-2.5 rounded-2xl border p-3.5 text-xs sm:text-sm font-semibold ${
                feedback.type === 'correct'
                  ? isNight
                    ? 'border-[#2ED6A3]/60 bg-[#123332] text-[#D8FAF0]'
                    : 'border-[#24B8B0]/50 bg-[#E6FAF5] text-[#0E5B56]'
                  : isNight
                    ? 'border-[#FF9478]/60 bg-[#35202D] text-[#FFD8CE]'
                    : 'border-[#E86D4E]/45 bg-[#FFF2EE] text-[#8E321C]'
              }`}
            >
              {feedback.type === 'correct' ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2ED6A3]" aria-hidden="true" />
              ) : (
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#E59A2B]" aria-hidden="true" />
              )}
              <span>
                {feedback.type === 'correct'
                  ? copy.sentenceTrainSuccessBanner
                  : feedback.message}
              </span>
            </div>
          )}

          {/* Action Bar: Undo, Reset, Check Answer / Next Sentence */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isSolved || placedTiles.length === 0}
                onClick={handleUndo}
                className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  isSolved || placedTiles.length === 0
                    ? 'cursor-not-allowed opacity-45'
                    : 'cursor-pointer'
                } ${
                  isNight
                    ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                    : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A] hover:bg-[#DCE8F5]'
                }`}
              >
                <Undo2 className="h-4 w-4" aria-hidden="true" />
                <span>{copy.sentenceTrainUndoButton}</span>
              </button>

              <button
                type="button"
                disabled={isSolved || placedTiles.length === 0}
                onClick={handleReset}
                className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  isSolved || placedTiles.length === 0
                    ? 'cursor-not-allowed opacity-45'
                    : 'cursor-pointer'
                } ${
                  isNight
                    ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                    : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A] hover:bg-[#DCE8F5]'
                }`}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                <span>{copy.sentenceTrainResetButton}</span>
              </button>
            </div>

            {!isSolved ? (
              <button
                type="button"
                onClick={handleCheckAnswer}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#f7d487] active:scale-[0.98] transition-transform cursor-pointer whitespace-nowrap shrink-0"
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                <span>{copy.sentenceTrainCheckButton}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextChallenge}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#49e2b3] active:scale-[0.98] transition-transform cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>
                  {challengeIdx < JAIPUR_SENTENCE_CHALLENGES.length - 1
                    ? copy.sentenceTrainNextButton
                    : copy.sentenceTrainFinishButton}
                </span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
