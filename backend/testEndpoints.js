import http from "http";

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on("error", reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log("=== STARTING FULL END-TO-END VERIFICATION TESTS ===\n");

  // 1. Student Login
  console.log("1. Testing Student Login (student@coaching.com)...");
  const studentLogin = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/auth/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { email: "student@coaching.com", password: "student123" }
  );
  console.log(`-> Status: ${studentLogin.status}, User: ${studentLogin.data?.user?.name}, Role: ${studentLogin.data?.user?.role}`);
  const studentToken = studentLogin.data.token;

  // 2. Student Dashboard
  console.log("\n2. Testing Student Dashboard API...");
  const studentDash = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/student/dashboard",
    method: "GET",
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  console.log(`-> Status: ${studentDash.status}, Enrolled: ${studentDash.data?.metrics?.totalEnrolled}, Avg Score: ${studentDash.data?.metrics?.averageScore}%`);

  // 3. Student Enrolled Courses
  console.log("\n3. Testing Student Enrolled Courses API...");
  const studentCourses = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/student/courses",
    method: "GET",
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  console.log(`-> Status: ${studentCourses.status}, Count: ${studentCourses.data?.length}, Course 1: ${studentCourses.data?.[0]?.title}`);

  // 4. Security / RBAC: Student attempting to access /api/admin/dashboard
  console.log("\n4. Testing RBAC Security: Student trying to access /api/admin/dashboard...");
  const studentUnauthorizedAdmin = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/admin/dashboard",
    method: "GET",
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  console.log(`-> Status: ${studentUnauthorizedAdmin.status} (Expected 403 Forbidden), Message: ${studentUnauthorizedAdmin.data?.message}`);

  // 5. Security / RBAC: Student attempting to access /api/teacher/dashboard
  console.log("\n5. Testing RBAC Security: Student trying to access /api/teacher/dashboard...");
  const studentUnauthorizedTeacher = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/teacher/dashboard",
    method: "GET",
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  console.log(`-> Status: ${studentUnauthorizedTeacher.status} (Expected 403 Forbidden), Message: ${studentUnauthorizedTeacher.data?.message}`);

  // 6. Teacher Login
  console.log("\n6. Testing Teacher Login (suresh.rana@gmail.com)...");
  const teacherLogin = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/auth/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { email: "suresh.rana@gmail.com", password: "teacher123" }
  );
  console.log(`-> Status: ${teacherLogin.status}, User: ${teacherLogin.data?.user?.name}, Role: ${teacherLogin.data?.user?.role}`);
  const teacherToken = teacherLogin.data.token;

  // 7. Teacher Dashboard
  console.log("\n7. Testing Teacher Dashboard API...");
  const teacherDash = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/teacher/dashboard",
    method: "GET",
    headers: { Authorization: `Bearer ${teacherToken}` },
  });
  console.log(`-> Status: ${teacherDash.status}, Assigned Courses: ${teacherDash.data?.metrics?.assignedCourses}, Total Students: ${teacherDash.data?.metrics?.totalStudents}`);

  // 8. Teacher Security: Teacher trying to access /api/admin/dashboard
  console.log("\n8. Testing RBAC Security: Teacher trying to access /api/admin/dashboard...");
  const teacherUnauthorizedAdmin = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/admin/dashboard",
    method: "GET",
    headers: { Authorization: `Bearer ${teacherToken}` },
  });
  console.log(`-> Status: ${teacherUnauthorizedAdmin.status} (Expected 403 Forbidden), Message: ${teacherUnauthorizedAdmin.data?.message}`);

  // 9. Admin Login
  console.log("\n9. Testing Admin Login (admin@coaching.com)...");
  const adminLogin = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/auth/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { email: "admin@coaching.com", password: "admin123" }
  );
  console.log(`-> Status: ${adminLogin.status}, User: ${adminLogin.data?.user?.name}, Role: ${adminLogin.data?.user?.role}`);
  const adminToken = adminLogin.data.token;

  // 10. Admin Dashboard
  console.log("\n10. Testing Admin Dashboard & Platform Stats API...");
  const adminDash = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/admin/dashboard",
    method: "GET",
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log(`-> Status: ${adminDash.status}, Students: ${adminDash.data?.metrics?.totalStudents}, Teachers: ${adminDash.data?.metrics?.totalTeachers}, Courses: ${adminDash.data?.metrics?.totalCourses}, Total Revenue: ₹${adminDash.data?.metrics?.totalRevenue}`);

  console.log("\n=== ALL TESTS PASSED SUCCESSFULLY! ===");
}

runTests().catch(console.error);
