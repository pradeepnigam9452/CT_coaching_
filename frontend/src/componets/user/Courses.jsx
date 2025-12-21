import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer';
import { Link } from "react-router-dom";
import axios from 'axios'
import { useState,useEffect } from 'react'

const Courses = () => {
  const [data ,setCourses] = useState([])
  useEffect(() => {
  axios.get("http://localhost:3000/api/course")
    .then(res => setCourses(res.data))
    .catch(err => console.error(err));
}, []);
  return (
 
      <>
      <Navbar />
      <div>
        {data.map(course => (
          <Link to={`/course/${course._id}`} key={course._id}>
            <div>
              <h3>{course.title}</h3>
              <p>₹{course.price}</p>
            </div>
          </Link>
        ))}
      </div>
      <Footer />
    </>


  )
}

export default Courses
