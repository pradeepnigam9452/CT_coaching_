import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      {/* Left */}
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          CT
        </Link>
      </div>

      <div className="navbar-center">
        <ul className="menu menu-horizontal px-5 gap-5">
          <li>
            <Link className="hover:text-primary" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="hover:text-primary" to="/courses">
              Courses
            </Link>
          </li>
          <li>
            <Link className="hover:text-primary" to="/about">
              About
            </Link>
          </li>
          <li>
            <Link className="hover:text-primary" to="/contact">
              Contact
            </Link>
            
          </li>
        </ul>
      </div>

      <div className="flex">
        <div className="dropdown dropdown-end">
          <button tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="User avatar"
                src="https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_960_720.png"
              />
            </div>
          </button>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
            <Link className="hover:text-primary" to="/login">
              login
            </Link>
          </li>
            <li>
              
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
