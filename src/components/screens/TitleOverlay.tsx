import { Compass, Play, Settings } from 'lucide-react';
import type { AppLanguage, ResolvedAppearance } from '../../types/game';
import { GAME_COPY } from '../../data/i18n';

interface TitleOverlayProps {
  language: AppLanguage;
  appearance: ResolvedAppearance;
  hasReturningProgress: boolean;
  onPlay: () => void;
  onOpenSettings: () => void;
}

export function TitleOverlay({
  language,
  appearance,
  hasReturningProgress,
  onPlay,
  onOpenSettings,
}: TitleOverlayProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';

  return (
    <div className="pointer-events-none relative z-10 flex h-full w-full flex-col justify-between p-6 sm:p-10 lg:p-14">
      {/* Top-Right: Small Settings button only */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onOpenSettings}
          className={`pointer-events-auto inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold shadow-sm transition-colors cursor-pointer ${
            isNight
              ? 'border-white/20 bg-[#131E31]/85 text-[#F7F9FC] hover:bg-[#20304A]'
              : 'border-[#20304A]/15 bg-[#F7F9FC]/90 text-[#20304A] hover:bg-white'
          }`}
        >
          <Settings className="h-4 w-4" aria-hidden="true" />
          <span>{copy.settingsButton}</span>
        </button>
      </div>

      {/* Center-Left Game Title Lockup: Logo, Tagline, Large PLAY Button */}
      <div className="my-auto max-w-lg">
        <div
          className={`inline-flex items-center gap-3 rounded-2xl px-4 py-2.5 shadow-sm ${
            isNight
              ? 'bg-[#131E31]/75 border border-white/15'
              : 'bg-[#F7F9FC]/85 border border-[#20304A]/10'
          }`}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#20304A] text-[#F2C66D]">
            <Compass className="h-6 w-6" aria-hidden="true" />
          </div>
          <span
            className={`font-display text-3xl font-bold tracking-tight sm:text-4xl ${
              isNight ? 'text-[#F7F9FC]' : 'text-[#20304A]'
            }`}
          >
            {copy.brandName}
          </span>
        </div>

        <p
          className={`mt-4 font-display text-2xl font-bold sm:text-3xl ${
            isNight
              ? 'text-[#F2C66D] drop-shadow-[0_2px_10px_rgba(10,14,38,0.85)]'
              : 'text-[#20304A] drop-shadow-[0_2px_10px_rgba(255,255,255,0.75)]'
          }`}
        >
          {copy.tagline}
        </p>

        <div className="mt-8">
          <button
            type="button"
            onClick={onPlay}
            className="pointer-events-auto inline-flex items-center gap-3.5 rounded-2xl bg-[#F2C66D] px-10 py-4 font-display text-xl font-bold tracking-wide text-[#131E31] shadow-[0_12px_32px_rgba(19,30,49,0.28)] hover:bg-[#f6d388] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Play className="h-6 w-6 fill-current" aria-hidden="true" />
            <span>{hasReturningProgress ? copy.continueButton : copy.playButton}</span>
          </button>
        </div>
      </div>

      {/* Bottom spacer for balanced vertical framing */}
      <div aria-hidden="true" className="h-4" />
    </div>
  );
}
