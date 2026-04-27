import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HardHat, User, Lock } from "lucide-react";
import { toast } from "sonner";
import { store, useStore } from "@/lib/store";

export default function LoginPage() {
  const [name, setName] = useState("Karim");
  const [pwd, setPwd] = useState("magasin");
  const navigate = useNavigate();
  const user = useStore((s) => s.user);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !pwd.trim()) {
      toast.error("Identifiants requis");
      return;
    }
    store.login(name.trim());
    toast.success(`Bienvenue ${name}`);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-between px-6 py-10 text-white"
      style={{ background: "var(--gradient-splash)" }}
    >
      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-md shadow-[var(--shadow-elevated)]">
          <HardHat className="h-10 w-10 text-accent" />
        </div>
        <h1 className="text-2xl font-extrabold">BTP Stock Manager</h1>
        <p className="text-xs uppercase tracking-[0.2em] text-white/70">Connexion magasinier</p>
      </div>

      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-3xl bg-card/95 p-6 text-foreground shadow-[var(--shadow-elevated)] backdrop-blur-md">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Identifiant</label>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent py-3 text-sm outline-none"
              placeholder="Votre nom"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Mot de passe</label>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className="w-full bg-transparent py-3 text-sm outline-none"
              placeholder="••••••"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-xl py-4 text-sm font-bold uppercase tracking-wide text-accent-foreground shadow-[var(--shadow-card)] transition active:scale-[0.98]"
          style={{ background: "var(--gradient-accent)" }}
        >
          Se connecter
        </button>
        <p className="text-center text-[11px] text-muted-foreground">Démo — n'importe quel identifiant fonctionne</p>
      </form>

      <p className="text-[11px] text-white/50">© BTP Stock — Application chantier</p>
    </div>
  );
}
