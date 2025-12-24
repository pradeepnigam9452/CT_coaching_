// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import Navbar from "./Navbar";
// import Footer from "./Footer";

// const CourseDetails = () => {
//   const { id } = useParams();

//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   useEffect(() => {
//     axios
//       .get(`http://localhost:3000/api/course/${id}`)
//       .then((res) => {
//         if (!res.data) {
//           setError(true);
//         } else {
//           setCourse(res.data);
//         }
//         setLoading(false);
//       })
//       .catch(() => {
//         setError(true);
//         setLoading(false);
//       });
//   }, [id]);

//   return (
//     <>
//       <Navbar />

//       {/* Loading */}
//       {loading && (
//         <h2 className="text-center mt-20 text-xl font-semibold">
//           Loading...
//         </h2>
//       )}

//       {/* Error */}
//       {error && !loading && (
//         <h2 className="text-center mt-20 text-xl text-red-500">
//           Page Not Found ❌
//         </h2>
//       )}

//       {/* Course Details */}
//       {!loading && !error && course && (
//         <div className="flex justify-center mt-10 px-4">
//           <div className="card lg:card-side bg-base-100 shadow-lg max-w-4xl">
//             <figure className="lg:w-1/2">
//               <img
//                 src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp"
//                 alt="Course"
//                 className="object-cover w-full h-full"
//               />
//             </figure>

//             <div className="card-body">
//               <h2 className="card-title text-2xl">{course.title}</h2>
//               <p className="text-gray-600">{course.description}</p>
//               <p className="text-lg font-bold mt-2">₹ {course.price}</p>
//               <p>{course.duration} {course.mode} {course.batchStartDate}  {course.isActive} </p>
//               <div className="card-actions mt-6">
//                 <button className="btn btn-primary">Enroll Now</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <Footer />
//     </>
//   );
// };

// export default CourseDetails;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const CourseDetails = () => {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/course/${id}`)
      .then((res) => {
        if (!res.data) {
          setError(true);
        } else {
          setCourse(res.data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  return (
    <>
      <Navbar />

      {/* Loading */}
      {loading && (
        <h2 className="text-center mt-20 text-xl font-semibold">Loading...</h2>
      )}

      {/* Error */}
      {error && !loading && (
        <h2 className="text-center mt-20 text-xl text-red-500">
          Page Not Found ❌
        </h2>
      )}

      {/* Course Details */}
      {!loading && !error && course && (
        <div className="flex justify-center mt-10 px-4 animate-slide-up">
          <div className="card lg:card-side bg-base-100 shadow-lg max-w-4xl">
            <figure className="lg:w-1/2">
              <img
                src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp"
                alt="Course"
                className="object-cover w-full h-full"
              />
            </figure>

            <div className="card-body">
              <h2 className="card-title text-2xl">{course.title}</h2>
              <p className="text-gray-600">{course.description}</p>

              <p className="text-lg font-bold mt-2">₹ {course.price}</p>

            
                <p> batch starting date - {new Date(course.batchStartDate).toLocaleDateString()} </p>
                <p>  now course is - {course.isActive ? "Active" : "Inactive"}</p>
                
                <p> total course duration {course.duration} </p>
                <p> mode of course - {course.mode} </p>
             

              <div className="card-actions mt-6">
                <button className="btn btn-primary">Enroll Now</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default CourseDetails;
