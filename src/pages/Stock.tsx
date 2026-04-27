import { useState } from "react";
import { Search } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { computeStock, useStore } from "@/lib/store";

export default function StockPage() {
  const stock = useStore(computeStock);
  const [q, setQ] = useState("");
  const filtered = stock.filter((s) => s.material.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <MobileShell title="Stock">
      <div className="mb-3 flex items-center gap-2 rounded-xl border border-border bg-card px-3 shadow-[var(--shadow-card)]">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un matériau"
          className="w-full bg-transparent py-3 text-sm outline-none"
        />
      </div>

      <ul className="space-y-2">
        {filtered.map(({ material, in: inQ, out, stock: s }) => {
          const low = s <= 10;
          return (
            <li key={material.id} className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{material.name}</p>
                  <p className="text-[11px] text-muted-foreground">Unité: {material.unit}</p>
                </div>
                <div className={`text-right ${low ? "text-destructive" : "text-primary"}`}>
                  <p className="text-2xl font-extrabold leading-none">{s}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide">{low ? "Stock bas" : "En stock"}</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-lg bg-success/10 py-1.5">
                  <span className="font-bold text-success">+{inQ}</span>
                  <span className="ml-1 text-muted-foreground">entrées</span>
                </div>
                <div className="rounded-lg bg-accent/10 py-1.5">
                  <span className="font-bold text-accent">-{out}</span>
                  <span className="ml-1 text-muted-foreground">sorties</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </MobileShell>
  );
}
