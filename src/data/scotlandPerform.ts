import type {
  LocalizedText,
  ScotlandPerformOutline,
  ScotlandPerformPracticeMode,
  ScotlandPerformQaQuestionId,
  ScotlandPerformQaStates,
  ScotlandPerformReflectionState,
} from '../types/game';
import { SCOTLAND_EVIDENCE_ITEMS } from './scotlandDiscovery';
import {
  SCOTLAND_LANDMARKS,
  SCOTLAND_PASSPORT_STAMP_ID,
  SCOTLAND_STAGE_ACTIVITY_IDS,
  type ScotlandLandmarkId,
} from './scotlandWorld';

export const SCOTLAND_PERFORM_ACTIVITY_ID = SCOTLAND_STAGE_ACTIVITY_IDS.perform;
export const SCOTLAND_PERFORM_XP_REWARD = 100;
export const TOTAL_SCOTLAND_MISSION_XP = 250;
export const SCOTLAND_PERFORM_PASSPORT_STAMP_ID = SCOTLAND_PASSPORT_STAMP_ID;

const VALID_SCOTLAND_PERFORM_EVIDENCE_IDS = new Set<string>(
  SCOTLAND_LANDMARKS.map((l) => l.id),
);

export const EILIDH_PERFORM_DIALOGUE = {
  ready: {
    en: "You've explored Scotland, discovered its culture, and practiced comparing our traditions. Now it's time to share what you've learned!",
    th: 'คุณได้สำรวจสกอตแลนด์ ค้นพบวัฒนธรรม และฝึกเปรียบเทียบประเพณีของเรามาแล้ว ตอนนี้ถึงเวลาแบ่งปันสิ่งที่คุณได้เรียนรู้แล้วนะ!',
  },
  readyTip: {
    en: 'Head over to Lochside Castle Viewpoint when you are ready. Share a similarity, explain a difference, and answer two audience questions.',
    th: 'ไปที่จุดชมวิวปราสาทริมทะเลสาบ (Lochside Castle Viewpoint) เมื่อพร้อม เล่าทั้งความเหมือน ความต่าง และตอบคำถาม 2 ข้อจากผู้ฟัง',
  },
  inProgress: {
    en: 'The Cultural Exchange Showcase is waiting for you at Lochside Castle Viewpoint! Take your time planning with your evidence notes.',
    th: 'เวทีแลกเปลี่ยนวัฒนธรรมกำลังรอคุณอยู่ที่จุดชมวิวปราสาทริมทะเลสาบ! ค่อยๆ เตรียมโครงเรื่องจากสมุดบันทึกของคุณได้เลย',
  },
  completed: {
    en: 'Congratulations, Scotland–Thailand Cultural Ambassador! You compared our traditions with respect, specific examples, and clear communication.',
    th: 'ยินดีด้วย ทูตวัฒนธรรมไทย–สกอตแลนด์! คุณเปรียบเทียบวัฒนธรรมทั้งสองประเทศได้อย่างชัดเจน มีตัวอย่างจริง และน่าประทับใจมาก',
  },
} satisfies Record<string, LocalizedText>;

export const FIONA_PERFORM_DIALOGUE = {
  ready: {
    en: "A great cultural ambassador doesn't just list facts. They help people understand similarities, differences, and the meaning behind traditions.",
    th: 'ทูตวัฒนธรรมที่ดีไม่ได้แค่ท่องข้อเท็จจริง แต่ช่วยให้ผู้คนเข้าใจทั้งความเหมือน ความต่าง และความหมายเบื้องหลังประเพณีด้วย',
  },
  guidance: {
    en: 'Connect your BUILD comparison sentences with real details from Thailand and Scotland, then speak clearly in your own voice.',
    th: 'เชื่อมประโยคเปรียบเทียบจากด่าน BUILD เข้ากับตัวอย่างจริงของไทยและสกอตแลนด์ แล้วนำเสนอด้วยน้ำเสียงมั่นใจของตัวคุณเอง',
  },
  completed: {
    en: 'Your Scottish Highlands Passport Stamp shines bright! You built a warm bridge between Highland and Thai heritage.',
    th: 'ตราประทับพาสปอร์ตไฮแลนด์สกอตแลนด์ของคุณเปล่งประกายแล้ว! คุณได้สร้างสะพานมิตรภาพระหว่างวัฒนธรรมสกอตและไทยอย่างงดงาม',
  },
} satisfies Record<string, LocalizedText>;

export interface ScotlandPerformEvidenceTopic {
  id: ScotlandLandmarkId;
  categoryLabel: LocalizedText;
  title: LocalizedText;
  similaritySummary: LocalizedText;
  differenceSummary: LocalizedText;
  b1Context: LocalizedText;
  keywords: string[];
  accentColor: string;
}

const EVIDENCE_CATEGORY_LABELS: Record<ScotlandLandmarkId, LocalizedText> = {
  highland_village_square: { en: 'Everyday Life', th: 'ชีวิตประจำวัน' },
  tartan_heritage_workshop: { en: 'Textile Heritage', th: 'มรดกสิ่งทอ' },
  highland_food_market: { en: 'Food Culture', th: 'วัฒนธรรมอาหาร' },
  highland_games_ground: { en: 'Festivals & Music', th: 'เทศกาลและดนตรี' },
  lochside_castle_viewpoint: { en: 'Cultural Landmarks', th: 'สถานที่สำคัญทางวัฒนธรรม' },
};

export const SCOTLAND_PERFORM_EVIDENCE_TOPICS: ScotlandPerformEvidenceTopic[] =
  SCOTLAND_EVIDENCE_ITEMS.map((item) => {
    const landmark = SCOTLAND_LANDMARKS.find((l) => l.id === item.id);
    return {
      id: item.id,
      categoryLabel: EVIDENCE_CATEGORY_LABELS[item.id],
      title: item.landmarkTitle,
      similaritySummary: item.similarityNote,
      differenceSummary: item.differenceNote,
      b1Context: item.b1Insight,
      keywords: [
        ...item.keyVocab.map((v) => v.term),
        ...item.languageBridgePhrases.slice(0, 2),
      ],
      accentColor: landmark?.accentColor ?? '#2E6B5E',
    };
  });

export type ScotlandPerformOutlineFieldKey = keyof ScotlandPerformOutline;

export interface ScotlandPerformPlannerFieldConfig {
  key: ScotlandPerformOutlineFieldKey;
  order: number;
  label: LocalizedText;
  promptA2: LocalizedText;
  promptB1: LocalizedText;
  placeholder: LocalizedText;
  starterChipA2: string;
  starterChipB1: string;
  maxLength: number;
}

export const SCOTLAND_PERFORM_PLANNER_FIELDS: ScotlandPerformPlannerFieldConfig[] = [
  {
    key: 'introduction',
    order: 1,
    label: { en: '1. Introduction', th: '1. บทนำ (Introduction)' },
    promptA2: {
      en: 'Greet your audience and name the two countries you are comparing.',
      th: 'ทักทายผู้ฟังและบอกชื่อสองประเทศที่คุณจะเปรียบเทียบ',
    },
    promptB1: {
      en: 'Open with a clear purpose showing why comparing Scotland and Thailand is meaningful.',
      th: 'เปิดเรื่องอย่างชัดเจนว่าทำไมการเปรียบเทียบวัฒนธรรมสกอตแลนด์และไทยจึงน่าสนใจ',
    },
    placeholder: {
      en: 'e.g. Today I will compare Scotland and Thailand...',
      th: 'เช่น Today I will compare everyday life in Scotland and Thailand...',
    },
    starterChipA2: 'Hello everyone! Today I want to compare Scotland and Thailand.',
    starterChipB1: 'Good day everyone! Exploring Scotland showed me meaningful links with Thailand.',
    maxLength: 220,
  },
  {
    key: 'similarity',
    order: 2,
    label: { en: '2. Key Similarity', th: '2. ความเหมือนสำคัญ (Similarity)' },
    promptA2: {
      en: 'Explain at least one true similarity (use "Both ... and ..." or "similar to").',
      th: 'อธิบายความเหมือนอย่างน้อย 1 ข้อ (ใช้ "Both ... and ..." หรือ "similar to")',
    },
    promptB1: {
      en: 'Show what shared human value connects both communities across distance.',
      th: 'อธิบายคุณค่าร่วมกันที่เชื่อมโยงชุมชนทั้งสองประเทศเข้าด้วยกัน',
    },
    placeholder: {
      en: 'e.g. Both Scotland and Thailand value...',
      th: 'เช่น Both Scotland and Thailand gather at local markets...',
    },
    starterChipA2: 'Both Scotland and Thailand...',
    starterChipB1: 'One clear similarity between Highland culture and Thai culture is that both...',
    maxLength: 260,
  },
  {
    key: 'difference',
    order: 3,
    label: { en: '3. Key Difference', th: '3. ความต่างสำคัญ (Difference)' },
    promptA2: {
      en: 'Explain at least one real difference (use "while", "unlike", or "different from").',
      th: 'อธิบายความแตกต่างอย่างน้อย 1 ข้อ (ใช้ "while", "unlike" หรือ "different from")',
    },
    promptB1: {
      en: 'Contrast how climate, geography, or materials shape each tradition respectfully.',
      th: 'เปรียบต่างว่าสภาพอากาศ ภูมิศาสตร์ หรือวัสดุหล่อหลอมประเพณีแต่ละแห่งอย่างไร',
    },
    placeholder: {
      en: 'e.g. While Scotland uses wool tartan, Thailand weaves light silk...',
      th: 'เช่น While Scotland has cool stone castles, Thailand has...',
    },
    starterChipA2: 'However, Scotland is different from Thailand because...',
    starterChipB1: 'Whereas Scottish traditions adapted to cool mountain weather, Thai traditions...',
    maxLength: 260,
  },
  {
    key: 'evidenceNotes',
    order: 4,
    label: { en: '4. Specific Cultural Examples', th: '4. ตัวอย่างวัฒนธรรมเฉพาะเจาะจง' },
    promptA2: {
      en: 'Note 2 specific examples (like tartan & Praewa silk, oats & rice, or castles & temples).',
      th: 'จดตัวอย่างเฉพาะเจาะจง 2 อย่าง (เช่น ผ้าทาร์ทันกับผ้าไหมแพรวา หรือข้าวโอ๊ตกับข้าวหอม)',
    },
    promptB1: {
      en: 'Pair specific details from your chosen Highland evidence stations with Thai parallels.',
      th: 'จับคู่รายละเอียดจากจุดสำรวจที่คุณเลือกเข้ากับตัวอย่างจากประเทศไทย',
    },
    placeholder: {
      en: 'e.g. Tartan wool vs. Praewa silk; Highland Games vs. Songkran drums...',
      th: 'เช่น Tartan weaving & Praewa silk; oatcakes & jasmine rice...',
    },
    starterChipA2: 'For example, in Scotland..., while in Thailand...',
    starterChipB1: 'Specific examples from my journey include..., compared with Thailand’s...',
    maxLength: 280,
  },
  {
    key: 'conclusion',
    order: 5,
    label: { en: '5. Conclusion', th: '5. สรุปปิดท้าย (Conclusion)' },
    promptA2: {
      en: 'Share one final thought about respecting different cultures.',
      th: 'กล่าวสรุปปิดท้ายเกี่ยวกับการเข้าใจและเคารพวัฒนธรรมที่หลากหลาย',
    },
    promptB1: {
      en: 'Conclude with what cultural comparison teaches us as global communicators.',
      th: 'สรุปข้อคิดที่ได้จากการเปรียบเทียบวัฒนธรรมในฐานะผู้สื่อสารระดับสากล',
    },
    placeholder: {
      en: 'e.g. Even when traditions differ, comparing cultures helps us respect each other.',
      th: 'เช่น Thank you! Learning differences helps us build friendship.',
    },
    starterChipA2: 'Thank you for listening! Comparing cultures helps us understand each other.',
    starterChipB1: 'Overall, comparing Scotland and Thailand shows that diversity brings us closer together.',
    maxLength: 220,
  },
];

export const SCOTLAND_PERFORM_CONNECTORS: { phrase: string; th: string }[] = [
  { phrase: 'Both ... and ...', th: 'ทั้ง ... และ ...' },
  { phrase: 'similar to', th: 'คล้ายคลึงกับ' },
  { phrase: 'different from', th: 'แตกต่างจาก' },
  { phrase: 'while', th: 'ในขณะที่' },
  { phrase: 'whereas', th: 'ในทางกลับกัน / ขณะที่' },
  { phrase: 'unlike', th: 'ไม่เหมือนกับ / ต่างจาก' },
];

export const SCOTLAND_PERFORM_SAMPLE_REFERENCE: LocalizedText = {
  en: 'Reference Example Only (A2): "Hello everyone! Today I will compare Scotland and Thailand. Both Scotland and Thailand love gathering at lively local food markets. However, Scotland is different from Thailand because of weather: Scottish kitchens bake warm oats and shortbread in cool hills, while Thai markets serve fragrant jasmine rice and tropical fruit. For textiles, Scottish tartan uses warm wool, whereas Thai Praewa silk is light for warm days. Thank you!"',
  th: 'ตัวอย่างอ้างอิงเท่านั้น (ระดับ A2): ใช้เป็นแนวทางจัดลำดับ 5 ส่วน — ทักทาย → บอกความเหมือน → บอกความต่างพร้อมเหตุผล → ยกตัวอย่างเฉพาะเจาะจง 2 เรื่อง → สรุปและขอบคุณผู้ฟัง (ห้ามคัดลอกทั้งหมด ให้พูดด้วยสำนวนและความคิดของคุณเอง)',
};

export interface ScotlandPerformQaQuestion {
  id: ScotlandPerformQaQuestionId;
  speakerId: 'eilidh' | 'fiona';
  speakerName: LocalizedText;
  speakerRole: LocalizedText;
  focusLabel: LocalizedText;
  question: LocalizedText;
  a2SupportQuestion: LocalizedText;
  starterA2: string;
  starterB1: string;
  hint: LocalizedText;
  b1ExtensionPrompt: LocalizedText;
  npcReply: LocalizedText;
}

export const SCOTLAND_PERFORM_QA_QUESTIONS: ScotlandPerformQaQuestion[] = [
  {
    id: 'qa_eilidh',
    speakerId: 'eilidh',
    speakerName: { en: 'Eilidh MacLeod', th: 'ไอลีด แมคลอยด์' },
    speakerRole: { en: 'Scottish Student & Host', th: 'นักเรียนเจ้าภาพชาวสกอต' },
    focusLabel: { en: 'Q&A 1 of 2 · Surprising Similarity', th: 'คำถาม 1/2 · ความเหมือนที่น่าประทับใจ' },
    question: {
      en: 'Which similarity between Scotland and Thailand surprised you the most, and why?',
      th: 'ความเหมือนข้อใดระหว่างสกอตแลนด์และไทยที่ทำให้คุณประหลาดใจที่สุด และเพราะเหตุใด?',
    },
    a2SupportQuestion: {
      en: 'Simpler A2 prompt: What is one similarity you liked between Scotland and Thailand, and why?',
      th: 'คำถามแบบง่าย (A2): มีความเหมือนอะไรระหว่างสกอตแลนด์และไทยที่คุณชอบ และทำไม?',
    },
    starterA2: 'One similarity that surprised me is ... because ...',
    starterB1: 'What surprised me most was the similarity between ... and ... because both...',
    hint: {
      en: 'Pick one shared tradition (like tartan & Praewa silk, community squares, local food markets, or summer festivals) and give a clear reason with "because".',
      th: 'เลือกความเหมือน 1 เรื่อง (เช่น ผ้าทอมือ ลานชุมชน ตลาดอาหาร หรือเทศกาล) แล้วบอกเหตุผลด้วย "because"',
    },
    b1ExtensionPrompt: {
      en: 'B1 Challenge: Add one detail explaining what shared value both communities show.',
      th: 'ความท้าทาย B1: เพิ่มรายละเอียด 1 ข้อว่าความเหมือนนั้นสะท้อนคุณค่าร่วมอะไรของชุมชน',
    },
    npcReply: {
      en: 'What a thoughtful answer! Even across thousands of miles, hearing how our communities share pride in local crafts and festivals makes me smile.',
      th: 'เป็นคำตอบที่ลึกซึ้งมากเลย! แม้จะอยู่ห่างกันหลายพันไมล์ แต่ชุมชนของเราก็มีหัวใจรักงานฝีมือและเทศกาลไม่ต่างกันเลย',
    },
  },
  {
    id: 'qa_fiona',
    speakerId: 'fiona',
    speakerName: { en: 'Fiona Campbell', th: 'ฟิโอนา แคมป์เบลล์' },
    speakerRole: { en: 'Cultural Heritage Guide', th: 'มัคคุเทศก์มรดกวัฒนธรรม' },
    focusLabel: { en: 'Q&A 2 of 2 · Cultural Understanding', th: 'คำถาม 2/2 · ความเข้าใจข้ามวัฒนธรรม' },
    question: {
      en: 'Why is it important to understand cultural differences when communicating with people from other countries?',
      th: 'เหตุใดการเข้าใจความแตกต่างทางวัฒนธรรมจึงสำคัญเมื่อสื่อสารกับผู้คนจากประเทศอื่น?',
    },
    a2SupportQuestion: {
      en: 'Simpler A2 prompt: Why is it good to understand differences when we talk to people from other countries?',
      th: 'คำถามแบบง่าย (A2): ทำไมการเข้าใจความแตกต่างจึงดีเวลาเราคุยกับคนต่างชาติ?',
    },
    starterA2: 'It is important to understand differences because ...',
    starterB1: 'Understanding cultural differences matters in global communication because it helps us...',
    hint: {
      en: 'Think about avoiding stereotypes (like assuming Scots wear kilts daily), showing respect, and listening with curiosity.',
      th: 'นึกถึงการหลีกเลี่ยงภาพจำผิดๆ การให้เกียรติกัน และการรับฟังด้วยความเข้าใจ',
    },
    b1ExtensionPrompt: {
      en: 'B1 Challenge: Connect your answer to how knowing daily life vs. special traditions prevents misunderstandings.',
      th: 'ความท้าทาย B1: เชื่อมคำตอบว่าการแยกชีวิตประจำวันออกจากประเพณีพิเศษช่วยลดความเข้าใจผิดได้อย่างไร',
    },
    npcReply: {
      en: 'Spoken like a true ambassador! Understanding why differences exist turns curiosity into genuine respect.',
      th: 'พูดได้สมกับเป็นทูตวัฒนธรรมจริงๆ! การเข้าใจเหตุผลเบื้องหลังความแตกต่างช่วยเปลี่ยนความสงสัยให้เป็นความเคารพอย่างแท้จริง',
    },
  },
];

export type ScotlandPerformReflectionCheckKey =
  keyof ScotlandPerformReflectionState['checks'];

export const SCOTLAND_PERFORM_REFLECTION_ITEMS: {
  key: ScotlandPerformReflectionCheckKey;
  label: LocalizedText;
}[] = [
  {
    key: 'introducedComparison',
    label: {
      en: 'I introduced my cultural comparison.',
      th: 'ฉันได้กล่าวแนะนำการเปรียบเทียบวัฒนธรรมแล้ว',
    },
  },
  {
    key: 'explainedSimilarity',
    label: {
      en: 'I explained at least one similarity.',
      th: 'ฉันได้อธิบายความเหมือนอย่างน้อย 1 ข้อ',
    },
  },
  {
    key: 'explainedDifference',
    label: {
      en: 'I explained at least one difference.',
      th: 'ฉันได้อธิบายความแตกต่างอย่างน้อย 1 ข้อ',
    },
  },
  {
    key: 'usedSpecificExamples',
    label: {
      en: 'I used specific cultural examples.',
      th: 'ฉันได้ยกตัวอย่างวัฒนธรรมเฉพาะเจาะจงประกอบ',
    },
  },
  {
    key: 'answeredBothQuestions',
    label: {
      en: 'I answered both audience questions.',
      th: 'ฉันได้ตอบคำถามจากผู้ฟังทั้ง 2 ข้อแล้ว',
    },
  },
  {
    key: 'spokeClearlyConfidently',
    label: {
      en: 'I tried to speak clearly and confidently.',
      th: 'ฉันได้พยายามพูดให้ชัดเจนและมั่นใจ',
    },
  },
];

export const SCOTLAND_PERFORM_GUIDANCE_FEEDBACK: {
  positive: LocalizedText;
  improvement: LocalizedText;
  nextStep: LocalizedText;
} = {
  positive: {
    en: 'Well done completing your final Cultural Exchange showcase — organizing your ideas into similarities, differences, and examples helps listeners follow your message.',
    th: 'ยอดเยี่ยมมากที่นำเสนอแลกเปลี่ยนวัฒนธรรมจนสำเร็จ การจัดลำดับความเหมือน ความต่าง และตัวอย่างช่วยให้ผู้ฟังเข้าใจเรื่องราวได้ชัดเจน',
  },
  improvement: {
    en: 'Whenever you compare two cultures, check that your bridge words (both, while, whereas, unlike) match real daily habits and heritage traditions rather than stereotypes.',
    th: 'ทุกครั้งที่เปรียบเทียบวัฒนธรรม ลองตรวจว่าคำเชื่อม (both, while, whereas, unlike) สะท้อนวิถีจริงในชีวิตประจำวันและงานประเพณีได้อย่างแม่นยำ',
  },
  nextStep: {
    en: 'Listen back to your recording or review your notes once more, and feel free to replay Scotland anytime to try a new pair of evidence topics.',
    th: 'ลองฟังเสียงบันทึกหรือทบทวนบันทึกของคุณอีกครั้ง และสามารถเล่นสกอตแลนด์ซ้ำได้ทุกเมื่อเพื่อลองหัวข้อเปรียบเทียบคู่ใหม่',
  },
};

export interface ScotlandPerformCompletionPayload {
  selectedEvidenceIds: string[];
  outline: ScotlandPerformOutline;
  speechPracticeMode: ScotlandPerformPracticeMode;
  questionPracticeStates: ScotlandPerformQaStates;
  reflectionState: ScotlandPerformReflectionState;
}

export function createEmptyScotlandPerformOutline(): ScotlandPerformOutline {
  return {
    introduction: '',
    similarity: '',
    difference: '',
    evidenceNotes: '',
    conclusion: '',
  };
}

export function sanitizeScotlandPerformSelectedEvidenceIds(
  raw: unknown,
): ScotlandLandmarkId[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const deduped = Array.from(
    new Set(
      raw.filter(
        (item): item is ScotlandLandmarkId =>
          typeof item === 'string' && VALID_SCOTLAND_PERFORM_EVIDENCE_IDS.has(item),
      ),
    ),
  );
  return deduped.length > 0 ? deduped : undefined;
}

export function areValidScotlandPerformEvidenceIds(raw: unknown): boolean {
  const sanitized = sanitizeScotlandPerformSelectedEvidenceIds(raw);
  return Boolean(sanitized && sanitized.length >= 2);
}

export function sanitizeScotlandPerformOutline(
  raw: unknown,
): ScotlandPerformOutline | undefined {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return undefined;
  const r = raw as Record<string, unknown>;
  const intro = typeof r.introduction === 'string' ? r.introduction.trim().slice(0, 300) : '';
  const similarity = typeof r.similarity === 'string' ? r.similarity.trim().slice(0, 320) : '';
  const difference = typeof r.difference === 'string' ? r.difference.trim().slice(0, 320) : '';
  const evidenceNotes =
    typeof r.evidenceNotes === 'string' ? r.evidenceNotes.trim().slice(0, 360) : '';
  const conclusion = typeof r.conclusion === 'string' ? r.conclusion.trim().slice(0, 300) : '';

  if (!intro && !similarity && !difference && !evidenceNotes && !conclusion) {
    return undefined;
  }

  return {
    introduction: intro,
    similarity,
    difference,
    evidenceNotes,
    conclusion,
  };
}

export function isValidScotlandPerformOutline(raw: unknown): raw is ScotlandPerformOutline {
  const sanitized = sanitizeScotlandPerformOutline(raw);
  if (!sanitized) return false;
  return (
    sanitized.introduction.length > 0 &&
    sanitized.similarity.length > 0 &&
    sanitized.difference.length > 0 &&
    sanitized.evidenceNotes.length > 0 &&
    sanitized.conclusion.length > 0
  );
}

export function isValidScotlandPerformPracticeMode(
  raw: unknown,
): raw is ScotlandPerformPracticeMode {
  return raw === 'recorded_mic' || raw === 'self_reported_no_mic';
}

export function sanitizeScotlandPerformQaStates(
  raw: unknown,
): ScotlandPerformQaStates | undefined {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return undefined;
  const r = raw as Record<string, unknown>;
  const next: ScotlandPerformQaStates = {};
  if (isValidScotlandPerformPracticeMode(r.qa_eilidh)) {
    next.qa_eilidh = r.qa_eilidh;
  }
  if (isValidScotlandPerformPracticeMode(r.qa_fiona)) {
    next.qa_fiona = r.qa_fiona;
  }
  return next.qa_eilidh || next.qa_fiona ? next : undefined;
}

export function areValidScotlandPerformQaStates(raw: unknown): boolean {
  const sanitized = sanitizeScotlandPerformQaStates(raw);
  if (!sanitized) return false;
  return (
    isValidScotlandPerformPracticeMode(sanitized.qa_eilidh) &&
    isValidScotlandPerformPracticeMode(sanitized.qa_fiona)
  );
}

export function isValidScotlandPerformReflectionState(
  raw: unknown,
): raw is ScotlandPerformReflectionState {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return false;
  const candidate = raw as Record<string, unknown>;
  if (typeof candidate.completedAt !== 'string' || candidate.completedAt.trim().length === 0) {
    return false;
  }
  if (
    typeof candidate.checks !== 'object' ||
    candidate.checks === null ||
    Array.isArray(candidate.checks)
  ) {
    return false;
  }
  const checks = candidate.checks as Record<string, unknown>;
  const booleansValid = SCOTLAND_PERFORM_REFLECTION_ITEMS.every(
    (item) => typeof checks[item.key] === 'boolean',
  );
  if (!booleansValid) return false;

  const anyChecked = SCOTLAND_PERFORM_REFLECTION_ITEMS.some(
    (item) => checks[item.key] === true,
  );
  return anyChecked;
}

export function sanitizeScotlandPerformReflectionState(
  raw: unknown,
): ScotlandPerformReflectionState | undefined {
  return isValidScotlandPerformReflectionState(raw) ? raw : undefined;
}

export function isValidScotlandPerformCompletionPayload(
  raw: unknown,
): raw is ScotlandPerformCompletionPayload {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return false;
  const p = raw as Record<string, unknown>;
  return (
    areValidScotlandPerformEvidenceIds(p.selectedEvidenceIds) &&
    isValidScotlandPerformOutline(p.outline) &&
    isValidScotlandPerformPracticeMode(p.speechPracticeMode) &&
    areValidScotlandPerformQaStates(p.questionPracticeStates) &&
    isValidScotlandPerformReflectionState(p.reflectionState)
  );
}
