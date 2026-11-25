import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Backpack,
  Check,
  Hand,
  Moon,
  Music,
  Palette,
  Settings,
  Shirt,
  Shuffle,
  Sparkles,
  Sun,
  User,
} from 'lucide-react';
import type {
  AppLanguage,
  AvatarConfig,
  ResolvedAppearance,
} from '../../types/game';
import {
  AVATAR_BACKPACK_COLORS,
  AVATAR_HAIR_COLORS,
  AVATAR_HAIR_STYLES,
  AVATAR_MODELS,
  AVATAR_OUTFIT_COLORS,
  AVATAR_OUTFITS,
  AVATAR_SKIN_TONES,
  randomizeAvatarConfig,
  sanitizeExplorerName,
} from '../../data/avatarOptions';
import { GAME_COPY } from '../../data/i18n';
import { AvatarPortraitSVG } from '../avatar/AvatarPortraitSVG';

const LazyAvatarStudioScene = lazy(() =>
  import('../avatar/AvatarStudioScene').then((m) => ({ default: m.AvatarStudioScene })),
);

type StudioTabId = 'body' | 'hair' | 'outfit' | 'backpack';

interface AvatarStudioScreenProps {
  language: AppLanguage;
  initialAvatar: AvatarConfig;
  appearance: ResolvedAppearance;
  reducedMotion: boolean;
  webglSupported: boolean;
  viewMode: '3d' | '2d';
  musicPlaying: boolean;
  onWebGLFailure: () => void;
  onUpdateDraftSfx: (kind?: 'click' | 'select' | 'reward') => void;
  onConfirmAvatar: (finalAvatar: AvatarConfig) => void;
  onBack: (draftAvatar: AvatarConfig) => void;
  onToggleQuickAppearance: () => void;
  onToggleMusic: () => void;
  onOpenSettings: () => void;
}

export function AvatarStudioScreen({
  language,
  initialAvatar,
  appearance,
  reducedMotion,
  webglSupported,
  viewMode,
  musicPlaying,
  onWebGLFailure,
  onUpdateDraftSfx,
  onConfirmAvatar,
  onBack,
  onToggleQuickAppearance,
  onToggleMusic,
  onOpenSettings,
}: AvatarStudioScreenProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';

  const [draft, setDraft] = useState<AvatarConfig>(() => ({ ...initialAvatar }));
  const [nameInput, setNameInput] = useState<string>(() => initialAvatar.displayName);
  const [activeTab, setActiveTab] = useState<StudioTabId>('body');
  const [confirming, setConfirming] = useState(false);
  const [gestureRequest, setGestureRequest] = useState<{
    type: 'greet' | 'celebrate';
    seq: number;
  }>({ type: 'greet', seq: 1 });

  const confirmTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setDraft({ ...initialAvatar });
    setNameInput(initialAvatar.displayName);
  }, [initialAvatar]);

  useEffect(() => {
    return () => {
      if (confirmTimerRef.current !== null) {
        window.clearTimeout(confirmTimerRef.current);
      }
    };
  }, []);

  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24B8B0] focus-visible:ring-offset-1';

  const hudChipClass = isNight
    ? `border-white/15 bg-[#131E31]/88 text-[#F7F9FC] hover:bg-[#20304A] ${focusRing}`
    : `border-[#20304A]/15 bg-[#F7F9FC]/92 text-[#20304A] hover:bg-white ${focusRing}`;

  const dockClass = isNight
    ? 'border-white/15 bg-[#131E31]/92 text-[#F7F9FC]'
    : 'border-[#20304A]/15 bg-[#F7F9FC]/94 text-[#20304A]';

  const optionIdleClass = isNight
    ? `border-white/15 bg-[#1B2942] text-[#E6EEF8] hover:bg-[#243656] ${focusRing}`
    : `border-[#20304A]/15 bg-[#EEF4FB] text-[#20304A] hover:bg-[#DCEAF7] ${focusRing}`;

  const applyDraftChange = (updater: (prev: AvatarConfig) => AvatarConfig) => {
    onUpdateDraftSfx('select');
    setDraft((prev) => updater(prev));
  };

  const handleRandomize = () => {
    onUpdateDraftSfx('select');
    setDraft((prev) => randomizeAvatarConfig(prev));
    setGestureRequest((prev) => ({ type: 'greet', seq: prev.seq + 1 }));
  };

  const handleGreet = () => {
    onUpdateDraftSfx('click');
    setGestureRequest((prev) => ({ type: 'greet', seq: prev.seq + 1 }));
  };

  const handleConfirm = () => {
    if (confirming) return;
    setConfirming(true);
    onUpdateDraftSfx('reward');
    setGestureRequest((prev) => ({ type: 'celebrate', seq: prev.seq + 1 }));

    const finalized: AvatarConfig = {
      ...draft,
      displayName: sanitizeExplorerName(nameInput),
      customizedInPhase1: true,
    };

    const delayMs = reducedMotion ? 260 : 880;
    confirmTimerRef.current = window.setTimeout(() => {
      confirmTimerRef.current = null;
      onConfirmAvatar(finalized);
    }, delayMs);
  };

  const handleBack = () => {
    if (confirmTimerRef.current !== null) {
      window.clearTimeout(confirmTimerRef.current);
      confirmTimerRef.current = null;
      setConfirming(false);
    }
    onUpdateDraftSfx('click');
    onBack({
      ...draft,
      displayName: sanitizeExplorerName(nameInput),
    });
  };

  const tabs: { id: StudioTabId; label: string; Icon: typeof User }[] = [
    { id: 'body', label: copy.tabBodySkin, Icon: User },
    { id: 'hair', label: copy.tabHair, Icon: Sparkles },
    { id: 'outfit', label: copy.tabOutfit, Icon: Shirt },
    { id: 'backpack', label: copy.tabBackpack, Icon: Backpack },
  ];

  const fallback2D = (
    <AvatarPortraitSVG
      avatar={{ ...draft, displayName: sanitizeExplorerName(nameInput) }}
      variant="full"
      appearance={appearance}
      gesture={
        confirming
          ? 'celebrate'
          : gestureRequest.type === 'greet' && gestureRequest.seq > 1
            ? 'greet'
            : 'idle'
      }
    />
  );

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden">
      {/* Full-Screen 3D Character Studio (or Accessible 2D Fallback) */}
      <div className="absolute inset-0">
        {viewMode === '3d' && webglSupported ? (
          <Suspense fallback={fallback2D}>
            <LazyAvatarStudioScene
              avatar={draft}
              appearance={appearance}
              reducedMotion={reducedMotion}
              gestureRequest={gestureRequest}
              onWebGLFailure={onWebGLFailure}
            />
          </Suspense>
        ) : (
          fallback2D
        )}
      </div>

      {/* Floating Minimal Game HUD */}
      <div className="pointer-events-none relative z-10 flex h-full w-full flex-col justify-between p-3 sm:p-5">
        {/* Top Floating Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleBack}
              className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold shadow-sm transition-colors cursor-pointer ${hudChipClass}`}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>{copy.backButton}</span>
            </button>

            <div
              className={`hidden sm:inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold shadow-sm ${
                isNight
                  ? 'border-white/15 bg-[#131E31]/88 text-[#F7F9FC]'
                  : 'border-[#20304A]/15 bg-[#F7F9FC]/92 text-[#20304A]'
              }`}
            >
              <Palette className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
              <span>{copy.avatarStudioTitle}</span>
              {viewMode === '3d' && webglSupported && (
                <span className="opacity-65">· {copy.rotateAvatarHint}</span>
              )}
            </div>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleGreet}
              aria-label={copy.waveButton}
              className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold shadow-sm transition-colors cursor-pointer ${hudChipClass}`}
            >
              <Hand className="h-4 w-4 text-[#D99B26]" aria-hidden="true" />
              <span className="hidden sm:inline">{copy.waveButton}</span>
            </button>

            <button
              type="button"
              onClick={onToggleQuickAppearance}
              aria-label={copy.appearanceLabel}
              className={`inline-flex h-[42px] w-[42px] items-center justify-center rounded-xl border shadow-sm transition-colors cursor-pointer ${hudChipClass}`}
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
              className={`inline-flex h-[42px] w-[42px] items-center justify-center rounded-xl border shadow-sm transition-colors cursor-pointer ${
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
              className={`inline-flex h-[42px] w-[42px] items-center justify-center rounded-xl border shadow-sm transition-colors cursor-pointer ${hudChipClass}`}
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Bottom Floating Customization Dock */}
        <div
          className={`pointer-events-auto mx-auto w-full max-w-3xl rounded-2xl border p-3 sm:p-4 shadow-2xl ${dockClass}`}
        >
          {/* Explorer Name + Randomize + Confirm Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-current/10">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <label htmlFor="vv-explorer-name" className="sr-only">
                {copy.explorerNameLabel}
              </label>
              <input
                id="vv-explorer-name"
                type="text"
                maxLength={18}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder={copy.explorerNamePlaceholder}
                className={`min-h-[42px] w-full max-w-[220px] rounded-xl border px-3 py-2 text-sm font-bold outline-none focus-visible:ring-2 focus-visible:ring-[#24B8B0] ${
                  isNight
                    ? 'border-white/20 bg-[#0E1728] text-[#F7F9FC] placeholder:text-[#8FA3BF]'
                    : 'border-[#20304A]/20 bg-white text-[#20304A] placeholder:text-[#6B7D96]'
                }`}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRandomize}
                className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${optionIdleClass}`}
              >
                <Shuffle className="h-4 w-4 text-[#24B8B0]" aria-hidden="true" />
                <span>{copy.randomizeButton}</span>
              </button>

              <button
                type="button"
                disabled={confirming}
                onClick={handleConfirm}
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-[#F2C66D] px-4 py-2 font-display text-xs sm:text-sm font-bold text-[#131E31] shadow-md hover:bg-[#f6d388] active:scale-[0.98] disabled:opacity-80 transition-all cursor-pointer whitespace-nowrap"
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                <span>{copy.confirmExplorerButton}</span>
              </button>
            </div>
          </div>

          {/* 4 Customization Category Tabs */}
          <div role="tablist" aria-label={copy.avatarStudioTitle} className="mt-2.5 grid grid-cols-4 gap-1.5">
            {tabs.map(({ id, label, Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => {
                    onUpdateDraftSfx('click');
                    setActiveTab(id);
                  }}
                  className={`flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl px-2 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#24B8B0] text-[#131E31]'
                      : isNight
                        ? 'bg-[#1B2942]/70 text-[#C3CFE0] hover:bg-[#243656]'
                        : 'bg-[#E8F1FA] text-[#394E6E] hover:bg-[#DCEAF7]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Category Controls */}
          <div className="mt-3 space-y-2.5">
            {activeTab === 'body' && (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-24 shrink-0 text-xs font-semibold opacity-75">
                    {copy.baseModelLabel}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {AVATAR_MODELS.map((model) => {
                      const active = draft.modelId === model.id;
                      return (
                        <button
                          key={model.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() =>
                            applyDraftChange((prev) => ({ ...prev, modelId: model.id }))
                          }
                          className={`min-h-[38px] rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                            active
                              ? 'border-[#F2C66D] bg-[#F2C66D] text-[#131E31]'
                              : optionIdleClass
                          }`}
                        >
                          {model.label[language]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-24 shrink-0 text-xs font-semibold opacity-75">
                    {copy.skinToneLabel}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_SKIN_TONES.map((tone) => {
                      const active = draft.skinTone === tone.hex;
                      return (
                        <button
                          key={tone.id}
                          type="button"
                          aria-label={tone.label[language]}
                          aria-pressed={active}
                          onClick={() =>
                            applyDraftChange((prev) => ({ ...prev, skinTone: tone.hex }))
                          }
                          className={`h-9 w-9 rounded-full border-2 transition-transform cursor-pointer ${
                            active
                              ? 'scale-110 border-[#24B8B0] ring-2 ring-[#24B8B0]/40'
                              : 'border-white/60 hover:scale-105'
                          }`}
                          style={{ backgroundColor: tone.hex }}
                        />
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'hair' && (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-24 shrink-0 text-xs font-semibold opacity-75">
                    {copy.hairStyleLabel}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {AVATAR_HAIR_STYLES.map((style) => {
                      const active = draft.hairStyle === style.id;
                      return (
                        <button
                          key={style.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() =>
                            applyDraftChange((prev) => ({ ...prev, hairStyle: style.id }))
                          }
                          className={`min-h-[36px] rounded-lg border px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer ${
                            active
                              ? 'border-[#F2C66D] bg-[#F2C66D] text-[#131E31]'
                              : optionIdleClass
                          }`}
                        >
                          {style.label[language]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-24 shrink-0 text-xs font-semibold opacity-75">
                    {copy.hairColorLabel}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_HAIR_COLORS.map((swatch) => {
                      const active = draft.hairColor === swatch.hex;
                      return (
                        <button
                          key={swatch.id}
                          type="button"
                          aria-label={swatch.label[language]}
                          aria-pressed={active}
                          onClick={() =>
                            applyDraftChange((prev) => ({ ...prev, hairColor: swatch.hex }))
                          }
                          className={`h-9 w-9 rounded-full border-2 transition-transform cursor-pointer ${
                            active
                              ? 'scale-110 border-[#24B8B0] ring-2 ring-[#24B8B0]/40'
                              : 'border-white/60 hover:scale-105'
                          }`}
                          style={{ backgroundColor: swatch.hex }}
                        />
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'outfit' && (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-24 shrink-0 text-xs font-semibold opacity-75">
                    {copy.travelOutfitLabel}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {AVATAR_OUTFITS.map((outfit) => {
                      const active = draft.outfitId === outfit.id;
                      return (
                        <button
                          key={outfit.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() =>
                            applyDraftChange((prev) => ({ ...prev, outfitId: outfit.id }))
                          }
                          className={`min-h-[38px] rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                            active
                              ? 'border-[#F2C66D] bg-[#F2C66D] text-[#131E31]'
                              : optionIdleClass
                          }`}
                        >
                          {outfit.label[language]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-24 shrink-0 text-xs font-semibold opacity-75">
                    {copy.outfitColorLabel}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_OUTFIT_COLORS.map((swatch) => {
                      const active = draft.outfitColor === swatch.hex;
                      return (
                        <button
                          key={swatch.id}
                          type="button"
                          aria-label={swatch.label[language]}
                          aria-pressed={active}
                          onClick={() =>
                            applyDraftChange((prev) => ({ ...prev, outfitColor: swatch.hex }))
                          }
                          className={`h-9 w-9 rounded-full border-2 transition-transform cursor-pointer ${
                            active
                              ? 'scale-110 border-[#24B8B0] ring-2 ring-[#24B8B0]/40'
                              : 'border-white/60 hover:scale-105'
                          }`}
                          style={{ backgroundColor: swatch.hex }}
                        />
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'backpack' && (
              <div className="flex flex-wrap items-center justify-between gap-3 py-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-24 shrink-0 text-xs font-semibold opacity-75">
                    {copy.backpackColorLabel}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_BACKPACK_COLORS.map((swatch) => {
                      const active = draft.backpackColor === swatch.hex;
                      return (
                        <button
                          key={swatch.id}
                          type="button"
                          aria-label={swatch.label[language]}
                          aria-pressed={active}
                          onClick={() =>
                            applyDraftChange((prev) => ({ ...prev, backpackColor: swatch.hex }))
                          }
                          className={`h-9 w-9 rounded-full border-2 transition-transform cursor-pointer ${
                            active
                              ? 'scale-110 border-[#24B8B0] ring-2 ring-[#24B8B0]/40'
                              : 'border-white/60 hover:scale-105'
                          }`}
                          style={{ backgroundColor: swatch.hex }}
                        />
                      );
                    })}
                  </div>
                </div>
                {viewMode === '3d' && webglSupported && (
                  <span className="text-[11px] font-medium opacity-75">
                    {copy.rotateAvatarHint}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
