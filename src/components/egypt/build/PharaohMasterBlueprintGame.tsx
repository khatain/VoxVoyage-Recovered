import { useEffect, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Trash2,
  Undo2,
} from 'lucide-react';
import type { AppLanguage, LocalizedText } from '../../../types/game';
import { GAME_COPY } from '../../../data/i18n';
import {
  joinNormalizedTiles,
  validatePharaohBlueprintSubmission,
  type BuildTile,
  type PharaohBlueprintVariant,
} from '../../../data/egyptBuild';
import { shuffleArray } from '../../../utils/shuffle';
import { PharaohBlueprintIllustrationSVG } from '../EgyptBuildArtwork';
import type { BuildSolvedPayload } from './ExpeditionCommandForgeGame';

interface PharaohMasterBlueprintGameProps {
  language: AppLanguage;
  isNight: boolean;
  variant: PharaohBlueprintVariant;
  challengeKey: string;
  isSolved: boolean;
  journalDrawerOpen: boolean;
  onToggleJournalDrawer: () => void;
  onSolved: (payload: BuildSolvedPayload) => void;
  onFeedback: (state: { isCorrect: boolean; message: LocalizedText } | null) => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'reward') => void;
}

function buildInitialShuffledBySection(
  variant: PharaohBlueprintVariant,
): Record<string, BuildTile[]> {
  const map: Record<string, BuildTile[]> = {};
  for (const sec of variant.sections) {
    map[sec.sectionId] = shuffleArray(sec.tiles);
  }
  return map;
}

export function PharaohMasterBlueprintGame({
  language,
  isNight,
  variant,
  challengeKey,
  isSolved,
  journalDrawerOpen,
  onToggleJournalDrawer,
  onSolved,
  onFeedback,
  onPlaySfx,
}: PharaohMasterBlueprintGameProps) {
  const copy = GAME_COPY[language];
  const [shuffledBySection, setShuffledBySection] = useState<
    Record<string, BuildTile[]>
  >(() => buildInitialShuffledBySection(variant));
  const [selectedIdsBySection, setSelectedIdsBySection] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    setShuffledBySection(buildInitialShuffledBySection(variant));
    setSelectedIdsBySection({});
  }, [challengeKey, variant]);

  const handleSelectTile = (sectionId: string, instanceId: string) => {
    if (isSolved) return;
    const current = selectedIdsBySection[sectionId] ?? [];
    if (current.includes(instanceId)) return;
    onPlaySfx('select');
    onFeedback(null);
    setSelectedIdsBySection((prev) => ({
      ...prev,
      [sectionId]: [...current, instanceId],
    }));
  };

  const handleRemoveTile = (sectionId: string, instanceId: string) => {
    if (isSolved) return;
    onPlaySfx('click');
    onFeedback(null);
    setSelectedIdsBySection((prev) => ({
      ...prev,
      [sectionId]: (prev[sectionId] ?? []).filter((id) => id !== instanceId),
    }));
  };

  const handleUndoSection = (sectionId: string) => {
    const current = selectedIdsBySection[sectionId] ?? [];
    if (isSolved || current.length === 0) return;
    onPlaySfx('click');
    onFeedback(null);
    setSelectedIdsBySection((prev) => ({
      ...prev,
      [sectionId]: current.slice(0, -1),
    }));
  };

  const handleResetAll = () => {
    if (isSolved) return;
    onPlaySfx('click');
    onFeedback(null);
    setSelectedIdsBySection({});
    setShuffledBySection(buildInitialShuffledBySection(variant));
  };

  const handleVerifyBlueprint = () => {
    const valueSelections: Record<string, string[]> = {};
    for (const sec of variant.sections) {
      const ids = selectedIdsBySection[sec.sectionId] ?? [];
      valueSelections[sec.sectionId] = ids
        .map((id) => sec.tiles.find((t) => t.instanceId === id)?.value)
        .filter((v): v is string => Boolean(v));
    }
    const result = validatePharaohBlueprintSubmission(variant, valueSelections);
    onFeedback({ isCorrect: result.isCorrect, message: result.feedback });
    if (result.isCorrect) {
      onPlaySfx('reward');
      onSolved({
        instructionText: result.joinedText,
        instructionLines: result.lines,
        thaiScaffold: variant.thaiScaffold,
      });
    } else {
      onPlaySfx('click');
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Blueprint Header */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3.5 ${
          isNight
            ? 'border-[#E7B43C]/35 bg-[#162340]'
            : 'border-[#FDE68A] bg-[#FFFBEB]'
        }`}
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <PharaohBlueprintIllustrationSVG className="h-12 w-12 shrink-0 rounded-xl" />
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#B45309] dark:text-[#FDE68A]">
              {language === 'th'
                ? 'แปลนภารกิจหลัก 4 หมวด'
                : '4-Section Master Blueprint'}
            </p>
            <p className="mt-0.5 text-xs sm:text-sm font-semibold leading-snug">
              {variant.missionBrief[language]}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleJournalDrawer}
          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-extrabold cursor-pointer shrink-0 ${
            journalDrawerOpen
              ? 'border-[#0D9488] bg-[#0D9488] text-white'
              : isNight
                ? 'border-white/15 bg-white/10 text-[#FDE68A]'
                : 'border-[#D97706]/35 bg-white text-[#92400E]'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{copy.egyptBuildOpenJournalButton}</span>
        </button>
      </div>

      {/* 4 Blueprint Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {variant.sections.map((sec) => {
          const selectedIds = selectedIdsBySection[sec.sectionId] ?? [];
          const selectedTiles = selectedIds
            .map((id) => sec.tiles.find((t) => t.instanceId === id))
            .filter((t): t is BuildTile => Boolean(t));
          const sentence = joinNormalizedTiles(
            selectedTiles.map((t) => t.value),
          );
          const tiles = shuffledBySection[sec.sectionId] ?? sec.tiles;

          return (
            <div
              key={sec.sectionId}
              className={`rounded-2xl border p-3.5 space-y-2.5 ${
                isSolved
                  ? isNight
                    ? 'border-[#10B981]/50 bg-[#0F2A2A]'
                    : 'border-[#059669]/40 bg-[#ECFDF5]'
                  : isNight
                    ? 'border-white/12 bg-[#1B2542]'
                    : 'border-[#E2E8F0] bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-xs sm:text-sm font-extrabold text-[#0D9488] dark:text-[#5EEAD4]">
                    {sec.sectionLabel[language]}
                  </p>
                  <p
                    className={`text-xs font-medium leading-snug ${
                      isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'
                    }`}
                  >
                    {sec.prompt[language]}
                  </p>
                </div>

                {!isSolved && (
                  <button
                    type="button"
                    onClick={() => handleUndoSection(sec.sectionId)}
                    disabled={selectedIds.length === 0}
                    aria-label={`Undo ${sec.sectionLabel.en}`}
                    className={`p-1.5 rounded-lg border disabled:opacity-35 cursor-pointer shrink-0 ${
                      isNight
                        ? 'border-white/15 bg-[#121D36] text-white'
                        : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#334155]'
                    }`}
                  >
                    <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* Section Sentence Slot */}
              <div
                className={`min-h-[54px] rounded-xl border border-dashed p-2.5 flex flex-col justify-center gap-1.5 ${
                  isNight
                    ? 'border-[#E7B43C]/35 bg-[#121D36]'
                    : 'border-[#D97706]/35 bg-[#FFFBEB]/60'
                }`}
              >
                {selectedTiles.length === 0 ? (
                  <span
                    className={`text-[11px] italic ${
                      isNight ? 'text-[#94A3B8]' : 'text-[#64748B]'
                    }`}
                  >
                    {language === 'th'
                      ? 'แตะคำด้านล่างเพื่อเติมส่วนนี้'
                      : 'Tap tiles below to compose this section'}
                  </span>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-1">
                      {selectedTiles.map((tile) => (
                        <button
                          key={tile.instanceId}
                          type="button"
                          disabled={isSolved}
                          onClick={() =>
                            handleRemoveTile(sec.sectionId, tile.instanceId)
                          }
                          className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-bold ${
                            isNight
                              ? 'border-[#12B8B0]/55 bg-[#102A33] text-[#F8FAFC]'
                              : 'border-[#0D9488]/45 bg-white text-[#131E31]'
                          } ${isSolved ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <span>{tile.value}</span>
                          {!isSolved && (
                            <Trash2
                              className="h-2.5 w-2.5 opacity-60 text-[#DC2626] dark:text-[#FCA5A5]"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                    <p
                      className={`text-[11px] font-semibold ${
                        isNight ? 'text-[#FDE68A]' : 'text-[#78350F]'
                      }`}
                    >
                      “{sentence}”
                    </p>
                  </>
                )}
              </div>

              {/* Section Tiles */}
              <div className="flex flex-wrap gap-1.5">
                {tiles.map((tile) => {
                  const used = selectedIds.includes(tile.instanceId);
                  return (
                    <button
                      key={tile.instanceId}
                      type="button"
                      disabled={used || isSolved}
                      onClick={() =>
                        handleSelectTile(sec.sectionId, tile.instanceId)
                      }
                      className={`rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-colors ${
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
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleResetAll}
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
          onClick={handleVerifyBlueprint}
          disabled={isSolved}
          className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-[#0D9488] px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-[#0F766E] disabled:opacity-50 cursor-pointer"
        >
          {isSolved && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
          <span>{copy.egyptBuildSaveBlueprintButton}</span>
        </button>
      </div>
    </div>
  );
}
