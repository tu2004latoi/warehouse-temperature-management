import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";

const Header = ({ toggleTheme, currentTheme }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink to="/" className="nav-link">Home</NavLink>
        <NavLink to="/login" className="nav-link">Login</NavLink>
        <NavLink to="/settings" className="nav-link">Cài đặt</NavLink>

        <button onClick={toggleTheme} className="theme-toggle">
          {currentTheme === "light" ? "🌙 Tối" : "🌞 Sáng"}
        </button>
      </div>
    </nav>
  );
};

export default Header;
