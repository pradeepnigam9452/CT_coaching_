import apiClient from "../api/client";

export const getStudents = async () => {
  const { data } = await apiClient.get("/students");
  return data;
};