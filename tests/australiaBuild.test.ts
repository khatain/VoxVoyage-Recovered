import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  AUSTRALIA_LANDMARKS,
  AUSTRALIA_MISSION_ID,
  AUSTRALIA_PASSPORT_STAMP_ID,
  AUSTRALIA_RECOMMENDED_ROUTE,
  AUSTRALIA_STAGE_ACTIVITY_IDS,
} from '../src/data/australiaWorld';
import { AUSTRALIA_DISCOVER_MISSION_ORDER } from '../src/data/australiaDiscovery';
import {
  AUSTRALIA_BUILD_ACTIVITY_ID,
  AUSTRALIA_BUILD_MISSION_ORDER,
  AUSTRALIA_BUILD_MISSIONS,
  AUSTRALIA_BUILD_XP_REWARD,
  AUSTRALIA_OLIVIA_BUILD_WELCOME,
  buildBuildSandwichFeedback,
  CAFE_KITCHEN_CHALLENGES,
  CONVERSATION_FORGE_CHALLENGES,
  DARLING_HARBOUR_BUILD_BOARD,
  DIRECTION_ARCHITECT_CHALLENGES,
  DIRECTION_FUNCTION_OPTIONS,
  getAustraliaBuildMissionMeta,
  HARBOUR_CAFE_BUILD_MENU,
  RESCUE_WORKSHOP_CHALLENGES,
  TICKET_INFO_BUILDER_CHALLENGES,
  validateAustraliaBuildBanks,
  validateCafeMultiTurn,
  validateDirectionArchitect,
  validateInfoGapBuilder,
  validateRescueChallenge,
  validateSequenceOrder,
} from '../src/data/australiaBuild';
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
  completeAustraliaBuildMission,
  completeAustraliaDiscoveryMission as completeAusDiscoverInStorage,
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
  getAustraliaBuiltDialogues,
  getAustraliaBuildMissionStatus,
  getAustraliaCompletedBuildIds,
  getAustraliaNextBuildLandmarkId,
  isAustraliaBuildCompleted,
  isAustraliaBuildStarted,
  isAustraliaBuildUnlocked,
  isAustraliaDiscoverCompleted,
  isAustraliaPracticeUnlocked,
  isAustraliaUnlocked,
  markJaipurAaravMet,
  markScotlandNpcMet,
  migrateAndValidateProgress,
  SCOTLAND_PASSPORT_STAMP_ID,
  startAustraliaBuildMission,
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

function buildAustraliaDiscoverCompleteProgress(): LocalProgressV1 {
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

  state = startAustraliaDiscoveryMission(state);
  for (const landmarkId of AUSTRALIA_DISCOVER_MISSION_ORDER) {
    state = completeAusDiscoverInStorage(state, landmarkId);
  }
  return state;
}

describe('Australia Phase 4C Stage 2 BUILD — Interactive Conversation Builder', () => {
  it('verifies Stage 1 DISCOVER baseline (800 XP) unlocks Stage 2 BUILD without skipping requirements', () => {
    const base = createDefaultProgress();
    assert.equal(isAustraliaUnlocked(base), false);
    assert.equal(isAustraliaBuildUnlocked(base), false);
    assert.equal(startAustraliaBuildMission(base).rewards.xp, 0);

    const discoverDone = buildAustraliaDiscoverCompleteProgress();
    assert.equal(isAustraliaDiscoverCompleted(discoverDone), true);
    assert.equal(isAustraliaBuildUnlocked(discoverDone), true);
    assert.equal(isAustraliaBuildStarted(discoverDone), false);
    assert.equal(discoverDone.rewards.xp, 800);
    assert.equal(discoverDone.missionProgress[AUSTRALIA_MISSION_ID]?.currentStage, 'build');
    assert.equal(discoverDone.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID), false);
  });

  it('validates 5 unique BUILD missions mapped 1:1 to recommended Sydney route & 5 distinct mechanics', () => {
    assert.equal(AUSTRALIA_BUILD_MISSIONS.length, 5);
    assert.deepEqual(
      AUSTRALIA_BUILD_MISSIONS.map((m) => m.landmarkId),
      AUSTRALIA_RECOMMENDED_ROUTE,
    );
    assert.deepEqual(AUSTRALIA_BUILD_MISSION_ORDER, AUSTRALIA_RECOMMENDED_ROUTE);

    const missionIds = new Set(AUSTRALIA_BUILD_MISSIONS.map((m) => m.missionId));
    const mechanicIds = new Set(AUSTRALIA_BUILD_MISSIONS.map((m) => m.mechanicId));
    assert.equal(missionIds.size, 5);
    assert.equal(mechanicIds.size, 5);

    const bankCheck = validateAustraliaBuildBanks();
    assert.equal(bankCheck.valid, true, `Bank errors: ${bankCheck.errors.join('; ')}`);

    assert.equal(CONVERSATION_FORGE_CHALLENGES.length, 5);
    assert.equal(DIRECTION_ARCHITECT_CHALLENGES.length, 5);
    assert.equal(CAFE_KITCHEN_CHALLENGES.length, 5);
    assert.equal(TICKET_INFO_BUILDER_CHALLENGES.length, 5);
    assert.equal(RESCUE_WORKSHOP_CHALLENGES.length, 5);
    assert.ok(HARBOUR_CAFE_BUILD_MENU.length >= 6);
    assert.ok(DARLING_HARBOUR_BUILD_BOARD.length >= 6);
    assert.equal(DIRECTION_FUNCTION_OPTIONS.length, 4);
  });

  it('validates Conversation Starter Forge order rules, multiple B1 paths, and helpful rejection feedback', () => {
    const ch1 = CONVERSATION_FORGE_CHALLENGES[0];
    assert.equal(
      validateSequenceOrder(ch1, 'a2', ch1.a2.acceptedSequences[0]).valid,
      true,
    );
    assert.equal(
      validateSequenceOrder(ch1, 'a2', [...ch1.a2.acceptedSequences[0]].reverse()).valid,
      false,
    );
    // B1 supports both 5-turn and 6-turn follow-up paths
    for (const seq of ch1.b1.acceptedSequences) {
      assert.equal(validateSequenceOrder(ch1, 'b1', seq).valid, true);
    }
    const emptyCheck = validateSequenceOrder(ch1, 'a2', []);
    assert.equal(emptyCheck.valid, false);
    assert.ok(emptyCheck.reason.en.length > 5);
    assert.ok(emptyCheck.reason.th.length > 5);
  });

  it('validates Direction Dialogue Architect sentence tiles, function selector, and SVG route node', () => {
    for (const ch of DIRECTION_ARCHITECT_CHALLENGES) {
      for (const lvl of ['a2', 'b1'] as const) {
        const res = validateDirectionArchitect(
          ch,
          lvl,
          ch[lvl].acceptedTileSets[0],
          ch.targetFunction,
          ch.targetRouteNodeId,
        );
        assert.equal(res.valid, true, `${ch.id}.${lvl} should pass`);
      }
    }
    const first = DIRECTION_ARCHITECT_CHALLENGES[0];
    assert.equal(
      validateDirectionArchitect(
        first,
        'a2',
        first.a2.acceptedTileSets[0],
        'thanking_speaker',
        first.targetRouteNodeId,
      ).valid,
      false,
    );
    assert.equal(
      validateDirectionArchitect(
        first,
        'a2',
        first.a2.acceptedTileSets[0],
        first.targetFunction,
        null,
      ).valid,
      false,
    );
  });

  it('validates Café Conversation Kitchen multi-turn selection with >= 2 polite responses per turn', () => {
    for (const ch of CAFE_KITCHEN_CHALLENGES) {
      for (const lvl of ['a2', 'b1'] as const) {
        const selection: Record<string, string> = {};
        for (const t of ch[lvl].turns) {
          const validOpts = t.options.filter((o) => o.isValid);
          assert.ok(validOpts.length >= 2, `${ch.id}.${lvl}.${t.slotId} >= 2 valid choices`);
          selection[t.slotId] = validOpts[0].id;
        }
        assert.equal(validateCafeMultiTurn(ch, lvl, selection).valid, true);

        const firstTurn = ch[lvl].turns[0];
        const invalidOpt = firstTurn.options.find((o) => !o.isValid);
        assert.ok(invalidOpt);
        const badSelection = { ...selection, [firstTurn.slotId]: invalidOpt.id };
        assert.equal(validateCafeMultiTurn(ch, lvl, badSelection).valid, false);
      }
    }
  });

  it('validates Ticket & Information Builder and 3-step Dialogue Rescue Workshop logic', () => {
    for (const ch of TICKET_INFO_BUILDER_CHALLENGES) {
      const validFollow = ch.followUpOptions.find((f) => f.isValid);
      assert.ok(validFollow);
      for (const lvl of ['a2', 'b1'] as const) {
        assert.equal(
          validateInfoGapBuilder(ch, lvl, ch[lvl].acceptedQuestionSets[0], validFollow.id)
            .valid,
          true,
        );
      }
      const badFollow = ch.followUpOptions.find((f) => !f.isValid);
      if (badFollow) {
        assert.equal(
          validateInfoGapBuilder(ch, 'a2', ch.a2.acceptedQuestionSets[0], badFollow.id).valid,
          false,
        );
      }
    }

    for (const ch of RESCUE_WORKSHOP_CHALLENGES) {
      const validFollow = ch.followUpOptions.find((f) => f.isValid);
      assert.ok(validFollow);
      for (const lvl of ['a2', 'b1'] as const) {
        assert.equal(
          validateRescueChallenge(
            ch,
            lvl,
            ch.correctProblemId,
            ch[lvl].acceptedRepairSets[0],
            validFollow.id,
          ).valid,
          true,
        );
      }
      assert.equal(
        validateRescueChallenge(
          ch,
          'a2',
          null,
          ch.a2.acceptedRepairSets[0],
          validFollow.id,
        ).valid,
        false,
      );
    }
  });

  it('enforces sequential BUILD unlock (1->2->3->4->5), 0 XP per mission, +50 XP once at 5/5 (850 total), and unlocks Stage 3 PRACTICE without awarding Stamp', () => {
    let state = buildAustraliaDiscoverCompleteProgress();

    // Cannot play BUILD missions before Olivia launches Stage 2 BUILD
    assert.equal(
      getAustraliaBuildMissionStatus(state, 'circular_quay_plaza').reason,
      'need_olivia_start',
    );
    const blockedBeforeStart = completeAustraliaBuildMission(state, 'circular_quay_plaza');
    assert.deepEqual(getAustraliaCompletedBuildIds(blockedBeforeStart), []);

    state = startAustraliaBuildMission(state);
    assert.equal(isAustraliaBuildStarted(state), true);
    assert.equal(state.rewards.xp, 800);
    assert.equal(getAustraliaNextBuildLandmarkId(state), 'circular_quay_plaza');

    // Reject skipping to Mission 2 or Mission 5 before completing Mission 1
    const skipped = completeAustraliaBuildMission(state, 'city_transit_station');
    assert.deepEqual(getAustraliaCompletedBuildIds(skipped), []);
    assert.equal(
      getAustraliaBuildMissionStatus(state, 'harbour_market_cafe').reason,
      'prerequisite_incomplete',
    );

    // Complete Missions 1..4 sequentially -> 0 XP each
    for (let i = 0; i < 4; i++) {
      const id = AUSTRALIA_BUILD_MISSION_ORDER[i];
      const meta = getAustraliaBuildMissionMeta(id);
      state = completeAustraliaBuildMission(state, id, meta.defaultArtifactModel);
      assert.equal(state.rewards.xp, 800);
      assert.equal(isAustraliaBuildCompleted(state), false);
      assert.equal(isAustraliaPracticeUnlocked(state), false);
      assert.equal(getAustraliaNextBuildLandmarkId(state), AUSTRALIA_BUILD_MISSION_ORDER[i + 1]);
    }

    // Complete Mission 5 -> grants +50 XP ONCE (800 -> 850) and unlocks PRACTICE (Coming Soon)
    const id5 = AUSTRALIA_BUILD_MISSION_ORDER[4];
    state = completeAustraliaBuildMission(
      state,
      id5,
      'Sorry, could you speak a little more slowly, please?',
    );
    assert.equal(state.rewards.xp, 850);
    assert.equal(isAustraliaBuildCompleted(state), true);
    assert.equal(isAustraliaPracticeUnlocked(state), true);
    assert.equal(getAustraliaNextBuildLandmarkId(state), null);
    assert.equal(state.missionProgress[AUSTRALIA_MISSION_ID]?.currentStage, 'practice');
    assert.ok(
      state.missionProgress[AUSTRALIA_MISSION_ID]?.completedActivityIds.includes(
        AUSTRALIA_BUILD_ACTIVITY_ID,
      ),
    );
    assert.equal(Object.keys(getAustraliaBuiltDialogues(state)).length, 5);

    // Must NOT award Australia Passport Stamp, gold/gems, or complete country
    assert.equal(state.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID), false);
    assert.equal(state.rewards.stamps.includes(INDIA_PASSPORT_STAMP_ID), true);
    assert.equal(state.rewards.stamps.includes(KENYA_PASSPORT_STAMP_ID), true);
    assert.equal(state.rewards.stamps.includes(SCOTLAND_PASSPORT_STAMP_ID), true);
    assert.equal(state.rewards.stamps.length, 3);
    assert.equal(state.unlockedCountryIds.includes('egypt'), false);
    assert.equal(canReplayCountry(state, 'australia'), true);
    assert.equal(COUNTRY_REPLAY_CAPABILITIES.australia.isImplemented, true);

    // Replaying any completed BUILD mission stays at 850 XP (no duplicate XP)
    const replayed = completeAustraliaBuildMission(
      state,
      'circular_quay_plaza',
      'Excuse me, could you help me? Where can I find the visitor centre? Thank you very much!',
    );
    assert.equal(replayed.rewards.xp, 850);
  });

  it('persists progress through refresh/migration and strips forged PRACTICE/PERFORM/Stamp entries', () => {
    let state = buildAustraliaDiscoverCompleteProgress();
    state = startAustraliaBuildMission(state);
    for (const id of AUSTRALIA_BUILD_MISSION_ORDER) {
      state = completeAustraliaBuildMission(
        state,
        id,
        getAustraliaBuildMissionMeta(id).defaultArtifactModel,
      );
    }

    // Legitimate state round-trips through JSON + migrateAndValidateProgress at 850 XP
    const restored = migrateAndValidateProgress(JSON.parse(JSON.stringify(state)));
    assert.equal(restored.rewards.xp, 850);
    assert.equal(isAustraliaBuildCompleted(restored), true);
    assert.equal(isAustraliaPracticeUnlocked(restored), true);
    assert.equal(restored.missionProgress[AUSTRALIA_MISSION_ID]?.currentStage, 'practice');

    // Forged PRACTICE/PERFORM IDs, spoofed XP (1000), and Australia Stamp are stripped
    const tampered = JSON.parse(JSON.stringify(state)) as LocalProgressV1;
    tampered.rewards.xp = 1000;
    tampered.rewards.stamps.push(AUSTRALIA_PASSPORT_STAMP_ID);
    tampered.missionProgress[AUSTRALIA_MISSION_ID]!.completedActivityIds.push(
      AUSTRALIA_STAGE_ACTIVITY_IDS.practice,
      AUSTRALIA_STAGE_ACTIVITY_IDS.perform,
    );
    const cleaned = migrateAndValidateProgress(tampered);
    assert.equal(cleaned.rewards.xp, 850);
    assert.equal(cleaned.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID), false);
    assert.equal(
      cleaned.missionProgress[AUSTRALIA_MISSION_ID]?.completedActivityIds.includes(
        AUSTRALIA_STAGE_ACTIVITY_IDS.practice,
      ),
      false,
    );
    assert.equal(
      cleaned.missionProgress[AUSTRALIA_MISSION_ID]?.completedActivityIds.includes(
        AUSTRALIA_STAGE_ACTIVITY_IDS.perform,
      ),
      false,
    );

    // Out-of-order BUILD array prefix without earlier stations is truncated safely
    const jumpTampered = JSON.parse(JSON.stringify(buildAustraliaDiscoverCompleteProgress())) as LocalProgressV1;
    jumpTampered.missionProgress[AUSTRALIA_MISSION_ID]!.australiaBuildStarted = true;
    jumpTampered.missionProgress[AUSTRALIA_MISSION_ID]!.australiaCompletedBuildIds = [
      'darling_harbour_hub',
    ];
    jumpTampered.missionProgress[AUSTRALIA_MISSION_ID]!.completedActivityIds.push(
      AUSTRALIA_BUILD_ACTIVITY_ID,
    );
    const jumpCleaned = migrateAndValidateProgress(jumpTampered);
    assert.equal(isAustraliaBuildCompleted(jumpCleaned), false);
    assert.deepEqual(getAustraliaCompletedBuildIds(jumpCleaned), []);
    assert.equal(jumpCleaned.rewards.xp, 800);
  });

  it('verifies bilingual EN/TH copy, Olivia BUILD welcome, Sandwich feedback, and unbiased shuffle preservation', () => {
    assert.ok(AUSTRALIA_OLIVIA_BUILD_WELCOME.en.includes("You've discovered how people communicate in Sydney."));
    assert.ok(AUSTRALIA_OLIVIA_BUILD_WELCOME.th.length > 20);
    assert.ok(GAME_COPY.en.australiaBuildStageBadge.length > 0);
    assert.ok(GAME_COPY.th.australiaBuildStageBadge.length > 0);
    assert.ok(GAME_COPY.en.navComingSoonAustraliaPractice.length > 0);
    assert.ok(GAME_COPY.th.navComingSoonAustraliaPractice.length > 0);
    assert.ok(AUSTRALIA_LANDMARKS.length === 5);

    const fb = buildBuildSandwichFeedback(true, { en: 'Clear flow!', th: 'ชัดเจนดี!' });
    assert.ok(fb.en.includes('Clear flow!'));
    assert.ok(fb.th.includes('ชัดเจนดี!'));

    const cards = CONVERSATION_FORGE_CHALLENGES[0].a2.cards;
    const shuffled = shuffleArray(cards);
    assert.equal(shuffled.length, cards.length);
    assert.deepEqual(
      shuffled.map((c) => c.id).sort(),
      cards.map((c) => c.id).sort(),
    );
    assert.equal(AUSTRALIA_BUILD_XP_REWARD, 50);
  });
});
