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
  createDefaultProgress,
  getCountryReplayAttempt,
  getScotlandEffectiveEntry,
  isJaipurMissionCompleted,
  isKenyaMissionCompleted,
  isScotlandBuildCompleted,
  isScotlandBuildUnlocked,
  isScotlandDiscoverCompleted,
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
  startCountryReplay,
  startJaipurSpotAndSpeak,
  startKenyaBuildMission,
  startKenyaDiscoveryMission,
  startKenyaPerformMission,
  startKenyaPracticeMission,
  startScotlandBuildMission,
  startScotlandDiscoveryMission,
} from '../src/utils/progressStorage';
import { JAIPUR_VOCAB_OBJECTS } from '../src/data/jaipurWorld';
import { INDIA_PASSPORT_STAMP_ID } from '../src/data/jaipurShowcase';
import { KENYA_DISCOVERY_TASKS } from '../src/data/kenyaDiscovery';
import { KENYA_BUILD_STATIONS } from '../src/data/kenyaBuild';
import { KENYA_PRACTICE_CONVERSATIONS } from '../src/data/kenyaPractice';
import { KENYA_PASSPORT_STAMP_ID } from '../src/data/kenyaPerform';
import { SCOTLAND_EVIDENCE_ITEMS } from '../src/data/scotlandDiscovery';
import {
  SCOTLAND_LANDMARKS,
  SCOTLAND_PASSPORT_STAMP_ID,
  SCOTLAND_STAGE_ACTIVITY_IDS,
} from '../src/data/scotlandWorld';
import {
  evaluateMasterComparisonText,
  isValidSavedScotlandBuildSentence,
  SCOTLAND_BUILD_STATIONS,
  validateGame1Sentence,
} from '../src/data/scotlandBuild';
import type { LocalProgressV1 } from '../src/types/game';

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

function completeScotlandDiscover(initial: LocalProgressV1): LocalProgressV1 {
  let state = markScotlandNpcMet(initial, 'eilidh');
  state = startScotlandDiscoveryMission(state);
  for (const item of SCOTLAND_EVIDENCE_ITEMS) {
    state = completeScotlandDiscoveryStation(state, item.id);
  }
  return state;
}

describe('Scotland Phase 3C Stage 2 — BUILD (Comparison Crafting Quest)', () => {
  it('enforces strict gating: BUILD cannot start or complete while Kenya or Scotland DISCOVER is incomplete', () => {
    const noKenya = createDefaultProgress();
    assert.equal(isScotlandUnlocked(noKenya), false);
    assert.equal(isScotlandBuildUnlocked(noKenya), false);
    assert.equal(startScotlandBuildMission(noKenya), noKenya);

    const postKenya = buildPrerequisiteIndiaAndKenya();
    assert.equal(postKenya.rewards.xp, 500);
    assert.equal(isScotlandUnlocked(postKenya), true);
    assert.equal(isScotlandDiscoverCompleted(postKenya), false);
    assert.equal(isScotlandBuildUnlocked(postKenya), false);
    assert.equal(startScotlandBuildMission(postKenya), postKenya);

    // Completing 4 of 5 DISCOVER stations is still insufficient to unlock BUILD
    let partialDiscover = startScotlandDiscoveryMission(postKenya);
    for (const item of SCOTLAND_EVIDENCE_ITEMS.slice(0, 4)) {
      partialDiscover = completeScotlandDiscoveryStation(partialDiscover, item.id);
    }
    assert.equal(isScotlandBuildUnlocked(partialDiscover), false);
    assert.equal(startScotlandBuildMission(partialDiscover), partialDiscover);
    assert.equal(
      completeScotlandBuildStation(
        partialDiscover,
        'highland_village_square',
        SCOTLAND_BUILD_STATIONS[0].modelSentence,
      ),
      partialDiscover,
    );
  });

  it('requires Eilidh startScotlandBuildMission before BUILD stations can be recorded', () => {
    const discovered = completeScotlandDiscover(buildPrerequisiteIndiaAndKenya());
    assert.equal(discovered.rewards.xp, 550);
    assert.equal(isScotlandBuildUnlocked(discovered), true);

    const beforeStart = completeScotlandBuildStation(
      discovered,
      'highland_village_square',
      SCOTLAND_BUILD_STATIONS[0].modelSentence,
    );
    assert.equal(beforeStart, discovered);
    assert.equal(beforeStart.rewards.xp, 550);
  });

  it('validates flexible comparison rules including multiple orderings and rejects stereotypes', () => {
    // Game 1 supports both "Both Scotland and Thailand..." and "Both Thailand and Scotland..."
    assert.equal(
      validateGame1Sentence(
        ['Both', 'Scotland', 'and', 'Thailand', 'blend', 'old heritage', 'with modern life.'],
        'a2',
      ).valid,
      true,
    );
    assert.equal(
      validateGame1Sentence(
        ['Both', 'Thailand', 'and', 'Scotland', 'blend', 'old heritage', 'with modern life.'],
        'a2',
      ).valid,
      true,
    );
    assert.equal(
      validateGame1Sentence(
        ['Thailand', 'and', 'Scotland', 'Both', 'blend', 'old heritage', 'with modern life.'],
        'a2',
      ).valid,
      false,
    );

    // Game 5 accepts multiple valid combinations with >=1 similarity, >=1 difference, >=1 Scotland & Thailand example
    const combo1 = evaluateMasterComparisonText(
      'Both Scotland and Thailand honor historic traditions, while oatcakes in Scotland differ from Thai jasmine rice dishes.',
    );
    assert.equal(combo1.valid, true);

    const combo2 = evaluateMasterComparisonText(
      'Scottish tartan weaving is similar to Thai Praewa silk in celebrating festivals, whereas lochside castles are different from golden Thai temples.',
    );
    assert.equal(combo2.valid, true);

    // Missing difference fails
    const missingDiff = evaluateMasterComparisonText(
      'Both Scotland and Thailand enjoy tartan wool and Praewa silk at proud weddings.',
    );
    assert.equal(missingDiff.valid, false);
    assert.equal(missingDiff.hasSimilarity, true);
    assert.equal(missingDiff.hasDifference, false);

    // Stereotype rejected even if connectors are present
    const stereotypeInput = evaluateMasterComparisonText(
      'Both Scotland and Thailand have families, while people only wear kilts every day and eat oatcakes.',
    );
    assert.equal(stereotypeInput.valid, false);
    assert.equal(
      isValidSavedScotlandBuildSentence(
        'lochside_castle_viewpoint',
        'Both Scotland and Thailand have heritage while never wear modern outfits.',
      ),
      false,
    );
  });

  it('completes all 5 BUILD stations, grants +50 XP once (550->600), unlocks PRACTICE, and withholds Stamp', () => {
    const discovered = completeScotlandDiscover(buildPrerequisiteIndiaAndKenya());
    let state = startScotlandBuildMission(discovered);

    // Custom valid sentences built across the 5 stations
    const builtInputs: Record<string, string> = {
      highland_village_square: 'Both Thailand and Scotland blend old heritage with modern life.',
      tartan_heritage_workshop:
        'Scottish tartan weaving is similar to Thai Praewa silk because both honor local heritage at special celebrations.',
      highland_food_market:
        'Cool Highland farms grow hearty oats and berries, whereas warm Thai kitchens cook with jasmine rice and fresh lemongrass.',
      highland_games_ground:
        'Unlike floating candlelit krathongs on Thai rivers, Highland festivals echo with fiddles and drums on grassy fields.',
      lochside_castle_viewpoint:
        'Both Scottish Highland Games and Thai festivals unite neighbors outdoors, while stone lochside castles in Scotland are different from Thai temples.',
    };

    SCOTLAND_BUILD_STATIONS.slice(0, 4).forEach((st) => {
      state = completeScotlandBuildStation(state, st.id, builtInputs[st.id]);
      assert.equal(isScotlandBuildCompleted(state), false);
      assert.equal(isScotlandPracticeUnlocked(state), false);
      assert.equal(state.rewards.xp, 550);
    });

    // Complete 5th station -> awards +50 XP once -> total 600 XP
    state = completeScotlandBuildStation(
      state,
      'lochside_castle_viewpoint',
      builtInputs.lochside_castle_viewpoint,
    );

    assert.equal(state.rewards.xp, 600);
    assert.equal(isScotlandBuildCompleted(state), true);
    assert.equal(isScotlandPracticeUnlocked(state), true);
    assert.equal(state.missionProgress[SCOTLAND_MISSION_ID]?.status, 'in_progress');
    assert.equal(state.missionProgress[SCOTLAND_MISSION_ID]?.currentStage, 'practice');
    assert.equal(
      state.missionProgress[SCOTLAND_MISSION_ID]?.completedActivityIds.includes(
        SCOTLAND_BUILD_ACTIVITY_ID,
      ),
      true,
    );
    assert.equal(
      state.missionProgress[SCOTLAND_MISSION_ID]?.completedActivityIds.includes(
        SCOTLAND_STAGE_ACTIVITY_IDS.practice,
      ),
      false,
    );
    assert.equal(
      state.missionProgress[SCOTLAND_MISSION_ID]?.completedActivityIds.includes(
        SCOTLAND_STAGE_ACTIVITY_IDS.perform,
      ),
      false,
    );
    assert.equal(state.rewards.stamps.includes(SCOTLAND_PASSPORT_STAMP_ID), false);
    assert.deepEqual(state.missionProgress[SCOTLAND_MISSION_ID]?.scotlandBuiltSentences, builtInputs);

    // Repeating/editing a BUILD station never awards duplicate XP
    const repeated = completeScotlandBuildStation(
      state,
      'highland_village_square',
      SCOTLAND_BUILD_STATIONS[0].modelSentence,
    );
    assert.equal(repeated.rewards.xp, 600);

    // Meeting Fiona or exploring POIs afterward never regresses currentStage from 'practice'
    let exploredAfter = markScotlandNpcMet(repeated, 'fiona');
    for (const lm of SCOTLAND_LANDMARKS) {
      exploredAfter = markScotlandPoiExplored(exploredAfter, lm.id);
    }
    assert.equal(exploredAfter.missionProgress[SCOTLAND_MISSION_ID]?.currentStage, 'practice');
    assert.equal(exploredAfter.missionProgress[SCOTLAND_MISSION_ID]?.status, 'in_progress');

    // India & Kenya completed achievements remain intact
    assert.equal(isJaipurMissionCompleted(exploredAfter), true);
    assert.equal(isKenyaMissionCompleted(exploredAfter), true);
    assert.deepEqual(exploredAfter.rewards.stamps, [
      INDIA_PASSPORT_STAMP_ID,
      KENYA_PASSPORT_STAMP_ID,
    ]);
    assert.equal(exploredAfter.missionProgress[KENYA_MISSION_ID]?.status, 'completed');
  });

  it('sanitizes spoofed BUILD/PRACTICE/PERFORM payloads while persisting valid BUILD progress', () => {
    const discovered = completeScotlandDiscover(buildPrerequisiteIndiaAndKenya());
    let legit = startScotlandBuildMission(discovered);
    for (const st of SCOTLAND_BUILD_STATIONS) {
      legit = completeScotlandBuildStation(stateOr(legit), st.id, st.modelSentence);
    }

    // Round-trip legit progress through JSON parse & migrateAndValidateProgress
    const hydrated = migrateAndValidateProgress(JSON.parse(JSON.stringify(legit)));
    assert.equal(hydrated.rewards.xp, 600);
    assert.equal(isScotlandBuildCompleted(hydrated), true);
    assert.equal(isScotlandPracticeUnlocked(hydrated), true);
    assert.equal(
      Object.keys(hydrated.missionProgress[SCOTLAND_MISSION_ID]?.scotlandBuiltSentences ?? {})
        .length,
      5,
    );
    assert.equal(hydrated.rewards.stamps.includes(SCOTLAND_PASSPORT_STAMP_ID), false);

    // Spoof PRACTICE, PERFORM, Scotland Passport stamp, and invalid stereotype BUILD sentence
    const spoofed = {
      ...hydrated,
      rewards: {
        ...hydrated.rewards,
        stamps: [...hydrated.rewards.stamps, SCOTLAND_PASSPORT_STAMP_ID],
      },
      missionProgress: {
        ...hydrated.missionProgress,
        [SCOTLAND_MISSION_ID]: {
          ...hydrated.missionProgress[SCOTLAND_MISSION_ID],
          status: 'completed',
          currentStage: 'perform',
          completedActivityIds: [
            SCOTLAND_DISCOVERY_ACTIVITY_ID,
            SCOTLAND_BUILD_ACTIVITY_ID,
            SCOTLAND_STAGE_ACTIVITY_IDS.practice,
            SCOTLAND_STAGE_ACTIVITY_IDS.perform,
          ],
        },
      },
    };
    const cleanedSpoof = migrateAndValidateProgress(JSON.parse(JSON.stringify(spoofed)));
    assert.equal(cleanedSpoof.rewards.stamps.includes(SCOTLAND_PASSPORT_STAMP_ID), false);
    assert.equal(cleanedSpoof.missionProgress[SCOTLAND_MISSION_ID]?.status, 'in_progress');
    assert.equal(cleanedSpoof.missionProgress[SCOTLAND_MISSION_ID]?.currentStage, 'practice');
    assert.deepEqual(cleanedSpoof.missionProgress[SCOTLAND_MISSION_ID]?.completedActivityIds, [
      SCOTLAND_DISCOVERY_ACTIVITY_ID,
      SCOTLAND_BUILD_ACTIVITY_ID,
    ]);

    // Spoofing BUILD complete with only 2 sentences strips scotlandBuild activity & resets stage to 'build'
    const partialSpoof = {
      ...discovered,
      missionProgress: {
        ...discovered.missionProgress,
        [SCOTLAND_MISSION_ID]: {
          ...discovered.missionProgress[SCOTLAND_MISSION_ID],
          currentStage: 'practice',
          scotlandBuildStarted: true,
          scotlandBuiltSentences: {
            highland_village_square: SCOTLAND_BUILD_STATIONS[0].modelSentence,
            tartan_heritage_workshop: 'too short',
          },
          completedActivityIds: [SCOTLAND_DISCOVERY_ACTIVITY_ID, SCOTLAND_BUILD_ACTIVITY_ID],
        },
      },
    };
    const cleanedPartial = migrateAndValidateProgress(JSON.parse(JSON.stringify(partialSpoof)));
    assert.equal(isScotlandBuildCompleted(cleanedPartial), false);
    assert.equal(isScotlandPracticeUnlocked(cleanedPartial), false);
    assert.equal(cleanedPartial.missionProgress[SCOTLAND_MISSION_ID]?.currentStage, 'build');
  });

  it('supports Replay Country and Restart Current Attempt for Scotland DISCOVER + BUILD', () => {
    let state = completeScotlandDiscover(buildPrerequisiteIndiaAndKenya());
    state = startScotlandBuildMission(state);
    for (const st of SCOTLAND_BUILD_STATIONS) {
      state = completeScotlandBuildStation(state, st.id, st.modelSentence);
    }
    assert.equal(state.rewards.xp, 600);

    state = startCountryReplay(state, 'scotland');
    assert.equal(getScotlandEffectiveEntry(state).completedActivityIds.length, 0);
    assert.equal(isScotlandBuildUnlocked(state), false);

    // Complete DISCOVER, enter BUILD, complete 1 station, then Restart Current Attempt
    state = completeScotlandDiscover(state);
    state = startScotlandBuildMission(state);
    state = completeScotlandBuildStation(
      state,
      'highland_village_square',
      SCOTLAND_BUILD_STATIONS[0].modelSentence,
    );
    assert.equal(
      Object.keys(getScotlandEffectiveEntry(state).scotlandBuiltSentences ?? {}).length,
      1,
    );

    state = restartCountryReplayAttempt(state, 'scotland');
    const restarted = getCountryReplayAttempt(state, 'scotland');
    assert.equal(restarted?.currentStage, 'discover');
    assert.deepEqual(restarted?.completedActivityIds, []);
    assert.equal(state.rewards.xp, 600);
    assert.equal(isScotlandBuildCompleted(state), true); // lifetime BUILD preserved
  });
});

function stateOr(val: LocalProgressV1): LocalProgressV1 {
  return val;
}
