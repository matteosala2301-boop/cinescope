import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

// "Cornice" condivisa da tutte le pagine: navbar in alto, footer in basso,
// e nel mezzo l'<Outlet />, cioè il punto dove React Router inserisce la
// pagina della rotta attiva. È un esempio di composizione di componenti.
export default function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
