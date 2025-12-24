// import React from 'react'
// import Navbar from '../../componets/user/Navbar'
// import Footer from '../../componets/user/Footer'
// import { useEffect } from 'react'
// import { useState } from 'react'
// import axios from 'axios'
// const StudentList = () => {
//     const [data ,setdata] = useState([])
//     useEffect(() => {
//   axios.get("http://localhost:3000/api/students")
//     .then(res => setdata(res.data))
//     .catch(err => console.error(err));
// }, []);
//   return (
//     <>
//     <Navbar />
//        <div className='flex flex-wrap mt-5 gap-6'>
//         {data.map(user=> (
         
      
    
//             <div className="card bg-base-100 w-96 shadow-sm" >
//   <div className="card-body"  key={user._id}>
//     <h2 className="card-title">{user.name}</h2>
//      <p>{user.role}</p>
//     <p>{user.batch}</p>
    
//   </div>
// </div>
//         ))}
//        </div>
     
//     <Footer />
//     </>
//   )
// }

// export default StudentList
import React, { useEffect, useState } from 'react';
import Navbar from '../../componets/user/Navbar';
import Footer from '../../componets/user/Footer';
import axios from 'axios';

const StudentList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/api/students')
      .then(res => setData(res.data))
      .catch(err => setError('Failed to fetch students'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-wrap justify-center mt-5 gap-6">
        {loading ? (
          <p>Loading students...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : data.length === 0 ? (
          <p>No students found.</p>
        ) : (
          data.map(user => (
            <div className="card bg-base-100 w-96 shadow-sm" key={user._id}>
              <div className="card-body">
                <h2 className="card-title">{user.name}</h2>
                <p>Role: {user.role}</p>
                <p>Batch: {user.batch}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </>
  );
};

export default StudentList;
