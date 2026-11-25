import type { LocalizedText } from '../types/game';
import type { BoxObstacle, CircleObstacle } from './jaipurWorld';

export type AustraliaLandmarkId =
  | 'circular_quay_plaza'
  | 'city_transit_station'
  | 'harbour_market_cafe'
  | 'darling_harbour_hub'
  | 'harbour_gardens_help_point';

export type AustraliaNpcId = 'npc_olivia' | 'npc_noah' | 'npc_mia' | 'npc_jack';
export type AustraliaPoiId = AustraliaNpcId | AustraliaLandmarkId;

export const AUSTRALIA_MISSION_ID = 'mission_australia_sydney';
export const AUSTRALIA_PASSPORT_STAMP_ID = 'stamp_australia_sydney';

/**
 * Stage activity IDs reserved for future Phases 4B–4E.
 * In Phase 4A, none of these are started, completed, or rewarded.
 */
export const AUSTRALIA_STAGE_ACTIVITY_IDS = {
  discover: 'australia_city_discovery',
  build: 'australia_interact_builder',
  practice: 'australia_dialogue_practice',
  perform: 'australia_citytalk_perform',
} as const;

export const AUSTRALIA_RECOMMENDED_ROUTE: AustraliaLandmarkId[] = [
  'circular_quay_plaza',
  'city_transit_station',
  'harbour_market_cafe',
  'darling_harbour_hub',
  'harbour_gardens_help_point',
];

export interface AustraliaLandmark {
  id: AustraliaLandmarkId;
  order: number;
  title: LocalizedText;
  subtitle: LocalizedText;
  languageFocus: LocalizedText;
  districtBadge: LocalizedText;
  description: LocalizedText;
  culturalNote: LocalizedText;
  interactionSpark: LocalizedText;
  recommendedNpcId: AustraliaNpcId;
  position: { x: number; z: number };
  interactionRadius: number;
  accentColor: string;
}

export interface AustraliaInteractiveTarget {
  id: AustraliaPoiId;
  kind: 'npc' | 'landmark';
  title: LocalizedText;
  position: { x: number; z: number };
  interactionRadius: number;
  accentColor: string;
}

export interface AustraliaNpcDialogueEntry {
  id: AustraliaNpcId;
  name: string;
  role: LocalizedText;
  locationName: LocalizedText;
  accentColor: string;
  voiceRate: number;
  voicePitch: number;
  greetingQuote: LocalizedText;
  followUpTip: LocalizedText;
  harbourGardensHelperNote?: LocalizedText;
}

export const AUSTRALIA_SPAWN = {
  x: 0,
  z: 14.0,
  yaw: Math.PI,
};

export const AUSTRALIA_BOUNDS = {
  minX: -21.0,
  maxX: 21.0,
  minZ: -17.5,
  maxZ: 17.5,
  playerRadius: 0.42,
};

export const AUSTRALIA_NPC_POSITIONS: Record<
  AustraliaNpcId,
  { x: number; z: number; idleYaw: number }
> = {
  npc_olivia: { x: 2.6, z: 8.2, idleYaw: -0.45 },
  npc_noah: { x: -10.4, z: 7.5, idleYaw: 0.55 },
  npc_mia: { x: 10.4, z: 7.5, idleYaw: -0.55 },
  npc_jack: { x: 6.4, z: -4.6, idleYaw: -0.4 },
};

export const AUSTRALIA_BOX_OBSTACLES: BoxObstacle[] = [
  // Circular Quay info kiosk on west edge of main plaza
  { id: 'circular_quay_info_kiosk', minX: -3.7, maxX: -2.1, minZ: 4.8, maxZ: 6.2 },
  // City Transit Station west building + ticket kiosk
  { id: 'city_transit_building', minX: -17.6, maxX: -12.4, minZ: 1.6, maxZ: 7.4 },
  { id: 'city_transit_ticket_booth', minX: -12.2, maxX: -10.8, minZ: 2.2, maxZ: 3.3 },
  // Harbour Market & Café east stalls
  { id: 'harbour_cafe_pavilion', minX: 12.4, maxX: 17.6, minZ: 1.6, maxZ: 7.0 },
  { id: 'harbour_market_pantry', minX: 11.0, maxX: 12.2, minZ: 2.0, maxZ: 3.0 },
  // Darling Harbour Discovery Hub north-east visitor pavilion + display wall
  { id: 'darling_harbour_pavilion', minX: 11.4, maxX: 17.2, minZ: -11.4, maxZ: -7.4 },
  { id: 'darling_harbour_signboard', minX: 12.6, maxX: 14.0, minZ: -6.4, maxZ: -5.3 },
  // Harbour Gardens Help Point kiosk + pergola
  { id: 'harbour_gardens_help_kiosk', minX: -16.4, maxX: -11.8, minZ: -11.0, maxZ: -8.4 },
  { id: 'harbour_gardens_bench_east', minX: -7.4, maxX: -5.6, minZ: -10.2, maxZ: -9.3 },
  // Sydney Harbour seawall water boundary (north edge)
  { id: 'sydney_harbour_water_edge', minX: -21.0, maxX: 21.0, minZ: -30.0, maxZ: -13.6 },
];

export const AUSTRALIA_CIRCLE_OBSTACLES: CircleObstacle[] = [
  // NPC Personal Spaces
  {
    id: 'npc_olivia',
    x: AUSTRALIA_NPC_POSITIONS.npc_olivia.x,
    z: AUSTRALIA_NPC_POSITIONS.npc_olivia.z,
    radius: 0.62,
  },
  {
    id: 'npc_noah',
    x: AUSTRALIA_NPC_POSITIONS.npc_noah.x,
    z: AUSTRALIA_NPC_POSITIONS.npc_noah.z,
    radius: 0.62,
  },
  {
    id: 'npc_mia',
    x: AUSTRALIA_NPC_POSITIONS.npc_mia.x,
    z: AUSTRALIA_NPC_POSITIONS.npc_mia.z,
    radius: 0.62,
  },
  {
    id: 'npc_jack',
    x: AUSTRALIA_NPC_POSITIONS.npc_jack.x,
    z: AUSTRALIA_NPC_POSITIONS.npc_jack.z,
    radius: 0.62,
  },
  // Café outdoor patio tables
  { id: 'cafe_table_1', x: 11.0, z: 0.2, radius: 0.72 },
  { id: 'cafe_table_2', x: 14.4, z: 8.6, radius: 0.72 },
  // Circular Quay sandstone planter fountain
  { id: 'quay_compass_planter', x: 0, z: -1.6, radius: 1.2 },
  // Harbour Gardens coastal palms & eucalyptus trees
  { id: 'park_palm_west', x: -16.2, z: -4.2, radius: 0.72 },
  { id: 'park_eucalyptus_nw', x: -17.6, z: -11.8, radius: 0.76 },
  { id: 'park_palm_central', x: -7.2, z: -4.0, radius: 0.68 },
  { id: 'palm_sw_corner', x: -15.0, z: 11.4, radius: 0.74 },
  { id: 'palm_se_corner', x: 15.2, z: 11.2, radius: 0.74 },
  { id: 'palm_ne_harbour', x: 17.8, z: -4.4, radius: 0.72 },
];

export const AUSTRALIA_NPC_TARGETS: AustraliaInteractiveTarget[] = [
  {
    id: 'npc_olivia',
    kind: 'npc',
    title: { en: 'Olivia Parker', th: 'โอลิเวีย พาร์กเกอร์ (Olivia)' },
    position: {
      x: AUSTRALIA_NPC_POSITIONS.npc_olivia.x,
      z: AUSTRALIA_NPC_POSITIONS.npc_olivia.z,
    },
    interactionRadius: 2.8,
    accentColor: '#0EA5E9',
  },
  {
    id: 'npc_noah',
    kind: 'npc',
    title: { en: 'Noah Williams', th: 'โนอาห์ วิลเลียมส์ (Noah)' },
    position: {
      x: AUSTRALIA_NPC_POSITIONS.npc_noah.x,
      z: AUSTRALIA_NPC_POSITIONS.npc_noah.z,
    },
    interactionRadius: 2.8,
    accentColor: '#2563EB',
  },
  {
    id: 'npc_mia',
    kind: 'npc',
    title: { en: 'Mia Chen', th: 'มีอา เฉิน (Mia)' },
    position: {
      x: AUSTRALIA_NPC_POSITIONS.npc_mia.x,
      z: AUSTRALIA_NPC_POSITIONS.npc_mia.z,
    },
    interactionRadius: 2.8,
    accentColor: '#EA580C',
  },
  {
    id: 'npc_jack',
    kind: 'npc',
    title: { en: 'Jack Thompson', th: 'แจ็ก ทอมป์สัน (Jack)' },
    position: {
      x: AUSTRALIA_NPC_POSITIONS.npc_jack.x,
      z: AUSTRALIA_NPC_POSITIONS.npc_jack.z,
    },
    interactionRadius: 2.8,
    accentColor: '#9333EA',
  },
];

export const AUSTRALIA_LANDMARKS: AustraliaLandmark[] = [
  {
    id: 'circular_quay_plaza',
    order: 1,
    title: {
      en: 'Circular Quay Welcome Plaza',
      th: 'ลานต้อนรับเซอร์คิวลาร์คีย์ (Circular Quay)',
    },
    subtitle: {
      en: 'Harbour Promenade & Information Point',
      th: 'ทางเดินริมอ่าวซิดนีย์และจุดให้ข้อมูล',
    },
    languageFocus: {
      en: 'Greetings & Asking for Information',
      th: 'การทักทายและการสอบถามข้อมูลเบื้องต้น',
    },
    districtBadge: { en: 'Stop 1 · Harbour Entry', th: 'จุดที่ 1 · ประตูสู่อ่าวซิดนีย์' },
    description: {
      en: 'A sunlit waterfront promenade framed by white sail-vaulted harbour architecture, ferry piers, and the steel arch skyline across Sydney Cove.',
      th: 'ลานทางเดินริมน้ำอันสดใส รายล้อมด้วยสถาปัตยกรรมหลังคาใบเรือสีขาว ท่าเรือเฟอร์รี่ และสะพานโครงเหล็กอันเป็นเอกลักษณ์ของซิดนีย์',
    },
    culturalNote: {
      en: 'Locals in Sydney often start everyday conversations with a relaxed, warm greeting like "Hi there!" or "G’day, how’s it going?" before getting right to helpful directions.',
      th: 'ชาวซิดนีย์มักเริ่มต้นบทสนทนาด้วยน้ำเสียงเป็นกันเองและอบอุ่น เช่น "Hi there!" หรือ "G’day, how’s it going?" ก่อนช่วยแนะนำทางอย่างเต็มใจ',
    },
    interactionSpark: {
      en: 'Communication Spotlight: Greet Olivia politely and ask what attractions are nearby on the harbour.',
      th: 'จุดเน้นการสื่อสาร: ลองทักทายโอลิเวียอย่างสุภาพและถามถึงสถานที่สำคัญรอบอ่าว',
    },
    recommendedNpcId: 'npc_olivia',
    position: { x: 0, z: 4.0 },
    interactionRadius: 3.0,
    accentColor: '#0EA5E9',
  },
  {
    id: 'city_transit_station',
    order: 2,
    title: {
      en: 'City Transit Station',
      th: 'สถานีขนส่งมวลชนซิดนีย์ (City Transit)',
    },
    subtitle: {
      en: 'Rail Entrances, Timetables & Ticket Desk',
      th: 'ประตูสถานี ตารางเดินรถ และเคาน์เตอร์ตั๋ว',
    },
    languageFocus: {
      en: 'Directions, Ticket Enquiries & Clarification',
      th: 'การถามทาง สอบถามตั๋วโดยสาร และทวนคำถามให้ชัดเจน',
    },
    districtBadge: { en: 'Stop 2 · West Concourse', th: 'จุดที่ 2 · โถงสถานีฝั่งตะวันตก' },
    description: {
      en: 'A bustling commuter gateway with crisp platform signs, digital departure boards, colour-coded route arrows, and an interactive ticket counter.',
      th: 'สถานีรถไฟใจกลางเมืองที่มีป้ายชานชาลาชัดเจน บอร์ดเวลาเดินรถ ลูกศรนำทางแยกสี และจุดสอบถามข้อมูลบัตรโดยสาร',
    },
    culturalNote: {
      en: 'At busy Australian transit stations, asking "Excuse me, which platform goes to Darling Harbour?" or "Could you confirm the departure time?" keeps travel smooth.',
      th: 'เมื่อเดินทางในซิดนีย์ ประโยคอย่าง "Excuse me, which platform goes to...?" หรือการขอให้เจ้าหน้าที่ทวนเวลาเดินรถช่วยให้ไม่หลงทาง',
    },
    interactionSpark: {
      en: 'Communication Spotlight: Check routes, ticket options, and polite clarification questions with Noah.',
      th: 'จุดเน้นการสื่อสาร: ฝึกสอบถามเส้นทาง ค่าโดยสาร และทวนคำตอบให้มั่นใจกับโนอาห์',
    },
    recommendedNpcId: 'npc_noah',
    position: { x: -10.2, z: 4.6 },
    interactionRadius: 2.9,
    accentColor: '#2563EB',
  },
  {
    id: 'harbour_market_cafe',
    order: 3,
    title: {
      en: 'Harbour Market & Café',
      th: 'ตลาดริมอ่าวและคาเฟ่ (Harbour Market & Café)',
    },
    subtitle: {
      en: 'Open-Air Food Stalls & Espresso Patio',
      th: 'ร้านอาหารเปิดโล่งและมุมคาเฟ่ริมน้ำ',
    },
    languageFocus: {
      en: 'Ordering Food, Prices & Polite Requests',
      th: 'การสั่งอาหาร สอบถามราคา และคำขออย่างสุภาพ',
    },
    districtBadge: { en: 'Stop 3 · East Market', th: 'จุดที่ 3 · ตลาดฝั่งตะวันออก' },
    description: {
      en: 'Striped coastal awnings, chalkboard menus, fresh pastry counters, and sunny patio tables where locals gather for brunch and flat whites.',
      th: 'กันสาดลายทางสีสด กระดานเมนูหน้าร้าน เคาน์เตอร์ขนมอบ และโต๊ะกลางแจ้งที่ชาวเมืองนิยมมานั่งพักทานมื้อสายริมอ่าว',
    },
    culturalNote: {
      en: 'Polite requests in Australian cafés use frames like "Could I please have...", "How much is the banana bread?", and cheerful thank-yous.',
      th: 'ในคาเฟ่ออสเตรเลีย การใช้ "Could I please have..." และ "How much is...?" พร้อมคำขอบคุณที่สุภาพสร้างบรรยากาศที่เป็นมิตร',
    },
    interactionSpark: {
      en: 'Communication Spotlight: Browse menu items, ask prices, and make a polite food request with Mia.',
      th: 'จุดเน้นการสื่อสาร: ดูรายการอาหาร ถามราคา และฝึกสั่งเครื่องดื่มอย่างสุภาพกับมีอา',
    },
    recommendedNpcId: 'npc_mia',
    position: { x: 10.2, z: 4.6 },
    interactionRadius: 2.9,
    accentColor: '#EA580C',
  },
  {
    id: 'darling_harbour_hub',
    order: 4,
    title: {
      en: 'Darling Harbour Discovery Hub',
      th: 'ศูนย์ท่องเที่ยวและกิจกรรมดาร์ลิงฮาร์เบอร์',
    },
    subtitle: {
      en: 'Visitor Pavilion, Attractions & Tourism Desk',
      th: 'ศาลาบริการนักท่องเที่ยวและเคาน์เตอร์กิจกรรม',
    },
    languageFocus: {
      en: 'Asking About Attractions, Schedules & Recommendations',
      th: 'การถามข้อมูลสถานที่ท่องเที่ยว ตารางเวลา และขอคำแนะนำ',
    },
    districtBadge: { en: 'Stop 4 · Northeast Waterfront', th: 'จุดที่ 4 · ท่าเรือฝั่งตะวันออกเฉียงเหนือ' },
    description: {
      en: 'A vibrant waterfront visitor pavilion displaying exhibition posters, ferry tour timetables, aquarium highlights, and friendly recommendation boards.',
      th: 'ศูนย์ข้อมูลท่องเที่ยวสีสันสดใสริมน้ำที่รวมโปสเตอร์นิทรรศการ รอบเวลาล่องเรือ และคำแนะนำสถานที่น่าสนใจ',
    },
    culturalNote: {
      en: 'Visitor guides welcome open questions such as "What do you recommend for this afternoon?" or "What time does the last ferry leave?"',
      th: 'เจ้าหน้าที่ศูนย์ข้อมูลยินดีตอบคำถามปลายเปิด เช่น "What do you recommend...?" หรือ "What time does... close?" เพื่อช่วยวางแผนเที่ยว',
    },
    interactionSpark: {
      en: 'Communication Spotlight: Ask Jack about popular harbour attractions, opening hours, and local tips.',
      th: 'จุดเน้นการสื่อสาร: ลองถามแจ็กเกี่ยวกับสถานที่แนะนำ เวลาเปิดปิด และกิจกรรมยอดนิยม',
    },
    recommendedNpcId: 'npc_jack',
    position: { x: 9.0, z: -7.0 },
    interactionRadius: 3.0,
    accentColor: '#9333EA',
  },
  {
    id: 'harbour_gardens_help_point',
    order: 5,
    title: {
      en: 'Harbour Gardens Help Point',
      th: 'สวนสาธารณะริมอ่าวและจุดขอความช่วยเหลือ',
    },
    subtitle: {
      en: 'Coastal Park Paths & Support Totem',
      th: 'เส้นทางเดินชมสวนริมน้ำและป้ายช่วยเหลืออัจฉริยะ',
    },
    languageFocus: {
      en: 'Asking for Help, Requesting Repetition & Resolving Misunderstandings',
      th: 'การขอความช่วยเหลือ ขอให้พูดซ้ำ และแก้ไขความเข้าใจคลาดเคลื่อน',
    },
    districtBadge: { en: 'Stop 5 · Northwest Parkland', th: 'จุดที่ 5 · สวนริมน้ำฝั่งตะวันตกเฉียงเหนือ' },
    description: {
      en: 'Shady coastal palms, flowering native beds, timber waterfront benches, and a bright teal Info Help Point overlooking the calm blue harbour.',
      th: 'สวนร่มรื่นด้วยต้นปาล์มและดอกไม้ชายฝั่ง ม้านั่งไม้ชมวิวอ่าว และเสาข้อมูลช่วยเหลือสีฟ้าครามสำหรับผู้มาเยือน',
    },
    culturalNote: {
      en: 'Good communicators never worry about missing a detail! Phrases like "Sorry, could you say that more slowly?" keep real conversations confident.',
      th: 'นักสื่อสารที่ดีไม่กลัวที่จะถามซ้ำ ประโยคอย่าง "Sorry, could you say that more slowly?" ช่วยให้เข้าใจตรงกันอย่างมั่นใจ',
    },
    interactionSpark: {
      en: 'Communication Spotlight: Practice asking for help, repetition, and gentle clarification at the Help Point.',
      th: 'จุดเน้นการสื่อสาร: ฝึกขอความช่วยเหลือและขอให้ทวนคำอธิบายอย่างสุภาพที่จุดช่วยเหลือ',
    },
    recommendedNpcId: 'npc_olivia',
    position: { x: -9.4, z: -7.0 },
    interactionRadius: 3.0,
    accentColor: '#10B981',
  },
];

export const AUSTRALIA_INTERACTIVE_TARGETS: AustraliaInteractiveTarget[] = [
  ...AUSTRALIA_NPC_TARGETS,
  ...AUSTRALIA_LANDMARKS.map((landmark) => ({
    id: landmark.id as AustraliaPoiId,
    kind: 'landmark' as const,
    title: landmark.title,
    position: landmark.position,
    interactionRadius: landmark.interactionRadius,
    accentColor: landmark.accentColor,
  })),
];

export const AUSTRALIA_NPC_DIALOGUES: Record<AustraliaNpcId, AustraliaNpcDialogueEntry> = {
  npc_olivia: {
    id: 'npc_olivia',
    name: 'Olivia Parker',
    role: { en: 'Sydney Explorer Guide', th: 'มัคคุเทศก์สำรวจซิดนีย์' },
    locationName: { en: 'Circular Quay Welcome Plaza', th: 'ลานต้อนรับเซอร์คิวลาร์คีย์' },
    accentColor: '#0EA5E9',
    voiceRate: 0.96,
    voicePitch: 1.05,
    greetingQuote: {
      en: 'Welcome to Sydney! This city is full of exciting places to explore. But every great adventure begins with communication. Ready to discover how people connect in English?',
      th: 'ยินดีต้อนรับสู่ซิดนีย์! เมืองนี้เต็มไปด้วยสถานที่น่าตื่นตาให้สำรวจ แต่การผจญภัยที่ดีล้วนเริ่มต้นจากการสื่อสาร พร้อมจะค้นพบวิธีที่ผู้คนพูดคุยเชื่อมโยงกันเป็นภาษาอังกฤษหรือยัง?',
    },
    followUpTip: {
      en: 'Take a walk along all five harbour districts and check your City Explorer Guide anytime. Meet Noah at City Transit, Mia at Harbour Market & Café, Jack at Darling Harbour, and visit the Harbour Gardens Help Point!',
      th: 'ลองเดินสำรวจให้ครบทั้ง 5 จุดริมอ่าวและเปิดดูคู่มือนักสำรวจเมือง (City Explorer Guide) ได้ตลอดเวลา อย่าลืมทักทายโนอาห์ มีอา แจ็ก และแวะจุดช่วยเหลือในสวนด้วยนะ!',
    },
    harbourGardensHelperNote: {
      en: 'Olivia’s Harbour Gardens Tip: If someone speaks fast in a busy city, just smile and say, "Excuse me, could you repeat that, please?" Every helpful local is happy to slow down and clarify.',
      th: 'เคล็ดลับจากโอลิเวียที่สวนริมอ่าว: หากเจอคนพูดเร็วในเมืองใหญ่ ลองยิ้มแล้วพูดว่า "Excuse me, could you repeat that, please?" คนท้องถิ่นพร้อมช่วยพูดซ้ำให้เข้าใจแน่นอน',
    },
  },
  npc_noah: {
    id: 'npc_noah',
    name: 'Noah Williams',
    role: { en: 'Transit Staff', th: 'เจ้าหน้าที่สถานีขนส่ง' },
    locationName: { en: 'City Transit Station', th: 'สถานีขนส่งมวลชนซิดนีย์' },
    accentColor: '#2563EB',
    voiceRate: 0.95,
    voicePitch: 0.96,
    greetingQuote: {
      en: 'G’day! I’m Noah at City Transit Station. Travellers ask me about train platforms, return tickets, and ferry transfers all day long.',
      th: 'สวัสดี! ฉันชื่อโนอาห์ ประจำที่สถานีขนส่งมวลชนซิดนีย์ นักท่องเที่ยวมักมาถามเรื่องชานชาลารถไฟ ตั๋วไป-กลับ และการต่อเรือเฟอร์รี่ตลอดทั้งวัน',
    },
    followUpTip: {
      en: 'Soon you’ll practice polite directions and clarifying train times right here. For now, have a look at the platform signage and explore the rest of Sydney Harbour!',
      th: 'เร็วๆ นี้คุณจะได้ฝึกถามทางและยืนยันเวลารถไฟที่นี่ ตอนนี้ลองสังเกตป้ายชานชาลาและเดินสำรวจรอบอ่าวซิดนีย์ก่อนได้เลย!',
    },
  },
  npc_mia: {
    id: 'npc_mia',
    name: 'Mia Chen',
    role: { en: 'Café Staff', th: 'พนักงานคาเฟ่ริมอ่าว' },
    locationName: { en: 'Harbour Market & Café', th: 'ตลาดริมอ่าวและคาเฟ่' },
    accentColor: '#EA580C',
    voiceRate: 0.98,
    voicePitch: 1.07,
    greetingQuote: {
      en: 'Hi there! Welcome to Harbour Market & Café. I’m Mia—we bake fresh croissants and serve cold smoothies right beside the water.',
      th: 'สวัสดีค่ะ! ยินดีต้อนรับสู่ตลาดริมอ่าวและคาเฟ่ ฉันชื่อมีอา ที่นี่อบครัวซองต์สดใหม่และมีสมูทตี้เย็นๆ ริมน้ำให้บริการเลย',
    },
    followUpTip: {
      en: 'In upcoming stages, you’ll order food, check menu prices, and make polite café requests in English. Feel free to inspect the chalkboard menu and patio!',
      th: 'ในด่านถัดไป คุณจะได้ฝึกสั่งอาหาร ถามราคาบนเมนู และใช้คำขอสุภาพในคาเฟ่ ตอนนี้ลองชมหน้าร้านและมุมตลาดได้เลย!',
    },
  },
  npc_jack: {
    id: 'npc_jack',
    name: 'Jack Thompson',
    role: { en: 'Visitor Centre Guide', th: 'เจ้าหน้าที่ศูนย์ข้อมูลท่องเที่ยว' },
    locationName: { en: 'Darling Harbour Discovery Hub', th: 'ศูนย์ท่องเที่ยวและกิจกรรมดาร์ลิงฮาร์เบอร์' },
    accentColor: '#9333EA',
    voiceRate: 0.94,
    voicePitch: 0.94,
    greetingQuote: {
      en: 'Welcome to the Darling Harbour Discovery Hub! I’m Jack. From aquarium hours to harbour sunset cruises, visitors love asking for local recommendations.',
      th: 'ยินดีต้อนรับสู่ศูนย์กิจกรรมดาร์ลิงฮาร์เบอร์! ผมแจ็กครับ ทั้งเวลาเปิดอควาเรียมไปจนถึงรอบล่องเรือชมพระอาทิตย์ตก นักท่องเที่ยวมักมาขอคำแนะนำที่นี่เสมอ',
    },
    followUpTip: {
      en: 'Check out our colourful attraction boards here on the waterfront—and don’t forget Harbour Gardens across the cove for helpful communication tips!',
      th: 'แวะชมป้ายแนะนำสถานที่ท่องเที่ยวสีสันสดใสตรงหน้าได้นะ และอย่าลืมเดินไปชมสวน Harbour Gardens เพื่อดูเคล็ดลับการสื่อสารด้วย!',
    },
  },
};
