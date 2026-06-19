import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import moviesReducer from "./moviesSlice";
import reviewsReducer from "./reviewsSlice";

// Lo "store" è il magazzino globale di Redux: i dati condivisi da tutta l'app.
// È diviso in 3 sezioni (slice): auth (utente), movies (film), reviews (recensioni).
// Redux Toolkit aggiunge da solo il middleware Thunk, quindi le chiamate
// asincrone (createAsyncThunk) funzionano senza configurazione extra.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: moviesReducer,
    reviews: reviewsReducer,
  },
});
