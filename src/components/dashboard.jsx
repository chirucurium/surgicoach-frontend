import React, { useState, useEffect } from "react";
import './dashboard.css'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getMemberShipData } from '../redux/slice/volumeSlice';
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Watermark from './Watermark';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [roleName, setRoleName] = useState('');
  
  useEffect(() => {
    fetchRoles();
}, []);


  const fetchRoles = () => {
    dispatch(getMemberShipData())
      .unwrap()
      .then((response) => {
        const { membership } = response;

        if (membership && membership.length > 0) {
          membership.forEach(({ role, org , user}) => {
            localStorage.setItem('role', role)
            setRoleName(role);
            localStorage.setItem('org', org);
            localStorage.setItem('userId',user);
          });
        } else {
          console.error('No membership data available');
        }
      })
      .catch((error) => {
        // Handle the error if needed
        console.error('Get membership failed:', error);
      });
  };

  
  const handleUploadClick = () => {
    navigate('/upload');
  };

  return (

    <>
     <Watermark /> {/* Add Watermark */}
  <Sidebar/>

    <div className="container">

      <div className="hexagonArea first">
      <div className="hexagon" style={{ cursor: 'pointer' }}>
          <h3>Practice Tasks</h3>
        </div>
      </div>
      <div className="hexagonArea last">
          <div className="hexagon">
          <h3>Completed Tasks</h3>
            </div>
          <div className="hexagon">
          <h3>Feedbacks</h3>
            </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Dashboard;