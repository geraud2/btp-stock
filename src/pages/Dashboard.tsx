import { Link } from "react-router-dom";
import { ArrowDownToLine, ArrowUpFromLine, Repeat, AlertTriangle, ChevronRight } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { computeStock, useStore } from "@/lib/store";

export default function DashboardPage() {
  const user = useStore((s) => s.user);
  const movements = useStore((s) => s.movements);
  const transfers = useStore((s) => s.transfers);
  const inventory = useStore((s) => s.inventory);
  const stock = useStore(computeStock);

  const todayStr = new Date().toISOString().slice(0, 10);
  const inToday = movements.filter((m) => m.type === "in" && m.date === todayStr).length;
  const outToday = movements.filter((m) => m.type === "out" && m.date === todayStr).length;
  const pending = transfers.filter((t) => t.status === "pending").length;
  const ecarts = inventory.filter((i) => {
    const st = stock.find((s) => s.material.id === i.materialId);
    return st && st.stock !== i.realQty;
  }).length;

  const stats = [
    { label: "Entrées", value: inToday, icon: ArrowDownToLine, to: "/entrees", tone: "primary" },
    { label: "Sorties", value: outToday, icon: ArrowUpFromLine, to: "/sorties", tone: "accent" },
    { label: "Transferts", value: pending, icon: Repeat, to: "/transferts", tone: "primary" },
    { label: "Écarts", value: ecarts, icon: AlertTriangle, to: "/inventaire", tone: "destructive" },
  ] as const;

  const recent = movements.slice(0, 5);

  return (
    <MobileShell title={`Bonjour ${user?.name ?? ""}`}>
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, icon: Icon, to, tone }) => (
          <Link
            key={label}
            to={to}
            className="group rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition active:scale-[0.97]"
          >
            <div
              className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${
                tone === "destructive"
                  ? "bg-destructive/10 text-destructive"
                  : tone === "accent"
                    ? "bg-accent/15 text-accent"
                    : "bg-primary/10 text-primary"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-3xl font-extrabold leading-none">{value}</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
          </Link>
        ))}
      </div>

      {ecarts > 0 && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
          <div className="text-sm">
            <p className="font-semibold text-destructive">{ecarts} écart{ecarts > 1 ? "s" : ""} d'inventaire</p>
            <p className="text-xs text-muted-foreground">À vérifier dans la page Inventaire</p>
          </div>
        </div>
      )}

      <section className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Mouvements récents</h2>
        </div>
        <ul className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
          {recent.length === 0 && <li className="p-4 text-center text-sm text-muted-foreground">Aucun mouvement</li>}
          {recent.map((m) => {
            const mat = stock.find((s) => s.material.id === m.materialId)?.material;
            return (
              <li key={m.id} className="flex items-center gap-3 border-b border-border/60 p-3 last:border-b-0">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    m.type === "in" ? "bg-success/15 text-success" : "bg-accent/15 text-accent"
                  }`}
                >
                  {m.type === "in" ? <ArrowDownToLine className="h-4 w-4" /> : <ArrowUpFromLine className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold">{mat?.name ?? "—"}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.party}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${m.type === "in" ? "text-success" : "text-accent"}`}>
                    {m.type === "in" ? "+" : "-"}
                    {m.qty}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{mat?.unit}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <Link to="/stock" className="mt-2 flex items-center justify-center gap-1 py-2 text-xs font-semibold text-primary">
          Voir le stock complet <ChevronRight className="h-3 w-3" />
        </Link>
      </section>
    </MobileShell>
  );
}
