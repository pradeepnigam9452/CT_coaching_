import apiClient from "./client";

export const courseApi = {
  getAllCourses: async (params) => {
    const res = await apiClient.get("/course", { params });
    return res.data;
  },

  getCategories: async () => {
    const res = await apiClient.get("/course/categories");
    return res.data;
  },

  getCourseById: async (id) => {
    const res = await apiClient.get(`/course/${id}`);
    return res.data;
  },
};

export default courseApi;
