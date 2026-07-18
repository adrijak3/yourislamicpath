import { Link } from "@tanstack/react-router";

export function NoorNav() {
  return (
    <>
      {/* Utility bar */}
      <div className="bg-stone-100/50 border-b border-sand-200/40 px-6 py-2">
        <div className="max-w-5xl mx-auto flex justify-between items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-moss-600/60">
              Theme
            </span>
            <div className="flex gap-2">
              <button
                aria-label="Light theme"
                className="size-4 rounded-full bg-stone-50 ring-2 ring-moss-800 ring-offset-1 shadow-sm"
              />
              <button
                aria-label="Midnight theme"
                className="size-4 rounded-full bg-zinc-900 ring-1 ring-zinc-900/10 opacity-40 cursor-not-allowed"
              />
              <button
                aria-label="Sepia theme"
                className="size-4 rounded-full bg-[#f4ece1] ring-1 ring-[#d4c5b3] opacity-40 cursor-not-allowed"
              />
              <button
                aria-label="Garden theme"
                className="size-4 rounded-full bg-[#e8f0eb] ring-1 ring-[#c2d6cb] opacity-40 cursor-not-allowed"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button className="text-[10px] font-semibold uppercase tracking-widest text-gold-600">
              English
            </button>
            <button className="text-[10px] font-semibold uppercase tracking-widest text-moss-600/60 hover:text-gold-600 transition-colors">
              العربية
            </button>
          </div>
        </div>
      </div>

      {/* Primary nav */}
      <nav className="px-6 py-6 md:py-8 flex justify-between items-center max-w-5xl mx-auto gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="size-10 bg-moss-600 rounded-full flex items-center justify-center text-stone-50 font-serif text-xl italic shadow-sm shadow-moss-800/20">
            N
          </div>
          <span className="font-serif italic text-2xl tracking-tight text-moss-800">
            Noor
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-moss-600">
          <Link
            to="/"
            className="hover:text-gold-600 transition-colors"
            activeProps={{ className: "text-moss-800 font-medium" }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          <Link
            to="/salah"
            className="hover:text-gold-600 transition-colors"
            activeProps={{ className: "text-moss-800 font-medium" }}
          >
            Salah
          </Link>
          <span className="text-moss-600/40 cursor-not-allowed">Quran</span>
          <span className="text-moss-600/40 cursor-not-allowed">Duas</span>
          <span className="text-moss-600/40 cursor-not-allowed">Arabic</span>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-sand-200/40 px-3 py-1.5 rounded-full">
            <span className="text-xs font-medium uppercase tracking-wider text-moss-600">
              7 day streak
            </span>
            <div className="size-2 bg-gold-600 rounded-full animate-pulse" />
          </div>
          <div className="size-10 rounded-full outline outline-1 outline-moss-800/10 flex items-center justify-center bg-white">
            <span className="text-xs font-semibold text-moss-800">SA</span>
          </div>
        </div>
      </nav>
    </>
  );
}
