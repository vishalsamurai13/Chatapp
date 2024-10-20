import "./../home.css";
import React from "react";
import { useSelector } from "react-redux";
import HomeBox from "./Homebox";

const Header = () => {
  const { user } = useSelector((state) => state.userReducer);

  function getFullname() {
    let fname = user?.firstname.toUpperCase();
    let lname = user?.lastname.toUpperCase();

    return fname + " " + lname;
  }

  function getInitials() {
    let f = user?.firstname.toUpperCase()[0];
    let l = user?.lastname.toUpperCase()[0];
    return f + l;
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
          <img
            src="/images/profile.jpg"
            alt="Profile"
            className="profile-pic"
          />
        </div>
      </header>
      <HomeBox />
    </div>
  );
};

export default Header;
