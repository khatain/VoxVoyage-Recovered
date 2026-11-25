import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AppLanguage } from '../types/game';
import { GAME_COPY } from '../data/i18n';
import {
  computeWalkablePath,
  getNavDestinationById,
  getWorldNavDestinations,
  resolveNextMissionTarget,
  resolveQuickTravelDestination,
  type ActiveAutoWalkRequest,
  type ActiveQuickTravelRequest,
  type NavDestinationItem,
  type NavPoint2D,
  type NavWorldId,
  type NextMissionResolution,
  type NextMissionWorldState,
  type WorldNavigationContext,
} from './worldNavigation';

export type NavLifecycleStatus = 'idle' | 'walking' | 'arrived' | 'cancelled' | 'error' | 'info';

export interface NavStatusBanner {
  kind: Exclude<NavLifecycleStatus, 'idle'>;
  text: string;
}

export interface UseWorldNavigationOptions {
  worldId: NavWorldId;
  language: AppLanguage;
  initialPosition: NavPoint2D;
  isPaused: boolean;
  reducedMotion: boolean;
  nextMissionState: NextMissionWorldState;
  navContext?: WorldNavigationContext;
  countryUnlocked?: boolean;
  onSyncGuideTarget?: (targetId: string | null) => void;
}

export function useWorldNavigation({
  worldId,
  language,
  initialPosition,
  isPaused,
  reducedMotion,
  nextMissionState,
  navContext,
  countryUnlocked = true,
  onSyncGuideTarget,
}: UseWorldNavigationOptions) {
  const copy = GAME_COPY[language];
  const playerPosRef = useRef<NavPoint2D>(initialPosition);
  const requestSeqRef = useRef(0);
  const statusTimerRef = useRef<number | null>(null);
  const flashTimerRef = useRef<number | null>(null);

  const [autoWalkRequest, setAutoWalkRequest] = useState<ActiveAutoWalkRequest | null>(null);
  const [quickTravelRequest, setQuickTravelRequest] = useState<ActiveQuickTravelRequest | null>(null);
  const [activeDestinationId, setActiveDestinationId] = useState<string | null>(null);
  const [navStatus, setNavStatus] = useState<NavLifecycleStatus>('idle');
  const [statusBanner, setStatusBanner] = useState<NavStatusBanner | null>(null);
  const [isPlacesOpen, setIsPlacesOpen] = useState(false);
  const [quickTravelFlashActive, setQuickTravelFlashActive] = useState(false);

  const destinations = useMemo<NavDestinationItem[]>(
    () => getWorldNavDestinations(worldId),
    [worldId],
  );

  const nextMissionResolution = useMemo<NextMissionResolution>(
    () => resolveNextMissionTarget(nextMissionState),
    [nextMissionState],
  );

  const showBanner = useCallback(
    (kind: Exclude<NavLifecycleStatus, 'idle'>, text: string, ttlMs = 3600) => {
      if (statusTimerRef.current !== null) {
        window.clearTimeout(statusTimerRef.current);
      }
      setStatusBanner({ kind, text });
      if (ttlMs > 0) {
        statusTimerRef.current = window.setTimeout(() => {
          setStatusBanner(null);
          statusTimerRef.current = null;
        }, ttlMs);
      }
    },
    [],
  );

  const handlePlayerPositionChange = useCallback((pos: NavPoint2D) => {
    playerPosRef.current = pos;
  }, []);

  const cancelNavigation = useCallback(
    (reason: 'user' | 'manual' | 'modal' | 'clear' = 'user') => {
      const hadActiveWalk = autoWalkRequest !== null;
      setAutoWalkRequest(null);
      if (reason === 'clear') {
        setActiveDestinationId(null);
        setNavStatus('idle');
        setStatusBanner(null);
        onSyncGuideTarget?.(null);
        return;
      }
      if (!hadActiveWalk) return;
      setNavStatus('cancelled');
      if (reason === 'manual') {
        showBanner('cancelled', copy.navCancelledManual, 2600);
      } else if (reason === 'user') {
        showBanner('cancelled', copy.navCancelledPrefix, 2400);
      }
    },
    [autoWalkRequest, copy.navCancelledManual, copy.navCancelledPrefix, onSyncGuideTarget, showBanner],
  );

  // Stop active Auto-Walk whenever a blocking modal or pause state opens
  useEffect(() => {
    if (isPaused) {
      setIsPlacesOpen(false);
      if (autoWalkRequest) {
        setAutoWalkRequest(null);
        setNavStatus('cancelled');
      }
    }
  }, [isPaused, autoWalkRequest]);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (statusTimerRef.current !== null) window.clearTimeout(statusTimerRef.current);
      if (flashTimerRef.current !== null) window.clearTimeout(flashTimerRef.current);
    };
  }, []);

  const startAutoWalk = useCallback(
    (targetId: string) => {
      setIsPlacesOpen(false);
      const target = getNavDestinationById(worldId, targetId);
      if (!target) {
        setNavStatus('error');
        showBanner('error', copy.navUnreachable, 3500);
        return false;
      }

      const pathResult = computeWalkablePath(
        worldId,
        playerPosRef.current,
        targetId,
        navContext,
      );

      if (!pathResult.reachable || !pathResult.arrivalPoint) {
        setAutoWalkRequest(null);
        setNavStatus('error');
        showBanner('error', copy.navUnreachable, 3800);
        return false;
      }

      setActiveDestinationId(targetId);
      onSyncGuideTarget?.(targetId);

      if (pathResult.reason === 'already_nearby' || pathResult.waypoints.length === 0) {
        setAutoWalkRequest(null);
        setNavStatus('arrived');
        showBanner(
          'arrived',
          `${copy.navAlreadyNearbyPrefix} ${target.title[language]}`,
          2800,
        );
        return true;
      }

      requestSeqRef.current += 1;
      setAutoWalkRequest({
        requestId: requestSeqRef.current,
        targetId,
        targetTitle: target.title,
        waypoints: pathResult.waypoints,
        arrivalPoint: pathResult.arrivalPoint,
      });
      setNavStatus('walking');
      setStatusBanner(null);
      return true;
    },
    [
      copy.navAlreadyNearbyPrefix,
      copy.navUnreachable,
      language,
      navContext,
      onSyncGuideTarget,
      showBanner,
      worldId,
    ],
  );

  const triggerQuickTravel = useCallback(
    (targetId: string) => {
      setIsPlacesOpen(false);
      setAutoWalkRequest(null);
      const resolution = resolveQuickTravelDestination(worldId, targetId, {
        fromPos: playerPosRef.current,
        countryUnlocked,
        context: navContext,
      });

      if (!resolution.allowed || !resolution.arrivalPoint || !resolution.target) {
        setNavStatus('error');
        showBanner('error', copy.navUnreachable, 3500);
        return false;
      }

      requestSeqRef.current += 1;
      const arrival = resolution.arrivalPoint;
      playerPosRef.current = arrival;
      setActiveDestinationId(targetId);
      onSyncGuideTarget?.(targetId);
      setQuickTravelRequest({
        requestId: requestSeqRef.current,
        targetId,
        targetTitle: resolution.target.title,
        arrivalPoint: arrival,
        facingYaw: resolution.facingYaw,
      });
      setNavStatus('arrived');
      showBanner(
        'arrived',
        `${copy.navQuickTravelArrivedPrefix} ${resolution.target.title[language]}`,
        3000,
      );

      if (!reducedMotion) {
        if (flashTimerRef.current !== null) window.clearTimeout(flashTimerRef.current);
        setQuickTravelFlashActive(true);
        flashTimerRef.current = window.setTimeout(() => {
          setQuickTravelFlashActive(false);
          flashTimerRef.current = null;
        }, 280);
      }

      return true;
    },
    [
      copy.navQuickTravelArrivedPrefix,
      copy.navUnreachable,
      countryUnlocked,
      language,
      navContext,
      onSyncGuideTarget,
      reducedMotion,
      showBanner,
      worldId,
    ],
  );

  const goToNextMission = useCallback(
    (mode: 'auto_walk' | 'quick_travel' = 'auto_walk') => {
      setIsPlacesOpen(false);
      if (nextMissionResolution.status === 'actionable' && nextMissionResolution.targetId) {
        if (mode === 'quick_travel') {
          return triggerQuickTravel(nextMissionResolution.targetId);
        }
        return startAutoWalk(nextMissionResolution.targetId);
      }
      setAutoWalkRequest(null);
      setNavStatus('info');
      const fallbackText =
        nextMissionResolution.reasonKey === 'australia_perform_coming_soon'
          ? copy.navComingSoonAustraliaPerform
          : nextMissionResolution.reasonKey === 'australia_practice_coming_soon'
            ? copy.navComingSoonAustraliaPractice
            : nextMissionResolution.reasonKey === 'australia_build_coming_soon'
              ? copy.navComingSoonAustraliaBuild
              : nextMissionResolution.status === 'country_completed'
                ? copy.navCountryCompletedNote
                : nextMissionResolution.message[language] || copy.navNoNextMissionNote;
      showBanner('info', fallbackText, 4500);
      return false;
    },
    [
      copy.navComingSoonAustraliaBuild,
      copy.navComingSoonAustraliaPerform,
      copy.navComingSoonAustraliaPractice,
      copy.navCountryCompletedNote,
      copy.navNoNextMissionNote,
      language,
      nextMissionResolution,
      showBanner,
      startAutoWalk,
      triggerQuickTravel,
    ],
  );

  const handleSceneAutoWalkComplete = useCallback(
    (result: { targetId: string; status: 'arrived' | 'unreachable' }) => {
      setAutoWalkRequest(null);
      const target = getNavDestinationById(worldId, result.targetId);
      if (result.status === 'arrived') {
        setNavStatus('arrived');
        showBanner(
          'arrived',
          `${copy.navArrivedAtPrefix} ${target?.title[language] ?? result.targetId}`,
          2800,
        );
      } else {
        setNavStatus('error');
        showBanner('error', copy.navUnreachable, 3500);
      }
    },
    [copy.navArrivedAtPrefix, copy.navUnreachable, language, showBanner, worldId],
  );

  const handleSceneManualInterrupt = useCallback(() => {
    setAutoWalkRequest(null);
    setNavStatus('cancelled');
    showBanner('cancelled', copy.navCancelledManual, 2400);
  }, [copy.navCancelledManual, showBanner]);

  return {
    destinations,
    nextMissionResolution,
    autoWalkRequest,
    quickTravelRequest,
    activeDestinationId,
    setActiveDestinationId,
    navStatus,
    statusBanner,
    isPlacesOpen,
    setIsPlacesOpen,
    quickTravelFlashActive,
    handlePlayerPositionChange,
    startAutoWalk,
    triggerQuickTravel,
    goToNextMission,
    cancelNavigation,
    handleSceneAutoWalkComplete,
    handleSceneManualInterrupt,
  };
}
