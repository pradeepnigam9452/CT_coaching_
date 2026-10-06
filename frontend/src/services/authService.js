import apiClient from "../api/client";

export const login = async (credentials) => {
  const { data } = await apiClient.post("/auth/login", credentials);
  return data;
};

export const signup = async (payload) => {
  const { data } = await apiClient.post("/auth/signup", payload);
  return data;
};

export const sendContactMessage = async (payload) => {
  const { data } = await apiClient.post("/auth/contact", payload);
  return data;
};