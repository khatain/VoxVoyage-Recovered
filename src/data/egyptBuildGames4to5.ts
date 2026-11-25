import type { LocalizedText } from '../types/game';
import {
  joinNormalizedTiles,
  matchesAuthoredPatterns,
  normalizeEnglishSentenceForCheck,
  type BuildTile,
  type PharaohBlueprintChallengeBundle,
  type PharaohBlueprintVariant,
  type TempleRuleArchitectChallengeBundle,
  type TempleRuleArchitectVariant,
} from './egyptBuildTypes';

function makeTiles(
  prefix: string,
  specs: Array<{
    value: string;
    role: BuildTile['role'];
    isDistractor?: boolean;
  }>,
): BuildTile[] {
  return specs.map((spec, index) => ({
    instanceId: `${prefix}_t_${index}`,
    value: spec.value,
    role: spec.role,
    isDistractor: spec.isDistractor,
  }));
}

// ============================================================================
// GAME 4 — TEMPLE RULE ARCHITECT (6 A2 + 6 B1, Situational Pragmatics)
// ============================================================================

export const TEMPLE_RULE_ARCHITECT_CHALLENGES: TempleRuleArchitectChallengeBundle[] = [
  {
    challengeId: 'tr_1_polite_request',
    order: 1,
    title: {
      en: 'Polite Courtyard Request · Guest Line',
      th: 'คำขออย่างสุภาพ · แถวผู้เข้าชม',
    },
    a2: {
      mode: 'a2',
      courtyardSceneKey: 'gentle_request',
      audienceLabel: {
        en: 'Audience: Visiting students & families',
        th: 'ผู้รับสาร: คณะนักเรียนและครอบครัวผู้มาเยือน',
      },
      situationPrompt: {
        en: 'Guests just arrived in the sunny entrance hall. Ask them politely to stay in the shaded walkway.',
        th: 'ผู้เยี่ยมชมเพิ่งมาถึงโถงทางเข้ากลางแดด เชิญชวนอย่างสุภาพให้เดินในทางเดินที่มีร่มเงา',
      },
      tiles: makeTiles('tr1_a2', [
        { value: 'Please', role: 'polite' },
        { value: 'stay', role: 'verb' },
        { value: 'inside', role: 'prep' },
        { value: 'the', role: 'connector' },
        { value: 'shaded walkway', role: 'object' },
        { value: 'Do not', role: 'negative', isDistractor: true },
        { value: 'Stand still now', role: 'phrase', isDistractor: true },
      ]),
      acceptedPatterns: [/^please\s+stay\s+inside\s+the\s+shaded\s+walkway$/i],
      canonicalModel: 'Please stay inside the shaded walkway.',
      thaiScaffold: 'กรุณาเดินอยู่ในทางเดินที่มีร่มเงา',
      inappropriateChecks: [
        {
          pattern: /^(?:do not|don't)/i,
          feedback: {
            en: 'A prohibition ("Do not...") sounds too strict here—this sign is a friendly welcome request starting with "Please".',
            th: 'การใช้ข้อห้าม ("Do not...") ดูแข็งเกินไปสำหรับป้ายต้อนรับ ลองใช้คำขอสุภาพที่ขึ้นต้นด้วย "Please"',
          },
        },
        {
          pattern: /^(?:stay|stand)/i,
          feedback: {
            en: 'Grammatically valid, yet too blunt for visiting guests! Add "Please" at the beginning to make the tone welcoming.',
            th: 'ถูกหลักไวยากรณ์แต่ห้วนเกินไปสำหรับผู้มาเยือน! เติม "Please" ด้านหน้าให้น้ำเสียงสุภาพขึ้น',
          },
        },
      ],
      hints: {
        tier1Structure: {
          en: 'Polite request pattern: [Please] + [base verb] + [place].',
          th: 'รูปแบบคำขอสุภาพ: [Please] + [กริยาช่อง 1] + [สถานที่]',
        },
        tier2Focus: {
          en: 'Start with "Please" so guests feel warmly welcomed, not barked at.',
          th: 'เริ่มด้วย "Please" เพื่อให้ผู้เยี่ยมชมรู้สึกได้รับการต้อนรับอย่างอบอุ่น',
        },
        tier3Scaffold: {
          en: 'Model frame: "Please ___ inside the ___."',
          th: 'กรอบคำตอบ: "Please ___ inside the ___."',
        },
      },
    },
    b1: {
      mode: 'b1',
      courtyardSceneKey: 'gentle_request',
      audienceLabel: {
        en: 'Audience: Visiting tour group at lotus columns',
        th: 'ผู้รับสาร: คณะทัวร์บริเวณเสาหินหัวดอกบัว',
      },
      situationPrompt: {
        en: 'Invite visitors politely to keep a respectful one-meter distance from the painted lotus columns.',
        th: 'ขอความร่วมมือผู้เยี่ยมชมอย่างสุภาพให้เว้นระยะห่าง 1 เมตรจากเสาบัวสลักสีโบราณ',
      },
      tiles: makeTiles('tr1_b1', [
        { value: 'Please', role: 'polite' },
        { value: 'keep', role: 'verb' },
        { value: 'a respectful distance', role: 'object' },
        { value: 'from the', role: 'prep' },
        { value: 'lotus columns', role: 'object' },
        { value: 'Move away immediately', role: 'phrase', isDistractor: true },
        { value: 'Do not', role: 'negative', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^please\s+keep\s+a\s+respectful\s+distance\s+from\s+the\s+lotus\s+columns$/i,
      ],
      canonicalModel: 'Please keep a respectful distance from the lotus columns.',
      thaiScaffold: 'กรุณาเว้นระยะห่างอย่างเหมาะสมจากเสาหินหัวดอกบัว',
      inappropriateChecks: [
        {
          pattern: /move away immediately/i,
          feedback: {
            en: 'Too harsh and urgent for a cultural gallery sign! Use "Please keep a respectful distance...".',
            th: 'ใช้คำแรงและเร่งรัดเกินไปสำหรับป้ายอนุรักษ์! ควรใช้ "Please keep a respectful distance..."',
          },
        },
        {
          pattern: /^keep\s+/i,
          feedback: {
            en: 'Missing polite marker! Add "Please" at the start when addressing temple visitors.',
            th: 'ขาดคำสุภาพ! เติม "Please" ที่ต้นประโยคเวลาสื่อสารกับผู้มาเยือนวิหาร',
          },
        },
      ],
      hints: {
        tier1Structure: {
          en: 'Use [Please] + [keep a respectful distance] + [from the + monument].',
          th: 'ใช้ [Please] + [keep a respectful distance] + [from the + เสาบัว]',
        },
        tier2Focus: {
          en: 'Avoid "Move away immediately"—visitors respond better to polite guidance.',
          th: 'หลีกเลี่ยง "Move away immediately" แล้วเลือกคำขอความร่วมมือที่นุ่มนวล',
        },
        tier3Scaffold: {
          en: 'Model frame: "Please keep ___ from the ___."',
          th: 'กรอบคำตอบ: "Please keep ___ from the ___."',
        },
      },
    },
  },
  {
    challengeId: 'tr_2_strong_prohibition',
    order: 2,
    title: {
      en: 'Heritage Protection · Fragile Reliefs',
      th: 'ข้อห้ามอนุรักษ์ · ภาพสลักหินเปราะบาง',
    },
    a2: {
      mode: 'a2',
      courtyardSceneKey: 'stone_warning',
      audienceLabel: {
        en: 'Audience: All explorers near carved wall',
        th: 'ผู้รับสาร: ทุกคนบริเวณกำแพงสลักโบราณ',
      },
      situationPrompt: {
        en: 'Skin oils can harm 4,000-year-old carvings. Write a firm prohibition against touching the stone carvings.',
        th: 'น้ำมันจากมืออาจทำลายหินสลักอายุ 4,000 ปี เขียนป้ายห้ามสัมผัสภาพสลักหินอย่างชัดเจน',
      },
      tiles: makeTiles('tr2_a2', [
        { value: 'Do not', role: 'negative' },
        { value: 'touch', role: 'verb' },
        { value: 'the', role: 'connector' },
        { value: 'stone carvings', role: 'object' },
        { value: 'Touch', role: 'verb', isDistractor: true },
        { value: 'You can', role: 'polite', isDistractor: true },
      ]),
      acceptedPatterns: [/^(?:do not|don't|please do not)\s+touch\s+the\s+stone\s+carvings$/i],
      canonicalModel: 'Do not touch the stone carvings.',
      thaiScaffold: 'ห้ามแตะต้องภาพสลักหิน',
      inappropriateChecks: [
        {
          pattern: /^you can/i,
          feedback: {
            en: 'Careful! "You can touch..." permits damage instead of protecting the ancient relief.',
            th: 'ระวัง! "You can touch..." กลายเป็นอนุญาตให้แตะ ซึ่งเสี่ยงต่อความเสียหาย',
          },
        },
      ],
      hints: {
        tier1Structure: {
          en: 'Firm heritage protection uses: [Do not] + [base verb] + [the + artifact].',
          th: 'ป้ายห้ามอนุรักษ์ใช้: [Do not] + [กริยาช่อง 1] + [the + วัตถุโบราณ]',
        },
        tier2Focus: {
          en: 'Place "Do not" before "touch the stone carvings".',
          th: 'วาง "Do not" หน้า "touch the stone carvings"',
        },
        tier3Scaffold: {
          en: 'Model frame: "Do not ___ the stone carvings."',
          th: 'กรอบคำตอบ: "Do not ___ the stone carvings."',
        },
      },
    },
    b1: {
      mode: 'b1',
      courtyardSceneKey: 'stone_warning',
      audienceLabel: {
        en: 'Audience: Photography visitors near sanctuary wall',
        th: 'ผู้รับสาร: ผู้ถ่ายภาพใกล้กำแพงวิหาร',
      },
      situationPrompt: {
        en: 'Bright camera flashes fade ancient wall pigment. Post a firm, clear rule prohibiting flash photography inside.',
        th: 'แสงแฟลชกล้องทำให้สีบนผนังวิหารซีดจาง เขียนกฎห้ามใช้แฟลชอย่างเป็นทางการและสุภาพ',
      },
      tiles: makeTiles('tr2_b1', [
        { value: 'Do not', role: 'negative' },
        { value: 'use', role: 'verb' },
        { value: 'flash photography', role: 'object' },
        { value: 'near the', role: 'prep' },
        { value: 'painted walls', role: 'object' },
        { value: 'You should definitely', role: 'phrase', isDistractor: true },
        { value: 'bright lights', role: 'object', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^(?:do not|don't)\s+use\s+flash\s+photography\s+near\s+the\s+painted\s+walls$/i,
      ],
      canonicalModel: 'Do not use flash photography near the painted walls.',
      thaiScaffold: 'ห้ามใช้แฟลชถ่ายภาพใกล้ผนังภาพเขียนสี',
      inappropriateChecks: [
        {
          pattern: /^you should definitely/i,
          feedback: {
            en: '"You should definitely use..." recommends flash photography, which damages pigments!',
            th: '"You should definitely..." กลายเป็นการแนะนำให้เปิดแฟลช ซึ่งทำลายสีโบราณ!',
          },
        },
      ],
      hints: {
        tier1Structure: {
          en: 'Structure: [Do not] + [use] + [flash photography] + [near the painted walls].',
          th: 'โครงสร้าง: [Do not] + [use] + [flash photography] + [near the painted walls]',
        },
        tier2Focus: {
          en: 'Choose "flash photography" as the exact banned action.',
          th: 'เลือกคำว่า "flash photography" เป็นสิ่งที่ห้ามใช้',
        },
        tier3Scaffold: {
          en: 'Model frame: "Do not use ___ near the painted walls."',
          th: 'กรอบคำตอบ: "Do not use ___ near the painted walls."',
        },
      },
    },
  },
  {
    challengeId: 'tr_3_quiet_respect',
    order: 3,
    title: {
      en: 'Calm Sanctuary Tone · Inside the Courtyard',
      th: 'บรรยากาศสงบในลานวิหาร',
    },
    a2: {
      mode: 'a2',
      courtyardSceneKey: 'quiet_shadow',
      audienceLabel: {
        en: 'Audience: Visitors inside the Sun Sanctuary',
        th: 'ผู้รับสาร: ผู้เข้าชมภายในเขตวิหารดวงอาทิตย์',
      },
      situationPrompt: {
        en: 'People are listening to Karim explain the sun disc. Ask visitors politely to speak quietly.',
        th: 'ผู้คนกำลังฟังคาริมอธิบายเรื่องจานสุริยัน ขอความร่วมมือผู้เยี่ยมชมอย่างสุภาพให้พูดเสียงเบา',
      },
      tiles: makeTiles('tr3_a2', [
        { value: 'Please', role: 'polite' },
        { value: 'speak', role: 'verb' },
        { value: 'quietly', role: 'phrase' },
        { value: 'inside the', role: 'prep' },
        { value: 'courtyard', role: 'object' },
        { value: 'Shut up', role: 'negative', isDistractor: true },
        { value: 'loudly', role: 'phrase', isDistractor: true },
      ]),
      acceptedPatterns: [/^please\s+speak\s+quietly\s+inside\s+the\s+courtyard$/i],
      canonicalModel: 'Please speak quietly inside the courtyard.',
      thaiScaffold: 'กรุณาพูดด้วยเสียงเบาภายในลานวิหาร',
      inappropriateChecks: [
        {
          pattern: /shut up/i,
          feedback: {
            en: '"Shut up" is rude and inappropriate for a temple sign! Always choose respectful wording like "Please speak quietly".',
            th: '"Shut up" เป็นคำไม่สุภาพอย่างยิ่ง! ป้ายในวิหารควรใช้ภาษาที่สุภาพเช่น "Please speak quietly"',
          },
        },
        {
          pattern: /\bloudly\b/i,
          feedback: {
            en: 'Speaking loudly disturbs the peaceful sanctuary! Pick "quietly".',
            th: 'การพูดเสียงดัง ("loudly") รบกวนความสงบของวิหาร ควรเลือก "quietly"',
          },
        },
      ],
      hints: {
        tier1Structure: {
          en: 'Respectful sign: [Please] + [speak quietly] + [inside the courtyard].',
          th: 'ป้ายสุภาพ: [Please] + [speak quietly] + [inside the courtyard]',
        },
        tier2Focus: {
          en: 'Avoid harsh commands ("Shut up") and wrong adverbs ("loudly").',
          th: 'หลีกเลี่ยงคำหยาบ ("Shut up") และคำว่า "loudly"',
        },
        tier3Scaffold: {
          en: 'Model frame: "Please speak ___ inside the ___."',
          th: 'กรอบคำตอบ: "Please speak ___ inside the ___."',
        },
      },
    },
    b1: {
      mode: 'b1',
      courtyardSceneKey: 'quiet_shadow',
      audienceLabel: {
        en: 'Audience: Visitors during cultural narration',
        th: 'ผู้รับสาร: ผู้เข้าชมระหว่างฟังคำบรรยาย',
      },
      situationPrompt: {
        en: 'Write a thoughtful B1 reminder asking guests to keep their voices low while the guide explains sun alignment.',
        th: 'เขียนป้ายเตือนระดับ B1 ขอให้ผู้เข้าชมลดเสียงพูดขณะผู้นำทางกำลังบรรยายแนวแสงอาทิตย์',
      },
      tiles: makeTiles('tr3_b1', [
        { value: 'Please', role: 'polite' },
        { value: 'keep', role: 'verb' },
        { value: 'your voices low', role: 'object' },
        { value: 'while', role: 'condition' },
        { value: 'the guide speaks', role: 'phrase' },
        { value: 'Keep silent or leave', role: 'phrase', isDistractor: true },
        { value: 'until', role: 'condition', isDistractor: true },
      ]),
      acceptedPatterns: [/^please\s+keep\s+your\s+voices\s+low\s+while\s+the\s+guide\s+speaks$/i],
      canonicalModel: 'Please keep your voices low while the guide speaks.',
      thaiScaffold: 'กรุณาลดเสียงพูดของคุณขณะผู้นำทางกำลังอธิบาย',
      inappropriateChecks: [
        {
          pattern: /keep silent or leave/i,
          feedback: {
            en: '"Keep silent or leave" sounds hostile to guests! Use "Please keep your voices low...".',
            th: '"Keep silent or leave" ฟังดูแข็งกร้าวเกินไปสำหรับผู้เยี่ยมชม ให้ใช้ "Please keep your voices low..."',
          },
        },
      ],
      hints: {
        tier1Structure: {
          en: 'Polite time-linked request: Please + [keep your voices low] + [while + event].',
          th: 'คำขอสุภาพเชื่อมเวลา: Please + [keep your voices low] + [while + เหตุการณ์]',
        },
        tier2Focus: {
          en: 'Pair "while" (happening at the same time) with "the guide speaks".',
          th: 'ใช้ "while" (ในขณะที่) เชื่อมกับ "the guide speaks"',
        },
        tier3Scaffold: {
          en: 'Model frame: "Please keep your voices low while ___."',
          th: 'กรอบคำตอบ: "Please keep your voices low while ___."',
        },
      },
    },
  },
  {
    challengeId: 'tr_4_conditional_safety',
    order: 4,
    title: {
      en: 'Conditional Safety · If You Feel Dizzy',
      th: 'ประโยคเงื่อนไขความปลอดภัย · หากรู้สึกร้อนหรือเวียนศีรษะ',
    },
    a2: {
      mode: 'a2',
      courtyardSceneKey: 'sun_alignment',
      audienceLabel: {
        en: 'Audience: Outdoor desert explorers',
        th: 'ผู้รับสาร: นักสำรวจกลางแจ้งในทะเลทราย',
      },
      situationPrompt: {
        en: 'Write an "If..." safety rule telling anyone who feels hot or dizzy to sit in the shade immediately.',
        th: 'เขียนกฎความปลอดภัยด้วยคำว่า "If..." บอกให้ผู้ที่รู้สึกร้อนหรือมึนงงรีบนั่งพักในร่มทันที',
      },
      tiles: makeTiles('tr4_a2', [
        { value: 'If', role: 'condition' },
        { value: 'you feel dizzy,', role: 'phrase' },
        { value: 'rest', role: 'verb' },
        { value: 'in the shade', role: 'phrase' },
        { value: 'and', role: 'connector' },
        { value: 'drink water', role: 'phrase' },
        { value: 'keep running', role: 'verb', isDistractor: true },
        { value: 'Before', role: 'condition', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^if\s+you\s+feel\s+dizzy(?:,)?\s+rest\s+in\s+the\s+shade\s+and\s+drink\s+water$/i,
      ],
      canonicalModel: 'If you feel dizzy, rest in the shade and drink water.',
      thaiScaffold: 'หากคุณรู้สึกเวียนศีรษะ ให้นั่งพักในที่ร่มและดื่มน้ำ',
      inappropriateChecks: [
        {
          pattern: /keep running/i,
          feedback: {
            en: 'Running while dizzy is unsafe! Tell them to rest in the shade and drink water.',
            th: 'การวิ่งต่อทั้งที่เวียนศีรษะเป็นอันตราย! ต้องแนะนำให้พักในที่ร่มและดื่มน้ำ',
          },
        },
      ],
      hints: {
        tier1Structure: {
          en: 'Conditional rule: If + [condition], + [safe imperative action].',
          th: 'กฎแบบมีเงื่อนไข: If + [เงื่อนไข], + [คำสั่งที่ปลอดภัย]',
        },
        tier2Focus: {
          en: 'Start with "If you feel dizzy," then give the two recovery steps.',
          th: 'เริ่มด้วย "If you feel dizzy," แล้วตามด้วยขั้นตอนพักฟื้นในร่มและดื่มน้ำ',
        },
        tier3Scaffold: {
          en: 'Model frame: "If you feel dizzy, rest ___ and ___."',
          th: 'กรอบคำตอบ: "If you feel dizzy, rest ___ and ___."',
        },
      },
    },
    b1: {
      mode: 'b1',
      courtyardSceneKey: 'sun_alignment',
      audienceLabel: {
        en: 'Audience: Midday temple survey team',
        th: 'ผู้รับสาร: ทีมสำรวจลานวิหารช่วงกลางวัน',
      },
      situationPrompt: {
        en: 'Write a B1 conditional caution for strong desert wind: warn teammates what to do before dust blows into the sanctuary.',
        th: 'เขียนคำเตือนเงื่อนไขระดับ B1 สำหรับลมทะเลทรายแรง: บอกทีมว่าควรทำอย่างไรเมื่อฝุ่นทรายพัดเข้าลานวิหาร',
      },
      tiles: makeTiles('tr4_b1', [
        { value: 'When', role: 'condition' },
        { value: 'strong wind rises,', role: 'phrase' },
        { value: 'cover', role: 'verb' },
        { value: 'the', role: 'connector' },
        { value: 'map table', role: 'object' },
        { value: 'and', role: 'connector' },
        { value: 'wait', role: 'verb' },
        { value: 'by the pylon', role: 'phrase' },
        { value: 'leave the scrolls uncovered', role: 'phrase', isDistractor: true },
        { value: 'Unless', role: 'condition', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^when\s+strong\s+wind\s+rises(?:,)?\s+cover\s+the\s+map\s+table\s+and\s+wait\s+by\s+the\s+pylon$/i,
      ],
      canonicalModel: 'When strong wind rises, cover the map table and wait by the pylon.',
      thaiScaffold: 'เมื่อมีลมแรงพัดมา ให้คลุมโต๊ะแผนที่และรออยู่ข้างซุ้มประตูไพลอน',
      inappropriateChecks: [
        {
          pattern: /^unless\b/i,
          feedback: {
            en: '"Unless" flips the meaning! We protect the maps WHEN strong wind rises.',
            th: '"Unless" (เว้นแต่) ทำให้ความหมายกลับด้าน! เราต้องคลุมโต๊ะเมื่อ ("When") ลมแรงพัดมา',
          },
        },
      ],
      hints: {
        tier1Structure: {
          en: 'Time condition: When + [weather change], + [protect gear] + and + [safe spot].',
          th: 'เงื่อนไขเวลา: When + [สภาพอากาศ], + [ป้องกันอุปกรณ์] + and + [จุดปลอดภัย]',
        },
        tier2Focus: {
          en: 'Use "When strong wind rises,", NOT "Unless".',
          th: 'ใช้ "When strong wind rises," ไม่ใช่ "Unless"',
        },
        tier3Scaffold: {
          en: 'Model frame: "When strong wind rises, cover ___ and wait ___."',
          th: 'กรอบคำตอบ: "When strong wind rises, cover ___ and wait ___."',
        },
      },
    },
  },
  {
    challengeId: 'tr_5_before_entry_rule',
    order: 5,
    title: {
      en: 'Before-Action Check · Gate Protocol',
      th: 'ตรวจสอบก่อนเข้าพื้นที่ · กฎหน้าซุ้มประตู',
    },
    a2: {
      mode: 'a2',
      courtyardSceneKey: 'arrival_check',
      audienceLabel: {
        en: 'Audience: Explorers entering the sun sanctuary',
        th: 'ผู้รับสาร: นักสำรวจก่อนก้าวเข้าเขตวิหาร',
      },
      situationPrompt: {
        en: 'Tell explorers what they must check BEFORE stepping across the temple threshold.',
        th: 'บอกนักสำรวจว่าต้องเช็กอะไร "ก่อน" ก้าวข้ามธรณีประตูวิหาร (Before + V-ing...)',
      },
      tiles: makeTiles('tr5_a2', [
        { value: 'Before', role: 'condition' },
        { value: 'entering,', role: 'phrase' },
        { value: 'check', role: 'verb' },
        { value: 'your', role: 'connector' },
        { value: 'shoes', role: 'object' },
        { value: 'for', role: 'prep' },
        { value: 'loose sand', role: 'phrase' },
        { value: 'After', role: 'condition', isDistractor: true },
        { value: 'run fast', role: 'verb', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^before\s+entering(?:,)?\s+check\s+your\s+shoes\s+for\s+loose\s+sand$/i,
      ],
      canonicalModel: 'Before entering, check your shoes for loose sand.',
      thaiScaffold: 'ก่อนเดินเข้าไป กรุณาตรวจรองเท้าเพื่อไม่ให้มีทรายติดเข้าไป',
      inappropriateChecks: [
        {
          pattern: /^after\b/i,
          feedback: {
            en: 'Cleaning shoes AFTER entering brings desert grit inside the sanctuary! Use "Before entering,".',
            th: 'ตรวจรองเท้าหลัง ("After") เข้าไปแล้ว จะทำให้ทรายเลอะด้านใน! ต้องใช้ "Before entering,"',
          },
        },
      ],
      hints: {
        tier1Structure: {
          en: 'Pre-action pattern: Before entering, + [verb] + [object] + [for reason].',
          th: 'รูปแบบเตรียมพร้อมก่อนทำ: Before entering, + [กริยา] + [สิ่งของ] + [เพื่อตรวจหา...]',
        },
        tier2Focus: {
          en: 'Put "Before entering," first so the sandstone floor stays clean.',
          th: 'ขึ้นต้นด้วย "Before entering," เพื่อรักษาความสะอาดของพื้นหินทรายด้านใน',
        },
        tier3Scaffold: {
          en: 'Model frame: "Before entering, check ___ for ___."',
          th: 'กรอบคำตอบ: "Before entering, check ___ for ___."',
        },
      },
    },
    b1: {
      mode: 'b1',
      courtyardSceneKey: 'arrival_check',
      audienceLabel: {
        en: 'Audience: Students preparing to measure solstice shadows',
        th: 'ผู้รับสาร: ผู้ช่วยเตรียมวัดแนวเงาดวงอาทิตย์',
      },
      situationPrompt: {
        en: 'Draft a before-step alignment check: before recording shadow angles, verify the compass lies flat on the stone block.',
        th: 'เขียนข้อควรตรวจสอบก่อนวัดมุมเงา: ก่อนจดค่ามุม ให้เช็กว่าเข็มทิศวางราบสนิทบนแท่นหิน',
      },
      tiles: makeTiles('tr5_b1', [
        { value: 'Before', role: 'condition' },
        { value: 'recording angles,', role: 'phrase' },
        { value: 'make sure', role: 'verb' },
        { value: 'the', role: 'connector' },
        { value: 'compass', role: 'object' },
        { value: 'lies flat', role: 'phrase' },
        { value: 'on the level block', role: 'phrase' },
        { value: 'guess quickly', role: 'verb', isDistractor: true },
        { value: 'After', role: 'condition', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^before\s+recording\s+angles(?:,)?\s+make\s+sure\s+the\s+compass\s+lies\s+flat\s+on\s+the\s+level\s+block$/i,
      ],
      canonicalModel: 'Before recording angles, make sure the compass lies flat on the level block.',
      thaiScaffold: 'ก่อนจดบันทึกมุม ตรวจสอบให้แน่ใจว่าเข็มทิศวางราบสนิทบนแท่นหินระดับเดียวกัน',
      inappropriateChecks: [
        {
          pattern: /^after\b/i,
          feedback: {
            en: 'Checking accuracy AFTER recording angles makes the measurement inaccurate! Put "Before" first.',
            th: 'เช็กความเรียบหลังจดค่าแล้วจะทำให้ค่าที่วัดคลาดเคลื่อน! ต้องเริ่มด้วย "Before"',
          },
        },
      ],
      hints: {
        tier1Structure: {
          en: 'Before + [gerund phrase], + make sure + [subject] + [lies flat on...].',
          th: 'Before + [สิ่งที่กำลังจะทำ], + make sure + [คำนาม] + [lies flat on...]',
        },
        tier2Focus: {
          en: 'Pair "make sure" + "the compass lies flat" + "on the level block".',
          th: 'เรียง "make sure" + "the compass lies flat" + "on the level block"',
        },
        tier3Scaffold: {
          en: 'Model frame: "Before recording angles, make sure ___ lies flat ___."',
          th: 'กรอบคำตอบ: "Before recording angles, make sure ___ lies flat ___."',
        },
      },
    },
  },
  {
    challengeId: 'tr_6_context_appropriateness',
    order: 6,
    title: {
      en: 'Tone Mastery · Help & Check Understanding',
      th: 'เลือกใช้ภาษาตามบริบท · ช่วยเหลือและเช็กความเข้าใจ',
    },
    a2: {
      mode: 'a2',
      courtyardSceneKey: 'context_courtesy',
      audienceLabel: {
        en: 'Audience: A confused newcomer holding a map',
        th: 'ผู้รับสาร: ผู้มาเยือนที่กำลังถือแผนที่และดูสับสน',
      },
      situationPrompt: {
        en: 'A new explorer looks lost near the pillars. Pick the warmest, clearest conditional instruction offering help if they get lost.',
        th: 'นักสำรวจใหม่ดูสับสนแถวเสาวิหาร เขียนข้อความที่สุภาพและชัดเจนว่าหากหลงทางให้ถามผู้นำทางได้ทันที',
      },
      tiles: makeTiles('tr6_a2', [
        { value: 'If', role: 'condition' },
        { value: 'you get lost,', role: 'phrase' },
        { value: 'please', role: 'polite' },
        { value: 'ask', role: 'verb' },
        { value: 'a guide', role: 'object' },
        { value: 'for help', role: 'phrase' },
        { value: 'wander off alone', role: 'verb', isDistractor: true },
        { value: 'Do not bother us', role: 'negative', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^if\s+you\s+get\s+lost(?:,)?\s+please\s+ask\s+a\s+guide\s+for\s+help$/i,
      ],
      canonicalModel: 'If you get lost, please ask a guide for help.',
      thaiScaffold: 'หากคุณหลงทาง กรุณาสอบถามขอความช่วยเหลือจากผู้นำทาง',
      inappropriateChecks: [
        {
          pattern: /do not bother us|wander off alone/i,
          feedback: {
            en: 'A welcoming expedition sign should NEVER turn away a lost visitor! Offer friendly guidance with "please ask a guide for help".',
            th: 'ป้ายคณะสำรวจที่ดีไม่ควรไล่ผู้หลงทาง! เลือกคำแนะนำที่ช่วยเหลืออย่างสุภาพคือ "please ask a guide for help"',
          },
        },
      ],
      hints: {
        tier1Structure: {
          en: 'Friendly conditional support: If + [problem], + please + [ask a guide for help].',
          th: 'คำแนะนำเชิงช่วยเหลือ: If + [ปัญหา], + please + [ask a guide for help]',
        },
        tier2Focus: {
          en: 'Avoid unfriendly distractors like "Do not bother us" or unsafe advice.',
          th: 'หลีกเลี่ยงข้อความที่ไม่เป็นมิตรอย่าง "Do not bother us"',
        },
        tier3Scaffold: {
          en: 'Model frame: "If you get lost, please ask ___ for help."',
          th: 'กรอบคำตอบ: "If you get lost, please ask ___ for help."',
        },
      },
    },
    b1: {
      mode: 'b1',
      courtyardSceneKey: 'context_courtesy',
      audienceLabel: {
        en: 'Audience: Junior assistants starting temple duty',
        th: 'ผู้รับสาร: ผู้ช่วยคณะสำรวจที่กำลังเริ่มปฏิบัติหน้าที่',
      },
      situationPrompt: {
        en: 'Combine a polite temple rule with a clarifying check so assistants confirm visitors understand before entering.',
        th: 'ผสานคำขอสุภาพกับการตรวจสอบความเข้าใจ เพื่อให้ผู้ช่วยยืนยันว่าผู้มาเยือนเข้าใจกฎก่อนเข้าชม',
      },
      tiles: makeTiles('tr6_b1', [
        { value: 'Before', role: 'condition' },
        { value: 'guiding guests,', role: 'phrase' },
        { value: 'please', role: 'polite' },
        { value: 'explain', role: 'verb' },
        { value: 'the', role: 'connector' },
        { value: 'temple rules', role: 'object' },
        { value: 'and', role: 'connector' },
        { value: 'check', role: 'verb' },
        { value: 'if everyone understands', role: 'phrase' },
        { value: 'skip questions', role: 'verb', isDistractor: true },
        { value: 'yell at', role: 'verb', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^before\s+guiding\s+guests(?:,)?\s+please\s+explain\s+the\s+temple\s+rules\s+and\s+check\s+if\s+everyone\s+understands$/i,
      ],
      canonicalModel:
        'Before guiding guests, please explain the temple rules and check if everyone understands.',
      thaiScaffold: 'ก่อนนำคณะผู้เยี่ยมชม กรุณาอธิบายกฎของวิหารและตรวจสอบว่าทุกคนเข้าใจตรงกัน',
      inappropriateChecks: [
        {
          pattern: /skip questions|yell at/i,
          feedback: {
            en: 'Good guides never yell or skip understanding checks! Explain rules politely and verify comprehension.',
            th: 'ผู้นำทางที่ดีจะไม่ตะโกนหรือข้ามการเช็กความเข้าใจ! อธิบายอย่างสุภาพแล้วตรวจความเข้าใจ',
          },
        },
      ],
      hints: {
        tier1Structure: {
          en: 'Before + [guiding guests], + please + [explain rule] + and + [check understanding].',
          th: 'Before + [guiding guests], + please + [อธิบายกฎ] + and + [เช็กความเข้าใจ]',
        },
        tier2Focus: {
          en: 'End cleanly with "and check if everyone understands".',
          th: 'ปิดท้ายอย่างสมบูรณ์ด้วย "and check if everyone understands"',
        },
        tier3Scaffold: {
          en: 'Model frame: "Before guiding guests, please explain ___ and check ___."',
          th: 'กรอบคำตอบ: "Before guiding guests, please explain ___ and check ___."',
        },
      },
    },
  },
];

export function validateTempleRuleArchitectSubmission(
  variant: TempleRuleArchitectVariant,
  selectedTileValues: string[],
): { isCorrect: boolean; sentence: string; feedback: LocalizedText } {
  const sentence = joinNormalizedTiles(selectedTileValues);
  if (!sentence || selectedTileValues.length < 2) {
    return {
      isCorrect: false,
      sentence,
      feedback: {
        en: 'Place tiles onto the sandstone sign plaque before checking your temple rule.',
        th: 'กรุณาเรียงคำลงบนป้ายศิลาให้ครบก่อนตรวจคำตอบ',
      },
    };
  }

  const cleaned = normalizeEnglishSentenceForCheck(sentence);

  for (const check of variant.inappropriateChecks) {
    if (check.pattern.test(cleaned)) {
      return {
        isCorrect: false,
        sentence,
        feedback: check.feedback,
      };
    }
  }

  if (matchesAuthoredPatterns(sentence, variant.acceptedPatterns)) {
    return {
      isCorrect: true,
      sentence,
      feedback: {
        en: 'Sign approved! Both grammar and respectful temple tone fit this courtyard moment.',
        th: 'ป้ายกฎผ่านการอนุมัติ! ทั้งไวยากรณ์และน้ำเสียงเหมาะสมกับบริบทวิหาร',
      },
    };
  }

  return {
    isCorrect: false,
    sentence,
    feedback: {
      en: 'Check the sign phrasing and tone—make sure it fits both English grammar and what the situation needs.',
      th: 'ลองทวนรูปประโยคและระดับความสุภาพอีกครั้ง ให้ตรงตามไวยากรณ์และสถานการณ์บนป้าย',
    },
  };
}

// ============================================================================
// GAME 5 — THE PHARAOH'S MASTER BLUEPRINT (6 A2 + 6 B1, Multi-Section Plans)
// ============================================================================

export const PHARAOH_BLUEPRINT_CHALLENGES: PharaohBlueprintChallengeBundle[] = [
  {
    challengeId: 'pb_1_prep_plan',
    order: 1,
    title: {
      en: 'Blueprint 1 · Camp Departure Plan',
      th: 'แปลนที่ 1 · แผนเตรียมออกเดินทางจากค่าย',
    },
    a2: {
      mode: 'a2',
      missionBrief: {
        en: 'Author a complete departure blueprint for new assistants leaving the Nile Expedition Camp toward Giza Plaza.',
        th: 'เขียนแปลนออกเดินทางจากค่ายริมไนล์สู่ลานกีซาให้ครบทั้ง 4 ส่วน',
      },
      relatedSkillIds: [
        'expedition_command_forge',
        'pyramid_route_architect',
        'papyrus_instruction_workshop',
        'temple_rule_architect',
      ],
      sections: [
        {
          sectionId: 'prep',
          sectionLabel: { en: '1. Preparation', th: '1. การเตรียมตัว' },
          prompt: {
            en: 'Tell the team to bring water and a compass.',
            th: 'สั่งให้นำน้ำดื่มและเข็มทิศติดตัว',
          },
          tiles: makeTiles('pb1_a2_p', [
            { value: 'Bring', role: 'verb' },
            { value: 'your', role: 'connector' },
            { value: 'water', role: 'object' },
            { value: 'and', role: 'connector' },
            { value: 'compass', role: 'object' },
            { value: 'Forget', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [/^bring\s+your\s+water\s+and\s+compass$/i],
          canonicalLine: 'Bring your water and compass.',
        },
        {
          sectionId: 'directions',
          sectionLabel: { en: '2. Directions', th: '2. การบอกทาง' },
          prompt: {
            en: 'Direct them north toward Giza Pyramid Plaza.',
            th: 'บอกทางให้เดินขึ้นเหนือไปยังลานมหาพีระมิดกีซา',
          },
          tiles: makeTiles('pb1_a2_d', [
            { value: 'Walk', role: 'verb' },
            { value: 'north', role: 'prep' },
            { value: 'to', role: 'prep' },
            { value: 'Giza Plaza', role: 'object' },
            { value: 'south', role: 'prep', isDistractor: true },
          ]),
          acceptedPatterns: [/^walk\s+north\s+to\s+giza\s+plaza$/i],
          canonicalLine: 'Walk north to Giza Plaza.',
        },
        {
          sectionId: 'sequence',
          sectionLabel: { en: '3. Sequence', th: '3. ลำดับขั้นตอน' },
          prompt: {
            en: 'Add the first on-site action using "First,".',
            th: 'เขียนขั้นตอนแรกเมื่อถึงพื้นที่ด้วย "First,"',
          },
          tiles: makeTiles('pb1_a2_s', [
            { value: 'First,', role: 'sequencer' },
            { value: 'check', role: 'verb' },
            { value: 'the', role: 'connector' },
            { value: 'site map', role: 'object' },
            { value: 'Finally,', role: 'sequencer', isDistractor: true },
          ]),
          acceptedPatterns: [/^first(?:,)?\s+check\s+the\s+site\s+map$/i],
          canonicalLine: 'First, check the site map.',
        },
        {
          sectionId: 'rule_check',
          sectionLabel: { en: '4. Rule & Check', th: '4. กฎและเช็กความเข้าใจ' },
          prompt: {
            en: 'Finish with a polite stay-on-path rule.',
            th: 'ปิดท้ายด้วยกฎสุภาพให้เดินตามเส้นทาง',
          },
          tiles: makeTiles('pb1_a2_r', [
            { value: 'Please', role: 'polite' },
            { value: 'stay', role: 'verb' },
            { value: 'on the', role: 'prep' },
            { value: 'path', role: 'object' },
            { value: 'climb', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [/^please\s+stay\s+on\s+the\s+path$/i],
          canonicalLine: 'Please stay on the path.',
        },
      ],
      thaiScaffold:
        '1) เตรียมน้ำและเข็มทิศ 2) เดินเหนือไปลานกีซา 3) ขั้นแรกตรวจแผนที่ 4) กรุณาเดินตามเส้นทาง',
      hints: {
        tier1Structure: {
          en: 'Complete all 4 blueprint parts: Prep + Direction + "First," step + Polite rule.',
          th: 'ประกอบครบ 4 ส่วน: เตรียมตัว + ทิศทาง + ขั้นแรก + กฎสุภาพ',
        },
        tier2Focus: {
          en: 'Use "Bring..." (not "Forget"), "north" (not "south"), and "First," before closing politely.',
          th: 'ใช้ "Bring...", ทิศ "north", คำเชื่อม "First," และจบด้วย "Please"',
        },
        tier3Scaffold: {
          en: 'Plan preview: Bring your water and compass. Walk north to Giza Plaza. First, check the site map. Please stay on the path.',
          th: 'แนวแปลน: Bring your water and compass. Walk north to Giza Plaza. First, check the site map. Please stay on the path.',
        },
      },
    },
    b1: {
      mode: 'b1',
      missionBrief: {
        en: 'Draft a B1 Nile-to-Giza readiness blueprint combining kit check, safe path direction, briefing sequence, and heat caution.',
        th: 'เขียนแปลนเตรียมความพร้อมระดับ B1 จากค่ายไนล์สู่กีซาให้ครบทั้ง 4 หมวด',
      },
      relatedSkillIds: [
        'expedition_command_forge',
        'pyramid_route_architect',
        'papyrus_instruction_workshop',
        'temple_rule_architect',
      ],
      sections: [
        {
          sectionId: 'prep',
          sectionLabel: { en: '1. Preparation', th: '1. การเตรียมตัว' },
          prompt: {
            en: 'Command assistants to pack notebook, compass, and water.',
            th: 'สั่งให้ผู้ช่วยเก็บสมุด เข็มทิศ และน้ำดื่มให้พร้อม',
          },
          tiles: makeTiles('pb1_b1_p', [
            { value: 'Pack', role: 'verb' },
            { value: 'a notebook,', role: 'object' },
            { value: 'a compass,', role: 'object' },
            { value: 'and', role: 'connector' },
            { value: 'water', role: 'object' },
            { value: 'Leave', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [/^pack\s+a\s+notebook(?:,)?\s+a\s+compass(?:,)?\s+and\s+water$/i],
          canonicalLine: 'Pack a notebook, a compass, and water.',
        },
        {
          sectionId: 'directions',
          sectionLabel: { en: '2. Directions', th: '2. การบอกทาง' },
          prompt: {
            en: 'Guide them past the signpost toward Giza Plaza.',
            th: 'บอกทางให้เดินผ่านป้ายบอกทางมุ่งหน้าสู่ลานกีซา',
          },
          tiles: makeTiles('pb1_b1_d', [
            { value: 'Walk straight', role: 'verb' },
            { value: 'past the', role: 'prep' },
            { value: 'signpost', role: 'object' },
            { value: 'to', role: 'prep' },
            { value: 'Giza Plaza', role: 'object' },
            { value: 'into', role: 'prep', isDistractor: true },
          ]),
          acceptedPatterns: [/^walk\s+straight\s+past\s+the\s+signpost\s+to\s+giza\s+plaza$/i],
          canonicalLine: 'Walk straight past the signpost to Giza Plaza.',
        },
        {
          sectionId: 'sequence',
          sectionLabel: { en: '3. Sequence', th: '3. ลำดับขั้นตอน' },
          prompt: {
            en: 'State the two-step arrival sequence (brief with Omar, then mark notes).',
            th: 'ระบุลำดับเมื่อถึงที่หมาย (ฟังโอมาร์ก่อน แล้วจดบันทึก)',
          },
          tiles: makeTiles('pb1_b1_s', [
            { value: 'First,', role: 'sequencer' },
            { value: 'meet Omar,', role: 'phrase' },
            { value: 'and then', role: 'sequencer' },
            { value: 'mark your route', role: 'phrase' },
            { value: 'forget', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [/^first(?:,)?\s+meet\s+omar(?:,)?\s+and\s+then\s+mark\s+your\s+route$/i],
          canonicalLine: 'First, meet Omar, and then mark your route.',
        },
        {
          sectionId: 'rule_check',
          sectionLabel: { en: '4. Rule & Check', th: '4. กฎและเช็กความเข้าใจ' },
          prompt: {
            en: 'Include a conditional heat rule and quick check.',
            th: 'ใส่กฎเงื่อนไขเรื่องความร้อนและการพักดื่มน้ำ',
          },
          tiles: makeTiles('pb1_b1_r', [
            { value: 'If', role: 'condition' },
            { value: 'the sun feels strong,', role: 'phrase' },
            { value: 'rest', role: 'verb' },
            { value: 'in the shade', role: 'phrase' },
            { value: 'sprint faster', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [
            /^if\s+the\s+sun\s+feels\s+strong(?:,)?\s+rest\s+in\s+the\s+shade$/i,
          ],
          canonicalLine: 'If the sun feels strong, rest in the shade.',
        },
      ],
      thaiScaffold:
        '1) เก็บสมุด เข็มทิศ และน้ำ 2) เดินตรงผ่านป้ายสู่ลานกีซา 3) พบโอมาร์ก่อนแล้วจดเส้นทาง 4) หากแดดแรงให้พักในร่ม',
      hints: {
        tier1Structure: {
          en: 'Pair all four blueprint panels with matching verbs, prepositions, sequencers, and "If" clause.',
          th: 'ตรวจคำกริยา บุพบท คำเชื่อมลำดับ และประโยคเงื่อนไขในครบทุกหมวด',
        },
        tier2Focus: {
          en: 'Avoid distractors like "Leave", "into", "forget", and "sprint faster".',
          th: 'ระวังคำหลอก: Leave, into, forget, และ sprint faster',
        },
        tier3Scaffold: {
          en: 'Check each of the 4 blocks ends in a grammatical English line.',
          th: 'ตรวจให้แน่ใจว่าทั้ง 4 บรรทัดเป็นประโยคที่สมบูรณ์และสอดคล้องกัน',
        },
      },
    },
  },
  {
    challengeId: 'pb_2_pyramid_route_brief',
    order: 2,
    title: {
      en: 'Blueprint 2 · Giza Survey Route',
      th: 'แปลนที่ 2 · แผนสำรวจเส้นทางกีซา',
    },
    a2: {
      mode: 'a2',
      missionBrief: {
        en: 'Build a clear blueprint guiding visitors safely around the Sphinx Monument and to the Scribe Workshop.',
        th: 'เขียนแปลนนำทางผู้มาเยือนผ่านสฟิงซ์ไปสู่โรงงานอาลักษณ์อย่างปลอดภัย',
      },
      relatedSkillIds: [
        'expedition_command_forge',
        'pyramid_route_architect',
        'papyrus_instruction_workshop',
        'temple_rule_architect',
      ],
      sections: [
        {
          sectionId: 'prep',
          sectionLabel: { en: '1. Preparation', th: '1. การเตรียมตัว' },
          prompt: { en: 'Put the camera strap securely on.', th: 'เตือนให้สวมหมวกกันแดดก่อนออกเดิน' },
          tiles: makeTiles('pb2_a2_p', [
            { value: 'Wear', role: 'verb' },
            { value: 'your', role: 'connector' },
            { value: 'sun hat', role: 'object' },
            { value: 'now', role: 'phrase' },
            { value: 'Drop', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [/^wear\s+your\s+sun\s+hat(?:\s+now)?$/i],
          canonicalLine: 'Wear your sun hat now.',
        },
        {
          sectionId: 'directions',
          sectionLabel: { en: '2. Directions', th: '2. การบอกทาง' },
          prompt: { en: 'Walk past the Sphinx and turn right.', th: 'เดินผ่านสฟิงซ์แล้วเลี้ยวขวา' },
          tiles: makeTiles('pb2_a2_d', [
            { value: 'Walk past', role: 'verb' },
            { value: 'the', role: 'connector' },
            { value: 'Sphinx', role: 'object' },
            { value: 'and', role: 'connector' },
            { value: 'turn right', role: 'verb' },
            { value: 'turn upside down', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [/^walk\s+past\s+the\s+sphinx\s+and\s+turn\s+right$/i],
          canonicalLine: 'Walk past the Sphinx and turn right.',
        },
        {
          sectionId: 'sequence',
          sectionLabel: { en: '3. Sequence', th: '3. ลำดับขั้นตอน' },
          prompt: { en: 'Add next stop at Mariam’s desk.', th: 'ต่อด้วยขั้นถัดไปเมื่อพบมาเรียม' },
          tiles: makeTiles('pb2_a2_s', [
            { value: 'Next,', role: 'sequencer' },
            { value: 'visit', role: 'verb' },
            { value: 'the', role: 'connector' },
            { value: 'Scribe Workshop', role: 'object' },
            { value: 'Never', role: 'negative', isDistractor: true },
          ]),
          acceptedPatterns: [/^next(?:,)?\s+visit\s+the\s+scribe\s+workshop$/i],
          canonicalLine: 'Next, visit the Scribe Workshop.',
        },
        {
          sectionId: 'rule_check',
          sectionLabel: { en: '4. Rule & Check', th: '4. กฎและเช็กความเข้าใจ' },
          prompt: { en: 'Warn not to climb on monuments.', th: 'เตือนว่าห้ามปีนอนุสรณ์สถาน' },
          tiles: makeTiles('pb2_a2_r', [
            { value: 'Do not', role: 'negative' },
            { value: 'climb', role: 'verb' },
            { value: 'the', role: 'connector' },
            { value: 'monuments', role: 'object' },
            { value: 'Please jump on', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [/^(?:do not|don't)\s+climb\s+the\s+monuments$/i],
          canonicalLine: 'Do not climb the monuments.',
        },
      ],
      thaiScaffold:
        '1) สวมหมวกกันแดด 2) เดินผ่านสฟิงซ์แล้วเลี้ยวขวา 3) ต่อมาไปโรงงานอาลักษณ์ 4) ห้ามปีนอนุสรณ์สถาน',
      hints: {
        tier1Structure: {
          en: 'Check Prep ("Wear..."), Route ("Walk past..."), Sequencer ("Next,"), and Rule ("Do not...").',
          th: 'เช็ก Prep ("Wear..."), เส้นทาง ("Walk past..."), ลำดับ ("Next,"), และกฎ ("Do not...")',
        },
        tier2Focus: {
          en: 'Every station has one unsafe/incorrect distractor—leave those unused.',
          th: 'แต่ละส่วนมีคำหลอก 1 ชิ้นที่ไม่ควรเลือกใช้',
        },
        tier3Scaffold: {
          en: 'Check: Wear your sun hat now. / Walk past the Sphinx and turn right. / Next, visit... / Do not climb...',
          th: 'แนวคำตอบ: Wear your sun hat now. / Walk past the Sphinx and turn right. / Next, visit... / Do not climb...',
        },
      },
    },
    b1: {
      mode: 'b1',
      missionBrief: {
        en: 'Compose a B1 visitor blueprint connecting Giza obelisk, east route, workshop greeting, and heritage care.',
        th: 'เขียนแปลนนำชมลานกีซาเชื่อมสู่โรงงานอาลักษณ์ระดับ B1 ครบ 4 หมวด',
      },
      relatedSkillIds: [
        'expedition_command_forge',
        'pyramid_route_architect',
        'papyrus_instruction_workshop',
        'temple_rule_architect',
      ],
      sections: [
        {
          sectionId: 'prep',
          sectionLabel: { en: '1. Preparation', th: '1. การเตรียมตัว' },
          prompt: { en: 'Tell guests to check water and sun protection first.', th: 'เช็กน้ำดื่มและหมวกก่อนออกแดด' },
          tiles: makeTiles('pb2_b1_p', [
            { value: 'Check', role: 'verb' },
            { value: 'that everyone', role: 'phrase' },
            { value: 'has', role: 'connector' },
            { value: 'water and a hat', role: 'object' },
            { value: 'forgets', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [/^check\s+that\s+everyone\s+has\s+water\s+and\s+a\s+hat$/i],
          canonicalLine: 'Check that everyone has water and a hat.',
        },
        {
          sectionId: 'directions',
          sectionLabel: { en: '2. Directions', th: '2. การบอกทาง' },
          prompt: { en: 'Walk past the obelisk and turn east toward the pavilion.', th: 'เดินผ่านเสาโอบิลิสก์แล้วเลี้ยวไปทางตะวันออกสู่ศาลา' },
          tiles: makeTiles('pb2_b1_d', [
            { value: 'Go past', role: 'verb' },
            { value: 'the obelisk,', role: 'object' },
            { value: 'then', role: 'sequencer' },
            { value: 'turn east', role: 'verb' },
            { value: 'toward the pavilion', role: 'phrase' },
            { value: 'west', role: 'prep', isDistractor: true },
          ]),
          acceptedPatterns: [
            /^go\s+past\s+the\s+obelisk(?:,)?\s+then\s+turn\s+east\s+toward\s+the\s+pavilion$/i,
          ],
          canonicalLine: 'Go past the obelisk, then turn east toward the pavilion.',
        },
        {
          sectionId: 'sequence',
          sectionLabel: { en: '3. Sequence', th: '3. ลำดับขั้นตอน' },
          prompt: { en: 'Explain greeting Mariam before observing papyrus rolls.', th: 'ทักทายมาเรียมแล้วค่อยชมม้วนปาปิรุส' },
          tiles: makeTiles('pb2_b1_s', [
            { value: 'After arriving,', role: 'sequencer' },
            { value: 'greet Mariam', role: 'phrase' },
            { value: 'and', role: 'connector' },
            { value: 'view the scrolls', role: 'phrase' },
            { value: 'grab', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [
            /^after\s+arriving(?:,)?\s+greet\s+mariam\s+and\s+view\s+the\s+scrolls$/i,
          ],
          canonicalLine: 'After arriving, greet Mariam and view the scrolls.',
        },
        {
          sectionId: 'rule_check',
          sectionLabel: { en: '4. Rule & Check', th: '4. กฎและเช็กความเข้าใจ' },
          prompt: { en: 'State a polite boundary rule and offer questions.', th: 'ย้ำเขตเชือกและเช็กคำถาม' },
          tiles: makeTiles('pb2_b1_r', [
            { value: 'Please', role: 'polite' },
            { value: 'keep behind', role: 'verb' },
            { value: 'the ropes,', role: 'object' },
            { value: 'and', role: 'connector' },
            { value: 'ask if unsure', role: 'phrase' },
            { value: 'push past', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [
            /^please\s+keep\s+behind\s+the\s+ropes(?:,)?\s+and\s+ask\s+if\s+unsure$/i,
          ],
          canonicalLine: 'Please keep behind the ropes, and ask if unsure.',
        },
      ],
      thaiScaffold:
        '1) เช็กน้ำและหมวกทุกคน 2) ผ่านโอบิลิสก์แล้วเลี้ยวตะวันออก 3) ทักทายมาเรียมและชมม้วนกระดาษ 4) อยู่หลังเชือกและถามได้หากไม่แน่ใจ',
      hints: {
        tier1Structure: {
          en: 'Four sections: Gear verification -> Route with obelisk -> Sequence ("After arriving,") -> Polite rule + check.',
          th: 'ทั้ง 4 หมวด: ตรวจอุปกรณ์ -> ทางผ่านโอบิลิสก์ -> ลำดับเมื่อถึง -> กฎสุภาพและเช็กความเข้าใจ',
        },
        tier2Focus: {
          en: 'Avoid unsafe verbs "forgets", "grab", "push past", and wrong compass direction "west".',
          th: 'หลีกเลี่ยงคำหลอก "forgets", "grab", "push past" และทิศ "west"',
        },
        tier3Scaffold: {
          en: 'Complete each slot logically in order of the expedition flow.',
          th: 'เรียงคำในแต่ละส่วนตามลำดับจริงของภารกิจสำรวจ',
        },
      },
    },
  },
  {
    challengeId: 'pb_3_papyrus_archive_plan',
    order: 3,
    title: {
      en: 'Blueprint 3 · Scribe Recording Plan',
      th: 'แปลนที่ 3 · แผนบันทึกอักษรอาลักษณ์',
    },
    a2: {
      mode: 'a2',
      missionBrief: {
        en: 'Write an archive team blueprint covering tools, desk direction, two-step recording, and ink care.',
        th: 'เขียนแปลนบันทึกงานอาลักษณ์ครบทั้ง 4 ส่วน',
      },
      relatedSkillIds: [
        'expedition_command_forge',
        'pyramid_route_architect',
        'papyrus_instruction_workshop',
        'temple_rule_architect',
      ],
      sections: [
        {
          sectionId: 'prep',
          sectionLabel: { en: '1. Preparation', th: '1. การเตรียมตัว' },
          prompt: { en: 'Bring a pencil and clean notebook.', th: 'นำดินสอและสมุดที่สะอาดมาด้วย' },
          tiles: makeTiles('pb3_a2_p', [
            { value: 'Bring', role: 'verb' },
            { value: 'a pencil', role: 'object' },
            { value: 'and', role: 'connector' },
            { value: 'a clean notebook', role: 'object' },
            { value: 'muddy brush', role: 'object', isDistractor: true },
          ]),
          acceptedPatterns: [/^bring\s+a\s+pencil\s+and\s+a\s+clean\s+notebook$/i],
          canonicalLine: 'Bring a pencil and a clean notebook.',
        },
        {
          sectionId: 'directions',
          sectionLabel: { en: '2. Directions', th: '2. การบอกทาง' },
          prompt: { en: 'Walk east to the wooden papyrus desk.', th: 'เดินไปทางตะวันออกสู่โต๊ะปาปิรุสไม้' },
          tiles: makeTiles('pb3_a2_d', [
            { value: 'Walk', role: 'verb' },
            { value: 'east', role: 'prep' },
            { value: 'to the', role: 'prep' },
            { value: 'papyrus desk', role: 'object' },
            { value: 'north pole', role: 'object', isDistractor: true },
          ]),
          acceptedPatterns: [/^walk\s+east\s+to\s+the\s+papyrus\s+desk$/i],
          canonicalLine: 'Walk east to the papyrus desk.',
        },
        {
          sectionId: 'sequence',
          sectionLabel: { en: '3. Sequence', th: '3. ลำดับขั้นตอน' },
          prompt: { en: 'First sketch glyphs, then store your scroll.', th: 'สเกตช์อักษรก่อน แล้วเก็บม้วนกระดาษ' },
          tiles: makeTiles('pb3_a2_s', [
            { value: 'First', role: 'sequencer' },
            { value: 'sketch,', role: 'verb' },
            { value: 'then', role: 'sequencer' },
            { value: 'roll the scroll', role: 'phrase' },
            { value: 'tear', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [/^first\s+sketch(?:,)?\s+then\s+roll\s+the\s+scroll$/i],
          canonicalLine: 'First sketch, then roll the scroll.',
        },
        {
          sectionId: 'rule_check',
          sectionLabel: { en: '4. Rule & Check', th: '4. กฎและเช็กความเข้าใจ' },
          prompt: { en: 'Warn never to spill ink on old reeds.', th: 'ห้ามทำหมึกหกใส่ต้นกกโบราณ' },
          tiles: makeTiles('pb3_a2_r', [
            { value: 'Do not', role: 'negative' },
            { value: 'spill ink', role: 'phrase' },
            { value: 'on the', role: 'prep' },
            { value: 'reeds', role: 'object' },
            { value: 'pour ink', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [/^(?:do not|don't)\s+spill\s+ink\s+on\s+the\s+reeds$/i],
          canonicalLine: 'Do not spill ink on the reeds.',
        },
      ],
      thaiScaffold:
        '1) เตรียมดินสอและสมุดสะอาด 2) เดินตะวันออกไปโต๊ะปาปิรุส 3) วาดก่อนแล้วม้วนกระดาษ 4) อย่าทำหมึกหกใส่กก',
      hints: {
        tier1Structure: {
          en: 'Tool check -> East route -> First... then sequence -> Negative ink caution.',
          th: 'เตรียมเครื่องเขียน -> ทางไปทิศตะวันออก -> ลำดับ First/then -> ข้อห้ามทำหมึกหก',
        },
        tier2Focus: {
          en: 'Keep "Do not spill ink on the reeds" intact for Rule & Check.',
          th: 'หมวดกฎใช้ "Do not spill ink on the reeds."',
        },
        tier3Scaffold: {
          en: 'Preview: Bring a pencil and a clean notebook. / Walk east... / First sketch, then... / Do not spill ink...',
          th: 'แนวคำตอบ: Bring a pencil and a clean notebook. / Walk east... / First sketch, then... / Do not spill ink...',
        },
      },
    },
    b1: {
      mode: 'b1',
      missionBrief: {
        en: 'Draft a B1 workshop handling blueprint covering dry hands, east courtyard path, three-verb process, and storage check.',
        th: 'เขียนแปลนเวิร์กชอประดับ B1 เรื่องการจับเอกสารอย่างปลอดภัย',
      },
      relatedSkillIds: [
        'expedition_command_forge',
        'pyramid_route_architect',
        'papyrus_instruction_workshop',
        'temple_rule_architect',
      ],
      sections: [
        {
          sectionId: 'prep',
          sectionLabel: { en: '1. Preparation', th: '1. การเตรียมตัว' },
          prompt: { en: 'Wash and dry hands before touching scrolls.', th: 'ล้างและเช็ดมือให้แห้งก่อนจับม้วนกระดาษ' },
          tiles: makeTiles('pb3_b1_p', [
            { value: 'Wash', role: 'verb' },
            { value: 'and dry', role: 'phrase' },
            { value: 'your hands', role: 'object' },
            { value: 'before', role: 'condition' },
            { value: 'handling scrolls', role: 'phrase' },
            { value: 'wet', role: 'phrase', isDistractor: true },
          ]),
          acceptedPatterns: [/^wash\s+and\s+dry\s+your\s+hands\s+before\s+handling\s+scrolls$/i],
          canonicalLine: 'Wash and dry your hands before handling scrolls.',
        },
        {
          sectionId: 'directions',
          sectionLabel: { en: '2. Directions', th: '2. การบอกทาง' },
          prompt: { en: 'Turn east at the pottery stand and stop at the table.', th: 'เลี้ยวตะวันออกตรงจุดหม้อดินเผาแล้วหยุดที่โต๊ะ' },
          tiles: makeTiles('pb3_b1_d', [
            { value: 'Turn east', role: 'verb' },
            { value: 'at the pottery stand', role: 'phrase' },
            { value: 'and stop', role: 'verb' },
            { value: 'by the', role: 'prep' },
            { value: 'work table', role: 'object' },
            { value: 'climb over', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [
            /^turn\s+east\s+at\s+the\s+pottery\s+stand\s+and\s+stop\s+by\s+the\s+work\s+table$/i,
          ],
          canonicalLine: 'Turn east at the pottery stand and stop by the work table.',
        },
        {
          sectionId: 'sequence',
          sectionLabel: { en: '3. Sequence', th: '3. ลำดับขั้นตอน' },
          prompt: { en: 'First trace symbols, then seal pigment jars.', th: 'ลอกลายก่อน แล้วปิดฝาขวดสี' },
          tiles: makeTiles('pb3_b1_s', [
            { value: 'First,', role: 'sequencer' },
            { value: 'copy the glyphs,', role: 'phrase' },
            { value: 'finally', role: 'sequencer' },
            { value: 'seal the', role: 'verb' },
            { value: 'ink jars', role: 'object' },
            { value: 'open wide', role: 'phrase', isDistractor: true },
          ]),
          acceptedPatterns: [
            /^first(?:,)?\s+copy\s+the\s+glyphs(?:,)?\s+finally\s+seal\s+the\s+ink\s+jars$/i,
          ],
          canonicalLine: 'First, copy the glyphs, finally seal the ink jars.',
        },
        {
          sectionId: 'rule_check',
          sectionLabel: { en: '4. Rule & Check', th: '4. กฎและเช็กความเข้าใจ' },
          prompt: { en: 'Remind teammates before leaving the desk.', th: 'เช็กให้แน่ใจว่าเก็บเรียบร้อยก่อนลุกออกจากโต๊ะ' },
          tiles: makeTiles('pb3_b1_r', [
            { value: 'Before leaving,', role: 'condition' },
            { value: 'check that', role: 'verb' },
            { value: 'every scroll', role: 'object' },
            { value: 'is safe', role: 'phrase' },
            { value: 'left outside', role: 'phrase', isDistractor: true },
          ]),
          acceptedPatterns: [
            /^before\s+leaving(?:,)?\s+check\s+that\s+every\s+scroll\s+is\s+safe$/i,
          ],
          canonicalLine: 'Before leaving, check that every scroll is safe.',
        },
      ],
      thaiScaffold:
        '1) ล้างเช็ดมือให้แห้งก่อนจับม้วน 2) เลี้ยวตะวันออกหยุดที่โต๊ะทำงาน 3) คัดลอกลายแล้วปิดฝาหมึก 4) ก่อนกลับเช็กให้ม้วนปลอดภัย',
      hints: {
        tier1Structure: {
          en: 'Pair clean hands prep + east arrival + sequence + pre-departure check.',
          th: 'ล้างมือให้แห้ง -> เดินทิศตะวันออก -> คัดลอกและปิดฝา -> เช็กก่อนกลับ',
        },
        tier2Focus: {
          en: 'Avoid distractors "wet", "climb over", "open wide", and "left outside".',
          th: 'อย่าเลือก "wet", "climb over", "open wide", หรือ "left outside"',
        },
        tier3Scaffold: {
          en: 'Notice each line clearly connects to Mariam’s workshop care.',
          th: 'ทุกประโยคเชื่อมโยงกับการดูแลงานในโรงงานอาลักษณ์อย่างเป็นระบบ',
        },
      },
    },
  },
  {
    challengeId: 'pb_4_temple_courtyard_plan',
    order: 4,
    title: {
      en: 'Blueprint 4 · Sun Temple Courtyard Plan',
      th: 'แปลนที่ 4 · แผนปฏิบัติงานลานวิหารสุริยัน',
    },
    a2: {
      mode: 'a2',
      missionBrief: {
        en: 'Draft a safe Sun Temple plan for Karim’s sanctuary courtyard visit.',
        th: 'เขียนแปลนพาทีมสำรวจเข้าสู่ลานวิหารแห่งดวงอาทิตย์อย่างสุภาพและปลอดภัย',
      },
      relatedSkillIds: [
        'expedition_command_forge',
        'pyramid_route_architect',
        'papyrus_instruction_workshop',
        'temple_rule_architect',
      ],
      sections: [
        {
          sectionId: 'prep',
          sectionLabel: { en: '1. Preparation', th: '1. การเตรียมตัว' },
          prompt: { en: 'Pack water and keep voices calm.', th: 'นำน้ำดื่มไปด้วยและเปิดโหมดเงียบ' },
          tiles: makeTiles('pb4_a2_p', [
            { value: 'Carry', role: 'verb' },
            { value: 'water', role: 'object' },
            { value: 'and', role: 'connector' },
            { value: 'a notebook', role: 'object' },
            { value: 'loud speaker', role: 'object', isDistractor: true },
          ]),
          acceptedPatterns: [/^carry\s+water\s+and\s+a\s+notebook$/i],
          canonicalLine: 'Carry water and a notebook.',
        },
        {
          sectionId: 'directions',
          sectionLabel: { en: '2. Directions', th: '2. การบอกทาง' },
          prompt: { en: 'Walk west from Gaza plaza to the temple gate.', th: 'เดินไปทางตะวันตกสู่ซุ้มประตูวิหาร' },
          tiles: makeTiles('pb4_a2_d', [
            { value: 'Walk', role: 'verb' },
            { value: 'west', role: 'prep' },
            { value: 'to the', role: 'prep' },
            { value: 'Temple Gate', role: 'object' },
            { value: 'away from camp forever', role: 'phrase', isDistractor: true },
          ]),
          acceptedPatterns: [/^walk\s+west\s+to\s+the\s+temple\s+gate$/i],
          canonicalLine: 'Walk west to the Temple Gate.',
        },
        {
          sectionId: 'sequence',
          sectionLabel: { en: '3. Sequence', th: '3. ลำดับขั้นตอน' },
          prompt: { en: 'First observe the sun disc, then meet Karim.', th: 'สังเกตจานสุริยันก่อน แล้วพบคาริม' },
          tiles: makeTiles('pb4_a2_s', [
            { value: 'First,', role: 'sequencer' },
            { value: 'view the sun disc,', role: 'phrase' },
            { value: 'then', role: 'sequencer' },
            { value: 'greet Karim', role: 'phrase' },
            { value: 'shout loudly', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [/^first(?:,)?\s+view\s+the\s+sun\s+disc(?:,)?\s+then\s+greet\s+karim$/i],
          canonicalLine: 'First, view the sun disc, then greet Karim.',
        },
        {
          sectionId: 'rule_check',
          sectionLabel: { en: '4. Rule & Check', th: '4. กฎและเช็กความเข้าใจ' },
          prompt: { en: 'Ask visitors politely to speak quietly.', th: 'ขอให้ผู้เข้าชมพูดเสียงเบาอย่างสุภาพ' },
          tiles: makeTiles('pb4_a2_r', [
            { value: 'Please', role: 'polite' },
            { value: 'speak quietly', role: 'phrase' },
            { value: 'near the', role: 'prep' },
            { value: 'columns', role: 'object' },
            { value: 'Shut up', role: 'negative', isDistractor: true },
          ]),
          acceptedPatterns: [/^please\s+speak\s+quietly\s+near\s+the\s+columns$/i],
          canonicalLine: 'Please speak quietly near the columns.',
        },
      ],
      thaiScaffold:
        '1) พกน้ำและสมุด 2) เดินตะวันตกสู่ประตูวิหาร 3) ดูจานสุริยันแล้วทักทายคาริม 4) กรุณาพูดเสียงเบาใกล้เสาวิหาร',
      hints: {
        tier1Structure: {
          en: 'Pack calm tools -> Walk west -> Sequenced viewing -> Polite sanctuary voice rule.',
          th: 'พกอุปกรณ์ -> เดินทิศตะวันตก -> ดูตามลำดับ -> กฎเสียงเบาสุภาพ',
        },
        tier2Focus: {
          en: 'Temple of the Sun is on the WEST side of the plateau!',
          th: 'วิหารแห่งดวงอาทิตย์อยู่ฝั่งตะวันตก ("west") ของลานสำรวจนะ',
        },
        tier3Scaffold: {
          en: 'Notice "Please speak quietly near the columns." replaces rude distractors.',
          th: 'ใช้ "Please speak quietly near the columns." แทนคำที่ห้วนเกินไป',
        },
      },
    },
    b1: {
      mode: 'b1',
      missionBrief: {
        en: 'Draft a B1 courtyard alignment plan combining level compass, west approach, ordered observation, and shadow-check rule.',
        th: 'เขียนแปลนจัดแนวแสงอาทิตย์ในลานวิหารระดับ B1 ครบ 4 หมวด',
      },
      relatedSkillIds: [
        'expedition_command_forge',
        'pyramid_route_architect',
        'papyrus_instruction_workshop',
        'temple_rule_architect',
      ],
      sections: [
        {
          sectionId: 'prep',
          sectionLabel: { en: '1. Preparation', th: '1. การเตรียมตัว' },
          prompt: { en: 'Pack your compass and sun hat safely.', th: 'เตรียมเข็มทิศและหมวกกันแดดให้พร้อม' },
          tiles: makeTiles('pb4_b1_p', [
            { value: 'Bring', role: 'verb' },
            { value: 'a level compass', role: 'object' },
            { value: 'and', role: 'connector' },
            { value: 'your sun hat', role: 'object' },
            { value: 'leave both behind', role: 'phrase', isDistractor: true },
          ]),
          acceptedPatterns: [/^bring\s+a\s+level\s+compass\s+and\s+your\s+sun\s+hat$/i],
          canonicalLine: 'Bring a level compass and your sun hat.',
        },
        {
          sectionId: 'directions',
          sectionLabel: { en: '2. Directions', th: '2. การบอกทาง' },
          prompt: { en: 'Head west between the lotus columns to Karim.', th: 'เดินตะวันตกระหว่างเสาบัวไปหาคาริม' },
          tiles: makeTiles('pb4_b1_d', [
            { value: 'Head west', role: 'verb' },
            { value: 'between the', role: 'prep' },
            { value: 'lotus columns', role: 'object' },
            { value: 'to', role: 'prep' },
            { value: 'Karim', role: 'object' },
            { value: 'over top of', role: 'prep', isDistractor: true },
          ]),
          acceptedPatterns: [/^head\s+west\s+between\s+the\s+lotus\s+columns\s+to\s+karim$/i],
          canonicalLine: 'Head west between the lotus columns to Karim.',
        },
        {
          sectionId: 'sequence',
          sectionLabel: { en: '3. Sequence', th: '3. ลำดับขั้นตอน' },
          prompt: { en: 'First observe column shadows, then log the angle.', th: 'สังเกตเงาเสาก่อน แล้วจดบันทึกมุม' },
          tiles: makeTiles('pb4_b1_s', [
            { value: 'First,', role: 'sequencer' },
            { value: 'observe the shadow,', role: 'phrase' },
            { value: 'then', role: 'sequencer' },
            { value: 'record the bearing', role: 'phrase' },
            { value: 'scratch the stone', role: 'phrase', isDistractor: true },
          ]),
          acceptedPatterns: [
            /^first(?:,)?\s+observe\s+the\s+shadow(?:,)?\s+then\s+record\s+the\s+bearing$/i,
          ],
          canonicalLine: 'First, observe the shadow, then record the bearing.',
        },
        {
          sectionId: 'rule_check',
          sectionLabel: { en: '4. Rule & Check', th: '4. กฎและเช็กความเข้าใจ' },
          prompt: { en: 'Include a polite non-touching rule & team check.', th: 'ใส่กฎห้ามแตะสลักหินอย่างสุภาพและเช็กคำถาม' },
          tiles: makeTiles('pb4_b1_r', [
            { value: 'Please do not', role: 'negative' },
            { value: 'touch pillars,', role: 'phrase' },
            { value: 'and', role: 'connector' },
            { value: 'confirm steps', role: 'phrase' },
            { value: 'with Karim', role: 'phrase' },
            { value: 'lean hard on', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [
            /^please\s+do\s+not\s+touch\s+pillars(?:,)?\s+and\s+confirm\s+steps\s+with\s+karim$/i,
          ],
          canonicalLine: 'Please do not touch pillars, and confirm steps with Karim.',
        },
      ],
      thaiScaffold:
        '1) นำเข็มทิศและหมวก 2) เดินตะวันตกระหว่างเสาบัว 3) สังเกตเงาแล้วบันทึกทิศ 4) กรุณาอย่าแตะเสาและยืนยันขั้นตอนกับคาริม',
      hints: {
        tier1Structure: {
          en: 'Bring gear -> Head west between columns -> First observe, then record -> Polite rule + confirm.',
          th: 'อุปกรณ์ -> เดินระหว่างเสา -> สังเกตก่อนจด -> กฎสุภาพและยืนยันขั้นตอน',
        },
        tier2Focus: {
          en: 'Watch "between the lotus columns"—never "over top of" ancient stone!',
          th: 'เดิน "between" (ระหว่างเสา) ไม่ใช่ "over top of" ด้านบนของเสานะ',
        },
        tier3Scaffold: {
          en: 'Complete each block smoothly before verifying the full blueprint.',
          th: 'เรียงคำให้สมบูรณ์ทั้ง 4 ส่วนก่อนกดตรวจคำตอบ',
        },
      },
    },
  },
  {
    challengeId: 'pb_5_northern_approach',
    order: 5,
    title: {
      en: 'Blueprint 5 · Northern Gate Approach',
      th: 'แปลนที่ 5 · แผนเดินทางสู่ประตูทิศเหนือ',
    },
    a2: {
      mode: 'a2',
      missionBrief: {
        en: 'Lead the team from Giza Plaza north toward the sealed Chamber of Wisdom forecourt.',
        th: 'นำทีมจากลานกีซามุ่งหน้าสู่ลานด้านหน้าประตูโถงแห่งปัญญา',
      },
      relatedSkillIds: [
        'expedition_command_forge',
        'pyramid_route_architect',
        'papyrus_instruction_workshop',
        'temple_rule_architect',
      ],
      sections: [
        {
          sectionId: 'prep',
          sectionLabel: { en: '1. Preparation', th: '1. การเตรียมตัว' },
          prompt: { en: 'Hold your expedition notebook ready.', th: 'เตรียมสมุดบันทึกให้พร้อม' },
          tiles: makeTiles('pb5_a2_p', [
            { value: 'Hold', role: 'verb' },
            { value: 'your', role: 'connector' },
            { value: 'notebook', role: 'object' },
            { value: 'ready', role: 'phrase' },
            { value: 'throw', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [/^hold\s+your\s+notebook\s+ready$/i],
          canonicalLine: 'Hold your notebook ready.',
        },
        {
          sectionId: 'directions',
          sectionLabel: { en: '2. Directions', th: '2. การบอกทาง' },
          prompt: { en: 'Walk straight north and stop outside the gate.', th: 'เดินตรงไปทิศเหนือแล้วหยุดหน้าประตูศิลา' },
          tiles: makeTiles('pb5_a2_d', [
            { value: 'Walk north', role: 'verb' },
            { value: 'and stop', role: 'verb' },
            { value: 'outside the', role: 'prep' },
            { value: 'sealed gate', role: 'object' },
            { value: 'push inside', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [/^walk\s+north\s+and\s+stop\s+outside\s+the\s+sealed\s+gate$/i],
          canonicalLine: 'Walk north and stop outside the sealed gate.',
        },
        {
          sectionId: 'sequence',
          sectionLabel: { en: '3. Sequence', th: '3. ลำดับขั้นตอน' },
          prompt: { en: 'First read carved glyphs, then compare notes.', th: 'อ่านสัญลักษณ์แกะสลักก่อน แล้วเทียบกับบันทึก' },
          tiles: makeTiles('pb5_a2_s', [
            { value: 'First,', role: 'sequencer' },
            { value: 'read the glyphs,', role: 'phrase' },
            { value: 'then', role: 'sequencer' },
            { value: 'check your notes', role: 'phrase' },
            { value: 'break locks', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [
            /^first(?:,)?\s+read\s+the\s+glyphs(?:,)?\s+then\s+check\s+your\s+notes$/i,
          ],
          canonicalLine: 'First, read the glyphs, then check your notes.',
        },
        {
          sectionId: 'rule_check',
          sectionLabel: { en: '4. Rule & Check', th: '4. กฎและเช็กความเข้าใจ' },
          prompt: { en: 'Remind everyone the Chamber remains sealed until later stages.', th: 'ย้ำว่าประตูยังคงปิดผนึกจนกว่าจะถึงด่านถัดไป' },
          tiles: makeTiles('pb5_a2_r', [
            { value: 'Do not', role: 'negative' },
            { value: 'push', role: 'verb' },
            { value: 'the sealed door', role: 'object' },
            { value: 'now', role: 'phrase' },
            { value: 'force open', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [/^(?:do not|don't)\s+push\s+the\s+sealed\s+door(?:\s+now)?$/i],
          canonicalLine: 'Do not push the sealed door now.',
        },
      ],
      thaiScaffold:
        '1) เตรียมสมุดให้พร้อม 2) เดินเหนือและหยุดหน้าประตู 3) อ่านจารึกแล้วเช็กบันทึก 4) อย่าดันประตูที่ปิดผนึก',
      hints: {
        tier1Structure: {
          en: 'Notebook ready -> Walk north & stop outside -> First read, then check -> Negative gate rule.',
          th: 'สมุดพร้อม -> เดินเหนือหยุดหน้าประตู -> อ่านก่อนเทียบ -> ข้อห้ามดันประตู',
        },
        tier2Focus: {
          en: 'The Chamber of Wisdom stays sealed—stop outside, do NOT push or break locks.',
          th: 'โถงแห่งปัญญายังคงปิดผนึก ต้องหยุดด้านนอกและห้ามดันประตู',
        },
        tier3Scaffold: {
          en: 'Check all 4 lines avoid "push inside", "break locks", and "force open".',
          th: 'ระวังคำหลอก: push inside, break locks, และ force open',
        },
      },
    },
    b1: {
      mode: 'b1',
      missionBrief: {
        en: 'Compose a B1 northern forecourt protocol balancing kit check, cautious approach, glyph logging, and sealed-door respect.',
        th: 'เขียนแปลนสำรวจลานประตูทิศเหนือระดับ B1 ครบทั้ง 4 หมวด',
      },
      relatedSkillIds: [
        'expedition_command_forge',
        'pyramid_route_architect',
        'papyrus_instruction_workshop',
        'temple_rule_architect',
      ],
      sections: [
        {
          sectionId: 'prep',
          sectionLabel: { en: '1. Preparation', th: '1. การเตรียมตัว' },
          prompt: { en: 'Check notebook, pencil, and water supply.', th: 'ตรวจสมุด ดินสอ และน้ำดื่มให้ครบ' },
          tiles: makeTiles('pb5_b1_p', [
            { value: 'Prepare', role: 'verb' },
            { value: 'your notebook,', role: 'object' },
            { value: 'pencil,', role: 'object' },
            { value: 'and water', role: 'object' },
            { value: 'drop gear', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [/^prepare\s+your\s+notebook(?:,)?\s+pencil(?:,)?\s+and\s+water$/i],
          canonicalLine: 'Prepare your notebook, pencil, and water.',
        },
        {
          sectionId: 'directions',
          sectionLabel: { en: '2. Directions', th: '2. การบอกทาง' },
          prompt: { en: 'Walk between guardian plinths and halt at the stairs.', th: 'เดินระหว่างแท่นผู้พิทักษ์และหยุดหน้าบันได' },
          tiles: makeTiles('pb5_b1_d', [
            { value: 'Walk', role: 'verb' },
            { value: 'between the plinths', role: 'phrase' },
            { value: 'and halt', role: 'verb' },
            { value: 'before the', role: 'prep' },
            { value: 'sealed stairs', role: 'object' },
            { value: 'rush into', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [
            /^walk\s+between\s+the\s+plinths\s+and\s+halt\s+before\s+the\s+sealed\s+stairs$/i,
          ],
          canonicalLine: 'Walk between the plinths and halt before the sealed stairs.',
        },
        {
          sectionId: 'sequence',
          sectionLabel: { en: '3. Sequence', th: '3. ลำดับขั้นตอน' },
          prompt: { en: 'First sketch door markings, then report to Dr. Layla.', th: 'สเกตช์สัญลักษณ์หน้าประตูก่อน แล้วรายงาน ดร.ไลลา' },
          tiles: makeTiles('pb5_b1_s', [
            { value: 'First,', role: 'sequencer' },
            { value: 'sketch the markings,', role: 'phrase' },
            { value: 'finally', role: 'sequencer' },
            { value: 'report to Dr. Layla', role: 'phrase' },
            { value: 'pry stones', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [
            /^first(?:,)?\s+sketch\s+the\s+markings(?:,)?\s+finally\s+report\s+to\s+dr\.?\s+layla$/i,
          ],
          canonicalLine: 'First, sketch the markings, finally report to Dr. Layla.',
        },
        {
          sectionId: 'rule_check',
          sectionLabel: { en: '4. Rule & Check', th: '4. กฎและเช็กความเข้าใจ' },
          prompt: { en: 'Confirm guests respect the closed threshold.', th: 'ขอให้ทุกคนเคารพเขตประตูที่ปิดผนึก' },
          tiles: makeTiles('pb5_b1_r', [
            { value: 'Please', role: 'polite' },
            { value: 'respect', role: 'verb' },
            { value: 'the', role: 'connector' },
            { value: 'sealed entrance', role: 'object' },
            { value: 'until stage four', role: 'phrase' },
            { value: 'unlock it now', role: 'phrase', isDistractor: true },
          ]),
          acceptedPatterns: [
            /^please\s+respect\s+the\s+sealed\s+entrance\s+until\s+stage\s+four$/i,
          ],
          canonicalLine: 'Please respect the sealed entrance until stage four.',
        },
      ],
      thaiScaffold:
        '1) เตรียมสมุด ดินสอ และน้ำ 2) เดินระหว่างแท่นหินและหยุดก่อนบันได 3) วาดลายแล้วรายงาน ดร.ไลลา 4) เคารพทางเข้าที่ปิดผนึก',
      hints: {
        tier1Structure: {
          en: 'Prepare kit -> Walk & halt safely -> First sketch, finally report -> Respect sealed entrance.',
          th: 'เตรียมของ -> เดินและหยุดหน้าบันได -> สเกตช์แล้วรายงาน -> เคารพประตูที่ปิด',
        },
        tier2Focus: {
          en: 'Remember the Chamber only opens in Stage 4 PERFORM—stay clear of "unlock it now".',
          th: 'ประตูโถงจะเปิดในด่านที่ 4 PERFORM อย่าเลือก "unlock it now"',
        },
        tier3Scaffold: {
          en: 'Assemble all four blocks in order before submitting.',
          th: 'ประกอบให้ครบทั้ง 4 ส่วนอย่างรอบคอบก่อนตรวจคำตอบ',
        },
      },
    },
  },
  {
    challengeId: 'pb_6_master_blueprint',
    order: 6,
    title: {
      en: "Blueprint 6 · The Pharaoh's Master Blueprint",
      th: 'แปลนที่ 6 · แปลนภารกิจหลักแห่งฟาโรห์',
    },
    a2: {
      mode: 'a2',
      missionBrief: {
        en: 'Synthesize everything you learned in BUILD into your official Expedition Assistant blueprint—complete Prep, Directions, Sequence, and Check!',
        th: 'รวมทักษะทั้งหมดจากด่าน BUILD สร้างแปลนฉบับสมบูรณ์ของผู้ช่วยคณะสำรวจครบ 4 หมวด',
      },
      relatedSkillIds: [
        'expedition_command_forge',
        'pyramid_route_architect',
        'papyrus_instruction_workshop',
        'temple_rule_architect',
      ],
      sections: [
        {
          sectionId: 'prep',
          sectionLabel: { en: '1. Preparation', th: '1. การเตรียมตัว' },
          prompt: { en: 'Pack essential exploration gear carefully.', th: 'จัดกระเป๋าแผนที่ เข็มทิศ และน้ำดื่ม' },
          tiles: makeTiles('pb6_a2_p', [
            { value: 'Pack', role: 'verb' },
            { value: 'your map,', role: 'object' },
            { value: 'compass,', role: 'object' },
            { value: 'and water', role: 'object' },
            { value: 'leave map behind', role: 'phrase', isDistractor: true },
          ]),
          acceptedPatterns: [/^pack\s+your\s+map(?:,)?\s+compass(?:,)?\s+and\s+water$/i],
          canonicalLine: 'Pack your map, compass, and water.',
        },
        {
          sectionId: 'directions',
          sectionLabel: { en: '2. Directions', th: '2. การบอกทาง' },
          prompt: { en: 'Guide the team past the Sphinx toward the north stairs.', th: 'นำทีมเดินผ่านสฟิงซ์ตรงสู่ประตูทิศเหนือ' },
          tiles: makeTiles('pb6_a2_d', [
            { value: 'Walk straight', role: 'verb' },
            { value: 'past the Sphinx', role: 'phrase' },
            { value: 'to the', role: 'prep' },
            { value: 'north gate', role: 'object' },
            { value: 'south river', role: 'object', isDistractor: true },
          ]),
          acceptedPatterns: [/^walk\s+straight\s+past\s+the\s+sphinx\s+to\s+the\s+north\s+gate$/i],
          canonicalLine: 'Walk straight past the Sphinx to the north gate.',
        },
        {
          sectionId: 'sequence',
          sectionLabel: { en: '3. Sequence', th: '3. ลำดับขั้นตอน' },
          prompt: { en: 'Outline observation first and briefing Dr. Layla last.', th: 'บันทึกหลักฐานก่อน แล้วสรุปให้ ดร.ไลลา' },
          tiles: makeTiles('pb6_a2_s', [
            { value: 'First,', role: 'sequencer' },
            { value: 'write your notes,', role: 'phrase' },
            { value: 'finally', role: 'sequencer' },
            { value: 'share with Dr. Layla', role: 'phrase' },
            { value: 'erase', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [
            /^first(?:,)?\s+write\s+your\s+notes(?:,)?\s+finally\s+share\s+with\s+dr\.?\s+layla$/i,
          ],
          canonicalLine: 'First, write your notes, finally share with Dr. Layla.',
        },
        {
          sectionId: 'rule_check',
          sectionLabel: { en: '4. Rule & Check', th: '4. กฎและเช็กความเข้าใจ' },
          prompt: { en: 'Close politely with care and an understanding check.', th: 'ปิดท้ายด้วยความระมัดระวังและการถามเช็กความเข้าใจ' },
          tiles: makeTiles('pb6_a2_r', [
            { value: 'Please', role: 'polite' },
            { value: 'stay safe,', role: 'phrase' },
            { value: 'and ask', role: 'verb' },
            { value: 'if you have questions', role: 'phrase' },
            { value: 'run ahead', role: 'verb', isDistractor: true },
          ]),
          acceptedPatterns: [
            /^please\s+stay\s+safe(?:,)?\s+and\s+ask\s+if\s+you\s+have\s+questions$/i,
          ],
          canonicalLine: 'Please stay safe, and ask if you have questions.',
        },
      ],
      thaiScaffold:
        '1) จัดแผนที่ เข็มทิศ และน้ำ 2) เดินตรงผ่านสฟิงซ์สู่ประตูเหนือ 3) จดบันทึกก่อนแล้วแบ่งปันกับ ดร.ไลลา 4) ดูแลความปลอดภัยและถามได้หากสงสัย',
      hints: {
        tier1Structure: {
          en: 'Your Master Blueprint unites all 4 expedition skills cleanly.',
          th: 'แปลนหลักผสานทักษะทั้ง 4 ด้านเข้าด้วยกันอย่างสมบูรณ์',
        },
        tier2Focus: {
          en: 'Open your Expedition Journal above anytime to compare earlier structures!',
          th: 'สามารถเปิดดูสมุดบันทึกคำสั่งเพื่อทบทวนโครงสร้างประโยคได้ตลอดเวลา',
        },
        tier3Scaffold: {
          en: 'Pack your map, compass, and water. / Walk straight past the Sphinx... / First, write... / Please stay safe...',
          th: 'แนวคำตอบ: Pack your map, compass, and water. / Walk straight past the Sphinx... / First, write... / Please stay safe...',
        },
      },
    },
    b1: {
      mode: 'b1',
      missionBrief: {
        en: 'Draft the highest-level B1 Pharaoh’s Master Blueprint—combining full readiness, multi-landmark directions, three-tier sequence, and polite conditional safety.',
        th: 'เขียนแปลนภารกิจหลักระดับ B1 ฉบับสมบูรณ์สูงสุดเพื่อพร้อมเข้าสู่ด่าน PRACTICE',
      },
      relatedSkillIds: [
        'expedition_command_forge',
        'pyramid_route_architect',
        'papyrus_instruction_workshop',
        'temple_rule_architect',
      ],
      sections: [
        {
          sectionId: 'prep',
          sectionLabel: { en: '1. Preparation', th: '1. การเตรียมตัว' },
          prompt: { en: 'Instruct teammates to secure kit before sunlight peaks.', th: 'สั่งเตรียมอุปกรณ์ให้เรียบร้อยก่อนออกภาคสนาม' },
          tiles: makeTiles('pb6_b1_p', [
            { value: 'First,', role: 'sequencer' },
            { value: 'pack your compass,', role: 'phrase' },
            { value: 'notebook,', role: 'object' },
            { value: 'and sun hat', role: 'object' },
            { value: 'leave water behind', role: 'phrase', isDistractor: true },
          ]),
          acceptedPatterns: [
            /^first(?:,)?\s+pack\s+your\s+compass(?:,)?\s+notebook(?:,)?\s+and\s+sun\s+hat$/i,
          ],
          canonicalLine: 'First, pack your compass, notebook, and sun hat.',
        },
        {
          sectionId: 'directions',
          sectionLabel: { en: '2. Directions', th: '2. การบอกทาง' },
          prompt: { en: 'Direct them past the Sphinx and stop at the Wisdom steps.', th: 'เดินผ่านสฟิงซ์แล้วหยุดที่หน้าบันไดโถงแห่งปัญญา' },
          tiles: makeTiles('pb6_b1_d', [
            { value: 'Walk north', role: 'verb' },
            { value: 'past the Sphinx,', role: 'phrase' },
            { value: 'and stop', role: 'verb' },
            { value: 'outside the', role: 'prep' },
            { value: 'Chamber steps', role: 'object' },
            { value: 'cross the river', role: 'phrase', isDistractor: true },
          ]),
          acceptedPatterns: [
            /^walk\s+north\s+past\s+the\s+sphinx(?:,)?\s+and\s+stop\s+outside\s+the\s+chamber\s+steps$/i,
          ],
          canonicalLine: 'Walk north past the Sphinx, and stop outside the Chamber steps.',
        },
        {
          sectionId: 'sequence',
          sectionLabel: { en: '3. Sequence', th: '3. ลำดับขั้นตอน' },
          prompt: { en: 'Sketch carved clues first, then verify findings with Dr. Layla.', th: 'วาดภาพจารึกก่อน แล้วตรวจทานร่วมกับ ดร.ไลลา' },
          tiles: makeTiles('pb6_b1_s', [
            { value: 'Next,', role: 'sequencer' },
            { value: 'sketch the clues,', role: 'phrase' },
            { value: 'and then', role: 'sequencer' },
            { value: 'verify with Dr. Layla', role: 'phrase' },
            { value: 'guess silently', role: 'phrase', isDistractor: true },
          ]),
          acceptedPatterns: [
            /^next(?:,)?\s+sketch\s+the\s+clues(?:,)?\s+and\s+then\s+verify\s+with\s+dr\.?\s+layla$/i,
          ],
          canonicalLine: 'Next, sketch the clues, and then verify with Dr. Layla.',
        },
        {
          sectionId: 'rule_check',
          sectionLabel: { en: '4. Rule & Check', th: '4. กฎและเช็กความเข้าใจ' },
          prompt: { en: 'Include heritage care, shade check, and Q&A prompt.', th: 'รวมกฎอนุรักษ์ การพักในร่ม และการเช็กคำถาม' },
          tiles: makeTiles('pb6_b1_r', [
            { value: 'Please do not', role: 'negative' },
            { value: 'touch carvings,', role: 'phrase' },
            { value: 'rest if dizzy,', role: 'phrase' },
            { value: 'and confirm', role: 'verb' },
            { value: 'all steps clearly', role: 'phrase' },
            { value: 'ignore guests', role: 'phrase', isDistractor: true },
          ]),
          acceptedPatterns: [
            /^please\s+do\s+not\s+touch\s+carvings(?:,)?\s+rest\s+if\s+dizzy(?:,)?\s+and\s+confirm\s+all\s+steps\s+clearly$/i,
          ],
          canonicalLine: 'Please do not touch carvings, rest if dizzy, and confirm all steps clearly.',
        },
      ],
      thaiScaffold:
        '1) เตรียมเข็มทิศ สมุด และหมวก 2) เดินเหนือผ่านสฟิงซ์หยุดหน้าบันไดโถง 3) สเกตช์เบาะแสแล้วตรวจสอบกับ ดร.ไลลา 4) ห้ามแตะภาพสลัก พักหากเวียนศีรษะ และยืนยันทุกขั้นตอน',
      hints: {
        tier1Structure: {
          en: 'Complete all 4 B1 master blueprint lines: Prep -> North route -> Ordered verification -> Rule & check.',
          th: 'ประกอบให้ครบ 4 ส่วน: เตรียมของ -> ทางทิศเหนือ -> ลำดับตรวจสอบ -> กฎและเช็กความเข้าใจ',
        },
        tier2Focus: {
          en: 'Avoid unsafe distractors ("leave water behind", "cross the river", "guess silently", "ignore guests").',
          th: 'ระวังคำหลอก: leave water behind, cross the river, guess silently, และ ignore guests',
        },
        tier3Scaffold: {
          en: 'Finish every panel cleanly to earn your Expedition Assistant promotion!',
          th: 'ประกอบครบทุกหมวดเพื่อรับตำแหน่งผู้ช่วยคณะสำรวจอย่างเป็นทางการ!',
        },
      },
    },
  },
];

export function validatePharaohBlueprintSubmission(
  variant: PharaohBlueprintVariant,
  sectionTileSelections: Record<string, string[]>,
): {
  isCorrect: boolean;
  lines: string[];
  joinedText: string;
  sectionResults: Record<string, { isCorrect: boolean; sentence: string }>;
  feedback: LocalizedText;
} {
  const lines: string[] = [];
  const sectionResults: Record<string, { isCorrect: boolean; sentence: string }> = {};
  const failedLabels: string[] = [];

  for (const sec of variant.sections) {
    const rawValues = sectionTileSelections[sec.sectionId] ?? [];
    const sentence = joinNormalizedTiles(rawValues);
    const ok =
      rawValues.length >= 2 &&
      matchesAuthoredPatterns(sentence, sec.acceptedPatterns);
    sectionResults[sec.sectionId] = { isCorrect: ok, sentence };
    if (sentence) lines.push(sentence);
    if (!ok) {
      failedLabels.push(sec.sectionLabel.en);
    }
  }

  const joinedText = lines.join(' ');
  if (failedLabels.length > 0) {
    return {
      isCorrect: false,
      lines,
      joinedText,
      sectionResults,
      feedback: {
        en: `Check blueprint section(s): ${failedLabels.join(', ')}. Ensure every required section has complete, grammatical English instructions.`,
        th: `กรุณาตรวจสอบแปลนในหมวดที่ยังไม่สมบูรณ์ให้ถูกต้องครบทุกข้อก่อนบันทึกแปลนหลัก`,
      },
    };
  }

  return {
    isCorrect: true,
    lines,
    joinedText,
    sectionResults,
    feedback: {
      en: "Master Blueprint approved! Your complete expedition plan is archived in My Expedition Instructions.",
      th: 'อนุมัติแปลนภารกิจหลัก! แผนสำรวจฉบับสมบูรณ์ถูกบันทึกลงสมุดคำสั่งของคุณแล้ว',
    },
  };
}
