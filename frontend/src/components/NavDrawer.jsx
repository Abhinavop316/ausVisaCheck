import React, { useState } from 'react';
import '../styles/NavDrawer.css';

const NavDrawer = ({ isOpen, onClose, onSelectTab }) => {
  const [expandedSection, setExpandedSection] = useState('visas');
  const [expandedSubSection, setExpandedSubSection] = useState('already-have-visa');
  const [menuSearch, setMenuSearch] = useState('');

  if (!isOpen) return null;

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const toggleSubSection = (subSection) => {
    setExpandedSubSection(expandedSubSection === subSection ? null : subSection);
  };

  const handleLeafClick = (tabKey) => {
    if (onSelectTab) {
      onSelectTab(tabKey);
    }
    onClose();
  };

  return (
    <div className="nav-drawer-backdrop" onClick={onClose}>
      <div className="nav-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header Controls */}
        <div className="drawer-header-controls">
          <button 
            type="button" 
            className="drawer-close-btn" 
            onClick={onClose}
            aria-label="Close menu"
          >
            <span className="material-icons">close</span>
            <span>Close Menu</span>
          </button>

          <button 
            type="button" 
            className="portfolio-portal-btn"
            onClick={() => handleLeafClick('overview')}
          >
            <span className="material-icons">home</span>
            <div>
              <strong>Home Affairs</strong>
              <span>Portfolio</span>
            </div>
          </button>
        </div>

        {/* Drawer Search Filter */}
        <div className="drawer-search-box">
          <span className="material-icons search-icon">search</span>
          <input 
            type="text" 
            placeholder="Search menu items..." 
            value={menuSearch}
            onChange={(e) => setMenuSearch(e.target.value)}
          />
          {menuSearch && (
            <button 
              type="button" 
              className="clear-search-btn"
              onClick={() => setMenuSearch('')}
            >
              <span className="material-icons">close</span>
            </button>
          )}
        </div>

        {/* Menu Navigation Items Tree */}
        <div className="drawer-nav-content">
          <ul className="drawer-menu-list">
            {/* Visas Section */}
            <li className={`drawer-menu-item ${expandedSection === 'visas' ? 'open' : ''}`}>
              <button 
                type="button" 
                className="drawer-menu-heading" 
                onClick={() => toggleSection('visas')}
              >
                <div className="heading-left">
                  <span className="material-icons menu-cat-icon">badge</span>
                  <span>Visas</span>
                </div>
                <span className="material-icons expand-indicator">
                  {expandedSection === 'visas' ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {expandedSection === 'visas' && (
                <ul className="drawer-submenu-list">
                  {/* Already have a visa */}
                  <li className={`drawer-submenu-item ${expandedSubSection === 'already-have-visa' ? 'sub-open' : ''}`}>
                    <button 
                      type="button" 
                      className="drawer-subheading active-branch"
                      onClick={() => toggleSubSection('already-have-visa')}
                    >
                      <span>Already have a visa</span>
                      <span className="material-icons sub-expand-indicator">
                        {expandedSubSection === 'already-have-visa' ? 'remove' : 'add'}
                      </span>
                    </button>

                    {expandedSubSection === 'already-have-visa' && (
                      <ul className="drawer-subsub-list">
                        <li>
                          <button 
                            type="button" 
                            className="leaf-nav-link active-page"
                            onClick={() => handleLeafClick('overview')}
                          >
                            <span className="bullet">›</span>
                            Check visa details and conditions (VEVO)
                          </button>
                        </li>
                        <li>
                          <button 
                            type="button" 
                            className="leaf-nav-link"
                            onClick={() => handleLeafClick('visa-holders')}
                          >
                            <span className="bullet">›</span>
                            VEVO for visa holders
                          </button>
                        </li>
                        <li>
                          <button 
                            type="button" 
                            className="leaf-nav-link"
                            onClick={() => handleLeafClick('for-organisations')}
                          >
                            <span className="bullet">›</span>
                            VEVO for organisations
                          </button>
                        </li>
                        <li>
                          <a 
                            href="/check-visa" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="leaf-nav-link vevo-action-leaf"
                            style={{ textDecoration: 'none' }}
                            onClick={onClose}
                          >
                            <span className="material-icons">bolt</span>
                            Check your visa online now ↗
                          </a>
                        </li>
                      </ul>
                    )}
                  </li>

                  {/* Getting a visa */}
                  <li className="drawer-submenu-item">
                    <button 
                      type="button" 
                      className="drawer-subheading"
                      onClick={() => toggleSubSection('getting-a-visa')}
                    >
                      <span>Getting a visa</span>
                      <span className="material-icons sub-expand-indicator">
                        {expandedSubSection === 'getting-a-visa' ? 'remove' : 'add'}
                      </span>
                    </button>

                    {expandedSubSection === 'getting-a-visa' && (
                      <ul className="drawer-subsub-list">
                        <li><button type="button" className="leaf-nav-link" onClick={() => handleLeafClick('overview')}><span className="bullet">›</span> Explore visa options</button></li>
                        <li><button type="button" className="leaf-nav-link" onClick={() => handleLeafClick('overview')}><span className="bullet">›</span> List of all visas</button></li>
                        <li><button type="button" className="leaf-nav-link" onClick={() => handleLeafClick('overview')}><span className="bullet">›</span> Student visas (subclass 600)</button></li>
                        <li><button type="button" className="leaf-nav-link" onClick={() => handleLeafClick('overview')}><span className="bullet">›</span> Visitor visas (subclass 500)</button></li>
                        <li><button type="button" className="leaf-nav-link" onClick={() => handleLeafClick('overview')}><span className="bullet">›</span> Skilled & Work visas</button></li>
                      </ul>
                    )}
                  </li>

                  {/* Working in Australia */}
                  <li className="drawer-submenu-item">
                    <button 
                      type="button" 
                      className="drawer-subheading"
                      onClick={() => toggleSubSection('working-in-aus')}
                    >
                      <span>Working in Australia</span>
                      <span className="material-icons sub-expand-indicator">
                        {expandedSubSection === 'working-in-aus' ? 'remove' : 'add'}
                      </span>
                    </button>

                    {expandedSubSection === 'working-in-aus' && (
                      <ul className="drawer-subsub-list">
                        <li><button type="button" className="leaf-nav-link" onClick={() => handleLeafClick('visa-holders')}><span className="bullet">›</span> Workplace rights and protections</button></li>
                        <li><button type="button" className="leaf-nav-link" onClick={() => handleLeafClick('for-organisations')}><span className="bullet">›</span> Employing legal workers</button></li>
                      </ul>
                    )}
                  </li>
                </ul>
              )}
            </li>

            {/* Citizenship Section */}
            <li className={`drawer-menu-item ${expandedSection === 'citizenship' ? 'open' : ''}`}>
              <button 
                type="button" 
                className="drawer-menu-heading" 
                onClick={() => toggleSection('citizenship')}
              >
                <div className="heading-left">
                  <span className="material-icons menu-cat-icon">public</span>
                  <span>Citizenship</span>
                </div>
                <span className="material-icons expand-indicator">
                  {expandedSection === 'citizenship' ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {expandedSection === 'citizenship' && (
                <ul className="drawer-submenu-list">
                  <li><button type="button" className="leaf-nav-link" onClick={() => handleLeafClick('overview')}><span className="bullet">›</span> Become an Australian citizen</button></li>
                  <li><button type="button" className="leaf-nav-link" onClick={() => handleLeafClick('overview')}><span className="bullet">›</span> Evidence of Australian citizenship</button></li>
                  <li><button type="button" className="leaf-nav-link" onClick={() => handleLeafClick('overview')}><span className="bullet">›</span> Citizenship ceremonies</button></li>
                </ul>
              )}
            </li>

            {/* Entering and leaving Australia */}
            <li className={`drawer-menu-item ${expandedSection === 'entering-leaving' ? 'open' : ''}`}>
              <button 
                type="button" 
                className="drawer-menu-heading" 
                onClick={() => toggleSection('entering-leaving')}
              >
                <div className="heading-left">
                  <span className="material-icons menu-cat-icon">flight_takeoff</span>
                  <span>Entering and leaving Australia</span>
                </div>
                <span className="material-icons expand-indicator">
                  {expandedSection === 'entering-leaving' ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {expandedSection === 'entering-leaving' && (
                <ul className="drawer-submenu-list">
                  <li><button type="button" className="leaf-nav-link" onClick={() => handleLeafClick('overview')}><span className="bullet">›</span> Crossing the border</button></li>
                  <li><button type="button" className="leaf-nav-link" onClick={() => handleLeafClick('visa-holders')}><span className="bullet">›</span> Travel on a bridging visa</button></li>
                  <li><button type="button" className="leaf-nav-link" onClick={() => handleLeafClick('visa-holders')}><span className="bullet">›</span> Proof of identity & ImmiCard</button></li>
                </ul>
              )}
            </li>

            {/* Help and support */}
            <li className={`drawer-menu-item ${expandedSection === 'help-support' ? 'open' : ''}`}>
              <button 
                type="button" 
                className="drawer-menu-heading" 
                onClick={() => toggleSection('help-support')}
              >
                <div className="heading-left">
                  <span className="material-icons menu-cat-icon">help_outline</span>
                  <span>Help and support</span>
                </div>
                <span className="material-icons expand-indicator">
                  {expandedSection === 'help-support' ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {expandedSection === 'help-support' && (
                <ul className="drawer-submenu-list">
                  <li><button type="button" className="leaf-nav-link" onClick={() => handleLeafClick('check-portal')}><span className="bullet">›</span> VEVO Online Enquiry Portal</button></li>
                  <li><button type="button" className="leaf-nav-link" onClick={() => handleLeafClick('visa-holders')}><span className="bullet">›</span> VEVO Troubleshooting Guide</button></li>
                </ul>
              )}
            </li>
          </ul>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <p className="drawer-footer-text">
            Australian Government Department of Home Affairs
          </p>
        </div>
      </div>
    </div>
  );
};

export default NavDrawer;
