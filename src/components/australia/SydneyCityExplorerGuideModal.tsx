import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Compass,
  Footprints,
  MapPin,
  Navigation,
  Route,
  Sparkles,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import type {
  AppLanguage,
  AustraliaPerformChallengeRecord,
  AustraliaSpeakingEvidenceRecord,
  ResolvedAppearance,
} from '../../types/game';
import { GAME_COPY } from '../../data/i18n';
import {
  AUSTRALIA_LANDMARKS,
  AUSTRALIA_RECOMMENDED_ROUTE,
  type AustraliaLandmarkId,
} from '../../data/australiaWorld';
import {
  AUSTRALIA_DISCOVER_MISSIONS,
  getAustraliaDiscoverMissionMeta,
} from '../../data/australiaDiscovery';
import {
  AUSTRALIA_BUILD_MISSIONS,
  getAustraliaBuildMissionMeta,
} from '../../data/australiaBuild';
import {
  AUSTRALIA_PRACTICE_MISSIONS,
  getAustraliaPracticeMissionSpec,
} from '../../data/australiaPractice';
import {
  AUSTRALIA_PERFORM_CHALLENGES,
  getAustraliaPerformChallengeSpec,
} from '../../data/australiaPerform';
import {
  AustraliaLandmarkBadgeSVG,
  SydneyHarbourSkylineRibbonSVG,
} from './AustraliaSvgArtwork';

interface SydneyCityExplorerGuideModalProps {
  isOpen: boolean;
  language: AppLanguage;
  appearance: ResolvedAppearance;
  exploredLandmarkIds: AustraliaLandmarkId[];
  discoverStarted: boolean;
  completedDiscoverIds: AustraliaLandmarkId[];
  nextDiscoverLandmarkId: AustraliaLandmarkId | null;
  buildUnlocked: boolean;
  buildStarted: boolean;
  completedBuildIds: AustraliaLandmarkId[];
  nextBuildLandmarkId: AustraliaLandmarkId | null;
  buildCompleted: boolean;
  builtDialogues: Record<string, string>;
  practiceUnlocked: boolean;
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
  performEvidence: Record<string, AustraliaPerformChallengeRecord>;
  hasExitedReflectionWithoutSubmit?: boolean;
  guidedLandmarkId: AustraliaLandmarkId | null;
  initialLandmarkId?: AustraliaLandmarkId;
  onGuideToLandmark: (id: AustraliaLandmarkId) => void;
  onClearGuide: () => void;
  onAutoWalkToLandmark?: (id: AustraliaLandmarkId) => void;
  onQuickTravelToLandmark?: (id: AustraliaLandmarkId) => void;
  onLaunchMission: (id: AustraliaLandmarkId) => void;
  onStartDiscovery: () => void;
  onLaunchBuildMission: (id: AustraliaLandmarkId) => void;
  onStartBuild: () => void;
  onLaunchPracticeMission: (id: AustraliaLandmarkId) => void;
  onStartPractice: () => void;
  onLaunchPerformMission: (id: AustraliaLandmarkId) => void;
  onStartPerform: () => void;
  onOpenPerformReflection: () => void;
  onOpenPerformCelebration: () => void;
  onClose: () => void;
  onPlaySfx: (kind?: 'click' | 'select') => void;
}

export function SydneyCityExplorerGuideModal({
  isOpen,
  language,
  appearance,
  exploredLandmarkIds,
  discoverStarted,
  completedDiscoverIds,
  nextDiscoverLandmarkId,
  buildUnlocked,
  buildStarted,
  completedBuildIds,
  nextBuildLandmarkId,
  buildCompleted,
  builtDialogues,
  practiceUnlocked,
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
  performEvidence,
  hasExitedReflectionWithoutSubmit = false,
  guidedLandmarkId,
  initialLandmarkId,
  onGuideToLandmark,
  onClearGuide,
  onAutoWalkToLandmark,
  onQuickTravelToLandmark,
  onLaunchMission,
  onStartDiscovery,
  onLaunchBuildMission,
  onStartBuild,
  onLaunchPracticeMission,
  onStartPractice,
  onLaunchPerformMission,
  onStartPerform,
  onOpenPerformReflection,
  onOpenPerformCelebration,
  onClose,
  onPlaySfx,
}: SydneyCityExplorerGuideModalProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';

  const [activeTab, setActiveTab] = useState<'route' | 'districts'>(
    initialLandmarkId ? 'districts' : 'route',
  );
  const [selectedId, setSelectedId] = useState<AustraliaLandmarkId>(
    initialLandmarkId ?? AUSTRALIA_RECOMMENDED_ROUTE[0],
  );

  useEffect(() => {
    if (!isOpen) return;
    if (initialLandmarkId) {
      setSelectedId(initialLandmarkId);
      setActiveTab('districts');
    } else {
      setActiveTab('route');
    }
  }, [isOpen, initialLandmarkId]);

  useEffect(() => {
    if (!isOpen) return;
    const stopSpeech = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
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
    };
  }, [isOpen, onClose, onPlaySfx]);

  if (!isOpen) return null;

  const orderedLandmarks = AUSTRALIA_RECOMMENDED_ROUTE.map(
    (id) => AUSTRALIA_LANDMARKS.find((lm) => lm.id === id)!,
  ).filter(Boolean);

  const recommendedNext =
    (performUnlocked && performStarted && nextPerformLandmarkId
      ? orderedLandmarks.find((lm) => lm.id === nextPerformLandmarkId)
      : practiceUnlocked && practiceStarted && nextPracticeLandmarkId
        ? orderedLandmarks.find((lm) => lm.id === nextPracticeLandmarkId)
        : buildUnlocked && buildStarted && nextBuildLandmarkId
          ? orderedLandmarks.find((lm) => lm.id === nextBuildLandmarkId)
          : discoverStarted && nextDiscoverLandmarkId
            ? orderedLandmarks.find((lm) => lm.id === nextDiscoverLandmarkId)
            : orderedLandmarks.find((lm) => !exploredLandmarkIds.includes(lm.id))) ?? null;
  const activeLandmark =
    orderedLandmarks.find((lm) => lm.id === selectedId) ?? orderedLandmarks[0];
  const activeMissionMeta = getAustraliaDiscoverMissionMeta(activeLandmark.id);
  const activeBuildMeta = getAustraliaBuildMissionMeta(activeLandmark.id);
  const activePracticeSpec = getAustraliaPracticeMissionSpec(activeLandmark.id);
  const activePerformSpec = getAustraliaPerformChallengeSpec(activeLandmark.id);
  const activeMissionCompleted =
    discoverStarted && completedDiscoverIds.includes(activeLandmark.id);
  const activeMissionEligible =
    discoverStarted && nextDiscoverLandmarkId === activeLandmark.id;
  const activeBuildDone =
    buildUnlocked && buildStarted && completedBuildIds.includes(activeLandmark.id);
  const activeBuildEligible =
    buildUnlocked && buildStarted && nextBuildLandmarkId === activeLandmark.id;
  const activePracticeDone =
    practiceUnlocked && practiceStarted && completedPracticeIds.includes(activeLandmark.id);
  const activePracticeEligible =
    practiceUnlocked && practiceStarted && nextPracticeLandmarkId === activeLandmark.id;
  const activeEvidence = practiceEvidence[activeLandmark.id];
  const activePerformDone =
    performUnlocked && performStarted && completedPerformIds.includes(activeLandmark.id);
  const activePerformEligible =
    performUnlocked && performStarted && nextPerformLandmarkId === activeLandmark.id;
  const activePerformRecord = performEvidence[activeLandmark.id];

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-AU';
    u.rate = 0.95;
    u.pitch = 1.03;
    window.speechSynthesis.speak(u);
  };

  const visitedCount = exploredLandmarkIds.length;
  const totalCount = orderedLandmarks.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sydney-city-guide-title"
      className={`fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 ${
        isNight ? 'bg-[#081229]/75' : 'bg-[#0F2942]/35'
      }`}
    >
      <div
        className={`flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border shadow-2xl ${
          isNight
            ? 'border-[#38BDF8]/45 bg-[#0F1A33] text-[#F8FAFC]'
            : 'border-[#BAE6FD] bg-[#FFFDF8] text-[#1E2E46]'
        }`}
      >
        {/* Header with subtle Sydney Harbour Sail Silhouette */}
        <div
          className={`relative overflow-hidden border-b px-5 py-4 ${
            isNight
              ? 'border-white/12 bg-gradient-to-r from-[#13254A] to-[#0E3A53]'
              : 'border-[#BAE6FD] bg-gradient-to-r from-[#E0F2FE] to-[#ECFEFF]'
          }`}
        >
          <SydneyHarbourSkylineRibbonSVG
            className={`pointer-events-none absolute right-2 bottom-0 h-12 w-60 ${
              isNight ? 'text-[#38BDF8]' : 'text-[#0284C7]'
            }`}
          />

          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0EA5E9] text-white shadow-sm">
                <Compass className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h2
                  id="sydney-city-guide-title"
                  className="font-display text-lg sm:text-xl font-extrabold truncate"
                >
                  {copy.australiaCityGuideTitle}
                </h2>
                <p
                  className={`text-xs font-semibold ${
                    isNight ? 'text-[#BAE6FD]' : 'text-[#0369A1]'
                  }`}
                >
                  {copy.australiaCityGuideSubtitle} ·{' '}
                  <span className="font-mono-num font-extrabold">
                    {visitedCount}/{totalCount}
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onPlaySfx('click');
                onClose();
              }}
              aria-label={copy.closeSettings}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors cursor-pointer ${
                isNight
                  ? 'border-white/15 bg-white/10 text-white hover:bg-white/20'
                  : 'border-[#0284C7]/25 bg-white/85 text-[#1E2E46] hover:bg-white'
              }`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Tabs */}
          <div className="relative z-10 mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onPlaySfx('select');
                setActiveTab('route');
              }}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'route'
                  ? 'bg-[#0EA5E9] text-white shadow-sm'
                  : isNight
                    ? 'bg-white/10 text-[#CBD5E1] hover:bg-white/15'
                    : 'bg-white/80 text-[#334155] hover:bg-white'
              }`}
            >
              <Route className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{copy.australiaCityGuideTabRoute}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onPlaySfx('select');
                setActiveTab('districts');
              }}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'districts'
                  ? 'bg-[#0EA5E9] text-white shadow-sm'
                  : isNight
                    ? 'bg-white/10 text-[#CBD5E1] hover:bg-white/15'
                    : 'bg-white/80 text-[#334155] hover:bg-white'
              }`}
            >
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{copy.australiaCityGuideTabDistricts}</span>
            </button>

            {guidedLandmarkId && (
              <button
                type="button"
                onClick={() => {
                  onPlaySfx('click');
                  onClearGuide();
                }}
                className={`ml-auto inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer ${
                  isNight
                    ? 'border-[#F59E0B]/40 bg-[#451A03]/45 text-[#FDE68A] hover:bg-[#451A03]/70'
                    : 'border-[#F59E0B]/50 bg-[#FFFBEB] text-[#92400E] hover:bg-[#FEF3C7]'
                }`}
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{copy.australiaCityGuideStopGuideButton}</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'route' ? (
            <>
              <div
                className={`rounded-2xl border p-4 ${
                  isNight
                    ? 'border-[#38BDF8]/30 bg-[#152344]'
                    : 'border-[#BAE6FD] bg-[#F0F9FF]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display text-sm font-extrabold">
                      {copy.australiaCityGuideRouteTitle}
                    </h3>
                    <p
                      className={`mt-1 text-xs leading-relaxed ${
                        isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'
                      }`}
                    >
                      {copy.australiaCityGuideRouteDesc}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 text-right">
                    <span className="font-mono-num text-xs font-extrabold text-[#0EA5E9]">
                      DISCOVER: {completedDiscoverIds.length}/{AUSTRALIA_DISCOVER_MISSIONS.length}
                    </span>
                    {buildUnlocked && (
                      <span className="font-mono-num text-xs font-extrabold text-[#10B981]">
                        BUILD: {completedBuildIds.length}/{AUSTRALIA_BUILD_MISSIONS.length}
                      </span>
                    )}
                    {practiceUnlocked && (
                      <span className="font-mono-num text-xs font-extrabold text-[#0284C7] dark:text-[#38BDF8]">
                        PRACTICE: {completedPracticeIds.length}/{AUSTRALIA_PRACTICE_MISSIONS.length}
                      </span>
                    )}
                    {performUnlocked && (
                      <span className="font-mono-num text-xs font-extrabold text-[#D97706] dark:text-[#FBBF24]">
                        PERFORM:{' '}
                        {performCompleted
                          ? AUSTRALIA_PERFORM_CHALLENGES.length
                          : Math.min(
                              completedPerformIds.length,
                              AUSTRALIA_PERFORM_CHALLENGES.length - 1,
                            )}
                        /{AUSTRALIA_PERFORM_CHALLENGES.length}
                      </span>
                    )}
                  </div>
                </div>

                {!discoverStarted ? (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-3 dark:border-white/10">
                    <p className="text-xs font-semibold text-[#0284C7] dark:text-[#38BDF8]">
                      {copy.australiaDiscoverLockedNeedOlivia}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onPlaySfx('click');
                        onStartDiscovery();
                        onClose();
                      }}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-3.5 py-1.5 text-xs font-extrabold text-white hover:bg-[#0284C7] cursor-pointer whitespace-nowrap"
                    >
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{copy.australiaDiscoverStartButton}</span>
                    </button>
                  </div>
                ) : performCompleted ? (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-3 dark:border-white/10">
                    <p className="text-xs font-bold text-[#059669] dark:text-[#34D399]">
                      {copy.australiaPerformObjectiveCompleted}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onPlaySfx('select');
                        onOpenPerformCelebration();
                        onClose();
                      }}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#F2C66D] px-3.5 py-1.5 text-xs font-extrabold text-[#131E31] hover:bg-[#f6d388] cursor-pointer whitespace-nowrap"
                    >
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{copy.australiaPerformViewCelebrationButton}</span>
                    </button>
                  </div>
                ) : performUnlocked && !performStarted ? (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-3 dark:border-white/10">
                    <p className="text-xs font-semibold text-[#0284C7] dark:text-[#38BDF8]">
                      {copy.australiaPerformObjectiveStart}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onPlaySfx('select');
                        onStartPerform();
                        onClose();
                      }}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#F2C66D] px-3.5 py-1.5 text-xs font-extrabold text-[#131E31] hover:bg-[#f6d388] cursor-pointer whitespace-nowrap"
                    >
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{copy.australiaPerformStartButton}</span>
                    </button>
                  </div>
                ) : performUnlocked && performStarted && completedPerformIds.length >= AUSTRALIA_PERFORM_CHALLENGES.length ? (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-3 dark:border-white/10">
                    <p className="text-xs font-bold text-[#D97706] dark:text-[#FBBF24]">
                      {copy.australiaPerformReflectionGateNotice}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onPlaySfx('select');
                        onOpenPerformReflection();
                        onClose();
                      }}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#F2C66D] px-3.5 py-1.5 text-xs font-extrabold text-[#131E31] hover:bg-[#f6d388] cursor-pointer whitespace-nowrap"
                    >
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {hasExitedReflectionWithoutSubmit
                          ? copy.australiaPerformResumeReflectionButton
                          : copy.australiaPerformCompleteReflectionButton}
                      </span>
                    </button>
                  </div>
                ) : performUnlocked && performStarted ? (
                  <div
                    className={`mt-3 rounded-xl border px-3.5 py-2.5 text-xs font-bold ${
                      isNight
                        ? 'border-[#F2C66D]/35 bg-[#2A2215] text-[#FDE68A]'
                        : 'border-[#FCD34D] bg-[#FFFBEB] text-[#92400E]'
                    }`}
                  >
                    {copy.australiaPerformGuideSectionTitle} — {copy.australiaPerformGuideSectionDesc}
                  </div>
                ) : practiceUnlocked && !practiceStarted ? (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-3 dark:border-white/10">
                    <p className="text-xs font-semibold text-[#0284C7] dark:text-[#38BDF8]">
                      {copy.australiaPracticeObjectiveStart}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onPlaySfx('click');
                        onStartPractice();
                        onClose();
                      }}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-3.5 py-1.5 text-xs font-extrabold text-white hover:bg-[#0284C7] cursor-pointer whitespace-nowrap"
                    >
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{copy.australiaPracticeStartButton}</span>
                    </button>
                  </div>
                ) : practiceUnlocked && practiceStarted ? (
                  <div
                    className={`mt-3 rounded-xl border px-3.5 py-2.5 text-xs font-bold ${
                      isNight
                        ? 'border-[#38BDF8]/35 bg-[#10203E] text-[#BAE6FD]'
                        : 'border-[#BAE6FD] bg-white text-[#0369A1]'
                    }`}
                  >
                    {copy.australiaPracticeGuideSectionTitle} — {copy.australiaPracticeGuideSectionDesc}
                  </div>
                ) : buildUnlocked && !buildStarted ? (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-3 dark:border-white/10">
                    <p className="text-xs font-semibold text-[#0284C7] dark:text-[#38BDF8]">
                      {copy.australiaBuildObjectiveStart}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onPlaySfx('click');
                        onStartBuild();
                        onClose();
                      }}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#10B981] px-3.5 py-1.5 text-xs font-extrabold text-white hover:bg-[#059669] cursor-pointer whitespace-nowrap"
                    >
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{copy.australiaBuildStartButton}</span>
                    </button>
                  </div>
                ) : buildUnlocked && buildStarted ? (
                  <div
                    className={`mt-3 rounded-xl border px-3.5 py-2.5 text-xs font-bold ${
                      isNight
                        ? 'border-[#38BDF8]/35 bg-[#10203E] text-[#BAE6FD]'
                        : 'border-[#BAE6FD] bg-white text-[#0369A1]'
                    }`}
                  >
                    {copy.australiaBuildGuideSectionTitle} — {copy.australiaBuildGuideSectionDesc}
                  </div>
                ) : (
                  visitedCount >= totalCount && (
                    <p className={`mt-2 text-xs font-bold ${isNight ? 'text-[#34D399]' : 'text-[#059669]'}`}>
                      {copy.australiaCityGuideAllVisitedNote}
                    </p>
                  )
                )}
              </div>

              <div className="space-y-2.5">
                {orderedLandmarks.map((lm) => {
                  const visited = exploredLandmarkIds.includes(lm.id);
                  const isRecommended = recommendedNext?.id === lm.id;
                  const isGuided = guidedLandmarkId === lm.id;
                  const missionMeta = getAustraliaDiscoverMissionMeta(lm.id);
                  const buildMeta = getAustraliaBuildMissionMeta(lm.id);
                  const practiceSpec = getAustraliaPracticeMissionSpec(lm.id);
                  const performSpec = getAustraliaPerformChallengeSpec(lm.id);
                  const missionDone =
                    discoverStarted && completedDiscoverIds.includes(lm.id);
                  const missionPlayableNext =
                    discoverStarted && nextDiscoverLandmarkId === lm.id;
                  const buildDone =
                    buildUnlocked && buildStarted && completedBuildIds.includes(lm.id);
                  const buildPlayableNext =
                    buildUnlocked && buildStarted && nextBuildLandmarkId === lm.id;
                  const practiceDone =
                    practiceUnlocked && practiceStarted && completedPracticeIds.includes(lm.id);
                  const practicePlayableNext =
                    practiceUnlocked && practiceStarted && nextPracticeLandmarkId === lm.id;
                  const performDone =
                    performUnlocked && performStarted && completedPerformIds.includes(lm.id);
                  const performPlayableNext =
                    performUnlocked && performStarted && nextPerformLandmarkId === lm.id;
                  const savedBuildLine = builtDialogues[lm.id];
                  const savedPracticeRecord = practiceEvidence[lm.id];
                  const savedPerformRecord = performEvidence[lm.id];

                  return (
                    <div
                      key={lm.id}
                      className={`flex flex-col gap-3 rounded-2xl border p-3.5 sm:flex-row sm:items-center sm:justify-between ${
                        isGuided
                          ? isNight
                            ? 'border-[#FBBF24]/70 bg-[#2C2415]'
                            : 'border-[#F59E0B] bg-[#FFFBEB]'
                          : isNight
                            ? 'border-white/12 bg-[#16223E]'
                            : 'border-[#E2E8F0] bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-mono-num text-sm font-extrabold text-white shadow-sm"
                          style={{ backgroundColor: lm.accentColor }}
                        >
                          {lm.order}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-display text-sm font-extrabold">{lm.title[language]}</span>
                            <span
                              className={`text-[11px] font-bold ${
                                performUnlocked && performStarted
                                  ? performDone
                                    ? 'text-[#10B981]'
                                    : performPlayableNext
                                      ? 'text-[#D97706] dark:text-[#FBBF24]'
                                      : isNight
                                        ? 'text-[#94A3B8]'
                                        : 'text-[#64748B]'
                                  : practiceUnlocked && practiceStarted
                                    ? practiceDone
                                      ? 'text-[#10B981]'
                                      : practicePlayableNext
                                        ? 'text-[#0EA5E9]'
                                        : isNight
                                          ? 'text-[#94A3B8]'
                                          : 'text-[#64748B]'
                                    : buildUnlocked && buildStarted
                                      ? buildDone
                                        ? 'text-[#10B981]'
                                        : buildPlayableNext
                                          ? 'text-[#0EA5E9]'
                                          : isNight
                                            ? 'text-[#94A3B8]'
                                            : 'text-[#64748B]'
                                      : missionDone
                                        ? 'text-[#10B981]'
                                        : missionPlayableNext
                                          ? 'text-[#0EA5E9]'
                                          : isNight
                                            ? 'text-[#94A3B8]'
                                            : 'text-[#64748B]'
                              }`}
                            >
                              ·{' '}
                              {performUnlocked && performStarted
                                ? performDone
                                  ? copy.australiaPerformCompletedBadge
                                  : performPlayableNext
                                    ? copy.australiaPerformPlayableBadge
                                    : copy.australiaCityGuideNotVisitedBadge
                                : practiceUnlocked && practiceStarted
                                  ? practiceDone
                                    ? copy.australiaPracticeCompletedBadge
                                    : practicePlayableNext
                                      ? copy.australiaPracticePlayableBadge
                                      : copy.australiaCityGuideNotVisitedBadge
                                  : buildUnlocked && buildStarted
                                    ? buildDone
                                      ? copy.australiaBuildCompletedBadge
                                      : buildPlayableNext
                                        ? copy.australiaBuildPlayableBadge
                                        : copy.australiaCityGuideNotVisitedBadge
                                    : missionDone
                                      ? copy.australiaDiscoverCompletedBadge
                                      : missionPlayableNext
                                        ? copy.australiaDiscoverPlayableBadge
                                        : visited
                                          ? copy.australiaCityGuideVisitedBadge
                                          : copy.australiaCityGuideNotVisitedBadge}
                              {isRecommended && ` · ${copy.australiaCityGuideNextStopBadge}`}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs font-bold text-[#0284C7] dark:text-[#38BDF8]">
                            {performUnlocked && performStarted && performSpec
                              ? `${performSpec.title[language]} (${performSpec.turns.length} turns)`
                              : practiceUnlocked && practiceStarted && practiceSpec
                                ? `${practiceSpec.title[language]} (${practiceSpec.turns.length} turns)`
                                : buildUnlocked && buildStarted
                                  ? `${buildMeta.title[language]} (${buildMeta.mechanicLabel[language]})`
                                  : `${missionMeta.title[language]} (${missionMeta.mechanicLabel[language]})`}
                          </p>
                          <p className={`mt-0.5 text-xs ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                            {performUnlocked && performStarted && savedPerformRecord
                              ? savedPerformRecord.practiceMode === 'microphone_recording'
                                ? copy.australiaPracticeEvidenceBadgeMic
                                : copy.australiaPracticeEvidenceBadgeNoMic
                              : savedPracticeRecord
                                ? savedPracticeRecord.practiceMode === 'microphone_recording'
                                  ? copy.australiaPracticeEvidenceBadgeMic
                                  : copy.australiaPracticeEvidenceBadgeNoMic
                                : savedBuildLine
                                  ? `${copy.australiaBuildSavedDialogueLabel}: “${savedBuildLine}”`
                                  : lm.languageFocus[language]}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {(performPlayableNext || performDone) && (
                          <button
                            type="button"
                            onClick={() => {
                              onPlaySfx('select');
                              onClose();
                              onLaunchPerformMission(lm.id);
                            }}
                            className={`min-h-[38px] rounded-xl px-3 py-1.5 text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                              performDone
                                ? isNight
                                  ? 'border border-[#10B981]/50 bg-[#0D2B24] text-[#A7F3D0]'
                                  : 'border border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]'
                                : 'bg-[#F2C66D] text-[#131E31] hover:bg-[#f6d388]'
                            }`}
                          >
                            {performDone
                              ? copy.australiaPerformReviewChallengeButton
                              : copy.australiaPerformPlayChallengeButton}
                          </button>
                        )}

                        {(practicePlayableNext || practiceDone) && (
                          <button
                            type="button"
                            onClick={() => {
                              onPlaySfx('select');
                              onClose();
                              onLaunchPracticeMission(lm.id);
                            }}
                            className={`min-h-[38px] rounded-xl px-3 py-1.5 text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                              practiceDone
                                ? isNight
                                  ? 'border border-[#10B981]/50 bg-[#0D2B24] text-[#A7F3D0]'
                                  : 'border border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]'
                                : 'bg-[#0EA5E9] text-white hover:bg-[#0284C7]'
                            }`}
                          >
                            {practiceDone
                              ? copy.australiaPracticeReviewMissionButton
                              : copy.australiaPracticePlayMissionButton}
                          </button>
                        )}

                        {(buildPlayableNext || buildDone) && (
                          <button
                            type="button"
                            onClick={() => {
                              onPlaySfx('select');
                              onClose();
                              onLaunchBuildMission(lm.id);
                            }}
                            className={`min-h-[38px] rounded-xl px-3 py-1.5 text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                              buildDone
                                ? isNight
                                  ? 'border border-[#10B981]/50 bg-[#0D2B24] text-[#A7F3D0]'
                                  : 'border border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]'
                                : 'bg-[#0EA5E9] text-white hover:bg-[#0284C7]'
                            }`}
                          >
                            {buildDone
                              ? practiceUnlocked
                                ? copy.australiaPracticeReviewBuildToggle
                                : copy.australiaBuildReviewMissionButton
                              : copy.australiaBuildPlayMissionButton}
                          </button>
                        )}

                        {(missionPlayableNext || missionDone) && !practiceUnlocked && (
                          <button
                            type="button"
                            onClick={() => {
                              onPlaySfx('select');
                              onClose();
                              onLaunchMission(lm.id);
                            }}
                            className={`min-h-[38px] rounded-xl px-3 py-1.5 text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                              missionDone
                                ? isNight
                                  ? 'border border-[#10B981]/50 bg-[#0D2B24] text-[#A7F3D0]'
                                  : 'border border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]'
                                : 'bg-[#10B981] text-white hover:bg-[#059669]'
                            }`}
                          >
                            {missionDone
                              ? buildUnlocked
                                ? copy.australiaBuildReviewDiscoverToggle
                                : copy.australiaDiscoverReviewMissionButton
                              : copy.australiaDiscoverPlayMissionButton}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            onPlaySfx('select');
                            setSelectedId(lm.id);
                            setActiveTab('districts');
                          }}
                          className={`min-h-[38px] rounded-xl border px-3 py-1.5 text-xs font-bold whitespace-nowrap cursor-pointer ${
                            isNight
                              ? 'border-white/15 bg-white/8 text-[#E2E8F0] hover:bg-white/15'
                              : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#334155] hover:bg-[#F1F5F9]'
                          }`}
                        >
                          {copy.australiaCityGuideTabDistricts}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onPlaySfx('click');
                            onGuideToLandmark(lm.id);
                            onClose();
                          }}
                          className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-extrabold whitespace-nowrap transition-colors cursor-pointer ${
                            isGuided
                              ? 'bg-[#F59E0B] text-[#1E293B]'
                              : 'bg-[#0EA5E9] text-white hover:bg-[#0284C7]'
                          }`}
                        >
                          <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            {isGuided
                              ? copy.australiaCityGuideGuidingActiveButton
                              : copy.australiaCityGuideGuideMeButton}
                          </span>
                        </button>

                        {onAutoWalkToLandmark && (
                          <button
                            type="button"
                            onClick={() => {
                              onPlaySfx('click');
                              onClose();
                              onAutoWalkToLandmark(lm.id);
                            }}
                            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#0D9488] px-3 py-1.5 text-xs font-extrabold text-white hover:bg-[#0F766E] whitespace-nowrap cursor-pointer"
                          >
                            <Footprints className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{copy.navAutoWalkButton}</span>
                          </button>
                        )}

                        {onQuickTravelToLandmark && (
                          <button
                            type="button"
                            onClick={() => {
                              onPlaySfx('click');
                              onClose();
                              onQuickTravelToLandmark(lm.id);
                            }}
                            className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                              isNight
                                ? 'border-cyan-400/50 bg-cyan-950/60 text-cyan-200 hover:bg-cyan-900/70'
                                : 'border-cyan-500/40 bg-cyan-50 text-cyan-800 hover:bg-cyan-100'
                            }`}
                          >
                            <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{copy.navQuickTravelButton}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="grid gap-4 md:grid-cols-[220px_1fr]">
              {/* District Selector Rail */}
              <div className="space-y-1.5">
                {orderedLandmarks.map((lm) => {
                  const selected = lm.id === activeLandmark.id;
                  const visited = exploredLandmarkIds.includes(lm.id);
                  return (
                    <button
                      key={lm.id}
                      type="button"
                      onClick={() => {
                        onPlaySfx('select');
                        setSelectedId(lm.id);
                      }}
                      className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-bold transition-colors cursor-pointer ${
                        selected
                          ? 'border-[#0EA5E9] bg-[#0EA5E9] text-white shadow-sm'
                          : isNight
                            ? 'border-white/10 bg-[#16223E] text-[#E2E8F0] hover:bg-[#1E2E52]'
                            : 'border-[#E2E8F0] bg-white text-[#1E2E46] hover:bg-[#F0F9FF]'
                      }`}
                    >
                      <span className="truncate">
                        {lm.order}. {lm.title[language]}
                      </span>
                      {visited && (
                        <CheckCircle2
                          className={`h-3.5 w-3.5 shrink-0 ${selected ? 'text-white' : 'text-[#10B981]'}`}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected District Card */}
              <div
                className={`flex flex-col justify-between rounded-2xl border p-4 sm:p-5 ${
                  isNight ? 'border-white/15 bg-[#16223E]' : 'border-[#CBD5E1] bg-white'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <AustraliaLandmarkBadgeSVG
                        landmarkId={activeLandmark.id}
                        className="h-16 w-24 shrink-0 rounded-xl shadow-sm"
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] font-extrabold text-[#0EA5E9]">
                          {activeLandmark.districtBadge[language]}
                        </p>
                        <h3 className="font-display text-lg font-extrabold leading-tight">
                          {activeLandmark.title[language]}
                        </h3>
                        <p className={`text-xs ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                          {activeLandmark.subtitle[language]}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        speakText(
                          `${activeLandmark.title.en}. ${activeLandmark.description.en} Communication focus: ${activeLandmark.languageFocus.en}.`,
                        )
                      }
                      aria-label={copy.australiaListenDialogue}
                      className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold whitespace-nowrap cursor-pointer ${
                        isNight
                          ? 'border-white/15 bg-white/10 text-white hover:bg-white/20'
                          : 'border-[#BAE6FD] bg-[#F0F9FF] text-[#0369A1] hover:bg-[#E0F2FE]'
                      }`}
                    >
                      <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{copy.australiaListenDialogue}</span>
                    </button>
                  </div>

                  <p className={`text-sm leading-relaxed ${isNight ? 'text-[#E2E8F0]' : 'text-[#334155]'}`}>
                    {activeLandmark.description[language]}
                  </p>

                  <div
                    className={`rounded-xl border p-3.5 ${
                      isNight
                        ? 'border-[#38BDF8]/30 bg-[#10203E]'
                        : 'border-[#BAE6FD] bg-[#F0F9FF]'
                    }`}
                  >
                    <p className="text-[11px] font-extrabold text-[#0EA5E9]">
                      {copy.australiaCityGuideLanguageFocusLabel}
                    </p>
                    <p className="mt-1 text-sm font-bold">{activeLandmark.languageFocus[language]}</p>
                    <p className={`mt-1.5 text-xs ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                      {activeLandmark.interactionSpark[language]}
                    </p>
                  </div>

                  <div
                    className={`rounded-xl border p-3.5 ${
                      isNight
                        ? 'border-white/10 bg-[#121D36]'
                        : 'border-[#E2E8F0] bg-[#F8FAFC]'
                    }`}
                  >
                    <p className="text-[11px] font-extrabold text-[#10B981]">
                      {copy.australiaCityGuideCulturalNoteLabel}
                    </p>
                    <p className={`mt-1 text-xs leading-relaxed ${isNight ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                      {activeLandmark.culturalNote[language]}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-3 dark:border-white/10">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onPlaySfx('click');
                        onGuideToLandmark(activeLandmark.id);
                        onClose();
                      }}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#0284C7] cursor-pointer whitespace-nowrap"
                    >
                      <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{copy.australiaCityGuideGuideMeButton}</span>
                    </button>

                    {onAutoWalkToLandmark && (
                      <button
                        type="button"
                        onClick={() => {
                          onPlaySfx('click');
                          onClose();
                          onAutoWalkToLandmark(activeLandmark.id);
                        }}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#0D9488] px-3.5 py-2 text-xs font-extrabold text-white hover:bg-[#0F766E] cursor-pointer whitespace-nowrap"
                      >
                        <Footprints className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{copy.navAutoWalkButton}</span>
                      </button>
                    )}

                    {onQuickTravelToLandmark && (
                      <button
                        type="button"
                        onClick={() => {
                          onPlaySfx('click');
                          onClose();
                          onQuickTravelToLandmark(activeLandmark.id);
                        }}
                        className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-extrabold cursor-pointer whitespace-nowrap ${
                          isNight
                            ? 'border-cyan-400/50 bg-cyan-950/60 text-cyan-200 hover:bg-cyan-900/70'
                            : 'border-cyan-500/40 bg-cyan-50 text-cyan-800 hover:bg-cyan-100'
                        }`}
                      >
                        <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{copy.navQuickTravelButton}</span>
                      </button>
                    )}

                    {(activePerformEligible || activePerformDone) && (
                      <button
                        type="button"
                        onClick={() => {
                          onPlaySfx('select');
                          onClose();
                          onLaunchPerformMission(activeLandmark.id);
                        }}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#F2C66D] px-4 py-2 text-xs font-extrabold text-[#131E31] hover:bg-[#f6d388] cursor-pointer whitespace-nowrap"
                      >
                        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>
                          {activePerformDone
                            ? copy.australiaPerformReviewChallengeButton
                            : copy.australiaPerformPlayChallengeButton}
                        </span>
                      </button>
                    )}

                    {(activePracticeEligible || activePracticeDone) && (
                      <button
                        type="button"
                        onClick={() => {
                          onPlaySfx('select');
                          onClose();
                          onLaunchPracticeMission(activeLandmark.id);
                        }}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#0284C7] cursor-pointer whitespace-nowrap"
                      >
                        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>
                          {activePracticeDone
                            ? copy.australiaPracticeReviewMissionButton
                            : copy.australiaPracticePlayMissionButton}
                        </span>
                      </button>
                    )}

                    {(activeBuildEligible || activeBuildDone) && (
                      <button
                        type="button"
                        onClick={() => {
                          onPlaySfx('select');
                          onClose();
                          onLaunchBuildMission(activeLandmark.id);
                        }}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#10B981] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#059669] cursor-pointer whitespace-nowrap"
                      >
                        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>
                          {activeBuildDone
                            ? practiceUnlocked
                              ? copy.australiaPracticeReviewBuildToggle
                              : copy.australiaBuildReviewMissionButton
                            : copy.australiaBuildPlayMissionButton}
                        </span>
                      </button>
                    )}

                    {(activeMissionEligible || activeMissionCompleted) && !practiceUnlocked && (
                      <button
                        type="button"
                        onClick={() => {
                          onPlaySfx('select');
                          onClose();
                          onLaunchMission(activeLandmark.id);
                        }}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#10B981] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#059669] cursor-pointer whitespace-nowrap"
                      >
                        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>
                          {activeMissionCompleted
                            ? buildUnlocked
                              ? copy.australiaBuildReviewDiscoverToggle
                              : copy.australiaDiscoverReviewMissionButton
                            : copy.australiaDiscoverPlayMissionButton}
                        </span>
                      </button>
                    )}
                  </div>

                  <span
                    className={`text-xs font-bold ${
                      activePerformDone || activePracticeDone || activeBuildDone || activeMissionCompleted
                        ? 'text-[#10B981]'
                        : isNight
                          ? 'text-[#94A3B8]'
                          : 'text-[#64748B]'
                    }`}
                  >
                    {performUnlocked && performStarted && activePerformSpec
                      ? `${activePerformSpec.title[language]} · ${
                          activePerformRecord
                            ? activePerformRecord.practiceMode === 'microphone_recording'
                              ? copy.australiaPracticeEvidenceBadgeMic
                              : copy.australiaPracticeEvidenceBadgeNoMic
                            : activePerformEligible
                              ? copy.australiaPerformPlayableBadge
                              : copy.australiaCityGuideNotVisitedBadge
                        }`
                      : practiceUnlocked && practiceStarted && activePracticeSpec
                        ? `${activePracticeSpec.title[language]} · ${
                            activeEvidence
                              ? activeEvidence.practiceMode === 'microphone_recording'
                                ? copy.australiaPracticeEvidenceBadgeMic
                                : copy.australiaPracticeEvidenceBadgeNoMic
                              : activePracticeEligible
                                ? copy.australiaPracticePlayableBadge
                                : copy.australiaCityGuideNotVisitedBadge
                          }`
                        : buildUnlocked && buildStarted
                          ? `${activeBuildMeta.title[language]} · ${
                              activeBuildDone
                                ? copy.australiaBuildCompletedBadge
                                : activeBuildEligible
                                  ? copy.australiaBuildPlayableBadge
                                  : copy.australiaCityGuideNotVisitedBadge
                            }`
                          : `${activeMissionMeta.title[language]} · ${
                              activeMissionCompleted
                                ? copy.australiaDiscoverCompletedBadge
                                : activeMissionEligible
                                  ? copy.australiaDiscoverPlayableBadge
                                  : copy.australiaCityGuideNotVisitedBadge
                            }`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Stage Note */}
          <div
            className={`rounded-2xl border px-4 py-3 text-xs font-semibold ${
              isNight
                ? 'border-white/12 bg-[#111B33] text-[#CBD5E1]'
                : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#475569]'
            }`}
          >
            {performCompleted
              ? copy.australiaPerformObjectiveCompleted
              : performUnlocked
                ? copy.australiaPerformGuideSectionDesc
                : practiceUnlocked
                  ? copy.australiaPracticeGuideSectionDesc
                  : buildUnlocked
                    ? copy.australiaBuildGuideSectionDesc
                    : copy.australiaCityGuidePhaseNote}
          </div>
        </div>
      </div>
    </div>
  );
}
