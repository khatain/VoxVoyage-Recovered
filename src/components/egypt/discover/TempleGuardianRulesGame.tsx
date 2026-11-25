import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import type { AppLanguage, LocalizedText } from '../../../types/game';
import { GAME_COPY } from '../../../data/i18n';
import {
  validateTempleGuardianSubmission,
  type TempleGuardianVariant,
  type TempleRuleOptionCard,
} from '../../../data/egyptDiscover';
import { shuffleArray } from '../../../utils/shuffle';
import { TempleRuleSceneSVG } from '../EgyptDiscoverArtwork';

interface TempleGuardianRulesGameProps {
  language: AppLanguage;
  isNight: boolean;
  variant: TempleGuardianVariant;
  challengeKey: string;
  isSolved: boolean;
  onSolved: () => void;
  onFeedback: (state: { isCorrect: boolean; message: LocalizedText } | null) => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'reward') => void;
}

export function TempleGuardianRulesGame({
  language,
  isNight,
  variant,
  challengeKey,
  isSolved,
  onSolved,
  onFeedback,
  onPlaySfx,
}: TempleGuardianRulesGameProps) {
  const copy = GAME_COPY[language];

  // Option mechanics
  const [shuffledOptions, setShuffledOptions] = useState<TempleRuleOptionCard[]>(() =>
    shuffleArray(variant.options ?? []),
  );
  const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>(undefined);

  // Sort Do/Don't mechanic
  const [sortBuckets, setSortBuckets] = useState<Record<string, 'do' | 'dont'>>({});
  const [activeSortCardId, setActiveSortCardId] = useState<string | null>(null);

  // Rule -> Purpose match mechanic (remember shared pool lives on purposePairs[0].purposes)
  const [shuffledPurposes, setShuffledPurposes] = useState<{ id: string; text: LocalizedText }[]>(
    () => shuffleArray(variant.purposePairs?.[0]?.purposes ?? []),
  );
  const [purposeMatches, setPurposeMatches] = useState<Record<string, string>>({});

  useEffect(() => {
    setShuffledOptions(shuffleArray(variant.options ?? []));
    setSelectedOptionId(undefined);
    setSortBuckets({});
    setActiveSortCardId(null);
    setShuffledPurposes(shuffleArray(variant.purposePairs?.[0]?.purposes ?? []));
    setPurposeMatches({});
  }, [challengeKey, variant]);

  const handleReset = () => {
    if (isSolved) return;
    onPlaySfx('click');
    onFeedback(null);
    setSelectedOptionId(undefined);
    setSortBuckets({});
    setActiveSortCardId(null);
    setPurposeMatches({});
  };

  const handleCheck = () => {
    const result = validateTempleGuardianSubmission(variant, {
      selectedOptionId,
      sortBuckets,
      purposeMatches,
    });
    onFeedback({ isCorrect: result.isCorrect, message: result.reason });
    if (result.isCorrect) {
      onPlaySfx('reward');
      onSolved();
    } else {
      onPlaySfx('click');
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Contextual Temple Illustrated Banner */}
      <div className="rounded-2xl overflow-hidden border border-black/10 dark:border-white/10">
        <TempleRuleSceneSVG sceneKey={variant.sceneKey} className="w-full h-24 sm:h-28" />
      </div>

      {(variant.mechanic === 'match_sign' ||
        variant.mechanic === 'polite_guidance' ||
        variant.mechanic === 'conditional_complete') && (
        <div className="space-y-2">
          {shuffledOptions.map((opt) => {
            const selected = selectedOptionId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={isSolved}
                onClick={() => {
                  onPlaySfx('select');
                  onFeedback(null);
                  setSelectedOptionId(opt.id);
                }}
                className={`w-full text-left flex items-center justify-between gap-3 rounded-2xl border p-3.5 transition-colors cursor-pointer ${
                  selected
                    ? isNight
                      ? 'border-[#E7B43C] bg-[#2C2415] text-[#FDE68A]'
                      : 'border-[#D97706] bg-[#FFFBEB] text-[#131E31]'
                    : isNight
                      ? 'border-white/12 bg-[#162340] text-[#F8FAFC] hover:border-[#12B8B0]'
                      : 'border-[#E2E8F0] bg-white text-[#1E293B] hover:border-[#0D9488]'
                }`}
              >
                <span className="text-xs sm:text-sm font-bold leading-snug">
                  {opt.label[language]}
                </span>
                <span
                  className={`h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center ${
                    selected
                      ? 'border-[#0D9488] bg-[#0D9488] text-white'
                      : 'border-black/25 dark:border-white/25'
                  }`}
                >
                  {selected && <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {variant.mechanic === 'sort_do_dont' && (
        <div className="space-y-3">
          {/* Unsorted Tray */}
          <div
            className={`rounded-2xl border p-3 ${
              isNight ? 'border-white/12 bg-[#162340]' : 'border-[#E2E8F0] bg-white'
            }`}
          >
            <p className="text-xs font-extrabold text-[#0D9488] dark:text-[#5EEAD4] mb-2">
              {language === 'th'
                ? '1. เลือกการ์ดหรือลากลงช่อง DO / DON’T ด้านล่าง'
                : '1. Tap a card (then tap a zone below) or drag it into DO / DON’T'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(variant.sortItems ?? [])
                .filter((item) => !sortBuckets[item.id])
                .map((item) => {
                  const isActive = activeSortCardId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      draggable={!isSolved}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', item.id);
                      }}
                      onClick={() => {
                        onPlaySfx('select');
                        onFeedback(null);
                        setActiveSortCardId(isActive ? null : item.id);
                      }}
                      disabled={isSolved}
                      className={`text-left rounded-xl border p-2.5 text-xs font-bold transition-colors cursor-pointer ${
                        isActive
                          ? 'border-[#E7B43C] bg-[#FEF3C7] text-[#131E31]'
                          : isNight
                            ? 'border-white/15 bg-[#1B2A4B] text-[#F1F5F9]'
                            : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#1E293B]'
                      }`}
                    >
                      {item.text[language]}
                    </button>
                  );
                })}
            </div>
            {(variant.sortItems ?? []).every((i) => Boolean(sortBuckets[i.id])) && (
              <p className="text-xs font-semibold opacity-70 text-center py-2">
                {language === 'th' ? 'แยกครบทุกใบแล้ว!' : 'All cards assigned!'}
              </p>
            )}
          </div>

          {/* DO / DON'T Drop Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(
              [
                {
                  key: 'do' as const,
                  title: language === 'th' ? 'DO · ควรทำ / ปลอดภัย' : 'DO · Safe & Helpful',
                  Icon: ShieldCheck,
                  boxClass: isNight
                    ? 'border-[#10B981]/50 bg-[#0D2E2A]'
                    : 'border-[#059669]/45 bg-[#ECFDF5]',
                },
                {
                  key: 'dont' as const,
                  title: language === 'th' ? 'DON’T · ห้ามทำ / อันตราย' : 'DON’T · Restricted',
                  Icon: ShieldAlert,
                  boxClass: isNight
                    ? 'border-[#F87171]/50 bg-[#3B1822]'
                    : 'border-[#DC2626]/40 bg-[#FEF2F2]',
                },
              ] as const
            ).map((zone) => {
              const itemsHere = (variant.sortItems ?? []).filter(
                (i) => sortBuckets[i.id] === zone.key,
              );
              return (
                <div
                  key={zone.key}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const droppedId = e.dataTransfer.getData('text/plain');
                    if (
                      droppedId &&
                      (variant.sortItems ?? []).some((i) => i.id === droppedId) &&
                      !isSolved
                    ) {
                      onPlaySfx('select');
                      onFeedback(null);
                      setSortBuckets((prev) => ({ ...prev, [droppedId]: zone.key }));
                      setActiveSortCardId(null);
                    }
                  }}
                  onClick={() => {
                    if (activeSortCardId && !isSolved) {
                      onPlaySfx('select');
                      onFeedback(null);
                      setSortBuckets((prev) => ({ ...prev, [activeSortCardId]: zone.key }));
                      setActiveSortCardId(null);
                    }
                  }}
                  className={`rounded-2xl border-2 p-3 min-h-[120px] transition-colors ${zone.boxClass} ${
                    activeSortCardId && !isSolved ? 'cursor-pointer ring-2 ring-[#E7B43C]/60' : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-display text-xs font-extrabold mb-2">
                    <zone.Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{zone.title}</span>
                  </div>
                  <div className="space-y-1.5">
                    {itemsHere.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between gap-2 rounded-xl border px-2.5 py-2 text-xs font-semibold ${
                          isNight
                            ? 'border-white/15 bg-[#121D36] text-[#F8FAFC]'
                            : 'border-black/10 bg-white text-[#1E293B]'
                        }`}
                      >
                        <span>{item.text[language]}</span>
                        {!isSolved && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onPlaySfx('click');
                              onFeedback(null);
                              setSortBuckets((prev) => {
                                const next = { ...prev };
                                delete next[item.id];
                                return next;
                              });
                            }}
                            aria-label="Remove card"
                            className="p-1 text-[#DC2626] dark:text-[#FCA5A5] cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {variant.mechanic === 'rule_purpose_match' && (
        <div className="space-y-2.5">
          {(variant.purposePairs ?? []).map((pair, idx) => {
            const chosenId = purposeMatches[pair.ruleId];
            return (
              <div
                key={pair.ruleId}
                className={`rounded-2xl border p-3 ${
                  isNight ? 'border-white/12 bg-[#162340]' : 'border-[#E2E8F0] bg-white'
                }`}
              >
                <p className="font-display text-xs sm:text-sm font-extrabold mb-2">
                  <span className="font-mono-num text-[#D97706] dark:text-[#FBBF24] mr-1.5">
                    {idx + 1}.
                  </span>
                  {pair.ruleText[language]}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  {shuffledPurposes.map((purpose) => {
                    const active = chosenId === purpose.id;
                    return (
                      <button
                        key={purpose.id}
                        type="button"
                        disabled={isSolved}
                        onClick={() => {
                          onPlaySfx('select');
                          onFeedback(null);
                          setPurposeMatches((prev) => ({
                            ...prev,
                            [pair.ruleId]: purpose.id,
                          }));
                        }}
                        className={`text-left rounded-xl border px-2.5 py-2 text-[11px] font-bold transition-colors cursor-pointer ${
                          active
                            ? 'border-[#0D9488] bg-[#0D9488] text-white'
                            : isNight
                              ? 'border-white/12 bg-[#1B2A4B] text-[#E2E8F0] hover:border-[#E7B43C]'
                              : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#334155] hover:border-[#0D9488]'
                        }`}
                      >
                        {purpose.text[language]}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
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
  );
}
