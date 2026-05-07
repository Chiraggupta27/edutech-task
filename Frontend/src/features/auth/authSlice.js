import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginAPI, meAPI, registerAPI } from "./authAPI.js";
import { toast } from "../ui/uiSlice.js";

const saved = (() => {
  try {
    const raw = localStorage.getItem("taskdash_auth");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

const initialState = {
  user: saved?.user || null,
  token: saved?.token || null,
  isLoading: false
};

const persist = (state) => {
  try {
    if (state.token) {
      localStorage.setItem(
        "taskdash_auth",
        JSON.stringify({ token: state.token, user: state.user })
      );
    } else {
      localStorage.removeItem("taskdash_auth");
    }
  } catch {
    // ignore
  }
};

const getErrorMessage = (err, fallback) => {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.data?.errors?.[0]?.msg ||
    fallback
  );
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload, thunkAPI) => {
    try {
      const res = await registerAPI(payload);
      thunkAPI.dispatch(toast({ type: "success", message: res.message }));
      return res.data;
    } catch (err) {
      const message = getErrorMessage(err, "Registration failed");
      thunkAPI.dispatch(toast({ type: "error", message }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload, thunkAPI) => {
    try {
      const res = await loginAPI(payload);
      thunkAPI.dispatch(toast({ type: "success", message: res.message }));
      return res.data;
    } catch (err) {
      const message = getErrorMessage(err, "Login failed");
      thunkAPI.dispatch(toast({ type: "error", message }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchMe = createAsyncThunk("auth/me", async (_, thunkAPI) => {
  try {
    const res = await meAPI();
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue("Unauthorized");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      persist(state);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        persist(state);
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        persist(state);
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        persist(state);
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        persist(state);
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

