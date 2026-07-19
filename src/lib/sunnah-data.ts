export interface SunnahLesson {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  practice: string;
  source: string;
  category: "Morning" | "Prayer" | "Food" | "Character" | "Sleep";
}

export const SUNNAH_LESSONS: SunnahLesson[] = [
  {
    id: "smile",
    title: "Smile and show kindness",
    arabicTitle: "التبسم",
    description:
      "A warm smile and gentle behaviour are simple acts of goodness.",
    practice:
      "Make an effort to greet someone warmly or smile kindly today.",
    source: "Jamiʿ at-Tirmidhi 1956",
    category: "Character",
  },
  {
    id: "right-hand",
    title: "Eat with your right hand",
    arabicTitle: "الأكل باليمين",
    description:
      "Begin with Bismillah and eat or drink with the right hand.",
    practice:
      "Before your next meal, pause and say Bismillah.",
    source: "Sahih Muslim 2020",
    category: "Food",
  },
  {
    id: "salam",
    title: "Spread the greeting of peace",
    arabicTitle: "إفشاء السلام",
    description:
      "Say as-salāmu ʿalaykum when greeting another Muslim.",
    practice:
      "Give salam clearly and sincerely to someone today.",
    source: "Sahih Muslim 54",
    category: "Character",
  },
  {
    id: "sleep-right",
    title: "Sleep on your right side",
    arabicTitle: "النوم على الجانب الأيمن",
    description:
      "After preparing for sleep, lie down on your right side.",
    practice:
      "Try this position tonight while saying your sleep dua.",
    source: "Sahih al-Bukhari 247",
    category: "Sleep",
  },
];
