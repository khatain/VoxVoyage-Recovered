import { useMemo, useState } from 'react';
import {
  AlertCircle,
  Bookmark,
  CheckCircle2,
  Compass,
  Languages,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import type { AppLanguage, ResolvedAppearance } from '../../types/game';
import { GAME_COPY } from '../../data/i18n';
import type { KenyaDiscoveryTask } from '../../data/kenyaDiscovery';
import type { KenyaLandmarkId } from '../../data/kenyaWorld';
import { KenyaWildlifeIllustrationSVG } from './KenyaWildlifeIllustrationSVG';
import { KenyaSafariHeaderBannerSVG } from './KenyaMiniGameArtwork';
import { createIndexedShuffledChoices } from '../../utils/shuffle';

interface KenyaDiscoveryCardModalProps {
  task: KenyaDiscoveryTask;
  totalCount: number;
  language: AppLanguage;
  appearance: ResolvedAppearance;
  alreadyDiscovered: boolean;
  onPlaySfx: (kind?: 'click' | 'select' | 'mode' | 'reward') => void;
  onSpeakText: (englishText: string) => void;
  onCompleteDiscovery: (spotId: KenyaLandmarkId) => boolean;
  onClose: () => void;
}

const CHOICE_LETTERS = ['A', 'B', 'C'] as const;

export function KenyaDiscoveryCardModal({
  task,
  totalCount,
  language,
  appearance,
  alreadyDiscovered,
  onPlaySfx,
  onSpeakText,
  onCompleteDiscovery,
  onClose,
}: KenyaDiscoveryCardModalProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';

  const shuffledChoices = useMemo(() => createIndexedShuffledChoices(task.choices), [task]);
  const [showThaiHelper, setShowThaiHelper] = useState<boolean>(language === 'th');
  const [selectedChoice, setSelectedChoice] = useState<number | null>(
    alreadyDiscovered ? task.correctIndex : null,
  );
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [solvedNow, setSolvedNow] = useState(false);
  const [completedAllNow, setCompletedAllNow] = useState(false);

  const isCompletedView = alreadyDiscovered || solvedNow;

  const handleSelectChoice = (origIndex: number) => {
    if (isCompletedView) return;
    setSelectedChoice(origIndex);
    if (origIndex === task.correctIndex) {
      setWrongAttempt(false);
      setSolvedNow(true);
      const allDone = onCompleteDiscovery(task.id);
      setCompletedAllNow(allDone);
      onPlaySfx(allDone ? 'reward' : 'select');
    } else {
      setWrongAttempt(true);
      onPlaySfx('click');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="kenya-discovery-card-title"
      className={`fixed inset-0 z-30 flex items-end sm:items-center justify-center p-3 sm:p-5 overflow-y-auto ${
        isNight ? 'bg-[#090F1E]/70' : 'bg-[#20304A]/28'
      }`}
    >
      <div
        className={`w-full max-w-xl overflow-hidden rounded-3xl border-2 transition-colors ${
          isNight
            ? 'border-[#F2C66D]/55 bg-[#121C36] text-[#F7F9FC] shadow-2xl'
            : 'border-[#E6CFA5] bg-[#FFFDF8] text-[#1E2E46] shadow-[0_22px_50px_rgba(32,48,74,0.24)]'
        }`}
      >
        {/* Savanna Expedition Top Horizon Banner */}
        <div
          className={`relative border-b px-4 pt-3.5 pb-3.5 sm:px-6 ${
            isNight
              ? 'border-[#F2C66D]/25 bg-[#172342]'
              : 'border-[#EAD8B6] bg-[#FBF4E4]'
          }`}
        >
          <KenyaSafariHeaderBannerSVG
            spotId={task.id}
            isNight={isNight}
            className="mb-3 h-12 w-full rounded-xl border border-black/10 object-cover"
          />

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Spotlight Wildlife Specimen Frame */}
              <div className="relative shrink-0">
                <div
                  style={{ borderColor: task.accentColor }}
                  className={`rounded-2xl border-2 p-1 shadow-md ${
                    isNight ? 'bg-[#0F172C]' : 'bg-white'
                  }`}
                >
                  <KenyaWildlifeIllustrationSVG
                    spotId={task.id}
                    className="h-18 w-18 sm:h-20 sm:w-20 rounded-xl"
                  />
                </div>
                <span
                  style={{ backgroundColor: task.accentColor }}
                  className="absolute -bottom-1.5 -right-1.5 rounded-lg border-2 border-[#FFFDF8] px-1.5 py-0.5 font-mono-num text-[11px] font-extrabold text-white shadow"
                >
                  {task.order}/{totalCount}
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Compass
                    className="h-3.5 w-3.5 shrink-0"
                    style={{ color: isNight ? '#F2C66D' : task.accentColor }}
                    aria-hidden="true"
                  />
                  <span
                    className={`text-[11px] font-extrabold uppercase tracking-wider ${
                      isCompletedView
                        ? isNight
                          ? 'text-[#2ED6A3]'
                          : 'text-[#0E7A74]'
                        : isNight
                          ? 'text-[#F2C66D]'
                          : 'text-[#9F590B]'
                    }`}
                  >
                    {isCompletedView
                      ? copy.kenyaDiscoveryRecordedBadge
                      : task.focus[language]}
                  </span>
                </div>
                <h2
                  id="kenya-discovery-card-title"
                  className={`mt-1 font-display text-lg sm:text-xl font-extrabold leading-snug ${
                    isNight ? 'text-[#F2C66D]' : 'text-[#20304A]'
                  }`}
                >
                  {task.locationName[language]}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onPlaySfx('click');
                  setShowThaiHelper((s) => !s);
                }}
                className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 ${
                  isNight
                    ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                    : 'border-[#20304A]/15 bg-white text-[#20304A] hover:bg-[#EDF5FD]'
                }`}
              >
                <Languages className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
                <span>{showThaiHelper ? copy.kenyaHideThaiLabel : copy.kenyaShowThaiLabel}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label={copy.closeSettings}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border cursor-pointer ${
                  isNight
                    ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                    : 'border-[#20304A]/15 bg-white text-[#20304A] hover:bg-[#EDF5FD]'
                }`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Expedition Card Content */}
        <div className="p-4 sm:p-6">
          {/* Three Key English Vocabulary Bookmark Cards */}
          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <Bookmark
                className="h-3.5 w-3.5"
                style={{ color: task.accentColor }}
                aria-hidden="true"
              />
              <p
                className={`text-[11px] font-extrabold uppercase tracking-wider ${
                  isNight ? 'text-[#B6C7DE]' : 'text-[#4F6482]'
                }`}
              >
                {copy.kenyaVocabHeading}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {task.vocabulary.map((item) => (
                <div
                  key={item.word}
                  style={{ borderTopColor: task.accentColor }}
                  className={`rounded-xl border border-t-4 px-2.5 py-2.5 text-center shadow-xs ${
                    isNight
                      ? 'border-white/15 bg-[#192746]'
                      : 'border-[#DFD5C0] bg-[#FAF6EC]'
                  }`}
                >
                  <p
                    className={`font-display text-xs sm:text-sm font-extrabold ${
                      isNight ? 'text-[#F2C66D]' : 'text-[#1E2E46]'
                    }`}
                  >
                    {item.word}
                  </p>
                  {showThaiHelper && (
                    <p
                      className={`mt-0.5 text-[11px] font-medium leading-tight ${
                        isNight ? 'text-[#B6C7DE]' : 'text-[#526785]'
                      }`}
                    >
                      {item.th}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Factual Field-Guide Model Sentence + Listen Audio */}
          <div
            className={`mt-3.5 rounded-2xl border-2 p-3.5 sm:p-4 ${
              isNight
                ? 'border-[#24B8B0]/30 bg-[#172645]'
                : 'border-[#CFE3F4] bg-[#F3F8FD]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p
                  className={`text-sm sm:text-base font-bold leading-relaxed ${
                    isNight ? 'text-[#F7F9FC]' : 'text-[#1E2E46]'
                  }`}
                >
                  “{task.modelSentence.en}”
                </p>
                {showThaiHelper && (
                  <p
                    className={`mt-1.5 text-xs leading-relaxed ${
                      isNight ? 'text-[#B6C7DE]' : 'text-[#4F6482]'
                    }`}
                  >
                    {task.modelSentence.th}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  onSpeakText(
                    `${task.vocabulary.map((v) => v.word).join(', ')}. ${task.modelSentence.en}`,
                  )
                }
                className={`inline-flex shrink-0 min-h-[40px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold shadow-xs cursor-pointer ${
                  isNight
                    ? 'border-[#24B8B0]/45 bg-[#123340] text-[#E6FAF5] hover:bg-[#194657]'
                    : 'border-[#24B8B0]/40 bg-white text-[#0E7A74] hover:bg-[#E6F5FB]'
                }`}
              >
                <Volume2 className="h-4 w-4 text-[#24B8B0]" aria-hidden="true" />
                <span>{copy.jaipurListenButton}</span>
              </button>
            </div>
          </div>

          {/* Short Comprehension Check (3 Lettered A/B/C Choices) */}
          <div className="mt-4">
            <p
              className={`font-display text-xs sm:text-sm font-extrabold ${
                isNight ? 'text-[#F7F9FC]' : 'text-[#1E2E46]'
              }`}
            >
              {task.question.en}
            </p>
            {showThaiHelper && (
              <p
                className={`mt-0.5 text-xs ${
                  isNight ? 'text-[#B6C7DE]' : 'text-[#4F6482]'
                }`}
              >
                {task.question.th}
              </p>
            )}

            <div className="mt-2.5 flex flex-col gap-2">
              {shuffledChoices.map(({ item: choice, originalIndex }, visualIdx) => {
                const isSelected = selectedChoice === originalIndex;
                const isCorrectChoice = originalIndex === task.correctIndex;
                const showAsCorrect = isCompletedView && isCorrectChoice;
                const showAsWrong = !isCompletedView && wrongAttempt && isSelected && !isCorrectChoice;

                return (
                  <button
                    key={`${task.id}_${originalIndex}`}
                    type="button"
                    disabled={isCompletedView}
                    onClick={() => handleSelectChoice(originalIndex)}
                    className={`flex w-full min-h-[46px] items-center justify-between gap-2.5 rounded-xl border-2 px-3 py-2.5 text-left text-xs sm:text-sm font-semibold transition-colors ${
                      isCompletedView ? 'cursor-default' : 'cursor-pointer'
                    } ${
                      showAsCorrect
                        ? isNight
                          ? 'border-[#2ED6A3] bg-[#133834] text-[#F7F9FC]'
                          : 'border-[#1B9E77] bg-[#E8FBF5] text-[#113D31]'
                        : showAsWrong
                          ? isNight
                            ? 'border-[#E86D4E] bg-[#361E24] text-[#FFD1C7]'
                            : 'border-[#D95338] bg-[#FFF0EC] text-[#8F2816]'
                          : isNight
                            ? 'border-white/15 bg-[#1A2847] text-[#E2ECF9] hover:border-[#F2C66D]/60 hover:bg-[#22345B]'
                            : 'border-[#20304A]/12 bg-white text-[#20304A] hover:border-[#24B8B0] hover:bg-[#F3FAFD]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono-num text-xs font-extrabold ${
                          showAsCorrect
                            ? 'bg-[#2ED6A3] text-[#131E31]'
                            : showAsWrong
                              ? 'bg-[#E86D4E] text-white'
                              : isNight
                                ? 'bg-white/10 text-[#F2C66D]'
                                : 'bg-[#EEF4FA] text-[#20304A]'
                        }`}
                        aria-hidden="true"
                      >
                        {CHOICE_LETTERS[visualIdx] ?? visualIdx + 1}
                      </span>
                      <div className="min-w-0">
                        <span className="block">{choice.en}</span>
                        {showThaiHelper && (
                          <span
                            className={`block text-[11px] font-normal ${
                              isNight ? 'text-[#B6C7DE]' : 'text-[#526785]'
                            }`}
                          >
                            {choice.th}
                          </span>
                        )}
                      </div>
                    </div>
                    {showAsCorrect && (
                      <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-[#2ED6A3]" aria-hidden="true" />
                    )}
                    {showAsWrong && (
                      <AlertCircle className="h-4.5 w-4.5 shrink-0 text-[#E86D4E]" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Banner */}
          {wrongAttempt && !isCompletedView && (
            <div
              role="status"
              className={`mt-3 flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold ${
                isNight
                  ? 'border-[#E86D4E]/50 bg-[#361E24] text-[#FFD1C7]'
                  : 'border-[#E86D4E]/45 bg-[#FFF2EE] text-[#9A3420]'
              }`}
            >
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{copy.kenyaTryAgainFeedback}</span>
            </div>
          )}

          {isCompletedView && (
            <div
              className={`mt-3.5 flex items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 ${
                isNight
                  ? 'border-[#2ED6A3]/55 bg-[#102E2C] text-[#D8F7EE]'
                  : 'border-[#24B8B0]/45 bg-[#EAFBF7] text-[#11423A]'
              }`}
            >
              <div className="flex items-center gap-2.5 text-xs font-bold">
                {completedAllNow ? (
                  <Sparkles className="h-5 w-5 shrink-0 text-[#F2C66D]" aria-hidden="true" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#2ED6A3]" aria-hidden="true" />
                )}
                <span>
                  {completedAllNow
                    ? copy.kenyaDiscoverCompleteInlineNote
                    : copy.kenyaDiscoverySavedNote}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="shrink-0 min-h-[40px] rounded-xl bg-[#F2C66D] px-4 py-2 font-display text-xs sm:text-sm font-extrabold text-[#131E31] shadow hover:bg-[#f7d487] cursor-pointer"
              >
                {copy.jaipurNextButton}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
