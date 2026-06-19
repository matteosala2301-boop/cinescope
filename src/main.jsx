import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { store } from "./store";
import App from "./App.jsx";

// Punto di partenza dell'app: qui React viene "montato" dentro la pagina HTML.
// Prendo il <div id="root"> dell'index.html e ci disegno dentro tutta l'app.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Provider rende lo store Redux disponibile a TUTTI i componenti sotto */}
    <Provider store={store}>
      {/* BrowserRouter attiva la navigazione tra le pagine (le rotte) */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
