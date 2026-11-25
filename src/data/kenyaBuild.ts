import type { LocalizedText } from '../types/game';
import type { KenyaLandmarkId } from './kenyaWorld';

export const KENYA_BUILD_ACTIVITY_ID = 'kenya_safari_fact_builder';
export const KENYA_BUILD_XP_REWARD = 50;

export type KenyaBuildLevel = 'a2' | 'b1';

export type KenyaBuildMechanicType =
  | 'subject_predicate'
  | 'verb_phrase_match'
  | 'purpose_clause'
  | 'reason_connector'
  | 'persuasive_board';

export interface BuildTokenOption {
  id: string;
  text: string;
  thHint: string;
  isDistractor?: boolean;
  distractorKind?: 'grammar' | 'factual';
  /** Optional targeted feedback when a learner picks this specific distractor */
  feedback?: LocalizedText;
}

export interface BuildSlotSpec {
  id: string;
  label: LocalizedText;
  fixedText?: string;
  options: BuildTokenOption[];
  b1ExtraOptions?: BuildTokenOption[];
  optionalB1Extension?: boolean;
}

export interface KenyaBuildStationSpec {
  id: KenyaLandmarkId;
  order: number;
  mechanic: KenyaBuildMechanicType;
  mechanicLabel: LocalizedText;
  locationName: LocalizedText;
  topic: LocalizedText;
  patternLabel: string;
  objective: LocalizedText;
  vocabWords: string[];
  modelSentenceA2: LocalizedText;
  modelSentenceB1: LocalizedText;
  hint: LocalizedText;
  slots: BuildSlotSpec[];
  accentColor: string;
}

export interface KenyaBuildValidationResult {
  valid: boolean;
  feedbackKind: 'success' | 'incomplete' | 'grammar' | 'factual';
  feedback: LocalizedText;
  checks: {
    complete: boolean;
    grammar: boolean;
    factual: boolean;
  };
  assembledSentence: string;
}

export const KENYA_BUILD_STATIONS: KenyaBuildStationSpec[] = [
  {
    id: 'ranger_camp',
    order: 1,
    mechanic: 'subject_predicate',
    mechanicLabel: {
      en: 'Subject & Description Plaque',
      th: 'จับคู่ประธานและคำอธิบาย',
    },
    locationName: { en: 'Safari Ranger Camp', th: 'แคมป์เจ้าหน้าที่ซาฟารี' },
    topic: { en: 'Savanna Habitat', th: 'ถิ่นอาศัยทุ่งหญ้าสะวันนา' },
    patternLabel: 'Subject + be + description',
    objective: {
      en: 'Build a clear factual description of the Maasai Mara savanna.',
      th: 'สร้างประโยคบรรยายข้อเท็จจริงเกี่ยวกับทุ่งหญ้าสะวันนามาไซมารา',
    },
    vocabWords: ['savanna', 'habitat', 'grassland'],
    modelSentenceA2: {
      en: 'The savanna is a grassland habitat.',
      th: 'ทุ่งหญ้าสะวันนาเป็นถิ่นที่อยู่อาศัยแบบทุ่งหญ้า',
    },
    modelSentenceB1: {
      en: 'The Maasai Mara is a wide grassland habitat where many animals live.',
      th: 'มาไซมาราเป็นถิ่นอาศัยทุ่งหญ้ากว้างใหญ่ที่มีสัตว์ป่าหลายชนิดอาศัยอยู่',
    },
    hint: {
      en: 'Start with a singular subject ("The savanna" or "The Maasai Mara"), pair it with singular "is", and choose a true habitat description.',
      th: 'เริ่มด้วยประธานเอกพจน์ ("The savanna" หรือ "The Maasai Mara") คู่กับกริยา "is" และเลือกคำอธิบายถิ่นอาศัยที่ถูกต้อง',
    },
    accentColor: '#E09A48',
    slots: [
      {
        id: 'subject',
        label: { en: '1. Subject', th: '1. ประธาน' },
        options: [
          { id: 'subj_savanna', text: 'The savanna', thHint: 'ทุ่งหญ้าสะวันนา' },
          { id: 'subj_mara', text: 'The Maasai Mara', thHint: 'มาไซมารา' },
        ],
      },
      {
        id: 'verb_be',
        label: { en: '2. Verb (be)', th: '2. กริยา (be)' },
        options: [{ id: 'be_is', text: 'is', thHint: 'เป็น / คือ' }],
        b1ExtraOptions: [
          {
            id: 'be_are',
            text: 'are',
            thHint: 'เป็น (พหูพจน์)',
            isDistractor: true,
            distractorKind: 'grammar',
            feedback: {
              en: 'Grammar tip: "The savanna" and "The Maasai Mara" are singular nouns, so use "is" instead of "are".',
              th: 'คำแนะนำไวยากรณ์: ประธานเป็นเอกพจน์ จึงต้องใช้ "is" แทน "are"',
            },
          },
        ],
      },
      {
        id: 'description',
        label: { en: '3. Description', th: '3. ส่วนขยายความจริง' },
        options: [
          {
            id: 'desc_grassland',
            text: 'a grassland habitat',
            thHint: 'ถิ่นที่อยู่อาศัยแบบทุ่งหญ้า',
          },
          {
            id: 'desc_plains',
            text: 'a wide savanna with open plains',
            thHint: 'ทุ่งหญ้าสะวันนากว้างที่มีที่ราบโล่ง',
          },
        ],
        b1ExtraOptions: [
          {
            id: 'desc_glacier',
            text: 'a snowy mountain glacier',
            thHint: 'ธารน้ำแข็งบนยอดเขาหิมะ',
            isDistractor: true,
            distractorKind: 'factual',
            feedback: {
              en: 'Fact check: The Maasai Mara is a warm grassland savanna, not a snowy glacier.',
              th: 'ตรวจสอบข้อเท็จจริง: มาไซมาราเป็นทุ่งหญ้าสะวันนา ไม่ใช่ธารน้ำแข็งบนเขาหิมะ',
            },
          },
        ],
      },
      {
        id: 'extension',
        label: { en: '4. Optional Detail (B1)', th: '4. ส่วนขยายเพิ่มเติม (B1)' },
        optionalB1Extension: true,
        options: [
          { id: 'ext_none', text: '', thHint: 'ไม่ต้องใส่ส่วนขยายเพิ่ม' },
          {
            id: 'ext_animals',
            text: 'where many animals live',
            thHint: 'ที่มีสัตว์ป่าหลายชนิดอาศัยอยู่',
          },
          {
            id: 'ext_wildlife',
            text: 'that supports amazing wildlife',
            thHint: 'ที่หล่อเลี้ยงสัตว์ป่าน่าทึ่งมากมาย',
          },
        ],
      },
    ],
  },
  {
    id: 'elephant_grassland',
    order: 2,
    mechanic: 'verb_phrase_match',
    mechanicLabel: {
      en: 'Verb & Action Matcher',
      th: 'จับคู่กริยาและการกระทำ',
    },
    locationName: { en: 'Elephant Grassland', th: 'ทุ่งช้างป่าสะวันนา' },
    topic: { en: 'Elephant Behavior', th: 'พฤติกรรมของช้างแอฟริกา' },
    patternLabel: 'Subject + verb + object',
    objective: {
      en: 'Explain what African elephants do on the savanna.',
      th: 'อธิบายว่าช้างแอฟริกาทำอะไรเพื่อดำรงชีวิตในทุ่งสะวันนา',
    },
    vocabWords: ['herbivore', 'trunk', 'herd'],
    modelSentenceA2: {
      en: 'Elephants use their trunks to collect water.',
      th: 'ช้างใช้งวงในการเก็บกักและดูดน้ำ',
    },
    modelSentenceB1: {
      en: 'African elephants use their trunks to collect food and water for their herd.',
      th: 'ช้างแอฟริกาใช้งวงเก็บอาหารและน้ำสำหรับฝูงของพวกมัน',
    },
    hint: {
      en: 'Use plural verb agreement with "Elephants" (or "African elephants") and describe how herbivores get food or water.',
      th: 'ใช้กริยาพหูพจน์คู่กับ "Elephants" (เช่น use หรือ eat) และเลือกข้อมูลจริงของสัตว์กินพืช',
    },
    accentColor: '#D97B48',
    slots: [
      {
        id: 'subject',
        label: { en: '1. Subject', th: '1. ประธาน' },
        options: [
          { id: 'subj_elephants', text: 'Elephants', thHint: 'ช้างทั้งหลาย' },
          { id: 'subj_african_elephants', text: 'African elephants', thHint: 'ช้างแอฟริกา' },
        ],
      },
      {
        id: 'verb_phrase',
        label: { en: '2. Action Phrase', th: '2. กริยาและกรรม' },
        options: [
          { id: 'vp_trunks', text: 'use their trunks', thHint: 'ใช้งวงของพวกมัน' },
          { id: 'vp_eat_plants', text: 'eat grass and leaves', thHint: 'กินหญ้าและใบไม้' },
        ],
        b1ExtraOptions: [
          {
            id: 'vp_uses',
            text: 'uses their trunks',
            thHint: 'ใช้งวง (รูปเอกพจน์)',
            isDistractor: true,
            distractorKind: 'grammar',
            feedback: {
              en: 'Grammar tip: "Elephants" is plural, so use "use" without "-s".',
              th: 'คำแนะนำไวยากรณ์: "Elephants" เป็นพหูพจน์ ต้องใช้ "use" (ไม่เติม s)',
            },
          },
          {
            id: 'vp_hunt_fish',
            text: 'hunt ocean fish',
            thHint: 'ล่าปลาในมหาสมุทร',
            isDistractor: true,
            distractorKind: 'factual',
            feedback: {
              en: 'Fact check: Elephants are savanna herbivores—they eat plants, not ocean fish.',
              th: 'ตรวจสอบข้อเท็จจริง: ช้างเป็นสัตว์กินพืชในทุ่งสะวันนา ไม่ได้ล่าปลาในทะเล',
            },
          },
        ],
      },
      {
        id: 'object_purpose',
        label: { en: '3. Target / Purpose', th: '3. จุดประสงค์หรือส่วนเติมเต็ม' },
        options: [
          { id: 'obj_water', text: 'to collect water', thHint: 'เพื่อเก็บและดื่มน้ำ' },
          { id: 'obj_food_water', text: 'to collect food and water', thHint: 'เพื่อหาอาหารและน้ำ' },
          { id: 'obj_savanna', text: 'across the grassland', thHint: 'ทั่วทุ่งหญ้ากว้าง' },
        ],
      },
      {
        id: 'extension',
        label: { en: '4. Optional Detail (B1)', th: '4. ส่วนขยายเพิ่มเติม (B1)' },
        optionalB1Extension: true,
        options: [
          { id: 'ext_none', text: '', thHint: 'ไม่ต้องใส่ส่วนขยายเพิ่ม' },
          {
            id: 'ext_herd',
            text: 'while traveling with their herd',
            thHint: 'ขณะเดินทางร่วมกับฝูง',
          },
          {
            id: 'ext_herbivores',
            text: 'because they are gentle herbivores',
            thHint: 'เพราะพวกมันเป็นสัตว์กินพืช',
          },
        ],
      },
    ],
  },
  {
    id: 'giraffe_acacia_grove',
    order: 3,
    mechanic: 'purpose_clause',
    mechanicLabel: {
      en: 'Adaptation & Purpose Board',
      th: 'เชื่อมประโยคการปรับตัวและจุดประสงค์',
    },
    locationName: { en: 'Giraffe Acacia Grove', th: 'ดงต้นอะคาเซียและยีราฟ' },
    topic: { en: 'Giraffe Adaptations', th: 'การปรับตัวของยีราฟ' },
    patternLabel: '... to + verb / ... because ...',
    objective: {
      en: 'Explain a giraffe adaptation and why it helps them survive.',
      th: 'อธิบายลักษณะการปรับตัวของยีราฟและประโยชน์ในการอยู่รอด',
    },
    vocabWords: ['adaptation', 'leaves', 'survive'],
    modelSentenceA2: {
      en: 'Giraffes have long necks to reach leaves in tall trees.',
      th: 'ยีราฟมีคอยาวเพื่อเอื้อมกินใบไม้บนต้นไม้สูง',
    },
    modelSentenceB1: {
      en: 'Giraffes have long necks because they need to reach leaves high in acacia trees.',
      th: 'ยีราฟมีคอยาวเพราะต้องเอื้อมกินใบไม้บนยอดต้นอะคาเซียสูง',
    },
    hint: {
      en: 'Use "to" directly before a base verb ("to reach leaves..."), or use "because" before a full subject + verb clause ("because they eat...").',
      th: 'ใช้ "to" ตามด้วยกริยาช่อง 1 ("to reach...") หรือใช้ "because" ตามด้วยประโยคที่มีประธาน+กริยา ("because they...")',
    },
    accentColor: '#E5A93B',
    slots: [
      {
        id: 'stem',
        label: { en: '1. Adaptation Fact', th: '1. ข้อเท็จจริงการปรับตัว' },
        options: [
          { id: 'stem_necks', text: 'Giraffes have long necks', thHint: 'ยีราฟมีคอยาว' },
          { id: 'stem_tongues', text: 'Giraffes use their tall height', thHint: 'ยีราฟใช้ความสูงของร่างกาย' },
        ],
      },
      {
        id: 'connector',
        label: { en: '2. Purpose / Reason Linker', th: '2. คำเชื่อมจุดประสงค์/เหตุผล' },
        options: [
          { id: 'link_to', text: 'to', thHint: 'เพื่อ (ตามด้วยกริยา)' },
          { id: 'link_because', text: 'because', thHint: 'เพราะว่า (ตามด้วยประโยค)' },
        ],
        b1ExtraOptions: [
          {
            id: 'link_but',
            text: 'but',
            thHint: 'แต่ (ขัดแย้ง)',
            isDistractor: true,
            distractorKind: 'grammar',
            feedback: {
              en: 'Connector check: "but" shows contrast. Use "to" or "because" to explain purpose or reason.',
              th: 'คำแนะนำคำเชื่อม: "but" ใช้แสดงความขัดแย้ง ให้ใช้ "to" หรือ "because" เพื่อบอกจุดประสงค์หรือเหตุผล',
            },
          },
        ],
      },
      {
        id: 'purpose_end',
        label: { en: '3. Outcome / Clause', th: '3. การกระทำหรือเหตุผล' },
        options: [
          { id: 'end_to_leaves', text: 'reach leaves in tall trees', thHint: 'เอื้อมกินใบไม้บนต้นไม้สูง (ใช้กับ to)' },
          { id: 'end_to_spot', text: 'spot movement across the savanna', thHint: 'มองเห็นการเคลื่อนไหวไกลๆ (ใช้กับ to)' },
          {
            id: 'end_because_acacia',
            text: 'they need to reach high acacia leaves',
            thHint: 'พวกมันต้องเอื้อมกินใบอะคาเซียบนยอดสูง (ใช้กับ because)',
          },
        ],
        b1ExtraOptions: [
          {
            id: 'end_underwater',
            text: 'swim in deep caves',
            thHint: 'ว่ายน้ำในถ้ำลึก',
            isDistractor: true,
            distractorKind: 'factual',
            feedback: {
              en: 'Fact check: Giraffes live in acacia savannas and eat high leaves—they do not swim in caves.',
              th: 'ตรวจสอบข้อเท็จจริง: ยีราฟอาศัยในทุ่งอะคาเซียและกินใบไม้สูง ไม่ได้ว่ายน้ำในถ้ำ',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'zebra_watering_hole',
    order: 4,
    mechanic: 'reason_connector',
    mechanicLabel: {
      en: 'Cause & Effect Connector',
      th: 'ตัวเชื่อมเหตุและผลในระบบนิเวศ',
    },
    locationName: { en: 'Zebra Watering Hole', th: 'บึงน้ำม้าลาย' },
    topic: { en: 'Water and Ecosystems', th: 'แหล่งน้ำและระบบนิเวศ' },
    patternLabel: '... because ... / ... so ...',
    objective: {
      en: 'Explain why clean water sources matter to savanna wildlife.',
      th: 'อธิบายเหตุผลหรือผลลัพธ์ว่าทำไมแหล่งน้ำสะอาดจึงสำคัญต่อสัตว์ป่า',
    },
    vocabWords: ['water source', 'stripes', 'ecosystem'],
    modelSentenceA2: {
      en: 'Water sources are important because animals need water to survive.',
      th: 'แหล่งน้ำมีความสำคัญเพราะสัตว์ต้องการน้ำเพื่ออยู่รอด',
    },
    modelSentenceB1: {
      en: 'Animals need clean water to survive, so rangers protect every watering hole.',
      th: 'สัตว์ต้องการน้ำสะอาดเพื่ออยู่รอด ดังนั้นเจ้าหน้าที่จึงดูแลรักษาแหล่งน้ำทุกแห่ง',
    },
    hint: {
      en: 'Use "because" before a reason ("...important because animals need water"), or ", so" before a result ("...need water, so rangers protect...").',
      th: 'ใช้ "because" เพื่อนำหน้าเหตุผล หรือใช้ ", so" เพื่อนำหน้าผลลัพธ์ที่ตามมา',
    },
    accentColor: '#24B8B0',
    slots: [
      {
        id: 'clause_a',
        label: { en: '1. Main Idea', th: '1. ประโยคหลัก' },
        options: [
          {
            id: 'ca_important',
            text: 'Water sources are important',
            thHint: 'แหล่งน้ำมีความสำคัญมาก',
          },
          {
            id: 'ca_zebras_need',
            text: 'Zebras and herds need clean water to survive',
            thHint: 'ม้าลายและฝูงสัตว์ต้องการน้ำสะอาดเพื่ออยู่รอด',
          },
        ],
      },
      {
        id: 'connector',
        label: { en: '2. Cause / Result Linker', th: '2. คำเชื่อมเหตุ/ผล' },
        options: [
          { id: 'conn_because', text: 'because', thHint: 'เพราะว่า (ตามด้วยเหตุผล)' },
          { id: 'conn_so', text: ', so', thHint: 'ดังนั้น (ตามด้วยผลลัพธ์)' },
        ],
      },
      {
        id: 'clause_b',
        label: { en: '3. Reason or Result', th: '3. เหตุผลหรือผลลัพธ์' },
        options: [
          {
            id: 'cb_need_survive',
            text: 'animals need water to survive',
            thHint: 'สัตว์ต้องการน้ำเพื่อการอยู่รอด (เหตุผล)',
          },
          {
            id: 'cb_rangers_protect',
            text: 'rangers protect watering holes in the ecosystem',
            thHint: 'เจ้าหน้าที่จึงช่วยดูแลบึงน้ำในระบบนิเวศ (ผลลัพธ์)',
          },
        ],
        b1ExtraOptions: [
          {
            id: 'cb_paint_mud',
            text: 'zebras paint their stripes with mud',
            thHint: 'ม้าลายใช้โคลนทาลายแถบ',
            isDistractor: true,
            distractorKind: 'factual',
            feedback: {
              en: 'Fact check: Zebra stripes are natural fur patterns, not painted with mud.',
              th: 'ตรวจสอบข้อเท็จจริง: ลายม้าลายเกิดขึ้นตามธรรมชาติ ไม่ได้ทาด้วยโคลน',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'conservation_lookout',
    order: 5,
    mechanic: 'persuasive_board',
    mechanicLabel: {
      en: 'Persuasive Pledge Board',
      th: 'ป้ายรณรงค์เพื่อการอนุรักษ์',
    },
    locationName: { en: 'Conservation Lookout', th: 'จุดชมวิวอนุรักษ์สัตว์ป่า' },
    topic: { en: 'Wildlife Conservation', th: 'การอนุรักษ์สัตว์ป่า' },
    patternLabel: 'We should + verb + because + reason.',
    objective: {
      en: 'Build a persuasive recommendation to protect the Maasai Mara.',
      th: 'สร้างประโยคเชิญชวนและให้เหตุผลเพื่อปกป้องสัตว์ป่ามาไซมารา',
    },
    vocabWords: ['conservation', 'protect', 'threats'],
    modelSentenceA2: {
      en: 'We should protect wildlife because animals need safe habitats.',
      th: 'พวกเราควรปกป้องสัตว์ป่าเพราะสัตว์ต้องการถิ่นที่อยู่อาศัยที่ปลอดภัย',
    },
    modelSentenceB1: {
      en: 'We should protect wildlife and water sources because savanna animals face real threats to their habitats.',
      th: 'พวกเราควรปกป้องสัตว์ป่าและแหล่งน้ำเพราะสัตว์ในทุ่งสะวันนาต้องเผชิญภัยคุกคามต่อถิ่นอาศัย',
    },
    hint: {
      en: 'Combine "We should" + base conservation action ("protect wildlife...") + "because" + a convincing factual reason.',
      th: 'รวม "We should" + การกระทำอนุรักษ์ ("protect wildlife...") + "because" + เหตุผลที่น่าเชื่อถือ',
    },
    accentColor: '#48A96B',
    slots: [
      {
        id: 'modal_lead',
        label: { en: '1. Recommendation Lead', th: '1. คำนำเสนอแนะ' },
        fixedText: 'We should',
        options: [{ id: 'lead_should', text: 'We should', thHint: 'พวกเราควรจะ' }],
      },
      {
        id: 'action',
        label: { en: '2. Conservation Action', th: '2. แนวทางอนุรักษ์' },
        options: [
          {
            id: 'act_protect_wildlife',
            text: 'protect wildlife',
            thHint: 'ปกป้องสัตว์ป่า',
          },
          {
            id: 'act_protect_corridors',
            text: 'protect wildlife and clean water sources',
            thHint: 'ปกป้องสัตว์ป่าและแหล่งน้ำสะอาด',
          },
        ],
        b1ExtraOptions: [
          {
            id: 'act_to_protect',
            text: 'to protect wildlife',
            thHint: 'เพื่อปกป้องสัตว์ป่า (ผิดโครงสร้างหลัง should)',
            isDistractor: true,
            distractorKind: 'grammar',
            feedback: {
              en: 'Grammar tip: After "We should", use a base verb directly ("protect") without "to".',
              th: 'คำแนะนำไวยากรณ์: หลังคำว่า "We should" ให้ตามด้วยกริยาช่อง 1 เลย ("protect") ไม่ต้องใส่ "to"',
            },
          },
          {
            id: 'act_ignore',
            text: 'ignore habitat threats',
            thHint: 'เพิกเฉยต่อภัยคุกคาม',
            isDistractor: true,
            distractorKind: 'factual',
            feedback: {
              en: 'Conservation check: Good safari guides encourage protecting habitats, never ignoring threats.',
              th: 'ตรวจสอบความหมาย: ไกด์ซาฟารีควรรณรงค์ให้ช่วยกันดูแล ไม่ใช่เพิกเฉยต่อภัยคุกคาม',
            },
          },
        ],
      },
      {
        id: 'because_link',
        label: { en: '3. Reason Word', th: '3. คำเชื่อมเหตุผล' },
        fixedText: 'because',
        options: [{ id: 'link_because_fixed', text: 'because', thHint: 'เพราะว่า' }],
      },
      {
        id: 'reason',
        label: { en: '4. Persuasive Reason', th: '4. เหตุผลสนับสนุน' },
        options: [
          {
            id: 'rsn_safe_habitats',
            text: 'animals need safe habitats',
            thHint: 'สัตว์ป่าต้องการถิ่นที่อยู่อาศัยที่ปลอดภัย',
          },
          {
            id: 'rsn_healthy_ecosystem',
            text: 'every species keeps the savanna ecosystem balanced',
            thHint: 'สัตว์ทุกชนิดช่วยรักษาสมดุลของระบบนิเวศสะวันนา',
          },
        ],
      },
      {
        id: 'extension',
        label: { en: '5. Optional Closing (B1)', th: '5. ประโยคปิดรณรงค์ (B1)' },
        optionalB1Extension: true,
        options: [
          { id: 'ext_none', text: '', thHint: 'ไม่ต้องใส่ประโยคปิด' },
          {
            id: 'ext_future',
            text: 'for future generations',
            thHint: 'เพื่อคนรุ่นหลังในอนาคต',
          },
        ],
      },
    ],
  },
];

export function getKenyaBuildStation(id: KenyaLandmarkId): KenyaBuildStationSpec | undefined {
  return KENYA_BUILD_STATIONS.find((s) => s.id === id);
}

export function assembleSentenceFromSelections(
  station: KenyaBuildStationSpec,
  selections: Record<string, string>,
  level: KenyaBuildLevel,
): string {
  const parts: string[] = [];
  for (const slot of station.slots) {
    if (slot.optionalB1Extension && level === 'a2') continue;
    const chosenId = slot.fixedText ? slot.options[0]?.id : selections[slot.id];
    const pool = [...slot.options, ...(level === 'b1' ? slot.b1ExtraOptions ?? [] : [])];
    const option = pool.find((o) => o.id === chosenId);
    const text = option?.text?.trim() ?? '';
    if (text) {
      parts.push(text);
    }
  }
  if (parts.length === 0) return '';

  // Clean joining respecting leading comma in ", so"
  let joined = '';
  for (const chunk of parts) {
    if (!joined) {
      joined = chunk;
    } else if (chunk.startsWith(',')) {
      joined += chunk;
    } else {
      joined += ` ${chunk}`;
    }
  }
  joined = joined.trim();
  if (joined && !joined.endsWith('.')) {
    joined += '.';
  }
  return joined;
}

export function validateKenyaBuildSelections(
  station: KenyaBuildStationSpec,
  selections: Record<string, string>,
  level: KenyaBuildLevel,
): KenyaBuildValidationResult {
  const requiredSlots = station.slots.filter((s) => !s.optionalB1Extension);
  const chosenOptions: { slotId: string; option: BuildTokenOption | undefined }[] = [];

  for (const slot of requiredSlots) {
    const chosenId = slot.fixedText ? slot.options[0]?.id : selections[slot.id];
    const pool = [...slot.options, ...(level === 'b1' ? slot.b1ExtraOptions ?? [] : [])];
    chosenOptions.push({
      slotId: slot.id,
      option: pool.find((o) => o.id === chosenId),
    });
  }

  const assembledSentence = assembleSentenceFromSelections(station, selections, level);

  // 1. Completeness check
  const missing = chosenOptions.some((c) => !c.option);
  if (missing) {
    return {
      valid: false,
      feedbackKind: 'incomplete',
      assembledSentence,
      checks: { complete: false, grammar: false, factual: false },
      feedback: {
        en: 'Pick one tile for each required slot on the Safari Board before checking.',
        th: 'กรุณาเลือกคำครบทุกช่องที่จำเป็นบนป้ายซาฟารีก่อนกดตรวจคำตอบ',
      },
    };
  }

  // 2. Explicit distractor check (grammar vs factual)
  for (const { option } of chosenOptions) {
    if (option?.isDistractor) {
      const kind = option.distractorKind === 'factual' ? 'factual' : 'grammar';
      return {
        valid: false,
        feedbackKind: kind,
        assembledSentence,
        checks: {
          complete: true,
          grammar: kind !== 'grammar',
          factual: kind !== 'factual',
        },
        feedback: option.feedback ?? {
          en:
            kind === 'factual'
              ? 'Check the wildlife fact—one tile does not match what we discovered in the Maasai Mara.'
              : 'Check the English grammar pattern—one word form does not fit here.',
          th:
            kind === 'factual'
              ? 'ลองตรวจข้อเท็จจริงสัตว์ป่าอีกครั้ง มีส่วนหนึ่งไม่ตรงกับข้อมูลในมาไซมารา'
              : 'ลองตรวจโครงสร้างไวยากรณ์อีกครั้ง มีคำหนึ่งยังไม่เข้ากับประโยค',
        },
      };
    }
  }

  // 3. Cross-slot grammar & meaning rules per station mechanic
  if (station.id === 'elephant_grassland') {
    const vp = selections.verb_phrase;
    const obj = selections.object_purpose;
    if (vp === 'vp_eat_plants' && (obj === 'obj_water' || obj === 'obj_food_water')) {
      return {
        valid: false,
        feedbackKind: 'grammar',
        assembledSentence,
        checks: { complete: true, grammar: false, factual: true },
        feedback: {
          en: 'Meaning check: Saying "eat grass and leaves to collect water" mixes eating with collecting water. Try "use their trunks" with "to collect water", or "eat grass and leaves" with "across the grassland".',
          th: 'คำแนะนำความหมาย: "กินหญ้าและใบไม้เพื่อเก็บน้ำ" ยังไม่เข้ากัน ลองจับคู่ "use their trunks" กับ "to collect water" หรือ "eat grass and leaves" กับ "across the grassland"',
        },
      };
    }
    if (vp === 'vp_trunks' && obj === 'obj_savanna') {
      return {
        valid: false,
        feedbackKind: 'grammar',
        assembledSentence,
        checks: { complete: true, grammar: false, factual: true },
        feedback: {
          en: 'Sentence completeness: "Elephants use their trunks across the grassland" needs what they use their trunks for! Try "to collect water" or "to collect food and water".',
          th: 'ความสมบูรณ์ของประโยค: ลองเติมจุดประสงค์หลัง "use their trunks" ด้วย "to collect water" หรือ "to collect food and water"',
        },
      };
    }
  }

  if (station.id === 'giraffe_acacia_grove') {
    const conn = selections.connector;
    const end = selections.purpose_end;
    if (conn === 'link_to' && end === 'end_because_acacia') {
      return {
        valid: false,
        feedbackKind: 'grammar',
        assembledSentence,
        checks: { complete: true, grammar: false, factual: true },
        feedback: {
          en: 'Grammar check: Use "to" before a base verb ("to reach..."), or switch the linker to "because" before "they need to reach...".',
          th: 'คำแนะนำไวยากรณ์: หลัง "to" ต้องตามด้วยกริยาช่อง 1 เลย ("to reach...") หรือเปลี่ยนคำเชื่อมเป็น "because" เมื่อตามด้วย "they need..."',
        },
      };
    }
    if (conn === 'link_because' && (end === 'end_to_leaves' || end === 'end_to_spot')) {
      return {
        valid: false,
        feedbackKind: 'grammar',
        assembledSentence,
        checks: { complete: true, grammar: false, factual: true },
        feedback: {
          en: 'Grammar check: After "because", include a subject and verb ("they need..."). Or switch the linker to "to"!',
          th: 'คำแนะนำไวยากรณ์: หลัง "because" ต้องมีประธานและกริยา ("they need...") หรือเปลี่ยนคำเชื่อมเป็น "to"',
        },
      };
    }
  }

  if (station.id === 'zebra_watering_hole') {
    const ca = selections.clause_a;
    const conn = selections.connector;
    const cb = selections.clause_b;

    if (ca === 'ca_important' && conn === 'conn_so') {
      return {
        valid: false,
        feedbackKind: 'grammar',
        assembledSentence,
        checks: { complete: true, grammar: false, factual: true },
        feedback: {
          en: 'Connector check: Use "because" to explain why water sources are important, OR start with "Zebras and herds need clean water to survive" before ", so".',
          th: 'คำแนะนำคำเชื่อม: ใช้ "because" เพื่อบอกเหตุผลว่าทำไมแหล่งน้ำจึงสำคัญ หรือขึ้นต้นด้วยความต้องการน้ำก่อนเชื่อมด้วย ", so"',
        },
      };
    }
    if (ca === 'ca_important' && conn === 'conn_because' && cb === 'cb_rangers_protect') {
      return {
        valid: false,
        feedbackKind: 'factual',
        assembledSentence,
        checks: { complete: true, grammar: true, factual: false },
        feedback: {
          en: 'Meaning check: Rangers protect watering holes because water is important—not the reverse! Pair "Water sources are important" + "because" + "animals need water to survive".',
          th: 'คำแนะนำความหมาย: เจ้าหน้าที่ดูแลบึงน้ำเพราะน้ำสำคัญ ไม่ใช่สลับกัน ลองใช้ "because animals need water to survive"',
        },
      };
    }
    if (ca === 'ca_zebras_need' && conn === 'conn_because' && cb === 'cb_rangers_protect') {
      return {
        valid: false,
        feedbackKind: 'grammar',
        assembledSentence,
        checks: { complete: true, grammar: false, factual: true },
        feedback: {
          en: 'Cause & result check: "Zebras need water... so rangers protect watering holes" is a result! Switch the linker to ", so".',
          th: 'คำแนะนำเหตุและผล: การที่เจ้าหน้าที่ช่วยดูแลเป็น "ผลลัพธ์" จึงควรใช้คำเชื่อม ", so" แทน "because"',
        },
      };
    }
    if (ca === 'ca_zebras_need' && conn === 'conn_so' && cb === 'cb_need_survive') {
      return {
        valid: false,
        feedbackKind: 'factual',
        assembledSentence,
        checks: { complete: true, grammar: true, factual: false },
        feedback: {
          en: 'Meaning check: Both halves repeat needing water! Pair "Zebras and herds need clean water to survive" + ", so" + "rangers protect watering holes in the ecosystem".',
          th: 'คำแนะนำความหมาย: ทั้งสองส่วนพูดซ้ำเรื่องการต้องการน้ำ ให้ต่อผลลัพธ์ด้วย ", so rangers protect watering holes..."',
        },
      };
    }
    if (ca === 'ca_zebras_need' && conn === 'conn_because' && cb === 'cb_need_survive') {
      return {
        valid: false,
        feedbackKind: 'factual',
        assembledSentence,
        checks: { complete: true, grammar: true, factual: false },
        feedback: {
          en: 'Meaning check: Both halves say animals need water to survive. Try pairing "Water sources are important because..." or using ", so rangers protect...".',
          th: 'คำแนะนำความหมาย: ข้อความซ้ำกัน ลองใช้ "Water sources are important because..." หรือใช้ ", so rangers protect..."',
        },
      };
    }
  }

  return {
    valid: true,
    feedbackKind: 'success',
    assembledSentence,
    checks: { complete: true, grammar: true, factual: true },
    feedback: {
      en: 'Clear, grammatical, and scientifically accurate! Ready to speak your safari fact aloud.',
      th: 'ยอดเยี่ยม! ประโยคถูกต้องทั้งไวยากรณ์และข้อเท็จจริง พร้อมฝึกอ่านออกเสียงแล้ว',
    },
  };
}

/**
 * Validates saved sentences from localStorage or handlers so BUILD completion
 * cannot be forged with empty/arbitrary non-station text.
 */
export function isValidSavedKenyaBuildSentence(
  stationId: KenyaLandmarkId,
  sentence: unknown,
): sentence is string {
  if (typeof sentence !== 'string') return false;
  const trimmed = sentence.trim();
  if (trimmed.length < 18 || trimmed.length > 220) return false;
  const lower = trimmed.toLowerCase();

  switch (stationId) {
    case 'ranger_camp':
      return (
        (lower.includes('savanna') || lower.includes('maasai mara')) &&
        lower.includes(' is ') &&
        (lower.includes('grassland') || lower.includes('habitat') || lower.includes('plains'))
      );
    case 'elephant_grassland':
      return (
        lower.includes('elephant') &&
        (lower.includes('use their trunks') || lower.includes('eat grass and leaves')) &&
        (lower.includes('water') || lower.includes('grassland'))
      );
    case 'giraffe_acacia_grove':
      return (
        lower.includes('giraffe') &&
        (lower.includes(' to ') || lower.includes('because')) &&
        (lower.includes('leaves') || lower.includes('savanna'))
      );
    case 'zebra_watering_hole':
      return (
        (lower.includes('water') || lower.includes('zebra')) &&
        (lower.includes('because') || lower.includes(', so')) &&
        (lower.includes('survive') || lower.includes('protect'))
      );
    case 'conservation_lookout':
      return (
        lower.startsWith('we should ') &&
        lower.includes('protect') &&
        lower.includes('because')
      );
    default:
      return false;
  }
}

export const AMINA_BUILD_DIALOGUE = {
  locked: {
    en: 'First, finish your 5 Wildlife Discoveries around the Maasai Mara so you have all the facts ready for our Safari Fact Builder boards!',
    th: 'ก่อนอื่น มาสำรวจสัตว์ป่าให้ครบทั้ง 5 จุดก่อนนะ เพื่อเก็บข้อมูลมาใช้สร้างป้ายความรู้ภาษาอังกฤษ!',
  },
  intro: {
    en: "Great work, Explorer! You've collected important wildlife facts. Now let's turn those facts into clear English sentences for our safari visitors!",
    th: 'เก่งมาก นักสำรวจ! คุณรวบรวมข้อเท็จจริงสัตว์ป่าสำคัญๆ มาได้แล้ว ตอนนี้มาเปลี่ยนข้อมูลเหล่านั้นให้เป็นประโยคภาษาอังกฤษที่ชัดเจนสำหรับนักท่องเที่ยวกันเถอะ!',
  },
  inProgress: (doneCount: number, totalCount: number): LocalizedText => ({
    en: `Wonderful progress on our visitor boards! You've built ${doneCount} of ${totalCount} Safari Facts. Visit the remaining wooden stations and review your sentences in the Field Guide anytime!`,
    th: `ป้ายข้อมูลนักท่องเที่ยวคืบหน้าไปมากแล้ว! คุณสร้างประโยคสำเร็จแล้ว ${doneCount} จาก ${totalCount} สถานี ไปสำรวจสถานีที่เหลือและทบทวนในสมุดบันทึกได้ตลอดเลย`,
  }),
  completed: {
    en: 'Fantastic writing, Explorer! Every Maasai Mara information board is ready for international guests. Soon you will practice speaking these safari facts aloud!',
    th: 'เขียนได้ดีเยี่ยมมาก นักสำรวจ! ป้ายข้อมูลมาไซมาราทุกจุดพร้อมต้อนรับนักเดินทางแล้ว ต่อไปคุณจะได้ฝึกพูดถ่ายทอดข้อมูลเหล่านี้ออกมาอย่างมั่นใจ!',
  },
};
