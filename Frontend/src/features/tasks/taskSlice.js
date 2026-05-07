import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createTaskAPI,
  deleteTaskAPI,
  getTasksAPI,
  updateStatusAPI,
  updateTaskAPI
} from "./taskAPI.js";
import { toast } from "../ui/uiSlice.js";

const getErrorMessage = (err, fallback) =>
  err?.response?.data?.message ||
  err?.response?.data?.data?.errors?.[0]?.msg ||
  fallback;

export const fetchTasks = createAsyncThunk(
  "tasks/fetch",
  async (params, thunkAPI) => {
    try {
      const res = await getTasksAPI(params);
      return res.data;
    } catch (err) {
      const message = getErrorMessage(err, "Failed to fetch tasks");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addTask = createAsyncThunk(
  "tasks/create",
  async (payload, thunkAPI) => {
    try {
      const res = await createTaskAPI(payload);
      thunkAPI.dispatch(toast({ type: "success", message: res.message }));
      return res.data.task;
    } catch (err) {
      const message = getErrorMessage(err, "Failed to create task");
      thunkAPI.dispatch(toast({ type: "error", message }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const editTask = createAsyncThunk(
  "tasks/update",
  async ({ id, payload }, thunkAPI) => {
    try {
      const res = await updateTaskAPI(id, payload);
      thunkAPI.dispatch(toast({ type: "success", message: res.message }));
      return res.data.task;
    } catch (err) {
      const message = getErrorMessage(err, "Failed to update task");
      thunkAPI.dispatch(toast({ type: "error", message }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removeTask = createAsyncThunk(
  "tasks/delete",
  async (id, thunkAPI) => {
    try {
      const res = await deleteTaskAPI(id);
      thunkAPI.dispatch(toast({ type: "success", message: res.message }));
      return id;
    } catch (err) {
      const message = getErrorMessage(err, "Failed to delete task");
      thunkAPI.dispatch(toast({ type: "error", message }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const toggleTaskStatus = createAsyncThunk(
  "tasks/status",
  async ({ id, status }, thunkAPI) => {
    try {
      const res = await updateStatusAPI(id, status);
      thunkAPI.dispatch(toast({ type: "success", message: res.message }));
      return res.data.task;
    } catch (err) {
      const message = getErrorMessage(err, "Failed to update status");
      thunkAPI.dispatch(toast({ type: "error", message }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  items: [],
  pagination: { page: 1, limit: 8, total: 0, totalPages: 1 },
  isLoading: false,
  error: null
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTasks: (state) => {
      state.items = [];
      state.pagination = { page: 1, limit: 8, total: 0, totalPages: 1 };
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.tasks;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch tasks";
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
        state.pagination.total += 1;
      })
      .addCase(editTask.fulfilled, (state, action) => {
        state.items = state.items.map((t) =>
          t._id === action.payload._id ? action.payload : t
        );
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
        state.pagination.total = Math.max(state.pagination.total - 1, 0);
      })
      .addCase(toggleTaskStatus.fulfilled, (state, action) => {
        state.items = state.items.map((t) =>
          t._id === action.payload._id ? action.payload : t
        );
      });
  }
});

export const { clearTasks } = taskSlice.actions;
export default taskSlice.reducer;

