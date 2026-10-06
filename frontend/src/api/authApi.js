import apiClient from "./client";

export const authApi = {
  login: async (credentials) => {
    const res = await apiClient.post("/auth/login", credentials);
    return res.data;
  },

  signup: async (userData) => {
    const res = await apiClient.post("/auth/signup", userData);
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get("/auth/me");
    return res.data;
  },

  updateProfile: async (profileData) => {
    const res = await apiClient.post ? await apiClient.put("/auth/profile", profileData) : await apiClient.put("/auth/profile", profileData);
    return res.data;
  },

  changePassword: async (passwords) => {
    const res = await apiClient.put("/auth/change-password", passwords);
    return res.data;
  },

  contactUs: async (messageData) => {
    const res = await apiClient.post("/auth/contact", messageData);
    return res.data;
  },
};

export default authApi;
