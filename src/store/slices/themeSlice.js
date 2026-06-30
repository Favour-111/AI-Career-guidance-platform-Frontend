import { createSlice } from "@reduxjs/toolkit";

const forceLightMode = () => {
  if (typeof window === "undefined") {
    return false;
  }

  localStorage.removeItem("darkMode");
  document.documentElement.classList.remove("dark");
  return false;
};

const clearLightMode = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("darkMode");
  document.documentElement.classList.remove("dark");
};

const themeSlice = createSlice({
  name: "theme",
  initialState: { darkMode: forceLightMode() },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = false;
      clearLightMode();
    },
    setDarkMode: (state) => {
      state.darkMode = false;
      clearLightMode();
    },
  },
});

export const { toggleDarkMode, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
