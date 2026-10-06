import apiClient from "./client";

export const studentApi = {
  getDashboard: async () => {
    const res = await apiClient.get("/student/dashboard");
    return res.data;
  },

  getMyCourses: async () => {
    const res = await apiClient.get("/student/courses");
    return res.data;
  },

  browseCourses: async (params) => {
    const res = await apiClient.get("/student/browse-courses", { params });
    return res.data;
  },

  enrollInCourse: async (courseId) => {
    const res = await apiClient.post(`/student/enroll/${courseId}`);
    return res.data;
  },

  getLearningRoom: async (courseId) => {
    const res = await apiClient.get(`/student/learning/${courseId}`);
    return res.data;
  },

  completeLesson: async (courseId, lessonId) => {
    const res = await apiClient.post(`/student/learning/${courseId}/complete-lesson`, {
      lessonId,
    });
    return res.data;
  },

  getStudyMaterials: async (courseId) => {
    const res = await apiClient.get("/student/materials", {
      params: { courseId },
    });
    return res.data;
  },

  getTests: async () => {
    const res = await apiClient.get("/student/tests");
    return res.data;
  },

  getTestById: async (testId) => {
    const res = await apiClient.get(`/student/tests/${testId}`);
    return res.data;
  },

  submitTest: async (testId, payload) => {
    const res = await apiClient.post(`/student/tests/${testId}/submit`, payload);
    return res.data;
  },

  getResults: async () => {
    const res = await apiClient.get("/student/results");
    return res.data;
  },

  getNotifications: async () => {
    const res = await apiClient.get("/student/notifications");
    return res.data;
  },

  markNotificationRead: async (id) => {
    const res = await apiClient.patch(`/student/notifications/${id}/read`);
    return res.data;
  },
};

export default studentApi;
