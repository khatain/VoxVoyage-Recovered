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
  KENYA_BOUNDS,
  KENYA_INTERACTIVE_TARGETS,
  KENYA_SPAWN,
  KENYA_TOURIST_VIEWPOINTS,
  type KenyaLandmarkId,
  type KenyaPoiId,
} from '../../data/kenyaWorld';
import {
  getActiveConversationForTourist,
  KENYA_TOURIST_NPCS,
} from '../../data/kenyaPractice';
import { findNearestKenyaPoi, resolveKenyaCollision } from '../../utils/kenyaCollision';
import type {
  ActiveAutoWalkRequest,
  ActiveQuickTravelRequest,
  NavPoint2D,
} from '../../utils/worldNavigation';
import { AvatarPortraitSVG } from '../avatar/AvatarPortraitSVG';

interface KenyaFallback2DProps {
  avatar: AvatarConfig;
  language: AppLanguage;
  appearance: ResolvedAppearance;
  paused: boolean;
  visitedPoiIds: KenyaPoiId[];
  practicedIds?: KenyaLandmarkId[];
  ambassadorStageActive?: boolean;
  nearestPoiId?: KenyaPoiId | null;
  guidedPoiId?: KenyaPoiId | null;
  noticeText: string;
  autoWalkRequest?: ActiveAutoWalkRequest | null;
  quickTravelRequest?: ActiveQuickTravelRequest | null;
  onPositionChange?: (pos: NavPoint2D) => void;
  onAutoWalkComplete?: (result: { targetId: string; status: 'arrived' | 'unreachable' }) => void;
  onManualInterrupt?: () => void;
  onNearestPoiChange: (poiId: KenyaPoiId | null) => void;
  onActivatePoi: (poiId: KenyaPoiId) => void;
}

function toPercentX(x: number): number {
  return ((x - KENYA_BOUNDS.minX) / (KENYA_BOUNDS.maxX - KENYA_BOUNDS.minX)) * 100;
}

function toPercentY(z: number): number {
  return ((z - KENYA_BOUNDS.minZ) / (KENYA_BOUNDS.maxZ - KENYA_BOUNDS.minZ)) * 100;
}

export function KenyaFallback2D({
  avatar,
  language,
  appearance,
  paused,
  visitedPoiIds,
  practicedIds = [],
  ambassadorStageActive = false,
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
}: KenyaFallback2DProps) {
  const isNight = appearance === 'night';
  const [pos, setPos] = useState({ x: KENYA_SPAWN.x, z: KENYA_SPAWN.z });
  const posRef = useRef(pos);
  posRef.current = pos;

  const practicedIdsRef = useRef(practicedIds);
  practicedIdsRef.current = practicedIds;
  const stageActiveRef = useRef(ambassadorStageActive);
  stageActiveRef.current = ambassadorStageActive;
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
    let lastPoi: KenyaPoiId | null = null;
    let activeAutoWalkId = 0;
    let lastCompletedAutoWalkId = 0;
    let waypointIdx = 0;
    let lastQuickTravelId = 0;
    let stuckTimer = 0;
    let stuckAnchor = { ...posRef.current };

    onPositionRef.current?.(posRef.current);

    const getDynamicCirclesNow = () => {
      const stageCeremonyNow = stageActiveRef.current && practicedIdsRef.current.length >= 5;
      const emmaActiveId = getActiveConversationForTourist('emma', practicedIdsRef.current).id;
      const emmaViewNow = stageCeremonyNow
        ? { x: 4.5, z: -10.4 }
        : KENYA_TOURIST_VIEWPOINTS[emmaActiveId];
      const danielActiveId = getActiveConversationForTourist('daniel', practicedIdsRef.current).id;
      const danielViewNow = stageCeremonyNow
        ? { x: 4.3, z: -11.6 }
        : KENYA_TOURIST_VIEWPOINTS[danielActiveId];
      return [
        { x: emmaViewNow.x, z: emmaViewNow.z, radius: 0.48 },
        { x: danielViewNow.x, z: danielViewNow.z, radius: 0.48 },
      ];
    };

    const step = (now: number) => {
      rafId = requestAnimationFrame(step);
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const qt = quickTravelRef.current;
      if (qt && qt.requestId !== lastQuickTravelId) {
        lastQuickTravelId = qt.requestId;
        if (autoWalkRef.current) lastCompletedAutoWalkId = autoWalkRef.current.requestId;
        activeAutoWalkId = 0;
        const safeQt = resolveKenyaCollision(
          qt.arrivalPoint.x,
          qt.arrivalPoint.z,
          0.42,
          getDynamicCirclesNow(),
        );
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
          const next = resolveKenyaCollision(
            posRef.current.x + (dx / mag) * 4.6 * dt,
            posRef.current.z + (dz / mag) * 4.6 * dt,
            0.42,
            getDynamicCirclesNow(),
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
              const snapped = resolveKenyaCollision(
                wp.x,
                wp.z,
                0.42,
                getDynamicCirclesNow(),
              );
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
              const next = resolveKenyaCollision(
                posRef.current.x + (wx / dist) * stepDist,
                posRef.current.z + (wz / dist) * stepDist,
                0.42,
                getDynamicCirclesNow(),
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

      const nearest = findNearestKenyaPoi(posRef.current.x, posRef.current.z);
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

  const touristPins = (['emma', 'daniel'] as const).map((npcId) => {
    const conv = getActiveConversationForTourist(npcId, practicedIds);
    return {
      npcId,
      profile: KENYA_TOURIST_NPCS[npcId],
      convId: conv.id,
      spot: KENYA_TOURIST_VIEWPOINTS[conv.id],
    };
  });

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-3 pt-20 pb-20 sm:px-6 ${
        isNight
          ? 'bg-gradient-to-b from-[#0C1430] via-[#19244A] to-[#212A34]'
          : 'bg-gradient-to-b from-[#4FB2E6] via-[#B8E6FA] to-[#DCD486]'
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

      {/* Interactive Illustrated 2D Maasai Mara Map matching 3D Layout */}
      <div
        className={`relative aspect-[12/10] w-full max-w-[700px] flex-1 min-h-0 max-h-[62dvh] overflow-hidden rounded-3xl border-4 shadow-2xl ${
          isNight ? 'border-[#8FC2FF]/35 bg-[#313B2C]' : 'border-[#F7EEDB] bg-[#C1C267]'
        }`}
      >
        {/* Dirt Savanna Trails SVG */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-75"
          aria-hidden="true"
        >
          <path
            d="M 50 92 L 50 58 M 50 58 L 25 46 M 50 58 L 75 47 M 50 58 L 42 28 M 50 58 L 66 23 M 42 28 L 66 23"
            stroke="#D7AE74"
            strokeWidth="4.2"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="50" cy="78" r="11" fill="#D7AE74" opacity="0.65" />
        </svg>

        {/* Zebra Watering Hole */}
        <div
          style={{
            left: `${toPercentX(-5.2)}%`,
            top: `${toPercentY(-12.0)}%`,
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute flex h-16 w-20 sm:h-20 sm:w-24 items-center justify-center rounded-full border-4 border-[#C9AC77] bg-[#2EAFC0] shadow-inner"
        >
          <span className="text-[10px] font-extrabold text-white drop-shadow">
            {language === 'en' ? 'Waterhole' : 'บึงน้ำ'}
          </span>
        </div>

        {/* Conservation Lookout Platform */}
        <div
          style={{
            left: `${toPercentX(10.0)}%`,
            top: `${toPercentY(-13.1)}%`,
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute flex h-11 w-14 items-center justify-center rounded-xl border-2 border-[#F7EEDB] bg-[#8E5E3B] text-[10px] font-bold text-white shadow"
        >
          {language === 'en' ? 'Lookout' : 'หอชมวิว'}
        </div>

        {/* Open-Air Ambassador Stage Deck */}
        <div
          style={{
            left: `${toPercentX(5.8)}%`,
            top: `${toPercentY(-12.6)}%`,
            transform: 'translate(-50%, -50%)',
          }}
          className={`absolute flex h-7 w-10 items-center justify-center rounded-lg border-2 text-[8px] font-extrabold shadow ${
            ambassadorStageActive
              ? 'border-[#F2C66D] bg-[#2E8B57] text-white'
              : 'border-[#F7EEDB]/70 bg-[#9D6D47] text-[#FFFDF8]'
          }`}
        >
          {language === 'en' ? 'Stage' : 'เวที'}
        </div>

        {/* Ranger Camp Tent & Jeep */}
        <div
          style={{
            left: `${toPercentX(-4.9)}%`,
            top: `${toPercentY(9.9)}%`,
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute flex h-9 w-12 items-center justify-center rounded-lg border-2 border-[#4B6F46] bg-[#E3CB9F] text-[9px] font-extrabold text-[#20304A] shadow"
        >
          {language === 'en' ? 'Tent' : 'เต็นท์'}
        </div>
        <div
          style={{
            left: `${toPercentX(5.2)}%`,
            top: `${toPercentY(10.6)}%`,
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute flex h-8 w-12 items-center justify-center rounded-lg border-2 border-[#3E6A44] bg-[#D8B372] text-[9px] font-extrabold text-[#131E31] shadow"
        >
          {language === 'en' ? '4x4' : 'รถจิ๊บ'}
        </div>

        {/* Interactive Targets: Amina + 5 Safari Landmarks */}
        {KENYA_INTERACTIVE_TARGETS.map((target) => {
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
                style={{ borderColor: isGuided ? '#FBBF24' : visited ? '#2ED6A3' : target.accentColor }}
                className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 shadow-lg group-hover:scale-110 transition-transform ${
                  isNight ? 'bg-[#131E31]/92 text-white' : 'bg-[#FFFDF8]/96 text-[#20304A]'
                } ${isGuided ? 'ring-4 ring-[#FBBF24]' : isNearest ? 'ring-2 ring-[#F2C66D]' : ''}`}
              >
                {visited ? (
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-[#2ED6A3]" aria-hidden="true" />
                ) : target.kind === 'npc' ? (
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#24B8B0]" aria-hidden="true" />
                ) : (
                  <MapPin
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    style={{ color: isGuided ? '#D97706' : target.accentColor }}
                    aria-hidden="true"
                  />
                )}
              </span>
              <span
                className={`mt-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold shadow whitespace-nowrap ${
                  isGuided
                    ? 'bg-[#FBBF24] text-[#131E31]'
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

        {/* Safari Tourist NPCs (Emma & Daniel at Viewpoints) */}
        {touristPins.map((tp) => (
          <button
            key={tp.npcId}
            type="button"
            onClick={() => onActivatePoi(tp.convId)}
            style={{
              left: `${toPercentX(tp.spot.x)}%`,
              top: `${toPercentY(tp.spot.z)}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute z-10 flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
          >
            <span
              style={{ backgroundColor: tp.profile.accentColor }}
              className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-extrabold text-white shadow"
            >
              {tp.profile.name.en[0]}
            </span>
            <span
              className={`mt-0.5 rounded px-1.5 py-0.5 text-[9px] font-bold shadow whitespace-nowrap ${
                isNight ? 'bg-[#131E31]/90 text-[#F2C66D]' : 'bg-[#FFFDF8]/95 text-[#20304A]'
              }`}
            >
              {tp.profile.name[language]}
            </span>
          </button>
        ))}

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
