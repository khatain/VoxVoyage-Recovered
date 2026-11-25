import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  HelpCircle,
  MapPin,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Square,
  Undo2,
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
import type { AustraliaDifficultyMode } from '../../data/australiaDiscovery';
import {
  AUSTRALIA_BUILD_MISSIONS,
  AUSTRALIA_BUILD_XP_REWARD,
  buildBuildSandwichFeedback,
  CAFE_KITCHEN_CHALLENGES,
  CONVERSATION_FORGE_CHALLENGES,
  DIRECTION_ARCHITECT_CHALLENGES,
  DIRECTION_FUNCTION_OPTIONS,
  getAustraliaBuildMissionMeta,
  RESCUE_WORKSHOP_CHALLENGES,
  TICKET_INFO_BUILDER_CHALLENGES,
  validateCafeMultiTurn,
  validateDirectionArchitect,
  validateInfoGapBuilder,
  validateRescueChallenge,
  validateSequenceOrder,
  type CafeBuildMenuItem,
  type CommunicationProblemId,
  type DirectionFunctionTag,
  type DirectionRouteNodeId,
} from '../../data/australiaBuild';
import { shuffleArray } from '../../utils/shuffle';
import { voxAudio } from '../../utils/audioEngine';
import { AustraliaNpcPortraitSVG } from './AustraliaSvgArtwork';
import {
  AustraliaBuildBannerArt,
  CafeOrderTrayCard,
  DarlingHarbourInfoBoardCard,
  DirectionRouteDiagramSVG,
  RepairSignalProgressCard,
} from './AustraliaBuildArtwork';

interface AustraliaBuildModalProps {
  landmarkId: AustraliaLandmarkId;
  language: AppLanguage;
  appearance: ResolvedAppearance;
  reducedMotion: boolean;
  alreadyCompletedMission: boolean;
  completedBuildCount: number;
  difficultyMode: AustraliaDifficultyMode;
  onDifficultyChange: (mode: AustraliaDifficultyMode) => void;
  onCompleteMission: (
    landmarkId: AustraliaLandmarkId,
    craftedDialogueSummary: string,
  ) => void;
  onClose: () => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'reward') => void;
}

interface BuildFeedback {
  tone: 'success' | 'retry';
  text: LocalizedText;
}

interface IndexedTile {
  key: string;
  word: string;
}

function toIndexedTiles(words: string[], prefix: string): IndexedTile[] {
  return words.map((word, idx) => ({ key: `${prefix}_${idx}`, word }));
}

export function AustraliaBuildModal({
  landmarkId,
  language,
  appearance,
  reducedMotion,
  alreadyCompletedMission,
  completedBuildCount,
  difficultyMode,
  onDifficultyChange,
  onCompleteMission,
  onClose,
  onPlaySfx,
}: AustraliaBuildModalProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';
  const missionMeta = getAustraliaBuildMissionMeta(landmarkId);
  const landmark =
    AUSTRALIA_LANDMARKS.find((l) => l.id === landmarkId) ?? AUSTRALIA_LANDMARKS[0];
  const npcEntry = AUSTRALIA_NPC_DIALOGUES[missionMeta.npcId];

  const [attemptNonce, setAttemptNonce] = useState(0);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<BuildFeedback | null>(null);
  const [solvedCurrent, setSolvedCurrent] = useState(false);
  const [missionFinished, setMissionFinished] = useState(false);
  const [lastCraftedDialogue, setLastCraftedDialogue] = useState<string>(
    missionMeta.defaultArtifactModel,
  );
  const [lastSpokenText, setLastSpokenText] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 1. Sequence Forge state
  const [orderedCardIds, setOrderedCardIds] = useState<string[]>([]);

  // 2. Direction Dialogue Architect state
  const [dirSelectedTileKeys, setDirSelectedTileKeys] = useState<string[]>([]);
  const [dirSelectedFunction, setDirSelectedFunction] =
    useState<DirectionFunctionTag | null>(null);
  const [dirSelectedNodeId, setDirSelectedNodeId] =
    useState<DirectionRouteNodeId | null>(null);

  // 3. Café Conversation Kitchen state
  const [cafeTurnSelections, setCafeTurnSelections] = useState<Record<string, string>>({});

  // 4. Ticket & Info Builder state
  const [ticketBoardTab, setTicketBoardTab] = useState<'schedules' | 'tickets' | 'booking'>(
    'schedules',
  );
  const [ticketSelectedTileKeys, setTicketSelectedTileKeys] = useState<string[]>([]);
  const [ticketSelectedFollowUpId, setTicketSelectedFollowUpId] = useState<string | null>(
    null,
  );

  // 5. Dialogue Rescue Workshop state
  const [rescueProblemId, setRescueProblemId] = useState<CommunicationProblemId | null>(null);
  const [rescueSelectedTileKeys, setRescueSelectedTileKeys] = useState<string[]>([]);
  const [rescueFollowUpId, setRescueFollowUpId] = useState<string | null>(null);

  const clearInputsForStep = useCallback(() => {
    setShowHint(false);
    setFeedback(null);
    setSolvedCurrent(false);
    setOrderedCardIds([]);
    setDirSelectedTileKeys([]);
    setDirSelectedFunction(null);
    setDirSelectedNodeId(null);
    setCafeTurnSelections({});
    setTicketSelectedTileKeys([]);
    setTicketSelectedFollowUpId(null);
    setRescueProblemId(null);
    setRescueSelectedTileKeys([]);
    setRescueFollowUpId(null);
  }, []);

  // Reset attempt state on landmark change or reshuffle
  useEffect(() => {
    setChallengeIndex(0);
    setMissionFinished(false);
    setLastCraftedDialogue(missionMeta.defaultArtifactModel);
    clearInputsForStep();
  }, [landmarkId, attemptNonce, clearInputsForStep, missionMeta.defaultArtifactModel]);

  // Clear current step selections cleanly if student toggles A2 <-> B1 without reshuffling
  useEffect(() => {
    if (!solvedCurrent && !missionFinished) {
      clearInputsForStep();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficultyMode]);

  // Sync Ticket Info Board focus tab on challenge step change
  useEffect(() => {
    if (landmarkId === 'darling_harbour_hub') {
      const ch = TICKET_INFO_BUILDER_CHALLENGES[challengeIndex];
      if (ch) setTicketBoardTab(ch.focusTab);
    }
  }, [challengeIndex, landmarkId]);

  // Fisher-Yates randomized banks keyed strictly on [landmarkId, attemptNonce]
  const shuffledForgeByChallenge = useMemo(
    () =>
      Object.fromEntries(
        CONVERSATION_FORGE_CHALLENGES.map((ch) => [
          ch.id,
          {
            a2: shuffleArray(ch.a2.cards),
            b1: shuffleArray(ch.b1.cards),
          },
        ]),
      ),
    [landmarkId, attemptNonce],
  );

  const shuffledDirByChallenge = useMemo(
    () =>
      Object.fromEntries(
        DIRECTION_ARCHITECT_CHALLENGES.map((ch) => [
          ch.id,
          {
            a2Tiles: shuffleArray(toIndexedTiles(ch.a2.tileBank, `${ch.id}_a2`)),
            b1Tiles: shuffleArray(toIndexedTiles(ch.b1.tileBank, `${ch.id}_b1`)),
            functions: shuffleArray(DIRECTION_FUNCTION_OPTIONS),
          },
        ]),
      ),
    [landmarkId, attemptNonce],
  );

  const shuffledCafeByChallenge = useMemo(
    () =>
      Object.fromEntries(
        CAFE_KITCHEN_CHALLENGES.map((ch) => [
          ch.id,
          {
            a2Turns: ch.a2.turns.map((t) => ({
              ...t,
              options: shuffleArray(t.options),
            })),
            b1Turns: ch.b1.turns.map((t) => ({
              ...t,
              options: shuffleArray(t.options),
            })),
          },
        ]),
      ),
    [landmarkId, attemptNonce],
  );

  const shuffledTicketByChallenge = useMemo(
    () =>
      Object.fromEntries(
        TICKET_INFO_BUILDER_CHALLENGES.map((ch) => [
          ch.id,
          {
            a2Tiles: shuffleArray(toIndexedTiles(ch.a2.tileBank, `${ch.id}_a2`)),
            b1Tiles: shuffleArray(toIndexedTiles(ch.b1.tileBank, `${ch.id}_b1`)),
            followUps: shuffleArray(ch.followUpOptions),
          },
        ]),
      ),
    [landmarkId, attemptNonce],
  );

  const shuffledRescueByChallenge = useMemo(
    () =>
      Object.fromEntries(
        RESCUE_WORKSHOP_CHALLENGES.map((ch) => [
          ch.id,
          {
            problems: shuffleArray(ch.problemChoices),
            a2Tiles: shuffleArray(toIndexedTiles(ch.a2.tileBank, `${ch.id}_a2`)),
            b1Tiles: shuffleArray(toIndexedTiles(ch.b1.tileBank, `${ch.id}_b1`)),
            followUps: shuffleArray(ch.followUpOptions),
          },
        ]),
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

  const totalChallenges = useMemo(() => {
    switch (landmarkId) {
      case 'circular_quay_plaza':
        return CONVERSATION_FORGE_CHALLENGES.length;
      case 'city_transit_station':
        return DIRECTION_ARCHITECT_CHALLENGES.length;
      case 'harbour_market_cafe':
        return CAFE_KITCHEN_CHALLENGES.length;
      case 'darling_harbour_hub':
        return TICKET_INFO_BUILDER_CHALLENGES.length;
      case 'harbour_gardens_help_point':
        return RESCUE_WORKSHOP_CHALLENGES.length;
    }
  }, [landmarkId]);

  const handleSuccessAdvancePrep = (
    craftedText: string,
    reason: LocalizedText,
    audioToSpeak?: string,
  ) => {
    onPlaySfx('reward');
    setLastCraftedDialogue(craftedText);
    setSolvedCurrent(true);
    setFeedback({
      tone: 'success',
      text: buildBuildSandwichFeedback(true, reason),
    });
    if (audioToSpeak) speakPhrase(audioToSpeak);
  };

  const handleRetryFeedback = (reason: LocalizedText) => {
    onPlaySfx('click');
    setFeedback({
      tone: 'retry',
      text: buildBuildSandwichFeedback(false, reason),
    });
  };

  const handleNextChallengeOrFinish = () => {
    stopSpeech();
    if (challengeIndex + 1 < totalChallenges) {
      onPlaySfx('select');
      setChallengeIndex((prev) => prev + 1);
      clearInputsForStep();
    } else {
      onPlaySfx('reward');
      onCompleteMission(landmarkId, lastCraftedDialogue);
      setMissionFinished(true);
    }
  };

  const willUnlockPracticeAfterThis =
    !alreadyCompletedMission &&
    completedBuildCount === AUSTRALIA_BUILD_MISSIONS.length - 1;

  // Derived active audio text per mechanic
  const currentModelAudio = useMemo(() => {
    switch (landmarkId) {
      case 'circular_quay_plaza':
        return CONVERSATION_FORGE_CHALLENGES[challengeIndex]?.[difficultyMode].audioModel ?? '';
      case 'city_transit_station':
        return DIRECTION_ARCHITECT_CHALLENGES[challengeIndex]?.[difficultyMode].audioModel ?? '';
      case 'harbour_market_cafe': {
        const ch = CAFE_KITCHEN_CHALLENGES[challengeIndex];
        if (!ch) return '';
        return ch[difficultyMode].turns
          .map((t) => {
            const firstValid = t.options.find((o) => o.isValid);
            return `${t.miaPrompt.en} ${firstValid?.text.en ?? ''}`;
          })
          .join(' ');
      }
      case 'darling_harbour_hub':
        return TICKET_INFO_BUILDER_CHALLENGES[challengeIndex]?.[difficultyMode].audioModel ?? '';
      case 'harbour_gardens_help_point':
        return RESCUE_WORKSHOP_CHALLENGES[challengeIndex]?.[difficultyMode].audioModel ?? '';
    }
  }, [challengeIndex, difficultyMode, landmarkId]);

  const renderChallengeContent = () => {
    // 1. Conversation Starter Forge (Sequence Builder)
    if (landmarkId === 'circular_quay_plaza') {
      const challenge = CONVERSATION_FORGE_CHALLENGES[challengeIndex];
      const bankCards = shuffledForgeByChallenge[challenge.id][difficultyMode];
      const cardById = new Map(bankCards.map((c) => [c.id, c]));
      const remainingPool = bankCards.filter((c) => !orderedCardIds.includes(c.id));

      const moveCard = (idx: number, delta: -1 | 1) => {
        if (solvedCurrent) return;
        const nextIdx = idx + delta;
        if (nextIdx < 0 || nextIdx >= orderedCardIds.length) return;
        onPlaySfx('select');
        setOrderedCardIds((prev) => {
          const copyIds = [...prev];
          [copyIds[idx], copyIds[nextIdx]] = [copyIds[nextIdx], copyIds[idx]];
          return copyIds;
        });
        setFeedback(null);
      };

      const checkSequence = () => {
        const res = validateSequenceOrder(challenge, difficultyMode, orderedCardIds);
        if (res.valid) {
          const joined = orderedCardIds
            .map((id) => cardById.get(id)?.text.en ?? '')
            .filter(Boolean)
            .join(' ');
          handleSuccessAdvancePrep(joined, res.reason, challenge[difficultyMode].audioModel);
        } else {
          handleRetryFeedback(res.reason);
        }
      };

      return (
        <div className="space-y-4">
          <div
            className={`rounded-2xl border p-4 ${
              isNight ? 'border-white/12 bg-[#132242]' : 'border-[#BAE6FD] bg-[#F0F9FF]'
            }`}
          >
            <p className="text-xs font-extrabold text-[#0EA5E9]">
              {challenge.participants[language]}
            </p>
            <p className="mt-1 text-sm sm:text-base font-bold leading-relaxed">
              {challenge.scenario[language]}
            </p>
            <p className={`mt-1 text-xs ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
              {challenge.learningObjective[language]}
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Ordered Strip */}
            <div
              className={`rounded-2xl border p-3.5 space-y-2 ${
                isNight ? 'border-[#38BDF8]/30 bg-[#0F1B36]' : 'border-[#CBD5E1] bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-extrabold text-[#0EA5E9]">
                  {copy.australiaBuildSequenceStripTitle}
                </p>
                {!solvedCurrent && orderedCardIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('click');
                      setOrderedCardIds([]);
                      setFeedback(null);
                    }}
                    className="text-[11px] font-bold text-[#EF4444] hover:underline cursor-pointer"
                  >
                    {copy.australiaBuildClearButton}
                  </button>
                )}
              </div>

              {orderedCardIds.length === 0 ? (
                <div
                  className={`rounded-xl border border-dashed p-4 text-center text-xs ${
                    isNight
                      ? 'border-white/15 text-[#94A3B8]'
                      : 'border-[#CBD5E1] text-[#64748B]'
                  }`}
                >
                  {language === 'th'
                    ? 'แตะการ์ดจากฝั่งขวาทีละใบเพื่อนำมาเรียงลำดับบทสนทนา'
                    : 'Tap dialogue cards on the right to place them here in order.'}
                </div>
              ) : (
                <div className="space-y-2">
                  {orderedCardIds.map((cardId, idx) => {
                    const card = cardById.get(cardId);
                    if (!card) return null;
                    return (
                      <div
                        key={card.id}
                        className={`rounded-xl border p-3 ${
                          isNight
                            ? 'border-[#38BDF8]/40 bg-[#17284E]'
                            : 'border-[#BAE6FD] bg-[#F8FAFC]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[11px] font-extrabold text-[#0EA5E9]">
                              {idx + 1}. {card.speakerName[language]}
                            </p>
                            <p className="mt-0.5 text-sm font-bold leading-snug">
                              “{card.text.en}”
                            </p>
                            {language === 'th' && (
                              <p className="mt-0.5 text-[11px] opacity-80">{card.text.th}</p>
                            )}
                          </div>

                          {!solvedCurrent && (
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveCard(idx, -1)}
                                aria-label={copy.australiaBuildMoveUpButton}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/15 bg-white/80 text-[#1E2E46] disabled:opacity-35 cursor-pointer dark:border-white/15 dark:bg-white/10 dark:text-white"
                              >
                                <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === orderedCardIds.length - 1}
                                onClick={() => moveCard(idx, 1)}
                                aria-label={copy.australiaBuildMoveDownButton}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/15 bg-white/80 text-[#1E2E46] disabled:opacity-35 cursor-pointer dark:border-white/15 dark:bg-white/10 dark:text-white"
                              >
                                <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onPlaySfx('click');
                                  setOrderedCardIds((prev) => prev.filter((id) => id !== card.id));
                                  setFeedback(null);
                                }}
                                aria-label={copy.australiaBuildRemoveCardButton}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#EF4444]/35 bg-[#FEF2F2] text-[#B91C1C] cursor-pointer dark:bg-[#450A0A] dark:text-[#FECACA]"
                              >
                                <X className="h-3.5 w-3.5" aria-hidden="true" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Shuffled Card Pool */}
            <div
              className={`rounded-2xl border p-3.5 space-y-2 ${
                isNight ? 'border-white/12 bg-[#132242]' : 'border-[#E2E8F0] bg-[#F8FAFC]'
              }`}
            >
              <p className="text-xs font-extrabold">
                {copy.australiaBuildSequencePoolTitle}
              </p>
              {remainingPool.length === 0 ? (
                <p className="py-4 text-center text-xs opacity-75">
                  {language === 'th'
                    ? 'นำการ์ดทั้งหมดลงในลำดับแล้ว กดตรวจบทสนทนาได้เลย'
                    : 'All cards placed in your sequence! Ready to check.'}
                </p>
              ) : (
                <div className="space-y-2">
                  {remainingPool.map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      disabled={solvedCurrent}
                      onClick={() => {
                        onPlaySfx('select');
                        setOrderedCardIds((prev) => [...prev, card.id]);
                        setFeedback(null);
                      }}
                      className={`w-full min-h-[48px] rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                        isNight
                          ? 'border-white/15 bg-[#192B52] text-[#F8FAFC] hover:border-[#38BDF8]'
                          : 'border-[#CBD5E1] bg-white text-[#1E2E46] hover:border-[#0EA5E9] hover:bg-[#F0F9FF]'
                      }`}
                    >
                      <p className="text-[11px] font-extrabold text-[#0EA5E9]">
                        {card.speakerName[language]}
                      </p>
                      <p className="mt-0.5 text-sm font-bold">{card.text.en}</p>
                      {language === 'th' && (
                        <p className="mt-0.5 text-[11px] opacity-80">{card.text.th}</p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {!solvedCurrent && (
            <button
              type="button"
              onClick={checkSequence}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#0EA5E9] px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white hover:bg-[#0284C7] cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              <span>{copy.australiaBuildCheckAnswerButton}</span>
            </button>
          )}
        </div>
      );
    }

    // 2. Direction Dialogue Architect (Tile Builder + Function Tag + Route Diagram)
    if (landmarkId === 'city_transit_station') {
      const challenge = DIRECTION_ARCHITECT_CHALLENGES[challengeIndex];
      const shuffled = shuffledDirByChallenge[challenge.id];
      const tileList =
        difficultyMode === 'a2' ? shuffled.a2Tiles : shuffled.b1Tiles;
      const tileMap = new Map(tileList.map((t) => [t.key, t.word]));
      const selectedWords = dirSelectedTileKeys
        .map((k) => tileMap.get(k) ?? '')
        .filter(Boolean);

      const checkDirection = () => {
        const res = validateDirectionArchitect(
          challenge,
          difficultyMode,
          selectedWords,
          dirSelectedFunction,
          dirSelectedNodeId,
        );
        if (res.valid) {
          handleSuccessAdvancePrep(
            selectedWords.join(' '),
            res.reason,
            challenge[difficultyMode].audioModel,
          );
        } else {
          handleRetryFeedback(res.reason);
        }
      };

      return (
        <div className="space-y-4">
          <div
            className={`rounded-2xl border p-4 ${
              isNight ? 'border-white/12 bg-[#132242]' : 'border-[#BAE6FD] bg-[#F0F9FF]'
            }`}
          >
            <p className="text-sm sm:text-base font-bold leading-relaxed">
              {challenge.scenario[language]}
            </p>
            <p className={`mt-1 text-xs ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
              {challenge.noahContext[language]}
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Tile Builder & Function Tags */}
            <div className="space-y-3">
              <div
                className={`rounded-2xl border p-3.5 ${
                  isNight ? 'border-[#38BDF8]/30 bg-[#0F1B36]' : 'border-[#CBD5E1] bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-extrabold text-[#0EA5E9]">
                    {copy.australiaBuildTileStripTitle}
                  </p>
                  {!solvedCurrent && dirSelectedTileKeys.length > 0 && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onPlaySfx('click');
                          setDirSelectedTileKeys((prev) => prev.slice(0, -1));
                          setFeedback(null);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0EA5E9] hover:underline cursor-pointer"
                      >
                        <Undo2 className="h-3 w-3" aria-hidden="true" />
                        <span>{copy.australiaBuildUndoTileButton}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onPlaySfx('click');
                          setDirSelectedTileKeys([]);
                          setFeedback(null);
                        }}
                        className="text-[11px] font-bold text-[#EF4444] hover:underline cursor-pointer"
                      >
                        {copy.australiaBuildClearButton}
                      </button>
                    </div>
                  )}
                </div>

                <div
                  className={`mt-2 min-h-[56px] rounded-xl border p-2.5 flex flex-wrap gap-1.5 ${
                    isNight
                      ? 'border-white/15 bg-[#152344]'
                      : 'border-[#E2E8F0] bg-[#F8FAFC]'
                  }`}
                >
                  {dirSelectedTileKeys.length === 0 ? (
                    <span className="text-xs opacity-70">{copy.australiaBuildTilePoolTitle}</span>
                  ) : (
                    dirSelectedTileKeys.map((tileKey) => (
                      <button
                        key={tileKey}
                        type="button"
                        disabled={solvedCurrent}
                        onClick={() => {
                          onPlaySfx('click');
                          setDirSelectedTileKeys((prev) => prev.filter((k) => k !== tileKey));
                          setFeedback(null);
                        }}
                        className="min-h-[38px] rounded-lg bg-[#0EA5E9] px-2.5 py-1 text-xs sm:text-sm font-extrabold text-white cursor-pointer"
                      >
                        {tileMap.get(tileKey)}
                      </button>
                    ))
                  )}
                </div>

                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {tileList.map((tile) => {
                    const used = dirSelectedTileKeys.includes(tile.key);
                    return (
                      <button
                        key={tile.key}
                        type="button"
                        disabled={used || solvedCurrent}
                        onClick={() => {
                          onPlaySfx('select');
                          setDirSelectedTileKeys((prev) => [...prev, tile.key]);
                          setFeedback(null);
                        }}
                        className={`min-h-[40px] rounded-lg border px-2.5 py-1 text-xs sm:text-sm font-bold cursor-pointer disabled:opacity-35 ${
                          isNight
                            ? 'border-white/15 bg-[#192B52] text-[#F8FAFC] hover:border-[#38BDF8]'
                            : 'border-[#CBD5E1] bg-white text-[#1E2E46] hover:border-[#0EA5E9]'
                        }`}
                      >
                        {tile.word}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Function Selector */}
              <div
                className={`rounded-2xl border p-3.5 ${
                  isNight ? 'border-white/12 bg-[#132242]' : 'border-[#E2E8F0] bg-white'
                }`}
              >
                <p className="text-xs font-extrabold text-[#0EA5E9]">
                  {copy.australiaBuildFunctionSelectorTitle}
                </p>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {shuffled.functions.map((fn) => {
                    const active = dirSelectedFunction === fn.id;
                    return (
                      <button
                        key={fn.id}
                        type="button"
                        disabled={solvedCurrent}
                        onClick={() => {
                          onPlaySfx('select');
                          setDirSelectedFunction(fn.id);
                          setFeedback(null);
                        }}
                        className={`min-h-[44px] rounded-xl border px-3 py-2 text-left text-xs font-extrabold cursor-pointer ${
                          active
                            ? 'border-[#0EA5E9] bg-[#0EA5E9] text-white'
                            : isNight
                              ? 'border-white/15 bg-[#192B52] text-[#F8FAFC] hover:border-[#38BDF8]'
                              : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#1E2E46] hover:bg-[#F0F9FF]'
                        }`}
                      >
                        {fn.label[language]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Interactive Route Confirmation Diagram */}
            <div className="space-y-3">
              <p className="text-xs font-extrabold text-[#0EA5E9]">
                {copy.australiaBuildRouteDiagramTitle}
              </p>
              <DirectionRouteDiagramSVG
                language={language}
                isNight={isNight}
                selectedNodeId={dirSelectedNodeId}
                activePathPoints={challenge.activePathPoints}
                interactive={!solvedCurrent}
                onSelectNode={(nodeId) => {
                  onPlaySfx('select');
                  setDirSelectedNodeId(nodeId);
                  setFeedback(null);
                }}
              />
            </div>
          </div>

          {!solvedCurrent && (
            <button
              type="button"
              onClick={checkDirection}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#0EA5E9] px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white hover:bg-[#0284C7] cursor-pointer"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>{copy.australiaBuildCheckAnswerButton}</span>
            </button>
          )}
        </div>
      );
    }

    // 3. Café Conversation Kitchen (Multi-Turn Counter + Menu + Live Order Tray)
    if (landmarkId === 'harbour_market_cafe') {
      const challenge = CAFE_KITCHEN_CHALLENGES[challengeIndex];
      const turns =
        difficultyMode === 'a2'
          ? shuffledCafeByChallenge[challenge.id].a2Turns
          : shuffledCafeByChallenge[challenge.id].b1Turns;

      const trayItemIds: CafeBuildMenuItem['id'][] = turns
        .map((t) => {
          const pickedId = cafeTurnSelections[t.slotId];
          const opt = t.options.find((o) => o.id === pickedId);
          return opt?.trayItemToAdd;
        })
        .filter((x): x is CafeBuildMenuItem['id'] => Boolean(x));

      const checkCafe = () => {
        const res = validateCafeMultiTurn(challenge, difficultyMode, cafeTurnSelections);
        if (res.valid) {
          const assembledDialogue = turns
            .map((t) => {
              const pickedId = cafeTurnSelections[t.slotId];
              const opt = t.options.find((o) => o.id === pickedId);
              return opt?.text.en ?? '';
            })
            .filter(Boolean)
            .join(' ');
          handleSuccessAdvancePrep(assembledDialogue, res.reason, assembledDialogue);
        } else {
          handleRetryFeedback(res.reason);
        }
      };

      return (
        <div className="space-y-4">
          <div
            className={`rounded-2xl border p-4 ${
              isNight ? 'border-white/12 bg-[#132242]' : 'border-[#FED7AA] bg-[#FFF7ED]'
            }`}
          >
            <p className="text-sm sm:text-base font-bold leading-relaxed">
              {challenge.scenario[language]}
            </p>
            <p className={`mt-1 text-xs ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
              {challenge.learningObjective[language]}
            </p>
          </div>

          <CafeOrderTrayCard
            language={language}
            isNight={isNight}
            trayItemIds={trayItemIds}
          />

          <div className="space-y-3">
            <p className="text-xs font-extrabold text-[#EA580C]">
              {copy.australiaBuildCafeTurnsTitle}
            </p>
            {turns.map((turn, tIdx) => {
              const pickedId = cafeTurnSelections[turn.slotId];
              return (
                <div
                  key={turn.slotId}
                  className={`rounded-2xl border p-3.5 space-y-2.5 ${
                    isNight ? 'border-white/12 bg-[#132242]' : 'border-[#E2E8F0] bg-white'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-[#EA580C]">
                      {tIdx + 1}. {turn.stepLabel[language]}
                    </span>
                  </div>
                  <p className="text-sm font-bold">
                    Mia: “{turn.miaPrompt[language]}”
                  </p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {turn.options.map((opt) => {
                      const active = pickedId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={solvedCurrent}
                          onClick={() => {
                            onPlaySfx('select');
                            setCafeTurnSelections((prev) => ({
                              ...prev,
                              [turn.slotId]: opt.id,
                            }));
                            setFeedback(null);
                            speakPhrase(opt.text.en);
                          }}
                          className={`min-h-[48px] rounded-xl border p-2.5 text-left text-xs transition-colors cursor-pointer ${
                            active
                              ? 'border-[#EA580C] bg-[#EA580C] text-white font-bold'
                              : isNight
                                ? 'border-white/15 bg-[#192B52] text-[#F8FAFC] hover:border-[#FDBA74]'
                                : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#1E2E46] hover:bg-[#FFF7ED]'
                          }`}
                        >
                          <p className="font-bold leading-snug">{opt.text.en}</p>
                          {language === 'th' && (
                            <p className="mt-0.5 text-[11px] opacity-85">{opt.text.th}</p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {!solvedCurrent && (
            <button
              type="button"
              onClick={checkCafe}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#EA580C] px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white hover:bg-[#C2410C] cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              <span>{copy.australiaBuildCheckAnswerButton}</span>
            </button>
          )}
        </div>
      );
    }

    // 4. Ticket & Information Builder (Darling Harbour Hub — Jack)
    if (landmarkId === 'darling_harbour_hub') {
      const challenge = TICKET_INFO_BUILDER_CHALLENGES[challengeIndex];
      const shuffled = shuffledTicketByChallenge[challenge.id];
      const tileList =
        difficultyMode === 'a2' ? shuffled.a2Tiles : shuffled.b1Tiles;
      const tileMap = new Map(tileList.map((t) => [t.key, t.word]));
      const selectedWords = ticketSelectedTileKeys
        .map((k) => tileMap.get(k) ?? '')
        .filter(Boolean);

      const checkInfoGap = () => {
        const res = validateInfoGapBuilder(
          challenge,
          difficultyMode,
          selectedWords,
          ticketSelectedFollowUpId,
        );
        if (res.valid) {
          const fu = challenge.followUpOptions.find((f) => f.id === ticketSelectedFollowUpId);
          const summary = `${selectedWords.join(' ')} ${fu?.text.en ?? ''}`.trim();
          handleSuccessAdvancePrep(
            summary,
            res.reason,
            `${challenge[difficultyMode].audioModel} ${fu?.text.en ?? ''}`,
          );
        } else {
          handleRetryFeedback(res.reason);
        }
      };

      return (
        <div className="space-y-4">
          <div
            className={`rounded-2xl border p-4 ${
              isNight ? 'border-white/12 bg-[#132242]' : 'border-[#DDD6FE] bg-[#F5F3FF]'
            }`}
          >
            <p className="text-xs font-extrabold text-[#7C3AED] dark:text-[#C4B5FD]">
              {challenge.informationGoal[language]}
            </p>
            <p className="mt-1 text-sm sm:text-base font-bold leading-relaxed">
              {challenge.scenario[language]}
            </p>
          </div>

          <DarlingHarbourInfoBoardCard
            language={language}
            isNight={isNight}
            activeTab={ticketBoardTab}
            onTabChange={(tab) => {
              onPlaySfx('select');
              setTicketBoardTab(tab);
            }}
          />

          {/* Step 1: Question Tile Builder */}
          <div
            className={`rounded-2xl border p-3.5 space-y-2.5 ${
              isNight ? 'border-[#38BDF8]/30 bg-[#0F1B36]' : 'border-[#CBD5E1] bg-white'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-extrabold text-[#7C3AED] dark:text-[#C4B5FD]">
                {copy.australiaBuildTicketQuestionLabel}
              </p>
              {!solvedCurrent && ticketSelectedTileKeys.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('click');
                      setTicketSelectedTileKeys((prev) => prev.slice(0, -1));
                      setFeedback(null);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7C3AED] dark:text-[#C4B5FD] hover:underline cursor-pointer"
                  >
                    <Undo2 className="h-3 w-3" aria-hidden="true" />
                    <span>{copy.australiaBuildUndoTileButton}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('click');
                      setTicketSelectedTileKeys([]);
                      setFeedback(null);
                    }}
                    className="text-[11px] font-bold text-[#EF4444] hover:underline cursor-pointer"
                  >
                    {copy.australiaBuildClearButton}
                  </button>
                </div>
              )}
            </div>

            <div
              className={`min-h-[52px] rounded-xl border p-2.5 flex flex-wrap gap-1.5 ${
                isNight ? 'border-white/15 bg-[#152344]' : 'border-[#E2E8F0] bg-[#F8FAFC]'
              }`}
            >
              {ticketSelectedTileKeys.length === 0 ? (
                <span className="text-xs opacity-70">{copy.australiaBuildTilePoolTitle}</span>
              ) : (
                ticketSelectedTileKeys.map((tileKey) => (
                  <button
                    key={tileKey}
                    type="button"
                    disabled={solvedCurrent}
                    onClick={() => {
                      onPlaySfx('click');
                      setTicketSelectedTileKeys((prev) => prev.filter((k) => k !== tileKey));
                      setFeedback(null);
                    }}
                    className="min-h-[38px] rounded-lg bg-[#7C3AED] px-2.5 py-1 text-xs sm:text-sm font-extrabold text-white cursor-pointer"
                  >
                    {tileMap.get(tileKey)}
                  </button>
                ))
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {tileList.map((tile) => {
                const used = ticketSelectedTileKeys.includes(tile.key);
                return (
                  <button
                    key={tile.key}
                    type="button"
                    disabled={used || solvedCurrent}
                    onClick={() => {
                      onPlaySfx('select');
                      setTicketSelectedTileKeys((prev) => [...prev, tile.key]);
                      setFeedback(null);
                    }}
                    className={`min-h-[40px] rounded-lg border px-2.5 py-1 text-xs sm:text-sm font-bold cursor-pointer disabled:opacity-35 ${
                      isNight
                        ? 'border-white/15 bg-[#192B52] text-[#F8FAFC] hover:border-[#A78BFA]'
                        : 'border-[#CBD5E1] bg-white text-[#1E2E46] hover:border-[#7C3AED]'
                    }`}
                  >
                    {tile.word}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Jack's Preview + Follow-Up Confirmation */}
          <div
            className={`rounded-2xl border p-3.5 space-y-2.5 ${
              isNight ? 'border-white/12 bg-[#132242]' : 'border-[#E2E8F0] bg-white'
            }`}
          >
            <p className="text-xs font-extrabold text-[#7C3AED] dark:text-[#C4B5FD]">
              {copy.australiaBuildTicketFollowUpLabel}
            </p>
            <p className="text-xs sm:text-sm font-bold italic">
              {challenge.jackAnswerPreview[language]}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {shuffled.followUps.map((fu) => {
                const active = ticketSelectedFollowUpId === fu.id;
                return (
                  <button
                    key={fu.id}
                    type="button"
                    disabled={solvedCurrent}
                    onClick={() => {
                      onPlaySfx('select');
                      setTicketSelectedFollowUpId(fu.id);
                      setFeedback(null);
                      speakPhrase(fu.text.en);
                    }}
                    className={`min-h-[48px] rounded-xl border p-3 text-left text-xs cursor-pointer ${
                      active
                        ? 'border-[#7C3AED] bg-[#7C3AED] text-white font-bold'
                        : isNight
                          ? 'border-white/15 bg-[#192B52] text-[#F8FAFC] hover:border-[#C4B5FD]'
                          : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#1E2E46] hover:bg-[#F5F3FF]'
                    }`}
                  >
                    <p className="font-bold">{fu.text.en}</p>
                    {language === 'th' && (
                      <p className="mt-0.5 text-[11px] opacity-85">{fu.text.th}</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {!solvedCurrent && (
            <button
              type="button"
              onClick={checkInfoGap}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white hover:bg-[#6D28D9] cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              <span>{copy.australiaBuildCheckAnswerButton}</span>
            </button>
          )}
        </div>
      );
    }

    // 5. Dialogue Rescue Workshop (3-Step Breakdown + Repair Tile Builder + Follow-Up)
    const challenge = RESCUE_WORKSHOP_CHALLENGES[challengeIndex];
    const shuffled = shuffledRescueByChallenge[challenge.id];
    const tileList =
      difficultyMode === 'a2' ? shuffled.a2Tiles : shuffled.b1Tiles;
    const tileMap = new Map(tileList.map((t) => [t.key, t.word]));
    const selectedWords = rescueSelectedTileKeys
      .map((k) => tileMap.get(k) ?? '')
      .filter(Boolean);

    const checkRescue = () => {
      const res = validateRescueChallenge(
        challenge,
        difficultyMode,
        rescueProblemId,
        selectedWords,
        rescueFollowUpId,
      );
      if (res.valid) {
        const fu = challenge.followUpOptions.find((f) => f.id === rescueFollowUpId);
        const summary = `${selectedWords.join(' ')} ${fu?.text.en ?? ''}`.trim();
        handleSuccessAdvancePrep(
          summary,
          res.reason,
          `${challenge[difficultyMode].audioModel} ${fu?.text.en ?? ''}`,
        );
      } else {
        handleRetryFeedback(res.reason);
      }
    };

    return (
      <div className="space-y-4">
        <div
          className={`rounded-2xl border p-4 ${
            isNight ? 'border-[#14B8A6]/35 bg-[#0F2625]' : 'border-[#99F6E4] bg-[#F0FDFA]'
          }`}
        >
          <p className="text-sm sm:text-base font-bold leading-relaxed">
            {challenge.scenario[language]}
          </p>
          <p className="mt-2 rounded-xl bg-black/5 px-3 py-2 text-xs sm:text-sm font-extrabold dark:bg-white/10">
            {challenge.brokenLine[language]}
          </p>
        </div>

        <RepairSignalProgressCard
          language={language}
          isNight={isNight}
          problemPicked={rescueProblemId !== null}
          tilesCount={rescueSelectedTileKeys.length}
          followUpPicked={rescueFollowUpId !== null}
        />

        {/* Step 1: Problem Identification */}
        <div
          className={`rounded-2xl border p-3.5 space-y-2 ${
            isNight ? 'border-white/12 bg-[#132242]' : 'border-[#E2E8F0] bg-white'
          }`}
        >
          <p className="text-xs font-extrabold text-[#0D9488] dark:text-[#5EEAD4]">
            {copy.australiaBuildRescueStep1Title}
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {shuffled.problems.map((p) => {
              const active = rescueProblemId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={solvedCurrent}
                  onClick={() => {
                    onPlaySfx('select');
                    setRescueProblemId(p.id);
                    setFeedback(null);
                  }}
                  className={`min-h-[46px] rounded-xl border p-2.5 text-left text-xs font-bold cursor-pointer ${
                    active
                      ? 'border-[#0D9488] bg-[#0D9488] text-white'
                      : isNight
                        ? 'border-white/15 bg-[#192B52] text-[#F8FAFC] hover:border-[#5EEAD4]'
                        : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#1E2E46] hover:bg-[#F0FDFA]'
                  }`}
                >
                  {p.label[language]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Repair Tile Assembly */}
        <div
          className={`rounded-2xl border p-3.5 space-y-2.5 ${
            isNight ? 'border-[#38BDF8]/30 bg-[#0F1B36]' : 'border-[#CBD5E1] bg-white'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-extrabold text-[#0D9488] dark:text-[#5EEAD4]">
              {copy.australiaBuildRescueStep2Title}
            </p>
            {!solvedCurrent && rescueSelectedTileKeys.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('click');
                    setRescueSelectedTileKeys((prev) => prev.slice(0, -1));
                    setFeedback(null);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0D9488] dark:text-[#5EEAD4] hover:underline cursor-pointer"
                >
                  <Undo2 className="h-3 w-3" aria-hidden="true" />
                  <span>{copy.australiaBuildUndoTileButton}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('click');
                    setRescueSelectedTileKeys([]);
                    setFeedback(null);
                  }}
                  className="text-[11px] font-bold text-[#EF4444] hover:underline cursor-pointer"
                >
                  {copy.australiaBuildClearButton}
                </button>
              </div>
            )}
          </div>

          <div
            className={`min-h-[52px] rounded-xl border p-2.5 flex flex-wrap gap-1.5 ${
              isNight ? 'border-white/15 bg-[#152344]' : 'border-[#E2E8F0] bg-[#F8FAFC]'
            }`}
          >
            {rescueSelectedTileKeys.length === 0 ? (
              <span className="text-xs opacity-70">{copy.australiaBuildTilePoolTitle}</span>
            ) : (
              rescueSelectedTileKeys.map((tileKey) => (
                <button
                  key={tileKey}
                  type="button"
                  disabled={solvedCurrent}
                  onClick={() => {
                    onPlaySfx('click');
                    setRescueSelectedTileKeys((prev) => prev.filter((k) => k !== tileKey));
                    setFeedback(null);
                  }}
                  className="min-h-[38px] rounded-lg bg-[#0D9488] px-2.5 py-1 text-xs sm:text-sm font-extrabold text-white cursor-pointer"
                >
                  {tileMap.get(tileKey)}
                </button>
              ))
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {tileList.map((tile) => {
              const used = rescueSelectedTileKeys.includes(tile.key);
              return (
                <button
                  key={tile.key}
                  type="button"
                  disabled={used || solvedCurrent}
                  onClick={() => {
                    onPlaySfx('select');
                    setRescueSelectedTileKeys((prev) => [...prev, tile.key]);
                    setFeedback(null);
                  }}
                  className={`min-h-[40px] rounded-lg border px-2.5 py-1 text-xs sm:text-sm font-bold cursor-pointer disabled:opacity-35 ${
                    isNight
                      ? 'border-white/15 bg-[#192B52] text-[#F8FAFC] hover:border-[#5EEAD4]'
                      : 'border-[#CBD5E1] bg-white text-[#1E2E46] hover:border-[#0D9488]'
                  }`}
                >
                  {tile.word}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Helper Reply + Polite Follow-Up */}
        <div
          className={`rounded-2xl border p-3.5 space-y-2.5 ${
            isNight ? 'border-white/12 bg-[#132242]' : 'border-[#E2E8F0] bg-white'
          }`}
        >
          <p className="text-xs font-extrabold text-[#0D9488] dark:text-[#5EEAD4]">
            {copy.australiaBuildRescueStep3Title}
          </p>
          <p className="text-xs sm:text-sm font-bold italic">
            {challenge.oliviaClarificationReply[language]}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {shuffled.followUps.map((fu) => {
              const active = rescueFollowUpId === fu.id;
              return (
                <button
                  key={fu.id}
                  type="button"
                  disabled={solvedCurrent}
                  onClick={() => {
                    onPlaySfx('select');
                    setRescueFollowUpId(fu.id);
                    setFeedback(null);
                    speakPhrase(fu.text.en);
                  }}
                  className={`min-h-[48px] rounded-xl border p-3 text-left text-xs cursor-pointer ${
                    active
                      ? 'border-[#0D9488] bg-[#0D9488] text-white font-bold'
                      : isNight
                        ? 'border-white/15 bg-[#192B52] text-[#F8FAFC] hover:border-[#5EEAD4]'
                        : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#1E2E46] hover:bg-[#F0FDFA]'
                  }`}
                >
                  <p className="font-bold">{fu.text.en}</p>
                  {language === 'th' && (
                    <p className="mt-0.5 text-[11px] opacity-85">{fu.text.th}</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {!solvedCurrent && (
          <button
            type="button"
            onClick={checkRescue}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#0D9488] px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white hover:bg-[#0F766E] cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <span>{copy.australiaBuildCheckAnswerButton}</span>
          </button>
        )}
      </div>
    );
  };

  const currentHintText: LocalizedText = useMemo(() => {
    switch (landmarkId) {
      case 'circular_quay_plaza':
        return CONVERSATION_FORGE_CHALLENGES[challengeIndex].hint;
      case 'city_transit_station':
        return DIRECTION_ARCHITECT_CHALLENGES[challengeIndex].hint;
      case 'harbour_market_cafe':
        return CAFE_KITCHEN_CHALLENGES[challengeIndex].hint;
      case 'darling_harbour_hub':
        return TICKET_INFO_BUILDER_CHALLENGES[challengeIndex].hint;
      case 'harbour_gardens_help_point':
        return RESCUE_WORKSHOP_CHALLENGES[challengeIndex].hint;
    }
  }, [challengeIndex, landmarkId]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="australia-build-modal-title"
      className={`fixed inset-0 z-40 flex items-center justify-center p-2.5 sm:p-5 ${
        isNight ? 'bg-[#081229]/82' : 'bg-[#0F2942]/45'
      }`}
    >
      <div
        className={`flex max-h-[93dvh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border shadow-2xl ${
          isNight
            ? 'border-[#38BDF8]/45 bg-[#0F1A33] text-[#F8FAFC]'
            : 'border-[#BAE6FD] bg-[#FFFDF8] text-[#1E2E46]'
        }`}
      >
        {/* Header */}
        <div
          className={`border-b px-4 py-3.5 sm:px-6 ${
            isNight
              ? 'border-white/12 bg-gradient-to-r from-[#13254A] to-[#0E3A53]'
              : 'border-[#BAE6FD] bg-gradient-to-r from-[#E0F2FE] to-[#FFF7ED]'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <AustraliaNpcPortraitSVG
                npcId={missionMeta.npcId}
                className="h-12 w-12 shrink-0 rounded-2xl shadow-sm"
              />
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold text-[#0284C7] dark:text-[#38BDF8]">
                  {landmark.title[language]} · {copy.australiaBuildModeBadge}
                </p>
                <h2
                  id="australia-build-modal-title"
                  className="font-display text-base sm:text-xl font-extrabold truncate"
                >
                  {missionMeta.title[language]}
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* A2 / B1 Difficulty Toggle */}
              <div
                className={`inline-flex rounded-xl border p-0.5 ${
                  isNight ? 'border-white/15 bg-[#0C152B]' : 'border-[#BAE6FD] bg-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('select');
                    onDifficultyChange('a2');
                  }}
                  className={`min-h-[36px] rounded-lg px-2.5 py-1 text-xs font-extrabold cursor-pointer ${
                    difficultyMode === 'a2'
                      ? 'bg-[#0EA5E9] text-white'
                      : isNight
                        ? 'text-[#CBD5E1] hover:bg-white/10'
                        : 'text-[#334155] hover:bg-[#F0F9FF]'
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
                  className={`min-h-[36px] rounded-lg px-2.5 py-1 text-xs font-extrabold cursor-pointer ${
                    difficultyMode === 'b1'
                      ? 'bg-[#7C3AED] text-white'
                      : isNight
                        ? 'text-[#CBD5E1] hover:bg-white/10'
                        : 'text-[#334155] hover:bg-[#F5F3FF]'
                  }`}
                >
                  {copy.australiaDiscoverCefrB1Label}
                </button>
              </div>

              {/* Challenge Progress Counter */}
              <span
                className={`font-mono-num rounded-xl border px-3 py-1.5 text-xs font-extrabold ${
                  isNight
                    ? 'border-[#38BDF8]/35 bg-[#10203E] text-[#BAE6FD]'
                    : 'border-[#BAE6FD] bg-white text-[#0369A1]'
                }`}
              >
                {missionFinished ? totalChallenges : challengeIndex + 1}/{totalChallenges}
              </span>

              <button
                type="button"
                onClick={() => {
                  onPlaySfx('click');
                  stopSpeech();
                  onClose();
                }}
                aria-label={copy.closeSettings}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border cursor-pointer ${
                  isNight
                    ? 'border-white/15 bg-white/10 text-white hover:bg-white/20'
                    : 'border-[#0284C7]/25 bg-white text-[#1E2E46] hover:bg-[#F8FAFC]'
                }`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <AustraliaBuildBannerArt
            landmarkId={landmarkId}
            missionId={missionMeta.missionId}
            title={missionMeta.mechanicLabel[language]}
            isNight={isNight}
          />

          {missionFinished ? (
            <div
              className={`rounded-3xl border p-6 space-y-4 text-center ${
                isNight
                  ? 'border-[#10B981]/45 bg-[#0D2B24]'
                  : 'border-[#10B981]/50 bg-[#ECFDF5]'
              }`}
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#10B981] text-white shadow-md">
                <Sparkles className="h-7 w-7" aria-hidden="true" />
              </div>

              <div>
                <p className="text-xs font-extrabold text-[#10B981]">
                  {missionMeta.craftBadge[language]}
                </p>
                <h3 className="mt-1 font-display text-xl sm:text-2xl font-extrabold">
                  {copy.australiaBuildChallengeCompleteTitle}
                </h3>
                <p className="mt-2 rounded-2xl border border-black/10 bg-white/75 p-3 text-xs sm:text-sm font-bold text-[#1E2E46] dark:border-white/15 dark:bg-[#0F1A33] dark:text-[#F8FAFC]">
                  “{lastCraftedDialogue}”
                </p>
              </div>

              {willUnlockPracticeAfterThis ? (
                <div
                  className={`rounded-2xl border p-4 text-left ${
                    isNight
                      ? 'border-[#FBBF24]/50 bg-[#2C2415] text-[#FDE68A]'
                      : 'border-[#F59E0B] bg-[#FFFBEB] text-[#78350F]'
                  }`}
                >
                  <p className="font-display text-sm sm:text-base font-extrabold">
                    +{AUSTRALIA_BUILD_XP_REWARD} XP · {copy.australiaBuildPracticeUnlockedTitle}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed">
                    {copy.australiaBuildPracticeUnlockedNote}
                  </p>
                </div>
              ) : (
                <p className="text-xs font-bold opacity-85">
                  {copy.australiaBuildXpRewardOnceNote}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('click');
                    setAttemptNonce((n) => n + 1);
                  }}
                  className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-4 py-2 text-xs sm:text-sm font-extrabold cursor-pointer ${
                    isNight
                      ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                      : 'border-[#CBD5E1] bg-white text-[#1E2E46] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  <span>{copy.australiaBuildReviewMissionButton}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('click');
                    stopSpeech();
                    onClose();
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#0EA5E9] px-5 py-2 text-xs sm:text-sm font-extrabold text-white hover:bg-[#0284C7] cursor-pointer"
                >
                  <span>{copy.australiaDiscoverReturnSydneyButton}</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Audio + Hint + Reshuffle Utility Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => speakPhrase(currentModelAudio)}
                    className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                      isNight
                        ? 'border-white/15 bg-white/10 text-white hover:bg-white/20'
                        : 'border-[#BAE6FD] bg-[#F0F9FF] text-[#0369A1] hover:bg-[#E0F2FE]'
                    }`}
                  >
                    <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.australiaBuildHearFullDialogueButton}</span>
                  </button>

                  {lastSpokenText && (
                    <button
                      type="button"
                      onClick={() => speakPhrase(lastSpokenText)}
                      className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                        isNight
                          ? 'border-white/15 bg-white/10 text-white hover:bg-white/20'
                          : 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{copy.australiaDiscoverReplayAudioButton}</span>
                    </button>
                  )}

                  {isSpeaking && (
                    <button
                      type="button"
                      onClick={stopSpeech}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#EF4444]/40 bg-[#FEF2F2] px-3 py-1.5 text-xs font-bold text-[#B91C1C] cursor-pointer dark:bg-[#450A0A] dark:text-[#FECACA]"
                    >
                      <Square className="h-3 w-3" aria-hidden="true" />
                      <span>{copy.australiaDiscoverStopAudioButton}</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('select');
                      setShowHint((h) => !h);
                    }}
                    className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                      showHint
                        ? 'border-[#F59E0B] bg-[#FEF3C7] text-[#92400E]'
                        : isNight
                          ? 'border-white/15 bg-white/10 text-white hover:bg-white/20'
                          : 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>
                      {showHint
                        ? copy.australiaDiscoverHideHintButton
                        : copy.australiaDiscoverHintButton}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('click');
                      setAttemptNonce((n) => n + 1);
                    }}
                    className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                      isNight
                        ? 'border-white/15 bg-white/10 text-white hover:bg-white/20'
                        : 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.australiaDiscoverReshuffleButton}</span>
                  </button>
                </div>
              </div>

              {showHint && (
                <div
                  className={`rounded-2xl border p-3.5 text-xs sm:text-sm font-semibold ${
                    isNight
                      ? 'border-[#FBBF24]/40 bg-[#2C2415] text-[#FDE68A]'
                      : 'border-[#F59E0B]/50 bg-[#FFFBEB] text-[#78350F]'
                  }`}
                >
                  {currentHintText[language]}
                </div>
              )}

              {/* Mechanic Body */}
              {renderChallengeContent()}

              {/* Sandwich Feedback */}
              {feedback && (
                <div
                  role="status"
                  className={`rounded-2xl border p-4 ${
                    feedback.tone === 'success'
                      ? isNight
                        ? 'border-[#10B981]/50 bg-[#0D2B24] text-[#A7F3D0]'
                        : 'border-[#10B981] bg-[#ECFDF5] text-[#065F46]'
                      : isNight
                        ? 'border-[#F59E0B]/50 bg-[#2C2415] text-[#FDE68A]'
                        : 'border-[#F59E0B] bg-[#FFFBEB] text-[#92400E]'
                  } ${reducedMotion ? '' : 'transition-all duration-200'}`}
                >
                  <p className="text-xs sm:text-sm font-bold leading-relaxed">
                    {feedback.text[language]}
                  </p>
                </div>
              )}

              {/* Next / Finish Action */}
              {solvedCurrent && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleNextChallengeOrFinish}
                    className="inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-[#10B981] px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white hover:bg-[#059669] cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    <span>
                      {challengeIndex + 1 < totalChallenges
                        ? copy.australiaBuildNextChallengeButton
                        : copy.australiaBuildFinishMissionButton}
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
