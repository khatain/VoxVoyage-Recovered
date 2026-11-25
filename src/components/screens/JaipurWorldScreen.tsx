import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
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
  TrainFront,
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
  AARAV_MISSION_DIALOGUE,
  JAIPUR_INTERACTIVE_TARGETS,
  JAIPUR_SPAWN,
  JAIPUR_VOCAB_OBJECTS,
  WORD_DETECTIVE_XP_REWARD,
  type JaipurPoiId,
  type JaipurVocabObjectId,
} from '../../data/jaipurWorld';
import { SENTENCE_TRAIN_XP_REWARD } from '../../data/jaipurSentenceTrain';
import {
  getSpotAndSpeakChallenge,
  JAIPUR_SPOT_AND_SPEAK_CHALLENGES,
  SPOT_AND_SPEAK_XP_REWARD,
} from '../../data/jaipurSpotAndSpeak';
import { AvatarPortraitSVG } from '../avatar/AvatarPortraitSVG';
import { VirtualJoystick, type JoystickVector } from '../india/VirtualJoystick';
import { JaipurFallback2D } from '../india/JaipurFallback2D';
import { SentenceTrainOverlay } from '../india/SentenceTrainOverlay';
import { SpotAndSpeakPrompt } from '../india/SpotAndSpeakPrompt';
import { FinalJaipurShowcaseOverlay } from '../india/FinalJaipurShowcaseOverlay';
import { JaipurObjectIllustrationSVG } from '../india/JaipurMiniGameArtwork';
import { useWorldNavigation } from '../../utils/useWorldNavigation';
import { SmartNavigationHud } from '../navigation/SmartNavigationHud';

const LazyJaipurExplorationScene = lazy(() => import('../india/JaipurExplorationScene'));

interface JaipurWorldScreenProps {
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
  metAarav: boolean;
  foundObjectIds: JaipurVocabObjectId[];
  wordDetectiveCompleted: boolean;
  buildUnlocked: boolean;
  sentenceTrainCompleted: boolean;
  practiceUnlocked: boolean;
  spotAndSpeakStarted: boolean;
  spotAndSpeakDoneIds: JaipurVocabObjectId[];
  spotAndSpeakCompleted: boolean;
  performUnlocked: boolean;
  showcaseCompleted: boolean;
  completedAt?: string;
  isReplayActive?: boolean;
  replayAttemptNumber?: number;
  canReplayCountry?: boolean;
  wordDetectiveAlreadyRewarded?: boolean;
  sentenceTrainAlreadyRewarded?: boolean;
  spotAndSpeakAlreadyRewarded?: boolean;
  showcaseAlreadyRewarded?: boolean;
  onRequestRestartAttempt?: () => void;
  onRequestReplayCountry?: () => void;
  onMarkMetAarav: () => void;
  onCollectVocabObject: (objectId: JaipurVocabObjectId) => void;
  onCompleteSentenceTrain: () => void;
  onStartSpotAndSpeak: () => void;
  onCompleteSpotAndSpeakObject: (objectId: JaipurVocabObjectId) => void;
  onCompleteFinalShowcase: () => { firstCompletion: boolean };
  onWebGLFailure: () => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'mode' | 'reward') => void;
  onBackToMap: () => void;
  onOpenPassport: () => void;
  onToggleQuickAppearance: () => void;
  onToggleMusic: () => void;
  onOpenSettings: () => void;
}

export function JaipurWorldScreen({
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
  metAarav,
  foundObjectIds,
  wordDetectiveCompleted,
  buildUnlocked,
  sentenceTrainCompleted,
  practiceUnlocked,
  spotAndSpeakStarted,
  spotAndSpeakDoneIds,
  spotAndSpeakCompleted,
  performUnlocked,
  showcaseCompleted,
  completedAt,
  isReplayActive = false,
  replayAttemptNumber,
  canReplayCountry = false,
  wordDetectiveAlreadyRewarded = false,
  sentenceTrainAlreadyRewarded = false,
  spotAndSpeakAlreadyRewarded = false,
  showcaseAlreadyRewarded = false,
  onRequestRestartAttempt,
  onRequestReplayCountry,
  onMarkMetAarav,
  onCollectVocabObject,
  onCompleteSentenceTrain,
  onStartSpotAndSpeak,
  onCompleteSpotAndSpeakObject,
  onCompleteFinalShowcase,
  onWebGLFailure,
  onPlaySfx,
  onBackToMap,
  onOpenPassport,
  onToggleQuickAppearance,
  onToggleMusic,
  onOpenSettings,
}: JaipurWorldScreenProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';

  const [showArrivalBanner, setShowArrivalBanner] = useState(true);
  const [nearestPoiId, setNearestPoiId] = useState<JaipurPoiId | null>(null);
  const [activeModalPoiId, setActiveModalPoiId] = useState<JaipurPoiId | null>(null);
  const [sentenceTrainOpen, setSentenceTrainOpen] = useState(false);
  const [activeSpotSpeakId, setActiveSpotSpeakId] = useState<JaipurVocabObjectId | null>(null);
  const [showcaseOpen, setShowcaseOpen] = useState(false);
  const [pauseMenuOpen, setPauseMenuOpen] = useState(false);
  const [guidedPoiId, setGuidedPoiId] = useState<JaipurPoiId | null>(null);
  const [interactGestureSeq, setInteractGestureSeq] = useState(0);
  const [celebrationSeq, setCelebrationSeq] = useState(0);
  const [celebrationToast, setCelebrationToast] = useState<
    null | { kind: 'word_detective' | 'sentence_train' | 'spot_and_speak'; xpEarned: boolean }
  >(null);
  const [showBuildUnlockNotice, setShowBuildUnlockNotice] = useState(false);
  const [showPracticeUnlockNotice, setShowPracticeUnlockNotice] = useState(false);
  const [showPerformUnlockNotice, setShowPerformUnlockNotice] = useState(false);
  const [discoverySession, setDiscoverySession] = useState<{
    newlyFound: boolean;
    completedNow: boolean;
  }>({ newlyFound: false, completedNow: false });
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
    if (!celebrationToast) return;
    const kind = celebrationToast.kind;
    const timer = window.setTimeout(() => {
      setCelebrationToast(null);
      if (kind === 'word_detective') {
        setShowBuildUnlockNotice(true);
      } else if (kind === 'sentence_train') {
        setShowPracticeUnlockNotice(true);
      } else if (kind === 'spot_and_speak') {
        setShowPerformUnlockNotice(true);
      }
    }, reducedMotion ? 2600 : 3800);
    return () => window.clearTimeout(timer);
  }, [celebrationToast, reducedMotion]);

  useEffect(() => {
    if (!showBuildUnlockNotice) return;
    const timer = window.setTimeout(
      () => setShowBuildUnlockNotice(false),
      reducedMotion ? 4000 : 6500,
    );
    return () => window.clearTimeout(timer);
  }, [showBuildUnlockNotice, reducedMotion]);

  useEffect(() => {
    if (!showPracticeUnlockNotice) return;
    const timer = window.setTimeout(
      () => setShowPracticeUnlockNotice(false),
      reducedMotion ? 4000 : 6500,
    );
    return () => window.clearTimeout(timer);
  }, [showPracticeUnlockNotice, reducedMotion]);

  useEffect(() => {
    if (!showPerformUnlockNotice) return;
    const timer = window.setTimeout(
      () => setShowPerformUnlockNotice(false),
      reducedMotion ? 4000 : 6500,
    );
    return () => window.clearTimeout(timer);
  }, [showPerformUnlockNotice, reducedMotion]);

  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  useEffect(() => {
    return () => stopSpeech();
  }, [stopSpeech]);

  const speakEnglishText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = country.npc.voiceProfile.recommendedRate;
    utterance.pitch = country.npc.voiceProfile.recommendedPitch;
    window.speechSynthesis.speak(utterance);
  };

  const openPoiInteraction = useCallback(
    (poiId: JaipurPoiId) => {
      if (
        externalModalOpen ||
        pauseMenuOpen ||
        sentenceTrainOpen ||
        activeSpotSpeakId !== null ||
        showcaseOpen
      ) {
        return;
      }
      setInteractGestureSeq((n) => n + 1);

      if (poiId === 'local_guide') {
        onPlaySfx('select');
        onMarkMetAarav();
        setDiscoverySession({ newlyFound: false, completedNow: false });
        setActiveModalPoiId(poiId);
        return;
      }

      // Phase 1E: Once Spot & Speak is started with Aarav, interacting with the 5 objects launches Spot & Speak!
      if (practiceUnlocked && spotAndSpeakStarted) {
        onPlaySfx('select');
        setActiveSpotSpeakId(poiId);
        return;
      }

      setActiveModalPoiId(poiId);
      const alreadyFound = foundObjectIds.includes(poiId);
      const nextCount = alreadyFound ? foundObjectIds.length : foundObjectIds.length + 1;
      const completedNow =
        !alreadyFound &&
        !wordDetectiveCompleted &&
        nextCount >= JAIPUR_VOCAB_OBJECTS.length;

      setDiscoverySession({
        newlyFound: !alreadyFound,
        completedNow,
      });
      onCollectVocabObject(poiId);
      onPlaySfx(completedNow ? 'reward' : 'select');
    },
    [
      activeSpotSpeakId,
      externalModalOpen,
      foundObjectIds,
      onCollectVocabObject,
      onMarkMetAarav,
      onPlaySfx,
      pauseMenuOpen,
      practiceUnlocked,
      sentenceTrainOpen,
      showcaseOpen,
      spotAndSpeakStarted,
      wordDetectiveCompleted,
    ],
  );

  const closeActiveModal = useCallback(() => {
    stopSpeech();
    const shouldCelebrate = discoverySession.completedNow;
    onPlaySfx(shouldCelebrate ? 'reward' : 'click');
    setActiveModalPoiId(null);
    if (shouldCelebrate) {
      setCelebrationSeq((n) => n + 1);
      setCelebrationToast({
        kind: 'word_detective',
        xpEarned: !wordDetectiveAlreadyRewarded,
      });
      setDiscoverySession({ newlyFound: false, completedNow: false });
    }
  }, [discoverySession.completedNow, onPlaySfx, stopSpeech, wordDetectiveAlreadyRewarded]);

  const handleOpenSentenceTrain = useCallback(() => {
    if (!buildUnlocked) return;
    stopSpeech();
    onPlaySfx('select');
    setActiveModalPoiId(null);
    setShowBuildUnlockNotice(false);
    setSentenceTrainOpen(true);
  }, [buildUnlocked, onPlaySfx, stopSpeech]);

  const handleFinishSentenceTrain = useCallback(() => {
    const firstAttemptCompletion = !sentenceTrainCompleted;
    onCompleteSentenceTrain();
    setSentenceTrainOpen(false);
    if (firstAttemptCompletion) {
      onPlaySfx('reward');
      setCelebrationSeq((n) => n + 1);
      setCelebrationToast({
        kind: 'sentence_train',
        xpEarned: !sentenceTrainAlreadyRewarded,
      });
    } else {
      onPlaySfx('select');
    }
  }, [onCompleteSentenceTrain, onPlaySfx, sentenceTrainAlreadyRewarded, sentenceTrainCompleted]);

  const handleBeginSpotAndSpeak = useCallback(() => {
    if (!practiceUnlocked) return;
    stopSpeech();
    onPlaySfx('select');
    onStartSpotAndSpeak();
    setShowPracticeUnlockNotice(false);
    setActiveModalPoiId(null);
  }, [onPlaySfx, onStartSpotAndSpeak, practiceUnlocked, stopSpeech]);

  const handleCompleteSpotAndSpeakChallenge = useCallback(
    (objectId: JaipurVocabObjectId) => {
      const alreadyDone = spotAndSpeakDoneIds.includes(objectId);
      const nextCount = alreadyDone
        ? spotAndSpeakDoneIds.length
        : spotAndSpeakDoneIds.length + 1;
      const completedAllNow =
        !alreadyDone &&
        !spotAndSpeakCompleted &&
        nextCount >= JAIPUR_SPOT_AND_SPEAK_CHALLENGES.length;

      onCompleteSpotAndSpeakObject(objectId);
      setActiveSpotSpeakId(null);

      if (completedAllNow) {
        onPlaySfx('reward');
        setCelebrationSeq((n) => n + 1);
        setCelebrationToast({
          kind: 'spot_and_speak',
          xpEarned: !spotAndSpeakAlreadyRewarded,
        });
      } else {
        onPlaySfx('select');
      }
    },
    [
      onCompleteSpotAndSpeakObject,
      onPlaySfx,
      spotAndSpeakAlreadyRewarded,
      spotAndSpeakCompleted,
      spotAndSpeakDoneIds,
    ],
  );

  const handleOpenFinalShowcase = useCallback(() => {
    if (!performUnlocked) return;
    stopSpeech();
    onPlaySfx('select');
    setActiveModalPoiId(null);
    setShowPerformUnlockNotice(false);
    setShowcaseOpen(true);
  }, [onPlaySfx, performUnlocked, stopSpeech]);

  const handleCompleteShowcase = useCallback(() => {
    const result = onCompleteFinalShowcase();
    setShowPerformUnlockNotice(false);
    onPlaySfx('reward');
    setCelebrationSeq((n) => n + 1);
    return result;
  }, [onCompleteFinalShowcase, onPlaySfx]);

  // Keyboard shortcuts: E / Enter to interact when near target, Escape to close bubble/pause
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (externalModalOpen || sentenceTrainOpen || activeSpotSpeakId !== null || showcaseOpen) {
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
    activeSpotSpeakId,
    closeActiveModal,
    externalModalOpen,
    nearestPoiId,
    onPlaySfx,
    openPoiInteraction,
    pauseMenuOpen,
    sentenceTrainOpen,
    showcaseOpen,
  ]);

  const aaravMarkedVisited =
    showcaseCompleted ||
    (practiceUnlocked && spotAndSpeakStarted && !spotAndSpeakCompleted) ||
    (metAarav && !wordDetectiveCompleted);

  const activeObjectVisitedIds: JaipurVocabObjectId[] =
    practiceUnlocked && spotAndSpeakStarted ? spotAndSpeakDoneIds : foundObjectIds;

  const exploredPoiIds: JaipurPoiId[] = aaravMarkedVisited
    ? ['local_guide', ...activeObjectVisitedIds]
    : [...activeObjectVisitedIds];

  const isPaused =
    externalModalOpen ||
    activeModalPoiId !== null ||
    pauseMenuOpen ||
    sentenceTrainOpen ||
    activeSpotSpeakId !== null ||
    showcaseOpen;

  const nav = useWorldNavigation({
    worldId: 'india',
    language,
    initialPosition: { x: JAIPUR_SPAWN.x, z: JAIPUR_SPAWN.z },
    isPaused,
    reducedMotion,
    nextMissionState: {
      worldId: 'india',
      state: {
        countryUnlocked: true,
        metAarav,
        foundObjectIds,
        wordDetectiveCompleted,
        buildUnlocked,
        sentenceTrainCompleted,
        practiceUnlocked,
        spotAndSpeakStarted,
        spotAndSpeakCompletedIds: spotAndSpeakDoneIds,
        spotAndSpeakCompleted,
        performUnlocked,
        showcaseCompleted,
      },
    },
    onSyncGuideTarget: (targetId) => {
      setGuidedPoiId(targetId ? (targetId as JaipurPoiId) : null);
    },
  });

  useEffect(() => {
    if (isPaused) {
      joystickRef.current = { x: 0, y: 0 };
    }
  }, [isPaused]);
  const nearestTarget = nearestPoiId
    ? JAIPUR_INTERACTIVE_TARGETS.find((p) => p.id === nearestPoiId) ?? null
    : null;
  const activeVocabObject =
    activeModalPoiId && activeModalPoiId !== 'local_guide'
      ? JAIPUR_VOCAB_OBJECTS.find((obj) => obj.id === activeModalPoiId) ?? null
      : null;

  const totalObjects = JAIPUR_VOCAB_OBJECTS.length;
  const foundCount = foundObjectIds.length;
  const spotSpeakDoneCount = spotAndSpeakDoneIds.length;

  const nextSpotToVisit =
    practiceUnlocked && spotAndSpeakStarted && !spotAndSpeakCompleted
      ? JAIPUR_SPOT_AND_SPEAK_CHALLENGES.find((c) => !spotAndSpeakDoneIds.includes(c.id)) ?? null
      : null;

  const currentObjectiveText = showcaseCompleted
    ? copy.jaipurObjectiveMissionComplete
    : performUnlocked && spotAndSpeakCompleted
      ? copy.jaipurObjectiveTalkAaravPerform
      : spotAndSpeakCompleted
        ? copy.jaipurObjectivePerformUnlocked
        : practiceUnlocked && spotAndSpeakStarted
          ? nextSpotToVisit
            ? `${copy.spotSpeakNextSpotPrefix} ${nextSpotToVisit.title[language]}`
            : copy.jaipurObjectiveSpotAndSpeak
          : practiceUnlocked
            ? copy.jaipurObjectiveTalkAaravPractice
            : wordDetectiveCompleted && buildUnlocked
              ? copy.jaipurObjectiveTalkAaravBuild
              : !metAarav
                ? copy.jaipurObjectiveTalkAarav
                : copy.jaipurObjectiveFindObjects;

  const hudCounterLabel =
    practiceUnlocked && spotAndSpeakStarted
      ? `${copy.spotSpeakProgressLabel}: ${spotSpeakDoneCount}/${totalObjects}`
      : `${copy.jaipurObjectsFoundLabel}: ${foundCount}/${totalObjects}`;

  const aaravDialogueText = showcaseCompleted
    ? AARAV_MISSION_DIALOGUE.showcaseCompleted
    : performUnlocked && spotAndSpeakCompleted
      ? AARAV_MISSION_DIALOGUE.performReady
      : practiceUnlocked && spotAndSpeakStarted
        ? AARAV_MISSION_DIALOGUE.spotAndSpeakActive(spotSpeakDoneCount, totalObjects)
        : practiceUnlocked
          ? AARAV_MISSION_DIALOGUE.practiceReady
          : wordDetectiveCompleted && buildUnlocked
            ? AARAV_MISSION_DIALOGUE.completed
            : foundCount > 0
              ? AARAV_MISSION_DIALOGUE.inProgress(foundCount, totalObjects)
              : AARAV_MISSION_DIALOGUE.intro;

  const hudChipClass = isNight
    ? 'border-white/20 bg-[#131E31]/88 text-[#F7F9FC] hover:bg-[#1E2E49] shadow-lg'
    : 'border-[#20304A]/15 bg-[#FFFDF8]/92 text-[#20304A] hover:bg-white shadow-[0_6px_18px_rgba(32,48,74,0.12)]';

  const hudPanelClass = isNight
    ? 'border-white/20 bg-[#131E31]/88 text-[#F7F9FC] shadow-lg'
    : 'border-[#20304A]/12 bg-[#FFFDF8]/92 text-[#20304A] shadow-[0_6px_18px_rgba(32,48,74,0.12)]';

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden select-none">
      {/* Full-Screen Walkable 3D Jaipur World (or Accessible 2D Fallback) */}
      <div className="absolute inset-0">
        {viewMode === '3d' && webglSupported ? (
          <Suspense
            fallback={
              <JaipurFallback2D
                avatar={avatar}
                language={language}
                appearance={appearance}
                paused={isPaused}
                exploredPoiIds={exploredPoiIds}
                nearestPoiId={nearestPoiId}
                guidedPoiId={guidedPoiId}
                noticeText={copy.jaipurFallback2dObjectiveNotice}
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
            <LazyJaipurExplorationScene
              avatar={avatar}
              appearance={appearance}
              reducedMotion={reducedMotion}
              cameraSensitivity={cameraSensitivity}
              paused={isPaused}
              exploredPoiIds={exploredPoiIds}
              guidedPoiId={guidedPoiId}
              activeDialogueOpen={activeModalPoiId === 'local_guide'}
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
          <JaipurFallback2D
            avatar={avatar}
            language={language}
            appearance={appearance}
            paused={isPaused}
            exploredPoiIds={exploredPoiIds}
            nearestPoiId={nearestPoiId}
            guidedPoiId={guidedPoiId}
            noticeText={copy.jaipurFallback2dObjectiveNotice}
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
                isNight ? 'text-[#F2C66D]' : 'text-[#C4503B]'
              }`}
            >
              {copy.arrivingJaipurTitle}
            </p>
            <p
              className={`mt-0.5 text-xs font-medium ${
                isNight ? 'text-[#E2ECF9]' : 'text-[#48607E]'
              }`}
            >
              {copy.arrivingJaipurSubtitle}
            </p>
          </div>
        </div>
      )}

      {/* Celebratory Completion Banner (+50 XP for Word Detective, Sentence Train, or Spot & Speak) */}
      {celebrationToast && (
        <div
          aria-live="polite"
          className="pointer-events-none absolute inset-x-0 top-24 z-20 flex justify-center px-4"
        >
          <div
            className={`rounded-2xl border-2 px-6 py-3.5 text-center shadow-2xl ${
              isNight
                ? 'border-[#2ED6A3] bg-[#102A2E]/95 text-[#F7F9FC]'
                : 'border-[#24B8B0] bg-[#E9FBF7]/96 text-[#132938]'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-[#F2C66D]" aria-hidden="true" />
              <p className="font-display text-base sm:text-lg font-extrabold">
                {celebrationToast.kind === 'word_detective'
                  ? copy.jaipurCelebrationTitle
                  : celebrationToast.kind === 'sentence_train'
                    ? copy.sentenceTrainCelebrateTitle
                    : copy.spotSpeakCelebrateTitle}
              </p>
              {celebrationToast.xpEarned ? (
                <span className="rounded-lg bg-[#F2C66D] px-2 py-0.5 font-mono-num text-xs font-extrabold text-[#131E31]">
                  +
                  {celebrationToast.kind === 'word_detective'
                    ? WORD_DETECTIVE_XP_REWARD
                    : celebrationToast.kind === 'sentence_train'
                      ? SENTENCE_TRAIN_XP_REWARD
                      : SPOT_AND_SPEAK_XP_REWARD}{' '}
                  {copy.xpLabel}
                </span>
              ) : (
                <span className="rounded-lg bg-[#2ED6A3]/25 px-2 py-0.5 text-[11px] font-extrabold text-[#0E7A74] dark:text-[#2ED6A3]">
                  {copy.replayNoExtraXpLabel}
                </span>
              )}
            </div>
            <p
              className={`mt-0.5 text-xs font-medium ${
                isNight ? 'text-[#C8EAE1]' : 'text-[#285A66]'
              }`}
            >
              {celebrationToast.kind === 'word_detective'
                ? copy.jaipurCelebrationSubtitle
                : celebrationToast.kind === 'sentence_train'
                  ? copy.sentenceTrainCelebrateSubtitle
                  : copy.spotSpeakCelebrateSubtitle}
            </p>
          </div>
        </div>
      )}

      {/* Small New-Mission Notification guiding back to Aarav when BUILD unlocks */}
      {!celebrationToast &&
        !isPaused &&
        (showBuildUnlockNotice || (buildUnlocked && !sentenceTrainCompleted && !showArrivalBanner)) && (
          <div
            aria-live="polite"
            className="pointer-events-none absolute inset-x-0 top-20 z-10 flex justify-center px-4"
          >
            <div
              className={`inline-flex items-center gap-2.5 rounded-2xl border px-4 py-2 text-xs shadow-lg ${
                isNight
                  ? 'border-[#F2C66D]/55 bg-[#121C36]/92 text-[#F7F9FC]'
                  : 'border-[#F2C66D] bg-[#FFF8E6]/96 text-[#20304A]'
              }`}
            >
              <TrainFront className="h-4 w-4 shrink-0 text-[#D99B26]" aria-hidden="true" />
              <span>
                <strong className="font-display font-bold">
                  {copy.jaipurBuildUnlockedNoticeTitle}
                </strong>{' '}
                <span aria-hidden="true">·</span> {copy.jaipurBuildUnlockedNoticeBody}
              </span>
            </div>
          </div>
        )}

      {/* Small New-Mission Notification guiding back to Aarav when PRACTICE (Spot & Speak) unlocks */}
      {!celebrationToast &&
        !isPaused &&
        (showPracticeUnlockNotice ||
          (practiceUnlocked && !spotAndSpeakStarted && !spotAndSpeakCompleted && !showArrivalBanner)) && (
          <div
            aria-live="polite"
            className="pointer-events-none absolute inset-x-0 top-20 z-10 flex justify-center px-4"
          >
            <div
              className={`inline-flex items-center gap-2.5 rounded-2xl border px-4 py-2 text-xs shadow-lg ${
                isNight
                  ? 'border-[#2ED6A3]/55 bg-[#121C36]/92 text-[#F7F9FC]'
                  : 'border-[#24B8B0] bg-[#E9FBF7]/96 text-[#132938]'
              }`}
            >
              <Sparkles className="h-4 w-4 shrink-0 text-[#24B8B0]" aria-hidden="true" />
              <span>
                <strong className="font-display font-bold">
                  {copy.jaipurPracticeUnlockNoticeTitle}
                </strong>{' '}
                <span aria-hidden="true">·</span> {copy.jaipurPracticeUnlockNoticeBody}
              </span>
            </div>
          </div>
        )}

      {/* Small New-Mission Notification guiding back to Aarav when PERFORM (Final Showcase) unlocks */}
      {!celebrationToast &&
        !isPaused &&
        (showPerformUnlockNotice ||
          (performUnlocked && !showcaseCompleted && !showArrivalBanner)) && (
          <div
            aria-live="polite"
            className="pointer-events-none absolute inset-x-0 top-20 z-10 flex justify-center px-4"
          >
            <div
              className={`inline-flex items-center gap-2.5 rounded-2xl border px-4 py-2 text-xs shadow-lg ${
                isNight
                  ? 'border-[#F2C66D]/60 bg-[#121C36]/92 text-[#F7F9FC]'
                  : 'border-[#F2C66D] bg-[#FFF8E6]/96 text-[#20304A]'
              }`}
            >
              <Award className="h-4 w-4 shrink-0 text-[#D99B26]" aria-hidden="true" />
              <span>
                <strong className="font-display font-bold">
                  {copy.jaipurPerformUnlockNoticeTitle}
                </strong>{' '}
                <span aria-hidden="true">·</span> {copy.jaipurPerformUnlockNoticeBody}
              </span>
            </div>
          </div>
        )}

      {/* Minimal Adventure Game HUD (Avatar · Current Objective & Progress · XP · Pause/Settings) */}
      <header className="pointer-events-none relative z-10 flex items-start justify-between gap-2.5 p-3.5 sm:p-5">
        {/* Top-Left: Explorer Avatar + Current Objective + Stage Counter */}
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
            {showcaseCompleted ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2ED6A3]" aria-hidden="true" />
            ) : (
              <MapPin
                className={`h-4 w-4 shrink-0 ${isNight ? 'text-[#F2C66D]' : 'text-[#C4503B]'}`}
                aria-hidden="true"
              />
            )}
            <span className="font-display font-bold">{currentObjectiveText}</span>
            <span
              className={`h-3.5 w-px ${isNight ? 'bg-white/20' : 'bg-[#20304A]/15'}`}
              aria-hidden="true"
            />
            <span
              className={`font-mono-num font-extrabold ${
                (practiceUnlocked && spotAndSpeakStarted ? spotAndSpeakCompleted : wordDetectiveCompleted)
                  ? isNight
                    ? 'text-[#2ED6A3]'
                    : 'text-[#0E7A74]'
                  : isNight
                    ? 'text-[#F2C66D]'
                    : 'text-[#C4503B]'
              }`}
            >
              {hudCounterLabel}
            </span>
          </div>
        </div>

        {/* Top-Right: Compact Replay Indicator + XP Indicator + Pause / Settings Button */}
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
            <span className={isNight ? 'text-[#B6C7DE]' : 'text-[#48607E]'}>
              {copy.xpLabel}
            </span>
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
          completedIds={activeObjectVisitedIds}
          visitedIds={exploredPoiIds}
          quickTravelFlashActive={nav.quickTravelFlashActive}
          onGoToNextMission={() => nav.goToNextMission('auto_walk')}
          onStartAutoWalk={(targetId) => nav.startAutoWalk(targetId)}
          onQuickTravel={(targetId) => nav.triggerQuickTravel(targetId)}
          onCancelWalk={(reason) => nav.cancelNavigation(reason)}
          onGuideOnly={(targetId) => {
            setGuidedPoiId(targetId as JaipurPoiId);
            nav.setActiveDestinationId(targetId);
          }}
          accentTone="amber"
        />
      )}

      {/* Bottom Controls HUD: Virtual Joystick / Movement Hint + Contextual Interaction Button */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-4 sm:p-6">
        {/* Bottom-Left: Touch Virtual Joystick + Compact Control Hint */}
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

        {/* Bottom-Right: Contextual Interaction Button (Aarav or 5 Word Detective Objects) */}
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
                    ? copy.jaipurSpeakWithAarav
                    : practiceUnlocked && spotAndSpeakStarted
                      ? copy.jaipurSpeakHerePrompt
                      : copy.jaipurInspectLandmark}
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
          aria-labelledby="jaipur-pause-title"
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
              <h2 id="jaipur-pause-title" className="font-display text-xl font-extrabold">
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
                  onOpenPassport();
                }}
                className={`inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${hudChipClass}`}
              >
                <BookOpen className="h-4 w-4 text-[#D99B26]" aria-hidden="true" />
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

      {/* Compact Game-Style Dialogue Bubble (Aarav) OR Word Detective Discovery Card */}
      {activeModalPoiId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="jaipur-poi-modal-title"
          className={`fixed inset-0 z-30 flex items-end justify-center p-4 sm:p-6 ${
            isNight ? 'bg-[#090F1E]/55' : 'bg-[#20304A]/20'
          }`}
        >
          {activeModalPoiId === 'local_guide' ? (
            /* Aarav Sharma Compact Game Dialogue Bubble */
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
                      id="jaipur-poi-modal-title"
                      className={`font-display text-base sm:text-lg font-extrabold ${
                        isNight ? 'text-[#F2C66D]' : 'text-[#C4503B]'
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
                        {practiceUnlocked && spotAndSpeakStarted
                          ? `${spotSpeakDoneCount}/${totalObjects}`
                          : `${foundCount}/${totalObjects}`}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => speakEnglishText(aaravDialogueText.en)}
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
                  “{aaravDialogueText[language]}”
                </p>
                {language === 'th' && (
                  <p
                    className={`mt-2 border-t pt-2 text-xs leading-relaxed ${
                      isNight
                        ? 'border-white/10 text-[#B6C7DE]'
                        : 'border-[#20304A]/10 text-[#4F6482]'
                    }`}
                  >
                    “{aaravDialogueText.en}”
                  </p>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-end gap-2.5">
                {buildUnlocked && !sentenceTrainCompleted ? (
                  <button
                    type="button"
                    onClick={handleOpenSentenceTrain}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#f7d487] cursor-pointer"
                  >
                    <TrainFront className="h-4 w-4" aria-hidden="true" />
                    <span>{copy.jaipurStartSentenceTrainButton}</span>
                  </button>
                ) : practiceUnlocked && !spotAndSpeakStarted ? (
                  <>
                    <button
                      type="button"
                      onClick={handleOpenSentenceTrain}
                      className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-4 py-2 font-display text-xs sm:text-sm font-bold cursor-pointer ${
                        isNight
                          ? 'border-[#F2C66D]/45 bg-[#1D2C46] text-[#F2C66D] hover:bg-[#273B5E]'
                          : 'border-[#E0A938]/55 bg-[#FFF9E6] text-[#8E5B08] hover:bg-[#FFF2CC]'
                      }`}
                    >
                      <TrainFront className="h-4 w-4" aria-hidden="true" />
                      <span>{copy.jaipurReplaySentenceTrainButton}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleBeginSpotAndSpeak}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#49e2b3] cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                      <span>{copy.jaipurStartSpotAndSpeakButton}</span>
                    </button>
                  </>
                ) : performUnlocked && spotAndSpeakCompleted ? (
                  <>
                    <button
                      type="button"
                      onClick={handleOpenSentenceTrain}
                      className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-4 py-2 font-display text-xs sm:text-sm font-bold cursor-pointer ${
                        isNight
                          ? 'border-[#F2C66D]/45 bg-[#1D2C46] text-[#F2C66D] hover:bg-[#273B5E]'
                          : 'border-[#E0A938]/55 bg-[#FFF9E6] text-[#8E5B08] hover:bg-[#FFF2CC]'
                      }`}
                    >
                      <TrainFront className="h-4 w-4" aria-hidden="true" />
                      <span>{copy.jaipurReplaySentenceTrainButton}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenFinalShowcase}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#f7d487] cursor-pointer"
                    >
                      <Award className="h-4 w-4" aria-hidden="true" />
                      <span>
                        {showcaseCompleted
                          ? copy.jaipurReplayFinalShowcaseButton
                          : copy.jaipurStartFinalShowcaseButton}
                      </span>
                    </button>
                  </>
                ) : practiceUnlocked && spotAndSpeakStarted ? (
                  <>
                    <button
                      type="button"
                      onClick={handleOpenSentenceTrain}
                      className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-4 py-2 font-display text-xs sm:text-sm font-bold cursor-pointer ${
                        isNight
                          ? 'border-[#F2C66D]/45 bg-[#1D2C46] text-[#F2C66D] hover:bg-[#273B5E]'
                          : 'border-[#E0A938]/55 bg-[#FFF9E6] text-[#8E5B08] hover:bg-[#FFF2CC]'
                      }`}
                    >
                      <TrainFront className="h-4 w-4" aria-hidden="true" />
                      <span>{copy.jaipurReplaySentenceTrainButton}</span>
                    </button>
                    <button
                      type="button"
                      onClick={closeActiveModal}
                      className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#49e2b3] cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      <span>
                        {spotAndSpeakCompleted
                          ? copy.closeSettings
                          : copy.jaipurStartExploringButton}
                      </span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={closeActiveModal}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#49e2b3] cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    <span>{copy.jaipurStartExploringButton}</span>
                  </button>
                )}
              </div>
            </div>
          ) : activeVocabObject ? (
            /* Word Detective Discovery Card */
            <div
              className={`w-full max-w-lg overflow-hidden rounded-3xl border-2 transition-colors ${
                isNight
                  ? 'border-[#F2C66D]/60 bg-[#121C36]/97 text-[#F7F9FC] shadow-2xl'
                  : 'border-[#E5B88E] bg-[#FFFDF8]/98 text-[#1E2E46] shadow-[0_22px_48px_rgba(32,48,74,0.22)]'
              }`}
            >
              {/* Jaipur Terracotta & Gold Top Accent */}
              <div
                className="h-2 w-full"
                aria-hidden="true"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, #E07A68 0%, #F2C66D 50%, #24B8B0 100%)',
                }}
              />

              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative shrink-0">
                      <JaipurObjectIllustrationSVG
                        objectId={activeVocabObject.id}
                        isNight={isNight}
                        className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border-2 border-[#F2C66D]/80 shadow-md"
                      />
                      <span
                        style={{ backgroundColor: activeVocabObject.accentColor }}
                        className="absolute -bottom-1.5 -right-1.5 rounded-lg border-2 border-white px-2 py-0.5 font-mono-num text-[11px] font-extrabold text-white shadow"
                      >
                        {activeVocabObject.order}/{totalObjects}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`text-[11px] font-extrabold uppercase tracking-wider ${
                          discoverySession.newlyFound
                            ? isNight
                              ? 'text-[#2ED6A3]'
                              : 'text-[#0E7A74]'
                            : isNight
                              ? 'text-[#F2C66D]'
                              : 'text-[#966109]'
                        }`}
                      >
                        {discoverySession.newlyFound
                          ? copy.jaipurWordFoundBadge
                          : copy.jaipurWordAlreadyFoundBadge}
                      </p>
                      <h2
                        id="jaipur-poi-modal-title"
                        className={`mt-0.5 font-display text-xl sm:text-2xl font-extrabold leading-tight ${
                          isNight ? 'text-[#F2C66D]' : 'text-[#C4503B]'
                        }`}
                      >
                        {activeVocabObject.word.en}
                      </h2>
                      {language === 'th' && (
                        <p
                          className={`mt-0.5 text-xs font-semibold ${
                            isNight ? 'text-[#B6C7DE]' : 'text-[#4F6482]'
                          }`}
                        >
                          {activeVocabObject.word.th}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={closeActiveModal}
                    aria-label={copy.closeSettings}
                    className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border cursor-pointer ${
                      isNight
                        ? 'border-white/20 bg-[#1D2C46] text-[#F7F9FC] hover:bg-[#273B5E]'
                        : 'border-[#20304A]/15 bg-[#EEF4FA] text-[#20304A] hover:bg-[#DCE8F5]'
                    }`}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                {/* Illustrated Bilingual Sentence Scroll Card */}
                <div
                  className={`mt-4 rounded-2xl border p-4 shadow-xs ${
                    isNight
                      ? 'border-[#F2C66D]/25 bg-[#1A2847]'
                      : 'border-[#E6CCB0] bg-[#FFF7EA]'
                  }`}
                >
                  <p
                    className={`text-sm sm:text-base font-semibold leading-relaxed ${
                      isNight ? 'text-[#F7F9FC]' : 'text-[#1E2E46]'
                    }`}
                  >
                    “{activeVocabObject.exampleSentence.en}”
                  </p>
                  {language === 'th' && (
                    <p
                      className={`mt-1.5 border-t pt-1.5 text-xs leading-relaxed ${
                        isNight
                          ? 'border-white/10 text-[#B6C7DE]'
                          : 'border-[#D9B896]/50 text-[#5C442E]'
                      }`}
                    >
                      {activeVocabObject.exampleSentence.th}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      speakEnglishText(
                        `${activeVocabObject.word.en}. ${activeVocabObject.exampleSentence.en}`,
                      )
                    }
                    className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer shadow-xs ${
                      isNight
                        ? 'border-[#24B8B0]/45 bg-[#143640] text-[#E6FAF5] hover:bg-[#1B4855]'
                        : 'border-[#24B8B0]/35 bg-[#E6F5FB] text-[#0E7A74] hover:bg-[#D4ECF8]'
                    }`}
                  >
                    <Volume2 className="h-4 w-4 text-[#24B8B0]" aria-hidden="true" />
                    <span>{copy.jaipurListenButton}</span>
                  </button>

                  <button
                    type="button"
                    onClick={closeActiveModal}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#F2C66D] px-5 py-2 font-display text-sm font-extrabold text-[#131E31] shadow-md hover:bg-[#f7d487] active:scale-[0.98] transition-transform cursor-pointer"
                  >
                    <span>{copy.jaipurNextButton}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Phase 1D: BUILD Stage — Sentence Train Interactive Mini-Game Overlay */}
      {sentenceTrainOpen && buildUnlocked && (
        <SentenceTrainOverlay
          language={language}
          appearance={appearance}
          reducedMotion={reducedMotion}
          alreadyCompleted={sentenceTrainCompleted}
          onPlaySfx={onPlaySfx}
          onSpeakText={speakEnglishText}
          onStopSpeech={stopSpeech}
          onClose={() => setSentenceTrainOpen(false)}
          onFinishAllChallenges={handleFinishSentenceTrain}
        />
      )}

      {/* Phase 1E: PRACTICE Stage — Spot & Speak Guided Speaking Prompt */}
      {activeSpotSpeakId &&
        practiceUnlocked &&
        (() => {
          const challenge = getSpotAndSpeakChallenge(activeSpotSpeakId);
          if (!challenge) return null;
          return (
            <SpotAndSpeakPrompt
              key={challenge.id}
              challenge={challenge}
              language={language}
              appearance={appearance}
              alreadyDone={spotAndSpeakDoneIds.includes(challenge.id)}
              completedCount={spotSpeakDoneCount}
              totalCount={JAIPUR_SPOT_AND_SPEAK_CHALLENGES.length}
              onPlaySfx={onPlaySfx}
              onSpeakText={speakEnglishText}
              onStopSpeech={stopSpeech}
              onCompleteChallenge={() => handleCompleteSpotAndSpeakChallenge(challenge.id)}
              onClose={() => setActiveSpotSpeakId(null)}
            />
          );
        })()}

      {/* Phase 1F: PERFORM Stage — Final Jaipur Showcase & India Passport Stamp Ceremony */}
      {showcaseOpen && performUnlocked && (
        <FinalJaipurShowcaseOverlay
          language={language}
          appearance={appearance}
          reducedMotion={reducedMotion}
          alreadyCompleted={showcaseCompleted || showcaseAlreadyRewarded}
          totalJaipurXp={rewards.xp}
          completedAt={completedAt}
          onPlaySfx={onPlaySfx}
          onSpeakText={speakEnglishText}
          onStopSpeech={stopSpeech}
          onCompleteShowcase={handleCompleteShowcase}
          onViewPassport={() => {
            setShowcaseOpen(false);
            onOpenPassport();
          }}
          onReturnWorldMap={() => {
            setShowcaseOpen(false);
            onBackToMap();
          }}
          onClose={() => setShowcaseOpen(false)}
        />
      )}
    </main>
  );
}
