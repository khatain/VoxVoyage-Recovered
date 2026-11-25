import type { LocalizedText } from '../types/game';
import type { KenyaLandmarkId } from './kenyaWorld';

export const KENYA_MISSION_ID = 'mission_kenya_safari';
export const KENYA_DISCOVERY_ACTIVITY_ID = 'kenya_wildlife_discovery';
export const KENYA_DISCOVERY_XP_REWARD = 50;

export interface KenyaVocabItem {
  word: string;
  th: string;
}

export interface KenyaDiscoveryTask {
  id: KenyaLandmarkId;
  order: number;
  locationName: LocalizedText;
  focus: LocalizedText;
  vocabulary: [KenyaVocabItem, KenyaVocabItem, KenyaVocabItem];
  modelSentence: LocalizedText;
  question: LocalizedText;
  choices: [LocalizedText, LocalizedText, LocalizedText];
  correctIndex: 0 | 1 | 2;
  accentColor: string;
}

export const KENYA_DISCOVERY_TASKS: KenyaDiscoveryTask[] = [
  {
    id: 'ranger_camp',
    order: 1,
    locationName: { en: 'Safari Ranger Camp', th: 'แคมป์เจ้าหน้าที่ซาฟารี' },
    focus: { en: 'Savanna Habitat', th: 'ถิ่นอาศัยทุ่งหญ้าสะวันนา' },
    vocabulary: [
      { word: 'savanna', th: 'ทุ่งหญ้าสะวันนา' },
      { word: 'habitat', th: 'ถิ่นที่อยู่อาศัย' },
      { word: 'grassland', th: 'ทุ่งหญ้ากว้าง' },
    ],
    modelSentence: {
      en: 'The savanna is a grassland habitat where many animals live.',
      th: 'ทุ่งหญ้าสะวันนาคือถิ่นที่อยู่อาศัยแบบทุ่งหญ้ากว้างที่มีสัตว์ป่าหลายชนิดอาศัยอยู่',
    },
    question: {
      en: 'What kind of habitat is the Maasai Mara savanna?',
      th: 'ทุ่งหญ้าสะวันนาในมาไซมาราเป็นถิ่นที่อยู่อาศัยแบบใด?',
    },
    choices: [
      { en: 'A grassland habitat with open plains', th: 'ถิ่นอาศัยแบบทุ่งหญ้ากว้าง' },
      { en: 'A snowy mountain glacier', th: 'ธารน้ำแข็งบนยอดเขาหิมะ' },
      { en: 'An underwater ocean trench', th: 'ร่องลึกใต้ท้องทะเล' },
    ],
    correctIndex: 0,
    accentColor: '#E09A48',
  },
  {
    id: 'elephant_grassland',
    order: 2,
    locationName: { en: 'Elephant Grassland', th: 'ทุ่งช้างป่าสะวันนา' },
    focus: { en: 'African Elephants', th: 'ช้างแอฟริกา' },
    vocabulary: [
      { word: 'herbivore', th: 'สัตว์กินพืช' },
      { word: 'trunk', th: 'งวงช้าง' },
      { word: 'herd', th: 'ฝูงสัตว์' },
    ],
    modelSentence: {
      en: 'Elephants are herbivores. They use their trunks to collect food and water.',
      th: 'ช้างเป็นสัตว์กินพืช พวกมันใช้งวงในการเก็บอาหารและดื่มน้ำ',
    },
    question: {
      en: 'Why are elephants called herbivores, and what helps them eat and drink?',
      th: 'เหตุใดช้างจึงเรียกว่าสัตว์กินพืช และใช้อะไรช่วยกินอาหารและดื่มน้ำ?',
    },
    choices: [
      { en: 'They hunt fish using sharp fins', th: 'จับปลาด้วยครีบแหลมคม' },
      { en: 'They eat plants and use their trunks to collect food and water', th: 'กินพืชเป็นอาหารและใช้งวงเก็บอาหารและน้ำ' },
      { en: 'They sleep upside down in tall caves', th: 'นอนห้อยหัวในถ้ำสูง' },
    ],
    correctIndex: 1,
    accentColor: '#D97B48',
  },
  {
    id: 'giraffe_acacia_grove',
    order: 3,
    locationName: { en: 'Giraffe Acacia Grove', th: 'ดงต้นอะคาเซียและยีราฟ' },
    focus: { en: 'Giraffe Adaptations', th: 'การปรับตัวของยีราฟ' },
    vocabulary: [
      { word: 'adaptation', th: 'การปรับตัว' },
      { word: 'leaves', th: 'ใบไม้' },
      { word: 'survive', th: 'อยู่รอด' },
    ],
    modelSentence: {
      en: 'Giraffes have long necks that help them reach leaves high in trees.',
      th: 'ยีราฟมีคอยาวซึ่งช่วยให้เอื้อมกินใบไม้บนยอดไม้สูงได้',
    },
    question: {
      en: 'How does a long neck help a giraffe survive on the savanna?',
      th: 'คอยาวช่วยให้ยีราฟอยู่รอดในทุ่งสะวันนาได้อย่างไร?',
    },
    choices: [
      { en: 'It helps the giraffe burrow underground', th: 'ช่วยให้ขุดโพรงอยู่ใต้ดินได้' },
      { en: 'It helps the giraffe breathe underwater', th: 'ช่วยให้หายใจใต้น้ำได้' },
      { en: 'It helps the giraffe reach leaves high in acacia trees', th: 'ช่วยให้เอื้อมกินใบไม้บนยอดต้นอะคาเซียได้' },
    ],
    correctIndex: 2,
    accentColor: '#E5A93B',
  },
  {
    id: 'zebra_watering_hole',
    order: 4,
    locationName: { en: 'Zebra Watering Hole', th: 'บึงน้ำม้าลาย' },
    focus: { en: 'Water and Wildlife', th: 'แหล่งน้ำและสัตว์ป่า' },
    vocabulary: [
      { word: 'water source', th: 'แหล่งน้ำ' },
      { word: 'stripes', th: 'ลายแถบ' },
      { word: 'ecosystem', th: 'ระบบนิเวศ' },
    ],
    modelSentence: {
      en: 'Water sources are important because many animals need them to survive.',
      th: 'แหล่งน้ำมีความสำคัญมากเพราะสัตว์หลายชนิดต้องพึ่งพาเพื่อการอยู่รอด',
    },
    question: {
      en: 'Why do wildlife rangers protect watering holes in the ecosystem?',
      th: 'เหตุใดเจ้าหน้าที่พิทักษ์ป่าจึงต้องดูแลรักษาแหล่งน้ำในระบบนิเวศ?',
    },
    choices: [
      { en: 'Because many savanna animals need clean water sources to survive', th: 'เพราะสัตว์ป่าหลายชนิดต้องใช้แหล่งน้ำสะอาดเพื่อการอยู่รอด' },
      { en: 'Because zebras paint their stripes with mud there', th: 'เพราะม้าลายใช้โคลนทาลายแถบที่นั่น' },
      { en: 'Because watering holes turn sand into stone', th: 'เพราะบึงน้ำเปลี่ยนทรายให้เป็นก้อนหิน' },
    ],
    correctIndex: 0,
    accentColor: '#24B8B0',
  },
  {
    id: 'conservation_lookout',
    order: 5,
    locationName: { en: 'Conservation Lookout', th: 'จุดชมวิวอนุรักษ์สัตว์ป่า' },
    focus: { en: 'Wildlife Conservation', th: 'การอนุรักษ์สัตว์ป่า' },
    vocabulary: [
      { word: 'conservation', th: 'การอนุรักษ์' },
      { word: 'protect', th: 'ปกป้อง' },
      { word: 'threats', th: 'ภัยคุกคาม' },
    ],
    modelSentence: {
      en: 'Conservation helps protect wildlife and their habitats.',
      th: 'การอนุรักษ์ช่วยปกป้องสัตว์ป่าและถิ่นที่อยู่อาศัยของพวกมัน',
    },
    question: {
      en: 'What does wildlife conservation do for animals in the Maasai Mara?',
      th: 'การอนุรักษ์สัตว์ป่าช่วยสัตว์ในมาไซมาราอย่างไร?',
    },
    choices: [
      { en: 'It removes wild grass from the reserve', th: 'ถางหญ้าป่าทั้งหมดออกจากเขต' },
      { en: 'It protects wildlife and their natural habitats from threats', th: 'ปกป้องสัตว์ป่าและถิ่นอาศัยจากภัยคุกคาม' },
      { en: 'It moves wild animals to busy highways', th: 'ย้ายสัตว์ป่าไปอาศัยริมทางหลวง' },
    ],
    correctIndex: 1,
    accentColor: '#48A96B',
  },
];

export function getKenyaDiscoveryTask(id: KenyaLandmarkId): KenyaDiscoveryTask | undefined {
  return KENYA_DISCOVERY_TASKS.find((task) => task.id === id);
}

export const AMINA_DISCOVER_DIALOGUE = {
  intro: {
    en: "Jambo, Explorer! Every animal has an important role in nature. Let's discover five amazing things about the Maasai Mara. I'll help you become a wildlife expert!",
    th: 'จัมโบ้ นักสำรวจ! สัตว์ทุกชนิดล้วนมีบทบาทสำคัญในธรรมชาติ มาค้นพบความลับ 5 เรื่องน่าทึ่งของมาไซมารากันเถอะ ฉันจะช่วยให้คุณเป็นผู้เชี่ยวชาญด้านสัตว์ป่า!',
  },
  inProgress: (foundCount: number, totalCount: number): LocalizedText => ({
    en: `Great progress, Explorer! You have completed ${foundCount} of ${totalCount} Wildlife Discoveries. Visit the highlighted safari locations and open your Field Guide anytime!`,
    th: `ก้าวหน้ามากนักสำรวจ! คุณบันทึกการค้นพบแล้ว ${foundCount} จาก ${totalCount} แห่ง เดินสำรวจจุดที่ยังสว่างอยู่และเปิดสมุดบันทึก Wildlife Field Guide ดูได้ตลอดนะ`,
  }),
  completed: {
    en: "Excellent work, Explorer! You've discovered how wildlife survives in the savanna. Now let's learn how to share these facts in English!",
    th: 'ยอดเยี่ยมมาก นักสำรวจ! คุณได้ค้นพบแล้วว่าสัตว์ป่าเอาชีวิตรอดในทุ่งสะวันนาได้อย่างไร ตอนนี้มาเรียนรู้วิธีถ่ายทอดข้อเท็จจริงเหล่านี้เป็นภาษาอังกฤษกันเถอะ!',
  },
};
