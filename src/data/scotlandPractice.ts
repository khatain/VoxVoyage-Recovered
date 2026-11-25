import type {
  LocalizedText,
  ScotlandSpeakingReflectionState,
} from '../types/game';
import {
  SCOTLAND_LANDMARKS,
  SCOTLAND_STAGE_ACTIVITY_IDS,
  type ScotlandLandmarkId,
} from './scotlandWorld';

export const SCOTLAND_PRACTICE_ACTIVITY_ID = SCOTLAND_STAGE_ACTIVITY_IDS.practice;
export const SCOTLAND_PRACTICE_XP_REWARD = 50;

export type ScotlandPracticeSpeakerId = 'eilidh' | 'fiona';

export interface ScotlandPracticeSpeakerProfile {
  id: ScotlandPracticeSpeakerId;
  name: LocalizedText;
  role: LocalizedText;
  personality: LocalizedText;
  accentColor: string;
  voicePitch: number;
  voiceRate: number;
}

export const SCOTLAND_PRACTICE_SPEAKERS: Record<
  ScotlandPracticeSpeakerId,
  ScotlandPracticeSpeakerProfile
> = {
  eilidh: {
    id: 'eilidh',
    name: { en: 'Eilidh MacLeod', th: 'ไอลีด แม็กลอยด์' },
    role: { en: 'Scottish Student & Exhibition Co-Host', th: 'นักเรียนเจ้าภาพร่วมจัดนิทรรศการ' },
    personality: {
      en: 'Warm, curious, and excited to learn about daily life in Thailand.',
      th: 'อบอุ่น ช่างสงสัย และตื่นเต้นที่จะได้เรียนรู้ชีวิตประจำวันของไทย',
    },
    accentColor: '#3A7D6C',
    voicePitch: 1.06,
    voiceRate: 0.94,
  },
  fiona: {
    id: 'fiona',
    name: { en: 'Fiona Campbell', th: 'ฟิโอนา แคมป์เบลล์' },
    role: { en: 'Local Heritage Guide & Accuracy Coach', th: 'มัคคุเทศก์มรดกวัฒนธรรม' },
    personality: {
      en: 'Thoughtful storyteller focused on fair, evidence-based cultural comparisons.',
      th: 'นักเล่าเรื่องผู้ใส่ใจรายละเอียดและการเปรียบเทียบที่ถูกต้องตามหลักฐานจริง',
    },
    accentColor: '#7B5EA7',
    voicePitch: 0.98,
    voiceRate: 0.92,
  },
};

export interface ScotlandPracticeMission {
  id: ScotlandLandmarkId;
  order: number;
  title: LocalizedText;
  locationName: LocalizedText;
  primaryNpcId: ScotlandPracticeSpeakerId;
  secondaryNpcId?: ScotlandPracticeSpeakerId;
  question: LocalizedText;
  followUpQuestion?: LocalizedText;
  speakingGoal: LocalizedText;
  targetDurationNote?: LocalizedText;
  suggestedLanguage: string[];
  accuracyGuidanceNote: LocalizedText;
  sentenceFramesA2: LocalizedText[];
  sentenceFramesB1: LocalizedText[];
  modelAnswerA2: LocalizedText;
  modelAnswerB1: LocalizedText;
  recommendedDefaultLevel: 'a2' | 'b1';
  followUpModelHint?: LocalizedText;
  sandwichGuidance: {
    positive: LocalizedText;
    improvement: LocalizedText;
    nextStep: LocalizedText;
  };
  thankYouReply: LocalizedText;
}

export const EILIDH_PRACTICE_DIALOGUE = {
  intro: {
    en: "Our exhibition is almost ready! Let's practice explaining what Scotland and Thailand have in common and what makes them different.",
    th: 'นิทรรศการของเราใกล้พร้อมแล้ว! มาฝึกพูดอธิบายกันว่าสกอตแลนด์และไทยมีอะไรเหมือนกันและมีอะไรที่แตกต่างกันบ้าง',
  },
  inProgress: (doneCount: number, totalCount: number): LocalizedText => ({
    en: `You have completed ${doneCount} of ${totalCount} Highland cultural conversations! Visit the remaining spots to talk with Fiona and me before the exhibition opens.`,
    th: `คุณฝึกสนทนาวัฒนธรรมไฮแลนด์ครบ ${doneCount} จาก ${totalCount} จุดแล้ว! แวะไปยังจุดที่เหลือเพื่อคุยแลกเปลี่ยนกับฟิโอนาและฉันได้เลย`,
  }),
  completed: {
    en: 'Wonderful conversations! You explained both countries clearly using real evidence (+50 XP) and unlocked Stage 4: PERFORM!',
    th: 'การสนทนายอดเยี่ยมมาก! คุณอธิบายทั้งสองประเทศได้ชัดเจนด้วยหลักฐานจริง (+50 XP) และปลดล็อกด่านที่ 4: PERFORM แล้ว!',
  },
  accuracyTip: {
    en: 'Share real examples from your Journal and BUILD sentences—and remember that neither Scotland nor Thailand fits just one stereotype!',
    th: 'ใช้ตัวอย่างจริงจากสมุดนักสำรวจและประโยคในด่าน BUILD โดยหลีกเลี่ยงการเหมารวมว่าทุกคนในประเทศใช้ชีวิตเหมือนกันหมด',
  },
};

export const FIONA_PRACTICE_DIALOGUE = {
  accuracyGuide: {
    en: "Fiona's Cultural Accuracy Check: When comparing Scotland and Thailand, name real regions, materials, foods, or festivals—and speak naturally to communicate your meaning!",
    th: 'คำแนะนำด้านความถูกต้องจากฟิโอนา: เวลาพูดเปรียบเทียบไทย-สกอตแลนด์ ให้ยกตัวอย่างจริง เช่น สิ่งทอ อาหาร หรือเทศกาล แล้วพูดสื่อความหมายอย่างเป็นธรรมชาติ',
  },
};

export const SCOTLAND_PRACTICE_MISSIONS: ScotlandPracticeMission[] = [
  {
    id: 'highland_village_square',
    order: 1,
    title: {
      en: 'Mission 1 · Everyday Life Exchange',
      th: 'ภารกิจที่ 1 · แลกเปลี่ยนเรื่องชีวิตประจำวัน',
    },
    locationName: SCOTLAND_LANDMARKS[0].title,
    primaryNpcId: 'eilidh',
    question: {
      en: 'What is similar about everyday life in Scotland and Thailand?',
      th: 'ชีวิตประจำวันในสกอตแลนด์และประเทศไทยมีความคล้ายคลึงกันอย่างไร?',
    },
    speakingGoal: {
      en: 'Describe one defensible similarity using specific cultural evidence without claiming everyone lives identically.',
      th: 'อธิบายความเหมือนที่มีหลักฐานสนับสนุน 1 ประเด็น โดยไม่เหมารวมว่าทุกคนใช้ชีวิตเหมือนกันหมด',
    },
    suggestedLanguage: ['Both ... and ...'],
    accuracyGuidanceNote: {
      en: 'Avoid saying all towns or people are identical—highlight shared community gathering places like cafés, schools, and neighborhood squares alongside historic stone or temple heritage.',
      th: 'หลีกเลี่ยงการบอกว่าทุกเมืองเหมือนกันหมด ให้ยกตัวอย่างพื้นที่พบปะชุมชน เช่น ร้านกาแฟ โรงเรียน ลานหมู่บ้าน หรือวัดเคียงข้างชีวิตยุคใหม่',
    },
    sentenceFramesA2: [
      {
        en: 'Both Scotland and Thailand have old heritage and modern cafes.',
        th: 'ทั้งสกอตแลนด์และไทยต่างมีมรดกเก่าแก่และร้านกาแฟยุคใหม่',
      },
      {
        en: 'Both Highland villages and Thai towns have spaces where neighbors meet.',
        th: 'ทั้งหมู่บ้านไฮแลนด์และชุมชนไทยต่างมีพื้นที่พบปะของเพื่อนบ้าน',
      },
    ],
    sentenceFramesB1: [
      {
        en: 'Both Highland communities and Thai towns balance everyday routines like school and cafes with historic public gathering spaces.',
        th: 'ทั้งชุมชนไฮแลนด์และชุมชนไทยต่างผสานกิจวัตรประจำวันสมัยใหม่เข้ากับพื้นที่ชุมชนเก่าแก่',
      },
    ],
    modelAnswerA2: {
      en: 'Both Scotland and Thailand blend old buildings with modern daily life. For example, Highland village squares have historic stone cottages near local shops and cafes, and many Thai towns have temples near modern markets.',
      th: 'ทั้งสกอตแลนด์และไทยผสานอาคารเก่าแก่เข้ากับชีวิตประจำวันยุคใหม่ เช่น จัตุรัสไฮแลนด์มีบ้านหินใกล้ร้านค้าสมัยใหม่ ส่วนชุมชนไทยก็มีวัดใกล้ตลาดสมัยใหม่',
    },
    modelAnswerB1: {
      en: 'Although villages vary by region, both Scotland and Thailand preserve community gathering spaces within modern life—such as granite village squares with nearby cafes in the Highlands and neighborhood wat courtyards beside bustling Thai markets.',
      th: 'แม้แต่ละพื้นที่จะต่างกัน แต่ทั้งสกอตแลนด์และไทยต่างรักษาพื้นที่พบปะชุมชนไว้ในชีวิตยุคใหม่ เช่น จัตุรัสหมู่บ้านไฮแลนด์และลานวัดไทยใกล้ตลาดชุมชน',
    },
    recommendedDefaultLevel: 'a2',
    sandwichGuidance: {
      positive: {
        en: 'Warm exchange at Village Square! Linking everyday routines in both countries helps exhibition visitors feel a real human connection.',
        th: 'เริ่มต้นบทสนทนาที่จัตุรัสหมู่บ้านได้ดีมาก! การเชื่อมโยงกิจวัตรประจำวันช่วยให้ผู้ชมนิทรรศการเห็นภาพชีวิตจริงของทั้งสองประเทศ',
      },
      improvement: {
        en: 'Practice tip: After saying "Both Scotland and Thailand...", name one concrete community place (like cafes, schools, or village squares) so your point stays grounded in evidence.',
        th: 'คำแนะนำฝึกพูด: หลังพูดคำว่า "Both Scotland and Thailand..." ลองยกตัวอย่างสถานที่จริง 1 แห่ง เช่น ร้านกาแฟ โรงเรียน หรือจัตุรัสหมู่บ้าน เพื่อเพิ่มน้ำหนักให้คำอธิบาย',
      },
      nextStep: {
        en: 'Walk west to Tartan & Heritage Workshop—Fiona wants to compare textiles with you!',
        th: 'เดินไปทางตะวันตกที่เวิร์กชอปผ้าทาร์ทัน ฟิโอนารอพูดคุยเปรียบเทียบเรื่องผ้าพื้นเมืองกับคุณอยู่!',
      },
    },
    thankYouReply: {
      en: "Thank you! I love hearing how Thai towns also mix historic gathering places with cozy modern cafes—our exhibition guests will really connect with that.",
      th: 'ขอบคุณมากเลย! ฉันดีใจที่ได้รู้ว่าชุมชนไทยก็ผสานพื้นที่ประวัติศาสตร์เข้ากับชีวิตสมัยใหม่เหมือนกัน ผู้ชมนิทรรศการต้องชอบแน่ ๆ',
    },
  },
  {
    id: 'tartan_heritage_workshop',
    order: 2,
    title: {
      en: 'Mission 2 · Textile Heritage Talk',
      th: 'ภารกิจที่ 2 · สนทนาเรื่องมรดกสิ่งทอ',
    },
    locationName: SCOTLAND_LANDMARKS[1].title,
    primaryNpcId: 'fiona',
    question: {
      en: 'How are Scottish tartan and Thai Praewa silk similar and different?',
      th: 'ผ้าทาร์ทันของสกอตแลนด์และผ้าไหมแพรวาของไทยเหมือนกันและต่างกันอย่างไร?',
    },
    speakingGoal: {
      en: 'Explain one similarity and one difference using evidence (identity, weaving, materials, patterns, or occasions) without claiming they are identical.',
      th: 'อธิบายจุดที่เหมือนกัน 1 ข้อ และจุดที่ต่างกัน 1 ข้อ โดยอ้างอิงหลักฐาน (อัตลักษณ์ การทอ วัสดุ ลวดลาย หรือโอกาสสวมใส่)',
    },
    suggestedLanguage: ['similar to', 'different from'],
    accuracyGuidanceNote: {
      en: 'Remember: Tartan wool and Kalasin Praewa silk are distinct weaving arts—compare shared ceremonial pride alongside differences in warm wool vs. breathable silk and check vs. diamond motifs.',
      th: 'ข้อควรระวัง: ผ้าทาร์ทันขนสัตว์กับผ้าไหมแพรวามีเอกลักษณ์เฉพาะตัว ให้เทียบความภาคภูมิใจในงานพิธีที่คล้ายกันควบคู่กับความต่างของเนื้อผ้าและลวดลาย',
    },
    sentenceFramesA2: [
      {
        en: 'Scottish tartan is similar to Thai Praewa silk because people wear both at special ceremonies.',
        th: 'ผ้าทาร์ทันคล้ายกับผ้าไหมแพรวาเพราะผู้คนสวมใส่ในพิธีพิเศษเหมือนกัน',
      },
      {
        en: 'Warm tartan wool is different from light Thai Praewa silk.',
        th: 'ผ้าทาร์ทันขนสัตว์ที่อุ่นต่างจากผ้าไหมแพรวาของไทยที่โปร่งเบา',
      },
    ],
    sentenceFramesB1: [
      {
        en: 'Tartan weaving is similar to Kalasin Praewa silk in honoring regional identity, whereas thick Highland wool is different from breathable tropical silk with diamond motifs.',
        th: 'การทอผ้าทาร์ทันคล้ายกับผ้าไหมแพรวาในการเชิดชูอัตลักษณ์ท้องถิ่น ขณะที่ขนสัตว์หนาต่างจากผ้าไหมลายเพชรของเขตร้อน',
      },
    ],
    modelAnswerA2: {
      en: 'Scottish tartan is similar to Thai Praewa silk because both celebrate local heritage at weddings and festivals. However, thick tartan wool is different from light Praewa silk made for warm weather.',
      th: 'ผ้าทาร์ทันสกอตคล้ายกับผ้าไหมแพรวาเพราะทั้งคู่เชิดชูมรดกท้องถิ่นในงานแต่งและเทศกาล แต่ผ้าขนสัตว์ทาร์ทันต่างจากผ้าไหมแพรวาที่เบาสบายเหมาะกับอากาศร้อน',
    },
    modelAnswerB1: {
      en: 'In terms of cultural pride, Scottish tartan is similar to Thai Kalasin Praewa silk since families treasure both for weddings and ceremonies rather than everyday errands. Material and pattern differ clearly, though: wool check tartan traps Highland warmth, which is different from hand-woven silk with intricate diamond motifs.',
      th: 'ในแง่ความภาคภูมิใจ ผ้าทาร์ทันคล้ายกับผ้าไหมแพรวาเพราะเก็บไว้ใส่ในงานมงคลและพิธีสำคัญ แต่ต่างกันที่ทาร์ทันเป็นขนสัตว์ลายตารางกันหนาว ส่วนแพรวาเป็นผ้าไหมลายเพชรที่ระบายอากาศได้ดี',
    },
    recommendedDefaultLevel: 'a2',
    sandwichGuidance: {
      positive: {
        en: 'Thoughtful textile talk! Fiona loves how clearly you separated shared cultural meaning from climate-shaped fabric choices.',
        th: 'พูดคุยเรื่องสิ่งทอได้อย่างมีเหตุผล! ฟิโอนาชื่นชมที่คุณแยกความหมายทางวัฒนธรรมที่คล้ายกันออกจากเนื้อผ้าที่ต่างกันตามสภาพอากาศได้ชัดเจน',
      },
      improvement: {
        en: 'Practice tip: Pause slightly before "is different from" so your listener clearly hears the transition from similarity to contrast.',
        th: 'คำแนะนำฝึกพูด: ลองเว้นจังหวะสั้น ๆ ก่อนวลี "is different from" เพื่อให้ผู้ฟังแยกส่วนความเหมือนและความต่างได้อย่างชัดเจน',
      },
      nextStep: {
        en: 'Cross the square east to Highland Food Market—Eilidh is curious to compare Scottish and Thai snacks!',
        th: 'เดินข้ามจัตุรัสไปทางตะวันออกสู่ตลาดอาหารไฮแลนด์ ไอลีดอยากเปรียบเทียบขนมพื้นบ้านสกอตกับไทยกับคุณ!',
      },
    },
    thankYouReply: {
      en: 'Well explained! Both fabrics carry proud family stories, yet their wool checks and diamond silk show how weavers adapt to climate and tradition.',
      th: 'อธิบายได้ดีมากจ้ะ! ผ้าทั้งสองผืนต่างมีเรื่องราวแห่งความภาคภูมิใจ แต่ลายตารางขนสัตว์และไหมลายเพชรสะท้อนการปรับตัวกับภูมิอากาศที่ต่างกัน',
    },
  },
  {
    id: 'highland_food_market',
    order: 3,
    title: {
      en: 'Mission 3 · Food Culture Chat',
      th: 'ภารกิจที่ 3 · สนทนาเรื่องวัฒนธรรมอาหาร',
    },
    locationName: SCOTLAND_LANDMARKS[2].title,
    primaryNpcId: 'eilidh',
    question: {
      en: 'Can you compare a Scottish snack with a Thai snack?',
      th: 'คุณช่วยเปรียบเทียบของว่างสกอตแลนด์กับของว่างไทยสักอย่างได้ไหม?',
    },
    speakingGoal: {
      en: 'Compare specific snacks or ingredients and preparation without making sweeping universal claims about whole national cuisines.',
      th: 'เปรียบเทียบอาหารว่างเฉพาะอย่างทั้งด้านวัตถุดิบและวิธีทำ โดยไม่เหมารวมอาหารทั้งประเทศ',
    },
    suggestedLanguage: ['while', 'whereas'],
    accuracyGuidanceNote: {
      en: 'Stick to specific foods (e.g., baked butter shortbread or oatcakes vs. mango sticky rice or steamed rice treats) instead of claiming people only eat one kind of food.',
      th: 'ยกตัวอย่างเมนูเฉพาะเจาะจง (เช่น ชอร์ตเบรดอบหรือขนมปังข้าวโอ๊ต เทียบกับข้าวเหนียวมะม่วงหรือขนมไทยจากข้าวและกะทิ) แทนการพูดเหมารวมอาหารทั้งชาติ',
    },
    sentenceFramesA2: [
      {
        en: 'Scottish shortbread uses baked butter and flour, while Thai mango sticky rice uses sweet rice and coconut milk.',
        th: 'ชอร์ตเบรดสกอตใช้เนยและแป้งอบ ขณะที่ข้าวเหนียวมะม่วงใช้ข้าวเหนียวและกะทิ',
      },
      {
        en: 'Highland oatcakes are baked crisp grains, whereas Thai snacks often feature rice and tropical fruit.',
        th: 'ขนมปังข้าวโอ๊ตไฮแลนด์ทำจากธัญพืชอบกรอบ ส่วนขนมไทยมักใช้ข้าวและผลไม้เขตร้อน',
      },
    ],
    sentenceFramesB1: [
      {
        en: 'Baked Scottish shortbread highlights butter and cool-climate oats or wheat, while many traditional Thai snacks highlight fragrant jasmine rice, coconut cream, and fresh mango.',
        th: 'ชอร์ตเบรดสกอตแลนด์เด่นเรื่องเนยสดและการอบจากพืชเมืองหนาว ขณะที่ขนมไทยดั้งเดิมหลายชนิดใช้ข้าว กะทิ และผลไม้เมืองร้อน',
      },
    ],
    modelAnswerA2: {
      en: 'Scottish shortbread is a baked snack made with butter, sugar, and flour, while Thai mango sticky rice is prepared with steamed glutinous rice, coconut milk, and fresh mango.',
      th: 'ชอร์ตเบรดสกอตเป็นขนมอบที่ทำจากเนย น้ำตาล และแป้ง ขณะที่ข้าวเหนียวมะม่วงของไทยทำจากข้าวเหนียวนึ่ง กะทิ และมะม่วงสุก',
    },
    modelAnswerB1: {
      en: 'Both Scotland and Thailand enjoy sharing snacks with tea or family, though their ingredients differ: crisp Scottish oatcakes and shortbread are oven-baked from oats and butter, whereas Thai treats like mango sticky rice or steamed rice cakes highlight aromatic coconut milk and tropical fruit.',
      th: 'ทั้งสกอตแลนด์และไทยนิยมทานของว่างร่วมกับเครื่องดื่มหรือครอบครัว แต่ต่างที่วัตถุดิบและวิธีทำ เช่น ชอร์ตเบรดและข้าวโอ๊ตอบในเตา ขณะที่ขนมไทยอย่างข้าวเหนียวมะม่วงใช้การนึ่ง กะทิ และผลไม้เขตร้อน',
    },
    recommendedDefaultLevel: 'a2',
    sandwichGuidance: {
      positive: {
        en: 'Tasty and accurate comparison! Naming concrete ingredients like oats, butter, rice, and coconut milk makes your explanation vivid and fair.',
        th: 'เปรียบเทียบได้เห็นภาพและถูกต้องมาก! การระบุวัตถุดิบจริงอย่างข้าวโอ๊ต เนย ข้าวเหนียว และกะทิ ทำให้ผู้ฟังเข้าใจชัดเจน',
      },
      improvement: {
        en: 'Practice tip: Try contrasting both the main ingredient AND how it is prepared ("is baked..." while "...is steamed with coconut milk") for stronger clarity.',
        th: 'คำแนะนำฝึกพูด: ลองเปรียบเทียบทั้งวัตถุดิบหลักและวิธีปรุง เช่น การอบกับเตา เทียบกับการนึ่งกับกะทิ เพื่อให้ประโยคสมบูรณ์ยิ่งขึ้น',
      },
      nextStep: {
        en: 'Head northwest to Highland Games Festival Ground where Fiona is waiting by the tartan pennants!',
        th: 'เดินไปทางตะวันตกเฉียงเหนือสู่ลานเทศกาลไฮแลนด์เกมส์ ฟิโอนารอคุณอยู่ข้างเวทีดนตรี!',
      },
    },
    thankYouReply: {
      en: "Oh, mango sticky rice with coconut milk sounds delicious! Now I can picture how cool-weather baking compares with Thailand's fresh tropical ingredients.",
      th: 'ว้าว ข้าวเหนียวมะม่วงกับกะทิฟังดูน่าอร่อยมากเลย! ตอนนี้ฉันเห็นภาพชัดเจนเลยว่าขนมอบเมืองหนาวต่างจากวัตถุดิบเขตร้อนของไทยยังไง',
    },
  },
  {
    id: 'highland_games_ground',
    order: 4,
    title: {
      en: 'Mission 4 · Festival Exchange',
      th: 'ภารกิจที่ 4 · แลกเปลี่ยนเรื่องงานเทศกาล',
    },
    locationName: SCOTLAND_LANDMARKS[3].title,
    primaryNpcId: 'fiona',
    question: {
      en: 'How are Highland Games different from a festival in Thailand?',
      th: 'เทศกาลไฮแลนด์เกมส์แตกต่างจากงานเทศกาลในประเทศไทยอย่างไร?',
    },
    speakingGoal: {
      en: 'Choose a specific Thai festival (such as Songkran or Loy Krathong) and explain meaningful similarities or differences with concrete cultural details.',
      th: 'เลือกเทศกาลไทยเฉพาะอย่าง (เช่น สงกรานต์ หรือ ลอยกระทง) และอธิบายความเหมือนหรือความต่างอย่างเป็นรูปธรรม',
    },
    suggestedLanguage: ['while', 'unlike', 'whereas'],
    accuracyGuidanceNote: {
      en: 'Remember shared community spirit! Both festivals gather neighbors and pass down stories—while activities, music (bagpipes/fiddles), and season/water traditions differ.',
      th: 'อย่าลืมความสามัคคีที่คล้ายกัน ทั้งสองเทศกาลรวมชุมชนและส่งต่อเรื่องราว แต่ต่างกันที่กิจกรรม ดนตรี และประเพณีตามฤดูกาล',
    },
    sentenceFramesA2: [
      {
        en: 'Unlike Songkran in Thailand, Highland Games feature bagpipes and outdoor sports.',
        th: 'ต่างจากเทศกาลสงกรานต์ในไทย ไฮแลนด์เกมส์มีดนตรีปี่สกอตและกีฬาพื้นบ้านกลางแจ้ง',
      },
      {
        en: 'Scottish Highland Games highlight summer athletics, while Loy Krathong floats candlelit krathongs on rivers.',
        th: 'ไฮแลนด์เกมส์เด่นเรื่องกีฬากลางแจ้งฤดูร้อน ขณะที่ลอยกระทงลอยกระทงจุดเทียนบนสายน้ำ',
      },
    ],
    sentenceFramesB1: [
      {
        en: 'Both Highland Games and Thai festivals unite families outdoors, whereas Songkran centers on April water blessings and Highland Games spotlight summer piping and caber tossing.',
        th: 'ทั้งไฮแลนด์เกมส์และเทศกาลไทยต่างรวมครอบครัวไว้ด้วยกัน แต่สงกรานต์เน้นการสรงน้ำในเดือนเมษายน ส่วนไฮแลนด์เกมส์เด่นเรื่องปี่สกอตและการโยนซุง',
      },
    ],
    modelAnswerA2: {
      en: 'Unlike Songkran water celebrations in April, Scottish Highland Games feature bagpipe bands, fiddles, and summer tossing games. However, both festivals bring families together outdoors.',
      th: 'ต่างจากการเล่นน้ำวันสงกรานต์ในเดือนเมษายน ไฮแลนด์เกมส์มีวงปี่สกอต ฟิดเดิล และการแข่งขันฤดูร้อน แต่ทั้งสองเทศกาลก็รวมครอบครัวมาสนุกด้วยกัน',
    },
    modelAnswerB1: {
      en: 'While both Highland Games and Thai festivals like Loy Krathong bring generations together in joyful community spirit, their traditions contrast vividly: Highland Games fill summer glens with bagpipe music and athletics, whereas Loy Krathong illuminates warm Thai rivers with candlelit krathongs in the evening.',
      th: 'แม้ทั้งไฮแลนด์เกมส์และเทศกาลลอยกระทงของไทยจะเชื่อมผู้คนต่างวัยเข้าด้วยกัน แต่ประเพณีต่างกันชัดเจน โดยไฮแลนด์เกมส์เต็มไปด้วยปี่สกอตและกีฬาฤดูร้อน ส่วนลอยกระทงประดับแม่น้ำไทยยามค่ำคืนด้วยแสงเทียนจากกระทง',
    },
    recommendedDefaultLevel: 'b1',
    sandwichGuidance: {
      positive: {
        en: 'Vibrant festival comparison! Naming a real Thai celebration like Songkran or Loy Krathong gave Fiona a vivid picture.',
        th: 'เปรียบเทียบเทศกาลได้มีชีวิตชีวามาก! การยกตัวอย่างสงกรานต์หรือลอยกระทงช่วยให้ฟิโอนาเห็นภาพเทศกาลไทยอย่างแจ่มแจ้ง',
      },
      improvement: {
        en: 'Practice tip: Try pairing one contrast connector ("Unlike..." or "whereas") with one shared human detail ("both unite families outdoors") for balanced depth.',
        th: 'คำแนะนำฝึกพูด: ลองเชื่อมคำแสดงความต่าง ("Unlike..." หรือ "whereas") เข้ากับจุดร่วมของชุมชน ("both unite families") เพื่อให้คำตอบสมดุลยิ่งขึ้น',
      },
      nextStep: {
        en: 'Cross the stone footbridge east to Lochside Castle Viewpoint—Eilidh and Fiona are ready for the final Cultural Exchange Challenge!',
        th: 'เดินข้ามสะพานหินไปทางตะวันออกสู่จุดชมวิวปราสาทริมทะเลสาบ ไอลีดและฟิโอนารอคุยสรุปในภารกิจสุดท้ายแล้ว!',
      },
    },
    thankYouReply: {
      en: 'Loy Krathong candlelit rivers and Songkran water blessings sound extraordinary! Putting them beside summer piping really captures how festivals honor place and season.',
      th: 'เทศกาลลอยกระทงและสงกรานต์ฟังดูน่าทึ่งมาก! การนำมาเทียบกับดนตรีปี่สกอตฤดูร้อนช่วยสะท้อนเสน่ห์ตามฤดูกาลของทั้งสองประเทศได้ดีมากเลย',
    },
  },
  {
    id: 'lochside_castle_viewpoint',
    order: 5,
    title: {
      en: 'Mission 5 · Cultural Exchange Challenge',
      th: 'ภารกิจที่ 5 · ภารกิจแลกเปลี่ยนวัฒนธรรม',
    },
    locationName: SCOTLAND_LANDMARKS[4].title,
    primaryNpcId: 'eilidh',
    secondaryNpcId: 'fiona',
    question: {
      en: 'What have you discovered about Scotland and Thailand?',
      th: 'คุณได้ค้นพบอะไรบ้างเกี่ยวกับสกอตแลนด์และประเทศไทย?',
    },
    followUpQuestion: {
      en: 'Which cultural difference did you find most interesting, and why?',
      th: 'ความแตกต่างทางวัฒนธรรมข้อใดที่คุณคิดว่าน่าสนใจที่สุด และเพราะเหตุใด?',
    },
    speakingGoal: {
      en: 'Produce a short independent cultural comparison (30–60s target, flexible) covering >=1 similarity, >=1 difference, and >=1 concrete example, then answer Fiona’s follow-up.',
      th: 'พูดเปรียบเทียบอย่างอิสระ (แนะนำ 30–60 วินาที ปรับตามระดับผู้เรียน) ให้ครบอย่างน้อยความเหมือน 1 ข้อ ความต่าง 1 ข้อ ตัวอย่างจริง 1 ข้อ แล้วตอบคำถามติดตามของฟิโอนา',
    },
    targetDurationNote: {
      en: 'Suggested target: 30–60 seconds (flexible for your comfort) · Include 1 similarity, 1 difference & 1 real example',
      th: 'เวลาที่แนะนำ: 30–60 วินาที (ยืดหยุ่นตามความถนัด) · มีความเหมือน ความต่าง และตัวอย่างจริง',
    },
    suggestedLanguage: ['Both ... and ...', 'similar to', 'different from', 'while', 'whereas', 'unlike'],
    accuracyGuidanceNote: {
      en: 'Draw freely from all 5 Journal cards and BUILD sentences—show pride in real regional traditions alongside modern life in both countries.',
      th: 'หยิบข้อมูลจากทั้ง 5 การ์ดในสมุดนักสำรวจและด่าน BUILD มาเชื่อมโยงได้เลย โดยสะท้อนทั้งมรดกวัฒนธรรมและชีวิตสมัยใหม่',
    },
    sentenceFramesA2: [
      {
        en: 'I discovered that both Scotland and Thailand value community traditions. For example, tartan weaving is similar to Thai Praewa silk, while Scottish lochside castles are different from golden Thai temples.',
        th: 'ฉันพบว่าทั้งสกอตแลนด์และไทยต่างให้ความสำคัญกับประเพณีชุมชน เช่น ผ้าทาร์ทันคล้ายกับผ้าไหมแพรวา ส่วนปราสาทริมทะเลสาบต่างจากวัดสีทองของไทย',
      },
    ],
    sentenceFramesB1: [
      {
        en: 'Throughout my Highland exploration, I noticed that both Scotland and Thailand preserve heritage within modern towns—similar to how tartan and Praewa silk express regional pride—whereas Highland foods, summer games, and stone lochside castles contrast with Thailand’s tropical markets, Songkran, and riverside temples.',
        th: 'จากการสำรวจ ฉันพบว่าทั้งสกอตแลนด์และไทยอนุรักษ์มรดกท่ามกลางชีวิตยุคใหม่ เช่น ผ้าทาร์ทันและไหมแพรวา ส่วนอาหาร เทศกาลฤดูร้อน และปราสาทริมทะเลสาบแตกต่างจากตลาดเขตร้อน สงกรานต์ และวัดไทย',
      },
    ],
    modelAnswerA2: {
      en: 'I discovered that both Scotland and Thailand mix historic heritage with modern everyday life. Scottish tartan weaving is similar to Thai Praewa silk because families wear them proudly at celebrations. At the same time, Scotland preserves cool stone castles beside mountain lochs and serves oatcakes, while Thailand has golden riverside temples and jasmine rice dishes.',
      th: 'ฉันค้นพบว่าทั้งสกอตแลนด์และไทยผสานมรดกเก่าแก่เข้ากับชีวิตยุคใหม่ ผ้าทาร์ทันคล้ายกับผ้าไหมแพรวาเพราะสวมใส่ในโอกาสพิเศษ แต่สกอตแลนด์มีปราสาทหินริมทะเลสาบและขนมปังข้าวโอ๊ต ขณะที่ไทยมีวัดสีทองและอาหารจากข้าวหอมมะลิ',
    },
    modelAnswerB1: {
      en: 'Looking across the loch, I discovered that both Scotland and Thailand honor regional traditions inside vibrant modern communities. Just like villagers gather in granite Highland squares near cafes, Thai neighborhoods center around local plazas and markets. Yet climate and history shape memorable differences: thick tartan wool, oatcakes, and summer Highland Games belong to cool glens beside stone castles, whereas breathable Kalasin Praewa silk, jasmine rice, Songkran, and gilded riverside temples reflect Thailand’s warm culture.',
      th: 'มองข้ามทะเลสาบแห่งนี้ ฉันพบว่าทั้งสกอตแลนด์และไทยต่างเชิดชูประเพณีท้องถิ่นท่ามกลางชุมชนยุคใหม่ เช่น จัตุรัสหินกับร้านกาแฟและลานตลาดในไทย แต่ภูมิอากาศและประวัติศาสตร์สร้างความต่างที่น่าประทับใจ ทั้งผ้าทาร์ทัน ข้าวโอ๊ต ปราสาทหิน กับผ้าไหมแพรวา ข้าวหอมมะลิ และวัดริมแม่น้ำของไทย',
    },
    recommendedDefaultLevel: 'b1',
    followUpModelHint: {
      en: 'Follow-up frame: "I found the contrast between ___ and ___ most interesting because ___."',
      th: 'โครงสร้างตอบคำถามติดตาม: "I found the contrast between ___ and ___ most interesting because ___."',
    },
    sandwichGuidance: {
      positive: {
        en: 'Strong independent synthesis at Lochside Castle! Combining Journal facts with your own comparison voice brings the whole exhibition together.',
        th: 'สังเคราะห์ความรู้ได้ยอดเยี่ยมมากที่ปราสาทริมทะเลสาบ! การเชื่อมหลักฐานจากสมุดนักสำรวจเข้ากับมุมมองของคุณทำให้นิทรรศการสมบูรณ์แบบ',
      },
      improvement: {
        en: 'Practice tip: In Fiona’s follow-up ("Which cultural difference did you find most interesting, and why?"), give one clear reason starting with "because..." to deepen your explanation.',
        th: 'คำแนะนำฝึกพูด: ในการตอบคำถามติดตามของฟิโอนา ลองให้เหตุผลที่ชัดเจนขึ้นต้นด้วย "because..." เพื่อขยายความคิดเห็นให้ลึกซึ้งยิ่งขึ้น',
      },
      nextStep: {
        en: 'Return to Eilidh at Highland Village Square—Stage 4: PERFORM is now unlocked (+50 XP earned)!',
        th: 'กลับไปพบไอลีดที่จัตุรัสหมู่บ้านได้เลย ด่านที่ 4: PERFORM ปลดล็อกเรียบร้อย (+50 XP)!',
      },
    },
    thankYouReply: {
      en: "What an inspiring exchange! Listening to your real comparison of Scotland and Thailand makes us so excited for Stage 4: PERFORM—our exhibition spotlight is ready for you!",
      th: 'เป็นการแลกเปลี่ยนที่สร้างแรงบันดาลใจมาก! การฟังคุณเปรียบเทียบสกอตแลนด์และไทยด้วยข้อมูลจริงทำให้พวกเราตื่นเต้นกับด่านที่ 4: PERFORM สุด ๆ เลย!',
    },
  },
];

export function getScotlandPracticeMission(
  id: string,
): ScotlandPracticeMission | undefined {
  return SCOTLAND_PRACTICE_MISSIONS.find((m) => m.id === id);
}

export function isValidScotlandReflectionState(
  raw: unknown,
): raw is ScotlandSpeakingReflectionState {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return false;
  const obj = raw as Record<string, unknown>;
  if (
    obj.practiceMode !== 'recorded_mic' &&
    obj.practiceMode !== 'self_reported_no_mic'
  ) {
    return false;
  }
  if (!obj.checks || typeof obj.checks !== 'object' || Array.isArray(obj.checks)) {
    return false;
  }
  const c = obj.checks as Record<string, unknown>;
  if (
    typeof c.comparedCultures !== 'boolean' ||
    typeof c.usedSpecificExample !== 'boolean' ||
    typeof c.explainedSimilarityOrDifference !== 'boolean' ||
    typeof c.spokeClearly !== 'boolean'
  ) {
    return false;
  }
  if (
    !c.comparedCultures &&
    !c.usedSpecificExample &&
    !c.explainedSimilarityOrDifference &&
    !c.spokeClearly
  ) {
    return false;
  }
  if (obj.followUpPracticed !== undefined && typeof obj.followUpPracticed !== 'boolean') {
    return false;
  }
  if (typeof obj.completedAt !== 'string' || obj.completedAt.length < 4) {
    return false;
  }
  return true;
}
