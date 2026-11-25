import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import type {
  AustraliaPerformChallengeRecord,
  AustraliaSpeakingEvidenceRecord,
  EgyptInstructionJournalRecord,
  ScotlandSpeakingReflectionState,
} from '../src/types/game';
import {
  ARCHITECT_BOARD_COLS,
  ARCHITECT_BOARD_LANDMARKS,
  ARCHITECT_BOARD_ROWS,
  ARCHITECT_DEFAULT_BLOCKED_CELLS,
  EGYPT_BUILD_MISSION_ORDER,
  EGYPT_BUILD_XP_REWARD,
  GAME_ID_BY_LANDMARK,
  PYRAMID_ROUTE_ARCHITECT_CHALLENGES,
  SKILL_CATEGORY_BY_GAME_ID,
  getEgyptBuildGameChallengeIds,
  makeEgyptJournalRecordId,
  simulateArchitectRoute,
  validatePyramidRouteArchitectSubmission,
  type RouteArchitectVariant,
} from '../src/data/egyptBuild';
import {
  AUSTRALIA_MISSION_ID,
  AUSTRALIA_PASSPORT_STAMP_ID,
} from '../src/data/australiaWorld';
import { AUSTRALIA_DISCOVER_MISSION_ORDER } from '../src/data/australiaDiscovery';
import { AUSTRALIA_BUILD_MISSION_ORDER } from '../src/data/australiaBuild';
import {
  AUSTRALIA_PRACTICE_MISSION_ORDER,
  getAustraliaPracticeMissionSpec,
} from '../src/data/australiaPractice';
import {
  AUSTRALIA_PERFORM_CHALLENGE_ORDER,
  getAustraliaPerformChallengeSpec,
} from '../src/data/australiaPerform';
import { JAIPUR_VOCAB_OBJECTS } from '../src/data/jaipurWorld';
import { KENYA_DISCOVERY_TASKS } from '../src/data/kenyaDiscovery';
import { KENYA_BUILD_STATIONS } from '../src/data/kenyaBuild';
import { KENYA_PRACTICE_CONVERSATIONS } from '../src/data/kenyaPractice';
import { SCOTLAND_EVIDENCE_ITEMS } from '../src/data/scotlandDiscovery';
import { SCOTLAND_BUILD_STATIONS } from '../src/data/scotlandBuild';
import { SCOTLAND_PRACTICE_MISSIONS } from '../src/data/scotlandPractice';
import {
  createEmptyScotlandPerformOutline,
  SCOTLAND_PERFORM_EVIDENCE_TOPICS,
  SCOTLAND_PERFORM_REFLECTION_ITEMS,
} from '../src/data/scotlandPerform';
import { EGYPT_DISCOVER_MISSION_ORDER } from '../src/data/egyptDiscover';
import { EGYPT_MISSION_ID } from '../src/data/egyptWorld';
import {
  collectJaipurVocabObject,
  completeAustraliaBuildMission,
  completeAustraliaDiscoveryMission,
  completeAustraliaPerformChallenge,
  completeAustraliaPerformMission,
  completeAustraliaPracticeMission,
  completeEgyptBuildMission,
  completeEgyptDiscoveryMission,
  completeJaipurFinalShowcase,
  completeJaipurSentenceTrain,
  completeJaipurSpotAndSpeakObject,
  completeKenyaBuildStation,
  completeKenyaDiscoverySpot,
  completeKenyaFinalPerform,
  completeKenyaPracticeConversation,
  completeScotlandBuildStation,
  completeScotlandDiscoveryStation,
  completeScotlandPerformMission,
  completeScotlandPracticeStation,
  createDefaultProgress,
  isAustraliaMissionCompleted,
  isAustraliaPerformCompleted,
  isEgyptBuildCompleted,
  isEgyptPracticeUnlocked,
  isEgyptUnlocked,
  markScotlandNpcMet,
  recordEgyptBuildChallenge,
  startAustraliaBuildMission,
  startAustraliaDiscoveryMission,
  startAustraliaPerformMission,
  startAustraliaPracticeMission,
  startEgyptBuildMission,
  startEgyptDiscoveryMission,
  startJaipurSpotAndSpeak,
  startKenyaBuildMission,
  startKenyaDiscoveryMission,
  startKenyaPerformMission,
  startKenyaPracticeMission,
  startScotlandBuildMission,
  startScotlandDiscoveryMission,
  startScotlandPerformMission,
  startScotlandPracticeMission,
} from '../src/utils/progressStorage';

function completeCountriesUpToAustraliaPerform4of5() {
  let p = createDefaultProgress();

  // India (250 XP)
  for (const obj of JAIPUR_VOCAB_OBJECTS) {
    p = collectJaipurVocabObject(p, obj.id);
  }
  p = completeJaipurSentenceTrain(p);
  p = startJaipurSpotAndSpeak(p);
  for (const obj of JAIPUR_VOCAB_OBJECTS) {
    p = completeJaipurSpotAndSpeakObject(p, obj.id);
  }
  p = completeJaipurFinalShowcase(p);

  // Kenya (250 XP)
  p = startKenyaDiscoveryMission(p);
  for (const task of KENYA_DISCOVERY_TASKS) {
    p = completeKenyaDiscoverySpot(p, task.id);
  }
  p = startKenyaBuildMission(p);
  for (const st of KENYA_BUILD_STATIONS) {
    p = completeKenyaBuildStation(p, st.id, st.modelSentenceA2.en);
  }
  p = startKenyaPracticeMission(p);
  for (const conv of KENYA_PRACTICE_CONVERSATIONS) {
    p = completeKenyaPracticeConversation(p, conv.id);
  }
  p = startKenyaPerformMission(p);
  p = completeKenyaFinalPerform(p);

  // Scotland (250 XP)
  p = markScotlandNpcMet(p, 'eilidh');
  p = startScotlandDiscoveryMission(p);
  for (const ev of SCOTLAND_EVIDENCE_ITEMS) {
    p = completeScotlandDiscoveryStation(p, ev.id);
  }
  p = startScotlandBuildMission(p);
  for (const st of SCOTLAND_BUILD_STATIONS) {
    p = completeScotlandBuildStation(p, st.id, st.modelSentence);
  }
  p = startScotlandPracticeMission(p);
  const scoReflection: ScotlandSpeakingReflectionState = {
    practiceMode: 'self_reported_no_mic',
    checks: {
      comparedCultures: true,
      usedSpecificExample: true,
      explainedSimilarityOrDifference: true,
      spokeClearly: true,
    },
    followUpPracticed: true,
    completedAt: '2026-01-01T00:00:00.000Z',
  };
  for (const m of SCOTLAND_PRACTICE_MISSIONS) {
    p = completeScotlandPracticeStation(p, m.id, scoReflection);
  }
  p = startScotlandPerformMission(p);
  const outline = createEmptyScotlandPerformOutline();
  outline.introduction = 'Today I compare Scotland and Thailand.';
  outline.similarity = 'Both cultures welcome visitors warmly.';
  outline.difference = 'Scotland has cool castles while Thailand has tropical temples.';
  outline.evidenceNotes = 'Tartan weaving and Thai silk patterns both tell stories.';
  outline.conclusion = 'Both traditions celebrate craft and hospitality.';
  const reflectionDone: Record<(typeof SCOTLAND_PERFORM_REFLECTION_ITEMS)[number]['key'], boolean> = {
    introducedComparison: true,
    explainedSimilarity: true,
    explainedDifference: true,
    usedSpecificExamples: true,
    answeredBothQuestions: true,
    spokeClearlyConfidently: true,
  };
  p = completeScotlandPerformMission(p, {
    selectedEvidenceIds: [
      SCOTLAND_PERFORM_EVIDENCE_TOPICS[0].id,
      SCOTLAND_PERFORM_EVIDENCE_TOPICS[1].id,
    ],
    outline,
    speechPracticeMode: 'self_reported_no_mic',
    questionPracticeStates: {
      qa_eilidh: 'self_reported_no_mic',
      qa_fiona: 'self_reported_no_mic',
    },
    reflectionState: {
      checks: reflectionDone,
      completedAt: '2026-01-01T00:00:00.000Z',
    },
  });

  // Australia up to 4/5 Perform challenges (before mandatory 5th Self-Reflection)
  p = startAustraliaDiscoveryMission(p);
  for (const lmId of AUSTRALIA_DISCOVER_MISSION_ORDER) {
    p = completeAustraliaDiscoveryMission(p, lmId);
  }
  p = startAustraliaBuildMission(p);
  for (const lmId of AUSTRALIA_BUILD_MISSION_ORDER) {
    p = completeAustraliaBuildMission(p, lmId, `Dialogue built for ${lmId}.`);
  }
  p = startAustraliaPracticeMission(p);
  for (const lmId of AUSTRALIA_PRACTICE_MISSION_ORDER) {
    const spec = getAustraliaPracticeMissionSpec(lmId)!;
    const record: AustraliaSpeakingEvidenceRecord = {
      practiceMode: 'microphone_recording',
      completedTurnIds: spec.turns.map((t) => t.turnId),
      reflectionChecks: {
        askedClearQuestion: true,
        respondedToNpc: true,
        usedPoliteExpression: true,
        checkedOrClarifiedMeaning: lmId === 'harbour_gardens_help_point',
      },
      difficultyUsed: 'a2',
      completedAt: '2026-11-23T09:00:00.000Z',
    };
    p = completeAustraliaPracticeMission(p, lmId, record);
  }
  p = startAustraliaPerformMission(p);
  for (const lmId of AUSTRALIA_PERFORM_CHALLENGE_ORDER.slice(0, 4)) {
    const spec = getAustraliaPerformChallengeSpec(lmId)!;
    const record: AustraliaPerformChallengeRecord = {
      practiceMode: 'microphone_recording',
      completedTurnIds: spec.turns.map((t) => t.turnId),
      difficultyUsed: 'a2',
      usedScriptPreview: false,
      completedAt: '2026-11-23T15:00:00.000Z',
    };
    p = completeAustraliaPerformChallenge(p, lmId, record);
  }
  return p;
}

function makeSandboxVariant(
  overrides: Partial<RouteArchitectVariant> = {},
): RouteArchitectVariant {
  return {
    mode: 'a2',
    missionGoal: { en: 'Sandbox test', th: 'ทดสอบ' },
    startPos: { x: 2, y: 2, facing: 'N' },
    targetPos: { x: 2, y: 0 },
    requiredWaypoints: [],
    targetLandmarkId: 'pyramid_north',
    blockedCells: ARCHITECT_DEFAULT_BLOCKED_CELLS,
    tiles: [],
    acceptedPatterns: [/^walk/i],
    canonicalModel: 'Walk one block.',
    thaiScaffold: 'เดินหนึ่งช่อง',
    hints: {
      tier1Structure: { en: '1', th: '1' },
      tier2Focus: { en: '2', th: '2' },
      tier3Scaffold: { en: '3', th: '3' },
    },
    ...overrides,
  };
}

describe('Egypt Phase 5C.1 — Pyramid Route Architect Regression Suite', () => {
  it('1. enforces 6x4 2D grid dimensions, anchored .gitignore /build/, and explicit CSS Grid styling', () => {
    assert.equal(ARCHITECT_BOARD_COLS, 6);
    assert.equal(ARCHITECT_BOARD_ROWS, 4);
    assert.equal(ARCHITECT_BOARD_LANDMARKS.length, 7);

    const root = process.cwd();
    const gitignore = fs.readFileSync(path.join(root, '.gitignore'), 'utf8');
    const lines = gitignore.split(/\r?\n/).map((l) => l.trim());
    assert.equal(
      lines.includes('build/'),
      false,
      '.gitignore must NOT contain unanchored build/ which blinds Tailwind CSS scanner on src/components/egypt/build/',
    );
    assert.equal(lines.includes('/build/'), true);

    const componentSrc = fs.readFileSync(
      path.join(root, 'src/components/egypt/build/PyramidRouteArchitectGame.tsx'),
      'utf8',
    );
    assert.equal(componentSrc.includes('grid-cols-6'), true);
    assert.equal(componentSrc.includes('grid-rows-4'), true);
    assert.equal(componentSrc.includes('aspect-[3/2]'), true);
    assert.equal(componentSrc.includes('gridTemplateColumns'), true);
    assert.equal(componentSrc.includes('gridTemplateRows'), true);
    assert.equal(componentSrc.includes('aspectRatio'), true);
  });

  it('2. simulates North, East, South, and West movement accurately', () => {
    const north = simulateArchitectRoute(
      makeSandboxVariant({ startPos: { x: 2, y: 2, facing: 'N' }, targetPos: { x: 2, y: 0 } }),
      'Walk straight north two blocks',
    );
    assert.deepEqual(north.finalPos, { x: 2, y: 0 });
    assert.equal(north.finalFacing, 'N');
    assert.equal(north.reachedEnd, true);

    const east = simulateArchitectRoute(
      makeSandboxVariant({ startPos: { x: 0, y: 3, facing: 'N' }, targetPos: { x: 3, y: 3 } }),
      'Walk east three blocks',
    );
    assert.deepEqual(east.finalPos, { x: 3, y: 3 });
    assert.equal(east.finalFacing, 'E');
    assert.equal(east.reachedEnd, true);

    const south = simulateArchitectRoute(
      makeSandboxVariant({ startPos: { x: 0, y: 0, facing: 'E' }, targetPos: { x: 0, y: 2 } }),
      'Walk south two blocks',
    );
    assert.deepEqual(south.finalPos, { x: 0, y: 2 });
    assert.equal(south.finalFacing, 'S');
    assert.equal(south.reachedEnd, true);

    const west = simulateArchitectRoute(
      makeSandboxVariant({ startPos: { x: 4, y: 0, facing: 'N' }, targetPos: { x: 1, y: 0 } }),
      'Walk west three blocks',
    );
    assert.deepEqual(west.finalPos, { x: 1, y: 0 });
    assert.equal(west.finalFacing, 'W');
    assert.equal(west.reachedEnd, true);
  });

  it('3. handles turning left and right across all headings', () => {
    const leftLoop = simulateArchitectRoute(
      makeSandboxVariant({ startPos: { x: 2, y: 2, facing: 'N' }, targetPos: { x: 2, y: 2 } }),
      'Walk turn left, turn left, turn left',
    );
    assert.equal(leftLoop.finalFacing, 'E');

    const rightTurn = simulateArchitectRoute(
      makeSandboxVariant({ startPos: { x: 2, y: 2, facing: 'N' }, targetPos: { x: 2, y: 3 } }),
      'Walk turn right, turn right, and walk one block',
    );
    assert.equal(rightTurn.finalFacing, 'S');
    assert.deepEqual(rightTurn.finalPos, { x: 2, y: 3 });
    assert.equal(rightTurn.reachedEnd, true);
  });

  it('4. supports multi-block movement up to 6 blocks', () => {
    const fiveEast = simulateArchitectRoute(
      makeSandboxVariant({ startPos: { x: 0, y: 3, facing: 'E' }, targetPos: { x: 5, y: 3 } }),
      'Walk five blocks',
    );
    assert.deepEqual(fiveEast.finalPos, { x: 5, y: 3 });
    assert.equal(fiveEast.reachedEnd, true);

    const fourWest = simulateArchitectRoute(
      makeSandboxVariant({ startPos: { x: 5, y: 0, facing: 'W' }, targetPos: { x: 1, y: 0 } }),
      'Walk four blocks',
    );
    assert.deepEqual(fourWest.finalPos, { x: 1, y: 0 });
    assert.equal(fourWest.reachedEnd, true);
  });

  it('5. detects obstacle collisions against blocked sand dunes', () => {
    const ch4 = PYRAMID_ROUTE_ARCHITECT_CHALLENGES[3].a2;
    const hitDune = simulateArchitectRoute(
      ch4,
      'Walk north two blocks, turn right, and go one block to the Great Pyramid',
    );
    assert.equal(hitDune.hitBlocked, true);
    assert.equal(hitDune.validRoute, false);
    assert.equal(hitDune.failureReasonKey, 'hit_blocked');
  });

  it('6. enforces board boundaries cleanly without disappearing off-map', () => {
    const ch3 = PYRAMID_ROUTE_ARCHITECT_CHALLENGES[2].a2;
    const walkedOffSouth = simulateArchitectRoute(
      ch3,
      'Walk straight four blocks past the Shade Oasis, turn right, and go two blocks to the Information Point',
    );
    assert.equal(walkedOffSouth.outOfBounds, true);
    assert.equal(walkedOffSouth.validRoute, false);
    assert.equal(walkedOffSouth.failureReasonKey, 'out_of_bounds');
  });

  it('7. approves exact destination with required waypoints and valid grammar', () => {
    const ch2 = PYRAMID_ROUTE_ARCHITECT_CHALLENGES[1].a2;
    const res = simulateArchitectRoute(ch2, ch2.canonicalModel);
    assert.equal(res.reachedEnd, true);
    assert.equal(res.validRoute, true);
    assert.equal(res.validGrammar, true);
    assert.equal(res.hitBlocked, false);
    assert.equal(res.outOfBounds, false);
  });

  it('8. rejects wrong destinations, missed waypoints, and incomplete phrases', () => {
    const ch6b1 = PYRAMID_ROUTE_ARCHITECT_CHALLENGES[5].b1;
    const wrongStop = simulateArchitectRoute(
      ch6b1,
      'First, walk two blocks past the Great Pyramid to the north corner, then turn left and go one block to stop beside the Viewing Platform.',
    );
    assert.equal(wrongStop.validRoute, false);
    assert.equal(wrongStop.reachedEnd, false);
    assert.equal(wrongStop.failureReasonKey, 'wrong_destination');

    const missedWaypoint = simulateArchitectRoute(
      makeSandboxVariant({
        startPos: { x: 0, y: 0, facing: 'E' },
        targetPos: { x: 4, y: 0 },
        requiredWaypoints: ['sphinx'],
        acceptedPatterns: [/^walk\s+east\s+four\s+blocks$/i],
      }),
      'Walk east four blocks',
    );
    assert.equal(missedWaypoint.reachedEnd, true);
    assert.equal(missedWaypoint.validRoute, false);
    assert.equal(missedWaypoint.failureReasonKey, 'missed_waypoint');

    const incompleteGrammar = simulateArchitectRoute(
      PYRAMID_ROUTE_ARCHITECT_CHALLENGES[0].a2,
      'Walk north three blocks',
    );
    assert.equal(incompleteGrammar.reachedEnd, true);
    assert.equal(incompleteGrammar.validGrammar, false);
    assert.equal(incompleteGrammar.validGrammar && incompleteGrammar.validRoute, false);
    assert.equal(incompleteGrammar.failureReasonKey, 'incomplete_phrase');
  });

  it('9. verifies all 6 A2 challenges + Challenge 1 alternative phrasing are solvable', () => {
    for (const bundle of PYRAMID_ROUTE_ARCHITECT_CHALLENGES) {
      const res = simulateArchitectRoute(bundle.a2, bundle.a2.canonicalModel);
      assert.equal(res.validGrammar, true, `A2 grammar failed: ${bundle.challengeId}`);
      assert.equal(res.validRoute, true, `A2 route failed: ${bundle.challengeId}`);
      assert.equal(res.reachedEnd, true, `A2 target failed: ${bundle.challengeId}`);
    }

    const altA2 = validatePyramidRouteArchitectSubmission(
      PYRAMID_ROUTE_ARCHITECT_CHALLENGES[0].a2,
      ['Walk straight', 'three blocks', 'north', 'and', 'stop', 'beside the', 'Viewing Platform'],
    );
    assert.equal(altA2.validGrammar, true);
    assert.equal(altA2.validRoute, true);
  });

  it('10. verifies all 6 B1 challenges + Challenge 1 alternative phrasing are solvable', () => {
    for (const bundle of PYRAMID_ROUTE_ARCHITECT_CHALLENGES) {
      const res = simulateArchitectRoute(bundle.b1, bundle.b1.canonicalModel);
      assert.equal(res.validGrammar, true, `B1 grammar failed: ${bundle.challengeId}`);
      assert.equal(res.validRoute, true, `B1 route failed: ${bundle.challengeId}`);
      assert.equal(res.reachedEnd, true, `B1 target failed: ${bundle.challengeId}`);
    }

    const altB1 = validatePyramidRouteArchitectSubmission(
      PYRAMID_ROUTE_ARCHITECT_CHALLENGES[0].b1,
      ['Head straight', 'three blocks', 'north', 'past the', 'Viewing Platform,', 'then', 'stop', 'at the north corner'],
    );
    assert.equal(altB1.validGrammar, true);
    assert.equal(altB1.validRoute, true);
  });

  it('11. removes raw (x, y) coordinates from mission goals & wrong-destination copy and exposes Undo/Reset/Retry/chip-remove', () => {
    for (const bundle of PYRAMID_ROUTE_ARCHITECT_CHALLENGES) {
      for (const variant of [bundle.a2, bundle.b1]) {
        assert.equal(/\(\d+\s*,\s*\d+\)/.test(variant.missionGoal.en), false);
        assert.equal(/\(\d+\s*,\s*\d+\)/.test(variant.missionGoal.th), false);
        assert.equal(/\(\d+\s*,\s*\d+\)/.test(variant.hints.tier1Structure.en), false);
        assert.equal(/\(\d+\s*,\s*\d+\)/.test(variant.hints.tier2Focus.en), false);
      }
    }

    const wrongDest = simulateArchitectRoute(
      PYRAMID_ROUTE_ARCHITECT_CHALLENGES[0].a2,
      'Walk straight north two blocks',
    );
    assert.equal(/\(\d+\s*,\s*\d+\)/.test(wrongDest.feedback.en), false);
    assert.equal(/\(\d+\s*,\s*\d+\)/.test(wrongDest.feedback.th), false);

    const componentSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/egypt/build/PyramidRouteArchitectGame.tsx'),
      'utf8',
    );
    assert.equal(componentSrc.includes('handleUndo'), true);
    assert.equal(componentSrc.includes('handleReset'), true);
    assert.equal(componentSrc.includes('handleRemoveSelected'), true);
    assert.equal(componentSrc.includes('handleRetryRoute'), true);
  });

  it('12. guards repeated Test Route clicks against overlapping timers and supports reduced-motion', () => {
    const componentSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/egypt/build/PyramidRouteArchitectGame.tsx'),
      'utf8',
    );
    assert.equal(componentSrc.includes('if (isSolved || isAnimating) return;'), true);
    assert.equal(componentSrc.includes('clearScheduledTimers'), true);
    assert.equal(componentSrc.includes('prefersReducedMotionActive'), true);
    assert.equal(componentSrc.includes('disabled={isSolved || isAnimating}'), true);
  });

  it('13. rejects empty or partial Test Route submissions without marking challenges solved', () => {
    const ch1 = PYRAMID_ROUTE_ARCHITECT_CHALLENGES[0].a2;
    const emptyRes = validatePyramidRouteArchitectSubmission(ch1, []);
    assert.equal(emptyRes.validGrammar, false);
    assert.equal(emptyRes.validRoute, false);

    const twoTilesRes = validatePyramidRouteArchitectSubmission(ch1, [
      'Walk straight',
      'north',
    ]);
    assert.equal(twoTilesRes.validGrammar, false);
    assert.equal(twoTilesRes.validRoute, false);
  });

  it('14. prevents duplicate XP rewards when recording Pyramid Route Architect replay submissions', () => {
    let state = completeCountriesUpToAustraliaPerform4of5();
    const spec5 = getAustraliaPerformChallengeSpec(AUSTRALIA_PERFORM_CHALLENGE_ORDER[4])!;
    state = completeAustraliaPerformChallenge(state, AUSTRALIA_PERFORM_CHALLENGE_ORDER[4], {
      practiceMode: 'microphone_recording',
      completedTurnIds: spec5.turns.map((t) => t.turnId),
      difficultyUsed: 'a2',
      usedScriptPreview: false,
      completedAt: '2026-11-23T15:00:00.000Z',
    });
    state = completeAustraliaPerformMission(state, {
      easiestPart: 'Greeting Olivia',
      mostChallengingPart: 'Clarifying detour',
      keptConversationGoing: 'Asked follow-up questions',
      usefulExpression: 'Just to double-check...',
      nextImprovement: 'Steady pace',
      completedAt: '2026-11-23T15:10:00.000Z',
    });

    state = startEgyptDiscoveryMission(state);
    for (const id of EGYPT_DISCOVER_MISSION_ORDER) {
      state = completeEgyptDiscoveryMission(state, id);
    }
    state = startEgyptBuildMission(state);

    const xpBeforeBuild = state.rewards.xp;
    for (const landmarkId of EGYPT_BUILD_MISSION_ORDER) {
      const gameId = GAME_ID_BY_LANDMARK[landmarkId];
      for (const cid of getEgyptBuildGameChallengeIds(landmarkId)) {
        const rec: EgyptInstructionJournalRecord = {
          id: makeEgyptJournalRecordId(gameId, cid),
          missionId: EGYPT_MISSION_ID,
          gameId,
          landmarkId,
          challengeId: cid,
          challengeTitle: { en: cid, th: cid },
          cefrLevel: 'a2',
          instructionText: 'Walk straight north three blocks and stop beside the Viewing Platform.',
          instructionLines: ['Walk straight north three blocks and stop beside the Viewing Platform.'],
          thaiScaffold: 'เดินตรงไปทางทิศเหนือสามช่วงตึกแล้วหยุดข้างจุดชมวิว',
          skillCategory: SKILL_CATEGORY_BY_GAME_ID[gameId],
          completedAt: '2026-11-24T12:00:00.000Z',
        };
        state = recordEgyptBuildChallenge(state, rec);
      }
      state = completeEgyptBuildMission(state, landmarkId);
    }

    assert.equal(isEgyptBuildCompleted(state), true);
    assert.equal(isEgyptPracticeUnlocked(state), true);
    assert.equal(state.rewards.xp, xpBeforeBuild + EGYPT_BUILD_XP_REWARD);

    // Replay station & Pyramid Route Architect challenge: must award +0 duplicate XP
    const xpAfterBuild = state.rewards.xp;
    state = recordEgyptBuildChallenge(state, {
      id: makeEgyptJournalRecordId(
        'pyramid_route_architect',
        PYRAMID_ROUTE_ARCHITECT_CHALLENGES[0].challengeId,
      ),
      missionId: EGYPT_MISSION_ID,
      gameId: 'pyramid_route_architect',
      landmarkId: 'giza_pyramid_plaza',
      challengeId: PYRAMID_ROUTE_ARCHITECT_CHALLENGES[0].challengeId,
      challengeTitle: PYRAMID_ROUTE_ARCHITECT_CHALLENGES[0].title,
      cefrLevel: 'b1',
      instructionText: PYRAMID_ROUTE_ARCHITECT_CHALLENGES[0].b1.canonicalModel,
      instructionLines: [PYRAMID_ROUTE_ARCHITECT_CHALLENGES[0].b1.canonicalModel],
      thaiScaffold: PYRAMID_ROUTE_ARCHITECT_CHALLENGES[0].b1.thaiScaffold,
      skillCategory: 'route_directions',
      completedAt: '2026-11-25T12:00:00.000Z',
      attemptNumber: 2,
    });
    state = completeEgyptBuildMission(state, 'giza_pyramid_plaza');
    assert.equal(state.rewards.xp, xpAfterBuild);
  });

  it('15. keeps the Australia mandatory Self-Reflection gate untouched and enforced', () => {
    const stateAt4of5 = completeCountriesUpToAustraliaPerform4of5();
    assert.equal(isEgyptUnlocked(stateAt4of5), false);
    assert.equal(isAustraliaPerformCompleted(stateAt4of5), false);
    assert.equal(isAustraliaMissionCompleted(stateAt4of5), false);
    assert.equal(
      stateAt4of5.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID),
      false,
    );

    const spec5 = getAustraliaPerformChallengeSpec(AUSTRALIA_PERFORM_CHALLENGE_ORDER[4])!;
    let completedAus = completeAustraliaPerformChallenge(
      stateAt4of5,
      AUSTRALIA_PERFORM_CHALLENGE_ORDER[4],
      {
        practiceMode: 'microphone_recording',
        completedTurnIds: spec5.turns.map((t) => t.turnId),
        difficultyUsed: 'a2',
        usedScriptPreview: false,
        completedAt: '2026-11-23T15:00:00.000Z',
      },
    );
    completedAus = completeAustraliaPerformMission(completedAus, {
      easiestPart: 'Greeting Olivia',
      mostChallengingPart: 'Clarifying detour',
      keptConversationGoing: 'Asked follow-up questions',
      usefulExpression: 'Just to double-check...',
      nextImprovement: 'Steady pace',
      completedAt: '2026-11-23T15:10:00.000Z',
    });
    assert.equal(isEgyptUnlocked(completedAus), true);
    assert.equal(isAustraliaPerformCompleted(completedAus), true);
    assert.equal(isAustraliaMissionCompleted(completedAus), true);
    assert.equal(
      completedAus.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID),
      true,
    );
  });
});
