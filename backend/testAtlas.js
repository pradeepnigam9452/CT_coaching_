import dns from "node:dns";
import mongoose from "mongoose";

// Set public DNS servers to resolve MongoDB Atlas SRV records reliably on Windows
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.log("Could not set custom DNS:", e.message);
}

const URI = "mongodb+srv://pradeep:5Hj05us394AXVkJI@cluster0.l6s9dla.mongodb.net/ecommerce?appName=Cluster0";

console.log("Testing connection to Atlas URI...");
try {
  await mongoose.connect(URI, { serverSelectionTimeoutMS: 5000 });
  console.log("SUCCESS! Connected to MongoDB Atlas successfully!");
  await mongoose.disconnect();
} catch (err) {
  console.error("Atlas connection error:", err.message);
}
