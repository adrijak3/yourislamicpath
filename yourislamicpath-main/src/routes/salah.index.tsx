import { GuidedPathNav } from "@/components/GuidedPathNav";

import { SALAH_LESSONS } from "@/lib/salah-course";
import {
  useCompletedLessons,
  useCurrentLesson,
  usePracticeCount,
  useSalahProgress,
} from "@/lib/salah-progress";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/salah/")({
  head: () => ({
    meta: [
      { title: "The Salah Course — Guided Path" },
      {
        name: "description",
        content:
          "A gentle, complete Salah course for new Muslims and reverts — 20 lessons, guided practice, and a calm, mobile-first design.",
      },
      { property: "og:title", content: "The Salah Course — Guided Path" },
      {
        property: "og:description",
        content:
          "Learn how to pray, step by step. Intention, wudu, movements, recitation, and a full guided practice mode.",
      },
    ],
  }),
  component: SalahIndex,
});

function LessonRow({
  lesson,
  isDone,
  isCurrent,
}: {
  lesson: (typeof SALAH_LESSONS)[number];
  isDone: boolean;
  isCurrent: boolean;
}) {
  return (
    <Link
      to="/salah/$slug"
      params={{ slug: lesson.slug }}
      className={[
        "group flex items-center gap-4 rounded-2xl border p-4 md:p-5 transition-colors",
        isCurrent
          ? "bg-card border-accent/60 shadow-sm shadow-gold-600/10"
          : isDone
            ? "bg-card/70 border-border/60"
            : "bg-card border-border/60 hover:border-accent/40",
      ].join(" ")}
    >
      <span
        className={[
          "shrink-0 size-10 rounded-full grid place-items-center text-xs font-semibold",
          isDone
            ? "bg-primary/85 text-primary-foreground"
            : isCurrent
              ? "bg-accent text-primary-foreground"
              : "bg-muted text-muted-foreground",
        ].join(" ")}
      >
        {isDone ? "✓" : String(lesson.index).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-serif italic text-xl md:text-2xl text-foreground truncate">
            {lesson.titleEn}
          </h3>
          {lesson.titleAr && (
            <span
              dir="rtl"
              className="font-arabic text-muted-foreground text-base md:text-lg"
            >
              {lesson.titleAr}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1 text-pretty leading-relaxed">
          {lesson.summary}
        </p>
      </div>
      <span className="text-muted-foreground/50 group-hover:text-accent transition-colors text-xl shrink-0">
        →
      </span>
    </Link>
  );
}

function SalahIndex() {
  const { completed, isComplete } = useCompletedLessons();
  const { current } = useCurrentLesson();
  const { percent, completedCount, total, nextLesson } = useSalahProgress();
  const { count: practiceCount } = usePracticeCount();

  const continueSlug = current ?? nextLesson.slug;

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <GuidedPathNav />

      <main className="max-w-3xl mx-auto px-5 md:px-6 space-y-10">
        {/* Hero */}
        <section className="text-center space-y-4 pt-2 animate-fade-up">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
            Learning Path · مسار
          </span>
          <h1 className="font-serif italic text-4xl md:text-5xl text-foreground text-balance">
            The Salah Course
          </h1>
          <p dir="rtl" className="font-arabic text-2xl text-muted-foreground">
            دورة الصلاة
          </p>
          <p className="max-w-lg mx-auto text-muted-foreground text-pretty leading-relaxed">
            Twenty gentle lessons — from your very first intention to a full,
            guided prayer. Move at your own pace. Nothing is rushed.
          </p>
        </section>

        {/* Progress card */}
        <section className="bg-primary text-primary-foreground rounded-3xl p-6 md:p-8 space-y-5 shadow-xl shadow-primary/10">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-accent">
                Your progress
              </span>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="font-serif italic text-5xl">{percent}%</span>
                <span className="text-primary-foreground/60 text-sm">
                  {completedCount} of {total} lessons
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-widest text-accent">
                Practice sessions
              </span>
              <div className="mt-1 font-serif italic text-3xl">{practiceCount}</div>
            </div>
          </div>
          <div className="h-1.5 bg-primary-foreground/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link
              to="/salah/$slug"
              params={{ slug: continueSlug }}
              className="bg-background text-foreground rounded-2xl px-5 py-4 text-center hover:bg-accent hover:text-primary-foreground transition-colors"
            >
              <div className="text-[10px] uppercase tracking-widest opacity-70">
                Continue learning
              </div>
              <div className="font-serif italic text-lg mt-1 truncate">
                {SALAH_LESSONS.find((l) => l.slug === continueSlug)?.titleEn}
              </div>
            </Link>
            <Link
              to="/salah/practice"
              className="bg-primary/85 text-primary-foreground rounded-2xl px-5 py-4 text-center hover:bg-accent transition-colors"
            >
              <div className="text-[10px] uppercase tracking-widest text-accent">
                Full practice
              </div>
              <div className="font-serif italic text-lg mt-1">
                Walk through a prayer
              </div>
            </Link>
          </div>
        </section>

        {/* Lessons list */}
        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">
              Lessons
            </h2>
            <span className="text-xs text-muted-foreground/70">
              {completed.length} completed
            </span>
          </div>
          <ol className="space-y-3">
            {SALAH_LESSONS.map((l) => (
              <li key={l.slug}>
                <LessonRow
                  lesson={l}
                  isDone={isComplete(l.slug)}
                  isCurrent={l.slug === continueSlug}
                />
              </li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  );
}
