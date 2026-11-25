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
  AUSTRALIA_BUILD_MISSION_ORDER,
  DARLING_HARBOUR_BUILD_BOARD,
  HARBOUR_CAFE_BUILD_MENU,
} from '../src/data/australiaBuild';
import {
  AUSTRALIA_OLIVIA_PRACTICE_WELCOME,
  AUSTRALIA_PRACTICE_ACTIVITY_ID,
  AUSTRALIA_PRACTICE_MISSION_ORDER,
  AUSTRALIA_PRACTICE_MISSIONS,
  AUSTRALIA_PRACTICE_REFLECTION_ITEMS,
  AUSTRALIA_PRACTICE_XP_REWARD,
  buildAustraliaPracticeFeedback,
  getAustraliaPracticeMissionSpec,
  isValidAustraliaPracticeMode,
  isValidAustraliaSpeakingEvidenceRecord,
  sanitizeAustraliaSpeakingEvidenceRecord,
  validateAustraliaPracticeBanks,
} from '../src/data/australiaPractice';
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
  PROGRESS_STORAGE_KEY,
  canReplayCountry,
  collectJaipurVocabObject,
  completeAustraliaBuildMission,
  completeAustraliaDiscoveryMission,
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
  getAustraliaBuiltDialogues,
  getAustraliaCompletedPracticeIds,
  getAustraliaNextPracticeLandmarkId,
  getAustraliaPracticeEvidenceMap,
  getAustraliaPracticeMissionStatus,
  isAustraliaBuildCompleted,
  isAustraliaDiscoverCompleted,
  isAustraliaPerformUnlocked,
  isAustraliaPracticeCompleted,
  isAustraliaPracticeStarted,
  isAustraliaPracticeUnlocked,
  isAustraliaUnlocked,
  markJaipurAaravMet,
  markScotlandNpcMet,
  migrateAndValidateProgress,
  SCOTLAND_PASSPORT_STAMP_ID,
  startAustraliaBuildMission,
  startAustraliaDiscoveryMission,
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
import {
  isMicrophoneRecordingSupported,
  mapRecorderError,
  startTransientMicRecording,
  stopMediaStreamTracks,
} from '../src/utils/audioRecorder';
import {
  computeWalkablePath,
  resolveNextMissionTarget,
  resolveQuickTravelDestination,
} from '../src/utils/worldNavigation';
import type {
  AustraliaPracticeMode,
  AustraliaSpeakingEvidenceRecord,
  LocalProgressV1,
  ScotlandSpeakingReflectionState,
} from '../src/types/game';

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
  for (const lmId of AUSTRALIA_DISCOVER_MISSION_ORDER) {
    state = completeAustraliaDiscoveryMission(state, lmId);
  }
  return state;
}

function buildAustraliaBuildCompleteProgress(): LocalProgressV1 {
  let state = buildAustraliaDiscoverCompleteProgress();
  state = startAustraliaBuildMission(state);
  for (const lmId of AUSTRALIA_BUILD_MISSION_ORDER) {
    state = completeAustraliaBuildMission(
      state,
      lmId,
      `Crafted Sydney dialogue for ${lmId}.`,
    );
  }
  return state;
}

function makeEvidenceForMission(
  landmarkId: (typeof AUSTRALIA_PRACTICE_MISSION_ORDER)[number],
  mode: AustraliaPracticeMode = 'microphone_recording',
  difficulty: 'a2' | 'b1' = 'a2',
): AustraliaSpeakingEvidenceRecord {
  const spec = getAustraliaPracticeMissionSpec(landmarkId)!;
  return {
    practiceMode: mode,
    completedTurnIds: spec.turns.map((t) => t.turnId),
    reflectionChecks: {
      askedClearQuestion: true,
      respondedToNpc: true,
      usedPoliteExpression: true,
      checkedOrClarifiedMeaning: landmarkId === 'harbour_gardens_help_point',
    },
    difficultyUsed: difficulty,
    completedAt: '2026-11-23T10:00:00.000Z',
  };
}

describe('Australia Phase 4D — Stage 3 PRACTICE: Sydney Interactive Speaking Missions', () => {
  it('verifies canonical IDs, Olivia welcome, 5 unique speaking missions, NPC & landmark associations, and bank integrity', () => {
    assert.equal(PROGRESS_STORAGE_KEY, 'voxvoyage.localProgress.v1');
    assert.equal(AUSTRALIA_MISSION_ID, 'mission_australia_sydney');
    assert.equal(AUSTRALIA_PRACTICE_ACTIVITY_ID, AUSTRALIA_STAGE_ACTIVITY_IDS.practice);
    assert.equal(AUSTRALIA_PRACTICE_ACTIVITY_ID, 'australia_dialogue_practice');
    assert.equal(AUSTRALIA_PRACTICE_XP_REWARD, 50);

    const validation = validateAustraliaPracticeBanks();
    assert.equal(validation.valid, true, validation.errors.join('; '));

    assert.equal(AUSTRALIA_PRACTICE_MISSIONS.length, 5);
    assert.deepEqual(
      AUSTRALIA_PRACTICE_MISSIONS.map((m) => m.id),
      [
        'circular_quay_plaza',
        'city_transit_station',
        'harbour_market_cafe',
        'darling_harbour_hub',
        'harbour_gardens_help_point',
      ],
    );
    assert.deepEqual(
      AUSTRALIA_PRACTICE_MISSIONS.map((m) => m.npcId),
      ['npc_olivia', 'npc_noah', 'npc_mia', 'npc_jack', 'npc_olivia'],
    );
    assert.equal(AUSTRALIA_PRACTICE_MISSIONS[4].isHelpPointReuse, true);

    assert.ok(AUSTRALIA_OLIVIA_PRACTICE_WELCOME.en.includes('use your voice'));
    assert.ok(AUSTRALIA_OLIVIA_PRACTICE_WELCOME.th.length > 20);

    // Menu & board game-specific references preserved
    assert.equal(AUSTRALIA_PRACTICE_MISSIONS[2].usesCafeMenu, true);
    assert.ok(HARBOUR_CAFE_BUILD_MENU.length >= 4);
    assert.equal(AUSTRALIA_PRACTICE_MISSIONS[3].usesVisitorBoard, true);
    assert.ok(DARLING_HARBOUR_BUILD_BOARD.length >= 3);
    assert.ok(AUSTRALIA_PRACTICE_MISSIONS[1].fictionalRouteSummary?.en.includes('Sandstone Fountain'));
  });

  it('locks PRACTICE before BUILD completion and unlocks sequentially after legitimate BUILD completion', () => {
    const discoverDoneOnly = buildAustraliaDiscoverCompleteProgress();
    assert.equal(isAustraliaDiscoverCompleted(discoverDoneOnly), true);
    assert.equal(isAustraliaBuildCompleted(discoverDoneOnly), false);
    assert.equal(isAustraliaPracticeUnlocked(discoverDoneOnly), false);
    assert.equal(discoverDoneOnly.rewards.xp, 800);

    const blockedStart = startAustraliaPracticeMission(discoverDoneOnly);
    assert.equal(isAustraliaPracticeStarted(blockedStart), false);
    assert.equal(
      getAustraliaPracticeMissionStatus(discoverDoneOnly, 'circular_quay_plaza').reason,
      'build_incomplete',
    );

    const buildDone = buildAustraliaBuildCompleteProgress();
    assert.equal(isAustraliaBuildCompleted(buildDone), true);
    assert.equal(isAustraliaPracticeUnlocked(buildDone), true);
    assert.equal(isAustraliaPracticeStarted(buildDone), false);
    assert.equal(buildDone.rewards.xp, 850);
    assert.equal(buildDone.rewards.stamps.length, 3);
    assert.equal(
      getAustraliaPracticeMissionStatus(buildDone, 'circular_quay_plaza').reason,
      'need_olivia_start',
    );
  });

  it('enforces sequential mission gating (1 -> 2 -> 3 -> 4 -> 5), multi-turn completion, and optional BUILD dialogue reuse', () => {
    let state = buildAustraliaBuildCompleteProgress();
    assert.ok(getAustraliaBuiltDialogues(state).circular_quay_plaza);

    state = startAustraliaPracticeMission(state);
    assert.equal(isAustraliaPracticeStarted(state), true);
    assert.equal(getAustraliaNextPracticeLandmarkId(state), 'circular_quay_plaza');
    assert.equal(
      getAustraliaPracticeMissionStatus(state, 'circular_quay_plaza').reason,
      'eligible',
    );
    assert.equal(
      getAustraliaPracticeMissionStatus(state, 'city_transit_station').reason,
      'prerequisite_incomplete',
    );

    // Out-of-order jump must be rejected
    const outOfOrder = completeAustraliaPracticeMission(
      state,
      'city_transit_station',
      makeEvidenceForMission('city_transit_station'),
    );
    assert.equal(getAustraliaCompletedPracticeIds(outOfOrder).length, 0);

    // Partial turn completion must be rejected
    const m1Spec = getAustraliaPracticeMissionSpec('circular_quay_plaza')!;
    const partialTurnRecord: AustraliaSpeakingEvidenceRecord = {
      practiceMode: 'no_mic_rehearsal',
      completedTurnIds: [m1Spec.turns[0].turnId],
      reflectionChecks: {
        askedClearQuestion: true,
        respondedToNpc: false,
        usedPoliteExpression: false,
        checkedOrClarifiedMeaning: false,
      },
      difficultyUsed: 'a2',
      completedAt: '2026-11-23T10:00:00.000Z',
    };
    const rejectedPartial = completeAustraliaPracticeMission(
      state,
      'circular_quay_plaza',
      partialTurnRecord,
    );
    assert.equal(getAustraliaCompletedPracticeIds(rejectedPartial).length, 0);

    // Complete 1..4: each grants +0 XP individually
    for (let i = 0; i < 4; i += 1) {
      const id = AUSTRALIA_PRACTICE_MISSION_ORDER[i];
      const mode: AustraliaPracticeMode =
        i % 2 === 0 ? 'microphone_recording' : 'no_mic_rehearsal';
      const diff = i === 1 ? 'b1' : 'a2';
      state = completeAustraliaPracticeMission(state, id, makeEvidenceForMission(id, mode, diff));
      assert.equal(state.rewards.xp, 850, `Mission ${id} should award 0 XP individually`);
      assert.equal(isAustraliaPracticeCompleted(state), false);
      assert.equal(isAustraliaPerformUnlocked(state), false);
    }

    assert.equal(getAustraliaNextPracticeLandmarkId(state), 'harbour_gardens_help_point');

    // Complete Mission 5: +50 XP ONCE -> 900 XP total, unlocks PERFORM (Coming Soon), NO Australia Stamp
    state = completeAustraliaPracticeMission(
      state,
      'harbour_gardens_help_point',
      makeEvidenceForMission('harbour_gardens_help_point', 'microphone_recording', 'b1'),
    );

    assert.equal(isAustraliaPracticeCompleted(state), true);
    assert.equal(isAustraliaPerformUnlocked(state), true);
    assert.equal(state.rewards.xp, 900);
    assert.equal(
      state.missionProgress[AUSTRALIA_MISSION_ID]?.currentStage,
      'perform',
    );
    assert.ok(
      state.missionProgress[AUSTRALIA_MISSION_ID]?.completedActivityIds.includes(
        AUSTRALIA_PRACTICE_ACTIVITY_ID,
      ),
    );
    assert.equal(state.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID), false);
    assert.equal(state.rewards.stamps.length, 3);
    assert.equal(state.unlockedCountryIds.includes('egypt'), false);

    // Replay / re-completion of Mission 5 awards +0 duplicate XP
    const replayed = completeAustraliaPracticeMission(
      state,
      'harbour_gardens_help_point',
      makeEvidenceForMission('harbour_gardens_help_point', 'no_mic_rehearsal', 'a2'),
    );
    assert.equal(replayed.rewards.xp, 900);
  });

  it('keeps Microphone Recording Mode and No-Mic Rehearsal Mode evidence distinct and rejects fabricated transcripts/scores/audio blobs', () => {
    assert.equal(isValidAustraliaPracticeMode('microphone_recording'), true);
    assert.equal(isValidAustraliaPracticeMode('no_mic_rehearsal'), true);
    assert.equal(isValidAustraliaPracticeMode('ai_graded'), false);

    const m1Spec = getAustraliaPracticeMissionSpec('circular_quay_plaza')!;
    const reqTurns = m1Spec.turns.map((t) => t.turnId);

    const micRecord = makeEvidenceForMission('circular_quay_plaza', 'microphone_recording', 'a2');
    const noMicRecord = makeEvidenceForMission('circular_quay_plaza', 'no_mic_rehearsal', 'b1');
    assert.equal(isValidAustraliaSpeakingEvidenceRecord(micRecord, reqTurns), true);
    assert.equal(isValidAustraliaSpeakingEvidenceRecord(noMicRecord, reqTurns), true);

    // Reject fabricated transcript, pronunciationScore, fluencyScore, or audio blobs
    const withFakeTranscript = { ...micRecord, transcript: 'Hello Olivia' };
    const withFakeScore = { ...micRecord, pronunciationScore: 94 };
    const withFakeFluency = { ...micRecord, fluencyScore: 88 };
    const withRawBlob = { ...micRecord, audioBase64: 'data:audio/webm;base64,AAA' };

    assert.equal(isValidAustraliaSpeakingEvidenceRecord(withFakeTranscript, reqTurns), false);
    assert.equal(isValidAustraliaSpeakingEvidenceRecord(withFakeScore, reqTurns), false);
    assert.equal(isValidAustraliaSpeakingEvidenceRecord(withFakeFluency, reqTurns), false);
    assert.equal(isValidAustraliaSpeakingEvidenceRecord(withRawBlob, reqTurns), false);

    // Sanitizer strips unsupported extra fields when migrating raw storage objects
    const cleaned = sanitizeAustraliaSpeakingEvidenceRecord(
      { ...micRecord, transcript: 'fake', pronunciationScore: 99, audioBlob: {} },
      reqTurns,
    );
    assert.ok(cleaned);
    assert.equal('transcript' in cleaned, false);
    assert.equal('pronunciationScore' in cleaned, false);
    assert.equal('audioBlob' in cleaned, false);

    const feedbackMic = buildAustraliaPracticeFeedback({
      landmarkId: 'circular_quay_plaza',
      practiceMode: 'microphone_recording',
      difficultyUsed: 'a2',
      turnCount: 2,
      allFinished: false,
    });
    const feedbackNoMic = buildAustraliaPracticeFeedback({
      landmarkId: 'circular_quay_plaza',
      practiceMode: 'no_mic_rehearsal',
      difficultyUsed: 'b1',
      turnCount: 2,
      allFinished: true,
    });
    assert.ok(feedbackMic.reviewTypeLabel.en.includes('Guided Self-Review'));
    assert.ok(feedbackMic.evidenceSummary.en.includes('no AI scoring'));
    assert.ok(feedbackNoMic.reviewTypeLabel.en.includes('No-Mic Rehearsal Mode'));
    assert.ok(feedbackNoMic.evidenceSummary.en.includes('no microphone audio claimed'));
    assert.ok(feedbackNoMic.nextStepNote.en.includes('Coming Soon'));
  });

  it('handles audio recorder capability detection, error mapping, stream track cleanup, and non-browser safety', async () => {
    assert.equal(isMicrophoneRecordingSupported(), false);
    assert.equal(mapRecorderError(new Error('denied')), 'unsupported');

    let stoppedCalls = 0;
    stopMediaStreamTracks({
      getTracks: () => [
        { stop: () => { stoppedCalls += 1; } },
        { stop: () => { stoppedCalls += 1; } },
      ],
    } as unknown as MediaStream);
    assert.equal(stoppedCalls, 2);

    let receivedError: string | null = null;
    const handle = await startTransientMicRecording({
      onRecordingStarted: () => {},
      onAudioReady: () => {},
      onError: (code) => {
        receivedError = code;
      },
    });
    assert.equal(handle, null);
    assert.equal(receivedError, 'unsupported');
  });

  it('validates A2/B1 differentiation and complete EN/TH localization including reflection items and i18n keys', () => {
    for (const mission of AUSTRALIA_PRACTICE_MISSIONS) {
      assert.ok(mission.title.en && mission.title.th);
      assert.ok(mission.goal.en && mission.goal.th);
      assert.ok(mission.closingNpcLine.en && mission.closingNpcLine.th);
      assert.ok(mission.completionFeedbackA2.en && mission.completionFeedbackA2.th);
      assert.ok(mission.completionFeedbackB1.en && mission.completionFeedbackB1.th);
      assert.ok(mission.turns.length >= 2);
      for (const turn of mission.turns) {
        assert.notEqual(turn.npcPromptA2.en, turn.npcPromptB1.en);
        assert.notEqual(turn.modelResponseA2.en, turn.modelResponseB1.en);
        assert.ok(turn.thaiTip.trim().length > 10);
      }
    }

    assert.equal(AUSTRALIA_PRACTICE_REFLECTION_ITEMS.length, 4);
    for (const item of AUSTRALIA_PRACTICE_REFLECTION_ITEMS) {
      assert.ok(item.labelA2.en && item.labelA2.th);
      assert.ok(item.labelB1.en && item.labelB1.th);
    }

    const practiceKeys = Object.keys(GAME_COPY.en).filter((k) =>
      k.startsWith('australiaPractice'),
    );
    assert.ok(practiceKeys.length >= 50);
    for (const key of practiceKeys) {
      const k = key as keyof typeof GAME_COPY.en;
      assert.ok(GAME_COPY.en[k].trim().length > 0, `Empty EN key: ${key}`);
      assert.ok(GAME_COPY.th[k].trim().length > 0, `Empty TH key: ${key}`);
    }
    assert.ok(GAME_COPY.en.navComingSoonAustraliaPerform.includes('Coming Soon'));
    assert.ok(GAME_COPY.th.navComingSoonAustraliaPerform.length > 10);
  });

  it('persists PRACTICE progress safely across refresh, blocks forged XP/PERFORM/Stamps, and preserves DISCOVER/BUILD without requiring BUILD dialogue strings', () => {
    let state = buildAustraliaBuildCompleteProgress();
    state = startAustraliaPracticeMission(state);
    for (const id of AUSTRALIA_PRACTICE_MISSION_ORDER) {
      state = completeAustraliaPracticeMission(state, id, makeEvidenceForMission(id, 'no_mic_rehearsal'));
    }

    // Refresh round-trip via JSON serialization + migrateAndValidateProgress
    const roundTripped = migrateAndValidateProgress(JSON.parse(JSON.stringify(state)));
    assert.equal(roundTripped.rewards.xp, 900);
    assert.equal(isAustraliaPracticeCompleted(roundTripped), true);
    assert.equal(isAustraliaPerformUnlocked(roundTripped), true);
    assert.equal(getAustraliaCompletedPracticeIds(roundTripped).length, 5);
    assert.equal(
      getAustraliaPracticeEvidenceMap(roundTripped).harbour_gardens_help_point?.practiceMode,
      'no_mic_rehearsal',
    );
    assert.equal(roundTripped.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID), false);
    assert.equal(roundTripped.unlockedCountryIds.includes('egypt'), false);

    // Legit progress record WITHOUT optional australiaBuiltDialogues still unlocks & completes PRACTICE
    const withoutBuiltDialogues = JSON.parse(JSON.stringify(state));
    delete withoutBuiltDialogues.missionProgress[AUSTRALIA_MISSION_ID].australiaBuiltDialogues;
    const migratedNoDialogues = migrateAndValidateProgress(withoutBuiltDialogues);
    assert.equal(isAustraliaBuildCompleted(migratedNoDialogues), true);
    assert.equal(isAustraliaPracticeCompleted(migratedNoDialogues), true);
    assert.equal(migratedNoDialogues.rewards.xp, 900);

    // Forged PERFORM completion, forged Stamp, forged XP (e.g. 950/1000) stripped back to 900
    const forged = JSON.parse(JSON.stringify(state));
    forged.rewards.xp = 1200;
    forged.rewards.stamps.push(AUSTRALIA_PASSPORT_STAMP_ID);
    forged.missionProgress[AUSTRALIA_MISSION_ID].status = 'completed';
    forged.missionProgress[AUSTRALIA_MISSION_ID].completedActivityIds.push(
      AUSTRALIA_STAGE_ACTIVITY_IDS.perform,
    );
    forged.unlockedCountryIds.push('egypt');

    const cleaned = migrateAndValidateProgress(forged);
    assert.equal(cleaned.rewards.xp, 900);
    assert.equal(cleaned.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID), false);
    assert.equal(cleaned.missionProgress[AUSTRALIA_MISSION_ID]?.status, 'in_progress');
    assert.equal(
      cleaned.missionProgress[AUSTRALIA_MISSION_ID]?.completedActivityIds.includes(
        AUSTRALIA_STAGE_ACTIVITY_IDS.perform,
      ),
      false,
    );
    assert.equal(cleaned.unlockedCountryIds.includes('egypt'), false);
  });

  it('preserves India/Kenya/Scotland regression, enables Australia Replay cleanly, and resolves Stage 4 PERFORM Smart Navigation paths', () => {
    let state = buildAustraliaBuildCompleteProgress();
    state = startAustraliaPracticeMission(state);
    for (const id of AUSTRALIA_PRACTICE_MISSION_ORDER) {
      state = completeAustraliaPracticeMission(state, id, makeEvidenceForMission(id));
    }

    // Prior country stamps & replay safety preserved
    assert.ok(state.rewards.stamps.includes(INDIA_PASSPORT_STAMP_ID));
    assert.ok(state.rewards.stamps.includes(KENYA_PASSPORT_STAMP_ID));
    assert.ok(state.rewards.stamps.includes(SCOTLAND_PASSPORT_STAMP_ID));
    assert.equal(COUNTRY_REPLAY_CAPABILITIES.australia.isImplemented, true);
    assert.equal(canReplayCountry(state, 'australia'), true);

    // Replay on India still preserves Australia 900 XP & completed PRACTICE state
    const afterIndiaReplay = startCountryReplay(state, 'india');
    assert.equal(afterIndiaReplay.rewards.xp, 900);
    assert.equal(isAustraliaPracticeCompleted(afterIndiaReplay), true);

    // Navigation & pathfinding still reach Olivia and all 5 Sydney landmarks cleanly
    for (const landmark of AUSTRALIA_LANDMARKS) {
      const path = computeWalkablePath('australia', { x: 0, z: 4 }, landmark.id);
      assert.equal(path.reachable, true, `Path to ${landmark.id} should be reachable`);
      const qt = resolveQuickTravelDestination('australia', landmark.id, { countryUnlocked: true });
      assert.equal(qt.allowed, true, `Quick Travel to ${landmark.id} should work`);
    }

    const nextStageNav = resolveNextMissionTarget({
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
        performStarted: false,
        completedPerformIds: [],
        performCompleted: false,
      },
    });
    assert.equal(nextStageNav.status, 'actionable');
    assert.equal(nextStageNav.stageLabel, 'PERFORM');
    assert.equal(nextStageNav.reasonKey, 'start_perform');
    assert.equal(nextStageNav.targetId, 'npc_olivia');
  });
});
