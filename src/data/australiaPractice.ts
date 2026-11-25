import type {
  AustraliaPracticeMode,
  AustraliaSpeakingEvidenceRecord,
  LocalizedText,
} from '../types/game';
import {
  AUSTRALIA_LANDMARKS,
  AUSTRALIA_RECOMMENDED_ROUTE,
  AUSTRALIA_STAGE_ACTIVITY_IDS,
  type AustraliaLandmarkId,
  type AustraliaNpcId,
} from './australiaWorld';
import { HARBOUR_CAFE_BUILD_MENU, DARLING_HARBOUR_BUILD_BOARD } from './australiaBuild';

export const AUSTRALIA_PRACTICE_ACTIVITY_ID = AUSTRALIA_STAGE_ACTIVITY_IDS.practice;
export const AUSTRALIA_PRACTICE_XP_REWARD = 50;

export const AUSTRALIA_PRACTICE_MISSION_ORDER: readonly AustraliaLandmarkId[] =
  AUSTRALIA_RECOMMENDED_ROUTE;

export const AUSTRALIA_OLIVIA_PRACTICE_WELCOME: LocalizedText = {
  en: "You've learned the expressions and built your own conversations. Now it's time to use your voice! Talk with people around Sydney, ask questions, and keep the conversation going. Remember, every conversation is a chance to grow.",
  th: 'คุณได้เรียนรู้สำนวนและสร้างบทสนทนาด้วยตัวเองแล้ว ตอนนี้ถึงเวลาใช้เสียงของคุณพูดคุยจริง! สนทนากับผู้คนรอบซิดนีย์ ตั้งคำถาม และต่อบทสนทนาให้ไหลลื่น จำไว้ว่าทุกบทสนทนาคือโอกาสในการเติบโต',
};

export interface AustraliaPracticeTurnSpec {
  turnId: string;
  turnNumber: number;
  npcSpeakerId: AustraliaNpcId;
  stageLabel: LocalizedText;
  npcPromptA2: LocalizedText;
  npcPromptB1: LocalizedText;
  learnerTaskA2: LocalizedText;
  learnerTaskB1: LocalizedText;
  usefulExpressions: string[];
  sentenceStartersA2: LocalizedText[];
  sentenceStartersB1: LocalizedText[];
  modelResponseA2: LocalizedText;
  modelResponseB1: LocalizedText;
  thaiTip: string;
}

export interface AustraliaPracticeMissionSpec {
  id: AustraliaLandmarkId;
  order: number;
  npcId: AustraliaNpcId;
  landmarkId: AustraliaLandmarkId;
  isHelpPointReuse?: boolean;
  title: LocalizedText;
  locationName: LocalizedText;
  goal: LocalizedText;
  contextBanner: LocalizedText;
  usesCafeMenu?: boolean;
  usesVisitorBoard?: boolean;
  fictionalRouteSummary?: LocalizedText;
  turns: AustraliaPracticeTurnSpec[];
  closingNpcLine: LocalizedText;
  completionFeedbackA2: LocalizedText;
  completionFeedbackB1: LocalizedText;
}

export const AUSTRALIA_PRACTICE_MISSIONS: AustraliaPracticeMissionSpec[] = [
  {
    id: 'circular_quay_plaza',
    order: 1,
    npcId: 'npc_olivia',
    landmarkId: 'circular_quay_plaza',
    title: {
      en: 'Mission 1 · Welcome to Sydney',
      th: 'ภารกิจที่ 1 · ยินดีต้อนรับสู่ซิดนีย์',
    },
    locationName: AUSTRALIA_LANDMARKS[0].title,
    goal: {
      en: 'Start and maintain a polite conversation with Olivia at Circular Quay.',
      th: 'เริ่มต้นและสานต่อบทสนทนาอย่างสุภาพกับโอลิเวียที่เซอร์คิวลาร์คีย์',
    },
    contextBanner: {
      en: 'Olivia stands by the Circular Quay Welcome Kiosk ready to answer visitor questions.',
      th: 'โอลิเวียยืนรอต้อนรับนักท่องเที่ยวที่ซุ้มข้อมูลเซอร์คิวลาร์คีย์',
    },
    turns: [
      {
        turnId: 'cq_turn_1',
        turnNumber: 1,
        npcSpeakerId: 'npc_olivia',
        stageLabel: {
          en: 'Turn 1 · Greet & Ask for Information',
          th: 'รอบที่ 1 · ทักทายและสอบถามข้อมูล',
        },
        npcPromptA2: {
          en: 'Welcome to Sydney! What would you like to know?',
          th: 'ยินดีต้อนรับสู่ซิดนีย์ค่ะ! คุณอยากทราบข้อมูลเรื่องอะไรดีคะ?',
        },
        npcPromptB1: {
          en: "Welcome to Sydney! I'm Olivia at the harbour kiosk—what would you like to explore or ask about first?",
          th: 'ยินดีต้อนรับสู่ซิดนีย์ค่ะ! ฉันชื่อโอลิเวียประจำซุ้มข้อมูลอ่าว—คุณอยากสอบถามหรือสำรวจจุดไหนก่อนดีคะ?',
        },
        learnerTaskA2: {
          en: 'Greet Olivia politely and ask one simple question about Sydney Harbour or nearby places.',
          th: 'ทักทายโอลิเวียอย่างสุภาพ และถามคำถามสั้นๆ เกี่ยวกับอ่าวซิดนีย์หรือสถานที่ใกล้เคียง',
        },
        learnerTaskB1: {
          en: 'Open the conversation warmly, introduce your visit briefly, and ask a specific visitor question.',
          th: 'เปิดบทสนทนาอย่างเป็นกันเอง บอกจุดประสงค์สั้นๆ และถามข้อมูลเฉพาะเจาะจงกับโอลิเวีย',
        },
        usefulExpressions: [
          'Hi Olivia! Excuse me...',
          'Where can I find the ferry pier?',
          'Could you recommend a place to visit nearby?',
        ],
        sentenceStartersA2: [
          {
            en: 'Hi Olivia! Excuse me, what places are near Circular Quay?',
            th: 'สวัสดีโอลิเวีย! ขอโทษนะคะ/ครับ แถวเซอร์คิวลาร์คีย์มีสถานที่ไหนบ้าง?',
          },
          {
            en: 'Hello! Could you tell me where the harbour café is?',
            th: 'สวัสดีครับ/ค่ะ! ช่วยบอกทางไปคาเฟ่ริมอ่าวหน่อยได้ไหม?',
          },
        ],
        sentenceStartersB1: [
          {
            en: "Hi Olivia, it's great to meet you! It's my first day in Sydney—could you tell me what sights are worth visiting along this plaza?",
            th: 'สวัสดีโอลิเวีย ยินดีที่ได้พบครับ/ค่ะ! วันนี้เป็นวันแรกที่ซิดนีย์ ช่วยแนะนำจุดเด่นรอบลานนี้หน่อยได้ไหม?',
          },
        ],
        modelResponseA2: {
          en: 'Hello Olivia! Excuse me, what places can I visit near Circular Quay today?',
          th: 'สวัสดีโอลิเวีย! ขอโทษครับ/ค่ะ วันนี้แถวเซอร์คิวลาร์คีย์มีที่ไหนให้แวะชมบ้าง?',
        },
        modelResponseB1: {
          en: "Hi Olivia! It's my first morning in Sydney—could you recommend the best walkway or harbour landmark to explore first?",
          th: 'สวัสดีโอลิเวีย! เช้านี้เป็นวันแรกของฉันในซิดนีย์ ช่วยแนะนำทางเดินหรือแลนด์มาร์กริมอ่าวที่น่าเริ่มสำรวจหน่อยได้ไหม?',
        },
        thaiTip: 'เริ่มต้นด้วยคำทักทายอบอุ่น เช่น "Hi Olivia!" หรือ "Excuse me," แล้วตามด้วยคำถามที่ชัดเจน',
      },
      {
        turnId: 'cq_turn_2',
        turnNumber: 2,
        npcSpeakerId: 'npc_olivia',
        stageLabel: {
          en: 'Turn 2 · Acknowledge & Ask Follow-Up',
          th: 'รอบที่ 2 · ตอบรับและถามต่อยอด',
        },
        npcPromptA2: {
          en: 'City Transit Station is to the west, and Harbour Market Café is right along the sunny east pier!',
          th: 'สถานี City Transit อยู่ทางฝั่งตะวันตก ส่วน Harbour Market Café อยู่ริมท่าเรือฝั่งตะวันออกเลยค่ะ!',
        },
        npcPromptB1: {
          en: 'Sure thing! If you enjoy trains and ferries, City Transit Station is to the west, while Harbour Market Café and Darling Harbour Hub sit just past the east pier.',
          th: 'ได้เลยค่ะ! ถ้าสนใจการเดินทาง สถานี City Transit อยู่ฝั่งตะวันตก ส่วนคาเฟ่ริมอ่าวและ Darling Harbour Hub อยู่ถัดจากท่าเรือฝั่งตะวันออกค่ะ',
        },
        learnerTaskA2: {
          en: 'Thank Olivia and ask one short follow-up question (like how far it is) before saying goodbye politely.',
          th: 'ขอบคุณโอลิเวียและถามคำถามต่อยอดสั้นๆ (เช่น ไกลไหม) แล้วกล่าวลาอย่างสุภาพ',
        },
        learnerTaskB1: {
          en: 'Acknowledge her tip naturally, ask a helpful follow-up question about distance or timing, and close politely.',
          th: 'ตอบรับคำแนะนำอย่างเป็นธรรมชาติ ถามข้อมูลเพิ่มเติมเรื่องระยะทางหรือเวลา และปิดบทสนทนาอย่างสุภาพ',
        },
        usefulExpressions: [
          'Sounds great, thank you!',
          'Is it far to walk from here?',
          'Thanks so much for your help!',
        ],
        sentenceStartersA2: [
          {
            en: 'Thank you! Is it easy to walk there from here?',
            th: 'ขอบคุณครับ/ค่ะ! จากตรงนี้เดินไปง่ายไหม?',
          },
        ],
        sentenceStartersB1: [
          {
            en: 'That sounds lovely, thanks! About how many minutes does it take to walk over to Harbour Café?',
            th: 'ฟังดูน่าไปมากเลย ขอบคุณครับ/ค่ะ! เดินไปที่คาเฟ่ใช้เวลาประมาณกี่นาที?',
          },
        ],
        modelResponseA2: {
          en: 'Oh, thank you! Is Harbour Café easy to walk to? Have a nice day!',
          th: 'โอ้ ขอบคุณครับ/ค่ะ! เดินไปคาเฟ่ริมอ่าวง่ายใช่ไหมครับ/คะ ขอให้เป็นวันที่ดีนะครับ/คะ!',
        },
        modelResponseB1: {
          en: 'That sounds wonderful, thank you for explaining! Roughly how far is the east pier on foot, and thanks again for your help!',
          th: 'ยอดเยี่ยมเลยครับ/ค่ะ ขอบคุณที่อธิบาย! เดินไปท่าเรือฝั่งตะวันออกไกลไหมครับ/คะ แล้วขอบคุณอีกครั้งสำหรับคำแนะนำ!',
        },
        thaiTip: 'อย่าลืมตอบรับข้อมูลของอีกฝ่าย ("That sounds great!") ก่อนถามคำถามต่อหรือกล่าวขอบคุณปิดท้าย',
      },
    ],
    closingNpcLine: {
      en: "It's only a couple of minutes away along the promenade. Enjoy exploring Circular Quay!",
      th: 'เดินตามทางริมน้ำไปแค่ไม่กี่นาทีก็ถึงแล้วค่ะ ขอให้สนุกกับการสำรวจเซอร์คิวลาร์คีย์นะคะ!',
    },
    completionFeedbackA2: {
      en: 'Great effort! You practiced greeting Olivia politely, asking a clear question, and closing with thanks. Try adding a quick follow-up detail next time.',
      th: 'ยอดเยี่ยมมาก! คุณได้ฝึกทักทายโอลิเวีย ถามคำถาม และกล่าวขอบคุณปิดท้ายอย่างสุภาพ ลองเพิ่มคำถามต่อยอดอีกนิดในด่านถัดไปนะ',
    },
    completionFeedbackB1: {
      en: 'Well practiced! You opened naturally with Olivia and connected her answer to a follow-up question. Keep maintaining that polite two-way rhythm!',
      th: 'ฝึกได้เป็นธรรมชาติมาก! คุณเปิดบทสนทนา ถามข้อมูล และต่อยอดจากคำตอบของโอลิเวียได้อย่างต่อเนื่อง',
    },
  },
  {
    id: 'city_transit_station',
    order: 2,
    npcId: 'npc_noah',
    landmarkId: 'city_transit_station',
    title: {
      en: 'Mission 2 · Find Your Way',
      th: 'ภารกิจที่ 2 · สอบถามและทวนเส้นทาง',
    },
    locationName: AUSTRALIA_LANDMARKS[1].title,
    goal: {
      en: 'Ask Noah for directions on our fictional harbour route and confirm one detail.',
      th: 'ถามทางกับโนอาห์ตามแผนที่เกมและพูดทวนเพื่อยืนยันความเข้าใจ',
    },
    contextBanner: {
      en: 'Fictional Route Focus: Station Plaza → Main Sandstone Fountain → Wharf Gate → Harbour Gardens.',
      th: 'เส้นทางจำลองในเกม: ลานสถานี → น้ำพุหินทรายกลางลาน → ประตูท่าเรือ → สวน Harbour Gardens',
    },
    fictionalRouteSummary: {
      en: 'Game Map Guide: From City Transit Station, walk east past the Sandstone Fountain, then turn left toward Harbour Gardens Gate.',
      th: 'เส้นทางในแผนที่เกม: ออกจากสถานี City Transit เดินไปทางตะวันออกผ่านน้ำพุกลางลาน แล้วเลี้ยวซ้ายเข้าสู่ Harbour Gardens',
    },
    turns: [
      {
        turnId: 'cts_turn_1',
        turnNumber: 1,
        npcSpeakerId: 'npc_noah',
        stageLabel: {
          en: 'Turn 1 · Ask How to Reach a Destination',
          th: 'รอบที่ 1 · ถามทางไปจุดหมาย',
        },
        npcPromptA2: {
          en: 'Hi there! Looking for a harbour landmark from the station?',
          th: 'สวัสดีครับ! กำลังมองหาทางไปสถานที่ริมอ่าวจากสถานีอยู่หรือเปล่าครับ?',
        },
        npcPromptB1: {
          en: "G'day! I'm Noah at the City Transit desk. Where in Sydney Harbour are you trying to reach right now?",
          th: 'สวัสดีครับ! ผมโนอาห์ประจำสถานีขนส่ง คุณกำลังจะเดินทางไปจุดไหนในซิดนีย์ฮาร์เบอร์ครับ?',
        },
        learnerTaskA2: {
          en: 'Ask Noah politely how to walk to Harbour Gardens (or Darling Harbour).',
          th: 'ถามโนอาห์อย่างสุภาพว่าจะเดินไป Harbour Gardens (หรือ Darling Harbour) ได้อย่างไร',
        },
        learnerTaskB1: {
          en: 'Greet Noah and ask politely for clear walking directions from the station toward Harbour Gardens.',
          th: 'ทักทายโนอาห์และขอคำแนะนำเส้นทางเดินจากหน้าสถานีไปยัง Harbour Gardens อย่างสุภาพ',
        },
        usefulExpressions: [
          'Excuse me, how do I get to...?',
          'Could you tell me the way to Harbour Gardens?',
          'Is it straight ahead from the station?',
        ],
        sentenceStartersA2: [
          {
            en: 'Excuse me, how do I get to Harbour Gardens from here?',
            th: 'ขอโทษครับ/ค่ะ จากตรงนี้ไป Harbour Gardens ยังไง?',
          },
        ],
        sentenceStartersB1: [
          {
            en: 'Hi Noah! Could you tell me the easiest way to walk from City Transit Station to Harbour Gardens?',
            th: 'สวัสดีโนอาห์! ช่วยบอกทางเดินที่ง่ายที่สุดจากสถานีไปยัง Harbour Gardens หน่อยได้ไหมครับ/คะ?',
          },
        ],
        modelResponseA2: {
          en: 'Hi Noah! Excuse me, how do I get to Harbour Gardens from the station?',
          th: 'สวัสดีโนอาห์! ขอโทษครับ/ค่ะ จากสถานีไป Harbour Gardens เดินไปทางไหน?',
        },
        modelResponseB1: {
          en: "G'day Noah! Could you tell me the quickest walking route from City Transit Station to Harbour Gardens Gate?",
          th: 'สวัสดีโนอาห์! ช่วยแนะนำทางเดินที่เร็วที่สุดจากสถานี City Transit ไปประตู Harbour Gardens หน่อยได้ไหมครับ/คะ?',
        },
        thaiTip: 'ใช้ "Excuse me, how do I get to..." หรือ "Could you tell me the way to..." เพื่อเริ่มต้นถามทางอย่างสุภาพ',
      },
      {
        turnId: 'cts_turn_2',
        turnNumber: 2,
        npcSpeakerId: 'npc_noah',
        stageLabel: {
          en: "Turn 2 · Respond to Noah's Directions",
          th: 'รอบที่ 2 · ตอบรับคำบอกทางของโนอาห์',
        },
        npcPromptA2: {
          en: 'Walk straight past the sandstone fountain, then turn left after the transit exit toward the green gardens.',
          th: 'เดินตรงผ่านน้ำพุหินทราย จากนั้นเลี้ยวซ้ายหลังประตูสถานีไปยังสวนสีเขียวได้เลยครับ',
        },
        npcPromptB1: {
          en: "No worries! Walk straight east past the main sandstone fountain, stay on the coastal walkway, and turn left just past Wharf 4 toward Harbour Gardens.",
          th: 'สบายมากครับ! เดินตรงไปทางตะวันออกผ่านน้ำพุกลางลาน เดินตามทางริมน้ำ แล้วเลี้ยวซ้ายเลยท่าเรือ 4 ไปทาง Harbour Gardens ได้เลย',
        },
        learnerTaskA2: {
          en: "Respond to Noah's directions to show you are listening and following along.",
          th: 'พูดตอบรับคำบอกทางของโนอาห์เพื่อแสดงว่ากำลังฟังและเข้าใจลำดับ',
        },
        learnerTaskB1: {
          en: 'Respond naturally to Noah’s steps using sequence markers (first / then) before checking the key turn.',
          th: 'ตอบรับคำแนะนำของโนอาห์อย่างเป็นธรรมชาติโดยใช้คำเชื่อมลำดับ (first / then) ก่อนทวนจุดเลี้ยว',
        },
        usefulExpressions: [
          'Got it, straight past the fountain.',
          'Okay, thanks for explaining!',
          'First straight ahead, then...',
        ],
        sentenceStartersA2: [
          {
            en: 'Okay, walk straight past the fountain, got it!',
            th: 'โอเคครับ/ค่ะ เดินตรงผ่านน้ำพุ เข้าใจแล้ว!',
          },
        ],
        sentenceStartersB1: [
          {
            en: 'Thanks, I’m following so far—walk straight past the sandstone fountain along the harbour path.',
            th: 'ขอบคุณครับ/ค่ะ ตอนนี้ตามทันอยู่—เดินตรงผ่านน้ำพุหินทรายไปตามทางริมน้ำ',
          },
        ],
        modelResponseA2: {
          en: 'Got it! Walk straight past the fountain first, thank you.',
          th: 'เข้าใจแล้วครับ/ค่ะ! เดินตรงผ่านน้ำพุไปก่อน ขอบคุณนะ',
        },
        modelResponseB1: {
          en: 'Got it, Noah! First I head straight past the sandstone fountain along the waterfront path before looking for the turn.',
          th: 'เข้าใจเลยโนอาห์! ขั้นแรกเดินตรงผ่านน้ำพุหินทรายตามทางริมน้ำก่อนจะมองหาทางเลี้ยว',
        },
        thaiTip: 'พูดทวนสั้นๆ ว่า "Got it!" เพื่อแสดงความร่วมมือในการสื่อสารกับคู่สนทนา',
      },
      {
        turnId: 'cts_turn_3',
        turnNumber: 3,
        npcSpeakerId: 'npc_noah',
        stageLabel: {
          en: 'Turn 3 · Confirm or Clarify One Detail',
          th: 'รอบที่ 3 · ยืนยันหรือทวนรายละเอียด',
        },
        npcPromptA2: {
          en: 'Just check your left turn at the end—does that route sound clear?',
          th: 'อย่าลืมสังเกตทางเลี้ยวซ้ายช่วงท้ายนะครับ—เส้นทางนี้ชัดเจนไหมครับ?',
        },
        npcPromptB1: {
          en: 'Before you head off, feel free to double-check any turn or landmark with me so you feel confident.',
          th: 'ก่อนเดินไป ลองถามทวนจุดเลี้ยวหรือจุดสังเกตที่อยากเช็กให้มั่นใจได้เลยนะครับ',
        },
        learnerTaskA2: {
          en: 'Confirm the turn clearly aloud—for example: "So I turn left after the station, right?"',
          th: 'พูดทวนเพื่อยืนยันจุดเลี้ยว เช่น "So I turn left after the station, right?"',
        },
        learnerTaskB1: {
          en: 'Paraphrase and confirm one landmark or turn clearly with Noah, then thank him warmly.',
          th: 'ทวนคำและยืนยันจุดสังเกตหรือทางเลี้ยวกับโนอาห์ 1 จุดให้แน่ใจ แล้วกล่าวขอบคุณ',
        },
        usefulExpressions: [
          'So I turn left after the station, right?',
          'Just to confirm, it is past the fountain?',
          'Thanks a lot, Noah!',
        ],
        sentenceStartersA2: [
          {
            en: 'So I turn left after the station, right? Thank you!',
            th: 'ดังนั้นฉันต้องเลี้ยวซ้ายหลังผ่านสถานี ใช่ไหมครับ/คะ? ขอบคุณ!',
          },
        ],
        sentenceStartersB1: [
          {
            en: 'Just to check—once I pass Wharf 4, I turn left into Harbour Gardens, right? Thanks for the help!',
            th: 'ขอเช็กอีกที—พอเลยท่าเรือ 4 แล้วก็เลี้ยวซ้ายเข้า Harbour Gardens ใช่ไหมครับ/คะ? ขอบคุณมากเลย!',
          },
        ],
        modelResponseA2: {
          en: 'So I turn left after the station, right? Thanks very much, Noah!',
          th: 'งั้นฉันเลี้ยวซ้ายหลังผ่านสถานี ใช่ไหมครับ/คะ? ขอบคุณมากเลยโนอาห์!',
        },
        modelResponseB1: {
          en: 'Just to double-check, I pass the fountain and turn left just past Wharf 4 into Harbour Gardens, right? Thanks for guiding me!',
          th: 'ขอทวนให้แน่ใจอีกนิด คือเดินเลยน้ำพุแล้วเลี้ยวซ้ายหลังท่าเรือ 4 เข้า Harbour Gardens ใช่ไหมครับ/คะ? ขอบคุณที่ช่วยบอกทาง!',
        },
        thaiTip: 'ประโยค "So I turn left..., right?" เป็นวิธีทวนความเข้าใจที่ใช้ได้ผลดีเยี่ยมในการสนทนาจริง',
      },
    ],
    closingNpcLine: {
      en: "Spot on! Turn left just past Wharf 4 and you'll walk right into Harbour Gardens. Enjoy the walk!",
      th: 'ถูกต้องเป๊ะครับ! เลี้ยวซ้ายเลยท่าเรือ 4 ก็ถึงประตู Harbour Gardens เลย เดินเที่ยวให้สนุกนะครับ!',
    },
    completionFeedbackA2: {
      en: 'Great job! You practiced asking for directions and checking the turn politely with Noah. Remember to speak clearly on every landmark word.',
      th: 'ทำได้ดีมาก! คุณได้ฝึกถามทางและทวนจุดเลี้ยวกับโนอาห์อย่างสุภาพ อย่าลืมออกเสียงชื่อสถานที่สำคัญให้ชัดเจนนะ',
    },
    completionFeedbackB1: {
      en: 'Nice work! You asked a structured question, followed multi-step directions, and double-checked a specific landmark detail before leaving.',
      th: 'ยอดเยี่ยมเลย! คุณตั้งคำถามอย่างเป็นระบบ ตอบรับลำดับเส้นทาง และทวนจุดสังเกตเฉพาะเจาะจงก่อนออกเดินทาง',
    },
  },
  {
    id: 'harbour_market_cafe',
    order: 3,
    npcId: 'npc_mia',
    landmarkId: 'harbour_market_cafe',
    title: {
      en: 'Mission 3 · Order Like a Local',
      th: 'ภารกิจที่ 3 · สั่งอาหารอย่างคล่องแคล่ว',
    },
    locationName: AUSTRALIA_LANDMARKS[2].title,
    goal: {
      en: 'Order food politely, answer Mia’s follow-up question, and confirm or adjust your order.',
      th: 'สั่งอาหารอย่างสุภาพ ตอบคำถามเสริมของมีอา และยืนยันหรือปรับรายการสั่งซื้อ',
    },
    contextBanner: {
      en: `Fictional Café Menu Practice (${HARBOUR_CAFE_BUILD_MENU.slice(0, 3).map((m) => `${m.name.en} ${m.priceText}`).join(' · ')}) — role-play only, no real purchase.`,
      th: 'เมนูฝึกสนทนาจำลอง (ไม่ต้องชำระเงินจริง) ดูตัวเลือกอาหารและเครื่องดื่มด้านล่างได้ระหว่างซ้อมพูด',
    },
    usesCafeMenu: true,
    turns: [
      {
        turnId: 'hmc_turn_1',
        turnNumber: 1,
        npcSpeakerId: 'npc_mia',
        stageLabel: {
          en: 'Turn 1 · Make a Polite Order',
          th: 'รอบที่ 1 · สั่งอาหารอย่างสุภาพ',
        },
        npcPromptA2: {
          en: 'Hi! Welcome to Harbour Market Café. What would you like to order?',
          th: 'สวัสดีค่ะ! ยินดีต้อนรับสู่ Harbour Market Café รับอะไรดีคะ?',
        },
        npcPromptB1: {
          en: "Morning! Everything is fresh today at Harbour Café—what can I make for you?",
          th: 'สวัสดีค่ะ! วันนี้เมนูที่คาเฟ่ทำสดใหม่หมดเลยค่ะ อยากสั่งอะไรดีคะ?',
        },
        learnerTaskA2: {
          en: 'Order one item from our fictional menu politely (for example, Chicken Sandwich or Orange Juice).',
          th: 'เลือกสั่งอาหารหรือเครื่องดื่ม 1 รายการจากเมนูจำลองอย่างสุภาพ',
        },
        learnerTaskB1: {
          en: 'Order politely and optionally mention a dietary preference or check a menu ingredient.',
          th: 'สั่งเมนูที่ต้องการอย่างสุภาพ พร้อมระบุความชอบหรือสอบถามส่วนผสมได้ตามต้องการ',
        },
        usefulExpressions: [
          'Could I please have...?',
          "I'd like a Chicken Sandwich, please.",
          'Can I get an Avocado Toast and...',
        ],
        sentenceStartersA2: [
          {
            en: 'Could I have a Chicken Sandwich, please?',
            th: 'ขอสั่งแซนด์วิชไก่ย่างหนึ่งที่ครับ/ค่ะ?',
          },
          {
            en: "I'd like Avocado Toast and an Orange Juice, please.",
            th: 'ขอรับขนมปังอะโวคาโดกับน้ำส้มคั้นหนึ่งชุดครับ/ค่ะ',
          },
        ],
        sentenceStartersB1: [
          {
            en: "Hi Mia! Could I please order a Chicken Sandwich—without mayonnaise if that's possible?",
            th: 'สวัสดีมีอา! ขอสั่งแซนด์วิชไก่ย่างหนึ่งที่ แบบไม่ใส่มายองเนสได้ไหมครับ/คะ?',
          },
        ],
        modelResponseA2: {
          en: 'Hello Mia! Could I have a Chicken Sandwich and an Orange Juice, please?',
          th: 'สวัสดีมีอา! ขอแซนด์วิชไก่ย่างกับน้ำส้มคั้นอย่างละ 1 ที่ได้ไหมครับ/คะ?',
        },
        modelResponseB1: {
          en: "Hi Mia! I'd love the Avocado Toast on wholegrain bread, and could I also ask what milk options you have?",
          th: 'สวัสดีมีอา! ขอรับขนมปังอะโวคาโดโฮลเกรนหนึ่งที่ แล้วรบกวนถามว่ามีตัวเลือกนมแบบไหนบ้างครับ/คะ?',
        },
        thaiTip: 'ใช้ "Could I have..., please?" หรือ "I\'d like..., please." เพื่อให้ฟังสุภาพและเป็นธรรมชาติในคาเฟ่',
      },
      {
        turnId: 'hmc_turn_2',
        turnNumber: 2,
        npcSpeakerId: 'npc_mia',
        stageLabel: {
          en: "Turn 2 · Respond to Mia's Follow-Up",
          th: 'รอบที่ 2 · ตอบคำถามเสริมของพนักงาน',
        },
        npcPromptA2: {
          en: 'Sure! We have dairy milk or oat milk for drinks, and no mayo is fine. Would you like to eat here or take away?',
          th: 'ได้เลยค่ะ! เรามีทั้งนมวัวและนมโอ๊ต ส่วนไม่ใส่มายองเนสทำให้ได้ค่ะ จะทานที่นี่หรือใส่กล่องกลับคะ?',
        },
        npcPromptB1: {
          en: 'We offer regular milk or oat milk for our Flat White, and we make our Chicken Sandwich without mayo fresh to order! Will that be for dining by the harbour or takeaway?',
          th: 'เรามีนมปกติกับนมโอ๊ตสำหรับแฟลตไวท์ และแซนด์วิชไก่ทำสดไม่ใส่มายองเนสให้ได้ค่ะ! รับทานริมอ่าวหรือใส่ถุงกลับดีคะ?',
        },
        learnerTaskA2: {
          en: "Answer Mia's question (say 'to eat here' or 'take away', or pick your milk choice).",
          th: 'ตอบคำถามของมีอา (เช่น ทานที่นี่ ใส่กลับ หรือเลือกประเภทนม)',
        },
        learnerTaskB1: {
          en: 'Reply clearly to Mia’s follow-up preference question and optionally add a smoothie or banana bread.',
          th: 'ตอบคำถามเรื่องตัวเลือกให้ชัดเจน และสามารถสั่งสมูทตี้หรือบานาน่าเบรดเพิ่มได้ตามต้องการ',
        },
        usefulExpressions: [
          'To eat here, please.',
          'Take away, please!',
          'Oat milk sounds great, thanks.',
        ],
        sentenceStartersA2: [
          {
            en: 'To eat here, please. Thank you!',
            th: 'ทานที่นี่ครับ/ค่ะ ขอบคุณ!',
          },
          {
            en: 'Take away, please, with oat milk.',
            th: 'ใส่กล่องกลับครับ/ค่ะ ขอเป็นนมโอ๊ตนะ',
          },
        ],
        sentenceStartersB1: [
          {
            en: "Dining by the harbour sounds lovely—and I'd also like a Warm Flat White with oat milk, please.",
            th: 'ทานริมอ่าวเลยดีครับ/ค่ะ—แล้วขอเพิ่มแฟลตไวท์อุ่นใส่นมโอ๊ตอีกแก้วนะครับ/คะ',
          },
        ],
        modelResponseA2: {
          en: 'Eat here by the harbour, please! No mayo is great, thank you.',
          th: 'ทานที่ร้านริมอ่าวครับ/ค่ะ! ไม่ใส่มายองเนสดีเลย ขอบคุณมาก',
        },
        modelResponseB1: {
          en: "I'll eat here by the harbour, please—and could you make a Warm Flat White with oat milk too?",
          th: 'ทานที่นี่ริมอ่าวเลยครับ/ค่ะ—แล้วช่วยทำแฟลตไวท์อุ่นแบบใส่นมโอ๊ตให้อีกแก้วด้วยนะครับ/คะ?',
        },
        thaiTip: 'คำถามยอดฮิตในร้านกาแฟออสเตรเลียคือ "Have here or take away?" ตอบง่ายๆ ว่า "Have here, please." หรือ "Take away, please."',
      },
      {
        turnId: 'hmc_turn_3',
        turnNumber: 3,
        npcSpeakerId: 'npc_mia',
        stageLabel: {
          en: 'Turn 3 · Confirm Order or Request a Change',
          th: 'รอบที่ 3 · ยืนยันหรือขอปรับออเดอร์',
        },
        npcPromptA2: {
          en: 'Got it! One freshly prepared order to eat here. Would you like to change or confirm anything?',
          th: 'รับทราบค่ะ! ออเดอร์ทำสดทานที่ร้านเรียบร้อย ต้องการเปลี่ยนหรือยืนยันอะไรเพิ่มเติมไหมคะ?',
        },
        npcPromptB1: {
          en: 'Let me double-check that order for you—ready for the sunny terrace! Anything you need swapped or confirmed?',
          th: 'ทวนรายการให้นะคะ—พร้อมเสิร์ฟที่ระเบียงรับแดดเลย! มีส่วนไหนอยากปรับเปลี่ยนหรือยืนยันไหมคะ?',
        },
        learnerTaskA2: {
          en: 'Confirm your order politely ("Yes, that\'s everything, thank you!") or ask one quick change.',
          th: 'ยืนยันออเดอร์อย่างสุภาพ ("Yes, that\'s all, thank you!") หรือขอเปลี่ยนเล็กน้อย',
        },
        learnerTaskB1: {
          en: 'Either confirm the whole order politely or request a clear adjustment (e.g., extra napkin or swap drink) and thank Mia.',
          th: 'ยืนยันออเดอร์ทั้งหมดอย่างสุภาพ หรือขอปรับรายละเอียด (เช่น ขอเปลี่ยนเครื่องดื่ม/ขอทิชชูเพิ่ม) แล้วขอบคุณมีอา',
        },
        usefulExpressions: [
          "Yes, that's everything, thank you!",
          'Actually, could I swap to Orange Juice?',
          'Could I also get a napkin, please?',
        ],
        sentenceStartersA2: [
          {
            en: "Yes, that's everything! Thank you very much.",
            th: 'เรียบร้อยตามนั้นเลยครับ/ค่ะ! ขอบคุณมากนะ',
          },
        ],
        sentenceStartersB1: [
          {
            en: "Everything sounds spot-on—actually, could I quickly ask for Toasted Banana Bread to share as well? Thanks so much!",
            th: 'ครบถ้วนตามนั้นเลยครับ/ค่ะ—เอ๊ะ รบกวนเพิ่มบานาน่าเบรดปิ้งอุ่นอีกชิ้นได้ไหมครับ/คะ? ขอบคุณมากเลย!',
          },
        ],
        modelResponseA2: {
          en: "Yes, that's everything! Thank you so much for your help, Mia.",
          th: 'ใช่ครับ/ค่ะ เท่านี้เลย! ขอบคุณมากนะครับ/คะมีอา',
        },
        modelResponseB1: {
          en: "Everything sounds perfect—actually, could I add one Harbour Berry Smoothie dairy-free as well? Thanks a bunch, Mia!",
          th: 'ทุกอย่างโอเคเลยครับ/ค่ะ—ขอเพิ่มสมูทตี้เบอร์รี่แบบไม่ใส่นมวัวอีกแก้วได้ไหมครับ/คะ? ขอบคุณมากนะมีอา!',
        },
        thaiTip: 'หากต้องการเปลี่ยนรายการกลางคัน ใช้ "Actually, could I..." จะฟังสุภาพและอ่อนโยนมาก',
      },
    ],
    closingNpcLine: {
      en: 'All confirmed! Grab a sunny seat overlooking the harbour—your order will be ready shortly.',
      th: 'ยืนยันเรียบร้อยค่ะ! เชิญนั่งชมวิวริมอ่าวรับแสงแดดได้เลย อีกสักครู่จะเสิร์ฟให้นะคะ',
    },
    completionFeedbackA2: {
      en: 'Lovely job! You practiced ordering food politely, answering Mia’s follow-up, and confirming your meal without rushing.',
      th: 'ทำได้ดีมาก! คุณได้ฝึกสั่งอาหาร ตอบคำถามพนักงาน และยืนยันรายการอย่างสุภาพครบทุกขั้นตอน',
    },
    completionFeedbackB1: {
      en: 'Great café interaction! You handled a polite custom order, replied smoothly to staff follow-ups, and confirmed your items clearly.',
      th: 'สื่อสารในคาเฟ่ได้คล่องแคล่วมาก! คุณสั่งปรับส่วนผสม ตอบคำถามพนักงาน และยืนยันหรือเพิ่มออเดอร์ได้อย่างเป็นธรรมชาติ',
    },
  },
  {
    id: 'darling_harbour_hub',
    order: 4,
    npcId: 'npc_jack',
    landmarkId: 'darling_harbour_hub',
    title: {
      en: 'Mission 4 · Plan Your Adventure',
      th: 'ภารกิจที่ 4 · วางแผนเที่ยวที่ดาร์ลิงฮาร์เบอร์',
    },
    locationName: AUSTRALIA_LANDMARKS[3].title,
    goal: {
      en: 'Ask Jack about schedules, tickets, or attractions, ask a follow-up, and acknowledge.',
      th: 'ถามแจ็กเรื่องรอบเวลา ราคาบัตร หรือกิจกรรม ต่อยอดคำถาม และตอบรับข้อมูล',
    },
    contextBanner: {
      en: `Fictional Visitor Board Info: ${DARLING_HARBOUR_BUILD_BOARD[0].itemTitle.en} · Student Pass $14 · Combo $20.`,
      th: 'ข้อมูลบอร์ดจำลอง: ล่องเรือชมอ่าว 10:00 / 13:30 / 16:00 น. · บัตรนักเรียน $14 · บัตรรวมกิจกรรม $20',
    },
    usesVisitorBoard: true,
    turns: [
      {
        turnId: 'dhh_turn_1',
        turnNumber: 1,
        npcSpeakerId: 'npc_jack',
        stageLabel: {
          en: 'Turn 1 · Ask About Schedule, Price, or Activity',
          th: 'รอบที่ 1 · ถามรอบเวลา ราคา หรือกิจกรรม',
        },
        npcPromptA2: {
          en: "G'day! Welcome to Darling Harbour Discovery Hub. What activity are you curious about?",
          th: 'สวัสดีครับ! ยินดีต้อนรับสู่ Darling Harbour Discovery Hub สนใจสอบถามกิจกรรมไหนเป็นพิเศษไหมครับ?',
        },
        npcPromptB1: {
          en: "Hey there, I'm Jack at the Discovery Hub! Looking at the boat cruise, the Marine Pavilion, or student ticket passes today?",
          th: 'สวัสดีครับ ผมแจ็กประจำศูนย์บริการนักท่องเที่ยว! วันนี้สนใจรอบเรือชมอ่าว ศาลาโลกใต้ทะเล หรือบัตรนักเรียนดีครับ?',
        },
        learnerTaskA2: {
          en: 'Ask Jack one clear question about a tour time, activity, or student ticket price.',
          th: 'ถามแจ็กเกี่ยวกับรอบเวลา กิจกรรม หรือราคาบัตรนักเรียน 1 ข้อ',
        },
        learnerTaskB1: {
          en: 'Ask Jack specific details comparing two options—such as boat times or the Student Pass vs Afternoon Explorer Combo.',
          th: 'ถามรายละเอียดเฉพาะเจาะจงกับแจ็ก เช่น เทียบเวลารอบเรือ หรือราคาบัตรนักเรียนกับบัตรรวมกิจกรรมช่วงบ่าย',
        },
        usefulExpressions: [
          'What time does the Harbour Cruise start?',
          'How much is a student ticket?',
          'Could you tell me about the Explorer Combo?',
        ],
        sentenceStartersA2: [
          {
            en: 'Hello Jack! What time does the Harbour Sail Cruise start?',
            th: 'สวัสดีแจ็ก! เรือชมอ่าวเริ่มออกรอบกี่โมงครับ/คะ?',
          },
          {
            en: 'Excuse me, how much is a Student Ticket?',
            th: 'ขอโทษครับ/ค่ะ บัตรนักเรียนรู้ราคาเท่าไร?',
          },
        ],
        sentenceStartersB1: [
          {
            en: 'Hi Jack! Could you tell me what is included in the Afternoon Explorer Combo and when the sunset boat leaves?',
            th: 'สวัสดีแจ็ก! ช่วยบอกหน่อยได้ไหมครับ/คะว่าบัตร Afternoon Explorer Combo รวมอะไรบ้าง และเรือรอบเย็นออกกี่โมง?',
          },
        ],
        modelResponseA2: {
          en: 'Hi Jack! What time does the Harbour Cruise start, and how much is a student ticket?',
          th: 'สวัสดีแจ็ก! เรือชมอ่าวออกกี่โมง และบัตรนักเรียนราคาเท่าไรครับ/คะ?',
        },
        modelResponseB1: {
          en: "Hey Jack! I'm planning this afternoon—what times do the Harbour Sail boats depart, and does a student ID work for the combo pass?",
          th: 'สวัสดีแจ็ก! กำลังวางแผนเที่ยวช่วงบ่ายนี้อยู่ รอบเรือชมอ่าวออกกี่โมงบ้าง และใช้บัตรนักเรียนซื้อบัตรรวม Combo ได้ไหมครับ/คะ?',
        },
        thaiTip: 'จับคู่ถามเวลา ("What time...") กับราคา ("How much...") ช่วยให้วางแผนได้รวดเร็ว',
      },
      {
        turnId: 'dhh_turn_2',
        turnNumber: 2,
        npcSpeakerId: 'npc_jack',
        stageLabel: {
          en: 'Turn 2 · Ask a Follow-Up Question',
          th: 'รอบที่ 2 · ถามคำถามต่อยอดที่เกี่ยวข้อง',
        },
        npcPromptA2: {
          en: 'Boats leave at 10:00 AM, 1:30 PM, and 4:00 PM! Student tickets are $14, or $20 for the Combo.',
          th: 'เรือออกเวลา 10:00, 13:30 และ 16:00 น. ครับ! บัตรนักเรียน $14 หรือบัตรรวม $20 ครับ',
        },
        npcPromptB1: {
          en: 'The Harbour Sail runs at 10:00 AM, 1:30 PM, and 4:00 PM for 75 minutes. A Student Pass is $14, while the Afternoon Explorer Combo gives you Pavilion entry plus the boat for $20!',
          th: 'เรือ Harbour Sail มีรอบ 10:00, 13:30 และ 16:00 น. ใช้เวลา 75 นาที บัตรนักเรียน $14 ส่วนบัตร Afternoon Explorer Combo รวมเข้าศาลาและนั่งเรือในราคา $20 ครับ!',
        },
        learnerTaskA2: {
          en: 'Ask one follow-up question (like whether you need to book ahead, or where to show student ID).',
          th: 'ถามคำถามต่อยอด 1 ข้อ เช่น ต้องจองล่วงหน้าไหม หรือแสดงบัตรนักเรียนที่ไหน',
        },
        learnerTaskB1: {
          en: 'Ask a thoughtful follow-up about weekend booking vs weekday walk-ins, keeper talk times, or boat recommendations.',
          th: 'ถามต่อยอดเกี่ยวกับการจองล่วงหน้าเทียบกับซื้อหน้างาน รอบบรรยายสัตว์น้ำ หรือรอบเรือที่แนะนำ',
        },
        usefulExpressions: [
          'Do I need to book in advance?',
          'Which time do you recommend?',
          'What time is the Marine Keeper talk?',
        ],
        sentenceStartersA2: [
          {
            en: 'Thanks! Do I need to book a ticket first?',
            th: 'ขอบคุณครับ/ค่ะ! ต้องจองตั๋วล่วงหน้าก่อนไหม?',
          },
        ],
        sentenceStartersB1: [
          {
            en: 'The $20 Explorer Combo sounds great value! Do I need to book ahead today, and which boat departure has the best harbour view?',
            th: 'บัตร $20 คุ้มมากเลยครับ/ค่ะ! วันนี้ต้องจองล่วงหน้าไหม และเรือรอบไหนเห็นวิวอ่าวสวยที่สุด?',
          },
        ],
        modelResponseA2: {
          en: 'Oh, nice! Do I need to book in advance, or can I buy at the desk?',
          th: 'โอ้ ดีจัง! ต้องจองล่วงหน้าไหม หรือซื้อที่เคาน์เตอร์ได้เลยครับ/คะ?',
        },
        modelResponseB1: {
          en: "The Explorer Combo sounds great! Would you recommend booking ahead for today, and is there time to see the 2:00 PM keeper talk first?",
          th: 'บัตรรวม Explorer Combo น่าสนใจมาก! วันนี้ควรจองล่วงหน้าไหม แล้วจะมีเวลาแวะฟังบรรยายรอบ 14:00 น. ก่อนขึ้นเรือหรือเปล่าครับ/คะ?',
        },
        thaiTip: 'ลองเชื่อมข้อมูลที่ได้ ("The Combo sounds great!") แล้วถามต่อยอดเรื่องการจองหรือเวลาที่แนะนำ',
      },
      {
        turnId: 'dhh_turn_3',
        turnNumber: 3,
        npcSpeakerId: 'npc_jack',
        stageLabel: {
          en: 'Turn 3 · Acknowledge & Finalize Plan',
          th: 'รอบที่ 3 · ตอบรับและสรุปแผน',
        },
        npcPromptA2: {
          en: 'On weekdays you can walk right up—and I recommend the 4:00 PM sunset boat!',
          th: 'วันธรรมดาซื้อหน้างานได้เลยครับ—ผมแนะนำรอบ 16:00 น. ช่วงพระอาทิตย์ตกสวยมาก!',
        },
        npcPromptB1: {
          en: "On weekdays walk-ins are totally fine! If you catch the 2:00 PM Marine Pavilion talk first, you'll make the 4:00 PM sunset cruise easily.",
          th: 'วันธรรมดาซื้อหน้างานได้สบายเลยครับ! ถ้าเข้าฟังบรรยายรอบ 14:00 น. ที่ศาลาก่อน จะไปทันขึ้นเรือรอบพระอาทิตย์ตก 16:00 น. พอดีเลย',
        },
        learnerTaskA2: {
          en: 'Acknowledge Jack’s suggestion clearly (state which time/plan you picked) and thank him.',
          th: 'ตอบรับคำแนะนำของแจ็ก (บอกแผนหรือเวลาที่เลือก) แล้วกล่าวขอบคุณ',
        },
        learnerTaskB1: {
          en: 'Summarize your afternoon plan clearly to confirm you caught every timing detail, and thank Jack.',
          th: 'สรุปแผนช่วงบ่ายของคุณสั้นๆ เพื่อยืนยันเวลาที่นัดหมาย และขอบคุณแจ็กอย่างสุภาพ',
        },
        usefulExpressions: [
          "Awesome, I'll take the 4:00 PM sunset boat!",
          'That fits my plan perfectly. Thank you!',
          'See you around the harbour, Jack!',
        ],
        sentenceStartersA2: [
          {
            en: "Great! I'll choose the 4:00 PM boat. Thank you, Jack!",
            th: 'เยี่ยมเลย! ฉันจะเลือกรอบ 16:00 น. ขอบคุณนะแจ็ก!',
          },
        ],
        sentenceStartersB1: [
          {
            en: "That plan works brilliantly—I'll visit the 2:00 PM Pavilion talk first and catch the 4:00 PM sunset cruise. Thanks a ton, Jack!",
            th: 'แผนนี้ลงตัวสุดๆ เลย—ฉันจะไปฟังบรรยายรอบ 14:00 น. ก่อนแล้วต่อเรือรอบ 16:00 น. ขอบคุณมากนะแจ็ก!',
          },
        ],
        modelResponseA2: {
          en: "Awesome! I'll pick the 4:00 PM sunset boat then. Thanks for the tip, Jack!",
          th: 'ยอดเยี่ยมเลย! งั้นฉันเลือกรอบเรือ 16:00 น. ขอบคุณสำหรับคำแนะนำนะแจ็ก!',
        },
        modelResponseB1: {
          en: "That schedule fits perfectly—Marine Pavilion at 2:00 PM, then the 4:00 PM sunset boat! Appreciate all your help, Jack!",
          th: 'เวลาลงตัวพอดีเลย—เข้าศาลาตอน 14:00 น. แล้วต่อเรือรอบ 16:00 น.! ขอบคุณมากๆ เลยนะแจ็ก!',
        },
        thaiTip: 'การพูดสรุปเวลา/แผนที่เลือกไว้ตอนจบช่วยให้มั่นใจว่าคุณและเจ้าหน้าที่เข้าใจตรงกันทุกจุด',
      },
    ],
    closingNpcLine: {
      en: "Brilliant choice—you'll love the harbour sunset view! Have an awesome afternoon out there.",
      th: 'เลือกได้เยี่ยมมาก—วิวพระอาทิตย์ตกริมอ่าวสวยสุดๆ เลยครับ! เที่ยวให้สนุกนะครับ',
    },
    completionFeedbackA2: {
      en: 'Well done! You asked Jack about times and tickets, added a follow-up question, and confirmed your activity plan politely.',
      th: 'ทำได้ดีมาก! คุณสอบถามรอบเวลา ราคา ถามคำถามต่อยอด และยืนยันแผนกิจกรรมกับแจ็กได้อย่างชัดเจน',
    },
    completionFeedbackB1: {
      en: 'Strong planning conversation! You gathered schedule details, asked smart follow-ups about timing, and summarized your afternoon plan clearly.',
      th: 'บทสนทนาวางแผนเที่ยวชัดเจนมาก! คุณเปรียบเทียบข้อมูล ถามต่อเรื่องเวลาและวิธีจอง และสรุปแผนปิดท้ายได้ครบถ้วน',
    },
  },
  {
    id: 'harbour_gardens_help_point',
    order: 5,
    npcId: 'npc_olivia',
    landmarkId: 'harbour_gardens_help_point',
    isHelpPointReuse: true,
    title: {
      en: 'Mission 5 · Keep the Conversation Going',
      th: 'ภารกิจที่ 5 · ซ่อมความเข้าใจและสานต่อบทสนทนา',
    },
    locationName: AUSTRALIA_LANDMARKS[4].title,
    goal: {
      en: 'Repair a communication breakdown with Olivia at Harbour Gardens by clarifying and confirming.',
      th: 'ฝึกซ่อมบทสนทนาเมื่อฟังไม่ทันหรือเจอคำศัพท์ไม่คุ้นกับโอลิเวียที่ Harbour Gardens',
    },
    contextBanner: {
      en: 'Help Point Focus: Politely ask for repetition, check an unfamiliar word ("jetty"), and confirm meaning.',
      th: 'จุดเน้นจุดช่วยเหลือนักท่องเที่ยว: ขอให้พูดซ้ำ/พูดช้าลง เช็กความหมายของคำว่า "jetty" และทวนความเข้าใจให้ตรงกัน',
    },
    turns: [
      {
        turnId: 'hgp_turn_1',
        turnNumber: 1,
        npcSpeakerId: 'npc_olivia',
        stageLabel: {
          en: 'Turn 1 · Request Repetition or Clarification',
          th: 'รอบที่ 1 · ขอให้พูดซ้ำหรือช้าลงอย่างสุภาพ',
        },
        npcPromptA2: {
          en: "Oh! Quick tip—walk past the wooden jetty before twilight, stay left past the bench loop!",
          th: 'อ้อ! ทิปเร็วๆ นะคะ—เดินเลยบริเวณ wooden jetty ก่อน twilight แล้วชิดซ้ายผ่านม้านั่งเลยค่ะ!',
        },
        npcPromptB1: {
          en: "Hey! Before the harbour breeze picks up, duck past the timber jetty near the lookout bend, keep north of the pergola, and you'll catch the golden lookout!",
          th: 'เฮ้! ก่อนลมริมอ่าวจะแรง รีบเดินผ่านบริเวณ timber jetty แถวโค้งจุดชมวิว แล้วชิดเหนือซุ้มไม้ไปเลย จะทันวิวแสงทองพอดี!',
        },
        learnerTaskA2: {
          en: 'Polite repair step: Tell Olivia you didn’t catch it and ask her to repeat more slowly ("Sorry, could you say that again, please?").',
          th: 'ซ่อมบทสนทนาอย่างสุภาพ: บอกโอลิเวียว่าฟังไม่ทันและขอให้พูดซ้ำช้าลง ("Sorry, could you say that again, please?")',
        },
        learnerTaskB1: {
          en: 'Ask Olivia politely to slow down AND clarify the unfamiliar word "jetty" before moving on.',
          th: 'ขอให้โอลิเวียช่วยพูดช้าลงอย่างสุภาพ และถามความหมายของคำที่ไม่คุ้น ("jetty") ให้ชัดเจน',
        },
        usefulExpressions: [
          'Sorry, could you say that again, please?',
          'Could you speak a little more slowly?',
          'Excuse me, what does "jetty" mean?',
        ],
        sentenceStartersA2: [
          {
            en: 'Sorry, could you say that again, please? Speak slowly, please.',
            th: 'ขอโทษครับ/ค่ะ ช่วยพูดอีกครั้งช้าๆ ได้ไหม?',
          },
        ],
        sentenceStartersB1: [
          {
            en: 'Excuse me, Olivia—I missed part of that! Could you repeat it a little more slowly, and what does "jetty" mean?',
            th: 'ขอโทษครับ/ค่ะโอลิเวีย—เมื่อครู่ฟังไม่ทันบางส่วน ช่วยพูดช้าลงนิดนึงได้ไหม แล้วคำว่า "jetty" หมายถึงอะไรครับ/คะ?',
          },
        ],
        modelResponseA2: {
          en: 'Sorry, could you say that again, please? What does "jetty" mean?',
          th: 'ขอโทษครับ/ค่ะ ช่วยพูดอีกครั้งได้ไหม? คำว่า "jetty" แปลว่าอะไรครับ/คะ?',
        },
        modelResponseB1: {
          en: 'Sorry, Olivia, that was a bit fast—could you repeat those directions more slowly and explain what a "jetty" is?',
          th: 'ขอโทษครับ/ค่ะโอลิเวีย เมื่อกี้เร็วไปนิด ช่วยพูดทวนช้าๆ อีกครั้งและอธิบายคำว่า "jetty" หน่อยได้ไหมครับ/คะ?',
        },
        thaiTip: 'อย่ากลัวที่จะขอให้พูดซ้ำ! ใช้ "Sorry, could you say that again, please?" ดีกว่าพยักหน้าทั้งที่ยังงง',
      },
      {
        turnId: 'hgp_turn_2',
        turnNumber: 2,
        npcSpeakerId: 'npc_olivia',
        stageLabel: {
          en: 'Turn 2 · Confirm the Intended Meaning',
          th: 'รอบที่ 2 · ยืนยันความหมายที่เข้าใจให้ตรงกัน',
        },
        npcPromptA2: {
          en: 'Of course! A jetty is the small wooden pier over the water. Walk past that pier, then turn left!',
          th: 'ได้เลยค่ะ! "jetty" คือท่าเทียบเรือไม้เล็กๆ ที่ยื่นลงไปในน้ำ เดินผ่านท่าไม้ตรงนั้นแล้วเลี้ยวซ้ายนะคะ!',
        },
        npcPromptB1: {
          en: "My apologies for talking quickly! A jetty is a small wooden pier stretching over the water—so walk past the wooden pier, keep left by the pergola, and you'll reach the sunset lookout.",
          th: 'ขอโทษที่พูดเร็วนะคะ! "jetty" คือท่าเรือไม้เล็กๆ ที่ยื่นลงน้ำค่ะ—เดินผ่านท่าไม้นั้นไป ชิดซ้ายข้างซุ้มไม้ ก็ถึงจุดชมพระอาทิตย์ตกเลยค่ะ',
        },
        learnerTaskA2: {
          en: 'Confirm you understand what "jetty" means and check the turn direction aloud.',
          th: 'ยืนยันความเข้าใจคำว่า "jetty" และทวนทิศทางที่ต้องเลี้ยวให้มั่นใจ',
        },
        learnerTaskB1: {
          en: 'Restate Olivia’s explanation in your own words to make sure both of you mean the exact same spot.',
          th: 'สรุปคำอธิบายของโอลิเวียด้วยคำพูดของคุณเองเพื่อเช็กว่าเข้าใจจุดหมายตรงกัน 100%',
        },
        usefulExpressions: [
          'Ah, you mean the wooden pier over the water!',
          'So I walk past the jetty and turn left, right?',
          'Oh, I see what you mean now!',
        ],
        sentenceStartersA2: [
          {
            en: 'Oh, you mean the wooden pier! So I pass it and turn left, right?',
            th: 'อ๋อ หมายถึงท่าเรือไม้! งั้นเดินผ่านท่าไม้นั้นแล้วเลี้ยวซ้าย ใช่ไหมครับ/คะ?',
          },
        ],
        sentenceStartersB1: [
          {
            en: 'Ah, I see—so "jetty" means the wooden pier over the water, and I keep left beside the pergola after passing it, right?',
            th: 'อ๋อ เข้าใจแล้ว—"jetty" คือท่าเรือไม้บนน้ำ แล้วพอเดินผ่านปุ๊บให้ชิดซ้ายข้างซุ้มไม้ ใช่ไหมครับ/คะ?',
          },
        ],
        modelResponseA2: {
          en: 'Oh, a jetty is the wooden pier! So I walk past it and turn left, right?',
          th: 'อ๋อ jetty คือท่าเรือไม้! งั้นเดินเลยท่าเรือไม้แล้วเลี้ยวซ้าย ใช่ไหมครับ/คะ?',
        },
        modelResponseB1: {
          en: 'Ah, got it—by "jetty" you mean that small wooden pier over the water, so I pass it and follow the pergola path to the left, right?',
          th: 'อ๋อ เข้าใจแล้ว—คำว่า "jetty" คือท่าเทียบเรือไม้เล็กๆ เหนือน้ำ พอเดินเลยจุดนั้นก็เลี้ยวซ้ายตามซุ้มไม้ ใช่ไหมครับ/คะ?',
        },
        thaiTip: 'ใช้ "Oh, you mean..." เพื่อตรวจสอบความหมายของคำใหม่กับผู้พูดโดยตรง',
      },
      {
        turnId: 'hgp_turn_3',
        turnNumber: 3,
        npcSpeakerId: 'npc_olivia',
        stageLabel: {
          en: 'Turn 3 · Respond & Wrap Up Confidently',
          th: 'รอบที่ 3 · ตอบรับอย่างมั่นใจและปิดการสนทนา',
        },
        npcPromptA2: {
          en: 'Yes, exactly right! You really checked carefully—are you ready to head to the lookout now?',
          th: 'ใช่เลยค่ะ ถูกต้องเป๊ะ! คุณช่วยทวนอย่างละเอียดเลย—พร้อมเดินไปจุดชมวิวหรือยังคะ?',
        },
        npcPromptB1: {
          en: "Spot on! Checking back like that keeps communication crystal clear. Anything else I can clarify before you enjoy the harbour view?",
          th: 'เป๊ะเลยค่ะ! การทวนแบบนั้นช่วยให้การสื่อสารชัดเจนมาก มีอะไรอยากเช็กเพิ่มก่อนออกไปชมวิวอ่าวไหมคะ?',
        },
        learnerTaskA2: {
          en: 'Respond cheerfully, say you feel ready now, and thank Olivia for helping!',
          th: 'ตอบรับอย่างสดใส บอกว่าพร้อมแล้ว และขอบคุณโอลิเวียที่ช่วยอธิบาย',
        },
        learnerTaskB1: {
          en: 'Thank Olivia warmly, say how clear the route feels now, and close your Sydney conversation journey politely.',
          th: 'ขอบคุณโอลิเวียอย่างอบอุ่น บอกว่าตอนนี้เข้าใจเส้นทางชัดเจนแล้ว และปิดท้ายการสนทนาอย่างสุภาพ',
        },
        usefulExpressions: [
          "Everything is clear now—thank you!",
          'Thanks for slowing down and helping me!',
          'Have a wonderful evening in Sydney!',
        ],
        sentenceStartersA2: [
          {
            en: "Yes, I'm ready now! Thank you so much for helping me, Olivia.",
            th: 'ครับ/ค่ะ ตอนนี้พร้อมแล้ว! ขอบคุณมากนะโอลิเวีย',
          },
        ],
        sentenceStartersB1: [
          {
            en: "Everything is completely clear now—thank you for explaining patiently! Enjoy the rest of your afternoon at the harbour!",
            th: 'ตอนนี้เข้าใจชัดเจนทั้งหมดแล้วครับ/ค่ะ—ขอบคุณที่อธิบายอย่างใจเย็นนะ! ขอให้มีช่วงบ่ายที่สดใสริมอ่าวครับ/ค่ะ!',
          },
        ],
        modelResponseA2: {
          en: "Yes! Everything is clear now. Thanks so much for helping me, Olivia!",
          th: 'ครับ/ค่ะ! ตอนนี้เข้าใจชัดเจนแล้ว ขอบคุณมากที่ช่วยนะโอลิเวีย!',
        },
        modelResponseB1: {
          en: "Everything makes total sense now—thank you for taking the time to clarify! Wishing you a lovely evening at Harbour Gardens, Olivia!",
          th: 'เข้าใจแจ่มแจ้งเลยครับ/ค่ะ—ขอบคุณที่สละเวลาช่วยอธิบาย! ขอให้เป็นช่วงเย็นที่น่ารื่นรมย์ที่ Harbour Gardens นะโอลิเวีย!',
        },
        thaiTip: 'การขอบคุณเมื่ออีกฝ่ายช่วยพูดช้าลงสร้างความประทับใจที่ดีในทุกสถานการณ์',
      },
    ],
    closingNpcLine: {
      en: "You kept the conversation going like a true CityTalk explorer! You're ready for Stage 4 PERFORM when it opens!",
      th: 'คุณสานต่อบทสนทนาได้อย่างมืออาชีพเหมือนนักสำรวจตัวจริงเลย! พร้อมสู่ด่านที่ 4 PERFORM แล้วค่ะ!',
    },
    completionFeedbackA2: {
      en: 'Fantastic finish! You asked for repetition calmly, clarified the meaning of "jetty", and confirmed directions politely.',
      th: 'ปิดท้ายได้อย่างยอดเยี่ยม! คุณขอให้พูดซ้ำ ถามความหมายคำศัพท์ใหม่ และทวนความเข้าใจอย่างสุภาพครบถ้วน',
    },
    completionFeedbackB1: {
      en: 'Outstanding communication repair! You slowed the pace politely, checked unfamiliar vocabulary ("jetty"), and paraphrased to make sure nothing was missed.',
      th: 'ทักษะการซ่อมบทสนทนาดีเยี่ยมมาก! คุณขอให้ช้าลง เช็กคำที่ไม่คุ้น และสรุปทวนด้วยคำพูดตัวเองได้อย่างมั่นใจ',
    },
  },
];

export function getAustraliaPracticeMissionSpec(
  landmarkId: AustraliaLandmarkId,
): AustraliaPracticeMissionSpec | undefined {
  return AUSTRALIA_PRACTICE_MISSIONS.find((m) => m.id === landmarkId);
}

export interface AustraliaPracticeReflectionItem {
  key: keyof AustraliaSpeakingEvidenceRecord['reflectionChecks'];
  labelA2: LocalizedText;
  labelB1: LocalizedText;
}

export const AUSTRALIA_PRACTICE_REFLECTION_ITEMS: AustraliaPracticeReflectionItem[] = [
  {
    key: 'askedClearQuestion',
    labelA2: {
      en: 'I asked a clear question or started politely.',
      th: 'ฉันถามคำถามชัดเจน หรือทักทายเปิดบทสนทนาอย่างสุภาพ',
    },
    labelB1: {
      en: 'I opened naturally and asked a specific, clear question for this situation.',
      th: 'ฉันเปิดบทสนทนาอย่างเป็นธรรมชาติและตั้งคำถามเฉพาะเจาะจงเข้ากับสถานการณ์',
    },
  },
  {
    key: 'respondedToNpc',
    labelA2: {
      en: 'I listened and replied to the NPC’s answer.',
      th: 'ฉันฟังและตอบกลับข้อมูลจากตัวละครคู่สนทนา',
    },
    labelB1: {
      en: 'I responded directly to details the NPC shared across our turns.',
      th: 'ฉันตอบรับข้อมูลและเงื่อนไขที่คู่สนทนาแจ้งได้ตรงประเด็นในแต่ละรอบ',
    },
  },
  {
    key: 'usedPoliteExpression',
    labelA2: {
      en: 'I used polite English words (please / thank you / excuse me).',
      th: 'ฉันใช้คำสุภาพภาษาอังกฤษ (please / thank you / excuse me)',
    },
    labelB1: {
      en: 'I maintained friendly, polite tone and natural closing expressions.',
      th: 'ฉันรักษาน้ำเสียงเป็นมิตร สุภาพ และใช้คำขอบคุณปิดท้ายอย่างเหมาะสม',
    },
  },
  {
    key: 'checkedOrClarifiedMeaning',
    labelA2: {
      en: 'I checked or repeated key information carefully.',
      th: 'ฉันทวน ยืนยัน หรือเช็กข้อมูลสำคัญอย่างรอบคอบ',
    },
    labelB1: {
      en: 'I asked a follow-up question, confirmed a detail, or clarified meaning.',
      th: 'ฉันถามต่อยอด ยืนยันรายละเอียด หรือขอคำอธิบายเพิ่มเพื่อให้เข้าใจตรงกัน',
    },
  },
];

export function isValidAustraliaPracticeMode(val: unknown): val is AustraliaPracticeMode {
  return val === 'microphone_recording' || val === 'no_mic_rehearsal';
}

export function isValidAustraliaSpeakingEvidenceRecord(
  raw: unknown,
  requiredTurnIds?: readonly string[],
): raw is AustraliaSpeakingEvidenceRecord {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return false;
  const obj = raw as Record<string, unknown>;

  if (!isValidAustraliaPracticeMode(obj.practiceMode)) return false;
  if (obj.difficultyUsed !== 'a2' && obj.difficultyUsed !== 'b1') return false;
  if (typeof obj.completedAt !== 'string' || obj.completedAt.trim().length < 4) return false;

  if (!Array.isArray(obj.completedTurnIds) || obj.completedTurnIds.length < 2) {
    return false;
  }
  const cleanTurns = Array.from(
    new Set(
      obj.completedTurnIds.filter((t): t is string => typeof t === 'string' && t.trim().length > 0),
    ),
  );
  if (cleanTurns.length < 2) return false;
  if (requiredTurnIds && requiredTurnIds.length >= 2) {
    for (const reqId of requiredTurnIds) {
      if (!cleanTurns.includes(reqId)) return false;
    }
  }

  const checks = obj.reflectionChecks;
  if (!checks || typeof checks !== 'object' || Array.isArray(checks)) return false;
  const c = checks as Record<string, unknown>;
  const boolKeys = [
    'askedClearQuestion',
    'respondedToNpc',
    'usedPoliteExpression',
    'checkedOrClarifiedMeaning',
  ] as const;
  let checkedCount = 0;
  for (const k of boolKeys) {
    if (typeof c[k] !== 'boolean') return false;
    if (c[k] === true) checkedCount += 1;
  }
  if (checkedCount < 1) return false;

  // Guard against any accidentally injected fake AI / score / audio keys
  if (
    'transcript' in obj ||
    'pronunciationScore' in obj ||
    'fluencyScore' in obj ||
    'audioBlob' in obj ||
    'audioBase64' in obj
  ) {
    return false;
  }

  return true;
}

export function sanitizeAustraliaSpeakingEvidenceRecord(
  raw: unknown,
  validTurnIds: readonly string[],
): AustraliaSpeakingEvidenceRecord | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const obj = raw as Record<string, unknown>;
  if (!isValidAustraliaPracticeMode(obj.practiceMode)) return null;
  const difficultyUsed: 'a2' | 'b1' = obj.difficultyUsed === 'b1' ? 'b1' : 'a2';
  const completedAt =
    typeof obj.completedAt === 'string' && obj.completedAt.trim().length >= 4
      ? obj.completedAt.trim().slice(0, 64)
      : '2026-01-01T00:00:00.000Z';

  if (!Array.isArray(obj.completedTurnIds)) return null;
  const validSet = new Set(validTurnIds);
  const completedTurnIds = Array.from(
    new Set(
      obj.completedTurnIds.filter(
        (t): t is string => typeof t === 'string' && validSet.has(t),
      ),
    ),
  );
  if (completedTurnIds.length < validTurnIds.length) return null;

  const rawChecks = obj.reflectionChecks;
  if (!rawChecks || typeof rawChecks !== 'object' || Array.isArray(rawChecks)) return null;
  const rc = rawChecks as Record<string, unknown>;
  const reflectionChecks = {
    askedClearQuestion: Boolean(rc.askedClearQuestion),
    respondedToNpc: Boolean(rc.respondedToNpc),
    usedPoliteExpression: Boolean(rc.usedPoliteExpression),
    checkedOrClarifiedMeaning: Boolean(rc.checkedOrClarifiedMeaning),
  };
  if (
    !reflectionChecks.askedClearQuestion &&
    !reflectionChecks.respondedToNpc &&
    !reflectionChecks.usedPoliteExpression &&
    !reflectionChecks.checkedOrClarifiedMeaning
  ) {
    return null;
  }

  return {
    practiceMode: obj.practiceMode,
    completedTurnIds,
    reflectionChecks,
    difficultyUsed,
    completedAt,
  };
}

export interface HonestPracticeFeedbackResult {
  reviewTypeLabel: LocalizedText;
  evidenceSummary: LocalizedText;
  strengthNote: LocalizedText;
  nextStepNote: LocalizedText;
}

export function buildAustraliaPracticeFeedback(params: {
  landmarkId: AustraliaLandmarkId;
  practiceMode: AustraliaPracticeMode;
  difficultyUsed: 'a2' | 'b1';
  turnCount: number;
  allFinished: boolean;
}): HonestPracticeFeedbackResult {
  const mission = getAustraliaPracticeMissionSpec(params.landmarkId) ?? AUSTRALIA_PRACTICE_MISSIONS[0];
  const isMic = params.practiceMode === 'microphone_recording';

  const reviewTypeLabel: LocalizedText = {
    en: isMic
      ? 'Guided Self-Review · Microphone Recording Mode (In-Memory Session)'
      : 'Guided Self-Review · No-Mic Rehearsal Mode',
    th: isMic
      ? 'ทบทวนด้วยตนเอง · โหมดบันทึกเสียงไมโครโฟน (เก็บชั่วคราวในเครื่องเท่านั้น)'
      : 'ทบทวนด้วยตนเอง · โหมดซ้อมพูดโดยไม่ใช้ไมโครโฟน (No-Mic Rehearsal)',
  };

  const evidenceSummary: LocalizedText = isMic
    ? {
        en: `Recorded & reviewed ${params.turnCount} speaking turns locally (no AI scoring or automated transcript generated).`,
        th: `บันทึกและฟังทบทวนครบทั้ง ${params.turnCount} รอบในเครื่องแล้ว (ไม่มีการถอดข้อความหรือให้คะแนนด้วย AI)`,
      }
    : {
        en: `Completed & confirmed ${params.turnCount} aloud rehearsal turns in No-Mic mode (no microphone audio claimed).`,
        th: `ซ้อมพูดออกเสียงและยืนยันครบทั้ง ${params.turnCount} รอบในโหมด No-Mic แล้ว (ไม่มีไฟล์เสียงจากไมโครโฟน)`,
      };

  const strengthNote =
    params.difficultyUsed === 'b1' ? mission.completionFeedbackB1 : mission.completionFeedbackA2;

  const nextStepNote: LocalizedText = params.allFinished
    ? {
        en: 'All 5 Sydney speaking missions completed (+50 XP earned once)! Stage 4 PERFORM is unlocked (Coming Soon).',
        th: 'ฝึกพูดครบทั้ง 5 ภารกิจในซิดนีย์แล้ว (+50 XP ครั้งเดียว)! ปลดล็อกด่านที่ 4 PERFORM (กำลังจะมาเร็ว ๆ นี้)',
      }
    : {
        en: 'Continue exploring Sydney to open your next speaking mission in the City Explorer Guide.',
        th: 'สำรวจซิดนีย์ต่อเพื่อไปยังภารกิจฝึกพูดลำดับถัดไปในคู่มือสำรวจเมืองได้เลย',
      };

  return {
    reviewTypeLabel,
    evidenceSummary,
    strengthNote,
    nextStepNote,
  };
}

export function validateAustraliaPracticeBanks(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const seenIds = new Set<string>();
  const seenTurnIds = new Set<string>();

  if (AUSTRALIA_PRACTICE_MISSIONS.length !== 5) {
    errors.push(`Expected 5 Australia PRACTICE missions, found ${AUSTRALIA_PRACTICE_MISSIONS.length}`);
  }

  for (let idx = 0; idx < AUSTRALIA_PRACTICE_MISSIONS.length; idx += 1) {
    const m = AUSTRALIA_PRACTICE_MISSIONS[idx];
    if (seenIds.has(m.id)) {
      errors.push(`Duplicate mission id: ${m.id}`);
    }
    seenIds.add(m.id);

    if (m.id !== AUSTRALIA_PRACTICE_MISSION_ORDER[idx]) {
      errors.push(`Mission order mismatch at index ${idx}: ${m.id}`);
    }
    if (m.turns.length < 2) {
      errors.push(`Mission ${m.id} must have at least 2 learner speaking turns`);
    }
    for (const t of m.turns) {
      if (seenTurnIds.has(t.turnId)) {
        errors.push(`Duplicate turn id: ${t.turnId}`);
      }
      seenTurnIds.add(t.turnId);
      if (!t.npcPromptA2.en || !t.npcPromptA2.th || !t.npcPromptB1.en || !t.npcPromptB1.th) {
        errors.push(`Missing bilingual NPC prompt on turn ${t.turnId}`);
      }
      if (!t.learnerTaskA2.en || !t.learnerTaskA2.th || !t.learnerTaskB1.en || !t.learnerTaskB1.th) {
        errors.push(`Missing bilingual learner task on turn ${t.turnId}`);
      }
      if (!t.modelResponseA2.en || !t.modelResponseB1.en) {
        errors.push(`Missing model response on turn ${t.turnId}`);
      }
    }
  }

  // Ensure Mission 5 reuses Olivia Parker (no 5th NPC)
  const helpPointMission = AUSTRALIA_PRACTICE_MISSIONS.find(
    (m) => m.id === 'harbour_gardens_help_point',
  );
  if (!helpPointMission || helpPointMission.npcId !== 'npc_olivia') {
    errors.push('Mission 5 must reuse npc_olivia at harbour_gardens_help_point');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
