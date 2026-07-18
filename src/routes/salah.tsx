import { createFileRoute } from "@tanstack/react-router";
import { NoorNav } from "@/components/NoorNav";
import { SALAH_STEPS } from "@/lib/noor-data";

export const Route = createFileRoute("/salah")({
  head: () => ({
    meta: [
      { title: "The Steps of Salah — Noor" },
      {
        name: "description",
        content:
          "Learn how to pray, step by step: intention, wudu, prayer times, movements and recitation. Arabic with transliteration and translation.",
      },
      { property: "og:title", content: "The Steps of Salah — Noor" },
      {
        property: "og:description",
        content:
          "A gentle, structured guide to prayer for new Muslims — intention, wudu, and beyond.",
      },
    ],
  }),
  component: SalahPath,
});

function StepCard({ step }: { step: (typeof SALAH_STEPS)[number] }) {
  const isCurrent = step.status === "current";
  const isDone = step.status === "completed";
  const isLocked = step.status === "locked";

  return (
    <article
      id={step.slug}
      className={[
        "scroll-mt-28 rounded-3xl border p-6 md:p-10 transition-colors",
        isCurrent
          ? "bg-white border-gold-500/50 shadow-sm shadow-gold-600/10"
          : "bg-white border-sand-200/60",
      ].join(" ")}
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-100">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span
              className={[
                "size-9 rounded-full flex items-center justify-center text-xs font-semibold",
                isDone
                  ? "bg-moss-600 text-stone-50"
                  : isCurrent
                    ? "bg-gold-600 text-stone-50"
                    : "bg-stone-100 text-moss-600/60",
              ].join(" ")}
            >
              {String(step.index).padStart(2, "0")}
            </span>
            <span
              className={[
                "text-[10px] uppercase tracking-widest font-semibold",
                isCurrent
                  ? "text-gold-600"
                  : isDone
                    ? "text-moss-600"
                    : "text-moss-600/50",
              ].join(" ")}
            >
              {isDone ? "Completed" : isCurrent ? "In Progress" : "Coming soon"}
            </span>
          </div>
          <h2 className="font-serif italic text-3xl md:text-4xl text-moss-800">
            {step.titleEn}
          </h2>
          <p className="text-sm text-moss-600 max-w-md text-pretty">{step.summary}</p>
        </div>

        <div className="text-right space-y-1">
          <div dir="rtl" className="font-arabic text-4xl text-moss-800">
            {step.titleAr}
          </div>
          <div className="text-xs font-serif italic text-moss-600/70">
            {step.transliteration}
          </div>
        </div>
      </header>

      {isCurrent && (
        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 h-1 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold-600 rounded-full transition-all"
              style={{ width: `${step.progress}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-gold-600">
            {step.progress}%
          </span>
        </div>
      )}

      <div className="mt-8 grid md:grid-cols-2 gap-8">
        <ol className="space-y-6">
          {step.lessons.map((l, i) => (
            <li key={l.heading} className="flex gap-4">
              <span
                className={[
                  "shrink-0 size-8 rounded-full grid place-items-center text-xs font-serif italic",
                  isLocked
                    ? "bg-stone-100 text-moss-600/40"
                    : "bg-sand-200/60 text-moss-800",
                ].join(" ")}
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-moss-800 uppercase tracking-wider">
                  {l.heading}
                </h3>
                <p className="mt-1 text-sm text-moss-600 leading-relaxed text-pretty">
                  {l.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {step.keyPhrase ? (
          <div className="bg-stone-50 border border-sand-200/60 rounded-2xl p-6 flex flex-col justify-center text-center gap-4">
            <span className="text-[10px] uppercase tracking-widest text-gold-600">
              Key Phrase
            </span>
            <span
              dir="rtl"
              className="font-arabic text-4xl md:text-5xl text-moss-800 leading-tight"
            >
              {step.keyPhrase.arabic}
            </span>
            <span className="font-serif italic text-lg text-moss-600">
              {step.keyPhrase.transliteration}
            </span>
            <span className="text-sm text-moss-800">
              {step.keyPhrase.translation}
            </span>
            <button
              type="button"
              className="mx-auto mt-2 flex items-center gap-3 px-5 py-2 rounded-full bg-moss-800 text-stone-50 hover:bg-moss-600 transition-colors text-xs font-semibold uppercase tracking-widest"
            >
              <span className="size-2 rounded-full bg-gold-500" />
              Listen
            </button>
          </div>
        ) : (
          <div className="bg-stone-50 border border-dashed border-sand-300/60 rounded-2xl p-6 grid place-items-center text-center text-moss-600/60">
            <div className="space-y-2">
              <div className="font-arabic text-3xl text-moss-600/50">﷽</div>
              <p className="text-xs uppercase tracking-widest">
                Detailed lessons coming soon
              </p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function SalahPath() {
  return (
    <div className="min-h-screen bg-stone-50 text-moss-800 pb-24">
      <NoorNav />

      <main className="max-w-4xl mx-auto px-6 space-y-12">
        {/* Hero */}
        <section className="text-center space-y-4 pt-4 animate-fade-up">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">
            Learning Path · مسار
          </span>
          <h1 className="font-serif italic text-4xl md:text-6xl text-moss-800 text-balance">
            The Steps of Salah
          </h1>
          <p
            dir="rtl"
            className="font-arabic text-2xl md:text-3xl text-moss-600"
          >
            خطوات الصلاة
          </p>
          <p className="max-w-xl mx-auto text-moss-600 text-pretty leading-relaxed">
            A gentle, step-by-step introduction to prayer — from the quiet
            intention in the heart to the words spoken in each rak&rsquo;ah.
          </p>
        </section>

        {/* Stepper overview */}
        <nav
          aria-label="Salah steps"
          className="flex overflow-x-auto no-scrollbar gap-3 pb-2 -mx-6 px-6"
        >
          {SALAH_STEPS.map((s) => (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              className={[
                "shrink-0 min-w-[9rem] rounded-2xl border px-4 py-3 text-sm transition-colors",
                s.status === "current"
                  ? "bg-moss-800 text-stone-50 border-moss-800"
                  : s.status === "completed"
                    ? "bg-white text-moss-800 border-sand-200"
                    : "bg-stone-50 text-moss-600/60 border-sand-200/60",
              ].join(" ")}
            >
              <div className="text-[10px] uppercase tracking-widest opacity-70">
                Step {s.index}
              </div>
              <div className="font-serif italic text-lg leading-tight">
                {s.titleEn}
              </div>
              <div
                className={[
                  "font-arabic text-sm",
                  s.status === "current"
                    ? "text-gold-500"
                    : "text-moss-600/70",
                ].join(" ")}
              >
                {s.titleAr}
              </div>
            </a>
          ))}
        </nav>

        <div className="space-y-8">
          {SALAH_STEPS.map((s) => (
            <StepCard key={s.slug} step={s} />
          ))}
        </div>
      </main>
    </div>
  );
}
