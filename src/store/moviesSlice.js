import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api/api";

// Nota: tutti i thunk seguono lo stesso schema di gestione errori, cioè
// try/catch + rejectWithValue con un messaggio chiaro, letto poi da action.payload.

// THUNK che carica i film con PAGINAZIONE, FILTRI e ORDINAMENTO (lato server).
export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (
    { page = 1, limit = 6, search = "", genre = "", sort = "" } = {},
    { rejectWithValue }
  ) => {
    try {
      // Costruisco la query string da mandare a json-server.
      const params = new URLSearchParams();
      params.set("_page", page); // paginazione: quale pagina
      params.set("_limit", limit); // quanti film per pagina
      if (search) params.set("title_like", search); // filtro: ricerca nel titolo
      if (genre) params.set("genre", genre); // filtro: genere
      if (sort) {
        // sort arriva come "rating_desc": lo spezzo in campo + direzione.
        const [field, order] = sort.split("_");
        params.set("_sort", field);
        params.set("_order", order);
      }
      const { data, totalCount } = await api.get(
        `/movies?${params.toString()}`
      );
      // Restituisco i film della pagina + il totale (serve a calcolare le pagine).
      return { items: data, total: totalCount ?? data.length };
    } catch {
      return rejectWithValue("Could not load movies. Is the server running?");
    }
  }
);

// Carica TUTTI i film (senza paginazione) — usato da Home e Dashboard.
export const fetchAllMovies = createAsyncThunk(
  "movies/fetchAllMovies",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/movies");
      return data;
    } catch {
      return rejectWithValue("Could not load movies. Is the server running?");
    }
  }
);

// Carica UN film solo, dato il suo id (usato dalla pagina di dettaglio).
export const fetchMovieById = createAsyncThunk(
  "movies/fetchMovieById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/movies/${id}`);
      return data;
    } catch {
      return rejectWithValue("Could not load this movie.");
    }
  }
);

// CREA un film (POST) — solo admin.
export const createMovie = createAsyncThunk(
  "movies/createMovie",
  async (movie, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/movies", movie);
      return data;
    } catch {
      return rejectWithValue("Could not create the movie.");
    }
  }
);

// MODIFICA un film (PUT = sostituisce l'intero film) — solo admin.
export const updateMovie = createAsyncThunk(
  "movies/updateMovie",
  async ({ id, ...movie }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/movies/${id}`, { id, ...movie });
      return data;
    } catch {
      return rejectWithValue("Could not update the movie.");
    }
  }
);

// ELIMINA un film (DELETE) — solo admin. Restituisco l'id per toglierlo dalle liste.
export const deleteMovie = createAsyncThunk(
  "movies/deleteMovie",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/movies/${id}`);
      return id;
    } catch {
      return rejectWithValue("Could not delete the movie.");
    }
  }
);

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    items: [], // i film della pagina corrente (listing)
    all: [], // tutti i film (home/dashboard)
    total: 0, // totale film (per la paginazione)
    current: null, // il film aperto nel dettaglio
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Lista paginata ---
      .addCase(fetchMovies.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // --- Tutti i film ---
      .addCase(fetchAllMovies.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.all = action.payload;
      })
      .addCase(fetchAllMovies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // --- Singolo film ---
      .addCase(fetchMovieById.pending, (state) => {
        state.status = "loading";
        state.current = null; // azzero il film precedente mentre carico
        state.error = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.current = action.payload;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // --- Dopo crea/modifica/elimina aggiorno le liste locali senza rifare la fetch ---
      .addCase(createMovie.fulfilled, (state, action) => {
        state.all.push(action.payload); // aggiungo il nuovo film
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        state.current = action.payload;
        // sostituisco nella lista il film modificato (stesso id)
        state.all = state.all.map((m) =>
          m.id === action.payload.id ? action.payload : m
        );
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        // tengo tutti i film TRANNE quello eliminato (filter)
        state.all = state.all.filter((m) => m.id !== action.payload);
        state.items = state.items.filter((m) => m.id !== action.payload);
      });
  },
});

export default moviesSlice.reducer;
