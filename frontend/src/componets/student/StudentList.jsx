// import React, { useEffect, useState } from 'react';
// import Navbar from '../../componets/user/Navbar';
// import Footer from '../../componets/user/Footer';
// import axios from 'axios';

// const StudentList = () => {
//   const [data, setdata] = useState([]);

//   // useEffect(() => {
//   //   axios.get("http://localhost:3000/api/students")
//   //     .then(res => setdata(res.data))
//   //     .catch(err => console.error(err));
//   // }, []);
// useEffect(() => {
//   axios.get("http://localhost:3000/api/students")
//     .then(res => setdata(res.data))
//     .catch(err => console.error(err));
// }, []);

//   return (
//     <>
//       <Navbar />
//       <div>
//         {data.map(user => (
//           <div key={user._id}>
//             <h3>{user.name}</h3>
//             <p>{user.role}</p>
//             <p>{user.batch}</p>
//           </div>
//         ))}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default StudentList;










import React from 'react'
import Navbar from '../../componets/user/Navbar'
import Footer from '../../componets/user/Footer'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
const StudentList = () => {
    const [data ,setdata] = useState([])
    useEffect(() => {
  axios.get("http://localhost:3000/api/students")
    .then(res => setdata(res.data))
    .catch(err => console.error(err));
}, []);
  return (
    <>
    <Navbar />
       <div>
        {data.map(user=> (
         
            <div key={user._id}>
              <h3>{user.name}</h3>
              <p>{user.role}</p>
              <p>{user.batch}</p>
            </div>
    
        ))}
       </div>
     
    <Footer />
    </>
  )
}

export default StudentList
