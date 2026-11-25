import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Compass,
  Gamepad2,
  MapPin,
  MessageCircle,
  Moon,
  Music,
  Navigation,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Volume2,
  X,
} from 'lucide-react';
import type {
  AppLanguage,
  AvatarConfig,
  CountryWorld,
  ResolvedAppearance,
  RewardWallet,
  ScotlandPerformOutline,
  ScotlandPerformPracticeMode,
  ScotlandPerformQaStates,
  ScotlandPerformReflectionState,
  ScotlandSpeakingReflectionState,
} from '../../types/game';
import { GAME_COPY } from '../../data/i18n';
import {
  EILIDH_DISCOVER_DIALOGUE,
  FIONA_DISCOVER_DIALOGUE,
  SCOTLAND_EVIDENCE_ITEMS,
  type ScotlandDifficultyMode,
} from '../../data/scotlandDiscovery';
import {
  EILIDH_BUILD_DIALOGUE,
  FIONA_BUILD_DIALOGUE,
  SCOTLAND_BUILD_STATIONS,
} from '../../data/scotlandBuild';
import {
  EILIDH_PRACTICE_DIALOGUE,
  FIONA_PRACTICE_DIALOGUE,
  SCOTLAND_PRACTICE_MISSIONS,
} from '../../data/scotlandPractice';
import {
  EILIDH_PERFORM_DIALOGUE,
  FIONA_PERFORM_DIALOGUE,
  type ScotlandPerformCompletionPayload,
} from '../../data/scotlandPerform';
import {
  SCOTLAND_INTERACTIVE_TARGETS,
  SCOTLAND_LANDMARKS,
  SCOTLAND_SPAWN,
  type ScotlandLandmarkId,
  type ScotlandNpcId,
  type ScotlandPoiId,
} from '../../data/scotlandWorld';
import { useWorldNavigation } from '../../utils/useWorldNavigation';
import { SmartNavigationHud } from '../navigation/SmartNavigationHud';
import { AvatarPortraitSVG } from '../avatar/AvatarPortraitSVG';
import { VirtualJoystick, type JoystickVector } from '../india/VirtualJoystick';
import { voxAudio } from '../../utils/audioEngine';
import { CulturalExplorerJournalModal } from '../scotland/CulturalExplorerJournalModal';
import { ScotlandBuildModal } from '../scotland/ScotlandBuildModal';
import { ScotlandDiscoveryModal } from '../scotland/ScotlandDiscoveryModal';
import {
  ScotlandNpcPortraitSVG,
  ScotlandTartanRibbonDivider,
} from '../scotland/ScotlandMiniGameArtwork';
import { ScotlandPerformModal } from '../scotland/ScotlandPerformModal';
import { ScotlandPracticeModal } from '../scotland/ScotlandPracticeModal';
import { ScotlandFallback2D } from '../scotland/ScotlandFallback2D';

const LazyScotlandExplorationScene = lazy(
  () => import('../scotland/ScotlandExplorationScene'),
);

interface ScotlandWorldScreenProps {
  language: AppLanguage;
  country: CountryWorld;
  avatar: AvatarConfig;
  rewards: RewardWallet;
  appearance: ResolvedAppearance;
  reducedMotion: boolean;
  webglSupported: boolean;
  viewMode: '3d' | '2d';
  musicPlaying: boolean;
  externalModalOpen?: boolean;
  metEilidh: boolean;
  metFiona: boolean;
  exploredPoiIds: ScotlandLandmarkId[];
  discoverStarted: boolean;
  discoveredEvidenceIds: ScotlandLandmarkId[];
  discoverCompleted: boolean;
  buildUnlocked: boolean;
  buildStarted: boolean;
  builtSentences: Record<string, string>;
  buildCompleted: boolean;
  practiceUnlocked: boolean;
  practiceStarted: boolean;
  completedSpeakingIds: ScotlandLandmarkId[];
  speakingReflectionStates: Record<string, ScotlandSpeakingReflectionState>;
  practiceCompleted: boolean;
  performUnlocked: boolean;
  performStarted: boolean;
  performCompleted: boolean;
  performAlreadyRewarded?: boolean;
  completedAt?: string;
  performSelectedEvidenceIds?: string[];
  performOutline?: ScotlandPerformOutline;
  performSpeechPracticeMode?: ScotlandPerformPracticeMode;
  performQuestionPracticeStates?: ScotlandPerformQaStates;
  performReflectionState?: ScotlandPerformReflectionState;
  isReplayActive?: boolean;
  replayAttemptNumber?: number;
  canReplayCountry?: boolean;
  discoverAlreadyRewarded?: boolean;
  buildAlreadyRewarded?: boolean;
  practiceAlreadyRewarded?: boolean;
  onRequestRestartAttempt?: () => void;
  onRequestReplayCountry?: () => void;
  onMarkNpcMet: (npcId: ScotlandNpcId) => void;
  onMarkPoiExplored: (landmarkId: ScotlandLandmarkId) => void;
  onStartDiscovery: () => void;
  onCompleteDiscoveryStation: (stationId: ScotlandLandmarkId) => boolean;
  onStartBuild: () => void;
  onCompleteBuildStation: (stationId: ScotlandLandmarkId, builtSentence: string) => boolean;
  onStartPractice: () => void;
  onCompletePracticeStation: (
    stationId: ScotlandLandmarkId,
    reflection: ScotlandSpeakingReflectionState,
  ) => boolean;
  onStartPerform: () => void;
  onCompletePerform: (payload: ScotlandPerformCompletionPayload) => {
    firstCompletion: boolean;
  };
  onWebGLFailure: () => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'mode' | 'reward') => void;
  onBackToMap: () => void;
  onOpenPassport: () => void;
  onToggleQuickAppearance: () => void;
  onToggleMusic: () => void;
  onOpenSettings: () => void;
}

export function ScotlandWorldScreen({
  language,
  country,
  avatar,
  rewards,
  appearance,
  reducedMotion,
  webglSupported,
  viewMode,
  musicPlaying,
  externalModalOpen = false,
  metEilidh,
  metFiona,
  exploredPoiIds,
  discoverStarted,
  discoveredEvidenceIds,
  discoverCompleted,
  buildUnlocked,
  buildStarted,
  builtSentences,
  buildCompleted,
  practiceUnlocked,
  practiceStarted,
  completedSpeakingIds,
  speakingReflectionStates,
  practiceCompleted,
  performUnlocked,
  performStarted,
  performCompleted,
  performAlreadyRewarded = false,
  completedAt,
  performSelectedEvidenceIds,
  performOutline,
  performSpeechPracticeMode,
  performQuestionPracticeStates,
  performReflectionState,
  isReplayActive = false,
  replayAttemptNumber,
  canReplayCountry = false,
  discoverAlreadyRewarded = false,
  buildAlreadyRewarded = false,
  practiceAlreadyRewarded = false,
  onRequestRestartAttempt,
  onRequestReplayCountry,
  onMarkNpcMet,
  onMarkPoiExplored,
  onStartDiscovery,
  onCompleteDiscoveryStation,
  onStartBuild,
  onCompleteBuildStation,
  onStartPractice,
  onCompletePracticeStation,
  onStartPerform,
  onCompletePerform,
  onWebGLFailure,
  onPlaySfx,
  onBackToMap,
  onOpenPassport,
  onToggleQuickAppearance,
  onToggleMusic,
  onOpenSettings,
}: ScotlandWorldScreenProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';

  const [showArrivalBanner, setShowArrivalBanner] = useState(true);
  const [nearestPoiId, setNearestPoiId] = useState<ScotlandPoiId | null>(null);
  const [activeModalPoiId, setActiveModalPoiId] = useState<ScotlandPoiId | null>(null);
  const [npcDialogueStep, setNpcDialogueStep] = useState<0 | 1>(0);
  const [pauseMenuOpen, setPauseMenuOpen] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const [journalStationId, setJournalStationId] = useState<ScotlandLandmarkId | undefined>(undefined);
  const [landmarkModalMode, setLandmarkModalMode] = useState<
    'auto' | 'practice' | 'discover' | 'build' | 'inspect'
  >('auto');
  const [difficultyMode, setDifficultyMode] = useState<ScotlandDifficultyMode>('a2');
  const [discoverCompleteToast, setDiscoverCompleteToast] = useState<{ xpEarned: boolean } | null>(
    null,
  );
  const [buildCompleteToast, setBuildCompleteToast] = useState<{ xpEarned: boolean } | null>(null);
  const [practiceCompleteToast, setPracticeCompleteToast] = useState<{ xpEarned: boolean } | null>(
    null,
  );
  const [performCompleteToast, setPerformCompleteToast] = useState<{ xpEarned: boolean } | null>(
    null,
  );
  const [guidedPoiId, setGuidedPoiId] = useState<ScotlandPoiId | null>(null);
  const [interactGestureSeq, setInteractGestureSeq] = useState(0);
  const [cameraSensitivity, setCameraSensitivity] = useState<number>(1.0);

  const [showTouchPad, setShowTouchPad] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(pointer: coarse)').matches;
  });

  const joystickRef = useRef<JoystickVector>({ x: 0, y: 0 });
  const handleJoystickChange = useCallback((vec: JoystickVector) => {
    joystickRef.current = vec;
  }, []);

  useEffect(() => {
    const duration = reducedMotion ? 350 : 1400;
    const timer = window.setTimeout(() => setShowArrivalBanner(false), duration);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  useEffect(() => {
    return () => stopSpeech();
  }, [stopSpeech]);

  const speakEnglishText = (text: string, voiceOpts?: { pitch?: number; rate?: number }) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = voiceOpts?.rate ?? country.npc.voiceProfile.recommendedRate;
    utterance.pitch = voiceOpts?.pitch ?? country.npc.voiceProfile.recommendedPitch;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!discoverCompleteToast) return;
    const timer = window.setTimeout(() => setDiscoverCompleteToast(null), 5500);
    return () => window.clearTimeout(timer);
  }, [discoverCompleteToast]);

  useEffect(() => {
    if (!buildCompleteToast) return;
    const timer = window.setTimeout(() => setBuildCompleteToast(null), 6000);
    return () => window.clearTimeout(timer);
  }, [buildCompleteToast]);

  useEffect(() => {
    if (!practiceCompleteToast) return;
    const timer = window.setTimeout(() => setPracticeCompleteToast(null), 6000);
    return () => window.clearTimeout(timer);
  }, [practiceCompleteToast]);

  useEffect(() => {
    if (!performCompleteToast) return;
    const timer = window.setTimeout(() => setPerformCompleteToast(null), 6500);
    return () => window.clearTimeout(timer);
  }, [performCompleteToast]);

  const openPoiInteraction = useCallback(
    (poiId: ScotlandPoiId) => {
      if (externalModalOpen || pauseMenuOpen || journalOpen) {
        return;
      }
      stopSpeech();
      setInteractGestureSeq((n) => n + 1);
      onPlaySfx('select');
      setNpcDialogueStep(0);
      setLandmarkModalMode('auto');
      setActiveModalPoiId(poiId);

      if (poiId === 'npc_eilidh' || poiId === 'npc_fiona') {
        onMarkNpcMet(poiId);
      } else {
        onMarkPoiExplored(poiId);
      }
    },
    [externalModalOpen, journalOpen, onMarkNpcMet, onMarkPoiExplored, onPlaySfx, pauseMenuOpen, stopSpeech],
  );

  const closeActiveModal = useCallback(() => {
    stopSpeech();
    onPlaySfx('click');
    setActiveModalPoiId(null);
    setLandmarkModalMode('auto');
    setNpcDialogueStep(0);
  }, [onPlaySfx, stopSpeech]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (externalModalOpen || journalOpen) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Escape') {
        if (activeModalPoiId) {
          e.preventDefault();
          closeActiveModal();
          return;
        }
        if (pauseMenuOpen) {
          e.preventDefault();
          onPlaySfx('click');
          setPauseMenuOpen(false);
          return;
        }
        e.preventDefault();
        onPlaySfx('click');
        setPauseMenuOpen(true);
        return;
      }
      if ((e.code === 'KeyE' || e.code === 'Enter') && nearestPoiId && !activeModalPoiId && !pauseMenuOpen) {
        e.preventDefault();
        openPoiInteraction(nearestPoiId);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    activeModalPoiId,
    closeActiveModal,
    externalModalOpen,
    journalOpen,
    nearestPoiId,
    onPlaySfx,
    openPoiInteraction,
    pauseMenuOpen,
  ]);

  const builtLandmarkIds = SCOTLAND_BUILD_STATIONS.map((s) => s.id).filter((id) =>
    Boolean(builtSentences[id]),
  );
  const builtCount = builtLandmarkIds.length;
  const totalBuildStations = SCOTLAND_BUILD_STATIONS.length;
  const speakingCount = completedSpeakingIds.length;
  const totalPracticeMissions = SCOTLAND_PRACTICE_MISSIONS.length;

  const visitedPoiIds: ScotlandPoiId[] = [
    ...(metEilidh ? (['npc_eilidh'] as ScotlandPoiId[]) : []),
    ...(metFiona ? (['npc_fiona'] as ScotlandPoiId[]) : []),
    ...(practiceStarted
      ? completedSpeakingIds
      : buildStarted
        ? builtLandmarkIds
        : discoverStarted
          ? discoveredEvidenceIds
          : exploredPoiIds),
  ];

  const isPaused = externalModalOpen || activeModalPoiId !== null || pauseMenuOpen || journalOpen;

  const nav = useWorldNavigation({
    worldId: 'scotland',
    language,
    initialPosition: { x: SCOTLAND_SPAWN.x, z: SCOTLAND_SPAWN.z },
    isPaused,
    reducedMotion,
    nextMissionState: {
      worldId: 'scotland',
      state: {
        countryUnlocked: true,
        discoverStarted,
        discoveredEvidenceIds,
        discoverCompleted,
        buildStarted,
        builtStationIds: builtLandmarkIds,
        buildCompleted,
        practiceStarted,
        practicedStationIds: completedSpeakingIds,
        practiceCompleted,
        performStarted,
        performCompleted,
      },
    },
    onSyncGuideTarget: (targetId) => {
      setGuidedPoiId(targetId ? (targetId as ScotlandPoiId) : null);
    },
  });

  useEffect(() => {
    if (isPaused) {
      joystickRef.current = { x: 0, y: 0 };
    }
    voxAudio.setDialogueDucking(isPaused);
  }, [isPaused]);

  useEffect(() => {
    return () => {
      voxAudio.setDialogueDucking(false);
    };
  }, []);

  const nearestTarget = nearestPoiId
    ? SCOTLAND_INTERACTIVE_TARGETS.find((p) => p.id === nearestPoiId) ?? null
    : null;

  const activeNpcId: ScotlandNpcId | null =
    activeModalPoiId === 'npc_eilidh' || activeModalPoiId === 'npc_fiona'
      ? activeModalPoiId
      : null;

  const activeLandmark =
    activeModalPoiId && activeModalPoiId !== 'npc_eilidh' && activeModalPoiId !== 'npc_fiona'
      ? SCOTLAND_LANDMARKS.find((l) => l.id === activeModalPoiId) ?? null
      : null;

  const totalLandmarks = SCOTLAND_EVIDENCE_ITEMS.length;
  const evidenceCount = discoveredEvidenceIds.length;

  const npcDialogContent =
    activeNpcId === 'npc_eilidh'
      ? {
          name: 'Eilidh MacLeod',
          role:
            language === 'en'
              ? 'Scottish Student & Exchange Buddy'
              : 'นักเรียนเจ้าภาพชาวสกอตแลนด์',
          accentColor: '#3A7D6C',
          voice: country.npc.voiceProfile,
          text: !discoverStarted
            ? npcDialogueStep === 0
              ? EILIDH_DISCOVER_DIALOGUE.beforeStart
              : EILIDH_DISCOVER_DIALOGUE.beforeStartTip
            : !discoverCompleted
              ? EILIDH_DISCOVER_DIALOGUE.inProgress(evidenceCount, totalLandmarks)
              : !buildStarted
                ? npcDialogueStep === 0
                  ? EILIDH_BUILD_DIALOGUE.beforeStart
                  : EILIDH_BUILD_DIALOGUE.accuracyTip
                : !buildCompleted
                  ? npcDialogueStep === 0
                    ? EILIDH_BUILD_DIALOGUE.inProgress(builtCount, totalBuildStations)
                    : EILIDH_BUILD_DIALOGUE.accuracyTip
                  : !practiceStarted
                    ? npcDialogueStep === 0
                      ? EILIDH_PRACTICE_DIALOGUE.intro
                      : EILIDH_PRACTICE_DIALOGUE.accuracyTip
                    : !practiceCompleted
                      ? npcDialogueStep === 0
                        ? EILIDH_PRACTICE_DIALOGUE.inProgress(
                            speakingCount,
                            totalPracticeMissions,
                          )
                        : EILIDH_PRACTICE_DIALOGUE.accuracyTip
                      : performCompleted
                        ? EILIDH_PERFORM_DIALOGUE.completed
                        : performStarted
                          ? EILIDH_PERFORM_DIALOGUE.inProgress
                          : npcDialogueStep === 0
                            ? EILIDH_PERFORM_DIALOGUE.ready
                            : EILIDH_PERFORM_DIALOGUE.readyTip,
        }
      : activeNpcId === 'npc_fiona'
        ? {
            name: 'Fiona Campbell',
            role:
              language === 'en'
                ? 'Local Cultural Heritage Guide'
                : 'มัคคุเทศก์มรดกวัฒนธรรมท้องถิ่น',
            accentColor: '#7B5EA7',
            voice: { recommendedRate: 0.92, recommendedPitch: 0.98 },
            text: performCompleted
              ? FIONA_PERFORM_DIALOGUE.completed
              : performUnlocked
                ? npcDialogueStep === 0
                  ? FIONA_PERFORM_DIALOGUE.ready
                  : FIONA_PERFORM_DIALOGUE.guidance
                : practiceStarted || practiceUnlocked
                  ? npcDialogueStep === 0
                    ? FIONA_PRACTICE_DIALOGUE.accuracyGuide
                    : FIONA_BUILD_DIALOGUE.thaiBridgeTip
                  : buildStarted || buildUnlocked
                    ? npcDialogueStep === 0
                      ? FIONA_BUILD_DIALOGUE.coachTip
                      : FIONA_BUILD_DIALOGUE.thaiBridgeTip
                    : !discoverStarted
                      ? npcDialogueStep === 0
                        ? FIONA_DISCOVER_DIALOGUE.beforeStart
                        : FIONA_DISCOVER_DIALOGUE.factChecker
                      : npcDialogueStep === 0
                        ? FIONA_DISCOVER_DIALOGUE.factChecker
                        : FIONA_DISCOVER_DIALOGUE.thaiBridgeNote,
          }
        : null;

  const hudChipClass = isNight
    ? 'border-white/20 bg-[#131E31]/88 text-[#F7F9FC] hover:bg-[#1E2E49] shadow-lg'
    : 'border-[#20304A]/15 bg-[#FFFDF8]/92 text-[#20304A] hover:bg-white shadow-[0_6px_18px_rgba(32,48,74,0.12)]';

  const hudPanelClass = isNight
    ? 'border-white/20 bg-[#131E31]/88 text-[#F7F9FC] shadow-lg'
    : 'border-[#20304A]/12 bg-[#FFFDF8]/92 text-[#20304A] shadow-[0_6px_18px_rgba(32,48,74,0.12)]';

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden select-none">
      {/* Full-Screen Walkable 3D Scottish Highlands World (or Accessible 2D Fallback) */}
      <div className="absolute inset-0">
        {viewMode === '3d' && webglSupported ? (
          <Suspense
            fallback={
              <ScotlandFallback2D
                avatar={avatar}
                language={language}
                appearance={appearance}
                paused={isPaused}
                visitedPoiIds={visitedPoiIds}
                nearestPoiId={nearestPoiId}
                guidedPoiId={guidedPoiId}
                noticeText={copy.scotlandFallback2dNotice}
                autoWalkRequest={nav.autoWalkRequest}
                quickTravelRequest={nav.quickTravelRequest}
                onPositionChange={nav.handlePlayerPositionChange}
                onAutoWalkComplete={nav.handleSceneAutoWalkComplete}
                onManualInterrupt={nav.handleSceneManualInterrupt}
                onNearestPoiChange={setNearestPoiId}
                onActivatePoi={openPoiInteraction}
              />
            }
          >
            <LazyScotlandExplorationScene
              avatar={avatar}
              appearance={appearance}
              reducedMotion={reducedMotion}
              cameraSensitivity={cameraSensitivity}
              paused={isPaused}
              visitedPoiIds={visitedPoiIds}
              guidedPoiId={guidedPoiId}
              activeNpcId={activeNpcId}
              interactGestureSeq={interactGestureSeq}
              joystickRef={joystickRef}
              autoWalkRequest={nav.autoWalkRequest}
              quickTravelRequest={nav.quickTravelRequest}
              onPlayerPositionChange={nav.handlePlayerPositionChange}
              onAutoWalkComplete={nav.handleSceneAutoWalkComplete}
              onManualInterrupt={nav.handleSceneManualInterrupt}
              onNearestPoiChange={setNearestPoiId}
              onActivatePoi={openPoiInteraction}
              onWebGLFailure={onWebGLFailure}
            />
          </Suspense>
        ) : (
          <ScotlandFallback2D
            avatar={avatar}
            language={language}
            appearance={appearance}
            paused={isPaused}
            visitedPoiIds={visitedPoiIds}
            nearestPoiId={nearestPoiId}
            guidedPoiId={guidedPoiId}
            noticeText={copy.scotlandFallback2dNotice}
            autoWalkRequest={nav.autoWalkRequest}
            quickTravelRequest={nav.quickTravelRequest}
            onPositionChange={nav.handlePlayerPositionChange}
            onAutoWalkComplete={nav.handleSceneAutoWalkComplete}
            onManualInterrupt={nav.handleSceneManualInterrupt}
            onNearestPoiChange={setNearestPoiId}
            onActivatePoi={openPoiInteraction}
          />
        )}
      </div>

      {/* Brief Non-Blocking Arrival Banner */}
      {showArrivalBanner && (
        <div
          aria-live="polite"
          className="pointer-events-none absolute inset-x-0 top-24 z-20 flex justify-center px-4"
        >
          <div
            className={`rounded-2xl border px-6 py-3 text-center shadow-2xl ${
              isNight
                ? 'border-[#3A7D6C]/70 bg-[#131E31]/92'
                : 'border-white bg-[#FFFDF8]/94 shadow-[0_14px_34px_rgba(32,48,74,0.16)]'
            }`}
          >
            <p
              className={`font-display text-lg sm:text-xl font-bold ${
                isNight ? 'text-[#2ED6A3]' : 'text-[#2E6B5E]'
              }`}
            >
              {copy.arrivingScotlandTitle}
            </p>
            <p
              className={`mt-0.5 text-xs font-medium ${
                isNight ? 'text-[#E2ECF9]' : 'text-[#48607E]'
              }`}
            >
              {copy.arrivingScotlandSubtitle}
            </p>
          </div>
        </div>
      )}

      {/* Minimal Game HUD */}
      <header className="pointer-events-none relative z-10 flex items-start justify-between gap-2.5 p-3.5 sm:p-5">
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          <div
            className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-2.5 py-1 text-xs font-bold ${hudPanelClass}`}
          >
            <span
              className={`h-7 w-7 overflow-hidden rounded-lg border ${
                isNight ? 'border-[#2ED6A3]/60' : 'border-[#20304A]/15'
              }`}
            >
              <AvatarPortraitSVG
                avatar={avatar}
                variant="bust"
                appearance={appearance}
                className="h-full w-full"
              />
            </span>
            <span className="max-w-[110px] truncate">{avatar.displayName}</span>
          </div>

          <div
            className={`inline-flex min-h-[42px] items-center gap-2.5 rounded-xl border px-3 py-1.5 text-xs ${hudPanelClass}`}
          >
            <Compass
              className={`h-4 w-4 shrink-0 ${
                performCompleted || discoverCompleted
                  ? isNight
                    ? 'text-[#2ED6A3]'
                    : 'text-[#2E6B5E]'
                  : isNight
                    ? 'text-[#F2C66D]'
                    : 'text-[#3A7D6C]'
              }`}
              aria-hidden="true"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-display font-extrabold">
                {copy.scotlandHudTitle} ·{' '}
                {performUnlocked
                  ? copy.scotlandPerformStageBadge
                  : practiceUnlocked
                    ? copy.scotlandPracticeStageBadge
                    : buildUnlocked
                      ? copy.scotlandBuildStageBadge
                      : copy.scotlandDiscoverStageBadge}
              </span>
              <span className={`text-[11px] font-semibold ${isNight ? 'text-[#C8D4E6]' : 'text-[#48607E]'}`}>
                {nearestTarget
                  ? nearestTarget.title[language]
                  : !discoverStarted
                    ? copy.scotlandObjectiveTalkEilidhStart
                    : !discoverCompleted
                      ? copy.scotlandObjectiveCollectEvidence
                      : !buildStarted
                        ? copy.scotlandObjectiveTalkEilidhBuild
                        : !buildCompleted
                          ? copy.scotlandObjectiveBuild
                          : !practiceStarted
                            ? copy.scotlandObjectiveTalkEilidhPractice
                            : !practiceCompleted && !performUnlocked
                              ? copy.scotlandObjectivePractice
                              : performCompleted
                                ? copy.scotlandObjectiveScotlandComplete
                                : !performStarted
                                  ? copy.scotlandObjectiveStartPerform
                                  : copy.scotlandObjectivePerformShowcase}
              </span>
            </div>
            <span
              className={`h-3.5 w-px ${isNight ? 'bg-white/20' : 'bg-[#20304A]/15'}`}
              aria-hidden="true"
            />
            <span
              className={`font-mono-num font-extrabold ${
                (performUnlocked
                  ? performCompleted
                  : practiceUnlocked
                    ? practiceCompleted
                    : buildUnlocked
                      ? buildCompleted
                      : discoverCompleted)
                  ? isNight
                    ? 'text-[#2ED6A3]'
                    : 'text-[#0E7A74]'
                  : isNight
                    ? 'text-[#F2C66D]'
                    : 'text-[#3A7D6C]'
              }`}
            >
              {performUnlocked
                ? performCompleted
                  ? copy.scotlandPerformHudDone
                  : copy.scotlandPerformHudReady
                : practiceUnlocked
                  ? `${copy.scotlandPracticeHudLabel}: ${speakingCount}/${totalPracticeMissions}`
                  : buildUnlocked
                    ? `${copy.scotlandBuildHudLabel}: ${builtCount}/${totalBuildStations}`
                    : `${copy.scotlandEvidenceHudLabel}: ${evidenceCount}/${totalLandmarks}`}
            </span>
          </div>

          {guidedPoiId && (
            <button
              type="button"
              onClick={() => {
                onPlaySfx('click');
                setGuidedPoiId(null);
                nav.cancelNavigation('clear');
              }}
              title={copy.scotlandClearGuideButton}
              className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-extrabold transition-colors cursor-pointer ${
                isNight
                  ? 'border-[#F2C66D]/60 bg-[#2C2214]/92 text-[#FDE68A] hover:bg-[#3A2D1B]'
                  : 'border-[#F59E0B]/50 bg-[#FFFBEB]/95 text-[#92400E] hover:bg-[#FEF3C7] shadow-sm'
              }`}
            >
              <Navigation className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="max-w-[145px] truncate">
                {copy.scotlandHudGuidingPrefix}:{' '}
                {SCOTLAND_INTERACTIVE_TARGETS.find((l) => l.id === guidedPoiId)?.title[language]}
              </span>
              <X className="h-3 w-3 shrink-0 opacity-75" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onPlaySfx('select');
              setJournalStationId(undefined);
              setJournalOpen(true);
            }}
            className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${hudChipClass}`}
          >
            <BookOpen className="h-4 w-4 text-[#2B8C7E] dark:text-[#2ED6A3]" aria-hidden="true" />
            <span className="hidden md:inline">{copy.scotlandOpenJournalButton}</span>
            <span className="font-mono-num font-extrabold text-[#2B8C7E] dark:text-[#2ED6A3]">
              {evidenceCount}/{totalLandmarks}
            </span>
          </button>

          {isReplayActive && replayAttemptNumber !== undefined && (
            <div
              className={`hidden sm:inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-extrabold ${
                isNight
                  ? 'border-[#24B8B0]/45 bg-[#122B35]/90 text-[#2ED6A3]'
                  : 'border-[#24B8B0]/35 bg-[#E9FBF7]/94 text-[#0E7A74]'
              }`}
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{copy.replayModeLabel}</span>
              <span className="font-mono-num">#{replayAttemptNumber}</span>
            </div>
          )}

          <div
            className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold ${hudPanelClass}`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
            <span className="font-mono-num">{rewards.xp}</span>
            <span className={isNight ? 'text-[#B6C7DE]' : 'text-[#48607E]'}>{copy.xpLabel}</span>
          </div>

          <button
            type="button"
            onClick={onToggleQuickAppearance}
            aria-label={copy.appearanceLabel}
            title={isNight ? copy.modeDay : copy.modeNight}
            className={`inline-flex h-[42px] w-[42px] items-center justify-center rounded-xl border transition-colors cursor-pointer ${hudChipClass}`}
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
            className={`inline-flex h-[42px] w-[42px] items-center justify-center rounded-xl border transition-colors cursor-pointer ${
              musicPlaying
                ? 'border-[#24B8B0] bg-[#24B8B0] text-[#131E31]'
                : hudChipClass
            }`}
          >
            <Music className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => {
              onPlaySfx('click');
              setPauseMenuOpen(true);
            }}
            aria-label={copy.jaipurPauseMenuTitle}
            className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${hudChipClass}`}
          >
            <Pause className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{copy.jaipurPauseMenuTitle}</span>
          </button>
        </div>
      </header>

      {/* Smart Navigation HUD (Go to Next Mission, Places Auto-Walk & Quick Travel) */}
      {!isPaused && (
        <SmartNavigationHud
          language={language}
          destinations={nav.destinations}
          nextMission={nav.nextMissionResolution}
          autoWalkRequest={nav.autoWalkRequest}
          activeDestinationId={nav.activeDestinationId ?? guidedPoiId}
          statusBanner={nav.statusBanner}
          isPlacesOpen={nav.isPlacesOpen}
          setIsPlacesOpen={nav.setIsPlacesOpen}
          completedIds={
            practiceStarted
              ? completedSpeakingIds
              : buildStarted
                ? builtLandmarkIds
                : discoveredEvidenceIds
          }
          visitedIds={visitedPoiIds}
          quickTravelFlashActive={nav.quickTravelFlashActive}
          onGoToNextMission={() => {
            onPlaySfx('select');
            nav.goToNextMission('auto_walk');
          }}
          onStartAutoWalk={(targetId) => {
            onPlaySfx('select');
            nav.startAutoWalk(targetId);
          }}
          onQuickTravel={(targetId) => {
            onPlaySfx('select');
            nav.triggerQuickTravel(targetId);
          }}
          onCancelWalk={(reason) => {
            onPlaySfx('click');
            nav.cancelNavigation(reason);
          }}
          onGuideOnly={(targetId) => {
            onPlaySfx('select');
            setGuidedPoiId(targetId as ScotlandPoiId);
            nav.setActiveDestinationId(targetId);
          }}
          accentTone="indigo"
        />
      )}

      {/* Stage 1 DISCOVER Complete Celebration Banner */}
      {discoverCompleteToast && (
        <div
          aria-live="polite"
          className="pointer-events-none absolute inset-x-0 top-20 z-20 flex justify-center px-4"
        >
          <div
            className={`pointer-events-auto flex items-center gap-3 rounded-2xl border px-5 py-3 shadow-2xl ${
              isNight
                ? 'border-[#2ED6A3]/70 bg-[#12332F]/95 text-[#F7F9FC]'
                : 'border-[#6EE7B7] bg-[#ECFDF5] text-[#064E3B]'
            }`}
          >
            <Sparkles className="h-5 w-5 shrink-0 text-[#2ED6A3]" aria-hidden="true" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-sm sm:text-base font-extrabold">
                  {discoverCompleteToast.xpEarned
                    ? copy.scotlandDiscoverBannerTitle
                    : copy.scotlandDiscoverReplayBannerTitle}
                </p>
                {!discoverCompleteToast.xpEarned && (
                  <span className="rounded-lg bg-[#2ED6A3]/25 px-2 py-0.5 text-[11px] font-extrabold text-[#064E3B] dark:text-[#2ED6A3]">
                    {copy.replayNoExtraXpLabel}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium opacity-90">
                {copy.scotlandDiscoverBannerSubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDiscoverCompleteToast(null)}
              aria-label={copy.scotlandCloseButton}
              className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-black/10 cursor-pointer"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Stage 2 BUILD Complete Celebration Banner */}
      {buildCompleteToast && (
        <div
          aria-live="polite"
          className="pointer-events-none absolute inset-x-0 top-20 z-20 flex justify-center px-4"
        >
          <div
            className={`pointer-events-auto flex items-center gap-3 rounded-2xl border px-5 py-3 shadow-2xl ${
              isNight
                ? 'border-[#F2C66D]/75 bg-[#2A2013]/95 text-[#F7F9FC]'
                : 'border-[#FCD34D] bg-[#FFFBEB] text-[#78350F]'
            }`}
          >
            <Sparkles className="h-5 w-5 shrink-0 text-[#F2C66D]" aria-hidden="true" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-sm sm:text-base font-extrabold">
                  {buildCompleteToast.xpEarned
                    ? copy.scotlandBuildBannerTitle
                    : copy.scotlandBuildReplayBannerTitle}
                </p>
                {!buildCompleteToast.xpEarned && (
                  <span className="rounded-lg bg-[#F2C66D]/25 px-2 py-0.5 text-[11px] font-extrabold">
                    {copy.replayNoExtraXpLabel}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium opacity-90">
                {copy.scotlandBuildBannerSubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBuildCompleteToast(null)}
              aria-label={copy.scotlandCloseButton}
              className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-black/10 cursor-pointer"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Stage 3 PRACTICE Complete Celebration Banner */}
      {practiceCompleteToast && (
        <div
          aria-live="polite"
          className="pointer-events-none absolute inset-x-0 top-20 z-20 flex justify-center px-4"
        >
          <div
            className={`pointer-events-auto flex items-center gap-3 rounded-2xl border px-5 py-3 shadow-2xl ${
              isNight
                ? 'border-[#2ED6A3]/75 bg-[#12332F]/95 text-[#F7F9FC]'
                : 'border-[#6EE7B7] bg-[#ECFDF5] text-[#064E3B]'
            }`}
          >
            <Sparkles className="h-5 w-5 shrink-0 text-[#2ED6A3]" aria-hidden="true" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-sm sm:text-base font-extrabold">
                  {practiceCompleteToast.xpEarned
                    ? copy.scotlandPracticeBannerTitle
                    : copy.scotlandPracticeReplayBannerTitle}
                </p>
                {!practiceCompleteToast.xpEarned && (
                  <span className="rounded-lg bg-[#2ED6A3]/25 px-2 py-0.5 text-[11px] font-extrabold text-[#064E3B] dark:text-[#2ED6A3]">
                    {copy.replayNoExtraXpLabel}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium opacity-90">
                {copy.scotlandPracticeBannerSubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPracticeCompleteToast(null)}
              aria-label={copy.scotlandCloseButton}
              className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-black/10 cursor-pointer"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Stage 4 PERFORM Complete Celebration Banner */}
      {performCompleteToast && (
        <div
          aria-live="polite"
          className="pointer-events-none absolute inset-x-0 top-20 z-20 flex justify-center px-4"
        >
          <div
            className={`pointer-events-auto flex items-center gap-3 rounded-2xl border px-5 py-3 shadow-2xl ${
              isNight
                ? 'border-[#F2C66D]/80 bg-[#1B1D36]/95 text-[#F7F9FC]'
                : 'border-[#F59E0B] bg-[#FFFBEB] text-[#78350F]'
            }`}
          >
            <Sparkles className="h-5 w-5 shrink-0 text-[#F59E0B]" aria-hidden="true" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-sm sm:text-base font-extrabold">
                  {performCompleteToast.xpEarned
                    ? copy.scotlandPerformBannerTitle
                    : copy.scotlandPerformReplayBannerTitle}
                </p>
                {!performCompleteToast.xpEarned && (
                  <span
                    className={`rounded-lg px-2 py-0.5 text-[11px] font-extrabold ${
                      isNight
                        ? 'bg-[#F2C66D]/20 text-[#FDE68A]'
                        : 'bg-[#F59E0B]/20 text-[#78350F]'
                    }`}
                  >
                    {copy.replayNoExtraXpLabel}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium opacity-90">
                {copy.scotlandPerformBannerSubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPerformCompleteToast(null)}
              aria-label={copy.scotlandCloseButton}
              className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-black/10 cursor-pointer"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Controls HUD: Virtual Joystick + Contextual Interaction Button */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-4 sm:p-6">
        <div className="pointer-events-auto flex flex-col items-start gap-2.5">
          {showTouchPad && viewMode === '3d' && webglSupported && !isPaused && (
            <VirtualJoystick
              onVectorChange={handleJoystickChange}
              isNight={isNight}
              label={copy.jaipurMoveHint}
            />
          )}

          <div className="flex flex-wrap items-center gap-2">
            {viewMode === '3d' && webglSupported && (
              <button
                type="button"
                onClick={() => setShowTouchPad((s) => !s)}
                className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${hudChipClass}`}
              >
                <Gamepad2 className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
                <span>{showTouchPad ? copy.jaipurTouchPadHide : copy.jaipurTouchPadShow}</span>
              </button>
            )}

            <div
              className={`hidden md:flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] font-semibold ${
                isNight
                  ? 'border-white/15 bg-[#131E31]/82 text-[#D6E1F0]'
                  : 'border-[#20304A]/12 bg-[#FFFDF8]/88 text-[#394E6E] shadow-sm'
              }`}
            >
              <span>{copy.jaipurMoveHint}</span>
              <span aria-hidden="true">·</span>
              <span>{copy.jaipurCameraHint}</span>
            </div>
          </div>
        </div>

        <div className="pointer-events-auto">
          {nearestTarget && !isPaused && (
            <button
              type="button"
              onClick={() => openPoiInteraction(nearestTarget.id)}
              className="flex min-h-[54px] items-center gap-3 rounded-2xl border-2 border-[#FFF3D1] bg-[#F2C66D] px-5 py-3 text-left text-[#131E31] shadow-2xl hover:bg-[#f7d487] active:scale-[0.98] transition-transform cursor-pointer"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#131E31] text-[#F2C66D]">
                {nearestTarget.kind === 'npc' ? (
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                )}
              </span>
              <span>
                <span className="block text-[11px] font-extrabold uppercase tracking-wide text-[#392811]">
                  {copy.jaipurInteractPromptPrefix}{' '}
                  {nearestTarget.kind === 'npc'
                    ? copy.scotlandSpeakWithPrefix
                    : copy.scotlandExploreSpotPrefix}
                </span>
                <span className="block font-display text-sm sm:text-base font-extrabold leading-tight">
                  {nearestTarget.title[language]}
                </span>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Compact Pause & Quick Settings Overlay */}
      {pauseMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="scotland-pause-title"
          className={`fixed inset-0 z-30 flex items-center justify-center p-4 ${
            isNight ? 'bg-[#090F1E]/65' : 'bg-[#20304A]/28'
          }`}
        >
          <div
            className={`w-full max-w-sm rounded-3xl border p-5 sm:p-6 ${
              isNight
                ? 'border-[#3A7D6C]/60 bg-[#121C36]/96 text-[#F7F9FC] shadow-2xl'
                : 'border-white bg-[#FFFDF8]/98 text-[#1E2E46] shadow-[0_22px_48px_rgba(32,48,74,0.22)]'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 id="scotland-pause-title" className="font-display text-xl font-extrabold">
                {copy.jaipurPauseMenuTitle}
              </h2>
              <button
                type="button"
                onClick={() => {
                  onPlaySfx('click');
                  setPauseMenuOpen(false);
                }}
                aria-label={copy.jaipurResumeButton}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border cursor-pointer ${
                  isNight
                    ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                    : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A] hover:bg-[#DCE8F5]'
                }`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onPlaySfx('click');
                  setPauseMenuOpen(false);
                }}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#2ED6A3] px-4 py-2.5 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#49e2b3] cursor-pointer"
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                <span>{copy.jaipurResumeButton}</span>
              </button>

              {viewMode === '3d' && webglSupported && (
                <div
                  className={`rounded-xl border p-2.5 ${
                    isNight
                      ? 'border-white/15 bg-[#1A2847]'
                      : 'border-[#20304A]/12 bg-[#F2F7FC]'
                  }`}
                >
                  <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-[#D99B26]" aria-hidden="true" />
                    <span>{copy.jaipurCameraSensitivity}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { label: copy.jaipurSensitivityLow, value: 0.6 },
                      { label: copy.jaipurSensitivityMed, value: 1.0 },
                      { label: copy.jaipurSensitivityHigh, value: 1.5 },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          onPlaySfx('click');
                          setCameraSensitivity(opt.value);
                        }}
                        className={`rounded-lg py-1.5 text-xs font-bold cursor-pointer ${
                          Math.abs(cameraSensitivity - opt.value) < 0.05
                            ? 'bg-[#F2C66D] text-[#131E31]'
                            : isNight
                              ? 'bg-white/5 text-[#E2ECF9] hover:bg-white/10'
                              : 'bg-white text-[#20304A] hover:bg-[#E4EFFA]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onToggleQuickAppearance}
                  className={`inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold cursor-pointer ${hudChipClass}`}
                >
                  {isNight ? (
                    <Sun className="h-4 w-4 text-[#F2C66D]" aria-hidden="true" />
                  ) : (
                    <Moon className="h-4 w-4 text-[#3A5A8C]" aria-hidden="true" />
                  )}
                  <span>{isNight ? copy.modeDay : copy.modeNight}</span>
                </button>

                <button
                  type="button"
                  onClick={onToggleMusic}
                  className={`inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold cursor-pointer ${
                    musicPlaying
                      ? 'border-[#24B8B0] bg-[#24B8B0] text-[#131E31]'
                      : hudChipClass
                  }`}
                >
                  <Music className="h-4 w-4" aria-hidden="true" />
                  <span>{musicPlaying ? copy.onLabel : copy.offLabel}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPauseMenuOpen(false);
                  setJournalStationId(undefined);
                  setJournalOpen(true);
                }}
                className={`inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${hudChipClass}`}
              >
                <BookOpen className="h-4 w-4 text-[#2B8C7E]" aria-hidden="true" />
                <span>
                  {copy.scotlandOpenJournalButton} ({evidenceCount}/{totalLandmarks})
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPauseMenuOpen(false);
                  onOpenPassport();
                }}
                className={`inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${hudChipClass}`}
              >
                <BookOpen className="h-4 w-4 text-[#24B8B0]" aria-hidden="true" />
                <span>{copy.openPassport}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPauseMenuOpen(false);
                  onOpenSettings();
                }}
                className={`inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${hudChipClass}`}
              >
                <Settings className="h-4 w-4" aria-hidden="true" />
                <span>{copy.settingsTitle}</span>
              </button>

              {isReplayActive && onRequestRestartAttempt && (
                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    setPauseMenuOpen(false);
                    onRequestRestartAttempt();
                  }}
                  className={`inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${
                    isNight
                      ? 'border-[#F2C66D]/45 bg-[#2A2215] text-[#FDE68A] hover:bg-[#3A2E1A]'
                      : 'border-[#D98218]/35 bg-[#FFF7E3] text-[#8E5B08] hover:bg-[#FFEDC2]'
                  }`}
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  <span>{copy.restartAttemptButton}</span>
                </button>
              )}

              {!isReplayActive && canReplayCountry && onRequestReplayCountry && (
                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    setPauseMenuOpen(false);
                    onRequestReplayCountry();
                  }}
                  className={`inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${
                    isNight
                      ? 'border-[#24B8B0]/45 bg-[#18313D] text-[#E6FAF5] hover:bg-[#1E404F]'
                      : 'border-[#24B8B0]/35 bg-[#E9FBF7] text-[#0E7A74] hover:bg-[#D5F5EE]'
                  }`}
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  <span>{copy.replayCountryButton}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  stopSpeech();
                  setPauseMenuOpen(false);
                  onBackToMap();
                }}
                className={`inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${
                  isNight
                    ? 'border-[#E86D4E]/45 bg-[#2B1B29] text-[#FFB29D] hover:bg-[#3B2336]'
                    : 'border-[#C4503B]/25 bg-[#FFF1EE] text-[#A43A28] hover:bg-[#FFE3DD]'
                }`}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>{copy.backToMap}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Eilidh MacLeod & Fiona Campbell Dialogue Modal */}
      {npcDialogContent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="scotland-npc-modal-title"
          className={`fixed inset-0 z-30 flex items-end justify-center p-4 sm:p-6 ${
            isNight ? 'bg-[#090F1E]/55' : 'bg-[#20304A]/20'
          }`}
        >
          <div
            className={`w-full max-w-xl rounded-3xl border p-5 sm:p-6 transition-colors ${
              isNight
                ? 'border-[#3A7D6C]/70 bg-[#121C36]/95 text-[#F7F9FC] shadow-2xl'
                : 'border-white bg-[#FFFDF8]/96 text-[#1E2E46] shadow-[0_18px_40px_rgba(32,48,74,0.18)]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm"
                  style={{ backgroundColor: npcDialogContent.accentColor }}
                >
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2
                    id="scotland-npc-modal-title"
                    className={`font-display text-base sm:text-lg font-extrabold ${
                      isNight ? 'text-[#2ED6A3]' : 'text-[#235B4E]'
                    }`}
                  >
                    {npcDialogContent.name}
                  </h2>
                  <p className={`text-xs font-medium ${isNight ? 'text-[#C3CFE0]' : 'text-[#526785]'}`}>
                    {npcDialogContent.role} ·{' '}
                    <span className={`font-mono-num font-bold ${isNight ? 'text-[#F2C66D]' : 'text-[#3A7D6C]'}`}>
                      {evidenceCount}/{totalLandmarks}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    speakEnglishText(npcDialogContent.text.en, {
                      rate: npcDialogContent.voice.recommendedRate,
                      pitch: npcDialogContent.voice.recommendedPitch,
                    })
                  }
                  className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                    isNight
                      ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                      : 'border-[#24B8B0]/30 bg-[#E6F5FB] text-[#0E7A74] hover:bg-[#D4ECF8]'
                  }`}
                >
                  <Volume2 className="h-4 w-4 text-[#24B8B0]" aria-hidden="true" />
                  <span>{copy.jaipurListenButton}</span>
                </button>

                <button
                  type="button"
                  onClick={closeActiveModal}
                  aria-label={copy.scotlandCloseButton}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border cursor-pointer ${
                    isNight
                      ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                      : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A] hover:bg-[#DCE8F5]'
                  }`}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div
              className={`mt-3 rounded-2xl border p-4 ${
                isNight
                  ? 'border-white/10 bg-[#1A2847]/80 text-[#F7F9FC]'
                  : 'border-[#20304A]/10 bg-[#F3F8FA] text-[#1E2E46]'
              }`}
            >
              <p className="text-sm sm:text-base font-semibold leading-relaxed">
                {npcDialogContent.text.en}
              </p>
              {language === 'th' && (
                <p className={`mt-2 text-xs leading-relaxed ${isNight ? 'text-[#B8CAE0]' : 'text-[#526785]'}`}>
                  {npcDialogContent.text.th}
                </p>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <p className={`text-[11px] font-medium ${isNight ? 'text-[#A6B7CE]' : 'text-[#5C6F8C]'}`}>
                {!discoverStarted
                  ? copy.scotlandStartQuestPromptNote
                  : buildUnlocked && !buildStarted
                    ? copy.scotlandBuildPracticeReadinessNote
                    : copy.scotlandJournalProgressNote}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {activeNpcId === 'npc_eilidh' && !discoverStarted ? (
                  <>
                    {npcDialogueStep === 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          stopSpeech();
                          onPlaySfx('click');
                          setNpcDialogueStep(1);
                        }}
                        className={`inline-flex min-h-[40px] items-center justify-center rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${
                          isNight
                            ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                            : 'border-[#20304A]/15 bg-white text-[#20304A] hover:bg-[#EDF4FA]'
                        }`}
                      >
                        {copy.scotlandContinueButton}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        stopSpeech();
                        onPlaySfx('reward');
                        onStartDiscovery();
                        setActiveModalPoiId(null);
                        setNpcDialogueStep(0);
                      }}
                      className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-xs font-extrabold text-[#131E31] shadow hover:bg-[#49e2b3] cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                      <span>{copy.scotlandStartCultureQuestButton}</span>
                    </button>
                  </>
                ) : activeNpcId === 'npc_eilidh' && buildUnlocked && !buildStarted ? (
                  <>
                    {npcDialogueStep === 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          stopSpeech();
                          onPlaySfx('click');
                          setNpcDialogueStep(1);
                        }}
                        className={`inline-flex min-h-[40px] items-center justify-center rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${
                          isNight
                            ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                            : 'border-[#20304A]/15 bg-white text-[#20304A] hover:bg-[#EDF4FA]'
                        }`}
                      >
                        {copy.scotlandContinueButton}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        stopSpeech();
                        onPlaySfx('reward');
                        onStartBuild();
                        setActiveModalPoiId(null);
                        setNpcDialogueStep(0);
                      }}
                      className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-[#F2C66D] px-5 py-2 font-display text-xs font-extrabold text-[#131E31] shadow hover:bg-[#f6d388] cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                      <span>{copy.scotlandStartBuildButton}</span>
                    </button>
                  </>
                ) : activeNpcId === 'npc_eilidh' && practiceUnlocked && !practiceStarted ? (
                  <>
                    {npcDialogueStep === 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          stopSpeech();
                          onPlaySfx('click');
                          setNpcDialogueStep(1);
                        }}
                        className={`inline-flex min-h-[40px] items-center justify-center rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${
                          isNight
                            ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                            : 'border-[#20304A]/15 bg-white text-[#20304A] hover:bg-[#EDF4FA]'
                        }`}
                      >
                        {copy.scotlandContinueButton}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        stopSpeech();
                        onPlaySfx('reward');
                        onStartPractice();
                        setActiveModalPoiId(null);
                        setNpcDialogueStep(0);
                      }}
                      className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-xs font-extrabold text-[#131E31] shadow hover:bg-[#49e2b3] cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                      <span>{copy.scotlandStartPracticeButton}</span>
                    </button>
                  </>
                ) : performUnlocked && !performStarted ? (
                  <>
                    {npcDialogueStep === 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          stopSpeech();
                          onPlaySfx('click');
                          setNpcDialogueStep(1);
                        }}
                        className={`inline-flex min-h-[40px] items-center justify-center rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${
                          isNight
                            ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                            : 'border-[#20304A]/15 bg-white text-[#20304A] hover:bg-[#EDF4FA]'
                        }`}
                      >
                        {copy.scotlandContinueButton}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        stopSpeech();
                        onPlaySfx('reward');
                        onStartPerform();
                        setGuidedPoiId('lochside_castle_viewpoint');
                        setActiveModalPoiId(null);
                        setNpcDialogueStep(0);
                      }}
                      className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-[#F2C66D] px-5 py-2 font-display text-xs font-extrabold text-[#131E31] shadow hover:bg-[#f6d388] cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                      <span>{copy.scotlandStartPerformButton}</span>
                    </button>
                  </>
                ) : (
                  <>
                    {(activeNpcId === 'npc_fiona' ||
                      (activeNpcId === 'npc_eilidh' &&
                        ((buildStarted && !buildCompleted) ||
                          (practiceStarted && !practiceCompleted)))) &&
                      npcDialogueStep === 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            stopSpeech();
                            onPlaySfx('click');
                            setNpcDialogueStep(1);
                          }}
                          className={`inline-flex min-h-[40px] items-center justify-center rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${
                            isNight
                              ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                              : 'border-[#20304A]/15 bg-white text-[#20304A] hover:bg-[#EDF4FA]'
                          }`}
                        >
                          {copy.scotlandContinueButton}
                        </button>
                      )}
                    {performStarted && (
                      <button
                        type="button"
                        onClick={() => {
                          stopSpeech();
                          onPlaySfx('select');
                          setLandmarkModalMode('auto');
                          setActiveModalPoiId('lochside_castle_viewpoint');
                          setNpcDialogueStep(0);
                        }}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#F2C66D] px-4 py-2 font-display text-xs font-extrabold text-[#131E31] shadow hover:bg-[#f6d388] cursor-pointer"
                      >
                        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{copy.scotlandGoLochsideShowcaseButton}</span>
                      </button>
                    )}
                    {discoverStarted && (
                      <button
                        type="button"
                        onClick={() => {
                          closeActiveModal();
                          setJournalStationId(undefined);
                          setJournalOpen(true);
                        }}
                        className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${
                          isNight
                            ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                            : 'border-[#20304A]/15 bg-white text-[#20304A] hover:bg-[#EDF4FA]'
                        }`}
                      >
                        <BookOpen className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
                        <span>{copy.scotlandOpenJournalButton}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={closeActiveModal}
                      className="inline-flex min-h-[40px] items-center justify-center rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-xs font-extrabold text-[#131E31] shadow hover:bg-[#49e2b3] cursor-pointer"
                    >
                      {copy.scotlandCloseButton}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase 3E Stage 4 PERFORM Invitation at Lochside Castle Viewpoint (If player visits before NPC start) */}
      {activeLandmark &&
        activeLandmark.id === 'lochside_castle_viewpoint' &&
        performUnlocked &&
        !performStarted &&
        landmarkModalMode === 'auto' && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="scotland-lochside-perform-invite-title"
            className={`fixed inset-0 z-30 flex items-end sm:items-center justify-center p-4 sm:p-6 ${
              isNight ? 'bg-[#090F1E]/68' : 'bg-[#20304A]/28'
            }`}
          >
            <div
              className={`w-full max-w-xl overflow-hidden rounded-3xl border-2 ${
                isNight
                  ? 'border-[#3A7D6C]/70 bg-[#121C36] text-[#F7F9FC] shadow-2xl'
                  : 'border-[#20304A]/12 bg-[#FFFDF8] text-[#1E2E46] shadow-[0_22px_50px_rgba(32,48,74,0.22)]'
              }`}
            >
              <ScotlandTartanRibbonDivider />
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wide text-[#24B8B0]">
                      {copy.scotlandPerformMissionBadge} · {copy.scotlandPerformLocationLabel}
                    </p>
                    <h2
                      id="scotland-lochside-perform-invite-title"
                      className="mt-0.5 font-display text-xl font-extrabold"
                    >
                      {copy.scotlandLochsideInviteBadge}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={closeActiveModal}
                    aria-label={copy.scotlandCloseButton}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border cursor-pointer ${
                      isNight
                        ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                        : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A] hover:bg-[#DCE8F5]'
                    }`}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div
                  className={`flex items-start gap-3 rounded-2xl border p-3.5 ${
                    isNight ? 'border-[#2E6B5E]/60 bg-[#132934]' : 'border-[#2E6B5E]/25 bg-[#F2FBF8]'
                  }`}
                >
                  <ScotlandNpcPortraitSVG
                    npcId="eilidh"
                    isNight={isNight}
                    className="h-12 w-12 rounded-xl"
                  />
                  <div>
                    <p className="font-display text-xs font-extrabold text-[#2E6B5E] dark:text-[#2ED6A3]">
                      Eilidh MacLeod · Lochside Castle Viewpoint
                    </p>
                    <p className="mt-0.5 text-sm font-semibold leading-relaxed">
                      “{EILIDH_PERFORM_DIALOGUE.ready.en}”
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-start gap-3 rounded-2xl border p-3.5 ${
                    isNight ? 'border-[#7B5EA7]/60 bg-[#1B1E3C]' : 'border-[#7B5EA7]/25 bg-[#F7F4FC]'
                  }`}
                >
                  <ScotlandNpcPortraitSVG
                    npcId="fiona"
                    isNight={isNight}
                    className="h-12 w-12 rounded-xl"
                  />
                  <div>
                    <p className="font-display text-xs font-extrabold text-[#6A448E] dark:text-[#C09CEB]">
                      Fiona Campbell
                    </p>
                    <p className="mt-0.5 text-sm font-semibold leading-relaxed">
                      “{FIONA_PERFORM_DIALOGUE.ready.en}”
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('click');
                      setLandmarkModalMode('practice');
                    }}
                    className={`inline-flex min-h-[40px] items-center rounded-xl border px-3.5 py-2 text-xs font-bold cursor-pointer ${
                      isNight
                        ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                        : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A] hover:bg-[#DCE8F5]'
                    }`}
                  >
                    {copy.scotlandLochsideReviewPracticeButton}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onPlaySfx('reward');
                      onStartPerform();
                      setGuidedPoiId(null);
                      setLandmarkModalMode('auto');
                    }}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2.5 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#f7d487] cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    <span>{copy.scotlandStartPerformButton}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Phase 3E Stage 4 PERFORM Modal (Active at Lochside Castle Viewpoint once started) */}
      {activeLandmark &&
        activeLandmark.id === 'lochside_castle_viewpoint' &&
        performUnlocked &&
        performStarted &&
        landmarkModalMode === 'auto' && (
          <ScotlandPerformModal
            language={language}
            appearance={appearance}
            reducedMotion={reducedMotion}
            avatar={avatar}
            difficultyMode={difficultyMode}
            builtSentences={builtSentences}
            alreadyCompleted={performAlreadyRewarded}
            completedAt={completedAt}
            currentTotalXp={rewards.xp}
            initialSelectedEvidenceIds={performSelectedEvidenceIds}
            initialOutline={performOutline}
            initialSpeechMode={performSpeechPracticeMode}
            initialQaStates={performQuestionPracticeStates}
            initialReflectionState={performReflectionState}
            canReplayCountry={canReplayCountry}
            onDifficultyChange={setDifficultyMode}
            onPlaySfx={onPlaySfx}
            onSpeakText={speakEnglishText}
            onStopSpeech={stopSpeech}
            onCompletePerform={(payload) => {
              if (guidedPoiId === 'lochside_castle_viewpoint') {
                setGuidedPoiId(null);
              }
              const res = onCompletePerform(payload);
              setPerformCompleteToast({
                xpEarned: res.firstCompletion && !performAlreadyRewarded,
              });
              return res;
            }}
            onReviewPractice={() => setLandmarkModalMode('practice')}
            onOpenJournal={() => {
              setActiveModalPoiId(null);
              setJournalStationId('lochside_castle_viewpoint');
              setJournalOpen(true);
            }}
            onViewPassport={() => {
              closeActiveModal();
              onOpenPassport();
            }}
            onReturnWorldMap={() => {
              closeActiveModal();
              onBackToMap();
            }}
            onRequestReplayCountry={
              onRequestReplayCountry
                ? () => {
                    closeActiveModal();
                    onRequestReplayCountry();
                  }
                : undefined
            }
            onClose={closeActiveModal}
          />
        )}

      {/* Phase 3D Stage 3 PRACTICE Modal (Active Once Eilidh Starts Conversations or Explicit Review) */}
      {activeLandmark &&
        practiceStarted &&
        (((!performUnlocked && landmarkModalMode === 'auto') ||
          (performUnlocked &&
            activeLandmark.id !== 'lochside_castle_viewpoint' &&
            landmarkModalMode === 'auto')) ||
          landmarkModalMode === 'practice') && (
          <ScotlandPracticeModal
            stationId={activeLandmark.id}
            language={language}
            appearance={appearance}
            reducedMotion={reducedMotion}
            builtSentences={builtSentences}
            discoveredEvidenceIds={discoveredEvidenceIds}
            completedSpeakingIds={completedSpeakingIds}
            existingReflection={speakingReflectionStates[activeLandmark.id]}
            difficultyMode={difficultyMode}
            alreadyRewardedPractice={practiceAlreadyRewarded}
            onDifficultyChange={setDifficultyMode}
            onPlaySfx={onPlaySfx}
            onSpeakText={speakEnglishText}
            onStopSpeech={stopSpeech}
            onCompleteMission={(id, reflection) => {
              if (guidedPoiId === id) {
                setGuidedPoiId(null);
              }
              const firstCompleted5of5 = onCompletePracticeStation(id, reflection);
              if (firstCompleted5of5) {
                setPracticeCompleteToast({ xpEarned: !practiceAlreadyRewarded });
              }
              return firstCompleted5of5;
            }}
            onOpenBuildReview={() => setLandmarkModalMode('build')}
            onOpenDiscoverReview={() => setLandmarkModalMode('discover')}
            onOpenJournal={(stationId) => {
              setActiveModalPoiId(null);
              setJournalStationId(stationId);
              setJournalOpen(true);
            }}
            onInspectLandmarkInfo={() => setLandmarkModalMode('inspect')}
            onClose={closeActiveModal}
          />
        )}

      {/* Phase 3C Stage 2 BUILD Modal (Active During BUILD or Explicit Review) */}
      {activeLandmark &&
        buildStarted &&
        ((!practiceStarted && landmarkModalMode === 'auto') || landmarkModalMode === 'build') && (
          <ScotlandBuildModal
            stationId={activeLandmark.id}
            language={language}
            appearance={appearance}
            existingSentence={builtSentences[activeLandmark.id]}
            builtSentences={builtSentences}
            discoveredEvidenceIds={discoveredEvidenceIds}
            difficultyMode={difficultyMode}
            onDifficultyChange={setDifficultyMode}
            onCompleteStation={(id, builtSentence) => {
              if (guidedPoiId === id) {
                setGuidedPoiId(null);
              }
              const firstCompleted5of5 = onCompleteBuildStation(id, builtSentence);
              if (firstCompleted5of5) {
                setBuildCompleteToast({ xpEarned: !buildAlreadyRewarded });
              }
            }}
            onOpenDiscoverReview={() => setLandmarkModalMode('discover')}
            onOpenJournal={(stationId) => {
              setActiveModalPoiId(null);
              setJournalStationId(stationId);
              setJournalOpen(true);
            }}
            onInspectLandmarkInfo={() => setLandmarkModalMode('inspect')}
            onClose={closeActiveModal}
            onPlaySfx={onPlaySfx}
          />
        )}

      {/* Phase 3B Station Mini-Game Modal (Active During DISCOVER or Explicit Review) */}
      {activeLandmark &&
        discoverStarted &&
        ((!buildStarted && !practiceStarted && landmarkModalMode !== 'inspect') ||
          landmarkModalMode === 'discover') && (
          <ScotlandDiscoveryModal
            stationId={activeLandmark.id}
            language={language}
            appearance={appearance}
            alreadyCollected={discoveredEvidenceIds.includes(activeLandmark.id)}
            difficultyMode={difficultyMode}
            onDifficultyChange={setDifficultyMode}
            onCompleteStation={(id) => {
              if (guidedPoiId === id) {
                setGuidedPoiId(null);
              }
              const firstCompleted5of5 = onCompleteDiscoveryStation(id);
              if (firstCompleted5of5) {
                setDiscoverCompleteToast({ xpEarned: !discoverAlreadyRewarded });
              }
            }}
            onOpenJournal={(stationId) => {
              setActiveModalPoiId(null);
              setJournalStationId(stationId);
              setJournalOpen(true);
            }}
            onInspectLandmarkInfo={() => setLandmarkModalMode('inspect')}
            onClose={closeActiveModal}
            onPlaySfx={onPlaySfx}
          />
        )}

      {/* Scottish Cultural Landmark Inspection Modal (Preserved for Pre-Quest Exploration & Overview) */}
      {activeLandmark && (!discoverStarted || landmarkModalMode === 'inspect') && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="scotland-landmark-title"
          className={`fixed inset-0 z-30 flex items-center justify-center p-4 sm:p-6 ${
            isNight ? 'bg-[#090F1E]/65' : 'bg-[#20304A]/28'
          }`}
        >
          <div
            className={`w-full max-w-xl max-h-[88dvh] overflow-y-auto rounded-3xl border p-5 sm:p-6 ${
              isNight
                ? 'border-[#3A7D6C]/65 bg-[#121C36]/97 text-[#F7F9FC] shadow-2xl'
                : 'border-white bg-[#FFFDF8]/98 text-[#1E2E46] shadow-[0_22px_48px_rgba(32,48,74,0.22)]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold">
                  <span
                    className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-extrabold text-white"
                    style={{ backgroundColor: activeLandmark.accentColor }}
                  >
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    <span>
                      {activeLandmark.order}/{totalLandmarks} · {activeLandmark.heritageBadge[language]}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1B7A62] dark:text-[#2ED6A3]">
                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    <span>{copy.scotlandAlreadyExploredLabel}</span>
                  </span>
                </div>
                <h2 id="scotland-landmark-title" className="mt-2 font-display text-xl font-extrabold">
                  {activeLandmark.title[language]}
                </h2>
                <p className={`text-xs font-semibold ${isNight ? 'text-[#B8CAE0]' : 'text-[#526785]'}`}>
                  {activeLandmark.subtitle[language]}
                </p>
              </div>

              <button
                type="button"
                onClick={closeActiveModal}
                aria-label={copy.scotlandCloseButton}
                className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border cursor-pointer ${
                  isNight
                    ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                    : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A] hover:bg-[#DCE8F5]'
                }`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {!discoverStarted && (
              <div
                className={`mt-3 rounded-2xl border p-3.5 text-xs font-semibold ${
                  isNight
                    ? 'border-[#F2C66D]/40 bg-[#2A2013] text-[#FDE68A]'
                    : 'border-[#FCD34D] bg-[#FFFBEB] text-[#92400E]'
                }`}
              >
                {copy.scotlandInspectionBeforeQuestNote}
              </div>
            )}

            <div className="mt-4 space-y-3">
              <div
                className={`rounded-2xl border p-3.5 ${
                  isNight
                    ? 'border-white/12 bg-[#1A2847]/75'
                    : 'border-[#20304A]/10 bg-[#F3F8FA]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wide text-[#24B8B0]">
                    {copy.scotlandCulturalFocusLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      speakEnglishText(
                        `${activeLandmark.title.en}. ${activeLandmark.description.en}`,
                      )
                    }
                    className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                      isNight
                        ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                        : 'border-[#24B8B0]/30 bg-white text-[#0E7A74] hover:bg-[#E6F5FB]'
                    }`}
                  >
                    <Volume2 className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
                    <span>{copy.jaipurListenButton}</span>
                  </button>
                </div>
                <p className="mt-1 text-xs font-bold">{activeLandmark.culturalFocus[language]}</p>
                <p className="mt-2 text-sm leading-relaxed">{activeLandmark.description.en}</p>
                {language === 'th' && (
                  <p className={`mt-1.5 text-xs leading-relaxed ${isNight ? 'text-[#B8CAE0]' : 'text-[#526785]'}`}>
                    {activeLandmark.description.th}
                  </p>
                )}
              </div>

              <div
                className={`rounded-2xl border p-3.5 ${
                  isNight
                    ? 'border-white/12 bg-[#1A2847]/65'
                    : 'border-[#20304A]/10 bg-[#FFFDF4]'
                }`}
              >
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#D99B26]">
                  {copy.scotlandEverydayVsTraditionLabel}
                </p>
                <p className="mt-1 text-xs sm:text-sm leading-relaxed">
                  {activeLandmark.culturalAccuracyNote[language]}
                </p>
              </div>

              <div
                className={`rounded-2xl border p-3.5 ${
                  isNight
                    ? 'border-[#3A7D6C]/45 bg-[#12332F]/70'
                    : 'border-[#3A7D6C]/25 bg-[#EBF7F4]'
                }`}
              >
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#2B8C7E]">
                  {copy.scotlandComparePromptLabel}
                </p>
                <p className="mt-1 text-xs sm:text-sm font-medium leading-relaxed">
                  {activeLandmark.comparisonSpark[language]}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
              {discoverStarted && (
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('select');
                    setLandmarkModalMode('auto');
                  }}
                  className="inline-flex min-h-[42px] items-center justify-center rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-xs font-extrabold text-[#131E31] shadow hover:bg-[#49e2b3] cursor-pointer"
                >
                  {copy.scotlandLaunchChallengeButton}
                </button>
              )}
              <button
                type="button"
                onClick={closeActiveModal}
                className="ml-auto inline-flex min-h-[42px] items-center justify-center rounded-xl bg-[#F2C66D] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow hover:bg-[#f6d388] cursor-pointer"
              >
                {copy.scotlandCloseButton}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scottish Cultural Explorer Journal */}
      <CulturalExplorerJournalModal
        isOpen={journalOpen}
        language={language}
        appearance={appearance}
        discoveredEvidenceIds={discoveredEvidenceIds}
        exploredPoiIds={exploredPoiIds}
        builtSentences={builtSentences}
        completedSpeakingIds={completedSpeakingIds}
        guidedPoiId={
          guidedPoiId && guidedPoiId !== 'npc_eilidh' && guidedPoiId !== 'npc_fiona'
            ? guidedPoiId
            : null
        }
        initialStationId={journalStationId}
        difficultyMode={difficultyMode}
        onDifficultyChange={setDifficultyMode}
        onGuideToLandmark={(id) => {
          setGuidedPoiId(id);
          nav.setActiveDestinationId(id);
          setJournalOpen(false);
        }}
        onAutoWalkToLandmark={(id) => {
          nav.startAutoWalk(id);
        }}
        onQuickTravelToLandmark={(id) => {
          nav.triggerQuickTravel(id);
        }}
        onClearGuide={() => {
          setGuidedPoiId(null);
          nav.cancelNavigation('clear');
        }}
        onClose={() => setJournalOpen(false)}
        onPlaySfx={onPlaySfx}
      />
    </main>
  );
}
