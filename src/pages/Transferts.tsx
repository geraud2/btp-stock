import { useState } from "react";
import { Check, X, Send, Inbox, Camera } from "lucide-react";
import { toast } from "sonner";
import { MobileShell } from "@/components/MobileShell";
import { store, useStore } from "@/lib/store";

export default function TransfertsPage() {
  const [tab, setTab] = useState<"send" | "receive">("send");
  const materials = useStore((s) => s.materials);
  const transfers = useStore((s) => s.transfers);

  // Champs du formulaire
  const [siteId, setSiteId] = useState("");
  const [category, setCategory] = useState("");
  const [materialId, setMaterialId] = useState(materials[0]?.id ?? "");
  const [qty, setQty] = useState("");
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [note, setNote] = useState("");
  const [transferPhoto, setTransferPhoto] = useState<string | null>(null);
  const [articlePhoto, setArticlePhoto] = useState<string | null>(null);

  // Liste des chantiers
  const sites = [
    { id: "chantier-a", name: "Chantier A - Nord" },
    { id: "chantier-b", name: "Chantier B - Sud" },
    { id: "chantier-c", name: "Chantier C - Est" },
    { id: "chantier-d", name: "Chantier D - Ouest" },
    { id: "entrepot", name: "Entrepôt Central" },
  ];

  // Catégories corrigées
  const categories = [
    "Matériaux",
    "Outillage",
    "Consommables",
    "EPI",
    "Quincaillerie",
    "Peinture",
    "Électricité",
    "Plomberie",
    "Bois",
    "Métallerie",
    "Visserie",
    "Sécurité",
    "Nettoyage",
    "Divers",
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = Number(qty);
    if (!siteId || !category || !materialId || !q || q <= 0) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    const selectedSite = sites.find(s => s.id === siteId);
    const formattedDateTime = new Date(dateTime).toISOString();
    
    store.addOutgoingTransfer({
      materialId,
      toSite: selectedSite?.name ?? siteId,
      qty: q,
      date: formattedDateTime,
      category: category,
      note: note.trim() || undefined,
      transferPhoto,
      articlePhoto,
    } as any);
    
    toast.success("Transfert envoyé");
    setQty("");
    setCategory("");
    setSiteId("");
    setNote("");
    setTransferPhoto(null);
    setArticlePhoto(null);
  };

  const incoming = transfers.filter((t) => t.direction === "incoming");
  const outgoing = transfers.filter((t) => t.direction === "outgoing");

  return (
    <MobileShell title="Transferts">
      {/* Tabs Envoyer / Recevoir */}
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
            {/* 1. Chantier destination */}
            <Field label="Chantier destination" required>
              <select
                value={siteId}
                onChange={(e) => setSiteId(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Sélectionner un chantier</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </Field>

            {/* 2. Catégorie d'article */}
            <Field label="Catégorie d'article" required>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </Field>

            {/* 3. Article */}
            <Field label="Article" required>
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

            {/* 4. Quantité */}
            <Field label="Quantité" required>
              <input
                type="number"
                inputMode="decimal"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="0"
              />
            </Field>

            {/* 5. Date et heure */}
            <Field label="Date et heure" required>
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>

            {/* 6. Photos */}
            <div className="space-y-3">
              {/* Photo du matériel à transférer */}
              <Field label="Photo du matériel à transférer">
                <div className="relative">
                  {transferPhoto ? (
                    <div className="relative rounded-xl overflow-hidden">
                      <img src={transferPhoto} alt="Matériel à transférer" className="w-full h-40 object-cover" />
                      <button
                        type="button"
                        onClick={() => setTransferPhoto(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl bg-background cursor-pointer hover:border-ring transition">
                      <Camera className="h-8 w-8 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">Photo du matériel</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => handleImageUpload(e, setTransferPhoto)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </Field>

              {/* Photo de l'article */}
              <Field label="Photo de l'article">
                <div className="relative">
                  {articlePhoto ? (
                    <div className="relative rounded-xl overflow-hidden">
                      <img src={articlePhoto} alt="Article" className="w-full h-40 object-cover" />
                      <button
                        type="button"
                        onClick={() => setArticlePhoto(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl bg-background cursor-pointer hover:border-ring transition">
                      <Camera className="h-8 w-8 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">Photo de l'article</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => handleImageUpload(e, setArticlePhoto)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </Field>
            </div>

            {/* 7. Observation */}
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

          {/* Liste des envois */}
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
                          {(t as any).category && (
                            <p className="text-[10px] text-muted-foreground">Catégorie : {(t as any).category}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">{t.qty} {mat?.unit}</p>
                          <StatusPill status={t.status} />
                        </div>
                      </div>
                      {/* Afficher les photos dans l'historique si présentes */}
                      {(t as any).transferPhoto && (
                        <div className="mt-2">
                          <img src={(t as any).transferPhoto} alt="Transfert" className="w-full h-24 object-cover rounded-lg" />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </>
      ) : (
        /* Liste des réceptions */
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
                    <p className="text-xs text-muted-foreground">De : <span className="font-semibold text-foreground">{t.fromSite}</span></p>
                    {(t as any).category && (
                      <p className="text-[10px] text-muted-foreground">Catégorie : {(t as any).category}</p>
                    )}
                    {t.note && <p className="mt-1 text-xs text-muted-foreground">{t.note}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-primary">{t.qty}</p>
                    <p className="text-[10px] text-muted-foreground">{mat?.unit}</p>
                  </div>
                </div>
                
                {/* Afficher les photos dans les réceptions */}
                {(t as any).transferPhoto && (
                  <div className="mt-2">
                    <img src={(t as any).transferPhoto} alt="Transfert" className="w-full h-24 object-cover rounded-lg" />
                  </div>
                )}
                
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

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}