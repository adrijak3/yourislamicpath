import { useEffect, useRef } from "react";
import { AudioPlayer } from "@/components/AudioPlayer";
import { usePrayerTimes } from "@/lib/prayer-times";

export function PrayerTimesCard() {
  const { status, times, error, request, currentIndex } = usePrayerTimes();

  /*
   * Keep the newest version of request available without making the
   * permission effect run again whenever the hook re-renders.
   */
  const requestRef = useRef(request);
  const autoRequestStartedRef = useRef(false);

  useEffect(() => {
    requestRef.current = request;
  }, [request]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return;
    }

    /*
     * React Strict Mode may run effects twice during development.
     * This guard ensures location is still requested only once.
     */
    if (autoRequestStartedRef.current) {
      return;
    }

    autoRequestStartedRef.current = true;

    const permissions = navigator.permissions;

    if (!permissions?.query) {
      return;
    }

    let cancelled = false;

    permissions
      .query({
        name: "geolocation" as PermissionName,
      })
      .then((permissionStatus) => {
        if (cancelled) {
          return;
        }

        /*
         * Automatically load prayer times only when the user has already
         * granted location permission. Otherwise, wait for the button click.
         */
        if (permissionStatus.state === "granted") {
          requestRef.current();
        }
      })
      .catch(() => {
        /*
         * Some browsers do not fully support the Permissions API.
         * The manual location button will still work.
         */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const locationIsLoading =
    status === "locating" || status === "loading";

  return (
    <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm md:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-card-foreground">
          Prayer Times
        </h3>

        <span
          dir="rtl"
          className="font-arabic text-xs text-muted-foreground"
        >
          مواقيت الصلاة
        </span>
      </div>

      {status !== "ready" && (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Share your location to see today’s prayer times for where you are.
          </p>

          <button
            type="button"
            onClick={() => request()}
            disabled={locationIsLoading}
            className="w-full rounded-full bg-primary px-4 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-wait disabled:opacity-60"
          >
            {status === "locating"
              ? "Locating…"
              : status === "loading"
                ? "Loading times…"
                : status === "error"
                  ? "Try location again"
                  : "Use my location"}
          </button>

          {status === "error" && error && (
            <div
              role="alert"
              className="rounded-2xl border border-border bg-secondary/50 px-4 py-3"
            >
              <p className="text-xs leading-relaxed text-muted-foreground">
                {error}
              </p>
            </div>
          )}
        </div>
      )}

      {status === "ready" && times && (
        <div className="space-y-3">
          {times.map((prayer, index) => {
            const isCurrent = index === currentIndex;
            const isPast =
              currentIndex >= 0 && index < currentIndex;

            return (
              <div
                key={`${prayer.name}-${prayer.time}`}
                className={[
                  "flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition-colors",
                  isCurrent
                    ? "bg-secondary shadow-sm ring-1 ring-accent/20"
                    : isPast
                      ? "opacity-50"
                      : "bg-background/40",
                ].join(" ")}
              >
                <div className="flex min-w-0 flex-col">
                  <span
                    className={[
                      "text-sm text-foreground",
                      isCurrent ? "font-semibold" : "",
                    ].join(" ")}
                  >
                    {prayer.name}
                  </span>

                  <span
                    dir="rtl"
                    className={[
                      "font-arabic text-xs",
                      isCurrent
                        ? "text-accent"
                        : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {prayer.ar}
                  </span>
                </div>

                <span
                  className={[
                    "shrink-0 text-sm",
                    isCurrent
                      ? "font-bold text-accent"
                      : "text-foreground",
                  ].join(" ")}
                >
                  {prayer.time}
                </span>
              </div>
            );
          })}

          <p className="pt-1 text-[11px] leading-relaxed text-muted-foreground">
            Times provided by Aladhan using the ISNA calculation method.
            Reload the page to refresh them.
          </p>
        </div>
      )}
    </section>
  );
}

export function AudioPreview() {
  return <AudioPlayer label="Sample recitation" />;
}
