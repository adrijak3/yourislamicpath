import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { GuidedPathNav } from "@/components/GuidedPathNav";
import { PrayerTimesCard } from "@/components/PrayerTimesCard";
import { MosqueHero } from "@/components/MosqueHero";
import { LearningPathGrid } from "@/components/LearningPathGrid";
import { SALAH_LESSONS } from "@/lib/salah-course";
import { pickTodayReminder, type Reminder } from "@/lib/daily-reminders";
import {
  usePracticeCount,
  useSalahProgress,
  useCurrentLesson,
} from "@/lib/salah-progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Guided Path — A gentle path for new Muslims",
      },
      {
        name: "description",
        content:
          "Daily reminders, guided Salah lessons, prayer times and beginner-friendly Islamic learning.",
      },
      {
        property: "og:title",
        content: "Guided Path — A gentle path for new Muslims",
      },
      {
        property: "og:description",
        content:
          "Daily reminders, guided Salah lessons, prayer times and beginner-friendly Islamic learning.",
      },
    ],
  }),
  component: Home,
});

async function refreshQuranText(reminder: Reminder): Promise<Reminder> {
  if (reminder.type !== "Quran" || !reminder.quranRef) {
    return reminder;
  }

  const { surah, ayah } = reminder.quranRef;

  try {
    const response = await fetch(
      `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/quran-uthmani`,
    );

    if (!response.ok) {
      return reminder;
    }

    const result = await response.json();
    const arabic = result?.data?.text as string | undefined;

    if (!arabic) {
      return reminder;
    }

    return {
      ...reminder,
      arabic,
    };
  } catch {
    return reminder;
  }
}

function DailyReminderCard() {
  const baseReminder = pickTodayReminder();

  const { data } = useQuery({
    queryKey: [
      "daily-reminder",
      Math.floor(Date.now() / (1000 * 60 * 60 * 24)),
      baseReminder.source,
    ],
    queryFn: () => refreshQuranText(baseReminder),
    staleTime: 1000 * 60 * 60 * 6,
    retry: 1,
  });

  const reminder = data ?? baseReminder;

  return (
    <section className="animate-fade-up">
      <div className="space-y-5 rounded-3xl border border-border/70 bg-card p-6 shadow-sm md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            Daily Reminder · ذكر اليوم
          </span>

          <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground">
            {reminder.type}
          </span>
        </div>

        <p
          dir="rtl"
          className="font-arabic text-right text-2xl leading-loose text-foreground md:text-3xl"
        >
          {reminder.arabic}
        </p>

        <blockquote className="text-balance font-serif text-xl italic leading-snug text-foreground md:text-2xl">
          &ldquo;{reminder.english}&rdquo;
        </blockquote>

        <p className="font-serif text-xs italic text-muted-foreground">
          — {reminder.source}
        </p>

        <p className="border-t border-border/70 pt-4 text-sm leading-relaxed text-foreground/85">
          {reminder.explanation}
        </p>

        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Category · {reminder.category}
        </p>
      </div>
    </section>
  );
}

function SalahDashboardCard() {
  const { percent, completedCount, total, nextLesson } = useSalahProgress();
  const { current } = useCurrentLesson();
  const { count: practiceCount } = usePracticeCount();

  const continueSlug = current ?? nextLesson.slug;

  const continueLesson =
    SALAH_LESSONS.find((lesson) => lesson.slug === continueSlug) ?? nextLesson;

  return (
    <section className="space-y-6 rounded-3xl bg-primary p-6 text-primary-foreground shadow-xl shadow-primary/10 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-accent">
            Currently learning
          </p>

          <h2 className="mt-1 font-serif text-2xl italic md:text-3xl">
            The Salah Course
          </h2>

          <p className="mt-2 max-w-sm text-sm text-primary-foreground/70">
            {completedCount} of {total} lessons complete · {practiceCount}{" "}
            practice sessions
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-accent">
            Progress
          </p>

          <p className="font-serif text-4xl italic">{percent}%</p>
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
          <p className="text-[10px] uppercase tracking-widest opacity-70">
            Continue learning
          </p>

          <p className="mt-1 truncate font-serif text-lg italic">
            {continueLesson.titleEn}
          </p>
        </Link>

        <Link
          to="/salah/practice"
          className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 px-5 py-4 text-primary-foreground transition duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground"
        >
          <p className="text-[10px] uppercase tracking-widest text-accent">
            Guided practice
          </p>

          <p className="mt-1 font-serif text-lg italic">
            Walk through a prayer
          </p>
        </Link>
      </div>
    </section>
  );
}

function ProgressCard() {
  const { completedCount, percent } = useSalahProgress();

  return (
    <section className="rounded-3xl border border-border/70 bg-card p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">
          Your Journey
        </h2>

        <span className="font-arabic text-xs text-muted-foreground">
          تقدمك
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="mb-2 flex justify-between text-xs text-muted-foreground">
            <span>Salah course</span>
            <span>{completedCount} lessons</span>
          </div>

          <div
            className="h-1.5 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-label="Your Salah progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">
          Small and steady beats big and rare. Every lesson you finish is a
          seed.
        </p>
      </div>
    </section>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-background pb-20 text-foreground">
      <GuidedPathNav />

      <MosqueHero />

      <main className="mx-auto max-w-5xl space-y-10 px-5 md:px-6">
        <LearningPathGrid />

        <DailyReminderCard />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-medium tracking-tight text-foreground md:text-xl">
                Your Learning Path{" "}
                <span className="font-arabic text-base text-muted-foreground">
                  · مسار التعلم
                </span>
              </h2>

              <Link
                to="/salah"
                className="shrink-0 text-sm font-medium text-accent underline underline-offset-4 transition-colors hover:text-foreground"
              >
                View course
              </Link>
            </div>

            <SalahDashboardCard />
          </div>

          <div className="space-y-6">
            <PrayerTimesCard />
            <ProgressCard />
          </div>
        </div>

        <footer className="space-y-2 border-t border-border/70 pt-10 text-center">
          <p className="font-serif text-lg italic text-muted-foreground">
            &ldquo;The most beloved deeds to Allah are those done consistently,
            even if small.&rdquo;
          </p>

          <p className="text-[11px] uppercase tracking-widest text-muted-foreground/70">
            Ṣaḥīḥ al-Bukhārī 6464
          </p>
        </footer>
      </main>
    </div>
  );
}
