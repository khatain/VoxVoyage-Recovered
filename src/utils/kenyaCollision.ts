import {
  KENYA_BOUNDS,
  KENYA_BOX_OBSTACLES,
  KENYA_CIRCLE_OBSTACLES,
  KENYA_INTERACTIVE_TARGETS,
  type KenyaInteractiveTarget,
} from '../data/kenyaWorld';

export interface ResolvedPosition {
  x: number;
  z: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Resolves 2D XZ movement inside the walkable Maasai Mara savanna reserve,
 * sliding cleanly along bounding borders, tents, safari jeep, watering hole shore,
 * wildlife personal spaces, acacia trunks, and conservation lookout stilts.
 */
export function resolveKenyaCollision(
  nextX: number,
  nextZ: number,
  playerRadius = KENYA_BOUNDS.playerRadius,
  extraCircles: { x: number; z: number; radius: number }[] = [],
): ResolvedPosition {
  let x = clamp(
    nextX,
    KENYA_BOUNDS.minX + playerRadius,
    KENYA_BOUNDS.maxX - playerRadius,
  );
  let z = clamp(
    nextZ,
    KENYA_BOUNDS.minZ + playerRadius,
    KENYA_BOUNDS.maxZ - playerRadius,
  );

  // Two relaxation passes ensure smooth corner sliding between adjacent savanna props
  for (let pass = 0; pass < 2; pass++) {
    for (const box of KENYA_BOX_OBSTACLES) {
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

    for (const circle of KENYA_CIRCLE_OBSTACLES) {
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

    for (const circle of extraCircles) {
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
      KENYA_BOUNDS.minX + playerRadius,
      KENYA_BOUNDS.maxX - playerRadius,
    );
    z = clamp(
      z,
      KENYA_BOUNDS.minZ + playerRadius,
      KENYA_BOUNDS.maxZ - playerRadius,
    );
  }

  return { x, z };
}

/**
 * Returns the nearest interactive POI (Amina Odhiambo or 5 safari landmarks)
 * whose trigger radius contains (x, z), or null if none is nearby.
 */
export function findNearestKenyaPoi(
  x: number,
  z: number,
): KenyaInteractiveTarget | null {
  let best: KenyaInteractiveTarget | null = null;
  let bestDist = Infinity;

  for (const poi of KENYA_INTERACTIVE_TARGETS) {
    const dist = Math.hypot(x - poi.position.x, z - poi.position.z);
    if (dist <= poi.interactionRadius && dist < bestDist) {
      bestDist = dist;
      best = poi;
    }
  }

  return best;
}
