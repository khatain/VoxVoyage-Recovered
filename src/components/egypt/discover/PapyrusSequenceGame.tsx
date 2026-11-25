import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  RotateCcw,
  ScrollText,
  Trash2,
  Undo2,
} from 'lucide-react';
import type { AppLanguage, LocalizedText } from '../../../types/game';
import { GAME_COPY } from '../../../data/i18n';
import {
  validatePapyrusSequence,
  type PapyrusSequenceVariant,
  type PapyrusStepCard,
} from '../../../data/egyptDiscover';
import { shuffleDifferentFrom } from '../../../utils/shuffle';

interface PapyrusSequenceGameProps {
  language: AppLanguage;
  isNight: boolean;
  variant: PapyrusSequenceVariant;
  challengeKey: string;
  isSolved: boolean;
  onSolved: () => void;
  onFeedback: (state: { isCorrect: boolean; message: LocalizedText } | null) => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'reward') => void;
}

export function PapyrusSequenceGame({
  language,
  isNight,
  variant,
  challengeKey,
  isSolved,
  onSolved,
  onFeedback,
  onPlaySfx,
}: PapyrusSequenceGameProps) {
  const copy = GAME_COPY[language];
  const [shuffledTray, setShuffledTray] = useState<PapyrusStepCard[]>(() =>
    shuffleDifferentFrom(variant.cards, (a, b) => a.id === b.id),
  );
  const [placedIds, setPlacedIds] = useState<string[]>([]);

  useEffect(() => {
    setShuffledTray(shuffleDifferentFrom(variant.cards, (a, b) => a.id === b.id));
    setPlacedIds([]);
  }, [challengeKey, variant]);

  const placeCard = (cardId: string) => {
    if (isSolved || placedIds.includes(cardId)) return;
    onPlaySfx('select');
    onFeedback(null);
    setPlacedIds((prev) => [...prev, cardId]);
  };

  const insertCardAtSlot = (cardId: string, slotIdx: number) => {
    if (isSolved) return;
    onPlaySfx('select');
    onFeedback(null);
    setPlacedIds((prev) => {
      const filtered = prev.filter((id) => id !== cardId);
      const safeIdx = Math.min(Math.max(0, slotIdx), filtered.length);
      filtered.splice(safeIdx, 0, cardId);
      return filtered;
    });
  };

  const removeCard = (cardId: string) => {
    if (isSolved) return;
    onPlaySfx('click');
    onFeedback(null);
    setPlacedIds((prev) => prev.filter((id) => id !== cardId));
  };

  const movePlaced = (idx: number, delta: -1 | 1) => {
    if (isSolved) return;
    const nextIdx = idx + delta;
    if (nextIdx < 0 || nextIdx >= placedIds.length) return;
    onPlaySfx('select');
    onFeedback(null);
    setPlacedIds((prev) => {
      const copyArr = [...prev];
      [copyArr[idx], copyArr[nextIdx]] = [copyArr[nextIdx], copyArr[idx]];
      return copyArr;
    });
  };

  const handleUndo = () => {
    if (placedIds.length === 0 || isSolved) return;
    onPlaySfx('click');
    onFeedback(null);
    setPlacedIds((prev) => prev.slice(0, -1));
  };

  const handleReset = () => {
    if (isSolved) return;
    onPlaySfx('click');
    onFeedback(null);
    setPlacedIds([]);
    setShuffledTray(shuffleDifferentFrom(variant.cards, (a, b) => a.id === b.id));
  };

  const handleCheck = () => {
    const result = validatePapyrusSequence(variant, placedIds);
    onFeedback({ isCorrect: result.isCorrect, message: result.reason });
    if (result.isCorrect) {
      onPlaySfx('reward');
      onSolved();
    } else {
      onPlaySfx('click');
    }
  };

  const unplacedCards = shuffledTray.filter((c) => !placedIds.includes(c.id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      {/* Left: Shuffled Workshop Cards */}
      <div
        className={`lg:col-span-6 rounded-2xl border p-3.5 ${
          isNight ? 'border-white/12 bg-[#162340]' : 'border-[#E2E8F0] bg-white'
        }`}
      >
        <p className="text-xs font-extrabold uppercase tracking-wide text-[#0D9488] dark:text-[#5EEAD4] mb-2.5">
          {language === 'th'
            ? '1. บัตรขั้นตอนบนโต๊ะ (แตะหรือลากไปเรียง)'
            : '1. Shuffled Instruction Cards (Tap or Drag)'}
        </p>

        {unplacedCards.length === 0 ? (
          <div
            className={`rounded-xl border border-dashed py-8 px-4 text-center text-xs font-semibold ${
              isNight
                ? 'border-white/15 bg-[#121D36]/50 text-[#CBD5E1]'
                : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#64748B]'
            }`}
          >
            {language === 'th'
              ? 'นำบัตรขั้นตอนทั้งหมดวางบนม้วนกระดาษแล้ว กดตรวจคำตอบได้เลย!'
              : 'All cards placed on the scroll! Press Check Answer when ready.'}
          </div>
        ) : (
          <div className="space-y-2">
            {unplacedCards.map((card) => (
              <button
                key={card.id}
                type="button"
                draggable={!isSolved}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', card.id);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onClick={() => placeCard(card.id)}
                disabled={isSolved}
                className={`w-full text-left flex items-start gap-2.5 rounded-xl border p-3 transition-colors cursor-pointer ${
                  isNight
                    ? 'border-white/12 bg-[#1B2A4B] text-[#F8FAFC] hover:border-[#E7B43C]'
                    : 'border-[#E2E8F0] bg-[#FFFBEB]/60 text-[#1E293B] hover:border-[#D97706]'
                }`}
              >
                <span className="shrink-0 rounded-md bg-[#E7B43C]/25 px-2 py-0.5 text-[10px] font-extrabold text-[#92400E] dark:text-[#FDE68A]">
                  {card.markerBadge}
                </span>
                <span className="text-xs sm:text-sm font-semibold leading-snug">
                  {card.text[language]}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Scribe Scroll Slots */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const cardId = e.dataTransfer.getData('text/plain');
          if (cardId && variant.cards.some((c) => c.id === cardId)) {
            placeCard(cardId);
          }
        }}
        className={`lg:col-span-6 rounded-2xl border p-3.5 ${
          isNight ? 'border-[#E7B43C]/40 bg-[#1B2542]' : 'border-[#FDE68A] bg-[#FFFBEB]'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-[#B45309] dark:text-[#FDE68A]" aria-hidden="true" />
            <p className="font-display text-xs font-extrabold">
              {language === 'th' ? '2. ม้วนกระดาษเรียงลำดับ' : '2. Papyrus Scroll Sequence'}
            </p>
          </div>
          <span className="font-mono-num text-xs font-extrabold text-[#B45309] dark:text-[#FDE68A]">
            {placedIds.length} / {variant.cards.length}
          </span>
        </div>

        <div className="space-y-2">
          {variant.cards.map((_, slotIdx) => {
            const cardId = placedIds[slotIdx];
            const card = cardId ? variant.cards.find((c) => c.id === cardId) : null;
            return (
              <div
                key={slotIdx}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const droppedId = e.dataTransfer.getData('text/plain');
                  if (droppedId && variant.cards.some((c) => c.id === droppedId)) {
                    insertCardAtSlot(droppedId, slotIdx);
                  }
                }}
                className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 min-h-[54px] ${
                  card
                    ? isNight
                      ? 'border-[#12B8B0]/50 bg-[#121D36] text-[#F8FAFC]'
                      : 'border-[#0D9488]/40 bg-white text-[#1E293B]'
                    : isNight
                      ? 'border-dashed border-white/15 bg-[#121D36]/40 text-[#94A3B8]'
                      : 'border-dashed border-[#D97706]/35 bg-white/60 text-[#94A3B8]'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#E7B43C]/25 font-mono-num text-[11px] font-extrabold text-[#92400E] dark:text-[#FDE68A]">
                    {slotIdx + 1}
                  </span>
                  {card ? (
                    <span className="text-xs sm:text-sm font-semibold leading-snug">
                      {card.text[language]}
                    </span>
                  ) : (
                    <span className="text-xs italic">
                      {language === 'th' ? `ขั้นตอนที่ ${slotIdx + 1}` : `Step ${slotIdx + 1} slot`}
                    </span>
                  )}
                </div>

                {card && !isSolved && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => movePlaced(slotIdx, -1)}
                      disabled={slotIdx === 0}
                      aria-label="Move step up"
                      className="p-1 rounded-lg border border-black/10 dark:border-white/15 disabled:opacity-35 cursor-pointer"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => movePlaced(slotIdx, 1)}
                      disabled={slotIdx === placedIds.length - 1}
                      aria-label="Move step down"
                      className="p-1 rounded-lg border border-black/10 dark:border-white/15 disabled:opacity-35 cursor-pointer"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeCard(card.id)}
                      aria-label="Remove step"
                      className="p-1 rounded-lg text-[#DC2626] hover:bg-[#FEE2E2] dark:text-[#FCA5A5] dark:hover:bg-[#451A1A] cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={placedIds.length === 0 || isSolved}
            className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-bold disabled:opacity-40 cursor-pointer ${
              isNight
                ? 'border-white/15 bg-white/8 text-[#E2E8F0]'
                : 'border-[#CBD5E1] bg-white text-[#334155]'
            }`}
          >
            <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{copy.egyptDiscoverUndoButton}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isSolved}
            className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-bold disabled:opacity-40 cursor-pointer ${
              isNight
                ? 'border-white/15 bg-white/8 text-[#E2E8F0]'
                : 'border-[#CBD5E1] bg-white text-[#334155]'
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{copy.egyptDiscoverResetButton}</span>
          </button>

          <button
            type="button"
            onClick={handleCheck}
            disabled={isSolved}
            className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-[#0D9488] px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-[#0F766E] disabled:opacity-50 cursor-pointer"
          >
            {isSolved && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
            <span>{copy.egyptDiscoverCheckButton}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
