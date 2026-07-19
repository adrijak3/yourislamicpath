import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import {
  applyTheme,
  getSavedTheme,
  type AppTheme,
} from "@/lib/theme";

type ThemeOption = {
  id: AppTheme;
  label: string;
  swatchClassName: string;
};

const themes: ThemeOption[] = [
  { id: "light", label: "Light theme", swatchClassName: "bg-[#fdfcf7]" },
  { id: "midnight", label: "Midnight theme", swatchClassName: "bg-[#0d1714]" },
  { id: "sepia", label: "Sepia theme", swatchClassName: "bg-[#f4ecdf]" },
  { id: "garden", label: "Garden theme", swatchClassName: "bg-[#dcebdd]" },
];

const navigation = [
  { label: "Home", to: "/", exact: true, available: true },
  { label: "Salah", to: "/salah", available: true },
  { label: "Quran", to: "/quran", available: true },
  { label: "Duas", to: "/duas", available: false },
  { label: "Sunnah", to: "/sunnah", available: true },
  { label: "Arabic", to: "/arabic", available: false },
] as const;

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

  const navItem = (item: (typeof navigation)[number], mobile = false) => {
    const baseClassName = mobile
      ? "shrink-0 whitespace-nowrap transition-colors"
      : "whitespace-nowrap transition-colors";

    if (!item.available) {
      return (
        <span
          key={item.to}
          title={`${item.label} is coming soon`}
          className={`${baseClassName} cursor-not-allowed text-muted-foreground/45`}
        >
          {item.label}
          <span className="ml-1 align-top text-[8px] uppercase tracking-wider">Soon</span>
        </span>
      );
    }

    return (
      <Link
        key={item.to}
        to={item.to}
        activeOptions={{ exact: "exact" in item ? item.exact : false }}
        className={`${baseClassName} text-muted-foreground hover:text-accent`}
        activeProps={{
          className: `${baseClassName} font-medium text-foreground`,
          "aria-current": "page",
        }}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <header className="bg-background text-foreground">
      <div className="border-b border-border bg-secondary/50 px-4 py-2 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Theme
            </span>

            <div className="flex items-center gap-2" role="group" aria-label="Choose website theme">
              {themes.map((theme) => {
                const isActive = activeTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    title={theme.label}
                    aria-label={theme.label}
                    aria-pressed={isActive}
                    onClick={() => handleThemeChange(theme.id)}
                    className={[
                      "size-5 rounded-full border border-border shadow-sm ring-offset-2 ring-offset-background transition duration-200",
                      "hover:scale-110 hover:opacity-100",
                      theme.swatchClassName,
                      isActive ? "scale-110 opacity-100 ring-2 ring-ring" : "opacity-65 ring-0",
                    ].join(" ")}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4" aria-label="Language selection">
            <button
              type="button"
              aria-pressed="true"
              className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent"
            >
              English
            </button>
            <button
              type="button"
              disabled
              title="Arabic interface coming soon"
              className="text-[11px] font-semibold tracking-widest text-muted-foreground opacity-45"
            >
              العربية
            </button>
          </div>
        </div>
      </div>

      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6 md:py-7" aria-label="Main navigation">
        <Link to="/" aria-label="Guided Path home" className="group flex shrink-0 items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary font-serif text-xl italic text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            G
          </div>
          <span className="hidden font-serif text-2xl italic tracking-tight text-foreground sm:inline">
            Guided Path
          </span>
        </Link>

        <div className="hidden items-center gap-6 text-sm md:flex lg:gap-8">
          {navigation.map((item) => navItem(item))}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-secondary px-3 py-1.5 lg:flex">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">7 day streak</span>
            <span className="size-2 rounded-full bg-accent motion-safe:animate-pulse" aria-hidden="true" />
          </div>

          <button
            type="button"
            disabled
            title="Accounts are coming in Phase 2"
            aria-label="Account creation coming soon"
            className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-card-foreground opacity-60"
          >
            <UserRound className="size-4" aria-hidden="true" />
          </button>
        </div>
      </nav>

      <div className="border-y border-border bg-background px-4 md:hidden">
        <div className="no-scrollbar mx-auto flex max-w-6xl gap-6 overflow-x-auto py-3 text-sm">
          {navigation.map((item) => navItem(item, true))}
        </div>
      </div>
    </header>
  );
}
