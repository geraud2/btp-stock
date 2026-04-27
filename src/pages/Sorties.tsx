import { MobileShell } from "@/components/MobileShell";
import { MovementForm } from "@/components/MovementForm";

export default function SortiesPage() {
  return (
    <MobileShell title="Nouvelle sortie">
      <p className="mb-3 text-xs text-muted-foreground">Enregistrer une sortie de matériau du magasin.</p>
      <MovementForm type="out" />
    </MobileShell>
  );
}
