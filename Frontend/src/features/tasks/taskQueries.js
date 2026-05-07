import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTaskAPI,
  deleteTaskAPI,
  getTasksAPI,
  updateStatusAPI,
  updateTaskAPI
} from "./taskAPI.js";

const getErrorMessage = (err, fallback) =>
  err?.response?.data?.message ||
  err?.response?.data?.data?.errors?.[0]?.msg ||
  fallback;

export const tasksKey = (params) => ["tasks", params];

export function useTasks(params) {
  return useQuery({
    queryKey: tasksKey(params),
    queryFn: async () => {
      const res = await getTasksAPI(params);
      return res.data;
    }
  });
}

export function useCreateTask(onToast) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await createTaskAPI(payload);
      return res;
    },
    onSuccess: (res) => {
      onToast?.({ type: "success", message: res.message });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) => {
      onToast?.({ type: "error", message: getErrorMessage(err, "Failed to create task") });
    }
  });
}

export function useUpdateTask(onToast) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await updateTaskAPI(id, payload);
      return res;
    },
    onSuccess: (res) => {
      onToast?.({ type: "success", message: res.message });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) => {
      onToast?.({ type: "error", message: getErrorMessage(err, "Failed to update task") });
    }
  });
}

export function useDeleteTask(onToast) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await deleteTaskAPI(id);
      return res;
    },
    onSuccess: (res) => {
      onToast?.({ type: "success", message: res.message });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) => {
      onToast?.({ type: "error", message: getErrorMessage(err, "Failed to delete task") });
    }
  });
}

export function useUpdateStatus(onToast) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await updateStatusAPI(id, status);
      return res;
    },
    onSuccess: (res) => {
      onToast?.({ type: "success", message: res.message });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) => {
      onToast?.({ type: "error", message: getErrorMessage(err, "Failed to update status") });
    }
  });
}

