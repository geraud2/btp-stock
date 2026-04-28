import { useSyncExternalStore } from "react";

export type Material = {
  id: string;
  name: string;
  unit: string;
  category?: string;
  code?: string;
};

export type Movement = {
  id: string;
  type: "in" | "out";
  materialId: string;
  qty: number;
  party: string;
  date: string;
  note?: string;
  bordereauNumber?: string;
  category?: string;
  codeArticle?: string;
  bordereauPhoto?: string | null;
  articlePhoto?: string | null;
};

export type Transfer = {
  id: string;
  materialId: string;
  qty: number;
  fromSite: string;
  toSite: string;
  date: string;
  note?: string;
  category?: string;
  transferPhoto?: string | null;
  articlePhoto?: string | null;
  status: "pending" | "confirmed" | "refused";
  direction: "outgoing" | "incoming";
};

export type InventoryEntry = {
  materialId: string;
  realQty: number;
  note?: string;
  date: string;
};

export type User = {
  name: string;
  site: string;
  email?: string;
  phone?: string;
  role?: string;
  photo?: string | null;
};

type State = {
  user: User | null;
  materials: Material[];
  movements: Movement[];
  transfers: Transfer[];
  inventory: InventoryEntry[];
};

const initialMaterials: Material[] = [
  { id: "m1", name: "Ciment CPJ 42.5", unit: "sac", category: "Matériaux", code: "CIM-001" },
  { id: "m2", name: "Sable 0/4", unit: "m³", category: "Matériaux", code: "SAB-001" },
  { id: "m3", name: "Gravier 5/15", unit: "m³", category: "Matériaux", code: "GRA-001" },
  { id: "m4", name: "Fer à béton Ø12", unit: "barre", category: "Métallerie", code: "FER-012" },
  { id: "m5", name: "Parpaing 20", unit: "u", category: "Matériaux", code: "PAR-020" },
  { id: "m6", name: "Brique creuse", unit: "u", category: "Matériaux", code: "BRI-001" },
  { id: "m7", name: "Carreaux 60x60", unit: "m²", category: "Revêtement", code: "CAR-060" },
  { id: "m8", name: "Peinture blanc mat", unit: "L", category: "Peinture", code: "PEI-001" },
  { id: "m9", name: "Câble électrique 3G2.5", unit: "m", category: "Électricité", code: "ELE-001" },
  { id: "m10", name: "Tube PVC Ø100", unit: "m", category: "Plomberie", code: "PLO-001" },
  { id: "m11", name: "Vis à bois 4x40", unit: "boîte", category: "Visserie", code: "VIS-001" },
  { id: "m12", name: "Gants de protection", unit: "paire", category: "EPI", code: "EPI-001" },
  { id: "m13", name: "Perceuse visseuse", unit: "u", category: "Outillage", code: "OUT-001" },
  { id: "m14", name: "Chevron 63x75", unit: "m", category: "Bois", code: "BOI-001" },
];

const today = new Date().toISOString().slice(0, 10);

const state: State = {
  user: {
    name: "Jean Dupont",
    site: "Chantier Centre",
    email: "jean.dupont@btp.fr",
    phone: "+33 6 12 34 56 78",
    role: "Magasinier",
    photo: null,
  },
  materials: initialMaterials,
  movements: [
    {
      id: "mv1",
      type: "in",
      materialId: "m1",
      qty: 200,
      party: "Cimenterie SA",
      date: today,
      note: "Livraison initiale",
      bordereauNumber: "B-2024-001",
      category: "Matériaux",
      codeArticle: "CIM-001",
    },
    {
      id: "mv2",
      type: "in",
      materialId: "m2",
      qty: 30,
      party: "Carrière Nord",
      date: today,
      bordereauNumber: "B-2024-002",
      category: "Matériaux",
      codeArticle: "SAB-001",
    },
    {
      id: "mv3",
      type: "out",
      materialId: "m1",
      qty: 35,
      party: "Équipe Maçonnerie",
      date: today,
      note: "Pour ordre : Chef chantier",
      bordereauNumber: "S-2024-001",
      category: "Matériaux",
      codeArticle: "CIM-001",
    },
    {
      id: "mv4",
      type: "in",
      materialId: "m4",
      qty: 120,
      party: "Aciérie BTP",
      date: today,
      bordereauNumber: "B-2024-003",
      category: "Métallerie",
      codeArticle: "FER-012",
    },
    {
      id: "mv5",
      type: "out",
      materialId: "m4",
      qty: 18,
      party: "Équipe Ferraillage",
      date: today,
      bordereauNumber: "S-2024-002",
      category: "Métallerie",
      codeArticle: "FER-012",
    },
  ],
  transfers: [
    {
      id: "t1",
      materialId: "m5",
      qty: 150,
      fromSite: "Chantier Nord",
      toSite: "Chantier Centre",
      date: today,
      status: "pending",
      direction: "incoming",
      note: "Renfort gros œuvre",
      category: "Matériaux",
      transferPhoto: null,
      articlePhoto: null,
    },
    {
      id: "t2",
      materialId: "m3",
      qty: 5,
      fromSite: "Chantier Centre",
      toSite: "Chantier Sud",
      date: today,
      status: "pending",
      direction: "outgoing",
      category: "Matériaux",
      transferPhoto: null,
      articlePhoto: null,
    },
  ],
  inventory: [],
};

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export const store = {
  getState: () => state,
  
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },

  login: (name: string, password?: string) => {
    state.user = {
      name,
      site: "Chantier Centre",
      email: "",
      phone: "",
      role: "Magasinier",
      photo: null,
    };
    notify();
  },

  logout: () => {
    state.user = null;
    notify();
  },

  updateUser: (userData: Partial<User>) => {
    if (state.user) {
      state.user = { ...state.user, ...userData };
      notify();
    }
  },

  addMovement: (m: Omit<Movement, "id">) => {
    const newMovement: Movement = {
      ...m,
      id: crypto.randomUUID(),
    };
    state.movements = [newMovement, ...state.movements];
    notify();
  },

  addOutgoingTransfer: (t: Omit<Transfer, "id" | "status" | "direction" | "fromSite">) => {
    const newTransfer: Transfer = {
      ...t,
      id: crypto.randomUUID(),
      status: "pending",
      direction: "outgoing",
      fromSite: state.user?.site ?? "Chantier Centre",
    };
    state.transfers = [newTransfer, ...state.transfers];
    notify();
  },

  setTransferStatus: (id: string, status: "confirmed" | "refused") => {
    state.transfers = state.transfers.map((t) =>
      t.id === id ? { ...t, status } : t
    );
    
    if (status === "confirmed") {
      const t = state.transfers.find((x) => x.id === id);
      if (t && t.direction === "incoming") {
        const newMovement: Movement = {
          id: crypto.randomUUID(),
          type: "in",
          materialId: t.materialId,
          qty: t.qty,
          party: `Transfert depuis ${t.fromSite}`,
          date: t.date,
          note: "Réception transfert confirmé",
          category: t.category,
          codeArticle: "",
          bordereauNumber: `TR-${t.id.slice(0, 8)}`,
          bordereauPhoto: t.transferPhoto,
          articlePhoto: t.articlePhoto,
        };
        state.movements = [newMovement, ...state.movements];
      }
    }
    notify();
  },

  saveInventory: (entry: InventoryEntry) => {
    state.inventory = [
      entry,
      ...state.inventory.filter((e) => e.materialId !== entry.materialId),
    ];
    notify();
  },

  addMaterial: (material: Omit<Material, "id">) => {
    const newMaterial: Material = {
      ...material,
      id: crypto.randomUUID(),
    };
    state.materials = [...state.materials, newMaterial];
    notify();
  },

  updateMaterial: (id: string, updates: Partial<Material>) => {
    state.materials = state.materials.map((m) =>
      m.id === id ? { ...m, ...updates } : m
    );
    notify();
  },

  deleteMaterial: (id: string) => {
    state.materials = state.materials.filter((m) => m.id !== id);
    notify();
  },
};

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState()),
  );
}

// Cache pour le calcul du stock
let _stockCache: {
  movements: Movement[];
  materials: Material[];
  result: ReturnType<typeof _computeStock>;
} | null = null;

function _computeStock(state: State) {
  const map = new Map<string, { in: number; out: number }>();
  
  state.materials.forEach((m) => map.set(m.id, { in: 0, out: 0 }));
  
  state.movements.forEach((mv) => {
    const e = map.get(mv.materialId);
    if (!e) return;
    if (mv.type === "in") {
      e.in += mv.qty;
    } else {
      e.out += mv.qty;
    }
  });
  
  return state.materials.map((m) => {
    const e = map.get(m.id)!;
    return {
      material: m,
      in: e.in,
      out: e.out,
      stock: e.in - e.out,
    };
  });
}

export function computeStock(state: State) {
  if (
    _stockCache &&
    _stockCache.movements === state.movements &&
    _stockCache.materials === state.materials
  ) {
    return _stockCache.result;
  }
  const result = _computeStock(state);
  _stockCache = { movements: state.movements, materials: state.materials, result };
  return result;
}