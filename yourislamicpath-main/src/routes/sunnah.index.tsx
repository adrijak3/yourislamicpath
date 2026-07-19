import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { GuidedPathNav } from "@/components/GuidedPathNav";
import { SUNNAH_LESSONS } from "@/lib/sunnah-data";

export const Route = createFileRoute("/sunnah/")({
  component: SunnahPage,
});

function SunnahPage() {
  return (
    <div className="min-h-screen bg-ivory-50">
      <GuidedPathNav />

      <main className="max-w-5xl mx-auto px-5 py-12">
        <Sparkles className="text-accent" />

        <p className="font-arabic text-2xl text-accent mt-5">السنة</p>

        <h1 className="font-serif italic text-5xl text-foreground">
          Small Sunnah habits
        </h1>

        <p className="max-w-2xl text-muted-foreground mt-4">
          Build your practice gently through small, consistent acts.
        </p>

        <div className="grid md:grid-cols-2 gap-5 mt-10">
          {SUNNAH_LESSONS.map((lesson) => (
            <article
              key={lesson.id}
              className="bg-card border rounded-3xl p-6"
            >
              <div className="flex justify-between gap-4">
                <span className="text-[10px] uppercase tracking-widest text-accent">
                  {lesson.category}
                </span>

                <span className="font-arabic text-lg text-emerald-700">
                  {lesson.arabicTitle}
                </span>
              </div>

              <h2 className="font-serif italic text-2xl mt-4">
                {lesson.title}
              </h2>

              <p className="text-sm leading-relaxed text-muted-foreground mt-3">
                {lesson.description}
              </p>

              <div className="bg-secondary rounded-2xl p-4 mt-5">
                <p className="text-[10px] uppercase tracking-widest text-emerald-700">
                  Try today
                </p>
                <p className="text-sm mt-1">{lesson.practice}</p>
              </div>

              <p className="text-xs text-foreground/50 mt-4">
                Source: {lesson.source}
              </p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
