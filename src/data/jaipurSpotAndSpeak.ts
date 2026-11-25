import type { LocalizedText } from '../types/game';
import type { JaipurVocabObjectId } from './jaipurWorld';

export const SPOT_AND_SPEAK_ACTIVITY_ID = 'spot_and_speak';
export const SPOT_AND_SPEAK_XP_REWARD = 50;

export interface SpotAndSpeakChallenge {
  id: JaipurVocabObjectId;
  order: number;
  title: LocalizedText;
  locationHint: LocalizedText;
  speakingPrompt: LocalizedText;
  vocabularyHints: { word: string; th: string }[];
  sentenceStarter: string;
  modelSentence: string;
  modelSentenceTh: string;
  noMicFocusPhrase: string;
  noMicDistractors: string[];
  accentColor: string;
  sandwichFeedback: {
    positive: LocalizedText;
    improvement: LocalizedText;
    nextStep: LocalizedText;
  };
}

export const JAIPUR_SPOT_AND_SPEAK_CHALLENGES: SpotAndSpeakChallenge[] = [
  {
    id: 'palace',
    order: 1,
    title: { en: 'Palace', th: 'พระราชวัง (Palace)' },
    locationHint: { en: 'North-East Palace Wing', th: 'ฝั่งตะวันออกเฉียงเหนือของลาน' },
    speakingPrompt: {
      en: 'Look at the pink sandstone palace. Describe how it looks in one clear sentence.',
      th: 'มองดูพระราชวังหินทรายสีชมพู แล้วลองพูดบรรยายลักษณะเป็นภาษาอังกฤษ 1 ประโยค',
    },
    vocabularyHints: [
      { word: 'palace', th: 'พระราชวัง' },
      { word: 'is', th: 'เป็น / คือ' },
      { word: 'beautiful', th: 'สวยงาม' },
    ],
    sentenceStarter: 'The palace ...',
    modelSentence: 'The palace is beautiful.',
    modelSentenceTh: 'พระราชวังแห่งนี้สวยงาม',
    noMicFocusPhrase: 'is beautiful',
    noMicDistractors: ['sells colorful clothes', 'in the courtyard'],
    accentColor: '#E07A68',
    sandwichFeedback: {
      positive: {
        en: 'Nice work describing the Jaipur palace!',
        th: 'เยี่ยมมาก! คุณฝึกพูดบรรยายพระราชวังชัยปุระได้ดีเลย',
      },
      improvement: {
        en: "Tip: Pause slightly after 'The palace' and pronounce 'beautiful' clearly.",
        th: "คำแนะนำ: เว้นจังหวะเล็กน้อยหลังคำว่า 'The palace' แล้วออกเสียง 'beautiful' ให้ชัดเจน",
      },
      nextStep: {
        en: 'Listen once more if you like, or continue to the next Jaipur landmark!',
        th: 'ฟังเสียงตัวอย่างซ้ำได้ตามต้องการ หรือไปสำรวจจุดต่อไปได้เลย!',
      },
    },
  },
  {
    id: 'archway',
    order: 2,
    title: { en: 'Archway', th: 'ซุ้มประตูโค้ง (Archway)' },
    locationHint: { en: 'North Courtyard Gate', th: 'ประตูโค้งฝั่งเหนือของลาน' },
    speakingPrompt: {
      en: 'Look up at the grand pink archway. Describe its height aloud.',
      th: 'เงยหน้ามองซุ้มประตูโค้งสีชมพู แล้วลองพูดบรรยายความสูงของซุ้มประตู',
    },
    vocabularyHints: [
      { word: 'archway', th: 'ซุ้มประตูโค้ง' },
      { word: 'very', th: 'มาก' },
      { word: 'tall', th: 'สูง' },
    ],
    sentenceStarter: 'The archway ...',
    modelSentence: 'The archway is very tall.',
    modelSentenceTh: 'ซุ้มประตูโค้งนี้สูงมาก',
    noMicFocusPhrase: 'is very tall',
    noMicDistractors: ['has bright colors', 'is beautiful'],
    accentColor: '#D95D48',
    sandwichFeedback: {
      positive: {
        en: 'Well done practicing your description of the Pink Archway!',
        th: 'เก่งมาก! คุณฝึกพูดบรรยายซุ้มประตูโค้งได้คล่องขึ้นแล้ว',
      },
      improvement: {
        en: "Tip: Stress the word 'very' slightly to show how tall the archway is.",
        th: "คำแนะนำ: เน้นเสียงคำว่า 'very' เล็กน้อยเพื่อสื่อความหมายว่าสูงมาก",
      },
      nextStep: {
        en: 'Ready to explore more of Jaipur? Continue when you feel confident!',
        th: 'พร้อมแล้วไปสำรวจจุดต่อไปในชัยปุระกันต่อเลย!',
      },
    },
  },
  {
    id: 'market_stall',
    order: 3,
    title: { en: 'Market Stall', th: 'แผงขายของในตลาด (Market Stall)' },
    locationHint: { en: 'North-West Bazaar', th: 'ตลาดฝั่งตะวันตกเฉียงเหนือ' },
    speakingPrompt: {
      en: 'Look at the lively market stall. Say what items it sells.',
      th: 'มองดูแผงขายของในตลาด แล้วลองพูดบอกว่าแผงนี้ขายอะไร',
    },
    vocabularyHints: [
      { word: 'market stall', th: 'แผงขายของในตลาด' },
      { word: 'sells', th: 'ขาย' },
      { word: 'colorful clothes', th: 'เสื้อผ้าสีสันสดใส' },
    ],
    sentenceStarter: 'The market stall ...',
    modelSentence: 'The market stall sells colorful clothes.',
    modelSentenceTh: 'แผงขายของในตลาดขายเสื้อผ้าสีสันสดใส',
    noMicFocusPhrase: 'sells colorful clothes',
    noMicDistractors: ['is very tall', 'in the courtyard'],
    accentColor: '#E59A2B',
    sandwichFeedback: {
      positive: {
        en: 'Awesome job sharing what the Jaipur market stall sells!',
        th: 'ยอดเยี่ยม! คุณพูดบอกสิ่งที่ขายในแผงตลาดได้ชัดเจนมาก',
      },
      improvement: {
        en: "Tip: Make sure to pronounce the '-s' at the end of 'sells' and 'clothes'.",
        th: "คำแนะนำ: อย่าลืมออกเสียง '-s' ท้ายคำว่า 'sells' และ 'clothes' ให้ชัด",
      },
      nextStep: {
        en: 'Try speaking it once more for smooth rhythm, or move to the next spot!',
        th: 'ลองพูดซ้ำอีกครั้งเพื่อให้จังหวะลื่นไหล หรือไปจุดต่อไปได้เลย!',
      },
    },
  },
  {
    id: 'colorful_fabric',
    order: 4,
    title: { en: 'Colorful Fabric', th: 'ผ้าหลากสีสัน (Colorful Fabric)' },
    locationHint: { en: 'West Textiles Stall', th: 'แผงผ้าพิมพ์ฝั่งตะวันตก' },
    speakingPrompt: {
      en: 'Look closely at the patterned silk banners. Describe their colors.',
      th: 'สังเกตผ้าทอลวดลายบนแผงผ้า แล้วลองพูดบรรยายสีสันของผ้า',
    },
    vocabularyHints: [
      { word: 'fabric', th: 'ผ้า' },
      { word: 'has', th: 'มี' },
      { word: 'bright colors', th: 'สีสันสดใส' },
    ],
    sentenceStarter: 'The fabric ...',
    modelSentence: 'The fabric has bright colors.',
    modelSentenceTh: 'ผ้าผืนนี้มีสีสันสดใส',
    noMicFocusPhrase: 'has bright colors',
    noMicDistractors: ['is beautiful', 'is very tall'],
    accentColor: '#D94A64',
    sandwichFeedback: {
      positive: {
        en: 'Great effort describing the traditional Jaipur fabric!',
        th: 'ดีมาก! คุณฝึกบรรยายผ้าหลากสีสันของชัยปุระได้ดีเลย',
      },
      improvement: {
        en: "Tip: Link 'bright colors' smoothly and keep a steady pace.",
        th: "คำแนะนำ: พูดคำว่า 'bright colors' ต่อเนื่องกันด้วยจังหวะสม่ำเสมอ",
      },
      nextStep: {
        en: 'Continue exploring to finish your Spot & Speak tour!',
        th: 'เดินสำรวจจุดต่อไปเพื่อพิชิตภารกิจ Spot & Speak กันต่อ!',
      },
    },
  },
  {
    id: 'fountain',
    order: 5,
    title: { en: 'Fountain', th: 'น้ำพุ (Fountain)' },
    locationHint: { en: 'Center Courtyard Plaza', th: 'ใจกลางลานจัตุรัส' },
    speakingPrompt: {
      en: 'Look at the lotus stone fountain. Say where it is located.',
      th: 'มองดูน้ำพุหินรูปดอกบัวกลางลาน แล้วลองพูดบอกตำแหน่งที่ตั้ง',
    },
    vocabularyHints: [
      { word: 'fountain', th: 'น้ำพุ' },
      { word: 'is in', th: 'ตั้งอยู่ใน' },
      { word: 'courtyard', th: 'ลานจัตุรัส' },
    ],
    sentenceStarter: 'The fountain ...',
    modelSentence: 'The fountain is in the courtyard.',
    modelSentenceTh: 'น้ำพุตั้งอยู่ในลานจัตุรัส',
    noMicFocusPhrase: 'in the courtyard',
    noMicDistractors: ['sells colorful clothes', 'has bright colors'],
    accentColor: '#24B8B0',
    sandwichFeedback: {
      positive: {
        en: 'Fantastic work describing where the fountain stands!',
        th: 'เก่งมาก! คุณฝึกบอกตำแหน่งของน้ำพุในลานจัตุรัสได้ชัดเจน',
      },
      improvement: {
        en: "Tip: Group 'in the courtyard' together as one smooth place phrase.",
        th: "คำแนะนำ: ออกเสียงวลี 'in the courtyard' ต่อเนื่องกันเป็นกลุ่มคำบอกสถานที่",
      },
      nextStep: {
        en: 'Save your progress and keep shining in your English adventure!',
        th: 'บันทึกความก้าวหน้าและพร้อมก้าวสู่ด่านต่อไปได้เลย!',
      },
    },
  },
];

export function getSpotAndSpeakChallenge(
  id: JaipurVocabObjectId,
): SpotAndSpeakChallenge | undefined {
  return JAIPUR_SPOT_AND_SPEAK_CHALLENGES.find((c) => c.id === id);
}
