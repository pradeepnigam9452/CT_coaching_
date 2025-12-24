// import React from 'react'
// import Navbar from './Navbar'
// import Footer from './Footer'
// const About = () => {
//   return (
//    <>
//     <Navbar />
//     <div>
//       About Coding Thinker
// A coaching and training facility that aids in the growth and development of your skills. Each course consists of five to six modules, as well as a mini and major project that prepares you for the workplace. The all new courses Data Science with Python and Full Stack Development are here.

// Our Mission
// To empower individuals with cutting-edge technical skills and knowledge through comprehensive, hands-on learning experiences.

// Provide industry-relevant curriculum
// Foster practical learning environment
// Build problem-solving capabilities
// Enable career growth opportunities
// "Building the future through education and innovation."

// Our Vision
// To be the leading platform for transformative tech education, creating the next generation of innovative and skilled developers.

// Shape future tech leaders
// Drive innovation in education
// Create global learning community
// Set industry standards
// "Empowering dreams through code, one learner at a time."


//     </div>
//     <Footer />
//     </>
//   )
// }

// export default About
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const About = () => {
  return (
    <>
      <Navbar />

      {/* Page Wrapper */}
      <div className="bg-base-200 py-12 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <h1 className="text-4xl font-extrabold text-center text-primary mb-6 animate-fade-in">
            About CT Coaching Center
          </h1>

          {/* Intro Card */}
          <div className="bg-base-100 shadow-lg rounded-2xl p-6 md:p-10 mb-10">
            <p className="text-center text-gray-600 text-lg leading-relaxed">
              CT Coaching Center, Bhopal is a professional coding and technology
              training institute offering <span className="font-semibold">online</span> and{" "}
              <span className="font-semibold">offline</span> tech courses.
              We focus on practical learning, real-world projects, and
              industry-ready skills.
            </p>
          </div>

          {/* Courses Info */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-base-100 shadow-md rounded-xl p-6 hover:shadow-xl transition duration-300">
              <h2 className="text-2xl font-bold mb-3 text-secondary">
                What We Offer
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Each course includes 5–6 structured modules, mini projects, and
                a major project to prepare students for real-world development
                roles. Popular programs include <b>Full Stack Development</b>{" "}
                and <b>Data Science with Python</b>.
              </p>
            </div>

            <div className="bg-base-100 shadow-md rounded-xl p-6 hover:shadow-xl transition duration-300">
              <h2 className="text-2xl font-bold mb-3 text-secondary">
                Learning Approach
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We emphasize hands-on coding, problem-solving, mentorship, and
                continuous assessment to ensure strong fundamentals and
                confidence in technology.
              </p>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-base-100 shadow-lg rounded-xl p-6 border-l-4 border-primary">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Provide industry-relevant curriculum</li>
                <li>Encourage practical and project-based learning</li>
                <li>Develop strong problem-solving skills</li>
                <li>Support career growth and placement readiness</li>
              </ul>
              <p className="mt-4 italic text-gray-600">
                “Building the future through education and innovation.”
              </p>
            </div>

            {/* Vision */}
            <div className="bg-base-100 shadow-lg rounded-xl p-6 border-l-4 border-secondary">
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Shape future technology leaders</li>
                <li>Promote innovation in technical education</li>
                <li>Create a strong online & offline learning community</li>
                <li>Set high standards in skill-based training</li>
              </ul>
              <p className="mt-4 italic text-gray-600">
                “Empowering dreams through code, one learner at a time.”
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default About;
