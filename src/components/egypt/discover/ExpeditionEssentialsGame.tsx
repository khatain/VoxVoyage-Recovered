import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Backpack,
  CheckCircle2,
  PackageOpen,
  RotateCcw,
  Trash2,
  Undo2,
  XCircle,
} from 'lucide-react';
import type { AppLanguage, LocalizedText } from '../../../types/game';
import { GAME_COPY } from '../../../data/i18n';
import {
  EXPEDITION_ITEMS,
  validateExpeditionEssentialsSelection,
  type ExpeditionChallengeVariant,
  type ExpeditionItemId,
} from '../../../data/egyptDiscover';
import { ExpeditionItemIconSVG } from '../EgyptDiscoverArtwork';

interface ExpeditionEssentialsGameProps {
  language: AppLanguage;
  isNight: boolean;
  variant: ExpeditionChallengeVariant;
  challengeKey: string;
  isSolved: boolean;
  onSolved: () => void;
  onFeedback: (state: { isCorrect: boolean; message: LocalizedText } | null) => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'reward') => void;
}

export function ExpeditionEssentialsGame({
  language,
  isNight,
  variant,
  challengeKey,
  isSolved,
  onSolved,
  onFeedback,
  onPlaySfx,
}: ExpeditionEssentialsGameProps) {
  const copy = GAME_COPY[language];
  const [selectedIds, setSelectedIds] = useState<ExpeditionItemId[]>([]);
  const [dragOverPack, setDragOverPack] = useState(false);

  useEffect(() => {
    setSelectedIds([]);
    setDragOverPack(false);
  }, [challengeKey]);

  const addItem = (itemId: ExpeditionItemId) => {
    if (isSolved) return;
    onPlaySfx('select');
    onFeedback(null);
    setSelectedIds((prev) => (prev.includes(itemId) ? prev : [...prev, itemId]));
  };

  const removeItem = (itemId: ExpeditionItemId) => {
    if (isSolved) return;
    onPlaySfx('click');
    onFeedback(null);
    setSelectedIds((prev) => prev.filter((id) => id !== itemId));
  };

  const toggleItem = (itemId: ExpeditionItemId) => {
    if (selectedIds.includes(itemId)) {
      removeItem(itemId);
    } else {
      addItem(itemId);
    }
  };

  const moveItem = (index: number, delta: -1 | 1) => {
    if (isSolved) return;
    const nextIdx = index + delta;
    if (nextIdx < 0 || nextIdx >= selectedIds.length) return;
    onPlaySfx('select');
    onFeedback(null);
    setSelectedIds((prev) => {
      const copyArr = [...prev];
      [copyArr[index], copyArr[nextIdx]] = [copyArr[nextIdx], copyArr[index]];
      return copyArr;
    });
  };

  const handleUndo = () => {
    if (selectedIds.length === 0 || isSolved) return;
    onPlaySfx('click');
    onFeedback(null);
    setSelectedIds((prev) => prev.slice(0, -1));
  };

  const handleReset = () => {
    if (isSolved) return;
    onPlaySfx('click');
    onFeedback(null);
    setSelectedIds([]);
  };

  const handleCheck = () => {
    const result = validateExpeditionEssentialsSelection(variant, selectedIds);
    onFeedback({ isCorrect: result.isCorrect, message: result.reason });
    if (result.isCorrect) {
      onPlaySfx('reward');
      onSolved();
    } else {
      onPlaySfx('click');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      {/* Available Gear Tray */}
      <div
        className={`lg:col-span-7 rounded-2xl border p-3.5 ${
          isNight
            ? 'border-white/12 bg-[#162340]'
            : 'border-[#E2E8F0] bg-white'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="text-xs font-extrabold uppercase tracking-wide text-[#0D9488] dark:text-[#5EEAD4]">
            {language === 'th'
              ? '1. อุปกรณ์ในเต็นท์ค่าย (แตะหรือลากใส่กระเป๋า)'
              : '1. Camp Gear Table (Tap or Drag to Pack)'}
          </p>
          <span
            className={`text-[11px] font-bold ${
              isNight ? 'text-[#CBD5E1]' : 'text-[#64748B]'
            }`}
          >
            {variant.requiresOrder
              ? language === 'th'
                ? 'ลำดับสำคัญ'
                : 'Order Matters'
              : language === 'th'
                ? 'เลือกรวมไม่เน้นลำดับ'
                : 'Any Order'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {variant.availableItemIds.map((itemId) => {
            const meta = EXPEDITION_ITEMS[itemId];
            const packedIdx = selectedIds.indexOf(itemId);
            const isPacked = packedIdx !== -1;
            return (
              <button
                key={itemId}
                type="button"
                draggable={!isSolved}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', itemId);
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                onClick={() => toggleItem(itemId)}
                disabled={isSolved}
                className={`group flex flex-col items-center text-center rounded-2xl border p-2.5 transition-colors cursor-pointer disabled:cursor-default ${
                  isPacked
                    ? isNight
                      ? 'border-[#12B8B0] bg-[#102A33] text-[#F8FAFC]'
                      : 'border-[#0D9488] bg-[#F0FDFA] text-[#131E31]'
                    : isNight
                      ? 'border-white/12 bg-[#1B2A4B] text-[#F1F5F9] hover:border-[#E7B43C]/60'
                      : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#1E293B] hover:border-[#D97706]'
                }`}
              >
                <div className="relative">
                  <ExpeditionItemIconSVG itemId={itemId} className="h-12 w-12 rounded-xl" />
                  {isPacked && (
                    <span className="absolute -top-1.5 -right-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#0D9488] px-1 font-mono-num text-[10px] font-extrabold text-white shadow">
                      {variant.requiresOrder ? packedIdx + 1 : '✓'}
                    </span>
                  )}
                </div>
                <span className="mt-1.5 font-display text-xs font-extrabold leading-tight">
                  {meta.label[language]}
                </span>
                <span
                  className={`mt-0.5 text-[10px] leading-snug ${
                    isNight ? 'text-[#CBD5E1]' : 'text-[#64748B]'
                  }`}
                >
                  {meta.shortDesc[language]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expedition Pack Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!isSolved) setDragOverPack(true);
        }}
        onDragLeave={() => setDragOverPack(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOverPack(false);
          const dropped = e.dataTransfer.getData('text/plain') as ExpeditionItemId;
          if (dropped && EXPEDITION_ITEMS[dropped]) {
            addItem(dropped);
          }
        }}
        className={`lg:col-span-5 rounded-2xl border-2 border-dashed p-3.5 transition-colors ${
          dragOverPack
            ? 'border-[#12B8B0] bg-[#12B8B0]/15'
            : isNight
              ? 'border-[#E7B43C]/45 bg-[#1B2542]'
              : 'border-[#F59E0B]/60 bg-[#FFFBEB]'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Backpack className="h-4 w-4 text-[#D97706] dark:text-[#FBBF24]" aria-hidden="true" />
            <p className="font-display text-xs font-extrabold">
              {language === 'th' ? '2. กระเป๋าสำรวจของคุณ' : '2. Expedition Pack'}
            </p>
          </div>
          <span className="font-mono-num text-xs font-extrabold text-[#B45309] dark:text-[#FDE68A]">
            {selectedIds.length} / {variant.requiredIds.length}
          </span>
        </div>

        {selectedIds.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center rounded-xl border py-7 px-4 text-center ${
              isNight
                ? 'border-white/10 bg-[#121D36]/60 text-[#CBD5E1]'
                : 'border-[#FDE68A] bg-white/80 text-[#64748B]'
            }`}
          >
            <PackageOpen className="h-7 w-7 mb-1.5 opacity-75" aria-hidden="true" />
            <p className="text-xs font-semibold">
              {language === 'th'
                ? 'แตะหรือลากอุปกรณ์มาวางที่นี่'
                : 'Tap or drop gear cards here to pack'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedIds.map((itemId, index) => {
              const meta = EXPEDITION_ITEMS[itemId];
              return (
                <div
                  key={itemId}
                  className={`flex items-center justify-between gap-2 rounded-xl border px-2.5 py-2 ${
                    isNight
                      ? 'border-white/15 bg-[#121D36] text-[#F8FAFC]'
                      : 'border-[#FDE68A] bg-white text-[#1E293B]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#E7B43C]/25 font-mono-num text-[11px] font-extrabold text-[#92400E] dark:text-[#FDE68A]">
                      {index + 1}
                    </span>
                    <ExpeditionItemIconSVG itemId={itemId} className="h-8 w-8 shrink-0 rounded-lg" />
                    <span className="text-xs font-bold truncate">{meta.label[language]}</span>
                  </div>

                  {!isSolved && (
                    <div className="flex items-center gap-1 shrink-0">
                      {variant.requiresOrder && selectedIds.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() => moveItem(index, -1)}
                            disabled={index === 0}
                            aria-label="Move up"
                            className="p-1 rounded-lg border border-black/10 dark:border-white/15 disabled:opacity-35 cursor-pointer"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem(index, 1)}
                            disabled={index === selectedIds.length - 1}
                            aria-label="Move down"
                            className="p-1 rounded-lg border border-black/10 dark:border-white/15 disabled:opacity-35 cursor-pointer"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => removeItem(itemId)}
                        aria-label={`Remove ${meta.label.en}`}
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
        )}

        {/* Controls */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={selectedIds.length === 0 || isSolved}
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
            disabled={selectedIds.length === 0 || isSolved}
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
            {isSolved ? (
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <XCircle className="h-4 w-4 hidden" aria-hidden="true" />
            )}
            <span>{copy.egyptDiscoverCheckButton}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
