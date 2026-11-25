import type { LocalizedText } from '../types/game';
import type { KenyaLandmarkId } from './kenyaWorld';

export const KENYA_PERFORM_ACTIVITY_ID = 'kenya_final_wildlife_ambassador';
export const KENYA_PERFORM_XP_REWARD = 100;
export const TOTAL_KENYA_MISSION_XP = 250;
export const KENYA_PASSPORT_STAMP_ID = 'stamp_kenya_wildspeak';

export interface AmbassadorGoalItem {
  id: string;
  label: LocalizedText;
}

export interface AmbassadorFactCardOption {
  id: KenyaLandmarkId;
  title: LocalizedText;
  defaultFact: LocalizedText;
  vocabKeywords: string[];
  accentColor: string;
}

export interface AmbassadorReasonOption {
  id: string;
  en: string;
  th: string;
}

export interface AmbassadorActionOption {
  id: string;
  en: string;
  th: string;
}

export interface AmbassadorQuestionItem {
  id: 'qa_emma' | 'qa_daniel';
  npcId: 'emma' | 'daniel';
  focusBadge: LocalizedText;
  question: LocalizedText;
  starter: string;
  hint: LocalizedText;
  modelIdea: LocalizedText;
  npcReply: LocalizedText;
}

export interface AmbassadorRubricDimension {
  id:
    | 'wildlife_info'
    | 'factual_accuracy'
    | 'reasons_explanations'
    | 'persuasive_recommendation'
    | 'interaction'
    | 'communication_clarity';
  title: LocalizedText;
  description: LocalizedText;
}

export const KENYA_AMBASSADOR_GOALS: AmbassadorGoalItem[] = [
  {
    id: 'goal_intro',
    label: {
      en: 'Introduce the Maasai Mara savanna to visiting guests',
      th: 'กล่าวแนะนำทุ่งหญ้าสะวันนามาไซมาราให้นักท่องเที่ยวรู้จัก',
    },
  },
  {
    id: 'goal_facts',
    label: {
      en: 'Present at least 2 accurate wildlife facts from your Field Guide',
      th: 'นำเสนอข้อเท็จจริงเกี่ยวกับสัตว์ป่าอย่างน้อย 2 ข้อจากสมุด Field Guide',
    },
  },
  {
    id: 'goal_reason',
    label: {
      en: 'Explain why protecting wildlife and habitats matters (using because / so)',
      th: 'อธิบายเหตุผลว่าทำไมการปกป้องสัตว์ป่าและถิ่นอาศัยจึงสำคัญ (เช่น because / so)',
    },
  },
  {
    id: 'goal_action',
    label: {
      en: 'Recommend at least 1 conservation action visitors should take (using should)',
      th: 'แนะนำแนวทางอนุรักษ์อย่างน้อย 1 ข้อที่นักท่องเที่ยวควรทำ (ใช้คำว่า should)',
    },
  },
  {
    id: 'goal_qa',
    label: {
      en: 'Answer 2 live questions from Emma and Daniel after your speech',
      th: 'ตอบคำถามจากเอ็มม่าและแดเนียลจำนวน 2 ข้อหลังจบการนำเสนอ',
    },
  },
];

export const KENYA_AMBASSADOR_FACT_CARDS: AmbassadorFactCardOption[] = [
  {
    id: 'ranger_camp',
    title: { en: 'Maasai Mara Savanna', th: 'ทุ่งหญ้าสะวันนามาไซมารา' },
    defaultFact: {
      en: 'The Maasai Mara is a wide grassland habitat where many wild animals live.',
      th: 'มาไซมาราเป็นถิ่นอาศัยแบบทุ่งหญ้ากว้างใหญ่ที่มีสัตว์ป่าหลายชนิดอาศัยอยู่',
    },
    vocabKeywords: ['savanna', 'grassland', 'habitat'],
    accentColor: '#E09A48',
  },
  {
    id: 'elephant_grassland',
    title: { en: 'African Elephants', th: 'ช้างแอฟริกา' },
    defaultFact: {
      en: 'Elephants are herbivores that use their trunks to collect food and water.',
      th: 'ช้างเป็นสัตว์กินพืชที่ใช้งวงเก็บอาหารและดื่มน้ำ',
    },
    vocabKeywords: ['herbivore', 'trunk', 'herd'],
    accentColor: '#D97B48',
  },
  {
    id: 'giraffe_acacia_grove',
    title: { en: 'Giraffe Adaptations', th: 'การปรับตัวของยีราฟ' },
    defaultFact: {
      en: 'Giraffes have long necks to reach tender leaves high in acacia trees.',
      th: 'ยีราฟมีคอยาวเพื่อเอื้อมกินใบไม้อ่อนบนยอดต้นอะคาเซีย',
    },
    vocabKeywords: ['adaptation', 'leaves', 'survive'],
    accentColor: '#E5A93B',
  },
  {
    id: 'zebra_watering_hole',
    title: { en: 'Watering Holes & Zebras', th: 'บึงน้ำและม้าลาย' },
    defaultFact: {
      en: 'Clean watering holes are essential because herds need fresh water to survive.',
      th: 'แหล่งน้ำสะอาดมีความสำคัญมากเพราะฝูงสัตว์ป่าต้องใช้ดื่มเพื่อการอยู่รอด',
    },
    vocabKeywords: ['water source', 'stripes', 'ecosystem'],
    accentColor: '#24B8B0',
  },
  {
    id: 'conservation_lookout',
    title: { en: 'Community Conservation', th: 'การอนุรักษ์โดยชุมชน' },
    defaultFact: {
      en: 'Conservation keeps wild migration corridors safe so wildlife and communities thrive.',
      th: 'การอนุรักษ์ช่วยรักษาเส้นทางอพยพให้สัตว์ป่าและชุมชนอยู่ร่วมกันได้อย่างยั่งยืน',
    },
    vocabKeywords: ['conservation', 'protect', 'habitats'],
    accentColor: '#48A96B',
  },
];

export const KENYA_AMBASSADOR_REASONS: AmbassadorReasonOption[] = [
  {
    id: 'reason_balance',
    en: 'We must protect wildlife because every animal keeps the savanna ecosystem balanced.',
    th: 'เราต้องปกป้องสัตว์ป่าเพราะสัตว์ทุกชนิดช่วยรักษาสมดุลของระบบนิเวศทุ่งสะวันนา',
  },
  {
    id: 'reason_habitats',
    en: 'Protecting open habitats matters because elephants, giraffes, and zebras need safe space and clean water to survive.',
    th: 'การดูแลถิ่นอาศัยสำคัญมากเพราะช้าง ยีราฟ และม้าลายต้องการพื้นที่ปลอดภัยและน้ำสะอาดในการดำรงชีวิต',
  },
  {
    id: 'reason_future',
    en: 'Conservation is important so future generations can experience a thriving wild savanna.',
    th: 'การอนุรักษ์มีความสำคัญเพื่อให้คนรุ่นหลังได้เห็นทุ่งสะวันนาที่อุดมสมบูรณ์สืบไป',
  },
];

export const KENYA_AMBASSADOR_ACTIONS: AmbassadorActionOption[] = [
  {
    id: 'action_trails',
    en: 'Visitors should stay on marked safari trails so animals feel safe in their homes.',
    th: 'นักท่องเที่ยวควรเดินทางตามเส้นทางซาฟารีที่กำหนดไว้เพื่อให้สัตว์ป่ารู้สึกปลอดภัย',
  },
  {
    id: 'action_water',
    en: 'We should keep watering holes clean and never leave plastic or litter in the reserve.',
    th: 'เราควรช่วยกันรักษาความสะอาดของแหล่งน้ำและไม่ทิ้งขยะในเขตอนุรักษ์',
  },
  {
    id: 'action_respect',
    en: 'Everyone should observe wildlife quietly from a respectful distance and support local rangers.',
    th: 'ทุกคนควรชมสัตว์ป่าอย่างสงบในระยะที่เหมาะสมและสนับสนุนการทำงานของเจ้าหน้าที่พิทักษ์ป่า',
  },
];

export const KENYA_AMBASSADOR_STARTERS: { id: string; starter: string; hint: LocalizedText }[] = [
  {
    id: 's_welcome',
    starter: 'Jambo everyone! Welcome to the Maasai Mara.',
    hint: { en: 'Opening greeting & place', th: 'คำทักทายและแนะนำสถานที่' },
  },
  {
    id: 's_fact',
    starter: 'Today I want to share two facts about...',
    hint: { en: 'Introducing wildlife facts', th: 'เกริ่นนำข้อเท็จจริงสัตว์ป่า' },
  },
  {
    id: 's_reason',
    starter: 'Protecting wildlife matters because...',
    hint: { en: 'Giving reasons', th: 'บอกเหตุผลสนับสนุน' },
  },
  {
    id: 's_persuade',
    starter: 'Together, visitors should...',
    hint: { en: 'Persuasive recommendation', th: 'ชวนลงมืออนุรักษ์' },
  },
  {
    id: 's_closing',
    starter: 'Thank you for helping save the savanna!',
    hint: { en: 'Inspiring closing', th: 'คำปิดท้ายสร้างแรงบันดาลใจ' },
  },
];

export const KENYA_AMBASSADOR_VOCAB_REVIEW: { word: string; th: string }[] = [
  { word: 'savanna', th: 'ทุ่งหญ้าสะวันนา' },
  { word: 'herbivore', th: 'สัตว์กินพืช' },
  { word: 'adaptation', th: 'การปรับตัว' },
  { word: 'ecosystem', th: 'ระบบนิเวศ' },
  { word: 'conservation', th: 'การอนุรักษ์' },
  { word: 'protect / should', th: 'ปกป้อง / ควรจะ' },
];

export const KENYA_AMBASSADOR_MODEL_SPEECH = {
  en: 'Jambo everyone, and welcome to the Maasai Mara in Kenya! This wide grassland savanna is home to incredible wildlife. Did you know that elephants are gentle herbivores that use their trunks to gather food and water, while giraffes use their long necks to reach leaves high in acacia trees? Every animal and clean watering hole keeps our savanna ecosystem balanced. Protecting these habitats matters because wildlife needs safe corridors and clean water to survive. As visitors, we should stay on marked trails, leave no litter, and observe animals respectfully. Thank you for joining me to save the savanna!',
  th: 'จัมโบ้ทุกคน ยินดีต้อนรับสู่ทุ่งหญ้ามาไซมารา ประเทศเคนยา! ทุ่งหญ้าสะวันนาอันกว้างใหญ่นี้เป็นบ้านของสัตว์ป่าที่น่าทึ่งมากมาย รู้หรือไม่ว่าช้างเป็นสัตว์กินพืชที่ใช้งวงเก็บอาหารและดื่มน้ำ ส่วนยีราฟมีคอยาวไว้เอื้อมกินใบไม้บนยอดต้นอะคาเซีย สัตว์ทุกชนิดและแหล่งน้ำสะอาดล้วนช่วยรักษาสมดุลของระบบนิเวศ การปกป้องถิ่นอาศัยจึงสำคัญมากเพราะสัตว์ป่าต้องการพื้นที่ปลอดภัยในการอยู่รอด ในฐานะผู้มาเยือน พวกเราควรอยู่บนเส้นทางที่กำหนด ไม่ทิ้งขยะ และชมสัตว์อย่างเคารพธรรมชาติ ขอบคุณที่ร่วมกันพิทักษ์ทุ่งสะวันนานะครับ/คะ!',
};

export const KENYA_AMBASSADOR_QA_QUESTIONS: AmbassadorQuestionItem[] = [
  {
    id: 'qa_emma',
    npcId: 'emma',
    focusBadge: { en: 'Wildlife Info · Q&A 1 of 2', th: 'ข้อมูลสัตว์ป่า · คำถาม 1/2' },
    question: {
      en: 'Which animal did you find most interesting, and why?',
      th: 'คุณรู้สึกประทับใจสัตว์ชนิดใดมากที่สุด และเพราะเหตุใด?',
    },
    starter: 'I found elephants / giraffes / zebras most interesting because ...',
    hint: {
      en: 'Name one animal you saw in the Maasai Mara and explain one adaptation or habit using "because" or "to".',
      th: 'ระบุชื่อสัตว์ 1 ชนิดที่คุณได้สำรวจในมาไซมารา พร้อมอธิบายจุดเด่นหรือพฤติกรรมโดยใช้คำว่า "because" หรือ "to"',
    },
    modelIdea: {
      en: 'Example idea: I found giraffes most interesting because their long necks help them reach high acacia leaves without competing with smaller herbivores.',
      th: 'แนวคิดตัวอย่าง: ฉันชอบยีราฟที่สุดเพราะคอยาวช่วยให้มันกินใบไม้บนยอดต้นอะคาเซียได้โดยไม่ต้องแย่งอาหารกับสัตว์ตัวเล็ก',
    },
    npcReply: {
      en: 'I loved hearing your personal pick—you explained what makes that animal special so clearly!',
      th: 'ชอบคำตอบของคุณมากเลย! คุณเล่าเหตุผลที่ทำให้สัตว์ชนิดนี้น่าสนใจได้ชัดเจนจริงๆ!',
    },
  },
  {
    id: 'qa_daniel',
    npcId: 'daniel',
    focusBadge: { en: 'Conservation Action · Q&A 2 of 2', th: 'แนวทางอนุรักษ์ · คำถาม 2/2' },
    question: {
      en: 'What should visitors do to help protect wildlife?',
      th: 'นักท่องเที่ยวควรทำอย่างไรเพื่อช่วยปกป้องสัตว์ป่า?',
    },
    starter: 'Visitors should ... because ...',
    hint: {
      en: 'Use a helpful modal verb ("should") to suggest one responsible action and connect it with a reason ("because" or "so").',
      th: 'ใช้คำว่า "should" เพื่อแนะนำแนวทางปฏิบัติที่ดี 1 ข้อ และเชื่อมด้วยเหตุผล ("because" หรือ "so")',
    },
    modelIdea: {
      en: 'Example idea: Visitors should stay on marked trails and avoid leaving plastic behind because wild animals need clean, peaceful habitats.',
      th: 'แนวคิดตัวอย่าง: นักท่องเที่ยวควรอยู่บนเส้นทางที่กำหนดและไม่ทิ้งขยะพลาสติกเพราะสัตว์ป่าต้องการถิ่นอาศัยที่สะอาดและสงบปลอดภัย',
    },
    npcReply: {
      en: 'That is a practical and persuasive message every visitor can follow right away. Thank you, Ambassador!',
      th: 'เป็นคำแนะนำที่ทำตามได้จริงและน่าประทับใจมากครับ นักท่องเที่ยวทุกคนนำไปปฏิบัติตามได้ทันทีเลย ขอบคุณท่านทูตสัตว์ป่า!',
    },
  },
];

export const KENYA_AMBASSADOR_RUBRIC: AmbassadorRubricDimension[] = [
  {
    id: 'wildlife_info',
    title: { en: 'Wildlife information', th: 'ข้อมูลเกี่ยวกับสัตว์ป่า' },
    description: {
      en: 'Introduced the Maasai Mara and shared at least 2 clear wildlife facts.',
      th: 'แนะนำมาไซมาราและเล่าข้อเท็จจริงเกี่ยวกับสัตว์ป่าอย่างน้อย 2 ข้อ',
    },
  },
  {
    id: 'factual_accuracy',
    title: { en: 'Factual accuracy', th: 'ความถูกต้องของข้อเท็จจริง' },
    description: {
      en: 'Used accurate animal diets, adaptations, and Field Guide vocabulary.',
      th: 'ใช้ข้อมูลเรื่องอาหาร การปรับตัว และคำศัพท์จาก Field Guide ได้อย่างถูกต้อง',
    },
  },
  {
    id: 'reasons_explanations',
    title: { en: 'Reasons and explanations', th: 'การให้เหตุผลและคำอธิบาย' },
    description: {
      en: 'Explained why wildlife and habitats matter using "because" or "so".',
      th: 'อธิบายได้ว่าทำไมต้องปกป้องสัตว์ป่าและถิ่นอาศัยโดยใช้คำว่า "because" หรือ "so"',
    },
  },
  {
    id: 'persuasive_recommendation',
    title: { en: 'Persuasive recommendation', th: 'คำแนะนำเชิงโน้มน้าวใจ' },
    description: {
      en: 'Recommended a concrete conservation action visitors should take.',
      th: 'เสนอแนะแนวทางการอนุรักษ์ที่ผู้ฟังควรนำไปปฏิบัติอย่างชัดเจน',
    },
  },
  {
    id: 'interaction',
    title: { en: 'Interaction', th: 'การสื่อสารโต้ตอบ' },
    description: {
      en: 'Responded directly and warmly to both Emma and Daniel’s Q&A questions.',
      th: 'ตอบคำถามทั้งของเอ็มม่าและแดเนียลได้ตรงประเด็นและเป็นมิตร',
    },
  },
  {
    id: 'communication_clarity',
    title: { en: 'Communication clarity', th: 'ความชัดเจนในการสื่อสาร' },
    description: {
      en: 'Spoke at a steady, friendly pace with clear key words.',
      th: 'พูดด้วยน้ำเสียงมั่นใจ จังหวะสม่ำเสมอ และออกเสียงคำสำคัญชัดเจน',
    },
  },
];

export const KENYA_AMBASSADOR_SANDWICH_FEEDBACK = {
  positive: {
    en: 'You combined real safari knowledge with persuasive conservation speaking—just like a true Maasai Mara Wildlife Ambassador!',
    th: 'คุณผสานความรู้เรื่องสัตว์ป่าเข้ากับการพูดเชิญชวนอนุรักษ์ได้อย่างยอดเยี่ยม สมบทบาททูตพิทักษ์สัตว์ป่าแห่งมาไซมารา!',
  },
  improvement: {
    en: 'Coaching tip: Pause briefly before "because" and "visitors should" so your listeners easily remember both your reasons and call to action.',
    th: 'คำแนะนำพัฒนาต่อ: ลองเว้นจังหวะสั้นๆ ก่อนคำว่า "because" และ "visitors should" เพื่อให้ผู้ฟังจดจำเหตุผลและสิ่งที่ควรทำได้แม่นยำยิ่งขึ้น',
  },
  nextStep: {
    en: 'Claim your official Kenya Passport Stamp and +100 XP! Your WildSpeak Safari adventure is ready to celebrate.',
    th: 'รับตราประทับพาสปอร์ตประเทศเคนยาและ +100 XP ได้เลย! การผจญภัย WildSpeak Safari ของคุณสำเร็จอย่างสมบูรณ์แล้ว',
  },
};

export const AMINA_PERFORM_DIALOGUE = {
  unlocked: {
    en: 'Welcome back, Junior Safari Guide! You explored the savanna, built strong wildlife facts, and guided Emma and Daniel through every stop. Now it is time for your Final Wildlife Ambassador Challenge at Conservation Lookout: present how to protect the Maasai Mara!',
    th: 'ยินดีต้อนรับกลับมา ไกด์ซาฟารีรุ่นเยาว์! คุณได้สำรวจทุ่งสะวันนา สร้างประโยคข้อเท็จจริง และพาเอ็มม่ากับแดเนียลชมครบทุกจุดแล้ว ถึงเวลาสำหรับภารกิจสุดท้าย “Save the Savanna: Wildlife Ambassador Challenge” ที่จุดชมวิวอนุรักษ์ เพื่อนำเสนอแนวทางปกป้องมาไซมาราแล้วล่ะ!',
  },
  startedWaiting: {
    en: 'The stage at Conservation Lookout is ready! Head up to the presentation stage or click below to deliver your Wildlife Ambassador speech and answer Emma and Daniel’s questions.',
    th: 'เวทีนำเสนอที่จุดชมวิวอนุรักษ์พร้อมแล้ว! เดินขึ้นไปที่เวทีหรือกดปุ่มด้านล่างเพื่อนำเสนอสุนทรพจน์ทูตสัตว์ป่าและตอบคำถามจากเอ็มม่าและแดเนียลได้เลย',
  },
  completed: {
    en: 'Congratulations, Wildlife Ambassador! You have earned your Kenya Passport Stamp and helped visitors understand why the Maasai Mara matters. You can step back onto the stage anytime to practice your speech again!',
    th: 'ขอแสดงความยินดี ท่านทูตพิทักษ์สัตว์ป่า! คุณได้รับตราประทับพาสปอร์ตประเทศเคนยาเรียบร้อยแล้ว และช่วยให้ผู้มาเยือนเข้าใจคุณค่าของมาไซมารา สามารถกลับมาซ้อมพูดบนเวทีได้ทุกเมื่อเลยนะ!',
  },
};
