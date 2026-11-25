import type { LocalizedText } from '../types/game';
import {
  joinNormalizedTiles,
  matchesAuthoredPatterns,
  normalizeEnglishSentenceForCheck,
  type ArchitectBoardLandmark,
  type ArchitectSimulationResult,
  type ArchitectSimulationStep,
  type BuildTile,
  type CommandForgeChallengeBundle,
  type CommandForgeChallengeVariant,
  type PapyrusWorkshopChallengeBundle,
  type PapyrusWorkshopVariant,
  type RouteArchitectChallengeBundle,
  type RouteArchitectVariant,
  type RouteDirectionKind,
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
// GAME 1 — EXPEDITION COMMAND FORGE (6 A2 + 6 B1)
// ============================================================================

export const EXPEDITION_COMMAND_FORGE_CHALLENGES: CommandForgeChallengeBundle[] = [
  {
    challengeId: 'ec_1_simple_imperative',
    order: 1,
    title: {
      en: 'Simple Imperative · Compass',
      th: 'คำสั่งพื้นฐาน · เข็มทิศ',
    },
    a2: {
      mode: 'a2',
      goalSummary: {
        en: 'Instruct a teammate to put the compass inside the backpack before leaving camp.',
        th: 'สั่งให้เพื่อนร่วมทีมเก็บเข็มทิศลงในกระเป๋าเป้ก่อนออกจากค่าย',
      },
      targetOutcomeEn: 'Action Goal: Compass safely packed inside the expedition backpack.',
      targetOutcomeTh: 'เป้าหมาย: เข็มทิศถูกเก็บไว้ในกระเป๋าสำรวจอย่างเรียบร้อย',
      actionDemoKey: 'pack_compass',
      highlightedItems: ['compass', 'backpack'],
      tiles: makeTiles('ec1_a2', [
        { value: 'Pack', role: 'verb' },
        { value: 'Put', role: 'verb' },
        { value: 'the', role: 'connector' },
        { value: 'compass', role: 'object' },
        { value: 'in', role: 'prep' },
        { value: 'your', role: 'connector' },
        { value: 'backpack', role: 'object' },
        { value: 'camera', role: 'object', isDistractor: true },
        { value: 'Do not', role: 'negative', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^(?:pack|put)\s+the\s+compass\s+in\s+(?:your|the)\s+backpack$/i,
        /^(?:pack|put)\s+(?:your|the)\s+compass$/i,
      ],
      canonicalModel: 'Pack the compass in your backpack.',
      thaiScaffold: 'เก็บเข็มทิศใส่กระเป๋าเป้ของคุณ',
      diagnosticChecks: {
        negativeForbidden: true,
        mustStartWithAnyVerb: ['pack', 'put'],
      },
      hints: {
        tier1Structure: {
          en: 'Structure: [Base Verb] + [the + item] + [in your + bag].',
          th: 'โครงสร้าง: [กริยาช่อง 1] + [the + สิ่งของ] + [in your + กระเป๋า]',
        },
        tier2Focus: {
          en: 'Start directly with "Pack" or "Put", then name the compass and where it goes.',
          th: 'ขึ้นต้นด้วยคำว่า "Pack" หรือ "Put" ตามด้วย compass และตำแหน่งในกระเป๋าเป้',
        },
        tier3Scaffold: {
          en: 'Model frame: "Pack the ___ in your ___."',
          th: 'กรอบคำตอบ: "Pack the ___ in your ___."',
        },
      },
    },
    b1: {
      mode: 'b1',
      goalSummary: {
        en: 'Give a precise desert readiness command to pack the compass securely inside the front pocket.',
        th: 'ออกคำสั่งให้เก็บเข็มทิศไว้ในช่องหน้าของกระเป๋าเป้อย่างปลอดภัยก่อนออกเดินทาง',
      },
      targetOutcomeEn: 'Action Goal: Compass secured inside the front backpack pocket.',
      targetOutcomeTh: 'เป้าหมาย: เข็มทิศอยู่ในช่องด้านหน้าของกระเป๋าเป้อย่างปลอดภัย',
      actionDemoKey: 'pack_compass',
      highlightedItems: ['compass', 'backpack'],
      tiles: makeTiles('ec1_b1', [
        { value: 'Pack', role: 'verb' },
        { value: 'Place', role: 'verb' },
        { value: 'the', role: 'connector' },
        { value: 'compass', role: 'object' },
        { value: 'inside', role: 'prep' },
        { value: 'the', role: 'connector' },
        { value: 'front pocket', role: 'phrase' },
        { value: 'before we leave', role: 'condition' },
        { value: 'water bottle', role: 'object', isDistractor: true },
        { value: 'Avoid', role: 'negative', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^(?:pack|place)\s+the\s+compass\s+inside\s+the\s+front\s+pocket(?:\s+before\s+we\s+leave)?$/i,
      ],
      canonicalModel: 'Place the compass inside the front pocket before we leave.',
      thaiScaffold: 'วางเข็มทิศไว้ในช่องหน้าก่อนที่เราจะออกเดินทาง',
      diagnosticChecks: {
        negativeForbidden: true,
        mustStartWithAnyVerb: ['pack', 'place'],
      },
      hints: {
        tier1Structure: {
          en: 'Notice there are two "the" tiles: [Verb] + the + item + inside + the + pocket + time clause.',
          th: 'สังเกตว่ามี "the" 2 ชิ้น: [กริยา] + the + สิ่งของ + inside + the + ช่องหน้า + เวลา',
        },
        tier2Focus: {
          en: 'Use "Place" or "Pack" first, then "the compass inside the front pocket".',
          th: 'เริ่มด้วย "Place" หรือ "Pack" แล้วตามด้วย "the compass inside the front pocket"',
        },
        tier3Scaffold: {
          en: 'Model frame: "Place the compass inside the ___ before we leave."',
          th: 'กรอบคำตอบ: "Place the compass inside the ___ before we leave."',
        },
      },
    },
  },
  {
    challengeId: 'ec_2_verb_object_prep',
    order: 2,
    title: {
      en: 'Verb + Object + Place · Notebook',
      th: 'กริยา + กรรม + สถานที่ · สมุดบันทึก',
    },
    a2: {
      mode: 'a2',
      goalSummary: {
        en: 'Tell a partner to put the expedition notebook on the wooden map table.',
        th: 'บอกเพื่อนให้วางสมุดบันทึกสำรวจลงบนโต๊ะแผนที่ไม้',
      },
      targetOutcomeEn: 'Action Goal: Notebook resting on the expedition map table.',
      targetOutcomeTh: 'เป้าหมาย: สมุดบันทึกวางอยู่บนโต๊ะแผนที่',
      actionDemoKey: 'open_notebook',
      highlightedItems: ['notebook', 'map'],
      tiles: makeTiles('ec2_a2', [
        { value: 'Put', role: 'verb' },
        { value: 'the', role: 'connector' },
        { value: 'notebook', role: 'object' },
        { value: 'on', role: 'prep' },
        { value: 'the', role: 'connector' },
        { value: 'map table', role: 'phrase' },
        { value: 'under', role: 'prep', isDistractor: true },
        { value: 'sun hat', role: 'object', isDistractor: true },
      ]),
      acceptedPatterns: [/^put\s+the\s+notebook\s+on\s+the\s+map\s+table$/i],
      canonicalModel: 'Put the notebook on the map table.',
      thaiScaffold: 'วางสมุดบันทึกไว้บนโต๊ะแผนที่',
      diagnosticChecks: {
        negativeForbidden: true,
        mustStartWithAnyVerb: ['put'],
      },
      hints: {
        tier1Structure: {
          en: 'Use [Verb] + [the + object] + [on] + [the + place].',
          th: 'ใช้ [กริยา] + [the + สิ่งของ] + [on] + [the + สถานที่]',
        },
        tier2Focus: {
          en: 'Choose "on" (not "under") to place the notebook onto the table.',
          th: 'เลือกคำว่า "on" (ไม่ใช่ "under") เพื่อให้วางบนโต๊ะ',
        },
        tier3Scaffold: {
          en: 'Model frame: "Put the ___ on the ___."',
          th: 'กรอบคำตอบ: "Put the ___ on the ___."',
        },
      },
    },
    b1: {
      mode: 'b1',
      goalSummary: {
        en: 'Instruct the team to set the field notebook beside the rolled plateau map for quick notes.',
        th: 'สั่งให้วางสมุดบันทึกภาคสนามไว้ข้างแผนที่ม้วนเพื่อความสะดวกในการจดบันทึก',
      },
      targetOutcomeEn: 'Action Goal: Notebook positioned neatly beside the plateau map.',
      targetOutcomeTh: 'เป้าหมาย: สมุดบันทึกวางเรียบร้อยข้างแผนที่ที่ราบสูง',
      actionDemoKey: 'open_notebook',
      highlightedItems: ['notebook', 'map', 'pencil'],
      tiles: makeTiles('ec2_b1', [
        { value: 'Set', role: 'verb' },
        { value: 'the', role: 'connector' },
        { value: 'field notebook', role: 'object' },
        { value: 'beside', role: 'prep' },
        { value: 'the', role: 'connector' },
        { value: 'plateau map', role: 'phrase' },
        { value: 'for quick notes', role: 'phrase' },
        { value: 'Do not', role: 'negative', isDistractor: true },
        { value: 'behind', role: 'prep', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^set\s+the\s+field\s+notebook\s+beside\s+the\s+plateau\s+map(?:\s+for\s+quick\s+notes)?$/i,
      ],
      canonicalModel: 'Set the field notebook beside the plateau map for quick notes.',
      thaiScaffold: 'วางสมุดบันทึกไว้ข้างแผนที่ที่ราบสูงเพื่อจดบันทึกอย่างรวดเร็ว',
      diagnosticChecks: {
        negativeForbidden: true,
        mustStartWithAnyVerb: ['set'],
      },
      hints: {
        tier1Structure: {
          en: 'Structure: [Verb] + [the + item] + [beside + the + target] + [purpose].',
          th: 'โครงสร้าง: [กริยา] + [สิ่งของ] + [beside + เป้าหมาย] + [จุดประสงค์]',
        },
        tier2Focus: {
          en: 'Start with "Set", and pair "beside" with "the plateau map".',
          th: 'ขึ้นต้นด้วย "Set" และจับคู่ "beside" กับ "the plateau map"',
        },
        tier3Scaffold: {
          en: 'Model frame: "Set the field notebook beside the ___ for quick notes."',
          th: 'กรอบคำตอบ: "Set the field notebook beside the ___ for quick notes."',
        },
      },
    },
  },
  {
    challengeId: 'ec_3_negative_imperative',
    order: 3,
    title: {
      en: 'Negative Command · Camera Protection',
      th: 'คำสั่งห้าม · การดูแลกล้องถ่ายภาพ',
    },
    a2: {
      mode: 'a2',
      goalSummary: {
        en: 'Warn a friend NOT to leave the camera in direct desert sun.',
        th: 'เตือนเพื่อนว่าอย่าทิ้งกล้องไว้กลางแดดจัด',
      },
      targetOutcomeEn: 'Action Goal: Camera kept shaded and protected from heat.',
      targetOutcomeTh: 'เป้าหมาย: เก็บกล้องให้พ้นแสงแดดจัด',
      actionDemoKey: 'ban_camera',
      highlightedItems: ['camera'],
      tiles: makeTiles('ec3_a2', [
        { value: 'Do not', role: 'negative' },
        { value: 'leave', role: 'verb' },
        { value: 'the', role: 'connector' },
        { value: 'camera', role: 'object' },
        { value: 'in', role: 'prep' },
        { value: 'the', role: 'connector' },
        { value: 'sun', role: 'object' },
        { value: 'Put', role: 'verb', isDistractor: true },
        { value: 'notebook', role: 'object', isDistractor: true },
      ]),
      acceptedPatterns: [/^(?:do not|don't)\s+leave\s+the\s+camera\s+in\s+the\s+sun$/i],
      canonicalModel: 'Do not leave the camera in the sun.',
      thaiScaffold: 'อย่าทิ้งกล้องไว้กลางแดด',
      diagnosticChecks: {
        requiresNegative: true,
      },
      hints: {
        tier1Structure: {
          en: 'Negative imperative starts with [Do not] + [base verb] + [object] + [place].',
          th: 'คำสั่งห้ามเริ่มด้วย [Do not] + [กริยาช่อง 1] + [กรรม] + [สถานที่]',
        },
        tier2Focus: {
          en: 'Place "Do not" first, then "leave the camera in the sun".',
          th: 'วาง "Do not" ไว้หน้าสุด แล้วต่อด้วย "leave the camera in the sun"',
        },
        tier3Scaffold: {
          en: 'Model frame: "Do not ___ the camera in the ___."',
          th: 'กรอบคำตอบ: "Do not ___ the camera in the ___."',
        },
      },
    },
    b1: {
      mode: 'b1',
      goalSummary: {
        en: 'Write a clear warning telling researchers not to expose the camera lens to blowing sand.',
        th: 'เขียนคำเตือนให้นักวิจัยไม่เปิดหน้าเลนส์กล้องทิ้งไว้กลางลมทราย',
      },
      targetOutcomeEn: 'Action Goal: Camera lens shielded from desert sand.',
      targetOutcomeTh: 'เป้าหมาย: ป้องกันหน้าเลนส์กล้องจากทรายที่พัดมา',
      actionDemoKey: 'ban_camera',
      highlightedItems: ['camera'],
      tiles: makeTiles('ec3_b1', [
        { value: "Don't", role: 'negative' },
        { value: 'expose', role: 'verb' },
        { value: 'the', role: 'connector' },
        { value: 'camera lens', role: 'object' },
        { value: 'to', role: 'prep' },
        { value: 'blowing sand', role: 'phrase' },
        { value: 'near the dunes', role: 'phrase' },
        { value: 'Pack', role: 'verb', isDistractor: true },
        { value: 'inside', role: 'prep', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^(?:don't|do not)\s+expose\s+the\s+camera\s+lens\s+to\s+blowing\s+sand(?:\s+near\s+the\s+dunes)?$/i,
      ],
      canonicalModel: "Don't expose the camera lens to blowing sand near the dunes.",
      thaiScaffold: 'อย่าให้เลนส์กล้องสัมผัสทรายที่พัดปลิวใกล้เนินทราย',
      diagnosticChecks: {
        requiresNegative: true,
      },
      hints: {
        tier1Structure: {
          en: 'Use [Don’t] + [base verb] + [the + camera lens] + [to + blowing sand].',
          th: 'ใช้ [Don’t] + [กริยาช่อง 1] + [the + camera lens] + [to + blowing sand]',
        },
        tier2Focus: {
          en: 'Keep "expose" directly after "Don’t", then use "to" before "blowing sand".',
          th: 'วาง "expose" ต่อจาก "Don’t" แล้วใช้ "to" หน้า "blowing sand"',
        },
        tier3Scaffold: {
          en: 'Model frame: "Don’t expose the camera lens to ___."',
          th: 'กรอบคำตอบ: "Don’t expose the camera lens to ___."',
        },
      },
    },
  },
  {
    challengeId: 'ec_4_two_step_prep',
    order: 4,
    title: {
      en: 'Two-Step Prep · Water & Sun Hat',
      th: 'การเตรียมพร้อม 2 ขั้นตอน · น้ำดื่มและหมวกกันแดด',
    },
    a2: {
      mode: 'a2',
      goalSummary: {
        en: 'Tell an explorer to bring a water bottle first and then wear a sun hat.',
        th: 'บอกให้นักสำรวจนำขวดน้ำมาก่อน แล้วจึงสวมหมวกกันแดด',
      },
      targetOutcomeEn: 'Action Goal: Explorer hydrated with water and shaded by a hat.',
      targetOutcomeTh: 'เป้าหมาย: นักสำรวจเตรียมน้ำดื่มและสวมหมวกพร้อมลุยแดด',
      actionDemoKey: 'prep_water_hat',
      highlightedItems: ['water_bottle', 'sun_hat'],
      tiles: makeTiles('ec4_a2', [
        { value: 'First', role: 'sequencer' },
        { value: 'bring', role: 'verb' },
        { value: 'a water bottle,', role: 'object' },
        { value: 'and', role: 'connector' },
        { value: 'then', role: 'sequencer' },
        { value: 'wear', role: 'verb' },
        { value: 'a sun hat', role: 'object' },
        { value: 'Do not', role: 'negative', isDistractor: true },
        { value: 'compass', role: 'object', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^first\s+bring\s+a\s+water\s+bottle(?:,)?\s+(?:and\s+)?then\s+wear\s+a\s+sun\s+hat$/i,
      ],
      canonicalModel: 'First bring a water bottle, and then wear a sun hat.',
      thaiScaffold: 'อันดับแรกเตรียมขวดน้ำ แล้วค่อยสวมหมวกกันแดด',
      diagnosticChecks: {
        negativeForbidden: true,
        pairOrderCheck: {
          firstMustPrecedesSecond: [/bring\s+a\s+water\s+bottle/i, /wear\s+a\s+sun\s+hat/i],
          wrongOrderFeedback: {
            en: 'Check the sequence! Put the water bottle step first ("First bring...") and the sun hat step second ("then wear...").',
            th: 'ลองเช็กลำดับขั้นตอน! ให้นำขวดน้ำมาก่อน ("First bring...") แล้วค่อยสวมหมวก ("then wear...")',
          },
        },
      },
      hints: {
        tier1Structure: {
          en: 'Structure: First + [action 1], and then + [action 2].',
          th: 'โครงสร้าง: First + [ขั้นตอนที่ 1], and then + [ขั้นตอนที่ 2]',
        },
        tier2Focus: {
          en: 'Action 1 is "bring a water bottle," and Action 2 is "wear a sun hat".',
          th: 'ขั้นตอนที่ 1 คือ "bring a water bottle," และขั้นตอนที่ 2 คือ "wear a sun hat"',
        },
        tier3Scaffold: {
          en: 'Model frame: "First bring ___, and then wear ___."',
          th: 'กรอบคำตอบ: "First bring ___, and then wear ___."',
        },
      },
    },
    b1: {
      mode: 'b1',
      goalSummary: {
        en: 'Give a two-step desert prep instruction: fill a reusable bottle first, then secure a wide sun hat.',
        th: 'สั่งเตรียมตัว 2 ขั้นตอน: เติมน้ำใส่ขวดก่อน จากนั้นสวมหมวกปีกกว้างให้กระชับ',
      },
      targetOutcomeEn: 'Action Goal: Reusable bottle filled first; wide sun hat worn securely.',
      targetOutcomeTh: 'เป้าหมาย: เติมน้ำเต็มขวดก่อนแล้วสวมหมวกกันแดดอย่างกระชับ',
      actionDemoKey: 'prep_water_hat',
      highlightedItems: ['water_bottle', 'sun_hat'],
      tiles: makeTiles('ec4_b1', [
        { value: 'First,', role: 'sequencer' },
        { value: 'fill', role: 'verb' },
        { value: 'your water bottle,', role: 'object' },
        { value: 'next', role: 'sequencer' },
        { value: 'put on', role: 'verb' },
        { value: 'a wide sun hat', role: 'object' },
        { value: 'for midday shade', role: 'phrase' },
        { value: 'Finally,', role: 'sequencer', isDistractor: true },
        { value: 'drop', role: 'verb', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^first(?:,)?\s+fill\s+your\s+water\s+bottle(?:,)?\s+next\s+put\s+on\s+a\s+wide\s+sun\s+hat(?:\s+for\s+midday\s+shade)?$/i,
      ],
      canonicalModel: 'First, fill your water bottle, next put on a wide sun hat for midday shade.',
      thaiScaffold: 'ขั้นแรกเติมน้ำในขวดของคุณ ต่อมาสวมหมวกปีกกว้างเพื่อกันแดดช่วงเที่ยง',
      diagnosticChecks: {
        negativeForbidden: true,
        pairOrderCheck: {
          firstMustPrecedesSecond: [/fill\s+your\s+water\s+bottle/i, /put\s+on\s+a\s+wide\s+sun\s+hat/i],
          wrongOrderFeedback: {
            en: 'Put "fill your water bottle" after "First,", followed by "next put on a wide sun hat".',
            th: 'วาง "fill your water bottle" หลัง "First," แล้วค่อยต่อด้วย "next put on a wide sun hat"',
          },
        },
      },
      hints: {
        tier1Structure: {
          en: 'Pair "First," + water instruction, then "next" + sun hat instruction.',
          th: 'จับคู่ "First," + คำสั่งเรื่องน้ำ แล้วตามด้วย "next" + คำสั่งเรื่องหมวก',
        },
        tier2Focus: {
          en: 'Do not start with "Finally,"—start with "First," and link with "next".',
          th: 'อย่าขึ้นต้นด้วย "Finally," ให้เริ่มด้วย "First," แล้วเชื่อมด้วย "next"',
        },
        tier3Scaffold: {
          en: 'Model frame: "First, fill ___, next put on ___ for midday shade."',
          th: 'กรอบคำตอบ: "First, fill ___, next put on ___ for midday shade."',
        },
      },
    },
  },
  {
    challengeId: 'ec_5_careful_object',
    order: 5,
    title: {
      en: 'Caution & Care · Fragile Finds',
      th: 'ความระมัดระวัง · โบราณวัตถุเปราะบาง',
    },
    a2: {
      mode: 'a2',
      goalSummary: {
        en: 'Tell the team to hold the ancient clay jar gently and never drop it.',
        th: 'บอกให้ทีมถือไหดินเผาโบราณอย่างเบามือ',
      },
      targetOutcomeEn: 'Action Goal: Fragile clay artifact held carefully with both hands.',
      targetOutcomeTh: 'เป้าหมาย: จับถือโบราณวัตถุอย่างทะนุถนอม',
      actionDemoKey: 'protect_fragile',
      highlightedItems: ['backpack'],
      tiles: makeTiles('ec5_a2', [
        { value: 'Hold', role: 'verb' },
        { value: 'the', role: 'connector' },
        { value: 'clay jar', role: 'object' },
        { value: 'gently', role: 'phrase' },
        { value: 'with', role: 'prep' },
        { value: 'both hands', role: 'phrase' },
        { value: 'shake', role: 'verb', isDistractor: true },
        { value: 'quickly', role: 'phrase', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^hold\s+the\s+clay\s+jar\s+gently(?:\s+with\s+both\s+hands)?$/i,
      ],
      canonicalModel: 'Hold the clay jar gently with both hands.',
      thaiScaffold: 'ถือไหดินเผาอย่างเบามือด้วยมือทั้งสองข้าง',
      diagnosticChecks: {
        negativeForbidden: true,
        mustStartWithAnyVerb: ['hold'],
      },
      hints: {
        tier1Structure: {
          en: 'Structure: [Careful verb] + [the + object] + [manner adverb] + [with both hands].',
          th: 'โครงสร้าง: [กริยาอย่างระมัดระวัง] + [สิ่งของ] + [กริยาวิเศษณ์] + [ด้วยสองมือ]',
        },
        tier2Focus: {
          en: 'Choose "Hold" and "gently" (avoid careless words like "shake" or "quickly").',
          th: 'เลือกคำว่า "Hold" และ "gently" เพื่อเน้นความระมัดระวัง',
        },
        tier3Scaffold: {
          en: 'Model frame: "Hold the clay jar ___ with ___."',
          th: 'กรอบคำตอบ: "Hold the clay jar ___ with ___."',
        },
      },
    },
    b1: {
      mode: 'b1',
      goalSummary: {
        en: 'Write an artifact safety instruction combining "handle with care" and keeping it off dusty ground.',
        th: 'เขียนคำสั่งดูแลโบราณวัตถุให้จับอย่างระมัดระวังและไม่วางบนพื้นฝุ่น',
      },
      targetOutcomeEn: 'Action Goal: Fragile piece handled gently and kept off dusty ground.',
      targetOutcomeTh: 'เป้าหมาย: จัดการวัตถุโบราณอย่างนุ่มนวลและห่างจากพื้นฝุ่น',
      actionDemoKey: 'protect_fragile',
      highlightedItems: ['notebook', 'backpack'],
      tiles: makeTiles('ec5_b1', [
        { value: 'Handle', role: 'verb' },
        { value: 'every relic', role: 'object' },
        { value: 'with care', role: 'phrase' },
        { value: 'and', role: 'connector' },
        { value: 'keep', role: 'verb' },
        { value: 'it', role: 'connector' },
        { value: 'off the dusty ground', role: 'phrase' },
        { value: 'throw', role: 'verb', isDistractor: true },
        { value: 'into the water', role: 'phrase', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^handle\s+every\s+relic\s+with\s+care\s+and\s+keep\s+it\s+off\s+the\s+dusty\s+ground$/i,
      ],
      canonicalModel: 'Handle every relic with care and keep it off the dusty ground.',
      thaiScaffold: 'จับโบราณวัตถุทุกชิ้นด้วยความระมัดระวัง และอย่าให้สัมผัสพื้นที่มีฝุ่น',
      diagnosticChecks: {
        mustStartWithAnyVerb: ['handle'],
      },
      hints: {
        tier1Structure: {
          en: 'Join two balanced imperatives with "and": Handle [object] with care + and + keep [it] [where].',
          th: 'เชื่อมคำสั่ง 2 ชุดด้วย "and": Handle [สิ่งของ] with care + and + keep it [ตำแหน่ง]',
        },
        tier2Focus: {
          en: 'Start with "Handle every relic with care", then add "and keep it off the dusty ground".',
          th: 'ขึ้นด้วย "Handle every relic with care" แล้วต่อด้วย "and keep it off the dusty ground"',
        },
        tier3Scaffold: {
          en: 'Model frame: "Handle ___ with care and keep it ___."',
          th: 'กรอบคำตอบ: "Handle ___ with care and keep it ___."',
        },
      },
    },
  },
  {
    challengeId: 'ec_6_multi_action',
    order: 6,
    title: {
      en: 'Multi-Action Pack · Map & Pencil',
      th: 'คำสั่งหลายขั้นตอน · แผนที่และดินสอ',
    },
    a2: {
      mode: 'a2',
      goalSummary: {
        en: 'Give a complete 3-part briefing: open the map, grab a pencil, and write your name.',
        th: 'สั่ง 3 ขั้นตอนต่อเนื่อง: กางแผนที่ หยิบดินสอ และเขียนชื่อของคุณ',
      },
      targetOutcomeEn: 'Action Goal: Map opened, pencil ready, and team name recorded.',
      targetOutcomeTh: 'เป้าหมาย: กางแผนที่ หยิบดินสอ และลงชื่อเรียบร้อย',
      actionDemoKey: 'pair_map_pencil',
      highlightedItems: ['map', 'pencil', 'notebook'],
      tiles: makeTiles('ec6_a2', [
        { value: 'Open', role: 'verb' },
        { value: 'the map,', role: 'object' },
        { value: 'take', role: 'verb' },
        { value: 'a pencil,', role: 'object' },
        { value: 'and', role: 'connector' },
        { value: 'write', role: 'verb' },
        { value: 'your name', role: 'object' },
        { value: 'close', role: 'verb', isDistractor: true },
        { value: 'Do not', role: 'negative', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^open\s+the\s+map(?:,)?\s+take\s+a\s+pencil(?:,)?\s+and\s+write\s+your\s+name$/i,
      ],
      canonicalModel: 'Open the map, take a pencil, and write your name.',
      thaiScaffold: 'กางแผนที่ หยิบดินสอ และเขียนชื่อของคุณ',
      diagnosticChecks: {
        negativeForbidden: true,
        mustStartWithAnyVerb: ['open'],
      },
      hints: {
        tier1Structure: {
          en: 'List three imperatives cleanly: [Verb 1] [object], [Verb 2] [object], and [Verb 3] [object].',
          th: 'เรียงคำสั่ง 3 ขั้นตอน: [กริยา 1] [กรรม], [กริยา 2] [กรรม], and [กริยา 3] [กรรม]',
        },
        tier2Focus: {
          en: 'Logical workflow: first open the map, second take a pencil, last write your name.',
          th: 'ลำดับเหตุผล: เปิดแผนที่ก่อน -> หยิบดินสอ -> เขียนชื่อ',
        },
        tier3Scaffold: {
          en: 'Model frame: "Open ___, take ___, and write ___."',
          th: 'กรอบคำตอบ: "Open ___, take ___, and write ___."',
        },
      },
    },
    b1: {
      mode: 'b1',
      goalSummary: {
        en: 'Draft a full camp briefing combining map inspection, notebook marking, and packing a spare pencil.',
        th: 'เขียนคำสั่ง 3 ขั้นตอนก่อนออกค่าย: ตรวจแผนที่ ทำเครื่องหมายบนสมุด และเก็บดินสอสำรอง',
      },
      targetOutcomeEn: 'Action Goal: Route checked on map, stops marked, spare pencil packed.',
      targetOutcomeTh: 'เป้าหมาย: ตรวจเส้นทาง ทำเครื่องหมายจุดแวะ และพกดินสอสำรองครบ',
      actionDemoKey: 'pair_map_pencil',
      highlightedItems: ['map', 'notebook', 'pencil'],
      tiles: makeTiles('ec6_b1', [
        { value: 'Check', role: 'verb' },
        { value: 'the route map,', role: 'object' },
        { value: 'mark', role: 'verb' },
        { value: 'our stops', role: 'object' },
        { value: 'in your notebook,', role: 'phrase' },
        { value: 'and', role: 'connector' },
        { value: 'pack', role: 'verb' },
        { value: 'a spare pencil', role: 'object' },
        { value: 'forget', role: 'verb', isDistractor: true },
        { value: 'never', role: 'negative', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^check\s+the\s+route\s+map(?:,)?\s+mark\s+our\s+stops\s+in\s+your\s+notebook(?:,)?\s+and\s+pack\s+a\s+spare\s+pencil$/i,
      ],
      canonicalModel:
        'Check the route map, mark our stops in your notebook, and pack a spare pencil.',
      thaiScaffold: 'ตรวจแผนที่เส้นทาง ทำเครื่องหมายจุดแวะในสมุด และพกดินสอสำรองไปด้วย',
      diagnosticChecks: {
        negativeForbidden: true,
        mustStartWithAnyVerb: ['check'],
      },
      hints: {
        tier1Structure: {
          en: 'Sequence 3 linked commands: Check [map], mark [stops + location], and pack [spare tool].',
          th: 'เรียงคำสั่ง 3 ชุด: Check [แผนที่], mark [จุดแวะ + ในสมุด], and pack [ดินสอสำรอง]',
        },
        tier2Focus: {
          en: 'Watch the punctuation: "the route map," comes before "mark our stops in your notebook,".',
          th: 'สังเกตเครื่องหมายจุลภาค: "the route map," ก่อน "mark our stops in your notebook,"',
        },
        tier3Scaffold: {
          en: 'Model frame: "Check ___, mark ___ in your notebook, and pack ___."',
          th: 'กรอบคำตอบ: "Check ___, mark ___ in your notebook, and pack ___."',
        },
      },
    },
  },
];

export function validateCommandForgeSubmission(
  variant: CommandForgeChallengeVariant,
  selectedTileValues: string[],
): { isCorrect: boolean; sentence: string; feedback: LocalizedText } {
  const sentence = joinNormalizedTiles(selectedTileValues);
  if (!sentence || selectedTileValues.length < 2) {
    return {
      isCorrect: false,
      sentence,
      feedback: {
        en: 'Build a complete English instruction before checking.',
        th: 'กรุณาประกอบประโยคคำสั่งภาษาอังกฤษให้สมบูรณ์ก่อนตรวจคำตอบ',
      },
    };
  }

  const normalized = normalizeEnglishSentenceForCheck(sentence).toLowerCase();
  const hasNegativeStart =
    normalized.startsWith('do not') ||
    normalized.startsWith("don't") ||
    normalized.startsWith('avoid') ||
    normalized.startsWith('never');

  if (variant.diagnosticChecks.requiresNegative && !hasNegativeStart) {
    return {
      isCorrect: false,
      sentence,
      feedback: {
        en: 'This goal requires a negative warning! Start with "Do not" or "Don’t" + base verb.',
        th: 'เป้าหมายนี้เป็นข้อห้าม! ควรเริ่มประโยคด้วย "Do not" หรือ "Don’t" ตามด้วยกริยาช่อง 1',
      },
    };
  }

  if (variant.diagnosticChecks.negativeForbidden && hasNegativeStart) {
    return {
      isCorrect: false,
      sentence,
      feedback: {
        en: 'This instruction asks teammates TO DO an action—remove negative words like "Do not" or "Avoid".',
        th: 'คำสั่งนี้เป็นการบอกให้ลงมือทำ ไม่ใช่ข้อห้าม ลองเอาคำปฏิเสธออกดูนะ',
      },
    };
  }

  if (variant.diagnosticChecks.pairOrderCheck) {
    const [firstRe, secondRe] = variant.diagnosticChecks.pairOrderCheck.firstMustPrecedesSecond;
    const m1 = firstRe.exec(normalized);
    const m2 = secondRe.exec(normalized);
    if (m1 && m2 && m1.index > m2.index) {
      return {
        isCorrect: false,
        sentence,
        feedback: variant.diagnosticChecks.pairOrderCheck.wrongOrderFeedback,
      };
    }
  }

  if (variant.diagnosticChecks.mustStartWithAnyVerb?.length) {
    const startsWithVerb = variant.diagnosticChecks.mustStartWithAnyVerb.some((v) =>
      normalized.startsWith(v.toLowerCase()),
    );
    if (!startsWithVerb) {
      return {
        isCorrect: false,
        sentence,
        feedback: {
          en: `Start your imperative clearly with an action verb (${variant.diagnosticChecks.mustStartWithAnyVerb
            .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
            .join(' / ')}).`,
          th: 'คำสั่งตรงไปตรงมาควรขึ้นต้นด้วยกริยาบอกการกระทำก่อนเสมอ',
        },
      };
    }
  }

  if (matchesAuthoredPatterns(sentence, variant.acceptedPatterns)) {
    return {
      isCorrect: true,
      sentence,
      feedback: {
        en: 'Command forged! Your instruction is clear, natural, and saved to My Expedition Instructions.',
        th: 'สร้างคำสั่งสำเร็จ! ประโยคถูกต้องชัดเจนและบันทึกเข้าสมุดคำสั่งแล้ว',
      },
    };
  }

  return {
    isCorrect: false,
    sentence,
    feedback: {
      en: 'Check the word order and prepositions—make sure every action, object, and place fits together smoothly.',
      th: 'ลองตรวจลำดับคำและคำบุพบทอีกครั้ง ให้กริยา กรรม และสถานที่เรียงต่อกันอย่างถูกต้อง',
    },
  };
}

// ============================================================================
// GAME 2 — PYRAMID ROUTE ARCHITECT (Fictional 6x4 Giza Learning Board, 6 A2 + 6 B1)
// ============================================================================

export const ARCHITECT_BOARD_COLS = 6;
export const ARCHITECT_BOARD_ROWS = 4;

export const ARCHITECT_BOARD_LANDMARKS: ArchitectBoardLandmark[] = [
  {
    id: 'camp',
    x: 0,
    y: 3,
    label: { en: 'Base Camp', th: 'ค่ายฐาน' },
    color: '#12B8B0',
    iconKey: 'camp',
  },
  {
    id: 'sphinx',
    x: 2,
    y: 2,
    label: { en: 'Sphinx Statue', th: 'รูปปั้นสฟิงซ์' },
    color: '#D97706',
    iconKey: 'sphinx',
  },
  {
    id: 'oasis',
    x: 4,
    y: 3,
    label: { en: 'Shade Oasis', th: 'โอเอซิสพักร่ม' },
    color: '#059669',
    iconKey: 'oasis',
  },
  {
    id: 'info_point',
    x: 5,
    y: 1,
    label: { en: 'Information Point', th: 'จุดบริการข้อมูล' },
    color: '#2563EB',
    iconKey: 'info_point',
  },
  {
    id: 'pyramid_north',
    x: 2,
    y: 0,
    label: { en: 'Great Pyramid', th: 'มหาพีระมิด' },
    color: '#E7B43C',
    iconKey: 'pyramid_north',
  },
  {
    id: 'viewing_platform',
    x: 0,
    y: 1,
    label: { en: 'Viewing Platform', th: 'จุดชมวิวพีระมิด' },
    color: '#7C3AED',
    iconKey: 'viewing_platform',
  },
  {
    id: 'flag',
    x: 4,
    y: 0,
    label: { en: 'Expedition Flag', th: 'ธงคณะสำรวจ' },
    color: '#DC2626',
    iconKey: 'flag',
  },
];

export const ARCHITECT_DEFAULT_BLOCKED_CELLS: Array<{ x: number; y: number }> = [
  { x: 1, y: 1 }, // Deep sand mound NW
  { x: 3, y: 2 }, // Fragile excavation cordon
];

function turnLeftDir(d: RouteDirectionKind): RouteDirectionKind {
  return d === 'N' ? 'W' : d === 'W' ? 'S' : d === 'S' ? 'E' : 'N';
}

function turnRightDir(d: RouteDirectionKind): RouteDirectionKind {
  return d === 'N' ? 'E' : d === 'E' ? 'S' : d === 'S' ? 'W' : 'N';
}

function stepDelta(d: RouteDirectionKind): { dx: number; dy: number } {
  if (d === 'N') return { dx: 0, dy: -1 };
  if (d === 'E') return { dx: 1, dy: 0 };
  if (d === 'S') return { dx: 0, dy: 1 };
  return { dx: -1, dy: 0 };
}

function parseWordSteps(text: string): number {
  if (/\bsix\b|6/.test(text)) return 6;
  if (/\bfive\b|5/.test(text)) return 5;
  if (/\bfour\b|4/.test(text)) return 4;
  if (/\bthree\b|3/.test(text)) return 3;
  if (/\btwo\b|2/.test(text)) return 2;
  if (/\bone\b|1/.test(text)) return 1;
  return 1;
}

export const PYRAMID_ROUTE_ARCHITECT_CHALLENGES: RouteArchitectChallengeBundle[] = [
  {
    challengeId: 'pr_1_straight_stop',
    order: 1,
    title: {
      en: 'Direct Walk · To the Great Pyramid',
      th: 'เดินตรง · สู่มหาพีระมิด',
    },
    a2: {
      mode: 'a2',
      missionGoal: {
        en: 'From Base Camp (facing North), guide the explorer straight three blocks north and stop beside the Viewing Platform.',
        th: 'จากค่ายฐาน (หันทิศเหนือ) สั่งนักสำรวจเดินตรงไปทางทิศเหนือ 3 ช่อง แล้วหยุดข้างจุดชมวิว',
      },
      startPos: { x: 0, y: 3, facing: 'N' },
      targetPos: { x: 0, y: 0 },
      requiredWaypoints: ['viewing_platform'],
      targetLandmarkId: 'viewing_platform',
      blockedCells: ARCHITECT_DEFAULT_BLOCKED_CELLS,
      tiles: makeTiles('pr1_a2', [
        { value: 'Walk straight', role: 'verb' },
        { value: 'north', role: 'prep' },
        { value: 'three blocks', role: 'phrase' },
        { value: 'and', role: 'connector' },
        { value: 'stop', role: 'verb' },
        { value: 'beside the', role: 'prep' },
        { value: 'Viewing Platform', role: 'object' },
        { value: 'turn right', role: 'verb', isDistractor: true },
        { value: 'Oasis', role: 'object', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^walk\s+straight\s+(?:north\s+three\s+blocks|three\s+blocks\s+north)\s+and\s+stop\s+beside\s+the\s+viewing\s+platform$/i,
      ],
      canonicalModel: 'Walk straight north three blocks and stop beside the Viewing Platform.',
      thaiScaffold: 'เดินตรงไปทางทิศเหนือสามช่วงตึกแล้วหยุดข้างจุดชมวิว',
      hints: {
        tier1Structure: {
          en: 'Structure: [Walk straight + direction + distance] + and + [stop beside the + landmark].',
          th: 'โครงสร้าง: [Walk straight + ทิศ + ระยะ] + and + [stop beside the + สถานที่]',
        },
        tier2Focus: {
          en: 'Pair "north" with "three blocks", and end with "stop beside the Viewing Platform".',
          th: 'จับคู่ "north" กับ "three blocks" แล้วปิดท้ายด้วย "stop beside the Viewing Platform"',
        },
        tier3Scaffold: {
          en: 'Model frame: "Walk straight north ___ and stop beside the ___."',
          th: 'กรอบคำตอบ: "Walk straight north ___ and stop beside the ___."',
        },
      },
    },
    b1: {
      mode: 'b1',
      missionGoal: {
        en: 'From Base Camp (facing North), direct visitors north along the west lane past the Viewing Platform, then stop at the north corner.',
        th: 'จากค่ายฐาน (หันทิศเหนือ) นำนักท่องเที่ยวเดินขึ้นทิศเหนือ 3 ช่องผ่านจุดชมวิว แล้วหยุดที่หัวมุมเหนือ',
      },
      startPos: { x: 0, y: 3, facing: 'N' },
      targetPos: { x: 0, y: 0 },
      requiredWaypoints: ['viewing_platform'],
      targetLandmarkId: 'viewing_platform',
      blockedCells: ARCHITECT_DEFAULT_BLOCKED_CELLS,
      tiles: makeTiles('pr1_b1', [
        { value: 'Head straight', role: 'verb' },
        { value: 'north', role: 'prep' },
        { value: 'three blocks', role: 'phrase' },
        { value: 'past the', role: 'prep' },
        { value: 'Viewing Platform,', role: 'object' },
        { value: 'then', role: 'sequencer' },
        { value: 'stop', role: 'verb' },
        { value: 'at the north corner', role: 'phrase' },
        { value: 'turn right', role: 'verb', isDistractor: true },
        { value: 'two blocks', role: 'phrase', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^head\s+straight\s+(?:north\s+three\s+blocks|three\s+blocks\s+north)\s+past\s+the\s+viewing\s+platform(?:,)?\s+then\s+stop\s+at\s+the\s+north\s+corner$/i,
      ],
      canonicalModel:
        'Head straight north three blocks past the Viewing Platform, then stop at the north corner.',
      thaiScaffold: 'มุ่งตรงไปทางทิศเหนือสามช่วงผ่านจุดชมวิว จากนั้นหยุดที่หัวมุมด้านเหนือ',
      hints: {
        tier1Structure: {
          en: 'Combine movement + distance + landmark reference + ", then stop at...".',
          th: 'ผสาน การเดิน + ระยะ + จุดสังเกตที่เดินผ่าน + ", then stop at..."',
        },
        tier2Focus: {
          en: 'Keep "three blocks" before "past the Viewing Platform,".',
          th: 'วาง "three blocks" ไว้หน้า "past the Viewing Platform,"',
        },
        tier3Scaffold: {
          en: 'Model frame: "Head straight north ___ past the ___, then stop at the north corner."',
          th: 'กรอบคำตอบ: "Head straight north ___ past the ___, then stop at the north corner."',
        },
      },
    },
  },
  {
    challengeId: 'pr_2_single_turn',
    order: 2,
    title: {
      en: 'First Turn · Walk & Turn Toward the Sphinx',
      th: 'การเลี้ยวครั้งแรก · เดินและเลี้ยวสู่สฟิงซ์',
    },
    a2: {
      mode: 'a2',
      missionGoal: {
        en: 'Starting at Base Camp (facing North), go north one block, turn right, and walk two blocks east to the Sphinx Statue.',
        th: 'เริ่มจากค่ายฐาน (หันเหนือ) เดินขึ้นเหนือ 1 ช่อง เลี้ยวขวา แล้วเดิน 2 ช่องสู่รูปปั้นสฟิงซ์',
      },
      startPos: { x: 0, y: 3, facing: 'N' },
      targetPos: { x: 2, y: 2 },
      requiredWaypoints: ['sphinx'],
      targetLandmarkId: 'sphinx',
      blockedCells: ARCHITECT_DEFAULT_BLOCKED_CELLS,
      tiles: makeTiles('pr2_a2', [
        { value: 'Go straight', role: 'verb' },
        { value: 'one block,', role: 'phrase' },
        { value: 'turn right,', role: 'verb' },
        { value: 'and', role: 'connector' },
        { value: 'walk', role: 'verb' },
        { value: 'two blocks', role: 'phrase' },
        { value: 'to the', role: 'prep' },
        { value: 'Sphinx Statue', role: 'object' },
        { value: 'turn left,', role: 'verb', isDistractor: true },
        { value: 'three blocks', role: 'phrase', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^go\s+straight\s+one\s+block(?:,)?\s+turn\s+right(?:,)?\s+and\s+walk\s+two\s+blocks\s+to\s+the\s+sphinx\s+statue$/i,
      ],
      canonicalModel: 'Go straight one block, turn right, and walk two blocks to the Sphinx Statue.',
      thaiScaffold: 'เดินตรงไปหนึ่งช่อง เลี้ยวขวา แล้วเดินสองช่องไปยังรูปปั้นสฟิงซ์',
      wrongOrderHint: {
        en: 'Remember to go straight one block FIRST so you clear the camp edge before turning right!',
        th: 'ต้องเดินตรงขึ้นเหนือหนึ่งช่องก่อน แล้วจึงเลี้ยวขวาไปหารูปปั้นสฟิงซ์นะ',
      },
      hints: {
        tier1Structure: {
          en: 'Order: [Walk distance 1] + [Turn direction] + and + [Walk distance 2 + destination].',
          th: 'ลำดับ: [เดินระยะที่ 1] + [เลี้ยว] + and + [เดินระยะที่ 2 + จุดหมาย]',
        },
        tier2Focus: {
          en: 'Start with "Go straight one block," then "turn right," then walk two blocks.',
          th: 'เริ่มด้วย "Go straight one block," แล้ว "turn right," จากนั้นเดินต่อสองช่อง',
        },
        tier3Scaffold: {
          en: 'Model frame: "Go straight one block, ___, and walk two blocks to the ___."',
          th: 'กรอบคำตอบ: "Go straight one block, ___, and walk two blocks to the ___."',
        },
      },
    },
    b1: {
      mode: 'b1',
      missionGoal: {
        en: 'From Base Camp (facing North), direct a visitor one block north, turn right onto the sandstone lane, and continue two blocks to reach the Sphinx Statue.',
        th: 'จากค่ายฐาน (หันเหนือ) พานักท่องเที่ยวเดินเหนือ 1 ช่อง เลี้ยวขวาเข้าทางหินทราย และเดินต่อ 2 ช่องถึงรูปปั้นสฟิงซ์',
      },
      startPos: { x: 0, y: 3, facing: 'N' },
      targetPos: { x: 2, y: 2 },
      requiredWaypoints: ['sphinx'],
      targetLandmarkId: 'sphinx',
      blockedCells: ARCHITECT_DEFAULT_BLOCKED_CELLS,
      tiles: makeTiles('pr2_b1', [
        { value: 'Walk forward', role: 'verb' },
        { value: 'one block,', role: 'phrase' },
        { value: 'turn right', role: 'verb' },
        { value: 'onto the path,', role: 'phrase' },
        { value: 'and', role: 'connector' },
        { value: 'continue', role: 'verb' },
        { value: 'two blocks', role: 'phrase' },
        { value: 'to the', role: 'prep' },
        { value: 'Sphinx Statue', role: 'object' },
        { value: 'turn left', role: 'verb', isDistractor: true },
        { value: 'four blocks', role: 'phrase', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^walk\s+forward\s+one\s+block(?:,)?\s+turn\s+right\s+onto\s+the\s+path(?:,)?\s+and\s+continue\s+two\s+blocks\s+to\s+the\s+sphinx\s+statue$/i,
      ],
      canonicalModel:
        'Walk forward one block, turn right onto the path, and continue two blocks to the Sphinx Statue.',
      thaiScaffold: 'เดินตรงไปข้างหน้าหนึ่งช่อง เลี้ยวขวาเข้าเส้นทาง แล้วเดินต่อไปอีกสองช่องจนถึงรูปปั้นสฟิงซ์',
      hints: {
        tier1Structure: {
          en: 'Structure: Walk forward + distance + turn right onto the path + and continue + distance + destination.',
          th: 'โครงสร้าง: Walk forward + ระยะ + เลี้ยวขวาเข้าเส้นทาง + and continue + ระยะ + จุดหมาย',
        },
        tier2Focus: {
          en: 'Make sure "turn right" comes BEFORE "two blocks to the Sphinx Statue".',
          th: 'ให้ "turn right" มาก่อนคำว่า "two blocks to the Sphinx Statue"',
        },
        tier3Scaffold: {
          en: 'Model frame: "Walk forward one block, turn right ___, and continue two blocks to ___."',
          th: 'กรอบคำตอบ: "Walk forward one block, turn right ___, and continue two blocks to ___."',
        },
      },
    },
  },
  {
    challengeId: 'pr_3_pass_landmark',
    order: 3,
    title: {
      en: 'Landmark Reference · Past the Oasis',
      th: 'อ้างอิงจุดสังเกต · ผ่านโอเอซิสพักร่ม',
    },
    a2: {
      mode: 'a2',
      missionGoal: {
        en: 'Starting along the south trail just east of Base Camp (facing East), walk straight four blocks past the Shade Oasis, turn left, and go two blocks north to the Information Point.',
        th: 'เริ่มบนเส้นทางด้านใต้ถัดจากค่ายฐานมาทางตะวันออก (หันตะวันออก) เดินตรง 4 ช่องผ่านโอเอซิสพักร่ม แล้วเลี้ยวซ้ายเดิน 2 ช่องสู่จุดบริการข้อมูล',
      },
      startPos: { x: 1, y: 3, facing: 'E' },
      targetPos: { x: 5, y: 1 },
      requiredWaypoints: ['oasis', 'info_point'],
      targetLandmarkId: 'info_point',
      blockedCells: ARCHITECT_DEFAULT_BLOCKED_CELLS,
      tiles: makeTiles('pr3_a2', [
        { value: 'Walk straight', role: 'verb' },
        { value: 'four blocks', role: 'phrase' },
        { value: 'past the', role: 'prep' },
        { value: 'Shade Oasis,', role: 'object' },
        { value: 'turn left,', role: 'verb' },
        { value: 'and', role: 'connector' },
        { value: 'go', role: 'verb' },
        { value: 'two blocks', role: 'phrase' },
        { value: 'to the', role: 'prep' },
        { value: 'Information Point', role: 'object' },
        { value: 'turn right,', role: 'verb', isDistractor: true },
        { value: 'one block', role: 'phrase', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^walk\s+straight\s+four\s+blocks\s+past\s+the\s+shade\s+oasis(?:,)?\s+turn\s+left(?:,)?\s+and\s+go\s+two\s+blocks\s+to\s+the\s+information\s+point$/i,
      ],
      canonicalModel:
        'Walk straight four blocks past the Shade Oasis, turn left, and go two blocks to the Information Point.',
      thaiScaffold: 'เดินตรงสี่ช่องผ่านโอเอซิสพักร่ม เลี้ยวซ้าย แล้วเดินอีกสองช่องสู่จุดบริการข้อมูล',
      hints: {
        tier1Structure: {
          en: 'Structure: Walk straight + distance + past the [Landmark], turn left, and go + distance + destination.',
          th: 'โครงสร้าง: เดินตรง + ระยะ + ผ่าน [สถานที่], เลี้ยวซ้าย, แล้วไป + ระยะ + จุดหมาย',
        },
        tier2Focus: {
          en: 'Facing East, turning North is "turn left"—avoid "turn right" or you walk off the south edge!',
          th: 'เมื่อหันตะวันออก การเลี้ยวขึ้นเหนือคือ "turn left" ระวังอย่าใช้ "turn right" นะ',
        },
        tier3Scaffold: {
          en: 'Model frame: "Walk straight four blocks past the ___, turn left, and go two blocks to the ___."',
          th: 'กรอบคำตอบ: "Walk straight four blocks past the ___, turn left, and go two blocks to the ___."',
        },
      },
    },
    b1: {
      mode: 'b1',
      missionGoal: {
        en: 'Guide researchers from the south trail east of Base Camp (facing East): continue four blocks east past the Shade Oasis, then turn left and walk two blocks to reach the Information Point.',
        th: 'นำนักวิจัยจากเส้นทางด้านใต้ถัดจากค่ายฐาน (หันตะวันออก) เดินตะวันออก 4 ช่องผ่านโอเอซิสพักร่ม จากนั้นเลี้ยวซ้ายเดินขึ้นไป 2 ช่องสู่จุดบริการข้อมูล',
      },
      startPos: { x: 1, y: 3, facing: 'E' },
      targetPos: { x: 5, y: 1 },
      requiredWaypoints: ['oasis', 'info_point'],
      targetLandmarkId: 'info_point',
      blockedCells: ARCHITECT_DEFAULT_BLOCKED_CELLS,
      tiles: makeTiles('pr3_b1', [
        { value: 'Continue east', role: 'verb' },
        { value: 'four blocks', role: 'phrase' },
        { value: 'past the', role: 'prep' },
        { value: 'Shade Oasis,', role: 'object' },
        { value: 'then', role: 'sequencer' },
        { value: 'turn left', role: 'verb' },
        { value: 'and', role: 'connector' },
        { value: 'walk', role: 'verb' },
        { value: 'two blocks', role: 'phrase' },
        { value: 'to the', role: 'prep' },
        { value: 'Information Point', role: 'object' },
        { value: 'turn right', role: 'verb', isDistractor: true },
        { value: 'three blocks', role: 'phrase', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^continue\s+east\s+four\s+blocks\s+past\s+the\s+shade\s+oasis(?:,)?\s+then\s+turn\s+left\s+and\s+walk\s+two\s+blocks\s+to\s+the\s+information\s+point$/i,
      ],
      canonicalModel:
        'Continue east four blocks past the Shade Oasis, then turn left and walk two blocks to the Information Point.',
      thaiScaffold: 'เดินไปทางตะวันออกสี่ช่องผ่านโอเอซิส จากนั้นเลี้ยวซ้ายและเดินสองช่องสู่จุดบริการข้อมูล',
      hints: {
        tier1Structure: {
          en: 'Use "Continue east + four blocks + past the Shade Oasis," followed by "then turn left and walk two blocks...".',
          th: 'ใช้ "Continue east + four blocks + past the Shade Oasis," แล้วต่อด้วย "then turn left and walk two blocks..."',
        },
        tier2Focus: {
          en: 'Walk all the way past the Shade Oasis to the far-east edge, then turn left (north) for 2 blocks to reach the Information Point.',
          th: 'เดินเลยโอเอซิสพักร่มไปจนสุดขอบตะวันออก แล้วเลี้ยวซ้ายขึ้นเหนืออีก 2 ช่องจะถึงจุดบริการข้อมูลพอดี',
        },
        tier3Scaffold: {
          en: 'Model frame: "Continue east four blocks past ___, then turn left and walk two blocks to ___."',
          th: 'กรอบคำตอบ: "Continue east four blocks past ___, then turn left and walk two blocks to ___."',
        },
      },
    },
  },
  {
    challengeId: 'pr_4_obstacle_detour',
    order: 4,
    title: {
      en: 'Avoid Blocked Zone · Around the Dune Cordon',
      th: 'เลี่ยงเขตหวงห้าม · อ้อมแนวเชือกเนินทราย',
    },
    a2: {
      mode: 'a2',
      missionGoal: {
        en: 'From Base Camp (facing North), avoid the blocked sand dune east of the Viewing Platform! Walk north three blocks to the north-west corner, turn right, and walk two blocks to the Great Pyramid.',
        th: 'จากค่ายฐาน (หันเหนือ) ให้เลี่ยงเนินทรายที่ปิดกั้นข้างจุดชมวิว! เดินขึ้นเหนือ 3 ช่องถึงหัวมุมบนซ้าย เลี้ยวขวา แล้วเดิน 2 ช่องสู่มหาพีระมิด',
      },
      startPos: { x: 0, y: 3, facing: 'N' },
      targetPos: { x: 2, y: 0 },
      requiredWaypoints: ['viewing_platform', 'pyramid_north'],
      targetLandmarkId: 'pyramid_north',
      blockedCells: ARCHITECT_DEFAULT_BLOCKED_CELLS,
      tiles: makeTiles('pr4_a2', [
        { value: 'Walk north', role: 'verb' },
        { value: 'three blocks,', role: 'phrase' },
        { value: 'turn right,', role: 'verb' },
        { value: 'and', role: 'connector' },
        { value: 'go', role: 'verb' },
        { value: 'two blocks', role: 'phrase' },
        { value: 'to the', role: 'prep' },
        { value: 'Great Pyramid', role: 'object' },
        { value: 'two blocks,', role: 'phrase', isDistractor: true },
        { value: 'turn left,', role: 'verb', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^walk\s+north\s+three\s+blocks(?:,)?\s+turn\s+right(?:,)?\s+and\s+go\s+two\s+blocks\s+to\s+the\s+great\s+pyramid$/i,
      ],
      canonicalModel: 'Walk north three blocks, turn right, and go two blocks to the Great Pyramid.',
      thaiScaffold: 'เดินขึ้นทิศเหนือสามช่อง เลี้ยวขวา แล้วเดินอีกสองช่องสู่มหาพีระมิด',
      wrongOrderHint: {
        en: 'Careful! Walking two blocks north first and turning right sends you straight into the blocked sand dune beside the Viewing Platform! Walk THREE blocks north first.',
        th: 'ระวัง! ถ้าเดินขึ้นเหนือแค่ 2 ช่องแล้วเลี้ยวขวา จะชนแนวเนินทรายที่ปิดกั้นทันที ให้เดินขึ้นเหนือ 3 ช่องก่อนนะ',
      },
      hints: {
        tier1Structure: {
          en: 'Walk past the blocked row first: [Walk north three blocks], [turn right], [go two blocks to destination].',
          th: 'เดินให้พ้นแนวที่ถูกปิดกั้นก่อน: เดินเหนือ 3 ช่อง -> เลี้ยวขวา -> เดิน 2 ช่อง',
        },
        tier2Focus: {
          en: 'Choose "three blocks," first, NOT "two blocks,"—turning right at the Viewing Platform runs into the blocked sand dune!',
          th: 'เลือก "three blocks," ก่อน ไม่ใช่ "two blocks," เพราะแถวจุดชมวิวมีเนินทรายปิดกั้นอยู่',
        },
        tier3Scaffold: {
          en: 'Model frame: "Walk north three blocks, turn right, and go two blocks to ___."',
          th: 'กรอบคำตอบ: "Walk north three blocks, turn right, and go two blocks to ___."',
        },
      },
    },
    b1: {
      mode: 'b1',
      missionGoal: {
        en: 'Guide a group from Base Camp (facing North) safely around the blocked sand dune: walk three blocks past the Viewing Platform, turn right, and continue two blocks to the Great Pyramid.',
        th: 'นำกลุ่มผู้สำรวจจากค่ายฐาน (หันเหนือ) อ้อมแนวเนินทรายหวงห้ามอย่างปลอดภัย: เดินขึ้นเหนือ 3 ช่องผ่านจุดชมวิว เลี้ยวขวา และเดินต่อ 2 ช่องสู่มหาพีระมิด',
      },
      startPos: { x: 0, y: 3, facing: 'N' },
      targetPos: { x: 2, y: 0 },
      requiredWaypoints: ['viewing_platform', 'pyramid_north'],
      targetLandmarkId: 'pyramid_north',
      blockedCells: ARCHITECT_DEFAULT_BLOCKED_CELLS,
      tiles: makeTiles('pr4_b1', [
        { value: 'Go straight', role: 'verb' },
        { value: 'three blocks', role: 'phrase' },
        { value: 'past the', role: 'prep' },
        { value: 'Viewing Platform', role: 'object' },
        { value: 'to avoid the sand mound,', role: 'phrase' },
        { value: 'turn right,', role: 'verb' },
        { value: 'and', role: 'connector' },
        { value: 'walk', role: 'verb' },
        { value: 'two blocks', role: 'phrase' },
        { value: 'to the', role: 'prep' },
        { value: 'Great Pyramid', role: 'object' },
        { value: 'turn left,', role: 'verb', isDistractor: true },
        { value: 'one block', role: 'phrase', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^go\s+straight\s+three\s+blocks\s+past\s+the\s+viewing\s+platform\s+to\s+avoid\s+the\s+sand\s+mound(?:,)?\s+turn\s+right(?:,)?\s+and\s+walk\s+two\s+blocks\s+to\s+the\s+great\s+pyramid$/i,
      ],
      canonicalModel:
        'Go straight three blocks past the Viewing Platform to avoid the sand mound, turn right, and walk two blocks to the Great Pyramid.',
      thaiScaffold: 'เดินตรงสามช่องผ่านจุดชมวิวเพื่อหลีกเลี่ยงเนินทราย เลี้ยวขวา และเดินสองช่องสู่มหาพีระมิด',
      hints: {
        tier1Structure: {
          en: 'Combine clear distance + purpose ("to avoid the sand mound,") + turn + final distance.',
          th: 'ผสาน ระยะเดิน + เหตุผล ("to avoid the sand mound,") + เลี้ยว + ระยะสุดท้าย',
        },
        tier2Focus: {
          en: 'Three blocks north reaches the top ridge cleanly above the blocked dune.',
          th: 'เดินขึ้นเหนือ 3 ช่องจะถึงแนวสันด้านบน พ้นจุดกีดขวางพอดี',
        },
        tier3Scaffold: {
          en: 'Model frame: "Go straight three blocks past ___ to avoid the sand mound, turn right, and walk two blocks to ___."',
          th: 'กรอบคำตอบ: "Go straight three blocks past ___ to avoid the sand mound, turn right, and walk two blocks to ___."',
        },
      },
    },
  },
  {
    challengeId: 'pr_5_multi_step_turn',
    order: 5,
    title: {
      en: 'Multi-Turn Expedition · To the Flag',
      th: 'หลายทางเลี้ยว · สู่ธงคณะสำรวจ',
    },
    a2: {
      mode: 'a2',
      missionGoal: {
        en: 'From Base Camp (facing East), walk east four blocks to the Shade Oasis, turn left, and walk three blocks north to the Expedition Flag. Avoid turning too early near the cordoned excavation!',
        th: 'จากค่ายฐาน (หันทิศตะวันออก) เดินไปทางตะวันออก 4 ช่องถึงโอเอซิสพักร่ม เลี้ยวซ้าย แล้วเดินขึ้นเหนือ 3 ช่องสู่ธงคณะสำรวจ (หลีกเลี่ยงแนวขุดค้นที่ปิดกั้น)',
      },
      startPos: { x: 0, y: 3, facing: 'E' },
      targetPos: { x: 4, y: 0 },
      requiredWaypoints: ['oasis', 'flag'],
      targetLandmarkId: 'flag',
      blockedCells: ARCHITECT_DEFAULT_BLOCKED_CELLS,
      tiles: makeTiles('pr5_a2', [
        { value: 'Walk east', role: 'verb' },
        { value: 'four blocks', role: 'phrase' },
        { value: 'to the', role: 'prep' },
        { value: 'Shade Oasis,', role: 'object' },
        { value: 'turn left,', role: 'verb' },
        { value: 'and', role: 'connector' },
        { value: 'walk', role: 'verb' },
        { value: 'three blocks', role: 'phrase' },
        { value: 'to the', role: 'prep' },
        { value: 'Expedition Flag', role: 'object' },
        { value: 'turn right,', role: 'verb', isDistractor: true },
        { value: 'two blocks', role: 'phrase', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^walk\s+east\s+four\s+blocks\s+to\s+the\s+shade\s+oasis(?:,)?\s+turn\s+left(?:,)?\s+and\s+walk\s+three\s+blocks\s+to\s+the\s+expedition\s+flag$/i,
      ],
      canonicalModel:
        'Walk east four blocks to the Shade Oasis, turn left, and walk three blocks to the Expedition Flag.',
      thaiScaffold: 'เดินไปทางตะวันออกสี่ช่องถึงโอเอซิส เลี้ยวซ้าย แล้วเดินอีกสามช่องถึงธงคณะสำรวจ',
      hints: {
        tier1Structure: {
          en: 'Two clear legs: East four blocks to Shade Oasis -> turn left (North) -> three blocks to Expedition Flag.',
          th: 'แบ่ง 2 ช่วง: ตะวันออก 4 ช่องถึงโอเอซิส -> เลี้ยวซ้าย (เหนือ) -> เดิน 3 ช่องถึงธง',
        },
        tier2Focus: {
          en: 'Notice there are two "to the" tiles—pair one with Shade Oasis and one with Expedition Flag.',
          th: 'มีคำว่า "to the" สองชิ้น ใช้คู่กับ Shade Oasis และ Expedition Flag อย่างละอัน',
        },
        tier3Scaffold: {
          en: 'Model frame: "Walk east four blocks to ___, turn left, and walk three blocks to ___."',
          th: 'กรอบคำตอบ: "Walk east four blocks to ___, turn left, and walk three blocks to ___."',
        },
      },
    },
    b1: {
      mode: 'b1',
      missionGoal: {
        en: 'From the Sphinx Statue (facing North), walk north two blocks to the Great Pyramid, turn right, and continue two blocks east to stop beside the Expedition Flag.',
        th: 'จากรูปปั้นสฟิงซ์ (หันเหนือ) เดินตรงขึ้นเหนือ 2 ช่องถึงมหาพีระมิด เลี้ยวขวา และเดินต่อ 2 ช่องเพื่อหยุดข้างธงคณะสำรวจ',
      },
      startPos: { x: 2, y: 2, facing: 'N' },
      targetPos: { x: 4, y: 0 },
      requiredWaypoints: ['pyramid_north', 'flag'],
      targetLandmarkId: 'flag',
      blockedCells: ARCHITECT_DEFAULT_BLOCKED_CELLS,
      tiles: makeTiles('pr5_b1', [
        { value: 'First', role: 'sequencer' },
        { value: 'walk', role: 'verb' },
        { value: 'two blocks', role: 'phrase' },
        { value: 'to the', role: 'prep' },
        { value: 'Great Pyramid,', role: 'object' },
        { value: 'next', role: 'sequencer' },
        { value: 'turn right,', role: 'verb' },
        { value: 'and', role: 'connector' },
        { value: 'continue', role: 'verb' },
        { value: 'two blocks', role: 'phrase' },
        { value: 'to stop beside the', role: 'phrase' },
        { value: 'Expedition Flag', role: 'object' },
        { value: 'turn left,', role: 'verb', isDistractor: true },
        { value: 'three blocks', role: 'phrase', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^first\s+walk\s+two\s+blocks\s+to\s+the\s+great\s+pyramid(?:,)?\s+next\s+turn\s+right(?:,)?\s+and\s+continue\s+two\s+blocks\s+to\s+stop\s+beside\s+the\s+expedition\s+flag$/i,
      ],
      canonicalModel:
        'First walk two blocks to the Great Pyramid, next turn right, and continue two blocks to stop beside the Expedition Flag.',
      thaiScaffold: 'อันดับแรกเดินสองช่องถึงมหาพีระมิด ถัดไปเลี้ยวขวา และเดินต่อไปอีกสองช่องเพื่อหยุดข้างธงคณะสำรวจ',
      hints: {
        tier1Structure: {
          en: 'Sequence: First + walk 2 blocks to Pyramid -> next + turn right -> continue 2 blocks to stop beside Flag.',
          th: 'ลำดับ: First + เดิน 2 ช่องถึงพีระมิด -> next + เลี้ยวขวา -> เดินต่อ 2 ช่องหยุดข้างธง',
        },
        tier2Focus: {
          en: 'Check both "two blocks" tiles: one after "First walk" and one after "continue".',
          th: 'มี "two blocks" 2 ชิ้น ใช้หลัง "First walk" และหลัง "continue"',
        },
        tier3Scaffold: {
          en: 'Model frame: "First walk two blocks to ___, next turn right, and continue two blocks to stop beside ___."',
          th: 'กรอบคำตอบ: "First walk two blocks to ___, next turn right, and continue two blocks to stop beside ___."',
        },
      },
    },
  },
  {
    challengeId: 'pr_6_full_visitor_tour',
    order: 6,
    title: {
      en: 'Full Guided Tour · Across the Giza Plateau',
      th: 'นำทางเต็มรูปแบบ · ข้ามลานมหาพีระมิดกีซา',
    },
    a2: {
      mode: 'a2',
      missionGoal: {
        en: 'Guide a visitor from the Information Point (facing North): walk one block north to the top corner, turn left, and go straight three blocks west past the Expedition Flag to the Great Pyramid.',
        th: 'นำทางจากจุดบริการข้อมูล (หันเหนือ): เดินขึ้นเหนือ 1 ช่องถึงมุมบนขวา เลี้ยวซ้าย แล้วเดินตรง 3 ช่องผ่านธงคณะสำรวจสู่มหาพีระมิด',
      },
      startPos: { x: 5, y: 1, facing: 'N' },
      targetPos: { x: 2, y: 0 },
      requiredWaypoints: ['flag', 'pyramid_north'],
      targetLandmarkId: 'pyramid_north',
      blockedCells: ARCHITECT_DEFAULT_BLOCKED_CELLS,
      tiles: makeTiles('pr6_a2', [
        { value: 'Walk', role: 'verb' },
        { value: 'one block,', role: 'phrase' },
        { value: 'turn left,', role: 'verb' },
        { value: 'and', role: 'connector' },
        { value: 'go straight', role: 'verb' },
        { value: 'three blocks', role: 'phrase' },
        { value: 'past the', role: 'prep' },
        { value: 'Expedition Flag', role: 'object' },
        { value: 'to the', role: 'prep' },
        { value: 'Great Pyramid', role: 'object' },
        { value: 'turn right,', role: 'verb', isDistractor: true },
        { value: 'four blocks', role: 'phrase', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^walk\s+one\s+block(?:,)?\s+turn\s+left(?:,)?\s+and\s+go\s+straight\s+three\s+blocks\s+past\s+the\s+expedition\s+flag\s+to\s+the\s+great\s+pyramid$/i,
      ],
      canonicalModel:
        'Walk one block, turn left, and go straight three blocks past the Expedition Flag to the Great Pyramid.',
      thaiScaffold: 'เดินหนึ่งช่อง เลี้ยวซ้าย แล้วเดินตรงสามช่องผ่านธงคณะสำรวจสู่มหาพีระมิด',
      hints: {
        tier1Structure: {
          en: 'Walk 1 block north to the top row, turn left (West), then go 3 blocks past the Flag to the Pyramid.',
          th: 'เดินขึ้นแถวบน 1 ช่อง เลี้ยวซ้าย (ตะวันตก) แล้วเดิน 3 ช่องผ่านธงสู่มหาพีระมิด',
        },
        tier2Focus: {
          en: 'Moving across the top ridge from the corner to the Great Pyramid takes "three blocks", passing the Expedition Flag along the way.',
          th: 'จากหัวมุมบนขวาเดินไปทางตะวันตกจนถึงมหาพีระมิดใช้ระยะ "three blocks" โดยผ่านธงคณะสำรวจระหว่างทาง',
        },
        tier3Scaffold: {
          en: 'Model frame: "Walk one block, turn left, and go straight three blocks past ___ to ___."',
          th: 'กรอบคำตอบ: "Walk one block, turn left, and go straight three blocks past ___ to ___."',
        },
      },
    },
    b1: {
      mode: 'b1',
      missionGoal: {
        en: 'From the Expedition Flag (facing West), walk four blocks west past the Great Pyramid to the north corner, then turn left and go one block south to stop beside the Viewing Platform.',
        th: 'นำเที่ยวจากธงคณะสำรวจ (หันตะวันตก): เดินไปทางตะวันตก 4 ช่องผ่านมหาพีระมิดจนถึงหัวมุมเหนือ จากนั้นเลี้ยวซ้ายเดินลงใต้ 1 ช่องไปหยุดข้างจุดชมวิว',
      },
      startPos: { x: 4, y: 0, facing: 'W' },
      targetPos: { x: 0, y: 1 },
      requiredWaypoints: ['pyramid_north', 'viewing_platform'],
      targetLandmarkId: 'viewing_platform',
      blockedCells: ARCHITECT_DEFAULT_BLOCKED_CELLS,
      tiles: makeTiles('pr6_b1', [
        { value: 'First,', role: 'sequencer' },
        { value: 'walk', role: 'verb' },
        { value: 'four blocks', role: 'phrase' },
        { value: 'past the', role: 'prep' },
        { value: 'Great Pyramid', role: 'object' },
        { value: 'to the north corner,', role: 'phrase' },
        { value: 'then', role: 'sequencer' },
        { value: 'turn left', role: 'verb' },
        { value: 'and', role: 'connector' },
        { value: 'go', role: 'verb' },
        { value: 'one block', role: 'phrase' },
        { value: 'to stop beside the', role: 'phrase' },
        { value: 'Viewing Platform', role: 'object' },
        { value: 'turn right', role: 'verb', isDistractor: true },
        { value: 'two blocks', role: 'phrase', isDistractor: true },
      ]),
      acceptedPatterns: [
        /^first(?:,)?\s+walk\s+four\s+blocks\s+past\s+the\s+great\s+pyramid\s+to\s+the\s+north\s+corner(?:,)?\s+then\s+turn\s+left\s+and\s+go\s+one\s+block\s+to\s+stop\s+beside\s+the\s+viewing\s+platform$/i,
      ],
      canonicalModel:
        'First, walk four blocks past the Great Pyramid to the north corner, then turn left and go one block to stop beside the Viewing Platform.',
      thaiScaffold:
        'ขั้นแรกเดินสี่ช่องผ่านมหาพีระมิดไปจนถึงหัวมุมเหนือ จากนั้นเลี้ยวซ้ายและเดินหนึ่งช่องเพื่อหยุดข้างจุดชมวิว',
      hints: {
        tier1Structure: {
          en: 'Leg 1 (4 blocks West across top ridge) -> then turn left (South) -> go 1 block to Viewing Platform.',
          th: 'ช่วง 1 (เดินตะวันตก 4 ช่องผ่านมหาพีระมิดถึงมุม) -> เลี้ยวซ้าย (ใต้) -> เดิน 1 ช่องหยุดข้างจุดชมวิว',
        },
        tier2Focus: {
          en: 'Across the entire top ridge to the west corner is "four blocks", and turning left from West faces South to the Viewing Platform.',
          th: 'เดินตามแนวบนสุดจนถึงหัวมุมตะวันตกใช้ "four blocks" และเมื่อหันตะวันตกแล้วเลี้ยวซ้ายจะได้ทิศใต้พอดี',
        },
        tier3Scaffold: {
          en: 'Model frame: "First, walk four blocks past ___ to the north corner, then turn left and go one block to stop beside ___."',
          th: 'กรอบคำตอบ: "First, walk four blocks past ___ to the north corner, then turn left and go one block to stop beside ___."',
        },
      },
    },
  },
];

/**
 * Deterministic clause-by-clause command simulation engine for Game 2.
 * Splits constructed English clauses by `,`, `and`, `then`, `next`, parses turns and step counts,
 * walks cell-by-cell checking bounds and blocked dunes, and checks required waypoints & destination.
 */
export function simulateArchitectRoute(
  variant: RouteArchitectVariant,
  sentence: string,
): ArchitectSimulationResult {
  const cleaned = normalizeEnglishSentenceForCheck(sentence);
  const validGrammar = matchesAuthoredPatterns(sentence, variant.acceptedPatterns);

  let cx = variant.startPos.x;
  let cy = variant.startPos.y;
  let facing: RouteDirectionKind = variant.startPos.facing;
  const path: ArchitectSimulationStep[] = [
    { x: cx, y: cy, facing, actionText: 'Start' },
  ];
  const visitedLandmarks = new Set<string>();
  const recordLandmarkAt = (x: number, y: number) => {
    for (const lm of ARCHITECT_BOARD_LANDMARKS) {
      if (lm.x === x && lm.y === y) {
        visitedLandmarks.add(lm.id);
      }
    }
  };
  recordLandmarkAt(cx, cy);

  const blockedSet = new Set(variant.blockedCells.map((c) => `${c.x},${c.y}`));
  let hitBlocked = false;
  let outOfBounds = false;

  const clauses = cleaned
    .split(/\s*(?:,|\band\b|\bthen\b|\bnext\b)\s*/i)
    .map((c) => c.trim())
    .filter(Boolean);

  for (const clause of clauses) {
    const lower = clause.toLowerCase();

    // Check explicit compass direction override when specified at start (e.g. "Walk east", "Walk north", "Head straight north")
    if (/\b(?:walk|head|go|continue)\b/.test(lower)) {
      if (/\bnorth\b(?!\s+corner)/.test(lower)) facing = 'N';
      else if (/\beast\b/.test(lower)) facing = 'E';
      else if (/\bsouth\b/.test(lower)) facing = 'S';
      else if (/\bwest\b/.test(lower)) facing = 'W';
    }

    if (/\bturn\s+left\b/.test(lower)) {
      facing = turnLeftDir(facing);
      path.push({ x: cx, y: cy, facing, actionText: clause });
    } else if (/\bturn\s+right\b/.test(lower)) {
      facing = turnRightDir(facing);
      path.push({ x: cx, y: cy, facing, actionText: clause });
    }

    const hasMotionVerb =
      /\b(?:walk|go|head|continue|step)\b/.test(lower) &&
      /\b(?:one|two|three|four|\d+|block|blocks)\b/.test(lower);

    if (hasMotionVerb) {
      const steps = parseWordSteps(lower);
      const { dx, dy } = stepDelta(facing);
      for (let s = 0; s < steps; s++) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (
          nx < 0 ||
          nx >= ARCHITECT_BOARD_COLS ||
          ny < 0 ||
          ny >= ARCHITECT_BOARD_ROWS
        ) {
          outOfBounds = true;
          path.push({ x: nx, y: ny, facing, actionText: `${clause} (out of bounds)` });
          break;
        }
        cx = nx;
        cy = ny;
        path.push({ x: cx, y: cy, facing, actionText: clause });
        recordLandmarkAt(cx, cy);
        if (blockedSet.has(`${cx},${cy}`)) {
          hitBlocked = true;
          break;
        }
      }
      if (outOfBounds || hitBlocked) break;
    }
  }

  const reachedEnd =
    !outOfBounds &&
    !hitBlocked &&
    cx === variant.targetPos.x &&
    cy === variant.targetPos.y;
  const visitedRequired = variant.requiredWaypoints.every((wp) => visitedLandmarks.has(wp));

  if (outOfBounds) {
    return {
      validGrammar,
      validRoute: false,
      reachedEnd: false,
      hitBlocked,
      outOfBounds: true,
      finalPos: { x: cx, y: cy },
      finalFacing: facing,
      path,
      failureReasonKey: 'out_of_bounds',
      feedback: {
        en: 'Your simulated route stepped outside the safe plateau map! Check your turn direction or number of blocks.',
        th: 'เส้นทางจำลองเดินออกนอกขอบเขตแผนที่ปลอดภัย! ลองเช็กทิศเลี้ยวหรือจำนวนช่องเดินอีกครั้ง',
      },
    };
  }

  if (hitBlocked) {
    return {
      validGrammar,
      validRoute: false,
      reachedEnd: false,
      hitBlocked: true,
      outOfBounds: false,
      finalPos: { x: cx, y: cy },
      finalFacing: facing,
      path,
      failureReasonKey: 'hit_blocked',
      feedback:
        variant.wrongOrderHint ?? {
          en: 'Your explorer entered a blocked sand mound or excavation cordon! Adjust the route order.',
          th: 'นักสำรวจเดินเข้าไปในเขตเนินทรายหวงห้าม! ลองปรับลำดับระยะทางหรือการเลี้ยวใหม่นะ',
        },
    };
  }

  if (!reachedEnd) {
    const landedLandmark = ARCHITECT_BOARD_LANDMARKS.find(
      (lm) => lm.x === cx && lm.y === cy,
    );
    const goalLandmark = ARCHITECT_BOARD_LANDMARKS.find(
      (lm) => lm.id === variant.targetLandmarkId,
    );
    return {
      validGrammar,
      validRoute: false,
      reachedEnd: false,
      hitBlocked: false,
      outOfBounds: false,
      finalPos: { x: cx, y: cy },
      finalFacing: facing,
      path,
      failureReasonKey: 'wrong_destination',
      feedback:
        variant.wrongOrderHint ?? {
          en: landedLandmark
            ? `The explorer stopped at the ${landedLandmark.label.en} instead of reaching the mission goal${goalLandmark ? ` (${goalLandmark.label.en})` : ''}. Adjust your turns or block count!`
            : `The explorer stopped before reaching the mission destination. Check your compass direction, turns, and block count!`,
          th: landedLandmark
            ? `นักสำรวจหยุดอยู่ที่ ${landedLandmark.label.th} ซึ่งยังไม่ตรงจุดหมายภารกิจ ลองปรับการเลี้ยวหรือจำนวนช่องเดินใหม่อีกครั้ง`
            : `นักสำรวจยังเดินไม่ถึงจุดหมายของภารกิจ ลองตรวจทิศทางเข็มทิศ การเลี้ยว และจำนวนช่องเดินอีกครั้ง`,
        },
    };
  }

  if (!visitedRequired) {
    return {
      validGrammar,
      validRoute: false,
      reachedEnd: true,
      hitBlocked: false,
      outOfBounds: false,
      finalPos: { x: cx, y: cy },
      finalFacing: facing,
      path,
      failureReasonKey: 'missed_waypoint',
      feedback: {
        en: 'Your route skipped a required landmark checkpoint along the way!',
        th: 'เส้นทางของคุณข้ามจุดอ้างอิงสำคัญระหว่างทางไปนะ',
      },
    };
  }

  if (!validGrammar) {
    return {
      validGrammar: false,
      validRoute: true,
      reachedEnd: true,
      hitBlocked: false,
      outOfBounds: false,
      finalPos: { x: cx, y: cy },
      finalFacing: facing,
      path,
      failureReasonKey: 'incomplete_phrase',
      feedback: {
        en: 'You reached the target square, but check the English phrasing—include complete prepositions, landmarks, and connectors.',
        th: 'เดินถึงช่องเป้าหมายแล้ว แต่ลองจัดรูปประโยคภาษาอังกฤษให้ครบถ้วนและเป็นธรรมชาติอีกนิดนะ',
      },
    };
  }

  return {
    validGrammar: true,
    validRoute: true,
    reachedEnd: true,
    hitBlocked: false,
    outOfBounds: false,
    finalPos: { x: cx, y: cy },
    finalFacing: facing,
    path,
    feedback: {
      en: 'Route verified! Your English directions guided the explorer safely to the exact landmark.',
      th: 'ตรวจสอบเส้นทางผ่าน! คำสั่งภาษาอังกฤษของคุณนำทางถึงจุดหมายอย่างปลอดภัย',
    },
  };
}

export function validatePyramidRouteArchitectSubmission(
  variant: RouteArchitectVariant,
  selectedTileValues: string[],
): ArchitectSimulationResult & { sentence: string } {
  const sentence = joinNormalizedTiles(selectedTileValues);
  if (!sentence || selectedTileValues.length < 3) {
    return {
      sentence,
      validGrammar: false,
      validRoute: false,
      reachedEnd: false,
      hitBlocked: false,
      outOfBounds: false,
      finalPos: { x: variant.startPos.x, y: variant.startPos.y },
      finalFacing: variant.startPos.facing,
      path: [
        {
          x: variant.startPos.x,
          y: variant.startPos.y,
          facing: variant.startPos.facing,
          actionText: 'Start',
        },
      ],
      failureReasonKey: 'incomplete_phrase',
      feedback: {
        en: 'Assemble your directional instruction tiles first, then press Test Route.',
        th: 'กรุณาเรียงป้ายคำสั่งบอกทางให้ครบก่อนกดทดสอบเส้นทาง',
      },
    };
  }

  const sim = simulateArchitectRoute(variant, sentence);
  return {
    ...sim,
    sentence,
  };
}

// ============================================================================
// GAME 3 — PAPYRUS INSTRUCTION WORKSHOP (6 A2 + 6 B1, 3 or 4 step clauses)
// ============================================================================

export const PAPYRUS_WORKSHOP_CHALLENGES: PapyrusWorkshopChallengeBundle[] = [
  {
    challengeId: 'pw_1_observation_notebook',
    order: 1,
    title: {
      en: 'Workshop 1 · Prepare Field Notebook',
      th: 'เวิร์กชอปที่ 1 · เตรียมสมุดบันทึกภาคสนาม',
    },
    a2: {
      mode: 'a2',
      scrollTopic: {
        en: 'Draft a 3-step scroll telling junior scribes how to start a daily observation sheet.',
        th: 'เขียนม้วนคำสั่ง 3 ขั้นตอนให้อาลักษณ์ฝึกหัดเริ่มจัดเตรียมสมุดบันทึกประจำวัน',
      },
      stepsInCorrectOrder: [
        {
          stepId: 's1',
          sceneKey: 'prepare_notebook',
          stepCaption: { en: 'Open a clean page', th: 'เปิดหน้ากระดาษที่สะอาด' },
          allowedSequencers: ['First,'],
          preferredSequencerIndex: 0,
          verbOptions: ['open', 'close', 'fold'],
          correctVerb: 'open',
          complementOptions: ['your field notebook', 'the heavy jar'],
          correctComplement: 'your field notebook',
        },
        {
          stepId: 's2',
          sceneKey: 'write_clue',
          stepCaption: { en: 'Copy the wall glyph', th: 'คัดลอกสัญลักษณ์บนผนัง' },
          allowedSequencers: ['Next,', 'Then,'],
          preferredSequencerIndex: 0,
          verbOptions: ['write', 'drop', 'hide'],
          correctVerb: 'write',
          complementOptions: ["today's site clue", 'the wet paint'],
          correctComplement: "today's site clue",
        },
        {
          stepId: 's3',
          sceneKey: 'pack_gear',
          stepCaption: { en: 'Tuck it safely away', th: 'เก็บเข้ากระเป๋าให้เรียบร้อย' },
          allowedSequencers: ['Finally,'],
          preferredSequencerIndex: 0,
          verbOptions: ['store', 'leave', 'scatter'],
          correctVerb: 'store',
          complementOptions: ['it in your bag', 'it in the river'],
          correctComplement: 'it in your bag',
        },
      ],
      canonicalLines: [
        'First, open your field notebook.',
        "Next, write today's site clue.",
        'Finally, store it in your bag.',
      ],
      thaiScaffold: '1) ขั้นแรกเปิดสมุดบันทึก 2) ต่อมาจดเบาะแสประจำวัน 3) สุดท้ายเก็บลงกระเป๋า',
      hints: {
        tier1Structure: {
          en: 'Each scroll line pairs [Sequencer] + [Base verb] + [Object].',
          th: 'แต่ละบรรทัดจับคู่ [คำเชื่อมลำดับ] + [กริยาช่อง 1] + [กรรม]',
        },
        tier2Focus: {
          en: 'Order of action: open notebook -> write clue -> store safely.',
          th: 'ลำดับเหตุการณ์: เปิดสมุด -> จดเบาะแส -> เก็บใส่กระเป๋า',
        },
        tier3Scaffold: {
          en: 'Model: First, open... / Next, write... / Finally, store...',
          th: 'แนวคำตอบ: First, open... / Next, write... / Finally, store...',
        },
      },
    },
    b1: {
      mode: 'b1',
      scrollTopic: {
        en: 'Draft a 4-step field archive protocol from opening your notebook to sealing the summary.',
        th: 'เขียนขั้นตอนการบันทึกข้อมูล 4 ขั้น ตั้งแต่เปิดสมุดจนถึงปิดผนึกม้วนสรุป',
      },
      stepsInCorrectOrder: [
        {
          stepId: 's1',
          sceneKey: 'prepare_notebook',
          stepCaption: { en: 'Prepare workspace', th: 'เตรียมพื้นที่และสมุด' },
          allowedSequencers: ['First,'],
          preferredSequencerIndex: 0,
          verbOptions: ['open', 'tear', 'pack'],
          correctVerb: 'open',
          complementOptions: ['a clean archive page', 'a wooden crate'],
          correctComplement: 'a clean archive page',
        },
        {
          stepId: 's2',
          sceneKey: 'sketch_carving',
          stepCaption: { en: 'Sketch the stone line', th: 'สเกตช์ภาพสลักหิน' },
          allowedSequencers: ['Next,', 'Then,'],
          preferredSequencerIndex: 0,
          verbOptions: ['sketch', 'wash', 'break'],
          correctVerb: 'sketch',
          complementOptions: ['each carved symbol clearly', 'the sandy path'],
          correctComplement: 'each carved symbol clearly',
        },
        {
          stepId: 's3',
          sceneKey: 'write_clue',
          stepCaption: { en: 'Label date & zone', th: 'ระบุวันที่และโซน' },
          allowedSequencers: ['Then,', 'After that,'],
          preferredSequencerIndex: 0,
          verbOptions: ['add', 'erase', 'forget'],
          correctVerb: 'add',
          complementOptions: ['the date and site zone', 'random guesses'],
          correctComplement: 'the date and site zone',
        },
        {
          stepId: 's4',
          sceneKey: 'deliver_camp',
          stepCaption: { en: 'Report to Dr. Layla', th: 'ส่งมอบให้ ดร.ไลลา' },
          allowedSequencers: ['Finally,'],
          preferredSequencerIndex: 0,
          verbOptions: ['deliver', 'throw', 'hide'],
          correctVerb: 'deliver',
          complementOptions: ['the record to base camp', 'the ink into sand'],
          correctComplement: 'the record to base camp',
        },
      ],
      canonicalLines: [
        'First, open a clean archive page.',
        'Next, sketch each carved symbol clearly.',
        'Then, add the date and site zone.',
        'Finally, deliver the record to base camp.',
      ],
      thaiScaffold: 'เปิดหน้ากระดาษสะอาด สเกตช์สัญลักษณ์ให้ชัด เติมวันที่และโซน แล้วนำส่งค่ายฐาน',
      hints: {
        tier1Structure: {
          en: 'Use four progressive markers: First -> Next -> Then -> Finally.',
          th: 'ใช้คำเชื่อมเรียง 4 ขั้น: First -> Next -> Then -> Finally',
        },
        tier2Focus: {
          en: 'You only add the date and zone AFTER sketching the carved symbol.',
          th: 'ใส่ "add the date and site zone" หลังจากวาดสเกตช์สัญลักษณ์เสร็จแล้ว',
        },
        tier3Scaffold: {
          en: 'Model: First, open... / Next, sketch... / Then, add... / Finally, deliver...',
          th: 'แนวคำตอบ: First, open... / Next, sketch... / Then, add... / Finally, deliver...',
        },
      },
    },
  },
  {
    challengeId: 'pw_2_making_papyrus',
    order: 2,
    title: {
      en: 'Workshop 2 · Craft a Papyrus Sheet',
      th: 'เวิร์กชอปที่ 2 · ขั้นตอนทำกระดาษปาปิรุส',
    },
    a2: {
      mode: 'a2',
      scrollTopic: {
        en: 'Write Mariam’s 3-step guide explaining how scribes turn Nile reeds into a flat papyrus sheet.',
        th: 'เขียนคู่มือ 3 ขั้นตอนของมาเรียมในการทำกระดาษปาปิรุสจากต้นกกไนล์',
      },
      stepsInCorrectOrder: [
        {
          stepId: 's1',
          sceneKey: 'gather_reeds',
          stepCaption: { en: 'Prepare reed strips', th: 'เตรียมเส้นกกริมไนล์' },
          allowedSequencers: ['First,'],
          preferredSequencerIndex: 0,
          verbOptions: ['soak', 'burn', 'paint'],
          correctVerb: 'soak',
          complementOptions: ['the reed strips in water', 'the wooden desk'],
          correctComplement: 'the reed strips in water',
        },
        {
          stepId: 's2',
          sceneKey: 'press_flat',
          stepCaption: { en: 'Press layers together', th: 'ทับแผ่นกกให้แบนเรียบ' },
          allowedSequencers: ['Then,', 'Next,'],
          preferredSequencerIndex: 0,
          verbOptions: ['press', 'cut', 'shake'],
          correctVerb: 'press',
          complementOptions: ['the woven layers flat', 'the brass lamp'],
          correctComplement: 'the woven layers flat',
        },
        {
          stepId: 's3',
          sceneKey: 'dry_sun',
          stepCaption: { en: 'Dry under warm air', th: 'ตากให้แห้งสนิท' },
          allowedSequencers: ['Finally,'],
          preferredSequencerIndex: 0,
          verbOptions: ['dry', 'sink', 'rip'],
          correctVerb: 'dry',
          complementOptions: ['the sheet completely', 'the stone column'],
          correctComplement: 'the sheet completely',
        },
      ],
      canonicalLines: [
        'First, soak the reed strips in water.',
        'Then, press the woven layers flat.',
        'Finally, dry the sheet completely.',
      ],
      thaiScaffold: '1) แช่เส้นกกในน้ำ 2) อัดทับชั้นกกให้เรียบ 3) ตากแผ่นปาปิรุสให้แห้งสนิท',
      hints: {
        tier1Structure: {
          en: 'Real craft order: wet/soak -> press flat -> dry.',
          th: 'ลำดับงานฝีมือจริง: แช่น้ำ -> กดทับ -> ตากแห้ง',
        },
        tier2Focus: {
          en: 'Choose "soak" first, "press" in the middle, and "dry" last.',
          th: 'เริ่มด้วย "soak" ขั้นกลางคือ "press" และจบด้วย "dry"',
        },
        tier3Scaffold: {
          en: 'Model: First, soak... / Then, press... / Finally, dry...',
          th: 'แนวคำตอบ: First, soak... / Then, press... / Finally, dry...',
        },
      },
    },
    b1: {
      mode: 'b1',
      scrollTopic: {
        en: 'Author a 4-step papyrus preparation instruction from slicing reeds to smoothing the dried sheet.',
        th: 'เขียนขั้นตอนเตรียมปาปิรุสอย่างละเอียด 4 ขั้น ตั้งแต่ตัดเส้นกกจนถึงขัดผิวให้เรียบ',
      },
      stepsInCorrectOrder: [
        {
          stepId: 's1',
          sceneKey: 'gather_reeds',
          stepCaption: { en: 'Slice & soak strips', th: 'ฝานและแช่เส้นกก' },
          allowedSequencers: ['First,'],
          preferredSequencerIndex: 0,
          verbOptions: ['soak', 'grind', 'drop'],
          correctVerb: 'soak',
          complementOptions: ['thin Nile reed strips', 'granite blocks'],
          correctComplement: 'thin Nile reed strips',
        },
        {
          stepId: 's2',
          sceneKey: 'press_flat',
          stepCaption: { en: 'Crisscross weave', th: 'เรียงสานไขว้แนว' },
          allowedSequencers: ['Next,'],
          preferredSequencerIndex: 0,
          verbOptions: ['layer', 'toss', 'erase'],
          correctVerb: 'layer',
          complementOptions: ['them in crisscross rows', 'them in a tent'],
          correctComplement: 'them in crisscross rows',
        },
        {
          stepId: 's3',
          sceneKey: 'dry_sun',
          stepCaption: { en: 'Press & dry flat', th: 'กดอัดและตากแห้ง' },
          allowedSequencers: ['After that,', 'Then,'],
          preferredSequencerIndex: 0,
          verbOptions: ['press', 'dip', 'fold'],
          correctVerb: 'press',
          complementOptions: ['the sheet until dry', 'the reed brush'],
          correctComplement: 'the sheet until dry',
        },
        {
          stepId: 's4',
          sceneKey: 'seal_scroll',
          stepCaption: { en: 'Smooth for ink', th: 'ขัดผิวพร้อมเขียนหมึก' },
          allowedSequencers: ['Finally,'],
          preferredSequencerIndex: 0,
          verbOptions: ['smooth', 'break', 'spill'],
          correctVerb: 'smooth',
          complementOptions: ['the surface for writing', 'the desert wind'],
          correctComplement: 'the surface for writing',
        },
      ],
      canonicalLines: [
        'First, soak thin Nile reed strips.',
        'Next, layer them in crisscross rows.',
        'After that, press the sheet until dry.',
        'Finally, smooth the surface for writing.',
      ],
      thaiScaffold: 'แช่เส้นกกบางๆ เรียงสลับไขว้กัน อัดให้แห้ง แล้วขัดผิวให้เรียบพร้อมเขียน',
      hints: {
        tier1Structure: {
          en: 'Logical crafting flow: soak -> layer -> press until dry -> smooth for writing.',
          th: 'ลำดับงานฝีมือ: แช่ -> เรียงไขว้ -> อัดให้แห้ง -> ขัดผิว',
        },
        tier2Focus: {
          en: 'Wait until the sheet is pressed dry BEFORE smoothing the surface for ink.',
          th: 'ต้องอัดจนแห้ง ("press the sheet until dry") ก่อนแล้วจึงขัดผิว',
        },
        tier3Scaffold: {
          en: 'Model: First, soak... / Next, layer... / After that, press... / Finally, smooth...',
          th: 'แนวคำตอบ: First, soak... / Next, layer... / After that, press... / Finally, smooth...',
        },
      },
    },
  },
  {
    challengeId: 'pw_3_route_directions',
    order: 3,
    title: {
      en: 'Workshop 3 · Three-Step Camp Route',
      th: 'เวิร์กชอปที่ 3 · คำแนะนำเส้นทาง 3 ขั้น',
    },
    a2: {
      mode: 'a2',
      scrollTopic: {
        en: 'Write a 3-step arrival checklist for new guests walking from the pier to the briefing tent.',
        th: 'เขียนคำแนะนำ 3 ขั้นตอนสำหรับผู้มาใหม่จากท่าน้ำสู่เต็นท์ปฐมนิเทศ',
      },
      stepsInCorrectOrder: [
        {
          stepId: 's1',
          sceneKey: 'follow_markers',
          stepCaption: { en: 'Walk along path', th: 'เดินตามทางไม้' },
          allowedSequencers: ['First,'],
          preferredSequencerIndex: 0,
          verbOptions: ['follow', 'jump', 'climb'],
          correctVerb: 'follow',
          complementOptions: ['the stone camp path', 'the deep river'],
          correctComplement: 'the stone camp path',
        },
        {
          stepId: 's2',
          sceneKey: 'check_map',
          stepCaption: { en: 'Check the sign', th: 'ดูป้ายแผนที่' },
          allowedSequencers: ['Next,', 'Then,'],
          preferredSequencerIndex: 0,
          verbOptions: ['read', 'cover', 'move'],
          correctVerb: 'read',
          complementOptions: ['the wooden signpost', 'the sand dune'],
          correctComplement: 'the wooden signpost',
        },
        {
          stepId: 's3',
          sceneKey: 'deliver_camp',
          stepCaption: { en: 'Meet Dr. Layla', th: 'พบ ดร.ไลลา' },
          allowedSequencers: ['Finally,'],
          preferredSequencerIndex: 0,
          verbOptions: ['meet', 'ignore', 'leave'],
          correctVerb: 'meet',
          complementOptions: ['Dr. Layla at the table', 'nobody at night'],
          correctComplement: 'Dr. Layla at the table',
        },
      ],
      canonicalLines: [
        'First, follow the stone camp path.',
        'Next, read the wooden signpost.',
        'Finally, meet Dr. Layla at the table.',
      ],
      thaiScaffold: '1) เดินตามทางหิน 2) อ่านป้ายบอกทางไม้ 3) พบ ดร.ไลลา ที่โต๊ะแผนที่',
      hints: {
        tier1Structure: {
          en: 'Three actions: follow path -> read signpost -> meet team leader.',
          th: '3 ขั้น: เดินตามทาง -> อ่านป้าย -> พบหัวหน้าทีม',
        },
        tier2Focus: {
          en: 'Pair "read" with "the wooden signpost" in step 2.',
          th: 'จับคู่ "read" กับ "the wooden signpost" ในขั้นที่ 2',
        },
        tier3Scaffold: {
          en: 'Model: First, follow... / Next, read... / Finally, meet...',
          th: 'แนวคำตอบ: First, follow... / Next, read... / Finally, meet...',
        },
      },
    },
    b1: {
      mode: 'b1',
      scrollTopic: {
        en: 'Draft a 4-step plateau walk protocol checking shade, markers, and safe arrival.',
        th: 'เขียนคู่มือเดินสำรวจ 4 ขั้น ตั้งแต่เช็กแผนที่จนถึงจุดหมายอย่างปลอดภัย',
      },
      stepsInCorrectOrder: [
        {
          stepId: 's1',
          sceneKey: 'check_map',
          stepCaption: { en: 'Inspect map first', th: 'ตรวจแผนที่ก่อนออกเดิน' },
          allowedSequencers: ['First,'],
          preferredSequencerIndex: 0,
          verbOptions: ['check', 'fold', 'lose'],
          correctVerb: 'check',
          complementOptions: ['the route map carefully', 'a closed box'],
          correctComplement: 'the route map carefully',
        },
        {
          stepId: 's2',
          sceneKey: 'follow_markers',
          stepCaption: { en: 'Stay on rope line', th: 'เดินตามแนวเชือก' },
          allowedSequencers: ['Next,'],
          preferredSequencerIndex: 0,
          verbOptions: ['stay', 'climb', 'run'],
          correctVerb: 'stay',
          complementOptions: ['between the rope markers', 'onto ancient carvings'],
          correctComplement: 'between the rope markers',
        },
        {
          stepId: 's3',
          sceneKey: 'point_sign',
          stepCaption: { en: 'Pause at shade tent', th: 'แวะเช็กที่จุดพัก' },
          allowedSequencers: ['Then,', 'After that,'],
          preferredSequencerIndex: 0,
          verbOptions: ['check', 'kick', 'hide'],
          correctVerb: 'check',
          complementOptions: ['in at the Giza shelter', 'under fragile stones'],
          correctComplement: 'in at the Giza shelter',
        },
        {
          stepId: 's4',
          sceneKey: 'deliver_camp',
          stepCaption: { en: 'Confirm team arrival', th: 'แจ้งยืนยันเมื่อถึงที่หมาย' },
          allowedSequencers: ['Finally,'],
          preferredSequencerIndex: 0,
          verbOptions: ['report', 'shout', 'leave'],
          correctVerb: 'report',
          complementOptions: ['safely to your guide', 'without telling anyone'],
          correctComplement: 'safely to your guide',
        },
      ],
      canonicalLines: [
        'First, check the route map carefully.',
        'Next, stay between the rope markers.',
        'Then, check in at the Giza shelter.',
        'Finally, report safely to your guide.',
      ],
      thaiScaffold: 'ตรวจแผนที่ให้ดี เดินในแนวเชือก เช็กชื่อที่จุดพักกีซา และรายงานตัวต่อผู้นำทาง',
      hints: {
        tier1Structure: {
          en: 'Map check -> follow rope markers -> check in at shelter -> report to guide.',
          th: 'ดูแผนที่ -> เดินตามแนวเชือก -> แวะจุดพัก -> รายงานผู้นำทาง',
        },
        tier2Focus: {
          en: 'Use "stay between the rope markers" for step 2 before checking in at the shelter.',
          th: 'ใช้ "stay between the rope markers" ในขั้นที่ 2 ก่อนแวะจุดพัก',
        },
        tier3Scaffold: {
          en: 'Model: First, check... / Next, stay... / Then, check in... / Finally, report...',
          th: 'แนวคำตอบ: First, check... / Next, stay... / Then, check in... / Finally, report...',
        },
      },
    },
  },
  {
    challengeId: 'pw_4_scribe_cleanup',
    order: 4,
    title: {
      en: 'Workshop 4 · Clean Scribe Station',
      th: 'เวิร์กชอปที่ 4 · จัดเก็บโต๊ะอาลักษณ์',
    },
    a2: {
      mode: 'a2',
      scrollTopic: {
        en: 'Write a 3-step closing checklist so reed pens and scrolls stay spotless.',
        th: 'เขียนขั้นตอนเก็บโต๊ะทำงาน 3 ขั้น เพื่อให้พู่กันและม้วนปาปิรุสสะอาดเรียบร้อย',
      },
      stepsInCorrectOrder: [
        {
          stepId: 's1',
          sceneKey: 'wash_brush',
          stepCaption: { en: 'Rinse reed brush', th: 'ล้างพู่กันกกให้สะอาด' },
          allowedSequencers: ['First,'],
          preferredSequencerIndex: 0,
          verbOptions: ['wash', 'break', 'drop'],
          correctVerb: 'wash',
          complementOptions: ['your reed brush clean', 'the dry scroll'],
          correctComplement: 'your reed brush clean',
        },
        {
          stepId: 's2',
          sceneKey: 'seal_scroll',
          stepCaption: { en: 'Cap mineral ink', th: 'ปิดฝาตลับหมึก' },
          allowedSequencers: ['Then,', 'Next,'],
          preferredSequencerIndex: 0,
          verbOptions: ['close', 'spill', 'open'],
          correctVerb: 'close',
          complementOptions: ['every ink jar tightly', 'the tent door wide'],
          correctComplement: 'every ink jar tightly',
        },
        {
          stepId: 's3',
          sceneKey: 'place_scroll',
          stepCaption: { en: 'Store finished scroll', th: 'เก็บม้วนกระดาษเข้าที่' },
          allowedSequencers: ['Finally,'],
          preferredSequencerIndex: 0,
          verbOptions: ['place', 'throw', 'wash'],
          correctVerb: 'place',
          complementOptions: ['the scroll in its basket', 'mud onto the desk'],
          correctComplement: 'the scroll in its basket',
        },
      ],
      canonicalLines: [
        'First, wash your reed brush clean.',
        'Then, close every ink jar tightly.',
        'Finally, place the scroll in its basket.',
      ],
      thaiScaffold: '1) ล้างพู่กันให้สะอาด 2) ปิดฝาขวดหมึกให้สนิท 3) วางม้วนกระดาษลงในกระเช้า',
      hints: {
        tier1Structure: {
          en: 'Three cleanup steps: wash brush -> close ink jars -> place scroll in basket.',
          th: '3 ขั้นตอนเก็บโต๊ะ: ล้างพู่กัน -> ปิดขวดหมึก -> เก็บม้วนกระดาษ',
        },
        tier2Focus: {
          en: 'Do not use "wash" on the dry scroll—wash the reed brush!',
          th: 'อย่าเลือก "the dry scroll" คู่กับ "wash" นะ ให้ล้างพู่กันแทน',
        },
        tier3Scaffold: {
          en: 'Model: First, wash... / Then, close... / Finally, place...',
          th: 'แนวคำตอบ: First, wash... / Then, close... / Finally, place...',
        },
      },
    },
    b1: {
      mode: 'b1',
      scrollTopic: {
        en: 'Compose a 4-step end-of-day conservation checklist for Mariam’s workshop.',
        th: 'เขียนขั้นตอนปิดโรงงานอาลักษณ์ประจำวัน 4 ขั้นตอนให้ครบถ้วน',
      },
      stepsInCorrectOrder: [
        {
          stepId: 's1',
          sceneKey: 'wash_brush',
          stepCaption: { en: 'Rinse ink tools', th: 'ล้างอุปกรณ์หมึก' },
          allowedSequencers: ['First,'],
          preferredSequencerIndex: 0,
          verbOptions: ['rinse', 'scatter', 'hide'],
          correctVerb: 'rinse',
          complementOptions: ['all brushes in clean water', 'dry parchment sheets'],
          correctComplement: 'all brushes in clean water',
        },
        {
          stepId: 's2',
          sceneKey: 'dry_sun',
          stepCaption: { en: 'Let ink sheets dry', th: 'รอหมึกแห้งสนิท' },
          allowedSequencers: ['Next,'],
          preferredSequencerIndex: 0,
          verbOptions: ['let', 'fold', 'tear'],
          correctVerb: 'let',
          complementOptions: ['freshly inked pages dry flat', 'heavy lids drop'],
          correctComplement: 'freshly inked pages dry flat',
        },
        {
          stepId: 's3',
          sceneKey: 'seal_scroll',
          stepCaption: { en: 'Seal pigment bowls', th: 'ปิดตลับสีแร่' },
          allowedSequencers: ['After that,', 'Then,'],
          preferredSequencerIndex: 0,
          verbOptions: ['seal', 'tip', 'mix'],
          correctVerb: 'seal',
          complementOptions: ['the mineral pigment bowls', 'sand with clean oil'],
          correctComplement: 'the mineral pigment bowls',
        },
        {
          stepId: 's4',
          sceneKey: 'place_scroll',
          stepCaption: { en: 'Archive in cedar box', th: 'เก็บในหีบไม้ซีดาร์' },
          allowedSequencers: ['Finally,'],
          preferredSequencerIndex: 0,
          verbOptions: ['store', 'leave', 'toss'],
          correctVerb: 'store',
          complementOptions: ['finished scrolls inside the cedar rack', 'tools under the Nile boat'],
          correctComplement: 'finished scrolls inside the cedar rack',
        },
      ],
      canonicalLines: [
        'First, rinse all brushes in clean water.',
        'Next, let freshly inked pages dry flat.',
        'After that, seal the mineral pigment bowls.',
        'Finally, store finished scrolls inside the cedar rack.',
      ],
      thaiScaffold: 'ล้างพู่กัน ปล่อยหน้ากระดาษให้แห้ง ปิดฝาตลับสีแร่ และเก็บม้วนกระดาษในชั้นไม้ซีดาร์',
      hints: {
        tier1Structure: {
          en: 'Wash tools -> dry fresh ink -> seal pigments -> archive finished scrolls.',
          th: 'ล้างพู่กัน -> รอหมึกแห้ง -> ปิดตลับสี -> เก็บม้วนกระดาษ',
        },
        tier2Focus: {
          en: 'Notice freshly inked pages must dry BEFORE you store them away.',
          th: 'ต้องปล่อยให้หมึกแห้งก่อน ("let freshly inked pages dry flat") แล้วจึงเก็บเข้าชั้น',
        },
        tier3Scaffold: {
          en: 'Model: First, rinse... / Next, let... / After that, seal... / Finally, store...',
          th: 'แนวคำตอบ: First, rinse... / Next, let... / After that, seal... / Finally, store...',
        },
      },
    },
  },
  {
    challengeId: 'pw_5_record_artifact',
    order: 5,
    title: {
      en: 'Workshop 5 · Record an Artifact Discovery',
      th: 'เวิร์กชอปที่ 5 · บันทึกการค้นพบโบราณวัตถุ',
    },
    a2: {
      mode: 'a2',
      scrollTopic: {
        en: 'Draft a 3-step guide for documenting a newly found pottery shard without moving it.',
        th: 'เขียนวิธีบันทึกหลักฐานชิ้นส่วนเครื่องปั้นดินเผา 3 ขั้นตอนโดยไม่เคลื่อนย้ายวัตถุ',
      },
      stepsInCorrectOrder: [
        {
          stepId: 's1',
          sceneKey: 'sketch_carving',
          stepCaption: { en: 'Sketch without lifting', th: 'วาดภาพโดยไม่หยิบยก' },
          allowedSequencers: ['First,'],
          preferredSequencerIndex: 0,
          verbOptions: ['sketch', 'lift', 'kick'],
          correctVerb: 'sketch',
          complementOptions: ['the shard right where it lies', 'the wooden pier'],
          correctComplement: 'the shard right where it lies',
        },
        {
          stepId: 's2',
          sceneKey: 'write_clue',
          stepCaption: { en: 'Measure size & color', th: 'จดขนาดและสี' },
          allowedSequencers: ['Next,', 'Then,'],
          preferredSequencerIndex: 0,
          verbOptions: ['note', 'guess', 'wash'],
          correctVerb: 'note',
          complementOptions: ['its size and painted lines', 'your favorite story'],
          correctComplement: 'its size and painted lines',
        },
        {
          stepId: 's3',
          sceneKey: 'deliver_camp',
          stepCaption: { en: 'Call the specialist', th: 'เรียกผู้เชี่ยวชาญมาตรวจ' },
          allowedSequencers: ['Finally,'],
          preferredSequencerIndex: 0,
          verbOptions: ['inform', 'hide', 'sell'],
          correctVerb: 'inform',
          complementOptions: ['Mariam to review your entry', 'nobody near the camp'],
          correctComplement: 'Mariam to review your entry',
        },
      ],
      canonicalLines: [
        'First, sketch the shard right where it lies.',
        'Next, note its size and painted lines.',
        'Finally, inform Mariam to review your entry.',
      ],
      thaiScaffold: '1) สเกตช์ตรงจุดที่พบ 2) จดขนาดและลวดลาย 3) แจ้งมาเรียมมาตรวจสอบ',
      hints: {
        tier1Structure: {
          en: 'Documentation order: observe/sketch -> record details -> inform specialist.',
          th: 'ลำดับบันทึกหลักฐาน: วาดตรงที่พบ -> จดรายละเอียด -> แจ้งผู้เชี่ยวชาญ',
        },
        tier2Focus: {
          en: 'Never lift or wash an unrecorded find—start with "sketch".',
          th: 'ห้ามหยิบหรือล้างก่อนบันทึก เริ่มด้วย "sketch" เสมอ',
        },
        tier3Scaffold: {
          en: 'Model: First, sketch... / Next, note... / Finally, inform...',
          th: 'แนวคำตอบ: First, sketch... / Next, note... / Finally, inform...',
        },
      },
    },
    b1: {
      mode: 'b1',
      scrollTopic: {
        en: 'Write a 4-step ethical excavation log for documenting an inscription in situ.',
        th: 'เขียนบันทึกขั้นตอนสำรวจจารึกอย่างมีจรรยาบรรณ 4 ขั้นตอน',
      },
      stepsInCorrectOrder: [
        {
          stepId: 's1',
          sceneKey: 'follow_markers',
          stepCaption: { en: 'Mark boundary safely', th: 'กั้นขอบเขตความปลอดภัย' },
          allowedSequencers: ['First,'],
          preferredSequencerIndex: 0,
          verbOptions: ['place', 'step', 'lean'],
          correctVerb: 'place',
          complementOptions: ['a marker beside the find', 'your boot onto the carving'],
          correctComplement: 'a marker beside the find',
        },
        {
          stepId: 's2',
          sceneKey: 'sketch_carving',
          stepCaption: { en: 'Copy symbols on grid', th: 'คัดลอกลายลงสมุดตาราง' },
          allowedSequencers: ['Next,'],
          preferredSequencerIndex: 0,
          verbOptions: ['draw', 'scrape', 'rub'],
          correctVerb: 'draw',
          complementOptions: ['the exact glyphs in your log', 'sand across the face'],
          correctComplement: 'the exact glyphs in your log',
        },
        {
          stepId: 's3',
          sceneKey: 'write_clue',
          stepCaption: { en: 'Record compass bearing', th: 'จดทิศเข็มทิศและตำแหน่ง' },
          allowedSequencers: ['Then,', 'After that,'],
          preferredSequencerIndex: 0,
          verbOptions: ['record', 'erase', 'alter'],
          correctVerb: 'record',
          complementOptions: ['compass bearing and grid spot', 'a fictional date'],
          correctComplement: 'compass bearing and grid spot',
        },
        {
          stepId: 's4',
          sceneKey: 'deliver_camp',
          stepCaption: { en: 'Submit official sheet', th: 'ส่งรายงานให้หัวหน้าทีม' },
          allowedSequencers: ['Finally,'],
          preferredSequencerIndex: 0,
          verbOptions: ['submit', 'bury', 'keep'],
          correctVerb: 'submit',
          complementOptions: ['the verified log to camp', 'the stone in your pack'],
          correctComplement: 'the verified log to camp',
        },
      ],
      canonicalLines: [
        'First, place a marker beside the find.',
        'Next, draw the exact glyphs in your log.',
        'Then, record compass bearing and grid spot.',
        'Finally, submit the verified log to camp.',
      ],
      thaiScaffold: 'วางหมุดข้างจุดที่พบ วาดอักษรลงสมุด บันทึกทิศเข็มทิศ และส่งรายงานเข้าค่าย',
      hints: {
        tier1Structure: {
          en: 'Protect zone -> sketch -> record coordinates -> submit log.',
          th: 'ทำเครื่องหมายเขต -> วาดภาพ -> จดพิกัดเข็มทิศ -> ส่งรายงาน',
        },
        tier2Focus: {
          en: 'Choose respectful verbs: place, draw, record, submit.',
          th: 'เลือกกริยาที่เหมาะสมกับงานอนุรักษ์: place, draw, record, submit',
        },
        tier3Scaffold: {
          en: 'Model: First, place... / Next, draw... / Then, record... / Finally, submit...',
          th: 'แนวคำตอบ: First, place... / Next, draw... / Then, record... / Finally, submit...',
        },
      },
    },
  },
  {
    challengeId: 'pw_6_visitor_guide',
    order: 6,
    title: {
      en: 'Workshop 6 · Visitor Orientation Scroll',
      th: 'เวิร์กชอปที่ 6 · คู่มือต้อนรับผู้เยี่ยมชม',
    },
    a2: {
      mode: 'a2',
      scrollTopic: {
        en: 'Create a 3-step welcome routine for guiding a school group into the courtyard.',
        th: 'สร้างขั้นตอน 3 ข้อสำหรับต้อนรับคณะนักเรียนเข้าชมลานวิหาร',
      },
      stepsInCorrectOrder: [
        {
          stepId: 's1',
          sceneKey: 'greet_visitor',
          stepCaption: { en: 'Greet guests warmly', th: 'ทักทายผู้มาเยือนอย่างสุภาพ' },
          allowedSequencers: ['First,'],
          preferredSequencerIndex: 0,
          verbOptions: ['welcome', 'rush', 'ignore'],
          correctVerb: 'welcome',
          complementOptions: ['guests at the stone gate', 'the tall sand dunes'],
          correctComplement: 'guests at the stone gate',
        },
        {
          stepId: 's2',
          sceneKey: 'point_sign',
          stepCaption: { en: 'Show map & shade', th: 'ชี้จุดแผนที่และร่มเงา' },
          allowedSequencers: ['Next,', 'Then,'],
          preferredSequencerIndex: 0,
          verbOptions: ['show', 'lock', 'cover'],
          correctVerb: 'show',
          complementOptions: ['the map and shade area', 'the locked drawer'],
          correctComplement: 'the map and shade area',
        },
        {
          stepId: 's3',
          sceneKey: 'explain_rule',
          stepCaption: { en: 'Remind stay-on-path rule', th: 'ย้ำกฎเดินตามทาง' },
          allowedSequencers: ['Finally,'],
          preferredSequencerIndex: 0,
          verbOptions: ['ask', 'force', 'order'],
          correctVerb: 'ask',
          complementOptions: ['everyone to stay on paths', 'everyone to climb walls'],
          correctComplement: 'everyone to stay on paths',
        },
      ],
      canonicalLines: [
        'First, welcome guests at the stone gate.',
        'Next, show the map and shade area.',
        'Finally, ask everyone to stay on paths.',
      ],
      thaiScaffold: '1) ต้อนรับผู้มาเยือนที่ประตูหิน 2) ชี้ให้ดูแผนที่และจุดร่มเงา 3) ขอให้ทุกคนเดินตามเส้นทาง',
      hints: {
        tier1Structure: {
          en: 'Hospitality order: welcome -> show map & shade -> kindly state path rule.',
          th: 'ลำดับการต้อนรับ: ทักทาย -> ชี้แผนที่และที่ร่ม -> ขอความร่วมมือเดินตามทาง',
        },
        tier2Focus: {
          en: 'Use friendly "ask" instead of harsh "force" for school guests.',
          th: 'ใช้คำสุภาพ "ask" แทนคำที่แข็งกร้าวอย่าง "force"',
        },
        tier3Scaffold: {
          en: 'Model: First, welcome... / Next, show... / Finally, ask...',
          th: 'แนวคำตอบ: First, welcome... / Next, show... / Finally, ask...',
        },
      },
    },
    b1: {
      mode: 'b1',
      scrollTopic: {
        en: 'Draft a 4-step visitor briefing covering greeting, route overview, safety reminder, and Q&A check.',
        th: 'เขียนขั้นตอนต้อนรับและชี้แจงผู้เยี่ยมชม 4 ขั้น รวมถึงการเช็กความเข้าใจตอนท้าย',
      },
      stepsInCorrectOrder: [
        {
          stepId: 's1',
          sceneKey: 'greet_visitor',
          stepCaption: { en: 'Greet & gather group', th: 'ทักทายและรวมกลุ่ม' },
          allowedSequencers: ['First,'],
          preferredSequencerIndex: 0,
          verbOptions: ['greet', 'dismiss', 'rush'],
          correctVerb: 'greet',
          complementOptions: ['visitors by the courtyard shade', 'strangers past the cordon'],
          correctComplement: 'visitors by the courtyard shade',
        },
        {
          stepId: 's2',
          sceneKey: 'point_sign',
          stepCaption: { en: 'Outline stops on map', th: 'ชี้จุดแวะบนแผนที่' },
          allowedSequencers: ['Next,'],
          preferredSequencerIndex: 0,
          verbOptions: ['point', 'erase', 'hide'],
          correctVerb: 'point',
          complementOptions: ['out each landmark on the map', 'out fragile cracks to touch'],
          correctComplement: 'out each landmark on the map',
        },
        {
          stepId: 's3',
          sceneKey: 'explain_rule',
          stepCaption: { en: 'Explain hands-off care', th: 'ชี้แจงข้อควรระวัง' },
          allowedSequencers: ['Then,', 'After that,'],
          preferredSequencerIndex: 0,
          verbOptions: ['remind', 'command', 'allow'],
          correctVerb: 'remind',
          complementOptions: ['everyone not to touch carvings', 'guests to sit on pillars'],
          correctComplement: 'everyone not to touch carvings',
        },
        {
          stepId: 's4',
          sceneKey: 'check_map',
          stepCaption: { en: 'Check questions before start', th: 'ถามเช็กความเข้าใจก่อนเริ่ม' },
          allowedSequencers: ['Finally,'],
          preferredSequencerIndex: 0,
          verbOptions: ['check', 'skip', 'refuse'],
          correctVerb: 'check',
          complementOptions: ['if anyone has questions', 'who ran ahead alone'],
          correctComplement: 'if anyone has questions',
        },
      ],
      canonicalLines: [
        'First, greet visitors by the courtyard shade.',
        'Next, point out each landmark on the map.',
        'Then, remind everyone not to touch carvings.',
        'Finally, check if anyone has questions.',
      ],
      thaiScaffold: 'ทักทายที่ร่มเงาลานวิหาร ชี้จุดสำคัญบนแผนที่ เตือนไม่ให้แตะสลักหิน และถามว่ามีข้อสงสัยไหม',
      hints: {
        tier1Structure: {
          en: 'Full briefing: greet -> point out map stops -> remind protection rule -> check for questions.',
          th: 'ครบวงจร: ทักทาย -> ชี้แผนที่ -> ย้ำกฎอนุรักษ์ -> เช็กคำถามก่อนเริ่มเดิน',
        },
        tier2Focus: {
          en: 'Always finish orientation by checking if visitors have questions!',
          th: 'ปิดท้ายการปฐมนิเทศด้วยการถามว่ามีใครสงสัยไหม ("check if anyone has questions")',
        },
        tier3Scaffold: {
          en: 'Model: First, greet... / Next, point... / Then, remind... / Finally, check...',
          th: 'แนวคำตอบ: First, greet... / Next, point... / Then, remind... / Finally, check...',
        },
      },
    },
  },
];

export interface PapyrusStepDraft {
  stepId: string;
  sequencer: string;
  verb: string;
  complement: string;
}

export function validatePapyrusWorkshopSubmission(
  variant: PapyrusWorkshopVariant,
  drafts: PapyrusStepDraft[],
): {
  isCorrect: boolean;
  lines: string[];
  joinedText: string;
  feedback: LocalizedText;
} {
  const expected = variant.stepsInCorrectOrder;
  const lines = drafts.map((d) =>
    joinNormalizedTiles([d.sequencer, d.verb, d.complement]),
  );
  const joinedText = lines.join(' ');

  if (drafts.length !== expected.length) {
    return {
      isCorrect: false,
      lines,
      joinedText,
      feedback: {
        en: `Complete all ${expected.length} steps in your scroll before checking.`,
        th: `กรุณาประกอบขั้นตอนให้ครบทั้ง ${expected.length} ขั้นก่อนตรวจคำตอบ`,
      },
    };
  }

  // Verify every step matches its expected position in logical sequence AND has complete sequencer + verb + complement
  for (let i = 0; i < expected.length; i++) {
    const spec = expected[i];
    const draft = drafts[i];
    if (!draft.sequencer || !draft.verb || !draft.complement) {
      return {
        isCorrect: false,
        lines,
        joinedText,
        feedback: {
          en: `Step ${i + 1} is incomplete—choose a sequencer, verb, and object phrase.`,
          th: `ขั้นตอนที่ ${i + 1} ยังไม่ครบ กรุณาเลือกคำเชื่อม กริยา และส่วนขยายให้ครบ`,
        },
      };
    }

    if (draft.stepId !== spec.stepId) {
      return {
        isCorrect: false,
        lines,
        joinedText,
        feedback: {
          en: `Check the logical sequence! Step ${i + 1} should come in a different order (use the Up/Down step arrows if needed).`,
          th: `ลำดับขั้นตอนยังไม่สมเหตุสมผล! ลองจัดเรียงตำแหน่งของขั้นที่ ${i + 1} ใหม่ด้วยปุ่มขึ้น-ลง`,
        },
      };
    }

    const seqOk = spec.allowedSequencers.some(
      (allowed) => allowed.toLowerCase() === draft.sequencer.trim().toLowerCase(),
    );
    if (!seqOk) {
      return {
        isCorrect: false,
        lines,
        joinedText,
        feedback: {
          en: `Check the sequencing word on Step ${i + 1}—use "${spec.allowedSequencers.join(' / ')}" here.`,
          th: `ลองเช็กคำเชื่อมลำดับในขั้นที่ ${i + 1} — จุดนี้ควรใช้ "${spec.allowedSequencers.join(' / ')}"`,
        },
      };
    }

    if (
      draft.verb.trim().toLowerCase() !== spec.correctVerb.toLowerCase() ||
      draft.complement.trim().toLowerCase() !== spec.correctComplement.toLowerCase()
    ) {
      return {
        isCorrect: false,
        lines,
        joinedText,
        feedback: {
          en: `Inspect Step ${i + 1} ("${spec.stepCaption.en}"): make sure both the action verb and object match the workshop task.`,
          th: `ตรวจคำในขั้นที่ ${i + 1} ("${spec.stepCaption.th}") อีกครั้ง ให้กริยาและกรรมตรงกับงานที่ต้องทำ`,
        },
      };
    }
  }

  return {
    isCorrect: true,
    lines,
    joinedText,
    feedback: {
      en: 'Scroll approved! Your multi-step English guide is clear, logical, and saved to your journal.',
      th: 'บันทึกม้วนคำสั่งสำเร็จ! ขั้นตอนถูกต้องเรียงตามลำดับชัดเจนและบันทึกเข้าสมุดคำสั่งแล้ว',
    },
  };
}
