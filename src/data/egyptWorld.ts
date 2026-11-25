import type { LocalizedText } from '../types/game';
import type { BoxObstacle, CircleObstacle } from './jaipurWorld';

export type EgyptLandmarkId =
  | 'nile_expedition_camp'
  | 'giza_pyramid_plaza'
  | 'ancient_scribe_workshop'
  | 'temple_of_the_sun'
  | 'chamber_of_wisdom';

export type EgyptNpcId = 'npc_layla' | 'npc_omar' | 'npc_mariam' | 'npc_karim';
export type EgyptPoiId = EgyptNpcId | EgyptLandmarkId;

/**
 * Canonical Egypt mission & stamp identifiers already reserved in countries.ts,
 * learningFramework.ts, PassportModalScreen.tsx, and progressStorage.ts.
 */
export const EGYPT_MISSION_ID = 'mission_egypt_expedition';
export const EGYPT_PASSPORT_STAMP_ID = 'stamp_egypt_expedition';

/**
 * Stage activity IDs reserved for Phases 5B–5E.
 * Phase 5B unlocks `discover` (`egypt_secrets_discovery`).
 */
export const EGYPT_STAGE_ACTIVITY_IDS = {
  discover: 'egypt_secrets_discovery',
  build: 'egypt_instruction_builder',
  practice: 'egypt_expedition_practice',
  perform: 'egypt_grand_expedition_perform',
} as const;

export const EGYPT_RECOMMENDED_ROUTE: EgyptLandmarkId[] = [
  'nile_expedition_camp',
  'giza_pyramid_plaza',
  'ancient_scribe_workshop',
  'temple_of_the_sun',
  'chamber_of_wisdom',
];

export interface EgyptLandmark {
  id: EgyptLandmarkId;
  order: number;
  title: LocalizedText;
  subtitle: LocalizedText;
  zoneBadge: LocalizedText;
  languageFocus: LocalizedText;
  description: LocalizedText;
  culturalNote: LocalizedText;
  futurePreviewNote: LocalizedText;
  recommendedNpcId: EgyptNpcId;
  isSealedInPhase5A?: boolean;
  position: { x: number; z: number };
  interactionRadius: number;
  accentColor: string;
}

export interface EgyptInteractiveTarget {
  id: EgyptPoiId;
  kind: 'npc' | 'landmark';
  title: LocalizedText;
  position: { x: number; z: number };
  interactionRadius: number;
  accentColor: string;
}

export interface EgyptNpcDialogueEntry {
  id: EgyptNpcId;
  name: string;
  role: LocalizedText;
  locationName: LocalizedText;
  accentColor: string;
  voiceRate: number;
  voicePitch: number;
  greetingQuote: LocalizedText;
  followUpTip: LocalizedText;
  chamberGuidanceNote?: LocalizedText;
}

export const EGYPT_SPAWN = {
  x: 0,
  z: 12.2,
  yaw: Math.PI,
};

export const EGYPT_BOUNDS = {
  minX: -22.0,
  maxX: 22.0,
  minZ: -18.5,
  maxZ: 18.5,
  playerRadius: 0.42,
};

export const EGYPT_NPC_POSITIONS: Record<
  EgyptNpcId,
  { x: number; z: number; idleYaw: number }
> = {
  npc_layla: { x: 2.3, z: 9.0, idleYaw: -0.45 },
  npc_omar: { x: 3.1, z: 1.6, idleYaw: -0.52 },
  npc_mariam: { x: 10.6, z: 5.2, idleYaw: -0.65 },
  npc_karim: { x: -10.8, z: 5.0, idleYaw: 0.62 },
};

export const EGYPT_BOX_OBSTACLES: BoxObstacle[] = [
  // Nile Expedition Camp tents & briefing supply table
  { id: 'camp_main_tent', minX: -6.4, maxX: -2.8, minZ: 9.0, maxZ: 12.2 },
  { id: 'camp_supply_tent', minX: 3.4, maxX: 6.6, minZ: 9.4, maxZ: 12.4 },
  { id: 'camp_map_table', minX: -2.5, maxX: -1.3, minZ: 7.5, maxZ: 8.7 },

  // Giza Pyramid Plaza Great Sphinx-inspired statue plinth
  { id: 'giza_sphinx_monument', minX: -8.6, maxX: -4.8, minZ: -3.5, maxZ: -0.7 },

  // Ancient Scribe Workshop pavilion & outdoor desk (East Courtyard)
  { id: 'scribe_workshop_pavilion', minX: 13.8, maxX: 18.6, minZ: -0.2, maxZ: 5.2 },
  { id: 'scribe_papyrus_table', minX: 12.2, maxX: 13.5, minZ: 4.1, maxZ: 5.3 },

  // Temple of the Sun gateway pylon & sanctuary wall (West Courtyard)
  { id: 'temple_sun_pylon', minX: -18.8, maxX: -14.2, minZ: -0.8, maxZ: 5.2 },

  // Monumental Chamber of Wisdom Entrance (North — SEALED & non-enterable in Phase 5A)
  { id: 'chamber_of_wisdom_facade', minX: -5.2, maxX: 5.2, minZ: -18.5, maxZ: -12.6 },

  // Nile River waterfront bank & non-walkable water barrier (South edge)
  { id: 'nile_water_barrier', minX: -22.0, maxX: 22.0, minZ: 15.2, maxZ: 30.0 },
];

export const EGYPT_CIRCLE_OBSTACLES: CircleObstacle[] = [
  // 4 NPC personal spaces
  {
    id: 'npc_layla',
    x: EGYPT_NPC_POSITIONS.npc_layla.x,
    z: EGYPT_NPC_POSITIONS.npc_layla.z,
    radius: 0.62,
  },
  {
    id: 'npc_omar',
    x: EGYPT_NPC_POSITIONS.npc_omar.x,
    z: EGYPT_NPC_POSITIONS.npc_omar.z,
    radius: 0.62,
  },
  {
    id: 'npc_mariam',
    x: EGYPT_NPC_POSITIONS.npc_mariam.x,
    z: EGYPT_NPC_POSITIONS.npc_mariam.z,
    radius: 0.62,
  },
  {
    id: 'npc_karim',
    x: EGYPT_NPC_POSITIONS.npc_karim.x,
    z: EGYPT_NPC_POSITIONS.npc_karim.z,
    radius: 0.62,
  },

  // Giza Plaza survey obelisk plinth
  { id: 'giza_plaza_obelisk', x: -3.6, z: 2.5, radius: 0.85 },

  // Temple of the Sun flanking lotus columns
  { id: 'temple_column_ne', x: -13.1, z: -1.5, radius: 0.66 },
  { id: 'temple_column_se', x: -13.1, z: 5.8, radius: 0.66 },
  { id: 'temple_column_nw', x: -18.1, z: -1.5, radius: 0.66 },
  { id: 'temple_column_sw', x: -18.1, z: 5.8, radius: 0.66 },

  // Ancient Scribe Workshop woven baskets & amphora stand
  { id: 'scribe_pottery_cluster', x: 14.0, z: 6.4, radius: 0.72 },

  // Chamber of Wisdom forecourt guardian plinths
  { id: 'chamber_guardian_west', x: -5.8, z: -12.2, radius: 0.78 },
  { id: 'chamber_guardian_east', x: 5.8, z: -12.2, radius: 0.78 },

  // Date palms & oasis greenery along Nile bank & plateau perimeter
  { id: 'palm_nile_west', x: -9.4, z: 11.4, radius: 0.7 },
  { id: 'palm_nile_east', x: 9.5, z: 11.2, radius: 0.7 },
  { id: 'palm_sw_oasis', x: -16.2, z: 10.8, radius: 0.74 },
  { id: 'palm_se_oasis', x: 16.0, z: 10.6, radius: 0.74 },
  { id: 'palm_nw_sanctuary', x: -16.4, z: -7.8, radius: 0.72 },
  { id: 'palm_ne_dunes', x: 16.2, z: -7.8, radius: 0.72 },

  // Desert sandstone rock outcrops on perimeter
  { id: 'desert_rock_nw', x: -18.5, z: -13.6, radius: 0.96 },
  { id: 'desert_rock_ne', x: 18.4, z: -13.4, radius: 0.96 },
  { id: 'desert_rock_north_w', x: -12.4, z: -14.6, radius: 0.9 },
  { id: 'desert_rock_north_e', x: 12.6, z: -14.6, radius: 0.9 },

  // Wooden expedition signposts
  { id: 'signpost_camp_east', x: 4.4, z: 5.8, radius: 0.42 },
  { id: 'signpost_plaza_north', x: -4.4, z: -6.2, radius: 0.42 },
];

export const EGYPT_NPC_TARGETS: EgyptInteractiveTarget[] = [
  {
    id: 'npc_layla',
    kind: 'npc',
    title: { en: 'Dr. Layla Hassan', th: 'ดร. ไลลา ฮัสซัน (Dr. Layla)' },
    position: {
      x: EGYPT_NPC_POSITIONS.npc_layla.x,
      z: EGYPT_NPC_POSITIONS.npc_layla.z,
    },
    interactionRadius: 2.9,
    accentColor: '#E7B43C',
  },
  {
    id: 'npc_omar',
    kind: 'npc',
    title: { en: 'Omar Khalil', th: 'โอมาร์ คาลิล (Omar)' },
    position: {
      x: EGYPT_NPC_POSITIONS.npc_omar.x,
      z: EGYPT_NPC_POSITIONS.npc_omar.z,
    },
    interactionRadius: 2.9,
    accentColor: '#ED7852',
  },
  {
    id: 'npc_mariam',
    kind: 'npc',
    title: { en: 'Mariam Nabil', th: 'มาเรียม นาบิล (Mariam)' },
    position: {
      x: EGYPT_NPC_POSITIONS.npc_mariam.x,
      z: EGYPT_NPC_POSITIONS.npc_mariam.z,
    },
    interactionRadius: 2.9,
    accentColor: '#12B8B0',
  },
  {
    id: 'npc_karim',
    kind: 'npc',
    title: { en: 'Karim Mansour', th: 'คาริม มานซูร์ (Karim)' },
    position: {
      x: EGYPT_NPC_POSITIONS.npc_karim.x,
      z: EGYPT_NPC_POSITIONS.npc_karim.z,
    },
    interactionRadius: 2.9,
    accentColor: '#254EAC',
  },
];

export const EGYPT_LANDMARKS: EgyptLandmark[] = [
  {
    id: 'nile_expedition_camp',
    order: 1,
    title: {
      en: 'Nile Expedition Camp',
      th: 'ค่ายสำรวจริมแม่น้ำไนล์ (Nile Expedition Camp)',
    },
    subtitle: {
      en: 'Base Camp, Nile Waterfront & Briefing Table',
      th: 'ค่ายฐานริมฝั่งไนล์และโต๊ะวางแผนสำรวจ',
    },
    zoneBadge: { en: 'Stop 1 · Nile Base Camp', th: 'จุดที่ 1 · ค่ายฐานแม่น้ำไนล์' },
    languageFocus: {
      en: 'Sequencing Words & First-Step Briefing Instructions',
      th: 'คำเชื่อมลำดับขั้นตอนและคำแนะนำเริ่มต้นภารกิจ',
    },
    description: {
      en: 'Canvas expedition tents, rolled plateau maps, lantern-lit supply crates, and a wooden pier overlooking the turquoise Nile River with a traditional Felucca boat.',
      th: 'เต็นท์ผ้าใบค่ายสำรวจ แผนที่ที่ราบสูงม้วนเก็บ ลังเสบียงใต้แสงโคม และท่าน้ำไม้ริมแม่น้ำไนล์สีเทอร์ควอยซ์พร้อมเรือใบเฟลุกกาโบราณ',
    },
    culturalNote: {
      en: 'For millennia, the Nile River served as Egypt’s lifeline for farming, travel, and trade. Today, Egyptian archaeologists work carefully alongside local communities to protect riverside and desert heritage.',
      th: 'แม่น้ำไนล์เป็นสายน้ำหล่อเลี้ยงอารยธรรมอียิปต์มานับพันปี ทั้งการเกษตร การเดินทาง และการค้า ปัจจุบันนักโบราณคดีอียิปต์ร่วมมือกับชุมชนท้องถิ่นเพื่ออนุรักษ์มรดกทางวัฒนธรรมอย่างระมัดระวัง',
    },
    futurePreviewNote: {
      en: 'Expedition Briefing Hub: In future learning stages, Dr. Layla and Omar will help you sequence clear step-by-step instructions from this camp.',
      th: 'ศูนย์ปฐมนิเทศค่ายสำรวจ: ในด่านการเรียนรู้ถัดไป ดร.ไลลาและโอมาร์จะชวนคุณเรียงลำดับคำสั่งสำรวจทีละขั้นจากค่ายแห่งนี้',
    },
    recommendedNpcId: 'npc_layla',
    position: { x: 0, z: 8.8 },
    interactionRadius: 3.1,
    accentColor: '#12B8B0',
  },
  {
    id: 'giza_pyramid_plaza',
    order: 2,
    title: {
      en: 'Giza Pyramid Plaza',
      th: 'ลานมหาพีระมิดแห่งกีซา (Giza Pyramid Plaza)',
    },
    subtitle: {
      en: 'Monumental Horizon, Sphinx & Route Axis',
      th: 'แนวแกนลานอนุสรณ์ สฟิงซ์ และเส้นทางชมพีระมิด',
    },
    zoneBadge: { en: 'Stop 2 · Central Plateau', th: 'จุดที่ 2 · ลานกลางที่ราบสูงกีซา' },
    languageFocus: {
      en: 'Directional Prepositions & Route Guidance',
      th: 'คำบุพบทบอกทิศทางและการนำทางอย่างชัดเจน',
    },
    description: {
      en: 'A sunlit sandstone promenade opening onto three towering Giza pyramids, a carved Sphinx monument, and directional signposts linking the workshop and temple.',
      th: 'ลานหินทรายกลางแจ้งที่เปิดมุมมองสู่มหาพีระมิดทั้งสาม อนุสรณ์สฟิงซ์แกะสลัก และป้ายบอกทางเชื่อมสู่โรงงานอาลักษณ์และวิหารแห่งดวงอาทิตย์',
    },
    culturalNote: {
      en: 'Real monuments on the Giza Plateau—the Great Pyramids and the Great Sphinx—stand over 4,500 years old and are carefully preserved as UNESCO World Heritage wonders.',
      th: 'มหาพีระมิดแห่งกีซาและมหาสฟิงซ์มีอายุกว่า 4,500 ปี และได้รับการอนุรักษ์เป็นมรดกโลกขององค์การยูเนสโกอย่างเข้มงวด',
    },
    futurePreviewNote: {
      en: 'Route & Direction Zone: Upcoming expedition stages will challenge you to guide teammates across this plaza using precise directional phrases.',
      th: 'โซนนำทางและทิศทาง: ในด่านถัดไป คุณจะได้ฝึกบอกทางและให้คำแนะนำเพื่อนร่วมทีมข้ามลานแห่งนี้อย่างแม่นยำ',
    },
    recommendedNpcId: 'npc_omar',
    position: { x: 0, z: 0.2 },
    interactionRadius: 3.2,
    accentColor: '#E7B43C',
  },
  {
    id: 'ancient_scribe_workshop',
    order: 3,
    title: {
      en: 'Ancient Scribe Workshop',
      th: 'โรงงานอาลักษณ์โบราณ (Ancient Scribe Workshop)',
    },
    subtitle: {
      en: 'Papyrus Scrolls, Ink Pots & Craft Records',
      th: 'ม้วนกระดาษปาปิรุส ชุดหมึก และบันทึกการเขียนโบราณ',
    },
    zoneBadge: { en: 'Stop 3 · East Courtyard', th: 'จุดที่ 3 · ลานฝั่งตะวันออก' },
    languageFocus: {
      en: 'Material Instructions & Step-by-Step Procedures',
      th: 'คำอธิบายขั้นตอนการทำและการใช้วัสดุตามลำดับ',
    },
    description: {
      en: 'A turquoise-and-lapis trimmed workshop filled with reed papyrus bundles, carved wooden scribe tables, pigment bowls, baskets, and pottery vessels.',
      th: 'อาคารเวิร์กชอปตกแต่งขอบสีเทอร์ควอยซ์และลาพิส ภายในเรียงรายด้วยมัดปาปิรุส โต๊ะไม้แกะสลัก ตลับสี กระเช้า และภาชนะดินเผา',
    },
    culturalNote: {
      en: 'Ancient Egyptian scribes held respected roles recording calendars, architecture plans, and stories on papyrus sheets crafted from Nile reeds.',
      th: 'อาลักษณ์อียิปต์โบราณเป็นผู้บันทึกปฏิทิน แบบแปลนสถาปัตยกรรม และเรื่องราวสำคัญลงบนกระดาษปาปิรุสที่ทำจากต้นกกริมแม่น้ำไนล์',
    },
    futurePreviewNote: {
      en: 'Workshop Preview (Inactive in Phase 5A): Papyrus-making sequences and imperative instruction puzzles will open in Stage 1 DISCOVER & Stage 2 BUILD.',
      th: 'ตัวอย่างโซนกิจกรรม (ยังไม่เปิดเล่นในเฟส 5A): ปริศนาลำดับขั้นตอนการทำปาปิรุสจะเปิดให้เล่นในด่าน DISCOVER และ BUILD',
    },
    recommendedNpcId: 'npc_mariam',
    position: { x: 11.4, z: 2.4 },
    interactionRadius: 3.1,
    accentColor: '#12B8B0',
  },
  {
    id: 'temple_of_the_sun',
    order: 4,
    title: {
      en: 'Temple of the Sun',
      th: 'วิหารแห่งดวงอาทิตย์ (Temple of the Sun)',
    },
    subtitle: {
      en: 'Gateway Pylon, Lotus Columns & Light Alignment',
      th: 'ซุ้มประตูไพลอน เสาบัว และสัญลักษณ์แสงสุริยัน',
    },
    zoneBadge: { en: 'Stop 4 · West Sanctuary', th: 'จุดที่ 4 · เขตวิหารฝั่งตะวันตก' },
    languageFocus: {
      en: 'Conditionals, Caution Cues & Alignment Commands',
      th: 'คำสั่งเพื่อความแม่นยำ ข้อควรระวัง และเงื่อนไขขั้นตอน',
    },
    description: {
      en: 'Sandstone temple pylons painted with golden solar discs, lapis lazuli bands, and lotus-capital columns casting crisp shadows across the courtyard.',
      th: 'ซุ้มประตูวิหารหินทรายประดับจานสุริยันสีทอง ลายแถบน้ำเงินลาพิส และเสาหินหัวดอกบัวที่ทอดเงาชัดเจนกลางลานตะวันตก',
    },
    culturalNote: {
      en: 'Sunlight alignment played a poetic role in many ancient Egyptian temples—architects measured solstice shadows with remarkable geometric precision.',
      th: 'การวางแนวแสงอาทิตย์มีบทบาทสำคัญในวิหารอียิปต์โบราณ สถาปนิกคำนวณมุมเงาและทิศทางอย่างแม่นยำทางเรขาคณิต',
    },
    futurePreviewNote: {
      en: 'Puzzle Axis Preview (Inactive in Phase 5A): Future mission puzzles will invite you to give careful step-by-step instructions to align ceremonial sun markers.',
      th: 'ตัวอย่างโซนปริศนา (ยังไม่เปิดเล่นในเฟส 5A): ในภารกิจถัดไป คุณจะได้ออกคำสั่งอย่างระมัดระวังเพื่อจัดแนวสัญลักษณ์แสงอาทิตย์',
    },
    recommendedNpcId: 'npc_karim',
    position: { x: -11.4, z: 2.2 },
    interactionRadius: 3.1,
    accentColor: '#254EAC',
  },
  {
    id: 'chamber_of_wisdom',
    order: 5,
    title: {
      en: 'Chamber of Wisdom Entrance',
      th: 'ทางเข้าโถงแห่งปัญญา (Chamber of Wisdom)',
    },
    subtitle: {
      en: 'Sealed Monumental Façade · Final Expedition Required',
      th: 'ซุ้มประตูศิลาที่ปิดผนึกอยู่ · ต้องผ่านภารกิจสำรวจขั้นสุดท้าย',
    },
    zoneBadge: { en: 'Stop 5 · Sealed Northern Gate', th: 'จุดที่ 5 · ประตูศิลาทิศเหนือ' },
    languageFocus: {
      en: 'Integrated Multi-Step Instructions & Conditionals',
      th: 'การให้คำสั่งหลายขั้นตอนและเงื่อนไขบูรณาการ',
    },
    description: {
      en: 'A monumental carved façade inlaid with Pharaoh gold and Nile turquoise glyphs. Note: The Chamber of Wisdom is a fictional educational expedition site created for VoxVoyage, distinct from real historical Giza monuments.',
      th: 'ซุ้มประตูศิลาแกะสลักประดับทองคำและลวดลายสีเทอร์ควอยซ์ หมายเหตุ: โถงแห่งปัญญาเป็นสถานที่จำลองเพื่อการเรียนรู้ในเกม VoxVoyage แยกต่างหากจากโบราณสถานจริงในกีซา',
    },
    culturalNote: {
      en: 'Respectful archaeological exploration always distinguishes real historical monuments (like the Great Pyramids and Sphinx) from fictional story chambers created for language practice.',
      th: 'การเรียนรู้โบราณคดีอย่างเคารพวัฒนธรรมควรแยกแยะระหว่างโบราณสถานจริงทางประวัติศาสตร์ กับโถงภารกิจจำลองที่สร้างขึ้นเพื่อฝึกภาษา',
    },
    futurePreviewNote: {
      en: 'Monumental Door Sealed: Complete Stage 1 DISCOVER ("The Pharaoh\'s Instruction Code") here, then continue through future BUILD, PRACTICE, and PERFORM stages to unlock the Chamber!',
      th: 'ประตูโถงยังคงปิดผนึกอยู่: พิชิตด่าน DISCOVER (รหัสคำสั่งฟาโรห์) ที่นี่ แล้วลุยต่อในด่าน BUILD, PRACTICE และ PERFORM ในเฟสถัดไปเพื่อปลดล็อกประตู!',
    },
    recommendedNpcId: 'npc_layla',
    isSealedInPhase5A: true,
    position: { x: 0, z: -10.4 },
    interactionRadius: 3.3,
    accentColor: '#E7B43C',
  },
];

export const EGYPT_INTERACTIVE_TARGETS: EgyptInteractiveTarget[] = [
  ...EGYPT_NPC_TARGETS,
  ...EGYPT_LANDMARKS.map((landmark) => ({
    id: landmark.id as EgyptPoiId,
    kind: 'landmark' as const,
    title: landmark.title,
    position: landmark.position,
    interactionRadius: landmark.interactionRadius,
    accentColor: landmark.accentColor,
  })),
];

export const EGYPT_NPC_DIALOGUES: Record<EgyptNpcId, EgyptNpcDialogueEntry> = {
  npc_layla: {
    id: 'npc_layla',
    name: 'Dr. Layla Hassan',
    role: { en: 'Lead Archaeologist', th: 'หัวหน้าทีมโบราณคดี' },
    locationName: { en: 'Nile Expedition Camp', th: 'ค่ายสำรวจริมแม่น้ำไนล์' },
    accentColor: '#E7B43C',
    voiceRate: 0.95,
    voicePitch: 1.03,
    greetingQuote: {
      en: 'Welcome to the Nile Expedition Camp! Our team found ancient inscriptions leading toward a legendary Chamber of Wisdom. Explore the camp and nearby monuments first!',
      th: 'ยินดีต้อนรับสู่ค่ายสำรวจริมแม่น้ำไนล์! ทีมของเราพบจารึกโบราณที่เชื่อมโยงไปยังโถงแห่งปัญญาในตำนาน ลองสำรวจค่ายและโบราณสถานรอบๆ ก่อนได้เลย!',
    },
    followUpTip: {
      en: 'Visit all five expedition zones using your Expedition Guide: Giza Pyramid Plaza, the Ancient Scribe Workshop, the Temple of the Sun, and the sealed Chamber of Wisdom entrance. Notice how we honor real Egyptian heritage while keeping story quests clearly labeled.',
      th: 'ลองสำรวจให้ครบทั้ง 5 จุดด้วยคู่มือคณะสำรวจ ทั้งลานพีระมิด โรงงานอาลักษณ์ วิหารแห่งดวงอาทิตย์ และหน้าประตูโถงแห่งปัญญาที่ยังปิดผนึกอยู่ เพื่อเตรียมพร้อมสำหรับภารกิจให้คำแนะนำในบทถัดไป',
    },
    chamberGuidanceNote: {
      en: 'Dr. Layla notes: The Chamber of Wisdom door is safely sealed while we complete preliminary mapping. Stay respectful of every monument and meet Omar, Mariam, and Karim across the plateau!',
      th: 'ดร.ไลลาแนะนำ: ประตูโถงแห่งปัญญายังปิดผนึกไว้อย่างปลอดภัยระหว่างจัดทำแผนที่เบื้องต้น ขอให้เดินชมอย่างเคารพสถานที่และทักทายโอมาร์ มาเรียม และคาริมให้ครบนะ',
    },
  },
  npc_omar: {
    id: 'npc_omar',
    name: 'Omar Khalil',
    role: { en: 'Field Logistics & Safety Guide', th: 'เจ้าหน้าที่โลจิสติกส์และความปลอดภัย' },
    locationName: { en: 'Giza Pyramid Plaza', th: 'ลานมหาพีระมิดแห่งกีซา' },
    accentColor: '#ED7852',
    voiceRate: 0.96,
    voicePitch: 0.96,
    greetingQuote: {
      en: 'Ahlan! Welcome to Giza Pyramid Plaza! I’m Omar—I map safe walking routes, desert shade tents, and preservation boundaries across the site.',
      th: 'อาห์ลัน! ยินดีต้อนรับสู่ลานมหาพีระมิดแห่งกีซา! ผมโอมาร์ ดูแลเส้นทางเดินที่ปลอดภัย จุดพักร่มเงา และเขตแนวอนุรักษ์โบราณสถาน',
    },
    followUpTip: {
      en: 'Clear instructions keep every field team safe: "First check the compass, next stay on the paved sandstone path, and always keep clear of fragile stone edges." You’ll practice giving directions like these in upcoming stages!',
      th: 'คำสั่งที่ชัดเจนช่วยให้ทีมสำรวจปลอดภัยเสมอ เช่น "First check the compass, next stay on the stone path." คุณจะได้ฝึกบอกทางเป็นขั้นตอนจากจุดนี้ในด่านถัดไป!',
    },
  },
  npc_mariam: {
    id: 'npc_mariam',
    name: 'Mariam Nabil',
    role: { en: 'Ancient Writing & Artifacts Specialist', th: 'ผู้เชี่ยวชาญอักษรโบราณและโบราณวัตถุ' },
    locationName: { en: 'Ancient Scribe Workshop', th: 'โรงงานอาลักษณ์โบราณ' },
    accentColor: '#12B8B0',
    voiceRate: 0.96,
    voicePitch: 1.06,
    greetingQuote: {
      en: 'Marhaban! Welcome to the Ancient Scribe Workshop! I’m Mariam. Here we study how Nile reeds became papyrus scrolls and how scribes mixed natural mineral inks.',
      th: 'มัรฮาบัน! ยินดีต้อนรับสู่โรงงานอาลักษณ์โบราณ! ฉันชื่อมาเรียม ที่นี่เราศึกษาวิธีทำกระดาษปาปิรุสจากต้นกกไนล์และการผสมหมึกธรรมชาติของอาลักษณ์',
    },
    followUpTip: {
      en: 'When explaining a craft or process in English, sequencing markers like "First, soak the reed strips. Then press them flat. Finally, let the sheet dry" make every step crystal clear.',
      th: 'เวลาอธิบายขั้นตอนการทำงานเป็นภาษาอังกฤษ การใช้คำเชื่อมอย่าง "First... Then... Finally..." จะช่วยให้ผู้ฟังทำตามได้ถูกต้องไม่สับสนเลย',
    },
  },
  npc_karim: {
    id: 'npc_karim',
    name: 'Karim Mansour',
    role: { en: 'Expedition Assistant & Explorer Guide', th: 'ผู้ช่วยคณะสำรวจและผู้นำทาง' },
    locationName: { en: 'Temple of the Sun', th: 'วิหารแห่งดวงอาทิตย์' },
    accentColor: '#254EAC',
    voiceRate: 0.95,
    voicePitch: 0.95,
    greetingQuote: {
      en: 'Salam! I’m Karim here at the Temple of the Sun. Look up at those golden sun discs and lotus-topped sandstone columns—every shadow lines up along the eastern axis.',
      th: 'สลาม! ผมคาริม ประจำอยู่ที่วิหารแห่งดวงอาทิตย์ ลองมองขึ้นไปที่จานสุริยันสีทองและเสาหัวดอกบัวสิ ทุกแนวเสาวางตัวรับแสงตะวันออกอย่างงดงาม',
    },
    followUpTip: {
      en: 'In future phases, our team will ask you for step-by-step alignment instructions here at the temple courtyard. For now, take in the architecture and continue exploring the plateau!',
      th: 'ในด่านต่อไป ทีมสำรวจจะให้คุณช่วยออกคำสั่งจัดแนวแสงอย่างเป็นขั้นตอนที่ลานวิหารนี้ ตอนนี้เชิญชมสถาปัตยกรรมและเดินสำรวจให้ทั่วก่อนได้เลย!',
    },
  },
};
