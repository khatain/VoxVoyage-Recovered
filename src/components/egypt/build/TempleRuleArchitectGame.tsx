import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Undo2,
  Users,
} from 'lucide-react';
import type { AppLanguage, LocalizedText } from '../../../types/game';
import { GAME_COPY } from '../../../data/i18n';
import {
  joinNormalizedTiles,
  validateTempleRuleArchitectSubmission,
  type BuildTile,
  type TempleRuleArchitectVariant,
} from '../../../data/egyptBuild';
import { shuffleArray } from '../../../utils/shuffle';
import {
  TempleCourtyardSceneSVG,
  TempleSignPlaqueSVG,
} from '../EgyptBuildArtwork';
import type { BuildSolvedPayload } from './ExpeditionCommandForgeGame';

interface TempleRuleArchitectGameProps {
  language: AppLanguage;
  isNight: boolean;
  variant: TempleRuleArchitectVariant;
  challengeKey: string;
  isSolved: boolean;
  onSolved: (payload: BuildSolvedPayload) => void;
  onFeedback: (state: { isCorrect: boolean; message: LocalizedText } | null) => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'reward') => void;
}

export function TempleRuleArchitectGame({
  language,
  isNight,
  variant,
  challengeKey,
  isSolved,
  onSolved,
  onFeedback,
  onPlaySfx,
}: TempleRuleArchitectGameProps) {
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

  const handleCheckSign = () => {
    const result = validateTempleRuleArchitectSubmission(
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
      {/* Left: Courtyard Context & Audience */}
      <div
        className={`lg:col-span-5 rounded-2xl border p-3.5 space-y-3 ${
          isNight
            ? 'border-white/12 bg-[#162340]'
            : 'border-[#FDE68A] bg-[#FFFBEB]'
        }`}
      >
        <TempleCourtyardSceneSVG
          sceneKey={variant.courtyardSceneKey}
          className="w-full h-24 rounded-xl"
        />

        <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#0D9488]/15 px-2.5 py-1 text-[11px] font-extrabold text-[#0F766E] dark:text-[#5EEAD4]">
          <Users className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{variant.audienceLabel[language]}</span>
        </div>

        <div
          className={`rounded-xl border p-3 ${
            isNight
              ? 'border-white/10 bg-[#121D36]'
              : 'border-[#FDE68A] bg-white'
          }`}
        >
          <p className="text-xs sm:text-sm font-semibold leading-relaxed">
            {variant.situationPrompt[language]}
          </p>
        </div>
      </div>

      {/* Right: Sandstone Sign Engraving */}
      <div
        className={`lg:col-span-7 rounded-2xl border p-3.5 space-y-3.5 ${
          isNight ? 'border-white/12 bg-[#1B2542]' : 'border-[#E2E8F0] bg-white'
        }`}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck
            className="h-4 w-4 text-[#0D9488] dark:text-[#5EEAD4]"
            aria-hidden="true"
          />
          <p className="text-xs font-extrabold uppercase tracking-wide text-[#0D9488] dark:text-[#5EEAD4]">
            {language === 'th'
              ? 'สลักป้ายกฎและน้ำเสียงที่เหมาะสม'
              : 'Engrave Courtyard Sign'}
          </p>
        </div>

        <TempleSignPlaqueSVG
          sentence={assembledSentence}
          isSolved={isSolved}
          isNight={isNight}
        />

        {selectedTiles.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedTiles.map((tile) => (
              <button
                key={tile.instanceId}
                type="button"
                disabled={isSolved}
                onClick={() => handleRemoveSelected(tile.instanceId)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-bold ${
                  isNight
                    ? 'border-[#12B8B0]/60 bg-[#102A33] text-[#F8FAFC]'
                    : 'border-[#0D9488]/45 bg-[#F0FDFA] text-[#131E31]'
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
        )}

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
            onClick={handleCheckSign}
            disabled={isSolved}
            className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-[#0D9488] px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-[#0F766E] disabled:opacity-50 cursor-pointer"
          >
            {isSolved && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
            <span>{copy.egyptBuildCheckSignButton}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
