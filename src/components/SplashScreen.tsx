import { HardHat } from "lucide-react";

export function SplashScreen() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white animate-in fade-in duration-500"
      style={{ background: "var(--gradient-splash)" }}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-3xl bg-white/20" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-md shadow-[var(--shadow-elevated)]">
            <HardHat className="h-12 w-12 text-accent" strokeWidth={2.2} />
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">BTP Stock Manager</h1>
          <p className="mt-1 text-sm font-medium uppercase tracking-[0.2em] text-white/70">Magasinier chantier</p>
        </div>
        <div className="mt-6 flex gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-accent" />
        </div>
      </div>
      <p className="absolute bottom-8 text-xs text-white/60">v1.0 — Mode hors-ligne prêt</p>
    </div>
  );
}
