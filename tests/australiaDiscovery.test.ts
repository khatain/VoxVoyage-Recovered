import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  AUSTRALIA_LANDMARKS,
  AUSTRALIA_MISSION_ID,
  AUSTRALIA_NPC_TARGETS,
  AUSTRALIA_PASSPORT_STAMP_ID,
  AUSTRALIA_RECOMMENDED_ROUTE,
  AUSTRALIA_STAGE_ACTIVITY_IDS,
} from '../src/data/australiaWorld';
import {
  AUSTRALIA_DISCOVER_MISSION_ORDER,
  AUSTRALIA_DISCOVER_MISSIONS,
  AUSTRALIA_DISCOVERY_ACTIVITY_ID,
  AUSTRALIA_DISCOVERY_XP_REWARD,
  AUSTRALIA_OLIVIA_DISCOVER_WELCOME,
  buildSandwichFeedback,
  CAFE_ORDER_CHALLENGES,
  COMMUNICATION_RESCUE_CHALLENGES,
  DARLING_HARBOUR_INFO_BOARD,
  DIRECTION_DECODER_CHALLENGES,
  DIRECTION_DECODER_PINS,
  getAustraliaDiscoverMissionMeta,
  GREETING_DETECTIVE_SCENARIOS,
  HARBOUR_CAFE_SAMPLE_MENU,
  TICKET_TALK_CHALLENGES,
  validateAustraliaDiscoveryBanks,
} from '../src/data/australiaDiscovery';
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
  completeAustraliaDiscoveryMission,
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
  getAustraliaCompletedDiscoverIds,
  getAustraliaDiscoverMissionStatus,
  getAustraliaNextDiscoverLandmarkId,
  isAustraliaBuildUnlocked,
  isAustraliaDiscoverCompleted,
  isAustraliaDiscoverStarted,
  isAustraliaUnlocked,
  markJaipurAaravMet,
  markScotlandNpcMet,
  migrateAndValidateProgress,
  SCOTLAND_PASSPORT_STAMP_ID,
  startAustraliaDiscoveryMission,
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
import { shuffleArray } from '../src/utils/shuffle';
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
    state = completeKenyaBuildStation(state, st.id, st.modelSentenceA2.en);
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

describe('Phase 4B: Australia — CityTalk Quest (Stage 1 DISCOVER)', () => {
  it('validates all 5 discovery mini-game banks, unique IDs, valid accepted answers, and A2/B1 + EN/TH text', () => {
    const bankCheck = validateAustraliaDiscoveryBanks();
    assert.equal(bankCheck.valid, true, `Bank validation errors: ${bankCheck.errors.join(', ')}`);

    assert.equal(AUSTRALIA_DISCOVER_MISSIONS.length, 5);
    assert.deepEqual(AUSTRALIA_DISCOVER_MISSION_ORDER, AUSTRALIA_RECOMMENDED_ROUTE);
    assert.equal(GREETING_DETECTIVE_SCENARIOS.length, 5);
    assert.equal(DIRECTION_DECODER_CHALLENGES.length, 5);
    assert.equal(DIRECTION_DECODER_PINS.length, 4);
    assert.equal(CAFE_ORDER_CHALLENGES.length, 5);
    assert.equal(HARBOUR_CAFE_SAMPLE_MENU.length >= 4, true);
    assert.equal(TICKET_TALK_CHALLENGES.length, 5);
    assert.equal(DARLING_HARBOUR_INFO_BOARD.length >= 3, true);
    assert.equal(COMMUNICATION_RESCUE_CHALLENGES.length, 5);

    // Every mission aligns strictly with canonical landmark, mechanic, and existing 4 NPCs (no 5th NPC)
    const validNpcSet = new Set(AUSTRALIA_NPC_TARGETS.map((n) => n.id));
    assert.equal(validNpcSet.size, 4);

    assert.deepEqual(
      AUSTRALIA_DISCOVER_MISSIONS.map((m) => [m.order, m.landmarkId, m.missionId, m.npcId, m.mechanicId]),
      [
        [1, 'circular_quay_plaza', 'greeting_detective', 'npc_olivia', 'situation_match'],
        [2, 'city_transit_station', 'direction_decoder', 'npc_noah', 'route_puzzle'],
        [3, 'harbour_market_cafe', 'cafe_order_quest', 'npc_mia', 'cafe_order'],
        [4, 'darling_harbour_hub', 'ticket_talk_challenge', 'npc_jack', 'info_board'],
        [5, 'harbour_gardens_help_point', 'communication_rescue', 'npc_olivia', 'dialogue_repair'],
      ],
    );

    for (const m of AUSTRALIA_DISCOVER_MISSIONS) {
      assert.equal(validNpcSet.has(m.npcId), true);
      assert.ok(m.title.en && m.title.th);
      assert.ok(m.mechanicLabel.en && m.mechanicLabel.th);
      assert.ok(m.communicationFocus.en && m.communicationFocus.th);
      assert.ok(m.introLine.en && m.introLine.th);
      assert.ok(m.secretUnlocked.en && m.secretUnlocked.th);
      assert.equal(getAustraliaDiscoverMissionMeta(m.landmarkId).missionId, m.missionId);
    }

    // Verify A2 & B1 variants differ meaningfully and multi-valid answers + Sandwich Feedback work
    const multiAnswerCount = GREETING_DETECTIVE_SCENARIOS.filter(
      (sc) => sc.acceptedOptionIds.length >= 2,
    ).length;
    assert.ok(multiAnswerCount >= 3);
    for (const sc of GREETING_DETECTIVE_SCENARIOS) {
      assert.notEqual(sc.a2Situation.en, sc.b1Situation.en);
      assert.ok(sc.acceptedOptionIds.length >= 1);
      for (const opt of sc.options) {
        assert.notEqual(opt.a2Text, opt.b1Text);
        assert.ok(opt.feedback.en.length > 0 && opt.feedback.th.length > 0);
      }
    }

    const goodFeedback = buildSandwichFeedback(true, {
      en: 'Polite openings invite quick help.',
      th: 'การทักทายอย่างสุภาพช่วยให้ได้รับความช่วยเหลือไวขึ้น',
    });
    assert.match(goodFeedback.en, /^Great choice!/);
    const retryFeedback = buildSandwichFeedback(false, {
      en: 'Try starting with Excuse me.',
      th: 'ลองขึ้นต้นด้วย Excuse me ดูนะ',
    });
    assert.match(retryFeedback.en, /^Good try!/);
  });

  it('requires Australia unlock and Olivia Stage 1 intro before missions become playable', () => {
    const fresh = createDefaultProgress();
    assert.equal(isAustraliaUnlocked(fresh), false);
    assert.equal(isAustraliaDiscoverStarted(fresh), false);
    assert.equal(getAustraliaDiscoverMissionStatus(fresh, 'circular_quay_plaza').reason, 'world_locked');

    // Cannot start or complete Australia Discovery while Australia is locked
    const blockedStart = startAustraliaDiscoveryMission(fresh);
    assert.equal(isAustraliaDiscoverStarted(blockedStart), false);

    // Unlock Australia via India + Kenya + Scotland baseline (750 XP, 3 stamps)
    const baseline = buildFullScotlandBaselineProgress();
    assert.equal(baseline.rewards.xp, 750);
    assert.equal(isAustraliaUnlocked(baseline), true);
    assert.equal(isAustraliaDiscoverStarted(baseline), false);
    assert.equal(
      getAustraliaDiscoverMissionStatus(baseline, 'circular_quay_plaza').reason,
      'need_olivia_start',
    );
    assert.equal(
      AUSTRALIA_OLIVIA_DISCOVER_WELCOME.en,
      "Exploring a new city is exciting, but sometimes you need to ask questions, find your way, or get help. Let's discover five secrets of successful communication!",
    );

    // Out-of-order completion before Olivia starts is ignored
    const premComplete = completeAustraliaDiscoveryMission(baseline, 'circular_quay_plaza');
    assert.deepEqual(getAustraliaCompletedDiscoverIds(premComplete), []);
    assert.equal(premComplete.rewards.xp, 750);

    // Starting via Olivia marks npc_olivia met + discoverStarted = true (+0 XP)
    const started = startAustraliaDiscoveryMission(baseline);
    assert.equal(isAustraliaDiscoverStarted(started), true);
    assert.equal(started.rewards.xp, 750);
    assert.equal(
      started.missionProgress[AUSTRALIA_MISSION_ID]?.australiaMetNpcIds?.includes('npc_olivia'),
      true,
    );
    assert.equal(getAustraliaNextDiscoverLandmarkId(started), 'circular_quay_plaza');
    assert.equal(
      getAustraliaDiscoverMissionStatus(started, 'circular_quay_plaza').reason,
      'eligible',
    );
    assert.equal(
      getAustraliaDiscoverMissionStatus(started, 'city_transit_station').reason,
      'prerequisite_incomplete',
    );
  });

  it('enforces sequential mission gating (1 -> 2 -> 3 -> 4 -> 5), awards +0 XP individually, and awards +50 XP ONCE on Mission 5', () => {
    let state = startAustraliaDiscoveryMission(buildFullScotlandBaselineProgress());
    assert.equal(state.rewards.xp, 750);

    // Attempt to jump directly to Mission 2, 3, 4, or 5 before Mission 1 must fail cleanly
    for (const futureId of AUSTRALIA_DISCOVER_MISSION_ORDER.slice(1)) {
      const rejected = completeAustraliaDiscoveryMission(state, futureId);
      assert.deepEqual(getAustraliaCompletedDiscoverIds(rejected), []);
      assert.equal(rejected.rewards.xp, 750);
    }

    // Complete Missions 1 through 4 in order: +0 XP each, BUILD still locked
    const firstFour = AUSTRALIA_DISCOVER_MISSION_ORDER.slice(0, 4);
    for (let i = 0; i < firstFour.length; i += 1) {
      const lmId = firstFour[i];
      state = completeAustraliaDiscoveryMission(state, lmId);
      assert.equal(state.rewards.xp, 750, `Mission ${i + 1} must award +0 XP individually`);
      assert.equal(isAustraliaDiscoverCompleted(state), false);
      assert.equal(isAustraliaBuildUnlocked(state), false);
      assert.equal(getAustraliaCompletedDiscoverIds(state).length, i + 1);
      assert.equal(getAustraliaNextDiscoverLandmarkId(state), AUSTRALIA_DISCOVER_MISSION_ORDER[i + 1]);
      assert.equal(getAustraliaDiscoverMissionStatus(state, lmId).reason, 'completed_review');
    }

    // Mission 5 is now eligible
    assert.equal(
      getAustraliaDiscoverMissionStatus(state, 'harbour_gardens_help_point').reason,
      'eligible',
    );

    // Complete Mission 5 -> +50 XP once (750 -> 800), Stage 1 DISCOVER complete, BUILD unlocked, NO Stamp
    state = completeAustraliaDiscoveryMission(state, 'harbour_gardens_help_point');
    assert.equal(state.rewards.xp, 750 + AUSTRALIA_DISCOVERY_XP_REWARD);
    assert.equal(state.rewards.xp, 800);
    assert.equal(isAustraliaDiscoverCompleted(state), true);
    assert.equal(isAustraliaBuildUnlocked(state), true);
    assert.equal(getAustraliaNextDiscoverLandmarkId(state), null);
    assert.deepEqual(getAustraliaCompletedDiscoverIds(state), [...AUSTRALIA_DISCOVER_MISSION_ORDER]);

    const ausEntry = state.missionProgress[AUSTRALIA_MISSION_ID];
    assert.ok(ausEntry);
    assert.equal(ausEntry.currentStage, 'build');
    assert.equal(ausEntry.status, 'in_progress');
    assert.deepEqual(ausEntry.completedActivityIds, [AUSTRALIA_DISCOVERY_ACTIVITY_ID]);
    assert.equal(state.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID), false);
    assert.equal(state.rewards.stamps.length, 3);
    assert.deepEqual(
      state.rewards.stamps.slice().sort(),
      [
        INDIA_PASSPORT_STAMP_ID,
        KENYA_PASSPORT_STAMP_ID,
        SCOTLAND_PASSPORT_STAMP_ID,
      ].sort(),
    );

    // Replaying / re-completing any of the 5 missions grants NO duplicate XP
    for (const lmId of AUSTRALIA_DISCOVER_MISSION_ORDER) {
      const reviewed = completeAustraliaDiscoveryMission(state, lmId);
      assert.equal(reviewed.rewards.xp, 800);
      assert.deepEqual(reviewed.missionProgress[AUSTRALIA_MISSION_ID]?.completedActivityIds, [
        AUSTRALIA_DISCOVERY_ACTIVITY_ID,
      ]);
    }

    // Australia country replay is enabled in Phase 4E once started/completed
    assert.equal(COUNTRY_REPLAY_CAPABILITIES.australia.isImplemented, true);
    assert.equal(canReplayCountry(state, 'australia'), true);
    assert.equal(canReplayCountry(state, 'india'), true);
    assert.equal(canReplayCountry(state, 'kenya'), true);
    assert.equal(canReplayCountry(state, 'scotland'), true);
  });

  it('keeps option shuffling unbiased and independent across repeated runs', () => {
    const firstOptions = GREETING_DETECTIVE_SCENARIOS[0].options;
    const signatures = new Set<string>();
    for (let i = 0; i < 40; i += 1) {
      const shuffled = shuffleArray(firstOptions);
      assert.equal(shuffled.length, firstOptions.length);
      assert.deepEqual(
        shuffled.map((o) => o.id).sort(),
        firstOptions.map((o) => o.id).sort(),
      );
      signatures.add(shuffled.map((o) => o.id).join(','));
    }
    // Over 40 unbiased Fisher-Yates shuffles of 4 items (24 permutations), multiple orders appear
    assert.ok(signatures.size >= 4);
  });

  it('sanitizes tampered DISCOVER persistence and preserves valid Stage 1 DISCOVER + prior stamps across reload', () => {
    let valid = startAustraliaDiscoveryMission(buildFullScotlandBaselineProgress());
    for (const lmId of AUSTRALIA_DISCOVER_MISSION_ORDER) {
      valid = completeAustraliaDiscoveryMission(valid, lmId);
    }

    // Round-trip JSON persistence
    const reloaded = migrateAndValidateProgress(JSON.parse(JSON.stringify(valid)));
    assert.equal(reloaded.rewards.xp, 800);
    assert.equal(isAustraliaDiscoverCompleted(reloaded), true);
    assert.equal(isAustraliaBuildUnlocked(reloaded), true);
    assert.equal(reloaded.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID), false);
    assert.deepEqual(
      getAustraliaCompletedDiscoverIds(reloaded),
      [...AUSTRALIA_DISCOVER_MISSION_ORDER],
    );

    // Tampered persistence: non-contiguous skip + spoofed BUILD/PERFORM + extra XP + Australia stamp
    const partialBaseline = startAustraliaDiscoveryMission(buildFullScotlandBaselineProgress());
    const tampered = migrateAndValidateProgress({
      ...partialBaseline,
      rewards: {
        ...partialBaseline.rewards,
        xp: 950,
        stamps: [...partialBaseline.rewards.stamps, AUSTRALIA_PASSPORT_STAMP_ID],
      },
      missionProgress: {
        ...partialBaseline.missionProgress,
        [AUSTRALIA_MISSION_ID]: {
          status: 'completed',
          currentStage: 'perform',
          completedActivityIds: Object.values(AUSTRALIA_STAGE_ACTIVITY_IDS),
          australiaDiscoverStarted: true,
          // circular_quay_plaza followed immediately by cafe_order without city_transit_station
          australiaCompletedDiscoverIds: [
            'circular_quay_plaza',
            'harbour_market_cafe',
            'darling_harbour_hub',
          ],
        },
      },
    });

    // Only contiguous prefix ['circular_quay_plaza'] survives; premature XP capped back to 750;
    // spoofed BUILD/PRACTICE/PERFORM and Australia stamp are stripped.
    assert.equal(tampered.rewards.xp, 750);
    assert.equal(tampered.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID), false);
    assert.deepEqual(getAustraliaCompletedDiscoverIds(tampered), ['circular_quay_plaza']);
    assert.deepEqual(tampered.missionProgress[AUSTRALIA_MISSION_ID]?.completedActivityIds, []);
    assert.equal(tampered.missionProgress[AUSTRALIA_MISSION_ID]?.currentStage, 'discover');
    assert.equal(tampered.missionProgress[AUSTRALIA_MISSION_ID]?.status, 'in_progress');
    assert.equal(isAustraliaBuildUnlocked(tampered), false);
  });

  it('includes complete EN & TH copy for all Phase 4B discovery keys and preserves landmark focus integrity', () => {
    const phase4bKeys = Object.keys(GAME_COPY.en).filter((k) =>
      k.startsWith('australiaDiscover'),
    );
    assert.ok(phase4bKeys.length >= 25);
    for (const k of phase4bKeys) {
      const key = k as keyof typeof GAME_COPY.en;
      assert.ok(GAME_COPY.en[key].length > 0, `Empty EN copy for ${k}`);
      assert.ok(GAME_COPY.th[key].length > 0, `Empty TH copy for ${k}`);
    }
    assert.equal(AUSTRALIA_LANDMARKS.length, 5);
  });
});
