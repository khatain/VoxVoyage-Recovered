import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Compass,
  Flag,
  HelpCircle,
  MapPin,
  Play,
  RotateCcw,
  Sparkles,
  Star,
  Trash2,
  Undo2,
  X,
} from 'lucide-react';
import type { AppLanguage, LocalizedText } from '../../../types/game';
import { GAME_COPY } from '../../../data/i18n';
import {
  ARCHITECT_BOARD_COLS,
  ARCHITECT_BOARD_LANDMARKS,
  ARCHITECT_BOARD_ROWS,
  joinNormalizedTiles,
  validatePyramidRouteArchitectSubmission,
  type ArchitectSimulationResult,
  type BuildTile,
  type RouteArchitectVariant,
  type RouteDirectionKind,
} from '../../../data/egyptBuild';
import { shuffleArray } from '../../../utils/shuffle';
import type { BuildSolvedPayload } from './ExpeditionCommandForgeGame';
import {
  ArchitectLandmarkSVG,
  DesertCompassRoseSVG,
  PyramidExplorerTokenSVG,
  SandDuneBlockedSVG,
} from './PyramidRouteBoardArtwork';

interface PyramidRouteArchitectGameProps {
  language: AppLanguage;
  isNight: boolean;
  variant: RouteArchitectVariant;
  challengeKey: string;
  isSolved: boolean;
  onSolved: (payload: BuildSolvedPayload) => void;
  onFeedback: (state: { isCorrect: boolean; message: LocalizedText } | null) => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'reward') => void;
}

const TUTORIAL_STORAGE_KEY = 'voxvoyage.pyramidRouteTutorialSeen.v1';
const STEP_INTERVAL_MS = 260;

const HEADING_ROTATION: Record<RouteDirectionKind, number> = {
  N: 0,
  E: 90,
  S: 180,
  W: 270,
};

const HEADING_LABEL: Record<RouteDirectionKind, LocalizedText> = {
  N: { en: 'North', th: 'เหนือ (N)' },
  E: { en: 'East', th: 'ตะวันออก (E)' },
  S: { en: 'South', th: 'ใต้ (S)' },
  W: { en: 'West', th: 'ตะวันตก (W)' },
};

const TUTORIAL_STEPS: Array<{ en: string; th: string }> = [
  {
    en: 'Read the Mission Goal and locate START and GOAL on the desert map.',
    th: 'อ่านเป้าหมายภารกิจ แล้วมองหาจุด START และจุด GOAL บนแผนที่',
  },
  {
    en: 'Check the Compass (N/E/S/W) and which way the explorer is facing.',
    th: 'ดูเข็มทิศ (N/E/S/W) และทิศที่นักสำรวจกำลังหันหน้าอยู่',
  },
  {
    en: 'Plan around blocked sand dunes before choosing turns and block counts.',
    th: 'หลีกเลี่ยงแนวเนินทรายที่ปิดกั้นก่อนเลือกทิศเลี้ยวและจำนวนช่องเดิน',
  },
  {
    en: 'Tap phrase tiles to build your English route instruction (saved to My Expedition Instructions).',
    th: 'แตะการ์ดคำเพื่อเรียงประโยคบอกทางภาษาอังกฤษ (บันทึกในสมุดคำสั่งของคุณ)',
  },
  {
    en: 'Press Test Route to watch your explorer walk step by step.',
    th: 'กดทดสอบเส้นทาง (Test Route) เพื่อดูนักสำรวจเดินตามคำสั่งทีละก้าว',
  },
  {
    en: 'Use Undo, Retry, or Reset anytime to refine your directions.',
    th: 'ใช้ Undo, ลองใหม่ (Retry) หรือ Reset ได้ทุกเมื่อเพื่อปรับประโยคให้แม่นยำ',
  },
];

function readTutorialSeen(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    return window.localStorage.getItem(TUTORIAL_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function writeTutorialSeen(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(TUTORIAL_STORAGE_KEY, '1');
    }
  } catch {
    // Ignore storage quota / sandbox restrictions
  }
}

function prefersReducedMotionActive(): boolean {
  if (typeof window === 'undefined') return false;
  const mediaReduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const classReduced =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('reduced-motion');
  return mediaReduced || classReduced;
}

function nextShortestAngle(
  currentDeg: number,
  nextFacing: RouteDirectionKind,
): number {
  const targetMod = HEADING_ROTATION[nextFacing];
  const currentMod = ((currentDeg % 360) + 360) % 360;
  let delta = targetMod - currentMod;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return currentDeg + delta;
}

function clampBoardCoord(val: number, maxExclusive: number): number {
  return Math.max(0, Math.min(maxExclusive - 1, val));
}

export function PyramidRouteArchitectGame({
  language,
  isNight,
  variant,
  challengeKey,
  isSolved,
  onSolved,
  onFeedback,
  onPlaySfx,
}: PyramidRouteArchitectGameProps) {
  const copy = GAME_COPY[language];
  const [shuffledTiles, setShuffledTiles] = useState<BuildTile[]>(() =>
    shuffleArray(variant.tiles),
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [simResult, setSimResult] = useState<ArchitectSimulationResult | null>(
    null,
  );
  const [animStepIndex, setAnimStepIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [explorerRotationDeg, setExplorerRotationDeg] = useState<number>(
    () => HEADING_ROTATION[variant.startPos.facing],
  );
  const [showTutorial, setShowTutorial] = useState<boolean>(
    () => !readTutorialSeen(),
  );

  const timeoutsRef = useRef<number[]>([]);

  const clearScheduledTimers = useCallback(() => {
    if (timeoutsRef.current.length > 0) {
      for (const timerId of timeoutsRef.current) {
        window.clearTimeout(timerId);
      }
      timeoutsRef.current = [];
    }
  }, []);

  useEffect(() => {
    clearScheduledTimers();
    setShuffledTiles(shuffleArray(variant.tiles));
    setSelectedIds([]);
    setSimResult(null);
    setAnimStepIndex(0);
    setIsAnimating(false);
    setExplorerRotationDeg(HEADING_ROTATION[variant.startPos.facing]);
    return () => {
      clearScheduledTimers();
    };
  }, [challengeKey, variant, clearScheduledTimers]);

  const dismissTutorial = () => {
    onPlaySfx('click');
    writeTutorialSeen();
    setShowTutorial(false);
  };

  const selectedTiles = selectedIds
    .map((id) => variant.tiles.find((t) => t.instanceId === id))
    .filter((t): t is BuildTile => Boolean(t));

  const assembledSentence = joinNormalizedTiles(
    selectedTiles.map((t) => t.value),
  );

  const resetExplorerTraceOnly = () => {
    clearScheduledTimers();
    setIsAnimating(false);
    setSimResult(null);
    setAnimStepIndex(0);
    setExplorerRotationDeg(HEADING_ROTATION[variant.startPos.facing]);
  };

  const handleSelectTile = (instanceId: string) => {
    if (isSolved || isAnimating || selectedIds.includes(instanceId)) return;
    onPlaySfx('select');
    onFeedback(null);
    resetExplorerTraceOnly();
    setSelectedIds((prev) => [...prev, instanceId]);
  };

  const handleRemoveSelected = (instanceId: string) => {
    if (isSolved || isAnimating) return;
    onPlaySfx('click');
    onFeedback(null);
    resetExplorerTraceOnly();
    setSelectedIds((prev) => prev.filter((id) => id !== instanceId));
  };

  const handleUndo = () => {
    if (selectedIds.length === 0 || isSolved || isAnimating) return;
    onPlaySfx('click');
    onFeedback(null);
    resetExplorerTraceOnly();
    setSelectedIds((prev) => prev.slice(0, -1));
  };

  const handleRetryRoute = () => {
    if (isSolved || isAnimating) return;
    onPlaySfx('click');
    onFeedback(null);
    resetExplorerTraceOnly();
  };

  const handleReset = () => {
    if (isSolved) return;
    onPlaySfx('click');
    onFeedback(null);
    resetExplorerTraceOnly();
    setSelectedIds([]);
    setShuffledTiles(shuffleArray(variant.tiles));
  };

  const commitSimulationOutcome = (
    result: ArchitectSimulationResult & { sentence: string },
  ) => {
    const passed = result.validGrammar && result.validRoute;
    onFeedback({ isCorrect: passed, message: result.feedback });
    if (passed) {
      onPlaySfx('reward');
      onSolved({
        instructionText: result.sentence,
        instructionLines: [result.sentence],
        thaiScaffold: variant.thaiScaffold,
      });
    } else {
      onPlaySfx('click');
    }
  };

  const handleTestRoute = () => {
    if (isSolved || isAnimating) return;

    clearScheduledTimers();
    onFeedback(null);

    const result = validatePyramidRouteArchitectSubmission(
      variant,
      selectedTiles.map((t) => t.value),
    );
    setSimResult(result);

    const totalSteps = result.path.length;
    const reducedMotion = prefersReducedMotionActive();

    if (reducedMotion || totalSteps <= 1) {
      setAnimStepIndex(Math.max(0, totalSteps - 1));
      setExplorerRotationDeg((prev) =>
        nextShortestAngle(
          prev,
          result.path[Math.max(0, totalSteps - 1)]?.facing ??
            variant.startPos.facing,
        ),
      );
      setIsAnimating(false);
      commitSimulationOutcome(result);
      return;
    }

    setAnimStepIndex(0);
    setExplorerRotationDeg(HEADING_ROTATION[variant.startPos.facing]);
    setIsAnimating(true);

    let runningAngle = HEADING_ROTATION[variant.startPos.facing];
    for (let stepIdx = 1; stepIdx < totalSteps; stepIdx += 1) {
      const targetFacing = result.path[stepIdx].facing;
      runningAngle = nextShortestAngle(runningAngle, targetFacing);
      const angleForStep = runningAngle;
      const timerId = window.setTimeout(() => {
        setAnimStepIndex(stepIdx);
        setExplorerRotationDeg(angleForStep);
        if (stepIdx < totalSteps - 1) {
          onPlaySfx('click');
        } else {
          setIsAnimating(false);
          commitSimulationOutcome(result);
        }
      }, stepIdx * STEP_INTERVAL_MS);
      timeoutsRef.current.push(timerId);
    }
  };

  const fullPath = simResult?.path ?? [
    {
      x: variant.startPos.x,
      y: variant.startPos.y,
      facing: variant.startPos.facing,
      actionText: 'Start',
    },
  ];
  const visiblePath = fullPath.slice(
    0,
    Math.min(fullPath.length, animStepIndex + 1),
  );
  const currentStep =
    visiblePath[visiblePath.length - 1] ?? fullPath[0];

  const activeExplorerPos = {
    x: clampBoardCoord(currentStep.x, ARCHITECT_BOARD_COLS),
    y: clampBoardCoord(currentStep.y, ARCHITECT_BOARD_ROWS),
  };
  const activeFacing = currentStep.facing;
  const animationCompleted =
    simResult !== null && !isAnimating && animStepIndex >= fullPath.length - 1;
  const routePassed = Boolean(
    animationCompleted && simResult?.validGrammar && simResult?.validRoute,
  );
  const routeErrored = Boolean(
    animationCompleted &&
      simResult &&
      (!simResult.validGrammar || !simResult.validRoute),
  );
  const canRetry = routeErrored && !isSolved;

  const visitedCellKeys = new Set(
    visiblePath
      .filter(
        (step) =>
          step.x >= 0 &&
          step.x < ARCHITECT_BOARD_COLS &&
          step.y >= 0 &&
          step.y < ARCHITECT_BOARD_ROWS,
      )
      .map((step) => `${step.x},${step.y}`),
  );

  const polylinePoints = visiblePath
    .map((step) => {
      const clampedX = clampBoardCoord(step.x, ARCHITECT_BOARD_COLS);
      const clampedY = clampBoardCoord(step.y, ARCHITECT_BOARD_ROWS);
      // Slight inward/edge nudge when stepping out of bounds so boundary bump is visible
      const px =
        step.x < 0
          ? 14
          : step.x >= ARCHITECT_BOARD_COLS
            ? ARCHITECT_BOARD_COLS * 100 - 14
            : clampedX * 100 + 50;
      const py =
        step.y < 0
          ? 14
          : step.y >= ARCHITECT_BOARD_ROWS
            ? ARCHITECT_BOARD_ROWS * 100 - 14
            : clampedY * 100 + 50;
      return `${px},${py}`;
    })
    .join(' ');

  const targetLandmark = ARCHITECT_BOARD_LANDMARKS.find(
    (l) => l.id === variant.targetLandmarkId,
  );
  const startLandmark = ARCHITECT_BOARD_LANDMARKS.find(
    (l) => l.x === variant.startPos.x && l.y === variant.startPos.y,
  );

  return (
    <div className="space-y-3">
      {/* Collapsible First-Time Interactive Tutorial */}
      {showTutorial && (
        <div
          role="region"
          aria-label={
            language === 'th'
              ? 'คำแนะนำเริ่มต้นเกมสร้างเส้นทาง'
              : 'Pyramid Route Quick Tutorial'
          }
          className={`rounded-2xl border p-3 sm:p-3.5 ${
            isNight
              ? 'border-[#12B8B0]/45 bg-[#102A33] text-[#E2E8F0]'
              : 'border-[#0D9488]/30 bg-[#F0FDFA] text-[#131E31]'
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Sparkles
                className="h-4 w-4 text-[#0D9488] dark:text-[#5EEAD4] shrink-0"
                aria-hidden="true"
              />
              <h3 className="text-xs sm:text-sm font-extrabold">
                {language === 'th'
                  ? 'คู่มือเล่นเร็ว · สถาปนิกเส้นทางมหาพีระมิด'
                  : 'Quick Guide · How to Map Your Route'}
              </h3>
            </div>
            <button
              type="button"
              onClick={dismissTutorial}
              className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-extrabold cursor-pointer shrink-0 ${
                isNight
                  ? 'border-white/15 bg-white/10 text-white hover:bg-white/15'
                  : 'border-[#0D9488]/30 bg-white text-[#0F766E] hover:bg-[#CCFBF1]/40'
              }`}
            >
              <X className="h-3 w-3" aria-hidden="true" />
              <span>{language === 'th' ? 'เข้าใจแล้ว' : 'Got it'}</span>
            </button>
          </div>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 text-[11px] leading-snug">
            {TUTORIAL_STEPS.map((step, index) => (
              <li
                key={index}
                className={`flex items-start gap-1.5 rounded-xl border px-2.5 py-1.5 ${
                  isNight
                    ? 'border-white/10 bg-[#142F39]'
                    : 'border-[#99F6E4] bg-white/90'
                }`}
              >
                <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0D9488] text-[10px] font-extrabold text-white mt-0.5">
                  {index + 1}
                </span>
                <span className="font-semibold">{step[language]}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Main Responsive Split Workspace: 2D Giza Board (Left) + Instruction Builder (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left: 6x4 Interactive Adventure Board */}
        <div
          className={`lg:col-span-7 rounded-2xl border p-3 sm:p-4 space-y-3 ${
            isNight
              ? 'border-white/12 bg-[#162340]'
              : 'border-[#F59E0B]/35 bg-[#FFFBEB]'
          }`}
        >
          {/* Board Header + Compass Indicator + Tutorial Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Compass
                className="h-4 w-4 text-[#0D9488] dark:text-[#5EEAD4]"
                aria-hidden="true"
              />
              <span className="text-xs sm:text-sm font-extrabold">
                {language === 'th'
                  ? 'กระดานจำลองลานกีซา'
                  : 'Giza Plateau Adventure Board'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] font-extrabold ${
                  isNight
                    ? 'border-[#E7B43C]/35 bg-[#121D36] text-[#FDE68A]'
                    : 'border-[#D97706]/30 bg-white text-[#92400E]'
                }`}
              >
                <span>
                  {language === 'th' ? 'หันทิศ: ' : 'Facing: '}
                  {HEADING_LABEL[activeFacing][language]}
                </span>
              </span>

              <button
                type="button"
                onClick={() => {
                  onPlaySfx('click');
                  setShowTutorial((prev) => !prev);
                }}
                aria-expanded={showTutorial}
                className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] font-extrabold cursor-pointer ${
                  isNight
                    ? 'border-white/15 bg-white/8 text-[#CBD5E1] hover:text-white'
                    : 'border-[#CBD5E1] bg-white text-[#334155] hover:border-[#0D9488]'
                }`}
              >
                <HelpCircle className="h-3 w-3" aria-hidden="true" />
                <span>{language === 'th' ? 'วิธีเล่น' : 'Guide'}</span>
              </button>
            </div>
          </div>

          {/* Mission Goal Banner + Live Compass Rose */}
          <div
            className={`flex items-center gap-3 rounded-xl border p-2.5 sm:p-3 ${
              isNight
                ? 'border-white/10 bg-[#121D36] text-[#F8FAFC]'
                : 'border-[#FDE68A] bg-white text-[#1E293B]'
            }`}
          >
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-extrabold">
                <span className="text-[#0D9488] dark:text-[#5EEAD4]">
                  {language === 'th' ? 'เริ่มต้น: ' : 'Start: '}
                  {startLandmark
                    ? startLandmark.label[language]
                    : language === 'th'
                      ? 'จุดเริ่มต้นบนเส้นทาง'
                      : 'South Trail'}
                </span>
                {targetLandmark && (
                  <span className="text-[#059669] dark:text-[#34D399]">
                    {language === 'th' ? 'เป้าหมาย: ' : 'Goal: '}
                    {targetLandmark.label[language]}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-[13px] font-semibold leading-snug">
                {variant.missionGoal[language]}
              </p>
            </div>
            <DesertCompassRoseSVG
              activeFacing={activeFacing}
              isNight={isNight}
              language={language}
              className="h-14 w-14 sm:h-16 sm:w-16 shrink-0"
            />
          </div>

          {/* Outer Sandstone Frame for 6x4 Two-Dimensional Tile Map */}
          <div
            className={`rounded-2xl border-2 p-1.5 sm:p-2 shadow-inner ${
              isNight
                ? 'border-[#E7B43C]/35 bg-[#10182E]'
                : 'border-[#D97706]/45 bg-[#EBD09B]'
            }`}
          >
            <div
              data-testid="pyramid-route-board-frame"
              className={`relative mx-auto w-full max-w-[560px] aspect-[3/2] rounded-xl overflow-hidden border ${
                isNight
                  ? 'border-[#334155] bg-[#1A243F]'
                  : 'border-[#B45309]/40 bg-[#F4DCAA]'
              }`}
              style={{
                aspectRatio: `${ARCHITECT_BOARD_COLS} / ${ARCHITECT_BOARD_ROWS}`,
              }}
            >
              {/* Subtle Desert Dune Backdrop Texture */}
              <svg
                viewBox="0 0 600 400"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
                aria-hidden="true"
              >
                <path
                  d="M0 320 Q160 270 310 315 T600 285 L600 400 L0 400 Z"
                  fill={isNight ? '#243154' : '#E7C584'}
                />
                <path
                  d="M0 120 Q180 85 360 125 T600 100 L600 0 L0 0 Z"
                  fill={isNight ? '#202B4A' : '#FBE8BF'}
                />
              </svg>

              {/* 6 columns × 4 rows explicit CSS Grid */}
              <div
                data-testid="pyramid-route-grid"
                className="relative z-[2] grid grid-cols-6 grid-rows-4 h-full w-full"
                style={{
                  gridTemplateColumns: `repeat(${ARCHITECT_BOARD_COLS}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${ARCHITECT_BOARD_ROWS}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: ARCHITECT_BOARD_ROWS }).map((_, y) =>
                  Array.from({ length: ARCHITECT_BOARD_COLS }).map((__, x) => {
                    const landmark = ARCHITECT_BOARD_LANDMARKS.find(
                      (l) => l.x === x && l.y === y,
                    );
                    const isBlocked = variant.blockedCells.some(
                      (c) => c.x === x && c.y === y,
                    );
                    const isStart =
                      variant.startPos.x === x && variant.startPos.y === y;
                    const isTarget =
                      variant.targetPos.x === x && variant.targetPos.y === y;
                    const isWaypoint =
                      landmark !== undefined &&
                      variant.requiredWaypoints.includes(landmark.id) &&
                      !isTarget;
                    const isVisited = visitedCellKeys.has(`${x},${y}`);
                    const checkerboardLight = (x + y) % 2 === 0;

                    const cellTone = isBlocked
                      ? isNight
                        ? 'border-[#DC2626]/65 bg-[#451A24]/90 text-[#FECACA]'
                        : 'border-[#DC2626]/60 bg-[#FEE2E2]/90 text-[#991B1B]'
                      : isTarget
                        ? isNight
                          ? 'border-[#10B981]/80 bg-[#0B3B35]/90 text-[#A7F3D0]'
                          : 'border-[#059669]/80 bg-[#D1FAE5]/90 text-[#065F46]'
                        : isVisited && simResult !== null
                          ? isNight
                            ? 'border-[#14B8A6]/45 bg-[#123344]/85 text-[#E2E8F0]'
                            : 'border-[#0D9488]/45 bg-[#CCFBF1]/75 text-[#134E4A]'
                          : isNight
                            ? checkerboardLight
                              ? 'border-white/10 bg-[#1B2745]/85 text-[#E2E8F0]'
                              : 'border-white/10 bg-[#17213B]/85 text-[#E2E8F0]'
                            : checkerboardLight
                              ? 'border-[#B45309]/20 bg-[#FCF0D2]/85 text-[#334155]'
                              : 'border-[#B45309]/20 bg-[#F7E4BA]/85 text-[#334155]';

                    return (
                      <div
                        key={`${x}-${y}`}
                        data-testid={`board-cell-${x}-${y}`}
                        className={`relative flex flex-col items-center justify-center p-1 border text-center select-none transition-colors ${cellTone}`}
                      >
                        {/* Corner Badges: START / GOAL / Checkpoint */}
                        {isStart && (
                          <span className="absolute top-0.5 left-0.5 z-[3] rounded bg-[#0D9488] px-1 py-px text-[8px] sm:text-[9px] font-extrabold tracking-tight text-white shadow-xs">
                            START
                          </span>
                        )}

                        {isTarget && !isBlocked && (
                          <span className="absolute top-0.5 right-0.5 z-[3] inline-flex items-center gap-0.5 rounded bg-[#059669] px-1 py-px text-[8px] sm:text-[9px] font-extrabold text-white shadow-xs">
                            <Flag className="h-2.5 w-2.5" aria-hidden="true" />
                            <span>GOAL</span>
                          </span>
                        )}

                        {isWaypoint && (
                          <span
                            className="absolute top-0.5 right-0.5 z-[3] inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#F59E0B] text-white shadow-xs"
                            title={
                              language === 'th'
                                ? 'จุดเช็กพอยต์สำคัญ'
                                : 'Required checkpoint'
                            }
                          >
                            <Star
                              className="h-2.5 w-2.5 fill-white"
                              aria-hidden="true"
                            />
                          </span>
                        )}

                        {/* Tile Center Visuals */}
                        {isBlocked ? (
                          <>
                            <SandDuneBlockedSVG className="h-6 w-6 sm:h-8 sm:w-8" />
                            <span className="mt-0.5 text-[8px] sm:text-[9.5px] font-extrabold leading-tight">
                              {language === 'th' ? 'เนินทรายปิด' : 'Blocked'}
                            </span>
                          </>
                        ) : landmark ? (
                          <>
                            <ArchitectLandmarkSVG
                              iconKey={landmark.iconKey}
                              className="h-6 w-6 sm:h-8 sm:w-8 shrink-0"
                            />
                            <span className="mt-0.5 text-[8px] sm:text-[9.5px] font-extrabold leading-[1.1] line-clamp-2">
                              {landmark.label[language]}
                            </span>
                          </>
                        ) : isTarget ? (
                          <>
                            <MapPin
                              className="h-5 w-5 sm:h-6 sm:w-6 text-[#059669] dark:text-[#34D399]"
                              aria-hidden="true"
                            />
                            <span className="mt-0.5 text-[8px] sm:text-[9.5px] font-extrabold leading-tight">
                              {language === 'th'
                                ? 'จุดหยุดเหนือ'
                                : 'North Stop'}
                            </span>
                          </>
                        ) : (
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isNight ? 'bg-white/15' : 'bg-[#B45309]/25'
                            }`}
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    );
                  }),
                )}
              </div>

              {/* Animated SVG Route Path Overlay */}
              {visiblePath.length > 1 && (
                <svg
                  viewBox={`0 0 ${ARCHITECT_BOARD_COLS * 100} ${ARCHITECT_BOARD_ROWS * 100}`}
                  className="pointer-events-none absolute inset-0 z-[5] h-full w-full"
                  aria-hidden="true"
                >
                  <polyline
                    points={polylinePoints}
                    fill="none"
                    stroke={
                      routeErrored ||
                      (animationCompleted &&
                        (simResult?.hitBlocked || simResult?.outOfBounds))
                        ? '#DC2626'
                        : '#0D9488'
                    }
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="14 8"
                    opacity="0.9"
                  />
                  {visiblePath.map((step, idx) => {
                    const cx = clampBoardCoord(step.x, ARCHITECT_BOARD_COLS) * 100 + 50;
                    const cy = clampBoardCoord(step.y, ARCHITECT_BOARD_ROWS) * 100 + 50;
                    return (
                      <circle
                        key={`${idx}-${step.x}-${step.y}`}
                        cx={cx}
                        cy={cy}
                        r={idx === 0 ? 7 : 5}
                        fill={
                          routeErrored && idx === visiblePath.length - 1
                            ? '#DC2626'
                            : '#0F766E'
                        }
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                      />
                    );
                  })}
                </svg>
              )}

              {/* Smoothly Animated Explorer Token */}
              <div
                data-testid="pyramid-explorer-token"
                aria-label={`Explorer at row ${activeExplorerPos.y + 1}, column ${activeExplorerPos.x + 1}, facing ${HEADING_LABEL[activeFacing].en}`}
                className="pointer-events-none absolute top-0 left-0 z-[8] flex items-center justify-center"
                style={{
                  width: `${100 / ARCHITECT_BOARD_COLS}%`,
                  height: `${100 / ARCHITECT_BOARD_ROWS}%`,
                  transform: `translate3d(${activeExplorerPos.x * 100}%, ${activeExplorerPos.y * 100}%, 0)`,
                  transition:
                    'transform 240ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <div className="relative flex items-center justify-center">
                  {routePassed && (
                    <span
                      className="absolute h-10 w-10 sm:h-11 sm:w-11 rounded-full border-2 border-[#10B981] bg-[#10B981]/20"
                      aria-hidden="true"
                    />
                  )}
                  <PyramidExplorerTokenSVG
                    facingRotationDeg={explorerRotationDeg}
                    hasError={routeErrored}
                    isSuccess={routePassed}
                    className="h-8 w-8 sm:h-10 sm:w-10 drop-shadow-md"
                  />
                </div>
              </div>

              {/* Obstacle / Boundary Alert Overlay Banner */}
              {animationCompleted &&
                (simResult?.hitBlocked || simResult?.outOfBounds) && (
                  <div className="pointer-events-none absolute bottom-2 left-1/2 z-[12] -translate-x-1/2 rounded-xl border border-[#FCA5A5] bg-[#991B1B] px-3 py-1 text-[11px] font-extrabold text-white shadow-md whitespace-nowrap inline-flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>
                      {simResult.outOfBounds
                        ? language === 'th'
                          ? 'เดินออกนอกขอบแผนที่!'
                          : 'Stepped outside map boundary!'
                        : language === 'th'
                          ? 'ชนเขตเนินทรายที่ปิดกั้น!'
                          : 'Hit blocked sand dune!'}
                    </span>
                  </div>
                )}
            </div>
          </div>

          {/* Compact Board Legend + Live Step Caption */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#0D9488]" />
                <span>START</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#059669]" />
                <span>GOAL</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <Star className="h-3 w-3 text-[#D97706] fill-[#F59E0B]" aria-hidden="true" />
                <span>{language === 'th' ? 'จุดผ่านสำคัญ' : 'Checkpoint'}</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-[#DC2626]" aria-hidden="true" />
                <span>{language === 'th' ? 'เขตหวงห้าม' : 'Blocked'}</span>
              </span>
            </div>

            {simResult && (
              <span
                className={`font-mono-num ${
                  routeErrored
                    ? 'text-[#DC2626] dark:text-[#FCA5A5]'
                    : 'text-[#0D9488] dark:text-[#5EEAD4]'
                }`}
              >
                {language === 'th' ? 'ก้าวที่ ' : 'Step '}
                {Math.min(animStepIndex + 1, fullPath.length)}/{fullPath.length}
              </span>
            )}
          </div>
        </div>

        {/* Right: English Instruction Builder */}
        <div
          className={`lg:col-span-5 rounded-2xl border p-3.5 sm:p-4 space-y-3.5 ${
            isNight
              ? 'border-white/12 bg-[#1B2542]'
              : 'border-[#E2E8F0] bg-white'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#0D9488] dark:text-[#5EEAD4]">
              {language === 'th'
                ? 'สร้างประโยคนำทางภาษาอังกฤษ'
                : 'Build Your Route Instruction'}
            </p>
            {isAnimating && (
              <span className="text-[11px] font-extrabold text-[#D97706] dark:text-[#FDE68A]">
                {language === 'th' ? 'กำลังเดินจำลอง...' : 'Simulating route...'}
              </span>
            )}
          </div>

          {/* Constructed Instruction Tray */}
          <div
            className={`min-h-[96px] rounded-2xl border-2 border-dashed p-3 flex flex-col justify-between gap-2 ${
              isSolved
                ? isNight
                  ? 'border-[#10B981]/60 bg-[#0F2A2A]'
                  : 'border-[#059669]/50 bg-[#ECFDF5]'
                : isNight
                  ? 'border-[#E7B43C]/40 bg-[#121D36]'
                  : 'border-[#D97706]/35 bg-[#FFFBEB]/65'
            }`}
          >
            {selectedTiles.length === 0 ? (
              <p
                className={`text-xs font-medium italic my-auto text-center ${
                  isNight ? 'text-[#94A3B8]' : 'text-[#64748B]'
                }`}
              >
                {language === 'th'
                  ? 'แตะคำบอกทิศทาง จุดสังเกต และจุดหยุดด้านล่าง แล้วกดทดสอบเส้นทาง'
                  : 'Tap direction, landmark, and stop phrases below, then press Test Route.'}
              </p>
            ) : (
              <>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTiles.map((tile) => (
                    <button
                      key={tile.instanceId}
                      type="button"
                      disabled={isSolved || isAnimating}
                      onClick={() => handleRemoveSelected(tile.instanceId)}
                      aria-label={`Remove ${tile.value}`}
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition-colors ${
                        isNight
                          ? 'border-[#12B8B0]/60 bg-[#102A33] text-[#F8FAFC]'
                          : 'border-[#0D9488]/45 bg-white text-[#131E31]'
                      } ${
                        isSolved || isAnimating
                          ? 'cursor-default'
                          : 'cursor-pointer hover:border-[#DC2626]'
                      }`}
                    >
                      <span>{tile.value}</span>
                      {!isSolved && !isAnimating && (
                        <Trash2
                          className="h-3 w-3 opacity-65 text-[#DC2626] dark:text-[#FCA5A5]"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  ))}
                </div>
                <p
                  className={`text-xs font-semibold pt-1.5 border-t ${
                    isNight
                      ? 'border-white/10 text-[#FDE68A]'
                      : 'border-[#D97706]/20 text-[#78350F]'
                  }`}
                >
                  “{assembledSentence}”
                </p>
              </>
            )}
          </div>

          {/* Shuffled Word / Phrase Bank */}
          <div className="space-y-1.5">
            <p
              className={`text-[11px] font-bold ${
                isNight ? 'text-[#94A3B8]' : 'text-[#64748B]'
              }`}
            >
              {language === 'th' ? 'คลังคำสั่งนำทาง:' : 'Direction & Landmark Tiles:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {shuffledTiles.map((tile) => {
                const used = selectedIds.includes(tile.instanceId);
                return (
                  <button
                    key={tile.instanceId}
                    type="button"
                    disabled={used || isSolved || isAnimating}
                    onClick={() => handleSelectTile(tile.instanceId)}
                    className={`min-h-[40px] rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
                      used
                        ? 'opacity-35 cursor-not-allowed border-dashed'
                        : isNight
                          ? 'border-white/15 bg-[#162340] text-[#F8FAFC] hover:border-[#E7B43C] cursor-pointer'
                          : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#1E293B] hover:border-[#0D9488] hover:bg-[#F0FDFA] cursor-pointer'
                    }`}
                  >
                    {tile.value}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Builder Controls: Undo, Reset, Retry (after error), and Test Route */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleUndo}
              disabled={selectedIds.length === 0 || isSolved || isAnimating}
              className={`inline-flex min-h-[40px] items-center gap-1 rounded-xl border px-3 py-2 text-xs font-bold disabled:opacity-40 cursor-pointer ${
                isNight
                  ? 'border-white/15 bg-white/8 text-[#E2E8F0]'
                  : 'border-[#CBD5E1] bg-white text-[#334155]'
              }`}
            >
              <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{copy.egyptDiscoverUndoButton}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isSolved}
              className={`inline-flex min-h-[40px] items-center gap-1 rounded-xl border px-3 py-2 text-xs font-bold disabled:opacity-40 cursor-pointer ${
                isNight
                  ? 'border-white/15 bg-white/8 text-[#E2E8F0]'
                  : 'border-[#CBD5E1] bg-white text-[#334155]'
              }`}
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{copy.egyptDiscoverResetButton}</span>
            </button>

            {canRetry && (
              <button
                type="button"
                onClick={handleRetryRoute}
                className={`inline-flex min-h-[40px] items-center gap-1 rounded-xl border px-3 py-2 text-xs font-extrabold cursor-pointer ${
                  isNight
                    ? 'border-[#E7B43C]/45 bg-[#2A2013] text-[#FDE68A]'
                    : 'border-[#D97706]/40 bg-[#FFFBEB] text-[#92400E]'
                }`}
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{language === 'th' ? 'ลองปรับใหม่' : 'Retry'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleTestRoute}
              disabled={isSolved || isAnimating}
              className="ml-auto inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#0D9488] px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-[#0F766E] disabled:opacity-50 cursor-pointer"
            >
              {isSolved ? (
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span>
                {isAnimating
                  ? language === 'th'
                    ? 'กำลังจำลอง...'
                    : 'Running...'
                  : copy.egyptBuildTestRouteButton}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
