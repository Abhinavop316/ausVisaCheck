import React, { useState, useEffect, useRef } from 'react';
import '../styles/SearchDialog.css';

const popularSearches = [
  'Check visa conditions online (VEVO)',
  'VEVO login for visa holders',
  'Student visa subclass 600',
  'Visitor visa subclass 500',
  'Check work rights in Australia',
  'ImmiAccount login and registration',
  'ImmiCard eligibility and replacement',
  'Resident return visa subclass 155',
  'Electronic record of permanent visa',
];

const SearchDialog = ({ isOpen, onClose, onSelectSearchResult }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('ha_recent_searches');
      return saved ? JSON.parse(saved) : ['VEVO check', 'Visa conditions'];
    } catch {
      return ['VEVO check', 'Visa conditions'];
    }
  });

  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!searchTerm.trim()) return;

    const term = searchTerm.trim();
    const updated = [term, ...recentSearches.filter(s => s.toLowerCase() !== term.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem('ha_recent_searches', JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }

    if (onSelectSearchResult) {
      onSelectSearchResult(term);
    }
    onClose();
  };

  const handlePopularClick = (term) => {
    setSearchTerm(term);
    const updated = [term, ...recentSearches.filter(s => s.toLowerCase() !== term.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem('ha_recent_searches', JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }
    if (onSelectSearchResult) {
      onSelectSearchResult(term);
    }
    onClose();
  };

  const clearRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('ha_recent_searches');
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className="search-dialog-backdrop" onClick={onClose}>
      <div className="search-dialog-container" onClick={(e) => e.stopPropagation()}>
        {/* Top bar with close button */}
        <div className="search-dialog-header">
          <div className="container search-dialog-header-inner">
            <span className="search-dialog-title">Search Department of Home Affairs</span>
            <button 
              type="button" 
              className="close-search-btn" 
              onClick={onClose}
              aria-label="Close search"
            >
              <span className="material-icons">close</span>
              <span>Back</span>
            </button>
          </div>
        </div>

        {/* Search Input Form */}
        <div className="search-input-area">
          <div className="container">
            <form onSubmit={handleSearchSubmit} className="search-bar-form">
              <div className="search-field-wrapper">
                <span className="material-icons search-field-icon">search</span>
                <input
                  ref={inputRef}
                  type="search"
                  className="search-main-input"
                  placeholder="What are you looking for today? e.g. VEVO, visa conditions, ImmiAccount..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    type="button" 
                    className="clear-input-btn"
                    onClick={() => setSearchTerm('')}
                  >
                    <span className="material-icons">cancel</span>
                  </button>
                )}
              </div>
              <button type="submit" className="search-submit-btn">
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Suggested / Popular searches */}
        <div className="search-content-area">
          <div className="container">
            <div className="search-suggestions-grid">
              {/* Popular searches column */}
              <div className="suggestion-column">
                <h3 className="suggestion-heading">
                  <span className="material-icons heading-icon">trending_up</span>
                  Popular searches
                </h3>
                <ul className="suggestion-list">
                  {popularSearches.map((item, index) => (
                    <li key={index}>
                      <button 
                        type="button" 
                        className="suggestion-item-btn"
                        onClick={() => handlePopularClick(item)}
                      >
                        <span className="material-icons item-icon">search</span>
                        <span>{item}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Previous searches column */}
              <div className="suggestion-column">
                <div className="previous-heading-row">
                  <h3 className="suggestion-heading">
                    <span className="material-icons heading-icon">history</span>
                    Your previous searches
                  </h3>
                  {recentSearches.length > 0 && (
                    <button type="button" className="clear-history-btn" onClick={clearRecent}>
                      Clear history
                    </button>
                  )}
                </div>

                {recentSearches.length === 0 ? (
                  <p className="no-history-text">No previous searches recorded on this device.</p>
                ) : (
                  <ul className="suggestion-list">
                    {recentSearches.map((item, index) => (
                      <li key={index}>
                        <button 
                          type="button" 
                          className="suggestion-item-btn"
                          onClick={() => handlePopularClick(item)}
                        >
                          <span className="material-icons item-icon">history</span>
                          <span>{item}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDialog;
