import React from "react";
import {
  FaHome,
  FaBell,
  FaChartBar,
  FaCog,
  FaBoxOpen,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const Sidebar = ({ toggleTheme, currentTheme }) => {
  const { logout } = useAuth();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <div className="sidebar">
      <div className="icon-box top-icon">
        {/* Logo hoặc biểu tượng nếu có */}
      </div>
      <nav className="sidebar-menu">
        <NavLink to="/products" className="nav-item">
          <FaHome className="icon" />
          <span className="note-menu">Trang chủ</span>
        </NavLink>
        <NavLink to="/products" className="nav-item">
          <FaBoxOpen className="icon" />
          <span className="note-menu">Quản lý</span>
        </NavLink>
        <NavLink to="/products" className="nav-item">
          <FaChartBar className="icon" />
          <span className="note-menu">Thống kê</span>
        </NavLink>
        <NavLink to="/settings" className="nav-item">
          <FaCog className="icon" />
          <span className="note-menu">Cài đặt</span>
        </NavLink>
        <NavLink to="/test" className="nav-item">
          <FaBell className="icon" />
          <span className="note-menu">Thông báo</span>
        </NavLink>
        <NavLink to="/logout" className="nav-item" onClick={handleLogout}>
          <FaSignOutAlt className="icon" />
          <span className="note-menu">Thoát</span>
        </NavLink>
      </nav>
      <div>
        <button onClick={toggleTheme} className="theme-toggle">
          {currentTheme === "light" ? "🌞 Sáng" : "🌙 Tối"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
