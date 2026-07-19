import { useEffect, useState } from "react";

// Prayer times via geolocation + Aladhan API.
// Method 2 = Islamic Society of North America (a common default).

export type PrayerTime = {
  name: string;
  ar: string;
  time: string; // "HH:MM"
  minutes: number; // minutes since midnight, local
};

export type PrayerTimesResult = {
  status: "idle" | "locating" | "loading" | "ready" | "error";
  times: PrayerTime[] | null;
  city?: string;
  country?: string;
  error?: string;
};

const KEYS = [
  { key: "Fajr", ar: "الفجر" },
  { key: "Dhuhr", ar: "الظهر" },
  { key: "Asr", ar: "العصر" },
  { key: "Maghrib", ar: "المغرب" },
  { key: "Isha", ar: "العشاء" },
] as const;

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = ((h + 11) % 12) + 1;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function usePrayerTimes(): PrayerTimesResult & {
  request: () => void;
  currentIndex: number; // index of the current prayer window
} {
  const [state, setState] = useState<PrayerTimesResult>({
    status: "idle",
    times: null,
  });
  const [nowMinutes, setNowMinutes] = useState<number>(() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  });

  useEffect(() => {
    const id = window.setInterval(() => {
      const d = new Date();
      setNowMinutes(d.getHours() * 60 + d.getMinutes());
    }, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const fetchFor = async (lat: number, lon: number) => {
    setState({ status: "loading", times: null });
    try {
      const d = new Date();
      const url = `https://api.aladhan.com/v1/timings/${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}?latitude=${lat}&longitude=${lon}&method=2`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Prayer times request failed");
      const json = await res.json();
      const t = json?.data?.timings ?? {};
      const times: PrayerTime[] = KEYS.map(({ key, ar }) => ({
        name: key,
        ar,
        time: formatTime(t[key] ?? "00:00"),
        minutes: toMinutes(t[key] ?? "00:00"),
      }));
      const meta = json?.data?.meta ?? {};
      setState({
        status: "ready",
        times,
        city: meta?.timezone,
      });
    } catch (e) {
      setState({
        status: "error",
        times: null,
        error: e instanceof Error ? e.message : "Could not load prayer times.",
      });
    }
  };

  const request = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setState({
        status: "error",
        times: null,
        error: "Geolocation is not available in this browser.",
      });
      return;
    }
    setState({ status: "locating", times: null });
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchFor(pos.coords.latitude, pos.coords.longitude),
      (err) =>
        setState({
          status: "error",
          times: null,
          error:
            err.code === err.PERMISSION_DENIED
              ? "Location permission was denied."
              : "Could not read your location.",
        }),
      { timeout: 10_000, maximumAge: 5 * 60 * 1000 },
    );
  };

  let currentIndex = -1;
  if (state.times) {
    for (let i = 0; i < state.times.length; i++) {
      const start = state.times[i].minutes;
      const end = state.times[i + 1]?.minutes ?? 24 * 60;
      if (nowMinutes >= start && nowMinutes < end) {
        currentIndex = i;
        break;
      }
    }
    if (currentIndex === -1 && nowMinutes < state.times[0].minutes) {
      currentIndex = -1; // before Fajr
    }
  }

  return { ...state, request, currentIndex };
}
