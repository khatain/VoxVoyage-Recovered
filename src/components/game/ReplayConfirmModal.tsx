import { useEffect } from 'react';
import { RefreshCw, RotateCcw, ShieldCheck, Sparkles, X } from 'lucide-react';
import type { AppLanguage, CountryWorld, ResolvedAppearance } from '../../types/game';
import { GAME_COPY } from '../../data/i18n';
import { CountryFlagBadge } from '../common/CountryFlagBadge';

interface ReplayConfirmModalProps {
  isOpen: boolean;
  mode: 'replay' | 'restart';
  country: CountryWorld | null;
  attemptNumber?: number;
  language: AppLanguage;
  appearance: ResolvedAppearance;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ReplayConfirmModal({
  isOpen,
  mode,
  country,
  attemptNumber,
  language,
  appearance,
  onConfirm,
  onCancel,
}: ReplayConfirmModalProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !country) return null;

  const isRestart = mode === 'restart';
  const titleText = isRestart ? copy.restartConfirmTitle : copy.replayConfirmTitle;
  const bodyText = isRestart ? copy.restartConfirmBody : copy.replayConfirmBody;
  const confirmLabel = isRestart
    ? copy.restartConfirmActionButton
    : copy.replayConfirmActionButton;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="replay-confirm-title"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        isNight ? 'bg-[#090F1E]/75' : 'bg-[#20304A]/40'
      }`}
    >
      <div
        className={`w-full max-w-md rounded-3xl border p-5 sm:p-6 ${
          isNight
            ? 'border-[#F2C66D]/45 bg-[#121C36] text-[#F7F9FC] shadow-2xl'
            : 'border-[#20304A]/15 bg-[#FFFDF8] text-[#1E2E46] shadow-[0_24px_56px_rgba(32,48,74,0.24)]'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                isRestart
                  ? 'bg-[#F2C66D] text-[#131E31]'
                  : 'bg-[#24B8B0] text-[#131E31]'
              }`}
            >
              {isRestart ? (
                <RefreshCw className="h-5 w-5" aria-hidden="true" />
              ) : (
                <RotateCcw className="h-5 w-5" aria-hidden="true" />
              )}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <CountryFlagBadge countryId={country.id} className="h-3.5 w-5 shrink-0" />
                <span
                  className={`text-xs font-bold truncate ${
                    isNight ? 'text-[#2ED6A3]' : 'text-[#0E7A74]'
                  }`}
                >
                  {country.countryName[language]} · {country.title[language]}
                </span>
              </div>
              <h2
                id="replay-confirm-title"
                className="mt-0.5 font-display text-lg font-extrabold leading-snug"
              >
                {titleText}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label={copy.cancelButton}
            className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border cursor-pointer ${
              isNight
                ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A] hover:bg-[#DCE8F5]'
            }`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {attemptNumber !== undefined && (
          <div className="mt-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${
                isNight
                  ? 'border-[#F2C66D]/40 bg-[#1D2B44] text-[#F2C66D]'
                  : 'border-[#D98218]/30 bg-[#FFF7E3] text-[#8E5B08]'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{copy.replayModeLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num">
                {copy.replayAttemptPrefix} #{attemptNumber}
              </span>
            </span>
          </div>
        )}

        <p
          className={`mt-3 text-sm leading-relaxed ${
            isNight ? 'text-[#D6E1F0]' : 'text-[#394E6E]'
          }`}
        >
          {bodyText}
        </p>

        <div
          className={`mt-4 rounded-2xl border p-3.5 ${
            isNight
              ? 'border-[#2ED6A3]/35 bg-[#102A2E] text-[#E6FAF5]'
              : 'border-[#24B8B0]/30 bg-[#E9FBF7] text-[#132938]'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <ShieldCheck
              className={`mt-0.5 h-4 w-4 shrink-0 ${
                isNight ? 'text-[#2ED6A3]' : 'text-[#0E7A74]'
              }`}
              aria-hidden="true"
            />
            <div>
              <p className="font-display text-xs font-extrabold">{copy.replayPreservedTitle}</p>
              <p className="mt-0.5 text-xs leading-relaxed opacity-90">
                {copy.replayPreservedDetail}
              </p>
            </div>
          </div>
        </div>

        {country.id === 'scotland' && (
          <div
            className={`mt-3 rounded-xl border p-3 text-xs font-semibold leading-relaxed ${
              isNight
                ? 'border-[#F2C66D]/40 bg-[#231D14] text-[#FDE68A]'
                : 'border-[#D98218]/30 bg-[#FFF8E6] text-[#8E5B08]'
            }`}
          >
            {copy.replayScotlandScopeNote}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className={`inline-flex min-h-[44px] items-center justify-center rounded-xl border px-4 py-2 text-xs font-bold whitespace-nowrap cursor-pointer ${
              isNight
                ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A] hover:bg-[#DCE8F5]'
            }`}
          >
            {copy.cancelButton}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-5 py-2 font-display text-xs sm:text-sm font-extrabold text-[#131E31] shadow-md whitespace-nowrap cursor-pointer ${
              isRestart
                ? 'bg-[#F2C66D] hover:bg-[#f7d487]'
                : 'bg-[#2ED6A3] hover:bg-[#49e2b3]'
            }`}
          >
            {isRestart ? (
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
            ) : (
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            )}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
