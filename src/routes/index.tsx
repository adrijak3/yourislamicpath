import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { NoorNav } from "@/components/NoorNav";
import { PrayerTimesCard } from "@/components/PrayerTimesCard";
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
      { title: "Noor — A gentle path for new Muslims" },
      {
        name: "description",
        content:
          "Daily reminders, guided Salah lessons, and prayer times — a calm home for beginners and reverts.",
      },
      { property: "og:title", content: "Noor — A gentle path for new Muslims" },
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
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-sand-200/60 space-y-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-600">
            Daily Reminder · ذكر اليوم
          </span>
          <span className="text-[10px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-moss-800 text-stone-50">
            {reminder.type}
          </span>
        </div>

        <p
          dir="rtl"
          className="font-arabic text-2xl md:text-3xl text-right leading-loose text-moss-800"
        >
          {reminder.arabic}
        </p>
        <blockquote className="font-serif text-xl md:text-2xl italic leading-snug text-moss-800 text-balance">
          &ldquo;{reminder.english}&rdquo;
        </blockquote>
        <div className="text-xs text-moss-600/80 font-serif italic">
          — {reminder.source}
        </div>
        <p className="text-sm text-moss-800/90 leading-relaxed border-t border-sand-200/60 pt-4 text-pretty">
          {reminder.explanation}
        </p>
        <div className="text-[10px] uppercase tracking-widest text-moss-600/60">
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
    <div className="bg-moss-800 text-stone-50 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl shadow-moss-800/10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-gold-500 font-semibold">
            Currently Learning
          </div>
          <h4 className="text-2xl md:text-3xl font-serif italic mt-1">
            The Salah Course
          </h4>
          <p className="text-stone-50/60 mt-1 text-sm max-w-sm">
            {completedCount} of {total} lessons complete · {practiceCount}{" "}
            practice sessions
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest text-gold-500">
            Progress
          </div>
          <div className="font-serif italic text-4xl">{percent}%</div>
        </div>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gold-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Link
          to="/salah/$slug"
          params={{ slug: continueLesson.slug }}
          className="bg-stone-50 text-moss-800 rounded-2xl px-5 py-4 hover:bg-gold-500 hover:text-stone-50 transition-colors"
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
          className="bg-moss-600 text-stone-50 rounded-2xl px-5 py-4 hover:bg-gold-500 transition-colors"
        >
          <div className="text-[10px] uppercase tracking-widest text-gold-500">
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
    <div className="bg-white border border-sand-200/60 rounded-3xl p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-moss-800">
          Your Journey
        </h3>
        <span className="text-[10px] font-arabic text-moss-600">تقدمك</span>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs text-moss-600 mb-1">
            <span>Salah course</span>
            <span>{completedCount} lessons</span>
          </div>
          <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-moss-600 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <p className="text-xs text-moss-600/80 leading-relaxed">
          Small and steady beats big and rare. Every lesson you finish is a
          seed.
        </p>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-stone-50 text-moss-800 pb-20">
      <NoorNav />

      <main className="max-w-5xl mx-auto px-5 md:px-6 space-y-10">
        <DailyReminderCard />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg md:text-xl font-medium tracking-tight text-moss-800">
                Your Learning Path{" "}
                <span className="font-arabic text-moss-600 text-base">
                  · مسار التعلم
                </span>
              </h3>
              <Link
                to="/salah"
                className="text-sm font-medium text-gold-600 underline underline-offset-4 hover:text-moss-800 transition-colors"
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

        <footer className="pt-10 border-t border-sand-200/60 text-center space-y-2">
          <p className="font-serif italic text-moss-600 text-lg">
            &ldquo;The most beloved deeds to Allah are those done consistently,
            even if small.&rdquo;
          </p>
          <p className="text-[11px] uppercase tracking-widest text-moss-600/60">
            Ṣaḥīḥ al-Bukhārī 6464
          </p>
        </footer>
      </main>
    </div>
  );
}
