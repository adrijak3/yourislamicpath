import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Volume2 } from "lucide-react";

type Props = { label?: string; src?: string; text?: string; lang?: string; size?: "sm" | "md"; showSlow?: boolean; showRepeat?: boolean };
export function AudioPlayer({ label="Listen", src, text, lang="ar-SA", size="md", showSlow=true, showRepeat=true }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing,setPlaying]=useState(false); const [progress,setProgress]=useState(0); const [speed,setSpeed]=useState(1); const [error,setError]=useState("");
  useEffect(()=>()=>{ speechSynthesis?.cancel(); audioRef.current?.pause(); },[]);
  const speak = () => {
    if (!text || !("speechSynthesis" in window)) { setError("Audio is not available for this item yet."); return; }
    speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang=lang; utterance.rate=speed; utterance.onend=()=>{setPlaying(false);setProgress(0)}; utterance.onerror=()=>{setPlaying(false);setError("Your browser could not play this pronunciation.")}; setPlaying(true); speechSynthesis.speak(utterance);
  };
  const toggle = async () => {
    setError("");
    if (src) {
      if (!audioRef.current) audioRef.current = new Audio(src);
      const a=audioRef.current; a.playbackRate=speed; a.ontimeupdate=()=>setProgress(a.duration ? (a.currentTime/a.duration)*100:0); a.onended=()=>{setPlaying(false);setProgress(0)}; a.onerror=()=>setError("This recording could not be loaded.");
      if (playing) a.pause(); else await a.play(); setPlaying(!playing); return;
    }
    if (playing) { speechSynthesis.cancel(); setPlaying(false); } else speak();
  };
  const repeat=()=>{ if(audioRef.current){audioRef.current.currentTime=0;audioRef.current.play();setPlaying(true)} else speak(); };
  return <div className="space-y-3">
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={toggle} className={`${size==="sm"?"size-9":"size-11"} grid place-items-center rounded-full bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground`} aria-label={playing?"Pause audio":"Play audio"}>{playing?<Pause className="size-4"/>:<Play className="ml-0.5 size-4"/>}</button>
      <div className="min-w-36 flex-1"><p className="text-sm font-medium text-foreground">{label}</p><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-accent transition-all" style={{width:`${progress}%`}}/></div></div>
      {showRepeat&&<button type="button" onClick={repeat} className="rounded-full border border-border p-2 text-muted-foreground hover:text-accent" aria-label="Repeat"><RotateCcw className="size-4"/></button>}
      {showSlow&&<select value={speed} onChange={e=>{const n=Number(e.target.value);setSpeed(n);if(audioRef.current)audioRef.current.playbackRate=n}} className="rounded-full border border-border bg-background px-3 py-2 text-xs"><option value={0.75}>0.75×</option><option value={1}>1×</option><option value={1.25}>1.25×</option></select>}
      <Volume2 className="size-4 text-muted-foreground"/>
    </div>{error&&<p className="text-xs text-destructive">{error}</p>}
  </div>;
}
