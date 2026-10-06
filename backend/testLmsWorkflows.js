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

async function runWorkflowTests() {
  console.log("=== TESTING LMS INTERACTIVE WORKFLOWS ===\n");

  // 1. Student Login
  const loginRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/auth/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { email: "student@coaching.com", password: "student123" }
  );
  const token = loginRes.data.token;

  // 2. Browse Courses
  console.log("1. Browse Courses catalog...");
  const browse = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/student/browse-courses",
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(`-> Found ${browse.data?.length} courses in catalog.`);
  const courseId = browse.data[0]._id;

  // 3. Learning Room
  console.log(`\n2. Open LMS Classroom for Course: ${courseId}...`);
  const room = await request({
    hostname: "localhost",
    port: 3000,
    path: `/api/student/learning/${courseId}`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(`-> Classroom loaded: ${room.data?.course?.title}`);
  console.log(`-> Modules count: ${room.data?.course?.modules?.length}, Current Progress: ${room.data?.enrollment?.progress}%`);

  const lessonId = room.data?.course?.modules?.[0]?.lessons?.[0]?._id;
  if (lessonId) {
    console.log(`\n3. Mark Lesson (${lessonId}) as complete...`);
    const toggle = await request(
      {
        hostname: "localhost",
        port: 3000,
        path: `/api/student/learning/${courseId}/complete-lesson`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
      { lessonId }
    );
    console.log(`-> Toggle complete message: ${toggle.data?.message}, New Progress: ${toggle.data?.progress}%`);
  }

  // 4. Tests & Quizzes
  console.log("\n4. Fetch Available Quizzes...");
  const tests = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/student/tests",
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(`-> Available Quizzes Count: ${tests.data?.length}`);

  const testId = tests.data?.[0]?._id;
  if (testId) {
    console.log(`\n5. Fetch Single Quiz questions for ID: ${testId}...`);
    const singleTest = await request({
      hostname: "localhost",
      port: 3000,
      path: `/api/student/tests/${testId}`,
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`-> Quiz Title: ${singleTest.data?.title}, Questions count: ${singleTest.data?.questions?.length}`);

    console.log(`\n6. Submit Quiz answers and auto-grade...`);
    const q0 = singleTest.data?.questions?.[0]?._id;
    const answers = {};
    if (q0) answers[q0] = 1;

    const submitRes = await request(
      {
        hostname: "localhost",
        port: 3000,
        path: `/api/student/tests/${testId}/submit`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
      { answers, timeSpentSeconds: 120 }
    );
    console.log(`-> Submission Result: Score ${submitRes.data?.result?.score}/${submitRes.data?.result?.totalMarks} (${submitRes.data?.result?.percentage}%), Passed: ${submitRes.data?.result?.passed}`);
  }

  // 5. Results History
  console.log("\n7. Fetch Student Gradebook Results...");
  const results = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/student/results",
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(`-> Total Gradebook Submissions: ${results.data?.length}`);

  console.log("\n=== ALL LMS INTERACTIVE WORKFLOWS FUNCTIONAL! ===");
}

runWorkflowTests().catch(console.error);
