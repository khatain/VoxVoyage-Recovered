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
  ALL_EGYPT_BUILD_CHALLENGE_IDS,
  EGYPT_BUILD_MISSION_ORDER,
  EGYPT_BUILD_XP_REWARD,
  GAME_ID_BY_LANDMARK,
  SKILL_CATEGORY_BY_GAME_ID,
  getEgyptBuildGameChallengeIds,
  makeEgyptJournalRecordId,
} from '../src/data/egyptBuild';
import { EGYPT_DISCOVER_MISSION_ORDER } from '../src/data/egyptDiscover';
import { EGYPT_MISSION_ID, EGYPT_PASSPORT_STAMP_ID, EGYPT_STAGE_ACTIVITY_IDS } from '../src/data/egyptWorld';
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
import {
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
  isEgyptPracticeUnlocked,
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
import { collectJaipurVocabObject } from '../src/utils/progressStorage';

function buildPreBuildProgress() {
  let p = createDefaultProgress();
  for (const obj of JAIPUR_VOCAB_OBJECTS) p = collectJaipurVocabObject(p, obj.id);
  p = completeJaipurSentenceTrain(p);
  p = startJaipurSpotAndSpeak(p);
  for (const obj of JAIPUR_VOCAB_OBJECTS) p = completeJaipurSpotAndSpeakObject(p, obj.id);
  p = completeJaipurFinalShowcase(p);

  p = startKenyaDiscoveryMission(p);
  for (const t of KENYA_DISCOVERY_TASKS) p = completeKenyaDiscoverySpot(p, t.id);
  p = startKenyaBuildMission(p);
  for (const st of KENYA_BUILD_STATIONS) p = completeKenyaBuildStation(p, st.id, st.modelSentenceA2.en);
  p = startKenyaPracticeMission(p);
  for (const c of KENYA_PRACTICE_CONVERSATIONS) p = completeKenyaPracticeConversation(p, c.id);
  p = startKenyaPerformMission(p);
  p = completeKenyaFinalPerform(p);

  p = markScotlandNpcMet(p, 'eilidh');
  p = startScotlandDiscoveryMission(p);
  for (const ev of SCOTLAND_EVIDENCE_ITEMS) p = completeScotlandDiscoveryStation(p, ev.id);
  p = startScotlandBuildMission(p);
  for (const st of SCOTLAND_BUILD_STATIONS) p = completeScotlandBuildStation(p, st.id, st.modelSentence);
  p = startScotlandPracticeMission(p);
  const scoRef: ScotlandSpeakingReflectionState = {
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
  for (const m of SCOTLAND_PRACTICE_MISSIONS) p = completeScotlandPracticeStation(p, m.id, scoRef);
  p = startScotlandPerformMission(p);
  const outline = createEmptyScotlandPerformOutline();
  outline.introduction = 'Scotland and Thailand comparison.';
  outline.similarity = 'Warm family traditions.';
  outline.difference = 'Castles and tropical temples.';
  outline.evidenceNotes = 'Tartan and Thai silk.';
  outline.conclusion = 'Both value hospitality.';
  const checks = Object.fromEntries(
    SCOTLAND_PERFORM_REFLECTION_ITEMS.map((item) => [item.key, true]),
  ) as Record<(typeof SCOTLAND_PERFORM_REFLECTION_ITEMS)[number]['key'], boolean>;
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
    reflectionState: { checks, completedAt: '2026-01-01T00:00:00.000Z' },
  });

  p = startAustraliaDiscoveryMission(p);
  for (const id of AUSTRALIA_DISCOVER_MISSION_ORDER) p = completeAustraliaDiscoveryMission(p, id);
  p = startAustraliaBuildMission(p);
  for (const id of AUSTRALIA_BUILD_MISSION_ORDER) p = completeAustraliaBuildMission(p, id, 'Built dialogue');
  p = startAustraliaPracticeMission(p);
  for (const id of AUSTRALIA_PRACTICE_MISSION_ORDER) {
    const spec = getAustraliaPracticeMissionSpec(id)!;
    const rec: AustraliaSpeakingEvidenceRecord = {
      practiceMode: 'microphone_recording',
      completedTurnIds: spec.turns.map((t) => t.turnId),
      reflectionChecks: {
        askedClearQuestion: true,
        respondedToNpc: true,
        usedPoliteExpression: true,
        checkedOrClarifiedMeaning: id === 'harbour_gardens_help_point',
      },
      difficultyUsed: 'a2',
      completedAt: '2026-11-23T09:00:00.000Z',
    };
    p = completeAustraliaPracticeMission(p, id, rec);
  }
  p = startAustraliaPerformMission(p);
  for (const id of AUSTRALIA_PERFORM_CHALLENGE_ORDER) {
    const spec = getAustraliaPerformChallengeSpec(id)!;
    const rec: AustraliaPerformChallengeRecord = {
      practiceMode: 'microphone_recording',
      completedTurnIds: spec.turns.map((t) => t.turnId),
      difficultyUsed: 'a2',
      usedScriptPreview: false,
      completedAt: '2026-11-23T15:00:00.000Z',
    };
    p = completeAustraliaPerformChallenge(p, id, rec);
  }
  p = completeAustraliaPerformMission(p, {
    easiestPart: 'Greeting Olivia',
    mostChallengingPart: 'Clarifying detour',
    keptConversationGoing: 'Asked follow-up questions',
    usefulExpression: 'Just to double-check...',
    nextImprovement: 'Steady pace',
    completedAt: '2026-11-23T15:10:00.000Z',
  });

  p = startEgyptDiscoveryMission(p);
  for (const id of EGYPT_DISCOVER_MISSION_ORDER) p = completeEgyptDiscoveryMission(p, id);
  return p;
}

describe('Egypt Phase 5C.2 — Full BUILD Acceptance, Resume, Refresh & PRACTICE Readiness Audit', () => {
  it('verifies opening BUILD without solving keeps 0 progress and partial mid-station BUILD resumes cleanly after JSON refresh', () => {
    let p = buildPreBuildProgress();
    assert.equal(p.rewards.xp, 1050);
    assert.equal(p.rewards.stamps.length, 4);
    assert.equal(isEgyptPracticeUnlocked(p), false);

    // Opening BUILD grants +0 XP and marks 0 stations/challenges done
    p = startEgyptBuildMission(p);
    assert.equal(p.rewards.xp, 1050);
    assert.deepEqual(getEgyptCompletedBuildIds(p), []);
    assert.deepEqual(getEgyptCompletedBuildChallengeIds(p), []);
    assert.equal(getEgyptNextBuildLandmarkId(p), 'nile_expedition_camp');
    assert.equal(isEgyptPracticeUnlocked(p), false);

    // Complete Station 1 + 3 of 6 challenges of Station 2 (Pyramid Route Architect)
    for (const cid of getEgyptBuildGameChallengeIds('nile_expedition_camp')) {
      const rec: EgyptInstructionJournalRecord = {
        id: makeEgyptJournalRecordId('expedition_command_forge', cid),
        missionId: EGYPT_MISSION_ID,
        gameId: 'expedition_command_forge',
        landmarkId: 'nile_expedition_camp',
        challengeId: cid,
        challengeTitle: { en: cid, th: cid },
        cefrLevel: 'a2',
        instructionText: 'Pack the compass in your backpack.',
        instructionLines: ['Pack the compass in your backpack.'],
        skillCategory: 'imperatives_and_objects',
        completedAt: '2026-11-25T10:00:00.000Z',
      };
      p = recordEgyptBuildChallenge(p, rec);
    }
    p = completeEgyptBuildMission(p, 'nile_expedition_camp');

    const routeIds = getEgyptBuildGameChallengeIds('giza_pyramid_plaza');
    for (const cid of routeIds.slice(0, 3)) {
      p = recordEgyptBuildChallenge(p, {
        id: makeEgyptJournalRecordId('pyramid_route_architect', cid),
        missionId: EGYPT_MISSION_ID,
        gameId: 'pyramid_route_architect',
        landmarkId: 'giza_pyramid_plaza',
        challengeId: cid,
        challengeTitle: { en: cid, th: cid },
        cefrLevel: 'b1',
        instructionText: 'Head straight north three blocks past the Viewing Platform, then stop at the north corner.',
        instructionLines: ['Head straight north three blocks past the Viewing Platform, then stop at the north corner.'],
        skillCategory: 'route_directions',
        completedAt: '2026-11-25T10:05:00.000Z',
      });
    }

    // Attempting to complete Station 2 at 3/6 must NOT succeed
    p = completeEgyptBuildMission(p, 'giza_pyramid_plaza');
    assert.deepEqual(getEgyptCompletedBuildIds(p), ['nile_expedition_camp']);
    assert.equal(p.rewards.xp, 1050);

    // Simulate browser refresh via JSON serialization + migrateAndValidateProgress
    const refreshed = migrateAndValidateProgress(JSON.parse(JSON.stringify(p)));
    assert.deepEqual(getEgyptCompletedBuildIds(refreshed), ['nile_expedition_camp']);
    assert.equal(getEgyptCompletedBuildChallengeIds(refreshed).length, 9);
    assert.equal(getEgyptBuildJournal(refreshed).length, 9);
    assert.equal(getEgyptNextBuildLandmarkId(refreshed), 'giza_pyramid_plaza');
    assert.equal(isEgyptBuildCompleted(refreshed), false);
    assert.equal(isEgyptPracticeUnlocked(refreshed), false);
    assert.equal(refreshed.rewards.xp, 1050);
  });

  it('persists full 5/5 BUILD (1,100 XP, 4 stamps) across refresh and confirms Stage 3 PRACTICE remains locked Coming Soon in UI', () => {
    let p = startEgyptBuildMission(buildPreBuildProgress());
    for (const landmarkId of EGYPT_BUILD_MISSION_ORDER) {
      const gameId = GAME_ID_BY_LANDMARK[landmarkId];
      for (const cid of getEgyptBuildGameChallengeIds(landmarkId)) {
        p = recordEgyptBuildChallenge(p, {
          id: makeEgyptJournalRecordId(gameId, cid),
          missionId: EGYPT_MISSION_ID,
          gameId,
          landmarkId,
          challengeId: cid,
          challengeTitle: { en: cid, th: cid },
          cefrLevel: 'a2',
          instructionText: 'Walk straight north three blocks and stop beside the Viewing Platform.',
          instructionLines: ['Walk straight north three blocks and stop beside the Viewing Platform.'],
          skillCategory: SKILL_CATEGORY_BY_GAME_ID[gameId],
          completedAt: '2026-11-25T10:10:00.000Z',
        });
      }
      p = completeEgyptBuildMission(p, landmarkId);
    }

    assert.equal(p.rewards.xp, 1050 + EGYPT_BUILD_XP_REWARD);
    assert.equal(p.rewards.stamps.length, 4);
    assert.equal(p.rewards.stamps.includes(EGYPT_PASSPORT_STAMP_ID), false);
    assert.equal(getEgyptCompletedBuildChallengeIds(p).length, ALL_EGYPT_BUILD_CHALLENGE_IDS.length);
    assert.equal(isEgyptBuildCompleted(p), true);
    assert.equal(isEgyptPracticeUnlocked(p), true);
    assert.equal(
      getEgyptEffectiveEntry(p).completedActivityIds.includes(EGYPT_STAGE_ACTIVITY_IDS.practice),
      false,
    );

    const refreshed = migrateAndValidateProgress(JSON.parse(JSON.stringify(p)));
    assert.equal(refreshed.rewards.xp, 1100);
    assert.equal(refreshed.rewards.stamps.length, 4);
    assert.equal(isEgyptBuildCompleted(refreshed), true);
    assert.equal(getEgyptBuildJournal(refreshed).length, 30);

    // Stage 3 PRACTICE UI must remain Coming Soon / locked without playable PRACTICE modal
    const root = process.cwd();
    const guideSrc = fs.readFileSync(
      path.join(root, 'src/components/egypt/EgyptExpeditionGuideModal.tsx'),
      'utf8',
    );
    const worldSrc = fs.readFileSync(
      path.join(root, 'src/components/screens/EgyptWorldScreen.tsx'),
      'utf8',
    );
    assert.equal(guideSrc.includes('egyptGuideLockedFuturePhase'), true);
    assert.equal(worldSrc.includes('egyptBuildPracticeComingSoonTitle'), true);
    assert.equal(fs.existsSync(path.join(root, 'src/components/egypt/EgyptPracticeModal.tsx')), false);
  });
});
