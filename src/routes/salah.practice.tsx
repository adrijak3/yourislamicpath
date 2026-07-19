import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { GuidedPathNav } from "@/components/GuidedPathNav";
import { AudioPlayer } from "@/components/AudioPlayer";
import {
  PRAYERS,
  buildSequence,
  type PrayerId,
} from "@/lib/salah-practice";
import {
  useDisplayPrefs,
  usePracticeCount,
  useSelectedPrayer,
} from "@/lib/salah-progress";

export const Route = createFileRoute("/salah/practice")({
  head: () => ({
    meta: [
      { title: "Guided Prayer Practice — Guided Path" },
      {
        name: "description",
        content:
          "Walk through any of the five daily prayers, one step at a time — with Arabic, transliteration, translation, and audio.",
      },
      { property: "og:title", content: "Guided Prayer Practice — Guided Path" },
      {
        property: "og:description",
        content:
          "A calm, step-by-step practice mode for Fajr, Dhuhr, Asr, Maghrib, and Isha.",
      },
    ],
  }),
  component: Practice,
});

function Practice() {
  const { prayer, setPrayer } = useSelectedPrayer();
  const selectedId = (prayer as PrayerId | null) ?? null;
  const selected = selectedId
    ? PRAYERS.find((p) => p.id === selectedId) ?? null
    : null;

  return (
    <div className="min-h-screen bg-stone-50 text-moss-800 pb-32">
      <GuidedPathNav />

      <main className="max-w-2xl mx-auto px-5 md:px-6 space-y-8">
        <div className="flex items-center justify-between text-xs text-moss-600/70">
          <Link to="/salah" className="hover:text-gold-600 transition-colors">
            ← Course
          </Link>
          <span>Guided practice</span>
        </div>

        {!selected ? (
          <PrayerPicker onSelect={(id) => setPrayer(id)} />
        ) : (
          <PracticeSession
            prayerId={selected.id}
            onExit={() => setPrayer(null)}
          />
        )}
      </main>
    </div>
  );
}

function PrayerPicker({ onSelect }: { onSelect: (id: PrayerId) => void }) {
  return (
    <section className="space-y-6 animate-fade-up">
      <header className="text-center space-y-3">
        <span className="text-[10px] uppercase tracking-[0.25em] text-gold-600 font-semibold">
          Choose a prayer
        </span>
        <h1 className="font-serif italic text-3xl md:text-4xl text-moss-800">
          Which prayer will you practise?
        </h1>
        <p className="text-moss-600 max-w-md mx-auto text-pretty">
          Practising outside the actual prayer time is a gentle way to build
          confidence.
        </p>
      </header>
      <div className="grid sm:grid-cols-2 gap-3">
        {PRAYERS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p.id)}
            className="text-left bg-white border border-sand-200/60 hover:border-gold-500 rounded-2xl p-5 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-serif italic text-2xl text-moss-800">
                  {p.nameEn}
                </div>
                <div dir="rtl" className="font-arabic text-lg text-moss-600">
                  {p.nameAr}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-widest text-gold-600">
                  Rak‘ahs
                </div>
                <div className="font-serif italic text-2xl text-moss-800">
                  {p.rakahs}
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-moss-600/80">{p.timeHint}</div>
          </button>
        ))}
      </div>
    </section>
  );
}

function PracticeSession({
  prayerId,
  onExit,
}: {
  prayerId: PrayerId;
  onExit: () => void;
}) {
  const prayer = PRAYERS.find((p) => p.id === prayerId)!;
  const {
    showTransliteration,
    setShowTransliteration,
    showTranslation,
    setShowTranslation,
    showDetail,
    setShowDetail,
    guidance,
    setGuidance,
  } = useDisplayPrefs();
  const { increment } = usePracticeCount();
  const [countedThisSession, setCountedThisSession] = useState(false);

  const sequence = useMemo(() => buildSequence(prayerId), [prayerId]);

  // Filter steps by gender guidance (some steps are gender-only)
  const flat = useMemo(() => {
    const list: Array<{ rakah: number; stepIndex: number }> = [];
    sequence.forEach((r, ri) => {
      r.steps.forEach((s, si) => {
        if (s.genderOnly && guidance !== "both" && s.genderOnly !== guidance)
          return;
        list.push({ rakah: r.rakah, stepIndex: si });
        void ri;
      });
    });
    return list;
  }, [sequence, guidance]);

  const [pos, setPos] = useState(0);
  const clamped = Math.min(pos, flat.length - 1);
  const currentRef = flat[clamped];
  const currentStep =
    sequence[currentRef.rakah - 1].steps[currentRef.stepIndex];
  const progress = ((clamped + 1) / flat.length) * 100;

  const goPrev = () => setPos((p) => Math.max(0, p - 1));
  const goNext = () => {
    if (clamped >= flat.length - 1) {
      if (!countedThisSession) {
        increment();
        setCountedThisSession(true);
      }
      return;
    }
    setPos((p) => p + 1);
  };

  const isLast = clamped >= flat.length - 1;

  return (
    <section className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-gold-600 font-semibold">
            {prayer.nameEn} · {prayer.rakahs} rak‘ahs
          </div>
          <div dir="rtl" className="font-arabic text-lg text-moss-600">
            {prayer.nameAr}
          </div>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="text-xs font-semibold uppercase tracking-widest text-moss-600 hover:text-gold-600"
        >
          Change prayer
        </button>
      </div>

      {/* Rakah pill + progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-moss-600/80">
          <span>
            Rak‘ah {currentRef.rakah} of {prayer.rakahs}
          </span>
          <span>
            Step {clamped + 1} of {flat.length}
          </span>
        </div>
        <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Prefs */}
      <div className="flex flex-wrap gap-2">
        <TogglePill
          active={showTransliteration}
          label="Transliteration"
          onClick={() => setShowTransliteration((v) => !v)}
        />
        <TogglePill
          active={showTranslation}
          label="Translation"
          onClick={() => setShowTranslation((v) => !v)}
        />
        <TogglePill
          active={showDetail}
          label="Explain more"
          onClick={() => setShowDetail((v) => !v)}
        />
        <div className="ml-auto flex gap-1 bg-stone-100 rounded-full p-1">
          {(["male", "female", "both"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGuidance(g)}
              className={[
                "px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold transition-colors",
                guidance === g
                  ? "bg-moss-800 text-stone-50"
                  : "text-moss-600 hover:text-moss-800",
              ].join(" ")}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Step card */}
      <article className="bg-white border border-sand-200/60 rounded-3xl p-6 md:p-8 space-y-5">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-gold-600 font-semibold">
            Movement
          </div>
          <h2 className="font-serif italic text-3xl md:text-4xl text-moss-800 mt-1">
            {currentStep.movement}
          </h2>
        </div>
        <p className="text-moss-800/90 leading-relaxed text-[16px] text-pretty">
          {currentStep.instruction}
        </p>

        {currentStep.arabic && (
          <div className="rounded-2xl bg-stone-50 border border-sand-200/70 p-5 text-center space-y-2">
            <p
              dir="rtl"
              className="font-arabic text-3xl md:text-4xl text-moss-800 leading-loose"
            >
              {currentStep.arabic}
            </p>
            {showTransliteration && currentStep.transliteration && (
              <p className="font-serif italic text-lg text-moss-600">
                {currentStep.transliteration}
              </p>
            )}
            {showTranslation && currentStep.translation && (
              <p className="text-sm text-moss-800/90">
                {currentStep.translation}
              </p>
            )}
          </div>
        )}

        <AudioPlayer label={currentStep.audioLabel ?? "Listen"} />

        {showDetail && currentStep.detail && (
          <p className="text-sm text-moss-600 italic border-l-2 border-gold-500/60 pl-3 leading-relaxed">
            {currentStep.detail}
          </p>
        )}

        {currentStep.genderNote && guidance !== "both" && (
          <p className="text-sm text-moss-800 bg-stone-50 border border-sand-200/70 rounded-xl p-4">
            <span className="text-[10px] uppercase tracking-widest text-gold-600 font-semibold mr-2">
              {guidance}
            </span>
            {currentStep.genderNote[guidance as "male" | "female"]}
          </p>
        )}
        {currentStep.genderNote && guidance === "both" && (
          <div className="grid sm:grid-cols-2 gap-3">
            {(["male", "female"] as const).map((g) => (
              <p
                key={g}
                className="text-sm text-moss-800 bg-stone-50 border border-sand-200/70 rounded-xl p-4"
              >
                <span className="text-[10px] uppercase tracking-widest text-gold-600 font-semibold mr-2">
                  {g}
                </span>
                {currentStep.genderNote?.[g]}
              </p>
            ))}
          </div>
        )}

        {currentStep.scholarlyNote && (
          <p className="text-xs text-moss-600/80 italic border-l-2 border-gold-500/60 pl-3 leading-relaxed">
            {currentStep.scholarlyNote}
          </p>
        )}
      </article>

      {isLast && countedThisSession && (
        <div className="text-center rounded-2xl bg-moss-800 text-stone-50 p-6 space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-gold-500">
            Alḥamdulillāh
          </div>
          <div className="font-serif italic text-2xl">
            You completed a full practice.
          </div>
          <p className="text-stone-50/80 text-sm">
            May Allah accept every step.
          </p>
          <button
            type="button"
            onClick={() => {
              setPos(0);
              setCountedThisSession(false);
            }}
            className="mt-3 inline-block px-5 py-2 rounded-full bg-stone-50 text-moss-800 text-xs uppercase tracking-widest font-semibold"
          >
            Practise again
          </button>
        </div>
      )}

      {/* Sticky controls */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-stone-50/95 backdrop-blur border-t border-sand-200/70">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={clamped === 0}
            className="shrink-0 size-11 grid place-items-center rounded-full bg-white border border-sand-200 text-moss-800 disabled:opacity-30"
            aria-label="Previous step"
          >
            ←
          </button>
          <div className="flex-1 text-center text-[11px] uppercase tracking-widest text-moss-600/70">
            {currentStep.movement}
          </div>
          <button
            type="button"
            onClick={goNext}
            className={[
              "shrink-0 rounded-full px-5 h-11 text-sm font-semibold transition-colors",
              isLast
                ? "bg-gold-600 text-stone-50"
                : "bg-moss-800 text-stone-50 hover:bg-gold-600",
            ].join(" ")}
          >
            {isLast ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </section>
  );
}

function TogglePill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "px-3 py-1.5 rounded-full text-[11px] uppercase tracking-widest font-semibold transition-colors border",
        active
          ? "bg-moss-800 text-stone-50 border-moss-800"
          : "bg-white text-moss-600 border-sand-200 hover:border-gold-500",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
