import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  AUSTRALIA_MISSION_ID,
  AUSTRALIA_PASSPORT_STAMP_ID,
  AUSTRALIA_RECOMMENDED_ROUTE,
  type AustraliaLandmarkId,
} from '../src/data/australiaWorld';
import { AUSTRALIA_DISCOVER_MISSION_ORDER } from '../src/data/australiaDiscovery';
import { AUSTRALIA_BUILD_MISSION_ORDER } from '../src/data/australiaBuild';
import {
  AUSTRALIA_PRACTICE_ACTIVITY_ID,
  AUSTRALIA_PRACTICE_MISSION_ORDER,
  getAustraliaPracticeMissionSpec,
} from '../src/data/australiaPractice';
import {
  AUSTRALIA_PERFORM_ACTIVITY_ID,
  AUSTRALIA_PERFORM_CHALLENGE_ORDER,
  AUSTRALIA_PERFORM_CHALLENGES,
  AUSTRALIA_PERFORM_XP_REWARD,
  getAustraliaPerformChallengeSpec,
  isValidAustraliaPerformReflectionState,
} from '../src/data/australiaPerform';
import { EGYPT_MISSION_ID, EGYPT_STAGE_ACTIVITY_IDS } from '../src/data/egyptWorld';
import { GAME_COPY } from '../src/data/i18n';
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
  canNavigateToCountry,
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
  getAustraliaCompletedPerformIds,
  getAustraliaPerformDisplayProgress,
  getAustraliaPerformEvidenceMap,
  getAustraliaPerformReflection,
  isAustraliaAttemptPerformCompleted,
  isAustraliaMissionCompleted,
  isAustraliaPerformAwaitingReflection,
  isAustraliaPerformCompleted,
  isEgyptDiscoverCompleted,
  isEgyptUnlocked,
  isJaipurMissionCompleted,
  isKenyaMissionCompleted,
  isScotlandMissionCompleted,
  markEgyptEntered,
  markJaipurAaravMet,
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
import { resolveNextMissionTarget } from '../src/utils/worldNavigation';
import type {
  AustraliaPerformChallengeRecord,
  AustraliaPerformReflectionState,
  AustraliaSpeakingEvidenceRecord,
  LocalProgressV1,
  ScotlandSpeakingReflectionState,
} from '../src/types/game';

function buildAustraliaPracticeCompleteProgress(): LocalProgressV1 {
  let state = createDefaultProgress();
  state = markJaipurAaravMet(state);
  for (const item of JAIPUR_VOCAB_OBJECTS) {
    state = collectJaipurVocabObject(state, item.id);
  }
  state = completeJaipurSentenceTrain(state);
  state = startJaipurSpotAndSpeak(state);
  for (const item of JAIPUR_VOCAB_OBJECTS) {
    state = completeJaipurSpotAndSpeakObject(state, item.id);
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

  state = markScotlandNpcMet(state, 'eilidh');
  state = markScotlandNpcMet(state, 'fiona');
  state = startScotlandDiscoveryMission(state);
  for (const item of SCOTLAND_EVIDENCE_ITEMS) {
    state = completeScotlandDiscoveryStation(state, item.id);
  }
  state = startScotlandBuildMission(state);
  for (const station of SCOTLAND_BUILD_STATIONS) {
    state = completeScotlandBuildStation(state, station.id, station.modelSentence);
  }
  state = startScotlandPracticeMission(state);
  const scotlandReflection: ScotlandSpeakingReflectionState = {
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
  for (const mission of SCOTLAND_PRACTICE_MISSIONS) {
    state = completeScotlandPracticeStation(state, mission.id, scotlandReflection);
  }
  state = startScotlandPerformMission(state);
  const scotlandOutline = createEmptyScotlandPerformOutline();
  scotlandOutline.introduction = 'Today I compare Scotland and Thailand through daily life and traditions.';
  scotlandOutline.similarity = 'Both Scotland and Thailand value warm family gatherings.';
  scotlandOutline.difference = 'However, Scotland has cooler castles whereas Thailand has warm temples.';
  scotlandOutline.evidenceNotes = 'For example, tartan weaving compares with Thai silk.';
  scotlandOutline.conclusion = 'To conclude, both cultures celebrate hospitality with pride.';
  const reflectionDone: Record<(typeof SCOTLAND_PERFORM_REFLECTION_ITEMS)[number]['key'], boolean> = {
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
    outline: scotlandOutline,
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
  for (const id of AUSTRALIA_DISCOVER_MISSION_ORDER) {
    state = completeAustraliaDiscoveryMission(state, id);
  }
  state = startAustraliaBuildMission(state);
  for (const id of AUSTRALIA_BUILD_MISSION_ORDER) {
    state = completeAustraliaBuildMission(
      state,
      id,
      'Could I ask which ferry departs next for Circular Quay?',
    );
  }
  state = startAustraliaPracticeMission(state);
  for (const id of AUSTRALIA_PRACTICE_MISSION_ORDER) {
    const spec = getAustraliaPracticeMissionSpec(id)!;
    const practiceRecord: AustraliaSpeakingEvidenceRecord = {
      practiceMode: 'no_mic_rehearsal',
      completedTurnIds: spec.turns.map((t) => t.turnId),
      reflectionChecks: {
        askedClearQuestion: true,
        respondedToNpc: true,
        usedPoliteExpression: true,
        checkedOrClarifiedMeaning: id === 'harbour_gardens_help_point',
      },
      difficultyUsed: 'a2',
      completedAt: '2026-01-01T00:00:00.000Z',
    };
    state = completeAustraliaPracticeMission(state, id, practiceRecord);
  }
  return state;
}

function makeChallengeRecord(
  landmarkId: AustraliaLandmarkId,
  difficultyUsed: 'a2' | 'b1' = 'a2',
): AustraliaPerformChallengeRecord {
  const spec = getAustraliaPerformChallengeSpec(landmarkId)!;
  return {
    practiceMode: 'no_mic_rehearsal',
    completedTurnIds: spec.turns.map((t) => t.turnId),
    difficultyUsed,
    usedScriptPreview: false,
    completedAt: '2026-02-01T00:00:00.000Z',
  };
}

function makeReflection(
  overrides?: Partial<AustraliaPerformReflectionState>,
): AustraliaPerformReflectionState {
  return {
    easiestPart: 'Greeting Olivia and making friendly small talk',
    mostChallengingPart: 'Asking to repeat and clarifying a detour mix-up',
    keptConversationGoing: 'I asked clear follow-up questions to the NPC',
    usefulExpression: '"Just to double-check, did you say...?"',
    nextImprovement: 'Understand faster details without feeling nervous',
    completedAt: '2026-02-01T00:05:00.000Z',
    ...overrides,
  };
}

describe('Australia Final Mission & Mandatory Self-Reflection Progression Gate', () => {
  it('1-2. keeps Australia incomplete at 4/5 and after Challenge 5 before explicit Self-Reflection submission (no premature Egypt unlock)', () => {
    let state = startAustraliaPerformMission(buildAustraliaPracticeCompleteProgress());
    assert.equal(state.rewards.xp, 900);

    // Complete 4 of 5 challenges
    for (let i = 0; i < 4; i += 1) {
      const id = AUSTRALIA_PERFORM_CHALLENGE_ORDER[i];
      state = completeAustraliaPerformChallenge(state, id, makeChallengeRecord(id));
    }
    assert.equal(getAustraliaCompletedPerformIds(state).length, 4);
    assert.equal(getAustraliaPerformDisplayProgress(state).completed, 4);
    assert.equal(isAustraliaPerformCompleted(state), false);
    assert.equal(isAustraliaMissionCompleted(state), false);
    assert.equal(isAustraliaAttemptPerformCompleted(state), false);
    assert.equal(isAustraliaPerformAwaitingReflection(state), false);
    assert.equal(isEgyptUnlocked(state), false);
    assert.equal(canNavigateToCountry(state, 'egypt'), false);
    assert.equal(state.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID), false);
    assert.equal(state.rewards.xp, 900);

    // Opening Self-Reflection / completing 5th challenge without submitting Self-Reflection keeps display at 4/5 & Egypt locked
    const fifthId = AUSTRALIA_PERFORM_CHALLENGE_ORDER[4];
    state = completeAustraliaPerformChallenge(state, fifthId, makeChallengeRecord(fifthId));
    assert.equal(getAustraliaCompletedPerformIds(state).length, 5);
    assert.equal(isAustraliaPerformAwaitingReflection(state), true);
    assert.equal(getAustraliaPerformDisplayProgress(state).completed, 4);
    assert.equal(getAustraliaPerformDisplayProgress(state).total, 5);
    assert.equal(isAustraliaPerformCompleted(state), false);
    assert.equal(isAustraliaMissionCompleted(state), false);
    assert.equal(isEgyptUnlocked(state), false);
    assert.equal(canNavigateToCountry(state, 'egypt'), false);
    assert.equal(state.rewards.xp, 900);
  });

  it('3-4. rejects incomplete or blank Self-Reflection and preserves 4/5 when exited without submission', () => {
    let state = startAustraliaPerformMission(buildAustraliaPracticeCompleteProgress());
    for (const id of AUSTRALIA_PERFORM_CHALLENGE_ORDER) {
      state = completeAustraliaPerformChallenge(state, id, makeChallengeRecord(id));
    }

    const partialAnswers: AustraliaPerformReflectionState = {
      easiestPart: 'Greeting Olivia',
      mostChallengingPart: '',
      keptConversationGoing: 'I asked questions',
      usefulExpression: 'Excuse me',
      nextImprovement: 'Practice listening',
      completedAt: '2026-02-01T00:05:00.000Z',
    };
    assert.equal(isValidAustraliaPerformReflectionState(partialAnswers), false);

    const afterRejectedSubmit = completeAustraliaPerformMission(state, partialAnswers);
    assert.equal(getAustraliaPerformDisplayProgress(afterRejectedSubmit).completed, 4);
    assert.equal(isAustraliaMissionCompleted(afterRejectedSubmit), false);
    assert.equal(isEgyptUnlocked(afterRejectedSubmit), false);
    assert.equal(afterRejectedSubmit.rewards.xp, 900);
    assert.equal(afterRejectedSubmit.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID), false);
  });

  it('5. automatically transitions straight to Self-Reflection on final challenge completion without +1 off-by-one bug', () => {
    const modalPath = path.join(
      process.cwd(),
      'src/components/australia/AustraliaPerformModal.tsx',
    );
    const modalSource = fs.readFileSync(modalPath, 'utf8');

    // Off-by-one bug removed
    assert.equal(modalSource.includes('completedPerformCount + 1 >= totalChallenges'), false);
    // Final challenge automatically opens Self-Reflection view without closing modal
    assert.ok(modalSource.includes('completesAllRequiredChallenges && !attemptPerformCompleted'));
    assert.ok(modalSource.includes("setViewMode('reflection')"));
    // Closing mid-reflection invokes exit callback without calling onCompletePerformMission
    assert.ok(modalSource.includes('onReflectionExitedWithoutSubmit?.()'));
    // Celebration ceremony strictly gated behind canonical completion/submitted reflection
    assert.ok(modalSource.includes("viewMode === 'celebration' && celebrationUnlocked"));
  });

  it('6-8. accepts honest non-positive Self-Reflection, updates to 5/5, completes Australia once, awards +100 XP & Stamp, and unlocks Egypt', () => {
    let state = startAustraliaPerformMission(buildAustraliaPracticeCompleteProgress());
    for (const id of AUSTRALIA_PERFORM_CHALLENGE_ORDER) {
      state = completeAustraliaPerformChallenge(state, id, makeChallengeRecord(id));
    }

    // Honest critical self-assessment (no positive-rating bias) must succeed
    const honestCriticalReflection = makeReflection({
      easiestPart: 'Nothing felt very easy yet',
      mostChallengingPart: 'I felt nervous speaking fast at the café',
      keptConversationGoing: 'I asked the speaker to slow down',
      usefulExpression: 'Could you repeat that slower please?',
      nextImprovement: 'Practice everyday questions even though I made mistakes',
    });
    const completed = completeAustraliaPerformMission(state, honestCriticalReflection);

    assert.equal(getAustraliaPerformDisplayProgress(completed).completed, 5);
    assert.equal(getAustraliaPerformDisplayProgress(completed).total, 5);
    assert.equal(isAustraliaPerformAwaitingReflection(completed), false);
    assert.equal(isAustraliaPerformCompleted(completed), true);
    assert.equal(isAustraliaMissionCompleted(completed), true);
    assert.equal(isAustraliaAttemptPerformCompleted(completed), true);
    assert.equal(isEgyptUnlocked(completed), true);
    assert.equal(canNavigateToCountry(completed, 'egypt'), true);
    assert.equal(completed.rewards.xp, 900 + AUSTRALIA_PERFORM_XP_REWARD);
    assert.equal(completed.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID), true);
    assert.equal(completed.unlockedCountryIds.includes('egypt'), true);

    // Verify prerequisite requirement: removing Practice blocks canonical completion even with 5/5 Perform + Reflection
    const missingPracticePrereq: LocalProgressV1 = {
      ...completed,
      missionProgress: {
        ...completed.missionProgress,
        [AUSTRALIA_MISSION_ID]: {
          ...completed.missionProgress[AUSTRALIA_MISSION_ID]!,
          completedActivityIds: completed.missionProgress[
            AUSTRALIA_MISSION_ID
          ]!.completedActivityIds.filter((id) => id !== AUSTRALIA_PRACTICE_ACTIVITY_ID),
        },
      },
    };
    assert.equal(isAustraliaMissionCompleted(missingPracticePrereq), false);
    assert.equal(isEgyptUnlocked(missingPracticePrereq), false);
    assert.equal(canNavigateToCountry(missingPracticePrereq, 'egypt'), false);
  });

  it('9. enforces country progression gate against direct navigation, tampered routes, and Smart Navigation', () => {
    let state = startAustraliaPerformMission(buildAustraliaPracticeCompleteProgress());
    for (const id of AUSTRALIA_PERFORM_CHALLENGE_ORDER) {
      state = completeAustraliaPerformChallenge(state, id, makeChallengeRecord(id));
    }

    // Attempting direct route to Egypt before Self-Reflection is blocked by canNavigateToCountry & migrateAndValidateProgress
    assert.equal(canNavigateToCountry(state, 'egypt'), false);
    const directNavigationAttempt = migrateAndValidateProgress({
      ...JSON.parse(JSON.stringify(state)),
      selectedCountryId: 'egypt',
      currentRoute: 'country-lobby',
    });
    assert.equal(directNavigationAttempt.currentRoute, 'world-map');
    assert.equal(isEgyptUnlocked(directNavigationAttempt), false);

    // Smart Navigation targets npc_olivia for perform_reflection, never country_completed, until reflection is submitted
    const navPending = resolveNextMissionTarget({
      worldId: 'australia',
      state: {
        countryUnlocked: true,
        discoverStarted: true,
        discoverCompleted: true,
        completedDiscoverIds: [...AUSTRALIA_RECOMMENDED_ROUTE],
        buildUnlocked: true,
        buildStarted: true,
        completedBuildIds: [...AUSTRALIA_RECOMMENDED_ROUTE],
        buildCompleted: true,
        practiceUnlocked: true,
        practiceStarted: true,
        completedPracticeIds: [...AUSTRALIA_RECOMMENDED_ROUTE],
        practiceCompleted: true,
        performUnlocked: true,
        performStarted: true,
        completedPerformIds: [...AUSTRALIA_RECOMMENDED_ROUTE],
        performCompleted: false,
      },
    });
    assert.equal(navPending.reasonKey, 'perform_reflection');
    assert.equal(navPending.targetId, 'npc_olivia');

    const appSource = fs.readFileSync(path.join(process.cwd(), 'src/App.tsx'), 'utf8');
    assert.ok(appSource.includes('canNavigateToCountry(prev, prev.selectedCountryId)'));
    assert.ok(appSource.includes('!canNavigateToCountry(progress, progress.selectedCountryId)'));
  });

  it('10-12. preserves 4/5 lock across refresh before Self-Reflection, preserves 5/5 unlock after, and prevents duplicate rewards on repeated submission', () => {
    let state = startAustraliaPerformMission(buildAustraliaPracticeCompleteProgress());
    for (const id of AUSTRALIA_PERFORM_CHALLENGE_ORDER) {
      state = completeAustraliaPerformChallenge(state, id, makeChallengeRecord(id));
    }

    // Refresh before reflection submission
    const refreshedBefore = migrateAndValidateProgress(JSON.parse(JSON.stringify(state)));
    assert.equal(getAustraliaPerformDisplayProgress(refreshedBefore).completed, 4);
    assert.equal(isAustraliaPerformAwaitingReflection(refreshedBefore), true);
    assert.equal(isAustraliaMissionCompleted(refreshedBefore), false);
    assert.equal(isEgyptUnlocked(refreshedBefore), false);
    assert.equal(refreshedBefore.rewards.xp, 900);

    // Submit valid reflection & refresh
    const completed = completeAustraliaPerformMission(refreshedBefore, makeReflection());
    const refreshedAfter = migrateAndValidateProgress(JSON.parse(JSON.stringify(completed)));
    assert.equal(getAustraliaPerformDisplayProgress(refreshedAfter).completed, 5);
    assert.equal(isAustraliaMissionCompleted(refreshedAfter), true);
    assert.equal(isEgyptUnlocked(refreshedAfter), true);
    assert.equal(refreshedAfter.rewards.xp, 1000);
    assert.equal(refreshedAfter.rewards.stamps.length, 4);

    // Re-submitting reflection repeatedly awards zero duplicate XP or duplicate stamps
    const repeatedOnce = completeAustraliaPerformMission(
      refreshedAfter,
      makeReflection({ easiestPart: 'Updated honest answer' }),
    );
    const repeatedTwice = completeAustraliaPerformMission(repeatedOnce, makeReflection());
    assert.equal(repeatedTwice.rewards.xp, 1000);
    assert.equal(
      repeatedTwice.rewards.stamps.filter((s) => s === AUSTRALIA_PASSPORT_STAMP_ID).length,
      1,
    );
    assert.equal(repeatedTwice.rewards.stamps.length, 4);
  });

  it('13. reconciles legacy inconsistent saved progress (4/5 or missing reflection marked complete with premature Egypt unlock/XP/stamp) while preserving student answers and Egypt progress', () => {
    let state = startAustraliaPerformMission(buildAustraliaPracticeCompleteProgress());
    for (let i = 0; i < 4; i += 1) {
      const id = AUSTRALIA_PERFORM_CHALLENGE_ORDER[i];
      state = completeAustraliaPerformChallenge(state, id, makeChallengeRecord(id));
    }

    // Simulate legacy bug state: 4/5 challenges complete, no reflection submitted,
    // yet Australia marked complete, premature +100 XP & Sydney stamp granted,
    // Egypt unlocked + user already played Egypt Stage 1 Discover!
    const inconsistent = JSON.parse(JSON.stringify(state)) as LocalProgressV1;
    inconsistent.rewards.xp = 1050; // premature Aus +100 + Egypt +50
    inconsistent.rewards.stamps.push(AUSTRALIA_PASSPORT_STAMP_ID);
    inconsistent.unlockedCountryIds.push('egypt');
    inconsistent.selectedCountryId = 'egypt';
    inconsistent.currentRoute = 'country-lobby';
    inconsistent.missionProgress[AUSTRALIA_MISSION_ID]!.status = 'completed';
    inconsistent.missionProgress[AUSTRALIA_MISSION_ID]!.australiaPerformCompleted = true;
    inconsistent.missionProgress[AUSTRALIA_MISSION_ID]!.completedActivityIds.push(
      AUSTRALIA_PERFORM_ACTIVITY_ID,
    );
    inconsistent.missionProgress[EGYPT_MISSION_ID] = {
      status: 'in_progress',
      currentStage: 'discover',
      completedActivityIds: [EGYPT_STAGE_ACTIVITY_IDS.discover],
      egyptEntered: true,
      egyptExploredPoiIds: ['nile_expedition_camp'],
      egyptMetNpcIds: ['npc_layla'],
      egyptDiscoverStarted: true,
      egyptCompletedDiscoverIds: [
        'nile_expedition_camp',
        'giza_pyramid_plaza',
        'ancient_scribe_workshop',
        'temple_of_the_sun',
        'chamber_of_wisdom',
      ],
    };

    const reconciled = migrateAndValidateProgress(inconsistent);
    // Completion, premature XP, stamp, and Egypt unlock revoked cleanly
    assert.equal(isAustraliaMissionCompleted(reconciled), false);
    assert.equal(isEgyptUnlocked(reconciled), false);
    assert.equal(canNavigateToCountry(reconciled, 'egypt'), false);
    assert.equal(reconciled.unlockedCountryIds.includes('egypt'), false);
    assert.equal(reconciled.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID), false);
    assert.equal(reconciled.rewards.xp, 900);
    assert.equal(reconciled.currentRoute, 'world-map');
    assert.equal(reconciled.missionProgress[AUSTRALIA_MISSION_ID]?.status, 'in_progress');
    assert.equal(reconciled.missionProgress[AUSTRALIA_MISSION_ID]?.australiaPerformCompleted, undefined);

    // Student answers in Australia are preserved
    assert.equal(getAustraliaCompletedPerformIds(reconciled).length, 4);
    assert.equal(Object.keys(getAustraliaPerformEvidenceMap(reconciled)).length, 4);

    // Legitimate Egypt answers were NOT erased and become accessible once Australia finishes cleanly
    assert.equal(
      reconciled.missionProgress[EGYPT_MISSION_ID]?.egyptCompletedDiscoverIds?.length,
      5,
    );

    const fifthId = AUSTRALIA_PERFORM_CHALLENGE_ORDER[4];
    const finishedFifth = completeAustraliaPerformChallenge(
      reconciled,
      fifthId,
      makeChallengeRecord(fifthId),
    );
    const finishedAustralia = completeAustraliaPerformMission(finishedFifth, makeReflection());
    assert.equal(isAustraliaMissionCompleted(finishedAustralia), true);
    assert.equal(isEgyptUnlocked(finishedAustralia), true);
    assert.equal(isEgyptDiscoverCompleted(finishedAustralia), true);
  });

  it('14-15. supports B1 pathway through the exact same gate, preserves India/Kenya/Scotland/Egypt, and guarantees EN/TH feedback copy', () => {
    // B1 pathway test
    let b1State = startAustraliaPerformMission(buildAustraliaPracticeCompleteProgress());
    for (const id of AUSTRALIA_PERFORM_CHALLENGE_ORDER) {
      b1State = completeAustraliaPerformChallenge(b1State, id, makeChallengeRecord(id, 'b1'));
    }
    assert.equal(isAustraliaPerformAwaitingReflection(b1State), true);
    assert.equal(isEgyptUnlocked(b1State), false);

    const b1Completed = completeAustraliaPerformMission(
      b1State,
      makeReflection({ easiestPart: 'B1 extended conversation response' }),
    );
    assert.equal(isAustraliaMissionCompleted(b1Completed), true);
    assert.equal(isEgyptUnlocked(b1Completed), true);
    assert.equal(getAustraliaPerformReflection(b1Completed)?.easiestPart, 'B1 extended conversation response');

    // India, Kenya, Scotland remain unaffected
    assert.equal(isJaipurMissionCompleted(b1Completed), true);
    assert.equal(isKenyaMissionCompleted(b1Completed), true);
    assert.equal(isScotlandMissionCompleted(b1Completed), true);

    // Egypt gameplay unaffected once legitimately unlocked
    let egyptPlay = markEgyptEntered(b1Completed);
    egyptPlay = startEgyptDiscoveryMission(egyptPlay);
    egyptPlay = completeEgyptDiscoveryMission(egyptPlay, 'nile_expedition_camp');
    assert.equal(egyptPlay.missionProgress[EGYPT_MISSION_ID]?.egyptCompletedDiscoverIds?.length, 1);

    // Required EN & TH bilingual feedback strings & nav* key count === 26
    assert.equal(
      GAME_COPY.en.australiaPerformReflectionGateNotice,
      'One final step! Complete your Self-Reflection to finish Australia and unlock your next destination.',
    );
    assert.equal(
      GAME_COPY.th.australiaPerformReflectionGateNotice,
      'เหลืออีกหนึ่งขั้นตอน! ทำแบบประเมินตนเองให้เสร็จเพื่อจบภารกิจประเทศออสเตรเลียและปลดล็อกประเทศถัดไป',
    );
    assert.equal(GAME_COPY.en.australiaPerformCompleteReflectionButton, 'Complete Self-Reflection');
    assert.equal(GAME_COPY.en.australiaPerformResumeReflectionButton, 'Resume Self-Reflection');
    assert.equal(Object.keys(GAME_COPY.en).filter((k) => k.startsWith('nav')).length, 26);
    assert.equal(Object.keys(GAME_COPY.th).filter((k) => k.startsWith('nav')).length, 26);
    assert.equal(AUSTRALIA_PERFORM_CHALLENGES.length, 5);
  });
});
