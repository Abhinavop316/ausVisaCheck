import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header = ({ onOpenMenu, onOpenSearch }) => {
  const navigate = useNavigate();

  return (
    <header className="homeaffairs-exact-header no-print">
      <div className="exact-header-main">
        {/* Left: Blue Menu Box Button */}
        <button 
          type="button" 
          className="exact-menu-btn" 
          onClick={onOpenMenu}
          aria-label="Open menu"
        >
          <div className="exact-hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="exact-menu-text">Menu</span>
        </button>

        {/* Center: Australian Government & Immigration and Citizenship Brand */}
        <Link to="/" className="exact-brand-wrap" title="Department of Home Affairs - Immigration and citizenship">
          <img 
            src="/logo.png" 
            alt="Australian Government - Department of Home Affairs" 
            className="exact-brand-img"
          />
          <span className="exact-brand-divider" aria-hidden="true"></span>
          <span className="exact-brand-subsite-text">Immigration and citizenship</span>
        </Link>

        {/* Right: Search Box Button */}
        <button 
          type="button" 
          className="exact-search-btn" 
          onClick={onOpenSearch}
          aria-label="Search"
          title="Search"
        >
          <span className="material-icons exact-search-icon">search</span>
        </button>
      </div>

      {/* Toplinks sub-row on dark background */}
      <div className="exact-toplinks-row">
        <div className="exact-toplinks-inner">
          <ul className="exact-toplinks-list">
            <li>
              <a 
                href="/check-visa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="exact-toplink-btn"
                style={{ textDecoration: 'none' }}
              >
                ImmiAccount
              </a>
            </li>
            <li className="exact-pipe">|</li>
            <li>
              <a 
                href="/check-visa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="exact-toplink-btn"
                style={{ textDecoration: 'none' }}
              >
                Visa Entitlement Verification Online (VEVO)
              </a>
            </li>
            <li className="exact-pipe">|</li>
            <li>
              <a 
                href="/check-visa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="exact-toplink-btn"
                style={{ textDecoration: 'none' }}
              >
                My Tourist Refund Scheme (TRS)
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
