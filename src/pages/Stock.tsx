import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronRight, Filter } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { computeStock, store, useStore } from "@/lib/store";

export default function StockPage() {
  const stock = useStore(computeStock);
  const [q, setQ] = useState("");
  const [filterCategory, setFilterCategory] = useState("Toutes");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Toutes"]);

  // Extraire toutes les catégories uniques des mouvements
  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add("Toutes");
    // Récupérer les catégories depuis les mouvements
    const movements = store.getState().movements;
    movements.forEach((m: any) => {
      if (m.category) cats.add(m.category);
    });
    // Catégories par défaut si aucune dans les mouvements
    if (cats.size === 1) {
      [
        "Matériaux", "Outillage", "Consommables", "EPI", 
        "Quincaillerie", "Peinture", "Électricité", "Plomberie",
        "Bois", "Métallerie", "Visserie", "Sécurité", "Nettoyage", "Divers"
      ].forEach(c => cats.add(c));
    }
    return Array.from(cats);
  }, []);

  // Filtrer et grouper le stock
  const filteredStock = useMemo(() => {
    return stock.filter((s) => {
      const matchesSearch = s.material.name.toLowerCase().includes(q.toLowerCase());
      const matchesCategory = filterCategory === "Toutes" || (s.material as any).category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [stock, q, filterCategory]);

  // Grouper par catégorie
  const groupedByCategory = useMemo(() => {
    const groups: { [key: string]: typeof filteredStock } = {};
    
    if (filterCategory === "Toutes") {
      // Grouper tous les articles par catégorie
      filteredStock.forEach((item) => {
        const cat = (item.material as any).category || "Sans catégorie";
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(item);
      });
    } else {
      // Une seule catégorie sélectionnée
      groups[filterCategory] = filteredStock;
    }
    
    return groups;
  }, [filteredStock, filterCategory]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev =>
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    );
  };

  // Statistiques globales
  const totalStock = filteredStock.reduce((sum, item) => sum + item.stock, 0);
  const lowStockItems = filteredStock.filter(item => item.stock <= 10).length;

  return (
    <MobileShell title="Stock">
      {/* Barre de recherche */}
      <div className="mb-3 flex items-center gap-2 rounded-xl border border-border bg-card px-3 shadow-[var(--shadow-card)]">
        <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un article..."
          className="w-full bg-transparent py-3 text-sm outline-none"
        />
        {q && (
          <button
            onClick={() => setQ("")}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Effacer
          </button>
        )}
      </div>

      {/* Filtre par catégorie */}
      <div className="mb-3 overflow-x-auto">
        <div className="flex gap-1.5 pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                filterCategory === cat
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
              {cat === "Toutes" && ` (${filteredStock.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Résumé rapide */}
      {filteredStock.length > 0 && (
        <div className="mb-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-card border border-border p-2.5">
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Total articles</p>
            <p className="text-lg font-bold text-primary">{filteredStock.length}</p>
          </div>
          <div className={`rounded-xl bg-card border p-2.5 ${lowStockItems > 0 ? "border-destructive/30" : "border-border"}`}>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Stock bas</p>
            <p className={`text-lg font-bold ${lowStockItems > 0 ? "text-destructive" : "text-success"}`}>
              {lowStockItems}
            </p>
          </div>
        </div>
      )}

      {/* Liste groupée par catégories */}
      {Object.keys(groupedByCategory).length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Aucun article trouvé
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(groupedByCategory).map(([category, items]) => {
            const isExpanded = expandedCategories.includes(category);
            const categoryTotal = items.reduce((sum, item) => sum + item.stock, 0);
            const categoryLowStock = items.filter(item => item.stock <= 10).length;

            return (
              <div key={category}>
                {/* En-tête de catégorie */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex w-full items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5 mb-1.5 hover:bg-muted transition"
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-xs font-bold uppercase text-foreground">{category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-muted-foreground">
                      {items.length} article{items.length > 1 ? "s" : ""}
                    </span>
                    {categoryLowStock > 0 && (
                      <span className="rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] font-bold text-destructive">
                        {categoryLowStock} bas
                      </span>
                    )}
                  </div>
                </button>

                {/* Articles de la catégorie */}
                {isExpanded && (
                  <ul className="space-y-1.5 pl-2">
                    {items.map(({ material, in: inQ, out, stock: s }) => {
                      const low = s <= 10;
                      return (
                        <li
                          key={material.id}
                          className={`rounded-xl border bg-card p-3 shadow-sm transition ${
                            low ? "border-destructive/30" : "border-border"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-bold">{material.name}</p>
                                {low && (
                                  <span className="flex-shrink-0 rounded-full bg-destructive/10 px-1.5 py-0.5 text-[9px] font-bold text-destructive">
                                    BAS
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-muted-foreground">
                                Unité : {material.unit}
                                {(material as any).code && ` • Code : ${(material as any).code}`}
                              </p>
                            </div>
                            <div className={`text-right ${low ? "text-destructive" : "text-primary"}`}>
                              <p className="text-2xl font-extrabold leading-none">{s}</p>
                              <p className="text-[10px] font-semibold uppercase tracking-wide">
                                {low ? "Stock bas" : "En stock"}
                              </p>
                            </div>
                          </div>
                          
                          {/* Détails entrées/sorties */}
                          <div className="mt-2 grid grid-cols-2 gap-2 text-center text-xs">
                            <div className="rounded-lg bg-success/10 py-1.5">
                              <span className="font-bold text-success">+{inQ}</span>
                              <span className="ml-1 text-muted-foreground">entrées</span>
                            </div>
                            <div className="rounded-lg bg-accent/10 py-1.5">
                              <span className="font-bold text-accent">-{out}</span>
                              <span className="ml-1 text-muted-foreground">sorties</span>
                            </div>
                          </div>

                          {/* Barre de progression du stock */}
                          <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                low ? "bg-destructive" : s < 30 ? "bg-warning" : "bg-success"
                              }`}
                              style={{ width: `${Math.min((s / 50) * 100, 100)}%` }}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Légende */}
      {filteredStock.length > 0 && (
        <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span>Stock OK</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-warning" />
            <span>Stock moyen</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <span>Stock bas</span>
          </div>
        </div>
      )}
    </MobileShell>
  );
}