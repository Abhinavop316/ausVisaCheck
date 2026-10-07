import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Breadcrumbs.css";

function Breadcrumbs({ isAdminLoggedIn }) {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/new-application":
        return "New Application Creation";
      case "/edit-application":
        return "Edit Application & Status Update";
      case "/Admin-Login":
      default:
        return "Admin Authentication";
    }
  };

  return (
    <nav className="aus-breadcrumbs" aria-label="Breadcrumb trail">
      <div className="aus-breadcrumbs__inner">
        <ul className="aus-breadcrumbs__list">
          <li className="aus-breadcrumbs__item">
            <Link to="/Admin-Login" className="aus-breadcrumbs__link">
              Home
            </Link>
          </li>
          <li className="aus-breadcrumbs__separator" aria-hidden="true">›</li>
          <li className="aus-breadcrumbs__item">
            <span className="aus-breadcrumbs__parent">Administration Portal</span>
          </li>
          <li className="aus-breadcrumbs__separator" aria-hidden="true">›</li>
          <li className="aus-breadcrumbs__item">
            <span className="aus-breadcrumbs__current" aria-current="page">
              {getPageTitle()}
            </span>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Breadcrumbs;
