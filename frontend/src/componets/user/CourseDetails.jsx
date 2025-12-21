import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // 👈 new

  useEffect(() => {
    axios
      .get(`http://localhost:3000/course/${id}`)
      .then((res) => {
        setCourse(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);        // 👈 backend failed
        setLoading(false);
      });
  }, [id]);

  if (loading) return <h2>Loading...</h2>;

  if (error)
    return (
      <>
        <Navbar />
        <h2 style={{ textAlign: "center", marginTop: "50px" }}>
          Page Not Found ❌
        </h2>
        <Footer />
      </>
    );

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>{course.title}</h1>
        <p>{course.description}</p>

        <p><b>Duration:</b> {course.duration}</p>
        <p><b>Mode:</b> {course.mode}</p>
        <p><b>Price:</b> ₹{course.price}</p>
        <p><b>Seats Available:</b> {course.seatsAvailable}</p>

        <h3>Subjects</h3>
        <ul>
          {course.subjects.map((sub, index) => (
            <li key={index}>{sub}</li>
          ))}
        </ul>
      </div>

      <Footer />
    </>
  );
};

export default CourseDetails;

















// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import Navbar from "./Navbar";
// import Footer from "./Footer";
// const CourseDetails = () => {
//   const { id } = useParams(); // get ID from URL
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios
//       .get(`http://localhost:3000/course/${id}`)
//       .then(res => {
//         setCourse(res.data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error(err);
//         setLoading(false);
//       });
//   }, [id]);

//   if (loading) return <h2>Loading...</h2>;
//   if (!course) return <h2>loading ......</h2>;

//   return (
//     <>
//     <Navbar />

//       <div style={{ padding: "20px" }}>
//         <h1>{course.title}</h1>
//         <p>{course.description}</p>

//         <p><b>Duration:</b> {course.duration}</p>
//         <p><b>Mode:</b> {course.mode}</p>
//         <p><b>Price:</b> ₹{course.price}</p>
//         <p><b>Seats Available:</b> {course.seatsAvailable}</p>

//         <h3>Subjects</h3>
//         <ul>
//           {course.subjects.map((sub, index) => (
//             <li key={index}>{sub}</li>
//           ))}
//         </ul>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default CourseDetails;
