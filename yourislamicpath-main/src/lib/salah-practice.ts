// Practice-mode sequences for the five daily prayers.
// A prayer is a list of rak‘ahs. Each rak‘ah is a list of steps.
// Steps are drawn from the vocabulary of Salah movements.

export type PracticeStep = {
  key: string; // stable id inside the sequence
  movement: string; // e.g. "Standing", "Bowing"
  instruction: string; // beginner instruction
  arabic?: string;
  transliteration?: string;
  translation?: string;
  detail?: string; // longer "explain more" text
  audioLabel?: string;
  genderOnly?: "male" | "female"; // step only shown to that guidance mode
  genderNote?: { male?: string; female?: string };
  scholarlyNote?: string;
};

export type PrayerId = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

export type PrayerDefinition = {
  id: PrayerId;
  nameEn: string;
  nameAr: string;
  rakahs: number;
  audibleRecitation: boolean; // for the first two rak‘ahs
  timeHint: string;
};

export const PRAYERS: PrayerDefinition[] = [
  { id: "fajr", nameEn: "Fajr", nameAr: "الفجر", rakahs: 2, audibleRecitation: true, timeHint: "Dawn — before sunrise" },
  { id: "dhuhr", nameEn: "Dhuhr", nameAr: "الظهر", rakahs: 4, audibleRecitation: false, timeHint: "Just after midday" },
  { id: "asr", nameEn: "Asr", nameAr: "العصر", rakahs: 4, audibleRecitation: false, timeHint: "Late afternoon" },
  { id: "maghrib", nameEn: "Maghrib", nameAr: "المغرب", rakahs: 3, audibleRecitation: true, timeHint: "Just after sunset" },
  { id: "isha", nameEn: "Isha", nameAr: "العشاء", rakahs: 4, audibleRecitation: true, timeHint: "Night" },
];

// Step builders — keep phrasing consistent with the lesson content.
const takbir: PracticeStep = {
  key: "takbir",
  movement: "Opening Takbir",
  instruction: "Raise your hands and say ‘Allāhu Akbar’ to begin.",
  arabic: "اللَّهُ أَكْبَرُ",
  transliteration: "Allāhu Akbar",
  translation: "Allah is the Greatest",
  detail:
    "From this moment you are in prayer. Put the world behind you and turn your heart toward Allah.",
  audioLabel: "Takbir",
  genderNote: {
    male: "Raise hands to ear level.",
    female: "Raise hands to shoulder level.",
  },
};

const openingDua: PracticeStep = {
  key: "opening-dua",
  movement: "Opening Supplication",
  instruction: "Quietly praise Allah before Al-Fātiḥah.",
  arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ",
  transliteration: "Subḥānaka Allāhumma wa biḥamdik",
  translation: "Glory be to You, O Allah, and praise.",
  audioLabel: "Opening supplication",
  scholarlyNote:
    "Several authentic opening supplications exist — any one is enough.",
};

const fatiha: PracticeStep = {
  key: "fatiha",
  movement: "Recite Al-Fātiḥah",
  instruction: "Recite the opening chapter of the Qur’an, slowly.",
  arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ …",
  transliteration: "Al-ḥamdu lillāhi Rabbi l-ʿālamīn …",
  translation: "All praise is due to Allah, Lord of all worlds …",
  detail:
    "Take your time. Every verse of Al-Fātiḥah is answered by Allah in a hadith qudsi.",
  audioLabel: "Al-Fātiḥah",
};

const shortSurah: PracticeStep = {
  key: "short-surah",
  movement: "A Short Surah",
  instruction: "After Al-Fātiḥah, add a short surah — e.g. Al-Ikhlāṣ.",
  arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
  transliteration: "Qul huwa Llāhu aḥad",
  translation: "Say: He is Allah, the One.",
  audioLabel: "Al-Ikhlāṣ",
};

const ruku: PracticeStep = {
  key: "ruku",
  movement: "Rukūʿ — Bowing",
  instruction: "Say ‘Allāhu Akbar’ and bow with a level back. Say the phrase three times.",
  arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
  transliteration: "Subḥāna Rabbiya l-ʿAẓīm",
  translation: "Glory be to my Lord, the Most Great.",
  audioLabel: "Rukūʿ",
};

const iʿtidal: PracticeStep = {
  key: "itidal",
  movement: "Stand After Rukūʿ",
  instruction:
    "Rise: ‘Samiʿa Llāhu liman ḥamidah’. Once standing: ‘Rabbanā wa laka l-ḥamd’.",
  arabic: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ",
  transliteration: "Samiʿa Llāhu liman ḥamidah",
  translation: "Allah hears those who praise Him.",
};

const sujud1: PracticeStep = {
  key: "sujud-1",
  movement: "Sujūd — First Prostration",
  instruction:
    "Say ‘Allāhu Akbar’ and prostrate — forehead, nose, palms, knees, toes on the ground.",
  arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى",
  transliteration: "Subḥāna Rabbiya l-Aʿlā",
  translation: "Glory be to my Lord, the Most High.",
  audioLabel: "Sujūd",
  genderNote: {
    male: "Keep elbows raised, belly away from the thighs.",
    female: "Draw the limbs closer to the body.",
  },
};

const sitBetween: PracticeStep = {
  key: "sit-between",
  movement: "Sit Between the Prostrations",
  instruction: "Sit briefly and ask Allah for forgiveness.",
  arabic: "رَبِّ اغْفِرْ لِي",
  transliteration: "Rabbi ghfir lī",
  translation: "My Lord, forgive me.",
};

const sujud2: PracticeStep = {
  ...sujud1,
  key: "sujud-2",
  movement: "Sujūd — Second Prostration",
  instruction: "Prostrate a second time, repeating the phrase three times.",
};

const tashahhud: PracticeStep = {
  key: "tashahhud",
  movement: "Tashahhud",
  instruction: "Sit and recite the tashahhud quietly.",
  arabic: "التَّحِيَّاتُ لِلَّهِ …",
  transliteration: "At-taḥiyyātu lillāhi …",
  translation: "All greetings, prayers, and pure words are for Allah …",
  audioLabel: "Tashahhud",
};

const salawat: PracticeStep = {
  key: "salawat",
  movement: "Salawāt on the Prophet ﷺ",
  instruction: "Send blessings on the Prophet ﷺ.",
  arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ …",
  transliteration: "Allāhumma ṣalli ʿalā Muḥammad …",
  translation: "O Allah, send prayers upon Muhammad …",
  audioLabel: "Ṣalāh Ibrāhīmiyyah",
};

const taslim: PracticeStep = {
  key: "taslim",
  movement: "Taslīm",
  instruction:
    "Turn the head right, then left, each time saying ‘As-salāmu ʿalaykum wa raḥmatu Llāh’.",
  arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
  transliteration: "As-salāmu ʿalaykum wa raḥmatu Llāh",
  translation: "Peace be upon you, and Allah’s mercy.",
  audioLabel: "Taslīm",
};

function firstRakah(): PracticeStep[] {
  return [takbir, openingDua, fatiha, shortSurah, ruku, iʿtidal, sujud1, sitBetween, sujud2];
}

function secondRakah(): PracticeStep[] {
  return [
    { ...fatiha, key: "fatiha-2" },
    { ...shortSurah, key: "short-surah-2" },
    { ...ruku, key: "ruku-2" },
    { ...iʿtidal, key: "itidal-2" },
    { ...sujud1, key: "sujud-1b" },
    { ...sitBetween, key: "sit-between-2" },
    { ...sujud2, key: "sujud-2b" },
  ];
}

function silentRakah(keySuffix: string): PracticeStep[] {
  return [
    { ...fatiha, key: `fatiha-${keySuffix}`, detail: "In the 3rd/4th rak‘ah, recite only Al-Fātiḥah — no extra surah." },
    { ...ruku, key: `ruku-${keySuffix}` },
    { ...iʿtidal, key: `itidal-${keySuffix}` },
    { ...sujud1, key: `sujud1-${keySuffix}` },
    { ...sitBetween, key: `sit-between-${keySuffix}` },
    { ...sujud2, key: `sujud2-${keySuffix}` },
  ];
}

export function buildSequence(prayerId: PrayerId): Array<{
  rakah: number;
  steps: PracticeStep[];
}> {
  const prayer = PRAYERS.find((p) => p.id === prayerId)!;
  const rakahs: Array<{ rakah: number; steps: PracticeStep[] }> = [];

  rakahs.push({ rakah: 1, steps: firstRakah() });
  rakahs.push({
    rakah: 2,
    steps: [...secondRakah(), tashahhud, ...(prayer.rakahs === 2 ? [salawat, taslim] : [])],
  });

  if (prayer.rakahs >= 3) {
    rakahs.push({
      rakah: 3,
      steps: [
        ...silentRakah("3"),
        ...(prayer.rakahs === 3 ? [tashahhud, salawat, taslim] : []),
      ],
    });
  }
  if (prayer.rakahs === 4) {
    rakahs.push({
      rakah: 4,
      steps: [...silentRakah("4"), tashahhud, salawat, taslim],
    });
  }
  return rakahs;
}
