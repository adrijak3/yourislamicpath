import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, BookOpenText } from "lucide-react";
import { useState } from "react";
import { GuidedPathNav } from "@/components/GuidedPathNav";
import { getSurahs } from "@/lib/quran-api";

export const Route = createFileRoute("/quran/")({
  component: QuranPage,
  head: () => ({
    meta: [
      { title: "Quran — Guided Path" },
      {
        name: "description",
        content: "Read and listen to the Quran chapter by chapter.",
      },
    ],
  }),
});

function QuranPage() {
  const [search, setSearch] = useState("");

  const { data = [], isLoading, error } = useQuery({
    queryKey: ["quran-surahs"],
    queryFn: getSurahs,
    staleTime: 1000 * 60 * 60 * 24,
  });

  const filtered = data.filter((surah) => {
    const query = search.toLowerCase();

    return (
      surah.englishName.toLowerCase().includes(query) ||
      surah.englishNameTranslation.toLowerCase().includes(query) ||
      String(surah.number).includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-ivory-50">
      <GuidedPathNav />

      <main className="max-w-5xl mx-auto px-5 py-10 md:py-16">
        <div className="max-w-2xl">
          <div className="size-12 rounded-2xl bg-sage-100 text-emerald-800 flex items-center justify-center">
            <BookOpenText />
          </div>

          <p className="font-arabic text-gold-600 text-2xl mt-5">
            القرآن الكريم
          </p>

          <h1 className="font-serif italic text-5xl text-emerald-900">
            Read the Quran
          </h1>

          <p className="text-emerald-900/65 mt-4 leading-relaxed">
            Read the Arabic, listen to every ayah and follow an English
            translation.
          </p>
        </div>

        <label className="mt-8 flex items-center gap-3 bg-white border rounded-2xl px-4 py-3">
          <Search className="size-5 text-emerald-700" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by surah name or number"
            className="w-full outline-none bg-transparent text-sm"
          />
        </label>

        {isLoading && (
          <p className="mt-10 text-emerald-900/60">Loading Quran chapters…</p>
        )}

        {error && (
          <p className="mt-10 text-red-700">
            The chapters could not be loaded. Please try again.
          </p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {filtered.map((surah) => (
            <Link
              key={surah.number}
              to="/quran/$surahNumber"
              params={{ surahNumber: String(surah.number) }}
              className="bg-white border rounded-3xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex justify-between gap-4">
                <div className="size-9 rounded-xl bg-sage-100 flex items-center justify-center text-sm font-semibold">
                  {surah.number}
                </div>

                <p dir="rtl" className="font-arabic text-2xl text-gold-600">
                  {surah.name}
                </p>
              </div>

              <h2 className="font-serif italic text-2xl mt-5">
                {surah.englishName}
              </h2>

              <p className="text-xs text-emerald-900/55 mt-1">
                {surah.englishNameTranslation} · {surah.numberOfAyahs} ayahs
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
