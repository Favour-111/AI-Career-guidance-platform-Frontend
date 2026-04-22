import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { logoutUser, loginUser, registerUser } from "./authSlice";

export const fetchProfile = createAsyncThunk(
  "profile/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/profile");
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load profile",
      );
    }
  },
  {
    // Skip fetch if profile is already loaded — avoids white flash on navigation
    condition: (_, { getState }) => {
      const { profile } = getState().profile;
      return profile === null;
    },
  },
);

export const saveProfile = createAsyncThunk(
  "profile/save",
  async (profileData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/profile", profileData);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to save profile",
      );
    }
  },
);

export const updateSkills = createAsyncThunk(
  "profile/skills",
  async (skills, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/profile/skills", { skills });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update skills",
      );
    }
  },
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    // Optimistically sync live completion % from ProfilePage to Redux
    // so sidebar and dashboard always show the same number
    setCompletionPercentage: (state, action) => {
      if (state.profile) {
        state.profile.completionPercentage = action.payload;
      } else {
        // profile not yet loaded — create a minimal stub so completion is visible
        state.profile = { completionPercentage: action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.profile = null;
      })
      .addCase(saveProfile.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.profile = action.payload.profile;
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(updateSkills.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateSkills.fulfilled, (state, action) => {
        state.saving = false;
        if (state.profile) {
          state.profile.skills = action.payload.skills;
          if (action.payload.completionPercentage !== undefined) {
            state.profile.completionPercentage =
              action.payload.completionPercentage;
          }
        }
      })
      .addCase(updateSkills.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      // Clear profile when user logs out or a different user logs in
      .addCase(logoutUser.fulfilled, (state) => {
        state.profile = null;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.profile = null;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.profile = null;
        state.error = null;
      });
  },
});

export const { clearProfileError, setCompletionPercentage } =
  profileSlice.actions;
export default profileSlice.reducer;
