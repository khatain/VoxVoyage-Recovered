import type { LocalizedText } from '../types/game';
import type { BoxObstacle, CircleObstacle } from './jaipurWorld';

export type KenyaLandmarkId =
  | 'ranger_camp'
  | 'elephant_grassland'
  | 'giraffe_acacia_grove'
  | 'zebra_watering_hole'
  | 'conservation_lookout';

export type KenyaPoiId = 'local_guide' | KenyaLandmarkId;

export interface KenyaLandmark {
  id: KenyaLandmarkId;
  order: number;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  wildlifeNote: LocalizedText;
  position: { x: number; z: number };
  interactionRadius: number;
  accentColor: string;
}

export interface KenyaInteractiveTarget {
  id: KenyaPoiId;
  kind: 'npc' | 'landmark';
  title: LocalizedText;
  position: { x: number; z: number };
  interactionRadius: number;
  accentColor: string;
}

export const KENYA_SPAWN = {
  x: 0,
  z: 12.8,
  yaw: Math.PI,
};

export const KENYA_BOUNDS = {
  minX: -19.5,
  maxX: 19.5,
  minZ: -18.0,
  maxZ: 17.5,
  playerRadius: 0.42,
};

export const KENYA_AMINA_POS = {
  x: 1.9,
  z: 9.2,
  idleYaw: -0.35,
};

export const KENYA_TOURIST_VIEWPOINTS: Record<
  KenyaLandmarkId,
  { x: number; z: number; idleYaw: number; npcId: 'emma' | 'daniel' }
> = {
  ranger_camp: { x: -2.8, z: 6.2, idleYaw: -2.35, npcId: 'emma' },
  elephant_grassland: { x: -7.6, z: -3.8, idleYaw: -1.35, npcId: 'emma' },
  giraffe_acacia_grove: { x: 7.8, z: -3.4, idleYaw: 1.38, npcId: 'emma' },
  zebra_watering_hole: { x: -0.7, z: -10.8, idleYaw: -1.75, npcId: 'daniel' },
  conservation_lookout: { x: 4.3, z: -11.6, idleYaw: -2.65, npcId: 'daniel' },
};

export const KENYA_BOX_OBSTACLES: BoxObstacle[] = [
  // Safari Ranger Tent (West side of Ranger Camp)
  { id: 'ranger_tent', minX: -6.9, maxX: -2.9, minZ: 8.1, maxZ: 11.7 },
  // Safari Jeep (East side of Ranger Camp)
  { id: 'safari_jeep', minX: 3.1, maxX: 7.3, minZ: 9.1, maxZ: 12.1 },
  // Wooden Camp Information Board
  { id: 'camp_info_board', minX: -2.4, maxX: -0.7, minZ: 7.6, maxZ: 8.5 },
  // Elevated Wooden Conservation Lookout Platform (North-East ridge)
  { id: 'conservation_lookout_deck', minX: 7.5, maxX: 12.5, minZ: -15.4, maxZ: -10.8 },
  // Conservation Info Sign beside Lookout
  { id: 'lookout_info_sign', minX: 6.2, maxX: 7.4, minZ: -10.9, maxZ: -10.0 },
];

export const KENYA_CIRCLE_OBSTACLES: CircleObstacle[] = [
  // Ranger Amina Odhiambo personal space
  { id: 'npc_amina', x: KENYA_AMINA_POS.x, z: KENYA_AMINA_POS.z, radius: 0.64 },
  // Camp Lantern & Supply Crate Cluster
  { id: 'camp_supply_crate', x: -2.4, z: 12.2, radius: 0.72 },
  // Zebra Watering Hole basin (North-West savanna)
  { id: 'watering_hole_basin', x: -5.2, z: -12.0, radius: 3.45 },
  // Grazing Zebras near shoreline
  { id: 'zebra_1', x: -8.3, z: -10.2, radius: 0.75 },
  { id: 'zebra_2', x: -2.2, z: -14.1, radius: 0.75 },
  // Elephant family in Elephant Grassland (West plains)
  { id: 'elephant_matriarch', x: -14.2, z: -2.6, radius: 1.45 },
  { id: 'elephant_calf', x: -12.4, z: -4.8, radius: 0.95 },
  { id: 'elephant_companion', x: -15.8, z: 0.2, radius: 1.35 },
  // Acacia Tree Trunks & Browsing Giraffes (East Acacia Grove)
  { id: 'acacia_grove_1', x: 13.4, z: -2.6, radius: 0.7 },
  { id: 'acacia_grove_2', x: 15.8, z: 1.8, radius: 0.7 },
  { id: 'acacia_grove_3', x: 12.0, z: -6.2, radius: 0.68 },
  { id: 'giraffe_1', x: 13.7, z: 0.4, radius: 0.88 },
  { id: 'giraffe_2', x: 11.4, z: -3.9, radius: 0.85 },
  // Scenic Savanna Boulders / Kopjes framing paths
  { id: 'kopje_nw', x: -14.8, z: -11.8, radius: 1.4 },
  { id: 'kopje_sw', x: -13.6, z: 9.8, radius: 1.25 },
  { id: 'kopje_se', x: 13.5, z: 9.5, radius: 1.3 },
  { id: 'acacia_camp_sw', x: -8.2, z: 6.2, radius: 0.65 },
  { id: 'acacia_mid_north', x: 1.8, z: -14.8, radius: 0.68 },
];

export const KENYA_AMINA_TARGET: KenyaInteractiveTarget = {
  id: 'local_guide',
  kind: 'npc',
  title: { en: 'Amina Odhiambo', th: 'อามินา โอดิอัมโบ' },
  position: { x: KENYA_AMINA_POS.x, z: KENYA_AMINA_POS.z },
  interactionRadius: 2.75,
  accentColor: '#24B8B0',
};

export const KENYA_LANDMARKS: KenyaLandmark[] = [
  {
    id: 'ranger_camp',
    order: 1,
    title: { en: 'Safari Ranger Camp', th: 'แคมป์เจ้าหน้าที่ซาฟารี' },
    subtitle: { en: 'Maasai Mara Base Station', th: 'สถานีฐานมาไซมารา' },
    description: {
      en: 'Solar-lit canvas tents, a rugged 4x4 safari jeep, and wooden field boards welcome young conservation rangers at the edge of the plains.',
      th: 'เต็นท์ผ้าใบ รถจิ๊บซาฟารี และป้ายข้อมูลภาคสนามเป็นจุดเริ่มต้นของเจ้าหน้าที่พิทักษ์ป่าท่ามกลางทุ่งกว้าง',
    },
    wildlifeNote: {
      en: 'Safari guides check weather and wildlife corridors here every morning before heading onto the dirt tracks.',
      th: 'ไกด์ซาฟารีตรวจเช็กเส้นทางอพยพสัตว์ป่าและสภาพอากาศจากที่นี่ทุกเช้าก่อนออกสำรวจ',
    },
    position: { x: 0, z: 8.6 },
    interactionRadius: 2.75,
    accentColor: '#E09A48',
  },
  {
    id: 'elephant_grassland',
    order: 2,
    title: { en: 'Elephant Grassland', th: 'ทุ่งช้างป่าสะวันนา' },
    subtitle: { en: 'Western Golden Plains', th: 'ทุ่งหญ้าสีทองฝั่งตะวันตก' },
    description: {
      en: 'Wide sunlit grass stretches across the western savanna, where a gentle elephant family swings its trunks while foraging together.',
      th: 'ทุ่งหญ้ากว้างใต้แสงแดดอ่อนเป็นที่หากินอย่างสงบของครอบครัวช้างแอฟริกาที่โบกงวงไปมา',
    },
    wildlifeNote: {
      en: 'African elephants shape the savanna by clearing bushes so fresh grass and seedlings can grow for smaller animals.',
      th: 'ช้างแอฟริกาช่วยเปิดพื้นที่ทุ่งโล่ง ทำให้หญ้าอ่อนและพืชพันธุ์ใหม่เติบโตเป็นอาหารของสัตว์อื่น',
    },
    position: { x: -9.8, z: -1.4 },
    interactionRadius: 3.1,
    accentColor: '#D97B48',
  },
  {
    id: 'giraffe_acacia_grove',
    order: 3,
    title: { en: 'Giraffe Acacia Grove', th: 'ดงต้นอะคาเซียและยีราฟ' },
    subtitle: { en: 'Eastern Umbrella Trees', th: 'แนวต้นอะคาเซียฝั่งตะวันออก' },
    description: {
      en: 'Flat-topped acacia trees cast dappled shade over tall giraffes reaching gracefully for tender high branches.',
      th: 'ต้นอะคาเซียทรงร่มแผ่เงาเย็นสบายให้ยีราฟคอยาวโน้มศีรษะเล็มใบไม้อ่อนบนยอดสูง',
    },
    wildlifeNote: {
      en: 'Giraffes act as peaceful watchtowers of the Maasai Mara, spotting movement far across the acacia canopy.',
      th: 'ยีราฟเปรียบเสมือนหอสังเกตการณ์ธรรมชาติแห่งมาไซมารา เพราะมองเห็นได้ไกลเหนือยอดไม้',
    },
    position: { x: 9.6, z: -1.2 },
    interactionRadius: 3.1,
    accentColor: '#E5A93B',
  },
  {
    id: 'zebra_watering_hole',
    order: 4,
    title: { en: 'Zebra Watering Hole', th: 'บึงน้ำม้าลาย' },
    subtitle: { en: 'North-West Savanna Oasis', th: 'แหล่งน้ำธรรมชาติฝั่งตะวันตกเฉียงเหนือ' },
    description: {
      en: 'Calm blue-green water reflects the Maasai Mara sky while striped zebras pause among shoreline reeds to drink.',
      th: 'ผืนน้ำใสสะท้อนท้องฟ้ามาไซมารา รายล้อมด้วยกอหญ้าริมฝั่งและฝูงม้าลายที่แวะมาดื่มน้ำ',
    },
    wildlifeNote: {
      en: 'Clean seasonal watering holes keep herds hydrated during dry months—rangers monitor water quality daily.',
      th: 'แหล่งน้ำสะอาดช่วยหล่อเลี้ยงสัตว์ป่าในฤดูแล้ง เจ้าหน้าที่จึงคอยดูแลรักษาความสะอาดอยู่เสมอ',
    },
    position: { x: -3.0, z: -8.0 },
    interactionRadius: 3.1,
    accentColor: '#24B8B0',
  },
  {
    id: 'conservation_lookout',
    order: 5,
    title: { en: 'Conservation Lookout', th: 'จุดชมวิวอนุรักษ์สัตว์ป่า' },
    subtitle: { en: 'Highlands Timber Platform', th: 'หอชมวิวไม้เหนือทุ่งกว้าง' },
    description: {
      en: 'An elevated timber deck and wooden wildlife sign overlook the entire reserve, offering panoramic views of elephants, giraffes, and distant hills.',
      th: 'ชานไม้ยกสูงและป้ายให้ความรู้ด้านการอนุรักษ์เปิดมุมมองกว้างไกลเห็นทั้งทุ่งหญ้าสะวันนาและทิวเขาไกลสุดสายตา',
    },
    wildlifeNote: {
      en: 'Community-led conservation keeps migration corridors open so wildlife and local villages thrive side by side.',
      th: 'การอนุรักษ์โดยชุมชนท้องถิ่นช่วยรักษาเส้นทางอพยพให้สัตว์ป่าและผู้คนอยู่ร่วมกันอย่างสมดุล',
    },
    position: { x: 6.0, z: -9.0 },
    interactionRadius: 3.1,
    accentColor: '#48A96B',
  },
];

export const KENYA_INTERACTIVE_TARGETS: KenyaInteractiveTarget[] = [
  KENYA_AMINA_TARGET,
  ...KENYA_LANDMARKS.map((landmark) => ({
    id: landmark.id,
    kind: 'landmark' as const,
    title: landmark.title,
    position: landmark.position,
    interactionRadius: landmark.interactionRadius,
    accentColor: landmark.accentColor,
  })),
];

export const AMINA_WELCOME_DIALOGUE = {
  greeting: {
    en: "Jambo! Welcome to the Maasai Mara. I'm Amina, your safari ranger. Are you ready to discover our amazing wildlife?",
    th: 'จัมโบ้! ยินดีต้อนรับสู่มาไซมารา ฉันชื่ออามินา เจ้าหน้าที่พิทักษ์ป่าซาฟารีของคุณ พร้อมออกไปสำรวจสัตว์ป่าสุดมหัศจรรย์กันหรือยัง?',
  },
  exploreTip: (visitedCount: number, totalCount: number): LocalizedText => ({
    en:
      visitedCount >= totalCount
        ? 'Look at you, Explorer—you have already visited every overlook across the Maasai Mara! Enjoy watching the elephants, giraffes, and zebras anytime.'
        : `Take your time walking along our savanna trails! You have visited ${visitedCount} of ${totalCount} landmarks so far—spot the elephants, giraffes, zebras, and our Conservation Lookout.`,
    th:
      visitedCount >= totalCount
        ? 'ยอดเยี่ยมมากนักสำรวจ คุณเดินชมครบทั้ง 5 จุดในมาไซมาราแล้ว! เดินเล่นชมช้าง ยีราฟ และม้าลายต่อได้ตามสบายเลยนะ'
        : `เดินสำรวจตามเส้นทางทุ่งหญ้าสะวันนาได้เลยนะ ตอนนี้คุณเยี่ยมชมแล้ว ${visitedCount} จาก ${totalCount} จุด อย่าลืมแวะชมช้าง ยีราฟ ม้าลาย และจุดชมวิวอนุรักษ์ด้วยล่ะ`,
  }),
};
