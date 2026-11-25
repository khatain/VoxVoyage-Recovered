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
  completeScotlandPerformMission,
  completeScotlandPracticeStation,
  createDefaultProgress,
  getCountryReplayAttempt,
  getCountryReplayHistory,
  getScotlandEffectiveEntry,
  isJaipurMissionCompleted,
  isKenyaMissionCompleted,
  isScotlandBuildCompleted,
  isScotlandDiscoverCompleted,
  isScotlandMissionCompleted,
  isScotlandPerformCompleted,
  isScotlandPerformUnlocked,
  isScotlandPracticeCompleted,
  isScotlandUnlocked,
  KENYA_MISSION_ID,
  markJaipurAaravMet,
  markScotlandNpcMet,
  migrateAndValidateProgress,
  restartCountryReplayAttempt,
  SCOTLAND_BUILD_ACTIVITY_ID,
  SCOTLAND_BUILD_XP_REWARD,
  SCOTLAND_DISCOVERY_ACTIVITY_ID,
  SCOTLAND_MISSION_ID,
  SCOTLAND_PASSPORT_STAMP_ID,
  SCOTLAND_PERFORM_ACTIVITY_ID,
  SCOTLAND_PERFORM_XP_REWARD,
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
  startScotlandPerformMission,
  startScotlandPracticeMission,
} from '../src/utils/progressStorage';
import { JAIPUR_VOCAB_OBJECTS } from '../src/data/jaipurWorld';
import { INDIA_PASSPORT_STAMP_ID } from '../src/data/jaipurShowcase';
import { KENYA_DISCOVERY_TASKS } from '../src/data/kenyaDiscovery';
import { KENYA_BUILD_STATIONS } from '../src/data/kenyaBuild';
import { KENYA_PRACTICE_CONVERSATIONS } from '../src/data/kenyaPractice';
import { KENYA_PASSPORT_STAMP_ID } from '../src/data/kenyaPerform';
import {
  SCOTLAND_DISCOVERY_XP_REWARD,
  SCOTLAND_EVIDENCE_ITEMS,
} from '../src/data/scotlandDiscovery';
import { SCOTLAND_BUILD_STATIONS } from '../src/data/scotlandBuild';
import { SCOTLAND_PRACTICE_MISSIONS } from '../src/data/scotlandPractice';
import {
  areValidScotlandPerformEvidenceIds,
  areValidScotlandPerformQaStates,
  createEmptyScotlandPerformOutline,
  EILIDH_PERFORM_DIALOGUE,
  FIONA_PERFORM_DIALOGUE,
  isValidScotlandPerformCompletionPayload,
  isValidScotlandPerformOutline,
  isValidScotlandPerformPracticeMode,
  isValidScotlandPerformReflectionState,
  SCOTLAND_PERFORM_CONNECTORS,
  SCOTLAND_PERFORM_EVIDENCE_TOPICS,
  SCOTLAND_PERFORM_GUIDANCE_FEEDBACK,
  SCOTLAND_PERFORM_PLANNER_FIELDS,
  SCOTLAND_PERFORM_QA_QUESTIONS,
  SCOTLAND_PERFORM_REFLECTION_ITEMS,
  SCOTLAND_PERFORM_SAMPLE_REFERENCE,
  TOTAL_SCOTLAND_MISSION_XP,
  type ScotlandPerformCompletionPayload,
} from '../src/data/scotlandPerform';
import { SCOTLAND_STAGE_ACTIVITY_IDS } from '../src/data/scotlandWorld';
import { shuffleArray } from '../src/utils/shuffle';
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

function makePracticeReflection(): ScotlandSpeakingReflectionState {
  return {
    practiceMode: 'recorded_mic',
    checks: {
      comparedCultures: true,
      usedSpecificExample: true,
      explainedSimilarityOrDifference: true,
      spokeClearly: true,
    },
    followUpPracticed: true,
    completedAt: '2026-11-21T08:30:00.000Z',
  };
}

function completeScotlandDiscoverBuildPractice(initial: LocalProgressV1): LocalProgressV1 {
  let state = markScotlandNpcMet(initial, 'eilidh');
  state = startScotlandDiscoveryMission(state);
  for (const item of SCOTLAND_EVIDENCE_ITEMS) {
    state = completeScotlandDiscoveryStation(state, item.id);
  }
  state = startScotlandBuildMission(state);
  for (const st of SCOTLAND_BUILD_STATIONS) {
    state = completeScotlandBuildStation(state, st.id, st.modelSentence);
  }
  state = startScotlandPracticeMission(state);
  for (const m of SCOTLAND_PRACTICE_MISSIONS) {
    state = completeScotlandPracticeStation(state, m.id, makePracticeReflection());
  }
  return state;
}

function buildValidPerformPayload(
  overrides?: Partial<ScotlandPerformCompletionPayload>,
): ScotlandPerformCompletionPayload {
  return {
    selectedEvidenceIds: overrides?.selectedEvidenceIds ?? [
      'tartan_heritage_workshop',
      'highland_food_market',
    ],
    outline: overrides?.outline ?? {
      introduction: 'Hello everyone! Today I will compare Scotland and Thailand.',
      similarity: 'Both Scotland and Thailand share warm hospitality at community markets.',
      difference: 'While Scotland weaves warm wool tartan, Thailand weaves light Praewa silk.',
      evidenceNotes: 'Tartan weaving vs Praewa silk; Scottish oatcakes vs jasmine rice.',
      conclusion: 'Thank you for listening! Understanding differences builds global respect.',
    },
    speechPracticeMode: overrides?.speechPracticeMode ?? 'recorded_mic',
    questionPracticeStates: overrides?.questionPracticeStates ?? {
      qa_eilidh: 'recorded_mic',
      qa_fiona: 'self_reported_no_mic',
    },
    reflectionState: overrides?.reflectionState ?? {
      checks: {
        introducedComparison: true,
        explainedSimilarity: true,
        explainedDifference: true,
        usedSpecificExamples: true,
        answeredBothQuestions: true,
        spokeClearlyConfidently: true,
      },
      completedAt: '2026-11-21T09:30:00.000Z',
    },
  };
}

describe('Scotland Phase 3E Stage 4 — PERFORM (Final Cultural Exchange Challenge)', () => {
  it('1-4: enforces strict progression gates before PERFORM and unlocks cleanly at 650 XP without granting PERFORM XP on start', () => {
    const fresh = createDefaultProgress();
    assert.equal(isScotlandUnlocked(fresh), false);
    assert.equal(isScotlandPerformUnlocked(fresh), false);
    assert.equal(startScotlandPerformMission(fresh), fresh);

    const postKenya = buildPrerequisiteIndiaAndKenya();
    assert.equal(postKenya.rewards.xp, 500);
    assert.equal(isScotlandPerformUnlocked(postKenya), false);
    assert.equal(startScotlandPerformMission(postKenya), postKenya);

    // DISCOVER only -> locked
    let discoverOnly = startScotlandDiscoveryMission(markScotlandNpcMet(postKenya, 'eilidh'));
    for (const item of SCOTLAND_EVIDENCE_ITEMS) {
      discoverOnly = completeScotlandDiscoveryStation(discoverOnly, item.id);
    }
    assert.equal(isScotlandDiscoverCompleted(discoverOnly), true);
    assert.equal(isScotlandPerformUnlocked(discoverOnly), false);
    assert.equal(startScotlandPerformMission(discoverOnly), discoverOnly);

    // DISCOVER + BUILD only -> locked
    let buildOnly = startScotlandBuildMission(discoverOnly);
    for (const st of SCOTLAND_BUILD_STATIONS) {
      buildOnly = completeScotlandBuildStation(buildOnly, st.id, st.modelSentence);
    }
    assert.equal(buildOnly.rewards.xp, 600);
    assert.equal(isScotlandBuildCompleted(buildOnly), true);
    assert.equal(isScotlandPracticeCompleted(buildOnly), false);
    assert.equal(isScotlandPerformUnlocked(buildOnly), false);
    assert.equal(startScotlandPerformMission(buildOnly), buildOnly);

    // DISCOVER + BUILD + 4/5 PRACTICE -> still locked
    let partialPractice = startScotlandPracticeMission(buildOnly);
    for (const m of SCOTLAND_PRACTICE_MISSIONS.slice(0, 4)) {
      partialPractice = completeScotlandPracticeStation(
        partialPractice,
        m.id,
        makePracticeReflection(),
      );
    }
    assert.equal(isScotlandPerformUnlocked(partialPractice), false);
    assert.equal(startScotlandPerformMission(partialPractice), partialPractice);

    // All 5 PRACTICE completed -> 650 XP, PERFORM unlocked, stamp still withheld
    const postPractice = completeScotlandPracticeStation(
      partialPractice,
      'lochside_castle_viewpoint',
      makePracticeReflection(),
    );
    assert.equal(postPractice.rewards.xp, 650);
    assert.equal(isScotlandPracticeCompleted(postPractice), true);
    assert.equal(isScotlandPerformUnlocked(postPractice), true);
    assert.equal(isScotlandPerformCompleted(postPractice), false);
    assert.equal(postPractice.rewards.stamps.includes(SCOTLAND_PASSPORT_STAMP_ID), false);

    // Starting PERFORM sets scotlandPerformStarted without granting extra XP
    const started = startScotlandPerformMission(postPractice);
    assert.equal(started.rewards.xp, 650);
    assert.equal(started.missionProgress[SCOTLAND_MISSION_ID]?.scotlandPerformStarted, true);
    assert.equal(started.missionProgress[SCOTLAND_MISSION_ID]?.currentStage, 'perform');
    assert.equal(started.missionProgress[SCOTLAND_MISSION_ID]?.status, 'in_progress');
  });

  it('5-11: validates curriculum configs, >= 2 evidence selection, 5-part outline, practice mode, 2 Q&As, 6-check reflection, and start gating', () => {
    // Curriculum content contracts
    assert.equal(SCOTLAND_PERFORM_EVIDENCE_TOPICS.length, 5);
    assert.equal(SCOTLAND_PERFORM_PLANNER_FIELDS.length, 5);
    assert.equal(SCOTLAND_PERFORM_CONNECTORS.length >= 5, true);
    assert.equal(SCOTLAND_PERFORM_QA_QUESTIONS.length, 2);
    assert.equal(SCOTLAND_PERFORM_QA_QUESTIONS[0]?.id, 'qa_eilidh');
    assert.equal(SCOTLAND_PERFORM_QA_QUESTIONS[1]?.id, 'qa_fiona');
    assert.equal(SCOTLAND_PERFORM_REFLECTION_ITEMS.length, 6);
    assert.equal(EILIDH_PERFORM_DIALOGUE.ready.en.length > 20, true);
    assert.equal(FIONA_PERFORM_DIALOGUE.ready.en.length > 20, true);
    assert.equal(SCOTLAND_PERFORM_SAMPLE_REFERENCE.en.includes('Reference Example Only'), true);
    assert.equal(SCOTLAND_PERFORM_GUIDANCE_FEEDBACK.positive.en.length > 20, true);

    const postPractice = completeScotlandDiscoverBuildPractice(buildPrerequisiteIndiaAndKenya());

    // 11: Cannot complete PERFORM before startScotlandPerformMission
    const blockedBeforeStart = completeScotlandPerformMission(
      postPractice,
      buildValidPerformPayload(),
    );
    assert.equal(blockedBeforeStart, postPractice);

    const started = startScotlandPerformMission(postPractice);

    // 5-6: Evidence requires >= 2 valid distinct landmark IDs
    assert.equal(areValidScotlandPerformEvidenceIds(['highland_village_square']), false);
    assert.equal(
      areValidScotlandPerformEvidenceIds(['highland_village_square', 'highland_village_square']),
      false,
    );
    assert.equal(
      areValidScotlandPerformEvidenceIds(['highland_village_square', 'fake_id']),
      false,
    );
    assert.equal(
      areValidScotlandPerformEvidenceIds(['highland_village_square', 'tartan_heritage_workshop']),
      true,
    );
    assert.equal(
      completeScotlandPerformMission(
        started,
        buildValidPerformPayload({ selectedEvidenceIds: ['highland_village_square'] }),
      ),
      started,
    );
    assert.equal(
      completeScotlandPerformMission(
        started,
        buildValidPerformPayload({ selectedEvidenceIds: ['bad_one', 'bad_two'] }),
      ),
      started,
    );

    // 7: Outline requires all 5 sections non-empty
    const emptyOutline = createEmptyScotlandPerformOutline();
    assert.equal(isValidScotlandPerformOutline(emptyOutline), false);
    assert.equal(
      isValidScotlandPerformOutline({
        ...emptyOutline,
        introduction: 'Hi',
        similarity: 'Both love food',
        difference: 'Different weather',
        evidenceNotes: 'Rice vs oats',
        conclusion: '   ',
      }),
      false,
    );
    assert.equal(
      completeScotlandPerformMission(
        started,
        buildValidPerformPayload({
          outline: {
            ...buildValidPerformPayload().outline,
            difference: '   ',
          },
        }),
      ),
      started,
    );

    // 8: Practice mode must be recorded_mic or self_reported_no_mic
    assert.equal(isValidScotlandPerformPracticeMode('recorded_mic'), true);
    assert.equal(isValidScotlandPerformPracticeMode('self_reported_no_mic'), true);
    assert.equal(isValidScotlandPerformPracticeMode('ai_transcript'), false);
    assert.equal(
      completeScotlandPerformMission(
        started,
        buildValidPerformPayload({
          speechPracticeMode: 'invalid' as unknown as 'recorded_mic',
        }),
      ),
      started,
    );

    // 9: Both Q&A questions (qa_eilidh + qa_fiona) required
    assert.equal(areValidScotlandPerformQaStates({ qa_eilidh: 'recorded_mic' }), false);
    assert.equal(areValidScotlandPerformQaStates({ qa_fiona: 'self_reported_no_mic' }), false);
    assert.equal(
      areValidScotlandPerformQaStates({
        qa_eilidh: 'recorded_mic',
        qa_fiona: 'self_reported_no_mic',
      }),
      true,
    );
    assert.equal(
      completeScotlandPerformMission(
        started,
        buildValidPerformPayload({ questionPracticeStates: { qa_eilidh: 'recorded_mic' } }),
      ),
      started,
    );

    // 10: Self-reflection requires 6 booleans + >= 1 true + completedAt
    assert.equal(
      isValidScotlandPerformReflectionState({
        checks: {
          introducedComparison: false,
          explainedSimilarity: false,
          explainedDifference: false,
          usedSpecificExamples: false,
          answeredBothQuestions: false,
          spokeClearlyConfidently: false,
        },
        completedAt: '2026-11-21T09:30:00.000Z',
      }),
      false,
    );
    assert.equal(
      isValidScotlandPerformReflectionState({
        checks: {
          introducedComparison: true,
          explainedSimilarity: false,
          explainedDifference: false,
          usedSpecificExamples: false,
          answeredBothQuestions: false,
          spokeClearlyConfidently: false,
        },
        completedAt: '',
      }),
      false,
    );
    assert.equal(
      isValidScotlandPerformCompletionPayload(buildValidPerformPayload()),
      true,
    );
  });

  it('12-17: awards +100 XP once (650->750), grants stamp_scotland_highlands once, marks mission complete, and blocks duplicate rewards on repeat or replay', () => {
    const postPractice = completeScotlandDiscoverBuildPractice(buildPrerequisiteIndiaAndKenya());
    const started = startScotlandPerformMission(postPractice);
    const payload = buildValidPerformPayload({
      speechPracticeMode: 'self_reported_no_mic',
      questionPracticeStates: {
        qa_eilidh: 'self_reported_no_mic',
        qa_fiona: 'self_reported_no_mic',
      },
    });

    const completed = completeScotlandPerformMission(started, payload);

    assert.equal(SCOTLAND_PERFORM_XP_REWARD, 100);
    assert.equal(TOTAL_SCOTLAND_MISSION_XP, 250);
    assert.equal(
      SCOTLAND_DISCOVERY_XP_REWARD +
        SCOTLAND_BUILD_XP_REWARD +
        SCOTLAND_PRACTICE_XP_REWARD +
        SCOTLAND_PERFORM_XP_REWARD,
      250,
    );
    assert.equal(completed.rewards.xp, 750);
    assert.equal(isScotlandMissionCompleted(completed), true);
    assert.equal(isScotlandPerformCompleted(completed), true);
    assert.equal(completed.rewards.stamps.includes(SCOTLAND_PASSPORT_STAMP_ID), true);
    assert.equal(
      completed.rewards.stamps.filter((s) => s === SCOTLAND_PASSPORT_STAMP_ID).length,
      1,
    );

    const scotEntry = completed.missionProgress[SCOTLAND_MISSION_ID];
    assert.equal(scotEntry?.status, 'completed');
    assert.equal(scotEntry?.currentStage, 'perform');
    assert.equal(scotEntry?.scotlandPerformCompleted, true);
    assert.equal(scotEntry?.scotlandPerformSpeechPracticeMode, 'self_reported_no_mic');
    assert.deepEqual(scotEntry?.scotlandPerformSelectedEvidenceIds, payload.selectedEvidenceIds);
    assert.equal(
      scotEntry?.completedActivityIds.includes(SCOTLAND_PERFORM_ACTIVITY_ID),
      true,
    );
    assert.equal(SCOTLAND_PERFORM_ACTIVITY_ID, SCOTLAND_STAGE_ACTIVITY_IDS.perform);
    assert.equal(SCOTLAND_PERFORM_ACTIVITY_ID, 'scotland_cultural_showcase_perform');
    assert.equal(Boolean(scotEntry?.completedAt), true);

    // Repeating completion in lifetime grants 0 extra XP and 0 duplicate stamps
    const repeated = completeScotlandPerformMission(
      completed,
      buildValidPerformPayload({ speechPracticeMode: 'recorded_mic' }),
    );
    assert.equal(repeated.rewards.xp, 750);
    assert.equal(
      repeated.rewards.stamps.filter((s) => s === SCOTLAND_PASSPORT_STAMP_ID).length,
      1,
    );
    assert.equal(
      repeated.missionProgress[SCOTLAND_MISSION_ID]?.scotlandPerformSpeechPracticeMode,
      'recorded_mic',
    );

    // Replaying Scotland grants 0 extra XP and 0 duplicate stamps across all 4 stages
    let replayState = startCountryReplay(repeated, 'scotland');
    assert.equal(isScotlandMissionCompleted(replayState), true); // lifetime stamp preserved
    replayState = completeScotlandDiscoverBuildPractice(replayState);
    replayState = startScotlandPerformMission(replayState);
    replayState = completeScotlandPerformMission(replayState, buildValidPerformPayload());

    assert.equal(replayState.rewards.xp, 750);
    assert.deepEqual(replayState.rewards.stamps, [
      INDIA_PASSPORT_STAMP_ID,
      KENYA_PASSPORT_STAMP_ID,
      SCOTLAND_PASSPORT_STAMP_ID,
    ]);
    assert.equal(getCountryReplayHistory(replayState, 'scotland').completedReplayCount, 1);
  });

  it('18-20: preserves valid PERFORM state across reload with zero audio payloads, sanitizes spoofed state, preserves India/Kenya & Stages 1-3, and preserves randomization', () => {
    const postPractice = completeScotlandDiscoverBuildPractice(buildPrerequisiteIndiaAndKenya());
    const completed = completeScotlandPerformMission(
      startScotlandPerformMission(postPractice),
      buildValidPerformPayload(),
    );

    const serialized = JSON.stringify(completed);
    // Zero binary or base64 audio persisted in local progress
    assert.equal(serialized.includes('data:audio'), false);
    assert.equal(serialized.includes('blob:'), false);

    const rehydrated = migrateAndValidateProgress(JSON.parse(serialized));
    assert.equal(rehydrated.rewards.xp, 750);
    assert.equal(isScotlandMissionCompleted(rehydrated), true);
    assert.deepEqual(rehydrated.rewards.stamps, [
      INDIA_PASSPORT_STAMP_ID,
      KENYA_PASSPORT_STAMP_ID,
      SCOTLAND_PASSPORT_STAMP_ID,
    ]);
    assert.equal(
      rehydrated.missionProgress[SCOTLAND_MISSION_ID]?.scotlandPerformOutline?.introduction,
      completed.missionProgress[SCOTLAND_MISSION_ID]?.scotlandPerformOutline?.introduction,
    );

    // 19: India, Kenya, and Scotland Stages 1-3 remain intact
    assert.equal(isJaipurMissionCompleted(rehydrated), true);
    assert.equal(isKenyaMissionCompleted(rehydrated), true);
    assert.equal(rehydrated.missionProgress[KENYA_MISSION_ID]?.status, 'completed');
    assert.equal(isScotlandDiscoverCompleted(rehydrated), true);
    assert.equal(isScotlandBuildCompleted(rehydrated), true);
    assert.equal(isScotlandPracticeCompleted(rehydrated), true);
    assert.equal(
      rehydrated.missionProgress[SCOTLAND_MISSION_ID]?.scotlandDiscoveredEvidenceIds?.length,
      5,
    );
    assert.equal(
      Object.keys(rehydrated.missionProgress[SCOTLAND_MISSION_ID]?.scotlandBuiltSentences ?? {})
        .length,
      5,
    );
    assert.equal(
      rehydrated.missionProgress[SCOTLAND_MISSION_ID]?.scotlandCompletedSpeakingIds?.length,
      5,
    );

    // Spoofed PERFORM payload (missing Q&A / incomplete outline / spoofed stamp) gets sanitized cleanly
    const spoofed = {
      ...postPractice,
      rewards: {
        ...postPractice.rewards,
        stamps: [...postPractice.rewards.stamps, SCOTLAND_PASSPORT_STAMP_ID],
      },
      missionProgress: {
        ...postPractice.missionProgress,
        [SCOTLAND_MISSION_ID]: {
          ...postPractice.missionProgress[SCOTLAND_MISSION_ID],
          status: 'completed',
          currentStage: 'perform',
          scotlandPerformStarted: true,
          scotlandPerformSelectedEvidenceIds: ['tartan_heritage_workshop'], // only 1 (<2)
          scotlandPerformOutline: buildValidPerformPayload().outline,
          scotlandPerformSpeechPracticeMode: 'recorded_mic',
          scotlandPerformQuestionPracticeStates: { qa_eilidh: 'recorded_mic' }, // missing fiona
          scotlandPerformReflectionState: buildValidPerformPayload().reflectionState,
          scotlandPerformCompleted: true,
          completedActivityIds: [
            SCOTLAND_DISCOVERY_ACTIVITY_ID,
            SCOTLAND_BUILD_ACTIVITY_ID,
            SCOTLAND_PRACTICE_ACTIVITY_ID,
            SCOTLAND_PERFORM_ACTIVITY_ID,
          ],
        },
      },
    };
    const cleaned = migrateAndValidateProgress(JSON.parse(JSON.stringify(spoofed)));
    assert.equal(isScotlandMissionCompleted(cleaned), false);
    assert.equal(cleaned.rewards.stamps.includes(SCOTLAND_PASSPORT_STAMP_ID), false);
    assert.equal(cleaned.missionProgress[SCOTLAND_MISSION_ID]?.status, 'in_progress');
    assert.equal(cleaned.missionProgress[SCOTLAND_MISSION_ID]?.currentStage, 'perform');
    assert.deepEqual(cleaned.missionProgress[SCOTLAND_MISSION_ID]?.completedActivityIds, [
      SCOTLAND_DISCOVERY_ACTIVITY_ID,
      SCOTLAND_BUILD_ACTIVITY_ID,
      SCOTLAND_PRACTICE_ACTIVITY_ID,
    ]);

    // Restarting an active replay clears only active replay PERFORM progress, preserving 750 XP & lifetime stamp
    let replayRestart = startCountryReplay(completed, 'scotland');
    replayRestart = completeScotlandDiscoverBuildPractice(replayRestart);
    replayRestart = startScotlandPerformMission(replayRestart);
    assert.equal(getScotlandEffectiveEntry(replayRestart).scotlandPerformStarted, true);
    replayRestart = restartCountryReplayAttempt(replayRestart, 'scotland');
    assert.equal(getCountryReplayAttempt(replayRestart, 'scotland')?.currentStage, 'discover');
    assert.equal(getCountryReplayAttempt(replayRestart, 'scotland')?.scotlandPerformStarted, undefined);
    assert.equal(replayRestart.rewards.xp, 750);
    assert.equal(isScotlandMissionCompleted(replayRestart), true);

    // 20: Mini-game randomization helper remains deterministic with seeded RNG & preserves items
    const items = ['a', 'b', 'c', 'd', 'e'];
    const seededRng = () => {
      let s = 42;
      return () => {
        s = (s * 1664525 + 1013904223) % 4294967296;
        return s / 4294967296;
      };
    };
    assert.deepEqual(shuffleArray(items, seededRng()), shuffleArray(items, seededRng()));
    assert.equal(shuffleArray(items, seededRng()).length, items.length);
  });
});
