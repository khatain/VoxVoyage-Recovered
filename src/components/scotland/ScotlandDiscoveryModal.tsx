import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Coffee,
  Compass,
  HelpCircle,
  Landmark,
  Layers,
  MapPin,
  Music,
  RefreshCw,
  Sparkles,
  Users,
  Utensils,
  Volume2,
  X,
} from 'lucide-react';
import type { AppLanguage, LocalizedText, ResolvedAppearance } from '../../types/game';
import { GAME_COPY } from '../../data/i18n';
import {
  COMPARISON_BRIDGE_SAMPLES,
  COMPARISON_COMPASS_TOKENS,
  FESTIVAL_RHYTHM_PROBES,
  FESTIVAL_THAI_COMPARISON_CHECK,
  FOOD_INVESTIGATION_TRAYS,
  getScotlandEvidenceById,
  TARTAN_MATCH_CARDS,
  TARTAN_PURPOSE_OPTIONS,
  TARTAN_REFLECTION_CHECK,
  VILLAGE_DETECTIVE_CATEGORIES,
  VILLAGE_DETECTIVE_CLUES,
  type ComparisonZone,
  type ScotlandDifficultyMode,
  type VillageEvidenceCategory,
} from '../../data/scotlandDiscovery';
import type { ScotlandLandmarkId } from '../../data/scotlandWorld';
import { voxAudio } from '../../utils/audioEngine';
import { shuffleArray } from '../../utils/shuffle';
import { DioramaImage } from '../common/DioramaImage';
import scotlandDioramaImg from '../../assets/images/scotland_day_highlands_1795070978084.jpg';
import { ScotlandStationIllustrationSVG } from './ScotlandCulturalIllustrationSVG';
import {
  ScotlandCeramicMixingBowlSVG,
  ScotlandDishIllustrationSVG,
  ScotlandInstrumentBadgeSVG,
  ScotlandTartanRibbonDivider,
  ScotlandTextileSwatchSVG,
  ScotlandZoneCrestSVG,
} from './ScotlandMiniGameArtwork';

const VILLAGE_BUCKET_ICONS: Record<VillageEvidenceCategory, typeof Coffee> = {
  everyday_life: Coffee,
  traditional_culture: Sparkles,
  community_spaces: Users,
  historic_heritage: Landmark,
};

interface ScotlandDiscoveryModalProps {
  stationId: ScotlandLandmarkId;
  language: AppLanguage;
  appearance: ResolvedAppearance;
  alreadyCollected: boolean;
  difficultyMode: ScotlandDifficultyMode;
  onDifficultyChange: (mode: ScotlandDifficultyMode) => void;
  onCompleteStation: (stationId: ScotlandLandmarkId) => void;
  onOpenJournal: (stationId: ScotlandLandmarkId) => void;
  onInspectLandmarkInfo: () => void;
  onClose: () => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'reward') => void;
}

interface FeedbackState {
  tone: 'success' | 'retry';
  message: LocalizedText;
}

const WARP_COLORS = ['#1E3A5F', '#2E6B5E', '#5664B8'];
const WEFT_COLORS = ['#C84B43', '#F2C66D', '#2B8C7E'];

export function ScotlandDiscoveryModal({
  stationId,
  language,
  appearance,
  alreadyCollected,
  difficultyMode,
  onDifficultyChange,
  onCompleteStation,
  onOpenJournal,
  onInspectLandmarkInfo,
  onClose,
  onPlaySfx,
}: ScotlandDiscoveryModalProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';
  const evidence = getScotlandEvidenceById(stationId);

  const [attemptNonce, setAttemptNonce] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [stationDone, setStationDone] = useState(false);

  const shuffledVillageCategories = useMemo(
    () => shuffleArray(VILLAGE_DETECTIVE_CATEGORIES),
    [stationId, attemptNonce],
  );
  const shuffledTartanCards = useMemo(
    () => shuffleArray(TARTAN_MATCH_CARDS),
    [stationId, attemptNonce],
  );
  const shuffledTartanPurposes = useMemo(
    () => shuffleArray(TARTAN_PURPOSE_OPTIONS),
    [stationId, attemptNonce],
  );
  const shuffledTartanReflectionOpts = useMemo(
    () => shuffleArray(TARTAN_REFLECTION_CHECK.options),
    [stationId, attemptNonce],
  );
  const shuffledPantryByTray = useMemo(
    () =>
      Object.fromEntries(
        FOOD_INVESTIGATION_TRAYS.map((tray) => [tray.id, shuffleArray(tray.pantryShelf)]),
      ),
    [stationId, attemptNonce],
  );
  const shuffledFoodContrastByTray = useMemo(
    () =>
      Object.fromEntries(
        FOOD_INVESTIGATION_TRAYS.map((tray) => [tray.id, shuffleArray(tray.thaiContrastOptions)]),
      ),
    [stationId, attemptNonce],
  );
  const shuffledRolesByProbe = useMemo(
    () =>
      Object.fromEntries(
        FESTIVAL_RHYTHM_PROBES.map((probe) => [probe.id, shuffleArray(probe.roleOptions)]),
      ),
    [stationId, attemptNonce],
  );
  const shuffledFestivalReflectionOpts = useMemo(
    () => shuffleArray(FESTIVAL_THAI_COMPARISON_CHECK.options),
    [stationId, attemptNonce],
  );
  const shuffledCompassTokens = useMemo(
    () => shuffleArray(COMPARISON_COMPASS_TOKENS),
    [stationId, attemptNonce],
  );

  // Station 1: Village Square Hotspot Scene + Category Buckets
  const [selectedClueId, setSelectedClueId] = useState(VILLAGE_DETECTIVE_CLUES[0].id);
  const [solvedClueIds, setSolvedClueIds] = useState<string[]>([]);

  // Station 2: Interactive Tartan Loom + Dual-Column Match Board + Reflection
  const [warpIdx, setWarpIdx] = useState(0);
  const [weftIdx, setWeftIdx] = useState(0);
  const [toggledWarp, setToggledWarp] = useState(false);
  const [toggledWeft, setToggledWeft] = useState(false);
  const [loomBoardUnlocked, setLoomBoardUnlocked] = useState(false);
  const [selectedTextileId, setSelectedTextileId] = useState(() => shuffledTartanCards[0].id);
  const [matchedTextileIds, setMatchedTextileIds] = useState<string[]>([]);
  const [tartanReflectionPassed, setTartanReflectionPassed] = useState(false);

  // Station 3: Pantry Shelf -> Mixing Bowl -> Thai Contrast
  const [selectedTrayId, setSelectedTrayId] = useState(FOOD_INVESTIGATION_TRAYS[0].id);
  const [bowlIngredientsByTray, setBowlIngredientsByTray] = useState<Record<string, string[]>>({});
  const [solvedTrayIds, setSolvedTrayIds] = useState<string[]>([]);

  // Station 4: Blind Mystery Sound Stage + Rhythm Equalizer + Festival Reflection
  const [selectedProbeId, setSelectedProbeId] = useState<'bagpipe' | 'fiddle' | 'bodhran'>(
    'bagpipe',
  );
  const [playingInstrument, setPlayingInstrument] = useState<'bagpipe' | 'fiddle' | 'bodhran' | null>(
    null,
  );
  const [solvedProbeIds, setSolvedProbeIds] = useState<string[]>([]);
  const [festivalReflectionPassed, setFestivalReflectionPassed] = useState(false);

  // Station 5: 3-Column Visual Comparison Board + Language Bridges
  const [selectedCompassTokenId, setSelectedCompassTokenId] = useState(
    () => shuffledCompassTokens[0].id,
  );
  const [sortedTokenZones, setSortedTokenZones] = useState<Record<string, ComparisonZone>>({});
  const [activeBridgePhrase, setActiveBridgePhrase] = useState(COMPARISON_BRIDGE_SAMPLES[0].phrase);

  useEffect(() => {
    setSelectedTextileId(shuffledTartanCards[0].id);
  }, [shuffledTartanCards]);

  useEffect(() => {
    setSelectedCompassTokenId(shuffledCompassTokens[0].id);
  }, [shuffledCompassTokens]);

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const speakEnglish = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.94;
    utterance.pitch = 1.04;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        stopSpeech();
        onPlaySfx('click');
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      stopSpeech();
    };
  }, [onClose, onPlaySfx]);

  useEffect(() => {
    if (!playingInstrument) return;
    const timer = window.setTimeout(() => setPlayingInstrument(null), 1500);
    return () => window.clearTimeout(timer);
  }, [playingInstrument]);

  const finishStation = () => {
    if (stationDone) return;
    setStationDone(true);
    onPlaySfx('reward');
    onCompleteStation(stationId);
  };

  const resetCurrentStation = () => {
    onPlaySfx('click');
    setAttemptNonce((n) => n + 1);
    setFeedback(null);
    setShowHint(false);
    setStationDone(false);
    setSolvedClueIds([]);
    setSelectedClueId(VILLAGE_DETECTIVE_CLUES[0].id);
    setWarpIdx(0);
    setWeftIdx(0);
    setToggledWarp(false);
    setToggledWeft(false);
    setLoomBoardUnlocked(false);
    setMatchedTextileIds([]);
    setTartanReflectionPassed(false);
    setBowlIngredientsByTray({});
    setSolvedTrayIds([]);
    setSelectedTrayId(FOOD_INVESTIGATION_TRAYS[0].id);
    setSolvedProbeIds([]);
    setSelectedProbeId('bagpipe');
    setFestivalReflectionPassed(false);
    setSortedTokenZones({});
  };

  // === STATION 1 HANDLER ===
  const handleClassifyVillageClue = (category: VillageEvidenceCategory) => {
    const clue =
      VILLAGE_DETECTIVE_CLUES.find((c) => c.id === selectedClueId) ?? VILLAGE_DETECTIVE_CLUES[0];
    if (solvedClueIds.includes(clue.id)) return;
    if (clue.correctCategory === category) {
      onPlaySfx('select');
      const nextSolved = [...solvedClueIds, clue.id];
      setSolvedClueIds(nextSolved);
      setFeedback({ tone: 'success', message: clue.categoryExplanation[category] });
      const nextUnsolved = VILLAGE_DETECTIVE_CLUES.find((c) => !nextSolved.includes(c.id));
      if (nextUnsolved) {
        setSelectedClueId(nextUnsolved.id);
      } else {
        finishStation();
      }
    } else {
      onPlaySfx('click');
      setFeedback({ tone: 'retry', message: clue.categoryExplanation[category] });
    }
  };

  // === STATION 2 HANDLERS ===
  const handlePairTextilePurpose = (purposeId: string) => {
    const card =
      TARTAN_MATCH_CARDS.find((c) => c.id === selectedTextileId) ?? TARTAN_MATCH_CARDS[0];
    if (matchedTextileIds.includes(card.id)) return;
    const chosenOpt =
      TARTAN_PURPOSE_OPTIONS.find((o) => o.id === purposeId) ?? TARTAN_PURPOSE_OPTIONS[0];
    if (card.correctPurposeId === purposeId) {
      onPlaySfx('select');
      const nextMatched = [...matchedTextileIds, card.id];
      setMatchedTextileIds(nextMatched);
      setFeedback({
        tone: 'success',
        message: {
          en: `Paired "${card.title.en}"! Notice how tartan wool and Thai Praewa silk express heritage differently.`,
          th: `จับคู่ “${card.title.th}” สำเร็จ! สังเกตความต่างระหว่างผ้าทาร์ทันขนสัตว์และผ้าไหมแพรวาไทย`,
        },
      });
      const nextUnmatched = TARTAN_MATCH_CARDS.find((c) => !nextMatched.includes(c.id));
      if (nextUnmatched) setSelectedTextileId(nextUnmatched.id);
    } else {
      onPlaySfx('click');
      setFeedback({ tone: 'retry', message: chosenOpt.wrongExplanation });
    }
  };

  const handlePickTartanReflection = (optionId: string) => {
    const opt =
      TARTAN_REFLECTION_CHECK.options.find((o) => o.id === optionId) ??
      TARTAN_REFLECTION_CHECK.options[0];
    if (opt.isCorrect) {
      setTartanReflectionPassed(true);
      setFeedback({ tone: 'success', message: opt.feedback });
      finishStation();
    } else {
      onPlaySfx('click');
      setFeedback({ tone: 'retry', message: opt.feedback });
    }
  };

  // === STATION 3 HANDLERS ===
  const handlePickPantryItem = (trayId: string, optionId: string) => {
    const tray =
      FOOD_INVESTIGATION_TRAYS.find((t) => t.id === trayId) ?? FOOD_INVESTIGATION_TRAYS[0];
    const option = tray.pantryShelf.find((p) => p.id === optionId);
    if (!option) return;

    const currentBowl = bowlIngredientsByTray[tray.id] ?? [];
    if (currentBowl.includes(option.id)) return;

    if (option.isScottishIngredient) {
      onPlaySfx('select');
      setBowlIngredientsByTray((prev) => ({
        ...prev,
        [tray.id]: [...(prev[tray.id] ?? []), option.id],
      }));
      setFeedback({ tone: 'success', message: option.feedback });
    } else {
      onPlaySfx('click');
      setFeedback({ tone: 'retry', message: option.feedback });
    }
  };

  const handlePickFoodContrast = (optionId: string) => {
    const tray =
      FOOD_INVESTIGATION_TRAYS.find((t) => t.id === selectedTrayId) ??
      FOOD_INVESTIGATION_TRAYS[0];
    const opt =
      tray.thaiContrastOptions.find((o) => o.id === optionId) ?? tray.thaiContrastOptions[0];
    if (opt.id === tray.thaiContrastId) {
      onPlaySfx('select');
      const nextSolved = solvedTrayIds.includes(tray.id)
        ? solvedTrayIds
        : [...solvedTrayIds, tray.id];
      setSolvedTrayIds(nextSolved);
      setFeedback({ tone: 'success', message: opt.explanation });
      const nextRemaining = FOOD_INVESTIGATION_TRAYS.find((t) => !nextSolved.includes(t.id));
      if (nextRemaining) {
        setSelectedTrayId(nextRemaining.id);
      } else {
        finishStation();
      }
    } else {
      onPlaySfx('click');
      setFeedback({ tone: 'retry', message: opt.explanation });
    }
  };

  // === STATION 4 HANDLERS ===
  const handlePickInstrumentRole = (roleId: string) => {
    const probe =
      FESTIVAL_RHYTHM_PROBES.find((p) => p.id === selectedProbeId) ?? FESTIVAL_RHYTHM_PROBES[0];
    const opt = probe.roleOptions.find((o) => o.id === roleId) ?? probe.roleOptions[0];
    if (opt.id === probe.correctRoleId) {
      onPlaySfx('select');
      const nextSolved = solvedProbeIds.includes(probe.id)
        ? solvedProbeIds
        : [...solvedProbeIds, probe.id];
      setSolvedProbeIds(nextSolved);
      setFeedback({ tone: 'success', message: opt.explanation });
      const nextRemaining = FESTIVAL_RHYTHM_PROBES.find((p) => !nextSolved.includes(p.id));
      if (nextRemaining) {
        setSelectedProbeId(nextRemaining.id);
      }
    } else {
      onPlaySfx('click');
      setFeedback({ tone: 'retry', message: opt.explanation });
    }
  };

  const handlePickFestivalReflection = (optionId: string) => {
    const opt =
      FESTIVAL_THAI_COMPARISON_CHECK.options.find((o) => o.id === optionId) ??
      FESTIVAL_THAI_COMPARISON_CHECK.options[0];
    if (opt.isCorrect) {
      setFestivalReflectionPassed(true);
      setFeedback({ tone: 'success', message: opt.feedback });
      finishStation();
    } else {
      onPlaySfx('click');
      setFeedback({ tone: 'retry', message: opt.feedback });
    }
  };

  // === STATION 5 HANDLER ===
  const handleSortCompassToken = (zone: ComparisonZone) => {
    const token =
      COMPARISON_COMPASS_TOKENS.find((t) => t.id === selectedCompassTokenId) ??
      COMPARISON_COMPASS_TOKENS[0];
    if (sortedTokenZones[token.id]) return;
    if (token.correctZone === zone) {
      onPlaySfx('select');
      const nextSorted = { ...sortedTokenZones, [token.id]: zone };
      setSortedTokenZones(nextSorted);
      setFeedback({ tone: 'success', message: token.zoneFeedback[zone] });
      const nextUnsorted = COMPARISON_COMPASS_TOKENS.find((t) => !nextSorted[t.id]);
      if (nextUnsorted) {
        setSelectedCompassTokenId(nextUnsorted.id);
      } else {
        finishStation();
      }
    } else {
      onPlaySfx('click');
      setFeedback({ tone: 'retry', message: token.zoneFeedback[zone] });
    }
  };

  const currentHintText: LocalizedText = (() => {
    if (stationId === 'highland_village_square') {
      return (
        VILLAGE_DETECTIVE_CLUES.find((c) => c.id === selectedClueId) ?? VILLAGE_DETECTIVE_CLUES[0]
      ).hint;
    }
    if (stationId === 'tartan_heritage_workshop') {
      return (TARTAN_MATCH_CARDS.find((c) => c.id === selectedTextileId) ?? TARTAN_MATCH_CARDS[0])
        .hint;
    }
    if (stationId === 'highland_food_market') {
      return (
        FOOD_INVESTIGATION_TRAYS.find((t) => t.id === selectedTrayId) ?? FOOD_INVESTIGATION_TRAYS[0]
      ).hint;
    }
    if (stationId === 'highland_games_ground') {
      return (
        FESTIVAL_RHYTHM_PROBES.find((p) => p.id === selectedProbeId) ?? FESTIVAL_RHYTHM_PROBES[0]
      ).hint;
    }
    return (
      COMPARISON_COMPASS_TOKENS.find((t) => t.id === selectedCompassTokenId) ??
      COMPARISON_COMPASS_TOKENS[0]
    ).hint;
  })();

  const cardSurface = isNight
    ? 'border-white/12 bg-[#172442] text-[#F7F9FC]'
    : 'border-[#CBD5E1] bg-white text-[#1E2E46]';

  const subtlePanel = isNight
    ? 'border-white/10 bg-[#111A31] text-[#E2ECF9]'
    : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#1E2E46]';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="scotland-station-modal-title"
      className={`fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-5 ${
        isNight ? 'bg-[#090F1E]/72' : 'bg-[#20304A]/32'
      }`}
    >
      <div
        className={`flex max-h-[91dvh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border-2 shadow-2xl ${
          isNight
            ? 'border-[#3A7D6C]/70 bg-[#121C36] text-[#F7F9FC]'
            : 'border-[#B8D5CC] bg-[#FFFDF8] text-[#1E2E46]'
        }`}
      >
        <ScotlandTartanRibbonDivider />

        {/* Top Modal Header */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 ${
            isNight ? 'border-white/12 bg-[#162340]' : 'border-[#D5E6E1] bg-[#EEF6F4]'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0 flex items-center">
              <div className="hidden sm:block h-12 w-16 overflow-hidden rounded-xl border border-black/15 shadow-xs">
                <DioramaImage
                  src={scotlandDioramaImg}
                  alt={evidence.landmarkTitle[language]}
                  title={evidence.landmarkTitle[language]}
                  accentColor="#2B8C7E"
                  appearance={appearance}
                  className="h-full w-full object-cover"
                />
              </div>
              <ScotlandStationIllustrationSVG
                stationId={stationId}
                className="sm:-ml-3 h-12 w-12 shrink-0 rounded-xl border-2 border-[#FFFDF8] shadow-sm"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#2B8C7E] dark:text-[#2ED6A3]">
                {evidence.stationTitle[language]} · {evidence.mechanicLabel[language]}
              </p>
              <h2
                id="scotland-station-modal-title"
                className="truncate font-display text-lg sm:text-xl font-extrabold"
              >
                {evidence.landmarkTitle[language]}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* A2 Guided / B1 Challenge Switcher */}
            <div
              className={`inline-flex rounded-xl border p-0.5 text-xs font-bold ${
                isNight ? 'border-white/15 bg-[#0F182F]' : 'border-[#CBD5E1] bg-white'
              }`}
              role="group"
              aria-label={copy.scotlandScaffoldModeLabel}
            >
              <button
                type="button"
                onClick={() => {
                  onPlaySfx('click');
                  onDifficultyChange('a2');
                }}
                className={`min-h-[34px] rounded-lg px-2.5 py-1 transition-colors cursor-pointer ${
                  difficultyMode === 'a2'
                    ? 'bg-[#2ED6A3] text-[#131E31]'
                    : isNight
                      ? 'text-[#C2D0E3] hover:text-white'
                      : 'text-[#475569] hover:text-[#1E2E46]'
                }`}
              >
                {copy.scotlandModeA2Label}
              </button>
              <button
                type="button"
                onClick={() => {
                  onPlaySfx('click');
                  onDifficultyChange('b1');
                }}
                className={`min-h-[34px] rounded-lg px-2.5 py-1 transition-colors cursor-pointer ${
                  difficultyMode === 'b1'
                    ? 'bg-[#F2C66D] text-[#131E31]'
                    : isNight
                      ? 'text-[#C2D0E3] hover:text-white'
                      : 'text-[#475569] hover:text-[#1E2E46]'
                }`}
              >
                {copy.scotlandModeB1Label}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onPlaySfx('click');
                setShowHint((h) => !h);
              }}
              aria-pressed={showHint}
              className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                showHint
                  ? 'border-[#D99B26] bg-[#F2C66D] text-[#131E31]'
                  : cardSurface
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{copy.scotlandHintButton}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                stopSpeech();
                onPlaySfx('click');
                onClose();
              }}
              aria-label={copy.scotlandCloseButton}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border cursor-pointer ${cardSurface}`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Interactive Body */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
          {showHint && (
            <div
              className={`rounded-2xl border p-3.5 text-xs sm:text-sm font-medium ${
                isNight
                  ? 'border-[#D99B26]/50 bg-[#2C2214] text-[#FBE6B8]'
                  : 'border-[#FCD34D] bg-[#FFFBEB] text-[#78350F]'
              }`}
            >
              <span className="font-extrabold uppercase tracking-wide">{copy.scotlandHintButton}: </span>
              {currentHintText[language]}
            </div>
          )}

          {stationDone ? (
            <div
              className={`rounded-2xl border p-5 sm:p-6 ${
                isNight
                  ? 'border-[#2ED6A3]/55 bg-[#12332F]/80 text-[#F7F9FC]'
                  : 'border-[#6EE7B7] bg-[#ECFDF5] text-[#064E3B]'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#2ED6A3] text-[#131E31]">
                    <Sparkles className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-extrabold">
                      {copy.scotlandStationSavedTitle}
                    </h3>
                    <p className="text-xs font-semibold opacity-90">
                      {alreadyCollected
                        ? copy.scotlandStationReplayNote
                        : copy.scotlandStationFirstSaveNote}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={resetCurrentStation}
                  className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${cardSurface}`}
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.scotlandReplayActivityButton}</span>
                </button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className={`rounded-xl border p-3.5 text-xs sm:text-sm ${cardSurface}`}>
                  <p className="font-extrabold text-[#2B8C7E] dark:text-[#2ED6A3]">
                    {copy.scotlandJournalFactLabel}
                  </p>
                  <p className="mt-1 leading-relaxed">{evidence.scottishFact[language]}</p>
                </div>
                <div className={`rounded-xl border p-3.5 text-xs sm:text-sm ${cardSurface}`}>
                  <p className="font-extrabold text-[#D99B26]">
                    {copy.scotlandJournalThaiLinkLabel}
                  </p>
                  <p className="mt-1 leading-relaxed">{evidence.thailandConnection[language]}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('select');
                    onOpenJournal(stationId);
                  }}
                  className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${cardSurface}`}
                >
                  <BookOpen className="h-4 w-4 text-[#24B8B0]" aria-hidden="true" />
                  <span>{copy.scotlandOpenJournalButton}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('click');
                    onClose();
                  }}
                  className="inline-flex min-h-[42px] items-center justify-center rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-xs font-extrabold text-[#131E31] shadow hover:bg-[#49e2b3] cursor-pointer"
                >
                  {copy.scotlandContinueExploringButton}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* === MECHANIC 1: INTERACTIVE VILLAGE SCENE HOTSPOT MAP & BUCKETS === */}
              {stationId === 'highland_village_square' && (
                <div className="space-y-4">
                  <div className={`rounded-2xl border p-4 ${subtlePanel}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-extrabold uppercase tracking-wide text-[#2B8C7E] dark:text-[#2ED6A3]">
                        {copy.scotlandHotspotMapTitle}
                      </p>
                      <span className="font-mono-num text-xs font-extrabold">
                        {solvedClueIds.length}/{VILLAGE_DETECTIVE_CLUES.length}
                      </span>
                    </div>

                    {/* Spatial Interactive Village Scene Backdrop with 4 Clickable Hotspot Pins */}
                    <div
                      className={`relative mt-3 overflow-hidden rounded-2xl border ${
                        isNight ? 'border-white/15 bg-[#18294A]' : 'border-[#CBD5E1] bg-[#E8F4F2]'
                      }`}
                    >
                      <svg
                        viewBox="0 0 640 210"
                        className="h-40 w-full sm:h-44"
                        role="img"
                        aria-label="Highland Village Square Interactive Scene"
                      >
                        {/* Sky & Highland hills */}
                        <rect width="640" height="210" fill={isNight ? '#162544' : '#DFF1F6'} />
                        {isNight ? (
                          <>
                            <circle cx="570" cy="36" r="14" fill="#F2C66D" opacity="0.85" />
                            <circle cx="140" cy="28" r="2" fill="#FFF8E6" opacity="0.8" />
                            <circle cx="330" cy="22" r="1.8" fill="#F2C66D" opacity="0.75" />
                          </>
                        ) : (
                          <>
                            <circle cx="570" cy="36" r="18" fill="#FDE68A" opacity="0.85" />
                            <ellipse cx="148" cy="34" rx="34" ry="11" fill="#FFFFFF" opacity="0.75" />
                            <ellipse cx="420" cy="30" rx="28" ry="9" fill="#FFFFFF" opacity="0.7" />
                          </>
                        )}
                        <path
                          d="M0 128 Q130 62 280 118 T540 94 L640 120 L640 210 L0 210 Z"
                          fill={isNight ? '#243F49' : '#9DCAB9'}
                        />
                        <rect x="0" y="128" width="640" height="82" fill={isNight ? '#223348' : '#D5D9CE'} />
                        {/* Cobblestone accents */}
                        {[70, 145, 225, 360, 445, 520].map((cx) => (
                          <ellipse key={cx} cx={cx} cy="174" rx="20" ry="6" fill={isNight ? '#2D415A' : '#C2C7BA'} />
                        ))}
                        {/* Granite shop cottage left */}
                        <rect x="44" y="68" width="128" height="68" rx="6" fill="#7D8793" />
                        <polygon points="36,72 108,34 180,72" fill="#465363" />
                        <rect x="64" y="92" width="38" height="26" rx="3" fill="#FCE7A2" />
                        <rect x="122" y="92" width="28" height="44" rx="3" fill="#9B5538" />
                        {/* Central stone fountain & noticeboard */}
                        <ellipse cx="290" cy="146" rx="54" ry="16" fill="#64748B" />
                        <ellipse cx="290" cy="142" rx="44" ry="12" fill="#6ED6D6" />
                        <rect x="280" y="102" width="20" height="36" rx="4" fill="#94A3B8" />
                        <rect x="348" y="88" width="44" height="36" rx="4" fill="#8C5E3C" />
                        <rect x="354" y="94" width="32" height="22" rx="2" fill="#FFFDF5" />
                        {/* Tartan festival banner center-right */}
                        <rect x="412" y="68" width="6" height="70" fill="#5D4037" />
                        <rect x="498" y="68" width="6" height="70" fill="#5D4037" />
                        <rect x="415" y="72" width="86" height="26" rx="3" fill="#C84B43" />
                        <line x1="415" y1="85" x2="501" y2="85" stroke="#F2C66D" strokeWidth="4" />
                        <line x1="458" y1="72" x2="458" y2="98" stroke="#1E3A5F" strokeWidth="5" />
                        {/* 1842 stone cairn right */}
                        <polygon points="546,138 564,82 590,82 608,138" fill="#6C7785" />
                        <rect x="559" y="100" width="36" height="20" rx="2" fill="#E2E8F0" />
                      </svg>

                      {/* 4 Positioned Hotspot Pins over the Scene */}
                      {VILLAGE_DETECTIVE_CLUES.map((clue, idx) => {
                        const solved = solvedClueIds.includes(clue.id);
                        const selected = selectedClueId === clue.id;
                        const pinPositions = [
                          'left-[8%] top-[24%]',
                          'left-[39%] top-[36%]',
                          'left-[63%] top-[20%]',
                          'left-[82%] top-[42%]',
                        ];
                        return (
                          <button
                            key={clue.id}
                            type="button"
                            onClick={() => {
                              onPlaySfx('select');
                              setSelectedClueId(clue.id);
                              setFeedback(null);
                            }}
                            className={`absolute ${pinPositions[idx]} flex min-h-[36px] items-center gap-1 rounded-xl border px-2.5 py-1 text-[11px] font-extrabold shadow-md transition-transform cursor-pointer ${
                              selected
                                ? 'scale-105 border-white bg-[#2B8C7E] text-white'
                                : solved
                                  ? 'border-[#6EE7B7] bg-[#ECFDF5] text-[#065F46]'
                                  : 'border-[#F2C66D] bg-[#FFFDF8] text-[#1E2E46] hover:scale-105'
                            }`}
                          >
                            {solved ? (
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#059669]" aria-hidden="true" />
                            ) : (
                              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#D97706]" aria-hidden="true" />
                            )}
                            <span>#{idx + 1}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Quick Hotspot Pills Row for Keyboard / Clear Label Access */}
                    <div className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
                      {VILLAGE_DETECTIVE_CLUES.map((clue, idx) => {
                        const solved = solvedClueIds.includes(clue.id);
                        const selected = selectedClueId === clue.id;
                        return (
                          <button
                            key={clue.id}
                            type="button"
                            onClick={() => {
                              onPlaySfx('select');
                              setSelectedClueId(clue.id);
                              setFeedback(null);
                            }}
                            className={`flex min-h-[40px] items-center justify-between gap-2 rounded-xl border px-3 py-1.5 text-left text-xs font-bold transition-colors cursor-pointer ${
                              selected
                                ? 'border-[#2B8C7E] bg-[#2B8C7E] text-white'
                                : solved
                                  ? isNight
                                    ? 'border-[#2ED6A3]/45 bg-[#12332F] text-[#9CF2D6]'
                                    : 'border-[#86EFAC] bg-[#ECFDF5] text-[#065F46]'
                                  : cardSurface
                            }`}
                          >
                            <span className="truncate">
                              #{idx + 1} {clue.label[language]}
                            </span>
                            {solved && <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Clue Inspection Card + 4 Visual Category Buckets */}
                  {(() => {
                    const clue =
                      VILLAGE_DETECTIVE_CLUES.find((c) => c.id === selectedClueId) ??
                      VILLAGE_DETECTIVE_CLUES[0];
                    const clueText = difficultyMode === 'a2' ? clue.a2Clue : clue.b1Clue;
                    const alreadySolved = solvedClueIds.includes(clue.id);
                    return (
                      <div className={`rounded-2xl border p-4 ${cardSurface}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-display text-base font-extrabold">
                              {clue.label[language]}
                            </p>
                            <p className="mt-1 text-sm leading-relaxed">{clueText.en}</p>
                            {language === 'th' && (
                              <p className={`mt-1 text-xs leading-relaxed ${isNight ? 'text-[#B8CAE0]' : 'text-[#526785]'}`}>
                                {clueText.th}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => speakEnglish(`${clue.label.en}. ${clueText.en}`)}
                            className={`inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${subtlePanel}`}
                          >
                            <Volume2 className="h-4 w-4 text-[#24B8B0]" aria-hidden="true" />
                            <span>{copy.jaipurListenButton}</span>
                          </button>
                        </div>

                        <p className="mt-4 text-xs font-extrabold uppercase tracking-wide text-[#D99B26]">
                          {copy.scotlandBucketsTitle}
                        </p>
                        <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
                          {shuffledVillageCategories.map((cat) => {
                            const collectedInBucket = VILLAGE_DETECTIVE_CLUES.filter(
                              (c) => solvedClueIds.includes(c.id) && c.correctCategory === cat.id,
                            );
                            const isThisCluesBucket = alreadySolved && clue.correctCategory === cat.id;
                            const BucketIcon = VILLAGE_BUCKET_ICONS[cat.id];
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                disabled={alreadySolved}
                                onClick={() => handleClassifyVillageClue(cat.id)}
                                className={`flex min-h-[72px] flex-col justify-between rounded-xl border-2 p-3 text-left transition-colors ${
                                  isThisCluesBucket
                                    ? 'border-[#2ED6A3] bg-[#2ED6A3]/20'
                                    : alreadySolved
                                      ? 'opacity-65 cursor-not-allowed ' + subtlePanel
                                      : 'cursor-pointer hover:border-[#2B8C7E] ' + subtlePanel
                                }`}
                              >
                                <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold">
                                  <span
                                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                                      isNight ? 'bg-white/10 text-[#2ED6A3]' : 'bg-[#E2F3EF] text-[#1A6B5E]'
                                    }`}
                                    aria-hidden="true"
                                  >
                                    <BucketIcon className="h-3.5 w-3.5" />
                                  </span>
                                  <span>{cat.label[language]}</span>
                                </span>
                                {collectedInBucket.length > 0 ? (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {collectedInBucket.map((item) => (
                                      <span
                                        key={item.id}
                                        className="inline-flex items-center gap-1 rounded-md bg-[#2ED6A3] px-2 py-0.5 text-[11px] font-bold text-[#131E31]"
                                      >
                                        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                                        <span>{item.label[language]}</span>
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="mt-1.5 text-[11px] opacity-65">
                                    {copy.scotlandClassifyPrompt}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* === MECHANIC 2: INTERACTIVE TARTAN LOOM WEAVER + DUAL-COLUMN TEXTILE MATCHER === */}
              {stationId === 'tartan_heritage_workshop' && (
                <div className="space-y-4">
                  {/* Step 1: Tactile Loom Thread Weaver vs Kalasin Praewa Silk */}
                  {!loomBoardUnlocked ? (
                    <div className={`rounded-2xl border p-4 space-y-4 ${cardSurface}`}>
                      <p className="text-xs font-extrabold uppercase tracking-wide text-[#C84B43] dark:text-[#FCA5A5]">
                        {copy.scotlandWeaveStepTitle}
                      </p>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Scottish Tartan Interactive Oak Loom */}
                        <div className={`rounded-2xl border-2 border-[#8C5E3C]/35 p-3.5 ${subtlePanel}`}>
                          <p className="font-display text-sm font-extrabold">
                            Scottish Wool Tartan Loom
                          </p>
                          <div className="mt-2 flex flex-col items-center justify-center rounded-xl border-2 border-[#8C5E3C]/35 bg-white p-2 shadow-inner">
                            <svg viewBox="0 0 140 110" className="h-28 w-36" aria-hidden="true">
                              <rect x="6" y="6" width="128" height="98" rx="6" fill="#F8FAFC" stroke="#8C5E3C" strokeWidth="4" />
                              {/* Horizontal weft stripes */}
                              {[20, 42, 64, 86].map((y, i) => (
                                <rect
                                  key={y}
                                  x="10"
                                  y={y}
                                  width="120"
                                  height={i % 2 === 0 ? 11 : 7}
                                  fill={WEFT_COLORS[(weftIdx + (i % 2)) % WEFT_COLORS.length]}
                                  fillOpacity="0.82"
                                />
                              ))}
                              {/* Vertical warp stripes */}
                              {[22, 48, 74, 100].map((x, i) => (
                                <rect
                                  key={x}
                                  x={x}
                                  y="10"
                                  width={i % 2 === 0 ? 12 : 8}
                                  height="90"
                                  fill={WARP_COLORS[(warpIdx + (i % 2)) % WARP_COLORS.length]}
                                  fillOpacity="0.72"
                                />
                              ))}
                              {/* Wooden Shuttle Detail */}
                              <polygon points="48,100 92,100 98,104 92,108 48,108 42,104" fill="#A16207" />
                            </svg>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                onPlaySfx('select');
                                setWarpIdx((i) => (i + 1) % WARP_COLORS.length);
                                setToggledWarp(true);
                              }}
                              className="inline-flex min-h-[38px] items-center justify-center gap-1 rounded-xl border border-[#1E3A5F]/30 bg-[#E8EFF8] px-2.5 py-1.5 text-[11px] font-extrabold text-[#1E3A5F] hover:bg-[#D8E5F4] cursor-pointer"
                            >
                              <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>{copy.scotlandToggleWarpButton}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onPlaySfx('select');
                                setWeftIdx((i) => (i + 1) % WEFT_COLORS.length);
                                setToggledWeft(true);
                              }}
                              className="inline-flex min-h-[38px] items-center justify-center gap-1 rounded-xl border border-[#C84B43]/30 bg-[#FCEBE9] px-2.5 py-1.5 text-[11px] font-extrabold text-[#9B2C25] hover:bg-[#F9DBD7] cursor-pointer"
                            >
                              <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>{copy.scotlandToggleWeftButton}</span>
                            </button>
                          </div>
                        </div>

                        {/* Kalasin Praewa Silk Comparison Card */}
                        <div className={`rounded-2xl border-2 border-[#D99B26]/35 p-3.5 ${subtlePanel}`}>
                          <p className="font-display text-sm font-extrabold text-[#D99B26]">
                            Kalasin Praewa Silk (ไทย)
                          </p>
                          <div className="mt-2 flex items-center justify-center rounded-xl border-2 border-[#D99B26]/40 bg-[#3B1726] p-2 shadow-inner">
                            <svg viewBox="0 0 140 110" className="h-28 w-36" aria-hidden="true">
                              <rect x="6" y="6" width="128" height="98" rx="6" fill="#6D1E3B" stroke="#D99B26" strokeWidth="3" />
                              {[26, 56, 86, 114].map((cx) => (
                                <g key={cx}>
                                  <polygon
                                    points={`${cx},22 ${cx + 12},36 ${cx},50 ${cx - 12},36`}
                                    fill="#F2C66D"
                                  />
                                  <polygon
                                    points={`${cx},60 ${cx + 12},74 ${cx},88 ${cx - 12},74`}
                                    fill="#2ED6A3"
                                  />
                                </g>
                              ))}
                            </svg>
                          </div>
                          <p className="mt-2.5 text-xs leading-relaxed">
                            {language === 'en'
                              ? 'Scottish tartan weaves thick warm wool checks; Thai Kalasin Praewa silk weaves gleaming geometric diamond motifs for breathable tropical celebrations.'
                              : 'ผ้าทาร์ทันสกอตทอเส้นขนสัตว์หนาเป็นลายตาราง ส่วนผ้าไหมแพรวากาฬสินธุ์ของไทยทอลายเพชรเรขาคณิตเบาสบายสำหรับอากาศร้อนชื้น'}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            onPlaySfx('select');
                            setLoomBoardUnlocked(true);
                          }}
                          className={`inline-flex min-h-[42px] items-center justify-center rounded-xl px-5 py-2 font-display text-xs font-extrabold shadow cursor-pointer ${
                            toggledWarp && toggledWeft
                              ? 'bg-[#2ED6A3] text-[#131E31] hover:bg-[#49e2b3]'
                              : 'bg-[#F2C66D] text-[#131E31] hover:bg-[#f6d388]'
                          }`}
                        >
                          {copy.scotlandWeaveCompareContinue}
                        </button>
                      </div>
                    </div>
                  ) : matchedTextileIds.length < TARTAN_MATCH_CARDS.length ? (
                    /* Step 2: Dual-Column Visual Pattern & Purpose Match Board */
                    <div className="space-y-4">
                      <div className={`rounded-2xl border p-4 ${subtlePanel}`}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-xs font-extrabold uppercase tracking-wide text-[#C84B43] dark:text-[#FCA5A5]">
                            {copy.scotlandStation2Instruction}
                          </p>
                          <span className="font-mono-num text-xs font-extrabold">
                            {matchedTextileIds.length}/{TARTAN_MATCH_CARDS.length}
                          </span>
                        </div>

                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          {/* Left Column: Textile Cards with Woven Swatch Artwork */}
                          <div className="space-y-2">
                            <p className="text-[11px] font-extrabold uppercase tracking-wide opacity-75">
                              {copy.scotlandPairLeftTitle}
                            </p>
                            {shuffledTartanCards.map((card) => {
                              const matched = matchedTextileIds.includes(card.id);
                              const selected = selectedTextileId === card.id;
                              const desc =
                                difficultyMode === 'a2' ? card.a2Description : card.b1Description;
                              return (
                                <button
                                  key={card.id}
                                  type="button"
                                  onClick={() => {
                                    onPlaySfx('select');
                                    setSelectedTextileId(card.id);
                                    setFeedback(null);
                                  }}
                                  className={`flex w-full items-start gap-2.5 rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                                    selected
                                      ? 'border-[#C84B43] bg-[#C84B43] text-white shadow-sm'
                                      : matched
                                        ? isNight
                                          ? 'border-[#2ED6A3]/45 bg-[#12332F] text-[#9CF2D6]'
                                          : 'border-[#86EFAC] bg-[#ECFDF5] text-[#065F46]'
                                        : cardSurface
                                  }`}
                                >
                                  <ScotlandTextileSwatchSVG
                                    variant={card.visualVariant}
                                    className="mt-0.5 h-10 w-10 rounded-lg border border-black/15"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2 text-xs font-extrabold">
                                      <span>
                                        {card.title[language]} ·{' '}
                                        {card.originTag === 'scotland'
                                          ? copy.scotlandCountryLabel
                                          : copy.scotlandThailandLabel}
                                      </span>
                                      {matched && <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />}
                                    </div>
                                    <span className="mt-0.5 block text-[11px] opacity-90 leading-snug">
                                      {desc[language]}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          {/* Right Column: Purpose Cards */}
                          <div className="space-y-2">
                            <p className="text-[11px] font-extrabold uppercase tracking-wide opacity-75">
                              {copy.scotlandPairRightTitle}
                            </p>
                            {shuffledTartanPurposes.map((opt) => {
                              const pairedCard = TARTAN_MATCH_CARDS.find(
                                (c) =>
                                  matchedTextileIds.includes(c.id) && c.correctPurposeId === opt.id,
                              );
                              const activeCard =
                                TARTAN_MATCH_CARDS.find((c) => c.id === selectedTextileId) ??
                                TARTAN_MATCH_CARDS[0];
                              const activeAlreadyMatched = matchedTextileIds.includes(activeCard.id);

                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  disabled={Boolean(pairedCard) || activeAlreadyMatched}
                                  onClick={() => handlePairTextilePurpose(opt.id)}
                                  className={`flex min-h-[64px] w-full flex-col justify-center rounded-xl border p-3 text-left text-xs font-semibold transition-colors ${
                                    pairedCard
                                      ? 'border-[#2ED6A3] bg-[#2ED6A3] text-[#131E31] font-bold'
                                      : activeAlreadyMatched
                                        ? 'opacity-50 cursor-not-allowed ' + cardSurface
                                        : 'cursor-pointer hover:border-[#C84B43] ' + cardSurface
                                  }`}
                                >
                                  <span>{opt.label[language]}</span>
                                  {pairedCard && (
                                    <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-extrabold">
                                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                                      <span>{pairedCard.title[language]}</span>
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Step 3: Final Cultural Connection Check */
                    <div className={`rounded-2xl border p-4 ${cardSurface}`}>
                      <p className="text-xs font-extrabold uppercase tracking-wide text-[#2B8C7E] dark:text-[#2ED6A3]">
                        {copy.scotlandFinalInsightLabel}
                      </p>
                      <p className="mt-1 font-display text-base font-extrabold">
                        {TARTAN_REFLECTION_CHECK.prompt[language]}
                      </p>
                      <div className="mt-3 grid gap-2">
                        {shuffledTartanReflectionOpts.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            disabled={tartanReflectionPassed}
                            onClick={() => handlePickTartanReflection(opt.id)}
                            className={`min-h-[44px] rounded-xl border px-4 py-2.5 text-left text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                              tartanReflectionPassed && opt.isCorrect
                                ? 'border-[#2ED6A3] bg-[#2ED6A3] text-[#131E31] font-bold'
                                : subtlePanel
                            }`}
                          >
                            {opt.label[language]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* === MECHANIC 3: MARKET PANTRY SHELF -> MIXING BOWL -> THAILAND CONTRAST === */}
              {stationId === 'highland_food_market' && (
                <div className="space-y-4">
                  <div className={`rounded-2xl border p-4 ${subtlePanel}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-extrabold uppercase tracking-wide text-[#D98E32]">
                        {copy.scotlandStation3Instruction}
                      </p>
                      <span className="font-mono-num text-xs font-extrabold">
                        {solvedTrayIds.length}/{FOOD_INVESTIGATION_TRAYS.length}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                      {FOOD_INVESTIGATION_TRAYS.map((tray) => {
                        const solved = solvedTrayIds.includes(tray.id);
                        const selected = selectedTrayId === tray.id;
                        return (
                          <button
                            key={tray.id}
                            type="button"
                            onClick={() => {
                              onPlaySfx('select');
                              setSelectedTrayId(tray.id);
                              setFeedback(null);
                            }}
                            className={`flex min-h-[54px] items-center justify-between gap-2 rounded-xl border-2 px-2.5 py-2 text-left text-xs font-bold transition-colors cursor-pointer ${
                              selected
                                ? 'border-[#D98E32] bg-[#D98E32] text-[#131E31] shadow-sm'
                                : solved
                                  ? isNight
                                    ? 'border-[#2ED6A3]/45 bg-[#12332F] text-[#9CF2D6]'
                                    : 'border-[#86EFAC] bg-[#ECFDF5] text-[#065F46]'
                                  : cardSurface
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <ScotlandDishIllustrationSVG
                                variant={tray.visualVariant}
                                className="h-9 w-9 rounded-lg border border-black/10"
                              />
                              <span className="truncate">{tray.dishName[language]}</span>
                            </div>
                            {solved && <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {(() => {
                    const tray =
                      FOOD_INVESTIGATION_TRAYS.find((t) => t.id === selectedTrayId) ??
                      FOOD_INVESTIGATION_TRAYS[0];
                    const bowlIds = bowlIngredientsByTray[tray.id] ?? [];
                    const bowlReady = bowlIds.length >= 3;
                    const traySolved = solvedTrayIds.includes(tray.id);
                    const clueText =
                      difficultyMode === 'a2' ? tray.climateClueA2 : tray.climateClueB1;

                    return (
                      <div className={`rounded-2xl border p-4 space-y-4 ${cardSurface}`}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0 flex-1">
                            <ScotlandDishIllustrationSVG
                              variant={tray.visualVariant}
                              className="h-12 w-12 rounded-xl border border-black/10 shadow-xs"
                            />
                            <div className="min-w-0">
                              <h3 className="font-display text-base font-extrabold">
                                {tray.dishName[language]}
                              </h3>
                              <p className="mt-1 text-sm leading-relaxed">{clueText.en}</p>
                              {language === 'th' && (
                                <p className={`mt-1 text-xs ${isNight ? 'text-[#B8CAE0]' : 'text-[#526785]'}`}>
                                  {clueText.th}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => speakEnglish(`${tray.dishName.en}. ${clueText.en}`)}
                            className={`inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${subtlePanel}`}
                          >
                            <Volume2 className="h-4 w-4 text-[#24B8B0]" aria-hidden="true" />
                            <span>{copy.jaipurListenButton}</span>
                          </button>
                        </div>

                        {/* Interactive Pantry Shelf */}
                        <div>
                          <p className="text-xs font-extrabold uppercase tracking-wide text-[#D98E32]">
                            {copy.scotlandPantryShelfTitle} ({bowlIds.length}/3)
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {(shuffledPantryByTray[tray.id] ?? tray.pantryShelf).map((item) => {
                              const inBowl = bowlIds.includes(item.id);
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  disabled={inBowl || bowlReady}
                                  onClick={() => handlePickPantryItem(tray.id, item.id)}
                                  className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors ${
                                    inBowl
                                      ? 'border-[#2ED6A3] bg-[#2ED6A3] text-[#131E31]'
                                      : bowlReady
                                        ? 'opacity-45 cursor-not-allowed ' + subtlePanel
                                        : 'cursor-pointer hover:border-[#D98E32] ' + subtlePanel
                                  }`}
                                >
                                  {inBowl && <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />}
                                  <span>{item.label[language]}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Progressive Ceramic Mixing Bowl Visual */}
                        <div className={`rounded-xl border p-3.5 ${subtlePanel}`}>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
                            <div className="flex items-center gap-3 shrink-0">
                              <ScotlandCeramicMixingBowlSVG
                                filledCount={bowlIds.length}
                                isNight={isNight}
                                className="h-16 w-20"
                              />
                              <div className="sm:hidden flex items-center gap-1.5 text-xs font-extrabold">
                                <Utensils className="h-4 w-4 text-[#D98E32]" aria-hidden="true" />
                                <span>
                                  {copy.scotlandMixingBowlTitle}: {bowlIds.length}/3
                                </span>
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="hidden sm:flex items-center gap-2 text-xs font-extrabold">
                                <Utensils className="h-4 w-4 text-[#D98E32]" aria-hidden="true" />
                                <span>
                                  {copy.scotlandMixingBowlTitle}:{' '}
                                  <span className="font-mono-num">{bowlIds.length}/3</span>
                                </span>
                              </div>
                              <div className="mt-2 grid grid-cols-3 gap-2">
                                {[0, 1, 2].map((slotIdx) => {
                                  const itemId = bowlIds[slotIdx];
                                  const itemObj = itemId
                                    ? tray.pantryShelf.find((p) => p.id === itemId)
                                    : null;
                                  return (
                                    <div
                                      key={slotIdx}
                                      className={`flex min-h-[42px] items-center justify-center rounded-lg border px-2 py-1.5 text-center text-[11px] font-bold ${
                                        itemObj
                                          ? isNight
                                            ? 'border-[#2ED6A3]/60 bg-[#12332F] text-[#9CF2D6]'
                                            : 'border-[#6EE7B7] bg-[#ECFDF5] text-[#065F46]'
                                          : 'border-dashed opacity-55 ' + cardSurface
                                      }`}
                                    >
                                      {itemObj ? itemObj.label[language] : `#${slotIdx + 1}`}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                        {bowlReady && (
                          <div className="space-y-2.5">
                            <p className="text-xs font-extrabold uppercase tracking-wide text-[#2B8C7E] dark:text-[#2ED6A3]">
                              {copy.scotlandBowlReadyNote}
                            </p>
                            <div className="grid gap-2">
                              {(shuffledFoodContrastByTray[tray.id] ?? tray.thaiContrastOptions).map((opt) => (
                                <button
                                  key={opt.id}
                                  type="button"
                                  disabled={traySolved}
                                  onClick={() => handlePickFoodContrast(opt.id)}
                                  className={`min-h-[44px] rounded-xl border px-4 py-2.5 text-left text-xs sm:text-sm font-semibold transition-colors ${
                                    traySolved && opt.id === tray.thaiContrastId
                                      ? 'border-[#2ED6A3] bg-[#2ED6A3] text-[#131E31] font-bold'
                                      : traySolved
                                        ? 'opacity-50 cursor-not-allowed ' + subtlePanel
                                        : 'cursor-pointer hover:border-[#D98E32] ' + subtlePanel
                                  }`}
                                >
                                  {opt.label[language]}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* === MECHANIC 4: BLIND MYSTERY SOUND STAGE + RHYTHM EQUALIZER + FESTIVAL CHECK === */}
              {stationId === 'highland_games_ground' && (
                <div className="space-y-4">
                  <div className={`overflow-hidden rounded-2xl border ${subtlePanel}`}>
                    <ScotlandTartanRibbonDivider />
                    <div className="p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-extrabold uppercase tracking-wide text-[#5664B8] dark:text-[#A5B4FC]">
                          {copy.scotlandStation4Instruction}
                        </p>
                        <span className="font-mono-num text-xs font-extrabold">
                          {solvedProbeIds.length}/{FESTIVAL_RHYTHM_PROBES.length}
                        </span>
                      </div>

                      <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        {FESTIVAL_RHYTHM_PROBES.map((probe) => {
                          const solved = solvedProbeIds.includes(probe.id);
                          const selected = selectedProbeId === probe.id;
                          return (
                            <button
                              key={probe.id}
                              type="button"
                              onClick={() => {
                                onPlaySfx('select');
                                setSelectedProbeId(probe.id);
                                setFeedback(null);
                              }}
                              className={`flex min-h-[54px] items-center justify-between gap-2 rounded-xl border-2 px-2.5 py-2 text-left text-xs font-bold transition-colors cursor-pointer ${
                                selected
                                  ? 'border-[#5664B8] bg-[#5664B8] text-white shadow-sm'
                                  : solved
                                    ? isNight
                                      ? 'border-[#2ED6A3]/45 bg-[#12332F] text-[#9CF2D6]'
                                      : 'border-[#86EFAC] bg-[#ECFDF5] text-[#065F46]'
                                    : cardSurface
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <ScotlandInstrumentBadgeSVG
                                  instrumentId={probe.id}
                                  revealed={solved}
                                  className="h-9 w-9"
                                />
                                <span className="truncate">
                                  {solved ? probe.instrumentName[language] : probe.mysteryLabel[language]}
                                </span>
                              </div>
                              {solved && <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {solvedProbeIds.length < FESTIVAL_RHYTHM_PROBES.length ? (
                    (() => {
                      const probe =
                        FESTIVAL_RHYTHM_PROBES.find((p) => p.id === selectedProbeId) ??
                        FESTIVAL_RHYTHM_PROBES[0];
                      const clueText = difficultyMode === 'a2' ? probe.a2Clue : probe.b1Clue;
                      const probeSolved = solvedProbeIds.includes(probe.id);
                      const isPlayingThis = playingInstrument === probe.id;

                      return (
                        <div className={`rounded-2xl border p-4 space-y-3 ${cardSurface}`}>
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0 flex-1">
                              <ScotlandInstrumentBadgeSVG
                                instrumentId={probe.id}
                                revealed={probeSolved}
                                className="h-14 w-14 shadow-xs"
                              />
                              <div className="min-w-0">
                                <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#5664B8] dark:text-[#A5B4FC]">
                                  {copy.scotlandMysteryAudioPrompt}
                                </p>
                                <h3 className="font-display text-base font-extrabold">
                                  {probeSolved
                                    ? probe.instrumentName[language]
                                    : probe.mysteryLabel[language]}
                                </h3>
                                <p className="mt-1 text-sm leading-relaxed">{clueText.en}</p>
                                {language === 'th' && (
                                  <p className={`mt-1 text-xs ${isNight ? 'text-[#B8CAE0]' : 'text-[#526785]'}`}>
                                    {clueText.th}
                                  </p>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setPlayingInstrument(probe.id);
                                voxAudio.playScotlandInstrumentCue(probe.id);
                              }}
                              className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl bg-[#5664B8] px-4 py-2 font-display text-xs font-extrabold text-white shadow hover:bg-[#6674C9] cursor-pointer"
                            >
                              <Music className="h-4 w-4" aria-hidden="true" />
                              <span>{copy.scotlandPlaySoundCueButton}</span>
                            </button>
                          </div>

                          {/* Accessible Visual Rhythm Equalizer Bars */}
                          <div
                            className={`flex h-14 items-end gap-2 rounded-xl border-2 px-4 py-2.5 ${subtlePanel}`}
                            aria-hidden="true"
                          >
                            {probe.patternBars.map((heightPct, idx) => (
                              <span
                                key={idx}
                                className="flex-1 rounded-full transition-transform duration-200"
                                style={{
                                  height: `${heightPct}%`,
                                  backgroundColor: isPlayingThis ? '#2ED6A3' : '#5664B8',
                                  transform: isPlayingThis
                                    ? `scaleY(${idx % 2 === 0 ? 1.15 : 0.85})`
                                    : 'scaleY(1)',
                                  transformOrigin: 'bottom',
                                }}
                              />
                            ))}
                          </div>

                          <p className="text-xs font-extrabold uppercase tracking-wide text-[#D99B26]">
                            {copy.scotlandIdentifyRolePrompt}
                          </p>
                          <div className="grid gap-2">
                            {(shuffledRolesByProbe[probe.id] ?? probe.roleOptions).map((opt) => (
                              <button
                                key={opt.id}
                                type="button"
                                disabled={probeSolved}
                                onClick={() => handlePickInstrumentRole(opt.id)}
                                className={`min-h-[44px] rounded-xl border px-4 py-2.5 text-left text-xs sm:text-sm font-semibold transition-colors ${
                                  probeSolved && opt.id === probe.correctRoleId
                                    ? 'border-[#2ED6A3] bg-[#2ED6A3] text-[#131E31] font-bold'
                                    : probeSolved
                                      ? 'opacity-50 cursor-not-allowed ' + subtlePanel
                                      : 'cursor-pointer hover:border-[#5664B8] ' + subtlePanel
                                }`}
                              >
                                {opt.label[language]}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className={`rounded-2xl border p-4 ${cardSurface}`}>
                      <p className="text-xs font-extrabold uppercase tracking-wide text-[#2B8C7E] dark:text-[#2ED6A3]">
                        {copy.scotlandFinalInsightLabel}
                      </p>
                      <p className="mt-1 font-display text-base font-extrabold">
                        {FESTIVAL_THAI_COMPARISON_CHECK.prompt[language]}
                      </p>
                      <div className="mt-3 grid gap-2">
                        {shuffledFestivalReflectionOpts.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            disabled={festivalReflectionPassed}
                            onClick={() => handlePickFestivalReflection(opt.id)}
                            className={`min-h-[44px] rounded-xl border px-4 py-2.5 text-left text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                              festivalReflectionPassed && opt.isCorrect
                                ? 'border-[#2ED6A3] bg-[#2ED6A3] text-[#131E31] font-bold'
                                : subtlePanel
                            }`}
                          >
                            {opt.label[language]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* === MECHANIC 5: 3-COLUMN VISUAL COMPARISON BOARD + LANGUAGE BRIDGE CARDS === */}
              {stationId === 'lochside_castle_viewpoint' && (
                <div className="space-y-4">
                  <div className={`overflow-hidden rounded-2xl border ${subtlePanel}`}>
                    <div className="relative h-16 w-full overflow-hidden border-b border-black/10">
                      <DioramaImage
                        src={scotlandDioramaImg}
                        alt={evidence.landmarkTitle[language]}
                        title={evidence.landmarkTitle[language]}
                        accentColor="#3B78A8"
                        appearance={appearance}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-extrabold uppercase tracking-wide text-[#3B78A8] dark:text-[#7DD3FC]">
                          {copy.scotlandStation5Instruction}
                        </p>
                        <span className="font-mono-num text-xs font-extrabold">
                          {Object.keys(sortedTokenZones).length}/{COMPARISON_COMPASS_TOKENS.length}
                        </span>
                      </div>

                      <p className="mt-2 text-[11px] font-bold opacity-75">
                        {copy.scotlandCompassTrayTitle}
                      </p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {shuffledCompassTokens.map((tok) => {
                          const placedZone = sortedTokenZones[tok.id];
                          const selected = selectedCompassTokenId === tok.id;
                          return (
                            <button
                              key={tok.id}
                              type="button"
                              onClick={() => {
                                onPlaySfx('select');
                                setSelectedCompassTokenId(tok.id);
                                setFeedback(null);
                              }}
                              className={`flex min-h-[44px] items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-xs font-bold transition-colors cursor-pointer ${
                                selected
                                  ? 'border-[#3B78A8] bg-[#3B78A8] text-white'
                                  : placedZone
                                    ? isNight
                                      ? 'border-[#2ED6A3]/45 bg-[#12332F] text-[#9CF2D6]'
                                      : 'border-[#86EFAC] bg-[#ECFDF5] text-[#065F46]'
                                    : cardSurface
                              }`}
                            >
                              <span>{tok.label[language]}</span>
                              {placedZone && <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Active Card + 3-Column Comparison Board Dropzones */}
                  {(() => {
                    const token =
                      COMPARISON_COMPASS_TOKENS.find((t) => t.id === selectedCompassTokenId) ??
                      COMPARISON_COMPASS_TOKENS[0];
                    const clue = difficultyMode === 'a2' ? token.a2Clue : token.b1Clue;
                    const alreadyPlaced = Boolean(sortedTokenZones[token.id]);

                    const columns: {
                      id: ComparisonZone;
                      label: string;
                      accent: string;
                    }[] = [
                      { id: 'scotland', label: copy.scotlandCountryLabel, accent: '#3B78A8' },
                      { id: 'both', label: copy.scotlandBothCountriesLabel, accent: '#2B8C7E' },
                      { id: 'thailand', label: copy.scotlandThailandLabel, accent: '#D98E32' },
                    ];

                    return (
                      <div className={`rounded-2xl border p-4 space-y-3 ${cardSurface}`}>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wide text-[#D99B26]">
                            {token.stationRef[language]}
                          </p>
                          <h3 className="mt-0.5 font-display text-base font-extrabold">
                            {token.label[language]}
                          </h3>
                          <p className="mt-1 text-xs sm:text-sm leading-relaxed">{clue[language]}</p>
                        </div>

                        <p className="text-xs font-extrabold uppercase tracking-wide text-[#2B8C7E] dark:text-[#2ED6A3]">
                          {copy.scotlandPlaceCompassZonePrompt}
                        </p>

                        <div className="grid gap-2.5 sm:grid-cols-3">
                          {columns.map((col) => {
                            const cardsInCol = COMPARISON_COMPASS_TOKENS.filter(
                              (t) => sortedTokenZones[t.id] === col.id,
                            );
                            return (
                              <div
                                key={col.id}
                                className={`flex flex-col rounded-2xl border p-3 ${subtlePanel}`}
                              >
                                <button
                                  type="button"
                                  disabled={alreadyPlaced}
                                  onClick={() => handleSortCompassToken(col.id)}
                                  style={{ borderColor: col.accent }}
                                  className={`flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 px-3 py-2 text-xs sm:text-sm font-extrabold transition-colors ${
                                    alreadyPlaced
                                      ? 'opacity-55 cursor-not-allowed'
                                      : 'cursor-pointer hover:bg-black/5 dark:hover:bg-white/10'
                                  }`}
                                >
                                  <ScotlandZoneCrestSVG zone={col.id} className="h-7 w-7" />
                                  <span>{col.label}</span>
                                </button>

                                <div className="mt-2.5 space-y-1.5">
                                  {cardsInCol.length === 0 ? (
                                    <p className="text-center font-mono-num text-[11px] opacity-55 py-2">
                                      0/2
                                    </p>
                                  ) : (
                                    cardsInCol.map((placed) => (
                                      <div
                                        key={placed.id}
                                        className="flex items-start gap-1.5 rounded-lg bg-[#2ED6A3] px-2.5 py-1.5 text-[11px] font-bold text-[#131E31]"
                                      >
                                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                        <span>{placed.label[language]}</span>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Language Comparison Bridge Preview Cards */}
                  <div className={`rounded-2xl border p-4 ${subtlePanel}`}>
                    <p className="text-xs font-extrabold uppercase tracking-wide text-[#2B8C7E] dark:text-[#2ED6A3]">
                      {copy.scotlandLanguageBridgePreviewTitle}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {COMPARISON_BRIDGE_SAMPLES.map((sample) => (
                        <button
                          key={sample.phrase}
                          type="button"
                          onClick={() => {
                            onPlaySfx('click');
                            setActiveBridgePhrase(sample.phrase);
                          }}
                          className={`min-h-[36px] rounded-xl border px-3 py-1 text-xs font-bold cursor-pointer ${
                            activeBridgePhrase === sample.phrase
                              ? 'border-[#2B8C7E] bg-[#2B8C7E] text-white'
                              : cardSurface
                          }`}
                        >
                          {sample.phrase}
                        </button>
                      ))}
                    </div>
                    {(() => {
                      const active =
                        COMPARISON_BRIDGE_SAMPLES.find((s) => s.phrase === activeBridgePhrase) ??
                        COMPARISON_BRIDGE_SAMPLES[0];
                      const sampleText =
                        difficultyMode === 'a2' ? active.a2Example : active.b1Example;
                      return (
                        <div className={`mt-2.5 flex items-center justify-between gap-3 rounded-xl border p-3 ${cardSurface}`}>
                          <div>
                            <p className="text-xs sm:text-sm font-semibold">{sampleText.en}</p>
                            {language === 'th' && (
                              <p className={`mt-0.5 text-xs ${isNight ? 'text-[#B8CAE0]' : 'text-[#526785]'}`}>
                                {sampleText.th}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => speakEnglish(sampleText.en)}
                            aria-label={copy.jaipurListenButton}
                            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border cursor-pointer ${subtlePanel}`}
                          >
                            <Volume2 className="h-4 w-4 text-[#24B8B0]" aria-hidden="true" />
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Cultural Explanation / Retry Feedback */}
              {feedback && (
                <div
                  role="status"
                  className={`rounded-2xl border p-3.5 text-xs sm:text-sm font-semibold leading-relaxed ${
                    feedback.tone === 'success'
                      ? isNight
                        ? 'border-[#2ED6A3]/45 bg-[#12332F] text-[#A7F3D0]'
                        : 'border-[#6EE7B7] bg-[#ECFDF5] text-[#065F46]'
                      : isNight
                        ? 'border-[#F2C66D]/45 bg-[#2A2013] text-[#FDE68A]'
                        : 'border-[#FCD34D] bg-[#FFFBEB] text-[#92400E]'
                  }`}
                >
                  {feedback.message[language]}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div
          className={`flex flex-wrap items-center justify-between gap-2 border-t px-5 py-3.5 ${
            isNight ? 'border-white/12 bg-[#162340]' : 'border-[#E2E8F0] bg-[#F8FAFC]'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              onPlaySfx('click');
              onInspectLandmarkInfo();
            }}
            className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${cardSurface}`}
          >
            <span>{copy.scotlandReadLandmarkNoteButton}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onPlaySfx('select');
              onOpenJournal(stationId);
            }}
            className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold cursor-pointer ${cardSurface}`}
          >
            <BookOpen className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
            <span>{copy.scotlandOpenJournalButton}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
