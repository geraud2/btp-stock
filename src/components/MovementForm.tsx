import { useState } from "react";
import { toast } from "sonner";
import { Camera, X } from "lucide-react";
import { store, useStore } from "@/lib/store";

export function MovementForm({ type }: { type: "in" | "out" }) {
  const materials = useStore((s) => s.materials);
  const [materialId, setMaterialId] = useState(materials[0]?.id ?? "");
  const [qty, setQty] = useState("");
  const [party, setParty] = useState("");
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [bordereauNumber, setBordereauNumber] = useState("");
  const [category, setCategory] = useState("");
  const [codeArticle, setCodeArticle] = useState("");
  const [note, setNote] = useState("");
  const [bordereauPhoto, setBordereauPhoto] = useState<string | null>(null);
  const [articlePhoto, setArticlePhoto] = useState<string | null>(null);

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
    if (!materialId || !q || q <= 0 || !party.trim() || !dateTime || !bordereauNumber.trim() || !category.trim() || !codeArticle.trim()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // Formater la date avec l'heure
    const formattedDateTime = new Date(dateTime).toISOString();
    
    store.addMovement({
      type,
      materialId,
      qty: q,
      party: party.trim(),
      date: formattedDateTime,
      bordereauNumber: bordereauNumber.trim(),
      category: category.trim(),
      codeArticle: codeArticle.trim(),
      note: note.trim() || undefined,
      bordereauPhoto,
      articlePhoto,
    } as any);
    
    toast.success(type === "in" ? "Entrée enregistrée" : "Consommation enregistrée");
    
    // Réinitialiser le formulaire
    setQty("");
    setParty("");
    setBordereauNumber("");
    setCategory("");
    setCodeArticle("");
    setNote("");
    setBordereauPhoto(null);
    setArticlePhoto(null);
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      {/* Date et Heure */}
      <Field label="Date et heure" required>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </Field>

      {/* N° Bordereau */}
      <Field label="N° Bordereau" required>
        <input
          type="text"
          value={bordereauNumber}
          onChange={(e) => setBordereauNumber(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder="Ex. : B-2024-001"
        />
      </Field>

      {/* Catégorie d'article */}
      <Field label="Catégorie d'article" required>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Sélectionner une catégorie</option>
          <option value="Materiaux">Matériaux</option>
          <option value="Outillage">Outillage</option>
          <option value="Consommables">Consommables</option>
          <option value="EPI">EPI</option>
          <option value="Quincaillerie">Quincaillerie</option>
          <option value="Peinture">Peinture</option>
          <option value="Electricite">Électricité</option>
          <option value="Plomberie">Plomberie</option>
          <option value="Bois">Bois</option>
          <option value="Metallerie">Métallerie</option>
        </select>
      </Field>

      {/* Code Article */}
      <Field label="Code article" required>
        <input
          type="text"
          value={codeArticle}
          onChange={(e) => setCodeArticle(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder="Ex. : MAT-001"
        />
      </Field>

      {/* Article */}
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

      {/* Quantité */}
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

      {/* Fournisseur (entrée) ou Pour ordre (sortie) */}
      <Field label={type === "in" ? "Fournisseur" : "Pour ordre"} required>
        <input
          value={party}
          onChange={(e) => setParty(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder={type === "in" ? "Nom du fournisseur" : "Nom du demandeur"}
        />
      </Field>

      {/* Photos */}
      <div className="space-y-3">
        {/* Photo du bordereau */}
        <Field label="Photo du bordereau">
          <div className="relative">
            {bordereauPhoto ? (
              <div className="relative rounded-xl overflow-hidden">
                <img src={bordereauPhoto} alt="Bordereau" className="w-full h-40 object-cover" />
                <button
                  type="button"
                  onClick={() => setBordereauPhoto(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl bg-background cursor-pointer hover:border-ring transition">
                <Camera className="h-8 w-8 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Ajouter une photo</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleImageUpload(e, setBordereauPhoto)}
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
                <span className="text-xs text-muted-foreground">Ajouter une photo</span>
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

      {/* Observation */}
      <Field label="Observation">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder="Optionnel"
        />
      </Field>

      {/* Bouton Valider */}
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