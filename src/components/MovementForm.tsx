import { useState } from "react";
import { toast } from "sonner";
import { store, useStore } from "@/lib/store";

export function MovementForm({ type }: { type: "in" | "out" }) {
  const materials = useStore((s) => s.materials);
  const [materialId, setMaterialId] = useState(materials[0]?.id ?? "");
  const [qty, setQty] = useState("");
  const [party, setParty] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = Number(qty);
    if (!materialId || !q || q <= 0 || !party.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    store.addMovement({ type, materialId, qty: q, party: party.trim(), date, note: note.trim() || undefined });
    toast.success(type === "in" ? "Entrée enregistrée" : "Sortie enregistrée");
    setQty("");
    setParty("");
    setNote("");
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <Field label="Matériau">
        <select
          value={materialId}
          onChange={(e) => setMaterialId(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          {materials.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.unit})
            </option>
          ))}
        </select>
      </Field>
      <Field label="Quantité">
        <input
          type="number"
          inputMode="decimal"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder="0"
        />
      </Field>
      <Field label={type === "in" ? "Fournisseur" : "Destinataire"}>
        <input
          value={party}
          onChange={(e) => setParty(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder={type === "in" ? "Nom fournisseur" : "Équipe / personne"}
        />
      </Field>
      <Field label="Date">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </Field>
      <Field label="Observation">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder="Optionnel"
        />
      </Field>
      <button
        type="submit"
        className="w-full rounded-xl py-4 text-sm font-bold uppercase tracking-wide text-accent-foreground shadow-[var(--shadow-card)] transition active:scale-[0.98]"
        style={{ background: "var(--gradient-accent)" }}
      >
        Valider
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
