import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import type {
  AustraliaPerformChallengeRecord,
  AustraliaSpeakingEvidenceRecord,
  ScotlandSpeakingReflectionState,
} from '../src/types/game';
import {
  EGYPT_LANDMARKS,
  EGYPT_MISSION_ID,
  EGYPT_PASSPORT_STAMP_ID,
  EGYPT_RECOMMENDED_ROUTE,
} from '../src/data/egyptWorld';
import {
  EGYPT_DISCOVER_MISSIONS,
  EGYPT_DISCOVER_MISSION_ORDER,
  EGYPT_DISCOVERY_ACTIVITY_ID,
  EGYPT_DISCOVERY_XP_REWARD,
  EGYPT_LAYLA_DISCOVER_INTRO,
  EXPEDITION_ESSENTIALS_CHALLENGES,
  FICTIONAL_TABLET_GLYPHS,
  GIZA_BOARD_LANDMARKS,
  PAPYRUS_SEQUENCE_CHALLENGES,
  PHARAOH_CODE_CHALLENGES,
  PYRAMID_PATH_CHALLENGES,
  TEMPLE_GUARDIAN_CHALLENGES,
  simulatePyramidRoute,
  validateExpeditionEssentialsSelection,
  validatePapyrusSequence,
  validatePharaohCodeSubmission,
  validatePyramidPathAttempt,
  validateTempleGuardianSubmission,
  type FictionalGlyphId,
} from '../src/data/egyptDiscover';
import {
  COUNTRY_REPLAY_CAPABILITIES,
  collectJaipurVocabObject,
  completeAustraliaBuildMission,
  completeAustraliaDiscoveryMission,
  completeAustraliaPerformChallenge,
  completeAustraliaPerformMission,
  completeAustraliaPracticeMission,
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
  getEgyptCompletedDiscoverIds,
  getEgyptEffectiveEntry,
  getEgyptMetNpcIds,
  getEgyptNextDiscoverLandmarkId,
  getEgyptVisitedLandmarkIds,
  isEgyptBuildUnlocked,
  isEgyptDiscoverCompleted,
  isEgyptDiscoverStarted,
  isEgyptUnlocked,
  markEgyptPoiExplored,
  markScotlandNpcMet,
  migrateAndValidateProgress,
  startAustraliaBuildMission,
  startAustraliaDiscoveryMission,
  startAustraliaPerformMission,
  startAustraliaPracticeMission,
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
import { GAME_COPY } from '../src/data/i18n';

function buildPreEgyptCompletedBaseline() {
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
  outline.introduction = 'Today I compare Scotland and Thailand through daily life and traditions.';
  outline.similarity = 'Both Scotland and Thailand value warm family gatherings.';
  outline.difference = 'However, Scotland has cooler castles whereas Thailand has warm temples.';
  outline.evidenceNotes = 'For example, tartan weaving compares with Thai silk.';
  outline.conclusion = 'To conclude, both cultures celebrate hospitality with pride.';
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

  // Australia (250 XP -> cumulative 1,000 XP, 4 Stamps)
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
  for (const lmId of AUSTRALIA_PERFORM_CHALLENGE_ORDER) {
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
  p = completeAustraliaPerformMission(p, {
    easiestPart: 'Greeting Olivia and talking about Sydney weather',
    mostChallengingPart: 'Asking to repeat and clarifying a detour mix-up',
    keptConversationGoing: 'I asked clear follow-up questions to the NPC',
    usefulExpression: '"Just to double-check, did you say...?"',
    nextImprovement: 'Speak with a steadier, more confident voice',
    completedAt: '2026-11-23T15:10:00.000Z',
  });

  return p;
}

describe('Phase 5B: Egypt — Stage 1 DISCOVER (Secrets of the Pharaohs)', () => {
  it('aligns all 5 DISCOVER mini-game stations sequentially with EGYPT_RECOMMENDED_ROUTE & bilingual intro copy', () => {
    assert.equal(EGYPT_DISCOVER_MISSIONS.length, 5);
    assert.deepEqual(EGYPT_DISCOVER_MISSION_ORDER, EGYPT_RECOMMENDED_ROUTE);
    assert.deepEqual(
      EGYPT_DISCOVER_MISSIONS.map((m) => m.landmarkId),
      EGYPT_RECOMMENDED_ROUTE,
    );
    assert.equal(EGYPT_DISCOVERY_XP_REWARD, 50);
    assert.ok(EGYPT_LAYLA_DISCOVER_INTRO.greeting.en.length > 20);
    assert.ok(EGYPT_LAYLA_DISCOVER_INTRO.greeting.th.length > 10);

    for (const mission of EGYPT_DISCOVER_MISSIONS) {
      assert.ok(mission.title.en.trim().length > 0);
      assert.ok(mission.title.th.trim().length > 0);
      assert.ok(mission.mechanicLabel.en.trim().length > 0);
      assert.ok(mission.mechanicLabel.th.trim().length > 0);
      assert.ok(mission.instructionFocus.en.trim().length > 0);
      assert.ok(mission.instructionFocus.th.trim().length > 0);
      assert.ok(mission.takeawaySummary.en.trim().length > 0);
      assert.ok(mission.takeawaySummary.th.trim().length > 0);
    }
  });

  it('validates all 60 A2/B1 challenges across Games 1-5: metadata, 3-tier hints, valid pass & invalid fail', () => {
    // Total count check: 5 games x 6 challenges x 2 levels = 60
    assert.equal(EXPEDITION_ESSENTIALS_CHALLENGES.length, 6);
    assert.equal(PYRAMID_PATH_CHALLENGES.length, 6);
    assert.equal(PAPYRUS_SEQUENCE_CHALLENGES.length, 6);
    assert.equal(TEMPLE_GUARDIAN_CHALLENGES.length, 6);
    assert.equal(PHARAOH_CODE_CHALLENGES.length, 6);

    // Game 1 — Expedition Essentials (12 variants)
    for (const ch of EXPEDITION_ESSENTIALS_CHALLENGES) {
      for (const lvl of ['a2', 'b1'] as const) {
        const v = ch[lvl];
        assert.ok(v.instruction.en.trim().length > 0);
        assert.ok(v.instruction.th.trim().length > 0);
        assert.ok(v.spokenEnglish.trim().length > 0);
        assert.ok(v.hints.tier1Vocab.en.trim().length > 0 && v.hints.tier1Vocab.th.trim().length > 0);
        assert.ok(v.hints.tier2Clue.en.trim().length > 0 && v.hints.tier2Clue.th.trim().length > 0);
        assert.ok(v.hints.tier3Scaffold.en.trim().length > 0 && v.hints.tier3Scaffold.th.trim().length > 0);

        const pass = validateExpeditionEssentialsSelection(v, v.requiredIds);
        assert.equal(pass.isCorrect, true, `Game 1 ${ch.id}.${lvl} expected valid selection to pass`);

        const emptyFail = validateExpeditionEssentialsSelection(v, []);
        assert.equal(emptyFail.isCorrect, false);
        assert.ok(emptyFail.reason.en.length > 0 && emptyFail.reason.th.length > 0);

        if (v.forbiddenIds.length > 0) {
          const forbiddenFail = validateExpeditionEssentialsSelection(v, [
            ...v.requiredIds,
            v.forbiddenIds[0],
          ]);
          assert.equal(forbiddenFail.isCorrect, false);
        }
        if (v.requiresOrder && v.requiredIds.length >= 2) {
          const reversed = [...v.requiredIds].reverse();
          const orderFail = validateExpeditionEssentialsSelection(v, reversed);
          assert.equal(orderFail.isCorrect, false);
        }
      }
    }

    // Game 2 — Pyramid Path Puzzle (12 variants + hazard & boundary simulation)
    for (const ch of PYRAMID_PATH_CHALLENGES) {
      for (const lvl of ['a2', 'b1'] as const) {
        const v = ch[lvl];
        assert.ok(v.instruction.en.trim().length > 0);
        assert.ok(v.instruction.th.trim().length > 0);
        assert.ok(v.spokenEnglish.trim().length > 0);
        assert.ok(v.hints.tier1Vocab.en.trim().length > 0 && v.hints.tier2Clue.en.trim().length > 0);
        assert.ok(v.hints.tier3Scaffold.en.trim().length > 0);

        if (v.acceptedExactSequences && v.acceptedExactSequences.length > 0) {
          const pass = validatePyramidPathAttempt(v, v.acceptedExactSequences[0]);
          assert.equal(pass.isCorrect, true, `Game 2 ${ch.id}.${lvl} exact route failed`);
        } else {
          // Verify safe route exists from startCoord to targetCoord avoiding rope hazard
          const sim0 = simulatePyramidRoute(v.startCoord, v.startHeading, []);
          assert.equal(sim0.hitHazard, false);
          assert.equal(sim0.hitBoundary, false);
        }

        const emptyFail = validatePyramidPathAttempt(v, []);
        assert.equal(emptyFail.isCorrect, false);
        assert.ok(emptyFail.reason.en.length > 0 && emptyFail.reason.th.length > 0);
      }
    }
    // Hazard & boundary checks on Giza board
    const ropeTile = GIZA_BOARD_LANDMARKS.find((l) => l.isHazard)!;
    assert.ok(ropeTile);
    const hazardSim = simulatePyramidRoute(
      { col: ropeTile.coord.col, row: ropeTile.coord.row + 1 },
      'N',
      ['FORWARD'],
    );
    assert.equal(hazardSim.hitHazard, true);
    const boundarySim = simulatePyramidRoute({ col: 0, row: 0 }, 'N', ['FORWARD']);
    assert.equal(boundarySim.hitBoundary, true);

    // Game 3 — Papyrus Sequence (12 variants)
    for (const ch of PAPYRUS_SEQUENCE_CHALLENGES) {
      for (const lvl of ['a2', 'b1'] as const) {
        const v = ch[lvl];
        assert.ok(v.instruction.en.trim().length > 0);
        assert.ok(v.instruction.th.trim().length > 0);
        assert.ok(v.spokenEnglish.trim().length > 0);
        assert.ok(v.hints.tier1Vocab.en.trim().length > 0 && v.hints.tier3Scaffold.th.trim().length > 0);

        const pass = validatePapyrusSequence(v, v.acceptedOrders[0]);
        assert.equal(pass.isCorrect, true, `Game 3 ${ch.id}.${lvl} expected accepted order to pass`);

        const wrongOrder = [...v.acceptedOrders[0]].reverse();
        const isAlsoAccepted = v.acceptedOrders.some((o) =>
          o.every((id, idx) => id === wrongOrder[idx]),
        );
        if (!isAlsoAccepted) {
          const fail = validatePapyrusSequence(v, wrongOrder);
          assert.equal(fail.isCorrect, false);
        }
        const incompleteFail = validatePapyrusSequence(v, v.acceptedOrders[0].slice(0, 1));
        assert.equal(incompleteFail.isCorrect, false);
      }
    }

    // Game 4 — Temple Guardian Rules (12 variants across all 5 sub-mechanics)
    for (const ch of TEMPLE_GUARDIAN_CHALLENGES) {
      for (const lvl of ['a2', 'b1'] as const) {
        const v = ch[lvl];
        assert.ok(v.instruction.en.trim().length > 0);
        assert.ok(v.instruction.th.trim().length > 0);
        assert.ok(v.spokenEnglish.trim().length > 0);
        assert.ok(v.hints.tier1Vocab.en.trim().length > 0 && v.hints.tier3Scaffold.en.trim().length > 0);

        if (
          v.mechanic === 'match_sign' ||
          v.mechanic === 'polite_guidance' ||
          v.mechanic === 'conditional_complete'
        ) {
          assert.ok(v.correctOptionId);
          assert.equal(
            validateTempleGuardianSubmission(v, { selectedOptionId: v.correctOptionId }).isCorrect,
            true,
          );
          const wrongOpt = v.options?.find((o) => o.id !== v.correctOptionId);
          assert.ok(wrongOpt);
          assert.equal(
            validateTempleGuardianSubmission(v, { selectedOptionId: wrongOpt.id }).isCorrect,
            false,
          );
        } else if (v.mechanic === 'sort_do_dont') {
          const items = v.sortItems ?? [];
          assert.ok(items.length >= 2);
          const correctBuckets: Record<string, 'do' | 'dont'> = {};
          const wrongBuckets: Record<string, 'do' | 'dont'> = {};
          for (const item of items) {
            correctBuckets[item.id] = item.bucket;
            wrongBuckets[item.id] = item.bucket === 'do' ? 'dont' : 'do';
          }
          assert.equal(
            validateTempleGuardianSubmission(v, { sortBuckets: correctBuckets }).isCorrect,
            true,
          );
          assert.equal(
            validateTempleGuardianSubmission(v, { sortBuckets: wrongBuckets }).isCorrect,
            false,
          );
        } else {
          const pairs = v.purposePairs ?? [];
          assert.equal(pairs.length, 3);
          const sharedPool = pairs[0].purposes;
          assert.ok(sharedPool.length >= 3);
          const correctMatches: Record<string, string> = {};
          const wrongMatches: Record<string, string> = {};
          for (const pair of pairs) {
            correctMatches[pair.ruleId] = pair.correctPurposeId;
            const other = sharedPool.find((p) => p.id !== pair.correctPurposeId)!;
            wrongMatches[pair.ruleId] = other.id;
          }
          assert.equal(
            validateTempleGuardianSubmission(v, { purposeMatches: correctMatches }).isCorrect,
            true,
          );
          assert.equal(
            validateTempleGuardianSubmission(v, { purposeMatches: wrongMatches }).isCorrect,
            false,
          );
        }
      }
    }

    // Game 5 — Pharaoh Instruction Code (12 variants)
    const allGlyphIds = Object.keys(FICTIONAL_TABLET_GLYPHS) as FictionalGlyphId[];
    assert.equal(allGlyphIds.length, 6);
    for (const ch of PHARAOH_CODE_CHALLENGES) {
      for (const lvl of ['a2', 'b1'] as const) {
        const v = ch[lvl];
        assert.ok(v.instruction.en.trim().length > 0);
        assert.ok(v.instruction.th.trim().length > 0);
        assert.ok(v.spokenEnglish.trim().length > 0);
        assert.ok(v.hints.tier1Vocab.en.trim().length > 0 && v.hints.tier3Scaffold.th.trim().length > 0);

        const pass = validatePharaohCodeSubmission(v, v.expectedSequence);
        assert.equal(pass.isCorrect, true, `Game 5 ${ch.id}.${lvl} expected valid code to pass`);

        if (v.forbiddenSymbols.length > 0) {
          const failForbidden = validatePharaohCodeSubmission(v, [
            ...v.expectedSequence,
            v.forbiddenSymbols[0],
          ]);
          assert.equal(failForbidden.isCorrect, false);
        }
        if (v.requiresOrder && v.expectedSequence.length >= 2) {
          const reversed = [...v.expectedSequence].reverse();
          const failOrder = validatePharaohCodeSubmission(v, reversed);
          assert.equal(failOrder.isCorrect, false);
        }
      }
    }
  });

  it('enforces sequential Stage 1 progression, +0 XP for Games 1-4, +50 XP once on Game 5, 0 new stamps, and Replay stays disabled', () => {
    const baseline = buildPreEgyptCompletedBaseline();
    assert.equal(baseline.rewards.xp, 1000);
    assert.equal(baseline.rewards.stamps.length, 4);
    assert.equal(isEgyptUnlocked(baseline), true);
    assert.equal(isEgyptDiscoverStarted(baseline), false);
    assert.equal(getEgyptNextDiscoverLandmarkId(baseline), 'nile_expedition_camp');

    // Cannot complete Station 1 before starting DISCOVER
    const unstartedAttempt = completeEgyptDiscoveryMission(baseline, 'nile_expedition_camp');
    assert.deepEqual(getEgyptCompletedDiscoverIds(unstartedAttempt), []);
    assert.equal(unstartedAttempt.rewards.xp, 1000);

    // Start DISCOVER via Dr. Layla (+0 XP, marks egyptEntered + npc_layla + egyptDiscoverStarted)
    let p = startEgyptDiscoveryMission(baseline);
    assert.equal(p.rewards.xp, 1000);
    assert.equal(p.rewards.stamps.length, 4);
    assert.equal(isEgyptDiscoverStarted(p), true);
    assert.equal(getEgyptEffectiveEntry(p).egyptEntered, true);
    assert.ok(getEgyptMetNpcIds(p).includes('npc_layla'));
    assert.equal(getEgyptNextDiscoverLandmarkId(p), 'nile_expedition_camp');

    // Cannot skip ahead to Game 2 or Game 5 out of order
    const skipped = completeEgyptDiscoveryMission(p, 'giza_pyramid_plaza');
    assert.deepEqual(getEgyptCompletedDiscoverIds(skipped), []);
    const skipped5 = completeEgyptDiscoveryMission(p, 'chamber_of_wisdom');
    assert.deepEqual(getEgyptCompletedDiscoverIds(skipped5), []);

    // Complete Games 1..4 sequentially -> +0 XP each, 4 stamps unchanged
    for (let i = 0; i < 4; i++) {
      const lmId = EGYPT_DISCOVER_MISSION_ORDER[i];
      p = completeEgyptDiscoveryMission(p, lmId);
      assert.equal(p.rewards.xp, 1000, `Expected +0 XP after Station ${i + 1}`);
      assert.equal(p.rewards.stamps.length, 4);
      assert.equal(isEgyptDiscoverCompleted(p), false);
      assert.equal(isEgyptBuildUnlocked(p), false);
      assert.equal(getEgyptNextDiscoverLandmarkId(p), EGYPT_DISCOVER_MISSION_ORDER[i + 1]);
    }
    assert.deepEqual(getEgyptCompletedDiscoverIds(p), EGYPT_DISCOVER_MISSION_ORDER.slice(0, 4));

    // Complete Game 5 -> awards +50 XP ONCE (1000 -> 1050 XP), unlocks BUILD preview, 0 new stamps
    p = completeEgyptDiscoveryMission(p, 'chamber_of_wisdom');
    assert.equal(p.rewards.xp, 1050);
    assert.equal(p.rewards.stamps.length, 4);
    assert.equal(p.rewards.stamps.includes(EGYPT_PASSPORT_STAMP_ID), false);
    assert.equal(isEgyptDiscoverCompleted(p), true);
    assert.equal(isEgyptBuildUnlocked(p), true);
    assert.equal(getEgyptNextDiscoverLandmarkId(p), null);
    assert.deepEqual(getEgyptCompletedDiscoverIds(p), [...EGYPT_DISCOVER_MISSION_ORDER]);

    const egyptEntry = getEgyptEffectiveEntry(p);
    assert.equal(egyptEntry.currentStage, 'build');
    assert.equal(egyptEntry.status, 'in_progress');
    assert.deepEqual(egyptEntry.completedActivityIds, [EGYPT_DISCOVERY_ACTIVITY_ID]);
    assert.equal(getEgyptVisitedLandmarkIds(p).length, 5);

    // Replaying any station grants +0 XP
    for (const lmId of EGYPT_DISCOVER_MISSION_ORDER) {
      p = completeEgyptDiscoveryMission(p, lmId);
      assert.equal(p.rewards.xp, 1050);
      assert.equal(p.rewards.stamps.length, 4);
    }

    // Visiting a landmark after Stage 1 preserves completedActivityIds & currentStage: 'build'
    p = markEgyptPoiExplored(p, 'giza_pyramid_plaza');
    assert.equal(getEgyptEffectiveEntry(p).currentStage, 'build');
    assert.deepEqual(getEgyptEffectiveEntry(p).completedActivityIds, [EGYPT_DISCOVERY_ACTIVITY_ID]);

    // Country Replay stays disabled until Phase 5E
    assert.equal(COUNTRY_REPLAY_CAPABILITIES.egypt.isImplemented, false);
  });

  it('sanitizes tampered/locked Egypt DISCOVER payloads and recalculates legitimate +50 XP on load', () => {
    const unlockedBaseline = buildPreEgyptCompletedBaseline();

    // 1. Forged DISCOVER completion without all 5 sequential IDs gets stripped and does NOT grant +50 XP
    const partialSpoof = JSON.parse(JSON.stringify(unlockedBaseline));
    partialSpoof.missionProgress[EGYPT_MISSION_ID] = {
      missionId: EGYPT_MISSION_ID,
      countryId: 'egypt',
      status: 'in_progress',
      currentStage: 'build',
      completedActivityIds: [EGYPT_DISCOVERY_ACTIVITY_ID],
      egyptDiscoverStarted: true,
      egyptCompletedDiscoverIds: ['nile_expedition_camp', 'chamber_of_wisdom'], // skipped 2-4!
    };
    partialSpoof.rewards.xp = 1500;
    const sanitizedPartial = migrateAndValidateProgress(partialSpoof);
    assert.equal(sanitizedPartial.rewards.xp, 1000);
    assert.equal(isEgyptDiscoverCompleted(sanitizedPartial), false);
    assert.deepEqual(getEgyptCompletedDiscoverIds(sanitizedPartial), ['nile_expedition_camp']);
    assert.deepEqual(getEgyptEffectiveEntry(sanitizedPartial).completedActivityIds, []);
    assert.equal(getEgyptEffectiveEntry(sanitizedPartial).currentStage, 'discover');

    // 2. Legitimate completed DISCOVER round-trips and restores exact 1,050 XP even if XP was edited
    let legit = startEgyptDiscoveryMission(unlockedBaseline);
    for (const lmId of EGYPT_DISCOVER_MISSION_ORDER) {
      legit = completeEgyptDiscoveryMission(legit, lmId);
    }
    const legitTamperedXp = JSON.parse(JSON.stringify(legit));
    legitTamperedXp.rewards.xp = 9999;
    legitTamperedXp.rewards.stamps.push(EGYPT_PASSPORT_STAMP_ID);
    const reloadedLegit = migrateAndValidateProgress(legitTamperedXp);
    assert.equal(reloadedLegit.rewards.xp, 1050);
    assert.equal(reloadedLegit.rewards.stamps.length, 4);
    assert.equal(reloadedLegit.rewards.stamps.includes(EGYPT_PASSPORT_STAMP_ID), false);
    assert.equal(isEgyptDiscoverCompleted(reloadedLegit), true);
    assert.equal(getEgyptEffectiveEntry(reloadedLegit).currentStage, 'build');

    // 3. Locked player cannot forge Egypt DISCOVER progress
    const lockedSpoof = JSON.parse(JSON.stringify(createDefaultProgress()));
    lockedSpoof.missionProgress[EGYPT_MISSION_ID] = {
      missionId: EGYPT_MISSION_ID,
      countryId: 'egypt',
      status: 'in_progress',
      currentStage: 'build',
      completedActivityIds: [EGYPT_DISCOVERY_ACTIVITY_ID],
      egyptEntered: true,
      egyptDiscoverStarted: true,
      egyptCompletedDiscoverIds: [...EGYPT_DISCOVER_MISSION_ORDER],
    };
    const sanitizedLocked = migrateAndValidateProgress(lockedSpoof);
    assert.equal(isEgyptUnlocked(sanitizedLocked), false);
    assert.equal(sanitizedLocked.rewards.xp, 0);
    assert.equal(isEgyptDiscoverStarted(sanitizedLocked), false);
    assert.equal(isEgyptDiscoverCompleted(sanitizedLocked), false);
  });

  it('maintains bilingual i18n parity (26 nav* keys), Chamber sign copy, and clean asset-self-contained files', () => {
    const enNavKeys = Object.keys(GAME_COPY.en).filter((k) => k.startsWith('nav'));
    const thNavKeys = Object.keys(GAME_COPY.th).filter((k) => k.startsWith('nav'));
    assert.equal(enNavKeys.length, 26);
    assert.equal(thNavKeys.length, 26);

    const discoverKeys = Object.keys(GAME_COPY.en).filter((k) => k.startsWith('egyptDiscover'));
    assert.ok(discoverKeys.length >= 30);
    for (const k of discoverKeys) {
      const key = k as keyof typeof GAME_COPY.en;
      assert.ok(String(GAME_COPY.en[key]).trim().length > 0, `Empty EN key: ${k}`);
      assert.ok(String(GAME_COPY.th[key]).trim().length > 0, `Empty TH key: ${k}`);
    }

    const chamber = EGYPT_LANDMARKS.find((l) => l.id === 'chamber_of_wisdom');
    assert.ok(chamber);
    assert.equal(chamber.isSealedInPhase5A, true);

    const projectRoot = process.cwd();
    const sceneContent = fs.readFileSync(
      path.join(projectRoot, 'src/components/egypt/EgyptExplorationScene.tsx'),
      'utf8',
    );
    assert.equal(sceneContent.includes('SEALED · FINAL EXPEDITION REQUIRED'), true);
    assert.equal(sceneContent.includes('SEALED · OPENING IN PHASE 5B'), false);

    const discoverFiles = [
      'src/data/egyptDiscover.ts',
      'src/components/egypt/EgyptDiscoverArtwork.tsx',
      'src/components/egypt/EgyptDiscoverModal.tsx',
      'src/components/egypt/discover/ExpeditionEssentialsGame.tsx',
      'src/components/egypt/discover/PyramidPathPuzzleGame.tsx',
      'src/components/egypt/discover/PapyrusSequenceGame.tsx',
      'src/components/egypt/discover/TempleGuardianRulesGame.tsx',
      'src/components/egypt/discover/PharaohInstructionCodeGame.tsx',
    ];
    for (const rel of discoverFiles) {
      const content = fs.readFileSync(path.join(projectRoot, rel), 'utf8');
      assert.equal(content.includes('animate-pulse'), false, `animate-pulse found in ${rel}`);
      assert.equal(content.includes('border-l-4'), false, `border-l-4 found in ${rel}`);
      assert.equal(content.includes('border-l-2'), false, `border-l-2 found in ${rel}`);
      assert.equal(content.includes('backdrop-blur'), false, `backdrop-blur found in ${rel}`);
      assert.equal(content.includes('generate_image'), false, `generate_image found in ${rel}`);
      assert.equal(content.includes('@google/genai'), false, `@google/genai found in ${rel}`);
      assert.equal(content.includes('fetch('), false, `fetch( found in ${rel}`);
      assert.equal(content.includes('window.alert'), false, `window.alert found in ${rel}`);
      assert.equal(content.includes('window.open'), false, `window.open found in ${rel}`);
    }
  });
});
