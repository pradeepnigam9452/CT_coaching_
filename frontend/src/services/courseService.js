import apiClient from "../api/client";

export const getCourses = async () => {
  const { data } = await apiClient.get("/course");
  return data;
};

export const getCourseById = async (id) => {
  const { data } = await apiClient.get(`/course/${id}`);
  return data;
};