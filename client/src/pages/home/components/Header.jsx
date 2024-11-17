import "./../home.css";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import HomeBox from "./Homebox";
import { useNavigate } from "react-router-dom";
import socket from "../../../socket";

const Header = () => {
  const { user } = useSelector((state) => state.userReducer);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  function getFullname() {
    let fname =
      user?.firstname.at(0).toUpperCase() +
      user?.firstname.slice(1).toLowerCase();
    let lname =
      user?.lastname.at(0).toUpperCase() +
      user?.lastname.slice(1).toLowerCase();
    return fname + " " + lname;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", closeDropdown);
    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    socket.emit('  ', user._id);
  }

  return (
    <div className="home-page">
      <header className="header">
        {/* Left side: Logo and app name */}
        <div className="header-left">
          <img src="/images/logo.png" alt="Chat App Logo" className="logo" />
          <h1 className="app-name">ChatApp</h1>
        </div>

        {/* Right side: User name and profile picture */}
        <div className="header-right">
          <span className="user-name">{getFullname()}</span>
          {user?.profilePic && 
          <img 
            src={user?.profilePic} 
            alt="Profile Pic" 
            className="profile-pic" 
          />}
          {!user?.profilePic && 
          <img
            src="/images/profile.jpg"
            alt="Profile"
            className="profile-pic"
          />}
          <div className="dropdown-container">
            <button className="dot3-btn" onClick={toggleDropdown}>
              <i className="fa-solid fa-ellipsis-vertical 3-dots"></i>
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <button
                  id="dd-item1"
                  className="dropdown-profile"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </button>
                <button 
                  id="dd-item2"
                  className="dropdown-logout"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <HomeBox />
    </div>
  );
};

export default Header;
