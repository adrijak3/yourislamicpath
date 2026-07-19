import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  applyTheme,
  getSavedTheme,
  type AppTheme,
} from "@/lib/theme";

const themes: {
  id: AppTheme;
  label: string;
  className: string;
}[] = [
  {
    id: "light",
    label: "Light theme",
    className: "bg-stone-50 ring-stone-300",
  },
  {
    id: "midnight",
    label: "Midnight theme",
    className: "bg-zinc-900 ring-zinc-700",
  },
  {
    id: "sepia",
    label: "Sepia theme",
    className: "bg-[#f4ece1] ring-[#d4c5b3]",
  },
  {
    id: "garden",
    label: "Garden theme",
    className: "bg-[#e8f0eb] ring-[#c2d6cb]",
  },
];

export function GuidedPathNav() {
  const [activeTheme, setActiveTheme] = useState<AppTheme>("light");

  useEffect(() => {
    const savedTheme = getSavedTheme();

    setActiveTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const handleThemeChange = (theme: AppTheme) => {
    setActiveTheme(theme);
    applyTheme(theme);
  };

  return (
    <>
      {/* Utility bar */}
      <div className="bg-secondary/50 border-b border-border px-6 py-2">
        <div className="max-w-5xl mx-auto flex justify-between items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Theme
            </span>

            <div className="flex gap-2">
              {themes.map((theme) => {
                const isActive = activeTheme === theme.id;

                return (
                  <button
                    key={theme.id}
                    type="button"
                    aria-label={theme.label}
                    aria-pressed={isActive}
                    onClick={() => handleThemeChange(theme.id)}
                    className={[
                      "size-4 rounded-full ring-1 ring-offset-2 ring-offset-background shadow-sm transition-all",
                      theme.className,
                      isActive
                        ? "scale-110 ring-2 ring-primary"
                        : "opacity-60 hover:opacity-100 hover:scale-110",
                    ].join(" ")}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex gap-4">
            <button className="text-[10px] font-semibold uppercase tracking-widest text-accent">
              English
            </button>

            <button className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors">
              العربية
            </button>
          </div>
        </div>
      </div>

      {/* Primary nav */}
      <nav className="px-6 py-6 md:py-8 flex justify-between items-center max-w-5xl mx-auto gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="size-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-serif text-xl italic shadow-sm">
            G
          </div>

          <span className="font-serif italic text-2xl tracking-tight text-foreground">
            Guided Path
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link
            to="/"
            className="hover:text-accent transition-colors"
            activeProps={{ className: "text-foreground font-medium" }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>

          <Link
            to="/salah"
            className="hover:text-accent transition-colors"
            activeProps={{ className: "text-foreground font-medium" }}
          >
            Salah
          </Link>

          <Link
            to="/quran"
            className="hover:text-accent transition-colors"
            activeProps={{ className: "text-foreground font-medium" }}
          >
            Quran
          </Link>

          <Link
            to="/duas"
            className="hover:text-accent transition-colors"
            activeProps={{ className: "text-foreground font-medium" }}
          >
            Duas
          </Link>

          <Link
            to="/sunnah"
            className="hover:text-accent transition-colors"
            activeProps={{ className: "text-foreground font-medium" }}
          >
            Sunnah
          </Link>

          <Link
            to="/arabic"
            className="hover:text-accent transition-colors"
            activeProps={{ className: "text-foreground font-medium" }}
          >
            Arabic
          </Link>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              7 day streak
            </span>

            <div className="size-2 bg-accent rounded-full animate-pulse" />
          </div>

          <Link
            to="/account"
            aria-label="Open account"
            className="size-10 rounded-full outline outline-1 outline-border flex items-center justify-center bg-card hover:bg-secondary transition-colors"
          >
            <span className="text-xs font-semibold text-foreground">SA</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
