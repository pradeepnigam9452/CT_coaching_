import apiClient from "./client";

export const teacherApi = {
  getDashboard: async () => {
    const res = await apiClient.get("/teacher/dashboard");
    return res.data;
  },

  getCourses: async () => {
    const res = await apiClient.get("/teacher/courses");
    return res.data;
  },

  addModule: async (courseId, moduleData) => {
    const res = await apiClient.post(`/teacher/courses/${courseId}/modules`, moduleData);
    return res.data;
  },

  getLessons: async () => {
    const res = await apiClient.get("/teacher/lessons");
    return res.data;
  },

  createLesson: async (lessonData) => {
    const res = await apiClient.post("/teacher/lessons", lessonData);
    return res.data;
  },

  deleteLesson: async (lessonId, courseId) => {
    const res = await apiClient.delete(`/teacher/lessons/${lessonId}`, {
      params: { courseId },
    });
    return res.data;
  },

  getMaterials: async () => {
    const res = await apiClient.get("/teacher/materials");
    return res.data;
  },

  createMaterial: async (materialData) => {
    const res = await apiClient.post("/teacher/materials", materialData);
    return res.data;
  },

  deleteMaterial: async (materialId) => {
    const res = await apiClient.delete(`/teacher/materials/${materialId}`);
    return res.data;
  },

  getTests: async () => {
    const res = await apiClient.get("/teacher/tests");
    return res.data;
  },

  createTest: async (testData) => {
    const res = await apiClient.post("/teacher/tests", testData);
    return res.data;
  },

  updateTest: async (testId, testData) => {
    const res = await apiClient.put(`/teacher/tests/${testId}`, testData);
    return res.data;
  },

  deleteTest: async (testId) => {
    const res = await apiClient.delete(`/teacher/tests/${testId}`);
    return res.data;
  },

  getStudents: async () => {
    const res = await apiClient.get("/teacher/students");
    return res.data;
  },

  getResults: async (params) => {
    const res = await apiClient.get("/teacher/results", { params });
    return res.data;
  },
};

export default teacherApi;
