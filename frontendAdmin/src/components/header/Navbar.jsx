import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../styles/header/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminLoggedIn = !!sessionStorage.getItem("adminAuthToken");

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthToken");
    navigate("/Admin-Login");
    window.location.reload();
  };

  return (
    <header className="aus-admin-header">
      {/* Top Header Bar */}
      <div className="aus-admin-header__top">
        <div className="aus-admin-header__inner">
          <Link
            to="/new-application"
            className="aus-admin-brand"
            title="Australian Government - Department of Home Affairs Admin Portal"
          >
            <img
              src="/logo.png"
              alt="Australian Government - Department of Home Affairs"
              className="aus-admin-crest-logo"
            />
            <span className="aus-admin-brand-divider" aria-hidden="true"></span>
            <div className="aus-admin-brand-text">
              <span className="aus-admin-brand-title">Immigration and citizenship</span>
              <span className="aus-admin-brand-sub">Administration &amp; Case Management Portal</span>
            </div>
          </Link>

          {/* Quick Actions */}
          <div className="aus-admin-header__quicklinks">
            <Link 
              to="/new-application" 
              className={`aus-admin-toplink ${location.pathname === '/new-application' ? 'active' : ''}`}
            >
              New Application
            </Link>
            <span className="pipe">|</span>
            <Link 
              to="/edit-application" 
              className={`aus-admin-toplink ${location.pathname === '/edit-application' ? 'active' : ''}`}
            >
              Edit Application
            </Link>
            <span className="pipe">|</span>
            {isAdminLoggedIn ? (
              <button type="button" className="aus-admin-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <Link 
                to="/Admin-Login" 
                className={`aus-admin-toplink ${location.pathname === '/Admin-Login' ? 'active' : ''}`}
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
