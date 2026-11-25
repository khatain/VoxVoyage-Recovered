import type { LocalizedText } from '../types/game';
import type { KenyaLandmarkId } from './kenyaWorld';

export const KENYA_PRACTICE_ACTIVITY_ID = 'kenya_wildspeak_safari_tour';
export const KENYA_PRACTICE_XP_REWARD = 50;

export type TouristNpcId = 'emma' | 'daniel';
export type PracticeSupportMode = 'guided' | 'supported' | 'independent';

export interface TouristNpcProfile {
  id: TouristNpcId;
  name: LocalizedText;
  role: LocalizedText;
  personality: LocalizedText;
  focus: LocalizedText;
  accentColor: string;
  voicePitch: number;
  voiceRate: number;
}

export interface KenyaPracticeConversation {
  id: KenyaLandmarkId;
  order: number;
  npcId: TouristNpcId;
  locationName: LocalizedText;
  question: LocalizedText;
  targetObjective: LocalizedText;
  suggestedStarter: string;
  modelAnswer: LocalizedText;
  recommendedDefaultMode: PracticeSupportMode;
  encouragesIndependent?: boolean;
  selfCheckFocusPrompt: LocalizedText;
  sandwichFeedback: {
    positive: LocalizedText;
    improvement: LocalizedText;
    nextStep: LocalizedText;
  };
  thankYouReply: LocalizedText;
}

export const KENYA_TOURIST_NPCS: Record<TouristNpcId, TouristNpcProfile> = {
  emma: {
    id: 'emma',
    name: { en: 'Emma', th: 'เอ็มม่า' },
    role: { en: 'Curious Tourist', th: 'นักท่องเที่ยวช่างสงสัย' },
    personality: {
      en: 'Friendly, enthusiastic, and curious about wildlife.',
      th: 'เป็นมิตร กระตือรือร้น และสนใจเรื่องสัตว์ป่าเป็นพิเศษ',
    },
    focus: {
      en: 'Wildlife facts & animal adaptations',
      th: 'ข้อเท็จจริงสัตว์ป่าและการปรับตัว',
    },
    accentColor: '#E07A5F',
    voicePitch: 1.12,
    voiceRate: 0.94,
  },
  daniel: {
    id: 'daniel',
    name: { en: 'Daniel', th: 'แดเนียล' },
    role: { en: 'Conservation Visitor', th: 'ผู้มาเยือนสายอนุรักษ์' },
    personality: {
      en: 'Thoughtful, encouraging, and passionate about protecting nature.',
      th: 'ช่างคิด อ่อนโยน และใส่ใจการอนุรักษ์สิ่งแวดล้อม',
    },
    focus: {
      en: 'Ecosystems, conservation & persuasive reasons',
      th: 'ระบบนิเวศ การอนุรักษ์ และการพูดโน้มน้าวใจ',
    },
    accentColor: '#3D7A5A',
    voicePitch: 0.9,
    voiceRate: 0.92,
  },
};

export const KENYA_PRACTICE_CONVERSATIONS: KenyaPracticeConversation[] = [
  {
    id: 'ranger_camp',
    order: 1,
    npcId: 'emma',
    locationName: { en: 'Safari Ranger Camp', th: 'แคมป์เจ้าหน้าที่ซาฟารี' },
    question: {
      en: 'What is a savanna?',
      th: 'ทุ่งหญ้าสะวันนาคืออะไร?',
    },
    targetObjective: {
      en: 'Give a simple, clear factual description.',
      th: 'อธิบายลักษณะของทุ่งหญ้าสะวันนาด้วยข้อเท็จจริงอย่างง่ายและชัดเจน',
    },
    suggestedStarter: 'A savanna is ...',
    modelAnswer: {
      en: 'A savanna is a grassland habitat where many animals live.',
      th: 'ทุ่งหญ้าสะวันนาเป็นถิ่นที่อยู่อาศัยแบบทุ่งหญ้าที่มีสัตว์ป่าหลายชนิดอาศัยอยู่',
    },
    recommendedDefaultMode: 'guided',
    selfCheckFocusPrompt: {
      en: 'Focus on describing the habitat clearly using words like "grassland habitat" or "plains".',
      th: 'เน้นการบรรยายลักษณะถิ่นอาศัยให้ชัดเจน เช่น คำว่า "grassland habitat" หรือ "plains"',
    },
    sandwichFeedback: {
      positive: {
        en: 'Great start as a Junior Safari Guide! Explaining habitats clearly helps visitors picture the Maasai Mara right away.',
        th: 'เริ่มต้นบทบาทไกด์ซาฟารีรุ่นเยาว์ได้ดีมาก! การอธิบายถิ่นอาศัยอย่างชัดเจนช่วยให้นักท่องเที่ยวเห็นภาพมาไซมาราได้ทันที',
      },
      improvement: {
        en: 'Practice tip: Pause briefly after "A savanna is" so key habitat words like "grassland habitat" stand out clearly.',
        th: 'คำแนะนำฝึกพูด: ลองเว้นจังหวะเล็กน้อยหลังคำว่า "A savanna is" เพื่อให้คำสำคัญอย่าง "grassland habitat" ฟังชัดเจนขึ้น',
      },
      nextStep: {
        en: 'Head west along the dirt trail toward Elephant Grassland—Emma has another wildlife question waiting!',
        th: 'เดินไปทางตะวันตกตามเส้นทางสู่ทุ่งช้างป่าสะวันนา เอ็มม่ามีคำถามต่อไปรอคุณอยู่!',
      },
    },
    thankYouReply: {
      en: 'Oh, a grassland habitat! That makes total sense why we can see so far across the plains!',
      th: 'อ๋อ เป็นถิ่นอาศัยแบบทุ่งหญ้านี่เอง! เข้าใจเลยว่าทำไมเราถึงมองเห็นวิวทุ่งกว้างไกลสุดลูกหูลูกตาแบบนี้!',
    },
  },
  {
    id: 'elephant_grassland',
    order: 2,
    npcId: 'emma',
    locationName: { en: 'Elephant Grassland', th: 'ทุ่งช้างป่าสะวันนา' },
    question: {
      en: 'What do elephants use their trunks for?',
      th: 'ช้างใช้งวงของมันทำอะไรบ้าง?',
    },
    targetObjective: {
      en: 'Explain animal behavior using clear action verbs.',
      th: 'อธิบายพฤติกรรมของช้างด้วยคำกริยาที่ชัดเจน',
    },
    suggestedStarter: 'Elephants use their trunks to ...',
    modelAnswer: {
      en: 'Elephants use their trunks to collect food and water.',
      th: 'ช้างใช้งวงของพวกมันเพื่อเก็บอาหารและดูดน้ำ',
    },
    recommendedDefaultMode: 'guided',
    selfCheckFocusPrompt: {
      en: 'Check that your answer names a real elephant action (collecting food, drinking water) without extra "-s" after "Elephants".',
      th: 'ตรวจดูว่าได้บอกการกระทำจริงของช้าง (เก็บอาหาร กินหญ้า ดื่มน้ำ) และใช้กริยา "use" รูปพหูพจน์อย่างถูกต้อง',
    },
    sandwichFeedback: {
      positive: {
        en: 'Awesome explanation! Visitors love hearing how amazing elephant trunks work in the wild.',
        th: 'อธิบายได้ยอดเยี่ยม! นักท่องเที่ยวชอบมากที่ได้รู้ว่างวงช้างทำงานน่าทึ่งอย่างไรในธรรมชาติ',
      },
      improvement: {
        en: 'Practice tip: Stress the action phrase "to collect food and water" with steady pacing so your listener catches the purpose.',
        th: 'คำแนะนำฝึกพูด: เน้นเสียงที่วลีจุดประสงค์ "to collect food and water" ด้วยจังหวะสม่ำเสมอเพื่อให้ผู้ฟังจับใจความได้ทันที',
      },
      nextStep: {
        en: 'Walk east across the savanna toward the tall trees at Giraffe Acacia Grove!',
        th: 'เดินข้ามทุ่งหญ้าไปทางตะวันออกสู่ดงต้นอะคาเซียและยีราฟกันต่อเลย!',
      },
    },
    thankYouReply: {
      en: "That's incredible—their trunks are like all-in-one tools for food and water!",
      th: 'น่าทึ่งมากเลย! งวงของช้างเหมือนเครื่องมือสารพัดประโยชน์ทั้งหาอาหารและดื่มน้ำเลยนะ!',
    },
  },
  {
    id: 'giraffe_acacia_grove',
    order: 3,
    npcId: 'emma',
    locationName: { en: 'Giraffe Acacia Grove', th: 'ดงต้นอะคาเซียและยีราฟ' },
    question: {
      en: 'Why do giraffes have long necks?',
      th: 'ทำไมยีราฟถึงมีคอยาว?',
    },
    targetObjective: {
      en: 'Explain an adaptation and its purpose using "because" or "to".',
      th: 'อธิบายการปรับตัวและจุดประสงค์ของยีราฟโดยใช้ "because" หรือ "to"',
    },
    suggestedStarter: 'Giraffes have long necks because ...',
    modelAnswer: {
      en: 'Giraffes have long necks to reach leaves high in trees.',
      th: 'ยีราฟมีคอยาวเพื่อเอื้อมกินใบไม้ที่อยู่สูงบนต้นไม้',
    },
    recommendedDefaultMode: 'supported',
    selfCheckFocusPrompt: {
      en: 'Did you link the adaptation ("long necks") to its survival purpose ("to reach leaves..." or "because they need...")?',
      th: 'คุณได้เชื่อมโยงการปรับตัว ("long necks") เข้ากับเหตุผลหรือจุดประสงค์ ("to reach leaves..." หรือ "because they need...") แล้วหรือยัง?',
    },
    sandwichFeedback: {
      positive: {
        en: 'Well done guiding Emma through the acacia grove! Explaining why animals adapt makes wildlife stories come alive.',
        th: 'ยอดเยี่ยมมากที่พาเอ็มม่ามาเรียนรู้ในดงอะคาเซีย! การอธิบายเหตุผลของการปรับตัวทำให้เรื่องราวสัตว์ป่ามีชีวิตชีวาขึ้นมาก',
      },
      improvement: {
        en: 'Practice tip: Connect your reason smoothly using "to reach..." or "because they need..." in one confident breath.',
        th: 'คำแนะนำฝึกพูด: เชื่อมเหตุผลให้ลื่นไหลด้วยคำว่า "to reach..." หรือ "because they need..." อย่างมั่นใจในจังหวะเดียว',
      },
      nextStep: {
        en: 'Next, meet Daniel at the northern Zebra Watering Hole to discuss why water matters for the ecosystem!',
        th: 'ต่อไปเดินขึ้นไปพบแดเนียลที่บึงน้ำม้าลาย เพื่อพูดคุยเรื่องความสำคัญของแหล่งน้ำในระบบนิเวศ!',
      },
    },
    thankYouReply: {
      en: 'Look how gracefully they reach the very top of those acacia trees—thank you for explaining!',
      th: 'ดูสิว่าพวกมันเอื้อมถึงยอดต้นอะคาเซียสูงได้อย่างสง่างามจริงๆ ขอบคุณที่ช่วยอธิบายนะ!',
    },
  },
  {
    id: 'zebra_watering_hole',
    order: 4,
    npcId: 'daniel',
    locationName: { en: 'Zebra Watering Hole', th: 'บึงน้ำม้าลาย' },
    question: {
      en: 'Why are water sources important?',
      th: 'ทำไมแหล่งน้ำจึงมีความสำคัญ?',
    },
    targetObjective: {
      en: 'Explain ecological importance using cause-and-effect connectors ("because", "so").',
      th: 'อธิบายความสำคัญต่อระบบนิเวศโดยใช้ตัวเชื่อมเหตุและผล ("because", "so")',
    },
    suggestedStarter: 'Water sources are important because ...',
    modelAnswer: {
      en: 'Water sources are important because animals need water to survive.',
      th: 'แหล่งน้ำมีความสำคัญเพราะสัตว์ป่าต้องการน้ำเพื่อการอยู่รอด',
    },
    recommendedDefaultMode: 'supported',
    selfCheckFocusPrompt: {
      en: 'Check whether you clearly linked water sources to animal survival using "because" or ", so".',
      th: 'ลองทบทวนว่าคุณได้เชื่อมความสำคัญของแหล่งน้ำเข้ากับการอยู่รอดของสัตว์ด้วย "because" หรือ ", so" ชัดเจนไหม',
    },
    sandwichFeedback: {
      positive: {
        en: 'Thoughtful ecological explaining! Daniel appreciated hearing how clean water connects the whole herd and ecosystem.',
        th: 'อธิบายความเชื่อมโยงทางระบบนิเวศได้ดีมาก! แดเนียลประทับใจที่ได้รู้ว่าแหล่งน้ำสะอาดสำคัญต่อสัตว์ทั้งฝูงอย่างไร',
      },
      improvement: {
        en: 'Practice tip: Emphasize connecting words like "because" or "so" cleanly so listeners immediately hear the cause-and-effect link.',
        th: 'คำแนะนำฝึกพูด: ออกเสียงคำเชื่อมอย่าง "because" หรือ "so" ให้ชัดถ้อยชัดคำ เพื่อให้ผู้ฟังจับเหตุและผลได้ชัดเจน',
      },
      nextStep: {
        en: 'One final stop left! Join Daniel up at Conservation Lookout for your final guiding challenge.',
        th: 'เหลือจุดสุดท้ายแล้ว! ไปพบแดเนียลที่จุดชมวิวอนุรักษ์สัตว์ป่าเพื่อทำภารกิจแนะนำนักท่องเที่ยวครั้งสุดท้าย',
      },
    },
    thankYouReply: {
      en: 'Clean watering holes truly keep the entire ecosystem alive. Let us walk up to Conservation Lookout!',
      th: 'บึงน้ำสะอาดช่วยหล่อเลี้ยงทั้งระบบนิเวศให้มีชีวิตจริงๆ เดินไปต่อที่จุดชมวิวอนุรักษ์กันเลย!',
    },
  },
  {
    id: 'conservation_lookout',
    order: 5,
    npcId: 'daniel',
    locationName: { en: 'Conservation Lookout', th: 'จุดชมวิวอนุรักษ์สัตว์ป่า' },
    question: {
      en: 'Why should we protect wildlife?',
      th: 'ทำไมพวกเราจึงควรช่วยกันปกป้องสัตว์ป่า?',
    },
    targetObjective: {
      en: 'Persuade your visitor with a clear recommendation ("should") and reason ("because").',
      th: 'พูดโน้มน้าวใจอย่างมีเหตุผลด้วยคำแนะนำ ("should") และเหตุผลสนับสนุน ("because")',
    },
    suggestedStarter: 'We should protect wildlife because ...',
    modelAnswer: {
      en: 'We should protect wildlife because animals need safe habitats.',
      th: 'พวกเราควรปกป้องสัตว์ป่าเพราะสัตว์ต้องการถิ่นที่อยู่อาศัยที่ปลอดภัย',
    },
    recommendedDefaultMode: 'independent',
    encouragesIndependent: true,
    selfCheckFocusPrompt: {
      en: 'Final guide reflection: Did you use "We should..." with a persuasive reason using "because..." to inspire action?',
      th: 'ทบทวนบทบาทไกด์ขั้นสุดท้าย: คุณได้ใช้ "We should..." คู่กับเหตุผล "because..." เพื่อชวนให้อนุรักษ์แล้วหรือยัง?',
    },
    sandwichFeedback: {
      positive: {
        en: 'Inspiring conservation voice! Speaking about why we should protect wildlife turns facts into real care for the Maasai Mara.',
        th: 'น้ำเสียงนักอนุรักษ์น่าประทับใจมาก! การบอกเหตุผลว่าทำไมเราควรปกป้องสัตว์ป่าเปลี่ยนความรู้ให้เป็นพลังดูแลมาไซมาราได้จริง',
      },
      improvement: {
        en: 'Practice tip: Try delivering "We should protect wildlife" with warm, confident energy—you are persuading guests to take care of nature!',
        th: 'คำแนะนำฝึกพูด: ลองพูดประโยค "We should protect wildlife" ด้วยน้ำเสียงมุ่งมั่นและอบอุ่น เพราะคุณกำลังชวนนักท่องเที่ยวร่วมดูแลธรรมชาติ!',
      },
      nextStep: {
        en: 'Return to Ranger Amina at Safari Ranger Camp—you have earned +50 XP and unlocked the final PERFORM stage!',
        th: 'กลับไปรายงานเจ้าหน้าที่อามินาที่แคมป์ได้เลย คุณได้รับ +50 XP และปลดล็อกด่าน PERFORM แล้ว!',
      },
    },
    thankYouReply: {
      en: 'You inspired me, Junior Safari Guide! Everyone who visits here should help keep these habitats safe.',
      th: 'คุณสร้างแรงบันดาลใจให้ผมมากเลย ไกด์ซาฟารีรุ่นเยาว์! ทุกคนที่มาเยือนควรช่วยกันรักษาถิ่นอาศัยเหล่านี้ให้ปลอดภัยจริงๆ!',
    },
  },
];

export function getKenyaPracticeConversation(
  id: string,
): KenyaPracticeConversation | undefined {
  return KENYA_PRACTICE_CONVERSATIONS.find((c) => c.id === id);
}

/**
 * Picks which viewpoint Emma or Daniel stands at based on remaining tour stops,
 * keeping each tourist NPC physically overlooking an active savanna landmark.
 */
export function getActiveConversationForTourist(
  npcId: TouristNpcId,
  practicedIds: readonly string[],
): KenyaPracticeConversation {
  const npcStops = KENYA_PRACTICE_CONVERSATIONS.filter((c) => c.npcId === npcId);
  return npcStops.find((c) => !practicedIds.includes(c.id)) ?? npcStops[npcStops.length - 1];
}

export const AMINA_PRACTICE_DIALOGUE = {
  intro: {
    en: "You're ready to become a safari guide! Our visitors have many questions about wildlife. Use what you've learned to help them understand and protect the Maasai Mara.",
    th: 'คุณพร้อมที่จะเป็นไกด์ซาฟารีแล้ว! นักท่องเที่ยวของเรามีคำถามมากมายเกี่ยวกับสัตว์ป่า ใช้สิ่งที่คุณได้เรียนรู้มาช่วยให้พวกเขาเข้าใจและร่วมปกป้องมาไซมารากันเถอะ',
  },
  inProgress: (doneCount: number, totalCount: number): LocalizedText => ({
    en: `Emma and Daniel are loving the savanna tour! You've guided ${doneCount} of ${totalCount} safari conversations so far. Visit the remaining viewpoints to answer their questions in English.`,
    th: `เอ็มม่าและแดเนียลกำลังสนุกกับการทัวร์ซาฟารีมาก! ตอนนี้คุณพาคุยครบแล้ว ${doneCount} จาก ${totalCount} จุด ไปที่จุดชมวิวที่เหลือเพื่อตอบคำถามเป็นภาษาอังกฤษได้เลย`,
  }),
  completed: {
    en: 'Outstanding work, Junior Safari Guide! Emma and Daniel learned so much from your English tour. Soon you will take the spotlight in the final Safari Guide Showcase!',
    th: 'ยอดเยี่ยมมาก ไกด์ซาฟารีรุ่นเยาว์! เอ็มม่าและแดเนียลได้เรียนรู้จากทัวร์ภาษาอังกฤษของคุณมากมาย ต่อไปคุณจะได้ขึ้นเวทีแสดงความสามารถในด่านสุดท้าย!',
  },
};
