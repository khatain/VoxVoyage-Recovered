import type { LocalizedText } from '../types/game';

export type JaipurVocabObjectId =
  | 'palace'
  | 'archway'
  | 'market_stall'
  | 'colorful_fabric'
  | 'fountain';

export type JaipurPoiId = 'local_guide' | JaipurVocabObjectId;

export interface JaipurVocabObject {
  id: JaipurVocabObjectId;
  order: number;
  word: LocalizedText;
  exampleSentence: LocalizedText;
  position: { x: number; z: number };
  interactionRadius: number;
  accentColor: string;
}

export interface JaipurInteractiveTarget {
  id: JaipurPoiId;
  kind: 'npc' | 'vocab';
  title: LocalizedText;
  position: { x: number; z: number };
  interactionRadius: number;
  accentColor: string;
}

export const WORD_DETECTIVE_XP_REWARD = 50;

export const JAIPUR_SPAWN = {
  x: 0,
  z: 7.4,
  yaw: 0,
};

export const JAIPUR_BOUNDS = {
  minX: -12.0,
  maxX: 12.0,
  minZ: -10.8,
  maxZ: 11.2,
  playerRadius: 0.42,
};

export interface BoxObstacle {
  id: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface CircleObstacle {
  id: string;
  x: number;
  z: number;
  radius: number;
}

export const JAIPUR_BOX_OBSTACLES: BoxObstacle[] = [
  // West Jaipur Market Stalls (3 stalls along arcade)
  { id: 'market_stall_north', minX: -11.4, maxX: -7.1, minZ: -5.4, maxZ: -2.4 },
  { id: 'market_stall_center', minX: -11.4, maxX: -7.0, minZ: -1.4, maxZ: 1.6 },
  { id: 'market_stall_south', minX: -11.4, maxX: -7.1, minZ: 2.6, maxZ: 5.6 },
  // North Pink Palace facade plinth
  { id: 'north_palace_wall', minX: -13.0, maxX: 13.0, minZ: -13.0, maxZ: -9.3 },
  // East Heritage Pavilion stone plinth & columns
  { id: 'east_pavilion_plinth', minX: 6.7, maxX: 11.2, minZ: -3.2, maxZ: 1.6 },
  // Decorative sandstone corner benches
  { id: 'bench_sw', minX: -5.4, maxX: -3.2, minZ: 7.4, maxZ: 8.6 },
  { id: 'bench_se', minX: 3.2, maxX: 5.4, minZ: 7.4, maxZ: 8.6 },
];

export const JAIPUR_CIRCLE_OBSTACLES: CircleObstacle[] = [
  // Central Lotus Fountain plaza
  { id: 'central_fountain', x: 0, z: -0.6, radius: 1.95 },
  // Heritage Guide NPC Aarav personal space
  { id: 'npc_aarav', x: 5.4, z: -0.8, radius: 0.62 },
  // Courtyard Palm & Tree Planters
  { id: 'planter_nw', x: -5.6, z: -6.8, radius: 0.85 },
  { id: 'planter_ne', x: 5.6, z: -6.8, radius: 0.85 },
  { id: 'planter_sw', x: -7.8, z: 8.2, radius: 0.85 },
  { id: 'planter_se', x: 7.8, z: 8.2, radius: 0.85 },
];

export const JAIPUR_AARAV_TARGET: JaipurInteractiveTarget = {
  id: 'local_guide',
  kind: 'npc',
  title: { en: 'Aarav Sharma', th: 'อาราฟ ชาร์มา' },
  position: { x: 5.4, z: -0.8 },
  interactionRadius: 2.6,
  accentColor: '#24B8B0',
};

export const JAIPUR_VOCAB_OBJECTS: JaipurVocabObject[] = [
  {
    id: 'palace',
    order: 1,
    word: { en: 'Palace', th: 'พระราชวัง (Palace)' },
    exampleSentence: {
      en: 'This is a beautiful palace.',
      th: 'นี่คือพระราชวังที่สวยงามมาก',
    },
    position: { x: 7.6, z: -7.2 },
    interactionRadius: 2.5,
    accentColor: '#E07A68',
  },
  {
    id: 'archway',
    order: 2,
    word: { en: 'Archway', th: 'ซุ้มประตูโค้ง (Archway)' },
    exampleSentence: {
      en: 'Look at the tall pink archway.',
      th: 'ดูซุ้มประตูโค้งสีชมพูสูงสง่านั้นสิ',
    },
    position: { x: 0, z: -7.4 },
    interactionRadius: 2.5,
    accentColor: '#D95D48',
  },
  {
    id: 'market_stall',
    order: 3,
    word: { en: 'Market Stall', th: 'แผงขายของในตลาด (Market Stall)' },
    exampleSentence: {
      en: 'Bright spices fill the busy market stall.',
      th: 'เครื่องเทศสีสดใสวางเต็มแผงขายของในตลาด',
    },
    position: { x: -5.9, z: -4.1 },
    interactionRadius: 2.35,
    accentColor: '#E59A2B',
  },
  {
    id: 'colorful_fabric',
    order: 4,
    word: { en: 'Colorful Fabric', th: 'ผ้าหลากสีสัน (Colorful Fabric)' },
    exampleSentence: {
      en: 'Artisans display bright colorful fabric here.',
      th: 'ช่างฝีมือวางแสดงผ้าหลากสีสันสดใสไว้ที่นี่',
    },
    position: { x: -5.9, z: 1.0 },
    interactionRadius: 2.35,
    accentColor: '#D94A64',
  },
  {
    id: 'fountain',
    order: 5,
    word: { en: 'Fountain', th: 'น้ำพุ (Fountain)' },
    exampleSentence: {
      en: 'Cool water splashes in the stone fountain.',
      th: 'สายน้ำเย็นสดชื่นพุ่งขึ้นจากน้ำพุหิน',
    },
    position: { x: 0, z: 2.05 },
    interactionRadius: 2.45,
    accentColor: '#24B8B0',
  },
];

export const JAIPUR_INTERACTIVE_TARGETS: JaipurInteractiveTarget[] = [
  JAIPUR_AARAV_TARGET,
  ...JAIPUR_VOCAB_OBJECTS.map((obj) => ({
    id: obj.id,
    kind: 'vocab' as const,
    title: obj.word,
    position: obj.position,
    interactionRadius: obj.interactionRadius,
    accentColor: obj.accentColor,
  })),
];

export const AARAV_MISSION_DIALOGUE = {
  intro: {
    en: "Welcome to Jaipur! Let's explore the Pink City. Can you find five interesting things around us?",
    th: 'ยินดีต้อนรับสู่ชัยปุระ! มาสำรวจนครสีชมพูกันเถอะ ช่วยตามหาสิ่งน่าสนใจ 5 อย่างรอบจัตุรัสให้หน่อยได้ไหม?',
  },
  inProgress: (foundCount: number, totalCount: number): LocalizedText => ({
    en: `Great start! You have found ${foundCount} of ${totalCount} objects so far. Keep exploring the square!`,
    th: `เยี่ยมมาก! คุณพบแล้ว ${foundCount} จาก ${totalCount} อย่าง เดินสำรวจรอบจัตุรัสต่อได้เลย!`,
  }),
  completed: {
    en: 'Wonderful work, Explorer! You found all five landmarks and objects in Jaipur. Are you ready to build sentences about them on the Sentence Train?',
    th: 'เก่งมาก นักสำรวจ! คุณค้นพบครบทั้ง 5 อย่างในชัยปุระแล้ว พร้อมขึ้นขบวนรถไฟเรียงประโยค (Sentence Train) กันหรือยัง?',
  },
  practiceReady: {
    en: 'Bravo, Explorer! You mastered the Sentence Train. Now visit all 5 Jaipur landmarks and practice speaking aloud with Spot & Speak!',
    th: 'ยอดเยี่ยมมาก นักสำรวจ! คุณพิชิต Sentence Train แล้ว ตอนนี้เดินไปตามจุดสำคัญทั้ง 5 แห่งเพื่อซ้อมพูดในภารกิจ Spot & Speak กันเลย!',
  },
  spotAndSpeakActive: (doneCount: number, totalCount: number): LocalizedText => ({
    en: `Keep going! You have practiced speaking at ${doneCount} of ${totalCount} Jaipur spots. Visit the remaining highlighted markers!`,
    th: `เก่งมาก! คุณซ้อมพูดครบแล้ว ${doneCount} จาก ${totalCount} จุด เดินไปยังจุดที่ยังสว่างอยู่ต่อได้เลย!`,
  }),
  performReady: {
    en: "You've explored Jaipur and practiced describing its beautiful places. Now it's your turn to become the guide!",
    th: 'คุณได้สำรวจชัยปุระและฝึกบรรยายสถานที่งดงามต่างๆ แล้ว ตอนนี้ถึงตาคุณสวมบทบาทเป็นมัคคุเทศก์นำเที่ยวบ้างแล้วล่ะ!',
  },
  showcaseCompleted: {
    en: 'Bravo, Jaipur Tour Guide! The visiting travelers loved your tour, and your India Passport Stamp shines in your passport. Feel free to rehearse anytime!',
    th: 'ยอดเยี่ยมมาก มัคคุเทศก์แห่งชัยปุระ! นักเดินทางประทับใจการนำชมของคุณมาก และตราประทับอินเดียก็อยู่ในพาสปอร์ตของคุณแล้ว สามารถกลับมาซ้อมใหม่ได้ทุกเมื่อนะ!',
  },
};
