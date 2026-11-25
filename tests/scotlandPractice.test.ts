import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  collectJaipurVocabObject,
  completeJaipurFinalShowcase,
  completeJaipurSentenceTrain,
  completeJaipurSpotAndSpeakObject,
  completeKenyaBuildStation,
  completeKenyaDiscoverySpot,
  completeKenyaFinalPerform,
  completeKenyaPracticeConversation,
  completeScotlandBuildStation,
  completeScotlandDiscoveryStation,
  completeScotlandPracticeStation,
  createDefaultProgress,
  getCountryReplayAttempt,
  getScotlandEffectiveEntry,
  isJaipurMissionCompleted,
  isKenyaMissionCompleted,
  isScotlandBuildCompleted,
  isScotlandDiscoverCompleted,
  isScotlandPerformUnlocked,
  isScotlandPracticeCompleted,
  isScotlandPracticeUnlocked,
  isScotlandUnlocked,
  KENYA_MISSION_ID,
  markJaipurAaravMet,
  markScotlandNpcMet,
  markScotlandPoiExplored,
  migrateAndValidateProgress,
  restartCountryReplayAttempt,
  SCOTLAND_BUILD_ACTIVITY_ID,
  SCOTLAND_DISCOVERY_ACTIVITY_ID,
  SCOTLAND_MISSION_ID,
  SCOTLAND_PRACTICE_ACTIVITY_ID,
  SCOTLAND_PRACTICE_XP_REWARD,
  startCountryReplay,
  startJaipurSpotAndSpeak,
  startKenyaBuildMission,
  startKenyaDiscoveryMission,
  startKenyaPerformMission,
  startKenyaPracticeMission,
  startScotlandBuildMission,
  startScotlandDiscoveryMission,
  startScotlandPracticeMission,
} from '../src/utils/progressStorage';
import { JAIPUR_VOCAB_OBJECTS } from '../src/data/jaipurWorld';
import { INDIA_PASSPORT_STAMP_ID } from '../src/data/jaipurShowcase';
import { KENYA_DISCOVERY_TASKS } from '../src/data/kenyaDiscovery';
import { KENYA_BUILD_STATIONS } from '../src/data/kenyaBuild';
import { KENYA_PRACTICE_CONVERSATIONS } from '../src/data/kenyaPractice';
import { KENYA_PASSPORT_STAMP_ID } from '../src/data/kenyaPerform';
import { SCOTLAND_EVIDENCE_ITEMS } from '../src/data/scotlandDiscovery';
import { SCOTLAND_BUILD_STATIONS } from '../src/data/scotlandBuild';
import {
  getScotlandPracticeMission,
  isValidScotlandReflectionState,
  SCOTLAND_PRACTICE_MISSIONS,
  SCOTLAND_PRACTICE_SPEAKERS,
} from '../src/data/scotlandPractice';
import {
  SCOTLAND_LANDMARKS,
  SCOTLAND_PASSPORT_STAMP_ID,
  SCOTLAND_STAGE_ACTIVITY_IDS,
  type ScotlandLandmarkId,
} from '../src/data/scotlandWorld';
import type { LocalProgressV1, ScotlandSpeakingReflectionState } from '../src/types/game';

function buildPrerequisiteIndiaAndKenya(): LocalProgressV1 {
  let state = markJaipurAaravMet(createDefaultProgress());
  for (const obj of JAIPUR_VOCAB_OBJECTS) {
    state = collectJaipurVocabObject(state, obj.id);
  }
  state = completeJaipurSentenceTrain(state);
  state = startJaipurSpotAndSpeak(state);
  for (const obj of JAIPUR_VOCAB_OBJECTS) {
    state = completeJaipurSpotAndSpeakObject(state, obj.id);
  }
  state = completeJaipurFinalShowcase(state);

  state = startKenyaDiscoveryMission(state);
  for (const task of KENYA_DISCOVERY_TASKS) {
    state = completeKenyaDiscoverySpot(state, task.id);
  }
  state = startKenyaBuildMission(state);
  for (const station of KENYA_BUILD_STATIONS) {
    state = completeKenyaBuildStation(state, station.id, station.modelSentenceA2.en);
  }
  state = startKenyaPracticeMission(state);
  for (const conv of KENYA_PRACTICE_CONVERSATIONS) {
    state = completeKenyaPracticeConversation(state, conv.id);
  }
  state = startKenyaPerformMission(state);
  state = completeKenyaFinalPerform(state);
  return state;
}

function completeScotlandDiscoverAndBuild(initial: LocalProgressV1): {
  state: LocalProgressV1;
  builtSentences: Record<string, string>;
} {
  let state = markScotlandNpcMet(initial, 'eilidh');
  state = startScotlandDiscoveryMission(state);
  for (const item of SCOTLAND_EVIDENCE_ITEMS) {
    state = completeScotlandDiscoveryStation(state, item.id);
  }
  const builtSentences: Record<string, string> = {};
  state = startScotlandBuildMission(state);
  for (const st of SCOTLAND_BUILD_STATIONS) {
    builtSentences[st.id] = st.modelSentence;
    state = completeScotlandBuildStation(state, st.id, st.modelSentence);
  }
  return { state, builtSentences };
}

function makeReflection(
  practiceMode: 'recorded_mic' | 'self_reported_no_mic' = 'recorded_mic',
  overrides?: Partial<ScotlandSpeakingReflectionState['checks']>,
  followUpPracticed?: boolean,
): ScotlandSpeakingReflectionState {
  return {
    practiceMode,
    checks: {
      comparedCultures: overrides?.comparedCultures ?? true,
      usedSpecificExample: overrides?.usedSpecificExample ?? true,
      explainedSimilarityOrDifference: overrides?.explainedSimilarityOrDifference ?? true,
      spokeClearly: overrides?.spokeClearly ?? true,
    },
    ...(followUpPracticed !== undefined ? { followUpPracticed } : {}),
    completedAt: '2026-11-21T08:30:00.000Z',
  };
}

describe('Scotland Phase 3D Stage 3 — PRACTICE (Highland Cultural Conversations)', () => {
  it('enforces strict gating before Kenya and before Scotland DISCOVER + BUILD completion', () => {
    const fresh = createDefaultProgress();
    assert.equal(isScotlandUnlocked(fresh), false);
    assert.equal(isScotlandPracticeUnlocked(fresh), false);
    assert.equal(startScotlandPracticeMission(fresh), fresh);

    const postKenya = buildPrerequisiteIndiaAndKenya();
    assert.equal(postKenya.rewards.xp, 500);
    assert.equal(isScotlandUnlocked(postKenya), true);
    assert.equal(isScotlandPracticeUnlocked(postKenya), false);
    assert.equal(startScotlandPracticeMission(postKenya), postKenya);

    // DISCOVER complete only (550 XP), BUILD incomplete -> PRACTICE still locked
    let discoverOnly = markScotlandNpcMet(postKenya, 'eilidh');
    discoverOnly = startScotlandDiscoveryMission(discoverOnly);
    for (const item of SCOTLAND_EVIDENCE_ITEMS) {
      discoverOnly = completeScotlandDiscoveryStation(discoverOnly, item.id);
    }
    assert.equal(discoverOnly.rewards.xp, 550);
    assert.equal(isScotlandDiscoverCompleted(discoverOnly), true);
    assert.equal(isScotlandBuildCompleted(discoverOnly), false);
    assert.equal(isScotlandPracticeUnlocked(discoverOnly), false);
    assert.equal(startScotlandPracticeMission(discoverOnly), discoverOnly);

    // 4/5 BUILD stations completed -> PRACTICE still locked
    let partialBuild = startScotlandBuildMission(discoverOnly);
    for (const st of SCOTLAND_BUILD_STATIONS.slice(0, 4)) {
      partialBuild = completeScotlandBuildStation(partialBuild, st.id, st.modelSentence);
    }
    assert.equal(isScotlandPracticeUnlocked(partialBuild), false);
    assert.equal(startScotlandPracticeMission(partialBuild), partialBuild);
    assert.equal(
      completeScotlandPracticeStation(partialBuild, 'highland_village_square', makeReflection()),
      partialBuild,
    );
  });

  it('requires startScotlandPracticeMission (Eilidh intro) before any Practice station completes', () => {
    const { state: postBuild } = completeScotlandDiscoverAndBuild(buildPrerequisiteIndiaAndKenya());
    assert.equal(postBuild.rewards.xp, 600);
    assert.equal(isScotlandPracticeUnlocked(postBuild), true);
    assert.equal(isScotlandPracticeCompleted(postBuild), false);
    assert.equal(isScotlandPerformUnlocked(postBuild), false);

    // Attempt to complete Mission 1 before talking to Eilidh -> no-op
    const blocked = completeScotlandPracticeStation(
      postBuild,
      'highland_village_square',
      makeReflection(),
    );
    assert.equal(blocked, postBuild);
    assert.equal(blocked.rewards.xp, 600);

    // Starting PRACTICE sets flag without granting XP
    const started = startScotlandPracticeMission(postBuild);
    assert.equal(started.rewards.xp, 600);
    assert.equal(started.missionProgress[SCOTLAND_MISSION_ID]?.scotlandPracticeStarted, true);
  });

  it('validates all 5 mission definitions, speaker assignments, A2/B1 scaffolds, and Fiona Mission 5 follow-up', () => {
    assert.equal(SCOTLAND_PRACTICE_MISSIONS.length, 5);
    assert.equal(SCOTLAND_PRACTICE_SPEAKERS.eilidh.id, 'eilidh');
    assert.equal(SCOTLAND_PRACTICE_SPEAKERS.fiona.id, 'fiona');

    const expectedOrder: Array<{
      id: ScotlandLandmarkId;
      speaker: 'eilidh' | 'fiona';
      question: string;
    }> = [
      {
        id: 'highland_village_square',
        speaker: 'eilidh',
        question: 'What is similar about everyday life in Scotland and Thailand?',
      },
      {
        id: 'tartan_heritage_workshop',
        speaker: 'fiona',
        question: 'How are Scottish tartan and Thai Praewa silk similar and different?',
      },
      {
        id: 'highland_food_market',
        speaker: 'eilidh',
        question: 'Can you compare a Scottish snack with a Thai snack?',
      },
      {
        id: 'highland_games_ground',
        speaker: 'fiona',
        question: 'How are Highland Games different from a festival in Thailand?',
      },
      {
        id: 'lochside_castle_viewpoint',
        speaker: 'eilidh',
        question: 'What have you discovered about Scotland and Thailand?',
      },
    ];

    expectedOrder.forEach((exp, idx) => {
      const m = getScotlandPracticeMission(exp.id);
      if (!m) throw new Error(`Missing mission ${exp.id}`);
      assert.equal(m.order, idx + 1);
      assert.equal(m.primaryNpcId, exp.speaker);
      assert.equal(m.question.en, exp.question);
      assert.equal(m.sentenceFramesA2.length >= 1, true);
      assert.equal(m.sentenceFramesB1.length >= 1, true);
      assert.equal(m.modelAnswerA2.en.length > 20, true);
      assert.equal(m.modelAnswerB1.en.length > 20, true);
      assert.equal(m.accuracyGuidanceNote.en.length > 20, true);
      assert.equal(m.sandwichGuidance.positive.en.length > 10, true);
      assert.equal(m.sandwichGuidance.improvement.en.length > 10, true);
      assert.equal(m.sandwichGuidance.nextStep.en.length > 10, true);
    });

    const m5 = getScotlandPracticeMission('lochside_castle_viewpoint');
    if (!m5) throw new Error('Missing Mission 5');
    assert.equal(m5.secondaryNpcId, 'fiona');
    assert.equal(
      m5.followUpQuestion?.en,
      'Which cultural difference did you find most interesting, and why?',
    );
    assert.equal(m5.targetDurationNote?.en.includes('30–60'), true);
  });

  it('validates reflection checklist payloads and supports both recorded_mic and self_reported_no_mic modes', () => {
    assert.equal(isValidScotlandReflectionState(null), false);
    assert.equal(isValidScotlandReflectionState({}), false);
    assert.equal(
      isValidScotlandReflectionState({
        practiceMode: 'ai_graded',
        checks: {
          comparedCultures: true,
          usedSpecificExample: true,
          explainedSimilarityOrDifference: true,
          spokeClearly: true,
        },
        completedAt: '2026-11-21T08:30:00.000Z',
      }),
      false,
    );
    // All checkboxes unchecked is rejected
    assert.equal(
      isValidScotlandReflectionState(
        makeReflection('self_reported_no_mic', {
          comparedCultures: false,
          usedSpecificExample: false,
          explainedSimilarityOrDifference: false,
          spokeClearly: false,
        }),
      ),
      false,
    );
    // Partial valid self-check accepted cleanly
    assert.equal(
      isValidScotlandReflectionState(
        makeReflection('self_reported_no_mic', {
          comparedCultures: true,
          usedSpecificExample: false,
          explainedSimilarityOrDifference: false,
          spokeClearly: false,
        }),
      ),
      true,
    );

    const { state: postBuild } = completeScotlandDiscoverAndBuild(buildPrerequisiteIndiaAndKenya());
    const started = startScotlandPracticeMission(postBuild);
    const badAttempt = completeScotlandPracticeStation(
      started,
      'highland_village_square',
      makeReflection('recorded_mic', {
        comparedCultures: false,
        usedSpecificExample: false,
        explainedSimilarityOrDifference: false,
        spokeClearly: false,
      }),
    );
    assert.equal(badAttempt, started);
  });

  it('completes all 5 PRACTICE conversations, preserves DISCOVER & BUILD evidence, awards +50 XP once (600->650), unlocks PERFORM, and withholds Scotland Stamp', () => {
    const { state: postBuild, builtSentences } = completeScotlandDiscoverAndBuild(
      buildPrerequisiteIndiaAndKenya(),
    );
    let state = startScotlandPracticeMission(postBuild);

    const reflection1 = makeReflection('recorded_mic');
    const reflection2 = makeReflection('self_reported_no_mic', { spokeClearly: false });
    const reflection3 = makeReflection('recorded_mic');
    const reflection4 = makeReflection('self_reported_no_mic');
    const reflection5 = makeReflection('recorded_mic', undefined, true);

    const orderedReflections: Array<[ScotlandLandmarkId, ScotlandSpeakingReflectionState]> = [
      ['highland_village_square', reflection1],
      ['tartan_heritage_workshop', reflection2],
      ['highland_food_market', reflection3],
      ['highland_games_ground', reflection4],
    ];

    orderedReflections.forEach(([id, ref], idx) => {
      state = completeScotlandPracticeStation(state, id, ref);
      assert.equal(state.rewards.xp, 600);
      assert.equal(
        state.missionProgress[SCOTLAND_MISSION_ID]?.scotlandCompletedSpeakingIds?.length,
        idx + 1,
      );
      assert.equal(isScotlandPracticeCompleted(state), false);
      assert.equal(isScotlandPerformUnlocked(state), false);
    });

    // Completing 5th station unlocks PERFORM and awards +50 XP once (600 -> 650)
    state = completeScotlandPracticeStation(state, 'lochside_castle_viewpoint', reflection5);

    assert.equal(SCOTLAND_PRACTICE_XP_REWARD, 50);
    assert.equal(state.rewards.xp, 650);
    assert.equal(isScotlandPracticeCompleted(state), true);
    assert.equal(isScotlandPerformUnlocked(state), true);

    const scotEntry = state.missionProgress[SCOTLAND_MISSION_ID];
    assert.equal(scotEntry?.status, 'in_progress');
    assert.equal(scotEntry?.currentStage, 'perform');
    assert.equal(scotEntry?.completedActivityIds.includes(SCOTLAND_PRACTICE_ACTIVITY_ID), true);
    assert.equal(
      scotEntry?.completedActivityIds.includes(SCOTLAND_STAGE_ACTIVITY_IDS.perform),
      false,
    );
    assert.equal(state.rewards.stamps.includes(SCOTLAND_PASSPORT_STAMP_ID), false);

    // Prior DISCOVER evidence and BUILD sentences remain intact
    assert.equal(scotEntry?.scotlandDiscoveredEvidenceIds?.length, SCOTLAND_EVIDENCE_ITEMS.length);
    assert.deepEqual(scotEntry?.scotlandBuiltSentences, builtSentences);

    // Stored reflection modes & follow-up flag preserved accurately
    assert.equal(
      scotEntry?.scotlandSpeakingReflectionStates?.tartan_heritage_workshop?.practiceMode,
      'self_reported_no_mic',
    );
    assert.equal(
      scotEntry?.scotlandSpeakingReflectionStates?.lochside_castle_viewpoint?.followUpPracticed,
      true,
    );

    // Re-practicing any conversation never awards duplicate XP
    state = completeScotlandPracticeStation(
      state,
      'tartan_heritage_workshop',
      makeReflection('recorded_mic'),
    );
    assert.equal(state.rewards.xp, 650);
    assert.equal(
      state.missionProgress[SCOTLAND_MISSION_ID]?.scotlandSpeakingReflectionStates
        ?.tartan_heritage_workshop?.practiceMode,
      'recorded_mic',
    );

    // Meeting Fiona or exploring POIs afterward never regresses stage from 'perform'
    let explored = markScotlandNpcMet(state, 'fiona');
    for (const lm of SCOTLAND_LANDMARKS) {
      explored = markScotlandPoiExplored(explored, lm.id);
    }
    assert.equal(explored.missionProgress[SCOTLAND_MISSION_ID]?.currentStage, 'perform');
    assert.equal(explored.missionProgress[SCOTLAND_MISSION_ID]?.status, 'in_progress');

    // India & Kenya journeys remain intact
    assert.equal(isJaipurMissionCompleted(explored), true);
    assert.equal(isKenyaMissionCompleted(explored), true);
    assert.deepEqual(explored.rewards.stamps, [
      INDIA_PASSPORT_STAMP_ID,
      KENYA_PASSPORT_STAMP_ID,
    ]);
    assert.equal(explored.missionProgress[KENYA_MISSION_ID]?.status, 'completed');
  });

  it('sanitizes spoofed PRACTICE/PERFORM payloads and preserves valid PRACTICE data across JSON reload', () => {
    const { state: postBuild } = completeScotlandDiscoverAndBuild(buildPrerequisiteIndiaAndKenya());
    let legit = startScotlandPracticeMission(postBuild);
    for (const mission of SCOTLAND_PRACTICE_MISSIONS) {
      legit = completeScotlandPracticeStation(
        legit,
        mission.id,
        makeReflection('recorded_mic', undefined, mission.followUpQuestion ? true : undefined),
      );
    }

    const rehydrated = migrateAndValidateProgress(JSON.parse(JSON.stringify(legit)));
    assert.equal(rehydrated.rewards.xp, 650);
    assert.equal(isScotlandPracticeCompleted(rehydrated), true);
    assert.equal(isScotlandPerformUnlocked(rehydrated), true);
    assert.equal(
      rehydrated.missionProgress[SCOTLAND_MISSION_ID]?.scotlandCompletedSpeakingIds?.length,
      5,
    );
    assert.equal(rehydrated.rewards.stamps.includes(SCOTLAND_PASSPORT_STAMP_ID), false);

    // Spoofing unimplemented PERFORM + stamp on top of legit PRACTICE strips PERFORM + stamp
    const spoofedPerform = {
      ...rehydrated,
      rewards: {
        ...rehydrated.rewards,
        stamps: [...rehydrated.rewards.stamps, SCOTLAND_PASSPORT_STAMP_ID],
      },
      missionProgress: {
        ...rehydrated.missionProgress,
        [SCOTLAND_MISSION_ID]: {
          ...rehydrated.missionProgress[SCOTLAND_MISSION_ID],
          status: 'completed',
          currentStage: 'perform',
          completedActivityIds: [
            SCOTLAND_DISCOVERY_ACTIVITY_ID,
            SCOTLAND_BUILD_ACTIVITY_ID,
            SCOTLAND_PRACTICE_ACTIVITY_ID,
            SCOTLAND_STAGE_ACTIVITY_IDS.perform,
          ],
        },
      },
    };
    const cleanedPerform = migrateAndValidateProgress(JSON.parse(JSON.stringify(spoofedPerform)));
    assert.equal(cleanedPerform.rewards.stamps.includes(SCOTLAND_PASSPORT_STAMP_ID), false);
    assert.equal(cleanedPerform.missionProgress[SCOTLAND_MISSION_ID]?.status, 'in_progress');
    assert.equal(cleanedPerform.missionProgress[SCOTLAND_MISSION_ID]?.currentStage, 'perform');
    assert.deepEqual(cleanedPerform.missionProgress[SCOTLAND_MISSION_ID]?.completedActivityIds, [
      SCOTLAND_DISCOVERY_ACTIVITY_ID,
      SCOTLAND_BUILD_ACTIVITY_ID,
      SCOTLAND_PRACTICE_ACTIVITY_ID,
    ]);

    // Spoofing PRACTICE completion with missing/invalid reflection states clamps back to 'practice'
    const spoofedPractice = {
      ...postBuild,
      missionProgress: {
        ...postBuild.missionProgress,
        [SCOTLAND_MISSION_ID]: {
          ...postBuild.missionProgress[SCOTLAND_MISSION_ID],
          currentStage: 'perform',
          scotlandPracticeStarted: true,
          scotlandCompletedSpeakingIds: SCOTLAND_PRACTICE_MISSIONS.map((m) => m.id),
          scotlandSpeakingReflectionStates: {
            highland_village_square: makeReflection('recorded_mic'),
          },
          completedActivityIds: [
            SCOTLAND_DISCOVERY_ACTIVITY_ID,
            SCOTLAND_BUILD_ACTIVITY_ID,
            SCOTLAND_PRACTICE_ACTIVITY_ID,
          ],
        },
      },
    };
    const cleanedPractice = migrateAndValidateProgress(JSON.parse(JSON.stringify(spoofedPractice)));
    assert.equal(isScotlandPracticeCompleted(cleanedPractice), false);
    assert.equal(isScotlandPerformUnlocked(cleanedPractice), false);
    assert.equal(cleanedPractice.missionProgress[SCOTLAND_MISSION_ID]?.currentStage, 'practice');
    assert.deepEqual(
      cleanedPractice.missionProgress[SCOTLAND_MISSION_ID]?.scotlandCompletedSpeakingIds,
      ['highland_village_square'],
    );
  });

  it('supports Restart Current Attempt during Scotland PRACTICE while preserving lifetime rewards', () => {
    const { state: postBuild } = completeScotlandDiscoverAndBuild(buildPrerequisiteIndiaAndKenya());
    let state = startScotlandPracticeMission(postBuild);
    for (const mission of SCOTLAND_PRACTICE_MISSIONS) {
      state = completeScotlandPracticeStation(
        state,
        mission.id,
        makeReflection('self_reported_no_mic', undefined, mission.followUpQuestion ? true : undefined),
      );
    }
    assert.equal(state.rewards.xp, 650);

    state = startCountryReplay(state, 'scotland');
    assert.equal(isScotlandPerformUnlocked(state), false);

    // Advance replay into PRACTICE and complete 2 stations
    state = startScotlandDiscoveryMission(state);
    for (const item of SCOTLAND_EVIDENCE_ITEMS) {
      state = completeScotlandDiscoveryStation(state, item.id);
    }
    state = startScotlandBuildMission(state);
    for (const st of SCOTLAND_BUILD_STATIONS) {
      state = completeScotlandBuildStation(state, st.id, st.modelSentence);
    }
    state = startScotlandPracticeMission(state);
    state = completeScotlandPracticeStation(state, 'highland_village_square', makeReflection());
    state = completeScotlandPracticeStation(state, 'tartan_heritage_workshop', makeReflection());
    assert.equal(getScotlandEffectiveEntry(state).scotlandCompletedSpeakingIds?.length, 2);

    // Restart current attempt -> clears attempt PRACTICE progress without affecting lifetime 650 XP or lifetime PRACTICE status
    state = restartCountryReplayAttempt(state, 'scotland');
    const restarted = getCountryReplayAttempt(state, 'scotland');
    assert.equal(restarted?.currentStage, 'discover');
    assert.equal(restarted?.scotlandCompletedSpeakingIds, undefined);
    assert.equal(state.rewards.xp, 650);
    assert.equal(isScotlandPracticeCompleted(state), true);
  });
});
