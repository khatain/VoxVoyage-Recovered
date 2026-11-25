import type { LocalizedText } from '../types/game';
import {
  EGYPT_RECOMMENDED_ROUTE,
  EGYPT_STAGE_ACTIVITY_IDS,
  type EgyptLandmarkId,
  type EgyptNpcId,
} from './egyptWorld';

export const EGYPT_DISCOVERY_ACTIVITY_ID = EGYPT_STAGE_ACTIVITY_IDS.discover;
export const EGYPT_DISCOVERY_XP_REWARD = 50;

export type EgyptDifficultyMode = 'a2' | 'b1';

export type EgyptDiscoverGameId =
  | 'expedition_essentials'
  | 'pyramid_path_puzzle'
  | 'papyrus_sequence'
  | 'temple_guardian_rules'
  | 'pharaoh_instruction_code';

export const EGYPT_DISCOVER_MISSION_ORDER: readonly EgyptLandmarkId[] =
  EGYPT_RECOMMENDED_ROUTE;

export const EGYPT_LAYLA_DISCOVER_INTRO: {
  title: LocalizedText;
  greeting: LocalizedText;
  briefingNote: LocalizedText;
  ctaLabel: LocalizedText;
} = {
  title: {
    en: 'Stage 1 · DISCOVER — Secrets of the Pharaohs',
    th: 'ด่านที่ 1 · DISCOVER — ความลับแห่งฟาโรห์',
  },
  greeting: {
    en: 'Welcome, explorer! The Chamber of Wisdom holds many secrets, and every clue relies on clear English instructions. Are you ready to uncover the secrets of the Pharaohs?',
    th: 'ยินดีต้อนรับนักสำรวจ! โถงแห่งปัญญาเก็บงำความลับไว้มากมาย และเบาะแสทุกจุดต้องอาศัยการเข้าใจคำสั่งภาษาอังกฤษอย่างแม่นยำ พร้อมออกค้นพบความลับแห่งฟาโรห์แล้วหรือยัง?',
  },
  briefingNote: {
    en: 'Complete all 5 archaeological instruction stations in order from the Nile Camp to the Chamber Entrance to earn +50 XP and unlock Stage 2: BUILD (Coming Soon).',
    th: 'พิชิตภารกิจเรียนรู้คำสั่งทั้ง 5 จุดตามลำดับตั้งแต่ค่ายริมไนล์ถึงหน้าโถงแห่งปัญญา เพื่อรับ +50 XP และเตรียมพร้อมสู่ด่านที่ 2: BUILD (เร็ว ๆ นี้)',
  },
  ctaLabel: {
    en: 'Start DISCOVER',
    th: 'เริ่มด่าน DISCOVER',
  },
};

export interface EgyptDiscoverMissionMeta {
  order: number;
  gameId: EgyptDiscoverGameId;
  landmarkId: EgyptLandmarkId;
  guideNpcId: EgyptNpcId;
  viaLandmarkTipOnly?: boolean;
  title: LocalizedText;
  mechanicLabel: LocalizedText;
  instructionFocus: LocalizedText;
  introLine: LocalizedText;
  takeawaySummary: LocalizedText;
}

export const EGYPT_DISCOVER_MISSIONS: EgyptDiscoverMissionMeta[] = [
  {
    order: 1,
    gameId: 'expedition_essentials',
    landmarkId: 'nile_expedition_camp',
    guideNpcId: 'npc_layla',
    title: {
      en: 'Game 1 · Expedition Essentials',
      th: 'เกมที่ 1 · อุปกรณ์จำเป็นของคณะสำรวจ',
    },
    mechanicLabel: {
      en: 'Inventory & Object Selection',
      th: 'เลือกและจัดกระเป๋าอุปกรณ์ตามคำสั่ง',
    },
    instructionFocus: {
      en: 'Direct imperatives, negative rules ("do NOT"), and ordered packing cues',
      th: 'คำสั่งตรงไปตรงมา ข้อห้าม ("do NOT") และลำดับการจัดอุปกรณ์',
    },
    introLine: {
      en: 'Follow Dr. Layla’s packing instructions carefully—pack what the team needs and leave restricted items behind.',
      th: 'ทำตามคำแนะนำการจัดกระเป๋าของ ดร.ไลลา อย่างแม่นยำ เลือกเฉพาะของที่จำเป็นและหลีกเลี่ยงของที่ไม่ควรนำติดตัว',
    },
    takeawaySummary: {
      en: 'Takeaway · Notice negative verbs ("do not / avoid") and order words ("first / next / finally") before grabbing gear.',
      th: 'สรุปทักษะ · สังเกตคำสั่งห้าม ("do not / avoid") และคำบอกลำดับ ("first / next / finally") ให้ครบก่อนลงมือทำ',
    },
  },
  {
    order: 2,
    gameId: 'pyramid_path_puzzle',
    landmarkId: 'giza_pyramid_plaza',
    guideNpcId: 'npc_omar',
    viaLandmarkTipOnly: true,
    title: {
      en: 'Game 2 · Pyramid Path Puzzle',
      th: 'เกมที่ 2 · ปริศนาเส้นทางมหาพีระมิด',
    },
    mechanicLabel: {
      en: 'Interactive Giza Route Grid',
      th: 'ปริศนาเดินตามคำสั่งบนแผนที่จำลองกีซา',
    },
    instructionFocus: {
      en: 'Directional turns ("Turn left / Turn right"), steps forward, and safe route checks',
      th: 'การเลี้ยวซ้าย-ขวา การนับก้าวเดินตรง และเส้นทางปลอดภัยรอบจุดสังเกต',
    },
    introLine: {
      en: 'Follow Omar Khalil’s plaza guide tips to steer the explorer icon across our illustrated Giza learning board.',
      th: 'ใช้คำแนะนำเส้นทางของโอมาร์ คาลิล พาตัวละครเดินผ่านจุดสังเกตบนกระดานแผนที่จำลองกีซาอย่างปลอดภัย',
    },
    takeawaySummary: {
      en: 'Takeaway · Always check which direction the explorer is currently facing before interpreting "turn left" or "turn right".',
      th: 'สรุปทักษะ · เช็กทิศทางที่ผู้เดินหันหน้าอยู่เสมอ ก่อนตัดสินใจว่าจะเลี้ยวซ้ายหรือเลี้ยวขวา',
    },
  },
  {
    order: 3,
    gameId: 'papyrus_sequence',
    landmarkId: 'ancient_scribe_workshop',
    guideNpcId: 'npc_mariam',
    title: {
      en: 'Game 3 · The Papyrus Sequence',
      th: 'เกมที่ 3 · ลำดับขั้นตอนม้วนกระดาษปาปิรุส',
    },
    mechanicLabel: {
      en: 'Sequence Reconstruction Puzzle',
      th: 'เรียงลำดับขั้นตอนให้ถูกต้อง',
    },
    instructionFocus: {
      en: 'Time connectors: First, Next, Then, Finally (A2) · Before, After that, Once, When (B1)',
      th: 'คำเชื่อมลำดับขั้นตอน: First, Next, Then, Finally (A2) · Before, After that, Once, When (B1)',
    },
    introLine: {
      en: 'Help Mariam arrange shuffled workshop instructions into the correct logical order on the scribe table.',
      th: 'ช่วยมาเรียมเรียงบัตรคำสั่งที่สลับอยู่บนโต๊ะอาลักษณ์ให้กลายเป็นลำดับขั้นตอนที่สมเหตุสมผล',
    },
    takeawaySummary: {
      en: 'Takeaway · Time markers ("Before", "Once", "Finally") reveal which action must finish before the next begins.',
      th: 'สรุปทักษะ · คำเชื่อมเวลา ("Before", "Once", "Finally") ช่วยบอกว่าขั้นตอนใดต้องเสร็จก่อนขั้นถัดไป',
    },
  },
  {
    order: 4,
    gameId: 'temple_guardian_rules',
    landmarkId: 'temple_of_the_sun',
    guideNpcId: 'npc_karim',
    title: {
      en: 'Game 4 · Temple Guardian Rules',
      th: 'เกมที่ 4 · กฎผู้พิทักษ์วิหารแห่งดวงอาทิตย์',
    },
    mechanicLabel: {
      en: 'Visitor Guidance & Rule Matching',
      th: 'จับคู่ป้ายกฎ แยกคำแนะนำ Do/Don’t และเติมเงื่อนไข',
    },
    instructionFocus: {
      en: 'Polite rules & cautions: Do / Don’t / Please / Must / Mustn’t / Should / If-clauses',
      th: 'กติกาและการเตือนอย่างสุภาพ: Do / Don’t / Please / Must / Mustn’t / Should / ประโยคเงื่อนไข If',
    },
    introLine: {
      en: 'Join Karim Mansour at the Sun Temple to sort Do/Don’t behaviors, match safety signs, and complete polite visitor rules.',
      th: 'ร่วมกับคาริม มันซูร์ แยกพฤติกรรมที่ควรทำและห้ามทำ จับคู่ป้ายเตือน และเติมประโยคคำแนะนำนักท่องเที่ยวอย่างสุภาพ',
    },
    takeawaySummary: {
      en: 'Takeaway · Heritage instructions pair clear action rules with polite reasons ("Please... so the stone stays safe").',
      th: 'สรุปทักษะ · คำแนะนำที่ดีมักระบุสิ่งที่ควรทำอย่างสุภาพพร้อมเหตุผลเพื่อช่วยอนุรักษ์สถานที่',
    },
  },
  {
    order: 5,
    gameId: 'pharaoh_instruction_code',
    landmarkId: 'chamber_of_wisdom',
    guideNpcId: 'npc_layla',
    viaLandmarkTipOnly: true,
    title: {
      en: "Game 5 · The Pharaoh's Instruction Code",
      th: 'เกมที่ 5 · รหัสคำสั่งแห่งฟาโรห์',
    },
    mechanicLabel: {
      en: 'Fictional Symbolic Tablet Challenge',
      th: 'ถอดรหัสศิลาสัญลักษณ์จำลองตามคำสั่ง',
    },
    instructionFocus: {
      en: 'Integrated sequences, negative filters & conditional symbol rules',
      th: 'บูรณาการลำดับขั้นตอน ข้อห้าม และเงื่อนไขบนศิลาสัญลักษณ์จำลอง',
    },
    introLine: {
      en: 'Decode Dr. Layla’s fictional educational symbol tablet at the sealed Chamber gate (the monumental door remains sealed until later stages).',
      th: 'ทำตามคำสั่งเพื่อกดสัญลักษณ์เกมจำลองหน้าโถงแห่งปัญญา (ประตูโถงยังคงปิดผนึกจนกว่าจะผ่านภารกิจเฟสถัดไป)',
    },
    takeawaySummary: {
      en: 'Takeaway · You combined packing checks, directions, sequencing, and conditional rules into master-level English comprehension!',
      th: 'สรุปทักษะ · คุณบูรณาการทั้งการคัดเลือก ทิศทาง ลำดับขั้นตอน และเงื่อนไขเพื่อเข้าใจคำสั่งซับซ้อนได้สำเร็จ!',
    },
  },
];

export function getEgyptDiscoverMissionMeta(
  landmarkId: EgyptLandmarkId,
): EgyptDiscoverMissionMeta {
  return (
    EGYPT_DISCOVER_MISSIONS.find((m) => m.landmarkId === landmarkId) ??
    EGYPT_DISCOVER_MISSIONS[0]
  );
}

export interface DiscoverHintLadder {
  tier1Vocab: LocalizedText;
  tier2Clue: LocalizedText;
  tier3Scaffold: LocalizedText;
}

// ---------------------------------------------------------------------------
// MINI-GAME 1 — EXPEDITION ESSENTIALS (nile_expedition_camp)
// ---------------------------------------------------------------------------

export type ExpeditionItemId =
  | 'backpack'
  | 'map'
  | 'compass'
  | 'notebook'
  | 'water_bottle'
  | 'camera'
  | 'sun_hat'
  | 'magnifying_glass'
  | 'pencil'
  | 'flashlight';

export interface ExpeditionItemMeta {
  id: ExpeditionItemId;
  label: LocalizedText;
  shortDesc: LocalizedText;
  accentColor: string;
}

export const EXPEDITION_ITEMS: Record<ExpeditionItemId, ExpeditionItemMeta> = {
  backpack: {
    id: 'backpack',
    label: { en: 'Field Backpack', th: 'เป้สะพายสำรวจ' },
    shortDesc: { en: 'Carries light tools', th: 'ใส่เครื่องมือน้ำหนักเบา' },
    accentColor: '#B45309',
  },
  map: {
    id: 'map',
    label: { en: 'Site Map', th: 'แผนที่จุดสำรวจ' },
    shortDesc: { en: 'Shows Nile & Giza zones', th: 'แสดงเส้นทางไนล์และกีซา' },
    accentColor: '#0284C7',
  },
  compass: {
    id: 'compass',
    label: { en: 'Compass', th: 'เข็มทิศ' },
    shortDesc: { en: 'Checks north & turns', th: 'เช็กทิศเหนือและทางเลี้ยว' },
    accentColor: '#0F766E',
  },
  notebook: {
    id: 'notebook',
    label: { en: 'Field Notebook', th: 'สมุดบันทึกสนาม' },
    shortDesc: { en: 'Records observations', th: 'จดบันทึกสิ่งที่สังเกตเห็น' },
    accentColor: '#1D4ED8',
  },
  water_bottle: {
    id: 'water_bottle',
    label: { en: 'Water Bottle', th: 'ขวดน้ำดื่ม' },
    shortDesc: { en: 'Essential desert hydration', th: 'ป้องกันการขาดน้ำกลางแดด' },
    accentColor: '#0EA5E9',
  },
  camera: {
    id: 'camera',
    label: { en: 'Field Camera', th: 'กล้องถ่ายภาพ' },
    shortDesc: { en: 'Documents permitted zones', th: 'ถ่ายภาพในเขตที่อนุญาต' },
    accentColor: '#475569',
  },
  sun_hat: {
    id: 'sun_hat',
    label: { en: 'Sun Hat', th: 'หมวกกันแดด' },
    shortDesc: { en: 'Shade for sunny walks', th: 'บังแดดระหว่างเดินสำรวจ' },
    accentColor: '#D97706',
  },
  magnifying_glass: {
    id: 'magnifying_glass',
    label: { en: 'Magnifying Glass', th: 'แว่นขยาย' },
    shortDesc: { en: 'Inspects fine marks', th: 'ส่องดูรายละเอียดชิ้นงาน' },
    accentColor: '#7C3AED',
  },
  pencil: {
    id: 'pencil',
    label: { en: 'Sketch Pencil', th: 'ดินสอร่างภาพ' },
    shortDesc: { en: 'Draws quick diagrams', th: 'ใช้วาดผังและจดโน้ต' },
    accentColor: '#EA580C',
  },
  flashlight: {
    id: 'flashlight',
    label: { en: 'Heavy Flashlight', th: 'ไฟฉายขนาดใหญ่' },
    shortDesc: { en: 'Used for shaded dusk work', th: 'ใช้ในมุมมืดช่วงพลบค่ำ' },
    accentColor: '#CA8A04',
  },
};

export interface ExpeditionChallengeVariant {
  instruction: LocalizedText;
  spokenEnglish: string;
  availableItemIds: ExpeditionItemId[];
  requiredIds: ExpeditionItemId[];
  forbiddenIds: ExpeditionItemId[];
  requiresOrder: boolean;
  hints: DiscoverHintLadder;
  successNote: LocalizedText;
}

export interface ExpeditionEssentialsChallenge {
  id: string;
  title: LocalizedText;
  a2: ExpeditionChallengeVariant;
  b1: ExpeditionChallengeVariant;
}

export const EXPEDITION_ESSENTIALS_CHALLENGES: ExpeditionEssentialsChallenge[] = [
  {
    id: 'ee_1_single_map',
    title: { en: 'Challenge 1 · First Tool Ready', th: 'ด่านย่อย 1 · หยิบอุปกรณ์ชิ้นแรก' },
    a2: {
      instruction: {
        en: 'Put ONLY the Site Map into the Expedition Pack.',
        th: 'นำเฉพาะ "Site Map" (แผนที่จุดสำรวจ) ใส่ลงในกระเป๋าสำรวจ',
      },
      spokenEnglish: 'Put only the site map into the expedition pack.',
      availableItemIds: ['map', 'flashlight', 'camera', 'water_bottle'],
      requiredIds: ['map'],
      forbiddenIds: ['flashlight', 'camera', 'water_bottle'],
      requiresOrder: false,
      hints: {
        tier1Vocab: {
          en: 'Key word: "ONLY the Site Map" — bring 1 item.',
          th: 'คำสำคัญ: "ONLY the Site Map" แปลว่าใส่เพียง 1 ชิ้นนี้เท่านั้น',
        },
        tier2Clue: {
          en: 'Look for the folded paper chart labeled Site Map.',
          th: 'มองหาแผนที่กระดาษที่มีชื่อว่า Site Map',
        },
        tier3Scaffold: {
          en: 'Select Site Map and make sure no extra items are inside the pack.',
          th: 'เลือก Site Map เพียงชิ้นเดียวแล้วกดตรวจสอบ',
        },
      },
      successNote: {
        en: 'Exact match! Packing only the requested item prevents clutter.',
        th: 'ถูกต้องเป๊ะ! การหยิบเฉพาะชิ้นที่สั่งช่วยให้ไม่พกของเกินจำเป็น',
      },
    },
    b1: {
      instruction: {
        en: 'Before heading to the river dock, pack the Site Map and the Compass, while leaving the Flashlight on the table.',
        th: 'ก่อนเดินไปท่าน้ำ ให้เก็บ Site Map และ Compass ลงกระเป๋า โดยทิ้ง Flashlight ไว้บนโต๊ะ',
      },
      spokenEnglish:
        'Before heading to the river dock, pack the site map and the compass, while leaving the flashlight on the table.',
      availableItemIds: ['map', 'compass', 'flashlight', 'pencil', 'camera'],
      requiredIds: ['map', 'compass'],
      forbiddenIds: ['flashlight'],
      requiresOrder: false,
      hints: {
        tier1Vocab: {
          en: 'Key phrase: "leaving ... on the table" means do NOT pack it.',
          th: 'วลีสำคัญ: "leaving ... on the table" หมายถึงไม่ต้องหยิบใส่กระเป๋า',
        },
        tier2Clue: {
          en: 'You need two navigation items: Site Map + Compass.',
          th: 'คุณต้องใช้เครื่องมือนำทาง 2 ชิ้น: Site Map + Compass',
        },
        tier3Scaffold: {
          en: 'Add Site Map and Compass (2 items total), and keep Flashlight unselected.',
          th: 'เลือก Site Map และ Compass รวม 2 ชิ้น และไม่ต้องใส่ Flashlight',
        },
      },
      successNote: {
        en: 'Well done! You matched both positive items and respected the exclusion clause.',
        th: 'ยอดเยี่ยม! คุณเลือกครบทั้งสองชิ้นและทำตามเงื่อนไขที่ให้ทิ้งไว้ได้ถูกต้อง',
      },
    },
  },
  {
    id: 'ee_2_sun_safety',
    title: { en: 'Challenge 2 · Midday Sun Gear', th: 'ด่านย่อย 2 · เตรียมรับแดดกลางวัน' },
    a2: {
      instruction: {
        en: 'Take a Sun Hat and a Water Bottle for the sunny walk.',
        th: 'หยิบ Sun Hat (หมวกกันแดด) และ Water Bottle (ขวดน้ำดื่ม) สำหรับเดินกลางแดด',
      },
      spokenEnglish: 'Take a sun hat and a water bottle for the sunny walk.',
      availableItemIds: ['sun_hat', 'water_bottle', 'flashlight', 'pencil', 'notebook'],
      requiredIds: ['sun_hat', 'water_bottle'],
      forbiddenIds: [],
      requiresOrder: false,
      hints: {
        tier1Vocab: {
          en: 'Key words: "Sun Hat" + "Water Bottle".',
          th: 'คำสำคัญ: "Sun Hat" (หมวก) และ "Water Bottle" (ขวดน้ำ)',
        },
        tier2Clue: {
          en: 'Pick two desert sun-safety items.',
          th: 'เลือกอุปกรณ์ป้องกันแดดและขาดน้ำ 2 ชิ้น',
        },
        tier3Scaffold: {
          en: 'Place both Sun Hat and Water Bottle in your pack (any order).',
          th: 'ใส่ Sun Hat และ Water Bottle ลงกระเป๋าทั้งคู่ (สลับลำดับได้)',
        },
      },
      successNote: {
        en: 'Great desert awareness! Hydration and shade always come first.',
        th: 'ยอดเยี่ยม! การเตรียมหมวกและน้ำดื่มสำคัญมากสำหรับแดดทะเลทราย',
      },
    },
    b1: {
      instruction: {
        en: 'Unless the weather is cool and cloudy, make sure you pack both a Sun Hat and a Water Bottle—avoid carrying the heavy Flashlight at noon.',
        th: 'หากอากาศไม่ได้ครึ้มและเย็น ให้นำ Sun Hat และ Water Bottle ไปด้วยเสมอ และหลีกเลี่ยงการพก Flashlight หนักๆ ตอนเที่ยง',
      },
      spokenEnglish:
        'Unless the weather is cool and cloudy, make sure you pack both a sun hat and a water bottle; avoid carrying the heavy flashlight at noon.',
      availableItemIds: ['sun_hat', 'water_bottle', 'flashlight', 'compass', 'camera'],
      requiredIds: ['sun_hat', 'water_bottle'],
      forbiddenIds: ['flashlight'],
      requiresOrder: false,
      hints: {
        tier1Vocab: {
          en: 'Key markers: "make sure you pack" and "avoid carrying".',
          th: 'คำสำคัญ: "make sure you pack" (ต้องเตรียม) และ "avoid carrying" (หลีกเลี่ยง)',
        },
        tier2Clue: {
          en: 'The sun is bright right now, so bring the two heat-protection essentials.',
          th: 'ตอนนี้แดดแรง จึงต้องเลือกอุปกรณ์กันแดดและน้ำดื่ม 2 ชิ้น',
        },
        tier3Scaffold: {
          en: 'Select Sun Hat and Water Bottle; do not include Heavy Flashlight.',
          th: 'เลือก Sun Hat และ Water Bottle แล้วเว้น Heavy Flashlight ไว้',
        },
      },
      successNote: {
        en: 'Clean comprehension! "Unless" and "avoid" guide safe midday decisions.',
        th: 'เข้าใจเงื่อนไขได้ดีมาก! คำว่า "Unless" และ "avoid" ช่วยตัดสินใจได้อย่างปลอดภัย',
      },
    },
  },
  {
    id: 'ee_3_negative_rule',
    title: { en: 'Challenge 3 · Negative Rule Check', th: 'ด่านย่อย 3 · อ่านข้อห้ามให้แม่นยำ' },
    a2: {
      instruction: {
        en: 'Pack your Field Notebook and Sketch Pencil, but do NOT pack the Heavy Flashlight.',
        th: 'เก็บ Field Notebook และ Sketch Pencil ลงกระเป๋า แต่ห้ามใส่ Heavy Flashlight',
      },
      spokenEnglish:
        'Pack your field notebook and sketch pencil, but do not pack the heavy flashlight.',
      availableItemIds: ['notebook', 'pencil', 'flashlight', 'sun_hat', 'magnifying_glass'],
      requiredIds: ['notebook', 'pencil'],
      forbiddenIds: ['flashlight'],
      requiresOrder: false,
      hints: {
        tier1Vocab: {
          en: 'Key phrase: "do NOT pack" = leave that item out.',
          th: 'คำสำคัญ: "do NOT pack" แปลว่า ห้ามหยิบชิ้นนั้นใส่กระเป๋า',
        },
        tier2Clue: {
          en: 'Pick the two writing tools for sketching notes.',
          th: 'เลือกเครื่องเขียน 2 ชิ้นสำหรับจดบันทึกและวาดภาพ',
        },
        tier3Scaffold: {
          en: 'Put Field Notebook and Sketch Pencil in the pack, and remove any other item.',
          th: 'เลือก Field Notebook และ Sketch Pencil เท่านั้น',
        },
      },
      successNote: {
        en: 'Spot on! Spotting "do NOT" prevents carrying prohibited gear.',
        th: 'ถูกต้อง! การจับคำว่า "do NOT" ทำให้ไม่หยิบของต้องห้ามติดตัว',
      },
    },
    b1: {
      instruction: {
        en: 'Gather the Field Notebook and Magnifying Glass for workshop notes, yet leave the Camera and Heavy Flashlight out of the bag.',
        th: 'เตรียม Field Notebook และ Magnifying Glass สำหรับจดงาน แต่อย่านำ Camera และ Heavy Flashlight ใส่กระเป๋า',
      },
      spokenEnglish:
        'Gather the field notebook and magnifying glass for workshop notes, yet leave the camera and heavy flashlight out of the bag.',
      availableItemIds: ['notebook', 'magnifying_glass', 'camera', 'flashlight', 'map'],
      requiredIds: ['notebook', 'magnifying_glass'],
      forbiddenIds: ['camera', 'flashlight'],
      requiresOrder: false,
      hints: {
        tier1Vocab: {
          en: 'Key connector: "yet leave ... out of the bag" excludes two tools.',
          th: 'คำเชื่อม: "yet leave ... out of the bag" หมายถึงให้เอา 2 ชิ้นนี้ออกไว้ข้างนอก',
        },
        tier2Clue: {
          en: 'You only need the notebook and inspection lens.',
          th: 'เลือกเพียงสมุดบันทึกและแว่นขยายสำหรับตรวจดูรายละเอียด',
        },
        tier3Scaffold: {
          en: 'Pack Field Notebook and Magnifying Glass only.',
          th: 'ใส่ Field Notebook และ Magnifying Glass ลงกระเป๋าเท่านั้น',
        },
      },
      successNote: {
        en: 'Sharp reading! You followed both the inclusion and dual exclusion rules.',
        th: 'อ่านละเอียดมาก! คุณทำตามทั้งสิ่งที่ต้องหยิบและสองสิ่งที่ต้องเว้นไว้ได้อย่างแม่นยำ',
      },
    },
  },
  {
    id: 'ee_4_ordered_packing',
    title: { en: 'Challenge 4 · Pack in Exact Order', th: 'ด่านย่อย 4 · จัดเรียงลำดับในกระเป๋า' },
    a2: {
      instruction: {
        en: 'Follow the order: First pack the Site Map, next add the Compass, and finally put in the Field Notebook.',
        th: 'ทำตามลำดับ: First (ก่อน) ใส่ Site Map, next (ถัดมา) ใส่ Compass, และ finally (สุดท้าย) ใส่ Field Notebook',
      },
      spokenEnglish:
        'Follow the order: First pack the site map, next add the compass, and finally put in the field notebook.',
      availableItemIds: ['compass', 'notebook', 'map', 'water_bottle', 'camera'],
      requiredIds: ['map', 'compass', 'notebook'],
      forbiddenIds: [],
      requiresOrder: true,
      hints: {
        tier1Vocab: {
          en: 'Order sequence: First -> Next -> Finally (order matters!).',
          th: 'คำบอกลำดับ: First -> Next -> Finally (ลำดับที่ใส่ในกระเป๋ามีผล!)',
        },
        tier2Clue: {
          en: 'Slot 1 is Site Map, Slot 2 is Compass, Slot 3 is Field Notebook.',
          th: 'ชิ้นที่ 1 คือ Site Map, ชิ้นที่ 2 คือ Compass, ชิ้นที่ 3 คือ Field Notebook',
        },
        tier3Scaffold: {
          en: 'If the order inside your pack is wrong, tap items in the tray to remove them and place Map -> Compass -> Notebook.',
          th: 'หากลำดับยังไม่ถูก แตะที่ของในกระเป๋าเพื่อเอาออก แล้วใส่ใหม่เป็น Map -> Compass -> Notebook',
        },
      },
      successNote: {
        en: 'Perfect sequence! Map -> Compass -> Notebook makes tools easy to reach.',
        th: 'ลำดับเป๊ะ! Map -> Compass -> Notebook ช่วยให้หยิบใช้งานสะดวกตามขั้น',
      },
    },
    b1: {
      instruction: {
        en: 'Layer the fragile tools carefully: place the Field Notebook first so the flat cover protects the bag, put the Magnifying Glass in after that, and only pack the Sketch Pencil once those two are inside.',
        th: 'จัดเรียงอย่างระมัดระวัง: วาง Field Notebook ก่อนเพื่อรองพื้น ตามด้วย Magnifying Glass และใส่ Sketch Pencil เป็นชิ้นสุดท้ายเมื่อสองชิ้นแรกอยู่ข้างในแล้ว',
      },
      spokenEnglish:
        'Layer the fragile tools carefully: place the field notebook first, put the magnifying glass in after that, and only pack the sketch pencil once those two are inside.',
      availableItemIds: ['pencil', 'magnifying_glass', 'notebook', 'flashlight', 'sun_hat'],
      requiredIds: ['notebook', 'magnifying_glass', 'pencil'],
      forbiddenIds: [],
      requiresOrder: true,
      hints: {
        tier1Vocab: {
          en: 'Connectors: "first", "after that", and "once those two are inside".',
          th: 'คำเชื่อมลำดับ: "first" (ก่อน), "after that" (ถัดมา), "once those two are inside" (หลังสองชิ้นแรกเข้าไปแล้ว)',
        },
        tier2Clue: {
          en: 'Expected order: 1. Notebook, 2. Magnifying Glass, 3. Sketch Pencil.',
          th: 'ลำดับที่ต้องการ: 1. Notebook, 2. Magnifying Glass, 3. Sketch Pencil',
        },
        tier3Scaffold: {
          en: 'Clear the pack if needed, then add Notebook -> Magnifying Glass -> Sketch Pencil.',
          th: 'จัดใหม่ให้ได้ลำดับ Notebook -> Magnifying Glass -> Sketch Pencil',
        },
      },
      successNote: {
        en: 'Accurate B1 sequencing! You decoded "after that" and "once" cleanly.',
        th: 'เรียงลำดับระดับ B1 ได้แม่นยำ! ตีความคำว่า "after that" และ "once" ได้ถูกต้อง',
      },
    },
  },
  {
    id: 'ee_5_contrast_gear',
    title: { en: 'Challenge 5 · Careful Contrast Check', th: 'ด่านย่อย 5 · แยกของใช้ตามเงื่อนไข' },
    a2: {
      instruction: {
        en: 'Bring the Magnifying Glass and the Field Camera, and leave the Backpack and Sun Hat in the tent.',
        th: 'นำ Magnifying Glass และ Field Camera ติดตัวไป ส่วน Backpack และ Sun Hat ให้วางทิ้งไว้ในเต็นท์',
      },
      spokenEnglish:
        'Bring the magnifying glass and the field camera, and leave the backpack and sun hat in the tent.',
      availableItemIds: ['magnifying_glass', 'camera', 'backpack', 'sun_hat', 'pencil'],
      requiredIds: ['magnifying_glass', 'camera'],
      forbiddenIds: ['backpack', 'sun_hat'],
      requiresOrder: false,
      hints: {
        tier1Vocab: {
          en: '"Bring A and B, and leave C and D" means pack ONLY A and B.',
          th: '"Bring A and B, and leave C and D" แปลว่าให้นำไปเฉพาะ A และ B',
        },
        tier2Clue: {
          en: 'Select Magnifying Glass and Field Camera.',
          th: 'เลือก Magnifying Glass และ Field Camera',
        },
        tier3Scaffold: {
          en: 'Keep Backpack, Sun Hat, and Sketch Pencil out of the pack.',
          th: 'นำเฉพาะ Magnifying Glass และ Field Camera ใส่กระเป๋า',
        },
      },
      successNote: {
        en: 'Great attention to detail! Everything unnecessary stayed safely in camp.',
        th: 'สังเกตละเอียดดีมาก! ของที่ไม่ต้องใช้ถูกเก็บไว้ที่ค่ายอย่างเรียบร้อย',
      },
    },
    b1: {
      instruction: {
        en: 'In case the curator asks for visual proof, pack the Field Camera and Site Map; however, make sure neither the Heavy Flashlight nor the Water Bottle sits next to the paper map.',
        th: 'เผื่อเจ้าหน้าที่ขอดูหลักฐาน ให้นำ Field Camera และ Site Map ไปด้วย อย่างไรก็ตาม ห้ามวาง Heavy Flashlight หรือ Water Bottle ไว้ใกล้แผนที่กระดาษ',
      },
      spokenEnglish:
        'In case the curator asks for visual proof, pack the field camera and site map; however, make sure neither the heavy flashlight nor the water bottle sits next to the paper map.',
      availableItemIds: ['camera', 'map', 'water_bottle', 'flashlight', 'compass'],
      requiredIds: ['camera', 'map'],
      forbiddenIds: ['water_bottle', 'flashlight'],
      requiresOrder: false,
      hints: {
        tier1Vocab: {
          en: 'Key pattern: "neither X nor Y" means do NOT pack X or Y.',
          th: 'โครงสร้างสำคัญ: "neither X nor Y" แปลว่า ห้ามนำทั้ง X และ Y ใส่กระเป๋า',
        },
        tier2Clue: {
          en: 'Pack only the documentation item (Camera) and chart (Site Map).',
          th: 'นำเพียงกล้องถ่ายภาพและแผนที่กระดาษไปเท่านั้น',
        },
        tier3Scaffold: {
          en: 'Select Field Camera and Site Map; leave Water Bottle, Flashlight, and Compass out.',
          th: 'เลือกเฉพาะ Field Camera และ Site Map',
        },
      },
      successNote: {
        en: 'Excellent B1 reading! Keeping water away from paper maps is smart fieldwork.',
        th: 'อ่านระดับ B1 ได้ยอดเยี่ยม! การไม่ใส่น้ำใกล้แผนที่เป็นหลักปฏิบัติงานภาคสนามที่ดีมาก',
      },
    },
  },
  {
    id: 'ee_6_full_departure',
    title: { en: 'Challenge 6 · Full Expedition Briefing', th: 'ด่านย่อย 6 · ภารกิจจัดเตรียมออกเดินทาง' },
    a2: {
      instruction: {
        en: 'Final check in order: First pack the Sun Hat, next add the Site Map, then pack the Compass, and finally add the Water Bottle.',
        th: 'ตรวจเช็กขั้นสุดท้ายตามลำดับ: First ใส่ Sun Hat, next ใส่ Site Map, then ใส่ Compass, และ finally ใส่ Water Bottle',
      },
      spokenEnglish:
        'Final check in order: First pack the sun hat, next add the site map, then pack the compass, and finally add the water bottle.',
      availableItemIds: ['compass', 'sun_hat', 'water_bottle', 'map', 'flashlight', 'camera'],
      requiredIds: ['sun_hat', 'map', 'compass', 'water_bottle'],
      forbiddenIds: ['flashlight', 'camera'],
      requiresOrder: true,
      hints: {
        tier1Vocab: {
          en: 'Four ordered slots: First -> Next -> Then -> Finally.',
          th: '4 ขั้นตอนตามลำดับ: First -> Next -> Then -> Finally',
        },
        tier2Clue: {
          en: 'Order: 1. Sun Hat, 2. Site Map, 3. Compass, 4. Water Bottle.',
          th: 'ลำดับ: 1. Sun Hat, 2. Site Map, 3. Compass, 4. Water Bottle',
        },
        tier3Scaffold: {
          en: 'Make sure Flashlight and Camera stay outside, and match the 4-item sequence.',
          th: 'เว้น Flashlight และ Camera ไว้ข้างนอก แล้วใส่ 4 ชิ้นตามลำดับ',
        },
      },
      successNote: {
        en: 'Nile Camp ready! You mastered ordered packing instructions and negative rules.',
        th: 'ทีมค่ายริมไนล์พร้อมออกเดินทาง! คุณเข้าใจคำสั่งจัดลำดับและข้อห้ามครบถ้วนแล้ว',
      },
    },
    b1: {
      instruction: {
        en: 'Complete Dr. Layla’s departure sequence: Before loading the Compass, put the Site Map inside first; after placing the Compass, add the Field Notebook and then finish with the Sun Hat—never include the Heavy Flashlight.',
        th: 'จัดกระเป๋าก่อนออกเดินทางตามลำดับ: ก่อนใส่ Compass ต้องใส่ Site Map ก่อน; หลังใส่ Compass ให้ตามด้วย Field Notebook แล้วปิดท้ายด้วย Sun Hat และห้ามใส่ Heavy Flashlight เด็ดขาด',
      },
      spokenEnglish:
        'Complete Doctor Layla departure sequence: Before loading the compass, put the site map inside first; after placing the compass, add the field notebook and then finish with the sun hat—never include the heavy flashlight.',
      availableItemIds: ['notebook', 'map', 'sun_hat', 'compass', 'flashlight', 'camera'],
      requiredIds: ['map', 'compass', 'notebook', 'sun_hat'],
      forbiddenIds: ['flashlight'],
      requiresOrder: true,
      hints: {
        tier1Vocab: {
          en: '"Before loading X, put Y inside first" means Y comes BEFORE X!',
          th: '"Before loading X, put Y inside first" แปลว่าต้องใส่ Y ก่อน X!',
        },
        tier2Clue: {
          en: 'Sequence: Site Map -> Compass -> Field Notebook -> Sun Hat.',
          th: 'ลำดับที่ถูกต้อง: Site Map -> Compass -> Field Notebook -> Sun Hat',
        },
        tier3Scaffold: {
          en: 'Check that all 4 items are in exact order and Heavy Flashlight is excluded.',
          th: 'ตรวจดูว่าเรียงครบ 4 ชิ้นตามลำดับและไม่มี Heavy Flashlight',
        },
      },
      successNote: {
        en: 'Masterwork! Handling "Before X, put Y first" proves high-accuracy B1 instruction reading.',
        th: 'สมบูรณ์แบบ! คุณถอดรหัสประโยคซับซ้อนอย่าง "Before X, put Y first" ได้แม่นยำมาก',
      },
    },
  },
];

export function validateExpeditionEssentialsSelection(
  variant: ExpeditionChallengeVariant,
  selectedIds: ExpeditionItemId[],
): { isCorrect: boolean; reason: LocalizedText } {
  const uniqueSelected = Array.from(new Set(selectedIds));
  const forbiddenChosen = uniqueSelected.filter((id) => variant.forbiddenIds.includes(id));

  if (forbiddenChosen.length > 0) {
    const firstForbidden = EXPEDITION_ITEMS[forbiddenChosen[0]].label;
    return {
      isCorrect: false,
      reason: {
        en: `Check the negative rule! "${firstForbidden.en}" should stay out of the Expedition Pack. Tap it in the pack to remove it.`,
        th: `เช็กคำสั่งห้ามอีกครั้ง! "${firstForbidden.th}" ไม่ควรใส่ลงในกระเป๋า ให้แตะเพื่อนำออก`,
      },
    };
  }

  const missing = variant.requiredIds.filter((id) => !uniqueSelected.includes(id));
  const extras = uniqueSelected.filter((id) => !variant.requiredIds.includes(id));

  if (missing.length > 0 || extras.length > 0) {
    return {
      isCorrect: false,
      reason: {
        en: `Expected ${variant.requiredIds.length} exact item(s): check what is missing or remove extra gear you were not asked to pack.`,
        th: `ต้องมีอุปกรณ์ให้ตรงทั้ง ${variant.requiredIds.length} ชิ้น ตรวจดูว่าขาดชิ้นไหนหรือมีชิ้นที่ไม่ตรงคำสั่งอยู่หรือไม่`,
      },
    };
  }

  if (variant.requiresOrder) {
    const orderMatches =
      selectedIds.length === variant.requiredIds.length &&
      variant.requiredIds.every((id, index) => selectedIds[index] === id);
    if (!orderMatches) {
      return {
        isCorrect: false,
        reason: {
          en: 'You chose the right items, but the packing order matters here! Check "First / Next / Before / Finally" and adjust the order.',
          th: 'คุณเลือกของครบถูกต้องแล้ว แต่ลำดับการใส่สำคัญในข้อนี้! ดูคำเชื่อมลำดับแล้วเรียงใหม่นะ',
        },
      };
    }
  }

  return {
    isCorrect: true,
    reason: variant.successNote,
  };
}

// ---------------------------------------------------------------------------
// MINI-GAME 2 — PYRAMID PATH PUZZLE (giza_pyramid_plaza)
// ---------------------------------------------------------------------------

export type GridHeading = 'N' | 'E' | 'S' | 'W';
export type RouteCommand = 'FORWARD' | 'LEFT' | 'RIGHT';

export interface GizaBoardCoord {
  col: number; // 0..4 (West -> East)
  row: number; // 0..3 (North -> South)
}

export type GizaBoardLandmarkId =
  | 'pyramid'
  | 'viewing_platform'
  | 'oasis'
  | 'sphinx'
  | 'camp_gate'
  | 'info_point'
  | 'flag_post'
  | 'rope_zone';

export interface GizaBoardLandmark {
  id: GizaBoardLandmarkId;
  coord: GizaBoardCoord;
  label: LocalizedText;
  isHazard?: boolean;
}

export const GIZA_BOARD_COLS = 5;
export const GIZA_BOARD_ROWS = 4;

export const GIZA_BOARD_LANDMARKS: GizaBoardLandmark[] = [
  {
    id: 'pyramid',
    coord: { col: 1, row: 0 },
    label: { en: 'Great Pyramid', th: 'มหาพีระมิด' },
  },
  {
    id: 'viewing_platform',
    coord: { col: 4, row: 0 },
    label: { en: 'Viewing Platform', th: 'แท่นชมวิว' },
  },
  {
    id: 'oasis',
    coord: { col: 1, row: 2 },
    label: { en: 'Desert Oasis', th: 'โอเอซิส' },
  },
  {
    id: 'sphinx',
    coord: { col: 3, row: 2 },
    label: { en: 'Great Sphinx', th: 'สฟิงซ์' },
  },
  {
    id: 'camp_gate',
    coord: { col: 0, row: 3 },
    label: { en: 'Camp Gate', th: 'ประตูค่าย' },
  },
  {
    id: 'info_point',
    coord: { col: 2, row: 3 },
    label: { en: 'Info Point', th: 'จุดข้อมูล' },
  },
  {
    id: 'flag_post',
    coord: { col: 4, row: 3 },
    label: { en: 'Expedition Flag', th: 'ธงคณะสำรวจ' },
  },
  {
    id: 'rope_zone',
    coord: { col: 2, row: 1 },
    label: { en: 'Marked Rope Zone', th: 'เขตกั้นเชือก' },
    isHazard: true,
  },
];

export interface RouteSimulationResult {
  finalCoord: GizaBoardCoord;
  finalHeading: GridHeading;
  visitedCoords: GizaBoardCoord[];
  hitBoundary: boolean;
  hitHazard: boolean;
}

export function rotateHeading(heading: GridHeading, turn: 'LEFT' | 'RIGHT'): GridHeading {
  const order: GridHeading[] = ['N', 'E', 'S', 'W'];
  const idx = order.indexOf(heading);
  return order[(idx + (turn === 'RIGHT' ? 1 : 3)) % 4];
}

export function stepForwardCoord(coord: GizaBoardCoord, heading: GridHeading): GizaBoardCoord {
  switch (heading) {
    case 'N':
      return { col: coord.col, row: coord.row - 1 };
    case 'E':
      return { col: coord.col + 1, row: coord.row };
    case 'S':
      return { col: coord.col, row: coord.row + 1 };
    case 'W':
      return { col: coord.col - 1, row: coord.row };
  }
}

export function simulatePyramidRoute(
  startCoord: GizaBoardCoord,
  startHeading: GridHeading,
  commands: RouteCommand[],
): RouteSimulationResult {
  let curr: GizaBoardCoord = { ...startCoord };
  let heading: GridHeading = startHeading;
  const visitedCoords: GizaBoardCoord[] = [{ ...curr }];
  let hitBoundary = false;
  let hitHazard = false;

  for (const cmd of commands) {
    if (cmd === 'LEFT' || cmd === 'RIGHT') {
      heading = rotateHeading(heading, cmd);
      continue;
    }
    const next = stepForwardCoord(curr, heading);
    if (
      next.col < 0 ||
      next.col >= GIZA_BOARD_COLS ||
      next.row < 0 ||
      next.row >= GIZA_BOARD_ROWS
    ) {
      hitBoundary = true;
      break;
    }
    const hazard = GIZA_BOARD_LANDMARKS.find(
      (l) => l.isHazard && l.coord.col === next.col && l.coord.row === next.row,
    );
    if (hazard) {
      hitHazard = true;
      curr = next;
      visitedCoords.push({ ...curr });
      break;
    }
    curr = next;
    visitedCoords.push({ ...curr });
  }

  return {
    finalCoord: curr,
    finalHeading: heading,
    visitedCoords,
    hitBoundary,
    hitHazard,
  };
}

export interface PyramidPathVariant {
  instruction: LocalizedText;
  spokenEnglish: string;
  startCoord: GizaBoardCoord;
  startHeading: GridHeading;
  targetCoord: GizaBoardCoord;
  targetLandmarkId: GizaBoardLandmarkId;
  requiredWaypointCoord?: GizaBoardCoord;
  requiredWaypointLabel?: LocalizedText;
  maxCommands?: number;
  acceptedExactSequences?: RouteCommand[][];
  allowAnySafeRouteToGoal: boolean;
  hints: DiscoverHintLadder;
  successNote: LocalizedText;
}

export interface PyramidPathChallenge {
  id: string;
  title: LocalizedText;
  a2: PyramidPathVariant;
  b1: PyramidPathVariant;
}

export const PYRAMID_PATH_CHALLENGES: PyramidPathChallenge[] = [
  {
    id: 'pp_1_straight_turn',
    title: { en: 'Route 1 · Info Point to Oasis', th: 'เส้นทาง 1 · จากจุดข้อมูลไปโอเอซิส' },
    a2: {
      instruction: {
        en: 'Start at Info Point facing North. Go straight 1 step, turn left, then walk forward 1 step to reach the Desert Oasis.',
        th: 'เริ่มที่จุดข้อมูลโดยหันหน้าทางเหนือ (N) เดินตรง 1 ก้าว เลี้ยวซ้าย แล้วเดินตรง 1 ก้าวเพื่อไปยังโอเอซิส',
      },
      spokenEnglish:
        'Start at Info Point facing North. Go straight one step, turn left, then walk forward one step to the Desert Oasis.',
      startCoord: { col: 2, row: 3 },
      startHeading: 'N',
      targetCoord: { col: 1, row: 2 },
      targetLandmarkId: 'oasis',
      acceptedExactSequences: [['FORWARD', 'LEFT', 'FORWARD']],
      allowAnySafeRouteToGoal: true,
      hints: {
        tier1Vocab: {
          en: 'Direction words: "Go straight" = Move Forward · "turn left" = Turn Left.',
          th: 'คำบอกทาง: "Go straight" = เดินตรง · "turn left" = เลี้ยวซ้าย',
        },
        tier2Clue: {
          en: 'Facing North from (col 2, row 3): 1 step forward reaches (2, 2); turning left faces West toward Oasis (1, 2).',
          th: 'หันหน้าทางเหนือ: เดินตรง 1 ก้าว เลี้ยวซ้าย แล้วเดินตรงอีก 1 ก้าว',
        },
        tier3Scaffold: {
          en: 'Exact sequence: Forward -> Turn Left -> Forward (or tap tile (2,2) then Oasis).',
          th: 'ลำดับคำสั่ง: เดินตรง -> เลี้ยวซ้าย -> เดินตรง',
        },
      },
      successNote: {
        en: 'Arrived at the Desert Oasis! Clean first turn.',
        th: 'ถึงโอเอซิสแล้ว! เลี้ยวได้แม่นยำมาก',
      },
    },
    b1: {
      instruction: {
        en: 'Facing East at the Camp Gate, turn left to head North by 1 step before turning right toward the Desert Oasis.',
        th: 'ยืนหันหน้าทางตะวันออก (E) ที่ประตูค่าย ให้เลี้ยวซ้ายเพื่อเดินขึ้นเหนือ 1 ก้าว ก่อนจะเลี้ยวขวาเดินตรงไปที่โอเอซิส',
      },
      spokenEnglish:
        'Facing East at the Camp Gate, turn left to head North by one step before turning right toward the Desert Oasis.',
      startCoord: { col: 0, row: 3 },
      startHeading: 'E',
      targetCoord: { col: 1, row: 2 },
      targetLandmarkId: 'oasis',
      acceptedExactSequences: [['LEFT', 'FORWARD', 'RIGHT', 'FORWARD']],
      allowAnySafeRouteToGoal: true,
      hints: {
        tier1Vocab: {
          en: '"turn left to head North" changes facing from East -> North.',
          th: '"turn left to head North" เปลี่ยนทิศจากตะวันออก (E) เป็นเหนือ (N)',
        },
        tier2Clue: {
          en: 'Move up 1 step to row 2, then turn right (East) and walk 1 step to Oasis.',
          th: 'เดินขึ้นเหนือ 1 ก้าว แล้วเลี้ยวขวาเดินไปทางตะวันออก 1 ก้าวสู่โอเอซิส',
        },
        tier3Scaffold: {
          en: 'Try: Turn Left -> Forward -> Turn Right -> Forward.',
          th: 'ลองกด: เลี้ยวซ้าย -> เดินตรง -> เลี้ยวขวา -> เดินตรง',
        },
      },
      successNote: {
        en: 'Smooth relative turning! Notice how your starting heading East shaped the left turn.',
        th: 'คุมทิศได้ดีมาก! การเช็กว่าตัวละครหันทางตะวันออกอยู่ก่อนเลี้ยวช่วยให้ไม่หลง',
      },
    },
  },
  {
    id: 'pp_2_avoid_rope',
    title: { en: 'Route 2 · Around the Rope Zone', th: 'เส้นทาง 2 · อ้อมเขตกั้นเชือกอย่างปลอดภัย' },
    a2: {
      instruction: {
        en: 'Walk from Info Point (facing North) to the Great Pyramid. Do NOT step into the Marked Rope Zone!',
        th: 'เดินจากจุดข้อมูล (หันหน้าทางเหนือ) ไปยังมหาพีระมิด ห้ามเดินเข้าไปในเขตกั้นเชือกเด็ดขาด!',
      },
      spokenEnglish:
        'Walk from Info Point to the Great Pyramid, and do not step into the Marked Rope Zone.',
      startCoord: { col: 2, row: 3 },
      startHeading: 'N',
      targetCoord: { col: 1, row: 0 },
      targetLandmarkId: 'pyramid',
      allowAnySafeRouteToGoal: true,
      hints: {
        tier1Vocab: {
          en: 'Hazard rule: stay out of the amber Marked Rope Zone tile in the middle.',
          th: 'กฎความปลอดภัย: หลีกเลี่ยงช่องเขตกั้นเชือกสีส้มตรงกลางแผนที่',
        },
        tier2Clue: {
          en: 'Move forward 1 step, turn left past the Oasis, then turn right and walk straight north to the Great Pyramid.',
          th: 'เดินตรง 1 ก้าว แล้วเลี้ยวซ้ายผ่านโอเอซิส จากนั้นเลี้ยวขวาเดินตรงขึ้นเหนือสู่พีระมิด',
        },
        tier3Scaffold: {
          en: 'Sequence: Forward -> Turn Left -> Forward -> Turn Right -> Forward -> Forward.',
          th: 'ลำดับ: เดินตรง -> เลี้ยวซ้าย -> เดินตรง -> เลี้ยวขวา -> เดินตรง -> เดินตรง',
        },
      },
      successNote: {
        en: 'Great Pyramid reached safely without crossing the conservation rope!',
        th: 'ถึงมหาพีระมิดอย่างปลอดภัยโดยไม่ล้ำเข้าไปในเขตกั้นเชือก!',
      },
    },
    b1: {
      instruction: {
        en: 'Starting from Expedition Flag facing West, guide the explorer to the Great Pyramid while keeping clear of the Marked Rope Zone.',
        th: 'เริ่มจากธงคณะสำรวจโดยหันหน้าทางตะวันตก (W) พานักสำรวจไปยังมหาพีระมิดโดยหลีกเลี่ยงเขตกั้นเชือก',
      },
      spokenEnglish:
        'Starting from Expedition Flag facing West, guide the explorer to the Great Pyramid while keeping clear of the Marked Rope Zone.',
      startCoord: { col: 4, row: 3 },
      startHeading: 'W',
      targetCoord: { col: 1, row: 0 },
      targetLandmarkId: 'pyramid',
      allowAnySafeRouteToGoal: true,
      hints: {
        tier1Vocab: {
          en: '"keeping clear of" means route around (col 2, row 1).',
          th: '"keeping clear of" แปลว่าให้อยู่ห่างจากเขตกั้นเชือกตรงกลาง',
        },
        tier2Clue: {
          en: 'You can either pass the Great Sphinx going north on the right, or travel west via Info Point and Oasis.',
          th: 'สามารถเดินอ้อมทางฝั่งสฟิงซ์ขึ้นเหนือ หรือเดินผ่านจุดข้อมูลและโอเอซิสทางซ้ายก็ได้',
        },
        tier3Scaffold: {
          en: 'Any safe path ending on Great Pyramid (1, 0) without hitting the rope zone passes!',
          th: 'เส้นทางปลอดภัยใดก็ได้ที่ไปถึงมหาพีระมิดโดยไม่ชนเขตกั้นเชือกถือว่าผ่าน!',
        },
      },
      successNote: {
        en: 'Smart navigation! Multiple safe paths exist as long as you respect boundaries.',
        th: 'นำทางได้ฉลาดมาก! เส้นทางที่หลากหลายล้วนใช้ได้ตราบใดที่หลีกเลี่ยงเขตหวงห้าม',
      },
    },
  },
  {
    id: 'pp_3_exact_omar_directions',
    title: { en: 'Route 3 · Omar’s Courtyard Cue', th: 'เส้นทาง 3 · คำบอกทางของโอมาร์' },
    a2: {
      instruction: {
        en: 'Follow Omar’s exact steps from Desert Oasis facing East: go forward 2 steps to the Sphinx, turn left, then walk forward 2 steps to row 0.',
        th: 'ทำตามคำสั่งเป๊ะๆ จากโอเอซิส (หันหน้า E): เดินตรง 2 ก้าวถึงสฟิงซ์ เลี้ยวซ้าย แล้วเดินตรง 2 ก้าวขึ้นไปแถวบนสุด',
      },
      spokenEnglish:
        'From Desert Oasis facing East, go forward two steps to the Sphinx, turn left, then walk forward two steps.',
      startCoord: { col: 1, row: 2 },
      startHeading: 'E',
      targetCoord: { col: 3, row: 0 },
      targetLandmarkId: 'viewing_platform',
      acceptedExactSequences: [['FORWARD', 'FORWARD', 'LEFT', 'FORWARD', 'FORWARD']],
      allowAnySafeRouteToGoal: false,
      hints: {
        tier1Vocab: {
          en: 'Count carefully: "2 steps" -> Forward, Forward.',
          th: 'นับก้าวให้แม่น: "2 steps" = เดินตรง 2 ครั้ง',
        },
        tier2Clue: {
          en: 'Facing East, turning left points North toward the upper ridge.',
          th: 'หันหน้าทางตะวันออก การเลี้ยวซ้ายจะหันขึ้นทิศเหนือ',
        },
        tier3Scaffold: {
          en: 'Exact commands: Forward -> Forward -> Turn Left -> Forward -> Forward.',
          th: 'คำสั่ง: เดินตรง -> เดินตรง -> เลี้ยวซ้าย -> เดินตรง -> เดินตรง',
        },
      },
      successNote: {
        en: 'Exact match with Omar’s plaza cue!',
        th: 'ตรงตามขั้นตอนคำบอกทางของโอมาร์ทุกประการ!',
      },
    },
    b1: {
      instruction: {
        en: 'Starting at Great Pyramid facing South, reach Viewing Platform after stopping at the Great Sphinx along the way.',
        th: 'เริ่มที่มหาพีระมิด (หันหน้า S) เดินไปยังแท่นชมวิว โดยต้องแวะผ่านสฟิงซ์ระหว่างทางด้วย',
      },
      spokenEnglish:
        'Starting at the Great Pyramid facing South, reach the Viewing Platform after stopping at the Great Sphinx along the way.',
      startCoord: { col: 1, row: 0 },
      startHeading: 'S',
      targetCoord: { col: 4, row: 0 },
      targetLandmarkId: 'viewing_platform',
      requiredWaypointCoord: { col: 3, row: 2 },
      requiredWaypointLabel: { en: 'Great Sphinx', th: 'สฟิงซ์' },
      allowAnySafeRouteToGoal: true,
      hints: {
        tier1Vocab: {
          en: '"after stopping at the Great Sphinx" = pass through the Sphinx tile first.',
          th: '"after stopping at the Great Sphinx" = ต้องเดินผ่านช่องสฟิงซ์ก่อนถึงเป้าหมาย',
        },
        tier2Clue: {
          en: 'Go South 2 steps (to Oasis), turn left (East) 2 steps to Sphinx, then head North 2 steps and East 1 step to Viewing Platform.',
          th: 'เดินลงใต้ 2 ก้าว เลี้ยวซ้ายไปตะวันออก 2 ก้าวถึงสฟิงซ์ แล้วขึ้นเหนือไปแท่นชมวิว',
        },
        tier3Scaffold: {
          en: 'Make sure the amber route line touches Great Sphinx before ending on Viewing Platform.',
          th: 'ตรวจสอบให้เส้นทางสีทองพาดผ่านสฟิงซ์ก่อนไปจบที่แท่นชมวิว',
        },
      },
      successNote: {
        en: 'Route verified! You visited the checkpoint before finishing at the Viewing Platform.',
        th: 'ตรวจสอบเส้นทางผ่าน! คุณแวะผ่านจุดสำคัญก่อนถึงแท่นชมวิวได้ครบถ้วน',
      },
    },
  },
  {
    id: 'pp_4_reverse_heading',
    title: { en: 'Route 4 · Watch Your Facing Direction', th: 'เส้นทาง 4 · เช็กทิศที่กำลังหันหน้า' },
    a2: {
      instruction: {
        en: 'You are at Viewing Platform facing South. Go straight 2 steps, turn right, and step forward 1 time to meet the Great Sphinx.',
        th: 'คุณอยู่ที่แท่นชมวิว หันหน้าลงใต้ (S) เดินตรง 2 ก้าว เลี้ยวขวา แล้วเดินตรงอีก 1 ก้าวเพื่อไปหาสฟิงซ์',
      },
      spokenEnglish:
        'At the Viewing Platform facing South, go straight two steps, turn right, and step forward once to reach the Great Sphinx.',
      startCoord: { col: 4, row: 0 },
      startHeading: 'S',
      targetCoord: { col: 3, row: 2 },
      targetLandmarkId: 'sphinx',
      acceptedExactSequences: [['FORWARD', 'FORWARD', 'RIGHT', 'FORWARD']],
      allowAnySafeRouteToGoal: true,
      hints: {
        tier1Vocab: {
          en: 'When facing SOUTH, turning RIGHT points WEST (to the left side of the screen).',
          th: 'เมื่อหันหน้าลงทิศใต้ (S) การเลี้ยวขวาของตัวละครจะหันไปทางทิศตะวันตก (ฝั่งซ้ายของกระดาน)',
        },
        tier2Clue: {
          en: 'Move down 2 rows to row 2, then turn right and move 1 tile west.',
          th: 'เดินลง 2 ช่อง แล้วเลี้ยวขวาเพื่อเดินเข้าหาช่องสฟิงซ์',
        },
        tier3Scaffold: {
          en: 'Try: Forward -> Forward -> Turn Right -> Forward.',
          th: 'กด: เดินตรง -> เดินตรง -> เลี้ยวขวา -> เดินตรง',
        },
      },
      successNote: {
        en: 'Nice perspective switch! Turning right while facing South goes West.',
        th: 'จับทิศได้เยี่ยมมาก! แม้หันหน้าลงใต้ก็ไม่สับสนเรื่องซ้าย-ขวา',
      },
    },
    b1: {
      instruction: {
        en: 'From Viewing Platform facing West, turn left twice? No—turn left once, walk down to the Sphinx corner, and finish at the Expedition Flag.',
        th: 'เริ่มที่แท่นชมวิว (หันหน้า W) เลี้ยวซ้าย 1 ครั้ง เดินลงมาแถวสฟิงซ์ และจบที่ธงคณะสำรวจ',
      },
      spokenEnglish:
        'From Viewing Platform facing West, turn left once, walk down past the Sphinx row, and finish at the Expedition Flag.',
      startCoord: { col: 4, row: 0 },
      startHeading: 'W',
      targetCoord: { col: 4, row: 3 },
      targetLandmarkId: 'flag_post',
      allowAnySafeRouteToGoal: true,
      hints: {
        tier1Vocab: {
          en: 'Facing West, turning LEFT aims South straight down column 4.',
          th: 'เมื่อหันตะวันตก การเลี้ยวซ้ายจะหันหน้าลงใต้ตรงสู่ธงคณะสำรวจ',
        },
        tier2Clue: {
          en: 'Turn Left (South), then walk Forward 3 steps to Expedition Flag (4, 3).',
          th: 'เลี้ยวซ้ายแล้วเดินตรง 3 ก้าวลงไปที่ธง (4, 3)',
        },
        tier3Scaffold: {
          en: 'Sequence: Turn Left -> Forward -> Forward -> Forward.',
          th: 'ลำดับ: เลี้ยวซ้าย -> เดินตรง -> เดินตรง -> เดินตรง',
        },
      },
      successNote: {
        en: 'Clean Southbound route to the Expedition Flag!',
        th: 'เดินลงทิศใต้ถึงธงคณะสำรวจได้อย่างแม่นยำ!',
      },
    },
  },
  {
    id: 'pp_5_east_to_west',
    title: { en: 'Route 5 · Across the Plateau', th: 'เส้นทาง 5 · ข้ามที่ราบสูงกีซา' },
    a2: {
      instruction: {
        en: 'Start at the Great Sphinx facing North. Turn left, go straight 2 steps to the Oasis, turn left again, then step forward 1 time toward the bottom row.',
        th: 'เริ่มที่สฟิงซ์ (หันหน้า N) เลี้ยวซ้าย เดินตรง 2 ก้าวถึงโอเอซิส เลี้ยวซ้ายอีกครั้ง แล้วเดินตรง 1 ก้าวลงด้านล่าง',
      },
      spokenEnglish:
        'Start at the Great Sphinx facing North. Turn left, go straight two steps, turn left again, then step forward once.',
      startCoord: { col: 3, row: 2 },
      startHeading: 'N',
      targetCoord: { col: 1, row: 3 },
      targetLandmarkId: 'camp_gate',
      acceptedExactSequences: [['LEFT', 'FORWARD', 'FORWARD', 'LEFT', 'FORWARD']],
      allowAnySafeRouteToGoal: false,
      hints: {
        tier1Vocab: {
          en: 'Notice "turn left again" turns West -> South.',
          th: '"turn left again" เปลี่ยนทิศจากตะวันตก (W) ลงใต้ (S)',
        },
        tier2Clue: {
          en: 'Turn Left -> Forward 2 -> Turn Left -> Forward 1.',
          th: 'เลี้ยวซ้าย -> เดินตรง 2 ก้าว -> เลี้ยวซ้าย -> เดินตรง 1 ก้าว',
        },
        tier3Scaffold: {
          en: 'Follow the exact 5-command chain ending at (col 1, row 3).',
          th: 'เรียงคำสั่งทั้ง 5 ชิ้นให้จบที่ช่อง (col 1, row 3)',
        },
      },
      successNote: {
        en: 'Multi-turn mastery! Two left turns curved cleanly around the rope zone.',
        th: 'ควบคุมการเลี้ยวต่อเนื่องสองครั้งได้เก่งมาก!',
      },
    },
    b1: {
      instruction: {
        en: 'Start at Camp Gate facing North. Plot a safe route to Info Point that checks BOTH the Desert Oasis and the Great Sphinx before finishing.',
        th: 'เริ่มที่ประตูค่าย (หันหน้า N) วางเส้นทางปลอดภัยไปจุดข้อมูล โดยต้องแวะผ่านโอเอซิสและสฟิงซ์ก่อนจบ',
      },
      spokenEnglish:
        'Start at Camp Gate facing North. Plot a route to Info Point that passes Desert Oasis and the Great Sphinx before finishing.',
      startCoord: { col: 0, row: 3 },
      startHeading: 'N',
      targetCoord: { col: 2, row: 3 },
      targetLandmarkId: 'info_point',
      requiredWaypointCoord: { col: 3, row: 2 },
      requiredWaypointLabel: { en: 'Great Sphinx', th: 'สฟิงซ์' },
      allowAnySafeRouteToGoal: true,
      hints: {
        tier1Vocab: {
          en: 'Must touch Oasis (1,2) and Great Sphinx (3,2) before landing on Info Point (2,3).',
          th: 'เดินผ่านโอเอซิส (1,2) และสฟิงซ์ (3,2) ก่อนมาจบที่จุดข้อมูล (2,3)',
        },
        tier2Clue: {
          en: 'Walk up 1, turn right 3 steps through Oasis to Sphinx, then step south and west back to Info Point.',
          th: 'ขึ้นเหนือ 1 ก้าว เลี้ยวขวาเดินผ่านโอเอซิสไปถึงสฟิงซ์ แล้วเดินลงมาทางซ้ายเข้าจุดข้อมูล',
        },
        tier3Scaffold: {
          en: 'Forward -> Right -> Forward -> Forward -> Forward -> Right -> Forward -> Right -> Forward.',
          th: 'ลองกดตามช่องบนกระดาน: (0,2) -> โอเอซิส (1,2) -> (2,2) -> สฟิงซ์ (3,2) -> (3,3) -> จุดข้อมูล (2,3)',
        },
      },
      successNote: {
        en: 'Complete plateau loop! You linked landmarks cleanly without hitting restricted ropes.',
        th: 'วางเส้นทางเชื่อมจุดสำรวจบนที่ราบสูงได้ครบถ้วนโดยไม่ล้ำเขตกั้นเชือก!',
      },
    },
  },
  {
    id: 'pp_6_grand_survey',
    title: { en: 'Route 6 · Grand Survey Alignment', th: 'เส้นทาง 6 · สำรวจเส้นทางหลักเต็มรูปแบบ' },
    a2: {
      instruction: {
        en: 'Start at Camp Gate facing North. Walk forward 3 steps to the top row, turn right, then go forward 1 step to arrive at the Great Pyramid.',
        th: 'เริ่มที่ประตูค่าย (หันหน้า N) เดินตรง 3 ก้าวขึ้นไปแถวบนสุด เลี้ยวขวา แล้วเดินตรง 1 ก้าวถึงมหาพีระมิด',
      },
      spokenEnglish:
        'Start at Camp Gate facing North. Walk forward three steps, turn right, then go forward one step to the Great Pyramid.',
      startCoord: { col: 0, row: 3 },
      startHeading: 'N',
      targetCoord: { col: 1, row: 0 },
      targetLandmarkId: 'pyramid',
      acceptedExactSequences: [['FORWARD', 'FORWARD', 'FORWARD', 'RIGHT', 'FORWARD']],
      allowAnySafeRouteToGoal: true,
      hints: {
        tier1Vocab: {
          en: '"top row" from row 3 takes 3 forward steps north.',
          th: 'เดินขึ้นเหนือจากแถวล่างสุดถึงแถวบนสุดใช้ 3 ก้าว',
        },
        tier2Clue: {
          en: 'At (0, 0), turn right (East) and walk 1 step to Great Pyramid.',
          th: 'เมื่อถึงมุมซ้ายบน เลี้ยวขวาแล้วเดินตรง 1 ก้าวถึงมหาพีระมิด',
        },
        tier3Scaffold: {
          en: 'Sequence: Forward x3 -> Turn Right -> Forward.',
          th: 'ลำดับ: เดินตรง 3 ครั้ง -> เลี้ยวขวา -> เดินตรง 1 ครั้ง',
        },
      },
      successNote: {
        en: 'Plaza route complete! You can now read multi-step English directions accurately.',
        th: 'พิชิตเกมปริศนาเส้นทางกีซาครบแล้ว! คุณอ่านคำสั่งบอกทางหลายขั้นตอนได้แม่นยำ',
      },
    },
    b1: {
      instruction: {
        en: 'Beginning at Great Pyramid facing East, circle around the Marked Rope Zone via Viewing Platform and stop at the Info Point—avoiding the rope barrier at all times.',
        th: 'เริ่มที่มหาพีระมิด (หันหน้า E) เดินอ้อมเขตกั้นเชือกโดยแวะผ่านแท่นชมวิว แล้วมาจบที่จุดข้อมูลโดยไม่สัมผัสเขตกั้นเชือก',
      },
      spokenEnglish:
        'Beginning at the Great Pyramid facing East, circle around the Marked Rope Zone via the Viewing Platform and stop at the Info Point.',
      startCoord: { col: 1, row: 0 },
      startHeading: 'E',
      targetCoord: { col: 2, row: 3 },
      targetLandmarkId: 'info_point',
      requiredWaypointCoord: { col: 4, row: 0 },
      requiredWaypointLabel: { en: 'Viewing Platform', th: 'แท่นชมวิว' },
      allowAnySafeRouteToGoal: true,
      hints: {
        tier1Vocab: {
          en: 'Must visit Viewing Platform (4, 0) on your way to Info Point (2, 3).',
          th: 'ต้องแวะผ่านแท่นชมวิว (4, 0) ระหว่างทางไปยังจุดข้อมูล (2, 3)',
        },
        tier2Clue: {
          en: 'Walk East 3 steps to Viewing Platform, turn right (South) 3 steps to Expedition Flag, then turn right (West) 2 steps to Info Point.',
          th: 'เดินไปตะวันออก 3 ก้าวถึงแท่นชมวิว เลี้ยวขวาลงใต้ 3 ก้าวถึงธง แล้วเลี้ยวขวาเดินตะวันตก 2 ก้าวเข้าจุดข้อมูล',
        },
        tier3Scaffold: {
          en: 'Forward x3 -> Turn Right -> Forward x3 -> Turn Right -> Forward x2.',
          th: 'เดินตรง 3 -> เลี้ยวขวา -> เดินตรง 3 -> เลี้ยวขวา -> เดินตรง 2',
        },
      },
      successNote: {
        en: 'B1 directional mastery unlocked! Clear spatial commands and checkpoints mastered.',
        th: 'ผ่านด่านนำทางระดับ B1 อย่างยอดเยี่ยม! คุณเข้าใจคำสั่งบอกทิศและจุดแวะอย่างสมบูรณ์',
      },
    },
  },
];

export function validatePyramidPathAttempt(
  variant: PyramidPathVariant,
  commands: RouteCommand[],
): {
  isCorrect: boolean;
  simulation: RouteSimulationResult;
  reason: LocalizedText;
} {
  const sim = simulatePyramidRoute(variant.startCoord, variant.startHeading, commands);

  if (sim.hitHazard) {
    return {
      isCorrect: false,
      simulation: sim,
      reason: {
        en: 'Careful! Your route stepped into the Marked Rope Zone. Undo or reset and guide around it safely.',
        th: 'ระวัง! เส้นทางเดินล้ำเข้าไปในเขตกั้นเชือก กดย้อนกลับหรือเริ่มใหม่เพื่อเดินอ้อมอย่างปลอดภัย',
      },
    };
  }

  if (sim.hitBoundary) {
    return {
      isCorrect: false,
      simulation: sim,
      reason: {
        en: 'Your steps went outside the Giza learning board boundary. Undo the extra forward step and check your heading.',
        th: 'ก้าวเดินออกนอกขอบกระดานแผนที่ ลองกดย้อนกลับและเช็กทิศที่หันหน้าอีกครั้ง',
      },
    };
  }

  const reachedGoal =
    sim.finalCoord.col === variant.targetCoord.col &&
    sim.finalCoord.row === variant.targetCoord.row;

  if (!reachedGoal) {
    const destMeta = GIZA_BOARD_LANDMARKS.find((l) => l.id === variant.targetLandmarkId);
    return {
      isCorrect: false,
      simulation: sim,
      reason: {
        en: `You stopped at (${sim.finalCoord.col + 1}, ${sim.finalCoord.row + 1}), not ${destMeta?.label.en ?? 'the target'}. Add or adjust steps to finish on the goal square.`,
        th: `ตัวละครหยุดอยู่ที่ช่อง (${sim.finalCoord.col + 1}, ${sim.finalCoord.row + 1}) ยังไม่ถึง ${destMeta?.label.th ?? 'จุดหมาย'} ลองปรับคำสั่งต่ออีกนิด`,
      },
    };
  }

  if (variant.requiredWaypointCoord) {
    const wp = variant.requiredWaypointCoord;
    const hitWp = sim.visitedCoords.some((c) => c.col === wp.col && c.row === wp.row);
    if (!hitWp) {
      return {
        isCorrect: false,
        simulation: sim,
        reason: {
          en: `You reached the end square, but the instruction required passing ${variant.requiredWaypointLabel?.en ?? 'the checkpoint'} on the way!`,
          th: `ถึงปลายทางแล้ว แต่คำสั่งระบุให้ต้องแวะผ่าน ${variant.requiredWaypointLabel?.th ?? 'จุดแวะสำคัญ'} ระหว่างทางด้วยนะ`,
        },
      };
    }
  }

  if (!variant.allowAnySafeRouteToGoal && variant.acceptedExactSequences) {
    const exactOk = variant.acceptedExactSequences.some(
      (seq) =>
        seq.length === commands.length && seq.every((cmd, idx) => cmd === commands[idx]),
    );
    if (!exactOk) {
      return {
        isCorrect: false,
        simulation: sim,
        reason: {
          en: 'You reached the target square, but this step-by-step cue tests following the exact turns given in the prompt. Check the sequence!',
          th: 'ถึงเป้าหมายแล้ว แต่ข้อนี้ต้องการให้เดินตามลำดับการเลี้ยวที่ระบุในโจทย์ ลองเช็กคำสั่งอีกครั้ง',
        },
      };
    }
  }

  return {
    isCorrect: true,
    simulation: sim,
    reason: variant.successNote,
  };
}

// ---------------------------------------------------------------------------
// MINI-GAME 3 — THE PAPYRUS SEQUENCE (ancient_scribe_workshop)
// ---------------------------------------------------------------------------

export interface PapyrusStepCard {
  id: string;
  markerBadge: string;
  text: LocalizedText;
}

export interface PapyrusSequenceVariant {
  instruction: LocalizedText;
  spokenEnglish: string;
  cards: PapyrusStepCard[];
  acceptedOrders: string[][];
  hints: DiscoverHintLadder;
  successNote: LocalizedText;
}

export interface PapyrusSequenceChallenge {
  id: string;
  title: LocalizedText;
  a2: PapyrusSequenceVariant;
  b1: PapyrusSequenceVariant;
}

export const PAPYRUS_SEQUENCE_CHALLENGES: PapyrusSequenceChallenge[] = [
  {
    id: 'ps_1_unroll_scroll',
    title: { en: 'Scroll 1 · Inspecting a Study Sheet', th: 'ม้วนที่ 1 · เตรียมแผ่นบันทึกภาคสนาม' },
    a2: {
      instruction: {
        en: 'Arrange the 4 steps in order to prepare a fictional field-study sheet.',
        th: 'เรียงขั้นตอนทั้ง 4 เพื่อเตรียมแผ่นกระดาษบันทึกจำลองให้ถูกต้อง',
      },
      spokenEnglish:
        'First, place the clean study sheet flat on the table. Next, press the wooden corners gently. Then, write today’s camp date at the top. Finally, sign your explorer name.',
      cards: [
        {
          id: 'c1',
          markerBadge: 'First',
          text: {
            en: 'First, place the clean study sheet flat on the table.',
            th: 'First: วางแผ่นกระดาษบันทึกให้เรียบเสมอกับโต๊ะ',
          },
        },
        {
          id: 'c2',
          markerBadge: 'Next',
          text: {
            en: 'Next, hold the paper corners steady with smooth weights.',
            th: 'Next: ใช้ที่ทับมุมกระดาษไว้อย่างเบามือ',
          },
        },
        {
          id: 'c3',
          markerBadge: 'Then',
          text: {
            en: 'Then, write the date and zone title at the top.',
            th: 'Then: เขียนวันที่และชื่อโซนสำรวจไว้ด้านบน',
          },
        },
        {
          id: 'c4',
          markerBadge: 'Finally',
          text: {
            en: 'Finally, sign your explorer name in the bottom corner.',
            th: 'Finally: ลงชื่อผู้สำรวจไว้มุมล่าง',
          },
        },
      ],
      acceptedOrders: [['c1', 'c2', 'c3', 'c4']],
      hints: {
        tier1Vocab: {
          en: 'Look at the sequence openers: First -> Next -> Then -> Finally.',
          th: 'ดูคำขึ้นต้นบอกลำดับ: First -> Next -> Then -> Finally',
        },
        tier2Clue: {
          en: 'You have to lay the sheet flat and hold the corners before writing.',
          th: 'ต้องวางกระดาษให้เรียบและทับมุมก่อน จึงจะเริ่มเขียนได้',
        },
        tier3Scaffold: {
          en: 'Order: First (place) -> Next (hold corners) -> Then (write date) -> Finally (sign).',
          th: 'ลำดับ: First -> Next -> Then -> Finally',
        },
      },
      successNote: {
        en: 'Neat table setup! "First / Next / Then / Finally" guide every workshop task.',
        th: 'จัดโต๊ะได้เรียบร้อยมาก! คำว่า First / Next / Then / Finally ช่วยบอกลำดับชัดเจน',
      },
    },
    b1: {
      instruction: {
        en: 'Order the B1 conservation prep cards carefully—watch "Before" and "Once" dependencies.',
        th: 'เรียงลำดับขั้นการเตรียมบันทึกแบบ B1 โดยสังเกตความสัมพันธ์ของ "Before" และ "Once"',
      },
      spokenEnglish:
        'Before opening the folder, wash and dry your hands thoroughly. Once the desk is dust-free, unroll the study map slowly. After that, record the grid coordinates. When the ink dries, store the sheet safely.',
      cards: [
        {
          id: 'b1_1',
          markerBadge: 'Prep',
          text: {
            en: 'Before opening any study folder, make sure your hands are clean and dry.',
            th: 'ก่อนเปิดแฟ้มเอกสาร ตรวจสอบให้แน่ใจว่ามือสะอาดและแห้ง',
          },
        },
        {
          id: 'b1_2',
          markerBadge: 'Setup',
          text: {
            en: 'Once the desk is dust-free, unroll the practice chart slowly.',
            th: 'เมื่อโต๊ะปราศจากฝุ่นแล้ว จึงค่อยๆ คลี่แผนผังฝึกปฏิบัติออกมา',
          },
        },
        {
          id: 'b1_3',
          markerBadge: 'Record',
          text: {
            en: 'After that, copy the landmark coordinates into your logbook.',
            th: 'หลังจากนั้น คัดลอกพิกัดจุดสังเกตลงในสมุดบันทึก',
          },
        },
        {
          id: 'b1_4',
          markerBadge: 'Store',
          text: {
            en: 'When the ink has dried completely, roll the chart inside its protective tube.',
            th: 'เมื่อหมึกแห้งสนิทแล้ว ให้ม้วนเก็บแผนผังใส่หลอดป้องกัน',
          },
        },
      ],
      acceptedOrders: [['b1_1', 'b1_2', 'b1_3', 'b1_4']],
      hints: {
        tier1Vocab: {
          en: 'Connectors: "Before opening" -> "Once dust-free" -> "After that" -> "When ink dried".',
          th: 'คำเชื่อม: "Before opening" -> "Once" -> "After that" -> "When ink dried"',
        },
        tier2Clue: {
          en: 'You cannot unroll the chart before checking hands, and cannot store it before ink dries.',
          th: 'ต้องเช็กมือให้แห้งก่อนคลี่กระดาษ และรอหมึกแห้งก่อนม้วนเก็บ',
        },
        tier3Scaffold: {
          en: 'Sequence: Clean hands -> Unroll chart -> Record coordinates -> Roll inside tube.',
          th: 'ลำดับ: ล้างเช็ดมือ -> คลี่แผนผัง -> จดพิกัด -> ม้วนเก็บ',
        },
      },
      successNote: {
        en: 'Exact B1 dependency order! Every safety step unlocks the next.',
        th: 'ลำดับเหตุและผลถูกต้องสมบูรณ์! แต่ละขั้นตอนรองรับขั้นถัดไปอย่างลงตัว',
      },
    },
  },
  {
    id: 'ps_2_mixing_ink',
    title: { en: 'Scroll 2 · Mixing Practice Ink', th: 'ม้วนที่ 2 · เตรียมน้ำหมึกจำลอง' },
    a2: {
      instruction: {
        en: 'Put these 4 ink-mixing steps in order.',
        th: 'เรียงขั้นตอนการผสมหมึกฝึกเขียนทั้ง 4 ขั้นตอนให้ถูกต้อง',
      },
      spokenEnglish:
        'First, pour clean water into the stone bowl. Next, stir in blue mineral powder slowly. Then, test a brush stroke on scrap paper. Finally, label the ink cup.',
      cards: [
        {
          id: 'm1',
          markerBadge: 'First',
          text: {
            en: 'First, pour clean water into the mixing bowl.',
            th: 'First: เทน้ำสะอาดลงในถ้วยผสม',
          },
        },
        {
          id: 'm2',
          markerBadge: 'Next',
          text: {
            en: 'Next, stir blue color powder slowly into the water.',
            th: 'Next: คนผงสีน้ำเงินลงในน้ำอย่างช้าๆ',
          },
        },
        {
          id: 'm3',
          markerBadge: 'Then',
          text: {
            en: 'Then, test one brush line on spare scrap paper.',
            th: 'Then: ทดลองลากเส้นพู่กันลงบนกระดาษร่างก่อน',
          },
        },
        {
          id: 'm4',
          markerBadge: 'Finally',
          text: {
            en: 'Finally, place a label tag beside the ink bowl.',
            th: 'Finally: วางป้ายชื่อสีไว้ข้างถ้วยหมึก',
          },
        },
      ],
      acceptedOrders: [['m1', 'm2', 'm3', 'm4']],
      hints: {
        tier1Vocab: {
          en: 'Follow First -> Next -> Then -> Finally.',
          th: 'ดูคำบอกลำดับ First -> Next -> Then -> Finally',
        },
        tier2Clue: {
          en: 'Water goes in first, powder second, testing third, labeling last.',
          th: 'ใส่น้ำ -> คนผงสี -> ทดสอบบนกระดาษร่าง -> ติดป้ายชื่อ',
        },
        tier3Scaffold: {
          en: 'Order: Pour water -> Stir powder -> Test brush -> Place label.',
          th: 'ลำดับ: เทน้ำ -> คนผงสี -> ทดลองวาด -> วางป้ายชื่อ',
        },
      },
      successNote: {
        en: 'Clean workshop workflow! No ink spills on the main chart.',
        th: 'ขั้นตอนเรียบร้อยมาก! ไม่เลอะเทอะแผ่นงานจริง',
      },
    },
    b1: {
      instruction: {
        en: 'Order Mariam’s pigment guide—note that checking the bowl and laying cloth can be either way only if testing comes AFTER mixing!',
        th: 'เรียงขั้นตอนเตรียมสีของมาเรียมให้ถูกต้อง โดยต้องตรวจและผสมก่อนทดสอบเสมอ',
      },
      spokenEnglish:
        'Prior to adding pigment, check that the mixing cup is crack-free. After that, blend the blue powder with water until smooth. Once mixed, try a small stroke on scrap paper. Before finishing, rinse your brush carefully.',
      cards: [
        {
          id: 'bm1',
          markerBadge: 'Check',
          text: {
            en: 'Prior to adding pigment, check that the mixing cup is clean and crack-free.',
            th: 'ก่อนเติมผงสี ตรวจให้แน่ใจว่าถ้วยสะอาดและไม่ร้าว',
          },
        },
        {
          id: 'bm2',
          markerBadge: 'Blend',
          text: {
            en: 'After that, blend the pigment powder with water until smooth.',
            th: 'หลังจากนั้น ผสมผงสีกับน้ำให้เข้ากันจนเนียน',
          },
        },
        {
          id: 'bm3',
          markerBadge: 'Test',
          text: {
            en: 'Once the shade is mixed, test a small stroke on scrap paper.',
            th: 'เมื่อผสมสีได้ที่แล้ว ทดลองแต้มเส้นบนกระดาษร่าง',
          },
        },
        {
          id: 'bm4',
          markerBadge: 'Cleanup',
          text: {
            en: 'Before leaving the table, rinse the reed brush and wipe the rim.',
            th: 'ก่อนลุกจากโต๊ะ ล้างพู่กันอ้อและเช็ดขอบถ้วยให้สะอาด',
          },
        },
      ],
      acceptedOrders: [['bm1', 'bm2', 'bm3', 'bm4']],
      hints: {
        tier1Vocab: {
          en: '"Prior to adding pigment" = very first step before mixing.',
          th: '"Prior to" แปลว่า ก่อนหน้า — ต้องเป็นขั้นตอนแรกสุด',
        },
        tier2Clue: {
          en: 'Check cup -> Blend pigment -> Test on scrap -> Rinse brush.',
          th: 'ตรวจถ้วย -> ผสมสี -> ทดสอบ -> ล้างพู่กัน',
        },
        tier3Scaffold: {
          en: 'Order: Prior to (check) -> After that (blend) -> Once mixed (test) -> Before leaving (rinse).',
          th: 'ลำดับ: ตรวจถ้วย -> ผสม -> ทดสอบ -> ล้างทำความสะอาด',
        },
      },
      successNote: {
        en: 'Great B1 vocabulary! "Prior to" and "Once" clarify preparation and cleanup.',
        th: 'เก่งมาก! เข้าใจคำว่า "Prior to" และ "Once" ในขั้นตอนการทำงานจริง',
      },
    },
  },
  {
    id: 'ps_3_label_route',
    title: { en: 'Scroll 3 · Labeling a Field Sketch', th: 'ม้วนที่ 3 · ติดป้ายกำกับแผนผัง' },
    a2: {
      instruction: {
        en: 'Order the steps to draw and label a camp map.',
        th: 'เรียงขั้นตอนการวาดและใส่ชื่อสถานที่บนแผนที่ค่ายสำรวจ',
      },
      spokenEnglish:
        'First, sketch the Nile River line at the bottom. Next, draw the five landmark boxes. Then, write clear English labels beside each box. Finally, check all spelling.',
      cards: [
        {
          id: 'l1',
          markerBadge: '1',
          text: {
            en: 'First, draw the blue Nile River line along the bottom.',
            th: 'First: วาดเส้นแม่น้ำไนล์สีฟ้าไว้ด้านล่างของแผนที่',
          },
        },
        {
          id: 'l2',
          markerBadge: '2',
          text: {
            en: 'Next, mark the five landmark spots in pencil.',
            th: 'Next: ร่างตำแหน่งจุดสำรวจทั้ง 5 แห่งด้วยดินสอ',
          },
        },
        {
          id: 'l3',
          markerBadge: '3',
          text: {
            en: 'Then, write clear English names beside each spot.',
            th: 'Then: เขียนชื่อภาษาอังกฤษกำกับให้ชัดเจนข้างแต่ละจุด',
          },
        },
        {
          id: 'l4',
          markerBadge: '4',
          text: {
            en: 'Finally, check every spelling before sharing with the team.',
            th: 'Finally: ตรวจตัวสะกดทุกคำก่อนส่งต่อให้ทีม',
          },
        },
      ],
      acceptedOrders: [['l1', 'l2', 'l3', 'l4']],
      hints: {
        tier1Vocab: {
          en: 'Look for First -> Next -> Then -> Finally.',
          th: 'เรียงตาม First -> Next -> Then -> Finally',
        },
        tier2Clue: {
          en: 'Draw water line -> Mark 5 spots -> Write labels -> Check spelling.',
          th: 'วาดเส้นแม่น้ำ -> ร่าง 5 จุด -> เขียนชื่อกำกับ -> ตรวจตัวสะกด',
        },
        tier3Scaffold: {
          en: 'Check spelling always belongs at the very end.',
          th: 'การตรวจตัวสะกดอยู่ขั้นตอนสุดท้ายเสมอ',
        },
      },
      successNote: {
        en: 'Map ready for Dr. Layla! Clear steps prevent missed labels.',
        th: 'แผนที่พร้อมใช้งาน! เรียงลำดับชัดเจนช่วยให้ไม่ตกหล่นรายละเอียด',
      },
    },
    b1: {
      instruction: {
        en: 'Assemble this 4-step mapping workflow—note that marking landmarks and drawing the compass rose can happen in either middle position!',
        th: 'เรียงขั้นตอนทำแผนผัง 4 ขั้น โดยขั้นกลางสองขั้นสามารถสลับกันได้อย่างสมเหตุสมผล',
      },
      spokenEnglish:
        'Start by outlining the plateau border. While drafting the map, mark the five landmarks or add the North compass arrow—you can do those two in either order. However, wait until all icons are drawn before writing final labels.',
      cards: [
        {
          id: 'bl1',
          markerBadge: 'Start',
          text: {
            en: 'Start by lightly outlining the outer plateau border.',
            th: 'เริ่มด้วยการร่างกรอบนอกของพื้นที่ราบสูงเบาๆ',
          },
        },
        {
          id: 'bl2',
          markerBadge: 'Mid A',
          text: {
            en: 'Plot the five landmark pins across the plateau grid.',
            th: 'ลงตำแหน่งหมุดจุดสำรวจทั้ง 5 จุดบนตาราง',
          },
        },
        {
          id: 'bl3',
          markerBadge: 'Mid B',
          text: {
            en: 'Add the compass arrow pointing North in the upper corner.',
            th: 'วาดลูกศรเข็มทิศชี้ทิศเหนือไว้มุมบนของแผนผัง',
          },
        },
        {
          id: 'bl4',
          markerBadge: 'Final',
          text: {
            en: 'Wait until all icons are drawn before writing the final text labels.',
            th: 'รอให้วาดไอคอนทั้งหมดเสร็จก่อน จึงเขียนคำอธิบายกำกับขั้นสุดท้าย',
          },
        },
      ],
      acceptedOrders: [
        ['bl1', 'bl2', 'bl3', 'bl4'],
        ['bl1', 'bl3', 'bl2', 'bl4'],
      ],
      hints: {
        tier1Vocab: {
          en: '"Start by..." is Step 1, and "Wait until... before final labels" is Step 4.',
          th: '"Start by..." เป็นขั้นแรก และ "Wait until..." เป็นขั้นสุดท้าย',
        },
        tier2Clue: {
          en: 'Either [Plot pins -> Compass arrow] OR [Compass arrow -> Plot pins] works in the middle!',
          th: 'สองขั้นตอนตรงกลาง (ลงตำแหน่ง 5 จุด และ วาดลูกศรเข็มทิศ) สลับลำดับกันได้',
        },
        tier3Scaffold: {
          en: 'Keep Step 1 (border) first and Step 4 (final labels) last.',
          th: 'วางขั้นร่างกรอบไว้แรกสุด และเขียนคำกำกับไว้ท้ายสุด',
        },
      },
      successNote: {
        en: 'Flexible logic! Both valid middle sequences keep labels neat.',
        th: 'เยี่ยมมาก! เข้าใจความยืดหยุ่นของลำดับงานที่ทำสลับกันได้จริง',
      },
    },
  },
  {
    id: 'ps_4_tent_check',
    title: { en: 'Scroll 4 · Dusk Camp Shutdown', th: 'ม้วนที่ 4 · ปิดค่ายช่วงเย็น' },
    a2: {
      instruction: {
        en: 'Sort the evening tidy-up checklist in order.',
        th: 'เรียงขั้นตอนเก็บอุปกรณ์ประจำค่ายช่วงเย็นให้ถูกต้อง',
      },
      spokenEnglish:
        'First, cover the ink bowls with wooden lids. Next, place notebooks inside the dry box. Then, switch on the camp lantern. Finally, lock the supply chest.',
      cards: [
        {
          id: 't1',
          markerBadge: 'First',
          text: {
            en: 'First, cover the ink bowls with clean wooden lids.',
            th: 'First: ปิดฝาถ้วยหมึกให้เรียบร้อย',
          },
        },
        {
          id: 't2',
          markerBadge: 'Next',
          text: {
            en: 'Next, pack field notebooks inside the dry storage box.',
            th: 'Next: เก็บสมุดบันทึกใส่กล่องกันความชื้น',
          },
        },
        {
          id: 't3',
          markerBadge: 'Then',
          text: {
            en: 'Then, hang the camp lantern on the wooden post.',
            th: 'Then: แขวนโคมไฟค่ายไว้ที่เสาไม้',
          },
        },
        {
          id: 't4',
          markerBadge: 'Finally',
          text: {
            en: 'Finally, close and latch the camp supply chest.',
            th: 'Finally: ปิดและลงกลอนหีบอุปกรณ์ค่าย',
          },
        },
      ],
      acceptedOrders: [['t1', 't2', 't3', 't4']],
      hints: {
        tier1Vocab: {
          en: 'First -> Next -> Then -> Finally.',
          th: 'เรียงตาม First -> Next -> Then -> Finally',
        },
        tier2Clue: {
          en: 'Cover ink -> Box notebooks -> Hang lantern -> Latch chest.',
          th: 'ปิดฝาหมึก -> เก็บสมุด -> แขวนโคมไฟ -> ปิดหีบอุปกรณ์',
        },
        tier3Scaffold: {
          en: 'Remember "Finally, close and latch..." is the ending step.',
          th: 'ขั้นตอน "Finally" อยู่ลำดับที่ 4 เสมอ',
        },
      },
      successNote: {
        en: 'Camp secured cleanly for desert wind!',
        th: 'เก็บค่ายปลอดภัยพร้อมรับลมทะเลทรายยามค่ำคืน!',
      },
    },
    b1: {
      instruction: {
        en: 'Sequence the evening camp protocol using B1 time clauses.',
        th: 'เรียงขั้นตอนปิดค่ายระดับ B1 ตามคำเชื่อมเวลาและเหตุผล',
      },
      spokenEnglish:
        'As soon as dusk falls, switch on the tent lantern so nobody trips. While the lantern warms up, seal all ink jars tightly. After storing the journals in the waterproof trunk, double-check the lock before resting.',
      cards: [
        {
          id: 'bt1',
          markerBadge: 'Dusk',
          text: {
            en: 'As soon as dusk falls, light the camp lantern for safe visibility.',
            th: 'ทันทีที่พลบค่ำ จุดโคมไฟค่ายเพื่อให้มองเห็นทางปลอดภัย',
          },
        },
        {
          id: 'bt2',
          markerBadge: 'While',
          text: {
            en: 'While the area stays well lit, seal every ink jar tightly.',
            th: 'ระหว่างที่มีแสงสว่างเพียงพอ ปิดฝาขวดหมึกทุกใบให้สนิท',
          },
        },
        {
          id: 'bt3',
          markerBadge: 'After',
          text: {
            en: 'After placing the notebooks inside the dry chest, latch the lid.',
            th: 'หลังนำสมุดบันทึกใส่กล่องแห้งแล้ว ให้ล็อกฝากล่องให้แน่น',
          },
        },
        {
          id: 'bt4',
          markerBadge: 'Verify',
          text: {
            en: 'Before heading back to camp, make sure no loose paper remains on the desk.',
            th: 'ก่อนเดินกลับที่พัก ตรวจดูว่าไม่มีกระดาษหลงเหลือบนโต๊ะ',
          },
        },
      ],
      acceptedOrders: [['bt1', 'bt2', 'bt3', 'bt4']],
      hints: {
        tier1Vocab: {
          en: 'Notice "As soon as dusk falls" initiates lighting before table cleanup.',
          th: '"As soon as dusk falls" เป็นจุดเริ่มต้นเพื่อให้มีแสงก่อนเก็บของ',
        },
        tier2Clue: {
          en: 'Lantern on -> Seal ink -> Latch chest -> Final desk check.',
          th: 'จุดไฟ -> ปิดขวดหมึก -> ล็อกกล่อง -> ตรวจโต๊ะรอบสุดท้าย',
        },
        tier3Scaffold: {
          en: 'Order: As soon as -> While -> After placing -> Before heading back.',
          th: 'ลำดับ: ทันทีที่พลบค่ำ -> ระหว่างนั้น -> หลังเก็บสมุด -> ก่อนกลับ',
        },
      },
      successNote: {
        en: 'Clear chronological chain using "As soon as", "While", "After", and "Before"!',
        th: 'เรียงลำดับเหตุการณ์ด้วยคำเชื่อมเวลาหลากหลายแบบได้แม่นยำ!',
      },
    },
  },
  {
    id: 'ps_5_solar_notes',
    title: { en: 'Scroll 5 · Sun Courtyard Notes', th: 'ม้วนที่ 5 · บันทึกลานวิหารสุริยัน' },
    a2: {
      instruction: {
        en: 'Put these 4 shadow-measurement instructions in order.',
        th: 'เรียงขั้นตอนวัดเงาแสงอาทิตย์ทั้ง 4 ขั้นตอนให้ถูกต้อง',
      },
      spokenEnglish:
        'First, stand behind the stone line. Next, look at the shadow of the tall obelisk. Then, measure the shadow length with string. Finally, write the number in your chart.',
      cards: [
        {
          id: 's1',
          markerBadge: 'First',
          text: {
            en: 'First, stand behind the marked visitor stone line.',
            th: 'First: ยืนหลังเส้นหินที่กำหนดไว้สำหรับผู้เยี่ยมชม',
          },
        },
        {
          id: 's2',
          markerBadge: 'Next',
          text: {
            en: 'Next, watch where the obelisk shadow touches the floor.',
            th: 'Next: สังเกตจุดที่เงาของเสาโอเบลิสก์พาดลงบนพื้นลาน',
          },
        },
        {
          id: 's3',
          markerBadge: 'Then',
          text: {
            en: 'Then, check the shadow angle from the safe viewing spot.',
            th: 'Then: ดูมุมเงาจากจุดชมที่ปลอดภัยโดยไม่เหยียบเส้นวัด',
          },
        },
        {
          id: 's4',
          markerBadge: 'Finally',
          text: {
            en: 'Finally, record the afternoon shadow time in your log.',
            th: 'Finally: จดบันทึกเวลาและตำแหน่งเงาลงในสมุด',
          },
        },
      ],
      acceptedOrders: [['s1', 's2', 's3', 's4']],
      hints: {
        tier1Vocab: {
          en: 'Follow First -> Next -> Then -> Finally.',
          th: 'ดูคำนำหน้า First -> Next -> Then -> Finally',
        },
        tier2Clue: {
          en: 'Stand behind line -> Watch shadow -> Check angle -> Record log.',
          th: 'ยืนหลังเส้น -> มองเงา -> ดูมุม -> จดบันทึก',
        },
        tier3Scaffold: {
          en: 'Safety standing position comes first; recording numbers comes last.',
          th: 'การจัดตำแหน่งยืนปลอดภัยมาก่อน และการจดผลอยู่ท้ายสุด',
        },
      },
      successNote: {
        en: 'Great observation order—respecting stone lines while recording angles!',
        th: 'เรียงขั้นตอนสังเกตเงาและเคารพเส้นกั้นได้ครบถ้วน!',
      },
    },
    b1: {
      instruction: {
        en: 'Order the B1 solar-axis briefing steps (two observation checks in the middle are interchangeable).',
        th: 'เรียงขั้นตอนสังเกตแนวแสงในวิหาร (ขั้นกลางสองขั้นสามารถสลับลำดับกันได้)',
      },
      spokenEnglish:
        'Before approaching the courtyard tiles, confirm that your backpack is zipped shut. Either note the sun disc height or compare the west shadow angle next. Once both measurements are ready, report your figures to Karim.',
      cards: [
        {
          id: 'bs1',
          markerBadge: 'Prep',
          text: {
            en: 'Before stepping onto the courtyard tiles, zip your field backpack closed.',
            th: 'ก่อนก้าวเข้าสู่ลานหิน รูดซิปเป้สำรวจให้เรียบร้อย',
          },
        },
        {
          id: 'bs2',
          markerBadge: 'Obs A',
          text: {
            en: 'Note how the golden sun disc aligns above the central archway.',
            th: 'สังเกตแนวของจานสุริยันสีทองเหนือซุ้มประตูกลาง',
          },
        },
        {
          id: 'bs3',
          markerBadge: 'Obs B',
          text: {
            en: 'Measure the column shadow width from the permitted pathway.',
            th: 'วัดความกว้างเงาเสาหินจากบนทางเดินที่อนุญาต',
          },
        },
        {
          id: 'bs4',
          markerBadge: 'Report',
          text: {
            en: 'Once both visual checks are complete, share your notes with Karim.',
            th: 'เมื่อตรวจสังเกตครบทั้งสองอย่างแล้ว จึงนำบันทึกไปแจ้งคาริม',
          },
        },
      ],
      acceptedOrders: [
        ['bs1', 'bs2', 'bs3', 'bs4'],
        ['bs1', 'bs3', 'bs2', 'bs4'],
      ],
      hints: {
        tier1Vocab: {
          en: '"Before stepping..." must come 1st; "Once both checks are complete" comes 4th.',
          th: '"Before stepping..." อยู่ลำดับ 1 และ "Once both checks..." อยู่ลำดับ 4',
        },
        tier2Clue: {
          en: 'The two visual checks (Obs A & Obs B) can happen in either order!',
          th: 'การสังเกตจานสุริยันและวัดเงาเสาสามารถทำอันไหนก่อนก็ได้',
        },
        tier3Scaffold: {
          en: 'Put Prep first and Report last.',
          th: 'วาง Prep ไว้ช่อง 1 และ Report ไว้ช่อง 4',
        },
      },
      successNote: {
        en: 'Spot on! You recognized dependency boundaries vs parallel observations.',
        th: 'ยอดเยี่ยม! แยกแยะระหว่างขั้นตอนบังคับก่อน-หลังกับสิ่งที่ทำสลับได้เก่งมาก',
      },
    },
  },
  {
    id: 'ps_6_chamber_briefing',
    title: { en: 'Scroll 6 · Team Expedition Summary', th: 'ม้วนที่ 6 · สรุปภารกิจส่งหัวหน้าทีม' },
    a2: {
      instruction: {
        en: 'Put the full 4-zone expedition route in order from start to finish.',
        th: 'เรียงลำดับแผนปฏิบัติงาน 4 โซนตั้งแต่เริ่มจนจบให้ถูกต้อง',
      },
      spokenEnglish:
        'First, pack essentials at the Nile Camp. Next, read route directions at the Pyramid Plaza. Then, organize notes at the Scribe Workshop. Finally, review visitor rules at the Temple.',
      cards: [
        {
          id: 'f1',
          markerBadge: 'First',
          text: {
            en: 'First, pack expedition essentials at the Nile Camp.',
            th: 'First: เตรียมอุปกรณ์จำเป็นที่ค่ายริมแม่น้ำไนล์',
          },
        },
        {
          id: 'f2',
          markerBadge: 'Next',
          text: {
            en: 'Next, follow path instructions across the Pyramid Plaza.',
            th: 'Next: เดินตามคำสั่งบอกทางที่ลานมหาพีระมิด',
          },
        },
        {
          id: 'f3',
          markerBadge: 'Then',
          text: {
            en: 'Then, organize your step sequence at the Scribe Workshop.',
            th: 'Then: จัดเรียงลำดับขั้นตอนที่โรงอาลักษณ์',
          },
        },
        {
          id: 'f4',
          markerBadge: 'Finally',
          text: {
            en: 'Finally, check temple guardian rules before reaching the north gate.',
            th: 'Finally: ทบทวนกฎผู้พิทักษ์วิหารก่อนมุ่งหน้าสู่ประตูทิศเหนือ',
          },
        },
      ],
      acceptedOrders: [['f1', 'f2', 'f3', 'f4']],
      hints: {
        tier1Vocab: {
          en: 'Follow First -> Next -> Then -> Finally along the Giza route.',
          th: 'เรียงตามลำดับเส้นทางและคำว่า First -> Next -> Then -> Finally',
        },
        tier2Clue: {
          en: 'Camp -> Pyramid Plaza -> Scribe Workshop -> Temple.',
          th: 'ค่ายริมไนล์ -> ลานพีระมิด -> โรงอาลักษณ์ -> วิหารสุริยัน',
        },
        tier3Scaffold: {
          en: 'Place Camp #1, Pyramid #2, Scribe #3, Temple #4.',
          th: '1. ค่าย -> 2. พีระมิด -> 3. อาลักษณ์ -> 4. วิหาร',
        },
      },
      successNote: {
        en: 'Scribe Workshop complete! Your team briefing scroll is spotless.',
        th: 'ผ่านภารกิจโรงอาลักษณ์ครบแล้ว! ม้วนสรุปขั้นตอนสมบูรณ์แบบ',
      },
    },
    b1: {
      instruction: {
        en: 'Reconstruct Mariam’s B1 briefing using dependency connectors.',
        th: 'เรียงสรุปภารกิจระดับ B1 โดยใช้ตัวเชื่อมเงื่อนไขและเวลา',
      },
      spokenEnglish:
        'Before setting off from camp, verify every bag checklist item. Once you cross the plaza safely, transcribe your sketches in clear sequence. After reviewing all temple preservation signs, present your summary at the sealed gate.',
      cards: [
        {
          id: 'bf1',
          markerBadge: '1 · Camp',
          text: {
            en: 'Before departing Nile Camp, verify every required packing item.',
            th: 'ก่อนออกจากค่ายริมไนล์ ตรวจสอบอุปกรณ์จำเป็นทุกชิ้นให้ครบ',
          },
        },
        {
          id: 'bf2',
          markerBadge: '2 · Route',
          text: {
            en: 'Once you navigate safely around the plaza ropes, head to the workshop.',
            th: 'เมื่อผ่านเขตกั้นเชือกที่ลานอย่างปลอดภัยแล้ว ให้มุ่งหน้าสู่โรงอาลักษณ์',
          },
        },
        {
          id: 'bf3',
          markerBadge: '3 · Rules',
          text: {
            en: 'After organizing your steps and reviewing temple rules, keep notes clear.',
            th: 'หลังจัดเรียงขั้นตอนและทบทวนกฎวิหารแล้ว รักษาบันทึกให้เรียบร้อย',
          },
        },
        {
          id: 'bf4',
          markerBadge: '4 · Gate',
          text: {
            en: 'When all four stations are checked off, report at the sealed northern gate.',
            th: 'เมื่อผ่านครบทั้งสี่จุดแล้ว จึงเข้ารายงานตัวหน้าประตูทิศเหนือ',
          },
        },
      ],
      acceptedOrders: [['bf1', 'bf2', 'bf3', 'bf4']],
      hints: {
        tier1Vocab: {
          en: 'Trace the timeline: Before departing -> Once across plaza -> After rules -> When all 4 checked.',
          th: 'ไล่ตามช่วงเวลา: ก่อนออก -> เมื่อข้ามลาน -> หลังทบทวนกฎ -> เมื่อครบสี่จุด',
        },
        tier2Clue: {
          en: 'Camp -> Plaza/Workshop -> Temple Rules -> Northern Gate.',
          th: 'ค่าย -> ลาน/โรงอาลักษณ์ -> กฎวิหาร -> ประตูทิศเหนือ',
        },
        tier3Scaffold: {
          en: 'Order: Departing Camp -> Plaza Ropes -> Temple Rules -> Sealed Gate.',
          th: 'ลำดับ: ออกจากค่าย -> ผ่านลาน -> ทบทวนกฎ -> ประตูทิศเหนือ',
        },
      },
      successNote: {
        en: 'Master scribe! You read complex multi-stage B1 sequences cleanly.',
        th: 'ยอดเยี่ยมมาก! คุณเข้าใจการเรียงลำดับขั้นตอนระดับ B1 อย่างแม่นยำ',
      },
    },
  },
];

export function validatePapyrusSequence(
  variant: PapyrusSequenceVariant,
  placedCardIds: string[],
): { isCorrect: boolean; reason: LocalizedText } {
  if (placedCardIds.length !== variant.cards.length) {
    return {
      isCorrect: false,
      reason: {
        en: `Place all ${variant.cards.length} sequence cards into the scroll slots before checking.`,
        th: `วางบัตรขั้นตอนให้ครบทั้ง ${variant.cards.length} ใบลงบนม้วนกระดาษก่อนกดตรวจสอบนะ`,
      },
    };
  }

  const matches = variant.acceptedOrders.some(
    (order) => order.length === placedCardIds.length && order.every((id, i) => id === placedCardIds[i]),
  );

  if (!matches) {
    return {
      isCorrect: false,
      reason: {
        en: 'Check the time connectors ("First, Next, Then, Finally" or "Before, Once, After"). One or more steps are out of order.',
        th: 'ยังมีจุดที่สลับลำดับกันอยู่ ลองสังเกตคำเชื่อมเวลาด้านหน้าแต่ละประโยคอีกครั้งนะ',
      },
    };
  }

  return {
    isCorrect: true,
    reason: variant.successNote,
  };
}

// ---------------------------------------------------------------------------
// MINI-GAME 4 — TEMPLE GUARDIAN RULES (temple_of_the_sun)
// ---------------------------------------------------------------------------

export type TempleRuleMechanic =
  | 'match_sign'
  | 'sort_do_dont'
  | 'polite_guidance'
  | 'conditional_complete'
  | 'rule_purpose_match';

export interface TempleRuleOptionCard {
  id: string;
  label: LocalizedText;
  toneTag?: 'polite' | 'rude' | 'wrong_topic';
  feedback: LocalizedText;
}

export interface TempleSortItem {
  id: string;
  text: LocalizedText;
  bucket: 'do' | 'dont';
}

export interface TemplePurposePair {
  ruleId: string;
  ruleText: LocalizedText;
  correctPurposeId: string;
  purposes: { id: string; text: LocalizedText }[];
}

export interface TempleGuardianVariant {
  mechanic: TempleRuleMechanic;
  sceneKey: 'rope_barrier' | 'visitor_sorting' | 'flash_camera' | 'weather_shade' | 'sandstone_sorting' | 'preservation_why';
  instruction: LocalizedText;
  spokenEnglish: string;
  // For match_sign / polite_guidance / conditional_complete
  options?: TempleRuleOptionCard[];
  correctOptionId?: string;
  // For sort_do_dont
  sortItems?: TempleSortItem[];
  // For rule_purpose_match
  purposePairs?: TemplePurposePair[];
  hints: DiscoverHintLadder;
  successNote: LocalizedText;
}

export interface TempleGuardianChallenge {
  id: string;
  title: LocalizedText;
  a2: TempleGuardianVariant;
  b1: TempleGuardianVariant;
}

export const TEMPLE_GUARDIAN_CHALLENGES: TempleGuardianChallenge[] = [
  {
    id: 'tg_1_sign_match',
    title: { en: 'Rule 1 · Match the Warning Sign', th: 'กฎที่ 1 · จับคู่ป้ายเตือนกับสถานการณ์' },
    a2: {
      mechanic: 'match_sign',
      sceneKey: 'rope_barrier',
      instruction: {
        en: 'A visitor is stepping toward a fragile carved stone column. Choose the matching Temple Guardian sign.',
        th: 'นักท่องเที่ยวกำลังก้าวเข้าใกล้เสาหินแกะสลักที่เปราะบาง เลือกป้ายคำสั่งผู้พิทักษ์ที่ตรงกับภาพนี้',
      },
      spokenEnglish:
        'Please stay behind the rope barrier and do not touch the stone carvings.',
      options: [
        {
          id: 's1_a',
          label: {
            en: 'Please stay behind the rope · Do not touch carvings',
            th: 'กรุณายืนหลังเชือกกั้น · ห้ามสัมผัสงานแกะสลัก',
          },
          feedback: {
            en: 'Exact sign! Polite "Please" + clear "Do not touch" protects fragile stone.',
            th: 'ถูกต้อง! คำเตือนที่สุภาพและชัดเจนช่วยปกป้องเสาหินแกะสลัก',
          },
        },
        {
          id: 's1_b',
          label: {
            en: 'Run quickly through the gateway to save time',
            th: 'วิ่งผ่านซุ้มประตูให้เร็วที่สุดเพื่อประหยัดเวลา',
          },
          feedback: {
            en: 'Running in a monument courtyard is unsafe; visitors must walk calmly behind ropes.',
            th: 'การวิ่งในลานโบราณสถานอาจเกิดอันตรายได้ ไม่ใช่คำแนะนำที่ถูกต้อง',
          },
        },
        {
          id: 's1_c',
          label: {
            en: 'Drink two liters of Nile water before sitting down',
            th: 'ดื่มน้ำริมไนล์ให้หมดก่อนนั่งพัก',
          },
          feedback: {
            en: 'This sign talks about drinking water, not touching stone carvings.',
            th: 'ป้ายนี้ไม่ตรงกับสถานการณ์การเข้าใกล้เสาหินแกะสลัก',
          },
        },
      ],
      correctOptionId: 's1_a',
      hints: {
        tier1Vocab: {
          en: 'Look for stone safety words: "stay behind" and "do not touch".',
          th: 'มองหาคำสำคัญเรื่องความปลอดภัย: "stay behind" และ "do not touch"',
        },
        tier2Clue: {
          en: 'Pick the plaque protecting the stone carvings behind the rope.',
          th: 'เลือกป้ายที่บอกให้ยืนหลังเชือกและห้ามจับงานแกะสลัก',
        },
        tier3Scaffold: {
          en: 'Select "Please stay behind the rope · Do not touch carvings".',
          th: 'เลือกป้าย "กรุณายืนหลังเชือกกั้น · ห้ามสัมผัสงานแกะสลัก"',
        },
      },
      successNote: {
        en: 'Clear guardian signage keeps sandstone carvings intact for future generations!',
        th: 'ป้ายเตือนชัดเจนช่วยให้เสาหินทรายคงอยู่สมบูรณ์ต่อไป!',
      },
    },
    b1: {
      mechanic: 'match_sign',
      sceneKey: 'rope_barrier',
      instruction: {
        en: 'Visitors are leaning over a protective courtyard cord for a close photo. Select the B1 guardian plaque that states both the obligation and the reason.',
        th: 'นักท่องเที่ยวโน้มตัวข้ามเชือกเพื่อถ่ายภาพใกล้ๆ เลือกป้ายผู้พิทักษ์ระดับ B1 ที่บอกทั้งข้อบังคับและเหตุผลอย่างสุภาพ',
      },
      spokenEnglish:
        'Visitors must remain behind the barrier cord so delicate limestone surfaces stay protected from skin oils and accidental bumps.',
      options: [
        {
          id: 'bs1_a',
          label: {
            en: 'Visitors must remain behind the cord so carvings stay protected.',
            th: 'ผู้เยี่ยมชมต้องอยู่หลังเชือกกั้น เพื่อให้งานแกะสลักปลอดภัย',
          },
          feedback: {
            en: 'Strong B1 plaque! "Must remain" gives the rule and "so..." explains why.',
            th: 'ยอดเยี่ยม! ใช้ "must remain" บอกกฎ และ "so..." อธิบายเหตุผลได้อย่างสุภาพ',
          },
        },
        {
          id: 'bs1_b',
          label: {
            en: 'Step inside whenever nobody is watching the central pylon.',
            th: 'ก้าวข้ามเชือกเข้าไปได้เลยหากไม่มีเจ้าหน้าที่ยืนดูอยู่',
          },
          feedback: {
            en: 'Rules protect heritage at all times, not only when staff are watching!',
            th: 'กฎการอนุรักษ์ต้องปฏิบัติตามตลอดเวลา แม้ไม่มีคนเฝ้าดู',
          },
        },
        {
          id: 'bs1_c',
          label: {
            en: 'You may lean lightly on columns if your backpack feels heavy.',
            th: 'สามารถพิงเสาหินเบาๆ ได้หากสะพายเป้หนัก',
          },
          feedback: {
            en: 'Leaning on ancient stone weakens surfaces over time; visitors mustn’t lean.',
            th: 'ห้ามพิงเสาหินโบราณเพราะจะทำให้ผิวหินสึกหรอและเสียหาย',
          },
        },
      ],
      correctOptionId: 'bs1_a',
      hints: {
        tier1Vocab: {
          en: 'Look for modal "must" paired with a purpose clause ("so...").',
          th: 'มองหาคำว่า "must" คู่กับเหตุผล ("so...")',
        },
        tier2Clue: {
          en: 'Heritage rules protect stone from bumps and oils at all times.',
          th: 'กฎมีไว้เพื่อป้องกันความเสียหายจากแรงกระแทกและรอยสัมผัส',
        },
        tier3Scaffold: {
          en: 'Choose "Visitors must remain behind the cord so carvings stay protected."',
          th: 'เลือกป้ายแรกที่ระบุให้ยืนหลังเชือกเพื่อปกป้องงานแกะสลัก',
        },
      },
      successNote: {
        en: 'Spot on! Explaining "why" makes visitors gladly respect heritage rules.',
        th: 'ดีมาก! การอธิบายเหตุผลช่วยให้นักท่องเที่ยวเต็มใจทำตามกฎ',
      },
    },
  },
  {
    id: 'tg_2_sort_do_dont',
    title: { en: 'Rule 2 · Sort Do & Don’t Cards', th: 'กฎที่ 2 · แยกบัตร Do และ Don’t' },
    a2: {
      mechanic: 'sort_do_dont',
      sceneKey: 'visitor_sorting',
      instruction: {
        en: 'Sort all 4 courtyard action cards into DO (Safe & Helpful) or DON’T (Restricted / Unsafe).',
        th: 'แยกบัตรพฤติกรรมทั้ง 4 ใบลงในช่อง DO (ควรทำ) หรือ DON’T (ห้ามทำ)',
      },
      spokenEnglish:
        'Sort the visitor actions: walk calmly on stone paths, keep water bottles capped, do not climb walls, and do not drop litter.',
      sortItems: [
        {
          id: 'sd1',
          text: { en: 'Walk calmly along marked stone paths', th: 'เดินอย่างสงบบนทางเดินหินที่กำหนด' },
          bucket: 'do',
        },
        {
          id: 'sd2',
          text: { en: 'Climb onto sandstone temple ledges', th: 'ปีนขึ้นไปบนขอบกำแพงหินทรายวิหาร' },
          bucket: 'dont',
        },
        {
          id: 'sd3',
          text: { en: 'Carry your empty snack wrapper back to camp', th: 'เก็บซองขนมกลับไปทิ้งที่ถังขยะค่าย' },
          bucket: 'do',
        },
        {
          id: 'sd4',
          text: { en: 'Touch painted solar relief symbols', th: 'เอามือไปแตะลายสีบนผนังวิหาร' },
          bucket: 'dont',
        },
      ],
      hints: {
        tier1Vocab: {
          en: 'DO = protects visitors & stone · DON’T = risks damage or falls.',
          th: 'DO = ปลอดภัยและช่วยอนุรักษ์ · DON’T = เสี่ยงเสียหายหรือหกล้ม',
        },
        tier2Clue: {
          en: 'Two cards belong in DO (walking paths, carrying trash back) and two in DON’T (climbing, touching paint).',
          th: 'มี 2 ใบอยู่ใน DO (เดินตามทาง, เก็บขยะ) และ 2 ใบอยู่ใน DON’T (ปีนกำแพง, แตะสี)',
        },
        tier3Scaffold: {
          en: 'Tap any card, then tap the DO or DON’T zone (or drag it in!).',
          th: 'แตะเลือกบัตรแล้วแตะช่อง DO หรือ DON’T เพื่อย้ายตำแหน่ง',
        },
      },
      successNote: {
        en: 'All 4 behaviors sorted cleanly! Safe habits keep the courtyard welcoming.',
        th: 'แยกพฤติกรรมทั้ง 4 ข้อได้ครบถ้วน! ช่วยกันดูแลวิหารได้อย่างดีเยี่ยม',
      },
    },
    b1: {
      mechanic: 'sort_do_dont',
      sceneKey: 'visitor_sorting',
      instruction: {
        en: 'Classify these 4 B1 temple precautions into SHOULD / MUST DO vs MUSTN’T DO.',
        th: 'แยกข้อควรระวังระดับ B1 ทั้ง 4 ข้อลงในช่อง SHOULD / MUST DO หรือ MUSTN’T DO',
      },
      spokenEnglish:
        'Classify these courtyard precautions into recommended practices and prohibited actions.',
      sortItems: [
        {
          id: 'bsd1',
          text: { en: 'Lower your voice so guides can brief nearby groups clearly', th: 'ลดเสียงลงเพื่อให้ผู้นำทางอธิบายกลุ่มอื่นได้ชัดเจน' },
          bucket: 'do',
        },
        {
          id: 'bsd2',
          text: { en: 'Use bright camera flash directly against painted columns', th: 'เปิดแฟลชสว่างจ้าจ่อถ่ายเสาหินที่มีสีโบราณ' },
          bucket: 'dont',
        },
        {
          id: 'bsd3',
          text: { en: 'Report loose stones or spilled water to Karim right away', th: 'แจ้งคาริมทันทีหากเห็นหินหลวมหรือมีน้ำหกบนพื้น' },
          bucket: 'do',
        },
        {
          id: 'bsd4',
          text: { en: 'Set heavy metal tripods onto delicate carved steps', th: 'วางขาตั้งกล้องโลหะหนักๆ ลงบนขั้นบันไดหินแกะสลัก' },
          bucket: 'dont',
        },
      ],
      hints: {
        tier1Vocab: {
          en: 'Ask: does this help preserve/assist (DO), or stress/damage surfaces (DON’T)?',
          th: 'ลองเช็กว่าพฤติกรรมนี้ช่วยดูแล (DO) หรือสร้างความเสียหาย (DON’T)',
        },
        tier2Clue: {
          en: 'Lowering voices & reporting hazards = DO · Camera flash & heavy metal tripods = DON’T.',
          th: 'ลดเสียงและแจ้งเหตุ = DO · เปิดแฟลชและวางขาตั้งโลหะบนหินแกะสลัก = DON’T',
        },
        tier3Scaffold: {
          en: 'Assign all 4 cards so zero remain unsorted before checking.',
          th: 'จัดเรียงบัตรทั้ง 4 ใบเข้าช่องให้ครบก่อนกดตรวจ',
        },
      },
      successNote: {
        en: 'Expert guardian judgment! Flash and heavy tripods can slowly harm ancient surfaces.',
        th: 'ตัดสินใจได้อย่างผู้พิทักษ์มืออาชีพ! หลีกเลี่ยงแฟลชและแรงกดทับจากโลหะได้ถูกต้อง',
      },
    },
  },
  {
    id: 'tg_3_polite_instruction',
    title: { en: 'Rule 3 · Polite Visitor Guidance', th: 'กฎที่ 3 · เตือนนักท่องเที่ยวอย่างสุภาพ' },
    a2: {
      mechanic: 'polite_guidance',
      sceneKey: 'flash_camera',
      instruction: {
        en: 'A friend is about to turn on camera flash inside the shaded pylon hall. Pick the clearest, most polite instruction.',
        th: 'เพื่อนกำลังจะเปิดแฟลชถ่ายรูปในโถงเสาหินที่ร่ม เลือกประโยคเตือนที่สุภาพและชัดเจนที่สุด',
      },
      spokenEnglish:
        'Please turn off your camera flash—no flash is allowed near painted stone.',
      options: [
        {
          id: 'pg1_a',
          label: {
            en: 'Please turn off your flash—light can fade painted walls.',
            th: 'กรุณาปิดแฟลชด้วยนะ แสงแฟลชอาจทำให้สีบนผนังซีดจาง',
          },
          feedback: {
            en: 'Friendly, respectful, and clear! Using "Please" gets instant cooperation.',
            th: 'ทั้งสุภาพ เป็นมิตร และให้เหตุผลชัดเจน ใช้ได้ผลดีมาก',
          },
        },
        {
          id: 'pg1_b',
          label: {
            en: 'Give me your phone right now! Stop taking pictures forever!',
            th: 'ส่งโทรศัพท์มาเดี๋ยวนี้! ห้ามถ่ายรูปอีกต่อไปเลย!',
          },
          feedback: {
            en: 'Shouting commands feels rude and unhelpful—try a polite "Please..." cue.',
            th: 'การตะโกนสั่งฟังดูไม่สุภาพ ควรใช้คำว่า "Please..." พร้อมบอกเหตุผลแทน',
          },
        },
        {
          id: 'pg1_c',
          label: {
            en: 'Wait here and count five lotus flowers in the Nile.',
            th: 'ยืนรอตรงนี้แล้วนับดอกบัวในแม่น้ำไนล์ห้าดอก',
          },
          feedback: {
            en: 'Off-topic! Tell your friend politely to switch off the camera flash.',
            th: 'ไม่ตรงประเด็น! ควรบอกให้เพื่อนปิดแฟลชกล้องอย่างสุภาพ',
          },
        },
      ],
      correctOptionId: 'pg1_a',
      hints: {
        tier1Vocab: {
          en: 'Look for polite opener "Please" + "turn off your flash".',
          th: 'มองหาคำสุภาพ "Please" ร่วมกับ "turn off your flash"',
        },
        tier2Clue: {
          en: 'Polite guardians avoid angry demands and explain the safety reason.',
          th: 'ผู้ดูแลที่ดีจะไม่พูดห้วนๆ แต่อธิบายอย่างสุภาพ',
        },
        tier3Scaffold: {
          en: 'Select the first card mentioning "Please turn off your flash".',
          th: 'เลือกตัวเลือกที่ขอให้ปิดแฟลชอย่างสุภาพพร้อมเหตุผล',
        },
      },
      successNote: {
        en: 'Respectful communication in action!',
        th: 'สื่อสารอย่างมีมารยาทและได้ผลยอดเยี่ยม!',
      },
    },
    b1: {
      mechanic: 'polite_guidance',
      sceneKey: 'flash_camera',
      instruction: {
        en: 'A visiting photographer asks whether tripod flash lighting is okay near the solar carvings. Choose Karim’s best B1 polite refusal and alternative.',
        th: 'ช่างภาพถามว่าใช้ไฟแฟลชขาตั้งใกล้ภาพสลักได้ไหม เลือกคำปฏิเสธอย่างสุภาพพร้อมทางเลือกจากคาริม',
      },
      spokenEnglish:
        'I’m afraid you mustn’t use flash photography near painted reliefs, though you should feel free to shoot in natural daylight from behind the rail.',
      options: [
        {
          id: 'bpg1_a',
          label: {
            en: 'I’m afraid you mustn’t use flash here, though you’re welcome to use natural daylight.',
            th: 'เกรงว่าที่นี่ห้ามใช้แฟลชครับ แต่คุณสามารถใช้แสงธรรมชาติถ่ายได้เต็มที่',
          },
          feedback: {
            en: 'Polite B1 diplomacy! Combining a soft refusal ("mustn’t") with what they CAN do works wonderfully.',
            th: 'สื่อสารระดับ B1 ได้อย่างยอดเยี่ยม! ปฏิเสธอย่างนุ่มนวลพร้อมบอกสิ่งที่ทำได้จริง',
          },
        },
        {
          id: 'bpg1_b',
          label: {
            en: 'Read the board yourself and stop bothering temple staff.',
            th: 'ไปอ่านป้ายเอาเอง อย่ารบกวนเจ้าหน้าที่',
          },
          feedback: {
            en: 'Dismissive replies discourage respectful exploration.',
            th: 'การพูดปัดไม่เป็นมิตร ไม่เหมาะกับการสื่อสารกับผู้มาเยือน',
          },
        },
        {
          id: 'bpg1_c',
          label: {
            en: 'You must climb onto the altar base to get brighter sunlight.',
            th: 'ต้องปีนขึ้นไปบนฐานแท่นบูชาเพื่อให้ได้แสงสว่างขึ้น',
          },
          feedback: {
            en: 'Climbing monuments violates safety and heritage protection rules!',
            th: 'การปีนป่ายโบราณสถานผิดกฎความปลอดภัยและการอนุรักษ์',
          },
        },
      ],
      correctOptionId: 'bpg1_a',
      hints: {
        tier1Vocab: {
          en: 'Look for polite softener "I’m afraid..." + helpful alternative ("natural daylight").',
          th: 'สังเกตคำเกริ่นสุภาพ "I’m afraid..." และทางเลือกที่อนุญาต ("natural daylight")',
        },
        tier2Clue: {
          en: 'A good B1 guardian explains what is prohibited AND what is permitted.',
          th: 'บอกทั้งสิ่งที่ห้าม ("mustn’t") และทางเลือกที่อนุญาต ("welcome to...")',
        },
        tier3Scaffold: {
          en: 'Choose the polite response forbidding flash while welcoming natural daylight photos.',
          th: 'เลือกคำตอบที่ปฏิเสธการใช้แฟลชอย่างสุภาพและแนะนำให้ใช้แสงธรรมชาติแทน',
        },
      },
      successNote: {
        en: 'Tactful B1 guidance! Softening rules builds positive cooperation.',
        th: 'สื่อสารได้อย่างนุ่มนวลและมืออาชีพ!',
      },
    },
  },
  {
    id: 'tg_4_conditional_rule',
    title: { en: 'Rule 4 · Complete the Conditional Rule', th: 'กฎที่ 4 · เติมเงื่อนไขให้สมบูรณ์' },
    a2: {
      mechanic: 'conditional_complete',
      sceneKey: 'weather_shade',
      instruction: {
        en: 'Complete the Sun Courtyard instruction: "If the midday sun feels very hot, _______"',
        th: 'เติมประโยคคำสั่งให้สมบูรณ์: "If the midday sun feels very hot, _______" (หากแดดตอนเที่ยงร้อนจัด...)',
      },
      spokenEnglish:
        'If the midday sun feels very hot, please rest in the shaded courtyard and drink water.',
      options: [
        {
          id: 'cc1_a',
          label: {
            en: 'please rest in the shade and drink some water.',
            th: 'กรุณาพักในที่ร่มและดื่มน้ำให้เพียงพอ',
          },
          feedback: {
            en: 'Logical safety match! Heat cue -> shade and hydration.',
            th: 'สอดคล้องกันเป๊ะ! อากาศร้อน -> พักในร่มและดื่มน้ำ',
          },
        },
        {
          id: 'cc1_b',
          label: {
            en: 'put on a heavy wool scarf and run around the sand.',
            th: 'ใส่ผ้าพันคอขนสัตว์หนาๆ แล้ววิ่งรอบลานทราย',
          },
          feedback: {
            en: 'Running in heavy clothing in noon desert heat is dangerous.',
            th: 'การใส่ผ้าหนาและวิ่งกลางแดดจัดเป็นอันตราย ไม่ตรงเหตุผล',
          },
        },
        {
          id: 'cc1_c',
          label: {
            en: 'pour your water bottle onto ancient temple carvings.',
            th: 'เทน้ำในขวดลงบนหินแกะสลักโบราณ',
          },
          feedback: {
            en: 'Never pour water on heritage sandstone! Water causes erosion.',
            th: 'ห้ามเทน้ำใส่หินทรายโบราณโดยเด็ดขาดเพราะจะทำให้หินผุกร่อน',
          },
        },
      ],
      correctOptionId: 'cc1_a',
      hints: {
        tier1Vocab: {
          en: '"If..." gives the condition (hot sun); pick the safe desert action.',
          th: '"If..." บอกเงื่อนไข (แดดร้อนจัด) — เลือกวิธีดูแลตัวเองที่ปลอดภัย',
        },
        tier2Clue: {
          en: 'Shade and drinking water protect explorers from desert heat.',
          th: 'การหลบเข้าที่ร่มและดื่มน้ำช่วยป้องกันลมแดด',
        },
        tier3Scaffold: {
          en: 'Select "please rest in the shade and drink some water."',
          th: 'เลือก "กรุณาพักในที่ร่มและดื่มน้ำให้เพียงพอ"',
        },
      },
      successNote: {
        en: 'Clean "If..., please..." conditional rule built!',
        th: 'ต่อประโยคเงื่อนไข "If..., please..." ได้ถูกต้อง!',
      },
    },
    b1: {
      mechanic: 'conditional_complete',
      sceneKey: 'weather_shade',
      instruction: {
        en: 'Complete Karim’s conditional precaution: "Should a sudden desert wind raise dust across the courtyard, _______"',
        th: 'เติมประโยคเตือนเงื่อนไขระดับ B1: "Should a sudden desert wind raise dust across the courtyard, _______" (หากเกิดลมพัดฝุ่นทราย...)',
      },
      spokenEnglish:
        'Should a sudden desert wind raise dust across the courtyard, explorers should close their notebooks immediately and wait calmly beside the sheltered wall.',
      options: [
        {
          id: 'bcc1_a',
          label: {
            en: 'close your notebooks immediately and wait beside the sheltered wall.',
            th: 'รีบปิดสมุดบันทึกทันทีและยืนรอในจุดกำบังลมข้างกำแพง',
          },
          feedback: {
            en: 'Precise B1 conditional! Protects both your field notes and your eyes during wind.',
            th: 'เยี่ยมมาก! ป้องกันทั้งสมุดบันทึกและสายตาได้อย่างเหมาะสม',
          },
        },
        {
          id: 'bcc1_b',
          label: {
            en: 'spread open loose papyrus maps flat on the windy sand.',
            th: 'คลี่แผ่นแผนที่ทุกแผ่นวางกางไว้บนทรายกลางลมแรง',
          },
          feedback: {
            en: 'Wind will blow loose sheets away or coat them with grit.',
            th: 'ลมแรงจะพัดกระดาษปลิวหายหรือเปื้อนฝุ่นทรายเสียหายได้',
          },
        },
        {
          id: 'bcc1_c',
          label: {
            en: 'climb the tallest obelisk to check wind direction.',
            th: 'ปีนเสาโอเบลิสก์ที่สูงที่สุดเพื่อดูทิศทางลม',
          },
          feedback: {
            en: 'Climbing monuments is strictly forbidden—especially in high winds!',
            th: 'ห้ามปีนโบราณสถานอย่างเด็ดขาด โดยเฉพาะเวลาลมแรง!',
          },
        },
      ],
      correctOptionId: 'bcc1_a',
      hints: {
        tier1Vocab: {
          en: 'Note: "Should a wind raise dust..." is an inverted B1 "If..." clause!',
          th: 'สังเกต: "Should a wind..." มีความหมายเหมือน "If a wind..." ในระดับ B1',
        },
        tier2Clue: {
          en: 'Keep paper supplies protected and move into shelter.',
          th: 'เก็บสมุดให้มิดชิดและหลบเข้าที่กำบังลม',
        },
        tier3Scaffold: {
          en: 'Pick "close your notebooks immediately and wait beside the sheltered wall."',
          th: 'เลือกคำตอบที่ให้ปิดสมุดบันทึกและหลบเข้าที่กำบังข้างกำแพง',
        },
      },
      successNote: {
        en: 'Sharp B1 grammar check! Inverted conditionals ("Should...") mean "If...".',
        th: 'ยอดเยี่ยม! เข้าใจโครงสร้างเงื่อนไขระดับ B1 ("Should...") ได้อย่างถูกต้อง',
      },
    },
  },
  {
    id: 'tg_5_sandstone_rules',
    title: { en: 'Rule 5 · Final Do/Don’t Inspection', th: 'กฎที่ 5 · ตรวจตราความเรียบร้อยรอบวิหาร' },
    a2: {
      mechanic: 'sort_do_dont',
      sceneKey: 'sandstone_sorting',
      instruction: {
        en: 'Sort these 4 courtyard rules into DO or DON’T.',
        th: 'แยกป้ายกติกาทั้ง 4 ข้อลงในช่อง DO (ควรปฏิบัติ) หรือ DON’T (ข้อห้าม)',
      },
      spokenEnglish:
        'Check your last four rules: ask guides politely before taking group photos, keep backpacks zipped, do not scratch letters into sandstone, and do not cross yellow barriers.',
      sortItems: [
        {
          id: 'ss1',
          text: { en: 'Ask guides politely before taking group photos', th: 'ขออนุญาตเจ้าหน้าที่อย่างสุภาพก่อนถ่ายภาพกลุ่ม' },
          bucket: 'do',
        },
        {
          id: 'ss2',
          text: { en: 'Scratch your initials onto stone walls', th: 'ขูดเขียนชื่อย่อลงบนกำแพงหิน' },
          bucket: 'dont',
        },
        {
          id: 'ss3',
          text: { en: 'Keep your backpack zipped near narrow columns', th: 'รูดซิปเป้ให้เรียบร้อยเมื่อเดินผ่านซอกเสาแคบ' },
          bucket: 'do',
        },
        {
          id: 'ss4',
          text: { en: 'Step past yellow warning chains', th: 'ก้าวข้ามโซ่เตือนสีเหลือง' },
          bucket: 'dont',
        },
      ],
      hints: {
        tier1Vocab: {
          en: 'Two respectful actions (DO), two harmful actions (DON’T).',
          th: 'มีข้อควรทำ 2 ข้อ (DO) และข้อห้าม 2 ข้อ (DON’T)',
        },
        tier2Clue: {
          en: 'Polite asking + zipped bags = DO · Scratching stone + crossing chains = DON’T.',
          th: 'ขออนุญาตอย่างสุภาพ + ปิดซิปกระเป๋า = DO · ขีดเขียนผนัง + ข้ามโซ่กั้น = DON’T',
        },
        tier3Scaffold: {
          en: 'Place all 4 cards into the matching zones and check.',
          th: 'ใส่บัตรทั้ง 4 ใบเข้าช่องให้ครบแล้วกดตรวจสอบ',
        },
      },
      successNote: {
        en: 'Respectful heritage care verified!',
        th: 'ผ่านการตรวจความเข้าใจด้านการอนุรักษ์โบราณสถานแล้ว!',
      },
    },
    b1: {
      mechanic: 'sort_do_dont',
      sceneKey: 'sandstone_sorting',
      instruction: {
        en: 'Sort these 4 B1 team rules into REQUIRED (Must / Should) vs PROHIBITED (Mustn’t).',
        th: 'แยกข้อตกลงทีมสำรวจระดับ B1 ลงช่อง REQUIRED (ต้องทำ) หรือ PROHIBITED (ห้ามทำ)',
      },
      spokenEnglish:
        'Sort the team rules: check footing before lifting tools, stay within sight of your group, mustn’t lean backpacks against painted limestone, and mustn’t handle artefacts without authorization.',
      sortItems: [
        {
          id: 'bss1',
          text: { en: 'Stay within clear sight of your group guide', th: 'เดินอยู่ในระยะที่มองเห็นผู้นำกลุ่มได้ชัดเจน' },
          bucket: 'do',
        },
        {
          id: 'bss2',
          text: { en: 'Lean heavy packs against painted limestone', th: 'วางกระเป๋าหนักพิงกำแพงหินปูนที่มีลายสี' },
          bucket: 'dont',
        },
        {
          id: 'bss3',
          text: { en: 'Watch uneven flagstones before stepping forward', th: 'มองดูพื้นหินต่างระดับก่อนก้าวเดินไปข้างหน้า' },
          bucket: 'do',
        },
        {
          id: 'bss4',
          text: { en: 'Pick up loose stone fragments as souvenirs', th: 'หยิบเศษหินโบราณติดตัวกลับไปเป็นของที่ระลึก' },
          bucket: 'dont',
        },
      ],
      hints: {
        tier1Vocab: {
          en: 'Souvenir-taking and leaning bags harm heritage = PROHIBITED (Don’t).',
          th: 'การเก็บเศษหินหรือพิงกำแพงทำให้เสียหาย = ห้ามทำ (Don’t)',
        },
        tier2Clue: {
          en: 'Staying with guide + watching uneven steps = DO.',
          th: 'อยู่กับกลุ่ม + ระวังพื้นต่างระดับ = DO',
        },
        tier3Scaffold: {
          en: 'Two DO cards, two DON’T cards.',
          th: 'แบ่งเป็น DO 2 ใบ และ DON’T 2 ใบ',
        },
      },
      successNote: {
        en: 'Zero harm, maximum teamwork!',
        th: 'ปลอดภัย ไร้ความเสียหาย และทำงานเป็นทีมได้ดีเยี่ยม!',
      },
    },
  },
  {
    id: 'tg_6_rule_purpose',
    title: { en: 'Rule 6 · Match Rules to Reasons', th: 'กฎที่ 6 · จับคู่กฎกับเหตุผลเบื้องหลัง' },
    a2: {
      mechanic: 'rule_purpose_match',
      sceneKey: 'preservation_why',
      instruction: {
        en: 'Match each Temple Guardian rule on the left with the reason why it matters on the right.',
        th: 'จับคู่กติกาทางซ้ายเข้ากับเหตุผลว่าทำไมจึงสำคัญทางขวาให้ครบทั้ง 3 คู่',
      },
      spokenEnglish:
        'Match each rule to its reason: Do not touch walls to stop oil marks. Stay on paths to protect soft ground. Turn off flash to keep colors bright.',
      purposePairs: [
        {
          ruleId: 'r1',
          ruleText: { en: 'Do not touch carved stone', th: 'ห้ามสัมผัสหินแกะสลัก' },
          correctPurposeId: 'p1',
          purposes: [
            { id: 'p1', text: { en: 'Stops skin oil from wearing away carvings', th: 'ป้องกันคราบไขมันจากมือทำให้ลายสึกหรอ' } },
            { id: 'p2', text: { en: 'Protects ancient colors from fading', th: 'ช่วยป้องกันไม่ให้สีโบราณซีดจาง' } },
            { id: 'p3', text: { en: 'Prevents tripping on loose sand', th: 'ป้องกันการสะดุดล้มบนทรายและหิน' } },
          ],
        },
        {
          ruleId: 'r2',
          ruleText: { en: 'Turn off camera flash', th: 'ปิดแฟลชกล้องถ่ายรูป' },
          correctPurposeId: 'p2',
          purposes: [],
        },
        {
          ruleId: 'r3',
          ruleText: { en: 'Walk only on marked paths', th: 'เดินเฉพาะบนทางเดินที่กำหนด' },
          correctPurposeId: 'p3',
          purposes: [],
        },
      ],
      hints: {
        tier1Vocab: {
          en: 'Connect key words: "touch" -> "skin oil", "flash" -> "colors", "paths" -> "tripping".',
          th: 'เชื่อมคำสำคัญ: แตะ -> คราบมือ · แฟลช -> สีซีด · ทางเดิน -> สะดุดล้ม',
        },
        tier2Clue: {
          en: 'Check all 3 dropdown/tap selectors so each rule has a different matching reason.',
          th: 'ตรวจดูว่าทั้ง 3 กฎจับคู่เหตุผลที่สอดคล้องกันและไม่ซ้ำกัน',
        },
        tier3Scaffold: {
          en: '1. Touch -> skin oil · 2. Flash -> bright colors · 3. Paths -> tripping safety.',
          th: '1. ห้ามแตะ -> ป้องกันคราบมือ · 2. ปิดแฟลช -> สีไม่ซีด · 3. เดินตามทาง -> ปลอดภัย',
        },
      },
      successNote: {
        en: 'Temple Guardian certified! Knowing "why" turns rules into genuine stewardship.',
        th: 'ผ่านภารกิจผู้พิทักษ์วิหารแล้ว! การเข้าใจเหตุผลช่วยให้เราดูแลมรดกโลกด้วยใจจริง',
      },
    },
    b1: {
      mechanic: 'rule_purpose_match',
      sceneKey: 'preservation_why',
      instruction: {
        en: 'Link each B1 conservation directive to its scientific preservation rationale.',
        th: 'จับคู่ข้อปฏิบัติการอนุรักษ์ระดับ B1 เข้ากับเหตุผลทางวิชาการให้ครบทั้ง 3 ข้อ',
      },
      spokenEnglish:
        'Pair each conservation directive with its preservation rationale: zip backpacks to avoid scraping columns, ban tripods to stop vibration and chipping, and hold dry-ink rules to avoid stains.',
      purposePairs: [
        {
          ruleId: 'br1',
          ruleText: { en: 'Keep packs zipped along narrow aisles', th: 'รูดซิปเป้ให้เรียบร้อยเมื่อเดินผ่านซอกเสาแคบ' },
          correctPurposeId: 'bp1',
          purposes: [
            { id: 'bp1', text: { en: 'Prevents loose straps from scraping carved reliefs', th: 'ป้องกันสายกระเป๋าขูดขีดลวดลายแกะสลัก' } },
            { id: 'bp2', text: { en: 'Stops heavy metal feet from chipping sandstone', th: 'ป้องกันขาตั้งโลหะกะเทาะผิวหินทราย' } },
            { id: 'bp3', text: { en: 'Avoids wet smudges on shared reference maps', th: 'ป้องกันรอยเปื้อนบนแผนที่และเอกสาร' } },
          ],
        },
        {
          ruleId: 'br2',
          ruleText: { en: 'No metal tripods on courtyard stone', th: 'ห้ามตั้งขาตั้งโลหะบนพื้นหินลานวิหาร' },
          correctPurposeId: 'bp2',
          purposes: [],
        },
        {
          ruleId: 'br3',
          ruleText: { en: 'Wait for ink to dry before rolling charts', th: 'รอให้หมึกแห้งสนิทก่อนม้วนเก็บแผนผัง' },
          correctPurposeId: 'bp3',
          purposes: [],
        },
      ],
      hints: {
        tier1Vocab: {
          en: 'Match "straps" with backpacks, "metal feet" with tripods, and "smudges" with ink.',
          th: 'จับคู่: เป้ -> สายกระเป๋าขูดขีด · ขาตั้งโลหะ -> กะเทาะหิน · หมึกแห้ง -> รอยเปื้อน',
        },
        tier2Clue: {
          en: 'Select the matching rationale button under each of the 3 B1 rules.',
          th: 'กดเลือกเหตุผลที่ตรงกันใต้กติกาทั้ง 3 ข้อ',
        },
        tier3Scaffold: {
          en: '1. Zipped packs -> loose straps · 2. Tripods -> metal feet · 3. Dry ink -> smudges.',
          th: '1. เป้ -> สายกระเป๋า · 2. ขาตั้ง -> ขาโลหะ · 3. หมึกแห้ง -> รอยเปื้อน',
        },
      },
      successNote: {
        en: 'Karim salutes your mastery of Temple Guardian rules and preservation English!',
        th: 'คาริมชื่นชมความเข้าใจของคุณ! คุณผ่านกฎการอนุรักษ์ระดับ B1 อย่างสมบูรณ์',
      },
    },
  },
];

export function validateTempleGuardianSubmission(
  variant: TempleGuardianVariant,
  submission: {
    selectedOptionId?: string;
    sortBuckets?: Record<string, 'do' | 'dont'>;
    purposeMatches?: Record<string, string>;
  },
): { isCorrect: boolean; reason: LocalizedText } {
  if (
    variant.mechanic === 'match_sign' ||
    variant.mechanic === 'polite_guidance' ||
    variant.mechanic === 'conditional_complete'
  ) {
    const chosen = variant.options?.find((o) => o.id === submission.selectedOptionId);
    if (!chosen) {
      return {
        isCorrect: false,
        reason: {
          en: 'Select one of the illustrated guardian cards first.',
          th: 'กรุณาเลือกการ์ดคำตอบก่อนกดตรวจสอบ',
        },
      };
    }
    const isCorrect = chosen.id === variant.correctOptionId;
    return { isCorrect, reason: chosen.feedback };
  }

  if (variant.mechanic === 'sort_do_dont') {
    const items = variant.sortItems ?? [];
    const buckets = submission.sortBuckets ?? {};
    const unassigned = items.filter((item) => !buckets[item.id]);
    if (unassigned.length > 0) {
      return {
        isCorrect: false,
        reason: {
          en: `Sort all ${items.length} cards into DO or DON’T (${unassigned.length} still remaining).`,
          th: `กรุณาแยกบัตรให้ครบทั้ง ${items.length} ใบก่อนตรวจสอบ (ยังเหลือ ${unassigned.length} ใบ)`,
        },
      };
    }
    const wrongCount = items.filter((item) => buckets[item.id] !== item.bucket).length;
    if (wrongCount > 0) {
      return {
        isCorrect: false,
        reason: {
          en: `${wrongCount} card(s) are in the wrong bucket. Look closely at whether each action protects or harms the temple.`,
          th: `มีบัตร ${wrongCount} ใบยังอยู่ผิดฝั่ง ลองทบทวนว่าพฤติกรรมนั้นช่วยดูแลหรือสร้างความเสียหาย`,
        },
      };
    }
    return { isCorrect: true, reason: variant.successNote };
  }

  // rule_purpose_match
  const pairs = variant.purposePairs ?? [];
  const matches = submission.purposeMatches ?? {};
  const incomplete = pairs.some((p) => !matches[p.ruleId]);
  if (incomplete) {
    return {
      isCorrect: false,
      reason: {
        en: 'Choose a matching preservation reason for all 3 rules before checking.',
        th: 'กรุณาเลือกเหตุผลให้ครบทั้ง 3 กฎก่อนกดตรวจสอบ',
      },
    };
  }
  const wrongPairs = pairs.filter((p) => matches[p.ruleId] !== p.correctPurposeId);
  if (wrongPairs.length > 0) {
    return {
      isCorrect: false,
      reason: {
        en: `${wrongPairs.length} rule-reason pair(s) do not match yet. Check the clues connecting action and protection.`,
        th: `ยังมี ${wrongPairs.length} คู่ที่ยังไม่ตรงเหตุผล ลองเชื่อมคำสำคัญระหว่างกติกาและผลกระทบอีกครั้ง`,
      },
    };
  }

  return { isCorrect: true, reason: variant.successNote };
}

// ---------------------------------------------------------------------------
// MINI-GAME 5 — THE PHARAOH'S INSTRUCTION CODE (chamber_of_wisdom)
// ---------------------------------------------------------------------------

export type FictionalGlyphId =
  | 'sun'
  | 'water'
  | 'lotus'
  | 'pyramid'
  | 'star'
  | 'scroll';

export interface FictionalGlyphMeta {
  id: FictionalGlyphId;
  label: LocalizedText;
  accentColor: string;
}

export const FICTIONAL_TABLET_GLYPHS: Record<FictionalGlyphId, FictionalGlyphMeta> = {
  sun: { id: 'sun', label: { en: 'Sun', th: 'ดวงอาทิตย์ (Sun)' }, accentColor: '#E7B43C' },
  water: { id: 'water', label: { en: 'Water', th: 'สายน้ำ (Water)' }, accentColor: '#0EA5E9' },
  lotus: { id: 'lotus', label: { en: 'Lotus', th: 'ดอกบัว (Lotus)' }, accentColor: '#12B8B0' },
  pyramid: { id: 'pyramid', label: { en: 'Pyramid', th: 'พีระมิด (Pyramid)' }, accentColor: '#D97706' },
  star: { id: 'star', label: { en: 'Star', th: 'ดวงดาว (Star)' }, accentColor: '#6366F1' },
  scroll: { id: 'scroll', label: { en: 'Scroll', th: 'ม้วนสาร (Scroll)' }, accentColor: '#B45309' },
};

export interface PharaohCodeVariant {
  instruction: LocalizedText;
  spokenEnglish: string;
  litHintSymbol?: FictionalGlyphId; // used by conditional challenges (e.g., "If Sun is glowing...")
  requiresOrder: boolean;
  expectedSequence: FictionalGlyphId[];
  forbiddenSymbols: FictionalGlyphId[];
  hints: DiscoverHintLadder;
  successNote: LocalizedText;
}

export interface PharaohCodeChallenge {
  id: string;
  title: LocalizedText;
  a2: PharaohCodeVariant;
  b1: PharaohCodeVariant;
}

export const PHARAOH_CODE_CHALLENGES: PharaohCodeChallenge[] = [
  {
    id: 'pc_1_basic_pair',
    title: { en: 'Seal 1 · First & Then Sequence', th: 'รหัสที่ 1 · สัมผัสตามลำดับ' },
    a2: {
      instruction: {
        en: 'First touch the Sun symbol, then touch the Water symbol.',
        th: 'First (ก่อน): แตะสัญลักษณ์ Sun (ดวงอาทิตย์), then (จากนั้น): แตะสัญลักษณ์ Water (สายน้ำ)',
      },
      spokenEnglish: 'First touch the Sun symbol, then touch the Water symbol.',
      requiresOrder: true,
      expectedSequence: ['sun', 'water'],
      forbiddenSymbols: [],
      hints: {
        tier1Vocab: {
          en: 'Order words: "First" = Slot 1, "then" = Slot 2.',
          th: 'คำบอกลำดับ: "First" = ช่องที่ 1, "then" = ช่องที่ 2',
        },
        tier2Clue: {
          en: 'Tap Sun first, then tap Water.',
          th: 'แตะ Sun ก่อน แล้วแตะ Water เป็นอันที่สอง',
        },
        tier3Scaffold: {
          en: 'Expected tablet slots: [Sun] -> [Water].',
          th: 'ลำดับบนศิลา: [Sun] -> [Water]',
        },
      },
      successNote: {
        en: 'Gold glow active! Simple 2-step sequence decoded.',
        th: 'ถอดรหัสคู่แรกสำเร็จ!',
      },
    },
    b1: {
      instruction: {
        en: 'Before activating the Scroll glyph, touch Water first; once both are set, finish with Sun.',
        th: 'ก่อนเปิดใช้งานสัญลักษณ์ Scroll ให้แตะ Water ก่อน และเมื่อครบสองตัวแรกแล้วจึงปิดท้ายด้วย Sun',
      },
      spokenEnglish:
        'Before activating the Scroll glyph, touch Water first; once both are set, finish with Sun.',
      requiresOrder: true,
      expectedSequence: ['water', 'scroll', 'sun'],
      forbiddenSymbols: [],
      hints: {
        tier1Vocab: {
          en: '"Before X, touch Y first" places Y in position 1 and X in position 2.',
          th: '"Before Scroll, touch Water first" แปลว่า Water มาก่อน Scroll',
        },
        tier2Clue: {
          en: 'Expected 3-glyph code: Water -> Scroll -> Sun.',
          th: 'ลำดับ 3 สัญลักษณ์: Water -> Scroll -> Sun',
        },
        tier3Scaffold: {
          en: 'Tap Reset if out of order, then pick Water, Scroll, Sun.',
          th: 'เรียงให้เป็น Water -> Scroll -> Sun แล้วกดตรวจ',
        },
      },
      successNote: {
        en: 'Clean "Before / Once" decoding on the tablet!',
        th: 'ตีความ "Before / Once" บนศิลาจำลองได้แม่นยำมาก!',
      },
    },
  },
  {
    id: 'pc_2_negative_filter',
    title: { en: 'Seal 2 · Negative Symbol Rule', th: 'รหัสที่ 2 · กฎต้องห้าม' },
    a2: {
      instruction: {
        en: 'Select the Lotus and the Star symbols, and do NOT touch the Pyramid symbol.',
        th: 'เลือกสัญลักษณ์ Lotus (ดอกบัว) และ Star (ดวงดาว) แต่ห้ามแตะ Pyramid (พีระมิด)',
      },
      spokenEnglish:
        'Select the Lotus and the Star symbols, and do not touch the Pyramid symbol.',
      requiresOrder: false,
      expectedSequence: ['lotus', 'star'],
      forbiddenSymbols: ['pyramid'],
      hints: {
        tier1Vocab: {
          en: '"do NOT touch Pyramid" means avoid Pyramid completely.',
          th: '"do NOT touch Pyramid" แปลว่าห้ามเลือก Pyramid ลงบนศิลา',
        },
        tier2Clue: {
          en: 'Select only Lotus and Star (any order).',
          th: 'เลือกเฉพาะ Lotus และ Star (สลับลำดับได้)',
        },
        tier3Scaffold: {
          en: 'Slots should contain only Lotus and Star.',
          th: 'ใส่เพียง 2 สัญลักษณ์คือ Lotus และ Star',
        },
      },
      successNote: {
        en: 'Trap avoided! Only the permitted symbols were entered.',
        th: 'หลีกเลี่ยงกับดักได้สำเร็จ! ใส่เฉพาะสัญลักษณ์ที่อนุญาต',
      },
    },
    b1: {
      instruction: {
        en: 'Choose Scroll and Lotus for the archive seal, making sure neither Pyramid nor Sun appears in your sequence.',
        th: 'เลือก Scroll และ Lotus สำหรับตรารหัส โดยต้องไม่มีทั้ง Pyramid และ Sun อยู่ในชุดรหัสเลย',
      },
      spokenEnglish:
        'Choose Scroll and Lotus for the archive seal, making sure neither Pyramid nor Sun appears in your sequence.',
      requiresOrder: false,
      expectedSequence: ['scroll', 'lotus'],
      forbiddenSymbols: ['pyramid', 'sun'],
      hints: {
        tier1Vocab: {
          en: '"neither A nor B" excludes both Pyramid and Sun.',
          th: '"neither A nor B" แปลว่าห้ามเลือกทั้ง Pyramid และ Sun',
        },
        tier2Clue: {
          en: 'Select Scroll and Lotus only.',
          th: 'เลือกเพียง Scroll และ Lotus เท่านั้น',
        },
        tier3Scaffold: {
          en: 'Keep only Scroll and Lotus in the tablet slots.',
          th: 'มีแค่ Scroll และ Lotus บนแท่นรหัส',
        },
      },
      successNote: {
        en: 'Negative filters cleared cleanly!',
        th: 'กรองเงื่อนไขต้องห้ามทั้งสองอย่างได้อย่างแม่นยำ!',
      },
    },
  },
  {
    id: 'pc_3_conditional_glow',
    title: { en: 'Seal 3 · Conditional Tablet Cue', th: 'รหัสที่ 3 · เงื่อนไขแสงสัญลักษณ์' },
    a2: {
      instruction: {
        en: 'Look at the glowing indicator above the board: If the Sun badge is glowing gold, place Water BEFORE Lotus.',
        th: 'ดูป้ายเรืองแสงด้านบนกระดาน: หากป้าย Sun (ดวงอาทิตย์) กำลังเรืองแสงสีทอง ให้วาง Water ไว้ก่อนหน้า Lotus',
      },
      spokenEnglish:
        'If the Sun badge is glowing gold, place Water before Lotus.',
      litHintSymbol: 'sun',
      requiresOrder: true,
      expectedSequence: ['water', 'lotus'],
      forbiddenSymbols: ['sun'],
      hints: {
        tier1Vocab: {
          en: 'Check the indicator pill above the tablet: Sun IS glowing!',
          th: 'ดูป้ายสถานะด้านบนกระดาน: สัญลักษณ์ Sun กำลังเรืองแสงอยู่!',
        },
        tier2Clue: {
          en: 'Since Sun is glowing, enter [Water] -> [Lotus] (do not add Sun unless asked).',
          th: 'เมื่อเงื่อนไขเป็นจริง ให้กด [Water] ก่อนแล้วตามด้วย [Lotus]',
        },
        tier3Scaffold: {
          en: 'Expected sequence: Water -> Lotus.',
          th: 'ลำดับบนศิลา: Water -> Lotus',
        },
      },
      successNote: {
        en: 'Conditional signal read accurately! Notice how board state controls symbol order.',
        th: 'อ่านสัญญาณเงื่อนไขได้ถูกต้อง! สังเกตจากไฟสถานะด้านบนกระดาน',
      },
    },
    b1: {
      instruction: {
        en: 'Check the active beacon above: Provided that the Star indicator is lit, activate Scroll first, then Lotus, and place Pyramid only if Water stays unselected.',
        th: 'ดูไฟสัญญาณด้านบน: หาก Star กำลังสว่างอยู่ ให้เปิด Scroll ก่อน ตามด้วย Lotus และใส่ Pyramid เป็นตัวที่สาม (ห้ามเลือก Water)',
      },
      spokenEnglish:
        'Provided that the Star indicator is lit, activate Scroll first, then Lotus, and place Pyramid only if Water stays unselected.',
      litHintSymbol: 'star',
      requiresOrder: true,
      expectedSequence: ['scroll', 'lotus', 'pyramid'],
      forbiddenSymbols: ['water'],
      hints: {
        tier1Vocab: {
          en: '"Provided that" means "If" — and Star IS lit above the board!',
          th: '"Provided that" มีความหมายเหมือน "If" — และไฟ Star ด้านบนสว่างอยู่!',
        },
        tier2Clue: {
          en: 'Sequence: Scroll -> Lotus -> Pyramid (leave Water out).',
          th: 'ลำดับ: Scroll -> Lotus -> Pyramid (ห้ามใส่ Water)',
        },
        tier3Scaffold: {
          en: 'Tap Scroll, then Lotus, then Pyramid.',
          th: 'กด Scroll -> Lotus -> Pyramid',
        },
      },
      successNote: {
        en: 'Excellent B1 conditional ("Provided that") execution!',
        th: 'ถอดรหัสเงื่อนไขระดับ B1 ("Provided that") ได้ยอดเยี่ยม!',
      },
    },
  },
  {
    id: 'pc_4_three_step_chain',
    title: { en: 'Seal 4 · Three-Step Tablet Chain', th: 'รหัสที่ 4 · ลำดับสามขั้นตอน' },
    a2: {
      instruction: {
        en: 'Follow three steps: First activate Scroll, next touch Sun, and finally touch Star.',
        th: 'ทำตาม 3 ขั้น: First (แรก) กด Scroll, next (ถัดมา) กด Sun, และ finally (สุดท้าย) กด Star',
      },
      spokenEnglish:
        'First activate Scroll, next touch Sun, and finally touch Star.',
      requiresOrder: true,
      expectedSequence: ['scroll', 'sun', 'star'],
      forbiddenSymbols: [],
      hints: {
        tier1Vocab: {
          en: 'First -> Next -> Finally.',
          th: 'เรียงตาม First -> Next -> Finally',
        },
        tier2Clue: {
          en: '1. Scroll · 2. Sun · 3. Star.',
          th: '1. Scroll · 2. Sun · 3. Star',
        },
        tier3Scaffold: {
          en: 'Place Scroll, Sun, and Star in exact 1-2-3 order.',
          th: 'เรียง Scroll -> Sun -> Star ตามลำดับ 1-2-3',
        },
      },
      successNote: {
        en: 'Three chimes unlocked in unison!',
        th: 'ปลดล็อกเสียงระฆังสัญลักษณ์ทั้ง 3 ขั้นสำเร็จ!',
      },
    },
    b1: {
      instruction: {
        en: 'Build a 3-glyph key: place Star right between Pyramid (first) and Water (last), ensuring Lotus is omitted.',
        th: 'สร้างรหัส 3 ตัว: วาง Star ไว้ตรงกลางระหว่าง Pyramid (ตัวแรก) และ Water (ตัวสุดท้าย) โดยห้ามใส่ Lotus',
      },
      spokenEnglish:
        'Build a three-glyph key: place Star right between Pyramid first and Water last, ensuring Lotus is omitted.',
      requiresOrder: true,
      expectedSequence: ['pyramid', 'star', 'water'],
      forbiddenSymbols: ['lotus'],
      hints: {
        tier1Vocab: {
          en: '"between Pyramid (first) and Water (last)" gives 1. Pyramid, 2. Star, 3. Water.',
          th: '"between Pyramid (first) and Water (last)" = 1. Pyramid, 2. Star, 3. Water',
        },
        tier2Clue: {
          en: '"omitted" means left out — do NOT tap Lotus.',
          th: '"omitted" แปลว่า ตัดออก — ห้ามกด Lotus',
        },
        tier3Scaffold: {
          en: 'Code: Pyramid -> Star -> Water.',
          th: 'รหัส: Pyramid -> Star -> Water',
        },
      },
      successNote: {
        en: 'Exact spatial phrasing ("between") & omission rule cleared!',
        th: 'เข้าใจคำบอกตำแหน่ง ("between") และข้อห้ามได้ครบถ้วน!',
      },
    },
  },
  {
    id: 'pc_5_exclusion_order',
    title: { en: 'Seal 5 · Order Without the Forbidden', th: 'รหัสที่ 5 · เรียงลำดับพร้อมเว้นตัวห้าม' },
    a2: {
      instruction: {
        en: 'Touch Pyramid first, Lotus second, and Water third—do NOT touch Sun!',
        th: 'กด Pyramid เป็นอันที่ 1, Lotus อันที่ 2, และ Water อันที่ 3 — ห้ามกด Sun!',
      },
      spokenEnglish:
        'Touch Pyramid first, Lotus second, and Water third—do not touch Sun.',
      requiresOrder: true,
      expectedSequence: ['pyramid', 'lotus', 'water'],
      forbiddenSymbols: ['sun'],
      hints: {
        tier1Vocab: {
          en: '1st Pyramid -> 2nd Lotus -> 3rd Water (never Sun).',
          th: '1. Pyramid -> 2. Lotus -> 3. Water (ห้ามใส่ Sun)',
        },
        tier2Clue: {
          en: 'Tap Sun in the tray to remove it if you pressed it by accident.',
          th: 'หากเผลอกด Sun ให้แตะเพื่อนำออก',
        },
        tier3Scaffold: {
          en: 'Exact slots: Pyramid -> Lotus -> Water.',
          th: 'ลำดับ: Pyramid -> Lotus -> Water',
        },
      },
      successNote: {
        en: 'Almost to the master seal! One final integrated puzzle remains.',
        th: 'ใกล้ถึงรหัสสุดท้ายแล้ว! เหลือปริศนาบูรณาการอีกเพียงข้อเดียว',
      },
    },
    b1: {
      instruction: {
        en: 'Enter Star second only after placing Sun first, then close with Scroll—and avoid touching Pyramid or Lotus.',
        th: 'กด Star เป็นลำดับสองต่อจาก Sun ในลำดับแรก แล้วปิดท้ายด้วย Scroll — ห้ามแตะ Pyramid หรือ Lotus',
      },
      spokenEnglish:
        'Enter Star second only after placing Sun first, then close with Scroll—and avoid touching Pyramid or Lotus.',
      requiresOrder: true,
      expectedSequence: ['sun', 'star', 'scroll'],
      forbiddenSymbols: ['pyramid', 'lotus'],
      hints: {
        tier1Vocab: {
          en: '1st: Sun · 2nd: Star · 3rd: Scroll.',
          th: 'ลำดับ 1: Sun · ลำดับ 2: Star · ลำดับ 3: Scroll',
        },
        tier2Clue: {
          en: 'Exclude both Pyramid and Lotus.',
          th: 'เว้นทั้ง Pyramid และ Lotus ไว้',
        },
        tier3Scaffold: {
          en: 'Expected code: Sun -> Star -> Scroll.',
          th: 'รหัสที่ถูกต้อง: Sun -> Star -> Scroll',
        },
      },
      successNote: {
        en: 'Precision execution! Ready for the Grand Synthesis Code.',
        th: 'แม่นยำมาก! พร้อมสำหรับด่านสุดท้ายแล้ว',
      },
    },
  },
  {
    id: 'pc_6_grand_integration',
    title: { en: 'Seal 6 · Grand DISCOVER Integration', th: 'รหัสที่ 6 · บูรณาการทั้ง 4 ด่าน' },
    a2: {
      instruction: {
        en: 'Combine every DISCOVER skill: First pack Water (camp hydration), next tap Pyramid (plaza landmark), then add Scroll (scribe order), and finally touch Lotus—and remember, never touch Star when Sun is unlit!',
        th: 'รวมทักษะทั้ง 4 ด่าน: First แตะ Water (น้ำดื่มค่าย), next แตะ Pyramid (พีระมิด), then แตะ Scroll (ม้วนสาร), และ finally แตะ Lotus — และอย่าแตะ Star เมื่อไฟ Sun ไม่ติด!',
      },
      spokenEnglish:
        'Combine every skill: First touch Water, next touch Pyramid, then touch Scroll, and finally touch Lotus—and never touch Star.',
      requiresOrder: true,
      expectedSequence: ['water', 'pyramid', 'scroll', 'lotus'],
      forbiddenSymbols: ['star'],
      hints: {
        tier1Vocab: {
          en: 'Notice all 4 connectors: First -> Next -> Then -> Finally, plus "never touch Star".',
          th: 'สังเกตทั้ง 4 คำบอกลำดับและข้อห้าม "never touch Star"',
        },
        tier2Clue: {
          en: '4-glyph sequence: 1. Water (Camp) -> 2. Pyramid (Plaza) -> 3. Scroll (Scribe) -> 4. Lotus (Temple).',
          th: 'ลำดับ 4 ตัว: 1. Water -> 2. Pyramid -> 3. Scroll -> 4. Lotus',
        },
        tier3Scaffold: {
          en: 'Tap Water -> Pyramid -> Scroll -> Lotus (no Star!).',
          th: 'กดเรียง: Water -> Pyramid -> Scroll -> Lotus',
        },
      },
      successNote: {
        en: 'Stage 1 DISCOVER Mastered! You unified camp essentials, directions, sequencing, and guardian rules!',
        th: 'พิชิตด่านที่ 1 DISCOVER สำเร็จสมบูรณ์! คุณรวมทุกทักษะคำสั่งภาษาอังกฤษเข้าด้วยกันได้ยอดเยี่ยม!',
      },
    },
    b1: {
      instruction: {
        en: 'Final Synthesis: Provided that the Sun beacon above IS glowing, unlock the archive seal by placing Lotus AFTER Pyramid and BEFORE Scroll, starting with Sun itself—and never select Star.',
        th: 'รหัสบูรณาการสุดท้าย: เนื่องจากสัญญาณ Sun ด้านบนกำลังสว่างอยู่ ให้เริ่มรหัสด้วย Sun ก่อน แล้ววาง Lotus ไว้หลัง Pyramid และก่อนหน้า Scroll — โดยห้ามเลือก Star เด็ดขาด',
      },
      spokenEnglish:
        'Final synthesis: Provided that the Sun beacon above is glowing, start with Sun itself, then place Lotus after Pyramid and before Scroll—and never select Star.',
      litHintSymbol: 'sun',
      requiresOrder: true,
      expectedSequence: ['sun', 'pyramid', 'lotus', 'scroll'],
      forbiddenSymbols: ['star'],
      hints: {
        tier1Vocab: {
          en: '"starting with Sun" = #1. "Lotus AFTER Pyramid and BEFORE Scroll" = Pyramid -> Lotus -> Scroll.',
          th: '"starting with Sun" = ตัวแรก และ "Lotus หลัง Pyramid แต่ก่อน Scroll" = Pyramid -> Lotus -> Scroll',
        },
        tier2Clue: {
          en: 'Full 4-symbol order: Sun -> Pyramid -> Lotus -> Scroll.',
          th: 'ลำดับ 4 ตัวเต็ม: Sun -> Pyramid -> Lotus -> Scroll',
        },
        tier3Scaffold: {
          en: 'Tap Sun -> Pyramid -> Lotus -> Scroll, leaving Star and Water out.',
          th: 'กด Sun -> Pyramid -> Lotus -> Scroll (ห้ามกด Star)',
        },
      },
      successNote: {
        en: 'Master Archaeologist Seal Unlocked! You decoded B1 conditionals, order dependencies, and exclusions seamlessly.',
        th: 'ปลดล็อกตรานักโบราณคดีระดับปรมาจารย์! คุณเข้าใจเงื่อนไข ลำดับ และข้อห้ามระดับ B1 อย่างสมบูรณ์',
      },
    },
  },
];

export function validatePharaohCodeSubmission(
  variant: PharaohCodeVariant,
  selectedIds: FictionalGlyphId[],
): { isCorrect: boolean; reason: LocalizedText } {
  const forbiddenHit = selectedIds.find((id) => variant.forbiddenSymbols.includes(id));
  if (forbiddenHit) {
    return {
      isCorrect: false,
      reason: {
        en: `Caution! The rule warns against selecting "${FICTIONAL_TABLET_GLYPHS[forbiddenHit].label.en}". Tap it in the tablet tray to remove it.`,
        th: `ระวัง! คำสั่งห้ามเลือกสัญลักษณ์ "${FICTIONAL_TABLET_GLYPHS[forbiddenHit].label.th}" ให้แตะเพื่อนำออก`,
      },
    };
  }

  if (variant.requiresOrder) {
    if (selectedIds.length !== variant.expectedSequence.length) {
      return {
        isCorrect: false,
        reason: {
          en: `Enter ${variant.expectedSequence.length} symbols on the tablet before checking (currently ${selectedIds.length}).`,
          th: `วางสัญลักษณ์ให้ครบ ${variant.expectedSequence.length} ช่องก่อนตรวจสอบ (ตอนนี้มี ${selectedIds.length} ช่อง)`,
        },
      };
    }
    const orderMatches = variant.expectedSequence.every((id, idx) => selectedIds[idx] === id);
    if (!orderMatches) {
      return {
        isCorrect: false,
        reason: {
          en: 'Right count, wrong symbol order! Re-read "First / Next / Before / After / Between" carefully.',
          th: 'จำนวนถูกต้องแล้ว แต่ลำดับสัญลักษณ์ยังไม่ตรงคำสั่ง ลองเช็กคำบอกลำดับอีกครั้งนะ',
        },
      };
    }
    return { isCorrect: true, reason: variant.successNote };
  }

  const uniqueSelected = Array.from(new Set(selectedIds));
  const missing = variant.expectedSequence.filter((id) => !uniqueSelected.includes(id));
  const extra = uniqueSelected.filter((id) => !variant.expectedSequence.includes(id));
  if (missing.length > 0 || extra.length > 0) {
    return {
      isCorrect: false,
      reason: {
        en: `Select only the ${variant.expectedSequence.length} requested symbol(s) without adding extra glyphs.`,
        th: `เลือกเฉพาะสัญลักษณ์ที่สั่งทั้ง ${variant.expectedSequence.length} ตัวโดยไม่ใส่ตัวเกิน`,
      },
    };
  }

  return { isCorrect: true, reason: variant.successNote };
}
