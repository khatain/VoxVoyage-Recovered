import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Coins,
  Gem,
  Home,
  Lock,
  Moon,
  Music,
  RefreshCw,
  RotateCcw,
  Settings,
  Sparkles,
  Stamp,
  Sun,
} from 'lucide-react';
import type {
  AppearanceMode,
  AppLanguage,
  CountryId,
  CountryWorld,
  LocalProgressV1,
  ResolvedAppearance,
} from '../../types/game';
import { GAME_COPY } from '../../data/i18n';
import { SCOTLAND_MISSION_ID } from '../../data/scotlandWorld';
import { AUSTRALIA_MISSION_ID } from '../../data/australiaWorld';
import { EGYPT_DISCOVERY_ACTIVITY_ID } from '../../data/egyptDiscover';
import { EGYPT_BUILD_ACTIVITY_ID } from '../../data/egyptBuild';
import {
  canNavigateToCountry,
  canReplayCountry,
  getCountryReplayAttempt,
  getEgyptEffectiveEntry,
  hasActiveCountryReplay,
  isAustraliaMissionCompleted,
  isAustraliaPerformAwaitingReflection,
  isAustraliaUnlocked,
  isEgyptUnlocked,
  isJaipurMissionCompleted,
  isKenyaMissionCompleted,
  isScotlandMissionCompleted,
  isScotlandUnlocked,
} from '../../utils/progressStorage';
import { DioramaImage } from '../common/DioramaImage';
import { CountryFlagBadge } from '../common/CountryFlagBadge';
import { AvatarPortraitSVG } from '../avatar/AvatarPortraitSVG';

interface WorldMapOverlayProps {
  language: AppLanguage;
  countries: CountryWorld[];
  selectedCountry: CountryWorld;
  progress: LocalProgressV1;
  appearance: ResolvedAppearance;
  appearanceMode: AppearanceMode;
  musicPlaying: boolean;
  onSelectCountry: (id: CountryId) => void;
  onEnterWorld: () => void;
  onEnterAustraliaReflection?: () => void;
  onRequestReplayCountry: (id: CountryId) => void;
  onRequestRestartAttempt: (id: CountryId) => void;
  onOpenPassport: () => void;
  onOpenAvatar: () => void;
  onOpenSettings: () => void;
  onToggleQuickAppearance: () => void;
  onToggleMusic: () => void;
  onReturnTitle: () => void;
}

type WorldDestinationStatus =
  | 'completed'
  | 'in_progress'
  | 'available'
  | 'locked'
  | 'coming_soon';

export function WorldMapOverlay({
  language,
  countries,
  selectedCountry,
  progress,
  appearance,
  musicPlaying,
  onSelectCountry,
  onEnterWorld,
  onEnterAustraliaReflection,
  onRequestReplayCountry,
  onRequestRestartAttempt,
  onOpenPassport,
  onOpenAvatar,
  onOpenSettings,
  onToggleQuickAppearance,
  onToggleMusic,
  onReturnTitle,
}: WorldMapOverlayProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';
  const scotlandUnlocked = isScotlandUnlocked(progress);
  const scotlandEntry = progress.missionProgress[SCOTLAND_MISSION_ID];
  const australiaUnlocked = isAustraliaUnlocked(progress);
  const australiaEntry = progress.missionProgress[AUSTRALIA_MISSION_ID];
  const australiaAwaitingReflection = isAustraliaPerformAwaitingReflection(progress);
  const egyptUnlocked = isEgyptUnlocked(progress);
  const egyptEntry = getEgyptEffectiveEntry(progress);

  const getCountryStatus = (id: CountryId): WorldDestinationStatus => {
    if (id === 'india') {
      return isJaipurMissionCompleted(progress) ? 'completed' : 'available';
    }
    if (id === 'kenya') {
      return isKenyaMissionCompleted(progress) ? 'completed' : 'available';
    }
    if (id === 'scotland') {
      if (!scotlandUnlocked) return 'locked';
      if (isScotlandMissionCompleted(progress)) return 'completed';
      const hasStartedScotland = Boolean(
        scotlandEntry?.metEilidh ||
          scotlandEntry?.metFiona ||
          scotlandEntry?.scotlandDiscoverStarted ||
          scotlandEntry?.scotlandBuildStarted ||
          scotlandEntry?.scotlandPracticeStarted ||
          scotlandEntry?.scotlandPerformStarted ||
          (scotlandEntry?.scotlandExploredPoiIds?.length ?? 0) > 0 ||
          (scotlandEntry?.scotlandDiscoveredEvidenceIds?.length ?? 0) > 0 ||
          (scotlandEntry?.scotlandCompletedSpeakingIds?.length ?? 0) > 0 ||
          (scotlandEntry?.completedActivityIds?.length ?? 0) > 0,
      );
      return hasStartedScotland ? 'in_progress' : 'available';
    }
    if (id === 'australia') {
      if (!australiaUnlocked) return 'locked';
      if (isAustraliaMissionCompleted(progress)) return 'completed';
      const hasStartedAustralia = Boolean(
        australiaEntry?.status === 'in_progress' ||
          australiaEntry?.australiaDiscoverStarted ||
          australiaEntry?.australiaBuildStarted ||
          australiaEntry?.australiaPracticeStarted ||
          australiaEntry?.australiaPerformStarted ||
          (australiaEntry?.australiaExploredPoiIds?.length ?? 0) > 0 ||
          (australiaEntry?.australiaMetNpcIds?.length ?? 0) > 0 ||
          (australiaEntry?.australiaCompletedDiscoverIds?.length ?? 0) > 0 ||
          (australiaEntry?.australiaCompletedBuildIds?.length ?? 0) > 0 ||
          (australiaEntry?.australiaCompletedPracticeIds?.length ?? 0) > 0 ||
          (australiaEntry?.australiaCompletedPerformIds?.length ?? 0) > 0 ||
          (australiaEntry?.completedActivityIds?.length ?? 0) > 0,
      );
      return hasStartedAustralia ? 'in_progress' : 'available';
    }
    if (id === 'egypt') {
      if (!egyptUnlocked) return 'locked';
      const hasStartedEgypt = Boolean(
        egyptEntry?.status === 'in_progress' ||
          egyptEntry?.egyptEntered ||
          egyptEntry?.egyptDiscoverStarted ||
          egyptEntry?.egyptBuildStarted ||
          (egyptEntry?.egyptExploredPoiIds?.length ?? 0) > 0 ||
          (egyptEntry?.egyptMetNpcIds?.length ?? 0) > 0 ||
          (egyptEntry?.egyptCompletedDiscoverIds?.length ?? 0) > 0 ||
          (egyptEntry?.egyptCompletedBuildIds?.length ?? 0) > 0 ||
          egyptEntry?.completedActivityIds?.includes(EGYPT_DISCOVERY_ACTIVITY_ID) ||
          egyptEntry?.completedActivityIds?.includes(EGYPT_BUILD_ACTIVITY_ID),
      );
      return hasStartedEgypt ? 'in_progress' : 'available';
    }
    return 'coming_soon';
  };

  const selectedStatus = getCountryStatus(selectedCountry.id);
  const canEnterSelected =
    canNavigateToCountry(progress, selectedCountry.id) &&
    (selectedStatus === 'completed' ||
      selectedStatus === 'in_progress' ||
      selectedStatus === 'available');
  const canReplaySelected = canReplayCountry(progress, selectedCountry.id);
  const hasActiveReplaySelected = hasActiveCountryReplay(progress, selectedCountry.id);
  const activeReplaySelected = getCountryReplayAttempt(progress, selectedCountry.id);

  const hudChipClass = isNight
    ? 'border-white/15 bg-[#131E31]/85 text-[#F7F9FC]'
    : 'border-[#20304A]/15 bg-[#F7F9FC]/92 text-[#20304A]';

  const renderStatusBadge = (status: WorldDestinationStatus, countryId: CountryId) => {
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-[#2ED6A3] px-2 py-0.5 font-display text-[10px] font-extrabold text-[#131E31]">
          <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
          <span>{copy.worldMapCompletedBadge}</span>
        </span>
      );
    }
    if (status === 'in_progress') {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-[#3A7D6C] px-2 py-0.5 font-display text-[10px] font-extrabold text-white">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          <span>{copy.worldMapStatusInProgress}</span>
        </span>
      );
    }
    if (status === 'available') {
      if (countryId === 'egypt' && egyptUnlocked) {
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-[#F2C66D] px-2 py-0.5 font-display text-[10px] font-extrabold text-[#131E31]">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            <span>{copy.worldMapEgyptEnterableBadge}</span>
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-[#24B8B0] px-2 py-0.5 font-display text-[10px] font-extrabold text-[#131E31]">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          <span>{copy.worldMapStatusAvailable}</span>
        </span>
      );
    }
    if (status === 'locked') {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-[#D98218]/20 px-2 py-0.5 font-display text-[10px] font-extrabold text-[#D98218]">
          <Lock className="h-3 w-3" aria-hidden="true" />
          <span>{copy.worldMapStatusLocked}</span>
        </span>
      );
    }
    if (countryId === 'egypt' && egyptUnlocked) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-[#F2C66D] px-2 py-0.5 font-display text-[10px] font-extrabold text-[#131E31]">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          <span>{copy.worldMapEgyptUnlockedBadge}</span>
        </span>
      );
    }
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-display text-[10px] font-extrabold ${
          isNight ? 'bg-white/10 text-[#C8D4E6]' : 'bg-[#20304A]/10 text-[#48607E]'
        }`}
      >
        <Clock3 className="h-3 w-3" aria-hidden="true" />
        <span>{copy.worldMapStatusComingSoon}</span>
      </span>
    );
  };

  return (
    <div className="pointer-events-none relative z-10 flex h-full w-full flex-col justify-between p-4 sm:p-6">
      {/* Top Floating Game HUD */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        {/* Top-Left: Avatar + Rewards + Passport */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenAvatar}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold shadow-sm transition-colors cursor-pointer ${hudChipClass}`}
          >
            <span className="h-7 w-7 overflow-hidden rounded-lg border border-white/15">
              <AvatarPortraitSVG
                avatar={progress.avatar}
                variant="bust"
                appearance={appearance}
                className="h-full w-full"
              />
            </span>
            <span>{progress.avatar.displayName}</span>
          </button>

          <div
            className={`inline-flex items-center gap-3 rounded-xl border px-3.5 py-2 text-xs font-bold shadow-sm ${hudChipClass}`}
          >
            <span className="inline-flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
              <span className="font-mono-num">{progress.rewards.xp}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Coins className="h-3.5 w-3.5 text-[#D99B26]" aria-hidden="true" />
              <span className="font-mono-num">{progress.rewards.coins}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Gem className="h-3.5 w-3.5 text-[#FF9478]" aria-hidden="true" />
              <span className="font-mono-num">{progress.rewards.gems}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenPassport}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold shadow-sm transition-colors cursor-pointer ${hudChipClass} hover:border-[#F2C66D]`}
          >
            <Stamp className="h-3.5 w-3.5 text-[#D99B26]" aria-hidden="true" />
            <span>{copy.openPassport}</span>
            <span className="font-mono-num opacity-75">
              {progress.rewards.stamps.length}/5
            </span>
          </button>
        </div>

        {/* Top-Right: Quick Day/Night, Music, Settings, Title */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleQuickAppearance}
            aria-label={copy.appearanceLabel}
            title={appearance === 'day' ? copy.modeDay : copy.modeNight}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition-colors cursor-pointer ${hudChipClass}`}
          >
            {isNight ? (
              <Moon className="h-4 w-4 text-[#F2C66D]" aria-hidden="true" />
            ) : (
              <Sun className="h-4 w-4 text-[#D98218]" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={onToggleMusic}
            aria-label={copy.musicLabel}
            aria-pressed={musicPlaying}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition-colors cursor-pointer ${
              musicPlaying
                ? 'border-[#24B8B0] bg-[#24B8B0] text-[#131E31]'
                : hudChipClass
            }`}
          >
            <Music className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            aria-label={copy.settingsButton}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold shadow-sm transition-colors cursor-pointer ${hudChipClass}`}
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{copy.settingsButton}</span>
          </button>

          <button
            type="button"
            onClick={onReturnTitle}
            aria-label={copy.backToTitle}
            title={copy.backToTitle}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition-colors cursor-pointer ${hudChipClass}`}
          >
            <Home className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Bottom Floating Country Selector & Enter World Action */}
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
        {/* Selected Destination Adventure Banner */}
        <div
          className={`pointer-events-auto flex flex-col gap-3 rounded-2xl border p-3.5 shadow-xl sm:flex-row sm:items-center sm:justify-between ${
            isNight
              ? 'border-white/15 bg-[#131E31]/90 text-[#F7F9FC]'
              : 'border-[#20304A]/15 bg-[#F7F9FC]/94 text-[#20304A]'
          }`}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-black/10">
              <DioramaImage
                src={selectedCountry.dioramaImageUrl}
                alt={selectedCountry.countryName[language]}
                title={selectedCountry.countryName[language]}
                accentColor={selectedCountry.themeColors.primary}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                <CountryFlagBadge countryId={selectedCountry.id} className="h-4 w-6 shrink-0" />
                <p className="text-xs font-bold text-[#24B8B0] truncate">
                  {selectedCountry.countryName[language]} · {selectedCountry.cityOrRegion[language]}
                </p>
                {renderStatusBadge(selectedStatus, selectedCountry.id)}
              </div>
              <h2 className="font-display text-lg font-bold truncate sm:text-xl mt-0.5">
                {selectedCountry.title[language]}
              </h2>
              {activeReplaySelected && (
                <p
                  className={`mt-0.5 text-[11px] font-bold ${
                    isNight ? 'text-[#2ED6A3]' : 'text-[#0E7A74]'
                  }`}
                >
                  {copy.replayModeLabel} ·{' '}
                  <span className="font-mono-num">
                    {copy.replayAttemptPrefix} #{activeReplaySelected.attemptNumber}
                  </span>{' '}
                  ·{' '}
                  {activeReplaySelected.status === 'completed'
                    ? copy.replayAttemptCompleteLabel
                    : `${copy.replayStagePrefix}: ${activeReplaySelected.currentStage.toUpperCase()}`}
                </p>
              )}
              {selectedStatus === 'locked' && (
                <p className={`text-[11px] font-semibold mt-0.5 ${isNight ? 'text-[#F2C66D]' : 'text-[#9A5B13]'}`}>
                  {selectedCountry.id === 'australia'
                    ? copy.worldMapAustraliaUnlockHint
                    : selectedCountry.id === 'egypt'
                      ? copy.worldMapEgyptUnlockHint
                      : copy.worldMapScotlandUnlockHint}
                </p>
              )}
              {selectedCountry.id === 'australia' &&
                australiaUnlocked &&
                australiaAwaitingReflection &&
                selectedStatus === 'in_progress' && (
                  <p
                    className={`text-[11px] font-bold mt-0.5 ${
                      isNight ? 'text-[#F2C66D]' : 'text-[#9A5B13]'
                    }`}
                  >
                    {copy.worldMapAustraliaReflectionPendingHint}
                  </p>
                )}
              {selectedCountry.id === 'egypt' &&
                egyptUnlocked &&
                (selectedStatus === 'available' || selectedStatus === 'in_progress') && (
                  <p
                    className={`text-[11px] font-medium mt-0.5 ${
                      isNight ? 'text-[#F2C66D]' : 'text-[#9A5B13]'
                    }`}
                  >
                    {copy.worldMapEgyptEnterableHint}
                  </p>
                )}
              {selectedStatus === 'coming_soon' && (
                <p
                  className={`text-[11px] font-medium mt-0.5 ${
                    selectedCountry.id === 'egypt' && egyptUnlocked
                      ? isNight
                        ? 'text-[#F2C66D]'
                        : 'text-[#9A5B13]'
                      : isNight
                        ? 'text-[#B8CAE0]'
                        : 'text-[#526785]'
                  }`}
                >
                  {selectedCountry.id === 'egypt' && egyptUnlocked
                    ? copy.worldMapEgyptUnlockedHint
                    : copy.worldMapComingSoonHint}
                </p>
              )}
            </div>
          </div>

          {canEnterSelected ? (
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {canReplaySelected && (
                <button
                  type="button"
                  onClick={() => onRequestReplayCountry(selectedCountry.id)}
                  className={`inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border px-3.5 py-2.5 font-display text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    isNight
                      ? 'border-[#24B8B0]/50 bg-[#18313D] text-[#E6FAF5] hover:bg-[#1E404F]'
                      : 'border-[#24B8B0]/40 bg-[#E9FBF7] text-[#0E7A74] hover:bg-[#D5F5EE]'
                  }`}
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.replayCountryButton}</span>
                </button>
              )}

              {hasActiveReplaySelected && (
                <button
                  type="button"
                  onClick={() => onRequestRestartAttempt(selectedCountry.id)}
                  className={`inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border px-3.5 py-2.5 font-display text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    isNight
                      ? 'border-[#F2C66D]/45 bg-[#2A2215] text-[#FDE68A] hover:bg-[#3A2E1A]'
                      : 'border-[#D98218]/35 bg-[#FFF7E3] text-[#8E5B08] hover:bg-[#FFEDC2]'
                  }`}
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.restartAttemptButton}</span>
                </button>
              )}

              {selectedCountry.id === 'australia' && australiaAwaitingReflection ? (
                <button
                  type="button"
                  onClick={onEnterAustraliaReflection ?? onEnterWorld}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2.5 font-display text-sm font-bold text-[#131E31] shadow-md hover:bg-[#f6d388] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>{copy.australiaPerformResumeReflectionButton}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onEnterWorld}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2.5 font-display text-sm font-bold text-[#131E31] shadow-md hover:bg-[#f6d388] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>{copy.enterWorldButton}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled="true"
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-display text-xs font-bold whitespace-nowrap shrink-0 cursor-not-allowed ${
                isNight
                  ? 'border-white/15 bg-white/5 text-[#9AA9BF]'
                  : 'border-[#20304A]/15 bg-[#E6EDF5] text-[#526785]'
              }`}
            >
              {selectedStatus === 'locked' ? (
                <>
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  <span>{copy.worldMapLockedButton}</span>
                </>
              ) : (
                <>
                  <Clock3 className="h-4 w-4" aria-hidden="true" />
                  <span>{copy.worldMapComingSoonButton}</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* 5-Country Quick Selector Dock */}
        <div
          className={`pointer-events-auto flex flex-wrap items-center justify-center gap-1.5 rounded-xl border p-1.5 shadow-lg ${
            isNight
              ? 'border-white/15 bg-[#131E31]/88'
              : 'border-[#20304A]/15 bg-[#F7F9FC]/92'
          }`}
        >
          {countries.map((country) => {
            const active = country.id === selectedCountry.id;
            const status = getCountryStatus(country.id);
            return (
              <button
                key={country.id}
                type="button"
                onClick={() => onSelectCountry(country.id)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#24B8B0] text-[#131E31]'
                    : isNight
                      ? 'text-[#C8D4E6] hover:bg-[#20304A] hover:text-[#F7F9FC]'
                      : 'text-[#394E6E] hover:bg-[#E2EFF7] hover:text-[#20304A]'
                }`}
              >
                <CountryFlagBadge countryId={country.id} className="h-3.5 w-5 shrink-0" />
                <span>{country.countryName[language]}</span>
                {status === 'completed' && (
                  <CheckCircle2
                    className={`h-3.5 w-3.5 shrink-0 ${
                      active ? 'text-[#131E31]' : 'text-[#2ED6A3]'
                    }`}
                    aria-label={copy.worldMapCompletedBadge}
                  />
                )}
                {(status === 'locked' || status === 'coming_soon') && (
                  <Lock
                    className={`h-3 w-3 shrink-0 ${
                      active ? 'text-[#131E31]' : 'opacity-65'
                    }`}
                    aria-label={
                      status === 'locked' ? copy.worldMapStatusLocked : copy.worldMapStatusComingSoon
                    }
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

