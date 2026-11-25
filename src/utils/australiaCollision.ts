import {
  AUSTRALIA_BOUNDS,
  AUSTRALIA_BOX_OBSTACLES,
  AUSTRALIA_CIRCLE_OBSTACLES,
  AUSTRALIA_INTERACTIVE_TARGETS,
  type AustraliaInteractiveTarget,
} from '../data/australiaWorld';

export interface AustraliaResolvedPosition {
  x: number;
  z: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Resolves 2D XZ movement across the Sydney Harbour waterfront promenade and city plazas,
 * sliding smoothly along transit buildings, café stalls, kiosks, planters, trees, benches,
 * harbour seawall boundaries, and NPC personal spaces.
 */
export function resolveAustraliaCollision(
  nextX: number,
  nextZ: number,
  playerRadius = AUSTRALIA_BOUNDS.playerRadius,
): AustraliaResolvedPosition {
  let x = clamp(
    nextX,
    AUSTRALIA_BOUNDS.minX + playerRadius,
    AUSTRALIA_BOUNDS.maxX - playerRadius,
  );
  let z = clamp(
    nextZ,
    AUSTRALIA_BOUNDS.minZ + playerRadius,
    AUSTRALIA_BOUNDS.maxZ - playerRadius,
  );

  for (let pass = 0; pass < 2; pass++) {
    for (const box of AUSTRALIA_BOX_OBSTACLES) {
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

    for (const circle of AUSTRALIA_CIRCLE_OBSTACLES) {
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
      AUSTRALIA_BOUNDS.minX + playerRadius,
      AUSTRALIA_BOUNDS.maxX - playerRadius,
    );
    z = clamp(
      z,
      AUSTRALIA_BOUNDS.minZ + playerRadius,
      AUSTRALIA_BOUNDS.maxZ - playerRadius,
    );
  }

  return { x, z };
}

/**
 * Returns the nearest interactive POI (4 Sydney NPCs or 5 Harbour landmarks)
 * whose trigger radius contains (x, z), or null if none is nearby.
 */
export function findNearestAustraliaPoi(
  x: number,
  z: number,
): AustraliaInteractiveTarget | null {
  let best: AustraliaInteractiveTarget | null = null;
  let bestDist = Infinity;

  for (const poi of AUSTRALIA_INTERACTIVE_TARGETS) {
    const dist = Math.hypot(x - poi.position.x, z - poi.position.z);
    if (dist <= poi.interactionRadius && dist < bestDist) {
      bestDist = dist;
      best = poi;
    }
  }

  return best;
}
