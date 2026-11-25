import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Hammer,
  RotateCcw,
  Trash2,
  Undo2,
  Volume2,
} from 'lucide-react';
import type { AppLanguage, LocalizedText } from '../../../types/game';
import { GAME_COPY } from '../../../data/i18n';
import {
  joinNormalizedTiles,
  validateCommandForgeSubmission,
  type BuildTile,
  type CommandForgeChallengeVariant,
} from '../../../data/egyptBuild';
import { shuffleArray } from '../../../utils/shuffle';
import { ExpeditionEquipmentTableSVG } from '../EgyptBuildArtwork';

export interface BuildSolvedPayload {
  instructionText: string;
  instructionLines: string[];
  thaiScaffold?: string;
}

interface ExpeditionCommandForgeGameProps {
  language: AppLanguage;
  isNight: boolean;
  variant: CommandForgeChallengeVariant;
  challengeKey: string;
  isSolved: boolean;
  onSolved: (payload: BuildSolvedPayload) => void;
  onFeedback: (state: { isCorrect: boolean; message: LocalizedText } | null) => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'reward') => void;
}

export function ExpeditionCommandForgeGame({
  language,
  isNight,
  variant,
  challengeKey,
  isSolved,
  onSolved,
  onFeedback,
  onPlaySfx,
}: ExpeditionCommandForgeGameProps) {
  const copy = GAME_COPY[language];
  const [shuffledTiles, setShuffledTiles] = useState<BuildTile[]>(() =>
    shuffleArray(variant.tiles),
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setShuffledTiles(shuffleArray(variant.tiles));
    setSelectedIds([]);
  }, [challengeKey, variant]);

  const selectedTiles = selectedIds
    .map((id) => variant.tiles.find((t) => t.instanceId === id))
    .filter((t): t is BuildTile => Boolean(t));

  const assembledSentence = joinNormalizedTiles(
    selectedTiles.map((t) => t.value),
  );

  const handleSelectTile = (instanceId: string) => {
    if (isSolved || selectedIds.includes(instanceId)) return;
    onPlaySfx('select');
    onFeedback(null);
    setSelectedIds((prev) => [...prev, instanceId]);
  };

  const handleRemoveSelected = (instanceId: string) => {
    if (isSolved) return;
    onPlaySfx('click');
    onFeedback(null);
    setSelectedIds((prev) => prev.filter((id) => id !== instanceId));
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
    setShuffledTiles(shuffleArray(variant.tiles));
  };

  const handleSpeakSentence = () => {
    const text = assembledSentence || variant.canonicalModel;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.94;
    window.speechSynthesis.speak(u);
  };

  const handleCheck = () => {
    const result = validateCommandForgeSubmission(
      variant,
      selectedTiles.map((t) => t.value),
    );
    onFeedback({ isCorrect: result.isCorrect, message: result.feedback });
    if (result.isCorrect) {
      onPlaySfx('reward');
      onSolved({
        instructionText: result.sentence,
        instructionLines: [result.sentence],
        thaiScaffold: variant.thaiScaffold,
      });
    } else {
      onPlaySfx('click');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      {/* Left: Visual Action Goal & Equipment Table */}
      <div
        className={`lg:col-span-5 rounded-2xl border p-3.5 space-y-3 ${
          isNight
            ? 'border-white/12 bg-[#162340]'
            : 'border-[#FDE68A] bg-[#FFFBEB]'
        }`}
      >
        <div className="flex items-center gap-2">
          <Hammer
            className="h-4 w-4 text-[#D97706] dark:text-[#FDE68A]"
            aria-hidden="true"
          />
          <p className="font-display text-xs font-extrabold uppercase tracking-wide text-[#B45309] dark:text-[#FDE68A]">
            {language === 'th' ? 'เป้าหมายที่โต๊ะอุปกรณ์' : 'Camp Action Goal'}
          </p>
        </div>

        <ExpeditionEquipmentTableSVG
          highlightedItems={variant.highlightedItems}
          actionDemoKey={variant.actionDemoKey}
          isSolved={isSolved}
          className="w-full h-auto rounded-xl"
        />

        <div
          className={`rounded-xl border p-3 space-y-1.5 ${
            isNight
              ? 'border-white/10 bg-[#121D36]'
              : 'border-[#FDE68A] bg-white'
          }`}
        >
          <p className="text-xs sm:text-sm font-bold leading-snug">
            {variant.goalSummary[language]}
          </p>
          <p
            className={`text-[11px] font-medium ${
              isNight ? 'text-[#5EEAD4]' : 'text-[#0F766E]'
            }`}
          >
            {language === 'th' ? variant.targetOutcomeTh : variant.targetOutcomeEn}
          </p>
        </div>
      </div>

      {/* Right: Word & Phrase Forge */}
      <div
        className={`lg:col-span-7 rounded-2xl border p-3.5 space-y-3.5 ${
          isNight ? 'border-white/12 bg-[#1B2542]' : 'border-[#E2E8F0] bg-white'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-extrabold uppercase tracking-wide text-[#0D9488] dark:text-[#5EEAD4]">
            {language === 'th'
              ? 'ประกอบคำสั่งภาษาอังกฤษของคุณ'
              : 'Forge Your English Command'}
          </p>
          {assembledSentence && (
            <button
              type="button"
              onClick={handleSpeakSentence}
              className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                isNight
                  ? 'border-white/15 bg-white/10 text-white'
                  : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#334155]'
              }`}
            >
              <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{copy.egyptJournalListenButton}</span>
            </button>
          )}
        </div>

        {/* Assembled Sentence Tray */}
        <div
          className={`min-h-[82px] rounded-2xl border-2 border-dashed p-3 flex flex-col justify-between gap-2 ${
            isSolved
              ? isNight
                ? 'border-[#10B981]/60 bg-[#0F2A2A]'
                : 'border-[#059669]/50 bg-[#ECFDF5]'
              : isNight
                ? 'border-[#E7B43C]/40 bg-[#121D36]'
                : 'border-[#D97706]/35 bg-[#FFFBEB]/60'
          }`}
        >
          {selectedTiles.length === 0 ? (
            <p
              className={`text-xs font-medium italic my-auto text-center ${
                isNight ? 'text-[#94A3B8]' : 'text-[#64748B]'
              }`}
            >
              {language === 'th'
                ? 'แตะชิ้นส่วนคำด้านล่างตามลำดับเพื่อสร้างประโยคคำสั่ง'
                : 'Tap word and phrase tiles below in order to forge your command.'}
            </p>
          ) : (
            <>
              <div className="flex flex-wrap gap-1.5">
                {selectedTiles.map((tile) => (
                  <button
                    key={tile.instanceId}
                    type="button"
                    disabled={isSolved}
                    onClick={() => handleRemoveSelected(tile.instanceId)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs sm:text-sm font-bold transition-colors ${
                      isNight
                        ? 'border-[#12B8B0]/60 bg-[#102A33] text-[#F8FAFC] hover:bg-[#193B47]'
                        : 'border-[#0D9488]/45 bg-white text-[#131E31] hover:bg-[#F0FDFA]'
                    } ${isSolved ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <span>{tile.value}</span>
                    {!isSolved && (
                      <Trash2
                        className="h-3 w-3 opacity-60 text-[#DC2626] dark:text-[#FCA5A5]"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                ))}
              </div>
              <p
                className={`text-xs font-semibold pt-1 border-t ${
                  isNight
                    ? 'border-white/10 text-[#FDE68A]'
                    : 'border-[#D97706]/20 text-[#78350F]'
                }`}
              >
                “{assembledSentence}”
              </p>
            </>
          )}
        </div>

        {/* Available Tiles */}
        <div className="space-y-2">
          <p
            className={`text-[11px] font-bold ${
              isNight ? 'text-[#CBD5E1]' : 'text-[#64748B]'
            }`}
          >
            {language === 'th'
              ? 'คลังคำศัพท์และวลี (ระวังคำหลอกที่ไม่เข้าพวก)'
              : 'Word & Phrase Tiles (watch out for distractors)'}
          </p>
          <div className="flex flex-wrap gap-2">
            {shuffledTiles.map((tile) => {
              const used = selectedIds.includes(tile.instanceId);
              return (
                <button
                  key={tile.instanceId}
                  type="button"
                  disabled={used || isSolved}
                  onClick={() => handleSelectTile(tile.instanceId)}
                  className={`rounded-xl border px-3 py-2 text-xs sm:text-sm font-bold transition-colors ${
                    used
                      ? 'opacity-35 cursor-not-allowed border-dashed'
                      : isNight
                        ? 'border-white/15 bg-[#162340] text-[#F8FAFC] hover:border-[#E7B43C] cursor-pointer'
                        : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#1E293B] hover:border-[#0D9488] hover:bg-[#F0FDFA] cursor-pointer'
                  }`}
                >
                  {tile.value}
                </button>
              );
            })}
          </div>
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
