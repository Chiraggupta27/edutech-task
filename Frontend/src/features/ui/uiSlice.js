import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toasts: []
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toast: (state, action) => {
      const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
      const { type = "info", message = "" } = action.payload || {};
      state.toasts.push({ id, type, message });
    },
    dismissToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    }
  }
});

export const { toast, dismissToast } = uiSlice.actions;
export default uiSlice.reducer;

