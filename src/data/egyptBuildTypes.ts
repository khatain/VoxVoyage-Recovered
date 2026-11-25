import type {
  EgyptBuildGameId,
  EgyptInstructionSkillCategory,
  LocalizedText,
} from '../types/game';
import {
  EGYPT_RECOMMENDED_ROUTE,
  EGYPT_STAGE_ACTIVITY_IDS,
  type EgyptLandmarkId,
  type EgyptNpcId,
} from './egyptWorld';

export const EGYPT_BUILD_ACTIVITY_ID = EGYPT_STAGE_ACTIVITY_IDS.build;
export const EGYPT_BUILD_XP_REWARD = 50;

export type EgyptBuildDifficultyMode = 'a2' | 'b1';

export const EGYPT_BUILD_MISSION_ORDER: readonly EgyptLandmarkId[] =
  EGYPT_RECOMMENDED_ROUTE;

export interface BuildHintLadder {
  tier1Structure: LocalizedText;
  tier2Focus: LocalizedText;
  tier3Scaffold: LocalizedText;
}

export interface BuildTile {
  instanceId: string;
  value: string;
  role:
    | 'verb'
    | 'negative'
    | 'sequencer'
    | 'object'
    | 'prep'
    | 'polite'
    | 'condition'
    | 'connector'
    | 'phrase';
  isDistractor?: boolean;
}

export const EGYPT_LAYLA_BUILD_INTRO: {
  title: LocalizedText;
  rankUpLabel: LocalizedText;
  greeting: LocalizedText;
  briefingNote: LocalizedText;
  ctaLabel: LocalizedText;
} = {
  title: {
    en: 'Stage 2 · BUILD — Ancient Instruction Builder',
    th: 'ด่านที่ 2 · BUILD — นักสร้างคำสั่งแห่งอารยธรรมโบราณ',
  },
  rankUpLabel: {
    en: 'Promotion · Expedition Trainee → Expedition Assistant',
    th: 'เลื่อนตำแหน่ง · นักสำรวจฝึกหัด → ผู้ช่วยคณะสำรวจ',
  },
  greeting: {
    en: 'Outstanding work decoding our instructions! Now our camp needs instruction creators. As an Expedition Assistant, you will forge packing commands, map Giza routes, draft papyrus steps, design temple rules, and author the Pharaoh’s Master Blueprint.',
    th: 'ยอดเยี่ยมมากที่เข้าใจรหัสคำสั่งทั้งหมดแล้ว! ตอนนี้ค่ายของเราต้องการผู้สร้างคำสั่งในฐานะ "ผู้ช่วยคณะสำรวจ" คุณจะได้สร้างคำสั่งจัดกระเป๋า วางเส้นทางกีซา เขียนขั้นตอนทำปาปิรุส ออกแบบป้ายกฎวิหาร และเขียนแปลนภารกิจหลักของฟาโรห์',
  },
  briefingNote: {
    en: 'Complete all 5 BUILD workshops in order (1 → 5). Every accepted construction is saved in "My Expedition Instructions" for future practice, and completing all 5 awards +50 XP (+0 XP per individual station).',
    th: 'ผ่านเวิร์กชอปทั้ง 5 จุดตามลำดับ (1 → 5) ประโยคที่คุณสร้างผ่านทุกข้อจะถูกบันทึกลงสมุดบันทึกคำสั่งเพื่อใช้ทบทวนในด่าน PRACTICE และรับ +50 XP เมื่อจบครบทั้ง 5 จุด (+0 XP ต่อเกมย่อย)',
  },
  ctaLabel: {
    en: 'Start BUILD',
    th: 'เริ่มด่าน BUILD',
  },
};

export interface EgyptBuildMissionMeta {
  order: number;
  gameId: EgyptBuildGameId;
  landmarkId: EgyptLandmarkId;
  guideNpcId: EgyptNpcId;
  skillCategory: EgyptInstructionSkillCategory;
  viaLandmarkTipOnly?: boolean;
  title: LocalizedText;
  mechanicLabel: LocalizedText;
  languageFocus: LocalizedText;
  introLine: LocalizedText;
  takeawaySummary: LocalizedText;
}

export const EGYPT_BUILD_MISSIONS: EgyptBuildMissionMeta[] = [
  {
    order: 1,
    gameId: 'expedition_command_forge',
    landmarkId: 'nile_expedition_camp',
    guideNpcId: 'npc_layla',
    skillCategory: 'imperatives_and_objects',
    title: {
      en: 'Game 1 · Expedition Command Forge',
      th: 'เกมที่ 1 · โรงตีคำสั่งคณะสำรวจ',
    },
    mechanicLabel: {
      en: 'Action Scene + Word/Phrase Forge',
      th: 'ดูภาพเป้าหมาย + ประกอบคำสั่งภาษาอังกฤษ',
    },
    languageFocus: {
      en: 'Direct imperatives, negative forms ("Do not / Don’t"), & packing sequences',
      th: 'กริยาคำสั่งตรงไปตรงมา รูปปฏิเสธ ("Do not / Don’t") และลำดับขั้นตอน',
    },
    introLine: {
      en: 'Inspect each illustrated camp goal and forge a clear, grammatically accurate packing instruction for teammates.',
      th: 'ดูภาพเป้าหมายที่โต๊ะอุปกรณ์ค่ายไนล์ แล้วประกอบคำสั่งภาษาอังกฤษให้เพื่อนร่วมทีมทำตามได้ถูกต้อง',
    },
    takeawaySummary: {
      en: 'Skill Built · Base verb first for commands ("Pack the compass"), "Do not + base verb" for warnings, and "First / Then" for paired tasks.',
      th: 'ทักษะที่ได้ · ขึ้นต้นด้วยกริยาช่อง 1 สำหรับคำสั่ง, ใช้ "Do not + กริยาช่อง 1" สำหรับข้อห้าม และใช้ "First / Then" เมื่อมีหลายขั้นตอน',
    },
  },
  {
    order: 2,
    gameId: 'pyramid_route_architect',
    landmarkId: 'giza_pyramid_plaza',
    guideNpcId: 'npc_omar',
    skillCategory: 'route_directions',
    viaLandmarkTipOnly: true,
    title: {
      en: 'Game 2 · Pyramid Route Architect',
      th: 'เกมที่ 2 · สถาปนิกเส้นทางมหาพีระมิด',
    },
    mechanicLabel: {
      en: 'Live Command-Driven Map Simulation',
      th: 'สร้างประโยคนำทาง + ทดสอบการเดินบนแผนที่จริง',
    },
    languageFocus: {
      en: 'Directional verbs, landmarks ("past the Sphinx"), turns, and end stops',
      th: 'คำสั่งบอกทิศทาง การอ้างอิงจุดสังเกต การเลี้ยวซ้าย-ขวา และจุดหยุด',
    },
    introLine: {
      en: 'Construct clear English route instructions for visitors and field teammates across the Giza learning map, then watch the explorer follow your exact words.',
      th: 'สร้างประโยคบอกทางภาษาอังกฤษบนแผนที่กีซาจำลอง แล้วกดจำลองเพื่อดูว่านักสำรวจเดินตามคำสั่งของคุณไปถึงเป้าหมายอย่างปลอดภัยหรือไม่',
    },
    takeawaySummary: {
      en: 'Skill Built · Combine movement + landmark + stopping cues ("Walk straight past the Sphinx, turn right, and stop beside the Information Point").',
      th: 'ทักษะที่ได้ · ผสานทิศทาง + จุดอ้างอิง + จุดหยุดให้ครบถ้วนเพื่อให้ผู้เดินตามถึงที่หมายโดยไม่หลงทาง',
    },
  },
  {
    order: 3,
    gameId: 'papyrus_instruction_workshop',
    landmarkId: 'ancient_scribe_workshop',
    guideNpcId: 'npc_mariam',
    skillCategory: 'multi_step_sequence',
    title: {
      en: 'Game 3 · Papyrus Instruction Workshop',
      th: 'เกมที่ 3 · เวิร์กชอปเขียนขั้นตอนปาปิรุส',
    },
    mechanicLabel: {
      en: 'Multi-Step Scroll Clause Builder',
      th: 'ประกอบม้วนกระดาษคำสั่งหลายขั้นตอน',
    },
    languageFocus: {
      en: 'Sequencing connectors ("First, Next, Then, After that, Finally") + process clauses',
      th: 'คำเชื่อมลำดับขั้นตอน ("First, Next, Then, Finally") และกริยาอธิบายกระบวนการ',
    },
    introLine: {
      en: 'Author clear multi-step workshop instructions for each illustrated scroll stage—choose the right sequencer, verb, and object in logical order.',
      th: 'เขียนขั้นตอนปฏิบัติสำหรับแต่ละภาพในโรงงานอาลักษณ์ เลือกคำเชื่อมลำดับ กริยา และกรรมให้เรียงลำดับอย่างสมเหตุสมผล',
    },
    takeawaySummary: {
      en: 'Skill Built · Real procedural guides pair a clear time connector ("First / Next / Finally") with one clean imperative action per step.',
      th: 'ทักษะที่ได้ · คู่มือขั้นตอนที่ดีจับคู่คำเชื่อมลำดับเวลาเข้ากับคำสั่งที่กระชับชัดเจนในแต่ละขั้น',
    },
  },
  {
    order: 4,
    gameId: 'temple_rule_architect',
    landmarkId: 'temple_of_the_sun',
    guideNpcId: 'npc_karim',
    skillCategory: 'rules_and_conditionals',
    title: {
      en: 'Game 4 · Temple Rule Architect',
      th: 'เกมที่ 4 · สถาปนิกกฎและมารยาทวิหาร',
    },
    mechanicLabel: {
      en: 'Live Temple Sign & Situational Pragmatics',
      th: 'สร้างป้ายกฎวิหารให้เหมาะกับสถานการณ์และระดับความสุภาพ',
    },
    languageFocus: {
      en: 'Polite requests ("Please..."), safety warnings, prohibitions, and "If / When / Before" rules',
      th: 'คำขออย่างสุภาพ ("Please...") คำเตือนความปลอดภัย ข้อห้าม และประโยคเงื่อนไข ("If / When / Before")',
    },
    introLine: {
      en: 'Study each temple courtyard situation and craft a sign that is both grammatically accurate and culturally respectful for the audience.',
      th: 'พิจารณาเหตุการณ์ในลานวิหารแห่งดวงอาทิตย์ แล้วสร้างข้อความบนป้ายที่ทั้งถูกหลักไวยากรณ์และเหมาะสมกับผู้รับสาร',
    },
    takeawaySummary: {
      en: 'Skill Built · Tone matters as much as grammar: choose "Please" for polite requests, "Do not" for strict heritage protection, and "If / When / Before" for safety checks.',
      th: 'ทักษะที่ได้ · น้ำเสียงสำคัญไม่แพ้ไวยากรณ์ ใช้ "Please" กับคำขอสุภาพ, "Do not" กับข้อห้ามสำคัญ และ "If / When / Before" เมื่อมีเงื่อนไข',
    },
  },
  {
    order: 5,
    gameId: 'pharaoh_master_blueprint',
    landmarkId: 'chamber_of_wisdom',
    guideNpcId: 'npc_layla',
    skillCategory: 'master_blueprint',
    viaLandmarkTipOnly: true,
    title: {
      en: 'Game 5 · The Pharaoh’s Master Blueprint',
      th: 'เกมที่ 5 · แปลนภารกิจหลักแห่งฟาโรห์',
    },
    mechanicLabel: {
      en: 'Multi-Section Expedition Plan Authoring',
      th: 'เขียนแปลนคำสั่งคณะสำรวจแบบบูรณาการ 4 หมวด',
    },
    languageFocus: {
      en: 'Integrated Preparation + Directions + Sequence + Rules & Understanding Check',
      th: 'บูรณาการ การเตรียมตัว + การบอกทาง + ลำดับขั้นตอน + กฎและการเช็กความเข้าใจ',
    },
    introLine: {
      en: 'Assemble complete multi-part expedition plans outside the sealed Chamber of Wisdom. Use your Expedition Journal anytime if you want a reminder!',
      th: 'ประกอบแปลนภารกิจแบบครบทุกส่วนหน้าประตูโถงแห่งปัญญาที่ยังปิดผนึก สามารถเปิดดูบันทึกคำสั่งของคุณประกอบได้ตลอดเวลา',
    },
    takeawaySummary: {
      en: 'Skill Built · As an Expedition Assistant, you can now write complete, logical, respectful English instruction blueprints ready for spoken rehearsal in Stage 3 PRACTICE.',
      th: 'ทักษะที่ได้ · ในฐานะผู้ช่วยคณะสำรวจ คุณสามารถเขียนแปลนคำสั่งภาษาอังกฤษแบบบูรณาการได้อย่างสมบูรณ์ พร้อมสู่ด่าน PRACTICE แล้ว',
    },
  },
];

export type EquipmentPropId =
  | 'backpack'
  | 'map'
  | 'compass'
  | 'notebook'
  | 'camera'
  | 'water_bottle'
  | 'pencil'
  | 'sun_hat';

export interface CommandForgeChallengeVariant {
  mode: EgyptBuildDifficultyMode;
  goalSummary: LocalizedText;
  targetOutcomeEn: string;
  targetOutcomeTh: string;
  actionDemoKey:
    | 'pack_compass'
    | 'open_notebook'
    | 'ban_camera'
    | 'prep_water_hat'
    | 'protect_fragile'
    | 'pair_map_pencil';
  highlightedItems: EquipmentPropId[];
  tiles: BuildTile[];
  acceptedPatterns: RegExp[];
  canonicalModel: string;
  thaiScaffold: string;
  diagnosticChecks: {
    requiresNegative?: boolean;
    negativeForbidden?: boolean;
    mustStartWithAnyVerb?: string[];
    pairOrderCheck?: {
      firstMustPrecedesSecond: [RegExp, RegExp];
      wrongOrderFeedback: LocalizedText;
    };
  };
  hints: BuildHintLadder;
}

export interface CommandForgeChallengeBundle {
  challengeId: string;
  order: number;
  title: LocalizedText;
  a2: CommandForgeChallengeVariant;
  b1: CommandForgeChallengeVariant;
}

export type RouteDirectionKind = 'N' | 'E' | 'S' | 'W';

export type ArchitectBoardTileKind = 'sand' | 'path' | 'blocked';

export interface ArchitectBoardLandmark {
  id: string;
  x: number;
  y: number;
  label: LocalizedText;
  color: string;
  iconKey:
    | 'camp'
    | 'sphinx'
    | 'pyramid_north'
    | 'oasis'
    | 'info_point'
    | 'viewing_platform'
    | 'flag';
}

export interface ArchitectSimulationStep {
  x: number;
  y: number;
  facing: RouteDirectionKind;
  actionText: string;
}

export interface ArchitectSimulationResult {
  validGrammar: boolean;
  validRoute: boolean;
  reachedEnd: boolean;
  hitBlocked: boolean;
  outOfBounds: boolean;
  finalPos: { x: number; y: number };
  finalFacing: RouteDirectionKind;
  path: ArchitectSimulationStep[];
  failureReasonKey?:
    | 'incomplete_phrase'
    | 'wrong_order'
    | 'hit_blocked'
    | 'out_of_bounds'
    | 'missed_waypoint'
    | 'wrong_destination'
    | 'wrong_stop';
  feedback: LocalizedText;
}

export interface RouteArchitectVariant {
  mode: EgyptBuildDifficultyMode;
  missionGoal: LocalizedText;
  startPos: { x: number; y: number; facing: RouteDirectionKind };
  targetPos: { x: number; y: number };
  requiredWaypoints: string[];
  targetLandmarkId: string;
  blockedCells: Array<{ x: number; y: number }>;
  tiles: BuildTile[];
  acceptedPatterns: RegExp[];
  canonicalModel: string;
  thaiScaffold: string;
  wrongOrderHint?: LocalizedText;
  hints: BuildHintLadder;
}

export interface RouteArchitectChallengeBundle {
  challengeId: string;
  order: number;
  title: LocalizedText;
  a2: RouteArchitectVariant;
  b1: RouteArchitectVariant;
}

export interface PapyrusWorkshopStepSpec {
  stepId: string;
  sceneKey:
    | 'prepare_notebook'
    | 'write_clue'
    | 'seal_scroll'
    | 'deliver_camp'
    | 'gather_reeds'
    | 'press_flat'
    | 'dry_sun'
    | 'pack_gear'
    | 'follow_markers'
    | 'check_map'
    | 'sketch_carving'
    | 'wash_brush'
    | 'place_scroll'
    | 'greet_visitor'
    | 'point_sign'
    | 'explain_rule';
  stepCaption: LocalizedText;
  allowedSequencers: string[];
  preferredSequencerIndex: number;
  verbOptions: string[];
  correctVerb: string;
  complementOptions: string[];
  correctComplement: string;
}

export interface PapyrusWorkshopVariant {
  mode: EgyptBuildDifficultyMode;
  scrollTopic: LocalizedText;
  stepsInCorrectOrder: PapyrusWorkshopStepSpec[];
  canonicalLines: string[];
  thaiScaffold: string;
  hints: BuildHintLadder;
}

export interface PapyrusWorkshopChallengeBundle {
  challengeId: string;
  order: number;
  title: LocalizedText;
  a2: PapyrusWorkshopVariant;
  b1: PapyrusWorkshopVariant;
}

export interface TempleRuleArchitectVariant {
  mode: EgyptBuildDifficultyMode;
  courtyardSceneKey:
    | 'gentle_request'
    | 'stone_warning'
    | 'quiet_shadow'
    | 'sun_alignment'
    | 'arrival_check'
    | 'context_courtesy';
  audienceLabel: LocalizedText;
  situationPrompt: LocalizedText;
  tiles: BuildTile[];
  acceptedPatterns: RegExp[];
  canonicalModel: string;
  thaiScaffold: string;
  inappropriateChecks: Array<{
    pattern: RegExp;
    feedback: LocalizedText;
  }>;
  hints: BuildHintLadder;
}

export interface TempleRuleArchitectChallengeBundle {
  challengeId: string;
  order: number;
  title: LocalizedText;
  a2: TempleRuleArchitectVariant;
  b1: TempleRuleArchitectVariant;
}

export interface BlueprintSectionSpec {
  sectionId: 'prep' | 'directions' | 'sequence' | 'rule_check';
  sectionLabel: LocalizedText;
  prompt: LocalizedText;
  tiles: BuildTile[];
  acceptedPatterns: RegExp[];
  canonicalLine: string;
}

export interface PharaohBlueprintVariant {
  mode: EgyptBuildDifficultyMode;
  missionBrief: LocalizedText;
  relatedSkillIds: EgyptBuildGameId[];
  sections: BlueprintSectionSpec[];
  thaiScaffold: string;
  hints: BuildHintLadder;
}

export interface PharaohBlueprintChallengeBundle {
  challengeId: string;
  order: number;
  title: LocalizedText;
  a2: PharaohBlueprintVariant;
  b1: PharaohBlueprintVariant;
}

/**
 * Joins learner-selected tokens into clean English instruction punctuation and spacing.
 */
export function joinNormalizedTiles(values: string[]): string {
  if (values.length === 0) return '';
  let raw = values
    .map((v) => v.trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\s+([,.;!?])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  if (!raw) return '';
  raw = raw.charAt(0).toUpperCase() + raw.slice(1);
  if (!/[.!?]$/.test(raw)) {
    raw = `${raw}.`;
  }
  return raw;
}

export function normalizeEnglishSentenceForCheck(sentence: string): string {
  return sentence
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;!?])/g, '$1')
    .replace(/[.!?]+$/g, '')
    .trim();
}

/**
 * Strict authored-pattern checker.
 * Evaluates full clause structure rather than isolated word bags.
 */
export function matchesAuthoredPatterns(
  sentence: string,
  acceptedPatterns: RegExp[],
): boolean {
  const cleaned = normalizeEnglishSentenceForCheck(sentence);
  if (!cleaned) return false;
  return acceptedPatterns.some((pattern) => pattern.test(cleaned));
}
