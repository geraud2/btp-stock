import { MobileShell } from "@/components/MobileShell";
import { MovementForm } from "@/components/MovementForm";

export default function EntreesPage() {
  return (
    <MobileShell title="Nouvelle entrée">
      <p className="mb-3 text-xs text-muted-foreground">Enregistrer une réception de matériau au magasin.</p>
      <MovementForm type="in" />
    </MobileShell>
  );
}
