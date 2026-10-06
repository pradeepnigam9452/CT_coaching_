import apiClient from "./client";

export const adminApi = {
  getDashboard: async () => {
    const res = await apiClient.get("/admin/dashboard");
    return res.data;
  },

  // Students
  getStudents: async (params) => {
    const res = await apiClient.get("/admin/students", { params });
    return res.data;
  },

  createStudent: async (data) => {
    const res = await apiClient.post("/admin/students", data);
    return res.data;
  },

  updateStudent: async (id, data) => {
    const res = await apiClient.put(`/admin/students/${id}`, data);
    return res.data;
  },

  toggleStudentStatus: async (id) => {
    const res = await apiClient.patch(`/admin/students/${id}/status`);
    return res.data;
  },

  deleteStudent: async (id) => {
    const res = await apiClient.delete(`/admin/students/${id}`);
    return res.data;
  },

  // Teachers
  getTeachers: async () => {
    const res = await apiClient.get("/admin/teachers");
    return res.data;
  },

  createTeacher: async (data) => {
    const res = await apiClient.post("/admin/teachers", data);
    return res.data;
  },

  updateTeacher: async (id, data) => {
    const res = await apiClient.put(`/admin/teachers/${id}`, data);
    return res.data;
  },

  toggleTeacherStatus: async (id) => {
    const res = await apiClient.patch(`/admin/teachers/${id}/status`);
    return res.data;
  },

  deleteTeacher: async (id) => {
    const res = await apiClient.delete(`/admin/teachers/${id}`);
    return res.data;
  },

  // Categories
  getCategories: async () => {
    const res = await apiClient.get("/admin/categories");
    return res.data;
  },

  createCategory: async (data) => {
    const res = await apiClient.post("/admin/categories", data);
    return res.data;
  },

  updateCategory: async (id, data) => {
    const res = await apiClient.put(`/admin/categories/${id}`, data);
    return res.data;
  },

  deleteCategory: async (id) => {
    const res = await apiClient.delete(`/admin/categories/${id}`);
    return res.data;
  },

  // Courses
  getCourses: async () => {
    const res = await apiClient.get("/admin/courses");
    return res.data;
  },

  createCourse: async (data) => {
    const res = await apiClient.post("/admin/courses", data);
    return res.data;
  },

  updateCourse: async (id, data) => {
    const res = await apiClient.put(`/admin/courses/${id}`, data);
    return res.data;
  },

  deleteCourse: async (id) => {
    const res = await apiClient.delete(`/admin/courses/${id}`);
    return res.data;
  },

  // Tests & Results
  getTests: async () => {
    const res = await apiClient.get("/admin/tests");
    return res.data;
  },

  createTest: async (data) => {
    const res = await apiClient.post("/admin/tests", data);
    return res.data;
  },

  updateTest: async (id, data) => {
    const res = await apiClient.put(`/admin/tests/${id}`, data);
    return res.data;
  },

  deleteTest: async (id) => {
    const res = await apiClient.delete(`/admin/tests/${id}`);
    return res.data;
  },

  getResults: async (params) => {
    const res = await apiClient.get("/admin/results", { params });
    return res.data;
  },

  // Enrollments
  getEnrollments: async () => {
    const res = await apiClient.get("/admin/enrollments");
    return res.data;
  },

  createEnrollment: async (data) => {
    const res = await apiClient.post("/admin/enrollments", data);
    return res.data;
  },

  deleteEnrollment: async (id) => {
    const res = await apiClient.delete(`/admin/enrollments/${id}`);
    return res.data;
  },

  // Announcements
  getAnnouncements: async () => {
    const res = await apiClient.get("/admin/announcements");
    return res.data;
  },

  createAnnouncement: async (data) => {
    const res = await apiClient.post("/admin/announcements", data);
    return res.data;
  },

  deleteAnnouncement: async (id) => {
    const res = await apiClient.delete(`/admin/announcements/${id}`);
    return res.data;
  },

  // Reports
  getReports: async () => {
    const res = await apiClient.get("/admin/reports");
    return res.data;
  },
};

export default adminApi;
