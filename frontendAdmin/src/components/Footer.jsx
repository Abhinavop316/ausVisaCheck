import React from "react";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="aus-admin-footer" role="contentinfo">
      {/* Acknowledgement of Country Banner */}
      <div className="aus-ack-banner">
        <div className="aus-ack-inner">
          <div className="aus-indigenous-flag">
            <span className="dot dot-ochre"></span>
            <span className="dot dot-black"></span>
            <span className="dot dot-red"></span>
          </div>
          <p className="aus-ack-text">
            We acknowledge the Traditional Custodians of Country throughout Australia and their continuing connection to land, sea and community. We pay our respects to all First Nations peoples, their cultures and to their Elders past, present and emerging.
          </p>
        </div>
      </div>

      {/* Main Footer Info */}
      <div className="aus-admin-footer__main">
        <div className="aus-admin-footer__inner">
          <div className="aus-admin-footer__brand">
            <img
              src="/logo.png"
              alt="Australian Government - Department of Home Affairs"
              className="aus-admin-footer__crest"
            />
            <p className="aus-admin-footer__caption">
              Department of Home Affairs — Administration &amp; Visa Verification Processing System
            </p>
          </div>

          <div className="aus-admin-footer__links-row">
            <a href="#accessibility" onClick={(e) => e.preventDefault()}>Accessibility</a>
            <span className="pipe">|</span>
            <a href="#security" onClick={(e) => e.preventDefault()}>Online Security</a>
            <span className="pipe">|</span>
            <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Act 1988</a>
            <span className="pipe">|</span>
            <a href="#copyright" onClick={(e) => e.preventDefault()}>Copyright &amp; Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
