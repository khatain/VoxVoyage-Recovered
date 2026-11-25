import type { LocalizedText } from '../types/game';
import {
  SCOTLAND_LANDMARKS,
  SCOTLAND_STAGE_ACTIVITY_IDS,
  type ScotlandLandmarkId,
} from './scotlandWorld';
import type { ScotlandDifficultyMode } from './scotlandDiscovery';

export const SCOTLAND_BUILD_ACTIVITY_ID = SCOTLAND_STAGE_ACTIVITY_IDS.build;
export const SCOTLAND_BUILD_XP_REWARD = 50;

export type ScotlandBuildMechanicId =
  | 'both_worlds_bridge'
  | 'similarity_forge'
  | 'food_contrast_kitchen'
  | 'festival_comparison'
  | 'master_comparison_compass';

export type ComparisonConnector =
  | 'Both ... and ...'
  | 'similar to'
  | 'different from'
  | 'while'
  | 'whereas'
  | 'unlike';

export interface ScotlandBuildEvidenceCard {
  id: string;
  side: 'scotland' | 'thailand' | 'both' | 'stereotype';
  title: LocalizedText;
  detail: LocalizedText;
  feedback: LocalizedText;
}

export interface ScotlandBuildTile {
  id: string;
  text: string;
  a2OrderHint?: number;
}

export interface ScotlandBuildAttributeItem {
  id: string;
  label: LocalizedText;
  targetBucket: 'similar_to' | 'different_from';
  explanation: Record<'similar_to' | 'different_from', LocalizedText>;
}

export interface ScotlandBuildFestivalCard {
  id: string;
  label: LocalizedText;
  targetZone: 'scotland' | 'both' | 'thailand';
  feedback: Record<'scotland' | 'both' | 'thailand', LocalizedText>;
}

export interface ScotlandBuildSentenceOption {
  id: string;
  kind: 'similarity' | 'difference';
  connector: ComparisonConnector;
  exampleTopic: string;
  sentence: string;
  thTranslation: string;
}

export interface ScotlandBuildStationSpec {
  id: ScotlandLandmarkId;
  order: number;
  landmarkTitle: LocalizedText;
  gameTitle: LocalizedText;
  mechanicId: ScotlandBuildMechanicId;
  grammarFocus: string[];
  promptA2: LocalizedText;
  promptB1: LocalizedText;
  hint: LocalizedText;
  modelSentence: string;
  modelTranslationTh: string;
}

export const EILIDH_BUILD_DIALOGUE = {
  beforeStart: {
    en: "Brilliant job completing DISCOVER! Now let's start Stage 2: BUILD — Comparison Crafting Quest. Visit all five Highland spots to craft clear Scotland–Thailand comparisons using 'Both ... and ...', 'similar to', 'different from', 'while', 'whereas', and 'unlike'!",
    th: 'เก่งมากที่ผ่านด่าน DISCOVER ครบแล้ว! ตอนนี้มาเริ่มด่านที่ 2: BUILD — ภารกิจสร้างประโยคเปรียบเทียบกันเถอะ แวะทั้ง 5 จุดเพื่อฝึกใช้คำเชื่อมเปรียบเทียบไทย-สกอตแลนด์กัน!',
  },
  inProgress: (doneCount: number, totalCount: number): LocalizedText => ({
    en: `You have crafted ${doneCount} of ${totalCount} Highland comparison statements! Check your Cultural Explorer Journal anytime and visit the remaining spots.`,
    th: `คุณสร้างประโยคเปรียบเทียบแล้ว ${doneCount} จาก ${totalCount} จุด! เปิดดูหลักฐานในสมุดนักสำรวจได้ตลอด และไปลุยจุดที่เหลือต่อเลย`,
  }),
  completed: {
    en: 'Fantastic! You crafted all five Scotland–Thailand comparison statements (+50 XP) and unlocked Stage 3: PRACTICE! Remember, hints and retries never cost XP.',
    th: 'ยอดเยี่ยมมาก! คุณสร้างประโยคเปรียบเทียบไทย-สกอตแลนด์ครบทั้ง 5 จุดแล้ว (+50 XP) และปลดล็อกด่านที่ 3: PRACTICE เรียบร้อย!',
  },
  accuracyTip: {
    en: 'Great comparisons celebrate real daily life alongside heritage—never reduce any country to a single old stereotype!',
    th: 'การเปรียบเทียบวัฒนธรรมที่ดีควรอิงหลักฐานจริงทั้งวิถีชีวิตปัจจุบันและประเพณีดั้งเดิม โดยไม่เหมารวมแบบผิด ๆ',
  },
};

export const FIONA_BUILD_DIALOGUE = {
  coachTip: {
    en: "Grammar compass tip: Use 'Both ... and ...' or 'similar to' for shared values and modern routines. Use 'different from', 'while', 'whereas', or 'unlike' for climate, food, and festival contrasts!",
    th: "เคล็ดลับการเปรียบเทียบ: ใช้ 'Both ... and ...' หรือ 'similar to' เมื่อพูดถึงสิ่งที่เหมือนกัน และใช้ 'different from', 'while', 'whereas' หรือ 'unlike' เมื่อเปรียบเทียบความต่าง!",
  },
  thaiBridgeTip: {
    en: 'Each comparison works best when you name a real example from Scotland (like tartan wool or oatcakes) and a real example from Thailand (like Kalasin Praewa silk or jasmine rice).',
    th: 'ประโยคจะน่าเชื่อถือยิ่งขึ้นเมื่อยกตัวอย่างจริงของทั้งสกอตแลนด์ (เช่น ผ้าทาร์ทัน ข้าวโอ๊ต) และประเทศไทย (เช่น ผ้าไหมแพรวา ข้าวหอมมะลิ)',
  },
};

export const SCOTLAND_BUILD_STATIONS: ScotlandBuildStationSpec[] = [
  {
    id: 'highland_village_square',
    order: 1,
    landmarkTitle: SCOTLAND_LANDMARKS[0].title,
    gameTitle: {
      en: 'Game 1 · Both Worlds Bridge',
      th: 'เกมที่ 1 · สะพานเชื่อมสองโลก (Both ... and ...)',
    },
    mechanicId: 'both_worlds_bridge',
    grammarFocus: ['Both ... and ...'],
    promptA2: {
      en: 'Pick one accurate Scottish clue and one Thai clue, then assemble a "Both ... and ..." sentence.',
      th: 'เลือกหลักฐานจริงของสกอตแลนด์ 1 ใบ และไทย 1 ใบ จากนั้นเรียงคำสร้างประโยค "Both ... and ..."',
    },
    promptB1: {
      en: 'Filter out stereotypes, select paired village evidence, and craft a fluent "Both ... and ..." bridge sentence.',
      th: 'คัดกรองความเชื่อผิด ๆ เลือกหลักฐานวิถีหมู่บ้านที่สอดคล้องกัน แล้วสร้างประโยคเชื่อมด้วย "Both ... and ..."',
    },
    hint: {
      en: 'Reject exaggerated claims without modern life. Start your bridge sentence with "Both", connect the two countries with "and", and highlight shared community life.',
      th: 'หลีกเลี่ยงการ์ดที่บอกว่าไม่มีชีวิตสมัยใหม่ จากนั้นขึ้นต้นประโยคด้วย "Both" และเชื่อมสองประเทศด้วย "and"',
    },
    modelSentence: 'Both Scotland and Thailand blend historic heritage with modern daily life.',
    modelTranslationTh: 'ทั้งสกอตแลนด์และประเทศไทยต่างผสานมรดกทางประวัติศาสตร์เข้ากับชีวิตประจำวันยุคใหม่',
  },
  {
    id: 'tartan_heritage_workshop',
    order: 2,
    landmarkTitle: SCOTLAND_LANDMARKS[1].title,
    gameTitle: {
      en: 'Game 2 · Similarity Forge',
      th: 'เกมที่ 2 · โรงหลอมความเหมือนและต่าง (similar to / different from)',
    },
    mechanicId: 'similarity_forge',
    grammarFocus: ['similar to', 'different from'],
    promptA2: {
      en: 'Sort what tartan wool and Kalasin Praewa silk share versus how they differ, then forge a comparison sentence.',
      th: 'จัดกลุ่มสิ่งที่ผ้าทาร์ทันและผ้าไหมแพรวาเหมือนกันกับสิ่งที่ต่างกัน แล้วประกอบประโยคเปรียบเทียบ',
    },
    promptB1: {
      en: 'Classify textile attributes accurately, choose either "similar to" or "different from", and construct a full statement.',
      th: 'จำแนกคุณลักษณะของสิ่งทอ เลือกโครงสร้าง "similar to" หรือ "different from" แล้วสร้างประโยคให้สมบูรณ์',
    },
    hint: {
      en: 'Shared cultural pride and ceremonial wear go in "similar to"; cool Highland wool vs. breathable tropical silk go in "different from".',
      th: 'ความภาคภูมิใจและโอกาสพิธีสำคัญจัดอยู่ใน "similar to" ส่วนขนสัตว์เมืองหนาวกับไหมเขตร้อนจัดอยู่ใน "different from"',
    },
    modelSentence:
      'Scottish tartan weaving is similar to Thai Praewa silk in celebrating regional heritage.',
    modelTranslationTh:
      'การทอผ้าทาร์ทันของสกอตแลนด์มีความคล้ายกับผ้าไหมแพรวาของไทยในด้านการเชิดชูมรดกท้องถิ่น',
  },
  {
    id: 'highland_food_market',
    order: 3,
    landmarkTitle: SCOTLAND_LANDMARKS[2].title,
    gameTitle: {
      en: 'Game 3 · Food Contrast Kitchen',
      th: 'เกมที่ 3 · ครัวเปรียบเทียบรสชาติ (while / whereas)',
    },
    mechanicId: 'food_contrast_kitchen',
    grammarFocus: ['while', 'whereas'],
    promptA2: {
      en: 'Choose authentic Scottish & Thai culinary evidence (skip stereotypes!) and join them with "while" or "whereas".',
      th: 'เลือกหลักฐานอาหารสกอตและไทยที่ถูกต้อง (ระวังคำลวงเหมารวม!) แล้วเชื่อมด้วย "while" หรือ "whereas"',
    },
    promptB1: {
      en: 'Investigate food clues across climates, reject myths, and assemble a balanced contrast sentence using "while" or "whereas".',
      th: 'ตรวจสอบหลักฐานอาหารตามภูมิอากาศ ตัดคำกล่าวอ้างผิด ๆ แล้วสร้างประโยคเปรียบต่างด้วย "while" หรือ "whereas"',
    },
    hint: {
      en: 'Oats, berries, and modern varied kitchens are authentic in Scotland; jasmine rice and herbs flourish in Thailand. Join the two clauses with ", while" or ", whereas".',
      th: 'ข้าวโอ๊ตและเบอร์รีเหมาะกับอากาศเย็นของสกอตแลนด์ ส่วนข้าวหอมมะลิและสมุนไพรเหมาะกับไทย เชื่อมสองส่วนด้วย ", while" หรือ ", whereas"',
    },
    modelSentence:
      'Scottish markets feature warm oatcakes and berries, while Thai markets serve fragrant jasmine rice and herbs.',
    modelTranslationTh:
      'ตลาดสกอตแลนด์เด่นเรื่องขนมปังข้าวโอ๊ตและเบอร์รี ขณะที่ตลาดไทยอุดมด้วยข้าวหอมมะลิและสมุนไพรหอม',
  },
  {
    id: 'highland_games_ground',
    order: 4,
    landmarkTitle: SCOTLAND_LANDMARKS[3].title,
    gameTitle: {
      en: 'Game 4 · Festival Comparison Challenge',
      th: 'เกมที่ 4 · ภารกิจเทียบเทศกาล (while / unlike / whereas)',
    },
    mechanicId: 'festival_comparison',
    grammarFocus: ['while', 'unlike', 'whereas'],
    promptA2: {
      en: 'Sort festival clues into Scotland, Both, or Thailand, then craft a contrast sentence with "unlike", "while", or "whereas".',
      th: 'จัดหมวดหมู่เบาะแสเทศกาลลงใน สกอตแลนด์ ทั้งสองประเทศ หรือไทย แล้วสร้างประโยคเปรียบเทียบ',
    },
    promptB1: {
      en: 'Distinguish shared celebration spirit from seasonal traditions and assemble a contrasting festival comparison.',
      th: 'แยกแยะความสามัคคีที่คล้ายกันออกจากประเพณีตามฤดูกาลที่ต่างกัน แล้วประกอบประโยคเปรียบต่างให้แม่นยำ',
    },
    hint: {
      en: 'Both cultures gather communities joyfully outdoors! Start with "Unlike ..." for upfront contrast or use ", while" / ", whereas" between two full clauses.',
      th: 'ทั้งสองวัฒนธรรมมีงานชุมนุมกลางแจ้งที่สนุกสนานเหมือนกัน แต่ต่างกันที่กิจกรรมและฤดูกาล ลองใช้ "Unlike ...", ", while" หรือ ", whereas"',
    },
    modelSentence:
      'Unlike Songkran water celebrations in April, Scottish Highland Games feature bagpipes and summer athletics.',
    modelTranslationTh:
      'ต่างจากการเล่นน้ำเทศกาลสงกรานต์ในเดือนเมษายน เทศกาลไฮแลนด์เกมส์มีดนตรีปี่สกอตและการแข่งขันพื้นบ้านช่วงฤดูร้อน',
  },
  {
    id: 'lochside_castle_viewpoint',
    order: 5,
    landmarkTitle: SCOTLAND_LANDMARKS[4].title,
    gameTitle: {
      en: 'Game 5 · Master Comparison Compass',
      th: 'เกมที่ 5 · เข็มทิศนักเปรียบเทียบขั้นสูง',
    },
    mechanicId: 'master_comparison_compass',
    grammarFocus: [
      'Both ... and ...',
      'similar to',
      'different from',
      'while',
      'whereas',
      'unlike',
    ],
    promptA2: {
      en: 'Use your Journal evidence to combine 1 similarity + 1 difference + 1 specific cultural example.',
      th: 'ใช้หลักฐานจากสมุดนักสำรวจเพื่อรวม ความเหมือน 1 ข้อ + ความต่าง 1 ข้อ + ตัวอย่างวัฒนธรรมเฉพาะเจาะจง',
    },
    promptB1: {
      en: 'Synthesize Journal evidence into an original or modular comparison with >=1 similarity, >=1 difference, and specific examples.',
      th: 'สังเคราะห์ข้อมูลจากสมุดนักสำรวจให้ครบ ความเหมือน ความต่าง และตัวอย่างเฉพาะของทั้งสกอตแลนด์และไทย',
    },
    hint: {
      en: 'Your Master Comparison passes as long as it includes: (1) one similarity marker (Both...and / similar to), (2) one contrast marker (different from / while / whereas / unlike), and (3) concrete Scotland + Thailand examples.',
      th: 'เงื่อนไขผ่านด่านคือต้องมีครบ 3 ส่วน: (1) คำเชื่อมความเหมือน (2) คำเชื่อมความต่าง และ (3) ตัวอย่างวัฒนธรรมจริงของสกอตแลนด์และไทย',
    },
    modelSentence:
      'Both Scotland and Thailand preserve proud traditions, while stone lochside castles in Scotland are different from Thailand’s golden riverside temples.',
    modelTranslationTh:
      'ทั้งสกอตแลนด์และไทยต่างอนุรักษ์ประเพณีอันน่าภาคภูมิใจ ขณะที่ปราสาทหินริมทะเลสาบในสกอตแลนด์แตกต่างจากวัดสีทองริมแม่น้ำของไทย',
  },
];

export function getScotlandBuildStation(stationId: ScotlandLandmarkId): ScotlandBuildStationSpec {
  return (
    SCOTLAND_BUILD_STATIONS.find((s) => s.id === stationId) ?? SCOTLAND_BUILD_STATIONS[0]
  );
}

// === GAME 1 DATA: BOTH WORLDS BRIDGE ===
export const GAME1_EVIDENCE_CARDS: ScotlandBuildEvidenceCard[] = [
  {
    id: 'g1_scotland_village',
    side: 'scotland',
    title: {
      en: 'Granite Square & Modern Cafes',
      th: 'จัตุรัสหินแกรนิตและร้านกาแฟยุคใหม่',
    },
    detail: {
      en: 'Highland villages combine historic stone cottages with modern schools, shops, and community noticeboards.',
      th: 'หมู่บ้านไฮแลนด์ผสานบ้านหินเก่าเข้ากับโรงเรียน ร้านค้า และกระดานข่าวสารชุมชนยุคปัจจุบัน',
    },
    feedback: {
      en: 'Authentic Scottish evidence selected! Old stone buildings and modern daily life coexist here.',
      th: 'เยี่ยม! นี่คือหลักฐานจริงของสกอตแลนด์ที่อาคารเก่าแก่และชีวิตประจำวันสมัยใหม่อยู่ร่วมกัน',
    },
  },
  {
    id: 'g1_thailand_square',
    side: 'thailand',
    title: {
      en: 'Thai Town Plazas & Wat Courtyards',
      th: 'ลานชุมชนและลานวัดไทย',
    },
    detail: {
      en: 'Thai towns also blend historic temples and neighborhood markets with modern cafes, schools, and shared community spaces.',
      th: 'ชุมชนไทยก็ผสานวัดวาอารามและตลาดท้องถิ่นเข้ากับร้านกาแฟ โรงเรียน และพื้นที่พบปะสมัยใหม่เช่นกัน',
    },
    feedback: {
      en: 'Authentic Thai evidence selected! Both communities share living public squares.',
      th: 'ถูกต้อง! ชุมชนไทยก็มีพื้นที่ส่วนกลางที่เชื่อมโยงผู้คนในลักษณะคล้ายคลึงกัน',
    },
  },
  {
    id: 'g1_stereotype_no_tech',
    side: 'stereotype',
    title: {
      en: 'Villagers Only Ride Horses Without Shops',
      th: 'ชาวบ้านขี่ม้าอย่างเดียวและไม่มีร้านค้าสมัยใหม่',
    },
    detail: {
      en: 'Claims Scottish Highland towns have no modern cafes, buses, or everyday routines.',
      th: 'อ้างว่าเมืองในไฮแลนด์ไม่มีร้านกาแฟ รถโดยสาร หรือกิจวัตรยุคใหม่',
    },
    feedback: {
      en: 'Careful—that is a stereotype! Look closely at the Village Square evidence: Scotland has modern shops and routines alongside old granite buildings.',
      th: 'ระวังคำลวง! นั่นเป็นการเหมารวมแบบผิด ๆ ในสกอตแลนด์มีร้านค้าและชีวิตยุคใหม่เคียงข้างอาคารหินโบราณ',
    },
  },
  {
    id: 'g1_stereotype_isolated',
    side: 'stereotype',
    title: {
      en: 'Communities Never Share Public Spaces',
      th: 'ชุมชนไม่เคยมีพื้นที่พบปะส่วนกลาง',
    },
    detail: {
      en: 'Claims people in Scotland and Thailand never gather in local plazas.',
      th: 'อ้างว่าผู้คนในสกอตแลนด์และไทยไม่เคยพบปะกันในลานชุมชน',
    },
    feedback: {
      en: 'Not accurate! Both Scottish village squares and Thai town/temple courtyards bring neighbors together.',
      th: 'ไม่ถูกต้อง! ทั้งจัตุรัสหมู่บ้านสกอตและลานชุมชนของไทยต่างเป็นจุดนัดพบของเพื่อนบ้าน',
    },
  },
];

export interface Game1SentencePath {
  id: string;
  tiles: ScotlandBuildTile[];
  validSentences: string[];
}

export const GAME1_SENTENCE_PATHS: Record<ScotlandDifficultyMode, Game1SentencePath> = {
  a2: {
    id: 'g1_a2',
    tiles: [
      { id: 't1', text: 'Both', a2OrderHint: 1 },
      { id: 't2', text: 'Scotland', a2OrderHint: 2 },
      { id: 't3', text: 'and', a2OrderHint: 3 },
      { id: 't4', text: 'Thailand', a2OrderHint: 4 },
      { id: 't5', text: 'blend', a2OrderHint: 5 },
      { id: 't6', text: 'old heritage', a2OrderHint: 6 },
      { id: 't7', text: 'with modern life.', a2OrderHint: 7 },
    ],
    validSentences: [
      'Both Scotland and Thailand blend old heritage with modern life.',
      'Both Thailand and Scotland blend old heritage with modern life.',
    ],
  },
  b1: {
    id: 'g1_b1',
    tiles: [
      { id: 'b1_1', text: 'Both' },
      { id: 'b1_2', text: 'Highland villages' },
      { id: 'b1_3', text: 'and' },
      { id: 'b1_4', text: 'Thai communities' },
      { id: 'b1_5', text: 'preserve' },
      { id: 'b1_6', text: 'historic gathering spaces' },
      { id: 'b1_7', text: 'within busy modern towns.' },
    ],
    validSentences: [
      'Both Highland villages and Thai communities preserve historic gathering spaces within busy modern towns.',
      'Both Thai communities and Highland villages preserve historic gathering spaces within busy modern towns.',
    ],
  },
};

export function validateGame1Sentence(
  words: string[],
  mode: ScotlandDifficultyMode,
): { valid: boolean; sentence: string; feedback: LocalizedText } {
  const joined = words.join(' ').replace(/\s+/g, ' ').trim();
  const path = GAME1_SENTENCE_PATHS[mode];
  if (path.validSentences.includes(joined)) {
    return {
      valid: true,
      sentence: joined,
      feedback: {
        en: 'Strong "Both ... and ..." bridge! You showed how both countries keep heritage alive in modern towns.',
        th: 'ยอดเยี่ยม! คุณสร้างประโยค "Both ... and ..." แสดงให้เห็นว่าทั้งสองประเทศรักษามรดกไว้ท่ามกลางชีวิตยุคใหม่',
      },
    };
  }
  if (!joined.startsWith('Both')) {
    return {
      valid: false,
      sentence: joined,
      feedback: {
        en: 'Start the similarity bridge with "Both", followed by the two places joined by "and".',
        th: 'ลองขึ้นต้นประโยคด้วย "Both" แล้วตามด้วยชื่อสองประเทศหรือสองชุมชนที่เชื่อมด้วย "and"',
      },
    };
  }
  return {
    valid: false,
    sentence: joined,
    feedback: {
      en: 'Check the verb and ending phrase so the sentence reads naturally: Both [place] and [place] [verb] [shared idea].',
      th: 'ตรวจสอบลำดับคำกริยาและส่วนขยายให้สอดคล้องกัน: Both [A] and [B] [กริยา] [ส่วนขยาย]',
    },
  };
}

// === GAME 2 DATA: SIMILARITY FORGE ===
export const GAME2_ATTRIBUTE_ITEMS: ScotlandBuildAttributeItem[] = [
  {
    id: 'attr_ceremony_pride',
    label: {
      en: 'Traditional tartan kilts and Thai Praewa silk are worn proudly at weddings and ceremonies.',
      th: 'ชุดทาร์ทันและผ้าไหมแพรวาต่างสวมใส่ด้วยความภาคภูมิใจในงานแต่งและพิธีสำคัญ',
    },
    targetBucket: 'similar_to',
    explanation: {
      similar_to: {
        en: 'Correct! Both textiles express regional identity and ceremonial pride.',
        th: 'ถูกต้อง! ผ้าทั้งสองแบบสะท้อนอัตลักษณ์ท้องถิ่นและความภาคภูมิใจในพิธีสำคัญเหมือนกัน',
      },
      different_from: {
        en: 'Look again: wearing heritage cloth for celebrations is actually a similarity between Scotland and Thailand!',
        th: 'ลองดูอีกครั้ง: การสวมผ้าพื้นเมืองในงานฉลองเป็นจุดร่วมที่เหมือนกันระหว่างสกอตแลนด์และไทย',
      },
    },
  },
  {
    id: 'attr_weekday_casual',
    label: {
      en: 'Most people in both countries wear casual modern outfits like jeans or t-shirts on ordinary weekdays.',
      th: 'ในวันธรรมดาทั่วไป ผู้คนทั้งสองประเทศมักสวมเสื้อผ้าสมัยใหม่ที่คล่องตัวเหมือนกัน',
    },
    targetBucket: 'similar_to',
    explanation: {
      similar_to: {
        en: 'Spot on! Saving formal traditional attire for special events is shared across both cultures.',
        th: 'แม่นยำ! ทั้งสองวัฒนธรรมนิยมใส่ชุดลำลองสมัยใหม่ในชีวิตประจำวันและเก็บชุดพื้นเมืองไว้ในโอกาสพิเศษ',
      },
      different_from: {
        en: 'Not quite—people in Scotland and Thailand both wear modern everyday clothes most days.',
        th: 'ยังไม่ใช่นะ ทั้งชาวสกอตและชาวไทยต่างสวมชุดสมัยใหม่ในชีวิตประจำวันเหมือนกัน',
      },
    },
  },
  {
    id: 'attr_material_climate',
    label: {
      en: 'Thick Highland tartan wool traps warmth in misty weather, whereas Thai Praewa silk stays light in tropical heat.',
      th: 'ผ้าทาร์ทันขนสัตว์หนาช่วยกันหนาวในเมืองหมอก ส่วนผ้าไหมแพรวาไทยโปร่งสบายในอากาศร้อน',
    },
    targetBucket: 'different_from',
    explanation: {
      similar_to: {
        en: 'Compare the fibers and climate: heavy wool vs. breathable silk is a clear difference!',
        th: 'สังเกตเนื้อผ้าและภูมิอากาศ: ขนสัตว์หนาเทียบกับไหมโปร่งเบาเป็นความแตกต่างที่ชัดเจน!',
      },
      different_from: {
        en: 'Correct! Climate shapes whether weavers choose warm wool or light breathable silk.',
        th: 'ถูกต้อง! ภูมิอากาศกำหนดให้เลือกเส้นใยที่ต่างกันระหว่างขนสัตว์อุ่นและไหมระบายอากาศ',
      },
    },
  },
  {
    id: 'attr_pattern_style',
    label: {
      en: 'Criss-crossing clan check stripes contrast with intricate diamond motifs hand-woven in Kalasin silk.',
      th: 'ลายตารางตัดขวางของทาร์ทันต่างจากลายเพชรอันวิจิตรของผ้าไหมแพรวากาฬสินธุ์',
    },
    targetBucket: 'different_from',
    explanation: {
      similar_to: {
        en: 'Notice the visual weaving geometry: tartan check grids differ from Praewa diamond motifs.',
        th: 'สังเกตลวดลายการทอ: ลายตารางทาร์ทันแตกต่างจากลายเพชรของผ้าไหมแพรวา',
      },
      different_from: {
        en: 'Right! Each culture developed distinct geometric patterns with its own storytelling.',
        th: 'ถูกต้อง! แต่ละวัฒนธรรมพัฒนาลวดลายเรขาคณิตที่มีเรื่องราวเฉพาะตัวต่างกัน',
      },
    },
  },
];

export interface Game2PatternChoice {
  id: string;
  mode: 'similar_to' | 'different_from';
  subject: string;
  connector: 'is similar to' | 'is different from';
  tailOptions: {
    id: string;
    text: string;
    isValidForMode: 'similar_to' | 'different_from' | 'invalid';
    feedback: LocalizedText;
  }[];
}

export const GAME2_PATTERN_CHOICES: Game2PatternChoice[] = [
  {
    id: 'g2_sim',
    mode: 'similar_to',
    subject: 'Scottish tartan weaving',
    connector: 'is similar to',
    tailOptions: [
      {
        id: 'g2_t_sim_pride',
        text: 'Thai Praewa silk because both honor local heritage at special celebrations.',
        isValidForMode: 'similar_to',
        feedback: {
          en: 'Well forged! "similar to" highlights shared cultural pride accurately.',
          th: 'เยี่ยม! โครงสร้าง "similar to" อธิบายจุดร่วมทางวัฒนธรรมได้อย่างชัดเจน',
        },
      },
      {
        id: 'g2_t_sim_daily',
        text: 'Thai woven silk because families keep formal outfits for weddings and festivals.',
        isValidForMode: 'similar_to',
        feedback: {
          en: 'Great similarity link! Both cultures treasure traditional dress for milestones.',
          th: 'ยอดเยี่ยม! แสดงความคล้ายคลึงเรื่องการสวมชุดดั้งเดิมในโอกาสพิเศษได้ถูกต้อง',
        },
      },
      {
        id: 'g2_t_sim_wrong',
        text: 'Thai Praewa silk because wool is always hotter than silk.',
        isValidForMode: 'invalid',
        feedback: {
          en: 'That states a contrast, not a similarity! Pair "is similar to" with a shared trait.',
          th: 'อันนั้นเป็นความแตกต่าง ไม่ใช่ความเหมือน! ลองเลือกส่วนท้ายที่บอกสิ่งที่เหมือนกัน',
        },
      },
    ],
  },
  {
    id: 'g2_diff',
    mode: 'different_from',
    subject: 'Thick Scottish wool tartan',
    connector: 'is different from',
    tailOptions: [
      {
        id: 'g2_t_diff_climate',
        text: 'breathable Thai Praewa silk designed for warm tropical festivals.',
        isValidForMode: 'different_from',
        feedback: {
          en: 'Clear contrast! "different from" connects material and climate accurately.',
          th: 'ชัดเจนมาก! โครงสร้าง "different from" เชื่อมโยงความต่างของเนื้อผ้าและอากาศได้ดี',
        },
      },
      {
        id: 'g2_t_diff_motif',
        text: 'Kalasin Praewa silk, which features hand-woven diamond motifs instead of tartan checks.',
        isValidForMode: 'different_from',
        feedback: {
          en: 'Spot on! Highlighting check grids vs. diamond motifs shows deep cultural observation.',
          th: 'แม่นยำ! การเทียบลายตารางกับลายเพชรแสดงถึงการสังเกตทางวัฒนธรรมอย่างลึกซึ้ง',
        },
      },
      {
        id: 'g2_t_diff_wrong',
        text: 'Thai silk because both are celebrated by families.',
        isValidForMode: 'invalid',
        feedback: {
          en: '"being celebrated by families" is a similarity—pair "is different from" with a true difference!',
          th: 'การที่ครอบครัวภาคภูมิใจเป็นจุดที่เหมือนกัน ควรเลือกส่วนท้ายที่อธิบายความแตกต่างสำหรับ "is different from"',
        },
      },
    ],
  },
];

// === GAME 3 DATA: FOOD CONTRAST KITCHEN ===
export const GAME3_FOOD_EVIDENCE_CARDS: ScotlandBuildEvidenceCard[] = [
  {
    id: 'g3_scotland_oats',
    side: 'scotland',
    title: {
      en: 'Hearty Oats, Barley & Berries',
      th: 'ข้าวโอ๊ต ข้าวบาร์เลย์ และเบอร์รีเมืองหนาว',
    },
    detail: {
      en: 'Cool Highland weather supports oats, barley, butter shortbread, and tart summer berries.',
      th: 'อากาศเย็นของไฮแลนด์เหมาะแก่การปลูกข้าวโอ๊ต ข้าวบาร์เลย์ และผลเบอร์รี รวมถึงขนมชอร์ตเบรดเนยสด',
    },
    feedback: {
      en: 'Authentic Highland ingredient clue collected!',
      th: 'เก็บหลักฐานวัตถุดิบท้องถิ่นของสกอตแลนด์สำเร็จ!',
    },
  },
  {
    id: 'g3_thailand_rice',
    side: 'thailand',
    title: {
      en: 'Fragrant Jasmine Rice & Tropical Herbs',
      th: 'ข้าวหอมมะลิและสมุนไพรเขตร้อน',
    },
    detail: {
      en: 'Warm Thai sunshine and monsoon rains nourish jasmine rice, lemongrass, chili, and mangoes.',
      th: 'แดดอุ่นและฝนเขตร้อนของไทยเอื้อต่อการปลูกข้าวหอมมะลิ ตะไคร้ พริก และมะม่วง',
    },
    feedback: {
      en: 'Authentic Thai culinary clue collected!',
      th: 'เก็บหลักฐานอาหารและวัตถุดิบของไทยสำเร็จ!',
    },
  },
  {
    id: 'g3_modern_variety',
    side: 'both',
    title: {
      en: 'Global Menus in Modern Cities',
      th: 'ความหลากหลายของอาหารยุคใหม่',
    },
    detail: {
      en: 'Today, people in both Scotland and Thailand enjoy global dishes alongside cherished local specialties.',
      th: 'ในยุคปัจจุบัน ทั้งชาวสกอตแลนด์และชาวไทยต่างรับประทานอาหารนานาชาติควบคู่กับอาหารพื้นบ้าน',
    },
    feedback: {
      en: 'Great balanced perspective—traditional markets are part of diverse modern diets!',
      th: 'มุมมองสมดุลมาก อาหารดั้งเดิมอยู่เคียงข้างอาหารสมัยใหม่ที่หลากหลาย',
    },
  },
  {
    id: 'g3_trap_only_sweets',
    side: 'stereotype',
    title: {
      en: 'Scots Eat Only Shortbread Every Meal',
      th: 'ชาวสกอตกินแต่ขนมชอร์ตเบรดทุกมื้อ',
    },
    detail: {
      en: 'Claims Scottish families never eat savory soups, grains, or modern international meals.',
      th: 'อ้างว่าชาวสกอตไม่กินซุป ธัญพืช หรืออาหารสมัยใหม่เลย',
    },
    feedback: {
      en: 'Myth spotted! Shortbread is a famous treat, not every daily meal in Scotland.',
      th: 'จับผิดคำลวงสำเร็จ! ชอร์ตเบรดเป็นขนมอบขึ้นชื่อ แต่ไม่ใช่อาหารหลักทุกมื้อของชาวสกอต',
    },
  },
  {
    id: 'g3_trap_thai_oats',
    side: 'stereotype',
    title: {
      en: 'Highland Oats Are Thailand’s Main Grain',
      th: 'ข้าวโอ๊ตเป็นธัญพืชหลักที่ปลูกในไทย',
    },
    detail: {
      en: 'Claims Thailand’s tropical climate grows cold-weather Scottish oats everywhere.',
      th: 'อ้างว่าภูมิอากาศร้อนของไทยปลูกข้าวโอ๊ตเมืองหนาวเป็นพืชหลักแทนข้าว',
    },
    feedback: {
      en: 'Climate mismatch! Thailand’s warm tropical climate thrives on rice rather than cold-weather Highland oats.',
      th: 'ไม่ตรงกับภูมิอากาศ! ประเทศไทยมีภูมิอากาศเขตร้อนที่เหมาะกับข้าวหอมมะลิมากกว่าข้าวโอ๊ตเมืองหนาว',
    },
  },
];

export interface Game3ClauseBundle {
  scottishClauses: { id: string; text: string }[];
  connectors: ('while' | 'whereas')[];
  thaiClauses: { id: string; text: string }[];
}

export const GAME3_CLAUSE_BUNDLE: Game3ClauseBundle = {
  scottishClauses: [
    {
      id: 'sc_market_oats',
      text: 'Scottish markets feature warm oatcakes and butter shortbread',
    },
    {
      id: 'sc_cool_farming',
      text: 'Cool Highland farms grow hearty oats and berries',
    },
  ],
  connectors: ['while', 'whereas'],
  thaiClauses: [
    {
      id: 'th_market_herbs',
      text: 'Thai markets burst with fragrant herbs and jasmine rice.',
    },
    {
      id: 'th_warm_farming',
      text: 'warm Thai kitchens cook with jasmine rice and fresh lemongrass.',
    },
  ],
};

// === GAME 4 DATA: FESTIVAL COMPARISON CHALLENGE ===
export const GAME4_FESTIVAL_CARDS: ScotlandBuildFestivalCard[] = [
  {
    id: 'fest_bagpipes_summer',
    label: {
      en: 'Bagpipes, fiddles, and caber tossing at summer Highland Games',
      th: 'ปี่สกอต ไวโอลินฟิดเดิล และการโยนซุงคาเบอร์ในฤดูร้อน',
    },
    targetZone: 'scotland',
    feedback: {
      scotland: {
        en: 'Spot on! Those music and athletic traditions belong to Scotland’s summer Highland Games.',
        th: 'ถูกต้อง! กิจกรรมเหล่านี้เป็นเอกลักษณ์ของเทศกาลไฮแลนด์เกมส์ในสกอตแลนด์',
      },
      both: {
        en: 'Bagpipes and caber tossing are uniquely Scottish—sort them under Scotland!',
        th: 'ปี่สกอตและการโยนซุงเป็นเอกลักษณ์เฉพาะของสกอตแลนด์',
      },
      thailand: {
        en: 'Those belong to Scottish Highland Games, not Thailand.',
        th: 'กิจกรรมเหล่านี้เป็นของเทศกาลในสกอตแลนด์ ไม่ใช่ของไทย',
      },
    },
  },
  {
    id: 'fest_shared_community',
    label: {
      en: 'Neighbors gathering outdoors with music, regional dress, and shared pride',
      th: 'ชุมชนมารวมตัวกลางแจ้ง พร้อมดนตรี การแต่งกายท้องถิ่น และความภาคภูมิใจ',
    },
    targetZone: 'both',
    feedback: {
      scotland: {
        en: 'Remember Thailand too! Community joy and outdoor music happen in both countries.',
        th: 'อย่าลืมไทยด้วย! ความสนุกสนานและงานชุมนุมกลางแจ้งเกิดขึ้นในทั้งสองประเทศ',
      },
      both: {
        en: 'Correct! Bringing generations together in celebration is shared by Scotland and Thailand.',
        th: 'ถูกต้อง! การรวมตัวของคนในชุมชนเพื่อเฉลิมฉลองเป็นจุดร่วมของทั้งสองประเทศ',
      },
      thailand: {
        en: 'Scotland also celebrates together outdoors with music and regional dress—place this in Both!',
        th: 'สกอตแลนด์ก็จัดงานชุมนุมกลางแจ้งพร้อมดนตรีและชุดท้องถิ่นเช่นกัน จึงควรอยู่ในกลุ่มทั้งสองประเทศ',
      },
    },
  },
  {
    id: 'fest_songkran_loy',
    label: {
      en: 'Water blessings during Songkran and floating krathongs in warm rivers',
      th: 'การสรงน้ำอวยพรในวันสงกรานต์และลอยกระทงในแม่น้ำสายอุ่น',
    },
    targetZone: 'thailand',
    feedback: {
      scotland: {
        en: 'Songkran and Loy Krathong are cherished Thai festivals!',
        th: 'สงกรานต์และลอยกระทงเป็นเทศกาลสำคัญของประเทศไทย',
      },
      both: {
        en: 'Water blessings and floating krathongs are distinct Thai traditions—sort under Thailand.',
        th: 'สงกรานต์และลอยกระทงเป็นเอกลักษณ์เฉพาะของประเทศไทย',
      },
      thailand: {
        en: 'Correct! Songkran and Loy Krathong highlight Thailand’s warm-weather river heritage.',
        th: 'ถูกต้อง! สงกรานต์และลอยกระทงสะท้อนวัฒนธรรมสายน้ำอันอบอุ่นของไทย',
      },
    },
  },
  {
    id: 'fest_family_picnic',
    label: {
      en: 'Passing folk stories and festival foods down to younger generations',
      th: 'การถ่ายทอดเรื่องราวพื้นบ้านและอาหารเทศกาลสู่คนรุ่นใหม่',
    },
    targetZone: 'both',
    feedback: {
      scotland: {
        en: 'Thai families pass down festival foods and stories too—this belongs in Both!',
        th: 'ครอบครัวไทยก็ส่งต่อเรื่องราวและอาหารเทศกาลสู่คนรุ่นใหม่เช่นกัน จึงควรอยู่ในกลุ่มทั้งสองประเทศ',
      },
      both: {
        en: 'True! Keeping living heritage joyful for young people connects both cultures.',
        th: 'ถูกต้อง! การสืบสานวัฒนธรรมให้มีชีวิตชีวาสำหรับคนรุ่นใหม่เชื่อมโยงทั้งสองวัฒนธรรม',
      },
      thailand: {
        en: 'Highland communities do this just as warmly—this fits in Both!',
        th: 'ชุมชนไฮแลนด์ก็ส่งต่อประเพณีแก่เยาวชนเช่นเดียวกัน จึงอยู่ในกลุ่มทั้งสองประเทศ',
      },
    },
  },
];

export interface Game4SentenceFrame {
  id: string;
  connector: 'unlike' | 'while' | 'whereas';
  prefix?: string;
  clauses: {
    id: string;
    scotlandPart: string;
    thaiPart: string;
  }[];
  buildText: (scotlandPart: string, thaiPart: string) => string;
}

export const GAME4_SENTENCE_FRAMES: Game4SentenceFrame[] = [
  {
    id: 'g4_unlike',
    connector: 'unlike',
    clauses: [
      {
        id: 'g4_c_water_games',
        scotlandPart: 'Scottish Highland Games feature bagpipes and summer athletics',
        thaiPart: "Thailand's Songkran water celebrations",
      },
      {
        id: 'g4_c_lantern_fiddle',
        scotlandPart: 'Highland festivals echo with fiddles and drums on grassy fields',
        thaiPart: 'floating candlelit krathongs on Thai rivers',
      },
    ],
    buildText: (scotlandPart, thaiPart) => `Unlike ${thaiPart}, ${scotlandPart}.`,
  },
  {
    id: 'g4_while',
    connector: 'while',
    clauses: [
      {
        id: 'g4_w_games_songkran',
        scotlandPart: 'Scottish Highland Games highlight summer pipe bands and tossing events',
        thaiPart: 'Thai festivals celebrate Songkran water blessings and Loy Krathong.',
      },
      {
        id: 'g4_w_stage_river',
        scotlandPart: 'Highland gatherings take place on breezy glen fields',
        thaiPart: 'Thai celebrations often shine beside warm tropical temples and rivers.',
      },
    ],
    buildText: (scotlandPart, thaiPart) => `${scotlandPart}, while ${thaiPart}`,
  },
  {
    id: 'g4_whereas',
    connector: 'whereas',
    clauses: [
      {
        id: 'g4_wh_tartan_silk',
        scotlandPart: 'Highland competitors wear wool tartans in brisk mountain air',
        thaiPart: 'Thai festival dancers enjoy light silk in tropical evenings.',
      },
      {
        id: 'g4_wh_games_lantern',
        scotlandPart: 'Scottish Highland Games focus on daytime athletics and folk bands',
        thaiPart: 'Loy Krathong lights up riverbanks at night.',
      },
    ],
    buildText: (scotlandPart, thaiPart) => `${scotlandPart}, whereas ${thaiPart}`,
  },
];

// === GAME 5 DATA: MASTER COMPARISON COMPASS ===
export const GAME5_SIMILARITY_CARDS: ScotlandBuildSentenceOption[] = [
  {
    id: 'g5_sim_heritage_modern',
    kind: 'similarity',
    connector: 'Both ... and ...',
    exampleTopic: 'village_community',
    sentence: 'Both Scotland and Thailand honor historic traditions while living modern daily lives.',
    thTranslation: 'ทั้งสกอตแลนด์และไทยต่างให้เกียรติประเพณีเก่าแก่ควบคู่กับการใช้ชีวิตประจำวันยุคใหม่',
  },
  {
    id: 'g5_sim_textiles',
    kind: 'similarity',
    connector: 'similar to',
    exampleTopic: 'tartan_praewa',
    sentence:
      'Scottish tartan weaving is similar to Thai Kalasin Praewa silk in showing regional pride at celebrations.',
    thTranslation:
      'ผ้าทาร์ทันสกอตคล้ายกับผ้าไหมแพรวากาฬสินธุ์ในด้านการแสดงความภาคภูมิใจท้องถิ่นในงานฉลอง',
  },
  {
    id: 'g5_sim_festivals',
    kind: 'similarity',
    connector: 'Both ... and ...',
    exampleTopic: 'festivals',
    sentence:
      'Both Scottish Highland Games and Thai festivals unite neighbors outdoors with music and shared pride.',
    thTranslation:
      'ทั้งเทศกาลไฮแลนด์เกมส์และเทศกาลไทยต่างรวมชุมชนกลางแจ้งด้วยดนตรีและความภาคภูมิใจร่วมกัน',
  },
];

export const GAME5_DIFFERENCE_CARDS: ScotlandBuildSentenceOption[] = [
  {
    id: 'g5_diff_food',
    kind: 'difference',
    connector: 'while',
    exampleTopic: 'food_market',
    sentence:
      'Scottish markets feature oatcakes and berries, while Thai markets burst with jasmine rice and tropical herbs.',
    thTranslation:
      'ตลาดสกอตแลนด์เด่นเรื่องขนมปังข้าวโอ๊ตและเบอร์รี ขณะที่ตลาดไทยอุดมไปด้วยข้าวหอมมะลิและสมุนไพรเขตร้อน',
  },
  {
    id: 'g5_diff_textile',
    kind: 'difference',
    connector: 'different from',
    exampleTopic: 'tartan_climate',
    sentence:
      'Warm Highland wool kilts are different from breathable Thai silk crafted for tropical heat.',
    thTranslation: 'ผ้าทาร์ทันขนสัตว์อุ่นของไฮแลนด์ต่างจากผ้าไหมไทยที่โปร่งสบายสำหรับอากาศร้อนชื้น',
  },
  {
    id: 'g5_diff_landscape',
    kind: 'difference',
    connector: 'unlike',
    exampleTopic: 'castle_temple',
    sentence:
      'Unlike Thailand’s golden riverside temples, Scotland preserves granite castles beside cool mountain lochs.',
    thTranslation: 'ต่างจากวัดสีทองริมแม่น้ำของไทย สกอตแลนด์อนุรักษ์ปราสาทหินเคียงข้างทะเลสาบกลางหุบเขา',
  },
  {
    id: 'g5_diff_festival',
    kind: 'difference',
    connector: 'whereas',
    exampleTopic: 'games_songkran',
    sentence:
      'Highland Games spotlight bagpipes and athletics, whereas Songkran celebrates joyful water blessings in April.',
    thTranslation: 'ไฮแลนด์เกมส์เด่นเรื่องปี่สกอตและกีฬาพื้นบ้าน ส่วนสงกรานต์เฉลิมฉลองด้วยประเพณีรดน้ำเดือนเมษายน',
  },
];

export interface Game5ExampleBadge {
  id: string;
  label: LocalizedText;
  scotlandExample: string;
  thailandExample: string;
  clauseAddition: string;
}

export const GAME5_CONCRETE_EXAMPLES: Game5ExampleBadge[] = [
  {
    id: 'ex_tartan_silk',
    label: { en: 'Wool Tartan & Praewa Silk', th: 'ผ้าทาร์ทันและไหมแพรวา' },
    scotlandExample: 'tartan wool',
    thailandExample: 'Praewa silk',
    clauseAddition: 'For example, tartan wool and Kalasin Praewa silk both tell regional stories.',
  },
  {
    id: 'ex_oats_rice',
    label: { en: 'Oatcakes & Jasmine Rice', th: 'ขนมปังข้าวโอ๊ตและข้าวหอมมะลิ' },
    scotlandExample: 'oatcakes',
    thailandExample: 'jasmine rice',
    clauseAddition: 'For example, oatcakes in Highland markets contrast with Thai jasmine rice dishes.',
  },
  {
    id: 'ex_loch_temple',
    label: { en: 'Lochside Castles & Gilded Temples', th: 'ปราสาทริมทะเลสาบและวัดสีทอง' },
    scotlandExample: 'lochside castles',
    thailandExample: 'Thai temples',
    clauseAddition:
      'For example, stone lochside castles and golden Thai temples reflect each region’s landscape.',
  },
  {
    id: 'ex_games_songkran',
    label: { en: 'Bagpipes & Songkran', th: 'ปี่สกอตและสงกรานต์' },
    scotlandExample: 'Highland Games',
    thailandExample: 'Songkran',
    clauseAddition:
      'For example, summer Highland Games with bagpipes differ from Thailand’s Songkran water blessings.',
  },
];

const SIMILARITY_PATTERN = /\b(both\b.*\band\b|similar\s+to|alike|share|just\s+like)\b/i;
const DIFFERENCE_PATTERN = /\b(different\s+from|while|whereas|unlike|contrast|instead\s+of)\b/i;
const SCOTLAND_EXAMPLE_PATTERN =
  /\b(scotland|scottish|highland|tartan|kilt|oatcake|oat|shortbread|berries|loch|castle|bagpipe|fiddle|cottage|granite)\b/i;
const THAILAND_EXAMPLE_PATTERN =
  /\b(thailand|thai|praewa|silk|jasmine\s+rice|herbs|lemongrass|songkran|loy\s+krathong|temple|wat|krathong)\b/i;
const STEREOTYPE_PATTERN =
  /\b(only\s+eat\s+(sweets|shortbread)|eat\s+only\s+shortbread|never\s+wear\s+modern|no\s+modern|only\s+(wear\s+)?kilts(\s+every\s+day)?|only\s+ride\s+horses)\b/i;

export function evaluateMasterComparisonText(rawText: string): {
  valid: boolean;
  hasSimilarity: boolean;
  hasDifference: boolean;
  hasSpecificExamples: boolean;
  feedback: LocalizedText;
} {
  const cleaned = rawText.trim();
  if (cleaned.length < 28) {
    return {
      valid: false,
      hasSimilarity: false,
      hasDifference: false,
      hasSpecificExamples: false,
      feedback: {
        en: 'Write or assemble at least two clauses linking Scotland and Thailand with specific examples.',
        th: 'กรุณาเขียนหรือประกอบประโยคให้ครบทั้งความเหมือน ความต่าง และตัวอย่างเฉพาะของไทย-สกอตแลนด์',
      },
    };
  }

  if (STEREOTYPE_PATTERN.test(cleaned)) {
    return {
      valid: false,
      hasSimilarity: false,
      hasDifference: false,
      hasSpecificExamples: false,
      feedback: {
        en: 'Watch out for stereotypes—avoid claiming people only wear kilts every day or have no modern routines.',
        th: 'ระวังการเหมารวมแบบผิด ๆ เช่น การบอกว่าชาวสกอตใส่คิลต์ทุกวันหรือไม่มีชีวิตสมัยใหม่',
      },
    };
  }

  const hasSimilarity = SIMILARITY_PATTERN.test(cleaned);
  const hasDifference = DIFFERENCE_PATTERN.test(cleaned);
  const hasScotlandExample = SCOTLAND_EXAMPLE_PATTERN.test(cleaned);
  const hasThailandExample = THAILAND_EXAMPLE_PATTERN.test(cleaned);
  const hasSpecificExamples = hasScotlandExample && hasThailandExample;

  if (!hasSimilarity) {
    return {
      valid: false,
      hasSimilarity,
      hasDifference,
      hasSpecificExamples,
      feedback: {
        en: 'Add a similarity link using "Both ... and ..." or "similar to".',
        th: 'เพิ่มประโยคบอกความเหมือนโดยใช้คำเชื่อม "Both ... and ..." หรือ "similar to"',
      },
    };
  }
  if (!hasDifference) {
    return {
      valid: false,
      hasSimilarity,
      hasDifference,
      hasSpecificExamples,
      feedback: {
        en: 'Add a contrast link using "different from", "while", "whereas", or "unlike".',
        th: 'เพิ่มประโยคบอกความต่างโดยใช้คำเชื่อม "different from", "while", "whereas" หรือ "unlike"',
      },
    };
  }
  if (!hasSpecificExamples) {
    return {
      valid: false,
      hasSimilarity,
      hasDifference,
      hasSpecificExamples,
      feedback: {
        en: 'Name specific cultural examples from both Scotland (e.g., tartan, oatcakes, loch, bagpipes) and Thailand (e.g., Praewa silk, jasmine rice, Songkran, temples).',
        th: 'ระบุตัวอย่างจริงจากทั้งสกอตแลนด์ (เช่น ผ้าทาร์ทัน ข้าวโอ๊ต ปราสาท) และไทย (เช่น ไหมแพรวา ข้าวหอมมะลิ สงกรานต์)',
      },
    };
  }

  return {
    valid: true,
    hasSimilarity,
    hasDifference,
    hasSpecificExamples,
    feedback: {
      en: 'Master Comparison forged! It includes a clear similarity, a clear difference, and authentic Scotland–Thailand cultural examples.',
      th: 'ยอดเยี่ยมมาก! ข้อความเปรียบเทียบของคุณมีครบทั้งความเหมือน ความต่าง และตัวอย่างทางวัฒนธรรมไทย-สกอตแลนด์ที่ถูกต้อง',
    },
  };
}

/**
 * Validates persisted BUILD sentences during localStorage hydration & sanitization.
 * Requires a real non-trivial comparison sentence with comparison/contrast markers.
 */
export function isValidSavedScotlandBuildSentence(
  stationId: ScotlandLandmarkId,
  rawSentence: unknown,
): rawSentence is string {
  if (typeof rawSentence !== 'string') return false;
  const trimmed = rawSentence.trim();
  if (trimmed.length < 24 || trimmed.length > 500) return false;
  if (STEREOTYPE_PATTERN.test(trimmed)) return false;

  if (stationId === 'highland_village_square') {
    return /\bboth\b.*\band\b/i.test(trimmed);
  }
  if (stationId === 'tartan_heritage_workshop') {
    return /\b(similar\s+to|different\s+from)\b/i.test(trimmed);
  }
  if (stationId === 'highland_food_market') {
    return /\b(while|whereas)\b/i.test(trimmed);
  }
  if (stationId === 'highland_games_ground') {
    return /\b(while|whereas|unlike)\b/i.test(trimmed);
  }
  // Master Comparison Compass (Station 5)
  return (
    SIMILARITY_PATTERN.test(trimmed) &&
    DIFFERENCE_PATTERN.test(trimmed) &&
    SCOTLAND_EXAMPLE_PATTERN.test(trimmed) &&
    THAILAND_EXAMPLE_PATTERN.test(trimmed)
  );
}
