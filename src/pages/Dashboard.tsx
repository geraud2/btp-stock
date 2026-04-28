import { Link } from "react-router-dom";
import { 
  ChevronRight,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  Star,
  Settings,
  User,
} from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { computeStock, useStore } from "@/lib/store";

// Illustrations SVG modernes et élégantes
const ModernIllustrations = {
  StatsCard1: ({ color }: { color: string }) => (
    <svg viewBox="0 0 80 80" className="h-16 w-16">
      <circle cx="40" cy="40" r="35" fill={color} opacity="0.1"/>
      <circle cx="40" cy="40" r="25" fill={color} opacity="0.2"/>
      <path d="M40 25 L40 40 L55 50" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="40" cy="40" r="3" fill={color}/>
      <circle cx="40" cy="25" r="4" fill={color}/>
    </svg>
  ),

  StatsCard2: ({ color }: { color: string }) => (
    <svg viewBox="0 0 80 80" className="h-16 w-16">
      <rect x="15" y="25" width="20" height="30" rx="4" fill={color} opacity="0.15"/>
      <rect x="40" y="35" width="20" height="20" rx="4" fill={color} opacity="0.3"/>
      <rect x="15" y="22" width="20" height="4" rx="2" fill={color} opacity="0.5"/>
      <rect x="40" y="32" width="20" height="4" rx="2" fill={color} opacity="0.5"/>
    </svg>
  ),

  ActivityChart: () => (
    <svg viewBox="0 0 120 40" className="h-10 w-full">
      <path d="M0 35 L15 30 L30 20 L45 25 L60 10 L75 15 L90 5 L105 12 L120 8" 
            stroke="url(#chartGrad)" 
            strokeWidth="3" 
            fill="none" 
            strokeLinecap="round"/>
      <defs>
        <linearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1"/>
          <stop offset="100%" stopColor="#8b5cf6"/>
        </linearGradient>
      </defs>
    </svg>
  ),

  TransferIcon: () => (
    <svg viewBox="0 0 80 80" className="h-16 w-16">
      <circle cx="25" cy="40" r="15" fill="#3b82f6" opacity="0.15"/>
      <circle cx="55" cy="40" r="15" fill="#6366f1" opacity="0.15"/>
      <path d="M40 30 L40 50" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
      <path d="M33 35 L40 28 L47 35" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M40 50 L40 30" stroke="#6366f1" strokeWidth="3" strokeLinecap="round"/>
      <path d="M33 45 L40 52 L47 45" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  ProfileCard: () => (
    <svg viewBox="0 0 80 80" className="h-16 w-16">
      <circle cx="40" cy="30" r="18" fill="url(#profileGrad)"/>
      <ellipse cx="40" cy="65" rx="25" ry="12" fill="url(#profileGrad)" opacity="0.3"/>
      <circle cx="33" cy="27" r="2.5" fill="white"/>
      <circle cx="47" cy="27" r="2.5" fill="white"/>
      <path d="M35 35 Q40 40 45 35" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <defs>
        <linearGradient id="profileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6"/>
          <stop offset="100%" stopColor="#ec4899"/>
        </linearGradient>
      </defs>
    </svg>
  ),

  EmptyBox: () => (
    <svg viewBox="0 0 100 100" className="h-20 w-20">
      <rect x="20" y="40" width="60" height="45" rx="12" fill="#e2e8f0" opacity="0.5"/>
      <rect x="32" y="52" width="36" height="22" rx="6" fill="#cbd5e1" opacity="0.5"/>
      <path d="M50 20 L30 40" stroke="#94a3b8" strokeWidth="2" opacity="0.5"/>
      <path d="M50 20 L70 40" stroke="#94a3b8" strokeWidth="2" opacity="0.5"/>
      <circle cx="50" cy="18" r="4" fill="#94a3b8" opacity="0.5"/>
    </svg>
  ),

  BuildingIcon: () => (
    <svg viewBox="0 0 200 120" className="h-full w-full" fill="none">
      {/* Bâtiment principal */}
      <rect x="20" y="40" width="160" height="80" rx="4" fill="url(#buildingGrad)" opacity="0.15"/>
      <rect x="30" y="50" width="140" height="60" rx="2" fill="url(#buildingGrad)" opacity="0.25"/>
      
      {/* Fenêtres */}
      <rect x="40" y="60" width="20" height="15" rx="2" fill="white" opacity="0.9"/>
      <rect x="70" y="60" width="20" height="15" rx="2" fill="white" opacity="0.9"/>
      <rect x="100" y="60" width="20" height="15" rx="2" fill="white" opacity="0.9"/>
      <rect x="130" y="60" width="20" height="15" rx="2" fill="white" opacity="0.9"/>
      
      <rect x="40" y="85" width="20" height="15" rx="2" fill="white" opacity="0.7"/>
      <rect x="70" y="85" width="20" height="15" rx="2" fill="white" opacity="0.9"/>
      <rect x="100" y="85" width="20" height="15" rx="2" fill="white" opacity="0.9"/>
      <rect x="130" y="85" width="20" height="15" rx="2" fill="white" opacity="0.7"/>
      
      {/* Toit */}
      <path d="M10 40 L100 5 L190 40" fill="url(#buildingGrad)" opacity="0.2"/>
      <path d="M10 40 L100 5 L190 40" stroke="url(#buildingGrad)" strokeWidth="2" opacity="0.4"/>
      
      {/* Porte */}
      <rect x="85" y="90" width="30" height="30" rx="3" fill="url(#buildingGrad)" opacity="0.4"/>
      <circle cx="110" cy="105" r="2" fill="white" opacity="0.8"/>
      
      {/* Grue */}
      <line x1="170" y1="15" x2="170" y2="70" stroke="#94a3b8" strokeWidth="2"/>
      <line x1="150" y1="15" x2="190" y2="15" stroke="#94a3b8" strokeWidth="2"/>
      <line x1="170" y1="15" x2="180" y2="50" stroke="#94a3b8" strokeWidth="1.5"/>
      
      {/* Soleil */}
      <circle cx="30" cy="25" r="10" fill="#f59e0b" opacity="0.3"/>
      <circle cx="30" cy="25" r="6" fill="#f59e0b" opacity="0.5"/>
      
      <defs>
        <linearGradient id="buildingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1"/>
          <stop offset="100%" stopColor="#4f46e5"/>
        </linearGradient>
      </defs>
    </svg>
  ),
};

export default function DashboardPage() {
  const user = useStore((s) => s.user);
  const movements = useStore((s) => s.movements);
  const transfers = useStore((s) => s.transfers);
  const inventory = useStore((s) => s.inventory);
  const stock = useStore(computeStock);

  const todayStr = new Date().toISOString().slice(0, 10);
  const inToday = movements.filter((m) => m.type === "in" && m.date === todayStr).length;
  const outToday = movements.filter((m) => m.type === "out" && m.date === todayStr).length;
  const pending = transfers.filter((t) => t.status === "pending").length;

  const totalEntries = movements.filter((m) => m.type === "in").length;
  const totalExits = movements.filter((m) => m.type === "out").length;
  const lowStockItems = stock.filter((s) => s.stock <= 10).length;

  const recent = movements.slice(0, 5);
  const hour = new Date().getHours();
  const greeting = hour < 6 ? "Bonne nuit" : hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <MobileShell title="Tableau de bord">
      <div className="space-y-5">
        {/* Nouvelle section d'en-tête - Design épuré et moderne */}
        <div className="rounded-3xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          {/* Partie supérieure avec fond */}
          <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-5">
            {/* Cercles décoratifs */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"/>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8"/>
            <div className="absolute top-10 right-16 w-2 h-2 bg-white rounded-full animate-ping"/>
            <div className="absolute top-6 right-24 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse"/>
            
            {/* Contenu */}
            <div className="relative flex items-center gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {user?.photo ? (
                  <img 
                    src={user.photo} 
                    alt={user.name}
                    className="h-16 w-16 rounded-2xl object-cover border-3 border-white/30 shadow-lg"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center border-2 border-white/30 backdrop-blur-sm">
                    <User className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>
              
              {/* Infos utilisateur */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                  <p className="text-xs font-medium text-white/80">{greeting}</p>
                </div>
                <h1 className="text-xl font-bold text-white truncate">
                  {user?.name ?? "Utilisateur"}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1.5 text-white/70">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"/>
                    <p className="text-xs">{user?.role ?? "Magasinier"}</p>
                  </div>
                  <span className="text-white/30">•</span>
                  <p className="text-xs text-white/70 truncate">{user?.site ?? "Chantier Centre"}</p>
                </div>
              </div>
              
              {/* Bouton paramètres */}
              {/* <Link to="/profil" className="flex-shrink-0">
                <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition backdrop-blur-sm">
                  <Settings className="h-5 w-5 text-white" />
                </div>
              </Link> */}
            </div>
          </div>
          
          {/* Partie inférieure avec la date et les stats rapides */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="font-medium">
                  {new Date().toLocaleDateString("fr-FR", { 
                    weekday: 'long', 
                    day: 'numeric',
                    month: 'long'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-indigo-600 font-medium">
                <Zap className="h-3 w-3" />
                En ligne
              </div>
            </div>
            
            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-2.5 text-center border border-emerald-100">
                <p className="text-lg font-bold text-emerald-600">{totalEntries}</p>
                <p className="text-[9px] font-medium text-emerald-600/70 uppercase">Entrées</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-2.5 text-center border border-orange-100">
                <p className="text-lg font-bold text-orange-600">{totalExits}</p>
                <p className="text-[9px] font-medium text-orange-600/70 uppercase">Sorties</p>
              </div>
              <div className={`rounded-xl p-2.5 text-center border ${
                lowStockItems > 0 
                  ? 'bg-gradient-to-br from-red-50 to-red-100/50 border-red-200' 
                  : 'bg-gradient-to-br from-green-50 to-green-100/50 border-green-100'
              }`}>
                <p className={`text-lg font-bold ${
                  lowStockItems > 0 ? 'text-red-600' : 'text-green-600'
                }`}>{lowStockItems}</p>
                <p className={`text-[9px] font-medium uppercase ${
                  lowStockItems > 0 ? 'text-red-600/70' : 'text-green-600/70'
                }`}>Alertes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Graphique d'activité */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">
            Activité du jour
          </h3>
          <ModernIllustrations.ActivityChart />
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
            <span>0h</span>
            <span>6h</span>
            <span>12h</span>
            <span>18h</span>
            <span>24h</span>
          </div>
        </div>

        {/* Cartes principales - Design Glassmorphism */}
        <div className="grid grid-cols-2 gap-3">
          {/* Entrées */}
          <Link to="/entrees" className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all active:scale-[0.97]">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-100 to-transparent rounded-bl-3xl"/>
            <div className="relative">
              <ModernIllustrations.StatsCard2 color="#059669" />
              <div className="mt-2">
                <p className="text-2xl font-extrabold text-gray-900">{inToday}</p>
                <p className="text-[11px] font-medium text-gray-500">Entrées du jour</p>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                  <Sparkles className="h-3 w-3" />
                  Nouvelle entrée
                </div>
              </div>
            </div>
          </Link>

          {/* Sorties */}
          <Link to="/sorties" className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all active:scale-[0.97]">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-orange-100 to-transparent rounded-bl-3xl"/>
            <div className="relative">
              <ModernIllustrations.StatsCard1 color="#ea580c" />
              <div className="mt-2">
                <p className="text-2xl font-extrabold text-gray-900">{outToday}</p>
                <p className="text-[11px] font-medium text-gray-500">Sorties du jour</p>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-orange-600 font-medium">
                  <Sparkles className="h-3 w-3" />
                  Nouvelle sortie
                </div>
              </div>
            </div>
          </Link>

          {/* Transferts */}
          <Link to="/transferts" className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all active:scale-[0.97]">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-3xl"/>
            <div className="relative">
              <ModernIllustrations.TransferIcon />
              <div className="mt-2">
                <p className="text-2xl font-extrabold text-gray-900">{pending}</p>
                <p className="text-[11px] font-medium text-gray-500">Transferts</p>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-blue-600 font-medium">
                  {pending > 0 ? (
                    <>
                      <Zap className="h-3 w-3" />
                      En attente
                    </>
                  ) : (
                    <>
                      <Star className="h-3 w-3" />
                      À jour
                    </>
                  )}
                </div>
              </div>
            </div>
          </Link>

          {/* Profil - Remplace Écarts inventaire */}
          <Link to="/profil" className="group relative overflow-hidden rounded-2xl bg-white border border-purple-100 p-4 shadow-sm hover:shadow-md transition-all active:scale-[0.97]">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-purple-100 to-transparent rounded-bl-3xl"/>
            <div className="relative">
              <ModernIllustrations.ProfileCard />
              <div className="mt-2">
                <p className="text-2xl font-extrabold text-gray-900">Profil</p>
                <p className="text-[11px] font-medium text-gray-500">Mon compte</p>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-purple-600 font-medium">
                  <Sparkles className="h-3 w-3" />
                  Gérer mon profil
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Mouvements récents */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide">Derniers mouvements</h2>
            <Link to="/stock" className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
              Voir tout <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            {recent.length === 0 ? (
              <div className="p-8 text-center">
                <ModernIllustrations.EmptyBox />
                <p className="text-sm text-muted-foreground mt-3">Aucun mouvement récent</p>
              </div>
            ) : (
              recent.map((m, index) => {
                const mat = stock.find((s) => s.material.id === m.materialId)?.material;
                return (
                  <Link
                    key={m.id}
                    to={m.type === "in" ? "/entrees" : "/sorties"}
                    className="flex items-center gap-3 p-3.5 hover:bg-gray-50 transition-colors border-b border-border/50 last:border-b-0"
                  >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      m.type === "in" 
                        ? 'bg-emerald-50' 
                        : 'bg-orange-50'
                    }`}>
                      {m.type === "in" ? (
                        <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12l7-7 7 7"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 19V5M5 12l7 7 7-7"/>
                        </svg>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{mat?.name ?? "—"}</p>
                      <p className="text-xs text-muted-foreground truncate">{m.party}</p>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-bold ${
                        m.type === "in" ? "text-emerald-600" : "text-orange-600"
                      }`}>
                        {m.type === "in" ? "+" : "-"}{m.qty}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{mat?.unit}</p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>

        {/* Footer */}
        <div className="text-center pb-4">
          <p className="text-[10px] text-muted-foreground">
            BTP Stock Manager • v1.0.0
          </p>
        </div>
      </div>
    </MobileShell>
  );
}