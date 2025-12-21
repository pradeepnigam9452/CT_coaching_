import mongoose from 'mongoose'
import Course from './Course.js'
import Student from './Student.js';
const DB_URL = "mongodb://127.0.0.1:27017/coaching-center";
main()
async function  main (){
        try{
              await mongoose.connect( DB_URL);
            console.log("Database connected")
        }catch(e){
            console.log(e)
        }
}
const data = [
  {
    "title": "Full Stack Web Development (MERN)",
    "description": "Complete MERN stack course from beginner to advanced",
    "duration": "6 Months",
    "price": 45000,
    "mode": "Offline",
    "subjects": ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"],
    "batchStartDate": "2025-02-01",
    "seatsAvailable": 30,
    "isActive": true
  },
  {
    "title": "Frontend Development with React",
    "description": "Master modern frontend development using React",
    "duration": "3 Months",
    "price": 25000,
    "mode": "Online",
    "subjects": ["HTML", "CSS", "JavaScript", "React"],
    "batchStartDate": "2025-02-10",
    "seatsAvailable": 40,
    "isActive": true
  },
  {
    "title": "Backend Development with Node.js",
    "description": "Build scalable backend APIs using Node and Express",
    "duration": "3 Months",
    "price": 22000,
    "mode": "Hybrid",
    "subjects": ["Node.js", "Express", "MongoDB", "JWT"],
    "batchStartDate": "2025-02-15",
    "seatsAvailable": 35,
    "isActive": true
  },
  {
    "title": "Python Programming for Beginners",
    "description": "Learn Python from basics with hands-on practice",
    "duration": "2 Months",
    "price": 15000,
    "mode": "Online",
    "subjects": ["Python", "Loops", "Functions", "OOP"],
    "batchStartDate": "2025-01-25",
    "seatsAvailable": 50,
    "isActive": true
  },
  {
    "title": "Data Structures & Algorithms",
    "description": "Crack interviews with strong DSA fundamentals",
    "duration": "4 Months",
    "price": 30000,
    "mode": "Offline",
    "subjects": ["Arrays", "Linked List", "Trees", "Graphs", "DP"],
    "batchStartDate": "2025-03-01",
    "seatsAvailable": 25,
    "isActive": true
  },
  {
    "title": "Java Programming Masterclass",
    "description": "Core Java + Advanced concepts for placement",
    "duration": "4 Months",
    "price": 28000,
    "mode": "Hybrid",
    "subjects": ["Core Java", "OOP", "Collections", "Multithreading"],
    "batchStartDate": "2025-02-20",
    "seatsAvailable": 30,
    "isActive": true
  },
  {
    "title": "Android App Development",
    "description": "Build Android apps using Kotlin",
    "duration": "5 Months",
    "price": 40000,
    "mode": "Offline",
    "subjects": ["Kotlin", "Android Studio", "Firebase"],
    "batchStartDate": "2025-03-10",
    "seatsAvailable": 20,
    "isActive": true
  },
  {
    "title": "iOS App Development",
    "description": "Learn iOS development using Swift",
    "duration": "5 Months",
    "price": 45000,
    "mode": "Online",
    "subjects": ["Swift", "Xcode", "UI Kit"],
    "batchStartDate": "2025-03-15",
    "seatsAvailable": 20,
    "isActive": true
  },
  {
    "title": "Machine Learning with Python",
    "description": "ML concepts with real-world projects",
    "duration": "6 Months",
    "price": 55000,
    "mode": "Hybrid",
    "subjects": ["Python", "NumPy", "Pandas", "Scikit-learn"],
    "batchStartDate": "2025-04-01",
    "seatsAvailable": 25,
    "isActive": true
  },
  {
    "title": "Artificial Intelligence Basics",
    "description": "Introduction to AI concepts and tools",
    "duration": "3 Months",
    "price": 35000,
    "mode": "Online",
    "subjects": ["AI", "ML", "Neural Networks"],
    "batchStartDate": "2025-03-05",
    "seatsAvailable": 40,
    "isActive": true
  },
  {
    "title": "C Programming Fundamentals",
    "description": "Learn C programming from scratch",
    "duration": "2 Months",
    "price": 12000,
    "mode": "Offline",
    "subjects": ["C", "Pointers", "Structures"],
    "batchStartDate": "2025-01-20",
    "seatsAvailable": 60,
    "isActive": true
  },
  {
    "title": "C++ Programming with STL",
    "description": "C++ for competitive programming",
    "duration": "3 Months",
    "price": 20000,
    "mode": "Online",
    "subjects": ["C++", "STL", "OOP"],
    "batchStartDate": "2025-02-05",
    "seatsAvailable": 45,
    "isActive": true
  },
  {
    "title": "Competitive Programming",
    "description": "Improve problem-solving skills",
    "duration": "4 Months",
    "price": 30000,
    "mode": "Hybrid",
    "subjects": ["C++", "DSA", "Algorithms"],
    "batchStartDate": "2025-03-20",
    "seatsAvailable": 30,
    "isActive": true
  },
  {
    "title": "Web Development Bootcamp",
    "description": "HTML, CSS, JS crash course",
    "duration": "2 Months",
    "price": 18000,
    "mode": "Online",
    "subjects": ["HTML", "CSS", "JavaScript"],
    "batchStartDate": "2025-01-28",
    "seatsAvailable": 50,
    "isActive": true
  },
  {
    "title": "DevOps Fundamentals",
    "description": "CI/CD, Docker, Kubernetes basics",
    "duration": "3 Months",
    "price": 32000,
    "mode": "Hybrid",
    "subjects": ["Docker", "Kubernetes", "AWS"],
    "batchStartDate": "2025-04-05",
    "seatsAvailable": 20,
    "isActive": true
  },
  {
    "title": "Cloud Computing with AWS",
    "description": "AWS services and cloud architecture",
    "duration": "4 Months",
    "price": 38000,
    "mode": "Online",
    "subjects": ["AWS", "EC2", "S3", "Lambda"],
    "batchStartDate": "2025-03-25",
    "seatsAvailable": 25,
    "isActive": true
  },
  {
    "title": "Cyber Security Basics",
    "description": "Fundamentals of cyber security",
    "duration": "3 Months",
    "price": 30000,
    "mode": "Offline",
    "subjects": ["Networking", "Ethical Hacking", "Security"],
    "batchStartDate": "2025-04-10",
    "seatsAvailable": 20,
    "isActive": true
  },
  {
    "title": "SQL & Database Management",
    "description": "Master SQL and database concepts",
    "duration": "2 Months",
    "price": 16000,
    "mode": "Online",
    "subjects": ["SQL", "MySQL", "MongoDB"],
    "batchStartDate": "2025-02-18",
    "seatsAvailable": 40,
    "isActive": true
  },
  {
    "title": "Git & GitHub for Developers",
    "description": "Version control from basics to advanced",
    "duration": "1 Month",
    "price": 8000,
    "mode": "Online",
    "subjects": ["Git", "GitHub"],
    "batchStartDate": "2025-01-22",
    "seatsAvailable": 100,
    "isActive": true
  },
  {
    "title": "Placement Preparation Program",
    "description": "DSA + Interviews + Mock Tests",
    "duration": "5 Months",
    "price": 50000,
    "mode": "Offline",
    "subjects": ["DSA", "Aptitude", "HR Interview"],
    "batchStartDate": "2025-03-01",
    "seatsAvailable": 30,
    "isActive": true
  }
];


const userdata = [
  {
    "name": "Amit Sharma",
    "email": "amit.sharma@gmail.com",
    "batch": "FSD",
    "role": "student"
  },
  {
    "name": "Neha Verma",
    "email": "neha.verma@gmail.com",
    "batch": "DS",
    "role": "student"
  },
  {
    "name": "Rahul Singh",
    "email": "rahul.singh@gmail.com",
    "batch": "DSA",
    "role": "student"
  },
  {
    "name": "Pooja Patel",
    "email": "pooja.patel@gmail.com",
    "batch": "FSD",
    "role": "student"
  },
  {
    "name": "Ankit Yadav",
    "email": "ankit.yadav@gmail.com",
    "batch": "DS",
    "role": "student"
  },
  {
    "name": "Sneha Gupta",
    "email": "sneha.gupta@gmail.com",
    "batch": "DSA",
    "role": "student"
  },
  {
    "name": "Rohit Meena",
    "email": "rohit.meena@gmail.com",
    "batch": "FSD",
    "role": "student"
  },
  {
    "name": "Kiran Joshi",
    "email": "kiran.joshi@gmail.com",
    "batch": "DS",
    "role": "student"
  },
  {
    "name": "Manish Kumar",
    "email": "manish.kumar@gmail.com",
    "batch": "DSA",
    "role": "student"
  },
  {
    "name": "Priya Malhotra",
    "email": "priya.malhotra@gmail.com",
    "batch": "FSD",
    "role": "student"
  },
  {
    "name": "Suresh Rana",
    "email": "suresh.rana@gmail.com",
    "batch": "DS",
    "role": "teacher"
  },
  {
    "name": "Anjali Tiwari",
    "email": "anjali.tiwari@gmail.com",
    "batch": "FSD",
    "role": "teacher"
  },
  {
    "name": "Vikas Chauhan",
    "email": "vikas.chauhan@gmail.com",
    "batch": "DSA",
    "role": "teacher"
  },
  {
    "name": "Ritu Saxena",
    "email": "ritu.saxena@gmail.com",
    "batch": "DS",
    "role": "teacher"
  },
  {
    "name": "Deepak Mishra",
    "email": "deepak.mishra@gmail.com",
    "batch": "FSD",
    "role": "teacher"
  },
  {
    "name": "Admin One",
    "email": "admin1@coaching.com",
    "batch": "FSD",
    "role": "admin"
  },
  {
    "name": "Admin Two",
    "email": "admin2@coaching.com",
    "batch": "DS",
    "role": "admin"
  },
  {
    "name": "Admin Three",
    "email": "admin3@coaching.com",
    "batch": "DSA",
    "role": "admin"
  },
  {
    "name": "Rakesh Solanki",
    "email": "rakesh.solanki@gmail.com",
    "batch": "FSD",
    "role": "student"
  },
  {
    "name": "Nidhi Agarwal",
    "email": "nidhi.agarwal@gmail.com",
    "batch": "DSA",
    "role": "student"
  }
]

const addCourse = async () => {
  try {
    // Optional: clear previous demo courses
    await Course.deleteMany();
    
    // Insert new demo courses
    await Course.insertMany(data);
    console.log("Demo courses added successfully!");
    mongoose.connection.close(); // close connection after seeding
  } catch (e) {
    console.error("Error adding courses:", e);
    mongoose.connection.close();
  }
};
// addCourse()

const adduser= async () => {
  try {
    // Optional: clear previous demo courses
    await Student.deleteMany();
    
    // Insert new demo courses
    await Student.insertMany(userdata);
    console.log("Demo courses added successfully!");
    mongoose.connection.close(); // close connection after seeding
  } catch (e) {
    console.error("Error adding courses:", e);
    mongoose.connection.close();
  }
};
adduser()