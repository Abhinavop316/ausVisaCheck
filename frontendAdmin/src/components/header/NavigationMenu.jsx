import React, { useState } from "react";
import "../../styles/header/NavigationMenu.css";

const navLinks = [
  { id: "visit", label: "Visit", altLabel: "Toro", active: false },
  { id: "study", label: "Study", altLabel: "Ako", active: false },
  { id: "work", label: "Work", altLabel: "Mahi", active: true },
  { id: "live", label: "Live", altLabel: "Ora", active: false },
  { id: "about", label: "About us", altLabel: "", active: false },
];

function NavigationMenu({ searchQuery, setSearchQuery, onSearchSubmit }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="nz-nav" aria-label="Header navigation">
      <div className="nz-nav__inner">
        {/* Desktop Primary Nav Bar */}
        <ul className="nz-nav__list">
          {navLinks.map((item) => (
            <li key={item.id} className={`nz-nav__item ${item.active ? "nz-nav__item--active" : ""}`}>
              <a href={`#${item.id}`} onClick={(e) => e.preventDefault()} className="nz-nav__link">
                <span className="nz-nav__label">{item.label}</span>
                {item.altLabel && <span className="nz-nav__alt-label">{item.altLabel}</span>}
                <svg className="nz-nav__chevron" viewBox="0 0 12 9" fill="currentColor">
                  <path d="M9.004 5.228 6.008 8.5 3.004 5.22A412.023 412.023 0 0 1 0 1.92c0-.01.289-.333.642-.719L1.284.5l2.358 2.575a255.804 255.804 0 0 0 2.374 2.576c.01 0 1.072-1.153 2.363-2.562L10.724.527l.638.696c.35.384.638.705.638.715 0 .01-1.348 1.49-2.996 3.29Z" />
                </svg>
              </a>
            </li>
          ))}
        </ul>

        {/* Right side Actions: Search Trigger & Mobile Toggle */}
        <div className="nz-nav__actions">
          <button
            type="button"
            className="nz-nav__search-btn"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search site"
          >
            <svg viewBox="0 0 24 24" className="nz-nav__search-icon" fill="currentColor">
              <path d="M2.4 9.6a7.2 7.2 0 1 1 14.4 0 7.2 7.2 0 0 1-14.4 0ZM9.6 0a9.6 9.6 0 0 0 0 19.2 9.558 9.558 0 0 0 5.887-2.016l6.464 6.464a1.2 1.2 0 1 0 1.697-1.697l-6.464-6.464A9.558 9.558 0 0 0 19.2 9.6 9.6 9.6 0 0 0 9.6 0Z" />
            </svg>
          </button>

          <button
            type="button"
            className="nz-nav__mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg viewBox="0 0 22 16" className="nz-nav__mobile-icon" fill="currentColor">
              <path d="M0 1.333C0 .597.597 0 1.333 0H20a1.333 1.333 0 1 1 0 2.667H1.333A1.333 1.333 0 0 1 0 1.333ZM0 8c0-.736.597-1.333 1.333-1.333H20a1.333 1.333 0 1 1 0 2.666H1.333A1.333 1.333 0 0 1 0 8Zm0 6.667c0-.737.597-1.334 1.333-1.334H20A1.333 1.333 0 0 1 20 16H1.333A1.333 1.333 0 0 1 0 14.667Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expandable Search Modal / Dropdown */}
      {isSearchOpen && (
        <div className="nz-nav__search-bar">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (onSearchSubmit) onSearchSubmit(searchQuery);
              setIsSearchOpen(false);
            }}
            className="nz-nav__search-form"
          >
            <input
              type="text"
              placeholder="Search Immigration New Zealand..."
              value={searchQuery || ""}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className="nz-nav__search-input"
            />
            <button type="submit" className="nz-nav__search-submit">
              Search
            </button>
          </form>
        </div>
      )}
    </nav>
  );
}

export default NavigationMenu;
