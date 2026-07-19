import { useCallback, useEffect, useState } from "react";
import { SALAH_LESSONS } from "@/lib/salah-course";

// --- Storage keys -----------------------------------------------------------
const KEYS = {
  completed: "noor.salah.completedLessons", // string[] slugs
  current: "noor.salah.currentLesson", // string slug
  practiceCount: "noor.salah.practiceCount", // number
  selectedPrayer: "noor.salah.selectedPrayer", // PrayerId
  showTransliteration: "noor.pref.showTransliteration", // "1" | "0"
  showTranslation: "noor.pref.showTranslation", // "1" | "0"
  showDetail: "noor.pref.showDetail", // "1" | "0"
  guidance: "noor.pref.guidance", // "male" | "female" | "both"
} as const;

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / privacy-mode errors
  }
}

// Cross-hook sync in the same tab: fire a synthetic event when we write.
const CHANGE_EVENT = "noor:storage";
function emitChange(key: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: key }));
}

function useLocalValue<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    setValue(readJSON<T>(key, fallback));
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail === key) setValue(readJSON<T>(key, fallback));
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) setValue(readJSON<T>(key, fallback));
    };
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next =
          typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        writeJSON(key, next);
        emitChange(key);
        return next;
      });
    },
    [key],
  );

  return [value, set] as const;
}

// --- Public API -------------------------------------------------------------

export function useCompletedLessons() {
  const [completed, setCompleted] = useLocalValue<string[]>(KEYS.completed, []);
  const set = new Set(completed);

  const toggle = (slug: string) =>
    setCompleted((prev) => {
      const s = new Set(prev);
      if (s.has(slug)) s.delete(slug);
      else s.add(slug);
      return Array.from(s);
    });

  const markComplete = (slug: string) =>
    setCompleted((prev) => (prev.includes(slug) ? prev : [...prev, slug]));

  return {
    completed,
    isComplete: (slug: string) => set.has(slug),
    toggle,
    markComplete,
  };
}

export function useCurrentLesson() {
  const [current, setCurrent] = useLocalValue<string | null>(
    KEYS.current,
    null,
  );
  return { current, setCurrent };
}

export function usePracticeCount() {
  const [count, setCount] = useLocalValue<number>(KEYS.practiceCount, 0);
  return {
    count,
    increment: () => setCount((c) => c + 1),
  };
}

export function useSelectedPrayer() {
  const [prayer, setPrayer] = useLocalValue<string | null>(
    KEYS.selectedPrayer,
    null,
  );
  return { prayer, setPrayer };
}

export type Guidance = "male" | "female" | "both";
export function useDisplayPrefs() {
  const [showTransliteration, setShowTransliteration] = useLocalValue<boolean>(
    KEYS.showTransliteration,
    true,
  );
  const [showTranslation, setShowTranslation] = useLocalValue<boolean>(
    KEYS.showTranslation,
    true,
  );
  const [showDetail, setShowDetail] = useLocalValue<boolean>(
    KEYS.showDetail,
    false,
  );
  const [guidance, setGuidance] = useLocalValue<Guidance>(
    KEYS.guidance,
    "both",
  );
  return {
    showTransliteration,
    setShowTransliteration,
    showTranslation,
    setShowTranslation,
    showDetail,
    setShowDetail,
    guidance,
    setGuidance,
  };
}

export function useSalahProgress() {
  const { completed } = useCompletedLessons();
  const total = SALAH_LESSONS.length;
  const percent = total === 0 ? 0 : Math.round((completed.length / total) * 100);
  const nextLesson =
    SALAH_LESSONS.find((l) => !completed.includes(l.slug)) ?? SALAH_LESSONS[0];
  return {
    completedCount: completed.length,
    total,
    percent,
    nextLesson,
  };
}
