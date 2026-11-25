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
  JAIPUR_BOUNDS,
  JAIPUR_INTERACTIVE_TARGETS,
  JAIPUR_SPAWN,
  type JaipurPoiId,
} from '../../data/jaipurWorld';
import {
  findNearestInteractivePoi,
  resolveJaipurCollision,
} from '../../utils/jaipurCollision';
import type {
  ActiveAutoWalkRequest,
  ActiveQuickTravelRequest,
  NavPoint2D,
} from '../../utils/worldNavigation';
import { AvatarPortraitSVG } from '../avatar/AvatarPortraitSVG';

interface JaipurFallback2DProps {
  avatar: AvatarConfig;
  language: AppLanguage;
  appearance: ResolvedAppearance;
  paused: boolean;
  exploredPoiIds: JaipurPoiId[];
  nearestPoiId?: JaipurPoiId | null;
  guidedPoiId?: JaipurPoiId | null;
  noticeText: string;
  autoWalkRequest?: ActiveAutoWalkRequest | null;
  quickTravelRequest?: ActiveQuickTravelRequest | null;
  onPositionChange?: (pos: NavPoint2D) => void;
  onAutoWalkComplete?: (result: { targetId: string; status: 'arrived' | 'unreachable' }) => void;
  onManualInterrupt?: () => void;
  onNearestPoiChange: (poiId: JaipurPoiId | null) => void;
  onActivatePoi: (poiId: JaipurPoiId) => void;
}

function toPercentX(x: number): number {
  return ((x - JAIPUR_BOUNDS.minX) / (JAIPUR_BOUNDS.maxX - JAIPUR_BOUNDS.minX)) * 100;
}

function toPercentY(z: number): number {
  return ((z - JAIPUR_BOUNDS.minZ) / (JAIPUR_BOUNDS.maxZ - JAIPUR_BOUNDS.minZ)) * 100;
}

export function JaipurFallback2D({
  avatar,
  language,
  appearance,
  paused,
  exploredPoiIds,
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
}: JaipurFallback2DProps) {
  const isNight = appearance === 'night';
  const [pos, setPos] = useState({ x: JAIPUR_SPAWN.x, z: JAIPUR_SPAWN.z });
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
    let lastPoi: JaipurPoiId | null = null;
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
        const safeQt = resolveJaipurCollision(qt.arrivalPoint.x, qt.arrivalPoint.z);
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
          const next = resolveJaipurCollision(
            posRef.current.x + (dx / mag) * 4.4 * dt,
            posRef.current.z + (dz / mag) * 4.4 * dt,
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
            const stepDist = 4.4 * dt;
            if (dist <= Math.max(0.14, stepDist)) {
              const snapped = resolveJaipurCollision(wp.x, wp.z);
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
              const next = resolveJaipurCollision(
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

      const nearest = findNearestInteractivePoi(posRef.current.x, posRef.current.z);
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
          ? 'bg-gradient-to-b from-[#0E1633] via-[#1B224B] to-[#231B3E]'
          : 'bg-gradient-to-b from-[#6CC5EE] via-[#BCE6FA] to-[#F3D3B7]'
      }`}
    >
      {/* Accessible 2D Mode Notice */}
      <div
        className={`mb-2.5 rounded-xl border px-3.5 py-1.5 text-center text-xs font-semibold shadow ${
          isNight
            ? 'border-white/20 bg-[#131E31]/88 text-[#F7F9FC]'
            : 'border-white bg-[#FFFDF8]/92 text-[#20304A]'
        }`}
      >
        {noticeText}
      </div>

      {/* Illustrated Interactive 2D Jaipur Courtyard matching 3D Layout */}
      <div
        className={`relative aspect-[12/10] w-full max-w-[680px] flex-1 min-h-0 max-h-[62dvh] overflow-hidden rounded-3xl border-4 shadow-2xl ${
          isNight ? 'border-[#8FC2FF]/35 bg-[#3B2639]' : 'border-[#FAF0DE] bg-[#E8BE9E]'
        }`}
      >
        {/* North Palace Facade + East Palace Wing */}
        <div
          className={`absolute left-0 right-0 top-0 h-[14%] border-b-4 flex items-center justify-between px-4 sm:px-8 ${
            isNight ? 'border-[#FAF0DE]/40 bg-[#6A3542]' : 'border-[#FAF0DE] bg-[#D36D5A]'
          }`}
        >
          <span className="font-display text-[11px] sm:text-xs font-bold tracking-wide text-[#FAF0DE]/85">
            {language === 'en' ? 'Pink City Courtyard' : 'ลานนครสีชมพู'}
          </span>
          <span className="font-display text-xs sm:text-sm font-extrabold tracking-wide text-[#FAF0DE]">
            {language === 'en' ? 'Pink Archway' : 'ซุ้มประตูโค้ง'}
          </span>
          <span className="font-display text-[11px] sm:text-xs font-bold tracking-wide text-[#FAF0DE]">
            {language === 'en' ? 'East Palace' : 'พระราชวัง'}
          </span>
        </div>

        {/* West Jaipur Market Stalls */}
        <div className="absolute left-[3%] top-[24%] bottom-[24%] w-[18%] flex flex-col justify-between">
          {[
            { color: '#D95338', en: 'Market Stall', th: 'แผงตลาด' },
            { color: '#D94A64', en: 'Fabric Stall', th: 'ผ้าหลากสี' },
            { color: '#D47B2C', en: 'Pottery', th: 'เครื่องปั้น' },
          ].map((stall, idx) => (
            <div
              key={idx}
              style={{ backgroundColor: stall.color }}
              className="h-[28%] rounded-xl border-2 border-[#FAF0DE]/85 shadow-md flex items-center justify-center px-1 text-[10px] font-bold text-white text-center"
            >
              {stall[language]}
            </div>
          ))}
        </div>

        {/* East Chhatri Pavilion */}
        <div
          className={`absolute right-[3%] top-[34%] h-[24%] w-[17%] rounded-2xl border-2 flex items-center justify-center p-2 text-center text-[11px] font-bold ${
            isNight
              ? 'border-[#F2C66D]/50 bg-[#5C343F] text-[#FAF0DE]'
              : 'border-[#FAF0DE] bg-[#E38A78] text-[#FAF0DE]'
          }`}
        >
          {language === 'en' ? 'Chhatri Pavilion' : 'ศาลาจาตรี'}
        </div>

        {/* Central Lotus Fountain */}
        <div
          style={{
            left: `${toPercentX(0)}%`,
            top: `${toPercentY(-0.6)}%`,
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute flex h-16 w-16 sm:h-22 sm:w-22 items-center justify-center rounded-full border-4 border-[#FAF0DE] bg-[#24B8B0] shadow-inner"
        >
          <div className="h-7 w-7 rounded-full border-2 border-[#F2C66D] bg-[#FAF0DE]/35" />
        </div>

        {/* Aarav Sharma + All 5 Word Detective Interactive Targets */}
        {JAIPUR_INTERACTIVE_TARGETS.map((target) => {
          const explored = exploredPoiIds.includes(target.id);
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
                style={{ borderColor: isGuided ? '#FBBF24' : explored ? '#2ED6A3' : target.accentColor }}
                className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 shadow-lg group-hover:scale-110 transition-transform ${
                  isNight ? 'bg-[#131E31]/92 text-white' : 'bg-[#FFFDF8]/96 text-[#20304A]'
                } ${isGuided ? 'ring-4 ring-[#F59E0B]/45' : isNearest ? 'ring-2 ring-[#F2C66D]' : ''}`}
              >
                {explored ? (
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-[#2ED6A3]" aria-hidden="true" />
                ) : target.kind === 'npc' ? (
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#24B8B0]" aria-hidden="true" />
                ) : (
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: target.accentColor }} aria-hidden="true" />
                )}
              </span>
              <span
                className={`mt-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold shadow whitespace-nowrap ${
                  isNight
                    ? 'bg-[#131E31]/92 text-white'
                    : 'bg-[#FFFDF8]/96 text-[#20304A]'
                }`}
              >
                {target.title[language]}
              </span>
            </button>
          );
        })}

        {/* Player Explorer Avatar Token */}
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

      {/* Accessible On-Screen D-Pad for 2D mode */}
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
