import React, { useState } from 'react'
import Navbar from '../user/Navbar'
import Footer from '../user/Footer'
import './LoginStaff.css'

const LoginStaff = () => {
  const [staffId, setStaffId] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(staffId, password)
    // send to backend
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <form onSubmit={handleSubmit}>
          <h2>Staff Login</h2>

          <input
            type="text"
            placeholder="Enter Staff ID"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>
      </div>

      <Footer />
    </>
  )
}

export default LoginStaff
