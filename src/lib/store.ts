import { useSyncExternalStore } from "react";

export type Material = { id: string; name: string; unit: string };

export type Movement = {
  id: string;
  type: "in" | "out";
  materialId: string;
  qty: number;
  party: string; // fournisseur ou destinataire
  date: string;
  note?: string;
};

export type Transfer = {
  id: string;
  materialId: string;
  qty: number;
  fromSite: string;
  toSite: string;
  date: string;
  note?: string;
  status: "pending" | "confirmed" | "refused";
  direction: "outgoing" | "incoming";
};

export type InventoryEntry = {
  materialId: string;
  realQty: number;
  note?: string;
  date: string;
};

type State = {
  user: { name: string; site: string } | null;
  materials: Material[];
  movements: Movement[];
  transfers: Transfer[];
  inventory: InventoryEntry[];
};

const initialMaterials: Material[] = [
  { id: "m1", name: "Ciment CPJ 42.5", unit: "sac" },
  { id: "m2", name: "Sable 0/4", unit: "m³" },
  { id: "m3", name: "Gravier 5/15", unit: "m³" },
  { id: "m4", name: "Fer à béton Ø12", unit: "barre" },
  { id: "m5", name: "Parpaing 20", unit: "u" },
  { id: "m6", name: "Brique creuse", unit: "u" },
  { id: "m7", name: "Carreaux 60x60", unit: "m²" },
];

const today = new Date().toISOString().slice(0, 10);

const state: State = {
  user: null,
  materials: initialMaterials,
  movements: [
    { id: "mv1", type: "in", materialId: "m1", qty: 200, party: "Cimenterie SA", date: today, note: "Livraison initiale" },
    { id: "mv2", type: "in", materialId: "m2", qty: 30, party: "Carrière Nord", date: today },
    { id: "mv3", type: "out", materialId: "m1", qty: 35, party: "Équipe Maçonnerie", date: today },
    { id: "mv4", type: "in", materialId: "m4", qty: 120, party: "Aciérie BTP", date: today },
    { id: "mv5", type: "out", materialId: "m4", qty: 18, party: "Équipe Ferraillage", date: today },
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
  login: (name: string) => {
    state.user = { name, site: "Chantier Centre" };
    notify();
  },
  logout: () => {
    state.user = null;
    notify();
  },
  addMovement: (m: Omit<Movement, "id">) => {
    state.movements = [{ ...m, id: crypto.randomUUID() }, ...state.movements];
    notify();
  },
  addOutgoingTransfer: (t: Omit<Transfer, "id" | "status" | "direction" | "fromSite">) => {
    state.transfers = [
      {
        ...t,
        id: crypto.randomUUID(),
        status: "pending",
        direction: "outgoing",
        fromSite: state.user?.site ?? "Chantier Centre",
      },
      ...state.transfers,
    ];
    notify();
  },
  setTransferStatus: (id: string, status: "confirmed" | "refused") => {
    state.transfers = state.transfers.map((t) => (t.id === id ? { ...t, status } : t));
    if (status === "confirmed") {
      const t = state.transfers.find((x) => x.id === id);
      if (t && t.direction === "incoming") {
        state.movements = [
          {
            id: crypto.randomUUID(),
            type: "in",
            materialId: t.materialId,
            qty: t.qty,
            party: `Transfert ${t.fromSite}`,
            date: t.date,
            note: "Réception transfert",
          },
          ...state.movements,
        ];
      }
    }
    notify();
  },
  saveInventory: (entry: InventoryEntry) => {
    state.inventory = [entry, ...state.inventory.filter((e) => e.materialId !== entry.materialId)];
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

let _stockCache: { movements: Movement[]; materials: Material[]; result: ReturnType<typeof _computeStock> } | null = null;

function _computeStock(state: State) {
  const map = new Map<string, { in: number; out: number }>();
  state.materials.forEach((m) => map.set(m.id, { in: 0, out: 0 }));
  state.movements.forEach((mv) => {
    const e = map.get(mv.materialId);
    if (!e) return;
    if (mv.type === "in") e.in += mv.qty;
    else e.out += mv.qty;
  });
  return state.materials.map((m) => {
    const e = map.get(m.id)!;
    return { material: m, in: e.in, out: e.out, stock: e.in - e.out };
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

