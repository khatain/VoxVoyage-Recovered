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
  EGYPT_BOUNDS,
  EGYPT_INTERACTIVE_TARGETS,
  EGYPT_LANDMARKS,
  EGYPT_MISSION_ID,
  EGYPT_NPC_DIALOGUES,
  EGYPT_NPC_TARGETS,
  EGYPT_PASSPORT_STAMP_ID,
  EGYPT_RECOMMENDED_ROUTE,
  EGYPT_SPAWN,
} from '../src/data/egyptWorld';
import {
  findNearestEgyptPoi,
  resolveEgyptCollision,
} from '../src/utils/egyptCollision';
import {
  COUNTRY_REPLAY_CAPABILITIES,
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
  getEgyptEffectiveEntry,
  getEgyptMetNpcIds,
  getEgyptVisitedLandmarkIds,
  isEgyptUnlocked,
  markEgyptEntered,
  markEgyptNpcMet,
  markEgyptPoiExplored,
  markScotlandNpcMet,
  migrateAndValidateProgress,
  startAustraliaBuildMission,
  startAustraliaDiscoveryMission,
  startAustraliaPerformMission,
  startAustraliaPracticeMission,
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
import { INDIA_PASSPORT_STAMP_ID } from '../src/data/jaipurShowcase';
import { KENYA_PASSPORT_STAMP_ID } from '../src/data/kenyaPerform';
import { SCOTLAND_PASSPORT_STAMP_ID } from '../src/data/scotlandWorld';
import { AUSTRALIA_PASSPORT_STAMP_ID } from '../src/data/australiaWorld';
import { GAME_COPY } from '../src/data/i18n';
import {
  computeWalkablePath,
  isWalkablePoint,
  resolveQuickTravelDestination,
} from '../src/utils/worldNavigation';
import { voxAudio } from '../src/utils/audioEngine';

function buildFullPreEgyptVerifiedProgress() {
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

describe('Phase 5A: Egypt — Echoes of Egypt (3D World Foundation & Exploration)', () => {
  it('enforces strict gating: Egypt stays locked before Australia completion & Sydney stamp, and unlocks cleanly after', () => {
    const fresh = createDefaultProgress();
    assert.equal(isEgyptUnlocked(fresh), false);

    // Tampered XP alone without completing Australia cannot unlock Egypt
    const spoofedXp = {
      ...fresh,
      rewards: { ...fresh.rewards, xp: 1500 },
    };
    assert.equal(isEgyptUnlocked(spoofedXp), false);

    // Completing India..Australia legitimately yields 1,000 XP, 4 Stamps, and unlocks Egypt
    const verified = buildFullPreEgyptVerifiedProgress();
    assert.equal(verified.rewards.xp, 1000);
    assert.equal(verified.rewards.stamps.length, 4);
    assert.equal(isEgyptUnlocked(verified), true);
  });

  it('defines 5 walkable zones, 4 NPCs, sealed Chamber of Wisdom, and blocks Nile water & sealed door collision', () => {
    assert.equal(EGYPT_LANDMARKS.length, 5);
    assert.equal(EGYPT_NPC_TARGETS.length, 4);
    assert.equal(EGYPT_INTERACTIVE_TARGETS.length, 9);
    assert.deepEqual(
      EGYPT_RECOMMENDED_ROUTE,
      EGYPT_LANDMARKS.map((l) => l.id),
    );

    const chamber = EGYPT_LANDMARKS.find((l) => l.id === 'chamber_of_wisdom');
    assert.ok(chamber);
    assert.equal(chamber.isSealedInPhase5A, true);

    // Spawn & all 4 NPCs have valid bilingual dialogues
    assert.equal(isWalkablePoint('egypt', EGYPT_SPAWN.x, EGYPT_SPAWN.z), true);
    for (const npc of EGYPT_NPC_TARGETS) {
      const entry = EGYPT_NPC_DIALOGUES[npc.id as keyof typeof EGYPT_NPC_DIALOGUES];
      assert.ok(entry);
      assert.ok(entry.greetingQuote.en.length > 20);
      assert.ok(entry.greetingQuote.th.length > 10);
      assert.ok(entry.followUpTip.en.length > 20);
      assert.ok(entry.followUpTip.th.length > 10);
    }

    // Nile water south barrier (z > 15.2) pushes player back to safe waterfront
    const pushedFromNile = resolveEgyptCollision(0, 17.5);
    assert.ok(pushedFromNile.z <= 15.2 - EGYPT_BOUNDS.playerRadius + 0.001);

    // Sealed Chamber of Wisdom facade (-5.2..5.2, -18.5..-12.6) blocks entry inside door
    const pushedFromChamber = resolveEgyptCollision(0, -14.0);
    assert.ok(pushedFromChamber.z >= -12.6 + EGYPT_BOUNDS.playerRadius - 0.001);

    // Nearest POI lookup resolves near Chamber of Wisdom entrance courtyard without entering door
    const nearChamber = findNearestEgyptPoi(0, -10.5);
    assert.equal(nearChamber?.id, 'chamber_of_wisdom');
  });

  it('supports collision-free A* Auto-Walk and Quick Travel across all 9 Egypt destinations', () => {
    for (const target of EGYPT_INTERACTIVE_TARGETS) {
      const pathRes = computeWalkablePath(
        'egypt',
        { x: EGYPT_SPAWN.x, z: EGYPT_SPAWN.z },
        target.id,
      );
      assert.equal(
        pathRes.reachable,
        true,
        `Expected Egypt A* path to reach ${target.id}`,
      );
      assert.ok(pathRes.arrivalPoint);
      assert.equal(
        isWalkablePoint('egypt', pathRes.arrivalPoint.x, pathRes.arrivalPoint.z),
        true,
      );

      const qt = resolveQuickTravelDestination('egypt', target.id, {
        countryUnlocked: true,
      });
      assert.equal(qt.allowed, true);
      assert.ok(qt.arrivalPoint);
      assert.equal(
        isWalkablePoint('egypt', qt.arrivalPoint.x, qt.arrivalPoint.z),
        true,
      );

      const lockedQt = resolveQuickTravelDestination('egypt', target.id, {
        countryUnlocked: false,
      });
      assert.equal(lockedQt.allowed, false);
      assert.equal(lockedQt.reason, 'locked');
    }
  });

  it('persists Phase 5A exploration (entered, 4 NPCs, 5 sites) with strictly +0 XP / +0 Stamps and strips forged completions', () => {
    const baseline = buildFullPreEgyptVerifiedProgress();
    const initialXp = baseline.rewards.xp;
    const initialCoins = baseline.rewards.coins;
    const initialGems = baseline.rewards.gems;
    const initialStamps = baseline.rewards.stamps.length;

    let explored = markEgyptEntered(baseline);
    for (const npc of EGYPT_NPC_TARGETS) {
      explored = markEgyptNpcMet(
        explored,
        npc.id as 'npc_layla' | 'npc_omar' | 'npc_mariam' | 'npc_karim',
      );
    }
    for (const lm of EGYPT_LANDMARKS) {
      explored = markEgyptPoiExplored(explored, lm.id);
    }

    // Zero Phase 5A rewards
    assert.equal(explored.rewards.xp, initialXp);
    assert.equal(explored.rewards.coins, initialCoins);
    assert.equal(explored.rewards.gems, initialGems);
    assert.equal(explored.rewards.stamps.length, initialStamps);

    // Round-trip save / reload validation preserves exploration
    const reloaded = migrateAndValidateProgress(JSON.parse(JSON.stringify(explored)));
    assert.equal(getEgyptEffectiveEntry(reloaded).egyptEntered, true);
    assert.equal(getEgyptMetNpcIds(reloaded).length, 4);
    assert.equal(getEgyptVisitedLandmarkIds(reloaded).length, 5);
    assert.deepEqual(getEgyptEffectiveEntry(reloaded).completedActivityIds, []);
    assert.equal(getEgyptEffectiveEntry(reloaded).currentStage, 'discover');
    assert.equal(reloaded.rewards.xp, 1000);
    assert.equal(reloaded.rewards.stamps.length, 4);

    // Spoofed Egypt stage completion or string stamp in localStorage is stripped cleanly
    const tampered = JSON.parse(JSON.stringify(explored));
    tampered.missionProgress[EGYPT_MISSION_ID].completedActivityIds = ['egypt_secrets_discovery'];
    tampered.missionProgress[EGYPT_MISSION_ID].status = 'completed';
    tampered.rewards.stamps.push(EGYPT_PASSPORT_STAMP_ID);

    const sanitized = migrateAndValidateProgress(tampered);
    assert.deepEqual(sanitized.missionProgress[EGYPT_MISSION_ID]?.completedActivityIds, []);
    assert.equal(sanitized.missionProgress[EGYPT_MISSION_ID]?.status, 'in_progress');
    assert.equal(sanitized.rewards.xp, 1000);
    assert.equal(sanitized.rewards.stamps.includes(EGYPT_PASSPORT_STAMP_ID), false);
    assert.equal(sanitized.rewards.stamps.includes(INDIA_PASSPORT_STAMP_ID), true);
    assert.equal(sanitized.rewards.stamps.includes(KENYA_PASSPORT_STAMP_ID), true);
    assert.equal(sanitized.rewards.stamps.includes(SCOTLAND_PASSPORT_STAMP_ID), true);
    assert.equal(sanitized.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID), true);
    assert.equal(sanitized.rewards.stamps.length, 4);

    // Malformed object-shaped stamp payload from untrusted storage is also stripped safely
    const malformedPayload: unknown = {
      ...JSON.parse(JSON.stringify(explored)),
      rewards: {
        ...explored.rewards,
        stamps: [
          ...explored.rewards.stamps,
          {
            id: EGYPT_PASSPORT_STAMP_ID,
            countryId: 'egypt',
            title: { en: 'Forged', th: 'ปลอม' },
            earnedAt: '2026-01-01T00:00:00.000Z',
          },
        ],
      },
    };
    const sanitizedMalformed = migrateAndValidateProgress(malformedPayload);
    assert.equal(sanitizedMalformed.rewards.xp, 1000);
    assert.equal(sanitizedMalformed.rewards.stamps.length, 4);
    assert.equal(sanitizedMalformed.rewards.stamps.includes(EGYPT_PASSPORT_STAMP_ID), false);

    // Locked player cannot carry Egypt exploration progress
    const lockedSpoof = JSON.parse(JSON.stringify(createDefaultProgress()));
    lockedSpoof.missionProgress[EGYPT_MISSION_ID] = {
      missionId: EGYPT_MISSION_ID,
      countryId: 'egypt',
      status: 'in_progress',
      currentStage: 'discover',
      completedActivityIds: [],
      egyptEntered: true,
      egyptExploredPoiIds: ['nile_expedition_camp'],
      egyptMetNpcIds: ['npc_layla'],
    };
    const cleanedLocked = migrateAndValidateProgress(lockedSpoof);
    assert.equal(cleanedLocked.missionProgress[EGYPT_MISSION_ID]?.status, 'not_started');
    assert.equal(cleanedLocked.missionProgress[EGYPT_MISSION_ID]?.egyptEntered, undefined);
    assert.equal(getEgyptVisitedLandmarkIds(cleanedLocked).length, 0);
    assert.equal(getEgyptMetNpcIds(cleanedLocked).length, 0);
  });

  it('keeps Egypt Country Replay disabled and guarantees bilingual EN/TH copy & clean self-contained assets', () => {
    assert.equal(COUNTRY_REPLAY_CAPABILITIES.egypt.isImplemented, false);

    // Verify all Egypt i18n keys exist cleanly in EN & TH and nav* count remains strictly 26
    const enNavKeys = Object.keys(GAME_COPY.en).filter((k) => k.startsWith('nav'));
    const thNavKeys = Object.keys(GAME_COPY.th).filter((k) => k.startsWith('nav'));
    assert.equal(enNavKeys.length, 26);
    assert.equal(thNavKeys.length, 26);

    const egyptKeys = Object.keys(GAME_COPY.en).filter(
      (k) =>
        k.startsWith('egypt') ||
        k.startsWith('worldMapEgypt') ||
        k.startsWith('arrivingEgypt'),
    );
    assert.ok(egyptKeys.length >= 50);
    for (const k of egyptKeys) {
      const key = k as keyof typeof GAME_COPY.en;
      assert.ok(String(GAME_COPY.en[key]).trim().length > 0, `Empty EN key: ${k}`);
      assert.ok(String(GAME_COPY.th[key]).trim().length > 0, `Empty TH key: ${k}`);
    }

    // Asset & CSS / zero-external-API audit across Egypt files
    const projectRoot = process.cwd();
    assert.equal(
      fs.existsSync(
        path.join(projectRoot, 'src/assets/images/egypt_day_expedition_1795070978060.jpg'),
      ),
      true,
    );

    const egyptFiles = [
      'src/data/egyptWorld.ts',
      'src/utils/egyptCollision.ts',
      'src/components/egypt/egyptProceduralModels.ts',
      'src/components/egypt/EgyptExplorationScene.tsx',
      'src/components/egypt/EgyptSvgArtwork.tsx',
      'src/components/egypt/EgyptFallback2D.tsx',
      'src/components/egypt/EgyptExpeditionGuideModal.tsx',
      'src/components/screens/EgyptWorldScreen.tsx',
    ];
    for (const rel of egyptFiles) {
      const content = fs.readFileSync(path.join(projectRoot, rel), 'utf8');
      assert.equal(content.includes('animate-pulse'), false, `animate-pulse found in ${rel}`);
      assert.equal(content.includes('border-l-4'), false, `border-l-4 found in ${rel}`);
      assert.equal(content.includes('backdrop-blur'), false, `backdrop-blur found in ${rel}`);
      assert.equal(content.includes('generate_image'), false, `generate_image found in ${rel}`);
      assert.equal(content.includes('@google/genai'), false, `@google/genai found in ${rel}`);
      assert.equal(content.includes('fetch('), false, `fetch( found in ${rel}`);
    }
  });

  it('manages Egypt audio lifecycle cleanly across profile switches, Day/Night toggles, ducking, and teardown without duplicate timers', () => {
    const prevWindow = (globalThis as { window?: unknown }).window;
    let activeIntervals = 0;
    let nextTimerId = 100;
    let activeBufferSources = 0;
    let activeOscillators = 0;
    let closedCount = 0;
    const setIntervalsMs: number[] = [];

    class FakeAudioParam {
      value = 0;
      lastTarget: number | null = null;
      setValueAtTime(v: number) {
        this.value = v;
      }
      setTargetAtTime(v: number) {
        this.lastTarget = v;
        this.value = v;
      }
      linearRampToValueAtTime(v: number) {
        this.value = v;
      }
      exponentialRampToValueAtTime(v: number) {
        this.value = v;
      }
      cancelScheduledValues() {}
    }

    class FakeGainNode {
      gain = new FakeAudioParam();
      connect() {}
      disconnect() {}
    }

    class FakeFilterNode {
      type = 'lowpass';
      frequency = new FakeAudioParam();
      connect() {}
      disconnect() {}
    }

    class FakeOscillatorNode {
      type = 'sine';
      frequency = new FakeAudioParam();
      started = false;
      stopped = false;
      connect() {}
      disconnect() {}
      start() {
        if (!this.started) {
          this.started = true;
          activeOscillators += 1;
        }
      }
      stop() {
        if (this.started && !this.stopped) {
          this.stopped = true;
          activeOscillators -= 1;
        }
      }
    }

    class FakeBufferSourceNode {
      buffer: unknown = null;
      loop = false;
      started = false;
      stopped = false;
      connect() {}
      disconnect() {}
      start() {
        if (!this.started) {
          this.started = true;
          activeBufferSources += 1;
        }
      }
      stop() {
        if (this.started && !this.stopped) {
          this.stopped = true;
          activeBufferSources -= 1;
        }
      }
    }

    class FakeAudioContext {
      sampleRate = 44100;
      currentTime = 1.0;
      state = 'running';
      destination = {};
      resume() {
        return Promise.resolve();
      }
      createGain() {
        return new FakeGainNode();
      }
      createBiquadFilter() {
        return new FakeFilterNode();
      }
      createOscillator() {
        return new FakeOscillatorNode();
      }
      createBuffer(_channels: number, length: number) {
        const arr = new Float32Array(length);
        return { getChannelData: () => arr };
      }
      createBufferSource() {
        return new FakeBufferSourceNode();
      }
      close() {
        closedCount += 1;
        return Promise.resolve();
      }
    }

    (globalThis as { window: unknown }).window = {
      AudioContext: FakeAudioContext,
      setInterval: (_cb: () => void, ms: number) => {
        activeIntervals += 1;
        setIntervalsMs.push(ms);
        return nextTimerId++;
      },
      clearInterval: () => {
        activeIntervals = Math.max(0, activeIntervals - 1);
      },
    };

    try {
      voxAudio.dispose();
      voxAudio.setEnvironmentProfile('egypt');
      const started = voxAudio.startMusic('day', false);
      assert.equal(started, true);
      assert.equal(activeIntervals, 1);
      assert.equal(activeBufferSources, 1);

      let snap = voxAudio.getStateSnapshot();
      assert.equal(snap.worldProfile, 'egypt');
      assert.equal(snap.isMusicPlaying, true);
      assert.equal(snap.stepIntervalMs, 620);
      assert.equal(snap.targetAmbienceFilterFreq, 500);
      assert.equal(snap.targetAmbienceGain, 0.054);
      assert.equal(snap.hasScotlandDrone, false);

      // Day -> Night preserves Egypt ambience tuning instead of reverting to default
      voxAudio.updateAtmosphere('night', false);
      snap = voxAudio.getStateSnapshot();
      assert.equal(activeIntervals, 1);
      assert.equal(snap.worldProfile, 'egypt');
      assert.equal(snap.currentTheme, 'night');
      assert.equal(snap.targetAmbienceFilterFreq, 290);
      assert.equal(snap.targetAmbienceGain, 0.042);
      assert.equal(snap.stepIntervalMs, 1100);

      // Dialogue ducking lowers and restores without stopping music
      voxAudio.setDialogueDucking(true);
      assert.equal(voxAudio.getStateSnapshot().isDialogueDucked, true);
      voxAudio.setDialogueDucking(false);
      assert.equal(voxAudio.getStateSnapshot().isDialogueDucked, false);

      // Transition back to day and switch profile while playing -> no duplicate timers, cadence updates
      voxAudio.updateAtmosphere('day', false);
      voxAudio.setEnvironmentProfile('default');
      snap = voxAudio.getStateSnapshot();
      assert.equal(activeIntervals, 1);
      assert.equal(snap.worldProfile, 'default');
      assert.equal(snap.stepIntervalMs, 720);

      // Switching back into Egypt updates cadence cleanly to 620ms
      voxAudio.setEnvironmentProfile('egypt');
      snap = voxAudio.getStateSnapshot();
      assert.equal(activeIntervals, 1);
      assert.equal(snap.stepIntervalMs, 620);
      assert.ok(setIntervalsMs.includes(620));

      // Egypt <-> Australia <-> Scotland transitions keep 1 timer and clean drone teardown
      voxAudio.setEnvironmentProfile('australia');
      snap = voxAudio.getStateSnapshot();
      assert.equal(activeIntervals, 1);
      assert.equal(snap.stepIntervalMs, 540);
      assert.equal(snap.targetAmbienceFilterFreq, 580);
      assert.equal(snap.hasScotlandDrone, false);

      voxAudio.setEnvironmentProfile('scotland');
      snap = voxAudio.getStateSnapshot();
      assert.equal(activeIntervals, 1);
      assert.equal(snap.hasScotlandDrone, true);

      voxAudio.setEnvironmentProfile('egypt');
      snap = voxAudio.getStateSnapshot();
      assert.equal(activeIntervals, 1);
      assert.equal(snap.hasScotlandDrone, false);
      assert.equal(snap.stepIntervalMs, 620);
      assert.equal(snap.targetAmbienceFilterFreq, 500);

      // Reduced motion cadence in Egypt Day (880ms) & Night (1350ms)
      voxAudio.updateAtmosphere('day', true);
      snap = voxAudio.getStateSnapshot();
      assert.equal(snap.stepIntervalMs, 880);
      voxAudio.updateAtmosphere('night', true);
      snap = voxAudio.getStateSnapshot();
      assert.equal(snap.stepIntervalMs, 1350);

      // Mute -> Unmute cycle clears and restores without duplicating buffer sources
      voxAudio.stopMusic();
      assert.equal(activeIntervals, 0);
      assert.equal(activeBufferSources, 0);
      assert.equal(voxAudio.getStateSnapshot().isMusicPlaying, false);

      assert.equal(voxAudio.startMusic('day', false), true);
      assert.equal(activeIntervals, 1);
      assert.equal(activeBufferSources, 1);
      assert.equal(voxAudio.getStateSnapshot().stepIntervalMs, 620);

      // Clean stop & dispose
      voxAudio.stopMusic();
      assert.equal(activeIntervals, 0);
      assert.equal(activeBufferSources, 0);
      assert.equal(voxAudio.getStateSnapshot().isMusicPlaying, false);

      voxAudio.dispose();
      assert.equal(closedCount, 1);
      assert.equal(activeOscillators >= 0, true);
    } finally {
      if (prevWindow === undefined) {
        delete (globalThis as { window?: unknown }).window;
      } else {
        (globalThis as { window: unknown }).window = prevWindow;
      }
    }
  });

  it('handles blocked browser AudioContext cleanly and preserves saved audioPrefs without forcing unmute', async () => {
    // Saved audio preferences round-trip without silently overriding muted/unmuted states
    const muted = buildFullPreEgyptVerifiedProgress();
    assert.equal(muted.audioPrefs.musicEnabled, false);
    assert.equal(migrateAndValidateProgress(JSON.parse(JSON.stringify(muted))).audioPrefs.musicEnabled, false);

    const unmuted = {
      ...muted,
      audioPrefs: { musicEnabled: true, sfxEnabled: true },
    };
    const restoredUnmuted = migrateAndValidateProgress(JSON.parse(JSON.stringify(unmuted)));
    assert.equal(restoredUnmuted.audioPrefs.musicEnabled, true);
    assert.equal(restoredUnmuted.audioPrefs.sfxEnabled, true);

    const prevWindow = (globalThis as { window?: unknown }).window;

    // 1. Blocked AudioContext constructor throws -> startMusic returns false safely
    (globalThis as { window: unknown }).window = {
      AudioContext: class ThrowingAudioContext {
        constructor() {
          throw new Error('Autoplay policy blocked AudioContext');
        }
      },
      setInterval: () => 1,
      clearInterval: () => {},
    };

    try {
      voxAudio.dispose();
      voxAudio.setEnvironmentProfile('egypt');
      const started = voxAudio.startMusic('day', false);
      assert.equal(started, false);
      assert.equal(voxAudio.getStateSnapshot().isMusicPlaying, false);
      assert.equal(voxAudio.getStateSnapshot().contextState, 'uninitialized');
      // SFX also does not throw when blocked
      voxAudio.playSfx('click', true, 'day');

      // 2. Suspended AudioContext whose resume() rejects -> cleanly stops playback without unhandled rejection
      let cleared = 0;
      class SuspendedRejectingContext {
        sampleRate = 44100;
        currentTime = 0;
        state = 'suspended';
        destination = {};
        resume() {
          return Promise.reject(new Error('NotAllowedError'));
        }
        createGain() {
          return {
            gain: {
              value: 0,
              setValueAtTime() {},
              setTargetAtTime() {},
              linearRampToValueAtTime() {},
              exponentialRampToValueAtTime() {},
              cancelScheduledValues() {},
            },
            connect() {},
            disconnect() {},
          };
        }
        createBiquadFilter() {
          return {
            type: 'lowpass',
            frequency: { value: 0, setTargetAtTime() {} },
            connect() {},
            disconnect() {},
          };
        }
        createOscillator() {
          return {
            type: 'sine',
            frequency: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} },
            connect() {},
            disconnect() {},
            start() {},
            stop() {},
          };
        }
        createBuffer(_c: number, length: number) {
          const arr = new Float32Array(length);
          return { getChannelData: () => arr };
        }
        createBufferSource() {
          return { buffer: null, loop: false, connect() {}, disconnect() {}, start() {}, stop() {} };
        }
        close() {
          return Promise.resolve();
        }
      }

      (globalThis as { window: unknown }).window = {
        AudioContext: SuspendedRejectingContext,
        setInterval: () => 99,
        clearInterval: () => {
          cleared += 1;
        },
      };

      voxAudio.dispose();
      voxAudio.setEnvironmentProfile('egypt');
      assert.equal(voxAudio.startMusic('day', false), true);
      await new Promise((r) => setTimeout(r, 0));
      assert.equal(voxAudio.getStateSnapshot().isMusicPlaying, false);
      assert.ok(cleared >= 1);
      voxAudio.dispose();
    } finally {
      if (prevWindow === undefined) {
        delete (globalThis as { window?: unknown }).window;
      } else {
        (globalThis as { window: unknown }).window = prevWindow;
      }
    }
  });
});
