import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Lock,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import type { AppLanguage, AvatarConfig, ResolvedAppearance } from '../../types/game';
import {
  EGYPT_BOUNDS,
  EGYPT_INTERACTIVE_TARGETS,
  EGYPT_SPAWN,
  type EgyptPoiId,
} from '../../data/egyptWorld';
import { findNearestEgyptPoi, resolveEgyptCollision } from '../../utils/egyptCollision';
import type {
  ActiveAutoWalkRequest,
  ActiveQuickTravelRequest,
  NavPoint2D,
} from '../../utils/worldNavigation';
import { AvatarPortraitSVG } from '../avatar/AvatarPortraitSVG';

interface EgyptFallback2DProps {
  avatar: AvatarConfig;
  language: AppLanguage;
  appearance: ResolvedAppearance;
  paused: boolean;
  visitedPoiIds: EgyptPoiId[];
  nearestPoiId?: EgyptPoiId | null;
  guidedPoiId?: EgyptPoiId | null;
  noticeText: string;
  autoWalkRequest?: ActiveAutoWalkRequest | null;
  quickTravelRequest?: ActiveQuickTravelRequest | null;
  onPositionChange?: (pos: NavPoint2D) => void;
  onAutoWalkComplete?: (result: { targetId: string; status: 'arrived' | 'unreachable' }) => void;
  onManualInterrupt?: () => void;
  onNearestPoiChange: (poiId: EgyptPoiId | null) => void;
  onActivatePoi: (poiId: EgyptPoiId) => void;
}

function toPercentX(x: number): number {
  return ((x - EGYPT_BOUNDS.minX) / (EGYPT_BOUNDS.maxX - EGYPT_BOUNDS.minX)) * 100;
}

function toPercentY(z: number): number {
  return ((z - EGYPT_BOUNDS.minZ) / (EGYPT_BOUNDS.maxZ - EGYPT_BOUNDS.minZ)) * 100;
}

export function EgyptFallback2D({
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
}: EgyptFallback2DProps) {
  const isNight = appearance === 'night';
  const [pos, setPos] = useState({ x: EGYPT_SPAWN.x, z: EGYPT_SPAWN.z });
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
    let lastPoi: EgyptPoiId | null = null;
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
        const safeQt = resolveEgyptCollision(qt.arrivalPoint.x, qt.arrivalPoint.z);
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
          const next = resolveEgyptCollision(
            posRef.current.x + (dx / mag) * 4.7 * dt,
            posRef.current.z + (dz / mag) * 4.7 * dt,
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
            const stepDist = 4.7 * dt;
            if (dist <= Math.max(0.14, stepDist)) {
              const snapped = resolveEgyptCollision(wp.x, wp.z);
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
              const next = resolveEgyptCollision(
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

      const nearest = findNearestEgyptPoi(posRef.current.x, posRef.current.z);
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
          ? 'bg-gradient-to-b from-[#09132E] via-[#1C2A4D] to-[#2B2732]'
          : 'bg-gradient-to-b from-[#2378C8] via-[#EBD6B1] to-[#D9B684]'
      }`}
    >
      <div
        className={`mb-2.5 rounded-xl border px-3.5 py-1.5 text-center text-xs font-semibold shadow ${
          isNight
            ? 'border-white/20 bg-[#131E31]/90 text-[#F7F9FC]'
            : 'border-white bg-[#FFFDF8]/95 text-[#20304A]'
        }`}
      >
        {noticeText}
      </div>

      {/* Interactive Overhead 2D Egypt Giza Plateau & Nile Camp Map matching 3D Coordinates */}
      <div
        className={`relative aspect-[12/10] w-full max-w-[700px] flex-1 min-h-0 max-h-[62dvh] overflow-hidden rounded-3xl border-4 shadow-2xl ${
          isNight ? 'border-[#E7B43C]/45 bg-[#362E29]' : 'border-[#FFFDF8] bg-[#E8CE9F]'
        }`}
      >
        {/* Sealed Chamber of Wisdom Monumental Facade Strip (North) */}
        <div
          className={`absolute left-[37%] right-[37%] top-0 h-[16%] flex items-center justify-center rounded-b-xl border-x-2 border-b-2 ${
            isNight
              ? 'border-[#E7B43C]/60 bg-[#2C241E] text-[#FDE68A]'
              : 'border-[#B45309]/50 bg-[#B88B58] text-[#FFFBEB]'
          }`}
        >
          <span className="inline-flex items-center gap-1 px-2 text-[9px] font-extrabold tracking-tight">
            <Lock className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span>
              {language === 'en' ? 'Sealed Chamber · Phase 5B+' : 'ประตูศิลาปิดผนึก · เฟส 5B+'}
            </span>
          </span>
        </div>

        {/* Nile River Waterfront & Pier Strip (South) */}
        <div
          className={`absolute inset-x-0 bottom-0 h-[11%] border-t-2 ${
            isNight
              ? 'border-[#12B8B0]/40 bg-[#0B3B5A]'
              : 'border-[#CBD5E1] bg-[#1294AE]'
          }`}
        >
          <span className="absolute left-4 bottom-1.5 rounded bg-white/90 px-2 py-0.5 text-[9px] font-extrabold text-[#0F172A]">
            {language === 'en'
              ? 'Nile River Waterfront & Felucca Pier'
              : 'ริมฝั่งแม่น้ำไนล์และท่าเรือเฟลุกกา'}
          </span>
        </div>

        {/* Sandstone Crossroads & Plaza Paths SVG */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <path
            d="M 50 86 L 50 18 M 20 56 L 80 56"
            stroke={isNight ? '#6E5A46' : '#DFC394'}
            strokeWidth="5.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
          <circle
            cx="50"
            cy="50"
            r="10"
            fill="none"
            stroke="#E7B43C"
            strokeWidth="1.2"
            opacity="0.6"
          />
        </svg>

        {/* Interactive Targets (4 NPCs & 5 Expedition Zones) */}
        {EGYPT_INTERACTIVE_TARGETS.map((poi) => {
          const left = toPercentX(poi.position.x);
          const top = toPercentY(poi.position.z);
          const visited = visitedPoiIds.includes(poi.id);
          const isNearest = nearestPoiId === poi.id;
          const isGuided = guidedPoiId === poi.id;
          const isChamber = poi.id === 'chamber_of_wisdom';

          return (
            <button
              key={poi.id}
              type="button"
              onClick={() => onActivatePoi(poi.id)}
              style={{ left: `${left}%`, top: `${top}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 rounded-xl border px-2 py-1 text-[10px] font-bold shadow-md transition-transform cursor-pointer ${
                isGuided
                  ? 'z-20 scale-110 border-[#F59E0B] bg-[#FEF3C7] text-[#78350F] ring-4 ring-[#F59E0B]/40'
                  : isNearest
                    ? 'z-10 scale-105 border-[#12B8B0] bg-[#CCFBF1] text-[#0F766E]'
                    : visited
                      ? 'border-[#10B981]/60 bg-[#ECFDF5]/95 text-[#065F46]'
                      : isNight
                        ? 'border-white/25 bg-[#131E31]/92 text-[#F7F9FC]'
                        : 'border-[#20304A]/18 bg-[#FFFDF8]/95 text-[#20304A]'
              }`}
            >
              <span className="flex items-center gap-1 whitespace-nowrap">
                {visited ? (
                  <CheckCircle2 className="h-3 w-3 text-[#10B981]" aria-hidden="true" />
                ) : isChamber ? (
                  <Lock className="h-3 w-3 text-[#D97706]" aria-hidden="true" />
                ) : poi.kind === 'npc' ? (
                  <MessageCircle className="h-3 w-3 text-[#12B8B0]" aria-hidden="true" />
                ) : (
                  <MapPin className="h-3 w-3" style={{ color: poi.accentColor }} aria-hidden="true" />
                )}
                <span className="max-w-[105px] truncate">{poi.title[language]}</span>
              </span>
            </button>
          );
        })}

        {/* Player Avatar Marker */}
        <div
          style={{ left: `${toPercentX(pos.x)}%`, top: `${toPercentY(pos.z)}%` }}
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-white shadow-lg ring-2 ring-[#E7B43C]">
            <AvatarPortraitSVG
              avatar={avatar}
              variant="bust"
              appearance={appearance}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>

      {/* Accessible On-Screen D-Pad */}
      <div className="mt-3 grid grid-cols-3 gap-1.5 sm:hidden">
        <div />
        <button
          type="button"
          aria-label="Move North"
          onPointerDown={() => setDir('up', true)}
          onPointerUp={() => setDir('up', false)}
          onPointerLeave={() => setDir('up', false)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/85 text-[#131E31] shadow active:scale-95"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
        <div />
        <button
          type="button"
          aria-label="Move West"
          onPointerDown={() => setDir('left', true)}
          onPointerUp={() => setDir('left', false)}
          onPointerLeave={() => setDir('left', false)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/85 text-[#131E31] shadow active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Move South"
          onPointerDown={() => setDir('down', true)}
          onPointerUp={() => setDir('down', false)}
          onPointerLeave={() => setDir('down', false)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/85 text-[#131E31] shadow active:scale-95"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Move East"
          onPointerDown={() => setDir('right', true)}
          onPointerUp={() => setDir('right', false)}
          onPointerLeave={() => setDir('right', false)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/85 text-[#131E31] shadow active:scale-95"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
