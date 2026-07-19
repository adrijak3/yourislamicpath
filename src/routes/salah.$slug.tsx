import { useEffect, useState } from "react";
import {
  createFileRoute,
  Link,
  notFound,
  useNavigate,
} from "@tanstack/react-router";
import { AudioPlayer } from "@/components/AudioPlayer";
import { GuidedPathNav } from "@/components/GuidedPathNav";
import {
  LESSON_BY_SLUG,
  SALAH_LESSONS,
  neighborLessons,
  type Lesson,
  type LessonPhrase,
} from "@/lib/salah-course";
import {
  useCompletedLessons,
  useCurrentLesson,
  useDisplayPrefs,
} from "@/lib/salah-progress";

export const Route = createFileRoute("/salah/$slug")({
  loader: ({ params }) => {
    const lesson = LESSON_BY_SLUG[params.slug];

    if (!lesson) {
      throw notFound();
    }

    return { lesson };
  },

  head: ({ loaderData }) => {
    const title = loaderData?.lesson
      ? `${loaderData.lesson.titleEn} — Guided Path`
      : "Salah lesson — Guided Path";

    const description =
      loaderData?.lesson?.summary ??
      "A gentle, beginner-friendly Salah lesson for new Muslims.";

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },

  notFoundComponent: LessonNotFound,
  component: LessonPage,
});

function LessonNotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <GuidedPathNav />

      <main className="mx-auto max-w-xl space-y-5 px-6 py-16 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          Salah course
        </p>

        <h1 className="font-serif text-4xl italic text-foreground">
          Lesson not found
        </h1>

        <p className="text-muted-foreground">
          This lesson could not be found. Return to the course and choose
          another lesson.
        </p>

        <Link
          to="/salah"
          className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-accent hover:text-accent-foreground"
        >
          Back to course
        </Link>
      </main>
    </div>
  );
}

function PhraseBlock({
  phrase,
  showTransliteration,
  showTranslation,
}: {
  phrase: LessonPhrase;
  showTransliteration: boolean;
  showTranslation: boolean;
}) {
  return (
    <div className="space-y-4 rounded-3xl border border-border/70 bg-card p-5 text-center shadow-sm md:p-7">
      {phrase.arabic && (
        <p
          dir="rtl"
          className="font-arabic text-3xl leading-loose text-card-foreground md:text-4xl"
        >
          {phrase.arabic}
        </p>
      )}

      {showTransliteration && phrase.transliteration && (
        <div className="rounded-2xl bg-secondary/70 px-4 py-3">
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Transliteration
          </p>

          <p className="font-serif text-lg italic text-foreground md:text-xl">
            {phrase.transliteration}
          </p>
        </div>
      )}

      {showTranslation && phrase.translation && (
        <div className="rounded-2xl border border-border/70 bg-background px-4 py-3">
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Meaning
          </p>

          <p className="text-sm leading-relaxed text-foreground/90">
            {phrase.translation}
          </p>
        </div>
      )}
    </div>
  );
}

function LessonPage() {
  const { lesson } = Route.useLoaderData() as { lesson: Lesson };
  const navigate = useNavigate();
  const { prev, next } = neighborLessons(lesson.slug);

  const { isComplete, markComplete, toggle } = useCompletedLessons();
  const { setCurrent } = useCurrentLesson();

  const done = isComplete(lesson.slug);

  const {
    showTransliteration,
    setShowTransliteration,
    showTranslation,
    setShowTranslation,
    guidance,
    setGuidance,
  } = useDisplayPrefs();

  const [whyOpen, setWhyOpen] = useState(false);

  useEffect(() => {
    setCurrent(lesson.slug);
    setWhyOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [lesson.slug, setCurrent]);

  const genderNotesToShow =
    lesson.genderNotes?.filter(
      (note) =>
        guidance === "both" ||
        note.audience === guidance ||
        note.audience === "both",
    ) ?? [];

  const handleComplete = () => {
    toggle(lesson.slug);

    if (!done && next) {
      window.setTimeout(() => {
        navigate({
          to: "/salah/$slug",
          params: { slug: next.slug },
        });
      }, 150);

      return;
    }

    if (!done) {
      markComplete(lesson.slug);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32 text-foreground">
      <GuidedPathNav />

      <main className="mx-auto max-w-2xl space-y-8 px-5 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <Link
            to="/salah"
            className="transition-colors hover:text-accent"
          >
            ← Course
          </Link>

          <span>
            Lesson {lesson.index} of {SALAH_LESSONS.length}
          </span>
        </div>

        {/* Lesson header */}
        <header className="space-y-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">
            {done ? "✓ Completed" : "Now learning"}
          </span>

          <h1 className="text-balance font-serif text-4xl italic leading-tight text-foreground md:text-5xl">
            {lesson.titleEn}
          </h1>

          {lesson.titleAr && (
            <p
              dir="rtl"
              className="font-arabic text-2xl leading-relaxed text-accent md:text-3xl"
            >
              {lesson.titleAr}
            </p>
          )}

          {lesson.transliteration && (
            <p className="font-serif text-lg italic text-muted-foreground">
              {lesson.transliteration}
            </p>
          )}

          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            {lesson.summary}
          </p>
        </header>

        {/* Display preferences */}
        <section className="rounded-3xl border border-border/70 bg-card p-4 shadow-sm">
          <div className="mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Lesson display
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <TogglePill
              active={showTransliteration}
              onClick={() => setShowTransliteration((value) => !value)}
              label="Transliteration"
            />

            <TogglePill
              active={showTranslation}
              onClick={() => setShowTranslation((value) => !value)}
              label="Translation"
            />
          </div>

          <div className="mt-4 border-t border-border/70 pt-4">
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

        {/* Explanation */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            What to do
          </h2>

          <p className="text-pretty text-[17px] leading-relaxed text-foreground/90">
            {lesson.explanation}
          </p>
        </section>

        {/* Main phrase */}
        {lesson.phrase && (
          <PhraseBlock
            phrase={lesson.phrase}
            showTransliteration={showTransliteration}
            showTranslation={showTranslation}
          />
        )}

        {/* Audio placeholder */}
        {(lesson.phrase || lesson.audioLabel) && (
          <section className="rounded-3xl border border-border/70 bg-card p-4 shadow-sm md:p-5">
            <div className="mb-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Pronunciation
              </p>
            </div>

            <AudioPlayer label={lesson.audioLabel ?? "Listen"} />

            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Audio will play once a recording has been connected to this
              lesson.
            </p>
          </section>
        )}

        {/* Additional phrases */}
        {lesson.extraPhrases && lesson.extraPhrases.length > 0 && (
          <section className="space-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                Line by line
              </p>

              <h2 className="mt-1 font-serif text-2xl italic text-foreground">
                Learn it slowly
              </h2>
            </div>

            <div className="space-y-4">
              {lesson.extraPhrases.map((phrase, index) => (
                <PhraseBlock
                  key={`${lesson.slug}-phrase-${index}`}
                  phrase={phrase}
                  showTransliteration={showTransliteration}
                  showTranslation={showTranslation}
                />
              ))}
            </div>
          </section>
        )}

        {/* Gender-specific guidance */}
        {genderNotesToShow.length > 0 && (
          <section className="space-y-4 rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                Movement guidance
              </p>

              <h2 className="mt-1 font-serif text-2xl italic text-card-foreground">
                Position notes
              </h2>
            </div>

            <ul className="space-y-3">
              {genderNotesToShow.map((note, index) => (
                <li
                  key={`${note.audience}-${index}`}
                  className="flex gap-3 rounded-2xl bg-secondary/60 p-4 text-sm leading-relaxed text-foreground"
                >
                  <span className="w-16 shrink-0 pt-0.5 text-[9px] font-semibold uppercase tracking-widest text-accent">
                    {note.audience}
                  </span>

                  <span className="text-pretty">{note.text}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Scholarly note */}
        {lesson.scholarlyNote && (
          <aside className="rounded-r-2xl border-l-2 border-accent bg-secondary/50 px-4 py-3">
            <p className="text-xs italic leading-relaxed text-muted-foreground">
              {lesson.scholarlyNote}
            </p>
          </aside>
        )}

        {/* Why section */}
        <section className="overflow-hidden rounded-3xl bg-primary text-primary-foreground shadow-lg shadow-primary/10">
          <button
            type="button"
            onClick={() => setWhyOpen((value) => !value)}
            aria-expanded={whyOpen}
            className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6"
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                Why we do this
              </p>

              <p className="mt-1 font-serif text-2xl italic">
                A deeper reason
              </p>
            </div>

            <span
              aria-hidden="true"
              className={[
                "text-2xl transition-transform duration-200",
                whyOpen ? "rotate-45" : "",
              ].join(" ")}
            >
              +
            </span>
          </button>

          {whyOpen && (
            <div className="border-t border-primary-foreground/10 px-5 pb-6 pt-5 text-pretty leading-relaxed text-primary-foreground/85 md:px-6">
              {lesson.why}
            </div>
          )}
        </section>

        {/* Common mistakes */}
        {lesson.mistakes.length > 0 && (
          <section className="space-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                Be careful of
              </p>

              <h2 className="mt-1 font-serif text-2xl italic text-foreground">
                Common mistakes
              </h2>
            </div>

            <ul className="space-y-3">
              {lesson.mistakes.map((mistake, index) => (
                <li
                  key={`${lesson.slug}-mistake-${index}`}
                  className="flex gap-3 rounded-2xl border border-border/70 bg-card p-4 text-sm leading-relaxed text-card-foreground shadow-sm"
                >
                  <span
                    className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-xs text-accent"
                    aria-hidden="true"
                  >
                    •
                  </span>

                  <span className="text-pretty">{mistake}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      {/* Sticky controls */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-3">
          <button
            type="button"
            disabled={!prev}
            onClick={() => {
              if (!prev) {
                return;
              }

              navigate({
                to: "/salah/$slug",
                params: { slug: prev.slug },
              });
            }}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-card text-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Previous lesson"
          >
            ←
          </button>

          <button
            type="button"
            onClick={handleComplete}
            className={[
              "flex-1 truncate rounded-full px-4 py-3 text-sm font-semibold transition",
              done
                ? "border border-primary bg-card text-primary hover:bg-secondary"
                : "bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground",
            ].join(" ")}
          >
            {done ? "✓ Completed — tap to undo" : "Mark as complete"}
          </button>

          <button
            type="button"
            disabled={!next}
            onClick={() => {
              if (!next) {
                return;
              }

              navigate({
                to: "/salah/$slug",
                params: { slug: next.slug },
              });
            }}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-card text-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Next lesson"
          >
            →
          </button>
        </div>
      </div>
    </div>
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
