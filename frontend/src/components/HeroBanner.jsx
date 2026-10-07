import React from 'react';
import { Link } from 'react-router-dom';
import TabsNav from './TabsNav';
import '../styles/VevoPage.css';

const HeroBanner = ({ activeTab, onSelectTab }) => {
  return (
    <div className="exact-hero-wrapper no-print">
      {/* Background Image of Apple Blossom Flowers */}
      <div 
        className="exact-hero-bg-image"
        style={{ backgroundImage: `url('/Apple-tree-flowers.jpg')` }}
      ></div>

      {/* Angled Left Blue Shape */}
      <div className="exact-hero-blue-overlay"></div>

      {/* Hero Content on top of blue angle */}
      <div className="exact-hero-inner container">
        {/* Exact Breadcrumb */}
        <nav aria-label="Breadcrumb" className="exact-breadcrumbs">
          <ol className="exact-breadcrumb-list">
            <li>
              <Link to="/" onClick={() => onSelectTab('overview')}>Home</Link>
              <span className="exact-chevron">›</span>
            </li>
            <li>
              <span>Visas</span>
              <span className="exact-chevron">›</span>
            </li>
            <li>
              <span className="exact-current-crumb">When you have a visa</span>
              <span className="exact-chevron">›</span>
            </li>
          </ol>
        </nav>

        {/* Big White Heading */}
        <h1 className="exact-hero-title">
          Check visa details and<br />
          conditions
        </h1>
      </div>

      {/* Tabs bar attached at the bottom of the hero banner */}
      <TabsNav activeTab={activeTab} onSelectTab={onSelectTab} />
    </div>
  );
};

export default HeroBanner;
