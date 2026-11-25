import React, { useEffect } from 'react';
import {
  CheckCircle2,
  Compass,
  Footprints,
  MapPin,
  Navigation,
  Sparkles,
  UserRound,
  X,
  Zap,
} from 'lucide-react';
import type { AppLanguage } from '../../types/game';
import { GAME_COPY } from '../../data/i18n';
import type {
  ActiveAutoWalkRequest,
  NavDestinationItem,
  NextMissionResolution,
} from '../../utils/worldNavigation';
import type { NavStatusBanner } from '../../utils/useWorldNavigation';

interface SmartNavigationHudProps {
  language: AppLanguage;
  destinations: NavDestinationItem[];
  nextMission: NextMissionResolution;
  autoWalkRequest: ActiveAutoWalkRequest | null;
  activeDestinationId: string | null;
  statusBanner: NavStatusBanner | null;
  isPlacesOpen: boolean;
  setIsPlacesOpen: React.Dispatch<React.SetStateAction<boolean>>;
  completedIds?: string[];
  visitedIds?: string[];
  quickTravelFlashActive: boolean;
  onGoToNextMission: () => void;
  onStartAutoWalk: (targetId: string) => void;
  onQuickTravel: (targetId: string) => void;
  onCancelWalk: (reason?: 'user' | 'clear') => void;
  onGuideOnly?: (targetId: string) => void;
  accentTone?: 'teal' | 'amber' | 'emerald' | 'indigo';
}

const TONE_CLASSES: Record<
  NonNullable<SmartNavigationHudProps['accentTone']>,
  { primaryBtn: string; activeRing: string; guideBtn: string }
> = {
  teal: {
    primaryBtn:
      'bg-teal-600 hover:bg-teal-700 dark:hover:bg-teal-500 text-white border-teal-500/70 shadow-md',
    activeRing:
      'border-[#0D9488]/45 bg-[#F7FBFF]/95 text-[#20304A] dark:border-teal-400/55 dark:bg-[#152445]/95 dark:text-[#F7F9FC]',
    guideBtn:
      'bg-[#F0FDFA] hover:bg-[#CCFBF1] border-[#0D9488]/30 text-[#0F766E] dark:bg-[#132E3B] dark:hover:bg-[#193D4D] dark:border-teal-400/40 dark:text-teal-200',
  },
  amber: {
    primaryBtn:
      'bg-amber-600 hover:bg-amber-700 dark:hover:bg-amber-500 text-white border-amber-500/70 shadow-md',
    activeRing:
      'border-amber-500/45 bg-[#FFFDF7]/95 text-[#20304A] dark:border-amber-400/55 dark:bg-[#1D2542]/95 dark:text-[#F7F9FC]',
    guideBtn:
      'bg-[#FFFBEB] hover:bg-[#FEF3C7] border-[#D97706]/30 text-[#92400E] dark:bg-[#2A263D] dark:hover:bg-[#36304E] dark:border-amber-400/40 dark:text-amber-200',
  },
  emerald: {
    primaryBtn:
      'bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white border-emerald-500/70 shadow-md',
    activeRing:
      'border-emerald-500/45 bg-[#F7FDF9]/95 text-[#20304A] dark:border-emerald-400/55 dark:bg-[#142742]/95 dark:text-[#F7F9FC]',
    guideBtn:
      'bg-[#ECFDF5] hover:bg-[#D1FAE5] border-[#059669]/30 text-[#065F46] dark:bg-[#142F3D] dark:hover:bg-[#1B3E4F] dark:border-emerald-400/40 dark:text-emerald-200',
  },
  indigo: {
    primaryBtn:
      'bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white border-indigo-500/70 shadow-md',
    activeRing:
      'border-indigo-500/45 bg-[#F8FAFF]/95 text-[#20304A] dark:border-indigo-400/55 dark:bg-[#172347]/95 dark:text-[#F7F9FC]',
    guideBtn:
      'bg-[#EEF2FF] hover:bg-[#E0E7FF] border-[#4F46E5]/30 text-[#3730A3] dark:bg-[#1E2A54] dark:hover:bg-[#27366B] dark:border-indigo-400/45 dark:text-indigo-200',
  },
};

export const SmartNavigationHud: React.FC<SmartNavigationHudProps> = ({
  language,
  destinations,
  nextMission,
  autoWalkRequest,
  activeDestinationId,
  statusBanner,
  isPlacesOpen,
  setIsPlacesOpen,
  completedIds = [],
  visitedIds = [],
  quickTravelFlashActive,
  onGoToNextMission,
  onStartAutoWalk,
  onQuickTravel,
  onCancelWalk,
  onGuideOnly,
  accentTone = 'teal',
}) => {
  const copy = GAME_COPY[language];
  const tone = TONE_CLASSES[accentTone];

  const isNextActionable =
    nextMission.status === 'actionable' && nextMission.targetId !== null;
  const isNextDisabledNote =
    nextMission.status === 'locked' || nextMission.status === 'none';

  useEffect(() => {
    if (!isPlacesOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        setIsPlacesOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlacesOpen, setIsPlacesOpen]);

  return (
    <>
      {quickTravelFlashActive && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-25 pointer-events-none bg-cyan-100/25 transition-opacity duration-300"
        />
      )}

      {/* Anchored top-right under main HUD header so bottom-left joystick & bottom-right interact remain clear */}
      <div className="fixed top-[6.25rem] sm:top-[5.25rem] right-3 sm:right-5 z-20 flex flex-col items-end gap-2 max-w-[calc(100vw-1.5rem)] pointer-events-none">
        <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onGoToNextMission}
            disabled={isNextDisabledNote}
            data-testid="nav-next-mission-btn"
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed ${
              isNextActionable
                ? tone.primaryBtn
                : 'bg-[#FFFBEB]/95 hover:bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]/40 shadow-[0_6px_16px_rgba(32,48,74,0.1)] dark:bg-[#1A264A]/95 dark:hover:bg-[#23325E] dark:text-[#FDE68A] dark:border-[#F2C66D]/45 dark:shadow-lg'
            }`}
            title={nextMission.message[language]}
          >
            <Compass className="w-4 h-4 shrink-0" />
            <span>{copy.navGoToNextMission}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPlacesOpen((prev) => !prev)}
            data-testid="nav-places-toggle-btn"
            aria-expanded={isPlacesOpen}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#FFFDF8]/95 hover:bg-white text-[#20304A] border border-[#20304A]/15 shadow-[0_6px_18px_rgba(32,48,74,0.12)] dark:bg-[#172546]/95 dark:hover:bg-[#1F325C] dark:text-[#F7F9FC] dark:border-white/20 dark:shadow-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-[#0284C7] dark:text-cyan-300 shrink-0" />
            <span>{copy.navPlacesButton}</span>
          </button>
        </div>

        {/* Active Auto-Walk Status Bar */}
        {autoWalkRequest && (
          <div
            data-testid="nav-walking-banner"
            className={`pointer-events-auto rounded-xl border px-3 py-2 shadow-[0_8px_24px_rgba(32,48,74,0.14)] dark:shadow-xl flex flex-wrap items-center gap-2 max-w-xs sm:max-w-md ${tone.activeRing}`}
          >
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold min-w-0">
              <Footprints className="w-4 h-4 text-[#0D9488] dark:text-emerald-300 shrink-0" />
              <span className="truncate">
                {copy.navWalkingToPrefix}{' '}
                <span className="text-[#0369A1] dark:text-cyan-200">
                  {autoWalkRequest.targetTitle[language]}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                type="button"
                onClick={() => onQuickTravel(autoWalkRequest.targetId)}
                className="px-2 py-1 rounded-lg bg-[#E0F2FE] hover:bg-[#BAE6FD] border border-[#0284C7]/30 text-[#0369A1] dark:bg-cyan-500/20 dark:hover:bg-cyan-500/35 dark:border-cyan-300/60 dark:text-cyan-100 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <Zap className="w-3 h-3" />
                <span>{copy.navQuickTravelButton}</span>
              </button>
              <button
                type="button"
                onClick={() => onCancelWalk('user')}
                data-testid="nav-cancel-walk-btn"
                className="px-2.5 py-1 rounded-lg bg-[#FFE4E6] hover:bg-[#FECDD3] border border-[#E11D48]/30 text-[#BE123C] dark:bg-rose-500/25 dark:hover:bg-rose-500/40 dark:border-rose-300/60 dark:text-rose-100 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>{copy.navCancelWalkButton}</span>
              </button>
            </div>
          </div>
        )}

        {/* Arrival / Manual Override / Coming Soon / Unreachable Feedback */}
        {!autoWalkRequest && statusBanner && (
          <div
            data-testid="nav-status-banner"
            className={`pointer-events-auto rounded-xl border px-3 py-2 shadow-[0_8px_24px_rgba(32,48,74,0.14)] dark:shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-2 max-w-xs sm:max-w-md ${
              statusBanner.kind === 'error'
                ? 'bg-[#FFF1F2]/96 border-[#FDA4AF] text-[#9F1239] dark:bg-[#3A192A]/95 dark:border-rose-400/60 dark:text-rose-100'
                : statusBanner.kind === 'arrived'
                  ? 'bg-[#ECFDF5]/96 border-[#6EE7B7] text-[#065F46] dark:bg-[#11312D]/95 dark:border-emerald-400/60 dark:text-emerald-100'
                  : statusBanner.kind === 'info'
                    ? 'bg-[#FFFBEB]/96 border-[#FCD34D] text-[#92400E] dark:bg-[#2C2416]/95 dark:border-amber-400/60 dark:text-amber-100'
                    : 'bg-[#F7FBFF]/96 border-[#CBDCEB] text-[#20304A] dark:bg-[#172546]/95 dark:border-slate-500/60 dark:text-slate-100'
            }`}
          >
            {statusBanner.kind === 'arrived' ? (
              <CheckCircle2 className="w-4 h-4 text-[#059669] dark:text-emerald-300 shrink-0" />
            ) : statusBanner.kind === 'info' ? (
              <Sparkles className="w-4 h-4 text-[#D97706] dark:text-amber-300 shrink-0" />
            ) : (
              <Navigation className="w-4 h-4 text-[#0284C7] dark:text-slate-300 shrink-0" />
            )}
            <span className="leading-snug">{statusBanner.text}</span>
          </div>
        )}

        {/* Collapsible Smart Navigation Places Modal */}
        {isPlacesOpen && (
          <div
            role="region"
            aria-label={copy.navPlacesMenuTitle}
            data-testid="nav-places-panel"
            className="pointer-events-auto flex flex-col w-[min(21.5rem,calc(100vw-1.5rem))] sm:w-96 max-h-[min(24rem,calc(100dvh-14.5rem))] sm:max-h-[min(27.5rem,calc(100dvh-11rem))] rounded-2xl border border-[#20304A]/15 bg-[#F7FBFF]/96 text-[#20304A] shadow-[0_14px_34px_rgba(32,48,74,0.16)] dark:border-[#38BDF8]/25 dark:bg-[#152242]/96 dark:text-[#F7F9FC] dark:shadow-[0_18px_40px_rgba(8,14,32,0.55)] overflow-hidden"
          >
            {/* Compact Pinned Header */}
            <div className="shrink-0 px-3.5 py-2.5 border-b border-[#BAE6FD]/80 bg-[#E8F4FC] dark:border-white/10 dark:bg-[#1A2950] flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-extrabold text-[#20304A] dark:text-[#F7F9FC] flex items-center gap-1.5 leading-tight">
                  <Navigation className="w-4 h-4 text-[#0284C7] dark:text-cyan-300 shrink-0" />
                  <span className="truncate">{copy.navPlacesMenuTitle}</span>
                </div>
                <p className="text-[11px] text-[#394E6E] dark:text-[#C8D4E6] mt-0.5 leading-snug">
                  {copy.navPlacesMenuSubtitle}
                </p>
                <p className="text-[10px] text-[#94630E] dark:text-[#FCD34D] mt-0.5 font-semibold leading-tight">
                  {copy.navZeroRewardHint}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {activeDestinationId && (
                  <button
                    type="button"
                    onClick={() => onCancelWalk('clear')}
                    className="px-2 py-1 rounded-lg bg-white hover:bg-[#F0F7FC] border border-[#20304A]/15 text-[11px] font-bold text-[#394E6E] dark:bg-[#233561] dark:hover:bg-[#2C4278] dark:border-white/15 dark:text-[#E2E8F0] transition cursor-pointer"
                  >
                    {copy.navClearDestinationButton}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsPlacesOpen(false)}
                  aria-label={copy.scotlandCloseButton}
                  className="p-1.5 rounded-lg bg-white hover:bg-[#F0F7FC] border border-[#20304A]/15 text-[#394E6E] hover:text-[#20304A] dark:bg-[#233561] dark:hover:bg-[#2C4278] dark:border-white/15 dark:text-[#C8D4E6] dark:hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Smooth Scrollable Destination Cards */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain scroll-smooth p-2.5 space-y-2">
              {destinations.map((dest) => {
                const isNext = nextMission.targetId === dest.id;
                const isCompleted = completedIds.includes(dest.id);
                const isVisited = visitedIds.includes(dest.id);
                const isActiveDest = activeDestinationId === dest.id;

                return (
                  <div
                    key={dest.id}
                    className={`rounded-xl border p-2.5 transition ${
                      isActiveDest
                        ? 'bg-[#ECFEFF] border-[#0284C7]/65 shadow-xs dark:bg-[#17355B] dark:border-cyan-400/75'
                        : isNext
                          ? 'bg-[#FFFBEB] border-[#F59E0B]/55 dark:bg-[#222B4A] dark:border-amber-400/60'
                          : 'bg-[#F0F7FC] border-[#CBDCEB] hover:border-[#7DD3FC] hover:bg-[#E8F4FC] dark:bg-[#1B2B52]/90 dark:border-white/12 dark:hover:border-sky-400/45 dark:hover:bg-[#213462]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          {dest.kind === 'npc' ? (
                            <UserRound className="w-3.5 h-3.5 text-[#0284C7] dark:text-cyan-300 shrink-0" />
                          ) : (
                            <MapPin className="w-3.5 h-3.5 text-[#D97706] dark:text-amber-300 shrink-0" />
                          )}
                          <span className="text-xs sm:text-sm font-bold text-[#20304A] dark:text-[#F7F9FC] truncate">
                            {dest.title[language]}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-1 shrink-0">
                        {isNext && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]/40 dark:bg-amber-500/20 dark:text-amber-200 dark:border-amber-400/50">
                            {copy.navRecommendedBadge}
                          </span>
                        )}
                        {isCompleted ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D1FAE5] text-[#065F46] border border-[#10B981]/40 dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-400/50">
                            {copy.navStatusCompleted}
                          </span>
                        ) : isVisited ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E0F2FE] text-[#0369A1] border border-[#0284C7]/35 dark:bg-sky-500/20 dark:text-sky-200 dark:border-sky-400/50">
                            {copy.navStatusVisited}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#475569] border border-[#CBD5E1] dark:bg-[#14203D] dark:text-[#C8D4E6] dark:border-white/15">
                            {copy.navStatusOpen}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onStartAutoWalk(dest.id)}
                        className="min-h-[30px] px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 dark:hover:bg-teal-500 border border-teal-500/70 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
                      >
                        <Footprints className="w-3.5 h-3.5 shrink-0" />
                        <span>{copy.navAutoWalkButton}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onQuickTravel(dest.id)}
                        className="min-h-[30px] px-2.5 py-1 rounded-lg bg-[#E0F2FE] hover:bg-[#BAE6FD] border border-[#0284C7]/30 text-[#0369A1] dark:bg-[#1E355C] dark:hover:bg-[#274475] dark:border-cyan-400/45 dark:text-cyan-200 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 shrink-0" />
                        <span>{copy.navQuickTravelButton}</span>
                      </button>

                      {onGuideOnly && (
                        <button
                          type="button"
                          onClick={() => {
                            onGuideOnly(dest.id);
                            setIsPlacesOpen(false);
                          }}
                          className={`min-h-[30px] px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${tone.guideBtn}`}
                        >
                          {copy.navGuideOnlyButton}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
