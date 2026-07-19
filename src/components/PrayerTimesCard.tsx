import { useEffect } from "react";
import { AudioPlayer } from "@/components/AudioPlayer";
import { usePrayerTimes } from "@/lib/prayer-times";

export function PrayerTimesCard() {
  const { status, times, error, request, currentIndex } = usePrayerTimes();

  useEffect(() => {
    // Auto-request only if user previously granted permission (best-effort)
    if (
      typeof navigator !== "undefined" &&
      "permissions" in navigator &&
      // @ts-expect-error non-standard but supported
      navigator.permissions?.query
    ) {
      // @ts-expect-error same
      navigator.permissions
        .query({ name: "geolocation" })
        .then((res: PermissionStatus) => {
          if (res.state === "granted") request();
        })
        .catch(() => void 0);
    }
  }, [request]);

  return (
    <div className="bg-sand-200/40 rounded-3xl p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-moss-800">
          Prayer Times
        </h3>
        <span className="text-[10px] font-arabic text-moss-600">
          مواقيت الصلاة
        </span>
      </div>

      {status !== "ready" && (
        <div className="space-y-4">
          <p className="text-sm text-moss-600 leading-relaxed">
            Share your location to see today’s prayer times for where you are.
          </p>
          <button
            type="button"
            onClick={request}
            className="w-full rounded-full bg-moss-800 text-stone-50 px-4 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-gold-600 transition-colors disabled:opacity-60"
            disabled={status === "locating" || status === "loading"}
          >
            {status === "locating"
              ? "Locating…"
              : status === "loading"
                ? "Loading times…"
                : "Use my location"}
          </button>
          {status === "error" && error && (
            <p className="text-xs text-moss-600/80">{error}</p>
          )}
        </div>
      )}

      {status === "ready" && times && (
        <div className="space-y-3">
          {times.map((p, i) => {
            const isCurrent = i === currentIndex;
            const isPast = i < currentIndex;
            return (
              <div
                key={p.name}
                className={[
                  "flex justify-between items-center rounded-xl px-4 py-3 transition-colors",
                  isCurrent
                    ? "bg-white shadow-sm ring-1 ring-moss-800/5"
                    : isPast
                      ? "opacity-50"
                      : "",
                ].join(" ")}
              >
                <div className="flex flex-col">
                  <span
                    className={[
                      "text-sm",
                      isCurrent
                        ? "font-semibold text-moss-800"
                        : "text-moss-800",
                    ].join(" ")}
                  >
                    {p.name}
                  </span>
                  <span
                    className={[
                      "text-[10px] font-arabic",
                      isCurrent ? "text-gold-600" : "text-moss-600/70",
                    ].join(" ")}
                  >
                    {p.ar}
                  </span>
                </div>
                <span
                  className={[
                    "text-sm",
                    isCurrent ? "font-bold text-gold-600" : "text-moss-600",
                  ].join(" ")}
                >
                  {p.time}
                </span>
              </div>
            );
          })}
          <p className="text-[11px] text-moss-600/70 leading-relaxed pt-1">
            Times from Aladhan · Method: ISNA. They refresh when you reload.
          </p>
        </div>
      )}
    </div>
  );
}

export function AudioPreview() {
  return <AudioPlayer label="Sample recitation" />;
}
