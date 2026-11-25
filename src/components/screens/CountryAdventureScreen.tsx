import {
  ArrowLeft,
  Award,
  Blocks,
  Coins,
  Compass,
  Gem,
  Lock,
  MessageCircle,
  Mic,
  Moon,
  Settings,
  Sparkles,
  Sun,
  Volume2,
} from 'lucide-react';
import type {
  AppLanguage,
  CountryWorld,
  LearningStageId,
  LocalProgressV1,
  ResolvedAppearance,
  ScreenRoute,
} from '../../types/game';
import { LEARNING_STAGES, getMissionByCountryId } from '../../data/learningFramework';
import { GAME_COPY } from '../../data/i18n';
import { DioramaImage } from '../common/DioramaImage';
import { AvatarPortraitSVG } from '../avatar/AvatarPortraitSVG';

interface CountryAdventureScreenProps {
  routeId: Exclude<ScreenRoute, 'welcome' | 'world-map' | 'passport-reward' | 'avatar-studio'>;
  language: AppLanguage;
  country: CountryWorld;
  progress: LocalProgressV1;
  appearance: ResolvedAppearance;
  onBackToMap: () => void;
  onToggleQuickAppearance?: () => void;
  onOpenSettings: () => void;
}

const DAY_SPEAKER_COLORS: Record<CountryWorld['id'], string> = {
  india: '#C44D36',
  kenya: '#B55D14',
  scotland: '#1F6F5B',
  australia: '#0D7F79',
  egypt: '#9A630E',
};

const STAGE_VISUALS: Record<
  LearningStageId,
  {
    Icon: typeof Compass;
    badgeBgDay: string;
    badgeInkDay: string;
    badgeBgNight: string;
    badgeInkNight: string;
  }
> = {
  discover: {
    Icon: Compass,
    badgeBgDay: 'bg-[#DFF7F5] border-[#24B8B0]/45',
    badgeInkDay: 'text-[#0E7A74]',
    badgeBgNight: 'bg-[#173A44] border-[#24B8B0]/50',
    badgeInkNight: 'text-[#3EE0D6]',
  },
  build: {
    Icon: Blocks,
    badgeBgDay: 'bg-[#FEF3D5] border-[#E0A938]/45',
    badgeInkDay: 'text-[#966109]',
    badgeBgNight: 'bg-[#3D311A] border-[#F2C66D]/50',
    badgeInkNight: 'text-[#F2C66D]',
  },
  practice: {
    Icon: Mic,
    badgeBgDay: 'bg-[#FFE8E1] border-[#FF9478]/50',
    badgeInkDay: 'text-[#B54328]',
    badgeBgNight: 'bg-[#422526] border-[#FF9478]/50',
    badgeInkNight: 'text-[#FF9E84]',
  },
  perform: {
    Icon: Award,
    badgeBgDay: 'bg-[#EDE8FF] border-[#8D72E1]/45',
    badgeInkDay: 'text-[#5A3FB8]',
    badgeBgNight: 'bg-[#2C244D] border-[#A38DF0]/50',
    badgeInkNight: 'text-[#C2B2FF]',
  },
};

export function CountryAdventureScreen({
  routeId,
  language,
  country,
  progress,
  appearance,
  onBackToMap,
  onToggleQuickAppearance,
  onOpenSettings,
}: CountryAdventureScreenProps) {
  const copy = GAME_COPY[language];
  const mission = getMissionByCountryId(country.id);
  const isNight = appearance === 'night';

  const missionProgress = progress.missionProgress[mission.id];
  const completedCount = missionProgress?.completedActivityIds.length ?? 0;

  const speakGreeting = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(country.npc.greetingPreview.en);
    utterance.lang = 'en-US';
    utterance.rate = country.npc.voiceProfile.recommendedRate;
    utterance.pitch = country.npc.voiceProfile.recommendedPitch;
    window.speechSynthesis.speak(utterance);
  };

  const hudChipClass = isNight
    ? 'border-white/20 bg-[#131E31]/85 text-[#F7F9FC] hover:bg-[#1E2E49]'
    : 'border-[#20304A]/15 bg-[#FFFDF8]/92 text-[#20304A] hover:bg-white shadow-[0_6px_18px_rgba(32,48,74,0.12)]';

  const hudBadgeClass = isNight
    ? 'border-white/15 bg-[#131E31]/85 text-[#F7F9FC]'
    : 'border-[#20304A]/12 bg-[#FFFDF8]/92 text-[#20304A] shadow-[0_6px_18px_rgba(32,48,74,0.12)]';

  if (routeId === 'briefing') {
    return (
      <div className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[var(--vv-canvas)] p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToMap}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--vv-border)] bg-[var(--vv-surface)] px-4 py-2 text-xs font-bold text-[var(--vv-ink)] hover:bg-[var(--vv-surface-hover)] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>{copy.backToMap}</span>
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--vv-border)] bg-[var(--vv-surface)] px-4 py-2 text-xs font-bold text-[var(--vv-ink)] hover:bg-[var(--vv-surface-hover)] cursor-pointer"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
            <span>{copy.settingsButton}</span>
          </button>
        </div>

        <div className="mx-auto my-auto w-full max-w-md rounded-3xl border border-[var(--vv-border)] bg-[var(--vv-surface)] p-8 text-center shadow-xl">
          <div className="mx-auto h-20 w-20 overflow-hidden rounded-2xl border border-[var(--vv-border-strong)]">
            <AvatarPortraitSVG
              avatar={progress.avatar}
              variant="bust"
              appearance={appearance}
              className="h-full w-full"
            />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold text-[var(--vv-ink)]">
            {progress.avatar.displayName}
          </h1>
          <p className="mt-2 text-sm text-[var(--vv-ink-secondary)]">{copy.comingSoonLabel}</p>
          <button
            type="button"
            onClick={onBackToMap}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#F2C66D] px-6 py-3 font-display text-sm font-bold text-[#131E31] hover:bg-[#f6d388] cursor-pointer"
          >
            {copy.continueToWorldMap}
          </button>
        </div>

        <div aria-hidden="true" className="h-4" />
      </div>
    );
  }

  return (
    <div
      className={`relative flex min-h-[100dvh] w-full flex-col justify-between overflow-hidden ${
        isNight ? 'bg-[#0D142E]' : 'bg-[#73C7F2]'
      }`}
    >
      {/* Full-Bleed Country 3D Diorama Environment */}
      <div className="absolute inset-0">
        <DioramaImage
          src={country.dioramaImageUrl}
          alt={country.title[language]}
          title={country.countryName[language]}
          accentColor={country.themeColors.primary}
          appearance={appearance}
          className={`h-full w-full object-cover transition-all duration-700 ${
            isNight
              ? 'brightness-[0.68] contrast-[1.08] saturate-[0.88]'
              : 'brightness-[1.04] saturate-[1.06]'
          }`}
        />

        {/* Day Mode: crisp sunlit sky mist only (no dark overlay); Night Mode: atmospheric twilight + stars */}
        {isNight ? (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-[#0A102B]/70 via-[#131C42]/38 to-[#0B1230]/82 transition-opacity duration-700"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-44 opacity-80">
              <span className="absolute left-[12%] top-10 h-1.5 w-1.5 rounded-full bg-[#FFF4D6]" />
              <span className="absolute left-[27%] top-16 h-1 w-1 rounded-full bg-white" />
              <span className="absolute left-[46%] top-8 h-1.5 w-1.5 rounded-full bg-[#FFF4D6]" />
              <span className="absolute left-[68%] top-14 h-1 w-1 rounded-full bg-white" />
              <span className="absolute left-[84%] top-9 h-1.5 w-1.5 rounded-full bg-[#FFF4D6]" />
            </div>
          </>
        ) : (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-[#E9F6FD]/35 transition-opacity duration-700"
          />
        )}
      </div>

      {/* Minimal Gameplay-First Top HUD */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 p-3.5 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onBackToMap}
            className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${hudChipClass}`}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>{copy.backToMap}</span>
          </button>

          <div
            className={`inline-flex min-h-[40px] items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold ${hudBadgeClass}`}
          >
            <span
              className={`h-6 w-6 overflow-hidden rounded-md border ${
                isNight ? 'border-white/20' : 'border-[#20304A]/15'
              }`}
            >
              <AvatarPortraitSVG
                avatar={progress.avatar}
                variant="bust"
                appearance={appearance}
                className="h-full w-full"
              />
            </span>
            <span>{progress.avatar.displayName}</span>
          </div>

          {/* Current Mission + Progress Bar */}
          <div
            className={`min-h-[40px] rounded-xl border px-3.5 py-1.5 text-xs ${hudBadgeClass}`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`font-display font-bold ${
                  isNight ? 'text-[#F2C66D]' : 'text-[#0F7E78]'
                }`}
              >
                {country.title[language]}
              </span>
              <span
                className={`font-mono-num font-bold ${
                  isNight ? 'text-[#C3CFE0]' : 'text-[#4C6280]'
                }`}
              >
                {completedCount}/4
              </span>
            </div>
            <div
              className={`mt-1 h-1.5 w-32 overflow-hidden rounded-full ${
                isNight ? 'bg-white/15' : 'bg-[#20304A]/12'
              }`}
            >
              <div
                className="h-full rounded-full bg-[#24B8B0]"
                style={{ width: `${Math.min(100, (completedCount / 4) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`hidden sm:inline-flex min-h-[40px] items-center gap-3 rounded-xl border px-3.5 py-2 text-xs font-bold ${hudBadgeClass}`}
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
              <Gem className="h-3.5 w-3.5 text-[#E86D4E]" aria-hidden="true" />
              <span className="font-mono-num">{progress.rewards.gems}</span>
            </span>
          </div>

          {onToggleQuickAppearance && (
            <button
              type="button"
              onClick={onToggleQuickAppearance}
              aria-label={isNight ? copy.modeDay : copy.modeNight}
              title={isNight ? copy.modeDay : copy.modeNight}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors cursor-pointer ${hudChipClass}`}
            >
              {isNight ? (
                <Sun className="h-4 w-4 text-[#F2C66D]" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4 text-[#3A5A8C]" aria-hidden="true" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onOpenSettings}
            aria-label={copy.settingsButton}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors cursor-pointer ${hudChipClass}`}
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Bottom Compact Game HUD: Speech Bubble + Connected 4-Stage Path (leaves diorama center open) */}
      <div className="relative z-10 mx-auto w-full max-w-4xl space-y-2.5 px-3.5 pb-4 pt-12 sm:px-6 sm:pb-6">
        {/* Compact Game-Style NPC Dialogue Bubble */}
        <section
          aria-label={country.npc.name}
          className={`mx-auto max-w-2xl rounded-3xl border px-4 py-3.5 sm:px-5 sm:py-4 transition-colors ${
            isNight
              ? 'border-[#F2C66D]/40 bg-[#121C36]/90 text-[#F7F9FC] shadow-[0_14px_34px_rgba(6,10,26,0.55)]'
              : 'border-white/95 bg-[#FFFDF8]/92 text-[#1E2E46] shadow-[0_14px_32px_rgba(32,48,74,0.16)]'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white shadow-sm"
                style={{ backgroundColor: country.themeColors.primary }}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span
                    className="font-display text-sm font-extrabold tracking-tight"
                    style={{
                      color: isNight ? '#F2C66D' : DAY_SPEAKER_COLORS[country.id],
                    }}
                  >
                    {country.npc.name}
                  </span>
                  <span
                    className={`text-[11px] font-medium truncate ${
                      isNight ? 'text-[#B5C4DC]' : 'text-[#546985]'
                    }`}
                  >
                    {country.npc.role[language]}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={speakGreeting}
              className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                isNight
                  ? 'border-white/20 bg-[#1E2D4C] text-[#F7F9FC] hover:bg-[#293D66]'
                  : 'border-[#24B8B0]/30 bg-[#E6F5FB] text-[#0E7A74] hover:bg-[#D4ECF8]'
              }`}
            >
              <Volume2 className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
              <span>{copy.jaipurListenButton}</span>
            </button>
          </div>

          <p
            className={`mt-2 text-sm sm:text-[15px] font-medium leading-snug ${
              isNight ? 'text-[#F7F9FC]' : 'text-[#1E2E46]'
            }`}
          >
            “{country.npc.greetingPreview[language]}”
          </p>

          <p
            className={`mt-1.5 text-[11px] font-semibold ${
              isNight ? 'text-[#5CE0D8]' : 'text-[#0E7A74]'
            }`}
          >
            {copy.finalChallengeLabel}: {country.finalSpeakingTask[language]}
          </p>
        </section>

        {/* Compact Connected Adventure Stages Path (Discover → Build → Practice → Perform) */}
        <section
          aria-label={copy.missionStagesTitle}
          className={`rounded-2xl border px-4 py-3 transition-colors ${
            isNight
              ? 'border-white/15 bg-[#121C36]/88 text-[#F7F9FC] shadow-xl'
              : 'border-white/90 bg-[#FFFDF8]/90 text-[#1E2E46] shadow-[0_10px_28px_rgba(32,48,74,0.14)]'
          }`}
        >
          <div className="flex items-center justify-between gap-2 text-xs">
            <span
              className={`font-display font-bold ${
                isNight ? 'text-[#F2C66D]' : 'text-[#20304A]'
              }`}
            >
              {copy.missionStagesTitle}
            </span>
            <span
              className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                isNight
                  ? 'bg-[#223257] text-[#F2C66D]'
                  : 'bg-[#FEF3D5] text-[#966109]'
              }`}
            >
              {copy.comingSoonLabel}
            </span>
          </div>

          {/* Connected Progression Track */}
          <div className="relative mt-2.5">
            {/* Horizontal connecting path line on tablet/desktop */}
            <div
              aria-hidden="true"
              className={`hidden sm:block absolute left-10 right-10 top-5 h-1 rounded-full ${
                isNight
                  ? 'bg-gradient-to-r from-[#24B8B0]/45 via-[#F2C66D]/45 to-[#8D72E1]/45'
                  : 'bg-gradient-to-r from-[#24B8B0]/40 via-[#F2C66D]/55 to-[#8D72E1]/45'
              }`}
            />

            <div className="relative grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              {LEARNING_STAGES.map((stage) => {
                const vis = STAGE_VISUALS[stage.id];
                const StageIcon = vis.Icon;
                return (
                  <div
                    key={stage.id}
                    className={`flex items-center gap-2.5 rounded-xl border px-2.5 py-2 sm:flex-col sm:items-center sm:border-transparent sm:bg-transparent sm:px-1 sm:py-0 ${
                      isNight
                        ? 'border-white/10 bg-[#192646]/80'
                        : 'border-[#20304A]/10 bg-[#F3F8FD]/90'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-sm ${
                          isNight ? vis.badgeBgNight : vis.badgeBgDay
                        } ${isNight ? vis.badgeInkNight : vis.badgeInkDay}`}
                      >
                        <StageIcon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <span
                        title={copy.lockedLabel}
                        className={`absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full border shadow-sm ${
                          isNight
                            ? 'border-[#121C36] bg-[#243252] text-[#F2C66D]'
                            : 'border-white bg-[#FFF8E6] text-[#966109]'
                        }`}
                      >
                        <Lock className="h-2.5 w-2.5" aria-hidden="true" />
                      </span>
                    </div>

                    <div className="min-w-0 sm:text-center">
                      <p
                        className={`font-mono-num text-[10px] font-bold leading-none ${
                          isNight ? 'text-[#93A7C7]' : 'text-[#5B708E]'
                        }`}
                      >
                        0{stage.order}
                      </p>
                      <p
                        className={`mt-0.5 truncate font-display text-xs sm:text-sm font-bold ${
                          isNight ? 'text-[#F7F9FC]' : 'text-[#1E2E46]'
                        }`}
                      >
                        {stage.name[language]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
