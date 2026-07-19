// Structured content for the Salah learning path.
// Each lesson is beginner-friendly, includes Arabic (where relevant),
// transliteration, translation, "why", common mistakes, and an audio slot.

export type Gender = "both" | "male" | "female";

export type GenderNote = {
  audience: Gender; // who this note applies to
  text: string;
};

export type LessonPhrase = {
  arabic?: string;
  transliteration?: string;
  translation?: string;
};

export type Lesson = {
  slug: string;
  index: number; // 1..N
  titleEn: string;
  titleAr?: string;
  transliteration?: string;
  summary: string;
  explanation: string; // beginner-friendly body
  phrase?: LessonPhrase; // main phrase for this lesson
  extraPhrases?: LessonPhrase[]; // e.g. Fatiha lines
  why: string; // "why we do this" body
  mistakes: string[];
  audioLabel?: string; // shown near the audio button
  genderNotes?: GenderNote[]; // shown only if content differs
  scholarlyNote?: string; // shown as a calm "opinions may vary" note
};

export const SALAH_LESSONS: Lesson[] = [
  {
    slug: "introduction",
    index: 1,
    titleEn: "Introduction to Salah",
    titleAr: "مقدمة في الصلاة",
    transliteration: "Muqaddimah fi al-Ṣalāh",
    summary:
      "What prayer is, why it matters, and how this course will guide you.",
    explanation:
      "Salah is the daily prayer that Muslims perform five times a day. It is a direct, personal conversation with Allah — a moment to pause, remember, and reconnect. This course walks you gently through every part of prayer, one small step at a time.",
    why:
      "Salah keeps the heart tethered to Allah throughout the day. It gives rhythm, humility, and calm, and is a source of forgiveness and peace for the believer.",
    mistakes: [
      "Feeling you must know everything before starting — you don't.",
      "Comparing yourself to lifelong Muslims. Every prayer counts, even the first one.",
    ],
    audioLabel: "Listen: overview",
  },
  {
    slug: "five-prayers",
    index: 2,
    titleEn: "The Five Daily Prayers",
    titleAr: "الصلوات الخمس",
    transliteration: "Al-Ṣalawāt al-Khams",
    summary:
      "Names, times, and the number of rak‘ahs (units) for each prayer.",
    explanation:
      "There are five obligatory prayers each day. Fajr (2 rak‘ahs) at dawn, Dhuhr (4) after midday, ‘Asr (4) in the afternoon, Maghrib (3) just after sunset, and ‘Isha (4) at night. A rak‘ah is one complete cycle of standing, bowing, and prostrating.",
    why:
      "Spacing the prayers across the day makes remembrance of Allah a steady rhythm, not a single event.",
    mistakes: [
      "Confusing rak‘ah counts — write them down at first, that is fine.",
      "Trying to memorise all times before praying even one. Start with the next prayer.",
    ],
    audioLabel: "Listen: names of the prayers",
  },
  {
    slug: "wudu",
    index: 3,
    titleEn: "Wudu — Ritual Washing",
    titleAr: "الوضوء",
    transliteration: "Al-Wuḍūʾ",
    summary: "How to purify yourself before prayer, step by step.",
    explanation:
      "Wudu is a short, gentle washing done before prayer. Say Bismillāh, wash the hands three times, rinse the mouth three times, sniff water into the nose and blow it out three times, wash the face three times, wash each arm to the elbow three times, wipe the head and ears once, then wash each foot to the ankle three times.",
    phrase: {
      arabic: "بِسْمِ اللَّهِ",
      transliteration: "Bismillāh",
      translation: "In the name of Allah",
    },
    why:
      "Wudu prepares the body and slows the heart, so you enter prayer clean, calm, and present.",
    mistakes: [
      "Rushing through the steps.",
      "Missing a spot — water should reach every part of the washed area.",
      "Not wiping the head, only the hair on top.",
    ],
    audioLabel: "Listen: Bismillāh",
  },
  {
    slug: "preparing",
    index: 4,
    titleEn: "Preparing for Prayer",
    titleAr: "الاستعداد للصلاة",
    transliteration: "Al-Istiʿdād li-l-Ṣalāh",
    summary: "Clean clothes, a clean spot, and facing the qiblah.",
    explanation:
      "Wear modest, clean clothes. Choose a clean, quiet spot. Face the qiblah — the direction of the Kaʿbah in Makkah. If you are unsure, use a compass app or your best guess; Allah does not burden you beyond what you can find.",
    why:
      "Outer stillness helps inner stillness. Preparing thoughtfully teaches the heart that prayer is important.",
    mistakes: [
      "Praying with distractions nearby (TV, phone notifications).",
      "Worrying about the exact qiblah when your best effort is what is asked of you.",
    ],
    genderNotes: [
      {
        audience: "female",
        text: "Cover the whole body except the face and hands, and wear something loose that does not show the shape underneath.",
      },
      {
        audience: "male",
        text: "At minimum, cover from the navel to the knees; a shirt covering the shoulders is preferred.",
      },
    ],
  },
  {
    slug: "niyyah",
    index: 5,
    titleEn: "Intention (Niyyah)",
    titleAr: "النية",
    transliteration: "Al-Niyyah",
    summary: "A quiet decision in the heart before you begin.",
    explanation:
      "Before the opening takbir, silently decide in your heart which prayer you are about to perform — for example, ‘the two rak‘ahs of Fajr for Allah’. The intention is silent; you do not need to say it aloud.",
    why:
      "Actions are judged by their intentions. Niyyah roots the prayer in sincerity, so the movements are not empty.",
    mistakes: [
      "Trying to speak the niyyah aloud in Arabic — this is not required.",
      "Overthinking the wording. A simple, sincere intention is enough.",
    ],
    scholarlyNote:
      "Some traditions recite a spoken intention, others keep it silent. Both come from valid scholarly opinions.",
  },
  {
    slug: "takbir",
    index: 6,
    titleEn: "The Opening Takbir",
    titleAr: "تكبيرة الإحرام",
    transliteration: "Takbīrat al-Iḥrām",
    summary: "The first ‘Allāhu Akbar’ that opens the prayer.",
    explanation:
      "Raise your hands to shoulder or ear level and say ‘Allāhu Akbar’. From this moment you are in prayer — put the world behind you.",
    phrase: {
      arabic: "اللَّهُ أَكْبَرُ",
      transliteration: "Allāhu Akbar",
      translation: "Allah is the Greatest",
    },
    why:
      "The words remind you that nothing you left behind — worries, tasks, people — is greater than the One you now stand before.",
    mistakes: [
      "Mumbling the takbir. Say it clearly, even if softly.",
      "Raising the hands after saying it — raise them with the words.",
    ],
    audioLabel: "Listen: Allāhu Akbar",
    genderNotes: [
      {
        audience: "male",
        text: "Hands are commonly raised to ear level.",
      },
      {
        audience: "female",
        text: "Hands are commonly raised to shoulder level.",
      },
    ],
  },
  {
    slug: "standing",
    index: 7,
    titleEn: "Standing & Hand Position",
    titleAr: "القيام",
    transliteration: "Al-Qiyām",
    summary: "How to stand, and where to place your hands.",
    explanation:
      "Stand upright with feet a comfortable distance apart. Place your right hand over your left on your chest or just below the navel. Eyes rest on the place of prostration.",
    why:
      "A calm, upright posture reflects a calm, upright heart. Fixing the gaze protects you from distraction.",
    mistakes: [
      "Looking around the room.",
      "Locking the knees or slouching.",
    ],
    scholarlyNote:
      "Hand placement (on the chest, above the navel, or below the navel) varies between scholarly opinions — all are valid.",
  },
  {
    slug: "opening-dua",
    index: 8,
    titleEn: "Opening Supplication",
    titleAr: "دعاء الاستفتاح",
    transliteration: "Duʿāʾ al-Istiftāḥ",
    summary: "A short private praise to Allah before Al-Fātiḥah.",
    explanation:
      "After the takbir, quietly praise Allah with a short opening supplication before you begin Al-Fātiḥah.",
    phrase: {
      arabic:
        "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ",
      transliteration:
        "Subḥānaka Allāhumma wa biḥamdika, wa tabāraka smuka, wa taʿālā jadduka, wa lā ilāha ghayruk",
      translation:
        "Glory be to You, O Allah, and praise; blessed is Your name and exalted is Your majesty; there is no god but You.",
    },
    why:
      "It softens the heart before speaking the great words of Al-Fātiḥah.",
    mistakes: [
      "Skipping it, thinking it is required — it is a recommended sunnah.",
      "Saying it out loud in a quiet prayer.",
    ],
    audioLabel: "Listen: Subḥānaka Allāhumma",
    scholarlyNote:
      "Several authentic opening supplications exist. Any one of them is enough.",
  },
  {
    slug: "fatiha",
    index: 9,
    titleEn: "Al-Fātiḥah",
    titleAr: "الفاتحة",
    transliteration: "Al-Fātiḥah",
    summary: "The opening chapter of the Qur’an, recited in every rak‘ah.",
    explanation:
      "Al-Fātiḥah is seven short verses. It must be recited in every rak‘ah of every prayer. Take your time; do not rush.",
    phrase: {
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      transliteration: "Bismi-llāhi r-Raḥmāni r-Raḥīm",
      translation: "In the name of Allah, the Most Merciful, the Especially Merciful.",
    },
    extraPhrases: [
      {
        arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        transliteration: "Al-ḥamdu lillāhi Rabbi l-ʿālamīn",
        translation: "All praise is due to Allah, Lord of all worlds.",
      },
      {
        arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
        transliteration: "Ar-Raḥmāni r-Raḥīm",
        translation: "The Most Merciful, the Especially Merciful.",
      },
      {
        arabic: "مَالِكِ يَوْمِ الدِّينِ",
        transliteration: "Māliki yawmi d-dīn",
        translation: "Sovereign of the Day of Judgement.",
      },
      {
        arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        transliteration: "Iyyāka naʿbudu wa iyyāka nastaʿīn",
        translation: "You alone we worship, and You alone we ask for help.",
      },
      {
        arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        transliteration: "Ihdinā ṣ-ṣirāṭa l-mustaqīm",
        translation: "Guide us to the straight path.",
      },
      {
        arabic:
          "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        transliteration:
          "Ṣirāṭa lladhīna anʿamta ʿalayhim ghayri l-maghḍūbi ʿalayhim wa lā ḍ-ḍāllīn",
        translation:
          "The path of those You have blessed — not of those who earned anger, nor of those who went astray.",
      },
    ],
    why:
      "Al-Fātiḥah is described in a hadith as a conversation between the servant and their Lord. Every verse is answered by Allah.",
    mistakes: [
      "Reciting so fast the letters blur into each other.",
      "Skipping ‘Āmīn’ at the end (say it quietly to yourself).",
    ],
    audioLabel: "Listen: Al-Fātiḥah",
  },
  {
    slug: "short-surah",
    index: 10,
    titleEn: "A Short Surah",
    titleAr: "سورة قصيرة",
    transliteration: "Sūrah Qaṣīrah",
    summary: "After Al-Fātiḥah, add a short passage of the Qur’an.",
    explanation:
      "In the first two rak‘ahs, add a short surah after Al-Fātiḥah. Surah Al-Ikhlāṣ is short, well-known, and beloved. Learn one surah at a time.",
    phrase: {
      arabic:
        "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
      transliteration:
        "Qul huwa Llāhu aḥad · Allāhu ṣ-ṣamad · Lam yalid wa lam yūlad · Wa lam yakun lahu kufuwan aḥad",
      translation:
        "Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, and there is none like Him.",
    },
    why:
      "Every surah brings you closer to the words of Allah, and Surah Al-Ikhlāṣ is said to equal a third of the Qur’an in reward.",
    mistakes: [
      "Adding a surah in the 3rd or 4th rak‘ah — only Al-Fātiḥah is needed there.",
      "Trying to memorise a long surah first. Start small and build.",
    ],
    audioLabel: "Listen: Al-Ikhlāṣ",
  },
  {
    slug: "ruku",
    index: 11,
    titleEn: "Rukūʿ — Bowing",
    titleAr: "الركوع",
    transliteration: "Al-Rukūʿ",
    summary: "Bow forward with a straight back, hands on the knees.",
    explanation:
      "Say ‘Allāhu Akbar’ and bow so your back is level. Grip the knees. Look at the ground between your feet. Say the phrase of rukūʿ three times.",
    phrase: {
      arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
      transliteration: "Subḥāna Rabbiya l-ʿAẓīm",
      translation: "Glory be to my Lord, the Most Great.",
    },
    why:
      "Bowing humbles the body before the Creator; the words remind the tongue of His greatness.",
    mistakes: [
      "Bowing too low or barely at all.",
      "Rushing — pause and settle before rising.",
    ],
    audioLabel: "Listen: Subḥāna Rabbiya l-ʿAẓīm",
  },
  {
    slug: "standing-after-ruku",
    index: 12,
    titleEn: "Standing After Rukūʿ",
    titleAr: "الاعتدال",
    transliteration: "Al-Iʿtidāl",
    summary: "Rise from bowing and stand straight before prostrating.",
    explanation:
      "As you rise, say ‘Samiʿa Llāhu liman ḥamidah’. Once standing fully, say ‘Rabbanā wa laka l-ḥamd’. Stand still for a moment before going down.",
    phrase: {
      arabic: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ · رَبَّنَا وَلَكَ الْحَمْدُ",
      transliteration: "Samiʿa Llāhu liman ḥamidah · Rabbanā wa laka l-ḥamd",
      translation: "Allah hears those who praise Him · Our Lord, all praise is for You.",
    },
    why:
      "Stillness between movements is part of the prayer — hurrying steals its calm.",
    mistakes: [
      "Diving into sujūd without standing straight first.",
      "Not settling — the body should be still.",
    ],
  },
  {
    slug: "sujud",
    index: 13,
    titleEn: "Sujūd — Prostration",
    titleAr: "السجود",
    transliteration: "Al-Sujūd",
    summary: "Place forehead, nose, palms, knees, and toes on the ground.",
    explanation:
      "Say ‘Allāhu Akbar’ and lower yourself so the forehead, nose, both palms, both knees, and the toes touch the ground. Say the phrase of sujūd three times.",
    phrase: {
      arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى",
      transliteration: "Subḥāna Rabbiya l-Aʿlā",
      translation: "Glory be to my Lord, the Most High.",
    },
    why:
      "Sujūd is the closest a person is to Allah. It is the most powerful posture for making duʿāʾ from the heart.",
    mistakes: [
      "Forehead not touching the ground.",
      "Elbows resting on the floor — keep them raised.",
    ],
    audioLabel: "Listen: Subḥāna Rabbiya l-Aʿlā",
    genderNotes: [
      {
        audience: "male",
        text: "Keep the elbows lifted away from the sides and the belly away from the thighs.",
      },
      {
        audience: "female",
        text: "Draw the limbs closer to the body — arms near the sides, belly resting near the thighs.",
      },
    ],
  },
  {
    slug: "sitting-between",
    index: 14,
    titleEn: "Sitting Between the Prostrations",
    titleAr: "الجلوس بين السجدتين",
    transliteration: "Al-Julūs bayna s-Sajdatayn",
    summary: "A brief seated pause between the two prostrations.",
    explanation:
      "Rise from the first sujūd and sit briefly on the left foot, right foot upright. Ask Allah for forgiveness.",
    phrase: {
      arabic: "رَبِّ اغْفِرْ لِي",
      transliteration: "Rabbi ghfir lī",
      translation: "My Lord, forgive me.",
    },
    why:
      "This is a moment made just for asking forgiveness — take it, however brief.",
    mistakes: [
      "Skipping the pause and jumping into the second sujūd.",
      "Sitting so fast the tongue cannot even form the words.",
    ],
  },
  {
    slug: "second-sujud",
    index: 15,
    titleEn: "The Second Prostration",
    titleAr: "السجدة الثانية",
    transliteration: "Al-Sajdah al-Thāniyah",
    summary: "A second sujūd identical to the first — completing the rak‘ah.",
    explanation:
      "Say ‘Allāhu Akbar’ and prostrate again, repeating ‘Subḥāna Rabbiya l-Aʿlā’ three times. This completes one rak‘ah.",
    phrase: {
      arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى",
      transliteration: "Subḥāna Rabbiya l-Aʿlā",
      translation: "Glory be to my Lord, the Most High.",
    },
    why:
      "The two prostrations mirror each other, so the rak‘ah ends in the posture of deepest humility.",
    mistakes: [
      "Forgetting the second sujūd — every rak‘ah has two.",
      "Rushing to stand up without settling first.",
    ],
  },
  {
    slug: "tashahhud",
    index: 16,
    titleEn: "Tashahhud",
    titleAr: "التشهد",
    transliteration: "Al-Tashahhud",
    summary: "The seated testimony after every two rak‘ahs.",
    explanation:
      "After the second rak‘ah, sit and recite the tashahhud quietly. In prayers longer than two rak‘ahs, stand up again after this and continue.",
    phrase: {
      arabic:
        "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
      transliteration:
        "At-taḥiyyātu lillāhi wa ṣ-ṣalawātu wa ṭ-ṭayyibāt · as-salāmu ʿalayka ayyuha n-nabiyyu wa raḥmatu Llāhi wa barakātuh · as-salāmu ʿalaynā wa ʿalā ʿibādi Llāhi ṣ-ṣāliḥīn · ashhadu an lā ilāha illā Llāh · wa ashhadu anna Muḥammadan ʿabduhu wa rasūluh",
      translation:
        "All greetings, prayers, and pure words are for Allah. Peace be upon you, O Prophet, and Allah’s mercy and blessings. Peace be upon us and upon Allah’s righteous servants. I bear witness that there is no god but Allah, and I bear witness that Muhammad is His servant and messenger.",
    },
    why:
      "Tashahhud is the moment where the tongue affirms what the heart believes.",
    mistakes: [
      "Trying to learn all of it at once — memorise it in small pieces.",
      "Raising the index finger the whole time — it is typically pointed at the words of shahāda.",
    ],
    audioLabel: "Listen: Tashahhud",
  },
  {
    slug: "salawat",
    index: 17,
    titleEn: "Salawāt on the Prophet ﷺ",
    titleAr: "الصلاة على النبي ﷺ",
    transliteration: "Aṣ-Ṣalāh ʿalā n-Nabiyy",
    summary: "Sending blessings on the Prophet after the tashahhud.",
    explanation:
      "In the final sitting of the prayer, after the tashahhud, recite salawāt (the Ibrahimi supplication) upon the Prophet ﷺ.",
    phrase: {
      arabic:
        "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
      transliteration:
        "Allāhumma ṣalli ʿalā Muḥammadin wa ʿalā āli Muḥammad, kamā ṣallayta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīm, innaka Ḥamīdun Majīd",
      translation:
        "O Allah, send prayers upon Muhammad and the family of Muhammad, as You sent prayers upon Ibrahim and his family. Indeed, You are Praiseworthy and Glorious.",
    },
    why:
      "Blessings upon the Prophet ﷺ return to us multiplied, and connect us to a line of guidance stretching back to Ibrāhīm ʿalayhi s-salām.",
    mistakes: [
      "Reciting it before the tashahhud instead of after.",
      "Skipping the second half about Ibrāhīm.",
    ],
    audioLabel: "Listen: Ṣalāh Ibrāhīmiyyah",
  },
  {
    slug: "taslim",
    index: 18,
    titleEn: "Taslīm — Ending the Prayer",
    titleAr: "التسليم",
    transliteration: "Al-Taslīm",
    summary: "Turning the head right, then left, to close the prayer.",
    explanation:
      "Turn the head to the right and say ‘As-salāmu ʿalaykum wa raḥmatu Llāh’. Turn to the left and say it again. Your prayer is complete.",
    phrase: {
      arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
      transliteration: "As-salāmu ʿalaykum wa raḥmatu Llāh",
      translation: "Peace be upon you, and Allah’s mercy.",
    },
    why:
      "You end by wishing peace — on the angels who record your deeds, and on all around you.",
    mistakes: [
      "Only turning once — the taslīm is to both sides.",
      "Standing up or grabbing the phone immediately. Sit a moment; make duʿāʾ.",
    ],
    audioLabel: "Listen: Taslīm",
  },
  {
    slug: "common-mistakes",
    index: 19,
    titleEn: "Common Beginner Mistakes",
    titleAr: "أخطاء شائعة للمبتدئين",
    transliteration: "Akhṭāʾ shāʾiʿah li-l-mubtadiʾīn",
    summary: "Gentle reminders as you build the habit of prayer.",
    explanation:
      "Every beginner slips. What matters is returning. A few common ones: rushing through the movements; praying without pause between postures; forgetting which rak‘ah you are on; feeling frustrated if you cannot pronounce Arabic perfectly. None of these break your prayer if made in sincerity.",
    why:
      "Naming these mistakes takes their weight away. You are learning — that is holy work in itself.",
    mistakes: [
      "Speaking to yourself: ‘I will never get this right.’ — you will.",
      "Skipping a prayer because you fear doing it wrong. Pray it anyway.",
      "Comparing your prayer to others’. The Prophet ﷺ praised those who kept trying.",
    ],
  },
  {
    slug: "full-practice",
    index: 20,
    titleEn: "Full Prayer Practice",
    titleAr: "التطبيق الكامل",
    transliteration: "Al-Taṭbīq al-Kāmil",
    summary: "Put everything together and walk through a real prayer.",
    explanation:
      "Now that you know each piece, walk through a full prayer step by step in Practice mode. Choose any of the five prayers and follow along at your own pace.",
    why:
      "Practising the whole flow — even outside of prayer time — builds the muscle memory that lets the heart focus during the real prayer.",
    mistakes: [
      "Treating practice as ‘the real thing’ — practice is preparation, not obligation.",
    ],
  },
];

export const LESSON_BY_SLUG: Record<string, Lesson> = Object.fromEntries(
  SALAH_LESSONS.map((l) => [l.slug, l]),
);

export function neighborLessons(slug: string) {
  const i = SALAH_LESSONS.findIndex((l) => l.slug === slug);
  return {
    prev: i > 0 ? SALAH_LESSONS[i - 1] : null,
    next: i >= 0 && i < SALAH_LESSONS.length - 1 ? SALAH_LESSONS[i + 1] : null,
  };
}
