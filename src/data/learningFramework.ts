import type {
  LearningStageDefinition,
  MiniGameSpec,
  MissionDefinition,
  RouteDefinition,
} from '../types/game';

export const LEARNING_STAGES: LearningStageDefinition[] = [
  {
    id: 'discover',
    order: 1,
    code: 'STAGE 01',
    name: { en: 'Discover', th: 'สำรวจคำศัพท์และบริบท' },
    subtitle: {
      en: 'Presentation & Vocabulary Acquisition',
      th: 'เรียนรู้คำศัพท์จากบริบทจริงพร้อมเสียงต้นแบบ',
    },
    description: {
      en: 'Explore contextual vocabulary with visuals, pronunciation models, Thai meanings, sample sentences, and the mission communication goal.',
      th: 'เรียนรู้คำศัพท์ในสถานการณ์จริง ดูภาพประกอบ ฟังการออกเสียง อ่านคำแปลภาษาไทย และเข้าใจเป้าหมายการสื่อสาร',
    },
    learnerActions: [
      { en: 'Explore contextual vocabulary', th: 'สำรวจคำศัพท์ในบริบท' },
      { en: 'Listen to pronunciation models', th: 'ฟังเสียงต้นแบบการออกเสียง' },
      { en: 'Study Thai support & sample sentences', th: 'ศึกษาความหมายไทยและประโยคตัวอย่าง' },
    ],
    accentColor: '#24B8B0',
  },
  {
    id: 'build',
    order: 2,
    code: 'STAGE 02',
    name: { en: 'Build', th: 'สร้างโครงสร้างประโยค' },
    subtitle: {
      en: 'Guided Sentence Construction',
      th: 'ฝึกประกอบประโยคและโครงสร้างภาษา',
    },
    description: {
      en: 'Combine target vocabulary, arrange sentence components, practice grammatical patterns, and assemble meaningful expressions using sentence starters.',
      th: 'นำคำศัพท์มาเรียบเรียงเป็นประโยค ฝึกโครงสร้างไวยากรณ์ที่จำเป็น และใช้โครงประโยคเริ่มต้นอย่างมีความหมาย',
    },
    learnerActions: [
      { en: 'Arrange sentence components', th: 'จัดเรียงส่วนประกอบประโยค' },
      { en: 'Practice grammatical patterns', th: 'ฝึกใช้โครงสร้างภาษาที่ถูกต้อง' },
      { en: 'Build complete expressions', th: 'สร้างประโยคสื่อสารที่สมบูรณ์' },
    ],
    accentColor: '#F2C66D',
  },
  {
    id: 'practice',
    order: 3,
    code: 'STAGE 03',
    name: { en: 'Practice', th: 'ฝึกซ้อมการพูดแบบมีตัวช่วย' },
    subtitle: {
      en: 'Guided Speaking Rehearsal',
      th: 'ซ้อมพูดตามแบบอย่าง บันทึกเสียง และทบทวน',
    },
    description: {
      en: 'Listen to model responses, rehearse target expressions with optional non-penalizing hints, record your voice, and replay to refine delivery.',
      th: 'ฟังตัวอย่างคำตอบ ฝึกพูดโดยมีคำใบ้ช่วยเหลือได้ตลอดเวลา บันทึกเสียง และฟังย้อนหลังเพื่อพัฒนาตนเอง',
    },
    learnerActions: [
      { en: 'Listen to model responses', th: 'ฟังตัวอย่างการตอบโต้' },
      { en: 'Use optional hints safely', th: 'ใช้คำใบ้ได้โดยไม่เสีย XP สะสม' },
      { en: 'Record & replay rehearsal audio', th: 'บันทึกเสียงและฟังทบทวน' },
    ],
    accentColor: '#FF9478',
  },
  {
    id: 'perform',
    order: 4,
    code: 'STAGE 04',
    name: { en: 'Perform', th: 'ลงมือสื่อสารจริง' },
    subtitle: {
      en: 'Independent Speaking Production',
      th: 'ผลิตบทพูดด้วยตนเองในภารกิจจำลอง',
    },
    description: {
      en: 'Complete the country communication task independently, produce an original spoken response, reflect on performance, and earn your Passport Stamp.',
      th: 'ปฏิบัติภารกิจการพูดด้วยตนเองอย่างอิสระ สะท้อนผลการเรียนรู้ รับข้อเสนอแนะ และรับตราประทับพาสปอร์ต',
    },
    learnerActions: [
      { en: 'Deliver original spoken response', th: 'พูดสื่อสารด้วยตนเองในสถานการณ์จริง' },
      { en: 'Reflect with Sandwich Feedback', th: 'ทบทวนจุดแข็งและจุดพัฒนา' },
      { en: 'Earn Passport Stamp & rewards', th: 'รับตราประทับและรางวัลประจำประเทศ' },
    ],
    accentColor: '#F2C66D',
  },
];

export const MINI_GAME_LIBRARY: MiniGameSpec[] = [
  {
    id: 'word_detective',
    number: 1,
    category: 'vocabulary',
    title: { en: 'Word Detective', th: 'นักสืบคำศัพท์' },
    objective: {
      en: 'Match context clues from the 3D scene to target English vocabulary.',
      th: 'เชื่อมโยงเบาะแสจากบริบทในฉากเข้ากับคำศัพท์ภาษาอังกฤษ',
    },
    stageFit: ['discover'],
    accessibilityNote: {
      en: 'Full keyboard focus navigation + Thai clue toggle.',
      th: 'รองรับคีย์บอร์ดเต็มรูปแบบและปุ่มเปิดคำใบ้ภาษาไทย',
    },
  },
  {
    id: 'vocab_maze',
    number: 2,
    category: 'vocabulary',
    title: { en: 'Vocab Maze', th: 'เขาวงกตคำศัพท์' },
    objective: {
      en: 'Navigate forks in a travel path by choosing accurate word definitions.',
      th: 'เลือกเส้นทางที่ถูกต้องตามความหมายของคำศัพท์',
    },
    stageFit: ['discover'],
    accessibilityNote: {
      en: 'Arrow keys / WASD plus accessible button path choices.',
      th: 'ใช้ปุ่มลูกศรหรือปุ่มตัวเลือกบนหน้าจอได้',
    },
  },
  {
    id: 'memory_flip',
    number: 3,
    category: 'vocabulary',
    title: { en: 'Memory Flip', th: 'พลิกป้ายจับคู่ความจำ' },
    objective: {
      en: 'Pair English target words with visual cues or Thai meanings.',
      th: 'จับคู่คำศัพท์ภาษาอังกฤษกับภาพหรือความหมายภาษาไทย',
    },
    stageFit: ['discover'],
    accessibilityNote: {
      en: 'Screen-reader card state announcements and reduced-motion flip.',
      th: 'รองรับโหมดลดการเคลื่อนไหวและตัวอ่านหน้าจอ',
    },
  },
  {
    id: 'word_hunter',
    number: 4,
    category: 'vocabulary',
    title: { en: 'Word Hunter', th: 'นักล่าคำสำคัญ' },
    objective: {
      en: 'Spot and collect target vocabulary embedded in authentic cultural signage.',
      th: 'ค้นหาคำศัพท์เป้าหมายจากป้ายและองค์ประกอบทางวัฒนธรรม',
    },
    stageFit: ['discover'],
    accessibilityNote: {
      en: '2D accessible list selector synchronized with 3D hotspots.',
      th: 'มีรายการแบบ 2D ควบคู่กับจุดโต้ตอบในฉาก 3D',
    },
  },
  {
    id: 'word_catcher',
    number: 5,
    category: 'vocabulary',
    title: { en: 'Word Catcher', th: 'เก็บคำศัพท์ตามหมวด' },
    objective: {
      en: 'Filter and catch words belonging to a target semantic group.',
      th: 'คัดแยกและเก็บคำศัพท์ที่อยู่ในหมวดหมู่เป้าหมาย',
    },
    stageFit: ['discover'],
    accessibilityNote: {
      en: 'Adjustable speed & untimed accessible practice mode.',
      th: 'ปรับความเร็วและเลือกโหมดไม่จับเวลาได้',
    },
  },
  {
    id: 'word_smash',
    number: 6,
    category: 'vocabulary',
    title: { en: 'Word Smash', th: 'ทลายบล็อกคำศัพท์' },
    objective: {
      en: 'Break synonym or category blocks matching the spoken prompt.',
      th: 'เลือกบล็อกคำศัพท์ที่มีความหมายสอดคล้องกับโจทย์',
    },
    stageFit: ['discover'],
    accessibilityNote: {
      en: 'Keyboard numeric shortcuts (1–4) + visual caption prompt.',
      th: 'กดปุ่มตัวเลข 1–4 และมีคำบรรยายประกอบ',
    },
  },
  {
    id: 'mystery_box',
    number: 7,
    category: 'vocabulary',
    title: { en: 'Mystery Box', th: 'กล่องปริศนาคำศัพท์' },
    objective: {
      en: 'Infer mystery cultural items from progressive English descriptive clues.',
      th: 'ทายสิ่งของทางวัฒนธรรมจากคำบรรยายภาษาอังกฤษทีละขั้น',
    },
    stageFit: ['discover', 'build'],
    accessibilityNote: {
      en: 'Audio + written clues with unlimited non-penalizing hint reveals.',
      th: 'มีทั้งเสียงและข้อความ พร้อมคำใบ้ที่ไม่หักคะแนนสะสม',
    },
  },
  {
    id: 'word_maze',
    number: 8,
    category: 'vocabulary',
    title: { en: 'Word Maze', th: 'เส้นทางเชื่อมต่อคำ' },
    objective: {
      en: 'Connect thematic vocabulary chains to unlock a route across the map.',
      th: 'เชื่อมโยงกลุ่มคำศัพท์ที่เกี่ยวข้องเพื่อเปิดเส้นทางภารกิจ',
    },
    stageFit: ['discover'],
    accessibilityNote: {
      en: 'Grid keyboard traversal with clear focus outlines.',
      th: 'ควบคุมผ่านตารางด้วยคีย์บอร์ดได้ชัดเจน',
    },
  },
  {
    id: 'word_association',
    number: 9,
    category: 'vocabulary',
    title: { en: 'Word Association', th: 'เชื่อมโยงความสัมพันธ์คำ' },
    objective: {
      en: 'Link collocations, adjectives, and cultural nouns naturally.',
      th: 'จับคู่คำคุณศัพท์ คำกริยา และคำนามที่ใช้ร่วมกันอย่างเป็นธรรมชาติ',
    },
    stageFit: ['discover', 'build'],
    accessibilityNote: {
      en: 'Click-to-pair alternative to drag-and-drop.',
      th: 'เลือกคลิกจับคู่แทนการลากวางได้',
    },
  },
  {
    id: 'listen_and_pick',
    number: 10,
    category: 'vocabulary',
    title: { en: 'Listen and Pick', th: 'ฟังแล้วเลือกให้ตรง' },
    objective: {
      en: 'Listen to NPC pronunciation models and identify matching visual objects.',
      th: 'ฟังเสียงต้นแบบแล้วเลือกภาพหรือคำศัพท์ที่ตรงกัน',
    },
    stageFit: ['discover'],
    accessibilityNote: {
      en: 'Replay button, speaking-rate control, and optional caption toggle.',
      th: 'เล่นซ้ำ ปรับความเร็วเสียง และเปิดคำบรรยายได้',
    },
  },
  {
    id: 'sentence_train',
    number: 11,
    category: 'sentence_building',
    title: { en: 'Sentence Train', th: 'ขบวนรถไฟเรียงประโยค' },
    objective: {
      en: 'Order word and phrase carriages into grammatically accurate sentences.',
      th: 'เรียงโบกี้คำและวลีให้เป็นประโยคภาษาอังกฤษที่ถูกต้องตามหลักไวยากรณ์',
    },
    stageFit: ['build'],
    accessibilityNote: {
      en: 'Tap/keyboard reorder controls with instant grammar scaffolding.',
      th: 'คลิกหรือใช้คีย์บอร์ดจัดลำดับคำได้สะดวก',
    },
  },
  {
    id: 'magic_spell_maker',
    number: 12,
    category: 'sentence_building',
    title: { en: 'Magic Spell Maker', th: 'ปรุงสูตรประโยคสื่อสาร' },
    objective: {
      en: 'Combine sentence starters, connectors, and target vocabulary slots.',
      th: 'ประกอบโครงประโยคเริ่มต้น คำเชื่อม และคำศัพท์เป้าหมายเข้าด้วยกัน',
    },
    stageFit: ['build'],
    accessibilityNote: {
      en: 'Clear slot labels in EN/TH with audio preview of the built sentence.',
      th: 'ระบุหน้าที่ของแต่ละช่องเป็น EN/TH พร้อมฟังเสียงประโยคที่สร้าง',
    },
  },
  {
    id: 'mystery_card_speaking',
    number: 13,
    category: 'speaking',
    title: { en: 'Mystery Card Speaking', th: 'สุ่มการ์ดฝึกพูด' },
    objective: {
      en: 'Draw a scenario prompt card and rehearse a structured spoken response.',
      th: 'เปิดการ์ดสถานการณ์แล้วซ้อมพูดตอบตามโครงสร้างที่กำหนด',
    },
    stageFit: ['practice'],
    accessibilityNote: {
      en: 'Includes no-microphone text-rehearsal & model audio alternative.',
      th: 'มีทางเลือกฝึกซ้อมเมื่อไม่สะดวกใช้ไมโครโฟน',
    },
  },
  {
    id: 'magic_speech_bubble',
    number: 14,
    category: 'speaking',
    title: { en: 'Magic Speech Bubble', th: 'บอลลูนคำพูดจำลอง' },
    objective: {
      en: 'Fill and speak key conversational phrases inside live NPC dialogue bubbles.',
      th: 'เติมและฝึกพูดวลีสำคัญภายในกรอบสนทนาโต้ตอบกับ NPC',
    },
    stageFit: ['practice'],
    accessibilityNote: {
      en: 'Progressive scaffolded hints + playback comparison.',
      th: 'มีคำใบ้แบบค่อยเป็นค่อยไปและฟังเทียบกับเสียงต้นแบบได้',
    },
  },
  {
    id: 'npc_conversation_chain',
    number: 15,
    category: 'speaking',
    title: { en: 'NPC Conversation Chain', th: 'ห่วงโซ่บทสนทนากับ NPC' },
    objective: {
      en: 'Sustain multi-turn dialogue exchanges reacting to NPC cues.',
      th: 'โต้ตอบบทสนทนาต่อเนื่องหลายรอบตามคำถามและปฏิกิริยาของ NPC',
    },
    stageFit: ['practice', 'perform'],
    accessibilityNote: {
      en: 'Transcript support and branch summary accessible via keyboard.',
      th: 'แสดงข้อความสนทนาและควบคุมด้วยคีย์บอร์ดได้',
    },
  },
  {
    id: 'spot_and_speak',
    number: 16,
    category: 'country_special',
    title: { en: 'Spot & Speak', th: 'สังเกตจุดเด่นแล้วบรรยาย' },
    objective: {
      en: 'Inspect country-specific 3D diorama landmarks and describe details aloud.',
      th: 'สำรวจจุดสำคัญในฉากจำลองประจำประเทศแล้วบรรยายรายละเอียดด้วยตนเอง',
    },
    stageFit: ['practice', 'perform'],
    accessibilityNote: {
      en: 'Synchronized 2D landmark cards for non-WebGL or keyboard users.',
      th: 'มีแผ่นภาพจุดสำคัญแบบ 2D สำหรับผู้ไม่ใช้ WebGL หรือใช้คีย์บอร์ด',
    },
  },
];

export const MISSIONS: MissionDefinition[] = [
  {
    id: 'mission_india_jaipur',
    countryId: 'india',
    title: { en: 'Pink City Architectural Tour', th: 'นำชมสถาปัตยกรรมนครสีชมพู' },
    cefrLevel: 'A2',
    languageFunctions: ['TO_DESCRIBE'],
    stages: [
      {
        stageId: 'discover',
        objective: {
          en: 'Acquire descriptive adjectives, materials, and Jaipur landmark vocabulary.',
          th: 'เรียนรู้คำคุณศัพท์บรรยายลักษณะ วัสดุ และคำศัพท์สถานที่ในชัยปุระ',
        },
        plannedMiniGames: ['word_detective', 'listen_and_pick'],
        estimatedMinutes: 4,
      },
      {
        stageId: 'build',
        objective: {
          en: 'Construct descriptive noun phrases and location sentences.',
          th: 'ฝึกเรียงประโยคบรรยายลักษณะและตำแหน่งของสถานที่',
        },
        plannedMiniGames: ['sentence_train'],
        estimatedMinutes: 4,
      },
      {
        stageId: 'practice',
        objective: {
          en: 'Rehearse describing landmarks with Aarav using Spot & Speak.',
          th: 'ซ้อมพูดบรรยายสถานที่สำคัญร่วมกับ Aarav ในกิจกรรม Spot & Speak',
        },
        plannedMiniGames: ['spot_and_speak'],
        estimatedMinutes: 5,
      },
      {
        stageId: 'perform',
        objective: {
          en: 'Introduce one Jaipur landmark to fellow travelers.',
          th: 'นำเสนอสถานที่สำคัญในชัยปุระให้นักเดินทางฟังด้วยตนเอง',
        },
        plannedMiniGames: ['mystery_card_speaking'],
        estimatedMinutes: 4,
      },
    ],
    rewardPreview: { xp: 150, coins: 60, gems: 2, stampId: 'stamp_india_jaipur' },
    targetPhase: 'phase_3',
  },
  {
    id: 'mission_kenya_safari',
    countryId: 'kenya',
    title: { en: 'Maasai Mara Conservation Pitch', th: 'ภารกิจพิทักษ์สัตว์ป่ามาไซมารา' },
    cefrLevel: 'A2+',
    languageFunctions: ['TO_INFORM', 'TO_PERSUADE'],
    stages: [
      {
        stageId: 'discover',
        objective: {
          en: 'Learn savanna wildlife facts and environmental protection terms.',
          th: 'เรียนรู้คำศัพท์สัตว์ป่าทุ่งสะวันนาและการอนุรักษ์สิ่งแวดล้อม',
        },
        plannedMiniGames: ['word_hunter', 'memory_flip'],
        estimatedMinutes: 4,
      },
      {
        stageId: 'build',
        objective: {
          en: 'Build cause-and-effect facts and persuasive modal sentences.',
          th: 'สร้างประโยคให้ข้อมูลเชิงเหตุผลและประโยคชวนคิดเพื่อโน้มน้าวใจ',
        },
        plannedMiniGames: ['magic_spell_maker'],
        estimatedMinutes: 4,
      },
      {
        stageId: 'practice',
        objective: {
          en: 'Rehearse answering visitor questions with Ranger Amina.',
          th: 'ซ้อมตอบคำถามนักท่องเที่ยวร่วมกับเจ้าหน้าที่พิทักษ์ป่า Amina',
        },
        plannedMiniGames: ['magic_speech_bubble'],
        estimatedMinutes: 5,
      },
      {
        stageId: 'perform',
        objective: {
          en: 'Deliver a 45–60 second wildlife conservation pitch.',
          th: 'นำเสนอคำเชิญชวนอนุรักษ์สัตว์ป่าความยาว 45–60 วินาที',
        },
        plannedMiniGames: ['mystery_card_speaking'],
        estimatedMinutes: 5,
      },
    ],
    rewardPreview: { xp: 250, coins: 75, gems: 3, stampId: 'stamp_kenya_wildspeak' },
    targetPhase: 'phase_5',
  },
  {
    id: 'mission_scotland_highlands',
    countryId: 'scotland',
    title: { en: 'Highland Cultural Exchange', th: 'แลกเปลี่ยนวัฒนธรรมไทย–สกอตแลนด์' },
    cefrLevel: 'B1',
    languageFunctions: ['TO_COMPARE_AND_CONTRAST'],
    stages: [
      {
        stageId: 'discover',
        objective: {
          en: 'Explore Scottish & Thai food, attire, and festival vocabulary.',
          th: 'สำรวจคำศัพท์อาหาร เครื่องแต่งกาย และเทศกาลของสกอตแลนด์และไทย',
        },
        plannedMiniGames: ['word_association', 'mystery_box'],
        estimatedMinutes: 4,
      },
      {
        stageId: 'build',
        objective: {
          en: 'Practice comparative structures (whereas, similar to, while).',
          th: 'ฝึกใช้คำเชื่อมเปรียบเทียบความเหมือนและความแตกต่างอย่างถูกต้อง',
        },
        plannedMiniGames: ['sentence_train', 'magic_spell_maker'],
        estimatedMinutes: 5,
      },
      {
        stageId: 'practice',
        objective: {
          en: 'Rehearse cultural comparisons with host buddy Eilidh and heritage guide Fiona.',
          th: 'ซ้อมแลกเปลี่ยนมุมมองทางวัฒนธรรมกับ Eilidh และมัคคุเทศก์ Fiona',
        },
        plannedMiniGames: ['npc_conversation_chain'],
        estimatedMinutes: 5,
      },
      {
        stageId: 'perform',
        objective: {
          en: 'Present similarities and differences between Scotland and Thailand.',
          th: 'นำเสนอความเหมือนและความแตกต่างระหว่างสกอตแลนด์และไทย',
        },
        plannedMiniGames: ['mystery_card_speaking'],
        estimatedMinutes: 5,
      },
    ],
    rewardPreview: { xp: 200, coins: 85, gems: 3, stampId: 'stamp_scotland_highlands' },
    targetPhase: 'phase_5',
  },
  {
    id: 'mission_australia_sydney',
    countryId: 'australia',
    title: { en: 'Sydney Harbour Commute & Cafe', th: 'สนทนาข้ามท่าเรือและคาเฟ่ซิดนีย์' },
    cefrLevel: 'A2+',
    languageFunctions: ['TO_INTERACT'],
    stages: [
      {
        stageId: 'discover',
        objective: {
          en: 'Learn everyday travel, ticketing, and cafe ordering expressions.',
          th: 'เรียนรู้สำนวนการเดินทาง การซื้อตั๋ว และการสั่งอาหารในคาเฟ่',
        },
        plannedMiniGames: ['listen_and_pick', 'word_catcher'],
        estimatedMinutes: 4,
      },
      {
        stageId: 'build',
        objective: {
          en: 'Assemble polite requests, follow-up questions, and clarifications.',
          th: 'สร้างประโยคขอความช่วยเหลือและคำถามติดตามอย่างสุภาพ',
        },
        plannedMiniGames: ['sentence_train'],
        estimatedMinutes: 4,
      },
      {
        stageId: 'practice',
        objective: {
          en: 'Rehearse turn-taking dialogue at the ferry & cafe counters.',
          th: 'ซ้อมบทสนทนาโต้ตอบ ณ เคาน์เตอร์จำหน่ายตั๋วและคาเฟ่',
        },
        plannedMiniGames: ['magic_speech_bubble'],
        estimatedMinutes: 5,
      },
      {
        stageId: 'perform',
        objective: {
          en: 'Complete an unscripted multi-stop Sydney city conversation.',
          th: 'สื่อสารโต้ตอบในสถานการณ์จำลองเมืองซิดนีย์ครบทุกจุด',
        },
        plannedMiniGames: ['npc_conversation_chain'],
        estimatedMinutes: 5,
      },
    ],
    rewardPreview: { xp: 180, coins: 75, gems: 3, stampId: 'stamp_australia_sydney' },
    targetPhase: 'phase_6',
  },
  {
    id: 'mission_egypt_expedition',
    countryId: 'egypt',
    title: { en: 'Giza Field Team Navigation', th: 'นำทางทีมสำรวจภาคสนามกีซา' },
    cefrLevel: 'B1',
    languageFunctions: ['TO_GIVE_INSTRUCTIONS'],
    stages: [
      {
        stageId: 'discover',
        objective: {
          en: 'Master directional prepositions, sequencing words, and field gear terms.',
          th: 'เรียนรู้คำบุพบทบอกทิศทาง คำเชื่อมลำดับขั้นตอน และอุปกรณ์สำรวจ',
        },
        plannedMiniGames: ['vocab_maze', 'word_smash'],
        estimatedMinutes: 4,
      },
      {
        stageId: 'build',
        objective: {
          en: 'Construct clear imperative sequences (First, Next, Carefully turn...).',
          th: 'เรียงลำดับคำสั่งและคำแนะนำเชิงขั้นตอนอย่างชัดเจน',
        },
        plannedMiniGames: ['magic_spell_maker'],
        estimatedMinutes: 4,
      },
      {
        stageId: 'practice',
        objective: {
          en: 'Practice guiding Dr. Tariq’s field team around excavation markers.',
          th: 'ซ้อมบอกทิศทางและขั้นตอนให้ทีมของ Dr. Tariq',
        },
        plannedMiniGames: ['spot_and_speak'],
        estimatedMinutes: 5,
      },
      {
        stageId: 'perform',
        objective: {
          en: 'Guide an expedition team through a multi-step archaeological challenge.',
          th: 'นำทางทีมสำรวจผ่านภารกิจภาคสนามทีละขั้นตอนจนสำเร็จ',
        },
        plannedMiniGames: ['npc_conversation_chain'],
        estimatedMinutes: 5,
      },
    ],
    rewardPreview: { xp: 220, coins: 100, gems: 4, stampId: 'stamp_egypt_expedition' },
    targetPhase: 'phase_6',
  },
];

export const ROUTE_HIERARCHY: RouteDefinition[] = [
  {
    id: 'welcome',
    step: 1,
    label: { en: 'Welcome', th: 'หน้าแรก' },
    shortLabel: { en: 'Welcome', th: 'หน้าแรก' },
    phase0Status: 'implemented',
    targetPhase: 'phase_0',
    purpose: {
      en: 'Introduce VoxVoyage’s Global Explorer Program, design direction, and five destinations.',
      th: 'แนะนำโปรแกรมนักสำรวจโลก VoxVoyage แนวคิดการเรียนรู้ และจุดหมายทั้ง 5 ประเทศ',
    },
  },
  {
    id: 'avatar-studio',
    step: 2,
    label: { en: 'Avatar Studio', th: 'สตูดิโอสร้างตัวละคร' },
    shortLabel: { en: 'Avatar', th: 'ตัวละคร' },
    phase0Status: 'placeholder',
    targetPhase: 'phase_1',
    parentRoute: 'welcome',
    purpose: {
      en: '3D explorer customization with travel outfits and culturally respectful attire.',
      th: 'ปรับแต่งตัวละครนักสำรวจ 3 มิติ พร้อมชุดเดินทางและเครื่องแต่งกายที่ให้เกียรติวัฒนธรรม',
    },
  },
  {
    id: 'briefing',
    step: 3,
    label: { en: 'Explorer Briefing', th: 'ปฐมนิเทศนักสำรวจ' },
    shortLabel: { en: 'Briefing', th: 'ปฐมนิเทศ' },
    phase0Status: 'placeholder',
    targetPhase: 'phase_1',
    parentRoute: 'avatar-studio',
    purpose: {
      en: 'Receive the Explorer Passport and learn how the 4-stage speaking cycle works.',
      th: 'รับพาสปอร์ตนักสำรวจและทำความเข้าใจวงจรฝึกพูด 4 ขั้นตอน',
    },
  },
  {
    id: 'world-map',
    step: 4,
    label: { en: 'World Map', th: 'แผนที่โลก 3 มิติ' },
    shortLabel: { en: 'World Map', th: 'แผนที่โลก' },
    phase0Status: 'preview',
    targetPhase: 'phase_2',
    parentRoute: 'briefing',
    purpose: {
      en: 'Primary destination selector featuring an interactive 3D globe preview in Phase 0 and full country map travel in Phase 2.',
      th: 'จุดเลือกจุดหมายหลัก พร้อมลูกโลก 3 มิติจำลองในเฟส 0 และแผนที่เดินทางเต็มรูปแบบในเฟส 2',
    },
  },
  {
    id: 'country-lobby',
    step: 5,
    label: { en: 'Country Lobby', th: 'ล็อบบี้ประจำประเทศ' },
    shortLabel: { en: 'Lobby', th: 'ล็อบบี้' },
    phase0Status: 'placeholder',
    targetPhase: 'phase_2',
    parentRoute: 'world-map',
    purpose: {
      en: 'Meet the local NPC guide, preview the cultural backdrop, and inspect mission goals.',
      th: 'พบไกด์ NPC ประจำประเทศ ชมฉากวัฒนธรรม และดูเป้าหมายภารกิจ',
    },
  },
  {
    id: 'mission-pathway',
    step: 6,
    label: { en: 'Mission Pathway', th: 'เส้นทางภารกิจ 4 ขั้น' },
    shortLabel: { en: 'Pathway', th: 'เส้นทาง' },
    phase0Status: 'placeholder',
    targetPhase: 'phase_3',
    parentRoute: 'country-lobby',
    purpose: {
      en: 'Progress through Discover → Build → Practice → Perform stages sequentially.',
      th: 'เรียนรู้ตามลำดับขั้น Discover → Build → Practice → Perform',
    },
  },
  {
    id: 'mini-game',
    step: 7,
    label: { en: 'Mini-Game', th: 'มินิเกมฝึกภาษา' },
    shortLabel: { en: 'Mini-Game', th: 'มินิเกม' },
    phase0Status: 'placeholder',
    targetPhase: 'phase_3',
    parentRoute: 'mission-pathway',
    purpose: {
      en: 'Modular vocabulary, sentence-building, and guided speaking activities nested inside missions.',
      th: 'กิจกรรมมินิเกมฝึกคำศัพท์ สร้างประโยค และซ้อมพูดที่ซ้อนอยู่ภายในภารกิจ',
    },
  },
  {
    id: 'speaking-performance',
    step: 8,
    label: { en: 'Speaking Performance', th: 'ภารกิจพูดจริง' },
    shortLabel: { en: 'Speaking', th: 'ฝึกพูดจริง' },
    phase0Status: 'placeholder',
    targetPhase: 'phase_4',
    parentRoute: 'mission-pathway',
    purpose: {
      en: 'Microphone recording, playback, no-mic alternatives, and privacy-aware feedback architecture.',
      th: 'บันทึกเสียง ฟังย้อนหลัง ทางเลือกไม่ใช้ไมโครโฟน และสถาปัตยกรรมคำแนะนำแบบรักษาความเป็นส่วนตัว',
    },
  },
  {
    id: 'mission-result',
    step: 9,
    label: { en: 'Mission Result', th: 'สรุปผลภารกิจ' },
    shortLabel: { en: 'Result', th: 'สรุปผล' },
    phase0Status: 'placeholder',
    targetPhase: 'phase_3',
    parentRoute: 'speaking-performance',
    purpose: {
      en: 'Review Sandwich Feedback, XP/Coins/Gems earned, and self-reflection notes.',
      th: 'ดูข้อเสนอแนะแบบ Sandwich Feedback คะแนนรางวัล และบันทึกสะท้อนคิดของตนเอง',
    },
  },
  {
    id: 'passport-reward',
    step: 10,
    label: { en: 'Passport Reward', th: 'พาสปอร์ตและรางวัล' },
    shortLabel: { en: 'Passport', th: 'พาสปอร์ต' },
    phase0Status: 'preview',
    targetPhase: 'phase_1',
    parentRoute: 'mission-result',
    purpose: {
      en: 'Inspect Explorer Passport stamps, XP, Gold Coins, Magic Gems, and local progress storage.',
      th: 'ตรวจสอบตราประทับพาสปอร์ต XP เหรียญทอง อัญมณี และการบันทึกความก้าวหน้าในเครื่อง',
    },
  },
];

export function getMissionByCountryId(countryId: string): MissionDefinition {
  return MISSIONS.find((m) => m.countryId === countryId) ?? MISSIONS[0];
}

export function getMiniGameById(id: string): MiniGameSpec | undefined {
  return MINI_GAME_LIBRARY.find((g) => g.id === id);
}
