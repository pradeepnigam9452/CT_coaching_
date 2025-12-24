import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import axios from "axios";

const Courses = () => {
  const [data, setCourses] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/course")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-wrap justify-center mt-2">
        {data.map((course) => (
          <Link to={`/course/${course._id}`} key={course._id}>
            <div className="m-5 animate-slide-lr">
              <div className="card bg-base-100 w-96 shadow-sm">
                <figure>
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                    alt="Shoes"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{course.title}</h2>
                  <p>{course.description}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default Courses;
