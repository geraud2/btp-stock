import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useStore } from "@/lib/store";
import SplashPage from "@/pages/Splash";
import LoginPage from "@/pages/Login";
import DashboardPage from "@/pages/Dashboard";
import EntreesPage from "@/pages/Entrees";
import SortiesPage from "@/pages/Sorties";
import TransfertsPage from "@/pages/Transferts";
import StockPage from "@/pages/Stock";
import InventairePage from "@/pages/Inventaire";
import NotFoundPage from "@/pages/NotFound";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useStore((s) => s.user);
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/entrees" element={<ProtectedRoute><EntreesPage /></ProtectedRoute>} />
      <Route path="/sorties" element={<ProtectedRoute><SortiesPage /></ProtectedRoute>} />
      <Route path="/transferts" element={<ProtectedRoute><TransfertsPage /></ProtectedRoute>} />
      <Route path="/stock" element={<ProtectedRoute><StockPage /></ProtectedRoute>} />
      <Route path="/inventaire" element={<ProtectedRoute><InventairePage /></ProtectedRoute>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
