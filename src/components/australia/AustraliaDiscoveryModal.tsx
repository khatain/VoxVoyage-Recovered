import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Compass,
  HelpCircle,
  MapPin,
  MessageCircle,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Square,
  UtensilsCrossed,
  Volume2,
  X,
} from 'lucide-react';
import type { AppLanguage, LocalizedText, ResolvedAppearance } from '../../types/game';
import { GAME_COPY } from '../../data/i18n';
import {
  AUSTRALIA_LANDMARKS,
  AUSTRALIA_NPC_DIALOGUES,
  type AustraliaLandmarkId,
} from '../../data/australiaWorld';
import {
  AUSTRALIA_DISCOVERY_XP_REWARD,
  buildSandwichFeedback,
  CAFE_ORDER_CHALLENGES,
  COMMUNICATION_RESCUE_CHALLENGES,
  DARLING_HARBOUR_INFO_BOARD,
  DIRECTION_DECODER_CHALLENGES,
  DIRECTION_DECODER_PINS,
  getAustraliaDiscoverMissionMeta,
  GREETING_DETECTIVE_SCENARIOS,
  HARBOUR_CAFE_SAMPLE_MENU,
  TICKET_TALK_CHALLENGES,
  type AustraliaDifficultyMode,
  type CafeOrderChallenge,
  type DialogueRepairOption,
  type DiscoveryExpressionOption,
  type SydneyMiniMapPinId,
} from '../../data/australiaDiscovery';
import { shuffleArray } from '../../utils/shuffle';
import { voxAudio } from '../../utils/audioEngine';
import { AustraliaNpcPortraitSVG } from './AustraliaSvgArtwork';
import {
  AustraliaMissionEmblemSVG,
  CafeItemIconSVG,
  SydneyRoutePuzzleMapSVG,
} from './AustraliaDiscoveryArtwork';

interface AustraliaDiscoveryModalProps {
  landmarkId: AustraliaLandmarkId;
  language: AppLanguage;
  appearance: ResolvedAppearance;
  reducedMotion: boolean;
  alreadyCompletedMission: boolean;
  completedDiscoverCount: number;
  difficultyMode: AustraliaDifficultyMode;
  onDifficultyChange: (mode: AustraliaDifficultyMode) => void;
  onCompleteMission: (landmarkId: AustraliaLandmarkId) => void;
  onClose: () => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'reward') => void;
}

interface ActiveFeedback {
  tone: 'success' | 'retry';
  selectedOptionId?: string;
  text: LocalizedText;
  branchReply?: LocalizedText;
}

export function AustraliaDiscoveryModal({
  landmarkId,
  language,
  appearance,
  reducedMotion,
  alreadyCompletedMission,
  completedDiscoverCount,
  difficultyMode,
  onDifficultyChange,
  onCompleteMission,
  onClose,
  onPlaySfx,
}: AustraliaDiscoveryModalProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';
  const missionMeta = getAustraliaDiscoverMissionMeta(landmarkId);
  const landmark =
    AUSTRALIA_LANDMARKS.find((l) => l.id === landmarkId) ?? AUSTRALIA_LANDMARKS[0];
  const npcEntry = AUSTRALIA_NPC_DIALOGUES[missionMeta.npcId];

  const [attemptNonce, setAttemptNonce] = useState(0);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<ActiveFeedback | null>(null);
  const [solvedCurrentChallenge, setSolvedCurrentChallenge] = useState(false);
  const [missionFinished, setMissionFinished] = useState(false);
  const [lastSpokenText, setLastSpokenText] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Direction Decoder map state
  const [selectedPinId, setSelectedPinId] = useState<SydneyMiniMapPinId | null>(null);

  // Café tray collected items across the 5 turns
  const [trayItems, setTrayItems] = useState<
    NonNullable<CafeOrderChallenge['trayItemToAdd']>[]
  >([]);

  // Ticket Talk interactive info board tab
  const [boardTab, setBoardTab] = useState<'times' | 'tickets' | 'inclusions'>('times');

  // Reset per-attempt challenge state cleanly when missionId or attemptNonce changes
  useEffect(() => {
    setChallengeIndex(0);
    setShowHint(false);
    setFeedback(null);
    setSolvedCurrentChallenge(false);
    setMissionFinished(false);
    setSelectedPinId(null);
    setTrayItems([]);
    setBoardTab('times');
  }, [landmarkId, attemptNonce]);

  // Fisher–Yates shuffled option banks keyed strictly on [landmarkId, attemptNonce]
  // Never depends on language, difficultyMode, showHint, or audio state.
  const shuffledGreetingOptionsById = useMemo(
    () =>
      Object.fromEntries(
        GREETING_DETECTIVE_SCENARIOS.map((sc) => [sc.id, shuffleArray(sc.options)]),
      ),
    [landmarkId, attemptNonce],
  );

  const shuffledDirectionOptionsById = useMemo(
    () =>
      Object.fromEntries(
        DIRECTION_DECODER_CHALLENGES.map((ch) => [
          ch.id,
          ch.options ? shuffleArray(ch.options) : [],
        ]),
      ),
    [landmarkId, attemptNonce],
  );

  const shuffledCafeOptionsById = useMemo(
    () =>
      Object.fromEntries(
        CAFE_ORDER_CHALLENGES.map((ch) => [ch.id, shuffleArray(ch.options)]),
      ),
    [landmarkId, attemptNonce],
  );

  const shuffledTicketOptionsById = useMemo(
    () =>
      Object.fromEntries(
        TICKET_TALK_CHALLENGES.map((ch) => [ch.id, shuffleArray(ch.options)]),
      ),
    [landmarkId, attemptNonce],
  );

  const shuffledRescueOptionsById = useMemo(
    () =>
      Object.fromEntries(
        COMMUNICATION_RESCUE_CHALLENGES.map((ch) => [ch.id, shuffleArray(ch.options)]),
      ),
    [landmarkId, attemptNonce],
  );

  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const speakPhrase = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      stopSpeech();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-AU';
      utterance.rate = npcEntry.voiceRate;
      utterance.pitch = npcEntry.voicePitch;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setLastSpokenText(text);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    },
    [npcEntry.voicePitch, npcEntry.voiceRate, stopSpeech],
  );

  useEffect(() => {
    voxAudio.setDialogueDucking(true);
    return () => {
      stopSpeech();
      voxAudio.setDialogueDucking(false);
    };
  }, [stopSpeech]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        stopSpeech();
        onPlaySfx('click');
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, onPlaySfx, stopSpeech]);

  // Sync Ticket Talk board tab hint softly when advancing challenge
  useEffect(() => {
    if (landmarkId === 'darling_harbour_hub') {
      const ch = TICKET_TALK_CHALLENGES[challengeIndex];
      if (ch) setBoardTab(ch.focusBoardTab);
    }
  }, [challengeIndex, landmarkId]);

  const totalChallenges = useMemo(() => {
    switch (landmarkId) {
      case 'circular_quay_plaza':
        return GREETING_DETECTIVE_SCENARIOS.length;
      case 'city_transit_station':
        return DIRECTION_DECODER_CHALLENGES.length;
      case 'harbour_market_cafe':
        return CAFE_ORDER_CHALLENGES.length;
      case 'darling_harbour_hub':
        return TICKET_TALK_CHALLENGES.length;
      case 'harbour_gardens_help_point':
        return COMMUNICATION_RESCUE_CHALLENGES.length;
    }
  }, [landmarkId]);

  const handleSelectOption = (
    opt: DiscoveryExpressionOption | DialogueRepairOption,
    acceptedIds: string[],
    onValidHook?: () => void,
  ) => {
    if (solvedCurrentChallenge) {
      speakPhrase(difficultyMode === 'a2' ? opt.a2Text : opt.b1Text);
      return;
    }

    const isCorrect = acceptedIds.includes(opt.id);
    const branchReply = 'branchReply' in opt ? opt.branchReply : undefined;

    if (isCorrect) {
      onPlaySfx('reward');
      setSolvedCurrentChallenge(true);
      onValidHook?.();
      setFeedback({
        tone: 'success',
        selectedOptionId: opt.id,
        text: buildSandwichFeedback(true, opt.feedback),
        branchReply,
      });
    } else {
      onPlaySfx('click');
      setFeedback({
        tone: 'retry',
        selectedOptionId: opt.id,
        text: buildSandwichFeedback(false, opt.feedback),
        branchReply,
      });
    }
  };

  const handleSelectRoutePin = (pinId: SydneyMiniMapPinId) => {
    const ch = DIRECTION_DECODER_CHALLENGES[challengeIndex];
    if (!ch || ch.mode !== 'pick_destination') return;
    if (solvedCurrentChallenge) return;

    setSelectedPinId(pinId);
    const isCorrect = pinId === ch.correctPinId;
    const explanation = ch.pinExplanations?.[pinId] ?? {
      en: 'Check the turns from City Transit Station carefully.',
      th: 'ลองเช็กทิศทางการเลี้ยวจาก City Transit Station อีกครั้ง',
    };

    if (isCorrect) {
      onPlaySfx('reward');
      setSolvedCurrentChallenge(true);
      setFeedback({
        tone: 'success',
        text: buildSandwichFeedback(true, explanation),
      });
    } else {
      onPlaySfx('click');
      setFeedback({
        tone: 'retry',
        text: buildSandwichFeedback(false, explanation),
      });
    }
  };

  const handleAdvanceChallenge = () => {
    stopSpeech();
    setShowHint(false);
    setFeedback(null);
    setSelectedPinId(null);

    if (challengeIndex + 1 < totalChallenges) {
      onPlaySfx('select');
      setSolvedCurrentChallenge(false);
      setChallengeIndex((prev) => prev + 1);
    } else {
      onPlaySfx('reward');
      setMissionFinished(true);
      onCompleteMission(landmarkId);
    }
  };

  const handleReshuffleAttempt = () => {
    stopSpeech();
    onPlaySfx('select');
    setAttemptNonce((prev) => prev + 1);
  };

  // Current active prompt string for audio controls
  const currentPromptSpeechText = (() => {
    if (landmarkId === 'circular_quay_plaza') {
      const sc = GREETING_DETECTIVE_SCENARIOS[challengeIndex];
      return difficultyMode === 'a2' ? sc.a2Situation.en : sc.b1Situation.en;
    }
    if (landmarkId === 'city_transit_station') {
      return DIRECTION_DECODER_CHALLENGES[challengeIndex].noahSpokenRoute;
    }
    if (landmarkId === 'harbour_market_cafe') {
      const ch = CAFE_ORDER_CHALLENGES[challengeIndex];
      return difficultyMode === 'a2' ? ch.miaPrompt.a2.en : ch.miaPrompt.b1.en;
    }
    if (landmarkId === 'darling_harbour_hub') {
      const ch = TICKET_TALK_CHALLENGES[challengeIndex];
      return difficultyMode === 'a2' ? ch.prompt.a2.en : ch.prompt.b1.en;
    }
    const ch = COMMUNICATION_RESCUE_CHALLENGES[challengeIndex];
    return difficultyMode === 'a2' ? ch.speakerLineA2.en : ch.speakerLineB1.en;
  })();

  const isFifthMissionCompletingStage =
    missionMeta.order === 5 || (alreadyCompletedMission && completedDiscoverCount >= 5);

  const primarySurfaceClass = isNight
    ? 'border-[#38BDF8]/40 bg-[#0F1A33] text-[#F8FAFC]'
    : 'border-[#BAE6FD] bg-[#FFFDF8] text-[#1E2E46]';
  const secondaryCardClass = isNight
    ? 'border-white/12 bg-[#16223E] text-[#F1F5F9]'
    : 'border-[#E2E8F0] bg-white text-[#1E2E46]';
  const subtleTextClass = isNight ? 'text-[#CBD5E1]' : 'text-[#475569]';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="australia-discover-modal-title"
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 ${
        isNight ? 'bg-[#071024]/82' : 'bg-[#0F2942]/45'
      }`}
    >
      <div
        className={`flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border shadow-2xl ${primarySurfaceClass}`}
      >
        {/* Header Bar */}
        <header
          className={`flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3.5 sm:px-6 ${
            isNight
              ? 'border-white/12 bg-gradient-to-r from-[#13254A] via-[#102E4A] to-[#0D3A4E]'
              : 'border-[#BAE6FD] bg-gradient-to-r from-[#E0F2FE] via-[#F0FDFA] to-[#FFFBEB]'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <AustraliaMissionEmblemSVG
              missionId={missionMeta.missionId}
              className="h-12 w-12 shrink-0 rounded-2xl shadow-sm"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold text-[#0284C7] dark:text-[#38BDF8]">
                {landmark.title[language]} · {missionMeta.mechanicLabel[language]}
              </p>
              <h2
                id="australia-discover-modal-title"
                className="font-display text-base sm:text-xl font-extrabold truncate"
              >
                {missionMeta.title[language]}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* A2 / B1 Toggle */}
            <div
              role="group"
              aria-label="CEFR Difficulty Mode"
              className={`inline-flex rounded-xl border p-1 ${
                isNight ? 'border-white/15 bg-[#0A1326]' : 'border-[#CBD5E1] bg-white'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  onPlaySfx('select');
                  onDifficultyChange('a2');
                }}
                className={`min-h-[34px] rounded-lg px-2.5 text-xs font-extrabold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] ${
                  difficultyMode === 'a2'
                    ? 'bg-[#0EA5E9] text-white'
                    : subtleTextClass
                }`}
              >
                {copy.australiaDiscoverCefrA2Label}
              </button>
              <button
                type="button"
                onClick={() => {
                  onPlaySfx('select');
                  onDifficultyChange('b1');
                }}
                className={`min-h-[34px] rounded-lg px-2.5 text-xs font-extrabold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] ${
                  difficultyMode === 'b1'
                    ? 'bg-[#0D9488] text-white'
                    : subtleTextClass
                }`}
              >
                {copy.australiaDiscoverCefrB1Label}
              </button>
            </div>

            <button
              type="button"
              onClick={handleReshuffleAttempt}
              className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] ${
                isNight
                  ? 'border-white/15 bg-white/10 text-white hover:bg-white/20'
                  : 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]'
              }`}
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{copy.australiaDiscoverReshuffleButton}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                stopSpeech();
                onPlaySfx('click');
                onClose();
              }}
              aria-label={copy.closeSettings}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] ${
                isNight
                  ? 'border-white/15 bg-white/10 text-white hover:bg-white/20'
                  : 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F1F5F9]'
              }`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Scrollable Mini-Game Stage Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {missionFinished ? (
            /* Mission Completion Summary */
            <div className="space-y-5 py-2">
              <div
                className={`rounded-3xl border p-6 text-center space-y-4 ${
                  isNight
                    ? 'border-[#10B981]/50 bg-[#0D2B24]'
                    : 'border-[#A7F3D0] bg-[#ECFDF5]'
                }`}
              >
                <div className="mx-auto flex justify-center">
                  <AustraliaMissionEmblemSVG
                    missionId={missionMeta.missionId}
                    className="h-20 w-20 rounded-2xl shadow-lg"
                  />
                </div>
                <p className="text-xs font-extrabold text-[#10B981]">
                  {copy.australiaDiscoverCompletedBadge} · {missionMeta.order} / 5
                </p>
                <h3 className="font-display text-2xl font-extrabold">
                  {copy.australiaDiscoverCompletedSummaryTitle}
                </h3>
                <p className="mx-auto max-w-xl text-sm font-semibold leading-relaxed">
                  {missionMeta.secretUnlocked[language]}
                </p>

                {isFifthMissionCompletingStage ? (
                  <div
                    className={`mx-auto max-w-lg rounded-2xl border p-4 text-left space-y-2 ${
                      isNight
                        ? 'border-[#FBBF24]/50 bg-[#2C2415] text-[#FEF3C7]'
                        : 'border-[#F59E0B] bg-[#FFFBEB] text-[#78350F]'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-display text-sm font-extrabold">
                      <Sparkles className="h-4 w-4 shrink-0 text-[#F59E0B]" aria-hidden="true" />
                      <span>{copy.australiaDiscoverStageCompleteReward}</span>
                    </div>
                    <p className="text-xs font-bold">
                      {copy.australiaDiscoverBuildUnlockedTitle}:{' '}
                      {copy.australiaDiscoverBuildUnlockedNote}
                    </p>
                  </div>
                ) : (
                  <p className={`text-xs font-bold ${subtleTextClass}`}>
                    +0 XP ({copy.australiaLandmarkPhase4BNote})
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleReshuffleAttempt}
                    className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-4 py-2 text-xs font-extrabold cursor-pointer ${secondaryCardClass}`}
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    <span>{copy.australiaDiscoverReshuffleButton}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      stopSpeech();
                      onPlaySfx('click');
                      onClose();
                    }}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#0EA5E9] px-6 py-2.5 font-display text-sm font-extrabold text-white hover:bg-[#0284C7] cursor-pointer"
                  >
                    <span>{copy.australiaDiscoverReturnSydneyButton}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Challenge Step Progress & Audio Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono-num text-xs font-extrabold ${
                      isNight ? 'text-[#38BDF8]' : 'text-[#0284C7]'
                    }`}
                  >
                    {challengeIndex + 1} / {totalChallenges}
                  </span>
                  <div className="flex items-center gap-1" aria-hidden="true">
                    {Array.from({ length: totalChallenges }).map((_, i) => (
                      <span
                        key={i}
                        className={`h-2 w-6 rounded-full transition-colors ${
                          i < challengeIndex
                            ? 'bg-[#10B981]'
                            : i === challengeIndex
                              ? 'bg-[#0EA5E9]'
                              : isNight
                                ? 'bg-white/15'
                                : 'bg-[#CBD5E1]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* TTS Audio Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => speakPhrase(currentPromptSpeechText)}
                    className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] ${
                      isNight
                        ? 'border-[#38BDF8]/40 bg-[#132B4C] text-[#E0F2FE] hover:bg-[#193A66]'
                        : 'border-[#BAE6FD] bg-[#F0F9FF] text-[#0369A1] hover:bg-[#E0F2FE]'
                    }`}
                  >
                    <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.australiaDiscoverHearButton}</span>
                  </button>

                  {lastSpokenText && (
                    <button
                      type="button"
                      onClick={() => speakPhrase(lastSpokenText)}
                      className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${secondaryCardClass}`}
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{copy.australiaDiscoverReplayAudioButton}</span>
                    </button>
                  )}

                  {isSpeaking && (
                    <button
                      type="button"
                      onClick={stopSpeech}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/12 px-3 py-1.5 text-xs font-bold text-[#EF4444] cursor-pointer"
                    >
                      <Square className="h-3 w-3 fill-current" aria-hidden="true" />
                      <span>{copy.australiaDiscoverStopAudioButton}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('click');
                      setShowHint((prev) => !prev);
                    }}
                    className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                      showHint
                        ? 'border-[#F59E0B] bg-[#FEF3C7] text-[#92400E]'
                        : secondaryCardClass
                    }`}
                  >
                    <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>
                      {showHint
                        ? copy.australiaDiscoverHideHintButton
                        : copy.australiaDiscoverHintButton}
                    </span>
                  </button>
                </div>
              </div>

              {/* =========================================================
                  MINI-GAME 1 — GREETING DETECTIVE (circular_quay_plaza)
                 ========================================================= */}
              {landmarkId === 'circular_quay_plaza' && (() => {
                const scenario = GREETING_DETECTIVE_SCENARIOS[challengeIndex];
                const options =
                  shuffledGreetingOptionsById[scenario.id] ?? scenario.options;

                return (
                  <div className="space-y-4">
                    <div className={`rounded-2xl border p-4 sm:p-5 ${secondaryCardClass}`}>
                      <div className="flex items-start gap-3.5">
                        <AustraliaNpcPortraitSVG
                          npcId="npc_olivia"
                          className="h-14 w-14 shrink-0 rounded-2xl shadow-sm"
                        />
                        <div className="space-y-1.5 min-w-0">
                          <p className="text-xs font-extrabold text-[#0284C7] dark:text-[#38BDF8]">
                            {npcEntry.name} · {missionMeta.communicationFocus[language]}
                          </p>
                          <p className="text-sm sm:text-base font-bold leading-relaxed">
                            {difficultyMode === 'a2'
                              ? scenario.a2Situation[language]
                              : scenario.b1Situation[language]}
                          </p>
                          <p className={`text-xs ${subtleTextClass}`}>
                            {scenario.contextTip[language]}
                          </p>
                        </div>
                      </div>

                      {showHint && (
                        <div
                          className={`mt-3 rounded-xl border px-3.5 py-2.5 text-xs font-semibold ${
                            isNight
                              ? 'border-[#F59E0B]/40 bg-[#2C2415] text-[#FDE68A]'
                              : 'border-[#F59E0B]/50 bg-[#FFFBEB] text-[#92400E]'
                          }`}
                        >
                          {scenario.hint[language]}
                        </div>
                      )}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {options.map((opt) => {
                        const label = difficultyMode === 'a2' ? opt.a2Text : opt.b1Text;
                        const isChosen = feedback?.selectedOptionId === opt.id;
                        const isAccepted = scenario.acceptedOptionIds.includes(opt.id);
                        return (
                          <div
                            key={opt.id}
                            className={`flex flex-col justify-between rounded-2xl border p-3.5 transition-all ${
                              !reducedMotion ? 'duration-150' : ''
                            } ${
                              isChosen && feedback?.tone === 'success'
                                ? 'border-[#10B981] bg-[#10B981]/12'
                                : isChosen && feedback?.tone === 'retry'
                                  ? 'border-[#F97316] bg-[#F97316]/10'
                                  : solvedCurrentChallenge && isAccepted
                                    ? 'border-[#10B981]/60 bg-[#10B981]/8'
                                    : secondaryCardClass
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleSelectOption(opt, scenario.acceptedOptionIds)
                              }
                              className="w-full text-left font-semibold text-sm leading-snug min-h-[46px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] rounded-lg"
                            >
                              “{label}”
                            </button>
                            <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-black/8 dark:border-white/10">
                              <button
                                type="button"
                                onClick={() => speakPhrase(label)}
                                className="inline-flex items-center gap-1 text-xs font-bold text-[#0EA5E9] hover:underline cursor-pointer"
                              >
                                <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                                <span>{copy.australiaListenDialogue}</span>
                              </button>
                              {isChosen && (
                                <span className="text-xs font-extrabold">
                                  {feedback?.tone === 'success' ? '✓' : '↺'}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* =========================================================
                  MINI-GAME 2 — DIRECTION DECODER (city_transit_station)
                 ========================================================= */}
              {landmarkId === 'city_transit_station' && (() => {
                const ch = DIRECTION_DECODER_CHALLENGES[challengeIndex];
                const options =
                  shuffledDirectionOptionsById[ch.id] ?? ch.options ?? [];

                return (
                  <div className="space-y-4">
                    <div className={`rounded-2xl border p-4 ${secondaryCardClass}`}>
                      <div className="flex items-start gap-3">
                        <AustraliaNpcPortraitSVG
                          npcId="npc_noah"
                          className="h-12 w-12 shrink-0 rounded-2xl"
                        />
                        <div className="space-y-1">
                          <p className="text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA]">
                            {npcEntry.name} · {npcEntry.role[language]}
                          </p>
                          <p className="text-sm sm:text-base font-bold leading-relaxed">
                            {difficultyMode === 'a2'
                              ? ch.a2Prompt[language]
                              : ch.b1Prompt[language]}
                          </p>
                        </div>
                      </div>
                      {showHint && (
                        <div
                          className={`mt-3 rounded-xl border px-3.5 py-2 text-xs font-semibold ${
                            isNight
                              ? 'border-[#F59E0B]/40 bg-[#2C2415] text-[#FDE68A]'
                              : 'border-[#F59E0B]/50 bg-[#FFFBEB] text-[#92400E]'
                          }`}
                        >
                          {ch.hint[language]}
                        </div>
                      )}
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
                      <SydneyRoutePuzzleMapSVG
                        language={language}
                        isNight={isNight}
                        selectedPinId={selectedPinId}
                        highlightedPathPoints={
                          solvedCurrentChallenge ? ch.activePathPoints : null
                        }
                        interactivePins={ch.mode === 'pick_destination'}
                        onSelectPin={handleSelectRoutePin}
                      />

                      <div className="space-y-2.5">
                        {ch.mode === 'pick_destination' ? (
                          <>
                            <p className="text-xs font-extrabold text-[#0284C7] dark:text-[#38BDF8]">
                              {language === 'th'
                                ? 'เลือกจุดหมายบนแผนที่ (A, B, C หรือ D):'
                                : 'Choose Destination Pin (Map or Buttons):'}
                            </p>
                            {DIRECTION_DECODER_PINS.map((pin) => {
                              const active = selectedPinId === pin.id;
                              return (
                                <button
                                  key={pin.id}
                                  type="button"
                                  onClick={() => handleSelectRoutePin(pin.id)}
                                  className={`flex min-h-[46px] w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2 text-left text-xs sm:text-sm font-bold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] ${
                                    active && solvedCurrentChallenge && ch.correctPinId === pin.id
                                      ? 'border-[#10B981] bg-[#10B981]/14'
                                      : active && feedback?.tone === 'retry'
                                        ? 'border-[#F97316] bg-[#F97316]/12'
                                        : secondaryCardClass
                                  }`}
                                >
                                  <span className="flex items-center gap-2.5">
                                    <span
                                      className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black text-white"
                                      style={{ backgroundColor: pin.color }}
                                    >
                                      {pin.code}
                                    </span>
                                    <span>{pin.label[language]}</span>
                                  </span>
                                  <MapPin className="h-4 w-4 opacity-70" aria-hidden="true" />
                                </button>
                              );
                            })}
                          </>
                        ) : (
                          <>
                            <p className="text-xs font-extrabold text-[#0284C7] dark:text-[#38BDF8]">
                              {language === 'th'
                                ? 'เลือกประโยคขอเช็กเส้นทางให้ชัวร์:'
                                : 'Select the best route clarification phrase:'}
                            </p>
                            {options.map((opt) => {
                              const label =
                                difficultyMode === 'a2' ? opt.a2Text : opt.b1Text;
                              const isChosen = feedback?.selectedOptionId === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() =>
                                    handleSelectOption(opt, ch.acceptedOptionIds ?? [])
                                  }
                                  className={`flex min-h-[46px] w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left text-xs sm:text-sm font-bold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] ${
                                    isChosen && feedback?.tone === 'success'
                                      ? 'border-[#10B981] bg-[#10B981]/14'
                                      : isChosen && feedback?.tone === 'retry'
                                        ? 'border-[#F97316] bg-[#F97316]/12'
                                        : secondaryCardClass
                                  }`}
                                >
                                  <span>“{label}”</span>
                                </button>
                              );
                            })}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* =========================================================
                  MINI-GAME 3 — CAFÉ ORDER QUEST (harbour_market_cafe)
                 ========================================================= */}
              {landmarkId === 'harbour_market_cafe' && (() => {
                const ch = CAFE_ORDER_CHALLENGES[challengeIndex];
                const options = shuffledCafeOptionsById[ch.id] ?? ch.options;

                return (
                  <div className="space-y-4">
                    <div className="grid gap-3 lg:grid-cols-[1fr_240px]">
                      {/* Fictional Menu Board */}
                      <div className={`rounded-2xl border p-3.5 ${secondaryCardClass}`}>
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-display text-xs sm:text-sm font-extrabold text-[#EA580C]">
                            {copy.australiaDiscoverCafeMenuTitle}
                          </h3>
                          <span className={`text-[11px] font-semibold ${subtleTextClass}`}>
                            {copy.australiaDiscoverFictionalNotice}
                          </span>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {HARBOUR_CAFE_SAMPLE_MENU.map((item) => (
                            <div
                              key={item.id}
                              className={`flex items-center justify-between gap-2 rounded-xl border px-2.5 py-2 ${
                                isNight ? 'border-white/10 bg-[#111C33]' : 'border-[#FED7AA] bg-[#FFF7ED]'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <CafeItemIconSVG kind={item.visualKind} className="h-8 w-8 shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-extrabold truncate">
                                    {item.itemName[language]}
                                  </p>
                                  <p className={`text-[10px] truncate ${subtleTextClass}`}>
                                    {item.tag[language]}
                                  </p>
                                </div>
                              </div>
                              <span className="font-mono-num text-xs font-black text-[#EA580C]">
                                {item.samplePriceAud}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Tray Visual */}
                      <div
                        className={`rounded-2xl border p-3.5 flex flex-col justify-between ${
                          isNight ? 'border-[#F59E0B]/35 bg-[#1C2135]' : 'border-[#FDE68A] bg-[#FFFBEB]'
                        }`}
                      >
                        <div>
                          <p className="flex items-center gap-1.5 font-display text-xs font-extrabold text-[#D97706]">
                            <UtensilsCrossed className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{copy.australiaDiscoverCafeTrayTitle}</span>
                          </p>
                          <div className="mt-2.5 flex flex-wrap gap-2">
                            {trayItems.length === 0 ? (
                              <p className={`text-[11px] ${subtleTextClass}`}>
                                {language === 'th'
                                  ? 'เลือกคำขอสุภาพด้านล่างเพื่อเพิ่มรายการลงถาด'
                                  : 'Complete polite turns below to fill your tray.'}
                              </p>
                            ) : (
                              trayItems.map((k, idx) => (
                                <CafeItemIconSVG
                                  key={`${k}-${idx}`}
                                  kind={k}
                                  className="h-9 w-9 rounded-lg shadow-sm"
                                />
                              ))
                            )}
                          </div>
                        </div>
                        <p className="mt-2 text-[10px] font-bold text-[#059669]">
                          {trayItems.length} / {CAFE_ORDER_CHALLENGES.length}{' '}
                          {language === 'th' ? 'ขั้นตอนสำเร็จ' : 'turns completed'}
                        </p>
                      </div>
                    </div>

                    {/* Mia's Turn Prompt */}
                    <div className={`rounded-2xl border p-4 ${secondaryCardClass}`}>
                      <div className="flex items-start gap-3">
                        <AustraliaNpcPortraitSVG
                          npcId="npc_mia"
                          className="h-12 w-12 shrink-0 rounded-2xl"
                        />
                        <div className="space-y-1">
                          <p className="text-xs font-extrabold text-[#EA580C]">
                            {npcEntry.name} ·{' '}
                            {difficultyMode === 'a2'
                              ? ch.customerGoal.a2[language]
                              : ch.customerGoal.b1[language]}
                          </p>
                          <p className="text-sm sm:text-base font-bold">
                            {difficultyMode === 'a2'
                              ? ch.miaPrompt.a2[language]
                              : ch.miaPrompt.b1[language]}
                          </p>
                        </div>
                      </div>
                      {showHint && (
                        <div
                          className={`mt-3 rounded-xl border px-3.5 py-2 text-xs font-semibold ${
                            isNight
                              ? 'border-[#F59E0B]/40 bg-[#2C2415] text-[#FDE68A]'
                              : 'border-[#F59E0B]/50 bg-[#FFFBEB] text-[#92400E]'
                          }`}
                        >
                          {ch.hint[language]}
                        </div>
                      )}
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {options.map((opt) => {
                        const label = difficultyMode === 'a2' ? opt.a2Text : opt.b1Text;
                        const isChosen = feedback?.selectedOptionId === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              handleSelectOption(opt, ch.acceptedOptionIds, () => {
                                if (ch.trayItemToAdd) {
                                  setTrayItems((prev) =>
                                    prev.includes(ch.trayItemToAdd!)
                                      ? prev
                                      : [...prev, ch.trayItemToAdd!],
                                  );
                                }
                              })
                            }
                            className={`flex min-h-[50px] items-center justify-between gap-2 rounded-2xl border p-3.5 text-left text-sm font-bold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] ${
                              isChosen && feedback?.tone === 'success'
                                ? 'border-[#10B981] bg-[#10B981]/14'
                                : isChosen && feedback?.tone === 'retry'
                                  ? 'border-[#F97316] bg-[#F97316]/12'
                                  : secondaryCardClass
                            }`}
                          >
                            <span>“{label}”</span>
                            <Volume2
                              className="h-4 w-4 shrink-0 text-[#EA580C] opacity-75"
                              aria-hidden="true"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* =========================================================
                  MINI-GAME 4 — TICKET TALK CHALLENGE (darling_harbour_hub)
                 ========================================================= */}
              {landmarkId === 'darling_harbour_hub' && (() => {
                const ch = TICKET_TALK_CHALLENGES[challengeIndex];
                const options = shuffledTicketOptionsById[ch.id] ?? ch.options;

                return (
                  <div className="space-y-4">
                    {/* Interactive Harbour Information Board */}
                    <div
                      className={`rounded-2xl border p-4 ${
                        isNight ? 'border-[#8B5CF6]/40 bg-[#151D38]' : 'border-[#DDD6FE] bg-[#F5F3FF]'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div>
                          <p className="font-display text-sm font-extrabold text-[#7C3AED] dark:text-[#C4B5FD]">
                            Darling Harbour Information Board
                          </p>
                          <p className={`text-[11px] font-semibold ${subtleTextClass}`}>
                            {copy.australiaDiscoverFictionalNotice}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {(
                            [
                              ['times', copy.australiaDiscoverBoardTabTimes],
                              ['tickets', copy.australiaDiscoverBoardTabTickets],
                              ['inclusions', copy.australiaDiscoverBoardTabInclusions],
                            ] as const
                          ).map(([tabKey, tabLabel]) => (
                            <button
                              key={tabKey}
                              type="button"
                              onClick={() => {
                                onPlaySfx('select');
                                setBoardTab(tabKey);
                              }}
                              className={`min-h-[34px] rounded-xl px-3 py-1 text-xs font-extrabold cursor-pointer ${
                                boardTab === tabKey
                                  ? 'bg-[#7C3AED] text-white'
                                  : isNight
                                    ? 'bg-white/10 text-[#E2E8F0]'
                                    : 'bg-white text-[#4C1D95]'
                              }`}
                            >
                              {tabLabel}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-3">
                        {DARLING_HARBOUR_INFO_BOARD.map((row) => (
                          <div
                            key={row.id}
                            className={`rounded-xl border p-3 text-xs ${secondaryCardClass}`}
                          >
                            <p className="font-display font-extrabold text-sm">
                              {row.name[language]}
                            </p>
                            {boardTab === 'times' && (
                              <p className="mt-1.5 font-mono-num font-bold text-[#0284C7] dark:text-[#38BDF8]">
                                {row.sessions}
                              </p>
                            )}
                            {boardTab === 'tickets' && (
                              <div className="mt-1.5 space-y-0.5 font-mono-num">
                                <p>Standard: {row.standardSamplePrice}</p>
                                <p className="font-extrabold text-[#10B981]">
                                  Student: {row.studentSamplePrice}
                                </p>
                                <p className="font-bold text-[#7C3AED] dark:text-[#C4B5FD]">
                                  Bundle: {row.bundleSamplePrice}
                                </p>
                              </div>
                            )}
                            {boardTab === 'inclusions' && (
                              <p className={`mt-1.5 leading-snug ${subtleTextClass}`}>
                                {row.includesExhibition[language]}
                              </p>
                            )}
                            <p className={`mt-1.5 text-[10px] ${subtleTextClass}`}>
                              {row.highlightNote[language]}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Jack's Question */}
                    <div className={`rounded-2xl border p-4 ${secondaryCardClass}`}>
                      <div className="flex items-start gap-3">
                        <AustraliaNpcPortraitSVG
                          npcId="npc_jack"
                          className="h-12 w-12 shrink-0 rounded-2xl"
                        />
                        <div className="space-y-1">
                          <p className="text-xs font-extrabold text-[#7C3AED] dark:text-[#C4B5FD]">
                            {npcEntry.name} · {ch.boardClue[language]}
                          </p>
                          <p className="text-sm sm:text-base font-bold leading-relaxed">
                            {difficultyMode === 'a2'
                              ? ch.prompt.a2[language]
                              : ch.prompt.b1[language]}
                          </p>
                        </div>
                      </div>
                      {showHint && (
                        <div
                          className={`mt-3 rounded-xl border px-3.5 py-2 text-xs font-semibold ${
                            isNight
                              ? 'border-[#F59E0B]/40 bg-[#2C2415] text-[#FDE68A]'
                              : 'border-[#F59E0B]/50 bg-[#FFFBEB] text-[#92400E]'
                          }`}
                        >
                          {ch.hint[language]}
                        </div>
                      )}
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {options.map((opt) => {
                        const label = difficultyMode === 'a2' ? opt.a2Text : opt.b1Text;
                        const isChosen = feedback?.selectedOptionId === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectOption(opt, ch.acceptedOptionIds)}
                            className={`flex min-h-[50px] items-center justify-between gap-2 rounded-2xl border p-3.5 text-left text-xs sm:text-sm font-bold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] ${
                              isChosen && feedback?.tone === 'success'
                                ? 'border-[#10B981] bg-[#10B981]/14'
                                : isChosen && feedback?.tone === 'retry'
                                  ? 'border-[#F97316] bg-[#F97316]/12'
                                  : secondaryCardClass
                            }`}
                          >
                            <span>{label}</span>
                            <Volume2
                              className="h-4 w-4 shrink-0 text-[#7C3AED] opacity-75"
                              aria-hidden="true"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* =========================================================
                  MINI-GAME 5 — COMMUNICATION RESCUE (harbour_gardens_help_point)
                 ========================================================= */}
              {landmarkId === 'harbour_gardens_help_point' && (() => {
                const ch = COMMUNICATION_RESCUE_CHALLENGES[challengeIndex];
                const options = (shuffledRescueOptionsById[ch.id] ??
                  ch.options) as DialogueRepairOption[];

                return (
                  <div className="space-y-4">
                    <div
                      className={`rounded-2xl border p-4 space-y-3 ${
                        isNight ? 'border-[#10B981]/35 bg-[#0F2622]' : 'border-[#A7F3D0] bg-[#ECFDF5]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <AustraliaNpcPortraitSVG
                          npcId="npc_olivia"
                          className="h-12 w-12 shrink-0 rounded-2xl"
                        />
                        <div className="space-y-1">
                          <p className="text-xs font-extrabold text-[#0D9488] dark:text-[#34D399]">
                            {ch.speakerName} · {ch.breakdownTag[language]}
                          </p>
                          <p className="text-sm sm:text-base font-bold leading-relaxed">
                            {difficultyMode === 'a2'
                              ? ch.speakerLineA2[language]
                              : ch.speakerLineB1[language]}
                          </p>
                        </div>
                      </div>

                      {showHint && (
                        <div
                          className={`rounded-xl border px-3.5 py-2 text-xs font-semibold ${
                            isNight
                              ? 'border-[#F59E0B]/40 bg-[#2C2415] text-[#FDE68A]'
                              : 'border-[#F59E0B]/50 bg-[#FFFBEB] text-[#92400E]'
                          }`}
                        >
                          {npcEntry.harbourGardensHelperNote?.[language] ?? ''} —{' '}
                          {ch.oliviaHelpHint[language]}
                        </div>
                      )}
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {options.map((opt) => {
                        const label = difficultyMode === 'a2' ? opt.a2Text : opt.b1Text;
                        const isChosen = feedback?.selectedOptionId === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectOption(opt, ch.acceptedOptionIds)}
                            className={`flex min-h-[50px] items-center justify-between gap-2 rounded-2xl border p-3.5 text-left text-xs sm:text-sm font-bold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] ${
                              isChosen && feedback?.tone === 'success'
                                ? 'border-[#10B981] bg-[#10B981]/14'
                                : isChosen && feedback?.tone === 'retry'
                                  ? 'border-[#F97316] bg-[#F97316]/12'
                                  : secondaryCardClass
                            }`}
                          >
                            <span>“{label}”</span>
                            <MessageCircle
                              className="h-4 w-4 shrink-0 text-[#0D9488] opacity-75"
                              aria-hidden="true"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Sandwich Feedback & Branching Follow-Up Box */}
              {feedback && (
                <div
                  aria-live="polite"
                  className={`rounded-2xl border p-4 space-y-2.5 ${
                    feedback.tone === 'success'
                      ? isNight
                        ? 'border-[#10B981]/50 bg-[#0D2B24] text-[#D1FAE5]'
                        : 'border-[#6EE7B7] bg-[#ECFDF5] text-[#065F46]'
                      : isNight
                        ? 'border-[#F97316]/50 bg-[#3B1E11] text-[#FED7AA]'
                        : 'border-[#FDBA74] bg-[#FFF7ED] text-[#9A3412]'
                  }`}
                >
                  {feedback.branchReply && (
                    <div
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold ${secondaryCardClass}`}
                    >
                      <span className="font-extrabold text-[#0D9488]">
                        {copy.australiaDiscoverRepairReplyLabel}:{' '}
                      </span>
                      <span>{feedback.branchReply[language]}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      {feedback.tone === 'success' ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-[#10B981] mt-0.5" aria-hidden="true" />
                      ) : (
                        <Compass className="h-5 w-5 shrink-0 text-[#F97316] mt-0.5" aria-hidden="true" />
                      )}
                      <p className="text-xs sm:text-sm font-bold leading-relaxed">
                        {feedback.text[language]}
                      </p>
                    </div>

                    {solvedCurrentChallenge && (
                      <button
                        type="button"
                        onClick={handleAdvanceChallenge}
                        className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-[#10B981] px-5 py-2 font-display text-xs sm:text-sm font-extrabold text-white hover:bg-[#059669] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9]"
                      >
                        <span>
                          {challengeIndex + 1 < totalChallenges
                            ? copy.australiaDiscoverNextChallengeButton
                            : copy.australiaDiscoverFinishMissionButton}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
