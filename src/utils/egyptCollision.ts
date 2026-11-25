import {
  EGYPT_BOUNDS,
  EGYPT_BOX_OBSTACLES,
  EGYPT_CIRCLE_OBSTACLES,
  EGYPT_INTERACTIVE_TARGETS,
  type EgyptInteractiveTarget,
} from '../data/egyptWorld';

export interface EgyptResolvedPosition {
  x: number;
  z: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Resolves 2D XZ movement across the Nile Expedition Camp, Giza Pyramid Plaza,
 * Ancient Scribe Workshop, Temple of the Sun, and Chamber of Wisdom forecourt,
 * preventing clipping through monuments, tents, sealed doors, palms, and Nile water.
 */
export function resolveEgyptCollision(
  nextX: number,
  nextZ: number,
  playerRadius = EGYPT_BOUNDS.playerRadius,
): EgyptResolvedPosition {
  let x = clamp(
    nextX,
    EGYPT_BOUNDS.minX + playerRadius,
    EGYPT_BOUNDS.maxX - playerRadius,
  );
  let z = clamp(
    nextZ,
    EGYPT_BOUNDS.minZ + playerRadius,
    EGYPT_BOUNDS.maxZ - playerRadius,
  );

  for (let pass = 0; pass < 2; pass++) {
    for (const box of EGYPT_BOX_OBSTACLES) {
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

    for (const circle of EGYPT_CIRCLE_OBSTACLES) {
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
      EGYPT_BOUNDS.minX + playerRadius,
      EGYPT_BOUNDS.maxX - playerRadius,
    );
    z = clamp(
      z,
      EGYPT_BOUNDS.minZ + playerRadius,
      EGYPT_BOUNDS.maxZ - playerRadius,
    );
  }

  return { x, z };
}

/**
 * Returns the nearest interactive Egypt POI (4 NPCs or 5 landmarks)
 * whose trigger radius contains (x, z), or null if none is nearby.
 */
export function findNearestEgyptPoi(
  x: number,
  z: number,
): EgyptInteractiveTarget | null {
  let best: EgyptInteractiveTarget | null = null;
  let bestDist = Infinity;

  for (const poi of EGYPT_INTERACTIVE_TARGETS) {
    const dist = Math.hypot(x - poi.position.x, z - poi.position.z);
    if (dist <= poi.interactionRadius && dist < bestDist) {
      bestDist = dist;
      best = poi;
    }
  }

  return best;
}
