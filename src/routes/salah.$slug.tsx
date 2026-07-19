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
    <div className="min-h-screen bg-stone-50 text-moss-800">
      <GuidedPathNav />
      <main className="max-w-xl mx-auto px-6 py-16 text-center space-y-4">
        <h1 className="font-serif italic text-3xl">Lesson not found</h1>
        <p className="text-moss-600">
          Return to the course to pick a lesson.
        </p>
        <Link
          to="/salah"
          className="inline-block mt-2 px-5 py-2 rounded-full bg-moss-800 text-stone-50 text-sm"
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
    <div className="rounded-2xl bg-stone-50 border border-sand-200/70 p-5 md:p-6 space-y-3 text-center">
      {phrase.arabic && (
        <p
          dir="rtl"
          className="font-arabic text-3xl md:text-4xl text-moss-800 leading-loose"
        >
          {phrase.arabic}
        </p>
      )}
      {showTransliteration && phrase.transliteration && (
        <p className="font-serif italic text-lg text-moss-600">
          {phrase.transliteration}
        </p>
      )}
      {showTranslation && phrase.translation && (
        <p className="text-sm text-moss-800/90 text-balance">
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
    <div className="min-h-screen bg-stone-50 text-moss-800 pb-32">
      <GuidedPathNav />

      <main className="max-w-2xl mx-auto px-5 md:px-6 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-moss-600/70">
          <Link to="/salah" className="hover:text-gold-600 transition-colors">
            ← Course
          </Link>
          <span>
            Lesson {lesson.index} / {SALAH_LESSONS.length}
          </span>
        </div>

        {/* Lesson header */}
        <header className="space-y-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold-600 font-semibold">
            {done ? "Completed" : "Now reading"}
          </span>
          <h1 className="font-serif italic text-3xl md:text-5xl text-moss-800 text-balance">
            {lesson.titleEn}
          </h1>
          {lesson.titleAr && (
            <p
              dir="rtl"
              className="font-arabic text-2xl md:text-3xl text-moss-600"
            >
              {lesson.titleAr}
            </p>
          )}
          {lesson.transliteration && (
            <p className="font-serif italic text-moss-600/80">
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

        {/* Explanation */}
        <p className="text-moss-800/90 leading-relaxed text-[17px] text-pretty">
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
          <div className="bg-white border border-sand-200/60 rounded-2xl p-4 md:p-5">
            <AudioPlayer label={lesson.audioLabel ?? "Listen"} />
          </div>
        )}

        {/* Extra phrases (e.g. Fatiha verses) */}
        {lesson.extraPhrases && lesson.extraPhrases.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-moss-600">
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
          <section className="rounded-2xl bg-white border border-sand-200/60 p-5 space-y-3">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-moss-600">
              Guidance notes
            </h2>
            <ul className="space-y-2 text-sm text-moss-800">
              {genderNotesToShow.map((n, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-gold-600 text-[10px] uppercase tracking-widest font-semibold shrink-0 w-16 pt-1">
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
          <p className="text-xs text-moss-600/80 italic border-l-2 border-gold-500/60 pl-3 leading-relaxed">
            {lesson.scholarlyNote}
          </p>
        )}

        {/* Why we do this — expandable */}
        <section className="rounded-2xl bg-moss-800 text-stone-50 overflow-hidden">
          <button
            type="button"
            onClick={() => setWhyOpen((v) => !v)}
            aria-expanded={whyOpen}
            className="w-full flex items-center justify-between gap-4 p-5 text-left"
          >
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gold-500">
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
            <div className="px-5 pb-6 -mt-1 text-stone-50/90 leading-relaxed text-pretty">
              {lesson.why}
            </div>
          )}
        </section>

        {/* Common mistakes */}
        {lesson.mistakes.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-moss-600">
              Common mistakes
            </h2>
            <ul className="space-y-2">
              {lesson.mistakes.map((m, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm text-moss-800 bg-white border border-sand-200/60 rounded-xl p-4"
                >
                  <span className="text-gold-600 shrink-0">•</span>
                  <span className="text-pretty">{m}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      {/* Sticky lesson controls */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-stone-50/95 backdrop-blur border-t border-sand-200/70">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          <button
            type="button"
            disabled={!prev}
            onClick={() =>
              prev &&
              navigate({ to: "/salah/$slug", params: { slug: prev.slug } })
            }
            className="shrink-0 size-11 grid place-items-center rounded-full bg-white border border-sand-200 text-moss-800 disabled:opacity-30"
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
                ? "bg-white border border-moss-600 text-moss-600"
                : "bg-moss-800 text-stone-50 hover:bg-gold-600",
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
            className="shrink-0 size-11 grid place-items-center rounded-full bg-white border border-sand-200 text-moss-800 disabled:opacity-30"
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
