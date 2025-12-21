// import React, { useState } from 'react'
// import { Link } from "react-router-dom";
// import './Navbar.css'

// const Navbar = () => {
//   const [showLoginMenu, setShowLoginMenu] = useState(false);
//     const [userName, setUserName] = useState("");
// useEffect(() => {
//     const name = localStorage.getItem("userName");
//     if (name) setUserName(name);
//   }, []);
//   return (
//     <div className='nav'>
//       <ul className='nav-list'>
//         <li><Link to="/">Home</Link></li>
//         <li><Link to="/courses">Courses</Link></li>
//         <li><Link to="/About">About</Link></li>
//         <li><Link to="/contact">Contact</Link></li>
//         <li><Link to="/signup">Signup</Link></li>

//         <li
//           className="login-dropdown"
//           onClick={() => setShowLoginMenu(!showLoginMenu)}
//         >
//           <span>Login ▾</span>

//           {showLoginMenu && (
//             <ul className="dropdown-menu">
//               <li>
//                 <Link to="/login" onClick={() => setShowLoginMenu(false)}>
//                   Student Login
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/stafflogin " onClick={() => setShowLoginMenu(false)}>
//                   Staff Login
//                 </Link>
//               </li>
//             </ul>
//           )}
//         </li>
//       </ul>
//     </div>
//   )
// }

// export default Navbar


import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './Navbar.css'

const Navbar = () => {
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const [userName, setUserName] = useState("");

  // read username from localStorage on mount
  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);
  }, []);

  return (
    <div className='nav'>
      <ul className='nav-list'>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/courses">Courses</Link></li>
        <li><Link to="/About">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>

        {!userName ? (
          <li
            className="login-dropdown"
            onClick={() => setShowLoginMenu(!showLoginMenu)}
          >
            <span>Login ▾</span>
            {showLoginMenu && (
              <ul className="dropdown-menu">
                <li>
                  <Link to="/login" onClick={() => setShowLoginMenu(false)}>
                    Student Login
                  </Link>
                </li>
                <li>
                  <Link to="/stafflogin" onClick={() => setShowLoginMenu(false)}>
                    Staff Login
                  </Link>
                </li>
              </ul>
            )}
          </li>
        ) : (
          <li>Hello, {userName}</li>
        )}
      </ul>
    </div>
  )
}

export default Navbar;
