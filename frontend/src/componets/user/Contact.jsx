import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Contact = () => {
  return (
    <>
      <Navbar />

      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Contact Us</h1>
        <p>
          This page is coming soon 🚧  
          We’ll be available shortly to help you.
        </p>

        <p>
          📞 Phone: 8305729451 <br />
          📧 Email: ct@gmail.com
        </p>
      </div>

      <Footer />
    </>
  );
};

export default Contact;
