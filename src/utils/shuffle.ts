/**
 * Unbiased Fisher–Yates (Knuth) shuffle utilities for VoxVoyage mini-games.
 * Designed for use across India, Kenya, Scotland, and upcoming Australia/Egypt chapters.
 */

export function shuffleArray<T>(
  items: readonly T[],
  rng: () => number = Math.random,
): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Shuffles items using Fisher–Yates and ensures that when items.length > 1,
 * the resulting array does not accidentally match the original solved order.
 */
export function shuffleDifferentFrom<T>(
  items: readonly T[],
  isSameItem: (a: T, b: T) => boolean = (a, b) => a === b,
  rng: () => number = Math.random,
): T[] {
  if (items.length <= 1) return [...items];
  const shuffled = shuffleArray(items, rng);
  const allDistinct = items.every((item, idx) => isSameItem(item, shuffled[idx]));
  if (allDistinct) {
    // Check if there exists at least one position we can swap to break original order cleanly
    const firstDiffIdx = shuffled.findIndex((item) => !isSameItem(item, items[0]));
    if (firstDiffIdx > 0) {
      [shuffled[0], shuffled[firstDiffIdx]] = [shuffled[firstDiffIdx], shuffled[0]];
    } else {
      const shifted = shuffled.shift();
      if (shifted !== undefined) shuffled.push(shifted);
    }
  }
  return shuffled;
}

export interface IndexedShuffledChoice<T> {
  item: T;
  originalIndex: number;
}

/**
 * Preserves each option's canonical originalIndex while shuffling display order,
 * allowing index-based answer keys to validate strictly by originalIndex rather than display position.
 */
export function createIndexedShuffledChoices<T>(
  items: readonly T[],
  rng: () => number = Math.random,
): IndexedShuffledChoice<T>[] {
  return shuffleArray(
    items.map((item, originalIndex) => ({ item, originalIndex })),
    rng,
  );
}
