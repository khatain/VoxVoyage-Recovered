import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import type { AppLanguage, AvatarConfig, ResolvedAppearance } from '../../types/game';
import {
  SCOTLAND_BOUNDS,
  SCOTLAND_INTERACTIVE_TARGETS,
  SCOTLAND_SPAWN,
  type ScotlandPoiId,
} from '../../data/scotlandWorld';
import { findNearestScotlandPoi, resolveScotlandCollision } from '../../utils/scotlandCollision';
import type {
  ActiveAutoWalkRequest,
  ActiveQuickTravelRequest,
  NavPoint2D,
} from '../../utils/worldNavigation';
import { AvatarPortraitSVG } from '../avatar/AvatarPortraitSVG';

interface ScotlandFallback2DProps {
  avatar: AvatarConfig;
  language: AppLanguage;
  appearance: ResolvedAppearance;
  paused: boolean;
  visitedPoiIds: ScotlandPoiId[];
  nearestPoiId?: ScotlandPoiId | null;
  guidedPoiId?: ScotlandPoiId | null;
  noticeText: string;
  autoWalkRequest?: ActiveAutoWalkRequest | null;
  quickTravelRequest?: ActiveQuickTravelRequest | null;
  onPositionChange?: (pos: NavPoint2D) => void;
  onAutoWalkComplete?: (result: { targetId: string; status: 'arrived' | 'unreachable' }) => void;
  onManualInterrupt?: () => void;
  onNearestPoiChange: (poiId: ScotlandPoiId | null) => void;
  onActivatePoi: (poiId: ScotlandPoiId) => void;
}

function toPercentX(x: number): number {
  return ((x - SCOTLAND_BOUNDS.minX) / (SCOTLAND_BOUNDS.maxX - SCOTLAND_BOUNDS.minX)) * 100;
}

function toPercentY(z: number): number {
  return ((z - SCOTLAND_BOUNDS.minZ) / (SCOTLAND_BOUNDS.maxZ - SCOTLAND_BOUNDS.minZ)) * 100;
}

export function ScotlandFallback2D({
  avatar,
  language,
  appearance,
  paused,
  visitedPoiIds,
  nearestPoiId = null,
  guidedPoiId = null,
  noticeText,
  autoWalkRequest = null,
  quickTravelRequest = null,
  onPositionChange,
  onAutoWalkComplete,
  onManualInterrupt,
  onNearestPoiChange,
  onActivatePoi,
}: ScotlandFallback2DProps) {
  const isNight = appearance === 'night';
  const [pos, setPos] = useState({ x: SCOTLAND_SPAWN.x, z: SCOTLAND_SPAWN.z });
  const posRef = useRef(pos);
  posRef.current = pos;

  const autoWalkRef = useRef(autoWalkRequest);
  autoWalkRef.current = autoWalkRequest;
  const quickTravelRef = useRef(quickTravelRequest);
  quickTravelRef.current = quickTravelRequest;
  const onPositionRef = useRef(onPositionChange);
  onPositionRef.current = onPositionChange;
  const onAutoWalkCompleteRef = useRef(onAutoWalkComplete);
  onAutoWalkCompleteRef.current = onAutoWalkComplete;
  const onManualInterruptRef = useRef(onManualInterrupt);
  onManualInterruptRef.current = onManualInterrupt;

  const heldDirsRef = useRef<{ up: boolean; down: boolean; left: boolean; right: boolean }>({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const clearHeldDirs = () => {
      heldDirsRef.current = { up: false, down: false, left: false, right: false };
    };
    if (paused) {
      clearHeldDirs();
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (paused) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'KeyW' || e.code === 'ArrowUp') heldDirsRef.current.up = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') heldDirsRef.current.down = true;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') heldDirsRef.current.left = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') heldDirsRef.current.right = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') heldDirsRef.current.up = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') heldDirsRef.current.down = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') heldDirsRef.current.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') heldDirsRef.current.right = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', clearHeldDirs);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clearHeldDirs);
    };
  }, [paused]);

  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();
    let lastPoi: ScotlandPoiId | null = null;
    let activeAutoWalkId = 0;
    let lastCompletedAutoWalkId = 0;
    let waypointIdx = 0;
    let lastQuickTravelId = 0;
    let stuckTimer = 0;
    let stuckAnchor = { ...posRef.current };

    onPositionRef.current?.(posRef.current);

    const step = (now: number) => {
      rafId = requestAnimationFrame(step);
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const qt = quickTravelRef.current;
      if (qt && qt.requestId !== lastQuickTravelId) {
        lastQuickTravelId = qt.requestId;
        if (autoWalkRef.current) lastCompletedAutoWalkId = autoWalkRef.current.requestId;
        activeAutoWalkId = 0;
        const safeQt = resolveScotlandCollision(qt.arrivalPoint.x, qt.arrivalPoint.z);
        posRef.current = safeQt;
        setPos(safeQt);
        onPositionRef.current?.(safeQt);
      }

      if (!paused) {
        const d = heldDirsRef.current;
        const dx = (d.right ? 1 : 0) - (d.left ? 1 : 0);
        const dz = (d.down ? 1 : 0) - (d.up ? 1 : 0);
        if (dx !== 0 || dz !== 0) {
          if (activeAutoWalkId !== 0) {
            lastCompletedAutoWalkId = activeAutoWalkId;
            activeAutoWalkId = 0;
            onManualInterruptRef.current?.();
          }
          const mag = Math.hypot(dx, dz);
          const next = resolveScotlandCollision(
            posRef.current.x + (dx / mag) * 4.6 * dt,
            posRef.current.z + (dz / mag) * 4.6 * dt,
          );
          setPos(next);
          posRef.current = next;
          onPositionRef.current?.(next);
        } else {
          const aw = autoWalkRef.current;
          if (!aw) {
            activeAutoWalkId = 0;
          } else if (aw.requestId !== lastCompletedAutoWalkId) {
            if (aw.requestId !== activeAutoWalkId) {
              activeAutoWalkId = aw.requestId;
              waypointIdx = 0;
              stuckTimer = 0;
              stuckAnchor = { ...posRef.current };
            }
            const wp = aw.waypoints[waypointIdx] ?? aw.arrivalPoint;
            const wx = wp.x - posRef.current.x;
            const wz = wp.z - posRef.current.z;
            const dist = Math.hypot(wx, wz);
            const stepDist = 4.6 * dt;
            if (dist <= Math.max(0.14, stepDist)) {
              const snapped = resolveScotlandCollision(wp.x, wp.z);
              posRef.current = snapped;
              setPos(snapped);
              onPositionRef.current?.(snapped);
              waypointIdx += 1;
              if (waypointIdx >= aw.waypoints.length) {
                lastCompletedAutoWalkId = aw.requestId;
                activeAutoWalkId = 0;
                onAutoWalkCompleteRef.current?.({ targetId: aw.targetId, status: 'arrived' });
              }
            } else {
              const next = resolveScotlandCollision(
                posRef.current.x + (wx / dist) * stepDist,
                posRef.current.z + (wz / dist) * stepDist,
              );
              posRef.current = next;
              setPos(next);
              onPositionRef.current?.(next);
              stuckTimer += dt;
              if (stuckTimer >= 0.5) {
                if (Math.hypot(next.x - stuckAnchor.x, next.z - stuckAnchor.z) < 0.05) {
                  lastCompletedAutoWalkId = aw.requestId;
                  activeAutoWalkId = 0;
                  onAutoWalkCompleteRef.current?.({ targetId: aw.targetId, status: 'unreachable' });
                } else {
                  stuckTimer = 0;
                  stuckAnchor = { ...next };
                }
              }
            }
          }
        }
      }

      const nearest = findNearestScotlandPoi(posRef.current.x, posRef.current.z);
      const nextId = nearest?.id ?? null;
      if (nextId !== lastPoi) {
        lastPoi = nextId;
        onNearestPoiChange(nextId);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [paused, onNearestPoiChange]);

  const setDir = (dir: 'up' | 'down' | 'left' | 'right', active: boolean) => {
    heldDirsRef.current[dir] = active;
  };

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-3 pt-20 pb-20 sm:px-6 ${
        isNight
          ? 'bg-gradient-to-b from-[#0C1430] via-[#18274B] to-[#23322D]'
          : 'bg-gradient-to-b from-[#559ED8] via-[#BBE3FA] to-[#689E60]'
      }`}
    >
      <div
        className={`mb-2.5 rounded-xl border px-3.5 py-1.5 text-center text-xs font-semibold shadow ${
          isNight
            ? 'border-white/20 bg-[#131E31]/88 text-[#F7F9FC]'
            : 'border-white bg-[#FFFDF8]/92 text-[#20304A]'
        }`}
      >
        {noticeText}
      </div>

      {/* Interactive Illustrated 2D Scottish Highlands Village Map matching 3D Layout */}
      <div
        className={`relative aspect-[12/10] w-full max-w-[700px] flex-1 min-h-0 max-h-[62dvh] overflow-hidden rounded-3xl border-4 shadow-2xl ${
          isNight ? 'border-[#8FC2FF]/35 bg-[#2A4234]' : 'border-[#F7F4EA] bg-[#558A4E]'
        }`}
      >
        {/* Northern Loch & Distant Munro Backdrop */}
        <div
          className={`absolute inset-x-0 top-0 h-[13%] border-b-2 ${
            isNight
              ? 'border-[#73A4CC]/40 bg-[#18486B]'
              : 'border-[#D9E7EF] bg-[#2D82AB]'
          }`}
        >
          <span className="absolute right-4 top-1 rounded bg-white/85 px-2 py-0.5 text-[9px] font-extrabold text-[#1E3350]">
            {language === 'en' ? 'Loch & Castle View' : 'ทะเลสาบและปราสาท'}
          </span>
        </div>

        {/* Cobblestone Paths & Highland Burn SVG */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {/* Cobblestone roads */}
          <path
            d="M 50 92 L 50 60 M 50 60 L 25 56 M 50 60 L 75 56 M 50 60 L 44 41 M 44 41 L 28 28 M 44 41 L 72 26"
            stroke="#9BA3AE"
            strokeWidth="4.4"
            strokeLinecap="round"
            fill="none"
            opacity="0.88"
          />
          <circle cx="50" cy="65" r="10.5" fill="#9BA3AE" opacity="0.82" />
          {/* Highland Burn Stream (x=4.5 -> 61%) */}
          <line
            x1="61"
            y1="10"
            x2="61"
            y2="41"
            stroke="#3B97C2"
            strokeWidth="3.2"
          />
          {/* Walkable Stone Arch Bridge */}
          <rect
            x="57.2"
            y="22.8"
            width="7.8"
            height="6.2"
            rx="1.2"
            fill="#CBD5E1"
            stroke="#475569"
            strokeWidth="0.9"
          />
        </svg>

        {/* West & East Village Stone Cottages */}
        <div
          style={{
            left: `${toPercentX(-6.8)}%`,
            top: `${toPercentY(7.8)}%`,
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute flex h-9 w-12 items-center justify-center rounded-lg border-2 border-[#475569] bg-[#CBD5E1] text-[9px] font-extrabold text-[#1E293B] shadow"
        >
          {language === 'en' ? 'Cottage' : 'บ้านหิน'}
        </div>
        <div
          style={{
            left: `${toPercentX(6.9)}%`,
            top: `${toPercentY(8.2)}%`,
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute flex h-9 w-12 items-center justify-center rounded-lg border-2 border-[#475569] bg-[#CBD5E1] text-[9px] font-extrabold text-[#1E293B] shadow"
        >
          {language === 'en' ? 'Cottage' : 'บ้านหิน'}
        </div>

        {/* Central Stone Fountain */}
        <div
          style={{
            left: `${toPercentX(0)}%`,
            top: `${toPercentY(6.4)}%`,
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#E2E8F0] bg-[#3B97C2] text-[8px] font-bold text-white shadow"
        >
          {language === 'en' ? 'Well' : 'น้ำพุ'}
        </div>

        {/* Interactive POIs: Eilidh, Fiona, and 5 Cultural Landmarks */}
        {SCOTLAND_INTERACTIVE_TARGETS.map((target) => {
          const visited = visitedPoiIds.includes(target.id);
          const isNearest = nearestPoiId === target.id;
          const isGuided = guidedPoiId === target.id;
          return (
            <button
              key={target.id}
              type="button"
              onClick={() => onActivatePoi(target.id)}
              style={{
                left: `${toPercentX(target.position.x)}%`,
                top: `${toPercentY(target.position.z)}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`group absolute z-10 flex flex-col items-center cursor-pointer transition-transform ${
                isGuided || isNearest ? 'scale-110' : ''
              }`}
            >
              <span
                style={{ borderColor: isGuided ? '#F2C66D' : visited ? '#2ED6A3' : target.accentColor }}
                className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 shadow-lg group-hover:scale-110 transition-transform ${
                  isNight ? 'bg-[#131E31]/92 text-white' : 'bg-[#FFFDF8]/96 text-[#20304A]'
                } ${isGuided ? 'ring-4 ring-[#F2C66D]' : isNearest ? 'ring-2 ring-[#F2C66D]' : ''}`}
              >
                {visited ? (
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-[#2ED6A3]" aria-hidden="true" />
                ) : target.kind === 'npc' ? (
                  <MessageCircle
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    style={{ color: target.accentColor }}
                    aria-hidden="true"
                  />
                ) : (
                  <MapPin
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    style={{ color: isGuided ? '#D98218' : target.accentColor }}
                    aria-hidden="true"
                  />
                )}
              </span>
              <span
                className={`mt-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold shadow whitespace-nowrap ${
                  isGuided
                    ? 'bg-[#F2C66D] text-[#131E31]'
                    : isNight
                      ? 'bg-[#131E31]/92 text-white'
                      : 'bg-[#FFFDF8]/96 text-[#20304A]'
                }`}
              >
                {target.title[language]}
              </span>
            </button>
          );
        })}

        {/* Player Avatar Marker */}
        <div
          style={{
            left: `${toPercentX(pos.x)}%`,
            top: `${toPercentY(pos.z)}%`,
            transform: 'translate(-50%, -50%)',
          }}
          className="pointer-events-none absolute z-20 flex flex-col items-center"
        >
          <div className="h-10 w-10 sm:h-11 sm:w-11 overflow-hidden rounded-full border-3 border-[#F2C66D] bg-[#131E31] shadow-xl">
            <AvatarPortraitSVG
              avatar={avatar}
              variant="bust"
              appearance={appearance}
              className="h-full w-full"
            />
          </div>
          <span className="mt-0.5 rounded bg-[#F2C66D] px-1.5 py-0.5 text-[9px] font-extrabold text-[#131E31]">
            {avatar.displayName}
          </span>
        </div>
      </div>

      {/* Accessible On-Screen D-Pad */}
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          aria-label="Walk Left"
          onPointerDown={() => setDir('left', true)}
          onPointerUp={() => setDir('left', false)}
          onPointerLeave={() => setDir('left', false)}
          onPointerCancel={() => setDir('left', false)}
          className={`flex h-10 w-10 items-center justify-center rounded-xl border active:bg-[#24B8B0] cursor-pointer ${
            isNight
              ? 'border-white/25 bg-[#131E31]/88 text-white'
              : 'border-[#20304A]/15 bg-[#FFFDF8]/92 text-[#20304A] shadow'
          }`}
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            aria-label="Walk Forward"
            onPointerDown={() => setDir('up', true)}
            onPointerUp={() => setDir('up', false)}
            onPointerLeave={() => setDir('up', false)}
            onPointerCancel={() => setDir('up', false)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border active:bg-[#24B8B0] cursor-pointer ${
              isNight
                ? 'border-white/25 bg-[#131E31]/88 text-white'
                : 'border-[#20304A]/15 bg-[#FFFDF8]/92 text-[#20304A] shadow'
            }`}
          >
            <ArrowUp className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Walk Backward"
            onPointerDown={() => setDir('down', true)}
            onPointerUp={() => setDir('down', false)}
            onPointerLeave={() => setDir('down', false)}
            onPointerCancel={() => setDir('down', false)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border active:bg-[#24B8B0] cursor-pointer ${
              isNight
                ? 'border-white/25 bg-[#131E31]/88 text-white'
                : 'border-[#20304A]/15 bg-[#FFFDF8]/92 text-[#20304A] shadow'
            }`}
          >
            <ArrowDown className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <button
          type="button"
          aria-label="Walk Right"
          onPointerDown={() => setDir('right', true)}
          onPointerUp={() => setDir('right', false)}
          onPointerLeave={() => setDir('right', false)}
          onPointerCancel={() => setDir('right', false)}
          className={`flex h-10 w-10 items-center justify-center rounded-xl border active:bg-[#24B8B0] cursor-pointer ${
            isNight
              ? 'border-white/25 bg-[#131E31]/88 text-white'
              : 'border-[#20304A]/15 bg-[#FFFDF8]/92 text-[#20304A] shadow'
          }`}
        >
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
