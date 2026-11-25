import { useEffect, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Compass,
  Eye,
  Footprints,
  Lock,
  Navigation,
  Route,
  Sparkles,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import type { AppLanguage, ResolvedAppearance } from '../../types/game';
import { GAME_COPY } from '../../data/i18n';
import {
  SCOTLAND_DISCOVERY_XP_REWARD,
  SCOTLAND_EVIDENCE_ITEMS,
  type ScotlandDifficultyMode,
} from '../../data/scotlandDiscovery';
import { SCOTLAND_LANDMARKS, type ScotlandLandmarkId } from '../../data/scotlandWorld';
import { ScotlandStationIllustrationSVG } from './ScotlandCulturalIllustrationSVG';

interface CulturalExplorerJournalModalProps {
  isOpen: boolean;
  language: AppLanguage;
  appearance: ResolvedAppearance;
  discoveredEvidenceIds: ScotlandLandmarkId[];
  exploredPoiIds: ScotlandLandmarkId[];
  builtSentences?: Record<string, string>;
  completedSpeakingIds?: ScotlandLandmarkId[];
  guidedPoiId?: ScotlandLandmarkId | null;
  initialStationId?: ScotlandLandmarkId;
  difficultyMode: ScotlandDifficultyMode;
  onDifficultyChange: (mode: ScotlandDifficultyMode) => void;
  onGuideToLandmark: (id: ScotlandLandmarkId) => void;
  onAutoWalkToLandmark?: (id: ScotlandLandmarkId) => void;
  onQuickTravelToLandmark?: (id: ScotlandLandmarkId) => void;
  onClearGuide?: () => void;
  onClose: () => void;
  onPlaySfx: (kind?: 'click' | 'select') => void;
}

type LandmarkRouteStatus = 'completed' | 'visited' | 'not_visited';

export function CulturalExplorerJournalModal({
  isOpen,
  language,
  appearance,
  discoveredEvidenceIds,
  exploredPoiIds,
  builtSentences = {},
  completedSpeakingIds = [],
  guidedPoiId,
  initialStationId,
  difficultyMode,
  onDifficultyChange,
  onGuideToLandmark,
  onAutoWalkToLandmark,
  onQuickTravelToLandmark,
  onClearGuide,
  onClose,
  onPlaySfx,
}: CulturalExplorerJournalModalProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';

  const [activeTab, setActiveTab] = useState<'route' | 'evidence'>(
    initialStationId ? 'evidence' : 'route',
  );
  const [selectedId, setSelectedId] = useState<ScotlandLandmarkId>(
    initialStationId ?? SCOTLAND_EVIDENCE_ITEMS[0].id,
  );

  useEffect(() => {
    if (!isOpen) return;
    if (initialStationId) {
      setSelectedId(initialStationId);
      setActiveTab('evidence');
    } else {
      setActiveTab('route');
    }
  }, [isOpen, initialStationId]);

  useEffect(() => {
    if (!isOpen) return;
    const stop = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        stop();
        onPlaySfx('click');
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      stop();
    };
  }, [isOpen, onClose, onPlaySfx]);

  if (!isOpen) return null;

  const getRouteStatus = (landmarkId: ScotlandLandmarkId): LandmarkRouteStatus => {
    if (discoveredEvidenceIds.includes(landmarkId)) return 'completed';
    if (exploredPoiIds.includes(landmarkId)) return 'visited';
    return 'not_visited';
  };

  const orderedLandmarks = [...SCOTLAND_LANDMARKS].sort((a, b) => a.order - b.order);
  const recommendedLandmark =
    orderedLandmarks.find((lm) => getRouteStatus(lm.id) !== 'completed') ?? null;

  const activeItem =
    SCOTLAND_EVIDENCE_ITEMS.find((item) => item.id === selectedId) ??
    SCOTLAND_EVIDENCE_ITEMS[0];
  const isCollected = discoveredEvidenceIds.includes(activeItem.id);
  const collectedCount = discoveredEvidenceIds.length;
  const totalCount = SCOTLAND_EVIDENCE_ITEMS.length;

  const speakEvidence = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.94;
    utterance.pitch = 1.04;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="scotland-journal-title"
      className={`fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 ${
        isNight ? 'bg-[#090F1E]/72' : 'bg-[#20304A]/32'
      }`}
    >
      <div
        className={`flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border shadow-2xl ${
          isNight
            ? 'border-[#3A7D6C]/70 bg-[#121C36] text-[#F7F9FC]'
            : 'border-[#CBD5E1] bg-[#FFFDF8] text-[#1E2E46]'
        }`}
      >
        {/* Top Journal Header */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 ${
            isNight ? 'border-white/12 bg-[#172546]' : 'border-[#E2E8F0] bg-[#F4F9F7]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#2B8C7E] text-white shadow-sm">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="scotland-journal-title" className="font-display text-lg sm:text-xl font-extrabold">
                {copy.scotlandJournalTitle}
              </h2>
              <p className={`text-xs font-semibold ${isNight ? 'text-[#C2D0E3]' : 'text-[#4E6482]'}`}>
                {copy.scotlandJournalSubtitle} ·{' '}
                <span className="font-mono-num font-extrabold text-[#2B8C7E] dark:text-[#2ED6A3]">
                  {collectedCount}/{totalCount}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`inline-flex rounded-xl border p-0.5 text-xs font-bold ${
                isNight ? 'border-white/15 bg-[#0F182F]' : 'border-[#CBD5E1] bg-white'
              }`}
              role="group"
              aria-label={copy.scotlandScaffoldModeLabel}
            >
              <button
                type="button"
                onClick={() => {
                  onPlaySfx('click');
                  onDifficultyChange('a2');
                }}
                className={`min-h-[34px] rounded-lg px-2.5 py-1 transition-colors cursor-pointer ${
                  difficultyMode === 'a2'
                    ? 'bg-[#2ED6A3] text-[#131E31]'
                    : isNight
                      ? 'text-[#C2D0E3] hover:text-white'
                      : 'text-[#475569] hover:text-[#1E2E46]'
                }`}
              >
                {copy.scotlandModeA2Label}
              </button>
              <button
                type="button"
                onClick={() => {
                  onPlaySfx('click');
                  onDifficultyChange('b1');
                }}
                className={`min-h-[34px] rounded-lg px-2.5 py-1 transition-colors cursor-pointer ${
                  difficultyMode === 'b1'
                    ? 'bg-[#F2C66D] text-[#131E31]'
                    : isNight
                      ? 'text-[#C2D0E3] hover:text-white'
                      : 'text-[#475569] hover:text-[#1E2E46]'
                }`}
              >
                {copy.scotlandModeB1Label}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onPlaySfx('click');
                onClose();
              }}
              aria-label={copy.scotlandCloseButton}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border cursor-pointer ${
                isNight
                  ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                  : 'border-[#CBD5E1] bg-white text-[#20304A] hover:bg-[#EEF4FA]'
              }`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Top Journal Mode Switcher: Recommended Route vs Evidence Cards */}
        <div
          className={`flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5 ${
            isNight ? 'border-white/10 bg-[#131E38]' : 'border-[#E2E8F0] bg-[#F8FBFA]'
          }`}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onPlaySfx('select');
                setActiveTab('route');
              }}
              className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-extrabold transition-colors cursor-pointer ${
                activeTab === 'route'
                  ? 'border-[#2B8C7E] bg-[#2B8C7E] text-white'
                  : isNight
                    ? 'border-white/15 bg-[#1A2847] text-[#C2D0E3] hover:bg-[#24365C]'
                    : 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#EEF4FA]'
              }`}
            >
              <Route className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{copy.scotlandRouteTabLabel}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onPlaySfx('select');
                setActiveTab('evidence');
              }}
              className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-extrabold transition-colors cursor-pointer ${
                activeTab === 'evidence'
                  ? 'border-[#2B8C7E] bg-[#2B8C7E] text-white'
                  : isNight
                    ? 'border-white/15 bg-[#1A2847] text-[#C2D0E3] hover:bg-[#24365C]'
                    : 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#EEF4FA]'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {copy.scotlandEvidenceTabLabel} ({collectedCount}/{totalCount})
              </span>
            </button>
          </div>

          {guidedPoiId && (
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-extrabold ${
                  isNight
                    ? 'border-[#F2C66D]/50 bg-[#2C2214] text-[#FDE68A]'
                    : 'border-[#F59E0B]/40 bg-[#FFFBEB] text-[#92400E]'
                }`}
              >
                <Navigation className="h-3 w-3" aria-hidden="true" />
                <span>
                  {copy.scotlandGuidingActiveLabel}:{' '}
                  {SCOTLAND_LANDMARKS.find((l) => l.id === guidedPoiId)?.title[language]}
                </span>
              </span>
              {onClearGuide && (
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('click');
                    onClearGuide();
                  }}
                  className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                    isNight
                      ? 'border-white/15 bg-[#1D2C46] text-[#E2ECF9] hover:bg-[#293D60]'
                      : 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F1F5F9]'
                  }`}
                >
                  {copy.scotlandClearGuideButton}
                </button>
              )}
            </div>
          )}
        </div>

        {/* ROUTE VIEW: All 5 landmarks with suggested order, states, recommended destination, & Guide Me */}
        {activeTab === 'route' ? (
          <div className="flex-1 space-y-3 overflow-y-auto p-5 sm:p-6">
            {/* Recommended Destination Callout */}
            <div
              className={`rounded-2xl border p-4 ${
                recommendedLandmark
                  ? isNight
                    ? 'border-[#F2C66D]/45 bg-[#241E14]'
                    : 'border-[#FCD34D] bg-[#FFFBEB]'
                  : isNight
                    ? 'border-[#2ED6A3]/45 bg-[#12332F]/75'
                    : 'border-[#6EE7B7] bg-[#ECFDF5]'
              }`}
            >
              {recommendedLandmark ? (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p
                      className={`text-[11px] font-extrabold uppercase tracking-wide ${
                        isNight ? 'text-[#F2C66D]' : 'text-[#92400E]'
                      }`}
                    >
                      {copy.scotlandRecommendedNextLabel} · {recommendedLandmark.order}/{totalCount}
                    </p>
                    <p className="mt-0.5 font-display text-base font-extrabold">
                      {recommendedLandmark.title[language]}
                    </p>
                    <p
                      className={`text-xs font-medium ${
                        isNight ? 'text-[#D6DFEC]' : 'text-[#526785]'
                      }`}
                    >
                      {recommendedLandmark.subtitle[language]}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {onAutoWalkToLandmark && (
                      <button
                        type="button"
                        onClick={() => {
                          onPlaySfx('select');
                          onAutoWalkToLandmark(recommendedLandmark.id);
                          onClose();
                        }}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#4F46E5] px-3.5 py-2 font-display text-xs font-extrabold text-white shadow hover:bg-[#4338CA] cursor-pointer"
                      >
                        <Footprints className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{copy.navAutoWalkButton}</span>
                      </button>
                    )}

                    {onQuickTravelToLandmark && (
                      <button
                        type="button"
                        onClick={() => {
                          onPlaySfx('select');
                          onQuickTravelToLandmark(recommendedLandmark.id);
                          onClose();
                        }}
                        className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold cursor-pointer ${
                          isNight
                            ? 'border-[#38BDF8]/40 bg-[#112742] text-[#7DD3FC] hover:bg-[#19365A]'
                            : 'border-[#0284C7]/35 bg-[#E0F2FE] text-[#0369A1] hover:bg-[#BAE6FD]'
                        }`}
                      >
                        <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{copy.navQuickTravelButton}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        onPlaySfx('select');
                        onGuideToLandmark(recommendedLandmark.id);
                      }}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#F2C66D] px-4 py-2 font-display text-xs font-extrabold text-[#131E31] shadow hover:bg-[#f6d388] cursor-pointer"
                    >
                      <Navigation className="h-4 w-4" aria-hidden="true" />
                      <span>{copy.scotlandGuideMeButton}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-5 w-5 shrink-0 text-[#2ED6A3]" aria-hidden="true" />
                  <p className="text-xs sm:text-sm font-bold">{copy.scotlandAllStationsDoneNote}</p>
                </div>
              )}
            </div>

            {/* Suggested Route Order: 1 -> 2 -> 3 -> 4 -> 5 (Open Order Exploration Always Allowed) */}
            <div className="space-y-2.5">
              {orderedLandmarks.map((lm) => {
                const status = getRouteStatus(lm.id);
                const isRecommended = recommendedLandmark?.id === lm.id;
                const isGuided = guidedPoiId === lm.id;
                const evidence = SCOTLAND_EVIDENCE_ITEMS.find((e) => e.id === lm.id);

                return (
                  <div
                    key={lm.id}
                    className={`flex flex-col gap-3 rounded-2xl border p-3.5 sm:flex-row sm:items-center sm:justify-between ${
                      isGuided
                        ? isNight
                          ? 'border-[#F2C66D] bg-[#252016]'
                          : 'border-[#F59E0B] bg-[#FFFBEB]'
                        : isRecommended
                          ? isNight
                            ? 'border-[#2ED6A3]/60 bg-[#152D35]'
                            : 'border-[#2B8C7E]/50 bg-[#F0FAF7]'
                          : isNight
                            ? 'border-white/12 bg-[#182542]'
                            : 'border-[#E2E8F0] bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <ScotlandStationIllustrationSVG
                          stationId={lm.id}
                          className="h-14 w-14 rounded-xl border border-black/10"
                        />
                        <span
                          className="absolute -left-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-lg font-mono-num text-xs font-extrabold text-white shadow"
                          style={{ backgroundColor: lm.accentColor }}
                        >
                          {lm.order}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {status === 'completed' ? (
                            <span
                              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-extrabold ${
                                isNight
                                  ? 'bg-[#12332F] text-[#2ED6A3]'
                                  : 'bg-[#DCFCE7] text-[#065F46]'
                              }`}
                            >
                              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                              <span>{copy.scotlandStatusCompleted}</span>
                            </span>
                          ) : status === 'visited' ? (
                            <span
                              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-extrabold ${
                                isNight
                                  ? 'bg-[#1D3557] text-[#93C5FD]'
                                  : 'bg-[#DBEAFE] text-[#1E40AF]'
                              }`}
                            >
                              <Eye className="h-3 w-3" aria-hidden="true" />
                              <span>{copy.scotlandStatusVisited}</span>
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold ${
                                isNight
                                  ? 'bg-white/10 text-[#CBD5E1]'
                                  : 'bg-[#F1F5F9] text-[#475569]'
                              }`}
                            >
                              <span>{copy.scotlandStatusNotVisited}</span>
                            </span>
                          )}

                          {isRecommended && (
                            <span className="rounded-md bg-[#F2C66D] px-2 py-0.5 text-[11px] font-extrabold text-[#131E31]">
                              {copy.scotlandRecommendedNextLabel}
                            </span>
                          )}

                          {builtSentences[lm.id] && (
                            <span
                              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-extrabold ${
                                isNight
                                  ? 'bg-[#1B3A4B] text-[#7DD3FC]'
                                  : 'bg-[#E0F2FE] text-[#0369A1]'
                              }`}
                            >
                              <span>{copy.scotlandBuildStageBadge}</span>
                            </span>
                          )}

                          {completedSpeakingIds.includes(lm.id) && (
                            <span
                              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-extrabold ${
                                isNight
                                  ? 'bg-[#2C1F4A] text-[#C4B5FD]'
                                  : 'bg-[#F3E8FF] text-[#6B21A8]'
                              }`}
                            >
                              <span>{copy.scotlandPracticeDoneBadge}</span>
                            </span>
                          )}
                        </div>

                        <h3 className="mt-1 truncate font-display text-sm sm:text-base font-extrabold">
                          {lm.title[language]}
                        </h3>
                        <p
                          className={`truncate text-xs ${
                            isNight ? 'text-[#B8CAE0]' : 'text-[#526785]'
                          }`}
                        >
                          {evidence ? evidence.mechanicLabel[language] : lm.subtitle[language]}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      {onAutoWalkToLandmark && (
                        <button
                          type="button"
                          onClick={() => {
                            onPlaySfx('select');
                            onAutoWalkToLandmark(lm.id);
                            onClose();
                          }}
                          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#4F46E5] px-3 py-1.5 font-display text-xs font-extrabold text-white shadow-sm hover:bg-[#4338CA] cursor-pointer"
                        >
                          <Footprints className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{copy.navAutoWalkButton}</span>
                        </button>
                      )}

                      {onQuickTravelToLandmark && (
                        <button
                          type="button"
                          onClick={() => {
                            onPlaySfx('select');
                            onQuickTravelToLandmark(lm.id);
                            onClose();
                          }}
                          className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                            isNight
                              ? 'border-[#38BDF8]/40 bg-[#112742] text-[#7DD3FC] hover:bg-[#19365A]'
                              : 'border-[#0284C7]/35 bg-[#E0F2FE] text-[#0369A1] hover:bg-[#BAE6FD]'
                          }`}
                        >
                          <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{copy.navQuickTravelButton}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          onPlaySfx('select');
                          setSelectedId(lm.id);
                          setActiveTab('evidence');
                        }}
                        className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                          isNight
                            ? 'border-white/15 bg-[#1D2C46] text-[#E2ECF9] hover:bg-[#273B5E]'
                            : 'border-[#CBD5E1] bg-white text-[#20304A] hover:bg-[#EEF4FA]'
                        }`}
                      >
                        <BookOpen className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
                        <span>{copy.scotlandOpenCardButton}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onPlaySfx('select');
                          onGuideToLandmark(lm.id);
                        }}
                        className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-display text-xs font-extrabold shadow-sm cursor-pointer ${
                          isGuided
                            ? 'bg-[#2ED6A3] text-[#131E31]'
                            : isRecommended
                              ? 'bg-[#F2C66D] text-[#131E31] hover:bg-[#f6d388]'
                              : isNight
                                ? 'border border-[#F2C66D]/50 bg-[#2A2214] text-[#FDE68A] hover:bg-[#3A2F1C]'
                                : 'border border-[#D99B26]/50 bg-[#FFFDF5] text-[#92400E] hover:bg-[#FEF3C7]'
                        }`}
                      >
                        <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>
                          {isGuided ? copy.scotlandGuidingActiveLabel : copy.scotlandGuideMeButton}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            {/* Station Selector Tabs */}
            <div
              className={`flex gap-2 overflow-x-auto border-b px-4 py-3 ${
                isNight ? 'border-white/10 bg-[#14203C]' : 'border-[#E2E8F0] bg-[#FBFDFC]'
              }`}
            >
              {SCOTLAND_EVIDENCE_ITEMS.map((item) => {
                const unlocked = discoveredEvidenceIds.includes(item.id);
                const active = item.id === activeItem.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onPlaySfx('select');
                      setSelectedId(item.id);
                    }}
                    className={`inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                      active
                        ? 'border-[#2B8C7E] bg-[#2B8C7E] text-white'
                        : unlocked
                          ? isNight
                            ? 'border-[#2ED6A3]/40 bg-[#173632] text-[#9CF2D6] hover:bg-[#1E4641]'
                            : 'border-[#99D6C8] bg-[#ECF8F5] text-[#1D5E51] hover:bg-[#DCF2EC]'
                          : isNight
                            ? 'border-white/12 bg-[#1A2847] text-[#9EB1CA] hover:bg-[#23345B]'
                            : 'border-[#CBD5E1] bg-white text-[#526785] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    {unlocked ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    ) : (
                      <Lock className="h-3.5 w-3.5 shrink-0 opacity-75" aria-hidden="true" />
                    )}
                    <span>
                      {item.order}. {item.landmarkTitle[language]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Journal Evidence Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              {!isCollected ? (
                <div
                  className={`flex flex-col items-center rounded-2xl border p-6 text-center ${
                    isNight
                      ? 'border-white/12 bg-[#1A2847]/70'
                      : 'border-[#E2E8F0] bg-[#F8FAFC]'
                  }`}
                >
                  <ScotlandStationIllustrationSVG stationId={activeItem.id} className="h-24 w-24 opacity-80" />
                  <p className="mt-3 font-display text-base font-extrabold">
                    {activeItem.stationTitle[language]}
                  </p>
                  <p className={`mt-1 max-w-md text-xs sm:text-sm ${isNight ? 'text-[#B8CAE0]' : 'text-[#526785]'}`}>
                    {copy.scotlandJournalLockedCardHint}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    {onAutoWalkToLandmark && (
                      <button
                        type="button"
                        onClick={() => {
                          onPlaySfx('select');
                          onAutoWalkToLandmark(activeItem.id);
                          onClose();
                        }}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#4F46E5] px-4 py-2 font-display text-xs font-extrabold text-white shadow hover:bg-[#4338CA] cursor-pointer"
                      >
                        <Footprints className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{copy.navAutoWalkButton}</span>
                      </button>
                    )}

                    {onQuickTravelToLandmark && (
                      <button
                        type="button"
                        onClick={() => {
                          onPlaySfx('select');
                          onQuickTravelToLandmark(activeItem.id);
                          onClose();
                        }}
                        className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${
                          isNight
                            ? 'border-[#38BDF8]/40 bg-[#112742] text-[#7DD3FC] hover:bg-[#19365A]'
                            : 'border-[#0284C7]/35 bg-[#E0F2FE] text-[#0369A1] hover:bg-[#BAE6FD]'
                        }`}
                      >
                        <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{copy.navQuickTravelButton}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        onPlaySfx('select');
                        onGuideToLandmark(activeItem.id);
                      }}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#F2C66D] px-4 py-2 font-display text-xs font-extrabold text-[#131E31] shadow hover:bg-[#f6d388] cursor-pointer"
                    >
                      <Navigation className="h-4 w-4" aria-hidden="true" />
                      <span>{copy.scotlandGuideMeButton}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <ScotlandStationIllustrationSVG
                      stationId={activeItem.id}
                      className="h-24 w-24 shrink-0 self-start rounded-2xl border border-black/5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-wide text-[#2B8C7E] dark:text-[#2ED6A3]">
                          {activeItem.stationTitle[language]} · {activeItem.mechanicLabel[language]}
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {onAutoWalkToLandmark && (
                            <button
                              type="button"
                              onClick={() => {
                                onPlaySfx('select');
                                onAutoWalkToLandmark(activeItem.id);
                                onClose();
                              }}
                              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#4F46E5] px-3 py-1.5 text-xs font-extrabold text-white shadow hover:bg-[#4338CA] cursor-pointer"
                            >
                              <Footprints className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>{copy.navAutoWalkButton}</span>
                            </button>
                          )}

                          {onQuickTravelToLandmark && (
                            <button
                              type="button"
                              onClick={() => {
                                onPlaySfx('select');
                                onQuickTravelToLandmark(activeItem.id);
                                onClose();
                              }}
                              className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                                isNight
                                  ? 'border-[#38BDF8]/40 bg-[#112742] text-[#7DD3FC] hover:bg-[#19365A]'
                                  : 'border-[#0284C7]/35 bg-[#E0F2FE] text-[#0369A1] hover:bg-[#BAE6FD]'
                              }`}
                            >
                              <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>{copy.navQuickTravelButton}</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              speakEvidence(
                                `${activeItem.landmarkTitle.en}. ${activeItem.scottishFact.en} ${activeItem.thailandConnection.en}`,
                              )
                            }
                            className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                              isNight
                                ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                                : 'border-[#24B8B0]/35 bg-[#E6F5FB] text-[#0E7A74] hover:bg-[#D5EEF8]'
                            }`}
                          >
                            <Volume2 className="h-4 w-4 text-[#24B8B0]" aria-hidden="true" />
                            <span>{copy.jaipurListenButton}</span>
                          </button>
                        </div>
                      </div>
                      <h3 className="mt-1 font-display text-xl font-extrabold">
                        {activeItem.landmarkTitle[language]}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed">
                        {difficultyMode === 'a2'
                          ? activeItem.a2Summary[language]
                          : activeItem.scottishFact[language]}
                      </p>
                      {difficultyMode === 'b1' && (
                        <p className={`mt-1.5 text-xs leading-relaxed ${isNight ? 'text-[#C2D0E3]' : 'text-[#475569]'}`}>
                          {activeItem.b1Insight[language]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Key Vocabulary Cards */}
                  <div
                    className={`rounded-2xl border p-4 ${
                      isNight ? 'border-white/12 bg-[#182644]' : 'border-[#E2E8F0] bg-[#F8FAFC]'
                    }`}
                  >
                    <p className="text-xs font-extrabold uppercase tracking-wide text-[#D99B26]">
                      {copy.scotlandJournalVocabLabel}
                    </p>
                    <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
                      {activeItem.keyVocab.map((v) => (
                        <div
                          key={v.term}
                          className={`rounded-xl border p-3 ${
                            isNight ? 'border-white/10 bg-[#121C36]' : 'border-[#E2E8F0] bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-display text-sm font-extrabold text-[#2B8C7E] dark:text-[#2ED6A3]">
                              {v.term}
                            </span>
                            <button
                              type="button"
                              onClick={() => speakEvidence(`${v.term}. ${v.a2Def.en}`)}
                              aria-label={`${copy.jaipurListenButton} ${v.term}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                            >
                              <Volume2 className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
                            </button>
                          </div>
                          <p className="mt-1 text-xs font-semibold leading-relaxed">
                            {v.a2Def[language]}
                          </p>
                          {difficultyMode === 'b1' && (
                            <p className={`mt-1 text-[11px] leading-relaxed ${isNight ? 'text-[#B5C6DD]' : 'text-[#526785]'}`}>
                              {v.b1Note[language]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Thailand Connection + Similarities & Differences */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div
                      className={`rounded-2xl border p-4 ${
                        isNight
                          ? 'border-[#3A7D6C]/45 bg-[#12332F]/75'
                          : 'border-[#A7DFD2] bg-[#EDF9F6]'
                      }`}
                    >
                      <p className="text-xs font-extrabold uppercase tracking-wide text-[#2B8C7E] dark:text-[#2ED6A3]">
                        {copy.scotlandJournalThaiLinkLabel}
                      </p>
                      <p className="mt-1.5 text-xs sm:text-sm leading-relaxed">
                        {activeItem.thailandConnection[language]}
                      </p>
                    </div>

                    <div
                      className={`rounded-2xl border p-4 ${
                        isNight
                          ? 'border-[#D99B26]/35 bg-[#2A2217]/75'
                          : 'border-[#FDE68A] bg-[#FFFBEB]'
                      }`}
                    >
                      <p className="text-xs font-extrabold uppercase tracking-wide text-[#B45309] dark:text-[#F2C66D]">
                        {copy.scotlandJournalCompareLabel}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed">
                        <span className="font-bold">{copy.scotlandSimilarityShortLabel}:</span>{' '}
                        {activeItem.similarityNote[language]}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed">
                        <span className="font-bold">{copy.scotlandDifferenceShortLabel}:</span>{' '}
                        {activeItem.differenceNote[language]}
                      </p>
                    </div>
                  </div>

                  {/* Source & Language Bridge Note */}
                  <div
                    className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-[11px] ${
                      isNight
                        ? 'border-white/10 bg-[#16233E] text-[#A8B9D0]'
                        : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#4E6482]'
                    }`}
                  >
                    <span>{activeItem.sourceNote[language]}</span>
                    <span className="font-mono-num font-bold">
                      {copy.scotlandLanguageBridgeLabel}: {activeItem.languageBridgePhrases.join(' · ')}
                    </span>
                  </div>

                  {builtSentences[activeItem.id] && (
                    <div
                      className={`rounded-2xl border p-4 ${
                        isNight
                          ? 'border-[#3B78A8]/50 bg-[#152844] text-[#F7F9FC]'
                          : 'border-[#BAE6FD] bg-[#F0F9FF] text-[#0C4A6E]'
                      }`}
                    >
                      <p className="text-xs font-extrabold uppercase tracking-wide text-[#0284C7] dark:text-[#7DD3FC]">
                        {copy.scotlandJournalBuiltSentenceLabel}
                      </p>
                      <p className="mt-1.5 font-display text-sm sm:text-base font-extrabold leading-relaxed">
                        &ldquo;{builtSentences[activeItem.id]}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer Progress Summary */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3.5 ${
            isNight ? 'border-white/12 bg-[#16233E]' : 'border-[#E2E8F0] bg-[#F8FAFC]'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-semibold">
            {collectedCount >= totalCount ? (
              <>
                <Sparkles className="h-4 w-4 text-[#2ED6A3]" aria-hidden="true" />
                <span>
                  {copy.scotlandJournalCompleteNote} (+{SCOTLAND_DISCOVERY_XP_REWARD} XP)
                </span>
              </>
            ) : (
              <>
                <Compass className="h-4 w-4 text-[#D99B26]" aria-hidden="true" />
                <span>{copy.scotlandJournalProgressNote}</span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              onPlaySfx('click');
              onClose();
            }}
            className="inline-flex min-h-[40px] items-center justify-center rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-xs font-extrabold text-[#131E31] shadow hover:bg-[#49e2b3] cursor-pointer"
          >
            {copy.scotlandCloseButton}
          </button>
        </div>
      </div>
    </div>
  );
}
