import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Play, Pause } from "lucide-react";
import { useRef, useState } from "react";
import { GuidedPathNav } from "@/components/GuidedPathNav";
import { getSurah } from "@/lib/quran-api";

export const Route = createFileRoute("/quran/$surahNumber")({
  component: SurahPage,
});

function AyahAudio({ src }: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  if (!src) return null;

  const toggle = async () => {
    const player = audioRef.current;
    if (!player) return;

    if (player.paused) {
      await player.play();
      setPlaying(true);
    } else {
      player.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        onEnded={() => setPlaying(false)}
        preload="none"
      />

      <button
        onClick={toggle}
        aria-label={playing ? "Pause recitation" : "Play recitation"}
        className="size-10 rounded-full bg-secondary text-primary flex items-center justify-center"
      >
        {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
      </button>
    </>
  );
}

function SurahPage() {
  const { surahNumber } = Route.useParams();
  const number = Number(surahNumber);

  const { data, isLoading, error } = useQuery({
    queryKey: ["surah", number],
    queryFn: () => getSurah(number),
    enabled: Number.isInteger(number) && number >= 1 && number <= 114,
  });

  return (
    <div className="min-h-screen bg-ivory-50">
      <GuidedPathNav />

      <main className="max-w-4xl mx-auto px-5 py-10">
        <Link
          to="/quran"
          className="inline-flex items-center gap-2 text-sm text-primary"
        >
          <ArrowLeft className="size-4" />
          All surahs
        </Link>

        {isLoading && <p className="mt-10">Loading surah…</p>}
        {error && <p className="mt-10 text-red-700">Could not load this surah.</p>}

        {data && (
          <>
            <header className="text-center py-10">
              <p dir="rtl" className="font-arabic text-5xl text-accent">
                {data.surah.name}
              </p>

              <h1 className="font-serif italic text-4xl text-foreground mt-3">
                {data.surah.englishName}
              </h1>

              <p className="text-sm text-foreground/55 mt-2">
                {data.surah.englishNameTranslation} ·{" "}
                {data.surah.numberOfAyahs} ayahs
              </p>
            </header>

            <div className="space-y-5">
              {data.ayahs.map((ayah) => (
                <article
                  key={ayah.number}
                  className="bg-card border rounded-3xl p-6 md:p-8"
                >
                  <div className="flex justify-between items-center">
                    <span className="size-9 rounded-full bg-emerald-900 text-white flex items-center justify-center text-xs">
                      {ayah.numberInSurah}
                    </span>

                    <AyahAudio src={ayah.audio} />
                  </div>

                  <p
                    dir="rtl"
                    className="font-arabic text-3xl md:text-4xl leading-[2.2] text-right text-emerald-950 mt-6"
                  >
                    {ayah.text}
                  </p>

                  <p className="border-t mt-6 pt-5 text-foreground/70 leading-relaxed">
                    {ayah.translation}
                  </p>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
