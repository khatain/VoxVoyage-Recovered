import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
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
  getCountryReplayAttempt,
  getCountryReplayCapabilities,
  getCountryReplayHistory,
  getJaipurEffectiveEntry,
  getKenyaEffectiveEntry,
  getScotlandEffectiveEntry,
  hasActiveCountryReplay,
  isJaipurBuildUnlocked,
  isJaipurMissionCompleted,
  isJaipurPerformUnlocked,
  isJaipurPracticeUnlocked,
  isKenyaBuildUnlocked,
  isKenyaMissionCompleted,
  isKenyaPerformUnlocked,
  isKenyaPracticeUnlocked,
  isScotlandDiscoverCompleted,
  isScotlandMissionCompleted,
  isScotlandPerformUnlocked,
  isScotlandPracticeUnlocked,
  isScotlandUnlocked,
  JAIPUR_MISSION_ID,
  KENYA_BUILD_ACTIVITY_ID,
  KENYA_DISCOVERY_ACTIVITY_ID,
  KENYA_MISSION_ID,
  KENYA_PERFORM_ACTIVITY_ID,
  KENYA_PRACTICE_ACTIVITY_ID,
  markJaipurAaravMet,
  markScotlandNpcMet,
  migrateAndValidateProgress,
  restartCountryReplayAttempt,
  SCOTLAND_BUILD_ACTIVITY_ID,
  SCOTLAND_DISCOVERY_ACTIVITY_ID,
  SCOTLAND_MISSION_ID,
  SCOTLAND_PERFORM_ACTIVITY_ID,
  SCOTLAND_PRACTICE_ACTIVITY_ID,
  startCountryReplay,
  startJaipurSpotAndSpeak,
  startKenyaBuildMission,
  startKenyaDiscoveryMission,
  startKenyaPerformMission,
  startKenyaPracticeMission,
  startScotlandBuildMission,
  startScotlandDiscoveryMission,
  startScotlandPerformMission,
  startScotlandPracticeMission,
  WORD_DETECTIVE_ACTIVITY_ID,
} from '../src/utils/progressStorage';
import type { ScotlandPerformCompletionPayload } from '../src/data/scotlandPerform';
import { JAIPUR_VOCAB_OBJECTS } from '../src/data/jaipurWorld';
import { SENTENCE_TRAIN_ACTIVITY_ID } from '../src/data/jaipurSentenceTrain';
import { SPOT_AND_SPEAK_ACTIVITY_ID } from '../src/data/jaipurSpotAndSpeak';
import { FINAL_JAIPUR_SHOWCASE_ACTIVITY_ID, INDIA_PASSPORT_STAMP_ID } from '../src/data/jaipurShowcase';
import { KENYA_DISCOVERY_TASKS } from '../src/data/kenyaDiscovery';
import { KENYA_BUILD_STATIONS } from '../src/data/kenyaBuild';
import { KENYA_PRACTICE_CONVERSATIONS } from '../src/data/kenyaPractice';
import { KENYA_PASSPORT_STAMP_ID } from '../src/data/kenyaPerform';
import { SCOTLAND_EVIDENCE_ITEMS } from '../src/data/scotlandDiscovery';
import { SCOTLAND_BUILD_STATIONS } from '../src/data/scotlandBuild';
import { SCOTLAND_PRACTICE_MISSIONS } from '../src/data/scotlandPractice';
import { SCOTLAND_PASSPORT_STAMP_ID } from '../src/data/scotlandWorld';
import type { LocalProgressV1, ScotlandSpeakingReflectionState } from '../src/types/game';

function completeIndiaLifetime(initial: LocalProgressV1): LocalProgressV1 {
  let state = markJaipurAaravMet(initial);
  for (const obj of JAIPUR_VOCAB_OBJECTS) {
    state = collectJaipurVocabObject(state, obj.id);
  }
  state = completeJaipurSentenceTrain(state);
  state = startJaipurSpotAndSpeak(state);
  for (const obj of JAIPUR_VOCAB_OBJECTS) {
    state = completeJaipurSpotAndSpeakObject(state, obj.id);
  }
  state = completeJaipurFinalShowcase(state);
  return state;
}

function completeKenyaLifetime(initial: LocalProgressV1): LocalProgressV1 {
  let state = startKenyaDiscoveryMission(initial);
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

function completeScotlandDiscoverLifetime(initial: LocalProgressV1): LocalProgressV1 {
  let state = markScotlandNpcMet(initial, 'eilidh');
  state = startScotlandDiscoveryMission(state);
  for (const item of SCOTLAND_EVIDENCE_ITEMS) {
    state = completeScotlandDiscoveryStation(state, item.id);
  }
  return state;
}

describe('Country Replay & Restart Current Attempt System', () => {
  it('replays completed India through all 4 stages with zero duplicate XP and preserves lifetime stamp & completion', () => {
    let state = completeIndiaLifetime(createDefaultProgress());
    state = {
      ...state,
      rewards: { ...state.rewards, coins: 40, gems: 3 },
    };

    const lifetimeCompletedAt = state.missionProgress[JAIPUR_MISSION_ID]?.completedAt;
    assert.equal(state.rewards.xp, 250);
    assert.deepEqual(state.rewards.stamps, [INDIA_PASSPORT_STAMP_ID]);
    assert.equal(isJaipurMissionCompleted(state), true);
    assert.equal(canReplayCountry(state, 'india'), true);

    // Start Replay Attempt #1
    state = startCountryReplay(state, 'india');
    assert.equal(hasActiveCountryReplay(state, 'india'), true);
    assert.equal(getCountryReplayAttempt(state, 'india')?.attemptNumber, 1);
    assert.equal(getCountryReplayAttempt(state, 'india')?.currentStage, 'discover');

    // Lifetime status, XP, stamps, coins, gems remain untouched
    assert.equal(isJaipurMissionCompleted(state), true);
    assert.equal(state.rewards.xp, 250);
    assert.equal(state.rewards.coins, 40);
    assert.equal(state.rewards.gems, 3);
    assert.deepEqual(state.rewards.stamps, [INDIA_PASSPORT_STAMP_ID]);
    assert.equal(state.missionProgress[JAIPUR_MISSION_ID]?.completedAt, lifetimeCompletedAt);

    // Effective stage state is reset cleanly to DISCOVER with strict gates
    assert.equal(isJaipurBuildUnlocked(state), false);
    assert.equal(isJaipurPracticeUnlocked(state), false);
    assert.equal(isJaipurPerformUnlocked(state), false);

    // Gate check: cannot complete BUILD before DISCOVER in active replay
    const blockedBuild = completeJaipurSentenceTrain(state);
    assert.equal(blockedBuild, state);

    // Step through DISCOVER -> BUILD -> PRACTICE -> PERFORM
    state = markJaipurAaravMet(state);
    for (const obj of JAIPUR_VOCAB_OBJECTS) {
      state = collectJaipurVocabObject(state, obj.id);
    }
    assert.equal(getJaipurEffectiveEntry(state).currentStage, 'build');
    assert.equal(isJaipurBuildUnlocked(state), true);
    assert.equal(state.rewards.xp, 250);

    state = completeJaipurSentenceTrain(state);
    assert.equal(getJaipurEffectiveEntry(state).currentStage, 'practice');
    assert.equal(isJaipurPracticeUnlocked(state), true);
    assert.equal(state.rewards.xp, 250);

    state = startJaipurSpotAndSpeak(state);
    for (const obj of JAIPUR_VOCAB_OBJECTS) {
      state = completeJaipurSpotAndSpeakObject(state, obj.id);
    }
    assert.equal(getJaipurEffectiveEntry(state).currentStage, 'perform');
    assert.equal(isJaipurPerformUnlocked(state), true);
    assert.equal(state.rewards.xp, 250);

    state = completeJaipurFinalShowcase(state);
    assert.equal(getCountryReplayAttempt(state, 'india')?.status, 'completed');
    assert.deepEqual(getCountryReplayAttempt(state, 'india')?.completedActivityIds, [
      WORD_DETECTIVE_ACTIVITY_ID,
      SENTENCE_TRAIN_ACTIVITY_ID,
      SPOT_AND_SPEAK_ACTIVITY_ID,
      FINAL_JAIPUR_SHOWCASE_ACTIVITY_ID,
    ]);
    assert.equal(state.rewards.xp, 250);
    assert.deepEqual(state.rewards.stamps, [INDIA_PASSPORT_STAMP_ID]);
    assert.equal(state.missionProgress[JAIPUR_MISSION_ID]?.completedAt, lifetimeCompletedAt);
    assert.equal(getCountryReplayHistory(state, 'india').totalAttemptsStarted, 1);
    assert.equal(getCountryReplayHistory(state, 'india').completedReplayCount, 1);
  });

  it('replays completed Kenya through all 4 stages preserving 500 XP, both stamps, and Scotland unlock', () => {
    let state = completeIndiaLifetime(createDefaultProgress());
    state = completeKenyaLifetime(state);

    assert.equal(state.rewards.xp, 500);
    assert.deepEqual(state.rewards.stamps, [INDIA_PASSPORT_STAMP_ID, KENYA_PASSPORT_STAMP_ID]);
    assert.equal(isKenyaMissionCompleted(state), true);
    assert.equal(isScotlandUnlocked(state), true);

    const lifetimeKenyaCompletedAt = state.missionProgress[KENYA_MISSION_ID]?.completedAt;

    state = startCountryReplay(state, 'kenya');
    assert.equal(getCountryReplayAttempt(state, 'kenya')?.currentStage, 'discover');
    assert.equal(isKenyaBuildUnlocked(state), false);
    assert.equal(isKenyaPracticeUnlocked(state), false);
    assert.equal(isKenyaPerformUnlocked(state), false);
    // Scotland remains unlocked and India & Kenya stamps stay preserved
    assert.equal(isScotlandUnlocked(state), true);
    assert.equal(isKenyaMissionCompleted(state), true);
    assert.equal(state.rewards.xp, 500);

    // Gate check: cannot start BUILD before DISCOVER
    assert.equal(startKenyaBuildMission(state), state);

    state = startKenyaDiscoveryMission(state);
    for (const task of KENYA_DISCOVERY_TASKS) {
      state = completeKenyaDiscoverySpot(state, task.id);
    }
    assert.equal(isKenyaBuildUnlocked(state), true);
    assert.equal(state.rewards.xp, 500);

    state = startKenyaBuildMission(state);
    for (const station of KENYA_BUILD_STATIONS) {
      state = completeKenyaBuildStation(state, station.id, station.modelSentenceA2.en);
    }
    assert.equal(isKenyaPracticeUnlocked(state), true);
    assert.equal(state.rewards.xp, 500);

    state = startKenyaPracticeMission(state);
    for (const conv of KENYA_PRACTICE_CONVERSATIONS) {
      state = completeKenyaPracticeConversation(state, conv.id);
    }
    assert.equal(isKenyaPerformUnlocked(state), true);
    assert.equal(state.rewards.xp, 500);

    state = startKenyaPerformMission(state);
    state = completeKenyaFinalPerform(state);

    assert.equal(getCountryReplayAttempt(state, 'kenya')?.status, 'completed');
    assert.deepEqual(getCountryReplayAttempt(state, 'kenya')?.completedActivityIds, [
      KENYA_DISCOVERY_ACTIVITY_ID,
      KENYA_BUILD_ACTIVITY_ID,
      KENYA_PRACTICE_ACTIVITY_ID,
      KENYA_PERFORM_ACTIVITY_ID,
    ]);
    assert.equal(state.rewards.xp, 500);
    assert.deepEqual(state.rewards.stamps, [INDIA_PASSPORT_STAMP_ID, KENYA_PASSPORT_STAMP_ID]);
    assert.equal(state.missionProgress[KENYA_MISSION_ID]?.completedAt, lifetimeKenyaCompletedAt);
    assert.equal(getCountryReplayHistory(state, 'kenya').completedReplayCount, 1);
  });

  it('replays Scotland DISCOVER + BUILD + PRACTICE + PERFORM cleanly with zero duplicate XP or stamps and guards locked Scotland', () => {
    const lockedBase = completeIndiaLifetime(createDefaultProgress());
    assert.equal(isScotlandUnlocked(lockedBase), false);
    assert.equal(canReplayCountry(lockedBase, 'scotland'), false);
    assert.equal(startCountryReplay(lockedBase, 'scotland'), lockedBase);

    const makeReflection = (
      mode: 'recorded_mic' | 'self_reported_no_mic' = 'recorded_mic',
      followUpPracticed?: boolean,
    ): ScotlandSpeakingReflectionState => ({
      practiceMode: mode,
      checks: {
        comparedCultures: true,
        usedSpecificExample: true,
        explainedSimilarityOrDifference: true,
        spokeClearly: true,
      },
      ...(followUpPracticed !== undefined ? { followUpPracticed } : {}),
      completedAt: '2026-11-21T08:00:00.000Z',
    });

    const makePerformPayload = (
      mode: 'recorded_mic' | 'self_reported_no_mic' = 'recorded_mic',
    ): ScotlandPerformCompletionPayload => ({
      selectedEvidenceIds: ['tartan_heritage_workshop', 'highland_food_market'],
      outline: {
        introduction: 'Hello everyone! Today I will compare Scotland and Thailand.',
        similarity: 'Both Scotland and Thailand share lively local markets and weaving.',
        difference: 'Scotland uses warm wool tartan while Thailand weaves Praewa silk.',
        evidenceNotes: 'Tartan vs Praewa silk; oatcakes vs jasmine rice.',
        conclusion: 'Thank you for listening! Comparing cultures builds respect.',
      },
      speechPracticeMode: mode,
      questionPracticeStates: {
        qa_eilidh: mode,
        qa_fiona: 'self_reported_no_mic',
      },
      reflectionState: {
        checks: {
          introducedComparison: true,
          explainedSimilarity: true,
          explainedDifference: true,
          usedSpecificExamples: true,
          answeredBothQuestions: true,
          spokeClearlyConfidently: true,
        },
        completedAt: '2026-11-21T09:00:00.000Z',
      },
    });

    let state = completeKenyaLifetime(lockedBase);
    assert.equal(isScotlandUnlocked(state), true);
    assert.equal(canReplayCountry(state, 'scotland'), false); // not started yet

    state = completeScotlandDiscoverLifetime(state);
    assert.equal(state.rewards.xp, 550);
    assert.equal(isScotlandDiscoverCompleted(state), true);
    assert.equal(canReplayCountry(state, 'scotland'), true);
    assert.deepEqual(getCountryReplayCapabilities('scotland').supportedStages, [
      'discover',
      'build',
      'practice',
      'perform',
    ]);

    state = startCountryReplay(state, 'scotland');
    assert.equal(getCountryReplayAttempt(state, 'scotland')?.currentStage, 'discover');
    assert.equal(getScotlandEffectiveEntry(state).scotlandDiscoverStarted, undefined);
    assert.equal(isScotlandDiscoverCompleted(state), true); // lifetime preserved

    state = completeScotlandDiscoverLifetime(state);
    const midAttempt = getCountryReplayAttempt(state, 'scotland');
    assert.equal(midAttempt?.status, 'in_progress');
    assert.equal(midAttempt?.currentStage, 'build');
    assert.deepEqual(midAttempt?.completedActivityIds, [SCOTLAND_DISCOVERY_ACTIVITY_ID]);
    assert.equal(state.rewards.xp, 550);

    // Finish BUILD inside active replay -> grants +50 lifetime XP once (550->600) & advances replay to PRACTICE
    state = startScotlandBuildMission(state);
    for (const st of SCOTLAND_BUILD_STATIONS) {
      state = completeScotlandBuildStation(state, st.id, st.modelSentence);
    }

    const postBuildAttempt = getCountryReplayAttempt(state, 'scotland');
    assert.equal(postBuildAttempt?.status, 'in_progress');
    assert.equal(postBuildAttempt?.currentStage, 'practice');
    assert.deepEqual(postBuildAttempt?.completedActivityIds, [
      SCOTLAND_DISCOVERY_ACTIVITY_ID,
      SCOTLAND_BUILD_ACTIVITY_ID,
    ]);
    assert.equal(state.rewards.xp, 600);
    assert.equal(isScotlandPracticeUnlocked(state), true);
    assert.equal(isScotlandPerformUnlocked(state), false);

    // Finish PRACTICE inside active replay -> grants +50 lifetime XP once (600->650) & unlocks PERFORM (replay still in_progress)
    state = startScotlandPracticeMission(state);
    for (const mission of SCOTLAND_PRACTICE_MISSIONS) {
      state = completeScotlandPracticeStation(
        state,
        mission.id,
        makeReflection(
          mission.id === 'highland_food_market' ? 'self_reported_no_mic' : 'recorded_mic',
          mission.followUpQuestion ? true : undefined,
        ),
      );
    }

    const postPracticeAttempt = getCountryReplayAttempt(state, 'scotland');
    assert.equal(postPracticeAttempt?.status, 'in_progress');
    assert.equal(postPracticeAttempt?.currentStage, 'perform');
    assert.deepEqual(postPracticeAttempt?.completedActivityIds, [
      SCOTLAND_DISCOVERY_ACTIVITY_ID,
      SCOTLAND_BUILD_ACTIVITY_ID,
      SCOTLAND_PRACTICE_ACTIVITY_ID,
    ]);
    assert.equal(state.rewards.xp, 650);
    assert.equal(isScotlandPerformUnlocked(state), true);
    assert.equal(state.rewards.stamps.includes(SCOTLAND_PASSPORT_STAMP_ID), false);
    assert.equal(getCountryReplayHistory(state, 'scotland').completedReplayCount, 0);

    // Finish PERFORM inside active replay -> grants +100 lifetime XP once (650->750) + stamp_scotland_highlands once & completes 4-stage replay attempt
    state = startScotlandPerformMission(state);
    state = completeScotlandPerformMission(state, makePerformPayload('recorded_mic'));

    const doneAttempt = getCountryReplayAttempt(state, 'scotland');
    assert.equal(doneAttempt?.status, 'completed');
    assert.equal(doneAttempt?.currentStage, 'perform');
    assert.deepEqual(doneAttempt?.completedActivityIds, [
      SCOTLAND_DISCOVERY_ACTIVITY_ID,
      SCOTLAND_BUILD_ACTIVITY_ID,
      SCOTLAND_PRACTICE_ACTIVITY_ID,
      SCOTLAND_PERFORM_ACTIVITY_ID,
    ]);
    assert.equal(state.rewards.xp, 750);
    assert.equal(isScotlandMissionCompleted(state), true);
    assert.equal(
      state.rewards.stamps.filter((s) => s === SCOTLAND_PASSPORT_STAMP_ID).length,
      1,
    );
    assert.equal(state.missionProgress[SCOTLAND_MISSION_ID]?.status, 'completed');
    assert.equal(state.missionProgress[SCOTLAND_MISSION_ID]?.currentStage, 'perform');
    assert.equal(getCountryReplayHistory(state, 'scotland').completedReplayCount, 1);

    // Replay again through all 4 stages -> zero duplicate XP and zero duplicate stamp
    state = startCountryReplay(state, 'scotland');
    assert.equal(isScotlandPerformUnlocked(state), false);
    state = completeScotlandDiscoverLifetime(state);
    state = startScotlandBuildMission(state);
    for (const st of SCOTLAND_BUILD_STATIONS) {
      state = completeScotlandBuildStation(state, st.id, st.modelSentence);
    }
    state = startScotlandPracticeMission(state);
    for (const mission of SCOTLAND_PRACTICE_MISSIONS) {
      state = completeScotlandPracticeStation(
        state,
        mission.id,
        makeReflection('recorded_mic', mission.followUpQuestion ? true : undefined),
      );
    }
    state = startScotlandPerformMission(state);
    state = completeScotlandPerformMission(state, makePerformPayload('self_reported_no_mic'));

    assert.equal(state.rewards.xp, 750);
    assert.equal(
      state.rewards.stamps.filter((s) => s === SCOTLAND_PASSPORT_STAMP_ID).length,
      1,
    );
    assert.equal(getCountryReplayHistory(state, 'scotland').completedReplayCount, 2);
  });

  it('grants XP once when finishing previously incomplete stages during a replay', () => {
    let state = markJaipurAaravMet(createDefaultProgress());
    for (const obj of JAIPUR_VOCAB_OBJECTS) {
      state = collectJaipurVocabObject(state, obj.id);
    }
    assert.equal(state.rewards.xp, 50);
    assert.equal(isJaipurBuildUnlocked(state), true);
    assert.equal(canReplayCountry(state, 'india'), true);

    // Start replay while only DISCOVER was completed
    state = startCountryReplay(state, 'india');
    assert.equal(isJaipurBuildUnlocked(state), false);

    // Re-complete DISCOVER -> 0 extra XP
    state = markJaipurAaravMet(state);
    for (const obj of JAIPUR_VOCAB_OBJECTS) {
      state = collectJaipurVocabObject(state, obj.id);
    }
    assert.equal(state.rewards.xp, 50);

    // Complete BUILD for the first time in lifetime -> +50 XP granted once and synced to lifetime!
    state = completeJaipurSentenceTrain(state);
    assert.equal(state.rewards.xp, 100);
    assert.equal(
      state.missionProgress[JAIPUR_MISSION_ID]?.completedActivityIds.includes(
        SENTENCE_TRAIN_ACTIVITY_ID,
      ),
      true,
    );

    // Restart attempt and complete BUILD again -> still 100 XP (no duplicate)
    state = restartCountryReplayAttempt(state, 'india');
    for (const obj of JAIPUR_VOCAB_OBJECTS) {
      state = collectJaipurVocabObject(state, obj.id);
    }
    state = completeJaipurSentenceTrain(state);
    assert.equal(state.rewards.xp, 100);
  });

  it('restarts ONLY the current attempt while preserving completed replay history and lifetime rewards', () => {
    let state = completeIndiaLifetime(createDefaultProgress());

    // No-op when there is no active attempt
    assert.equal(restartCountryReplayAttempt(state, 'india'), state);

    // Finish Replay Attempt #1
    state = startCountryReplay(state, 'india');
    state = completeIndiaLifetime(state);
    assert.equal(getCountryReplayHistory(state, 'india').totalAttemptsStarted, 1);
    assert.equal(getCountryReplayHistory(state, 'india').completedReplayCount, 1);

    // Start Replay Attempt #2 and progress into PRACTICE
    state = startCountryReplay(state, 'india');
    assert.equal(getCountryReplayAttempt(state, 'india')?.attemptNumber, 2);
    state = markJaipurAaravMet(state);
    for (const obj of JAIPUR_VOCAB_OBJECTS) {
      state = collectJaipurVocabObject(state, obj.id);
    }
    state = completeJaipurSentenceTrain(state);
    assert.equal(getCountryReplayAttempt(state, 'india')?.currentStage, 'practice');

    // Restart Current Attempt -> resets Attempt #2 to DISCOVER, keeps attemptNumber=2 and completedReplayCount=1
    state = restartCountryReplayAttempt(state, 'india');
    const restarted = getCountryReplayAttempt(state, 'india');
    assert.equal(restarted?.attemptNumber, 2);
    assert.equal(restarted?.status, 'in_progress');
    assert.equal(restarted?.currentStage, 'discover');
    assert.deepEqual(restarted?.completedActivityIds, []);
    assert.equal(getCountryReplayHistory(state, 'india').totalAttemptsStarted, 2);
    assert.equal(getCountryReplayHistory(state, 'india').completedReplayCount, 1);
    assert.equal(state.rewards.xp, 250);
    assert.deepEqual(state.rewards.stamps, [INDIA_PASSPORT_STAMP_ID]);
  });

  it('sanitizes malformed or spoofed replay payloads and keeps locked Australia/Egypt inactive', () => {
    assert.equal(getCountryReplayCapabilities('australia').isImplemented, true);
    assert.deepEqual(getCountryReplayCapabilities('australia').supportedStages, [
      'discover',
      'build',
      'practice',
      'perform',
    ]);
    assert.equal(getCountryReplayCapabilities('egypt').isImplemented, false);

    const base = completeIndiaLifetime(createDefaultProgress());
    const spoofedRaw = {
      ...base,
      replayState: {
        activeAttempts: {
          australia: {
            countryId: 'australia',
            attemptNumber: 1,
            status: 'completed',
            currentStage: 'perform',
            completedActivityIds: ['fake'],
            startedAt: '2026-01-01T00:00:00.000Z',
          },
          scotland: {
            countryId: 'scotland',
            attemptNumber: 1,
            status: 'completed',
            currentStage: 'perform',
            completedActivityIds: [SCOTLAND_DISCOVERY_ACTIVITY_ID, 'scotland_build'],
            startedAt: '2026-01-01T00:00:00.000Z',
          },
          india: {
            countryId: 'india',
            attemptNumber: 3,
            status: 'completed',
            currentStage: 'perform',
            // Spoofed perform/practice without Word Detective objects found
            completedActivityIds: [
              WORD_DETECTIVE_ACTIVITY_ID,
              SENTENCE_TRAIN_ACTIVITY_ID,
              SPOT_AND_SPEAK_ACTIVITY_ID,
              FINAL_JAIPUR_SHOWCASE_ACTIVITY_ID,
            ],
            wordDetectiveFoundIds: ['only_one'],
            startedAt: '2026-01-01T00:00:00.000Z',
          },
        },
        history: {
          india: {
            totalAttemptsStarted: 1,
            completedReplayCount: 99,
          },
        },
      },
    };

    const validated = migrateAndValidateProgress(JSON.parse(JSON.stringify(spoofedRaw)));
    assert.equal(hasActiveCountryReplay(validated, 'australia'), false);
    // Scotland locked because Kenya wasn't completed
    assert.equal(hasActiveCountryReplay(validated, 'scotland'), false);
    // India replay clamped back to DISCOVER because wordDetectiveFoundIds didn't pass validation
    assert.equal(getCountryReplayAttempt(validated, 'india')?.currentStage, 'discover');
    assert.equal(getCountryReplayAttempt(validated, 'india')?.status, 'in_progress');
    assert.deepEqual(getCountryReplayAttempt(validated, 'india')?.completedActivityIds, []);
    // History count clamped to totalAttemptsStarted (normalized with active attemptNumber)
    assert.equal(getCountryReplayHistory(validated, 'india').completedReplayCount <= 3, true);
  });
});
