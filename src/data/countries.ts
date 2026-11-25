import type { CountryWorld, LanguageFunction } from '../types/game';

export const LANGUAGE_FUNCTION_META: Record<
  LanguageFunction,
  {
    code: string;
    label: { en: string; th: string };
    description: { en: string; th: string };
  }
> = {
  TO_DESCRIBE: {
    code: 'TO DESCRIBE',
    label: { en: 'To Describe', th: 'การบรรยายลักษณะ' },
    description: {
      en: 'Describe places, architecture, textures, colors, and cultural details clearly.',
      th: 'บรรยายสถานที่ สถาปัตยกรรม วัตถุ สีสัน และรายละเอียดทางวัฒนธรรมอย่างชัดเจน',
    },
  },
  TO_INFORM: {
    code: 'TO INFORM',
    label: { en: 'To Inform', th: 'การให้ข้อมูล' },
    description: {
      en: 'Share accurate facts, habitats, and environmental observations with an audience.',
      th: 'ถ่ายทอดข้อเท็จจริงเกี่ยวกับสัตว์ป่า ถิ่นที่อยู่ และสถานการณ์สิ่งแวดล้อมอย่างถูกต้อง',
    },
  },
  TO_PERSUADE: {
    code: 'TO PERSUADE',
    label: { en: 'To Persuade', th: 'การโน้มน้าวใจ' },
    description: {
      en: 'Use reasons and call-to-action expressions to encourage positive choices.',
      th: 'ให้เหตุผลและใช้สำนวนเชิญชวนเพื่อโน้มน้าวให้ผู้ฟังร่วมอนุรักษ์และลงมือทำ',
    },
  },
  TO_COMPARE_AND_CONTRAST: {
    code: 'TO COMPARE & CONTRAST',
    label: { en: 'To Compare & Contrast', th: 'การเปรียบเทียบความเหมือนและความต่าง' },
    description: {
      en: 'Highlight similarities and differences across food, traditions, and daily life.',
      th: 'เปรียบเทียบความเหมือนและความแตกต่างด้านอาหาร ประเพณี และวิถีชีวิต',
    },
  },
  TO_INTERACT: {
    code: 'TO INTERACT',
    label: { en: 'To Interact', th: 'การสื่อสารโต้ตอบ' },
    description: {
      en: 'Initiate, maintain, and politely conclude everyday service and travel conversations.',
      th: 'เริ่มต้น สานต่อ และปิดบทสนทนาในสถานการณ์จริงในเมืองอย่างสุภาพและเป็นธรรมชาติ',
    },
  },
  TO_GIVE_INSTRUCTIONS: {
    code: 'TO GIVE INSTRUCTIONS',
    label: { en: 'To Give Instructions', th: 'การบอกขั้นตอนและคำแนะนำ' },
    description: {
      en: 'Sequence clear directions and step-by-step procedures to guide teammates safely.',
      th: 'บอกทิศทางและอธิบายขั้นตอนการปฏิบัติงานเป็นลำดับเพื่อนำทางเพื่อนร่วมทีม',
    },
  },
};

export const COUNTRY_WORLDS: CountryWorld[] = [
  {
    id: 'india',
    order: 1,
    code: 'IND',
    countryName: { en: 'India', th: 'อินเดีย' },
    title: { en: 'Tales of Jaipur', th: 'เรื่องเล่าแห่งชัยปุระ' },
    cityOrRegion: { en: 'Jaipur, Rajasthan', th: 'ชัยปุระ รัฐราชสถาน' },
    languageFunctions: ['TO_DESCRIBE'],
    cefrBand: 'A2',
    scenarioSummary: {
      en: 'Visit Jaipur, the Pink City of India, alongside a local heritage guide. Observe sandstone palaces, bustling craft bazaars, and historical courtyards.',
      th: 'เดินทางเยือนชัยปุระ นครสีชมพูแห่งอินเดีย พร้อมมัคคุเทศก์ท้องถิ่น สำรวจพระราชวังหินทราย ตลาดหัตถกรรม และลานประวัติศาสตร์',
    },
    communicationGoal: {
      en: 'Describe places, architectural features, cultural objects, and vivid visual details.',
      th: 'บรรยายสถานที่ ลักษณะสถาปัตยกรรม สิ่งของทางวัฒนธรรม และรายละเอียดที่มองเห็นได้',
    },
    finalSpeakingTask: {
      en: 'Introduce one memorable Jaipur landmark to fellow international travelers.',
      th: 'แนะนำสถานที่สำคัญแห่งหนึ่งในเมืองชัยปุระให้นักเดินทางจากนานาชาติฟังเป็นภาษาอังกฤษ',
    },
    culturalHighlight: {
      en: 'Terracotta-pink sandstone facades, symmetrical jharokha windows, and traditional block-printed textiles.',
      th: 'สถาปัตยกรรมหินทรายสีชมพูดินเผา หน้าต่างจาโรคาอันประณีต และผ้าพิมพ์ลายบล็อกไม้ดั้งเดิม',
    },
    stampTitle: { en: 'Pink City Chronicler', th: 'นักบันทึกนครสีชมพู' },
    coordinates: { lat: 26.9124, lng: 75.7873 },
    themeColors: {
      primary: '#D97B66',
      accent: '#F2C66D',
      sky: '#24B8B0',
    },
    dioramaImageUrl: '/src/assets/images/india_day_jaipur_1795070996084.jpg',
    npc: {
      id: 'npc_aarav_jaipur',
      name: 'Aarav Sharma',
      role: { en: 'Jaipur Heritage Guide', th: 'มัคคุเทศก์มรดกวัฒนธรรมชัยปุระ' },
      countryId: 'india',
      voiceProfile: {
        id: 'voice_indian_en_guide',
        accentLabel: { en: 'Clear Indian English Model', th: 'สำเนียงภาษาอังกฤษอินเดียชัดเจน' },
        recommendedRate: 0.95,
        recommendedPitch: 1.0,
        prerecordedAvailable: false,
        ttsFallbackReady: true,
      },
      supportedStates: ['idle', 'greeting', 'listening', 'talking', 'happy', 'celebrating'],
      greetingPreview: {
        en: 'Namaste, Explorer! Notice how the sandstone glows coral-pink in the afternoon sun.',
        th: 'นมัสเต นักสำรวจ! ลองสังเกตดูสิว่าหินทรายสะท้อนแสงยามบ่ายเป็นสีชมพูอมส้มงดงามเพียงใด',
      },
    },
    missionId: 'mission_india_jaipur',
    targetPhase: 'phase_3',
  },
  {
    id: 'kenya',
    order: 2,
    code: 'KEN',
    countryName: { en: 'Kenya', th: 'เคนยา' },
    title: { en: 'WildSpeak Safari', th: 'ซาฟารีพิทักษ์สัตว์ป่า' },
    cityOrRegion: { en: 'Maasai Mara National Reserve', th: 'เขตรักษาพันธุ์สัตว์ป่ามาไซมารา' },
    languageFunctions: ['TO_INFORM', 'TO_PERSUADE'],
    cefrBand: 'A2+',
    scenarioSummary: {
      en: 'Step into the role of a junior safari guide in Maasai Mara. Help visitors understand savanna ecosystems and conservation challenges.',
      th: 'สวมบทบาทผู้ช่วยไกด์ซาฟารี ณ มาไซมารา ถ่ายทอดความรู้เรื่องระบบนิเวศทุ่งหญ้าสะวันนาและความท้าทายด้านการอนุรักษ์',
    },
    communicationGoal: {
      en: 'Inform visitors about wildlife facts and persuade them to support responsible conservation.',
      th: 'ให้ข้อมูลข้อเท็จจริงเกี่ยวกับสัตว์ป่าและโน้มน้าวให้นักท่องเที่ยวร่วมดูแลธรรมชาติอย่างยั่งยืน',
    },
    finalSpeakingTask: {
      en: 'Deliver a concise wildlife conservation pitch to visiting eco-tourists.',
      th: 'กล่าวคำเชิญชวนและนำเสนอแนวทางอนุรักษ์สัตว์ป่าต่อกลุ่มนักท่องเที่ยวเชิงนิเวศ',
    },
    culturalHighlight: {
      en: 'Community-led wildlife stewardship across the acacia plains and seasonal Great Migration corridors.',
      th: 'การดูแลสัตว์ป่าโดยชุมชนท้องถิ่นท่ามกลางทุ่งต้นอะคาเซียและเส้นทางอพยพตามฤดูกาล',
    },
    stampTitle: { en: 'Savanna Voice Guardian', th: 'ผู้พิทักษ์เสียงแห่งสะวันนา' },
    coordinates: { lat: -1.4061, lng: 35.1432 },
    themeColors: {
      primary: '#E09A48',
      accent: '#FF9478',
      sky: '#2B5B6C',
    },
    dioramaImageUrl: '/src/assets/images/kenya_day_safari_1795070977300.jpg',
    npc: {
      id: 'npc_amina_kenya',
      name: 'Amina Odhiambo',
      role: { en: 'Lead Conservation Ranger', th: 'เจ้าหน้าที่พิทักษ์ป่าอาวุโส' },
      countryId: 'kenya',
      voiceProfile: {
        id: 'voice_kenyan_en_ranger',
        accentLabel: { en: 'Clear East African English Model', th: 'สำเนียงภาษาอังกฤษแอฟริกาตะวันออกชัดเจน' },
        recommendedRate: 0.95,
        recommendedPitch: 1.02,
        prerecordedAvailable: false,
        ttsFallbackReady: true,
      },
      supportedStates: ['idle', 'greeting', 'listening', 'talking', 'thinking', 'celebrating'],
      greetingPreview: {
        en: 'Jambo! Every species here keeps the savanna balanced—let us share why their habitat matters.',
        th: 'จัมโบ้! สัตว์ทุกชนิดช่วยรักษาสมดุลของทุ่งสะวันนา มาช่วยกันบอกเล่าความสำคัญของถิ่นอาศัยกันเถอะ',
      },
    },
    missionId: 'mission_kenya_safari',
    targetPhase: 'phase_5',
  },
  {
    id: 'scotland',
    order: 3,
    code: 'SCO',
    countryName: { en: 'Scotland', th: 'สกอตแลนด์' },
    title: { en: 'Highland Heroes', th: 'วีรชนแห่งไฮแลนด์' },
    cityOrRegion: { en: 'Scottish Highlands & Edinburgh', th: 'ไฮแลนด์และเอดินบะระ' },
    languageFunctions: ['TO_COMPARE_AND_CONTRAST'],
    cefrBand: 'B1',
    scenarioSummary: {
      en: 'Experience life as a Thai exchange student in Scotland, discovering Highland gatherings, local dishes, tartan heritage, and seasonal festivals.',
      th: 'สัมผัสชีวิตนักเรียนแลกเปลี่ยนชาวไทยในสกอตแลนด์ เรียนรู้วัฒนธรรมไฮแลนด์ อาหารท้องถิ่น ผ้าทาร์ทัน และเทศกาลประจำฤดูกาล',
    },
    communicationGoal: {
      en: 'Compare and contrast Scottish and Thai food, clothing, traditions, festivals, and lifestyles.',
      th: 'เปรียบเทียบความเหมือนและความต่างระหว่างวัฒนธรรมสกอตแลนด์และไทยทั้งอาหาร การแต่งกาย และประเพณี',
    },
    finalSpeakingTask: {
      en: 'Present thoughtful similarities and differences between Scotland and Thailand to your host class.',
      th: 'นำเสนอความเหมือนและความแตกต่างระหว่างสกอตแลนด์และประเทศไทยให้เพื่อนร่วมชั้นเรียนฟัง',
    },
    culturalHighlight: {
      en: 'Stone arch bridges across misted lochs, traditional ceilidh music, and warm hospitality shared between cultures.',
      th: 'สะพานหินโค้งข้ามทะเลสาบกลางสายหมอก ดนตรีพื้นบ้านเคอิลี และการแลกเปลี่ยนไมตรีจิตข้ามวัฒนธรรม',
    },
    stampTitle: { en: 'Highland Cultural Bridge', th: 'สะพานวัฒนธรรมไฮแลนด์' },
    coordinates: { lat: 57.1497, lng: -4.2247 },
    themeColors: {
      primary: '#3A7D6C',
      accent: '#F2C66D',
      sky: '#4D6A8A',
    },
    dioramaImageUrl: '/src/assets/images/scotland_day_highlands_1795070978084.jpg',
    npc: {
      id: 'npc_eilidh_scotland',
      name: 'Eilidh MacLeod',
      role: { en: 'Scottish Student & Exchange Buddy', th: 'นักเรียนเจ้าภาพชาวสกอตแลนด์' },
      countryId: 'scotland',
      voiceProfile: {
        id: 'voice_scottish_en_buddy',
        accentLabel: { en: 'Accessible Scottish English Model', th: 'สำเนียงภาษาอังกฤษสกอตแลนด์ที่เข้าใจง่าย' },
        recommendedRate: 0.93,
        recommendedPitch: 1.04,
        prerecordedAvailable: false,
        ttsFallbackReady: true,
      },
      supportedStates: ['idle', 'greeting', 'listening', 'talking', 'happy', 'thinking'],
      greetingPreview: {
        en: "Welcome to Scotland! I'm Eilidh. I'll show you some of our traditions. I'd love to learn about Thailand too!",
        th: 'ยินดีต้อนรับสู่สกอตแลนด์! ฉันชื่อไอลีด เดี๋ยวฉันจะพาชมประเพณีของพวกเรานะ และฉันก็อยากเรียนรู้เรื่องของประเทศไทยด้วย!',
      },
    },
    missionId: 'mission_scotland_highlands',
    targetPhase: 'phase_5',
  },
  {
    id: 'australia',
    order: 4,
    code: 'AUS',
    countryName: { en: 'Australia', th: 'ออสเตรเลีย' },
    title: { en: 'CityTalk Quest', th: 'ภารกิจสนทนาในซิดนีย์' },
    cityOrRegion: { en: 'Sydney Harbour, New South Wales', th: 'อ่าวซิดนีย์ รัฐนิวเซาท์เวลส์' },
    languageFunctions: ['TO_INTERACT'],
    cefrBand: 'A2+',
    scenarioSummary: {
      en: 'Navigate lively Sydney ferry terminals, harbor cafes, and museum ticket desks by speaking naturally with local residents and staff.',
      th: 'เดินทางสำรวจท่าเรือซิดนีย์ คาเฟ่ริมอ่าว และจุดจำหน่ายตั๋วพิพิธภัณฑ์ ผ่านการสนทนาโต้ตอบกับชาวเมืองอย่างคล่องแคล่ว',
    },
    communicationGoal: {
      en: 'Ask for directions, order food, buy ferry tickets, request help, and sustain polite everyday interactions.',
      th: 'ถามทาง สั่งอาหาร ซื้อตั๋วเรือ ขอความช่วยเหลือ และสานต่อบทสนทนาในชีวิตประจำวันได้อย่างมั่นใจ',
    },
    finalSpeakingTask: {
      en: 'Complete a multi-turn interactive city conversation across harbor stops.',
      th: 'สนทนาโต้ตอบหลายจังหวะในสถานการณ์จำลองกลางเมืองซิดนีย์ให้สำเร็จ',
    },
    culturalHighlight: {
      en: 'Iconic harbor sail architecture, coastal ferry culture, and friendly Australian conversational phrasing.',
      th: 'สถาปัตยกรรมหลังคาทรงใบเรือริมอ่าว วัฒนธรรมการเดินทางด้วยเรือเฟอร์รี่ และสำนวนสนทนาที่เป็นกันเอง',
    },
    stampTitle: { en: 'Harbour Communicator', th: 'นักสื่อสารแห่งอ่าวซิดนีย์' },
    coordinates: { lat: -33.8568, lng: 151.2153 },
    themeColors: {
      primary: '#24B8B0',
      accent: '#F2C66D',
      sky: '#56B4D3',
    },
    dioramaImageUrl: '/src/assets/images/world_australia_sydney_1795065329488.jpg',
    npc: {
      id: 'npc_maya_australia',
      name: 'Maya Chen',
      role: { en: 'Harbour Cafe & Ferry Coordinator', th: 'ผู้ประสานงานคาเฟ่และท่าเรือซิดนีย์' },
      countryId: 'australia',
      voiceProfile: {
        id: 'voice_australian_en_local',
        accentLabel: { en: 'Clear Australian English Model', th: 'สำเนียงภาษาอังกฤษออสเตรเลียชัดเจน' },
        recommendedRate: 0.96,
        recommendedPitch: 1.03,
        prerecordedAvailable: false,
        ttsFallbackReady: true,
      },
      supportedStates: ['idle', 'greeting', 'listening', 'talking', 'serving', 'happy'],
      greetingPreview: {
        en: 'G’day! Grabbing a ferry across the harbour? Let me know where you are heading today.',
        th: 'สวัสดี! กำลังจะขึ้นเรือเฟอร์รี่ข้ามอ่าวหรือเปล่า บอกจุดหมายของคุณมาได้เลยนะ',
      },
    },
    missionId: 'mission_australia_sydney',
    targetPhase: 'phase_6',
  },
  {
    id: 'egypt',
    order: 5,
    code: 'EGY',
    countryName: { en: 'Egypt', th: 'อียิปต์' },
    title: { en: 'Echoes of Egypt', th: 'เสียงสะท้อนแห่งอียิปต์' },
    cityOrRegion: {
      en: 'The Lost Secrets of the Pharaohs · Nile & Giza Plateau',
      th: 'ความลับที่สาบสูญแห่งฟาโรห์ · ลุ่มน้ำไนล์และที่ราบสูงกีซา',
    },
    languageFunctions: ['TO_GIVE_INSTRUCTIONS'],
    cefrBand: 'B1',
    scenarioSummary: {
      en: 'Join an archaeological field expedition by the Nile and Giza Plateau. Explore five interconnected sites, decode clues respectfully, and prepare clear step-by-step instructions.',
      th: 'เข้าร่วมคณะสำรวจโบราณคดีริมแม่น้ำไนล์และที่ราบสูงกีซา สำรวจสถานที่สำคัญทั้ง 5 แห่ง ถอดรหัสเบาะแสอย่างเคารพวัฒนธรรม และเตรียมให้คำแนะนำทีละขั้นตอน',
    },
    communicationGoal: {
      en: 'Give clear step-by-step instructions, sequence procedures, and guide teammates carefully.',
      th: 'ให้คำแนะนำทีละขั้นตอน เรียงลำดับวิธีการ และนำทางทีมสำรวจได้อย่างชัดเจน',
    },
    finalSpeakingTask: {
      en: 'Guide an expedition team through a multi-step archaeological challenge.',
      th: 'นำทางทีมสำรวจผ่านภารกิจโบราณคดีทีละขั้นตอนจนสำเร็จ',
    },
    culturalHighlight: {
      en: 'Egyptian limestone monuments, the Great Nile River heritage, papyrus scribal craft, and respectful preservation.',
      th: 'สถาปัตยกรรมหินปูนอียิปต์ มรดกแห่งแม่น้ำไนล์ งานจารึกปาปิรุส และการอนุรักษ์อย่างให้เกียรติวัฒนธรรม',
    },
    stampTitle: { en: 'Expedition Navigator', th: 'ผู้นำทางคณะสำรวจ' },
    coordinates: { lat: 29.9792, lng: 31.1342 },
    themeColors: {
      primary: '#E7B43C',
      accent: '#12B8B0',
      sky: '#254EAC',
    },
    dioramaImageUrl: '/src/assets/images/egypt_day_expedition_1795070978060.jpg',
    npc: {
      id: 'npc_layla',
      name: 'Dr. Layla Hassan',
      role: { en: 'Lead Archaeologist', th: 'หัวหน้าทีมโบราณคดี' },
      countryId: 'egypt',
      voiceProfile: {
        id: 'voice_egyptian_en_lead',
        accentLabel: { en: 'Clear International English Model', th: 'สำเนียงภาษาอังกฤษนานาชาติชัดเจน' },
        recommendedRate: 0.94,
        recommendedPitch: 1.02,
        prerecordedAvailable: false,
        ttsFallbackReady: true,
      },
      supportedStates: ['idle', 'greeting', 'listening', 'talking', 'thinking', 'celebrating'],
      greetingPreview: {
        en: 'Welcome to the Nile Expedition Camp! Our team found inscriptions leading toward a legendary Chamber of Wisdom.',
        th: 'ยินดีต้อนรับสู่ค่ายสำรวจริมแม่น้ำไนล์! ทีมของเราพบจารึกโบราณที่นำไปสู่โถงแห่งปัญญาในตำนาน',
      },
    },
    missionId: 'mission_egypt_expedition',
    targetPhase: 'phase_6',
  },
];

export function getCountryById(id: string): CountryWorld {
  return COUNTRY_WORLDS.find((c) => c.id === id) ?? COUNTRY_WORLDS[0];
}
