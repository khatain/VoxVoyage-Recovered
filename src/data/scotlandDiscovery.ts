import type { LocalizedText } from '../types/game';
import {
  SCOTLAND_LANDMARKS,
  SCOTLAND_STAGE_ACTIVITY_IDS,
  type ScotlandLandmarkId,
} from './scotlandWorld';

/**
 * Reserved canonical Phase 3B DISCOVER activity ID anchored to scotlandWorld.ts.
 */
export const SCOTLAND_DISCOVERY_ACTIVITY_ID = SCOTLAND_STAGE_ACTIVITY_IDS.discover;
export const SCOTLAND_DISCOVERY_XP_REWARD = 50;

export type ScotlandDifficultyMode = 'a2' | 'b1';

export type ScotlandDiscoveryMechanicId =
  | 'village_classify'
  | 'tartan_match'
  | 'food_investigate'
  | 'festival_rhythm'
  | 'comparison_compass';

export type VillageEvidenceCategory =
  | 'everyday_life'
  | 'traditional_culture'
  | 'community_spaces'
  | 'historic_heritage';

export interface ScotlandVocabEntry {
  term: string;
  a2Def: LocalizedText;
  b1Note: LocalizedText;
}

export interface ScotlandEvidenceItem {
  id: ScotlandLandmarkId;
  order: number;
  landmarkTitle: LocalizedText;
  stationTitle: LocalizedText;
  mechanicId: ScotlandDiscoveryMechanicId;
  mechanicLabel: LocalizedText;
  scottishFact: LocalizedText;
  a2Summary: LocalizedText;
  b1Insight: LocalizedText;
  keyVocab: ScotlandVocabEntry[];
  thailandConnection: LocalizedText;
  similarityNote: LocalizedText;
  differenceNote: LocalizedText;
  sourceNote: LocalizedText;
  languageBridgePhrases: string[];
}

export interface VillageDetectiveClue {
  id: string;
  label: LocalizedText;
  visualTag: 'school_shop' | 'fountain_board' | 'festival_banner' | 'stone_cairn';
  a2Clue: LocalizedText;
  b1Clue: LocalizedText;
  hint: LocalizedText;
  correctCategory: VillageEvidenceCategory;
  categoryExplanation: Record<VillageEvidenceCategory, LocalizedText>;
}

export interface TartanMatchCard {
  id: string;
  title: LocalizedText;
  originTag: 'scotland' | 'thailand';
  visualVariant: 'tartan_grid' | 'wool_kilt' | 'modern_jacket' | 'praewa_silk';
  a2Description: LocalizedText;
  b1Description: LocalizedText;
  hint: LocalizedText;
  correctPurposeId: string;
}

export interface TartanPurposeOption {
  id: string;
  label: LocalizedText;
  wrongExplanation: LocalizedText;
}

export interface FoodPantryOption {
  id: string;
  label: LocalizedText;
  isScottishIngredient: boolean;
  feedback: LocalizedText;
}

export interface FoodInvestigationTray {
  id: string;
  dishName: LocalizedText;
  visualVariant: 'oatcakes' | 'shortbread' | 'berries_oats';
  ingredients: LocalizedText[];
  pantryShelf: FoodPantryOption[];
  climateClueA2: LocalizedText;
  climateClueB1: LocalizedText;
  hint: LocalizedText;
  thaiContrastId: string;
  thaiContrastOptions: {
    id: string;
    label: LocalizedText;
    explanation: LocalizedText;
  }[];
}

export interface FestivalRhythmProbe {
  id: 'bagpipe' | 'fiddle' | 'bodhran';
  mysteryLabel: LocalizedText;
  instrumentName: LocalizedText;
  patternBars: number[];
  a2Clue: LocalizedText;
  b1Clue: LocalizedText;
  hint: LocalizedText;
  correctRoleId: string;
  roleOptions: {
    id: string;
    label: LocalizedText;
    explanation: LocalizedText;
  }[];
}

export type ComparisonZone = 'scotland' | 'both' | 'thailand';

export interface ComparisonCompassToken {
  id: string;
  label: LocalizedText;
  stationRef: LocalizedText;
  a2Clue: LocalizedText;
  b1Clue: LocalizedText;
  hint: LocalizedText;
  correctZone: ComparisonZone;
  zoneFeedback: Record<ComparisonZone, LocalizedText>;
}

export const SCOTLAND_EVIDENCE_ITEMS: ScotlandEvidenceItem[] = [
  {
    id: 'highland_village_square',
    order: 1,
    landmarkTitle: SCOTLAND_LANDMARKS[0].title,
    stationTitle: {
      en: 'Station 1 · Village Life Detective',
      th: 'ด่านย่อยที่ 1 · นักสืบวิถีหมู่บ้าน',
    },
    mechanicId: 'village_classify',
    mechanicLabel: { en: 'Spot & Classify', th: 'สังเกตและจัดหมวดหมู่' },
    scottishFact: {
      en: 'Highland villages combine historic stone cottages and community noticeboards with modern everyday routines like cafes, local shops, and school walks.',
      th: 'หมู่บ้านไฮแลนด์ผสมผสานบ้านหินเก่าแก่และกระดานข่าวชุมชนเข้ากับชีวิตประจำวันสมัยใหม่ เช่น ร้านกาแฟ ร้านค้าท้องถิ่น และการเดินไปโรงเรียน',
    },
    a2Summary: {
      en: 'People in Scotland live modern daily lives inside towns with old stone buildings.',
      th: 'ผู้คนในสกอตแลนด์ใช้ชีวิตประจำวันแบบยุคใหม่ท่ามกลางอาคารหินเก่าแก่',
    },
    b1Insight: {
      en: 'Seeing old granite architecture does not mean people live in the past—historic buildings often house modern cafes, libraries, and families.',
      th: 'การเห็นบ้านหินโบราณไม่ได้หมายความว่าผู้คนใช้ชีวิตแบบในอดีต อาคารเก่ามักถูกใช้งานเป็นร้านกาแฟ ห้องสมุด และบ้านยุคปัจจุบัน',
    },
    keyVocab: [
      {
        term: 'community square',
        a2Def: {
          en: 'an open village place where neighbors meet',
          th: 'ลานเปิดกลางหมู่บ้านที่เพื่อนบ้านมาพบปะกัน',
        },
        b1Note: {
          en: 'Often includes shared seating, a fountain, or a public noticeboard.',
          th: 'มักมีที่นั่งส่วนกลาง น้ำพุ หรือป้ายข่าวสารสาธารณะ',
        },
      },
      {
        term: 'everyday routine',
        a2Def: {
          en: 'ordinary things people do most days',
          th: 'กิจวัตรทั่วไปที่ผู้คนทำเป็นประจำทุกวัน',
        },
        b1Note: {
          en: 'Distinguished from special annual heritage festivals.',
          th: 'แตกต่างจากงานประเพณีประจำปีที่จัดขึ้นในโอกาสพิเศษ',
        },
      },
    ],
    thailandConnection: {
      en: 'Just as Highland towns mix stone cottages with modern shops, Thai neighborhoods blend historic temple courtyards or wooden shophouses with contemporary schools and cafes.',
      th: 'เช่นเดียวกับที่หมู่บ้านไฮแลนด์มีบ้านหินคู่ร้านสมัยใหม่ ชุมชนไทยก็ผสานลานวัดหรือเรือนแถวเก่าแก่เข้ากับโรงเรียนและคาเฟ่ร่วมสมัย',
    },
    similarityNote: {
      en: 'Both Scotland and Thailand use central public spaces for neighbors to greet one another and share local news.',
      th: 'ทั้งสกอตแลนด์และไทยต่างมีพื้นที่สาธารณะกลางชุมชนให้ผู้คนทักทายและแลกเปลี่ยนข่าวสารกัน',
    },
    differenceNote: {
      en: 'While Scottish villages use thick granite stone for cool weather, Thai towns favor open-air shaded pavilions for warm breezes.',
      th: 'ขณะที่หมู่บ้านสกอตใช้หินแกรนิตหนาเพื่อรับอากาศหนาว ชุมชนไทยมักสร้างศาลาโปร่งรับลมร้อน',
    },
    sourceNote: {
      en: 'Field Evidence · Highland Village Architecture & Contemporary Community Life',
      th: 'บันทึกภาคสนาม · สถาปัตยกรรมหมู่บ้านไฮแลนด์และวิถีชุมชนร่วมสมัย',
    },
    languageBridgePhrases: ['both ... and ...', 'while', 'similar to'],
  },
  {
    id: 'tartan_heritage_workshop',
    order: 2,
    landmarkTitle: SCOTLAND_LANDMARKS[1].title,
    stationTitle: {
      en: 'Station 2 · Tartan Pattern Puzzle',
      th: 'ด่านย่อยที่ 2 · ปริศนาลายผ้าทาร์ทัน',
    },
    mechanicId: 'tartan_match',
    mechanicLabel: { en: 'Pattern & Purpose Match', th: 'จับคู่ลวดลายและหน้าที่' },
    scottishFact: {
      en: 'Tartan is woven from criss-crossing dyed wool threads. Today, Highland residents wear modern casual clothes on weekdays and save kilts for weddings, graduations, and festivals.',
      th: 'ผ้าทาร์ทันทอจากด้ายขนสัตว์ย้อมสีไขว้กัน ปัจจุบันชาวสกอตสวมชุดลำลองในวันธรรมดา และสวมกระโปรงคิลต์ในงานแต่ง พิธีจบการศึกษา และเทศกาล',
    },
    a2Summary: {
      en: 'Tartan is a traditional checked cloth; kilts are saved for special events.',
      th: 'ทาร์ทันคือผ้าลายตารางดั้งเดิม ส่วนชุดคิลต์มักสวมใส่ในโอกาสพิเศษ',
    },
    b1Insight: {
      en: 'Woven heritage expresses regional pride and craftsmanship, yet practical daily clothing in both Scotland and Thailand has adapted to modern work and weather.',
      th: 'ผ้าทอมรดกสะท้อนความภาคภูมิใจและฝีมือท้องถิ่น แต่ชุดประจำวันของทั้งสกอตแลนด์และไทยล้วนปรับตามการใช้งานและสภาพอากาศสมัยใหม่',
    },
    keyVocab: [
      {
        term: 'tartan',
        a2Def: {
          en: 'checked wool cloth with crossing colored stripes',
          th: 'ผ้าขนสัตว์ลายตารางที่มีเส้นสีตัดไขว้กัน',
        },
        b1Note: {
          en: 'Patterns are woven using repeating vertical (warp) and horizontal (weft) threads.',
          th: 'ลวดลายเกิดจากการทอเส้นยืนและเส้นพุ่งซ้ำเป็นจังหวะ',
        },
      },
      {
        term: 'ceremonial dress',
        a2Def: {
          en: 'special traditional clothes worn at celebrations',
          th: 'เครื่องแต่งกายตามประเพณีสำหรับงานพิธีหรือการเฉลิมฉลอง',
        },
        b1Note: {
          en: 'Not worn every day by most residents, unlike casual jackets and jeans.',
          th: 'ไม่ใช่ชุดที่คนส่วนใหญ่สวมทุกวัน ต่างจากเสื้อแจ็กเกตและกางเกงยีนส์',
        },
      },
    ],
    thailandConnection: {
      en: 'In Kalasin, northeastern Thailand, master weavers craft Praewa silk (ผ้าไหมแพรวา)—treasured for geometric diamond motifs and worn proudly at ceremonies, just as Scottish families wear tartan.',
      th: 'ที่จังหวัดกาฬสินธุ์ ภาคอีสานของไทย ช่างทอสร้างสรรค์ “ผ้าไหมแพรวา” ที่มีลวดลายเรขาคณิตประณีตและสวมในงานสำคัญ เช่นเดียวกับที่ชาวสกอตภาคภูมิใจในผ้าทาร์ทัน',
    },
    similarityNote: {
      en: 'Both Scottish tartan and Thai Kalasin Praewa silk use skilled weaving patterns to pass down community heritage.',
      th: 'ทั้งผ้าทาร์ทันของสกอตแลนด์และผ้าไหมแพรวาของไทยต่างใช้ลวดลายทอมือเพื่อสืบสานภูมิปัญญาท้องถิ่น',
    },
    differenceNote: {
      en: 'Unlike warm Scottish wool suited to cold winds, Thai Praewa silk is light and breathable for tropical climates, with completely distinct motifs and garment tailoring.',
      th: 'ต่างจากผ้าขนสัตว์หนาของสกอตแลนด์ที่เหมาะกับลมหนาว ผ้าไหมแพรวาของไทยเบาสบายเหมาะกับอากาศร้อนชื้น ทั้งยังใช้ลวดลายและรูปทรงการตัดเย็บที่ต่างกัน',
    },
    sourceNote: {
      en: 'Field Evidence · Scottish Tartan Looms & Kalasin Praewa Silk Heritage',
      th: 'บันทึกภาคสนาม · กี่ทอผ้าทาร์ทันสกอตแลนด์และผ้าไหมแพรวากาฬสินธุ์',
    },
    languageBridgePhrases: ['similar to', 'different from', 'unlike'],
  },
  {
    id: 'highland_food_market',
    order: 3,
    landmarkTitle: SCOTLAND_LANDMARKS[2].title,
    stationTitle: {
      en: 'Station 3 · Highland Food Explorer',
      th: 'ด่านย่อยที่ 3 · นักสำรวจอาหารไฮแลนด์',
    },
    mechanicId: 'food_investigate',
    mechanicLabel: { en: 'Ingredient Investigation', th: 'สืบค้นวัตถุดิบและเมนู' },
    scottishFact: {
      en: 'Scotland’s cool, rainy climate made hardy oats and barley key staples—seen in oatcakes, butter shortbread, and summer Highland berries—alongside diverse modern foods.',
      th: 'อากาศเย็นและชื้นของสกอตแลนด์ทำให้ข้าวโอ๊ตและข้าวบาร์เลย์เป็นวัตถุดิบหลัก เช่น โอ๊ตเค้ก ชอร์ตเบรด และเบอร์รีฤดูร้อน ควบคู่กับอาหารสมัยใหม่ที่หลากหลาย',
    },
    a2Summary: {
      en: 'Oats, butter, and berries make classic Highland snacks and warm breakfasts.',
      th: 'ข้าวโอ๊ต เนย และเบอร์รีคือหัวใจของขนมและอาหารเช้าอุ่น ๆ แห่งไฮแลนด์',
    },
    b1Insight: {
      en: 'Geography shapes traditional crops: cool damp valleys favor oats and root vegetables, whereas warm tropical plains favor fragrant rice, coconut, and fresh herbs.',
      th: 'ภูมิศาสตร์หล่อหลอมพืชผลพื้นถิ่น หุบเขาหนาวเหมาะกับข้าวโอ๊ตและพืชหัว ส่วนที่ราบร้อนชื้นเหมาะกับข้าวหอม กะทิ และสมุนไพรสด',
    },
    keyVocab: [
      {
        term: 'staple crop',
        a2Def: {
          en: 'a main plant people grow and eat often',
          th: 'พืชอาหารหลักที่ผู้คนปลูกและรับประทานเป็นประจำ',
        },
        b1Note: {
          en: 'Oats in northern Britain play a dietary staple role comparable to rice in Thailand.',
          th: 'ข้าวโอ๊ตในสกอตแลนด์มีบทบาทอาหารหลักคล้ายข้าวในประเทศไทย',
        },
      },
      {
        term: 'shortbread',
        a2Def: {
          en: 'a crisp Scottish biscuit baked with butter, flour, and sugar',
          th: 'คุกกี้เนยสดกรอบร่วนแบบดั้งเดิมของสกอตแลนด์',
        },
        b1Note: {
          en: 'Baked rather than steamed, giving a rich, crumbly texture.',
          th: 'ใช้วิธีอบจนหอมเนยและกรอบ ต่างจากขนมไทยที่นิยมการนึ่งหรือกวน',
        },
      },
    ],
    thailandConnection: {
      en: 'Both Scotland and Thailand feature bustling local food markets, yet Thai stalls feature jasmine rice, lemongrass, galangal, and sweet mango sticky rice rather than baked oatcakes.',
      th: 'ทั้งสองประเทศต่างมีตลาดอาหารท้องถิ่นที่มีชีวิตชีวา แต่ตลาดไทยโดดเด่นด้วยข้าวหอมมะลิ ตะไคร้ ข่า และข้าวเหนียวมะม่วง แทนที่จะเป็นโอ๊ตเค้กอบ',
    },
    similarityNote: {
      en: 'Both cultures gather at local markets to buy fresh seasonal produce and share comforting family recipes.',
      th: 'ทั้งสองวัฒนธรรมต่างพึ่งพาตลาดท้องถิ่นเพื่อเลือกซื้อผลผลิตตามฤดูกาลและแบ่งปันสูตรอาหารประจำบ้าน',
    },
    differenceNote: {
      en: 'Whereas Scottish traditional treats highlight baked butter, oats, and orchard berries, Thai specialties balance spicy, sour, sweet, and aromatic herbs.',
      th: 'ขณะที่อาหารว่างสกอตเน้นการอบเนย ข้าวโอ๊ต และเบอร์รี อาหารไทยโดดเด่นด้วยสมดุลรสเผ็ด เปรี้ยว หวาน และกลิ่นหอมของสมุนไพรสด',
    },
    sourceNote: {
      en: 'Field Evidence · Highland Oat & Berry Traditions vs. Thai Tropical Market Pantry',
      th: 'บันทึกภาคสนาม · อาหารข้าวโอ๊ตและเบอร์รีไฮแลนด์เทียบกับวัตถุดิบตลาดไทย',
    },
    languageBridgePhrases: ['whereas', 'both ... and ...', 'different from'],
  },
  {
    id: 'highland_games_ground',
    order: 4,
    landmarkTitle: SCOTLAND_LANDMARKS[3].title,
    stationTitle: {
      en: 'Station 4 · Festival Rhythm Challenge',
      th: 'ด่านย่อยที่ 4 · ท้าทายจังหวะเทศกาล',
    },
    mechanicId: 'festival_rhythm',
    mechanicLabel: { en: 'Listen & Identify', th: 'ฟังจังหวะและระบุบทบาท' },
    scottishFact: {
      en: 'Summer Highland Games unite local towns with bagpipe parades, lively fiddle dancing, bodhrán drum beats, and safe heritage athletics.',
      th: 'เทศกาลไฮแลนด์เกมส์ในฤดูร้อนรวมผู้คนในชุมชนด้วยขบวนปี่สกอต การเต้นประกอบไวโอลินพื้นบ้าน จังหวะกลองบอดราน และกีฬาประเพณี',
    },
    a2Summary: {
      en: 'Communities celebrate summer with bagpipes, fiddles, drums, and outdoor games.',
      th: 'ชุมชนเฉลิมฉลองฤดูร้อนด้วยเสียงปี่สกอต ฟิดเดิล กลอง และกีฬาพื้นบ้าน',
    },
    b1Insight: {
      en: 'Comparing festivals requires looking at both shared purpose (community unity and music) and real differences in season, instruments, and traditions.',
      th: 'การเปรียบเทียบเทศกาลควรดูทั้งจุดร่วมด้านความสามัคคีและดนตรี ควบคู่กับความต่างเรื่องฤดูกาล เครื่องดนตรี และรูปแบบกิจกรรม',
    },
    keyVocab: [
      {
        term: 'bagpipes',
        a2Def: {
          en: 'a traditional Scottish wind instrument with steady low drone notes',
          th: 'เครื่องเป่าพื้นเมืองสกอตที่มีเสียงทุ้มต่อเนื่องเป็นเอกลักษณ์',
        },
        b1Note: {
          en: 'Produces a continuous drone alongside a bright melody played on the chanter.',
          th: 'ให้เสียงโดรนต่อเนื่องคู่กับทำนองหลักจากท่อแชนเตอร์',
        },
      },
      {
        term: 'ceilidh / folk reel',
        a2Def: {
          en: 'a friendly gathering with Scottish folk music and group dancing',
          th: 'งานสังสรรค์ชุมชนที่มีดนตรีพื้นบ้านและการเต้นเป็นกลุ่มอย่างสนุกสนาน',
        },
        b1Note: {
          en: 'Pronounced "KAY-lee"; invites all ages to join the music.',
          th: 'ออกเสียงว่า “เค-ลี” เปิดโอกาสให้ทุกวัยร่วมสนุกกับดนตรีและการเต้น',
        },
      },
    ],
    thailandConnection: {
      en: 'Just as Highland Games bring neighbors together outdoors in summer, Thai communities celebrate together at Songkran or northeastern Bun Bang Fai with joyful long-drum (klong yao) parades—different instruments and weather, same warm community spirit!',
      th: 'เช่นเดียวกับที่ไฮแลนด์เกมส์รวมผู้คนกลางแจ้ง ชุมชนไทยก็มีเทศกาลสงกรานต์หรือบุญบั้งไฟพร้อมขบวนกลองยาวอันคึกคัก แม้เครื่องดนตรีและฤดูกาลจะต่างกัน แต่เต็มไปด้วยความสามัคคีเหมือนกัน!',
    },
    similarityNote: {
      en: 'Both Highland Games and Thai festivals use rhythmic music, group movement, and outdoor gathering to strengthen community pride.',
      th: 'ทั้งไฮแลนด์เกมส์และเทศกาลไทยต่างใช้จังหวะดนตรีและการรวมตัวกลางแจ้งเพื่อสร้างความผูกพันในชุมชน',
    },
    differenceNote: {
      en: 'Bagpipes and Scottish fiddles follow brisk Celtic march/reel rhythms in cool summer meadows, while Thai parades feature long drums, khaen, or water blessings in tropical warmth.',
      th: 'ปี่สกอตและฟิดเดิลใช้จังหวะเดินแถวและเต้นแบบเคลติกในทุ่งหญ้าอากาศเย็น ส่วนขบวนไทยโดดเด่นด้วยกลองยาว แคน หรือการรดน้ำขอพรในอากาศอบอุ่น',
    },
    sourceNote: {
      en: 'Field Evidence · Original Synthesized Rhythm Cues & Regional Festival Comparison',
      th: 'บันทึกภาคสนาม · จังหวะเครื่องดนตรีสังเคราะห์ต้นฉบับและการเทียบเทศกาลท้องถิ่น',
    },
    languageBridgePhrases: ['similar to', 'while', 'both ... and ...'],
  },
  {
    id: 'lochside_castle_viewpoint',
    order: 5,
    landmarkTitle: SCOTLAND_LANDMARKS[4].title,
    stationTitle: {
      en: 'Station 5 · Culture Comparison Compass',
      th: 'ด่านย่อยที่ 5 · เข็มทิศเปรียบเทียบวัฒนธรรม',
    },
    mechanicId: 'comparison_compass',
    mechanicLabel: { en: 'Similarity & Difference Map', th: 'จัดกลุ่มความเหมือนและความต่าง' },
    scottishFact: {
      en: 'Stone castles beside mountain lochs are preserved today as heritage museums, inviting visitors to reflect on how geography and history shape different countries.',
      th: 'ปราสาทหินริมทะเลสาบ (Loch) ในปัจจุบันได้รับการอนุรักษ์เป็นแหล่งเรียนรู้ทางประวัติศาสตร์ สะท้อนว่าภูมิประเทศและอดีตหล่อหลอมแต่ละประเทศอย่างไร',
    },
    a2Summary: {
      en: 'Scotland preserves cool mountain lochs and stone castles; both countries value heritage.',
      th: 'สกอตแลนด์อนุรักษ์ทะเลสาบและปราสาทหิน ส่วนทั้งสองประเทศต่างให้คุณค่ากับมรดกวัฒนธรรม',
    },
    b1Insight: {
      en: 'Fair cultural comparison separates features unique to one environment from shared human traditions like hospitality, craftsmanship, food markets, and community celebrations.',
      th: 'การเปรียบเทียบวัฒนธรรมอย่างเข้าใจคือการแยกแยะลักษณะเฉพาะถิ่นออกจากคุณค่าร่วมของมนุษย์ เช่น การต้อนรับ งานฝีมือ ตลาดอาหาร และเทศกาลชุมชน',
    },
    keyVocab: [
      {
        term: 'loch',
        a2Def: {
          en: 'a Scottish word for a lake or narrow sea bay',
          th: 'คำภาษาสกอตและแกลิกที่หมายถึงทะเลสาบหรืออ่าวแคบ',
        },
        b1Note: {
          en: 'Many famous lochs sit inside glacier-carved Highland valleys called glens.',
          th: 'ทะเลสาบล็อกหลายแห่งตั้งอยู่ในหุบเขาเกล็นที่ถูกธารน้ำแข็งกัดเซาะ',
        },
      },
      {
        term: 'heritage preservation',
        a2Def: {
          en: 'protecting old places and traditions so future generations can learn',
          th: 'การดูแลอนุรักษ์สถานที่และประเพณีเก่าแก่ให้คนรุ่นหลังได้เรียนรู้',
        },
        b1Note: {
          en: 'Applies equally to Scottish castles and Thailand’s historic temples and palaces.',
          th: 'พบได้ทั้งในปราสาทหินของสกอตแลนด์และวัดวาอารามหรือโบราณสถานของไทย',
        },
      },
    ],
    thailandConnection: {
      en: 'While Scotland’s historic landmarks feature rugged stone keeps overlooking chilly lochs, Thailand preserves gilded temple roofs and riverside heritage cities like Ayutthaya—yet both nations treasure keeping their stories alive.',
      th: 'ขณะที่แลนด์มาร์กประวัติศาสตร์ของสกอตแลนด์เป็นปราสาทหินริมทะเลสาบหนาว ไทยอนุรักษ์วัดหลังคาสีทองและเมืองประวัติศาสตร์ริมแม่น้ำอย่างอยุธยา แต่ทั้งสองชาติต่างรักษารากเหง้าไว้อย่างภาคภูมิใจ',
    },
    similarityNote: {
      en: 'Both Scotland and Thailand protect historic landmarks, share traditional foods, treasure regional textiles, and host joyful community celebrations.',
      th: 'ทั้งสกอตแลนด์และไทยต่างอนุรักษ์โบราณสถาน สืบทอดอาหารท้องถิ่น ภูมิใจในผ้าทอพื้นบ้าน และจัดเทศกาลชุมชนร่วมกัน',
    },
    differenceNote: {
      en: 'Scotland features cool stone architecture, wool tartans, and oat-based treats, whereas Thailand features tropical timber/gilded temples, woven silk, and aromatic herb-rich cuisine.',
      th: 'สกอตแลนด์โดดเด่นด้วยปราสาทหิน ผ้าทาร์ทันขนสัตว์ และขนมข้าวโอ๊ต ส่วนไทยโดดเด่นด้วยวัดเขตร้อน ผ้าไหมทอมือ และอาหารสมุนไพรหอมกรุ่น',
    },
    sourceNote: {
      en: 'Field Evidence · Culminating Scotland–Thailand Comparison Board',
      th: 'บันทึกภาคสนาม · ตารางสรุปการเปรียบเทียบวัฒนธรรมสกอตแลนด์–ไทย',
    },
    languageBridgePhrases: ['both ... and ...', 'similar to', 'different from', 'while', 'unlike'],
  },
];

export const VILLAGE_DETECTIVE_CATEGORIES: {
  id: VillageEvidenceCategory;
  label: LocalizedText;
}[] = [
  { id: 'everyday_life', label: { en: 'Everyday Life', th: 'ชีวิตประจำวัน' } },
  { id: 'traditional_culture', label: { en: 'Traditional Culture', th: 'วัฒนธรรมดั้งเดิม' } },
  { id: 'community_spaces', label: { en: 'Community Spaces', th: 'พื้นที่ชุมชน' } },
  { id: 'historic_heritage', label: { en: 'Historic Heritage', th: 'มรดกประวัติศาสตร์' } },
];

export const VILLAGE_DETECTIVE_CLUES: VillageDetectiveClue[] = [
  {
    id: 'village_cafe_school',
    label: { en: 'Granite Bookshop & Morning School Walk', th: 'ร้านหนังสือหินแกรนิตและการเดินไปโรงเรียน' },
    visualTag: 'school_shop',
    a2Clue: {
      en: 'Students carry backpacks past a warm cafe and grocery shop on a Monday morning.',
      th: 'นักเรียนสะพายกระเป๋าเดินผ่านร้านกาแฟและร้านขายของชำในเช้าวันจันทร์',
    },
    b1Clue: {
      en: 'Even though the shop walls are built from 19th-century granite stone, inside people tap debit cards, pick up fresh fruit, and chat on phones.',
      th: 'แม้ผนังร้านจะสร้างจากหินแกรนิตเก่าแก่ แต่ข้างในมีทั้งผลไม้สด ร้านหนังสือ และการจับจ่ายใช้สอยแบบยุคปัจจุบัน',
    },
    hint: {
      en: 'Think about what people do on an ordinary weekday morning!',
      th: 'ลองนึกถึงสิ่งที่คนทำเป็นปกติในเช้าวันธรรมดา!',
    },
    correctCategory: 'everyday_life',
    categoryExplanation: {
      everyday_life: {
        en: 'Spot on! Old stone walls in Scotland often hold ordinary modern shops, schools, and cafes used every day.',
        th: 'ถูกต้อง! อาคารหินเก่าแก่ในสกอตแลนด์มักเป็นร้านค้า โรงเรียน และคาเฟ่ที่ผู้คนใช้ในชีวิตประจำวันยุคใหม่',
      },
      traditional_culture: {
        en: 'Close look needed: Going to school and buying groceries is part of modern daily routine rather than a special festival tradition.',
        th: 'ลองคิดอีกนิดนะ: การไปโรงเรียนและซื้อของชำเป็นกิจวัตรประจำวันยุคใหม่ ไม่ใช่พิธีกรรมหรือวัฒนธรรมดั้งเดิม',
      },
      community_spaces: {
        en: 'Walking to school or shopping at a grocery focuses on daily routines; look for shared gathering spots like the fountain board for Community Spaces.',
        th: 'การไปโรงเรียนและซื้อของเน้นที่กิจวัตรประจำวัน ส่วนพื้นที่พบปะส่วนรวมเช่นลานน้ำพุคือ Community Spaces',
      },
      historic_heritage: {
        en: 'Careful assumption check! Old stone buildings can mislead travelers—look at what is happening now: backpacks, fruit, and modern daily life.',
        th: 'ระวังเข้าใจผิดนะ! แม้อาคารหินจะดูเก่า แต่กิจกรรมข้างในคือชีวิตประจำวันยุคปัจจุบันของนักเรียนและคนในเมือง',
      },
    },
  },
  {
    id: 'heather_noticeboard',
    label: { en: 'Carved Fountain & Village Noticeboard', th: 'น้ำพุหินแกะสลักและบอร์ดข่าวสารหมู่บ้าน' },
    visualTag: 'fountain_board',
    a2Clue: {
      en: 'Neighbors meet by wooden benches to read club posters, lost-pet flyers, and local events.',
      th: 'เพื่อนบ้านมานั่งคุยกันบนม้านั่งไม้และอ่านโปสเตอร์กิจกรรมชุมชนที่บอร์ดกลางลาน',
    },
    b1Clue: {
      en: 'Positioned in the pedestrian center, this open square invites retirees, families, and hikers to share news and rest together.',
      th: 'ตั้งอยู่ใจกลางเขตคนเดิน เพื่อเป็นจุดนัดพบ พักผ่อน และแลกเปลี่ยนข่าวสารของทุกช่วงวัยในหมู่บ้าน',
    },
    hint: {
      en: 'It is a shared place where everyone in town gathers and reads public notices.',
      th: 'เป็นพื้นที่ส่วนกลางที่คนในหมู่บ้านมารวมตัวและอ่านประกาศร่วมกัน',
    },
    correctCategory: 'community_spaces',
    categoryExplanation: {
      everyday_life: {
        en: 'Good thought, though noticeboards and central seating specifically show how a shared public space brings the whole neighborhood together.',
        th: 'ใกล้เคียงแล้ว แต่บอร์ดประกาศและม้านั่งกลางลานแสดงให้เห็นบทบาทของ “พื้นที่ชุมชนส่วนรวม” ได้ชัดเจนที่สุด',
      },
      traditional_culture: {
        en: 'Not quite—neighbors posting flyers and chatting on benches is about how public community space works.',
        th: 'ยังไม่ใช่ทีเดียวนะ การติดประกาศและนั่งคุยกันเป็นการใช้งานพื้นที่สาธารณะของชุมชน',
      },
      community_spaces: {
        en: 'Exactly right! Just like a Thai local plaza or temple courtyard, the village square connects neighbors across generations.',
        th: 'แม่นยำมาก! เช่นเดียวกับลานชุมชนหรือลานวัดในไทย จัตุรัสหมู่บ้านช่วยเชื่อมความสัมพันธ์ของคนทุกวัย',
      },
      historic_heritage: {
        en: 'While the fountain is carved from stone, this clue highlights neighbors meeting and reading current club notices together.',
        th: 'แม้น้ำพุจะแกะสลักจากหิน แต่เบาะแสนี้เน้นการที่ชาวบ้านมาพบปะและอ่านข่าวสารปัจจุบันร่วมกัน',
      },
    },
  },
  {
    id: 'tartan_festival_flag',
    label: { en: 'Tartan Banner & Piper Gathering Poster', th: 'ธงผ้าทาร์ทันและป้ายเชิญงานปี่สกอต' },
    visualTag: 'festival_banner',
    a2Clue: {
      en: 'A colorful checked banner invites locals to Saturday’s folk dance and Highland piping celebration.',
      th: 'ธงลายตารางสีสดเชิญชวนชาวบ้านร่วมงานเต้นพื้นบ้านและการเป่าปี่สกอตวันเสาร์นี้',
    },
    b1Clue: {
      en: 'Unlike ordinary weekday commutes, this seasonal celebration highlights regional music, folk dance steps, and woven clan patterns.',
      th: 'ต่างจากวันทำงานปกติ กิจกรรมตามฤดูกาลนี้เฉลิมฉลองดนตรีพื้นบ้าน ท่ารำ และลวดลายผ้าทอประจำท้องถิ่น',
    },
    hint: {
      en: 'Folk dance, piping, and tartan banners are shared cultural expressions!',
      th: 'การเต้นพื้นบ้าน ปี่สกอต และธงทาร์ทันเป็นประเพณีทางวัฒนธรรมที่สืบทอดกันมา!',
    },
    correctCategory: 'traditional_culture',
    categoryExplanation: {
      everyday_life: {
        en: 'Think again: folk music and tartan festival banners celebrate special cultural traditions rather than daily weekday chores.',
        th: 'ลองดูใหม่นะ: ดนตรีพื้นบ้านและป้ายเทศกาลทาร์ทันเป็นงานประเพณีพิเศษ ไม่ใช่กิจวัตรวันธรรมดา',
      },
      traditional_culture: {
        en: 'Great detective work! Piping, folk dances, and tartan motifs are living Scottish cultural traditions.',
        th: 'เก่งมาก! ดนตรีปี่สกอต การเต้นพื้นบ้าน และลายทาร์ทันคือวัฒนธรรมดั้งเดิมของสกอตแลนด์ที่ยังมีชีวิต',
      },
      community_spaces: {
        en: 'Even though the banner hangs outside, the clue focuses on the music, dance, and tartan heritage being celebrated.',
        th: 'แม้ป้ายจะแขวนในลานกลางแจ้ง แต่จุดสำคัญของเบาะแสนี้คือประเพณีดนตรีและการเต้นพื้นบ้าน',
      },
      historic_heritage: {
        en: 'This poster advertises an upcoming Saturday gathering—it is active living traditional culture rather than an ancient ruin.',
        th: 'ป้ายนี้เชิญร่วมงานวันเสาร์ที่จะถึง จึงเป็นวัฒนธรรมประเพณีที่ยังจัดต่อเนื่อง ไม่ใช่โบราณสถานในอดีต',
      },
    },
  },
  {
    id: 'granite_cairn_lintel',
    label: { en: '1842 Inscribed Stone Cairn & Wellhead', th: 'เสาหินสลักปี 1842 และบ่อน้ำโบราณ' },
    visualTag: 'stone_cairn',
    a2Clue: {
      en: 'A weathered stone plaque marks the year 1842 when village builders first laid the granite road.',
      th: 'แผ่นหินเก่าแก่สลักปี ค.ศ. 1842 บันทึกวันที่ช่างก่อสร้างวางถนนหินแกรนิตสายแรกของหมู่บ้าน',
    },
    b1Clue: {
      en: 'Preserved by local volunteers with an information plaque, this monument lets visitors trace two centuries of Highland town history.',
      th: 'อนุสรณ์หินที่อาสาสมัครท้องถิ่นอนุรักษ์ไว้พร้อมป้ายเล่าประวัติ ช่วยให้ผู้มาเยือนย้อนดูประวัติศาสตร์หมู่บ้านกว่าสองร้อยปี',
    },
    hint: {
      en: 'Look at the year 1842 carved in weathered stone to preserve local history!',
      th: 'สังเกตปี ค.ศ. 1842 ที่สลักบนหินเพื่อบันทึกประวัติศาสตร์ท้องถิ่น!',
    },
    correctCategory: 'historic_heritage',
    categoryExplanation: {
      everyday_life: {
        en: 'An 1842 monument preserved with an information plaque tells us about the past rather than modern weekday habits.',
        th: 'เสาหินปี ค.ศ. 1842 ที่ติดป้ายประวัติบอกเล่าเรื่องราวในอดีตมากกว่ากิจวัตรปัจจุบัน',
      },
      traditional_culture: {
        en: 'Close—this stone marker specifically preserves a dated historical milestone from 1842 rather than a dance or craft.',
        th: 'ใกล้แล้ว—หลักหินนี้บันทึกเหตุการณ์ทางประวัติศาสตร์ในปี ค.ศ. 1842 โดยตรง มากกว่าจะเป็นประเพณีการแสดง',
      },
      community_spaces: {
        en: 'It stands in town, yes, but the carved 1842 date makes it a preserved record of past history.',
        th: 'แม้จะตั้งอยู่ในหมู่บ้าน แต่จารึกปี ค.ศ. 1842 ทำให้สิ่งนี้เป็นหลักฐานมรดกทางประวัติศาสตร์',
      },
      historic_heritage: {
        en: 'Correct! Preserving dated stonework helps villages honor their history alongside modern life.',
        th: 'ถูกต้อง! การอนุรักษ์สิ่งก่อสร้างที่จารึกปีประวัติศาสตร์ช่วยให้คนรุ่นหลังเข้าใจรากเหง้าของชุมชน',
      },
    },
  },
];

export const TARTAN_PURPOSE_OPTIONS: TartanPurposeOption[] = [
  {
    id: 'woven_heritage_grid',
    label: {
      en: 'Crossing dyed wool threads woven to show Scottish regional & family identity',
      th: 'ลายเส้นขนสัตว์ย้อมสีทอตัดไขว้กัน แสดงเอกลักษณ์ภูมิภาคและตระกูลสกอต',
    },
    wrongExplanation: {
      en: 'Check carefully: crossing wool threads belong to traditional Scottish tartan cloth itself.',
      th: 'ลองดูอีกครั้งนะ: เส้นใยขนสัตว์ทอไขว้เป็นเอกลักษณ์ของผ้าทาร์ทันสกอตแลนด์',
    },
  },
  {
    id: 'ceremonial_kilt',
    label: {
      en: 'Pleated formal Highland outfit saved mainly for weddings, graduations & festivals',
      th: 'ชุดจับจีบทางการที่นิยมสวมในงานแต่งงาน พิธีจบการศึกษา และงานเทศกาลสำคัญ',
    },
    wrongExplanation: {
      en: 'Remember Fiona’s tip: pleated formal Highland dress is the wool kilt worn on special occasions.',
      th: 'นึกถึงคำแนะนำของฟิโอนา: ชุดจับจีบทางการคือกระโปรงคิลต์ที่สวมในโอกาสพิเศษ',
    },
  },
  {
    id: 'modern_daily_wear',
    label: {
      en: 'Everyday jackets, sweaters & jeans worn by most people on normal school or work days',
      th: 'เสื้อแจ็กเกต สเวตเตอร์ และยีนส์ที่คนสกอตส่วนใหญ่ใส่ในวันเรียนหรือวันทำงานปกติ',
    },
    wrongExplanation: {
      en: 'Look closely—modern warm sweaters and jeans represent everyday contemporary wear in Scotland.',
      th: 'สังเกตดูนะ—สเวตเตอร์อุ่นและยีนส์คือเครื่องแต่งกายในชีวิตประจำวันยุคปัจจุบันของสกอตแลนด์',
    },
  },
  {
    id: 'thai_praewa_silk',
    label: {
      en: 'Fine handwoven Thai silk from Kalasin with geometric patterns treasured for special events',
      th: 'ผ้าไหมทอมือลวดลายเรขาคณิตอันประณีตจากจังหวัดกาฬสินธุ์ของไทย ใช้สวมในงานสำคัญ',
    },
    wrongExplanation: {
      en: 'Notice the Thailand link: Kalasin’s handwoven silk with geometric diamond patterns is Praewa silk!',
      th: 'สังเกตจุดเชื่อมโยงกับไทย: ผ้าไหมทอมือลายเรขาคณิตจากกาฬสินธุ์คือผ้าไหมแพรวาของไทยนั่นเอง!',
    },
  },
];

export const TARTAN_MATCH_CARDS: TartanMatchCard[] = [
  {
    id: 'card_tartan_grid',
    title: { en: 'Tartan Criss-Cross Weave', th: 'ลายทอไขว้ผ้าทาร์ทัน' },
    originTag: 'scotland',
    visualVariant: 'tartan_grid',
    a2Description: {
      en: 'Checked wool pattern with red, green, and navy stripes crossing cleanly.',
      th: 'ผ้าขนสัตว์ลายตารางสีแดง เขียว และกรมท่าทอตัดไขว้กัน',
    },
    b1Description: {
      en: 'Warp and weft wool threads repeat in exact colour counts to create distinctive regional patterns.',
      th: 'เส้นยืนและเส้นพุ่งจัดสัดส่วนสีซ้ำอย่างแม่นยำจนเกิดลายเฉพาะท้องถิ่น',
    },
    hint: {
      en: 'Focus on the crossing wool threads!',
      th: 'โฟกัสที่การทอเส้นขนสัตว์ไขว้กัน!',
    },
    correctPurposeId: 'woven_heritage_grid',
  },
  {
    id: 'card_wool_kilt',
    title: { en: 'Tailored Highland Kilt', th: 'กระโปรงคิลต์สกอตแลนด์' },
    originTag: 'scotland',
    visualVariant: 'wool_kilt',
    a2Description: {
      en: 'Heavy pleated tartan garment paired with a neat jacket for proud celebrations.',
      th: 'ผ้านุ่งจับจีบผ้าทาร์ทันที่สวมคู่เสื้อสูทในวันสำคัญ',
    },
    b1Description: {
      en: 'Although famous worldwide as a Scottish symbol, residents reserve full kilt outfits for milestone ceremonies.',
      th: 'แม้จะเป็นสัญลักษณ์สกอตแลนด์ที่ทั่วโลกรู้จัก แต่ผู้คนมักสงวนไว้สวมในพิธีสำคัญของชีวิต',
    },
    hint: {
      en: 'Match the pleated formal garment to when Scots actually wear it!',
      th: 'จับคู่ชุดจับจีบทางการกับโอกาสที่ชาวสกอตสวมใส่จริง!',
    },
    correctPurposeId: 'ceremonial_kilt',
  },
  {
    id: 'card_modern_jacket',
    title: { en: 'Cozy Highland Weekday Outfit', th: 'ชุดวันธรรมดาในไฮแลนด์' },
    originTag: 'scotland',
    visualVariant: 'modern_jacket',
    a2Description: {
      en: 'Waterproof rain jacket, knit jumper, and comfortable jeans on a Tuesday walk.',
      th: 'เสื้อกันฝน เสื้อไหมพรม และกางเกงยีนส์สำหรับเดินในวันอังคาร',
    },
    b1Description: {
      en: 'Challenges the stereotype that people wear historic kilts to school, offices, or supermarkets.',
      th: 'ช่วยลบล้างภาพจำผิด ๆ ที่คิดว่าชาวสกอตใส่คิลต์ไปโรงเรียนหรือซื้อของทุกวัน',
    },
    hint: {
      en: 'What do people actually wear on normal school and work days?',
      th: 'ผู้คนสวมชุดแบบใดในวันไปโรงเรียนและวันทำงานปกติ?',
    },
    correctPurposeId: 'modern_daily_wear',
  },
  {
    id: 'card_praewa_silk',
    title: { en: 'Kalasin Praewa Silk (Thailand)', th: 'ผ้าไหมแพรวากาฬสินธุ์ (ไทย)' },
    originTag: 'thailand',
    visualVariant: 'praewa_silk',
    a2Description: {
      en: 'Gleaming Thai handwoven silk with intricate diamond motifs from Kalasin Province.',
      th: 'ผ้าไหมทอมือเงางามลายเพชรและจกอันประณีตจากจังหวัดกาฬสินธุ์',
    },
    b1Description: {
      en: 'Shows a meaningful Thailand connection: both cultures honor master weavers, even though climate makes Thai fabric airy silk rather than heavy wool.',
      th: 'สะท้อนจุดเชื่อมโยงกับไทย: ทั้งสองชาติต่างเชิดชูช่างทอมือ แม้ภูมิอากาศจะทำให้ไทยใช้ไหมโปร่งต่างจากขนสัตว์หนาของสกอต',
    },
    hint: {
      en: 'Look for the handwoven Thai silk from Kalasin!',
      th: 'มองหาผ้าไหมทอมือจากจังหวัดกาฬสินธุ์ของไทย!',
    },
    correctPurposeId: 'thai_praewa_silk',
  },
];

export const TARTAN_REFLECTION_CHECK = {
  prompt: {
    en: 'Final Textile Insight: How do Scottish tartan and Thai Kalasin Praewa silk compare?',
    th: 'สรุปข้อค้นพบสิ่งทอ: ผ้าทาร์ทันสกอตแลนด์และผ้าไหมแพรวาไทยเปรียบเทียบกันอย่างไร?',
  },
  options: [
    {
      id: 'identical',
      label: {
        en: 'They are identical—both are heavy wool kilts worn every day to school.',
        th: 'เหมือนกันทุกประการ—ทั้งคู่เป็นผ้าขนสัตว์หนาที่ใส่ไปโรงเรียนทุกวัน',
      },
      isCorrect: false,
      feedback: {
        en: 'Careful! Tartan is wool for cool weather and Praewa is breathable Thai silk—and neither is everyday school wear for everyone.',
        th: 'ระวังนะ! ทาร์ทันทำจากขนสัตว์รับลมหนาว ส่วนแพรวาเป็นไหมโปร่งสำหรับอากาศร้อน และไม่ใช่ชุดใส่ไปโรงเรียนทุกวัน',
      },
    },
    {
      id: 'balanced_compare',
      label: {
        en: 'Both celebrate skilled local weaving & special-occasion pride, while differing in material (wool vs. silk), pattern style, and climate fit.',
        th: 'ทั้งคู่ต่างภูมิใจในงานทอพื้นถิ่นและสวมใส่ในโอกาสสำคัญเหมือนกัน แต่ต่างกันที่วัสดุ (ขนสัตว์กับไหม) ลวดลาย และภูมิอากาศ',
      },
      isCorrect: true,
      feedback: {
        en: 'Brilliant cultural reasoning! You spotted both the shared pride in weaving heritage and the real differences in fabric and climate.',
        th: 'ยอดเยี่ยมมาก! คุณเห็นทั้งคุณค่าร่วมด้านงานทอมรดกและความแตกต่างจริงของวัสดุและภูมิอากาศ',
      },
    },
    {
      id: 'unrelated',
      label: {
        en: 'Only Scotland weaves traditional patterns; Thailand has no regional textiles.',
        th: 'มีเพียงสกอตแลนด์เท่านั้นที่มีผ้าทอประจำถิ่น ประเทศไทยไม่มีผ้าทอพื้นบ้าน',
      },
      isCorrect: false,
      feedback: {
        en: 'Not true—Thailand has rich regional textiles such as Kalasin Praewa silk, Mudmee ikat, and northern woven cotton.',
        th: 'ไม่ถูกต้อง—ไทยมีผ้าทอท้องถิ่นหลากหลาย เช่น ผ้าไหมแพรวากาฬสินธุ์ ผ้ามัดหมี่ และผ้าทอภาคเหนือ',
      },
    },
  ],
};

export const FOOD_INVESTIGATION_TRAYS: FoodInvestigationTray[] = [
  {
    id: 'tray_oatcakes',
    dishName: { en: 'Scottish Oatcakes', th: 'ขนมปังแผ่นข้าวโอ๊ตสกอต (Oatcakes)' },
    visualVariant: 'oatcakes',
    ingredients: [
      { en: 'Whole rolled oats', th: 'ข้าวโอ๊ตเต็มเมล็ด' },
      { en: 'Pinch of sea salt', th: 'เกลือทะเลเล็กน้อย' },
      { en: 'Warm water & griddle bake', th: 'น้ำอุ่นและอบบนกระทะหิน' },
    ],
    pantryShelf: [
      {
        id: 'rolled_oats',
        label: { en: 'Whole rolled oats', th: 'ข้าวโอ๊ตเต็มเมล็ด' },
        isScottishIngredient: true,
        feedback: {
          en: 'Added rolled oats! Oats thrive in cool, rainy Scottish valleys.',
          th: 'ใส่ข้าวโอ๊ตแล้ว! ข้าวโอ๊ตเติบโตได้ดีในหุบเขาอากาศเย็นชื้นของสกอตแลนด์',
        },
      },
      {
        id: 'sea_salt',
        label: { en: 'Pinch of sea salt', th: 'เกลือทะเลเล็กน้อย' },
        isScottishIngredient: true,
        feedback: {
          en: 'Added sea salt for a savory, crispy oatcake flavor!',
          th: 'ใส่เกลือทะเลเพิ่มรสกลมกล่อมให้โอ๊ตเค้กอบกรอบแล้ว!',
        },
      },
      {
        id: 'griddle_water',
        label: { en: 'Warm water & griddle', th: 'น้ำอุ่นและกระทะหินอบ' },
        isScottishIngredient: true,
        feedback: {
          en: 'Warm water binds the oats before baking crisp on a stone griddle.',
          th: 'น้ำอุ่นช่วยประสานเมล็ดข้าวโอ๊ตก่อนอบจนกรอบบนกระทะหิน',
        },
      },
      {
        id: 'thai_lemongrass',
        label: { en: 'Fresh Thai lemongrass', th: 'ตะไคร้หอมสดแบบไทย' },
        isScottishIngredient: false,
        feedback: {
          en: 'Lemongrass brings bright aroma to Thai soups in warm tropical gardens—Scottish oatcakes use hardy oats instead!',
          th: 'ตะไคร้หอมเป็นสมุนไพรเขตร้อนของครัวไทย—ส่วนโอ๊ตเค้กสกอตเน้นข้าวโอ๊ตจากอากาศหนาว',
        },
      },
      {
        id: 'thai_fish_sauce',
        label: { en: 'Fermented fish sauce', th: 'น้ำปลาไทย' },
        isScottishIngredient: false,
        feedback: {
          en: 'Fish sauce seasons savory Thai stir-fries and salads; look for simple Scottish oats and salt here.',
          th: 'น้ำปลาเป็นเครื่องปรุงหลักของอาหารไทย—สำหรับโอ๊ตเค้กสกอตใช้เพียงข้าวโอ๊ต น้ำอุ่น และเกลือทะเล',
        },
      },
    ],
    climateClueA2: {
      en: 'Oats grow easily in cool, rainy Scottish valleys and bake into crispy savory rounds.',
      th: 'ข้าวโอ๊ตเติบโตได้ดีในหุบเขาอากาศเย็นและฝนชุกของสกอตแลนด์ จึงนิยมนำมาอบเป็นแผ่นกรอบเค็มมัน',
    },
    climateClueB1: {
      en: 'Before imported wheat became common, hardy oat crops fed families all winter—often served today with cheddar cheese or warm soup.',
      th: 'ข้าวโอ๊ตที่ทนความหนาวเป็นเสบียงสำคัญตลอดฤดูหนาว ปัจจุบันนิยมกินคู่ชีสหรือซุปร้อน',
    },
    hint: {
      en: 'Pick oats, sea salt, and warm griddle water—leave out tropical Thai herbs & sauces!',
      th: 'เลือกข้าวโอ๊ต เกลือทะเล และน้ำอุ่นบนกระทะหิน—แยกสมุนไพรและเครื่องปรุงเขตร้อนของไทยออกไว้!',
    },
    thaiContrastId: 'rice_staple',
    thaiContrastOptions: [
      {
        id: 'rice_staple',
        label: {
          en: 'Similar role to Thai jasmine rice as a staple grain, though baked savory from oats for cool weather',
          th: 'มีบทบาทเป็นธัญพืชหลักคล้ายข้าวหอมมะลิของไทย แต่ใช้ข้าวโอ๊ตอบให้เหมาะกับเมืองหนาว',
        },
        explanation: {
          en: 'Spot on! Both oats in Scotland and rice in Thailand act as everyday staple grains shaped by local climate.',
          th: 'ถูกต้อง! ข้าวโอ๊ตในสกอตแลนด์และข้าวในไทยต่างเป็นธัญพืชหลักที่สัมพันธ์กับภูมิอากาศท้องถิ่น',
        },
      },
      {
        id: 'spicy_chili',
        label: {
          en: 'Made with fresh Thai bird’s eye chili, lime juice, and fish sauce',
          th: 'ปรุงด้วยพริกขี้หนูสด น้ำมะนาว และน้ำปลาแบบไทย',
        },
        explanation: {
          en: 'Look at the ingredient tray again—there are no chilies or lime in oatcakes; those belong to Thai savory dishes!',
          th: 'ดูถาดวัตถุดิบอีกทีนะ—โอ๊ตเค้กไม่มีพริกหรือมะนาว ส่วนผสมเหล่านั้นเป็นเอกลักษณ์อาหารไทย',
        },
      },
    ],
  },
  {
    id: 'tray_shortbread',
    dishName: { en: 'Highland Butter Shortbread', th: 'ขนมชอร์ตเบรดเนยสดไฮแลนด์' },
    visualVariant: 'shortbread',
    ingredients: [
      { en: 'Rich golden butter', th: 'เนยสดแท้' },
      { en: 'Wheat flour', th: 'แป้งสาลี' },
      { en: 'Fine sugar', th: 'น้ำตาลละเอียด' },
    ],
    pantryShelf: [
      {
        id: 'golden_butter',
        label: { en: 'Rich Scottish butter', th: 'เนยสดแท้จากนมวัว' },
        isScottishIngredient: true,
        feedback: {
          en: 'Added golden butter! Dairy butter gives Highland shortbread its famous aroma.',
          th: 'ใส่เนยสดแล้ว! เนยนมวัวหอมมันคือหัวใจของชอร์ตเบรดสกอตแลนด์',
        },
      },
      {
        id: 'wheat_flour',
        label: { en: 'Sifted wheat flour', th: 'แป้งสาลีร่อนละเอียด' },
        isScottishIngredient: true,
        feedback: {
          en: 'Added wheat flour to form the crumbly baked biscuit dough.',
          th: 'ใส่แป้งสาลีเพื่อสร้างเนื้อคุกกี้อบกรอบร่วนแล้ว',
        },
      },
      {
        id: 'fine_sugar',
        label: { en: 'Fine sugar', th: 'น้ำตาลทรายละเอียด' },
        isScottishIngredient: true,
        feedback: {
          en: 'Added sugar for gentle sweetness alongside hot afternoon tea.',
          th: 'ใส่น้ำตาลเพื่อรสหวานละมุนคู่ชาร้อนยามบ่าย',
        },
      },
      {
        id: 'thai_coconut_milk',
        label: { en: 'Fresh pressed coconut milk', th: 'หัวกะทิคั้นสด' },
        isScottishIngredient: false,
        feedback: {
          en: 'Coconut palms love sunny Thai coasts! Classic Thai steamed sweets use coconut cream instead of Scottish dairy butter.',
          th: 'มะพร้าวเติบโตในเขตร้อนของไทย! ขนมไทยนิยมใช้หัวกะทิ ส่วนชอร์ตเบรดสกอตใช้เนยนมวัวและเตาอบ',
        },
      },
      {
        id: 'thai_pandan',
        label: { en: 'Fragrant pandan leaves', th: 'ใบเตยหอม' },
        isScottishIngredient: false,
        feedback: {
          en: 'Pandan scents classic green Thai desserts; Scottish shortbread uses slow oven-baked butter and flour.',
          th: 'ใบเตยหอมเป็นเอกลักษณ์ขนมไทย ส่วนชอร์ตเบรดสกอตใช้เนย แป้งสาลี และน้ำตาลอบช้า ๆ',
        },
      },
    ],
    climateClueA2: {
      en: 'A classic golden baked biscuit shared with hot tea when friends visit.',
      th: 'คุกกี้เนยอบสีทองที่นิยมเสิร์ฟคู่ชาร้อนเวลาต้อนรับเพื่อนฝูง',
    },
    climateClueB1: {
      en: 'Its name comes from the old word "short" meaning crumbly texture—no baking yeast needed, just slow oven baking.',
      th: 'คำว่า “Short” ในอดีตแปลว่ากรอบร่วน ขนมนี้ใช้เพียงเนย แป้ง และน้ำตาลอบช้า ๆ โดยไม่ใส่ยีสต์',
    },
    hint: {
      en: 'Shortbread uses 3 simple baking items: butter, flour, and sugar!',
      th: 'ชอร์ตเบรดใช้วัตถุดิบอบเพียง 3 อย่าง: เนยสด แป้งสาลี และน้ำตาล!',
    },
    thaiContrastId: 'steamed_coconut_contrast',
    thaiContrastOptions: [
      {
        id: 'steamed_coconut_contrast',
        label: {
          en: 'Both serve as warm hospitality treats, unlike Thai steamed sweets using coconut milk and pandan',
          th: 'ต่างใช้ต้อนรับแขกเหมือนกัน แต่ต่างจากขนมไทยที่มักนึ่งกับกะทิและใบเตย',
        },
        explanation: {
          en: 'Great observation! Scottish shortbread uses oven-baked dairy butter, while traditional Thai desserts often highlight steamed coconut milk and pandan.',
          th: 'สังเกตได้ดีมาก! ชอร์ตเบรดใช้เนยนมอบ ส่วนขนมไทยดั้งเดิมมักใช้กะทิและใบเตยหอม',
        },
      },
      {
        id: 'same_coconut',
        label: {
          en: 'Shortbread is steamed inside banana leaves with coconut cream',
          th: 'ชอร์ตเบรดห่อใบตองนึ่งกับหัวกะทิ',
        },
        explanation: {
          en: 'Check the ingredients: shortbread uses oven-baked butter, flour, and sugar—banana leaf steaming is a classic Thai method!',
          th: 'เช็กวัตถุดิบอีกทีนะ: ชอร์ตเบรดใช้เนย แป้ง น้ำตาลแล้วอบ ส่วนการห่อใบตองนึ่งเป็นวิธีแบบไทย!',
        },
      },
    ],
  },
  {
    id: 'tray_berries',
    dishName: { en: 'Highland Berry & Toasted Oat Bowl', th: 'เบอร์รีไฮแลนด์และข้าวโอ๊ตคั่ว' },
    visualVariant: 'berries_oats',
    ingredients: [
      { en: 'Cool-summer raspberries', th: 'ราสป์เบอร์รีฤดูร้อน' },
      { en: 'Toasted Highland oats', th: 'ข้าวโอ๊ตคั่วหอม' },
      { en: 'Heather blossom honey', th: 'น้ำผึ้งดอกเฮเทอร์' },
    ],
    pantryShelf: [
      {
        id: 'highland_berries',
        label: { en: 'Highland raspberries', th: 'ราสป์เบอร์รีเมืองหนาว' },
        isScottishIngredient: true,
        feedback: {
          en: 'Added Highland berries! Crisp Scottish summers make berries extra sweet.',
          th: 'ใส่ราสป์เบอร์รีแล้ว! ฤดูร้อนอากาศเย็นของสกอตแลนด์ทำให้เบอร์รีหวานฉ่ำ',
        },
      },
      {
        id: 'toasted_oats',
        label: { en: 'Toasted Highland oats', th: 'ข้าวโอ๊ตคั่วกรอบ' },
        isScottishIngredient: true,
        feedback: {
          en: 'Added crunchy toasted oats—Scotland’s signature northern grain.',
          th: 'ใส่ข้าวโอ๊ตคั่วหอมแล้ว—ธัญพืชสำคัญคู่ครัวไฮแลนด์',
        },
      },
      {
        id: 'heather_honey',
        label: { en: 'Heather blossom honey', th: 'น้ำผึ้งดอกเฮเทอร์' },
        isScottishIngredient: true,
        feedback: {
          en: 'Added golden heather honey harvested from purple Highland hills!',
          th: 'ใส่น้ำผึ้งดอกเฮเทอร์สีทองจากเนินเขาไฮแลนด์แล้ว!',
        },
      },
      {
        id: 'thai_mango',
        label: { en: 'Ripe tropical Nam Dok Mai mango', th: 'มะม่วงน้ำดอกไม้สุกเขตร้อน' },
        isScottishIngredient: false,
        feedback: {
          en: 'Mangoes ripen in sunny Thailand for mango sticky rice—in cool Scotland, local berries take that seasonal role!',
          th: 'มะม่วงน้ำดอกไม้เป็นผลไม้เขตร้อนของไทยคู่ข้าวเหนียวมะม่วง—ส่วนสกอตแลนด์ใช้เบอร์รีตามฤดูกาลแทน!',
        },
      },
      {
        id: 'thai_sticky_rice',
        label: { en: 'Steamed glutinous rice', th: 'ข้าวเหนียวมูนนึ่ง' },
        isScottishIngredient: false,
        feedback: {
          en: 'Sticky rice is treasured in Thai desserts; Highland bowls toast local oats instead.',
          th: 'ข้าวเหนียวมูนเป็นเอกลักษณ์ของขนมไทย ส่วนชามผลไม้ไฮแลนด์ใช้ข้าวโอ๊ตคั่ว',
        },
      },
    ],
    climateClueA2: {
      en: 'Long summer daylight in Scotland ripens sweet berries enjoyed with oats and honey.',
      th: 'กลางวันอันยาวนานช่วงฤดูร้อนในสกอตแลนด์ทำให้เบอร์รีรสหวานฉ่ำ เหมาะกินคู่ข้าวโอ๊ตและน้ำผึ้ง',
    },
    climateClueB1: {
      en: 'Seasonal fruit highlights climate contrast cleanly: berries thrive in crisp northern summers, while mango and durian thrive in tropical sunshine.',
      th: 'ผลไม้ตามฤดูกาลสะท้อนภูมิอากาศชัดเจน เบอร์รีชอบหน้าร้อนอากาศเย็น ส่วนมะม่วงชอบแดดร้อนชื้น',
    },
    hint: {
      en: 'Choose the 3 cool-valley items: raspberries, toasted oats, and heather honey!',
      th: 'เลือก 3 วัตถุดิบจากหุบเขาหนาว: ราสป์เบอร์รี ข้าวโอ๊ตคั่ว และน้ำผึ้งดอกเฮเทอร์!',
    },
    thaiContrastId: 'seasonal_fruit_treat',
    thaiContrastOptions: [
      {
        id: 'seasonal_fruit_treat',
        label: {
          en: 'Like Thailand’s mango sticky rice, it pairs a local grain with peak-season fruit—berries here instead of tropical mango',
          th: 'คล้ายข้าวเหนียวมะม่วงของไทยที่จับคู่ธัญพืชกับผลไม้ตามฤดูกาล เพียงเปลี่ยนจากมะม่วงเป็นเบอร์รีเมืองหนาว',
        },
        explanation: {
          en: 'Wonderful comparison! Both cultures celebrate peak seasonal fruit paired with a local grain.',
          th: 'เปรียบเทียบได้เยี่ยม! ทั้งสองวัฒนธรรมต่างสร้างสรรค์เมนูจากผลไม้ตามฤดูกาลคู่ธัญพืชท้องถิ่น',
        },
      },
      {
        id: 'winter_mango',
        label: {
          en: 'Highland farmers harvest tropical mangoes and coconuts outdoors in snow',
          th: 'เกษตรกรไฮแลนด์ปลูกมะม่วงและมะพร้าวกลางหิมะ',
        },
        explanation: {
          en: 'Not possible in Scotland’s cool climate! Tropical mangoes grow in warm climates like Thailand, while berries grow in Scotland.',
          th: 'ภูมิอากาศสกอตแลนด์หนาวเกินไปสำหรับมะม่วงและมะพร้าว ซึ่งเป็นผลไม้เขตร้อนของไทย',
        },
      },
    ],
  },
];

export const FESTIVAL_RHYTHM_PROBES: FestivalRhythmProbe[] = [
  {
    id: 'bagpipe',
    mysteryLabel: { en: 'Mystery Sound #1', th: 'เสียงปริศนาที่ 1' },
    instrumentName: { en: 'Great Highland Bagpipes', th: 'ปี่สกอตไฮแลนด์ (Bagpipes)' },
    patternBars: [45, 78, 92, 68, 86, 95, 72, 60],
    a2Clue: {
      en: 'Listen: a steady low humming drone plus a bright high melody echoes across the valley.',
      th: 'ฟังเสียง: เสียงทุ้มต่ำต่อเนื่องคู่กับทำนองแหลมสดใสที่ก้องไปทั่วหุบเขา',
    },
    b1Clue: {
      en: 'Because this wind instrument projects far outdoors without electricity, players lead summer marches across the grassy Highland Games field.',
      th: 'เพราะเครื่องเป่านี้เสียงก้องไกลโดยไม่ต้องใช้เครื่องขยาย จึงนิยมนำขบวนพาเหรดกลางสนามหญ้าในงานไฮแลนด์เกมส์',
    },
    hint: {
      en: 'That continuous low drone + crisp melody comes from Scotland’s famous wind instrument leading parades!',
      th: 'เสียงโดรนต่ำต่อเนื่องคู่ทำนองสว่างเป็นเสียงเครื่องเป่าชื่อดังที่เป่านำขบวนพาเหรด!',
    },
    correctRoleId: 'lead_parade',
    roleOptions: [
      {
        id: 'lead_parade',
        label: {
          en: 'Bagpipes · Lead the outdoor Highland Games opening march',
          th: 'ปี่สกอต (Bagpipes) · เป่านำขบวนเปิดงานไฮแลนด์เกมส์กลางแจ้ง',
        },
        explanation: {
          en: 'Correct! Great Highland Bagpipes carry cleanly over open air to welcome townspeople and start the celebration.',
          th: 'ถูกต้อง! เสียงปี่สกอตดังกังวานกลางแจ้ง ใช้ต้อนรับผู้ร่วมงานและเริ่มขบวนเปิดเทศกาล',
        },
      },
      {
        id: 'quiet_library',
        label: {
          en: 'Folk Fiddle · Soft whisper chime played only in libraries',
          th: 'ฟิดเดิล · กระดิ่งเสียงเบาที่เล่นเฉพาะในห้องสมุด',
        },
        explanation: {
          en: 'Listen closely for the continuous low drone—that bold outdoor wind instrument is the Highland Bagpipes leading parades!',
          th: 'สังเกตเสียงโดรนทุ้มต่อเนื่องอีกครั้งนะ—นี่คือเสียงปี่สกอตสำหรับนำขบวนกลางแจ้ง!',
        },
      },
    ],
  },
  {
    id: 'fiddle',
    mysteryLabel: { en: 'Mystery Sound #2', th: 'เสียงปริศนาที่ 2' },
    instrumentName: { en: 'Scottish Folk Fiddle', th: 'ไวโอลินพื้นบ้านสกอต (Fiddle)' },
    patternBars: [38, 85, 52, 92, 64, 96, 48, 82],
    a2Clue: {
      en: 'Listen: quick, bouncy string notes invite everyone to clap and step in circles!',
      th: 'ฟังเสียง: เสียงเครื่องสายที่กระชับร่าเริงชวนให้ทุกคนตบมือและเต้นรำเป็นวง!',
    },
    b1Clue: {
      en: 'A bowed wooden string instrument plays energetic reels on the festival stage so neighbors of every age can join a ceilidh dance.',
      th: 'เครื่องสายสีไม้บรรเลงทำนองจังหวะเร็วบนเวทีเพื่อให้คนทุกวัยร่วมเต้นรำหมู่แบบเค-ลี (Ceilidh)',
    },
    hint: {
      en: 'Bouncy rising-and-falling string phrases come from the Fiddle for group dances!',
      th: 'ทำนองเครื่องสายที่เด้งสนุกสนานเป็นเสียงฟิดเดิลสำหรับประกอบการเต้นรำ!',
    },
    correctRoleId: 'ceilidh_dance',
    roleOptions: [
      {
        id: 'ceilidh_dance',
        label: {
          en: 'Folk Fiddle · Powers lively Ceilidh group dances on stage',
          th: 'ฟิดเดิล (Folk Fiddle) · บรรเลงประกอบการเต้นรำหมู่ Ceilidh บนเวที',
        },
        explanation: {
          en: 'Spot on! The Scottish Folk Fiddle gives ceilidh gatherings their cheerful, dancing energy.',
          th: 'ถูกต้อง! เสียงฟิดเดิลช่วยสร้างความสนุกสนานให้การเต้นรำหมู่ในงานเทศกาลสกอต',
        },
      },
      {
        id: 'heavy_march_only',
        label: {
          en: 'Bodhrán Drum · Deep bass horn used to measure weather',
          th: 'กลองบอดราน · แตรเสียงต่ำสำหรับวัดสภาพอากาศ',
        },
        explanation: {
          en: 'Notice the bright, nimble string melody—it is the Scottish Folk Fiddle built for joyful festival dancing!',
          th: 'สังเกตทำนองเครื่องสายที่คล่องแคล่วสดใส—นี่คือฟิดเดิลสำหรับประกอบการเต้นรำ!',
        },
      },
    ],
  },
  {
    id: 'bodhran',
    mysteryLabel: { en: 'Mystery Sound #3', th: 'เสียงปริศนาที่ 3' },
    instrumentName: { en: 'Bodhrán Frame Drum', th: 'กลองบอดราน (Bodhrán)' },
    patternBars: [94, 30, 72, 92, 28, 70, 90, 32],
    a2Clue: {
      en: 'Listen: steady warm wooden drumbeats keep dancers moving in time.',
      th: 'ฟังเสียง: จังหวะกลองไม้อุ่น ๆ ที่สม่ำเสมอช่วยคุมจังหวะให้นักเต้นเคลื่อนไหวพร้อมเพรียง',
    },
    b1Clue: {
      en: 'Held against the chest and tapped with a wooden tipper, this frame drum anchors rhythm like Thai klong yao anchors joyful Songkran parades.',
      th: 'กลองขอบไม้ที่ตีด้วยไม้คู่จังหวะ ช่วยคุมชีพจรของเพลงเช่นเดียวกับที่กลองยาวคุมจังหวะขบวนสงกรานต์ในไทย',
    },
    hint: {
      en: 'Notice the steady drumbeat pulse (BOOM—tap-tap—BOOM)—that is the Bodhrán frame drum!',
      th: 'ฟังจังหวะกลองที่สม่ำเสมอ (ตึง—ตับ-ตับ—ตึง)—นี่คือเสียงกลองบอดราน!',
    },
    correctRoleId: 'anchor_beat',
    roleOptions: [
      {
        id: 'anchor_beat',
        label: {
          en: 'Bodhrán Frame Drum · Keeps steady pulse like Thai parade drums do',
          th: 'กลองบอดราน (Bodhrán) · คุมจังหวะสม่ำเสมอคล้ายกลองขบวนในไทย',
        },
        explanation: {
          en: 'Well heard! The Bodhrán percussion keeps celebrations united in Scotland just as klong yao keeps rhythm in Thailand.',
          th: 'ฟังได้แม่นยำมาก! กลองบอดรานคุมจังหวะเทศกาลสกอตแลนด์เช่นเดียวกับกลองยาวในเทศกาลไทย',
        },
      },
      {
        id: 'stone_toss',
        label: {
          en: 'Bagpipes · Heavy stone weight lifted during athletics',
          th: 'ปี่สกอต · หินน้ำหนักมากสำหรับยกแข่งขันกีฬา',
        },
        explanation: {
          en: 'Listen to the rhythmic drum taps—that is the Bodhrán frame drum supporting the stage musicians!',
          th: 'ฟังเสียงตีเป็นจังหวะอีกครั้งนะ—นี่คือกลองบอดรานสำหรับคุมจังหวะให้นักดนตรีบนเวที!',
        },
      },
    ],
  },
];

export const FESTIVAL_THAI_COMPARISON_CHECK = {
  prompt: {
    en: 'Festival Connection: How do summer Highland Games compare with Thai festivals like Songkran or Bun Bang Fai?',
    th: 'เชื่อมโยงเทศกาล: ไฮแลนด์เกมส์เปรียบเทียบกับเทศกาลไทยอย่างสงกรานต์หรือบุญบั้งไฟได้อย่างไร?',
  },
  options: [
    {
      id: 'same_song',
      label: {
        en: 'They happen in the same climate and use identical instruments.',
        th: 'จัดขึ้นในสภาพอากาศเดียวกันและใช้เครื่องดนตรีชนิดเดียวกันทุกชิ้น',
      },
      isCorrect: false,
      feedback: {
        en: 'Check carefully: Scotland has cool summers with bagpipes & fiddles, whereas Thailand celebrates in tropical warmth with long drums or khaen.',
        th: 'สังเกตความต่างนะ: สกอตแลนด์อากาศเย็นกว่าและใช้ปี่สกอตกับฟิดเดิล ส่วนไทยอากาศร้อนและใช้กลองยาวหรือแคน',
      },
    },
    {
      id: 'shared_spirit_diff_style',
      label: {
        en: 'Both unite neighbors outdoors with music & pride, while differing in climate, season, and traditional instruments.',
        th: 'ทั้งสองวัฒนธรรมรวมผู้คนกลางแจ้งด้วยดนตรีและความภาคภูมิใจเหมือนกัน แต่ต่างกันที่ภูมิอากาศ ฤดูกาล และเครื่องดนตรี',
      },
      isCorrect: true,
      feedback: {
        en: 'Spot on! You recognized both the shared community joy and the authentic cultural differences.',
        th: 'เยี่ยมมาก! คุณแยกแยะทั้งความสุขร่วมของชุมชนและความต่างทางวัฒนธรรมได้อย่างแม่นยำ',
      },
    },
  ],
};

export const COMPARISON_COMPASS_TOKENS: ComparisonCompassToken[] = [
  {
    id: 'compass_wool_tartan',
    label: { en: 'Wool tartans woven for cool glens', th: 'ผ้าทาร์ทันขนสัตว์สำหรับหุบเขาอากาศหนาว' },
    stationRef: { en: 'From Station 2 · Workshop', th: 'จากด่าน 2 · เวิร์กชอป' },
    a2Clue: {
      en: 'Warm checked wool suits chilly northern winds.',
      th: 'ผ้าขนสัตว์ลายตารางช่วยกันลมหนาวทางเหนือ',
    },
    b1Clue: {
      en: 'Regional cloth tailored specifically for Scotland’s cooler climate.',
      th: 'ผ้าทอท้องถิ่นที่พัฒนาให้เหมาะกับอากาศเย็นของสกอตแลนด์',
    },
    hint: { en: 'Think which country weaves thick wool tartans.', th: 'คิดดูว่าประเทศใดทอผ้าทาร์ทันขนสัตว์หนา' },
    correctZone: 'scotland',
    zoneFeedback: {
      scotland: {
        en: 'Correct! Wool tartans belong uniquely to Scottish Highland heritage.',
        th: 'ถูกต้อง! ผ้าทาร์ทันขนสัตว์เป็นเอกลักษณ์ของวัฒนธรรมสกอตแลนด์',
      },
      both: {
        en: 'Careful—both countries treasure handwoven textiles, yet heavy wool tartan specifically comes from Scotland (Thailand weaves light silk like Praewa!).',
        th: 'ระวังนะ—แม้ทั้งสองชาติจะมีผ้าทอมรดก แต่ผ้าทาร์ทันขนสัตว์หนาเป็นเอกลักษณ์เฉพาะสกอตแลนด์ (ไทยทอผ้าไหมโปร่งอย่างแพรวา)',
      },
      thailand: {
        en: 'Not Thailand—Thailand’s tropical weather favors light woven silk and cotton rather than heavy Highland wool tartans.',
        th: 'ไม่ใช่ไทยนะ—อากาศร้อนชื้นของไทยเหมาะกับผ้าไหมและผ้าฝ้ายโปร่ง มากกว่าผ้าขนสัตว์หนา',
      },
    },
  },
  {
    id: 'compass_stone_castle_loch',
    label: { en: 'Stone castles beside mountain lochs', th: 'ปราสาทหินเคียงข้างทะเลสาบภูเขา (Loch)' },
    stationRef: { en: 'From Station 5 · Viewpoint', th: 'จากด่าน 5 · จุดชมวิว' },
    a2Clue: {
      en: 'Notice the Scots word "loch" and rugged gray granite keeps.',
      th: 'สังเกตคำว่า “Loch” และป้อมปราสาทหินแกรนิตสีเทา',
    },
    b1Clue: {
      en: 'While both countries preserve heritage sites, mountain lochs and granite keeps are specific to Scotland.',
      th: 'แม้ทั้งสองประเทศต่างอนุรักษ์โบราณสถาน แต่ทะเลสาบกลางหุบเขาล็อกและปราสาทหินเป็นลักษณะเฉพาะของสกอตแลนด์',
    },
    hint: { en: '"Loch" is a Scottish word!', th: 'คำว่า “Loch” เป็นคำภาษาสกอต!' },
    correctZone: 'scotland',
    zoneFeedback: {
      scotland: {
        en: 'Spot on! Mountain lochs and stone castles are signature Scottish landscapes.',
        th: 'แม่นยำ! ทะเลสาบล็อกและปราสาทหินเป็นภูมิทัศน์สำคัญของสกอตแลนด์',
      },
      both: {
        en: 'Preserving historic sites is shared, yes, but granite castles beside mountain lochs specifically describe Scotland.',
        th: 'การอนุรักษ์โบราณสถานมีร่วมกันจริง แต่ปราสาทหินริมทะเลสาบล็อกเป็นลักษณะเฉพาะของสกอตแลนด์',
      },
      thailand: {
        en: 'Thailand preserves gilded temples and brick river cities—mountain lochs belong to Scotland.',
        th: 'ไทยอนุรักษ์วัดหลังคาสีทองและเมืองอิฐริมน้ำ ส่วนทะเลสาบล็อกอยู่คู่สกอตแลนด์',
      },
    },
  },
  {
    id: 'compass_ceremonial_dress_shared',
    label: { en: 'Traditional dress worn proudly for festivals & ceremonies', th: 'การสวมชุดประจำชาติอย่างภาคภูมิใจในงานเทศกาลและพิธีสำคัญ' },
    stationRef: { en: 'From Station 2 · Cultural Insight', th: 'จากด่าน 2 · ข้อค้นพบวัฒนธรรม' },
    a2Clue: {
      en: 'People in Scotland wear kilts at weddings; people in Thailand wear Thai silk at ceremonies.',
      th: 'ชาวสกอตสวมคิลต์ในงานแต่ง ส่วนชาวไทยสวมชุดผ้าไหมไทยในงานพิธี',
    },
    b1Clue: {
      en: 'A broad shared value: reserving handcrafted heritage dress to honor special occasions.',
      th: 'คุณค่าร่วมที่พบในทั้งสองวัฒนธรรม: การสวมเครื่องแต่งกายมรดกเพื่อเป็นเกียรติแก่โอกาสสำคัญ',
    },
    hint: { en: 'Do BOTH Scotland and Thailand treasure special-occasion traditional dress?', th: 'ทั้งสกอตแลนด์และไทยต่างให้ความสำคัญกับชุดประเพณีในวันสำคัญใช่ไหม?' },
    correctZone: 'both',
    zoneFeedback: {
      scotland: {
        en: 'Hold on! Think fairly: Thailand also proudly wears traditional silk outfits at weddings and festivals—try placing this shared value in BOTH!',
        th: 'ช้าก่อน! ลองคิดอย่างยุติธรรม: ประเทศไทยก็สวมชุดไทยผ้าไหมอย่างภาคภูมิใจในงานแต่งและเทศกาลเช่นกัน—ลองวางในช่อง BOTH นะ!',
      },
      both: {
        en: 'Thoughtful match! Both Scotland and Thailand honor traditional handcrafted dress during joyful milestones.',
        th: 'จับคู่ได้อย่างลึกซึ้ง! ทั้งสกอตแลนด์และไทยต่างให้เกียรติเครื่องแต่งกายพื้นเมืองในโอกาสสำคัญ',
      },
      thailand: {
        en: 'Remember Station 2! Scots also wear tartan kilts with pride at weddings and festivals—this belongs in BOTH!',
        th: 'นึกถึงด่าน 2 นะ! ชาวสกอตก็สวมคิลต์ผ้าทาร์ทันด้วยความภาคภูมิใจในงานแต่งและเทศกาล—ข้อนี้จึงอยู่ช่อง BOTH!',
      },
    },
  },
  {
    id: 'compass_markets_music_shared',
    label: { en: 'Communities gathering at local food markets & music festivals', th: 'ชุมชนรวมตัวกันที่ตลาดอาหารท้องถิ่นและเทศกาลดนตรี' },
    stationRef: { en: 'From Stations 3 & 4 · Community Life', th: 'จากด่าน 3 และ 4 · วิถีชุมชน' },
    a2Clue: {
      en: 'Neighbors meet around fresh stalls and joyful music in Highland towns AND Thai towns.',
      th: 'เพื่อนบ้านมาพบกันที่แผงอาหารสดและงานดนตรีทั้งในเมืองไฮแลนด์และเมืองไทย',
    },
    b1Clue: {
      en: 'Sharing food, music, and neighborly hospitality is a human connection shared across both cultures.',
      th: 'การแบ่งปันอาหาร เสียงดนตรี และไมตรีจิตเป็นสายใยที่พบได้ในทั้งสองวัฒนธรรม',
    },
    hint: { en: 'Does only one country have local markets and community music, or BOTH?', th: 'มีแค่ประเทศเดียวที่มีตลาดอาหารและดนตรีชุมชน หรือมีทั้งสองประเทศ?' },
    correctZone: 'both',
    zoneFeedback: {
      scotland: {
        en: 'Careful! Think globally: Thailand is equally famous for lively food markets and joyful music festivals—put shared traditions in BOTH!',
        th: 'ระวังมุมมองด้านเดียวนะ! ไทยก็มีตลาดอาหารที่มีชีวิตชีวาและเทศกาลดนตรีที่อบอุ่นเช่นกัน—สิ่งที่มีร่วมกันให้วางที่ BOTH!',
      },
      both: {
        en: 'Exactly right! Markets and festive music bring communities together in both Scotland and Thailand.',
        th: 'ถูกต้องที่สุด! ตลาดท้องถิ่นและดนตรีเทศกาลเชื่อมผู้คนเข้าด้วยกันทั้งในสกอตแลนด์และไทย',
      },
      thailand: {
        en: 'Think about the Highland Food Market & Highland Games you just visited—Scotland shares this tradition too! Try BOTH.',
        th: 'นึกถึงตลาดอาหารไฮแลนด์และลานไฮแลนด์เกมส์ที่เราเพิ่งสำรวจสิ—สกอตแลนด์ก็มีเช่นกัน! ลองเลือก BOTH นะ',
      },
    },
  },
  {
    id: 'compass_gilded_temples',
    label: { en: 'Gilded tropical temples beside warm rivers', th: 'วัดหลังคาสีทองเขตร้อนริมแม่น้ำอบอุ่น' },
    stationRef: { en: 'Thailand Heritage Contrast', th: 'มรดกทางวัฒนธรรมของไทย' },
    a2Clue: {
      en: 'Shining gold spires and open airy pavilions built for sunny tropical weather.',
      th: 'ช่อฟ้าใบระกาสีทองและศาลาโปร่งรับลมร้อน',
    },
    b1Clue: {
      en: 'Contrasts with Scotland’s cool gray stone castles beside mountain lochs.',
      th: 'ตัดกันอย่างชัดเจนกับปราสาทหินสีเทาริมทะเลสาบอากาศเย็นของสกอตแลนด์',
    },
    hint: { en: 'Where do tropical gilded temples along warm rivers belong?', th: 'วัดสีทองริมแม่น้ำในภูมิอากาศเขตร้อนเป็นเอกลักษณ์ของประเทศใด?' },
    correctZone: 'thailand',
    zoneFeedback: {
      scotland: {
        en: 'Think about climate and heritage: tropical gilded temples are signature landmarks of Thailand, not Scotland.',
        th: 'ลองดูภูมิอากาศและสถาปัตยกรรมนะ: วัดสีทองเขตร้อนเป็นเอกลักษณ์ของประเทศไทย ไม่ใช่สกอตแลนด์',
      },
      both: {
        en: 'Both countries preserve sacred or historic landmarks, but tropical gilded temples beside warm rivers specifically belong to Thailand.',
        th: 'แม้ทั้งสองชาติจะอนุรักษ์โบราณสถาน แต่วัดสีทองเขตร้อนริมแม่น้ำเป็นลักษณะเฉพาะของไทย',
      },
      thailand: {
        en: 'Correct! Gilded tropical temples are iconic heritage landmarks in Thailand.',
        th: 'ถูกต้อง! วัดสีทองเขตร้อนเป็นมรดกสถาปัตยกรรมอันโดดเด่นของประเทศไทย',
      },
    },
  },
  {
    id: 'compass_praewa_herbs',
    label: { en: 'Praewa silk weaving & jasmine rice with fresh herbs', th: 'ผ้าไหมแพรวาและข้าวหอมมะลิคู่สมุนไพรสด' },
    stationRef: { en: 'Thailand Craft & Pantry', th: 'งานฝีมือและครัวไทย' },
    a2Clue: {
      en: 'Light breathable silk from Kalasin and fragrant tropical dishes.',
      th: 'ผ้าไหมทอเบาสบายจากกาฬสินธุ์และอาหารสมุนไพรหอมกรุ่น',
    },
    b1Clue: {
      en: 'While serving roles similar to tartan and oats in Scotland, Praewa silk and jasmine rice are uniquely Thai.',
      th: 'แม้จะมีบทบาทคล้ายผ้าทาร์ทันและข้าวโอ๊ตของสกอตแลนด์ แต่ผ้าไหมแพรวาและข้าวหอมมะลิเป็นเอกลักษณ์ไทย',
    },
    hint: { en: 'Kalasin Praewa silk and jasmine rice belong to...', th: 'ผ้าไหมแพรวากาฬสินธุ์และข้าวหอมมะลิเป็นของ...' },
    correctZone: 'thailand',
    zoneFeedback: {
      scotland: {
        en: 'Those are from warm tropical Thailand! Scotland has wool tartan and oats instead.',
        th: 'สิ่งเหล่านั้นมาจากประเทศไทยเขตร้อน! สกอตแลนด์เด่นเรื่องผ้าทาร์ทันขนสัตว์และข้าวโอ๊ต',
      },
      both: {
        en: 'Remember our contrast check: weaving and staple grains exist in BOTH, whereas Praewa silk & jasmine rice specifically belong to Thailand.',
        th: 'จำข้อสังเกตของเราได้ไหม: การทอผ้าและธัญพืชหลักมีในทั้งสองประเทศ แต่ “ผ้าไหมแพรวาและข้าวหอมมะลิ” เป็นเอกลักษณ์เฉพาะไทย',
      },
      thailand: {
        en: 'Spot on! Praewa silk and fragrant jasmine rice with herbs are celebrated treasures of Thailand.',
        th: 'ถูกต้อง! ผ้าไหมแพรวาและข้าวหอมมะลิคู่สมุนไพรคือความภาคภูมิใจของไทย',
      },
    },
  },
];

export const COMPARISON_BRIDGE_SAMPLES: {
  phrase: string;
  a2Example: LocalizedText;
  b1Example: LocalizedText;
}[] = [
  {
    phrase: 'both ... and ...',
    a2Example: {
      en: 'Both Scotland and Thailand have friendly local food markets.',
      th: 'ทั้งสกอตแลนด์และไทยต่างมีตลาดอาหารท้องถิ่นที่อบอุ่น',
    },
    b1Example: {
      en: 'Both Scotland and Thailand preserve historic landmarks to teach younger generations.',
      th: 'ทั้งสกอตแลนด์และไทยต่างอนุรักษ์โบราณสถานเพื่อให้คนรุ่นหลังได้เรียนรู้',
    },
  },
  {
    phrase: 'similar to',
    a2Example: {
      en: 'A Scottish village square is similar to a Thai town plaza.',
      th: 'จัตุรัสหมู่บ้านสกอตแลนด์คล้ายกับลานชุมชนในเมืองไทย',
    },
    b1Example: {
      en: 'Scottish tartan weaving is similar to Kalasin Praewa silk in celebrating regional identity.',
      th: 'การทอผ้าทาร์ทันของสกอตแลนด์คล้ายผ้าไหมแพรวากาฬสินธุ์ตรงที่สะท้อนอัตลักษณ์ท้องถิ่น',
    },
  },
  {
    phrase: 'different from',
    a2Example: {
      en: 'Warm oatcakes are different from spicy Thai rice dishes.',
      th: 'โอ๊ตเค้กอบอุ่นแตกต่างจากอาหารข้าวรสจัดจ้านของไทย',
    },
    b1Example: {
      en: 'Cool granite castles beside lochs are different from gilded temples along tropical rivers.',
      th: 'ปราสาทหินริมทะเลสาบอากาศเย็นแตกต่างจากวัดสีทองริมแม่น้ำเขตร้อน',
    },
  },
  {
    phrase: 'while / whereas / unlike',
    a2Example: {
      en: 'Scotland grows oats in cool weather, while Thailand grows jasmine rice.',
      th: 'สกอตแลนด์ปลูกข้าวโอ๊ตในอากาศเย็น ขณะที่ไทยปลูกข้าวหอมมะลิ',
    },
    b1Example: {
      en: 'Unlike heavy wool kilts suited to brisk breezes, Thai Praewa silk stays airy in tropical heat.',
      th: 'ต่างจากคิลต์ขนสัตว์หนาสำหรับลมหนาว ผ้าไหมแพรวาของไทยโปร่งสบายในอากาศร้อน',
    },
  },
];

export const EILIDH_DISCOVER_DIALOGUE = {
  beforeStart: {
    en: "Our cultural exchange exhibition needs your help! Let's discover Scottish traditions and find connections with Thailand.",
    th: 'นิทรรศการแลกเปลี่ยนวัฒนธรรมของเราต้องการความช่วยเหลือจากคุณ! มาช่วยกันค้นพบประเพณีสกอตแลนด์และเชื่อมโยงกับประเทศไทยกันเถอะ',
  },
  beforeStartTip: {
    en: "Press 'Start Scottish Culture Quest' below, then visit all 5 village stations—from our Village Square out to the Lochside Viewpoint—to collect 5 cultural evidence cards in your Explorer Journal!",
    th: 'กด “เริ่มภารกิจค้นหาวัฒนธรรมสกอตแลนด์” ด้านล่าง แล้วแวะครบทั้ง 5 จุด—ตั้งแต่จัตุรัสหมู่บ้านไปจนถึงจุดชมวิวทะเลสาบ—เพื่อรวบรวมการ์ดหลักฐานทั้ง 5 ใบลงสมุดบันทึก!',
  },
  inProgress: (doneCount: number, totalCount: number): LocalizedText => ({
    en: `Brilliant start! You have collected ${doneCount} of ${totalCount} Cultural Evidence cards for our Scotland–Thailand exhibition. Keep exploring the remaining stations—or open your Explorer Journal anytime to compare notes!`,
    th: `เริ่มต้นได้เยี่ยมเลย! ตอนนี้คุณเก็บการ์ดหลักฐานวัฒนธรรมได้ ${doneCount} จาก ${totalCount} ชิ้นแล้ว เดินสำรวจจุดที่เหลือต่อหรือเปิดดูสมุดบันทึกนักสำรวจได้ตลอดเวลานะ!`,
  }),
  completed: {
    en: 'Amazing work! All 5 Cultural Evidence cards are saved in our exhibition journal (+50 XP earned)! Next up is Stage 2: BUILD, where you will craft clear comparison sentences in English. Your Scotland Passport Stamp unlocks after completing all 4 Highland stages!',
    th: 'สุดยอดมาก! การ์ดหลักฐานทั้ง 5 ชิ้นถูกบันทึกในสมุดนิทรรศการเรียบร้อยแล้ว (รับ +50 XP)! ก้าวต่อไปคือด่านที่ 2: BUILD สำหรับฝึกสร้างประโยคเปรียบเทียบภาษาอังกฤษ ส่วนตราประทับสกอตแลนด์จะได้รับเมื่อพิชิตครบทั้ง 4 ด่านนะ!',
  },
};

export const FIONA_DISCOVER_DIALOGUE = {
  beforeStart: {
    en: "Welcome to the Highlands! Talk to Eilidh first so she can open your Cultural Exchange Exhibition checklist—then I'll share fact-checking tips at every village spot!",
    th: 'ยินดีต้อนรับสู่ไฮแลนด์! ลองไปคุยกับไอลีดก่อนเพื่อเปิดภารกิจนิทรรศการแลกเปลี่ยนวัฒนธรรม แล้วฉันจะช่วยแนะนำวิธีสังเกตข้อเท็จจริงทางวัฒนธรรมให้!',
  },
  factChecker: {
    en: "Heritage Detective Rule #1: Don't assume old stone walls mean old-fashioned lives, or that Scots wear kilts to buy milk! Look for real evidence separating modern everyday routines from special traditions.",
    th: 'กฎนักสืบวัฒนธรรมข้อที่ 1: อย่าเหมารวมว่าบ้านหินเก่าแปลว่าใช้ชีวิตแบบโบราณ หรือคนสกอตใส่คิลต์ไปซื้อของทุกวัน! ให้สังเกตหลักฐานจริงเพื่อแยกชีวิตประจำวันสมัยใหม่ออกจากประเพณีพิเศษ',
  },
  thaiBridgeNote: {
    en: 'Look for smart similarities AND honest differences with Thailand: climate shapes food and fabric, while community markets, music, and heritage pride connect us both!',
    th: 'มองหาทั้ง “ความเหมือนที่น่ารัก” และ “ความต่างที่จริงใจ” กับไทย: ภูมิอากาศหล่อหลอมอาหารและผ้าทอ ส่วนตลาดชุมชน ดนตรี และความภูมิใจในมรดกล้วนเชื่อมโยงเราเข้าด้วยกัน!',
  },
};

export function getScotlandEvidenceById(id: ScotlandLandmarkId): ScotlandEvidenceItem {
  return (
    SCOTLAND_EVIDENCE_ITEMS.find((item) => item.id === id) ?? SCOTLAND_EVIDENCE_ITEMS[0]
  );
}
