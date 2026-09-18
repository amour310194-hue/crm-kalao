import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const defaultThemeSettings = {
  "data-bs-theme": "light",
  "data-sidebar": "light",
  "data-color": "primary",
  "data-topbar": "white",
  "data-layout": "default",
  "data-size": "default",
  "data-width": "fluid",
  "data-sidebarbg": "none",
  "dir": "ltr",
};


const initialState = {
  themeSettings: JSON.parse(
    Cookies.get("themeSettings") ||
      JSON.stringify(defaultThemeSettings)
  ),
};


const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    updateTheme: (state, { payload }) => {
      if (payload.dir === "rtl") {
        state.themeSettings = { ...defaultThemeSettings, dir: "rtl" };
      } else if (state.themeSettings.dir === "rtl" && payload.dir !== "rtl") {
        state.themeSettings = { ...defaultThemeSettings, ...payload, dir: "ltr" };
      } else {
        state.themeSettings = { ...state.themeSettings, ...payload };
      }

      Cookies.set(
        "themeSettings",
        JSON.stringify(state.themeSettings)
      );
    },
    resetTheme: (state) => {
      state.themeSettings = defaultThemeSettings;
      Cookies.remove("themeSettings");
    },
  },
});


export const { updateTheme, resetTheme } = themeSlice.actions;


export default themeSlice.reducer;





