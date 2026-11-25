import type {
  AustraliaPerformChallengeRecord,
  AustraliaPerformReflectionState,
  AustraliaSpeakingEvidenceRecord,
  AppearanceMode,
  AvatarHairStyleId,
  AvatarModelId,
  AvatarOutfitId,
  CountryId,
  CountryReplayAttempt,
  CountryReplayCapabilities,
  CountryReplayHistoryRecord,
  CountryReplayState,
  EgyptInstructionJournalRecord,
  LearningStageId,
  LocalProgressV1,
  MissionProgressEntry,
  ScotlandPerformOutline,
  ScotlandPerformPracticeMode,
  ScotlandPerformQaStates,
  ScotlandPerformReflectionState,
  ScotlandSpeakingReflectionState,
  ScreenRoute,
} from '../types/game';
import {
  DEFAULT_AVATAR_CONFIG,
  sanitizeExplorerName,
  VALID_AVATAR_MODEL_IDS,
  VALID_BACKPACK_COLORS,
  VALID_HAIR_COLORS,
  VALID_HAIR_STYLE_IDS,
  VALID_OUTFIT_COLORS,
  VALID_OUTFIT_IDS,
  VALID_SKIN_TONES,
} from '../data/avatarOptions';
import {
  JAIPUR_VOCAB_OBJECTS,
  WORD_DETECTIVE_XP_REWARD,
  type JaipurVocabObjectId,
} from '../data/jaipurWorld';
import {
  SENTENCE_TRAIN_ACTIVITY_ID,
  SENTENCE_TRAIN_XP_REWARD,
} from '../data/jaipurSentenceTrain';
import {
  SPOT_AND_SPEAK_ACTIVITY_ID,
  SPOT_AND_SPEAK_XP_REWARD,
} from '../data/jaipurSpotAndSpeak';
import {
  FINAL_JAIPUR_SHOWCASE_ACTIVITY_ID,
  FINAL_JAIPUR_SHOWCASE_XP_REWARD,
  INDIA_PASSPORT_STAMP_ID,
} from '../data/jaipurShowcase';
import { KENYA_LANDMARKS, type KenyaLandmarkId } from '../data/kenyaWorld';
import {
  KENYA_DISCOVERY_ACTIVITY_ID,
  KENYA_DISCOVERY_TASKS,
  KENYA_DISCOVERY_XP_REWARD,
  KENYA_MISSION_ID,
} from '../data/kenyaDiscovery';
import {
  isValidSavedKenyaBuildSentence,
  KENYA_BUILD_ACTIVITY_ID,
  KENYA_BUILD_STATIONS,
  KENYA_BUILD_XP_REWARD,
} from '../data/kenyaBuild';
import {
  KENYA_PRACTICE_ACTIVITY_ID,
  KENYA_PRACTICE_CONVERSATIONS,
  KENYA_PRACTICE_XP_REWARD,
} from '../data/kenyaPractice';
import {
  KENYA_PASSPORT_STAMP_ID,
  KENYA_PERFORM_ACTIVITY_ID,
  KENYA_PERFORM_XP_REWARD,
} from '../data/kenyaPerform';
import {
  SCOTLAND_LANDMARKS,
  SCOTLAND_MISSION_ID,
  SCOTLAND_PASSPORT_STAMP_ID,
  SCOTLAND_STAGE_ACTIVITY_IDS,
  type ScotlandLandmarkId,
} from '../data/scotlandWorld';
import {
  SCOTLAND_DISCOVERY_ACTIVITY_ID,
  SCOTLAND_DISCOVERY_XP_REWARD,
  SCOTLAND_EVIDENCE_ITEMS,
} from '../data/scotlandDiscovery';
import {
  isValidSavedScotlandBuildSentence,
  SCOTLAND_BUILD_ACTIVITY_ID,
  SCOTLAND_BUILD_STATIONS,
  SCOTLAND_BUILD_XP_REWARD,
} from '../data/scotlandBuild';
import {
  isValidScotlandReflectionState,
  SCOTLAND_PRACTICE_ACTIVITY_ID,
  SCOTLAND_PRACTICE_MISSIONS,
  SCOTLAND_PRACTICE_XP_REWARD,
} from '../data/scotlandPractice';
import {
  areValidScotlandPerformEvidenceIds,
  areValidScotlandPerformQaStates,
  isValidScotlandPerformCompletionPayload,
  isValidScotlandPerformOutline,
  isValidScotlandPerformPracticeMode,
  isValidScotlandPerformReflectionState,
  sanitizeScotlandPerformOutline,
  sanitizeScotlandPerformQaStates,
  sanitizeScotlandPerformReflectionState,
  sanitizeScotlandPerformSelectedEvidenceIds,
  SCOTLAND_PERFORM_ACTIVITY_ID,
  SCOTLAND_PERFORM_XP_REWARD,
  type ScotlandPerformCompletionPayload,
} from '../data/scotlandPerform';
import {
  AUSTRALIA_LANDMARKS,
  AUSTRALIA_MISSION_ID,
  AUSTRALIA_NPC_POSITIONS,
  AUSTRALIA_PASSPORT_STAMP_ID,
  AUSTRALIA_STAGE_ACTIVITY_IDS,
  type AustraliaLandmarkId,
  type AustraliaNpcId,
} from '../data/australiaWorld';
import {
  AUSTRALIA_DISCOVERY_ACTIVITY_ID,
  AUSTRALIA_DISCOVERY_XP_REWARD,
  AUSTRALIA_DISCOVER_MISSION_ORDER,
} from '../data/australiaDiscovery';
import {
  AUSTRALIA_BUILD_ACTIVITY_ID,
  AUSTRALIA_BUILD_MISSION_ORDER,
  AUSTRALIA_BUILD_XP_REWARD,
  getAustraliaBuildMissionMeta,
} from '../data/australiaBuild';
import {
  AUSTRALIA_PRACTICE_ACTIVITY_ID,
  AUSTRALIA_PRACTICE_MISSION_ORDER,
  AUSTRALIA_PRACTICE_XP_REWARD,
  getAustraliaPracticeMissionSpec,
  isValidAustraliaSpeakingEvidenceRecord,
  sanitizeAustraliaSpeakingEvidenceRecord,
} from '../data/australiaPractice';
import {
  AUSTRALIA_PERFORM_ACTIVITY_ID,
  AUSTRALIA_PERFORM_CHALLENGE_ORDER,
  AUSTRALIA_PERFORM_XP_REWARD,
  getAustraliaPerformChallengeSpec,
  isValidAustraliaPerformChallengeRecord,
  isValidAustraliaPerformReflectionState,
  sanitizeAustraliaPerformChallengeRecord,
  sanitizeAustraliaPerformReflectionState,
  TOTAL_AUSTRALIA_MISSION_XP,
} from '../data/australiaPerform';

import {
  EGYPT_LANDMARKS,
  EGYPT_MISSION_ID,
  EGYPT_NPC_POSITIONS,
  EGYPT_PASSPORT_STAMP_ID,
  type EgyptLandmarkId,
  type EgyptNpcId,
} from '../data/egyptWorld';
import {
  EGYPT_DISCOVERY_ACTIVITY_ID,
  EGYPT_DISCOVERY_XP_REWARD,
  EGYPT_DISCOVER_MISSION_ORDER,
} from '../data/egyptDiscover';
import {
  ALL_EGYPT_BUILD_CHALLENGE_IDS,
  EGYPT_BUILD_ACTIVITY_ID,
  EGYPT_BUILD_MISSION_ORDER,
  EGYPT_BUILD_XP_REWARD,
  getEgyptBuildGameChallengeIds,
  makeEgyptJournalRecordId,
  sanitizeEgyptBuildJournal,
  VALID_EGYPT_BUILD_CHALLENGE_ID_SET,
} from '../data/egyptBuild';

const VALID_JAIPUR_VOCAB_IDS = new Set<string>(JAIPUR_VOCAB_OBJECTS.map((o) => o.id));
const VALID_KENYA_LANDMARK_IDS = new Set<string>(KENYA_LANDMARKS.map((l) => l.id));
const VALID_SCOTLAND_LANDMARK_IDS = new Set<string>(SCOTLAND_LANDMARKS.map((l) => l.id));
const VALID_AUSTRALIA_LANDMARK_IDS = new Set<string>(AUSTRALIA_LANDMARKS.map((l) => l.id));
const VALID_AUSTRALIA_NPC_IDS = new Set<string>(Object.keys(AUSTRALIA_NPC_POSITIONS));
const VALID_EGYPT_LANDMARK_IDS = new Set<string>(EGYPT_LANDMARKS.map((l) => l.id));
const VALID_EGYPT_NPC_IDS = new Set<string>(Object.keys(EGYPT_NPC_POSITIONS));

export const PROGRESS_STORAGE_KEY = 'voxvoyage.localProgress.v1';

const VALID_COUNTRIES: CountryId[] = ['india', 'kenya', 'scotland', 'australia', 'egypt'];
const VALID_APPEARANCE_MODES: AppearanceMode[] = ['day', 'night', 'auto'];
const VALID_ROUTES: ScreenRoute[] = [
  'welcome',
  'avatar-studio',
  'briefing',
  'world-map',
  'country-lobby',
  'mission-pathway',
  'mini-game',
  'speaking-performance',
  'mission-result',
  'passport-reward',
];

export const COUNTRY_REPLAY_CAPABILITIES: Record<CountryId, CountryReplayCapabilities> = {
  india: {
    countryId: 'india',
    missionId: 'mission_india_jaipur',
    isImplemented: true,
    supportedStages: ['discover', 'build', 'practice', 'perform'],
  },
  kenya: {
    countryId: 'kenya',
    missionId: KENYA_MISSION_ID,
    isImplemented: true,
    supportedStages: ['discover', 'build', 'practice', 'perform'],
  },
  scotland: {
    countryId: 'scotland',
    missionId: SCOTLAND_MISSION_ID,
    isImplemented: true,
    supportedStages: ['discover', 'build', 'practice', 'perform'],
  },
  australia: {
    countryId: 'australia',
    missionId: AUSTRALIA_MISSION_ID,
    isImplemented: true,
    supportedStages: ['discover', 'build', 'practice', 'perform'],
  },
  egypt: {
    countryId: 'egypt',
    missionId: 'mission_egypt_expedition',
    isImplemented: false,
    supportedStages: [],
  },
};

export function createDefaultProgress(): LocalProgressV1 {
  return {
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    uiLanguage: 'en',
    appearanceMode: 'day',
    audioPrefs: {
      musicEnabled: false,
      sfxEnabled: false,
    },
    reducedMotionOverride: null,
    selectedCountryId: 'india',
    currentRoute: 'welcome',
    avatar: {
      ...DEFAULT_AVATAR_CONFIG,
      accessoryIds: [...DEFAULT_AVATAR_CONFIG.accessoryIds],
    },
    rewards: {
      xp: 0,
      coins: 0,
      gems: 0,
      stamps: [],
    },
    unlockedCountryIds: ['india'],
    missionProgress: {
      mission_india_jaipur: {
        status: 'not_started',
        currentStage: 'discover',
        completedActivityIds: [],
      },
    },
    replayState: {
      activeAttempts: {},
      history: {},
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Safe migration & validation for voxvoyage.localProgress.v1.
 * Preserves existing XP, rewards, selected destination, avatar, and mission progress
 * while safely migrating legacy Phase 0 fields and validating Phase 1A avatar options.
 */
export function migrateAndValidateProgress(raw: unknown): LocalProgressV1 {
  const defaults = createDefaultProgress();
  if (!isRecord(raw)) {
    return defaults;
  }

  const uiLanguage = raw.uiLanguage === 'th' ? 'th' : 'en';
  const appearanceMode = VALID_APPEARANCE_MODES.includes(raw.appearanceMode as AppearanceMode)
    ? (raw.appearanceMode as AppearanceMode)
    : defaults.appearanceMode;

  const rawAudio = isRecord(raw.audioPrefs) ? raw.audioPrefs : {};
  const audioPrefs = {
    musicEnabled:
      typeof rawAudio.musicEnabled === 'boolean'
        ? rawAudio.musicEnabled
        : defaults.audioPrefs.musicEnabled,
    sfxEnabled:
      typeof rawAudio.sfxEnabled === 'boolean'
        ? rawAudio.sfxEnabled
        : defaults.audioPrefs.sfxEnabled,
  };

  const reducedMotionOverride =
    typeof raw.reducedMotionOverride === 'boolean' ? raw.reducedMotionOverride : null;

  const selectedCountryId = VALID_COUNTRIES.includes(raw.selectedCountryId as CountryId)
    ? (raw.selectedCountryId as CountryId)
    : defaults.selectedCountryId;

  const currentRoute = VALID_ROUTES.includes(raw.currentRoute as ScreenRoute)
    ? (raw.currentRoute as ScreenRoute)
    : defaults.currentRoute;

  const rawAvatar = isRecord(raw.avatar) ? raw.avatar : {};
  const rawRewards = isRecord(raw.rewards) ? raw.rewards : {};

  const modelId: AvatarModelId =
    typeof rawAvatar.modelId === 'string' && VALID_AVATAR_MODEL_IDS.has(rawAvatar.modelId)
      ? (rawAvatar.modelId as AvatarModelId)
      : defaults.avatar.modelId;

  const outfitId: AvatarOutfitId =
    typeof rawAvatar.outfitId === 'string' && VALID_OUTFIT_IDS.has(rawAvatar.outfitId)
      ? (rawAvatar.outfitId as AvatarOutfitId)
      : defaults.avatar.outfitId;

  const hairStyle: AvatarHairStyleId =
    typeof rawAvatar.hairStyle === 'string' && VALID_HAIR_STYLE_IDS.has(rawAvatar.hairStyle)
      ? (rawAvatar.hairStyle as AvatarHairStyleId)
      : defaults.avatar.hairStyle;

  const hairColor =
    typeof rawAvatar.hairColor === 'string' && VALID_HAIR_COLORS.has(rawAvatar.hairColor)
      ? rawAvatar.hairColor
      : defaults.avatar.hairColor;

  const skinTone =
    typeof rawAvatar.skinTone === 'string' && VALID_SKIN_TONES.has(rawAvatar.skinTone)
      ? rawAvatar.skinTone
      : defaults.avatar.skinTone;

  const outfitColor =
    typeof rawAvatar.outfitColor === 'string' && VALID_OUTFIT_COLORS.has(rawAvatar.outfitColor)
      ? rawAvatar.outfitColor
      : defaults.avatar.outfitColor;

  const backpackColor =
    typeof rawAvatar.backpackColor === 'string' && VALID_BACKPACK_COLORS.has(rawAvatar.backpackColor)
      ? rawAvatar.backpackColor
      : defaults.avatar.backpackColor;

  const displayName =
    typeof rawAvatar.displayName === 'string'
      ? sanitizeExplorerName(rawAvatar.displayName)
      : defaults.avatar.displayName;

  const unlockedCountryIds = Array.isArray(raw.unlockedCountryIds)
    ? raw.unlockedCountryIds.filter((id): id is CountryId =>
        VALID_COUNTRIES.includes(id as CountryId),
      )
    : defaults.unlockedCountryIds;

  const sanitizedMissionProgress = (() => {
    const sanitized: LocalProgressV1['missionProgress'] = {
      ...defaults.missionProgress,
    };
    if (isRecord(raw.missionProgress)) {
      for (const [missionId, entry] of Object.entries(raw.missionProgress)) {
        if (!isRecord(entry)) continue;
        const status: 'not_started' | 'in_progress' | 'completed' =
          entry.status === 'completed' || entry.status === 'in_progress'
            ? entry.status
            : 'not_started';
        const currentStage: LearningStageId =
          entry.currentStage === 'build' ||
          entry.currentStage === 'practice' ||
          entry.currentStage === 'perform'
            ? entry.currentStage
            : 'discover';
        const completedActivityIds = Array.isArray(entry.completedActivityIds)
          ? entry.completedActivityIds.filter((x): x is string => typeof x === 'string')
          : [];
        const wordDetectiveFoundIds = Array.isArray(entry.wordDetectiveFoundIds)
          ? Array.from(
              new Set(
                entry.wordDetectiveFoundIds.filter(
                  (x): x is string =>
                    typeof x === 'string' &&
                    (missionId !== 'mission_india_jaipur' || VALID_JAIPUR_VOCAB_IDS.has(x)),
                ),
              ),
            )
          : undefined;
        const metAarav = typeof entry.metAarav === 'boolean' ? entry.metAarav : undefined;
        const spotAndSpeakStarted =
          typeof entry.spotAndSpeakStarted === 'boolean' ? entry.spotAndSpeakStarted : undefined;
        const spotAndSpeakDoneIds = Array.isArray(entry.spotAndSpeakDoneIds)
          ? Array.from(
              new Set(
                entry.spotAndSpeakDoneIds.filter(
                  (x): x is string =>
                    typeof x === 'string' &&
                    (missionId !== 'mission_india_jaipur' || VALID_JAIPUR_VOCAB_IDS.has(x)),
                ),
              ),
            )
          : undefined;
        const kenyaDiscoverStarted =
          typeof entry.kenyaDiscoverStarted === 'boolean'
            ? entry.kenyaDiscoverStarted
            : undefined;
        const kenyaDiscoveredIds = Array.isArray(entry.kenyaDiscoveredIds)
          ? Array.from(
              new Set(
                entry.kenyaDiscoveredIds.filter(
                  (x): x is string =>
                    typeof x === 'string' && VALID_KENYA_LANDMARK_IDS.has(x),
                ),
              ),
            )
          : undefined;
        let kenyaBuildStarted =
          typeof entry.kenyaBuildStarted === 'boolean' ? entry.kenyaBuildStarted : undefined;
        let kenyaBuiltSentences: Record<string, string> | undefined;
        if (missionId === KENYA_MISSION_ID && isRecord(entry.kenyaBuiltSentences)) {
          const validMap: Record<string, string> = {};
          for (const [stationKey, rawSentence] of Object.entries(entry.kenyaBuiltSentences)) {
            if (
              VALID_KENYA_LANDMARK_IDS.has(stationKey) &&
              isValidSavedKenyaBuildSentence(stationKey as KenyaLandmarkId, rawSentence)
            ) {
              validMap[stationKey] = rawSentence.trim();
            }
          }
          if (Object.keys(validMap).length > 0) {
            kenyaBuiltSentences = validMap;
          }
        }
        let kenyaPracticeStarted =
          typeof entry.kenyaPracticeStarted === 'boolean'
            ? entry.kenyaPracticeStarted
            : undefined;
        let kenyaPracticedConversationIds = Array.isArray(entry.kenyaPracticedConversationIds)
          ? Array.from(
              new Set(
                entry.kenyaPracticedConversationIds.filter(
                  (x): x is string =>
                    typeof x === 'string' && VALID_KENYA_LANDMARK_IDS.has(x),
                ),
              ),
            )
          : undefined;
        let kenyaPerformStarted =
          typeof entry.kenyaPerformStarted === 'boolean' ? entry.kenyaPerformStarted : undefined;
        const metEilidh =
          typeof entry.metEilidh === 'boolean' ? entry.metEilidh : undefined;
        const metFiona =
          typeof entry.metFiona === 'boolean' ? entry.metFiona : undefined;
        const scotlandExploredPoiIds = Array.isArray(entry.scotlandExploredPoiIds)
          ? Array.from(
              new Set(
                entry.scotlandExploredPoiIds.filter(
                  (x): x is string =>
                    typeof x === 'string' && VALID_SCOTLAND_LANDMARK_IDS.has(x),
                ),
              ),
            )
          : undefined;
        let scotlandDiscoverStarted =
          typeof entry.scotlandDiscoverStarted === 'boolean'
            ? entry.scotlandDiscoverStarted
            : undefined;
        let scotlandDiscoveredEvidenceIds = Array.isArray(entry.scotlandDiscoveredEvidenceIds)
          ? Array.from(
              new Set(
                entry.scotlandDiscoveredEvidenceIds.filter(
                  (x): x is string =>
                    typeof x === 'string' && VALID_SCOTLAND_LANDMARK_IDS.has(x),
                ),
              ),
            )
          : undefined;
        let scotlandBuildStarted =
          typeof entry.scotlandBuildStarted === 'boolean'
            ? entry.scotlandBuildStarted
            : undefined;
        let scotlandBuiltSentences: Record<string, string> | undefined;
        if (missionId === SCOTLAND_MISSION_ID && isRecord(entry.scotlandBuiltSentences)) {
          const validMap: Record<string, string> = {};
          for (const [stationKey, rawSentence] of Object.entries(entry.scotlandBuiltSentences)) {
            if (
              VALID_SCOTLAND_LANDMARK_IDS.has(stationKey) &&
              isValidSavedScotlandBuildSentence(stationKey as ScotlandLandmarkId, rawSentence)
            ) {
              validMap[stationKey] = rawSentence.trim();
            }
          }
          if (Object.keys(validMap).length > 0) {
            scotlandBuiltSentences = validMap;
          }
        }
        let scotlandPracticeStarted =
          typeof entry.scotlandPracticeStarted === 'boolean'
            ? entry.scotlandPracticeStarted
            : undefined;
        let scotlandSpeakingReflectionStates:
          | Record<string, ScotlandSpeakingReflectionState>
          | undefined;
        if (
          missionId === SCOTLAND_MISSION_ID &&
          isRecord(entry.scotlandSpeakingReflectionStates)
        ) {
          const validReflections: Record<string, ScotlandSpeakingReflectionState> = {};
          for (const [stationKey, rawRef] of Object.entries(
            entry.scotlandSpeakingReflectionStates,
          )) {
            if (
              VALID_SCOTLAND_LANDMARK_IDS.has(stationKey) &&
              isValidScotlandReflectionState(rawRef)
            ) {
              validReflections[stationKey] = rawRef;
            }
          }
          if (Object.keys(validReflections).length > 0) {
            scotlandSpeakingReflectionStates = validReflections;
          }
        }
        let scotlandCompletedSpeakingIds = Array.isArray(entry.scotlandCompletedSpeakingIds)
          ? Array.from(
              new Set(
                entry.scotlandCompletedSpeakingIds.filter(
                  (x): x is string =>
                    typeof x === 'string' &&
                    VALID_SCOTLAND_LANDMARK_IDS.has(x) &&
                    Boolean(scotlandSpeakingReflectionStates?.[x]),
                ),
              ),
            )
          : undefined;
        if (scotlandCompletedSpeakingIds && scotlandCompletedSpeakingIds.length === 0) {
          scotlandCompletedSpeakingIds = undefined;
        }
        let scotlandPerformStarted =
          typeof entry.scotlandPerformStarted === 'boolean'
            ? entry.scotlandPerformStarted
            : undefined;
        let scotlandPerformSelectedEvidenceIds =
          missionId === SCOTLAND_MISSION_ID
            ? (sanitizeScotlandPerformSelectedEvidenceIds(
                entry.scotlandPerformSelectedEvidenceIds,
              ) as string[] | undefined)
            : undefined;
        let scotlandPerformOutline =
          missionId === SCOTLAND_MISSION_ID
            ? sanitizeScotlandPerformOutline(entry.scotlandPerformOutline)
            : undefined;
        let scotlandPerformSpeechPracticeMode =
          missionId === SCOTLAND_MISSION_ID &&
          isValidScotlandPerformPracticeMode(entry.scotlandPerformSpeechPracticeMode)
            ? entry.scotlandPerformSpeechPracticeMode
            : undefined;
        let scotlandPerformQuestionPracticeStates =
          missionId === SCOTLAND_MISSION_ID
            ? sanitizeScotlandPerformQaStates(entry.scotlandPerformQuestionPracticeStates)
            : undefined;
        let scotlandPerformReflectionState =
          missionId === SCOTLAND_MISSION_ID
            ? sanitizeScotlandPerformReflectionState(entry.scotlandPerformReflectionState)
            : undefined;
        let scotlandPerformCompleted =
          typeof entry.scotlandPerformCompleted === 'boolean'
            ? entry.scotlandPerformCompleted
            : undefined;
        const australiaExploredPoiIds =
          missionId === AUSTRALIA_MISSION_ID && Array.isArray(entry.australiaExploredPoiIds)
            ? Array.from(
                new Set(
                  entry.australiaExploredPoiIds.filter(
                    (x): x is string =>
                      typeof x === 'string' && VALID_AUSTRALIA_LANDMARK_IDS.has(x),
                  ),
                ),
              )
            : undefined;
        const australiaMetNpcIds =
          missionId === AUSTRALIA_MISSION_ID && Array.isArray(entry.australiaMetNpcIds)
            ? Array.from(
                new Set(
                  entry.australiaMetNpcIds.filter(
                    (x): x is string =>
                      typeof x === 'string' && VALID_AUSTRALIA_NPC_IDS.has(x),
                  ),
                ),
              )
            : undefined;
        const australiaDiscoverStarted =
          missionId === AUSTRALIA_MISSION_ID &&
          typeof entry.australiaDiscoverStarted === 'boolean'
            ? entry.australiaDiscoverStarted
            : undefined;
        let australiaPerformStarted: boolean | undefined;
        let australiaCompletedPerformIds: AustraliaLandmarkId[] | undefined;
        let australiaPerformEvidence:
          | Record<string, AustraliaPerformChallengeRecord>
          | undefined;
        let australiaPerformReflection: AustraliaPerformReflectionState | undefined;
        let australiaPerformCompleted: boolean | undefined;
        let australiaCompletedDiscoverIds: AustraliaLandmarkId[] | undefined;
        if (missionId === AUSTRALIA_MISSION_ID && australiaDiscoverStarted) {
          const rawSet = new Set(
            Array.isArray(entry.australiaCompletedDiscoverIds)
              ? entry.australiaCompletedDiscoverIds.filter(
                  (x): x is AustraliaLandmarkId =>
                    typeof x === 'string' && VALID_AUSTRALIA_LANDMARK_IDS.has(x),
                )
              : [],
          );
          const sequentialPrefix: AustraliaLandmarkId[] = [];
          for (const orderedId of AUSTRALIA_DISCOVER_MISSION_ORDER) {
            if (rawSet.has(orderedId)) {
              sequentialPrefix.push(orderedId);
            } else {
              break;
            }
          }
          if (sequentialPrefix.length > 0) {
            australiaCompletedDiscoverIds = sequentialPrefix;
          }
        }
        let australiaBuildStarted: boolean | undefined;
        let australiaCompletedBuildIds: AustraliaLandmarkId[] | undefined;
        let australiaBuiltDialogues: Record<string, string> | undefined;
        let australiaPracticeStarted: boolean | undefined;
        let australiaCompletedPracticeIds: AustraliaLandmarkId[] | undefined;
        let australiaPracticeEvidence:
          | Record<string, AustraliaSpeakingEvidenceRecord>
          | undefined;
        let completedAt = typeof entry.completedAt === 'string' ? entry.completedAt : undefined;
        let resolvedStage: LearningStageId = currentStage;
        let resolvedStatus: 'not_started' | 'in_progress' | 'completed' = status;
        let sanitizedCompletedIds = Array.isArray(entry.completedActivityIds)
          ? Array.from(new Set(completedActivityIds))
          : [];
        if (missionId === AUSTRALIA_MISSION_ID) {
          // Phase 4D: DISCOVER + BUILD + PRACTICE (5 sequential speaking missions) implemented; PERFORM stays unimplemented
          const legitDiscoverDone =
            Boolean(australiaDiscoverStarted) &&
            (australiaCompletedDiscoverIds?.length ?? 0) >=
              AUSTRALIA_DISCOVER_MISSION_ORDER.length &&
            sanitizedCompletedIds.includes(AUSTRALIA_DISCOVERY_ACTIVITY_ID);

          if (legitDiscoverDone) {
            australiaBuildStarted =
              typeof entry.australiaBuildStarted === 'boolean'
                ? entry.australiaBuildStarted
                : undefined;

            if (australiaBuildStarted) {
              const rawBuildSet = new Set(
                Array.isArray(entry.australiaCompletedBuildIds)
                  ? entry.australiaCompletedBuildIds.filter(
                      (x): x is AustraliaLandmarkId =>
                        typeof x === 'string' && VALID_AUSTRALIA_LANDMARK_IDS.has(x),
                    )
                  : [],
              );
              const buildSeq: AustraliaLandmarkId[] = [];
              for (const orderedId of AUSTRALIA_BUILD_MISSION_ORDER) {
                if (rawBuildSet.has(orderedId)) {
                  buildSeq.push(orderedId);
                } else {
                  break;
                }
              }
              if (buildSeq.length > 0) {
                australiaCompletedBuildIds = buildSeq;
              }
              if (
                entry.australiaBuiltDialogues &&
                typeof entry.australiaBuiltDialogues === 'object' &&
                !Array.isArray(entry.australiaBuiltDialogues)
              ) {
                const rawMap = entry.australiaBuiltDialogues as Record<string, unknown>;
                const nextDialogues: Record<string, string> = {};
                for (const id of buildSeq) {
                  const val = rawMap[id];
                  if (typeof val === 'string') {
                    const trimmed = val.trim();
                    if (trimmed.length >= 4 && trimmed.length <= 320) {
                      nextDialogues[id] = trimmed;
                    }
                  }
                }
                if (Object.keys(nextDialogues).length > 0) {
                  australiaBuiltDialogues = nextDialogues;
                }
              }
            }
          }

          const legitBuildDone =
            legitDiscoverDone &&
            Boolean(australiaBuildStarted) &&
            (australiaCompletedBuildIds?.length ?? 0) >=
              AUSTRALIA_BUILD_MISSION_ORDER.length &&
            sanitizedCompletedIds.includes(AUSTRALIA_BUILD_ACTIVITY_ID);

          if (legitBuildDone) {
            australiaPracticeStarted =
              typeof entry.australiaPracticeStarted === 'boolean'
                ? entry.australiaPracticeStarted
                : undefined;

            if (australiaPracticeStarted) {
              const rawPracticeSet = new Set(
                Array.isArray(entry.australiaCompletedPracticeIds)
                  ? entry.australiaCompletedPracticeIds.filter(
                      (x): x is AustraliaLandmarkId =>
                        typeof x === 'string' && VALID_AUSTRALIA_LANDMARK_IDS.has(x),
                    )
                  : [],
              );
              const rawEvidenceMap =
                entry.australiaPracticeEvidence &&
                typeof entry.australiaPracticeEvidence === 'object' &&
                !Array.isArray(entry.australiaPracticeEvidence)
                  ? (entry.australiaPracticeEvidence as Record<string, unknown>)
                  : {};
              const practiceSeq: AustraliaLandmarkId[] = [];
              const nextEvidence: Record<string, AustraliaSpeakingEvidenceRecord> = {};
              for (const orderedId of AUSTRALIA_PRACTICE_MISSION_ORDER) {
                if (!rawPracticeSet.has(orderedId)) {
                  break;
                }
                const spec = getAustraliaPracticeMissionSpec(orderedId);
                const validTurnIds = spec ? spec.turns.map((t) => t.turnId) : [];
                const cleanEvidence = sanitizeAustraliaSpeakingEvidenceRecord(
                  rawEvidenceMap[orderedId],
                  validTurnIds,
                );
                if (!cleanEvidence) {
                  break;
                }
                practiceSeq.push(orderedId);
                nextEvidence[orderedId] = cleanEvidence;
              }
              if (practiceSeq.length > 0) {
                australiaCompletedPracticeIds = practiceSeq;
              }
              if (Object.keys(nextEvidence).length > 0) {
                australiaPracticeEvidence = nextEvidence;
              }
            }
          }

          const legitPracticeDone =
            legitBuildDone &&
            Boolean(australiaPracticeStarted) &&
            (australiaCompletedPracticeIds?.length ?? 0) >=
              AUSTRALIA_PRACTICE_MISSION_ORDER.length &&
            sanitizedCompletedIds.includes(AUSTRALIA_PRACTICE_ACTIVITY_ID);

          if (legitPracticeDone) {
            australiaPerformStarted =
              typeof entry.australiaPerformStarted === 'boolean'
                ? entry.australiaPerformStarted
                : undefined;

            if (australiaPerformStarted) {
              const rawPerformSet = new Set(
                Array.isArray(entry.australiaCompletedPerformIds)
                  ? entry.australiaCompletedPerformIds.filter(
                      (x): x is AustraliaLandmarkId =>
                        typeof x === 'string' && VALID_AUSTRALIA_LANDMARK_IDS.has(x),
                    )
                  : [],
              );
              const rawPerformEvidenceMap =
                entry.australiaPerformEvidence &&
                typeof entry.australiaPerformEvidence === 'object' &&
                !Array.isArray(entry.australiaPerformEvidence)
                  ? (entry.australiaPerformEvidence as Record<string, unknown>)
                  : {};
              const performSeq: AustraliaLandmarkId[] = [];
              const nextPerformEvidence: Record<string, AustraliaPerformChallengeRecord> = {};
              for (const orderedId of AUSTRALIA_PERFORM_CHALLENGE_ORDER) {
                if (!rawPerformSet.has(orderedId)) {
                  break;
                }
                const challengeSpec = getAustraliaPerformChallengeSpec(orderedId);
                const validTurnIds = challengeSpec ? challengeSpec.turns.map((t) => t.turnId) : [];
                const cleanRecord = sanitizeAustraliaPerformChallengeRecord(
                  rawPerformEvidenceMap[orderedId],
                  validTurnIds,
                );
                if (!cleanRecord) {
                  break;
                }
                performSeq.push(orderedId);
                nextPerformEvidence[orderedId] = cleanRecord;
              }
              if (performSeq.length > 0) {
                australiaCompletedPerformIds = performSeq;
              }
              if (Object.keys(nextPerformEvidence).length > 0) {
                australiaPerformEvidence = nextPerformEvidence;
              }
              australiaPerformReflection = sanitizeAustraliaPerformReflectionState(
                entry.australiaPerformReflection,
              );
            }
          }

          const allPerformChallengesDone =
            (australiaCompletedPerformIds?.length ?? 0) >=
              AUSTRALIA_PERFORM_CHALLENGE_ORDER.length &&
            AUSTRALIA_PERFORM_CHALLENGE_ORDER.every((id) =>
              Boolean(australiaPerformEvidence?.[id]),
            );
          const rawHasPerformCompletion =
            sanitizedCompletedIds.includes(AUSTRALIA_PERFORM_ACTIVITY_ID) ||
            entry.australiaPerformCompleted === true ||
            status === 'completed';
          const legitPerformDone =
            legitPracticeDone &&
            Boolean(australiaPerformStarted) &&
            allPerformChallengesDone &&
            isValidAustraliaPerformReflectionState(australiaPerformReflection) &&
            rawHasPerformCompletion;

          australiaPerformCompleted = legitPerformDone ? true : undefined;

          sanitizedCompletedIds = legitPerformDone
            ? [
                AUSTRALIA_DISCOVERY_ACTIVITY_ID,
                AUSTRALIA_BUILD_ACTIVITY_ID,
                AUSTRALIA_PRACTICE_ACTIVITY_ID,
                AUSTRALIA_PERFORM_ACTIVITY_ID,
              ]
            : legitPracticeDone
              ? [
                  AUSTRALIA_DISCOVERY_ACTIVITY_ID,
                  AUSTRALIA_BUILD_ACTIVITY_ID,
                  AUSTRALIA_PRACTICE_ACTIVITY_ID,
                ]
              : legitBuildDone
                ? [AUSTRALIA_DISCOVERY_ACTIVITY_ID, AUSTRALIA_BUILD_ACTIVITY_ID]
                : legitDiscoverDone
                  ? [AUSTRALIA_DISCOVERY_ACTIVITY_ID]
                  : [];

          completedAt = legitPerformDone ? completedAt ?? defaults.updatedAt : undefined;
          resolvedStage = legitPracticeDone
            ? 'perform'
            : legitBuildDone
              ? 'practice'
              : legitDiscoverDone
                ? 'build'
                : 'discover';
          const hasAustraliaActivity =
            legitPerformDone ||
            legitPracticeDone ||
            legitBuildDone ||
            legitDiscoverDone ||
            Boolean(australiaPerformStarted) ||
            Boolean(australiaPracticeStarted) ||
            Boolean(australiaBuildStarted) ||
            Boolean(australiaDiscoverStarted) ||
            Boolean(australiaExploredPoiIds && australiaExploredPoiIds.length > 0) ||
            Boolean(australiaMetNpcIds && australiaMetNpcIds.length > 0) ||
            status === 'in_progress';
          resolvedStatus = legitPerformDone
            ? 'completed'
            : hasAustraliaActivity
              ? 'in_progress'
              : 'not_started';
        }
        const egyptEntered =
          missionId === EGYPT_MISSION_ID && typeof entry.egyptEntered === 'boolean'
            ? entry.egyptEntered
            : undefined;
        const egyptExploredPoiIds =
          missionId === EGYPT_MISSION_ID && Array.isArray(entry.egyptExploredPoiIds)
            ? Array.from(
                new Set(
                  entry.egyptExploredPoiIds.filter(
                    (x): x is string =>
                      typeof x === 'string' && VALID_EGYPT_LANDMARK_IDS.has(x),
                  ),
                ),
              )
            : undefined;
        const egyptMetNpcIds =
          missionId === EGYPT_MISSION_ID && Array.isArray(entry.egyptMetNpcIds)
            ? Array.from(
                new Set(
                  entry.egyptMetNpcIds.filter(
                    (x): x is string => typeof x === 'string' && VALID_EGYPT_NPC_IDS.has(x),
                  ),
                ),
              )
            : undefined;
        let egyptDiscoverStarted =
          missionId === EGYPT_MISSION_ID && typeof entry.egyptDiscoverStarted === 'boolean'
            ? entry.egyptDiscoverStarted
            : undefined;
        let egyptCompletedDiscoverIds =
          missionId === EGYPT_MISSION_ID && Array.isArray(entry.egyptCompletedDiscoverIds)
            ? getSequentialEgyptDiscoverPrefix(
                entry.egyptCompletedDiscoverIds.filter((x): x is string => typeof x === 'string'),
              )
            : undefined;
        let egyptBuildStarted: boolean | undefined;
        let egyptCompletedBuildChallengeIds: string[] | undefined;
        let egyptCompletedBuildIds: EgyptLandmarkId[] | undefined;
        let egyptBuildJournal: EgyptInstructionJournalRecord[] | undefined;
        if (missionId === EGYPT_MISSION_ID) {
          if (!egyptDiscoverStarted) {
            egyptDiscoverStarted = false;
            egyptCompletedDiscoverIds = undefined;
          }
          const discoverCount = egyptCompletedDiscoverIds?.length ?? 0;
          const rawHasDiscover = sanitizedCompletedIds.includes(EGYPT_DISCOVERY_ACTIVITY_ID);
          const legitDiscoverDone =
            Boolean(egyptDiscoverStarted) &&
            discoverCount >= EGYPT_DISCOVER_MISSION_ORDER.length &&
            rawHasDiscover;

          if (legitDiscoverDone) {
            egyptBuildStarted =
              typeof entry.egyptBuildStarted === 'boolean' ? entry.egyptBuildStarted : undefined;
            if (egyptBuildStarted) {
              const rawSolvedChallenges = Array.isArray(entry.egyptCompletedBuildChallengeIds)
                ? Array.from(
                    new Set(
                      entry.egyptCompletedBuildChallengeIds.filter(
                        (x): x is string =>
                          typeof x === 'string' && VALID_EGYPT_BUILD_CHALLENGE_ID_SET.has(x),
                      ),
                    ),
                  )
                : [];
              const solvedChallengeSet = new Set(rawSolvedChallenges);
              if (rawSolvedChallenges.length > 0) {
                egyptCompletedBuildChallengeIds = rawSolvedChallenges;
              }
              const rawBuildSet = new Set(
                Array.isArray(entry.egyptCompletedBuildIds)
                  ? entry.egyptCompletedBuildIds.filter(
                      (x): x is EgyptLandmarkId =>
                        typeof x === 'string' && VALID_EGYPT_LANDMARK_IDS.has(x),
                    )
                  : [],
              );
              const buildSeq: EgyptLandmarkId[] = [];
              for (const orderedId of EGYPT_BUILD_MISSION_ORDER) {
                const requiredGameChallenges = getEgyptBuildGameChallengeIds(orderedId);
                const allGameChallengesSolved =
                  requiredGameChallenges.length > 0 &&
                  requiredGameChallenges.every((cid) => solvedChallengeSet.has(cid));
                if (rawBuildSet.has(orderedId) && allGameChallengesSolved) {
                  buildSeq.push(orderedId);
                } else {
                  break;
                }
              }
              if (buildSeq.length > 0) {
                egyptCompletedBuildIds = buildSeq;
              }
              const cleanedJournal = sanitizeEgyptBuildJournal(entry.egyptBuildJournal)?.filter(
                (rec) => solvedChallengeSet.has(rec.challengeId),
              );
              if (cleanedJournal && cleanedJournal.length > 0) {
                egyptBuildJournal = cleanedJournal;
              }
            } else {
              egyptBuildStarted = false;
            }
          } else {
            egyptBuildStarted = undefined;
          }

          const solvedChallengeSet = new Set(egyptCompletedBuildChallengeIds ?? []);
          const allBuildChallengesDone = ALL_EGYPT_BUILD_CHALLENGE_IDS.every((cid) =>
            solvedChallengeSet.has(cid),
          );
          const rawHasBuild = sanitizedCompletedIds.includes(EGYPT_BUILD_ACTIVITY_ID);
          const legitBuildDone =
            legitDiscoverDone &&
            Boolean(egyptBuildStarted) &&
            (egyptCompletedBuildIds?.length ?? 0) >= EGYPT_BUILD_MISSION_ORDER.length &&
            allBuildChallengesDone &&
            rawHasBuild;

          sanitizedCompletedIds = legitBuildDone
            ? [EGYPT_DISCOVERY_ACTIVITY_ID, EGYPT_BUILD_ACTIVITY_ID]
            : legitDiscoverDone
              ? [EGYPT_DISCOVERY_ACTIVITY_ID]
              : [];
          completedAt = undefined;
          resolvedStage = legitBuildDone ? 'practice' : legitDiscoverDone ? 'build' : 'discover';
          const hasEgyptActivity = Boolean(
            egyptEntered ||
              egyptDiscoverStarted ||
              (egyptExploredPoiIds && egyptExploredPoiIds.length > 0) ||
              (egyptMetNpcIds && egyptMetNpcIds.length > 0) ||
              discoverCount > 0 ||
              legitDiscoverDone ||
              egyptBuildStarted ||
              (egyptCompletedBuildChallengeIds && egyptCompletedBuildChallengeIds.length > 0) ||
              (egyptCompletedBuildIds && egyptCompletedBuildIds.length > 0) ||
              legitBuildDone,
          );
          resolvedStatus = hasEgyptActivity ? 'in_progress' : 'not_started';
        }
        if (missionId === JAIPUR_MISSION_ID) {
          if (sanitizedCompletedIds.includes(FINAL_JAIPUR_SHOWCASE_ACTIVITY_ID)) {
            resolvedStage = 'perform';
            resolvedStatus = 'completed';
          } else if (sanitizedCompletedIds.includes(SPOT_AND_SPEAK_ACTIVITY_ID)) {
            resolvedStage = 'perform';
          } else if (
            sanitizedCompletedIds.includes(SENTENCE_TRAIN_ACTIVITY_ID) &&
            (resolvedStage === 'discover' || resolvedStage === 'build')
          ) {
            resolvedStage = 'practice';
          } else if (
            sanitizedCompletedIds.includes(WORD_DETECTIVE_ACTIVITY_ID) &&
            resolvedStage === 'discover'
          ) {
            resolvedStage = 'build';
          }
        } else if (missionId === KENYA_MISSION_ID) {
          const hasDiscovery = sanitizedCompletedIds.includes(KENYA_DISCOVERY_ACTIVITY_ID);
          if (!hasDiscovery) {
            sanitizedCompletedIds = sanitizedCompletedIds.filter(
              (id) =>
                id !== KENYA_BUILD_ACTIVITY_ID &&
                id !== KENYA_PRACTICE_ACTIVITY_ID &&
                id !== KENYA_PERFORM_ACTIVITY_ID,
            );
            kenyaBuildStarted = false;
            kenyaBuiltSentences = undefined;
            kenyaPracticeStarted = false;
            kenyaPracticedConversationIds = undefined;
            kenyaPerformStarted = false;
            completedAt = undefined;
            resolvedStage = 'discover';
            if (resolvedStatus === 'completed') resolvedStatus = 'in_progress';
          } else {
            const builtCount = kenyaBuiltSentences
              ? Object.keys(kenyaBuiltSentences).length
              : 0;
            if (
              sanitizedCompletedIds.includes(KENYA_BUILD_ACTIVITY_ID) &&
              builtCount < KENYA_BUILD_STATIONS.length
            ) {
              sanitizedCompletedIds = sanitizedCompletedIds.filter(
                (id) =>
                  id !== KENYA_BUILD_ACTIVITY_ID &&
                  id !== KENYA_PRACTICE_ACTIVITY_ID &&
                  id !== KENYA_PERFORM_ACTIVITY_ID,
              );
            }
            const hasBuild = sanitizedCompletedIds.includes(KENYA_BUILD_ACTIVITY_ID);
            if (!hasBuild) {
              sanitizedCompletedIds = sanitizedCompletedIds.filter(
                (id) =>
                  id !== KENYA_PRACTICE_ACTIVITY_ID && id !== KENYA_PERFORM_ACTIVITY_ID,
              );
              kenyaPracticeStarted = false;
              kenyaPracticedConversationIds = undefined;
              kenyaPerformStarted = false;
              completedAt = undefined;
              resolvedStage = 'build';
              if (resolvedStatus === 'completed') resolvedStatus = 'in_progress';
            } else {
              const practicedCount = kenyaPracticedConversationIds?.length ?? 0;
              if (
                sanitizedCompletedIds.includes(KENYA_PRACTICE_ACTIVITY_ID) &&
                practicedCount < KENYA_PRACTICE_CONVERSATIONS.length
              ) {
                sanitizedCompletedIds = sanitizedCompletedIds.filter(
                  (id) =>
                    id !== KENYA_PRACTICE_ACTIVITY_ID && id !== KENYA_PERFORM_ACTIVITY_ID,
                );
              }
              const hasPractice = sanitizedCompletedIds.includes(KENYA_PRACTICE_ACTIVITY_ID);
              if (!hasPractice) {
                sanitizedCompletedIds = sanitizedCompletedIds.filter(
                  (id) => id !== KENYA_PERFORM_ACTIVITY_ID,
                );
                kenyaPerformStarted = false;
                completedAt = undefined;
                resolvedStage = 'practice';
                if (resolvedStatus === 'completed') resolvedStatus = 'in_progress';
              } else if (sanitizedCompletedIds.includes(KENYA_PERFORM_ACTIVITY_ID)) {
                resolvedStage = 'perform';
                resolvedStatus = 'completed';
                kenyaPerformStarted = true;
              } else {
                resolvedStage = 'perform';
                resolvedStatus = 'in_progress';
                completedAt = undefined;
              }
            }
          }
        } else if (missionId === SCOTLAND_MISSION_ID) {
          // Validate Scotland DISCOVER + BUILD + PRACTICE + Stage 4 PERFORM
          if (!scotlandDiscoverStarted) {
            scotlandDiscoverStarted = false;
            scotlandDiscoveredEvidenceIds = undefined;
          }
          const evidenceCount = scotlandDiscoveredEvidenceIds?.length ?? 0;
          const rawHasDiscover =
            sanitizedCompletedIds.includes(SCOTLAND_DISCOVERY_ACTIVITY_ID) ||
            sanitizedCompletedIds.includes('scotland_culture_discovery');
          const legitDiscoverDone =
            Boolean(scotlandDiscoverStarted) &&
            evidenceCount >= SCOTLAND_EVIDENCE_ITEMS.length &&
            rawHasDiscover;

          const clearPerformFields = () => {
            scotlandPerformStarted = false;
            scotlandPerformSelectedEvidenceIds = undefined;
            scotlandPerformOutline = undefined;
            scotlandPerformSpeechPracticeMode = undefined;
            scotlandPerformQuestionPracticeStates = undefined;
            scotlandPerformReflectionState = undefined;
            scotlandPerformCompleted = undefined;
          };

          let legitPerformDone = false;

          if (!legitDiscoverDone) {
            sanitizedCompletedIds = [];
            scotlandBuildStarted = false;
            scotlandBuiltSentences = undefined;
            scotlandPracticeStarted = false;
            scotlandCompletedSpeakingIds = undefined;
            scotlandSpeakingReflectionStates = undefined;
            clearPerformFields();
            completedAt = undefined;
            resolvedStage = 'discover';
          } else {
            if (!scotlandBuildStarted) {
              scotlandBuildStarted = false;
              scotlandBuiltSentences = undefined;
            }
            const builtCount = scotlandBuiltSentences
              ? Object.keys(scotlandBuiltSentences).length
              : 0;
            const rawHasBuild = sanitizedCompletedIds.includes(SCOTLAND_BUILD_ACTIVITY_ID);
            const legitBuildDone =
              Boolean(scotlandBuildStarted) &&
              builtCount >= SCOTLAND_BUILD_STATIONS.length &&
              rawHasBuild;

            if (!legitBuildDone) {
              sanitizedCompletedIds = [SCOTLAND_DISCOVERY_ACTIVITY_ID];
              scotlandPracticeStarted = false;
              scotlandCompletedSpeakingIds = undefined;
              scotlandSpeakingReflectionStates = undefined;
              clearPerformFields();
              completedAt = undefined;
              resolvedStage = 'build';
            } else {
              if (!scotlandPracticeStarted) {
                scotlandPracticeStarted = false;
                scotlandCompletedSpeakingIds = undefined;
                scotlandSpeakingReflectionStates = undefined;
              }
              const practiceCount = scotlandCompletedSpeakingIds?.length ?? 0;
              const rawHasPractice = sanitizedCompletedIds.includes(SCOTLAND_PRACTICE_ACTIVITY_ID);
              const legitPracticeDone =
                Boolean(scotlandPracticeStarted) &&
                practiceCount >= SCOTLAND_PRACTICE_MISSIONS.length &&
                rawHasPractice;

              if (!legitPracticeDone) {
                sanitizedCompletedIds = [SCOTLAND_DISCOVERY_ACTIVITY_ID, SCOTLAND_BUILD_ACTIVITY_ID];
                clearPerformFields();
                completedAt = undefined;
                resolvedStage = 'practice';
              } else {
                if (!scotlandPerformStarted) {
                  clearPerformFields();
                }
                const rawHasPerform =
                  sanitizedCompletedIds.includes(SCOTLAND_PERFORM_ACTIVITY_ID) ||
                  Boolean(scotlandPerformCompleted);
                legitPerformDone =
                  Boolean(scotlandPerformStarted) &&
                  rawHasPerform &&
                  areValidScotlandPerformEvidenceIds(scotlandPerformSelectedEvidenceIds) &&
                  isValidScotlandPerformOutline(scotlandPerformOutline) &&
                  isValidScotlandPerformPracticeMode(scotlandPerformSpeechPracticeMode) &&
                  areValidScotlandPerformQaStates(scotlandPerformQuestionPracticeStates) &&
                  isValidScotlandPerformReflectionState(scotlandPerformReflectionState);

                if (legitPerformDone) {
                  sanitizedCompletedIds = [
                    SCOTLAND_DISCOVERY_ACTIVITY_ID,
                    SCOTLAND_BUILD_ACTIVITY_ID,
                    SCOTLAND_PRACTICE_ACTIVITY_ID,
                    SCOTLAND_PERFORM_ACTIVITY_ID,
                  ];
                  scotlandPerformStarted = true;
                  scotlandPerformCompleted = true;
                  resolvedStage = 'perform';
                  completedAt = completedAt ?? defaults.updatedAt;
                } else {
                  sanitizedCompletedIds = [
                    SCOTLAND_DISCOVERY_ACTIVITY_ID,
                    SCOTLAND_BUILD_ACTIVITY_ID,
                    SCOTLAND_PRACTICE_ACTIVITY_ID,
                  ];
                  scotlandPerformCompleted = undefined;
                  completedAt = undefined;
                  resolvedStage = 'perform';
                }
              }
            }
          }

          resolvedStatus = legitPerformDone
            ? 'completed'
            : legitDiscoverDone ||
                scotlandDiscoverStarted ||
                scotlandBuildStarted ||
                scotlandPracticeStarted ||
                scotlandPerformStarted ||
                metEilidh ||
                metFiona ||
                (scotlandExploredPoiIds && scotlandExploredPoiIds.length > 0) ||
                evidenceCount > 0
              ? 'in_progress'
              : 'not_started';
        }
        sanitized[missionId] = {
          status: resolvedStatus,
          currentStage: resolvedStage,
          completedActivityIds: sanitizedCompletedIds,
          ...(wordDetectiveFoundIds ? { wordDetectiveFoundIds } : {}),
          ...(metAarav !== undefined ? { metAarav } : {}),
          ...(spotAndSpeakStarted !== undefined ? { spotAndSpeakStarted } : {}),
          ...(spotAndSpeakDoneIds ? { spotAndSpeakDoneIds } : {}),
          ...(kenyaDiscoverStarted !== undefined ? { kenyaDiscoverStarted } : {}),
          ...(kenyaDiscoveredIds ? { kenyaDiscoveredIds } : {}),
          ...(kenyaBuildStarted !== undefined ? { kenyaBuildStarted } : {}),
          ...(kenyaBuiltSentences ? { kenyaBuiltSentences } : {}),
          ...(kenyaPracticeStarted !== undefined ? { kenyaPracticeStarted } : {}),
          ...(kenyaPracticedConversationIds ? { kenyaPracticedConversationIds } : {}),
          ...(kenyaPerformStarted !== undefined ? { kenyaPerformStarted } : {}),
          ...(metEilidh !== undefined ? { metEilidh } : {}),
          ...(metFiona !== undefined ? { metFiona } : {}),
          ...(scotlandExploredPoiIds ? { scotlandExploredPoiIds } : {}),
          ...(scotlandDiscoverStarted !== undefined ? { scotlandDiscoverStarted } : {}),
          ...(scotlandDiscoveredEvidenceIds ? { scotlandDiscoveredEvidenceIds } : {}),
          ...(scotlandBuildStarted !== undefined ? { scotlandBuildStarted } : {}),
          ...(scotlandBuiltSentences ? { scotlandBuiltSentences } : {}),
          ...(scotlandPracticeStarted !== undefined ? { scotlandPracticeStarted } : {}),
          ...(scotlandCompletedSpeakingIds ? { scotlandCompletedSpeakingIds } : {}),
          ...(scotlandSpeakingReflectionStates ? { scotlandSpeakingReflectionStates } : {}),
          ...(scotlandPerformStarted !== undefined ? { scotlandPerformStarted } : {}),
          ...(scotlandPerformSelectedEvidenceIds
            ? { scotlandPerformSelectedEvidenceIds }
            : {}),
          ...(scotlandPerformOutline ? { scotlandPerformOutline } : {}),
          ...(scotlandPerformSpeechPracticeMode ? { scotlandPerformSpeechPracticeMode } : {}),
          ...(scotlandPerformQuestionPracticeStates
            ? { scotlandPerformQuestionPracticeStates }
            : {}),
          ...(scotlandPerformReflectionState ? { scotlandPerformReflectionState } : {}),
          ...(scotlandPerformCompleted !== undefined ? { scotlandPerformCompleted } : {}),
          ...(australiaExploredPoiIds && australiaExploredPoiIds.length > 0
            ? { australiaExploredPoiIds }
            : {}),
          ...(australiaMetNpcIds && australiaMetNpcIds.length > 0 ? { australiaMetNpcIds } : {}),
          ...(australiaDiscoverStarted ? { australiaDiscoverStarted } : {}),
          ...(australiaCompletedDiscoverIds && australiaCompletedDiscoverIds.length > 0
            ? { australiaCompletedDiscoverIds }
            : {}),
          ...(australiaBuildStarted ? { australiaBuildStarted } : {}),
          ...(australiaCompletedBuildIds && australiaCompletedBuildIds.length > 0
            ? { australiaCompletedBuildIds }
            : {}),
          ...(australiaBuiltDialogues && Object.keys(australiaBuiltDialogues).length > 0
            ? { australiaBuiltDialogues }
            : {}),
          ...(australiaPracticeStarted ? { australiaPracticeStarted } : {}),
          ...(australiaCompletedPracticeIds && australiaCompletedPracticeIds.length > 0
            ? { australiaCompletedPracticeIds }
            : {}),
          ...(australiaPracticeEvidence && Object.keys(australiaPracticeEvidence).length > 0
            ? { australiaPracticeEvidence }
            : {}),
          ...(australiaPerformStarted ? { australiaPerformStarted } : {}),
          ...(australiaCompletedPerformIds && australiaCompletedPerformIds.length > 0
            ? { australiaCompletedPerformIds }
            : {}),
          ...(australiaPerformEvidence && Object.keys(australiaPerformEvidence).length > 0
            ? { australiaPerformEvidence }
            : {}),
          ...(australiaPerformReflection ? { australiaPerformReflection } : {}),
          ...(australiaPerformCompleted !== undefined ? { australiaPerformCompleted } : {}),
          ...(egyptEntered ? { egyptEntered } : {}),
          ...(egyptExploredPoiIds && egyptExploredPoiIds.length > 0
            ? { egyptExploredPoiIds }
            : {}),
          ...(egyptMetNpcIds && egyptMetNpcIds.length > 0 ? { egyptMetNpcIds } : {}),
          ...(egyptDiscoverStarted ? { egyptDiscoverStarted } : {}),
          ...(egyptCompletedDiscoverIds && egyptCompletedDiscoverIds.length > 0
            ? { egyptCompletedDiscoverIds }
            : {}),
          ...(egyptBuildStarted ? { egyptBuildStarted } : {}),
          ...(egyptCompletedBuildChallengeIds && egyptCompletedBuildChallengeIds.length > 0
            ? { egyptCompletedBuildChallengeIds }
            : {}),
          ...(egyptCompletedBuildIds && egyptCompletedBuildIds.length > 0
            ? { egyptCompletedBuildIds }
            : {}),
          ...(egyptBuildJournal && egyptBuildJournal.length > 0 ? { egyptBuildJournal } : {}),
          ...(completedAt ? { completedAt } : {}),
        };
      }
    }

    // Strict gating: Scotland mission cannot advance or complete unless Kenya PERFORM is legitimately completed
    const kenyaCompletedLegit = Boolean(
      sanitized[KENYA_MISSION_ID]?.completedActivityIds.includes(KENYA_PERFORM_ACTIVITY_ID),
    );
    if (!kenyaCompletedLegit && sanitized[SCOTLAND_MISSION_ID]) {
      sanitized[SCOTLAND_MISSION_ID] = {
        status: 'not_started',
        currentStage: 'discover',
        completedActivityIds: [],
      };
    }

    return sanitized;
  })();

  const indiaCompletedLegit = Boolean(
    sanitizedMissionProgress[JAIPUR_MISSION_ID]?.completedActivityIds.includes(
      FINAL_JAIPUR_SHOWCASE_ACTIVITY_ID,
    ),
  );
  const kenyaPerformLegitCompleted = Boolean(
    sanitizedMissionProgress[KENYA_MISSION_ID]?.completedActivityIds.includes(
      KENYA_PERFORM_ACTIVITY_ID,
    ),
  );
  const scotlandPerformLegitCompleted = Boolean(
    sanitizedMissionProgress[SCOTLAND_MISSION_ID]?.completedActivityIds.includes(
      SCOTLAND_PERFORM_ACTIVITY_ID,
    ),
  );
  const australiaPerformLegitCompleted = Boolean(
    sanitizedMissionProgress[AUSTRALIA_MISSION_ID]?.completedActivityIds.includes(
      AUSTRALIA_PERFORM_ACTIVITY_ID,
    ),
  );
  const rawStamps = Array.isArray(rawRewards.stamps)
    ? Array.from(new Set(rawRewards.stamps.filter((x): x is string => typeof x === 'string')))
    : [];
  const afterKenyaStamps = kenyaPerformLegitCompleted
    ? rawStamps
    : rawStamps.filter((s) => s !== KENYA_PASSPORT_STAMP_ID);
  const afterScotlandStamps = scotlandPerformLegitCompleted
    ? afterKenyaStamps
    : afterKenyaStamps.filter((s) => s !== SCOTLAND_PASSPORT_STAMP_ID);

  const australiaLegitUnlocked =
    indiaCompletedLegit &&
    kenyaPerformLegitCompleted &&
    scotlandPerformLegitCompleted &&
    afterScotlandStamps.includes(SCOTLAND_PASSPORT_STAMP_ID);

  const sanitizedStamps = (
    australiaLegitUnlocked && australiaPerformLegitCompleted
      ? afterScotlandStamps
      : afterScotlandStamps.filter((s) => s !== AUSTRALIA_PASSPORT_STAMP_ID)
  ).filter(
    (s) =>
      s !== 'stamp_australia_harbour' &&
      s !== EGYPT_PASSPORT_STAMP_ID &&
      s !== 'stamp_egypt_echoes',
  );

  if (!australiaLegitUnlocked && sanitizedMissionProgress[AUSTRALIA_MISSION_ID]) {
    sanitizedMissionProgress[AUSTRALIA_MISSION_ID] = {
      status: 'not_started',
      currentStage: 'discover',
      completedActivityIds: [],
    };
  }

  const egyptLegitUnlocked =
    australiaLegitUnlocked &&
    australiaPerformLegitCompleted &&
    sanitizedStamps.includes(AUSTRALIA_PASSPORT_STAMP_ID);

  // Preserve legitimate Egypt progress if a learner reached Stage 4 PERFORM in Australia under an
  // earlier premature-Egypt bug; otherwise scrub unauthorized/spoofed Egypt entries.
  const hasAustraliaPerformHistory =
    australiaLegitUnlocked &&
    Boolean(sanitizedMissionProgress[AUSTRALIA_MISSION_ID]?.australiaPerformStarted);
  if (!egyptLegitUnlocked && !hasAustraliaPerformHistory && sanitizedMissionProgress[EGYPT_MISSION_ID]) {
    sanitizedMissionProgress[EGYPT_MISSION_ID] = {
      status: 'not_started',
      currentStage: 'discover',
      completedActivityIds: [],
    };
  }

  const sanitizedUnlockedCountries = (() => {
    const set = new Set<CountryId>(
      unlockedCountryIds.length > 0 ? unlockedCountryIds : defaults.unlockedCountryIds,
    );
    set.add('india');
    if (kenyaPerformLegitCompleted) {
      set.add('kenya');
      set.add('scotland');
    } else {
      set.delete('scotland');
    }
    if (australiaLegitUnlocked) {
      set.add('australia');
    } else {
      set.delete('australia');
    }
    if (egyptLegitUnlocked) {
      set.add('egypt');
    } else {
      set.delete('egypt');
    }
    return Array.from(set);
  })();

  const sanitizedReplayState: CountryReplayState = (() => {
    const activeAttempts: Partial<Record<CountryId, CountryReplayAttempt>> = {};
    const history: Partial<Record<CountryId, CountryReplayHistoryRecord>> = {};
    const rawReplay = isRecord(raw.replayState) ? raw.replayState : {};

    if (isRecord(rawReplay.history)) {
      for (const [rawCountryId, rawRecord] of Object.entries(rawReplay.history)) {
        if (!VALID_COUNTRIES.includes(rawCountryId as CountryId) || !isRecord(rawRecord)) continue;
        const countryId = rawCountryId as CountryId;
        const totalAttemptsStarted =
          typeof rawRecord.totalAttemptsStarted === 'number' &&
          Number.isFinite(rawRecord.totalAttemptsStarted) &&
          rawRecord.totalAttemptsStarted >= 0
            ? Math.floor(rawRecord.totalAttemptsStarted)
            : 0;
        const rawCompletedCount =
          typeof rawRecord.completedReplayCount === 'number' &&
          Number.isFinite(rawRecord.completedReplayCount) &&
          rawRecord.completedReplayCount >= 0
            ? Math.floor(rawRecord.completedReplayCount)
            : 0;
        const completedReplayCount = Math.min(rawCompletedCount, totalAttemptsStarted);
        if (totalAttemptsStarted === 0 && completedReplayCount === 0) continue;
        history[countryId] = {
          totalAttemptsStarted,
          completedReplayCount,
          ...(typeof rawRecord.lastAttemptStartedAt === 'string'
            ? { lastAttemptStartedAt: rawRecord.lastAttemptStartedAt }
            : {}),
          ...(typeof rawRecord.lastReplayCompletedAt === 'string'
            ? { lastReplayCompletedAt: rawRecord.lastReplayCompletedAt }
            : {}),
        };
      }
    }

    if (isRecord(rawReplay.activeAttempts)) {
      for (const [rawCountryId, rawAttempt] of Object.entries(rawReplay.activeAttempts)) {
        if (!VALID_COUNTRIES.includes(rawCountryId as CountryId) || !isRecord(rawAttempt)) continue;
        const countryId = rawCountryId as CountryId;
        const capability = COUNTRY_REPLAY_CAPABILITIES[countryId];
        if (!capability.isImplemented) continue;
        if (countryId === 'scotland' && !kenyaPerformLegitCompleted) continue;
        if (countryId === 'australia' && !australiaLegitUnlocked) continue;

        const attemptNumber =
          typeof rawAttempt.attemptNumber === 'number' &&
          Number.isFinite(rawAttempt.attemptNumber) &&
          rawAttempt.attemptNumber >= 1
            ? Math.floor(rawAttempt.attemptNumber)
            : 1;
        const startedAt =
          typeof rawAttempt.startedAt === 'string'
            ? rawAttempt.startedAt
            : defaults.updatedAt;
        let completedAt =
          typeof rawAttempt.completedAt === 'string' ? rawAttempt.completedAt : undefined;
        let completedIds = Array.isArray(rawAttempt.completedActivityIds)
          ? Array.from(
              new Set(rawAttempt.completedActivityIds.filter((x): x is string => typeof x === 'string')),
            )
          : [];

        if (countryId === 'india') {
          const wordDetectiveFoundIds = Array.isArray(rawAttempt.wordDetectiveFoundIds)
            ? Array.from(
                new Set(
                  rawAttempt.wordDetectiveFoundIds.filter(
                    (x): x is string => typeof x === 'string' && VALID_JAIPUR_VOCAB_IDS.has(x),
                  ),
                ),
              )
            : undefined;
          const metAarav = typeof rawAttempt.metAarav === 'boolean' ? rawAttempt.metAarav : undefined;
          let spotAndSpeakStarted =
            typeof rawAttempt.spotAndSpeakStarted === 'boolean'
              ? rawAttempt.spotAndSpeakStarted
              : undefined;
          let spotAndSpeakDoneIds = Array.isArray(rawAttempt.spotAndSpeakDoneIds)
            ? Array.from(
                new Set(
                  rawAttempt.spotAndSpeakDoneIds.filter(
                    (x): x is string => typeof x === 'string' && VALID_JAIPUR_VOCAB_IDS.has(x),
                  ),
                ),
              )
            : undefined;

          const hasDiscover =
            completedIds.includes(WORD_DETECTIVE_ACTIVITY_ID) &&
            (wordDetectiveFoundIds?.length ?? 0) >= JAIPUR_VOCAB_OBJECTS.length;
          let resolvedStage: LearningStageId = 'discover';
          let resolvedStatus: 'in_progress' | 'completed' = 'in_progress';

          if (!hasDiscover) {
            completedIds = [];
            spotAndSpeakStarted = false;
            spotAndSpeakDoneIds = undefined;
            completedAt = undefined;
          } else {
            const hasBuild = completedIds.includes(SENTENCE_TRAIN_ACTIVITY_ID);
            if (!hasBuild) {
              completedIds = [WORD_DETECTIVE_ACTIVITY_ID];
              spotAndSpeakStarted = false;
              spotAndSpeakDoneIds = undefined;
              completedAt = undefined;
              resolvedStage = 'build';
            } else {
              const hasPractice =
                completedIds.includes(SPOT_AND_SPEAK_ACTIVITY_ID) &&
                (spotAndSpeakDoneIds?.length ?? 0) >= JAIPUR_VOCAB_OBJECTS.length;
              if (!hasPractice) {
                completedIds = [WORD_DETECTIVE_ACTIVITY_ID, SENTENCE_TRAIN_ACTIVITY_ID];
                completedAt = undefined;
                resolvedStage = 'practice';
              } else if (completedIds.includes(FINAL_JAIPUR_SHOWCASE_ACTIVITY_ID)) {
                completedIds = [
                  WORD_DETECTIVE_ACTIVITY_ID,
                  SENTENCE_TRAIN_ACTIVITY_ID,
                  SPOT_AND_SPEAK_ACTIVITY_ID,
                  FINAL_JAIPUR_SHOWCASE_ACTIVITY_ID,
                ];
                resolvedStage = 'perform';
                resolvedStatus = 'completed';
                completedAt = completedAt ?? defaults.updatedAt;
              } else {
                completedIds = [
                  WORD_DETECTIVE_ACTIVITY_ID,
                  SENTENCE_TRAIN_ACTIVITY_ID,
                  SPOT_AND_SPEAK_ACTIVITY_ID,
                ];
                completedAt = undefined;
                resolvedStage = 'perform';
              }
            }
          }

          activeAttempts.india = {
            countryId: 'india',
            attemptNumber,
            status: resolvedStatus,
            currentStage: resolvedStage,
            completedActivityIds: completedIds,
            startedAt,
            ...(completedAt ? { completedAt } : {}),
            ...(wordDetectiveFoundIds ? { wordDetectiveFoundIds } : {}),
            ...(metAarav !== undefined ? { metAarav } : {}),
            ...(spotAndSpeakStarted !== undefined ? { spotAndSpeakStarted } : {}),
            ...(spotAndSpeakDoneIds ? { spotAndSpeakDoneIds } : {}),
          };
        } else if (countryId === 'kenya') {
          let kenyaDiscoverStarted =
            typeof rawAttempt.kenyaDiscoverStarted === 'boolean'
              ? rawAttempt.kenyaDiscoverStarted
              : undefined;
          let kenyaDiscoveredIds = Array.isArray(rawAttempt.kenyaDiscoveredIds)
            ? Array.from(
                new Set(
                  rawAttempt.kenyaDiscoveredIds.filter(
                    (x): x is string => typeof x === 'string' && VALID_KENYA_LANDMARK_IDS.has(x),
                  ),
                ),
              )
            : undefined;
          let kenyaBuildStarted =
            typeof rawAttempt.kenyaBuildStarted === 'boolean'
              ? rawAttempt.kenyaBuildStarted
              : undefined;
          let kenyaBuiltSentences: Record<string, string> | undefined;
          if (isRecord(rawAttempt.kenyaBuiltSentences)) {
            const validMap: Record<string, string> = {};
            for (const [stationKey, rawSentence] of Object.entries(rawAttempt.kenyaBuiltSentences)) {
              if (
                VALID_KENYA_LANDMARK_IDS.has(stationKey) &&
                isValidSavedKenyaBuildSentence(stationKey as KenyaLandmarkId, rawSentence)
              ) {
                validMap[stationKey] = rawSentence.trim();
              }
            }
            if (Object.keys(validMap).length > 0) {
              kenyaBuiltSentences = validMap;
            }
          }
          let kenyaPracticeStarted =
            typeof rawAttempt.kenyaPracticeStarted === 'boolean'
              ? rawAttempt.kenyaPracticeStarted
              : undefined;
          let kenyaPracticedConversationIds = Array.isArray(
            rawAttempt.kenyaPracticedConversationIds,
          )
            ? Array.from(
                new Set(
                  rawAttempt.kenyaPracticedConversationIds.filter(
                    (x): x is string => typeof x === 'string' && VALID_KENYA_LANDMARK_IDS.has(x),
                  ),
                ),
              )
            : undefined;
          let kenyaPerformStarted =
            typeof rawAttempt.kenyaPerformStarted === 'boolean'
              ? rawAttempt.kenyaPerformStarted
              : undefined;

          if (!kenyaDiscoverStarted) {
            kenyaDiscoverStarted = false;
            kenyaDiscoveredIds = undefined;
          }

          const hasDiscovery =
            Boolean(kenyaDiscoverStarted) &&
            (kenyaDiscoveredIds?.length ?? 0) >= KENYA_DISCOVERY_TASKS.length &&
            completedIds.includes(KENYA_DISCOVERY_ACTIVITY_ID);

          let resolvedStage: LearningStageId = 'discover';
          let resolvedStatus: 'in_progress' | 'completed' = 'in_progress';

          if (!hasDiscovery) {
            completedIds = [];
            kenyaBuildStarted = false;
            kenyaBuiltSentences = undefined;
            kenyaPracticeStarted = false;
            kenyaPracticedConversationIds = undefined;
            kenyaPerformStarted = false;
            completedAt = undefined;
          } else {
            const builtCount = kenyaBuiltSentences ? Object.keys(kenyaBuiltSentences).length : 0;
            const hasBuild =
              Boolean(kenyaBuildStarted) &&
              builtCount >= KENYA_BUILD_STATIONS.length &&
              completedIds.includes(KENYA_BUILD_ACTIVITY_ID);
            if (!hasBuild) {
              completedIds = [KENYA_DISCOVERY_ACTIVITY_ID];
              kenyaPracticeStarted = false;
              kenyaPracticedConversationIds = undefined;
              kenyaPerformStarted = false;
              completedAt = undefined;
              resolvedStage = 'build';
            } else {
              const practicedCount = kenyaPracticedConversationIds?.length ?? 0;
              const hasPractice =
                Boolean(kenyaPracticeStarted) &&
                practicedCount >= KENYA_PRACTICE_CONVERSATIONS.length &&
                completedIds.includes(KENYA_PRACTICE_ACTIVITY_ID);
              if (!hasPractice) {
                completedIds = [KENYA_DISCOVERY_ACTIVITY_ID, KENYA_BUILD_ACTIVITY_ID];
                kenyaPerformStarted = false;
                completedAt = undefined;
                resolvedStage = 'practice';
              } else if (completedIds.includes(KENYA_PERFORM_ACTIVITY_ID)) {
                completedIds = [
                  KENYA_DISCOVERY_ACTIVITY_ID,
                  KENYA_BUILD_ACTIVITY_ID,
                  KENYA_PRACTICE_ACTIVITY_ID,
                  KENYA_PERFORM_ACTIVITY_ID,
                ];
                kenyaPerformStarted = true;
                resolvedStage = 'perform';
                resolvedStatus = 'completed';
                completedAt = completedAt ?? defaults.updatedAt;
              } else {
                completedIds = [
                  KENYA_DISCOVERY_ACTIVITY_ID,
                  KENYA_BUILD_ACTIVITY_ID,
                  KENYA_PRACTICE_ACTIVITY_ID,
                ];
                completedAt = undefined;
                resolvedStage = 'perform';
              }
            }
          }

          activeAttempts.kenya = {
            countryId: 'kenya',
            attemptNumber,
            status: resolvedStatus,
            currentStage: resolvedStage,
            completedActivityIds: completedIds,
            startedAt,
            ...(completedAt ? { completedAt } : {}),
            ...(kenyaDiscoverStarted !== undefined ? { kenyaDiscoverStarted } : {}),
            ...(kenyaDiscoveredIds ? { kenyaDiscoveredIds } : {}),
            ...(kenyaBuildStarted !== undefined ? { kenyaBuildStarted } : {}),
            ...(kenyaBuiltSentences ? { kenyaBuiltSentences } : {}),
            ...(kenyaPracticeStarted !== undefined ? { kenyaPracticeStarted } : {}),
            ...(kenyaPracticedConversationIds ? { kenyaPracticedConversationIds } : {}),
            ...(kenyaPerformStarted !== undefined ? { kenyaPerformStarted } : {}),
          };
        } else if (countryId === 'scotland') {
          const metEilidh =
            typeof rawAttempt.metEilidh === 'boolean' ? rawAttempt.metEilidh : undefined;
          const metFiona =
            typeof rawAttempt.metFiona === 'boolean' ? rawAttempt.metFiona : undefined;
          const scotlandExploredPoiIds = Array.isArray(rawAttempt.scotlandExploredPoiIds)
            ? Array.from(
                new Set(
                  rawAttempt.scotlandExploredPoiIds.filter(
                    (x): x is string =>
                      typeof x === 'string' && VALID_SCOTLAND_LANDMARK_IDS.has(x),
                  ),
                ),
              )
            : undefined;
          let scotlandDiscoverStarted =
            typeof rawAttempt.scotlandDiscoverStarted === 'boolean'
              ? rawAttempt.scotlandDiscoverStarted
              : undefined;
          let scotlandDiscoveredEvidenceIds = Array.isArray(
            rawAttempt.scotlandDiscoveredEvidenceIds,
          )
            ? Array.from(
                new Set(
                  rawAttempt.scotlandDiscoveredEvidenceIds.filter(
                    (x): x is string =>
                      typeof x === 'string' && VALID_SCOTLAND_LANDMARK_IDS.has(x),
                  ),
                ),
              )
            : undefined;
          let scotlandBuildStarted =
            typeof rawAttempt.scotlandBuildStarted === 'boolean'
              ? rawAttempt.scotlandBuildStarted
              : undefined;
          let scotlandBuiltSentences: Record<string, string> | undefined;
          if (isRecord(rawAttempt.scotlandBuiltSentences)) {
            const validMap: Record<string, string> = {};
            for (const [stationKey, rawSentence] of Object.entries(
              rawAttempt.scotlandBuiltSentences,
            )) {
              if (
                VALID_SCOTLAND_LANDMARK_IDS.has(stationKey) &&
                isValidSavedScotlandBuildSentence(stationKey as ScotlandLandmarkId, rawSentence)
              ) {
                validMap[stationKey] = rawSentence.trim();
              }
            }
            if (Object.keys(validMap).length > 0) {
              scotlandBuiltSentences = validMap;
            }
          }
          let scotlandPracticeStarted =
            typeof rawAttempt.scotlandPracticeStarted === 'boolean'
              ? rawAttempt.scotlandPracticeStarted
              : undefined;
          let scotlandSpeakingReflectionStates:
            | Record<string, ScotlandSpeakingReflectionState>
            | undefined;
          if (isRecord(rawAttempt.scotlandSpeakingReflectionStates)) {
            const validReflections: Record<string, ScotlandSpeakingReflectionState> = {};
            for (const [stationKey, rawRef] of Object.entries(
              rawAttempt.scotlandSpeakingReflectionStates,
            )) {
              if (
                VALID_SCOTLAND_LANDMARK_IDS.has(stationKey) &&
                isValidScotlandReflectionState(rawRef)
              ) {
                validReflections[stationKey] = rawRef;
              }
            }
            if (Object.keys(validReflections).length > 0) {
              scotlandSpeakingReflectionStates = validReflections;
            }
          }
          let scotlandCompletedSpeakingIds = Array.isArray(
            rawAttempt.scotlandCompletedSpeakingIds,
          )
            ? Array.from(
                new Set(
                  rawAttempt.scotlandCompletedSpeakingIds.filter(
                    (x): x is string =>
                      typeof x === 'string' &&
                      VALID_SCOTLAND_LANDMARK_IDS.has(x) &&
                      Boolean(scotlandSpeakingReflectionStates?.[x]),
                  ),
                ),
              )
            : undefined;
          if (scotlandCompletedSpeakingIds && scotlandCompletedSpeakingIds.length === 0) {
            scotlandCompletedSpeakingIds = undefined;
          }
          let scotlandPerformStarted =
            typeof rawAttempt.scotlandPerformStarted === 'boolean'
              ? rawAttempt.scotlandPerformStarted
              : undefined;
          let scotlandPerformSelectedEvidenceIds = sanitizeScotlandPerformSelectedEvidenceIds(
            rawAttempt.scotlandPerformSelectedEvidenceIds,
          ) as string[] | undefined;
          let scotlandPerformOutline = sanitizeScotlandPerformOutline(
            rawAttempt.scotlandPerformOutline,
          );
          let scotlandPerformSpeechPracticeMode = isValidScotlandPerformPracticeMode(
            rawAttempt.scotlandPerformSpeechPracticeMode,
          )
            ? rawAttempt.scotlandPerformSpeechPracticeMode
            : undefined;
          let scotlandPerformQuestionPracticeStates = sanitizeScotlandPerformQaStates(
            rawAttempt.scotlandPerformQuestionPracticeStates,
          );
          let scotlandPerformReflectionState = sanitizeScotlandPerformReflectionState(
            rawAttempt.scotlandPerformReflectionState,
          );
          let scotlandPerformCompleted =
            typeof rawAttempt.scotlandPerformCompleted === 'boolean'
              ? rawAttempt.scotlandPerformCompleted
              : undefined;

          const clearAttemptPerformFields = () => {
            scotlandPerformStarted = false;
            scotlandPerformSelectedEvidenceIds = undefined;
            scotlandPerformOutline = undefined;
            scotlandPerformSpeechPracticeMode = undefined;
            scotlandPerformQuestionPracticeStates = undefined;
            scotlandPerformReflectionState = undefined;
            scotlandPerformCompleted = undefined;
          };

          if (!scotlandDiscoverStarted) {
            scotlandDiscoverStarted = false;
            scotlandDiscoveredEvidenceIds = undefined;
          }

          const legitDiscoverDone =
            Boolean(scotlandDiscoverStarted) &&
            (scotlandDiscoveredEvidenceIds?.length ?? 0) >= SCOTLAND_EVIDENCE_ITEMS.length &&
            completedIds.includes(SCOTLAND_DISCOVERY_ACTIVITY_ID);

          let resolvedStage: LearningStageId = 'discover';
          let resolvedStatus: 'in_progress' | 'completed' = 'in_progress';
          let sanitizedAttemptIds: string[] = [];

          if (!legitDiscoverDone) {
            scotlandBuildStarted = false;
            scotlandBuiltSentences = undefined;
            scotlandPracticeStarted = false;
            scotlandCompletedSpeakingIds = undefined;
            scotlandSpeakingReflectionStates = undefined;
            clearAttemptPerformFields();
            completedAt = undefined;
          } else {
            if (!scotlandBuildStarted) {
              scotlandBuildStarted = false;
              scotlandBuiltSentences = undefined;
            }
            const builtCount = scotlandBuiltSentences
              ? Object.keys(scotlandBuiltSentences).length
              : 0;
            const legitBuildDone =
              Boolean(scotlandBuildStarted) &&
              builtCount >= SCOTLAND_BUILD_STATIONS.length &&
              completedIds.includes(SCOTLAND_BUILD_ACTIVITY_ID);

            if (!legitBuildDone) {
              sanitizedAttemptIds = [SCOTLAND_DISCOVERY_ACTIVITY_ID];
              scotlandPracticeStarted = false;
              scotlandCompletedSpeakingIds = undefined;
              scotlandSpeakingReflectionStates = undefined;
              clearAttemptPerformFields();
              resolvedStage = 'build';
              resolvedStatus = 'in_progress';
              completedAt = undefined;
            } else {
              if (!scotlandPracticeStarted) {
                scotlandPracticeStarted = false;
                scotlandCompletedSpeakingIds = undefined;
                scotlandSpeakingReflectionStates = undefined;
              }
              const practiceCount = scotlandCompletedSpeakingIds?.length ?? 0;
              const legitPracticeDone =
                Boolean(scotlandPracticeStarted) &&
                practiceCount >= SCOTLAND_PRACTICE_MISSIONS.length &&
                completedIds.includes(SCOTLAND_PRACTICE_ACTIVITY_ID);

              if (!legitPracticeDone) {
                sanitizedAttemptIds = [
                  SCOTLAND_DISCOVERY_ACTIVITY_ID,
                  SCOTLAND_BUILD_ACTIVITY_ID,
                ];
                clearAttemptPerformFields();
                resolvedStage = 'practice';
                resolvedStatus = 'in_progress';
                completedAt = undefined;
              } else {
                if (!scotlandPerformStarted) {
                  clearAttemptPerformFields();
                }
                const rawAttemptPerform =
                  completedIds.includes(SCOTLAND_PERFORM_ACTIVITY_ID) ||
                  Boolean(scotlandPerformCompleted);
                const legitPerformDone =
                  Boolean(scotlandPerformStarted) &&
                  rawAttemptPerform &&
                  areValidScotlandPerformEvidenceIds(scotlandPerformSelectedEvidenceIds) &&
                  isValidScotlandPerformOutline(scotlandPerformOutline) &&
                  isValidScotlandPerformPracticeMode(scotlandPerformSpeechPracticeMode) &&
                  areValidScotlandPerformQaStates(scotlandPerformQuestionPracticeStates) &&
                  isValidScotlandPerformReflectionState(scotlandPerformReflectionState);

                if (legitPerformDone) {
                  sanitizedAttemptIds = [
                    SCOTLAND_DISCOVERY_ACTIVITY_ID,
                    SCOTLAND_BUILD_ACTIVITY_ID,
                    SCOTLAND_PRACTICE_ACTIVITY_ID,
                    SCOTLAND_PERFORM_ACTIVITY_ID,
                  ];
                  scotlandPerformStarted = true;
                  scotlandPerformCompleted = true;
                  resolvedStage = 'perform';
                  resolvedStatus = 'completed';
                  completedAt = completedAt ?? defaults.updatedAt;
                } else {
                  sanitizedAttemptIds = [
                    SCOTLAND_DISCOVERY_ACTIVITY_ID,
                    SCOTLAND_BUILD_ACTIVITY_ID,
                    SCOTLAND_PRACTICE_ACTIVITY_ID,
                  ];
                  scotlandPerformCompleted = undefined;
                  resolvedStage = 'perform';
                  resolvedStatus = 'in_progress';
                  completedAt = undefined;
                }
              }
            }
          }

          activeAttempts.scotland = {
            countryId: 'scotland',
            attemptNumber,
            status: resolvedStatus,
            currentStage: resolvedStage,
            completedActivityIds: sanitizedAttemptIds,
            startedAt,
            ...(completedAt ? { completedAt } : {}),
            ...(metEilidh !== undefined ? { metEilidh } : {}),
            ...(metFiona !== undefined ? { metFiona } : {}),
            ...(scotlandExploredPoiIds ? { scotlandExploredPoiIds } : {}),
            ...(scotlandDiscoverStarted !== undefined ? { scotlandDiscoverStarted } : {}),
            ...(scotlandDiscoveredEvidenceIds ? { scotlandDiscoveredEvidenceIds } : {}),
            ...(scotlandBuildStarted !== undefined ? { scotlandBuildStarted } : {}),
            ...(scotlandBuiltSentences ? { scotlandBuiltSentences } : {}),
            ...(scotlandPracticeStarted !== undefined ? { scotlandPracticeStarted } : {}),
            ...(scotlandCompletedSpeakingIds ? { scotlandCompletedSpeakingIds } : {}),
            ...(scotlandSpeakingReflectionStates ? { scotlandSpeakingReflectionStates } : {}),
            ...(scotlandPerformStarted !== undefined ? { scotlandPerformStarted } : {}),
            ...(scotlandPerformSelectedEvidenceIds
              ? { scotlandPerformSelectedEvidenceIds }
              : {}),
            ...(scotlandPerformOutline ? { scotlandPerformOutline } : {}),
            ...(scotlandPerformSpeechPracticeMode ? { scotlandPerformSpeechPracticeMode } : {}),
            ...(scotlandPerformQuestionPracticeStates
              ? { scotlandPerformQuestionPracticeStates }
              : {}),
            ...(scotlandPerformReflectionState ? { scotlandPerformReflectionState } : {}),
            ...(scotlandPerformCompleted !== undefined ? { scotlandPerformCompleted } : {}),
          };
        } else if (countryId === 'australia') {
          const australiaExploredPoiIds = Array.isArray(rawAttempt.australiaExploredPoiIds)
            ? Array.from(
                new Set(
                  rawAttempt.australiaExploredPoiIds.filter(
                    (x): x is string =>
                      typeof x === 'string' && VALID_AUSTRALIA_LANDMARK_IDS.has(x),
                  ),
                ),
              )
            : undefined;
          const australiaMetNpcIds = Array.isArray(rawAttempt.australiaMetNpcIds)
            ? Array.from(
                new Set(
                  rawAttempt.australiaMetNpcIds.filter(
                    (x): x is string =>
                      typeof x === 'string' && VALID_AUSTRALIA_NPC_IDS.has(x),
                  ),
                ),
              )
            : undefined;
          const australiaDiscoverStarted =
            typeof rawAttempt.australiaDiscoverStarted === 'boolean'
              ? rawAttempt.australiaDiscoverStarted
              : undefined;
          let australiaCompletedDiscoverIds: AustraliaLandmarkId[] | undefined;
          if (australiaDiscoverStarted) {
            const rawSet = new Set(
              Array.isArray(rawAttempt.australiaCompletedDiscoverIds)
                ? rawAttempt.australiaCompletedDiscoverIds.filter(
                    (x): x is AustraliaLandmarkId =>
                      typeof x === 'string' && VALID_AUSTRALIA_LANDMARK_IDS.has(x),
                  )
                : [],
            );
            const seq: AustraliaLandmarkId[] = [];
            for (const id of AUSTRALIA_DISCOVER_MISSION_ORDER) {
              if (rawSet.has(id)) seq.push(id);
              else break;
            }
            if (seq.length > 0) australiaCompletedDiscoverIds = seq;
          }

          const hasDiscover =
            Boolean(australiaDiscoverStarted) &&
            (australiaCompletedDiscoverIds?.length ?? 0) >=
              AUSTRALIA_DISCOVER_MISSION_ORDER.length &&
            completedIds.includes(AUSTRALIA_DISCOVERY_ACTIVITY_ID);

          let australiaBuildStarted: boolean | undefined;
          let australiaCompletedBuildIds: AustraliaLandmarkId[] | undefined;
          let australiaBuiltDialogues: Record<string, string> | undefined;
          let australiaPracticeStarted: boolean | undefined;
          let australiaCompletedPracticeIds: AustraliaLandmarkId[] | undefined;
          let australiaPracticeEvidence:
            | Record<string, AustraliaSpeakingEvidenceRecord>
            | undefined;
          let australiaPerformStarted: boolean | undefined;
          let australiaCompletedPerformIds: AustraliaLandmarkId[] | undefined;
          let australiaPerformEvidence:
            | Record<string, AustraliaPerformChallengeRecord>
            | undefined;
          let australiaPerformReflection: AustraliaPerformReflectionState | undefined;
          let australiaPerformCompleted: boolean | undefined;

          if (hasDiscover) {
            australiaBuildStarted =
              typeof rawAttempt.australiaBuildStarted === 'boolean'
                ? rawAttempt.australiaBuildStarted
                : undefined;
            if (australiaBuildStarted) {
              const rawBuildSet = new Set(
                Array.isArray(rawAttempt.australiaCompletedBuildIds)
                  ? rawAttempt.australiaCompletedBuildIds.filter(
                      (x): x is AustraliaLandmarkId =>
                        typeof x === 'string' && VALID_AUSTRALIA_LANDMARK_IDS.has(x),
                    )
                  : [],
              );
              const buildSeq: AustraliaLandmarkId[] = [];
              for (const id of AUSTRALIA_BUILD_MISSION_ORDER) {
                if (rawBuildSet.has(id)) buildSeq.push(id);
                else break;
              }
              if (buildSeq.length > 0) australiaCompletedBuildIds = buildSeq;
              if (isRecord(rawAttempt.australiaBuiltDialogues)) {
                const nextDialogues: Record<string, string> = {};
                for (const id of buildSeq) {
                  const val = rawAttempt.australiaBuiltDialogues[id];
                  if (typeof val === 'string') {
                    const trimmed = val.trim();
                    if (trimmed.length >= 4 && trimmed.length <= 320) {
                      nextDialogues[id] = trimmed;
                    }
                  }
                }
                if (Object.keys(nextDialogues).length > 0) {
                  australiaBuiltDialogues = nextDialogues;
                }
              }
            }
          }

          const hasBuild =
            hasDiscover &&
            Boolean(australiaBuildStarted) &&
            (australiaCompletedBuildIds?.length ?? 0) >= AUSTRALIA_BUILD_MISSION_ORDER.length &&
            completedIds.includes(AUSTRALIA_BUILD_ACTIVITY_ID);

          if (hasBuild) {
            australiaPracticeStarted =
              typeof rawAttempt.australiaPracticeStarted === 'boolean'
                ? rawAttempt.australiaPracticeStarted
                : undefined;
            if (australiaPracticeStarted) {
              const rawPracticeSet = new Set(
                Array.isArray(rawAttempt.australiaCompletedPracticeIds)
                  ? rawAttempt.australiaCompletedPracticeIds.filter(
                      (x): x is AustraliaLandmarkId =>
                        typeof x === 'string' && VALID_AUSTRALIA_LANDMARK_IDS.has(x),
                    )
                  : [],
              );
              const rawEvidenceMap = isRecord(rawAttempt.australiaPracticeEvidence)
                ? rawAttempt.australiaPracticeEvidence
                : {};
              const practiceSeq: AustraliaLandmarkId[] = [];
              const nextEvidence: Record<string, AustraliaSpeakingEvidenceRecord> = {};
              for (const id of AUSTRALIA_PRACTICE_MISSION_ORDER) {
                if (!rawPracticeSet.has(id)) break;
                const spec = getAustraliaPracticeMissionSpec(id);
                const validTurnIds = spec ? spec.turns.map((t) => t.turnId) : [];
                const cleanEvidence = sanitizeAustraliaSpeakingEvidenceRecord(
                  rawEvidenceMap[id],
                  validTurnIds,
                );
                if (!cleanEvidence) break;
                practiceSeq.push(id);
                nextEvidence[id] = cleanEvidence;
              }
              if (practiceSeq.length > 0) australiaCompletedPracticeIds = practiceSeq;
              if (Object.keys(nextEvidence).length > 0) {
                australiaPracticeEvidence = nextEvidence;
              }
            }
          }

          const hasPractice =
            hasBuild &&
            Boolean(australiaPracticeStarted) &&
            (australiaCompletedPracticeIds?.length ?? 0) >=
              AUSTRALIA_PRACTICE_MISSION_ORDER.length &&
            completedIds.includes(AUSTRALIA_PRACTICE_ACTIVITY_ID);

          if (hasPractice) {
            australiaPerformStarted =
              typeof rawAttempt.australiaPerformStarted === 'boolean'
                ? rawAttempt.australiaPerformStarted
                : undefined;
            if (australiaPerformStarted) {
              const rawPerformSet = new Set(
                Array.isArray(rawAttempt.australiaCompletedPerformIds)
                  ? rawAttempt.australiaCompletedPerformIds.filter(
                      (x): x is AustraliaLandmarkId =>
                        typeof x === 'string' && VALID_AUSTRALIA_LANDMARK_IDS.has(x),
                    )
                  : [],
              );
              const rawPerformMap = isRecord(rawAttempt.australiaPerformEvidence)
                ? rawAttempt.australiaPerformEvidence
                : {};
              const performSeq: AustraliaLandmarkId[] = [];
              const nextPerformEvidence: Record<string, AustraliaPerformChallengeRecord> = {};
              for (const id of AUSTRALIA_PERFORM_CHALLENGE_ORDER) {
                if (!rawPerformSet.has(id)) break;
                const spec = getAustraliaPerformChallengeSpec(id);
                const validTurnIds = spec ? spec.turns.map((t) => t.turnId) : [];
                const cleanRecord = sanitizeAustraliaPerformChallengeRecord(
                  rawPerformMap[id],
                  validTurnIds,
                );
                if (!cleanRecord) break;
                performSeq.push(id);
                nextPerformEvidence[id] = cleanRecord;
              }
              if (performSeq.length > 0) australiaCompletedPerformIds = performSeq;
              if (Object.keys(nextPerformEvidence).length > 0) {
                australiaPerformEvidence = nextPerformEvidence;
              }
              australiaPerformReflection = sanitizeAustraliaPerformReflectionState(
                rawAttempt.australiaPerformReflection,
              );
            }
          }

          const allPerformChallengesDone =
            (australiaCompletedPerformIds?.length ?? 0) >=
              AUSTRALIA_PERFORM_CHALLENGE_ORDER.length &&
            AUSTRALIA_PERFORM_CHALLENGE_ORDER.every((id) =>
              Boolean(australiaPerformEvidence?.[id]),
            );
          const rawHasPerformCompletion =
            completedIds.includes(AUSTRALIA_PERFORM_ACTIVITY_ID) ||
            rawAttempt.australiaPerformCompleted === true ||
            rawAttempt.status === 'completed';
          const hasPerform =
            hasPractice &&
            Boolean(australiaPerformStarted) &&
            allPerformChallengesDone &&
            isValidAustraliaPerformReflectionState(australiaPerformReflection) &&
            rawHasPerformCompletion;

          australiaPerformCompleted = hasPerform ? true : undefined;
          const sanitizedAttemptIds = hasPerform
            ? [
                AUSTRALIA_DISCOVERY_ACTIVITY_ID,
                AUSTRALIA_BUILD_ACTIVITY_ID,
                AUSTRALIA_PRACTICE_ACTIVITY_ID,
                AUSTRALIA_PERFORM_ACTIVITY_ID,
              ]
            : hasPractice
              ? [
                  AUSTRALIA_DISCOVERY_ACTIVITY_ID,
                  AUSTRALIA_BUILD_ACTIVITY_ID,
                  AUSTRALIA_PRACTICE_ACTIVITY_ID,
                ]
              : hasBuild
                ? [AUSTRALIA_DISCOVERY_ACTIVITY_ID, AUSTRALIA_BUILD_ACTIVITY_ID]
                : hasDiscover
                  ? [AUSTRALIA_DISCOVERY_ACTIVITY_ID]
                  : [];
          const resolvedStage: LearningStageId = hasPractice
            ? 'perform'
            : hasBuild
              ? 'practice'
              : hasDiscover
                ? 'build'
                : 'discover';
          const resolvedStatus: 'in_progress' | 'completed' = hasPerform
            ? 'completed'
            : 'in_progress';
          completedAt = hasPerform ? (completedAt ?? defaults.updatedAt) : undefined;

          activeAttempts.australia = {
            countryId: 'australia',
            attemptNumber,
            status: resolvedStatus,
            currentStage: resolvedStage,
            completedActivityIds: sanitizedAttemptIds,
            startedAt,
            ...(completedAt ? { completedAt } : {}),
            ...(australiaExploredPoiIds && australiaExploredPoiIds.length > 0
              ? { australiaExploredPoiIds }
              : {}),
            ...(australiaMetNpcIds && australiaMetNpcIds.length > 0
              ? { australiaMetNpcIds }
              : {}),
            ...(australiaDiscoverStarted ? { australiaDiscoverStarted } : {}),
            ...(australiaCompletedDiscoverIds && australiaCompletedDiscoverIds.length > 0
              ? { australiaCompletedDiscoverIds }
              : {}),
            ...(australiaBuildStarted ? { australiaBuildStarted } : {}),
            ...(australiaCompletedBuildIds && australiaCompletedBuildIds.length > 0
              ? { australiaCompletedBuildIds }
              : {}),
            ...(australiaBuiltDialogues && Object.keys(australiaBuiltDialogues).length > 0
              ? { australiaBuiltDialogues }
              : {}),
            ...(australiaPracticeStarted ? { australiaPracticeStarted } : {}),
            ...(australiaCompletedPracticeIds && australiaCompletedPracticeIds.length > 0
              ? { australiaCompletedPracticeIds }
              : {}),
            ...(australiaPracticeEvidence && Object.keys(australiaPracticeEvidence).length > 0
              ? { australiaPracticeEvidence }
              : {}),
            ...(australiaPerformStarted ? { australiaPerformStarted } : {}),
            ...(australiaCompletedPerformIds && australiaCompletedPerformIds.length > 0
              ? { australiaCompletedPerformIds }
              : {}),
            ...(australiaPerformEvidence && Object.keys(australiaPerformEvidence).length > 0
              ? { australiaPerformEvidence }
              : {}),
            ...(australiaPerformReflection ? { australiaPerformReflection } : {}),
            ...(australiaPerformCompleted !== undefined ? { australiaPerformCompleted } : {}),
          };
        }

        const existingHist = history[countryId];
        const minCompleted =
          activeAttempts[countryId]?.status === 'completed'
            ? Math.max(1, existingHist?.completedReplayCount ?? 0)
            : (existingHist?.completedReplayCount ?? 0);
        history[countryId] = {
          totalAttemptsStarted: Math.max(
            attemptNumber,
            minCompleted,
            existingHist?.totalAttemptsStarted ?? 0,
          ),
          completedReplayCount: minCompleted,
          lastAttemptStartedAt: existingHist?.lastAttemptStartedAt ?? startedAt,
          ...(existingHist?.lastReplayCompletedAt
            ? { lastReplayCompletedAt: existingHist.lastReplayCompletedAt }
            : {}),
        };
      }
    }

    return { activeAttempts, history };
  })();

  const indiaMaxXp =
    (sanitizedMissionProgress[JAIPUR_MISSION_ID]?.completedActivityIds.includes(
      WORD_DETECTIVE_ACTIVITY_ID,
    )
      ? WORD_DETECTIVE_XP_REWARD
      : 0) +
    (sanitizedMissionProgress[JAIPUR_MISSION_ID]?.completedActivityIds.includes(
      SENTENCE_TRAIN_ACTIVITY_ID,
    )
      ? SENTENCE_TRAIN_XP_REWARD
      : 0) +
    (sanitizedMissionProgress[JAIPUR_MISSION_ID]?.completedActivityIds.includes(
      SPOT_AND_SPEAK_ACTIVITY_ID,
    )
      ? SPOT_AND_SPEAK_XP_REWARD
      : 0) +
    (sanitizedMissionProgress[JAIPUR_MISSION_ID]?.completedActivityIds.includes(
      FINAL_JAIPUR_SHOWCASE_ACTIVITY_ID,
    )
      ? FINAL_JAIPUR_SHOWCASE_XP_REWARD
      : 0);
  const kenyaMaxXp =
    (sanitizedMissionProgress[KENYA_MISSION_ID]?.completedActivityIds.includes(
      KENYA_DISCOVERY_ACTIVITY_ID,
    )
      ? KENYA_DISCOVERY_XP_REWARD
      : 0) +
    (sanitizedMissionProgress[KENYA_MISSION_ID]?.completedActivityIds.includes(
      KENYA_BUILD_ACTIVITY_ID,
    )
      ? KENYA_BUILD_XP_REWARD
      : 0) +
    (sanitizedMissionProgress[KENYA_MISSION_ID]?.completedActivityIds.includes(
      KENYA_PRACTICE_ACTIVITY_ID,
    )
      ? KENYA_PRACTICE_XP_REWARD
      : 0) +
    (sanitizedMissionProgress[KENYA_MISSION_ID]?.completedActivityIds.includes(
      KENYA_PERFORM_ACTIVITY_ID,
    )
      ? KENYA_PERFORM_XP_REWARD
      : 0);
  const scotlandMaxXp =
    (sanitizedMissionProgress[SCOTLAND_MISSION_ID]?.completedActivityIds.includes(
      SCOTLAND_DISCOVERY_ACTIVITY_ID,
    )
      ? SCOTLAND_DISCOVERY_XP_REWARD
      : 0) +
    (sanitizedMissionProgress[SCOTLAND_MISSION_ID]?.completedActivityIds.includes(
      SCOTLAND_BUILD_ACTIVITY_ID,
    )
      ? SCOTLAND_BUILD_XP_REWARD
      : 0) +
    (sanitizedMissionProgress[SCOTLAND_MISSION_ID]?.completedActivityIds.includes(
      SCOTLAND_PRACTICE_ACTIVITY_ID,
    )
      ? SCOTLAND_PRACTICE_XP_REWARD
      : 0) +
    (sanitizedMissionProgress[SCOTLAND_MISSION_ID]?.completedActivityIds.includes(
      SCOTLAND_PERFORM_ACTIVITY_ID,
    )
      ? SCOTLAND_PERFORM_XP_REWARD
      : 0);
  const australiaActivities =
    sanitizedMissionProgress[AUSTRALIA_MISSION_ID]?.completedActivityIds ?? [];
  const australiaMaxXp = australiaLegitUnlocked
    ? (australiaActivities.includes(AUSTRALIA_DISCOVERY_ACTIVITY_ID)
        ? AUSTRALIA_DISCOVERY_XP_REWARD
        : 0) +
      (australiaActivities.includes(AUSTRALIA_BUILD_ACTIVITY_ID)
        ? AUSTRALIA_BUILD_XP_REWARD
        : 0) +
      (australiaActivities.includes(AUSTRALIA_PRACTICE_ACTIVITY_ID)
        ? AUSTRALIA_PRACTICE_XP_REWARD
        : 0) +
      (australiaActivities.includes(AUSTRALIA_PERFORM_ACTIVITY_ID)
        ? AUSTRALIA_PERFORM_XP_REWARD
        : 0)
    : 0;
  const egyptActivities =
    sanitizedMissionProgress[EGYPT_MISSION_ID]?.completedActivityIds ?? [];
  const egyptMaxXp = egyptLegitUnlocked
    ? (egyptActivities.includes(EGYPT_DISCOVERY_ACTIVITY_ID) ? EGYPT_DISCOVERY_XP_REWARD : 0) +
      (egyptActivities.includes(EGYPT_BUILD_ACTIVITY_ID) ? EGYPT_BUILD_XP_REWARD : 0)
    : 0;
  const maxLegitimateXp =
    indiaMaxXp + kenyaMaxXp + scotlandMaxXp + australiaMaxXp + egyptMaxXp;
  const rawXp = typeof rawRewards.xp === 'number' && rawRewards.xp >= 0 ? rawRewards.xp : 0;

  const clampedCurrentRoute: ScreenRoute =
    currentRoute === 'country-lobby' &&
    ((selectedCountryId === 'scotland' && !kenyaPerformLegitCompleted) ||
      (selectedCountryId === 'australia' && !australiaLegitUnlocked) ||
      (selectedCountryId === 'egypt' && !egyptLegitUnlocked))
      ? 'world-map'
      : currentRoute;

  return {
    schemaVersion: 1,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : defaults.updatedAt,
    uiLanguage,
    appearanceMode,
    audioPrefs,
    reducedMotionOverride,
    selectedCountryId,
    currentRoute: clampedCurrentRoute,
    avatar: {
      modelId,
      displayName,
      hairStyle,
      hairColor,
      skinTone,
      outfitId,
      outfitColor,
      backpackColor,
      accessoryIds: Array.isArray(rawAvatar.accessoryIds)
        ? rawAvatar.accessoryIds.filter((x): x is string => typeof x === 'string')
        : defaults.avatar.accessoryIds,
      customizedInPhase1:
        typeof rawAvatar.customizedInPhase1 === 'boolean'
          ? rawAvatar.customizedInPhase1
          : defaults.avatar.customizedInPhase1,
    },
    rewards: {
      xp: Math.min(rawXp, maxLegitimateXp),
      coins:
        typeof rawRewards.coins === 'number' && rawRewards.coins >= 0 ? rawRewards.coins : 0,
      gems: typeof rawRewards.gems === 'number' && rawRewards.gems >= 0 ? rawRewards.gems : 0,
      stamps: sanitizedStamps,
    },
    unlockedCountryIds: sanitizedUnlockedCountries,
    missionProgress: sanitizedMissionProgress,
    replayState: sanitizedReplayState,
  };
}

export function loadProgress(): LocalProgressV1 {
  try {
    const serialized = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!serialized) {
      const initial = createDefaultProgress();
      saveProgress(initial);
      return initial;
    }
    const parsed: unknown = JSON.parse(serialized);
    return migrateAndValidateProgress(parsed);
  } catch {
    return createDefaultProgress();
  }
}

export function saveProgress(progress: LocalProgressV1): void {
  try {
    const next: LocalProgressV1 = {
      ...progress,
      schemaVersion: 1,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage quota or private browsing mode; keep in-memory state functional.
  }
}

export function resetProgressStorage(): LocalProgressV1 {
  const fresh = createDefaultProgress();
  saveProgress(fresh);
  return fresh;
}

export function detectWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    if (!gl) return false;
    if ('getExtension' in gl) {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
    return true;
  } catch {
    return false;
  }
}

export const JAIPUR_MISSION_ID = 'mission_india_jaipur';
export const WORD_DETECTIVE_ACTIVITY_ID = 'word_detective';

function getReplayState(progress: LocalProgressV1): CountryReplayState {
  return progress.replayState ?? { activeAttempts: {}, history: {} };
}

function getActiveReplayAttempt(
  progress: LocalProgressV1,
  countryId: CountryId,
): CountryReplayAttempt | null {
  return progress.replayState?.activeAttempts?.[countryId] ?? null;
}

export function getCountryReplayCapabilities(
  countryId: CountryId,
): CountryReplayCapabilities {
  return COUNTRY_REPLAY_CAPABILITIES[countryId];
}

export function getCountryReplayAttempt(
  progress: LocalProgressV1,
  countryId: CountryId,
): CountryReplayAttempt | null {
  return getActiveReplayAttempt(progress, countryId);
}

export function hasActiveCountryReplay(
  progress: LocalProgressV1,
  countryId: CountryId,
): boolean {
  return Boolean(getActiveReplayAttempt(progress, countryId));
}

export function getCountryReplayHistory(
  progress: LocalProgressV1,
  countryId: CountryId,
): CountryReplayHistoryRecord {
  return (
    progress.replayState?.history?.[countryId] ?? {
      totalAttemptsStarted: 0,
      completedReplayCount: 0,
    }
  );
}

export function hasCountryStartedOrCompleted(
  progress: LocalProgressV1,
  countryId: CountryId,
): boolean {
  if (hasActiveCountryReplay(progress, countryId)) {
    return true;
  }
  if (countryId === 'india') {
    const entry = progress.missionProgress[JAIPUR_MISSION_ID];
    if (!entry) return false;
    return Boolean(
      entry.metAarav ||
        (entry.wordDetectiveFoundIds?.length ?? 0) > 0 ||
        entry.completedActivityIds.length > 0 ||
        entry.status !== 'not_started',
    );
  }
  if (countryId === 'kenya') {
    const entry = progress.missionProgress[KENYA_MISSION_ID];
    if (!entry) return false;
    return Boolean(
      entry.kenyaDiscoverStarted ||
        (entry.kenyaDiscoveredIds?.length ?? 0) > 0 ||
        entry.completedActivityIds.length > 0 ||
        entry.status !== 'not_started',
    );
  }
  if (countryId === 'scotland') {
    const entry = progress.missionProgress[SCOTLAND_MISSION_ID];
    if (!entry) return false;
    return Boolean(
      entry.metEilidh ||
        entry.metFiona ||
        entry.scotlandDiscoverStarted ||
        entry.scotlandBuildStarted ||
        entry.scotlandPracticeStarted ||
        entry.scotlandPerformStarted ||
        entry.scotlandPerformCompleted ||
        (entry.scotlandExploredPoiIds?.length ?? 0) > 0 ||
        (entry.scotlandDiscoveredEvidenceIds?.length ?? 0) > 0 ||
        Object.keys(entry.scotlandBuiltSentences ?? {}).length > 0 ||
        (entry.scotlandCompletedSpeakingIds?.length ?? 0) > 0 ||
        entry.completedActivityIds.length > 0 ||
        entry.status !== 'not_started',
    );
  }
  if (countryId === 'australia') {
    const entry = progress.missionProgress[AUSTRALIA_MISSION_ID];
    if (!entry) return false;
    return Boolean(
      entry.australiaDiscoverStarted ||
        entry.australiaBuildStarted ||
        entry.australiaPracticeStarted ||
        entry.australiaPerformStarted ||
        entry.australiaPerformCompleted ||
        (entry.australiaExploredPoiIds?.length ?? 0) > 0 ||
        (entry.australiaMetNpcIds?.length ?? 0) > 0 ||
        (entry.australiaCompletedDiscoverIds?.length ?? 0) > 0 ||
        (entry.australiaCompletedBuildIds?.length ?? 0) > 0 ||
        (entry.australiaCompletedPracticeIds?.length ?? 0) > 0 ||
        (entry.australiaCompletedPerformIds?.length ?? 0) > 0 ||
        entry.completedActivityIds.length > 0 ||
        entry.status !== 'not_started',
    );
  }
  return false;
}

export function canReplayCountry(
  progress: LocalProgressV1,
  countryId: CountryId,
): boolean {
  const capability = getCountryReplayCapabilities(countryId);
  if (!capability.isImplemented) return false;
  if (countryId === 'scotland' && !isScotlandUnlocked(progress)) {
    return false;
  }
  if (countryId === 'australia' && !isAustraliaUnlocked(progress)) {
    return false;
  }
  return hasCountryStartedOrCompleted(progress, countryId);
}

function buildFreshReplayAttempt(
  countryId: CountryId,
  attemptNumber: number,
  startedAt: string,
): CountryReplayAttempt {
  return {
    countryId,
    attemptNumber,
    status: 'in_progress',
    currentStage: 'discover',
    completedActivityIds: [],
    startedAt,
  };
}

export function startCountryReplay(
  progress: LocalProgressV1,
  countryId: CountryId,
): LocalProgressV1 {
  if (!canReplayCountry(progress, countryId)) {
    return progress;
  }
  const replayState = getReplayState(progress);
  const prevHistory = getCountryReplayHistory(progress, countryId);
  const nextAttemptNumber = prevHistory.totalAttemptsStarted + 1;
  const now = new Date().toISOString();
  const nextAttempt = buildFreshReplayAttempt(countryId, nextAttemptNumber, now);

  return {
    ...progress,
    replayState: {
      activeAttempts: {
        ...replayState.activeAttempts,
        [countryId]: nextAttempt,
      },
      history: {
        ...replayState.history,
        [countryId]: {
          ...prevHistory,
          totalAttemptsStarted: nextAttemptNumber,
          lastAttemptStartedAt: now,
        },
      },
    },
  };
}

export function restartCountryReplayAttempt(
  progress: LocalProgressV1,
  countryId: CountryId,
): LocalProgressV1 {
  const existingAttempt = getActiveReplayAttempt(progress, countryId);
  if (!existingAttempt) {
    return progress;
  }
  const replayState = getReplayState(progress);
  const now = new Date().toISOString();
  const restartedAttempt = buildFreshReplayAttempt(
    countryId,
    existingAttempt.attemptNumber,
    now,
  );

  return {
    ...progress,
    replayState: {
      ...replayState,
      activeAttempts: {
        ...replayState.activeAttempts,
        [countryId]: restartedAttempt,
      },
    },
  };
}

export function getJaipurEffectiveEntry(progress: LocalProgressV1): MissionProgressEntry {
  const active = getActiveReplayAttempt(progress, 'india');
  if (active) {
    return {
      status: active.status,
      currentStage: active.currentStage,
      completedActivityIds: active.completedActivityIds,
      wordDetectiveFoundIds: active.wordDetectiveFoundIds,
      metAarav: active.metAarav,
      spotAndSpeakStarted: active.spotAndSpeakStarted,
      spotAndSpeakDoneIds: active.spotAndSpeakDoneIds,
      completedAt: active.completedAt,
    };
  }
  return (
    progress.missionProgress[JAIPUR_MISSION_ID] ?? {
      status: 'not_started',
      currentStage: 'discover',
      completedActivityIds: [],
    }
  );
}

export function getKenyaEffectiveEntry(progress: LocalProgressV1): MissionProgressEntry {
  const active = getActiveReplayAttempt(progress, 'kenya');
  if (active) {
    return {
      status: active.status,
      currentStage: active.currentStage,
      completedActivityIds: active.completedActivityIds,
      kenyaDiscoverStarted: active.kenyaDiscoverStarted,
      kenyaDiscoveredIds: active.kenyaDiscoveredIds,
      kenyaBuildStarted: active.kenyaBuildStarted,
      kenyaBuiltSentences: active.kenyaBuiltSentences,
      kenyaPracticeStarted: active.kenyaPracticeStarted,
      kenyaPracticedConversationIds: active.kenyaPracticedConversationIds,
      kenyaPerformStarted: active.kenyaPerformStarted,
      completedAt: active.completedAt,
    };
  }
  return (
    progress.missionProgress[KENYA_MISSION_ID] ?? {
      status: 'not_started',
      currentStage: 'discover',
      completedActivityIds: [],
    }
  );
}

export function getScotlandEffectiveEntry(progress: LocalProgressV1): MissionProgressEntry {
  const active = getActiveReplayAttempt(progress, 'scotland');
  if (active) {
    return {
      status: active.status,
      currentStage: active.currentStage,
      completedActivityIds: active.completedActivityIds,
      metEilidh: active.metEilidh,
      metFiona: active.metFiona,
      scotlandExploredPoiIds: active.scotlandExploredPoiIds,
      scotlandDiscoverStarted: active.scotlandDiscoverStarted,
      scotlandDiscoveredEvidenceIds: active.scotlandDiscoveredEvidenceIds,
      scotlandBuildStarted: active.scotlandBuildStarted,
      scotlandBuiltSentences: active.scotlandBuiltSentences,
      scotlandPracticeStarted: active.scotlandPracticeStarted,
      scotlandCompletedSpeakingIds: active.scotlandCompletedSpeakingIds,
      scotlandSpeakingReflectionStates: active.scotlandSpeakingReflectionStates,
      scotlandPerformStarted: active.scotlandPerformStarted,
      scotlandPerformSelectedEvidenceIds: active.scotlandPerformSelectedEvidenceIds,
      scotlandPerformOutline: active.scotlandPerformOutline,
      scotlandPerformSpeechPracticeMode: active.scotlandPerformSpeechPracticeMode,
      scotlandPerformQuestionPracticeStates: active.scotlandPerformQuestionPracticeStates,
      scotlandPerformReflectionState: active.scotlandPerformReflectionState,
      scotlandPerformCompleted: active.scotlandPerformCompleted,
      completedAt: active.completedAt,
    };
  }
  return (
    progress.missionProgress[SCOTLAND_MISSION_ID] ?? {
      status: 'not_started',
      currentStage: 'discover',
      completedActivityIds: [],
    }
  );
}

export function markJaipurAaravMet(progress: LocalProgressV1): LocalProgressV1 {
  const activeReplay = getActiveReplayAttempt(progress, 'india');
  if (activeReplay) {
    if (activeReplay.metAarav) {
      return progress;
    }
    const replayState = getReplayState(progress);
    return {
      ...progress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          india: {
            ...activeReplay,
            metAarav: true,
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[JAIPUR_MISSION_ID] ?? {
    status: 'not_started' as const,
    currentStage: 'discover' as const,
    completedActivityIds: [],
  };
  if (existing.metAarav && existing.status !== 'not_started') {
    return progress;
  }
  return {
    ...progress,
    missionProgress: {
      ...progress.missionProgress,
      [JAIPUR_MISSION_ID]: {
        ...existing,
        status: existing.status === 'completed' ? 'completed' : 'in_progress',
        metAarav: true,
      },
    },
  };
}

export function collectJaipurVocabObject(
  progress: LocalProgressV1,
  objectId: JaipurVocabObjectId,
): LocalProgressV1 {
  if (!VALID_JAIPUR_VOCAB_IDS.has(objectId)) {
    return progress;
  }

  const activeReplay = getActiveReplayAttempt(progress, 'india');
  if (activeReplay) {
    const currentFound = Array.from(
      new Set(
        (activeReplay.wordDetectiveFoundIds ?? []).filter((id) => VALID_JAIPUR_VOCAB_IDS.has(id)),
      ),
    );
    const nextFound = currentFound.includes(objectId)
      ? currentFound
      : [...currentFound, objectId];
    const alreadyInAttempt = activeReplay.completedActivityIds.includes(WORD_DETECTIVE_ACTIVITY_ID);
    const allFound = nextFound.length >= JAIPUR_VOCAB_OBJECTS.length;
    const addActivityToAttempt = allFound && !alreadyInAttempt;
    const nextStage: LearningStageId =
      (allFound || alreadyInAttempt) && activeReplay.currentStage === 'discover'
        ? 'build'
        : activeReplay.currentStage;

    if (
      currentFound.includes(objectId) &&
      !addActivityToAttempt &&
      activeReplay.currentStage === nextStage
    ) {
      return progress;
    }

    const lifetime = progress.missionProgress[JAIPUR_MISSION_ID] ?? {
      status: 'not_started' as const,
      currentStage: 'discover' as const,
      completedActivityIds: [],
    };
    const lifetimeAlreadyRewarded = lifetime.completedActivityIds.includes(
      WORD_DETECTIVE_ACTIVITY_ID,
    );
    const shouldGrantXp = allFound && !lifetimeAlreadyRewarded;
    const replayState = getReplayState(progress);

    return {
      ...progress,
      rewards: shouldGrantXp
        ? {
            ...progress.rewards,
            xp: progress.rewards.xp + WORD_DETECTIVE_XP_REWARD,
          }
        : progress.rewards,
      missionProgress: shouldGrantXp
        ? {
            ...progress.missionProgress,
            [JAIPUR_MISSION_ID]: {
              ...lifetime,
              status: lifetime.status === 'completed' ? 'completed' : 'in_progress',
              currentStage:
                lifetime.currentStage === 'discover' ? 'build' : lifetime.currentStage,
              wordDetectiveFoundIds: nextFound,
              completedActivityIds: [
                ...lifetime.completedActivityIds,
                WORD_DETECTIVE_ACTIVITY_ID,
              ],
            },
          }
        : progress.missionProgress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          india: {
            ...activeReplay,
            currentStage: nextStage,
            wordDetectiveFoundIds: nextFound,
            completedActivityIds: addActivityToAttempt
              ? [...activeReplay.completedActivityIds, WORD_DETECTIVE_ACTIVITY_ID]
              : activeReplay.completedActivityIds,
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[JAIPUR_MISSION_ID] ?? {
    status: 'not_started' as const,
    currentStage: 'discover' as const,
    completedActivityIds: [],
  };
  const currentFound = Array.from(
    new Set(
      (existing.wordDetectiveFoundIds ?? []).filter((id) => VALID_JAIPUR_VOCAB_IDS.has(id)),
    ),
  );
  const nextFound = currentFound.includes(objectId)
    ? currentFound
    : [...currentFound, objectId];

  const alreadyRewarded = existing.completedActivityIds.includes(WORD_DETECTIVE_ACTIVITY_ID);
  const allFound = nextFound.length >= JAIPUR_VOCAB_OBJECTS.length;
  const shouldGrantXp = allFound && !alreadyRewarded;
  const shouldAdvanceToBuild =
    (allFound || alreadyRewarded) && existing.currentStage === 'discover';

  if (
    currentFound.includes(objectId) &&
    !shouldGrantXp &&
    !shouldAdvanceToBuild &&
    existing.status !== 'not_started'
  ) {
    return progress;
  }

  return {
    ...progress,
    rewards: shouldGrantXp
      ? {
          ...progress.rewards,
          xp: progress.rewards.xp + WORD_DETECTIVE_XP_REWARD,
        }
      : progress.rewards,
    missionProgress: {
      ...progress.missionProgress,
      [JAIPUR_MISSION_ID]: {
        ...existing,
        status: existing.status === 'completed' ? 'completed' : 'in_progress',
        currentStage: shouldAdvanceToBuild ? 'build' : existing.currentStage,
        wordDetectiveFoundIds: nextFound,
        completedActivityIds: shouldGrantXp
          ? [...existing.completedActivityIds, WORD_DETECTIVE_ACTIVITY_ID]
          : existing.completedActivityIds,
      },
    },
  };
}

export function isJaipurBuildUnlocked(progress: LocalProgressV1): boolean {
  const entry = getJaipurEffectiveEntry(progress);
  return (
    entry.completedActivityIds.includes(WORD_DETECTIVE_ACTIVITY_ID) ||
    entry.currentStage === 'build' ||
    entry.currentStage === 'practice' ||
    entry.currentStage === 'perform'
  );
}

export function isJaipurPracticeUnlocked(progress: LocalProgressV1): boolean {
  const entry = getJaipurEffectiveEntry(progress);
  return (
    entry.completedActivityIds.includes(SENTENCE_TRAIN_ACTIVITY_ID) ||
    entry.currentStage === 'practice' ||
    entry.currentStage === 'perform'
  );
}

export function completeJaipurSentenceTrain(progress: LocalProgressV1): LocalProgressV1 {
  const activeReplay = getActiveReplayAttempt(progress, 'india');
  if (activeReplay) {
    if (!activeReplay.completedActivityIds.includes(WORD_DETECTIVE_ACTIVITY_ID)) {
      return progress;
    }
    const alreadyInAttempt = activeReplay.completedActivityIds.includes(SENTENCE_TRAIN_ACTIVITY_ID);
    const nextStage: LearningStageId =
      activeReplay.currentStage === 'discover' || activeReplay.currentStage === 'build'
        ? 'practice'
        : activeReplay.currentStage;

    const lifetime = progress.missionProgress[JAIPUR_MISSION_ID] ?? {
      status: 'not_started' as const,
      currentStage: 'discover' as const,
      completedActivityIds: [],
    };
    const lifetimeCanGrant =
      lifetime.completedActivityIds.includes(WORD_DETECTIVE_ACTIVITY_ID) &&
      !lifetime.completedActivityIds.includes(SENTENCE_TRAIN_ACTIVITY_ID);

    if (alreadyInAttempt && activeReplay.currentStage === nextStage && !lifetimeCanGrant) {
      return progress;
    }

    const replayState = getReplayState(progress);
    return {
      ...progress,
      rewards: lifetimeCanGrant
        ? {
            ...progress.rewards,
            xp: progress.rewards.xp + SENTENCE_TRAIN_XP_REWARD,
          }
        : progress.rewards,
      missionProgress: lifetimeCanGrant
        ? {
            ...progress.missionProgress,
            [JAIPUR_MISSION_ID]: {
              ...lifetime,
              status: lifetime.status === 'completed' ? 'completed' : 'in_progress',
              currentStage:
                lifetime.currentStage === 'discover' || lifetime.currentStage === 'build'
                  ? 'practice'
                  : lifetime.currentStage,
              completedActivityIds: [
                ...lifetime.completedActivityIds,
                SENTENCE_TRAIN_ACTIVITY_ID,
              ],
            },
          }
        : progress.missionProgress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          india: {
            ...activeReplay,
            currentStage: nextStage,
            completedActivityIds: alreadyInAttempt
              ? activeReplay.completedActivityIds
              : [...activeReplay.completedActivityIds, SENTENCE_TRAIN_ACTIVITY_ID],
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[JAIPUR_MISSION_ID] ?? {
    status: 'not_started' as const,
    currentStage: 'discover' as const,
    completedActivityIds: [],
  };

  // Strict unlock guard: BUILD cannot be completed before DISCOVER (word_detective) is complete
  if (!existing.completedActivityIds.includes(WORD_DETECTIVE_ACTIVITY_ID)) {
    return progress;
  }

  const alreadyCompleted = existing.completedActivityIds.includes(SENTENCE_TRAIN_ACTIVITY_ID);
  const nextStage =
    existing.currentStage === 'discover' || existing.currentStage === 'build'
      ? ('practice' as const)
      : existing.currentStage;

  if (alreadyCompleted && existing.currentStage === nextStage && existing.status !== 'not_started') {
    return progress;
  }

  return {
    ...progress,
    rewards: !alreadyCompleted
      ? {
          ...progress.rewards,
          xp: progress.rewards.xp + SENTENCE_TRAIN_XP_REWARD,
        }
      : progress.rewards,
    missionProgress: {
      ...progress.missionProgress,
      [JAIPUR_MISSION_ID]: {
        ...existing,
        status: existing.status === 'completed' ? 'completed' : 'in_progress',
        currentStage: nextStage,
        completedActivityIds: alreadyCompleted
          ? existing.completedActivityIds
          : [...existing.completedActivityIds, SENTENCE_TRAIN_ACTIVITY_ID],
      },
    },
  };
}

export function isJaipurPerformUnlocked(progress: LocalProgressV1): boolean {
  const entry = getJaipurEffectiveEntry(progress);
  return (
    entry.completedActivityIds.includes(SPOT_AND_SPEAK_ACTIVITY_ID) ||
    entry.currentStage === 'perform'
  );
}

export function startJaipurSpotAndSpeak(progress: LocalProgressV1): LocalProgressV1 {
  const activeReplay = getActiveReplayAttempt(progress, 'india');
  if (activeReplay) {
    if (!activeReplay.completedActivityIds.includes(SENTENCE_TRAIN_ACTIVITY_ID)) {
      return progress;
    }
    if (activeReplay.spotAndSpeakStarted) {
      return progress;
    }
    const replayState = getReplayState(progress);
    return {
      ...progress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          india: {
            ...activeReplay,
            spotAndSpeakStarted: true,
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[JAIPUR_MISSION_ID];
  if (!existing || !existing.completedActivityIds.includes(SENTENCE_TRAIN_ACTIVITY_ID)) {
    return progress;
  }
  if (existing.spotAndSpeakStarted) {
    return progress;
  }
  return {
    ...progress,
    missionProgress: {
      ...progress.missionProgress,
      [JAIPUR_MISSION_ID]: {
        ...existing,
        spotAndSpeakStarted: true,
      },
    },
  };
}

export function completeJaipurSpotAndSpeakObject(
  progress: LocalProgressV1,
  objectId: JaipurVocabObjectId,
): LocalProgressV1 {
  if (!VALID_JAIPUR_VOCAB_IDS.has(objectId)) {
    return progress;
  }

  const activeReplay = getActiveReplayAttempt(progress, 'india');
  if (activeReplay) {
    if (!activeReplay.completedActivityIds.includes(SENTENCE_TRAIN_ACTIVITY_ID)) {
      return progress;
    }
    const currentDone = Array.from(
      new Set(
        (activeReplay.spotAndSpeakDoneIds ?? []).filter((id) => VALID_JAIPUR_VOCAB_IDS.has(id)),
      ),
    );
    const nextDone = currentDone.includes(objectId) ? currentDone : [...currentDone, objectId];
    const alreadyInAttempt = activeReplay.completedActivityIds.includes(SPOT_AND_SPEAK_ACTIVITY_ID);
    const allFiveDone = nextDone.length >= JAIPUR_VOCAB_OBJECTS.length;
    const addActivityToAttempt = allFiveDone && !alreadyInAttempt;
    const nextStage: LearningStageId =
      allFiveDone || alreadyInAttempt ? 'perform' : activeReplay.currentStage;

    const lifetime = progress.missionProgress[JAIPUR_MISSION_ID] ?? {
      status: 'not_started' as const,
      currentStage: 'discover' as const,
      completedActivityIds: [],
    };
    const shouldGrantXp =
      allFiveDone &&
      lifetime.completedActivityIds.includes(SENTENCE_TRAIN_ACTIVITY_ID) &&
      !lifetime.completedActivityIds.includes(SPOT_AND_SPEAK_ACTIVITY_ID);

    if (
      currentDone.includes(objectId) &&
      activeReplay.spotAndSpeakStarted &&
      !addActivityToAttempt &&
      activeReplay.currentStage === nextStage &&
      !shouldGrantXp
    ) {
      return progress;
    }

    const replayState = getReplayState(progress);
    return {
      ...progress,
      rewards: shouldGrantXp
        ? {
            ...progress.rewards,
            xp: progress.rewards.xp + SPOT_AND_SPEAK_XP_REWARD,
          }
        : progress.rewards,
      missionProgress: shouldGrantXp
        ? {
            ...progress.missionProgress,
            [JAIPUR_MISSION_ID]: {
              ...lifetime,
              status: lifetime.status === 'completed' ? 'completed' : 'in_progress',
              currentStage: 'perform',
              spotAndSpeakStarted: true,
              spotAndSpeakDoneIds: nextDone,
              completedActivityIds: [
                ...lifetime.completedActivityIds,
                SPOT_AND_SPEAK_ACTIVITY_ID,
              ],
            },
          }
        : progress.missionProgress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          india: {
            ...activeReplay,
            currentStage: nextStage,
            spotAndSpeakStarted: true,
            spotAndSpeakDoneIds: nextDone,
            completedActivityIds: addActivityToAttempt
              ? [...activeReplay.completedActivityIds, SPOT_AND_SPEAK_ACTIVITY_ID]
              : activeReplay.completedActivityIds,
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[JAIPUR_MISSION_ID];
  // Strict unlock guard: PRACTICE (Spot & Speak) cannot progress before BUILD (sentence_train) completes
  if (!existing || !existing.completedActivityIds.includes(SENTENCE_TRAIN_ACTIVITY_ID)) {
    return progress;
  }

  const currentDone = Array.from(
    new Set(
      (existing.spotAndSpeakDoneIds ?? []).filter((id) => VALID_JAIPUR_VOCAB_IDS.has(id)),
    ),
  );
  const nextDone = currentDone.includes(objectId) ? currentDone : [...currentDone, objectId];

  const alreadyRewarded = existing.completedActivityIds.includes(SPOT_AND_SPEAK_ACTIVITY_ID);
  const allFiveDone = nextDone.length >= JAIPUR_VOCAB_OBJECTS.length;
  const shouldGrantXp = allFiveDone && !alreadyRewarded;
  const nextStage: LearningStageId =
    allFiveDone || alreadyRewarded ? 'perform' : existing.currentStage;

  if (
    currentDone.includes(objectId) &&
    existing.spotAndSpeakStarted &&
    !shouldGrantXp &&
    existing.currentStage === nextStage
  ) {
    return progress;
  }

  return {
    ...progress,
    rewards: shouldGrantXp
      ? {
          ...progress.rewards,
          xp: progress.rewards.xp + SPOT_AND_SPEAK_XP_REWARD,
        }
      : progress.rewards,
    missionProgress: {
      ...progress.missionProgress,
      [JAIPUR_MISSION_ID]: {
        ...existing,
        status: existing.status === 'completed' ? 'completed' : 'in_progress',
        currentStage: nextStage,
        spotAndSpeakStarted: true,
        spotAndSpeakDoneIds: nextDone,
        completedActivityIds: shouldGrantXp
          ? [...existing.completedActivityIds, SPOT_AND_SPEAK_ACTIVITY_ID]
          : existing.completedActivityIds,
      },
    },
  };
}

export function isJaipurMissionCompleted(progress: LocalProgressV1): boolean {
  const entry = progress.missionProgress[JAIPUR_MISSION_ID];
  if (!entry) return false;
  return (
    entry.status === 'completed' ||
    entry.completedActivityIds.includes(FINAL_JAIPUR_SHOWCASE_ACTIVITY_ID)
  );
}

export function completeJaipurFinalShowcase(progress: LocalProgressV1): LocalProgressV1 {
  const activeReplay = getActiveReplayAttempt(progress, 'india');
  if (activeReplay) {
    if (!activeReplay.completedActivityIds.includes(SPOT_AND_SPEAK_ACTIVITY_ID)) {
      return progress;
    }
    const now = new Date().toISOString();
    const attemptWasCompleted =
      activeReplay.status === 'completed' &&
      activeReplay.completedActivityIds.includes(FINAL_JAIPUR_SHOWCASE_ACTIVITY_ID);

    const lifetime = progress.missionProgress[JAIPUR_MISSION_ID] ?? {
      status: 'not_started' as const,
      currentStage: 'discover' as const,
      completedActivityIds: [],
    };
    const lifetimeCanGrant =
      lifetime.completedActivityIds.includes(SPOT_AND_SPEAK_ACTIVITY_ID) &&
      !lifetime.completedActivityIds.includes(FINAL_JAIPUR_SHOWCASE_ACTIVITY_ID);
    const lifetimeNeedsStamp = !progress.rewards.stamps.includes(INDIA_PASSPORT_STAMP_ID);

    if (attemptWasCompleted && !lifetimeCanGrant && !lifetimeNeedsStamp) {
      return progress;
    }

    const replayState = getReplayState(progress);
    const prevHistory = getCountryReplayHistory(progress, 'india');
    const nextCompletedReplayCount = attemptWasCompleted
      ? prevHistory.completedReplayCount
      : prevHistory.completedReplayCount + 1;

    return {
      ...progress,
      rewards: {
        ...progress.rewards,
        xp: lifetimeCanGrant
          ? progress.rewards.xp + FINAL_JAIPUR_SHOWCASE_XP_REWARD
          : progress.rewards.xp,
        stamps:
          (lifetimeCanGrant || isJaipurMissionCompleted(progress)) && lifetimeNeedsStamp
            ? [...progress.rewards.stamps, INDIA_PASSPORT_STAMP_ID]
            : progress.rewards.stamps,
      },
      missionProgress: lifetimeCanGrant
        ? {
            ...progress.missionProgress,
            [JAIPUR_MISSION_ID]: {
              ...lifetime,
              status: 'completed',
              currentStage: 'perform',
              completedActivityIds: [
                ...lifetime.completedActivityIds,
                FINAL_JAIPUR_SHOWCASE_ACTIVITY_ID,
              ],
              completedAt: lifetime.completedAt ?? now,
            },
          }
        : progress.missionProgress,
      replayState: {
        activeAttempts: {
          ...replayState.activeAttempts,
          india: {
            ...activeReplay,
            status: 'completed',
            currentStage: 'perform',
            completedActivityIds: attemptWasCompleted
              ? activeReplay.completedActivityIds
              : [...activeReplay.completedActivityIds, FINAL_JAIPUR_SHOWCASE_ACTIVITY_ID],
            completedAt: activeReplay.completedAt ?? now,
          },
        },
        history: {
          ...replayState.history,
          india: {
            ...prevHistory,
            totalAttemptsStarted: Math.max(
              prevHistory.totalAttemptsStarted,
              activeReplay.attemptNumber,
            ),
            completedReplayCount: nextCompletedReplayCount,
            lastReplayCompletedAt: attemptWasCompleted
              ? prevHistory.lastReplayCompletedAt ?? now
              : now,
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[JAIPUR_MISSION_ID];
  // Strict unlock guard: PERFORM cannot be completed before PRACTICE (spot_and_speak) completes
  if (!existing || !existing.completedActivityIds.includes(SPOT_AND_SPEAK_ACTIVITY_ID)) {
    return progress;
  }

  const alreadyCompletedActivity = existing.completedActivityIds.includes(
    FINAL_JAIPUR_SHOWCASE_ACTIVITY_ID,
  );
  const alreadyHasStamp = progress.rewards.stamps.includes(INDIA_PASSPORT_STAMP_ID);

  if (
    alreadyCompletedActivity &&
    alreadyHasStamp &&
    existing.status === 'completed' &&
    existing.currentStage === 'perform' &&
    Boolean(existing.completedAt)
  ) {
    return progress;
  }

  const nextCompletedIds = alreadyCompletedActivity
    ? existing.completedActivityIds
    : [...existing.completedActivityIds, FINAL_JAIPUR_SHOWCASE_ACTIVITY_ID];

  const nextStamps = alreadyHasStamp
    ? progress.rewards.stamps
    : [...progress.rewards.stamps, INDIA_PASSPORT_STAMP_ID];

  const nextXp = alreadyCompletedActivity
    ? progress.rewards.xp
    : progress.rewards.xp + FINAL_JAIPUR_SHOWCASE_XP_REWARD;

  return {
    ...progress,
    rewards: {
      ...progress.rewards,
      xp: nextXp,
      stamps: nextStamps,
    },
    missionProgress: {
      ...progress.missionProgress,
      [JAIPUR_MISSION_ID]: {
        ...existing,
        status: 'completed',
        currentStage: 'perform',
        completedActivityIds: nextCompletedIds,
        completedAt: existing.completedAt ?? new Date().toISOString(),
      },
    },
  };
}

export { KENYA_MISSION_ID, KENYA_DISCOVERY_ACTIVITY_ID };

export function startKenyaDiscoveryMission(progress: LocalProgressV1): LocalProgressV1 {
  const activeReplay = getActiveReplayAttempt(progress, 'kenya');
  if (activeReplay) {
    if (activeReplay.kenyaDiscoverStarted) {
      return progress;
    }
    const replayState = getReplayState(progress);
    return {
      ...progress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          kenya: {
            ...activeReplay,
            kenyaDiscoverStarted: true,
            kenyaDiscoveredIds: activeReplay.kenyaDiscoveredIds ?? [],
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[KENYA_MISSION_ID] ?? {
    status: 'not_started' as const,
    currentStage: 'discover' as const,
    completedActivityIds: [],
  };
  if (existing.kenyaDiscoverStarted && existing.status !== 'not_started') {
    return progress;
  }
  return {
    ...progress,
    missionProgress: {
      ...progress.missionProgress,
      [KENYA_MISSION_ID]: {
        ...existing,
        status: existing.status === 'completed' ? 'completed' : 'in_progress',
        kenyaDiscoverStarted: true,
        kenyaDiscoveredIds: existing.kenyaDiscoveredIds ?? [],
      },
    },
  };
}

export function completeKenyaDiscoverySpot(
  progress: LocalProgressV1,
  spotId: KenyaLandmarkId,
): LocalProgressV1 {
  if (!VALID_KENYA_LANDMARK_IDS.has(spotId)) {
    return progress;
  }

  const activeReplay = getActiveReplayAttempt(progress, 'kenya');
  if (activeReplay) {
    if (!activeReplay.kenyaDiscoverStarted) {
      return progress;
    }
    const currentDiscovered = Array.from(
      new Set(
        (activeReplay.kenyaDiscoveredIds ?? []).filter((id) => VALID_KENYA_LANDMARK_IDS.has(id)),
      ),
    );
    const nextDiscovered = currentDiscovered.includes(spotId)
      ? currentDiscovered
      : [...currentDiscovered, spotId];
    const alreadyInAttempt = activeReplay.completedActivityIds.includes(KENYA_DISCOVERY_ACTIVITY_ID);
    const allDiscovered = nextDiscovered.length >= KENYA_DISCOVERY_TASKS.length;
    const addActivityToAttempt = allDiscovered && !alreadyInAttempt;
    const nextStage: LearningStageId =
      (allDiscovered || alreadyInAttempt) && activeReplay.currentStage === 'discover'
        ? 'build'
        : activeReplay.currentStage;

    const lifetime = progress.missionProgress[KENYA_MISSION_ID] ?? {
      status: 'not_started' as const,
      currentStage: 'discover' as const,
      completedActivityIds: [],
    };
    const shouldGrantXp =
      allDiscovered && !lifetime.completedActivityIds.includes(KENYA_DISCOVERY_ACTIVITY_ID);

    if (
      currentDiscovered.includes(spotId) &&
      !addActivityToAttempt &&
      activeReplay.currentStage === nextStage &&
      !shouldGrantXp
    ) {
      return progress;
    }

    const replayState = getReplayState(progress);
    return {
      ...progress,
      rewards: shouldGrantXp
        ? {
            ...progress.rewards,
            xp: progress.rewards.xp + KENYA_DISCOVERY_XP_REWARD,
          }
        : progress.rewards,
      missionProgress: shouldGrantXp
        ? {
            ...progress.missionProgress,
            [KENYA_MISSION_ID]: {
              ...lifetime,
              status: lifetime.status === 'completed' ? 'completed' : 'in_progress',
              currentStage:
                lifetime.currentStage === 'discover' ? 'build' : lifetime.currentStage,
              kenyaDiscoverStarted: true,
              kenyaDiscoveredIds: nextDiscovered,
              completedActivityIds: [
                ...lifetime.completedActivityIds,
                KENYA_DISCOVERY_ACTIVITY_ID,
              ],
            },
          }
        : progress.missionProgress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          kenya: {
            ...activeReplay,
            currentStage: nextStage,
            kenyaDiscoverStarted: true,
            kenyaDiscoveredIds: nextDiscovered,
            completedActivityIds: addActivityToAttempt
              ? [...activeReplay.completedActivityIds, KENYA_DISCOVERY_ACTIVITY_ID]
              : activeReplay.completedActivityIds,
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[KENYA_MISSION_ID];
  // Strict guard: discoveries cannot be completed before Amina starts the mission
  if (!existing || !existing.kenyaDiscoverStarted) {
    return progress;
  }

  const currentDiscovered = Array.from(
    new Set(
      (existing.kenyaDiscoveredIds ?? []).filter((id) => VALID_KENYA_LANDMARK_IDS.has(id)),
    ),
  );
  const nextDiscovered = currentDiscovered.includes(spotId)
    ? currentDiscovered
    : [...currentDiscovered, spotId];

  const alreadyRewarded = existing.completedActivityIds.includes(KENYA_DISCOVERY_ACTIVITY_ID);
  const allDiscovered = nextDiscovered.length >= KENYA_DISCOVERY_TASKS.length;
  const shouldGrantXp = allDiscovered && !alreadyRewarded;
  const shouldAdvanceToBuild =
    (allDiscovered || alreadyRewarded) && existing.currentStage === 'discover';

  if (
    currentDiscovered.includes(spotId) &&
    !shouldGrantXp &&
    !shouldAdvanceToBuild &&
    existing.status !== 'not_started'
  ) {
    return progress;
  }

  return {
    ...progress,
    rewards: shouldGrantXp
      ? {
          ...progress.rewards,
          xp: progress.rewards.xp + KENYA_DISCOVERY_XP_REWARD,
        }
      : progress.rewards,
    missionProgress: {
      ...progress.missionProgress,
      [KENYA_MISSION_ID]: {
        ...existing,
        status: 'in_progress',
        currentStage: shouldAdvanceToBuild ? 'build' : existing.currentStage,
        kenyaDiscoverStarted: true,
        kenyaDiscoveredIds: nextDiscovered,
        completedActivityIds: shouldGrantXp
          ? [...existing.completedActivityIds, KENYA_DISCOVERY_ACTIVITY_ID]
          : existing.completedActivityIds,
      },
    },
  };
}

export function isKenyaBuildUnlocked(progress: LocalProgressV1): boolean {
  const entry = getKenyaEffectiveEntry(progress);
  return (
    entry.completedActivityIds.includes(KENYA_DISCOVERY_ACTIVITY_ID) ||
    entry.currentStage === 'build' ||
    entry.currentStage === 'practice' ||
    entry.currentStage === 'perform'
  );
}

export { KENYA_BUILD_ACTIVITY_ID };

export function isKenyaPracticeUnlocked(progress: LocalProgressV1): boolean {
  const entry = getKenyaEffectiveEntry(progress);
  return (
    entry.completedActivityIds.includes(KENYA_BUILD_ACTIVITY_ID) ||
    entry.currentStage === 'practice' ||
    entry.currentStage === 'perform'
  );
}

export function startKenyaBuildMission(progress: LocalProgressV1): LocalProgressV1 {
  const activeReplay = getActiveReplayAttempt(progress, 'kenya');
  if (activeReplay) {
    if (!activeReplay.completedActivityIds.includes(KENYA_DISCOVERY_ACTIVITY_ID)) {
      return progress;
    }
    if (activeReplay.kenyaBuildStarted) {
      return progress;
    }
    const replayState = getReplayState(progress);
    return {
      ...progress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          kenya: {
            ...activeReplay,
            currentStage:
              activeReplay.currentStage === 'discover' ? 'build' : activeReplay.currentStage,
            kenyaBuildStarted: true,
            kenyaBuiltSentences: activeReplay.kenyaBuiltSentences ?? {},
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[KENYA_MISSION_ID];
  // Strict unlock guard: BUILD cannot start before kenya_wildlife_discovery is complete
  if (!existing || !existing.completedActivityIds.includes(KENYA_DISCOVERY_ACTIVITY_ID)) {
    return progress;
  }
  if (existing.kenyaBuildStarted) {
    return progress;
  }
  return {
    ...progress,
    missionProgress: {
      ...progress.missionProgress,
      [KENYA_MISSION_ID]: {
        ...existing,
        status: 'in_progress',
        currentStage: existing.currentStage === 'discover' ? 'build' : existing.currentStage,
        kenyaBuildStarted: true,
        kenyaBuiltSentences: existing.kenyaBuiltSentences ?? {},
      },
    },
  };
}

export function completeKenyaBuildStation(
  progress: LocalProgressV1,
  stationId: KenyaLandmarkId,
  sentence: string,
): LocalProgressV1 {
  if (!VALID_KENYA_LANDMARK_IDS.has(stationId)) {
    return progress;
  }
  if (!isValidSavedKenyaBuildSentence(stationId, sentence)) {
    return progress;
  }

  const activeReplay = getActiveReplayAttempt(progress, 'kenya');
  if (activeReplay) {
    if (
      !activeReplay.completedActivityIds.includes(KENYA_DISCOVERY_ACTIVITY_ID) ||
      !activeReplay.kenyaBuildStarted
    ) {
      return progress;
    }

    const sanitizedExisting: Record<string, string> = {};
    if (activeReplay.kenyaBuiltSentences) {
      for (const [k, v] of Object.entries(activeReplay.kenyaBuiltSentences)) {
        if (
          VALID_KENYA_LANDMARK_IDS.has(k) &&
          isValidSavedKenyaBuildSentence(k as KenyaLandmarkId, v)
        ) {
          sanitizedExisting[k] = v.trim();
        }
      }
    }

    const trimmedSentence = sentence.trim();
    const nextBuiltMap: Record<string, string> = {
      ...sanitizedExisting,
      [stationId]: trimmedSentence,
    };

    const completedStationCount = Object.keys(nextBuiltMap).length;
    const alreadyInAttempt = activeReplay.completedActivityIds.includes(KENYA_BUILD_ACTIVITY_ID);
    const allBuilt = completedStationCount >= KENYA_BUILD_STATIONS.length;
    const addActivityToAttempt = allBuilt && !alreadyInAttempt;
    const nextStage: LearningStageId =
      allBuilt || alreadyInAttempt
        ? activeReplay.currentStage === 'discover' || activeReplay.currentStage === 'build'
          ? 'practice'
          : activeReplay.currentStage
        : activeReplay.currentStage;

    const lifetime = progress.missionProgress[KENYA_MISSION_ID] ?? {
      status: 'not_started' as const,
      currentStage: 'discover' as const,
      completedActivityIds: [],
    };
    const shouldGrantXp =
      allBuilt &&
      lifetime.completedActivityIds.includes(KENYA_DISCOVERY_ACTIVITY_ID) &&
      !lifetime.completedActivityIds.includes(KENYA_BUILD_ACTIVITY_ID);

    if (
      sanitizedExisting[stationId] === trimmedSentence &&
      !addActivityToAttempt &&
      activeReplay.currentStage === nextStage &&
      !shouldGrantXp
    ) {
      return progress;
    }

    const replayState = getReplayState(progress);
    return {
      ...progress,
      rewards: shouldGrantXp
        ? {
            ...progress.rewards,
            xp: progress.rewards.xp + KENYA_BUILD_XP_REWARD,
          }
        : progress.rewards,
      missionProgress: shouldGrantXp
        ? {
            ...progress.missionProgress,
            [KENYA_MISSION_ID]: {
              ...lifetime,
              status: lifetime.status === 'completed' ? 'completed' : 'in_progress',
              currentStage:
                lifetime.currentStage === 'discover' || lifetime.currentStage === 'build'
                  ? 'practice'
                  : lifetime.currentStage,
              kenyaBuildStarted: true,
              kenyaBuiltSentences: nextBuiltMap,
              completedActivityIds: [
                ...lifetime.completedActivityIds,
                KENYA_BUILD_ACTIVITY_ID,
              ],
            },
          }
        : progress.missionProgress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          kenya: {
            ...activeReplay,
            currentStage: nextStage,
            kenyaBuildStarted: true,
            kenyaBuiltSentences: nextBuiltMap,
            completedActivityIds: addActivityToAttempt
              ? [...activeReplay.completedActivityIds, KENYA_BUILD_ACTIVITY_ID]
              : activeReplay.completedActivityIds,
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[KENYA_MISSION_ID];
  // Strict unlock guard: BUILD requires completed DISCOVER and Amina mission start
  if (
    !existing ||
    !existing.completedActivityIds.includes(KENYA_DISCOVERY_ACTIVITY_ID) ||
    !existing.kenyaBuildStarted
  ) {
    return progress;
  }

  const sanitizedExisting: Record<string, string> = {};
  if (existing.kenyaBuiltSentences) {
    for (const [k, v] of Object.entries(existing.kenyaBuiltSentences)) {
      if (
        VALID_KENYA_LANDMARK_IDS.has(k) &&
        isValidSavedKenyaBuildSentence(k as KenyaLandmarkId, v)
      ) {
        sanitizedExisting[k] = v.trim();
      }
    }
  }

  const trimmedSentence = sentence.trim();
  const nextBuiltMap: Record<string, string> = {
    ...sanitizedExisting,
    [stationId]: trimmedSentence,
  };

  const completedStationCount = Object.keys(nextBuiltMap).length;
  const alreadyRewarded = existing.completedActivityIds.includes(KENYA_BUILD_ACTIVITY_ID);
  const allBuilt = completedStationCount >= KENYA_BUILD_STATIONS.length;
  const shouldGrantXp = allBuilt && !alreadyRewarded;
  const nextStage: LearningStageId =
    allBuilt || alreadyRewarded
      ? existing.currentStage === 'discover' || existing.currentStage === 'build'
        ? 'practice'
        : existing.currentStage
      : existing.currentStage;

  if (
    sanitizedExisting[stationId] === trimmedSentence &&
    !shouldGrantXp &&
    existing.currentStage === nextStage
  ) {
    return progress;
  }

  return {
    ...progress,
    rewards: shouldGrantXp
      ? {
          ...progress.rewards,
          xp: progress.rewards.xp + KENYA_BUILD_XP_REWARD,
        }
      : progress.rewards,
    missionProgress: {
      ...progress.missionProgress,
      [KENYA_MISSION_ID]: {
        ...existing,
        status: 'in_progress',
        currentStage: nextStage,
        kenyaBuildStarted: true,
        kenyaBuiltSentences: nextBuiltMap,
        completedActivityIds: shouldGrantXp
          ? [...existing.completedActivityIds, KENYA_BUILD_ACTIVITY_ID]
          : existing.completedActivityIds,
      },
    },
  };
}

export { KENYA_PRACTICE_ACTIVITY_ID, KENYA_PRACTICE_XP_REWARD };

export function isKenyaPerformUnlocked(progress: LocalProgressV1): boolean {
  const entry = getKenyaEffectiveEntry(progress);
  return (
    entry.completedActivityIds.includes(KENYA_PRACTICE_ACTIVITY_ID) ||
    entry.currentStage === 'perform'
  );
}

export function startKenyaPracticeMission(progress: LocalProgressV1): LocalProgressV1 {
  const activeReplay = getActiveReplayAttempt(progress, 'kenya');
  if (activeReplay) {
    if (!activeReplay.completedActivityIds.includes(KENYA_BUILD_ACTIVITY_ID)) {
      return progress;
    }
    if (activeReplay.kenyaPracticeStarted) {
      return progress;
    }
    const replayState = getReplayState(progress);
    return {
      ...progress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          kenya: {
            ...activeReplay,
            currentStage: activeReplay.currentStage === 'perform' ? 'perform' : 'practice',
            kenyaPracticeStarted: true,
            kenyaPracticedConversationIds: activeReplay.kenyaPracticedConversationIds ?? [],
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[KENYA_MISSION_ID];
  // Strict unlock guard: PRACTICE requires completed BUILD (kenya_safari_fact_builder)
  if (!existing || !existing.completedActivityIds.includes(KENYA_BUILD_ACTIVITY_ID)) {
    return progress;
  }
  if (existing.kenyaPracticeStarted) {
    return progress;
  }
  return {
    ...progress,
    missionProgress: {
      ...progress.missionProgress,
      [KENYA_MISSION_ID]: {
        ...existing,
        status: 'in_progress',
        currentStage: existing.currentStage === 'perform' ? 'perform' : 'practice',
        kenyaPracticeStarted: true,
        kenyaPracticedConversationIds: existing.kenyaPracticedConversationIds ?? [],
      },
    },
  };
}

export function completeKenyaPracticeConversation(
  progress: LocalProgressV1,
  conversationId: KenyaLandmarkId,
): LocalProgressV1 {
  if (!VALID_KENYA_LANDMARK_IDS.has(conversationId)) {
    return progress;
  }

  const activeReplay = getActiveReplayAttempt(progress, 'kenya');
  if (activeReplay) {
    if (
      !activeReplay.completedActivityIds.includes(KENYA_BUILD_ACTIVITY_ID) ||
      !activeReplay.kenyaPracticeStarted
    ) {
      return progress;
    }
    const currentDone = Array.from(
      new Set(
        (activeReplay.kenyaPracticedConversationIds ?? []).filter((id) =>
          VALID_KENYA_LANDMARK_IDS.has(id),
        ),
      ),
    );
    const nextDone = currentDone.includes(conversationId)
      ? currentDone
      : [...currentDone, conversationId];
    const alreadyInAttempt = activeReplay.completedActivityIds.includes(KENYA_PRACTICE_ACTIVITY_ID);
    const allCompleted = nextDone.length >= KENYA_PRACTICE_CONVERSATIONS.length;
    const addActivityToAttempt = allCompleted && !alreadyInAttempt;
    const nextStage: LearningStageId =
      allCompleted || alreadyInAttempt ? 'perform' : activeReplay.currentStage;

    const lifetime = progress.missionProgress[KENYA_MISSION_ID] ?? {
      status: 'not_started' as const,
      currentStage: 'discover' as const,
      completedActivityIds: [],
    };
    const shouldGrantXp =
      allCompleted &&
      lifetime.completedActivityIds.includes(KENYA_BUILD_ACTIVITY_ID) &&
      !lifetime.completedActivityIds.includes(KENYA_PRACTICE_ACTIVITY_ID);

    if (
      currentDone.includes(conversationId) &&
      !addActivityToAttempt &&
      activeReplay.currentStage === nextStage &&
      !shouldGrantXp
    ) {
      return progress;
    }

    const replayState = getReplayState(progress);
    return {
      ...progress,
      rewards: shouldGrantXp
        ? {
            ...progress.rewards,
            xp: progress.rewards.xp + KENYA_PRACTICE_XP_REWARD,
          }
        : progress.rewards,
      missionProgress: shouldGrantXp
        ? {
            ...progress.missionProgress,
            [KENYA_MISSION_ID]: {
              ...lifetime,
              status: lifetime.status === 'completed' ? 'completed' : 'in_progress',
              currentStage: 'perform',
              kenyaPracticeStarted: true,
              kenyaPracticedConversationIds: nextDone,
              completedActivityIds: [
                ...lifetime.completedActivityIds,
                KENYA_PRACTICE_ACTIVITY_ID,
              ],
            },
          }
        : progress.missionProgress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          kenya: {
            ...activeReplay,
            currentStage: nextStage,
            kenyaPracticeStarted: true,
            kenyaPracticedConversationIds: nextDone,
            completedActivityIds: addActivityToAttempt
              ? [...activeReplay.completedActivityIds, KENYA_PRACTICE_ACTIVITY_ID]
              : activeReplay.completedActivityIds,
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[KENYA_MISSION_ID];
  // Strict unlock guard: requires completed BUILD and Amina Safari Tour start
  if (
    !existing ||
    !existing.completedActivityIds.includes(KENYA_BUILD_ACTIVITY_ID) ||
    !existing.kenyaPracticeStarted
  ) {
    return progress;
  }

  const currentDone = Array.from(
    new Set(
      (existing.kenyaPracticedConversationIds ?? []).filter((id) =>
        VALID_KENYA_LANDMARK_IDS.has(id),
      ),
    ),
  );
  const nextDone = currentDone.includes(conversationId)
    ? currentDone
    : [...currentDone, conversationId];

  const alreadyRewarded = existing.completedActivityIds.includes(KENYA_PRACTICE_ACTIVITY_ID);
  const allCompleted = nextDone.length >= KENYA_PRACTICE_CONVERSATIONS.length;
  const shouldGrantXp = allCompleted && !alreadyRewarded;
  const nextStage: LearningStageId =
    allCompleted || alreadyRewarded ? 'perform' : existing.currentStage;

  if (
    currentDone.includes(conversationId) &&
    !shouldGrantXp &&
    existing.currentStage === nextStage &&
    existing.status === 'in_progress'
  ) {
    return progress;
  }

  return {
    ...progress,
    rewards: shouldGrantXp
      ? {
          ...progress.rewards,
          xp: progress.rewards.xp + KENYA_PRACTICE_XP_REWARD,
        }
      : progress.rewards,
    missionProgress: {
      ...progress.missionProgress,
      [KENYA_MISSION_ID]: {
        ...existing,
        status: 'in_progress',
        currentStage: nextStage,
        kenyaPracticeStarted: true,
        kenyaPracticedConversationIds: nextDone,
        completedActivityIds: shouldGrantXp
          ? [...existing.completedActivityIds, KENYA_PRACTICE_ACTIVITY_ID]
          : existing.completedActivityIds,
      },
    },
  };
}

export { KENYA_PERFORM_ACTIVITY_ID, KENYA_PERFORM_XP_REWARD, KENYA_PASSPORT_STAMP_ID };

export function isKenyaMissionCompleted(progress: LocalProgressV1): boolean {
  const entry = progress.missionProgress[KENYA_MISSION_ID];
  if (!entry) return false;
  return (
    entry.status === 'completed' ||
    entry.completedActivityIds.includes(KENYA_PERFORM_ACTIVITY_ID)
  );
}

export function startKenyaPerformMission(progress: LocalProgressV1): LocalProgressV1 {
  const activeReplay = getActiveReplayAttempt(progress, 'kenya');
  if (activeReplay) {
    if (!activeReplay.completedActivityIds.includes(KENYA_PRACTICE_ACTIVITY_ID)) {
      return progress;
    }
    if (activeReplay.kenyaPerformStarted && activeReplay.currentStage === 'perform') {
      return progress;
    }
    const replayState = getReplayState(progress);
    return {
      ...progress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          kenya: {
            ...activeReplay,
            currentStage: 'perform',
            kenyaPerformStarted: true,
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[KENYA_MISSION_ID];
  // Strict unlock guard: PERFORM requires completed PRACTICE (kenya_wildspeak_safari_tour)
  if (!existing || !existing.completedActivityIds.includes(KENYA_PRACTICE_ACTIVITY_ID)) {
    return progress;
  }
  if (existing.kenyaPerformStarted && existing.currentStage === 'perform') {
    return progress;
  }
  return {
    ...progress,
    missionProgress: {
      ...progress.missionProgress,
      [KENYA_MISSION_ID]: {
        ...existing,
        status: existing.status === 'completed' ? 'completed' : 'in_progress',
        currentStage: 'perform',
        kenyaPerformStarted: true,
      },
    },
  };
}

export function completeKenyaFinalPerform(progress: LocalProgressV1): LocalProgressV1 {
  const activeReplay = getActiveReplayAttempt(progress, 'kenya');
  if (activeReplay) {
    if (
      !activeReplay.completedActivityIds.includes(KENYA_PRACTICE_ACTIVITY_ID) ||
      !activeReplay.kenyaPerformStarted
    ) {
      return progress;
    }
    const now = new Date().toISOString();
    const attemptWasCompleted =
      activeReplay.status === 'completed' &&
      activeReplay.completedActivityIds.includes(KENYA_PERFORM_ACTIVITY_ID);

    const lifetime = progress.missionProgress[KENYA_MISSION_ID] ?? {
      status: 'not_started' as const,
      currentStage: 'discover' as const,
      completedActivityIds: [],
    };
    const lifetimeCanGrant =
      lifetime.completedActivityIds.includes(KENYA_PRACTICE_ACTIVITY_ID) &&
      !lifetime.completedActivityIds.includes(KENYA_PERFORM_ACTIVITY_ID);
    const lifetimeNeedsStamp = !progress.rewards.stamps.includes(KENYA_PASSPORT_STAMP_ID);

    if (attemptWasCompleted && !lifetimeCanGrant && !lifetimeNeedsStamp) {
      return progress;
    }

    const replayState = getReplayState(progress);
    const prevHistory = getCountryReplayHistory(progress, 'kenya');
    const nextCompletedReplayCount = attemptWasCompleted
      ? prevHistory.completedReplayCount
      : prevHistory.completedReplayCount + 1;

    const shouldUnlockScotland = lifetimeCanGrant || isKenyaMissionCompleted(progress);
    const nextUnlocked = shouldUnlockScotland
      ? Array.from(new Set<CountryId>([...progress.unlockedCountryIds, 'india', 'kenya', 'scotland']))
      : progress.unlockedCountryIds;

    return {
      ...progress,
      unlockedCountryIds: nextUnlocked,
      rewards: {
        ...progress.rewards,
        xp: lifetimeCanGrant
          ? progress.rewards.xp + KENYA_PERFORM_XP_REWARD
          : progress.rewards.xp,
        stamps:
          shouldUnlockScotland && lifetimeNeedsStamp
            ? [...progress.rewards.stamps, KENYA_PASSPORT_STAMP_ID]
            : progress.rewards.stamps,
      },
      missionProgress: lifetimeCanGrant
        ? {
            ...progress.missionProgress,
            [KENYA_MISSION_ID]: {
              ...lifetime,
              status: 'completed',
              currentStage: 'perform',
              kenyaPerformStarted: true,
              completedActivityIds: [
                ...lifetime.completedActivityIds,
                KENYA_PERFORM_ACTIVITY_ID,
              ],
              completedAt: lifetime.completedAt ?? now,
            },
          }
        : progress.missionProgress,
      replayState: {
        activeAttempts: {
          ...replayState.activeAttempts,
          kenya: {
            ...activeReplay,
            status: 'completed',
            currentStage: 'perform',
            kenyaPerformStarted: true,
            completedActivityIds: attemptWasCompleted
              ? activeReplay.completedActivityIds
              : [...activeReplay.completedActivityIds, KENYA_PERFORM_ACTIVITY_ID],
            completedAt: activeReplay.completedAt ?? now,
          },
        },
        history: {
          ...replayState.history,
          kenya: {
            ...prevHistory,
            totalAttemptsStarted: Math.max(
              prevHistory.totalAttemptsStarted,
              activeReplay.attemptNumber,
            ),
            completedReplayCount: nextCompletedReplayCount,
            lastReplayCompletedAt: attemptWasCompleted
              ? prevHistory.lastReplayCompletedAt ?? now
              : now,
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[KENYA_MISSION_ID];
  // Strict gating: requires PRACTICE completed AND PERFORM started via Amina
  if (
    !existing ||
    !existing.completedActivityIds.includes(KENYA_PRACTICE_ACTIVITY_ID) ||
    !existing.kenyaPerformStarted
  ) {
    return progress;
  }

  const alreadyCompletedActivity = existing.completedActivityIds.includes(
    KENYA_PERFORM_ACTIVITY_ID,
  );
  const alreadyHasStamp = progress.rewards.stamps.includes(KENYA_PASSPORT_STAMP_ID);

  if (alreadyCompletedActivity && alreadyHasStamp && existing.status === 'completed') {
    return progress;
  }

  const nextCompletedIds = alreadyCompletedActivity
    ? existing.completedActivityIds
    : [...existing.completedActivityIds, KENYA_PERFORM_ACTIVITY_ID];

  const nextStamps = alreadyHasStamp
    ? progress.rewards.stamps
    : [...progress.rewards.stamps, KENYA_PASSPORT_STAMP_ID];

  const nextXp = alreadyCompletedActivity
    ? progress.rewards.xp
    : progress.rewards.xp + KENYA_PERFORM_XP_REWARD;

  const nextUnlocked = Array.from(
    new Set<CountryId>([...progress.unlockedCountryIds, 'india', 'kenya', 'scotland']),
  );

  return {
    ...progress,
    unlockedCountryIds: nextUnlocked,
    rewards: {
      ...progress.rewards,
      xp: nextXp,
      stamps: nextStamps,
    },
    missionProgress: {
      ...progress.missionProgress,
      [KENYA_MISSION_ID]: {
        ...existing,
        status: 'completed',
        currentStage: 'perform',
        kenyaPerformStarted: true,
        completedActivityIds: nextCompletedIds,
        completedAt: existing.completedAt ?? new Date().toISOString(),
      },
    },
  };
}

export { SCOTLAND_MISSION_ID, SCOTLAND_STAGE_ACTIVITY_IDS };

export function isScotlandUnlocked(progress: LocalProgressV1): boolean {
  return isKenyaMissionCompleted(progress);
}

function preserveHighestScotlandStage(
  stage: LearningStageId | undefined,
): LearningStageId {
  if (stage === 'perform') return 'perform';
  if (stage === 'practice') return 'practice';
  if (stage === 'build') return 'build';
  return 'discover';
}

export function markScotlandNpcMet(
  progress: LocalProgressV1,
  npcId: 'eilidh' | 'fiona',
): LocalProgressV1 {
  if (!isScotlandUnlocked(progress)) {
    return progress;
  }

  const activeReplay = getActiveReplayAttempt(progress, 'scotland');
  if (activeReplay) {
    const alreadyMet = npcId === 'eilidh' ? activeReplay.metEilidh : activeReplay.metFiona;
    if (alreadyMet) {
      return progress;
    }
    const replayState = getReplayState(progress);
    return {
      ...progress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          scotland: {
            ...activeReplay,
            ...(npcId === 'eilidh' ? { metEilidh: true } : { metFiona: true }),
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[SCOTLAND_MISSION_ID] ?? {
    status: 'not_started' as const,
    currentStage: 'discover' as const,
    completedActivityIds: [],
  };
  const alreadyMet = npcId === 'eilidh' ? existing.metEilidh : existing.metFiona;
  if (alreadyMet && existing.status === 'in_progress') {
    return progress;
  }
  return {
    ...progress,
    missionProgress: {
      ...progress.missionProgress,
      [SCOTLAND_MISSION_ID]: {
        ...existing,
        status: existing.status === 'completed' ? 'completed' : 'in_progress',
        currentStage: preserveHighestScotlandStage(existing.currentStage),
        ...(npcId === 'eilidh' ? { metEilidh: true } : { metFiona: true }),
      },
    },
  };
}

export function markScotlandPoiExplored(
  progress: LocalProgressV1,
  landmarkId: ScotlandLandmarkId,
): LocalProgressV1 {
  if (!isScotlandUnlocked(progress) || !VALID_SCOTLAND_LANDMARK_IDS.has(landmarkId)) {
    return progress;
  }

  const activeReplay = getActiveReplayAttempt(progress, 'scotland');
  if (activeReplay) {
    const currentExplored = Array.from(
      new Set(
        (activeReplay.scotlandExploredPoiIds ?? []).filter((id) =>
          VALID_SCOTLAND_LANDMARK_IDS.has(id),
        ),
      ),
    );
    if (currentExplored.includes(landmarkId)) {
      return progress;
    }
    const replayState = getReplayState(progress);
    return {
      ...progress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          scotland: {
            ...activeReplay,
            scotlandExploredPoiIds: [...currentExplored, landmarkId],
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[SCOTLAND_MISSION_ID] ?? {
    status: 'not_started' as const,
    currentStage: 'discover' as const,
    completedActivityIds: [],
  };
  const currentExplored = Array.from(
    new Set(
      (existing.scotlandExploredPoiIds ?? []).filter((id) =>
        VALID_SCOTLAND_LANDMARK_IDS.has(id),
      ),
    ),
  );
  if (currentExplored.includes(landmarkId) && existing.status === 'in_progress') {
    return progress;
  }
  const nextExplored = currentExplored.includes(landmarkId)
    ? currentExplored
    : [...currentExplored, landmarkId];

  return {
    ...progress,
    missionProgress: {
      ...progress.missionProgress,
      [SCOTLAND_MISSION_ID]: {
        ...existing,
        status: existing.status === 'completed' ? 'completed' : 'in_progress',
        currentStage: preserveHighestScotlandStage(existing.currentStage),
        scotlandExploredPoiIds: nextExplored,
      },
    },
  };
}

export { SCOTLAND_DISCOVERY_ACTIVITY_ID, SCOTLAND_BUILD_ACTIVITY_ID, SCOTLAND_BUILD_XP_REWARD };

export function isScotlandDiscoverCompleted(progress: LocalProgressV1): boolean {
  const entry = progress.missionProgress[SCOTLAND_MISSION_ID];
  if (!entry) return false;
  return entry.completedActivityIds.includes(SCOTLAND_DISCOVERY_ACTIVITY_ID);
}

export function isScotlandBuildUnlocked(progress: LocalProgressV1): boolean {
  if (!isScotlandUnlocked(progress)) return false;
  const effective = getScotlandEffectiveEntry(progress);
  return effective.completedActivityIds.includes(SCOTLAND_DISCOVERY_ACTIVITY_ID);
}

export function isScotlandBuildCompleted(progress: LocalProgressV1): boolean {
  const entry = progress.missionProgress[SCOTLAND_MISSION_ID];
  if (!entry) return false;
  return entry.completedActivityIds.includes(SCOTLAND_BUILD_ACTIVITY_ID);
}

export function isScotlandPracticeUnlocked(progress: LocalProgressV1): boolean {
  if (!isScotlandUnlocked(progress)) return false;
  const effective = getScotlandEffectiveEntry(progress);
  return (
    effective.completedActivityIds.includes(SCOTLAND_DISCOVERY_ACTIVITY_ID) &&
    effective.completedActivityIds.includes(SCOTLAND_BUILD_ACTIVITY_ID)
  );
}

export function startScotlandDiscoveryMission(progress: LocalProgressV1): LocalProgressV1 {
  if (!isScotlandUnlocked(progress)) {
    return progress;
  }

  const activeReplay = getActiveReplayAttempt(progress, 'scotland');
  if (activeReplay) {
    if (activeReplay.scotlandDiscoverStarted && activeReplay.metEilidh) {
      return progress;
    }
    const replayState = getReplayState(progress);
    return {
      ...progress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          scotland: {
            ...activeReplay,
            currentStage: preserveHighestScotlandStage(activeReplay.currentStage),
            metEilidh: true,
            scotlandDiscoverStarted: true,
            scotlandDiscoveredEvidenceIds: activeReplay.scotlandDiscoveredEvidenceIds ?? [],
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[SCOTLAND_MISSION_ID] ?? {
    status: 'not_started' as const,
    currentStage: 'discover' as const,
    completedActivityIds: [],
  };
  if (existing.scotlandDiscoverStarted && existing.metEilidh && existing.status === 'in_progress') {
    return progress;
  }
  const highest = existing.completedActivityIds.includes(SCOTLAND_PRACTICE_ACTIVITY_ID)
    ? 'perform'
    : existing.completedActivityIds.includes(SCOTLAND_BUILD_ACTIVITY_ID)
      ? 'practice'
      : existing.completedActivityIds.includes(SCOTLAND_DISCOVERY_ACTIVITY_ID)
        ? 'build'
        : 'discover';
  return {
    ...progress,
    missionProgress: {
      ...progress.missionProgress,
      [SCOTLAND_MISSION_ID]: {
        ...existing,
        status: 'in_progress',
        currentStage: highest,
        metEilidh: true,
        scotlandDiscoverStarted: true,
        scotlandDiscoveredEvidenceIds: existing.scotlandDiscoveredEvidenceIds ?? [],
      },
    },
  };
}

export function completeScotlandDiscoveryStation(
  progress: LocalProgressV1,
  stationId: ScotlandLandmarkId,
): LocalProgressV1 {
  if (!isScotlandUnlocked(progress) || !VALID_SCOTLAND_LANDMARK_IDS.has(stationId)) {
    return progress;
  }

  const activeReplay = getActiveReplayAttempt(progress, 'scotland');
  if (activeReplay) {
    if (!activeReplay.scotlandDiscoverStarted) {
      return progress;
    }
    const currentExplored = Array.from(
      new Set(
        (activeReplay.scotlandExploredPoiIds ?? []).filter((id) =>
          VALID_SCOTLAND_LANDMARK_IDS.has(id),
        ),
      ),
    );
    const nextExplored = currentExplored.includes(stationId)
      ? currentExplored
      : [...currentExplored, stationId];

    const currentEvidence = Array.from(
      new Set(
        (activeReplay.scotlandDiscoveredEvidenceIds ?? []).filter((id) =>
          VALID_SCOTLAND_LANDMARK_IDS.has(id),
        ),
      ),
    );
    const nextEvidence = currentEvidence.includes(stationId)
      ? currentEvidence
      : [...currentEvidence, stationId];

    const alreadyInAttempt = activeReplay.completedActivityIds.includes(
      SCOTLAND_DISCOVERY_ACTIVITY_ID,
    );
    const allStationsComplete = nextEvidence.length >= SCOTLAND_EVIDENCE_ITEMS.length;
    const addActivityToAttempt = allStationsComplete && !alreadyInAttempt;
    const nextStage: LearningStageId =
      allStationsComplete || alreadyInAttempt
        ? activeReplay.currentStage === 'perform'
          ? 'perform'
          : activeReplay.currentStage === 'practice'
            ? 'practice'
            : 'build'
        : activeReplay.currentStage;

    const lifetime = progress.missionProgress[SCOTLAND_MISSION_ID] ?? {
      status: 'not_started' as const,
      currentStage: 'discover' as const,
      completedActivityIds: [],
    };
    const shouldGrantXp =
      allStationsComplete &&
      !lifetime.completedActivityIds.includes(SCOTLAND_DISCOVERY_ACTIVITY_ID);

    if (
      currentEvidence.includes(stationId) &&
      currentExplored.includes(stationId) &&
      !addActivityToAttempt &&
      activeReplay.currentStage === nextStage &&
      !shouldGrantXp
    ) {
      return progress;
    }

    const replayState = getReplayState(progress);

    return {
      ...progress,
      rewards: shouldGrantXp
        ? {
            ...progress.rewards,
            xp: progress.rewards.xp + SCOTLAND_DISCOVERY_XP_REWARD,
          }
        : progress.rewards,
      missionProgress: shouldGrantXp
        ? {
            ...progress.missionProgress,
            [SCOTLAND_MISSION_ID]: {
              ...lifetime,
              status: 'in_progress',
              currentStage:
                lifetime.currentStage === 'perform'
                  ? 'perform'
                  : lifetime.currentStage === 'practice'
                    ? 'practice'
                    : 'build',
              metEilidh: true,
              scotlandDiscoverStarted: true,
              scotlandExploredPoiIds: nextExplored,
              scotlandDiscoveredEvidenceIds: nextEvidence,
              completedActivityIds: [
                ...lifetime.completedActivityIds,
                SCOTLAND_DISCOVERY_ACTIVITY_ID,
              ],
            },
          }
        : progress.missionProgress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          scotland: {
            ...activeReplay,
            currentStage: nextStage,
            scotlandDiscoverStarted: true,
            scotlandExploredPoiIds: nextExplored,
            scotlandDiscoveredEvidenceIds: nextEvidence,
            completedActivityIds: addActivityToAttempt
              ? [...activeReplay.completedActivityIds, SCOTLAND_DISCOVERY_ACTIVITY_ID]
              : activeReplay.completedActivityIds,
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[SCOTLAND_MISSION_ID];
  // Strict gating: cannot complete DISCOVER mini-games before Eilidh starts Scottish Culture Quest
  if (!existing || !existing.scotlandDiscoverStarted) {
    return progress;
  }

  const currentExplored = Array.from(
    new Set(
      (existing.scotlandExploredPoiIds ?? []).filter((id) =>
        VALID_SCOTLAND_LANDMARK_IDS.has(id),
      ),
    ),
  );
  const nextExplored = currentExplored.includes(stationId)
    ? currentExplored
    : [...currentExplored, stationId];

  const currentEvidence = Array.from(
    new Set(
      (existing.scotlandDiscoveredEvidenceIds ?? []).filter((id) =>
        VALID_SCOTLAND_LANDMARK_IDS.has(id),
      ),
    ),
  );
  const nextEvidence = currentEvidence.includes(stationId)
    ? currentEvidence
    : [...currentEvidence, stationId];

  const alreadyRewarded = existing.completedActivityIds.includes(SCOTLAND_DISCOVERY_ACTIVITY_ID);
  const allStationsComplete = nextEvidence.length >= SCOTLAND_EVIDENCE_ITEMS.length;
  const shouldGrantXp = allStationsComplete && !alreadyRewarded;
  const nextStage: LearningStageId =
    existing.currentStage === 'perform'
      ? 'perform'
      : existing.currentStage === 'practice'
        ? 'practice'
        : allStationsComplete || alreadyRewarded
          ? 'build'
          : 'discover';

  if (
    currentEvidence.includes(stationId) &&
    currentExplored.includes(stationId) &&
    !shouldGrantXp &&
    existing.currentStage === nextStage &&
    existing.status === 'in_progress'
  ) {
    return progress;
  }

  return {
    ...progress,
    rewards: shouldGrantXp
      ? {
          ...progress.rewards,
          xp: progress.rewards.xp + SCOTLAND_DISCOVERY_XP_REWARD,
        }
      : progress.rewards,
    missionProgress: {
      ...progress.missionProgress,
      [SCOTLAND_MISSION_ID]: {
        ...existing,
        status: 'in_progress',
        currentStage: nextStage,
        scotlandDiscoverStarted: true,
        scotlandExploredPoiIds: nextExplored,
        scotlandDiscoveredEvidenceIds: nextEvidence,
        completedActivityIds: shouldGrantXp
          ? [...existing.completedActivityIds, SCOTLAND_DISCOVERY_ACTIVITY_ID]
          : existing.completedActivityIds,
      },
    },
  };
}

export function startScotlandBuildMission(progress: LocalProgressV1): LocalProgressV1 {
  if (!isScotlandBuildUnlocked(progress)) {
    return progress;
  }

  const activeReplay = getActiveReplayAttempt(progress, 'scotland');
  if (activeReplay) {
    if (activeReplay.scotlandBuildStarted) {
      return progress;
    }
    const replayState = getReplayState(progress);
    return {
      ...progress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          scotland: {
            ...activeReplay,
            currentStage:
              activeReplay.currentStage === 'perform'
                ? 'perform'
                : activeReplay.currentStage === 'practice'
                  ? 'practice'
                  : 'build',
            metEilidh: true,
            scotlandBuildStarted: true,
            scotlandBuiltSentences: activeReplay.scotlandBuiltSentences ?? {},
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[SCOTLAND_MISSION_ID];
  if (!existing || !existing.completedActivityIds.includes(SCOTLAND_DISCOVERY_ACTIVITY_ID)) {
    return progress;
  }
  if (existing.scotlandBuildStarted && existing.status === 'in_progress') {
    return progress;
  }

  return {
    ...progress,
    missionProgress: {
      ...progress.missionProgress,
      [SCOTLAND_MISSION_ID]: {
        ...existing,
        status: 'in_progress',
        currentStage:
          existing.currentStage === 'perform'
            ? 'perform'
            : existing.currentStage === 'practice'
              ? 'practice'
              : 'build',
        metEilidh: true,
        scotlandBuildStarted: true,
        scotlandBuiltSentences: existing.scotlandBuiltSentences ?? {},
      },
    },
  };
}

export function completeScotlandBuildStation(
  progress: LocalProgressV1,
  stationId: ScotlandLandmarkId,
  builtSentence: string,
): LocalProgressV1 {
  if (
    !isScotlandBuildUnlocked(progress) ||
    !VALID_SCOTLAND_LANDMARK_IDS.has(stationId) ||
    !isValidSavedScotlandBuildSentence(stationId, builtSentence)
  ) {
    return progress;
  }

  const trimmed = builtSentence.trim();
  const activeReplay = getActiveReplayAttempt(progress, 'scotland');

  if (activeReplay) {
    if (!activeReplay.scotlandBuildStarted) {
      return progress;
    }

    const existingMap = { ...(activeReplay.scotlandBuiltSentences ?? {}) };
    const nextMap: Record<string, string> = {
      ...existingMap,
      [stationId]: trimmed,
    };

    const validBuiltCount = SCOTLAND_BUILD_STATIONS.filter((st) =>
      isValidSavedScotlandBuildSentence(st.id, nextMap[st.id]),
    ).length;
    const allBuilt = validBuiltCount >= SCOTLAND_BUILD_STATIONS.length;
    const alreadyInAttempt =
      activeReplay.status === 'completed' &&
      activeReplay.completedActivityIds.includes(SCOTLAND_BUILD_ACTIVITY_ID);
    const addActivityToAttempt =
      allBuilt && !activeReplay.completedActivityIds.includes(SCOTLAND_BUILD_ACTIVITY_ID);
    const nextReplayStage: LearningStageId = allBuilt
      ? activeReplay.currentStage === 'perform'
        ? 'perform'
        : 'practice'
      : preserveHighestScotlandStage(activeReplay.currentStage);

    const lifetime = progress.missionProgress[SCOTLAND_MISSION_ID] ?? {
      status: 'not_started' as const,
      currentStage: 'discover' as const,
      completedActivityIds: [],
    };
    const shouldGrantXp =
      allBuilt &&
      lifetime.completedActivityIds.includes(SCOTLAND_DISCOVERY_ACTIVITY_ID) &&
      !lifetime.completedActivityIds.includes(SCOTLAND_BUILD_ACTIVITY_ID);

    if (
      existingMap[stationId] === trimmed &&
      !addActivityToAttempt &&
      activeReplay.currentStage === nextReplayStage &&
      !shouldGrantXp
    ) {
      return progress;
    }

    const replayState = getReplayState(progress);

    return {
      ...progress,
      rewards: shouldGrantXp
        ? {
            ...progress.rewards,
            xp: progress.rewards.xp + SCOTLAND_BUILD_XP_REWARD,
          }
        : progress.rewards,
      missionProgress: shouldGrantXp
        ? {
            ...progress.missionProgress,
            [SCOTLAND_MISSION_ID]: {
              ...lifetime,
              status: 'in_progress',
              currentStage: lifetime.currentStage === 'perform' ? 'perform' : 'practice',
              metEilidh: true,
              scotlandBuildStarted: true,
              scotlandBuiltSentences: nextMap,
              completedActivityIds: [
                ...lifetime.completedActivityIds,
                SCOTLAND_BUILD_ACTIVITY_ID,
              ],
            },
          }
        : progress.missionProgress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          scotland: {
            ...activeReplay,
            currentStage: nextReplayStage,
            scotlandBuildStarted: true,
            scotlandBuiltSentences: nextMap,
            completedActivityIds: addActivityToAttempt
              ? [...activeReplay.completedActivityIds, SCOTLAND_BUILD_ACTIVITY_ID]
              : activeReplay.completedActivityIds,
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[SCOTLAND_MISSION_ID];
  // Strict unlock guard: requires completed DISCOVER and Eilidh BUILD start
  if (
    !existing ||
    !existing.completedActivityIds.includes(SCOTLAND_DISCOVERY_ACTIVITY_ID) ||
    !existing.scotlandBuildStarted
  ) {
    return progress;
  }

  const currentMap = { ...(existing.scotlandBuiltSentences ?? {}) };
  const nextMap: Record<string, string> = {
    ...currentMap,
    [stationId]: trimmed,
  };

  const validBuiltCount = SCOTLAND_BUILD_STATIONS.filter((st) =>
    isValidSavedScotlandBuildSentence(st.id, nextMap[st.id]),
  ).length;
  const alreadyRewarded = existing.completedActivityIds.includes(SCOTLAND_BUILD_ACTIVITY_ID);
  const allBuilt = validBuiltCount >= SCOTLAND_BUILD_STATIONS.length;
  const shouldGrantXp = allBuilt && !alreadyRewarded;
  const nextStage: LearningStageId =
    existing.currentStage === 'perform'
      ? 'perform'
      : allBuilt || alreadyRewarded
        ? 'practice'
        : 'build';

  if (
    currentMap[stationId] === trimmed &&
    !shouldGrantXp &&
    existing.currentStage === nextStage &&
    existing.status === 'in_progress'
  ) {
    return progress;
  }

  return {
    ...progress,
    rewards: shouldGrantXp
      ? {
          ...progress.rewards,
          xp: progress.rewards.xp + SCOTLAND_BUILD_XP_REWARD,
        }
      : progress.rewards,
    missionProgress: {
      ...progress.missionProgress,
      [SCOTLAND_MISSION_ID]: {
        ...existing,
        status: 'in_progress',
        currentStage: nextStage,
        scotlandBuildStarted: true,
        scotlandBuiltSentences: nextMap,
        completedActivityIds: shouldGrantXp
          ? [...existing.completedActivityIds, SCOTLAND_BUILD_ACTIVITY_ID]
          : existing.completedActivityIds,
      },
    },
  };
}

export { SCOTLAND_PRACTICE_ACTIVITY_ID, SCOTLAND_PRACTICE_XP_REWARD };

export function isScotlandPracticeCompleted(progress: LocalProgressV1): boolean {
  const entry = progress.missionProgress[SCOTLAND_MISSION_ID];
  if (!entry) return false;
  return entry.completedActivityIds.includes(SCOTLAND_PRACTICE_ACTIVITY_ID);
}

export function isScotlandPerformUnlocked(progress: LocalProgressV1): boolean {
  if (!isScotlandUnlocked(progress)) return false;
  const effective = getScotlandEffectiveEntry(progress);
  return (
    effective.completedActivityIds.includes(SCOTLAND_DISCOVERY_ACTIVITY_ID) &&
    effective.completedActivityIds.includes(SCOTLAND_BUILD_ACTIVITY_ID) &&
    effective.completedActivityIds.includes(SCOTLAND_PRACTICE_ACTIVITY_ID)
  );
}

export function startScotlandPracticeMission(progress: LocalProgressV1): LocalProgressV1 {
  if (!isScotlandPracticeUnlocked(progress)) {
    return progress;
  }

  const activeReplay = getActiveReplayAttempt(progress, 'scotland');
  if (activeReplay) {
    if (activeReplay.scotlandPracticeStarted) {
      return progress;
    }
    const replayState = getReplayState(progress);
    return {
      ...progress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          scotland: {
            ...activeReplay,
            currentStage:
              activeReplay.currentStage === 'perform' ? 'perform' : 'practice',
            metEilidh: true,
            scotlandPracticeStarted: true,
            scotlandCompletedSpeakingIds: activeReplay.scotlandCompletedSpeakingIds ?? [],
            scotlandSpeakingReflectionStates:
              activeReplay.scotlandSpeakingReflectionStates ?? {},
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[SCOTLAND_MISSION_ID];
  if (
    !existing ||
    !existing.completedActivityIds.includes(SCOTLAND_DISCOVERY_ACTIVITY_ID) ||
    !existing.completedActivityIds.includes(SCOTLAND_BUILD_ACTIVITY_ID)
  ) {
    return progress;
  }
  if (existing.scotlandPracticeStarted && existing.status === 'in_progress') {
    return progress;
  }

  return {
    ...progress,
    missionProgress: {
      ...progress.missionProgress,
      [SCOTLAND_MISSION_ID]: {
        ...existing,
        status: 'in_progress',
        currentStage: existing.currentStage === 'perform' ? 'perform' : 'practice',
        metEilidh: true,
        scotlandPracticeStarted: true,
        scotlandCompletedSpeakingIds: existing.scotlandCompletedSpeakingIds ?? [],
        scotlandSpeakingReflectionStates: existing.scotlandSpeakingReflectionStates ?? {},
      },
    },
  };
}

export function completeScotlandPracticeStation(
  progress: LocalProgressV1,
  stationId: ScotlandLandmarkId,
  reflectionState: ScotlandSpeakingReflectionState,
): LocalProgressV1 {
  if (
    !isScotlandPracticeUnlocked(progress) ||
    !VALID_SCOTLAND_LANDMARK_IDS.has(stationId) ||
    !isValidScotlandReflectionState(reflectionState)
  ) {
    return progress;
  }

  const activeReplay = getActiveReplayAttempt(progress, 'scotland');

  if (activeReplay) {
    if (!activeReplay.scotlandPracticeStarted) {
      return progress;
    }

    const currentCompleted = Array.from(
      new Set(
        (activeReplay.scotlandCompletedSpeakingIds ?? []).filter((id) =>
          VALID_SCOTLAND_LANDMARK_IDS.has(id),
        ),
      ),
    );
    const nextCompleted = currentCompleted.includes(stationId)
      ? currentCompleted
      : [...currentCompleted, stationId];

    const currentReflections = { ...(activeReplay.scotlandSpeakingReflectionStates ?? {}) };
    const nextReflections: Record<string, ScotlandSpeakingReflectionState> = {
      ...currentReflections,
      [stationId]: reflectionState,
    };

    const allDone = nextCompleted.length >= SCOTLAND_PRACTICE_MISSIONS.length;
    const addActivityToAttempt =
      allDone && !activeReplay.completedActivityIds.includes(SCOTLAND_PRACTICE_ACTIVITY_ID);

    const lifetime = progress.missionProgress[SCOTLAND_MISSION_ID] ?? {
      status: 'not_started' as const,
      currentStage: 'discover' as const,
      completedActivityIds: [],
    };
    const shouldGrantXp =
      allDone &&
      lifetime.completedActivityIds.includes(SCOTLAND_DISCOVERY_ACTIVITY_ID) &&
      lifetime.completedActivityIds.includes(SCOTLAND_BUILD_ACTIVITY_ID) &&
      !lifetime.completedActivityIds.includes(SCOTLAND_PRACTICE_ACTIVITY_ID);

    const replayState = getReplayState(progress);

    return {
      ...progress,
      rewards: shouldGrantXp
        ? {
            ...progress.rewards,
            xp: progress.rewards.xp + SCOTLAND_PRACTICE_XP_REWARD,
          }
        : progress.rewards,
      missionProgress: shouldGrantXp
        ? {
            ...progress.missionProgress,
            [SCOTLAND_MISSION_ID]: {
              ...lifetime,
              status: lifetime.status === 'completed' ? 'completed' : 'in_progress',
              currentStage: 'perform',
              metEilidh: true,
              scotlandPracticeStarted: true,
              scotlandCompletedSpeakingIds: nextCompleted,
              scotlandSpeakingReflectionStates: nextReflections,
              completedActivityIds: [
                ...lifetime.completedActivityIds,
                SCOTLAND_PRACTICE_ACTIVITY_ID,
              ],
            },
          }
        : progress.missionProgress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          scotland: {
            ...activeReplay,
            status:
              activeReplay.status === 'completed' &&
              activeReplay.completedActivityIds.includes(SCOTLAND_PERFORM_ACTIVITY_ID)
                ? 'completed'
                : 'in_progress',
            currentStage: allDone ? 'perform' : activeReplay.currentStage,
            scotlandPracticeStarted: true,
            scotlandCompletedSpeakingIds: nextCompleted,
            scotlandSpeakingReflectionStates: nextReflections,
            completedActivityIds: addActivityToAttempt
              ? [...activeReplay.completedActivityIds, SCOTLAND_PRACTICE_ACTIVITY_ID]
              : activeReplay.completedActivityIds,
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[SCOTLAND_MISSION_ID];
  // Strict unlock guard: requires completed DISCOVER + BUILD AND Eilidh PRACTICE start
  if (
    !existing ||
    !existing.completedActivityIds.includes(SCOTLAND_DISCOVERY_ACTIVITY_ID) ||
    !existing.completedActivityIds.includes(SCOTLAND_BUILD_ACTIVITY_ID) ||
    !existing.scotlandPracticeStarted
  ) {
    return progress;
  }

  const currentCompleted = Array.from(
    new Set(
      (existing.scotlandCompletedSpeakingIds ?? []).filter((id) =>
        VALID_SCOTLAND_LANDMARK_IDS.has(id),
      ),
    ),
  );
  const nextCompleted = currentCompleted.includes(stationId)
    ? currentCompleted
    : [...currentCompleted, stationId];

  const currentReflections = { ...(existing.scotlandSpeakingReflectionStates ?? {}) };
  const nextReflections: Record<string, ScotlandSpeakingReflectionState> = {
    ...currentReflections,
    [stationId]: reflectionState,
  };

  const alreadyRewarded = existing.completedActivityIds.includes(SCOTLAND_PRACTICE_ACTIVITY_ID);
  const allDone = nextCompleted.length >= SCOTLAND_PRACTICE_MISSIONS.length;
  const shouldGrantXp = allDone && !alreadyRewarded;
  const nextStage: LearningStageId = allDone || alreadyRewarded ? 'perform' : 'practice';

  return {
    ...progress,
    rewards: shouldGrantXp
      ? {
          ...progress.rewards,
          xp: progress.rewards.xp + SCOTLAND_PRACTICE_XP_REWARD,
        }
      : progress.rewards,
    missionProgress: {
      ...progress.missionProgress,
      [SCOTLAND_MISSION_ID]: {
        ...existing,
        status: existing.status === 'completed' ? 'completed' : 'in_progress',
        currentStage: nextStage,
        scotlandPracticeStarted: true,
        scotlandCompletedSpeakingIds: nextCompleted,
        scotlandSpeakingReflectionStates: nextReflections,
        completedActivityIds: shouldGrantXp
          ? [...existing.completedActivityIds, SCOTLAND_PRACTICE_ACTIVITY_ID]
          : existing.completedActivityIds,
      },
    },
  };
}

export {
  SCOTLAND_PERFORM_ACTIVITY_ID,
  SCOTLAND_PERFORM_XP_REWARD,
  SCOTLAND_PASSPORT_STAMP_ID,
};

export function isScotlandPerformCompleted(progress: LocalProgressV1): boolean {
  const entry = progress.missionProgress[SCOTLAND_MISSION_ID];
  if (!entry) return false;
  return (
    entry.status === 'completed' ||
    Boolean(entry.scotlandPerformCompleted) ||
    entry.completedActivityIds.includes(SCOTLAND_PERFORM_ACTIVITY_ID)
  );
}

export function isScotlandMissionCompleted(progress: LocalProgressV1): boolean {
  return isScotlandPerformCompleted(progress);
}

export function startScotlandPerformMission(progress: LocalProgressV1): LocalProgressV1 {
  if (!isScotlandPerformUnlocked(progress)) {
    return progress;
  }

  const activeReplay = getActiveReplayAttempt(progress, 'scotland');
  if (activeReplay) {
    if (
      !activeReplay.completedActivityIds.includes(SCOTLAND_DISCOVERY_ACTIVITY_ID) ||
      !activeReplay.completedActivityIds.includes(SCOTLAND_BUILD_ACTIVITY_ID) ||
      !activeReplay.completedActivityIds.includes(SCOTLAND_PRACTICE_ACTIVITY_ID)
    ) {
      return progress;
    }
    if (activeReplay.scotlandPerformStarted && activeReplay.currentStage === 'perform') {
      return progress;
    }
    const replayState = getReplayState(progress);
    return {
      ...progress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          scotland: {
            ...activeReplay,
            currentStage: 'perform',
            scotlandPerformStarted: true,
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[SCOTLAND_MISSION_ID];
  if (
    !existing ||
    !existing.completedActivityIds.includes(SCOTLAND_DISCOVERY_ACTIVITY_ID) ||
    !existing.completedActivityIds.includes(SCOTLAND_BUILD_ACTIVITY_ID) ||
    !existing.completedActivityIds.includes(SCOTLAND_PRACTICE_ACTIVITY_ID)
  ) {
    return progress;
  }
  if (existing.scotlandPerformStarted && existing.currentStage === 'perform') {
    return progress;
  }

  return {
    ...progress,
    missionProgress: {
      ...progress.missionProgress,
      [SCOTLAND_MISSION_ID]: {
        ...existing,
        status: existing.status === 'completed' ? 'completed' : 'in_progress',
        currentStage: 'perform',
        scotlandPerformStarted: true,
      },
    },
  };
}

export function completeScotlandPerformMission(
  progress: LocalProgressV1,
  payload: ScotlandPerformCompletionPayload,
): LocalProgressV1 {
  if (
    !isScotlandUnlocked(progress) ||
    !isScotlandPerformUnlocked(progress) ||
    !isValidScotlandPerformCompletionPayload(payload)
  ) {
    return progress;
  }

  const cleanEvidenceIds = sanitizeScotlandPerformSelectedEvidenceIds(
    payload.selectedEvidenceIds,
  );
  const cleanOutline = sanitizeScotlandPerformOutline(payload.outline);
  const cleanQaStates = sanitizeScotlandPerformQaStates(payload.questionPracticeStates);
  const cleanReflection = sanitizeScotlandPerformReflectionState(payload.reflectionState);

  if (
    !cleanEvidenceIds ||
    cleanEvidenceIds.length < 2 ||
    !cleanOutline ||
    !isValidScotlandPerformOutline(cleanOutline) ||
    !cleanQaStates ||
    !areValidScotlandPerformQaStates(cleanQaStates) ||
    !cleanReflection
  ) {
    return progress;
  }

  const now = new Date().toISOString();
  const activeReplay = getActiveReplayAttempt(progress, 'scotland');

  if (activeReplay) {
    if (
      !activeReplay.completedActivityIds.includes(SCOTLAND_DISCOVERY_ACTIVITY_ID) ||
      !activeReplay.completedActivityIds.includes(SCOTLAND_BUILD_ACTIVITY_ID) ||
      !activeReplay.completedActivityIds.includes(SCOTLAND_PRACTICE_ACTIVITY_ID) ||
      !activeReplay.scotlandPerformStarted
    ) {
      return progress;
    }

    const attemptWasCompleted =
      activeReplay.status === 'completed' &&
      activeReplay.completedActivityIds.includes(SCOTLAND_PERFORM_ACTIVITY_ID);

    const lifetime = progress.missionProgress[SCOTLAND_MISSION_ID] ?? {
      status: 'not_started' as const,
      currentStage: 'discover' as const,
      completedActivityIds: [],
    };
    const lifetimeCanGrant =
      lifetime.completedActivityIds.includes(SCOTLAND_PRACTICE_ACTIVITY_ID) &&
      !lifetime.completedActivityIds.includes(SCOTLAND_PERFORM_ACTIVITY_ID);
    const lifetimeNeedsStamp = !progress.rewards.stamps.includes(SCOTLAND_PASSPORT_STAMP_ID);

    const replayState = getReplayState(progress);
    const prevHistory = getCountryReplayHistory(progress, 'scotland');
    const nextCompletedReplayCount = attemptWasCompleted
      ? prevHistory.completedReplayCount
      : prevHistory.completedReplayCount + 1;

    return {
      ...progress,
      rewards: {
        ...progress.rewards,
        xp: lifetimeCanGrant
          ? progress.rewards.xp + SCOTLAND_PERFORM_XP_REWARD
          : progress.rewards.xp,
        stamps:
          (lifetimeCanGrant || isScotlandMissionCompleted(progress)) && lifetimeNeedsStamp
            ? [...progress.rewards.stamps, SCOTLAND_PASSPORT_STAMP_ID]
            : progress.rewards.stamps,
      },
      missionProgress: lifetimeCanGrant
        ? {
            ...progress.missionProgress,
            [SCOTLAND_MISSION_ID]: {
              ...lifetime,
              status: 'completed',
              currentStage: 'perform',
              scotlandPerformStarted: true,
              scotlandPerformSelectedEvidenceIds: cleanEvidenceIds,
              scotlandPerformOutline: cleanOutline,
              scotlandPerformSpeechPracticeMode: payload.speechPracticeMode,
              scotlandPerformQuestionPracticeStates: cleanQaStates,
              scotlandPerformReflectionState: cleanReflection,
              scotlandPerformCompleted: true,
              completedActivityIds: [
                ...lifetime.completedActivityIds,
                SCOTLAND_PERFORM_ACTIVITY_ID,
              ],
              completedAt: lifetime.completedAt ?? now,
            },
          }
        : progress.missionProgress,
      replayState: {
        activeAttempts: {
          ...replayState.activeAttempts,
          scotland: {
            ...activeReplay,
            status: 'completed',
            currentStage: 'perform',
            scotlandPerformStarted: true,
            scotlandPerformSelectedEvidenceIds: cleanEvidenceIds,
            scotlandPerformOutline: cleanOutline,
            scotlandPerformSpeechPracticeMode: payload.speechPracticeMode,
            scotlandPerformQuestionPracticeStates: cleanQaStates,
            scotlandPerformReflectionState: cleanReflection,
            scotlandPerformCompleted: true,
            completedActivityIds: attemptWasCompleted
              ? activeReplay.completedActivityIds
              : [...activeReplay.completedActivityIds, SCOTLAND_PERFORM_ACTIVITY_ID],
            completedAt: activeReplay.completedAt ?? now,
          },
        },
        history: {
          ...replayState.history,
          scotland: {
            ...prevHistory,
            totalAttemptsStarted: Math.max(
              prevHistory.totalAttemptsStarted,
              activeReplay.attemptNumber,
            ),
            completedReplayCount: nextCompletedReplayCount,
            lastReplayCompletedAt: attemptWasCompleted
              ? (prevHistory.lastReplayCompletedAt ?? now)
              : now,
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[SCOTLAND_MISSION_ID];
  if (
    !existing ||
    !existing.completedActivityIds.includes(SCOTLAND_DISCOVERY_ACTIVITY_ID) ||
    !existing.completedActivityIds.includes(SCOTLAND_BUILD_ACTIVITY_ID) ||
    !existing.completedActivityIds.includes(SCOTLAND_PRACTICE_ACTIVITY_ID) ||
    !existing.scotlandPerformStarted
  ) {
    return progress;
  }

  const alreadyCompletedActivity = existing.completedActivityIds.includes(
    SCOTLAND_PERFORM_ACTIVITY_ID,
  );
  const alreadyHasStamp = progress.rewards.stamps.includes(SCOTLAND_PASSPORT_STAMP_ID);

  const nextCompletedIds = alreadyCompletedActivity
    ? existing.completedActivityIds
    : [...existing.completedActivityIds, SCOTLAND_PERFORM_ACTIVITY_ID];

  const nextStamps = alreadyHasStamp
    ? progress.rewards.stamps
    : [...progress.rewards.stamps, SCOTLAND_PASSPORT_STAMP_ID];

  const nextXp = alreadyCompletedActivity
    ? progress.rewards.xp
    : progress.rewards.xp + SCOTLAND_PERFORM_XP_REWARD;

  const nextUnlocked =
    isJaipurMissionCompleted(progress) && isKenyaMissionCompleted(progress)
      ? Array.from(new Set<CountryId>([...progress.unlockedCountryIds, 'india', 'kenya', 'scotland', 'australia']))
      : progress.unlockedCountryIds;

  return {
    ...progress,
    unlockedCountryIds: nextUnlocked,
    rewards: {
      ...progress.rewards,
      xp: nextXp,
      stamps: nextStamps,
    },
    missionProgress: {
      ...progress.missionProgress,
      [SCOTLAND_MISSION_ID]: {
        ...existing,
        status: 'completed',
        currentStage: 'perform',
        scotlandPerformStarted: true,
        scotlandPerformSelectedEvidenceIds: cleanEvidenceIds,
        scotlandPerformOutline: cleanOutline,
        scotlandPerformSpeechPracticeMode: payload.speechPracticeMode,
        scotlandPerformQuestionPracticeStates: cleanQaStates,
        scotlandPerformReflectionState: cleanReflection,
        scotlandPerformCompleted: true,
        completedActivityIds: nextCompletedIds,
        completedAt: existing.completedAt ?? now,
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Phase 4A + Phase 4B: Australia — CityTalk Quest (Exploration + Stage 1 DISCOVER)
// ---------------------------------------------------------------------------

export {
  AUSTRALIA_MISSION_ID,
  AUSTRALIA_PASSPORT_STAMP_ID,
  AUSTRALIA_STAGE_ACTIVITY_IDS,
  AUSTRALIA_DISCOVERY_ACTIVITY_ID,
  AUSTRALIA_DISCOVERY_XP_REWARD,
  AUSTRALIA_PRACTICE_ACTIVITY_ID,
  AUSTRALIA_PRACTICE_XP_REWARD,
  AUSTRALIA_PRACTICE_MISSION_ORDER,
  AUSTRALIA_PERFORM_ACTIVITY_ID,
  AUSTRALIA_PERFORM_XP_REWARD,
  AUSTRALIA_PERFORM_CHALLENGE_ORDER,
  TOTAL_AUSTRALIA_MISSION_XP,
};

/**
 * Australia unlocks strictly after India, Kenya, AND Scotland (Stage 4 PERFORM + Scotland Stamp)
 * are legitimately completed.
 */
export function isAustraliaUnlocked(progress: LocalProgressV1): boolean {
  return (
    isJaipurMissionCompleted(progress) &&
    isKenyaMissionCompleted(progress) &&
    isScotlandMissionCompleted(progress) &&
    progress.rewards.stamps.includes(SCOTLAND_PASSPORT_STAMP_ID)
  );
}

export function getAustraliaEffectiveEntry(progress: LocalProgressV1): MissionProgressEntry {
  const active = getActiveReplayAttempt(progress, 'australia');
  if (active) {
    return {
      status: active.status,
      currentStage: active.currentStage,
      completedActivityIds: active.completedActivityIds,
      australiaExploredPoiIds: active.australiaExploredPoiIds,
      australiaMetNpcIds: active.australiaMetNpcIds,
      australiaDiscoverStarted: active.australiaDiscoverStarted,
      australiaCompletedDiscoverIds: active.australiaCompletedDiscoverIds,
      australiaBuildStarted: active.australiaBuildStarted,
      australiaCompletedBuildIds: active.australiaCompletedBuildIds,
      australiaBuiltDialogues: active.australiaBuiltDialogues,
      australiaPracticeStarted: active.australiaPracticeStarted,
      australiaCompletedPracticeIds: active.australiaCompletedPracticeIds,
      australiaPracticeEvidence: active.australiaPracticeEvidence,
      australiaPerformStarted: active.australiaPerformStarted,
      australiaCompletedPerformIds: active.australiaCompletedPerformIds,
      australiaPerformEvidence: active.australiaPerformEvidence,
      australiaPerformReflection: active.australiaPerformReflection,
      australiaPerformCompleted: active.australiaPerformCompleted,
      completedAt: active.completedAt,
    };
  }
  return (
    progress.missionProgress[AUSTRALIA_MISSION_ID] ?? {
      status: 'not_started',
      currentStage: 'discover',
      completedActivityIds: [],
    }
  );
}

function getSequentialAustraliaDiscoverPrefix(rawIds: string[] | undefined): AustraliaLandmarkId[] {
  const set = new Set(
    (rawIds ?? []).filter((id): id is AustraliaLandmarkId => VALID_AUSTRALIA_LANDMARK_IDS.has(id)),
  );
  const seq: AustraliaLandmarkId[] = [];
  for (const id of AUSTRALIA_DISCOVER_MISSION_ORDER) {
    if (set.has(id)) {
      seq.push(id);
    } else {
      break;
    }
  }
  return seq;
}

export function isAustraliaDiscoverStarted(progress: LocalProgressV1): boolean {
  if (!isAustraliaUnlocked(progress)) return false;
  return Boolean(getAustraliaEffectiveEntry(progress).australiaDiscoverStarted);
}

export function getAustraliaCompletedDiscoverIds(
  progress: LocalProgressV1,
): AustraliaLandmarkId[] {
  if (!isAustraliaDiscoverStarted(progress)) return [];
  const entry = getAustraliaEffectiveEntry(progress);
  return getSequentialAustraliaDiscoverPrefix(entry.australiaCompletedDiscoverIds);
}

export function getAustraliaNextDiscoverLandmarkId(
  progress: LocalProgressV1,
): AustraliaLandmarkId | null {
  if (!isAustraliaUnlocked(progress)) return null;
  const completed = getAustraliaCompletedDiscoverIds(progress);
  return AUSTRALIA_DISCOVER_MISSION_ORDER[completed.length] ?? null;
}

export function isAustraliaDiscoverCompleted(progress: LocalProgressV1): boolean {
  if (!isAustraliaUnlocked(progress)) return false;
  const entry = getAustraliaEffectiveEntry(progress);
  if (!entry.australiaDiscoverStarted) return false;
  const completed = getSequentialAustraliaDiscoverPrefix(entry.australiaCompletedDiscoverIds);
  return (
    completed.length >= AUSTRALIA_DISCOVER_MISSION_ORDER.length &&
    entry.completedActivityIds.includes(AUSTRALIA_DISCOVERY_ACTIVITY_ID)
  );
}

export function isAustraliaBuildUnlocked(progress: LocalProgressV1): boolean {
  return isAustraliaDiscoverCompleted(progress);
}

function getSequentialAustraliaBuildPrefix(rawIds: string[] | undefined): AustraliaLandmarkId[] {
  const set = new Set(
    (rawIds ?? []).filter((id): id is AustraliaLandmarkId => VALID_AUSTRALIA_LANDMARK_IDS.has(id)),
  );
  const seq: AustraliaLandmarkId[] = [];
  for (const id of AUSTRALIA_BUILD_MISSION_ORDER) {
    if (set.has(id)) {
      seq.push(id);
    } else {
      break;
    }
  }
  return seq;
}

export function isAustraliaBuildStarted(progress: LocalProgressV1): boolean {
  if (!isAustraliaBuildUnlocked(progress)) return false;
  return Boolean(getAustraliaEffectiveEntry(progress).australiaBuildStarted);
}

export function getAustraliaCompletedBuildIds(
  progress: LocalProgressV1,
): AustraliaLandmarkId[] {
  if (!isAustraliaBuildStarted(progress)) return [];
  const entry = getAustraliaEffectiveEntry(progress);
  return getSequentialAustraliaBuildPrefix(entry.australiaCompletedBuildIds);
}

export function getAustraliaNextBuildLandmarkId(
  progress: LocalProgressV1,
): AustraliaLandmarkId | null {
  if (!isAustraliaBuildUnlocked(progress)) return null;
  const completed = getAustraliaCompletedBuildIds(progress);
  return AUSTRALIA_BUILD_MISSION_ORDER[completed.length] ?? null;
}

export function isAustraliaBuildCompleted(progress: LocalProgressV1): boolean {
  if (!isAustraliaBuildUnlocked(progress)) return false;
  const entry = getAustraliaEffectiveEntry(progress);
  if (!entry.australiaBuildStarted) return false;
  const completed = getSequentialAustraliaBuildPrefix(entry.australiaCompletedBuildIds);
  return (
    completed.length >= AUSTRALIA_BUILD_MISSION_ORDER.length &&
    entry.completedActivityIds.includes(AUSTRALIA_BUILD_ACTIVITY_ID)
  );
}

export function isAustraliaPracticeUnlocked(progress: LocalProgressV1): boolean {
  return isAustraliaBuildCompleted(progress);
}

function getSequentialAustraliaPracticePrefix(rawIds: string[] | undefined): AustraliaLandmarkId[] {
  const set = new Set(
    (rawIds ?? []).filter((id): id is AustraliaLandmarkId => VALID_AUSTRALIA_LANDMARK_IDS.has(id)),
  );
  const seq: AustraliaLandmarkId[] = [];
  for (const id of AUSTRALIA_PRACTICE_MISSION_ORDER) {
    if (set.has(id)) {
      seq.push(id);
    } else {
      break;
    }
  }
  return seq;
}

export function isAustraliaPracticeStarted(progress: LocalProgressV1): boolean {
  if (!isAustraliaPracticeUnlocked(progress)) return false;
  return Boolean(getAustraliaEffectiveEntry(progress).australiaPracticeStarted);
}

export function getAustraliaCompletedPracticeIds(
  progress: LocalProgressV1,
): AustraliaLandmarkId[] {
  if (!isAustraliaPracticeStarted(progress)) return [];
  const entry = getAustraliaEffectiveEntry(progress);
  return getSequentialAustraliaPracticePrefix(entry.australiaCompletedPracticeIds);
}

export function getAustraliaNextPracticeLandmarkId(
  progress: LocalProgressV1,
): AustraliaLandmarkId | null {
  if (!isAustraliaPracticeUnlocked(progress)) return null;
  const completed = getAustraliaCompletedPracticeIds(progress);
  return AUSTRALIA_PRACTICE_MISSION_ORDER[completed.length] ?? null;
}

export function getAustraliaPracticeEvidenceMap(
  progress: LocalProgressV1,
): Record<string, AustraliaSpeakingEvidenceRecord> {
  if (!isAustraliaPracticeStarted(progress)) return {};
  const entry = getAustraliaEffectiveEntry(progress);
  const rawMap = entry.australiaPracticeEvidence;
  if (!rawMap || typeof rawMap !== 'object') return {};
  const result: Record<string, AustraliaSpeakingEvidenceRecord> = {};
  for (const id of getAustraliaCompletedPracticeIds(progress)) {
    const spec = getAustraliaPracticeMissionSpec(id);
    const validTurnIds = spec ? spec.turns.map((t) => t.turnId) : [];
    const clean = sanitizeAustraliaSpeakingEvidenceRecord(rawMap[id], validTurnIds);
    if (clean) {
      result[id] = clean;
    }
  }
  return result;
}

export function isAustraliaPracticeCompleted(progress: LocalProgressV1): boolean {
  if (!isAustraliaPracticeUnlocked(progress)) return false;
  const entry = getAustraliaEffectiveEntry(progress);
  if (!entry.australiaPracticeStarted) return false;
  const completed = getSequentialAustraliaPracticePrefix(entry.australiaCompletedPracticeIds);
  return (
    completed.length >= AUSTRALIA_PRACTICE_MISSION_ORDER.length &&
    entry.completedActivityIds.includes(AUSTRALIA_PRACTICE_ACTIVITY_ID)
  );
}

export function isAustraliaPerformUnlocked(progress: LocalProgressV1): boolean {
  return isAustraliaPracticeCompleted(progress);
}

function getSequentialAustraliaPerformPrefix(rawIds: string[] | undefined): AustraliaLandmarkId[] {
  const set = new Set(
    (rawIds ?? []).filter((id): id is AustraliaLandmarkId => VALID_AUSTRALIA_LANDMARK_IDS.has(id)),
  );
  const seq: AustraliaLandmarkId[] = [];
  for (const id of AUSTRALIA_PERFORM_CHALLENGE_ORDER) {
    if (set.has(id)) {
      seq.push(id);
    } else {
      break;
    }
  }
  return seq;
}

export function isAustraliaPerformStarted(progress: LocalProgressV1): boolean {
  if (!isAustraliaPerformUnlocked(progress)) return false;
  return Boolean(getAustraliaEffectiveEntry(progress).australiaPerformStarted);
}

export function getAustraliaCompletedPerformIds(
  progress: LocalProgressV1,
): AustraliaLandmarkId[] {
  if (!isAustraliaPerformStarted(progress)) return [];
  const entry = getAustraliaEffectiveEntry(progress);
  return getSequentialAustraliaPerformPrefix(entry.australiaCompletedPerformIds);
}

export function getAustraliaNextPerformLandmarkId(
  progress: LocalProgressV1,
): AustraliaLandmarkId | null {
  if (!isAustraliaPerformUnlocked(progress)) return null;
  const completed = getAustraliaCompletedPerformIds(progress);
  return AUSTRALIA_PERFORM_CHALLENGE_ORDER[completed.length] ?? null;
}

export function getAustraliaPerformEvidenceMap(
  progress: LocalProgressV1,
): Record<string, AustraliaPerformChallengeRecord> {
  if (!isAustraliaPerformStarted(progress)) return {};
  const entry = getAustraliaEffectiveEntry(progress);
  const rawMap = entry.australiaPerformEvidence;
  if (!rawMap || typeof rawMap !== 'object') return {};
  const result: Record<string, AustraliaPerformChallengeRecord> = {};
  for (const id of getAustraliaCompletedPerformIds(progress)) {
    const spec = getAustraliaPerformChallengeSpec(id);
    const validTurnIds = spec ? spec.turns.map((t) => t.turnId) : [];
    const clean = sanitizeAustraliaPerformChallengeRecord(rawMap[id], validTurnIds);
    if (clean) {
      result[id] = clean;
    }
  }
  return result;
}

export function getAustraliaPerformReflection(
  progress: LocalProgressV1,
): AustraliaPerformReflectionState | undefined {
  if (!isAustraliaPerformStarted(progress)) return undefined;
  return sanitizeAustraliaPerformReflectionState(
    getAustraliaEffectiveEntry(progress).australiaPerformReflection,
  );
}

type AustraliaProgressLike = Pick<
  MissionProgressEntry,
  | 'status'
  | 'completedActivityIds'
  | 'australiaDiscoverStarted'
  | 'australiaCompletedDiscoverIds'
  | 'australiaBuildStarted'
  | 'australiaCompletedBuildIds'
  | 'australiaPracticeStarted'
  | 'australiaCompletedPracticeIds'
  | 'australiaPracticeEvidence'
  | 'australiaPerformStarted'
  | 'australiaCompletedPerformIds'
  | 'australiaPerformEvidence'
  | 'australiaPerformReflection'
  | 'australiaPerformCompleted'
>;

function hasAllAustraliaPerformEvidence(entry: AustraliaProgressLike | undefined): boolean {
  if (!entry || !entry.australiaPerformStarted) return false;
  const seq = getSequentialAustraliaPerformPrefix(entry.australiaCompletedPerformIds);
  if (seq.length < AUSTRALIA_PERFORM_CHALLENGE_ORDER.length) return false;
  const evidenceMap = entry.australiaPerformEvidence;
  if (!evidenceMap || typeof evidenceMap !== 'object' || Array.isArray(evidenceMap)) {
    return false;
  }
  return AUSTRALIA_PERFORM_CHALLENGE_ORDER.every((id) => {
    const spec = getAustraliaPerformChallengeSpec(id);
    const validTurnIds = spec ? spec.turns.map((t) => t.turnId) : [];
    return Boolean(sanitizeAustraliaPerformChallengeRecord(evidenceMap[id], validTurnIds));
  });
}

function hasCanonicalAustraliaPerformEntry(entry: AustraliaProgressLike | undefined): boolean {
  if (!entry) return false;
  if (!entry.australiaDiscoverStarted) return false;
  if (
    getSequentialAustraliaDiscoverPrefix(entry.australiaCompletedDiscoverIds).length <
      AUSTRALIA_DISCOVER_MISSION_ORDER.length ||
    !entry.completedActivityIds.includes(AUSTRALIA_DISCOVERY_ACTIVITY_ID)
  ) {
    return false;
  }
  if (!entry.australiaBuildStarted) return false;
  if (
    getSequentialAustraliaBuildPrefix(entry.australiaCompletedBuildIds).length <
      AUSTRALIA_BUILD_MISSION_ORDER.length ||
    !entry.completedActivityIds.includes(AUSTRALIA_BUILD_ACTIVITY_ID)
  ) {
    return false;
  }
  if (!entry.australiaPracticeStarted) return false;
  const practiceIds = getSequentialAustraliaPracticePrefix(entry.australiaCompletedPracticeIds);
  if (
    practiceIds.length < AUSTRALIA_PRACTICE_MISSION_ORDER.length ||
    !entry.completedActivityIds.includes(AUSTRALIA_PRACTICE_ACTIVITY_ID)
  ) {
    return false;
  }
  const practiceEvidence = entry.australiaPracticeEvidence;
  if (
    !practiceEvidence ||
    typeof practiceEvidence !== 'object' ||
    !AUSTRALIA_PRACTICE_MISSION_ORDER.every((id) => {
      const spec = getAustraliaPracticeMissionSpec(id);
      const validTurnIds = spec ? spec.turns.map((t) => t.turnId) : [];
      return Boolean(sanitizeAustraliaSpeakingEvidenceRecord(practiceEvidence[id], validTurnIds));
    })
  ) {
    return false;
  }
  if (!hasAllAustraliaPerformEvidence(entry)) return false;
  if (!isValidAustraliaPerformReflectionState(entry.australiaPerformReflection)) return false;
  return (
    entry.status === 'completed' &&
    entry.australiaPerformCompleted === true &&
    entry.completedActivityIds.includes(AUSTRALIA_PERFORM_ACTIVITY_ID)
  );
}

/**
 * Checks LIFETIME Australia PERFORM completion (persists across Replay Attempts).
 * Requires all prerequisites (DISCOVER, BUILD, PRACTICE), all 5 PERFORM challenge records,
 * valid submitted Self-Reflection, and canonical completion flags.
 */
export function isAustraliaPerformCompleted(progress: LocalProgressV1): boolean {
  if (!isAustraliaUnlocked(progress)) return false;
  return hasCanonicalAustraliaPerformEntry(progress.missionProgress[AUSTRALIA_MISSION_ID]);
}

/**
 * Canonical predicate for LIFETIME Australia country completion (World 4 complete & Stamp eligible).
 */
export function isAustraliaMissionCompleted(progress: LocalProgressV1): boolean {
  return isAustraliaPerformCompleted(progress);
}

/**
 * Checks CURRENT ATTEMPT (or lifetime when not replaying) Australia PERFORM completion.
 */
export function isAustraliaAttemptPerformCompleted(progress: LocalProgressV1): boolean {
  if (!isAustraliaPerformUnlocked(progress)) return false;
  return hasCanonicalAustraliaPerformEntry(getAustraliaEffectiveEntry(progress));
}

/**
 * Returns true when all Stage 4 PERFORM challenges are complete in the active attempt/run
 * and only the mandatory Self-Reflection submission remains to complete Australia.
 */
export function isAustraliaPerformAwaitingReflection(progress: LocalProgressV1): boolean {
  if (!isAustraliaPerformUnlocked(progress)) return false;
  const entry = getAustraliaEffectiveEntry(progress);
  return hasAllAustraliaPerformEvidence(entry) && !hasCanonicalAustraliaPerformEntry(entry);
}

/**
 * Computes canonical Stage 4 PERFORM progress display (holds at 4/5 until Self-Reflection is
 * explicitly submitted, then advances to 5/5).
 */
export function getAustraliaPerformDisplayProgress(progress: LocalProgressV1): {
  completed: number;
  total: number;
  challengesCompleted: number;
  totalChallenges: number;
  reflectionCompleted: boolean;
} {
  const total = AUSTRALIA_PERFORM_CHALLENGE_ORDER.length;
  const challengesCompleted = getAustraliaCompletedPerformIds(progress).length;
  const reflectionCompleted = isAustraliaAttemptPerformCompleted(progress);
  return {
    completed: reflectionCompleted ? total : Math.min(challengesCompleted, total - 1),
    total,
    challengesCompleted,
    totalChallenges: total,
    reflectionCompleted,
  };
}

/**
 * Canonical navigation gate enforced across World Map, Continue/Enter World, Passport,
 * and route handlers.
 */
export function canNavigateToCountry(progress: LocalProgressV1, countryId: CountryId): boolean {
  if (countryId === 'india' || countryId === 'kenya') return true;
  if (countryId === 'scotland') return isScotlandUnlocked(progress);
  if (countryId === 'australia') return isAustraliaUnlocked(progress);
  if (countryId === 'egypt') return isEgyptUnlocked(progress);
  return false;
}

/**
 * Egypt unlocks strictly after Australia is legitimately completed
 * and the Sydney Passport Stamp is awarded.
 */
export function isEgyptUnlocked(progress: LocalProgressV1): boolean {
  return (
    isAustraliaUnlocked(progress) &&
    isAustraliaMissionCompleted(progress) &&
    progress.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID)
  );
}

export function getEgyptEffectiveEntry(progress: LocalProgressV1): MissionProgressEntry {
  return (
    progress.missionProgress[EGYPT_MISSION_ID] ?? {
      status: 'not_started',
      currentStage: 'discover',
      completedActivityIds: [],
    }
  );
}

export function getEgyptVisitedLandmarkIds(progress: LocalProgressV1): EgyptLandmarkId[] {
  if (!isEgyptUnlocked(progress)) return [];
  const raw = getEgyptEffectiveEntry(progress).egyptExploredPoiIds ?? [];
  return Array.from(
    new Set(raw.filter((id): id is EgyptLandmarkId => VALID_EGYPT_LANDMARK_IDS.has(id))),
  );
}

export function getEgyptMetNpcIds(progress: LocalProgressV1): EgyptNpcId[] {
  if (!isEgyptUnlocked(progress)) return [];
  const raw = getEgyptEffectiveEntry(progress).egyptMetNpcIds ?? [];
  return Array.from(new Set(raw.filter((id): id is EgyptNpcId => VALID_EGYPT_NPC_IDS.has(id))));
}

function getSequentialEgyptDiscoverPrefix(rawIds: string[] | undefined): EgyptLandmarkId[] {
  const set = new Set(
    (rawIds ?? []).filter((id): id is EgyptLandmarkId => VALID_EGYPT_LANDMARK_IDS.has(id)),
  );
  const seq: EgyptLandmarkId[] = [];
  for (const id of EGYPT_DISCOVER_MISSION_ORDER) {
    if (set.has(id)) {
      seq.push(id);
    } else {
      break;
    }
  }
  return seq;
}

function resolveEgyptStage(entry: MissionProgressEntry): LearningStageId {
  if (entry.completedActivityIds.includes(EGYPT_BUILD_ACTIVITY_ID)) {
    return 'practice';
  }
  if (entry.completedActivityIds.includes(EGYPT_DISCOVERY_ACTIVITY_ID)) {
    return 'build';
  }
  return 'discover';
}

export function isEgyptDiscoverStarted(progress: LocalProgressV1): boolean {
  if (!isEgyptUnlocked(progress)) return false;
  return Boolean(getEgyptEffectiveEntry(progress).egyptDiscoverStarted);
}

export function getEgyptCompletedDiscoverIds(progress: LocalProgressV1): EgyptLandmarkId[] {
  if (!isEgyptDiscoverStarted(progress)) return [];
  const entry = getEgyptEffectiveEntry(progress);
  return getSequentialEgyptDiscoverPrefix(entry.egyptCompletedDiscoverIds);
}

export function getEgyptNextDiscoverLandmarkId(
  progress: LocalProgressV1,
): EgyptLandmarkId | null {
  if (!isEgyptUnlocked(progress)) return null;
  const completed = getEgyptCompletedDiscoverIds(progress);
  return EGYPT_DISCOVER_MISSION_ORDER[completed.length] ?? null;
}

export function isEgyptDiscoverCompleted(progress: LocalProgressV1): boolean {
  if (!isEgyptUnlocked(progress)) return false;
  const entry = getEgyptEffectiveEntry(progress);
  if (!entry.egyptDiscoverStarted) return false;
  const completed = getSequentialEgyptDiscoverPrefix(entry.egyptCompletedDiscoverIds);
  return (
    completed.length >= EGYPT_DISCOVER_MISSION_ORDER.length &&
    entry.completedActivityIds.includes(EGYPT_DISCOVERY_ACTIVITY_ID)
  );
}

export function isEgyptBuildUnlocked(progress: LocalProgressV1): boolean {
  return isEgyptDiscoverCompleted(progress);
}

function getSequentialEgyptBuildPrefix(
  rawIds: string[] | undefined,
  solvedChallengeIds: string[] | undefined,
): EgyptLandmarkId[] {
  const stationSet = new Set(
    (rawIds ?? []).filter((id): id is EgyptLandmarkId => VALID_EGYPT_LANDMARK_IDS.has(id)),
  );
  const solvedSet = new Set(
    (solvedChallengeIds ?? []).filter((cid) => VALID_EGYPT_BUILD_CHALLENGE_ID_SET.has(cid)),
  );
  const seq: EgyptLandmarkId[] = [];
  for (const id of EGYPT_BUILD_MISSION_ORDER) {
    const reqChallenges = getEgyptBuildGameChallengeIds(id);
    const hasAll = reqChallenges.length > 0 && reqChallenges.every((cid) => solvedSet.has(cid));
    if (stationSet.has(id) && hasAll) {
      seq.push(id);
    } else {
      break;
    }
  }
  return seq;
}

export function isEgyptBuildStarted(progress: LocalProgressV1): boolean {
  if (!isEgyptBuildUnlocked(progress)) return false;
  return Boolean(getEgyptEffectiveEntry(progress).egyptBuildStarted);
}

export function getEgyptCompletedBuildChallengeIds(progress: LocalProgressV1): string[] {
  if (!isEgyptBuildStarted(progress)) return [];
  const raw = getEgyptEffectiveEntry(progress).egyptCompletedBuildChallengeIds ?? [];
  return Array.from(new Set(raw.filter((id) => VALID_EGYPT_BUILD_CHALLENGE_ID_SET.has(id))));
}

export function getEgyptCompletedBuildIds(progress: LocalProgressV1): EgyptLandmarkId[] {
  if (!isEgyptBuildStarted(progress)) return [];
  const entry = getEgyptEffectiveEntry(progress);
  return getSequentialEgyptBuildPrefix(
    entry.egyptCompletedBuildIds,
    entry.egyptCompletedBuildChallengeIds,
  );
}

export function getEgyptNextBuildLandmarkId(
  progress: LocalProgressV1,
): EgyptLandmarkId | null {
  if (!isEgyptBuildUnlocked(progress)) return null;
  const completed = getEgyptCompletedBuildIds(progress);
  return EGYPT_BUILD_MISSION_ORDER[completed.length] ?? null;
}

export function isEgyptBuildCompleted(progress: LocalProgressV1): boolean {
  if (!isEgyptBuildUnlocked(progress)) return false;
  const entry = getEgyptEffectiveEntry(progress);
  if (!entry.egyptBuildStarted) return false;
  const completed = getSequentialEgyptBuildPrefix(
    entry.egyptCompletedBuildIds,
    entry.egyptCompletedBuildChallengeIds,
  );
  const solvedSet = new Set(getEgyptCompletedBuildChallengeIds(progress));
  const allSolved = ALL_EGYPT_BUILD_CHALLENGE_IDS.every((cid) => solvedSet.has(cid));
  return (
    completed.length >= EGYPT_BUILD_MISSION_ORDER.length &&
    allSolved &&
    entry.completedActivityIds.includes(EGYPT_BUILD_ACTIVITY_ID)
  );
}

export function isEgyptPracticeUnlocked(progress: LocalProgressV1): boolean {
  return isEgyptBuildCompleted(progress);
}

export function getEgyptBuildJournal(
  progress: LocalProgressV1,
): EgyptInstructionJournalRecord[] {
  if (!isEgyptUnlocked(progress)) return [];
  const entry = getEgyptEffectiveEntry(progress);
  return sanitizeEgyptBuildJournal(entry.egyptBuildJournal) ?? [];
}

/**
 * Starts Egypt Stage 2 BUILD ("Ancient Instruction Builder") via Dr. Layla Hassan (+0 XP, +0 stamps).
 * Requires Egypt unlocked + Stage 1 DISCOVER legitimately completed.
 */
export function startEgyptBuildMission(progress: LocalProgressV1): LocalProgressV1 {
  if (!isEgyptBuildUnlocked(progress)) {
    return progress;
  }
  const existing = getEgyptEffectiveEntry(progress);
  const currentMet = getEgyptMetNpcIds(progress);
  const nextMet = currentMet.includes('npc_layla') ? currentMet : [...currentMet, 'npc_layla'];

  if (
    existing.egyptBuildStarted &&
    existing.egyptEntered &&
    existing.status === 'in_progress' &&
    currentMet.includes('npc_layla')
  ) {
    return progress;
  }

  return {
    ...progress,
    missionProgress: {
      ...progress.missionProgress,
      [EGYPT_MISSION_ID]: {
        ...existing,
        status: 'in_progress',
        currentStage: resolveEgyptStage(existing),
        egyptEntered: true,
        egyptMetNpcIds: nextMet,
        egyptBuildStarted: true,
        egyptCompletedBuildChallengeIds: existing.egyptCompletedBuildChallengeIds ?? [],
        egyptCompletedBuildIds: existing.egyptCompletedBuildIds ?? [],
        egyptBuildJournal: existing.egyptBuildJournal ?? [],
      },
    },
  };
}

/**
 * Records an accepted individual BUILD challenge and updates the Expedition Journal (+0 XP).
 * Replaces any existing record with the same `${gameId}:${challengeId}` key so revisions never duplicate.
 */
export function recordEgyptBuildChallenge(
  progress: LocalProgressV1,
  record: EgyptInstructionJournalRecord,
): LocalProgressV1 {
  if (!isEgyptBuildUnlocked(progress)) return progress;
  const existing = progress.missionProgress[EGYPT_MISSION_ID];
  if (!existing || !existing.egyptBuildStarted) return progress;
  if (!VALID_EGYPT_BUILD_CHALLENGE_ID_SET.has(record.challengeId)) return progress;

  const validatedList = sanitizeEgyptBuildJournal([
    {
      ...record,
      id: makeEgyptJournalRecordId(record.gameId, record.challengeId),
      missionId: EGYPT_MISSION_ID,
    },
  ]);
  if (!validatedList || validatedList.length === 0) return progress;
  const cleanRecord = validatedList[0];

  const currentSolved = Array.from(
    new Set(
      (existing.egyptCompletedBuildChallengeIds ?? []).filter((cid) =>
        VALID_EGYPT_BUILD_CHALLENGE_ID_SET.has(cid),
      ),
    ),
  );
  const nextSolved = currentSolved.includes(cleanRecord.challengeId)
    ? currentSolved
    : [...currentSolved, cleanRecord.challengeId];

  const existingJournal = sanitizeEgyptBuildJournal(existing.egyptBuildJournal) ?? [];
  const nextJournalMap = new Map<string, EgyptInstructionJournalRecord>();
  for (const item of existingJournal) {
    nextJournalMap.set(item.id, item);
  }
  nextJournalMap.set(cleanRecord.id, cleanRecord);

  return {
    ...progress,
    missionProgress: {
      ...progress.missionProgress,
      [EGYPT_MISSION_ID]: {
        ...existing,
        status: 'in_progress',
        currentStage: resolveEgyptStage(existing),
        egyptEntered: true,
        egyptBuildStarted: true,
        egyptCompletedBuildChallengeIds: nextSolved,
        egyptBuildJournal: Array.from(nextJournalMap.values()),
      },
    },
  };
}

/**
 * Completes a sequential Stage 2 BUILD workshop at its canonical Egypt landmark.
 * - Requires Egypt unlocked + BUILD unlocked + BUILD started + all 6 authored challenges for that station solved.
 * - Enforces sequential station order (1 -> 2 -> 3 -> 4 -> 5).
 * - Stations 1-4 award +0 XP and +0 stamps.
 * - Completing all 5 BUILD stations awards +50 XP ONCE and unlocks Stage 3 PRACTICE preview (coming soon).
 */
export function completeEgyptBuildMission(
  progress: LocalProgressV1,
  landmarkId: EgyptLandmarkId,
): LocalProgressV1 {
  if (!isEgyptBuildUnlocked(progress) || !VALID_EGYPT_LANDMARK_IDS.has(landmarkId)) {
    return progress;
  }
  const existing = progress.missionProgress[EGYPT_MISSION_ID];
  if (!existing || !existing.egyptBuildStarted) {
    return progress;
  }

  const solvedSet = new Set(getEgyptCompletedBuildChallengeIds(progress));
  const requiredForStation = getEgyptBuildGameChallengeIds(landmarkId);
  if (
    requiredForStation.length === 0 ||
    !requiredForStation.every((cid) => solvedSet.has(cid))
  ) {
    return progress;
  }

  const currentCompleted = getSequentialEgyptBuildPrefix(
    existing.egyptCompletedBuildIds,
    existing.egyptCompletedBuildChallengeIds,
  );
  const alreadyCompletedThis = currentCompleted.includes(landmarkId);
  const expectedNext = EGYPT_BUILD_MISSION_ORDER[currentCompleted.length];

  if (!alreadyCompletedThis && expectedNext !== landmarkId) {
    return progress;
  }

  const nextCompleted = alreadyCompletedThis
    ? currentCompleted
    : [...currentCompleted, landmarkId];

  const currentExplored = getEgyptVisitedLandmarkIds(progress);
  const nextExplored = currentExplored.includes(landmarkId)
    ? currentExplored
    : [...currentExplored, landmarkId];

  const allFiveDone =
    nextCompleted.length >= EGYPT_BUILD_MISSION_ORDER.length &&
    ALL_EGYPT_BUILD_CHALLENGE_IDS.every((cid) => solvedSet.has(cid));
  const alreadyRewarded = existing.completedActivityIds.includes(EGYPT_BUILD_ACTIVITY_ID);

  const nextCompletedActivityIds =
    allFiveDone && !alreadyRewarded
      ? [...existing.completedActivityIds, EGYPT_BUILD_ACTIVITY_ID]
      : existing.completedActivityIds;

  const grantXp = allFiveDone && !alreadyRewarded ? EGYPT_BUILD_XP_REWARD : 0;

  return {
    ...progress,
    rewards: {
      ...progress.rewards,
      xp: progress.rewards.xp + grantXp,
    },
    missionProgress: {
      ...progress.missionProgress,
      [EGYPT_MISSION_ID]: {
        ...existing,
        status: 'in_progress',
        currentStage: allFiveDone || alreadyRewarded ? 'practice' : 'build',
        completedActivityIds: nextCompletedActivityIds,
        egyptEntered: true,
        egyptExploredPoiIds: nextExplored,
        egyptBuildStarted: true,
        egyptCompletedBuildIds: nextCompleted,
      },
    },
  };
}

/**
 * Starts Egypt Stage 1 DISCOVER ("Secrets of the Pharaohs") via Dr. Layla Hassan (+0 XP, +0 stamps).
 */
export function startEgyptDiscoveryMission(progress: LocalProgressV1): LocalProgressV1 {
  if (!isEgyptUnlocked(progress)) {
    return progress;
  }
  const existing = getEgyptEffectiveEntry(progress);
  const currentMet = getEgyptMetNpcIds(progress);
  const nextMet = currentMet.includes('npc_layla') ? currentMet : [...currentMet, 'npc_layla'];
  const unlockedNeedsSync = !progress.unlockedCountryIds.includes('egypt');

  if (
    existing.egyptDiscoverStarted &&
    existing.egyptEntered &&
    existing.status === 'in_progress' &&
    currentMet.includes('npc_layla') &&
    !unlockedNeedsSync
  ) {
    return progress;
  }

  return {
    ...progress,
    unlockedCountryIds: unlockedNeedsSync
      ? Array.from(new Set<CountryId>([...progress.unlockedCountryIds, 'egypt']))
      : progress.unlockedCountryIds,
    missionProgress: {
      ...progress.missionProgress,
      [EGYPT_MISSION_ID]: {
        ...existing,
        status: 'in_progress',
        currentStage: resolveEgyptStage(existing),
        completedActivityIds: existing.completedActivityIds,
        egyptEntered: true,
        egyptMetNpcIds: nextMet,
        egyptDiscoverStarted: true,
        egyptCompletedDiscoverIds: existing.egyptCompletedDiscoverIds ?? [],
      },
    },
  };
}

/**
 * Completes a sequential Stage 1 DISCOVER mini-game at its canonical Egypt landmark.
 * - Requires Egypt unlocked + DISCOVER started.
 * - Enforces sequential completion order (1 -> 2 -> 3 -> 4 -> 5).
 * - Individual mini-games award +0 XP and +0 stamps.
 * - Completing all 5 games awards +50 XP ONCE and marks Stage 1 DISCOVER completed without awarding any Stamp.
 */
export function completeEgyptDiscoveryMission(
  progress: LocalProgressV1,
  landmarkId: EgyptLandmarkId,
): LocalProgressV1 {
  if (!isEgyptUnlocked(progress) || !VALID_EGYPT_LANDMARK_IDS.has(landmarkId)) {
    return progress;
  }
  const existing = progress.missionProgress[EGYPT_MISSION_ID];
  if (!existing || !existing.egyptDiscoverStarted) {
    return progress;
  }

  const currentCompleted = getSequentialEgyptDiscoverPrefix(existing.egyptCompletedDiscoverIds);
  const alreadyCompletedThis = currentCompleted.includes(landmarkId);
  const expectedNext = EGYPT_DISCOVER_MISSION_ORDER[currentCompleted.length];

  if (!alreadyCompletedThis && expectedNext !== landmarkId) {
    return progress;
  }

  const nextCompleted = alreadyCompletedThis
    ? currentCompleted
    : [...currentCompleted, landmarkId];

  const currentExplored = getEgyptVisitedLandmarkIds(progress);
  const nextExplored = currentExplored.includes(landmarkId)
    ? currentExplored
    : [...currentExplored, landmarkId];

  const allFiveDone = nextCompleted.length >= EGYPT_DISCOVER_MISSION_ORDER.length;
  const alreadyRewarded = existing.completedActivityIds.includes(EGYPT_DISCOVERY_ACTIVITY_ID);

  const nextCompletedActivityIds =
    allFiveDone && !alreadyRewarded
      ? [...existing.completedActivityIds, EGYPT_DISCOVERY_ACTIVITY_ID]
      : existing.completedActivityIds;

  const grantXp = allFiveDone && !alreadyRewarded ? EGYPT_DISCOVERY_XP_REWARD : 0;

  return {
    ...progress,
    rewards: {
      ...progress.rewards,
      xp: progress.rewards.xp + grantXp,
    },
    missionProgress: {
      ...progress.missionProgress,
      [EGYPT_MISSION_ID]: {
        ...existing,
        status: 'in_progress',
        currentStage: allFiveDone || alreadyRewarded ? 'build' : 'discover',
        completedActivityIds: nextCompletedActivityIds,
        egyptEntered: true,
        egyptExploredPoiIds: nextExplored,
        egyptDiscoverStarted: true,
        egyptCompletedDiscoverIds: nextCompleted,
      },
    },
  };
}

/**
 * Records that the player entered Egypt (non-rewarding: +0 XP, +0 stamps).
 */
export function markEgyptEntered(progress: LocalProgressV1): LocalProgressV1 {
  if (!isEgyptUnlocked(progress)) {
    return progress;
  }
  const existing = getEgyptEffectiveEntry(progress);
  const unlockedNeedsSync = !progress.unlockedCountryIds.includes('egypt');
  if (existing.egyptEntered && existing.status === 'in_progress' && !unlockedNeedsSync) {
    return progress;
  }
  return {
    ...progress,
    unlockedCountryIds: unlockedNeedsSync
      ? Array.from(new Set<CountryId>([...progress.unlockedCountryIds, 'egypt']))
      : progress.unlockedCountryIds,
    missionProgress: {
      ...progress.missionProgress,
      [EGYPT_MISSION_ID]: {
        ...existing,
        status: 'in_progress',
        currentStage: resolveEgyptStage(existing),
        completedActivityIds: existing.completedActivityIds,
        egyptEntered: true,
      },
    },
  };
}

/**
 * Records that the player conversed with an Egypt expedition NPC (+0 XP, +0 stamps).
 */
export function markEgyptNpcMet(progress: LocalProgressV1, npcId: EgyptNpcId): LocalProgressV1 {
  if (!isEgyptUnlocked(progress) || !VALID_EGYPT_NPC_IDS.has(npcId)) {
    return progress;
  }
  const existing = getEgyptEffectiveEntry(progress);
  const currentMet = getEgyptMetNpcIds(progress);
  if (currentMet.includes(npcId) && existing.egyptEntered && existing.status === 'in_progress') {
    return progress;
  }
  const nextMet = currentMet.includes(npcId) ? currentMet : [...currentMet, npcId];
  return {
    ...progress,
    missionProgress: {
      ...progress.missionProgress,
      [EGYPT_MISSION_ID]: {
        ...existing,
        status: 'in_progress',
        currentStage: resolveEgyptStage(existing),
        completedActivityIds: existing.completedActivityIds,
        egyptEntered: true,
        egyptMetNpcIds: nextMet,
      },
    },
  };
}

/**
 * Records that the player visited/inspected an Egypt landmark (+0 XP, +0 stamps).
 */
export function markEgyptPoiExplored(
  progress: LocalProgressV1,
  landmarkId: EgyptLandmarkId,
): LocalProgressV1 {
  if (!isEgyptUnlocked(progress) || !VALID_EGYPT_LANDMARK_IDS.has(landmarkId)) {
    return progress;
  }
  const existing = getEgyptEffectiveEntry(progress);
  const currentExplored = getEgyptVisitedLandmarkIds(progress);
  if (
    currentExplored.includes(landmarkId) &&
    existing.egyptEntered &&
    existing.status === 'in_progress'
  ) {
    return progress;
  }
  const nextExplored = currentExplored.includes(landmarkId)
    ? currentExplored
    : [...currentExplored, landmarkId];
  return {
    ...progress,
    missionProgress: {
      ...progress.missionProgress,
      [EGYPT_MISSION_ID]: {
        ...existing,
        status: 'in_progress',
        currentStage: resolveEgyptStage(existing),
        completedActivityIds: existing.completedActivityIds,
        egyptEntered: true,
        egyptExploredPoiIds: nextExplored,
      },
    },
  };
}

export { EGYPT_MISSION_ID, EGYPT_PASSPORT_STAMP_ID };

export function getAustraliaPerformChallengeStatus(
  progress: LocalProgressV1,
  landmarkId: AustraliaLandmarkId,
): {
  playable: boolean;
  reason:
    | 'world_locked'
    | 'practice_incomplete'
    | 'need_olivia_start'
    | 'prerequisite_incomplete'
    | 'eligible'
    | 'completed_review';
  requiredPreviousLandmarkId?: AustraliaLandmarkId;
} {
  if (!isAustraliaUnlocked(progress)) {
    return { playable: false, reason: 'world_locked' };
  }
  if (!isAustraliaPerformUnlocked(progress)) {
    return { playable: false, reason: 'practice_incomplete' };
  }
  if (!isAustraliaPerformStarted(progress)) {
    return { playable: false, reason: 'need_olivia_start' };
  }
  const completed = getAustraliaCompletedPerformIds(progress);
  if (completed.includes(landmarkId)) {
    return { playable: true, reason: 'completed_review' };
  }
  const nextId = AUSTRALIA_PERFORM_CHALLENGE_ORDER[completed.length];
  if (nextId === landmarkId) {
    return { playable: true, reason: 'eligible' };
  }
  const targetIdx = AUSTRALIA_PERFORM_CHALLENGE_ORDER.indexOf(landmarkId);
  return {
    playable: false,
    reason: 'prerequisite_incomplete',
    requiredPreviousLandmarkId:
      targetIdx > 0 ? AUSTRALIA_PERFORM_CHALLENGE_ORDER[targetIdx - 1] : undefined,
  };
}

export function getAustraliaPracticeMissionStatus(
  progress: LocalProgressV1,
  landmarkId: AustraliaLandmarkId,
): {
  playable: boolean;
  reason:
    | 'world_locked'
    | 'build_incomplete'
    | 'need_olivia_start'
    | 'prerequisite_incomplete'
    | 'eligible'
    | 'completed_review';
  requiredPreviousLandmarkId?: AustraliaLandmarkId;
} {
  if (!isAustraliaUnlocked(progress)) {
    return { playable: false, reason: 'world_locked' };
  }
  if (!isAustraliaPracticeUnlocked(progress)) {
    return { playable: false, reason: 'build_incomplete' };
  }
  if (!isAustraliaPracticeStarted(progress)) {
    return { playable: false, reason: 'need_olivia_start' };
  }
  const completed = getAustraliaCompletedPracticeIds(progress);
  if (completed.includes(landmarkId)) {
    return { playable: true, reason: 'completed_review' };
  }
  const nextId = AUSTRALIA_PRACTICE_MISSION_ORDER[completed.length];
  if (nextId === landmarkId) {
    return { playable: true, reason: 'eligible' };
  }
  const targetIdx = AUSTRALIA_PRACTICE_MISSION_ORDER.indexOf(landmarkId);
  return {
    playable: false,
    reason: 'prerequisite_incomplete',
    requiredPreviousLandmarkId:
      targetIdx > 0 ? AUSTRALIA_PRACTICE_MISSION_ORDER[targetIdx - 1] : undefined,
  };
}

export function getAustraliaBuiltDialogues(
  progress: LocalProgressV1,
): Record<string, string> {
  if (!isAustraliaBuildStarted(progress)) return {};
  const entry = getAustraliaEffectiveEntry(progress);
  const rawMap = entry.australiaBuiltDialogues;
  if (!rawMap || typeof rawMap !== 'object') return {};
  const result: Record<string, string> = {};
  for (const id of getAustraliaCompletedBuildIds(progress)) {
    const val = rawMap[id];
    if (typeof val === 'string' && val.trim().length > 0) {
      result[id] = val.trim();
    }
  }
  return result;
}

export function getAustraliaBuildMissionStatus(
  progress: LocalProgressV1,
  landmarkId: AustraliaLandmarkId,
): {
  playable: boolean;
  reason:
    | 'world_locked'
    | 'discover_incomplete'
    | 'need_olivia_start'
    | 'prerequisite_incomplete'
    | 'eligible'
    | 'completed_review';
  requiredPreviousLandmarkId?: AustraliaLandmarkId;
} {
  if (!isAustraliaUnlocked(progress)) {
    return { playable: false, reason: 'world_locked' };
  }
  if (!isAustraliaBuildUnlocked(progress)) {
    return { playable: false, reason: 'discover_incomplete' };
  }
  if (!isAustraliaBuildStarted(progress)) {
    return { playable: false, reason: 'need_olivia_start' };
  }
  const completed = getAustraliaCompletedBuildIds(progress);
  if (completed.includes(landmarkId)) {
    return { playable: true, reason: 'completed_review' };
  }
  const nextId = AUSTRALIA_BUILD_MISSION_ORDER[completed.length];
  if (nextId === landmarkId) {
    return { playable: true, reason: 'eligible' };
  }
  const targetIdx = AUSTRALIA_BUILD_MISSION_ORDER.indexOf(landmarkId);
  return {
    playable: false,
    reason: 'prerequisite_incomplete',
    requiredPreviousLandmarkId:
      targetIdx > 0 ? AUSTRALIA_BUILD_MISSION_ORDER[targetIdx - 1] : undefined,
  };
}

function resolveAustraliaStage(progress: LocalProgressV1): LearningStageId {
  if (isAustraliaPracticeCompleted(progress)) return 'perform';
  if (isAustraliaBuildCompleted(progress)) return 'practice';
  if (isAustraliaDiscoverCompleted(progress)) return 'build';
  return 'discover';
}

export function getAustraliaDiscoverMissionStatus(
  progress: LocalProgressV1,
  landmarkId: AustraliaLandmarkId,
): {
  playable: boolean;
  reason:
    | 'world_locked'
    | 'need_olivia_start'
    | 'prerequisite_incomplete'
    | 'eligible'
    | 'completed_review';
  requiredPreviousLandmarkId?: AustraliaLandmarkId;
} {
  if (!isAustraliaUnlocked(progress)) {
    return { playable: false, reason: 'world_locked' };
  }
  if (!isAustraliaDiscoverStarted(progress)) {
    return { playable: false, reason: 'need_olivia_start' };
  }
  const completed = getAustraliaCompletedDiscoverIds(progress);
  if (completed.includes(landmarkId)) {
    return { playable: true, reason: 'completed_review' };
  }
  const nextId = AUSTRALIA_DISCOVER_MISSION_ORDER[completed.length];
  if (nextId === landmarkId) {
    return { playable: true, reason: 'eligible' };
  }
  const targetIdx = AUSTRALIA_DISCOVER_MISSION_ORDER.indexOf(landmarkId);
  return {
    playable: false,
    reason: 'prerequisite_incomplete',
    requiredPreviousLandmarkId:
      targetIdx > 0 ? AUSTRALIA_DISCOVER_MISSION_ORDER[targetIdx - 1] : undefined,
  };
}

/**
 * Marks that the player entered Sydney (non-rewarding: +0 XP, no stamps).
 */
export function markAustraliaEntered(progress: LocalProgressV1): LocalProgressV1 {
  if (!isAustraliaUnlocked(progress)) {
    return progress;
  }

  const activeReplay = getActiveReplayAttempt(progress, 'australia');
  if (activeReplay) {
    return progress;
  }

  const existing = progress.missionProgress[AUSTRALIA_MISSION_ID];
  const unlockedNeedsSync = !progress.unlockedCountryIds.includes('australia');
  if (
    existing &&
    (existing.status === 'in_progress' || existing.status === 'completed') &&
    !unlockedNeedsSync
  ) {
    return progress;
  }

  return {
    ...progress,
    unlockedCountryIds: unlockedNeedsSync
      ? Array.from(new Set<CountryId>([...progress.unlockedCountryIds, 'australia']))
      : progress.unlockedCountryIds,
    missionProgress: {
      ...progress.missionProgress,
      [AUSTRALIA_MISSION_ID]: {
        ...existing,
        status: existing?.status === 'completed' ? 'completed' : 'in_progress',
        currentStage: resolveAustraliaStage(progress),
        completedActivityIds: existing?.completedActivityIds ?? [],
      },
    },
  };
}

/**
 * Records that the player conversed with a Sydney NPC (+0 XP).
 */
export function markAustraliaNpcMet(
  progress: LocalProgressV1,
  npcId: AustraliaNpcId,
): LocalProgressV1 {
  if (!isAustraliaUnlocked(progress) || !VALID_AUSTRALIA_NPC_IDS.has(npcId)) {
    return progress;
  }

  const activeReplay = getActiveReplayAttempt(progress, 'australia');
  if (activeReplay) {
    const currentMet = Array.from(
      new Set(
        (activeReplay.australiaMetNpcIds ?? []).filter((id) => VALID_AUSTRALIA_NPC_IDS.has(id)),
      ),
    );
    if (currentMet.includes(npcId)) return progress;
    const replayState = getReplayState(progress);
    return {
      ...progress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          australia: {
            ...activeReplay,
            australiaMetNpcIds: [...currentMet, npcId],
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[AUSTRALIA_MISSION_ID] ?? {
    status: 'not_started' as const,
    currentStage: 'discover' as const,
    completedActivityIds: [],
  };

  const currentMet = Array.from(
    new Set(
      (existing.australiaMetNpcIds ?? []).filter((id) => VALID_AUSTRALIA_NPC_IDS.has(id)),
    ),
  );
  if (
    currentMet.includes(npcId) &&
    (existing.status === 'in_progress' || existing.status === 'completed')
  ) {
    return progress;
  }

  const nextMet = currentMet.includes(npcId) ? currentMet : [...currentMet, npcId];

  return {
    ...progress,
    missionProgress: {
      ...progress.missionProgress,
      [AUSTRALIA_MISSION_ID]: {
        ...existing,
        status: existing.status === 'completed' ? 'completed' : 'in_progress',
        currentStage: resolveAustraliaStage(progress),
        completedActivityIds: existing.completedActivityIds,
        australiaMetNpcIds: nextMet,
      },
    },
  };
}

/**
 * Records that the player visited/inspected a Sydney harbour landmark (+0 XP).
 */
export function markAustraliaPoiExplored(
  progress: LocalProgressV1,
  landmarkId: AustraliaLandmarkId,
): LocalProgressV1 {
  if (!isAustraliaUnlocked(progress) || !VALID_AUSTRALIA_LANDMARK_IDS.has(landmarkId)) {
    return progress;
  }

  const activeReplay = getActiveReplayAttempt(progress, 'australia');
  if (activeReplay) {
    const currentExplored = Array.from(
      new Set(
        (activeReplay.australiaExploredPoiIds ?? []).filter((id) =>
          VALID_AUSTRALIA_LANDMARK_IDS.has(id),
        ),
      ),
    );
    if (currentExplored.includes(landmarkId)) return progress;
    const replayState = getReplayState(progress);
    return {
      ...progress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          australia: {
            ...activeReplay,
            australiaExploredPoiIds: [...currentExplored, landmarkId],
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[AUSTRALIA_MISSION_ID] ?? {
    status: 'not_started' as const,
    currentStage: 'discover' as const,
    completedActivityIds: [],
  };

  const currentExplored = Array.from(
    new Set(
      (existing.australiaExploredPoiIds ?? []).filter((id) =>
        VALID_AUSTRALIA_LANDMARK_IDS.has(id),
      ),
    ),
  );
  if (
    currentExplored.includes(landmarkId) &&
    (existing.status === 'in_progress' || existing.status === 'completed')
  ) {
    return progress;
  }

  const nextExplored = currentExplored.includes(landmarkId)
    ? currentExplored
    : [...currentExplored, landmarkId];

  return {
    ...progress,
    missionProgress: {
      ...progress.missionProgress,
      [AUSTRALIA_MISSION_ID]: {
        ...existing,
        status: existing.status === 'completed' ? 'completed' : 'in_progress',
        currentStage: resolveAustraliaStage(progress),
        completedActivityIds: existing.completedActivityIds,
        australiaExploredPoiIds: nextExplored,
      },
    },
  };
}

/**
 * Starts the Stage 1 CityTalk Discovery Quest via Olivia Parker (+0 XP).
 */
export function startAustraliaDiscoveryMission(progress: LocalProgressV1): LocalProgressV1 {
  if (!isAustraliaUnlocked(progress)) {
    return progress;
  }

  const activeReplay = getActiveReplayAttempt(progress, 'australia');
  if (activeReplay) {
    const currentMet = Array.from(
      new Set(
        (activeReplay.australiaMetNpcIds ?? []).filter((id) => VALID_AUSTRALIA_NPC_IDS.has(id)),
      ),
    );
    const nextMet = currentMet.includes('npc_olivia') ? currentMet : [...currentMet, 'npc_olivia'];
    if (activeReplay.australiaDiscoverStarted && currentMet.includes('npc_olivia')) {
      return progress;
    }
    const replayState = getReplayState(progress);
    return {
      ...progress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          australia: {
            ...activeReplay,
            australiaMetNpcIds: nextMet,
            australiaDiscoverStarted: true,
            australiaCompletedDiscoverIds: activeReplay.australiaCompletedDiscoverIds ?? [],
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[AUSTRALIA_MISSION_ID] ?? {
    status: 'not_started' as const,
    currentStage: 'discover' as const,
    completedActivityIds: [],
  };
  const currentMet = Array.from(
    new Set(
      (existing.australiaMetNpcIds ?? []).filter((id) => VALID_AUSTRALIA_NPC_IDS.has(id)),
    ),
  );
  const nextMet = currentMet.includes('npc_olivia') ? currentMet : [...currentMet, 'npc_olivia'];

  if (
    existing.australiaDiscoverStarted &&
    (existing.status === 'in_progress' || existing.status === 'completed') &&
    currentMet.includes('npc_olivia')
  ) {
    return progress;
  }

  return {
    ...progress,
    missionProgress: {
      ...progress.missionProgress,
      [AUSTRALIA_MISSION_ID]: {
        ...existing,
        status: existing.status === 'completed' ? 'completed' : 'in_progress',
        currentStage: resolveAustraliaStage(progress),
        completedActivityIds: existing.completedActivityIds,
        australiaMetNpcIds: nextMet,
        australiaDiscoverStarted: true,
        australiaCompletedDiscoverIds: existing.australiaCompletedDiscoverIds ?? [],
      },
    },
  };
}

/**
 * Completes a sequential DISCOVER mini-game at its Sydney landmark.
 * - Requires Australia unlocked + DISCOVER quest started via Olivia.
 * - Enforces sequential completion order (1 -> 2 -> 3 -> 4 -> 5).
 * - Individual mini-games award 0 XP.
 * - Completing all 5 awards +50 XP ONCE (first lifetime completion only),
 *   marks `australia_city_discovery` completed, and unlocks BUILD without awarding any Stamp.
 */
export function completeAustraliaDiscoveryMission(
  progress: LocalProgressV1,
  landmarkId: AustraliaLandmarkId,
): LocalProgressV1 {
  if (!isAustraliaUnlocked(progress) || !VALID_AUSTRALIA_LANDMARK_IDS.has(landmarkId)) {
    return progress;
  }

  const activeReplay = getActiveReplayAttempt(progress, 'australia');
  if (activeReplay) {
    if (!activeReplay.australiaDiscoverStarted) return progress;
    const currentCompleted = getSequentialAustraliaDiscoverPrefix(
      activeReplay.australiaCompletedDiscoverIds,
    );
    const alreadyCompletedThis = currentCompleted.includes(landmarkId);
    const expectedNext = AUSTRALIA_DISCOVER_MISSION_ORDER[currentCompleted.length];
    if (!alreadyCompletedThis && expectedNext !== landmarkId) return progress;

    const nextCompleted = alreadyCompletedThis
      ? currentCompleted
      : [...currentCompleted, landmarkId];
    const currentExplored = Array.from(
      new Set(
        (activeReplay.australiaExploredPoiIds ?? []).filter((id) =>
          VALID_AUSTRALIA_LANDMARK_IDS.has(id),
        ),
      ),
    );
    const nextExplored = currentExplored.includes(landmarkId)
      ? currentExplored
      : [...currentExplored, landmarkId];

    const allFiveDone = nextCompleted.length >= AUSTRALIA_DISCOVER_MISSION_ORDER.length;
    const attemptHasActivity = activeReplay.completedActivityIds.includes(
      AUSTRALIA_DISCOVERY_ACTIVITY_ID,
    );
    const nextAttemptIds =
      allFiveDone && !attemptHasActivity
        ? [...activeReplay.completedActivityIds, AUSTRALIA_DISCOVERY_ACTIVITY_ID]
        : activeReplay.completedActivityIds;

    const lifetime = progress.missionProgress[AUSTRALIA_MISSION_ID] ?? {
      status: 'not_started' as const,
      currentStage: 'discover' as const,
      completedActivityIds: [],
    };
    const lifetimeCanGrant =
      allFiveDone && !lifetime.completedActivityIds.includes(AUSTRALIA_DISCOVERY_ACTIVITY_ID);

    const replayState = getReplayState(progress);
    return {
      ...progress,
      rewards: {
        ...progress.rewards,
        xp: lifetimeCanGrant ? progress.rewards.xp + AUSTRALIA_DISCOVERY_XP_REWARD : progress.rewards.xp,
      },
      missionProgress: lifetimeCanGrant
        ? {
            ...progress.missionProgress,
            [AUSTRALIA_MISSION_ID]: {
              ...lifetime,
              status: lifetime.status === 'completed' ? 'completed' : 'in_progress',
              currentStage: lifetime.completedActivityIds.includes(AUSTRALIA_BUILD_ACTIVITY_ID)
                ? lifetime.currentStage
                : 'build',
              completedActivityIds: [...lifetime.completedActivityIds, AUSTRALIA_DISCOVERY_ACTIVITY_ID],
              australiaDiscoverStarted: true,
              australiaCompletedDiscoverIds: nextCompleted,
              australiaExploredPoiIds: nextExplored,
            },
          }
        : progress.missionProgress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          australia: {
            ...activeReplay,
            currentStage: activeReplay.completedActivityIds.includes(AUSTRALIA_BUILD_ACTIVITY_ID)
              ? activeReplay.currentStage
              : allFiveDone || attemptHasActivity
                ? 'build'
                : 'discover',
            completedActivityIds: nextAttemptIds,
            australiaExploredPoiIds: nextExplored,
            australiaDiscoverStarted: true,
            australiaCompletedDiscoverIds: nextCompleted,
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[AUSTRALIA_MISSION_ID];
  if (!existing || !existing.australiaDiscoverStarted) {
    return progress;
  }

  const currentCompleted = getSequentialAustraliaDiscoverPrefix(
    existing.australiaCompletedDiscoverIds,
  );
  const alreadyCompletedThis = currentCompleted.includes(landmarkId);
  const expectedNext = AUSTRALIA_DISCOVER_MISSION_ORDER[currentCompleted.length];

  if (!alreadyCompletedThis && expectedNext !== landmarkId) {
    return progress;
  }

  const nextCompleted = alreadyCompletedThis
    ? currentCompleted
    : [...currentCompleted, landmarkId];

  const currentExplored = Array.from(
    new Set(
      (existing.australiaExploredPoiIds ?? []).filter((id) =>
        VALID_AUSTRALIA_LANDMARK_IDS.has(id),
      ),
    ),
  );
  const nextExplored = currentExplored.includes(landmarkId)
    ? currentExplored
    : [...currentExplored, landmarkId];

  const allFiveDone =
    nextCompleted.length >= AUSTRALIA_DISCOVER_MISSION_ORDER.length;
  const alreadyRewarded = existing.completedActivityIds.includes(
    AUSTRALIA_DISCOVERY_ACTIVITY_ID,
  );

  const nextCompletedActivityIds =
    allFiveDone && !alreadyRewarded
      ? [...existing.completedActivityIds, AUSTRALIA_DISCOVERY_ACTIVITY_ID]
      : existing.completedActivityIds;

  const grantXp = allFiveDone && !alreadyRewarded ? AUSTRALIA_DISCOVERY_XP_REWARD : 0;

  return {
    ...progress,
    rewards: {
      ...progress.rewards,
      xp: progress.rewards.xp + grantXp,
    },
    missionProgress: {
      ...progress.missionProgress,
      [AUSTRALIA_MISSION_ID]: {
        ...existing,
        status: existing.status === 'completed' ? 'completed' : 'in_progress',
        currentStage: existing.completedActivityIds.includes(AUSTRALIA_BUILD_ACTIVITY_ID)
          ? existing.currentStage
          : allFiveDone || alreadyRewarded
            ? 'build'
            : 'discover',
        completedActivityIds: nextCompletedActivityIds,
        australiaExploredPoiIds: nextExplored,
        australiaDiscoverStarted: true,
        australiaCompletedDiscoverIds: nextCompleted,
      },
    },
  };
}

/**
 * Starts the Stage 2 BUILD Interactive Conversation Builder via Olivia Parker (+0 XP).
 * Requires Stage 1 DISCOVER to be legitimately completed.
 */
export function startAustraliaBuildMission(progress: LocalProgressV1): LocalProgressV1 {
  if (!isAustraliaBuildUnlocked(progress)) {
    return progress;
  }

  const activeReplay = getActiveReplayAttempt(progress, 'australia');
  if (activeReplay) {
    const currentMet = Array.from(
      new Set(
        (activeReplay.australiaMetNpcIds ?? []).filter((id) => VALID_AUSTRALIA_NPC_IDS.has(id)),
      ),
    );
    const nextMet = currentMet.includes('npc_olivia') ? currentMet : [...currentMet, 'npc_olivia'];
    if (activeReplay.australiaBuildStarted && currentMet.includes('npc_olivia')) {
      return progress;
    }
    const replayState = getReplayState(progress);
    return {
      ...progress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          australia: {
            ...activeReplay,
            currentStage: isAustraliaBuildCompleted(progress) ? activeReplay.currentStage : 'build',
            australiaMetNpcIds: nextMet,
            australiaBuildStarted: true,
            australiaCompletedBuildIds: activeReplay.australiaCompletedBuildIds ?? [],
            australiaBuiltDialogues: activeReplay.australiaBuiltDialogues ?? {},
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[AUSTRALIA_MISSION_ID];
  if (!existing) return progress;

  const currentMet = Array.from(
    new Set(
      (existing.australiaMetNpcIds ?? []).filter((id) => VALID_AUSTRALIA_NPC_IDS.has(id)),
    ),
  );
  const nextMet = currentMet.includes('npc_olivia') ? currentMet : [...currentMet, 'npc_olivia'];

  if (
    existing.australiaBuildStarted &&
    (existing.status === 'in_progress' || existing.status === 'completed') &&
    currentMet.includes('npc_olivia')
  ) {
    return progress;
  }

  return {
    ...progress,
    missionProgress: {
      ...progress.missionProgress,
      [AUSTRALIA_MISSION_ID]: {
        ...existing,
        status: existing.status === 'completed' ? 'completed' : 'in_progress',
        currentStage: isAustraliaBuildCompleted(progress) ? existing.currentStage : 'build',
        australiaMetNpcIds: nextMet,
        australiaBuildStarted: true,
        australiaCompletedBuildIds: existing.australiaCompletedBuildIds ?? [],
        australiaBuiltDialogues: existing.australiaBuiltDialogues ?? {},
      },
    },
  };
}

/**
 * Completes a sequential Stage 2 BUILD mission at its Sydney landmark.
 * - Individual BUILD missions award 0 XP.
 * - Completing all 5 awards +50 XP ONCE (first lifetime completion only), unlocks Stage 3 PRACTICE.
 */
export function completeAustraliaBuildMission(
  progress: LocalProgressV1,
  landmarkId: AustraliaLandmarkId,
  craftedDialogueSummary?: string,
): LocalProgressV1 {
  if (!isAustraliaBuildUnlocked(progress) || !VALID_AUSTRALIA_LANDMARK_IDS.has(landmarkId)) {
    return progress;
  }

  const fallbackModel = getAustraliaBuildMissionMeta(landmarkId).defaultArtifactModel;
  const trimmedSummary =
    typeof craftedDialogueSummary === 'string' && craftedDialogueSummary.trim().length >= 4
      ? craftedDialogueSummary.trim().slice(0, 320)
      : fallbackModel;

  const activeReplay = getActiveReplayAttempt(progress, 'australia');
  if (activeReplay) {
    if (!activeReplay.australiaBuildStarted) return progress;
    const currentCompleted = getSequentialAustraliaBuildPrefix(
      activeReplay.australiaCompletedBuildIds,
    );
    const alreadyCompletedThis = currentCompleted.includes(landmarkId);
    const expectedNext = AUSTRALIA_BUILD_MISSION_ORDER[currentCompleted.length];
    if (!alreadyCompletedThis && expectedNext !== landmarkId) return progress;

    const nextCompleted = alreadyCompletedThis
      ? currentCompleted
      : [...currentCompleted, landmarkId];
    const currentExplored = Array.from(
      new Set(
        (activeReplay.australiaExploredPoiIds ?? []).filter((id) =>
          VALID_AUSTRALIA_LANDMARK_IDS.has(id),
        ),
      ),
    );
    const nextExplored = currentExplored.includes(landmarkId)
      ? currentExplored
      : [...currentExplored, landmarkId];
    const nextBuiltDialogues: Record<string, string> = {
      ...(activeReplay.australiaBuiltDialogues ?? {}),
      [landmarkId]: trimmedSummary,
    };

    const allFiveDone = nextCompleted.length >= AUSTRALIA_BUILD_MISSION_ORDER.length;
    const attemptHasActivity = activeReplay.completedActivityIds.includes(
      AUSTRALIA_BUILD_ACTIVITY_ID,
    );
    const nextAttemptIds =
      allFiveDone && !attemptHasActivity
        ? [...activeReplay.completedActivityIds, AUSTRALIA_BUILD_ACTIVITY_ID]
        : activeReplay.completedActivityIds;

    const lifetime = progress.missionProgress[AUSTRALIA_MISSION_ID] ?? {
      status: 'not_started' as const,
      currentStage: 'discover' as const,
      completedActivityIds: [],
    };
    const lifetimeCanGrant =
      allFiveDone &&
      lifetime.completedActivityIds.includes(AUSTRALIA_DISCOVERY_ACTIVITY_ID) &&
      !lifetime.completedActivityIds.includes(AUSTRALIA_BUILD_ACTIVITY_ID);

    const replayState = getReplayState(progress);
    return {
      ...progress,
      rewards: {
        ...progress.rewards,
        xp: lifetimeCanGrant ? progress.rewards.xp + AUSTRALIA_BUILD_XP_REWARD : progress.rewards.xp,
      },
      missionProgress: lifetimeCanGrant
        ? {
            ...progress.missionProgress,
            [AUSTRALIA_MISSION_ID]: {
              ...lifetime,
              status: lifetime.status === 'completed' ? 'completed' : 'in_progress',
              currentStage: lifetime.completedActivityIds.includes(AUSTRALIA_PRACTICE_ACTIVITY_ID)
                ? lifetime.currentStage
                : 'practice',
              completedActivityIds: [...lifetime.completedActivityIds, AUSTRALIA_BUILD_ACTIVITY_ID],
              australiaBuildStarted: true,
              australiaCompletedBuildIds: nextCompleted,
              australiaBuiltDialogues: nextBuiltDialogues,
            },
          }
        : progress.missionProgress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          australia: {
            ...activeReplay,
            currentStage: activeReplay.completedActivityIds.includes(AUSTRALIA_PRACTICE_ACTIVITY_ID)
              ? activeReplay.currentStage
              : allFiveDone || attemptHasActivity
                ? 'practice'
                : 'build',
            completedActivityIds: nextAttemptIds,
            australiaExploredPoiIds: nextExplored,
            australiaBuildStarted: true,
            australiaCompletedBuildIds: nextCompleted,
            australiaBuiltDialogues: nextBuiltDialogues,
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[AUSTRALIA_MISSION_ID];
  if (!existing || !existing.australiaBuildStarted) {
    return progress;
  }

  const currentCompleted = getSequentialAustraliaBuildPrefix(
    existing.australiaCompletedBuildIds,
  );
  const alreadyCompletedThis = currentCompleted.includes(landmarkId);
  const expectedNext = AUSTRALIA_BUILD_MISSION_ORDER[currentCompleted.length];

  if (!alreadyCompletedThis && expectedNext !== landmarkId) {
    return progress;
  }

  const nextCompleted = alreadyCompletedThis
    ? currentCompleted
    : [...currentCompleted, landmarkId];

  const currentExplored = Array.from(
    new Set(
      (existing.australiaExploredPoiIds ?? []).filter((id) =>
        VALID_AUSTRALIA_LANDMARK_IDS.has(id),
      ),
    ),
  );
  const nextExplored = currentExplored.includes(landmarkId)
    ? currentExplored
    : [...currentExplored, landmarkId];

  const nextBuiltDialogues: Record<string, string> = {
    ...(existing.australiaBuiltDialogues ?? {}),
    [landmarkId]: trimmedSummary,
  };

  const allFiveDone = nextCompleted.length >= AUSTRALIA_BUILD_MISSION_ORDER.length;
  const alreadyRewarded = existing.completedActivityIds.includes(
    AUSTRALIA_BUILD_ACTIVITY_ID,
  );

  const nextCompletedActivityIds =
    allFiveDone && !alreadyRewarded
      ? [...existing.completedActivityIds, AUSTRALIA_BUILD_ACTIVITY_ID]
      : existing.completedActivityIds;

  const grantXp = allFiveDone && !alreadyRewarded ? AUSTRALIA_BUILD_XP_REWARD : 0;

  return {
    ...progress,
    rewards: {
      ...progress.rewards,
      xp: progress.rewards.xp + grantXp,
    },
    missionProgress: {
      ...progress.missionProgress,
      [AUSTRALIA_MISSION_ID]: {
        ...existing,
        status: existing.status === 'completed' ? 'completed' : 'in_progress',
        currentStage: existing.completedActivityIds.includes(AUSTRALIA_PRACTICE_ACTIVITY_ID)
          ? existing.currentStage
          : allFiveDone || alreadyRewarded
            ? 'practice'
            : 'build',
        completedActivityIds: nextCompletedActivityIds,
        australiaExploredPoiIds: nextExplored,
        australiaBuildStarted: true,
        australiaCompletedBuildIds: nextCompleted,
        australiaBuiltDialogues: nextBuiltDialogues,
      },
    },
  };
}

/**
 * Starts the Stage 3 PRACTICE Interactive Speaking Missions via Olivia Parker (+0 XP).
 * Requires Stage 2 BUILD to be legitimately completed.
 */
export function startAustraliaPracticeMission(progress: LocalProgressV1): LocalProgressV1 {
  if (!isAustraliaPracticeUnlocked(progress)) {
    return progress;
  }

  const activeReplay = getActiveReplayAttempt(progress, 'australia');
  if (activeReplay) {
    const currentMet = Array.from(
      new Set(
        (activeReplay.australiaMetNpcIds ?? []).filter((id) => VALID_AUSTRALIA_NPC_IDS.has(id)),
      ),
    );
    const nextMet = currentMet.includes('npc_olivia') ? currentMet : [...currentMet, 'npc_olivia'];
    if (activeReplay.australiaPracticeStarted && currentMet.includes('npc_olivia')) {
      return progress;
    }
    const replayState = getReplayState(progress);
    return {
      ...progress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          australia: {
            ...activeReplay,
            currentStage: isAustraliaPracticeCompleted(progress)
              ? activeReplay.currentStage
              : 'practice',
            australiaMetNpcIds: nextMet,
            australiaPracticeStarted: true,
            australiaCompletedPracticeIds: activeReplay.australiaCompletedPracticeIds ?? [],
            australiaPracticeEvidence: activeReplay.australiaPracticeEvidence ?? {},
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[AUSTRALIA_MISSION_ID];
  if (!existing) return progress;

  const currentMet = Array.from(
    new Set(
      (existing.australiaMetNpcIds ?? []).filter((id) => VALID_AUSTRALIA_NPC_IDS.has(id)),
    ),
  );
  const nextMet = currentMet.includes('npc_olivia') ? currentMet : [...currentMet, 'npc_olivia'];

  if (
    existing.australiaPracticeStarted &&
    (existing.status === 'in_progress' || existing.status === 'completed') &&
    currentMet.includes('npc_olivia')
  ) {
    return progress;
  }

  return {
    ...progress,
    missionProgress: {
      ...progress.missionProgress,
      [AUSTRALIA_MISSION_ID]: {
        ...existing,
        status: existing.status === 'completed' ? 'completed' : 'in_progress',
        currentStage: isAustraliaPracticeCompleted(progress) ? existing.currentStage : 'practice',
        australiaMetNpcIds: nextMet,
        australiaPracticeStarted: true,
        australiaCompletedPracticeIds: existing.australiaCompletedPracticeIds ?? [],
        australiaPracticeEvidence: existing.australiaPracticeEvidence ?? {},
      },
    },
  };
}

/**
 * Completes a sequential Stage 3 PRACTICE speaking mission at its Sydney landmark.
 * - Individual speaking missions award 0 XP.
 * - Completing all 5 awards +50 XP ONCE (first lifetime completion only), unlocks Stage 4 PERFORM.
 */
export function completeAustraliaPracticeMission(
  progress: LocalProgressV1,
  landmarkId: AustraliaLandmarkId,
  evidence: AustraliaSpeakingEvidenceRecord,
): LocalProgressV1 {
  if (!isAustraliaPracticeUnlocked(progress) || !VALID_AUSTRALIA_LANDMARK_IDS.has(landmarkId)) {
    return progress;
  }

  const missionSpec = getAustraliaPracticeMissionSpec(landmarkId);
  if (!missionSpec) return progress;
  const requiredTurnIds = missionSpec.turns.map((t) => t.turnId);
  if (!isValidAustraliaSpeakingEvidenceRecord(evidence, requiredTurnIds)) {
    return progress;
  }
  const cleanEvidence = sanitizeAustraliaSpeakingEvidenceRecord(evidence, requiredTurnIds);
  if (!cleanEvidence) return progress;

  const activeReplay = getActiveReplayAttempt(progress, 'australia');
  if (activeReplay) {
    if (!activeReplay.australiaPracticeStarted) return progress;
    const currentCompleted = getSequentialAustraliaPracticePrefix(
      activeReplay.australiaCompletedPracticeIds,
    );
    const alreadyCompletedThis = currentCompleted.includes(landmarkId);
    const expectedNext = AUSTRALIA_PRACTICE_MISSION_ORDER[currentCompleted.length];
    if (!alreadyCompletedThis && expectedNext !== landmarkId) return progress;

    const nextCompleted = alreadyCompletedThis
      ? currentCompleted
      : [...currentCompleted, landmarkId];
    const currentExplored = Array.from(
      new Set(
        (activeReplay.australiaExploredPoiIds ?? []).filter((id) =>
          VALID_AUSTRALIA_LANDMARK_IDS.has(id),
        ),
      ),
    );
    const nextExplored = currentExplored.includes(landmarkId)
      ? currentExplored
      : [...currentExplored, landmarkId];
    const nextEvidenceMap: Record<string, AustraliaSpeakingEvidenceRecord> = {
      ...(activeReplay.australiaPracticeEvidence ?? {}),
      [landmarkId]: cleanEvidence,
    };

    const allFiveDone = nextCompleted.length >= AUSTRALIA_PRACTICE_MISSION_ORDER.length;
    const attemptHasActivity = activeReplay.completedActivityIds.includes(
      AUSTRALIA_PRACTICE_ACTIVITY_ID,
    );
    const nextAttemptIds =
      allFiveDone && !attemptHasActivity
        ? [...activeReplay.completedActivityIds, AUSTRALIA_PRACTICE_ACTIVITY_ID]
        : activeReplay.completedActivityIds;

    const lifetime = progress.missionProgress[AUSTRALIA_MISSION_ID] ?? {
      status: 'not_started' as const,
      currentStage: 'discover' as const,
      completedActivityIds: [],
    };
    const lifetimeCanGrant =
      allFiveDone &&
      lifetime.completedActivityIds.includes(AUSTRALIA_BUILD_ACTIVITY_ID) &&
      !lifetime.completedActivityIds.includes(AUSTRALIA_PRACTICE_ACTIVITY_ID);

    const replayState = getReplayState(progress);
    return {
      ...progress,
      rewards: {
        ...progress.rewards,
        xp: lifetimeCanGrant
          ? progress.rewards.xp + AUSTRALIA_PRACTICE_XP_REWARD
          : progress.rewards.xp,
      },
      missionProgress: lifetimeCanGrant
        ? {
            ...progress.missionProgress,
            [AUSTRALIA_MISSION_ID]: {
              ...lifetime,
              status: lifetime.status === 'completed' ? 'completed' : 'in_progress',
              currentStage: 'perform',
              completedActivityIds: [...lifetime.completedActivityIds, AUSTRALIA_PRACTICE_ACTIVITY_ID],
              australiaPracticeStarted: true,
              australiaCompletedPracticeIds: nextCompleted,
              australiaPracticeEvidence: nextEvidenceMap,
            },
          }
        : progress.missionProgress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          australia: {
            ...activeReplay,
            currentStage: allFiveDone || attemptHasActivity ? 'perform' : 'practice',
            completedActivityIds: nextAttemptIds,
            australiaExploredPoiIds: nextExplored,
            australiaPracticeStarted: true,
            australiaCompletedPracticeIds: nextCompleted,
            australiaPracticeEvidence: nextEvidenceMap,
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[AUSTRALIA_MISSION_ID];
  if (!existing || !existing.australiaPracticeStarted) {
    return progress;
  }

  const currentCompleted = getSequentialAustraliaPracticePrefix(
    existing.australiaCompletedPracticeIds,
  );
  const alreadyCompletedThis = currentCompleted.includes(landmarkId);
  const expectedNext = AUSTRALIA_PRACTICE_MISSION_ORDER[currentCompleted.length];

  if (!alreadyCompletedThis && expectedNext !== landmarkId) {
    return progress;
  }

  const nextCompleted = alreadyCompletedThis
    ? currentCompleted
    : [...currentCompleted, landmarkId];

  const currentExplored = Array.from(
    new Set(
      (existing.australiaExploredPoiIds ?? []).filter((id) =>
        VALID_AUSTRALIA_LANDMARK_IDS.has(id),
      ),
    ),
  );
  const nextExplored = currentExplored.includes(landmarkId)
    ? currentExplored
    : [...currentExplored, landmarkId];

  const nextEvidenceMap: Record<string, AustraliaSpeakingEvidenceRecord> = {
    ...(existing.australiaPracticeEvidence ?? {}),
    [landmarkId]: cleanEvidence,
  };

  const allFiveDone = nextCompleted.length >= AUSTRALIA_PRACTICE_MISSION_ORDER.length;
  const alreadyRewarded = existing.completedActivityIds.includes(
    AUSTRALIA_PRACTICE_ACTIVITY_ID,
  );

  const nextCompletedActivityIds =
    allFiveDone && !alreadyRewarded
      ? [...existing.completedActivityIds, AUSTRALIA_PRACTICE_ACTIVITY_ID]
      : existing.completedActivityIds;

  const grantXp = allFiveDone && !alreadyRewarded ? AUSTRALIA_PRACTICE_XP_REWARD : 0;

  return {
    ...progress,
    rewards: {
      ...progress.rewards,
      xp: progress.rewards.xp + grantXp,
    },
    missionProgress: {
      ...progress.missionProgress,
      [AUSTRALIA_MISSION_ID]: {
        ...existing,
        status: existing.status === 'completed' ? 'completed' : 'in_progress',
        currentStage: allFiveDone || alreadyRewarded ? 'perform' : 'practice',
        completedActivityIds: nextCompletedActivityIds,
        australiaExploredPoiIds: nextExplored,
        australiaPracticeStarted: true,
        australiaCompletedPracticeIds: nextCompleted,
        australiaPracticeEvidence: nextEvidenceMap,
      },
    },
  };
}

/**
 * Starts Stage 4 PERFORM — Final Sydney CityTalk Challenge via Olivia Parker (+0 XP).
 * Requires Stage 3 PRACTICE to be legitimately completed.
 */
export function startAustraliaPerformMission(progress: LocalProgressV1): LocalProgressV1 {
  if (!isAustraliaPerformUnlocked(progress)) {
    return progress;
  }

  const activeReplay = getActiveReplayAttempt(progress, 'australia');
  if (activeReplay) {
    const currentMet = Array.from(
      new Set(
        (activeReplay.australiaMetNpcIds ?? []).filter((id) => VALID_AUSTRALIA_NPC_IDS.has(id)),
      ),
    );
    const nextMet = currentMet.includes('npc_olivia') ? currentMet : [...currentMet, 'npc_olivia'];
    if (activeReplay.australiaPerformStarted && currentMet.includes('npc_olivia')) {
      return progress;
    }
    const replayState = getReplayState(progress);
    return {
      ...progress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          australia: {
            ...activeReplay,
            currentStage: 'perform',
            australiaMetNpcIds: nextMet,
            australiaPerformStarted: true,
            australiaCompletedPerformIds: activeReplay.australiaCompletedPerformIds ?? [],
            australiaPerformEvidence: activeReplay.australiaPerformEvidence ?? {},
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[AUSTRALIA_MISSION_ID];
  if (!existing) return progress;

  const currentMet = Array.from(
    new Set(
      (existing.australiaMetNpcIds ?? []).filter((id) => VALID_AUSTRALIA_NPC_IDS.has(id)),
    ),
  );
  const nextMet = currentMet.includes('npc_olivia') ? currentMet : [...currentMet, 'npc_olivia'];

  if (
    existing.australiaPerformStarted &&
    (existing.status === 'in_progress' || existing.status === 'completed') &&
    currentMet.includes('npc_olivia')
  ) {
    return progress;
  }

  return {
    ...progress,
    missionProgress: {
      ...progress.missionProgress,
      [AUSTRALIA_MISSION_ID]: {
        ...existing,
        status: existing.status === 'completed' ? 'completed' : 'in_progress',
        currentStage: 'perform',
        australiaMetNpcIds: nextMet,
        australiaPerformStarted: true,
        australiaCompletedPerformIds: existing.australiaCompletedPerformIds ?? [],
        australiaPerformEvidence: existing.australiaPerformEvidence ?? {},
      },
    },
  };
}

/**
 * Records a completed sequential Stage 4 PERFORM role-play challenge at a Sydney landmark (+0 XP).
 * Rewards (+100 XP & stamp) wait strictly until all 5 challenges AND Final Guided Reflection complete.
 */
export function completeAustraliaPerformChallenge(
  progress: LocalProgressV1,
  landmarkId: AustraliaLandmarkId,
  record: AustraliaPerformChallengeRecord,
): LocalProgressV1 {
  if (!isAustraliaPerformUnlocked(progress) || !VALID_AUSTRALIA_LANDMARK_IDS.has(landmarkId)) {
    return progress;
  }

  const spec = getAustraliaPerformChallengeSpec(landmarkId);
  if (!spec) return progress;
  const requiredTurnIds = spec.turns.map((t) => t.turnId);
  if (!isValidAustraliaPerformChallengeRecord(record, requiredTurnIds)) {
    return progress;
  }
  const cleanRecord = sanitizeAustraliaPerformChallengeRecord(record, requiredTurnIds);
  if (!cleanRecord) return progress;

  const activeReplay = getActiveReplayAttempt(progress, 'australia');
  if (activeReplay) {
    if (!activeReplay.australiaPerformStarted) return progress;
    const currentCompleted = getSequentialAustraliaPerformPrefix(
      activeReplay.australiaCompletedPerformIds,
    );
    const alreadyCompletedThis = currentCompleted.includes(landmarkId);
    const expectedNext = AUSTRALIA_PERFORM_CHALLENGE_ORDER[currentCompleted.length];
    if (!alreadyCompletedThis && expectedNext !== landmarkId) return progress;

    const nextCompleted = alreadyCompletedThis
      ? currentCompleted
      : [...currentCompleted, landmarkId];
    const currentExplored = Array.from(
      new Set(
        (activeReplay.australiaExploredPoiIds ?? []).filter((id) =>
          VALID_AUSTRALIA_LANDMARK_IDS.has(id),
        ),
      ),
    );
    const nextExplored = currentExplored.includes(landmarkId)
      ? currentExplored
      : [...currentExplored, landmarkId];
    const nextEvidenceMap: Record<string, AustraliaPerformChallengeRecord> = {
      ...(activeReplay.australiaPerformEvidence ?? {}),
      [landmarkId]: cleanRecord,
    };

    const replayState = getReplayState(progress);
    return {
      ...progress,
      replayState: {
        ...replayState,
        activeAttempts: {
          ...replayState.activeAttempts,
          australia: {
            ...activeReplay,
            currentStage: 'perform',
            australiaExploredPoiIds: nextExplored,
            australiaPerformStarted: true,
            australiaCompletedPerformIds: nextCompleted,
            australiaPerformEvidence: nextEvidenceMap,
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[AUSTRALIA_MISSION_ID];
  if (!existing || !existing.australiaPerformStarted) {
    return progress;
  }

  const currentCompleted = getSequentialAustraliaPerformPrefix(
    existing.australiaCompletedPerformIds,
  );
  const alreadyCompletedThis = currentCompleted.includes(landmarkId);
  const expectedNext = AUSTRALIA_PERFORM_CHALLENGE_ORDER[currentCompleted.length];

  if (!alreadyCompletedThis && expectedNext !== landmarkId) {
    return progress;
  }

  const nextCompleted = alreadyCompletedThis
    ? currentCompleted
    : [...currentCompleted, landmarkId];

  const currentExplored = Array.from(
    new Set(
      (existing.australiaExploredPoiIds ?? []).filter((id) =>
        VALID_AUSTRALIA_LANDMARK_IDS.has(id),
      ),
    ),
  );
  const nextExplored = currentExplored.includes(landmarkId)
    ? currentExplored
    : [...currentExplored, landmarkId];

  const nextEvidenceMap: Record<string, AustraliaPerformChallengeRecord> = {
    ...(existing.australiaPerformEvidence ?? {}),
    [landmarkId]: cleanRecord,
  };

  return {
    ...progress,
    missionProgress: {
      ...progress.missionProgress,
      [AUSTRALIA_MISSION_ID]: {
        ...existing,
        status: hasCanonicalAustraliaPerformEntry(existing) ? 'completed' : 'in_progress',
        currentStage: 'perform',
        australiaExploredPoiIds: nextExplored,
        australiaPerformStarted: true,
        australiaCompletedPerformIds: nextCompleted,
        australiaPerformEvidence: nextEvidenceMap,
      },
    },
  };
}

/**
 * Completes Stage 4 PERFORM — Final Sydney CityTalk Challenge after all 5 challenges + Final Guided Reflection:
 * - Grants +100 XP ONCE on first lifetime completion (900 -> 1,000 XP).
 * - Awards `stamp_australia_sydney` ONCE (4th Passport Stamp).
 * - Marks `mission_australia_sydney` completed.
 * - Unlocks `'egypt'` eligibility (no duplicate XP/stamps on replay or re-submission).
 * - Supports Country Replay safely without duplicating lifetime XP/stamps.
 */
export function completeAustraliaPerformMission(
  progress: LocalProgressV1,
  reflectionState: AustraliaPerformReflectionState,
): LocalProgressV1 {
  if (!isAustraliaUnlocked(progress) || !isAustraliaPerformUnlocked(progress)) {
    return progress;
  }

  const cleanReflection = sanitizeAustraliaPerformReflectionState(reflectionState);
  if (!cleanReflection) {
    return progress;
  }

  const now = new Date().toISOString();
  const activeReplay = getActiveReplayAttempt(progress, 'australia');

  if (activeReplay) {
    if (!hasAllAustraliaPerformEvidence(activeReplay)) {
      return progress;
    }
    const completedIds = getSequentialAustraliaPerformPrefix(
      activeReplay.australiaCompletedPerformIds,
    );

    const attemptWasCompleted = hasCanonicalAustraliaPerformEntry(activeReplay);

    const lifetime = progress.missionProgress[AUSTRALIA_MISSION_ID] ?? {
      status: 'not_started' as const,
      currentStage: 'discover' as const,
      completedActivityIds: [],
    };
    const lifetimeAlreadyCanonical = hasCanonicalAustraliaPerformEntry(lifetime);
    const lifetimeCanGrant =
      !lifetimeAlreadyCanonical &&
      lifetime.completedActivityIds.includes(AUSTRALIA_PRACTICE_ACTIVITY_ID) &&
      !lifetime.completedActivityIds.includes(AUSTRALIA_PERFORM_ACTIVITY_ID);
    const lifetimeNeedsStamp = !progress.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID);

    const nextUnlocked =
      lifetimeCanGrant || isAustraliaMissionCompleted(progress)
        ? Array.from(new Set<CountryId>([...progress.unlockedCountryIds, 'australia', 'egypt']))
        : progress.unlockedCountryIds;

    const replayState = getReplayState(progress);
    const prevHistory = getCountryReplayHistory(progress, 'australia');
    const nextCompletedReplayCount = attemptWasCompleted
      ? prevHistory.completedReplayCount
      : prevHistory.completedReplayCount + 1;

    return {
      ...progress,
      unlockedCountryIds: nextUnlocked,
      rewards: {
        ...progress.rewards,
        xp: lifetimeCanGrant
          ? progress.rewards.xp + AUSTRALIA_PERFORM_XP_REWARD
          : progress.rewards.xp,
        stamps:
          (lifetimeCanGrant || isAustraliaMissionCompleted(progress)) && lifetimeNeedsStamp
            ? [...progress.rewards.stamps, AUSTRALIA_PASSPORT_STAMP_ID]
            : progress.rewards.stamps,
      },
      missionProgress: lifetimeCanGrant
        ? {
            ...progress.missionProgress,
            [AUSTRALIA_MISSION_ID]: {
              ...lifetime,
              status: 'completed',
              currentStage: 'perform',
              australiaPerformStarted: true,
              australiaCompletedPerformIds: completedIds,
              australiaPerformEvidence: activeReplay.australiaPerformEvidence,
              australiaPerformReflection: cleanReflection,
              australiaPerformCompleted: true,
              completedActivityIds: [
                ...lifetime.completedActivityIds,
                AUSTRALIA_PERFORM_ACTIVITY_ID,
              ],
              completedAt: lifetime.completedAt ?? now,
            },
          }
        : progress.missionProgress,
      replayState: {
        activeAttempts: {
          ...replayState.activeAttempts,
          australia: {
            ...activeReplay,
            status: 'completed',
            currentStage: 'perform',
            australiaPerformStarted: true,
            australiaCompletedPerformIds: completedIds,
            australiaPerformReflection: cleanReflection,
            australiaPerformCompleted: true,
            completedActivityIds: attemptWasCompleted
              ? activeReplay.completedActivityIds
              : [...activeReplay.completedActivityIds, AUSTRALIA_PERFORM_ACTIVITY_ID],
            completedAt: activeReplay.completedAt ?? now,
          },
        },
        history: {
          ...replayState.history,
          australia: {
            ...prevHistory,
            totalAttemptsStarted: Math.max(
              prevHistory.totalAttemptsStarted,
              activeReplay.attemptNumber,
            ),
            completedReplayCount: nextCompletedReplayCount,
            lastReplayCompletedAt: attemptWasCompleted
              ? (prevHistory.lastReplayCompletedAt ?? now)
              : now,
          },
        },
      },
    };
  }

  const existing = progress.missionProgress[AUSTRALIA_MISSION_ID];
  if (!existing || !hasAllAustraliaPerformEvidence(existing)) {
    return progress;
  }

  const completedIds = getSequentialAustraliaPerformPrefix(existing.australiaCompletedPerformIds);

  const alreadyCompletedActivity =
    existing.completedActivityIds.includes(AUSTRALIA_PERFORM_ACTIVITY_ID) &&
    hasCanonicalAustraliaPerformEntry(existing);
  const alreadyHasStamp = progress.rewards.stamps.includes(AUSTRALIA_PASSPORT_STAMP_ID);

  const nextCompletedIds = existing.completedActivityIds.includes(AUSTRALIA_PERFORM_ACTIVITY_ID)
    ? existing.completedActivityIds
    : [...existing.completedActivityIds, AUSTRALIA_PERFORM_ACTIVITY_ID];

  const nextStamps = alreadyHasStamp
    ? progress.rewards.stamps
    : [...progress.rewards.stamps, AUSTRALIA_PASSPORT_STAMP_ID];

  const nextXp = alreadyCompletedActivity
    ? progress.rewards.xp
    : progress.rewards.xp + AUSTRALIA_PERFORM_XP_REWARD;

  const nextUnlocked = Array.from(
    new Set<CountryId>([...progress.unlockedCountryIds, 'india', 'kenya', 'scotland', 'australia', 'egypt']),
  );

  return {
    ...progress,
    unlockedCountryIds: nextUnlocked,
    rewards: {
      ...progress.rewards,
      xp: nextXp,
      stamps: nextStamps,
    },
    missionProgress: {
      ...progress.missionProgress,
      [AUSTRALIA_MISSION_ID]: {
        ...existing,
        status: 'completed',
        currentStage: 'perform',
        australiaPerformStarted: true,
        australiaCompletedPerformIds: completedIds,
        australiaPerformReflection: cleanReflection,
        australiaPerformCompleted: true,
        completedActivityIds: nextCompletedIds,
        completedAt: existing.completedAt ?? now,
      },
    },
  };
}










