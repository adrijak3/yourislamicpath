// Curated fallback verses (used if the Quran API fails or during SSR)
export const FALLBACK_VERSES = [
  {
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    english: "So truly where there is hardship, there is also ease.",
    surahEn: "Ash-Sharh",
    surahAr: "سورة الشرح",
    ref: "94:5",
  },
  {
    arabic: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
    english: "And seek help through patience and prayer.",
    surahEn: "Al-Baqarah",
    surahAr: "سورة البقرة",
    ref: "2:45",
  },
  {
    arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    english: "Indeed, Allah is with the patient.",
    surahEn: "Al-Baqarah",
    surahAr: "سورة البقرة",
    ref: "2:153",
  },
  {
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    english:
      "And whoever relies upon Allah — then He is sufficient for them.",
    surahEn: "At-Talaq",
    surahAr: "سورة الطلاق",
    ref: "65:3",
  },
  {
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا",
    english: "O you who have believed, remember Allah with much remembrance.",
    surahEn: "Al-Ahzab",
    surahAr: "سورة الأحزاب",
    ref: "33:41",
  },
] as const;

export type SalahStep = {
  slug: string;
  index: number;
  titleEn: string;
  titleAr: string;
  transliteration: string;
  summary: string;
  status: "completed" | "current" | "locked";
  progress: number; // 0..100
  lessons: Array<{
    heading: string;
    body: string;
  }>;
  keyPhrase?: {
    arabic: string;
    transliteration: string;
    translation: string;
  };
};

export const SALAH_STEPS: SalahStep[] = [
  {
    slug: "niyyah",
    index: 1,
    titleEn: "Intention",
    titleAr: "النية",
    transliteration: "Niyyah",
    summary:
      "Begin every prayer in the heart. Intention is silent, sincere, and personal.",
    status: "completed",
    progress: 100,
    lessons: [
      {
        heading: "What is niyyah?",
        body: "Niyyah is a quiet decision in the heart to pray a specific prayer for the sake of Allah. It is not spoken aloud.",
      },
      {
        heading: "How to make it",
        body: "Before you say the opening takbir, silently know which prayer you are about to perform — for example, the four rak'ahs of Dhuhr.",
      },
    ],
  },
  {
    slug: "wudu",
    index: 2,
    titleEn: "Wudu",
    titleAr: "الوضوء",
    transliteration: "Al-Wuḍūʾ",
    summary:
      "The ritual washing that prepares the body and heart. Simple, gentle, deliberate.",
    status: "current",
    progress: 42,
    keyPhrase: {
      arabic: "غَسْلُ الْيَدَيْنِ",
      transliteration: "Ghasl al-yadayn",
      translation: "Washing the hands",
    },
    lessons: [
      {
        heading: "Wash the hands",
        body: "Wash both hands up to the wrists three times, letting water reach between the fingers.",
      },
      {
        heading: "Rinse the mouth & nose",
        body: "Rinse the mouth three times, then draw water gently into the nose and blow it out with the left hand.",
      },
      {
        heading: "Wash the face",
        body: "Wash the whole face — from the hairline to the chin, ear to ear — three times.",
      },
      {
        heading: "Arms, head, feet",
        body: "Wash arms to the elbows, wipe over the head and ears once, then wash the feet up to the ankles three times.",
      },
    ],
  },
  {
    slug: "times",
    index: 3,
    titleEn: "Times",
    titleAr: "المواقيت",
    transliteration: "Al-Mawāqīt",
    summary: "The five daily prayers and when they begin and end.",
    status: "locked",
    progress: 0,
    lessons: [
      {
        heading: "The five prayers",
        body: "Fajr, Dhuhr, ‘Asr, Maghrib, and ‘Isha — each with its own window of time linked to the sun.",
      },
    ],
  },
  {
    slug: "positions",
    index: 4,
    titleEn: "Positions",
    titleAr: "الحركات",
    transliteration: "Al-Ḥarakāt",
    summary:
      "Standing, bowing, prostrating, sitting — the movements that shape the prayer.",
    status: "locked",
    progress: 0,
    lessons: [
      {
        heading: "Qiyam — standing",
        body: "You begin standing, hands raised in the opening takbir.",
      },
    ],
  },
  {
    slug: "recitation",
    index: 5,
    titleEn: "Recitation",
    titleAr: "القراءة",
    transliteration: "Al-Qirāʾah",
    summary:
      "The words spoken in each rak'ah: the opening chapter and a short surah.",
    status: "locked",
    progress: 0,
    lessons: [
      {
        heading: "Al-Fatiha",
        body: "The first chapter of the Quran, recited in every rak'ah of every prayer.",
      },
    ],
  },
];

export const SAMPLE_PRAYER_TIMES = [
  { name: "Fajr", ar: "الفجر", time: "05:14 AM", state: "past" as const },
  { name: "Dhuhr", ar: "الظهر", time: "12:30 PM", state: "current" as const },
  { name: "Asr", ar: "العصر", time: "03:45 PM", state: "upcoming" as const },
  { name: "Maghrib", ar: "المغرب", time: "06:12 PM", state: "upcoming" as const },
  { name: "Isha", ar: "العشاء", time: "07:30 PM", state: "upcoming" as const },
];

/** Pick a deterministic verse for today, so it changes each day but is stable within it. */
export function todayFallbackVerse() {
  const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return FALLBACK_VERSES[day % FALLBACK_VERSES.length];
}
