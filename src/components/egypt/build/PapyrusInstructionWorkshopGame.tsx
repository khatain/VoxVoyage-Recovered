import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  RotateCcw,
  ScrollText,
} from 'lucide-react';
import type { AppLanguage, LocalizedText } from '../../../types/game';
import { GAME_COPY } from '../../../data/i18n';
import {
  joinNormalizedTiles,
  validatePapyrusWorkshopSubmission,
  type PapyrusStepDraft,
  type PapyrusWorkshopStepSpec,
  type PapyrusWorkshopVariant,
} from '../../../data/egyptBuild';
import { shuffleArray, shuffleDifferentFrom } from '../../../utils/shuffle';
import { PapyrusStepSceneSVG } from '../EgyptBuildArtwork';
import type { BuildSolvedPayload } from './ExpeditionCommandForgeGame';

interface PapyrusInstructionWorkshopGameProps {
  language: AppLanguage;
  isNight: boolean;
  variant: PapyrusWorkshopVariant;
  challengeKey: string;
  isSolved: boolean;
  onSolved: (payload: BuildSolvedPayload) => void;
  onFeedback: (state: { isCorrect: boolean; message: LocalizedText } | null) => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'reward') => void;
}

interface StepRowState {
  spec: PapyrusWorkshopStepSpec;
  sequencer: string;
  verb: string;
  complement: string;
  shuffledVerbs: string[];
  shuffledComplements: string[];
}

function buildInitialRows(variant: PapyrusWorkshopVariant): StepRowState[] {
  const ordered = shuffleDifferentFrom(
    variant.stepsInCorrectOrder,
    (a, b) => a.stepId === b.stepId,
  );
  return ordered.map((spec) => ({
    spec,
    sequencer: '',
    verb: '',
    complement: '',
    shuffledVerbs: shuffleArray(spec.verbOptions),
    shuffledComplements: shuffleArray(spec.complementOptions),
  }));
}

const ALL_SEQUENCER_CHOICES = ['First,', 'Next,', 'Then,', 'After that,', 'Finally,'];

export function PapyrusInstructionWorkshopGame({
  language,
  isNight,
  variant,
  challengeKey,
  isSolved,
  onSolved,
  onFeedback,
  onPlaySfx,
}: PapyrusInstructionWorkshopGameProps) {
  const copy = GAME_COPY[language];
  const [rows, setRows] = useState<StepRowState[]>(() => buildInitialRows(variant));

  useEffect(() => {
    setRows(buildInitialRows(variant));
  }, [challengeKey, variant]);

  const moveRow = (index: number, delta: -1 | 1) => {
    if (isSolved) return;
    const nextIdx = index + delta;
    if (nextIdx < 0 || nextIdx >= rows.length) return;
    onPlaySfx('select');
    onFeedback(null);
    setRows((prev) => {
      const next = [...prev];
      [next[index], next[nextIdx]] = [next[nextIdx], next[index]];
      return next;
    });
  };

  const updateRowField = (
    index: number,
    field: 'sequencer' | 'verb' | 'complement',
    value: string,
  ) => {
    if (isSolved) return;
    onPlaySfx('select');
    onFeedback(null);
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  const handleReset = () => {
    if (isSolved) return;
    onPlaySfx('click');
    onFeedback(null);
    setRows(buildInitialRows(variant));
  };

  const handleVerify = () => {
    const drafts: PapyrusStepDraft[] = rows.map((row) => ({
      stepId: row.spec.stepId,
      sequencer: row.sequencer,
      verb: row.verb,
      complement: row.complement,
    }));
    const result = validatePapyrusWorkshopSubmission(variant, drafts);
    onFeedback({ isCorrect: result.isCorrect, message: result.feedback });
    if (result.isCorrect) {
      onPlaySfx('reward');
      onSolved({
        instructionText: result.joinedText,
        instructionLines: result.lines,
        thaiScaffold: variant.thaiScaffold,
      });
    } else {
      onPlaySfx('click');
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Scroll Topic Banner */}
      <div
        className={`flex items-start gap-2.5 rounded-2xl border p-3.5 ${
          isNight
            ? 'border-[#E7B43C]/35 bg-[#162340]'
            : 'border-[#FDE68A] bg-[#FFFBEB]'
        }`}
      >
        <ScrollText
          className="h-5 w-5 shrink-0 mt-0.5 text-[#D97706] dark:text-[#FDE68A]"
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-extrabold uppercase tracking-wide text-[#B45309] dark:text-[#FDE68A]">
            {language === 'th' ? 'โจทย์ม้วนปาปิรุส' : 'Papyrus Scroll Brief'}
          </p>
          <p className="mt-0.5 text-xs sm:text-sm font-semibold leading-snug">
            {variant.scrollTopic[language]}
          </p>
        </div>
      </div>

      {/* Step Cards */}
      <div className="space-y-2.5">
        {rows.map((row, idx) => {
          const previewLine = joinNormalizedTiles([
            row.sequencer,
            row.verb,
            row.complement,
          ]);
          const seqChoices = Array.from(
            new Set([
              ...ALL_SEQUENCER_CHOICES,
              ...row.spec.allowedSequencers,
            ]),
          );

          return (
            <div
              key={row.spec.stepId}
              className={`rounded-2xl border p-3 space-y-2.5 ${
                isSolved
                  ? isNight
                    ? 'border-[#10B981]/50 bg-[#0F2A2A]'
                    : 'border-[#059669]/40 bg-[#ECFDF5]'
                  : isNight
                    ? 'border-white/12 bg-[#1B2542]'
                    : 'border-[#E2E8F0] bg-white'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#E7B43C] font-mono-num text-xs font-extrabold text-[#131E31]">
                    {idx + 1}
                  </span>
                  <PapyrusStepSceneSVG
                    sceneKey={row.spec.sceneKey}
                    className="h-10 w-10 shrink-0 rounded-lg"
                  />
                  <div className="min-w-0">
                    <p className="font-display text-xs sm:text-sm font-extrabold truncate">
                      {row.spec.stepCaption[language]}
                    </p>
                    <p
                      className={`text-[11px] font-medium ${
                        isNight ? 'text-[#5EEAD4]' : 'text-[#0F766E]'
                      }`}
                    >
                      {previewLine ||
                        (language === 'th'
                          ? 'เลือกคำเชื่อม + กริยา + ส่วนขยายด้านล่าง'
                          : 'Select sequencer + verb + object phrase below')}
                    </p>
                  </div>
                </div>

                {!isSolved && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveRow(idx, -1)}
                      disabled={idx === 0}
                      aria-label={`Move step ${idx + 1} up`}
                      className={`p-1.5 rounded-lg border disabled:opacity-35 cursor-pointer ${
                        isNight
                          ? 'border-white/15 bg-[#121D36] text-white'
                          : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#334155]'
                      }`}
                    >
                      <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveRow(idx, 1)}
                      disabled={idx === rows.length - 1}
                      aria-label={`Move step ${idx + 1} down`}
                      className={`p-1.5 rounded-lg border disabled:opacity-35 cursor-pointer ${
                        isNight
                          ? 'border-white/15 bg-[#121D36] text-white'
                          : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#334155]'
                      }`}
                    >
                      <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Sequencer */}
                <label className="block space-y-1">
                  <span
                    className={`block text-[10px] font-extrabold uppercase ${
                      isNight ? 'text-[#94A3B8]' : 'text-[#64748B]'
                    }`}
                  >
                    {language === 'th' ? 'คำเชื่อมลำดับ' : 'Sequencer'}
                  </span>
                  <select
                    value={row.sequencer}
                    disabled={isSolved}
                    onChange={(e) =>
                      updateRowField(idx, 'sequencer', e.target.value)
                    }
                    className={`w-full rounded-xl border px-2.5 py-2 text-xs font-bold ${
                      isNight
                        ? 'border-white/15 bg-[#121D36] text-[#F8FAFC]'
                        : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#1E293B]'
                    }`}
                  >
                    <option value="">
                      {language === 'th' ? '-- เลือก --' : '-- Choose --'}
                    </option>
                    {seqChoices.map((seq) => (
                      <option key={seq} value={seq}>
                        {seq}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Verb */}
                <label className="block space-y-1">
                  <span
                    className={`block text-[10px] font-extrabold uppercase ${
                      isNight ? 'text-[#94A3B8]' : 'text-[#64748B]'
                    }`}
                  >
                    {language === 'th' ? 'กริยาคำสั่ง' : 'Action Verb'}
                  </span>
                  <select
                    value={row.verb}
                    disabled={isSolved}
                    onChange={(e) => updateRowField(idx, 'verb', e.target.value)}
                    className={`w-full rounded-xl border px-2.5 py-2 text-xs font-bold ${
                      isNight
                        ? 'border-white/15 bg-[#121D36] text-[#F8FAFC]'
                        : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#1E293B]'
                    }`}
                  >
                    <option value="">
                      {language === 'th' ? '-- เลือก --' : '-- Choose --'}
                    </option>
                    {row.shuffledVerbs.map((verb) => (
                      <option key={verb} value={verb}>
                        {verb}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Complement */}
                <label className="block space-y-1">
                  <span
                    className={`block text-[10px] font-extrabold uppercase ${
                      isNight ? 'text-[#94A3B8]' : 'text-[#64748B]'
                    }`}
                  >
                    {language === 'th' ? 'ส่วนขยาย / กรรม' : 'Object / Phrase'}
                  </span>
                  <select
                    value={row.complement}
                    disabled={isSolved}
                    onChange={(e) =>
                      updateRowField(idx, 'complement', e.target.value)
                    }
                    className={`w-full rounded-xl border px-2.5 py-2 text-xs font-bold ${
                      isNight
                        ? 'border-white/15 bg-[#121D36] text-[#F8FAFC]'
                        : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#1E293B]'
                    }`}
                  >
                    <option value="">
                      {language === 'th' ? '-- เลือก --' : '-- Choose --'}
                    </option>
                    {row.shuffledComplements.map((comp) => (
                      <option key={comp} value={comp}>
                        {comp}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleReset}
          disabled={isSolved}
          className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-bold disabled:opacity-40 cursor-pointer ${
            isNight
              ? 'border-white/15 bg-white/8 text-[#E2E8F0]'
              : 'border-[#CBD5E1] bg-white text-[#334155]'
          }`}
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{copy.egyptDiscoverResetButton}</span>
        </button>

        <button
          type="button"
          onClick={handleVerify}
          disabled={isSolved}
          className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-[#0D9488] px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-[#0F766E] disabled:opacity-50 cursor-pointer"
        >
          {isSolved && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
          <span>{copy.egyptBuildVerifyScrollButton}</span>
        </button>
      </div>
    </div>
  );
}
