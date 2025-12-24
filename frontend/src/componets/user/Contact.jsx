import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/contact", formData);
      setSuccess(res.data.message || "Message sent successfully ✅");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError("Failed to send message ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[80vh] bg-base-200 flex flex-col md:flex-row items-start md:items-center justify-center px-4 py-12 gap-12">
        {/* Left side: Center Details */}
        <div className="bg-base-100 shadow-lg rounded-2xl p-8 max-w-md w-full animate-slide-up">
          <h1 className="text-3xl font-bold text-primary mb-6">
            CT Coaching Center, Bhopal
          </h1>
          <p className="text-gray-700 mb-3">
            📍 Address: ABC Road, Bhopal, Madhya Pradesh
          </p>
          <p className="text-gray-700 mb-3">
            📞 Phone: 8305729451
          </p>
          <p className="text-gray-700 mb-3">
            📧 Email: ct@gmail.com
          </p>
          <p className="text-gray-600 mt-4">
            We offer <b>online & offline</b> tech courses including Full Stack Development and Data Science with Python. Reach out to us for queries or enrollment!
          </p>
        </div>

        {/* Right side: Contact Form */}
        <div className="bg-base-100 shadow-lg rounded-2xl p-8 max-w-md w-full animate-slide-up">
          <h2 className="text-2xl font-bold text-secondary mb-6 text-center">
            Contact Us
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
              className="textarea textarea-bordered w-full"
            ></textarea>
            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? "btn-disabled" : ""}`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {success && <p className="text-green-600 text-center mt-2">{success}</p>}
            {error && <p className="text-red-600 text-center mt-2">{error}</p>}
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Contact;
