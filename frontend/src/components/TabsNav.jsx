import React from 'react';
import '../styles/TabsNav.css';

const TabsNav = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'overview-tab', label: 'Overview' },
    { id: 'overview', label: 'Check conditions online (VEVO)' },
    { id: 'see-visa-conditions', label: 'See visa conditions' },
    { id: 'conditions-list', label: 'Conditions list' },
  ];

  return (
    <div className="exact-tabs-bar-wrapper">
      <div className="container">
        <ul className="exact-tabs-list" role="tablist">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id || (tab.id === 'overview' && (activeTab === 'overview' || activeTab === 'check-portal' || activeTab === 'visa-holders' || activeTab === 'for-organisations'));
            return (
              <li key={tab.id} className={`exact-tab-li ${isActive ? 'exact-active-tab' : ''}`}>
                <button
                  type="button"
                  className="exact-tab-button"
                  onClick={() => onSelectTab(tab.id === 'overview' ? 'overview' : tab.id)}
                  role="tab"
                  aria-selected={isActive}
                >
                  {tab.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default TabsNav;
