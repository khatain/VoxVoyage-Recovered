import type { LocalizedText } from '../types/game';
import type { JaipurVocabObjectId } from './jaipurWorld';
import { shuffleDifferentFrom } from '../utils/shuffle';

export const SENTENCE_TRAIN_XP_REWARD = 50;
export const SENTENCE_TRAIN_ACTIVITY_ID = 'sentence_train';

export interface SentenceTrainChallenge {
  id: string;
  order: number;
  vocabId: JaipurVocabObjectId;
  targetLabel: LocalizedText;
  meaningCue: LocalizedText;
  words: string[];
  targetSentence: string;
  accentColor: string;
}

export interface SentenceWordTile {
  uid: string;
  word: string;
  colorIndex: number;
}

export const JAIPUR_SENTENCE_CHALLENGES: SentenceTrainChallenge[] = [
  {
    id: 'st_palace',
    order: 1,
    vocabId: 'palace',
    targetLabel: { en: 'Palace', th: 'พระราชวัง (Palace)' },
    meaningCue: {
      en: 'Describe how the Jaipur palace looks.',
      th: 'เรียงคำเพื่อบรรยายว่าพระราชวังสวยงาม',
    },
    words: ['The', 'palace', 'is', 'beautiful'],
    targetSentence: 'The palace is beautiful.',
    accentColor: '#E07A68',
  },
  {
    id: 'st_archway',
    order: 2,
    vocabId: 'archway',
    targetLabel: { en: 'Archway', th: 'ซุ้มประตูโค้ง (Archway)' },
    meaningCue: {
      en: 'Describe the height of the pink archway.',
      th: 'เรียงคำเพื่อบรรยายว่าซุ้มประตูโค้งสูงมาก',
    },
    words: ['The', 'archway', 'is', 'very', 'tall'],
    targetSentence: 'The archway is very tall.',
    accentColor: '#D95D48',
  },
  {
    id: 'st_market_stall',
    order: 3,
    vocabId: 'market_stall',
    targetLabel: { en: 'Market Stall', th: 'แผงขายของในตลาด (Market Stall)' },
    meaningCue: {
      en: 'Describe what the market stall sells.',
      th: 'เรียงคำเพื่อบอกว่าแผงในตลาดขายเสื้อผ้าสีสันสดใส',
    },
    words: ['The', 'market', 'stall', 'sells', 'colorful', 'clothes'],
    targetSentence: 'The market stall sells colorful clothes.',
    accentColor: '#E59A2B',
  },
  {
    id: 'st_colorful_fabric',
    order: 4,
    vocabId: 'colorful_fabric',
    targetLabel: { en: 'Colorful Fabric', th: 'ผ้าหลากสีสัน (Colorful Fabric)' },
    meaningCue: {
      en: 'Describe the colors of the traditional fabric.',
      th: 'เรียงคำเพื่อบรรยายว่าผ้าผืนนี้มีสีสันสดใส',
    },
    words: ['The', 'fabric', 'has', 'bright', 'colors'],
    targetSentence: 'The fabric has bright colors.',
    accentColor: '#D94A64',
  },
  {
    id: 'st_fountain',
    order: 5,
    vocabId: 'fountain',
    targetLabel: { en: 'Fountain', th: 'น้ำพุ (Fountain)' },
    meaningCue: {
      en: 'Describe where the stone fountain is located.',
      th: 'เรียงคำเพื่อบอกว่าน้ำพุตั้งอยู่ในลานจัตุรัส',
    },
    words: ['The', 'fountain', 'is', 'in', 'the', 'courtyard'],
    targetSentence: 'The fountain is in the courtyard.',
    accentColor: '#24B8B0',
  },
];

export function createShuffledTiles(
  challenge: SentenceTrainChallenge,
  rng: () => number = Math.random,
): SentenceWordTile[] {
  const base: SentenceWordTile[] = challenge.words.map((word, index) => ({
    uid: `${challenge.id}_${index}_${word}`,
    word,
    colorIndex: index % 5,
  }));

  return shuffleDifferentFrom(
    base,
    (a, b) => a.word === b.word,
    rng,
  );
}

export function checkSentenceOrder(
  placedWords: string[],
  challenge: SentenceTrainChallenge,
): boolean {
  if (placedWords.length !== challenge.words.length) return false;
  return challenge.words.every((targetWord, idx) => placedWords[idx] === targetWord);
}

export function getSentenceTrainClue(
  placedWords: string[],
  challenge: SentenceTrainChallenge,
): LocalizedText {
  if (placedWords.length < challenge.words.length) {
    return {
      en: `Place all ${challenge.words.length} word tiles onto the train track first.`,
      th: `กรุณาวางคำศัพท์ให้ครบทั้ง ${challenge.words.length} คำบนรางรถไฟก่อนตรวจคำตอบ`,
    };
  }

  // Case-only mismatch (e.g., 'the' vs 'The' in Challenge 5)
  const caseInsensitiveMatch = challenge.words.every(
    (w, i) => placedWords[i]?.toLowerCase() === w.toLowerCase(),
  );
  if (caseInsensitiveMatch) {
    return {
      en: "Almost perfect! Remember to start the sentence with the capitalized word 'The'.",
      th: "เกือบถูกแล้ว! คำขึ้นต้นประโยคต้องเป็น 'The' ตัวพิมพ์ใหญ่",
    };
  }

  if (placedWords[0] !== challenge.words[0]) {
    return {
      en: "Clue: Start your train with the capitalized subject starter ('The').",
      th: "คำใบ้: เริ่มต้นขบวนรถไฟด้วยคำขึ้นต้นตัวพิมพ์ใหญ่ ('The')",
    };
  }

  if (
    challenge.vocabId === 'market_stall' &&
    placedWords.indexOf('stall') < placedWords.indexOf('market')
  ) {
    return {
      en: "Clue: Put 'market' before 'stall' to name the place.",
      th: "คำใบ้: คำว่า 'market' ต้องอยู่หน้าคำว่า 'stall' (market stall)",
    };
  }

  const verbIndex = challenge.words.findIndex((w) => w === 'is' || w === 'has' || w === 'sells');
  if (verbIndex >= 0 && placedWords[verbIndex] !== challenge.words[verbIndex]) {
    const verbWord = challenge.words[verbIndex];
    return {
      en: `Clue: Place the verb '${verbWord}' right after the subject.`,
      th: `คำใบ้: วางคำกริยา '${verbWord}' ไว้ถัดจากประธานของประโยค`,
    };
  }

  return {
    en: 'Clue: In English, describing words come before the noun (or place phrase at the end). Try adjusting the last carriages!',
    th: 'คำใบ้: คำขยายต้องอยู่หน้าคำนาม หรือวลีบอกสถานที่จะอยู่ท้ายประโยค ลองสลับคำท้ายขบวนดูนะ',
  };
}
