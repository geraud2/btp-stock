import { NavLink } from "react-router-dom";
import { Home, ArrowDownToLine, ArrowUpFromLine, Repeat, Package, ClipboardList } from "lucide-react";

const items = [
  { to: "/dashboard", label: "Accueil", icon: Home },
  { to: "/entrees", label: "Entrées", icon: ArrowDownToLine },
  { to: "/sorties", label: "Consommation", icon: ArrowUpFromLine },
  { to: "/transferts", label: "Transferts", icon: Repeat },
  { to: "/stock", label: "Stock", icon: Package },
  { to: "/inventaire", label: "Profil", icon: ClipboardList },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md border-t border-border bg-card/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.15)]">
      <ul className="grid grid-cols-6">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                  isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`h-5 w-5 ${isActive ? "scale-110" : ""} transition-transform`} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="leading-none">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
