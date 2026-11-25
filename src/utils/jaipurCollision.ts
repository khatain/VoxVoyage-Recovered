import {
  JAIPUR_BOUNDS,
  JAIPUR_BOX_OBSTACLES,
  JAIPUR_CIRCLE_OBSTACLES,
  JAIPUR_INTERACTIVE_TARGETS,
  type JaipurInteractiveTarget,
} from '../data/jaipurWorld';

export interface PlayerPosition2D {
  x: number;
  z: number;
}

/**
 * Resolves 2D circle-vs-bounds, circle-vs-AABB, and circle-vs-circle collisions
 * for the walkable Jaipur plaza, pushing the player out smoothly along edges.
 */
export function resolveJaipurCollision(
  nextX: number,
  nextZ: number,
  radius = JAIPUR_BOUNDS.playerRadius,
): PlayerPosition2D {
  let x = Math.max(JAIPUR_BOUNDS.minX + radius, Math.min(JAIPUR_BOUNDS.maxX - radius, nextX));
  let z = Math.max(JAIPUR_BOUNDS.minZ + radius, Math.min(JAIPUR_BOUNDS.maxZ - radius, nextZ));

  // Run 2 relaxation passes for smooth corner sliding when touching two obstacles
  for (let pass = 0; pass < 2; pass++) {
    for (const box of JAIPUR_BOX_OBSTACLES) {
      const closestX = Math.max(box.minX, Math.min(x, box.maxX));
      const closestZ = Math.max(box.minZ, Math.min(z, box.maxZ));
      const dx = x - closestX;
      const dz = z - closestZ;
      const distSq = dx * dx + dz * dz;

      if (distSq < radius * radius) {
        if (distSq > 0.00001) {
          const dist = Math.sqrt(distSq);
          const overlap = radius - dist;
          x += (dx / dist) * overlap;
          z += (dz / dist) * overlap;
        } else {
          // Center inside AABB: push out along nearest face
          const leftPen = Math.abs(x - box.minX);
          const rightPen = Math.abs(box.maxX - x);
          const topPen = Math.abs(z - box.minZ);
          const bottomPen = Math.abs(box.maxZ - z);
          const minPen = Math.min(leftPen, rightPen, topPen, bottomPen);
          if (minPen === leftPen) x = box.minX - radius;
          else if (minPen === rightPen) x = box.maxX + radius;
          else if (minPen === topPen) z = box.minZ - radius;
          else z = box.maxZ + radius;
        }
      }
    }

    for (const circle of JAIPUR_CIRCLE_OBSTACLES) {
      const dx = x - circle.x;
      const dz = z - circle.z;
      const minDist = circle.radius + radius;
      const distSq = dx * dx + dz * dz;
      if (distSq < minDist * minDist) {
        const dist = Math.max(0.0001, Math.sqrt(distSq));
        const overlap = minDist - dist;
        x += (dx / dist) * overlap;
        z += (dz / dist) * overlap;
      }
    }

    x = Math.max(JAIPUR_BOUNDS.minX + radius, Math.min(JAIPUR_BOUNDS.maxX - radius, x));
    z = Math.max(JAIPUR_BOUNDS.minZ + radius, Math.min(JAIPUR_BOUNDS.maxZ - radius, z));
  }

  return { x, z };
}

export function findNearestInteractivePoi(
  x: number,
  z: number,
): JaipurInteractiveTarget | null {
  let nearest: JaipurInteractiveTarget | null = null;
  let bestDistSq = Infinity;

  for (const poi of JAIPUR_INTERACTIVE_TARGETS) {
    const dx = x - poi.position.x;
    const dz = z - poi.position.z;
    const distSq = dx * dx + dz * dz;
    if (distSq <= poi.interactionRadius * poi.interactionRadius && distSq < bestDistSq) {
      bestDistSq = distSq;
      nearest = poi;
    }
  }

  return nearest;
}
