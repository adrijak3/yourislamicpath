import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  Languages,
  MoonStar,
  Sparkles,
  HeartHandshake,
} from "lucide-react";

type LearningPathBase = {
  title: string;
  arabic: string;
  description: string;
  icon: LucideIcon;
};

export type LearningPath =
  | (LearningPathBase & {
      href: "/salah" | "/quran" | "/sunnah";
      status: "available";
    })
  | (LearningPathBase & {
      href: "/duas" | "/arabic";
      status: "coming-soon";
    });

export const LEARNING_PATHS: LearningPath[] = [
  {
    title: "Learn Salah",
    arabic: "الصلاة",
    description:
      "Learn Wudu and every step of the five daily prayers at your own pace.",
    href: "/salah",
    icon: MoonStar,
    status: "available",
  },
  {
    title: "Learn Quran",
    arabic: "القرآن",
    description:
      "Read Quran by surah, listen to recitation and understand each verse.",
    href: "/quran",
    icon: BookOpenText,
    status: "available",
  },
  {
    title: "Daily Duas",
    arabic: "الأدعية",
    description:
      "Learn authentic duas for sleep, food, travel, protection and daily life.",
    href: "/duas",
    icon: HeartHandshake,
    status: "coming-soon",
  },
  {
    title: "Sunnah",
    arabic: "السنة",
    description:
      "Build small, authentic Sunnah habits into your everyday routine.",
    href: "/sunnah",
    icon: Sparkles,
    status: "available",
  },
  {
    title: "Learn Arabic",
    arabic: "العربية",
    description:
      "Study Quranic Arabic and practical phrases in your chosen dialect.",
    href: "/arabic",
    icon: Languages,
    status: "coming-soon",
  },
];
