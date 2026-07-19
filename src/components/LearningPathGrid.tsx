import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BookOpenText,
  HeartHandshake,
  Languages,
  MoonStar,
  Sparkles,
} from "lucide-react";

type LearningPath = {
  title: string;
  arabic: string;
  description: string;
  href?: "/salah" | "/quran" | "/sunnah";
  icon:
    | typeof MoonStar
    | typeof BookOpenText
    | typeof HeartHandshake
    | typeof Sparkles
    | typeof Languages;
  available: boolean;
};

const learningPaths: LearningPath[] = [
  {
    title: "Learn Salah",
    arabic: "الصلاة",
    description:
      "Learn Wudu and every step of the five daily prayers through clear beginner-friendly lessons.",
    href: "/salah",
    icon: MoonStar,
    available: true,
  },
  {
    title: "Learn Quran",
    arabic: "القرآن",
    description:
      "Read by Surah, listen to recitation and understand the meaning of each verse.",
    href: "/quran",
    icon: BookOpenText,
    available: true,
  },
  {
    title: "Daily Duas",
    arabic: "الأدعية",
    description:
      "Learn authentic duas for sleep, food, travel, protection and everyday life.",
    icon: HeartHandshake,
    available: false,
  },
  {
    title: "Sunnah",
    arabic: "السنة",
    description:
      "Build small and authentic Sunnah habits into your everyday routine.",
    href: "/sunnah",
    icon: Sparkles,
    available: true,
  },
  {
    title: "Learn Arabic",
    arabic: "العربية",
    description:
      "Study Quranic Arabic and practical phrases with simple guided exercises.",
    icon: Languages,
    available: false,
  },
];

function CardContent({ path }: { path: LearningPath }) {
  const Icon = path.icon;

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary transition-transform duration-200 group-hover:scale-105">
          <Icon className="size-5" aria-hidden="true" />
        </div>

        {path.available ? (
          <ArrowUpRight
            className="size-4 text-accent transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1"
            aria-hidden="true"
          />
        ) : (
          <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Soon
          </span>
        )}
      </div>

      <div className="mt-6">
        <p
          dir="rtl"
          className="font-arabic text-xl leading-relaxed text-accent"
        >
          {path.arabic}
        </p>

        <h3 className="mt-1 font-serif text-2xl italic text-card-foreground">
          {path.title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {path.description}
        </p>
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs font-medium">
        {path.available ? (
          <>
            <span className="text-primary">Open path</span>
            <span
              className="h-px flex-1 bg-border transition-colors group-hover:bg-accent"
              aria-hidden="true"
            />
          </>
        ) : (
          <span className="text-muted-foreground">
            This learning path is being prepared
          </span>
        )}
      </div>
    </>
  );
}

export function LearningPathGrid() {
  return (
    <section className="space-y-6" aria-labelledby="learning-path-heading">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          Study at your own pace
        </p>

        <h2
          id="learning-path-heading"
          className="mt-1 font-serif text-3xl italic text-foreground md:text-4xl"
        >
          Choose your learning path
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
          Begin with what matters most to you and return whenever you are ready
          for the next step.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {learningPaths.map((path) => {
          const cardClassName = [
            "group relative min-h-[280px] overflow-hidden rounded-3xl border border-border/70 bg-card p-6 shadow-sm",
            "transition duration-200",
            path.available
              ? "hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg"
              : "cursor-default opacity-80",
          ].join(" ");

          if (path.available && path.href) {
            return (
              <Link
                key={path.title}
                to={path.href}
                className={cardClassName}
                aria-label={`Open ${path.title}`}
              >
                <div
                  className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-secondary/70 blur-2xl transition-transform duration-300 group-hover:scale-125"
                  aria-hidden="true"
                />

                <div className="relative z-10">
                  <CardContent path={path} />
                </div>
              </Link>
            );
          }

          return (
            <article
              key={path.title}
              className={cardClassName}
              aria-label={`${path.title}, coming soon`}
            >
              <div
                className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-muted blur-2xl"
                aria-hidden="true"
              />

              <div className="relative z-10">
                <CardContent path={path} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
