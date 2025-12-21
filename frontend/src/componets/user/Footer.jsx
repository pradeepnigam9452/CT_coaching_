import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <ul className="footer-list">
          <li>📞 Contact: 8305729451</li>
          <li>📧 Email: ct@gmail.com</li>
        </ul>
        <p className="footer-copy">© 2025 CT. All rights reserved.</p>
      </div>

      <div className="footer-right">
        <form  action = "/newstudent" method="post" >
          <label>Name</label>
          <input type="text" placeholder="Enter your name" />

          <label>Email</label>
          <input type="email" placeholder="Enter your email" />

          <button type="submit">Submit</button>
        </form>
      </div>
    </footer>
  );
};

export default Footer;
