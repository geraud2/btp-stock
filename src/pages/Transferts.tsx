import { useState } from "react";
import { Check, X, Send, Inbox } from "lucide-react";
import { toast } from "sonner";
import { MobileShell } from "@/components/MobileShell";
import { store, useStore } from "@/lib/store";

export default function TransfertsPage() {
  const [tab, setTab] = useState<"send" | "receive">("send");
  const materials = useStore((s) => s.materials);
  const transfers = useStore((s) => s.transfers);

  const [materialId, setMaterialId] = useState(materials[0]?.id ?? "");
  const [toSite, setToSite] = useState("");
  const [qty, setQty] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = Number(qty);
    if (!materialId || !q || q <= 0 || !toSite.trim()) {
      toast.error("Champs requis");
      return;
    }
    store.addOutgoingTransfer({ materialId, toSite: toSite.trim(), qty: q, date, note: note.trim() || undefined });
    toast.success("Transfert envoyé");
    setQty("");
    setToSite("");
    setNote("");
  };

  const incoming = transfers.filter((t) => t.direction === "incoming");
  const outgoing = transfers.filter((t) => t.direction === "outgoing");

  return (
    <MobileShell title="Transferts">
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1">
        <button
          onClick={() => setTab("send")}
          className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wide transition ${
            tab === "send" ? "bg-card text-primary shadow" : "text-muted-foreground"
          }`}
        >
          <Send className="h-4 w-4" /> Envoyer
        </button>
        <button
          onClick={() => setTab("receive")}
          className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wide transition ${
            tab === "receive" ? "bg-card text-primary shadow" : "text-muted-foreground"
          }`}
        >
          <Inbox className="h-4 w-4" /> Recevoir
          {incoming.filter((t) => t.status === "pending").length > 0 && (
            <span className="ml-1 rounded-full bg-accent px-1.5 text-[10px] text-accent-foreground">
              {incoming.filter((t) => t.status === "pending").length}
            </span>
          )}
        </button>
      </div>

      {tab === "send" ? (
        <>
          <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
            <Field label="Chantier destination">
              <input
                value={toSite}
                onChange={(e) => setToSite(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ex: Chantier Nord"
              />
            </Field>
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
              className="w-full rounded-xl py-4 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-card)] transition active:scale-[0.98]"
              style={{ background: "var(--gradient-primary)" }}
            >
              Envoyer le transfert
            </button>
          </form>

          {outgoing.length > 0 && (
            <section className="mt-5">
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Mes envois</h2>
              <ul className="space-y-2">
                {outgoing.map((t) => {
                  const mat = materials.find((m) => m.id === t.materialId);
                  return (
                    <li key={t.id} className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-semibold">{mat?.name}</p>
                          <p className="text-xs text-muted-foreground">→ {t.toSite}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">{t.qty} {mat?.unit}</p>
                          <StatusPill status={t.status} />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </>
      ) : (
        <ul className="space-y-3">
          {incoming.length === 0 && (
            <li className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Aucun transfert à recevoir
            </li>
          )}
          {incoming.map((t) => {
            const mat = materials.find((m) => m.id === t.materialId);
            const pending = t.status === "pending";
            return (
              <li key={t.id} className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-base font-bold">{mat?.name}</p>
                    <p className="text-xs text-muted-foreground">De: <span className="font-semibold text-foreground">{t.fromSite}</span></p>
                    {t.note && <p className="mt-1 text-xs text-muted-foreground">{t.note}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-primary">{t.qty}</p>
                    <p className="text-[10px] text-muted-foreground">{mat?.unit}</p>
                  </div>
                </div>
                {pending ? (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        store.setTransferStatus(t.id, "refused");
                        toast.error("Transfert refusé");
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-destructive/40 py-3 text-sm font-semibold text-destructive transition active:scale-[0.97]"
                    >
                      <X className="h-4 w-4" /> Refuser
                    </button>
                    <button
                      onClick={() => {
                        store.setTransferStatus(t.id, "confirmed");
                        toast.success("Réception confirmée");
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-success py-3 text-sm font-bold text-success-foreground transition active:scale-[0.97]"
                    >
                      <Check className="h-4 w-4" /> Confirmer
                    </button>
                  </div>
                ) : (
                  <div className="mt-3"><StatusPill status={t.status} /></div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </MobileShell>
  );
}

function StatusPill({ status }: { status: "pending" | "confirmed" | "refused" }) {
  const map = {
    pending: { label: "En attente", cls: "bg-warning/20 text-warning-foreground" },
    confirmed: { label: "Confirmé", cls: "bg-success/20 text-success" },
    refused: { label: "Refusé", cls: "bg-destructive/20 text-destructive" },
  } as const;
  const s = map[status];
  return <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${s.cls}`}>{s.label}</span>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
