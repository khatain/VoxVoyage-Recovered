import type { LocalizedText } from '../types/game';
import {
  AUSTRALIA_RECOMMENDED_ROUTE,
  AUSTRALIA_STAGE_ACTIVITY_IDS,
  type AustraliaLandmarkId,
  type AustraliaNpcId,
} from './australiaWorld';

export const AUSTRALIA_DISCOVERY_ACTIVITY_ID = AUSTRALIA_STAGE_ACTIVITY_IDS.discover;
export const AUSTRALIA_DISCOVERY_XP_REWARD = 50;

export type AustraliaDifficultyMode = 'a2' | 'b1';

export type AustraliaDiscoveryMechanicId =
  | 'situation_match'
  | 'route_puzzle'
  | 'cafe_order'
  | 'info_board'
  | 'dialogue_repair';

export type AustraliaDiscoverMissionId =
  | 'greeting_detective'
  | 'direction_decoder'
  | 'cafe_order_quest'
  | 'ticket_talk_challenge'
  | 'communication_rescue';

export const AUSTRALIA_DISCOVER_MISSION_ORDER: readonly AustraliaLandmarkId[] =
  AUSTRALIA_RECOMMENDED_ROUTE;

export const AUSTRALIA_OLIVIA_DISCOVER_WELCOME: LocalizedText = {
  en: "Exploring a new city is exciting, but sometimes you need to ask questions, find your way, or get help. Let's discover five secrets of successful communication!",
  th: 'การออกสำรวจเมืองใหม่เป็นเรื่องน่าตื่นเต้น แต่บางครั้งเราก็ต้องถามคำถาม หาทาง หรือขอความช่วยเหลือ มาร่วมค้นพบ 5 เคล็ดลับของการสื่อสารให้สำเร็จกันเถอะ!',
};

export interface AustraliaDiscoverMissionMeta {
  order: number;
  missionId: AustraliaDiscoverMissionId;
  landmarkId: AustraliaLandmarkId;
  npcId: AustraliaNpcId;
  mechanicId: AustraliaDiscoveryMechanicId;
  title: LocalizedText;
  mechanicLabel: LocalizedText;
  communicationFocus: LocalizedText;
  introLine: LocalizedText;
  secretUnlocked: LocalizedText;
}

export const AUSTRALIA_DISCOVER_MISSIONS: AustraliaDiscoverMissionMeta[] = [
  {
    order: 1,
    missionId: 'greeting_detective',
    landmarkId: 'circular_quay_plaza',
    npcId: 'npc_olivia',
    mechanicId: 'situation_match',
    title: {
      en: 'Mission 1 · Greeting Detective',
      th: 'ภารกิจที่ 1 · นักสืบคำทักทาย',
    },
    mechanicLabel: {
      en: 'Situation-to-Expression Matching',
      th: 'จับคู่สถานการณ์กับประโยคที่เหมาะสม',
    },
    communicationFocus: {
      en: 'Greetings & polite requests for information',
      th: 'การทักทายและการสอบถามข้อมูลอย่างสุภาพ',
    },
    introLine: {
      en: 'Spot how friendly openings and polite starters make locals eager to help around Circular Quay.',
      th: 'สังเกตว่าการทักทายอย่างเป็นมิตรและขึ้นต้นประโยคอย่างสุภาพช่วยให้ผู้คนอยากช่วยเหลือเราอย่างไร',
    },
    secretUnlocked: {
      en: 'Secret 1 · Polite Openings: Starting with "Excuse me" or a warm greeting invites friendly help.',
      th: 'เคล็ดลับที่ 1 · การเปิดบทสนทนาอย่างสุภาพ: เริ่มด้วย "Excuse me" หรือคำทักทายที่อบอุ่นช่วยให้สื่อสารราบรื่น',
    },
  },
  {
    order: 2,
    missionId: 'direction_decoder',
    landmarkId: 'city_transit_station',
    npcId: 'npc_noah',
    mechanicId: 'route_puzzle',
    title: {
      en: 'Mission 2 · Direction Decoder',
      th: 'ภารกิจที่ 2 · ถอดรหัสเส้นทาง',
    },
    mechanicLabel: {
      en: 'Interactive Route Puzzle',
      th: 'ปริศนาแผนที่เส้นทาง',
    },
    communicationFocus: {
      en: 'Understanding directions & asking to confirm routes',
      th: 'การเข้าใจคำบอกทางและถามย้ำเส้นทางให้ชัดเจน',
    },
    introLine: {
      en: 'Follow Noah’s landmarks on the harbour street map and pick the right turn or confirmation question.',
      th: 'ฟังและอ่านคำบอกทางของโนอาห์บนแผนที่จำลอง แล้วเลือกจุดหมายหรือประโยคถามย้ำที่ถูกต้อง',
    },
    secretUnlocked: {
      en: 'Secret 2 · Landmark Clues: Listening for turns ("left/right") and nearby places prevents getting lost.',
      th: 'เคล็ดลับที่ 2 · จับจุดสังเกต: ฟังคำบอกทิศทางและสถานที่อ้างอิงช่วยให้ไม่หลงทาง',
    },
  },
  {
    order: 3,
    missionId: 'cafe_order_quest',
    landmarkId: 'harbour_market_cafe',
    npcId: 'npc_mia',
    mechanicId: 'cafe_order',
    title: {
      en: 'Mission 3 · Café Order Quest',
      th: 'ภารกิจที่ 3 · ภารกิจสั่งอาหารคาเฟ่',
    },
    mechanicLabel: {
      en: 'Interactive Café Order Simulation',
      th: 'จำลองการสั่งอาหารในคาเฟ่',
    },
    communicationFocus: {
      en: 'Ordering food, checking prices & polite requests',
      th: 'การสั่งอาหาร ถามราคา และขอปรับรายการอย่างสุภาพ',
    },
    introLine: {
      en: 'Read the Harbour Café chalkboard menu and choose natural, polite requests for each customer turn.',
      th: 'ดูเมนูหน้าร้าน Harbour Café แล้วเลือกประโยคสั่งอาหารและถามราคาอย่างสุภาพทีละขั้นตอน',
    },
    secretUnlocked: {
      en: 'Secret 3 · Polite Modals: Phrases like "Could I have..." and "How much is..." work warmly everywhere.',
      th: 'เคล็ดลับที่ 3 · คำขอสุภาพ: การใช้ "Could I have..." และ "How much is..." ใช้ได้ผลดีในร้านค้า',
    },
  },
  {
    order: 4,
    missionId: 'ticket_talk_challenge',
    landmarkId: 'darling_harbour_hub',
    npcId: 'npc_jack',
    mechanicId: 'info_board',
    title: {
      en: 'Mission 4 · Ticket Talk Challenge',
      th: 'ภารกิจที่ 4 · ภารกิจข้อมูลตั๋วและรอบเวลา',
    },
    mechanicLabel: {
      en: 'Information Board Investigation',
      th: 'สืบค้นกระดานข้อมูลท่องเที่ยว',
    },
    communicationFocus: {
      en: 'Asking about attraction schedules, prices & recommendations',
      th: 'การสอบถามตารางเวลา ราคาตั๋ว และขอคำแนะนำกิจกรรม',
    },
    introLine: {
      en: 'Inspect Jack’s fictional harbour timetable and match real visitor questions to the details on the board.',
      th: 'สำรวจกระดานตารางเวลาจำลองของแจ็ก แล้วเลือกคำตอบและคำถามที่ตรงกับข้อมูลที่ต้องการ',
    },
    secretUnlocked: {
      en: 'Secret 4 · Check & Compare: Checking times, inclusions, and student prices saves surprises.',
      th: 'เคล็ดลับที่ 4 · ตรวจสอบและเปรียบเทียบ: ถามรอบเวลา สิทธิพิเศษ และส่วนลดนักเรียนให้ชัดก่อนซื้อตั๋ว',
    },
  },
  {
    order: 5,
    missionId: 'communication_rescue',
    landmarkId: 'harbour_gardens_help_point',
    npcId: 'npc_olivia',
    mechanicId: 'dialogue_repair',
    title: {
      en: 'Mission 5 · Communication Rescue',
      th: 'ภารกิจที่ 5 · กู้สถานการณ์บทสนทนา',
    },
    mechanicLabel: {
      en: 'Dialogue Repair Challenge',
      th: 'แก้ไขความเข้าใจคลาดเคลื่อนในบทสนทนา',
    },
    communicationFocus: {
      en: 'Requesting repetition, checking meaning & keeping conversation alive',
      th: 'การขอให้พูดซ้ำ ตรวจสอบความหมาย และประคองบทสนทนา',
    },
    introLine: {
      en: 'When speech feels too fast or a detail is unclear, pick a calm repair phrase to keep talking confidently.',
      th: 'เมื่อคู่สนทนาพูดเร็วหรือได้ยินไม่ชัด เลือกประโยคขอให้พูดซ้ำหรือทวนความเข้าใจเพื่อคุยต่อได้อย่างมั่นใจ',
    },
    secretUnlocked: {
      en: 'Secret 5 · Repair Keepers: Asking someone to repeat or clarify keeps real-world communication flowing!',
      th: 'เคล็ดลับที่ 5 · รักษาบทสนทนา: การขอให้ช่วยย้ำหรือทวนคำอธิบายทำให้การสื่อสารสำเร็จได้เสมอ!',
    },
  },
];

export function getAustraliaDiscoverMissionMeta(
  landmarkId: AustraliaLandmarkId,
): AustraliaDiscoverMissionMeta {
  return (
    AUSTRALIA_DISCOVER_MISSIONS.find((m) => m.landmarkId === landmarkId) ??
    AUSTRALIA_DISCOVER_MISSIONS[0]
  );
}

// ---------------------------------------------------------------------------
// Shared Choice Interface + Sandwich Feedback Builder
// ---------------------------------------------------------------------------

export interface DiscoveryExpressionOption {
  id: string;
  a2Text: string;
  b1Text: string;
  feedback: LocalizedText;
}

export function buildSandwichFeedback(
  isCorrect: boolean,
  explanation: LocalizedText,
): LocalizedText {
  if (isCorrect) {
    return {
      en: `Great choice! ${explanation.en} Keep up this clear, friendly approach on the next challenge.`,
      th: `เยี่ยมมาก! ${explanation.th} ใช้ความมั่นใจแบบนี้ต่อไปในด่านถัดไปได้เลย`,
    };
  }
  return {
    en: `Good try! ${explanation.en} Have another look and choose an expression that fits the situation cleanly.`,
    th: `พยายามได้ดี! ${explanation.th} ลองอ่านสถานการณ์อีกครั้งแล้วเลือกประโยคที่เหมาะที่สุดดูนะ`,
  };
}

// ---------------------------------------------------------------------------
// MINI-GAME 1 — GREETING DETECTIVE (circular_quay_plaza)
// Mechanic: Situation-to-Expression Matching
// ---------------------------------------------------------------------------

export interface GreetingDetectiveScenario {
  id: string;
  sceneTag: 'stranger_map' | 'info_desk' | 'station_way' | 'thank_helper' | 'interrupt_guide';
  a2Situation: LocalizedText;
  b1Situation: LocalizedText;
  contextTip: LocalizedText;
  hint: LocalizedText;
  acceptedOptionIds: string[];
  options: DiscoveryExpressionOption[];
}

export const GREETING_DETECTIVE_SCENARIOS: GreetingDetectiveScenario[] = [
  {
    id: 'gd_stranger_directions',
    sceneTag: 'stranger_map',
    a2Situation: {
      en: 'You are holding a map at Circular Quay and need to ask a local walking past for help.',
      th: 'คุณถือแผนที่อยู่ที่ Circular Quay และต้องการขอความช่วยเหลือจากคนท้องถิ่นที่เดินผ่านมา',
    },
    b1Situation: {
      en: 'A busy commuter is walking past with headphones off. You want to politely pause them to ask a quick question.',
      th: 'คนทำงานกำลังเดินผ่านโดยไม่ได้ใส่หูฟัง คุณอยากทักขอเวลาสั้นๆ เพื่อถามทางอย่างสุภาพ',
    },
    contextTip: {
      en: 'Polite attention-getters soften interruptions with strangers.',
      th: 'คำเกริ่นนำที่สุภาพช่วยให้การเข้าไปคุยกับคนแปลกหน้าดูเป็นมิตร',
    },
    hint: {
      en: 'Look for a polite phrase starting with "Excuse me..." rather than just calling out "Hey!"',
      th: 'ลองมองหาประโยคที่ขึ้นต้นด้วย "Excuse me..." แทนการเรียกห้วนๆ',
    },
    acceptedOptionIds: ['gd1_a', 'gd1_b'],
    options: [
      {
        id: 'gd1_a',
        a2Text: 'Excuse me, could you help me, please?',
        b1Text: 'Excuse me—sorry to bother you, could you possibly help me for a moment?',
        feedback: {
          en: '"Excuse me" shows respect for the stranger’s time and politely opens the conversation.',
          th: '"Excuse me" แสดงความเคารพต่อเวลาของผู้อื่นและเปิดบทสนทนาได้อย่างสุภาพ',
        },
      },
      {
        id: 'gd1_b',
        a2Text: 'Hi there! Do you have a quick minute to help me?',
        b1Text: 'Hi there, excuse me—do you happen to have a quick moment to help me check this map?',
        feedback: {
          en: 'Combining a warm greeting with asking if they have a moment works naturally in Australia.',
          th: 'การทักทายอย่างเป็นกันเองพร้อมถามว่าสะดวกไหม ใช้ได้ดีมากในออสเตรเลีย',
        },
      },
      {
        id: 'gd1_c',
        a2Text: 'Hey, tell me where this is right now.',
        b1Text: 'Listen, show me this place on the map.',
        feedback: {
          en: '"Tell me" or "Listen" sounds like a command rather than a polite request to a stranger.',
          th: 'คำสั่งอย่าง "Tell me" ฟังดูเหมือนสั่งมากกว่าขอความช่วยเหลืออย่างสุภาพ',
        },
      },
      {
        id: 'gd1_d',
        a2Text: 'See you later! Have a nice afternoon.',
        b1Text: 'Thanks anyway, I had a great chat today!',
        feedback: {
          en: 'That sounds friendly, yet it is a farewell for ending a conversation, not starting one.',
          th: 'ประโยคนี้สุภาพแต่เป็นคำบอกลา ไม่ใช่ประโยคเริ่มต้นขอความช่วยเหลือ',
        },
      },
    ],
  },
  {
    id: 'gd_info_officer',
    sceneTag: 'info_desk',
    a2Situation: {
      en: 'At 9:30 AM you step up to an information officer at the Circular Quay welcome desk.',
      th: 'เวลา 9:30 น. คุณเดินเข้าไปที่เคาน์เตอร์เจ้าหน้าที่ประชาสัมพันธ์ที่ Circular Quay',
    },
    b1Situation: {
      en: 'It is morning rush hour at the harbour desk. You want to greet the staff member and state your purpose clearly.',
      th: 'เป็นช่วงเช้าที่มีคนคึกคัก คุณต้องการทักเจ้าหน้าที่ตามช่วงเวลาและบอกจุดประสงค์อย่างชัดเจน',
    },
    contextTip: {
      en: 'Time-appropriate greetings plus stating what you are looking for help staff respond quickly.',
      th: 'การทักทายให้ตรงช่วงเวลาพร้อมบอกสิ่งที่กำลังหา ช่วยให้เจ้าหน้าที่ช่วยได้รวดเร็ว',
    },
    hint: {
      en: 'Choose a morning greeting paired with what place you are looking for.',
      th: 'เลือกคำทักทายตอนเช้าคู่กับประโยคที่บอกว่ากำลังหาศูนย์บริการนักท่องเที่ยว',
    },
    acceptedOptionIds: ['gd2_a'],
    options: [
      {
        id: 'gd2_a',
        a2Text: "Good morning. I'm looking for the visitor centre.",
        b1Text: "Good morning! Could you let me know if I'm near the main visitor centre?",
        feedback: {
          en: 'Greeting the officer with "Good morning" and clearly stating what you need is polite and clear.',
          th: 'การทักด้วย "Good morning" และบอกความต้องการทันทีทั้งสุภาพและชัดเจน',
        },
      },
      {
        id: 'gd2_b',
        a2Text: 'Good night! Give me a ticket.',
        b1Text: 'Good evening, please finish my tour.',
        feedback: {
          en: '"Good night" or "Good evening" does not match 9:30 AM, and "Give me" sounds too abrupt.',
          th: '"Good night" ไม่เหมาะกับเวลาเช้า 9:30 น. และการใช้คำสั่งดูห้วนเกินไป',
        },
      },
      {
        id: 'gd2_c',
        a2Text: "Wait here while I think about it.",
        b1Text: "Never mind, I shouldn't ask anything at this desk.",
        feedback: {
          en: 'You stepped up to an information desk, so clearly asking your question works much better.',
          th: 'เจ้าหน้าที่รอช่วยเหลืออยู่ การบอกคำถามอย่างสุภาพย่อมดีกว่าการขอให้รอหรือเงียบไป',
        },
      },
      {
        id: 'gd2_d',
        a2Text: 'My favourite animal is a koala.',
        b1Text: 'Sydney weather is quite sunny every summer.',
        feedback: {
          en: 'Nice small talk, but it does not ask the information officer for what you are looking for.',
          th: 'เป็นข้อมูลทั่วไปที่น่าสนใจ แต่ยังไม่ได้บอกเจ้าหน้าที่ว่าคุณกำลังมองหาอะไร',
        },
      },
    ],
  },
  {
    id: 'gd_locate_station',
    sceneTag: 'station_way',
    a2Situation: {
      en: 'You need to catch a train and want to ask where City Transit Station is.',
      th: 'คุณต้องไปขึ้นรถไฟและต้องการถามทางไปสถานี City Transit',
    },
    b1Situation: {
      en: 'You finished checking the harbour pier and now want a polite indirect question to find City Transit Station.',
      th: 'คุณเดินชมท่าเรือเสร็จแล้ว และอยากถามทางไปสถานีรถไฟอย่างสุภาพเป็นธรรมชาติ',
    },
    contextTip: {
      en: 'Indirect openers ("Could you tell me where...") sound friendlier than direct demands.',
      th: 'คำถามทางอ้อมอย่าง "Could you tell me where..." ฟังดูสุภาพกว่าการถามห้วนๆ',
    },
    hint: {
      en: 'Find the question asking for the station’s location politely.',
      th: 'มองหาประโยคคำถามที่ขึ้นต้นอย่างสุภาพเพื่อถามตำแหน่งสถานี',
    },
    acceptedOptionIds: ['gd3_a', 'gd3_b'],
    options: [
      {
        id: 'gd3_a',
        a2Text: 'Could you tell me where the station is?',
        b1Text: 'Could you possibly tell me the quickest way to City Transit Station?',
        feedback: {
          en: '"Could you tell me where..." is one of the clearest, most polite ways to ask for directions.',
          th: '"Could you tell me where..." เป็นหนึ่งในประโยคถามทางที่สุภาพและได้ผลดีที่สุด',
        },
      },
      {
        id: 'gd3_b',
        a2Text: 'Excuse me, is City Transit Station near here?',
        b1Text: 'Excuse me, am I heading in the right direction for City Transit Station?',
        feedback: {
          en: 'Checking whether a place is nearby or if you are heading the right way is natural and polite.',
          th: 'การถามเช็กว่าอยู่ใกล้แถวนี้ไหม หรือเดินมาถูกทางหรือเปล่า เป็นวิธีถามที่สุภาพและชัดเจน',
        },
      },
      {
        id: 'gd3_c',
        a2Text: 'What time does your train leave work?',
        b1Text: 'Where did you buy your shoes this morning?',
        feedback: {
          en: 'This asks a personal question instead of asking where City Transit Station is located.',
          th: 'ประโยคนี้ถามเรื่องส่วนตัว ไม่ได้ถามทางไปสถานีรถไฟ',
        },
      },
      {
        id: 'gd3_d',
        a2Text: 'Station now. Point your finger.',
        b1Text: 'Stop talking and write the street name.',
        feedback: {
          en: 'Imperative commands feel unfriendly; adding "Could you..." invites warm cooperation.',
          th: 'ประโยคคำสั่งสั้นๆ ดูไม่เป็นมิตร การใช้ "Could you..." ช่วยให้ผู้ฟังเต็มใจช่วยมากขึ้น',
        },
      },
    ],
  },
  {
    id: 'gd_thank_helper',
    sceneTag: 'thank_helper',
    a2Situation: {
      en: 'A helpful guide explained how to reach the harbour café. You want to close politely.',
      th: 'ผู้ช่วยแนะนำทางไปคาเฟ่ริมอ่าวให้คุณเรียบร้อยแล้ว คุณต้องการกล่าวขอบคุณอย่างสุภาพ',
    },
    b1Situation: {
      en: 'Olivia paused her own walk to give you clear directions. You want to express appreciation warmly before leaving.',
      th: 'โอลิเวียสละเวลาบอกทางอย่างละเอียด คุณอยากกล่าวขอบคุณให้สมกับความมีน้ำใจของเธอก่อนแยกตัว',
    },
    contextTip: {
      en: 'Specific thanks show genuine appreciation when someone helps you.',
      th: 'การขอบคุณที่ระบุเรื่องที่ช่วยแสดงความซาบซึ้งใจอย่างจริงใจ',
    },
    hint: {
      en: 'Select a warm expression that thanks them specifically for helping.',
      th: 'เลือกประโยคที่กล่าวขอบคุณสำหรับความช่วยเหลือที่ได้รับ',
    },
    acceptedOptionIds: ['gd4_a', 'gd4_b'],
    options: [
      {
        id: 'gd4_a',
        a2Text: 'Thank you for your help!',
        b1Text: 'Thank you so much for your help—I really appreciate it!',
        feedback: {
          en: 'Thanking them directly leaves a warm, positive impression at the end of an interaction.',
          th: 'การขอบคุณตรงๆ ช่วยจบการสนทนาด้วยความประทับใจและเป็นมิตร',
        },
      },
      {
        id: 'gd4_b',
        a2Text: 'Thanks a lot! That helps me find it.',
        b1Text: 'Thanks very much, those directions make it super easy to find!',
        feedback: {
          en: 'Telling the helper their directions were useful is natural and encourages them.',
          th: 'การบอกว่าคำแนะนำของเขามีประโยชน์มากช่วยให้ผู้ฟังรู้สึกดีใจที่ได้ช่วย',
        },
      },
      {
        id: 'gd4_c',
        a2Text: 'Excuse me, where is Circular Quay?',
        b1Text: 'Could you please start over and greet me again?',
        feedback: {
          en: 'You already received the directions, so asking for the same opening again feels out of place.',
          th: 'คุณได้รับคำแนะนำไปแล้ว จึงควรกล่าวขอบคุณมากกว่าเริ่มถามซ้ำทั้งหมด',
        },
      },
      {
        id: 'gd4_d',
        a2Text: "Okay, I'm leaving now.",
        b1Text: "Right, I heard all the words you said.",
        feedback: {
          en: 'Saying only "Okay, I’m leaving" sounds slightly cold without a "Thank you"!',
          th: 'การพูดแค่นี้โดยไม่มีคำขอบคุณอาจฟังดูห้วนไปสักหน่อย',
        },
      },
    ],
  },
  {
    id: 'gd_interrupt_guide',
    sceneTag: 'interrupt_guide',
    a2Situation: {
      en: 'An explorer guide is finishing notes at a stand, and you want to ask a quick question.',
      th: 'มัคคุเทศก์กำลังจดบันทึกอยู่หน้าซุ้ม และคุณอยากขอถามคำถามสั้นๆ',
    },
    b1Situation: {
      en: 'The guide appears focused on setting up a welcome board. You want to enter the conversation tactfully without sounding pushy.',
      th: 'เจ้าหน้าที่กำลังจัดป้ายต้อนรับอยู่ คุณต้องการแทรกถามอย่างมีมารยาทและไม่เร่งรัด',
    },
    contextTip: {
      en: 'Acknowledging that someone is busy before asking shows B1-level social awareness.',
      th: 'การขออภัยหากรบกวนเวลาเล็กน้อยแสดงถึงมารยาททางสังคมที่ดีเยี่ยม',
    },
    hint: {
      en: 'Pick a polite phrase that gently asks if it is okay to interrupt for one question.',
      th: 'เลือกประโยคที่ขออนุญาตอย่างสุภาพก่อนถามคำถามสั้นๆ',
    },
    acceptedOptionIds: ['gd5_a'],
    options: [
      {
        id: 'gd5_a',
        a2Text: 'Excuse me, may I ask one quick question?',
        b1Text: 'Sorry to interrupt—would it be alright if I asked one quick question?',
        feedback: {
          en: 'Polite permission ("may I" / "sorry to interrupt") keeps the tone courteous when someone is busy.',
          th: 'การขออนุญาตอย่างสุภาพช่วยให้การถามเมื่ออีกฝ่ายกำลังยุ่งฟังดูนุ่มนวลมาก',
        },
      },
      {
        id: 'gd5_b',
        a2Text: 'Put down your pen and look at me.',
        b1Text: 'Your notes can wait until tonight, answer me first.',
        feedback: {
          en: 'Telling staff to drop their work sounds demanding rather than courteous.',
          th: 'การสั่งให้อีกฝ่ายวางงานทันทีดูเอาแต่ใจ ไม่เหมาะกับการสนทนาจริง',
        },
      },
      {
        id: 'gd5_c',
        a2Text: 'Hello! Good luck with your work, bye!',
        b1Text: 'I can see you are busy, so I will never ask any questions.',
        feedback: {
          en: 'Walk-up guides are there to help visitors—a polite opener lets you ask comfortably.',
          th: 'เจ้าหน้าที่ประจำจุดมีหน้าที่ช่วยนักท่องเที่ยว คุณสามารถทักถามอย่างสุภาพได้เลย',
        },
      },
      {
        id: 'gd5_d',
        a2Text: 'Could I have a sandwich to take away?',
        b1Text: 'How much is a student ferry pass at Darling Harbour?',
        feedback: {
          en: 'That is a café or ticket question before you have even greeted the guide at the welcome plaza.',
          th: 'ประโยคนี้เป็นการสั่งอาหารหรือถามตั๋ว ซึ่งยังไม่ตรงกับสถานการณ์ทักถามเจ้าหน้าที่จุดนี้',
        },
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// MINI-GAME 2 — DIRECTION DECODER (city_transit_station)
// Mechanic: Interactive Route Puzzle (Compact SVG Map inside modal)
// ---------------------------------------------------------------------------

export type SydneyMiniMapPinId = 'pin_a' | 'pin_b' | 'pin_c' | 'pin_d';

export interface DirectionDecoderChallenge {
  id: string;
  mode: 'pick_destination' | 'pick_expression';
  a2Prompt: LocalizedText;
  b1Prompt: LocalizedText;
  noahSpokenRoute: string;
  activePathPoints: string; // SVG polyline points for visual route trace feedback
  hint: LocalizedText;
  correctPinId?: SydneyMiniMapPinId;
  acceptedOptionIds?: string[];
  pinExplanations?: Record<SydneyMiniMapPinId, LocalizedText>;
  options?: DiscoveryExpressionOption[];
}

export const DIRECTION_DECODER_PINS: {
  id: SydneyMiniMapPinId;
  code: 'A' | 'B' | 'C' | 'D';
  label: LocalizedText;
  x: number;
  y: number;
  color: string;
}[] = [
  {
    id: 'pin_a',
    code: 'A',
    label: { en: 'Harbour Café', th: 'คาเฟ่ริมอ่าว' },
    x: 82,
    y: 92,
    color: '#EA580C',
  },
  {
    id: 'pin_b',
    code: 'B',
    label: { en: 'Ferry Wharf', th: 'ท่าเรือเฟอร์รี่' },
    x: 248,
    y: 44,
    color: '#0284C7',
  },
  {
    id: 'pin_c',
    code: 'C',
    label: { en: 'Discovery Hub', th: 'ศูนย์ดาร์ลิงฮาร์เบอร์' },
    x: 266,
    y: 120,
    color: '#9333EA',
  },
  {
    id: 'pin_d',
    code: 'D',
    label: { en: 'Gardens Help Point', th: 'จุดช่วยเหลือสวนริมอ่าว' },
    x: 112,
    y: 146,
    color: '#10B981',
  },
];

export const DIRECTION_DECODER_CHALLENGES: DirectionDecoderChallenge[] = [
  {
    id: 'dd_fountain_left',
    mode: 'pick_destination',
    a2Prompt: {
      en: 'Noah says: "Go straight ahead past the Fountain Square, then turn left. Look right beside the bakery corner!"',
      th: 'โนอาห์บอกทาง: "เดินตรงผ่านลานน้ำพุ แล้วเลี้ยวซ้าย มองดูตรงมุมข้างร้านเบเกอรี่เลย!"',
    },
    b1Prompt: {
      en: 'Noah says: "Head straight north through the central concourse past Fountain Square, take your first left, and stop just opposite the bookshop."',
      th: 'โนอาห์บอกทาง: "เดินตรงขึ้นเหนือผ่านลานกลางและน้ำพุ แล้วเลี้ยวซ้ายแรก หยุดตรงข้ามร้านหนังสือพอดี"',
    },
    noahSpokenRoute:
      'Go straight ahead past Fountain Square, then turn left. It is right on the café corner opposite the bookshop.',
    activePathPoints: '170,176 170,92 82,92',
    hint: {
      en: 'Start at City Transit (bottom center), move UP past the fountain, then turn LEFT to Pin A.',
      th: 'เริ่มจาก City Transit ด้านล่าง ตรงขึ้นไปผ่านน้ำพุ แล้วเลี้ยวซ้ายไปที่จุด A',
    },
    correctPinId: 'pin_a',
    pinExplanations: {
      pin_a: {
        en: 'Turning left after Fountain Square leads straight to Harbour Café (Pin A)!',
        th: 'เลี้ยวซ้ายหลังผ่านน้ำพุจะตรงมาถึง Harbour Café (จุด A) พอดี!',
      },
      pin_b: {
        en: 'Pin B (Ferry Wharf) is all the way up on the top right pier, not left after the fountain.',
        th: 'จุด B อยู่ด้านขวาบนริมท่าเรือ ไม่ใช่ฝั่งซ้ายหลังผ่านน้ำพุ',
      },
      pin_c: {
        en: 'Pin C (Discovery Hub) is to the right side of the map after the second junction.',
        th: 'จุด C อยู่ฝั่งขวาของแผนที่ ไม่ใช่ฝั่งซ้าย',
      },
      pin_d: {
        en: 'Pin D is south-west near the station entrance before reaching the fountain.',
        th: 'จุด D อยู่ด้านล่างซ้ายก่อนถึงลานน้ำพุ',
      },
    },
  },
  {
    id: 'dd_straight_wharf',
    mode: 'pick_destination',
    a2Prompt: {
      en: 'Noah says: "Go straight ahead past the Fountain Square, walk to the top boardwalk, and turn right to the blue wharf."',
      th: 'โนอาห์บอกทาง: "เดินตรงผ่านลานน้ำพุไปจนถึงทางเดินไม้ด้านบน แล้วเลี้ยวขวาไปที่ท่าเรือสีฟ้า"',
    },
    b1Prompt: {
      en: 'Noah says: "Keep walking straight past the plaza all the way to the waterfront promenade, then bear right toward the pier terminal."',
      th: 'โนอาห์บอกทาง: "เดินตรงผ่านลานกลางไปจนสุดทางเดินริมน้ำ แล้วเบี่ยงขวาไปยังอาคารท่าเรือเฟอร์รี่"',
    },
    noahSpokenRoute:
      'Go straight ahead all the way to the top harbour boardwalk, then turn right to Ferry Wharf.',
    activePathPoints: '170,176 170,44 248,44',
    hint: {
      en: 'Follow the main central path all the way to the top harbour edge, then turn right.',
      th: 'เดินตามเส้นตรงกลางขึ้นไปจนสุดขอบอ่าวด้านบน แล้วเลี้ยวขวา',
    },
    correctPinId: 'pin_b',
    pinExplanations: {
      pin_a: {
        en: 'Pin A turns left halfway up; for Ferry Wharf keep straight until the harbour waterfront.',
        th: 'จุด A อยู่ฝั่งซ้ายกลางทาง แต่ท่าเรือต้องเดินตรงไปสุดขอบอ่าวด้านบนแล้วเลี้ยวขวา',
      },
      pin_b: {
        en: 'Walking straight to the top boardwalk and turning right reaches Ferry Wharf (Pin B)!',
        th: 'เดินตรงไปสุดทางเดินริมอ่าวด้านบนแล้วเลี้ยวขวาจะถึง Ferry Wharf (จุด B) พอดี!',
      },
      pin_c: {
        en: 'Pin C is on the lower right junction before the top waterfront edge.',
        th: 'จุด C อยู่ทางแยกด้านขวาล่าง ก่อนถึงทางเดินริมน้ำด้านบน',
      },
      pin_d: {
        en: 'Pin D sits to the left near the station entrance, not on the harbour wharf.',
        th: 'จุด D อยู่ทางซ้ายใกล้ทางเข้าสถานี ไม่ใช่ท่าเรือด้านบน',
      },
    },
  },
  {
    id: 'dd_second_right',
    mode: 'pick_destination',
    a2Prompt: {
      en: 'Noah says: "Turn right at the first street, walk past the tram stop, and look opposite the visitor sign."',
      th: 'โนอาห์บอกทาง: "เลี้ยวขวาที่ถนนแรก เดินเลยป้ายรถราง จะอยู่ตรงข้ามป้ายศูนย์ข้อมูล"',
    },
    b1Prompt: {
      en: 'Noah says: "Take the first right just north of Transit Gate, follow the eastern walkway past the tram kiosk, and you’ll see the purple pavilion."',
      th: 'โนอาห์บอกทาง: "เลี้ยวขวาแรกเหนือประตูสถานี เดินตามทางฝั่งตะวันออกเลยซุ้มรถรางไป จะเจอศาลาสีม่วง"',
    },
    noahSpokenRoute:
      'Take the first right north of the station and follow the eastern walkway straight to Discovery Hub.',
    activePathPoints: '170,176 170,120 266,120',
    hint: {
      en: 'Turn RIGHT at the junction just above City Transit Station to reach the east waterfront hub.',
      th: 'เลี้ยวขวาที่แยกแรกเหนือสถานี City Transit เพื่อไปยังศูนย์ท่องเที่ยวฝั่งขวา',
    },
    correctPinId: 'pin_c',
    pinExplanations: {
      pin_a: {
        en: 'Pin A is to the west (left), whereas Noah said turn right.',
        th: 'จุด A อยู่ฝั่งซ้าย แต่โนอาห์บอกให้เลี้ยวขวา',
      },
      pin_b: {
        en: 'Pin B is up at the northern ferry boardwalk rather than the first right.',
        th: 'จุด B อยู่ด้านบนสุดริมท่าเรือ ไม่ใช่แยกขวาแรก',
      },
      pin_c: {
        en: 'Taking the first right along the east walkway arrives cleanly at Discovery Hub (Pin C)!',
        th: 'เลี้ยวขวาแรกไปตามทางฝั่งตะวันออกจะถึง Discovery Hub (จุด C) อย่างแม่นยำ!',
      },
      pin_d: {
        en: 'Pin D is on the southwest garden path, on the opposite side of the station.',
        th: 'จุด D อยู่ฝั่งซ้ายล่าง ไม่ใช่ฝั่งขวา',
      },
    },
  },
  {
    id: 'dd_map_show_request',
    mode: 'pick_expression',
    a2Prompt: {
      en: 'You are not sure whether the café is left or right. Ask Noah to point it out on the map.',
      th: 'คุณไม่แน่ใจว่าคาเฟ่อยู่ทางซ้ายหรือขวา ต้องการขอให้โนอาห์ช่วยชี้ให้ดูบนแผนที่',
    },
    b1Prompt: {
      en: 'Noah gave three quick turns and you want to verify the crossing visually before walking off.',
      th: 'โนอาห์บอกหลายจุดติดต่อกัน คุณอยากขอให้เขาช่วยชี้บนแผนที่เพื่อให้มั่นใจก่อนเดินไป',
    },
    noahSpokenRoute:
      'Could you show me on the map? Let me check if that junction is the first left or the second left.',
    activePathPoints: '170,176 170,120 112,146',
    hint: {
      en: 'Look for a polite question asking Noah to show you on the map or confirm the turn.',
      th: 'มองหาประโยคสุภาพที่ขอให้โนอาห์ช่วยชี้บนแผนที่หรือย้ำทางเลี้ยว',
    },
    acceptedOptionIds: ['dd4_a', 'dd4_b'],
    options: [
      {
        id: 'dd4_a',
        a2Text: 'Could you show me on the map, please?',
        b1Text: 'Sorry to ask again—could you quickly point that out on the map for me?',
        feedback: {
          en: 'Asking someone to point it out on your map is clear, polite, and avoids taking the wrong street.',
          th: 'การขอให้ช่วยชี้บนแผนที่ชัดเจนและสุภาพ ช่วยป้องกันการเดินหลงได้ดีมาก',
        },
      },
      {
        id: 'dd4_b',
        a2Text: 'Just to check, do I turn left at the fountain?',
        b1Text: 'Just to make sure I understood—is it the first left just after the fountain?',
        feedback: {
          en: 'Confirming a specific landmark or turn ("Just to make sure...") is a great interactive strategy!',
          th: 'การถามย้ำจุดสังเกตที่สำคัญช่วยให้มั่นใจว่าเข้าใจตรงกันแน่นอน',
        },
      },
      {
        id: 'dd4_c',
        a2Text: 'Your directions are impossible to follow.',
        b1Text: 'You spoke too fast, so I will guess on my own.',
        feedback: {
          en: 'Blaming the speaker stops helpful communication; politely asking to check the map works better.',
          th: 'การตำหนิผู้พูดทำให้เสียบรรยากาศ ลองขอให้ช่วยดูแผนที่ด้วยน้ำเสียงสุภาพดีกว่า',
        },
      },
      {
        id: 'dd4_d',
        a2Text: 'Could I have a bottle of sparkling water?',
        b1Text: 'Do you sell hot banana bread behind the counter?',
        feedback: {
          en: 'You are at the transit desk checking street directions, not ordering café food.',
          th: 'ตอนนี้คุณกำลังถามทางที่สถานีขนส่ง ไม่ได้กำลังสั่งอาหารที่คาเฟ่',
        },
      },
    ],
  },
  {
    id: 'dd_gardens_spot',
    mode: 'pick_destination',
    a2Prompt: {
      en: 'Noah says: "Turn left right beside the station exit—the Gardens Help Point is next to the green park!"',
      th: 'โนอาห์บอกทาง: "เลี้ยวซ้ายข้างทางออกสถานีเลย จุดช่วยเหลือ Gardens Help Point อยู่ติดสวนสีเขียว!"',
    },
    b1Prompt: {
      en: 'Noah says: "Skip the fountain completely—take an immediate left out of City Transit along the lower garden path toward the emerald kiosk."',
      th: 'โนอาห์บอกทาง: "ไม่ต้องเดินขึ้นไปที่น้ำพุ ออกซ้ายทันทีข้างสถานีตามทางเดินสวนด้านล่างไปยังซุ้มสีเขียว"',
    },
    noahSpokenRoute:
      'Take an immediate left out of the station exit along the lower park path to reach the Gardens Help Point.',
    activePathPoints: '170,176 170,146 112,146',
    hint: {
      en: 'Stay near the bottom left beside the station—do not go all the way up past Fountain Square.',
      th: 'อยู่โซนซ้ายล่างใกล้สถานี ไม่ต้องเดินขึ้นไปไกลถึงลานน้ำพุ',
    },
    correctPinId: 'pin_d',
    pinExplanations: {
      pin_a: {
        en: 'Pin A is further north beyond the fountain; Noah described an immediate left on the lower park path.',
        th: 'จุด A อยู่ถัดขึ้นไปด้านบน แต่โนอาห์บอกให้เลี้ยวซ้ายล่างทันทีข้างสถานี',
      },
      pin_b: {
        en: 'Pin B is on the northeast pier far away from the lower green park.',
        th: 'จุด B อยู่ด้านบนขวา ไม่ได้อยู่ติดสวนทางซ้ายล่าง',
      },
      pin_c: {
        en: 'Pin C goes right toward Darling Harbour, whereas this path goes immediate left.',
        th: 'จุด C ต้องเลี้ยวขวา แต่เส้นทางนี้ให้เลี้ยวซ้าย',
      },
      pin_d: {
        en: 'Taking the immediate left along the green park leads straight to Gardens Help Point (Pin D)!',
        th: 'เลี้ยวซ้ายล่างเข้าสู่ทางเดินสวนสีเขียวจะถึง Gardens Help Point (จุด D) ทันที!',
      },
    },
  },
];

// ---------------------------------------------------------------------------
// MINI-GAME 3 — CAFÉ ORDER QUEST (harbour_market_cafe)
// Mechanic: Interactive Café Order Simulation (Menu + Order Tray)
// ---------------------------------------------------------------------------

export interface CafeMenuItem {
  id: string;
  itemName: LocalizedText;
  samplePriceAud: string; // Clearly labeled fictional game example price
  tag: LocalizedText;
  visualKind: 'wrap' | 'smoothie' | 'banana_bread' | 'flat_white';
}

export const HARBOUR_CAFE_SAMPLE_MENU: CafeMenuItem[] = [
  {
    id: 'veg_wrap',
    itemName: { en: 'Garden Vegie Wrap', th: 'แรปผักย่างเพื่อสุขภาพ' },
    samplePriceAud: '$6.00',
    tag: { en: 'Vegetarian · Fictional price', th: 'มังสวิรัติ · ราคาจำลอง' },
    visualKind: 'wrap',
  },
  {
    id: 'berry_smoothie',
    itemName: { en: 'Iced Berry Smoothie', th: 'สมูทตี้เบอร์รี่เย็น' },
    samplePriceAud: '$4.50',
    tag: { en: 'Chilled Drink · Fictional price', th: 'เครื่องดื่มเย็น · ราคาจำลอง' },
    visualKind: 'smoothie',
  },
  {
    id: 'banana_bread',
    itemName: { en: 'Toasted Banana Bread', th: 'ขนมปังกล้วยอบปิ้ง' },
    samplePriceAud: '$4.00',
    tag: { en: 'Bakery · Fictional price', th: 'เบเกอรี่ · ราคาจำลอง' },
    visualKind: 'banana_bread',
  },
  {
    id: 'flat_white',
    itemName: { en: 'Oat Milk Flat White', th: 'แฟลตไวท์นมโอ๊ต' },
    samplePriceAud: '$4.20',
    tag: { en: 'Dairy-Free Option · Fictional price', th: 'ทางเลือกไม่มีนมวัว · ราคาจำลอง' },
    visualKind: 'flat_white',
  },
];

export interface CafeOrderChallenge {
  id: string;
  trayItemToAdd?: 'wrap' | 'smoothie' | 'banana_bread' | 'takeaway_bag' | 'receipt_stamp';
  miaPrompt: {
    a2: LocalizedText;
    b1: LocalizedText;
  };
  customerGoal: {
    a2: LocalizedText;
    b1: LocalizedText;
  };
  hint: LocalizedText;
  acceptedOptionIds: string[];
  options: DiscoveryExpressionOption[];
}

export const CAFE_ORDER_CHALLENGES: CafeOrderChallenge[] = [
  {
    id: 'co_order_food',
    trayItemToAdd: 'wrap',
    miaPrompt: {
      a2: {
        en: 'Mia smiles: "Hi! What can I get for you today?"',
        th: 'มีอายิ้มทักทาย: "สวัสดีค่ะ วันนี้รับอะไรดีคะ?"',
      },
      b1: {
        en: 'Mia says: "Morning! Ready whenever you’d like to place your order at the counter."',
        th: 'มีอาพูด: "สวัสดีตอนเช้าค่ะ พร้อมสั่งเมื่อไรบอกได้เลยนะคะ"',
      },
    },
    customerGoal: {
      a2: {
        en: 'Order a Garden Vegie Wrap politely.',
        th: 'สั่ง Garden Vegie Wrap อย่างสุภาพ',
      },
      b1: {
        en: 'Politely ask Mia for a Garden Vegie Wrap using natural café phrasing.',
        th: 'สั่ง Garden Vegie Wrap ด้วยรูปประโยคคาเฟ่ที่เป็นธรรมชาติและสุภาพ',
      },
    },
    hint: {
      en: 'Use a polite modal opener like "Could I have..." or "Can I please get..." with the wrap.',
      th: 'ใช้ประโยคสุภาพอย่าง "Could I have..." หรือ "Can I please get..." คู่กับเมนูที่ต้องการ',
    },
    acceptedOptionIds: ['co1_a', 'co1_b'],
    options: [
      {
        id: 'co1_a',
        a2Text: 'Could I have a Garden Vegie Wrap, please?',
        b1Text: "Hi Mia! Could I please have a Garden Vegie Wrap when you're ready?",
        feedback: {
          en: '"Could I have..., please?" is the gold-standard polite way to order at any English café.',
          th: '"Could I have..., please?" เป็นประโยคสั่งอาหารที่สุภาพและเป็นธรรมชาติมากที่สุด',
        },
      },
      {
        id: 'co1_b',
        a2Text: "I'd like a Garden Vegie Wrap, please.",
        b1Text: "Could I grab a Garden Vegie Wrap, please?",
        feedback: {
          en: '"I\'d like..." and polite "Could I grab..., please?" sound friendly and natural in Sydney cafés.',
          th: '"I\'d like..." และ "Could I grab..., please?" ฟังดูสุภาพและเข้ากับบรรยากาศคาเฟ่ในซิดนีย์',
        },
      },
      {
        id: 'co1_c',
        a2Text: 'Give me the wrap right now.',
        b1Text: 'Put a wrap in front of me quickly.',
        feedback: {
          en: 'Saying "Give me" without "please" or a soft modal feels too abrupt for café staff.',
          th: 'การใช้ "Give me" โดยไม่มีคำว่า please หรือรูปคำขอที่นุ่มนวลฟังดูแข็งเกินไป',
        },
      },
      {
        id: 'co1_d',
        a2Text: 'Where is the train timetable?',
        b1Text: 'What time does the Harbour Bridge museum close?',
        feedback: {
          en: 'Mia asked for your food order—checking train timetables is better suited to City Transit.',
          th: 'มีอากำลังรับออเดอร์อาหาร คำถามเรื่องตารางรถไฟเหมาะกับที่สถานีขนส่งมากกว่า',
        },
      },
    ],
  },
  {
    id: 'co_ask_price',
    trayItemToAdd: 'smoothie',
    miaPrompt: {
      a2: {
        en: 'Mia adds your wrap: "Sure thing! Would you like a cold drink to go with it?"',
        th: 'มีอารับออเดอร์แรป: "ได้เลยค่ะ รับเครื่องดื่มเย็นเพิ่มด้วยไหมคะ?"',
      },
      b1: {
        en: 'Mia asks: "Lovely—our berry smoothies and drinks are freshly chilled today. Any questions?"',
        th: 'มีอาถามต่อ: "สมูทตี้เบอร์รี่วันนี้สดใหม่เย็นฉ่ำเลยนะคะ สนใจสอบถามเมนูไหนไหมคะ?"',
      },
    },
    customerGoal: {
      a2: {
        en: 'Ask for the price of the Iced Berry Smoothie.',
        th: 'ถามราคาของ Iced Berry Smoothie',
      },
      b1: {
        en: 'Ask politely how much the Iced Berry Smoothie costs before deciding.',
        th: 'ถามราคาสมูทตี้เบอร์รี่อย่างสุภาพเพื่อตัดสินใจสั่งเพิ่ม',
      },
    },
    hint: {
      en: 'Use "How much is..." to ask the price of one drink politely.',
      th: 'ใช้ "How much is..." เพื่อสอบถามราคาเครื่องดื่ม 1 แก้ว',
    },
    acceptedOptionIds: ['co2_a', 'co2_b'],
    options: [
      {
        id: 'co2_a',
        a2Text: 'How much is the berry smoothie, please?',
        b1Text: 'Excuse me, how much is the Iced Berry Smoothie on your specials board?',
        feedback: {
          en: '"How much is..., please?" is crisp, polite, and gets the exact price immediately.',
          th: '"How much is..., please?" ชัดเจน สุภาพ และช่วยให้ทราบราคาทันที',
        },
      },
      {
        id: 'co2_b',
        a2Text: 'Could you tell me the price of the smoothie?',
        b1Text: 'Could you let me know how much the large berry smoothie is?',
        feedback: {
          en: 'Polite indirect questions like "Could you tell me the price of..." work wonderfully in B1 conversation.',
          th: 'คำถามทางอ้อมอย่าง "Could you tell me the price of..." สุภาพและไพเราะมาก',
        },
      },
      {
        id: 'co2_c',
        a2Text: 'How many is the smoothie clock?',
        b1Text: 'How tall is the smoothie glass price?',
        feedback: {
          en: 'Remember to use "How much is..." (not "How many is") when asking about prices!',
          th: 'ในการถามราคาในภาษาอังกฤษ เราใช้ "How much is..." ไม่ใช่ "How many"',
        },
      },
      {
        id: 'co2_d',
        a2Text: 'I never drink anything with berries.',
        b1Text: 'Your café prices should always be lower than yesterday.',
        feedback: {
          en: 'That does not ask Mia the price of the smoothie so you can decide politely.',
          th: 'ประโยคนี้ยังไม่ได้ถามราคาสมูทตี้อย่างสุภาพเพื่อประกอบการตัดสินใจ',
        },
      },
    ],
  },
  {
    id: 'co_dietary_option',
    trayItemToAdd: 'banana_bread',
    miaPrompt: {
      a2: {
        en: 'Mia says: "The Iced Berry Smoothie is $4.50! I can add that for you."',
        th: 'มีอาตอบ: "สมูทตี้เบอร์รี่ราคา 4.50 ดอลลาร์ค่ะ (ราคาตัวอย่างในเกม) รับเพิ่มเลยไหมคะ?"',
      },
      b1: {
        en: 'Mia says: "The smoothie is $4.50, and we also have bakery slices and hot drinks with alternate milks."',
        th: 'มีอาตอบ: "สมูทตี้ 4.50 ดอลลาร์ค่ะ เรายังมีเบเกอรี่และเครื่องดื่มที่เลือกชนิดนมได้ด้วยนะคะ"',
      },
    },
    customerGoal: {
      a2: {
        en: 'Ask if the café has a vegetarian or dairy-free option.',
        th: 'ถามว่าคาเฟ่มีตัวเลือกมังสวิรัติหรือแบบไม่ใส่นมวัวไหม',
      },
      b1: {
        en: 'Ask Mia politely about dietary options or substituting regular milk with oat milk.',
        th: 'ถามมีอาเรื่องตัวเลือกอาหารตามความต้องการ หรือขอเปลี่ยนเป็นนมโอ๊ต',
      },
    },
    hint: {
      en: 'Look for "Do you have a vegetarian / dairy-free option..." or asking to swap milk.',
      th: 'มองหาประโยคที่ถามว่ามีตัวเลือก "vegetarian / dairy-free" หรือขอเปลี่ยนเป็น "oat milk" หรือไม่',
    },
    acceptedOptionIds: ['co3_a', 'co3_b'],
    options: [
      {
        id: 'co3_a',
        a2Text: 'Do you have a vegetarian option?',
        b1Text: 'Could I ask if you have a dairy-free option or oat milk for the coffee?',
        feedback: {
          en: '"Do you have a ... option?" is an essential everyday phrase for checking ingredients and allergies.',
          th: '"Do you have a ... option?" เป็นประโยคสำคัญมากสำหรับสอบถามส่วนผสมและอาหารที่แพ้',
        },
      },
      {
        id: 'co3_b',
        a2Text: 'Is the banana bread good for vegetarians?',
        b1Text: 'Would it be possible to swap regular milk for oat milk in a flat white?',
        feedback: {
          en: 'Checking ingredients or politely asking "Would it be possible to swap..." keeps requests smooth.',
          th: 'การขอปรับเปลี่ยนส่วนผสมด้วยคำว่า "Would it be possible to..." สุภาพมากในระดับ B1',
        },
      },
      {
        id: 'co3_c',
        a2Text: 'You must cook a special menu just for me now.',
        b1Text: 'Change every recipe in your bakery before I sit down.',
        feedback: {
          en: 'Politely asking what options are available works much better than demanding menu changes.',
          th: 'การถามตัวเลือกที่มีอยู่ด้วยความสุภาพย่อมดีกว่าการสั่งให้เปลี่ยนสูตรอาหาร',
        },
      },
      {
        id: 'co3_d',
        a2Text: 'Excuse me, which platform goes to Darling Harbour?',
        b1Text: 'Does a Harbour Cruise ticket include the aquarium deck?',
        feedback: {
          en: 'That is a transit or tour question—right now you are checking Mia’s café dietary options.',
          th: 'คำถามนี้เกี่ยวกับรถไฟหรือตั๋วเรือ ยังไม่ตรงกับการถามเมนูอาหารกับมีอา',
        },
      },
    ],
  },
  {
    id: 'co_takeaway_request',
    trayItemToAdd: 'takeaway_bag',
    miaPrompt: {
      a2: {
        en: 'Mia packs your snacks: "Yes, our banana bread and oat flat white are ready! Having it here or to go?"',
        th: 'มีอาจัดรายการ: "ได้ค่ะ ขนมปังกล้วยและกาแฟนมโอ๊ตพร้อมเลย จะทานที่นี่หรือใส่ถุงกลับดีคะ?"',
      },
      b1: {
        en: 'Mia checks before wrapping: "Everything is fresh from the press. Would you like to eat at the patio or take away?"',
        th: 'มีอาถามย้ำก่อนห่อ: "ทุกอย่างอบสดใหม่พร้อมแล้วค่ะ จะนั่งทานที่ลานด้านนอกหรือรับกลับดีคะ?"',
      },
    },
    customerGoal: {
      a2: {
        en: 'Ask politely to have your order to take away.',
        th: 'ขอให้จัดอาหารและเครื่องดื่มแบบนำกลับอย่างสุภาพ',
      },
      b1: {
        en: 'Confirm you would like your food and drink to take away so you can continue exploring.',
        th: 'ตอบยืนยันอย่างสุภาพว่าขอรับกลับ เพื่อจะได้เดินสำรวจอ่าวต่อ',
      },
    },
    hint: {
      en: 'In Australia, "to take away" is the standard phrase for carrying food out.',
      th: 'ในออสเตรเลียนิยมใช้คำว่า "to take away" สำหรับการสั่งกลับ',
    },
    acceptedOptionIds: ['co4_a', 'co4_b'],
    options: [
      {
        id: 'co4_a',
        a2Text: 'Could I have that to take away, please?',
        b1Text: 'Could I please have all of that to take away? I am walking toward the harbour.',
        feedback: {
          en: '"Could I have that to take away, please?" is natural Australian English and very polite.',
          th: '"Could I have that to take away, please?" เป็นภาษาอังกฤษแบบออสเตรเลียที่สุภาพและชัดเจน',
        },
      },
      {
        id: 'co4_b',
        a2Text: 'Take away, please!',
        b1Text: 'To take away would be great, thank you!',
        feedback: {
          en: 'Clear, cheerful, and matches Mia’s "eat here or take away" question directly.',
          th: 'กระชับ สดใส และตอบคำถามของมีอาได้ตรงจุด',
        },
      },
      {
        id: 'co4_c',
        a2Text: 'Throw it in the water, please.',
        b1Text: 'Leave my food on the railway platform.',
        feedback: {
          en: 'Look closely—you want to carry your lunch with you, not leave it behind!',
          th: 'ตรวจสอบความหมายอีกครั้ง เราต้องการรับอาหารใส่ถุงพกไปทานต่อ',
        },
      },
      {
        id: 'co4_d',
        a2Text: 'How old is the café building?',
        b1Text: 'What is the population of Edinburgh today?',
        feedback: {
          en: 'Mia needs to know whether to pack a takeaway bag or serve your food on plates.',
          th: 'มีอากำลังรอคำตอบเรื่องทานที่นี่หรือนำกลับ เพื่อให้จัดเสิร์ฟได้ถูกต้อง',
        },
      },
    ],
  },
  {
    id: 'co_close_order',
    trayItemToAdd: 'receipt_stamp',
    miaPrompt: {
      a2: {
        en: 'Mia hands over your takeaway bag: "Here you go! Anything else I can get you?"',
        th: 'มีอายื่นถุงอาหารให้: "เรียบร้อยแล้วค่ะ ต้องการรับอะไรเพิ่มเติมอีกไหมคะ?"',
      },
      b1: {
        en: 'Mia places a paper napkin inside: "All packed for take away! Would you like to add anything else today?"',
        th: 'มีอาใส่กระดาษเช็ดปากให้เรียบร้อย: "ห่อสำหรับนำกลับครบแล้วค่ะ มีอะไรอยากรับเพิ่มอีกไหมคะ?"',
      },
    },
    customerGoal: {
      a2: {
        en: 'Finish your order politely.',
        th: 'จบการสั่งอาหารอย่างสุภาพ',
      },
      b1: {
        en: 'Politely let Mia know your order is complete and thank her warmly.',
        th: 'บอกมีอาอย่างสุภาพว่าครบเรียบร้อยแล้วพร้อมกล่าวขอบคุณ',
      },
    },
    hint: {
      en: 'Pick a warm closing like "That\'s all, thank you!"',
      th: 'เลือกประโยคจบการสั่งที่สุภาพ เช่น "That\'s all, thank you!"',
    },
    acceptedOptionIds: ['co5_a', 'co5_b'],
    options: [
      {
        id: 'co5_a',
        a2Text: "That's all, thank you!",
        b1Text: "That's everything for today, thank you so much!",
        feedback: {
          en: '"That\'s all, thank you!" clearly signals you are finished ordering while staying warm and polite.',
          th: '"That\'s all, thank you!" ช่วยบอกชัดเจนว่าสั่งครบแล้วอย่างสุภาพและอบอุ่น',
        },
      },
      {
        id: 'co5_b',
        a2Text: 'No thanks, I have everything!',
        b1Text: "I'm all set now—thanks very much for your help!",
        feedback: {
          en: 'Saying you are all set and thanking Mia ends the café interaction smoothly.',
          th: 'การบอกว่าครบแล้วและขอบคุณมีอาช่วยปิดบทสนทนาได้อย่างน่ารัก',
        },
      },
      {
        id: 'co5_c',
        a2Text: 'Excuse me, start the entire menu again.',
        b1Text: 'Why are you asking if I want anything else?',
        feedback: {
          en: 'Mia is just being helpful before printing the receipt—a simple polite "That\'s all" completes the order.',
          th: 'พนักงานถามเพื่อเช็กความเรียบร้อย การตอบสั้นๆ ว่า "That\'s all, thank you" สุภาพกว่ามาก',
        },
      },
      {
        id: 'co5_d',
        a2Text: 'No.',
        b1Text: 'Done. Goodbye forever.',
        feedback: {
          en: 'A bare "No." can feel slightly brusque; adding "thank you" keeps the friendly Australian tone.',
          th: 'การตอบแค่ "No." ดูห้วนเกินไป การเติม "thank you" ทำให้ฟังดูเป็นมิตรขึ้นมาก',
        },
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// MINI-GAME 4 — TICKET TALK CHALLENGE (darling_harbour_hub)
// Mechanic: Information Board Investigation (Fictional Game Schedule)
// ---------------------------------------------------------------------------

export interface HarbourBoardActivityRow {
  id: string;
  name: LocalizedText;
  sessions: string;
  standardSamplePrice: string;
  studentSamplePrice: string;
  bundleSamplePrice: string;
  includesExhibition: LocalizedText;
  highlightNote: LocalizedText;
}

export const DARLING_HARBOUR_INFO_BOARD: HarbourBoardActivityRow[] = [
  {
    id: 'glass_boat_cruise',
    name: { en: 'Harbour Glass-Boat Cruise', th: 'ล่องเรือท้องกระจกชมอ่าว' },
    sessions: '10:30 AM · 1:15 PM · 3:45 PM',
    standardSamplePrice: '$24',
    studentSamplePrice: '$16',
    bundleSamplePrice: '$30',
    includesExhibition: {
      en: 'Guided commentary on 1:15 PM & 3:45 PM sailings; Bundle adds Reef Gallery entry',
      th: 'มีไกด์บรรยายรอบ 1:15 PM และ 3:45 PM · แพ็กเกจ Bundle รวมค่าเข้า Reef Gallery',
    },
    highlightNote: {
      en: 'Popular 45-min loop (Fictional example schedule)',
      th: 'รอบล่องเรือ 45 นาที (ตารางตัวอย่างในเกม)',
    },
  },
  {
    id: 'reef_gallery',
    name: { en: 'Sea Life Reef Gallery', th: 'นิทรรศการแนวปะการังใต้ทะเล' },
    sessions: '9:30 AM · 12:00 PM · 2:30 PM',
    standardSamplePrice: '$18',
    studentSamplePrice: '$12',
    bundleSamplePrice: '$30',
    includesExhibition: {
      en: 'Includes Coral Exhibition Zone & Audio Map',
      th: 'รวมโซนนิทรรศการปะการังและแผนที่เสียงบรรยาย',
    },
    highlightNote: {
      en: 'Indoor interactive zone (Fictional example prices)',
      th: 'โซนในร่มแบบอินเทอร์แอกทีฟ (ราคาตัวอย่างในเกม)',
    },
  },
  {
    id: 'heritage_deck',
    name: { en: 'Maritime Heritage Deck Tour', th: 'ทัวร์ดาดฟ้าเรือประวัติศาสตร์' },
    sessions: '11:00 AM · 2:00 PM · 4:15 PM',
    standardSamplePrice: '$15',
    studentSamplePrice: '$10',
    bundleSamplePrice: '$22',
    includesExhibition: {
      en: 'Guided tour led by harbour volunteers (Bundle adds Souvenir Booklet)',
      th: 'มีทัวร์นำชมโดยอาสาสมัคร (Bundle แถมสมุดภาพที่ระลึก)',
    },
    highlightNote: {
      en: '35-min outdoor deck walk (Fictional example only)',
      th: 'เดินชม 35 นาทีกลางแจ้ง (ข้อมูลตัวอย่างในเกมเท่านั้น)',
    },
  },
];

export interface TicketTalkChallenge {
  id: string;
  focusBoardTab: 'times' | 'tickets' | 'inclusions';
  prompt: {
    a2: LocalizedText;
    b1: LocalizedText;
  };
  boardClue: LocalizedText;
  hint: LocalizedText;
  acceptedOptionIds: string[];
  options: DiscoveryExpressionOption[];
}

export const TICKET_TALK_CHALLENGES: TicketTalkChallenge[] = [
  {
    id: 'tt_start_time',
    focusBoardTab: 'times',
    prompt: {
      a2: {
        en: 'You want to join the morning Harbour Glass-Boat Cruise. Check the board and pick the true answer & best follow-up question!',
        th: 'คุณอยากลงเรือรอบเช้า Harbour Glass-Boat Cruise ลองดูตารางแล้วเลือกคำตอบที่ตรงกับกระดานข้อมูล!',
      },
      b1: {
        en: 'Your friend wants to catch the earliest Harbour Glass-Boat Cruise and confirm its exact departure with Jack.',
        th: 'เพื่อนของคุณอยากขึ้นเรือรอบแรกสุดของ Harbour Glass-Boat Cruise และอยากถามยืนยันเวลากับแจ็ก',
      },
    },
    boardClue: {
      en: 'Check the Session Times column for Harbour Glass-Boat Cruise on the board above.',
      th: 'ตรวจดูคอลัมน์รอบเวลา (Sessions) ของ Harbour Glass-Boat Cruise ด้านบน',
    },
    hint: {
      en: 'The morning Harbour Glass-Boat Cruise starts at 10:30 AM.',
      th: 'เรือ Harbour Glass-Boat Cruise รอบแรกออกเดินทางเวลา 10:30 AM',
    },
    acceptedOptionIds: ['tt1_a'],
    options: [
      {
        id: 'tt1_a',
        a2Text: 'It starts at 10:30 AM. "What time does the morning tour start?"',
        b1Text: 'The first sailing leaves at 10:30 AM—"Could you confirm if boarding starts 10 minutes before 10:30 AM?"',
        feedback: {
          en: '10:30 AM matches the board’s morning sailing, and confirming boarding time shows smart planning.',
          th: 'เวลา 10:30 AM ตรงกับกระดานข้อมูล และคำถามยืนยันเวลาขึ้นเรือช่วยให้วางแผนได้แม่นยำ',
        },
      },
      {
        id: 'tt1_b',
        a2Text: 'It starts at 2:30 PM. "When do you close the café?"',
        b1Text: 'The earliest cruise departs at 2:30 PM—"Do you have any boats at midnight?"',
        feedback: {
          en: '2:30 PM is a Sea Life Reef Gallery session, not the morning Harbour Glass-Boat Cruise.',
          th: 'เวลา 2:30 PM เป็นรอบของ Sea Life Reef Gallery ไม่ใช่รอบเรือตอนเช้า',
        },
      },
      {
        id: 'tt1_c',
        a2Text: 'It starts at 4:15 PM. "How much is a banana bread?"',
        b1Text: '4:15 PM is the first morning boat—"Are student passes free today?"',
        feedback: {
          en: '4:15 PM is an afternoon Maritime Heritage Deck Tour slot, not morning.',
          th: 'เวลา 4:15 PM เป็นรอบบ่ายของ Maritime Heritage Deck Tour',
        },
      },
      {
        id: 'tt1_d',
        a2Text: 'The boat tour has no timetable on the board.',
        b1Text: 'Jack says visitors are not allowed to ask departure questions.',
        feedback: {
          en: 'All three times (10:30 AM, 1:15 PM, 3:45 PM) are clearly listed on Jack’s board.',
          th: 'บนกระดานมีเวลารอบเรือแสดงไว้ครบทั้ง 3 รอบแล้ว ลองเช็กดูอีกครั้งนะ',
        },
      },
    ],
  },
  {
    id: 'tt_student_ticket',
    focusBoardTab: 'tickets',
    prompt: {
      a2: {
        en: 'Check the sample ticket prices for Sea Life Reef Gallery. How do you ask for the student rate?',
        th: 'ดูราคาตัวอย่างของ Sea Life Reef Gallery แล้วเลือกประโยคสอบถามราคาบัตรนักเรียนที่ถูกต้อง',
      },
      b1: {
        en: 'You have a student card and notice Reef Gallery lists $18 Standard vs $12 Student. Pick the accurate statement and question.',
        th: 'คุณมีบัตรนักเรียนและเห็นราคาปกติ $18 กับนักเรียน $12 เลือกคำกล่าวและคำถามที่ถูกต้อง',
      },
    },
    boardClue: {
      en: 'Compare the Standard and Student sample ticket prices on the Reef Gallery row.',
      th: 'เปรียบเทียบราคาบัตร Standard กับ Student ของแถว Sea Life Reef Gallery',
    },
    hint: {
      en: 'Student ticket for Sea Life Reef Gallery is $12 (fictional sample price), $6 less than Standard.',
      th: 'บัตรนักเรียนของ Sea Life Reef Gallery คือ $12 (ราคาตัวอย่างในเกม)',
    },
    acceptedOptionIds: ['tt2_a', 'tt2_b'],
    options: [
      {
        id: 'tt2_a',
        a2Text: 'Student is $12! "How much is a student ticket for the Reef Gallery?"',
        b1Text: 'The Student pass is $12 instead of $18—"Do I just show my school ID for the student rate?"',
        feedback: {
          en: 'Spot on! You read the $12 student rate accurately and asked a natural ticket-desk question.',
          th: 'ถูกต้อง! คุณอ่านราคาบัตรนักเรียน $12 ได้แม่นยำและถามเงื่อนไขได้เป็นธรรมชาติ',
        },
      },
      {
        id: 'tt2_b',
        a2Text: 'It is $12 for students. "Can I buy a student ticket, please?"',
        b1Text: 'Reef Gallery offers a $12 student option—"Could I grab a student ticket for the 12:00 PM session?"',
        feedback: {
          en: 'Great interaction! Pairing the $12 sample student fare with a polite request works smoothly.',
          th: 'เยี่ยมมาก! จับคู่ราคาบัตรนักเรียน $12 กับการขอซื้อตั๋วอย่างสุภาพได้สมบูรณ์แบบ',
        },
      },
      {
        id: 'tt2_c',
        a2Text: 'Student is $30! "Why does a deck tour cost $30?"',
        b1Text: 'The Student pass for Reef Gallery is $30, more expensive than Standard.',
        feedback: {
          en: 'Look closely—$30 is the two-attraction Bundle sample price, whereas a Student Reef pass is $12.',
          th: '$30 คือราคาแพ็กเกจ Bundle รวม 2 กิจกรรม ไม่ใช่ราคาบัตรนักเรียนเดี่ยว ($12)',
        },
      },
      {
        id: 'tt2_d',
        a2Text: 'The café sells student wraps at Darling Harbour.',
        b1Text: 'Give me a discount without checking any attraction board.',
        feedback: {
          en: 'Check the sample ticket table carefully and use polite question phrasing with Jack.',
          th: 'ลองเช็กตารางราคาตั๋วด้านบนแล้วใช้คำถามที่สุภาพกับแจ็กนะ',
        },
      },
    ],
  },
  {
    id: 'tt_guided_tour',
    focusBoardTab: 'inclusions',
    prompt: {
      a2: {
        en: 'You want an outdoor walk with a live guide. Look at the board and pick the best question for Jack.',
        th: 'คุณอยากเดินชมกลางแจ้งแบบมีไกด์นำทาง ดูข้อมูลบนกระดานแล้วเลือกคำถามที่ตรงกับแจ็ก',
      },
      b1: {
        en: 'You are deciding between 10:30 AM boat cruise and Maritime Heritage Deck Tour. Which board detail & question fits best?',
        th: 'คุณกำลังเทียบระหว่างล่องเรือรอบ 10:30 AM กับทัวร์ดาดฟ้า Maritime Heritage Deck ข้อใดตรงความจริงบนกระดาน',
      },
    },
    boardClue: {
      en: 'Read the Inclusions column for Maritime Heritage Deck Tour and the 10:30 AM boat note.',
      th: 'ดูคอลัมน์รายละเอียดที่รวมในตั๋วของ Maritime Heritage Deck Tour และรอบเรือ 10:30 AM',
    },
    hint: {
      en: 'Maritime Heritage Deck Tour is an outdoor deck walk led by a guided volunteer team.',
      th: 'Maritime Heritage Deck Tour เป็นการเดินชมกลางแจ้งพร้อมไกด์อาสาสมัคร',
    },
    acceptedOptionIds: ['tt3_a'],
    options: [
      {
        id: 'tt3_a',
        a2Text: 'Maritime Heritage Deck Tour! "Is there a guided tour at 11:00 AM?"',
        b1Text: 'Maritime Heritage Deck Tour includes a guided volunteer walk—"Does the 11:00 AM deck tour require booking ahead?"',
        feedback: {
          en: 'Great detective work! Maritime Heritage Deck Tour lists a volunteer-led guided tour at 11:00 AM.',
          th: 'สืบค้นได้เก่งมาก! Maritime Heritage Deck Tour มีทัวร์นำชมโดยอาสาสมัครรอบ 11:00 AM',
        },
      },
      {
        id: 'tt3_b',
        a2Text: 'The 10:30 AM cruise has a museum booklet inside a smoothie.',
        b1Text: 'The 10:30 AM cruise explicitly guarantees live guided commentary unlike 1:15 PM.',
        feedback: {
          en: 'Look at the board: guided commentary on the boat is listed for 1:15 PM and 3:45 PM, not 10:30 AM!',
          th: 'ดูบนกระดานดีๆ: เรือที่มีไกด์บรรยายระบุเฉพาะรอบ 1:15 PM และ 3:45 PM (ไม่ใช่ 10:30 AM)',
        },
      },
      {
        id: 'tt3_c',
        a2Text: 'None of the harbour activities have a guide.',
        b1Text: 'Guided tours are forbidden at Darling Harbour Hub.',
        feedback: {
          en: 'Both the afternoon cruises (1:15 PM / 3:45 PM) and Maritime Heritage Deck Tour feature guided experiences!',
          th: 'ทั้งเรือรอบบ่ายและ Maritime Heritage Deck Tour ล้วนมีไกด์แนะนำทั้งคู่เลย',
        },
      },
      {
        id: 'tt3_d',
        a2Text: 'Excuse me, take away my banana bread, please.',
        b1Text: 'Could you paint my boat hull purple?',
        feedback: {
          en: 'Stick to asking about harbour guided tours using the information board details.',
          th: 'เลือกคำถามเกี่ยวกับทัวร์นำชมตามข้อมูลบนกระดานท่องเที่ยวด้านบนนะ',
        },
      },
    ],
  },
  {
    id: 'tt_bundle_compare',
    focusBoardTab: 'tickets',
    prompt: {
      a2: {
        en: 'You want BOTH the Glass-Boat Cruise and Sea Life Reef Gallery. Check if the $30 Bundle saves money!',
        th: 'คุณอยากเข้าทั้งล่องเรือและ Reef Gallery ลองเช็กว่าแพ็กเกจ Bundle $30 คุ้มกว่าซื้อแยกหรือไม่!',
      },
      b1: {
        en: 'A friend asks whether buying the $30 Bundle or two separate Standard tickets ($24 + $18) is smarter, and what question to ask Jack.',
        th: 'เพื่อนถามว่าซื้อ Bundle $30 กับซื้อแยกบัตร Standard 2 ใบ ($24 + $18) แบบไหนคุ้มกว่าและควรถามแจ็กอย่างไร',
      },
    },
    boardClue: {
      en: 'Compare $24 + $18 separate Standard passes against the $30 Bundle (fictional example prices).',
      th: 'เทียบราคารวมบัตรปกติ $24 + $18 กับแพ็กเกจ Bundle $30',
    },
    hint: {
      en: '$24 + $18 = $42 separate, while the Bundle is $30 (saves $12 in this game example).',
      th: 'ซื้อแยกคือ $24 + $18 = $42 ส่วน Bundle เพียง $30 และควรถามยืนยันสิ่งที่รวมในแพ็กเกจ',
    },
    acceptedOptionIds: ['tt4_a', 'tt4_b'],
    options: [
      {
        id: 'tt4_a',
        a2Text: 'Yes, Bundle is $30! "Does the $30 Bundle ticket include the exhibition?"',
        b1Text: 'The $30 Bundle saves $12 over $42 separate tickets—"Does the Bundle let us visit the Reef exhibition on the same afternoon?"',
        feedback: {
          en: 'Comparing costs accurately and checking inclusion rules ("Does the ticket include...") is top communication!',
          th: 'ทั้งคำนวณส่วนต่างได้แม่นยำและถามย้ำเงื่อนไขที่รวมในตั๋วได้อย่างเป็นมืออาชีพ!',
        },
      },
      {
        id: 'tt4_b',
        a2Text: 'Bundle saves money! "Can we use the Bundle for both boat and reef?"',
        b1Text: 'Buying the $30 Bundle is clearly cheaper than $42 separate—"Could you confirm if both Boat and Reef entry use one pass?"',
        feedback: {
          en: 'Verifying that one Bundle covers both attractions avoids confusion at the gate.',
          th: 'การถามยืนยันว่าแพ็กเกจรวมทั้ง 2 กิจกรรมในบัตรเดียวช่วยลดความสับสนหน้าประตู',
        },
      },
      {
        id: 'tt4_c',
        a2Text: 'Two separate tickets are cheaper at $42 than $30.',
        b1Text: '$42 costs less than $30, so avoid the Bundle.',
        feedback: {
          en: 'Check the math on our sample board: $24 + $18 = $42, which is more expensive than $30!',
          th: 'ลองบวกตัวเลขอีกที: $24 + $18 = $42 ซึ่งแพงกว่า $30 นะ',
        },
      },
      {
        id: 'tt4_d',
        a2Text: 'Bundle means free dinner at Circular Quay.',
        b1Text: 'The $30 Bundle only covers coffee at Mia’s bakery.',
        feedback: {
          en: 'The board shows the $30 Bundle covers Glass-Boat Cruise + Sea Life Reef Gallery.',
          th: 'กระดานข้อมูลระบุว่า Bundle $30 รวมการล่องเรือและเข้าชม Reef Gallery เท่านั้น',
        },
      },
    ],
  },
  {
    id: 'tt_ask_recommendation',
    focusBoardTab: 'inclusions',
    prompt: {
      a2: {
        en: 'It is sunny at 1:00 PM and you have one hour free. Ask Jack to recommend an activity!',
        th: 'ตอนนี้บ่ายโมงอากาศสดใสและคุณมีเวลาว่าง 1 ชั่วโมง ลองขอคำแนะนำกิจกรรมจากแจ็ก',
      },
      b1: {
        en: 'You prefer outdoor scenery over indoor rooms and have about 45 minutes free around 1:15 PM. How do you ask Jack?',
        th: 'คุณชอบชมวิวกลางแจ้งมากกว่าในร่ม และมีเวลาราว 45 นาทีช่วงบ่ายโมงสิบห้า คุณจะขอคำแนะนำอย่างไร',
      },
    },
    boardClue: {
      en: 'Look for a polite recommendation request tailored to the afternoon time or preference.',
      th: 'เลือกประโยคขอคำแนะนำที่เหมาะกับเวลาช่วงบ่ายและความชอบกลางแจ้ง',
    },
    hint: {
      en: 'Use "Could you recommend..." or ask which afternoon tour fits 45 minutes best.',
      th: 'ใช้ "Could you recommend..." เพื่อขอคำแนะนำกิจกรรมช่วงบ่าย',
    },
    acceptedOptionIds: ['tt5_a', 'tt5_b'],
    options: [
      {
        id: 'tt5_a',
        a2Text: 'Could you recommend an outdoor activity for this afternoon?',
        b1Text: 'We have about 45 minutes and love outdoor views—would you recommend the 1:15 PM cruise or the deck tour?',
        feedback: {
          en: 'Giving your time limit or preference helps Jack recommend the 1:15 PM cruise with guided commentary!',
          th: 'การบอกเวลาที่มีและความชอบช่วยให้แจ็กแนะนำรอบเรือ 1:15 PM ได้ตรงใจที่สุด',
        },
      },
      {
        id: 'tt5_b',
        a2Text: 'What do you recommend if we only have one hour?',
        b1Text: 'Could you recommend the best harbour experience for a sunny 1:15 PM slot?',
        feedback: {
          en: 'Open recommendation questions ("What do you recommend...") invite friendly local advice.',
          th: 'ประโยคขอคำแนะนำอย่าง "What do you recommend..." ช่วยให้ได้คำตอบที่เป็นประโยชน์มาก',
        },
      },
      {
        id: 'tt5_c',
        a2Text: 'Never recommend anything to tourists.',
        b1Text: 'Close the Visitor Hub because it is 1:00 PM.',
        feedback: {
          en: 'Jack is the Visitor Centre Guide and loves helping travellers choose great harbour experiences!',
          th: 'แจ็กเป็นเจ้าหน้าที่ศูนย์บริการนักท่องเที่ยวที่ยินดีช่วยแนะนำกิจกรรมอยู่เสมอ',
        },
      },
      {
        id: 'tt5_d',
        a2Text: 'How much is a train ticket to Scotland?',
        b1Text: 'Turn left at the oatcake bakery next to Ben Nevis.',
        feedback: {
          en: 'Stay in Sydney Harbour! Ask Jack for a Darling Harbour activity recommendation.',
          th: 'อย่าลืมว่าตอนนี้เราอยู่ที่ซิดนีย์ ลองถามแจ็กเรื่องกิจกรรมรอบอ่าวซิดนีย์นะ',
        },
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// MINI-GAME 5 — COMMUNICATION RESCUE (harbour_gardens_help_point)
// Mechanic: Dialogue Repair Challenge (Branching scripted follow-ups)
// ---------------------------------------------------------------------------

export interface DialogueRepairOption extends DiscoveryExpressionOption {
  branchReply: LocalizedText;
  keepsConversationAlive: boolean;
}

export interface CommunicationRescueChallenge {
  id: string;
  speakerName: string;
  breakdownTag: LocalizedText;
  speakerLineA2: LocalizedText;
  speakerLineB1: LocalizedText;
  oliviaHelpHint: LocalizedText;
  acceptedOptionIds: string[];
  options: DialogueRepairOption[];
}

export const COMMUNICATION_RESCUE_CHALLENGES: CommunicationRescueChallenge[] = [
  {
    id: 'cr_fast_speech',
    speakerName: 'Ferry Pier Attendant',
    breakdownTag: {
      en: 'Spoke very fast',
      th: 'พูดเร็วมาก',
    },
    speakerLineA2: {
      en: 'Attendant says rapidly: "Nextboatsthereonwharf4acrosspastthearch!"',
      th: 'เจ้าหน้าที่พูดเร็วมาก: "เรือถัดไปอยู่ท่า 4 เดินข้ามซุ้มตรงนั้นไปเลย!" (รัวจนฟังไม่ทัน)',
    },
    speakerLineB1: {
      en: 'Attendant speaks quickly over wind noise: "CatchtheManlyjettyonwharffourbeforethebellgoes!"',
      th: 'เจ้าหน้าที่พูดเร็วท่ามกลางเสียงลม: "ไปท่า 4 ก่อนระฆังดังไม่งั้นไม่ทันเรือน่ะ!"',
    },
    oliviaHelpHint: {
      en: 'When someone rushes past your ear, calmly ask them to slow down or repeat once.',
      th: 'เมื่อคู่สนทนาพูดเร็วเกินไป ให้ขออย่างสุภาพให้พูดช้าลงหรือพูดซ้ำอีกครั้ง',
    },
    acceptedOptionIds: ['cr1_a', 'cr1_b'],
    options: [
      {
        id: 'cr1_a',
        a2Text: 'Could you speak a little more slowly, please?',
        b1Text: 'Sorry, the wind was loud—could you say that slightly more slowly, please?',
        keepsConversationAlive: true,
        branchReply: {
          en: 'Attendant slows down warmly: "Oh, sorry about that! Take Wharf 4—right under that blue sign over there."',
          th: 'เจ้าหน้าที่ยิ้มและพูดช้าลง: "ขอโทษทีครับ! ไปที่ท่า 4 ตรงใต้ป้ายสีฟ้าทางนั้นเลยครับ"',
        },
        feedback: {
          en: 'Asking someone to speak a little more slowly works respectfully and immediately gets you clear directions.',
          th: 'การขอให้พูดช้าลงอย่างสุภาพทำให้คู่สนทนาปรับจังหวะและช่วยบอกทางชัดเจนทันที',
        },
      },
      {
        id: 'cr1_b',
        a2Text: 'Could you repeat that, please?',
        b1Text: "Sorry, I didn't catch the wharf number—could you repeat that?",
        keepsConversationAlive: true,
        branchReply: {
          en: 'Attendant nods clearly: "Sure! It is Wharf 4, right beside the blue arch."',
          th: 'เจ้าหน้าที่พยักหน้าย้ำชัด: "ได้ครับ! ท่าหมายเลข 4 ข้างซุ้มสีฟ้าเลยครับ"',
        },
        feedback: {
          en: 'Pinpointing what you missed ("I didn\'t catch the wharf number") helps the speaker repeat the key detail!',
          th: 'การบอกจุดที่ฟังไม่ทัน ("didn\'t catch the wharf number") ช่วยให้ผู้พูดย้ำข้อมูลสำคัญทันที',
        },
      },
      {
        id: 'cr1_c',
        a2Text: 'Okay, bye! (Walk away confused)',
        b1Text: 'Uh-huh, thanks, goodbye! (Pretend you understood)',
        keepsConversationAlive: false,
        branchReply: {
          en: 'The attendant waves goodbye, leaving you guessing between five different ferry gates.',
          th: 'เจ้าหน้าที่โบกมือลา ทำให้คุณยังต้องยืนเดาเองระหว่างท่าเรือหลายจุด',
        },
        feedback: {
          en: 'Ending the chat early keeps you stuck! Staying in the conversation to ask for repetition solves the problem.',
          th: 'การรีบจบทั้งที่ยังไม่เข้าใจจะทำให้หลงทาง ลองถามซ้ำอย่างสุภาพเพื่อรักษาบทสนทนาดีกว่า',
        },
      },
      {
        id: 'cr1_d',
        a2Text: 'Stop speaking English to people.',
        b1Text: 'Why are you shouting strange numbers at me?',
        keepsConversationAlive: false,
        branchReply: {
          en: 'The attendant steps back surprised because the reply sounded defensive.',
          th: 'เจ้าหน้าที่ชะงักเพราะน้ำเสียงฟังดูไม่พอใจ',
        },
        feedback: {
          en: 'A gentle "Sorry, could you repeat that?" keeps the mood calm and cooperative.',
          th: 'ใช้คำสุภาพอย่าง "Sorry, could you repeat that?" จะช่วยให้บรรยากาศดีและได้คำตอบทันที',
        },
      },
    ],
  },
  {
    id: 'cr_unknown_word',
    speakerName: 'Station Staff',
    breakdownTag: {
      en: 'Unfamiliar word: "concourse"',
      th: 'ศัพท์ที่ไม่คุ้น: "concourse"',
    },
    speakerLineA2: {
      en: 'Staff says: "Meet your group at the upper concourse near Gate 2."',
      th: 'เจ้าหน้าที่บอก: "ไปเจอกลุ่มของคุณที่ upper concourse ใกล้ประตู 2 นะ"',
    },
    speakerLineB1: {
      en: 'Staff explains: "All ferry transfers start down from the main concourse beside the southern barriers."',
      th: 'เจ้าหน้าที่อธิบาย: "จุดต่อเรือทั้งหมดให้เดินลงจาก main concourse ข้างแนวประตูทิศใต้นะ"',
    },
    oliviaHelpHint: {
      en: 'Never stay quiet when one key word blocks understanding—ask what that word means!',
      th: 'อย่าปล่อยผ่านเมื่อติดคำศัพท์สำคัญ ลองถามความหมายของคำนั้นตรงๆ ได้เลย',
    },
    acceptedOptionIds: ['cr2_a', 'cr2_b'],
    options: [
      {
        id: 'cr2_a',
        a2Text: 'What do you mean by "concourse"?',
        b1Text: 'Sorry—what does "concourse" mean? Is that the big open hall upstairs?',
        keepsConversationAlive: true,
        branchReply: {
          en: 'Staff smiles: "Good question! A concourse is simply the big main walking hall inside the station."',
          th: 'เจ้าหน้าที่ยิ้ม: "ถามได้ดีเลย! Concourse ก็คือโถงทางเดินใหญ่กลางสถานีนั่นเองครับ"',
        },
        feedback: {
          en: '"What do you mean by \'...\'?" is a confident repair tool that clears up unfamiliar words fast.',
          th: '"What do you mean by \'...\'?" เป็นเครื่องมือถามความหมายศัพท์ใหม่ที่มั่นใจและได้ผลดีมาก',
        },
      },
      {
        id: 'cr2_b',
        a2Text: 'Sorry, could you explain "concourse" in simpler words?',
        b1Text: "I'm not sure I know the word 'concourse'—is it the main open hall?",
        keepsConversationAlive: true,
        branchReply: {
          en: 'Staff clarifies: "Yes, exactly! Just the open station hall upstairs beside Gate 2."',
          th: 'เจ้าหน้าที่ช่วยยืนยัน: "ใช่เลยครับ โถงเปิดชั้นบนข้างประตู 2 นี่เอง"',
        },
        feedback: {
          en: 'Guessing a simple meaning and asking them to confirm keeps conversation natural at B1 level!',
          th: 'การลองสรุปความหมายง่ายๆ แล้วถามยืนยันช่วยให้คุยต่อได้คล่องแคล่วขึ้นมาก',
        },
      },
      {
        id: 'cr2_c',
        a2Text: 'Great, I know every word in the dictionary. Bye!',
        b1Text: 'Right, no explanation needed—see you never!',
        keepsConversationAlive: false,
        branchReply: {
          en: 'You walk away unsure where the concourse hall is.',
          th: 'คุณเดินออกมาทั้งที่ยังไม่รู้ว่าต้องไปทางไหน',
        },
        feedback: {
          en: 'Pretending to know a word wastes an easy chance to learn and get accurate directions.',
          th: 'การแสร้งว่าเข้าใจทำให้พลาดคำอธิบายง่ายๆ ลองถามความหมายเพื่อคุยต่อนะ',
        },
      },
      {
        id: 'cr2_d',
        a2Text: 'Could I have a toasted vegie wrap to go?',
        b1Text: 'How much does a student boat ticket cost on Sunday?',
        keepsConversationAlive: false,
        branchReply: {
          en: 'The staff member looks puzzled because you changed topic instead of clarifying.',
          th: 'เจ้าหน้าที่ดูงงเพราะเปลี่ยนเรื่องไปคนละทิศทาง',
        },
        feedback: {
          en: 'Stay on topic by asking what "concourse" means right there in the conversation.',
          th: 'ลองถามความหมายของคำว่า "concourse" ต่อเนื่องในบทสนทนานี้ดูนะ',
        },
      },
    ],
  },
  {
    id: 'cr_number_confusion',
    speakerName: 'Harbour Guide',
    breakdownTag: {
      en: 'Sound-alike number: 15 vs 50',
      th: 'ตัวเลขเสียงคล้ายกัน: 15 กับ 50',
    },
    speakerLineA2: {
      en: 'Harbour horn honks loudly: "The shuttle bus leaves in fif... minutes!" (Was it 15 or 50?)',
      th: 'เสียงแตรเรือดังแทรก: "รถรับส่งจะออกในอีก... นาที!" (ไม่แน่ใจว่า 15 หรือ 50 นาที)',
    },
    speakerLineB1: {
      en: 'Crowds cheer nearby: "Walk to Pier 3; the express ferry comes at 2:15—or 2:50?"',
      th: 'เสียงคนรอบข้างดังแทรก: "เดินไปท่า 3 เรือจะมาตอน 2:15 หรือ 2:50 กันแน่นะ?"',
    },
    oliviaHelpHint: {
      en: 'Repeat both sound-alike numbers to check which exact one they said.',
      th: 'ทวนตัวเลขทั้งสองค่าที่คล้ายกันเพื่อให้ผู้พูดยืนยันคำที่ถูกต้อง',
    },
    acceptedOptionIds: ['cr3_a', 'cr3_b'],
    options: [
      {
        id: 'cr3_a',
        a2Text: 'Sorry, did you say 15 or 50 minutes?',
        b1Text: "Sorry, the boat horn masked that—did you mean fifteen or fifty?",
        keepsConversationAlive: true,
        branchReply: {
          en: 'Guide holds up fingers clearly: "One-five! Fifteen minutes—plenty of time to walk over."',
          th: 'ไกด์ชูนิ้วย้ำชัดเจน: "หนึ่ง-ห้า สิบห้านาทีครับ เดินไปทันสบายๆ"',
        },
        feedback: {
          en: 'Checking "fifteen or fifty?" cleanly resolves noisy number misunderstandings in seconds.',
          th: 'การถามเช็กคู่ตัวเลขที่เสียงคล้ายกัน ("fifteen or fifty?") ช่วยไขความสับสนในเสี้ยววินาที',
        },
      },
      {
        id: 'cr3_b',
        a2Text: "Sorry, I didn't catch the number because of the horn.",
        b1Text: 'Excuse me, let me check the time—could you repeat whether it’s 2:15 or 2:50?',
        keepsConversationAlive: true,
        branchReply: {
          en: 'Guide smiles: "Good catch checking! It is two-fifteen, 15 minutes past two."',
          th: 'ไกด์ยิ้ม: "ดีมากที่ถามย้ำ! สองโมงสิบห้านาทีครับ"',
        },
        feedback: {
          en: 'Saying why you missed it (the horn) and asking them to repeat the number gets a friendly confirmation.',
          th: 'การบอกสาเหตุสั้นๆ และขอให้ย้ำตัวเลขอีกครั้งช่วยให้ได้คำตอบแน่นอน',
        },
      },
      {
        id: 'cr3_c',
        a2Text: 'Whatever! Maybe tomorrow then, bye!',
        b1Text: 'No need to repeat—I will miss the bus on purpose.',
        keepsConversationAlive: false,
        branchReply: {
          en: 'You leave without knowing whether to hurry or wait.',
          th: 'คุณเดินออกมาโดยไม่รู้ว่าต้องรีบเดินหรือรออีกนาน',
        },
        feedback: {
          en: 'Do not give up! A quick clarification prevents missing your shuttle.',
          th: 'อย่ายอมแพ้กลางคัน! คำถามทวนตัวเลขสั้นๆ ช่วยให้ไม่ตกรถแน่นอน',
        },
      },
      {
        id: 'cr3_d',
        a2Text: 'My shuttle bus is painted bright red.',
        b1Text: 'Do ferry horns play Scottish bagpipe tunes?',
        keepsConversationAlive: false,
        branchReply: {
          en: 'The guide smiles politely, still waiting to clarify the departure minutes.',
          th: 'ไกด์ยิ้มอย่างงุนงง เพราะยังไม่ได้คำถามเรื่องเวลาเลย',
        },
        feedback: {
          en: 'Keep the conversation focused by confirming the exact number with the guide.',
          th: 'ลองถามเช็กตัวเลขให้ตรงกับเวลาเดินรถที่ค้างอยู่ดูนะ',
        },
      },
    ],
  },
  {
    id: 'cr_place_confirm',
    speakerName: 'Park Volunteer',
    breakdownTag: {
      en: 'Unclear landmark reference',
      th: 'สับสนตำแหน่งสถานที่',
    },
    speakerLineA2: {
      en: 'Volunteer says: "Go wait by the harbour station kiosk." (You see two kiosks nearby!)',
      th: 'อาสาสมัครบอก: "ไปรอตรงซุ้มสถานีริมอ่าวนะ" (แต่แถวนี้มีซุ้มอยู่ 2 จุด!)',
    },
    speakerLineB1: {
      en: 'Volunteer says: "Meet your tour leader at the station near the water." (Is she talking about Circular Quay or City Transit?)',
      th: 'อาสาสมัครบอก: "ไปเจอหัวหน้าทัวร์ที่สถานีใกล้ริมน้ำนะ" (แต่ไม่แน่ใจว่าหมายถึงท่าไหน)',
    },
    oliviaHelpHint: {
      en: 'Ask "Do you mean..." with the specific place name to remove all doubt.',
      th: 'ใช้ "Do you mean..." ระบุชื่อสถานที่เพื่อเช็กให้ตรงกัน',
    },
    acceptedOptionIds: ['cr4_a', 'cr4_b'],
    options: [
      {
        id: 'cr4_a',
        a2Text: 'Do you mean the station near the harbour?',
        b1Text: 'Just to check—do you mean the blue kiosk at Circular Quay or City Transit?',
        keepsConversationAlive: true,
        branchReply: {
          en: 'Volunteer points clearly: "Circular Quay blue kiosk right near the water—good thing you asked!"',
          th: 'อาสาสมัครชี้ชัดเจน: "ซุ้มสีฟ้าที่ Circular Quay ริมน้ำเลยครับ ดีนะที่ถามให้ชัวร์!"',
        },
        feedback: {
          en: '"Do you mean..." checks specific place names so both speakers picture the exact same spot.',
          th: '"Do you mean..." ช่วยตรวจสอบชื่อสถานที่ให้ตรงกันเป๊ะ ไม่มีเดินผิดจุด',
        },
      },
      {
        id: 'cr4_b',
        a2Text: 'Let me check—is it the blue kiosk on the left?',
        b1Text: 'Let me check if I understood correctly: the ferry kiosk right beside the waterfront?',
        keepsConversationAlive: true,
        branchReply: {
          en: 'Volunteer nods: "Spot on! Right there beside the ferry boardwalk."',
          th: 'อาสาสมัครพยักหน้า: "ถูกต้องเป๊ะเลยครับ ตรงริมทางเดินท่าเรือนั้นเลย"',
        },
        feedback: {
          en: 'Checking your understanding with a visual detail ("on the left" / "beside the waterfront") avoids mix-ups.',
          th: 'การทวนความเข้าใจโดยอ้างอิงลักษณะสีหรือตำแหน่งช่วยให้ทั้งสองฝ่ายมั่นใจตรงกัน',
        },
      },
      {
        id: 'cr4_c',
        a2Text: 'Thanks! Goodbye! (Walk to a random corner)',
        b1Text: 'Sounds completely crystal clear, no questions at all! (Guess between two spots)',
        keepsConversationAlive: false,
        branchReply: {
          en: 'You stand at the empty kiosk while the rest of the group waits on the other side.',
          th: 'คุณไปยืนรอผิดจุด ขณะที่คนอื่นรวมตัวกันอีกฝั่งหนึ่ง',
        },
        feedback: {
          en: 'When two places sound similar, never end early—ask "Do you mean..." first!',
          th: 'เมื่อเห็นสถานที่ซ้ำกัน 2 จุด อย่ารีบจบการสนทนา ควรถาม "Do you mean..." ก่อนเสมอ',
        },
      },
      {
        id: 'cr4_d',
        a2Text: 'How much is a glass-boat pass?',
        b1Text: 'Could I have an oat flat white in a takeaway cup?',
        keepsConversationAlive: false,
        branchReply: {
          en: 'The volunteer blinks: "Oh, the ticket desk is across the plaza—did you still need the meeting spot?"',
          th: 'อาสาสมัครหันมาถามกลับ: "จุดขายตั๋วอยู่ฝั่งโน้นครับ สรุปยังอยากเช็กจุดนัดพบไหม?"',
        },
        feedback: {
          en: 'Confirm the meeting kiosk with "Do you mean..." before moving on.',
          th: 'ลองใช้ "Do you mean..." เช็กจุดนัดพบกับอาสาสมัครให้เคลียร์ก่อนนะ',
        },
      },
    ],
  },
  {
    id: 'cr_multi_step_recap',
    speakerName: 'Olivia Parker',
    breakdownTag: {
      en: 'Confirm multi-step plan',
      th: 'ทวนแผนหลายขั้นตอน',
    },
    speakerLineA2: {
      en: 'Olivia says: "Walk past the cafe, check the time at Darling Hub, and take the ferry at 3:15 PM."',
      th: 'โอลิเวียบอกหลายขั้น: "เดินเลยคาเฟ่ เช็กเวลาที่ Darling Hub แล้วลงเรือรอบ 3:15 PM นะ"',
    },
    speakerLineB1: {
      en: 'Olivia explains: "First validate your pass at Transit, grab lunch at Mia’s, and meet Jack before 1:15 PM for the harbour loop."',
      th: 'โอลิเวียอธิบายแผน: "ขั้นแรกเช็กบัตรที่สถานี แวะทานกลางวันที่ร้านมีอา แล้วไปหาแจ็กก่อนบ่ายโมงสิบห้าเพื่อขึ้นเรือ"',
    },
    oliviaHelpHint: {
      en: 'Summarise the steps back in your own words to confirm you understood the plan.',
      th: 'ลองทวนขั้นตอนทั้งหมดสั้นๆ กลับไปเพื่อยืนยันว่าเราจำได้ถูกต้อง',
    },
    acceptedOptionIds: ['cr5_a', 'cr5_b'],
    options: [
      {
        id: 'cr5_a',
        a2Text: 'Let me check if I understood correctly: check the time, then take the 3:15 PM ferry?',
        b1Text: 'Let me double-check if I have the order right: Transit pass first, then Mia’s café, and Jack before 1:15 PM?',
        keepsConversationAlive: true,
        branchReply: {
          en: 'Olivia beams: "Yes, 100% right! Repeating steps back in your own words is the secret to confident travel!"',
          th: 'โอลิเวียยิ้มกว้าง: "ถูกต้องร้อยเปอร์เซ็นต์เลย! การทวนแผนเป็นคำพูดของตัวเองคือเคล็ดลับสำคัญของการสื่อสาร!"',
        },
        feedback: {
          en: '"Let me check if I understood correctly..." proves active listening and confirms multi-step plans cleanly.',
          th: '"Let me check if I understood correctly..." แสดงการฟังอย่างตั้งใจและยืนยันลำดับขั้นตอนได้ครบถ้วน',
        },
      },
      {
        id: 'cr5_b',
        a2Text: 'So cafe first, then Darling Hub, then ferry at 3:15 PM—right?',
        b1Text: 'Just to recap: Transit first, lunch at Mia’s, and meet Jack prior to 1:15 PM—did I get all three?',
        keepsConversationAlive: true,
        branchReply: {
          en: 'Olivia cheers: "You nailed every step! Ready for your next Sydney communication adventure!"',
          th: 'โอลิเวียปรบมือให้: "จำได้ครบเป๊ะทุกขั้นเลย! พร้อมลุยภารกิจต่อไปในซิดนีย์แล้ว!"',
        },
        feedback: {
          en: 'Recapping key steps in sequence confirms understanding and keeps the conversation smooth.',
          th: 'การทวนขั้นตอนสำคัญตามลำดับช่วยให้มั่นใจตรงกันและปิดการสนทนาได้อย่างมืออาชีพ',
        },
      },
      {
        id: 'cr5_c',
        a2Text: 'Maybe, whatever, I will just forget step two. Bye!',
        b1Text: 'No need to check—getting the order backwards is part of the fun.',
        keepsConversationAlive: false,
        branchReply: {
          en: 'Olivia calls after you gently: "Hold on—checking the order takes just five seconds!"',
          th: 'โอลิเวียเรียกทักเบาๆ: "เดี๋ยวก่อนนะ ทวนลำดับสักห้าวินาทีจะได้ไม่เดินย้อนกลับไปมา!"',
        },
        feedback: {
          en: 'For multi-step plans, taking one moment to recap avoids forgetting a key stop.',
          th: 'สำหรับแผนที่มีหลายขั้นตอน การทวนสั้นๆ ช่วยไม่ให้ลืมขั้นตอนสำคัญ',
        },
      },
      {
        id: 'cr5_d',
        a2Text: 'Excuse me, where is the airport?',
        b1Text: 'Are penguins living in Sydney Botanical Gardens?',
        keepsConversationAlive: false,
        branchReply: {
          en: 'Olivia laughs kindly: "Cute thought—though let’s recap our harbour route first!"',
          th: 'โอลิเวียหัวเราะเอ็นดู: "คำถามน่ารักดีค่ะ แต่มาทวนแผนเดินรอบอ่าวของเราก่อนนะ!"',
        },
        feedback: {
          en: 'Use a recap phrase like "Let me check if I understood correctly..." on Olivia’s route.',
          th: 'ลองใช้ประโยคทวนความเข้าใจอย่าง "Let me check if I understood correctly..." ดูนะ',
        },
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Integrity Validator (tested in automated suite to guarantee zero bad keys)
// ---------------------------------------------------------------------------

export function validateAustraliaDiscoveryBanks(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const missionIds = new Set<string>();
  const landmarkIds = new Set<string>();

  for (const m of AUSTRALIA_DISCOVER_MISSIONS) {
    if (missionIds.has(m.missionId)) errors.push(`Duplicate missionId: ${m.missionId}`);
    missionIds.add(m.missionId);
    if (landmarkIds.has(m.landmarkId)) errors.push(`Duplicate landmarkId: ${m.landmarkId}`);
    landmarkIds.add(m.landmarkId);
  }

  const allBanks: {
    bankName: string;
    items: {
      id: string;
      acceptedOptionIds?: string[];
      correctPinId?: string;
      options?: DiscoveryExpressionOption[];
    }[];
  }[] = [
    { bankName: 'GreetingDetective', items: GREETING_DETECTIVE_SCENARIOS },
    { bankName: 'DirectionDecoder', items: DIRECTION_DECODER_CHALLENGES },
    { bankName: 'CafeOrderQuest', items: CAFE_ORDER_CHALLENGES },
    { bankName: 'TicketTalkChallenge', items: TICKET_TALK_CHALLENGES },
    { bankName: 'CommunicationRescue', items: COMMUNICATION_RESCUE_CHALLENGES },
  ];

  const seenChallengeIds = new Set<string>();

  for (const bank of allBanks) {
    for (const item of bank.items) {
      if (seenChallengeIds.has(item.id)) {
        errors.push(`Duplicate challenge ID ${item.id} in ${bank.bankName}`);
      }
      seenChallengeIds.add(item.id);

      if (item.options) {
        const optionIds = new Set(item.options.map((o) => o.id));
        if (optionIds.size !== item.options.length) {
          errors.push(`Duplicate option IDs in ${item.id}`);
        }
        if (!item.acceptedOptionIds || item.acceptedOptionIds.length === 0) {
          errors.push(`Missing acceptedOptionIds in ${item.id}`);
        } else {
          for (const acceptedId of item.acceptedOptionIds) {
            if (!optionIds.has(acceptedId)) {
              errors.push(`Invalid acceptedOptionId ${acceptedId} in ${item.id}`);
            }
          }
        }
      } else if (!item.correctPinId) {
        errors.push(`Missing correctPinId or options in ${item.id}`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
