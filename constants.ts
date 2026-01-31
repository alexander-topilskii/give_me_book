import { TranslationPair } from './types';

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

export const generateQuestions = (): TranslationPair[] => {
  const questions: TranslationPair[] = [];

  Object.entries(RAW_DATA).forEach(([category, sentences]) => {
    sentences.forEach((sentence) => {
      questions.push({
        category,
        greek: sentence,
        russian: parseGreekSentence(category, sentence)
      });
    });
  });

  return questions.sort(() => Math.random() - 0.5); // Shuffle
};

export const TOTAL_STEPS = 25; // Length of the board
export const WINNING_STEPS = TOTAL_STEPS - 1;

export const PLAYER_CONFIG = [
  { id: 0, name: "Игрок 1", color: "bg-indigo-500", borderColor: "border-indigo-700", textColor: "text-indigo-600" },
  { id: 1, name: "Игрок 2", color: "bg-rose-500", borderColor: "border-rose-700", textColor: "text-rose-600" }
];
