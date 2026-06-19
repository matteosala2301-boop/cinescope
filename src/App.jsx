import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetail from "./pages/MovieDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import CreateMovie from "./pages/CreateMovie";
import EditMovie from "./pages/EditMovie";
import NotFound from "./pages/NotFound";

// Qui definisco tutte le rotte: a ogni indirizzo (path) associo una pagina.
export default function App() {
  return (
    <Routes>
      {/* Tutte le pagine stanno dentro Layout: navbar e footer vengono disegnati
          una volta sola, la pagina attiva appare nell'<Outlet /> del Layout */}
      <Route element={<Layout />}>
        {/* Pagine pubbliche (accessibili a chiunque) */}
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        {/* ":id" è la parte variabile = routing dinamico (es. /movies/7) */}
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Solo utenti loggati: ProtectedRoute reindirizza al login se non lo sei */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Solo admin: con "adminOnly" un utente normale viene rimandato alla home */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/movies/new"
          element={
            <ProtectedRoute adminOnly>
              <CreateMovie />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/movies/:id/edit"
          element={
            <ProtectedRoute adminOnly>
              <EditMovie />
            </ProtectedRoute>
          }
        />

        {/* "*" = qualsiasi indirizzo non riconosciuto → pagina 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
