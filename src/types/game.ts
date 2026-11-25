export type AppLanguage = 'en' | 'th';

export interface LocalizedText {
  en: string;
  th: string;
}

export type CefrLevel = 'A2' | 'A2+' | 'B1';

export type LanguageFunction =
  | 'TO_DESCRIBE'
  | 'TO_INFORM'
  | 'TO_PERSUADE'
  | 'TO_COMPARE_AND_CONTRAST'
  | 'TO_INTERACT'
  | 'TO_GIVE_INSTRUCTIONS';

export type LearningStageId = 'discover' | 'build' | 'practice' | 'perform';

export type MiniGameCategory =
  | 'vocabulary'
  | 'sentence_building'
  | 'speaking'
  | 'country_special';

export type MiniGameId =
  | 'word_detective'
  | 'vocab_maze'
  | 'memory_flip'
  | 'word_hunter'
  | 'word_catcher'
  | 'word_smash'
  | 'mystery_box'
  | 'word_maze'
  | 'word_association'
  | 'listen_and_pick'
  | 'sentence_train'
  | 'magic_spell_maker'
  | 'mystery_card_speaking'
  | 'magic_speech_bubble'
  | 'npc_conversation_chain'
  | 'spot_and_speak';

export type NpcAnimationState =
  | 'idle'
  | 'greeting'
  | 'listening'
  | 'talking'
  | 'happy'
  | 'thinking'
  | 'serving'
  | 'celebrating';

export interface NpcVoiceProfile {
  id: string;
  accentLabel: LocalizedText;
  recommendedRate: number;
  recommendedPitch: number;
  prerecordedAvailable: boolean;
  ttsFallbackReady: boolean;
}

export interface NpcProfile {
  id: string;
  name: string;
  role: LocalizedText;
  countryId: CountryId;
  voiceProfile: NpcVoiceProfile;
  supportedStates: NpcAnimationState[];
  greetingPreview: LocalizedText;
}

export type CountryId = 'india' | 'kenya' | 'scotland' | 'australia' | 'egypt';

export type ImplementationPhase =
  | 'phase_0'
  | 'phase_1'
  | 'phase_2'
  | 'phase_3'
  | 'phase_4'
  | 'phase_5'
  | 'phase_6'
  | 'phase_7';

export interface CountryWorld {
  id: CountryId;
  order: number;
  code: string;
  countryName: LocalizedText;
  title: LocalizedText;
  cityOrRegion: LocalizedText;
  languageFunctions: LanguageFunction[];
  cefrBand: CefrLevel;
  scenarioSummary: LocalizedText;
  communicationGoal: LocalizedText;
  finalSpeakingTask: LocalizedText;
  culturalHighlight: LocalizedText;
  stampTitle: LocalizedText;
  coordinates: {
    lat: number;
    lng: number;
  };
  themeColors: {
    primary: string;
    accent: string;
    sky: string;
  };
  dioramaImageUrl: string;
  npc: NpcProfile;
  missionId: string;
  targetPhase: ImplementationPhase;
}

export interface LearningStageDefinition {
  id: LearningStageId;
  order: number;
  code: string;
  name: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  learnerActions: LocalizedText[];
  accentColor: string;
}

export interface MissionStagePlan {
  stageId: LearningStageId;
  objective: LocalizedText;
  plannedMiniGames: MiniGameId[];
  estimatedMinutes: number;
}

export interface MissionDefinition {
  id: string;
  countryId: CountryId;
  title: LocalizedText;
  cefrLevel: CefrLevel;
  languageFunctions: LanguageFunction[];
  stages: MissionStagePlan[];
  rewardPreview: {
    xp: number;
    coins: number;
    gems: number;
    stampId: string;
  };
  targetPhase: ImplementationPhase;
}

export interface MiniGameSpec {
  id: MiniGameId;
  number: number;
  category: MiniGameCategory;
  title: LocalizedText;
  objective: LocalizedText;
  stageFit: LearningStageId[];
  accessibilityNote: LocalizedText;
}

export interface RewardWallet {
  xp: number;
  coins: number;
  gems: number;
  stamps: string[];
}

export type AvatarModelId = 'voyager_classic' | 'trailblazer_slim' | 'pioneer_sturdy';

export type AvatarHairStyleId =
  | 'short_tousled'
  | 'bob_wave'
  | 'high_ponytail'
  | 'twin_buns'
  | 'curly_crown'
  | 'explorer_spiky';

export type AvatarOutfitId =
  | 'field_jacket'
  | 'sky_hoodie'
  | 'safari_vest'
  | 'coastal_poncho';

export interface AvatarConfig {
  modelId: AvatarModelId;
  displayName: string;
  hairStyle: AvatarHairStyleId;
  hairColor: string;
  skinTone: string;
  outfitId: AvatarOutfitId;
  outfitColor: string;
  backpackColor: string;
  accessoryIds: string[];
  customizedInPhase1: boolean;
}

export type ScreenRoute =
  | 'welcome'
  | 'avatar-studio'
  | 'briefing'
  | 'world-map'
  | 'country-lobby'
  | 'mission-pathway'
  | 'mini-game'
  | 'speaking-performance'
  | 'mission-result'
  | 'passport-reward';

export interface RouteDefinition {
  id: ScreenRoute;
  step: number;
  label: LocalizedText;
  shortLabel: LocalizedText;
  phase0Status: 'implemented' | 'preview' | 'placeholder';
  targetPhase: ImplementationPhase;
  parentRoute?: ScreenRoute;
  purpose: LocalizedText;
}

export type AppearanceMode = 'day' | 'night' | 'auto';
export type ResolvedAppearance = 'day' | 'night';

export interface AudioPreferences {
  musicEnabled: boolean;
  sfxEnabled: boolean;
}

export interface ScotlandSpeakingReflectionState {
  practiceMode: 'recorded_mic' | 'self_reported_no_mic';
  checks: {
    comparedCultures: boolean;
    usedSpecificExample: boolean;
    explainedSimilarityOrDifference: boolean;
    spokeClearly: boolean;
  };
  followUpPracticed?: boolean;
  completedAt: string;
}

export type ScotlandPerformPracticeMode = 'recorded_mic' | 'self_reported_no_mic';

export interface ScotlandPerformOutline {
  introduction: string;
  similarity: string;
  difference: string;
  evidenceNotes: string;
  conclusion: string;
}

export type ScotlandPerformQaQuestionId = 'qa_eilidh' | 'qa_fiona';

export type ScotlandPerformQaStates = Partial<
  Record<ScotlandPerformQaQuestionId, ScotlandPerformPracticeMode>
>;

export interface ScotlandPerformReflectionState {
  checks: {
    introducedComparison: boolean;
    explainedSimilarity: boolean;
    explainedDifference: boolean;
    usedSpecificExamples: boolean;
    answeredBothQuestions: boolean;
    spokeClearlyConfidently: boolean;
  };
  completedAt: string;
}

export type AustraliaPracticeMode = 'microphone_recording' | 'no_mic_rehearsal';

export interface AustraliaSpeakingEvidenceRecord {
  practiceMode: AustraliaPracticeMode;
  completedTurnIds: string[];
  reflectionChecks: {
    askedClearQuestion: boolean;
    respondedToNpc: boolean;
    usedPoliteExpression: boolean;
    checkedOrClarifiedMeaning: boolean;
  };
  difficultyUsed: 'a2' | 'b1';
  completedAt: string;
}

export type AustraliaPerformPracticeMode = 'microphone_recording' | 'no_mic_rehearsal';

export interface AustraliaPerformChallengeRecord {
  practiceMode: AustraliaPerformPracticeMode;
  completedTurnIds: string[];
  difficultyUsed: 'a2' | 'b1';
  usedScriptPreview: boolean;
  completedAt: string;
}

export interface AustraliaPerformReflectionState {
  easiestPart: string;
  mostChallengingPart: string;
  keptConversationGoing: string;
  usefulExpression: string;
  nextImprovement: string;
  completedAt: string;
}

export interface MissionProgressEntry {
  status: 'not_started' | 'in_progress' | 'completed';
  currentStage: LearningStageId;
  completedActivityIds: string[];
  wordDetectiveFoundIds?: string[];
  metAarav?: boolean;
  spotAndSpeakStarted?: boolean;
  spotAndSpeakDoneIds?: string[];
  kenyaDiscoverStarted?: boolean;
  kenyaDiscoveredIds?: string[];
  kenyaBuildStarted?: boolean;
  kenyaBuiltSentences?: Record<string, string>;
  kenyaPracticeStarted?: boolean;
  kenyaPracticedConversationIds?: string[];
  kenyaPerformStarted?: boolean;
  metEilidh?: boolean;
  metFiona?: boolean;
  scotlandExploredPoiIds?: string[];
  scotlandDiscoverStarted?: boolean;
  scotlandDiscoveredEvidenceIds?: string[];
  scotlandBuildStarted?: boolean;
  scotlandBuiltSentences?: Record<string, string>;
  scotlandPracticeStarted?: boolean;
  scotlandCompletedSpeakingIds?: string[];
  scotlandSpeakingReflectionStates?: Record<string, ScotlandSpeakingReflectionState>;
  scotlandPerformStarted?: boolean;
  scotlandPerformSelectedEvidenceIds?: string[];
  scotlandPerformOutline?: ScotlandPerformOutline;
  scotlandPerformSpeechPracticeMode?: ScotlandPerformPracticeMode;
  scotlandPerformQuestionPracticeStates?: ScotlandPerformQaStates;
  scotlandPerformReflectionState?: ScotlandPerformReflectionState;
  scotlandPerformCompleted?: boolean;
  australiaExploredPoiIds?: string[];
  australiaMetNpcIds?: string[];
  australiaDiscoverStarted?: boolean;
  australiaCompletedDiscoverIds?: string[];
  australiaBuildStarted?: boolean;
  australiaCompletedBuildIds?: string[];
  australiaBuiltDialogues?: Record<string, string>;
  australiaPracticeStarted?: boolean;
  australiaCompletedPracticeIds?: string[];
  australiaPracticeEvidence?: Record<string, AustraliaSpeakingEvidenceRecord>;
  australiaPerformStarted?: boolean;
  australiaCompletedPerformIds?: string[];
  australiaPerformEvidence?: Record<string, AustraliaPerformChallengeRecord>;
  australiaPerformReflection?: AustraliaPerformReflectionState;
  australiaPerformCompleted?: boolean;
  egyptEntered?: boolean;
  egyptExploredPoiIds?: string[];
  egyptMetNpcIds?: string[];
  egyptDiscoverStarted?: boolean;
  egyptCompletedDiscoverIds?: string[];
  egyptBuildStarted?: boolean;
  egyptCompletedBuildChallengeIds?: string[];
  egyptCompletedBuildIds?: string[];
  egyptBuildJournal?: EgyptInstructionJournalRecord[];
  completedAt?: string;
}

export type EgyptBuildGameId =
  | 'expedition_command_forge'
  | 'pyramid_route_architect'
  | 'papyrus_instruction_workshop'
  | 'temple_rule_architect'
  | 'pharaoh_master_blueprint';

export type EgyptInstructionSkillCategory =
  | 'imperatives_and_objects'
  | 'route_directions'
  | 'multi_step_sequence'
  | 'rules_and_conditionals'
  | 'master_blueprint';

export interface EgyptInstructionJournalRecord {
  id: string;
  missionId: string;
  gameId: EgyptBuildGameId;
  landmarkId: string;
  challengeId: string;
  challengeTitle: LocalizedText;
  cefrLevel: 'a2' | 'b1';
  instructionText: string;
  instructionLines: string[];
  thaiScaffold?: string;
  skillCategory: EgyptInstructionSkillCategory;
  completedAt: string;
  attemptNumber?: number;
}

export interface CountryReplayAttempt {
  countryId: CountryId;
  attemptNumber: number;
  status: 'in_progress' | 'completed';
  currentStage: LearningStageId;
  completedActivityIds: string[];
  startedAt: string;
  completedAt?: string;
  wordDetectiveFoundIds?: string[];
  metAarav?: boolean;
  spotAndSpeakStarted?: boolean;
  spotAndSpeakDoneIds?: string[];
  kenyaDiscoverStarted?: boolean;
  kenyaDiscoveredIds?: string[];
  kenyaBuildStarted?: boolean;
  kenyaBuiltSentences?: Record<string, string>;
  kenyaPracticeStarted?: boolean;
  kenyaPracticedConversationIds?: string[];
  kenyaPerformStarted?: boolean;
  metEilidh?: boolean;
  metFiona?: boolean;
  scotlandExploredPoiIds?: string[];
  scotlandDiscoverStarted?: boolean;
  scotlandDiscoveredEvidenceIds?: string[];
  scotlandBuildStarted?: boolean;
  scotlandBuiltSentences?: Record<string, string>;
  scotlandPracticeStarted?: boolean;
  scotlandCompletedSpeakingIds?: string[];
  scotlandSpeakingReflectionStates?: Record<string, ScotlandSpeakingReflectionState>;
  scotlandPerformStarted?: boolean;
  scotlandPerformSelectedEvidenceIds?: string[];
  scotlandPerformOutline?: ScotlandPerformOutline;
  scotlandPerformSpeechPracticeMode?: ScotlandPerformPracticeMode;
  scotlandPerformQuestionPracticeStates?: ScotlandPerformQaStates;
  scotlandPerformReflectionState?: ScotlandPerformReflectionState;
  scotlandPerformCompleted?: boolean;
  australiaExploredPoiIds?: string[];
  australiaMetNpcIds?: string[];
  australiaDiscoverStarted?: boolean;
  australiaCompletedDiscoverIds?: string[];
  australiaBuildStarted?: boolean;
  australiaCompletedBuildIds?: string[];
  australiaBuiltDialogues?: Record<string, string>;
  australiaPracticeStarted?: boolean;
  australiaCompletedPracticeIds?: string[];
  australiaPracticeEvidence?: Record<string, AustraliaSpeakingEvidenceRecord>;
  australiaPerformStarted?: boolean;
  australiaCompletedPerformIds?: string[];
  australiaPerformEvidence?: Record<string, AustraliaPerformChallengeRecord>;
  australiaPerformReflection?: AustraliaPerformReflectionState;
  australiaPerformCompleted?: boolean;
  egyptEntered?: boolean;
  egyptExploredPoiIds?: string[];
  egyptMetNpcIds?: string[];
  egyptDiscoverStarted?: boolean;
  egyptCompletedDiscoverIds?: string[];
  egyptBuildStarted?: boolean;
  egyptCompletedBuildChallengeIds?: string[];
  egyptCompletedBuildIds?: string[];
  egyptBuildJournal?: EgyptInstructionJournalRecord[];
}

export interface CountryReplayHistoryRecord {
  totalAttemptsStarted: number;
  completedReplayCount: number;
  lastAttemptStartedAt?: string;
  lastReplayCompletedAt?: string;
}

export interface CountryReplayState {
  activeAttempts: Partial<Record<CountryId, CountryReplayAttempt>>;
  history: Partial<Record<CountryId, CountryReplayHistoryRecord>>;
}

export interface CountryReplayCapabilities {
  countryId: CountryId;
  missionId: string;
  isImplemented: boolean;
  supportedStages: LearningStageId[];
}

export interface LocalProgressV1 {
  schemaVersion: 1;
  updatedAt: string;
  uiLanguage: AppLanguage;
  appearanceMode: AppearanceMode;
  audioPrefs: AudioPreferences;
  reducedMotionOverride: boolean | null;
  selectedCountryId: CountryId;
  currentRoute: ScreenRoute;
  avatar: AvatarConfig;
  rewards: RewardWallet;
  unlockedCountryIds: CountryId[];
  missionProgress: Record<string, MissionProgressEntry>;
  replayState?: CountryReplayState;
}
