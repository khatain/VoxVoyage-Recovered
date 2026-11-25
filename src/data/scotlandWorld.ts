import type { LocalizedText } from '../types/game';
import type { BoxObstacle, CircleObstacle } from './jaipurWorld';

export type ScotlandLandmarkId =
  | 'highland_village_square'
  | 'tartan_heritage_workshop'
  | 'highland_food_market'
  | 'highland_games_ground'
  | 'lochside_castle_viewpoint';

export type ScotlandNpcId = 'npc_eilidh' | 'npc_fiona';
export type ScotlandPoiId = ScotlandNpcId | ScotlandLandmarkId;

export const SCOTLAND_MISSION_ID = 'mission_scotland_highlands';

/**
 * Extensible stage activity identifiers reserved for future Phase 3B–3E Scotland learning stages.
 * Not awarded or marked complete in Phase 3A.
 */
export const SCOTLAND_STAGE_ACTIVITY_IDS = {
  discover: 'scotland_highland_discovery',
  build: 'scotland_culture_contrast_builder',
  practice: 'scotland_exchange_dialogue_practice',
  perform: 'scotland_cultural_showcase_perform',
} as const;

export const SCOTLAND_PASSPORT_STAMP_ID = 'stamp_scotland_highlands';

export interface ScotlandLandmark {
  id: ScotlandLandmarkId;
  order: number;
  title: LocalizedText;
  subtitle: LocalizedText;
  culturalFocus: LocalizedText;
  heritageBadge: LocalizedText;
  description: LocalizedText;
  culturalAccuracyNote: LocalizedText;
  comparisonSpark: LocalizedText;
  position: { x: number; z: number };
  interactionRadius: number;
  accentColor: string;
}

export interface ScotlandInteractiveTarget {
  id: ScotlandPoiId;
  kind: 'npc' | 'landmark';
  title: LocalizedText;
  position: { x: number; z: number };
  interactionRadius: number;
  accentColor: string;
}

export const SCOTLAND_SPAWN = {
  x: 0,
  z: 14.0,
  yaw: Math.PI,
};

export const SCOTLAND_BOUNDS = {
  minX: -20.5,
  maxX: 20.5,
  minZ: -17.5,
  maxZ: 17.5,
  playerRadius: 0.42,
};

export const SCOTLAND_EILIDH_POS = {
  x: 2.3,
  z: 8.8,
  idleYaw: -0.45,
};

export const SCOTLAND_FIONA_POS = {
  x: -2.4,
  z: -2.4,
  idleYaw: 0.35,
};

export const SCOTLAND_BOX_OBSTACLES: BoxObstacle[] = [
  // West Village Stone Cottage (-6.8, 7.8)
  { id: 'village_cottage_west', minX: -9.2, maxX: -4.4, minZ: 5.8, maxZ: 9.8 },
  // East Village Stone Cottage (6.9, 8.2)
  { id: 'village_cottage_east', minX: 4.6, maxX: 9.2, minZ: 6.2, maxZ: 10.2 },
  // Tartan & Heritage Workshop shopfront (-14.2, 2.2)
  { id: 'tartan_workshop_building', minX: -16.8, maxX: -11.9, minZ: -0.2, maxZ: 4.6 },
  // Outdoor weaving loom & tartan display rack beside Workshop
  { id: 'tartan_display_rack', minX: -11.4, maxX: -9.4, minZ: -1.4, maxZ: 0.2 },
  // Highland Food Market stalls (East side)
  { id: 'food_stall_north', minX: 12.2, maxX: 15.6, minZ: -0.4, maxZ: 2.1 },
  { id: 'food_stall_south', minX: 12.2, maxX: 15.6, minZ: 2.9, maxZ: 5.4 },
  // Highland Games raised music stage (-13.2, -10.8)
  { id: 'highland_games_stage', minX: -15.6, maxX: -10.8, minZ: -12.6, maxZ: -9.0 },
  // Safe decorative caber & stone-put rack (-7.4, -12.2)
  { id: 'highland_games_equipment', minX: -8.9, maxX: -5.9, minZ: -13.1, maxZ: -11.5 },
  // Stone Bridge Parapet Walls spanning the Highland burn at (x: 2.8..6.2, z: -8.5) leaving central walkway clear
  { id: 'stone_bridge_parapet_north', minX: 2.8, maxX: 6.2, minZ: -9.95, maxZ: -9.5 },
  { id: 'stone_bridge_parapet_south', minX: 2.8, maxX: 6.2, minZ: -7.5, maxZ: -7.05 },
  // Highland Burn (stream) running North-South into the loch (player crosses via bridge or southern cobblestones)
  { id: 'burn_south_stream', minX: 3.7, maxX: 5.3, minZ: -7.05, maxZ: -3.2 },
  { id: 'burn_north_stream', minX: 3.7, maxX: 5.3, minZ: -14.4, maxZ: -9.95 },
  // Loch shoreline boundary along the far north edge
  { id: 'loch_northern_shore', minX: -20.5, maxX: 20.5, minZ: -18.5, maxZ: -14.2 },
];

export const SCOTLAND_CIRCLE_OBSTACLES: CircleObstacle[] = [
  // NPC Personal Spaces
  { id: 'npc_eilidh', x: SCOTLAND_EILIDH_POS.x, z: SCOTLAND_EILIDH_POS.z, radius: 0.62 },
  { id: 'npc_fiona', x: SCOTLAND_FIONA_POS.x, z: SCOTLAND_FIONA_POS.z, radius: 0.62 },
  // Village Square Central Stone Fountain
  { id: 'village_fountain', x: 0, z: 6.4, radius: 1.55 },
  // Lochside Viewpoint Cairn & Brass Telescope Stand
  { id: 'lochside_cairn', x: 11.4, z: -10.5, radius: 0.72 },
  // Highland Scots Pine & Rowan Trees framing the village & glens
  { id: 'tree_sw_pine', x: -12.8, z: 10.6, radius: 0.75 },
  { id: 'tree_se_pine', x: 13.0, z: 10.4, radius: 0.75 },
  { id: 'tree_mid_west_rowan', x: -15.5, z: -4.6, radius: 0.72 },
  { id: 'tree_mid_east_rowan', x: 16.4, z: -4.4, radius: 0.72 },
  { id: 'tree_games_north', x: -16.2, z: -13.6, radius: 0.78 },
  { id: 'tree_loch_east', x: 15.8, z: -9.8, radius: 0.76 },
  // Mossy Highland Boulders
  { id: 'boulder_sw', x: -15.2, z: 12.8, radius: 1.05 },
  { id: 'boulder_se', x: 15.6, z: 12.6, radius: 1.0 },
  { id: 'boulder_nw', x: -18.0, z: -8.0, radius: 1.1 },
];

export const SCOTLAND_NPC_TARGETS: ScotlandInteractiveTarget[] = [
  {
    id: 'npc_eilidh',
    kind: 'npc',
    title: { en: 'Eilidh MacLeod', th: 'ไอลีด แม็กลอยด์ (Eilidh)' },
    position: { x: SCOTLAND_EILIDH_POS.x, z: SCOTLAND_EILIDH_POS.z },
    interactionRadius: 2.8,
    accentColor: '#3A7D6C',
  },
  {
    id: 'npc_fiona',
    kind: 'npc',
    title: { en: 'Fiona Campbell', th: 'ฟิโอนา แคมป์เบลล์ (Fiona)' },
    position: { x: SCOTLAND_FIONA_POS.x, z: SCOTLAND_FIONA_POS.z },
    interactionRadius: 2.8,
    accentColor: '#7B5EA7',
  },
];

export const SCOTLAND_LANDMARKS: ScotlandLandmark[] = [
  {
    id: 'highland_village_square',
    order: 1,
    title: { en: 'Highland Village Square', th: 'จัตุรัสหมู่บ้านไฮแลนด์' },
    subtitle: { en: 'Community & Everyday Life', th: 'วิถีชุมชนและชีวิตประจำวัน' },
    culturalFocus: {
      en: 'Scottish Community Life & Daily Routines',
      th: 'วิถีชุมชนสกอตแลนด์และกิจวัตรประจำวัน',
    },
    heritageBadge: { en: 'Village Life', th: 'วิถีหมู่บ้าน' },
    description: {
      en: 'Granite cottages with slate roofs, flower boxes of purple heather, and a central carved stone fountain form the welcoming heart of this Highland town.',
      th: 'กระท่อมหินแกรนิตหลังคาหินชนวน กระบะดอกเฮเทอร์สีม่วง และน้ำพุหินกลางลานเป็นหัวใจอันอบอุ่นของชุมชนไฮแลนด์',
    },
    culturalAccuracyNote: {
      en: 'Modern Highland villages blend historic stone cottages with everyday routines like walking to school, cozy cafes, and local community noticeboards.',
      th: 'หมู่บ้านไฮแลนด์ยุคใหม่ผสานบ้านหินโบราณเข้ากับชีวิตประจำวันร่วมสมัย เช่น การเดินไปโรงเรียน ร้านกาแฟ และบอร์ดข่าวสารชุมชน',
    },
    comparisonSpark: {
      en: 'Look around: How is a Scottish village square similar to or different from a Thai town plaza or wat courtyard?',
      th: 'ชวนสังเกต: จัตุรัสหมู่บ้านของสกอตแลนด์เหมือนหรือต่างจากลานชุมชนหรือลานวัดในไทยอย่างไร?',
    },
    position: { x: 0, z: 3.6 },
    interactionRadius: 2.85,
    accentColor: '#2B8C7E',
  },
  {
    id: 'tartan_heritage_workshop',
    order: 2,
    title: { en: 'Tartan & Heritage Workshop', th: 'เวิร์กชอปผ้าทาร์ทันและมรดกวัฒนธรรม' },
    subtitle: { en: 'Textiles, Weaving & Dress', th: 'สิ่งทอ ลายผ้า และการแต่งกาย' },
    culturalFocus: {
      en: 'Scottish Traditional Clothing & Textiles',
      th: 'เครื่องแต่งกายและสิ่งทอพื้นเมืองสกอตแลนด์',
    },
    heritageBadge: { en: 'Traditional Craft', th: 'งานฝีมือดั้งเดิม' },
    description: {
      en: 'Crisp criss-crossing wool tartans hang outside a timber shopfront alongside a traditional loom frame and craft tools.',
      th: 'ผ้าขนสัตว์ลายตารางทาร์ทันสีสดแขวนเรียงหน้าร้านไม้ พร้อมกี่ทอผ้าและเครื่องมืองานฝีมือแบบดั้งเดิม',
    },
    culturalAccuracyNote: {
      en: 'Today, most people in Scotland wear casual modern clothing like jackets and jeans, saving kilts and formal tartan outfits for weddings, graduations, and festivals.',
      th: 'ในชีวิตประจำวันปัจจุบัน ชาวสกอตแลนด์ส่วนใหญ่สวมเสื้อผ้าสมัยใหม่ ส่วนกระโปรงคิลต์และชุดทาร์ทันมักสวมในงานแต่งงาน พิธีสำคัญ และเทศกาล',
    },
    comparisonSpark: {
      en: 'Compare: Both tartan wool and Thai woven silk celebrate regional patterns—when do people wear traditional dress in each place?',
      th: 'ชวนเปรียบเทียบ: ทั้งผ้าทาร์ทันและผ้าไหมทอมือไทยต่างมีลวดลายเอกลักษณ์ท้องถิ่น ผู้คนสวมใส่ชุดดั้งเดิมในโอกาสใดบ้าง?',
    },
    position: { x: -9.8, z: 2.2 },
    interactionRadius: 2.9,
    accentColor: '#C84B43',
  },
  {
    id: 'highland_food_market',
    order: 3,
    title: { en: 'Highland Food Market', th: 'ตลาดอาหารพื้นบ้านไฮแลนด์' },
    subtitle: { en: 'Oats, Berries & Cozy Stalls', th: 'ข้าวโอ๊ต เบอร์รี และอาหารอบอุ่น' },
    culturalFocus: {
      en: 'Scottish Foods, Ingredients & Meal Traditions',
      th: 'อาหาร วัตถุดิบ และวัฒนธรรมการกินของสกอตแลนด์',
    },
    heritageBadge: { en: 'Regional Flavors', th: 'รสชาติท้องถิ่น' },
    description: {
      en: 'Timber market stalls display golden oatcakes, butter shortbread, Highland berries, and warm savory soups prepared near a stone hearth.',
      th: 'แผงตลาดไม้จัดวางขนมปังข้าวโอ๊ต ชอร์ตเบรดเนยสด เบอร์รีเมืองหนาว และซุปอุ่น ๆ ใกล้เตาหิน',
    },
    culturalAccuracyNote: {
      en: 'Cool Highland climates shaped hearty oat and barley staples, though modern Scottish kitchens also enjoy international dishes from around the world.',
      th: 'อากาศหนาวเย็นของไฮแลนด์ทำให้อาหารดั้งเดิมเน้นข้าวโอ๊ตและข้าวบาร์เลย์ ขณะที่ครัวสกอตแลนด์ยุคใหม่ก็นิยมอาหารนานาชาติหลากหลายเช่นกัน',
    },
    comparisonSpark: {
      en: 'Contrast: While Scottish markets feature warm baked shortbread and porridge, Thai markets burst with fragrant herbs and jasmine rice.',
      th: 'ชวนสังเกตความต่าง: ตลาดสกอตแลนด์เด่นเรื่องชอร์ตเบรดอบและข้าวโอ๊ต ขณะที่ตลาดไทยอุดมไปด้วยสมุนไพรหอมและข้าวหอมมะลิ',
    },
    position: { x: 9.8, z: 2.2 },
    interactionRadius: 2.9,
    accentColor: '#D98E32',
  },
  {
    id: 'highland_games_ground',
    order: 4,
    title: { en: 'Highland Games Festival Ground', th: 'ลานเทศกาลไฮแลนด์เกมส์' },
    subtitle: { en: 'Music, Dance & Celebrations', th: 'ดนตรี การเต้น และเทศกาลชุมชน' },
    culturalFocus: {
      en: 'Highland Games, Folk Music & Community Festivals',
      th: 'การละเล่นไฮแลนด์เกมส์ ดนตรีพื้นบ้าน และงานเทศกาล',
    },
    heritageBadge: { en: 'Regional Festival', th: 'เทศกาลภูมิภาค' },
    description: {
      en: 'Tartan pennants flutter above a grassy arena and wooden music stage with fiddles and drums beside safe decorative heavy-event props.',
      th: 'ธงราวผ้าทาร์ทันโบกสะบัดเหนือลานหญ้าและเวทีดนตรีพื้นบ้าน พร้อมอุปกรณ์จำลองการละเล่นพื้นเมืองที่ปลอดภัย',
    },
    culturalAccuracyNote: {
      en: 'Highland Games take place mainly during summer gatherings across Scottish towns, combining traditional athletics, bagpipes, fiddle music, and community picnics.',
      th: 'เทศกาลไฮแลนด์เกมส์มักจัดขึ้นช่วงฤดูร้อนตามเมืองต่าง ๆ ผสานกีฬาพื้นบ้าน ดนตรีปี่สกอต ฟิดเดิล และการปิกนิกของชุมชน',
    },
    comparisonSpark: {
      en: 'Compare: How do outdoor summer Highland festivals compare with seasonal Thai celebrations like Songkran or Loy Krathong?',
      th: 'ชวนเปรียบเทียบ: เทศกาลกลางแจ้งฤดูร้อนของไฮแลนด์เหมือนหรือต่างจากเทศกาลสงกรานต์และลอยกระทงของไทยอย่างไร?',
    },
    position: { x: -8.6, z: -7.8 },
    interactionRadius: 3.1,
    accentColor: '#5664B8',
  },
  {
    id: 'lochside_castle_viewpoint',
    order: 5,
    title: { en: 'Lochside Castle Viewpoint', th: 'จุดชมวิวปราสาทและทะเลสาบไฮแลนด์' },
    subtitle: { en: 'Lochs, Glens & Historic Architecture', th: 'ทะเลสาบ หุบเขา และปราสาทหิน' },
    culturalFocus: {
      en: 'Scottish Landscapes, Castles & Heritage Preservation',
      th: 'ภูมิประเทศสกอตแลนด์ ปราสาท และการอนุรักษ์มรดก',
    },
    heritageBadge: { en: 'Historic Landmark', th: 'มรดกทางประวัติศาสตร์' },
    description: {
      en: 'Cross the arched stone footbridge to a lakeside timber pier facing emerald munro hills, shimmering loch water, and a distant stone castle keep.',
      th: 'เดินข้ามสะพานหินโค้งสู่ท่าน้ำไม้ริมทะเลสาบ ชมทิวเขาสูงสีเขียว ผืนน้ำสะท้อนฟ้า และหอคอยปราสาทหินฝั่งตรงข้าม',
    },
    culturalAccuracyNote: {
      en: 'In Scotland, "loch" is the Scots and Scottish Gaelic word for a lake or sea inlet. Historic castles are preserved today as heritage museums for visitors.',
      th: 'คำว่า "Loch" (ล็อก) ในภาษาสกอตและแกลิกแปลว่าทะเลสาบ ปราสาทหินเก่าแก่จำนวนมากในปัจจุบันได้รับการอนุรักษ์เป็นแหล่งเรียนรู้และท่องเที่ยว',
    },
    comparisonSpark: {
      en: 'Reflect: Unlike Thailand’s tropical gilded temples and warm river towns, Scotland preserves cool stone castles beside mountain lochs.',
      th: 'ชวนคิด: ต่างจากวัดสีทองและเมืองริมน้ำเขตร้อนของไทย สกอตแลนด์อนุรักษ์ปราสาทหินเคียงข้างทะเลสาบกลางหุบเขาหนาว',
    },
    position: { x: 8.8, z: -9.0 },
    interactionRadius: 3.1,
    accentColor: '#3B78A8',
  },
];

export const SCOTLAND_INTERACTIVE_TARGETS: ScotlandInteractiveTarget[] = [
  ...SCOTLAND_NPC_TARGETS,
  ...SCOTLAND_LANDMARKS.map((landmark) => ({
    id: landmark.id,
    kind: 'landmark' as const,
    title: landmark.title,
    position: landmark.position,
    interactionRadius: landmark.interactionRadius,
    accentColor: landmark.accentColor,
  })),
];

export const EILIDH_DIALOGUE = {
  welcome: {
    en: "Welcome to Scotland! I'm Eilidh. I'll show you some of our traditions. I'd love to learn about Thailand too!",
    th: 'ยินดีต้อนรับสู่สกอตแลนด์! ฉันชื่อไอลีด เดี๋ยวฉันจะพาชมประเพณีของพวกเรานะ และฉันก็อยากเรียนรู้เรื่องของประเทศไทยด้วย!',
  },
  exploreProgress: (visitedCount: number, totalCount: number): LocalizedText => ({
    en:
      visitedCount >= totalCount
        ? 'Brilliant! You have explored all five Highland spots! Feel free to revisit the stone bridge, tartan workshop, or food market anytime.'
        : `Take your time wandering the village! You have explored ${visitedCount} of ${totalCount} landmarks so far—check out the workshop, food market, games ground, and lochside castle view.`,
    th:
      visitedCount >= totalCount
        ? 'สุดยอดเลย! คุณสำรวจครบทั้ง 5 จุดในไฮแลนด์แล้ว เดินเล่นชมสะพานหิน เวิร์กชอปผ้าทาร์ทัน หรือตลาดอาหารต่อได้ตามสบายเลยนะ'
        : `เดินชมหมู่บ้านตามสบายเลยนะ ตอนนี้คุณสำรวจแล้ว ${visitedCount} จาก ${totalCount} จุด อย่าลืมแวะเวิร์กชอป ตลาดอาหาร ลานเทศกาล และจุดชมวิวปราสาทริมทะเลสาบ`,
  }),
};

export const FIONA_DIALOGUE = {
  intro: {
    en: "Hello there! I'm Fiona, the local heritage guide. Across our village you'll find living traditions—tartan weaving, Highland markets, summer games, and historic lochside stone castles.",
    th: 'สวัสดีจ้ะ! ฉันชื่อฟิโอนา มัคคุเทศก์มรดกวัฒนธรรมท้องถิ่น รอบหมู่บ้านนี้มีทั้งงานทอผ้าทาร์ทัน ตลาดอาหาร ลานเทศกาลฤดูร้อน และปราสาทหินเก่าแก่ริมทะเลสาบให้ชมเลย',
  },
  heritageTip: {
    en: 'Remember that Scottish culture mixes long-standing regional traditions with ordinary modern life—just like Thailand balances ancient heritage with bustling contemporary cities!',
    th: 'อย่าลืมว่าวัฒนธรรมสกอตแลนด์ผสานประเพณีท้องถิ่นอันยาวนานเข้ากับชีวิตสมัยใหม่อย่างกลมกลืน เช่นเดียวกับประเทศไทยที่มีทั้งมรดกวัฒนธรรมและเมืองยุคใหม่ที่มีชีวิตชีวา',
  },
};
