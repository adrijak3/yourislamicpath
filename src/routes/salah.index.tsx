import { createFileRoute, Link } from "@tanstack/react-router";
import { GuidedPathNav } from "@/components/GuidedPathNav";
import { SALAH_LESSONS } from "@/lib/salah-course";
import {
  useCompletedLessons,
  useCurrentLesson,
  usePracticeCount,
  useSalahProgress,
} from "@/lib/salah-progress";

export const Route = createFileRoute("/salah/")({
  head: () => ({
    meta: [
      {
        title: "The Salah Course — Guided Path",
      },
      {
        name: "description",
        content:
          "A gentle, beginner-friendly Salah course covering preparation, movements, recitation and guided prayer practice.",
      },
      {
        property: "og:title",
        content: "The Salah Course — Guided Path",
      },
      {
        property: "og:description",
        content:
          "Learn how to pray step by step through calm lessons, clear explanations and guided practice.",
      },
    ],
  }),
  component: SalahIndex,
});

type LessonItem = (typeof SALAH_LESSONS)[number];

function LessonRow({
  lesson,
  isDone,
  isCurrent,
}: {
  lesson: LessonItem;
  isDone: boolean;
  isCurrent: boolean;
}) {
  return (
    <Link
      to="/salah/$slug"
      params={{ slug: lesson.slug }}
      aria-label={`Open lesson ${lesson.index}: ${lesson.titleEn}`}
      className={[
        "group relative flex items-center gap-4 overflow-hidden rounded-3xl border p-4 shadow-sm transition duration-200 md:p-5",
        isCurrent
          ? "border-accent/60 bg-card shadow-md ring-2 ring-accent/10"
          : isDone
            ? "border-border/60 bg-secondary/35"
            : "border-border/70 bg-card hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md",
      ].join(" ")}
    >
      {isCurrent && (
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-accent"
          aria-hidden="true"
        />
      )}

      <span
        className={[
          "grid size-11 shrink-0 place-items-center rounded-full text-xs font-semibold transition-colors",
          isDone
            ? "bg-primary text-primary-foreground"
            : isCurrent
              ? "bg-accent text-accent-foreground"
              : "bg-secondary text-foreground",
        ].join(" ")}
      >
        {isDone ? "✓" : String(lesson.index).padStart(2, "0")}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-serif text-xl italic text-card-foreground md:text-2xl">
            {lesson.titleEn}
          </h3>

          {lesson.titleAr && (
            <span
              dir="rtl"
              className="font-arabic text-base text-accent md:text-lg"
            >
              {lesson.titleAr}
            </span>
          )}
        </div>

        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {lesson.summary}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {isDone && (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-primary">
              Completed
            </span>
          )}

          {isCurrent && !isDone && (
            <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-accent">
              Continue here
            </span>
          )}

          {lesson.audioLabel && (
            <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
              Audio lesson
            </span>
          )}
        </div>
      </div>

      <span
        className="shrink-0 text-xl text-muted-foreground transition duration-200 group-hover:translate-x-1 group-hover:text-accent"
        aria-hidden="true"
      >
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

  const currentExists =
    current !== null &&
    SALAH_LESSONS.some((lesson) => lesson.slug === current);

  const continueSlug = currentExists ? current : nextLesson.slug;

  const continueLesson =
    SALAH_LESSONS.find((lesson) => lesson.slug === continueSlug) ?? nextLesson;

  return (
    <div className="min-h-screen bg-background pb-24 text-foreground">
      <GuidedPathNav />

      <main className="mx-auto max-w-3xl space-y-10 px-5 md:px-6">
        {/* Course introduction */}
        <section className="animate-fade-up space-y-4 pt-2 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
            Learning Path · مسار
          </span>

          <h1 className="text-balance font-serif text-4xl italic leading-tight text-foreground md:text-6xl">
            The Salah Course
          </h1>

          <p
            dir="rtl"
            className="font-arabic text-2xl leading-relaxed text-accent md:text-3xl"
          >
            دورة الصلاة
          </p>

          <p className="mx-auto max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
            Learn prayer gently, one lesson at a time. Begin with preparation
            and intention, then move through every recitation and movement until
            you feel ready to pray with confidence.
          </p>
        </section>

        {/* Progress overview */}
        <section className="space-y-6 rounded-3xl bg-primary p-6 text-primary-foreground shadow-xl shadow-primary/10 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                Your progress
              </p>

              <div className="mt-2 flex items-baseline gap-3">
                <span className="font-serif text-5xl italic">{percent}%</span>

                <span className="text-sm text-primary-foreground/65">
                  {completedCount} of {total} lessons
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                Practice sessions
              </p>

              <p className="mt-1 font-serif text-4xl italic">
                {practiceCount}
              </p>
            </div>
          </div>

          <div
            className="h-1.5 overflow-hidden rounded-full bg-primary-foreground/15"
            role="progressbar"
            aria-label="Salah course progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
          >
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              to="/salah/$slug"
              params={{ slug: continueLesson.slug }}
              className="rounded-2xl bg-background px-5 py-4 text-foreground transition duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground"
            >
              <p className="text-[10px] font-semibold uppercase tracking-widest opacity-65">
                {completedCount === total
                  ? "Review course"
                  : "Continue learning"}
              </p>

              <p className="mt-1 truncate font-serif text-xl italic">
                {continueLesson.titleEn}
              </p>
            </Link>

            <Link
              to="/salah/practice"
              className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 px-5 py-4 text-primary-foreground transition duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground"
            >
              <p className="text-[10px] font-semibold uppercase tracking-widest text-accent">
                Guided practice
              </p>

              <p className="mt-1 font-serif text-xl italic">
                Walk through a prayer
              </p>
            </Link>
          </div>
        </section>

        {/* Course guidance */}
        <section className="grid gap-4 sm:grid-cols-3">
          <InfoCard
            number="01"
            title="Learn"
            description="Read each lesson slowly and focus on one new thing at a time."
          />

          <InfoCard
            number="02"
            title="Listen"
            description="Use pronunciation recordings once they are connected to the course."
          />

          <InfoCard
            number="03"
            title="Practise"
            description="Walk through a full prayer using the guided practice mode."
          />
        </section>

        {/* Lessons */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                Step by step
              </p>

              <h2 className="mt-1 font-serif text-3xl italic text-foreground">
                Course lessons
              </h2>
            </div>

            <span className="rounded-full border border-border bg-card px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {completed.length} completed
            </span>
          </div>

          <ol className="space-y-3">
            {SALAH_LESSONS.map((lesson) => (
              <li key={lesson.slug}>
                <LessonRow
                  lesson={lesson}
                  isDone={isComplete(lesson.slug)}
                  isCurrent={lesson.slug === continueLesson.slug}
                />
              </li>
            ))}
          </ol>
        </section>

        <footer className="rounded-3xl border border-border/70 bg-secondary/40 p-6 text-center">
          <p className="font-serif text-xl italic text-foreground">
            Learning prayer takes patience, not perfection.
          </p>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Repeat lessons whenever you need to. Progress is not measured by
            speed.
          </p>
        </footer>
      </main>
    </div>
  );
}

function InfoCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
        {number}
      </span>

      <h2 className="mt-2 font-serif text-2xl italic text-card-foreground">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </article>
  );
}
