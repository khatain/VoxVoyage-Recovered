import {
  ArrowLeft,
  ArrowRight,
  Award,
  Coins,
  Gem,
  Lock,
  Palette,
  Settings,
  Sparkles,
  Stamp,
} from 'lucide-react';
import type {
  AppLanguage,
  CountryWorld,
  LocalProgressV1,
  ResolvedAppearance,
} from '../../types/game';
import { GAME_COPY } from '../../data/i18n';
import {
  AUSTRALIA_MISSION_ID,
  AUSTRALIA_PASSPORT_STAMP_ID,
  isAustraliaMissionCompleted,
  isAustraliaPerformAwaitingReflection,
  JAIPUR_MISSION_ID,
  KENYA_MISSION_ID,
  KENYA_PASSPORT_STAMP_ID,
  SCOTLAND_MISSION_ID,
  SCOTLAND_PASSPORT_STAMP_ID,
} from '../../utils/progressStorage';
import { AvatarPortraitSVG } from '../avatar/AvatarPortraitSVG';
import { IndiaJaipurStampSVG } from '../common/IndiaJaipurStampSVG';
import { KenyaWildSpeakStampSVG } from '../common/KenyaWildSpeakStampSVG';
import { ScotlandHighlandsStampSVG } from '../common/ScotlandHighlandsStampSVG';
import { AustraliaSydneyStampSVG } from '../common/AustraliaSydneyStampSVG';

interface PassportModalScreenProps {
  language: AppLanguage;
  countries: CountryWorld[];
  progress: LocalProgressV1;
  appearance: ResolvedAppearance;
  isIntroMode?: boolean;
  backLabelOverride?: string;
  onBackOverride?: () => void;
  onEnterWorldMap: () => void;
  onEditAvatar: () => void;
  onOpenSettings: () => void;
}

export function PassportModalScreen({
  language,
  countries,
  progress,
  appearance,
  isIntroMode = false,
  backLabelOverride,
  onBackOverride,
  onEnterWorldMap,
  onEditAvatar,
  onOpenSettings,
}: PassportModalScreenProps) {
  const copy = GAME_COPY[language];

  return (
    <div className="min-h-screen w-full bg-[var(--vv-canvas)] text-[var(--vv-ink)] p-4 sm:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={isIntroMode ? onEditAvatar : onBackOverride ?? onEnterWorldMap}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-[var(--vv-border)] bg-[var(--vv-surface)] px-4 py-2 text-xs font-bold text-[var(--vv-ink)] hover:bg-[var(--vv-surface-hover)] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>
              {isIntroMode ? copy.backButton : backLabelOverride ?? copy.backToMap}
            </span>
          </button>

          <div className="flex items-center gap-2">
            {!isIntroMode && (
              <button
                type="button"
                onClick={onEditAvatar}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-[var(--vv-border)] bg-[var(--vv-surface)] px-4 py-2 text-xs font-bold text-[var(--vv-ink)] hover:bg-[var(--vv-surface-hover)] cursor-pointer"
              >
                <Palette className="h-4 w-4 text-[var(--vv-teal-ink)]" aria-hidden="true" />
                <span>{copy.editExplorerButton}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenSettings}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-[var(--vv-border)] bg-[var(--vv-surface)] px-4 py-2 text-xs font-bold text-[var(--vv-ink)] hover:bg-[var(--vv-surface-hover)] cursor-pointer"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
              <span>{copy.settingsButton}</span>
            </button>
          </div>
        </div>

        {/* Explorer Passport Book Card */}
        <div className="rounded-3xl border border-[var(--vv-border-strong)] bg-[var(--vv-surface)] p-6 sm:p-8 shadow-xl">
          {isIntroMode && (
            <div className="mb-6 rounded-2xl border border-[#24B8B0]/35 bg-[var(--vv-surface-inset)] p-4 sm:p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-[var(--vv-teal-ink)]">
                  {copy.passportIntroTitle}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[var(--vv-ink-secondary)]">
                  {copy.passportIntroMessage}
                </p>
              </div>
              <button
                type="button"
                onClick={onEnterWorldMap}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2.5 font-display text-sm font-bold text-[#131E31] shadow-md hover:bg-[#f6d388] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>{copy.enterWorldMapButton}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}

          <div className="flex flex-col gap-4 border-b border-[var(--vv-border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[var(--vv-border-strong)]">
                <AvatarPortraitSVG
                  avatar={progress.avatar}
                  variant="bust"
                  appearance={appearance}
                  className="h-full w-full"
                />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-[var(--vv-ink)]">
                  {copy.passportTitle}
                </h1>
                <p className="text-sm font-semibold text-[var(--vv-teal-ink)]">
                  {progress.avatar.displayName}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm font-bold">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[var(--vv-teal-ink)]" aria-hidden="true" />
                <span className="font-mono-num">{progress.rewards.xp}</span>
                <span className="text-xs font-normal text-[var(--vv-ink-muted)]">
                  {copy.xpLabel}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Coins className="h-4 w-4 text-[var(--vv-gold-ink)]" aria-hidden="true" />
                <span className="font-mono-num">{progress.rewards.coins}</span>
                <span className="text-xs font-normal text-[var(--vv-ink-muted)]">
                  {copy.coinsLabel}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Gem className="h-4 w-4 text-[var(--vv-coral-ink)]" aria-hidden="true" />
                <span className="font-mono-num">{progress.rewards.gems}</span>
                <span className="text-xs font-normal text-[var(--vv-ink-muted)]">
                  {copy.gemsLabel}
                </span>
              </span>
            </div>
          </div>

          <p className="mt-4 text-xs text-[var(--vv-ink-secondary)]">{copy.passportEmptyHint}</p>

          {/* 5 Stamp Slots */}
          <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
            {countries.map((country) => {
              const stampId =
                country.id === 'india'
                  ? 'stamp_india_jaipur'
                  : country.id === 'kenya'
                    ? KENYA_PASSPORT_STAMP_ID
                    : country.id === 'scotland'
                      ? SCOTLAND_PASSPORT_STAMP_ID
                      : country.id === 'australia'
                        ? AUSTRALIA_PASSPORT_STAMP_ID
                        : 'stamp_egypt_expedition';
              const earned =
                country.id === 'australia'
                  ? isAustraliaMissionCompleted(progress) &&
                    progress.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID)
                  : progress.rewards.stamps.includes(stampId) ||
                    (country.id === 'kenya' &&
                      progress.rewards.stamps.includes('stamp_kenya_safari'));
              const australiaReflectionPending =
                country.id === 'australia' && !earned && isAustraliaPerformAwaitingReflection(progress);
              return (
                <div
                  key={country.id}
                  className={`flex flex-col justify-between rounded-2xl border p-4 ${
                    earned
                      ? 'border-[#F2C66D] bg-[var(--vv-surface-inset)]'
                      : 'border-dashed border-[var(--vv-border-strong)] bg-[var(--vv-surface-inset)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-num text-xs font-bold text-[var(--vv-ink-muted)]">
                      {country.code}
                    </span>
                    {earned ? (
                      <Award className="h-4 w-4 text-[var(--vv-gold-ink)]" aria-hidden="true" />
                    ) : (
                      <Lock className="h-3.5 w-3.5 text-[var(--vv-ink-muted)]" aria-hidden="true" />
                    )}
                  </div>

                  <div className="my-3 flex items-center justify-center">
                    {country.id === 'india' && earned ? (
                      <IndiaJaipurStampSVG
                        language={language}
                        appearance={appearance}
                        earned={true}
                        completedAt={progress.missionProgress[JAIPUR_MISSION_ID]?.completedAt}
                        sizeClass="h-24 w-24"
                      />
                    ) : country.id === 'kenya' && earned ? (
                      <KenyaWildSpeakStampSVG
                        language={language}
                        appearance={appearance}
                        earned={true}
                        completedAt={progress.missionProgress[KENYA_MISSION_ID]?.completedAt}
                        sizeClass="h-24 w-24"
                      />
                    ) : country.id === 'scotland' && earned ? (
                      <ScotlandHighlandsStampSVG
                        language={language}
                        appearance={appearance}
                        earned={true}
                        completedAt={progress.missionProgress[SCOTLAND_MISSION_ID]?.completedAt}
                        sizeClass="h-24 w-24"
                      />
                    ) : country.id === 'australia' && earned ? (
                      <AustraliaSydneyStampSVG
                        language={language}
                        appearance={appearance}
                        earned={true}
                        completedAt={progress.missionProgress[AUSTRALIA_MISSION_ID]?.completedAt}
                        sizeClass="h-24 w-24"
                      />
                    ) : (
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                          earned
                            ? 'border-[#F2C66D] bg-[#F2C66D]/20 text-[var(--vv-gold-ink)]'
                            : 'border-[var(--vv-border)] text-[var(--vv-ink-muted)]'
                        }`}
                      >
                        <Stamp className="h-5 w-5" aria-hidden="true" />
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="font-display text-sm font-bold text-[var(--vv-ink)]">
                      {country.countryName[language]}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--vv-ink-muted)]">
                      {australiaReflectionPending
                        ? copy.australiaPerformReflectionGateNotice
                        : country.stampTitle[language]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
