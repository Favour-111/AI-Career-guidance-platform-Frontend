import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const generateRecommendations = createAsyncThunk(
  "recommendations/generate",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/recommendations/generate");
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to generate recommendations",
      );
    }
  },
);

export const fetchRecommendations = createAsyncThunk(
  "recommendations/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/recommendations");
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load recommendations",
      );
    }
  },
  {
    // Skip fetch if recommendations are already loaded — avoids white flash on navigation
    condition: (_, { getState }) => {
      const { recommendation } = getState().recommendations;
      return recommendation === null;
    },
  },
);

const recommendationSlice = createSlice({
  name: "recommendations",
  initialState: {
    recommendation: null,
    loading: false,
    generating: false,
    error: null,
  },
  reducers: {
    clearRecommendationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendation = action.payload.recommendation;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(generateRecommendations.pending, (state) => {
        state.generating = true;
        state.error = null;
      })
      .addCase(generateRecommendations.fulfilled, (state, action) => {
        state.generating = false;
        state.recommendation = action.payload.recommendation;
      })
      .addCase(generateRecommendations.rejected, (state, action) => {
        state.generating = false;
        state.error = action.payload;
      });
  },
});

export const { clearRecommendationError } = recommendationSlice.actions;
export default recommendationSlice.reducer;
