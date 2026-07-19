import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { GuidedPathNav } from "@/components/GuidedPathNav";
import { PrayerTimesCard } from "@/components/PrayerTimesCard";
import { SALAH_LESSONS } from "@/lib/salah-course";
import { pickTodayReminder, type Reminder } from "@/lib/daily-reminders";
import { MosqueHero } from "@/components/MosqueHero";
import { LearningPathGrid } from "@/components/LearningPathGrid";
import {
  usePracticeCount,
  useSalahProgress,
  useCurrentLesson,
} from "@/lib/salah-progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Guided Path — A gentle path for new Muslims" },
      {
        name: "description",
        content:
          "Daily reminders, guided Salah lessons, and prayer times — a calm home for beginners and reverts.",
      },
      { property: "og:title", content: "Guided Path — A gentle path for new Muslims" },
      {
        property: "og:description",
        content:
          "Daily reminders, guided Salah lessons, and prayer times — a calm home for beginners and reverts.",
      },
    ],
  }),
  component: Home,
});

// For Quran-type reminders, use Aladhan-companion Quran API to validate/refresh
// the verse text. If it fails, we keep the curated text.
async function refreshQuranText(reminder: Reminder): Promise<Reminder> {
  if (reminder.type !== "Quran" || !reminder.quranRef) return reminder;
  const { surah, ayah } = reminder.quranRef;
  try {
    const res = await fetch(
      `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/quran-uthmani`,
    );
    if (!res.ok) return reminder;
    const json = await res.json();
    const arabic = json?.data?.text as string | undefined;
    if (!arabic) return reminder;
    return { ...reminder, arabic };
  } catch {
    return reminder;
  }
}

function DailyReminderCard() {
  const base = pickTodayReminder();
  const { data } = useQuery({
    queryKey: [
      "daily-reminder",
      Math.floor(Date.now() / (1000 * 60 * 60 * 24)),
      base.source,
    ],
    queryFn: () => refreshQuranText(base),
    staleTime: 1000 * 60 * 60 * 6,
    retry: 1,
  });
  const reminder = data ?? base;

  return (
    <section className="animate-fade-up">
      <div className="bg-card rounded-3xl p-6 md:p-10 shadow-sm border border-border/60 space-y-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            Daily Reminder · ذكر اليوم
          </span>
          <span className="text-[10px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-primary text-primary-foreground">
            {reminder.type}
          </span>
        </div>

        <p
          dir="rtl"
          className="font-arabic text-2xl md:text-3xl text-right leading-loose text-foreground"
        >
          {reminder.arabic}
        </p>
        <blockquote className="font-serif text-xl md:text-2xl italic leading-snug text-foreground text-balance">
          &ldquo;{reminder.english}&rdquo;
        </blockquote>
        <div className="text-xs text-muted-foreground/80 font-serif italic">
          — {reminder.source}
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed border-t border-border/60 pt-4 text-pretty">
          {reminder.explanation}
        </p>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
          Category · {reminder.category}
        </div>
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
    SALAH_LESSONS.find((l) => l.slug === continueSlug) ?? nextLesson;

  return (
    <div className="bg-primary text-primary-foreground rounded-3xl p-6 md:p-8 space-y-6 shadow-xl shadow-primary/10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-accent font-semibold">
            Currently Learning
          </div>
          <h4 className="text-2xl md:text-3xl font-serif italic mt-1">
            The Salah Course
          </h4>
          <p className="text-primary-foreground/60 mt-1 text-sm max-w-sm">
            {completedCount} of {total} lessons complete · {practiceCount}{" "}
            practice sessions
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest text-accent">
            Progress
          </div>
          <div className="font-serif italic text-4xl">{percent}%</div>
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
          params={{ slug: continueLesson.slug }}
          className="bg-background text-foreground rounded-2xl px-5 py-4 hover:bg-accent hover:text-primary-foreground transition-colors"
        >
          <div className="text-[10px] uppercase tracking-widest opacity-70">
            Continue learning
          </div>
          <div className="font-serif italic text-lg mt-1 truncate">
            {continueLesson.titleEn}
          </div>
        </Link>
        <Link
          to="/salah/practice"
          className="bg-primary/85 text-primary-foreground rounded-2xl px-5 py-4 hover:bg-accent transition-colors"
        >
          <div className="text-[10px] uppercase tracking-widest text-accent">
            Guided practice
          </div>
          <div className="font-serif italic text-lg mt-1">
            Walk through a prayer
          </div>
        </Link>
      </div>
    </div>
  );
}

function ProgressCard() {
  const { completedCount, percent } = useSalahProgress();
  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
          Your Journey
        </h3>
        <span className="text-[10px] font-arabic text-muted-foreground">تقدمك</span>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Salah course</span>
            <span>{completedCount} lessons</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary/85 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground/80 leading-relaxed">
          Small and steady beats big and rare. Every lesson you finish is a
          seed.
        </p>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <GuidedPathNav />
      <MosqueHero />

      <main className="max-w-5xl mx-auto px-5 md:px-6 space-y-10">
        <LearningPathGrid />
        <DailyReminderCard />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg md:text-xl font-medium tracking-tight text-foreground">
                Your Learning Path{" "}
                <span className="font-arabic text-muted-foreground text-base">
                  · مسار التعلم
                </span>
              </h3>
              <Link
                to="/salah"
                className="text-sm font-medium text-accent underline underline-offset-4 hover:text-foreground transition-colors"
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

        <footer className="pt-10 border-t border-border/60 text-center space-y-2">
          <p className="font-serif italic text-muted-foreground text-lg">
            &ldquo;The most beloved deeds to Allah are those done consistently,
            even if small.&rdquo;
          </p>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60">
            Ṣaḥīḥ al-Bukhārī 6464
          </p>
        </footer>
      </main>
    </div>
  );
}
