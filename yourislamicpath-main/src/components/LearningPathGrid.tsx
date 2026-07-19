import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { LEARNING_PATHS } from "@/lib/learning-paths";

const cardClassName =
  "group relative overflow-hidden rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm transition-all duration-200";

function PathContent({ path }: { path: (typeof LEARNING_PATHS)[number] }) {
  const Icon = path.icon;
  const available = path.status === "available";

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </div>

        {available ? (
          <ArrowUpRight
            className="size-4 text-accent transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            aria-hidden="true"
          />
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <Clock3 className="size-3" aria-hidden="true" />
            Soon
          </span>
        )}
      </div>

      <p className="mt-6 font-arabic text-xl leading-relaxed text-accent">
        {path.arabic}
      </p>

      <h3 className="font-serif text-2xl italic text-card-foreground">
        {path.title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {path.description}
      </p>
    </>
  );
}

export function LearningPathGrid() {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          Study at your own pace
        </p>
        <h2 className="mt-1 font-serif text-3xl italic text-foreground md:text-4xl">
          Choose your learning path
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LEARNING_PATHS.map((path) =>
          path.status === "available" ? (
            <Link
              key={path.href}
              to={path.href}
              className={`${cardClassName} hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
            >
              <PathContent path={path} />
            </Link>
          ) : (
            <div
              key={path.href}
              aria-disabled="true"
              className={`${cardClassName} opacity-80`}
            >
              <PathContent path={path} />
            </div>
          ),
        )}
      </div>
    </section>
  );
}
