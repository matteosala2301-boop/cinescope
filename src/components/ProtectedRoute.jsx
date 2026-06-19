import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

// "Guardiano" delle rotte: decide se puoi vedere una pagina o vieni reindirizzato.
// Se passo la prop adminOnly, solo gli admin possono entrare.
export default function ProtectedRoute({ children, adminOnly = false }) {
  const user = useSelector((state) => state.auth.user); // leggo l'utente loggato
  const location = useLocation(); // dove voleva andare

  // Non sei loggato? Ti mando al login (ricordando da dove venivi, per tornarci dopo).
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Rotta solo-admin ma tu non sei admin? Ti rimando alla home.
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Controlli superati: mostro la pagina protetta (children).
  return children;
}
