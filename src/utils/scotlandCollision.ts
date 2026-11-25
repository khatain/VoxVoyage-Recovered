import {
  SCOTLAND_BOUNDS,
  SCOTLAND_BOX_OBSTACLES,
  SCOTLAND_CIRCLE_OBSTACLES,
  SCOTLAND_INTERACTIVE_TARGETS,
  type ScotlandInteractiveTarget,
} from '../data/scotlandWorld';

export interface ScotlandResolvedPosition {
  x: number;
  z: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Resolves 2D XZ movement inside the Highland village & lochside reserve,
 * sliding cleanly along stone cottages, workshop rack, market stalls, festival stage,
 * bridge parapets, Highland burn banks, fountain basin, trees, and NPC personal spaces.
 */
export function resolveScotlandCollision(
  nextX: number,
  nextZ: number,
  playerRadius = SCOTLAND_BOUNDS.playerRadius,
): ScotlandResolvedPosition {
  let x = clamp(
    nextX,
    SCOTLAND_BOUNDS.minX + playerRadius,
    SCOTLAND_BOUNDS.maxX - playerRadius,
  );
  let z = clamp(
    nextZ,
    SCOTLAND_BOUNDS.minZ + playerRadius,
    SCOTLAND_BOUNDS.maxZ - playerRadius,
  );

  for (let pass = 0; pass < 2; pass++) {
    for (const box of SCOTLAND_BOX_OBSTACLES) {
      const closestX = clamp(x, box.minX, box.maxX);
      const closestZ = clamp(z, box.minZ, box.maxZ);
      const dx = x - closestX;
      const dz = z - closestZ;
      const distSq = dx * dx + dz * dz;

      if (distSq < playerRadius * playerRadius) {
        if (distSq > 1e-6) {
          const dist = Math.sqrt(distSq);
          const push = playerRadius - dist;
          x += (dx / dist) * push;
          z += (dz / dist) * push;
        } else {
          const leftPen = Math.abs(x - box.minX);
          const rightPen = Math.abs(box.maxX - x);
          const topPen = Math.abs(z - box.minZ);
          const botPen = Math.abs(box.maxZ - z);
          const minPen = Math.min(leftPen, rightPen, topPen, botPen);
          if (minPen === leftPen) x = box.minX - playerRadius;
          else if (minPen === rightPen) x = box.maxX + playerRadius;
          else if (minPen === topPen) z = box.minZ - playerRadius;
          else z = box.maxZ + playerRadius;
        }
      }
    }

    for (const circle of SCOTLAND_CIRCLE_OBSTACLES) {
      const minDist = circle.radius + playerRadius;
      const dx = x - circle.x;
      const dz = z - circle.z;
      const distSq = dx * dx + dz * dz;
      if (distSq < minDist * minDist) {
        if (distSq > 1e-6) {
          const dist = Math.sqrt(distSq);
          const push = minDist - dist;
          x += (dx / dist) * push;
          z += (dz / dist) * push;
        } else {
          z = circle.z + minDist;
        }
      }
    }

    x = clamp(
      x,
      SCOTLAND_BOUNDS.minX + playerRadius,
      SCOTLAND_BOUNDS.maxX - playerRadius,
    );
    z = clamp(
      z,
      SCOTLAND_BOUNDS.minZ + playerRadius,
      SCOTLAND_BOUNDS.maxZ - playerRadius,
    );
  }

  return { x, z };
}

/**
 * Returns the nearest interactive POI (Eilidh MacLeod, Fiona Campbell, or 5 Highland landmarks)
 * whose trigger radius contains (x, z), or null if none is nearby.
 */
export function findNearestScotlandPoi(
  x: number,
  z: number,
): ScotlandInteractiveTarget | null {
  let best: ScotlandInteractiveTarget | null = null;
  let bestDist = Infinity;

  for (const poi of SCOTLAND_INTERACTIVE_TARGETS) {
    const dist = Math.hypot(x - poi.position.x, z - poi.position.z);
    if (dist <= poi.interactionRadius && dist < bestDist) {
      bestDist = dist;
      best = poi;
    }
  }

  return best;
}
