import React from 'react';
import '../styles/Footer.css';

const Footer = ({ onOpenCheckVevo, onOpenSupportModal, onSelectTab }) => {
  const handleNav = (tabKey) => {
    if (onSelectTab) {
      onSelectTab(tabKey);
    } else if (onOpenCheckVevo) {
      onOpenCheckVevo();
    }
  };

  return (
    <footer className="homeaffairs-footer no-print" role="contentinfo">
      {/* Acknowledgement of Country Banner */}
      <div className="acknowledgement-banner">
        <div className="container">
          <div className="ack-content">
            <div className="indigenous-art-flag">
              <span className="dot dot-ochre"></span>
              <span className="dot dot-black"></span>
              <span className="dot dot-red"></span>
            </div>
            <p className="ack-text">
              We acknowledge the Traditional Custodians of Country throughout Australia and their continuing connection to land, sea and community. We pay our respects to all First Nations peoples, their cultures and to their Elders past, present and emerging.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links Columns - 100% Internal Actions */}
      <div className="footer-main-section">
        <div className="container">
          <div className="footer-grid">
            {/* Column 1: Visas */}
            <div className="footer-col">
              <h4 className="footer-heading">Visas & Immigration</h4>
              <ul className="footer-links-list">
                <li>
                  <a 
                    href="/check-visa" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="footer-link-btn"
                    style={{ textDecoration: 'none', display: 'inline-block' }}
                  >
                    Check visa conditions (VEVO)
                  </a>
                </li>
                <li><button type="button" className="footer-link-btn" onClick={() => handleNav('overview')}>Explore visa options</button></li>
                <li><button type="button" className="footer-link-btn" onClick={() => handleNav('visa-holders')}>Student visas (subclass 600)</button></li>
                <li><button type="button" className="footer-link-btn" onClick={() => handleNav('visa-holders')}>Visitor visas (subclass 500)</button></li>
                <li><button type="button" className="footer-link-btn" onClick={() => handleNav('for-organisations')}>Skilled and work visas</button></li>
              </ul>
            </div>

            {/* Column 2: Citizenship */}
            <div className="footer-col">
              <h4 className="footer-heading">Citizenship</h4>
              <ul className="footer-links-list">
                <li><button type="button" className="footer-link-btn" onClick={() => handleNav('overview')}>Become an Australian citizen</button></li>
                <li><button type="button" className="footer-link-btn" onClick={() => handleNav('overview')}>Evidence of Australian citizenship</button></li>
                <li><button type="button" className="footer-link-btn" onClick={() => handleNav('overview')}>Citizenship ceremonies</button></li>
                <li><button type="button" className="footer-link-btn" onClick={() => handleNav('overview')}>Citizenship test and interview</button></li>
              </ul>
            </div>

            {/* Column 3: Entering & Leaving */}
            <div className="footer-col">
              <h4 className="footer-heading">Entering & Leaving</h4>
              <ul className="footer-links-list">
                <li><button type="button" className="footer-link-btn" onClick={() => handleNav('overview')}>Crossing the Australian border</button></li>
                <li><button type="button" className="footer-link-btn" onClick={() => handleNav('visa-holders')}>ImmiCard & identity documents</button></li>
                <li><button type="button" className="footer-link-btn" onClick={() => handleNav('overview')}>Tourist Refund Scheme (TRS)</button></li>
                <li><button type="button" className="footer-link-btn" onClick={() => handleNav('overview')}>Customs and duty free allowances</button></li>
              </ul>
            </div>

            {/* Column 4: Help & Department */}
            <div className="footer-col">
              <h4 className="footer-heading">Help & Contact</h4>
              <ul className="footer-links-list">
                <li><button type="button" className="footer-link-btn" onClick={() => handleNav('check-portal')}>ImmiAccount Login</button></li>
                <li><button type="button" className="footer-link-btn" onClick={onOpenSupportModal}>VEVO Online Enquiry Form</button></li>
                <li><button type="button" className="footer-link-btn" onClick={onOpenSupportModal}>Contact the Department</button></li>
                <li><button type="button" className="footer-link-btn" onClick={() => handleNav('visa-holders')}>Client Service Charter</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Legal & Copyright Bottom Bar */}
      <div className="footer-legal-bar">
        <div className="container footer-legal-inner">
          <div className="legal-left">
            <span className="copyright-text">
              © Commonwealth of Australia {new Date().getFullYear()} — Department of Home Affairs
            </span>
          </div>

          <ul className="legal-links-list">
            <li><button type="button" className="footer-link-btn" onClick={() => handleNav('overview')}>Disclaimer</button></li>
            <li><button type="button" className="footer-link-btn" onClick={() => handleNav('overview')}>Privacy</button></li>
            <li><button type="button" className="footer-link-btn" onClick={() => handleNav('overview')}>Accessibility</button></li>
            <li><button type="button" className="footer-link-btn" onClick={() => handleNav('overview')}>Copyright</button></li>
            <li><button type="button" className="footer-link-btn" onClick={() => handleNav('overview')}>Site map</button></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
