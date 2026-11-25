import type {
  EgyptBuildGameId,
  EgyptInstructionJournalRecord,
  EgyptInstructionSkillCategory,
} from '../types/game';
import { EGYPT_MISSION_ID, type EgyptLandmarkId } from './egyptWorld';
import {
  EGYPT_BUILD_MISSIONS,
  type EgyptBuildMissionMeta,
} from './egyptBuildTypes';
import {
  EXPEDITION_COMMAND_FORGE_CHALLENGES,
  PAPYRUS_WORKSHOP_CHALLENGES,
  PYRAMID_ROUTE_ARCHITECT_CHALLENGES,
} from './egyptBuildGames1to3';
import {
  PHARAOH_BLUEPRINT_CHALLENGES,
  TEMPLE_RULE_ARCHITECT_CHALLENGES,
} from './egyptBuildGames4to5';

export * from './egyptBuildTypes';
export * from './egyptBuildGames1to3';
export * from './egyptBuildGames4to5';

export const GAME_ID_BY_LANDMARK: Record<EgyptLandmarkId, EgyptBuildGameId> = {
  nile_expedition_camp: 'expedition_command_forge',
  giza_pyramid_plaza: 'pyramid_route_architect',
  ancient_scribe_workshop: 'papyrus_instruction_workshop',
  temple_of_the_sun: 'temple_rule_architect',
  chamber_of_wisdom: 'pharaoh_master_blueprint',
};

export const SKILL_CATEGORY_BY_GAME_ID: Record<
  EgyptBuildGameId,
  EgyptInstructionSkillCategory
> = {
  expedition_command_forge: 'imperatives_and_objects',
  pyramid_route_architect: 'route_directions',
  papyrus_instruction_workshop: 'multi_step_sequence',
  temple_rule_architect: 'rules_and_conditionals',
  pharaoh_master_blueprint: 'master_blueprint',
};

export function getEgyptBuildMissionMeta(
  landmarkId: EgyptLandmarkId,
): EgyptBuildMissionMeta {
  return (
    EGYPT_BUILD_MISSIONS.find((m) => m.landmarkId === landmarkId) ??
    EGYPT_BUILD_MISSIONS[0]
  );
}

export function getEgyptBuildGameChallengeIds(
  landmarkId: EgyptLandmarkId,
): string[] {
  switch (landmarkId) {
    case 'nile_expedition_camp':
      return EXPEDITION_COMMAND_FORGE_CHALLENGES.map((c) => c.challengeId);
    case 'giza_pyramid_plaza':
      return PYRAMID_ROUTE_ARCHITECT_CHALLENGES.map((c) => c.challengeId);
    case 'ancient_scribe_workshop':
      return PAPYRUS_WORKSHOP_CHALLENGES.map((c) => c.challengeId);
    case 'temple_of_the_sun':
      return TEMPLE_RULE_ARCHITECT_CHALLENGES.map((c) => c.challengeId);
    case 'chamber_of_wisdom':
      return PHARAOH_BLUEPRINT_CHALLENGES.map((c) => c.challengeId);
    default:
      return [];
  }
}

export const ALL_EGYPT_BUILD_CHALLENGE_IDS: string[] = [
  ...EXPEDITION_COMMAND_FORGE_CHALLENGES.map((c) => c.challengeId),
  ...PYRAMID_ROUTE_ARCHITECT_CHALLENGES.map((c) => c.challengeId),
  ...PAPYRUS_WORKSHOP_CHALLENGES.map((c) => c.challengeId),
  ...TEMPLE_RULE_ARCHITECT_CHALLENGES.map((c) => c.challengeId),
  ...PHARAOH_BLUEPRINT_CHALLENGES.map((c) => c.challengeId),
];

export const VALID_EGYPT_BUILD_CHALLENGE_ID_SET = new Set<string>(
  ALL_EGYPT_BUILD_CHALLENGE_IDS,
);

const VALID_EGYPT_BUILD_GAME_IDS = new Set<EgyptBuildGameId>([
  'expedition_command_forge',
  'pyramid_route_architect',
  'papyrus_instruction_workshop',
  'temple_rule_architect',
  'pharaoh_master_blueprint',
]);

/**
 * Journal Duplicate Prevention Policy:
 * Every entry is uniquely keyed by `${gameId}:${challengeId}`.
 * When a learner revises/replays the same challenge, the latest valid accepted
 * construction replaces the existing entry in-place rather than stacking duplicates.
 */
export function makeEgyptJournalRecordId(
  gameId: EgyptBuildGameId,
  challengeId: string,
): string {
  return `${gameId}:${challengeId}`;
}

export function isValidEgyptJournalRecord(
  raw: unknown,
): raw is EgyptInstructionJournalRecord {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return false;
  const r = raw as Record<string, unknown>;
  if (typeof r.gameId !== 'string' || !VALID_EGYPT_BUILD_GAME_IDS.has(r.gameId as EgyptBuildGameId)) {
    return false;
  }
  if (typeof r.challengeId !== 'string' || !VALID_EGYPT_BUILD_CHALLENGE_ID_SET.has(r.challengeId)) {
    return false;
  }
  if (typeof r.landmarkId !== 'string' || GAME_ID_BY_LANDMARK[r.landmarkId as EgyptLandmarkId] !== r.gameId) {
    return false;
  }
  if (r.cefrLevel !== 'a2' && r.cefrLevel !== 'b1') return false;
  if (typeof r.instructionText !== 'string' || r.instructionText.trim().length < 4 || r.instructionText.trim().length > 480) {
    return false;
  }
  if (!Array.isArray(r.instructionLines) || r.instructionLines.length === 0) {
    return false;
  }
  if (
    !r.challengeTitle ||
    typeof r.challengeTitle !== 'object' ||
    typeof (r.challengeTitle as { en?: unknown }).en !== 'string' ||
    typeof (r.challengeTitle as { th?: unknown }).th !== 'string'
  ) {
    return false;
  }
  return typeof r.completedAt === 'string';
}

export function sanitizeEgyptBuildJournal(
  rawList: unknown,
): EgyptInstructionJournalRecord[] | undefined {
  if (!Array.isArray(rawList)) return undefined;
  const map = new Map<string, EgyptInstructionJournalRecord>();
  for (const rawItem of rawList) {
    if (!isValidEgyptJournalRecord(rawItem)) continue;
    const id = makeEgyptJournalRecordId(rawItem.gameId, rawItem.challengeId);
    const cleanLines = rawItem.instructionLines
      .filter((line): line is string => typeof line === 'string' && line.trim().length > 0)
      .map((line) => line.trim())
      .slice(0, 8);
    if (cleanLines.length === 0) continue;
    map.set(id, {
      id,
      missionId: EGYPT_MISSION_ID,
      gameId: rawItem.gameId,
      landmarkId: rawItem.landmarkId,
      challengeId: rawItem.challengeId,
      challengeTitle: {
        en: rawItem.challengeTitle.en.trim(),
        th: rawItem.challengeTitle.th.trim(),
      },
      cefrLevel: rawItem.cefrLevel,
      instructionText: rawItem.instructionText.trim(),
      instructionLines: cleanLines,
      ...(typeof rawItem.thaiScaffold === 'string' && rawItem.thaiScaffold.trim()
        ? { thaiScaffold: rawItem.thaiScaffold.trim() }
        : {}),
      skillCategory: SKILL_CATEGORY_BY_GAME_ID[rawItem.gameId],
      completedAt: rawItem.completedAt,
      ...(typeof rawItem.attemptNumber === 'number' && Number.isFinite(rawItem.attemptNumber)
        ? { attemptNumber: Math.max(1, Math.floor(rawItem.attemptNumber)) }
        : {}),
    });
  }
  if (map.size === 0) return undefined;
  return Array.from(map.values());
}
