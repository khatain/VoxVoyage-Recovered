import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowUp,
  CheckCircle2,
  Compass,
  Flag,
  RotateCcw,
  RotateCw,
  Star,
  Undo2,
} from 'lucide-react';
import type { AppLanguage, LocalizedText } from '../../../types/game';
import { GAME_COPY } from '../../../data/i18n';
import {
  GIZA_BOARD_COLS,
  GIZA_BOARD_LANDMARKS,
  GIZA_BOARD_ROWS,
  rotateHeading,
  simulatePyramidRoute,
  stepForwardCoord,
  validatePyramidPathAttempt,
  type GizaBoardCoord,
  type GridHeading,
  type PyramidPathVariant,
  type RouteCommand,
} from '../../../data/egyptDiscover';

interface PyramidPathPuzzleGameProps {
  language: AppLanguage;
  isNight: boolean;
  variant: PyramidPathVariant;
  challengeKey: string;
  isSolved: boolean;
  onSolved: () => void;
  onFeedback: (state: { isCorrect: boolean; message: LocalizedText } | null) => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'reward') => void;
}

const HEADING_ROTATION: Record<GridHeading, number> = {
  N: 0,
  E: 90,
  S: 180,
  W: 270,
};

const HEADING_LABEL: Record<GridHeading, LocalizedText> = {
  N: { en: 'North (Up)', th: 'เหนือ (N)' },
  E: { en: 'East (Right)', th: 'ตะวันออก (E)' },
  S: { en: 'South (Down)', th: 'ใต้ (S)' },
  W: { en: 'West (Left)', th: 'ตะวันตก (W)' },
};

export function PyramidPathPuzzleGame({
  language,
  isNight,
  variant,
  challengeKey,
  isSolved,
  onSolved,
  onFeedback,
  onPlaySfx,
}: PyramidPathPuzzleGameProps) {
  const copy = GAME_COPY[language];
  const [commands, setCommands] = useState<RouteCommand[]>([]);

  useEffect(() => {
    setCommands([]);
  }, [challengeKey]);

  const simulation = useMemo(
    () => simulatePyramidRoute(variant.startCoord, variant.startHeading, commands),
    [variant.startCoord, variant.startHeading, commands],
  );

  const appendCommand = (cmd: RouteCommand) => {
    if (isSolved || simulation.hitHazard || simulation.hitBoundary) {
      if (cmd !== 'FORWARD') return;
      if (simulation.hitHazard || simulation.hitBoundary) return;
    }
    onPlaySfx('select');
    onFeedback(null);
    setCommands((prev) => [...prev, cmd]);
  };

  // Accessible shortcut: tapping an adjacent tile turns toward it and steps forward!
  const handleAdjacentTileClick = (col: number, row: number) => {
    if (isSolved || simulation.hitHazard || simulation.hitBoundary) return;
    const curr = simulation.finalCoord;
    const dx = col - curr.col;
    const dz = row - curr.row;
    if (Math.abs(dx) + Math.abs(dz) !== 1) return;

    let desiredHeading: GridHeading = 'N';
    if (dz === -1) desiredHeading = 'N';
    else if (dx === 1) desiredHeading = 'E';
    else if (dz === 1) desiredHeading = 'S';
    else if (dx === -1) desiredHeading = 'W';

    const added: RouteCommand[] = [];
    let h = simulation.finalHeading;
    if (h !== desiredHeading) {
      if (rotateHeading(h, 'LEFT') === desiredHeading) {
        added.push('LEFT');
      } else if (rotateHeading(h, 'RIGHT') === desiredHeading) {
        added.push('RIGHT');
      } else {
        added.push('RIGHT', 'RIGHT');
      }
      h = desiredHeading;
    }
    added.push('FORWARD');
    onPlaySfx('select');
    onFeedback(null);
    setCommands((prev) => [...prev, ...added]);
  };

  const handleUndo = () => {
    if (commands.length === 0 || isSolved) return;
    onPlaySfx('click');
    onFeedback(null);
    setCommands((prev) => prev.slice(0, -1));
  };

  const handleReset = () => {
    if (commands.length === 0 || isSolved) return;
    onPlaySfx('click');
    onFeedback(null);
    setCommands([]);
  };

  const handleCheck = () => {
    const result = validatePyramidPathAttempt(variant, commands);
    onFeedback({ isCorrect: result.isCorrect, message: result.reason });
    if (result.isCorrect) {
      onPlaySfx('reward');
      onSolved();
    } else {
      onPlaySfx('click');
    }
  };

  // Build SVG polyline points in normalized viewBox (cols * 100, rows * 100)
  const routePolylinePoints = simulation.visitedCoords
    .map((c) => `${c.col * 100 + 50},${c.row * 100 + 50}`)
    .join(' ');

  const canStepForward =
    !isSolved &&
    !simulation.hitHazard &&
    !simulation.hitBoundary &&
    (() => {
      const next = stepForwardCoord(simulation.finalCoord, simulation.finalHeading);
      return next.col >= -1 && next.col <= GIZA_BOARD_COLS && next.row >= -1 && next.row <= GIZA_BOARD_ROWS;
    })();

  const isSameCoord = (a: GizaBoardCoord, b: GizaBoardCoord) => a.col === b.col && a.row === b.row;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      {/* Left: Illustrated 5x4 Giza Learning Board */}
      <div
        className={`lg:col-span-7 rounded-2xl border p-3.5 ${
          isNight ? 'border-white/12 bg-[#162340]' : 'border-[#FDE68A] bg-[#FFFBEB]'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 text-xs font-extrabold">
            <Compass className="h-4 w-4 text-[#0D9488] dark:text-[#5EEAD4]" aria-hidden="true" />
            <span>
              {language === 'th' ? 'กระดานจำลองลานกีซา (5×4)' : 'Illustrated Giza Route Board (5×4)'}
            </span>
          </div>
          <span
            className={`text-[11px] font-bold ${
              isNight ? 'text-[#FDE68A]' : 'text-[#92400E]'
            }`}
          >
            {language === 'th' ? 'กำลังหันหน้า: ' : 'Facing: '}
            {HEADING_LABEL[simulation.finalHeading][language]}
          </span>
        </div>

        {/* Relative Board Wrapper */}
        <div className="relative mx-auto w-full max-w-[460px] aspect-[5/4] rounded-xl overflow-hidden border border-[#D97706]/35 bg-[#F6E2B8] dark:bg-[#24212D] shadow-inner">
          {/* Grid Tiles */}
          <div className="grid grid-cols-5 grid-rows-4 h-full w-full">
            {Array.from({ length: GIZA_BOARD_ROWS }).map((_, row) =>
              Array.from({ length: GIZA_BOARD_COLS }).map((__, col) => {
                const landmark = GIZA_BOARD_LANDMARKS.find(
                  (l) => l.coord.col === col && l.coord.row === row,
                );
                const isStart = isSameCoord(variant.startCoord, { col, row });
                const isGoal = isSameCoord(variant.targetCoord, { col, row });
                const isWaypoint =
                  variant.requiredWaypointCoord !== undefined &&
                  isSameCoord(variant.requiredWaypointCoord, { col, row });
                const isExplorerHere = isSameCoord(simulation.finalCoord, { col, row });
                const isAdjacent =
                  Math.abs(col - simulation.finalCoord.col) +
                    Math.abs(row - simulation.finalCoord.row) ===
                  1;

                return (
                  <button
                    key={`${col}-${row}`}
                    type="button"
                    onClick={() => handleAdjacentTileClick(col, row)}
                    disabled={!isAdjacent || isSolved || simulation.hitHazard || simulation.hitBoundary}
                    title={
                      landmark
                        ? `${landmark.label[language]} (${col + 1}, ${row + 1})`
                        : `(${col + 1}, ${row + 1})`
                    }
                    className={`relative flex flex-col items-center justify-center p-1 border text-center transition-colors ${
                      landmark?.isHazard
                        ? 'border-[#DC2626]/65 bg-[#FEE2E2]/85 dark:bg-[#4C1D24]/85 text-[#991B1B] dark:text-[#FECACA]'
                        : isGoal
                          ? 'border-[#059669] bg-[#D1FAE5]/85 dark:bg-[#064E3B]/75 text-[#065F46] dark:text-[#A7F3D0]'
                          : isNight
                            ? 'border-white/10 bg-[#1D2844]/85 text-[#E2E8F0]'
                            : 'border-[#D97706]/20 bg-[#FDF3DC]/80 text-[#334155]'
                    } ${
                      isAdjacent && !isSolved && !simulation.hitHazard && !simulation.hitBoundary
                        ? 'hover:ring-2 hover:ring-inset hover:ring-[#12B8B0] cursor-pointer'
                        : 'cursor-default'
                    }`}
                  >
                    {/* Landmark Badges */}
                    {landmark?.isHazard && (
                      <AlertTriangle className="h-4 w-4 text-[#DC2626] dark:text-[#FCA5A5] shrink-0" aria-hidden="true" />
                    )}
                    {isGoal && !landmark?.isHazard && (
                      <Flag className="h-3.5 w-3.5 text-[#059669] dark:text-[#34D399] shrink-0" aria-hidden="true" />
                    )}
                    {isWaypoint && !isGoal && (
                      <Star className="h-3.5 w-3.5 text-[#D97706] fill-[#FBBF24] shrink-0" aria-hidden="true" />
                    )}

                    {landmark && (
                      <span className="mt-0.5 text-[9px] sm:text-[10px] font-extrabold leading-tight line-clamp-2">
                        {landmark.label[language]}
                      </span>
                    )}

                    {isStart && (
                      <span className="absolute top-0.5 left-1 text-[8px] font-extrabold opacity-75">
                        START
                      </span>
                    )}

                    {/* Live Explorer Marker */}
                    {isExplorerHere && (
                      <div
                        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                        aria-label={`Explorer facing ${simulation.finalHeading}`}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#254EAC] text-white shadow-md">
                          <ArrowUp
                            className="h-4 w-4 transition-transform"
                            style={{ transform: `rotate(${HEADING_ROTATION[simulation.finalHeading]}deg)` }}
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    )}
                  </button>
                );
              }),
            )}
          </div>

          {/* Live SVG Route Trace */}
          {simulation.visitedCoords.length > 1 && (
            <svg
              viewBox={`0 0 ${GIZA_BOARD_COLS * 100} ${GIZA_BOARD_ROWS * 100}`}
              className="pointer-events-none absolute inset-0 z-10 h-full w-full"
              aria-hidden="true"
            >
              <polyline
                points={routePolylinePoints}
                fill="none"
                stroke={simulation.hitHazard ? '#DC2626' : '#0D9488'}
                strokeWidth="9"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="14 8"
                opacity="0.88"
              />
            </svg>
          )}
        </div>

        <p
          className={`mt-2 text-[11px] font-semibold ${
            isNight ? 'text-[#CBD5E1]' : 'text-[#64748B]'
          }`}
        >
          {language === 'th'
            ? 'เคล็ดลับ: กดปุ่มเดินด้านขวา หรือแตะช่องติดกับตัวละครบนกระดานได้เลย'
            : 'Tip: Use the direction buttons on the right, or tap an adjacent square on the board!'}
        </p>
      </div>

      {/* Right: Direction Command Queue */}
      <div
        className={`lg:col-span-5 rounded-2xl border p-3.5 ${
          isNight ? 'border-white/12 bg-[#1B2542]' : 'border-[#E2E8F0] bg-white'
        }`}
      >
        <p className="text-xs font-extrabold uppercase tracking-wide text-[#0D9488] dark:text-[#5EEAD4]">
          {language === 'th' ? 'แผงคำสั่งทิศทาง' : 'Direction Commands'}
        </p>

        <div className="mt-2.5 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => appendCommand('LEFT')}
            disabled={isSolved || simulation.hitHazard || simulation.hitBoundary}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl border py-2.5 px-2 text-xs font-extrabold cursor-pointer disabled:opacity-40 ${
              isNight
                ? 'border-white/15 bg-[#121D36] text-[#FDE68A] hover:bg-[#1E2E52]'
                : 'border-[#FDE68A] bg-[#FFFBEB] text-[#92400E] hover:bg-[#FEF3C7]'
            }`}
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>{language === 'th' ? 'เลี้ยวซ้าย' : 'Turn Left'}</span>
          </button>

          <button
            type="button"
            onClick={() => appendCommand('FORWARD')}
            disabled={!canStepForward}
            className="flex flex-col items-center justify-center gap-1 rounded-xl bg-[#12B8B0] py-2.5 px-2 text-xs font-extrabold text-[#131E31] hover:bg-[#14C9BF] cursor-pointer disabled:opacity-40"
          >
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
            <span>{language === 'th' ? 'เดินตรง 1 ก้าว' : 'Forward 1'}</span>
          </button>

          <button
            type="button"
            onClick={() => appendCommand('RIGHT')}
            disabled={isSolved || simulation.hitHazard || simulation.hitBoundary}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl border py-2.5 px-2 text-xs font-extrabold cursor-pointer disabled:opacity-40 ${
              isNight
                ? 'border-white/15 bg-[#121D36] text-[#FDE68A] hover:bg-[#1E2E52]'
                : 'border-[#FDE68A] bg-[#FFFBEB] text-[#92400E] hover:bg-[#FEF3C7]'
            }`}
          >
            <RotateCw className="h-4 w-4" aria-hidden="true" />
            <span>{language === 'th' ? 'เลี้ยวขวา' : 'Turn Right'}</span>
          </button>
        </div>

        {/* Recorded Command Sequence */}
        <div
          className={`mt-3 rounded-xl border p-2.5 min-h-[78px] ${
            isNight ? 'border-white/10 bg-[#121D36]' : 'border-[#E2E8F0] bg-[#F8FAFC]'
          }`}
        >
          <p className="text-[11px] font-bold opacity-75 mb-1.5">
            {language === 'th'
              ? `ชุดคำสั่ง (${commands.length} คำสั่ง)`
              : `Route Sequence (${commands.length} commands)`}
          </p>
          {commands.length === 0 ? (
            <p className="text-xs opacity-60">
              {language === 'th'
                ? 'ยังไม่มีคำสั่ง — กดเดินตรงหรือเลี้ยวเพื่อเริ่มต้น'
                : 'No commands yet — tap Forward or Turn to plot your route.'}
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {commands.map((cmd, idx) => (
                <span
                  key={`${cmd}-${idx}`}
                  className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-bold ${
                    cmd === 'FORWARD'
                      ? 'bg-[#12B8B0]/20 text-[#0F766E] dark:text-[#5EEAD4]'
                      : 'bg-[#E7B43C]/25 text-[#92400E] dark:text-[#FDE68A]'
                  }`}
                >
                  <span className="font-mono-num opacity-70">{idx + 1}.</span>
                  <span>
                    {cmd === 'FORWARD'
                      ? language === 'th'
                        ? 'ตรง'
                        : 'Fwd'
                      : cmd === 'LEFT'
                        ? language === 'th'
                          ? 'ซ้าย'
                          : 'Left'
                        : language === 'th'
                          ? 'ขวา'
                          : 'Right'}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={commands.length === 0 || isSolved}
            className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-bold disabled:opacity-40 cursor-pointer ${
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
            disabled={commands.length === 0 || isSolved}
            className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-bold disabled:opacity-40 cursor-pointer ${
              isNight
                ? 'border-white/15 bg-white/8 text-[#E2E8F0]'
                : 'border-[#CBD5E1] bg-white text-[#334155]'
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{copy.egyptDiscoverResetButton}</span>
          </button>

          <button
            type="button"
            onClick={handleCheck}
            disabled={isSolved}
            className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-[#0D9488] px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-[#0F766E] disabled:opacity-50 cursor-pointer"
          >
            {isSolved && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
            <span>{copy.egyptDiscoverCheckButton}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
