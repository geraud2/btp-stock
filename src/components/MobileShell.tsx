import { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { store, useStore } from "@/lib/store";
import { BottomNav } from "./BottomNav";

export function MobileShell({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  const user = useStore((s) => s.user);
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-5 pt-[calc(env(safe-area-inset-top)+0.875rem)] pb-4 text-primary-foreground shadow-[var(--shadow-card)]"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider opacity-80">
            {user?.site ?? "BTP Stock Manager"}
          </p>
          <h1 className="text-xl font-bold leading-tight">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {action}
          <button
            onClick={() => {
              store.logout();
              navigate("/login");
            }}
            aria-label="Déconnexion"
            className="rounded-full bg-white/15 p-2 transition hover:bg-white/25"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>
      <main className="flex-1 px-4 pb-28 pt-4">{children}</main>
      <BottomNav />
    </div>
  );
}
