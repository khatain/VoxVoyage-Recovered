import type { LocalizedText } from '../types/game';
import {
  AUSTRALIA_RECOMMENDED_ROUTE,
  AUSTRALIA_STAGE_ACTIVITY_IDS,
  type AustraliaLandmarkId,
  type AustraliaNpcId,
} from './australiaWorld';
import {
  buildSandwichFeedback,
  type AustraliaDifficultyMode,
} from './australiaDiscovery';

export const AUSTRALIA_BUILD_ACTIVITY_ID = AUSTRALIA_STAGE_ACTIVITY_IDS.build;
export const AUSTRALIA_BUILD_XP_REWARD = 50;

export const AUSTRALIA_BUILD_MISSION_ORDER: readonly AustraliaLandmarkId[] =
  AUSTRALIA_RECOMMENDED_ROUTE;

export type AustraliaBuildMechanicId =
  | 'sequence_builder'
  | 'direction_tile_route'
  | 'cafe_multi_turn'
  | 'info_gap_question'
  | 'repair_workshop';

export type AustraliaBuildMissionId =
  | 'conversation_starter_forge'
  | 'direction_dialogue_architect'
  | 'cafe_conversation_kitchen'
  | 'ticket_information_builder'
  | 'dialogue_rescue_workshop';

export const AUSTRALIA_OLIVIA_BUILD_WELCOME: LocalizedText = {
  en: "You've discovered how people communicate in Sydney. Now it's time to put those expressions together! Every great conversation begins with the right words and continues with a thoughtful response. Let's build your communication skills!",
  th: 'คุณได้ค้นพบวิธีที่ผู้คนสื่อสารกันในซิดนีย์แล้ว ตอนนี้ถึงเวลานำประโยคเหล่านั้นมาประกอบเข้าด้วยกัน! ทุกบทสนทนาที่ดีเริ่มต้นด้วยถ้อยคำที่เหมาะสมและต่อเนื่องด้วยการตอบกลับอย่างใส่ใจ มาสร้างทักษะการสื่อสารของคุณกันเถอะ!',
};

export interface AustraliaBuildMissionMeta {
  order: number;
  missionId: AustraliaBuildMissionId;
  landmarkId: AustraliaLandmarkId;
  npcId: AustraliaNpcId;
  mechanicId: AustraliaBuildMechanicId;
  title: LocalizedText;
  mechanicLabel: LocalizedText;
  communicationGoal: LocalizedText;
  introLine: LocalizedText;
  craftBadge: LocalizedText;
  defaultArtifactModel: string;
}

export const AUSTRALIA_BUILD_MISSIONS: AustraliaBuildMissionMeta[] = [
  {
    order: 1,
    missionId: 'conversation_starter_forge',
    landmarkId: 'circular_quay_plaza',
    npcId: 'npc_olivia',
    mechanicId: 'sequence_builder',
    title: {
      en: 'Mission 1 · Conversation Starter Forge',
      th: 'ภารกิจที่ 1 · สร้างลำดับบทสนทนาเริ่มต้น',
    },
    mechanicLabel: {
      en: 'Conversation Sequence Builder',
      th: 'ต่อลำดับบัตรบทสนทนาให้ไหลลื่น',
    },
    communicationGoal: {
      en: 'Arrange greetings, requests, responses, follow-ups, and polite closings into a natural exchange.',
      th: 'เรียงลำดับคำทักทาย คำขอ คำตอบ การถามต่อ และคำลาอย่างสุภาพให้เป็นบทสนทนาที่สมเหตุสมผล',
    },
    introLine: {
      en: 'Put real Circular Quay conversation turns in logical order from polite opening to warm closing.',
      th: 'ช่วยจัดเรียงบทสนทนาที่เซอร์คิวลาร์คีย์ให้ถูกต้องตั้งแต่คำทักทายจนถึงคำขอบคุณปิดท้าย',
    },
    craftBadge: {
      en: 'Crafted Skill · Logical Conversation Flow',
      th: 'ทักษะที่สร้างสำเร็จ · การลำดับบทสนทนาอย่างเป็นธรรมชาติ',
    },
    defaultArtifactModel:
      'Excuse me, could you help me? Where can I find the visitor centre? Thank you very much!',
  },
  {
    order: 2,
    missionId: 'direction_dialogue_architect',
    landmarkId: 'city_transit_station',
    npcId: 'npc_noah',
    mechanicId: 'direction_tile_route',
    title: {
      en: 'Mission 2 · Direction Dialogue Architect',
      th: 'ภารกิจที่ 2 · สถาปนิกประโยคถามทาง',
    },
    mechanicLabel: {
      en: 'Sentence Tile Builder + Route Confirmation',
      th: 'ประกอบแผ่นคำ + ยืนยันเส้นทางบนแผนที่',
    },
    communicationGoal: {
      en: 'Build direction questions and confirmation checks while matching routes and speaker purpose.',
      th: 'สร้างประโยคถามทางและถามทวนความเข้าใจ พร้อมระบุจุดหมายและบทบาทของการพูดแต่ละช่วง',
    },
    introLine: {
      en: 'Assemble clear transit questions from tiles, identify their communicative purpose, and confirm Noah’s route.',
      th: 'ประกอบแผ่นคำเป็นประโยคถามทางที่สุภาพ เลือกหน้าที่ของประโยค และยืนยันจุดหมายบนแผนที่เส้นทาง',
    },
    craftBadge: {
      en: 'Crafted Skill · Route Questioning & Checking',
      th: 'ทักษะที่สร้างสำเร็จ · การถามทางและทวนความเข้าใจ',
    },
    defaultArtifactModel:
      'Could you tell me how to get there? So I turn left after the station, right?',
  },
  {
    order: 3,
    missionId: 'cafe_conversation_kitchen',
    landmarkId: 'harbour_market_cafe',
    npcId: 'npc_mia',
    mechanicId: 'cafe_multi_turn',
    title: {
      en: 'Mission 3 · Café Conversation Kitchen',
      th: 'ภารกิจที่ 3 · ครัวสร้างบทสนทนาคาเฟ่',
    },
    mechanicLabel: {
      en: 'Multi-Turn Order Construction',
      th: 'ประกอบบทสนทนาสั่งอาหารหลายรอบ',
    },
    communicationGoal: {
      en: 'Construct connected customer–staff café exchanges including options, follow-ups, and confirmations.',
      th: 'สร้างบทสนทนาระหว่างลูกค้ากับพนักงานคาเฟ่ ตั้งแต่สั่งอาหาร ถามส่วนผสม ตอบคำถามเสริม และยืนยันออเดอร์',
    },
    introLine: {
      en: 'Use the Harbour Café menu and order tray to assemble each customer reply step by step with Mia.',
      th: 'ดูเมนูจำลองและถาดอาหาร แล้วประกอบคำตอบของลูกค้าทีละขั้นให้ต่อเนื่องกับคำถามของมีอา',
    },
    craftBadge: {
      en: 'Crafted Skill · Polite Multi-Turn Ordering',
      th: 'ทักษะที่สร้างสำเร็จ · การสั่งอาหารอย่างสุภาพหลายขั้นตอน',
    },
    defaultArtifactModel:
      "Could I have a chicken sandwich, please? Yes, I'd like some orange juice. No, that's all. Thank you!",
  },
  {
    order: 4,
    missionId: 'ticket_information_builder',
    landmarkId: 'darling_harbour_hub',
    npcId: 'npc_jack',
    mechanicId: 'info_gap_question',
    title: {
      en: 'Mission 4 · Ticket & Information Builder',
      th: 'ภารกิจที่ 4 · นักสร้างคำถามข้อมูลท่องเที่ยว',
    },
    mechanicLabel: {
      en: 'Information-Gap Question Builder',
      th: 'สร้างคำถามจากกระดานข้อมูลท่องเที่ยว',
    },
    communicationGoal: {
      en: 'Form targeted questions to close missing details about schedules, student tickets, booking, and tips.',
      th: 'สร้างคำถามเพื่อสอบถามเวลาเริ่ม ค่าตั๋วนักเรียน การจองล่วงหน้า และคำแนะนำกิจกรรมจากกระดานข้อมูล',
    },
    introLine: {
      en: 'Check Jack’s visitor information goal, build a polite question, and pick the best follow-up confirmation.',
      th: 'ดูเป้าหมายข้อมูลที่ขาดบนกระดานของแจ็ก แล้วประกอบคำถามและประโยคทวนคำตอบอย่างเหมาะสม',
    },
    craftBadge: {
      en: 'Crafted Skill · Purposeful Information Questions',
      th: 'ทักษะที่สร้างสำเร็จ · การตั้งคำถามหาข้อมูลอย่างตรงจุด',
    },
    defaultArtifactModel:
      'What time does the tour start? Do I need to book in advance? Which activity would you recommend?',
  },
  {
    order: 5,
    missionId: 'dialogue_rescue_workshop',
    landmarkId: 'harbour_gardens_help_point',
    npcId: 'npc_olivia',
    mechanicId: 'repair_workshop',
    title: {
      en: 'Mission 5 · Dialogue Rescue Workshop',
      th: 'ภารกิจที่ 5 · เวิร์กช็อปกู้สถานการณ์การสื่อสาร',
    },
    mechanicLabel: {
      en: 'Communication Repair Builder',
      th: 'ฝึกวิเคราะห์ปัญหาและสร้างประโยคขอคำอธิบาย',
    },
    communicationGoal: {
      en: 'Identify conversation breakdowns, assemble clarification requests, and keep exchanges respectful.',
      th: 'ระบุสาเหตุที่สื่อสารคลาดเคลื่อน ประกอบประโยคขอให้พูดซ้ำหรืออธิบายเพิ่ม และเลือกคำตอบปิดท้ายที่สุภาพ',
    },
    introLine: {
      en: 'Spot what went wrong in a fast city chat, build a calm repair sentence, and choose the right follow-up.',
      th: 'วิเคราะห์ปัญหาในบทสนทนาจริง แล้วต่อประโยคขอให้ช่วยอธิบายซ้ำพร้อมตอบรับอย่างมั่นใจ',
    },
    craftBadge: {
      en: 'Crafted Skill · Confident Communication Repair',
      th: 'ทักษะที่สร้างสำเร็จ · การแก้ไขความเข้าใจผิดอย่างมั่นใจ',
    },
    defaultArtifactModel:
      'Sorry, could you repeat that, please? Could you speak a little more slowly? Let me check if I understood correctly.',
  },
];

export function getAustraliaBuildMissionMeta(
  landmarkId: AustraliaLandmarkId,
): AustraliaBuildMissionMeta {
  return (
    AUSTRALIA_BUILD_MISSIONS.find((m) => m.landmarkId === landmarkId) ??
    AUSTRALIA_BUILD_MISSIONS[0]
  );
}

// ---------------------------------------------------------------------------
// Utility Helpers for Deterministic Multi-Answer Validation
// ---------------------------------------------------------------------------

export function normalizeConversationText(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s+([?.!,])/g, '$1')
    .replace(/[’‘]/g, "'")
    .toLowerCase();
}

export function isAcceptedTileSentence(
  tokens: string[],
  acceptedSets: string[][],
): boolean {
  const joined = normalizeConversationText(tokens.join(' '));
  return acceptedSets.some(
    (expected) => normalizeConversationText(expected.join(' ')) === joined,
  );
}

// ---------------------------------------------------------------------------
// 1. Conversation Starter Forge (Circular Quay — Olivia)
// ---------------------------------------------------------------------------

export type DialogueRoleFunction =
  | 'opening'
  | 'request'
  | 'response'
  | 'follow_up'
  | 'closing';

export interface SequenceDialogueCard {
  id: string;
  speakerRole: 'visitor' | 'local';
  speakerName: LocalizedText;
  roleFunction: DialogueRoleFunction;
  text: LocalizedText;
}

export interface SequenceBuilderChallenge {
  id: string;
  scenario: LocalizedText;
  participants: LocalizedText;
  learningObjective: LocalizedText;
  a2: {
    cards: SequenceDialogueCard[];
    acceptedSequences: string[][];
    audioModel: string;
  };
  b1: {
    cards: SequenceDialogueCard[];
    acceptedSequences: string[][];
    audioModel: string;
  };
  hint: LocalizedText;
  explanation: LocalizedText;
}

export const CONVERSATION_FORGE_CHALLENGES: SequenceBuilderChallenge[] = [
  {
    id: 'forge_1_visitor_centre',
    scenario: {
      en: 'You just arrived at Circular Quay Promenade and need to find the Visitor Information Centre.',
      th: 'คุณเพิ่งมาถึงลาน Circular Quay และต้องการหาศูนย์ข้อมูลนักท่องเที่ยว',
    },
    participants: {
      en: 'Visitor & Olivia Parker (Sydney Guide)',
      th: 'นักท่องเที่ยว และ โอลิเวีย พาร์กเกอร์',
    },
    learningObjective: {
      en: 'Order a greeting/opening, response, question, answer, and thank-you.',
      th: 'จัดเรียงคำทักทาย การตอบรับ คำถาม คำตอบ และคำขอบคุณให้ต่อเนื่องกัน',
    },
    a2: {
      cards: [
        {
          id: 'c1',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'opening',
          text: {
            en: 'Excuse me, could you help me?',
            th: 'ขอโทษนะครับ ช่วยผมหน่อยได้ไหมครับ?',
          },
        },
        {
          id: 'c2',
          speakerRole: 'local',
          speakerName: { en: 'Olivia', th: 'โอลิเวีย' },
          roleFunction: 'response',
          text: {
            en: 'Of course. What would you like to know?',
            th: 'ได้เลยค่ะ อยากทราบเรื่องอะไรคะ?',
          },
        },
        {
          id: 'c3',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'request',
          text: {
            en: 'Where can I find the visitor centre?',
            th: 'ศูนย์ข้อมูลนักท่องเที่ยวอยู่ที่ไหนครับ?',
          },
        },
        {
          id: 'c4',
          speakerRole: 'local',
          speakerName: { en: 'Olivia', th: 'โอลิเวีย' },
          roleFunction: 'response',
          text: {
            en: "It's near the harbour entrance.",
            th: 'อยู่ใกล้ทางเข้าท่าเรืออ่าวค่ะ',
          },
        },
        {
          id: 'c5',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'closing',
          text: {
            en: 'Thank you very much!',
            th: 'ขอบคุณมากครับ!',
          },
        },
      ],
      acceptedSequences: [['c1', 'c2', 'c3', 'c4', 'c5']],
      audioModel:
        "Excuse me, could you help me? Of course. What would you like to know? Where can I find the visitor centre? It's near the harbour entrance. Thank you very much!",
    },
    b1: {
      cards: [
        {
          id: 'b1_1',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'opening',
          text: {
            en: 'Excuse me, do you have a moment to help me?',
            th: 'ขอโทษครับ พอจะมีเวลาช่วยผมสักครู่ไหมครับ?',
          },
        },
        {
          id: 'b1_2',
          speakerRole: 'local',
          speakerName: { en: 'Olivia', th: 'โอลิเวีย' },
          roleFunction: 'response',
          text: {
            en: 'Sure! What are you looking for around Circular Quay?',
            th: 'ได้เลยค่ะ กำลังมองหาอะไรแถว Circular Quay อยู่คะ?',
          },
        },
        {
          id: 'b1_3',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'request',
          text: {
            en: 'Could you tell me where the visitor information centre is?',
            th: 'ช่วยบอกได้ไหมครับว่าศูนย์ข้อมูลนักท่องเที่ยวอยู่ตรงไหน?',
          },
        },
        {
          id: 'b1_4',
          speakerRole: 'local',
          speakerName: { en: 'Olivia', th: 'โอลิเวีย' },
          roleFunction: 'response',
          text: {
            en: "It's right beside the main ferry entrance, next to the sandstone plaza.",
            th: 'อยู่ติดกับทางเข้าท่าเรือเฟอร์รี่หลัก ข้างลานหินทรายเลยค่ะ',
          },
        },
        {
          id: 'b1_5',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'follow_up',
          text: {
            en: 'Got it, beside the main ferry entrance—is it open now?',
            th: 'เข้าใจแล้วครับ ข้างทางเข้าท่าเรือหลัก—ตอนนี้เปิดอยู่ใช่ไหมครับ?',
          },
        },
        {
          id: 'b1_6',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'closing',
          text: {
            en: 'Thanks so much for your help today!',
            th: 'ขอบคุณมากสำหรับความช่วยเหลือในวันนี้นะครับ!',
          },
        },
      ],
      acceptedSequences: [
        ['b1_1', 'b1_2', 'b1_3', 'b1_4', 'b1_5', 'b1_6'],
        ['b1_1', 'b1_2', 'b1_3', 'b1_4', 'b1_6'],
      ],
      audioModel:
        "Excuse me, do you have a moment to help me? Sure! What are you looking for around Circular Quay? Could you tell me where the visitor information centre is? It's right beside the main ferry entrance, next to the sandstone plaza. Got it, beside the main ferry entrance—is it open now? Thanks so much for your help today!",
    },
    hint: {
      en: 'Notice how Visitor speaks -> Olivia responds -> Visitor asks -> Olivia answers -> Visitor checks or thanks.',
      th: 'สังเกตจังหวะสลับผู้พูด: ทักทาย -> โอลิเวียตอบรับ -> ถามข้อมูล -> โอลิเวียให้ข้อมูล -> ถามย้ำ/ขอบคุณปิดท้าย',
    },
    explanation: {
      en: 'A smooth opening invites help first before you ask your main question, and thanking closes politely.',
      th: 'การขออนุญาตและทักทายก่อนตั้งคำถามช่วยให้คู่สนทนาพร้อมช่วย และการขอบคุณช่วยจบการคุยอย่างประทับใจ',
    },
  },
  {
    id: 'forge_2_ferry_wharf',
    scenario: {
      en: 'You want to check which ferry wharf leaves for Darling Harbour.',
      th: 'คุณอยากทราบว่าท่าเรือเฟอร์รี่ไหนเดินทางไป Darling Harbour ได้',
    },
    participants: {
      en: 'Visitor & Olivia Parker (Sydney Guide)',
      th: 'นักท่องเที่ยว และ โอลิเวีย พาร์กเกอร์',
    },
    learningObjective: {
      en: 'Connect a warm greeting with a ferry wharf request and confirmation.',
      th: 'เชื่อมคำทักทายเข้ากับคำถามเรื่องท่าเรือและการยืนยันข้อมูล',
    },
    a2: {
      cards: [
        {
          id: 'f2_1',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'opening',
          text: {
            en: 'Good morning! Can I ask a quick question?',
            th: 'สวัสดีตอนเช้าครับ ขอถามสั้นๆ หน่อยได้ไหมครับ?',
          },
        },
        {
          id: 'f2_2',
          speakerRole: 'local',
          speakerName: { en: 'Olivia', th: 'โอลิเวีย' },
          roleFunction: 'response',
          text: {
            en: 'Morning! Yes, go ahead.',
            th: 'สวัสดีตอนเช้าค่ะ เชิญถามได้เลยค่ะ',
          },
        },
        {
          id: 'f2_3',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'request',
          text: {
            en: 'Which wharf goes to Darling Harbour?',
            th: 'ท่าเรือไหนไป Darling Harbour ครับ?',
          },
        },
        {
          id: 'f2_4',
          speakerRole: 'local',
          speakerName: { en: 'Olivia', th: 'โอลิเวีย' },
          roleFunction: 'response',
          text: {
            en: 'Wharf 4 leaves every 15 minutes.',
            th: 'ท่าเรือ 4 ออกทุกๆ 15 นาทีค่ะ',
          },
        },
        {
          id: 'f2_5',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'closing',
          text: {
            en: 'Great, Wharf 4. Thanks!',
            th: 'เยี่ยมเลยครับ ท่าเรือ 4 ขอบคุณครับ!',
          },
        },
      ],
      acceptedSequences: [['f2_1', 'f2_2', 'f2_3', 'f2_4', 'f2_5']],
      audioModel:
        'Good morning! Can I ask a quick question? Morning! Yes, go ahead. Which wharf goes to Darling Harbour? Wharf 4 leaves every 15 minutes. Great, Wharf 4. Thanks!',
    },
    b1: {
      cards: [
        {
          id: 'f2b_1',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'opening',
          text: {
            en: "Hi there! I'm hoping to catch a ferry to Darling Harbour.",
            th: 'สวัสดีครับ ผมกำลังอยากขึ้นเรือเฟอร์รี่ไป Darling Harbour ครับ',
          },
        },
        {
          id: 'f2b_2',
          speakerRole: 'local',
          speakerName: { en: 'Olivia', th: 'โอลิเวีย' },
          roleFunction: 'response',
          text: {
            en: "Happy to help! You'll want Wharf 4 just on your left.",
            th: 'ยินดีช่วยเลยค่ะ คุณต้องไปที่ท่าเรือ 4 ทางซ้ายมือนี้ค่ะ',
          },
        },
        {
          id: 'f2b_3',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'follow_up',
          text: {
            en: 'Thanks! Does the ferry take transit cards, or should I buy a paper ticket?',
            th: 'ขอบคุณครับ บนเรือใช้บัตรโดยสารได้เลย หรือควรซื้อตั๋วกระดาษครับ?',
          },
        },
        {
          id: 'f2b_4',
          speakerRole: 'local',
          speakerName: { en: 'Olivia', th: 'โอลิเวีย' },
          roleFunction: 'response',
          text: {
            en: 'You can tap your transit card right at the boarding gate.',
            th: 'สามารถแตะบัตรโดยสารที่ประตูทางขึ้นเรือได้เลยค่ะ',
          },
        },
        {
          id: 'f2b_5',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'closing',
          text: {
            en: "That's super helpful. Have a lovely morning!",
            th: 'ข้อมูลเป็นประโยชน์มากเลยครับ ขอให้มีเช้าที่สดใสนะครับ!',
          },
        },
      ],
      acceptedSequences: [['f2b_1', 'f2b_2', 'f2b_3', 'f2b_4', 'f2b_5']],
      audioModel:
        "Hi there! I'm hoping to catch a ferry to Darling Harbour. Happy to help! You'll want Wharf 4 just on your left. Thanks! Does the ferry take transit cards, or should I buy a paper ticket? You can tap your transit card right at the boarding gate. That's super helpful. Have a lovely morning!",
    },
    hint: {
      en: 'Follow the alternating Visitor <-> Olivia turns, ending with confirmation or gratitude.',
      th: 'เรียงสลับระหว่างคำถามของนักท่องเที่ยวกับคำตอบของโอลิเวีย แล้วจบด้วยการขอบคุณหรือยืนยันข้อมูล',
    },
    explanation: {
      en: 'Notice how thanking AND confirming ("Great, Wharf 4") prevents boarding the wrong boat.',
      th: 'การทวนคำตอบสั้นๆ พร้อมขอบคุณ ("Great, Wharf 4") ช่วยป้องกันการขึ้นผิดท่าเรือ',
    },
  },
  {
    id: 'forge_3_waterfront_photo',
    scenario: {
      en: 'You meet a friendly Sydney local on the promenade and want to ask her to take a quick photo.',
      th: 'คุณพบชาวเมืองที่เป็นมิตรบนทางเดินริมน้ำและอยากขอให้ช่วยถ่ายรูปให้',
    },
    participants: {
      en: 'Visitor & Olivia Parker (Sydney Guide)',
      th: 'นักท่องเที่ยว และ โอลิเวีย พาร์กเกอร์',
    },
    learningObjective: {
      en: 'Make a polite favour request with softeners and an appreciative response.',
      th: 'ขอความช่วยเหลืออย่างสุภาพพร้อมตอบรับและขอบคุณอย่างเป็นมิตร',
    },
    a2: {
      cards: [
        {
          id: 'f3_1',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'opening',
          text: {
            en: 'Excuse me, sorry to bother you.',
            th: 'ขอโทษนะครับ รบกวนสักครู่ได้ไหมครับ',
          },
        },
        {
          id: 'f3_2',
          speakerRole: 'local',
          speakerName: { en: 'Olivia', th: 'โอลิเวีย' },
          roleFunction: 'response',
          text: {
            en: 'No problem at all! How can I help?',
            th: 'ไม่รบกวนเลยค่ะ มีอะไรให้ช่วยคะ?',
          },
        },
        {
          id: 'f3_3',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'request',
          text: {
            en: 'Could you take a photo of me by the harbour?',
            th: 'ช่วยถ่ายรูปให้ผมริมอ่าวหน่อยได้ไหมครับ?',
          },
        },
        {
          id: 'f3_4',
          speakerRole: 'local',
          speakerName: { en: 'Olivia', th: 'โอลิเวีย' },
          roleFunction: 'response',
          text: {
            en: 'Sure! Ready? One, two, three—smile!',
            th: 'ได้เลยค่ะ พร้อมนะคะ หนึ่ง สอง สาม ยิ้มค่ะ!',
          },
        },
        {
          id: 'f3_5',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'closing',
          text: {
            en: 'Thank you! The photo looks great.',
            th: 'ขอบคุณครับ รูปสวยมากเลย!',
          },
        },
      ],
      acceptedSequences: [['f3_1', 'f3_2', 'f3_3', 'f3_4', 'f3_5']],
      audioModel:
        'Excuse me, sorry to bother you. No problem at all! How can I help? Could you take a photo of me by the harbour? Sure! Ready? One, two, three—smile! Thank you! The photo looks great.',
    },
    b1: {
      cards: [
        {
          id: 'f3b_1',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'opening',
          text: {
            en: 'Excuse me, would you mind helping me for a second?',
            th: 'ขอโทษครับ จะรบกวนช่วยผมสักครู่ได้ไหมครับ?',
          },
        },
        {
          id: 'f3b_2',
          speakerRole: 'local',
          speakerName: { en: 'Olivia', th: 'โอลิเวีย' },
          roleFunction: 'response',
          text: {
            en: 'Not at all! What do you need?',
            th: 'ยินดีเลยค่ะ ให้ช่วยเรื่องอะไรคะ?',
          },
        },
        {
          id: 'f3b_3',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'request',
          text: {
            en: 'Could you possibly take a quick picture with the harbour bridge behind me?',
            th: 'ช่วยถ่ายรูปให้โดยให้เห็นสะพานฮาร์เบอร์ด้านหลังหน่อยได้ไหมครับ?',
          },
        },
        {
          id: 'f3b_4',
          speakerRole: 'local',
          speakerName: { en: 'Olivia', th: 'โอลิเวีย' },
          roleFunction: 'response',
          text: {
            en: "Of course! I'll frame the whole bridge in the shot for you.",
            th: 'ได้เลยค่ะ เดี๋ยวจัดมุมให้เห็นสะพานเต็มๆ เลยนะคะ',
          },
        },
        {
          id: 'f3b_5',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'closing',
          text: {
            en: 'I really appreciate it—thanks again!',
            th: 'ขอบคุณมากจริงๆ ครับ!',
          },
        },
      ],
      acceptedSequences: [['f3b_1', 'f3b_2', 'f3b_3', 'f3b_4', 'f3b_5']],
      audioModel:
        "Excuse me, would you mind helping me for a second? Not at all! What do you need? Could you possibly take a quick picture with the harbour bridge behind me? Of course! I'll frame the whole bridge in the shot for you. I really appreciate it—thanks again!",
    },
    hint: {
      en: 'Wait for the local to say "Yes / No problem" before handing over the camera request!',
      th: 'รอให้คู่สนทนาตอบรับคำทักทายก่อน แล้วค่อยขอให้ช่วยถ่ายรูป จากนั้นค่อยขอบคุณปิดท้าย',
    },
    explanation: {
      en: 'Using softeners like "Excuse me" or "would you mind" makes everyday requests sound respectful and warm.',
      th: 'การใช้คำเกริ่นอย่าง "Excuse me" หรือ "would you mind" ช่วยให้คำขอฟังดูนุ่มนวลและน่าช่วยเหลือ',
    },
  },
  {
    id: 'forge_4_city_walk_tip',
    scenario: {
      en: 'You are planning an afternoon walk along the waterfront and want a recommendation.',
      th: 'คุณกำลังวางแผนเดินเล่นริมน้ำช่วงบ่ายและอยากขอคำแนะนำเส้นทาง',
    },
    participants: {
      en: 'Visitor & Olivia Parker (Sydney Guide)',
      th: 'นักท่องเที่ยว และ โอลิเวีย พาร์กเกอร์',
    },
    learningObjective: {
      en: 'Ask for a recommendation, respond to a suggestion, and add a follow-up question.',
      th: 'ขอคำแนะนำ ตอบรับคำแนะนำ และถามรายละเอียดต่ออย่างเป็นธรรมชาติ',
    },
    a2: {
      cards: [
        {
          id: 'f4_1',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'opening',
          text: {
            en: 'Hi Olivia! Do you know this area well?',
            th: 'สวัสดีโอลิเวีย! คุณรู้จักแถวนี้ดีไหมครับ?',
          },
        },
        {
          id: 'f4_2',
          speakerRole: 'local',
          speakerName: { en: 'Olivia', th: 'โอลิเวีย' },
          roleFunction: 'response',
          text: {
            en: 'Yes, I work near the harbour every day.',
            th: 'รู้จักดีค่ะ ฉันทำงานแถวอ่าวทุกวันเลย',
          },
        },
        {
          id: 'f4_3',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'request',
          text: {
            en: 'What place is nice to walk this afternoon?',
            th: 'บ่ายนี้เดินเล่นที่ไหนดีครับ?',
          },
        },
        {
          id: 'f4_4',
          speakerRole: 'local',
          speakerName: { en: 'Olivia', th: 'โอลิเวีย' },
          roleFunction: 'response',
          text: {
            en: 'I recommend Harbour Gardens. The water view is lovely.',
            th: 'แนะนำ Harbour Gardens ค่ะ วิวริมน้ำสวยมากเลย',
          },
        },
        {
          id: 'f4_5',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'closing',
          text: {
            en: 'Sounds great, thank you!',
            th: 'ฟังดูดีเลย ขอบคุณครับ!',
          },
        },
      ],
      acceptedSequences: [['f4_1', 'f4_2', 'f4_3', 'f4_4', 'f4_5']],
      audioModel:
        'Hi Olivia! Do you know this area well? Yes, I work near the harbour every day. What place is nice to walk this afternoon? I recommend Harbour Gardens. The water view is lovely. Sounds great, thank you!',
    },
    b1: {
      cards: [
        {
          id: 'f4b_1',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'opening',
          text: {
            en: "Hi Olivia! Since it's my first day in Sydney, could I ask for a local tip?",
            th: 'สวัสดีโอลิเวีย! วันนี้เป็นวันแรกของผมในซิดนีย์ ขอคำแนะนำจากคนท้องถิ่นหน่อยได้ไหมครับ?',
          },
        },
        {
          id: 'f4b_2',
          speakerRole: 'local',
          speakerName: { en: 'Olivia', th: 'โอลิเวีย' },
          roleFunction: 'response',
          text: {
            en: 'Of course! What kind of afternoon walk do you enjoy?',
            th: 'ยินดีเลยค่ะ ชอบการเดินเล่นแบบไหนเป็นพิเศษคะ?',
          },
        },
        {
          id: 'f4b_3',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'request',
          text: {
            en: "Somewhere shady with harbour views—what would you suggest?",
            th: 'ขอที่ร่มรื่นและมองเห็นวิวอ่าว—คุณแนะนำที่ไหนดีครับ?',
          },
        },
        {
          id: 'f4b_4',
          speakerRole: 'local',
          speakerName: { en: 'Olivia', th: 'โอลิเวีย' },
          roleFunction: 'response',
          text: {
            en: 'Definitely Harbour Gardens—just follow the coastal path west past the sails.',
            th: 'แนะนำ Harbour Gardens เลยค่ะ แค่เดินตามทางเลียบอ่าวไปทางตะวันตกเลยอาคารใบเรือไปหน่อย',
          },
        },
        {
          id: 'f4b_5',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'follow_up',
          text: {
            en: 'Wonderful! About how long does it take to walk there?',
            th: 'ยอดเยี่ยมเลยครับ ใช้เวลาเดินไปประมาณกี่นาทีครับ?',
          },
        },
        {
          id: 'f4b_6',
          speakerRole: 'local',
          speakerName: { en: 'Olivia', th: 'โอลิเวีย' },
          roleFunction: 'closing',
          text: {
            en: 'Only about ten minutes at an easy pace. Enjoy!',
            th: 'เดินสบายๆ ประมาณ 10 นาทีเท่านั้นค่ะ เที่ยวให้สนุกนะคะ!',
          },
        },
      ],
      acceptedSequences: [['f4b_1', 'f4b_2', 'f4b_3', 'f4b_4', 'f4b_5', 'f4b_6']],
      audioModel:
        "Hi Olivia! Since it's my first day in Sydney, could I ask for a local tip? Of course! What kind of afternoon walk do you enjoy? Somewhere shady with harbour views—what would you suggest? Definitely Harbour Gardens—just follow the coastal path west past the sails. Wonderful! About how long does it take to walk there? Only about ten minutes at an easy pace. Enjoy!",
    },
    hint: {
      en: 'Place the specific question ("What place..." / "what would you suggest?") right before Olivia recommends Harbour Gardens.',
      th: 'วางคำถามขอคำแนะนำไว้ก่อนคำตอบที่โอลิเวียแนะนำสวน Harbour Gardens',
    },
    explanation: {
      en: 'Asking a follow-up question like "About how long does it take?" shows active engagement in the conversation.',
      th: 'การถามต่ออย่าง "ใช้เวลาเดินประมาณกี่นาที" ช่วยให้ได้ข้อมูลครบและแสดงความตั้งใจคุย',
    },
  },
  {
    id: 'forge_5_small_talk_welcome',
    scenario: {
      en: 'You want to introduce yourself briefly to a fellow explorer and wrap up politely.',
      th: 'คุณต้องการแนะนำตัวสั้นๆ กับเพื่อนร่วมทางและกล่าวลาก่อนแยกย้ายอย่างสุภาพ',
    },
    participants: {
      en: 'Visitor & Olivia Parker (Sydney Guide)',
      th: 'นักท่องเที่ยว และ โอลิเวีย พาร์กเกอร์',
    },
    learningObjective: {
      en: 'Sequence friendly small talk, shared travel details, and a natural farewell.',
      th: 'จัดลำดับการแนะนำตัว แลกเปลี่ยนข้อมูลท่องเที่ยว และกล่าวลาอย่างสุภาพ',
    },
    a2: {
      cards: [
        {
          id: 'f5_1',
          speakerRole: 'local',
          speakerName: { en: 'Olivia', th: 'โอลิเวีย' },
          roleFunction: 'opening',
          text: {
            en: "Hi! Welcome to Sydney. Where are you visiting from?",
            th: 'สวัสดีค่ะ! ยินดีต้อนรับสู่ซิดนีย์ คุณเดินทางมาจากที่ไหนคะ?',
          },
        },
        {
          id: 'f5_2',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'response',
          text: {
            en: "Thank you! I'm visiting from Thailand.",
            th: 'ขอบคุณครับ! ผมเดินทางมาจากประเทศไทยครับ',
          },
        },
        {
          id: 'f5_3',
          speakerRole: 'local',
          speakerName: { en: 'Olivia', th: 'โอลิเวีย' },
          roleFunction: 'follow_up',
          text: {
            en: 'Lovely! Have you tried the harbour market café yet?',
            th: 'น่ารักจังเลยค่ะ! ได้ลองแวะตลาดริมอ่าวและคาเฟ่หรือยังคะ?',
          },
        },
        {
          id: 'f5_4',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'response',
          text: {
            en: "Not yet, I'm heading there next!",
            th: 'ยังเลยครับ กำลังจะเดินไปที่นั่นต่อเลย!',
          },
        },
        {
          id: 'f5_5',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'closing',
          text: {
            en: 'Nice meeting you, Olivia. See you around!',
            th: 'ยินดีที่ได้รู้จักครับโอลิเวีย แล้วพบกันใหม่นะครับ!',
          },
        },
      ],
      acceptedSequences: [
        ['f5_1', 'f5_2', 'f5_3', 'f5_4', 'f5_5'],
        ['f5_1', 'f5_2', 'f5_5'],
      ],
      audioModel:
        "Hi! Welcome to Sydney. Where are you visiting from? Thank you! I'm visiting from Thailand. Lovely! Have you tried the harbour market café yet? Not yet, I'm heading there next! Nice meeting you, Olivia. See you around!",
    },
    b1: {
      cards: [
        {
          id: 'f5b_1',
          speakerRole: 'local',
          speakerName: { en: 'Olivia', th: 'โอลิเวีย' },
          roleFunction: 'opening',
          text: {
            en: "G'day! Are you enjoying your first morning around the harbour?",
            th: 'สวัสดีค่ะ! เช้าวันแรกรอบอ่าวซิดนีย์เป็นอย่างไรบ้างคะ?',
          },
        },
        {
          id: 'f5b_2',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'response',
          text: {
            en: "Yes, very much! I'm visiting from Thailand to explore the city.",
            th: 'สนุกมากครับ! ผมมาจากประเทศไทยเพื่อมาสำรวจเมืองนี้ครับ',
          },
        },
        {
          id: 'f5b_3',
          speakerRole: 'local',
          speakerName: { en: 'Olivia', th: 'โอลิเวีย' },
          roleFunction: 'follow_up',
          text: {
            en: "That's fantastic. Which stop is next on your route?",
            th: 'เยี่ยมเลยค่ะ จุดหมายต่อไปในเส้นทางของคุณคือที่ไหนคะ?',
          },
        },
        {
          id: 'f5b_4',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'response',
          text: {
            en: "I'm heading over to City Transit Station and then Darling Harbour.",
            th: 'ผมกำลังจะไปสถานีขนส่ง City Transit แล้วต่อด้วย Darling Harbour ครับ',
          },
        },
        {
          id: 'f5b_5',
          speakerRole: 'visitor',
          speakerName: { en: 'Visitor', th: 'นักท่องเที่ยว' },
          roleFunction: 'closing',
          text: {
            en: 'It was lovely chatting with you—enjoy the rest of your day!',
            th: 'ยินดีมากที่ได้คุยกันครับ ขอให้มีความสุขตลอดทั้งวันนะครับ!',
          },
        },
      ],
      acceptedSequences: [['f5b_1', 'f5b_2', 'f5b_3', 'f5b_4', 'f5b_5']],
      audioModel:
        "G'day! Are you enjoying your first morning around the harbour? Yes, very much! I'm visiting from Thailand to explore the city. That's fantastic. Which stop is next on your route? I'm heading over to City Transit Station and then Darling Harbour. It was lovely chatting with you—enjoy the rest of your day!",
    },
    hint: {
      en: 'Answer Olivia’s greeting first, then respond to her question about your next stop before saying goodbye.',
      th: 'ตอบคำทักทายของโอลิเวียก่อน จากนั้นค่อยตอบคำถามเรื่องจุดหมายถัดไป แล้วจึงกล่าวลา',
    },
    explanation: {
      en: 'Great conversations don’t only answer questions—they close warmly ("Nice meeting you!").',
      th: 'การสนทนาที่ดีไม่เพียงแค่ตอบคำถาม แต่ยังปิดบทสนทนาอย่างเป็นมิตรด้วย ("Nice meeting you!")',
    },
  },
];

export function validateSequenceOrder(
  challenge: SequenceBuilderChallenge,
  mode: AustraliaDifficultyMode,
  orderedCardIds: string[],
): { valid: boolean; reason: LocalizedText } {
  const bank = challenge[mode];
  if (orderedCardIds.length === 0) {
    return {
      valid: false,
      reason: {
        en: 'Place dialogue cards in your conversation strip before checking.',
        th: 'กรุณาวางบัตรบทสนทนาลงในช่องลำดับก่อนตรวจคำตอบ',
      },
    };
  }

  const isExactAccepted = bank.acceptedSequences.some(
    (seq) =>
      seq.length === orderedCardIds.length &&
      seq.every((id, idx) => orderedCardIds[idx] === id),
  );

  if (isExactAccepted) {
    return {
      valid: true,
      reason: challenge.explanation,
    };
  }

  const expectedPrimary = bank.acceptedSequences[0];
  if (orderedCardIds.length < Math.min(...bank.acceptedSequences.map((s) => s.length))) {
    return {
      valid: false,
      reason: {
        en: 'Your conversation feels incomplete—add the remaining turns so the exchange has a full ending.',
        th: 'บทสนทนายังไม่ครบทุกช่วง ลองเพิ่มการ์ดที่เหลือให้จบสมบูรณ์ดูนะ',
      },
    };
  }

  const firstId = orderedCardIds[0];
  if (firstId !== expectedPrimary[0]) {
    return {
      valid: false,
      reason: {
        en: 'Check your opening turn: start with the polite greeting before asking or answering.',
        th: 'ลองตรวจการ์ดใบแรก: ควรเริ่มต้นด้วยคำทักทายหรือเปิดบทสนทนาก่อนถามหรือตอบ',
      },
    };
  }

  const lastId = orderedCardIds[orderedCardIds.length - 1];
  if (lastId !== expectedPrimary[expectedPrimary.length - 1]) {
    return {
      valid: false,
      reason: {
        en: 'Your closing turn seems out of order—place the thank-you or farewell at the end.',
        th: 'ส่วนปิดท้ายยังสลับที่อยู่ ลองย้ายคำขอบคุณหรือคำลาไปไว้ท้ายสุดดูนะ',
      },
    };
  }

  return {
    valid: false,
    reason: {
      en: 'One middle turn is out of sequence—check how each answer directly replies to the speaker before it.',
      th: 'ลำดับช่วงกลางยังสลับกันเล็กน้อย ลองตรวจดูว่าคำตอบสอดคล้องกับคำถามก่อนหน้าหรือไม่',
    },
  };
}

// ---------------------------------------------------------------------------
// 2. Direction Dialogue Architect (City Transit Station — Noah)
// ---------------------------------------------------------------------------

export type DirectionFunctionTag =
  | 'asking_directions'
  | 'understanding_directions'
  | 'checking_understanding'
  | 'thanking_speaker';

export type DirectionRouteNodeId =
  | 'node_transit'
  | 'node_left_corner'
  | 'node_harbour_path'
  | 'node_ferry_quay'
  | 'node_gardens_gate';

export interface DirectionDialogueChallenge {
  id: string;
  scenario: LocalizedText;
  noahContext: LocalizedText;
  targetFunction: DirectionFunctionTag;
  targetRouteNodeId: DirectionRouteNodeId;
  activePathPoints: string;
  a2: {
    tileBank: string[];
    acceptedTileSets: string[][];
    starterHint: LocalizedText;
    audioModel: string;
  };
  b1: {
    tileBank: string[];
    acceptedTileSets: string[][];
    starterHint: LocalizedText;
    audioModel: string;
  };
  hint: LocalizedText;
  explanation: LocalizedText;
}

export const DIRECTION_FUNCTION_OPTIONS: {
  id: DirectionFunctionTag;
  label: LocalizedText;
}[] = [
  {
    id: 'asking_directions',
    label: { en: 'Asking for Directions', th: 'ถามทางอย่างสุภาพ' },
  },
  {
    id: 'understanding_directions',
    label: { en: 'Understanding Directions', th: 'สรุปเส้นทางที่เข้าใจ' },
  },
  {
    id: 'checking_understanding',
    label: { en: 'Checking Understanding', th: 'ถามทวนเพื่อยืนยัน' },
  },
  {
    id: 'thanking_speaker',
    label: { en: 'Thanking the Speaker', th: 'ขอบคุณผู้บอกทาง' },
  },
];

export const DIRECTION_ARCHITECT_CHALLENGES: DirectionDialogueChallenge[] = [
  {
    id: 'dir_arch_1_how_to_get',
    scenario: {
      en: 'You are outside City Transit Station and need Noah to explain the route to Circular Quay.',
      th: 'คุณอยู่ที่หน้าสถานี City Transit และต้องการถามทางไป Circular Quay จากโนอาห์',
    },
    noahContext: {
      en: 'Noah is ready at the ticket desk. Build your polite direction question and select the matching map destination.',
      th: 'โนอาห์พร้อมช่วยเหลือที่เคาน์เตอร์ ประกอบประโยคถามทางที่สุภาพและเลือกจุดหมายบนแผนที่',
    },
    targetFunction: 'asking_directions',
    targetRouteNodeId: 'node_ferry_quay',
    activePathPoints: '56,144 132,144 132,76 266,76',
    a2: {
      tileBank: ['Could', 'you', 'tell', 'me', 'how', 'to', 'get', 'there', '?', 'Please'],
      acceptedTileSets: [
        ['Could', 'you', 'tell', 'me', 'how', 'to', 'get', 'there', '?'],
        ['Please', 'Could', 'you', 'tell', 'me', 'how', 'to', 'get', 'there', '?'],
        ['Could', 'you', 'tell', 'me', 'how', 'to', 'get', 'there'],
      ],
      starterHint: {
        en: 'Start politely with: "Could you tell me..."',
        th: 'ขึ้นต้นอย่างสุภาพด้วย: "Could you tell me..."',
      },
      audioModel: 'Could you tell me how to get there?',
    },
    b1: {
      tileBank: [
        'Excuse me,',
        'could',
        'you',
        'tell',
        'me',
        'the',
        'quickest',
        'way',
        'to',
        'Circular Quay',
        '?',
        'how',
        'get',
      ],
      acceptedTileSets: [
        ['Excuse me,', 'could', 'you', 'tell', 'me', 'the', 'quickest', 'way', 'to', 'Circular Quay', '?'],
        ['could', 'you', 'tell', 'me', 'the', 'quickest', 'way', 'to', 'Circular Quay', '?'],
        ['Excuse me,', 'could', 'you', 'tell', 'me', 'how', 'to', 'get', 'to', 'Circular Quay', '?'],
        ['could', 'you', 'tell', 'me', 'how', 'to', 'get', 'to', 'Circular Quay', '?'],
      ],
      starterHint: {
        en: 'Combine an opening ("Excuse me,") with your indirect question.',
        th: 'ใช้คำทักทายนำ ("Excuse me,") ตามด้วยประโยคถามทางแบบสุภาพ',
      },
      audioModel: 'Excuse me, could you tell me the quickest way to Circular Quay?',
    },
    hint: {
      en: '"Could you tell me how to get..." uses normal statement word order ("how to get"), never "how do I gets".',
      th: 'โครงสร้าง "Could you tell me how to get..." ตามด้วยกริยารูปปกติ (how to get)',
    },
    explanation: {
      en: 'Polite indirect questions like "Could you tell me how to get there?" invite clear step-by-step directions.',
      th: 'คำถามอ้อมอย่าง "Could you tell me how to get there?" สุภาพและทำให้ผู้ตอบอธิบายทางเป็นขั้นตอนได้ชัดเจน',
    },
  },
  {
    id: 'dir_arch_2_confirm_left',
    scenario: {
      en: 'Noah says: "Walk past the clock tower, then turn left after the station." Repeat his turn to make sure.',
      th: 'โนอาห์บอกว่า "เดินผ่านหอนาฬิกาแล้วเลี้ยวซ้ายหลังสถานี" คุณอยากถามทวนให้มั่นใจว่าเข้าใจถูก',
    },
    noahContext: {
      en: 'Noah points to the corner beside City Transit Station. Build a route confirmation check!',
      th: 'โนอาห์ชี้ไปที่หัวมุมถัดจากสถานี ประกอบประโยคถามทวนความเข้าใจและแตะจุดเลี้ยวบนแผนที่',
    },
    targetFunction: 'checking_understanding',
    targetRouteNodeId: 'node_left_corner',
    activePathPoints: '56,144 132,144',
    a2: {
      tileBank: ['So', 'I', 'turn', 'left', 'after', 'the', 'station', ',', 'right', '?'],
      acceptedTileSets: [
        ['So', 'I', 'turn', 'left', 'after', 'the', 'station', ',', 'right', '?'],
        ['So', 'I', 'turn', 'left', 'after', 'the', 'station', '?'],
        ['I', 'turn', 'left', 'after', 'the', 'station', ',', 'right', '?'],
      ],
      starterHint: {
        en: 'Use "So I turn..." and end with ", right?" to check.',
        th: 'ขึ้นต้นด้วย "So I turn..." แล้วลงท้ายด้วย ", right?" เพื่อทวนความเข้าใจ',
      },
      audioModel: 'So I turn left after the station, right?',
    },
    b1: {
      tileBank: [
        'Just',
        'to',
        'make sure,',
        'I',
        'turn',
        'left',
        'right',
        'after',
        'the',
        'station',
        ',',
        'is that',
        'correct',
        '?',
      ],
      acceptedTileSets: [
        ['Just', 'to', 'make sure,', 'I', 'turn', 'left', 'right', 'after', 'the', 'station', ',', 'is that', 'correct', '?'],
        ['Just', 'to', 'make sure,', 'I', 'turn', 'left', 'after', 'the', 'station', ',', 'is that', 'correct', '?'],
        ['I', 'turn', 'left', 'after', 'the', 'station', ',', 'is that', 'correct', '?'],
      ],
      starterHint: {
        en: 'Open with "Just to make sure," then repeat the landmark turn.',
        th: 'เปิดประโยคด้วย "Just to make sure," ตามด้วยจุดเลี้ยวที่ต้องการยืนยัน',
      },
      audioModel: 'Just to make sure, I turn left right after the station, is that correct?',
    },
    hint: {
      en: 'Repeating back the turn ("turn left after the station") with ", right?" lets Noah confirm immediately.',
      th: 'การทวนคำสำคัญ ("turn left after the station") พร้อมลงท้ายด้วย ", right?" ช่วยให้โนอาห์ยืนยันได้ทันที',
    },
    explanation: {
      en: 'Checking understanding with "So I turn left..., right?" avoids walking in the wrong direction.',
      th: 'การถามย้ำด้วย "So I turn left..., right?" ช่วยป้องกันการเดินหลงทางได้ดีมาก',
    },
  },
  {
    id: 'dir_arch_3_summary_walk',
    scenario: {
      en: 'You now understand the whole path to the coastal Harbour Promenade. State the route clearly.',
      th: 'คุณเข้าใจเส้นทางไปยังทางเดินเลียบอ่าวแล้ว สรุปเส้นทางที่คุณเข้าใจให้โนอาห์ฟัง',
    },
    noahContext: {
      en: 'Noah smiles and listens as you summarize the straight path along the harbour path.',
      th: 'โนอาห์ยิ้มรอฟังคุณสรุปเส้นทางตรงเลียบอ่าวบนแผนที่',
    },
    targetFunction: 'understanding_directions',
    targetRouteNodeId: 'node_harbour_path',
    activePathPoints: '56,144 132,144 132,76 200,76',
    a2: {
      tileBank: ['I', 'walk', 'Walk', 'straight', 'along', 'the', 'harbour', 'path', '.'],
      acceptedTileSets: [
        ['I', 'walk', 'straight', 'along', 'the', 'harbour', 'path', '.'],
        ['Walk', 'straight', 'along', 'the', 'harbour', 'path', '.'],
      ],
      starterHint: {
        en: 'Begin with "I walk straight..."',
        th: 'เริ่มด้วย "I walk straight..."',
      },
      audioModel: 'I walk straight along the harbour path.',
    },
    b1: {
      tileBank: [
        'Got it,',
        'I',
        'follow',
        'the',
        'coastal',
        'harbour',
        'path',
        'straight',
        'ahead',
        '.',
        'after',
        'turning',
      ],
      acceptedTileSets: [
        ['Got it,', 'I', 'follow', 'the', 'coastal', 'harbour', 'path', 'straight', 'ahead', '.'],
        ['I', 'follow', 'the', 'coastal', 'harbour', 'path', 'straight', 'ahead', '.'],
        ['Got it,', 'I', 'follow', 'the', 'harbour', 'path', 'straight', 'ahead', '.'],
      ],
      starterHint: {
        en: 'Start with "Got it," and explain following the coastal path.',
        th: 'ขึ้นต้นด้วย "Got it," แล้วบอกว่าเดินตามทางเลียบอ่าวตรงไป',
      },
      audioModel: 'Got it, I follow the coastal harbour path straight ahead.',
    },
    hint: {
      en: 'Look at the central harbour bridge line on the map—going straight takes you toward the waterfront.',
      th: 'สังเกตแนวทางตรงริมอ่าวบนแผนที่ แล้วเรียงคำอธิบายการเดินตรงไปตามเส้นทางนั้น',
    },
    explanation: {
      en: 'Summarizing directions aloud ("I walk straight along...") confirms you remembered every landmark step.',
      th: 'การสรุปเส้นทางที่เข้าใจออกมาเป็นประโยคช่วยให้จำลำดับสถานที่สำคัญได้แม่นยำ',
    },
  },
  {
    id: 'dir_arch_4_platform_check',
    scenario: {
      en: 'You want to check if the coastal ferry and gardens entrance are near Wharf 4.',
      th: 'คุณอยากถามให้แน่ใจว่าทางเข้าสวน Harbour Gardens อยู่ใกล้ทางเดินริมอ่าวต่อจากท่าเรือหรือไม่',
    },
    noahContext: {
      en: 'Noah traces the path west toward Harbour Gardens Gate.',
      th: 'โนอาห์ชี้เส้นทางฝั่งตะวันตกไปยังทางเข้า Harbour Gardens',
    },
    targetFunction: 'asking_directions',
    targetRouteNodeId: 'node_gardens_gate',
    activePathPoints: '56,144 132,144 132,76 80,44',
    a2: {
      tileBank: ['Is', 'Harbour', 'Gardens', 'near', 'the', 'water', '?', 'How'],
      acceptedTileSets: [
        ['Is', 'Harbour', 'Gardens', 'near', 'the', 'water', '?'],
      ],
      starterHint: {
        en: 'Use a simple Yes/No question starting with "Is Harbour Gardens..."',
        th: 'เริ่มคำถามแบบ Yes/No ด้วย "Is Harbour Gardens..."',
      },
      audioModel: 'Is Harbour Gardens near the water?',
    },
    b1: {
      tileBank: [
        'Could',
        'you',
        'show',
        'me',
        'where',
        'Harbour Gardens',
        'is',
        'on',
        'the',
        'map',
        '?',
        'does',
      ],
      acceptedTileSets: [
        ['Could', 'you', 'show', 'me', 'where', 'Harbour Gardens', 'is', 'on', 'the', 'map', '?'],
        ['Could', 'you', 'show', 'me', 'where', 'Harbour Gardens', 'is', '?'],
      ],
      starterHint: {
        en: 'Notice statement order at the end: "...where Harbour Gardens is", not "where is Harbour Gardens".',
        th: 'สังเกตการเรียงคำหลัง where: ใช้ "...where Harbour Gardens is" ไม่สลับ is มาก่อน',
      },
      audioModel: 'Could you show me where Harbour Gardens is on the map?',
    },
    hint: {
      en: 'Pick the green Harbour Gardens gate on the northwest corner of the route diagram.',
      th: 'เลือกจุด Harbour Gardens สีเขียวมุมซ้ายบนของแผนที่เส้นทาง',
    },
    explanation: {
      en: 'Embedded questions ("where Harbour Gardens is") keep "is" after the noun for smooth, natural English.',
      th: 'ในประโยคคำถามซ้อน ("Could you show me where Harbour Gardens is?") ให้วาง is ไว้หลังชื่อสถานที่',
    },
  },
  {
    id: 'dir_arch_5_thank_noah',
    scenario: {
      en: 'Noah gave you clear directions back from City Transit Station. Thank him warmly and finish!',
      th: 'โนอาห์บอกทางจากสถานี City Transit ให้คุณชัดเจนแล้ว กล่าวขอบคุณและสรุปการสนทนาอย่างสุภาพ',
    },
    noahContext: {
      en: 'Noah tips his transit cap. Close your direction exchange politely!',
      th: 'โนอาห์ยิ้มรับ สร้างประโยคขอบคุณและเลือกจุดเริ่มต้นที่สถานี City Transit',
    },
    targetFunction: 'thanking_speaker',
    targetRouteNodeId: 'node_transit',
    activePathPoints: '56,144 132,144 266,76',
    a2: {
      tileBank: ['Thank', 'you', 'very', 'much', 'for', 'the', 'directions', '!', 'Where'],
      acceptedTileSets: [
        ['Thank', 'you', 'very', 'much', 'for', 'the', 'directions', '!'],
        ['Thank', 'you', 'for', 'the', 'directions', '!'],
      ],
      starterHint: {
        en: 'Start with "Thank you..."',
        th: 'ขึ้นต้นด้วย "Thank you..."',
      },
      audioModel: 'Thank you very much for the directions!',
    },
    b1: {
      tileBank: [
        'Thanks',
        'so',
        'much',
        'for',
        'explaining',
        'the',
        'route',
        'so',
        'clearly',
        '!',
        'helpful',
      ],
      acceptedTileSets: [
        ['Thanks', 'so', 'much', 'for', 'explaining', 'the', 'route', 'so', 'clearly', '!'],
        ['Thanks', 'for', 'explaining', 'the', 'route', 'so', 'clearly', '!'],
      ],
      starterHint: {
        en: 'After "for", use the -ing form: "for explaining..."',
        th: 'หลังคำว่า "for" ให้ตามด้วยกริยาเติม -ing ("for explaining...")',
      },
      audioModel: 'Thanks so much for explaining the route so clearly!',
    },
    hint: {
      en: 'This card is thanking Noah, so select "Thanking the Speaker" and the City Transit start pin.',
      th: 'ประโยคนี้เป็นการกล่าวขอบคุณ ให้เลือกหน้าที่ "ขอบคุณผู้บอกทาง" และหมุดจุดเริ่มต้น City Transit',
    },
    explanation: {
      en: 'Specific thanks ("for the directions" / "for explaining the route") shows genuine appreciation to local helpers.',
      th: 'การขอบคุณโดยระบุสิ่งที่ช่วย ("for the directions") ทำให้การสนทนาปิดท้ายได้อย่างอบอุ่นเป็นธรรมชาติ',
    },
  },
];

export function validateDirectionArchitect(
  challenge: DirectionDialogueChallenge,
  mode: AustraliaDifficultyMode,
  selectedTiles: string[],
  selectedFunction: DirectionFunctionTag | null,
  selectedNodeId: DirectionRouteNodeId | null,
): { valid: boolean; reason: LocalizedText } {
  const bank = challenge[mode];
  if (selectedTiles.length === 0) {
    return {
      valid: false,
      reason: {
        en: 'Build your direction sentence using the word tiles first.',
        th: 'กรุณาประกอบประโยคจากแผ่นคำก่อนตรวจคำตอบ',
      },
    };
  }
  const sentenceOk = isAcceptedTileSentence(selectedTiles, bank.acceptedTileSets);
  if (!sentenceOk) {
    return {
      valid: false,
      reason: {
        en: `Check your word order carefully. Hint: ${bank.starterHint.en}`,
        th: `ลองตรวจสอบลำดับคำในประโยคอีกครั้ง คำใบ้: ${bank.starterHint.th}`,
      },
    };
  }
  if (!selectedFunction) {
    return {
      valid: false,
      reason: {
        en: 'Your sentence looks great! Now select what this sentence is doing (Asking, Understanding, Checking, or Thanking).',
        th: 'ประโยคถูกต้องแล้ว! อย่าลืมเลือกหน้าที่ของประโยค (ถามทาง / สรุป / ถามทวน / ขอบคุณ) ด้วยนะ',
      },
    };
  }
  if (selectedFunction !== challenge.targetFunction) {
    return {
      valid: false,
      reason: {
        en: 'Good sentence! Check the communicative purpose button again—are you asking, confirming, summarizing, or thanking?',
        th: 'ประโยคถูกต้องแล้ว แต่ลองดูบทบาทของประโยคใหม่อีกครั้งว่าเป็นการถามทาง สรุปทาง ถามทวน หรือขอบคุณ',
      },
    };
  }
  if (!selectedNodeId) {
    return {
      valid: false,
      reason: {
        en: 'Tap the matching stop or corner on the Sydney Route Diagram to confirm the route!',
        th: 'แตะจุดหมายหรือทางแยกที่ตรงกันบนแผนที่เส้นทางจำลองด้วยนะ!',
      },
    };
  }
  if (selectedNodeId !== challenge.targetRouteNodeId) {
    return {
      valid: false,
      reason: {
        en: 'Your sentence and label are right, but tap the matching map pin highlighted by Noah’s route!',
        th: 'ประโยคและบทบาทถูกต้องแล้ว ลองเลือกหมุดจุดบนแผนที่ที่ตรงกับคำบอกทางอีกครั้งนะ',
      },
    };
  }
  return { valid: true, reason: challenge.explanation };
}

// ---------------------------------------------------------------------------
// 3. Café Conversation Kitchen (Harbour Market & Café — Mia)
// ---------------------------------------------------------------------------

export interface CafeBuildMenuItem {
  id: 'chicken_sandwich' | 'avocado_toast' | 'orange_juice' | 'flat_white' | 'banana_bread' | 'berry_smoothie';
  name: LocalizedText;
  priceText: string;
  tag: LocalizedText;
}

export const HARBOUR_CAFE_BUILD_MENU: CafeBuildMenuItem[] = [
  {
    id: 'chicken_sandwich',
    name: { en: 'Chicken Sandwich', th: 'แซนด์วิชไก่ย่าง' },
    priceText: '$8.00',
    tag: { en: 'Fresh · Optional no mayo', th: 'ทำสด · เลือกไม่ใส่มายองเนสได้' },
  },
  {
    id: 'avocado_toast',
    name: { en: 'Avocado Toast', th: 'ขนมปังอะโวคาโด' },
    priceText: '$7.50',
    tag: { en: 'Veggie · Wholegrain', th: 'มังสวิรัติ · ขนมปังโฮลเกรน' },
  },
  {
    id: 'orange_juice',
    name: { en: 'Orange Juice', th: 'น้ำส้มคั้นสด' },
    priceText: '$4.00',
    tag: { en: 'Chilled · No added sugar', th: 'เย็นสดชื่น · ไม่เติมน้ำตาล' },
  },
  {
    id: 'flat_white',
    name: { en: 'Warm Flat White', th: 'แฟลตไวท์อุ่น' },
    priceText: '$4.50',
    tag: { en: 'Milk or oat milk', th: 'เลือกนมพืช/นมโอ๊ตได้' },
  },
  {
    id: 'banana_bread',
    name: { en: 'Toasted Banana Bread', th: 'บานาน่าเบรดปิ้งอุ่น' },
    priceText: '$4.50',
    tag: { en: 'Warm · Contains walnuts', th: 'เสิร์ฟอุ่น · มีส่วนผสมวอลนัต' },
  },
  {
    id: 'berry_smoothie',
    name: { en: 'Harbour Berry Smoothie', th: 'สมูทตี้เบอร์รี่' },
    priceText: '$5.50',
    tag: { en: 'Dairy or dairy-free', th: 'เลือกแบบไม่ใส่นมวัวได้' },
  },
];

export interface CafeTurnOption {
  id: string;
  text: LocalizedText;
  isValid: boolean;
  trayItemToAdd?: CafeBuildMenuItem['id'];
  feedback: LocalizedText;
}

export interface CafeDialogueTurnSlot {
  slotId: string;
  stepLabel: LocalizedText;
  miaPrompt: LocalizedText;
  options: CafeTurnOption[];
}

export interface CafeKitchenChallenge {
  id: string;
  scenario: LocalizedText;
  learningObjective: LocalizedText;
  a2: {
    turns: CafeDialogueTurnSlot[];
  };
  b1: {
    turns: CafeDialogueTurnSlot[];
  };
  hint: LocalizedText;
  explanation: LocalizedText;
}

export const CAFE_KITCHEN_CHALLENGES: CafeKitchenChallenge[] = [
  {
    id: 'cafe_kit_1_sandwich_drink',
    scenario: {
      en: 'Build a complete 3-turn order for lunch at Mia’s Harbour Café.',
      th: 'สร้างบทสนทนาสั่งอาหารกลางวัน 3 จังหวะกับมีอาที่คาเฟ่ริมอ่าว',
    },
    learningObjective: {
      en: 'Greet and order food, answer a drink follow-up, and close the order politely.',
      th: 'สั่งอาหารอย่างสุภาพ ตอบคำถามเรื่องเครื่องดื่ม และปิดการสั่งอย่างเป็นมิตร',
    },
    a2: {
      turns: [
        {
          slotId: 't1',
          stepLabel: { en: 'Turn 1 · Order Food', th: 'จังหวะ 1 · สั่งอาหาร' },
          miaPrompt: {
            en: 'Mia: "Hi there! What would you like to order?"',
            th: 'มีอา: "สวัสดีค่ะ! วันนี้รับอะไรดีคะ?"',
          },
          options: [
            {
              id: 't1_a',
              text: {
                en: 'Could I have a chicken sandwich, please?',
                th: 'ขอแซนด์วิชไก่หนึ่งชิ้นครับ/ค่ะ',
              },
              isValid: true,
              trayItemToAdd: 'chicken_sandwich',
              feedback: {
                en: 'Warm and polite request!',
                th: 'สุภาพและชัดเจนมาก!',
              },
            },
            {
              id: 't1_b',
              text: {
                en: "Hi! I'd like a chicken sandwich, please.",
                th: 'สวัสดีครับ/ค่ะ ขอสั่งแซนด์วิชไก่หน่อยนะ',
              },
              isValid: true,
              trayItemToAdd: 'chicken_sandwich',
              feedback: {
                en: 'Greeting plus polite "I\'d like..." works wonderfully!',
                th: 'ทักทายพร้อมใช้ "I\'d like..." ได้เป็นธรรมชาติมาก!',
              },
            },
            {
              id: 't1_bad1',
              text: {
                en: 'Give me sandwich now.',
                th: 'เอาแซนด์วิชมาเดี๋ยวนี้',
              },
              isValid: false,
              feedback: {
                en: 'Too direct! Try softening with "Could I have..." or "please".',
                th: 'ห้วนเกินไป ลองใช้ "Could I have..." และเติม "please" เพื่อความสุภาพ',
              },
            },
            {
              id: 't1_bad2',
              text: {
                en: 'Where is the train?',
                th: 'รถไฟอยู่ที่ไหน?',
              },
              isValid: false,
              feedback: {
                en: 'Remember we are at the café counter—answer Mia’s order question!',
                th: 'ตอนนี้คุณอยู่ที่คาเฟ่ ลองเลือกประโยคสั่งอาหารให้ตรงกับคำถามของมีอา',
              },
            },
          ],
        },
        {
          slotId: 't2',
          stepLabel: { en: 'Turn 2 · Drink Follow-Up', th: 'จังหวะ 2 · ตอบเรื่องเครื่องดื่ม' },
          miaPrompt: {
            en: 'Mia: "Sure! Would you like a drink with that?"',
            th: 'มีอา: "ได้เลยค่ะ รับเครื่องดื่มคู่กันไหมคะ?"',
          },
          options: [
            {
              id: 't2_a',
              text: {
                en: "Yes, I'd like some orange juice.",
                th: 'รับครับ/ค่ะ ขอน้ำส้มหนึ่งแก้ว',
              },
              isValid: true,
              trayItemToAdd: 'orange_juice',
              feedback: {
                en: 'Clear, natural reply!',
                th: 'ตอบรับชัดเจนและสุภาพ!',
              },
            },
            {
              id: 't2_b',
              text: {
                en: 'Yes, please! Could I get an orange juice?',
                th: 'รับครับ/ค่ะ ขอน้ำส้มคั้นหนึ่งแก้วได้ไหมครับ/คะ?',
              },
              isValid: true,
              trayItemToAdd: 'orange_juice',
              feedback: {
                en: 'Adding "Yes, please!" sounds extra friendly.',
                th: 'การตอบ "Yes, please!" ฟังดูเป็นมิตรมาก',
              },
            },
            {
              id: 't2_bad1',
              text: {
                en: 'Sandwich is $8.',
                th: 'แซนด์วิชราคา 8 ดอลลาร์',
              },
              isValid: false,
              feedback: {
                en: 'Mia asked whether you want a drink—answer Yes or No politely.',
                th: 'มีอาถามว่าต้องการเครื่องดื่มเพิ่มไหม ลองตอบรับหรือปฏิเสธอย่างสุภาพดูนะ',
              },
            },
          ],
        },
        {
          slotId: 't3',
          stepLabel: { en: 'Turn 3 · Confirm & Close', th: 'จังหวะ 3 · ยืนยันและปิดบทสนทนา' },
          miaPrompt: {
            en: 'Mia: "One chicken sandwich and an orange juice. Anything else?"',
            th: 'มีอา: "แซนด์วิชไก่กับน้ำส้มนะคะ รับอะไรเพิ่มไหมคะ?"',
          },
          options: [
            {
              id: 't3_a',
              text: {
                en: "No, that's all. Thank you.",
                th: 'ไม่รับแล้วครับ/ค่ะ เท่านี้เลย ขอบคุณครับ/ค่ะ',
              },
              isValid: true,
              feedback: {
                en: 'Perfect café closing!',
                th: 'ปิดการสั่งอาหารได้อย่างสมบูรณ์แบบ!',
              },
            },
            {
              id: 't3_b',
              text: {
                en: "That's everything for now, thanks!",
                th: 'เท่านี้เรียบร้อยครับ/ค่ะ ขอบคุณมาก!',
              },
              isValid: true,
              feedback: {
                en: 'Natural and cheerful closing!',
                th: 'เป็นธรรมชาติและสุภาพมาก!',
              },
            },
            {
              id: 't3_bad1',
              text: {
                en: 'Wait forever.',
                th: 'รอไปเรื่อยๆ',
              },
              isValid: false,
              feedback: {
                en: 'Let Mia know you are finished ordering ("No, that\'s all. Thank you.").',
                th: 'บอกพนักงานให้ชัดเจนว่าสั่งครบแล้ว เช่น "No, that\'s all. Thank you."',
              },
            },
          ],
        },
      ],
    },
    b1: {
      turns: [
        {
          slotId: 't1b',
          stepLabel: { en: 'Turn 1 · Modify Order', th: 'จังหวะ 1 · สั่งและระบุรายละเอียด' },
          miaPrompt: {
            en: 'Mia: "Good morning! What can I get started for you today?"',
            th: 'มีอา: "สวัสดีตอนเช้าค่ะ! วันนี้รับเมนูไหนดีคะ?"',
          },
          options: [
            {
              id: 't1b_a',
              text: {
                en: 'Could I have the chicken sandwich without mayonnaise, please?',
                th: 'ขอแซนด์วิชไก่แบบไม่ใส่มายองเนสได้ไหมครับ/คะ?',
              },
              isValid: true,
              trayItemToAdd: 'chicken_sandwich',
              feedback: {
                en: 'Politely states both item and modification!',
                th: 'ระบุเมนูและคำขอปรับส่วนผสมอย่างสุภาพชัดเจน!',
              },
            },
            {
              id: 't1b_b',
              text: {
                en: "I'd love the chicken sandwich, and could I hold the mayo, please?",
                th: 'ขอรับแซนด์วิชไก่ และรบกวนงดมายองเนสด้วยนะครับ/คะ',
              },
              isValid: true,
              trayItemToAdd: 'chicken_sandwich',
              feedback: {
                en: 'Natural café phrasing for custom orders!',
                th: 'เป็นสำนวนสั่งอาหารที่ปรับส่วนผสมได้อย่างเป็นธรรมชาติ!',
              },
            },
            {
              id: 't1b_bad1',
              text: {
                en: 'No mayo sandwich make fast!',
                th: 'ทำแซนด์วิชไม่ใส่มายองเนสเร็วๆ!',
              },
              isValid: false,
              feedback: {
                en: 'Use polite modals like "Could I have..." and avoid commanding tone.',
                th: 'ควรใช้ประโยคขอร้องที่สุภาพอย่าง "Could I have..." แทนการสั่งตรงๆ',
              },
            },
          ],
        },
        {
          slotId: 't2b',
          stepLabel: { en: 'Turn 2 · Ask Ingredients & Pick Drink', th: 'จังหวะ 2 · ถามส่วนผสมและเลือกเครื่องดื่ม' },
          miaPrompt: {
            en: 'Mia: "No mayo—got it! Would you like to pair it with a smoothie or juice?"',
            th: 'มีอา: "ไม่ใส่มายองเนส ได้เลยค่ะ! รับคู่กับสมูทตี้หรือน้ำส้มดีคะ?"',
          },
          options: [
            {
              id: 't2b_a',
              text: {
                en: 'Does the berry smoothie contain milk? If I can get it dairy-free, yes please!',
                th: 'สมูทตี้เบอร์รี่มีส่วนผสมของนมไหมครับ? ถ้าทำแบบไม่ใส่นมได้ ขอแก้วนึงครับ!',
              },
              isValid: true,
              trayItemToAdd: 'berry_smoothie',
              feedback: {
                en: 'Excellent question about ingredients before ordering!',
                th: 'ถามเรื่องส่วนผสมก่อนสั่งได้อย่างยอดเยี่ยม!',
              },
            },
            {
              id: 't2b_b',
              text: {
                en: 'Could I have the fresh orange juice with no added sugar, please?',
                th: 'ขอน้ำส้มคั้นสดแบบไม่เติมน้ำตาลหนึ่งแก้วครับ/ค่ะ',
              },
              isValid: true,
              trayItemToAdd: 'orange_juice',
              feedback: {
                en: 'Clear, polite beverage choice with preference!',
                th: 'ระบุเครื่องดื่มและความต้องการได้อย่างสุภาพชัดเจน!',
              },
            },
            {
              id: 't2b_bad1',
              text: {
                en: 'It is sunny outside.',
                th: 'ข้างนอกแดดจ้าจัง',
              },
              isValid: false,
              feedback: {
                en: 'Stay on-topic with Mia’s question about drinks or ingredients.',
                th: 'ตอบให้ตรงประเด็นเรื่องเครื่องดื่มหรือส่วนผสมที่คุณต้องการสั่ง',
              },
            },
          ],
        },
        {
          slotId: 't3b',
          stepLabel: { en: 'Turn 3 · Confirm & Close', th: 'จังหวะ 3 · ยืนยันออเดอร์และขอบคุณ' },
          miaPrompt: {
            en: 'Mia: "No problem—made fresh to order! Your meal will be ready at table 3."',
            th: 'มีอา: "ไม่มีปัญหาค่ะ ทำให้ใหม่เลย! เดี๋ยวเสิร์ฟที่โต๊ะ 3 นะคะ"',
          },
          options: [
            {
              id: 't3b_a',
              text: {
                en: "Wonderful, thank you! I'll grab a seat at table 3.",
                th: 'เยี่ยมเลย ขอบคุณครับ/ค่ะ! เดี๋ยวไปนั่งรอที่โต๊ะ 3 นะครับ/คะ',
              },
              isValid: true,
              feedback: {
                en: 'Confirms table number and closes cheerfully!',
                th: 'ยืนยันหมายเลขโต๊ะและขอบคุณอย่างเป็นกันเอง!',
              },
            },
            {
              id: 't3b_b',
              text: {
                en: 'Thanks so much—sounds delicious!',
                th: 'ขอบคุณมากครับ/ค่ะ ฟังดูน่าทานมากเลย!',
              },
              isValid: true,
              feedback: {
                en: 'Warm appreciation!',
                th: 'คำขอบคุณอบอุ่นมาก!',
              },
            },
            {
              id: 't3b_bad1',
              text: {
                en: 'Give me table 10 instead.',
                th: 'เอาโต๊ะ 10 แทนเลย',
              },
              isValid: false,
              feedback: {
                en: 'A polite confirmation ("Thank you, I\'ll sit at table 3") keeps service friendly.',
                th: 'ตอบรับอย่างสุภาพและสอดคล้องกับที่พนักงานแจ้งจะทำให้การสื่อสารราบรื่น',
              },
            },
          ],
        },
      ],
    },
    hint: {
      en: 'Read each Mia speech prompt on the counter, check the menu board, and pick a polite reply that answers her directly.',
      th: 'อ่านคำถามของมีอาในแต่ละจังหวะ ตรวจดูกระดานเมนู แล้วเลือกคำตอบที่สุภาพและตรงคำถาม',
    },
    explanation: {
      en: 'In real café interactions, polite requests, ingredient checks, and a clear closing confirm the entire order smoothly.',
      th: 'ในการสั่งอาหารจริง การใช้คำขอที่สุภาพ ถามส่วนผสมเมื่อจำเป็น และกล่าวปิดท้ายช่วยให้ได้เมนูที่ถูกต้องและประทับใจ',
    },
  },
  {
    id: 'cafe_kit_2_snack_allergy',
    scenario: {
      en: 'Ask Mia about pastry ingredients and choose a warm café treat.',
      th: 'สอบถามส่วนผสมของขนมปิ้งและเลือกเมนูอุ่นๆ คู่เครื่องดื่ม',
    },
    learningObjective: {
      en: 'Ask about food ingredients and select an alternative item politely.',
      th: 'ถามเกี่ยวกับส่วนผสมอาหารและปรับเลือกเมนูที่เหมาะสมอย่างสุภาพ',
    },
    a2: {
      turns: [
        {
          slotId: 'c2_t1',
          stepLabel: { en: 'Turn 1 · Ask About Menu Item', th: 'จังหวะ 1 · ถามส่วนผสมเมนู' },
          miaPrompt: {
            en: 'Mia: "Our pastries just came out of the oven!"',
            th: 'มีอา: "ขนมอบเพิ่งออกจากเตาเลยค่ะ!"',
          },
          options: [
            {
              id: 'c2_t1_a',
              text: {
                en: 'Does the banana bread have nuts?',
                th: 'บานาน่าเบรดมีส่วนผสมของถั่วไหมครับ/คะ?',
              },
              isValid: true,
              feedback: {
                en: 'Great food safety question!',
                th: 'คำถามเรื่องส่วนผสมชัดเจนมาก!',
              },
            },
            {
              id: 'c2_t1_b',
              text: {
                en: 'Excuse me, are there nuts in the banana bread?',
                th: 'ขอโทษครับ/ค่ะ ในบานาน่าเบรดมีถั่วไหมครับ/คะ?',
              },
              isValid: true,
              feedback: {
                en: 'Adding "Excuse me" makes your question very polite!',
                th: 'เติม "Excuse me" ช่วยให้คำถามสุภาพขึ้นมาก!',
              },
            },
            {
              id: 'c2_t1_bad',
              text: {
                en: 'How old is the café?',
                th: 'คาเฟ่นี้เปิดมากี่ปีแล้ว?',
              },
              isValid: false,
              feedback: {
                en: 'Remember your goal is to check pastry ingredients before ordering.',
                th: 'เป้าหมายรอบนี้คือการถามส่วนผสมของขนมก่อนสั่งนะ',
              },
            },
          ],
        },
        {
          slotId: 'c2_t2',
          stepLabel: { en: 'Turn 2 · Choose Safe Alternative', th: 'จังหวะ 2 · เลือกเมนูแทน' },
          miaPrompt: {
            en: 'Mia: "Yes, it has walnuts—but our Avocado Toast is nut-free!"',
            th: 'มีอา: "มีวอลนัตค่ะ แต่ขนมปังอะโวคาโดของเราไม่มีถั่วนะคะ!"',
          },
          options: [
            {
              id: 'c2_t2_a',
              text: {
                en: 'Good to know! Could I have the avocado toast, please?',
                th: 'ขอบคุณที่บอกครับ/ค่ะ! งั้นขอขนมปังอะโวคาโดหนึ่งที่นะครับ/คะ',
              },
              isValid: true,
              trayItemToAdd: 'avocado_toast',
              feedback: {
                en: 'Polite transition to an alternative!',
                th: 'ตอบรับคำแนะนำและเลือกเมนูใหม่ได้สุภาพมาก!',
              },
            },
            {
              id: 'c2_t2_b',
              text: {
                en: "I'll take the avocado toast then, please.",
                th: 'งั้นขอเป็นขนมปังอะโวคาโดแทนแล้วกันครับ/ค่ะ',
              },
              isValid: true,
              trayItemToAdd: 'avocado_toast',
              feedback: {
                en: 'Natural and clear!',
                th: 'ชัดเจนและเป็นธรรมชาติ!',
              },
            },
            {
              id: 'c2_t2_bad',
              text: {
                en: 'Throw walnuts out!',
                th: 'เอาวอลนัตทิ้งไป!',
              },
              isValid: false,
              feedback: {
                en: 'Since walnuts are already baked inside, politely pick the nut-free option Mia suggested.',
                th: 'วอลนัตอบรวมในขนมไปแล้ว ควรตอบรับคำแนะนำและสั่งเมนูอื่นอย่างสุภาพ',
              },
            },
          ],
        },
        {
          slotId: 'c2_t3',
          stepLabel: { en: 'Turn 3 · Price & Thanks', th: 'จังหวะ 3 · ถามราคาและขอบคุณ' },
          miaPrompt: {
            en: 'Mia: "Coming right up! Anything else I can check?"',
            th: 'มีอา: "กำลังเตรียมให้เลยค่ะ มีอะไรให้ช่วยดูเพิ่มไหมคะ?"',
          },
          options: [
            {
              id: 'c2_t3_a',
              text: {
                en: 'How much is the total, please? Thank you!',
                th: 'ทั้งหมดราคาเท่าไรครับ/คะ? ขอบคุณครับ/ค่ะ!',
              },
              isValid: true,
              feedback: {
                en: 'Polite price check and warm thank-you!',
                th: 'ถามราคาและกล่าวขอบคุณอย่างสุภาพ!',
              },
            },
            {
              id: 'c2_t3_b',
              text: {
                en: "That's all for me—thank you for checking!",
                th: 'เท่านี้เลยครับ/ค่ะ ขอบคุณที่ช่วยเช็กส่วนผสมให้นะ!',
              },
              isValid: true,
              feedback: {
                en: 'Great appreciative closing!',
                th: 'คำขอบคุณที่ตรงสถานการณ์มาก!',
              },
            },
            {
              id: 'c2_t3_bad',
              text: {
                en: 'No English.',
                th: 'ไม่พูดภาษาอังกฤษ',
              },
              isValid: false,
              feedback: {
                en: 'Close politely with "Thank you" or a question about the price.',
                th: 'ปิดท้ายด้วยการถามราคาหรือกล่าวขอบคุณอย่างสุภาพ',
              },
            },
          ],
        },
      ],
    },
    b1: {
      turns: [
        {
          slotId: 'c2b_t1',
          stepLabel: { en: 'Turn 1 · Dietary Question', th: 'จังหวะ 1 · ถามข้อมูลอาการแพ้' },
          miaPrompt: {
            en: 'Mia: "Good afternoon! Feel free to ask about anything on our bakery board."',
            th: 'มีอา: "สวัสดีตอนบ่ายค่ะ สอบถามรายละเอียดขนมบนกระดานได้เลยนะคะ"',
          },
          options: [
            {
              id: 'c2b_t1_a',
              text: {
                en: "I'm avoiding tree nuts—does the banana bread contain any walnuts?",
                th: 'พอดีผมหลีกเลี่ยงถั่วเปลือกแข็งครับ บานาน่าเบรดมีวอลนัตผสมอยู่ไหมครับ?',
              },
              isValid: true,
              feedback: {
                en: 'Clear dietary context helps staff recommend safely!',
                th: 'อธิบายเหตุผลสั้นๆ ช่วยให้พนักงานแนะนำเมนูที่ปลอดภัยได้ทันที!',
              },
            },
            {
              id: 'c2b_t1_b',
              text: {
                en: 'Could you check whether the banana bread has nuts in it, please?',
                th: 'รบกวนช่วยดูให้หน่อยได้ไหมครับว่าบานาน่าเบรดมีถั่วผสมไหม?',
              },
              isValid: true,
              feedback: {
                en: 'Polite indirect check!',
                th: 'คำถามขอให้ตรวจสอบอย่างสุภาพ!',
              },
            },
            {
              id: 'c2b_t1_bad',
              text: {
                en: 'Give me five coffees.',
                th: 'เอากาแฟ 5 แก้ว',
              },
              isValid: false,
              feedback: {
                en: 'First ask about ingredients on the bakery board as planned!',
                th: 'ลองถามเรื่องส่วนผสมของขนมบนกระดานก่อนสั่งนะ',
              },
            },
          ],
        },
        {
          slotId: 'c2b_t2',
          stepLabel: { en: 'Turn 2 · Choose Meal & Coffee', th: 'จังหวะ 2 · เลือกอาหารและกาแฟ' },
          miaPrompt: {
            en: 'Mia: "Yes, it contains walnuts. Our Avocado Toast is nut-free, and we have oat milk for coffee too."',
            th: 'มีอา: "มีวอลนัตค่ะ แต่ขนมปังอะโวคาโดไม่มีถั่วนะคะ และกาแฟเรามีตัวเลือกนมโอ๊ตด้วยค่ะ"',
          },
          options: [
            {
              id: 'c2b_t2_a',
              text: {
                en: "Thanks for checking! Could I get the avocado toast and a flat white with oat milk, please?",
                th: 'ขอบคุณที่เช็กให้ครับ! ขอขนมปังอะโวคาโดกับแฟลตไวท์นมโอ๊ตอย่างละหนึ่งที่ครับ',
              },
              isValid: true,
              trayItemToAdd: 'avocado_toast',
              feedback: {
                en: 'Combines gratitude, food safety, and clear ordering!',
                th: 'รวมคำขอบคุณและการสั่งอาหารพร้อมตัวเลือกนมโอ๊ตได้ครบถ้วน!',
              },
            },
            {
              id: 'c2b_t2_b',
              text: {
                en: "Great—I'll have the avocado toast instead, please.",
                th: 'ดีเลยครับ งั้นผมรับเป็นขนมปังอะโวคาโดแทนนะครับ',
              },
              isValid: true,
              trayItemToAdd: 'avocado_toast',
              feedback: {
                en: 'Clear, polite switch!',
                th: 'เปลี่ยนเมนูอย่างชัดเจนและสุภาพ!',
              },
            },
            {
              id: 'c2b_t2_bad',
              text: {
                en: 'Banana bread please!',
                th: 'เอาบานาน่าเบรด!',
              },
              isValid: false,
              feedback: {
                en: 'Remember the banana bread has walnuts! Choose the safe option Mia offered.',
                th: 'บานาน่าเบรดมีวอลนัต ลองเลือกเมนูปลอดภัยที่มีอาแนะนำแทนนะ',
              },
            },
          ],
        },
        {
          slotId: 'c2b_t3',
          stepLabel: { en: 'Turn 3 · Confirm & Thank', th: 'จังหวะ 3 · ยืนยันยอดและขอบคุณ' },
          miaPrompt: {
            en: 'Mia: "Certainly! Would you like your receipt or a takeaway bag?"',
            th: 'มีอา: "ได้ค่ะ รับใบเสร็จหรือถุงกลับบ้านด้วยไหมคะ?"',
          },
          options: [
            {
              id: 'c2b_t3_a',
              text: {
                en: "Just the receipt, please—I'll eat here by the harbour. Thank you!",
                th: 'ขอแค่ใบเสร็จครับ เดี๋ยวทานที่นี่ริมอ่าว ขอบคุณครับ!',
              },
              isValid: true,
              feedback: {
                en: 'Answers clearly and closes warmly!',
                th: 'ตอบคำถามชัดเจนและปิดบทสนทนาอย่างเป็นมิตร!',
              },
            },
            {
              id: 'c2b_t3_b',
              text: {
                en: 'No bag needed, thank you very much!',
                th: 'ไม่ต้องใส่ถุงครับ ขอบคุณมากครับ!',
              },
              isValid: true,
              feedback: {
                en: 'Polite eco-friendly reply!',
                th: 'คำตอบสุภาพและชัดเจนมาก!',
              },
            },
            {
              id: 'c2b_t3_bad',
              text: {
                en: 'Yes, walnut.',
                th: 'ใช่ วอลนัต',
              },
              isValid: false,
              feedback: {
                en: 'Answer Mia’s question about the receipt or takeaway bag.',
                th: 'ตอบคำถามของมีอาเรื่องใบเสร็จหรือถุงกลับบ้านให้ตรงประเด็น',
              },
            },
          ],
        },
      ],
    },
    hint: {
      en: 'Notice how each turn connects: Question about nuts -> Safe alternative choice -> Final receipt/thanks.',
      th: 'ดูความเชื่อมโยงทีละขั้น: ถามเรื่องถั่ว -> เลือกเมนูปลอดภัยแทน -> ปิดท้ายเรื่องใบเสร็จและขอบคุณ',
    },
    explanation: {
      en: 'Asking about ingredients protects your needs without sounding awkward when paired with "thank you for checking."',
      th: 'การสอบถามส่วนผสมอย่างสุภาพช่วยให้ได้เมนูที่ปลอดภัยและสร้างบรรยากาศที่ดีกับผู้ขาย',
    },
  },
  {
    id: 'cafe_kit_3_oat_flat_white',
    scenario: {
      en: 'Order a warm Flat White coffee and respond to Mia’s milk and size follow-up.',
      th: 'สั่งกาแฟแฟลตไวท์อุ่นๆ พร้อมตอบคำถามเรื่องขนาดแก้วและประเภทนม',
    },
    learningObjective: {
      en: 'Respond accurately to barista follow-up questions about size and milk.',
      th: 'ตอบคำถามต่อเนื่องของบาริสต้าเรื่องขนาดแก้วและตัวเลือกนมได้อย่างถูกต้อง',
    },
    a2: {
      turns: [
        {
          slotId: 'c3_t1',
          stepLabel: { en: 'Turn 1 · Order Drink', th: 'จังหวะ 1 · สั่งเครื่องดื่ม' },
          miaPrompt: {
            en: 'Mia: "Ready when you are! What drink would you like?"',
            th: 'มีอา: "พร้อมสั่งแล้วบอกได้เลยค่ะ รับเครื่องดื่มอะไรดีคะ?"',
          },
          options: [
            {
              id: 'c3_t1_a',
              text: { en: 'Could I have a flat white, please?', th: 'ขอแฟลตไวท์หนึ่งแก้วครับ/ค่ะ' },
              isValid: true,
              trayItemToAdd: 'flat_white',
              feedback: { en: 'Classic Sydney café order!', th: 'สั่งกาแฟได้เป็นธรรมชาติมาก!' },
            },
            {
              id: 'c3_t1_b',
              text: { en: "I'd like a flat white, please.", th: 'รับแฟลตไวท์หนึ่งแก้วครับ/ค่ะ' },
              isValid: true,
              trayItemToAdd: 'flat_white',
              feedback: { en: 'Polite and natural!', th: 'สุภาพและถูกต้อง!' },
            },
            {
              id: 'c3_t1_bad',
              text: { en: 'Where is Darling Harbour?', th: 'Darling Harbour อยู่ไหน?', },
              isValid: false,
              feedback: { en: 'Order a drink from the café board!', th: 'เลือกประโยคสั่งเครื่องดื่มจากเมนูคาเฟ่นะ!' },
            },
          ],
        },
        {
          slotId: 'c3_t2',
          stepLabel: { en: 'Turn 2 · Size & Milk', th: 'จังหวะ 2 · เลือกขนาดและนม' },
          miaPrompt: {
            en: 'Mia: "Regular or large? And regular milk or oat milk?"',
            th: 'มีอา: "แก้วปกติหรือใหญ่คะ? แล้วรับนมวัวหรือนมโอ๊ตดีคะ?"',
          },
          options: [
            {
              id: 'c3_t2_a',
              text: { en: 'Regular with oat milk, please.', th: 'ขนาดปกติใส่นมโอ๊ตครับ/ค่ะ' },
              isValid: true,
              feedback: { en: 'Answers both questions in one tidy phrase!', th: 'ตอบครบทั้งขนาดและประเภทนมในประโยคเดียว!' },
            },
            {
              id: 'c3_t2_b',
              text: { en: 'Regular size with regular milk, thank you.', th: 'ขนาดปกติ นมธรรมดา ขอบคุณครับ/ค่ะ' },
              isValid: true,
              feedback: { en: 'Clear, complete, and polite!', th: 'ชัดเจน ครบถ้วน และสุภาพ!' },
            },
            {
              id: 'c3_t2_bad',
              text: { en: 'Yes.', th: 'ใช่' },
              isValid: false,
              feedback: {
                en: 'Mia gave choices (Regular/Large, Regular milk/Oat milk)—pick the option you want instead of saying "Yes".',
                th: 'มีอาให้เลือกหลายแบบ อย่าตอบแค่ "Yes" ให้ระบุขนาดและชนิดนมที่ต้องการ',
              },
            },
          ],
        },
        {
          slotId: 'c3_t3',
          stepLabel: { en: 'Turn 3 · Closing', th: 'จังหวะ 3 · ปิดท้าย' },
          miaPrompt: {
            en: 'Mia: "That’s $4.50. I’ll call your name when it’s ready!"',
            th: 'มีอา: "4.50 ดอลลาร์ค่ะ เดี๋ยวเรียกชื่อเมื่อเครื่องดื่มเสร็จนะคะ!"',
          },
          options: [
            {
              id: 'c3_t3_a',
              text: { en: 'Sounds good, thank you!', th: 'ได้เลย ขอบคุณครับ/ค่ะ!' },
              isValid: true,
              feedback: { en: 'Friendly and brief!', th: 'สุภาพและกระชับ!' },
            },
            {
              id: 'c3_t3_b',
              text: { en: "Thanks a lot, I'll wait by the window.", th: 'ขอบคุณมากครับ/ค่ะ เดี๋ยวรอแถวหน้าต่างนะ' },
              isValid: true,
              feedback: { en: 'Helpful and polite!', th: 'ชัดเจนและเป็นมิตร!' },
            },
            {
              id: 'c3_t3_bad',
              text: { en: 'No coffee!', th: 'ไม่เอากาแฟ!', },
              isValid: false,
              feedback: { en: 'Just thank Mia politely as your order goes through.',
                th: 'กล่าวขอบคุณมีอาอย่างสุภาพเพื่อจบการสั่งอาหาร',
              },
            },
          ],
        },
      ],
    },
    b1: {
      turns: [
        {
          slotId: 'c3b_t1',
          stepLabel: { en: 'Turn 1 · Drink + Question', th: 'จังหวะ 1 · สั่งและถามตัวเลือก' },
          miaPrompt: {
            en: 'Mia: "Hi! We’ve got fresh espresso beans this morning. What can I make you?"',
            th: 'มีอา: "สวัสดีค่ะ เช้านี้เมล็ดกาแฟคั่วสดใหม่เลย รับอะไรดีคะ?"',
          },
          options: [
            {
              id: 'c3b_t1_a',
              text: { en: 'Could I have a regular flat white, and do you offer oat milk?', th: 'ขอแฟลตไวท์ขนาดปกติครับ และที่ร้านมีนมโอ๊ตไหมครับ?' },
              isValid: true,
              trayItemToAdd: 'flat_white',
              feedback: { en: 'Natural combination of order + availability check!', th: 'รวมการสั่งและถามตัวเลือกนมได้อย่างเป็นธรรมชาติ!' },
            },
            {
              id: 'c3b_t1_b',
              text: { en: "I'd love a regular flat white with oat milk if you have it, please.", th: 'ขอแฟลตไวท์ขนาดปกติใส่นมโอ๊ตถ้ามีนะครับ/คะ' },
              isValid: true,
              trayItemToAdd: 'flat_white',
              feedback: { en: 'Very natural conditional politeness ("if you have it")!', th: 'ใช้ประโยคเงื่อนไขอย่างสุภาพได้ดีเยี่ยม ("if you have it")!' },
            },
            {
              id: 'c3b_t1_bad',
              text: { en: 'Coffee price why so?', th: 'ทำไมกาแฟราคาเท่านี้?', },
              isValid: false,
              feedback: { en: 'Form a complete, polite question to order your coffee.', th: 'ตั้งประโยคสั่งกาแฟให้สมบูรณ์และสุภาพนะ' },
            },
          ],
        },
        {
          slotId: 'c3b_t2',
          stepLabel: { en: 'Turn 2 · Stay or Takeaway', th: 'จังหวะ 2 · ทานที่ร้านหรือกลับบ้าน' },
          miaPrompt: {
            en: 'Mia: "Yes, we have oat milk! Will that be for here or to takeaway?"',
            th: 'มีอา: "มีนมโอ๊ตค่ะ! ทานที่นี่หรือใส่แก้วกลับบ้านคะ?"',
          },
          options: [
            {
              id: 'c3b_t2_a',
              text: { en: 'To takeaway, please—I am walking along the quay.', th: 'ใส่แก้วกลับบ้านครับ/ค่ะ พอดีกำลังจะเดินเล่นริมอ่าว' },
              isValid: true,
              feedback: { en: 'Clear answer with helpful context!', th: 'ตอบชัดเจนและเป็นธรรมชาติ!' },
            },
            {
              id: 'c3b_t2_b',
              text: { en: 'To have here, please—those sunny tables look lovely.', th: 'ทานที่นี่ครับ/ค่ะ โต๊ะริมน้ำน่านั่งมากเลย' },
              isValid: true,
              feedback: { en: 'Friendly small talk + clear choice!', th: 'บอกความต้องการชัดเจนพร้อมพูดคุยเป็นกันเอง!' },
            },
            {
              id: 'c3b_t2_bad',
              text: { en: 'Oat milk again.', th: 'นมโอ๊ตอีกแล้ว', },
              isValid: false,
              feedback: { en: 'Listen to the new question: "for here or takeaway?"', th: 'ฟังคำถามใหม่ว่า "ทานที่นี่หรือกลับบ้าน?" แล้วตอบให้ตรงประเด็น' },
            },
          ],
        },
        {
          slotId: 'c3b_t3',
          stepLabel: { en: 'Turn 3 · Confirm & Thank', th: 'จังหวะ 3 · ยืนยันและขอบคุณ' },
          miaPrompt: {
            en: 'Mia: "No worries! Wait right by the pastry counter and I’ll pass it over."',
            th: 'มีอา: "ได้เลยค่ะ รอตรงเคาน์เตอร์ขนมสักครู่นะคะ"',
          },
          options: [
            {
              id: 'c3b_t3_a',
              text: { en: 'Appreciate it—thank you so much!', th: 'ขอบคุณมากเลยครับ/ค่ะ!' },
              isValid: true,
              feedback: { en: 'Smooth, confident closing!', th: 'ปิดบทสนทนาได้อย่างมั่นใจ!' },
            },
            {
              id: 'c3b_t3_b',
              text: { en: "Sure thing, I'll wait right here. Thanks!", th: 'ได้เลย เดี๋ยวรอตรงนี้ครับ/ค่ะ ขอบคุณ!' },
              isValid: true,
              feedback: { en: 'Polite acknowledgment!', th: 'ตอบรับอย่างสุภาพ!' },
            },
            {
              id: 'c3b_t3_bad',
              text: { en: 'Where is pastry counter why?', th: 'เคาน์เตอร์ขนมอยู่ไหนทำไม?', },
              isValid: false,
              feedback: { en: 'Acknowledge Mia’s clear instruction and thank her.', th: 'ตอบรับคำแนะนำของมีอาและกล่าวขอบคุณอย่างสุภาพ' },
            },
          ],
        },
      ],
    },
    hint: {
      en: 'Avoid answering "Yes" to choice questions like "Regular or large?"—name the option you want.',
      th: 'หลีกเลี่ยงการตอบแค่ "Yes" เมื่อถูกถามให้เลือก ("Regular or large?") ให้ระบุตัวเลือกที่ต้องการเลย',
    },
    explanation: {
      en: 'Answering follow-up questions with clear specifics ("Regular with oat milk, please") keeps café service fast and friendly.',
      th: 'การตอบคำถามต่อเนื่องแบบระบุรายละเอียดชัดเจนช่วยให้สั่งอาหารได้อย่างรวดเร็วและเป็นมิตร',
    },
  },
  {
    id: 'cafe_kit_4_check_bill',
    scenario: {
      en: 'Check the price on the menu, confirm the order total, and pay politely.',
      th: 'เช็กราคาจากเมนู ยืนยันยอดรวม และชำระเงินอย่างสุภาพ',
    },
    learningObjective: {
      en: 'Check prices clearly, confirm what is in your order, and close politely.',
      th: 'ถามราคา ยืนยันรายการอาหารให้ตรงกัน และกล่าวขอบคุณเมื่อรับอาหาร',
    },
    a2: {
      turns: [
        {
          slotId: 'c4_t1',
          stepLabel: { en: 'Turn 1 · Ask Price', th: 'จังหวะ 1 · ถามราคา' },
          miaPrompt: {
            en: 'Mia: "Those berry smoothies are popular today!"',
            th: 'มีอา: "วันนี้สมูทตี้เบอร์รี่ขายดีมากเลยค่ะ!"',
          },
          options: [
            {
              id: 'c4_t1_a',
              text: { en: 'How much is a berry smoothie, please?', th: 'สมูทตี้เบอร์รี่แก้วละเท่าไรครับ/คะ?' },
              isValid: true,
              feedback: { en: 'Clear and polite price question!', th: 'ถามราคาได้อย่างสุภาพชัดเจน!' },
            },
            {
              id: 'c4_t1_b',
              text: { en: 'Excuse me, how much does the smoothie cost?', th: 'ขอโทษครับ/ค่ะ สมูทตี้ราคาเท่าไรครับ/คะ?' },
              isValid: true,
              feedback: { en: 'Both "How much is..." and "does ... cost" work cleanly!', th: 'ใช้ได้ทั้ง "How much is..." และ "does ... cost"!' },
            },
            {
              id: 'c4_t1_bad',
              text: { en: 'Money how?', th: 'เงินยังไง?', },
              isValid: false,
              feedback: { en: 'Use "How much is..." to ask the price politely.', th: 'ใช้โครงสร้าง "How much is..." เพื่อถามราคาอย่างสุภาพ' },
            },
          ],
        },
        {
          slotId: 'c4_t2',
          stepLabel: { en: 'Turn 2 · Order & Confirm', th: 'จังหวะ 2 · สั่งและยืนยัน' },
          miaPrompt: {
            en: 'Mia: "It’s $5.50. Would you like one?"',
            th: 'มีอา: "ราคา 5.50 ดอลลาร์ค่ะ รับสักแก้วไหมคะ?"',
          },
          options: [
            {
              id: 'c4_t2_a',
              text: { en: 'Yes, please! One berry smoothie.', th: 'รับครับ/ค่ะ! ขอสมูทตี้เบอร์รี่ 1 แก้ว' },
              isValid: true,
              trayItemToAdd: 'berry_smoothie',
              feedback: { en: 'Clear confirmation!', th: 'สั่งและยืนยันจำนวนชัดเจน!' },
            },
            {
              id: 'c4_t2_b',
              text: { en: "Yes, I'll have one berry smoothie, please.", th: 'รับครับ/ค่ะ ขอสมูทตี้เบอร์รี่หนึ่งแก้วครับ/ค่ะ' },
              isValid: true,
              trayItemToAdd: 'berry_smoothie',
              feedback: { en: 'Polite and natural!', th: 'สุภาพและเป็นธรรมชาติ!' },
            },
            {
              id: 'c4_t2_bad',
              text: { en: 'Is it $100?', th: 'ราคา 100 ดอลลาร์เหรอ?' },
              isValid: false,
              feedback: { en: 'Mia just told you $5.50—answer whether you would like one.', th: 'มีอาแจ้งราคา 5.50 ดอลลาร์แล้ว ตอบว่าต้องการสั่งหรือไม่' },
            },
          ],
        },
        {
          slotId: 'c4_t3',
          stepLabel: { en: 'Turn 3 · Card / Closing', th: 'จังหวะ 3 · ชำระเงินและขอบคุณ' },
          miaPrompt: {
            en: 'Mia: "Here’s your berry smoothie! Enjoy the harbour view."',
            th: 'มีอา: "สมูทตี้เบอร์รี่ได้แล้วค่ะ! เพลิดเพลินกับวิวอ่าวนะคะ"',
          },
          options: [
            {
              id: 'c4_t3_a',
              text: { en: 'Thank you very much! Looks delicious.', th: 'ขอบคุณมากครับ/ค่ะ! น่าทานมากเลย' },
              isValid: true,
              feedback: { en: 'Wonderful closing compliment!', th: 'คำชมพร้อมขอบคุณน่ารักมาก!' },
            },
            {
              id: 'c4_t3_b',
              text: { en: 'Thanks, Mia! Have a good day.', th: 'ขอบคุณครับ/ค่ะมีอา! ขอให้มีวันที่ดีนะ' },
              isValid: true,
              feedback: { en: 'Warm personal farewell!', th: 'กล่าวลารวมชื่ออย่างเป็นกันเอง!' },
            },
            {
              id: 'c4_t3_bad',
              text: { en: 'Turn left.', th: 'เลี้ยวซ้าย', },
              isValid: false,
              feedback: { en: 'Choose a polite thank-you for receiving your drink.', th: 'เลือกคำขอบคุณที่เหมาะสมเมื่อรับเครื่องดื่ม' },
            },
          ],
        },
      ],
    },
    b1: {
      turns: [
        {
          slotId: 'c4b_t1',
          stepLabel: { en: 'Turn 1 · Price & Deal Check', th: 'จังหวะ 1 · สอบถามราคาและโปรฯ' },
          miaPrompt: {
            en: 'Mia: "Afternoon! Everything at the counter is freshly prepared."',
            th: 'มีอา: "สวัสดีตอนบ่ายค่ะ ทุกเมนูหน้าเคาน์เตอร์ทำสดใหม่หมดเลยนะคะ"',
          },
          options: [
            {
              id: 'c4b_t1_a',
              text: { en: 'Could you tell me the price of the smoothie and chicken sandwich together?', th: 'ช่วยบอกราคาสมูทตี้กับแซนด์วิชไก่รวมกันให้หน่อยได้ไหมครับ?' },
              isValid: true,
              feedback: { en: 'Clear B1 combined inquiry!', th: 'รวมคำถามเรื่องราคาสองรายการอย่างสุภาพได้เยี่ยม!' },
            },
            {
              id: 'c4b_t1_b',
              text: { en: 'Excuse me, how much would a berry smoothie and sandwich come to?', th: 'ขอโทษครับ ถ้ารับสมูทตี้กับแซนด์วิชจะราคาเท่าไรครับ?' },
              isValid: true,
              feedback: { en: 'Natural "come to" phrasing for total cost!', th: 'ใช้สำนวน "come to" ถามยอดรวมได้เป็นธรรมชาติมาก!' },
            },
            {
              id: 'c4b_t1_bad',
              text: { en: 'Tell total!', th: 'บอกราคารวม!', },
              isValid: false,
              feedback: { en: 'Use full polite question frames like "Could you tell me..."', th: 'ใช้ประโยคคำถามสุภาพให้ครบ เช่น "Could you tell me..."' },
            },
          ],
        },
        {
          slotId: 'c4b_t2',
          stepLabel: { en: 'Turn 2 · Confirm Order & Payment', th: 'จังหวะ 2 · ยืนยันและวิธีชำระ' },
          miaPrompt: {
            en: 'Mia: "Together they’re $13.50. Would you like me to put that order in?"',
            th: 'มีอา: "รวมเป็น 13.50 ดอลลาร์ค่ะ ให้สั่งชุดนี้เลยไหมคะ?"',
          },
          options: [
            {
              id: 'c4b_t2_a',
              text: { en: 'Yes, please! One sandwich and one smoothie. Can I pay by card?', th: 'สั่งเลยครับ/ค่ะ! แซนด์วิช 1 และสมูทตี้ 1 จ่ายด้วยบัตรได้ไหมครับ/คะ?' },
              isValid: true,
              trayItemToAdd: 'berry_smoothie',
              feedback: { en: 'Confirms order AND checks payment smoothly!', th: 'ยืนยันออเดอร์พร้อมถามวิธีชำระเงินได้อย่างลื่นไหล!' },
            },
            {
              id: 'c4b_t2_b',
              text: { en: "That sounds great—yes please, I'd like both.", th: 'ดีเลยครับ/ค่ะ รับทั้งสองอย่างเลยครับ/ค่ะ' },
              isValid: true,
              trayItemToAdd: 'berry_smoothie',
              feedback: { en: 'Natural confirmation!', th: 'ยืนยันชัดเจนและสุภาพ!' },
            },
            {
              id: 'c4b_t2_bad',
              text: { en: 'Where is Wharf 4?', th: 'ท่าเรือ 4 อยู่ไหน?', },
              isValid: false,
              feedback: { en: 'Confirm your café order first before changing topic!', th: 'ยืนยันคำสั่งซื้อกับมีอาก่อนนะ!' },
            },
          ],
        },
        {
          slotId: 'c4b_t3',
          stepLabel: { en: 'Turn 3 · Wrap Up Warmly', th: 'จังหวะ 3 · ปิดบทสนทนา' },
          miaPrompt: {
            en: 'Mia: "Tap anytime! Here’s your order—enjoy the sunshine."',
            th: 'มีอา: "แตะบัตรได้เลยค่ะ! นี่คือออเดอร์ของคุณ—ขอให้สนุกกับแสงแดดนะคะ"',
          },
          options: [
            {
              id: 'c4b_t3_a',
              text: { en: 'Tapped—thanks so much for the lovely service!', th: 'แตะแล้วครับ—ขอบคุณมากสำหรับบริการที่น่ารักนะคะ!' },
              isValid: true,
              feedback: { en: 'Confirms payment and gives warm praise!', th: 'ยืนยันการแตะบัตรและชมเชยอย่างเป็นมิตร!' },
            },
            {
              id: 'c4b_t3_b',
              text: { en: 'Thank you very much! Enjoy the rest of your afternoon.', th: 'ขอบคุณมากครับ! ขอให้มีช่วงบ่ายที่สดใสนะครับ' },
              isValid: true,
              feedback: { en: 'Gracious closing!', th: 'คำลาสุภาพมาก!' },
            },
            {
              id: 'c4b_t3_bad',
              text: { en: 'Bad view.', th: 'วิวไม่ดี', },
              isValid: false,
              feedback: { en: 'Close politely with warm thanks.', th: 'เลือกคำขอบคุณที่สุภาพเพื่อปิดท้ายการสนทนา' },
            },
          ],
        },
      ],
    },
    hint: {
      en: 'Remember to look at the Fictional Menu prices ($5.50 smoothie, $8.00 sandwich) and respond naturally to each follow-up.',
      th: 'ดูราคาจำลองบนเมนู (สมูทตี้ $5.50, แซนด์วิช $8.00) และตอบรับคำถามของมีอาให้ครบทั้ง 3 ช่วง',
    },
    explanation: {
      en: 'Asking prices, confirming the order together, and asking about card payment are everyday café superpowers.',
      th: 'การถามราคา ยืนยันรายการรวม และสอบถามวิธีชำระเงินเป็นทักษะสำคัญในคาเฟ่จริง',
    },
  },
  {
    id: 'cafe_kit_5_mistake_fix',
    scenario: {
      en: 'Politely point out a tiny order mix-up ("warm tea vs iced juice") and solve it kindly.',
      th: 'แจ้งอย่างสุภาพเมื่อได้รับรายการคลาดเคลื่อนเล็กน้อยและแก้ไขอย่างเป็นมิตร',
    },
    learningObjective: {
      en: 'Handle a polite correction without sounding rude or angry.',
      th: 'ทักท้วงหรือขอแก้ไขรายการอย่างสุภาพและรักษาน้ำใจคู่สนทนา',
    },
    a2: {
      turns: [
        {
          slotId: 'c5_t1',
          stepLabel: { en: 'Turn 1 · Gentle Check', th: 'จังหวะ 1 · แจ้งอย่างสุภาพ' },
          miaPrompt: {
            en: 'Mia sets down a cup of coffee, but you asked for orange juice.',
            th: 'มีอานำกาแฟมาวาง แต่จริงๆ คุณสั่งน้ำส้มคั้นไว้',
          },
          options: [
            {
              id: 'c5_t1_a',
              text: { en: 'Excuse me, I actually ordered the orange juice.', th: 'ขอโทษครับ/ค่ะ พอดีผม/ฉันสั่งน้ำส้มคั้นไว้ครับ/ค่ะ' },
              isValid: true,
              trayItemToAdd: 'orange_juice',
              feedback: { en: 'Gentle and clear correction!', th: 'แจ้งแก้ไขอย่างนุ่มนวลและชัดเจน!' },
            },
            {
              id: 'c5_t1_b',
              text: { en: 'Sorry, could I check my drink? I asked for orange juice.', th: 'ขอโทษครับ/ค่ะ ช่วยดูเครื่องดื่มให้หน่อยได้ไหม พอดีขอเป็นน้ำส้มคั้นครับ/ค่ะ' },
              isValid: true,
              trayItemToAdd: 'orange_juice',
              feedback: { en: 'Very respectful phrasing!', th: 'ถ้อยคำให้เกียรติคู่สนทนามาก!' },
            },
            {
              id: 'c5_t1_bad',
              text: { en: 'Wrong! Fix this!', th: 'ผิด! แก้เดี๋ยวนี้!' },
              isValid: false,
              feedback: { en: 'Start gently with "Excuse me" or "Sorry" so everyone feels comfortable.', th: 'ควรเริ่มด้วย "Excuse me" หรือ "Sorry" อย่างสุภาพเพื่อไม่ให้ฟังดูตำหนิเกินไป' },
            },
          ],
        },
        {
          slotId: 'c5_t2',
          stepLabel: { en: 'Turn 2 · Accept Apology', th: 'จังหวะ 2 · ตอบรับคำขอโทษ' },
          miaPrompt: {
            en: 'Mia: "Oh, so sorry about that! Let me swap it for fresh orange juice right away."',
            th: 'มีอา: "โอ๊ะ ขอโทษด้วยนะคะ เดี๋ยวเปลี่ยนเป็นน้ำส้มคั้นสดให้ทันทีเลยค่ะ"',
          },
          options: [
            {
              id: 'c5_t2_a',
              text: { en: 'No problem at all—thank you!', th: 'ไม่เป็นไรเลยครับ/ค่ะ ขอบคุณมาก!' },
              isValid: true,
              feedback: { en: 'Gracious response!', th: 'ตอบรับอย่างใจเย็นและเป็นมิตร!' },
            },
            {
              id: 'c5_t2_b',
              text: { en: "That's totally fine, thanks for swapping it.", th: 'ไม่เป็นไรเลยครับ/ค่ะ ขอบคุณที่ช่วยเปลี่ยนให้นะ' },
              isValid: true,
              feedback: { en: 'Reassuring and polite!', th: 'ช่วยคลายความกังวลและสุภาพมาก!' },
            },
            {
              id: 'c5_t2_bad',
              text: { en: 'You are late!', th: 'คุณช้ามาก!' },
              isValid: false,
              feedback: { en: 'Mia is already fixing it happily—reply warmly with "No problem".', th: 'มีอารีบเปลี่ยนให้แล้ว ควรตอบกลับอย่างสุภาพว่า "No problem"' },
            },
          ],
        },
        {
          slotId: 'c5_t3',
          stepLabel: { en: 'Turn 3 · Final Closing', th: 'จังหวะ 3 · กล่าวขอบคุณ' },
          miaPrompt: {
            en: 'Mia: "Here you go—fresh orange juice! Thanks for letting me know."',
            th: 'มีอา: "ได้แล้วค่ะ น้ำส้มคั้นสด! ขอบคุณที่ช่วยบอกนะคะ"',
          },
          options: [
            {
              id: 'c5_t3_a',
              text: { en: 'Thank you! It looks refreshing.', th: 'ขอบคุณครับ/ค่ะ ดูสดชื่นมากเลย' },
              isValid: true,
              feedback: { en: 'Lovely ending!', th: 'จบการสนทนาได้น่ารักมาก!' },
            },
            {
              id: 'c5_t3_b',
              text: { en: "Thanks so much, Mia! See you next time.", th: 'ขอบคุณมากครับ/ค่ะมีอา! ไว้แวะมาใหม่นะ' },
              isValid: true,
              feedback: { en: 'Friendly closing!', th: 'ปิดท้ายอย่างเป็นกันเอง!' },
            },
            {
              id: 'c5_t3_bad',
              text: { en: 'Give coffee back!', th: 'เอากาแฟคืนมา!' },
              isValid: false,
              feedback: { en: 'Pick a cheerful closing thank-you!', th: 'เลือกคำขอบคุณปิดท้ายที่เหมาะสมนะ' },
            },
          ],
        },
      ],
    },
    b1: {
      turns: [
        {
          slotId: 'c5b_t1',
          stepLabel: { en: 'Turn 1 · Clarify Politely', th: 'จังหวะ 1 · ชี้แจงอย่างสุภาพ' },
          miaPrompt: {
            en: 'Mia accidentally hands you a chicken sandwich with mayo instead of Avocado Toast.',
            th: 'มีอาหยิบแซนด์วิชไก่ใส่มายองเนสให้แทนขนมปังอะโวคาโดที่คุณสั่งไว้',
          },
          options: [
            {
              id: 'c5b_t1_a',
              text: { en: 'Excuse me, I think there might be a small mix-up—I actually ordered the avocado toast.', th: 'ขอโทษครับ/ค่ะ เหมือนจะมีสลับออเดอร์เล็กน้อย—ผม/ฉันสั่งขนมปังอะโวคาโดไว้ครับ/ค่ะ' },
              isValid: true,
              trayItemToAdd: 'avocado_toast',
              feedback: { en: 'Super polite softening language ("I think there might be a small mix-up")!', th: 'ใช้ภาษาที่ช่วยถนอมน้ำใจได้ดีเยี่ยม ("I think there might be a small mix-up")!' },
            },
            {
              id: 'c5b_t1_b',
              text: { en: 'Sorry to trouble you, but could we swap this for the avocado toast I ordered?', th: 'ขอโทษที่รบกวนนะครับ/คะ ช่วยเปลี่ยนเป็นขนมปังอะโวคาโดที่สั่งไว้ได้ไหมครับ/คะ?' },
              isValid: true,
              trayItemToAdd: 'avocado_toast',
              feedback: { en: 'Polite, constructive, and clear!', th: 'สุภาพ สร้างสรรค์ และชัดเจน!' },
            },
            {
              id: 'c5b_t1_bad',
              text: { en: "Why didn't you listen to me?!", th: 'ทำไมไม่ฟังที่สั่งเลย?!' },
              isValid: false,
              feedback: { en: 'Soften corrections with "Excuse me" or "a small mix-up" to keep communication positive.', th: 'ควรพูดแก้ปัญหาอย่างใจเย็นด้วย "Excuse me" หรือ "a small mix-up"' },
            },
          ],
        },
        {
          slotId: 'c5b_t2',
          stepLabel: { en: 'Turn 2 · Keep Calm', th: 'จังหวะ 2 · ตอบรับอย่างเข้าใจ' },
          miaPrompt: {
            en: 'Mia: "My mistake! I grabbed the wrong tray—I’ll bring your fresh avocado toast in two minutes."',
            th: 'มีอา: "ขอโทษจริงๆ ค่ะ หยิบผิดถาด! เดี๋ยวยกขนมปังอะโวคาโดสดใหม่มาให้ในสองนาทีนะคะ"',
          },
          options: [
            {
              id: 'c5b_t2_a',
              text: { en: 'No worries at all—busy mornings happen! Thank you.', th: 'ไม่เป็นไรเลยครับ/ค่ะ ช่วงเช้ายุ่งๆ เกิดขึ้นได้ ขอบคุณครับ/ค่ะ' },
              isValid: true,
              feedback: { en: 'Empathy + gratitude = great communication!', th: 'มีความเข้าใจผู้อื่นและสุภาพมาก!' },
            },
            {
              id: 'c5b_t2_b',
              text: { en: "That's completely fine, take your time.", th: 'ไม่มีปัญหาเลยครับ/ค่ะ ทำตามสบายเลยนะ' },
              isValid: true,
              feedback: { en: 'Kind and natural Australian phrasing!', th: 'ถ้อยคำใจดีและเป็นธรรมชาติมาก!' },
            },
            {
              id: 'c5b_t2_bad',
              text: { en: 'Two minutes is awful!', th: 'สองนาทีแย่มาก!' },
              isValid: false,
              feedback: { en: 'Accept her quick fix graciously.', th: 'ตอบรับความช่วยเหลืออย่างมีไมตรีจิต' },
            },
          ],
        },
        {
          slotId: 'c5b_t3',
          stepLabel: { en: 'Turn 3 · Positive Closing', th: 'จังหวะ 3 · ปิดบทสนทนาด้วยรอยยิ้ม' },
          miaPrompt: {
            en: 'Mia: "Here’s your warm avocado toast—have a wonderful day around Sydney Harbour!"',
            th: 'มีอา: "ขนมปังอะโวคาโดอุ่นๆ ได้แล้วค่ะ—เที่ยวรอบอ่าวซิดนีย์ให้สนุกนะคะ!"',
          },
          options: [
            {
              id: 'c5b_t3_a',
              text: { en: 'Thank you so much for sorting that out quickly—have a great day!', th: 'ขอบคุณมากที่ช่วยจัดการให้อย่างรวดเร็ว—ขอให้มีวันที่ดีเช่นกันครับ/ค่ะ!' },
              isValid: true,
              feedback: { en: 'Confident, appreciative closing!', th: 'ปิดท้ายได้อย่างมั่นใจและสุภาพ!' },
            },
            {
              id: 'c5b_t3_b',
              text: { en: 'Thanks a heap, Mia! Appreciate your kindness.', th: 'ขอบคุณมากเลยครับ/ค่ะมีอา!' },
              isValid: true,
              feedback: { en: 'Warm local Australian warmth!', th: 'เป็นกันเองแบบชาวออสซี่!' },
            },
            {
              id: 'c5b_t3_bad',
              text: { en: 'Goodbye never.', th: 'ลาก่อนตลอดกาล', },
              isValid: false,
              feedback: { en: 'Pick a natural thank-you closing.', th: 'เลือกคำขอบคุณปิดท้ายที่เป็นธรรมชาติ' },
            },
          ],
        },
      ],
    },
    hint: {
      en: 'Notice how polite tone turns a mistake into a friendly interaction: "Excuse me, I think there might be a small mix-up..."',
      th: 'สังเกตการใช้คำนุ่มนวลเพื่อแก้ปัญหาโดยไม่เสียบรรยากาศ เช่น "Excuse me, I actually ordered..."',
    },
    explanation: {
      en: 'Handling small misunderstandings calmly with softeners ("Excuse me, I actually ordered...") is a vital real-world skill.',
      th: 'การแจ้งแก้ไขข้อผิดพลาดอย่างใจเย็นและสุภาพเป็นทักษะการสื่อสารจริงที่สำคัญมาก',
    },
  },
];

export function validateCafeMultiTurn(
  challenge: CafeKitchenChallenge,
  mode: AustraliaDifficultyMode,
  selectedOptionBySlot: Record<string, string>,
): { valid: boolean; invalidSlotId?: string; reason: LocalizedText } {
  const turns = challenge[mode].turns;
  for (const turn of turns) {
    const pickedId = selectedOptionBySlot[turn.slotId];
    if (!pickedId) {
      return {
        valid: false,
        invalidSlotId: turn.slotId,
        reason: {
          en: `Select a customer response for ${turn.stepLabel.en} before checking.`,
          th: `กรุณาเลือกคำตอบของลูกค้าสำหรับ "${turn.stepLabel.th}" ให้ครบทุกช่วงก่อนตรวจ`,
        },
      };
    }
    const chosen = turn.options.find((o) => o.id === pickedId);
    if (!chosen || !chosen.isValid) {
      return {
        valid: false,
        invalidSlotId: turn.slotId,
        reason: chosen?.feedback ?? {
          en: 'Check this café turn again to match Mia’s question politely.',
          th: 'ลองตรวจสอบคำตอบช่วงนี้อีกครั้งให้ตรงคำถามและสุภาพ',
        },
      };
    }
  }
  return { valid: true, reason: challenge.explanation };
}

// ---------------------------------------------------------------------------
// 4. Ticket & Information Builder (Darling Harbour Discovery Hub — Jack)
// ---------------------------------------------------------------------------

export interface DarlingHarbourBoardRow {
  tab: 'schedules' | 'tickets' | 'booking';
  itemTitle: LocalizedText;
  detailLine: LocalizedText;
  fictionalTag: LocalizedText;
}

export const DARLING_HARBOUR_BUILD_BOARD: DarlingHarbourBoardRow[] = [
  {
    tab: 'schedules',
    itemTitle: { en: 'Harbour Sail & Sky Cruise', th: 'ล่องเรือชมอ่าวซิดนีย์' },
    detailLine: {
      en: 'Tours start: 10:00 AM · 1:30 PM · 4:00 PM (75 mins)',
      th: 'รอบเรือออก: 10:00 น. · 13:30 น. · 16:00 น. (75 นาที)',
    },
    fictionalTag: { en: 'Fictional Sample Schedule', th: 'ตารางจำลองเพื่อการเรียนรู้' },
  },
  {
    tab: 'schedules',
    itemTitle: { en: 'Marine Discovery Pavilion', th: 'ศาลาสำรวจโลกใต้ทะเล' },
    detailLine: {
      en: 'Open daily 9:30 AM – 6:00 PM · Keeper talk at 2:00 PM',
      th: 'เปิดทุกวัน 9:30 – 18:00 น. · รอบบรรยายเวลา 14:00 น.',
    },
    fictionalTag: { en: 'Fictional Sample Schedule', th: 'ตารางจำลองเพื่อการเรียนรู้' },
  },
  {
    tab: 'tickets',
    itemTitle: { en: 'Student & Youth Pass', th: 'บัตรราคาพิเศษสำหรับนักเรียน' },
    detailLine: {
      en: 'Student Ticket: $14 (Adult: $22) · Show student ID at desk',
      th: 'บัตรนักเรียน: $14 (ผู้ใหญ่ $22) · แสดงบัตรนักเรียนที่เคาน์เตอร์',
    },
    fictionalTag: { en: 'Fictional Sample Pricing', th: 'ราคาจำลองเพื่อการเรียนรู้' },
  },
  {
    tab: 'tickets',
    itemTitle: { en: 'Afternoon Explorer Combo', th: 'บัตรรวมกิจกรรมช่วงบ่าย' },
    detailLine: {
      en: 'Includes Pavilion entry + Harbour Boat Ride ($20 Student)',
      th: 'รวมค่าเข้าศาลา + เรือชมอ่าว ($20 สำหรับนักเรียน)',
    },
    fictionalTag: { en: 'Fictional Sample Pricing', th: 'ราคาจำลองเพื่อการเรียนรู้' },
  },
  {
    tab: 'booking',
    itemTitle: { en: 'Booking & Recommendations', th: 'การจองล่วงหน้าและคำแนะนำ' },
    detailLine: {
      en: 'Booking recommended on weekends; weekday walk-ins welcome!',
      th: 'แนะนำจองล่วงหน้าช่วงเสาร์-อาทิตย์ วันธรรมดาซื้อหน้างานได้!',
    },
    fictionalTag: { en: 'Fictional Visitor Tip', th: 'คำแนะนำจำลอง' },
  },
  {
    tab: 'booking',
    itemTitle: { en: 'Family Afternoon Highlight', th: 'กิจกรรมแนะนำช่วงบ่าย' },
    detailLine: {
      en: 'Jack recommends the 4:00 PM Sunset Boat + Coastal Walk.',
      th: 'แจ็กแนะนำรอบเรือ 16:00 น. คู่กับการเดินชมวิวริมอ่าว',
    },
    fictionalTag: { en: 'Fictional Visitor Tip', th: 'คำแนะนำจำลอง' },
  },
];

export interface InfoGapFollowUpOption {
  id: string;
  text: LocalizedText;
  isValid: boolean;
}

export interface TicketInfoGapChallenge {
  id: string;
  focusTab: 'schedules' | 'tickets' | 'booking';
  informationGoal: LocalizedText;
  scenario: LocalizedText;
  jackAnswerPreview: LocalizedText;
  a2: {
    tileBank: string[];
    acceptedQuestionSets: string[][];
    starterHint: LocalizedText;
    audioModel: string;
  };
  b1: {
    tileBank: string[];
    acceptedQuestionSets: string[][];
    starterHint: LocalizedText;
    audioModel: string;
  };
  followUpOptions: InfoGapFollowUpOption[];
  hint: LocalizedText;
  explanation: LocalizedText;
}

export const TICKET_INFO_BUILDER_CHALLENGES: TicketInfoGapChallenge[] = [
  {
    id: 'ticket_gap_1_start_time',
    focusTab: 'schedules',
    informationGoal: {
      en: 'Goal: Find the starting time of the harbour tour.',
      th: 'เป้าหมาย: สอบถามเวลาเริ่มต้นของทัวร์ชมอ่าว',
    },
    scenario: {
      en: 'You see the Harbour Cruise poster at Darling Harbour, and want Jack to confirm when the tour starts.',
      th: 'คุณเห็นโปสเตอร์ทัวร์ชมอ่าวและอยากให้แจ็กยืนยันเวลาเริ่มออกเดินทาง',
    },
    jackAnswerPreview: {
      en: 'Jack: "Our next harbour tour starts at 1:30 PM from Pier 2!"',
      th: 'แจ็ก: "ทัวร์ชมอ่าวรอบถัดไปเริ่มเวลา 13:30 น. ที่ท่าเรือ 2 ครับ!"',
    },
    a2: {
      tileBank: ['What', 'time', 'does', 'the', 'tour', 'start', '?', 'When', 'Cost'],
      acceptedQuestionSets: [
        ['What', 'time', 'does', 'the', 'tour', 'start', '?'],
        ['When', 'does', 'the', 'tour', 'start', '?'],
      ],
      starterHint: {
        en: 'Ask directly using "What time does..." or "When does..."',
        th: 'ถามตรงจุดด้วย "What time does..." หรือ "When does..."',
      },
      audioModel: 'What time does the tour start?',
    },
    b1: {
      tileBank: [
        'Could',
        'you',
        'tell',
        'me',
        'what',
        'time',
        'the',
        'afternoon',
        'tour',
        'starts',
        '?',
        'and',
        'how',
      ],
      acceptedQuestionSets: [
        ['Could', 'you', 'tell', 'me', 'what', 'time', 'the', 'afternoon', 'tour', 'starts', '?'],
        ['Could', 'you', 'tell', 'me', 'what', 'time', 'the', 'tour', 'starts', '?'],
      ],
      starterHint: {
        en: 'Use polite indirect phrasing: "Could you tell me what time ... starts?"',
        th: 'ใช้คำถามแบบสุภาพ: "Could you tell me what time the afternoon tour starts?" (อย่าลืม -s หลัง tour)',
      },
      audioModel: 'Could you tell me what time the afternoon tour starts?',
    },
    followUpOptions: [
      {
        id: 'fu1_good',
        text: {
          en: '1:30 PM at Pier 2—how early should I arrive before boarding?',
          th: '13:30 น. ที่ท่าเรือ 2—ควรไปถึงก่อนเวลากี่นาทีครับ/คะ?',
        },
        isValid: true,
      },
      {
        id: 'fu1_bad1',
        text: {
          en: 'Wait, do you sell sandwiches here?',
          th: 'ที่นี่มีแซนด์วิชขายไหม?',
        },
        isValid: false,
      },
    ],
    hint: {
      en: 'Notice "the tour starts" matches singular subject "the tour" (with "does" in A2, and "-s" in B1 indirect question).',
      th: 'สังเกตรูปกริยา: ใช้ "does the tour start?" หรือในประโยคซ้อนใช้ "...what time the tour starts?"',
    },
    explanation: {
      en: 'Combining a clear schedule question with a boarding-time follow-up ensures you never miss a boat or activity.',
      th: 'การถามเวลาเริ่มควบคู่กับคำถามติดตามเรื่องเวลาขึ้นเรือช่วยให้ไม่พลาดกิจกรรม',
    },
  },
  {
    id: 'ticket_gap_2_student_cost',
    focusTab: 'tickets',
    informationGoal: {
      en: 'Goal: Ask about the price of a student ticket.',
      th: 'เป้าหมาย: สอบถามราคาบัตรเข้าชมสำหรับนักเรียน',
    },
    scenario: {
      en: 'You brought your student ID card and want to check the student pass cost with Jack.',
      th: 'คุณพกบัตรนักเรียนมาด้วย และต้องการถามแจ็กเกี่ยวกับราคาบัตรนักเรียน',
    },
    jackAnswerPreview: {
      en: 'Jack: "A student ticket is $14—just show your student card when paying!"',
      th: 'แจ็ก: "บัตรนักเรียนราคา $14 ครับ—แค่แสดงบัตรนักเรียนตอนชำระเงินได้เลย!"',
    },
    a2: {
      tileBank: ['How', 'much', 'does', 'a', 'student', 'ticket', 'cost', '?', 'is'],
      acceptedQuestionSets: [
        ['How', 'much', 'does', 'a', 'student', 'ticket', 'cost', '?'],
        ['How', 'much', 'is', 'a', 'student', 'ticket', '?'],
      ],
      starterHint: {
        en: 'Ask price with "How much does a student ticket cost?" or "How much is..."',
        th: 'ถามราคาด้วย "How much does a student ticket cost?" หรือ "How much is..."',
      },
      audioModel: 'How much does a student ticket cost?',
    },
    b1: {
      tileBank: [
        'Excuse me,',
        'how',
        'much',
        'is',
        'a',
        'student',
        'ticket',
        'with',
        'my',
        'school ID',
        '?',
        'does',
      ],
      acceptedQuestionSets: [
        ['Excuse me,', 'how', 'much', 'is', 'a', 'student', 'ticket', 'with', 'my', 'school ID', '?'],
        ['how', 'much', 'is', 'a', 'student', 'ticket', 'with', 'my', 'school ID', '?'],
        ['Excuse me,', 'how', 'much', 'is', 'a', 'student', 'ticket', '?'],
      ],
      starterHint: {
        en: 'Mention checking the student ticket with your school ID politely.',
        th: 'ระบุการถามราคาบัตรนักเรียนพร้อมบัตรประจำตัวนักเรียน',
      },
      audioModel: 'Excuse me, how much is a student ticket with my school ID?',
    },
    followUpOptions: [
      {
        id: 'fu2_good',
        text: {
          en: "That's $14 with student ID—does that include the keeper talk too?",
          th: 'ราคา $14 เมื่อใช้บัตรนักเรียน—ราคานี้รวมรอบบรรยายด้วยไหมครับ/คะ?',
        },
        isValid: true,
      },
      {
        id: 'fu2_bad1',
        text: {
          en: 'No thank you, I am a bus.',
          th: 'ไม่เป็นไร ผมเป็นรถบัส',
        },
        isValid: false,
      },
    ],
    hint: {
      en: 'Both "How much does a student ticket cost?" and "How much is a student ticket?" are natural, valid English.',
      th: 'ใช้ได้ทั้ง "How much does a student ticket cost?" และ "How much is a student ticket?"',
    },
    explanation: {
      en: 'Knowing both "How much is..." and "How much does... cost?" gives you flexible options for any ticket desk.',
      th: 'การรู้วิธีถามราคาได้หลายรูปแบบช่วยให้สื่อสารที่เคาน์เตอร์ขายตั๋วได้คล่องแคล่ว',
    },
  },
  {
    id: 'ticket_gap_3_booking',
    focusTab: 'booking',
    informationGoal: {
      en: 'Goal: Check whether advance booking is necessary.',
      th: 'เป้าหมาย: ตรวจสอบว่าจำเป็นต้องจองตั๋วล่วงหน้าหรือไม่',
    },
    scenario: {
      en: 'The harbour looks lively today—ask Jack if you need to reserve tickets ahead of time.',
      th: 'บรรยากาศริมอ่าววันนี้คึกคักมาก ลองถามแจ็กว่าต้องจองตั๋วล่วงหน้าไหม',
    },
    jackAnswerPreview: {
      en: 'Jack: "On weekdays you can walk right in, though weekend bookings help!"',
      th: 'แจ็ก: "วันธรรมดาเดินเข้ามาซื้อได้เลยครับ แต่เสาร์-อาทิตย์จองไว้ก่อนจะสะดวกกว่า!"',
    },
    a2: {
      tileBank: ['Do', 'I', 'need', 'to', 'book', 'in', 'advance', '?', 'Should'],
      acceptedQuestionSets: [
        ['Do', 'I', 'need', 'to', 'book', 'in', 'advance', '?'],
        ['Should', 'I', 'book', 'in', 'advance', '?'],
      ],
      starterHint: {
        en: 'Ask with "Do I need to book..." or "Should I book..."',
        th: 'ถามด้วย "Do I need to book in advance?" หรือ "Should I book in advance?"',
      },
      audioModel: 'Do I need to book in advance?',
    },
    b1: {
      tileBank: [
        'Is',
        'it',
        'necessary',
        'to',
        'book',
        'tickets',
        'in',
        'advance',
        'for',
        'this',
        'afternoon',
        '?',
      ],
      acceptedQuestionSets: [
        ['Is', 'it', 'necessary', 'to', 'book', 'tickets', 'in', 'advance', 'for', 'this', 'afternoon', '?'],
        ['Is', 'it', 'necessary', 'to', 'book', 'tickets', 'in', 'advance', '?'],
      ],
      starterHint: {
        en: 'Use the frame: "Is it necessary to book tickets..."',
        th: 'ใช้โครงสร้าง: "Is it necessary to book tickets in advance..."',
      },
      audioModel: 'Is it necessary to book tickets in advance for this afternoon?',
    },
    followUpOptions: [
      {
        id: 'fu3_good',
        text: {
          en: 'Great! Since it is a weekday, can I buy my ticket right here?',
          th: 'ดีเลย! วันนี้วันธรรมดา งั้นผม/ฉันซื้อบัตรตรงนี้ได้เลยใช่ไหมครับ/คะ?',
        },
        isValid: true,
      },
      {
        id: 'fu3_bad1',
        text: {
          en: 'I booked yesterday at noon forever.',
          th: 'ฉันจองเมื่อวานตอนเที่ยงตลอดไป',
        },
        isValid: false,
      },
    ],
    hint: {
      en: '"Book in advance" means reserve beforehand before arriving.',
      th: 'สำนวน "book in advance" แปลว่า จองล่วงหน้าก่อนมาถึง',
    },
    explanation: {
      en: 'Asking "Do I need to book in advance?" saves long waits and helps you plan your day.',
      th: 'การถามว่าต้องจองล่วงหน้าไหมช่วยประหยัดเวลารอและวางแผนเที่ยวได้แม่นยำขึ้น',
    },
  },
  {
    id: 'ticket_gap_4_recommend',
    focusTab: 'booking',
    informationGoal: {
      en: 'Goal: Ask Jack for a personalised activity recommendation.',
      th: 'เป้าหมาย: ขอคำแนะนำกิจกรรมที่น่าสนใจจากแจ็ก',
    },
    scenario: {
      en: 'You have two free hours at Darling Harbour and want Jack’s top suggestion.',
      th: 'คุณมีเวลาว่าง 2 ชั่วโมงที่ Darling Harbour และอยากให้แจ็กแนะนำกิจกรรมยอดนิยม',
    },
    jackAnswerPreview: {
      en: 'Jack: "I recommend the 4:00 PM sunset boat cruise followed by a coastal walk!"',
      th: 'แจ็ก: "ผมแนะนำล่องเรือชมพระอาทิตย์ตกรอบ 16:00 น. ต่อด้วยเดินเล่นริมอ่าวครับ!"',
    },
    a2: {
      tileBank: ['Which', 'activity', 'would', 'you', 'recommend', '?', 'What'],
      acceptedQuestionSets: [
        ['Which', 'activity', 'would', 'you', 'recommend', '?'],
        ['What', 'activity', 'would', 'you', 'recommend', '?'],
      ],
      starterHint: {
        en: 'Use "Which activity would you recommend?" or "What activity..."',
        th: 'ใช้ "Which activity would you recommend?" หรือ "What activity..."',
      },
      audioModel: 'Which activity would you recommend?',
    },
    b1: {
      tileBank: [
        'Which',
        'harbour',
        'activity',
        'would',
        'you',
        'recommend',
        'for',
        'a',
        'first-time',
        'visitor',
        '?',
      ],
      acceptedQuestionSets: [
        ['Which', 'harbour', 'activity', 'would', 'you', 'recommend', 'for', 'a', 'first-time', 'visitor', '?'],
        ['Which', 'activity', 'would', 'you', 'recommend', 'for', 'a', 'first-time', 'visitor', '?'],
      ],
      starterHint: {
        en: 'Ask specifically for a first-time visitor recommendation.',
        th: 'ถามขอคำแนะนำโดยระบุบริบทสำหรับผู้มาเยือนครั้งแรก',
      },
      audioModel: 'Which harbour activity would you recommend for a first-time visitor?',
    },
    followUpOptions: [
      {
        id: 'fu4_good',
        text: {
          en: 'Sunset cruise sounds amazing! Could I book a student pass for the 4:00 PM boat?',
          th: 'ล่องเรือตอนเย็นน่าสนใจมาก! ขอซื้อบัตรนักเรียนรอบ 16:00 น. ได้เลยไหมครับ/คะ?',
        },
        isValid: true,
      },
      {
        id: 'fu4_bad1',
        text: {
          en: 'No activities in Sydney please.',
          th: 'ไม่เอากิจกรรมในซิดนีย์',
        },
        isValid: false,
      },
    ],
    hint: {
      en: '"Would you recommend...?" is polite and invites personal advice rather than just a brochure list.',
      th: 'การใช้ "Would you recommend...?" สุภาพและทำให้ได้คำแนะนำที่เหมาะกับเราจริงๆ',
    },
    explanation: {
      en: 'Adding your context ("for a first-time visitor") helps locals give much better suggestions.',
      th: 'การบอกบริบทของเรา ("สำหรับคนที่มาครั้งแรก") ช่วยให้เจ้าถิ่นแนะนำกิจกรรมที่ถูกใจยิ่งขึ้น',
    },
  },
  {
    id: 'ticket_gap_5_combo_inclusions',
    focusTab: 'tickets',
    informationGoal: {
      en: 'Goal: Ask what the Afternoon Explorer Combo ticket includes.',
      th: 'เป้าหมาย: สอบถามสิทธิพิเศษและรายการที่รวมในบัตร Combo',
    },
    scenario: {
      en: 'Before buying the $20 Combo pass on the board, verify what attractions are included.',
      th: 'ก่อนซื้อบัตรรวม Afternoon Explorer Combo ($20) ถามให้ชัวร์ว่าเข้าชมอะไรได้บ้าง',
    },
    jackAnswerPreview: {
      en: 'Jack: "It includes Pavilion entry plus one harbour boat ride—great value!"',
      th: 'แจ็ก: "รวมค่าเข้าศาลาสำรวจและตั๋วเรือชมอ่าว 1 เที่ยวเลยครับ คุ้มมาก!"',
    },
    a2: {
      tileBank: ['What', 'does', 'the', 'combo', 'ticket', 'include', '?', 'is'],
      acceptedQuestionSets: [
        ['What', 'does', 'the', 'combo', 'ticket', 'include', '?'],
      ],
      starterHint: {
        en: 'Ask with "What does the combo ticket include?"',
        th: 'ถามด้วย "What does the combo ticket include?"',
      },
      audioModel: 'What does the combo ticket include?',
    },
    b1: {
      tileBank: [
        'Could',
        'you',
        'clarify',
        'whether',
        'the',
        'boat',
        'ride',
        'is',
        'included',
        'in',
        'the',
        'combo',
        'pass',
        '?',
      ],
      acceptedQuestionSets: [
        ['Could', 'you', 'clarify', 'whether', 'the', 'boat', 'ride', 'is', 'included', 'in', 'the', 'combo', 'pass', '?'],
        ['Could', 'you', 'clarify', 'whether', 'the', 'boat', 'ride', 'is', 'included', '?'],
      ],
      starterHint: {
        en: 'Use polite clarification: "Could you clarify whether..."',
        th: 'ใช้ประโยคขอคำชี้แจงอย่างสุภาพ: "Could you clarify whether..."',
      },
      audioModel: 'Could you clarify whether the boat ride is included in the combo pass?',
    },
    followUpOptions: [
      {
        id: 'fu5_good',
        text: {
          en: "Pavilion entry plus a boat ride—that's great value! I'll take one student combo, please.",
          th: 'รวมทั้งเข้าศาลาและนั่งเรือ—คุ้มมาก! ขอซื้อบัตร Combo นักเรียน 1 ใบครับ/ค่ะ',
        },
        isValid: true,
      },
      {
        id: 'fu5_bad1',
        text: {
          en: 'Does the boat walk on the street?',
          th: 'เรือเดินบนถนนได้ไหม?',
        },
        isValid: false,
      },
    ],
    hint: {
      en: 'Check the "Tickets & Discounts" tab on Jack’s information board to verify the fictional combo details.',
      th: 'ลองกดแท็บ "บัตรและส่วนลด" บนกระดานข้อมูลจำลองของแจ็กเพื่อตรวจสอบรายละเอียด',
    },
    explanation: {
      en: 'Checking what a combo ticket includes prevents misunderstandings at the gate.',
      th: 'การถามรายละเอียดสิ่งที่รวมอยู่ในแพ็กเกจก่อนซื้อช่วยป้องกันความเข้าใจคลาดเคลื่อน',
    },
  },
];

export function validateInfoGapBuilder(
  challenge: TicketInfoGapChallenge,
  mode: AustraliaDifficultyMode,
  selectedTiles: string[],
  selectedFollowUpId: string | null,
): { valid: boolean; reason: LocalizedText } {
  const bank = challenge[mode];
  if (selectedTiles.length === 0) {
    return {
      valid: false,
      reason: {
        en: 'Build the question for Jack from the word tiles before checking.',
        th: 'กรุณาประกอบคำถามให้แจ็กจากแผ่นคำก่อนตรวจ',
      },
    };
  }
  const questionOk = isAcceptedTileSentence(selectedTiles, bank.acceptedQuestionSets);
  if (!questionOk) {
    return {
      valid: false,
      reason: {
        en: `Check your question structure. Hint: ${bank.starterHint.en}`,
        th: `ลองตรวจโครงสร้างคำถามอีกครั้ง คำใบ้: ${bank.starterHint.th}`,
      },
    };
  }
  if (!selectedFollowUpId) {
    return {
      valid: false,
      reason: {
        en: 'Great question! Now read Jack’s board reply and select the matching follow-up response.',
        th: 'คำถามยอดเยี่ยม! อ่านคำตอบของแจ็กแล้วเลือกประโยคตอบกลับหรือถามต่อให้ครบด้วยนะ',
      },
    };
  }
  const followUp = challenge.followUpOptions.find((f) => f.id === selectedFollowUpId);
  if (!followUp || !followUp.isValid) {
    return {
      valid: false,
      reason: {
        en: 'Your question is accurate, but pick the realistic follow-up that responds directly to Jack’s answer.',
        th: 'คำถามหลักถูกต้องแล้ว แต่ลองเลือกประโยคติดตามที่ตอบรับคำพูดของแจ็กอย่างสมเหตุสมผล',
      },
    };
  }
  return { valid: true, reason: challenge.explanation };
}

// ---------------------------------------------------------------------------
// 5. Dialogue Rescue Workshop (Harbour Gardens Help Point — Olivia Help Tip)
// ---------------------------------------------------------------------------

export type CommunicationProblemId =
  | 'too_fast'
  | 'unclear_number'
  | 'unfamiliar_word'
  | 'confirm_summary'
  | 'two_similar_places';

export interface RescueProblemOption {
  id: CommunicationProblemId;
  label: LocalizedText;
}

export interface RescueFollowUpOption {
  id: string;
  text: LocalizedText;
  isValid: boolean;
}

export interface DialogueRescueChallenge {
  id: string;
  scenario: LocalizedText;
  brokenLine: LocalizedText;
  correctProblemId: CommunicationProblemId;
  problemChoices: RescueProblemOption[];
  a2: {
    tileBank: string[];
    acceptedRepairSets: string[][];
    starterHint: LocalizedText;
    audioModel: string;
  };
  b1: {
    tileBank: string[];
    acceptedRepairSets: string[][];
    starterHint: LocalizedText;
    audioModel: string;
  };
  oliviaClarificationReply: LocalizedText;
  followUpOptions: RescueFollowUpOption[];
  hint: LocalizedText;
  explanation: LocalizedText;
}

export const RESCUE_WORKSHOP_CHALLENGES: DialogueRescueChallenge[] = [
  {
    id: 'rescue_1_too_fast',
    scenario: {
      en: 'At the ferry pier, a staff member speaks very quickly through directions while a boat horn blows.',
      th: 'ที่ท่าเรือเฟอร์รี่ พนักงานพูดบอกทางเร็วมากขณะที่เสียงแตรเรือดังขึ้น',
    },
    brokenLine: {
      en: 'Staff: "Yeahjustheadpastthekioskdownthestepsaroundwharffive..."',
      th: 'พนักงาน: "Yeahjustheadpastthekioskdownthestepsaroundwharffive..."',
    },
    correctProblemId: 'too_fast',
    problemChoices: [
      { id: 'too_fast', label: { en: 'Speaker talked too fast to catch clearly', th: 'คู่สนทนาพูดเร็วเกินไปจนฟังไม่ทัน' } },
      { id: 'unclear_number', label: { en: 'Two numbers sounded identical', th: 'ตัวเลขสองตัวฟังคล้ายกัน' } },
      { id: 'unfamiliar_word', label: { en: 'Unknown slang vocabulary word', th: 'มีคำศัพท์ที่ไม่รู้จักความหมาย' } },
    ],
    a2: {
      tileBank: ['Sorry,', 'could', 'you', 'repeat', 'that', 'speak', 'more', ',', 'please', '?', 'slowly'],
      acceptedRepairSets: [
        ['Sorry,', 'could', 'you', 'repeat', 'that', ',', 'please', '?'],
        ['Sorry,', 'could', 'you', 'speak', 'more', 'slowly', ',', 'please', '?'],
        ['could', 'you', 'repeat', 'that', ',', 'please', '?'],
      ],
      starterHint: {
        en: 'Ask politely: "Sorry, could you repeat that, please?"',
        th: 'ขอให้พูดซ้ำอย่างสุภาพ: "Sorry, could you repeat that, please?"',
      },
      audioModel: 'Sorry, could you repeat that, please?',
    },
    b1: {
      tileBank: [
        'Excuse me,',
        'could',
        'you',
        'speak',
        'repeat',
        'that',
        'a little',
        'more',
        'slowly',
        ',',
        'please',
        '?',
        'fast',
      ],
      acceptedRepairSets: [
        ['Excuse me,', 'could', 'you', 'speak', 'a little', 'more', 'slowly', ',', 'please', '?'],
        ['could', 'you', 'speak', 'a little', 'more', 'slowly', ',', 'please', '?'],
        ['Excuse me,', 'could', 'you', 'repeat', 'that', 'a little', 'more', 'slowly', '?'],
      ],
      starterHint: {
        en: 'Soften your request with "a little more slowly, please?"',
        th: 'ใช้คำสุภาพว่า "Excuse me, could you speak a little more slowly, please?"',
      },
      audioModel: 'Excuse me, could you speak a little more slowly, please?',
    },
    oliviaClarificationReply: {
      en: 'Helper: "Of course! Walk past the kiosk, go down the steps, and Wharf 5 is on your right."',
      th: 'ผู้ช่วย: "ได้เลยครับ! เดินผ่านซุ้มข้อมูล ลงบันได แล้วท่าเรือ 5 จะอยู่ขวามือครับ"',
    },
    followUpOptions: [
      {
        id: 'r1_fu_good',
        text: {
          en: 'Thank you! Past the kiosk and down to Wharf 5—got it now.',
          th: 'ขอบคุณครับ/ค่ะ! ผ่านซุ้มข้อมูลแล้วลงไปที่ท่าเรือ 5—เข้าใจชัดเจนแล้ว!',
        },
        isValid: true,
      },
      {
        id: 'r1_fu_bad',
        text: {
          en: 'Speak faster next time!',
          th: 'คราวหน้าพูดให้เร็วกว่านี้นะ!',
        },
        isValid: false,
      },
    ],
    hint: {
      en: 'Step 1 identifies *why* communication broke down (too fast). Step 2 asks calmly for repetition/slower speech.',
      th: 'ขั้นที่ 1 ระบุปัญหา (พูดเร็วเกินไป) ขั้นที่ 2 สร้างประโยคขอให้พูดซ้ำหรือช้าลงอย่างสุภาพ',
    },
    explanation: {
      en: 'Asking someone to speak a little more slowly keeps confidence high without pretending to understand.',
      th: 'การขอให้ผู้พูดช่วยพูดช้าลงอย่างสุภาพดีกว่าการพยักหน้าทั้งที่ยังฟังไม่ชัด',
    },
  },
  {
    id: 'rescue_2_platform_number',
    scenario: {
      en: 'You heard a train platform number, but it sounded noisy—was it Platform 3 or 4?',
      th: 'คุณได้ยินหมายเลขชานชาลาไม่ถนัดในสถานีที่เสียงดัง ไม่แน่ใจว่าชานชาลา 3 หรือ 4',
    },
    brokenLine: {
      en: 'Announcer: "Your harbour loop train leaves from Platform... [train noise] ...soon!"',
      th: 'เสียงประกาศ: "รถไฟรอบอ่าวกำลังจะออกจากชานชาลา... [เสียงรถไฟดังแทรก] ...นี้ครับ"',
    },
    correctProblemId: 'unclear_number',
    problemChoices: [
      { id: 'unclear_number', label: { en: 'Key number (platform) was drowned out', th: 'ได้ยินตัวเลขชานชาลาไม่ชัดเจน' } },
      { id: 'unfamiliar_word', label: { en: 'Difficult technical word', th: 'คำศัพท์เฉพาะทางยากเกินไป' } },
      { id: 'two_similar_places', label: { en: 'Confused two different stations', th: 'สับสนระหว่างชื่อสถานีสองแห่ง' } },
    ],
    a2: {
      tileBank: ['Did', 'you', 'say', 'Platform', '3', 'or', '4', ',', 'please', '?', 'Please'],
      acceptedRepairSets: [
        ['Did', 'you', 'say', 'Platform', '3', 'or', '4', '?'],
        ['Did', 'you', 'say', 'Platform', '3', 'or', '4', ',', 'please', '?'],
      ],
      starterHint: {
        en: 'Ask specifically about the missed detail: "Did you say Platform..."',
        th: 'ถามเจาะจงส่วนที่ไม่แน่ใจด้วย "Did you say Platform 3 or 4?"',
      },
      audioModel: 'Did you say Platform 3 or 4?',
    },
    b1: {
      tileBank: [
        'Sorry,',
        'I',
        'missed',
        'the',
        'number',
        '—',
        'did',
        'you',
        'mean',
        'Platform',
        '3',
        'or',
        '4',
        '?',
      ],
      acceptedRepairSets: [
        ['Sorry,', 'I', 'missed', 'the', 'number', '—', 'did', 'you', 'mean', 'Platform', '3', 'or', '4', '?'],
        ['Sorry,', 'I', 'missed', 'the', 'number', 'did', 'you', 'mean', 'Platform', '3', 'or', '4', '?'],
        ['did', 'you', 'mean', 'Platform', '3', 'or', '4', '?'],
      ],
      starterHint: {
        en: 'Explain briefly ("Sorry, I missed the number") then ask cleanly.',
        th: 'เกริ่นสั้นๆ ("Sorry, I missed the number") แล้วถามยืนยันระหว่าง 3 หรือ 4',
      },
      audioModel: 'Sorry, I missed the number—did you mean Platform 3 or 4?',
    },
    oliviaClarificationReply: {
      en: 'Helper: "Platform 4! Take the escalator just behind the ticket barrier."',
      th: 'ผู้ช่วย: "ชานชาลา 4 ครับ! ขึ้นบันไดเลื่อนด้านหลังประตูตั๋วได้เลย"',
    },
    followUpOptions: [
      {
        id: 'r2_fu_good',
        text: {
          en: 'Platform 4, thank you so much for checking!',
          th: 'ชานชาลา 4 ขอบคุณมากที่ช่วยเช็กให้นะครับ/คะ!',
        },
        isValid: true,
      },
      {
        id: 'r2_fu_bad',
        text: {
          en: 'Platform 99 then.',
          th: 'งั้นชานชาลา 99 แล้วกัน',
        },
        isValid: false,
      },
    ],
    hint: {
      en: 'Checking two specific options ("3 or 4") helps the helper give you a crisp 1-second confirmation.',
      th: 'การถามย้ำตัวเลขที่สงสัย ("3 or 4") ช่วยให้คู่สนทนาตอบยืนยันได้ตรงจุดที่สุด',
    },
    explanation: {
      en: 'Pinpointing what you missed ("I missed the number—did you say 3 or 4?") is fast, clear, and natural.',
      th: 'การระบุจุดที่ฟังพลาด ("I missed the number") ช่วยให้การสื่อสารกลับมาตรงกันทันที',
    },
  },
  {
    id: 'rescue_3_unfamiliar_word',
    scenario: {
      en: 'A local says: "Take the boardwalk right past the jetty." You aren’t sure what "jetty" means.',
      th: 'ชาวเมืองพูดว่า "Take the boardwalk right past the jetty." แต่คุณไม่แน่ใจว่าคำว่า "jetty" หมายถึงอะไร',
    },
    brokenLine: {
      en: 'Local: "Just follow the boardwalk past the wooden jetty to the gardens!"',
      th: 'ชาวเมือง: "เดินตามทางไม้เลยบริเวณ wooden jetty ไปก็จะถึงสวนเลยค่ะ!"',
    },
    correctProblemId: 'unfamiliar_word',
    problemChoices: [
      { id: 'unfamiliar_word', label: { en: 'Unfamiliar English vocabulary word ("jetty")', th: 'ไม่คุ้นความหมายของคำว่า "jetty"' } },
      { id: 'too_fast', label: { en: 'Audio cut out completely', th: 'เสียงขาดหายไปทั้งหมด' } },
      { id: 'unclear_number', label: { en: 'Wrong ticket price quoted', th: 'แจ้งราคาบัตรผิด' } },
    ],
    a2: {
      tileBank: ['Excuse me,', 'what', 'does', '"jetty"', 'mean', '?', 'where'],
      acceptedRepairSets: [
        ['Excuse me,', 'what', 'does', '"jetty"', 'mean', '?'],
        ['what', 'does', '"jetty"', 'mean', '?'],
      ],
      starterHint: {
        en: 'Ask politely: "Excuse me, what does \'jetty\' mean?"',
        th: 'ถามความหมายด้วย: "Excuse me, what does \'jetty\' mean?"',
      },
      audioModel: 'Excuse me, what does jetty mean?',
    },
    b1: {
      tileBank: [
        'Sorry,',
        'could',
        'you',
        'explain',
        'what',
        'a',
        'jetty',
        'looks',
        'like',
        'means',
        '?',
        'mean',
      ],
      acceptedRepairSets: [
        ['Sorry,', 'could', 'you', 'explain', 'what', 'a', 'jetty', 'looks', 'like', '?'],
        ['could', 'you', 'explain', 'what', 'a', 'jetty', 'looks', 'like', '?'],
        ['Sorry,', 'could', 'you', 'explain', 'what', 'a', 'jetty', 'means', '?'],
      ],
      starterHint: {
        en: 'Ask politely what it looks like or means ("what a jetty looks like?").',
        th: 'ขอให้ช่วยอธิบายลักษณะหรือความหมายอย่างสุภาพ',
      },
      audioModel: 'Sorry, could you explain what a jetty looks like?',
    },
    oliviaClarificationReply: {
      en: 'Helper: "Oh, a jetty is that small wooden pier stretching over the water!"',
      th: 'ผู้ช่วย: "อ๋อ jetty ก็คือท่าเทียบเรือไม้เล็กๆ ที่ยื่นลงไปในน้ำนั่นเองครับ!"',
    },
    followUpOptions: [
      {
        id: 'r3_fu_good',
        text: {
          en: 'Ah, the wooden pier over the water! Thank you—I see it right ahead.',
          th: 'อ๋อ ท่าเรือไม้ที่ยื่นไปในน้ำ! ขอบคุณครับ/ค่ะ มองเห็นอยู่ข้างหน้าพอดีเลย',
        },
        isValid: true,
      },
      {
        id: 'r3_fu_bad',
        text: {
          en: 'I know every word in the dictionary.',
          th: 'ฉันรู้จักทุกคำในพจนานุกรม',
        },
        isValid: false,
      },
    ],
    hint: {
      en: 'Never hesitate to ask "What does ... mean?"—real travellers do this all the time.',
      th: 'อย่าลังเลที่จะถาม "What does ... mean?" ผู้เดินทางจริงทั่วโลกใช้วิธีนี้เพื่อเรียนคำศัพท์ใหม่เสมอ',
    },
    explanation: {
      en: 'Asking what an unfamiliar word means turns a tricky moment into helpful vocabulary learning.',
      th: 'การถามความหมายของคำที่ไม่รู้จักช่วยป้องกันการหลงทางและได้เรียนรู้คำศัพท์จริงเพิ่มเติม',
    },
  },
  {
    id: 'rescue_4_two_places',
    scenario: {
      en: 'Your friend mentions "the station" — could she mean City Transit Station or the Ferry Terminal?',
      th: 'คู่สนทนาพูดถึง "the station" แต่แถวนี้มีทั้งสถานีรถไฟและท่าเรือเฟอร์รี่ ต้องถามให้แน่ชัด',
    },
    brokenLine: {
      en: 'Guide: "Wait for our group by the station at three o’clock!"',
      th: 'ไกด์: "รอรวมกลุ่มกันตรงสถานีตอนบ่ายสามโมงนะคะ!"',
    },
    correctProblemId: 'two_similar_places',
    problemChoices: [
      { id: 'two_similar_places', label: { en: 'Could mean two different nearby locations', th: 'ชื่อเรียกอาจหมายถึงจุดนัดพบสองแห่งที่ต่างกัน' } },
      { id: 'too_fast', label: { en: 'Speaker whispered softly', th: 'คู่สนทนากระซิบเบาเกินไป' } },
      { id: 'unfamiliar_word', label: { en: 'Menu price was missing', th: 'ไม่มีราคาบนเมนู' } },
    ],
    a2: {
      tileBank: ['Do', 'you', 'mean', 'the', 'station', 'near', 'the', 'harbour', '?'],
      acceptedRepairSets: [
        ['Do', 'you', 'mean', 'the', 'station', 'near', 'the', 'harbour', '?'],
      ],
      starterHint: {
        en: 'Check meaning clearly: "Do you mean the station..."',
        th: 'เช็กสถานที่ชัดเจนด้วย: "Do you mean the station near the harbour?"',
      },
      audioModel: 'Do you mean the station near the harbour?',
    },
    b1: {
      tileBank: [
        'Just',
        'to',
        'be sure,',
        'do',
        'you',
        'mean',
        'City Transit Station',
        'or',
        'the',
        'ferry',
        'wharf',
        '?',
      ],
      acceptedRepairSets: [
        ['Just', 'to', 'be sure,', 'do', 'you', 'mean', 'City Transit Station', 'or', 'the', 'ferry', 'wharf', '?'],
        ['do', 'you', 'mean', 'City Transit Station', 'or', 'the', 'ferry', 'wharf', '?'],
      ],
      starterHint: {
        en: 'Contrast both nearby places using "do you mean X or Y?"',
        th: 'ถามเปรียบเทียบสองจุดหมายให้ชัดด้วย "do you mean City Transit Station or the ferry wharf?"',
      },
      audioModel: 'Just to be sure, do you mean City Transit Station or the ferry wharf?',
    },
    oliviaClarificationReply: {
      en: 'Guide: "Good catch! I meant City Transit Station by the big brass clock."',
      th: 'ไกด์: "ดีที่ถามย้ำค่ะ! หมายถึงสถานี City Transit ตรงนาฬิกาทองเหลืองใหญ่ค่ะ"',
    },
    followUpOptions: [
      {
        id: 'r4_fu_good',
        text: {
          en: "Glad I checked! I'll meet everyone at City Transit Station at 3:00.",
          th: 'ดีใจที่ถามย้ำครับ/ค่ะ! เจอกันที่สถานี City Transit ตอนบ่ายสามโมงนะครับ/คะ',
        },
        isValid: true,
      },
      {
        id: 'r4_fu_bad',
        text: {
          en: "I won't go to any station.",
          th: 'ฉันจะไม่ไปสถานีไหนทั้งนั้น',
        },
        isValid: false,
      },
    ],
    hint: {
      en: 'Clarifying between two places avoids waiting at the wrong spot!',
      th: 'การถามย้ำระหว่างสองสถานที่ช่วยป้องกันการไปรอผิดจุดนัดพบ',
    },
    explanation: {
      en: '"Do you mean X or Y?" is one of the smartest ways to resolve ambiguous meeting points.',
      th: 'ประโยค "Do you mean X or Y?" เป็นวิธีที่ฉลาดและสุภาพในการยืนยันจุดนัดพบที่อาจสับสน',
    },
  },
  {
    id: 'rescue_5_confirm_summary',
    scenario: {
      en: 'Olivia gave you three steps to return to your hotel. Paraphrase and confirm before walking off!',
      th: 'โอลิเวียบอกขั้นตอนกลับโรงแรม 3 ขั้น คุณอยากทวนสรุปทั้งหมดเพื่อเช็กว่าเข้าใจถูกต้อง',
    },
    brokenLine: {
      en: 'Olivia: "First cross the park, turn right at the fountain, then walk down Wharf Road!"',
      th: 'โอลิเวีย: "ข้ามสวนก่อน เลี้ยวขวาตรงน้ำพุ แล้วเดินลงไปตามถนน Wharf Road เลยค่ะ!"',
    },
    correctProblemId: 'confirm_summary',
    problemChoices: [
      { id: 'confirm_summary', label: { en: 'Multiple steps need a final summary check', th: 'มีหลายขั้นตอน ต้องทวนสรุปเพื่อยืนยันความถูกต้อง' } },
      { id: 'unfamiliar_word', label: { en: 'Word "park" was unknown', th: 'ไม่รู้จักคำว่า park' } },
      { id: 'unclear_number', label: { en: 'Missing bus fare amount', th: 'ไม่ทราบค่ารถบัส' } },
    ],
    a2: {
      tileBank: ['Let', 'me', 'check', 'if', 'I', 'understood', 'correctly', '.'],
      acceptedRepairSets: [
        ['Let', 'me', 'check', 'if', 'I', 'understood', 'correctly', '.'],
        ['Let', 'me', 'check', 'if', 'I', 'understood', '.'],
      ],
      starterHint: {
        en: 'Begin with "Let me check if..."',
        th: 'เริ่มด้วย "Let me check if I understood correctly."',
      },
      audioModel: 'Let me check if I understood correctly.',
    },
    b1: {
      tileBank: [
        'Let',
        'me',
        'double-check',
        ':',
        'through',
        'the park,',
        'right',
        'at',
        'the fountain,',
        'down',
        'Wharf Road',
        '?',
      ],
      acceptedRepairSets: [
        ['Let', 'me', 'double-check', ':', 'through', 'the park,', 'right', 'at', 'the fountain,', 'down', 'Wharf Road', '?'],
        ['Let', 'me', 'double-check', 'through', 'the park,', 'right', 'at', 'the fountain,', 'down', 'Wharf Road', '?'],
      ],
      starterHint: {
        en: 'Open with "Let me double-check" and trace the 3 steps in order.',
        th: 'เปิดด้วย "Let me double-check" แล้วไล่ลำดับ 3 ขั้นตอนตามจริง',
      },
      audioModel: 'Let me double-check: through the park, right at the fountain, down Wharf Road?',
    },
    oliviaClarificationReply: {
      en: 'Olivia: "Spot on! You remembered every turn cleanly. Safe walk back!"',
      th: 'โอลิเวีย: "เป๊ะเลยค่ะ! จำครบทุกทางเลี้ยวเลย เดินทางปลอดภัยนะคะ!"',
    },
    followUpOptions: [
      {
        id: 'r5_fu_good',
        text: {
          en: 'Awesome, thanks again for helping me feel confident exploring Sydney!',
          th: 'ยอดเยี่ยม ขอบคุณอีกครั้งที่ช่วยให้มั่นใจในการสำรวจซิดนีย์นะครับ/คะ!',
        },
        isValid: true,
      },
      {
        id: 'r5_fu_bad',
        text: {
          en: 'Wait, where is the airport airplane now?',
          th: 'เดี๋ยวก่อน เครื่องบินที่สนามบินอยู่ไหน?',
        },
        isValid: false,
      },
    ],
    hint: {
      en: 'Complete all 3 rescue phases: Identify Breakdown -> Assemble Repair Sentence -> Confirm Follow-Up.',
      th: 'ทำครบ 3 ขั้น: 1. ระบุปัญหา -> 2. สร้างประโยคแก้ไข/ทวน -> 3. เลือกคำตอบรับปิดท้าย',
    },
    explanation: {
      en: 'Double-checking multi-step directions with your own summary makes you an independent, confident communicator!',
      th: 'การสรุปทวนคำบอกทางหลายขั้นตอนด้วยคำพูดของเราเองทำให้สื่อสารได้อย่างมั่นใจและไม่หลงทาง',
    },
  },
];

export function validateRescueChallenge(
  challenge: DialogueRescueChallenge,
  mode: AustraliaDifficultyMode,
  selectedProblemId: CommunicationProblemId | null,
  selectedTiles: string[],
  selectedFollowUpId: string | null,
): { valid: boolean; reason: LocalizedText } {
  if (!selectedProblemId) {
    return {
      valid: false,
      reason: {
        en: 'Step 1: First identify what communication problem happened in this scene.',
        th: 'ขั้นที่ 1: เลือกสาเหตุของปัญหาการสื่อสารในสถานการณ์นี้ก่อน',
      },
    };
  }
  if (selectedProblemId !== challenge.correctProblemId) {
    return {
      valid: false,
      reason: {
        en: 'Look closely at what caused the confusion—was it speed, a missed number, an unfamiliar word, or needing confirmation?',
        th: 'ลองดูข้อความที่สื่อสารพลาดอีกครั้งว่าเกิดจากพูดเร็ว ตัวเลขไม่ชัด คำศัพท์ใหม่ หรือต้องทวนสถานที่/ขั้นตอน',
      },
    };
  }
  const bank = challenge[mode];
  if (selectedTiles.length === 0) {
    return {
      valid: false,
      reason: {
        en: 'Step 2: Construct your polite clarification or repair expression from the word tiles.',
        th: 'ขั้นที่ 2: ประกอบประโยคขอให้ช่วยอธิบายซ้ำหรือทวนความเข้าใจจากแผ่นคำ',
      },
    };
  }
  if (!isAcceptedTileSentence(selectedTiles, bank.acceptedRepairSets)) {
    return {
      valid: false,
      reason: {
        en: `Check your repair sentence order. Hint: ${bank.starterHint.en}`,
        th: `ลองตรวจลำดับคำในประโยคแก้ไขอีกครั้ง คำใบ้: ${bank.starterHint.th}`,
      },
    };
  }
  if (!selectedFollowUpId) {
    return {
      valid: false,
      reason: {
        en: 'Step 3: Pick a respectful follow-up reply to confirm you are back on track!',
        th: 'ขั้นที่ 3: เลือกประโยคตอบกลับหลังจากได้รับคำอธิบายเรียบร้อยแล้ว',
      },
    };
  }
  const followUp = challenge.followUpOptions.find((f) => f.id === selectedFollowUpId);
  if (!followUp || !followUp.isValid) {
    return {
      valid: false,
      reason: {
        en: 'Choose a helpful, polite follow-up that shows you understood the clarification.',
        th: 'เลือกคำตอบปิดท้ายที่สุภาพและแสดงว่าเข้าใจคำอธิบายแล้ว',
      },
    };
  }
  return { valid: true, reason: challenge.explanation };
}

export function buildBuildSandwichFeedback(
  isCorrect: boolean,
  detail: LocalizedText,
): LocalizedText {
  return buildSandwichFeedback(isCorrect, detail);
}

// ---------------------------------------------------------------------------
// Data Self-Validation Check (Used by Automated Tests)
// ---------------------------------------------------------------------------

export function validateAustraliaBuildBanks(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (AUSTRALIA_BUILD_MISSIONS.length !== 5) {
    errors.push('Expected exactly 5 Australia BUILD missions.');
  }

  const missionIds = new Set(AUSTRALIA_BUILD_MISSIONS.map((m) => m.missionId));
  if (missionIds.size !== 5) errors.push('BUILD missionIds must be unique.');

  const landmarkIds = new Set(AUSTRALIA_BUILD_MISSIONS.map((m) => m.landmarkId));
  if (landmarkIds.size !== 5) errors.push('BUILD landmarkIds must be unique.');

  for (const ch of CONVERSATION_FORGE_CHALLENGES) {
    for (const lvl of ['a2', 'b1'] as const) {
      const cardIds = new Set(ch[lvl].cards.map((c) => c.id));
      if (ch[lvl].acceptedSequences.length === 0) {
        errors.push(`Forge challenge ${ch.id}.${lvl} missing acceptedSequences`);
      }
      for (const seq of ch[lvl].acceptedSequences) {
        for (const id of seq) {
          if (!cardIds.has(id)) {
            errors.push(`Forge ${ch.id}.${lvl} sequence references missing card ${id}`);
          }
        }
      }
    }
  }

  for (const ch of DIRECTION_ARCHITECT_CHALLENGES) {
    for (const lvl of ['a2', 'b1'] as const) {
      const bankSet = new Set(ch[lvl].tileBank);
      for (const seq of ch[lvl].acceptedTileSets) {
        for (const tile of seq) {
          if (!bankSet.has(tile)) {
            errors.push(`Direction ${ch.id}.${lvl} missing tile "${tile}" in tileBank`);
          }
        }
      }
    }
  }

  for (const ch of CAFE_KITCHEN_CHALLENGES) {
    for (const lvl of ['a2', 'b1'] as const) {
      if (ch[lvl].turns.length < 3) {
        errors.push(`Cafe ${ch.id}.${lvl} should have 3 turns`);
      }
      for (const t of ch[lvl].turns) {
        if (t.options.filter((o) => o.isValid).length < 2) {
          errors.push(`Cafe ${ch.id}.${lvl}.${t.slotId} needs >= 2 valid responses`);
        }
      }
    }
  }

  for (const ch of TICKET_INFO_BUILDER_CHALLENGES) {
    for (const lvl of ['a2', 'b1'] as const) {
      const bankSet = new Set(ch[lvl].tileBank);
      for (const seq of ch[lvl].acceptedQuestionSets) {
        for (const tile of seq) {
          if (!bankSet.has(tile)) {
            errors.push(`Ticket ${ch.id}.${lvl} missing tile "${tile}" in tileBank`);
          }
        }
      }
    }
    if (!ch.followUpOptions.some((f) => f.isValid)) {
      errors.push(`Ticket ${ch.id} needs a valid followUpOption`);
    }
  }

  for (const ch of RESCUE_WORKSHOP_CHALLENGES) {
    if (!ch.problemChoices.some((p) => p.id === ch.correctProblemId)) {
      errors.push(`Rescue ${ch.id} missing correctProblemId in problemChoices`);
    }
    for (const lvl of ['a2', 'b1'] as const) {
      const bankSet = new Set(ch[lvl].tileBank);
      for (const seq of ch[lvl].acceptedRepairSets) {
        for (const tile of seq) {
          if (!bankSet.has(tile)) {
            errors.push(`Rescue ${ch.id}.${lvl} missing tile "${tile}" in tileBank`);
          }
        }
      }
    }
    if (!ch.followUpOptions.some((f) => f.isValid)) {
      errors.push(`Rescue ${ch.id} needs a valid followUpOption`);
    }
  }

  return { valid: errors.length === 0, errors };
}
