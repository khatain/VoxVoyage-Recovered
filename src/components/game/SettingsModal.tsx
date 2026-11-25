import { useEffect, useState } from 'react';
import { Globe2, Languages, Map, Monitor, Moon, Music, RotateCcw, Sparkles, Sun, Volume2, VolumeX, X } from 'lucide-react';
import type { AppearanceMode, AppLanguage } from '../../types/game';
import { GAME_COPY } from '../../data/i18n';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  appearanceMode: AppearanceMode;
  onAppearanceChange: (mode: AppearanceMode) => void;
  musicPlaying: boolean;
  musicPrefSaved: boolean;
  onToggleMusic: () => void;
  sfxEnabled: boolean;
  onToggleSfx: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  webglSupported: boolean;
  viewMode: '3d' | '2d';
  onViewModeChange: (mode: '3d' | '2d') => void;
  onResetProgress: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  appearanceMode,
  onAppearanceChange,
  musicPlaying,
  musicPrefSaved,
  onToggleMusic,
  sfxEnabled,
  onToggleSfx,
  reducedMotion,
  onToggleReducedMotion,
  webglSupported,
  viewMode,
  onViewModeChange,
  onResetProgress,
}: SettingsModalProps) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetMessage, setResetMessage] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setConfirmReset(false);
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copy = GAME_COPY[language];

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    onResetProgress();
    setConfirmReset(false);
    setResetMessage(true);
    window.setTimeout(() => setResetMessage(false), 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1224]/65 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[var(--vv-border-strong)] bg-[var(--vv-surface)] p-6 text-[var(--vv-ink)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--vv-border)] pb-4">
          <h2 id="settings-modal-title" className="font-display text-xl font-bold">
            {copy.settingsTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={copy.closeSettings}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--vv-border)] bg-[var(--vv-surface-inset)] text-[var(--vv-ink)] hover:bg-[var(--vv-surface-hover)] cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {/* Sky & Lighting: Day / Night / Auto */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--vv-ink-secondary)]">
              {copy.appearanceLabel}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'day', label: copy.modeDay, Icon: Sun },
                  { id: 'night', label: copy.modeNight, Icon: Moon },
                  { id: 'auto', label: copy.modeAuto, Icon: Monitor },
                ] as const
              ).map(({ id, label, Icon }) => {
                const active = appearanceMode === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onAppearanceChange(id)}
                    aria-pressed={active}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                      active
                        ? 'border-[#24B8B0] bg-[#24B8B0] text-[#131E31]'
                        : 'border-[var(--vv-border)] bg-[var(--vv-surface-inset)] text-[var(--vv-ink)] hover:bg-[var(--vv-surface-hover)]'
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Background Music & SFX */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-[var(--vv-ink-secondary)]">
                {copy.musicLabel}
              </span>
              <button
                type="button"
                onClick={onToggleMusic}
                aria-pressed={musicPlaying}
                className={`flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                  musicPlaying
                    ? 'border-[#24B8B0] bg-[#24B8B0] text-[#131E31]'
                    : 'border-[var(--vv-border)] bg-[var(--vv-surface-inset)] text-[var(--vv-ink)] hover:bg-[var(--vv-surface-hover)]'
                }`}
              >
                <Music className="h-4 w-4" aria-hidden="true" />
                <span>
                  {musicPlaying
                    ? copy.onLabel
                    : musicPrefSaved
                      ? copy.tapToPlay
                      : copy.offLabel}
                </span>
              </button>
            </div>

            <div className="space-y-2">
              <span className="block text-xs font-semibold text-[var(--vv-ink-secondary)]">
                {copy.sfxLabel}
              </span>
              <button
                type="button"
                onClick={onToggleSfx}
                aria-pressed={sfxEnabled}
                className={`flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                  sfxEnabled
                    ? 'border-[#F2C66D] bg-[#F2C66D] text-[#131E31]'
                    : 'border-[var(--vv-border)] bg-[var(--vv-surface-inset)] text-[var(--vv-ink)] hover:bg-[var(--vv-surface-hover)]'
                }`}
              >
                {sfxEnabled ? (
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <VolumeX className="h-4 w-4" aria-hidden="true" />
                )}
                <span>{sfxEnabled ? copy.onLabel : copy.offLabel}</span>
              </button>
            </div>
          </div>

          {/* Language EN / TH */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--vv-ink-secondary)]">
              <Languages className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{copy.languageLabel}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: 'en', label: 'English' },
                  { id: 'th', label: 'ภาษาไทย' },
                ] as const
              ).map(({ id, label }) => {
                const active = language === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onLanguageChange(id)}
                    aria-pressed={active}
                    className={`rounded-xl border px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${
                      active
                        ? 'border-[#F2C66D] bg-[#F2C66D] text-[#131E31]'
                        : 'border-[var(--vv-border)] bg-[var(--vv-surface-inset)] text-[var(--vv-ink)] hover:bg-[var(--vv-surface-hover)]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3D / 2D World View & Reduced Motion */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-[var(--vv-ink-secondary)]">
                {copy.viewModeLabel}
              </span>
              <button
                type="button"
                disabled={!webglSupported}
                onClick={() => onViewModeChange(viewMode === '3d' ? '2d' : '3d')}
                className={`flex w-full items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
                  !webglSupported
                    ? 'cursor-not-allowed opacity-50 border-[var(--vv-border)] bg-[var(--vv-surface-inset)]'
                    : 'border-[var(--vv-border)] bg-[var(--vv-surface-inset)] text-[var(--vv-ink)] hover:bg-[var(--vv-surface-hover)] cursor-pointer'
                }`}
              >
                {viewMode === '3d' ? (
                  <Globe2 className="h-4 w-4 text-[#24B8B0]" aria-hidden="true" />
                ) : (
                  <Map className="h-4 w-4 text-[#F2C66D]" aria-hidden="true" />
                )}
                <span>{viewMode === '3d' ? copy.view3D : copy.view2D}</span>
              </button>
            </div>

            <div className="space-y-2">
              <span className="block text-xs font-semibold text-[var(--vv-ink-secondary)]">
                {copy.motionLabel}
              </span>
              <button
                type="button"
                onClick={onToggleReducedMotion}
                aria-pressed={reducedMotion}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[var(--vv-border)] bg-[var(--vv-surface-inset)] px-3 py-2 text-xs font-bold text-[var(--vv-ink)] hover:bg-[var(--vv-surface-hover)] transition-colors cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-[var(--vv-teal-ink)]" aria-hidden="true" />
                <span>{reducedMotion ? copy.motionReduced : copy.motionStandard}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Subtle Reset */}
        <div className="mt-6 border-t border-[var(--vv-border)] pt-4 flex items-center justify-between gap-3">
          {resetMessage ? (
            <span className="text-xs font-semibold text-[var(--vv-teal-ink)]">
              {copy.resetDone}
            </span>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--vv-coral-ink)] hover:underline cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {confirmReset
                  ? language === 'en'
                    ? 'Tap again to confirm reset'
                    : 'แตะอีกครั้งเพื่อยืนยันการรีเซ็ต'
                  : copy.resetProgress}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#20304A] px-4 py-2 text-xs font-bold text-[#F7F9FC] dark:bg-[#F2C66D] dark:text-[#131E31] cursor-pointer"
          >
            {copy.closeSettings}
          </button>
        </div>
      </div>
    </div>
  );
}
