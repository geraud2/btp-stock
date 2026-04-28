import { useState } from "react";
import { Camera, User, Mail, Phone, MapPin, Briefcase, Shield, Save, X, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/MobileShell";
import { store, useStore } from "@/lib/store";

export default function ProfilPage() {
  const user = useStore((s) => s.user);
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    site: user?.site ?? "",
    role: user?.role ?? "Magasinier",
    photo: user?.photo ?? null as string | null,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Le nom et l'email sont obligatoires");
      return;
    }
    
    // Mettre à jour l'utilisateur dans le store
    store.updateUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      site: formData.site.trim(),
      role: formData.role,
      photo: formData.photo,
    } as any);
    
    toast.success("Profil mis à jour");
    setIsEditing(false);
  };

  const handleLogout = () => {
    store.logout();
    toast.success("Déconnexion réussie");
    navigate("/login");
  };

  return (
    <MobileShell title="Mon Profil">
      <div className="space-y-4">
        {/* Photo de profil */}
        <div className="flex flex-col items-center">
          <div className="relative mb-3">
            {formData.photo ? (
              <div className="relative">
                <img
                  src={formData.photo}
                  alt="Photo de profil"
                  className="h-24 w-24 rounded-full object-cover border-4 border-primary/20 shadow-lg"
                />
                {isEditing && (
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, photo: null }))}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ) : (
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center border-4 border-primary/20 shadow-lg">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer shadow-lg hover:bg-primary/90 transition">
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          
          {!isEditing && (
            <div className="text-center">
              <h2 className="text-lg font-bold">{user?.name ?? "Utilisateur"}</h2>
              <p className="text-sm text-muted-foreground">{user?.role ?? "Magasinier"}</p>
            </div>
          )}
        </div>

        {/* Formulaire du profil */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wide">Informations personnelles</h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-medium text-primary hover:underline"
              >
                Modifier
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Annuler
              </button>
            )}
          </div>

          <div className="space-y-3">
            {/* Nom */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <User className="inline h-3 w-3 mr-1" /> Nom complet
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Votre nom"
                />
              ) : (
                <p className="text-sm font-medium py-2.5">{formData.name || "Non renseigné"}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Mail className="inline h-3 w-3 mr-1" /> Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="exemple@email.com"
                />
              ) : (
                <p className="text-sm font-medium py-2.5">{formData.email || "Non renseigné"}</p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Phone className="inline h-3 w-3 mr-1" /> Téléphone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="+33 6 12 34 56 78"
                />
              ) : (
                <p className="text-sm font-medium py-2.5">{formData.phone || "Non renseigné"}</p>
              )}
            </div>

            {/* Site / Chantier */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <MapPin className="inline h-3 w-3 mr-1" /> Site / Chantier
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.site}
                  onChange={(e) => setFormData(prev => ({ ...prev, site: e.target.value }))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Ex : Chantier Nord"
                />
              ) : (
                <p className="text-sm font-medium py-2.5">{formData.site || "Non renseigné"}</p>
              )}
            </div>

            {/* Rôle */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Briefcase className="inline h-3 w-3 mr-1" /> Rôle
              </label>
              {isEditing ? (
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Magasinier">Magasinier</option>
                  <option value="Chef de chantier">Chef de chantier</option>
                  <option value="Conducteur de travaux">Conducteur de travaux</option>
                  <option value="Administrateur">Administrateur</option>
                </select>
              ) : (
                <p className="text-sm font-medium py-2.5">{formData.role || "Non renseigné"}</p>
              )}
            </div>
          </div>

          {/* Bouton Sauvegarder */}
          {isEditing && (
            <button
              onClick={handleSave}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-card)] transition active:scale-[0.98]"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Save className="h-4 w-4" />
              Enregistrer les modifications
            </button>
          )}
        </div>

        {/* Sécurité */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide flex items-center gap-2">
            <Shield className="h-4 w-4" /> Sécurité
          </h3>
          
          <button
            onClick={() => toast.info("Fonctionnalité à venir")}
            className="w-full mb-2 rounded-xl border border-border bg-background px-3 py-3 text-sm text-left hover:bg-muted/50 transition"
          >
            Modifier le mot de passe
          </button>
          
          <button
            onClick={() => toast.info("Fonctionnalité à venir")}
            className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-left hover:bg-muted/50 transition"
          >
            Paramètres de notification
          </button>
        </div>

        {/* Statistiques personnelles */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Mon activité</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-muted/50 p-3 text-center">
              <p className="text-2xl font-bold text-primary">--</p>
              <p className="text-[10px] text-muted-foreground">Mouvements ce mois</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3 text-center">
              <p className="text-2xl font-bold text-primary">--</p>
              <p className="text-[10px] text-muted-foreground">Transferts envoyés</p>
            </div>
          </div>
        </div>

        {/* Déconnexion */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 py-3.5 text-sm font-bold text-destructive transition hover:bg-destructive/10 active:scale-[0.98]"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </button>

        <p className="text-center text-[10px] text-muted-foreground pb-8">
          BTP Stock Manager v1.0.0
        </p>
      </div>
    </MobileShell>
  );
}