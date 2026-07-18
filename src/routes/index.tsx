import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { NoorNav } from "@/components/NoorNav";
import {
  SALAH_STEPS,
  SAMPLE_PRAYER_TIMES,
  todayFallbackVerse,
} from "@/lib/noor-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Noor — A gentle path for new Muslims" },
      {
        name: "description",
        content:
          "A calm home for daily reminders, prayer learning, and Arabic — designed for beginners and reverts.",
      },
    ],
  }),
  component: Home,
});

type DailyVerse = {
  arabic: string;
  english: string;
  surahEn: string;
  surahAr: string;
  ref: string;
};

async function fetchDailyVerse(): Promise<DailyVerse> {
  // Deterministic ayah per day (1..6236)
  const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const ayahNumber = (day % 6236) + 1;
  const url = `https://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/quran-uthmani,en.asad`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("verse fetch failed");
  const json = await res.json();
  const [ar, en] = json.data ?? [];
  if (!ar?.text || !en?.text) throw new Error("verse malformed");
  return {
    arabic: ar.text,
    english: en.text,
    surahEn: ar.surah?.englishName ?? "",
    surahAr: ar.surah?.name ?? "",
    ref: `${ar.surah?.number ?? ""}:${ar.numberInSurah ?? ""}`,
  };
}

function DailyReminder() {
  const fallback = todayFallbackVerse();
  const { data } = useQuery({
    queryKey: ["daily-verse", Math.floor(Date.now() / (1000 * 60 * 60 * 24))],
    queryFn: fetchDailyVerse,
    staleTime: 1000 * 60 * 60 * 6,
    retry: 1,
  });
  const verse = data ?? fallback;

  return (
    <section className="animate-fade-up">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-sand-200/60 flex flex-col md:flex-row gap-10 items-center">
        <div className="flex-1 space-y-6 min-w-0">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold-600">
            Daily Reminder · ذكر اليوم
          </span>
          <div className="space-y-5">
            <p
              dir="rtl"
              className="font-arabic text-3xl md:text-4xl text-right leading-loose text-moss-800"
            >
              {verse.arabic}
            </p>
            <blockquote className="font-serif text-2xl md:text-3xl italic leading-snug text-moss-800 text-balance">
              &ldquo;{verse.english}&rdquo;
            </blockquote>
          </div>
          <div className="flex items-center gap-3 text-moss-600/80 flex-wrap">
            <span className="font-serif italic text-lg">
              — Surah {verse.surahEn} {verse.ref}
            </span>
            {verse.surahAr && (
              <span className="text-sm border-l border-sand-200 pl-3 font-arabic text-moss-600">
                {verse.surahAr}
              </span>
            )}
          </div>
        </div>

        {/* Decorative arch — pure CSS, no image dependency */}
        <div
          aria-hidden
          className="w-full md:w-64 shrink-0"
        >
          <div className="relative aspect-square rounded-t-full rounded-b-2xl bg-gradient-to-b from-moss-600 to-moss-800 overflow-hidden shadow-lg shadow-moss-800/20">
            <div
              className="absolute inset-3 rounded-t-full rounded-b-xl border border-gold-400/40"
              style={{
                backgroundImage:
                  "radial-gradient(circle at center, rgba(220,191,138,0.25) 0.5px, transparent 0.5px)",
                backgroundSize: "18px 18px",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="font-arabic text-gold-400 text-6xl"
                aria-hidden
              >
                ﷲ
              </span>
            </div>
            <div className="absolute bottom-4 inset-x-0 text-center">
              <span className="text-[10px] uppercase tracking-[0.25em] text-stone-50/60">
                Al-Karīm
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SalahModule() {
  const current = SALAH_STEPS.find((s) => s.status === "current") ?? SALAH_STEPS[1];

  return (
    <div className="bg-moss-800 text-stone-50 rounded-3xl p-1 overflow-hidden shadow-xl shadow-moss-800/10">
      <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gold-500 text-xs font-medium uppercase tracking-widest">
              Currently Learning
            </span>
            <span className="text-gold-500/60 text-xs font-arabic">جارٍ التعلم</span>
          </div>
          <h4 className="text-3xl font-serif italic text-balance">
            The Steps of Salah <span className="font-arabic not-italic text-2xl">· خطوات الصلاة</span>
          </h4>
          <p className="text-stone-50/60 mt-2 text-sm max-w-sm">
            Mastering the physical movements and the spiritual presence of prayer.
          </p>
        </div>
        <Link
          to="/salah"
          hash={current.slug}
          className="bg-stone-50 text-moss-800 px-6 py-3 rounded-full font-medium text-sm hover:bg-gold-600 hover:text-white transition-colors whitespace-nowrap"
        >
          Continue Step {current.index}: {current.titleEn}
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-white/10">
        {SALAH_STEPS.map((step) => {
          const isCurrent = step.status === "current";
          const isDone = step.status === "completed";
          return (
            <Link
              key={step.slug}
              to="/salah"
              hash={step.slug}
              className={[
                "p-5 md:p-6 flex flex-col gap-2 transition-colors",
                isCurrent
                  ? "bg-moss-600 ring-1 ring-gold-500/40 ring-inset"
                  : "bg-moss-800 hover:bg-moss-600/60",
                !isCurrent && !isDone ? "opacity-70" : "",
              ].join(" ")}
            >
              <div
                className={[
                  "text-[10px] uppercase font-bold tracking-tighter",
                  isCurrent
                    ? "text-gold-500"
                    : isDone
                      ? "text-stone-50/50"
                      : "text-stone-50/30",
                ].join(" ")}
              >
                {String(step.index).padStart(2, "0")}{" "}
                {isDone ? "Completed" : isCurrent ? "In Progress" : "Locked"}
              </div>
              <div className="font-serif text-lg italic">{step.titleEn}</div>
              <div
                className={[
                  "font-arabic text-sm",
                  isCurrent ? "text-gold-500" : "opacity-50",
                ].join(" ")}
              >
                {step.titleAr}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function WuduPeek() {
  const step = SALAH_STEPS.find((s) => s.slug === "wudu")!;
  return (
    <div className="bg-white border border-sand-200/60 rounded-3xl p-6 md:p-8 space-y-8">
      <div className="border-b border-stone-100 pb-6 flex justify-between items-end gap-4 flex-wrap">
        <div>
          <h5 className="text-xs font-semibold uppercase tracking-widest text-gold-600">
            Practice Reference · مرجع الممارسة
          </h5>
          <p className="mt-2 text-moss-600">
            Wash your hands three times up to the wrists.
          </p>
        </div>
        <div className="text-xs text-stone-400 font-serif italic">
          Step {step.index} of {SALAH_STEPS.length}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 md:gap-12">
        <div className="space-y-4">
          <div className="flex justify-between items-end gap-4 border-b border-stone-100 pb-2">
            <span className="text-xs text-stone-400 uppercase tracking-wider">
              Arabic · العربية
            </span>
            <span dir="rtl" className="text-3xl font-arabic text-moss-800 leading-none">
              {step.keyPhrase?.arabic}
            </span>
          </div>
          <div className="flex justify-between items-end gap-4 border-b border-stone-100 pb-2">
            <span className="text-xs text-stone-400 uppercase tracking-wider">
              Transliteration
            </span>
            <span className="text-lg font-serif italic text-moss-600">
              {step.keyPhrase?.transliteration}
            </span>
          </div>
          <div className="flex justify-between items-end gap-4 border-b border-stone-100 pb-2">
            <span className="text-xs text-stone-400 uppercase tracking-wider">
              Translation
            </span>
            <span className="text-lg text-moss-800">
              {step.keyPhrase?.translation}
            </span>
          </div>
          <button
            type="button"
            className="mt-4 flex items-center gap-3 px-4 py-2 rounded-full bg-stone-100 hover:bg-sand-200/70 text-moss-800 text-xs font-semibold uppercase tracking-widest transition-colors"
          >
            <span className="size-2 rounded-full bg-gold-600" />
            Listen to pronunciation
          </button>
        </div>

        {/* Instructional illustration — CSS composition (no image) */}
        <div
          aria-hidden
          className="w-full aspect-[4/3] rounded-xl bg-stone-50 border border-sand-200/60 grid place-items-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent 0 12px, rgba(181,141,76,0.05) 12px 13px)",
          }}/>
          <div className="relative flex flex-col items-center gap-3 text-moss-600">
            <div className="flex gap-2">
              <div className="size-14 rounded-full border-2 border-moss-600/40" />
              <div className="size-14 rounded-full border-2 border-moss-600/40 -ml-6 bg-moss-600/5" />
            </div>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-moss-600/60">
              Hands · washing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrayerTimesCard() {
  return (
    <div className="bg-sand-200/40 rounded-3xl p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-moss-800">
          Prayer Times
        </h3>
        <span className="text-[10px] font-arabic text-moss-600">مواقيت الصلاة</span>
      </div>
      <div className="space-y-3">
        {SAMPLE_PRAYER_TIMES.map((p) => {
          const isCurrent = p.state === "current";
          return (
            <div
              key={p.name}
              className={[
                "flex justify-between items-center rounded-xl px-4 py-3 transition-colors",
                isCurrent
                  ? "bg-white shadow-sm ring-1 ring-moss-800/5"
                  : p.state === "past"
                    ? "opacity-50"
                    : "",
              ].join(" ")}
            >
              <div className="flex flex-col">
                <span
                  className={[
                    "text-sm",
                    isCurrent ? "font-semibold text-moss-800" : "text-moss-800",
                  ].join(" ")}
                >
                  {p.name}
                </span>
                <span
                  className={[
                    "text-[10px] font-arabic",
                    isCurrent ? "text-gold-600" : "text-moss-600/70",
                  ].join(" ")}
                >
                  {p.ar}
                </span>
              </div>
              <span
                className={[
                  "text-sm",
                  isCurrent ? "font-bold text-gold-600" : "text-moss-600",
                ].join(" ")}
              >
                {p.time}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-[11px] text-moss-600/60 leading-relaxed">
        Sample times. We&rsquo;ll use your location to show real prayer times soon.
      </p>
    </div>
  );
}

function ProgressCard() {
  return (
    <div className="bg-white border border-sand-200/60 rounded-3xl p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-moss-800">
          This Week
        </h3>
        <span className="text-[10px] font-arabic text-moss-600">تقدمك</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => {
          const filled = i < 4;
          const partial = i === 4;
          return (
            <div key={d} className="flex flex-col items-center gap-1">
              <div
                className={[
                  "size-8 rounded-lg",
                  filled
                    ? "bg-moss-600"
                    : partial
                      ? "bg-moss-600/30"
                      : "bg-stone-100",
                ].join(" ")}
              />
              <span className="text-[9px] uppercase tracking-wider text-moss-600/60">
                {d[0]}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-moss-600/70 leading-relaxed">
        You&rsquo;ve practiced 4 times this week. Consistency is the key to presence.
        <span className="font-arabic mt-1 block text-moss-600">
          لقد مارست ٤ مرات هذا الأسبوع.
        </span>
      </p>
    </div>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-stone-50 text-moss-800 pb-20">
      <NoorNav />

      <main className="max-w-5xl mx-auto px-6 space-y-12">
        <DailyReminder />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium tracking-tight text-moss-800">
                Your Learning Path{" "}
                <span className="font-arabic text-moss-600 text-lg">
                  · مسار التعلم
                </span>
              </h3>
              <Link
                to="/salah"
                className="text-sm font-medium text-gold-600 underline underline-offset-4 hover:text-moss-800 transition-colors"
              >
                View syllabus
              </Link>
            </div>

            <SalahModule />
            <WuduPeek />
          </div>

          <div className="space-y-8">
            <PrayerTimesCard />
            <ProgressCard />
          </div>
        </div>

        <footer className="pt-10 border-t border-sand-200/60 text-center space-y-2">
          <p className="font-serif italic text-moss-600 text-lg">
            &ldquo;The best of you are those who learn the Quran and teach it.&rdquo;
          </p>
          <p className="text-[11px] uppercase tracking-widest text-moss-600/60">
            Ṣaḥīḥ al-Bukhārī 5027
          </p>
        </footer>
      </main>
    </div>
  );
}
