import { AudioPlayer } from "@/components/AudioPlayer";
export type MovementName = "Standing"|"Takbir"|"Qiyam"|"Ruku"|"Standing after Ruku"|"Sujud"|"Sitting"|"Second Sujud"|"Tashahhud"|"Taslim";
const details: Record<MovementName,{arabic:string;instruction:string;phrase?:string}> = {
Standing:{arabic:"القيام",instruction:"Stand upright, face the qiblah, and keep your gaze lowered toward the place of sujūd."},
Takbir:{arabic:"تكبيرة الإحرام",instruction:"Raise both hands near the shoulders or ears and say Allāhu akbar.",phrase:"الله أكبر"},
Qiyam:{arabic:"القيام",instruction:"Place the right hand over the left and recite while standing calmly."},
Ruku:{arabic:"الركوع",instruction:"Bow with a straight back, hands resting on the knees, and remain still.",phrase:"سبحان ربي العظيم"},
"Standing after Ruku":{arabic:"الاعتدال",instruction:"Rise fully upright after rukūʿ before moving to sujūd.",phrase:"سمع الله لمن حمده"},
Sujud:{arabic:"السجود",instruction:"Place the forehead, nose, palms, knees, and toes on the ground.",phrase:"سبحان ربي الأعلى"},
Sitting:{arabic:"الجلوس",instruction:"Sit calmly between the two prostrations with your hands resting on your thighs.",phrase:"رب اغفر لي"},
"Second Sujud":{arabic:"السجدة الثانية",instruction:"Return to sujūd with calmness, just as in the first prostration.",phrase:"سبحان ربي الأعلى"},
Tashahhud:{arabic:"التشهد",instruction:"Sit for the testimony of faith and recite the tashahhud attentively."},
Taslim:{arabic:"التسليم",instruction:"Turn the head to the right and then left, ending the prayer with salām.",phrase:"السلام عليكم ورحمة الله"},
};
export function SalahMovementCard({name}:{name:MovementName}){const d=details[name]; const pose=name.toLowerCase().replaceAll(" ","-"); return <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"><div className="grid min-h-64 place-items-center bg-secondary/50 p-8"><div className={`movement-figure movement-${pose}`} aria-label={`${name} prayer position`}><span className="head"/><span className="body"/><span className="arm a1"/><span className="arm a2"/><span className="leg l1"/><span className="leg l2"/></div></div><div className="space-y-4 p-6"><div><p dir="rtl" className="font-arabic text-xl text-accent">{d.arabic}</p><h3 className="font-serif text-3xl italic">{name}</h3></div><p className="text-sm leading-relaxed text-muted-foreground">{d.instruction}</p>{d.phrase&&<AudioPlayer label="Listen to the phrase" text={d.phrase}/>}</div></article>}
export const MOVEMENTS = Object.keys(details) as MovementName[];
