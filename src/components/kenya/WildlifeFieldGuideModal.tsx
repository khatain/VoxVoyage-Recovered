import { useState } from 'react';
import { BookOpen, CheckCircle2, Footprints, Lock, Volume2, X, Zap } from 'lucide-react';
import type { AppLanguage, ResolvedAppearance } from '../../types/game';
import { GAME_COPY } from '../../data/i18n';
import { KENYA_DISCOVERY_TASKS } from '../../data/kenyaDiscovery';
import type { KenyaLandmarkId } from '../../data/kenyaWorld';
import { KenyaWildlifeIllustrationSVG } from './KenyaWildlifeIllustrationSVG';

interface WildlifeFieldGuideModalProps {
  language: AppLanguage;
  appearance: ResolvedAppearance;
  discoveredIds: KenyaLandmarkId[];
  builtSentences?: Record<string, string>;
  onAutoWalkToSpot?: (spotId: KenyaLandmarkId) => void;
  onQuickTravelToSpot?: (spotId: KenyaLandmarkId) => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'mode' | 'reward') => void;
  onSpeakText: (englishText: string) => void;
  onClose: () => void;
}

export function WildlifeFieldGuideModal({
  language,
  appearance,
  discoveredIds,
  builtSentences = {},
  onAutoWalkToSpot,
  onQuickTravelToSpot,
  onPlaySfx,
  onSpeakText,
  onClose,
}: WildlifeFieldGuideModalProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';
  const builtCount = KENYA_DISCOVERY_TASKS.filter((t) => Boolean(builtSentences[t.id])).length;

  const firstDiscovered =
    KENYA_DISCOVERY_TASKS.find((t) => discoveredIds.includes(t.id))?.id ??
    KENYA_DISCOVERY_TASKS[0].id;
  const [selectedSpotId, setSelectedSpotId] = useState<KenyaLandmarkId>(firstDiscovered);

  const selectedTask =
    KENYA_DISCOVERY_TASKS.find((t) => t.id === selectedSpotId) ?? KENYA_DISCOVERY_TASKS[0];
  const isSelectedDiscovered = discoveredIds.includes(selectedTask.id);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="kenya-field-guide-title"
      className={`fixed inset-0 z-30 flex items-center justify-center p-3 sm:p-5 ${
        isNight ? 'bg-[#090F1E]/70' : 'bg-[#20304A]/30'
      }`}
    >
      <div
        className={`flex max-h-[88dvh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border shadow-2xl ${
          isNight
            ? 'border-[#C89F5D]/55 bg-[#121C36] text-[#F7F9FC]'
            : 'border-[#DFC69B] bg-[#FAF2DF] text-[#261E14]'
        }`}
      >
        {/* Explorer Field-Notebook Header */}
        <div
          className={`flex items-center justify-between gap-3 border-b px-5 py-4 ${
            isNight
              ? 'border-[#C89F5D]/30 bg-[#182544]'
              : 'border-[#D9BE8F] bg-[#F2E3C2]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                isNight
                  ? 'border-[#F2C66D]/50 bg-[#25365C] text-[#F2C66D]'
                  : 'border-[#B68642]/35 bg-[#E6C78A] text-[#3F2A10]'
              }`}
            >
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="kenya-field-guide-title" className="font-display text-lg sm:text-xl font-extrabold">
                {copy.kenyaFieldGuideTitle}
              </h2>
              <p
                className={`text-xs font-semibold ${
                  isNight ? 'text-[#B6C7DE]' : 'text-[#6A5337]'
                }`}
              >
                {copy.kenyaFieldGuideSubtitle} ·{' '}
                <span className="font-mono-num font-extrabold">
                  {discoveredIds.length}/{KENYA_DISCOVERY_TASKS.length}
                </span>
                {builtCount > 0 && (
                  <>
                    {' '}
                    · {copy.kenyaFieldGuideBuiltSummary}:{' '}
                    <span className="font-mono-num font-extrabold">
                      {builtCount}/{KENYA_DISCOVERY_TASKS.length}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={copy.closeSettings}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border cursor-pointer ${
              isNight
                ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                : 'border-[#8D6E46]/25 bg-[#FFFDF7] text-[#3F2A10] hover:bg-[#F5E9CE]'
            }`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Notebook Tabs + Page Detail */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {/* 5 Field Entry Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {KENYA_DISCOVERY_TASKS.map((task) => {
              const unlocked = discoveredIds.includes(task.id);
              const active = selectedSpotId === task.id;
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => {
                    onPlaySfx('click');
                    setSelectedSpotId(task.id);
                  }}
                  className={`flex flex-col items-center gap-1 rounded-2xl border p-2 text-center transition-colors cursor-pointer ${
                    active
                      ? isNight
                        ? 'border-[#F2C66D] bg-[#22345A] text-white shadow'
                        : 'border-[#9D6D34] bg-white text-[#261E14] shadow'
                      : isNight
                        ? 'border-white/12 bg-[#172340] text-[#B6C7DE] hover:bg-[#1E2E52]'
                        : 'border-[#DFC69B] bg-[#F5EBD3] text-[#5B472E] hover:bg-[#FFF9EB]'
                  }`}
                >
                  <div className="relative">
                    <KenyaWildlifeIllustrationSVG
                      spotId={task.id}
                      className={`h-11 w-11 rounded-xl ${unlocked ? '' : 'opacity-45 grayscale'}`}
                    />
                    <span
                      className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border text-white ${
                        unlocked
                          ? 'border-white bg-[#1B9E77]'
                          : 'border-white/60 bg-[#64748B]'
                      }`}
                    >
                      {unlocked ? (
                        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                      ) : (
                        <Lock className="h-2.5 w-2.5" aria-hidden="true" />
                      )}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold leading-tight line-clamp-2">
                    {task.locationName[language]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Entry Page */}
          <div
            className={`mt-4 rounded-2xl border p-4 sm:p-5 ${
              isNight
                ? 'border-white/15 bg-[#192746]'
                : 'border-[#DFC69B] bg-[#FFFDF7]'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <KenyaWildlifeIllustrationSVG
                  spotId={selectedTask.id}
                  className={`h-14 w-14 rounded-2xl border border-black/10 ${
                    isSelectedDiscovered ? '' : 'opacity-50 grayscale'
                  }`}
                />
                <div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-extrabold ${
                      isSelectedDiscovered
                        ? isNight
                          ? 'bg-[#123A36] text-[#2ED6A3]'
                          : 'bg-[#E3F8F1] text-[#0E7A74]'
                        : isNight
                          ? 'bg-[#28334D] text-[#B6C7DE]'
                          : 'bg-[#EFE5D1] text-[#6A5337]'
                    }`}
                  >
                    {isSelectedDiscovered ? copy.kenyaEntryCompleteLabel : copy.lockedLabel}
                  </span>
                  <h3 className="mt-1 font-display text-lg font-extrabold">
                    {selectedTask.locationName[language]}
                  </h3>
                  <p
                    className={`text-xs font-semibold ${
                      isNight ? 'text-[#F2C66D]' : 'text-[#8C5B19]'
                    }`}
                  >
                    {selectedTask.focus[language]}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {onAutoWalkToSpot && (
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('select');
                      onAutoWalkToSpot(selectedTask.id);
                      onClose();
                    }}
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#059669] px-3 py-1.5 text-xs font-extrabold text-white shadow hover:bg-[#047857] cursor-pointer"
                  >
                    <Footprints className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.navAutoWalkButton}</span>
                  </button>
                )}

                {onQuickTravelToSpot && (
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('select');
                      onQuickTravelToSpot(selectedTask.id);
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

                {isSelectedDiscovered && (
                  <button
                    type="button"
                    onClick={() =>
                      onSpeakText(
                        `${selectedTask.locationName.en}. ${selectedTask.modelSentence.en}`,
                      )
                    }
                    className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold cursor-pointer ${
                      isNight
                        ? 'border-white/20 bg-[#131E31] text-[#F7F9FC] hover:bg-[#273B5E]'
                        : 'border-[#24B8B0]/35 bg-[#E6F5FB] text-[#0E7A74] hover:bg-[#D4ECF8]'
                    }`}
                  >
                    <Volume2 className="h-4 w-4 text-[#24B8B0]" aria-hidden="true" />
                    <span>{copy.jaipurListenButton}</span>
                  </button>
                )}
              </div>
            </div>

            {isSelectedDiscovered ? (
              <>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {selectedTask.vocabulary.map((item) => (
                    <div
                      key={item.word}
                      className={`rounded-xl border px-3 py-2.5 ${
                        isNight
                          ? 'border-white/15 bg-[#121C36]'
                          : 'border-[#E6D5B8] bg-[#FAF3E3]'
                      }`}
                    >
                      <p
                        className={`font-display text-sm font-extrabold ${
                          isNight ? 'text-[#F2C66D]' : 'text-[#261E14]'
                        }`}
                      >
                        {item.word}
                      </p>
                      <p
                        className={`mt-0.5 text-xs font-medium ${
                          isNight ? 'text-[#B6C7DE]' : 'text-[#6A5337]'
                        }`}
                      >
                        {item.th}
                      </p>
                    </div>
                  ))}
                </div>

                <div
                  className={`mt-3.5 rounded-xl border p-3.5 ${
                    isNight
                      ? 'border-white/12 bg-[#121C36]'
                      : 'border-[#E6D5B8] bg-[#FAF3E3]'
                  }`}
                >
                  <p className="text-sm font-semibold leading-relaxed">
                    “{selectedTask.modelSentence.en}”
                  </p>
                  <p
                    className={`mt-1 text-xs leading-relaxed ${
                      isNight ? 'text-[#B6C7DE]' : 'text-[#6A5337]'
                    }`}
                  >
                    {selectedTask.modelSentence.th}
                  </p>
                </div>

                {/* Phase 2C: My Safari Sentences Field Guide Extension */}
                <div
                  className={`mt-3.5 rounded-xl border p-3.5 ${
                    isNight
                      ? 'border-[#F2C66D]/35 bg-[#121C36]'
                      : 'border-[#8C5E3A]/30 bg-[#F7ECD4]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-extrabold uppercase tracking-wider ${
                          isNight ? 'text-[#F2C66D]' : 'text-[#7A4A12]'
                        }`}
                      >
                        {copy.kenyaFieldGuideSentencesHeading}
                      </span>
                      <span className="text-[11px] font-bold opacity-75">·</span>
                      <span
                        className={`text-[11px] font-extrabold ${
                          builtSentences[selectedTask.id]
                            ? isNight
                              ? 'text-[#2ED6A3]'
                              : 'text-[#0E7A74]'
                            : isNight
                              ? 'text-[#B6C7DE]'
                              : 'text-[#6A5337]'
                        }`}
                      >
                        {builtSentences[selectedTask.id]
                          ? copy.kenyaFieldGuideSentenceBuiltBadge
                          : copy.lockedLabel}
                      </span>
                    </div>

                    {builtSentences[selectedTask.id] && (
                      <button
                        type="button"
                        onClick={() => onSpeakText(builtSentences[selectedTask.id])}
                        className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold cursor-pointer ${
                          isNight
                            ? 'border-white/20 bg-[#192746] text-[#F7F9FC] hover:bg-[#273B5E]'
                            : 'border-[#24B8B0]/35 bg-white text-[#0E7A74] hover:bg-[#E6F5FB]'
                        }`}
                      >
                        <Volume2 className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
                        <span>{copy.jaipurListenButton}</span>
                      </button>
                    )}
                  </div>

                  {builtSentences[selectedTask.id] ? (
                    <p className="mt-2 font-display text-sm sm:text-base font-extrabold leading-relaxed">
                      “{builtSentences[selectedTask.id]}”
                    </p>
                  ) : (
                    <p
                      className={`mt-1.5 text-xs leading-relaxed ${
                        isNight ? 'text-[#B6C7DE]' : 'text-[#6A5337]'
                      }`}
                    >
                      {copy.kenyaFieldGuideSentencePending}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div
                className={`mt-4 rounded-xl border border-dashed p-5 text-center ${
                  isNight
                    ? 'border-white/20 bg-[#121C36]/60 text-[#B6C7DE]'
                    : 'border-[#D9BE8F] bg-[#FAF3E3]/70 text-[#6A5337]'
                }`}
              >
                <Lock className="mx-auto h-6 w-6 opacity-75" aria-hidden="true" />
                <p className="mt-2 text-xs sm:text-sm font-semibold">
                  {copy.kenyaFieldGuideLockedHint}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
