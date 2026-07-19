import { Link } from "@tanstack/react-router";
import { BookOpen, MoonStar } from "lucide-react";
import { useEffect, useState } from "react";
import { LearningPathGrid } from "@/components/LearningPathGrid";

export function MosqueHero() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(Math.min(window.scrollY * 0.22, 160));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-[560px] overflow-hidden rounded-[2rem] mx-4 md:mx-6 mb-10">
      <div
        className="absolute inset-[-70px] bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: "url('/images/mosque-hero.webp')",
          transform: `translateY(${offset}px) scale(1.08)`,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/70 to-emerald-950/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />

      <div className="relative z-10 min-h-[560px] flex items-center px-7 md:px-14 py-16">
        <div className="max-w-2xl text-ivory-50">
          <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-[0.22em]">
            <MoonStar className="size-4" />
            A gentle beginning
          </div>

          <h1 className="font-serif italic text-5xl md:text-7xl leading-[0.95] mt-5">
            Your guided path
            <br />
            towards worship.
          </h1>

          <p className="text-white/75 leading-relaxed text-base md:text-lg mt-6 max-w-xl">
            Learn Salah, Quran, authentic duas, Sunnah and Arabic through
            clear lessons designed especially for beginners and new Muslims.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              to="/salah"
              className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3.5 text-emerald-950 font-semibold hover:bg-gold-400 transition-colors"
            >
              Begin learning
              <BookOpen className="size-4" />
            </Link>

            <Link
              to="/quran"
              className="rounded-full border border-white/35 bg-white/10 backdrop-blur-sm px-6 py-3.5 text-white font-medium hover:bg-white/20 transition-colors"
            >
              Explore Quran
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
