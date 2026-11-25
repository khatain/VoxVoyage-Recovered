import type { AppLanguage, LocalizedText } from '../types/game';
import {
  AUSTRALIA_BOUNDS,
  AUSTRALIA_INTERACTIVE_TARGETS,
  AUSTRALIA_LANDMARKS,
  AUSTRALIA_RECOMMENDED_ROUTE,
  AUSTRALIA_SPAWN,
  type AustraliaLandmarkId,
  type AustraliaPoiId,
} from '../data/australiaWorld';
import {
  JAIPUR_BOUNDS,
  JAIPUR_INTERACTIVE_TARGETS,
  JAIPUR_SPAWN,
  JAIPUR_VOCAB_OBJECTS,
  type JaipurPoiId,
  type JaipurVocabObjectId,
} from '../data/jaipurWorld';
import { JAIPUR_SPOT_AND_SPEAK_CHALLENGES } from '../data/jaipurSpotAndSpeak';
import {
  KENYA_BOUNDS,
  KENYA_INTERACTIVE_TARGETS,
  KENYA_LANDMARKS,
  KENYA_SPAWN,
  KENYA_TOURIST_VIEWPOINTS,
  type KenyaLandmarkId,
  type KenyaPoiId,
} from '../data/kenyaWorld';
import { KENYA_DISCOVERY_TASKS } from '../data/kenyaDiscovery';
import { KENYA_BUILD_STATIONS } from '../data/kenyaBuild';
import {
  getActiveConversationForTourist,
  KENYA_PRACTICE_CONVERSATIONS,
} from '../data/kenyaPractice';
import {
  SCOTLAND_BOUNDS,
  SCOTLAND_INTERACTIVE_TARGETS,
  SCOTLAND_LANDMARKS,
  SCOTLAND_SPAWN,
  type ScotlandLandmarkId,
  type ScotlandPoiId,
} from '../data/scotlandWorld';
import { SCOTLAND_BUILD_STATIONS } from '../data/scotlandBuild';
import { SCOTLAND_PRACTICE_MISSIONS } from '../data/scotlandPractice';
import {
  findNearestAustraliaPoi,
  resolveAustraliaCollision,
} from './australiaCollision';
import {
  findNearestInteractivePoi,
  resolveJaipurCollision,
} from './jaipurCollision';
import {
  findNearestKenyaPoi,
  resolveKenyaCollision,
} from './kenyaCollision';
import {
  findNearestScotlandPoi,
  resolveScotlandCollision,
} from './scotlandCollision';
import {
  EGYPT_BOUNDS,
  EGYPT_INTERACTIVE_TARGETS,
  EGYPT_LANDMARKS,
  EGYPT_RECOMMENDED_ROUTE,
  EGYPT_SPAWN,
  type EgyptLandmarkId,
  type EgyptPoiId,
} from '../data/egyptWorld';
import {
  findNearestEgyptPoi,
  resolveEgyptCollision,
} from './egyptCollision';

export type NavWorldId = 'australia' | 'india' | 'kenya' | 'scotland' | 'egypt';

export interface NavPoint2D {
  x: number;
  z: number;
}

export interface NavDestinationItem {
  id: string;
  worldId: NavWorldId;
  kind: 'npc' | 'landmark' | 'vocab';
  title: LocalizedText;
  position: NavPoint2D;
  interactionRadius: number;
  accentColor: string;
  order: number;
}

export interface WorldNavigationContext {
  kenyaPracticedIds?: KenyaLandmarkId[];
  kenyaPracticeCompleted?: boolean;
  kenyaPerformStarted?: boolean;
}

export interface NavPathResult {
  reachable: boolean;
  reason: 'ok' | 'already_nearby' | 'invalid_target' | 'unreachable';
  target: NavDestinationItem | null;
  arrivalPoint: NavPoint2D | null;
  waypoints: NavPoint2D[];
  totalDistance: number;
}

export interface QuickTravelResolution {
  allowed: boolean;
  reason: 'ok' | 'invalid_target' | 'locked' | 'unreachable';
  target: NavDestinationItem | null;
  arrivalPoint: NavPoint2D | null;
  facingYaw: number;
}

export interface ActiveAutoWalkRequest {
  requestId: number;
  targetId: string;
  targetTitle: LocalizedText;
  waypoints: NavPoint2D[];
  arrivalPoint: NavPoint2D;
}

export interface ActiveQuickTravelRequest {
  requestId: number;
  targetId: string;
  targetTitle: LocalizedText;
  arrivalPoint: NavPoint2D;
  facingYaw: number;
}

export interface AustraliaNextMissionState {
  countryUnlocked: boolean;
  discoverStarted: boolean;
  discoverCompleted: boolean;
  completedDiscoverIds: AustraliaLandmarkId[];
  buildUnlocked: boolean;
  buildStarted?: boolean;
  completedBuildIds?: AustraliaLandmarkId[];
  buildCompleted?: boolean;
  practiceUnlocked?: boolean;
  practiceStarted?: boolean;
  completedPracticeIds?: AustraliaLandmarkId[];
  practiceCompleted?: boolean;
  performUnlocked?: boolean;
  performStarted?: boolean;
  completedPerformIds?: AustraliaLandmarkId[];
  performCompleted?: boolean;
}

export interface IndiaNextMissionState {
  countryUnlocked: boolean;
  metAarav: boolean;
  foundObjectIds: JaipurVocabObjectId[];
  wordDetectiveCompleted: boolean;
  buildUnlocked: boolean;
  sentenceTrainCompleted: boolean;
  practiceUnlocked: boolean;
  spotAndSpeakStarted: boolean;
  spotAndSpeakCompletedIds: JaipurVocabObjectId[];
  spotAndSpeakCompleted: boolean;
  performUnlocked: boolean;
  showcaseCompleted: boolean;
}

export interface KenyaNextMissionState {
  countryUnlocked: boolean;
  discoverStarted: boolean;
  discoveredSpotIds: KenyaLandmarkId[];
  discoverCompleted: boolean;
  buildStarted: boolean;
  builtBoardIds: KenyaLandmarkId[];
  buildCompleted: boolean;
  practiceStarted: boolean;
  practicedIds: KenyaLandmarkId[];
  practiceCompleted: boolean;
  performStarted: boolean;
  performCompleted: boolean;
}

export interface ScotlandNextMissionState {
  countryUnlocked: boolean;
  discoverStarted: boolean;
  discoveredEvidenceIds: ScotlandLandmarkId[];
  discoverCompleted: boolean;
  buildStarted: boolean;
  builtStationIds: ScotlandLandmarkId[];
  buildCompleted: boolean;
  practiceStarted: boolean;
  practicedStationIds: ScotlandLandmarkId[];
  practiceCompleted: boolean;
  performStarted: boolean;
  performCompleted: boolean;
}

export interface EgyptNextMissionState {
  countryUnlocked: boolean;
  discoverStarted?: boolean;
  completedDiscoverIds?: EgyptLandmarkId[];
  discoverCompleted?: boolean;
  buildUnlocked?: boolean;
  buildStarted?: boolean;
  completedBuildIds?: EgyptLandmarkId[];
  buildCompleted?: boolean;
}

export type NextMissionWorldState =
  | { worldId: 'australia'; state: AustraliaNextMissionState }
  | { worldId: 'india'; state: IndiaNextMissionState }
  | { worldId: 'kenya'; state: KenyaNextMissionState }
  | { worldId: 'scotland'; state: ScotlandNextMissionState }
  | { worldId: 'egypt'; state: EgyptNextMissionState };

export interface NextMissionResolution {
  status: 'actionable' | 'coming_soon' | 'locked' | 'country_completed' | 'none';
  targetId: string | null;
  target: NavDestinationItem | null;
  stageLabel: 'DISCOVER' | 'BUILD' | 'PRACTICE' | 'PERFORM' | 'COMPLETE' | 'LOCKED' | 'SOON';
  reasonKey:
    | 'start_discover'
    | 'discover_station'
    | 'start_build'
    | 'build_station'
    | 'start_practice'
    | 'practice_station'
    | 'start_perform'
    | 'perform_stage'
    | 'perform_station'
    | 'perform_reflection'
    | 'australia_build_coming_soon'
    | 'australia_practice_coming_soon'
    | 'australia_perform_coming_soon'
    | 'egypt_coming_soon'
    | 'egypt_build_coming_soon'
    | 'egypt_practice_coming_soon'
    | 'country_locked'
    | 'country_completed'
    | 'none';
  message: LocalizedText;
}

interface WorldCollisionAdapter {
  worldId: NavWorldId;
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number; playerRadius: number };
  spawn: NavPoint2D;
  targets: NavDestinationItem[];
  resolveCollision: (
    x: number,
    z: number,
    radius: number,
    context?: WorldNavigationContext,
  ) => NavPoint2D;
  findNearestPoiId: (x: number, z: number) => string | null;
}

const GRID_STEP = 0.5;
const LINE_CHECK_STEP = 0.18;

const SORTED_SCOTLAND_LANDMARKS = [...SCOTLAND_LANDMARKS].sort((a, b) => a.order - b.order);

function buildKenyaDynamicCircles(context?: WorldNavigationContext) {
  const circles: { x: number; z: number; radius: number }[] = [];
  const practiced = context?.kenyaPracticedIds ?? [];
  const emmaActive = getActiveConversationForTourist('emma', practiced);
  const danielActive = getActiveConversationForTourist('daniel', practiced);
  const emmaVP = emmaActive
    ? KENYA_TOURIST_VIEWPOINTS[emmaActive.id]
    : context?.kenyaPerformStarted && context?.kenyaPracticeCompleted
      ? { x: 4.5, z: -10.4 }
      : null;
  const danielVP = danielActive
    ? KENYA_TOURIST_VIEWPOINTS[danielActive.id]
    : context?.kenyaPerformStarted && context?.kenyaPracticeCompleted
      ? { x: 4.3, z: -11.6 }
      : null;
  if (emmaVP) circles.push({ x: emmaVP.x, z: emmaVP.z, radius: 0.55 });
  if (danielVP) circles.push({ x: danielVP.x, z: danielVP.z, radius: 0.55 });
  return circles;
}

function getWorldAdapter(worldId: NavWorldId): WorldCollisionAdapter | null {
  switch (worldId) {
    case 'australia': {
      const orderMap = new Map<string, number>();
      AUSTRALIA_LANDMARKS.forEach((l) => orderMap.set(l.id, l.order + 10));
      orderMap.set('npc_olivia', 1);
      orderMap.set('npc_noah', 2);
      orderMap.set('npc_mia', 3);
      orderMap.set('npc_jack', 4);
      return {
        worldId: 'australia',
        bounds: AUSTRALIA_BOUNDS,
        spawn: { x: AUSTRALIA_SPAWN.x, z: AUSTRALIA_SPAWN.z },
        targets: AUSTRALIA_INTERACTIVE_TARGETS.map((t) => ({
          id: t.id,
          worldId: 'australia',
          kind: t.kind,
          title: t.title,
          position: t.position,
          interactionRadius: t.interactionRadius,
          accentColor: t.accentColor,
          order: orderMap.get(t.id) ?? 99,
        })),
        resolveCollision: (x, z, radius) => resolveAustraliaCollision(x, z, radius),
        findNearestPoiId: (x, z) => findNearestAustraliaPoi(x, z)?.id ?? null,
      };
    }
    case 'india': {
      const orderMap = new Map<string, number>();
      orderMap.set('local_guide', 1);
      JAIPUR_VOCAB_OBJECTS.forEach((v) => orderMap.set(v.id, v.order + 10));
      return {
        worldId: 'india',
        bounds: JAIPUR_BOUNDS,
        spawn: { x: JAIPUR_SPAWN.x, z: JAIPUR_SPAWN.z },
        targets: JAIPUR_INTERACTIVE_TARGETS.map((t) => ({
          id: t.id,
          worldId: 'india',
          kind: t.kind,
          title: t.title,
          position: t.position,
          interactionRadius: t.interactionRadius,
          accentColor: t.accentColor,
          order: orderMap.get(t.id) ?? 99,
        })),
        resolveCollision: (x, z, radius) => resolveJaipurCollision(x, z, radius),
        findNearestPoiId: (x, z) => findNearestInteractivePoi(x, z)?.id ?? null,
      };
    }
    case 'kenya': {
      const orderMap = new Map<string, number>();
      orderMap.set('local_guide', 1);
      KENYA_LANDMARKS.forEach((l) => orderMap.set(l.id, l.order + 10));
      return {
        worldId: 'kenya',
        bounds: KENYA_BOUNDS,
        spawn: { x: KENYA_SPAWN.x, z: KENYA_SPAWN.z },
        targets: KENYA_INTERACTIVE_TARGETS.map((t) => ({
          id: t.id,
          worldId: 'kenya',
          kind: t.kind,
          title: t.title,
          position: t.position,
          interactionRadius: t.interactionRadius,
          accentColor: t.accentColor,
          order: orderMap.get(t.id) ?? 99,
        })),
        resolveCollision: (x, z, radius, context) =>
          resolveKenyaCollision(x, z, radius, buildKenyaDynamicCircles(context)),
        findNearestPoiId: (x, z) => findNearestKenyaPoi(x, z)?.id ?? null,
      };
    }
    case 'scotland': {
      const orderMap = new Map<string, number>();
      orderMap.set('npc_eilidh', 1);
      orderMap.set('npc_fiona', 2);
      SCOTLAND_LANDMARKS.forEach((l) => orderMap.set(l.id, l.order + 10));
      return {
        worldId: 'scotland',
        bounds: SCOTLAND_BOUNDS,
        spawn: { x: SCOTLAND_SPAWN.x, z: SCOTLAND_SPAWN.z },
        targets: SCOTLAND_INTERACTIVE_TARGETS.map((t) => ({
          id: t.id,
          worldId: 'scotland',
          kind: t.kind,
          title: t.title,
          position: t.position,
          interactionRadius: t.interactionRadius,
          accentColor: t.accentColor,
          order: orderMap.get(t.id) ?? 99,
        })),
        resolveCollision: (x, z, radius) => resolveScotlandCollision(x, z, radius),
        findNearestPoiId: (x, z) => findNearestScotlandPoi(x, z)?.id ?? null,
      };
    }
    case 'egypt': {
      const orderMap = new Map<string, number>();
      orderMap.set('npc_layla', 1);
      orderMap.set('npc_omar', 2);
      orderMap.set('npc_mariam', 3);
      orderMap.set('npc_karim', 4);
      EGYPT_LANDMARKS.forEach((l) => orderMap.set(l.id, l.order + 10));
      return {
        worldId: 'egypt',
        bounds: EGYPT_BOUNDS,
        spawn: { x: EGYPT_SPAWN.x, z: EGYPT_SPAWN.z },
        targets: EGYPT_INTERACTIVE_TARGETS.map((t) => ({
          id: t.id,
          worldId: 'egypt',
          kind: t.kind,
          title: t.title,
          position: t.position,
          interactionRadius: t.interactionRadius,
          accentColor: t.accentColor,
          order: orderMap.get(t.id) ?? 99,
        })),
        resolveCollision: (x, z, radius) => resolveEgyptCollision(x, z, radius),
        findNearestPoiId: (x, z) => findNearestEgyptPoi(x, z)?.id ?? null,
      };
    }
    default:
      return null;
  }
}

export function getWorldNavDestinations(worldId: NavWorldId): NavDestinationItem[] {
  const adapter = getWorldAdapter(worldId);
  if (!adapter) return [];
  return [...adapter.targets].sort((a, b) => a.order - b.order);
}

export function getNavDestinationById(
  worldId: NavWorldId,
  targetId: string | null | undefined,
): NavDestinationItem | null {
  if (!targetId) return null;
  const adapter = getWorldAdapter(worldId);
  if (!adapter) return null;
  return adapter.targets.find((item) => item.id === targetId) ?? null;
}

export function isWalkablePoint(
  worldId: NavWorldId,
  x: number,
  z: number,
  context?: WorldNavigationContext,
  clearanceMargin = 0.04,
): boolean {
  const adapter = getWorldAdapter(worldId);
  if (!adapter) return false;
  if (!Number.isFinite(x) || !Number.isFinite(z)) return false;
  const effectiveRadius = adapter.bounds.playerRadius + clearanceMargin;
  const resolved = adapter.resolveCollision(x, z, effectiveRadius, context);
  return Math.hypot(resolved.x - x, resolved.z - z) < 0.015;
}

export function hasClearLineOfSight(
  worldId: NavWorldId,
  from: NavPoint2D,
  to: NavPoint2D,
  context?: WorldNavigationContext,
  clearanceMargin = 0.04,
): boolean {
  const dist = Math.hypot(to.x - from.x, to.z - from.z);
  const steps = Math.max(1, Math.ceil(dist / LINE_CHECK_STEP));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = from.x + (to.x - from.x) * t;
    const z = from.z + (to.z - from.z) * t;
    if (!isWalkablePoint(worldId, x, z, context, clearanceMargin)) {
      return false;
    }
  }
  return true;
}

function generateArrivalCandidates(
  adapter: WorldCollisionAdapter,
  target: NavDestinationItem,
  fromPos: NavPoint2D,
  context?: WorldNavigationContext,
): NavPoint2D[] {
  const candidatesPrimary: { pt: NavPoint2D; score: number }[] = [];
  const candidatesSecondary: { pt: NavPoint2D; score: number }[] = [];
  const maxSafeRadius = Math.min(target.interactionRadius * 0.86, 2.35);

  if (target.kind !== 'npc') {
    if (isWalkablePoint(adapter.worldId, target.position.x, target.position.z, context, 0.05)) {
      const distFrom = Math.hypot(fromPos.x - target.position.x, fromPos.z - target.position.z);
      const matched = adapter.findNearestPoiId(target.position.x, target.position.z) === target.id;
      const entry = { pt: { x: target.position.x, z: target.position.z }, score: distFrom * 0.1 };
      if (matched) candidatesPrimary.push(entry);
      else candidatesSecondary.push(entry);
    }
  }

  const approachAngle = Math.atan2(
    fromPos.z - target.position.z,
    fromPos.x - target.position.x,
  );
  const radii = [0.95, 1.25, 1.55, 1.85, 2.15].filter((r) => r <= maxSafeRadius);
  const angleSteps = 16;

  for (const r of radii) {
    for (let i = 0; i < angleSteps; i++) {
      const angle = approachAngle + (i * Math.PI * 2) / angleSteps;
      const cx = target.position.x + Math.cos(angle) * r;
      const cz = target.position.z + Math.sin(angle) * r;
      if (!isWalkablePoint(adapter.worldId, cx, cz, context, 0.05)) continue;
      if (Math.hypot(cx - target.position.x, cz - target.position.z) > target.interactionRadius * 0.9) {
        continue;
      }
      const distFrom = Math.hypot(cx - fromPos.x, cz - fromPos.z);
      const matched = adapter.findNearestPoiId(cx, cz) === target.id;
      const score = distFrom + r * 0.35;
      if (matched) {
        candidatesPrimary.push({ pt: { x: cx, z: cz }, score });
      } else {
        candidatesSecondary.push({ pt: { x: cx, z: cz }, score });
      }
    }
  }

  candidatesPrimary.sort((a, b) => a.score - b.score);
  candidatesSecondary.sort((a, b) => a.score - b.score);
  return [...candidatesPrimary, ...candidatesSecondary].map((c) => c.pt);
}

export function findSafeArrivalPoint(
  worldId: NavWorldId,
  targetId: string,
  fromPos?: NavPoint2D,
  context?: WorldNavigationContext,
): NavPoint2D | null {
  const adapter = getWorldAdapter(worldId);
  if (!adapter) return null;
  const target = adapter.targets.find((item) => item.id === targetId);
  if (!target) return null;
  const refPos = fromPos ?? adapter.spawn;
  const candidates = generateArrivalCandidates(adapter, target, refPos, context);
  return candidates[0] ?? null;
}

function runGridAStar(
  adapter: WorldCollisionAdapter,
  start: NavPoint2D,
  goal: NavPoint2D,
  context?: WorldNavigationContext,
): NavPoint2D[] | null {
  if (hasClearLineOfSight(adapter.worldId, start, goal, context, 0.04)) {
    return [goal];
  }

  const { minX, maxX, minZ, maxZ, playerRadius } = adapter.bounds;
  const gridMinX = Math.ceil((minX + playerRadius + 0.06) / GRID_STEP) * GRID_STEP;
  const gridMinZ = Math.ceil((minZ + playerRadius + 0.06) / GRID_STEP) * GRID_STEP;
  const cols = Math.floor((maxX - playerRadius - 0.06 - gridMinX) / GRID_STEP) + 1;
  const rows = Math.floor((maxZ - playerRadius - 0.06 - gridMinZ) / GRID_STEP) + 1;
  if (cols <= 1 || rows <= 1) return null;

  const totalCells = cols * rows;
  const walkable = new Uint8Array(totalCells);
  const cellCenter = (col: number, row: number): NavPoint2D => ({
    x: Number((gridMinX + col * GRID_STEP).toFixed(3)),
    z: Number((gridMinZ + row * GRID_STEP).toFixed(3)),
  });

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const pt = cellCenter(c, r);
      if (isWalkablePoint(adapter.worldId, pt.x, pt.z, context, 0.04)) {
        walkable[r * cols + c] = 1;
      }
    }
  }

  const findNearestAccessibleCell = (origin: NavPoint2D): number => {
    const baseC = Math.max(0, Math.min(cols - 1, Math.round((origin.x - gridMinX) / GRID_STEP)));
    const baseR = Math.max(0, Math.min(rows - 1, Math.round((origin.z - gridMinZ) / GRID_STEP)));
    let bestIdx = -1;
    let bestDist = Infinity;
    for (let dr = -3; dr <= 3; dr++) {
      for (let dc = -3; dc <= 3; dc++) {
        const nr = baseR + dr;
        const nc = baseC + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        const idx = nr * cols + nc;
        if (!walkable[idx]) continue;
        const pt = cellCenter(nc, nr);
        const d = Math.hypot(pt.x - origin.x, pt.z - origin.z);
        if (d < bestDist && hasClearLineOfSight(adapter.worldId, origin, pt, context, 0.035)) {
          bestDist = d;
          bestIdx = idx;
        }
      }
    }
    return bestIdx;
  };

  const startIdx = findNearestAccessibleCell(start);
  const goalIdx = findNearestAccessibleCell(goal);
  if (startIdx < 0 || goalIdx < 0) return null;

  const gScore = new Float64Array(totalCells);
  gScore.fill(Infinity);
  const fScore = new Float64Array(totalCells);
  fScore.fill(Infinity);
  const cameFrom = new Int32Array(totalCells);
  cameFrom.fill(-1);
  const closed = new Uint8Array(totalCells);
  const inOpen = new Uint8Array(totalCells);

  const startCol = startIdx % cols;
  const startRow = Math.floor(startIdx / cols);
  const goalCol = goalIdx % cols;
  const goalRow = Math.floor(goalIdx / cols);
  const startCellPt = cellCenter(startCol, startRow);
  const goalCellPt = cellCenter(goalCol, goalRow);

  gScore[startIdx] = 0;
  fScore[startIdx] = Math.hypot(goalCellPt.x - startCellPt.x, goalCellPt.z - startCellPt.z);

  const openList: number[] = [startIdx];
  inOpen[startIdx] = 1;

  const dirs = [
    [1, 0, GRID_STEP],
    [-1, 0, GRID_STEP],
    [0, 1, GRID_STEP],
    [0, -1, GRID_STEP],
    [1, 1, GRID_STEP * Math.SQRT2],
    [1, -1, GRID_STEP * Math.SQRT2],
    [-1, 1, GRID_STEP * Math.SQRT2],
    [-1, -1, GRID_STEP * Math.SQRT2],
  ] as const;

  let found = false;
  while (openList.length > 0) {
    let bestPos = 0;
    let current = openList[0];
    let bestF = fScore[current];
    for (let i = 1; i < openList.length; i++) {
      const candidate = openList[i];
      if (fScore[candidate] < bestF) {
        bestF = fScore[candidate];
        current = candidate;
        bestPos = i;
      }
    }

    openList[bestPos] = openList[openList.length - 1];
    openList.pop();
    inOpen[current] = 0;
    closed[current] = 1;

    if (current === goalIdx) {
      found = true;
      break;
    }

    const cr = Math.floor(current / cols);
    const cc = current % cols;
    const curPt = cellCenter(cc, cr);

    for (const [dc, dr, stepCost] of dirs) {
      const nc = cc + dc;
      const nr = cr + dr;
      if (nc < 0 || nc >= cols || nr < 0 || nr >= rows) continue;
      const nIdx = nr * cols + nc;
      if (closed[nIdx] || !walkable[nIdx]) continue;

      if (dc !== 0 && dr !== 0) {
        const adj1 = cr * cols + nc;
        const adj2 = nr * cols + cc;
        if (!walkable[adj1] || !walkable[adj2]) {
          const nPtCheck = cellCenter(nc, nr);
          if (!hasClearLineOfSight(adapter.worldId, curPt, nPtCheck, context, 0.04)) {
            continue;
          }
        }
      }

      const tentativeG = gScore[current] + stepCost;
      if (tentativeG < gScore[nIdx]) {
        cameFrom[nIdx] = current;
        gScore[nIdx] = tentativeG;
        const nPt = cellCenter(nc, nr);
        fScore[nIdx] = tentativeG + Math.hypot(goalCellPt.x - nPt.x, goalCellPt.z - nPt.z);
        if (!inOpen[nIdx]) {
          openList.push(nIdx);
          inOpen[nIdx] = 1;
        }
      }
    }
  }

  if (!found) return null;

  const cellChain: NavPoint2D[] = [];
  let trace = goalIdx;
  while (trace !== -1) {
    const tr = Math.floor(trace / cols);
    const tc = trace % cols;
    cellChain.push(cellCenter(tc, tr));
    trace = cameFrom[trace];
  }
  cellChain.reverse();

  const rawPoints: NavPoint2D[] = [start, ...cellChain, goal];
  const smoothed: NavPoint2D[] = [rawPoints[0]];
  let anchor = 0;
  while (anchor < rawPoints.length - 1) {
    let furthest = anchor + 1;
    for (let lookahead = rawPoints.length - 1; lookahead > anchor + 1; lookahead--) {
      if (
        hasClearLineOfSight(
          adapter.worldId,
          rawPoints[anchor],
          rawPoints[lookahead],
          context,
          0.04,
        )
      ) {
        furthest = lookahead;
        break;
      }
    }
    smoothed.push(rawPoints[furthest]);
    anchor = furthest;
  }

  return smoothed.slice(1);
}

export function computeWalkablePath(
  worldId: NavWorldId,
  fromPos: NavPoint2D,
  targetId: string,
  context?: WorldNavigationContext,
): NavPathResult {
  const adapter = getWorldAdapter(worldId);
  if (!adapter) {
    return {
      reachable: false,
      reason: 'invalid_target',
      target: null,
      arrivalPoint: null,
      waypoints: [],
      totalDistance: 0,
    };
  }

  const target = adapter.targets.find((item) => item.id === targetId);
  if (!target) {
    return {
      reachable: false,
      reason: 'invalid_target',
      target: null,
      arrivalPoint: null,
      waypoints: [],
      totalDistance: 0,
    };
  }

  if (
    !Number.isFinite(fromPos.x) ||
    !Number.isFinite(fromPos.z) ||
    fromPos.x < adapter.bounds.minX - 0.5 ||
    fromPos.x > adapter.bounds.maxX + 0.5 ||
    fromPos.z < adapter.bounds.minZ - 0.5 ||
    fromPos.z > adapter.bounds.maxZ + 0.5
  ) {
    return {
      reachable: false,
      reason: 'unreachable',
      target,
      arrivalPoint: null,
      waypoints: [],
      totalDistance: 0,
    };
  }

  const safeStart = isWalkablePoint(worldId, fromPos.x, fromPos.z, context, 0.025)
    ? { x: fromPos.x, z: fromPos.z }
    : adapter.resolveCollision(
        fromPos.x,
        fromPos.z,
        adapter.bounds.playerRadius + 0.03,
        context,
      );

  if (!isWalkablePoint(worldId, safeStart.x, safeStart.z, context, 0.02)) {
    return {
      reachable: false,
      reason: 'unreachable',
      target,
      arrivalPoint: null,
      waypoints: [],
      totalDistance: 0,
    };
  }

  const currentDistToTarget = Math.hypot(
    safeStart.x - target.position.x,
    safeStart.z - target.position.z,
  );
  if (
    currentDistToTarget <= target.interactionRadius * 0.78 &&
    adapter.findNearestPoiId(safeStart.x, safeStart.z) === target.id
  ) {
    return {
      reachable: true,
      reason: 'already_nearby',
      target,
      arrivalPoint: { x: safeStart.x, z: safeStart.z },
      waypoints: [],
      totalDistance: 0,
    };
  }

  const candidates = generateArrivalCandidates(adapter, target, safeStart, context);
  for (const arrival of candidates.slice(0, 12)) {
    const waypoints = runGridAStar(adapter, safeStart, arrival, context);
    if (waypoints && waypoints.length > 0) {
      let totalDistance = 0;
      let prev = safeStart;
      for (const wp of waypoints) {
        totalDistance += Math.hypot(wp.x - prev.x, wp.z - prev.z);
        prev = wp;
      }
      return {
        reachable: true,
        reason: 'ok',
        target,
        arrivalPoint: arrival,
        waypoints,
        totalDistance,
      };
    }
  }

  return {
    reachable: false,
    reason: 'unreachable',
    target,
    arrivalPoint: null,
    waypoints: [],
    totalDistance: 0,
  };
}

export function resolveQuickTravelDestination(
  worldId: NavWorldId,
  targetId: string,
  options?: {
    fromPos?: NavPoint2D;
    countryUnlocked?: boolean;
    context?: WorldNavigationContext;
  },
): QuickTravelResolution {
  const adapter = getWorldAdapter(worldId);
  if (!adapter) {
    return {
      allowed: false,
      reason: 'invalid_target',
      target: null,
      arrivalPoint: null,
      facingYaw: 0,
    };
  }
  if (options?.countryUnlocked === false) {
    return {
      allowed: false,
      reason: 'locked',
      target: null,
      arrivalPoint: null,
      facingYaw: 0,
    };
  }
  const target = adapter.targets.find((item) => item.id === targetId);
  if (!target) {
    return {
      allowed: false,
      reason: 'invalid_target',
      target: null,
      arrivalPoint: null,
      facingYaw: 0,
    };
  }

  const refPos = options?.fromPos ?? adapter.spawn;
  const pathFromSpawn = computeWalkablePath(
    worldId,
    adapter.spawn,
    targetId,
    options?.context,
  );
  if (!pathFromSpawn.reachable || !pathFromSpawn.arrivalPoint) {
    return {
      allowed: false,
      reason: 'unreachable',
      target,
      arrivalPoint: null,
      facingYaw: 0,
    };
  }

  const preferredArrival =
    findSafeArrivalPoint(worldId, targetId, refPos, options?.context) ??
    pathFromSpawn.arrivalPoint;

  const facingYaw = Math.atan2(
    target.position.x - preferredArrival.x,
    target.position.z - preferredArrival.z,
  );

  return {
    allowed: true,
    reason: 'ok',
    target,
    arrivalPoint: preferredArrival,
    facingYaw,
  };
}

export function resolveNextMissionTarget(
  input: NextMissionWorldState,
): NextMissionResolution {
  const mkLocked = (): NextMissionResolution => ({
    status: 'locked',
    targetId: null,
    target: null,
    stageLabel: 'LOCKED',
    reasonKey: 'country_locked',
    message: {
      en: 'Complete the previous country first to unlock this destination.',
      th: 'กรุณาพิชิตภารกิจของประเทศก่อนหน้าเพื่อปลดล็อกประเทศนี้ก่อน',
    },
  });

  const adapter = getWorldAdapter(input.worldId);
  const pickTarget = (id: string) =>
    adapter?.targets.find((item) => item.id === id) ?? null;

  if (input.worldId === 'egypt') {
    const s = input.state;
    if (!s.countryUnlocked) return mkLocked();
    if (!s.discoverStarted) {
      const targetId: EgyptPoiId = 'npc_layla';
      return {
        status: 'actionable',
        targetId,
        target: pickTarget(targetId),
        stageLabel: 'DISCOVER',
        reasonKey: 'start_discover',
        message: {
          en: 'Talk to Dr. Layla Hassan to start Stage 1: DISCOVER — Secrets of the Pharaohs.',
          th: 'คุยกับ ดร.ไลลา ฮัสซัน เพื่อเริ่มด่านที่ 1: DISCOVER — ความลับแห่งฟาโรห์',
        },
      };
    }
    if (!s.discoverCompleted) {
      const completed = s.completedDiscoverIds ?? [];
      const nextLandmarkId =
        EGYPT_RECOMMENDED_ROUTE.find((id) => !completed.includes(id)) ??
        EGYPT_RECOMMENDED_ROUTE[0];
      const target = pickTarget(nextLandmarkId);
      return {
        status: 'actionable',
        targetId: nextLandmarkId,
        target,
        stageLabel: 'DISCOVER',
        reasonKey: 'discover_station',
        message: {
          en: `Next DISCOVER station: ${target?.title.en ?? nextLandmarkId}`,
          th: `ภารกิจ DISCOVER ถัดไป: ${target?.title.th ?? nextLandmarkId}`,
        },
      };
    }
    if (!s.buildStarted) {
      const targetId: EgyptPoiId = 'npc_layla';
      return {
        status: 'actionable',
        targetId,
        target: pickTarget(targetId),
        stageLabel: 'BUILD',
        reasonKey: 'start_build',
        message: {
          en: 'Talk to Dr. Layla Hassan to start Stage 2: BUILD — Ancient Instruction Builder.',
          th: 'คุยกับ ดร.ไลลา ฮัสซัน เพื่อเริ่มด่านที่ 2: BUILD — นักสร้างคำสั่งแห่งอารยธรรมโบราณ',
        },
      };
    }
    if (!s.buildCompleted) {
      const completedBuild = s.completedBuildIds ?? [];
      const nextLandmarkId =
        EGYPT_RECOMMENDED_ROUTE.find((id) => !completedBuild.includes(id)) ??
        EGYPT_RECOMMENDED_ROUTE[0];
      const target = pickTarget(nextLandmarkId);
      return {
        status: 'actionable',
        targetId: nextLandmarkId,
        target,
        stageLabel: 'BUILD',
        reasonKey: 'build_station',
        message: {
          en: `Next BUILD workshop: ${target?.title.en ?? nextLandmarkId}`,
          th: `เวิร์กชอป BUILD ถัดไป: ${target?.title.th ?? nextLandmarkId}`,
        },
      };
    }
    return {
      status: 'coming_soon',
      targetId: null,
      target: null,
      stageLabel: 'PRACTICE',
      reasonKey: 'egypt_practice_coming_soon',
      message: {
        en: 'Stage 2 BUILD completed (+50 XP)! Stage 3: PRACTICE (Speaking & Role-Play) opens next.',
        th: 'พิชิตด่าน BUILD ครบแล้ว (+50 XP)! ด่านที่ 3: PRACTICE กำลังจะเปิดในบทถัดไป',
      },
    };
  }

  if (input.worldId === 'australia') {
    const s = input.state;
    if (!s.countryUnlocked) return mkLocked();
    if (!s.discoverStarted) {
      const targetId: AustraliaPoiId = 'npc_olivia';
      return {
        status: 'actionable',
        targetId,
        target: pickTarget(targetId),
        stageLabel: 'DISCOVER',
        reasonKey: 'start_discover',
        message: {
          en: 'Talk to Olivia Parker to start Stage 1: DISCOVER.',
          th: 'คุยกับโอลิเวีย พาร์กเกอร์ เพื่อเริ่มด่านที่ 1 DISCOVER',
        },
      };
    }
    if (!s.discoverCompleted) {
      const nextLandmarkId =
        AUSTRALIA_RECOMMENDED_ROUTE.find((id) => !s.completedDiscoverIds.includes(id)) ??
        AUSTRALIA_RECOMMENDED_ROUTE[0];
      const target = pickTarget(nextLandmarkId);
      return {
        status: 'actionable',
        targetId: nextLandmarkId,
        target,
        stageLabel: 'DISCOVER',
        reasonKey: 'discover_station',
        message: {
          en: `Next DISCOVER stop: ${target?.title.en ?? nextLandmarkId}`,
          th: `ภารกิจ DISCOVER ถัดไป: ${target?.title.th ?? nextLandmarkId}`,
        },
      };
    }
    if (!s.buildStarted) {
      const targetId: AustraliaPoiId = 'npc_olivia';
      return {
        status: 'actionable',
        targetId,
        target: pickTarget(targetId),
        stageLabel: 'BUILD',
        reasonKey: 'start_build',
        message: {
          en: 'Talk to Olivia Parker to start Stage 2: BUILD Conversation Builder.',
          th: 'คุยกับโอลิเวีย พาร์กเกอร์ เพื่อเริ่มด่านที่ 2 BUILD',
        },
      };
    }
    if (!s.buildCompleted) {
      const completedBuild = s.completedBuildIds ?? [];
      const nextBuildId =
        AUSTRALIA_RECOMMENDED_ROUTE.find((id) => !completedBuild.includes(id)) ??
        AUSTRALIA_RECOMMENDED_ROUTE[0];
      const target = pickTarget(nextBuildId);
      return {
        status: 'actionable',
        targetId: nextBuildId,
        target,
        stageLabel: 'BUILD',
        reasonKey: 'build_station',
        message: {
          en: `Next BUILD workshop: ${target?.title.en ?? nextBuildId}`,
          th: `ภารกิจ BUILD ถัดไป: ${target?.title.th ?? nextBuildId}`,
        },
      };
    }
    if (!s.practiceStarted) {
      const targetId: AustraliaPoiId = 'npc_olivia';
      return {
        status: 'actionable',
        targetId,
        target: pickTarget(targetId),
        stageLabel: 'PRACTICE',
        reasonKey: 'start_practice',
        message: {
          en: 'Talk to Olivia Parker to start Stage 3: PRACTICE speaking missions.',
          th: 'คุยกับโอลิเวีย พาร์กเกอร์ เพื่อเริ่มด่านที่ 3 PRACTICE',
        },
      };
    }
    if (!s.practiceCompleted) {
      const completedPractice = s.completedPracticeIds ?? [];
      const nextPracticeId =
        AUSTRALIA_RECOMMENDED_ROUTE.find((id) => !completedPractice.includes(id)) ??
        AUSTRALIA_RECOMMENDED_ROUTE[0];
      const target = pickTarget(nextPracticeId);
      return {
        status: 'actionable',
        targetId: nextPracticeId,
        target,
        stageLabel: 'PRACTICE',
        reasonKey: 'practice_station',
        message: {
          en: `Next speaking mission: ${target?.title.en ?? nextPracticeId}`,
          th: `ภารกิจฝึกพูดถัดไป: ${target?.title.th ?? nextPracticeId}`,
        },
      };
    }
    if (!s.performStarted) {
      const targetId: AustraliaPoiId = 'npc_olivia';
      return {
        status: 'actionable',
        targetId,
        target: pickTarget(targetId),
        stageLabel: 'PERFORM',
        reasonKey: 'start_perform',
        message: {
          en: 'Talk to Olivia Parker to start Stage 4: Final Sydney CityTalk Challenge.',
          th: 'คุยกับโอลิเวีย พาร์กเกอร์ เพื่อเริ่มด่านที่ 4 PERFORM',
        },
      };
    }
    const completedPerform = s.completedPerformIds ?? [];
    const nextPerformId = AUSTRALIA_RECOMMENDED_ROUTE.find(
      (id) => !completedPerform.includes(id),
    );
    if (nextPerformId && !s.performCompleted) {
      const target = pickTarget(nextPerformId);
      return {
        status: 'actionable',
        targetId: nextPerformId,
        target,
        stageLabel: 'PERFORM',
        reasonKey: 'perform_station',
        message: {
          en: `Next Final Challenge: ${target?.title.en ?? nextPerformId}`,
          th: `ภารกิจ PERFORM ถัดไป: ${target?.title.th ?? nextPerformId}`,
        },
      };
    }
    if (!s.performCompleted) {
      const targetId: AustraliaPoiId = 'npc_olivia';
      return {
        status: 'actionable',
        targetId,
        target: pickTarget(targetId),
        stageLabel: 'PERFORM',
        reasonKey: 'perform_reflection',
        message: {
          en: 'Meet Olivia Parker to complete Final Guided Reflection & claim your Sydney Stamp!',
          th: 'พบโอลิเวีย พาร์กเกอร์ เพื่อทำแบบสะท้อนคิดและรับตราประทับซิดนีย์',
        },
      };
    }
    return {
      status: 'country_completed',
      targetId: null,
      target: null,
      stageLabel: 'COMPLETE',
      reasonKey: 'country_completed',
      message: {
        en: 'All missions complete in Australia! Replay or review any Sydney spot anytime.',
        th: 'พิชิตภารกิจครบทุกด่านในออสเตรเลียแล้ว! สามารถเล่นซ้ำหรือทบทวนได้ทุกจุด',
      },
    };
  }

  if (input.worldId === 'india') {
    const s = input.state;
    if (!s.countryUnlocked) return mkLocked();
    if (!s.metAarav) {
      const targetId: JaipurPoiId = 'local_guide';
      return {
        status: 'actionable',
        targetId,
        target: pickTarget(targetId),
        stageLabel: 'DISCOVER',
        reasonKey: 'start_discover',
        message: {
          en: 'Meet Aarav Sharma to begin your Jaipur DISCOVER quest.',
          th: 'พบอาราฟ ชาร์มา เพื่อเริ่มภารกิจ DISCOVER ในชัยปุระ',
        },
      };
    }
    if (!s.wordDetectiveCompleted) {
      const nextVocab =
        JAIPUR_VOCAB_OBJECTS.find((obj) => !s.foundObjectIds.includes(obj.id)) ??
        JAIPUR_VOCAB_OBJECTS[0];
      const target = pickTarget(nextVocab.id);
      return {
        status: 'actionable',
        targetId: nextVocab.id,
        target,
        stageLabel: 'DISCOVER',
        reasonKey: 'discover_station',
        message: {
          en: `Find Word Detective spot: ${nextVocab.word.en}`,
          th: `ค้นหาคำศัพท์จุดถัดไป: ${nextVocab.word.th}`,
        },
      };
    }
    if (s.buildUnlocked && !s.sentenceTrainCompleted) {
      const targetId: JaipurPoiId = 'local_guide';
      return {
        status: 'actionable',
        targetId,
        target: pickTarget(targetId),
        stageLabel: 'BUILD',
        reasonKey: 'start_build',
        message: {
          en: 'Return to Aarav Sharma to launch Sentence Train (BUILD).',
          th: 'กลับไปหาอาราฟเพื่อเริ่มภารกิจ Sentence Train (ด่าน BUILD)',
        },
      };
    }
    if (s.practiceUnlocked && !s.spotAndSpeakStarted) {
      const targetId: JaipurPoiId = 'local_guide';
      return {
        status: 'actionable',
        targetId,
        target: pickTarget(targetId),
        stageLabel: 'PRACTICE',
        reasonKey: 'start_practice',
        message: {
          en: 'Talk to Aarav Sharma to begin Spot & Speak (PRACTICE).',
          th: 'คุยกับอาราฟเพื่อเริ่มภารกิจฝึกพูด Spot & Speak (ด่าน PRACTICE)',
        },
      };
    }
    if (s.practiceUnlocked && s.spotAndSpeakStarted && !s.spotAndSpeakCompleted) {
      const nextSpot =
        JAIPUR_SPOT_AND_SPEAK_CHALLENGES.find(
          (ch) => !s.spotAndSpeakCompletedIds.includes(ch.id),
        ) ?? JAIPUR_SPOT_AND_SPEAK_CHALLENGES[0];
      const target = pickTarget(nextSpot.id);
      return {
        status: 'actionable',
        targetId: nextSpot.id,
        target,
        stageLabel: 'PRACTICE',
        reasonKey: 'practice_station',
        message: {
          en: `Practice Spot & Speak at ${target?.title.en ?? nextSpot.id}`,
          th: `ซ้อมพูด Spot & Speak ที่ ${target?.title.th ?? nextSpot.id}`,
        },
      };
    }
    if (s.performUnlocked && !s.showcaseCompleted) {
      const targetId: JaipurPoiId = 'local_guide';
      return {
        status: 'actionable',
        targetId,
        target: pickTarget(targetId),
        stageLabel: 'PERFORM',
        reasonKey: 'start_perform',
        message: {
          en: 'Talk to Aarav Sharma for your Final Jaipur Tour Guide Showcase!',
          th: 'คุยกับอาราฟเพื่อเริ่มภารกิจสุดท้าย Jaipur Tour Guide Showcase!',
        },
      };
    }
    return {
      status: 'country_completed',
      targetId: null,
      target: null,
      stageLabel: 'COMPLETE',
      reasonKey: 'country_completed',
      message: {
        en: 'All Jaipur missions complete! Pick any destination from Places to revisit.',
        th: 'พิชิตภารกิจชัยปุระครบทุกด่านแล้ว! เลือกจุดหมายเพื่อทบทวนได้ตลอดเวลา',
      },
    };
  }

  if (input.worldId === 'kenya') {
    const s = input.state;
    if (!s.countryUnlocked) return mkLocked();
    if (!s.discoverStarted) {
      const targetId: KenyaPoiId = 'local_guide';
      return {
        status: 'actionable',
        targetId,
        target: pickTarget(targetId),
        stageLabel: 'DISCOVER',
        reasonKey: 'start_discover',
        message: {
          en: 'Speak with Ranger Amina to start Stage 1: DISCOVER.',
          th: 'คุยกับเจ้าหน้าที่อามินาเพื่อเริ่มด่านที่ 1 DISCOVER',
        },
      };
    }
    if (!s.discoverCompleted) {
      const nextSpot =
        KENYA_DISCOVERY_TASKS.find((t) => !s.discoveredSpotIds.includes(t.id)) ??
        KENYA_DISCOVERY_TASKS[0];
      const target = pickTarget(nextSpot.id);
      return {
        status: 'actionable',
        targetId: nextSpot.id,
        target,
        stageLabel: 'DISCOVER',
        reasonKey: 'discover_station',
        message: {
          en: `Explore next safari spot: ${target?.title.en ?? nextSpot.id}`,
          th: `สำรวจจุดถัดไป: ${target?.title.th ?? nextSpot.id}`,
        },
      };
    }
    if (!s.buildStarted) {
      const targetId: KenyaPoiId = 'local_guide';
      return {
        status: 'actionable',
        targetId,
        target: pickTarget(targetId),
        stageLabel: 'BUILD',
        reasonKey: 'start_build',
        message: {
          en: 'Return to Ranger Amina to unlock Safari Fact Builder (BUILD).',
          th: 'กลับไปหาเจ้าหน้าที่อามินาเพื่อเริ่ม Safari Fact Builder (ด่าน BUILD)',
        },
      };
    }
    if (!s.buildCompleted) {
      const nextBoard =
        KENYA_BUILD_STATIONS.find((b) => !s.builtBoardIds.includes(b.id)) ??
        KENYA_BUILD_STATIONS[0];
      const target = pickTarget(nextBoard.id);
      return {
        status: 'actionable',
        targetId: nextBoard.id,
        target,
        stageLabel: 'BUILD',
        reasonKey: 'build_station',
        message: {
          en: `Next BUILD board: ${target?.title.en ?? nextBoard.id}`,
          th: `ป้ายข้อมูลถัดไป: ${target?.title.th ?? nextBoard.id}`,
        },
      };
    }
    if (!s.practiceStarted) {
      const targetId: KenyaPoiId = 'local_guide';
      return {
        status: 'actionable',
        targetId,
        target: pickTarget(targetId),
        stageLabel: 'PRACTICE',
        reasonKey: 'start_practice',
        message: {
          en: 'Talk to Ranger Amina to start WildSpeak Safari Tour (PRACTICE).',
          th: 'คุยกับอามินาเพื่อเริ่ม WildSpeak Safari Tour (ด่าน PRACTICE)',
        },
      };
    }
    if (!s.practiceCompleted) {
      const nextConv =
        KENYA_PRACTICE_CONVERSATIONS.find((c) => !s.practicedIds.includes(c.id)) ??
        KENYA_PRACTICE_CONVERSATIONS[0];
      const target = pickTarget(nextConv.id);
      return {
        status: 'actionable',
        targetId: nextConv.id,
        target,
        stageLabel: 'PRACTICE',
        reasonKey: 'practice_station',
        message: {
          en: `Guide visitor at ${target?.title.en ?? nextConv.id}`,
          th: `นำเที่ยวที่ ${target?.title.th ?? nextConv.id}`,
        },
      };
    }
    if (!s.performStarted) {
      const targetId: KenyaPoiId = 'local_guide';
      return {
        status: 'actionable',
        targetId,
        target: pickTarget(targetId),
        stageLabel: 'PERFORM',
        reasonKey: 'start_perform',
        message: {
          en: 'Speak with Ranger Amina to begin your Final Wildlife Ambassador Challenge!',
          th: 'คุยกับอามินาเพื่อเริ่มภารกิจสุดท้าย Wildlife Ambassador!',
        },
      };
    }
    if (!s.performCompleted) {
      const targetId: KenyaPoiId = 'conservation_lookout';
      const target = pickTarget(targetId);
      return {
        status: 'actionable',
        targetId,
        target,
        stageLabel: 'PERFORM',
        reasonKey: 'perform_stage',
        message: {
          en: 'Head to Conservation Lookout to deliver your Ambassador Speech!',
          th: 'ไปยังจุดชมวิวอนุรักษ์เพื่อกล่าวสุนทรพจน์ทูตอนุรักษ์!',
        },
      };
    }
    return {
      status: 'country_completed',
      targetId: null,
      target: null,
      stageLabel: 'COMPLETE',
      reasonKey: 'country_completed',
      message: {
        en: 'All Maasai Mara missions complete! Pick any landmark from Places to revisit.',
        th: 'พิชิตภารกิจมาไซมาราครบทุกด่านแล้ว! เลือกจุดหมายเพื่อทบทวนได้ตลอดเวลา',
      },
    };
  }

  // Scotland
  const s = input.state;
  if (!s.countryUnlocked) return mkLocked();
  if (!s.discoverStarted) {
    const targetId: ScotlandPoiId = 'npc_eilidh';
    return {
      status: 'actionable',
      targetId,
      target: pickTarget(targetId),
      stageLabel: 'DISCOVER',
      reasonKey: 'start_discover',
      message: {
        en: 'Talk to Eilidh MacLeod to begin Stage 1: DISCOVER.',
        th: 'คุยกับไอลีด แม็กลอยด์ เพื่อเริ่มด่านที่ 1 DISCOVER',
      },
    };
  }
  if (!s.discoverCompleted) {
    const nextSpot =
      SORTED_SCOTLAND_LANDMARKS.find(
        (l) => !s.discoveredEvidenceIds.includes(l.id),
      ) ?? SORTED_SCOTLAND_LANDMARKS[0];
    const target = pickTarget(nextSpot.id);
    return {
      status: 'actionable',
      targetId: nextSpot.id,
      target,
      stageLabel: 'DISCOVER',
      reasonKey: 'discover_station',
      message: {
        en: `Collect Cultural Evidence at ${target?.title.en ?? nextSpot.id}`,
        th: `เก็บหลักฐานวัฒนธรรมที่ ${target?.title.th ?? nextSpot.id}`,
      },
    };
  }
  if (!s.buildStarted) {
    const targetId: ScotlandPoiId = 'npc_eilidh';
    return {
      status: 'actionable',
      targetId,
      target: pickTarget(targetId),
      stageLabel: 'BUILD',
      reasonKey: 'start_build',
      message: {
        en: 'Talk to Eilidh MacLeod to start Stage 2: BUILD.',
        th: 'คุยกับไอลีดเพื่อเริ่มด่านที่ 2 BUILD',
      },
    };
  }
  if (!s.buildCompleted) {
    const nextBuild =
      SCOTLAND_BUILD_STATIONS.find((st) => !s.builtStationIds.includes(st.id)) ??
      SCOTLAND_BUILD_STATIONS[0];
    const target = pickTarget(nextBuild.id);
    return {
      status: 'actionable',
      targetId: nextBuild.id,
      target,
      stageLabel: 'BUILD',
      reasonKey: 'build_station',
      message: {
        en: `Craft comparison at ${target?.title.en ?? nextBuild.id}`,
        th: `สร้างประโยคเปรียบเทียบที่ ${target?.title.th ?? nextBuild.id}`,
      },
    };
  }
  if (!s.practiceStarted) {
    const targetId: ScotlandPoiId = 'npc_eilidh';
    return {
      status: 'actionable',
      targetId,
      target: pickTarget(targetId),
      stageLabel: 'PRACTICE',
      reasonKey: 'start_practice',
      message: {
        en: 'Talk to Eilidh MacLeod to launch Stage 3: PRACTICE.',
        th: 'คุยกับไอลีดเพื่อเริ่มด่านที่ 3 PRACTICE',
      },
    };
  }
  if (!s.practiceCompleted) {
    const nextPractice =
      SCOTLAND_PRACTICE_MISSIONS.find(
        (m) => !s.practicedStationIds.includes(m.id),
      ) ?? SCOTLAND_PRACTICE_MISSIONS[0];
    const target = pickTarget(nextPractice.id);
    return {
      status: 'actionable',
      targetId: nextPractice.id,
      target,
      stageLabel: 'PRACTICE',
      reasonKey: 'practice_station',
      message: {
        en: `Practice conversation at ${target?.title.en ?? nextPractice.id}`,
        th: `ฝึกบทสนทนาที่ ${target?.title.th ?? nextPractice.id}`,
      },
    };
  }
  if (!s.performStarted || !s.performCompleted) {
    const targetId: ScotlandPoiId = 'lochside_castle_viewpoint';
    const target = pickTarget(targetId);
    return {
      status: 'actionable',
      targetId,
      target,
      stageLabel: 'PERFORM',
      reasonKey: s.performStarted ? 'perform_stage' : 'start_perform',
      message: {
        en: 'Visit Lochside Castle Viewpoint for the Final Cultural Exchange Showcase!',
        th: 'ไปยังจุดชมวิวปราสาทริมทะเลสาบเพื่อนำเสนอ Cultural Exchange รอบสุดท้าย!',
      },
    };
  }
  return {
    status: 'country_completed',
    targetId: null,
    target: null,
    stageLabel: 'COMPLETE',
    reasonKey: 'country_completed',
    message: {
      en: 'All Highland Heroes missions complete! Pick any station from Places to revisit.',
      th: 'พิชิตภารกิจไฮแลนด์ครบทุกด่านแล้ว! เลือกจุดหมายเพื่อทบทวนได้ตลอดเวลา',
    },
  };
}

export function getDestinationStatusTag(
  worldId: NavWorldId,
  targetId: string,
  state: {
    completedIds?: string[];
    visitedIds?: string[];
    nextTargetId?: string | null;
  },
  language: AppLanguage,
): 'next' | 'completed' | 'visited' | 'open' {
  void worldId;
  void language;
  if (state.nextTargetId === targetId) return 'next';
  if (state.completedIds?.includes(targetId)) return 'completed';
  if (state.visitedIds?.includes(targetId)) return 'visited';
  return 'open';
}
