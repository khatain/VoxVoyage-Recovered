import { useCallback, useEffect, useState } from 'react';
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Compass,
  HelpCircle,
  Lock,
  RotateCcw,
  Sparkles,
  Square,
  Trophy,
  Volume2,
  X,
  XCircle,
} from 'lucide-react';
import type {
  AppLanguage,
  LocalizedText,
  ResolvedAppearance,
} from '../../types/game';
import { GAME_COPY } from '../../data/i18n';
import {
  EGYPT_LANDMARKS,
  EGYPT_NPC_DIALOGUES,
  type EgyptLandmarkId,
} from '../../data/egyptWorld';
import {
  EGYPT_DISCOVERY_XP_REWARD,
  EGYPT_DISCOVER_MISSIONS,
  EGYPT_LAYLA_DISCOVER_INTRO,
  EXPEDITION_ESSENTIALS_CHALLENGES,
  getEgyptDiscoverMissionMeta,
  PAPYRUS_SEQUENCE_CHALLENGES,
  PHARAOH_CODE_CHALLENGES,
  PYRAMID_PATH_CHALLENGES,
  TEMPLE_GUARDIAN_CHALLENGES,
  type DiscoverHintLadder,
  type EgyptDifficultyMode,
} from '../../data/egyptDiscover';
import { voxAudio } from '../../utils/audioEngine';
import { EgyptLandmarkBadgeSVG, EgyptNpcPortraitSVG } from './EgyptSvgArtwork';
import {
  EgyptKnowledgeSealSVG,
  EgyptStationEmblemSVG,
} from './EgyptDiscoverArtwork';
import { ExpeditionEssentialsGame } from './discover/ExpeditionEssentialsGame';
import { PyramidPathPuzzleGame } from './discover/PyramidPathPuzzleGame';
import { PapyrusSequenceGame } from './discover/PapyrusSequenceGame';
import { TempleGuardianRulesGame } from './discover/TempleGuardianRulesGame';
import { PharaohInstructionCodeGame } from './discover/PharaohInstructionCodeGame';

export type EgyptDiscoverModalView =
  | { kind: 'intro' }
  | { kind: 'station'; landmarkId: EgyptLandmarkId }
  | { kind: 'celebration'; newlyCompleted: boolean };

interface EgyptDiscoverModalProps {
  isOpen: boolean;
  view: EgyptDiscoverModalView | null;
  language: AppLanguage;
  appearance: ResolvedAppearance;
  completedDiscoverIds: EgyptLandmarkId[];
  discoverCompleted: boolean;
  totalXp: number;
  onStartDiscovery: () => void;
  onCompleteStation: (landmarkId: EgyptLandmarkId) => { stageJustCompleted: boolean };
  onSwitchView: (nextView: EgyptDiscoverModalView) => void;
  onClose: () => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'reward') => void;
  buildUnlocked?: boolean;
  onLaunchBuild?: () => void;
}

export function EgyptDiscoverModal({
  isOpen,
  view,
  language,
  appearance,
  completedDiscoverIds,
  discoverCompleted,
  totalXp,
  onStartDiscovery,
  onCompleteStation,
  onSwitchView,
  onClose,
  onPlaySfx,
  buildUnlocked = false,
  onLaunchBuild,
}: EgyptDiscoverModalProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';

  const [difficulty, setDifficulty] = useState<EgyptDifficultyMode>('a2');
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [solvedIndices, setSolvedIndices] = useState<number[]>([]);
  const [stationDoneScreen, setStationDoneScreen] = useState(false);
  const [attemptNonce, setAttemptNonce] = useState(0);
  const [cefrSwitchNotice, setCefrSwitchNotice] = useState(false);
  const [hintTier, setHintTier] = useState<0 | 1 | 2 | 3>(0);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: LocalizedText;
  } | null>(null);
  const [hasSpokenPrompt, setHasSpokenPrompt] = useState(false);

  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speakEnglish = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      stopSpeech();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.94;
      u.pitch = 1.02;
      window.speechSynthesis.speak(u);
      setHasSpokenPrompt(true);
    },
    [stopSpeech],
  );

  // Reset per-station progress when opening or switching station
  const activeLandmarkId = view?.kind === 'station' ? view.landmarkId : null;
  const viewKind = view?.kind ?? null;

  useEffect(() => {
    stopSpeech();
    setChallengeIdx(0);
    setSolvedIndices([]);
    setStationDoneScreen(false);
    setAttemptNonce(0);
    setCefrSwitchNotice(false);
    setHintTier(0);
    setFeedback(null);
    setHasSpokenPrompt(false);
  }, [isOpen, viewKind, activeLandmarkId, stopSpeech]);

  // Duck background music & clean up speech on modal open/close
  useEffect(() => {
    if (!isOpen) return;
    voxAudio.setDialogueDucking(true);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        stopSpeech();
        onPlaySfx('click');
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      stopSpeech();
      voxAudio.setDialogueDucking(false);
    };
  }, [isOpen, onClose, onPlaySfx, stopSpeech]);

  if (!isOpen || !view) return null;

  const modalShellClass = isNight
    ? 'border-[#E7B43C]/45 bg-[#121D36] text-[#F8FAFC]'
    : 'border-[#E7B43C]/45 bg-[#FFFDF8] text-[#1E293B]';

  // -------------------------------------------------------------------------
  // 1. STAGE 1 INTRO BRIEFING (DR. LAYLA HASSAN)
  // -------------------------------------------------------------------------
  if (view.kind === 'intro') {
    const layla = EGYPT_NPC_DIALOGUES.npc_layla;
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="egypt-discover-intro-title"
        className={`fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 ${
          isNight ? 'bg-[#09132E]/80' : 'bg-[#1D2436]/45'
        }`}
      >
        <div
          className={`flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border shadow-2xl ${modalShellClass}`}
        >
          <div
            className={`flex items-center justify-between gap-3 border-b px-5 py-4 ${
              isNight
                ? 'border-white/12 bg-gradient-to-r from-[#1E2949] to-[#113344]'
                : 'border-[#FDE68A] bg-gradient-to-r from-[#FEF3C7] to-[#CCFBF1]'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <EgyptNpcPortraitSVG
                npcId="npc_layla"
                className="h-14 w-14 shrink-0 rounded-2xl shadow-md"
              />
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold text-[#0D9488] dark:text-[#5EEAD4]">
                  {layla.name} · {copy.egyptDiscoverStageIntroLabel}
                </p>
                <h2
                  id="egypt-discover-intro-title"
                  className="font-display text-lg sm:text-xl font-extrabold truncate"
                >
                  {EGYPT_LAYLA_DISCOVER_INTRO.title[language]}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                stopSpeech();
                onPlaySfx('click');
                onClose();
              }}
              aria-label={copy.closeSettings}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border cursor-pointer ${
                isNight
                  ? 'border-white/15 bg-white/10 text-white'
                  : 'border-[#CBD5E1] bg-white text-[#334155]'
              }`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div
              className={`rounded-2xl border p-4 space-y-2.5 ${
                isNight
                  ? 'border-white/12 bg-[#162340]'
                  : 'border-[#FDE68A] bg-[#FFFBEB]'
              }`}
            >
              <p className="text-sm sm:text-base font-semibold leading-relaxed">
                “{EGYPT_LAYLA_DISCOVER_INTRO.greeting[language]}”
              </p>
              <p
                className={`text-xs font-medium leading-relaxed ${
                  isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'
                }`}
              >
                {EGYPT_LAYLA_DISCOVER_INTRO.briefingNote[language]}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => speakEnglish(EGYPT_LAYLA_DISCOVER_INTRO.greeting.en)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                    isNight
                      ? 'border-white/15 bg-white/10 text-white hover:bg-white/20'
                      : 'border-[#FDE68A] bg-white text-[#92400E] hover:bg-[#FEF3C7]'
                  }`}
                >
                  <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {hasSpokenPrompt
                      ? copy.egyptDiscoverReplayAudioButton
                      : copy.egyptDiscoverHearButton}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={stopSpeech}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                    isNight
                      ? 'border-white/15 bg-white/8 text-[#CBD5E1]'
                      : 'border-[#CBD5E1] bg-white text-[#475569]'
                  }`}
                >
                  <Square className="h-3 w-3" aria-hidden="true" />
                  <span>{copy.egyptDiscoverStopAudioButton}</span>
                </button>
              </div>
            </div>

            {/* 5 Stations Sequential Roadmap */}
            <div className="space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-wide text-[#0D9488] dark:text-[#5EEAD4]">
                {copy.egyptDiscoverStationsProgressLabel} (1 → 5)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {EGYPT_DISCOVER_MISSIONS.map((m) => (
                  <div
                    key={m.gameId}
                    className={`flex items-center gap-2.5 rounded-2xl border p-2.5 ${
                      isNight
                        ? 'border-white/12 bg-[#162340]'
                        : 'border-[#E2E8F0] bg-white'
                    }`}
                  >
                    <EgyptStationEmblemSVG
                      gameId={m.gameId}
                      className="h-10 w-10 shrink-0 rounded-xl"
                    />
                    <div className="min-w-0">
                      <p className="font-display text-xs font-extrabold truncate">
                        {m.title[language]}
                      </p>
                      <p
                        className={`text-[11px] truncate ${
                          isNight ? 'text-[#CBD5E1]' : 'text-[#64748B]'
                        }`}
                      >
                        {m.mechanicLabel[language]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <p
                className={`text-xs font-semibold ${
                  isNight ? 'text-[#5EEAD4]' : 'text-[#0F766E]'
                }`}
              >
                {copy.egyptDiscoverZeroXpStationNote}
              </p>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    onPlaySfx('click');
                    onClose();
                  }}
                  className={`rounded-xl border px-4 py-2.5 text-xs font-bold cursor-pointer ${
                    isNight
                      ? 'border-white/15 bg-white/10 text-white'
                      : 'border-[#CBD5E1] bg-white text-[#334155]'
                  }`}
                >
                  {copy.egyptCloseDialogButton}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    onPlaySfx('reward');
                    onStartDiscovery();
                    onSwitchView({ kind: 'station', landmarkId: 'nile_expedition_camp' });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#E7B43C] px-5 py-2.5 font-display text-xs sm:text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#F2C66D] cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  <span>{EGYPT_LAYLA_DISCOVER_INTRO.ctaLabel[language]}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // 2. STAGE 1 COMPLETION CELEBRATION SUMMARY
  // -------------------------------------------------------------------------
  if (view.kind === 'celebration') {
    const layla = EGYPT_NPC_DIALOGUES.npc_layla;
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="egypt-discover-celebration-title"
        className={`fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 ${
          isNight ? 'bg-[#09132E]/82' : 'bg-[#1D2436]/48'
        }`}
      >
        <div
          className={`flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border shadow-2xl ${modalShellClass}`}
        >
          <div
            className={`flex items-center justify-between gap-3 border-b px-5 py-4 ${
              isNight
                ? 'border-white/12 bg-gradient-to-r from-[#2B2415] to-[#113344]'
                : 'border-[#FDE68A] bg-gradient-to-r from-[#FEF3C7] to-[#D1FAE5]'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E7B43C] text-[#131E31] shadow-sm">
                <Trophy className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold text-[#0D9488] dark:text-[#5EEAD4]">
                  {copy.egyptDiscoverStageBadge} · TO GIVE INSTRUCTIONS
                </p>
                <h2
                  id="egypt-discover-celebration-title"
                  className="font-display text-lg sm:text-xl font-extrabold truncate"
                >
                  {copy.egyptDiscoverStageCompleteTitle}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                stopSpeech();
                onPlaySfx('click');
                onClose();
              }}
              aria-label={copy.closeSettings}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border cursor-pointer ${
                isNight
                  ? 'border-white/15 bg-white/10 text-white'
                  : 'border-[#CBD5E1] bg-white text-[#334155]'
              }`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Reward + Knowledge Seal Highlight */}
            <div
              className={`flex flex-col sm:flex-row items-center gap-4 rounded-2xl border p-4 ${
                isNight
                  ? 'border-[#E7B43C]/45 bg-[#1B2542]'
                  : 'border-[#F59E0B]/45 bg-[#FFFBEB]'
              }`}
            >
              <EgyptKnowledgeSealSVG className="h-24 w-24 shrink-0" />
              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#E7B43C] px-3 py-1 font-display text-xs font-extrabold text-[#131E31]">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {view.newlyCompleted
                      ? copy.egyptDiscoverStageCompleteReward
                      : `+${EGYPT_DISCOVERY_XP_REWARD} XP Earned · ${totalXp} ${copy.xpLabel}`}
                  </span>
                </div>
                <h3 className="font-display text-sm font-extrabold">
                  {copy.egyptDiscoverKnowledgeSealTitle}
                </h3>
                <p
                  className={`text-xs leading-relaxed ${
                    isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'
                  }`}
                >
                  {copy.egyptDiscoverKnowledgeSealNote}
                </p>
              </div>
            </div>

            {/* Dr. Layla Congratulations */}
            <div
              className={`flex items-start gap-3 rounded-2xl border p-3.5 ${
                isNight ? 'border-white/12 bg-[#162340]' : 'border-[#E2E8F0] bg-white'
              }`}
            >
              <EgyptNpcPortraitSVG npcId="npc_layla" className="h-12 w-12 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-extrabold text-[#0D9488] dark:text-[#5EEAD4]">
                  {layla.name}
                </p>
                <p className="mt-0.5 text-xs sm:text-sm font-medium leading-relaxed">
                  {language === 'th'
                    ? 'ยอดเยี่ยมมากนักสำรวจ! คุณอ่านและปฏิบัติตามคำสั่งภาษาอังกฤษได้ครบทั้ง 5 จุดแล้ว — เตรียมตัวฝึกประกอบประโยคคำสั่งด้วยตนเองในด่านที่ 2: BUILD เร็ว ๆ นี้!'
                    : 'Bravo, explorer! You mastered understanding English instructions across all five Egyptian stations. You are ready for Stage 2: BUILD when it arrives!'}
                </p>
              </div>
            </div>

            {/* 5 Completed Station Badges & Skill Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EGYPT_DISCOVER_MISSIONS.map((m) => (
                <div
                  key={m.gameId}
                  className={`flex items-start gap-2.5 rounded-2xl border p-2.5 ${
                    isNight
                      ? 'border-[#10B981]/35 bg-[#0F2A2A]'
                      : 'border-[#10B981]/30 bg-[#ECFDF5]'
                  }`}
                >
                  <EgyptStationEmblemSVG gameId={m.gameId} className="h-10 w-10 shrink-0 rounded-xl" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#059669] dark:text-[#34D399] shrink-0" aria-hidden="true" />
                      <p className="font-display text-xs font-extrabold truncate">
                        {m.title[language]}
                      </p>
                    </div>
                    <p
                      className={`mt-0.5 text-[11px] leading-snug ${
                        isNight ? 'text-[#CBD5E1]' : 'text-[#334155]'
                      }`}
                    >
                      {m.instructionFocus[language]}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stage 2 BUILD Unlocked CTA or Coming Soon Preview */}
            {buildUnlocked && onLaunchBuild ? (
              <div
                className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3.5 ${
                  isNight
                    ? 'border-[#12B8B0]/45 bg-[#102A33] text-[#CCFBF1]'
                    : 'border-[#0D9488]/35 bg-[#F0FDFA] text-[#0F766E]'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xs sm:text-sm font-extrabold">
                    {copy.egyptGuideStageBuildTitle}
                  </p>
                  <p className="mt-0.5 text-xs opacity-90">
                    {copy.egyptGuideStageBuildDesc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    onPlaySfx('reward');
                    onLaunchBuild();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0D9488] px-4 py-2 font-display text-xs font-extrabold text-white shadow hover:bg-[#0F766E] cursor-pointer shrink-0"
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.egyptBuildPlayWorkshopButton}</span>
                </button>
              </div>
            ) : (
              <div
                className={`flex items-start gap-3 rounded-2xl border p-3.5 ${
                  isNight
                    ? 'border-[#E7B43C]/35 bg-[#2A2013]/80 text-[#FDE68A]'
                    : 'border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]'
                }`}
              >
                <Lock className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-display text-xs sm:text-sm font-extrabold">
                    {copy.egyptDiscoverBuildComingSoonTitle}
                  </p>
                  <p className="mt-0.5 text-xs opacity-90">
                    {copy.egyptDiscoverBuildComingSoonDesc}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  stopSpeech();
                  onPlaySfx('click');
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#E7B43C] px-5 py-2.5 font-display text-xs sm:text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#F2C66D] cursor-pointer"
              >
                <Compass className="h-4 w-4" aria-hidden="true" />
                <span>{copy.egyptDiscoverReturnGizaButton}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // 3. STATION MINI-GAME VIEW (STATIONS 1..5)
  // -------------------------------------------------------------------------
  const landmarkId = view.landmarkId;
  const missionMeta = getEgyptDiscoverMissionMeta(landmarkId);
  const landmark =
    EGYPT_LANDMARKS.find((l) => l.id === landmarkId) ?? EGYPT_LANDMARKS[0];
  const alreadyCompletedStation = completedDiscoverIds.includes(landmarkId);

  // Pick challenge list & active variant based on station
  const getStationChallengeBundle = (): {
    total: number;
    challengeId: string;
    challengeTitle: LocalizedText;
    instruction: LocalizedText;
    spokenEnglish: string;
    hints: DiscoverHintLadder;
  } => {
    if (missionMeta.gameId === 'expedition_essentials') {
      const ch =
        EXPEDITION_ESSENTIALS_CHALLENGES[challengeIdx] ??
        EXPEDITION_ESSENTIALS_CHALLENGES[0];
      const v = ch[difficulty];
      return {
        total: EXPEDITION_ESSENTIALS_CHALLENGES.length,
        challengeId: ch.id,
        challengeTitle: ch.title,
        instruction: v.instruction,
        spokenEnglish: v.spokenEnglish,
        hints: v.hints,
      };
    }
    if (missionMeta.gameId === 'pyramid_path_puzzle') {
      const ch =
        PYRAMID_PATH_CHALLENGES[challengeIdx] ?? PYRAMID_PATH_CHALLENGES[0];
      const v = ch[difficulty];
      return {
        total: PYRAMID_PATH_CHALLENGES.length,
        challengeId: ch.id,
        challengeTitle: ch.title,
        instruction: v.instruction,
        spokenEnglish: v.spokenEnglish,
        hints: v.hints,
      };
    }
    if (missionMeta.gameId === 'papyrus_sequence') {
      const ch =
        PAPYRUS_SEQUENCE_CHALLENGES[challengeIdx] ??
        PAPYRUS_SEQUENCE_CHALLENGES[0];
      const v = ch[difficulty];
      return {
        total: PAPYRUS_SEQUENCE_CHALLENGES.length,
        challengeId: ch.id,
        challengeTitle: ch.title,
        instruction: v.instruction,
        spokenEnglish: v.spokenEnglish,
        hints: v.hints,
      };
    }
    if (missionMeta.gameId === 'temple_guardian_rules') {
      const ch =
        TEMPLE_GUARDIAN_CHALLENGES[challengeIdx] ??
        TEMPLE_GUARDIAN_CHALLENGES[0];
      const v = ch[difficulty];
      return {
        total: TEMPLE_GUARDIAN_CHALLENGES.length,
        challengeId: ch.id,
        challengeTitle: ch.title,
        instruction: v.instruction,
        spokenEnglish: v.spokenEnglish,
        hints: v.hints,
      };
    }
    const ch =
      PHARAOH_CODE_CHALLENGES[challengeIdx] ?? PHARAOH_CODE_CHALLENGES[0];
    const v = ch[difficulty];
    return {
      total: PHARAOH_CODE_CHALLENGES.length,
      challengeId: ch.id,
      challengeTitle: ch.title,
      instruction: v.instruction,
      spokenEnglish: v.spokenEnglish,
      hints: v.hints,
    };
  };

  const activeBundle = getStationChallengeBundle();
  const isCurrentChallengeSolved = solvedIndices.includes(challengeIdx);
  const allChallengesSolved = solvedIndices.length >= activeBundle.total;
  const challengeKey = `${landmarkId}-${challengeIdx}-${difficulty}-${attemptNonce}`;

  const handleToggleDifficulty = (nextMode: EgyptDifficultyMode) => {
    if (nextMode === difficulty) return;
    stopSpeech();
    onPlaySfx('select');
    setDifficulty(nextMode);
    setHasSpokenPrompt(false);
    // Reset only the current challenge's unsaved attempt state
    setFeedback(null);
    setHintTier(0);
    setAttemptNonce((n) => n + 1);
    setCefrSwitchNotice(true);
  };

  const handleMarkChallengeSolved = () => {
    setSolvedIndices((prev) =>
      prev.includes(challengeIdx) ? prev : [...prev, challengeIdx],
    );
  };

  const handleAdvanceChallenge = () => {
    stopSpeech();
    onPlaySfx('select');
    setHasSpokenPrompt(false);
    setFeedback(null);
    setHintTier(0);
    setCefrSwitchNotice(false);
    if (challengeIdx + 1 < activeBundle.total) {
      setChallengeIdx((i) => i + 1);
    } else {
      const outcome = onCompleteStation(landmarkId);
      if (landmarkId === 'chamber_of_wisdom' || (outcome.stageJustCompleted && discoverCompleted)) {
        onSwitchView({
          kind: 'celebration',
          newlyCompleted: outcome.stageJustCompleted,
        });
      } else if (outcome.stageJustCompleted) {
        onSwitchView({ kind: 'celebration', newlyCompleted: true });
      } else {
        setStationDoneScreen(true);
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="egypt-discover-station-title"
      className={`fixed inset-0 z-40 flex items-center justify-center p-2.5 sm:p-5 ${
        isNight ? 'bg-[#09132E]/82' : 'bg-[#1D2436]/46'
      }`}
    >
      <div
        className={`flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border shadow-2xl ${modalShellClass}`}
      >
        {/* Header */}
        <div
          className={`flex flex-wrap items-center justify-between gap-2.5 border-b px-4 sm:px-5 py-3.5 ${
            isNight
              ? 'border-white/12 bg-gradient-to-r from-[#1E2949] to-[#113344]'
              : 'border-[#FDE68A] bg-gradient-to-r from-[#FEF3C7] to-[#CCFBF1]'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <EgyptLandmarkBadgeSVG
              landmarkId={landmarkId}
              className="h-12 w-16 shrink-0 rounded-xl shadow-sm"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold text-[#0D9488] dark:text-[#5EEAD4] truncate">
                {copy.egyptDiscoverStageBadge} · {landmark.title[language]}
              </p>
              <h2
                id="egypt-discover-station-title"
                className="font-display text-base sm:text-lg font-extrabold truncate"
              >
                {missionMeta.title[language]}
              </h2>
            </div>
          </div>

          {/* Right: CEFR A2 / B1 Toggle + Close */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              className={`inline-flex rounded-xl border p-0.5 ${
                isNight
                  ? 'border-white/15 bg-[#121D36]'
                  : 'border-[#D97706]/30 bg-white/85'
              }`}
              role="group"
              aria-label="CEFR difficulty"
            >
              {(['a2', 'b1'] as const).map((mode) => {
                const active = difficulty === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleToggleDifficulty(mode)}
                    aria-pressed={active}
                    className={`rounded-lg px-2.5 py-1 text-xs font-extrabold transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#E7B43C] text-[#131E31]'
                        : isNight
                          ? 'text-[#CBD5E1] hover:text-white'
                          : 'text-[#475569] hover:text-[#131E31]'
                    }`}
                  >
                    {mode === 'a2'
                      ? copy.egyptDiscoverCefrA2Label
                      : copy.egyptDiscoverCefrB1Label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                stopSpeech();
                onPlaySfx('click');
                onClose();
              }}
              aria-label={copy.closeSettings}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border cursor-pointer ${
                isNight
                  ? 'border-white/15 bg-white/10 text-white'
                  : 'border-[#CBD5E1] bg-white text-[#334155]'
              }`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {stationDoneScreen ? (
            /* Station Completed Takeaway Summary */
            <div className="space-y-4 py-2">
              <div
                className={`flex flex-col sm:flex-row items-center gap-4 rounded-2xl border p-4 ${
                  isNight
                    ? 'border-[#10B981]/45 bg-[#0F2A2A]'
                    : 'border-[#10B981]/35 bg-[#ECFDF5]'
                }`}
              >
                <EgyptStationEmblemSVG
                  gameId={missionMeta.gameId}
                  className="h-16 w-16 shrink-0 rounded-2xl shadow"
                />
                <div className="flex-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#059669] dark:text-[#34D399]">
                    <Award className="h-4 w-4" aria-hidden="true" />
                    <span>{copy.egyptDiscoverCompletedBadge}</span>
                  </div>
                  <h3 className="mt-0.5 font-display text-lg font-extrabold">
                    {missionMeta.title[language]}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm font-medium opacity-90">
                    {missionMeta.takeawaySummary[language]}
                  </p>
                </div>
              </div>

              <div
                className={`rounded-2xl border p-3.5 text-xs font-semibold ${
                  isNight
                    ? 'border-white/12 bg-[#162340] text-[#CBD5E1]'
                    : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#475569]'
                }`}
              >
                {copy.egyptDiscoverZeroXpStationNote}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    onPlaySfx('select');
                    setStationDoneScreen(false);
                    setChallengeIdx(0);
                    setSolvedIndices([]);
                    setFeedback(null);
                    setHintTier(0);
                    setAttemptNonce((n) => n + 1);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${
                    isNight
                      ? 'border-white/15 bg-white/10 text-white'
                      : 'border-[#CBD5E1] bg-white text-[#334155]'
                  }`}
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.egyptDiscoverReplayStationButton}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    onPlaySfx('click');
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#E7B43C] px-5 py-2.5 font-display text-xs sm:text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#F2C66D] cursor-pointer"
                >
                  <span>{copy.egyptDiscoverReturnGizaButton}</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* 6-Challenge Progress Stepper */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {Array.from({ length: activeBundle.total }).map((_, idx) => {
                    const done = solvedIndices.includes(idx);
                    const current = idx === challengeIdx;
                    const maxAccessible = Math.max(0, ...solvedIndices.map((s) => s + 1), challengeIdx);
                    const clickable = alreadyCompletedStation || idx <= maxAccessible;

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={!clickable}
                        onClick={() => {
                          stopSpeech();
                          onPlaySfx('select');
                          setChallengeIdx(idx);
                          setFeedback(null);
                          setHintTier(0);
                          setHasSpokenPrompt(false);
                          setCefrSwitchNotice(false);
                        }}
                        className={`inline-flex h-8 min-w-[34px] items-center justify-center gap-1 rounded-xl border px-2 font-mono-num text-xs font-extrabold transition-colors ${
                          current
                            ? 'border-[#0D9488] bg-[#0D9488] text-white'
                            : done
                              ? 'border-[#10B981]/60 bg-[#10B981]/20 text-[#059669] dark:text-[#34D399]'
                              : isNight
                                ? 'border-white/15 bg-[#162340] text-[#94A3B8]'
                                : 'border-[#CBD5E1] bg-white text-[#64748B]'
                        } ${clickable ? 'cursor-pointer' : 'opacity-45 cursor-not-allowed'}`}
                      >
                        {done && !current && (
                          <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                        )}
                        <span>{idx + 1}</span>
                      </button>
                    );
                  })}
                </div>

                <span
                  className={`text-xs font-bold ${
                    isNight ? 'text-[#CBD5E1]' : 'text-[#64748B]'
                  }`}
                >
                  {activeBundle.challengeTitle[language]} ·{' '}
                  <span className="font-mono-num">
                    {solvedIndices.length}/{activeBundle.total}
                  </span>
                </span>
              </div>

              {cefrSwitchNotice && (
                <div
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                    isNight
                      ? 'border-[#E7B43C]/35 bg-[#2A2013] text-[#FDE68A]'
                      : 'border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]'
                  }`}
                >
                  {copy.egyptDiscoverCefrSwitchNotice}
                </div>
              )}

              {/* Instruction Prompt + Audio + 3-Tier Hint Ladder */}
              <div
                className={`rounded-2xl border p-3.5 sm:p-4 space-y-2.5 ${
                  isNight
                    ? 'border-[#12B8B0]/35 bg-[#102A33]'
                    : 'border-[#99F6E4] bg-[#F0FDFA]'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#0D9488] dark:text-[#5EEAD4]">
                      {missionMeta.instructionFocus[language]}
                    </p>
                    <p className="mt-1 text-sm sm:text-base font-bold leading-snug">
                      {activeBundle.instruction[language]}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => speakEnglish(activeBundle.spokenEnglish)}
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                        isNight
                          ? 'border-white/15 bg-white/10 text-white hover:bg-white/20'
                          : 'border-[#0D9488]/30 bg-white text-[#0F766E] hover:bg-[#CCFBF1]'
                      }`}
                    >
                      <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {hasSpokenPrompt
                          ? copy.egyptDiscoverReplayAudioButton
                          : copy.egyptDiscoverHearButton}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={stopSpeech}
                      aria-label={copy.egyptDiscoverStopAudioButton}
                      className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-bold cursor-pointer ${
                        isNight
                          ? 'border-white/15 bg-white/8 text-[#CBD5E1]'
                          : 'border-[#CBD5E1] bg-white text-[#475569]'
                      }`}
                    >
                      <Square className="h-3 w-3" aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onPlaySfx('select');
                        setHintTier((prev) =>
                          prev < 3 ? ((prev + 1) as 0 | 1 | 2 | 3) : 3,
                        );
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-extrabold cursor-pointer ${
                        isNight
                          ? 'border-[#E7B43C]/45 bg-[#2A2013] text-[#FDE68A]'
                          : 'border-[#F59E0B]/45 bg-[#FFFBEB] text-[#92400E]'
                      }`}
                    >
                      <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {hintTier === 0
                          ? copy.egyptDiscoverHintButton
                          : hintTier < 3
                            ? `${copy.egyptDiscoverNextHintButton} (${hintTier}/3)`
                            : '3/3'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* 3-Tier Hint Display */}
                {hintTier > 0 && (
                  <div
                    className={`rounded-xl border p-2.5 text-xs space-y-1 ${
                      isNight
                        ? 'border-[#E7B43C]/35 bg-[#1B2542] text-[#FDE68A]'
                        : 'border-[#FDE68A] bg-white text-[#78350F]'
                    }`}
                  >
                    {hintTier >= 1 && (
                      <p>
                        <strong>1.</strong> {activeBundle.hints.tier1Vocab[language]}
                      </p>
                    )}
                    {hintTier >= 2 && (
                      <p>
                        <strong>2.</strong> {activeBundle.hints.tier2Clue[language]}
                      </p>
                    )}
                    {hintTier >= 3 && (
                      <p>
                        <strong>3.</strong> {activeBundle.hints.tier3Scaffold[language]}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Active Mini-Game Mechanic */}
              {missionMeta.gameId === 'expedition_essentials' && (
                <ExpeditionEssentialsGame
                  language={language}
                  isNight={isNight}
                  variant={
                    (
                      EXPEDITION_ESSENTIALS_CHALLENGES[challengeIdx] ??
                      EXPEDITION_ESSENTIALS_CHALLENGES[0]
                    )[difficulty]
                  }
                  challengeKey={challengeKey}
                  isSolved={isCurrentChallengeSolved}
                  onSolved={handleMarkChallengeSolved}
                  onFeedback={setFeedback}
                  onPlaySfx={onPlaySfx}
                />
              )}

              {missionMeta.gameId === 'pyramid_path_puzzle' && (
                <PyramidPathPuzzleGame
                  language={language}
                  isNight={isNight}
                  variant={
                    (
                      PYRAMID_PATH_CHALLENGES[challengeIdx] ??
                      PYRAMID_PATH_CHALLENGES[0]
                    )[difficulty]
                  }
                  challengeKey={challengeKey}
                  isSolved={isCurrentChallengeSolved}
                  onSolved={handleMarkChallengeSolved}
                  onFeedback={setFeedback}
                  onPlaySfx={onPlaySfx}
                />
              )}

              {missionMeta.gameId === 'papyrus_sequence' && (
                <PapyrusSequenceGame
                  language={language}
                  isNight={isNight}
                  variant={
                    (
                      PAPYRUS_SEQUENCE_CHALLENGES[challengeIdx] ??
                      PAPYRUS_SEQUENCE_CHALLENGES[0]
                    )[difficulty]
                  }
                  challengeKey={challengeKey}
                  isSolved={isCurrentChallengeSolved}
                  onSolved={handleMarkChallengeSolved}
                  onFeedback={setFeedback}
                  onPlaySfx={onPlaySfx}
                />
              )}

              {missionMeta.gameId === 'temple_guardian_rules' && (
                <TempleGuardianRulesGame
                  language={language}
                  isNight={isNight}
                  variant={
                    (
                      TEMPLE_GUARDIAN_CHALLENGES[challengeIdx] ??
                      TEMPLE_GUARDIAN_CHALLENGES[0]
                    )[difficulty]
                  }
                  challengeKey={challengeKey}
                  isSolved={isCurrentChallengeSolved}
                  onSolved={handleMarkChallengeSolved}
                  onFeedback={setFeedback}
                  onPlaySfx={onPlaySfx}
                />
              )}

              {missionMeta.gameId === 'pharaoh_instruction_code' && (
                <PharaohInstructionCodeGame
                  language={language}
                  isNight={isNight}
                  variant={
                    (
                      PHARAOH_CODE_CHALLENGES[challengeIdx] ??
                      PHARAOH_CODE_CHALLENGES[0]
                    )[difficulty]
                  }
                  challengeKey={challengeKey}
                  isSolved={isCurrentChallengeSolved}
                  onSolved={handleMarkChallengeSolved}
                  onFeedback={setFeedback}
                  onPlaySfx={onPlaySfx}
                />
              )}

              {/* Feedback + Next / Finish Footer */}
              {(feedback || isCurrentChallengeSolved || allChallengesSolved) && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3.5 ${
                    feedback?.isCorrect || isCurrentChallengeSolved
                      ? isNight
                        ? 'border-[#10B981]/50 bg-[#0F2A2A] text-[#A7F3D0]'
                        : 'border-[#059669]/40 bg-[#ECFDF5] text-[#065F46]'
                      : isNight
                        ? 'border-[#F87171]/50 bg-[#3B1822] text-[#FECACA]'
                        : 'border-[#DC2626]/40 bg-[#FEF2F2] text-[#991B1B]'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    {feedback?.isCorrect || isCurrentChallengeSolved ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
                    ) : (
                      <XCircle className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
                    )}
                    <p className="text-xs sm:text-sm font-bold leading-snug">
                      {feedback
                        ? feedback.message[language]
                        : language === 'th'
                          ? 'ผ่านข้อย่อยนี้แล้ว กดไปข้อถัดไปได้เลย'
                          : 'Challenge cleared! Ready to continue.'}
                    </p>
                  </div>

                  {isCurrentChallengeSolved && (
                    <button
                      type="button"
                      onClick={handleAdvanceChallenge}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#E7B43C] px-4 py-2 font-display text-xs sm:text-sm font-extrabold text-[#131E31] shadow hover:bg-[#F2C66D] cursor-pointer shrink-0"
                    >
                      <span>
                        {challengeIdx + 1 < activeBundle.total
                          ? copy.egyptDiscoverNextChallengeButton
                          : copy.egyptDiscoverFinishStationButton}
                      </span>
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
