import { useEffect, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Compass,
  Footprints,
  Gamepad2,
  Info,
  Lock,
  MapPin,
  Navigation,
  Play,
  Route,
  Sparkles,
  Square,
  Trophy,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import type {
  AppLanguage,
  EgyptInstructionJournalRecord,
  ResolvedAppearance,
} from '../../types/game';
import { GAME_COPY } from '../../data/i18n';
import {
  EGYPT_LANDMARKS,
  EGYPT_NPC_DIALOGUES,
  EGYPT_RECOMMENDED_ROUTE,
  type EgyptLandmarkId,
} from '../../data/egyptWorld';
import { getEgyptDiscoverMissionMeta } from '../../data/egyptDiscover';
import { getEgyptBuildMissionMeta } from '../../data/egyptBuild';
import {
  EgyptLandmarkBadgeSVG,
  EgyptSkylineRibbonSVG,
} from './EgyptSvgArtwork';
import { EgyptInstructionJournal } from './EgyptInstructionJournal';

interface EgyptExpeditionGuideModalProps {
  isOpen: boolean;
  language: AppLanguage;
  appearance: ResolvedAppearance;
  exploredLandmarkIds: EgyptLandmarkId[];
  guidedLandmarkId: EgyptLandmarkId | null;
  initialLandmarkId?: EgyptLandmarkId;
  discoverStarted?: boolean;
  completedDiscoverIds?: EgyptLandmarkId[];
  nextDiscoverLandmarkId?: EgyptLandmarkId | null;
  discoverCompleted?: boolean;
  buildUnlocked?: boolean;
  buildStarted?: boolean;
  completedBuildIds?: EgyptLandmarkId[];
  nextBuildLandmarkId?: EgyptLandmarkId | null;
  buildCompleted?: boolean;
  buildJournal?: EgyptInstructionJournalRecord[];
  onStartDiscovery?: () => void;
  onLaunchDiscoverGame?: (id: EgyptLandmarkId) => void;
  onOpenDiscoverCelebration?: () => void;
  onStartBuild?: () => void;
  onLaunchBuildGame?: (id: EgyptLandmarkId) => void;
  onOpenBuildCelebration?: () => void;
  onGuideToLandmark: (id: EgyptLandmarkId) => void;
  onClearGuide: () => void;
  onAutoWalkToLandmark?: (id: EgyptLandmarkId) => void;
  onQuickTravelToLandmark?: (id: EgyptLandmarkId) => void;
  onClose: () => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'reward') => void;
}

export function EgyptExpeditionGuideModal({
  isOpen,
  language,
  appearance,
  exploredLandmarkIds,
  guidedLandmarkId,
  initialLandmarkId,
  discoverStarted = false,
  completedDiscoverIds = [],
  nextDiscoverLandmarkId = null,
  discoverCompleted = false,
  buildUnlocked = false,
  buildStarted = false,
  completedBuildIds = [],
  nextBuildLandmarkId = null,
  buildCompleted = false,
  buildJournal = [],
  onStartDiscovery,
  onLaunchDiscoverGame,
  onOpenDiscoverCelebration,
  onStartBuild,
  onLaunchBuildGame,
  onOpenBuildCelebration,
  onGuideToLandmark,
  onClearGuide,
  onAutoWalkToLandmark,
  onQuickTravelToLandmark,
  onClose,
  onPlaySfx,
}: EgyptExpeditionGuideModalProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';

  const [activeTab, setActiveTab] = useState<'route' | 'sites' | 'stages' | 'journal'>(
    initialLandmarkId ? 'sites' : 'route',
  );
  const [selectedId, setSelectedId] = useState<EgyptLandmarkId>(
    initialLandmarkId ?? EGYPT_RECOMMENDED_ROUTE[0],
  );
  const [hasSpokenSite, setHasSpokenSite] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (initialLandmarkId) {
      setSelectedId(initialLandmarkId);
      setActiveTab('sites');
    } else {
      setActiveTab('route');
    }
    setHasSpokenSite(false);
  }, [isOpen, initialLandmarkId]);

  useEffect(() => {
    if (!isOpen) return;
    const stopSpeech = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        stopSpeech();
        onPlaySfx('click');
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      stopSpeech();
    };
  }, [isOpen, onClose, onPlaySfx]);

  if (!isOpen) return null;

  const orderedLandmarks = EGYPT_RECOMMENDED_ROUTE.map(
    (id) => EGYPT_LANDMARKS.find((lm) => lm.id === id)!,
  ).filter(Boolean);

  const recommendedNext =
    orderedLandmarks.find((lm) => !exploredLandmarkIds.includes(lm.id)) ?? null;

  const activeLandmark =
    orderedLandmarks.find((lm) => lm.id === selectedId) ?? orderedLandmarks[0];
  const recommendedGuide = EGYPT_NPC_DIALOGUES[activeLandmark.recommendedNpcId];

  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const speakEnglish = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.94;
    u.pitch = 1.02;
    window.speechSynthesis.speak(u);
    setHasSpokenSite(true);
  };

  const visitedCount = exploredLandmarkIds.length;
  const totalCount = orderedLandmarks.length;
  const completedCount = completedDiscoverIds.length;
  const completedBuildCount = completedBuildIds.length;

  const isStationPlayable = (landmarkId: EgyptLandmarkId): boolean => {
    if (!discoverStarted) return false;
    return (
      discoverCompleted ||
      completedDiscoverIds.includes(landmarkId) ||
      nextDiscoverLandmarkId === landmarkId
    );
  };

  const isBuildStationPlayable = (landmarkId: EgyptLandmarkId): boolean => {
    if (!buildUnlocked || !buildStarted) return false;
    return (
      buildCompleted ||
      completedBuildIds.includes(landmarkId) ||
      nextBuildLandmarkId === landmarkId
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="egypt-expedition-guide-title"
      className={`fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 ${
        isNight ? 'bg-[#09132E]/78' : 'bg-[#1D2436]/38'
      }`}
    >
      <div
        className={`flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border shadow-2xl ${
          isNight
            ? 'border-[#E7B43C]/45 bg-[#121D36] text-[#F8FAFC]'
            : 'border-[#E7B43C]/45 bg-[#FFFDF8] text-[#1E293B]'
        }`}
      >
        {/* Header with Giza Skyline Silhouette */}
        <div
          className={`relative overflow-hidden border-b px-5 py-4 ${
            isNight
              ? 'border-white/12 bg-gradient-to-r from-[#1E2949] to-[#113344]'
              : 'border-[#FDE68A] bg-gradient-to-r from-[#FEF3C7] to-[#CCFBF1]'
          }`}
        >
          <EgyptSkylineRibbonSVG
            className={`pointer-events-none absolute right-2 bottom-0 h-12 w-60 ${
              isNight ? 'text-[#E7B43C]' : 'text-[#B45309]'
            }`}
          />

          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E7B43C] text-[#131E31] shadow-sm">
                <Compass className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h2
                  id="egypt-expedition-guide-title"
                  className="font-display text-lg sm:text-xl font-extrabold truncate"
                >
                  {copy.egyptGuideTitle}
                </h2>
                <p
                  className={`text-xs font-semibold ${
                    isNight ? 'text-[#FDE68A]' : 'text-[#92400E]'
                  }`}
                >
                  {copy.egyptGuideSubtitle} ·{' '}
                  <span className="font-mono-num font-extrabold">
                    {visitedCount}/{totalCount}
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                stopAudio();
                onPlaySfx('click');
                onClose();
              }}
              aria-label={copy.closeSettings}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors cursor-pointer ${
                isNight
                  ? 'border-white/15 bg-white/10 text-white hover:bg-white/20'
                  : 'border-[#B45309]/25 bg-white/85 text-[#1E293B] hover:bg-white'
              }`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="relative z-10 mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onPlaySfx('select');
                setActiveTab('route');
              }}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'route'
                  ? 'bg-[#E7B43C] text-[#131E31] shadow-sm'
                  : isNight
                    ? 'bg-white/10 text-[#CBD5E1] hover:bg-white/15'
                    : 'bg-white/80 text-[#334155] hover:bg-white'
              }`}
            >
              <Route className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{copy.egyptGuideTabRoute}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onPlaySfx('select');
                setActiveTab('sites');
              }}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'sites'
                  ? 'bg-[#E7B43C] text-[#131E31] shadow-sm'
                  : isNight
                    ? 'bg-white/10 text-[#CBD5E1] hover:bg-white/15'
                    : 'bg-white/80 text-[#334155] hover:bg-white'
              }`}
            >
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{copy.egyptGuideTabSites}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onPlaySfx('select');
                setActiveTab('stages');
              }}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'stages'
                  ? 'bg-[#E7B43C] text-[#131E31] shadow-sm'
                  : isNight
                    ? 'bg-white/10 text-[#CBD5E1] hover:bg-white/15'
                    : 'bg-white/80 text-[#334155] hover:bg-white'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{copy.egyptGuideTabStages}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onPlaySfx('select');
                setActiveTab('journal');
              }}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'journal'
                  ? 'bg-[#0D9488] text-white shadow-sm'
                  : isNight
                    ? 'bg-white/10 text-[#CBD5E1] hover:bg-white/15'
                    : 'bg-white/80 text-[#334155] hover:bg-white'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {copy.egyptJournalTabLabel}
                {buildJournal.length > 0 ? ` (${buildJournal.length})` : ''}
              </span>
            </button>

            {guidedLandmarkId && (
              <button
                type="button"
                onClick={() => {
                  onPlaySfx('click');
                  onClearGuide();
                }}
                className={`ml-auto inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer ${
                  isNight
                    ? 'border-[#F59E0B]/40 bg-[#451A03]/45 text-[#FDE68A] hover:bg-[#451A03]/70'
                    : 'border-[#F59E0B]/50 bg-[#FFFBEB] text-[#92400E] hover:bg-[#FEF3C7]'
                }`}
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{copy.egyptGuideStopGuideButton}</span>
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'route' ? (
            <>
              <div
                className={`rounded-2xl border p-4 ${
                  isNight
                    ? 'border-[#E7B43C]/30 bg-[#182544]'
                    : 'border-[#FDE68A] bg-[#FFFBEB]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display text-sm font-extrabold">
                      {copy.egyptGuideRouteTitle}
                    </h3>
                    <p
                      className={`mt-1 text-xs leading-relaxed ${
                        isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'
                      }`}
                    >
                      {copy.egyptGuideRouteDesc}
                    </p>
                  </div>
                  <span
                    className={`rounded-xl px-2.5 py-1 font-mono-num text-xs font-extrabold ${
                      isNight
                        ? 'bg-[#E7B43C]/20 text-[#FDE68A]'
                        : 'bg-[#FEF3C7] text-[#92400E]'
                    }`}
                  >
                    {discoverCompleted && buildUnlocked
                      ? `BUILD ${completedBuildCount}/${totalCount}`
                      : `DISCOVER ${completedCount}/${totalCount}`}
                  </span>
                </div>
                <p
                  className={`mt-2.5 text-[11px] font-bold ${
                    isNight ? 'text-[#2DD4BF]' : 'text-[#0F766E]'
                  }`}
                >
                  {discoverCompleted && buildUnlocked
                    ? copy.egyptBuildZeroXpStationNote
                    : copy.egyptGuideZeroXpExplorationNote}
                </p>

                {!discoverStarted && onStartDiscovery && (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-black/10 dark:border-white/10">
                    <span className="text-xs font-bold">
                      {copy.egyptDiscoverLockedNeedLayla}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onPlaySfx('select');
                        onStartDiscovery();
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#E7B43C] px-3.5 py-1.5 text-xs font-extrabold text-[#131E31] hover:bg-[#F2C66D] cursor-pointer"
                    >
                      <Play className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{copy.egyptDiscoverPlayMissionButton}</span>
                    </button>
                  </div>
                )}

                {discoverCompleted && buildUnlocked && !buildStarted && onStartBuild && (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-black/10 dark:border-white/10">
                    <span className="text-xs font-bold">
                      {copy.egyptBuildLockedNeedLayla}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onPlaySfx('select');
                        onStartBuild();
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#E7B43C] px-3.5 py-1.5 text-xs font-extrabold text-[#131E31] hover:bg-[#F2C66D] cursor-pointer"
                    >
                      <Play className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{copy.egyptBuildPlayWorkshopButton}</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2.5">
                {orderedLandmarks.map((lm) => {
                  const visited = exploredLandmarkIds.includes(lm.id);
                  const missionCompleted = completedDiscoverIds.includes(lm.id);
                  const buildStationCompleted = completedBuildIds.includes(lm.id);
                  const playable = isStationPlayable(lm.id);
                  const buildPlayable = isBuildStationPlayable(lm.id);
                  const isNext =
                    (discoverCompleted && buildStarted && nextBuildLandmarkId === lm.id) ||
                    (!discoverCompleted && discoverStarted && nextDiscoverLandmarkId === lm.id) ||
                    (!discoverStarted && recommendedNext?.id === lm.id);
                  const isGuided = guidedLandmarkId === lm.id;

                  return (
                    <div
                      key={lm.id}
                      className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3.5 ${
                        isGuided
                          ? isNight
                            ? 'border-[#F59E0B]/70 bg-[#2C2214]'
                            : 'border-[#F59E0B] bg-[#FFFBEB]'
                          : isNight
                            ? 'border-white/12 bg-[#16223F]'
                            : 'border-[#E2E8F0] bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <EgyptLandmarkBadgeSVG
                          landmarkId={lm.id}
                          className="h-12 w-16 shrink-0 rounded-xl shadow-sm"
                        />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="rounded bg-[#E7B43C]/20 px-1.5 py-0.5 font-mono-num text-[10px] font-extrabold text-[#B45309] dark:text-[#FDE68A]">
                              #{lm.order}
                            </span>
                            {lm.isSealedInPhase5A && (
                              <span className="inline-flex items-center gap-1 rounded bg-[#1E293B] px-1.5 py-0.5 text-[10px] font-extrabold text-[#FDE68A]">
                                <Lock className="h-2.5 w-2.5" aria-hidden="true" />
                                <span>{copy.egyptChamberSealedBadge}</span>
                              </span>
                            )}
                            {isNext && (
                              <span className="rounded bg-[#12B8B0] px-1.5 py-0.5 text-[10px] font-extrabold text-[#131E31]">
                                {copy.egyptGuideNextStopBadge}
                              </span>
                            )}
                            <span
                              className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                buildStationCompleted
                                  ? 'bg-[#10B981]/20 text-[#059669] dark:text-[#34D399]'
                                  : missionCompleted
                                    ? 'bg-[#10B981]/15 text-[#059669] dark:text-[#34D399]'
                                    : visited
                                      ? 'bg-[#0EA5E9]/15 text-[#0284C7] dark:text-[#7DD3FC]'
                                      : 'bg-black/5 text-[#64748B] dark:bg-white/10 dark:text-[#CBD5E1]'
                              }`}
                            >
                              {(buildStationCompleted || missionCompleted) && (
                                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                              )}
                              <span>
                                {buildStationCompleted
                                  ? copy.egyptBuildCompletedBadge
                                  : missionCompleted
                                    ? copy.egyptDiscoverCompletedBadge
                                    : visited
                                      ? copy.egyptGuideVisitedBadge
                                      : copy.egyptGuideNotVisitedBadge}
                              </span>
                            </span>
                          </div>
                          <h4 className="mt-1 font-display text-sm font-extrabold truncate">
                            {lm.title[language]}
                          </h4>
                          <p
                            className={`text-xs truncate ${
                              isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'
                            }`}
                          >
                            {lm.subtitle[language]}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                        {discoverCompleted && buildUnlocked && onLaunchBuildGame && buildPlayable && (
                          <button
                            type="button"
                            onClick={() => {
                              onPlaySfx('select');
                              onLaunchBuildGame(lm.id);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1 rounded-xl bg-[#0D9488] px-3 py-1.5 text-xs font-extrabold text-white hover:bg-[#0F766E] cursor-pointer"
                          >
                            <Gamepad2 className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>
                              {buildStationCompleted
                                ? copy.egyptBuildReviewWorkshopButton
                                : copy.egyptBuildPlayWorkshopButton}
                            </span>
                          </button>
                        )}

                        {onLaunchDiscoverGame && playable && (
                          <button
                            type="button"
                            onClick={() => {
                              onPlaySfx('select');
                              onLaunchDiscoverGame(lm.id);
                              onClose();
                            }}
                            className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-extrabold cursor-pointer ${
                              discoverCompleted && buildUnlocked
                                ? isNight
                                  ? 'border border-white/15 bg-white/10 text-[#CBD5E1] hover:bg-white/15'
                                  : 'border border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]'
                                : 'bg-[#0D9488] text-white hover:bg-[#0F766E]'
                            }`}
                          >
                            <Gamepad2 className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>
                              {missionCompleted
                                ? copy.egyptDiscoverReviewMissionButton
                                : copy.egyptDiscoverPlayMissionButton}
                            </span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            onPlaySfx('select');
                            setSelectedId(lm.id);
                            setActiveTab('sites');
                          }}
                          className={`rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                            isNight
                              ? 'border-white/15 bg-white/8 text-[#E2E8F0] hover:bg-white/15'
                              : 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          {copy.egyptGuideTabSites}
                        </button>

                        {onAutoWalkToLandmark && (
                          <button
                            type="button"
                            onClick={() => {
                              onPlaySfx('select');
                              onAutoWalkToLandmark(lm.id);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1 rounded-xl bg-[#12B8B0] px-3 py-1.5 text-xs font-extrabold text-[#131E31] hover:bg-[#14C9BF] cursor-pointer"
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
                            className="inline-flex items-center gap-1 rounded-xl bg-[#E7B43C] px-3 py-1.5 text-xs font-extrabold text-[#131E31] hover:bg-[#F2C66D] cursor-pointer"
                          >
                            <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{copy.navQuickTravelButton}</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            onPlaySfx('select');
                            onGuideToLandmark(lm.id);
                            onClose();
                          }}
                          className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-extrabold cursor-pointer ${
                            isGuided
                              ? 'border-[#F59E0B] bg-[#F59E0B] text-[#131E31]'
                              : isNight
                                ? 'border-white/15 bg-white/10 text-[#FDE68A]'
                                : 'border-[#E7B43C] bg-[#FFFBEB] text-[#92400E]'
                          }`}
                        >
                          <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            {isGuided
                              ? copy.egyptGuideGuidingActiveButton
                              : copy.egyptGuideGuideMeButton}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : activeTab === 'sites' ? (
            <>
              <div className="flex flex-wrap gap-1.5">
                {orderedLandmarks.map((lm) => {
                  const selected = lm.id === activeLandmark.id;
                  const visited = exploredLandmarkIds.includes(lm.id);
                  return (
                    <button
                      key={lm.id}
                      type="button"
                      onClick={() => {
                        onPlaySfx('select');
                        setSelectedId(lm.id);
                        setHasSpokenSite(false);
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                        selected
                          ? 'border-[#E7B43C] bg-[#E7B43C] text-[#131E31]'
                          : isNight
                            ? 'border-white/15 bg-[#16223F] text-[#CBD5E1] hover:bg-[#1E2E52]'
                            : 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      {visited && (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      )}
                      <span>
                        #{lm.order} {lm.title[language]}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div
                className={`rounded-2xl border p-4 space-y-3.5 ${
                  isNight
                    ? 'border-white/15 bg-[#16223F]'
                    : 'border-[#E2E8F0] bg-white'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <EgyptLandmarkBadgeSVG
                      landmarkId={activeLandmark.id}
                      className="h-16 w-20 shrink-0 rounded-xl shadow-sm"
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-extrabold text-[#12B8B0]">
                        {activeLandmark.zoneBadge[language]}
                      </p>
                      <h3 className="font-display text-lg font-extrabold">
                        {activeLandmark.title[language]}
                      </h3>
                      <p
                        className={`text-xs ${
                          isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'
                        }`}
                      >
                        {activeLandmark.subtitle[language]}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        speakEnglish(
                          `${activeLandmark.title.en}. ${activeLandmark.description.en}`,
                        )
                      }
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                        isNight
                          ? 'border-white/15 bg-white/10 text-white hover:bg-white/20'
                          : 'border-[#FDE68A] bg-[#FFFBEB] text-[#92400E] hover:bg-[#FEF3C7]'
                      }`}
                    >
                      <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {hasSpokenSite
                          ? copy.egyptReplayDialogue
                          : copy.egyptListenDialogue}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={stopAudio}
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-bold cursor-pointer ${
                        isNight
                          ? 'border-white/15 bg-white/8 text-[#CBD5E1] hover:bg-white/15'
                          : 'border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <Square className="h-3 w-3" aria-hidden="true" />
                      <span>{copy.egyptStopAudio}</span>
                    </button>
                  </div>
                </div>

                {activeLandmark.isSealedInPhase5A && (
                  <div
                    className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-bold ${
                      isNight
                        ? 'border-[#E7B43C]/45 bg-[#2A2013] text-[#FDE68A]'
                        : 'border-[#F59E0B] bg-[#FFFBEB] text-[#92400E]'
                    }`}
                  >
                    <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{copy.egyptChamberSealedBanner}</span>
                  </div>
                )}

                <p className="text-sm leading-relaxed">
                  {activeLandmark.description[language]}
                </p>

                <div
                  className={`rounded-xl border p-3 ${
                    isNight
                      ? 'border-[#12B8B0]/35 bg-[#102A33]'
                      : 'border-[#99F6E4] bg-[#F0FDFA]'
                  }`}
                >
                  <p className="text-[11px] font-extrabold text-[#12B8B0]">
                    {copy.egyptGuideLanguageFocusLabel}
                  </p>
                  <p className="mt-1 text-xs font-semibold">
                    {activeLandmark.languageFocus[language]}
                  </p>
                </div>

                <div
                  className={`rounded-xl border p-3 ${
                    isNight
                      ? 'border-white/10 bg-[#1B2848]'
                      : 'border-[#E2E8F0] bg-[#F8FAFC]'
                  }`}
                >
                  <p className="text-[11px] font-extrabold text-[#D97706] dark:text-[#FBBF24]">
                    {activeLandmark.isSealedInPhase5A
                      ? copy.egyptFictionalVsHistoricalLabel
                      : copy.egyptGuideCulturalNoteLabel}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed">
                    {activeLandmark.culturalNote[language]}
                  </p>
                </div>

                <div
                  className={`rounded-xl border p-3 text-xs ${
                    isNight
                      ? 'border-[#E7B43C]/30 bg-[#1D253E] text-[#E2E8F0]'
                      : 'border-[#FDE68A] bg-[#FFFBEB] text-[#78350F]'
                  }`}
                >
                  <p className="font-bold">
                    {recommendedGuide.name} ({recommendedGuide.role[language]})
                  </p>
                  <p className="mt-1 leading-relaxed">
                    {activeLandmark.futurePreviewNote[language]}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {discoverCompleted && buildUnlocked && onLaunchBuildGame && isBuildStationPlayable(activeLandmark.id) ? (
                    <button
                      type="button"
                      onClick={() => {
                        onPlaySfx('select');
                        onLaunchBuildGame(activeLandmark.id);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0D9488] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#0F766E] cursor-pointer"
                    >
                      <Gamepad2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {completedBuildIds.includes(activeLandmark.id)
                          ? copy.egyptBuildReviewWorkshopButton
                          : copy.egyptBuildPlayWorkshopButton}
                      </span>
                    </button>
                  ) : discoverCompleted && buildUnlocked && !buildStarted && onStartBuild ? (
                    <button
                      type="button"
                      onClick={() => {
                        onPlaySfx('select');
                        onStartBuild();
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#E7B43C] px-4 py-2 text-xs font-extrabold text-[#131E31] hover:bg-[#F2C66D] cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{copy.egyptBuildPlayWorkshopButton}</span>
                    </button>
                  ) : discoverCompleted && buildUnlocked ? (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold ${
                        isNight
                          ? 'border-white/15 bg-white/5 text-[#CBD5E1]'
                          : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#64748B]'
                      }`}
                    >
                      <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {copy.egyptBuildLockedPrevious}{' '}
                        {nextBuildLandmarkId
                          ? getEgyptBuildMissionMeta(nextBuildLandmarkId).title[language]
                          : ''}
                      </span>
                    </span>
                  ) : null}

                  {onLaunchDiscoverGame && isStationPlayable(activeLandmark.id) ? (
                    <button
                      type="button"
                      onClick={() => {
                        onPlaySfx('select');
                        onLaunchDiscoverGame(activeLandmark.id);
                        onClose();
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-extrabold cursor-pointer ${
                        discoverCompleted && buildUnlocked
                          ? isNight
                            ? 'border border-white/15 bg-white/10 text-[#CBD5E1] hover:bg-white/15'
                            : 'border border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]'
                          : 'bg-[#0D9488] text-white hover:bg-[#0F766E]'
                      }`}
                    >
                      <Gamepad2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {completedDiscoverIds.includes(activeLandmark.id)
                          ? copy.egyptDiscoverReviewMissionButton
                          : copy.egyptDiscoverPlayMissionButton}
                      </span>
                    </button>
                  ) : !discoverCompleted ? (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold ${
                        isNight
                          ? 'border-white/15 bg-white/5 text-[#CBD5E1]'
                          : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#64748B]'
                      }`}
                    >
                      <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {!discoverStarted
                          ? copy.egyptDiscoverLockedNeedLayla
                          : copy.egyptDiscoverLockedPrevious}
                      </span>
                    </span>
                  ) : null}

                  {onAutoWalkToLandmark && (
                    <button
                      type="button"
                      onClick={() => {
                        onPlaySfx('select');
                        onAutoWalkToLandmark(activeLandmark.id);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#12B8B0] px-4 py-2 text-xs font-extrabold text-[#131E31] hover:bg-[#14C9BF] cursor-pointer"
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
                        onQuickTravelToLandmark(activeLandmark.id);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#E7B43C] px-4 py-2 text-xs font-extrabold text-[#131E31] hover:bg-[#F2C66D] cursor-pointer"
                    >
                      <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{copy.navQuickTravelButton}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('select');
                      onGuideToLandmark(activeLandmark.id);
                      onClose();
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold cursor-pointer ${
                      isNight
                        ? 'border-white/15 bg-white/10 text-[#FDE68A]'
                        : 'border-[#E7B43C] bg-white text-[#92400E]'
                    }`}
                  >
                    <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.egyptGuideGuideMeButton}</span>
                  </button>
                </div>
              </div>
            </>
          ) : activeTab === 'journal' ? (
            <EgyptInstructionJournal
              language={language}
              isNight={isNight}
              entries={buildJournal}
              showBlueprintPreview
              onPlaySfx={onPlaySfx}
            />
          ) : (
            <div className="space-y-3">
              <div
                className={`flex items-start gap-2.5 rounded-2xl border p-4 text-xs font-semibold ${
                  isNight
                    ? 'border-[#12B8B0]/40 bg-[#102A33] text-[#CCFBF1]'
                    : 'border-[#99F6E4] bg-[#F0FDFA] text-[#0F766E]'
                }`}
              >
                <Info className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{copy.egyptGuideFutureStagesNote}</span>
              </div>

              {/* Active Stage 1 DISCOVER Card */}
              <div
                className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 ${
                  isNight
                    ? 'border-[#12B8B0]/45 bg-[#102A33]'
                    : 'border-[#0D9488]/35 bg-[#F0FDFA]'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-display text-sm font-extrabold">
                      {copy.egyptGuideStageDiscoverTitle}
                    </h4>
                    <span className="rounded-lg bg-[#0D9488] px-2 py-0.5 text-[10px] font-extrabold text-white">
                      {discoverCompleted
                        ? `${copy.egyptDiscoverCompletedBadge} · +50 XP`
                        : `${completedCount}/${totalCount}`}
                    </span>
                  </div>
                  <p
                    className={`mt-1 text-xs leading-relaxed ${
                      isNight ? 'text-[#CBD5E1]' : 'text-[#334155]'
                    }`}
                  >
                    {copy.egyptGuideStageDiscoverDesc}
                  </p>
                </div>

                {discoverCompleted && onOpenDiscoverCelebration ? (
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('select');
                      onOpenDiscoverCelebration();
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#E7B43C] px-3.5 py-2 text-xs font-extrabold text-[#131E31] hover:bg-[#F2C66D] cursor-pointer shrink-0"
                  >
                    <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.egyptDiscoverCompletedBadge}</span>
                  </button>
                ) : discoverStarted && nextDiscoverLandmarkId && onLaunchDiscoverGame ? (
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('select');
                      onLaunchDiscoverGame(nextDiscoverLandmarkId);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#0D9488] px-3.5 py-2 text-xs font-extrabold text-white hover:bg-[#0F766E] cursor-pointer shrink-0"
                  >
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{getEgyptDiscoverMissionMeta(nextDiscoverLandmarkId).title[language]}</span>
                  </button>
                ) : onStartDiscovery ? (
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('select');
                      onStartDiscovery();
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#E7B43C] px-3.5 py-2 text-xs font-extrabold text-[#131E31] hover:bg-[#F2C66D] cursor-pointer shrink-0"
                  >
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.egyptDiscoverPlayMissionButton}</span>
                  </button>
                ) : null}
              </div>

              {/* Active Stage 2 BUILD Card */}
              <div
                className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 ${
                  buildUnlocked
                    ? isNight
                      ? 'border-[#E7B43C]/45 bg-[#1B2542]'
                      : 'border-[#F59E0B]/45 bg-[#FFFBEB]'
                    : isNight
                      ? 'border-white/12 bg-[#16223F]'
                      : 'border-[#E2E8F0] bg-white'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-display text-sm font-extrabold">
                      {copy.egyptGuideStageBuildTitle}
                    </h4>
                    <span
                      className={`rounded-lg px-2 py-0.5 text-[10px] font-extrabold ${
                        buildCompleted
                          ? 'bg-[#059669] text-white'
                          : buildUnlocked
                            ? 'bg-[#E7B43C] text-[#131E31]'
                            : 'bg-black/10 text-[#64748B] dark:bg-white/10 dark:text-[#94A3B8]'
                      }`}
                    >
                      {buildCompleted
                        ? `${copy.egyptBuildCompletedBadge} · +50 XP`
                        : buildUnlocked
                          ? `${completedBuildCount}/${totalCount}`
                          : copy.worldMapStatusLocked}
                    </span>
                  </div>
                  <p
                    className={`mt-1 text-xs leading-relaxed ${
                      isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'
                    }`}
                  >
                    {copy.egyptGuideStageBuildDesc}
                  </p>
                </div>

                {!buildUnlocked ? (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-extrabold whitespace-nowrap shrink-0 ${
                      isNight
                        ? 'border-white/15 bg-white/8 text-[#94A3B8]'
                        : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#64748B]'
                    }`}
                  >
                    <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.worldMapStatusLocked}</span>
                  </span>
                ) : buildCompleted && onOpenBuildCelebration ? (
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('select');
                      onOpenBuildCelebration();
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#E7B43C] px-3.5 py-2 text-xs font-extrabold text-[#131E31] hover:bg-[#F2C66D] cursor-pointer shrink-0"
                  >
                    <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.egyptBuildCompletedBadge}</span>
                  </button>
                ) : buildStarted && nextBuildLandmarkId && onLaunchBuildGame ? (
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('select');
                      onLaunchBuildGame(nextBuildLandmarkId);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#0D9488] px-3.5 py-2 text-xs font-extrabold text-white hover:bg-[#0F766E] cursor-pointer shrink-0"
                  >
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{getEgyptBuildMissionMeta(nextBuildLandmarkId).title[language]}</span>
                  </button>
                ) : onStartBuild ? (
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('select');
                      onStartBuild();
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#E7B43C] px-3.5 py-2 text-xs font-extrabold text-[#131E31] hover:bg-[#F2C66D] cursor-pointer shrink-0"
                  >
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.egyptBuildPlayWorkshopButton}</span>
                  </button>
                ) : null}
              </div>

              {[
                {
                  key: 'practice',
                  title: copy.egyptGuideStagePracticeTitle,
                  desc: copy.egyptGuideStagePracticeDesc,
                  badge: copy.egyptGuideLockedFuturePhase,
                  highlight: buildCompleted,
                },
                {
                  key: 'perform',
                  title: copy.egyptGuideStagePerformTitle,
                  desc: copy.egyptGuideStagePerformDesc,
                  badge: copy.egyptGuideLockedFuturePhase,
                  highlight: false,
                },
              ].map((stage) => (
                <div
                  key={stage.key}
                  className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 ${
                    isNight
                      ? 'border-white/12 bg-[#16223F]'
                      : 'border-[#E2E8F0] bg-white'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display text-sm font-extrabold">
                      {stage.title}
                    </h4>
                    <p
                      className={`mt-1 text-xs leading-relaxed ${
                        isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'
                      }`}
                    >
                      {stage.desc}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-extrabold whitespace-nowrap shrink-0 ${
                      stage.highlight
                        ? isNight
                          ? 'border-[#E7B43C]/45 bg-[#2A2013] text-[#FDE68A]'
                          : 'border-[#F59E0B]/40 bg-[#FFFBEB] text-[#92400E]'
                        : isNight
                          ? 'border-white/15 bg-white/8 text-[#94A3B8]'
                          : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#64748B]'
                    }`}
                  >
                    <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{stage.badge}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
