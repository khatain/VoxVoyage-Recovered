import type { LocalizedText } from '../types/game';
import type { JaipurVocabObjectId } from './jaipurWorld';

export const FINAL_JAIPUR_SHOWCASE_ACTIVITY_ID = 'final_jaipur_showcase';
export const FINAL_JAIPUR_SHOWCASE_XP_REWARD = 100;
export const TOTAL_JAIPUR_MISSION_XP = 250;
export const INDIA_PASSPORT_STAMP_ID = 'stamp_india_jaipur';

export interface ShowcaseStarterItem {
  id: string;
  starter: string;
  hint: LocalizedText;
}

export interface ShowcaseLandmarkOutlineOption {
  id: JaipurVocabObjectId;
  label: LocalizedText;
  sampleLine: string;
  sampleLineTh: string;
  accentColor: string;
}

export interface ShowcaseChecklistItem {
  id: 'greeting' | 'intro' | 'landmarks' | 'closing';
  label: LocalizedText;
}

export const JAIPUR_SHOWCASE_CHECKLIST: ShowcaseChecklistItem[] = [
  {
    id: 'greeting',
    label: {
      en: 'A warm greeting for your visiting travelers',
      th: 'กล่าวทักทายต้อนรับนักเดินทางอย่างเป็นกันเอง',
    },
  },
  {
    id: 'intro',
    label: {
      en: 'A short introduction to Jaipur (the Pink City)',
      th: 'แนะนำเมืองชัยปุระ (นครสีชมพู) สั้นๆ',
    },
  },
  {
    id: 'landmarks',
    label: {
      en: 'Descriptions of at least three landmarks or objects',
      th: 'บรรยายสถานที่หรือสิ่งของสำคัญอย่างน้อย 3 แห่ง',
    },
  },
  {
    id: 'closing',
    label: {
      en: 'A polite closing sentence',
      th: 'กล่าวปิดท้ายขอบคุณผู้มาเยือนอย่างสุภาพ',
    },
  },
];

export const JAIPUR_SHOWCASE_STARTERS: ShowcaseStarterItem[] = [
  {
    id: 'starter_welcome',
    starter: 'Welcome to Jaipur!',
    hint: { en: 'Greeting', th: 'คำทักทายต้อนรับ' },
  },
  {
    id: 'starter_famous',
    starter: 'This city is famous for...',
    hint: { en: 'City introduction', th: 'แนะนำจุดเด่นของเมือง' },
  },
  {
    id: 'starter_see',
    starter: 'Here you can see...',
    hint: { en: 'Pointing to landmarks', th: 'ชี้ชมสถานที่สำคัญ' },
  },
  {
    id: 'starter_palace',
    starter: 'The palace is...',
    hint: { en: 'Describing features', th: 'บรรยายลักษณะ' },
  },
  {
    id: 'starter_closing',
    starter: 'Thank you for visiting!',
    hint: { en: 'Polite closing', th: 'คำกล่าวปิดท้าย' },
  },
];

export const JAIPUR_SHOWCASE_VOCAB_REVIEW: { word: string; th: string }[] = [
  { word: 'Palace', th: 'พระราชวัง' },
  { word: 'Archway', th: 'ซุ้มประตูโค้ง' },
  { word: 'Market Stall', th: 'แผงขายของในตลาด' },
  { word: 'Colorful Fabric', th: 'ผ้าหลากสีสัน' },
  { word: 'Fountain', th: 'น้ำพุ' },
  { word: 'beautiful / tall / bright', th: 'สวยงาม / สูง / สดใส' },
];

export const JAIPUR_SHOWCASE_MODEL_TOUR = {
  en: 'Hello travelers, welcome to Jaipur! This city is famous for its warm pink sandstone buildings. Here you can see the tall pink archway and the beautiful palace. At the busy market stall, artisans display bright colorful fabric, and cool water splashes in the stone fountain. Thank you for visiting Jaipur!',
  th: 'สวัสดีนักเดินทางทุกท่าน ยินดีต้อนรับสู่เมืองชัยปุระ! เมืองนี้มีชื่อเสียงเรื่องอาคารหินทรายสีชมพูอบอุ่น ที่นี่คุณจะได้ชมซุ้มประตูโค้งสีชมพูสูงสง่าและพระราชวังอันงดงาม ส่วนที่แผงขายของในตลาด ช่างฝีมือจัดแสดงผ้าหลากสีสันสดใส และยังมีน้ำพุหินที่สายน้ำเย็นสดชื่นพุ่งขึ้นด้วย ขอบคุณที่มาเยือนชัยปุระครับ/ค่ะ!',
};

export const JAIPUR_SHOWCASE_LANDMARK_OPTIONS: ShowcaseLandmarkOutlineOption[] = [
  {
    id: 'palace',
    label: { en: 'Palace', th: 'พระราชวัง' },
    sampleLine: 'The palace is beautiful with warm pink sandstone walls.',
    sampleLineTh: 'พระราชวังสวยงามมากด้วยกำแพงหินทรายสีชมพูอบอุ่น',
    accentColor: '#E07A68',
  },
  {
    id: 'archway',
    label: { en: 'Archway', th: 'ซุ้มประตูโค้ง' },
    sampleLine: 'Here you can see a tall pink archway leading to the plaza.',
    sampleLineTh: 'ที่นี่คุณจะเห็นซุ้มประตูโค้งสีชมพูสูงสง่านำเข้าสู่ลานกว้าง',
    accentColor: '#D95D48',
  },
  {
    id: 'market_stall',
    label: { en: 'Market Stall', th: 'แผงขายของในตลาด' },
    sampleLine: 'The lively market stall sells spices and handmade crafts.',
    sampleLineTh: 'แผงตลาดที่คึกคักขายเครื่องเทศและงานฝีมือทำมือ',
    accentColor: '#E59A2B',
  },
  {
    id: 'colorful_fabric',
    label: { en: 'Colorful Fabric', th: 'ผ้าหลากสีสัน' },
    sampleLine: 'Local weavers display bright colorful fabric in the bazaar.',
    sampleLineTh: 'ช่างทอผ้าท้องถิ่นจัดแสดงผ้าหลากสีสันสดใสในตลาด',
    accentColor: '#D94A64',
  },
  {
    id: 'fountain',
    label: { en: 'Fountain', th: 'น้ำพุ' },
    sampleLine: 'Cool water sparkles inside the stone courtyard fountain.',
    sampleLineTh: 'สายน้ำเย็นสดชื่นส่องประกายอยู่ในน้ำพุหินกลางลาน',
    accentColor: '#24B8B0',
  },
];

export const JAIPUR_SHOWCASE_SANDWICH_FEEDBACK = {
  positive: {
    en: 'You stepped up as a Jaipur Tour Guide and connected greeting, description, and closing into a complete mini-tour!',
    th: 'คุณก้าวขึ้นมาเป็นมัคคุเทศก์แห่งชัยปุระได้อย่างน่าภาคภูมิใจ และเชื่อมโยงคำทักทาย การบรรยาย และคำปิดท้ายเป็นบทนำชมที่สมบูรณ์!',
  },
  improvement: {
    en: 'Pause for one calm breath between each landmark and stress key adjectives like "tall", "bright", and "beautiful".',
    th: 'ลองหยุดหายใจสั้นๆ ระหว่างแต่ละสถานที่ และเน้นเสียงคำคุณศัพท์สำคัญอย่าง "tall", "bright" และ "beautiful" ให้ชัดเจนยิ่งขึ้น',
  },
  nextStep: {
    en: 'Claim your India Passport Stamp! Whenever you visit new destinations next, carry this clear tour-guide voice forward.',
    th: 'รับตราประทับพาสปอร์ตประเทศอินเดียได้เลย! และนำความมั่นใจในการเล่าเรื่องนี้ไปใช้ในประเทศถัดไปนะ',
  },
};
