import { useEffect, useRef, useState } from "react";

type Props = {
  label?: string;
  size?: "sm" | "md";
  showSlow?: boolean;
  showRepeat?: boolean;
};

/**
 * Audio placeholder — no real audio wired yet, but exposes the controls the
 * course promises: play/pause, repeat, and slow playback. Simulates playback
 * for a short duration so users get feedback until real recordings arrive.
 */
export function AudioPlayer({ label = "Listen", size = "md", showSlow = true, showRepeat = true }: Props) {
  const [playing, setPlaying] = useState(false);
  const [slow, setSlow] = useState(false);
  const timer = useRef<number | null>(null);

  const duration = slow ? 4200 : 2400;

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const toggle = () => {
    if (playing) {
      setPlaying(false);
      if (timer.current) window.clearTimeout(timer.current);
      return;
    }
    setPlaying(true);
    timer.current = window.setTimeout(() => setPlaying(false), duration);
  };

  const repeat = () => {
    setPlaying(false);
    if (timer.current) window.clearTimeout(timer.current);
    window.setTimeout(() => {
      setPlaying(true);
      timer.current = window.setTimeout(() => setPlaying(false), duration);
    }, 50);
  };

  const btn = size === "sm" ? "size-9 text-xs" : "size-11 text-sm";

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Pause audio" : "Play audio"}
        className={[
          "rounded-full grid place-items-center transition-colors shrink-0",
          btn,
          playing
            ? "bg-gold-600 text-stone-50"
            : "bg-moss-800 text-stone-50 hover:bg-moss-600",
        ].join(" ")}
      >
        {playing ? (
          <span className="flex gap-1">
            <span className="w-1 h-4 bg-current" />
            <span className="w-1 h-4 bg-current" />
          </span>
        ) : (
          <span className="block w-0 h-0 border-y-[6px] border-y-transparent border-l-[9px] border-l-current ml-1" />
        )}
      </button>

      {showRepeat && (
        <button
          type="button"
          onClick={repeat}
          aria-label="Repeat"
          className="text-[10px] uppercase tracking-widest font-semibold text-moss-600 hover:text-gold-600 transition-colors"
        >
          Repeat
        </button>
      )}
      {showSlow && (
        <button
          type="button"
          onClick={() => setSlow((s) => !s)}
          aria-pressed={slow}
          className={[
            "text-[10px] uppercase tracking-widest font-semibold transition-colors px-2 py-1 rounded-full",
            slow ? "bg-gold-600 text-stone-50" : "text-moss-600 hover:text-gold-600",
          ].join(" ")}
        >
          {slow ? "Slow ✓" : "Slow"}
        </button>
      )}
      <span className="text-[11px] text-moss-600/60 font-serif italic">
        {label}
        <span className="ml-2 text-moss-600/40">(preview)</span>
      </span>
    </div>
  );
}
