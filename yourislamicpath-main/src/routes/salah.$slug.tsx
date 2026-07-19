import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { GuidedPathNav } from "@/components/GuidedPathNav";
import { AudioPlayer } from "@/components/AudioPlayer";
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
    if (!lesson) throw notFound();
    return { lesson };
  },
  head: ({ loaderData }) => {
    const title = loaderData?.lesson
      ? `${loaderData.lesson.titleEn} — Salah Course · Noor`
      : "Lesson — Noor";
    const description =
      loaderData?.lesson?.summary ??
      "A gentle Salah lesson for new Muslims and reverts.";
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
      <main className="max-w-xl mx-auto px-6 py-16 text-center space-y-4">
        <h1 className="font-serif italic text-3xl">Lesson not found</h1>
        <p className="text-muted-foreground">
          Return to the course to pick a lesson.
        </p>
        <Link
          to="/salah"
          className="inline-block mt-2 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm"
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
    <div className="rounded-2xl bg-background border border-border/70 p-5 md:p-6 space-y-3 text-center">
      {phrase.arabic && (
        <p
          dir="rtl"
          className="font-arabic text-3xl md:text-4xl text-foreground leading-loose"
        >
          {phrase.arabic}
        </p>
      )}
      {showTransliteration && phrase.transliteration && (
        <p className="font-serif italic text-lg text-muted-foreground">
          {phrase.transliteration}
        </p>
      )}
      {showTranslation && phrase.translation && (
        <p className="text-sm text-foreground/90 text-balance">
          {phrase.translation}
        </p>
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
    window.scrollTo({ top: 0 });
  }, [lesson.slug, setCurrent]);

  const genderNotesToShow =
    lesson.genderNotes?.filter(
      (n) => guidance === "both" || n.audience === guidance || n.audience === "both",
    ) ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <GuidedPathNav />

      <main className="max-w-2xl mx-auto px-5 md:px-6 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-muted-foreground/70">
          <Link to="/salah" className="hover:text-accent transition-colors">
            ← Course
          </Link>
          <span>
            Lesson {lesson.index} / {SALAH_LESSONS.length}
          </span>
        </div>

        {/* Lesson header */}
        <header className="space-y-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-semibold">
            {done ? "Completed" : "Now reading"}
          </span>
          <h1 className="font-serif italic text-3xl md:text-5xl text-foreground text-balance">
            {lesson.titleEn}
          </h1>
          {lesson.titleAr && (
            <p
              dir="rtl"
              className="font-arabic text-2xl md:text-3xl text-muted-foreground"
            >
              {lesson.titleAr}
            </p>
          )}
          {lesson.transliteration && (
            <p className="font-serif italic text-muted-foreground/80">
              {lesson.transliteration}
            </p>
          )}
        </header>

        {/* Display prefs */}
        <div className="flex flex-wrap gap-2">
          <TogglePill
            active={showTransliteration}
            onClick={() => setShowTransliteration((v) => !v)}
            label="Transliteration"
          />
          <TogglePill
            active={showTranslation}
            onClick={() => setShowTranslation((v) => !v)}
            label="Translation"
          />
          <div className="ml-auto flex gap-1 bg-muted rounded-full p-1">
            {(["male", "female", "both"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGuidance(g)}
                className={[
                  "px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold transition-colors",
                  guidance === g
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Explanation */}
        <p className="text-foreground/90 leading-relaxed text-[17px] text-pretty">
          {lesson.explanation}
        </p>

        {/* Phrase */}
        {lesson.phrase && (
          <PhraseBlock
            phrase={lesson.phrase}
            showTransliteration={showTransliteration}
            showTranslation={showTranslation}
          />
        )}

        {/* Audio */}
        {(lesson.phrase || lesson.audioLabel) && (
          <div className="bg-card border border-border/60 rounded-2xl p-4 md:p-5">
            <AudioPlayer label={lesson.audioLabel ?? "Listen"} />
          </div>
        )}

        {/* Extra phrases (e.g. Fatiha verses) */}
        {lesson.extraPhrases && lesson.extraPhrases.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
              Line by line
            </h2>
            <div className="space-y-3">
              {lesson.extraPhrases.map((p, i) => (
                <PhraseBlock
                  key={i}
                  phrase={p}
                  showTransliteration={showTransliteration}
                  showTranslation={showTranslation}
                />
              ))}
            </div>
          </section>
        )}

        {/* Gender-specific notes */}
        {genderNotesToShow.length > 0 && (
          <section className="rounded-2xl bg-card border border-border/60 p-5 space-y-3">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
              Guidance notes
            </h2>
            <ul className="space-y-2 text-sm text-foreground">
              {genderNotesToShow.map((n, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-accent text-[10px] uppercase tracking-widest font-semibold shrink-0 w-16 pt-1">
                    {n.audience}
                  </span>
                  <span className="text-pretty">{n.text}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Scholarly note */}
        {lesson.scholarlyNote && (
          <p className="text-xs text-muted-foreground/80 italic border-l-2 border-accent/60 pl-3 leading-relaxed">
            {lesson.scholarlyNote}
          </p>
        )}

        {/* Why we do this — expandable */}
        <section className="rounded-2xl bg-primary text-primary-foreground overflow-hidden">
          <button
            type="button"
            onClick={() => setWhyOpen((v) => !v)}
            aria-expanded={whyOpen}
            className="w-full flex items-center justify-between gap-4 p-5 text-left"
          >
            <div>
              <div className="text-[10px] uppercase tracking-widest text-accent">
                Why we do this
              </div>
              <div className="font-serif italic text-xl mt-1">
                A deeper reason
              </div>
            </div>
            <span
              className={[
                "text-2xl transition-transform",
                whyOpen ? "rotate-45" : "",
              ].join(" ")}
            >
              +
            </span>
          </button>
          {whyOpen && (
            <div className="px-5 pb-6 -mt-1 text-primary-foreground/90 leading-relaxed text-pretty">
              {lesson.why}
            </div>
          )}
        </section>

        {/* Common mistakes */}
        {lesson.mistakes.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
              Common mistakes
            </h2>
            <ul className="space-y-2">
              {lesson.mistakes.map((m, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm text-foreground bg-card border border-border/60 rounded-xl p-4"
                >
                  <span className="text-accent shrink-0">•</span>
                  <span className="text-pretty">{m}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      {/* Sticky lesson controls */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-background/95 backdrop-blur border-t border-border/70">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          <button
            type="button"
            disabled={!prev}
            onClick={() =>
              prev &&
              navigate({ to: "/salah/$slug", params: { slug: prev.slug } })
            }
            className="shrink-0 size-11 grid place-items-center rounded-full bg-card border border-border text-foreground disabled:opacity-30"
            aria-label="Previous lesson"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => {
              toggle(lesson.slug);
              if (!done && next) {
                setTimeout(
                  () =>
                    navigate({
                      to: "/salah/$slug",
                      params: { slug: next.slug },
                    }),
                  120,
                );
              } else if (!done) {
                markComplete(lesson.slug);
              }
            }}
            className={[
              "flex-1 rounded-full px-4 py-3 text-sm font-semibold transition-colors truncate",
              done
                ? "bg-card border border-primary text-muted-foreground"
                : "bg-primary text-primary-foreground hover:bg-accent",
            ].join(" ")}
          >
            {done ? "✓ Completed — tap to undo" : "Mark as complete"}
          </button>
          <button
            type="button"
            disabled={!next}
            onClick={() =>
              next &&
              navigate({ to: "/salah/$slug", params: { slug: next.slug } })
            }
            className="shrink-0 size-11 grid place-items-center rounded-full bg-card border border-border text-foreground disabled:opacity-30"
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
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-widest shadow-sm transition-all",
        active
          ? "border-primary bg-primary text-primary-foreground ring-2 ring-primary/20"
          : "border-border bg-card text-muted-foreground hover:border-accent hover:text-foreground",
      ].join(" ")}
    >
      <span aria-hidden="true">{active ? "✓" : "○"}</span>
      {label}
      <span className="normal-case tracking-normal opacity-70">
        {active ? "On" : "Off"}
      </span>
    </button>
  );
}
