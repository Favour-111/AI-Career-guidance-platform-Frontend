import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchMarketData = createAsyncThunk(
  "market/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const [careerRes, skillRes, statRes] = await Promise.all([
        api.get("/market/careers?limit=30"),
        api.get("/market/skills"),
        api.get("/market/stats"),
      ]);
      return {
        careers: careerRes.data.careers,
        skills: skillRes.data.skills,
        stats: statRes.data,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load market data",
      );
    }
  },
  {
    // Skip fetch if market data is already loaded — avoids white flash on navigation
    condition: (_, { getState }) => {
      const { careers } = getState().market;
      return careers.length === 0;
    },
  },
);

const marketSlice = createSlice({
  name: "market",
  initialState: {
    careers: [],
    skills: [],
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketData.fulfilled, (state, action) => {
        state.loading = false;
        state.careers = action.payload.careers;
        state.skills = action.payload.skills;
        state.stats = action.payload.stats;
      })
      .addCase(fetchMarketData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default marketSlice.reducer;
