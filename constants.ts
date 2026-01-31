import { GameMode, GameTask } from './types';

// The source data structure provided by the user
const RAW_DATA: Record<string, string[]> = {
  "Εγώ": [
    "Εγώ σου δίνω το βιβλίο",
    "Εγώ του δίνω το βιβλίο",
    "Εγώ της δίνω το βιβλίο",
    "Εγώ σας δίνω το βιβλίο",
    "Εγώ τους δίνω το βιβλίο"
  ],
  "Εσύ": [
    "Εσύ μου δίνεις το βιβλίο",
    "Εσύ του δίνεις το βιβλίο",
    "Εσύ της δίνεις το βιβλίο",
    "Εσύ μας δίνεις το βιβλίο",
    "Εσύ σας δίνεις το βιβλίο",
    "Εσύ τους δίνεις το βιβλίο"
  ],
  "Αυτός": [
    "Αυτός μου δίνει το βιβλίο",
    "Αυτός σου δίνει το βιβλίο",
    "Αυτός της δίνει το βιβλίο",
    "Αυτός μας δίνει το βιβλίο",
    "Αυτός σας δίνει το βιβλίο",
    "Αυτός τους δίνει το βιβλίο"
  ],
  "Αυτή": [
    "Αυτή μου δίνει το βιβλίο",
    "Αυτή σου δίνει το βιβλίο",
    "Αυτή του δίνει το βιβλίο",
    "Αυτή μας δίνει το βιβλίο",
    "Αυτή σας δίνει το βιβλίο",
    "Αυτή τους δίνει το βιβλίο"
  ],
  "Εμείς": [
    "Εμείς σου δίνουμε το βιβλίο",
    "Εμείς του δίνουμε το βιβλίο",
    "Εμείς της δίνουμε το βιβλίο",
    "Εμείς σας δίνουμε το βιβλίο",
    "Εμείς τους δίνουμε το βιβλίο"
  ],
  "Εσείς": [
    "Εσείς μου δίνετε το βιβλίο",
    "Εσείς του δίνετε το βιβλίο",
    "Εσείς της δίνετε το βιβλίο",
    "Εσείς μας δίνετε το βιβλίο",
    "Εσείς τους δίνετε το βιβλίο"
  ],
  "Αυτοί": [
    "Αυτοί μου δίνουν το βιβλίο",
    "Αυτοί σου δίνουν το βιβλίο",
    "Αυτοί του δίνουν το βιβλίο",
    "Αυτοί της δίνουν το βιβλίο",
    "Αυτοί μας δίνουν το βιβλίο",
    "Αυτοί σας δίνουν το βιβλίο"
  ]
};

// Mappings to construct the Russian sentences
const SUBJECT_MAP: Record<string, string> = {
  "Εγώ": "Я",
  "Εσύ": "Ты",
  "Αυτός": "Он",
  "Αυτή": "Она",
  "Εμείς": "Мы",
  "Εσείς": "Вы",
  "Αυτοί": "Они"
};

const OBJECT_MAP: Record<string, string> = {
  "μου": "мне",
  "σου": "тебе",
  "του": "ему",
  "της": "ей",
  "μας": "нам",
  "σας": "вам",
  "τους": "им"
};

const VERB_MAP: Record<string, string> = {
  "Εγώ": "даю",
  "Εσύ": "даешь",
  "Αυτός": "дает",
  "Αυτή": "дает",
  "Εμείς": "даем",
  "Εσείς": "даете",
  "Αυτοί": "дают"
};

const DIRECT_OBJECT = "книгу";

const parseGreekSentence = (category: string, sentence: string): string => {
  const parts = sentence.split(' ');
  // Typical structure: [Subject] [Object] [Verb] [Article] [Noun]
  // Example: Εγώ σου δίνω το βιβλίο
  
  // We already know the subject from the category (key) or first word
  const subjectGreek = parts[0]; 
  const objectGreek = parts[1];
  
  const subjectRu = SUBJECT_MAP[subjectGreek] || subjectGreek;
  const objectRu = OBJECT_MAP[objectGreek] || objectGreek;
  const verbRu = VERB_MAP[subjectGreek] || "даю";

  return `${subjectRu} ${verbRu} ${objectRu} ${DIRECT_OBJECT}`;
};

export const generateGrammarTasks = (): GameTask[] => {
  const questions: GameTask[] = [];

  Object.entries(RAW_DATA).forEach(([category, sentences]) => {
    sentences.forEach((sentence) => {
      questions.push({
        mode: GameMode.GRAMMAR,
        category,
        prompt: parseGreekSentence(category, sentence),
        answer: sentence,
        promptLabel: 'Переведи на греческий'
      });
    });
  });

  return questions.sort(() => Math.random() - 0.5); // Shuffle
};

const GREEK_LETTERS: { symbol: string; name: string }[] = [
  { symbol: 'Α', name: 'άλφα' },
  { symbol: 'Β', name: 'βήτα' },
  { symbol: 'Γ', name: 'γάμμα' },
  { symbol: 'Δ', name: 'δέλτα' },
  { symbol: 'Ε', name: 'έψιλον' },
  { symbol: 'Ζ', name: 'ζήτα' },
  { symbol: 'Η', name: 'ήτα' },
  { symbol: 'Θ', name: 'θήτα' },
  { symbol: 'Ι', name: 'ιώτα' },
  { symbol: 'Κ', name: 'κάππα' },
  { symbol: 'Λ', name: 'λάμδα' },
  { symbol: 'Μ', name: 'μυ' },
  { symbol: 'Ν', name: 'νυ' },
  { symbol: 'Ξ', name: 'ξι' },
  { symbol: 'Ο', name: 'όμικρον' },
  { symbol: 'Π', name: 'πι' },
  { symbol: 'Ρ', name: 'ρο' },
  { symbol: 'Σ', name: 'σίγμα' },
  { symbol: 'Τ', name: 'ταυ' },
  { symbol: 'Υ', name: 'ύψιλον' },
  { symbol: 'Φ', name: 'φι' },
  { symbol: 'Χ', name: 'χι' },
  { symbol: 'Ψ', name: 'ψι' },
  { symbol: 'Ω', name: 'ωμέγα' },
  { symbol: 'α', name: 'άλφα' },
  { symbol: 'β', name: 'βήτα' },
  { symbol: 'γ', name: 'γάμμα' },
  { symbol: 'δ', name: 'δέλτα' },
  { symbol: 'ε', name: 'έψιλον' },
  { symbol: 'ζ', name: 'ζήτα' },
  { symbol: 'η', name: 'ήτα' },
  { symbol: 'θ', name: 'θήτα' },
  { symbol: 'ι', name: 'ιώτα' },
  { symbol: 'κ', name: 'κάππα' },
  { symbol: 'λ', name: 'λάμδα' },
  { symbol: 'μ', name: 'μυ' },
  { symbol: 'ν', name: 'νυ' },
  { symbol: 'ξ', name: 'ξι' },
  { symbol: 'ο', name: 'όμικρον' },
  { symbol: 'π', name: 'πι' },
  { symbol: 'ρ', name: 'ρο' },
  { symbol: 'σ', name: 'σίγμα' },
  { symbol: 'τ', name: 'ταυ' },
  { symbol: 'υ', name: 'ύψιλον' },
  { symbol: 'φ', name: 'φι' },
  { symbol: 'χ', name: 'χι' },
  { symbol: 'ψ', name: 'ψι' },
  { symbol: 'ω', name: 'ωμέγα' }
];

const NUMBER_UNITS: Record<number, string> = {
  1: 'ένα',
  2: 'δύο',
  3: 'τρία',
  4: 'τέσσερα',
  5: 'πέντε',
  6: 'έξι',
  7: 'εφτά',
  8: 'οκτώ',
  9: 'εννέα'
};

const NUMBER_TEENS: Record<number, string> = {
  10: 'δέκα',
  11: 'έντεκα',
  12: 'δώδεκα',
  13: 'δεκατρία',
  14: 'δεκατέσσερα',
  15: 'δεκαπέντε',
  16: 'δεκαέξι',
  17: 'δεκαεπτά',
  18: 'δεκαοκτώ',
  19: 'δεκαεννέα'
};

const NUMBER_TENS: Record<number, string> = {
  20: 'είκοσι',
  30: 'τριάντα',
  40: 'σαράντα',
  50: 'πενήντα',
  60: 'εξήντα',
  70: 'εβδομήντα',
  80: 'ογδόντα',
  90: 'ενενήντα'
};

const numberToGreek = (value: number): string => {
  if (value <= 0 || value > 101) return String(value);
  if (value < 10) return NUMBER_UNITS[value];
  if (value < 20) return NUMBER_TEENS[value];
  if (value < 100) {
    const tens = Math.floor(value / 10) * 10;
    const unit = value % 10;
    return unit === 0 ? NUMBER_TENS[tens] : `${NUMBER_TENS[tens]} ${NUMBER_UNITS[unit]}`;
  }
  if (value === 100) return 'εκατό';
  return 'εκατόν ένα';
};

const generateCodeTask = (): GameTask => {
  const elements: { symbol: string; label: string }[] = [];
  const elementCount = 6;
  const types: Array<'letter' | 'number'> = ['letter', 'number'];
  const plannedTypes: Array<'letter' | 'number'> = ['letter', 'number'];

  while (plannedTypes.length < elementCount) {
    plannedTypes.push(types[Math.floor(Math.random() * types.length)]);
  }

  for (let i = plannedTypes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [plannedTypes[i], plannedTypes[j]] = [plannedTypes[j], plannedTypes[i]];
  }

  for (let i = 0; i < elementCount; i++) {
    const type = plannedTypes[i];
    if (type === 'letter') {
      const letter = GREEK_LETTERS[Math.floor(Math.random() * GREEK_LETTERS.length)];
      elements.push({ symbol: letter.symbol, label: letter.name });
    } else {
      const number = Math.floor(Math.random() * 101) + 1;
      elements.push({ symbol: String(number), label: numberToGreek(number) });
    }
  }

  const answer = elements.map((item) => item.symbol).join('');
  const prompt = elements.map((item) => item.label).join(' - ');

  return {
    mode: GameMode.CODE,
    prompt,
    answer,
    promptLabel: 'Собери код из 6 элементов'
  };
};

export const generateCodeTasks = (count = 30): GameTask[] => {
  return Array.from({ length: count }, () => generateCodeTask());
};

export const TOTAL_STEPS = 25; // Length of the board
export const WINNING_STEPS = TOTAL_STEPS - 1;

export const PLAYER_CONFIG = [
  { id: 0, name: "Игрок 1", color: "bg-indigo-500", borderColor: "border-indigo-700", textColor: "text-indigo-600" },
  { id: 1, name: "Игрок 2", color: "bg-rose-500", borderColor: "border-rose-700", textColor: "text-rose-600" }
];
