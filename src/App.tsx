import { lazy, Suspense, useEffect, useState } from 'react';
import { COUNTRY_WORLDS, getCountryById } from './data/countries';
import { GAME_COPY } from './data/i18n';
import type {
  AppearanceMode,
  AppLanguage,
  AustraliaPerformChallengeRecord,
  AustraliaPerformReflectionState,
  AustraliaSpeakingEvidenceRecord,
  AvatarConfig,
  CountryId,
  EgyptInstructionJournalRecord,
  LocalProgressV1,
  ResolvedAppearance,
  ScotlandSpeakingReflectionState,
  ScreenRoute,
} from './types/game';
import {
  canNavigateToCountry,
  canReplayCountry,
  collectJaipurVocabObject,
  completeAustraliaBuildMission,
  completeAustraliaDiscoveryMission,
  completeAustraliaPerformChallenge,
  completeAustraliaPerformMission,
  completeAustraliaPracticeMission,
  completeEgyptBuildMission,
  completeEgyptDiscoveryMission,
  completeJaipurFinalShowcase,
  completeJaipurSentenceTrain,
  completeJaipurSpotAndSpeakObject,
  completeKenyaBuildStation,
  completeKenyaDiscoverySpot,
  completeKenyaFinalPerform,
  completeKenyaPracticeConversation,
  completeScotlandBuildStation,
  completeScotlandDiscoveryStation,
  completeScotlandPerformMission,
  completeScotlandPracticeStation,
  detectWebGLSupport,
  getAustraliaBuiltDialogues,
  getAustraliaCompletedBuildIds,
  getAustraliaCompletedDiscoverIds,
  getAustraliaCompletedPerformIds,
  getAustraliaCompletedPracticeIds,
  getAustraliaEffectiveEntry,
  getAustraliaNextBuildLandmarkId,
  getAustraliaNextDiscoverLandmarkId,
  getAustraliaNextPerformLandmarkId,
  getAustraliaNextPracticeLandmarkId,
  getAustraliaPerformEvidenceMap,
  getAustraliaPerformReflection,
  getAustraliaPracticeEvidenceMap,
  getCountryReplayAttempt,
  getEgyptBuildJournal,
  getEgyptCompletedBuildChallengeIds,
  getEgyptCompletedBuildIds,
  getEgyptCompletedDiscoverIds,
  getEgyptMetNpcIds,
  getEgyptNextBuildLandmarkId,
  getEgyptNextDiscoverLandmarkId,
  getEgyptVisitedLandmarkIds,
  getJaipurEffectiveEntry,
  getKenyaEffectiveEntry,
  getScotlandEffectiveEntry,
  isAustraliaAttemptPerformCompleted,
  isAustraliaBuildCompleted,
  isAustraliaBuildStarted,
  isAustraliaBuildUnlocked,
  isAustraliaDiscoverCompleted,
  isAustraliaDiscoverStarted,
  isAustraliaMissionCompleted,
  isAustraliaPerformStarted,
  isAustraliaPerformUnlocked,
  isAustraliaPracticeCompleted,
  isAustraliaPracticeStarted,
  isAustraliaPracticeUnlocked,
  isAustraliaUnlocked,
  isEgyptBuildCompleted,
  isEgyptBuildStarted,
  isEgyptBuildUnlocked,
  isEgyptDiscoverCompleted,
  isEgyptDiscoverStarted,
  isEgyptUnlocked,
  isJaipurBuildUnlocked,
  isJaipurMissionCompleted,
  isJaipurPerformUnlocked,
  isJaipurPracticeUnlocked,
  isKenyaBuildUnlocked,
  isKenyaMissionCompleted,
  isKenyaPerformUnlocked,
  isKenyaPracticeUnlocked,
  isScotlandBuildCompleted,
  isScotlandBuildUnlocked,
  isScotlandDiscoverCompleted,
  isScotlandMissionCompleted,
  isScotlandPerformUnlocked,
  isScotlandPracticeCompleted,
  isScotlandPracticeUnlocked,
  isScotlandUnlocked,
  JAIPUR_MISSION_ID,
  KENYA_BUILD_ACTIVITY_ID,
  KENYA_DISCOVERY_ACTIVITY_ID,
  KENYA_MISSION_ID,
  KENYA_PERFORM_ACTIVITY_ID,
  KENYA_PRACTICE_ACTIVITY_ID,
  loadProgress,
  markAustraliaEntered,
  markAustraliaNpcMet,
  markAustraliaPoiExplored,
  markEgyptEntered,
  markEgyptNpcMet,
  markEgyptPoiExplored,
  markJaipurAaravMet,
  markScotlandNpcMet,
  markScotlandPoiExplored,
  recordEgyptBuildChallenge,
  resetProgressStorage,
  restartCountryReplayAttempt,
  saveProgress,
  SCOTLAND_BUILD_ACTIVITY_ID,
  SCOTLAND_DISCOVERY_ACTIVITY_ID,
  SCOTLAND_PERFORM_ACTIVITY_ID,
  SCOTLAND_PRACTICE_ACTIVITY_ID,
  startAustraliaBuildMission,
  startAustraliaDiscoveryMission,
  startAustraliaPerformMission,
  startAustraliaPracticeMission,
  startCountryReplay,
  startEgyptBuildMission,
  startEgyptDiscoveryMission,
  startJaipurSpotAndSpeak,
  startKenyaBuildMission,
  startKenyaDiscoveryMission,
  startKenyaPerformMission,
  startKenyaPracticeMission,
  startScotlandBuildMission,
  startScotlandDiscoveryMission,
  startScotlandPerformMission,
  startScotlandPracticeMission,
  WORD_DETECTIVE_ACTIVITY_ID,
} from './utils/progressStorage';
import type { ScotlandPerformCompletionPayload } from './data/scotlandPerform';
import type { JaipurVocabObjectId } from './data/jaipurWorld';
import type { KenyaLandmarkId } from './data/kenyaWorld';
import {
  SCOTLAND_MISSION_ID,
  type ScotlandLandmarkId,
  type ScotlandNpcId,
} from './data/scotlandWorld';
import {
  AUSTRALIA_MISSION_ID,
  type AustraliaLandmarkId,
  type AustraliaNpcId,
} from './data/australiaWorld';
import type { EgyptLandmarkId, EgyptNpcId } from './data/egyptWorld';
import { SENTENCE_TRAIN_ACTIVITY_ID } from './data/jaipurSentenceTrain';
import { SPOT_AND_SPEAK_ACTIVITY_ID } from './data/jaipurSpotAndSpeak';
import { FINAL_JAIPUR_SHOWCASE_ACTIVITY_ID } from './data/jaipurShowcase';
import { voxAudio } from './utils/audioEngine';
import { WorldExplorerFallback2D } from './components/explorer/WorldExplorerFallback2D';
import { ReplayConfirmModal } from './components/game/ReplayConfirmModal';
import { SettingsModal } from './components/game/SettingsModal';
import { TitleOverlay } from './components/screens/TitleOverlay';
import { WorldMapOverlay } from './components/screens/WorldMapOverlay';
import { AvatarStudioScreen } from './components/screens/AvatarStudioScreen';
import { CountryAdventureScreen } from './components/screens/CountryAdventureScreen';
import { JaipurWorldScreen } from './components/screens/JaipurWorldScreen';
import { KenyaWorldScreen } from './components/screens/KenyaWorldScreen';
import { ScotlandWorldScreen } from './components/screens/ScotlandWorldScreen';
import { AustraliaWorldScreen } from './components/screens/AustraliaWorldScreen';
import { EgyptWorldScreen } from './components/screens/EgyptWorldScreen';
import { PassportModalScreen } from './components/screens/PassportModalScreen';

const LazyWorldGlobePreview = lazy(() => import('./components/explorer/WorldGlobePreview'));

export default function App() {
  const [progress, setProgress] = useState<LocalProgressV1>(() => loadProgress());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [replayModalTarget, setReplayModalTarget] = useState<{
    mode: 'replay' | 'restart';
    countryId: CountryId;
  } | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [passportIntroMode, setPassportIntroMode] = useState(false);
  const [passportReturnRoute, setPassportReturnRoute] = useState<'world-map' | 'country-lobby'>('world-map');
  const [avatarEntrySource, setAvatarEntrySource] = useState<'title' | 'world-map' | 'passport'>('title');
  const [australiaOpenReflectionOnEnter, setAustraliaOpenReflectionOnEnter] = useState(false);
  const [webglSupported, setWebglSupported] = useState<boolean>(() => detectWebGLSupport());
  const [viewMode, setViewMode] = useState<'3d' | '2d'>(() =>
    detectWebGLSupport() ? '3d' : '2d',
  );

  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [systemReducedMotion, setSystemReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const darkMq = window.matchMedia('(prefers-color-scheme: dark)');
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onDarkChange = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    const onMotionChange = (e: MediaQueryListEvent) => setSystemReducedMotion(e.matches);
    darkMq.addEventListener('change', onDarkChange);
    motionMq.addEventListener('change', onMotionChange);
    return () => {
      darkMq.removeEventListener('change', onDarkChange);
      motionMq.removeEventListener('change', onMotionChange);
    };
  }, []);

  const resolvedAppearance: ResolvedAppearance =
    progress.appearanceMode === 'auto'
      ? systemPrefersDark
        ? 'night'
        : 'day'
      : progress.appearanceMode;

  const effectiveReducedMotion =
    progress.reducedMotionOverride !== null
      ? progress.reducedMotionOverride
      : systemReducedMotion;

  useEffect(() => {
    const root = document.documentElement;
    if (resolvedAppearance === 'night') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [resolvedAppearance]);

  useEffect(() => {
    const profile =
      progress.currentRoute === 'country-lobby' && progress.selectedCountryId === 'kenya'
        ? 'kenya'
        : progress.currentRoute === 'country-lobby' && progress.selectedCountryId === 'scotland'
          ? 'scotland'
          : progress.currentRoute === 'country-lobby' && progress.selectedCountryId === 'australia'
            ? 'australia'
            : progress.currentRoute === 'country-lobby' && progress.selectedCountryId === 'egypt'
              ? 'egypt'
              : 'default';
    voxAudio.setEnvironmentProfile(profile);
  }, [progress.currentRoute, progress.selectedCountryId]);

  useEffect(() => {
    if (musicPlaying) {
      voxAudio.updateAtmosphere(resolvedAppearance, effectiveReducedMotion);
    }
  }, [musicPlaying, resolvedAppearance, effectiveReducedMotion]);

  useEffect(() => {
    return () => {
      voxAudio.dispose();
    };
  }, []);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    if (
      progress.currentRoute === 'country-lobby' &&
      !canNavigateToCountry(progress, progress.selectedCountryId)
    ) {
      setProgress((prev) =>
        prev.currentRoute === 'country-lobby' &&
        !canNavigateToCountry(prev, prev.selectedCountryId)
          ? { ...prev, currentRoute: 'world-map' }
          : prev,
      );
    }
  }, [progress]);

  const selectedCountry = getCountryById(progress.selectedCountryId);
  const hasCompletedAvatar = progress.avatar.customizedInPhase1;

  const navigate = (nextRoute: ScreenRoute) => {
    voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
    setProgress((prev) => {
      const resolvedRoute =
        nextRoute === 'country-lobby' && !canNavigateToCountry(prev, prev.selectedCountryId)
          ? 'world-map'
          : nextRoute;
      return {
        ...prev,
        currentRoute: resolvedRoute,
      };
    });
  };

  const handlePlay = () => {
    if (hasCompletedAvatar) {
      voxAudio.playSfx('reward', progress.audioPrefs.sfxEnabled, resolvedAppearance);
      setPassportIntroMode(false);
      setProgress((prev) => ({ ...prev, currentRoute: 'world-map' }));
    } else {
      voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
      setAvatarEntrySource('title');
      setProgress((prev) => ({ ...prev, currentRoute: 'avatar-studio' }));
    }
  };

  const handleConfirmAvatar = (finalAvatar: AvatarConfig) => {
    setProgress((prev) => ({
      ...prev,
      avatar: finalAvatar,
      currentRoute: avatarEntrySource === 'title' ? 'passport-reward' : 'world-map',
    }));
    setPassportIntroMode(avatarEntrySource === 'title');
  };

  const handleAvatarBack = () => {
    if (avatarEntrySource === 'world-map') {
      navigate('world-map');
    } else if (avatarEntrySource === 'passport') {
      navigate('passport-reward');
    } else {
      navigate('welcome');
    }
  };

  const handleSelectCountry = (id: CountryId) => {
    voxAudio.playSfx('select', progress.audioPrefs.sfxEnabled, resolvedAppearance);
    setProgress((prev) => ({
      ...prev,
      selectedCountryId: id,
    }));
  };

  const handleLanguageChange = (uiLanguage: AppLanguage) => {
    voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
    setProgress((prev) => ({ ...prev, uiLanguage }));
  };

  const handleAppearanceChange = (appearanceMode: AppearanceMode) => {
    const nextResolved: ResolvedAppearance =
      appearanceMode === 'auto'
        ? systemPrefersDark
          ? 'night'
          : 'day'
        : appearanceMode;
    voxAudio.playSfx('mode', progress.audioPrefs.sfxEnabled, nextResolved);
    setProgress((prev) => ({ ...prev, appearanceMode }));
  };

  const handleToggleQuickAppearance = () => {
    handleAppearanceChange(resolvedAppearance === 'day' ? 'night' : 'day');
  };

  const handleToggleMusic = () => {
    if (musicPlaying) {
      voxAudio.stopMusic();
      setMusicPlaying(false);
      setProgress((prev) => ({
        ...prev,
        audioPrefs: { ...prev.audioPrefs, musicEnabled: false },
      }));
    } else {
      const started = voxAudio.startMusic(resolvedAppearance, effectiveReducedMotion);
      setMusicPlaying(started);
      setProgress((prev) => ({
        ...prev,
        audioPrefs: { ...prev.audioPrefs, musicEnabled: started },
      }));
    }
  };

  const handleToggleSfx = () => {
    const nextSfx = !progress.audioPrefs.sfxEnabled;
    if (nextSfx) {
      voxAudio.playSfx('select', true, resolvedAppearance);
    }
    setProgress((prev) => ({
      ...prev,
      audioPrefs: { ...prev.audioPrefs, sfxEnabled: nextSfx },
    }));
  };

  const handleToggleReducedMotion = () => {
    voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
    setProgress((prev) => ({
      ...prev,
      reducedMotionOverride: !effectiveReducedMotion,
    }));
  };

  const handleResetProgress = () => {
    voxAudio.stopMusic();
    setMusicPlaying(false);
    const fresh = resetProgressStorage();
    setProgress({
      ...fresh,
      uiLanguage: progress.uiLanguage,
      appearanceMode: progress.appearanceMode,
      currentRoute: 'welcome',
    });
  };

  const handleMarkJaipurAaravMet = () => {
    setProgress((prev) => markJaipurAaravMet(prev));
  };

  const handleCollectJaipurVocabObject = (objectId: JaipurVocabObjectId) => {
    setProgress((prev) => collectJaipurVocabObject(prev, objectId));
  };

  const handleCompleteJaipurSentenceTrain = () => {
    setProgress((prev) => completeJaipurSentenceTrain(prev));
  };

  const handleStartJaipurSpotAndSpeak = () => {
    setProgress((prev) => startJaipurSpotAndSpeak(prev));
  };

  const handleCompleteJaipurSpotAndSpeakObject = (objectId: JaipurVocabObjectId) => {
    setProgress((prev) => completeJaipurSpotAndSpeakObject(prev, objectId));
  };

  const handleCompleteJaipurFinalShowcase = (): { firstCompletion: boolean } => {
    const lifetime = progress.missionProgress[JAIPUR_MISSION_ID];
    const wasLifetimeCompleted = Boolean(
      lifetime?.completedActivityIds.includes(FINAL_JAIPUR_SHOWCASE_ACTIVITY_ID),
    );
    const next = completeJaipurFinalShowcase(progress);
    const isNowLifetimeCompleted = Boolean(
      next.missionProgress[JAIPUR_MISSION_ID]?.completedActivityIds.includes(
        FINAL_JAIPUR_SHOWCASE_ACTIVITY_ID,
      ),
    );
    setProgress((prev) => completeJaipurFinalShowcase(prev));
    return { firstCompletion: !wasLifetimeCompleted && isNowLifetimeCompleted };
  };

  const handleStartKenyaDiscovery = () => {
    setProgress((prev) => startKenyaDiscoveryMission(prev));
  };

  const handleCompleteKenyaDiscoverySpot = (spotId: KenyaLandmarkId): boolean => {
    const wasCompleted = getKenyaEffectiveEntry(progress).completedActivityIds.includes(
      KENYA_DISCOVERY_ACTIVITY_ID,
    );
    const next = completeKenyaDiscoverySpot(progress, spotId);
    const isNowCompleted = getKenyaEffectiveEntry(next).completedActivityIds.includes(
      KENYA_DISCOVERY_ACTIVITY_ID,
    );
    setProgress((prev) => completeKenyaDiscoverySpot(prev, spotId));
    return !wasCompleted && isNowCompleted;
  };

  const handleStartKenyaBuild = () => {
    setProgress((prev) => startKenyaBuildMission(prev));
  };

  const handleCompleteKenyaBuildStation = (
    stationId: KenyaLandmarkId,
    sentence: string,
  ): boolean => {
    const wasCompleted = getKenyaEffectiveEntry(progress).completedActivityIds.includes(
      KENYA_BUILD_ACTIVITY_ID,
    );
    const next = completeKenyaBuildStation(progress, stationId, sentence);
    const isNowCompleted = getKenyaEffectiveEntry(next).completedActivityIds.includes(
      KENYA_BUILD_ACTIVITY_ID,
    );
    setProgress((prev) => completeKenyaBuildStation(prev, stationId, sentence));
    return !wasCompleted && isNowCompleted;
  };

  const handleStartKenyaPractice = () => {
    setProgress((prev) => startKenyaPracticeMission(prev));
  };

  const handleCompleteKenyaPracticeConversation = (
    conversationId: KenyaLandmarkId,
  ): boolean => {
    const wasCompleted = getKenyaEffectiveEntry(progress).completedActivityIds.includes(
      KENYA_PRACTICE_ACTIVITY_ID,
    );
    const next = completeKenyaPracticeConversation(progress, conversationId);
    const isNowCompleted = getKenyaEffectiveEntry(next).completedActivityIds.includes(
      KENYA_PRACTICE_ACTIVITY_ID,
    );
    setProgress((prev) => completeKenyaPracticeConversation(prev, conversationId));
    return !wasCompleted && isNowCompleted;
  };

  const handleStartKenyaPerform = () => {
    setProgress((prev) => startKenyaPerformMission(prev));
  };

  const handleCompleteKenyaPerform = (): { firstCompletion: boolean } => {
    const lifetime = progress.missionProgress[KENYA_MISSION_ID];
    const wasLifetimeCompleted = Boolean(
      lifetime?.completedActivityIds.includes(KENYA_PERFORM_ACTIVITY_ID),
    );
    const next = completeKenyaFinalPerform(progress);
    const isNowLifetimeCompleted = Boolean(
      next.missionProgress[KENYA_MISSION_ID]?.completedActivityIds.includes(
        KENYA_PERFORM_ACTIVITY_ID,
      ),
    );
    setProgress((prev) => completeKenyaFinalPerform(prev));
    return { firstCompletion: !wasLifetimeCompleted && isNowLifetimeCompleted };
  };

  const handleMarkScotlandNpcMet = (npcId: ScotlandNpcId) => {
    setProgress((prev) =>
      markScotlandNpcMet(prev, npcId === 'npc_eilidh' ? 'eilidh' : 'fiona'),
    );
  };

  const handleMarkScotlandPoiExplored = (landmarkId: ScotlandLandmarkId) => {
    setProgress((prev) => markScotlandPoiExplored(prev, landmarkId));
  };

  const handleStartScotlandDiscovery = () => {
    setProgress((prev) => startScotlandDiscoveryMission(prev));
  };

  const handleCompleteScotlandDiscoveryStation = (stationId: ScotlandLandmarkId): boolean => {
    const wasCompleted = getScotlandEffectiveEntry(progress).completedActivityIds.includes(
      SCOTLAND_DISCOVERY_ACTIVITY_ID,
    );
    const next = completeScotlandDiscoveryStation(progress, stationId);
    const isNowCompleted = getScotlandEffectiveEntry(next).completedActivityIds.includes(
      SCOTLAND_DISCOVERY_ACTIVITY_ID,
    );
    setProgress((prev) => completeScotlandDiscoveryStation(prev, stationId));
    return !wasCompleted && isNowCompleted;
  };

  const handleStartScotlandBuild = () => {
    setProgress((prev) => startScotlandBuildMission(prev));
  };

  const handleCompleteScotlandBuildStation = (
    stationId: ScotlandLandmarkId,
    builtSentence: string,
  ): boolean => {
    const wasCompleted = getScotlandEffectiveEntry(progress).completedActivityIds.includes(
      SCOTLAND_BUILD_ACTIVITY_ID,
    );
    const next = completeScotlandBuildStation(progress, stationId, builtSentence);
    const isNowCompleted = getScotlandEffectiveEntry(next).completedActivityIds.includes(
      SCOTLAND_BUILD_ACTIVITY_ID,
    );
    setProgress((prev) => completeScotlandBuildStation(prev, stationId, builtSentence));
    return !wasCompleted && isNowCompleted;
  };

  const handleStartScotlandPractice = () => {
    setProgress((prev) => startScotlandPracticeMission(prev));
  };

  const handleCompleteScotlandPracticeStation = (
    stationId: ScotlandLandmarkId,
    reflection: ScotlandSpeakingReflectionState,
  ): boolean => {
    const wasCompleted = getScotlandEffectiveEntry(progress).completedActivityIds.includes(
      SCOTLAND_PRACTICE_ACTIVITY_ID,
    );
    const next = completeScotlandPracticeStation(progress, stationId, reflection);
    const isNowCompleted = getScotlandEffectiveEntry(next).completedActivityIds.includes(
      SCOTLAND_PRACTICE_ACTIVITY_ID,
    );
    setProgress((prev) => completeScotlandPracticeStation(prev, stationId, reflection));
    return !wasCompleted && isNowCompleted;
  };

  const handleStartScotlandPerform = () => {
    setProgress((prev) => startScotlandPerformMission(prev));
  };

  const handleCompleteScotlandPerform = (
    payload: ScotlandPerformCompletionPayload,
  ): { firstCompletion: boolean } => {
    const lifetime = progress.missionProgress[SCOTLAND_MISSION_ID];
    const wasLifetimeCompleted = Boolean(
      lifetime?.completedActivityIds.includes(SCOTLAND_PERFORM_ACTIVITY_ID),
    );
    const next = completeScotlandPerformMission(progress, payload);
    const isNowLifetimeCompleted = Boolean(
      next.missionProgress[SCOTLAND_MISSION_ID]?.completedActivityIds.includes(
        SCOTLAND_PERFORM_ACTIVITY_ID,
      ),
    );
    setProgress((prev) => completeScotlandPerformMission(prev, payload));
    return { firstCompletion: !wasLifetimeCompleted && isNowLifetimeCompleted };
  };

  const handleMarkAustraliaNpcMet = (npcId: AustraliaNpcId) => {
    setProgress((prev) => markAustraliaNpcMet(prev, npcId));
  };

  const handleMarkAustraliaPoiExplored = (landmarkId: AustraliaLandmarkId) => {
    setProgress((prev) => markAustraliaPoiExplored(prev, landmarkId));
  };

  const handleStartAustraliaDiscovery = () => {
    setProgress((prev) => startAustraliaDiscoveryMission(prev));
  };

  const handleCompleteAustraliaDiscoveryMission = (landmarkId: AustraliaLandmarkId) => {
    setProgress((prev) => completeAustraliaDiscoveryMission(prev, landmarkId));
  };

  const handleStartAustraliaBuild = () => {
    setProgress((prev) => startAustraliaBuildMission(prev));
  };

  const handleCompleteAustraliaBuildMission = (
    landmarkId: AustraliaLandmarkId,
    craftedDialogueSummary: string,
  ) => {
    setProgress((prev) =>
      completeAustraliaBuildMission(prev, landmarkId, craftedDialogueSummary),
    );
  };

  const handleStartAustraliaPractice = () => {
    setProgress((prev) => startAustraliaPracticeMission(prev));
  };

  const handleCompleteAustraliaPracticeMission = (
    landmarkId: AustraliaLandmarkId,
    evidence: AustraliaSpeakingEvidenceRecord,
  ) => {
    setProgress((prev) => completeAustraliaPracticeMission(prev, landmarkId, evidence));
  };

  const handleStartAustraliaPerform = () => {
    setProgress((prev) => startAustraliaPerformMission(prev));
  };

  const handleCompleteAustraliaPerformChallenge = (
    landmarkId: AustraliaLandmarkId,
    record: AustraliaPerformChallengeRecord,
  ) => {
    setProgress((prev) => completeAustraliaPerformChallenge(prev, landmarkId, record));
  };

  const handleCompleteAustraliaPerformMission = (
    reflection: AustraliaPerformReflectionState,
  ): { firstCompletion: boolean } => {
    const wasLifetimeCompleted = isAustraliaMissionCompleted(progress);
    const next = completeAustraliaPerformMission(progress, reflection);
    const isNowLifetimeCompleted = isAustraliaMissionCompleted(next);
    setProgress((prev) => completeAustraliaPerformMission(prev, reflection));
    return { firstCompletion: !wasLifetimeCompleted && isNowLifetimeCompleted };
  };

  const handleMarkEgyptNpcMet = (npcId: EgyptNpcId) => {
    setProgress((prev) => markEgyptNpcMet(prev, npcId));
  };

  const handleMarkEgyptPoiExplored = (landmarkId: EgyptLandmarkId) => {
    setProgress((prev) => markEgyptPoiExplored(prev, landmarkId));
  };

  const handleStartEgyptDiscovery = () => {
    setProgress((prev) => startEgyptDiscoveryMission(prev));
  };

  const handleCompleteEgyptDiscoveryMission = (landmarkId: EgyptLandmarkId): boolean => {
    const wasCompleted = isEgyptDiscoverCompleted(progress);
    const next = completeEgyptDiscoveryMission(progress, landmarkId);
    const isNowCompleted = isEgyptDiscoverCompleted(next);
    setProgress((prev) => completeEgyptDiscoveryMission(prev, landmarkId));
    return !wasCompleted && isNowCompleted;
  };

  const handleStartEgyptBuild = () => {
    setProgress((prev) => startEgyptBuildMission(prev));
  };

  const handleRecordEgyptBuildChallenge = (record: EgyptInstructionJournalRecord) => {
    setProgress((prev) => recordEgyptBuildChallenge(prev, record));
  };

  const handleCompleteEgyptBuildMission = (landmarkId: EgyptLandmarkId): boolean => {
    const wasCompleted = isEgyptBuildCompleted(progress);
    const next = completeEgyptBuildMission(progress, landmarkId);
    const isNowCompleted = isEgyptBuildCompleted(next);
    setProgress((prev) => completeEgyptBuildMission(prev, landmarkId));
    return !wasCompleted && isNowCompleted;
  };

  const handleRequestReplayCountry = (countryId: CountryId) => {
    if (!canReplayCountry(progress, countryId)) return;
    voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
    setReplayModalTarget({ mode: 'replay', countryId });
  };

  const handleRequestRestartAttempt = (countryId: CountryId) => {
    if (!getCountryReplayAttempt(progress, countryId)) return;
    voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
    setReplayModalTarget({ mode: 'restart', countryId });
  };

  const handleConfirmReplayAction = () => {
    if (!replayModalTarget) return;
    const { mode, countryId } = replayModalTarget;
    voxAudio.playSfx('reward', progress.audioPrefs.sfxEnabled, resolvedAppearance);
    setProgress((prev) => {
      const updated =
        mode === 'replay'
          ? startCountryReplay(prev, countryId)
          : restartCountryReplayAttempt(prev, countryId);
      return {
        ...updated,
        selectedCountryId: countryId,
        currentRoute: 'country-lobby',
      };
    });
    setReplayModalTarget(null);
  };

  const jaipurMission = getJaipurEffectiveEntry(progress);
  const jaipurLifetime = progress.missionProgress[JAIPUR_MISSION_ID];
  const jaipurReplayAttempt = getCountryReplayAttempt(progress, 'india');
  const jaipurCanReplay = canReplayCountry(progress, 'india');
  const jaipurMetAarav = Boolean(jaipurMission.metAarav);
  const jaipurFoundObjectIds = (jaipurMission.wordDetectiveFoundIds ??
    []) as JaipurVocabObjectId[];
  const jaipurWordDetectiveCompleted = jaipurMission.completedActivityIds.includes(
    WORD_DETECTIVE_ACTIVITY_ID,
  );
  const jaipurBuildUnlocked = isJaipurBuildUnlocked(progress);
  const jaipurSentenceTrainCompleted = jaipurMission.completedActivityIds.includes(
    SENTENCE_TRAIN_ACTIVITY_ID,
  );
  const jaipurPracticeUnlocked = isJaipurPracticeUnlocked(progress);
  const jaipurSpotAndSpeakStarted = Boolean(jaipurMission.spotAndSpeakStarted);
  const jaipurSpotAndSpeakDoneIds = (jaipurMission.spotAndSpeakDoneIds ??
    []) as JaipurVocabObjectId[];
  const jaipurSpotAndSpeakCompleted = jaipurMission.completedActivityIds.includes(
    SPOT_AND_SPEAK_ACTIVITY_ID,
  );
  const jaipurPerformUnlocked = isJaipurPerformUnlocked(progress);
  const jaipurShowcaseCompleted =
    jaipurMission.status === 'completed' ||
    jaipurMission.completedActivityIds.includes(FINAL_JAIPUR_SHOWCASE_ACTIVITY_ID);
  const jaipurCompletedAt = jaipurMission.completedAt ?? jaipurLifetime?.completedAt;
  const jaipurWordDetectiveAlreadyRewarded = Boolean(
    jaipurLifetime?.completedActivityIds.includes(WORD_DETECTIVE_ACTIVITY_ID),
  );
  const jaipurSentenceTrainAlreadyRewarded = Boolean(
    jaipurLifetime?.completedActivityIds.includes(SENTENCE_TRAIN_ACTIVITY_ID),
  );
  const jaipurSpotAndSpeakAlreadyRewarded = Boolean(
    jaipurLifetime?.completedActivityIds.includes(SPOT_AND_SPEAK_ACTIVITY_ID),
  );
  const jaipurShowcaseAlreadyRewarded = isJaipurMissionCompleted(progress);

  const kenyaMission = getKenyaEffectiveEntry(progress);
  const kenyaLifetime = progress.missionProgress[KENYA_MISSION_ID];
  const kenyaReplayAttempt = getCountryReplayAttempt(progress, 'kenya');
  const kenyaCanReplay = canReplayCountry(progress, 'kenya');
  const kenyaDiscoverStarted = Boolean(kenyaMission.kenyaDiscoverStarted);
  const kenyaDiscoveredIds = (kenyaMission.kenyaDiscoveredIds ?? []) as KenyaLandmarkId[];
  const kenyaDiscoverCompleted = kenyaMission.completedActivityIds.includes(
    KENYA_DISCOVERY_ACTIVITY_ID,
  );
  const kenyaBuildUnlocked = isKenyaBuildUnlocked(progress);
  const kenyaBuildStarted = Boolean(kenyaMission.kenyaBuildStarted);
  const kenyaBuiltSentences = kenyaMission.kenyaBuiltSentences ?? {};
  const kenyaBuildCompleted = kenyaMission.completedActivityIds.includes(
    KENYA_BUILD_ACTIVITY_ID,
  );
  const kenyaPracticeUnlocked = isKenyaPracticeUnlocked(progress);
  const kenyaPracticeStarted = Boolean(kenyaMission.kenyaPracticeStarted);
  const kenyaPracticedConversationIds = (kenyaMission.kenyaPracticedConversationIds ??
    []) as KenyaLandmarkId[];
  const kenyaPracticeCompleted = kenyaMission.completedActivityIds.includes(
    KENYA_PRACTICE_ACTIVITY_ID,
  );
  const kenyaPerformUnlocked = isKenyaPerformUnlocked(progress);
  const kenyaPerformStarted = Boolean(kenyaMission.kenyaPerformStarted);
  const kenyaPerformCompleted =
    kenyaMission.status === 'completed' ||
    kenyaMission.completedActivityIds.includes(KENYA_PERFORM_ACTIVITY_ID);
  const kenyaCompletedAt = kenyaMission.completedAt ?? kenyaLifetime?.completedAt;
  const kenyaDiscoverAlreadyRewarded = Boolean(
    kenyaLifetime?.completedActivityIds.includes(KENYA_DISCOVERY_ACTIVITY_ID),
  );
  const kenyaBuildAlreadyRewarded = Boolean(
    kenyaLifetime?.completedActivityIds.includes(KENYA_BUILD_ACTIVITY_ID),
  );
  const kenyaPracticeAlreadyRewarded = Boolean(
    kenyaLifetime?.completedActivityIds.includes(KENYA_PRACTICE_ACTIVITY_ID),
  );
  const kenyaPerformAlreadyRewarded = isKenyaMissionCompleted(progress);

  const scotlandUnlocked = isScotlandUnlocked(progress);
  const scotlandMission = getScotlandEffectiveEntry(progress);
  const scotlandLifetime = progress.missionProgress[SCOTLAND_MISSION_ID];
  const scotlandReplayAttempt = getCountryReplayAttempt(progress, 'scotland');
  const scotlandCanReplay = canReplayCountry(progress, 'scotland');
  const scotlandMetEilidh = Boolean(scotlandMission.metEilidh);
  const scotlandMetFiona = Boolean(scotlandMission.metFiona);
  const scotlandExploredPoiIds = (scotlandMission.scotlandExploredPoiIds ??
    []) as ScotlandLandmarkId[];
  const scotlandDiscoverStarted = Boolean(scotlandMission.scotlandDiscoverStarted);
  const scotlandDiscoveredEvidenceIds = (scotlandMission.scotlandDiscoveredEvidenceIds ??
    []) as ScotlandLandmarkId[];
  const scotlandDiscoverCompleted = scotlandMission.completedActivityIds.includes(
    SCOTLAND_DISCOVERY_ACTIVITY_ID,
  );
  const scotlandDiscoverAlreadyRewarded = isScotlandDiscoverCompleted(progress);
  const scotlandBuildUnlocked = isScotlandBuildUnlocked(progress);
  const scotlandBuildStarted = Boolean(scotlandMission.scotlandBuildStarted);
  const scotlandBuiltSentences = scotlandMission.scotlandBuiltSentences ?? {};
  const scotlandBuildCompleted = scotlandMission.completedActivityIds.includes(
    SCOTLAND_BUILD_ACTIVITY_ID,
  );
  const scotlandPracticeUnlocked = isScotlandPracticeUnlocked(progress);
  const scotlandBuildAlreadyRewarded = isScotlandBuildCompleted(progress);
  const scotlandPracticeStarted = Boolean(scotlandMission.scotlandPracticeStarted);
  const scotlandCompletedSpeakingIds = (scotlandMission.scotlandCompletedSpeakingIds ??
    []) as ScotlandLandmarkId[];
  const scotlandSpeakingReflectionStates = scotlandMission.scotlandSpeakingReflectionStates ?? {};
  const scotlandPracticeCompleted = scotlandMission.completedActivityIds.includes(
    SCOTLAND_PRACTICE_ACTIVITY_ID,
  );
  const scotlandPerformUnlocked = isScotlandPerformUnlocked(progress);
  const scotlandPracticeAlreadyRewarded = isScotlandPracticeCompleted(progress);
  const scotlandPerformStarted = Boolean(scotlandMission.scotlandPerformStarted);
  const scotlandPerformCompleted =
    scotlandMission.status === 'completed' ||
    Boolean(scotlandMission.scotlandPerformCompleted) ||
    scotlandMission.completedActivityIds.includes(SCOTLAND_PERFORM_ACTIVITY_ID);
  const scotlandPerformAlreadyRewarded = isScotlandMissionCompleted(progress);
  const scotlandCompletedAt = scotlandMission.completedAt ?? scotlandLifetime?.completedAt;
  const scotlandPerformSelectedEvidenceIds = scotlandMission.scotlandPerformSelectedEvidenceIds;
  const scotlandPerformOutline = scotlandMission.scotlandPerformOutline;
  const scotlandPerformSpeechPracticeMode = scotlandMission.scotlandPerformSpeechPracticeMode;
  const scotlandPerformQuestionPracticeStates =
    scotlandMission.scotlandPerformQuestionPracticeStates;
  const scotlandPerformReflectionState = scotlandMission.scotlandPerformReflectionState;

  const australiaUnlocked = isAustraliaUnlocked(progress);
  const australiaMission = getAustraliaEffectiveEntry(progress);
  const australiaLifetime = progress.missionProgress[AUSTRALIA_MISSION_ID];
  const australiaReplayAttempt = getCountryReplayAttempt(progress, 'australia');
  const australiaCanReplay = canReplayCountry(progress, 'australia');
  const australiaExploredPoiIds = (australiaMission?.australiaExploredPoiIds ??
    []) as AustraliaLandmarkId[];
  const australiaMetNpcIds = (australiaMission?.australiaMetNpcIds ?? []) as AustraliaNpcId[];
  const australiaDiscoverStarted = isAustraliaDiscoverStarted(progress);
  const australiaCompletedDiscoverIds = getAustraliaCompletedDiscoverIds(progress);
  const australiaNextDiscoverLandmarkId = getAustraliaNextDiscoverLandmarkId(progress);
  const australiaDiscoverCompleted = isAustraliaDiscoverCompleted(progress);
  const australiaBuildUnlocked = isAustraliaBuildUnlocked(progress);
  const australiaBuildStarted = isAustraliaBuildStarted(progress);
  const australiaCompletedBuildIds = getAustraliaCompletedBuildIds(progress);
  const australiaNextBuildLandmarkId = getAustraliaNextBuildLandmarkId(progress);
  const australiaBuildCompleted = isAustraliaBuildCompleted(progress);
  const australiaPracticeUnlocked = isAustraliaPracticeUnlocked(progress);
  const australiaBuiltDialogues = getAustraliaBuiltDialogues(progress);
  const australiaPracticeStarted = isAustraliaPracticeStarted(progress);
  const australiaCompletedPracticeIds = getAustraliaCompletedPracticeIds(progress);
  const australiaNextPracticeLandmarkId = getAustraliaNextPracticeLandmarkId(progress);
  const australiaPracticeEvidence = getAustraliaPracticeEvidenceMap(progress);
  const australiaPracticeCompleted = isAustraliaPracticeCompleted(progress);
  const australiaPerformUnlocked = isAustraliaPerformUnlocked(progress);
  const australiaPerformStarted = isAustraliaPerformStarted(progress);
  const australiaCompletedPerformIds = getAustraliaCompletedPerformIds(progress);
  const australiaNextPerformLandmarkId = getAustraliaNextPerformLandmarkId(progress);
  const australiaPerformCompleted = isAustraliaAttemptPerformCompleted(progress);
  const australiaPerformAlreadyRewarded = isAustraliaMissionCompleted(progress);
  const australiaPerformEvidence = getAustraliaPerformEvidenceMap(progress);
  const australiaPerformReflection = getAustraliaPerformReflection(progress);
  const australiaCompletedAt = australiaMission.completedAt ?? australiaLifetime?.completedAt;

  const egyptUnlocked = isEgyptUnlocked(progress);
  const egyptExploredPoiIds = getEgyptVisitedLandmarkIds(progress);
  const egyptMetNpcIds = getEgyptMetNpcIds(progress);
  const egyptDiscoverStarted = isEgyptDiscoverStarted(progress);
  const egyptCompletedDiscoverIds = getEgyptCompletedDiscoverIds(progress);
  const egyptNextDiscoverLandmarkId = getEgyptNextDiscoverLandmarkId(progress);
  const egyptDiscoverCompleted = isEgyptDiscoverCompleted(progress);
  const egyptBuildUnlocked = isEgyptBuildUnlocked(progress);
  const egyptBuildStarted = isEgyptBuildStarted(progress);
  const egyptCompletedBuildChallengeIds = getEgyptCompletedBuildChallengeIds(progress);
  const egyptCompletedBuildIds = getEgyptCompletedBuildIds(progress);
  const egyptNextBuildLandmarkId = getEgyptNextBuildLandmarkId(progress);
  const egyptBuildCompleted = isEgyptBuildCompleted(progress);
  const egyptBuildJournal = getEgyptBuildJournal(progress);

  const sceneMode = progress.currentRoute === 'welcome' ? 'title' : 'map';
  const copy = GAME_COPY[progress.uiLanguage];

  return (
    <div
      className={`min-h-[100dvh] w-full ${
        effectiveReducedMotion ? 'reduced-motion' : ''
      }`}
    >
      {progress.currentRoute === 'welcome' ||
      progress.currentRoute === 'world-map' ||
      (progress.currentRoute === 'country-lobby' &&
        !canNavigateToCountry(progress, progress.selectedCountryId)) ? (
        <main className="relative h-[100dvh] w-full overflow-hidden">
          {/* Full-Screen Living 3D World (or Accessible 2D Fallback) */}
          <div className="absolute inset-0">
            {viewMode === '3d' && webglSupported ? (
              <Suspense
                fallback={
                  <WorldExplorerFallback2D
                    countries={COUNTRY_WORLDS}
                    selectedCountryId={progress.selectedCountryId}
                    onSelectCountry={handleSelectCountry}
                    language={progress.uiLanguage}
                    appearance={resolvedAppearance}
                    sceneMode={sceneMode}
                    webglUnavailable={false}
                    noticeText={copy.webglFallbackNotice}
                  />
                }
              >
                <LazyWorldGlobePreview
                  countries={COUNTRY_WORLDS}
                  selectedCountryId={progress.selectedCountryId}
                  onSelectCountry={handleSelectCountry}
                  language={progress.uiLanguage}
                  reducedMotion={effectiveReducedMotion}
                  appearance={resolvedAppearance}
                  sceneMode={sceneMode}
                  onWebGLFailure={() => {
                    setWebglSupported(false);
                    setViewMode('2d');
                  }}
                />
              </Suspense>
            ) : (
              <WorldExplorerFallback2D
                countries={COUNTRY_WORLDS}
                selectedCountryId={progress.selectedCountryId}
                onSelectCountry={handleSelectCountry}
                language={progress.uiLanguage}
                appearance={resolvedAppearance}
                sceneMode={sceneMode}
                webglUnavailable={!webglSupported}
                noticeText={copy.webglFallbackNotice}
              />
            )}
          </div>

          {/* Minimal Floating Game Overlays */}
          {progress.currentRoute === 'welcome' ? (
            <TitleOverlay
              language={progress.uiLanguage}
              appearance={resolvedAppearance}
              hasReturningProgress={hasCompletedAvatar}
              onPlay={handlePlay}
              onOpenSettings={() => {
                voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
                setSettingsOpen(true);
              }}
            />
          ) : (
            <WorldMapOverlay
              language={progress.uiLanguage}
              countries={COUNTRY_WORLDS}
              selectedCountry={selectedCountry}
              progress={progress}
              appearance={resolvedAppearance}
              appearanceMode={progress.appearanceMode}
              musicPlaying={musicPlaying}
              onSelectCountry={handleSelectCountry}
              onEnterWorld={() => {
                if (!canNavigateToCountry(progress, progress.selectedCountryId)) {
                  voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
                  return;
                }
                if (progress.selectedCountryId === 'scotland' && !scotlandUnlocked) {
                  voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
                  return;
                }
                if (progress.selectedCountryId === 'australia') {
                  if (!australiaUnlocked) {
                    voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
                    return;
                  }
                  voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
                  setAustraliaOpenReflectionOnEnter(false);
                  setProgress((prev) => ({
                    ...markAustraliaEntered(prev),
                    currentRoute: 'country-lobby',
                  }));
                  return;
                }
                if (progress.selectedCountryId === 'egypt') {
                  if (!egyptUnlocked) {
                    voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
                    return;
                  }
                  voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
                  setProgress((prev) => ({
                    ...markEgyptEntered(prev),
                    currentRoute: 'country-lobby',
                  }));
                  return;
                }
                navigate('country-lobby');
              }}
              onEnterAustraliaReflection={() => {
                if (!canNavigateToCountry(progress, 'australia')) {
                  voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
                  return;
                }
                voxAudio.playSfx('select', progress.audioPrefs.sfxEnabled, resolvedAppearance);
                setAustraliaOpenReflectionOnEnter(true);
                setProgress((prev) => ({
                  ...markAustraliaEntered(prev),
                  selectedCountryId: 'australia',
                  currentRoute: 'country-lobby',
                }));
              }}
              onRequestReplayCountry={handleRequestReplayCountry}
              onRequestRestartAttempt={handleRequestRestartAttempt}
              onOpenPassport={() => {
                setPassportIntroMode(false);
                setPassportReturnRoute('world-map');
                navigate('passport-reward');
              }}
              onOpenAvatar={() => {
                setAvatarEntrySource('world-map');
                navigate('avatar-studio');
              }}
              onOpenSettings={() => {
                voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
                setSettingsOpen(true);
              }}
              onToggleQuickAppearance={handleToggleQuickAppearance}
              onToggleMusic={handleToggleMusic}
              onReturnTitle={() => navigate('welcome')}
            />
          )}
        </main>
      ) : progress.currentRoute === 'avatar-studio' ? (
        <AvatarStudioScreen
          language={progress.uiLanguage}
          initialAvatar={progress.avatar}
          appearance={resolvedAppearance}
          reducedMotion={effectiveReducedMotion}
          webglSupported={webglSupported}
          viewMode={viewMode}
          musicPlaying={musicPlaying}
          onWebGLFailure={() => {
            setWebglSupported(false);
            setViewMode('2d');
          }}
          onUpdateDraftSfx={(kind = 'select') => {
            voxAudio.playSfx(kind, progress.audioPrefs.sfxEnabled, resolvedAppearance);
          }}
          onConfirmAvatar={handleConfirmAvatar}
          onBack={handleAvatarBack}
          onToggleQuickAppearance={handleToggleQuickAppearance}
          onToggleMusic={handleToggleMusic}
          onOpenSettings={() => {
            voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
            setSettingsOpen(true);
          }}
        />
      ) : progress.currentRoute === 'passport-reward' ? (
        <PassportModalScreen
          language={progress.uiLanguage}
          countries={COUNTRY_WORLDS}
          progress={progress}
          appearance={resolvedAppearance}
          isIntroMode={passportIntroMode}
          backLabelOverride={
            passportReturnRoute === 'country-lobby' && progress.selectedCountryId === 'india'
              ? copy.jaipurBackToJaipur
              : passportReturnRoute === 'country-lobby' && progress.selectedCountryId === 'kenya'
                ? copy.kenyaBackToMaasaiMara
                : passportReturnRoute === 'country-lobby' &&
                    progress.selectedCountryId === 'scotland' &&
                    scotlandUnlocked
                  ? copy.scotlandBackToHighlands
                  : passportReturnRoute === 'country-lobby' &&
                      progress.selectedCountryId === 'australia' &&
                      australiaUnlocked
                    ? copy.australiaBackToSydney
                    : passportReturnRoute === 'country-lobby' &&
                        progress.selectedCountryId === 'egypt' &&
                        egyptUnlocked
                      ? copy.egyptBackToGiza
                      : undefined
          }
          onBackOverride={
            passportReturnRoute === 'country-lobby' &&
            canNavigateToCountry(progress, progress.selectedCountryId)
              ? () => navigate('country-lobby')
              : undefined
          }
          onEnterWorldMap={() => {
            setPassportIntroMode(false);
            setPassportReturnRoute('world-map');
            navigate('world-map');
          }}
          onEditAvatar={() => {
            setAvatarEntrySource(passportIntroMode ? 'title' : 'passport');
            navigate('avatar-studio');
          }}
          onOpenSettings={() => {
            voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
            setSettingsOpen(true);
          }}
        />
      ) : progress.currentRoute === 'country-lobby' && progress.selectedCountryId === 'india' ? (
        <JaipurWorldScreen
          key={`india-${jaipurReplayAttempt?.startedAt ?? 'lifetime'}`}
          language={progress.uiLanguage}
          country={selectedCountry}
          avatar={progress.avatar}
          rewards={progress.rewards}
          appearance={resolvedAppearance}
          reducedMotion={effectiveReducedMotion}
          webglSupported={webglSupported}
          viewMode={viewMode}
          musicPlaying={musicPlaying}
          externalModalOpen={settingsOpen || replayModalTarget !== null}
          metAarav={jaipurMetAarav}
          foundObjectIds={jaipurFoundObjectIds}
          wordDetectiveCompleted={jaipurWordDetectiveCompleted}
          buildUnlocked={jaipurBuildUnlocked}
          sentenceTrainCompleted={jaipurSentenceTrainCompleted}
          practiceUnlocked={jaipurPracticeUnlocked}
          spotAndSpeakStarted={jaipurSpotAndSpeakStarted}
          spotAndSpeakDoneIds={jaipurSpotAndSpeakDoneIds}
          spotAndSpeakCompleted={jaipurSpotAndSpeakCompleted}
          performUnlocked={jaipurPerformUnlocked}
          showcaseCompleted={jaipurShowcaseCompleted}
          completedAt={jaipurCompletedAt}
          isReplayActive={Boolean(jaipurReplayAttempt)}
          replayAttemptNumber={jaipurReplayAttempt?.attemptNumber}
          canReplayCountry={jaipurCanReplay}
          wordDetectiveAlreadyRewarded={jaipurWordDetectiveAlreadyRewarded}
          sentenceTrainAlreadyRewarded={jaipurSentenceTrainAlreadyRewarded}
          spotAndSpeakAlreadyRewarded={jaipurSpotAndSpeakAlreadyRewarded}
          showcaseAlreadyRewarded={jaipurShowcaseAlreadyRewarded}
          onRequestRestartAttempt={() => handleRequestRestartAttempt('india')}
          onRequestReplayCountry={() => handleRequestReplayCountry('india')}
          onMarkMetAarav={handleMarkJaipurAaravMet}
          onCollectVocabObject={handleCollectJaipurVocabObject}
          onCompleteSentenceTrain={handleCompleteJaipurSentenceTrain}
          onStartSpotAndSpeak={handleStartJaipurSpotAndSpeak}
          onCompleteSpotAndSpeakObject={handleCompleteJaipurSpotAndSpeakObject}
          onCompleteFinalShowcase={handleCompleteJaipurFinalShowcase}
          onWebGLFailure={() => {
            setWebglSupported(false);
            setViewMode('2d');
          }}
          onPlaySfx={(kind = 'click') => {
            voxAudio.playSfx(kind, progress.audioPrefs.sfxEnabled, resolvedAppearance);
          }}
          onBackToMap={() => navigate('world-map')}
          onOpenPassport={() => {
            setPassportIntroMode(false);
            setPassportReturnRoute('country-lobby');
            navigate('passport-reward');
          }}
          onToggleQuickAppearance={handleToggleQuickAppearance}
          onToggleMusic={handleToggleMusic}
          onOpenSettings={() => {
            voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
            setSettingsOpen(true);
          }}
        />
      ) : progress.currentRoute === 'country-lobby' && progress.selectedCountryId === 'kenya' ? (
        <KenyaWorldScreen
          key={`kenya-${kenyaReplayAttempt?.startedAt ?? 'lifetime'}`}
          language={progress.uiLanguage}
          country={selectedCountry}
          avatar={progress.avatar}
          rewards={progress.rewards}
          appearance={resolvedAppearance}
          reducedMotion={effectiveReducedMotion}
          webglSupported={webglSupported}
          viewMode={viewMode}
          musicPlaying={musicPlaying}
          externalModalOpen={settingsOpen || replayModalTarget !== null}
          discoverStarted={kenyaDiscoverStarted}
          discoveredIds={kenyaDiscoveredIds}
          discoverCompleted={kenyaDiscoverCompleted}
          buildUnlocked={kenyaBuildUnlocked}
          buildStarted={kenyaBuildStarted}
          builtSentences={kenyaBuiltSentences}
          buildCompleted={kenyaBuildCompleted}
          practiceUnlocked={kenyaPracticeUnlocked}
          practiceStarted={kenyaPracticeStarted}
          practicedConversationIds={kenyaPracticedConversationIds}
          practiceCompleted={kenyaPracticeCompleted}
          performUnlocked={kenyaPerformUnlocked}
          performStarted={kenyaPerformStarted}
          performCompleted={kenyaPerformCompleted}
          completedAt={kenyaCompletedAt}
          isReplayActive={Boolean(kenyaReplayAttempt)}
          replayAttemptNumber={kenyaReplayAttempt?.attemptNumber}
          canReplayCountry={kenyaCanReplay}
          discoverAlreadyRewarded={kenyaDiscoverAlreadyRewarded}
          buildAlreadyRewarded={kenyaBuildAlreadyRewarded}
          practiceAlreadyRewarded={kenyaPracticeAlreadyRewarded}
          performAlreadyRewarded={kenyaPerformAlreadyRewarded}
          onRequestRestartAttempt={() => handleRequestRestartAttempt('kenya')}
          onRequestReplayCountry={() => handleRequestReplayCountry('kenya')}
          onStartDiscovery={handleStartKenyaDiscovery}
          onCompleteDiscoverySpot={handleCompleteKenyaDiscoverySpot}
          onStartBuild={handleStartKenyaBuild}
          onCompleteBuildStation={handleCompleteKenyaBuildStation}
          onStartPractice={handleStartKenyaPractice}
          onCompletePracticeConversation={handleCompleteKenyaPracticeConversation}
          onStartPerform={handleStartKenyaPerform}
          onCompletePerform={handleCompleteKenyaPerform}
          onWebGLFailure={() => {
            setWebglSupported(false);
            setViewMode('2d');
          }}
          onPlaySfx={(kind = 'click') => {
            voxAudio.playSfx(kind, progress.audioPrefs.sfxEnabled, resolvedAppearance);
          }}
          onBackToMap={() => navigate('world-map')}
          onOpenPassport={() => {
            setPassportIntroMode(false);
            setPassportReturnRoute('country-lobby');
            navigate('passport-reward');
          }}
          onToggleQuickAppearance={handleToggleQuickAppearance}
          onToggleMusic={handleToggleMusic}
          onOpenSettings={() => {
            voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
            setSettingsOpen(true);
          }}
        />
      ) : progress.currentRoute === 'country-lobby' &&
        progress.selectedCountryId === 'scotland' &&
        scotlandUnlocked ? (
        <ScotlandWorldScreen
          key={`scotland-${scotlandReplayAttempt?.startedAt ?? 'lifetime'}`}
          language={progress.uiLanguage}
          country={selectedCountry}
          avatar={progress.avatar}
          rewards={progress.rewards}
          appearance={resolvedAppearance}
          reducedMotion={effectiveReducedMotion}
          webglSupported={webglSupported}
          viewMode={viewMode}
          musicPlaying={musicPlaying}
          externalModalOpen={settingsOpen || replayModalTarget !== null}
          metEilidh={scotlandMetEilidh}
          metFiona={scotlandMetFiona}
          exploredPoiIds={scotlandExploredPoiIds}
          discoverStarted={scotlandDiscoverStarted}
          discoveredEvidenceIds={scotlandDiscoveredEvidenceIds}
          discoverCompleted={scotlandDiscoverCompleted}
          buildUnlocked={scotlandBuildUnlocked}
          buildStarted={scotlandBuildStarted}
          builtSentences={scotlandBuiltSentences}
          buildCompleted={scotlandBuildCompleted}
          practiceUnlocked={scotlandPracticeUnlocked}
          practiceStarted={scotlandPracticeStarted}
          completedSpeakingIds={scotlandCompletedSpeakingIds}
          speakingReflectionStates={scotlandSpeakingReflectionStates}
          practiceCompleted={scotlandPracticeCompleted}
          performUnlocked={scotlandPerformUnlocked}
          performStarted={scotlandPerformStarted}
          performCompleted={scotlandPerformCompleted}
          performAlreadyRewarded={scotlandPerformAlreadyRewarded}
          completedAt={scotlandCompletedAt}
          performSelectedEvidenceIds={scotlandPerformSelectedEvidenceIds}
          performOutline={scotlandPerformOutline}
          performSpeechPracticeMode={scotlandPerformSpeechPracticeMode}
          performQuestionPracticeStates={scotlandPerformQuestionPracticeStates}
          performReflectionState={scotlandPerformReflectionState}
          isReplayActive={Boolean(scotlandReplayAttempt)}
          replayAttemptNumber={scotlandReplayAttempt?.attemptNumber}
          canReplayCountry={scotlandCanReplay}
          discoverAlreadyRewarded={scotlandDiscoverAlreadyRewarded}
          buildAlreadyRewarded={scotlandBuildAlreadyRewarded}
          practiceAlreadyRewarded={scotlandPracticeAlreadyRewarded}
          onRequestRestartAttempt={() => handleRequestRestartAttempt('scotland')}
          onRequestReplayCountry={() => handleRequestReplayCountry('scotland')}
          onMarkNpcMet={handleMarkScotlandNpcMet}
          onMarkPoiExplored={handleMarkScotlandPoiExplored}
          onStartDiscovery={handleStartScotlandDiscovery}
          onCompleteDiscoveryStation={handleCompleteScotlandDiscoveryStation}
          onStartBuild={handleStartScotlandBuild}
          onCompleteBuildStation={handleCompleteScotlandBuildStation}
          onStartPractice={handleStartScotlandPractice}
          onCompletePracticeStation={handleCompleteScotlandPracticeStation}
          onStartPerform={handleStartScotlandPerform}
          onCompletePerform={handleCompleteScotlandPerform}
          onWebGLFailure={() => {
            setWebglSupported(false);
            setViewMode('2d');
          }}
          onPlaySfx={(kind = 'click') => {
            voxAudio.playSfx(kind, progress.audioPrefs.sfxEnabled, resolvedAppearance);
          }}
          onBackToMap={() => navigate('world-map')}
          onOpenPassport={() => {
            setPassportIntroMode(false);
            setPassportReturnRoute('country-lobby');
            navigate('passport-reward');
          }}
          onToggleQuickAppearance={handleToggleQuickAppearance}
          onToggleMusic={handleToggleMusic}
          onOpenSettings={() => {
            voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
            setSettingsOpen(true);
          }}
        />
      ) : progress.currentRoute === 'country-lobby' &&
        progress.selectedCountryId === 'australia' &&
        australiaUnlocked ? (
        <AustraliaWorldScreen
          key={`australia-${australiaReplayAttempt?.startedAt ?? 'lifetime'}`}
          language={progress.uiLanguage}
          country={selectedCountry}
          avatar={progress.avatar}
          rewards={progress.rewards}
          appearance={resolvedAppearance}
          reducedMotion={effectiveReducedMotion}
          webglSupported={webglSupported}
          viewMode={viewMode}
          musicPlaying={musicPlaying}
          externalModalOpen={settingsOpen || replayModalTarget !== null}
          exploredPoiIds={australiaExploredPoiIds}
          metNpcIds={australiaMetNpcIds}
          discoverStarted={australiaDiscoverStarted}
          completedDiscoverIds={australiaCompletedDiscoverIds}
          nextDiscoverLandmarkId={australiaNextDiscoverLandmarkId}
          discoverCompleted={australiaDiscoverCompleted}
          buildUnlocked={australiaBuildUnlocked}
          buildStarted={australiaBuildStarted}
          completedBuildIds={australiaCompletedBuildIds}
          nextBuildLandmarkId={australiaNextBuildLandmarkId}
          buildCompleted={australiaBuildCompleted}
          practiceUnlocked={australiaPracticeUnlocked}
          builtDialogues={australiaBuiltDialogues}
          practiceStarted={australiaPracticeStarted}
          completedPracticeIds={australiaCompletedPracticeIds}
          nextPracticeLandmarkId={australiaNextPracticeLandmarkId}
          practiceCompleted={australiaPracticeCompleted}
          practiceEvidence={australiaPracticeEvidence}
          performUnlocked={australiaPerformUnlocked}
          performStarted={australiaPerformStarted}
          completedPerformIds={australiaCompletedPerformIds}
          nextPerformLandmarkId={australiaNextPerformLandmarkId}
          performCompleted={australiaPerformCompleted}
          performAlreadyRewarded={australiaPerformAlreadyRewarded}
          performEvidence={australiaPerformEvidence}
          performReflection={australiaPerformReflection}
          completedAt={australiaCompletedAt}
          isReplayActive={Boolean(australiaReplayAttempt)}
          replayAttemptNumber={australiaReplayAttempt?.attemptNumber}
          canReplayCountry={australiaCanReplay}
          openReflectionOnEnter={australiaOpenReflectionOnEnter}
          onConsumeOpenReflectionOnEnter={() => setAustraliaOpenReflectionOnEnter(false)}
          onRequestRestartAttempt={() => handleRequestRestartAttempt('australia')}
          onRequestReplayCountry={() => handleRequestReplayCountry('australia')}
          onMarkNpcMet={handleMarkAustraliaNpcMet}
          onMarkPoiExplored={handleMarkAustraliaPoiExplored}
          onStartDiscovery={handleStartAustraliaDiscovery}
          onCompleteDiscoveryMission={handleCompleteAustraliaDiscoveryMission}
          onStartBuild={handleStartAustraliaBuild}
          onCompleteBuildMission={handleCompleteAustraliaBuildMission}
          onStartPractice={handleStartAustraliaPractice}
          onCompletePracticeMission={handleCompleteAustraliaPracticeMission}
          onStartPerform={handleStartAustraliaPerform}
          onCompletePerformChallenge={handleCompleteAustraliaPerformChallenge}
          onCompletePerformMission={handleCompleteAustraliaPerformMission}
          onWebGLFailure={() => {
            setWebglSupported(false);
            setViewMode('2d');
          }}
          onPlaySfx={(kind = 'click') => {
            voxAudio.playSfx(kind, progress.audioPrefs.sfxEnabled, resolvedAppearance);
          }}
          onBackToMap={() => navigate('world-map')}
          onOpenPassport={() => {
            setPassportIntroMode(false);
            setPassportReturnRoute('country-lobby');
            navigate('passport-reward');
          }}
          onToggleQuickAppearance={handleToggleQuickAppearance}
          onToggleMusic={handleToggleMusic}
          onOpenSettings={() => {
            voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
            setSettingsOpen(true);
          }}
        />
      ) : progress.currentRoute === 'country-lobby' &&
        progress.selectedCountryId === 'egypt' &&
        egyptUnlocked ? (
        <EgyptWorldScreen
          language={progress.uiLanguage}
          country={selectedCountry}
          avatar={progress.avatar}
          rewards={progress.rewards}
          appearance={resolvedAppearance}
          reducedMotion={effectiveReducedMotion}
          webglSupported={webglSupported}
          viewMode={viewMode}
          musicPlaying={musicPlaying}
          externalModalOpen={settingsOpen || replayModalTarget !== null}
          exploredPoiIds={egyptExploredPoiIds}
          metNpcIds={egyptMetNpcIds}
          discoverStarted={egyptDiscoverStarted}
          completedDiscoverIds={egyptCompletedDiscoverIds}
          nextDiscoverLandmarkId={egyptNextDiscoverLandmarkId}
          discoverCompleted={egyptDiscoverCompleted}
          buildUnlocked={egyptBuildUnlocked}
          buildStarted={egyptBuildStarted}
          completedBuildChallengeIds={egyptCompletedBuildChallengeIds}
          completedBuildIds={egyptCompletedBuildIds}
          nextBuildLandmarkId={egyptNextBuildLandmarkId}
          buildCompleted={egyptBuildCompleted}
          buildJournal={egyptBuildJournal}
          onStartDiscovery={handleStartEgyptDiscovery}
          onCompleteDiscoveryMission={handleCompleteEgyptDiscoveryMission}
          onStartBuild={handleStartEgyptBuild}
          onRecordBuildChallenge={handleRecordEgyptBuildChallenge}
          onCompleteBuildMission={handleCompleteEgyptBuildMission}
          onMarkNpcMet={handleMarkEgyptNpcMet}
          onMarkPoiExplored={handleMarkEgyptPoiExplored}
          onWebGLFailure={() => {
            setWebglSupported(false);
            setViewMode('2d');
          }}
          onPlaySfx={(kind = 'click') => {
            voxAudio.playSfx(kind, progress.audioPrefs.sfxEnabled, resolvedAppearance);
          }}
          onBackToMap={() => navigate('world-map')}
          onOpenPassport={() => {
            setPassportIntroMode(false);
            setPassportReturnRoute('country-lobby');
            navigate('passport-reward');
          }}
          onToggleQuickAppearance={handleToggleQuickAppearance}
          onToggleMusic={handleToggleMusic}
          onOpenSettings={() => {
            voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
            setSettingsOpen(true);
          }}
        />
      ) : (
        <CountryAdventureScreen
          routeId={progress.currentRoute}
          language={progress.uiLanguage}
          country={selectedCountry}
          progress={progress}
          appearance={resolvedAppearance}
          onBackToMap={() => navigate('world-map')}
          onToggleQuickAppearance={handleToggleQuickAppearance}
          onOpenSettings={() => {
            voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
            setSettingsOpen(true);
          }}
        />
      )}

      {/* Global Game Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => {
          voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
          setSettingsOpen(false);
        }}
        language={progress.uiLanguage}
        onLanguageChange={handleLanguageChange}
        appearanceMode={progress.appearanceMode}
        onAppearanceChange={handleAppearanceChange}
        musicPlaying={musicPlaying}
        musicPrefSaved={progress.audioPrefs.musicEnabled}
        onToggleMusic={handleToggleMusic}
        sfxEnabled={progress.audioPrefs.sfxEnabled}
        onToggleSfx={handleToggleSfx}
        reducedMotion={effectiveReducedMotion}
        onToggleReducedMotion={handleToggleReducedMotion}
        webglSupported={webglSupported}
        viewMode={viewMode}
        onViewModeChange={(mode) => {
          voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
          setViewMode(mode);
        }}
        onResetProgress={handleResetProgress}
      />

      {/* Country Replay / Restart Current Attempt Confirmation Dialog */}
      <ReplayConfirmModal
        isOpen={replayModalTarget !== null}
        mode={replayModalTarget?.mode ?? 'replay'}
        country={replayModalTarget ? getCountryById(replayModalTarget.countryId) : null}
        attemptNumber={
          replayModalTarget?.mode === 'restart'
            ? getCountryReplayAttempt(progress, replayModalTarget.countryId)?.attemptNumber
            : undefined
        }
        language={progress.uiLanguage}
        appearance={resolvedAppearance}
        onConfirm={handleConfirmReplayAction}
        onCancel={() => {
          voxAudio.playSfx('click', progress.audioPrefs.sfxEnabled, resolvedAppearance);
          setReplayModalTarget(null);
        }}
      />
    </div>
  );
}
