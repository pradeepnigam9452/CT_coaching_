import React from "react";
import Navbar from './Navbar'
import Footer from "./Footer";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <Navbar />

      <div style={{ padding: "40px", textAlign: "center",  height : "60px"}}>
        <h1>Welcome to CT Coding Coaching</h1>
        <p>Learn coding and get placement ready 🚀</p>

        <Link to="/courses">
          <button style={{ padding: "10px 20px", fontSize: "16px" }}>
            Explore Courses
          </button>
        </Link>
      </div>

      <Footer />
    </>
  );
};

export default Home;
