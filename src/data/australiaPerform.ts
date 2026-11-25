import type {
  AustraliaPerformChallengeRecord,
  AustraliaPerformPracticeMode,
  AustraliaPerformReflectionState,
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
import type { AustraliaContextPropId } from '../components/australia/AustraliaPerformArtwork';

export const AUSTRALIA_PERFORM_ACTIVITY_ID = AUSTRALIA_STAGE_ACTIVITY_IDS.perform;
export const AUSTRALIA_PERFORM_XP_REWARD = 100;
export const TOTAL_AUSTRALIA_MISSION_XP = 250;

export const AUSTRALIA_PERFORM_CHALLENGE_ORDER: readonly AustraliaLandmarkId[] =
  AUSTRALIA_RECOMMENDED_ROUTE;

export const AUSTRALIA_OLIVIA_PERFORM_WELCOME: LocalizedText = {
  en: 'Welcome to the Final Sydney CityTalk Challenge! Across five real stops in our harbour city, speak independently with me, Noah, Mia, and Jack—greeting people, asking for directions, ordering at the café, checking schedules, and solving a travel mix-up. Finish all five challenges and your final reflection to earn the Sydney Passport Stamp and become The Sydney Communication Ambassador!',
  th: 'ยินดีต้อนรับสู่ภารกิจสุดท้าย Final Sydney CityTalk Challenge! ตลอด 5 จุดทั่วอ่าวซิดนีย์ คุณจะได้สนทนาอย่างอิสระกับฉัน โนอาห์ มีอา และแจ็ค ทั้งการทักทาย ถามทาง สั่งอาหารที่คาเฟ่ สอบถามตารางเวลา และแก้ไขสถานการณ์เมื่อเกิดความสับสน ทำครบทั้ง 5 ด่านพร้อมสรุปบทเรียนเพื่อรับตราประทับซิดนีย์และตำแหน่งทูตแห่งการสื่อสารซิดนีย์!',
};

export interface AustraliaPerformTurnSpec {
  turnId: string;
  turnNumber: number;
  npcSpeakerId: AustraliaNpcId;
  turnLabel: LocalizedText;
  npcLineA2: LocalizedText;
  npcLineB1: LocalizedText;
  communicativeTaskA2: LocalizedText;
  communicativeTaskB1: LocalizedText;
  usefulVocab: string[];
  sentenceStartersA2: LocalizedText[];
  sentenceStartersB1: LocalizedText[];
  communicationStrategy: LocalizedText;
  hintTip: LocalizedText;
}

export interface AustraliaPerformChallengeSpec {
  id: AustraliaLandmarkId;
  order: number;
  npcId: AustraliaNpcId;
  landmarkId: AustraliaLandmarkId;
  isHelpPointReuse?: boolean;
  title: LocalizedText;
  scenarioName: LocalizedText;
  locationName: LocalizedText;
  briefingSummary: LocalizedText;
  communicationGoal: LocalizedText;
  contextProps: AustraliaContextPropId[];
  usesCafeMenu?: boolean;
  usesVisitorBoard?: boolean;
  fictionalTransitCard?: {
    lineName: LocalizedText;
    stopNote: LocalizedText;
  };
  turns: AustraliaPerformTurnSpec[];
  npcClosingLine: LocalizedText;
  completionEncouragementA2: LocalizedText;
  completionEncouragementB1: LocalizedText;
}

export const AUSTRALIA_PERFORM_CHALLENGES: AustraliaPerformChallengeSpec[] = [
  {
    id: 'circular_quay_plaza',
    order: 1,
    npcId: 'npc_olivia',
    landmarkId: 'circular_quay_plaza',
    title: {
      en: 'Challenge 1 · Meeting & Small Talk in Sydney',
      th: 'ด่านที่ 1 · ทักทายและชวนคุยสบายๆ ในซิดนีย์',
    },
    scenarioName: {
      en: 'Morning Chat at Circular Quay',
      th: 'สนทนายามเช้าที่เซอร์คิวลาร์คีย์',
    },
    locationName: AUSTRALIA_LANDMARKS[0].title,
    briefingSummary: {
      en: 'You meet Olivia by the sunlit promenade with a visitor map and Sydney brochure. Start a friendly morning chat and keep the conversation going naturally.',
      th: 'คุณพบกับโอลิเวียริมทางเดินอ่าวพร้อมแผนที่และโบรชัวร์ท่องเที่ยว เริ่มบทสนทนายามเช้าอย่างเป็นกันเองและชวนคุยต่ออย่างเป็นธรรมชาติ',
    },
    communicationGoal: {
      en: 'Greet Olivia, talk briefly about your visit and weather, and ask a follow-up question.',
      th: 'ทักทายโอลิเวีย เล่าสั้นๆ เกี่ยวกับการมาเยือนและอากาศ แล้วถามคำถามต่อยอดบทสนทนา',
    },
    contextProps: ['tourist_brochure', 'sydney_visitor_map'],
    turns: [
      {
        turnId: 'perf_cq_1',
        turnNumber: 1,
        npcSpeakerId: 'npc_olivia',
        turnLabel: {
          en: 'Turn 1 · Open & Exchange Greetings',
          th: 'รอบที่ 1 · เปิดบทสนทนาและทักทาย',
        },
        npcLineA2: {
          en: "G'day! Lovely morning by the harbour, isn't it? Where are you visiting from?",
          th: 'สวัสดีค่ะ! เช้านี้ริมอ่าวอากาศดีมากเลยนะคะ คุณเดินทางมาจากที่ไหนคะ?',
        },
        npcLineB1: {
          en: "Morning! What a bright breeze coming off Circular Quay today. Are you visiting Sydney from overseas, and how is your trip going so far?",
          th: 'อรุณสวัสดิ์ค่ะ! วันนี้ลมริมอ่าวสดชื่นมากเลย คุณเดินทางมาจากต่างประเทศใช่ไหมคะ แล้วทริปซิดนีย์ที่ผ่านมาเป็นอย่างไรบ้าง?',
        },
        communicativeTaskA2: {
          en: 'Greet Olivia warmly, say where you are visiting from (e.g., Thailand), and mention the nice weather.',
          th: 'ทักทายโอลิเวียอย่างเป็นมิตร บอกว่าคุณมาจากไหน (เช่น ประเทศไทย) และพูดถึงอากาศดีในเช้านี้',
        },
        communicativeTaskB1: {
          en: 'Respond naturally to Olivia’s greeting, share where you are from and how your trip is going, and ask how her morning is.',
          th: 'ตอบรับคำทักทายอย่างเป็นธรรมชาติ บอกที่มาและเล่าความรู้สึกต่อทริป พร้อมถามสารทุกข์สุขดิบโอลิเวียกลับ',
        },
        usefulVocab: ['Good morning', 'visiting from Thailand', 'sunny harbour', 'How are you doing?'],
        sentenceStartersA2: [
          {
            en: "Good morning, Olivia! I'm visiting from Thailand—the weather looks great today.",
            th: 'สวัสดีตอนเช้าครับ/ค่ะ โอลิเวีย! ฉันมาจากประเทศไทย—วันนี้อากาศดีมากเลย',
          },
          {
            en: "Hi Olivia! Yes, it's a lovely morning. I just arrived in Sydney.",
            th: 'สวัสดีโอลิเวีย! ใช่ เช้านี้สดใสมาก ฉันเพิ่งมาถึงซิดนีย์เลย',
          },
        ],
        sentenceStartersB1: [
          {
            en: "Morning, Olivia! I'm visiting from Thailand and loving the harbour view so far—how has your morning been?",
            th: 'อรุณสวัสดิ์ครับ/ค่ะ โอลิเวีย! ฉันมาจากประเทศไทยและประทับใจวิวอ่าวมาก—เช้านี้ของคุณเป็นอย่างไรบ้าง?',
          },
          {
            en: "Hi! The sea breeze really makes today special. It's my first day exploring Circular Quay.",
            th: 'สวัสดี! ลมทะเลทำให้วันนี้พิเศษมากเลย วันนี้เป็นวันแรกที่ฉันมาเดินสำรวจเซอร์คิวลาร์คีย์',
          },
        ],
        communicationStrategy: {
          en: 'Echo a friendly detail from the other speaker (like the weather or morning breeze) before adding your own answer.',
          th: 'ตอบรับรายละเอียดเล็กๆ จากอีกฝ่าย (เช่น อากาศดีหรือลมทะเล) ก่อนเพิ่มเติมข้อมูลของคุณ',
        },
        hintTip: {
          en: 'Try combining a greeting + origin + weather comment in two short, clear sentences.',
          th: 'ลองพูดทักทาย + บอกประเทศที่มา + ชมบรรยากาศเป็น 2 ประโยคสั้นๆ ที่ชัดเจน',
        },
      },
      {
        turnId: 'perf_cq_2',
        turnNumber: 2,
        npcSpeakerId: 'npc_olivia',
        turnLabel: {
          en: 'Turn 2 · Share Plans & Small Talk',
          th: 'รอบที่ 2 · แลกเปลี่ยนแผนการท่องเที่ยว',
        },
        npcLineA2: {
          en: 'Oh, wonderful! What do you want to see or do in Sydney today?',
          th: 'โอ้ ยอดเยี่ยมเลยค่ะ! วันนี้คุณอยากไปชมหรือทำอะไรในซิดนีย์บ้างคะ?',
        },
        npcLineB1: {
          en: "I'm glad you're enjoying it! Since you have the whole day ahead of you, what are your main plans around the city today?",
          th: 'ดีใจที่คุณชอบค่ะ! ในเมื่อมีเวลาทั้งวัน วันนี้คุณวางแผนจะไปเที่ยวหรือทำกิจกรรมอะไรรอบเมืองบ้างคะ?',
        },
        communicativeTaskA2: {
          en: 'Tell Olivia one or two places you want to visit today (like the ferry, a café, or the gardens).',
          th: 'บอกโอลิเวีย 1–2 กิจกรรมหรือสถานที่ที่คุณอยากไปวันนี้ (เช่น นั่งเรือเฟอร์รี่ แวะคาเฟ่ หรือเดินสวนริมอ่าว)',
        },
        communicativeTaskB1: {
          en: 'Outline your day’s plan clearly and explain briefly why you are looking forward to it.',
          th: 'เล่าแผนเที่ยววันนี้ให้ชัดเจนพร้อมเหตุผลสั้นๆ ว่าทำไมคุณถึงตื่นเต้นที่จะไป',
        },
        usefulVocab: ['plan to visit', 'take a ferry', 'grab lunch', 'look at the harbour sails'],
        sentenceStartersA2: [
          {
            en: 'Today I want to ride the ferry and visit the harbour café.',
            th: 'วันนี้ฉันอยากนั่งเรือเฟอร์รี่และแวะคาเฟ่ริมอ่าว',
          },
          {
            en: "I'd like to explore the gardens and take photos by the bridge.",
            th: 'ฉันอยากไปเดินสวนริมอ่าวและถ่ายรูปใกล้สะพาน',
          },
        ],
        sentenceStartersB1: [
          {
            en: "I'm hoping to visit Darling Harbour and stop by a local café so I can enjoy the waterfront.",
            th: 'ฉันตั้งใจจะไปดาร์ลิ่งฮาร์เบอร์และแวะคาเฟ่ท้องถิ่นเพื่อชมบรรยากาศริมน้ำ',
          },
          {
            en: 'First, I plan to catch a harbour ferry, then explore the gardens later this afternoon.',
            th: 'อย่างแรกฉันวางแผนจะขึ้นเรือเฟอร์รี่ แล้วค่อยเดินชมสวนช่วงบ่าย',
          },
        ],
        communicationStrategy: {
          en: 'Use sequence words like "First..." or "After that..." to make your small talk easy to follow.',
          th: 'ใช้คำเชื่อมลำดับอย่าง "First..." หรือ "After that..." เพื่อให้คู่สนทนาฟังเข้าใจง่าย',
        },
        hintTip: {
          en: 'Mention a concrete spot from the Sydney map, like Darling Harbour or Circular Quay.',
          th: 'ลองอ้างอิงชื่อสถานที่จริงจากแผนที่ซิดนีย์ เช่น Darling Harbour หรือ Circular Quay',
        },
      },
      {
        turnId: 'perf_cq_3',
        turnNumber: 3,
        npcSpeakerId: 'npc_olivia',
        turnLabel: {
          en: 'Turn 3 · Follow-Up Question & Natural Closing',
          th: 'รอบที่ 3 · ถามต่อยอดและปิดบทสนทนาอย่างสุภาพ',
        },
        npcLineA2: {
          en: 'That sounds like a great plan! Before you head off, is there anything you want to ask me about Sydney?',
          th: 'ฟังดูเป็นแผนที่ดีมากเลยค่ะ! ก่อนจะออกเดินทาง มีอะไรอยากถามฉันเกี่ยวกับซิดนีย์ไหมคะ?',
        },
        npcLineB1: {
          en: "That itinerary sounds fantastic. Before you set off, would you like any local recommendation or tip for the rest of your day?",
          th: 'ตารางเที่ยวฟังดูน่าสนุกมากค่ะ ก่อนออกเดินทาง คุณอยากได้คำแนะนำเพิ่มเติมจากคนพื้นที่สำหรับวันนี้ไหมคะ?',
        },
        communicativeTaskA2: {
          en: 'Ask Olivia one friendly follow-up question (e.g., her favourite place), thank her, and say goodbye.',
          th: 'ถามคำถามสั้นๆ โอลิเวีย (เช่น สถานที่โปรดของเธอ) แล้วขอบคุณและกล่าวลาอย่างสุภาพ',
        },
        communicativeTaskB1: {
          en: 'Ask for a personal local recommendation, express thanks naturally, and close the chat warmly.',
          th: 'ขอคำแนะนำส่วนตัวจากคนท้องถิ่น กล่าวขอบคุณอย่างเป็นธรรมชาติ และปิดท้ายบทสนทนาอย่างอบอุ่น',
        },
        usefulVocab: ['favourite spot', 'any local tip', 'Thanks a lot', 'Have a lovely day!'],
        sentenceStartersA2: [
          {
            en: "What's your favourite place near here? Thank you, and have a great day!",
            th: 'สถานที่โปรดของคุณแถวนี้คือที่ไหนคะ/ครับ? ขอบคุณมาก ขอให้มีความสุขในวันนี้นะ!',
          },
          {
            en: 'Could you recommend a good photo spot? Thanks so much, see you!',
            th: 'ช่วยแนะนำจุดถ่ายรูปสวยๆ หน่อยได้ไหม? ขอบคุณมาก แล้วพบกัน!',
          },
        ],
        sentenceStartersB1: [
          {
            en: "Yes, please—which spot along the harbour do locals enjoy most? Thanks for chatting with me, Olivia!",
            th: 'ได้โปรดเลย—จุดไหนริมอ่าวที่คนซิดนีย์ชอบมากที่สุด? ขอบคุณที่คุยเป็นเพื่อนนะ โอลิเวีย!',
          },
          {
            en: "I'd love to hear your top hidden spot in the city. Appreciate your help—enjoy your morning!",
            th: 'อยากทราบจุดลับที่น่าสนใจที่สุดในเมืองจากคุณเลย ขอบคุณสำหรับความช่วยเหลือ ขอให้เช้านี้สดใสนะ!',
          },
        ],
        communicationStrategy: {
          en: 'End conversations with both appreciation ("Thanks for the chat!") and a warm send-off.',
          th: 'ปิดท้ายการคุยด้วยคำขอบคุณและคำอวยพรสั้นๆ จะทำให้การสื่อสารดูเป็นมืออาชีพและอบอุ่น',
        },
        hintTip: {
          en: 'Keep it polite and natural: one question + one thank-you phrase.',
          th: 'พูดสั้นๆ อย่างสุภาพ: หนึ่งคำถามต่อยอด + หนึ่งประโยคขอบคุณและลา',
        },
      },
    ],
    npcClosingLine: {
      en: "My favourite view is right by the gardens at sunset! Lovely chatting with you—enjoy Sydney and catch me later if you need a hand.",
      th: 'มุมโปรดของฉันคือตรงสวนริมอ่าวช่วงพระอาทิตย์ตกค่ะ! ยินดีมากที่ได้คุยกัน—เที่ยวซิดนีย์ให้สนุก แล้วเจอกันอีกทีนะคะ',
    },
    completionEncouragementA2: {
      en: 'Great start! You opened small talk warmly, shared your day’s plan, and closed politely.',
      th: 'เริ่มต้นได้เยี่ยมมาก! คุณทักทาย เล่าแผนเที่ยว และปิดบทสนทนาได้อย่างสุภาพเป็นธรรมชาติ',
    },
    completionEncouragementB1: {
      en: 'Smooth small talk! You kept the conversation flowing with follow-up questions and natural closing phrases.',
      th: 'สนทนาได้อย่างลื่นไหล! คุณต่อยอดบทสนทนาด้วยคำถามและปิดท้ายได้อย่างเป็นธรรมชาติระดับ B1',
    },
  },
  {
    id: 'city_transit_station',
    order: 2,
    npcId: 'npc_noah',
    landmarkId: 'city_transit_station',
    title: {
      en: 'Challenge 2 · Finding Your Way Across Town',
      th: 'ด่านที่ 2 · สอบถามเส้นทางและการเดินทางในเมือง',
    },
    scenarioName: {
      en: 'Transit Desk with Noah',
      th: 'จุดบริการเดินทางกับโนอาห์',
    },
    locationName: AUSTRALIA_LANDMARKS[1].title,
    briefingSummary: {
      en: 'At City Transit Station, you need to reach Darling Harbour Pier by ferry or light rail. Talk with Noah to ask directions, confirm landmarks, and check your fictional example ticket info.',
      th: 'ที่สถานีซิตี้ทรานซิต คุณต้องการเดินทางไปท่าเรือดาร์ลิ่งฮาร์เบอร์ คุยกับโนอาห์เพื่อถามทาง ยืนยันจุดสังเกต และตรวจสอบข้อมูลตั๋วตัวอย่าง',
    },
    communicationGoal: {
      en: 'Ask clearly for directions, repeat or check key steps, and confirm ticket/travel details.',
      th: 'ถามเส้นทางอย่างชัดเจน ทวนขั้นตอนเพื่อความมั่นใจ และสอบถามเรื่องโซนตั๋วหรือเวลาเดินทาง',
    },
    contextProps: ['direction_sign', 'ferry_ticket', 'train_ticket'],
    fictionalTransitCard: {
      lineName: {
        en: 'Example Route F4 Harbour Ferry & Line T2 (Simulated Lesson Data)',
        th: 'ตัวอย่างเส้นทางเรือ F4 และรถไฟสาย T2 (ข้อมูลจำลองสำหรับฝึกพูด)',
      },
      stopNote: {
        en: 'Zone A Coastal Pass ($4 AUD) · Wharf 4 · Approx. 12 mins to Darling Harbour Pier',
        th: 'บัตรโซน A ($4 AUD) · ท่าเทียบเรือ 4 · ใช้เวลาประมาณ 12 นาทีถึงดาร์ลิ่งฮาร์เบอร์',
      },
    },
    turns: [
      {
        turnId: 'perf_ts_1',
        turnNumber: 1,
        npcSpeakerId: 'npc_noah',
        turnLabel: {
          en: 'Turn 1 · Ask for Directions Clearly',
          th: 'รอบที่ 1 · ขอเส้นทางอย่างสุภาพและชัดเจน',
        },
        npcLineA2: {
          en: "Hey there! You look like you're checking the transit board. Where do you need to go?",
          th: 'สวัสดีครับ! ดูเหมือนกำลังดูป้ายเส้นทางอยู่เลย คุณอยากเดินทางไปที่ไหนครับ?',
        },
        npcLineB1: {
          en: "G'day! Heading across town today? Let me know which station or wharf you're trying to find and I'll point you in the right direction.",
          th: 'สวัสดีครับ! วันนี้กำลังจะเดินทางข้ามไปฝั่งไหนของเมืองหรือเปล่า? บอกสถานีหรือท่าเรือที่อยากไปได้เลย เดี๋ยวผมช่วยแนะนำทางให้ครับ',
        },
        communicativeTaskA2: {
          en: 'Ask Noah politely how to get to Darling Harbour Pier (or Wharf 4).',
          th: 'ถามโนอาห์อย่างสุภาพว่าต้องเดินทางไปท่าเรือดาร์ลิ่งฮาร์เบอร์ (หรือท่าเรือ 4) ได้อย่างไร',
        },
        communicativeTaskB1: {
          en: 'Ask clearly for the best way to reach Darling Harbour Pier and mention whether you prefer ferry or train.',
          th: 'ถามวิธีเดินทางที่ดีที่สุดไปดาร์ลิ่งฮาร์เบอร์ พร้อมระบุว่าสนใจนั่งเรือเฟอร์รี่หรือรถไฟ',
        },
        usefulVocab: ['Excuse me', 'How do I get to...', 'Wharf 4', 'by ferry or train'],
        sentenceStartersA2: [
          {
            en: 'Excuse me, Noah! How do I get to Darling Harbour Pier?',
            th: 'ขอโทษครับ/ค่ะ โนอาห์! ไปท่าเรือดาร์ลิ่งฮาร์เบอร์ทางไหนได้บ้าง?',
          },
          {
            en: 'Hi! Could you tell me the way to Wharf 4 for the ferry?',
            th: 'สวัสดี! ช่วยบอกทางไปท่าเรือ 4 สำหรับขึ้นเรือเฟอร์รี่หน่อยได้ไหม?',
          },
        ],
        sentenceStartersB1: [
          {
            en: "Excuse me, I'm trying to reach Darling Harbour Pier—would you recommend taking the F4 ferry or the train?",
            th: 'ขอโทษนะคะ/ครับ ฉันกำลังจะไปท่าเรือดาร์ลิ่งฮาร์เบอร์—แนะนำให้นั่งเรือสาย F4 หรือรถไฟดี?',
          },
          {
            en: 'Hi Noah, could you show me the quickest route from here to Wharf 4?',
            th: 'สวัสดีโนอาห์ ช่วยชี้ทางที่เร็วที่สุดจากตรงนี้ไปท่าเรือ 4 ให้หน่อยได้ไหม?',
          },
        ],
        communicationStrategy: {
          en: 'Start with "Excuse me" and name your exact destination right away so staff can help quickly.',
          th: 'ขึ้นต้นด้วย "Excuse me" แล้วบอกชื่อจุดหมายปลายทางทันทีเพื่อให้เจ้าหน้าที่ช่วยได้ตรงจุด',
        },
        hintTip: {
          en: 'Include your destination clearly: "Darling Harbour Pier" or "Wharf 4".',
          th: 'อย่าลืมระบุจุดหมายให้ชัด เช่น "Darling Harbour Pier" หรือ "Wharf 4"',
        },
      },
      {
        turnId: 'perf_ts_2',
        turnNumber: 2,
        npcSpeakerId: 'npc_noah',
        turnLabel: {
          en: 'Turn 2 · Confirm Steps & Landmarks',
          th: 'รอบที่ 2 · ทวนขั้นตอนและจุดสังเกต',
        },
        npcLineA2: {
          en: 'Easy! Walk straight down the boardwalk, turn left after the blue clock sign, and go down to Wharf 4.',
          th: 'ไม่ยากเลยครับ! เดินตรงไปตามทางเดินริมน้ำ เลี้ยวซ้ายหลังป้ายนาฬิกาสีฟ้า แล้วเดินลงไปที่ท่าเรือ 4 ได้เลยครับ',
        },
        npcLineB1: {
          en: "Take the F4 Harbour Ferry—it's scenic and direct. Walk straight past the stone archway, turn left at the blue clock sign, and look for Wharf 4 on your right.",
          th: 'แนะนำเรือเฟอร์รี่สาย F4 เลยครับ วิวสวยและตรงไปถึงเลย เดินตรงผ่านซุ้มหิน เลี้ยวซ้ายตรงป้ายนาฬิกาสีฟ้า แล้วจะเห็นท่าเรือ 4 อยู่ทางขวามือครับ',
        },
        communicativeTaskA2: {
          en: 'Repeat back one or two steps to check you understood (e.g., turn left at the blue clock sign).',
          th: 'พูดทวนเส้นทาง 1–2 ขั้นตอนเพื่อตรวจความเข้าใจ (เช่น เลี้ยวซ้ายตรงป้ายนาฬิกาสีฟ้า)',
        },
        communicativeTaskB1: {
          en: 'Paraphrase Noah’s directions to confirm the landmark and Wharf number accurately.',
          th: 'ทวนเส้นทางของโนอาห์ด้วยคำพูดของตัวเองเพื่อยืนยันจุดสังเกตและหมายเลขท่าเรือให้ถูกต้อง',
        },
        usefulVocab: ['So I walk straight...', 'turn left at...', 'blue clock sign', 'Did I get that right?'],
        sentenceStartersA2: [
          {
            en: 'Got it—so I go straight, then turn left at the blue clock sign to Wharf 4?',
            th: 'เข้าใจแล้ว—คือเดินตรงไปแล้วเลี้ยวซ้ายตรงป้ายนาฬิกาสีฟ้าเพื่อไปท่าเรือ 4 ใช่ไหม?',
          },
          {
            en: 'Okay! Left after the blue clock sign, then Wharf 4. Is that right?',
            th: 'โอเค! เลี้ยวซ้ายหลังป้ายนาฬิกาสีฟ้า แล้วไปท่าเรือ 4 ถูกต้องไหม?',
          },
        ],
        sentenceStartersB1: [
          {
            en: 'Just to double-check: I walk past the archway, turn left at the blue clock sign, and board at Wharf 4?',
            th: 'ขอทวนอีกครั้งนะครับ/คะ: เดินผ่านซุ้มประตู เลี้ยวซ้ายตรงป้ายนาฬิกาสีฟ้า แล้วขึ้นเรือที่ท่าเรือ 4 ใช่ไหม?',
          },
          {
            en: 'Let me make sure I heard clearly—straight ahead, left by the clock sign, and look right for Wharf 4?',
            th: 'ขอเช็กว่าฟังถูกไหม—เดินตรงไป เลี้ยวซ้ายตรงป้ายนาฬิกา แล้วมองหาท่าเรือ 4 ทางขวาใช่ไหม?',
          },
        ],
        communicationStrategy: {
          en: 'Checking back ("Just to double-check...") prevents getting lost in real city travel!',
          th: 'การทวนเส้นทาง ("Just to double-check...") ช่วยป้องกันการหลงทางในการเดินทางจริงได้มาก',
        },
        hintTip: {
          en: 'Mention the "blue clock sign" or "Wharf 4" while checking with Noah.',
          th: 'ลองพูดคำว่า "blue clock sign" หรือ "Wharf 4" ตอนถามย้ำกับโนอาห์',
        },
      },
      {
        turnId: 'perf_ts_3',
        turnNumber: 3,
        npcSpeakerId: 'npc_noah',
        turnLabel: {
          en: 'Turn 3 · Ask About Ticket Zone or Travel Time',
          th: 'รอบที่ 3 · สอบถามโซนตั๋วหรือเวลาเดินทาง',
        },
        npcLineA2: {
          en: "Spot on! You've got it completely right. Need to check anything about your ticket or time?",
          th: 'แม่นมากครับ! ถูกต้องเลย มีคำถามเรื่องตั๋วหรือเวลาเดินทางเพิ่มเติมไหมครับ?',
        },
        npcLineB1: {
          en: "Yes, exactly! You nailed it. Before you head down to the pier, do you need to check which ticket zone applies or how long the trip takes?",
          th: 'ใช่เลยครับ ถูกต้องเป๊ะ! ก่อนลงไปที่ท่าเรือ อยากเช็กเรื่องโซนตั๋วที่ใช้หรือระยะเวลาเดินทางไหมครับ?',
        },
        communicativeTaskA2: {
          en: 'Ask Noah about the ticket zone (Zone A pass) OR how long the ferry takes, then thank him.',
          th: 'ถามโนอาห์เรื่องโซนตั๋ว (Zone A) หรือระยะเวลาเดินทาง แล้วกล่าวขอบคุณ',
        },
        communicativeTaskB1: {
          en: 'Ask to confirm both the ticket zone requirement and the estimated travel time before thanking Noah.',
          th: 'ถามยืนยันทั้งเรื่องโซนตั๋วที่ใช้ได้และเวลาที่ใช้เดินทางโดยประมาณ แล้วขอบคุณโนอาห์',
        },
        usefulVocab: ['Zone A pass', 'How long does it take?', 'Is this ticket valid?', 'Cheers, Noah!'],
        sentenceStartersA2: [
          {
            en: 'Does my Zone A ticket work for Wharf 4, and how long does it take? Thanks!',
            th: 'ตั๋วโซน A ใช้กับท่าเรือ 4 ได้ไหม และใช้เวลากี่นาที? ขอบคุณมาก!',
          },
          {
            en: 'How many minutes is the ferry ride? Thank you very much, Noah!',
            th: 'นั่งเรือเฟอร์รี่ใช้เวลากี่นาที? ขอบคุณมากครับ/ค่ะ โนอาห์!',
          },
        ],
        sentenceStartersB1: [
          {
            en: 'Could you confirm whether a Zone A coastal pass covers the F4 ferry and roughly how long it takes?',
            th: 'ช่วยยืนยันได้ไหมว่าบัตรโซน A ใช้กับเรือ F4 ได้และใช้เวลาเดินทางประมาณกี่นาที?',
          },
          {
            en: "Quick question—is this Zone A pass valid on the 12-minute ferry ride? Thanks a lot for your help!",
            th: 'ขอถามนิดนึง—บัตรโซน A นี้ใช้ขึ้นเรือรอบ 12 นาทีได้เลยใช่ไหม? ขอบคุณมากๆ เลย!',
          },
        ],
        communicationStrategy: {
          en: 'Ask one focused practical question before leaving a transit counter so you feel confident.',
          th: 'ก่อนออกจากเคาน์เตอร์เดินทาง ควรถามข้อมูลสำคัญให้ครบ เช่น เวลาหรือโซนตั๋ว เพื่อความอุ่นใจ',
        },
        hintTip: {
          en: 'Check the blue Transit Card above for the fictional Zone A ($4) & 12 mins details.',
          th: 'ดูรายละเอียดจำลองในบัตรเส้นทางด้านบนเรื่อง Zone A และเวลา 12 นาทีได้เลย',
        },
      },
    ],
    npcClosingLine: {
      en: "Yep, a $4 Zone A coastal pass covers it, and the F4 ferry takes about 12 minutes. Safe travels to Darling Harbour!",
      th: 'ใช่เลยครับ บัตรโซน A ราคา $4 ใช้ได้ และเรือ F4 ใช้เวลาประมาณ 12 นาที เดินทางปลอดภัยครับ!',
    },
    completionEncouragementA2: {
      en: 'Well done! You asked for directions, checked the landmarks, and confirmed your ticket info.',
      th: 'เก่งมาก! คุณถามทาง ทวนจุดสังเกต และตรวจสอบข้อมูลตั๋วได้อย่างครบถ้วน',
    },
    completionEncouragementB1: {
      en: 'Awesome navigation skills! You paraphrased directions clearly and verified zone and duration details.',
      th: 'ทักษะการถามทางดีเยี่ยม! คุณทวนเส้นทางด้วยคำพูดตัวเองและตรวจสอบข้อมูลได้ครบถ้วน',
    },
  },
  {
    id: 'harbour_market_cafe',
    order: 3,
    npcId: 'npc_mia',
    landmarkId: 'harbour_market_cafe',
    title: {
      en: 'Challenge 3 · Independent Harbour Café Order',
      th: 'ด่านที่ 3 · สั่งอาหารและเครื่องดื่มด้วยตนเองที่คาเฟ่ริมอ่าว',
    },
    scenarioName: {
      en: 'Ordering Lunch with Mia',
      th: 'สั่งมื้อกลางวันกับมีอา',
    },
    locationName: AUSTRALIA_LANDMARKS[2].title,
    briefingSummary: {
      en: 'Inside Harbour Market Café, Mia greets you at the counter. Use the fictional café menu below to place your own complete order with a polite request and takeaway/dine-in choice.',
      th: 'ในคาเฟ่ริมอ่าว มีอารอต้อนรับที่เคาน์เตอร์ ดูเมนูตัวอย่างด้านล่างเพื่อสั่งอาหารและเครื่องดื่มด้วยตนเอง พร้อมระบุคำขอพิเศษและเลือกรับประทานที่ร้านหรือนำกลับ',
    },
    communicationGoal: {
      en: 'Order food and a drink politely, ask for one dietary adjustment/question, and complete checkout.',
      th: 'สั่งอาหารและเครื่องดื่มอย่างสุภาพ ขอปรับส่วนผสมหรือถามข้อมูลอาหาร และตอบเรื่องทานที่ร้าน/กลับบ้าน',
    },
    contextProps: ['cafe_menu', 'sandwich', 'salad', 'orange_juice'],
    usesCafeMenu: true,
    turns: [
      {
        turnId: 'perf_mc_1',
        turnNumber: 1,
        npcSpeakerId: 'npc_mia',
        turnLabel: {
          en: 'Turn 1 · Greet & Place Your Main Order',
          th: 'รอบที่ 1 · ทักทายและสั่งอาหารกับเครื่องดื่ม',
        },
        npcLineA2: {
          en: "Hi! Welcome to Harbour Market Café. What can I get for you today?",
          th: 'สวัสดีค่ะ! ยินดีต้อนรับสู่ Harbour Market Café วันนี้รับอะไรดีคะ?',
        },
        npcLineB1: {
          en: "Hello there, welcome in! We've just put fresh sandwiches and salads out—what would you like to order today?",
          th: 'สวัสดีค่ะ ยินดีต้อนรับค่ะ! วันนี้เรามีแซนด์วิชและสลัดสดใหม่เลย คุณอยากสั่งเมนูอะไรดีคะ?',
        },
        communicativeTaskA2: {
          en: 'Pick one food item and one drink from the Harbour Market Café menu and order politely.',
          th: 'เลือกอาหาร 1 อย่างและเครื่องดื่ม 1 อย่างจากเมนูด้านบน แล้วสั่งอย่างสุภาพ',
        },
        communicativeTaskB1: {
          en: 'Greet Mia, place an order for food and a drink from the menu, and specify size or item clearly.',
          th: 'ทักทายมีอา สั่งอาหารและเครื่องดื่มจากเมนูให้ครบถ้วนและชัดเจน',
        },
        usefulVocab: ["I'd like...", 'Could I please have...', 'Harbour Club Sandwich', 'Fresh Orange Juice'],
        sentenceStartersA2: [
          {
            en: "Hi Mia! Could I have a Harbour Club Sandwich and an orange juice, please?",
            th: 'สวัสดีมีอา! ขอ Harbour Club Sandwich กับน้ำส้มคั้น 1 แก้วค่ะ/ครับ',
          },
          {
            en: "Hello! I'd like a Garden Veg Wrap and sparkling water, please.",
            th: 'สวัสดี! ขอสั่ง Garden Veg Wrap กับน้ำแร่มีฟองค่ะ/ครับ',
          },
        ],
        sentenceStartersB1: [
          {
            en: "Hi Mia! Could I please order the Harbour Club Sandwich along with a Fresh Orange Juice?",
            th: 'สวัสดีค่ะ/ครับ มีอา! ขอสั่ง Harbour Club Sandwich กับ Fresh Orange Juice หน่อยได้ไหมคะ/ครับ?',
          },
          {
            en: "Good afternoon! I'd love the Sunny Coast Salad and a Mango Smoothie if you have them.",
            th: 'สวัสดีตอนบ่าย! ขอสั่ง Sunny Coast Salad กับ Mango Smoothie นะคะ/ครับ',
          },
        ],
        communicationStrategy: {
          en: 'Pair "I\'d like..." or "Could I have..." with "please" for natural, polite Australian café English.',
          th: 'ใช้ "I\'d like..." หรือ "Could I have..." คู่กับ "please" จะฟังดูสุภาพและเป็นธรรมชาติมากในคาเฟ่ออสเตรเลีย',
        },
        hintTip: {
          en: 'Check the fictional Harbour Market Café menu card to pick real menu names.',
          th: 'ดูชื่อเมนูตัวอย่างจากบอร์ด Harbour Market Café เพื่อใช้อ้างอิงเวลาสั่งได้เลย',
        },
      },
      {
        turnId: 'perf_mc_2',
        turnNumber: 2,
        npcSpeakerId: 'npc_mia',
        turnLabel: {
          en: 'Turn 2 · Dietary Preference & Dine-In Choice',
          th: 'รอบที่ 2 · ขอปรับส่วนผสมและเลือกทานที่ร้าน/กลับบ้าน',
        },
        npcLineA2: {
          en: 'Sure thing! Do you want any changes, and is that for here or takeaway?',
          th: 'ได้เลยค่ะ! อยากปรับเปลี่ยนส่วนผสมตรงไหนไหมคะ และทานที่นี่หรือนำกลับคะ?',
        },
        npcLineB1: {
          en: "No worries at all! Do you have any dietary requests or changes you'd like us to make, and will you be having it here or takeaway?",
          th: 'ได้เลยค่ะไม่มีปัญหา! มีคำขอเรื่องส่วนผสมหรือการแพ้อาหารไหมคะ แล้วจะรับประทานที่นี่หรือใส่กล่องกลับคะ?',
        },
        communicativeTaskA2: {
          en: 'Ask for one polite change (e.g., no ice / no onion / dressing on the side) AND say "for here" or "takeaway".',
          th: 'ขอปรับเปลี่ยน 1 อย่างอย่างสุภาพ (เช่น ไม่ใส่น้ำแข็ง / ไม่ใส่หัวหอม / แยกน้ำสลัด) และบอกว่าจะทานที่ร้านหรือนำกลับ',
        },
        communicativeTaskB1: {
          en: 'Make a polite custom request or check an ingredient, and let Mia know if it is dine-in or takeaway.',
          th: 'แจ้งคำขอปรับส่วนผสมหรือสอบถามส่วนประกอบอย่างสุภาพ พร้อมระบุว่าทานที่ร้านหรือนำกลับ',
        },
        usefulVocab: ['no ice', 'on the side', 'no nuts', 'for here / dine in', 'takeaway please'],
        sentenceStartersA2: [
          {
            en: 'Could I have no ice in the juice, please? Takeaway, thank you!',
            th: 'น้ำส้มขอไม่ใส่น้ำแข็งนะคะ/ครับ ขอแบบนำกลับ ขอบคุณ!',
          },
          {
            en: 'No tomatoes, please. For here, thanks!',
            th: 'ขอไม่ใส่มะเขือเทศนะคะ/ครับ ทานที่นี่ครับ/ค่ะ!',
          },
        ],
        sentenceStartersB1: [
          {
            en: 'Could I check if there are any nuts in it, and could I have dressing on the side? Takeaway, please.',
            th: 'ขอสอบถามว่ามีถั่วไหมคะ/ครับ และขอแยกน้ำสลัดได้ไหม? ขอแบบนำกลับนะ',
          },
          {
            en: "Would it be possible to get that with light ice, and I'll have it for here by the window.",
            th: 'ขอแบบน้ำแข็งน้อยได้ไหมคะ/ครับ แล้วขอทานที่ร้านริมหน้าต่างนะ',
          },
        ],
        communicationStrategy: {
          en: 'Use softeners like "Could I have..." or "Would it be possible..." when asking for food changes.',
          th: 'ใช้ประโยคที่นุ่มนวลอย่าง "Would it be possible..." เมื่อขอปรับเปลี่ยนเมนู',
        },
        hintTip: {
          en: 'Make sure you answer BOTH parts of Mia’s question: dietary change + here/takeaway.',
          th: 'อย่าลืมตอบทั้ง 2 ส่วนของคำถาม: คำขอเรื่องอาหาร + ทานที่ร้านหรือนำกลับ',
        },
      },
      {
        turnId: 'perf_mc_3',
        turnNumber: 3,
        npcSpeakerId: 'npc_mia',
        turnLabel: {
          en: 'Turn 3 · Confirm Order & Thank Naturally',
          th: 'รอบที่ 3 · ยืนยันรายการและขอบคุณอย่างเป็นมิตร',
        },
        npcLineA2: {
          en: 'All noted! Your example order comes to $14.50 AUD. Anything else before I prepare it?',
          th: 'จดเรียบร้อยค่ะ! ยอดรวมตัวอย่างคือ $14.50 AUD รับอะไรเพิ่มอีกไหมคะก่อนฉันไปเตรียมอาหาร?',
        },
        npcLineB1: {
          en: "Got it, we'll prepare that freshly for you! Your total on the board comes to $14.50 AUD. Would you like a napkin or receipt as well?",
          th: 'รับทราบค่ะ เดี๋ยวเราเตรียมให้สดๆ เลย! ยอดรวมตามเมนูป้ายคือ $14.50 AUD รับกระดาษทิชชู่หรือใบเสร็จด้วยไหมคะ?',
        },
        communicativeTaskA2: {
          en: 'Answer Mia politely ("No, that\'s all, thanks!"), maybe ask for a napkin or receipt, and thank her.',
          th: 'ตอบมีอาอย่างสุภาพ ("พอแล้วครับ/ค่ะ ขอบคุณ!") หรือขอใบเสร็จ/ทิชชู่ และกล่าวขอบคุณ',
        },
        communicativeTaskB1: {
          en: 'Confirm you are all set (or add one small request like a receipt/fork), pay/thank warmly, and say see you shortly.',
          th: 'ยืนยันว่าเรียบร้อยแล้ว (หรือขอใบเสร็จ/ช้อนส้อม) กล่าวขอบคุณอย่างอบอุ่น',
        },
        usefulVocab: ["That's all, thanks!", 'May I have a receipt?', 'No problem', 'Thank you so much!'],
        sentenceStartersA2: [
          {
            en: "No, that's all! May I have a receipt, please? Thank you, Mia!",
            th: 'แค่นี้พอแล้วครับ/ค่ะ! ขอใบเสร็จด้วยได้ไหม? ขอบคุณมาก มีอา!',
          },
          {
            en: "I'm all good, thank you very much!",
            th: 'เรียบร้อยแล้ว ขอบคุณมากเลยครับ/ค่ะ!',
          },
        ],
        sentenceStartersB1: [
          {
            en: "That's everything for me—could I grab a receipt and a napkin when it's ready? Thanks a bunch!",
            th: 'เท่านี้เลยครับ/ค่ะ—ขอรับใบเสร็จกับทิชชู่ตอนอาหารเสร็จด้วยได้ไหม? ขอบคุณมาก!',
          },
          {
            en: "All set, thank you! Looking forward to lunch—have a great afternoon.",
            th: 'ครบเรียบร้อยแล้ว ขอบคุณค่ะ/ครับ! ขอให้อาหารอร่อยและมีความสุขช่วงบ่ายนะ',
          },
        ],
        communicationStrategy: {
          en: 'In Australian cafés, "That\'s all, thanks!" or "Cheers, appreciate it!" sounds friendly and confident.',
          th: 'ในคาเฟ่ออสเตรเลีย คำว่า "That\'s all, thanks!" ฟังเป็นกันเองและมั่นใจมาก',
        },
        hintTip: {
          en: 'Remember to clearly respond whether you need anything else and say thank you.',
          th: 'ตอบยืนยันว่าพอแล้วหรือต้องการสิ่งใดเพิ่ม แล้วปิดท้ายด้วยคำขอบคุณ',
        },
      },
    ],
    npcClosingLine: {
      en: "Right away! Here's your receipt—enjoy your meal by the harbour and come back anytime!",
      th: 'รอสักครู่นะคะ! นี่ใบเสร็จค่ะ—ทานให้อร่อยชมวิวอ่าวซิดนีย์นะคะ แล้วแวะมาอีกได้เสมอ!',
    },
    completionEncouragementA2: {
      en: 'Delicious job! You ordered clearly from the menu, gave a custom preference, and thanked Mia.',
      th: 'สั่งอาหารได้ยอดเยี่ยม! คุณสั่งครบทั้งอาหารและเครื่องดื่ม ปรับตามความต้องการ และขอบคุณอย่างสุภาพ',
    },
    completionEncouragementB1: {
      en: 'Natural café English! You managed preferences, takeaway details, and polite checkout smoothly.',
      th: 'ภาษาอังกฤษในคาเฟ่เป็นธรรมชาติมาก! คุณจัดการคำขอพิเศษและการยืนยันรายการได้คล่องแคล่ว',
    },
  },
  {
    id: 'darling_harbour_hub',
    order: 4,
    npcId: 'npc_jack',
    landmarkId: 'darling_harbour_hub',
    title: {
      en: 'Challenge 4 · Visitor Info & Schedule Inquiry',
      th: 'ด่านที่ 4 · สอบถามกิจกรรมและตารางเวลาท่องเที่ยว',
    },
    scenarioName: {
      en: 'Activity Desk with Jack',
      th: 'จุดข้อมูลกิจกรรมกับแจ็ค',
    },
    locationName: AUSTRALIA_LANDMARKS[3].title,
    briefingSummary: {
      en: 'At the Darling Harbour Hub, Jack manages the Visitor Information Board. Ask about afternoon activities, compare times or prices on the fictional board, and choose your plan.',
      th: 'ที่ดาร์ลิ่งฮาร์เบอร์ฮับ แจ็คดูแลบอร์ดข้อมูลนักท่องเที่ยว สอบถามตารางกิจกรรมช่วงบ่าย เปรียบเทียบเวลาและราคาจากบอร์ดตัวอย่าง แล้วตัดสินใจเลือกกิจกรรมของคุณ',
    },
    communicationGoal: {
      en: 'Ask for activity schedule times, compare or ask what is included in a ticket, and confirm your booking plan.',
      th: 'สอบถามตารางเวลากิจกรรม ถามรายละเอียดสิ่งที่รวมอยู่ในตั๋ว แล้วเปรียบเทียบและยืนยันแผนที่เลือก',
    },
    contextProps: ['visitor_info_board', 'attraction_ticket'],
    usesVisitorBoard: true,
    turns: [
      {
        turnId: 'perf_dh_1',
        turnNumber: 1,
        npcSpeakerId: 'npc_jack',
        turnLabel: {
          en: 'Turn 1 · Ask About Schedules & Options',
          th: 'รอบที่ 1 · สอบถามรอบเวลาและตัวเลือกกิจกรรม',
        },
        npcLineA2: {
          en: "G'day! Checking out our Darling Harbour schedule board? What activity are you interested in?",
          th: 'สวัสดีครับ! กำลังดูบอร์ดตารางกิจกรรมดาร์ลิ่งฮาร์เบอร์อยู่ใช่ไหม? สนใจกิจกรรมไหนเป็นพิเศษครับ?',
        },
        npcLineB1: {
          en: "Welcome to the Visitor Hub! We have harbour cruises, museum entries, and guided walks this afternoon—which schedule would you like to ask about?",
          th: 'ยินดีต้อนรับสู่จุดข้อมูลนักท่องเที่ยวครับ! ช่วงบ่ายมีทั้งล่องเรือ ชมพิพิธภัณฑ์ และทัวร์เดินชมวิว—อยากสอบถามรอบเวลาของกิจกรรมไหนครับ?',
        },
        communicativeTaskA2: {
          en: 'Ask Jack about the time or next departure of one activity on the fictional Darling Harbour board.',
          th: 'ถามแจ็คเรื่องรอบเวลาหรือรอบถัดไปของกิจกรรมบนบอร์ดตัวอย่างดาร์ลิ่งฮาร์เบอร์',
        },
        communicativeTaskB1: {
          en: 'Ask Jack when two afternoon activities start or finish so you can compare which fits best.',
          th: 'ถามเวลาเริ่มหรือรายละเอียดของ 2 กิจกรรมช่วงบ่ายเพื่อเปรียบเทียบดูว่าอันไหนเหมาะกับคุณ',
        },
        usefulVocab: ['What time does...', 'next afternoon session', 'Harbour Cruise', 'Maritime Museum'],
        sentenceStartersA2: [
          {
            en: 'Hi Jack! What time does the afternoon Harbour Cruise leave?',
            th: 'สวัสดีแจ็ค! เรือชมอ่าวรอบบ่ายออกกี่โมงครับ/คะ?',
          },
          {
            en: 'Excuse me, when does the Maritime Museum close today?',
            th: 'ขอโทษนะ พิพิธภัณฑ์ทางทะเลวันนี้ปิดกี่โมงครับ/คะ?',
          },
        ],
        sentenceStartersB1: [
          {
            en: "Hi Jack, could you check what time the next Harbour Cruise departs and how it fits with the Maritime Museum hours?",
            th: 'สวัสดีแจ็ค ช่วยเช็กเวลาออกของเรือชมอ่าวรอบถัดไปเทียบกับเวลาเปิดของพิพิธภัณฑ์ให้หน่อยได้ไหม?',
          },
          {
            en: "I'm comparing the afternoon cruise and the heritage walk—what times do they start?",
            th: 'ฉันกำลังเทียบระหว่างทัวร์ล่องเรือกับทัวร์เดินชมประวัติศาสตร์—ทั้งสองรอบเริ่มกี่โมงคะ/ครับ?',
          },
        ],
        communicationStrategy: {
          en: 'Start schedule questions with "What time does..." or "How often does..." for instant clarity.',
          th: 'เริ่มต้นคำถามเรื่องเวลาด้วย "What time does..." หรือ "How often does..." จะเข้าใจง่ายทันที',
        },
        hintTip: {
          en: 'Glance at the Darling Harbour Info Board shown in the modal to pick exact activity names.',
          th: 'ดูชื่อกิจกรรมและเวลาจำลองบน Darling Harbour Info Board ด้านบนเพื่อถามให้ตรงจุด',
        },
      },
      {
        turnId: 'perf_dh_2',
        turnNumber: 2,
        npcSpeakerId: 'npc_jack',
        turnLabel: {
          en: 'Turn 2 · Check Price & What Is Included',
          th: 'รอบที่ 2 · สอบถามราคาและสิ่งที่รวมในตั๋ว',
        },
        npcLineA2: {
          en: 'The next harbour loop starts at 2:00 PM, and the Maritime Museum stays open until 5:00 PM. Want to ask about tickets?',
          th: 'รอบเรือชมอ่าวถัดไปออกเวลา 14:00 น. ส่วนพิพิธภัณฑ์เปิดถึง 17:00 น. ครับ อยากถามรายละเอียดเรื่องตั๋วเพิ่มไหมครับ?',
        },
        npcLineB1: {
          en: "Sure thing! The Harbour Loop departs at 2:00 PM for 45 minutes, while the museum stays open till 5:00 PM. Would you like to check ticket prices or what's included in a pass?",
          th: 'ได้เลยครับ! เรือชมอ่าวออก 14:00 น. ใช้เวลา 45 นาที ส่วนพิพิธภัณฑ์เปิดถึง 17:00 น. ครับ อยากถามเรื่องราคาหรือสิทธิพิเศษที่รวมในบัตรไหมครับ?',
        },
        communicativeTaskA2: {
          en: 'Ask Jack how much the student/visitor ticket costs OR what is included in the pass.',
          th: 'ถามแจ็คว่าบัตรราคาเท่าไร หรือมีอะไรรวมอยู่ในบัตรบ้าง',
        },
        communicativeTaskB1: {
          en: 'Ask Jack whether a student discount applies and what highlights or stops are included in that ticket.',
          th: 'ถามแจ็คว่ามีส่วนลดนักเรียน/นักศึกษาไหม และตั๋วใบนี้รวมกิจกรรมหรือจุดจอดใดบ้าง',
        },
        usefulVocab: ['How much is...', 'What does it include?', 'student discount', 'return ferry'],
        sentenceStartersA2: [
          {
            en: 'How much is a ticket, and what does it include?',
            th: 'ตั๋วราคาเท่าไร และรวมอะไรบ้างครับ/คะ?',
          },
          {
            en: 'Is there a student ticket for the 2:00 PM cruise?',
            th: 'มีบัตรราคาพิเศษสำหรับนักเรียนสำหรับรอบ 14:00 น. ไหม?',
          },
        ],
        sentenceStartersB1: [
          {
            en: 'Could you tell me if a student discount applies and whether audio guides are included in the pass?',
            th: 'รบกวนสอบถามว่ามีส่วนลดนักเรียนไหม และบัตรนี้รวมเครื่องบรรยายเสียงด้วยหรือเปล่า?',
          },
          {
            en: "What's included in the Darling Harbour combo pass compared with a single cruise ticket?",
            th: 'บัตรแพ็กเกจรวมของดาร์ลิ่งฮาร์เบอร์ได้อะไรเพิ่มบ้างเมื่อเทียบกับตั๋วล่องเรืออย่างเดียว?',
          },
        ],
        communicationStrategy: {
          en: 'Combining two related details ("How much..." + "Does it include...") saves time at visitor desks.',
          th: 'การรวม 2 คำถามที่เกี่ยวข้องกัน ("ราคาเท่าไร" + "รวมอะไรบ้าง") ช่วยประหยัดเวลาหน้าเคาน์เตอร์ข้อมูลได้ดี',
        },
        hintTip: {
          en: 'Ask about price, discounts, or inclusions from the fictional Visitor Board.',
          th: 'ลองถามเรื่องราคา ส่วนลด หรือสิ่งที่รวมในบัตรจากบอร์ดข้อมูลจำลอง',
        },
      },
      {
        turnId: 'perf_dh_3',
        turnNumber: 3,
        npcSpeakerId: 'npc_jack',
        turnLabel: {
          en: 'Turn 3 · Compare Options & Confirm Decision',
          th: 'รอบที่ 3 · เปรียบเทียบตัวเลือกและยืนยันการตัดสินใจ',
        },
        npcLineA2: {
          en: 'The student pass is $12 example price and includes the audio commentary. Which option would you like to choose?',
          th: 'บัตรนักเรียนราคาตัวอย่าง $12 รวมคำบรรยายเสียงเรียบร้อยครับ สรุปเลือกกิจกรรมไหนดีครับ?',
        },
        npcLineB1: {
          en: "With a student pass, you save 20% and get the harbour commentary included. Comparing the 2:00 PM cruise with the museum visit, which plan works best for you?",
          th: 'บัตรนักเรียนลด 20% และรวมเสียงบรรยายรอบอ่าวด้วยครับ เมื่อเทียบกันแล้ว คุณสนใจเลือกทัวร์เรือ 14:00 น. หรือเข้าชมพิพิธภัณฑ์ดีครับ?',
        },
        communicativeTaskA2: {
          en: 'Choose your activity clearly, say why you pick it (e.g., better time / fun view), and thank Jack.',
          th: 'บอกตัวเลือกที่ต้องการอย่างชัดเจน พร้อมเหตุผลสั้นๆ (เช่น เวลาเหมาะกว่า / วิวสวย) และขอบคุณแจ็ค',
        },
        communicativeTaskB1: {
          en: 'Make a clear decision between the options with a brief comparison reason and confirm where to board or enter.',
          th: 'เลือกกิจกรรมพร้อมเปรียบเทียบเหตุผลสั้นๆ และถามยืนยันจุดขึ้นเรือหรือทางเข้าก่อนขอบคุณแจ็ค',
        },
        usefulVocab: ["I'll go with...", 'fits my schedule', 'Where do I board?', 'Thanks for the info!'],
        sentenceStartersA2: [
          {
            en: "I'll choose the 2:00 PM cruise because I love harbour views. Thanks, Jack!",
            th: 'ฉันขอเลือกรอบล่องเรือ 14:00 น. เพราะชอบวิวอ่าว ขอบคุณครับ/ค่ะ แจ็ค!',
          },
          {
            en: "Let's go with the Maritime Museum pass—it fits my afternoon. Thank you!",
            th: 'ขอเลือกบัตรพิพิธภัณฑ์ทางทะเลนะ—เหมาะกับช่วงบ่ายเลย ขอบคุณมาก!',
          },
        ],
        sentenceStartersB1: [
          {
            en: "I'll go with the 2:00 PM Harbour Cruise since it includes commentary and still leaves time for the museum after—where do I line up?",
            th: 'ฉันขอเลือกรอบเรือ 14:00 น. เพราะมีเสียงบรรยายและยังเหลือเวลาไปพิพิธภัณฑ์ต่อได้—ต้องไปต่อแถวที่จุดไหนคะ/ครับ?',
          },
          {
            en: 'The museum option suits my budget better today, so I will pick that pass. Appreciate your advice, Jack!',
            th: 'ตัวเลือกพิพิธภัณฑ์เหมาะกับงบวันนี้มากกว่า ขอเลือกบัตรนี้เลย ขอบคุณสำหรับคำแนะนำครับ/ค่ะ แจ็ค!',
          },
        ],
        communicationStrategy: {
          en: 'Use "I\'ll go with..." or "I\'d prefer..." followed by "because..." or "since..." to justify your choice politely.',
          th: 'ใช้ "I\'ll go with..." หรือ "I\'d prefer..." ตามด้วย "because..." เพื่อแสดงการตัดสินใจที่มีเหตุผล',
        },
        hintTip: {
          en: 'State your final choice + one short reason + polite thank-you.',
          th: 'บอกกิจกรรมที่เลือก + เหตุผลสั้นๆ 1 ข้อ + ขอบคุณแจ็ค',
        },
      },
    ],
    npcClosingLine: {
      en: "Smart choice! Head straight to Jetty B ten minutes early with your ticket—have an awesome afternoon on the water!",
      th: 'เลือกได้ดีเลยครับ! เดินไปที่ท่าเทียบเรือ B ก่อนเวลา 10 นาทีได้เลยครับ—ขอให้สนุกกับกิจกรรมช่วงบ่ายนะครับ!',
    },
    completionEncouragementA2: {
      en: 'Great inquiring! You checked the time, asked about the ticket price, and made a clear choice.',
      th: 'ถามข้อมูลได้เยี่ยมมาก! คุณเช็กเวลา ถามเรื่องตั๋ว และตัดสินใจเลือกได้อย่างชัดเจน',
    },
    completionEncouragementB1: {
      en: 'Clear visitor decision-making! You compared schedules, checked inclusions, and justified your choice smoothly.',
      th: 'สื่อสารและตัดสินใจได้ชัดเจน! คุณเปรียบเทียบตาราง ถามสิทธิประโยชน์ และให้เหตุผลประกอบได้ลงตัว',
    },
  },
  {
    id: 'harbour_gardens_help_point',
    order: 5,
    npcId: 'npc_olivia',
    landmarkId: 'harbour_gardens_help_point',
    isHelpPointReuse: true,
    title: {
      en: 'Challenge 5 · Clarifying & Solving a Sydney Mix-Up',
      th: 'ด่านที่ 5 · ขอความชัดเจนและแก้ไขสถานการณ์เมื่อข้อมูลคลาดเคลื่อน',
    },
    scenarioName: {
      en: 'Garden Help Point with Olivia',
      th: 'จุดช่วยเหลือนักท่องเที่ยวที่สวนริมอ่าวกับโอลิเวีย',
    },
    locationName: AUSTRALIA_LANDMARKS[4].title,
    briefingSummary: {
      en: 'Oh no—at Harbour Gardens Help Point, you see a temporary detour sign for the return ferry! Speak calmly with Olivia to interrupt politely, ask her to clarify the change, and confirm your updated route back.',
      th: 'อุ๊ย—ที่จุดช่วยเหลือในสวนริมอ่าว คุณพบป้ายแจ้งเปลี่ยนท่าเรือขากลับชั่วคราว! พูดคุยอย่างใจเย็นกับโอลิเวียเพื่อขอสอบถาม ขอให้พูดทวนให้ชัดเจน และยืนยันแผนการเดินทางกลับที่อัปเดตแล้ว',
    },
    communicationGoal: {
      en: 'Politely ask for help during an unexpected change, ask to repeat/clarify details, and confirm the new plan.',
      th: 'ขอความช่วยเหลืออย่างสุภาพเมื่อแผนเปลี่ยน ขอให้ย้ำหรืออธิบายรายละเอียดให้ชัด และยืนยันเส้นทางใหม่',
    },
    contextProps: ['garden_signpost', 'sydney_visitor_map'],
    turns: [
      {
        turnId: 'perf_hg_1',
        turnNumber: 1,
        npcSpeakerId: 'npc_olivia',
        turnLabel: {
          en: 'Turn 1 · Politely Explain the Problem',
          th: 'รอบที่ 1 · ขออนุญาตสอบถามและอธิบายปัญหาอย่างสุภาพ',
        },
        npcLineA2: {
          en: 'Hi again! Oh, you look a bit worried near the garden signpost. Is everything okay?',
          th: 'เจอกันอีกแล้วค่ะ! เอ๊ะ ดูเหมือนคุณกำลังกังวลตรงป้ายบอกทางในสวน มีอะไรให้ช่วยไหมคะ?',
        },
        npcLineB1: {
          en: "Hey there, good to see you again! Notice the temporary detour sign on the path? Let me know if the updated return route seems confusing.",
          th: 'สวัสดีอีกครั้งค่ะ! เห็นป้ายแจ้งเปลี่ยนเส้นทางชั่วคราวตรงทางเดินหรือยังคะ? บอกฉันได้เลยนะคะถ้ารู้สึกสับสนกับเส้นทางขากลับ',
        },
        communicativeTaskA2: {
          en: 'Tell Olivia politely that the usual ferry wharf is closed or detouring and ask where to go instead.',
          th: 'บอกโอลิเวียอย่างสุภาพว่าท่าเรือเดิมปิดชั่วคราวหรือเปลี่ยนเส้นทาง และถามว่าต้องไปขึ้นที่ไหนแทน',
        },
        communicativeTaskB1: {
          en: 'Politely catch Olivia’s attention, explain the unexpected wharf detour clearly, and ask how to catch the return ferry.',
          th: 'ขอรบกวนเวลาโอลิเวียอย่างสุภาพ อธิบายความสับสนเรื่องท่าเรือที่เปลี่ยนกะทันหัน และถามวิธีกลับไปยังจุดหมาย',
        },
        usefulVocab: ["Excuse me, could you help?", 'temporary detour', 'ferry wharf is closed', 'What should I do instead?'],
        sentenceStartersA2: [
          {
            en: 'Excuse me, Olivia—the sign says Wharf 4 is closed. Where should I go instead?',
            th: 'ขอโทษค่ะ/ครับ โอลิเวีย—ป้ายบอกว่าท่าเรือ 4 ปิด ฉันควรไปที่ไหนแทน?',
          },
          {
            en: "Sorry to bother you, I'm confused about the return ferry detour.",
            th: 'ขอโทษที่รบกวนนะ ฉันสับสนเรื่องการเปลี่ยนเส้นทางเรือขากลับ',
          },
        ],
        sentenceStartersB1: [
          {
            en: "Sorry to interrupt, Olivia—I saw the temporary detour sign for the return ferry. Could you help me figure out the new stop?",
            th: 'ขอโทษที่ขัดจังหวะนะคะ/ครับ โอลิเวีย—ฉันเห็นป้ายเปลี่ยนเส้นทางเรือขากลับ ช่วยแนะนำจุดขึ้นเรือใหม่หน่อยได้ไหม?',
          },
          {
            en: "Excuse me, it looks like my usual gate is redirected today. What's the best way back to Circular Quay?",
            th: 'ขอโทษนะ ดูเหมือนท่าเรือประจำวันนี้จะย้ายจุดขึ้น แล้วทางไหนสะดวกที่สุดในการกลับไปเซอร์คิวลาร์คีย์?',
          },
        ],
        communicationStrategy: {
          en: 'Stay calm and polite under surprises: use "Excuse me" or "Sorry to bother you" before explaining the problem.',
          th: 'เมื่อเกิดเหตุไม่คาดคิด ให้ตั้งสติและเริ่มด้วย "Excuse me" หรือ "Sorry to bother you" ก่อนเล่าปัญหา',
        },
        hintTip: {
          en: 'Explain both what changed (wharf detour/closed) and what you need (way back).',
          th: 'บอกให้ครบทั้งสิ่งที่เปลี่ยนไป (ป้ายเปลี่ยนเส้นทาง) และสิ่งที่ต้องการ (ทางกลับ)',
        },
      },
      {
        turnId: 'perf_hg_2',
        turnNumber: 2,
        npcSpeakerId: 'npc_olivia',
        turnLabel: {
          en: 'Turn 2 · Ask to Repeat or Clarify Fast Details',
          th: 'รอบที่ 2 · ขอให้พูดซ้ำหรือชี้แจงรายละเอียดให้ชัดเจน',
        },
        npcLineA2: {
          en: 'Ah, yes! Boats moved to Garden Pier C beside the red pavilion, leaving every 15 minutes until 6:30 PM.',
          th: 'อ๋อ ใช่เลยค่ะ! เรือย้ายไปจอดที่ Garden Pier C ข้างศาลาสีแดง ออกทุก 15 นาทีจนถึง 18:30 น. ค่ะ',
        },
        npcLineB1: {
          en: "Right—until maintenance finishes, the F4 express skips Wharf 4 and picks up at Garden Pier C beside the red pavilion, departing quarter-past and quarter-to until 6:30 PM.",
          th: 'ถูกต้องค่ะ—ระหว่างซ่อมบำรุง เรือ F4 จะข้ามท่า 4 แล้วไปรับผู้โดยสารที่ Garden Pier C ข้างศาลาสีแดงแทน ออกทุกนาทีที่ 15 และ 45 จนถึง 18:30 น. ค่ะ',
        },
        communicativeTaskA2: {
          en: 'Ask Olivia politely to repeat or clarify ONE detail (like the Pier letter "Pier C" or the departure times).',
          th: 'ขอให้โอลิเวียช่วยพูดซ้ำหรือย้ำข้อมูล 1 จุดอย่างสุภาพ (เช่น ชื่อท่าเรือ Pier C หรือเวลาออกเรือ)',
        },
        communicativeTaskB1: {
          en: 'Politely ask Olivia to slow down or clarify the exact pier name and time schedule so you have no misunderstanding.',
          th: 'ขอให้โอลิเวียพูดช้าลงหรือทวนชื่อท่าเรือและรอบเวลาที่แน่นอนเพื่อไม่ให้เข้าใจผิด',
        },
        usefulVocab: ['Sorry, could you say that again?', 'Could you speak a bit slower?', 'Did you say Pier C?', 'every 15 minutes?'],
        sentenceStartersA2: [
          {
            en: 'Sorry, could you repeat that, please? Did you say Garden Pier C?',
            th: 'ขอโทษนะคะ/ครับ ช่วยพูดซ้ำอีกครั้งได้ไหม? คุณพูดว่า Garden Pier C ใช่ไหม?',
          },
          {
            en: 'Could you speak a little slower? What time is the last boat?',
            th: 'ช่วยพูดช้าลงอีกนิดได้ไหม? เรือเที่ยวสุดท้ายกี่โมง?',
          },
        ],
        sentenceStartersB1: [
          {
            en: 'Sorry, I missed part of that—could you clarify whether it leaves from Garden Pier C every 15 minutes?',
            th: 'ขอโทษค่ะ/ครับ ฟังไม่ทันบางช่วง—ช่วยยืนยันได้ไหมว่าเรือออกจาก Garden Pier C ทุก 15 นาทีใช่ไหม?',
          },
          {
            en: 'Just to make sure I understood—did you mean Garden Pier C near the red pavilion, running until 6:30?',
            th: 'เพื่อความแน่ใจ—หมายถึง Garden Pier C ใกล้ศาลาสีแดง และวิ่งถึงหกโมงครึ่งใช่ไหม?',
          },
        ],
        communicationStrategy: {
          en: 'Asking "Sorry, could you say that again?" or "Did you mean...?" is a real-world B1 communication superpower!',
          th: 'การกล้าถามว่า "Sorry, could you say that again?" หรือ "Did you mean...?" คือทักษะสำคัญมากในโลกความจริง!',
        },
        hintTip: {
          en: 'Practice a real clarification phrase before moving to the final confirmation.',
          th: 'ฝึกใช้สำนวนขอให้พูดซ้ำหรือขอความชัดเจนจริงก่อนไปสู่ขั้นตอนสุดท้าย',
        },
      },
      {
        turnId: 'perf_hg_3',
        turnNumber: 3,
        npcSpeakerId: 'npc_olivia',
        turnLabel: {
          en: 'Turn 3 · Confirm Updated Plan & Say Farewell',
          th: 'รอบที่ 3 · ยืนยันแผนใหม่และอำลาซิดนีย์',
        },
        npcLineA2: {
          en: 'Of course! Garden Pier C, right next to the red pavilion, every 15 minutes until 6:30 PM. Do you feel ready now?',
          th: 'ยินดีค่ะ! ท่าเรือ Garden Pier C ข้างศาลาสีแดง ออกทุก 15 นาทีถึง 18:30 น. ตอนนี้พร้อมเดินทางต่อหรือยังคะ?',
        },
        npcLineB1: {
          en: "Sure—let me break it down slowly: walk past the hibiscus lawn to the red pavilion, board at Garden Pier C, and boats run every 15 minutes until 6:30. Does that clear everything up?",
          th: 'ได้เลยค่ะ ขอสรุปช้าๆ นะคะ: เดินผ่านสนามดอกชบาไปที่ศาลาสีแดง ขึ้นเรือที่ Garden Pier C เรือมีทุก 15 นาทีถึง 18:30 น. ตอนนี้ชัดเจนครบถ้วนไหมคะ?',
        },
        communicativeTaskA2: {
          en: 'Confirm the new plan ("Yes, Garden Pier C by the red pavilion!"), thank Olivia warmly, and say goodbye.',
          th: 'ยืนยันแผนใหม่ ("ใช่ ท่าเรือ Garden Pier C ข้างศาลาสีแดง!") แล้วขอบคุณและกล่าวลาโอลิเวีย',
        },
        communicativeTaskB1: {
          en: 'Summarize the updated plan clearly to show you solved the mix-up, thank Olivia for her patience, and say farewell.',
          th: 'สรุปแผนใหม่ที่เข้าใจแล้วเพื่อแสดงว่าแก้ปัญหาได้เรียบร้อย ขอบคุณโอลิเวียสำหรับความใจเย็น และกล่าวลาอย่างอบอุ่น',
        },
        usefulVocab: ["Everything's clear now!", 'Garden Pier C', 'red pavilion', 'Thank you for your patience!'],
        sentenceStartersA2: [
          {
            en: "Yes, everything is clear! Walk to the red pavilion for Garden Pier C. Thank you so much, Olivia!",
            th: 'เข้าใจชัดเจนเลย! เดินไปศาลาสีแดงเพื่อขึ้นที่ Garden Pier C ขอบคุณมากๆ นะ โอลิเวีย!',
          },
          {
            en: "Got it—Garden Pier C every 15 minutes. Thanks for helping me, goodbye!",
            th: 'เข้าใจแล้ว—ท่าเรือ Garden Pier C ทุก 15 นาที ขอบคุณที่ช่วยฉันนะ ลาก่อน!',
          },
        ],
        sentenceStartersB1: [
          {
            en: "Yes, that completely clears it up! I'll head past the lawn to the red pavilion and catch the boat at Garden Pier C. Thanks for being so helpful!",
            th: 'ใช่ ชัดเจนขึ้นมากเลย! เดี๋ยวฉันเดินผ่านสนามหญ้าไปศาลาสีแดงเพื่อขึ้นเรือที่ Garden Pier C ขอบคุณที่ช่วยอย่างเต็มที่เลยนะ!',
          },
          {
            en: "I'm all set now—Pier C by the red pavilion before 6:30. Appreciate your patience today, Olivia, and see you next adventure!",
            th: 'พร้อมแล้วครับ/ค่ะ—ท่าเรือ C ข้างศาลาสีแดงก่อน 18:30 น. ขอบคุณสำหรับความใจเย็นวันนี้ โอลิเวีย แล้วพบกันทริปหน้า!',
          },
        ],
        communicationStrategy: {
          en: 'Briefly summarizing the confirmed plan shows your listener that communication succeeded!',
          th: 'การสรุปสั้นๆ ท้ายสุดช่วยให้ทั้งสองฝ่ายมั่นใจตรงกันว่าการสื่อสารสำเร็จสมบูรณ์',
        },
        hintTip: {
          en: 'Include the new pier name + thank Olivia for helping solve the detour.',
          th: 'ระบุชื่อท่าเรือใหม่ให้ถูกต้อง พร้อมขอบคุณโอลิเวียที่ช่วยแนะนำ',
        },
      },
    ],
    npcClosingLine: {
      en: "Brilliant! You handled every change in Sydney with poise and friendly English. Head over to complete your Final Reflection and claim your Ambassador title!",
      th: 'ยอดเยี่ยมมากเลยค่ะ! คุณรับมือกับสถานการณ์ต่างๆ ในซิดนีย์ได้อย่างมั่นใจและสุภาพ ไปทำแบบทบทวนสุดท้ายเพื่อรับตำแหน่งทูตแห่งการสื่อสารซิดนีย์กันเลย!',
    },
    completionEncouragementA2: {
      en: 'Problem solved! You asked for clarification politely and confirmed the detour route clearly.',
      th: 'แก้ปัญหาได้สำเร็จ! คุณขอความช่วยเหลืออย่างสุภาพและยืนยันเส้นทางใหม่ได้อย่างชัดเจน',
    },
    completionEncouragementB1: {
      en: 'Outstanding communication repair! You handled an unexpected change calmly, clarified details, and summarized your next step.',
      th: 'ทักษะการแก้ไขความเข้าใจคลาดเคลื่อนดีเยี่ยม! คุณรับมือได้อย่างใจเย็น ถามซ้ำอย่างสุภาพ และสรุปแผนได้อย่างแม่นยำ',
    },
  },
];

export interface AustraliaPerformReflectionOption {
  id: string;
  label: LocalizedText;
}

export interface AustraliaPerformReflectionItemSpec {
  key: keyof Omit<AustraliaPerformReflectionState, 'completedAt'>;
  order: number;
  questionA2: LocalizedText;
  questionB1: LocalizedText;
  options: AustraliaPerformReflectionOption[];
  b1Placeholder: LocalizedText;
}

export const AUSTRALIA_PERFORM_REFLECTION_ITEMS: AustraliaPerformReflectionItemSpec[] = [
  {
    key: 'easiestPart',
    order: 1,
    questionA2: {
      en: '1. Which part of talking in Sydney felt easiest for you?',
      th: '1. ส่วนใดของการสนทนาในซิดนีย์ที่คุณรู้สึกว่าง่ายที่สุด?',
    },
    questionB1: {
      en: '1. Reflecting on all five Sydney challenges, what felt easiest or most natural for you?',
      th: '1. เมื่อทบทวนทั้ง 5 ด่านในซิดนีย์ ส่วนไหนที่คุณรู้สึกว่าง่ายหรือเป็นธรรมชาติที่สุด?',
    },
    options: [
      {
        id: 'greetings_small_talk',
        label: {
          en: 'Greeting Olivia and making friendly small talk',
          th: 'การทักทายโอลิเวียและชวนคุยเรื่องทั่วไป',
        },
      },
      {
        id: 'ordering_at_cafe',
        label: {
          en: 'Ordering food and drinks politely at the café',
          th: 'การสั่งอาหารและเครื่องดื่มอย่างสุภาพที่คาเฟ่',
        },
      },
      {
        id: 'asking_simple_directions',
        label: {
          en: 'Asking for directions or checking schedules',
          th: 'การถามทางหรือสอบถามตารางเวลา',
        },
      },
      {
        id: 'saying_thank_you_goodbye',
        label: {
          en: 'Ending conversations with polite thank-yous',
          th: 'การขอบคุณและปิดบทสนทนาอย่างสุภาพ',
        },
      },
    ],
    b1Placeholder: {
      en: 'Or write your own short note (optional)...',
      th: 'หรือพิมพ์ความเห็นสั้นๆ ของคุณเอง (ไม่บังคับ)...',
    },
  },
  {
    key: 'mostChallengingPart',
    order: 2,
    questionA2: {
      en: '2. Which part felt most challenging?',
      th: '2. ส่วนใดที่คุณรู้สึกว่าท้าทายมากที่สุด?',
    },
    questionB1: {
      en: '2. Which communication situation stretched your English skills the most today?',
      th: '2. สถานการณ์สื่อสารใดที่ท้าทายทักษะภาษาอังกฤษของคุณมากที่สุดในวันนี้?',
    },
    options: [
      {
        id: 'checking_landmarks_directions',
        label: {
          en: 'Confirming multi-step directions and landmarks',
          th: 'การทวนเส้นทางหลายขั้นตอนและจุดสังเกต',
        },
      },
      {
        id: 'custom_dietary_requests',
        label: {
          en: 'Making dietary changes or special café requests',
          th: 'การขอปรับเปลี่ยนเมนูหรือสอบถามส่วนผสมที่คาเฟ่',
        },
      },
      {
        id: 'comparing_schedule_options',
        label: {
          en: 'Comparing activity times, prices, and options',
          th: 'การเปรียบเทียบเวลากิจกรรม ราคา และตัวเลือกต่างๆ',
        },
      },
      {
        id: 'solving_detour_mixup',
        label: {
          en: 'Asking to repeat and clarifying a detour mix-up',
          th: 'การขอให้พูดซ้ำและแก้ปัญหาเมื่อเกิดการเปลี่ยนเส้นทาง',
        },
      },
    ],
    b1Placeholder: {
      en: 'Or describe what challenged you (optional)...',
      th: 'หรืออธิบายจุดที่รู้สึกท้าทาย (ไม่บังคับ)...',
    },
  },
  {
    key: 'keptConversationGoing',
    order: 3,
    questionA2: {
      en: '3. How did you keep the conversation going?',
      th: '3. คุณใช้วิธีใดในการสานต่อบทสนทนาให้ไหลลื่น?',
    },
    questionB1: {
      en: '3. Which interaction strategy helped you sustain multi-turn conversations best?',
      th: '3. กลยุทธ์ใดที่ช่วยให้คุณสนทนาโต้ตอบหลายรอบได้ต่อเนื่องดีที่สุด?',
    },
    options: [
      {
        id: 'asked_followup_questions',
        label: {
          en: 'I asked clear follow-up questions to the NPC',
          th: 'ฉันถามคำถามต่อยอดกับคู่สนทนาอย่างชัดเจน',
        },
      },
      {
        id: 'repeated_to_confirm',
        label: {
          en: 'I repeated important details back to confirm',
          th: 'ฉันพูดทวนรายละเอียดสำคัญกลับไปเพื่อยืนยัน',
        },
      },
      {
        id: 'added_reason_or_preference',
        label: {
          en: 'I added a polite preference or short reason ("because...")',
          th: 'ฉันบอกความต้องการหรือเหตุผลสั้นๆ เพิ่มเติม',
        },
      },
      {
        id: 'used_polite_clarification',
        label: {
          en: 'I used polite phrases like "Could you clarify...?"',
          th: 'ฉันใช้คำถามขอความชัดเจนอย่างสุภาพ',
        },
      },
    ],
    b1Placeholder: {
      en: 'Or note how you sustained the chat (optional)...',
      th: 'หรือบันทึกเทคนิคที่คุณใช้ต่อบทสนทนา (ไม่บังคับ)...',
    },
  },
  {
    key: 'usefulExpression',
    order: 4,
    questionA2: {
      en: '4. What is one useful expression you want to remember from Sydney?',
      th: '4. สำนวนที่มีประโยชน์จากซิดนีย์ที่คุณอยากจำไว้ใช้มากที่สุดคือข้อใด?',
    },
    questionB1: {
      en: '4. Pick or write one practical Sydney English expression you want to carry into real life.',
      th: '4. เลือกหรือเขียนสำนวนภาษาอังกฤษที่ได้ใช้ในซิดนีย์และอยากนำไปใช้จริงมากที่สุด',
    },
    options: [
      {
        id: 'expr_get_to',
        label: {
          en: '"Excuse me, how do I get to...?"',
          th: '"Excuse me, how do I get to...?" (ขอทางไป...)',
        },
      },
      {
        id: 'expr_could_i_have',
        label: {
          en: '"Could I please have..., takeaway?"',
          th: '"Could I please have..., takeaway?" (ขอสั่ง...แบบนำกลับ)',
        },
      },
      {
        id: 'expr_double_check',
        label: {
          en: '"Just to double-check, did you say...?"',
          th: '"Just to double-check, did you say...?" (ขอทวนว่าพูดว่า...ใช่ไหม)',
        },
      },
      {
        id: 'expr_say_again',
        label: {
          en: '"Sorry, could you say that again a bit slower?"',
          th: '"Sorry, could you say that again a bit slower?" (ขอโทษ ช่วยพูดช้าลงอีกครั้ง)',
        },
      },
    ],
    b1Placeholder: {
      en: 'Or write your favourite expression (optional)...',
      th: 'หรือพิมพ์สำนวนที่คุณชอบมากที่สุด (ไม่บังคับ)...',
    },
  },
  {
    key: 'nextImprovement',
    order: 5,
    questionA2: {
      en: '5. What is one thing you want to improve next time?',
      th: '5. สิ่งหนึ่งที่คุณอยากพัฒนาให้ดียิ่งขึ้นในครั้งต่อไปคืออะไร?',
    },
    questionB1: {
      en: '5. What is your next personal goal for future English interactions?',
      th: '5. เป้าหมายส่วนตัวที่คุณอยากพัฒนาต่อในการสื่อสารภาษาอังกฤษครั้งหน้าคืออะไร?',
    },
    options: [
      {
        id: 'improve_confidence',
        label: {
          en: 'Speak with a steadier, more confident voice',
          th: 'พูดด้วยน้ำเสียงที่มั่นคงและมั่นใจยิ่งขึ้น',
        },
      },
      {
        id: 'improve_listening_speed',
        label: {
          en: 'Understand faster details without feeling nervous',
          th: 'ฟังรายละเอียดที่พูดเร็วขึ้นโดยไม่ประหม่า',
        },
      },
      {
        id: 'improve_longer_reasons',
        label: {
          en: 'Give fuller answers using reasons and connectors',
          th: 'ตอบให้ยาวและสมบูรณ์ขึ้นด้วยเหตุผลและคำเชื่อม',
        },
      },
      {
        id: 'improve_followup_turns',
        label: {
          en: 'Ask more natural follow-up questions spontaneously',
          th: 'ตั้งคำถามต่อยอดอย่างเป็นธรรมชาติได้รวดเร็วขึ้น',
        },
      },
    ],
    b1Placeholder: {
      en: 'Or set your own next goal (optional)...',
      th: 'หรือตั้งเป้าหมายครั้งต่อไปด้วยตนเอง (ไม่บังคับ)...',
    },
  },
];

export function getAustraliaPerformChallengeSpec(
  landmarkId: AustraliaLandmarkId,
): AustraliaPerformChallengeSpec | undefined {
  return AUSTRALIA_PERFORM_CHALLENGES.find((item) => item.id === landmarkId);
}

export function isValidAustraliaPerformPracticeMode(
  val: unknown,
): val is AustraliaPerformPracticeMode {
  return val === 'microphone_recording' || val === 'no_mic_rehearsal';
}

export function isValidAustraliaPerformChallengeRecord(
  raw: unknown,
  requiredTurnIds?: readonly string[],
): raw is AustraliaPerformChallengeRecord {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return false;
  const obj = raw as Record<string, unknown>;
  // Never store fake transcripts, speech recognition outputs, scores, or raw audio blobs
  if (
    'transcript' in obj ||
    'audioBlob' in obj ||
    'audioDataUrl' in obj ||
    'pronunciationScore' in obj ||
    'fluencyScore' in obj ||
    'grammarScore' in obj
  ) {
    return false;
  }
  if (!isValidAustraliaPerformPracticeMode(obj.practiceMode)) return false;
  if (!Array.isArray(obj.completedTurnIds) || obj.completedTurnIds.length < 2) return false;
  if (!obj.completedTurnIds.every((id) => typeof id === 'string' && id.trim().length > 0)) {
    return false;
  }
  if (requiredTurnIds && requiredTurnIds.length > 0) {
    const doneSet = new Set(obj.completedTurnIds);
    if (!requiredTurnIds.every((req) => doneSet.has(req))) {
      return false;
    }
  }
  if (obj.difficultyUsed !== 'a2' && obj.difficultyUsed !== 'b1') return false;
  if (typeof obj.usedScriptPreview !== 'boolean') return false;
  if (typeof obj.completedAt !== 'string' || obj.completedAt.trim().length === 0) return false;
  return true;
}

export function sanitizeAustraliaPerformChallengeRecord(
  raw: unknown,
  requiredTurnIds?: readonly string[],
): AustraliaPerformChallengeRecord | undefined {
  if (!isValidAustraliaPerformChallengeRecord(raw, requiredTurnIds)) return undefined;
  const obj = raw as AustraliaPerformChallengeRecord;
  const uniqueTurns = Array.from(new Set(obj.completedTurnIds));
  return {
    practiceMode: obj.practiceMode,
    completedTurnIds: uniqueTurns,
    difficultyUsed: obj.difficultyUsed,
    usedScriptPreview: Boolean(obj.usedScriptPreview),
    completedAt: obj.completedAt,
  };
}

function isNonEmptyShortText(val: unknown, maxLen = 180): val is string {
  return typeof val === 'string' && val.trim().length >= 2 && val.trim().length <= maxLen;
}

export function isValidAustraliaPerformReflectionState(
  raw: unknown,
): raw is AustraliaPerformReflectionState {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return false;
  const obj = raw as Record<string, unknown>;
  return (
    isNonEmptyShortText(obj.easiestPart) &&
    isNonEmptyShortText(obj.mostChallengingPart) &&
    isNonEmptyShortText(obj.keptConversationGoing) &&
    isNonEmptyShortText(obj.usefulExpression) &&
    isNonEmptyShortText(obj.nextImprovement) &&
    typeof obj.completedAt === 'string' &&
    obj.completedAt.trim().length > 0
  );
}

export function sanitizeAustraliaPerformReflectionState(
  raw: unknown,
): AustraliaPerformReflectionState | undefined {
  if (!isValidAustraliaPerformReflectionState(raw)) return undefined;
  const obj = raw as AustraliaPerformReflectionState;
  return {
    easiestPart: obj.easiestPart.trim().slice(0, 180),
    mostChallengingPart: obj.mostChallengingPart.trim().slice(0, 180),
    keptConversationGoing: obj.keptConversationGoing.trim().slice(0, 180),
    usefulExpression: obj.usefulExpression.trim().slice(0, 180),
    nextImprovement: obj.nextImprovement.trim().slice(0, 180),
    completedAt: obj.completedAt,
  };
}

export function buildAustraliaPerformSummaryFeedback(params: {
  reflection: Pick<
    AustraliaPerformReflectionState,
    'easiestPart' | 'mostChallengingPart' | 'keptConversationGoing' | 'usefulExpression' | 'nextImprovement'
  >;
  micChallengesCount: number;
  noMicChallengesCount: number;
  usedScriptPreviewCount: number;
}): {
  headline: LocalizedText;
  strengthNote: LocalizedText;
  nextStepNote: LocalizedText;
  evidenceHonestyNote: LocalizedText;
} {
  const { micChallengesCount, noMicChallengesCount, usedScriptPreviewCount } = params;
  const usedBothOrMic = micChallengesCount > 0;

  return {
    headline: {
      en: 'Your Day in Sydney Is Complete — Communication Ambassador Unlocked!',
      th: 'ภารกิจหนึ่งวันในซิดนีย์เสร็จสมบูรณ์แล้ว — ปลดล็อกตำแหน่งทูตแห่งการสื่อสารซิดนีย์!',
    },
    strengthNote: {
      en: usedBothOrMic
        ? `You completed all five multi-turn city interactions (${micChallengesCount} using microphone voice recording and playback${noMicChallengesCount > 0 ? `, plus ${noMicChallengesCount} via no-mic aloud rehearsal` : ''}). Choosing strategies for keeping conversations flowing shows real A2–B1 readiness.`
        : `You completed all five multi-turn city interactions via structured aloud rehearsal across greetings, transit, café orders, visitor info, and resolving a detour.`,
      th: usedBothOrMic
        ? `คุณผ่านการสนทนาโต้ตอบทั้ง 5 สถานการณ์ครบแล้ว (บันทึกเสียงด้วยไมโครโฟน ${micChallengesCount} ด่าน${noMicChallengesCount > 0 ? ` และฝึกพูดทวนแบบไม่ใช้ไมค์ ${noMicChallengesCount} ด่าน` : ''}) การเลือกกลยุทธ์เพื่อต่อยอดบทสนทนาแสดงถึงความพร้อมในระดับ A2–B1`
        : `คุณฝึกพูดออกเสียงโต้ตอบครบทั้ง 5 สถานการณ์ ทั้งการทักทาย เดินทาง สั่งอาหาร ถามข้อมูล และแก้ไขสถานการณ์เฉพาะหน้าอย่างเป็นระบบ`,
    },
    nextStepNote: {
      en:
        usedScriptPreviewCount > 0
          ? 'Keep practicing real-world follow-up questions aloud, and try replaying one Sydney stop without viewing your Stage 2 script notes to challenge your spontaneous recall!'
          : 'Great independence completing challenges without relying on scripts! Carry your favourite Sydney expression into real-world English conversations next.',
      th:
        usedScriptPreviewCount > 0
          ? 'ฝึกถามคำถามต่อยอดเป็นภาษาอังกฤษต่อไป และลองย้อนกลับมาเล่นซ้ำอีกสักจุดโดยไม่เปิดสคริปต์จากด่าน BUILD เพื่อท้าทายความคล่องแคล่วของตัวเอง!'
          : 'ยอดเยี่ยมมากที่สนทนาได้โดยไม่ต้องพึ่งสคริปต์! นำสำนวนซิดนีย์ที่คุณชอบไปใช้ในการสื่อสารชีวิตจริงต่อไปได้เลย',
    },
    evidenceHonestyNote: {
      en: 'Honest Practice Record: Completed via turn-by-turn self-practice checks and transient audio playback only—no external AI speech grading or fake score is claimed.',
      th: 'บันทึกการฝึกตามจริง: ตรวจสอบจากการฝึกพูดโต้ตอบทีละรอบและเปิดฟังเสียงตัวเองชั่วคราวเท่านั้น ไม่มีการอ้างคะแนนประเมินด้วย AI ภายนอก',
    },
  };
}

export function validateAustraliaPerformBanks(): boolean {
  if (AUSTRALIA_PERFORM_CHALLENGES.length !== 5) return false;
  if (AUSTRALIA_PERFORM_REFLECTION_ITEMS.length !== 5) return false;
  const ids = new Set(AUSTRALIA_PERFORM_CHALLENGES.map((c) => c.id));
  if (ids.size !== 5) return false;
  for (const ch of AUSTRALIA_PERFORM_CHALLENGES) {
    if (ch.turns.length < 2 || ch.turns.length > 3) return false;
    for (const turn of ch.turns) {
      if (
        !turn.npcLineA2.en ||
        !turn.npcLineB1.en ||
        !turn.communicativeTaskA2.en ||
        !turn.communicativeTaskB1.en ||
        turn.usefulVocab.length === 0 ||
        turn.sentenceStartersA2.length === 0 ||
        turn.sentenceStartersB1.length === 0
      ) {
        return false;
      }
    }
  }
  return HARBOUR_CAFE_BUILD_MENU.length > 0 && DARLING_HARBOUR_BUILD_BOARD.length > 0;
}
