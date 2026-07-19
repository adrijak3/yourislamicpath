import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AudioPlayer } from "@/components/AudioPlayer";
import { GuidedPathNav } from "@/components/GuidedPathNav";
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
      {
        title: "Guided Prayer Practice — Guided Path",
      },
      {
        name: "description",
        content:
          "Walk through the five daily prayers one step at a time with movement guidance, Arabic, transliteration and translation.",
      },
      {
        property: "og:title",
        content: "Guided Prayer Practice — Guided Path",
      },
      {
        property: "og:description",
        content:
          "A calm, beginner-friendly practice mode for Fajr, Dhuhr, Asr, Maghrib and Isha.",
      },
    ],
  }),
  component: Practice,
});

function Practice() {
  const { prayer, setPrayer } = useSelectedPrayer();

  const selectedId = PRAYERS.some((item) => item.id === prayer)
    ? (prayer as PrayerId)
    : null;

  return (
    <div className="min-h-screen bg-background pb-32 text-foreground">
      <GuidedPathNav />

      <main className="mx-auto max-w-2xl space-y-8 px-5 md:px-6">
        <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <Link
            to="/salah"
            className="transition-colors hover:text-accent"
          >
            ← Course
          </Link>

          <span>Guided practice</span>
        </div>

        {!selectedId ? (
          <PrayerPicker onSelect={setPrayer} />
        ) : (
          <PracticeSession
            prayerId={selectedId}
            onExit={() => setPrayer(null)}
          />
        )}
      </main>
    </div>
  );
}

function PrayerPicker({
  onSelect,
}: {
  onSelect: (id: PrayerId) => void;
}) {
  return (
    <section className="animate-fade-up space-y-7">
      <header className="space-y-3 text-center">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">
          Choose a prayer
        </span>

        <h1 className="text-balance font-serif text-4xl italic leading-tight text-foreground md:text-5xl">
          Which prayer will you practise?
        </h1>

        <p className="mx-auto max-w-md text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
          Practising outside the actual prayer time is a gentle way to learn
          each movement and build confidence.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {PRAYERS.map((prayer) => (
          <button
            key={prayer.id}
            type="button"
            onClick={() => onSelect(prayer.id)}
            className="group rounded-3xl border border-border/70 bg-card p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-3xl italic text-card-foreground">
                  {prayer.nameEn}
                </h2>

                <p
                  dir="rtl"
                  className="mt-1 font-arabic text-xl text-accent"
                >
                  {prayer.nameAr}
                </p>
              </div>

              <div className="rounded-2xl bg-secondary px-3 py-2 text-center">
                <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Rak‘ahs
                </p>

                <p className="font-serif text-2xl italic text-foreground">
                  {prayer.rakahs}
                </p>
              </div>
            </div>

            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
              {prayer.timeHint}
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs font-medium text-primary">
              <span>Begin practice</span>

              <span
                className="h-px flex-1 bg-border transition-colors group-hover:bg-accent"
                aria-hidden="true"
              />

              <span
                className="transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </div>
          </button>
        ))}
      </div>

      <aside className="rounded-3xl border border-border/70 bg-secondary/50 p-5">
        <p className="text-sm leading-relaxed text-muted-foreground">
          This mode is a learning guide. During an actual prayer, follow the
          prayer carefully and avoid relying on the screen more than necessary.
        </p>
      </aside>
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
  const prayer = PRAYERS.find((item) => item.id === prayerId);

  if (!prayer) {
    return null;
  }

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

  const [position, setPosition] = useState(0);
  const [countedThisSession, setCountedThisSession] = useState(false);

  const sequence = useMemo(() => buildSequence(prayerId), [prayerId]);

  const flatSteps = useMemo(() => {
    const steps: Array<{
      rakah: number;
      stepIndex: number;
    }> = [];

    sequence.forEach((rakah) => {
      rakah.steps.forEach((step, stepIndex) => {
        if (
          step.genderOnly &&
          guidance !== "both" &&
          step.genderOnly !== guidance
        ) {
          return;
        }

        steps.push({
          rakah: rakah.rakah,
          stepIndex,
        });
      });
    });

    return steps;
  }, [sequence, guidance]);

  useEffect(() => {
    setPosition(0);
    setCountedThisSession(false);
  }, [prayerId]);

  useEffect(() => {
    setPosition((current) =>
      Math.min(current, Math.max(flatSteps.length - 1, 0)),
    );
  }, [flatSteps.length]);

  if (flatSteps.length === 0) {
    return (
      <section className="rounded-3xl border border-border bg-card p-6 text-center">
        <p className="text-muted-foreground">
          No practice steps are available.
        </p>
      </section>
    );
  }

  const clampedPosition = Math.min(position, flatSteps.length - 1);
  const currentReference = flatSteps[clampedPosition];

  const currentRakah = sequence.find(
    (item) => item.rakah === currentReference.rakah,
  );

  const currentStep =
    currentRakah?.steps[currentReference.stepIndex] ?? null;

  if (!currentStep) {
    return null;
  }

  const progress = Math.round(
    ((clampedPosition + 1) / flatSteps.length) * 100,
  );

  const isFirst = clampedPosition === 0;
  const isLast = clampedPosition === flatSteps.length - 1;

  const goPrevious = () => {
    setPosition((current) => Math.max(0, current - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goNext = () => {
    if (isLast) {
      if (!countedThisSession) {
        increment();
        setCountedThisSession(true);
      }

      return;
    }

    setPosition((current) => current + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const restartPractice = () => {
    setPosition(0);
    setCountedThisSession(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="space-y-6">
      {/* Session header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
            {prayer.nameEn} · {prayer.rakahs} rak‘ahs
          </p>

          <p dir="rtl" className="mt-1 font-arabic text-xl text-foreground">
            {prayer.nameAr}
          </p>
        </div>

        <button
          type="button"
          onClick={onExit}
          className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent"
        >
          Change prayer
        </button>
      </div>

      {/* Progress */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>
            Rak‘ah {currentReference.rakah} of {prayer.rakahs}
          </span>

          <span>
            Step {clampedPosition + 1} of {flatSteps.length}
          </span>
        </div>

        <div
          className="h-1.5 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-label="Prayer practice progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      {/* Display controls */}
      <section className="space-y-4 rounded-3xl border border-border/70 bg-card p-4 shadow-sm">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Practice display
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <TogglePill
            active={showTransliteration}
            label="Transliteration"
            onClick={() => setShowTransliteration((value) => !value)}
          />

          <TogglePill
            active={showTranslation}
            label="Translation"
            onClick={() => setShowTranslation((value) => !value)}
          />

          <TogglePill
            active={showDetail}
            label="Explain more"
            onClick={() => setShowDetail((value) => !value)}
          />
        </div>

        <div className="border-t border-border/70 pt-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Movement guidance
          </p>

          <div
            className="inline-flex rounded-full border border-border bg-secondary/60 p-1"
            role="group"
            aria-label="Choose movement guidance"
          >
            {(["male", "female", "both"] as const).map((option) => {
              const selected = guidance === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setGuidance(option)}
                  aria-pressed={selected}
                  className={[
                    "rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-widest transition",
                    selected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-card hover:text-foreground",
                  ].join(" ")}
                >
                  {selected ? "✓ " : ""}
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Current movement */}
      <article className="space-y-6 rounded-3xl border border-border/70 bg-card p-6 shadow-sm md:p-8">
        <header>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
            Movement
          </p>

          <h1 className="mt-1 text-balance font-serif text-4xl italic leading-tight text-card-foreground">
            {currentStep.movement}
          </h1>
        </header>

        <MovementVisual movement={currentStep.movement} />

        <section>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            What to do
          </p>

          <p className="mt-2 text-pretty text-[17px] leading-relaxed text-foreground/90">
            {currentStep.instruction}
          </p>
        </section>

        {currentStep.arabic && (
          <section className="space-y-4 rounded-3xl border border-border/70 bg-background p-5 text-center">
            <p
              dir="rtl"
              className="font-arabic text-3xl leading-loose text-foreground md:text-4xl"
            >
              {currentStep.arabic}
            </p>

            {showTransliteration && currentStep.transliteration && (
              <div className="rounded-2xl bg-secondary/70 px-4 py-3">
                <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Transliteration
                </p>

                <p className="font-serif text-lg italic text-foreground">
                  {currentStep.transliteration}
                </p>
              </div>
            )}

            {showTranslation && currentStep.translation && (
              <div className="rounded-2xl border border-border/70 bg-card px-4 py-3">
                <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Meaning
                </p>

                <p className="text-sm leading-relaxed text-card-foreground">
                  {currentStep.translation}
                </p>
              </div>
            )}
          </section>
        )}

        {currentStep.audioLabel && (
          <section className="rounded-2xl border border-border/70 bg-secondary/40 p-4">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Pronunciation
            </p>

            <AudioPlayer label={currentStep.audioLabel} />

            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              A real recording still needs to be connected before audio can
              play.
            </p>
          </section>
        )}

        {showDetail && currentStep.detail && (
          <aside className="rounded-r-2xl border-l-2 border-accent bg-secondary/50 px-4 py-3">
            <p className="text-sm italic leading-relaxed text-muted-foreground">
              {currentStep.detail}
            </p>
          </aside>
        )}

        {currentStep.genderNote && guidance !== "both" && (
          <GuidanceNote
            label={guidance}
            text={currentStep.genderNote[guidance]}
          />
        )}

        {currentStep.genderNote && guidance === "both" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <GuidanceNote
              label="male"
              text={currentStep.genderNote.male}
            />

            <GuidanceNote
              label="female"
              text={currentStep.genderNote.female}
            />
          </div>
        )}

        {currentStep.scholarlyNote && (
          <aside className="rounded-r-2xl border-l-2 border-accent bg-secondary/40 px-4 py-3">
            <p className="text-xs italic leading-relaxed text-muted-foreground">
              {currentStep.scholarlyNote}
            </p>
          </aside>
        )}
      </article>

      {isLast && countedThisSession && (
        <section className="space-y-3 rounded-3xl bg-primary p-7 text-center text-primary-foreground shadow-lg">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
            Alḥamdulillāh
          </p>

          <h2 className="font-serif text-3xl italic">
            You completed a full practice
          </h2>

          <p className="text-sm text-primary-foreground/75">
            May Allah accept every sincere step and make Salah easy for you.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={restartPractice}
              className="rounded-full bg-background px-5 py-3 text-xs font-semibold uppercase tracking-widest text-foreground transition hover:bg-accent hover:text-accent-foreground"
            >
              Practise again
            </button>

            <button
              type="button"
              onClick={onExit}
              className="rounded-full border border-primary-foreground/20 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition hover:bg-primary-foreground/10"
            >
              Choose another
            </button>
          </div>
        </section>
      )}

      {/* Sticky navigation */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-3">
          <button
            type="button"
            onClick={goPrevious}
            disabled={isFirst}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-card text-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Previous step"
          >
            ←
          </button>

          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {currentStep.movement}
            </p>
          </div>

          <button
            type="button"
            onClick={goNext}
            className={[
              "h-11 shrink-0 rounded-full px-5 text-sm font-semibold transition",
              isLast
                ? "bg-accent text-accent-foreground hover:opacity-90"
                : "bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground",
            ].join(" ")}
          >
            {isLast
              ? countedThisSession
                ? "Finished"
                : "Finish"
              : "Next"}
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
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-widest transition",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20 ring-offset-2 ring-offset-card"
          : "border-border bg-background text-muted-foreground hover:border-accent hover:text-foreground",
      ].join(" ")}
    >
      <span
        className={[
          "flex size-4 items-center justify-center rounded-full text-[9px]",
          active
            ? "bg-primary-foreground/20 text-primary-foreground"
            : "border border-current",
        ].join(" ")}
        aria-hidden="true"
      >
        {active ? "✓" : ""}
      </span>

      <span>{label}</span>

      <span className="opacity-70">{active ? "On" : "Off"}</span>
    </button>
  );
}

function GuidanceNote({
  label,
  text,
}: {
  label: "male" | "female";
  text?: string;
}) {
  if (!text) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-border/70 bg-secondary/50 p-4">
      <p className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-accent">
        {label} guidance
      </p>

      <p className="text-sm leading-relaxed text-foreground">
        {text}
      </p>
    </div>
  );
}

function MovementVisual({
  movement,
}: {
  movement: string;
}) {
  const pose = getMovementPose(movement);

  return (
    <section className="overflow-hidden rounded-3xl border border-border/70 bg-secondary/40">
      <div className="relative flex min-h-64 items-end justify-center px-8 pb-7 pt-8">
        <div
          className="absolute inset-x-8 bottom-6 h-px bg-border"
          aria-hidden="true"
        />

        <div
          className={[
            "relative h-44 w-28 transition-transform duration-300",
            pose.wrapperClassName,
          ].join(" ")}
          aria-hidden="true"
        >
          <div
            className={[
              "absolute size-10 rounded-full border-[5px] border-primary",
              pose.headClassName,
            ].join(" ")}
          />

          <div
            className={[
              "absolute rounded-full bg-primary",
              pose.bodyClassName,
            ].join(" ")}
          />

          <div
            className={[
              "absolute h-3 rounded-full bg-primary",
              pose.armOneClassName,
            ].join(" ")}
          />

          <div
            className={[
              "absolute h-3 rounded-full bg-primary",
              pose.armTwoClassName,
            ].join(" ")}
          />

          <div
            className={[
              "absolute h-3 rounded-full bg-primary",
              pose.legOneClassName,
            ].join(" ")}
          />

          <div
            className={[
              "absolute h-3 rounded-full bg-primary",
              pose.legTwoClassName,
            ].join(" ")}
          />
        </div>
      </div>

      <div className="border-t border-border/70 bg-card px-5 py-3 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Simple movement preview
        </p>
      </div>
    </section>
  );
}

function getMovementPose(movement: string) {
  const normalized = movement.toLowerCase();

  if (
    normalized.includes("sujūd") ||
    normalized.includes("prostration")
  ) {
    return {
      wrapperClassName: "translate-y-6 rotate-0",
      headClassName: "bottom-5 left-3",
      bodyClassName:
        "bottom-10 left-10 h-5 w-24 origin-left -rotate-[8deg]",
      armOneClassName:
        "bottom-3 left-8 w-14 origin-left rotate-[8deg]",
      armTwoClassName:
        "bottom-11 left-8 w-14 origin-left rotate-[35deg]",
      legOneClassName:
        "bottom-8 right-0 w-16 origin-right -rotate-[42deg]",
      legTwoClassName:
        "bottom-2 right-1 w-16 origin-right rotate-[3deg]",
    };
  }

  if (
    normalized.includes("rukū") ||
    normalized.includes("bowing")
  ) {
    return {
      wrapperClassName: "translate-y-1",
      headClassName: "top-11 right-0",
      bodyClassName:
        "top-20 left-5 h-5 w-24 origin-left rotate-[2deg]",
      armOneClassName:
        "top-24 right-2 w-16 origin-right rotate-[45deg]",
      armTwoClassName:
        "top-27 right-3 w-16 origin-right rotate-[52deg]",
      legOneClassName:
        "top-24 left-7 w-20 origin-left rotate-[82deg]",
      legTwoClassName:
        "top-24 left-12 w-20 origin-left rotate-[82deg]",
    };
  }

  if (
    normalized.includes("sit") ||
    normalized.includes("tashahhud")
  ) {
    return {
      wrapperClassName: "translate-y-4",
      headClassName: "top-3 left-9",
      bodyClassName:
        "top-14 left-11 h-20 w-5",
      armOneClassName:
        "top-20 left-6 w-14 origin-right rotate-[8deg]",
      armTwoClassName:
        "top-20 left-12 w-14 origin-left -rotate-[8deg]",
      legOneClassName:
        "bottom-8 left-8 w-20 origin-left rotate-[28deg]",
      legTwoClassName:
        "bottom-5 left-10 w-20 origin-left rotate-[5deg]",
    };
  }

  return {
    wrapperClassName: "",
    headClassName: "top-0 left-9",
    bodyClassName:
      "top-11 left-11 h-24 w-5",
    armOneClassName:
      "top-16 left-1 w-12 origin-right rotate-[18deg]",
    armTwoClassName:
      "top-16 right-1 w-12 origin-left -rotate-[18deg]",
    legOneClassName:
      "bottom-0 left-5 w-20 origin-left rotate-[76deg]",
    legTwoClassName:
      "bottom-0 right-5 w-20 origin-right -rotate-[76deg]",
  };
}
