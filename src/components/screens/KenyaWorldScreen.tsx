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
} from '../../types/game';
import { GAME_COPY } from '../../data/i18n';
import {
  AMINA_DISCOVER_DIALOGUE,
  getKenyaDiscoveryTask,
  KENYA_DISCOVERY_TASKS,
  KENYA_DISCOVERY_XP_REWARD,
} from '../../data/kenyaDiscovery';
import {
  AMINA_BUILD_DIALOGUE,
  getKenyaBuildStation,
  KENYA_BUILD_STATIONS,
  KENYA_BUILD_XP_REWARD,
} from '../../data/kenyaBuild';
import {
  AMINA_PRACTICE_DIALOGUE,
  getKenyaPracticeConversation,
  KENYA_PRACTICE_CONVERSATIONS,
  KENYA_PRACTICE_XP_REWARD,
} from '../../data/kenyaPractice';
import {
  AMINA_PERFORM_DIALOGUE,
  KENYA_PERFORM_XP_REWARD,
} from '../../data/kenyaPerform';
import {
  KENYA_INTERACTIVE_TARGETS,
  KENYA_SPAWN,
  type KenyaLandmarkId,
  type KenyaPoiId,
} from '../../data/kenyaWorld';
import { useWorldNavigation } from '../../utils/useWorldNavigation';
import { SmartNavigationHud } from '../navigation/SmartNavigationHud';
import { AvatarPortraitSVG } from '../avatar/AvatarPortraitSVG';
import { VirtualJoystick, type JoystickVector } from '../india/VirtualJoystick';
import { FinalWildlifeAmbassadorModal } from '../kenya/FinalWildlifeAmbassadorModal';
import { KenyaDiscoveryCardModal } from '../kenya/KenyaDiscoveryCardModal';
import { KenyaFallback2D } from '../kenya/KenyaFallback2D';
import { SafariFactBuilderModal } from '../kenya/SafariFactBuilderModal';
import { WildSpeakTourModal } from '../kenya/WildSpeakTourModal';
import { WildlifeFieldGuideModal } from '../kenya/WildlifeFieldGuideModal';

const LazyKenyaExplorationScene = lazy(() => import('../kenya/KenyaExplorationScene'));

interface KenyaWorldScreenProps {
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
  discoverStarted: boolean;
  discoveredIds: KenyaLandmarkId[];
  discoverCompleted: boolean;
  buildUnlocked: boolean;
  buildStarted: boolean;
  builtSentences: Record<string, string>;
  buildCompleted: boolean;
  practiceUnlocked: boolean;
  practiceStarted: boolean;
  practicedConversationIds: KenyaLandmarkId[];
  practiceCompleted: boolean;
  performUnlocked: boolean;
  performStarted: boolean;
  performCompleted: boolean;
  completedAt?: string;
  isReplayActive?: boolean;
  replayAttemptNumber?: number;
  canReplayCountry?: boolean;
  discoverAlreadyRewarded?: boolean;
  buildAlreadyRewarded?: boolean;
  practiceAlreadyRewarded?: boolean;
  performAlreadyRewarded?: boolean;
  onRequestRestartAttempt?: () => void;
  onRequestReplayCountry?: () => void;
  onStartDiscovery: () => void;
  onCompleteDiscoverySpot: (spotId: KenyaLandmarkId) => boolean;
  onStartBuild: () => void;
  onCompleteBuildStation: (stationId: KenyaLandmarkId, sentence: string) => boolean;
  onStartPractice: () => void;
  onCompletePracticeConversation: (conversationId: KenyaLandmarkId) => boolean;
  onStartPerform: () => void;
  onCompletePerform: () => { firstCompletion: boolean };
  onWebGLFailure: () => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'mode' | 'reward') => void;
  onBackToMap: () => void;
  onOpenPassport: () => void;
  onToggleQuickAppearance: () => void;
  onToggleMusic: () => void;
  onOpenSettings: () => void;
}

export function KenyaWorldScreen({
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
  discoverStarted,
  discoveredIds,
  discoverCompleted,
  buildUnlocked,
  buildStarted,
  builtSentences,
  buildCompleted,
  practiceUnlocked,
  practiceStarted,
  practicedConversationIds,
  practiceCompleted,
  performUnlocked,
  performStarted,
  performCompleted,
  completedAt,
  isReplayActive = false,
  replayAttemptNumber,
  canReplayCountry = false,
  discoverAlreadyRewarded = false,
  buildAlreadyRewarded = false,
  practiceAlreadyRewarded = false,
  performAlreadyRewarded = false,
  onRequestRestartAttempt,
  onRequestReplayCountry,
  onStartDiscovery,
  onCompleteDiscoverySpot,
  onStartBuild,
  onCompleteBuildStation,
  onStartPractice,
  onCompletePracticeConversation,
  onStartPerform,
  onCompletePerform,
  onWebGLFailure,
  onPlaySfx,
  onBackToMap,
  onOpenPassport,
  onToggleQuickAppearance,
  onToggleMusic,
  onOpenSettings,
}: KenyaWorldScreenProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';

  const [showArrivalBanner, setShowArrivalBanner] = useState(true);
  const [nearestPoiId, setNearestPoiId] = useState<KenyaPoiId | null>(null);
  const [guidedPoiId, setGuidedPoiId] = useState<KenyaPoiId | null>(null);
  const [activeModalPoiId, setActiveModalPoiId] = useState<KenyaPoiId | null>(null);
  const [ambassadorModalOpen, setAmbassadorModalOpen] = useState(false);
  const [fieldGuideOpen, setFieldGuideOpen] = useState(false);
  const [pauseMenuOpen, setPauseMenuOpen] = useState(false);
  const [interactGestureSeq, setInteractGestureSeq] = useState(0);
  const [celebrationSeq, setCelebrationSeq] = useState(0);
  const [showMeetAminaToast, setShowMeetAminaToast] = useState(false);
  const [showReturnAminaBuildToast, setShowReturnAminaBuildToast] = useState(false);
  const [showReturnAminaPracticeToast, setShowReturnAminaPracticeToast] = useState(false);
  const [showReturnAminaPerformToast, setShowReturnAminaPerformToast] = useState(false);
  const [celebrateToast, setCelebrateToast] = useState<{
    kind: 'discover' | 'build' | 'practice' | 'perform';
    xpEarned: boolean;
  } | null>(null);
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

  useEffect(() => {
    if (!showMeetAminaToast) return;
    const timer = window.setTimeout(() => setShowMeetAminaToast(false), 3200);
    return () => window.clearTimeout(timer);
  }, [showMeetAminaToast]);

  useEffect(() => {
    if (!showReturnAminaBuildToast) return;
    const timer = window.setTimeout(() => setShowReturnAminaBuildToast(false), 3600);
    return () => window.clearTimeout(timer);
  }, [showReturnAminaBuildToast]);

  useEffect(() => {
    if (!showReturnAminaPracticeToast) return;
    const timer = window.setTimeout(() => setShowReturnAminaPracticeToast(false), 3600);
    return () => window.clearTimeout(timer);
  }, [showReturnAminaPracticeToast]);

  useEffect(() => {
    if (!showReturnAminaPerformToast) return;
    const timer = window.setTimeout(() => setShowReturnAminaPerformToast(false), 3600);
    return () => window.clearTimeout(timer);
  }, [showReturnAminaPerformToast]);

  useEffect(() => {
    if (!celebrateToast) return;
    const timer = window.setTimeout(
      () => setCelebrateToast(null),
      reducedMotion ? 3200 : 4800,
    );
    return () => window.clearTimeout(timer);
  }, [celebrateToast, reducedMotion]);

  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  useEffect(() => {
    return () => stopSpeech();
  }, [stopSpeech]);

  const speakEnglishText = (
    text: string,
    voiceOpts?: { pitch?: number; rate?: number },
  ) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = voiceOpts?.rate ?? country.npc.voiceProfile.recommendedRate;
    utterance.pitch = voiceOpts?.pitch ?? country.npc.voiceProfile.recommendedPitch;
    window.speechSynthesis.speak(utterance);
  };

  const openPoiInteraction = useCallback(
    (poiId: KenyaPoiId) => {
      if (externalModalOpen || pauseMenuOpen || fieldGuideOpen || ambassadorModalOpen) {
        return;
      }
      setInteractGestureSeq((n) => n + 1);
      if (poiId !== 'local_guide' && !discoverStarted) {
        onPlaySfx('click');
        setShowMeetAminaToast(true);
        return;
      }
      if (poiId !== 'local_guide' && buildCompleted && !practiceStarted) {
        onPlaySfx('click');
        setShowReturnAminaPracticeToast(true);
        return;
      }
      if (poiId !== 'local_guide' && discoverCompleted && !buildStarted) {
        setShowReturnAminaBuildToast(true);
      }
      if (poiId === 'conservation_lookout' && practiceCompleted && performUnlocked) {
        if (!performStarted) {
          onPlaySfx('click');
          setShowReturnAminaPerformToast(true);
          return;
        }
        onPlaySfx('select');
        setAmbassadorModalOpen(true);
        return;
      }
      onPlaySfx('select');
      setActiveModalPoiId(poiId);
    },
    [
      ambassadorModalOpen,
      buildCompleted,
      buildStarted,
      discoverCompleted,
      discoverStarted,
      externalModalOpen,
      fieldGuideOpen,
      onPlaySfx,
      pauseMenuOpen,
      performStarted,
      performUnlocked,
      practiceCompleted,
      practiceStarted,
    ],
  );

  const closeActiveModal = useCallback(() => {
    stopSpeech();
    onPlaySfx('click');
    setActiveModalPoiId(null);
  }, [onPlaySfx, stopSpeech]);

  const handleDiscoverySpotSolved = useCallback(
    (spotId: KenyaLandmarkId): boolean => {
      const completedAllNow = onCompleteDiscoverySpot(spotId);
      if (completedAllNow) {
        setCelebrationSeq((s) => s + 1);
        setCelebrateToast({ kind: 'discover', xpEarned: !discoverAlreadyRewarded });
      }
      return completedAllNow;
    },
    [discoverAlreadyRewarded, onCompleteDiscoverySpot],
  );

  const handleBuildStationSolved = useCallback(
    (stationId: KenyaLandmarkId, sentence: string): boolean => {
      const completedAllNow = onCompleteBuildStation(stationId, sentence);
      if (completedAllNow) {
        setCelebrationSeq((s) => s + 1);
        setCelebrateToast({ kind: 'build', xpEarned: !buildAlreadyRewarded });
      }
      return completedAllNow;
    },
    [buildAlreadyRewarded, onCompleteBuildStation],
  );

  const handlePracticeConversationSolved = useCallback(
    (conversationId: KenyaLandmarkId): boolean => {
      const completedAllNow = onCompletePracticeConversation(conversationId);
      if (completedAllNow) {
        setCelebrationSeq((s) => s + 1);
        setCelebrateToast({ kind: 'practice', xpEarned: !practiceAlreadyRewarded });
      }
      return completedAllNow;
    },
    [onCompletePracticeConversation, practiceAlreadyRewarded],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (externalModalOpen || ambassadorModalOpen) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Escape') {
        if (fieldGuideOpen) {
          e.preventDefault();
          stopSpeech();
          onPlaySfx('click');
          setFieldGuideOpen(false);
          return;
        }
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
        !pauseMenuOpen &&
        !fieldGuideOpen &&
        !ambassadorModalOpen
      ) {
        e.preventDefault();
        openPoiInteraction(nearestPoiId);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    activeModalPoiId,
    ambassadorModalOpen,
    closeActiveModal,
    externalModalOpen,
    fieldGuideOpen,
    nearestPoiId,
    onPlaySfx,
    openPoiInteraction,
    pauseMenuOpen,
    stopSpeech,
  ]);

  const buildDoneIds = KENYA_BUILD_STATIONS.filter((s) => Boolean(builtSentences[s.id])).map(
    (s) => s.id,
  );
  const builtCount = buildDoneIds.length;
  const totalBuildStations = KENYA_BUILD_STATIONS.length;
  const totalPracticeConversations = KENYA_PRACTICE_CONVERSATIONS.length;
  const practicedCount = practicedConversationIds.length;

  const visitedPoiIds: KenyaPoiId[] = !discoverStarted
    ? []
    : !discoverCompleted
      ? ['local_guide', ...discoveredIds]
      : !buildStarted
        ? [...discoveredIds]
        : !buildCompleted
          ? ['local_guide', ...buildDoneIds]
          : !practiceStarted
            ? [...buildDoneIds]
            : ['local_guide', ...practicedConversationIds];

  const isPaused =
    externalModalOpen ||
    activeModalPoiId !== null ||
    pauseMenuOpen ||
    fieldGuideOpen ||
    ambassadorModalOpen;

  const nav = useWorldNavigation({
    worldId: 'kenya',
    language,
    initialPosition: { x: KENYA_SPAWN.x, z: KENYA_SPAWN.z },
    isPaused,
    reducedMotion,
    navContext: {
      kenyaPracticedIds: practicedConversationIds,
      kenyaPracticeCompleted: practiceCompleted,
      kenyaPerformStarted: performStarted,
    },
    nextMissionState: {
      worldId: 'kenya',
      state: {
        countryUnlocked: true,
        discoverStarted,
        discoveredSpotIds: discoveredIds,
        discoverCompleted,
        buildStarted,
        builtBoardIds: buildDoneIds,
        buildCompleted,
        practiceStarted,
        practicedIds: practicedConversationIds,
        practiceCompleted,
        performStarted,
        performCompleted,
      },
    },
    onSyncGuideTarget: (targetId) => {
      setGuidedPoiId(targetId ? (targetId as KenyaPoiId) : null);
    },
  });

  useEffect(() => {
    if (isPaused) {
      joystickRef.current = { x: 0, y: 0 };
    }
  }, [isPaused]);

  const nearestTarget = nearestPoiId
    ? KENYA_INTERACTIVE_TARGETS.find((p) => p.id === nearestPoiId) ?? null
    : null;

  const activePracticeConversation =
    buildCompleted && practiceStarted && activeModalPoiId && activeModalPoiId !== 'local_guide'
      ? getKenyaPracticeConversation(activeModalPoiId) ?? null
      : null;

  const activeBuildStation =
    !activePracticeConversation &&
    discoverCompleted &&
    buildStarted &&
    activeModalPoiId &&
    activeModalPoiId !== 'local_guide'
      ? getKenyaBuildStation(activeModalPoiId) ?? null
      : null;

  const activeDiscoveryTask =
    !activePracticeConversation &&
    !activeBuildStation &&
    activeModalPoiId &&
    activeModalPoiId !== 'local_guide'
      ? getKenyaDiscoveryTask(activeModalPoiId) ?? null
      : null;

  const totalSpots = KENYA_DISCOVERY_TASKS.length;
  const discoveredCount = discoveredIds.length;

  const aminaDialogue = !discoverStarted
    ? AMINA_DISCOVER_DIALOGUE.intro
    : !discoverCompleted
      ? AMINA_DISCOVER_DIALOGUE.inProgress(discoveredCount, totalSpots)
      : !buildStarted
        ? AMINA_BUILD_DIALOGUE.intro
        : !buildCompleted
          ? AMINA_BUILD_DIALOGUE.inProgress(builtCount, totalBuildStations)
          : !practiceStarted
            ? AMINA_PRACTICE_DIALOGUE.intro
            : !practiceCompleted
              ? AMINA_PRACTICE_DIALOGUE.inProgress(practicedCount, totalPracticeConversations)
              : !performStarted
                ? AMINA_PERFORM_DIALOGUE.unlocked
                : !performCompleted
                  ? AMINA_PERFORM_DIALOGUE.startedWaiting
                  : AMINA_PERFORM_DIALOGUE.completed;

  const currentObjectiveText = !discoverStarted
    ? copy.kenyaObjectiveTalkAmina
    : !discoverCompleted
      ? copy.kenyaObjectiveDiscover
      : !buildStarted
        ? copy.kenyaObjectiveTalkAminaBuild
        : !buildCompleted
          ? copy.kenyaObjectiveBuild
          : !practiceStarted
            ? copy.kenyaObjectiveTalkAminaPractice
            : !practiceCompleted
              ? copy.kenyaObjectivePractice
              : !performStarted
                ? copy.kenyaObjectiveTalkAminaPerform
                : !performCompleted
                  ? copy.kenyaObjectivePerformReady
                  : copy.kenyaObjectiveMissionComplete;

  const hudChipClass = isNight
    ? 'border-white/20 bg-[#131E31]/88 text-[#F7F9FC] hover:bg-[#1E2E49] shadow-lg'
    : 'border-[#20304A]/15 bg-[#FFFDF8]/92 text-[#20304A] hover:bg-white shadow-[0_6px_18px_rgba(32,48,74,0.12)]';

  const hudPanelClass = isNight
    ? 'border-white/20 bg-[#131E31]/88 text-[#F7F9FC] shadow-lg'
    : 'border-[#20304A]/12 bg-[#FFFDF8]/92 text-[#20304A] shadow-[0_6px_18px_rgba(32,48,74,0.12)]';

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden select-none">
      {/* Full-Screen Walkable 3D Maasai Mara World (or Accessible 2D Fallback) */}
      <div className="absolute inset-0">
        {viewMode === '3d' && webglSupported ? (
          <Suspense
            fallback={
              <KenyaFallback2D
                avatar={avatar}
                language={language}
                appearance={appearance}
                paused={isPaused}
                visitedPoiIds={visitedPoiIds}
                practicedIds={practicedConversationIds}
                ambassadorStageActive={performStarted || performCompleted || ambassadorModalOpen}
                nearestPoiId={nearestPoiId}
                guidedPoiId={guidedPoiId}
                noticeText={copy.kenyaFallback2dNotice}
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
            <LazyKenyaExplorationScene
              avatar={avatar}
              appearance={appearance}
              reducedMotion={reducedMotion}
              cameraSensitivity={cameraSensitivity}
              paused={isPaused}
              visitedPoiIds={visitedPoiIds}
              guidedPoiId={guidedPoiId}
              practicedIds={practicedConversationIds}
              ambassadorStageActive={performStarted || performCompleted || ambassadorModalOpen}
              activeDialogueOpen={activeModalPoiId === 'local_guide'}
              activeTouristNpcId={activePracticeConversation?.npcId ?? null}
              interactGestureSeq={interactGestureSeq}
              celebrationSeq={celebrationSeq}
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
          <KenyaFallback2D
            avatar={avatar}
            language={language}
            appearance={appearance}
            paused={isPaused}
            visitedPoiIds={visitedPoiIds}
            practicedIds={practicedConversationIds}
            ambassadorStageActive={performStarted || performCompleted || ambassadorModalOpen}
            nearestPoiId={nearestPoiId}
            guidedPoiId={guidedPoiId}
            noticeText={copy.kenyaFallback2dNotice}
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
                ? 'border-[#F2C66D]/60 bg-[#131E31]/92'
                : 'border-white bg-[#FFFDF8]/94 shadow-[0_14px_34px_rgba(32,48,74,0.16)]'
            }`}
          >
            <p
              className={`font-display text-lg sm:text-xl font-bold ${
                isNight ? 'text-[#F2C66D]' : 'text-[#C46B2B]'
              }`}
            >
              {copy.arrivingKenyaTitle}
            </p>
            <p
              className={`mt-0.5 text-xs font-medium ${
                isNight ? 'text-[#E2ECF9]' : 'text-[#48607E]'
              }`}
            >
              {copy.arrivingKenyaSubtitle}
            </p>
          </div>
        </div>
      )}

      {/* Non-Blocking Notice when Player inspects Landmark before talking to Amina */}
      {(showMeetAminaToast ||
        showReturnAminaBuildToast ||
        showReturnAminaPracticeToast ||
        showReturnAminaPerformToast) &&
        !showArrivalBanner && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute inset-x-0 top-20 z-20 flex justify-center px-4"
        >
          <div
            className={`flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 text-xs sm:text-sm font-bold shadow-xl ${
              isNight
                ? 'border-[#F2C66D]/60 bg-[#131E31]/95 text-[#F7F9FC]'
                : 'border-[#F2C66D] bg-[#FFFDF8]/96 text-[#1E2E46]'
            }`}
          >
            <MessageCircle className="h-4 w-4 shrink-0 text-[#E09A48]" aria-hidden="true" />
            <span>
              {showReturnAminaPerformToast
                ? copy.kenyaObjectiveTalkAminaPerform
                : showReturnAminaPracticeToast
                  ? copy.kenyaReturnAminaPracticeHint
                  : showReturnAminaBuildToast
                    ? copy.kenyaReturnAminaBuildHint
                    : copy.kenyaMeetAminaFirstHint}
            </span>
          </div>
        </div>
      )}

      {/* Non-Blocking Celebration Toast when DISCOVER, BUILD, PRACTICE (+50 XP), or PERFORM (+100 XP) Completes */}
      {celebrateToast && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute inset-x-0 top-20 z-20 flex justify-center px-4"
        >
          <div
            className={`flex items-center gap-3 rounded-2xl border px-5 py-3 shadow-2xl ${
              isNight
                ? 'border-[#2ED6A3]/70 bg-[#102E2C]/96 text-[#F7F9FC]'
                : 'border-[#24B8B0] bg-[#FFFDF8]/98 text-[#1E2E46]'
            }`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2ED6A3] text-[#131E31]">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-sm sm:text-base font-extrabold">
                  {celebrateToast.kind === 'perform'
                    ? copy.kenyaPerformCeremonyTitle
                    : celebrateToast.kind === 'practice'
                      ? copy.kenyaPracticeCelebrationTitle
                      : celebrateToast.kind === 'build'
                        ? copy.kenyaBuildCelebrationTitle
                        : copy.kenyaCelebrationTitle}
                </p>
                {celebrateToast.xpEarned ? (
                  <span className="rounded-lg bg-[#F2C66D] px-2 py-0.5 font-mono-num text-xs font-extrabold text-[#131E31]">
                    +
                    {celebrateToast.kind === 'perform'
                      ? KENYA_PERFORM_XP_REWARD
                      : celebrateToast.kind === 'practice'
                        ? KENYA_PRACTICE_XP_REWARD
                        : celebrateToast.kind === 'build'
                          ? KENYA_BUILD_XP_REWARD
                          : KENYA_DISCOVERY_XP_REWARD}{' '}
                    {copy.xpLabel}
                  </span>
                ) : (
                  <span className="rounded-lg bg-[#2ED6A3]/25 px-2 py-0.5 text-[11px] font-extrabold text-[#0E7A74] dark:text-[#2ED6A3]">
                    {copy.replayNoExtraXpLabel}
                  </span>
                )}
              </div>
              <p className={`text-xs font-medium ${isNight ? 'text-[#B6E6D8]' : 'text-[#2E6B63]'}`}>
                {celebrateToast.kind === 'perform'
                  ? celebrateToast.xpEarned
                    ? copy.kenyaPerformCeremonySubtitle
                    : copy.kenyaPerformCeremonyReplaySubtitle
                  : celebrateToast.kind === 'practice'
                    ? copy.kenyaPerformUnlockedBadge
                    : celebrateToast.kind === 'build'
                      ? copy.kenyaPracticeUnlockedBadge
                      : copy.kenyaBuildUnlockedBadge}
              </p>
            </div>
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
                isNight ? 'border-[#F2C66D]/60' : 'border-[#20304A]/15'
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
                practiceCompleted ||
                (buildCompleted && !practiceStarted) ||
                (discoverCompleted && !buildStarted)
                  ? isNight
                    ? 'text-[#2ED6A3]'
                    : 'text-[#0E7A74]'
                  : isNight
                    ? 'text-[#F2C66D]'
                    : 'text-[#C46B2B]'
              }`}
              aria-hidden="true"
            />
            <span className="font-display font-bold">{currentObjectiveText}</span>
            {discoverStarted && (
              <>
                <span
                  className={`h-3.5 w-px ${isNight ? 'bg-white/20' : 'bg-[#20304A]/15'}`}
                  aria-hidden="true"
                />
                {buildCompleted && practiceStarted ? (
                  <span
                    className={`font-mono-num font-extrabold ${
                      practicedCount >= totalPracticeConversations
                        ? isNight
                          ? 'text-[#2ED6A3]'
                          : 'text-[#0E7A74]'
                        : isNight
                          ? 'text-[#F2C66D]'
                          : 'text-[#C46B2B]'
                    }`}
                  >
                    {copy.kenyaPracticeCountLabel}: {practicedCount}/{totalPracticeConversations}
                  </span>
                ) : discoverCompleted ? (
                  <span
                    className={`font-mono-num font-extrabold ${
                      builtCount >= totalBuildStations
                        ? isNight
                          ? 'text-[#2ED6A3]'
                          : 'text-[#0E7A74]'
                        : isNight
                          ? 'text-[#F2C66D]'
                          : 'text-[#C46B2B]'
                    }`}
                  >
                    {copy.kenyaBuildCountLabel}: {builtCount}/{totalBuildStations}
                  </span>
                ) : (
                  <span
                    className={`font-mono-num font-extrabold ${
                      discoveredCount >= totalSpots
                        ? isNight
                          ? 'text-[#2ED6A3]'
                          : 'text-[#0E7A74]'
                        : isNight
                          ? 'text-[#F2C66D]'
                          : 'text-[#C46B2B]'
                    }`}
                  >
                    {copy.kenyaDiscoverCountLabel}: {discoveredCount}/{totalSpots}
                  </span>
                )}
              </>
            )}
          </div>

          {discoverStarted && (
            <button
              type="button"
              onClick={() => {
                onPlaySfx('click');
                setFieldGuideOpen(true);
              }}
              className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${hudChipClass}`}
            >
              <BookOpen className="h-4 w-4 text-[#D99B26]" aria-hidden="true" />
              <span>{copy.kenyaOpenFieldGuideButton}</span>
            </button>
          )}
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
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
              ? practicedConversationIds
              : buildStarted
                ? buildDoneIds
                : discoveredIds
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
            setGuidedPoiId(targetId as KenyaPoiId);
            nav.setActiveDestinationId(targetId);
          }}
          accentTone="emerald"
        />
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
                    ? copy.kenyaSpeakWithAmina
                    : nearestTarget.id === 'conservation_lookout' &&
                        practiceCompleted &&
                        performStarted
                      ? copy.kenyaOpenStagePrompt
                      : copy.kenyaInspectSpot}
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
          aria-labelledby="kenya-pause-title"
          className={`fixed inset-0 z-30 flex items-center justify-center p-4 ${
            isNight ? 'bg-[#090F1E]/65' : 'bg-[#20304A]/28'
          }`}
        >
          <div
            className={`w-full max-w-sm rounded-3xl border p-5 sm:p-6 ${
              isNight
                ? 'border-[#F2C66D]/50 bg-[#121C36]/96 text-[#F7F9FC] shadow-2xl'
                : 'border-white bg-[#FFFDF8]/98 text-[#1E2E46] shadow-[0_22px_48px_rgba(32,48,74,0.22)]'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 id="kenya-pause-title" className="font-display text-xl font-extrabold">
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

              {discoverStarted && (
                <button
                  type="button"
                  onClick={() => {
                    onPlaySfx('click');
                    setPauseMenuOpen(false);
                    setFieldGuideOpen(true);
                  }}
                  className={`inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${hudChipClass}`}
                >
                  <BookOpen className="h-4 w-4 text-[#D99B26]" aria-hidden="true" />
                  <span>{copy.kenyaFieldGuideTitle}</span>
                </button>
              )}

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

      {/* Amina Odhiambo Dialogue Bubble */}
      {activeModalPoiId === 'local_guide' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="kenya-poi-modal-title"
          className={`fixed inset-0 z-30 flex items-end justify-center p-4 sm:p-6 ${
            isNight ? 'bg-[#090F1E]/55' : 'bg-[#20304A]/20'
          }`}
        >
          <div
            className={`w-full max-w-xl rounded-3xl border p-5 sm:p-6 transition-colors ${
              isNight
                ? 'border-[#F2C66D]/50 bg-[#121C36]/95 text-[#F7F9FC] shadow-2xl'
                : 'border-white bg-[#FFFDF8]/96 text-[#1E2E46] shadow-[0_18px_40px_rgba(32,48,74,0.18)]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm"
                  style={{ backgroundColor: country.themeColors.primary }}
                >
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2
                    id="kenya-poi-modal-title"
                    className={`font-display text-base sm:text-lg font-extrabold ${
                      isNight ? 'text-[#F2C66D]' : 'text-[#C46B2B]'
                    }`}
                  >
                    {country.npc.name}
                  </h2>
                  <p
                    className={`text-xs font-medium ${
                      isNight ? 'text-[#C3CFE0]' : 'text-[#526785]'
                    }`}
                  >
                    {country.npc.role[language]} ·{' '}
                    <span
                      className={`font-mono-num font-bold ${
                        isNight ? 'text-[#2ED6A3]' : 'text-[#0E7A74]'
                      }`}
                    >
                      {buildCompleted && practiceStarted
                        ? `${practicedCount}/${totalPracticeConversations}`
                        : discoverCompleted
                          ? `${builtCount}/${totalBuildStations}`
                          : `${discoveredCount}/${totalSpots}`}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => speakEnglishText(aminaDialogue.en)}
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
                  aria-label={copy.closeSettings}
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
              className={`mt-3.5 rounded-2xl border p-4 ${
                isNight
                  ? 'border-white/12 bg-[#1A2847]'
                  : 'border-[#20304A]/10 bg-[#F2F7FC]'
              }`}
            >
              <p
                className={`text-sm sm:text-base font-medium leading-relaxed ${
                  isNight ? 'text-[#F7F9FC]' : 'text-[#1E2E46]'
                }`}
              >
                “{aminaDialogue[language]}”
              </p>
              {language === 'th' && (
                <p
                  className={`mt-2 border-t pt-2 text-xs leading-relaxed ${
                    isNight
                      ? 'border-white/10 text-[#B6C7DE]'
                      : 'border-[#20304A]/10 text-[#4F6482]'
                  }`}
                >
                  “{aminaDialogue.en}”
                </p>
              )}
              {discoverCompleted && buildUnlocked && !buildStarted && (
                <div
                  className={`mt-2.5 flex flex-wrap items-center gap-2 border-t pt-2.5 text-xs ${
                    isNight ? 'border-white/10' : 'border-[#20304A]/10'
                  }`}
                >
                  <span className="inline-flex items-center gap-1 rounded-lg bg-[#2ED6A3] px-2.5 py-0.5 font-display text-[11px] font-extrabold text-[#131E31]">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    {copy.kenyaBuildUnlockedBadge}
                  </span>
                </div>
              )}
              {buildCompleted && practiceUnlocked && !practiceStarted && (
                <div
                  className={`mt-2.5 flex flex-wrap items-center gap-2 border-t pt-2.5 text-xs ${
                    isNight ? 'border-white/10' : 'border-[#20304A]/10'
                  }`}
                >
                  <span className="inline-flex items-center gap-1 rounded-lg bg-[#2ED6A3] px-2.5 py-0.5 font-display text-[11px] font-extrabold text-[#131E31]">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    {copy.kenyaPracticeUnlockedBadge}
                  </span>
                </div>
              )}
              {practiceCompleted && performUnlocked && (
                <div
                  className={`mt-2.5 flex flex-wrap items-center gap-2 border-t pt-2.5 text-xs ${
                    isNight ? 'border-white/10' : 'border-[#20304A]/10'
                  }`}
                >
                  <span className="inline-flex items-center gap-1 rounded-lg bg-[#2ED6A3] px-2.5 py-0.5 font-display text-[11px] font-extrabold text-[#131E31]">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    {performCompleted
                      ? copy.kenyaPerformCeremonyTitle
                      : copy.kenyaPerformUnlockedBadge}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5">
              {discoverStarted ? (
                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    onPlaySfx('click');
                    setActiveModalPoiId(null);
                    setFieldGuideOpen(true);
                  }}
                  className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold cursor-pointer ${hudChipClass}`}
                >
                  <BookOpen className="h-4 w-4 text-[#D99B26]" aria-hidden="true" />
                  <span>{copy.kenyaOpenFieldGuideButton}</span>
                </button>
              ) : (
                <span
                  className={`text-[11px] font-semibold ${
                    isNight ? 'text-[#B6C7DE]' : 'text-[#4F6482]'
                  }`}
                >
                  {copy.kenyaObjectiveDiscover}
                </span>
              )}

              {!discoverStarted ? (
                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    onPlaySfx('reward');
                    onStartDiscovery();
                    setActiveModalPoiId(null);
                  }}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#49e2b3] cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  <span>{copy.kenyaStartMissionButton}</span>
                </button>
              ) : discoverCompleted && !buildStarted ? (
                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    onPlaySfx('reward');
                    onStartBuild();
                    setActiveModalPoiId(null);
                  }}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#49e2b3] cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  <span>{copy.kenyaStartBuildButton}</span>
                </button>
              ) : buildCompleted && !practiceStarted ? (
                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    onPlaySfx('reward');
                    onStartPractice();
                    setActiveModalPoiId(null);
                  }}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#49e2b3] cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  <span>{copy.kenyaStartPracticeButton}</span>
                </button>
              ) : practiceCompleted && performUnlocked ? (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      stopSpeech();
                      onPlaySfx('click');
                      setActiveModalPoiId('ranger_camp');
                    }}
                    className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold cursor-pointer ${hudChipClass}`}
                  >
                    <span>{copy.kenyaReplaySafariTourButton}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      stopSpeech();
                      onPlaySfx(performStarted ? 'select' : 'reward');
                      onStartPerform();
                      setActiveModalPoiId(null);
                      setAmbassadorModalOpen(true);
                    }}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#f7d487] cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    <span>
                      {performStarted
                        ? copy.kenyaReplayFinalChallengeButton
                        : copy.kenyaStartFinalChallengeButton}
                    </span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={closeActiveModal}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#f7d487] cursor-pointer"
                >
                  <span>
                    {practiceCompleted ? copy.jaipurNextButton : copy.jaipurStartExploringButton}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stage 4: PERFORM — Final Wildlife Ambassador Challenge */}
      {ambassadorModalOpen && (
        <FinalWildlifeAmbassadorModal
          language={language}
          appearance={appearance}
          reducedMotion={reducedMotion}
          alreadyCompleted={performCompleted || performAlreadyRewarded}
          completedAt={completedAt}
          currentTotalXp={rewards.xp}
          builtSentences={builtSentences}
          onPlaySfx={onPlaySfx}
          onSpeakText={speakEnglishText}
          onStopSpeech={stopSpeech}
          onCompletePerform={onCompletePerform}
          onCeremonyTrigger={() => {
            setCelebrationSeq((s) => s + 1);
            setCelebrateToast({ kind: 'perform', xpEarned: !performAlreadyRewarded });
          }}
          onViewPassport={() => {
            setAmbassadorModalOpen(false);
            onOpenPassport();
          }}
          onReturnWorldMap={() => {
            setAmbassadorModalOpen(false);
            onBackToMap();
          }}
          onClose={() => {
            stopSpeech();
            setAmbassadorModalOpen(false);
          }}
        />
      )}

      {/* WildSpeak Safari Tour Conversation Modal (Stage 3: PRACTICE) */}
      {activePracticeConversation && (
        <WildSpeakTourModal
          key={activePracticeConversation.id}
          conversation={activePracticeConversation}
          totalCount={totalPracticeConversations}
          completedCount={practicedCount}
          language={language}
          appearance={appearance}
          reducedMotion={reducedMotion}
          savedBuiltSentence={builtSentences[activePracticeConversation.id]}
          alreadyCompleted={practicedConversationIds.includes(activePracticeConversation.id)}
          onPlaySfx={onPlaySfx}
          onSpeakText={speakEnglishText}
          onStopSpeech={stopSpeech}
          onCompleteConversation={handlePracticeConversationSolved}
          onClose={closeActiveModal}
        />
      )}

      {/* Interactive Safari Fact Builder Station Modal (Stage 2: BUILD) */}
      {activeBuildStation && (
        <SafariFactBuilderModal
          key={activeBuildStation.id}
          station={activeBuildStation}
          totalCount={totalBuildStations}
          language={language}
          appearance={appearance}
          existingSentence={builtSentences[activeBuildStation.id]}
          onPlaySfx={onPlaySfx}
          onSpeakText={speakEnglishText}
          onStopSpeech={stopSpeech}
          onSaveStationSentence={handleBuildStationSolved}
          onClose={closeActiveModal}
        />
      )}

      {/* Interactive Wildlife Discovery Card Modal (Stage 1: DISCOVER / Revision Mode) */}
      {activeDiscoveryTask && (
        <KenyaDiscoveryCardModal
          key={activeDiscoveryTask.id}
          task={activeDiscoveryTask}
          totalCount={KENYA_DISCOVERY_TASKS.length}
          language={language}
          appearance={appearance}
          alreadyDiscovered={discoveredIds.includes(activeDiscoveryTask.id)}
          onPlaySfx={onPlaySfx}
          onSpeakText={speakEnglishText}
          onCompleteDiscovery={handleDiscoverySpotSolved}
          onClose={closeActiveModal}
        />
      )}

      {/* Explorer's Wildlife Field Guide Notebook Modal */}
      {fieldGuideOpen && (
        <WildlifeFieldGuideModal
          language={language}
          appearance={appearance}
          discoveredIds={discoveredIds}
          builtSentences={builtSentences}
          onAutoWalkToSpot={(spotId) => {
            nav.startAutoWalk(spotId);
          }}
          onQuickTravelToSpot={(spotId) => {
            nav.triggerQuickTravel(spotId);
          }}
          onPlaySfx={onPlaySfx}
          onSpeakText={speakEnglishText}
          onClose={() => {
            stopSpeech();
            onPlaySfx('click');
            setFieldGuideOpen(false);
          }}
        />
      )}
    </main>
  );
}
