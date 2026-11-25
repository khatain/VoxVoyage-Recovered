import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Award,
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
  AustraliaPerformChallengeRecord,
  AustraliaPerformReflectionState,
  AustraliaSpeakingEvidenceRecord,
  AvatarConfig,
  CountryWorld,
  ResolvedAppearance,
  RewardWallet,
} from '../../types/game';
import { GAME_COPY } from '../../data/i18n';
import {
  AUSTRALIA_INTERACTIVE_TARGETS,
  AUSTRALIA_LANDMARKS,
  AUSTRALIA_NPC_DIALOGUES,
  AUSTRALIA_SPAWN,
  type AustraliaLandmarkId,
  type AustraliaNpcId,
  type AustraliaPoiId,
} from '../../data/australiaWorld';
import {
  AUSTRALIA_DISCOVER_MISSION_ORDER,
  AUSTRALIA_DISCOVER_MISSIONS,
  AUSTRALIA_OLIVIA_DISCOVER_WELCOME,
  getAustraliaDiscoverMissionMeta,
  type AustraliaDifficultyMode,
} from '../../data/australiaDiscovery';
import {
  AUSTRALIA_BUILD_MISSION_ORDER,
  AUSTRALIA_BUILD_MISSIONS,
  AUSTRALIA_OLIVIA_BUILD_WELCOME,
  getAustraliaBuildMissionMeta,
} from '../../data/australiaBuild';
import {
  AUSTRALIA_OLIVIA_PRACTICE_WELCOME,
  AUSTRALIA_PRACTICE_MISSION_ORDER,
  AUSTRALIA_PRACTICE_MISSIONS,
  getAustraliaPracticeMissionSpec,
} from '../../data/australiaPractice';
import {
  AUSTRALIA_OLIVIA_PERFORM_WELCOME,
  AUSTRALIA_PERFORM_CHALLENGE_ORDER,
  AUSTRALIA_PERFORM_CHALLENGES,
  getAustraliaPerformChallengeSpec,
} from '../../data/australiaPerform';
import { AvatarPortraitSVG } from '../avatar/AvatarPortraitSVG';
import { VirtualJoystick, type JoystickVector } from '../india/VirtualJoystick';
import { voxAudio } from '../../utils/audioEngine';
import {
  AustraliaLandmarkBadgeSVG,
  AustraliaNpcPortraitSVG,
} from '../australia/AustraliaSvgArtwork';
import { SydneyCityExplorerGuideModal } from '../australia/SydneyCityExplorerGuideModal';
import { SydneyFallback2D } from '../australia/SydneyFallback2D';
import { AustraliaDiscoveryModal } from '../australia/AustraliaDiscoveryModal';
import { AustraliaBuildModal } from '../australia/AustraliaBuildModal';
import { AustraliaPracticeModal } from '../australia/AustraliaPracticeModal';
import {
  AustraliaPerformModal,
  type AustraliaPerformModalView,
  type AustraliaPerformReflectionDraft,
} from '../australia/AustraliaPerformModal';
import { useWorldNavigation } from '../../utils/useWorldNavigation';
import { SmartNavigationHud } from '../navigation/SmartNavigationHud';

const LazySydneyExplorationScene = lazy(
  () => import('../australia/SydneyExplorationScene'),
);

interface AustraliaWorldScreenProps {
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
  exploredPoiIds: AustraliaLandmarkId[];
  metNpcIds: AustraliaNpcId[];
  discoverStarted: boolean;
  completedDiscoverIds: AustraliaLandmarkId[];
  nextDiscoverLandmarkId: AustraliaLandmarkId | null;
  discoverCompleted: boolean;
  buildUnlocked: boolean;
  buildStarted: boolean;
  completedBuildIds: AustraliaLandmarkId[];
  nextBuildLandmarkId: AustraliaLandmarkId | null;
  buildCompleted: boolean;
  practiceUnlocked: boolean;
  builtDialogues: Record<string, string>;
  practiceStarted: boolean;
  completedPracticeIds: AustraliaLandmarkId[];
  nextPracticeLandmarkId: AustraliaLandmarkId | null;
  practiceCompleted: boolean;
  practiceEvidence: Record<string, AustraliaSpeakingEvidenceRecord>;
  performUnlocked: boolean;
  performStarted: boolean;
  completedPerformIds: AustraliaLandmarkId[];
  nextPerformLandmarkId: AustraliaLandmarkId | null;
  performCompleted: boolean;
  performAlreadyRewarded: boolean;
  performEvidence: Record<string, AustraliaPerformChallengeRecord>;
  performReflection?: AustraliaPerformReflectionState;
  completedAt?: string;
  isReplayActive?: boolean;
  replayAttemptNumber?: number;
  canReplayCountry?: boolean;
  openReflectionOnEnter?: boolean;
  onConsumeOpenReflectionOnEnter?: () => void;
  onMarkNpcMet: (npcId: AustraliaNpcId) => void;
  onMarkPoiExplored: (landmarkId: AustraliaLandmarkId) => void;
  onStartDiscovery: () => void;
  onCompleteDiscoveryMission: (landmarkId: AustraliaLandmarkId) => void;
  onStartBuild: () => void;
  onCompleteBuildMission: (
    landmarkId: AustraliaLandmarkId,
    craftedDialogueSummary: string,
  ) => void;
  onStartPractice: () => void;
  onCompletePracticeMission: (
    landmarkId: AustraliaLandmarkId,
    evidence: AustraliaSpeakingEvidenceRecord,
  ) => void;
  onStartPerform: () => void;
  onCompletePerformChallenge: (
    landmarkId: AustraliaLandmarkId,
    record: AustraliaPerformChallengeRecord,
  ) => void;
  onCompletePerformMission: (
    reflection: AustraliaPerformReflectionState,
  ) => { firstCompletion: boolean };
  onRequestReplayCountry?: () => void;
  onRequestRestartAttempt?: () => void;
  onWebGLFailure: () => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'mode' | 'reward') => void;
  onBackToMap: () => void;
  onOpenPassport: () => void;
  onToggleQuickAppearance: () => void;
  onToggleMusic: () => void;
  onOpenSettings: () => void;
}

const NPC_PRIMARY_LANDMARK_MAP: Record<AustraliaNpcId, AustraliaLandmarkId> = {
  npc_olivia: 'circular_quay_plaza',
  npc_noah: 'city_transit_station',
  npc_mia: 'harbour_market_cafe',
  npc_jack: 'darling_harbour_hub',
};

export function AustraliaWorldScreen({
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
  exploredPoiIds,
  metNpcIds,
  discoverStarted,
  completedDiscoverIds,
  nextDiscoverLandmarkId,
  discoverCompleted,
  buildUnlocked,
  buildStarted,
  completedBuildIds,
  nextBuildLandmarkId,
  buildCompleted,
  practiceUnlocked,
  builtDialogues,
  practiceStarted,
  completedPracticeIds,
  nextPracticeLandmarkId,
  practiceCompleted,
  practiceEvidence,
  performUnlocked,
  performStarted,
  completedPerformIds,
  nextPerformLandmarkId,
  performCompleted,
  performAlreadyRewarded,
  performEvidence,
  performReflection,
  completedAt,
  isReplayActive = false,
  replayAttemptNumber,
  canReplayCountry = false,
  openReflectionOnEnter = false,
  onConsumeOpenReflectionOnEnter,
  onMarkNpcMet,
  onMarkPoiExplored,
  onStartDiscovery,
  onCompleteDiscoveryMission,
  onStartBuild,
  onCompleteBuildMission,
  onStartPractice,
  onCompletePracticeMission,
  onStartPerform,
  onCompletePerformChallenge,
  onCompletePerformMission,
  onRequestReplayCountry,
  onRequestRestartAttempt,
  onWebGLFailure,
  onPlaySfx,
  onBackToMap,
  onOpenPassport,
  onToggleQuickAppearance,
  onToggleMusic,
  onOpenSettings,
}: AustraliaWorldScreenProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';

  const [showArrivalBanner, setShowArrivalBanner] = useState(true);
  const [nearestPoiId, setNearestPoiId] = useState<AustraliaPoiId | null>(null);
  const [activeModalPoiId, setActiveModalPoiId] = useState<AustraliaPoiId | null>(null);
  const [activeMiniGameLandmarkId, setActiveMiniGameLandmarkId] =
    useState<AustraliaLandmarkId | null>(null);
  const [activeBuildLandmarkId, setActiveBuildLandmarkId] =
    useState<AustraliaLandmarkId | null>(null);
  const [activePracticeLandmarkId, setActivePracticeLandmarkId] =
    useState<AustraliaLandmarkId | null>(null);
  const [activePerformView, setActivePerformView] =
    useState<AustraliaPerformModalView | null>(null);
  const [reflectionDraft, setReflectionDraft] = useState<
    AustraliaPerformReflectionDraft | undefined
  >(undefined);
  const [hasExitedReflectionWithoutSubmit, setHasExitedReflectionWithoutSubmit] = useState(false);
  const [performCompleteToast, setPerformCompleteToast] = useState<{
    xpEarned: boolean;
  } | null>(null);
  const [difficultyMode, setDifficultyMode] = useState<AustraliaDifficultyMode>('a2');
  const [npcDialogueStep, setNpcDialogueStep] = useState<0 | 1>(0);
  const [pauseMenuOpen, setPauseMenuOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideInitialLandmarkId, setGuideInitialLandmarkId] = useState<
    AustraliaLandmarkId | undefined
  >(undefined);
  const [guidedPoiId, setGuidedPoiId] = useState<AustraliaLandmarkId | null>(null);
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
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  const speakEnglish = useCallback(
    (text: string, rate = 0.96, pitch = 1.04) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      stopSpeech();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-AU';
      utterance.rate = rate;
      utterance.pitch = pitch;
      window.speechSynthesis.speak(utterance);
    },
    [stopSpeech],
  );

  const openPoiInteraction = useCallback(
    (poiId: AustraliaPoiId) => {
      if (
        pauseMenuOpen ||
        externalModalOpen ||
        guideOpen ||
        activeMiniGameLandmarkId ||
        activeBuildLandmarkId ||
        activePracticeLandmarkId ||
        activePerformView
      )
        return;
      stopSpeech();
      onPlaySfx('select');
      setInteractGestureSeq((prev) => prev + 1);
      setNpcDialogueStep(0);
      setActiveModalPoiId(poiId);

      if (
        poiId === 'npc_olivia' ||
        poiId === 'npc_noah' ||
        poiId === 'npc_mia' ||
        poiId === 'npc_jack'
      ) {
        onMarkNpcMet(poiId);
      } else {
        onMarkPoiExplored(poiId);
        if (guidedPoiId === poiId) {
          setGuidedPoiId(null);
        }
      }
    },
    [
      activeBuildLandmarkId,
      activeMiniGameLandmarkId,
      activePerformView,
      activePracticeLandmarkId,
      externalModalOpen,
      guideOpen,
      guidedPoiId,
      onMarkNpcMet,
      onMarkPoiExplored,
      onPlaySfx,
      pauseMenuOpen,
      stopSpeech,
    ],
  );

  const closeActiveModal = useCallback(() => {
    stopSpeech();
    onPlaySfx('click');
    setActiveModalPoiId(null);
    setNpcDialogueStep(0);
  }, [onPlaySfx, stopSpeech]);

  const launchDiscoverMiniGame = useCallback(
    (targetLandmarkId: AustraliaLandmarkId) => {
      if (!discoverStarted) return;
      const isCompleted = completedDiscoverIds.includes(targetLandmarkId);
      const isNextEligible = nextDiscoverLandmarkId === targetLandmarkId;
      if (!isCompleted && !isNextEligible) return;
      stopSpeech();
      onPlaySfx('select');
      setActiveModalPoiId(null);
      setActiveMiniGameLandmarkId(targetLandmarkId);
    },
    [
      completedDiscoverIds,
      discoverStarted,
      nextDiscoverLandmarkId,
      onPlaySfx,
      stopSpeech,
    ],
  );

  const launchBuildMiniGame = useCallback(
    (targetLandmarkId: AustraliaLandmarkId) => {
      if (!buildUnlocked || !buildStarted) return;
      const isCompleted = completedBuildIds.includes(targetLandmarkId);
      const isNextEligible = nextBuildLandmarkId === targetLandmarkId;
      if (!isCompleted && !isNextEligible) return;
      stopSpeech();
      onPlaySfx('select');
      setActiveModalPoiId(null);
      setActiveBuildLandmarkId(targetLandmarkId);
    },
    [
      buildStarted,
      buildUnlocked,
      completedBuildIds,
      nextBuildLandmarkId,
      onPlaySfx,
      stopSpeech,
    ],
  );

  const launchPracticeMission = useCallback(
    (targetLandmarkId: AustraliaLandmarkId) => {
      if (!practiceUnlocked || !practiceStarted) return;
      const isCompleted = completedPracticeIds.includes(targetLandmarkId);
      const isNextEligible = nextPracticeLandmarkId === targetLandmarkId;
      if (!isCompleted && !isNextEligible) return;
      stopSpeech();
      onPlaySfx('select');
      setActiveModalPoiId(null);
      setActivePracticeLandmarkId(targetLandmarkId);
    },
    [
      completedPracticeIds,
      nextPracticeLandmarkId,
      onPlaySfx,
      practiceStarted,
      practiceUnlocked,
      stopSpeech,
    ],
  );

  const launchPerformChallenge = useCallback(
    (targetLandmarkId: AustraliaLandmarkId) => {
      if (!performUnlocked || !performStarted) return;
      const isCompleted = completedPerformIds.includes(targetLandmarkId);
      const isNextEligible = nextPerformLandmarkId === targetLandmarkId;
      if (!isCompleted && !isNextEligible) return;
      stopSpeech();
      onPlaySfx('select');
      setActiveModalPoiId(null);
      setActivePerformView({ kind: 'challenge', landmarkId: targetLandmarkId });
    },
    [
      completedPerformIds,
      nextPerformLandmarkId,
      onPlaySfx,
      performStarted,
      performUnlocked,
      stopSpeech,
    ],
  );

  const awaitingFinalReflection =
    performUnlocked &&
    performStarted &&
    completedPerformIds.length >= AUSTRALIA_PERFORM_CHALLENGES.length &&
    !performCompleted;

  const performDisplayCount = performCompleted
    ? AUSTRALIA_PERFORM_CHALLENGES.length
    : Math.min(completedPerformIds.length, AUSTRALIA_PERFORM_CHALLENGES.length - 1);

  useEffect(() => {
    if (performCompleted) {
      setReflectionDraft(undefined);
      setHasExitedReflectionWithoutSubmit(false);
    }
  }, [performCompleted]);

  const openPerformReflection = useCallback(() => {
    if (
      !performUnlocked ||
      !performStarted ||
      completedPerformIds.length < AUSTRALIA_PERFORM_CHALLENGES.length
    ) {
      return;
    }
    stopSpeech();
    onPlaySfx('reward');
    setActiveModalPoiId(null);
    setActivePerformView({ kind: 'reflection' });
  }, [completedPerformIds.length, onPlaySfx, performStarted, performUnlocked, stopSpeech]);

  useEffect(() => {
    if (openReflectionOnEnter) {
      if (awaitingFinalReflection) {
        setActivePerformView({ kind: 'reflection' });
      }
      onConsumeOpenReflectionOnEnter?.();
    }
  }, [awaitingFinalReflection, onConsumeOpenReflectionOnEnter, openReflectionOnEnter]);

  const openPerformCelebration = useCallback(() => {
    if (!performCompleted && !performAlreadyRewarded) return;
    stopSpeech();
    onPlaySfx('reward');
    setActiveModalPoiId(null);
    setActivePerformView({ kind: 'celebration' });
  }, [onPlaySfx, performAlreadyRewarded, performCompleted, stopSpeech]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        externalModalOpen ||
        guideOpen ||
        activeMiniGameLandmarkId ||
        activeBuildLandmarkId ||
        activePracticeLandmarkId ||
        activePerformView
      )
        return;
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
      if (
        (e.code === 'KeyE' || e.code === 'Enter') &&
        nearestPoiId &&
        !activeModalPoiId &&
        !pauseMenuOpen
      ) {
        e.preventDefault();
        openPoiInteraction(nearestPoiId);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    activeBuildLandmarkId,
    activeMiniGameLandmarkId,
    activeModalPoiId,
    activePerformView,
    activePracticeLandmarkId,
    closeActiveModal,
    externalModalOpen,
    guideOpen,
    nearestPoiId,
    onPlaySfx,
    openPoiInteraction,
    pauseMenuOpen,
  ]);

  const visitedPoiIds: AustraliaPoiId[] = [...metNpcIds, ...exploredPoiIds];
  const isPaused =
    externalModalOpen ||
    activeModalPoiId !== null ||
    activeMiniGameLandmarkId !== null ||
    activeBuildLandmarkId !== null ||
    activePracticeLandmarkId !== null ||
    activePerformView !== null ||
    pauseMenuOpen ||
    guideOpen;

  const nav = useWorldNavigation({
    worldId: 'australia',
    language,
    initialPosition: { x: AUSTRALIA_SPAWN.x, z: AUSTRALIA_SPAWN.z },
    isPaused,
    reducedMotion,
    nextMissionState: {
      worldId: 'australia',
      state: {
        countryUnlocked: true,
        discoverStarted,
        discoverCompleted,
        completedDiscoverIds,
        buildUnlocked,
        buildStarted,
        completedBuildIds,
        buildCompleted,
        practiceUnlocked,
        practiceStarted,
        completedPracticeIds,
        practiceCompleted,
        performUnlocked,
        performStarted,
        completedPerformIds,
        performCompleted,
      },
    },
    onSyncGuideTarget: (targetId) => {
      if (!targetId) {
        setGuidedPoiId(null);
        return;
      }
      if (AUSTRALIA_LANDMARKS.some((l) => l.id === targetId)) {
        setGuidedPoiId(targetId as AustraliaLandmarkId);
      } else {
        setGuidedPoiId(null);
      }
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
    ? AUSTRALIA_INTERACTIVE_TARGETS.find((p) => p.id === nearestPoiId) ?? null
    : null;

  const activeNpcId: AustraliaNpcId | null =
    activeModalPoiId === 'npc_olivia' ||
    activeModalPoiId === 'npc_noah' ||
    activeModalPoiId === 'npc_mia' ||
    activeModalPoiId === 'npc_jack'
      ? activeModalPoiId
      : null;

  const activeNpcEntry = activeNpcId ? AUSTRALIA_NPC_DIALOGUES[activeNpcId] : null;

  const activeLandmark =
    activeModalPoiId && !activeNpcId
      ? AUSTRALIA_LANDMARKS.find((l) => l.id === activeModalPoiId) ?? null
      : null;

  const exploredCount = exploredPoiIds.length;
  const totalLandmarks = AUSTRALIA_LANDMARKS.length;
  const allLandmarksExplored = exploredCount >= totalLandmarks;

  const hudChipClass = isNight
    ? 'border-white/20 bg-[#131E31]/88 text-[#F7F9FC] hover:bg-[#1E2E49] shadow-lg'
    : 'border-[#20304A]/15 bg-[#FFFDF8]/92 text-[#20304A] hover:bg-white shadow-[0_6px_18px_rgba(32,48,74,0.12)]';

  const hudPanelClass = isNight
    ? 'border-white/20 bg-[#131E31]/88 text-[#F7F9FC] shadow-lg'
    : 'border-[#20304A]/12 bg-[#FFFDF8]/92 text-[#20304A] shadow-[0_6px_18px_rgba(32,48,74,0.12)]';

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden select-none">
      {/* Full-Screen Walkable 3D Sydney Harbour World (or Accessible 2D Fallback) */}
      <div className="absolute inset-0">
        {viewMode === '3d' && webglSupported ? (
          <Suspense
            fallback={
              <SydneyFallback2D
                avatar={avatar}
                language={language}
                appearance={appearance}
                paused={isPaused}
                visitedPoiIds={visitedPoiIds}
                nearestPoiId={nearestPoiId}
                guidedPoiId={guidedPoiId}
                noticeText={copy.australiaFallback2dNotice}
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
            <LazySydneyExplorationScene
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
              onPositionChange={nav.handlePlayerPositionChange}
              onAutoWalkComplete={nav.handleSceneAutoWalkComplete}
              onManualInterrupt={nav.handleSceneManualInterrupt}
              onNearestPoiChange={setNearestPoiId}
              onActivatePoi={openPoiInteraction}
              onWebGLFailure={onWebGLFailure}
            />
          </Suspense>
        ) : (
          <SydneyFallback2D
            avatar={avatar}
            language={language}
            appearance={appearance}
            paused={isPaused}
            visitedPoiIds={visitedPoiIds}
            nearestPoiId={nearestPoiId}
            guidedPoiId={guidedPoiId}
            noticeText={copy.australiaFallback2dNotice}
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
                ? 'border-[#38BDF8]/65 bg-[#0F1A33]/92'
                : 'border-white bg-[#FFFDF8]/95 shadow-[0_14px_34px_rgba(14,165,233,0.18)]'
            }`}
          >
            <p
              className={`font-display text-lg sm:text-xl font-bold ${
                isNight ? 'text-[#38BDF8]' : 'text-[#0284C7]'
              }`}
            >
              {copy.arrivingAustraliaTitle}
            </p>
            <p className={`mt-0.5 text-xs font-medium ${isNight ? 'text-[#E2ECF9]' : 'text-[#48607E]'}`}>
              {copy.arrivingAustraliaSubtitle}
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
                isNight ? 'border-[#38BDF8]/60' : 'border-[#20304A]/15'
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
                allLandmarksExplored
                  ? isNight
                    ? 'text-[#34D399]'
                    : 'text-[#059669]'
                  : isNight
                    ? 'text-[#38BDF8]'
                    : 'text-[#0284C7]'
              }`}
              aria-hidden="true"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-display font-bold leading-tight truncate">
                  {country.countryName[language]} · {country.title[language]}
                </p>
                <span
                  className={`hidden sm:inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-extrabold ${
                    performCompleted
                      ? 'bg-[#F2C66D] text-[#131E31]'
                      : performUnlocked
                        ? 'bg-[#F2C66D]/25 text-[#92400E] dark:text-[#FDE68A]'
                        : practiceUnlocked
                          ? 'bg-[#0EA5E9]/20 text-[#0369A1] dark:text-[#BAE6FD]'
                          : discoverCompleted
                            ? 'bg-[#0EA5E9]/20 text-[#0369A1] dark:text-[#BAE6FD]'
                            : isNight
                              ? 'bg-[#0EA5E9]/25 text-[#BAE6FD]'
                              : 'bg-[#E0F2FE] text-[#0369A1]'
                  }`}
                >
                  {performCompleted
                    ? copy.australiaCompletedStageBadge
                    : performUnlocked
                      ? copy.australiaPerformStageBadge
                      : practiceUnlocked
                        ? copy.australiaPracticeStageBadge
                        : discoverCompleted
                          ? copy.australiaBuildStageBadge
                          : copy.australiaExploreStageBadge}
                </span>
              </div>
              <p className={`text-[11px] leading-tight truncate ${isNight ? 'text-[#CBD5E1]' : 'text-[#48607E]'}`}>
                {performCompleted
                  ? copy.australiaPerformObjectiveCompleted
                  : performUnlocked
                    ? !performStarted
                      ? copy.australiaPerformObjectiveStart
                      : awaitingFinalReflection
                        ? copy.australiaPerformReflectionGateNotice
                        : copy.australiaPerformObjectiveInProgress
                    : practiceUnlocked
                      ? practiceStarted
                        ? copy.australiaPracticeObjectiveInProgress
                        : copy.australiaPracticeObjectiveStart
                      : discoverCompleted
                        ? buildStarted
                          ? copy.australiaBuildObjectiveInProgress
                          : copy.australiaBuildObjectiveStart
                        : !discoverStarted
                          ? copy.australiaObjectiveExplore
                          : copy.australiaObjectiveMeetAllNpcs}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onPlaySfx('click');
              setGuideInitialLandmarkId(undefined);
              setGuideOpen(true);
            }}
            className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-extrabold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isNight
                ? 'border-[#38BDF8]/50 bg-[#0F2942]/90 text-[#E0F2FE] hover:bg-[#16395B]'
                : 'border-[#0284C7]/30 bg-[#E0F2FE]/95 text-[#0369A1] hover:bg-[#BAE6FD]'
            }`}
          >
            <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{copy.australiaCityGuideButton}</span>
            <span className="font-mono-num rounded bg-black/10 px-1.5 py-0.5 text-[10px]">
              {performUnlocked
                ? `${performDisplayCount}/${AUSTRALIA_PERFORM_CHALLENGES.length}`
                : practiceUnlocked
                  ? `${completedPracticeIds.length}/${AUSTRALIA_PRACTICE_MISSIONS.length}`
                  : discoverCompleted
                    ? `${completedBuildIds.length}/${AUSTRALIA_BUILD_MISSIONS.length}`
                    : `${completedDiscoverIds.length}/${AUSTRALIA_DISCOVER_MISSIONS.length}`}
            </span>
          </button>

          {awaitingFinalReflection && (
            <button
              type="button"
              onClick={openPerformReflection}
              className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-[#F2C66D] px-3.5 py-1.5 text-xs font-extrabold text-[#131E31] shadow-md hover:bg-[#f6d388] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Award className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {hasExitedReflectionWithoutSubmit
                  ? copy.australiaPerformResumeReflectionButton
                  : copy.australiaPerformCompleteReflectionButton}
              </span>
            </button>
          )}

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

          <button
            type="button"
            onClick={() => {
              onPlaySfx('click');
              onOpenPassport();
            }}
            className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer ${hudChipClass}`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#0EA5E9]" aria-hidden="true" />
            <span className="font-mono-num">
              {rewards.xp} {copy.xpLabel}
            </span>
            <span className="opacity-50">|</span>
            <span className="font-mono-num">{rewards.stamps.length}/5</span>
          </button>
        </div>

        {/* Right Utility Controls */}
        <div className="pointer-events-auto flex items-center gap-2 shrink-0">
          {guidedPoiId && (
            <button
              type="button"
              onClick={() => {
                onPlaySfx('click');
                setGuidedPoiId(null);
              }}
              className={`hidden md:inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold whitespace-nowrap cursor-pointer ${
                isNight
                  ? 'border-[#FBBF24]/50 bg-[#2C2415]/90 text-[#FDE68A]'
                  : 'border-[#F59E0B]/50 bg-[#FFFBEB]/95 text-[#92400E]'
              }`}
            >
              <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {AUSTRALIA_LANDMARKS.find((l) => l.id === guidedPoiId)?.title[language]}
              </span>
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}

          <button
            type="button"
            onClick={onToggleQuickAppearance}
            aria-label={copy.appearanceLabel}
            className={`inline-flex h-[42px] w-[42px] items-center justify-center rounded-xl border cursor-pointer ${hudChipClass}`}
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
            className={`inline-flex h-[42px] w-[42px] items-center justify-center rounded-xl border cursor-pointer ${
              musicPlaying
                ? 'border-[#0EA5E9] bg-[#0EA5E9] text-white'
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
            className={`inline-flex h-[42px] items-center gap-1.5 rounded-xl border px-3 text-xs font-bold cursor-pointer ${hudChipClass}`}
          >
            <Pause className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{copy.jaipurPauseMenuTitle}</span>
          </button>
        </div>
      </header>

      {/* Stage 4 PERFORM First-Completion Golden Toast Banner */}
      {performCompleteToast && (
        <div
          aria-live="polite"
          className="pointer-events-none absolute inset-x-0 top-20 z-20 flex justify-center px-4"
        >
          <div
            className={`pointer-events-auto flex items-center gap-3 rounded-2xl border px-5 py-3 shadow-2xl ${
              isNight
                ? 'border-[#F2C66D]/75 bg-[#2A2013]/95 text-[#FFFBEB]'
                : 'border-[#F59E0B] bg-[#FFFBEB] text-[#78350F]'
            }`}
          >
            <Award className="h-5 w-5 shrink-0 text-[#F59E0B]" aria-hidden="true" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-sm sm:text-base font-extrabold">
                  {copy.australiaPerformGoldenToastTitle}
                </p>
                {!performCompleteToast.xpEarned && (
                  <span className="rounded-lg bg-[#2ED6A3]/25 px-2 py-0.5 text-[11px] font-extrabold text-[#064E3B] dark:text-[#2ED6A3]">
                    {copy.replayNoExtraXpLabel}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium opacity-90">
                {performCompleteToast.xpEarned
                  ? copy.australiaPerformGoldenToastBody
                  : copy.australiaPerformCelebrationReplaySubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPerformCompleteToast(null)}
              aria-label={copy.closeSettings}
              className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg border border-black/15 bg-black/5 hover:bg-black/10 cursor-pointer"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

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
            performUnlocked
              ? completedPerformIds
              : practiceUnlocked
                ? completedPracticeIds
                : discoverCompleted
                  ? completedBuildIds
                  : completedDiscoverIds
          }
          visitedIds={visitedPoiIds}
          quickTravelFlashActive={nav.quickTravelFlashActive}
          onGoToNextMission={() => nav.goToNextMission('auto_walk')}
          onStartAutoWalk={(targetId) => nav.startAutoWalk(targetId)}
          onQuickTravel={(targetId) => nav.triggerQuickTravel(targetId)}
          onCancelWalk={(reason) => nav.cancelNavigation(reason)}
          onGuideOnly={(targetId) => {
            if (AUSTRALIA_LANDMARKS.some((l) => l.id === targetId)) {
              setGuidedPoiId(targetId as AustraliaLandmarkId);
              nav.setActiveDestinationId(targetId);
            }
          }}
          accentTone="teal"
        />
      )}

      {/* Bottom Floating Interaction Bar & Controls Hint */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex flex-col items-center gap-2 px-4">
        {nearestTarget && !activeModalPoiId && !pauseMenuOpen && !guideOpen && (
          <button
            type="button"
            onClick={() => openPoiInteraction(nearestTarget.id)}
            className="pointer-events-auto inline-flex min-h-[46px] items-center gap-2.5 rounded-2xl border border-white/40 bg-[#0EA5E9] px-5 py-2.5 font-display text-sm font-extrabold text-white shadow-xl hover:bg-[#0284C7] active:scale-[0.98] transition-all cursor-pointer"
          >
            {nearestTarget.kind === 'npc' ? (
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span>{nearestTarget.title[language]}</span>
            <span className="rounded-lg bg-black/20 px-2 py-0.5 text-[11px] font-bold">
              {copy.jaipurInteractPromptPrefix}
            </span>
          </button>
        )}

        <div
          className={`rounded-xl border px-3.5 py-1.5 text-[11px] font-semibold shadow-sm ${
            isNight
              ? 'border-white/15 bg-[#0F1A33]/82 text-[#CBD5E1]'
              : 'border-white bg-[#FFFDF8]/88 text-[#334155]'
          }`}
        >
          {copy.australiaControlsHint}
        </div>
      </div>

      {/* Touch Virtual Joystick (Mobile / Coarser Pointer) */}
      {showTouchPad && !isPaused && viewMode === '3d' && webglSupported && (
        <div className="absolute bottom-6 left-6 z-20">
          <VirtualJoystick
            onVectorChange={handleJoystickChange}
            isNight={isNight}
            label={copy.jaipurMoveHint}
          />
        </div>
      )}

      {/* NPC Dialogue Modal */}
      {activeNpcEntry && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="australia-npc-dialog-title"
          className={`fixed inset-x-0 bottom-0 z-30 flex justify-center p-3 sm:p-6 ${
            isNight ? 'bg-[#081229]/45' : 'bg-[#0F2942]/18'
          }`}
        >
          <div
            className={`w-full max-w-2xl rounded-3xl border p-5 sm:p-6 shadow-2xl ${
              isNight
                ? 'border-[#38BDF8]/55 bg-[#0F1A33] text-[#F8FAFC]'
                : 'border-[#BAE6FD] bg-[#FFFDF8] text-[#1E2E46]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <AustraliaNpcPortraitSVG
                  npcId={activeNpcEntry.id}
                  className="h-16 w-16 shrink-0 rounded-2xl shadow-md"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold text-[#0EA5E9]">
                    {activeNpcEntry.role[language]} · {activeNpcEntry.locationName[language]}
                  </p>
                  <h2
                    id="australia-npc-dialog-title"
                    className="font-display text-lg sm:text-xl font-extrabold truncate"
                  >
                    {activeNpcEntry.name}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    speakEnglish(
                      npcDialogueStep === 0
                        ? activeNpcEntry.greetingQuote.en
                        : activeNpcEntry.followUpTip.en,
                      activeNpcEntry.voiceRate,
                      activeNpcEntry.voicePitch,
                    )
                  }
                  className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold whitespace-nowrap cursor-pointer ${
                    isNight
                      ? 'border-white/15 bg-white/10 text-white hover:bg-white/20'
                      : 'border-[#BAE6FD] bg-[#F0F9FF] text-[#0369A1] hover:bg-[#E0F2FE]'
                  }`}
                >
                  <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.australiaListenDialogue}</span>
                </button>

                <button
                  type="button"
                  onClick={closeActiveModal}
                  aria-label={copy.closeSettings}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border cursor-pointer ${
                    isNight
                      ? 'border-white/15 bg-white/10 text-white hover:bg-white/20'
                      : 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div
              className={`mt-4 rounded-2xl border p-4 text-sm sm:text-base leading-relaxed font-medium ${
                isNight
                  ? 'border-white/10 bg-[#152344] text-[#F1F5F9]'
                  : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#1E2E46]'
              }`}
            >
              {activeNpcEntry.id === 'npc_olivia' && npcDialogueStep === 1
                ? performUnlocked
                  ? AUSTRALIA_OLIVIA_PERFORM_WELCOME[language]
                  : practiceUnlocked
                    ? AUSTRALIA_OLIVIA_PRACTICE_WELCOME[language]
                    : buildUnlocked
                      ? AUSTRALIA_OLIVIA_BUILD_WELCOME[language]
                      : AUSTRALIA_OLIVIA_DISCOVER_WELCOME[language]
                : npcDialogueStep === 0
                  ? activeNpcEntry.greetingQuote[language]
                  : activeNpcEntry.followUpTip[language]}
            </div>

            {/* Associated Stage 4 PERFORM / Stage 3 PRACTICE / Stage 2 BUILD / Stage 1 DISCOVER Launcher */}
            {(() => {
              const linkedLandmarkId = NPC_PRIMARY_LANDMARK_MAP[activeNpcEntry.id];
              const effectiveDiscoverId =
                activeNpcEntry.id === 'npc_olivia' &&
                discoverStarted &&
                nextDiscoverLandmarkId === 'harbour_gardens_help_point'
                  ? 'harbour_gardens_help_point'
                  : linkedLandmarkId;
              const effectiveBuildId =
                activeNpcEntry.id === 'npc_olivia' &&
                buildStarted &&
                nextBuildLandmarkId === 'harbour_gardens_help_point'
                  ? 'harbour_gardens_help_point'
                  : linkedLandmarkId;
              const effectivePracticeId =
                activeNpcEntry.id === 'npc_olivia' &&
                practiceStarted &&
                nextPracticeLandmarkId === 'harbour_gardens_help_point'
                  ? 'harbour_gardens_help_point'
                  : linkedLandmarkId;
              const effectivePerformId =
                activeNpcEntry.id === 'npc_olivia' &&
                performStarted &&
                nextPerformLandmarkId === 'harbour_gardens_help_point'
                  ? 'harbour_gardens_help_point'
                  : linkedLandmarkId;

              if (performUnlocked) {
                const performSpec =
                  getAustraliaPerformChallengeSpec(effectivePerformId) ??
                  AUSTRALIA_PERFORM_CHALLENGES[0];
                const performDone =
                  performStarted && completedPerformIds.includes(effectivePerformId);
                const performEligible =
                  performStarted && nextPerformLandmarkId === effectivePerformId;
                const performPrevIdx =
                  AUSTRALIA_PERFORM_CHALLENGE_ORDER.indexOf(effectivePerformId) - 1;
                const requiredPrevPerform =
                  performPrevIdx >= 0
                    ? getAustraliaPerformChallengeSpec(
                        AUSTRALIA_PERFORM_CHALLENGE_ORDER[performPrevIdx],
                      )
                    : null;
                const readyForFinalReflection =
                  performStarted &&
                  completedPerformIds.length >= AUSTRALIA_PERFORM_CHALLENGES.length &&
                  !performCompleted;

                return (
                  <div
                    className={`mt-3 rounded-2xl border p-3.5 flex flex-wrap items-center justify-between gap-2.5 ${
                      isNight ? 'border-[#F2C66D]/35 bg-[#1B233C]' : 'border-[#FCD34D] bg-[#FFFBEB]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-extrabold text-[#D97706] dark:text-[#FBBF24]">
                        {performSpec.title[language]} · {performSpec.turns.length} turns
                      </p>
                      <p className={`mt-0.5 text-xs ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                        {!performStarted
                          ? activeNpcEntry.id === 'npc_olivia'
                            ? AUSTRALIA_OLIVIA_PERFORM_WELCOME[language]
                            : copy.australiaPerformLockedNeedOlivia
                          : performCompleted && activeNpcEntry.id === 'npc_olivia'
                            ? copy.australiaPerformObjectiveCompleted
                            : readyForFinalReflection && activeNpcEntry.id === 'npc_olivia'
                              ? copy.australiaPerformReflectionGateNotice
                              : performDone
                                ? copy.australiaPerformCompletedBadge
                                : performEligible
                                  ? performSpec.communicationGoal[language]
                                  : `${copy.australiaPerformLockedPrevious} ${requiredPrevPerform?.title[language] ?? ''}`}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {!performStarted && activeNpcEntry.id === 'npc_olivia' ? (
                        <button
                          type="button"
                          onClick={() => {
                            onPlaySfx('reward');
                            onStartPerform();
                            speakEnglish(
                              AUSTRALIA_OLIVIA_PERFORM_WELCOME.en,
                              activeNpcEntry.voiceRate,
                              activeNpcEntry.voicePitch,
                            );
                          }}
                          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#F2C66D] px-4 py-2 text-xs font-extrabold text-[#131E31] hover:bg-[#f6d388] cursor-pointer whitespace-nowrap"
                        >
                          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{copy.australiaPerformStartButton}</span>
                        </button>
                      ) : performCompleted && activeNpcEntry.id === 'npc_olivia' ? (
                        <button
                          type="button"
                          onClick={openPerformCelebration}
                          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#F2C66D] px-4 py-2 text-xs font-extrabold text-[#131E31] hover:bg-[#f6d388] cursor-pointer whitespace-nowrap"
                        >
                          <Award className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{copy.australiaPerformViewCelebrationButton}</span>
                        </button>
                      ) : readyForFinalReflection && activeNpcEntry.id === 'npc_olivia' ? (
                        <button
                          type="button"
                          onClick={openPerformReflection}
                          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#F2C66D] px-4 py-2 text-xs font-extrabold text-[#131E31] hover:bg-[#f6d388] cursor-pointer whitespace-nowrap"
                        >
                          <Award className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            {hasExitedReflectionWithoutSubmit
                              ? copy.australiaPerformResumeReflectionButton
                              : copy.australiaPerformCompleteReflectionButton}
                          </span>
                        </button>
                      ) : performEligible || performDone ? (
                        <button
                          type="button"
                          onClick={() => launchPerformChallenge(effectivePerformId)}
                          className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                            performDone
                              ? isNight
                                ? 'border border-[#10B981]/50 bg-[#0D2B24] text-[#A7F3D0]'
                                : 'border border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]'
                              : 'bg-[#F2C66D] text-[#131E31] hover:bg-[#f6d388]'
                          }`}
                        >
                          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            {performDone
                              ? copy.australiaPerformReviewChallengeButton
                              : copy.australiaPerformPlayChallengeButton}
                          </span>
                        </button>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => launchPracticeMission(effectivePracticeId)}
                        className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold whitespace-nowrap cursor-pointer ${
                          isNight
                            ? 'border-white/15 bg-white/8 text-[#CBD5E1] hover:bg-white/15'
                            : 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <span>{copy.australiaPracticeReviewMissionButton}</span>
                      </button>
                    </div>
                  </div>
                );
              }

              if (practiceUnlocked) {
                const practiceSpec =
                  getAustraliaPracticeMissionSpec(effectivePracticeId) ??
                  AUSTRALIA_PRACTICE_MISSIONS[0];
                const practiceDone =
                  practiceStarted && completedPracticeIds.includes(effectivePracticeId);
                const practiceEligible =
                  practiceStarted && nextPracticeLandmarkId === effectivePracticeId;
                const practicePrevIdx =
                  AUSTRALIA_PRACTICE_MISSION_ORDER.indexOf(effectivePracticeId) - 1;
                const requiredPrevPractice =
                  practicePrevIdx >= 0
                    ? getAustraliaPracticeMissionSpec(
                        AUSTRALIA_PRACTICE_MISSION_ORDER[practicePrevIdx],
                      )
                    : null;

                return (
                  <div
                    className={`mt-3 rounded-2xl border p-3.5 flex flex-wrap items-center justify-between gap-2.5 ${
                      isNight ? 'border-[#38BDF8]/30 bg-[#10203E]' : 'border-[#BAE6FD] bg-[#F0F9FF]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-extrabold text-[#0284C7] dark:text-[#38BDF8]">
                        {practiceSpec.title[language]} · {practiceSpec.turns.length} turns
                      </p>
                      <p className={`mt-0.5 text-xs ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                        {!practiceStarted
                          ? activeNpcEntry.id === 'npc_olivia'
                            ? AUSTRALIA_OLIVIA_PRACTICE_WELCOME[language]
                            : copy.australiaPracticeLockedNeedOlivia
                          : practiceDone
                            ? copy.australiaPracticeCompletedBadge
                            : practiceEligible
                              ? practiceSpec.goal[language]
                              : `${copy.australiaPracticeLockedPrevious} ${requiredPrevPractice?.title[language] ?? ''}`}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {!practiceStarted && activeNpcEntry.id === 'npc_olivia' ? (
                        <button
                          type="button"
                          onClick={() => {
                            onPlaySfx('reward');
                            onStartPractice();
                            speakEnglish(
                              AUSTRALIA_OLIVIA_PRACTICE_WELCOME.en,
                              activeNpcEntry.voiceRate,
                              activeNpcEntry.voicePitch,
                            );
                          }}
                          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#0284C7] cursor-pointer whitespace-nowrap"
                        >
                          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{copy.australiaPracticeStartButton}</span>
                        </button>
                      ) : practiceEligible || practiceDone ? (
                        <button
                          type="button"
                          onClick={() => launchPracticeMission(effectivePracticeId)}
                          className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                            practiceDone
                              ? isNight
                                ? 'border border-[#10B981]/50 bg-[#0D2B24] text-[#A7F3D0]'
                                : 'border border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]'
                              : 'bg-[#0EA5E9] text-white hover:bg-[#0284C7]'
                          }`}
                        >
                          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            {practiceDone
                              ? copy.australiaPracticeReviewMissionButton
                              : copy.australiaPracticePlayMissionButton}
                          </span>
                        </button>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => launchBuildMiniGame(effectiveBuildId)}
                        className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold whitespace-nowrap cursor-pointer ${
                          isNight
                            ? 'border-white/15 bg-white/8 text-[#CBD5E1] hover:bg-white/15'
                            : 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <span>{copy.australiaPracticeReviewBuildToggle}</span>
                      </button>
                    </div>
                  </div>
                );
              }

              if (buildUnlocked) {
                const buildMeta = getAustraliaBuildMissionMeta(effectiveBuildId);
                const buildDone = buildStarted && completedBuildIds.includes(effectiveBuildId);
                const buildEligible = buildStarted && nextBuildLandmarkId === effectiveBuildId;
                const buildPrevIdx = AUSTRALIA_BUILD_MISSION_ORDER.indexOf(effectiveBuildId) - 1;
                const requiredPrevBuild =
                  buildPrevIdx >= 0
                    ? getAustraliaBuildMissionMeta(AUSTRALIA_BUILD_MISSION_ORDER[buildPrevIdx])
                    : null;

                return (
                  <div
                    className={`mt-3 rounded-2xl border p-3.5 flex flex-wrap items-center justify-between gap-2.5 ${
                      isNight ? 'border-[#38BDF8]/30 bg-[#10203E]' : 'border-[#BAE6FD] bg-[#F0F9FF]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-extrabold text-[#0284C7] dark:text-[#38BDF8]">
                        {buildMeta.title[language]} · {buildMeta.mechanicLabel[language]}
                      </p>
                      <p className={`mt-0.5 text-xs ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                        {!buildStarted
                          ? activeNpcEntry.id === 'npc_olivia'
                            ? AUSTRALIA_OLIVIA_BUILD_WELCOME[language]
                            : copy.australiaBuildLockedNeedOlivia
                          : buildDone
                            ? copy.australiaBuildCompletedBadge
                            : buildEligible
                              ? buildMeta.introLine[language]
                              : `${copy.australiaBuildLockedPrevious} ${requiredPrevBuild?.title[language] ?? ''}`}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {!buildStarted && activeNpcEntry.id === 'npc_olivia' ? (
                        <button
                          type="button"
                          onClick={() => {
                            onPlaySfx('reward');
                            onStartBuild();
                            speakEnglish(
                              AUSTRALIA_OLIVIA_BUILD_WELCOME.en,
                              activeNpcEntry.voiceRate,
                              activeNpcEntry.voicePitch,
                            );
                          }}
                          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#0284C7] cursor-pointer whitespace-nowrap"
                        >
                          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{copy.australiaBuildStartButton}</span>
                        </button>
                      ) : (buildEligible || buildDone) ? (
                        <button
                          type="button"
                          onClick={() => launchBuildMiniGame(effectiveBuildId)}
                          className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                            buildDone
                              ? isNight
                                ? 'border border-[#10B981]/50 bg-[#0D2B24] text-[#A7F3D0]'
                                : 'border border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]'
                              : 'bg-[#0EA5E9] text-white hover:bg-[#0284C7]'
                          }`}
                        >
                          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            {buildDone
                              ? copy.australiaBuildReviewMissionButton
                              : copy.australiaBuildPlayMissionButton}
                          </span>
                        </button>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => launchDiscoverMiniGame(effectiveDiscoverId)}
                        className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold whitespace-nowrap cursor-pointer ${
                          isNight
                            ? 'border-white/15 bg-white/8 text-[#CBD5E1] hover:bg-white/15'
                            : 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <span>{copy.australiaBuildReviewDiscoverToggle}</span>
                      </button>
                    </div>
                  </div>
                );
              }

              const missionMeta = getAustraliaDiscoverMissionMeta(effectiveDiscoverId);
              const missionDone =
                discoverStarted && completedDiscoverIds.includes(effectiveDiscoverId);
              const missionEligible =
                discoverStarted && nextDiscoverLandmarkId === effectiveDiscoverId;
              const prevIdx = AUSTRALIA_DISCOVER_MISSION_ORDER.indexOf(effectiveDiscoverId) - 1;
              const requiredPrev =
                prevIdx >= 0
                  ? getAustraliaDiscoverMissionMeta(AUSTRALIA_DISCOVER_MISSION_ORDER[prevIdx])
                  : null;

              return (
                <div
                  className={`mt-3 rounded-2xl border p-3.5 flex flex-wrap items-center justify-between gap-2.5 ${
                    isNight ? 'border-[#38BDF8]/30 bg-[#10203E]' : 'border-[#BAE6FD] bg-[#F0F9FF]'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold text-[#0284C7] dark:text-[#38BDF8]">
                      {missionMeta.title[language]} · {missionMeta.mechanicLabel[language]}
                    </p>
                    <p className={`mt-0.5 text-xs ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                      {!discoverStarted
                        ? activeNpcEntry.id === 'npc_olivia'
                          ? AUSTRALIA_OLIVIA_DISCOVER_WELCOME[language]
                          : copy.australiaDiscoverLockedNeedOlivia
                        : missionDone
                          ? copy.australiaDiscoverCompletedBadge
                          : missionEligible
                            ? missionMeta.introLine[language]
                            : `${copy.australiaDiscoverLockedPrevious} ${requiredPrev?.title[language] ?? ''}`}
                    </p>
                  </div>

                  {!discoverStarted && activeNpcEntry.id === 'npc_olivia' ? (
                    <button
                      type="button"
                      onClick={() => {
                        onPlaySfx('reward');
                        onStartDiscovery();
                      }}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#10B981] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#059669] cursor-pointer whitespace-nowrap"
                    >
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{copy.australiaDiscoverStartButton}</span>
                    </button>
                  ) : (missionEligible || missionDone) ? (
                    <button
                      type="button"
                      onClick={() => launchDiscoverMiniGame(effectiveDiscoverId)}
                      className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                        missionDone
                          ? isNight
                            ? 'border border-[#10B981]/50 bg-[#0D2B24] text-[#A7F3D0]'
                            : 'border border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]'
                          : 'bg-[#10B981] text-white hover:bg-[#059669]'
                      }`}
                    >
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {missionDone
                          ? copy.australiaDiscoverReviewMissionButton
                          : copy.australiaDiscoverPlayMissionButton}
                      </span>
                    </button>
                  ) : null}
                </div>
              );
            })()}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              {npcDialogueStep === 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('select');
                    setNpcDialogueStep(1);
                  }}
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#0284C7] cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.australiaNextTipButton}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('click');
                    closeActiveModal();
                    setGuideInitialLandmarkId(undefined);
                    setGuideOpen(true);
                  }}
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#0284C7] cursor-pointer"
                >
                  <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.australiaCityGuideButton}</span>
                </button>
              )}

              <button
                type="button"
                onClick={closeActiveModal}
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-[#F2C66D] px-5 py-2 text-xs font-extrabold text-[#131E31] hover:bg-[#f6d388] cursor-pointer"
              >
                <span>{copy.australiaCloseDialogButton}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Landmark Exploration Modal (Phase 4A Discovery Preview Only, +0 XP) */}
      {activeLandmark && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="australia-landmark-modal-title"
          className={`fixed inset-0 z-30 flex items-center justify-center p-4 ${
            isNight ? 'bg-[#081229]/72' : 'bg-[#0F2942]/32'
          }`}
        >
          <div
            className={`w-full max-w-xl rounded-3xl border p-5 sm:p-6 shadow-2xl ${
              isNight
                ? 'border-[#38BDF8]/55 bg-[#0F1A33] text-[#F8FAFC]'
                : 'border-[#BAE6FD] bg-[#FFFDF8] text-[#1E2E46]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <AustraliaLandmarkBadgeSVG
                  landmarkId={activeLandmark.id}
                  className="h-16 w-24 shrink-0 rounded-xl shadow-sm"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold text-[#0EA5E9]">
                    {copy.australiaLandmarkPreviewBadge} · {activeLandmark.districtBadge[language]}
                  </p>
                  <h2
                    id="australia-landmark-modal-title"
                    className="font-display text-lg sm:text-xl font-extrabold leading-tight"
                  >
                    {activeLandmark.title[language]}
                  </h2>
                  <p className={`text-xs ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                    {activeLandmark.subtitle[language]}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeActiveModal}
                aria-label={copy.closeSettings}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border cursor-pointer ${
                  isNight
                    ? 'border-white/15 bg-white/10 text-white hover:bg-white/20'
                    : 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F1F5F9]'
                }`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <p className={`text-sm leading-relaxed ${isNight ? 'text-[#E2E8F0]' : 'text-[#334155]'}`}>
                {activeLandmark.description[language]}
              </p>

              <div
                className={`rounded-2xl border p-3.5 ${
                  isNight ? 'border-[#38BDF8]/30 bg-[#152344]' : 'border-[#BAE6FD] bg-[#F0F9FF]'
                }`}
              >
                <p className="text-[11px] font-extrabold text-[#0EA5E9]">
                  {copy.australiaCityGuideLanguageFocusLabel}
                </p>
                <p className="mt-1 text-sm font-bold">{activeLandmark.languageFocus[language]}</p>
                <p className={`mt-1 text-xs ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                  {activeLandmark.interactionSpark[language]}
                </p>
              </div>

              {activeLandmark.id === 'harbour_gardens_help_point' && (
                <div
                  className={`rounded-2xl border p-3.5 ${
                    isNight ? 'border-[#10B981]/35 bg-[#0F2A24]' : 'border-[#A7F3D0] bg-[#ECFDF5]'
                  }`}
                >
                  <p className="text-[11px] font-extrabold text-[#10B981]">
                    Olivia Parker · Sydney Explorer Guide
                  </p>
                  <p className="mt-1 text-xs leading-relaxed">
                    {AUSTRALIA_NPC_DIALOGUES.npc_olivia.harbourGardensHelperNote?.[language]}
                  </p>
                </div>
              )}

              {(() => {
                if (performUnlocked) {
                  const performSpec =
                    getAustraliaPerformChallengeSpec(activeLandmark.id) ??
                    AUSTRALIA_PERFORM_CHALLENGES[0];
                  const performDone =
                    performStarted && completedPerformIds.includes(activeLandmark.id);
                  const performEligible =
                    performStarted && nextPerformLandmarkId === activeLandmark.id;
                  const performPrevIdx =
                    AUSTRALIA_PERFORM_CHALLENGE_ORDER.indexOf(activeLandmark.id) - 1;
                  const requiredPrevPerform =
                    performPrevIdx >= 0
                      ? getAustraliaPerformChallengeSpec(
                          AUSTRALIA_PERFORM_CHALLENGE_ORDER[performPrevIdx],
                        )
                      : null;
                  const savedPerformRecord = performEvidence[activeLandmark.id];

                  return (
                    <div
                      className={`rounded-2xl border p-3.5 space-y-2 ${
                        performDone
                          ? isNight
                            ? 'border-[#10B981]/40 bg-[#0F2622]'
                            : 'border-[#A7F3D0] bg-[#ECFDF5]'
                          : isNight
                            ? 'border-[#F2C66D]/35 bg-[#1B233C]'
                            : 'border-[#FCD34D] bg-[#FFFBEB]'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-extrabold text-[#D97706] dark:text-[#FBBF24]">
                            {performSpec.title[language]} · {performSpec.turns.length} turns
                          </p>
                          <p className={`mt-0.5 text-xs ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                            {!performStarted
                              ? copy.australiaPerformLockedNeedOlivia
                              : performDone && savedPerformRecord
                                ? savedPerformRecord.practiceMode === 'microphone_recording'
                                  ? copy.australiaPracticeEvidenceBadgeMic
                                  : copy.australiaPracticeEvidenceBadgeNoMic
                                : performEligible
                                  ? performSpec.communicationGoal[language]
                                  : `${copy.australiaPerformLockedPrevious} ${requiredPrevPerform?.title[language] ?? ''}`}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {!performStarted ? (
                            <button
                              type="button"
                              onClick={() => {
                                onPlaySfx('reward');
                                onStartPerform();
                              }}
                              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#F2C66D] px-3.5 py-1.5 text-xs font-extrabold text-[#131E31] hover:bg-[#f6d388] cursor-pointer whitespace-nowrap"
                            >
                              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>{copy.australiaPerformStartButton}</span>
                            </button>
                          ) : performEligible || performDone ? (
                            <button
                              type="button"
                              onClick={() => launchPerformChallenge(activeLandmark.id)}
                              className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-extrabold cursor-pointer whitespace-nowrap ${
                                performDone
                                  ? 'bg-[#059669] text-white hover:bg-[#047857]'
                                  : 'bg-[#F2C66D] text-[#131E31] hover:bg-[#f6d388]'
                              }`}
                            >
                              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>
                                {performDone
                                  ? copy.australiaPerformReviewChallengeButton
                                  : copy.australiaPerformPlayChallengeButton}
                              </span>
                            </button>
                          ) : null}

                          <button
                            type="button"
                            onClick={() => launchPracticeMission(activeLandmark.id)}
                            className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer whitespace-nowrap ${
                              isNight
                                ? 'border-white/15 bg-white/10 text-[#CBD5E1] hover:bg-white/20'
                                : 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]'
                            }`}
                          >
                            <span>{copy.australiaPracticeReviewMissionButton}</span>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-semibold opacity-85">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>
                          {performCompleted
                            ? copy.australiaPerformObjectiveCompleted
                            : copy.australiaPerformGuideSectionDesc}
                        </span>
                      </div>
                    </div>
                  );
                }

                if (practiceUnlocked) {
                  const practiceSpec =
                    getAustraliaPracticeMissionSpec(activeLandmark.id) ??
                    AUSTRALIA_PRACTICE_MISSIONS[0];
                  const practiceDone =
                    practiceStarted && completedPracticeIds.includes(activeLandmark.id);
                  const practiceEligible =
                    practiceStarted && nextPracticeLandmarkId === activeLandmark.id;
                  const practicePrevIdx =
                    AUSTRALIA_PRACTICE_MISSION_ORDER.indexOf(activeLandmark.id) - 1;
                  const requiredPrevPractice =
                    practicePrevIdx >= 0
                      ? getAustraliaPracticeMissionSpec(
                          AUSTRALIA_PRACTICE_MISSION_ORDER[practicePrevIdx],
                        )
                      : null;
                  const savedEvidence = practiceEvidence[activeLandmark.id];

                  return (
                    <div
                      className={`rounded-2xl border p-3.5 space-y-2 ${
                        practiceDone
                          ? isNight
                            ? 'border-[#10B981]/40 bg-[#0F2622]'
                            : 'border-[#A7F3D0] bg-[#ECFDF5]'
                          : isNight
                            ? 'border-[#38BDF8]/35 bg-[#12203E]'
                            : 'border-[#BAE6FD] bg-[#F0F9FF]'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-extrabold text-[#0284C7] dark:text-[#38BDF8]">
                            {practiceSpec.title[language]} · {practiceSpec.turns.length} turns
                          </p>
                          <p className={`mt-0.5 text-xs ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                            {!practiceStarted
                              ? copy.australiaPracticeLockedNeedOlivia
                              : practiceDone && savedEvidence
                                ? savedEvidence.practiceMode === 'microphone_recording'
                                  ? copy.australiaPracticeEvidenceBadgeMic
                                  : copy.australiaPracticeEvidenceBadgeNoMic
                                : practiceEligible
                                  ? practiceSpec.goal[language]
                                  : `${copy.australiaPracticeLockedPrevious} ${requiredPrevPractice?.title[language] ?? ''}`}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {!practiceStarted ? (
                            <button
                              type="button"
                              onClick={() => {
                                onPlaySfx('reward');
                                onStartPractice();
                              }}
                              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-3.5 py-1.5 text-xs font-extrabold text-white hover:bg-[#0284C7] cursor-pointer whitespace-nowrap"
                            >
                              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>{copy.australiaPracticeStartButton}</span>
                            </button>
                          ) : practiceEligible || practiceDone ? (
                            <button
                              type="button"
                              onClick={() => launchPracticeMission(activeLandmark.id)}
                              className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-extrabold cursor-pointer whitespace-nowrap ${
                                practiceDone
                                  ? 'bg-[#059669] text-white hover:bg-[#047857]'
                                  : 'bg-[#0EA5E9] text-white hover:bg-[#0284C7]'
                              }`}
                            >
                              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>
                                {practiceDone
                                  ? copy.australiaPracticeReviewMissionButton
                                  : copy.australiaPracticePlayMissionButton}
                              </span>
                            </button>
                          ) : null}

                          <button
                            type="button"
                            onClick={() => launchBuildMiniGame(activeLandmark.id)}
                            className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer whitespace-nowrap ${
                              isNight
                                ? 'border-white/15 bg-white/10 text-[#CBD5E1] hover:bg-white/20'
                                : 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]'
                            }`}
                          >
                            <span>{copy.australiaPracticeReviewBuildToggle}</span>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-semibold opacity-85">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>
                          {practiceCompleted
                            ? copy.australiaPracticePerformUnlockedNote
                            : copy.australiaPracticeXpRewardOnceNote}
                        </span>
                      </div>
                    </div>
                  );
                }

                if (buildUnlocked) {
                  const buildMeta = getAustraliaBuildMissionMeta(activeLandmark.id);
                  const buildDone = buildStarted && completedBuildIds.includes(activeLandmark.id);
                  const buildEligible = buildStarted && nextBuildLandmarkId === activeLandmark.id;
                  const buildPrevIdx = AUSTRALIA_BUILD_MISSION_ORDER.indexOf(activeLandmark.id) - 1;
                  const requiredPrevBuild =
                    buildPrevIdx >= 0
                      ? getAustraliaBuildMissionMeta(AUSTRALIA_BUILD_MISSION_ORDER[buildPrevIdx])
                      : null;
                  const savedBuildLine = builtDialogues[activeLandmark.id];

                  return (
                    <div
                      className={`rounded-2xl border p-3.5 space-y-2 ${
                        buildDone
                          ? isNight
                            ? 'border-[#10B981]/40 bg-[#0F2622]'
                            : 'border-[#A7F3D0] bg-[#ECFDF5]'
                          : isNight
                            ? 'border-[#38BDF8]/35 bg-[#12203E]'
                            : 'border-[#BAE6FD] bg-[#F0F9FF]'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-extrabold text-[#0284C7] dark:text-[#38BDF8]">
                            {buildMeta.title[language]} · {buildMeta.mechanicLabel[language]}
                          </p>
                          <p className={`mt-0.5 text-xs ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                            {!buildStarted
                              ? copy.australiaBuildLockedNeedOlivia
                              : buildDone && savedBuildLine
                                ? `${copy.australiaBuildSavedDialogueLabel}: “${savedBuildLine}”`
                                : buildEligible
                                  ? buildMeta.introLine[language]
                                  : `${copy.australiaBuildLockedPrevious} ${requiredPrevBuild?.title[language] ?? ''}`}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {!buildStarted ? (
                            <button
                              type="button"
                              onClick={() => {
                                onPlaySfx('reward');
                                onStartBuild();
                              }}
                              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-3.5 py-1.5 text-xs font-extrabold text-white hover:bg-[#0284C7] cursor-pointer whitespace-nowrap"
                            >
                              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>{copy.australiaBuildStartButton}</span>
                            </button>
                          ) : (buildEligible || buildDone) ? (
                            <button
                              type="button"
                              onClick={() => launchBuildMiniGame(activeLandmark.id)}
                              className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-extrabold cursor-pointer whitespace-nowrap ${
                                buildDone
                                  ? 'bg-[#059669] text-white hover:bg-[#047857]'
                                  : 'bg-[#0EA5E9] text-white hover:bg-[#0284C7]'
                              }`}
                            >
                              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>
                                {buildDone
                                  ? copy.australiaBuildReviewMissionButton
                                  : copy.australiaBuildPlayMissionButton}
                              </span>
                            </button>
                          ) : null}

                          <button
                            type="button"
                            onClick={() => launchDiscoverMiniGame(activeLandmark.id)}
                            className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer whitespace-nowrap ${
                              isNight
                                ? 'border-white/15 bg-white/10 text-[#CBD5E1] hover:bg-white/20'
                                : 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]'
                            }`}
                          >
                            <span>{copy.australiaBuildReviewDiscoverToggle}</span>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-semibold opacity-85">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>
                          {buildCompleted
                            ? copy.australiaBuildPracticeUnlockedNote
                            : copy.australiaBuildXpRewardOnceNote}
                        </span>
                      </div>
                    </div>
                  );
                }

                const missionMeta = getAustraliaDiscoverMissionMeta(activeLandmark.id);
                const missionDone =
                  discoverStarted && completedDiscoverIds.includes(activeLandmark.id);
                const missionEligible =
                  discoverStarted && nextDiscoverLandmarkId === activeLandmark.id;
                const prevIdx = AUSTRALIA_DISCOVER_MISSION_ORDER.indexOf(activeLandmark.id) - 1;
                const requiredPrev =
                  prevIdx >= 0
                    ? getAustraliaDiscoverMissionMeta(AUSTRALIA_DISCOVER_MISSION_ORDER[prevIdx])
                    : null;

                return (
                  <div
                    className={`rounded-2xl border p-3.5 space-y-2 ${
                      missionDone
                        ? isNight
                          ? 'border-[#10B981]/40 bg-[#0F2622]'
                          : 'border-[#A7F3D0] bg-[#ECFDF5]'
                        : isNight
                          ? 'border-[#38BDF8]/35 bg-[#12203E]'
                          : 'border-[#BAE6FD] bg-[#F0F9FF]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-extrabold text-[#0284C7] dark:text-[#38BDF8]">
                          {missionMeta.title[language]} · {missionMeta.mechanicLabel[language]}
                        </p>
                        <p className={`mt-0.5 text-xs ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                          {!discoverStarted
                            ? copy.australiaDiscoverLockedNeedOlivia
                            : missionDone
                              ? missionMeta.secretUnlocked[language]
                              : missionEligible
                                ? missionMeta.introLine[language]
                                : `${copy.australiaDiscoverLockedPrevious} ${requiredPrev?.title[language] ?? ''}`}
                        </p>
                      </div>

                      {!discoverStarted ? (
                        <button
                          type="button"
                          onClick={() => {
                            onPlaySfx('reward');
                            onStartDiscovery();
                          }}
                          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-3.5 py-1.5 text-xs font-extrabold text-white hover:bg-[#0284C7] cursor-pointer whitespace-nowrap"
                        >
                          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{copy.australiaDiscoverStartButton}</span>
                        </button>
                      ) : (missionEligible || missionDone) ? (
                        <button
                          type="button"
                          onClick={() => launchDiscoverMiniGame(activeLandmark.id)}
                          className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-extrabold cursor-pointer whitespace-nowrap ${
                            missionDone
                              ? 'bg-[#059669] text-white hover:bg-[#047857]'
                              : 'bg-[#10B981] text-white hover:bg-[#059669]'
                          }`}
                        >
                          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            {missionDone
                              ? copy.australiaDiscoverReviewMissionButton
                              : copy.australiaDiscoverPlayMissionButton}
                          </span>
                        </button>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold opacity-85">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{copy.australiaLandmarkPhase4BNote}</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() =>
                  speakEnglish(
                    `${activeLandmark.title.en}. ${activeLandmark.description.en}`,
                  )
                }
                className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold cursor-pointer ${
                  isNight
                    ? 'border-white/15 bg-white/10 text-white hover:bg-white/20'
                    : 'border-[#BAE6FD] bg-[#F0F9FF] text-[#0369A1] hover:bg-[#E0F2FE]'
                }`}
              >
                <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{copy.australiaListenDialogue}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const currentId = activeLandmark.id;
                    closeActiveModal();
                    setGuideInitialLandmarkId(currentId);
                    setGuideOpen(true);
                  }}
                  className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold cursor-pointer ${
                    isNight
                      ? 'border-white/15 bg-white/10 text-white hover:bg-white/20'
                      : 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.australiaCityGuideButton}</span>
                </button>

                <button
                  type="button"
                  onClick={closeActiveModal}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#F2C66D] px-5 py-2 text-xs font-extrabold text-[#131E31] hover:bg-[#f6d388] cursor-pointer"
                >
                  <span>{copy.australiaCloseDialogButton}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 1 DISCOVER Interactive Mini-Game Modal */}
      {activeMiniGameLandmarkId && (
        <AustraliaDiscoveryModal
          landmarkId={activeMiniGameLandmarkId}
          language={language}
          appearance={appearance}
          reducedMotion={reducedMotion}
          alreadyCompletedMission={completedDiscoverIds.includes(
            activeMiniGameLandmarkId,
          )}
          completedDiscoverCount={completedDiscoverIds.length}
          difficultyMode={difficultyMode}
          onDifficultyChange={setDifficultyMode}
          onCompleteMission={onCompleteDiscoveryMission}
          onClose={() => setActiveMiniGameLandmarkId(null)}
          onPlaySfx={(kind = 'click') => onPlaySfx(kind)}
        />
      )}

      {/* Stage 2 BUILD Interactive Conversation Builder Modal */}
      {activeBuildLandmarkId && (
        <AustraliaBuildModal
          landmarkId={activeBuildLandmarkId}
          language={language}
          appearance={appearance}
          reducedMotion={reducedMotion}
          alreadyCompletedMission={completedBuildIds.includes(
            activeBuildLandmarkId,
          )}
          completedBuildCount={completedBuildIds.length}
          difficultyMode={difficultyMode}
          onDifficultyChange={setDifficultyMode}
          onCompleteMission={onCompleteBuildMission}
          onClose={() => setActiveBuildLandmarkId(null)}
          onPlaySfx={(kind = 'click') => onPlaySfx(kind)}
        />
      )}

      {/* Stage 3 PRACTICE Interactive Speaking Missions Modal */}
      {activePracticeLandmarkId && (
        <AustraliaPracticeModal
          landmarkId={activePracticeLandmarkId}
          language={language}
          appearance={appearance}
          reducedMotion={reducedMotion}
          alreadyCompletedMission={completedPracticeIds.includes(activePracticeLandmarkId)}
          completedPracticeCount={completedPracticeIds.length}
          builtDialogue={builtDialogues[activePracticeLandmarkId]}
          existingEvidence={practiceEvidence[activePracticeLandmarkId]}
          difficultyMode={difficultyMode}
          onDifficultyChange={setDifficultyMode}
          onCompleteMission={onCompletePracticeMission}
          onClose={() => setActivePracticeLandmarkId(null)}
          onPlaySfx={(kind = 'click') => onPlaySfx(kind)}
        />
      )}

      {/* Stage 4 PERFORM Final Sydney CityTalk Challenge / Reflection / Celebration Modal */}
      {activePerformView && (
        <AustraliaPerformModal
          initialView={activePerformView}
          language={language}
          appearance={appearance}
          reducedMotion={reducedMotion}
          alreadyCompletedChallenge={
            activePerformView.kind === 'challenge'
              ? completedPerformIds.includes(activePerformView.landmarkId)
              : false
          }
          completedPerformCount={completedPerformIds.length}
          allFiveChallengesDone={
            completedPerformIds.length >= AUSTRALIA_PERFORM_CHALLENGES.length
          }
          attemptPerformCompleted={performCompleted}
          performAlreadyRewarded={performAlreadyRewarded}
          completedAt={completedAt}
          currentTotalXp={rewards.xp}
          builtDialogues={builtDialogues}
          performEvidence={performEvidence}
          existingReflection={performReflection}
          reflectionDraft={reflectionDraft}
          canReplayCountry={canReplayCountry}
          difficultyMode={difficultyMode}
          onDifficultyChange={setDifficultyMode}
          onReflectionDraftChange={setReflectionDraft}
          onReflectionExitedWithoutSubmit={() => setHasExitedReflectionWithoutSubmit(true)}
          onCompleteChallenge={onCompletePerformChallenge}
          onCompletePerformMission={(reflection) => {
            const res = onCompletePerformMission(reflection);
            setReflectionDraft(undefined);
            setHasExitedReflectionWithoutSubmit(false);
            setPerformCompleteToast({
              xpEarned: res.firstCompletion,
            });
            return res;
          }}
          onClose={() => setActivePerformView(null)}
          onViewPassport={() => {
            setActivePerformView(null);
            onOpenPassport();
          }}
          onReturnWorldMap={() => {
            setActivePerformView(null);
            onBackToMap();
          }}
          onRequestReplayCountry={
            onRequestReplayCountry
              ? () => {
                  setActivePerformView(null);
                  onRequestReplayCountry();
                }
              : undefined
          }
          onPlaySfx={(kind = 'click') => onPlaySfx(kind)}
        />
      )}

      {/* Sydney City Explorer Guide Modal */}
      <SydneyCityExplorerGuideModal
        isOpen={guideOpen}
        language={language}
        appearance={appearance}
        exploredLandmarkIds={exploredPoiIds}
        discoverStarted={discoverStarted}
        completedDiscoverIds={completedDiscoverIds}
        nextDiscoverLandmarkId={nextDiscoverLandmarkId}
        buildUnlocked={buildUnlocked}
        buildStarted={buildStarted}
        completedBuildIds={completedBuildIds}
        nextBuildLandmarkId={nextBuildLandmarkId}
        buildCompleted={buildCompleted}
        builtDialogues={builtDialogues}
        practiceUnlocked={practiceUnlocked}
        practiceStarted={practiceStarted}
        completedPracticeIds={completedPracticeIds}
        nextPracticeLandmarkId={nextPracticeLandmarkId}
        practiceCompleted={practiceCompleted}
        practiceEvidence={practiceEvidence}
        performUnlocked={performUnlocked}
        performStarted={performStarted}
        completedPerformIds={completedPerformIds}
        nextPerformLandmarkId={nextPerformLandmarkId}
        performCompleted={performCompleted}
        performEvidence={performEvidence}
        hasExitedReflectionWithoutSubmit={hasExitedReflectionWithoutSubmit}
        guidedLandmarkId={guidedPoiId}
        initialLandmarkId={guideInitialLandmarkId}
        onGuideToLandmark={(id) => setGuidedPoiId(id)}
        onClearGuide={() => setGuidedPoiId(null)}
        onAutoWalkToLandmark={(id) => nav.startAutoWalk(id)}
        onQuickTravelToLandmark={(id) => nav.triggerQuickTravel(id)}
        onLaunchMission={(id) => launchDiscoverMiniGame(id)}
        onStartDiscovery={() => {
          onStartDiscovery();
        }}
        onLaunchBuildMission={(id) => launchBuildMiniGame(id)}
        onStartBuild={() => {
          onStartBuild();
        }}
        onLaunchPracticeMission={(id) => launchPracticeMission(id)}
        onStartPractice={() => {
          onStartPractice();
        }}
        onLaunchPerformMission={(id) => launchPerformChallenge(id)}
        onStartPerform={() => {
          onStartPerform();
        }}
        onOpenPerformReflection={() => {
          openPerformReflection();
        }}
        onOpenPerformCelebration={() => {
          openPerformCelebration();
        }}
        onClose={() => setGuideOpen(false)}
        onPlaySfx={onPlaySfx}
      />

      {/* Pause Menu Modal */}
      {pauseMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="australia-pause-title"
          className={`fixed inset-0 z-40 flex items-center justify-center p-4 ${
            isNight ? 'bg-[#081229]/75' : 'bg-[#0F2942]/35'
          }`}
        >
          <div
            className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl space-y-5 ${
              isNight
                ? 'border-[#38BDF8]/45 bg-[#0F1A33] text-[#F8FAFC]'
                : 'border-[#BAE6FD] bg-[#FFFDF8] text-[#1E2E46]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="australia-pause-title" className="font-display text-xl font-extrabold">
                  {copy.australiaPauseTitle}
                </h2>
                <p className={`mt-0.5 text-xs ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                  {copy.australiaPauseSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onPlaySfx('click');
                  setPauseMenuOpen(false);
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

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="inline-flex items-center gap-1.5">
                  <SlidersHorizontal className="h-4 w-4 text-[#0EA5E9]" aria-hidden="true" />
                  <span>{copy.jaipurCameraSensitivity}</span>
                </span>
                <span className="font-mono-num">{cameraSensitivity.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.1}
                value={cameraSensitivity}
                onChange={(e) => setCameraSensitivity(Number(e.target.value))}
                className="w-full accent-[#0EA5E9] cursor-pointer"
              />

              <button
                type="button"
                onClick={() => {
                  onPlaySfx('select');
                  setShowTouchPad((prev) => !prev);
                }}
                className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs font-bold cursor-pointer ${
                  isNight
                    ? 'border-white/15 bg-[#16223E] text-white'
                    : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#1E2E46]'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Gamepad2 className="h-4 w-4 text-[#0EA5E9]" aria-hidden="true" />
                  <span>{showTouchPad ? copy.jaipurTouchPadHide : copy.jaipurTouchPadShow}</span>
                </span>
                <span className="text-[#0EA5E9]">
                  {showTouchPad ? copy.onLabel : copy.offLabel}
                </span>
              </button>
            </div>

            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  onPlaySfx('click');
                  setPauseMenuOpen(false);
                }}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#F2C66D] px-4 py-2.5 font-display text-sm font-extrabold text-[#131E31] hover:bg-[#f6d388] cursor-pointer"
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                <span>{copy.australiaResumeButton}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onPlaySfx('click');
                  setPauseMenuOpen(false);
                  onOpenSettings();
                }}
                className={`flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${
                  isNight
                    ? 'border-white/15 bg-[#16223E] text-white hover:bg-[#1E2E52]'
                    : 'border-[#CBD5E1] bg-white text-[#1E2E46] hover:bg-[#F8FAFC]'
                }`}
              >
                <Settings className="h-4 w-4" aria-hidden="true" />
                <span>{copy.settingsButton}</span>
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
                  onPlaySfx('click');
                  setPauseMenuOpen(false);
                  onBackToMap();
                }}
                className={`flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${
                  isNight
                    ? 'border-white/15 bg-[#16223E] text-[#FDE68A] hover:bg-[#1E2E52]'
                    : 'border-[#CBD5E1] bg-white text-[#1E2E46] hover:bg-[#F8FAFC]'
                }`}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>{copy.backToMap}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
