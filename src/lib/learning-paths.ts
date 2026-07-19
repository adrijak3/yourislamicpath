import {
  BookOpenText,
  Languages,
  MoonStar,
  Sparkles,
  HeartHandshake,
} from "lucide-react";

export const LEARNING_PATHS = [
  {
    title: "Learn Salah",
    arabic: "الصلاة",
    description:
      "Learn Wudu and every step of the five daily prayers at your own pace.",
    href: "/salah",
    icon: MoonStar,
    status: "Available",
  },
  {
    title: "Learn Quran",
    arabic: "القرآن",
    description:
      "Read Quran by surah, listen to recitation and understand each verse.",
    href: "/quran",
    icon: BookOpenText,
    status: "Available",
  },
  {
    title: "Daily Duas",
    arabic: "الأدعية",
    description:
      "Learn authentic duas for sleep, food, travel, protection and daily life.",
    href: "/duas",
    icon: HeartHandshake,
    status: "Available",
  },
  {
    title: "Sunnah",
    arabic: "السنة",
    description:
      "Build small, authentic Sunnah habits into your everyday routine.",
    href: "/sunnah",
    icon: Sparkles,
    status: "Available",
  },
  {
    title: "Learn Arabic",
    arabic: "العربية",
    description:
      "Study Quranic Arabic and practical phrases in your chosen dialect.",
    href: "/arabic",
    icon: Languages,
    status: "Available",
  },
] as const;
