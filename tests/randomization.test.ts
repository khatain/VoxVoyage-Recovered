import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  createIndexedShuffledChoices,
  shuffleArray,
  shuffleDifferentFrom,
  type IndexedShuffledChoice,
} from '../src/utils/shuffle';
import type { LocalizedText } from '../src/types/game';
import {
  checkSentenceOrder,
  createShuffledTiles,
  JAIPUR_SENTENCE_CHALLENGES,
} from '../src/data/jaipurSentenceTrain';
import { KENYA_DISCOVERY_TASKS } from '../src/data/kenyaDiscovery';
import {
  GAME1_EVIDENCE_CARDS,
  GAME1_SENTENCE_PATHS,
  validateGame1Sentence,
} from '../src/data/scotlandBuild';

function makeSeededRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

describe('Fisher-Yates Mini-Game Answer Randomization', () => {
  it('shuffleArray preserves exact multiset without mutating the source array', () => {
    const source = ['alpha', 'beta', 'gamma', 'delta', 'epsilon'] as const;
    const snapshot = [...source];
    const shuffled = shuffleArray(source, makeSeededRng(42));

    assert.deepEqual([...source], snapshot);
    assert.notStrictEqual(shuffled, source);
    assert.deepEqual([...shuffled].sort(), [...source].sort());
  });

  it('shuffleDifferentFrom avoids identical solved order when length > 1', () => {
    const ordered = [1, 2, 3, 4];
    for (let seed = 1; seed <= 25; seed += 1) {
      const result = shuffleDifferentFrom(ordered, (a, b) => a === b, makeSeededRng(seed));
      assert.deepEqual([...result].sort(), ordered);
      assert.notDeepEqual(result, ordered);
    }
  });

  it('produces varied distributions across attempts and supports index-safe validation', () => {
    const elephantTask = KENYA_DISCOVERY_TASKS.find((t) => t.id === 'elephant_grassland');
    if (!elephantTask) {
      throw new Error('Expected elephant_grassland task');
    }

    const seenFirstOriginalIndices = new Set<number>();
    for (let seed = 1; seed <= 40; seed += 1) {
      const indexed: IndexedShuffledChoice<LocalizedText>[] = createIndexedShuffledChoices(
        elephantTask.choices,
        makeSeededRng(seed),
      );
      assert.equal(indexed.length, elephantTask.choices.length);

      seenFirstOriginalIndices.add(indexed[0].originalIndex);

      const correctEntry: IndexedShuffledChoice<LocalizedText> | undefined = indexed.find(
        (entry: IndexedShuffledChoice<LocalizedText>) =>
          entry.originalIndex === elephantTask.correctIndex,
      );
      if (!correctEntry) {
        throw new Error('Expected matching originalIndex choice');
      }
      assert.equal(
        correctEntry.item.en,
        elephantTask.choices[elephantTask.correctIndex].en,
      );
    }

    // Multiple distinct starting indices observed across seeded attempts
    assert.equal(seenFirstOriginalIndices.size > 1, true);
  });

  it('Jaipur Sentence Train shuffles tiles while preserving target validation', () => {
    for (const challenge of JAIPUR_SENTENCE_CHALLENGES) {
      const tiles = createShuffledTiles(challenge, makeSeededRng(101 + challenge.order));
      assert.equal(tiles.length, challenge.words.length);
      assert.deepEqual(
        tiles.map((t) => t.word).sort(),
        [...challenge.words].sort(),
      );
      assert.notDeepEqual(
        tiles.map((t) => t.word),
        challenge.words,
      );
      assert.equal(checkSentenceOrder(challenge.words, challenge), true);
    }
  });

  it('Scotland BUILD shuffled cards and tiles preserve ID/sentence validation regardless of display order', () => {
    const shuffledCards = shuffleArray(GAME1_EVIDENCE_CARDS, makeSeededRng(7));
    const scotlandCard = shuffledCards.find((c) => c.id === 'g1_scotland_village');
    const thaiCard = shuffledCards.find((c) => c.id === 'g1_thailand_square');
    assert.ok(scotlandCard && thaiCard);
    assert.equal(scotlandCard.side, 'scotland');
    assert.equal(thaiCard.side, 'thailand');

    const a2Tiles = shuffleDifferentFrom(
      GAME1_SENTENCE_PATHS.a2.tiles,
      (a, b) => a.id === b.id,
      makeSeededRng(9),
    );
    assert.equal(a2Tiles.length, GAME1_SENTENCE_PATHS.a2.tiles.length);
    const assembledValid = validateGame1Sentence(
      ['Both', 'Thailand', 'and', 'Scotland', 'blend', 'old heritage', 'with modern life.'],
      'a2',
    );
    assert.equal(assembledValid.valid, true);
  });
});
