import { axiosInstance } from "../../services/axiosInstance.js";

export const createTaskAPI = async (payload) => {
  const { data } = await axiosInstance.post("/tasks", payload);
  return data;
};

export const getTasksAPI = async (params) => {
  const { data } = await axiosInstance.get("/tasks", { params });
  return data;
};

export const updateTaskAPI = async (id, payload) => {
  const { data } = await axiosInstance.put(`/tasks/${id}`, payload);
  return data;
};

export const deleteTaskAPI = async (id) => {
  const { data } = await axiosInstance.delete(`/tasks/${id}`);
  return data;
};

export const updateStatusAPI = async (id, status) => {
  const { data } = await axiosInstance.patch(`/tasks/${id}/status`, { status });
  return data;
};

