import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Info,
  Lock,
  RotateCcw,
  Sparkles,
  Trash2,
  Undo2,
} from 'lucide-react';
import type { AppLanguage, LocalizedText } from '../../../types/game';
import { GAME_COPY } from '../../../data/i18n';
import {
  FICTIONAL_TABLET_GLYPHS,
  validatePharaohCodeSubmission,
  type FictionalGlyphId,
  type PharaohCodeVariant,
} from '../../../data/egyptDiscover';
import { FictionalGlyphSVG } from '../EgyptDiscoverArtwork';

interface PharaohInstructionCodeGameProps {
  language: AppLanguage;
  isNight: boolean;
  variant: PharaohCodeVariant;
  challengeKey: string;
  isSolved: boolean;
  onSolved: () => void;
  onFeedback: (state: { isCorrect: boolean; message: LocalizedText } | null) => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'reward') => void;
}

const ALL_GLYPH_IDS: FictionalGlyphId[] = [
  'sun',
  'water',
  'lotus',
  'pyramid',
  'star',
  'scroll',
];

export function PharaohInstructionCodeGame({
  language,
  isNight,
  variant,
  challengeKey,
  isSolved,
  onSolved,
  onFeedback,
  onPlaySfx,
}: PharaohInstructionCodeGameProps) {
  const copy = GAME_COPY[language];
  const [selectedIds, setSelectedIds] = useState<FictionalGlyphId[]>([]);

  useEffect(() => {
    setSelectedIds([]);
  }, [challengeKey]);

  const addGlyph = (glyphId: FictionalGlyphId) => {
    if (isSolved || selectedIds.includes(glyphId)) return;
    onPlaySfx('select');
    onFeedback(null);
    setSelectedIds((prev) => [...prev, glyphId]);
  };

  const toggleGlyph = (glyphId: FictionalGlyphId) => {
    if (isSolved) return;
    if (selectedIds.includes(glyphId)) {
      onPlaySfx('click');
      onFeedback(null);
      setSelectedIds((prev) => prev.filter((id) => id !== glyphId));
    } else {
      addGlyph(glyphId);
    }
  };

  const moveGlyph = (idx: number, delta: -1 | 1) => {
    if (isSolved) return;
    const nextIdx = idx + delta;
    if (nextIdx < 0 || nextIdx >= selectedIds.length) return;
    onPlaySfx('select');
    onFeedback(null);
    setSelectedIds((prev) => {
      const arr = [...prev];
      [arr[idx], arr[nextIdx]] = [arr[nextIdx], arr[idx]];
      return arr;
    });
  };

  const handleUndo = () => {
    if (selectedIds.length === 0 || isSolved) return;
    onPlaySfx('click');
    onFeedback(null);
    setSelectedIds((prev) => prev.slice(0, -1));
  };

  const handleReset = () => {
    if (selectedIds.length === 0 || isSolved) return;
    onPlaySfx('click');
    onFeedback(null);
    setSelectedIds([]);
  };

  const handleCheck = () => {
    const result = validatePharaohCodeSubmission(variant, selectedIds);
    onFeedback({ isCorrect: result.isCorrect, message: result.reason });
    if (result.isCorrect) {
      onPlaySfx('reward');
      onSolved();
    } else {
      onPlaySfx('click');
    }
  };

  const litMeta = variant.litHintSymbol
    ? FICTIONAL_TABLET_GLYPHS[variant.litHintSymbol]
    : null;

  return (
    <div className="space-y-3.5">
      {/* Clear Fictional Game Notice + Chamber Gate Sealed Reminder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div
          className={`flex items-start gap-2 rounded-xl border p-2.5 text-[11px] font-semibold ${
            isNight
              ? 'border-[#12B8B0]/35 bg-[#102A33] text-[#CCFBF1]'
              : 'border-[#99F6E4] bg-[#F0FDFA] text-[#0F766E]'
          }`}
        >
          <Info className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            {language === 'th'
              ? 'สัญลักษณ์เกมจำลองเพื่อการเรียนรู้เท่านั้น — ไม่ใช่อักษรอียิปต์โบราณจริง'
              : 'Fictional educational game symbols only — not real ancient Egyptian writing.'}
          </span>
        </div>

        <div
          className={`flex items-start gap-2 rounded-xl border p-2.5 text-[11px] font-semibold ${
            isNight
              ? 'border-[#E7B43C]/40 bg-[#2A2013] text-[#FDE68A]'
              : 'border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]'
          }`}
        >
          <Lock className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            {language === 'th'
              ? 'ประตูโถงแห่งปัญญายังปิดผนึกอยู่ (เปิดเข้าด้านในในเฟส 5E)'
              : 'Chamber interior remains sealed until final expedition stages (Phase 5E).'}
          </span>
        </div>
      </div>

      {/* Conditional Signal Indicator Bar */}
      {variant.litHintSymbol && litMeta && (
        <div
          className={`flex items-center gap-2.5 rounded-2xl border-2 px-3.5 py-2.5 ${
            isNight
              ? 'border-[#E7B43C] bg-[#2D2212] text-[#FDE68A]'
              : 'border-[#D97706] bg-[#FEF3C7] text-[#78350F]'
          }`}
        >
          <Sparkles className="h-4 w-4 shrink-0 text-[#D97706] dark:text-[#FBBF24]" aria-hidden="true" />
          <FictionalGlyphSVG glyphId={variant.litHintSymbol} className="h-7 w-7 shrink-0" />
          <p className="text-xs font-extrabold">
            {language === 'th'
              ? `สัญญาณไฟกำลังสว่าง: ${litMeta.label.th}`
              : `Active Tablet Beacon Lit: ${litMeta.label.en} is glowing!`}
          </p>
        </div>
      )}

      {/* Tablet Slots (Drop Zone) */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const dropped = e.dataTransfer.getData('text/plain') as FictionalGlyphId;
          if (ALL_GLYPH_IDS.includes(dropped)) {
            addGlyph(dropped);
          }
        }}
        className={`rounded-2xl border-2 p-3.5 ${
          isNight
            ? 'border-[#E7B43C]/50 bg-[#1B2542]'
            : 'border-[#D97706]/50 bg-[#FFFBEB]'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <p className="font-display text-xs font-extrabold">
            {language === 'th' ? 'แท่นวางรหัสสัญลักษณ์' : 'Tablet Sequence Slots'}
          </p>
          <span className="font-mono-num text-xs font-extrabold text-[#B45309] dark:text-[#FDE68A]">
            {selectedIds.length} / {variant.expectedSequence.length}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {variant.expectedSequence.map((_, idx) => {
            const glyphId = selectedIds[idx];
            const meta = glyphId ? FICTIONAL_TABLET_GLYPHS[glyphId] : null;
            return (
              <div
                key={idx}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 min-w-[118px] ${
                  meta
                    ? isNight
                      ? 'border-[#12B8B0] bg-[#121D36] text-[#F8FAFC]'
                      : 'border-[#0D9488] bg-white text-[#1E293B]'
                    : isNight
                      ? 'border-dashed border-white/20 bg-[#121D36]/50 text-[#94A3B8]'
                      : 'border-dashed border-[#D97706]/40 bg-white/70 text-[#94A3B8]'
                }`}
              >
                <span className="font-mono-num text-[11px] font-extrabold opacity-75">
                  {idx + 1}.
                </span>
                {meta && glyphId ? (
                  <>
                    <FictionalGlyphSVG glyphId={glyphId} className="h-7 w-7 shrink-0" />
                    <span className="text-xs font-bold">{meta.label[language]}</span>
                    {!isSolved && (
                      <div className="ml-auto flex items-center gap-0.5">
                        {variant.requiresOrder && selectedIds.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() => moveGlyph(idx, -1)}
                              disabled={idx === 0}
                              aria-label="Move glyph earlier"
                              className="p-0.5 rounded border border-black/10 dark:border-white/15 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowLeft className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveGlyph(idx, 1)}
                              disabled={idx === selectedIds.length - 1}
                              aria-label="Move glyph later"
                              className="p-0.5 rounded border border-black/10 dark:border-white/15 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleGlyph(glyphId)}
                          aria-label="Remove glyph"
                          className="p-0.5 text-[#DC2626] dark:text-[#FCA5A5] cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-[11px] italic">
                    {language === 'th' ? 'ช่องว่าง' : 'Empty'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 6 Fictional Glyph Tiles */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {ALL_GLYPH_IDS.map((glyphId) => {
          const meta = FICTIONAL_TABLET_GLYPHS[glyphId];
          const chosenIdx = selectedIds.indexOf(glyphId);
          const isChosen = chosenIdx !== -1;
          return (
            <button
              key={glyphId}
              type="button"
              draggable={!isSolved}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', glyphId);
              }}
              onClick={() => toggleGlyph(glyphId)}
              disabled={isSolved}
              className={`relative flex flex-col items-center justify-center rounded-2xl border p-2.5 text-center transition-colors cursor-pointer ${
                isChosen
                  ? isNight
                    ? 'border-[#12B8B0] bg-[#102A33] text-[#F8FAFC]'
                    : 'border-[#0D9488] bg-[#F0FDFA] text-[#131E31]'
                  : isNight
                    ? 'border-white/15 bg-[#162340] text-[#F1F5F9] hover:border-[#E7B43C]'
                    : 'border-[#CBD5E1] bg-white text-[#1E293B] hover:border-[#D97706]'
              }`}
            >
              {isChosen && (
                <span className="absolute top-1.5 right-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#0D9488] px-1 font-mono-num text-[10px] font-extrabold text-white">
                  {variant.requiresOrder ? chosenIdx + 1 : '✓'}
                </span>
              )}
              <FictionalGlyphSVG glyphId={glyphId} className="h-10 w-10" />
              <span className="mt-1 text-[11px] font-extrabold leading-tight">
                {meta.label[language]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
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
          {isSolved && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
          <span>{copy.egyptDiscoverCheckButton}</span>
        </button>
      </div>
    </div>
  );
}
