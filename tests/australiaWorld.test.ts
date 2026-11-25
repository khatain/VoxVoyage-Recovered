import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  AUSTRALIA_BOUNDS,
  AUSTRALIA_INTERACTIVE_TARGETS,
  AUSTRALIA_LANDMARKS,
  AUSTRALIA_MISSION_ID,
  AUSTRALIA_NPC_DIALOGUES,
  AUSTRALIA_NPC_POSITIONS,
  AUSTRALIA_NPC_TARGETS,
  AUSTRALIA_PASSPORT_STAMP_ID,
  AUSTRALIA_RECOMMENDED_ROUTE,
  AUSTRALIA_SPAWN,
  AUSTRALIA_STAGE_ACTIVITY_IDS,
} from '../src/data/australiaWorld';
import { findNearestAustraliaPoi, resolveAustraliaCollision } from '../src/utils/australiaCollision';
import { GAME_COPY } from '../src/data/i18n';
import { JAIPUR_VOCAB_OBJECTS } from '../src/data/jaipurWorld';
import { INDIA_PASSPORT_STAMP_ID } from '../src/data/jaipurShowcase';
import { KENYA_DISCOVERY_TASKS } from '../src/data/kenyaDiscovery';
import { KENYA_BUILD_STATIONS } from '../src/data/kenyaBuild';
import { KENYA_PRACTICE_CONVERSATIONS } from '../src/data/kenyaPractice';
import { KENYA_PASSPORT_STAMP_ID } from '../src/data/kenyaPerform';
import { SCOTLAND_EVIDENCE_ITEMS } from '../src/data/scotlandDiscovery';
import { SCOTLAND_BUILD_STATIONS } from '../src/data/scotlandBuild';
import { SCOTLAND_PRACTICE_MISSIONS } from '../src/data/scotlandPractice';
import {
  createEmptyScotlandPerformOutline,
  SCOTLAND_PERFORM_EVIDENCE_TOPICS,
  SCOTLAND_PERFORM_REFLECTION_ITEMS,
} from '../src/data/scotlandPerform';
import {
  COUNTRY_REPLAY_CAPABILITIES,
  canReplayCountry,
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
  completeScotlandPerformMission,
  completeScotlandPracticeStation,
  createDefaultProgress,
  isAustraliaUnlocked,
  isJaipurMissionCompleted,
  isKenyaMissionCompleted,
  isScotlandMissionCompleted,
  markAustraliaEntered,
  markAustraliaNpcMet,
  markAustraliaPoiExplored,
  markJaipurAaravMet,
  markScotlandNpcMet,
  migrateAndValidateProgress,
  SCOTLAND_PASSPORT_STAMP_ID,
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
import type { LocalProgressV1, ScotlandSpeakingReflectionState } from '../src/types/game';

function buildFullScotlandBaselineProgress(): LocalProgressV1 {
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
  for (const st of KENYA_BUILD_STATIONS) {
    state = completeKenyaBuildStation(
      state,
      st.id,
      st.modelSentenceA2.en,
    );
  }
  state = startKenyaPracticeMission(state);
  for (const conv of KENYA_PRACTICE_CONVERSATIONS) {
    state = completeKenyaPracticeConversation(state, conv.id);
  }
  state = startKenyaPerformMission(state);
  state = completeKenyaFinalPerform(state);

  state = markScotlandNpcMet(state, 'eilidh');
  state = startScotlandDiscoveryMission(state);
  for (const ev of SCOTLAND_EVIDENCE_ITEMS) {
    state = completeScotlandDiscoveryStation(state, ev.id);
  }
  state = startScotlandBuildMission(state);
  for (const st of SCOTLAND_BUILD_STATIONS) {
    state = completeScotlandBuildStation(state, st.id, st.modelSentence);
  }
  state = startScotlandPracticeMission(state);
  const reflection: ScotlandSpeakingReflectionState = {
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
    state = completeScotlandPracticeStation(state, m.id, reflection);
  }

  state = startScotlandPerformMission(state);
  const outline = createEmptyScotlandPerformOutline();
  outline.introduction = 'Today I compare Scotland and Thailand through daily life and traditions.';
  outline.similarity = 'Both Scotland and Thailand value warm family gatherings.';
  outline.difference = 'However, Scotland has cooler castles whereas Thailand has warm temples.';
  outline.evidenceNotes = 'For example, tartan weaving compares with Thai silk.';
  outline.conclusion = 'To conclude, both cultures celebrate hospitality with pride.';

  const reflectionDone: Record<
    (typeof SCOTLAND_PERFORM_REFLECTION_ITEMS)[number]['key'],
    boolean
  > = {
    introducedComparison: true,
    explainedSimilarity: true,
    explainedDifference: true,
    usedSpecificExamples: true,
    answeredBothQuestions: true,
    spokeClearlyConfidently: true,
  };

  state = completeScotlandPerformMission(state, {
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

  return state;
}

describe('Phase 4A: Australia — CityTalk Quest (3D Sydney Foundation)', () => {
  it('keeps Australia locked before Scotland is completed and unlocks after India + Kenya + Scotland Stamp', () => {
    const fresh = createDefaultProgress();
    assert.equal(isAustraliaUnlocked(fresh), false);
    assert.equal(fresh.unlockedCountryIds.includes('australia'), false);

    // Spoof unlock without Scotland completion must be stripped on migration
    const spoofed = migrateAndValidateProgress({
      ...fresh,
      unlockedCountryIds: ['india', 'kenya', 'scotland', 'australia', 'egypt'],
    });
    assert.equal(isAustraliaUnlocked(spoofed), false);
    assert.equal(spoofed.unlockedCountryIds.includes('australia'), false);
    assert.equal(spoofed.unlockedCountryIds.includes('egypt'), false);

    // Legitimate India + Kenya + Scotland completion (750 XP, 3 stamps) unlocks Australia
    const unlocked = buildFullScotlandBaselineProgress();
    assert.equal(unlocked.rewards.xp, 750);
    assert.deepEqual(
      unlocked.rewards.stamps.sort(),
      [
        INDIA_PASSPORT_STAMP_ID,
        KENYA_PASSPORT_STAMP_ID,
        SCOTLAND_PASSPORT_STAMP_ID,
      ].sort(),
    );
    assert.equal(isJaipurMissionCompleted(unlocked), true);
    assert.equal(isKenyaMissionCompleted(unlocked), true);
    assert.equal(isScotlandMissionCompleted(unlocked), true);
    assert.equal(isAustraliaUnlocked(unlocked), true);
    assert.equal(unlocked.unlockedCountryIds.includes('australia'), true);
    assert.equal(unlocked.unlockedCountryIds.includes('egypt'), false);
  });

  it('awards +0 XP, zero stamps, and zero stage 1–4 completions during Phase 4A exploration', () => {
    let state = buildFullScotlandBaselineProgress();
    state = markAustraliaEntered(state);
    state = markAustraliaNpcMet(state, 'npc_olivia');
    state = markAustraliaNpcMet(state, 'npc_noah');
    state = markAustraliaNpcMet(state, 'npc_mia');
    state = markAustraliaNpcMet(state, 'npc_jack');
    for (const lm of AUSTRALIA_LANDMARKS) {
      state = markAustraliaPoiExplored(state, lm.id);
    }

    assert.equal(state.rewards.xp, 750);
    assert.equal(state.rewards.stamps.length, 3);
    assert.equal(state.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID), false);

    const ausEntry = state.missionProgress[AUSTRALIA_MISSION_ID];
    assert.ok(ausEntry);
    assert.equal(ausEntry.status, 'in_progress');
    assert.equal(ausEntry.currentStage, 'discover');
    assert.deepEqual(ausEntry.completedActivityIds, []);
    assert.equal(ausEntry.australiaExploredPoiIds?.length, 5);
    assert.equal(ausEntry.australiaMetNpcIds?.length, 4);

    // Tamper prevention: migrateAndValidateProgress strips spoofed stage completions or Australia stamp
    const tampered = migrateAndValidateProgress({
      ...state,
      rewards: {
        ...state.rewards,
        stamps: [...state.rewards.stamps, AUSTRALIA_PASSPORT_STAMP_ID],
      },
      missionProgress: {
        ...state.missionProgress,
        [AUSTRALIA_MISSION_ID]: {
          status: 'completed',
          currentStage: 'perform',
          completedActivityIds: Object.values(AUSTRALIA_STAGE_ACTIVITY_IDS),
          australiaExploredPoiIds: ['circular_quay_plaza', 'bogus_landmark'],
          australiaMetNpcIds: ['npc_olivia', 'bogus_npc'],
        },
      },
    });
    assert.equal(tampered.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID), false);
    assert.equal(tampered.missionProgress[AUSTRALIA_MISSION_ID]?.status, 'in_progress');
    assert.equal(tampered.missionProgress[AUSTRALIA_MISSION_ID]?.currentStage, 'discover');
    assert.deepEqual(tampered.missionProgress[AUSTRALIA_MISSION_ID]?.completedActivityIds, []);
    assert.deepEqual(tampered.missionProgress[AUSTRALIA_MISSION_ID]?.australiaExploredPoiIds, [
      'circular_quay_plaza',
    ]);
    assert.deepEqual(tampered.missionProgress[AUSTRALIA_MISSION_ID]?.australiaMetNpcIds, [
      'npc_olivia',
    ]);
  });

  it('defines all 5 unique landmarks, canonical recommended route order, and City Explorer Guide focuses', () => {
    const expectedIds = [
      'circular_quay_plaza',
      'city_transit_station',
      'harbour_market_cafe',
      'darling_harbour_hub',
      'harbour_gardens_help_point',
    ];
    assert.equal(AUSTRALIA_LANDMARKS.length, 5);
    assert.deepEqual(AUSTRALIA_RECOMMENDED_ROUTE, expectedIds);

    const uniqueIds = new Set(AUSTRALIA_LANDMARKS.map((l) => l.id));
    assert.equal(uniqueIds.size, 5);
    for (const id of expectedIds) {
      assert.equal(uniqueIds.has(id as typeof AUSTRALIA_LANDMARKS[number]['id']), true);
    }

    for (const lm of AUSTRALIA_LANDMARKS) {
      assert.ok(lm.title.en.length > 0 && lm.title.th.length > 0);
      assert.ok(lm.description.en.length > 0 && lm.description.th.length > 0);
      assert.ok(lm.languageFocus.en.length > 0 && lm.languageFocus.th.length > 0);
      assert.ok(lm.culturalNote.en.length > 0 && lm.culturalNote.th.length > 0);
    }
  });

  it('defines 4 named Sydney NPCs including Olivia Parker’s verbatim intro quote', () => {
    assert.equal(AUSTRALIA_NPC_TARGETS.length, 4);
    assert.equal(Object.keys(AUSTRALIA_NPC_POSITIONS).length, 4);

    assert.equal(AUSTRALIA_NPC_DIALOGUES.npc_olivia.name, 'Olivia Parker');
    assert.equal(AUSTRALIA_NPC_DIALOGUES.npc_noah.name, 'Noah Williams');
    assert.equal(AUSTRALIA_NPC_DIALOGUES.npc_mia.name, 'Mia Chen');
    assert.equal(AUSTRALIA_NPC_DIALOGUES.npc_jack.name, 'Jack Thompson');

    assert.equal(
      AUSTRALIA_NPC_DIALOGUES.npc_olivia.greetingQuote.en,
      'Welcome to Sydney! This city is full of exciting places to explore. But every great adventure begins with communication. Ready to discover how people connect in English?',
    );
  });

  it('keeps spawn, all 5 landmarks, and all 4 NPC trigger zones collision-safe and reachable', () => {
    const resolvedSpawn = resolveAustraliaCollision(AUSTRALIA_SPAWN.x, AUSTRALIA_SPAWN.z);
    assert.equal(Math.abs(resolvedSpawn.x - AUSTRALIA_SPAWN.x) < 0.05, true);
    assert.equal(Math.abs(resolvedSpawn.z - AUSTRALIA_SPAWN.z) < 0.05, true);

    // Player cannot cross Sydney Harbour seawall into deep water
    const pushedWater = resolveAustraliaCollision(0, -17.0);
    assert.ok(pushedWater.z >= -13.6 + AUSTRALIA_BOUNDS.playerRadius - 0.01);

    // Every landmark and NPC center resolves cleanly within its own interactive radius
    for (const target of AUSTRALIA_INTERACTIVE_TARGETS) {
      const clamped = resolveAustraliaCollision(target.position.x, target.position.z);
      const nearest = findNearestAustraliaPoi(clamped.x, clamped.z);
      assert.ok(nearest, `Target ${target.id} must be reachable without obstacle trap`);
      assert.equal(nearest.id, target.id);
    }
  });

  it('provides full bilingual EN and TH Australia copy and preserves India/Kenya/Scotland replay safety', () => {
    const ausKeys = Object.keys(GAME_COPY.en).filter(
      (k) => k.startsWith('australia') || k === 'worldMapAustraliaUnlockHint' || k === 'arrivingAustraliaTitle' || k === 'arrivingAustraliaSubtitle',
    );
    assert.ok(ausKeys.length >= 25);
    for (const key of ausKeys) {
      const k = key as keyof typeof GAME_COPY.en;
      assert.ok(GAME_COPY.en[k].length > 0, `Missing EN key: ${key}`);
      assert.ok(GAME_COPY.th[k].length > 0, `Missing TH key: ${key}`);
    }

    const baseline = buildFullScotlandBaselineProgress();
    assert.equal(canReplayCountry(baseline, 'india'), true);
    assert.equal(canReplayCountry(baseline, 'kenya'), true);
    assert.equal(canReplayCountry(baseline, 'scotland'), true);
    assert.equal(COUNTRY_REPLAY_CAPABILITIES.australia.isImplemented, true);
    assert.equal(canReplayCountry(baseline, 'australia'), false);
  });
});
