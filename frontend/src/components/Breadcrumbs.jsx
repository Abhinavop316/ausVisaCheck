import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/VevoPage.css';

const Breadcrumbs = ({ activeTab, onSelectTab }) => {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs-container no-print">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link to="/" onClick={() => onSelectTab && onSelectTab('overview')}>Home</Link>
          <span className="breadcrumb-separator">/</span>
        </li>
        <li className="breadcrumb-item">
          <span className="breadcrumb-link-dummy">Visas</span>
          <span className="breadcrumb-separator">/</span>
        </li>
        <li className="breadcrumb-item">
          <span className="breadcrumb-link-dummy">Already have a visa</span>
          <span className="breadcrumb-separator">/</span>
        </li>
        <li className="breadcrumb-item">
          <button 
            type="button" 
            className="breadcrumb-btn-link"
            onClick={() => onSelectTab && onSelectTab('overview')}
          >
            Check visa details and conditions
          </button>
          <span className="breadcrumb-separator">/</span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          {activeTab === 'overview' && 'Check conditions online'}
          {activeTab === 'visa-holders' && 'Visa holders'}
          {activeTab === 'for-organisations' && 'For organisations'}
          {activeTab === 'check-portal' && 'VEVO Check Portal'}
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
