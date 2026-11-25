import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Coins,
  Compass,
  Gamepad2,
  Gem,
  Info,
  Lock,
  MapPin,
  MessageCircle,
  Moon,
  Music,
  Navigation,
  Pause,
  Play,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Square,
  Sun,
  Trophy,
  Volume2,
  X,
} from 'lucide-react';
import type {
  AppLanguage,
  AvatarConfig,
  CountryWorld,
  EgyptInstructionJournalRecord,
  ResolvedAppearance,
  RewardWallet,
} from '../../types/game';
import { GAME_COPY } from '../../data/i18n';
import {
  EGYPT_INTERACTIVE_TARGETS,
  EGYPT_LANDMARKS,
  EGYPT_NPC_DIALOGUES,
  EGYPT_SPAWN,
  type EgyptLandmarkId,
  type EgyptNpcId,
  type EgyptPoiId,
} from '../../data/egyptWorld';
import {
  EGYPT_DISCOVER_MISSIONS,
  getEgyptDiscoverMissionMeta,
} from '../../data/egyptDiscover';
import {
  EGYPT_BUILD_MISSIONS,
  getEgyptBuildMissionMeta,
} from '../../data/egyptBuild';
import { AvatarPortraitSVG } from '../avatar/AvatarPortraitSVG';
import { VirtualJoystick, type JoystickVector } from '../india/VirtualJoystick';
import { voxAudio } from '../../utils/audioEngine';
import {
  EgyptLandmarkBadgeSVG,
  EgyptNpcPortraitSVG,
} from '../egypt/EgyptSvgArtwork';
import { EgyptExpeditionGuideModal } from '../egypt/EgyptExpeditionGuideModal';
import {
  EgyptDiscoverModal,
  type EgyptDiscoverModalView,
} from '../egypt/EgyptDiscoverModal';
import {
  EgyptBuildModal,
  type EgyptBuildModalView,
} from '../egypt/EgyptBuildModal';
import { EgyptFallback2D } from '../egypt/EgyptFallback2D';
import { useWorldNavigation } from '../../utils/useWorldNavigation';
import { SmartNavigationHud } from '../navigation/SmartNavigationHud';
import type { NavPoint2D } from '../../utils/worldNavigation';

const LazyEgyptExplorationScene = lazy(
  () => import('../egypt/EgyptExplorationScene'),
);

interface EgyptWorldScreenProps {
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
  exploredPoiIds: EgyptLandmarkId[];
  metNpcIds: EgyptNpcId[];
  discoverStarted: boolean;
  completedDiscoverIds: EgyptLandmarkId[];
  nextDiscoverLandmarkId: EgyptLandmarkId | null;
  discoverCompleted: boolean;
  buildUnlocked: boolean;
  buildStarted: boolean;
  completedBuildChallengeIds: string[];
  completedBuildIds: EgyptLandmarkId[];
  nextBuildLandmarkId: EgyptLandmarkId | null;
  buildCompleted: boolean;
  buildJournal: EgyptInstructionJournalRecord[];
  onStartDiscovery: () => void;
  onCompleteDiscoveryMission: (landmarkId: EgyptLandmarkId) => boolean;
  onStartBuild: () => void;
  onRecordBuildChallenge: (record: EgyptInstructionJournalRecord) => void;
  onCompleteBuildMission: (landmarkId: EgyptLandmarkId) => boolean;
  onMarkNpcMet: (npcId: EgyptNpcId) => void;
  onMarkPoiExplored: (landmarkId: EgyptLandmarkId) => void;
  onWebGLFailure: () => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'mode' | 'reward') => void;
  onBackToMap: () => void;
  onOpenPassport: () => void;
  onToggleQuickAppearance: () => void;
  onToggleMusic: () => void;
  onOpenSettings: () => void;
}

export function EgyptWorldScreen({
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
  completedBuildChallengeIds,
  completedBuildIds,
  nextBuildLandmarkId,
  buildCompleted,
  buildJournal,
  onStartDiscovery,
  onCompleteDiscoveryMission,
  onStartBuild,
  onRecordBuildChallenge,
  onCompleteBuildMission,
  onMarkNpcMet,
  onMarkPoiExplored,
  onWebGLFailure,
  onPlaySfx,
  onBackToMap,
  onOpenPassport,
  onToggleQuickAppearance,
  onToggleMusic,
  onOpenSettings,
}: EgyptWorldScreenProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';

  const [showArrivalBanner, setShowArrivalBanner] = useState(true);
  const [nearestPoiId, setNearestPoiId] = useState<EgyptPoiId | null>(null);
  const [activeModalPoiId, setActiveModalPoiId] = useState<EgyptPoiId | null>(null);
  const [npcDialogueStep, setNpcDialogueStep] = useState<0 | 1>(0);
  const [hasSpokenCurrentModal, setHasSpokenCurrentModal] = useState(false);
  const [pauseMenuOpen, setPauseMenuOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [discoverModalView, setDiscoverModalView] =
    useState<EgyptDiscoverModalView | null>(null);
  const [buildModalView, setBuildModalView] =
    useState<EgyptBuildModalView | null>(null);
  const [guideInitialLandmarkId, setGuideInitialLandmarkId] = useState<
    EgyptLandmarkId | undefined
  >(undefined);
  const [guidedPoiId, setGuidedPoiId] = useState<EgyptLandmarkId | null>(null);
  const [interactGestureSeq, setInteractGestureSeq] = useState(0);
  const [cameraSensitivity, setCameraSensitivity] = useState<number>(1.0);
  const [boundaryToast, setBoundaryToast] = useState<string | null>(null);

  const [showTouchPad, setShowTouchPad] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(pointer: coarse)').matches;
  });

  const joystickRef = useRef<JoystickVector>({ x: 0, y: 0 });
  const boundaryTimerRef = useRef<number | null>(null);
  const lastToastZoneRef = useRef<'none' | 'nile' | 'chamber'>('none');

  const handleJoystickChange = useCallback((vec: JoystickVector) => {
    joystickRef.current = vec;
  }, []);

  useEffect(() => {
    const duration = reducedMotion ? 350 : 1400;
    const timer = window.setTimeout(() => setShowArrivalBanner(false), duration);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    return () => {
      if (boundaryTimerRef.current !== null) {
        window.clearTimeout(boundaryTimerRef.current);
      }
    };
  }, []);

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
    (text: string, rate = 0.95, pitch = 1.02) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      stopSpeech();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate;
      utterance.pitch = pitch;
      window.speechSynthesis.speak(utterance);
      setHasSpokenCurrentModal(true);
    },
    [stopSpeech],
  );

  const openPoiInteraction = useCallback(
    (poiId: EgyptPoiId) => {
      if (
        pauseMenuOpen ||
        externalModalOpen ||
        guideOpen ||
        discoverModalView !== null ||
        buildModalView !== null
      ) {
        return;
      }
      stopSpeech();
      onPlaySfx('select');
      setInteractGestureSeq((prev) => prev + 1);
      setNpcDialogueStep(0);
      setHasSpokenCurrentModal(false);
      setActiveModalPoiId(poiId);

      if (
        poiId === 'npc_layla' ||
        poiId === 'npc_omar' ||
        poiId === 'npc_mariam' ||
        poiId === 'npc_karim'
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
      buildModalView,
      discoverModalView,
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
    setHasSpokenCurrentModal(false);
  }, [onPlaySfx, stopSpeech]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        externalModalOpen ||
        guideOpen ||
        discoverModalView !== null ||
        buildModalView !== null
      ) {
        return;
      }
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
    activeModalPoiId,
    buildModalView,
    closeActiveModal,
    discoverModalView,
    externalModalOpen,
    guideOpen,
    nearestPoiId,
    onPlaySfx,
    openPoiInteraction,
    pauseMenuOpen,
  ]);

  const visitedPoiIds: EgyptPoiId[] = [...metNpcIds, ...exploredPoiIds];
  const isPaused =
    externalModalOpen ||
    activeModalPoiId !== null ||
    pauseMenuOpen ||
    guideOpen ||
    discoverModalView !== null ||
    buildModalView !== null;

  const nav = useWorldNavigation({
    worldId: 'egypt',
    language,
    initialPosition: { x: EGYPT_SPAWN.x, z: EGYPT_SPAWN.z },
    isPaused,
    reducedMotion,
    nextMissionState: {
      worldId: 'egypt',
      state: {
        countryUnlocked: true,
        discoverStarted,
        completedDiscoverIds,
        discoverCompleted,
        buildUnlocked,
        buildStarted,
        completedBuildIds,
        buildCompleted,
      },
    },
    onSyncGuideTarget: (targetId) => {
      if (!targetId) {
        setGuidedPoiId(null);
        return;
      }
      if (EGYPT_LANDMARKS.some((l) => l.id === targetId)) {
        setGuidedPoiId(targetId as EgyptLandmarkId);
      } else {
        setGuidedPoiId(null);
      }
    },
  });

  const handlePlayerPositionUpdate = useCallback(
    (pos: NavPoint2D) => {
      nav.handlePlayerPositionChange(pos);

      const nearNile = pos.z >= 14.35;
      const nearChamber = pos.z <= -11.45 && Math.abs(pos.x) <= 5.5;
      const nextZone: 'none' | 'nile' | 'chamber' = nearNile
        ? 'nile'
        : nearChamber
          ? 'chamber'
          : 'none';

      if (nextZone !== lastToastZoneRef.current) {
        lastToastZoneRef.current = nextZone;
        if (nextZone === 'nile') {
          setBoundaryToast(copy.egyptNileWaterBoundaryToast);
          if (boundaryTimerRef.current !== null) window.clearTimeout(boundaryTimerRef.current);
          boundaryTimerRef.current = window.setTimeout(() => setBoundaryToast(null), 3200);
        } else if (nextZone === 'chamber') {
          setBoundaryToast(copy.egyptChamberSealedDoorToast);
          if (boundaryTimerRef.current !== null) window.clearTimeout(boundaryTimerRef.current);
          boundaryTimerRef.current = window.setTimeout(() => setBoundaryToast(null), 3400);
        }
      }
    },
    [copy.egyptChamberSealedDoorToast, copy.egyptNileWaterBoundaryToast, nav],
  );

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
    ? EGYPT_INTERACTIVE_TARGETS.find((p) => p.id === nearestPoiId) ?? null
    : null;

  const activeNpcId: EgyptNpcId | null =
    activeModalPoiId === 'npc_layla' ||
    activeModalPoiId === 'npc_omar' ||
    activeModalPoiId === 'npc_mariam' ||
    activeModalPoiId === 'npc_karim'
      ? activeModalPoiId
      : null;

  const activeNpcEntry = activeNpcId ? EGYPT_NPC_DIALOGUES[activeNpcId] : null;

  const activeLandmark =
    activeModalPoiId && !activeNpcId
      ? EGYPT_LANDMARKS.find((l) => l.id === activeModalPoiId) ?? null
      : null;

  const exploredCount = exploredPoiIds.length;
  const totalLandmarks = EGYPT_LANDMARKS.length;
  const completedDiscoverCount = completedDiscoverIds.length;
  const completedBuildCount = completedBuildIds.length;
  const allLandmarksExplored = exploredCount >= totalLandmarks;

  const isDiscoverStationPlayable = useCallback(
    (landmarkId: EgyptLandmarkId) => {
      if (!discoverStarted) return false;
      return (
        discoverCompleted ||
        completedDiscoverIds.includes(landmarkId) ||
        nextDiscoverLandmarkId === landmarkId
      );
    },
    [completedDiscoverIds, discoverCompleted, discoverStarted, nextDiscoverLandmarkId],
  );

  const isBuildStationPlayable = useCallback(
    (landmarkId: EgyptLandmarkId) => {
      if (!buildUnlocked || !buildStarted) return false;
      return (
        buildCompleted ||
        completedBuildIds.includes(landmarkId) ||
        nextBuildLandmarkId === landmarkId
      );
    },
    [buildCompleted, buildStarted, buildUnlocked, completedBuildIds, nextBuildLandmarkId],
  );

  const openDiscoverIntro = useCallback(() => {
    stopSpeech();
    nav.cancelNavigation('manual');
    setActiveModalPoiId(null);
    setGuideOpen(false);
    setBuildModalView(null);
    onPlaySfx('select');
    setDiscoverModalView({ kind: 'intro' });
  }, [nav, onPlaySfx, stopSpeech]);

  const openDiscoverStation = useCallback(
    (landmarkId: EgyptLandmarkId) => {
      stopSpeech();
      nav.cancelNavigation('manual');
      setActiveModalPoiId(null);
      setGuideOpen(false);
      setBuildModalView(null);
      onPlaySfx('select');
      setDiscoverModalView({ kind: 'station', landmarkId });
    },
    [nav, onPlaySfx, stopSpeech],
  );

  const openDiscoverCelebration = useCallback(() => {
    stopSpeech();
    nav.cancelNavigation('manual');
    setActiveModalPoiId(null);
    setGuideOpen(false);
    setBuildModalView(null);
    onPlaySfx('select');
    setDiscoverModalView({ kind: 'celebration', newlyCompleted: false });
  }, [nav, onPlaySfx, stopSpeech]);

  const openBuildIntro = useCallback(() => {
    stopSpeech();
    nav.cancelNavigation('manual');
    setActiveModalPoiId(null);
    setGuideOpen(false);
    setDiscoverModalView(null);
    onPlaySfx('select');
    setBuildModalView({ kind: 'intro' });
  }, [nav, onPlaySfx, stopSpeech]);

  const openBuildStation = useCallback(
    (landmarkId: EgyptLandmarkId) => {
      stopSpeech();
      nav.cancelNavigation('manual');
      setActiveModalPoiId(null);
      setGuideOpen(false);
      setDiscoverModalView(null);
      onPlaySfx('select');
      setBuildModalView({ kind: 'station', landmarkId });
    },
    [nav, onPlaySfx, stopSpeech],
  );

  const openBuildJournal = useCallback(() => {
    stopSpeech();
    nav.cancelNavigation('manual');
    setActiveModalPoiId(null);
    setGuideOpen(false);
    setDiscoverModalView(null);
    onPlaySfx('select');
    setBuildModalView({ kind: 'journal' });
  }, [nav, onPlaySfx, stopSpeech]);

  const openBuildCelebration = useCallback(() => {
    stopSpeech();
    nav.cancelNavigation('manual');
    setActiveModalPoiId(null);
    setGuideOpen(false);
    setDiscoverModalView(null);
    onPlaySfx('select');
    setBuildModalView({ kind: 'celebration', newlyCompleted: false });
  }, [nav, onPlaySfx, stopSpeech]);

  const hudChipClass = isNight
    ? 'border-white/20 bg-[#121D36]/88 text-[#F7F9FC] hover:bg-[#1E2E4E] shadow-lg'
    : 'border-[#20304A]/15 bg-[#FFFDF8]/92 text-[#20304A] hover:bg-white shadow-[0_6px_18px_rgba(32,48,74,0.12)]';

  const hudPanelClass = isNight
    ? 'border-white/20 bg-[#121D36]/88 text-[#F7F9FC] shadow-lg'
    : 'border-[#20304A]/12 bg-[#FFFDF8]/92 text-[#20304A] shadow-[0_6px_18px_rgba(32,48,74,0.12)]';

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden select-none">
      {/* Full-Screen Walkable 3D Giza & Nile Camp World (or Accessible 2D Fallback) */}
      <div className="absolute inset-0">
        {viewMode === '3d' && webglSupported ? (
          <Suspense
            fallback={
              <EgyptFallback2D
                avatar={avatar}
                language={language}
                appearance={appearance}
                paused={isPaused}
                visitedPoiIds={visitedPoiIds}
                nearestPoiId={nearestPoiId}
                guidedPoiId={guidedPoiId}
                noticeText={copy.egyptFallback2dNotice}
                autoWalkRequest={nav.autoWalkRequest}
                quickTravelRequest={nav.quickTravelRequest}
                onPositionChange={handlePlayerPositionUpdate}
                onAutoWalkComplete={nav.handleSceneAutoWalkComplete}
                onManualInterrupt={nav.handleSceneManualInterrupt}
                onNearestPoiChange={setNearestPoiId}
                onActivatePoi={openPoiInteraction}
              />
            }
          >
            <LazyEgyptExplorationScene
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
              onPositionChange={handlePlayerPositionUpdate}
              onAutoWalkComplete={nav.handleSceneAutoWalkComplete}
              onManualInterrupt={nav.handleSceneManualInterrupt}
              onNearestPoiChange={setNearestPoiId}
              onActivatePoi={openPoiInteraction}
              onWebGLFailure={onWebGLFailure}
            />
          </Suspense>
        ) : (
          <EgyptFallback2D
            avatar={avatar}
            language={language}
            appearance={appearance}
            paused={isPaused}
            visitedPoiIds={visitedPoiIds}
            nearestPoiId={nearestPoiId}
            guidedPoiId={guidedPoiId}
            noticeText={copy.egyptFallback2dNotice}
            autoWalkRequest={nav.autoWalkRequest}
            quickTravelRequest={nav.quickTravelRequest}
            onPositionChange={handlePlayerPositionUpdate}
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
                ? 'border-[#E7B43C]/65 bg-[#121D36]/94'
                : 'border-white bg-[#FFFDF8]/95 shadow-[0_14px_34px_rgba(231,180,60,0.22)]'
            }`}
          >
            <p
              className={`font-display text-lg sm:text-xl font-bold ${
                isNight ? 'text-[#FDE68A]' : 'text-[#B45309]'
              }`}
            >
              {copy.arrivingEgyptTitle}
            </p>
            <p
              className={`mt-0.5 text-xs font-medium ${
                isNight ? 'text-[#E2ECF9]' : 'text-[#48607E]'
              }`}
            >
              {copy.arrivingEgyptSubtitle}
            </p>
          </div>
        </div>
      )}

      {/* Boundary / Sealed Door Gentle Reminder Toast */}
      {boundaryToast && !showArrivalBanner && (
        <div
          aria-live="polite"
          className="pointer-events-none absolute inset-x-0 top-24 z-20 flex justify-center px-4"
        >
          <div
            className={`pointer-events-auto flex items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-bold shadow-xl ${
              isNight
                ? 'border-[#E7B43C]/60 bg-[#1B2542]/94 text-[#FDE68A]'
                : 'border-[#F59E0B]/50 bg-[#FFFBEB]/96 text-[#92400E]'
            }`}
          >
            <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{boundaryToast}</span>
          </div>
        </div>
      )}

      {/* Top Exploration HUD */}
      <header className="pointer-events-none relative z-10 flex items-start justify-between gap-2.5 p-3.5 sm:p-5">
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          <div
            className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-2.5 py-1 text-xs font-bold ${hudPanelClass}`}
          >
            <span
              className={`h-7 w-7 overflow-hidden rounded-lg border ${
                isNight ? 'border-[#E7B43C]/60' : 'border-[#20304A]/15'
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
                    ? 'text-[#FDE68A]'
                    : 'text-[#B45309]'
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
                    isNight
                      ? 'bg-[#E7B43C]/25 text-[#FDE68A]'
                      : 'bg-[#FEF3C7] text-[#92400E]'
                  }`}
                >
                  {discoverCompleted && buildUnlocked
                    ? copy.egyptBuildStageBadge
                    : copy.egyptExploreStageBadge}
                </span>
              </div>
              <p
                className={`text-[11px] leading-tight truncate ${
                  isNight ? 'text-[#CBD5E1]' : 'text-[#48607E]'
                }`}
              >
                {buildCompleted
                  ? copy.egyptBuildPracticeComingSoonTitle
                  : discoverCompleted && buildUnlocked
                    ? !buildStarted
                      ? copy.egyptBuildLockedNeedLayla
                      : `${copy.egyptBuildStationsProgressLabel} (${completedBuildCount}/${totalLandmarks})`
                    : !discoverStarted
                      ? copy.egyptObjectiveMeetAllNpcs
                      : `${copy.egyptObjectiveExplore} (${completedDiscoverCount}/${totalLandmarks})`}
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
                ? 'border-[#E7B43C]/50 bg-[#2C2415]/90 text-[#FDE68A] hover:bg-[#3A2E1A]'
                : 'border-[#D97706]/30 bg-[#FEF3C7]/95 text-[#92400E] hover:bg-[#FDE68A]'
            }`}
          >
            <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{copy.egyptGuideButton}</span>
            <span className="font-mono-num rounded bg-black/10 px-1.5 py-0.5 text-[10px]">
              {discoverCompleted && buildUnlocked
                ? `BUILD ${completedBuildCount}/${totalLandmarks}`
                : `DISCOVER ${completedDiscoverCount}/${totalLandmarks}`}{' '}
              · {copy.egyptHudSitesLabel} {exploredCount}/{totalLandmarks}
            </span>
          </button>

          {discoverCompleted && buildUnlocked && (
            <button
              type="button"
              onClick={openBuildJournal}
              className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-extrabold whitespace-nowrap shrink-0 cursor-pointer ${
                isNight
                  ? 'border-[#12B8B0]/45 bg-[#102A33]/92 text-[#5EEAD4] hover:bg-[#153944]'
                  : 'border-[#0D9488]/30 bg-[#F0FDFA]/95 text-[#0F766E] hover:bg-[#CCFBF1]'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{copy.egyptBuildOpenJournalButton}</span>
              <span className="font-mono-num rounded bg-black/10 px-1.5 py-0.5 text-[10px]">
                {buildJournal.length}/30
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              onPlaySfx('click');
              onOpenPassport();
            }}
            className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer ${hudChipClass}`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#12B8B0]" aria-hidden="true" />
            <span className="font-mono-num">
              {rewards.xp} {copy.xpLabel}
            </span>
            <span className="hidden md:inline-flex items-center gap-1 opacity-90">
              <Coins className="h-3 w-3 text-[#D99B26]" aria-hidden="true" />
              <span className="font-mono-num">{rewards.coins}</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1 opacity-90">
              <Gem className="h-3 w-3 text-[#FF9478]" aria-hidden="true" />
              <span className="font-mono-num">{rewards.gems}</span>
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
                {copy.egyptHudGuidingPrefix}:{' '}
                {EGYPT_LANDMARKS.find((l) => l.id === guidedPoiId)?.title[language]}
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
                ? 'border-[#12B8B0] bg-[#12B8B0] text-[#131E31]'
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

      {/* Smart Navigation HUD (Places Auto-Walk & Quick Travel) */}
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
            discoverCompleted && buildUnlocked
              ? buildStarted
                ? [...completedBuildIds, 'npc_layla']
                : completedBuildIds
              : discoverStarted
                ? discoverCompleted
                  ? [...completedDiscoverIds, 'npc_layla']
                  : completedDiscoverIds
                : []
          }
          visitedIds={visitedPoiIds}
          quickTravelFlashActive={nav.quickTravelFlashActive}
          onGoToNextMission={() => nav.goToNextMission('auto_walk')}
          onStartAutoWalk={(targetId) => nav.startAutoWalk(targetId)}
          onQuickTravel={(targetId) => nav.triggerQuickTravel(targetId)}
          onCancelWalk={(reason) => nav.cancelNavigation(reason)}
          onGuideOnly={(targetId) => {
            if (EGYPT_LANDMARKS.some((l) => l.id === targetId)) {
              setGuidedPoiId(targetId as EgyptLandmarkId);
              nav.setActiveDestinationId(targetId);
            }
          }}
          accentTone="amber"
        />
      )}

      {/* Bottom Floating Interaction Bar & Controls Hint */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex flex-col items-center gap-2 px-4">
        {nearestTarget && !activeModalPoiId && !pauseMenuOpen && !guideOpen && !discoverModalView && !buildModalView && (
          <button
            type="button"
            onClick={() => openPoiInteraction(nearestTarget.id)}
            className="pointer-events-auto inline-flex min-h-[46px] items-center gap-2.5 rounded-2xl border border-white/40 bg-[#E7B43C] px-5 py-2.5 font-display text-sm font-extrabold text-[#131E31] shadow-xl hover:bg-[#F2C66D] active:scale-[0.98] transition-all cursor-pointer"
          >
            {nearestTarget.kind === 'npc' ? (
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span>
              {nearestTarget.kind === 'npc'
                ? `${copy.egyptSpeakWithPrefix}: ${nearestTarget.title[language]}`
                : `${copy.egyptExploreSitePrefix}: ${nearestTarget.title[language]}`}
            </span>
            <span className="rounded-lg bg-black/15 px-2 py-0.5 text-[11px] font-bold">
              {copy.jaipurInteractPromptPrefix}
            </span>
          </button>
        )}

        <div
          className={`rounded-xl border px-3.5 py-1.5 text-[11px] font-semibold shadow-sm ${
            isNight
              ? 'border-white/15 bg-[#09132E]/84 text-[#CBD5E1]'
              : 'border-white bg-[#FFFDF8]/90 text-[#334155]'
          }`}
        >
          {copy.egyptControlsHint}
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

      {/* NPC Introductory Dialogue Modal (Phase 5A Exploration Only) */}
      {activeNpcEntry && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="egypt-npc-dialog-title"
          className={`fixed inset-x-0 bottom-0 z-30 flex justify-center p-3 sm:p-6 ${
            isNight ? 'bg-[#09132E]/50' : 'bg-[#1D2436]/22'
          }`}
        >
          <div
            className={`w-full max-w-2xl rounded-3xl border p-5 sm:p-6 shadow-2xl ${
              isNight
                ? 'border-[#E7B43C]/55 bg-[#121D36] text-[#F8FAFC]'
                : 'border-[#FDE68A] bg-[#FFFDF8] text-[#1E293B]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <EgyptNpcPortraitSVG
                  npcId={activeNpcEntry.id}
                  className="h-16 w-16 shrink-0 rounded-2xl shadow-md"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold text-[#12B8B0]">
                    {activeNpcEntry.role[language]} · {activeNpcEntry.locationName[language]}
                  </p>
                  <h2
                    id="egypt-npc-dialog-title"
                    className="font-display text-lg sm:text-xl font-extrabold truncate"
                  >
                    {activeNpcEntry.name}
                  </h2>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
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
                      : 'border-[#FDE68A] bg-[#FFFBEB] text-[#92400E] hover:bg-[#FEF3C7]'
                  }`}
                >
                  <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {hasSpokenCurrentModal
                      ? copy.egyptReplayDialogue
                      : copy.egyptListenDialogue}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={stopSpeech}
                  className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-bold whitespace-nowrap cursor-pointer ${
                    isNight
                      ? 'border-white/15 bg-white/8 text-[#CBD5E1] hover:bg-white/15'
                      : 'border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <Square className="h-3 w-3" aria-hidden="true" />
                  <span>{copy.egyptStopAudio}</span>
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
                  ? 'border-white/10 bg-[#182544] text-[#F1F5F9]'
                  : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#1E293B]'
              }`}
            >
              {npcDialogueStep === 0
                ? activeNpcEntry.greetingQuote[language]
                : activeNpcEntry.followUpTip[language]}
            </div>

            {activeNpcEntry.chamberGuidanceNote && (
              <div
                className={`mt-3 flex items-start gap-2 rounded-2xl border p-3 text-xs font-semibold ${
                  isNight
                    ? 'border-[#E7B43C]/35 bg-[#2A2013]/80 text-[#FDE68A]'
                    : 'border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]'
                }`}
              >
                <Lock className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{activeNpcEntry.chamberGuidanceNote[language]}</span>
              </div>
            )}

            {/* Stage 1 DISCOVER & Stage 2 BUILD NPC Action Card */}
            {(() => {
              const npcDiscoverStation = EGYPT_DISCOVER_MISSIONS.find(
                (m) => m.guideNpcId === activeNpcEntry.id && !m.viaLandmarkTipOnly,
              );
              const omarDiscoverStation =
                activeNpcEntry.id === 'npc_omar'
                  ? getEgyptDiscoverMissionMeta('giza_pyramid_plaza')
                  : null;
              const relevantDiscoverStation =
                npcDiscoverStation ?? omarDiscoverStation;

              const npcBuildStation = EGYPT_BUILD_MISSIONS.find(
                (m) => m.guideNpcId === activeNpcEntry.id && !m.viaLandmarkTipOnly,
              );
              const omarBuildStation =
                activeNpcEntry.id === 'npc_omar'
                  ? getEgyptBuildMissionMeta('giza_pyramid_plaza')
                  : null;
              const relevantBuildStation = npcBuildStation ?? omarBuildStation;

              if (activeNpcEntry.id === 'npc_layla') {
                if (discoverCompleted && buildUnlocked) {
                  return (
                    <div
                      className={`mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border p-3 ${
                        isNight
                          ? 'border-[#E7B43C]/45 bg-[#1B2542]'
                          : 'border-[#F59E0B]/40 bg-[#FFFBEB]'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-extrabold text-[#0D9488] dark:text-[#5EEAD4]">
                          {copy.egyptBuildStageBadge} ({completedBuildCount}/5)
                        </p>
                        <p className="text-xs font-semibold">
                          {!buildStarted
                            ? copy.egyptBuildLockedNeedLayla
                            : buildCompleted
                              ? copy.egyptBuildStageCompleteTitle
                              : nextBuildLandmarkId
                                ? getEgyptBuildMissionMeta(nextBuildLandmarkId).title[language]
                                : copy.egyptBuildStageCompleteTitle}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={openBuildJournal}
                          className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-bold cursor-pointer ${
                            isNight
                              ? 'border-white/15 bg-white/10 text-[#5EEAD4]'
                              : 'border-[#0D9488]/30 bg-white text-[#0F766E]'
                          }`}
                        >
                          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{copy.egyptBuildOpenJournalButton}</span>
                        </button>

                        {!buildStarted ? (
                          <button
                            type="button"
                            onClick={openBuildIntro}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#E7B43C] px-4 py-2 text-xs font-extrabold text-[#131E31] hover:bg-[#F2C66D] cursor-pointer"
                          >
                            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{copy.egyptBuildPlayWorkshopButton}</span>
                          </button>
                        ) : buildCompleted ? (
                          <button
                            type="button"
                            onClick={openBuildCelebration}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#E7B43C] px-4 py-2 text-xs font-extrabold text-[#131E31] hover:bg-[#F2C66D] cursor-pointer"
                          >
                            <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{copy.egyptBuildCompletedBadge}</span>
                          </button>
                        ) : nextBuildLandmarkId ? (
                          <button
                            type="button"
                            onClick={() => openBuildStation(nextBuildLandmarkId)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0D9488] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#0F766E] cursor-pointer"
                          >
                            <Gamepad2 className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{copy.egyptBuildPlayWorkshopButton}</span>
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    className={`mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border p-3 ${
                      isNight
                        ? 'border-[#12B8B0]/40 bg-[#102A33]'
                        : 'border-[#99F6E4] bg-[#F0FDFA]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-extrabold text-[#0D9488] dark:text-[#5EEAD4]">
                        {copy.egyptDiscoverStageBadge} ({completedDiscoverCount}/5)
                      </p>
                      <p className="text-xs font-semibold">
                        {!discoverStarted
                          ? copy.egyptDiscoverZeroXpStationNote
                          : discoverCompleted
                            ? copy.egyptDiscoverStageCompleteTitle
                            : nextDiscoverLandmarkId
                              ? getEgyptDiscoverMissionMeta(nextDiscoverLandmarkId).title[language]
                              : copy.egyptDiscoverStageCompleteTitle}
                      </p>
                    </div>
                    {!discoverStarted ? (
                      <button
                        type="button"
                        onClick={openDiscoverIntro}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#E7B43C] px-4 py-2 text-xs font-extrabold text-[#131E31] hover:bg-[#F2C66D] cursor-pointer"
                      >
                        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{copy.egyptDiscoverPlayMissionButton}</span>
                      </button>
                    ) : discoverCompleted ? (
                      <button
                        type="button"
                        onClick={openDiscoverCelebration}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#E7B43C] px-4 py-2 text-xs font-extrabold text-[#131E31] hover:bg-[#F2C66D] cursor-pointer"
                      >
                        <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{copy.egyptDiscoverCompletedBadge}</span>
                      </button>
                    ) : nextDiscoverLandmarkId ? (
                      <button
                        type="button"
                        onClick={() => openDiscoverStation(nextDiscoverLandmarkId)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#0D9488] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#0F766E] cursor-pointer"
                      >
                        <Gamepad2 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{copy.egyptDiscoverPlayMissionButton}</span>
                      </button>
                    ) : null}
                  </div>
                );
              }

              if (discoverCompleted && buildUnlocked && relevantBuildStation) {
                const buildStationPlayable = isBuildStationPlayable(
                  relevantBuildStation.landmarkId,
                );
                const buildStationCompleted = completedBuildIds.includes(
                  relevantBuildStation.landmarkId,
                );
                return (
                  <div
                    className={`mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border p-3 ${
                      isNight
                        ? 'border-[#12B8B0]/40 bg-[#102A33]'
                        : 'border-[#99F6E4] bg-[#F0FDFA]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-extrabold text-[#0D9488] dark:text-[#5EEAD4]">
                        {relevantBuildStation.title[language]}
                      </p>
                      <p className="text-xs font-semibold">
                        {!buildStarted
                          ? copy.egyptBuildLockedNeedLayla
                          : !buildStationPlayable && nextBuildLandmarkId
                            ? `${copy.egyptBuildLockedPrevious} ${getEgyptBuildMissionMeta(nextBuildLandmarkId).title[language]}`
                            : relevantBuildStation.mechanicLabel[language]}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {!buildStarted ? (
                        <button
                          type="button"
                          onClick={openBuildIntro}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#E7B43C] px-4 py-2 text-xs font-extrabold text-[#131E31] hover:bg-[#F2C66D] cursor-pointer"
                        >
                          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{copy.egyptBuildPlayWorkshopButton}</span>
                        </button>
                      ) : buildStationPlayable ? (
                        <button
                          type="button"
                          onClick={() => openBuildStation(relevantBuildStation.landmarkId)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0D9488] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#0F766E] cursor-pointer"
                        >
                          <Gamepad2 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            {buildStationCompleted
                              ? copy.egyptBuildReviewWorkshopButton
                              : copy.egyptBuildPlayWorkshopButton}
                          </span>
                        </button>
                      ) : null}

                      {relevantDiscoverStation && (
                        <button
                          type="button"
                          onClick={() => openDiscoverStation(relevantDiscoverStation.landmarkId)}
                          className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-bold cursor-pointer ${
                            isNight
                              ? 'border-white/15 bg-white/10 text-[#CBD5E1]'
                              : 'border-[#CBD5E1] bg-white text-[#334155]'
                          }`}
                        >
                          <span>{copy.egyptDiscoverReviewMissionButton}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              }

              if (!relevantDiscoverStation) return null;
              const stationPlayable = isDiscoverStationPlayable(
                relevantDiscoverStation.landmarkId,
              );
              const stationCompleted = completedDiscoverIds.includes(
                relevantDiscoverStation.landmarkId,
              );

              return (
                <div
                  className={`mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border p-3 ${
                    isNight
                      ? 'border-[#12B8B0]/40 bg-[#102A33]'
                      : 'border-[#99F6E4] bg-[#F0FDFA]'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-extrabold text-[#0D9488] dark:text-[#5EEAD4]">
                      {relevantDiscoverStation.title[language]}
                    </p>
                    <p className="text-xs font-semibold">
                      {!discoverStarted
                        ? copy.egyptDiscoverLockedNeedLayla
                        : !stationPlayable && nextDiscoverLandmarkId
                          ? `${copy.egyptDiscoverLockedPrevious} ${getEgyptDiscoverMissionMeta(nextDiscoverLandmarkId).title[language]}`
                          : relevantDiscoverStation.mechanicLabel[language]}
                    </p>
                  </div>
                  {stationPlayable && (
                    <button
                      type="button"
                      onClick={() => openDiscoverStation(relevantDiscoverStation.landmarkId)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0D9488] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#0F766E] cursor-pointer"
                    >
                      <Gamepad2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {stationCompleted
                          ? copy.egyptDiscoverReviewMissionButton
                          : copy.egyptDiscoverPlayMissionButton}
                      </span>
                    </button>
                  )}
                </div>
              );
            })()}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    onPlaySfx('select');
                    setHasSpokenCurrentModal(false);
                    setNpcDialogueStep((prev) => (prev === 0 ? 1 : 0));
                  }}
                  className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold cursor-pointer ${
                    isNight
                      ? 'border-[#12B8B0]/40 bg-[#102A33] text-[#5EEAD4] hover:bg-[#153944]'
                      : 'border-[#99F6E4] bg-[#F0FDFA] text-[#0F766E] hover:bg-[#CCFBF1]'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.egyptNextTipButton}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeActiveModal();
                    setGuideInitialLandmarkId(undefined);
                    setGuideOpen(true);
                  }}
                  className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold cursor-pointer ${
                    isNight
                      ? 'border-white/15 bg-white/10 text-white hover:bg-white/20'
                      : 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.egyptGuideButton}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={closeActiveModal}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#E7B43C] px-5 py-2 text-xs font-extrabold text-[#131E31] hover:bg-[#F2C66D] cursor-pointer"
              >
                <span>{copy.egyptCloseDialogButton}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Landmark Inspection Modal (Phase 5A Free Exploration Only) */}
      {activeLandmark && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="egypt-landmark-dialog-title"
          className={`fixed inset-x-0 bottom-0 z-30 flex justify-center p-3 sm:p-6 ${
            isNight ? 'bg-[#09132E]/50' : 'bg-[#1D2436]/22'
          }`}
        >
          <div
            className={`w-full max-w-2xl rounded-3xl border p-5 sm:p-6 shadow-2xl ${
              isNight
                ? 'border-[#E7B43C]/55 bg-[#121D36] text-[#F8FAFC]'
                : 'border-[#FDE68A] bg-[#FFFDF8] text-[#1E293B]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <EgyptLandmarkBadgeSVG
                  landmarkId={activeLandmark.id}
                  className="h-16 w-20 shrink-0 rounded-2xl shadow-md"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-[11px] font-extrabold text-[#12B8B0]">
                      {activeLandmark.zoneBadge[language]}
                    </p>
                    {activeLandmark.isSealedInPhase5A && (
                      <span className="inline-flex items-center gap-1 rounded bg-[#1E293B] px-1.5 py-0.5 text-[10px] font-extrabold text-[#FDE68A]">
                        <Lock className="h-2.5 w-2.5" aria-hidden="true" />
                        <span>{copy.egyptChamberSealedBadge}</span>
                      </span>
                    )}
                  </div>
                  <h2
                    id="egypt-landmark-dialog-title"
                    className="font-display text-lg sm:text-xl font-extrabold truncate"
                  >
                    {activeLandmark.title[language]}
                  </h2>
                  <p
                    className={`text-xs truncate ${
                      isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'
                    }`}
                  >
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
              {activeLandmark.isSealedInPhase5A && (
                <div
                  className={`flex items-center gap-2 rounded-2xl border p-3 text-xs font-bold ${
                    isNight
                      ? 'border-[#E7B43C]/45 bg-[#2A2013] text-[#FDE68A]'
                      : 'border-[#F59E0B] bg-[#FFFBEB] text-[#92400E]'
                  }`}
                >
                  <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{copy.egyptChamberSealedBanner}</span>
                </div>
              )}

              <p className="text-sm leading-relaxed">
                {activeLandmark.description[language]}
              </p>

              <div
                className={`rounded-2xl border p-3 text-xs ${
                  isNight
                    ? 'border-white/10 bg-[#182544] text-[#E2E8F0]'
                    : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#334155]'
                }`}
              >
                <p className="font-extrabold text-[#D97706] dark:text-[#FBBF24]">
                  {activeLandmark.isSealedInPhase5A
                    ? copy.egyptFictionalVsHistoricalLabel
                    : copy.egyptGuideCulturalNoteLabel}
                </p>
                <p className="mt-1 leading-relaxed">
                  {activeLandmark.culturalNote[language]}
                </p>
              </div>

              {discoverCompleted && buildUnlocked ? (() => {
                const buildMeta = getEgyptBuildMissionMeta(activeLandmark.id);
                const buildStationCompleted = completedBuildIds.includes(activeLandmark.id);
                const buildStationPlayable = isBuildStationPlayable(activeLandmark.id);
                return (
                  <div
                    className={`rounded-2xl border p-3 text-xs ${
                      isNight
                        ? 'border-[#12B8B0]/35 bg-[#102A33] text-[#CCFBF1]'
                        : 'border-[#99F6E4] bg-[#F0FDFA] text-[#0F766E]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-extrabold">{buildMeta.title[language]}</p>
                          {buildMeta.viaLandmarkTipOnly && (
                            <span className="text-[11px] font-bold opacity-85">
                              · {copy.egyptDiscoverViaGuideTipNote}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 font-semibold opacity-90">
                          {buildMeta.introLine[language]}
                        </p>
                        {!buildStarted ? (
                          <p className="mt-1 font-bold text-[#B45309] dark:text-[#FDE68A]">
                            {copy.egyptBuildLockedNeedLayla}
                          </p>
                        ) : !buildStationPlayable && nextBuildLandmarkId ? (
                          <p className="mt-1 font-bold text-[#B45309] dark:text-[#FDE68A]">
                            {copy.egyptBuildLockedPrevious}{' '}
                            {getEgyptBuildMissionMeta(nextBuildLandmarkId).title[language]}
                          </p>
                        ) : (
                          <div className="mt-1 flex items-center gap-1.5 font-semibold opacity-90">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            <span>{copy.egyptBuildZeroXpStationNote}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                        {!buildStarted ? (
                          <button
                            type="button"
                            onClick={openBuildIntro}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#E7B43C] px-4 py-2 text-xs font-extrabold text-[#131E31] hover:bg-[#F2C66D] cursor-pointer"
                          >
                            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{copy.egyptBuildPlayWorkshopButton}</span>
                          </button>
                        ) : buildStationPlayable ? (
                          <button
                            type="button"
                            onClick={() => openBuildStation(activeLandmark.id)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0D9488] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#0F766E] cursor-pointer"
                          >
                            <Gamepad2 className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>
                              {buildStationCompleted
                                ? copy.egyptBuildReviewWorkshopButton
                                : copy.egyptBuildPlayWorkshopButton}
                            </span>
                          </button>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => openDiscoverStation(activeLandmark.id)}
                          className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-bold cursor-pointer ${
                            isNight
                              ? 'border-white/15 bg-white/10 text-[#CBD5E1]'
                              : 'border-[#CBD5E1] bg-white text-[#334155]'
                          }`}
                        >
                          <span>{copy.egyptDiscoverReviewMissionButton}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })() : (() => {
                const stationMeta = getEgyptDiscoverMissionMeta(activeLandmark.id);
                const stationCompleted = completedDiscoverIds.includes(activeLandmark.id);
                const stationPlayable = isDiscoverStationPlayable(activeLandmark.id);
                return (
                  <div
                    className={`rounded-2xl border p-3 text-xs ${
                      isNight
                        ? 'border-[#12B8B0]/35 bg-[#102A33] text-[#CCFBF1]'
                        : 'border-[#99F6E4] bg-[#F0FDFA] text-[#0F766E]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-extrabold">{stationMeta.title[language]}</p>
                          {stationMeta.viaLandmarkTipOnly && (
                            <span className="text-[11px] font-bold opacity-85">
                              · {copy.egyptDiscoverViaGuideTipNote}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 font-semibold opacity-90">
                          {stationMeta.introLine[language]}
                        </p>
                        {!discoverStarted ? (
                          <p className="mt-1 font-bold text-[#B45309] dark:text-[#FDE68A]">
                            {copy.egyptDiscoverLockedNeedLayla}
                          </p>
                        ) : !stationPlayable && nextDiscoverLandmarkId ? (
                          <p className="mt-1 font-bold text-[#B45309] dark:text-[#FDE68A]">
                            {copy.egyptDiscoverLockedPrevious}{' '}
                            {getEgyptDiscoverMissionMeta(nextDiscoverLandmarkId).title[language]}
                          </p>
                        ) : (
                          <div className="mt-1 flex items-center gap-1.5 font-semibold opacity-90">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            <span>{copy.egyptDiscoverZeroXpStationNote}</span>
                          </div>
                        )}
                      </div>

                      {!discoverStarted ? (
                        <button
                          type="button"
                          onClick={openDiscoverIntro}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#E7B43C] px-4 py-2 text-xs font-extrabold text-[#131E31] hover:bg-[#F2C66D] cursor-pointer shrink-0"
                        >
                          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{copy.egyptDiscoverPlayMissionButton}</span>
                        </button>
                      ) : stationPlayable ? (
                        <button
                          type="button"
                          onClick={() => openDiscoverStation(activeLandmark.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0D9488] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#0F766E] cursor-pointer shrink-0"
                        >
                          <Gamepad2 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            {stationCompleted
                              ? copy.egyptDiscoverReviewMissionButton
                              : copy.egyptDiscoverPlayMissionButton}
                          </span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
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
                      : 'border-[#FDE68A] bg-[#FFFBEB] text-[#92400E] hover:bg-[#FEF3C7]'
                  }`}
                >
                  <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {hasSpokenCurrentModal
                      ? copy.egyptReplayDialogue
                      : copy.egyptListenDialogue}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={stopSpeech}
                  className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold cursor-pointer ${
                    isNight
                      ? 'border-white/15 bg-white/8 text-[#CBD5E1] hover:bg-white/15'
                      : 'border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <Square className="h-3 w-3" aria-hidden="true" />
                  <span>{copy.egyptStopAudio}</span>
                </button>
              </div>

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
                  <span>{copy.egyptGuideButton}</span>
                </button>

                <button
                  type="button"
                  onClick={closeActiveModal}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#E7B43C] px-5 py-2 text-xs font-extrabold text-[#131E31] hover:bg-[#F2C66D] cursor-pointer"
                >
                  <span>{copy.egyptCloseDialogButton}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Egypt Expedition Guide Modal */}
      <EgyptExpeditionGuideModal
        isOpen={guideOpen}
        language={language}
        appearance={appearance}
        exploredLandmarkIds={exploredPoiIds}
        guidedLandmarkId={guidedPoiId}
        initialLandmarkId={guideInitialLandmarkId}
        discoverStarted={discoverStarted}
        completedDiscoverIds={completedDiscoverIds}
        nextDiscoverLandmarkId={nextDiscoverLandmarkId}
        discoverCompleted={discoverCompleted}
        buildUnlocked={buildUnlocked}
        buildStarted={buildStarted}
        completedBuildIds={completedBuildIds}
        nextBuildLandmarkId={nextBuildLandmarkId}
        buildCompleted={buildCompleted}
        buildJournal={buildJournal}
        onStartDiscovery={openDiscoverIntro}
        onLaunchDiscoverGame={openDiscoverStation}
        onOpenDiscoverCelebration={openDiscoverCelebration}
        onStartBuild={openBuildIntro}
        onLaunchBuildGame={openBuildStation}
        onOpenBuildCelebration={openBuildCelebration}
        onGuideToLandmark={(id) => setGuidedPoiId(id)}
        onClearGuide={() => setGuidedPoiId(null)}
        onAutoWalkToLandmark={(id) => nav.startAutoWalk(id)}
        onQuickTravelToLandmark={(id) => nav.triggerQuickTravel(id)}
        onClose={() => setGuideOpen(false)}
        onPlaySfx={onPlaySfx}
      />

      {/* Stage 1 DISCOVER Modal */}
      <EgyptDiscoverModal
        isOpen={discoverModalView !== null}
        view={discoverModalView}
        language={language}
        appearance={appearance}
        completedDiscoverIds={completedDiscoverIds}
        discoverCompleted={discoverCompleted}
        totalXp={rewards.xp}
        buildUnlocked={buildUnlocked}
        onLaunchBuild={openBuildIntro}
        onStartDiscovery={onStartDiscovery}
        onCompleteStation={(landmarkId) => ({
          stageJustCompleted: onCompleteDiscoveryMission(landmarkId),
        })}
        onSwitchView={(nextView) => setDiscoverModalView(nextView)}
        onClose={() => setDiscoverModalView(null)}
        onPlaySfx={onPlaySfx}
      />

      {/* Stage 2 BUILD Modal + Expedition Instruction Journal */}
      <EgyptBuildModal
        isOpen={buildModalView !== null}
        view={buildModalView}
        language={language}
        appearance={appearance}
        completedBuildChallengeIds={completedBuildChallengeIds}
        completedBuildIds={completedBuildIds}
        buildCompleted={buildCompleted}
        buildJournal={buildJournal}
        totalXp={rewards.xp}
        onStartBuild={onStartBuild}
        onRecordBuildChallenge={onRecordBuildChallenge}
        onCompleteStation={(landmarkId) => ({
          stageJustCompleted: onCompleteBuildMission(landmarkId),
        })}
        onSwitchView={(nextView) => setBuildModalView(nextView)}
        onClose={() => setBuildModalView(null)}
        onPlaySfx={onPlaySfx}
      />

      {/* Pause Menu Modal */}
      {pauseMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="egypt-pause-title"
          className={`fixed inset-0 z-40 flex items-center justify-center p-4 ${
            isNight ? 'bg-[#09132E]/78' : 'bg-[#1D2436]/38'
          }`}
        >
          <div
            className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl space-y-5 ${
              isNight
                ? 'border-[#E7B43C]/45 bg-[#121D36] text-[#F8FAFC]'
                : 'border-[#FDE68A] bg-[#FFFDF8] text-[#1E293B]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="egypt-pause-title" className="font-display text-xl font-extrabold">
                  {copy.egyptPauseTitle}
                </h2>
                <p
                  className={`mt-0.5 text-xs ${
                    isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'
                  }`}
                >
                  {copy.egyptPauseSubtitle}
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
                  <SlidersHorizontal className="h-4 w-4 text-[#E7B43C]" aria-hidden="true" />
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
                className="w-full accent-[#E7B43C] cursor-pointer"
              />

              <button
                type="button"
                onClick={() => {
                  onPlaySfx('select');
                  setShowTouchPad((prev) => !prev);
                }}
                className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs font-bold cursor-pointer ${
                  isNight
                    ? 'border-white/15 bg-[#182544] text-white'
                    : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#1E293B]'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Gamepad2 className="h-4 w-4 text-[#12B8B0]" aria-hidden="true" />
                  <span>{showTouchPad ? copy.jaipurTouchPadHide : copy.jaipurTouchPadShow}</span>
                </span>
                <span className="text-[#12B8B0]">
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
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#E7B43C] px-4 py-2.5 font-display text-sm font-extrabold text-[#131E31] hover:bg-[#F2C66D] cursor-pointer"
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                <span>{copy.egyptResumeButton}</span>
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
                    ? 'border-white/15 bg-[#182544] text-white hover:bg-[#22345E]'
                    : 'border-[#CBD5E1] bg-white text-[#1E293B] hover:bg-[#F8FAFC]'
                }`}
              >
                <Settings className="h-4 w-4" aria-hidden="true" />
                <span>{copy.settingsButton}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onPlaySfx('click');
                  setPauseMenuOpen(false);
                  onBackToMap();
                }}
                className={`flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${
                  isNight
                    ? 'border-white/15 bg-[#182544] text-[#FDE68A] hover:bg-[#22345E]'
                    : 'border-[#CBD5E1] bg-white text-[#1E293B] hover:bg-[#F8FAFC]'
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
