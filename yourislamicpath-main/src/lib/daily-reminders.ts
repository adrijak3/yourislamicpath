// Curated, beginner-friendly daily reminders.
// One reminder is picked deterministically per calendar day.

export type ReminderType = "Quran" | "Hadith" | "Dua" | "Sunnah";

export type Reminder = {
  type: ReminderType;
  arabic: string;
  english: string;
  source: string; // exact reference
  explanation: string; // short beginner-friendly note
  category: string; // e.g. "Mercy", "Patience"
  // For Quran entries: allows optional API validation of the verse text
  quranRef?: { surah: number; ayah: number };
};

export const REMINDERS: Reminder[] = [
  {
    type: "Quran",
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    english: "So truly, with hardship comes ease.",
    source: "Qur’an 94:5 (Ash-Sharḥ)",
    explanation:
      "Whatever difficulty you face today, ease is not far behind — Allah pairs them.",
    category: "Hope",
    quranRef: { surah: 94, ayah: 5 },
  },
  {
    type: "Quran",
    arabic: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
    english: "Seek help through patience and prayer.",
    source: "Qur’an 2:45 (Al-Baqarah)",
    explanation:
      "When life feels heavy, return to Salah. It is not just an obligation — it is a source of strength.",
    category: "Prayer",
    quranRef: { surah: 2, ayah: 45 },
  },
  {
    type: "Quran",
    arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    english: "Indeed, Allah is with the patient.",
    source: "Qur’an 2:153 (Al-Baqarah)",
    explanation:
      "Patience is not passive. It is trusting Allah as you keep going.",
    category: "Patience",
    quranRef: { surah: 2, ayah: 153 },
  },
  {
    type: "Quran",
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    english: "Whoever relies on Allah — He is sufficient for them.",
    source: "Qur’an 65:3 (At-Talaq)",
    explanation:
      "You do not have to carry every worry alone. Trust that He is enough.",
    category: "Trust",
    quranRef: { surah: 65, ayah: 3 },
  },
  {
    type: "Hadith",
    arabic:
      "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    english:
      "Actions are only by intentions, and every person will have only what they intended.",
    source: "Ṣaḥīḥ al-Bukhārī 1, Ṣaḥīḥ Muslim 1907",
    explanation:
      "Even small acts become worship when done for the sake of Allah. Renew your intention often.",
    category: "Intention",
  },
  {
    type: "Hadith",
    arabic: "مَنْ لَا يَرْحَمْ لَا يُرْحَمْ",
    english: "Whoever does not show mercy will not be shown mercy.",
    source: "Ṣaḥīḥ al-Bukhārī 7376",
    explanation:
      "How we treat others returns to us — first from Allah, then from His creation.",
    category: "Mercy",
  },
  {
    type: "Hadith",
    arabic: "الطُّهُورُ شَطْرُ الْإِيمَانِ",
    english: "Purification is half of faith.",
    source: "Ṣaḥīḥ Muslim 223",
    explanation:
      "Wudu is not a chore — it is worship. Half of your faith is expressed in keeping yourself clean.",
    category: "Purity",
  },
  {
    type: "Dua",
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
    english: "My Lord, expand my chest for me and make my task easy for me.",
    source: "Qur’an 20:25–26 (Ṭā-Hā) — duʿāʾ of Mūsā عليه السلام",
    explanation:
      "A short duʿāʾ to whisper before something difficult — a hard conversation, a task, a new step.",
    category: "Ease",
    quranRef: { surah: 20, ayah: 25 },
  },
  {
    type: "Dua",
    arabic: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
    english:
      "O Allah, help me to remember You, thank You, and worship You in the best way.",
    source: "Sunan Abī Dāwūd 1522 (ṣaḥīḥ)",
    explanation:
      "The Prophet ﷺ told Muʿādh to say this after every prayer. Try it once today.",
    category: "Remembrance",
  },
  {
    type: "Sunnah",
    arabic: "بِسْمِ اللَّهِ",
    english: "In the name of Allah — said before eating, drinking, and beginning tasks.",
    source: "Sunnah of the Prophet ﷺ (see Jāmiʿ at-Tirmidhī 1858)",
    explanation:
      "A tiny habit that turns ordinary moments into worship. Say it before your next meal.",
    category: "Daily Sunnah",
  },
  {
    type: "Sunnah",
    arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ",
    english: "Peace be upon you, and Allah’s mercy and blessings.",
    source: "Sunan Abī Dāwūd 5195",
    explanation:
      "Spreading salām, even to those you do not know, is a beloved sunnah that softens hearts.",
    category: "Community",
  },
  {
    type: "Hadith",
    arabic: "أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ",
    english:
      "The most beloved deeds to Allah are those done consistently, even if small.",
    source: "Ṣaḥīḥ al-Bukhārī 6464, Ṣaḥīḥ Muslim 783",
    explanation:
      "Small and steady beats big and rare. One honest rak‘ah today matters.",
    category: "Consistency",
  },
];

export function pickTodayReminder(now: Date = new Date()): Reminder {
  // Local calendar day, deterministic across the day.
  const day = Math.floor(
    (now.getTime() - now.getTimezoneOffset() * 60_000) / 86_400_000,
  );
  return REMINDERS[Math.abs(day) % REMINDERS.length];
}
