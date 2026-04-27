import { useState } from "react";
import { AlertTriangle, Check } from "lucide-react";
import { toast } from "sonner";
import { MobileShell } from "@/components/MobileShell";
import { computeStock, store, useStore } from "@/lib/store";

export default function InventairePage() {
  const stock = useStore(computeStock);
  const inventory = useStore((s) => s.inventory);
  const [drafts, setDrafts] = useState<Record<string, { real: string; note: string }>>({});

  const update = (id: string, key: "real" | "note", value: string) => {
    setDrafts((d) => ({ ...d, [id]: { ...(d[id] ?? { real: "", note: "" }), [key]: value } }));
  };

  const save = (materialId: string) => {
    const d = drafts[materialId];
    const realQty = Number(d?.real);
    if (!d || isNaN(realQty)) {
      toast.error("Quantité réelle requise");
      return;
    }
    store.saveInventory({
      materialId,
      realQty,
      note: d.note?.trim() || undefined,
      date: new Date().toISOString().slice(0, 10),
    });
    toast.success("Inventaire enregistré");
  };

  return (
    <MobileShell title="Inventaire">
      <p className="mb-3 text-xs text-muted-foreground">Saisir le stock réel pour comparer au stock théorique.</p>
      <ul className="space-y-3">
        {stock.map(({ material, stock: theo }) => {
          const saved = inventory.find((i) => i.materialId === material.id);
          const draft = drafts[material.id] ?? { real: saved ? String(saved.realQty) : "", note: saved?.note ?? "" };
          const realNum = Number(draft.real);
          const hasReal = draft.real !== "" && !isNaN(realNum);
          const diff = hasReal ? realNum - theo : 0;
          const ecart = hasReal && diff !== 0;

          return (
            <li
              key={material.id}
              className={`rounded-2xl border bg-card p-4 shadow-[var(--shadow-card)] ${
                ecart ? "border-destructive/50 ring-1 ring-destructive/30" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold">{material.name}</p>
                  <p className="text-[11px] text-muted-foreground">Théorique: <span className="font-bold text-foreground">{theo}</span> {material.unit}</p>
                </div>
                {ecart && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold text-destructive-foreground">
                    <AlertTriangle className="h-3 w-3" /> Écart {diff > 0 ? "+" : ""}{diff}
                  </span>
                )}
                {hasReal && !ecart && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success px-2 py-0.5 text-[10px] font-bold text-success-foreground">
                    <Check className="h-3 w-3" /> OK
                  </span>
                )}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="Stock réel"
                  value={draft.real}
                  onChange={(e) => update(material.id, "real", e.target.value)}
                  className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  placeholder="Observation"
                  value={draft.note}
                  onChange={(e) => update(material.id, "note", e.target.value)}
                  className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                onClick={() => save(material.id)}
                className="mt-3 w-full rounded-xl bg-primary py-2.5 text-xs font-bold uppercase tracking-wide text-primary-foreground transition active:scale-[0.98]"
              >
                Enregistrer
              </button>
            </li>
          );
        })}
      </ul>
    </MobileShell>
  );
}
