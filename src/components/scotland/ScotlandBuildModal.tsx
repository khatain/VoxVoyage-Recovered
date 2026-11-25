import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Compass,
  HelpCircle,
  Mic,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import type { AppLanguage, LocalizedText, ResolvedAppearance } from '../../types/game';
import { GAME_COPY } from '../../data/i18n';
import {
  evaluateMasterComparisonText,
  GAME1_EVIDENCE_CARDS,
  GAME1_SENTENCE_PATHS,
  GAME2_ATTRIBUTE_ITEMS,
  GAME2_PATTERN_CHOICES,
  GAME3_CLAUSE_BUNDLE,
  GAME3_FOOD_EVIDENCE_CARDS,
  GAME4_FESTIVAL_CARDS,
  GAME4_SENTENCE_FRAMES,
  GAME5_CONCRETE_EXAMPLES,
  GAME5_DIFFERENCE_CARDS,
  GAME5_SIMILARITY_CARDS,
  getScotlandBuildStation,
  SCOTLAND_BUILD_STATIONS,
  validateGame1Sentence,
} from '../../data/scotlandBuild';
import {
  SCOTLAND_EVIDENCE_ITEMS,
  type ComparisonZone,
  type ScotlandDifficultyMode,
} from '../../data/scotlandDiscovery';
import type { ScotlandLandmarkId } from '../../data/scotlandWorld';
import { shuffleArray, shuffleDifferentFrom } from '../../utils/shuffle';
import { ScotlandStationIllustrationSVG } from './ScotlandCulturalIllustrationSVG';
import { ScotlandTartanRibbonDivider, ScotlandZoneCrestSVG } from './ScotlandMiniGameArtwork';

interface ScotlandBuildModalProps {
  stationId: ScotlandLandmarkId;
  language: AppLanguage;
  appearance: ResolvedAppearance;
  existingSentence?: string;
  builtSentences: Record<string, string>;
  discoveredEvidenceIds: ScotlandLandmarkId[];
  difficultyMode: ScotlandDifficultyMode;
  onDifficultyChange: (mode: ScotlandDifficultyMode) => void;
  onCompleteStation: (stationId: ScotlandLandmarkId, builtSentence: string) => void;
  onOpenDiscoverReview: (stationId: ScotlandLandmarkId) => void;
  onOpenJournal: (stationId: ScotlandLandmarkId) => void;
  onInspectLandmarkInfo: () => void;
  onClose: () => void;
  onPlaySfx: (kind?: 'click' | 'select' | 'reward') => void;
}

interface FeedbackState {
  tone: 'success' | 'retry';
  message: LocalizedText;
}

interface SpeechRecognitionAlternativeLike {
  transcript?: string;
}

interface SpeechRecognitionResultLike {
  0?: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  results?: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const win = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null;
}

export function ScotlandBuildModal({
  stationId,
  language,
  appearance,
  existingSentence,
  builtSentences,
  discoveredEvidenceIds,
  difficultyMode,
  onDifficultyChange,
  onCompleteStation,
  onOpenDiscoverReview,
  onOpenJournal,
  onInspectLandmarkInfo,
  onClose,
  onPlaySfx,
}: ScotlandBuildModalProps) {
  const copy = GAME_COPY[language];
  const isNight = appearance === 'night';
  const station = getScotlandBuildStation(stationId);

  const [attemptNonce, setAttemptNonce] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [savedSentence, setSavedSentence] = useState<string | null>(null);

  // Shuffled choices/cards/tiles stable while answering, re-shuffled on new attempt / replay
  const shuffledGame1Cards = useMemo(
    () => shuffleArray(GAME1_EVIDENCE_CARDS),
    [stationId, attemptNonce],
  );
  const shuffledGame1TilesA2 = useMemo(
    () => shuffleDifferentFrom(GAME1_SENTENCE_PATHS.a2.tiles, (a, b) => a.id === b.id),
    [stationId, attemptNonce],
  );
  const shuffledGame1TilesB1 = useMemo(
    () => shuffleDifferentFrom(GAME1_SENTENCE_PATHS.b1.tiles, (a, b) => a.id === b.id),
    [stationId, attemptNonce],
  );
  const shuffledGame2Attrs = useMemo(
    () => shuffleArray(GAME2_ATTRIBUTE_ITEMS),
    [stationId, attemptNonce],
  );
  const shuffledGame2TailsByMode = useMemo(
    () =>
      Object.fromEntries(
        GAME2_PATTERN_CHOICES.map((frame) => [frame.id, shuffleArray(frame.tailOptions)]),
      ),
    [stationId, attemptNonce],
  );
  const shuffledGame3Cards = useMemo(
    () => shuffleArray(GAME3_FOOD_EVIDENCE_CARDS),
    [stationId, attemptNonce],
  );
  const shuffledGame3Scottish = useMemo(
    () => shuffleArray(GAME3_CLAUSE_BUNDLE.scottishClauses),
    [stationId, attemptNonce],
  );
  const shuffledGame3Connectors = useMemo(
    () => shuffleArray(GAME3_CLAUSE_BUNDLE.connectors),
    [stationId, attemptNonce],
  );
  const shuffledGame3Thai = useMemo(
    () => shuffleArray(GAME3_CLAUSE_BUNDLE.thaiClauses),
    [stationId, attemptNonce],
  );
  const shuffledGame4Cards = useMemo(
    () => shuffleArray(GAME4_FESTIVAL_CARDS),
    [stationId, attemptNonce],
  );
  const shuffledGame4Frames = useMemo(
    () => shuffleArray(GAME4_SENTENCE_FRAMES),
    [stationId, attemptNonce],
  );
  const shuffledGame4ClausesByFrame = useMemo(
    () =>
      Object.fromEntries(
        GAME4_SENTENCE_FRAMES.map((frame) => [frame.id, shuffleArray(frame.clauses)]),
      ),
    [stationId, attemptNonce],
  );
  const shuffledGame5Similarities = useMemo(
    () => shuffleArray(GAME5_SIMILARITY_CARDS),
    [stationId, attemptNonce],
  );
  const shuffledGame5Differences = useMemo(
    () => shuffleArray(GAME5_DIFFERENCE_CARDS),
    [stationId, attemptNonce],
  );
  const shuffledGame5Examples = useMemo(
    () => shuffleArray(GAME5_CONCRETE_EXAMPLES),
    [stationId, attemptNonce],
  );

  // Game 1 state
  const [g1PickedEvidenceIds, setG1PickedEvidenceIds] = useState<string[]>([]);
  const [g1PlacedTileIds, setG1PlacedTileIds] = useState<string[]>([]);

  // Game 2 state
  const [g2SelectedAttrId, setG2SelectedAttrId] = useState(() => shuffledGame2Attrs[0].id);
  const [g2SortedAttrs, setG2SortedAttrs] = useState<Record<string, 'similar_to' | 'different_from'>>(
    {},
  );
  const [g2FrameMode, setG2FrameMode] = useState<'similar_to' | 'different_from'>('similar_to');
  const [g2SelectedTailId, setG2SelectedTailId] = useState<string | null>(null);

  // Game 3 state
  const [g3PickedCardIds, setG3PickedCardIds] = useState<string[]>([]);
  const [g3ScottishId, setG3ScottishId] = useState<string | null>(null);
  const [g3Connector, setG3Connector] = useState<'while' | 'whereas' | null>(null);
  const [g3ThaiId, setG3ThaiId] = useState<string | null>(null);

  // Game 4 state
  const [g4SelectedCardId, setG4SelectedCardId] = useState(() => shuffledGame4Cards[0].id);
  const [g4SortedZones, setG4SortedZones] = useState<Record<string, ComparisonZone>>({});
  const [g4FrameId, setG4FrameId] = useState(() => shuffledGame4Frames[0].id);
  const [g4ClauseId, setG4ClauseId] = useState<string | null>(null);

  // Game 5 state
  const [g5SimId, setG5SimId] = useState<string | null>(null);
  const [g5DiffId, setG5DiffId] = useState<string | null>(null);
  const [g5ExampleId, setG5ExampleId] = useState<string | null>(null);
  const [g5CustomText, setG5CustomText] = useState('');

  // Optional Voice Practice State
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [isListeningSpeech, setIsListeningSpeech] = useState(false);
  const [spokenHeard, setSpokenHeard] = useState<string | null>(null);
  const speechSupported = useMemo(() => getSpeechRecognitionCtor() !== null, []);

  useEffect(() => {
    setG2SelectedAttrId(shuffledGame2Attrs[0].id);
  }, [shuffledGame2Attrs]);

  useEffect(() => {
    setG4SelectedCardId(shuffledGame4Cards[0].id);
  }, [shuffledGame4Cards]);

  useEffect(() => {
    setG4FrameId(shuffledGame4Frames[0].id);
  }, [shuffledGame4Frames]);

  useEffect(() => {
    setG1PlacedTileIds([]);
    setFeedback(null);
  }, [difficultyMode]);

  const stopAudioAndMic = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore stop errors
      }
      recognitionRef.current = null;
    }
    setIsListeningSpeech(false);
  };

  const speakEnglish = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.93;
    utterance.pitch = 1.03;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        stopAudioAndMic();
        onPlaySfx('click');
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      stopAudioAndMic();
    };
  }, [onClose, onPlaySfx]);

  const startSpeechPractice = (targetSentence: string) => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;
    if (isListeningSpeech) {
      stopAudioAndMic();
      return;
    }
    stopAudioAndMic();
    try {
      const rec = new Ctor();
      rec.lang = 'en-US';
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript?.trim() ?? '';
        setSpokenHeard(transcript || targetSentence);
        setIsListeningSpeech(false);
      };
      rec.onerror = () => {
        setIsListeningSpeech(false);
      };
      rec.onend = () => {
        setIsListeningSpeech(false);
      };
      recognitionRef.current = rec;
      setIsListeningSpeech(true);
      rec.start();
    } catch {
      setIsListeningSpeech(false);
    }
  };

  const saveAndFinishStation = (sentence: string) => {
    const clean = sentence.trim();
    setSavedSentence(clean);
    onPlaySfx('reward');
    onCompleteStation(stationId, clean);
  };

  const resetStation = () => {
    stopAudioAndMic();
    onPlaySfx('click');
    setAttemptNonce((n) => n + 1);
    setShowHint(false);
    setFeedback(null);
    setSavedSentence(null);
    setSpokenHeard(null);
    setG1PickedEvidenceIds([]);
    setG1PlacedTileIds([]);
    setG2SortedAttrs({});
    setG2FrameMode('similar_to');
    setG2SelectedTailId(null);
    setG3PickedCardIds([]);
    setG3ScottishId(null);
    setG3Connector(null);
    setG3ThaiId(null);
    setG4SortedZones({});
    setG4ClauseId(null);
    setG5SimId(null);
    setG5DiffId(null);
    setG5ExampleId(null);
    setG5CustomText('');
  };

  const cardSurface = isNight
    ? 'border-white/12 bg-[#172442] text-[#F7F9FC]'
    : 'border-[#CBD5E1] bg-white text-[#1E2E46]';

  const subtlePanel = isNight
    ? 'border-white/10 bg-[#111A31] text-[#E2ECF9]'
    : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#1E2E46]';

  // === GAME 1 LOGIC ===
  const activeG1Tiles =
    difficultyMode === 'a2' ? shuffledGame1TilesA2 : shuffledGame1TilesB1;
  const g1PlacedWords = g1PlacedTileIds
    .map((id) => activeG1Tiles.find((t) => t.id === id)?.text)
    .filter((x): x is string => Boolean(x));
  const g1HasScotland = g1PickedEvidenceIds.some(
    (id) => GAME1_EVIDENCE_CARDS.find((c) => c.id === id)?.side === 'scotland',
  );
  const g1HasThailand = g1PickedEvidenceIds.some(
    (id) => GAME1_EVIDENCE_CARDS.find((c) => c.id === id)?.side === 'thailand',
  );
  const g1EvidenceReady = g1HasScotland && g1HasThailand;

  const handleToggleGame1Card = (cardId: string) => {
    const card = GAME1_EVIDENCE_CARDS.find((c) => c.id === cardId);
    if (!card) return;
    if (card.side === 'stereotype') {
      onPlaySfx('click');
      setFeedback({ tone: 'retry', message: card.feedback });
      return;
    }
    onPlaySfx('select');
    setG1PickedEvidenceIds((prev) =>
      prev.includes(cardId) ? prev : [...prev, cardId],
    );
    setFeedback({ tone: 'success', message: card.feedback });
  };

  const handleVerifyGame1 = () => {
    const res = validateGame1Sentence(g1PlacedWords, difficultyMode);
    if (res.valid) {
      setFeedback({ tone: 'success', message: res.feedback });
      saveAndFinishStation(res.sentence);
    } else {
      onPlaySfx('click');
      setFeedback({ tone: 'retry', message: res.feedback });
    }
  };

  // === GAME 2 LOGIC ===
  const g2AttrsAllSorted =
    Object.keys(g2SortedAttrs).length >= GAME2_ATTRIBUTE_ITEMS.length;
  const activeG2Frame =
    GAME2_PATTERN_CHOICES.find((f) => f.mode === g2FrameMode) ?? GAME2_PATTERN_CHOICES[0];

  const handleSortG2Attr = (bucket: 'similar_to' | 'different_from') => {
    const attr =
      GAME2_ATTRIBUTE_ITEMS.find((a) => a.id === g2SelectedAttrId) ?? GAME2_ATTRIBUTE_ITEMS[0];
    if (g2SortedAttrs[attr.id]) return;
    if (attr.targetBucket === bucket) {
      onPlaySfx('select');
      const next = { ...g2SortedAttrs, [attr.id]: bucket };
      setG2SortedAttrs(next);
      setFeedback({ tone: 'success', message: attr.explanation[bucket] });
      const nextRemaining = shuffledGame2Attrs.find((a) => !next[a.id]);
      if (nextRemaining) setG2SelectedAttrId(nextRemaining.id);
    } else {
      onPlaySfx('click');
      setFeedback({ tone: 'retry', message: attr.explanation[bucket] });
    }
  };

  const handleVerifyGame2 = () => {
    const tail = activeG2Frame.tailOptions.find((t) => t.id === g2SelectedTailId);
    if (!tail) {
      onPlaySfx('click');
      setFeedback({
        tone: 'retry',
        message: {
          en: 'Choose a matching clause ending to complete your sentence.',
          th: 'กรุณาเลือกส่วนขยายท้ายประโยคให้เข้ากับคำเชื่อมที่เลือกไว้',
        },
      });
      return;
    }
    if (tail.isValidForMode === g2FrameMode) {
      const sentence = `${activeG2Frame.subject} ${activeG2Frame.connector} ${tail.text}`;
      setFeedback({ tone: 'success', message: tail.feedback });
      saveAndFinishStation(sentence);
    } else {
      onPlaySfx('click');
      setFeedback({ tone: 'retry', message: tail.feedback });
    }
  };

  // === GAME 3 LOGIC ===
  const g3RequiredIds = GAME3_FOOD_EVIDENCE_CARDS.filter((c) => c.side !== 'stereotype').map(
    (c) => c.id,
  );
  const g3EvidenceReady = g3RequiredIds.every((id) => g3PickedCardIds.includes(id));

  const handlePickGame3Card = (cardId: string) => {
    const card = GAME3_FOOD_EVIDENCE_CARDS.find((c) => c.id === cardId);
    if (!card) return;
    if (card.side === 'stereotype') {
      onPlaySfx('click');
      setFeedback({ tone: 'retry', message: card.feedback });
      return;
    }
    onPlaySfx('select');
    setG3PickedCardIds((prev) => (prev.includes(cardId) ? prev : [...prev, cardId]));
    setFeedback({ tone: 'success', message: card.feedback });
  };

  const handleVerifyGame3 = () => {
    const sc = GAME3_CLAUSE_BUNDLE.scottishClauses.find((c) => c.id === g3ScottishId);
    const th = GAME3_CLAUSE_BUNDLE.thaiClauses.find((c) => c.id === g3ThaiId);
    if (!sc || !g3Connector || !th) {
      onPlaySfx('click');
      setFeedback({
        tone: 'retry',
        message: {
          en: 'Select a Scottish food clause, choose "while" or "whereas", and pick a Thai food clause.',
          th: 'เลือกประโยคอาหารสกอต คำเชื่อม "while" หรือ "whereas" และประโยคอาหารไทยให้ครบ',
        },
      });
      return;
    }
    const sentence = `${sc.text}, ${g3Connector} ${th.text}`;
    setFeedback({
      tone: 'success',
      message: {
        en: `Great "${g3Connector}" contrast! Both clauses accurately connect climate and regional cuisine.`,
        th: `ยอดเยี่ยม! ประโยคเปรียบต่างด้วย "${g3Connector}" เชื่อมโยงภูมิอากาศกับอาหารท้องถิ่นได้อย่างชัดเจน`,
      },
    });
    saveAndFinishStation(sentence);
  };

  // === GAME 4 LOGIC ===
  const g4AllSorted = Object.keys(g4SortedZones).length >= GAME4_FESTIVAL_CARDS.length;
  const activeG4Frame =
    GAME4_SENTENCE_FRAMES.find((f) => f.id === g4FrameId) ?? GAME4_SENTENCE_FRAMES[0];

  const handleSortGame4Card = (zone: ComparisonZone) => {
    const card = GAME4_FESTIVAL_CARDS.find((c) => c.id === g4SelectedCardId) ?? GAME4_FESTIVAL_CARDS[0];
    if (g4SortedZones[card.id]) return;
    if (card.targetZone === zone) {
      onPlaySfx('select');
      const next = { ...g4SortedZones, [card.id]: zone };
      setG4SortedZones(next);
      setFeedback({ tone: 'success', message: card.feedback[zone] });
      const nextRemaining = shuffledGame4Cards.find((c) => !next[c.id]);
      if (nextRemaining) setG4SelectedCardId(nextRemaining.id);
    } else {
      onPlaySfx('click');
      setFeedback({ tone: 'retry', message: card.feedback[zone] });
    }
  };

  const handleVerifyGame4 = () => {
    const clause = activeG4Frame.clauses.find((c) => c.id === g4ClauseId);
    if (!clause) {
      onPlaySfx('click');
      setFeedback({
        tone: 'retry',
        message: {
          en: 'Choose a contrast connector ("unlike", "while", or "whereas") and select a festival pair card.',
          th: 'กรุณาเลือกคำเชื่อมความต่างและจับคู่ประโยคเทศกาลให้ครบ',
        },
      });
      return;
    }
    const sentence = activeG4Frame.buildText(clause.scotlandPart, clause.thaiPart);
    setFeedback({
      tone: 'success',
      message: {
        en: `Festival comparison crafted using "${activeG4Frame.connector}"!`,
        th: `สร้างประโยคเปรียบเทียบเทศกาลด้วย "${activeG4Frame.connector}" สำเร็จ!`,
      },
    });
    saveAndFinishStation(sentence);
  };

  // === GAME 5 LOGIC ===
  const g5ModularPreview = (() => {
    const sim = GAME5_SIMILARITY_CARDS.find((c) => c.id === g5SimId);
    const diff = GAME5_DIFFERENCE_CARDS.find((c) => c.id === g5DiffId);
    const ex = GAME5_CONCRETE_EXAMPLES.find((c) => c.id === g5ExampleId);
    const parts = [sim?.sentence, diff?.sentence, ex?.clauseAddition].filter(Boolean);
    return parts.join(' ');
  })();

  const g5EffectiveText =
    difficultyMode === 'b1' && g5CustomText.trim().length > 0 ? g5CustomText : g5ModularPreview;
  const g5Eval = evaluateMasterComparisonText(g5EffectiveText);

  const handleVerifyGame5 = () => {
    if (difficultyMode === 'a2') {
      if (!g5SimId || !g5DiffId || !g5ExampleId) {
        onPlaySfx('click');
        setFeedback({
          tone: 'retry',
          message: {
            en: 'Pick 1 Similarity bridge, 1 Difference bridge, and 1 Specific Cultural Example from your Journal.',
            th: 'กรุณาเลือกประโยคความเหมือน 1 ข้อ ความต่าง 1 ข้อ และตัวอย่างวัฒนธรรมเฉพาะ 1 ข้อให้ครบ',
          },
        });
        return;
      }
    }

    const result = evaluateMasterComparisonText(g5EffectiveText);
    if (result.valid) {
      setFeedback({ tone: 'success', message: result.feedback });
      saveAndFinishStation(g5EffectiveText);
    } else {
      onPlaySfx('click');
      setFeedback({ tone: 'retry', message: result.feedback });
    }
  };

  const completedBuildCount = SCOTLAND_BUILD_STATIONS.filter((st) =>
    Boolean(builtSentences[st.id]),
  ).length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="scotland-build-modal-title"
      className={`fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-5 ${
        isNight ? 'bg-[#090F1E]/74' : 'bg-[#20304A]/34'
      }`}
    >
      <div
        className={`flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border-2 shadow-2xl ${
          isNight
            ? 'border-[#F2C66D]/55 bg-[#121C36] text-[#F7F9FC]'
            : 'border-[#CBD5E1] bg-[#FFFDF8] text-[#1E2E46]'
        }`}
      >
        <ScotlandTartanRibbonDivider />

        {/* Header */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 ${
            isNight ? 'border-white/12 bg-[#162340]' : 'border-[#E2E8F0] bg-[#EEF6F4]'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <ScotlandStationIllustrationSVG
              stationId={stationId}
              className="h-12 w-12 shrink-0 rounded-xl border border-black/15 shadow-xs"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#2B8C7E] dark:text-[#2ED6A3]">
                {copy.scotlandBuildStageBadge} · {station.gameTitle[language]}
              </p>
              <h2
                id="scotland-build-modal-title"
                className="truncate font-display text-lg sm:text-xl font-extrabold"
              >
                {station.landmarkTitle[language]}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* A2 Guided / B1 Challenge Switch */}
            <div
              className={`inline-flex rounded-xl border p-0.5 text-xs font-bold ${
                isNight ? 'border-white/15 bg-[#0F182F]' : 'border-[#CBD5E1] bg-white'
              }`}
              role="group"
              aria-label={copy.scotlandScaffoldModeLabel}
            >
              <button
                type="button"
                onClick={() => {
                  onPlaySfx('click');
                  onDifficultyChange('a2');
                }}
                className={`min-h-[36px] rounded-lg px-2.5 py-1 transition-colors cursor-pointer ${
                  difficultyMode === 'a2'
                    ? 'bg-[#2ED6A3] text-[#131E31]'
                    : isNight
                      ? 'text-[#C2D0E3] hover:text-white'
                      : 'text-[#475569] hover:text-[#1E2E46]'
                }`}
              >
                {copy.scotlandModeA2Label}
              </button>
              <button
                type="button"
                onClick={() => {
                  onPlaySfx('click');
                  onDifficultyChange('b1');
                }}
                className={`min-h-[36px] rounded-lg px-2.5 py-1 transition-colors cursor-pointer ${
                  difficultyMode === 'b1'
                    ? 'bg-[#F2C66D] text-[#131E31]'
                    : isNight
                      ? 'text-[#C2D0E3] hover:text-white'
                      : 'text-[#475569] hover:text-[#1E2E46]'
                }`}
              >
                {copy.scotlandModeB1Label}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onPlaySfx('click');
                setShowHint((h) => !h);
              }}
              aria-pressed={showHint}
              className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                showHint ? 'border-[#D99B26] bg-[#F2C66D] text-[#131E31]' : cardSurface
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{copy.scotlandHintButton}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                stopAudioAndMic();
                onPlaySfx('click');
                onClose();
              }}
              aria-label={copy.scotlandCloseButton}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border cursor-pointer ${cardSurface}`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
          {/* Sub-header progress & prompt */}
          <div className={`rounded-2xl border p-3.5 ${subtlePanel}`}>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold">
                {difficultyMode === 'a2' ? station.promptA2[language] : station.promptB1[language]}
              </span>
              <span className="font-mono-num font-extrabold text-[#2B8C7E] dark:text-[#2ED6A3]">
                {completedBuildCount}/{SCOTLAND_BUILD_STATIONS.length}
              </span>
            </div>
            {existingSentence && !savedSentence && (
              <p className="mt-2 text-xs opacity-85">
                <span className="font-extrabold">{copy.scotlandBuildCraftedLabel}: </span>
                &ldquo;{existingSentence}&rdquo;
              </p>
            )}
          </div>

          {showHint && (
            <div
              className={`rounded-2xl border p-3.5 text-xs sm:text-sm font-medium ${
                isNight
                  ? 'border-[#D99B26]/50 bg-[#2C2214] text-[#FBE6B8]'
                  : 'border-[#FCD34D] bg-[#FFFBEB] text-[#78350F]'
              }`}
            >
              <span className="font-extrabold uppercase tracking-wide">
                {copy.scotlandHintButton}:{' '}
              </span>
              {station.hint[language]}
            </div>
          )}

          {savedSentence ? (
            <div
              className={`rounded-2xl border p-5 space-y-4 ${
                isNight
                  ? 'border-[#2ED6A3]/55 bg-[#12332F]/80 text-[#F7F9FC]'
                  : 'border-[#6EE7B7] bg-[#ECFDF5] text-[#064E3B]'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#2ED6A3] text-[#131E31]">
                    <Sparkles className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-extrabold">
                      {copy.scotlandBuildSavedTitle}
                    </h3>
                    <p className="text-xs font-semibold opacity-90">
                      {existingSentence ? copy.scotlandBuildReplayNote : copy.scotlandBuildFirstSaveNote}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={resetStation}
                  className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${cardSurface}`}
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.scotlandReplayActivityButton}</span>
                </button>
              </div>

              <div className={`rounded-2xl border p-4 space-y-3 ${cardSurface}`}>
                <p className="text-xs font-extrabold uppercase tracking-wide text-[#2B8C7E] dark:text-[#2ED6A3]">
                  {copy.scotlandBuildCraftedLabel}
                </p>
                <p className="font-display text-base font-extrabold leading-relaxed">
                  &ldquo;{savedSentence}&rdquo;
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => speakEnglish(savedSentence)}
                    className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold cursor-pointer ${subtlePanel}`}
                  >
                    <Volume2 className="h-4 w-4 text-[#24B8B0]" aria-hidden="true" />
                    <span>{copy.jaipurListenButton}</span>
                  </button>

                  {speechSupported ? (
                    <button
                      type="button"
                      onClick={() => startSpeechPractice(savedSentence)}
                      className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold cursor-pointer ${
                        isListeningSpeech
                          ? 'border-[#C84B43] bg-[#C84B43] text-white'
                          : subtlePanel
                      }`}
                    >
                      <Mic className="h-4 w-4" aria-hidden="true" />
                      <span>
                        {isListeningSpeech
                          ? copy.scotlandBuildStopListeningButton
                          : copy.scotlandBuildCheckSpeakingButton}
                      </span>
                    </button>
                  ) : (
                    <span className="text-xs opacity-75">{copy.scotlandBuildNoSpeechNote}</span>
                  )}
                </div>

                {spokenHeard && (
                  <p className="text-xs font-semibold text-[#2B8C7E] dark:text-[#2ED6A3]">
                    Mic check heard: &ldquo;{spokenHeard}&rdquo;
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    stopAudioAndMic();
                    onPlaySfx('select');
                    onOpenJournal(stationId);
                  }}
                  className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${cardSurface}`}
                >
                  <BookOpen className="h-4 w-4 text-[#24B8B0]" aria-hidden="true" />
                  <span>{copy.scotlandOpenJournalButton}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    stopAudioAndMic();
                    onPlaySfx('click');
                    onClose();
                  }}
                  className="inline-flex min-h-[42px] items-center justify-center rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-xs font-extrabold text-[#131E31] shadow hover:bg-[#49e2b3] cursor-pointer"
                >
                  {copy.scotlandContinueExploringButton}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* === GAME 1: BOTH WORLDS BRIDGE === */}
              {stationId === 'highland_village_square' && (
                <div className="space-y-4">
                  <div className={`rounded-2xl border p-4 space-y-3 ${cardSurface}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-extrabold uppercase tracking-wide text-[#2B8C7E] dark:text-[#2ED6A3]">
                        1. Pick 1 Accurate Scottish Clue & 1 Thai Clue
                      </p>
                      <span className="font-mono-num text-xs font-bold">
                        {Number(g1HasScotland) + Number(g1HasThailand)}/2
                      </span>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {shuffledGame1Cards.map((card) => {
                        const picked = g1PickedEvidenceIds.includes(card.id);
                        return (
                          <button
                            key={card.id}
                            type="button"
                            onClick={() => handleToggleGame1Card(card.id)}
                            className={`flex min-h-[82px] flex-col justify-between rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                              picked
                                ? 'border-[#2ED6A3] bg-[#2ED6A3]/20'
                                : subtlePanel + ' hover:border-[#2B8C7E]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs sm:text-sm font-extrabold">
                                {card.title[language]}
                              </span>
                              {picked && (
                                <CheckCircle2
                                  className="h-4 w-4 shrink-0 text-[#059669] dark:text-[#2ED6A3]"
                                  aria-hidden="true"
                                />
                              )}
                            </div>
                            <span className="mt-1 text-xs opacity-85 leading-snug">
                              {card.detail[language]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {g1EvidenceReady && (
                    <div className={`rounded-2xl border p-4 space-y-3 ${cardSurface}`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-extrabold uppercase tracking-wide text-[#D99B26]">
                          2. Assemble Your &ldquo;Both ... and ...&rdquo; Sentence Bridge
                        </p>
                        <div className="flex items-center gap-2">
                          {difficultyMode === 'a2' && (
                            <button
                              type="button"
                              onClick={() => speakEnglish(station.modelSentence)}
                              className={`inline-flex min-h-[36px] items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-bold cursor-pointer ${subtlePanel}`}
                            >
                              <Volume2 className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
                              <span>{copy.jaipurListenButton}</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              onPlaySfx('click');
                              setG1PlacedTileIds([]);
                              setFeedback(null);
                            }}
                            className={`inline-flex min-h-[36px] items-center rounded-lg border px-2.5 py-1 text-xs font-bold cursor-pointer ${subtlePanel}`}
                          >
                            {copy.scotlandBuildClearTilesButton}
                          </button>
                        </div>
                      </div>

                      {/* Drop Zone */}
                      <div
                        className={`min-h-[60px] flex flex-wrap items-center gap-2 rounded-xl border-2 border-dashed p-3 ${subtlePanel}`}
                      >
                        {g1PlacedTileIds.length === 0 ? (
                          <span className="text-xs opacity-65">
                            Tap word tiles below in order to craft your comparison sentence.
                          </span>
                        ) : (
                          g1PlacedTileIds.map((tileId) => {
                            const tile = activeG1Tiles.find((t) => t.id === tileId);
                            if (!tile) return null;
                            return (
                              <button
                                key={tile.id}
                                type="button"
                                onClick={() => {
                                  onPlaySfx('click');
                                  setG1PlacedTileIds((prev) => prev.filter((id) => id !== tileId));
                                }}
                                className="min-h-[38px] rounded-xl bg-[#2B8C7E] px-3 py-1.5 text-xs sm:text-sm font-extrabold text-white shadow-xs cursor-pointer hover:bg-[#24766A]"
                              >
                                {tile.text}
                              </button>
                            );
                          })
                        )}
                      </div>

                      {/* Shuffled Bank */}
                      <div className="flex flex-wrap gap-2">
                        {activeG1Tiles.map((tile) => {
                          const used = g1PlacedTileIds.includes(tile.id);
                          return (
                            <button
                              key={tile.id}
                              type="button"
                              disabled={used}
                              onClick={() => {
                                onPlaySfx('select');
                                setG1PlacedTileIds((prev) => [...prev, tile.id]);
                              }}
                              className={`min-h-[40px] rounded-xl border px-3.5 py-1.5 text-xs sm:text-sm font-bold transition-colors ${
                                used
                                  ? 'opacity-35 cursor-not-allowed ' + subtlePanel
                                  : 'cursor-pointer hover:border-[#2B8C7E] ' + cardSurface
                              }`}
                            >
                              {tile.text}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={handleVerifyGame1}
                          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-xs sm:text-sm font-extrabold text-[#131E31] shadow hover:bg-[#49e2b3] cursor-pointer"
                        >
                          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                          <span>{copy.scotlandBuildSubmitButton}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* === GAME 2: SIMILARITY FORGE === */}
              {stationId === 'tartan_heritage_workshop' && (
                <div className="space-y-4">
                  <div className={`rounded-2xl border p-4 space-y-3 ${cardSurface}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-extrabold uppercase tracking-wide text-[#C84B43] dark:text-[#FCA5A5]">
                        1. Sort Tartan &amp; Praewa Silk Attributes
                      </p>
                      <span className="font-mono-num text-xs font-bold">
                        {Object.keys(g2SortedAttrs).length}/{GAME2_ATTRIBUTE_ITEMS.length}
                      </span>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {shuffledGame2Attrs.map((attr) => {
                        const done = Boolean(g2SortedAttrs[attr.id]);
                        const selected = g2SelectedAttrId === attr.id;
                        return (
                          <button
                            key={attr.id}
                            type="button"
                            onClick={() => {
                              onPlaySfx('select');
                              setG2SelectedAttrId(attr.id);
                              setFeedback(null);
                            }}
                            className={`flex min-h-[60px] items-start justify-between gap-2 rounded-xl border p-3 text-left text-xs font-bold cursor-pointer ${
                              selected
                                ? 'border-[#C84B43] bg-[#C84B43] text-white'
                                : done
                                  ? 'border-[#2ED6A3]/60 bg-[#2ED6A3]/18'
                                  : subtlePanel
                            }`}
                          >
                            <span>{attr.label[language]}</span>
                            {done && <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {(
                        [
                          {
                            id: 'similar_to',
                            title: 'similar to (Shared Pride & Habits)',
                          },
                          {
                            id: 'different_from',
                            title: 'different from (Material & Climate)',
                          },
                        ] as const
                      ).map((bucket) => (
                        <button
                          key={bucket.id}
                          type="button"
                          disabled={g2AttrsAllSorted}
                          onClick={() => handleSortG2Attr(bucket.id)}
                          className={`min-h-[48px] rounded-xl border-2 px-3 py-2 text-xs sm:text-sm font-extrabold transition-colors ${
                            g2AttrsAllSorted
                              ? 'opacity-60 cursor-not-allowed ' + subtlePanel
                              : 'cursor-pointer hover:border-[#C84B43] ' + subtlePanel
                          }`}
                        >
                          {bucket.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {g2AttrsAllSorted && (
                    <div className={`rounded-2xl border p-4 space-y-3 ${cardSurface}`}>
                      <p className="text-xs font-extrabold uppercase tracking-wide text-[#2B8C7E] dark:text-[#2ED6A3]">
                        2. Forge Your Statement ({activeG2Frame.connector})
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {(['similar_to', 'different_from'] as const).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => {
                              onPlaySfx('click');
                              setG2FrameMode(mode);
                              setG2SelectedTailId(null);
                              setFeedback(null);
                            }}
                            className={`min-h-[40px] rounded-xl border px-3.5 py-1.5 text-xs font-extrabold cursor-pointer ${
                              g2FrameMode === mode
                                ? 'border-[#2B8C7E] bg-[#2B8C7E] text-white'
                                : subtlePanel
                            }`}
                          >
                            {mode === 'similar_to' ? 'similar to' : 'different from'}
                          </button>
                        ))}
                      </div>

                      <div className={`rounded-xl border p-3 text-xs sm:text-sm font-bold ${subtlePanel}`}>
                        {activeG2Frame.subject} <span className="text-[#D99B26]">{activeG2Frame.connector}</span>{' '}
                        {g2SelectedTailId
                          ? activeG2Frame.tailOptions.find((t) => t.id === g2SelectedTailId)?.text
                          : '[choose ending below]'}
                      </div>

                      <div className="grid gap-2">
                        {(shuffledGame2TailsByMode[activeG2Frame.id] ?? activeG2Frame.tailOptions).map(
                          (tail) => (
                            <button
                              key={tail.id}
                              type="button"
                              onClick={() => {
                                onPlaySfx('select');
                                setG2SelectedTailId(tail.id);
                              }}
                              className={`min-h-[44px] rounded-xl border px-4 py-2.5 text-left text-xs sm:text-sm font-semibold cursor-pointer ${
                                g2SelectedTailId === tail.id
                                  ? 'border-[#2B8C7E] bg-[#2B8C7E]/15 font-bold'
                                  : subtlePanel
                              }`}
                            >
                              {tail.text}
                            </button>
                          ),
                        )}
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleVerifyGame2}
                          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-xs sm:text-sm font-extrabold text-[#131E31] shadow hover:bg-[#49e2b3] cursor-pointer"
                        >
                          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                          <span>{copy.scotlandBuildSubmitButton}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* === GAME 3: FOOD CONTRAST KITCHEN === */}
              {stationId === 'highland_food_market' && (
                <div className="space-y-4">
                  <div className={`rounded-2xl border p-4 space-y-3 ${cardSurface}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-extrabold uppercase tracking-wide text-[#D98E32]">
                        1. Gather All 3 Authentic Food Clues (Reject Stereotypes!)
                      </p>
                      <span className="font-mono-num text-xs font-bold">
                        {g3PickedCardIds.length}/{g3RequiredIds.length}
                      </span>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {shuffledGame3Cards.map((card) => {
                        const picked = g3PickedCardIds.includes(card.id);
                        return (
                          <button
                            key={card.id}
                            type="button"
                            onClick={() => handlePickGame3Card(card.id)}
                            className={`flex min-h-[76px] flex-col justify-between rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                              picked
                                ? 'border-[#2ED6A3] bg-[#2ED6A3]/20'
                                : subtlePanel + ' hover:border-[#D98E32]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs sm:text-sm font-extrabold">
                                {card.title[language]}
                              </span>
                              {picked && (
                                <CheckCircle2
                                  className="h-4 w-4 shrink-0 text-[#059669] dark:text-[#2ED6A3]"
                                  aria-hidden="true"
                                />
                              )}
                            </div>
                            <span className="mt-1 text-xs opacity-85 leading-snug">
                              {card.detail[language]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {g3EvidenceReady && (
                    <div className={`rounded-2xl border p-4 space-y-3 ${cardSurface}`}>
                      <p className="text-xs font-extrabold uppercase tracking-wide text-[#2B8C7E] dark:text-[#2ED6A3]">
                        2. Combine Scottish &amp; Thai Clauses with &ldquo;while&rdquo; or &ldquo;whereas&rdquo;
                      </p>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="space-y-1.5">
                          <p className="text-xs font-extrabold">{copy.scotlandCountryLabel}</p>
                          {shuffledGame3Scottish.map((sc) => (
                            <button
                              key={sc.id}
                              type="button"
                              onClick={() => {
                                onPlaySfx('select');
                                setG3ScottishId(sc.id);
                              }}
                              className={`w-full min-h-[52px] rounded-xl border p-2.5 text-left text-xs font-semibold cursor-pointer ${
                                g3ScottishId === sc.id
                                  ? 'border-[#D98E32] bg-[#D98E32] text-[#131E31] font-bold'
                                  : subtlePanel
                              }`}
                            >
                              {sc.text}
                            </button>
                          ))}
                        </div>

                        <div className="space-y-1.5">
                          <p className="text-xs font-extrabold">Connector</p>
                          {shuffledGame3Connectors.map((conn) => (
                            <button
                              key={conn}
                              type="button"
                              onClick={() => {
                                onPlaySfx('select');
                                setG3Connector(conn);
                              }}
                              className={`w-full min-h-[52px] rounded-xl border p-2.5 text-center text-xs sm:text-sm font-extrabold cursor-pointer ${
                                g3Connector === conn
                                  ? 'border-[#2B8C7E] bg-[#2B8C7E] text-white'
                                  : subtlePanel
                              }`}
                            >
                              , {conn}
                            </button>
                          ))}
                        </div>

                        <div className="space-y-1.5">
                          <p className="text-xs font-extrabold">{copy.scotlandThailandLabel}</p>
                          {shuffledGame3Thai.map((th) => (
                            <button
                              key={th.id}
                              type="button"
                              onClick={() => {
                                onPlaySfx('select');
                                setG3ThaiId(th.id);
                              }}
                              className={`w-full min-h-[52px] rounded-xl border p-2.5 text-left text-xs font-semibold cursor-pointer ${
                                g3ThaiId === th.id
                                  ? 'border-[#D98E32] bg-[#D98E32] text-[#131E31] font-bold'
                                  : subtlePanel
                              }`}
                            >
                              {th.text}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleVerifyGame3}
                          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-xs sm:text-sm font-extrabold text-[#131E31] shadow hover:bg-[#49e2b3] cursor-pointer"
                        >
                          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                          <span>{copy.scotlandBuildSubmitButton}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* === GAME 4: FESTIVAL COMPARISON CHALLENGE === */}
              {stationId === 'highland_games_ground' && (
                <div className="space-y-4">
                  <div className={`rounded-2xl border p-4 space-y-3 ${cardSurface}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-extrabold uppercase tracking-wide text-[#5664B8] dark:text-[#A5B4FC]">
                        1. Classify Festival Evidence (Scotland / Both / Thailand)
                      </p>
                      <span className="font-mono-num text-xs font-bold">
                        {Object.keys(g4SortedZones).length}/{GAME4_FESTIVAL_CARDS.length}
                      </span>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {shuffledGame4Cards.map((card) => {
                        const zone = g4SortedZones[card.id];
                        const selected = g4SelectedCardId === card.id;
                        return (
                          <button
                            key={card.id}
                            type="button"
                            onClick={() => {
                              onPlaySfx('select');
                              setG4SelectedCardId(card.id);
                              setFeedback(null);
                            }}
                            className={`flex min-h-[58px] items-start justify-between gap-2 rounded-xl border p-3 text-left text-xs font-bold cursor-pointer ${
                              selected
                                ? 'border-[#5664B8] bg-[#5664B8] text-white'
                                : zone
                                  ? 'border-[#2ED6A3]/60 bg-[#2ED6A3]/18'
                                  : subtlePanel
                            }`}
                          >
                            <span>{card.label[language]}</span>
                            {zone && <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-3">
                      {(
                        [
                          { id: 'scotland', label: copy.scotlandCountryLabel },
                          { id: 'both', label: copy.scotlandBothCountriesLabel },
                          { id: 'thailand', label: copy.scotlandThailandLabel },
                        ] as const
                      ).map((col) => (
                        <button
                          key={col.id}
                          type="button"
                          disabled={g4AllSorted}
                          onClick={() => handleSortGame4Card(col.id)}
                          className={`flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 px-3 py-2 text-xs sm:text-sm font-extrabold ${
                            g4AllSorted
                              ? 'opacity-60 cursor-not-allowed ' + subtlePanel
                              : 'cursor-pointer hover:border-[#5664B8] ' + subtlePanel
                          }`}
                        >
                          <ScotlandZoneCrestSVG zone={col.id} className="h-6 w-6" />
                          <span>{col.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {g4AllSorted && (
                    <div className={`rounded-2xl border p-4 space-y-3 ${cardSurface}`}>
                      <p className="text-xs font-extrabold uppercase tracking-wide text-[#2B8C7E] dark:text-[#2ED6A3]">
                        2. Build a Festival Contrast Sentence (&ldquo;unlike&rdquo;, &ldquo;while&rdquo;, or &ldquo;whereas&rdquo;)
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {shuffledGame4Frames.map((frame) => (
                          <button
                            key={frame.id}
                            type="button"
                            onClick={() => {
                              onPlaySfx('click');
                              setG4FrameId(frame.id);
                              setG4ClauseId(null);
                            }}
                            className={`min-h-[40px] rounded-xl border px-3.5 py-1.5 text-xs font-extrabold cursor-pointer ${
                              g4FrameId === frame.id
                                ? 'border-[#5664B8] bg-[#5664B8] text-white'
                                : subtlePanel
                            }`}
                          >
                            {frame.connector}
                          </button>
                        ))}
                      </div>

                      <div className="grid gap-2">
                        {(shuffledGame4ClausesByFrame[activeG4Frame.id] ?? activeG4Frame.clauses).map(
                          (clause) => {
                            const preview = activeG4Frame.buildText(
                              clause.scotlandPart,
                              clause.thaiPart,
                            );
                            return (
                              <button
                                key={clause.id}
                                type="button"
                                onClick={() => {
                                  onPlaySfx('select');
                                  setG4ClauseId(clause.id);
                                }}
                                className={`min-h-[48px] rounded-xl border px-4 py-2.5 text-left text-xs sm:text-sm font-semibold cursor-pointer ${
                                  g4ClauseId === clause.id
                                    ? 'border-[#2B8C7E] bg-[#2B8C7E]/15 font-bold'
                                    : subtlePanel
                                }`}
                              >
                                {preview}
                              </button>
                            );
                          },
                        )}
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleVerifyGame4}
                          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-xs sm:text-sm font-extrabold text-[#131E31] shadow hover:bg-[#49e2b3] cursor-pointer"
                        >
                          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                          <span>{copy.scotlandBuildSubmitButton}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* === GAME 5: MASTER COMPARISON COMPASS === */}
              {stationId === 'lochside_castle_viewpoint' && (
                <div className="space-y-4">
                  {/* Journal Reference Strip */}
                  <div className={`rounded-2xl border p-4 space-y-2.5 ${subtlePanel}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-extrabold uppercase tracking-wide text-[#3B78A8] dark:text-[#7DD3FC]">
                        Journal Evidence Reference ({discoveredEvidenceIds.length}/
                        {SCOTLAND_EVIDENCE_ITEMS.length})
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          stopAudioAndMic();
                          onPlaySfx('select');
                          onOpenJournal(stationId);
                        }}
                        className={`inline-flex min-h-[34px] items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-bold cursor-pointer ${cardSurface}`}
                      >
                        <BookOpen className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
                        <span>{copy.scotlandOpenJournalButton}</span>
                      </button>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {SCOTLAND_EVIDENCE_ITEMS.slice(0, 4).map((ev) => (
                        <div key={ev.id} className={`rounded-xl border p-2.5 text-xs ${cardSurface}`}>
                          <p className="font-extrabold text-[#2B8C7E] dark:text-[#2ED6A3]">
                            {ev.landmarkTitle[language]}
                          </p>
                          <p className="mt-0.5 opacity-85">{ev.similarityNote[language]}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 1: Modular Multi-Variant Builder */}
                  <div className={`rounded-2xl border p-4 space-y-4 ${cardSurface}`}>
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wide text-[#2B8C7E] dark:text-[#2ED6A3]">
                        1. Choose Similarity Statement (Both ... and / similar to)
                      </p>
                      <div className="mt-2 grid gap-2">
                        {shuffledGame5Similarities.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              onPlaySfx('select');
                              setG5SimId(opt.id);
                            }}
                            className={`min-h-[44px] rounded-xl border px-3.5 py-2 text-left text-xs sm:text-sm font-semibold cursor-pointer ${
                              g5SimId === opt.id
                                ? 'border-[#2B8C7E] bg-[#2B8C7E]/18 font-bold'
                                : subtlePanel
                            }`}
                          >
                            <span>{opt.sentence}</span>
                            {language === 'th' && (
                              <span className="mt-0.5 block text-xs opacity-75">
                                {opt.thTranslation}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wide text-[#D98E32]">
                        2. Choose Difference Statement (while / whereas / unlike / different from)
                      </p>
                      <div className="mt-2 grid gap-2">
                        {shuffledGame5Differences.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              onPlaySfx('select');
                              setG5DiffId(opt.id);
                            }}
                            className={`min-h-[44px] rounded-xl border px-3.5 py-2 text-left text-xs sm:text-sm font-semibold cursor-pointer ${
                              g5DiffId === opt.id
                                ? 'border-[#D98E32] bg-[#D98E32]/18 font-bold'
                                : subtlePanel
                            }`}
                          >
                            <span>{opt.sentence}</span>
                            {language === 'th' && (
                              <span className="mt-0.5 block text-xs opacity-75">
                                {opt.thTranslation}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wide text-[#5664B8] dark:text-[#A5B4FC]">
                        3. Ground With Specific Scotland &amp; Thailand Examples
                      </p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {shuffledGame5Examples.map((ex) => (
                          <button
                            key={ex.id}
                            type="button"
                            onClick={() => {
                              onPlaySfx('select');
                              setG5ExampleId(ex.id);
                            }}
                            className={`min-h-[46px] rounded-xl border px-3.5 py-2 text-left text-xs font-bold cursor-pointer ${
                              g5ExampleId === ex.id
                                ? 'border-[#5664B8] bg-[#5664B8] text-white'
                                : subtlePanel
                            }`}
                          >
                            {ex.label[language]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {difficultyMode === 'b1' && (
                      <div>
                        <label
                          htmlFor="scotland-b1-custom-synthesis"
                          className="block text-xs font-extrabold uppercase tracking-wide text-[#F2C66D]"
                        >
                          B1 Open Synthesis (Edit or Write Your Own Comparison — Optional)
                        </label>
                        <textarea
                          id="scotland-b1-custom-synthesis"
                          rows={3}
                          value={g5CustomText}
                          onChange={(e) => setG5CustomText(e.target.value)}
                          placeholder={station.modelSentence}
                          className={`mt-1.5 w-full rounded-xl border p-3 text-xs sm:text-sm leading-relaxed ${subtlePanel}`}
                        />
                      </div>
                    )}

                    {/* Live 3-Criteria Rubric Status */}
                    <div className={`rounded-xl border p-3 text-xs space-y-2 ${subtlePanel}`}>
                      <div className="flex flex-wrap items-center gap-3 font-bold">
                        <span className="inline-flex items-center gap-1">
                          <Compass className="h-3.5 w-3.5 text-[#2B8C7E]" aria-hidden="true" />
                          <span>Similarity: {g5Eval.hasSimilarity ? 'OK' : 'Needed'}</span>
                        </span>
                        <span>·</span>
                        <span>Difference: {g5Eval.hasDifference ? 'OK' : 'Needed'}</span>
                        <span>·</span>
                        <span>Specific Examples: {g5Eval.hasSpecificExamples ? 'OK' : 'Needed'}</span>
                      </div>
                      {g5EffectiveText && (
                        <p className="leading-relaxed opacity-90">{g5EffectiveText}</p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleVerifyGame5}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#2ED6A3] px-5 py-2 font-display text-xs sm:text-sm font-extrabold text-[#131E31] shadow hover:bg-[#49e2b3] cursor-pointer"
                      >
                        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                        <span>{copy.scotlandBuildSubmitButton}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Inline Constructive Feedback */}
              {feedback && (
                <div
                  role="status"
                  className={`rounded-2xl border p-3.5 text-xs sm:text-sm font-semibold leading-relaxed ${
                    feedback.tone === 'success'
                      ? isNight
                        ? 'border-[#2ED6A3]/45 bg-[#12332F] text-[#A7F3D0]'
                        : 'border-[#6EE7B7] bg-[#ECFDF5] text-[#065F46]'
                      : isNight
                        ? 'border-[#F2C66D]/45 bg-[#2A2013] text-[#FDE68A]'
                        : 'border-[#FCD34D] bg-[#FFFBEB] text-[#92400E]'
                  }`}
                >
                  {feedback.message[language]}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div
          className={`flex flex-wrap items-center justify-between gap-2 border-t px-5 py-3.5 ${
            isNight ? 'border-white/12 bg-[#162340]' : 'border-[#E2E8F0] bg-[#F8FAFC]'
          }`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                stopAudioAndMic();
                onPlaySfx('click');
                onOpenDiscoverReview(stationId);
              }}
              className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${cardSurface}`}
            >
              <span>{copy.scotlandBuildInspectDiscoverCardButton}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                stopAudioAndMic();
                onPlaySfx('click');
                onInspectLandmarkInfo();
              }}
              className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${cardSurface}`}
            >
              <span>{copy.scotlandReadLandmarkNoteButton}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              stopAudioAndMic();
              onPlaySfx('select');
              onOpenJournal(stationId);
            }}
            className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold cursor-pointer ${cardSurface}`}
          >
            <BookOpen className="h-3.5 w-3.5 text-[#24B8B0]" aria-hidden="true" />
            <span>{copy.scotlandOpenJournalButton}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
