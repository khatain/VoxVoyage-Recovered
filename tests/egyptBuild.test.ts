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
  EGYPT_LANDMARKS,
  EGYPT_MISSION_ID,
  EGYPT_PASSPORT_STAMP_ID,
  EGYPT_RECOMMENDED_ROUTE,
  type EgyptLandmarkId,
} from '../src/data/egyptWorld';
import {
  EGYPT_DISCOVER_MISSION_ORDER,
  EGYPT_DISCOVERY_ACTIVITY_ID,
} from '../src/data/egyptDiscover';
import {
  ALL_EGYPT_BUILD_CHALLENGE_IDS,
  EGYPT_BUILD_ACTIVITY_ID,
  EGYPT_BUILD_MISSIONS,
  EGYPT_BUILD_MISSION_ORDER,
  EGYPT_BUILD_XP_REWARD,
  EGYPT_LAYLA_BUILD_INTRO,
  EXPEDITION_COMMAND_FORGE_CHALLENGES,
  GAME_ID_BY_LANDMARK,
  PAPYRUS_WORKSHOP_CHALLENGES,
  PHARAOH_BLUEPRINT_CHALLENGES,
  PYRAMID_ROUTE_ARCHITECT_CHALLENGES,
  SKILL_CATEGORY_BY_GAME_ID,
  TEMPLE_RULE_ARCHITECT_CHALLENGES,
  getEgyptBuildGameChallengeIds,
  makeEgyptJournalRecordId,
  normalizeEnglishSentenceForCheck,
  sanitizeEgyptBuildJournal,
  simulateArchitectRoute,
  validateCommandForgeSubmission,
  validatePapyrusWorkshopSubmission,
  validatePharaohBlueprintSubmission,
  validatePyramidRouteArchitectSubmission,
  validateTempleRuleArchitectSubmission,
  type PapyrusStepDraft,
} from '../src/data/egyptBuild';
import {
  COUNTRY_REPLAY_CAPABILITIES,
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
  getEgyptBuildJournal,
  getEgyptCompletedBuildChallengeIds,
  getEgyptCompletedBuildIds,
  getEgyptEffectiveEntry,
  getEgyptNextBuildLandmarkId,
  isEgyptBuildCompleted,
  isEgyptBuildStarted,
  isEgyptBuildUnlocked,
  isEgyptDiscoverCompleted,
  isEgyptPracticeUnlocked,
  isEgyptUnlocked,
  markScotlandNpcMet,
  migrateAndValidateProgress,
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
import { voxAudio } from '../src/utils/audioEngine';

function buildEgyptDiscoverCompletedBaseline() {
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

  // Egypt Stage 1 DISCOVER (+50 XP -> 1,050 XP, 4 stamps)
  p = startEgyptDiscoveryMission(p);
  for (const lmId of EGYPT_DISCOVER_MISSION_ORDER) {
    p = completeEgyptDiscoveryMission(p, lmId);
  }

  return p;
}

/**
 * Splits a canonical sentence into exact tile values present in a tile list
 * so tests can simulate clicking authored tiles cleanly (including duplicate words).
 */
function pickTilesMatchingSentence(
  tiles: Array<{ instanceId: string; value: string; isDistractor?: boolean }>,
  canonicalSentence: string,
): string[] {
  const nonDistractors = tiles.filter((t) => !t.isDistractor);
  const fullNorm = normalizeEnglishSentenceForCheck(canonicalSentence).toLowerCase();

  // Exact subsequence search matching canonical string when joined
  const result: string[] = [];
  let cursor = '';
  const used = new Set<string>();

  const targetWords = fullNorm.replace(/,/g, ' , ').replace(/\s+/g, ' ').trim();
  const cleanJoined = (vals: string[]) =>
    vals
      .join(' ')
      .replace(/\s+([,.;!?])/g, '$1')
      .replace(/\s+/g, ' ')
      .replace(/[.!?]+$/g, '')
      .toLowerCase();

  function dfs(): boolean {
    const joined = cleanJoined(result);
    if (joined === fullNorm) return true;
    for (const t of nonDistractors) {
      if (used.has(t.instanceId)) continue;
      const next = cleanJoined([...result, t.value]);
      if (
        fullNorm.startsWith(next) &&
        (fullNorm.length === next.length ||
          fullNorm.charAt(next.length) === ' ' ||
          fullNorm.charAt(next.length) === ',')
      ) {
        used.add(t.instanceId);
        result.push(t.value);
        if (dfs()) return true;
        result.pop();
        used.delete(t.instanceId);
      }
    }
    return false;
  }

  void cursor;
  void targetWords;
  assert.equal(
    dfs(),
    true,
    `Failed to assemble canonical sentence "${canonicalSentence}" from non-distractor tiles`,
  );
  return result;
}

describe('Phase 5C: Egypt Stage 2 — BUILD: Ancient Instruction Builder', () => {
  it('defines 5 BUILD stations mapped sequentially across EGYPT_RECOMMENDED_ROUTE with 6 A2 + 6 B1 challenges each (30 bundles / 60 variants)', () => {
    assert.equal(EGYPT_BUILD_XP_REWARD, 50);
    assert.equal(EGYPT_BUILD_ACTIVITY_ID, 'egypt_instruction_builder');
    assert.deepEqual(EGYPT_BUILD_MISSION_ORDER, EGYPT_RECOMMENDED_ROUTE);
    assert.equal(EGYPT_BUILD_MISSIONS.length, 5);
    assert.equal(ALL_EGYPT_BUILD_CHALLENGE_IDS.length, 30);
    assert.equal(new Set(ALL_EGYPT_BUILD_CHALLENGE_IDS).size, 30);

    assert.equal(EXPEDITION_COMMAND_FORGE_CHALLENGES.length, 6);
    assert.equal(PYRAMID_ROUTE_ARCHITECT_CHALLENGES.length, 6);
    assert.equal(PAPYRUS_WORKSHOP_CHALLENGES.length, 6);
    assert.equal(TEMPLE_RULE_ARCHITECT_CHALLENGES.length, 6);
    assert.equal(PHARAOH_BLUEPRINT_CHALLENGES.length, 6);

    assert.ok(EGYPT_LAYLA_BUILD_INTRO.rankUpLabel.en.includes('Expedition Assistant'));
    assert.ok(EGYPT_LAYLA_BUILD_INTRO.greeting.en.trim().length > 20);
    assert.ok(EGYPT_LAYLA_BUILD_INTRO.greeting.th.trim().length > 10);

    const chamber = EGYPT_LANDMARKS.find((l) => l.id === 'chamber_of_wisdom');
    assert.ok(chamber?.isSealedInPhase5A);
  });

  it('validates all 60 authored A2 & B1 canonical constructions and rejects incomplete/wrong-order/distractor/unsafe/rude answers across Games 1–5', () => {
    // GAME 1 — Expedition Command Forge (12 variants)
    for (const ch of EXPEDITION_COMMAND_FORGE_CHALLENGES) {
      for (const lvl of ['a2', 'b1'] as const) {
        const v = ch[lvl];
        // Ensure unique instanceIds even when repeated words exist
        const ids = v.tiles.map((t) => t.instanceId);
        assert.equal(new Set(ids).size, ids.length, `Duplicate instanceId in ${ch.challengeId}.${lvl}`);

        const canonicalTiles = pickTilesMatchingSentence(v.tiles, v.canonicalModel);
        const pass = validateCommandForgeSubmission(v, canonicalTiles);
        assert.equal(pass.isCorrect, true, `Game 1 ${ch.challengeId}.${lvl} canonical failed: ${pass.feedback.en}`);

        // Reversed pair fails
        const failReverse = validateCommandForgeSubmission(v, [...canonicalTiles].reverse());
        assert.equal(failReverse.isCorrect, false, `Game 1 ${ch.challengeId}.${lvl} reversed should fail`);

        // Incomplete single token fails
        const failIncomplete = validateCommandForgeSubmission(v, [canonicalTiles[0]]);
        assert.equal(failIncomplete.isCorrect, false);

        // Using a distractor fails
        const distractor = v.tiles.find((t) => t.isDistractor);
        if (distractor) {
          const failDistractor = validateCommandForgeSubmission(v, [
            distractor.value,
            ...canonicalTiles.slice(1),
          ]);
          assert.equal(failDistractor.isCorrect, false);
        }
      }
    }

    // GAME 2 — Pyramid Route Architect (12 variants + deterministic map simulator)
    for (const ch of PYRAMID_ROUTE_ARCHITECT_CHALLENGES) {
      for (const lvl of ['a2', 'b1'] as const) {
        const v = ch[lvl];
        const ids = v.tiles.map((t) => t.instanceId);
        assert.equal(new Set(ids).size, ids.length, `Duplicate instanceId in ${ch.challengeId}.${lvl}`);

        const canonicalTiles = pickTilesMatchingSentence(v.tiles, v.canonicalModel);
        const pass = validatePyramidRouteArchitectSubmission(v, canonicalTiles);
        assert.equal(pass.validGrammar, true, `Game 2 ${ch.challengeId}.${lvl} grammar failed: ${pass.feedback.en}`);
        assert.equal(pass.validRoute, true, `Game 2 ${ch.challengeId}.${lvl} route failed: ${pass.feedback.en}`);
        assert.equal(pass.reachedEnd, true);
        assert.equal(pass.hitBlocked, false);
        assert.equal(pass.outOfBounds, false);
        assert.ok(pass.path.length >= 2);

        const failEmpty = validatePyramidRouteArchitectSubmission(v, []);
        assert.equal(failEmpty.validRoute, false);
        assert.equal(failEmpty.failureReasonKey, 'incomplete_phrase');

        // Reversed tiles fail overall acceptance (grammar is invalid even if a motion clause happens to walk straight)
        const failRev = validatePyramidRouteArchitectSubmission(v, [...canonicalTiles].reverse());
        assert.equal(failRev.validGrammar, false);
        assert.equal(failRev.validGrammar && failRev.validRoute, false);
      }
    }

    // Verify deterministic blocked-tile & out-of-bounds detection in simulateArchitectRoute
    const blockedSim = simulateArchitectRoute(
      PYRAMID_ROUTE_ARCHITECT_CHALLENGES[0].a2,
      'Walk straight north two blocks, turn right, and walk one block.',
    );
    assert.equal(blockedSim.validRoute, false);
    assert.equal(blockedSim.hitBlocked, true);
    assert.equal(blockedSim.failureReasonKey, 'hit_blocked');

    const boundsSim = simulateArchitectRoute(
      PYRAMID_ROUTE_ARCHITECT_CHALLENGES[0].a2,
      'Walk straight north four blocks.',
    );
    assert.equal(boundsSim.validRoute, false);
    assert.equal(boundsSim.outOfBounds, true);
    assert.equal(boundsSim.failureReasonKey, 'out_of_bounds');

    // GAME 3 — Papyrus Instruction Workshop (12 variants)
    for (const ch of PAPYRUS_WORKSHOP_CHALLENGES) {
      for (const lvl of ['a2', 'b1'] as const) {
        const v = ch[lvl];
        assert.ok(v.stepsInCorrectOrder.length >= 3);

        const validDrafts: PapyrusStepDraft[] = v.stepsInCorrectOrder.map((step) => ({
          stepId: step.stepId,
          sequencer: step.allowedSequencers[step.preferredSequencerIndex],
          verb: step.correctVerb,
          complement: step.correctComplement,
        }));
        const pass = validatePapyrusWorkshopSubmission(v, validDrafts);
        assert.equal(pass.isCorrect, true, `Game 3 ${ch.challengeId}.${lvl} canonical failed: ${pass.feedback.en}`);
        assert.equal(pass.lines.length, v.stepsInCorrectOrder.length);

        // Wrong step order fails
        const wrongOrderDrafts = [...validDrafts].reverse();
        const failOrder = validatePapyrusWorkshopSubmission(v, wrongOrderDrafts);
        assert.equal(failOrder.isCorrect, false, `Game 3 ${ch.challengeId}.${lvl} wrong order should fail`);

        // Wrong sequencer on first step ("Finally," instead of "First,") fails
        const wrongSeqDrafts = validDrafts.map((d, i) =>
          i === 0 ? { ...d, sequencer: 'Finally,' } : d,
        );
        const failSeq = validatePapyrusWorkshopSubmission(v, wrongSeqDrafts);
        assert.equal(failSeq.isCorrect, false);
      }
    }

    // GAME 4 — Temple Rule Architect (12 variants + pragmatic tone enforcement)
    for (const ch of TEMPLE_RULE_ARCHITECT_CHALLENGES) {
      for (const lvl of ['a2', 'b1'] as const) {
        const v = ch[lvl];
        const ids = v.tiles.map((t) => t.instanceId);
        assert.equal(new Set(ids).size, ids.length, `Duplicate instanceId in ${ch.challengeId}.${lvl}`);

        const canonicalTiles = pickTilesMatchingSentence(v.tiles, v.canonicalModel);
        const pass = validateTempleRuleArchitectSubmission(v, canonicalTiles);
        assert.equal(pass.isCorrect, true, `Game 4 ${ch.challengeId}.${lvl} canonical failed: ${pass.feedback.en}`);

        const failRev = validateTempleRuleArchitectSubmission(v, [...canonicalTiles].reverse());
        assert.equal(failRev.isCorrect, false);
      }
    }

    // Specific pragmatic distractor test: grammatically valid blunt command rejected for Polite Welcome Request
    const bluntTest = validateTempleRuleArchitectSubmission(
      TEMPLE_RULE_ARCHITECT_CHALLENGES[0].a2,
      ['Stay', 'inside', 'the', 'shaded walkway'],
    );
    assert.equal(bluntTest.isCorrect, false);
    assert.ok(bluntTest.feedback.en.includes('Please'));

    // GAME 5 — Pharaoh's Master Blueprint (12 variants × 4 sections each)
    for (const ch of PHARAOH_BLUEPRINT_CHALLENGES) {
      for (const lvl of ['a2', 'b1'] as const) {
        const v = ch[lvl];
        assert.equal(v.sections.length, 4);
        const goodSelections: Record<string, string[]> = {};
        for (const sec of v.sections) {
          goodSelections[sec.sectionId] = pickTilesMatchingSentence(
            sec.tiles,
            sec.canonicalLine,
          );
        }
        const pass = validatePharaohBlueprintSubmission(v, goodSelections);
        assert.equal(pass.isCorrect, true, `Game 5 ${ch.challengeId}.${lvl} canonical failed: ${pass.feedback.en}`);
        assert.equal(pass.lines.length, 4);

        // Break one section -> fails and reports broken section
        const brokenSelections = {
          ...goodSelections,
          rule_check: ['bad'],
        };
        const failOne = validatePharaohBlueprintSubmission(v, brokenSelections);
        assert.equal(failOne.isCorrect, false);
        assert.equal(failOne.sectionResults.rule_check.isCorrect, false);
        assert.equal(failOne.sectionResults.prep.isCorrect, true);
      }
    }
  });

  it('enforces Stage 2 BUILD unlock gates, sequential stations, Journal upsert deduplication, +0 XP for stations 1-4, and +50 XP ONCE on completion with 4 stamps preserved', () => {
    // Before completing DISCOVER, BUILD is locked
    const unstartedEgypt = createDefaultProgress();
    assert.equal(isEgyptBuildUnlocked(unstartedEgypt), false);

    // Baseline: DISCOVER completed (1,050 XP, 4 stamps)
    let p = buildEgyptDiscoverCompletedBaseline();
    assert.equal(p.rewards.xp, 1050);
    assert.equal(p.rewards.stamps.length, 4);
    assert.equal(isEgyptDiscoverCompleted(p), true);
    assert.equal(isEgyptBuildUnlocked(p), true);
    assert.equal(isEgyptBuildStarted(p), false);
    assert.equal(isEgyptBuildCompleted(p), false);
    assert.equal(isEgyptPracticeUnlocked(p), false);
    assert.equal(getEgyptNextBuildLandmarkId(p), 'nile_expedition_camp');

    // Cannot complete Station 1 before starting BUILD briefing
    const unstartedAttempt = completeEgyptBuildMission(p, 'nile_expedition_camp');
    assert.equal(isEgyptBuildStarted(unstartedAttempt), false);
    assert.equal(unstartedAttempt.rewards.xp, 1050);

    // Start BUILD via Dr. Layla (+0 XP)
    p = startEgyptBuildMission(p);
    assert.equal(p.rewards.xp, 1050);
    assert.equal(p.rewards.stamps.length, 4);
    assert.equal(isEgyptBuildStarted(p), true);

    // Helper to record all 6 challenges of a landmark into Journal
    const recordStationChallenges = (
      prog: typeof p,
      landmarkId: EgyptLandmarkId,
      attemptNumber = 1,
      prefix = 'First,',
    ) => {
      let cur = prog;
      const gameId = GAME_ID_BY_LANDMARK[landmarkId];
      const ids = getEgyptBuildGameChallengeIds(landmarkId);
      for (const cid of ids) {
        const rec: EgyptInstructionJournalRecord = {
          id: makeEgyptJournalRecordId(gameId, cid),
          missionId: EGYPT_MISSION_ID,
          gameId,
          landmarkId,
          challengeId: cid,
          challengeTitle: { en: `Challenge ${cid}`, th: `โจทย์ ${cid}` },
          cefrLevel: attemptNumber > 1 ? 'b1' : 'a2',
          instructionText: `${prefix} pack compass and check map for ${cid}.`,
          instructionLines: [`${prefix} pack compass and check map for ${cid}.`],
          thaiScaffold: 'คำอธิบายภาษาไทย',
          skillCategory: SKILL_CATEGORY_BY_GAME_ID[gameId],
          completedAt: '2026-11-24T12:00:00.000Z',
          attemptNumber,
        };
        cur = recordEgyptBuildChallenge(cur, rec);
      }
      return cur;
    };

    // Cannot complete Station 1 when only 5 of 6 challenges solved
    const partialStationIds = getEgyptBuildGameChallengeIds('nile_expedition_camp');
    for (const cid of partialStationIds.slice(0, 5)) {
      p = recordEgyptBuildChallenge(p, {
        id: makeEgyptJournalRecordId('expedition_command_forge', cid),
        missionId: EGYPT_MISSION_ID,
        gameId: 'expedition_command_forge',
        landmarkId: 'nile_expedition_camp',
        challengeId: cid,
        challengeTitle: { en: cid, th: cid },
        cefrLevel: 'a2',
        instructionText: 'Pack the compass.',
        instructionLines: ['Pack the compass.'],
        skillCategory: 'imperatives_and_objects',
        completedAt: '2026-11-24T12:00:00.000Z',
      });
    }
    const stillIncomplete1 = completeEgyptBuildMission(p, 'nile_expedition_camp');
    assert.deepEqual(getEgyptCompletedBuildIds(stillIncomplete1), []);

    // Complete Stations 1..4 sequentially -> +0 XP each, stamps remain 4
    p = recordStationChallenges(p, 'nile_expedition_camp');
    // Cannot skip to Station 2 before completing Station 1
    p = recordStationChallenges(p, 'giza_pyramid_plaza');
    const skipCheck = completeEgyptBuildMission(p, 'giza_pyramid_plaza');
    assert.deepEqual(getEgyptCompletedBuildIds(skipCheck), []);

    for (let i = 0; i < 4; i++) {
      const lmId = EGYPT_BUILD_MISSION_ORDER[i];
      p = recordStationChallenges(p, lmId);
      p = completeEgyptBuildMission(p, lmId);
      assert.equal(p.rewards.xp, 1050, `Expected +0 XP after BUILD station ${i + 1}`);
      assert.equal(p.rewards.stamps.length, 4);
      assert.equal(isEgyptBuildCompleted(p), false);
      assert.equal(getEgyptNextBuildLandmarkId(p), EGYPT_BUILD_MISSION_ORDER[i + 1]);
    }
    assert.equal(getEgyptCompletedBuildChallengeIds(p).length, 24);
    assert.equal(getEgyptBuildJournal(p).length, 24);

    // Journal upsert / no-duplicate test: revising a challenge replaces cleanly in-place
    const beforeRevLen = getEgyptBuildJournal(p).length;
    p = recordStationChallenges(p, 'nile_expedition_camp', 2, 'Revised:');
    const journalAfterRev = getEgyptBuildJournal(p);
    assert.equal(journalAfterRev.length, beforeRevLen);
    const revisedFirst = journalAfterRev.find(
      (j) => j.id === 'expedition_command_forge:ec_1_simple_imperative',
    );
    assert.ok(revisedFirst);
    assert.equal(revisedFirst.cefrLevel, 'b1');
    assert.equal(revisedFirst.attemptNumber, 2);
    assert.ok(revisedFirst.instructionText.startsWith('Revised:'));

    // Complete Station 5 -> awards +50 XP ONCE (1,050 -> 1,100), 0 new stamps
    p = recordStationChallenges(p, 'chamber_of_wisdom');
    p = completeEgyptBuildMission(p, 'chamber_of_wisdom');

    assert.equal(p.rewards.xp, 1100);
    assert.equal(p.rewards.stamps.length, 4);
    assert.equal(p.rewards.stamps.includes(EGYPT_PASSPORT_STAMP_ID), false);
    assert.equal(isEgyptBuildCompleted(p), true);
    assert.equal(isEgyptPracticeUnlocked(p), true);
    assert.equal(getEgyptNextBuildLandmarkId(p), null);
    assert.equal(getEgyptCompletedBuildIds(p).length, 5);
    assert.equal(getEgyptCompletedBuildChallengeIds(p).length, 30);
    assert.equal(getEgyptBuildJournal(p).length, 30);

    const entry = getEgyptEffectiveEntry(p);
    assert.equal(entry.status, 'in_progress');
    assert.equal(entry.currentStage, 'practice');
    assert.deepEqual(entry.completedActivityIds, [
      EGYPT_DISCOVERY_ACTIVITY_ID,
      EGYPT_BUILD_ACTIVITY_ID,
    ]);

    // Replaying Game 5 awards +0 duplicate XP
    p = completeEgyptBuildMission(p, 'chamber_of_wisdom');
    assert.equal(p.rewards.xp, 1100);
    assert.equal(p.rewards.stamps.length, 4);
    assert.equal(COUNTRY_REPLAY_CAPABILITIES.egypt.isImplemented, false);
  });

  it('migrates Phase 5B saves safely and strips tampered BUILD / Practice / Perform / Stamp payloads', () => {
    // 1. Phase 5B save (DISCOVER completed, no BUILD fields) preserves 1,050 XP & 4 stamps cleanly
    const phase5bSave = JSON.parse(
      JSON.stringify(buildEgyptDiscoverCompletedBaseline()),
    );
    delete phase5bSave.missionProgress[EGYPT_MISSION_ID].egyptBuildStarted;
    delete phase5bSave.missionProgress[EGYPT_MISSION_ID].egyptCompletedBuildChallengeIds;
    delete phase5bSave.missionProgress[EGYPT_MISSION_ID].egyptCompletedBuildIds;
    delete phase5bSave.missionProgress[EGYPT_MISSION_ID].egyptBuildJournal;

    const migrated5b = migrateAndValidateProgress(phase5bSave);
    assert.equal(migrated5b.rewards.xp, 1050);
    assert.equal(migrated5b.rewards.stamps.length, 4);
    assert.equal(isEgyptDiscoverCompleted(migrated5b), true);
    assert.equal(isEgyptBuildUnlocked(migrated5b), true);
    assert.equal(isEgyptBuildStarted(migrated5b), false);
    assert.equal(getEgyptBuildJournal(migrated5b).length, 0);

    // 2. Spoofed BUILD completion without 30 solved challenges + spoofed Practice/Perform/Stamp stripped
    const spoofed = JSON.parse(
      JSON.stringify(buildEgyptDiscoverCompletedBaseline()),
    );
    spoofed.missionProgress[EGYPT_MISSION_ID].egyptBuildStarted = true;
    spoofed.missionProgress[EGYPT_MISSION_ID].egyptCompletedBuildIds = [
      ...EGYPT_BUILD_MISSION_ORDER,
    ];
    spoofed.missionProgress[EGYPT_MISSION_ID].egyptCompletedBuildChallengeIds = []; // missing!
    spoofed.missionProgress[EGYPT_MISSION_ID].completedActivityIds.push(
      EGYPT_BUILD_ACTIVITY_ID,
      'egypt_practice_spoof',
      'egypt_perform_spoof',
    );
    spoofed.missionProgress[EGYPT_MISSION_ID].status = 'completed';
    spoofed.rewards.xp = 2500;
    spoofed.rewards.stamps.push(EGYPT_PASSPORT_STAMP_ID);

    const sanitized = migrateAndValidateProgress(spoofed);
    assert.equal(sanitized.rewards.xp, 1050);
    assert.equal(sanitized.rewards.stamps.length, 4);
    assert.equal(sanitized.rewards.stamps.includes(EGYPT_PASSPORT_STAMP_ID), false);
    assert.equal(isEgyptBuildCompleted(sanitized), false);
    assert.equal(isEgyptPracticeUnlocked(sanitized), false);
    assert.equal(getEgyptEffectiveEntry(sanitized).status, 'in_progress');
    assert.deepEqual(getEgyptEffectiveEntry(sanitized).completedActivityIds, [
      EGYPT_DISCOVERY_ACTIVITY_ID,
    ]);

    // 3. Duplicate / malformed journal records sanitized cleanly
    const cleanJournal = sanitizeEgyptBuildJournal([
      {
        id: 'dup1',
        missionId: EGYPT_MISSION_ID,
        gameId: 'expedition_command_forge',
        landmarkId: 'nile_expedition_camp',
        challengeId: 'ec_1_simple_imperative',
        challengeTitle: { en: 'Old', th: 'เก่า' },
        cefrLevel: 'a2',
        instructionText: 'Pack compass.',
        instructionLines: ['Pack compass.'],
        skillCategory: 'imperatives_and_objects',
        completedAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'dup2',
        missionId: EGYPT_MISSION_ID,
        gameId: 'expedition_command_forge',
        landmarkId: 'nile_expedition_camp',
        challengeId: 'ec_1_simple_imperative',
        challengeTitle: { en: 'New', th: 'ใหม่' },
        cefrLevel: 'b1',
        instructionText: 'Pack your compass before leaving.',
        instructionLines: ['Pack your compass before leaving.'],
        skillCategory: 'imperatives_and_objects',
        completedAt: '2026-01-02T00:00:00.000Z',
      },
      { bad: true },
    ]);
    assert.ok(cleanJournal);
    assert.equal(cleanJournal.length, 1);
    assert.equal(cleanJournal[0].instructionText, 'Pack your compass before leaving.');
  });

  it('keeps bilingual i18n parity (26 nav* keys), Egypt audio intact, and strictly zero forbidden APIs or styles', () => {
    const enNavKeys = Object.keys(GAME_COPY.en).filter((k) => k.startsWith('nav'));
    const thNavKeys = Object.keys(GAME_COPY.th).filter((k) => k.startsWith('nav'));
    assert.equal(enNavKeys.length, 26);
    assert.equal(thNavKeys.length, 26);

    const buildKeys = Object.keys(GAME_COPY.en).filter(
      (k) => k.startsWith('egyptBuild') || k.startsWith('egyptJournal'),
    );
    assert.equal(buildKeys.length, 28);
    for (const k of buildKeys) {
      const key = k as keyof typeof GAME_COPY.en;
      assert.ok(String(GAME_COPY.en[key]).trim().length > 0, `Empty EN key: ${k}`);
      assert.ok(String(GAME_COPY.th[key]).trim().length > 0, `Empty TH key: ${k}`);
    }

    // Audio lifecycle intact without altering audioEngine.ts
    assert.equal(typeof voxAudio.setEnvironmentProfile, 'function');
    assert.equal(typeof voxAudio.playSfx, 'function');
    voxAudio.setEnvironmentProfile('egypt');
    assert.equal(voxAudio.getStateSnapshot().worldProfile, 'egypt');
    voxAudio.setEnvironmentProfile('default');

    const projectRoot = process.cwd();
    const buildFiles = [
      'src/data/egyptBuildTypes.ts',
      'src/data/egyptBuildGames1to3.ts',
      'src/data/egyptBuildGames4to5.ts',
      'src/data/egyptBuild.ts',
      'src/components/egypt/EgyptBuildArtwork.tsx',
      'src/components/egypt/EgyptInstructionJournal.tsx',
      'src/components/egypt/EgyptBuildModal.tsx',
      'src/components/egypt/build/ExpeditionCommandForgeGame.tsx',
      'src/components/egypt/build/PyramidRouteArchitectGame.tsx',
      'src/components/egypt/build/PapyrusInstructionWorkshopGame.tsx',
      'src/components/egypt/build/TempleRuleArchitectGame.tsx',
      'src/components/egypt/build/PharaohMasterBlueprintGame.tsx',
    ];
    for (const rel of buildFiles) {
      const content = fs.readFileSync(path.join(projectRoot, rel), 'utf8');
      assert.equal(content.includes('animate-pulse'), false, `animate-pulse in ${rel}`);
      assert.equal(content.includes('border-l-4'), false, `border-l-4 in ${rel}`);
      assert.equal(content.includes('border-l-2'), false, `border-l-2 in ${rel}`);
      assert.equal(content.includes('backdrop-blur'), false, `backdrop-blur in ${rel}`);
      assert.equal(content.includes('generate_image'), false, `generate_image in ${rel}`);
      assert.equal(content.includes('@google/genai'), false, `@google/genai in ${rel}`);
      assert.equal(content.includes('fetch('), false, `fetch( in ${rel}`);
      assert.equal(content.includes('window.alert'), false, `window.alert in ${rel}`);
      assert.equal(content.includes('window.open'), false, `window.open in ${rel}`);
    }
  });
});
