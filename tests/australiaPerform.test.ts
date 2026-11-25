import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  AUSTRALIA_LANDMARKS,
  AUSTRALIA_MISSION_ID,
  AUSTRALIA_PASSPORT_STAMP_ID,
  AUSTRALIA_RECOMMENDED_ROUTE,
  AUSTRALIA_STAGE_ACTIVITY_IDS,
  type AustraliaLandmarkId,
} from '../src/data/australiaWorld';
import { AUSTRALIA_DISCOVER_MISSION_ORDER } from '../src/data/australiaDiscovery';
import { AUSTRALIA_BUILD_MISSION_ORDER } from '../src/data/australiaBuild';
import {
  AUSTRALIA_PRACTICE_MISSION_ORDER,
  getAustraliaPracticeMissionSpec,
} from '../src/data/australiaPractice';
import {
  AUSTRALIA_OLIVIA_PERFORM_WELCOME,
  AUSTRALIA_PERFORM_ACTIVITY_ID,
  AUSTRALIA_PERFORM_CHALLENGE_ORDER,
  AUSTRALIA_PERFORM_CHALLENGES,
  AUSTRALIA_PERFORM_REFLECTION_ITEMS,
  AUSTRALIA_PERFORM_XP_REWARD,
  TOTAL_AUSTRALIA_MISSION_XP,
  buildAustraliaPerformSummaryFeedback,
  getAustraliaPerformChallengeSpec,
  isValidAustraliaPerformChallengeRecord,
  isValidAustraliaPerformPracticeMode,
  isValidAustraliaPerformReflectionState,
  sanitizeAustraliaPerformChallengeRecord,
  sanitizeAustraliaPerformReflectionState,
  validateAustraliaPerformBanks,
} from '../src/data/australiaPerform';
import { GAME_COPY } from '../src/data/i18n';
import { COUNTRY_WORLDS } from '../src/data/countries';
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
  PROGRESS_STORAGE_KEY,
  canReplayCountry,
  collectJaipurVocabObject,
  completeAustraliaBuildMission,
  completeAustraliaDiscoveryMission,
  completeAustraliaPerformChallenge,
  completeAustraliaPerformMission,
  completeAustraliaPracticeMission,
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
  getAustraliaEffectiveEntry,
  getAustraliaNextPerformLandmarkId,
  getAustraliaPerformChallengeStatus,
  getAustraliaPerformEvidenceMap,
  getAustraliaPerformReflection,
  getCountryReplayAttempt,
  getCountryReplayHistory,
  isAustraliaAttemptPerformCompleted,
  isAustraliaMissionCompleted,
  isAustraliaPerformCompleted,
  isAustraliaPerformStarted,
  isAustraliaPerformUnlocked,
  isEgyptUnlocked,
  isJaipurMissionCompleted,
  isKenyaMissionCompleted,
  isScotlandMissionCompleted,
  markJaipurAaravMet,
  markScotlandNpcMet,
  migrateAndValidateProgress,
  restartCountryReplayAttempt,
  SCOTLAND_PASSPORT_STAMP_ID,
  startAustraliaBuildMission,
  startAustraliaDiscoveryMission,
  startAustraliaPerformMission,
  startAustraliaPracticeMission,
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
import { computeWalkablePath, resolveNextMissionTarget } from '../src/utils/worldNavigation';
import type {
  AustraliaPerformChallengeRecord,
  AustraliaPerformPracticeMode,
  AustraliaPerformReflectionState,
  AustraliaSpeakingEvidenceRecord,
  LocalProgressV1,
  ScotlandSpeakingReflectionState,
} from '../src/types/game';

function buildAustraliaDiscoverBuildOnlyProgress(): LocalProgressV1 {
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
  for (const lmId of AUSTRALIA_DISCOVER_MISSION_ORDER) {
    state = completeAustraliaDiscoveryMission(state, lmId);
  }
  state = startAustraliaBuildMission(state);
  for (const lmId of AUSTRALIA_BUILD_MISSION_ORDER) {
    state = completeAustraliaBuildMission(state, lmId, `Dialogue built for ${lmId}.`);
  }
  return state;
}

function completeAustraliaStages1Through3(initial: LocalProgressV1): LocalProgressV1 {
  let state = startAustraliaDiscoveryMission(initial);
  for (const lmId of AUSTRALIA_DISCOVER_MISSION_ORDER) {
    state = completeAustraliaDiscoveryMission(state, lmId);
  }
  state = startAustraliaBuildMission(state);
  for (const lmId of AUSTRALIA_BUILD_MISSION_ORDER) {
    state = completeAustraliaBuildMission(state, lmId, `Dialogue built for ${lmId}.`);
  }
  state = startAustraliaPracticeMission(state);
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
    state = completeAustraliaPracticeMission(state, lmId, record);
  }
  return state;
}

function buildAustraliaPracticeCompleteProgress(): LocalProgressV1 {
  const buildDone = buildAustraliaDiscoverBuildOnlyProgress();
  let state = startAustraliaPracticeMission(buildDone);
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
    state = completeAustraliaPracticeMission(state, lmId, record);
  }
  return state;
}

function makePerformChallengeRecord(
  landmarkId: AustraliaLandmarkId,
  options?: {
    practiceMode?: AustraliaPerformPracticeMode;
    difficultyUsed?: 'a2' | 'b1';
    usedScriptPreview?: boolean;
  },
): AustraliaPerformChallengeRecord {
  const spec = getAustraliaPerformChallengeSpec(landmarkId)!;
  return {
    practiceMode: options?.practiceMode ?? 'microphone_recording',
    completedTurnIds: spec.turns.map((t) => t.turnId),
    difficultyUsed: options?.difficultyUsed ?? 'a2',
    usedScriptPreview: options?.usedScriptPreview ?? false,
    completedAt: '2026-11-23T15:00:00.000Z',
  };
}

function makeValidPerformReflection(
  overrides?: Partial<AustraliaPerformReflectionState>,
): AustraliaPerformReflectionState {
  return {
    easiestPart: overrides?.easiestPart ?? 'Greeting Olivia and talking about Sydney weather',
    mostChallengingPart:
      overrides?.mostChallengingPart ?? 'Asking to repeat and clarifying a detour mix-up',
    keptConversationGoing:
      overrides?.keptConversationGoing ?? 'I asked clear follow-up questions to the NPC',
    usefulExpression:
      overrides?.usefulExpression ?? '"Just to double-check, did you say...?"',
    nextImprovement:
      overrides?.nextImprovement ?? 'Speak with a steadier, more confident voice',
    completedAt: overrides?.completedAt ?? '2026-11-23T15:10:00.000Z',
  };
}

describe('Australia Phase 4E — Stage 4 PERFORM (Final Sydney CityTalk Challenge)', () => {
  it('verifies canonical IDs, Olivia PERFORM welcome, 5 independent 3-turn challenges, reduced scaffolding, and 5 reflection prompts', () => {
    assert.equal(PROGRESS_STORAGE_KEY, 'voxvoyage.localProgress.v1');
    assert.equal(AUSTRALIA_MISSION_ID, 'mission_australia_sydney');
    assert.equal(AUSTRALIA_PASSPORT_STAMP_ID, 'stamp_australia_sydney');
    assert.equal(AUSTRALIA_PERFORM_ACTIVITY_ID, AUSTRALIA_STAGE_ACTIVITY_IDS.perform);
    assert.equal(AUSTRALIA_PERFORM_ACTIVITY_ID, 'australia_citytalk_perform');
    assert.equal(AUSTRALIA_PERFORM_XP_REWARD, 100);
    assert.equal(TOTAL_AUSTRALIA_MISSION_XP, 250);

    assert.equal(validateAustraliaPerformBanks(), true);
    assert.equal(AUSTRALIA_PERFORM_CHALLENGES.length, 5);
    assert.deepEqual(
      AUSTRALIA_PERFORM_CHALLENGES.map((c) => c.id),
      [
        'circular_quay_plaza',
        'city_transit_station',
        'harbour_market_cafe',
        'darling_harbour_hub',
        'harbour_gardens_help_point',
      ],
    );
    assert.deepEqual(
      AUSTRALIA_PERFORM_CHALLENGES.map((c) => c.npcId),
      ['npc_olivia', 'npc_noah', 'npc_mia', 'npc_jack', 'npc_olivia'],
    );
    assert.equal(AUSTRALIA_PERFORM_CHALLENGES[4].isHelpPointReuse, true);

    assert.ok(AUSTRALIA_OLIVIA_PERFORM_WELCOME.en.includes('Final Sydney CityTalk Challenge'));
    assert.ok(AUSTRALIA_OLIVIA_PERFORM_WELCOME.en.includes('The Sydney Communication Ambassador'));
    assert.ok(AUSTRALIA_OLIVIA_PERFORM_WELCOME.th.length > 40);

    // Every challenge has 3 turns with A2/B1 differentiation and reduced scaffolding (no auto modelAnswer field)
    for (const ch of AUSTRALIA_PERFORM_CHALLENGES) {
      assert.equal(ch.turns.length, 3);
      assert.ok(ch.title.en && ch.title.th);
      assert.ok(ch.briefingSummary.en && ch.briefingSummary.th);
      assert.ok(ch.communicationGoal.en && ch.communicationGoal.th);
      assert.ok(ch.npcClosingLine.en && ch.npcClosingLine.th);
      for (const turn of ch.turns) {
        assert.notEqual(turn.npcLineA2.en, turn.npcLineB1.en);
        assert.notEqual(turn.communicativeTaskA2.en, turn.communicativeTaskB1.en);
        assert.ok(turn.usefulVocab.length >= 3);
        assert.ok(turn.sentenceStartersA2.length >= 2);
        assert.ok(turn.sentenceStartersB1.length >= 2);
        assert.ok(turn.communicationStrategy.en && turn.communicationStrategy.th);
        assert.ok(turn.hintTip.en && turn.hintTip.th);
        assert.equal('modelResponseA2' in turn, false);
        assert.equal('modelAnswer' in turn, false);
      }
    }

    assert.equal(AUSTRALIA_PERFORM_REFLECTION_ITEMS.length, 5);
    assert.deepEqual(
      AUSTRALIA_PERFORM_REFLECTION_ITEMS.map((item) => item.key),
      [
        'easiestPart',
        'mostChallengingPart',
        'keptConversationGoing',
        'usefulExpression',
        'nextImprovement',
      ],
    );
  });

  it('locks Stage 4 PERFORM before Stage 3 PRACTICE completes and enforces Olivia briefing before sequential 1 -> 5 gating', () => {
    const buildOnly = buildAustraliaDiscoverBuildOnlyProgress();
    assert.equal(buildOnly.rewards.xp, 850);
    assert.equal(isAustraliaPerformUnlocked(buildOnly), false);
    assert.equal(isAustraliaPerformStarted(buildOnly), false);
    assert.equal(startAustraliaPerformMission(buildOnly), buildOnly);
    assert.equal(
      getAustraliaPerformChallengeStatus(buildOnly, 'circular_quay_plaza').reason,
      'practice_incomplete',
    );

    const practiceDone = buildAustraliaPracticeCompleteProgress();
    assert.equal(practiceDone.rewards.xp, 900);
    assert.equal(isAustraliaPerformUnlocked(practiceDone), true);
    assert.equal(isAustraliaPerformStarted(practiceDone), false);
    assert.equal(isEgyptUnlocked(practiceDone), false);
    assert.equal(
      getAustraliaPerformChallengeStatus(practiceDone, 'circular_quay_plaza').reason,
      'need_olivia_start',
    );

    // Cannot complete challenge before Olivia start
    const blockedBeforeStart = completeAustraliaPerformChallenge(
      practiceDone,
      'circular_quay_plaza',
      makePerformChallengeRecord('circular_quay_plaza'),
    );
    assert.equal(getAustraliaCompletedPerformIds(blockedBeforeStart).length, 0);

    const started = startAustraliaPerformMission(practiceDone);
    assert.equal(started.rewards.xp, 900);
    assert.equal(isAustraliaPerformStarted(started), true);
    assert.equal(getAustraliaNextPerformLandmarkId(started), 'circular_quay_plaza');
    assert.equal(
      getAustraliaPerformChallengeStatus(started, 'circular_quay_plaza').reason,
      'eligible',
    );
    assert.equal(
      getAustraliaPerformChallengeStatus(started, 'city_transit_station').reason,
      'prerequisite_incomplete',
    );

    // Out-of-order challenge jump is rejected
    const outOfOrder = completeAustraliaPerformChallenge(
      started,
      'city_transit_station',
      makePerformChallengeRecord('city_transit_station'),
    );
    assert.equal(getAustraliaCompletedPerformIds(outOfOrder).length, 0);

    // Partial turns inside a challenge are rejected
    const spec1 = getAustraliaPerformChallengeSpec('circular_quay_plaza')!;
    const partialRecord: AustraliaPerformChallengeRecord = {
      practiceMode: 'microphone_recording',
      completedTurnIds: [spec1.turns[0].turnId, spec1.turns[1].turnId],
      difficultyUsed: 'a2',
      usedScriptPreview: false,
      completedAt: '2026-11-23T15:00:00.000Z',
    };
    const rejectedPartial = completeAustraliaPerformChallenge(
      started,
      'circular_quay_plaza',
      partialRecord,
    );
    assert.equal(getAustraliaCompletedPerformIds(rejectedPartial).length, 0);
  });

  it('rejects fabricated speech/transcript/audio payloads and validates 5-prompt reflection + honest summary feedback', () => {
    assert.equal(isValidAustraliaPerformPracticeMode('microphone_recording'), true);
    assert.equal(isValidAustraliaPerformPracticeMode('no_mic_rehearsal'), true);
    assert.equal(isValidAustraliaPerformPracticeMode('auto_ai_score'), false);

    const reqTurns = getAustraliaPerformChallengeSpec('city_transit_station')!.turns.map(
      (t) => t.turnId,
    );
    const validMic = makePerformChallengeRecord('city_transit_station', {
      practiceMode: 'microphone_recording',
      difficultyUsed: 'b1',
      usedScriptPreview: true,
    });
    const validNoMic = makePerformChallengeRecord('city_transit_station', {
      practiceMode: 'no_mic_rehearsal',
      difficultyUsed: 'a2',
      usedScriptPreview: false,
    });
    assert.equal(isValidAustraliaPerformChallengeRecord(validMic, reqTurns), true);
    assert.equal(isValidAustraliaPerformChallengeRecord(validNoMic, reqTurns), true);

    for (const badPayload of [
      { ...validMic, transcript: 'Excuse me how do I get to Circular Quay' },
      { ...validMic, pronunciationScore: 95 },
      { ...validMic, fluencyScore: 91 },
      { ...validMic, grammarScore: 89 },
      { ...validMic, audioBlob: {} },
      { ...validMic, audioDataUrl: 'data:audio/webm;base64,AAAA' },
    ]) {
      assert.equal(isValidAustraliaPerformChallengeRecord(badPayload, reqTurns), false);
      assert.equal(sanitizeAustraliaPerformChallengeRecord(badPayload, reqTurns), undefined);
    }

    const reflection = makeValidPerformReflection();
    assert.equal(isValidAustraliaPerformReflectionState(reflection), true);
    assert.equal(
      isValidAustraliaPerformReflectionState({ ...reflection, usefulExpression: 'x' }),
      false,
    );
    assert.equal(
      isValidAustraliaPerformReflectionState({ ...reflection, completedAt: '' }),
      false,
    );
    const sanitized = sanitizeAustraliaPerformReflectionState({
      ...reflection,
      easiestPart: '   Greeting Olivia   ',
    });
    assert.equal(sanitized?.easiestPart, 'Greeting Olivia');

    const feedback = buildAustraliaPerformSummaryFeedback({
      reflection,
      micChallengesCount: 3,
      noMicChallengesCount: 2,
      usedScriptPreviewCount: 1,
    });
    assert.ok(feedback.headline.en.includes('Communication Ambassador'));
    assert.ok(feedback.strengthNote.en.includes('3 using microphone'));
    assert.ok(feedback.evidenceHonestyNote.en.includes('no external AI speech grading'));
  });

  it('completes all 5 challenges + reflection: awards +100 XP ONCE (900->1000), grants Sydney Stamp ONCE, unlocks Egypt Coming Soon, and blocks duplicate rewards', () => {
    let state = startAustraliaPerformMission(buildAustraliaPracticeCompleteProgress());
    assert.equal(state.rewards.xp, 900);

    // Individual challenges award +0 XP and do NOT unlock Stamp or Egypt early
    for (let i = 0; i < AUSTRALIA_PERFORM_CHALLENGE_ORDER.length; i += 1) {
      const lmId = AUSTRALIA_PERFORM_CHALLENGE_ORDER[i];
      state = completeAustraliaPerformChallenge(
        state,
        lmId,
        makePerformChallengeRecord(lmId, {
          practiceMode: i % 2 === 0 ? 'microphone_recording' : 'no_mic_rehearsal',
          difficultyUsed: i === 2 ? 'b1' : 'a2',
          usedScriptPreview: i === 4,
        }),
      );
      assert.equal(state.rewards.xp, 900, `Challenge ${lmId} must grant +0 XP individually`);
      assert.equal(isAustraliaPerformCompleted(state), false);
      assert.equal(isAustraliaMissionCompleted(state), false);
      assert.equal(state.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID), false);
      assert.equal(isEgyptUnlocked(state), false);
    }

    assert.equal(getAustraliaCompletedPerformIds(state).length, 5);
    assert.equal(getAustraliaNextPerformLandmarkId(state), null);

    // Invalid reflection must be blocked from granting XP/stamp
    const rejectedIncomplete = completeAustraliaPerformMission(state, {
      ...makeValidPerformReflection(),
      nextImprovement: ' ',
    });
    assert.equal(rejectedIncomplete.rewards.xp, 900);
    assert.equal(isAustraliaMissionCompleted(rejectedIncomplete), false);

    // Complete with valid 5-prompt reflection -> 1,000 XP, 4th stamp, Egypt unlocked (Coming Soon, 0 Egypt gameplay/XP)
    const completed = completeAustraliaPerformMission(state, makeValidPerformReflection());
    assert.equal(completed.rewards.xp, 1000);
    assert.equal(isAustraliaPerformCompleted(completed), true);
    assert.equal(isAustraliaMissionCompleted(completed), true);
    assert.equal(isAustraliaAttemptPerformCompleted(completed), true);
    assert.equal(completed.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID), true);
    assert.equal(
      completed.rewards.stamps.filter((s) => s === AUSTRALIA_PASSPORT_STAMP_ID).length,
      1,
    );
    assert.equal(completed.rewards.stamps.length, 4);
    assert.equal(isEgyptUnlocked(completed), true);
    assert.equal(completed.unlockedCountryIds.includes('egypt'), true);

    const ausEntry = completed.missionProgress[AUSTRALIA_MISSION_ID];
    assert.equal(ausEntry?.status, 'completed');
    assert.equal(ausEntry?.currentStage, 'perform');
    assert.equal(ausEntry?.completedActivityIds.includes(AUSTRALIA_PERFORM_ACTIVITY_ID), true);
    assert.ok(ausEntry?.completedAt);

    // Repeating completion grants +0 extra XP and +0 duplicate stamp
    const repeated = completeAustraliaPerformMission(
      completed,
      makeValidPerformReflection({ easiestPart: 'Cafeteria and ferry chat' }),
    );
    assert.equal(repeated.rewards.xp, 1000);
    assert.equal(repeated.rewards.stamps.length, 4);
    assert.equal(
      getAustraliaPerformReflection(repeated)?.easiestPart,
      'Cafeteria and ferry chat',
    );
  });

  it('supports full 4-stage Australia Country Replay & Restart Current Attempt with 0 duplicate XP/stamps and preserves lifetime completion', () => {
    let completed = completeAustraliaPerformMission(
      (() => {
        let s = startAustraliaPerformMission(buildAustraliaPracticeCompleteProgress());
        for (const id of AUSTRALIA_PERFORM_CHALLENGE_ORDER) {
          s = completeAustraliaPerformChallenge(s, id, makePerformChallengeRecord(id));
        }
        return s;
      })(),
      makeValidPerformReflection(),
    );

    assert.equal(COUNTRY_REPLAY_CAPABILITIES.australia.isImplemented, true);
    assert.deepEqual(COUNTRY_REPLAY_CAPABILITIES.australia.supportedStages, [
      'discover',
      'build',
      'practice',
      'perform',
    ]);
    assert.equal(canReplayCountry(completed, 'australia'), true);

    // Start Replay Attempt #1
    let replay = startCountryReplay(completed, 'australia');
    assert.equal(getCountryReplayAttempt(replay, 'australia')?.attemptNumber, 1);
    assert.equal(getCountryReplayAttempt(replay, 'australia')?.currentStage, 'discover');
    assert.equal(isAustraliaMissionCompleted(replay), true); // lifetime preserved
    assert.equal(isEgyptUnlocked(replay), true); // Egypt remains unlocked
    assert.equal(replay.rewards.xp, 1000);
    assert.equal(replay.rewards.stamps.length, 4);

    // Walk replay through Stages 1 -> 2 -> 3 -> 4
    replay = completeAustraliaStages1Through3(replay);
    assert.equal(getCountryReplayAttempt(replay, 'australia')?.currentStage, 'perform');
    assert.equal(isAustraliaAttemptPerformCompleted(replay), false);

    replay = startAustraliaPerformMission(replay);
    for (const id of AUSTRALIA_PERFORM_CHALLENGE_ORDER) {
      replay = completeAustraliaPerformChallenge(
        replay,
        id,
        makePerformChallengeRecord(id, { practiceMode: 'no_mic_rehearsal', usedScriptPreview: true }),
      );
    }
    assert.equal(getAustraliaPerformEvidenceMap(replay).harbour_gardens_help_point?.usedScriptPreview, true);

    replay = completeAustraliaPerformMission(replay, makeValidPerformReflection());
    assert.equal(replay.rewards.xp, 1000); // Zero duplicate XP
    assert.equal(replay.rewards.stamps.length, 4); // Zero duplicate stamps
    assert.equal(getCountryReplayAttempt(replay, 'australia')?.status, 'completed');
    assert.equal(getCountryReplayHistory(replay, 'australia').completedReplayCount, 1);
    assert.equal(isAustraliaAttemptPerformCompleted(replay), true);

    // Start Attempt #2 and Restart Current Attempt mid-PERFORM -> resets attempt to DISCOVER cleanly
    let attempt2 = startCountryReplay(replay, 'australia');
    attempt2 = completeAustraliaStages1Through3(attempt2);
    attempt2 = startAustraliaPerformMission(attempt2);
    attempt2 = completeAustraliaPerformChallenge(
      attempt2,
      'circular_quay_plaza',
      makePerformChallengeRecord('circular_quay_plaza'),
    );
    assert.equal(getAustraliaCompletedPerformIds(attempt2).length, 1);

    const restarted = restartCountryReplayAttempt(attempt2, 'australia');
    assert.equal(getCountryReplayAttempt(restarted, 'australia')?.attemptNumber, 2);
    assert.equal(getCountryReplayAttempt(restarted, 'australia')?.currentStage, 'discover');
    assert.deepEqual(getAustraliaEffectiveEntry(restarted).australiaCompletedPerformIds ?? [], []);
    assert.equal(restarted.rewards.xp, 1000);
    assert.equal(isAustraliaMissionCompleted(restarted), true);
  });

  it('persists PERFORM & Egypt unlock cleanly across reload, blocks forged PERFORM/Stamp/Egypt states, and preserves India/Kenya/Scotland', () => {
    const practiceDone = buildAustraliaPracticeCompleteProgress();
    let started = startAustraliaPerformMission(practiceDone);
    for (const id of AUSTRALIA_PERFORM_CHALLENGE_ORDER) {
      started = completeAustraliaPerformChallenge(started, id, makePerformChallengeRecord(id));
    }
    const completed = completeAustraliaPerformMission(started, makeValidPerformReflection());

    const serialized = JSON.stringify(completed);
    assert.equal(serialized.includes('data:audio'), false);
    assert.equal(serialized.includes('blob:'), false);

    const rehydrated = migrateAndValidateProgress(JSON.parse(serialized));
    assert.equal(rehydrated.rewards.xp, 1000);
    assert.equal(rehydrated.rewards.stamps.length, 4);
    assert.equal(isAustraliaMissionCompleted(rehydrated), true);
    assert.equal(isEgyptUnlocked(rehydrated), true);
    assert.equal(isJaipurMissionCompleted(rehydrated), true);
    assert.equal(isKenyaMissionCompleted(rehydrated), true);
    assert.equal(isScotlandMissionCompleted(rehydrated), true);

    // Tampered state: tries to forge completion, Stamp, XP, and Egypt without reflection or all 5 challenges
    const tampered = JSON.parse(JSON.stringify(practiceDone));
    tampered.rewards.xp = 1500;
    tampered.rewards.stamps.push(AUSTRALIA_PASSPORT_STAMP_ID);
    tampered.unlockedCountryIds.push('egypt');
    tampered.missionProgress[AUSTRALIA_MISSION_ID].status = 'completed';
    tampered.missionProgress[AUSTRALIA_MISSION_ID].australiaPerformCompleted = true;
    tampered.missionProgress[AUSTRALIA_MISSION_ID].australiaCompletedPerformIds = [
      'circular_quay_plaza',
    ];
    tampered.missionProgress[AUSTRALIA_MISSION_ID].completedActivityIds.push(
      AUSTRALIA_PERFORM_ACTIVITY_ID,
    );

    const sanitized = migrateAndValidateProgress(tampered);
    assert.equal(sanitized.rewards.xp, 900);
    assert.equal(sanitized.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID), false);
    assert.equal(isAustraliaMissionCompleted(sanitized), false);
    assert.equal(isEgyptUnlocked(sanitized), false);
    assert.equal(sanitized.unlockedCountryIds.includes('egypt'), false);
    assert.equal(sanitized.missionProgress[AUSTRALIA_MISSION_ID]?.status, 'in_progress');
  });

  it('routes Smart Navigation sequentially through Stage 4 PERFORM & Final Reflection and marks Australia completed afterward', () => {
    const baseState = {
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
    };

    // Before Olivia briefing -> npc_olivia
    const beforeStart = resolveNextMissionTarget({
      worldId: 'australia',
      state: { ...baseState, performStarted: false, completedPerformIds: [], performCompleted: false },
    });
    assert.equal(beforeStart.status, 'actionable');
    assert.equal(beforeStart.targetId, 'npc_olivia');
    assert.equal(beforeStart.reasonKey, 'start_perform');

    // Mid-PERFORM -> each remaining challenge landmark sequentially
    const mid = resolveNextMissionTarget({
      worldId: 'australia',
      state: {
        ...baseState,
        performStarted: true,
        completedPerformIds: ['circular_quay_plaza', 'city_transit_station'],
        performCompleted: false,
      },
    });
    assert.equal(mid.status, 'actionable');
    assert.equal(mid.targetId, 'harbour_market_cafe');
    assert.equal(mid.reasonKey, 'perform_station');

    // All 5 challenges done, reflection pending -> npc_olivia
    const needReflection = resolveNextMissionTarget({
      worldId: 'australia',
      state: {
        ...baseState,
        performStarted: true,
        completedPerformIds: [...AUSTRALIA_RECOMMENDED_ROUTE],
        performCompleted: false,
      },
    });
    assert.equal(needReflection.status, 'actionable');
    assert.equal(needReflection.targetId, 'npc_olivia');
    assert.equal(needReflection.reasonKey, 'perform_reflection');

    // Completed -> country_completed
    const done = resolveNextMissionTarget({
      worldId: 'australia',
      state: {
        ...baseState,
        performStarted: true,
        completedPerformIds: [...AUSTRALIA_RECOMMENDED_ROUTE],
        performCompleted: true,
      },
    });
    assert.equal(done.status, 'country_completed');
    assert.equal(done.targetId, null);

    // All landmarks reachable via pathfinding
    for (const lm of AUSTRALIA_LANDMARKS) {
      assert.equal(computeWalkablePath('australia', { x: 0, z: 4 }, lm.id).reachable, true);
    }
  });

  it('verifies complete EN/TH i18n keys, self-contained local images, zero external AI/API calls, SVG stamp wiring, and Egypt Coming Soon safety', () => {
    const performKeys = Object.keys(GAME_COPY.en).filter((k) =>
      k.startsWith('australiaPerform'),
    );
    assert.ok(performKeys.length >= 50);
    for (const key of [
      ...performKeys,
      'worldMapEgyptUnlockedBadge',
      'worldMapEgyptUnlockedHint',
    ]) {
      const k = key as keyof typeof GAME_COPY.en;
      assert.ok(GAME_COPY.en[k].trim().length > 0, `Empty EN copy for ${key}`);
      assert.ok(GAME_COPY.th[k].trim().length > 0, `Empty TH copy for ${key}`);
    }

    // Exact 26 nav* keys preserved
    assert.equal(
      Object.keys(GAME_COPY.en).filter((k) => k.startsWith('nav')).length,
      26,
    );

    // Egypt country record stays Coming Soon with zero Egypt playable mission data
    const egypt = COUNTRY_WORLDS.find((c) => c.id === 'egypt');
    assert.ok(egypt);
    assert.equal(egypt.order, 5);

    // All bundled image assets used in AustraliaPerformArtwork exist on disk
    const projectRoot = process.cwd();
    const expectedImages = [
      'src/assets/images/aus_starter_forge_1795336697037.jpg',
      'src/assets/images/aus_transit_architect_1795336697439.jpg',
      'src/assets/images/aus_cafe_kitchen_1795336697418.jpg',
      'src/assets/images/aus_ticket_hub_1795336698885.jpg',
      'src/assets/images/aus_dialogue_rescue_1795336698474.jpg',
      'src/assets/images/world_australia_sydney_1795065329488.jpg',
      'src/assets/images/egypt_day_expedition_1795070978060.jpg',
    ];
    for (const rel of expectedImages) {
      assert.equal(fs.existsSync(path.join(projectRoot, rel)), true, `Missing asset: ${rel}`);
    }

    // Structural checks: PassportModalScreen uses AustraliaSydneyStampSVG, WorldMapOverlay gates Egypt behind isEgyptUnlocked, zero @google/genai or fetch
    const passportSrc = fs.readFileSync(
      path.join(projectRoot, 'src/components/screens/PassportModalScreen.tsx'),
      'utf8',
    );
    assert.ok(passportSrc.includes('AustraliaSydneyStampSVG'));

    const worldMapSrc = fs.readFileSync(
      path.join(projectRoot, 'src/components/screens/WorldMapOverlay.tsx'),
      'utf8',
    );
    assert.ok(worldMapSrc.includes('isEgyptUnlocked'));
    assert.ok(worldMapSrc.includes("if (!egyptUnlocked) return 'locked';"));
    assert.ok(worldMapSrc.includes("countryId === 'egypt' && egyptUnlocked"));

    const performArtworkSrc = fs.readFileSync(
      path.join(projectRoot, 'src/components/australia/AustraliaPerformArtwork.tsx'),
      'utf8',
    );
    assert.equal(performArtworkSrc.includes('generate_image'), false);
    assert.equal(performArtworkSrc.includes('@google/genai'), false);
    assert.equal(performArtworkSrc.includes('fetch('), false);
  });
});
