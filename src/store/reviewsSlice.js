import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api/api";

// Nota: stessa gestione errori degli altri slice (try/catch + rejectWithValue).

// Carica le recensioni di UN film (filtrando per movieId sul server).
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (movieId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/reviews?movieId=${movieId}`);
      return data;
    } catch {
      return rejectWithValue("Could not load reviews.");
    }
  }
);

// Aggiunge una recensione (POST).
export const addReview = createAsyncThunk(
  "reviews/addReview",
  async (review, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/reviews", review);
      return data;
    } catch {
      return rejectWithValue("Could not post the review.");
    }
  }
);

// Elimina una recensione (DELETE). Restituisco l'id per toglierla dalla lista.
export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/reviews/${id}`);
      return id;
    } catch {
      return rejectWithValue("Could not delete the review.");
    }
  }
);

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    items: [], // le recensioni del film aperto
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.items.push(action.payload); // aggiungo la nuova recensione
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        // tengo tutte tranne quella eliminata
        state.items = state.items.filter((r) => r.id !== action.payload);
      });
  },
});

export default reviewsSlice.reducer;
