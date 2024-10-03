import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase-config";
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the CSS for the calendar
import "./dashbard.css"; // Ensure the CSS file name is correct
import { Link, NavLink } from "react-router-dom";

const Dashboard = ({ onLogout }) => { // Accept onLogout prop
  const [userCount, setUserCount] = useState(0);
  const [deceasedCount, setDeceasedCount] = useState(0);
  const [newMembersCount, setNewMembersCount] = useState(0); // New state for new members
  const [date, setDate] = useState(new Date()); // State for selected date

  const usersCollectionRef = collection(db, "users");

  const countUsers = async () => {
    try {
      const data = await getDocs(usersCollectionRef);
      return data.size; // Total number of users
    } catch (error) {
      console.error("Error counting users: ", error);
    }
  };

  const countDeceasedUsers = async () => {
    try {
      const q = query(usersCollectionRef, where("status", "==", "DECEASED"));
      const data = await getDocs(q);
      return data.size; // Number of deceased users
    } catch (error) {
      console.error("Error counting deceased users: ", error);
    }
  };

  const countNewMembersThisMonth = async () => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const endOfMonth = new Date();
    endOfMonth.setHours(23, 59, 59, 999); // End of the current day

    try {
      const q = query(
        usersCollectionRef,
        where("createdAt", ">=", startOfMonth),
        where("createdAt", "<=", endOfMonth)
      );
      const data = await getDocs(q);
      return data.size; // Number of new members added this month
    } catch (error) {
      console.error("Error counting new members: ", error);
    }
  };

  useEffect(() => {
    const fetchUserCounts = async () => {
      const totalCount = await countUsers();
      setUserCount(totalCount);
      
      const deceasedCount = await countDeceasedUsers();
      setDeceasedCount(deceasedCount);

      const newCount = await countNewMembersThisMonth();
      setNewMembersCount(newCount); // Set the new members count
    };

    fetchUserCounts();
  }, []);

  // Handle date change
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };
  const adminData = JSON.parse(sessionStorage.getItem('adminData'));
  return (
    <div className="mobile-menu">
      <div className="container-fluid mobile-menu">
        <div className="row flex-nowrap">
          <div className="col-md-3 col-xl-1 side-bar px-0 bg-dark">
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
              <Link to="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-5 d-none d-sm-inline">Menu</span>
                <CIcon icon={icon.cilList} className="profile p-2" />
              </Link>
              
              <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                <li className="nav-item">
                  <NavLink
                    className={`nav-link align-middle px-0`}
                    to="/home"
                    activeClassName="active"
                  >
                    <CIcon icon={icon.cilHome} className="profile ms-4" /> <span className="ms-1 d-none d-sm-inline">Home</span>
                  </NavLink>
                  <br />
                </li>
                <li className="nav-item">
                  <NavLink
                    className={`nav-link px-0 align-middle`}
                    to="/dashboard"
                    activeClassName="active"
                  >
                    <CIcon icon={icon.cilColorPalette} className="profile dashboard-size" /> <span className="ms-1 d-none d-sm-inline">Dashboard</span>
                  </NavLink>
                </li>
              </ul>

              <div> 
                <img src="/images/1.jpg" alt="" className="round-image" />
              </div>
              <div className="dropdown pb-4">
                <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                  <span className="d-none d-sm-inline mx-1">{adminData.name}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                 
                  <li><a className="dropdown-item" onClick={onLogout}>Sign out</a></li> {/* Call onLogout on sign out */}
                </ul>
              </div>
            </div>
          </div>
          {/* Dashboard content */}
          <center>
            <h1>Dashboard</h1>
            <p>Welcome to the Dashboard!</p>
            <div className="container">
              <div className="row text-center">
                {/* Total Members */}
                <div className="col">
                  <div className="card-container total-members">
                    <br />
                    <CIcon icon={icon.cilPeople} className="profile" />
                    <p>TOTAL MEMBERS: {userCount}</p>
                  </div>
                </div>

                {/* Deceased Members */}
                <div className="col">
                  <div className="card-container deceased-members">
                    <br />
                    <CIcon icon={icon.cilUserUnfollow} className="profile" />
                    <p>TOTAL DECEASED MEMBERS: {deceasedCount}</p>
                  </div>
                </div>
                
                {/* New Members This Month */}
                <div className="col">
                  <div className="card-container new-members">
                    <br />
                    <CIcon icon={icon.cilUserPlus} className="profile" />
                    <p>NEW MEMBER FOR THIS MONTH: {newMembersCount}</p>
                  </div>
                </div>
                
                {/* Calendar */}
                <div className="col">
                  <div className="card-container calendar">
                    <CIcon icon={icon.cilCalendar} className="profile" />
                    <h4>CALENDAR</h4>
                    <Calendar
                      onChange={handleDateChange}
                      value={date}
                    />
                  </div>
                </div>
              </div>
            </div>
          </center>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
