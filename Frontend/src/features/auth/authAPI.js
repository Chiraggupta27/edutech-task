import { axiosInstance } from "../../services/axiosInstance.js";

export const registerAPI = async (payload) => {
  const { data } = await axiosInstance.post("/auth/register", payload);
  return data;
};

export const loginAPI = async (payload) => {
  const { data } = await axiosInstance.post("/auth/login", payload);
  return data;
};

export const meAPI = async () => {
  const { data } = await axiosInstance.get("/auth/me");
  return data;
};

