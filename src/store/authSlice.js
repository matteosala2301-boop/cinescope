import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api/api";

// All'avvio rileggo l'utente salvato nel localStorage del browser.
// È questo che mi fa "restare loggato" anche dopo aver ricaricato la pagina.
const storedUser = JSON.parse(localStorage.getItem("user") || "null");

// Tolgo la password prima di salvare l'utente: dato sensibile fuori dallo store.
function stripPassword(user) {
  const safe = { ...user }; // copio l'oggetto
  delete safe.password; // rimuovo la password dalla copia
  return safe;
}

// --- THUNK: azioni asincrone che parlano col server ---

// LOGIN (fake auth): cerco l'utente per email e confronto la password lato client.
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Chiedo al server l'utente con quella email.
      const { data } = await api.get(
        `/users?email=${encodeURIComponent(email)}`
      );
      const user = data[0]; // prendo il primo risultato
      // Se non esiste o la password non combacia → errore (andrà in "rejected").
      if (!user || user.password !== password) {
        return rejectWithValue("Invalid email or password");
      }
      // Login ok: salvo l'utente (senza password) nel localStorage e lo restituisco.
      const safeUser = stripPassword(user);
      localStorage.setItem("user", JSON.stringify(safeUser));
      return safeUser; // questo diventa action.payload nel caso "fulfilled"
    } catch {
      return rejectWithValue("Login failed. Is the server running?");
    }
  }
);

// REGISTRAZIONE: controllo che l'email non esista già, poi creo l'utente.
export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      // Blocco le email duplicate.
      const { data: existing } = await api.get(
        `/users?email=${encodeURIComponent(email)}`
      );
      if (existing.length > 0) {
        return rejectWithValue("An account with this email already exists");
      }
      // Creo il nuovo utente con ruolo "user" (POST sul server).
      const { data: newUser } = await api.post("/users", {
        name,
        email,
        password,
        role: "user",
      });
      const safeUser = stripPassword(newUser);
      localStorage.setItem("user", JSON.stringify(safeUser));
      return safeUser;
    } catch {
      return rejectWithValue("Registration failed. Is the server running?");
    }
  }
);

// MODIFICA PROFILO: aggiorno nome ed email dell'utente loggato.
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ id, name, email }, { rejectWithValue }) => {
    try {
      // Controllo che la nuova email non sia già di un ALTRO utente.
      const { data: existing } = await api.get(
        `/users?email=${encodeURIComponent(email)}`
      );
      if (existing.some((u) => u.id !== id)) {
        return rejectWithValue("This email is already used by another account");
      }
      // PATCH = aggiorno solo i campi passati (così non perdo la password).
      const { data: updated } = await api.patch(`/users/${id}`, { name, email });
      const safeUser = stripPassword(updated);
      localStorage.setItem("user", JSON.stringify(safeUser));
      return safeUser;
    } catch {
      return rejectWithValue("Update failed. Is the server running?");
    }
  }
);

// Lo slice "auth": stato + regole su come cambia.
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser, // l'utente loggato (o null), ripreso dal localStorage
    status: "idle", // idle | loading | succeeded | failed
    error: null, // eventuale messaggio d'errore
  },
  // reducers "normali" (sincroni): azioni che chiamo direttamente.
  reducers: {
    logout(state) {
      state.user = null; // svuoto l'utente nello store
      localStorage.removeItem("user"); // e anche nel browser
    },
    clearAuthError(state) {
      state.error = null; // pulisco l'errore (es. cambiando pagina)
    },
  },
  // extraReducers: gestisco i 3 stati automatici dei thunk (pending/fulfilled/rejected).
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading"; // sto aspettando → la UI mostra il loader
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload; // salvo l'utente arrivato dal thunk
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // salvo il messaggio d'errore
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Esporto le azioni sincrone e il reducer (che finisce nello store).
export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
