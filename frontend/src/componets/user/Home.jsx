// import React, { useEffect, useState } from "react";
// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import Banner1 from "../../assets/Banner1.jpg";
// import Banner2 from "../../assets/idea_2.jpg";
// import { Link } from "react-router-dom";

// const images = [Banner1, Banner2];

// const Home = () => {
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setIndex((prev) => (prev + 1) % images.length);
//     }, 2000);

//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <>
//       <Navbar />

//       <div className="relative overflow-hidden min-h-screen">
//         {/* Slider */}
//         <div
//           className="flex h-full transition-transform duration-1000 ease-in-out"
//           style={{
//             transform: `translateX(-${index * 100}%)`,
//           }}
//         >
//           {images.map((img, i) => (
//             <div
//               key={i}
//               className="min-w-full min-h-screen bg-center bg-cover"
//               style={{ backgroundImage: `url(${img})` }}
//             >
//               <div className="hero-overlay bg-opacity-60"></div>
//             </div>
//           ))}
//         </div>

//         {/* Content */}
//         <div className="absolute inset-0 flex items-center justify-center text-center text-white z-10">
//           <div className="max-w-md">
//             <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
//             <p className="mb-5">
//               Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
//               excepturi exercitationem quasi.
//             </p>
//             <button className="btn btn-primary"> <Link to = "/courses">Get Started</Link></button>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default Home;



import React from 'react';
import Navbar from '../../componets/user/Navbar';
import Footer from '../../componets/user/Footer';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20 px-5 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to CT Coaching
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Learn Today, Lead Tomorrow. Get placement ready with expert guidance 🚀
        </p>
        <button className="bg-yellow-400 text-blue-900 font-semibold px-6 py-3 rounded shadow hover:bg-yellow-300 transition">
         <Link to="/courses">Enroll Now</Link>
        </button>
      </section>

      {/* Features / Courses Section */}
      <section className="py-16 px-5 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-10">Our Courses</h2>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="card w-80 p-6 bg-white shadow rounded">
            <h3 className="text-xl font-semibold mb-2">Web Development</h3>
            <p>Learn HTML, CSS, JavaScript, and React to build real projects.</p>
          </div>
          <div className="card w-80 p-6 bg-white shadow rounded">
            <h3 className="text-xl font-semibold mb-2">Data Science</h3>
            <p>Master Python, Machine Learning, and AI for career growth.</p>
          </div>
          <div className="card w-80 p-6 bg-white shadow rounded">
            <h3 className="text-xl font-semibold mb-2">Competitive Coding</h3>
            <p>Prepare for coding contests and placement tests efficiently.</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-5 text-center">
        <h2 className="text-3xl font-bold mb-10">Why Choose CT Coaching?</h2>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="bg-blue-50 p-6 rounded shadow w-72">
            <h3 className="font-semibold mb-2">Expert Faculty</h3>
            <p>Learn from experienced teachers with industry knowledge.</p>
          </div>
          <div className="bg-blue-50 p-6 rounded shadow w-72">
            <h3 className="font-semibold mb-2">Hands-on Learning</h3>
            <p>Practical projects and real-world examples for better understanding.</p>
          </div>
          <div className="bg-blue-50 p-6 rounded shadow w-72">
            <h3 className="font-semibold mb-2">Placement Support</h3>
            <p>Get guidance and support to land your dream job after courses.</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
