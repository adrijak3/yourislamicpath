import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { LEARNING_PATHS } from "@/lib/learning-paths";

export function LearningPathGrid() {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-600">
          Study at your own pace
        </p>
        <h2 className="font-serif italic text-3xl md:text-4xl text-emerald-900 mt-1">
          Choose your learning path
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LEARNING_PATHS.map((path) => {
          const Icon = path.icon;

          return (
            <Link
              key={path.href}
              to={path.href}
              className="group bg-white/90 border border-ivory-200 rounded-3xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="size-11 rounded-2xl bg-sage-100 flex items-center justify-center text-emerald-800">
                  <Icon className="size-5" />
                </div>

                <ArrowUpRight className="size-4 text-gold-600 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>

              <p className="font-arabic text-xl text-gold-600 mt-6">
                {path.arabic}
              </p>

              <h3 className="font-serif italic text-2xl text-emerald-900">
                {path.title}
              </h3>

              <p className="text-sm text-emerald-900/65 leading-relaxed mt-3">
                {path.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
