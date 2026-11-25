import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  AUSTRALIA_INTERACTIVE_TARGETS,
  AUSTRALIA_RECOMMENDED_ROUTE,
  AUSTRALIA_SPAWN,
} from '../src/data/australiaWorld';
import {
  JAIPUR_INTERACTIVE_TARGETS,
  JAIPUR_SPAWN,
  JAIPUR_VOCAB_OBJECTS,
} from '../src/data/jaipurWorld';
import { JAIPUR_SPOT_AND_SPEAK_CHALLENGES } from '../src/data/jaipurSpotAndSpeak';
import {
  KENYA_INTERACTIVE_TARGETS,
  KENYA_SPAWN,
} from '../src/data/kenyaWorld';
import { KENYA_DISCOVERY_TASKS } from '../src/data/kenyaDiscovery';
import { KENYA_BUILD_STATIONS } from '../src/data/kenyaBuild';
import { KENYA_PRACTICE_CONVERSATIONS } from '../src/data/kenyaPractice';
import {
  SCOTLAND_INTERACTIVE_TARGETS,
  SCOTLAND_LANDMARKS,
  SCOTLAND_SPAWN,
} from '../src/data/scotlandWorld';
import { SCOTLAND_BUILD_STATIONS } from '../src/data/scotlandBuild';
import { SCOTLAND_PRACTICE_MISSIONS } from '../src/data/scotlandPractice';
import {
  EGYPT_INTERACTIVE_TARGETS,
  EGYPT_SPAWN,
} from '../src/data/egyptWorld';
import { GAME_COPY } from '../src/data/i18n';
import {
  computeWalkablePath,
  findSafeArrivalPoint,
  getDestinationStatusTag,
  getNavDestinationById,
  getWorldNavDestinations,
  hasClearLineOfSight,
  isWalkablePoint,
  resolveNextMissionTarget,
  resolveQuickTravelDestination,
  type NavPoint2D,
} from '../src/utils/worldNavigation';

function assertEverySegmentWalkable(
  worldId: 'australia' | 'india' | 'kenya' | 'scotland' | 'egypt',
  start: NavPoint2D,
  waypoints: NavPoint2D[],
) {
  let prev = start;
  for (const wp of waypoints) {
    assert.equal(
      isWalkablePoint(worldId, wp.x, wp.z),
      true,
      `Waypoint (${wp.x}, ${wp.z}) in ${worldId} must be walkable`,
    );
    assert.equal(
      hasClearLineOfSight(worldId, prev, wp),
      true,
      `Segment from (${prev.x}, ${prev.z}) to (${wp.x}, ${wp.z}) in ${worldId} must be obstacle-free`,
    );
    const dist = Math.hypot(wp.x - prev.x, wp.z - prev.z);
    const steps = Math.max(1, Math.ceil(dist / 0.2));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const sx = prev.x + (wp.x - prev.x) * t;
      const sz = prev.z + (wp.z - prev.z) * t;
      assert.equal(
        isWalkablePoint(worldId, sx, sz),
        true,
        `Sub-sample (${sx.toFixed(2)}, ${sz.toFixed(2)}) in ${worldId} hit an obstacle`,
      );
    }
    prev = wp;
  }
}

describe('Phase NAV-1: Global Auto-Walk & Smart Navigation', () => {
  it('lists and resolves all destinations across Australia, India, Kenya, Scotland, and Egypt while rejecting invalid cross-world queries', () => {
    const ausList = getWorldNavDestinations('australia');
    assert.equal(ausList.length, AUSTRALIA_INTERACTIVE_TARGETS.length);
    assert.equal(getNavDestinationById('australia', 'npc_olivia')?.kind, 'npc');

    const indList = getWorldNavDestinations('india');
    assert.equal(indList.length, JAIPUR_INTERACTIVE_TARGETS.length);
    assert.equal(getNavDestinationById('india', 'palace')?.kind, 'vocab');

    const kenList = getWorldNavDestinations('kenya');
    assert.equal(kenList.length, KENYA_INTERACTIVE_TARGETS.length);
    assert.equal(getNavDestinationById('kenya', 'ranger_camp')?.kind, 'landmark');

    const scoList = getWorldNavDestinations('scotland');
    assert.equal(scoList.length, SCOTLAND_INTERACTIVE_TARGETS.length);
    assert.equal(
      getNavDestinationById('scotland', 'lochside_castle_viewpoint')?.kind,
      'landmark',
    );

    const egyList = getWorldNavDestinations('egypt');
    assert.equal(egyList.length, EGYPT_INTERACTIVE_TARGETS.length);
    assert.equal(getNavDestinationById('egypt', 'chamber_of_wisdom')?.kind, 'landmark');
    assert.equal(getNavDestinationById('egypt', 'npc_layla')?.kind, 'npc');

    // Invalid / cross-world lookups must fail cleanly
    assert.equal(getNavDestinationById('australia', 'palace'), null);
    assert.equal(getNavDestinationById('egypt', 'pyramids'), null);
    assert.equal(getNavDestinationById('scotland', ''), null);
  });

  it('computes collision-free A* paths across all destinations in Australia, India, Kenya, Scotland, and Egypt', () => {
    const worlds = [
      { worldId: 'australia' as const, spawn: { x: AUSTRALIA_SPAWN.x, z: AUSTRALIA_SPAWN.z } },
      { worldId: 'india' as const, spawn: { x: JAIPUR_SPAWN.x, z: JAIPUR_SPAWN.z } },
      { worldId: 'kenya' as const, spawn: { x: KENYA_SPAWN.x, z: KENYA_SPAWN.z } },
      { worldId: 'scotland' as const, spawn: { x: SCOTLAND_SPAWN.x, z: SCOTLAND_SPAWN.z } },
      { worldId: 'egypt' as const, spawn: { x: EGYPT_SPAWN.x, z: EGYPT_SPAWN.z } },
    ];

    for (const { worldId, spawn } of worlds) {
      const destinations = getWorldNavDestinations(worldId);
      for (const dest of destinations) {
        const result = computeWalkablePath(worldId, spawn, dest.id);
        assert.equal(
          result.reachable,
          true,
          `Expected ${worldId}:${dest.id} to be reachable from spawn`,
        );
        assert.ok(result.arrivalPoint, `Missing arrival point for ${worldId}:${dest.id}`);
        assertEverySegmentWalkable(worldId, spawn, result.waypoints);

        const arrival = result.arrivalPoint;
        const distToTarget = Math.hypot(
          arrival.x - dest.position.x,
          arrival.z - dest.position.z,
        );
        assert.ok(
          distToTarget <= dest.interactionRadius,
          `Arrival for ${worldId}:${dest.id} (${distToTarget.toFixed(2)}m) exceeds interactionRadius (${dest.interactionRadius}m)`,
        );
        assert.equal(
          isWalkablePoint(worldId, arrival.x, arrival.z),
          true,
          `Safe arrival for ${worldId}:${dest.id} must be walkable`,
        );
      }
    }
  });

  it('routes cleanly around world-specific obstacles (Australia kiosks/seawall, India lotus fountain, Kenya watering hole & dynamic tourists, Scotland stone bridge)', () => {
    // Australia: spawn -> harbour_gardens_help_point across central Sydney precinct
    const ausPath = computeWalkablePath(
      'australia',
      { x: AUSTRALIA_SPAWN.x, z: AUSTRALIA_SPAWN.z },
      'harbour_gardens_help_point',
    );
    assert.equal(ausPath.reachable, true);
    assert.equal(ausPath.reason, 'ok');
    assert.ok(ausPath.waypoints.length >= 1);
    assertEverySegmentWalkable('australia', { x: AUSTRALIA_SPAWN.x, z: AUSTRALIA_SPAWN.z }, ausPath.waypoints);

    // India: directly south of central fountain -> archway directly north of fountain (must route around central_fountain)
    const indStart = { x: 0, z: 3.0 };
    const indPath = computeWalkablePath('india', indStart, 'archway');
    assert.equal(indPath.reachable, true);
    assert.ok(
      indPath.waypoints.length >= 2,
      'India path across central fountain must bend around obstacle rather than walk through center',
    );
    assertEverySegmentWalkable('india', indStart, indPath.waypoints);

    // Kenya: south plains -> zebra_watering_hole and conservation_lookout with dynamic Emma/Daniel active
    const kenContext = {
      kenyaPracticedIds: [] as ('ranger_camp' | 'elephant_grassland' | 'giraffe_acacia_grove' | 'zebra_watering_hole' | 'conservation_lookout')[],
      kenyaPracticeCompleted: false,
      kenyaPerformStarted: false,
    };
    for (const targetId of ['zebra_watering_hole', 'conservation_lookout'] as const) {
      const kenPath = computeWalkablePath(
        'kenya',
        { x: KENYA_SPAWN.x, z: KENYA_SPAWN.z },
        targetId,
        kenContext,
      );
      assert.equal(kenPath.reachable, true);
      assertEverySegmentWalkable('kenya', { x: KENYA_SPAWN.x, z: KENYA_SPAWN.z }, kenPath.waypoints);
    }

    // Scotland: Highland Games Ground (west of stream) -> Lochside Castle Viewpoint (east of stream)
    // Stream blocks direct crossing between z=-7.05..-3.2 and z=-14.4..-9.95, forcing path over stone bridge or southern path
    const scoStart = { x: -10.5, z: -8.5 };
    const scoPath = computeWalkablePath('scotland', scoStart, 'lochside_castle_viewpoint');
    assert.equal(scoPath.reachable, true);
    assertEverySegmentWalkable('scotland', scoStart, scoPath.waypoints);
  });

  it('detects already-nearby positions and rejects unreachable out-of-bounds or invalid targets', () => {
    const safeArrival = findSafeArrivalPoint('australia', 'npc_olivia');
    assert.ok(safeArrival);

    const nearby = computeWalkablePath('australia', safeArrival, 'npc_olivia');
    assert.equal(nearby.reachable, true);
    assert.equal(nearby.reason, 'already_nearby');
    assert.deepEqual(nearby.waypoints, []);
    assert.equal(nearby.totalDistance, 0);

    const outOfBounds = computeWalkablePath('australia', { x: 999, z: 999 }, 'npc_olivia');
    assert.equal(outOfBounds.reachable, false);
    assert.equal(outOfBounds.reason, 'unreachable');

    const invalidTarget = computeWalkablePath(
      'india',
      { x: JAIPUR_SPAWN.x, z: JAIPUR_SPAWN.z },
      'not_a_real_poi',
    );
    assert.equal(invalidTarget.reachable, false);
    assert.equal(invalidTarget.reason, 'invalid_target');
  });

  it('resolves collision-safe Quick Travel with valid facingYaw and enforces countryUnlocked gating without mutating rewards', () => {
    const qtOk = resolveQuickTravelDestination('scotland', 'lochside_castle_viewpoint', {
      fromPos: { x: SCOTLAND_SPAWN.x, z: SCOTLAND_SPAWN.z },
      countryUnlocked: true,
    });
    assert.equal(qtOk.allowed, true);
    assert.equal(qtOk.reason, 'ok');
    assert.ok(qtOk.arrivalPoint);
    assert.equal(isWalkablePoint('scotland', qtOk.arrivalPoint.x, qtOk.arrivalPoint.z), true);
    assert.equal(Number.isFinite(qtOk.facingYaw), true);

    const qtLocked = resolveQuickTravelDestination('australia', 'circular_quay_plaza', {
      countryUnlocked: false,
    });
    assert.equal(qtLocked.allowed, false);
    assert.equal(qtLocked.reason, 'locked');
    assert.equal(qtLocked.arrivalPoint, null);

    const qtInvalid = resolveQuickTravelDestination('kenya', 'does_not_exist');
    assert.equal(qtInvalid.allowed, false);
    assert.equal(qtInvalid.reason, 'invalid_target');
  });

  it('resolves Go to Next Mission accurately across Australia, India, Kenya, Scotland, and Egypt without bypassing progression gates', () => {
    // Australia
    assert.equal(
      resolveNextMissionTarget({
        worldId: 'australia',
        state: {
          countryUnlocked: false,
          discoverStarted: false,
          discoverCompleted: false,
          completedDiscoverIds: [],
          buildUnlocked: false,
        },
      }).status,
      'locked',
    );
    assert.equal(
      resolveNextMissionTarget({
        worldId: 'australia',
        state: {
          countryUnlocked: true,
          discoverStarted: false,
          discoverCompleted: false,
          completedDiscoverIds: [],
          buildUnlocked: false,
        },
      }).targetId,
      'npc_olivia',
    );
    assert.equal(
      resolveNextMissionTarget({
        worldId: 'australia',
        state: {
          countryUnlocked: true,
          discoverStarted: true,
          discoverCompleted: false,
          completedDiscoverIds: [AUSTRALIA_RECOMMENDED_ROUTE[0]],
          buildUnlocked: false,
        },
      }).targetId,
      AUSTRALIA_RECOMMENDED_ROUTE[1],
    );
    const ausReadyBuild = resolveNextMissionTarget({
      worldId: 'australia',
      state: {
        countryUnlocked: true,
        discoverStarted: true,
        discoverCompleted: true,
        completedDiscoverIds: [...AUSTRALIA_RECOMMENDED_ROUTE],
        buildUnlocked: true,
        buildStarted: false,
        completedBuildIds: [],
        buildCompleted: false,
        practiceUnlocked: false,
      },
    });
    assert.equal(ausReadyBuild.status, 'actionable');
    assert.equal(ausReadyBuild.stageLabel, 'BUILD');
    assert.equal(ausReadyBuild.reasonKey, 'start_build');
    assert.equal(ausReadyBuild.targetId, 'npc_olivia');

    const ausMidBuild = resolveNextMissionTarget({
      worldId: 'australia',
      state: {
        countryUnlocked: true,
        discoverStarted: true,
        discoverCompleted: true,
        completedDiscoverIds: [...AUSTRALIA_RECOMMENDED_ROUTE],
        buildUnlocked: true,
        buildStarted: true,
        completedBuildIds: [AUSTRALIA_RECOMMENDED_ROUTE[0]],
        buildCompleted: false,
        practiceUnlocked: false,
      },
    });
    assert.equal(ausMidBuild.status, 'actionable');
    assert.equal(ausMidBuild.stageLabel, 'BUILD');
    assert.equal(ausMidBuild.reasonKey, 'build_station');
    assert.equal(ausMidBuild.targetId, AUSTRALIA_RECOMMENDED_ROUTE[1]);

    const ausBuildDone = resolveNextMissionTarget({
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
      },
    });
    assert.equal(ausBuildDone.status, 'actionable');
    assert.equal(ausBuildDone.stageLabel, 'PRACTICE');
    assert.equal(ausBuildDone.reasonKey, 'start_practice');
    assert.equal(ausBuildDone.targetId, 'npc_olivia');

    const ausMidPractice = resolveNextMissionTarget({
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
        completedPracticeIds: [AUSTRALIA_RECOMMENDED_ROUTE[0]],
        practiceCompleted: false,
      },
    });
    assert.equal(ausMidPractice.status, 'actionable');
    assert.equal(ausMidPractice.stageLabel, 'PRACTICE');
    assert.equal(ausMidPractice.reasonKey, 'practice_station');
    assert.equal(ausMidPractice.targetId, AUSTRALIA_RECOMMENDED_ROUTE[1]);

    const ausPracticeDone = resolveNextMissionTarget({
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
    assert.equal(ausPracticeDone.status, 'actionable');
    assert.equal(ausPracticeDone.stageLabel, 'PERFORM');
    assert.equal(ausPracticeDone.reasonKey, 'start_perform');
    assert.equal(ausPracticeDone.targetId, 'npc_olivia');

    // India
    assert.equal(
      resolveNextMissionTarget({
        worldId: 'india',
        state: {
          countryUnlocked: true,
          metAarav: false,
          foundObjectIds: [],
          wordDetectiveCompleted: false,
          buildUnlocked: false,
          sentenceTrainCompleted: false,
          practiceUnlocked: false,
          spotAndSpeakStarted: false,
          spotAndSpeakCompletedIds: [],
          spotAndSpeakCompleted: false,
          performUnlocked: false,
          showcaseCompleted: false,
        },
      }).targetId,
      'local_guide',
    );
    assert.equal(
      resolveNextMissionTarget({
        worldId: 'india',
        state: {
          countryUnlocked: true,
          metAarav: true,
          foundObjectIds: [JAIPUR_VOCAB_OBJECTS[0].id],
          wordDetectiveCompleted: false,
          buildUnlocked: false,
          sentenceTrainCompleted: false,
          practiceUnlocked: false,
          spotAndSpeakStarted: false,
          spotAndSpeakCompletedIds: [],
          spotAndSpeakCompleted: false,
          performUnlocked: false,
          showcaseCompleted: false,
        },
      }).targetId,
      JAIPUR_VOCAB_OBJECTS[1].id,
    );
    assert.equal(
      resolveNextMissionTarget({
        worldId: 'india',
        state: {
          countryUnlocked: true,
          metAarav: true,
          foundObjectIds: JAIPUR_VOCAB_OBJECTS.map((v) => v.id),
          wordDetectiveCompleted: true,
          buildUnlocked: true,
          sentenceTrainCompleted: true,
          practiceUnlocked: true,
          spotAndSpeakStarted: true,
          spotAndSpeakCompletedIds: [JAIPUR_SPOT_AND_SPEAK_CHALLENGES[0].id],
          spotAndSpeakCompleted: false,
          performUnlocked: false,
          showcaseCompleted: false,
        },
      }).targetId,
      JAIPUR_SPOT_AND_SPEAK_CHALLENGES[1].id,
    );
    assert.equal(
      resolveNextMissionTarget({
        worldId: 'india',
        state: {
          countryUnlocked: true,
          metAarav: true,
          foundObjectIds: JAIPUR_VOCAB_OBJECTS.map((v) => v.id),
          wordDetectiveCompleted: true,
          buildUnlocked: true,
          sentenceTrainCompleted: true,
          practiceUnlocked: true,
          spotAndSpeakStarted: true,
          spotAndSpeakCompletedIds: JAIPUR_SPOT_AND_SPEAK_CHALLENGES.map((c) => c.id),
          spotAndSpeakCompleted: true,
          performUnlocked: true,
          showcaseCompleted: true,
        },
      }).status,
      'country_completed',
    );

    // Kenya
    assert.equal(
      resolveNextMissionTarget({
        worldId: 'kenya',
        state: {
          countryUnlocked: true,
          discoverStarted: true,
          discoveredSpotIds: [],
          discoverCompleted: false,
          buildStarted: false,
          builtBoardIds: [],
          buildCompleted: false,
          practiceStarted: false,
          practicedIds: [],
          practiceCompleted: false,
          performStarted: false,
          performCompleted: false,
        },
      }).targetId,
      KENYA_DISCOVERY_TASKS[0].id,
    );
    assert.equal(
      resolveNextMissionTarget({
        worldId: 'kenya',
        state: {
          countryUnlocked: true,
          discoverStarted: true,
          discoveredSpotIds: KENYA_DISCOVERY_TASKS.map((t) => t.id),
          discoverCompleted: true,
          buildStarted: true,
          builtBoardIds: [KENYA_BUILD_STATIONS[0].id],
          buildCompleted: false,
          practiceStarted: false,
          practicedIds: [],
          practiceCompleted: false,
          performStarted: false,
          performCompleted: false,
        },
      }).targetId,
      KENYA_BUILD_STATIONS[1].id,
    );
    assert.equal(
      resolveNextMissionTarget({
        worldId: 'kenya',
        state: {
          countryUnlocked: true,
          discoverStarted: true,
          discoveredSpotIds: KENYA_DISCOVERY_TASKS.map((t) => t.id),
          discoverCompleted: true,
          buildStarted: true,
          builtBoardIds: KENYA_BUILD_STATIONS.map((b) => b.id),
          buildCompleted: true,
          practiceStarted: true,
          practicedIds: KENYA_PRACTICE_CONVERSATIONS.map((c) => c.id),
          practiceCompleted: true,
          performStarted: true,
          performCompleted: false,
        },
      }).targetId,
      'conservation_lookout',
    );

    // Scotland
    const sortedScoLandmarks = [...SCOTLAND_LANDMARKS].sort((a, b) => a.order - b.order);
    assert.equal(
      resolveNextMissionTarget({
        worldId: 'scotland',
        state: {
          countryUnlocked: true,
          discoverStarted: true,
          discoveredEvidenceIds: [sortedScoLandmarks[0].id],
          discoverCompleted: false,
          buildStarted: false,
          builtStationIds: [],
          buildCompleted: false,
          practiceStarted: false,
          practicedStationIds: [],
          practiceCompleted: false,
          performStarted: false,
          performCompleted: false,
        },
      }).targetId,
      sortedScoLandmarks[1].id,
    );
    assert.equal(
      resolveNextMissionTarget({
        worldId: 'scotland',
        state: {
          countryUnlocked: true,
          discoverStarted: true,
          discoveredEvidenceIds: sortedScoLandmarks.map((l) => l.id),
          discoverCompleted: true,
          buildStarted: true,
          builtStationIds: SCOTLAND_BUILD_STATIONS.map((b) => b.id),
          buildCompleted: true,
          practiceStarted: true,
          practicedStationIds: [SCOTLAND_PRACTICE_MISSIONS[0].id],
          practiceCompleted: false,
          performStarted: false,
          performCompleted: false,
        },
      }).targetId,
      SCOTLAND_PRACTICE_MISSIONS[1].id,
    );
    assert.equal(
      resolveNextMissionTarget({
        worldId: 'scotland',
        state: {
          countryUnlocked: true,
          discoverStarted: true,
          discoveredEvidenceIds: sortedScoLandmarks.map((l) => l.id),
          discoverCompleted: true,
          buildStarted: true,
          builtStationIds: SCOTLAND_BUILD_STATIONS.map((b) => b.id),
          buildCompleted: true,
          practiceStarted: true,
          practicedStationIds: SCOTLAND_PRACTICE_MISSIONS.map((m) => m.id),
          practiceCompleted: true,
          performStarted: false,
          performCompleted: false,
        },
      }).targetId,
      'lochside_castle_viewpoint',
    );

    // Egypt Locked -> Start DISCOVER -> Sequential DISCOVER stations -> Start BUILD -> Sequential BUILD stations -> PRACTICE Coming Soon (Phase 5C)
    const egyptLocked = resolveNextMissionTarget({
      worldId: 'egypt',
      state: { countryUnlocked: false },
    });
    assert.equal(egyptLocked.status, 'locked');
    assert.equal(egyptLocked.reasonKey, 'country_locked');
    assert.equal(egyptLocked.targetId, null);

    const egyptStart = resolveNextMissionTarget({
      worldId: 'egypt',
      state: {
        countryUnlocked: true,
        discoverStarted: false,
        completedDiscoverIds: [],
        discoverCompleted: false,
      },
    });
    assert.equal(egyptStart.status, 'actionable');
    assert.equal(egyptStart.targetId, 'npc_layla');
    assert.equal(egyptStart.stageLabel, 'DISCOVER');
    assert.equal(egyptStart.reasonKey, 'start_discover');

    const egyptStation1 = resolveNextMissionTarget({
      worldId: 'egypt',
      state: {
        countryUnlocked: true,
        discoverStarted: true,
        completedDiscoverIds: [],
        discoverCompleted: false,
      },
    });
    assert.equal(egyptStation1.status, 'actionable');
    assert.equal(egyptStation1.targetId, 'nile_expedition_camp');
    assert.equal(egyptStation1.stageLabel, 'DISCOVER');
    assert.equal(egyptStation1.reasonKey, 'discover_station');

    const egyptStation3 = resolveNextMissionTarget({
      worldId: 'egypt',
      state: {
        countryUnlocked: true,
        discoverStarted: true,
        completedDiscoverIds: ['nile_expedition_camp', 'giza_pyramid_plaza'],
        discoverCompleted: false,
      },
    });
    assert.equal(egyptStation3.status, 'actionable');
    assert.equal(egyptStation3.targetId, 'ancient_scribe_workshop');
    assert.equal(egyptStation3.stageLabel, 'DISCOVER');
    assert.equal(egyptStation3.reasonKey, 'discover_station');

    const egyptBuildReady = resolveNextMissionTarget({
      worldId: 'egypt',
      state: {
        countryUnlocked: true,
        discoverStarted: true,
        completedDiscoverIds: [
          'nile_expedition_camp',
          'giza_pyramid_plaza',
          'ancient_scribe_workshop',
          'temple_of_the_sun',
          'chamber_of_wisdom',
        ],
        discoverCompleted: true,
        buildUnlocked: true,
        buildStarted: false,
        completedBuildIds: [],
        buildCompleted: false,
      },
    });
    assert.equal(egyptBuildReady.status, 'actionable');
    assert.equal(egyptBuildReady.stageLabel, 'BUILD');
    assert.equal(egyptBuildReady.reasonKey, 'start_build');
    assert.equal(egyptBuildReady.targetId, 'npc_layla');

    const egyptBuildStation2 = resolveNextMissionTarget({
      worldId: 'egypt',
      state: {
        countryUnlocked: true,
        discoverStarted: true,
        completedDiscoverIds: [
          'nile_expedition_camp',
          'giza_pyramid_plaza',
          'ancient_scribe_workshop',
          'temple_of_the_sun',
          'chamber_of_wisdom',
        ],
        discoverCompleted: true,
        buildUnlocked: true,
        buildStarted: true,
        completedBuildIds: ['nile_expedition_camp'],
        buildCompleted: false,
      },
    });
    assert.equal(egyptBuildStation2.status, 'actionable');
    assert.equal(egyptBuildStation2.stageLabel, 'BUILD');
    assert.equal(egyptBuildStation2.reasonKey, 'build_station');
    assert.equal(egyptBuildStation2.targetId, 'giza_pyramid_plaza');

    const egyptPracticePreview = resolveNextMissionTarget({
      worldId: 'egypt',
      state: {
        countryUnlocked: true,
        discoverStarted: true,
        completedDiscoverIds: [
          'nile_expedition_camp',
          'giza_pyramid_plaza',
          'ancient_scribe_workshop',
          'temple_of_the_sun',
          'chamber_of_wisdom',
        ],
        discoverCompleted: true,
        buildUnlocked: true,
        buildStarted: true,
        completedBuildIds: [
          'nile_expedition_camp',
          'giza_pyramid_plaza',
          'ancient_scribe_workshop',
          'temple_of_the_sun',
          'chamber_of_wisdom',
        ],
        buildCompleted: true,
      },
    });
    assert.equal(egyptPracticePreview.status, 'coming_soon');
    assert.equal(egyptPracticePreview.stageLabel, 'PRACTICE');
    assert.equal(egyptPracticePreview.reasonKey, 'egypt_practice_coming_soon');
    assert.equal(egyptPracticePreview.targetId, null);
  });

  it('provides status tag precedence and full bilingual EN/TH navigation copy', () => {
    assert.equal(
      getDestinationStatusTag(
        'australia',
        'npc_olivia',
        { nextTargetId: 'npc_olivia', completedIds: ['npc_olivia'], visitedIds: ['npc_olivia'] },
        'en',
      ),
      'next',
    );
    assert.equal(
      getDestinationStatusTag(
        'india',
        'palace',
        { nextTargetId: 'archway', completedIds: ['palace'], visitedIds: ['palace'] },
        'en',
      ),
      'completed',
    );
    assert.equal(
      getDestinationStatusTag(
        'kenya',
        'ranger_camp',
        { nextTargetId: 'local_guide', completedIds: [], visitedIds: ['ranger_camp'] },
        'en',
      ),
      'visited',
    );
    assert.equal(
      getDestinationStatusTag(
        'scotland',
        'npc_fiona',
        { nextTargetId: 'npc_eilidh', completedIds: [], visitedIds: [] },
        'en',
      ),
      'open',
    );

    const navKeys = Object.keys(GAME_COPY.en).filter((k) => k.startsWith('nav'));
    assert.equal(navKeys.length, 26);
    for (const key of navKeys) {
      const k = key as keyof typeof GAME_COPY.en;
      assert.ok(GAME_COPY.en[k].trim().length > 0, `Empty EN nav key: ${key}`);
      assert.ok(GAME_COPY.th[k].trim().length > 0, `Empty TH nav key: ${key}`);
    }
  });
});
