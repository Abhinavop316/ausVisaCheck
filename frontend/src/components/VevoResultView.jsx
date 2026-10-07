import React, { useState } from 'react';
import VevoOfficialCertificateDoc from './VevoOfficialCertificateDoc';
import { generateVevoPdf } from '../utils/generateVevoPdf';
import '../styles/VevoResult.css';

const VevoResultView = ({ data, onNewCheck, onOpenEmailModal }) => {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [isItemCollapsed, setIsItemCollapsed] = useState(false);
  const [sortBy, setSortBy] = useState('Last updated');
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    const filename = `VEVO_Entitlement_Check_${data.referenceNumber || data.documentNumber || 'Result'}.pdf`;
    try {
      await generateVevoPdf('vevo-official-pdf-doc', filename);
    } catch (err) {
      console.error('PDF download error:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleCopyRef = () => {
    const ref = data.referenceNumber || data.visaGrantNumber || 'EGOR949448';
    navigator.clipboard.writeText(ref);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  // Format dates matching screenshot format: '11 Jun 2024'
  const formatDateForImmi = (dateStr) => {
    if (!dateStr) return '11 Jun 2024';
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      }
    } catch {
      // fallback
    }
    return dateStr;
  };

  const applicantName = (() => {
    if (data.familyName && data.givenNames) {
      return `${data.familyName.toUpperCase()}, ${data.givenNames}`;
    }
    if (data.givenNames && !data.familyName) {
      return data.givenNames;
    }
    if (data.fullName) {
      if (data.fullName.includes(',')) return data.fullName;
      const parts = data.fullName.trim().split(' ');
      if (parts.length > 1) {
        return `${parts.slice(-1)[0].toUpperCase()}, ${parts.slice(0, -1).join(' ')}`;
      }
      return data.fullName;
    }
    return 'JOHN MICHAEL';
  })();

  const visaTypeName = data.visaDescription || 'Visitor Visa (600)';
  const visaCategoryShort = data.visaStream || data.visaClass || 'Visitor';
  const statusDisplay = data.visaStatus === 'In effect' ? 'Initial assessment' : (data.visaStatus || 'Initial assessment');
  const refNumber = data.referenceNumber || data.transactionReferenceNumber || 'EGOR949448';
  const lastUpdatedFormatted = formatDateForImmi(data.visaGrantDate || new Date());
  const dateSubmittedFormatted = formatDateForImmi(data.submissionDate || '09 Jun 2024');

  return (
    <div className="immi-status-container">
      {/* ImmiAccount Top Header */}
      <header className="immi-account-header no-print">
        <div className="immi-header-inner">
          <div className="immi-header-left">
            <img 
              src="/logo.png" 
              alt="Australian Government - Department of Home Affairs" 
              className="immi-crest-logo"
            />
          </div>
          <div className="immi-header-right">
            <span className="immi-account-brand-title">ImmiAccount</span>
            <div className="immi-user-info-row">
              <span className="immi-user-email">user@online.immi.gov.au</span>
              <span className="immi-divider">|</span>
              <button type="button" className="immi-logout-btn" onClick={onNewCheck}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ImmiAccount Main Navigation Tabs Bar */}
      <nav className="immi-account-nav-tabs no-print" aria-label="ImmiAccount Navigation">
        <div className="immi-nav-tabs-inner">
          <ul className="immi-tabs-list">
            <li className="immi-tab-item active">
              <button type="button" className="immi-tab-btn">My applications</button>
            </li>
            <li className="immi-tab-item">
              <button type="button" className="immi-tab-btn">My payments <span className="arrow-down">▾</span></button>
            </li>
            <li className="immi-tab-item">
              <button type="button" className="immi-tab-btn">Manage groups</button>
            </li>
            <li className="immi-tab-item">
              <button type="button" className="immi-tab-btn">Related links <span className="arrow-down">▾</span></button>
            </li>
            <li className="immi-tab-item">
              <button type="button" className="immi-tab-btn">Help and support <span className="arrow-down">▾</span></button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Blue Subheader Banner: My applications summary */}
      <div className="immi-subhead-banner no-print">
        <div className="immi-subhead-inner">
          <h2 className="immi-subhead-title">My applications summary</h2>
          <div className="immi-subhead-help" title="Help on applications summary">
            <span className="help-q-icon">?</span>
          </div>
        </div>
      </div>

      {/* Main ImmiAccount Content Body */}
      <div className="immi-content-body">
        {/* Action Toolbar */}
        <div className="immi-action-toolbar no-print">
          <div className="immi-toolbar-search-wrap">
            <div className="immi-search-input-box">
              <input 
                type="text" 
                placeholder="Search applications..." 
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
              <button type="button" className="immi-search-submit-btn" aria-label="Search">
                <span className="material-icons">search</span>
              </button>
            </div>
            <button type="button" className="immi-advanced-search-link">
              +Advanced search
            </button>
          </div>
        </div>

        {/* Section Title & Sorting / Pagination Controls Header */}
        <div className="immi-list-header-row no-print">
          <div className="immi-list-left-meta">
            <h3 className="immi-list-title">List of applications</h3>
            <div className="immi-sort-controls">
              <span>Sort by</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="immi-sort-select"
              >
                <option value="Last updated">Last updated</option>
                <option value="Date submitted">Date submitted</option>
                <option value="Applicant name">Applicant name</option>
                <option value="Status">Status</option>
              </select>
              <button type="button" className="immi-sort-dir-btn" title="Sort direction">
                ⇅
              </button>
              <button type="button" className="immi-refresh-link-btn" onClick={() => window.location.reload()}>
                <span className="material-icons refresh-icon">refresh</span> Refresh
              </button>
            </div>
          </div>

          <div className="immi-pagination-meta">
            <span>1 - 1 of 1 results</span>
            <span className="page-select-wrap">
              Page 
              <select className="immi-page-select" defaultValue="1">
                <option value="1">1</option>
              </select>
            </span>
            <span className="nav-arrows">◀ ▶</span>
          </div>
        </div>

        {copiedNotification && (
          <div className="immi-copy-alert no-print">
            Reference number copied to clipboard!
          </div>
        )}

        {/* Official Application Card Item matching screenshot */}
        <div className="immi-application-card">
          {/* Top Amber Accent Line */}
          <div className="immi-card-top-stripe"></div>

          {/* Application Item Summary Header */}
          <div className="immi-card-header-row">
            <div className="immi-card-header-left">
              <button 
                type="button" 
                className="immi-collapse-toggle-btn"
                onClick={() => setIsItemCollapsed(!isItemCollapsed)}
                title={isItemCollapsed ? "Expand item" : "Collapse item"}
              >
                {isItemCollapsed ? '+' : '–'}
              </button>
              <span className="material-icons immi-folder-icon">folder</span>
              <div className="immi-applicant-meta">
                <span className="immi-applicant-name">{applicantName}</span>
                <span className="immi-applicant-category"> - {visaCategoryShort}</span>
              </div>
            </div>

            <div className="immi-card-header-right">
              <span className="immi-status-pill">{statusDisplay}</span>
            </div>
          </div>

          {/* Collapsible Details Body */}
          {!isItemCollapsed && (
            <div className="immi-card-body-content">
              {/* 2-Column Key-Value Grid matching screenshot */}
              <div className="immi-data-grid-two-col">
                {/* Left Column */}
                <div className="immi-grid-col immi-grid-left">
                  <div className="immi-grid-row">
                    <span className="immi-label">Reference No</span>
                    <span className="immi-value font-mono">{refNumber}</span>
                  </div>
                  <div className="immi-grid-row">
                    <span className="immi-label">Type</span>
                    <span className="immi-value">{visaTypeName}</span>
                  </div>
                  <div className="immi-grid-row">
                    <span className="immi-label">Estimated Processing Time</span>
                    <span className="immi-value">
                      <a 
                        href="#processing-times" 
                        className="immi-purple-link"
                        onClick={(e) => { e.preventDefault(); alert("Estimated global processing times for " + visaTypeName + ": 75% of applications processed in 14 days, 90% processed in 29 days."); }}
                      >
                        Global processing times are published monthly
                      </a>
                    </span>
                  </div>
                  <div className="immi-grid-row">
                    <span className="immi-label">Actions required</span>
                    <span className="immi-value text-muted">-</span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="immi-grid-col immi-grid-right">
                  <div className="immi-grid-row">
                    <span className="immi-label">Last updated</span>
                    <span className="immi-value">{lastUpdatedFormatted}</span>
                  </div>
                  <div className="immi-grid-row">
                    <span className="immi-label">Date submitted</span>
                    <span className="immi-value">{dateSubmittedFormatted}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer matching screenshot */}
              <div className="immi-card-actions-footer no-print">
                <div className="immi-footer-left">
                  <button 
                    type="button" 
                    className="immi-view-details-btn highlight-action"
                    onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                    title="View full visa grant & conditions"
                  >
                    <span className="material-icons">description</span>
                    <span>View details</span>
                    <span className="expand-indicator">{isDetailsExpanded ? '▲' : '▼'}</span>
                  </button>
                </div>

                <div className="immi-footer-right-actions">
                  <button type="button" className="immi-card-tool-btn" onClick={handleCopyRef} title="Copy reference number">
                    <span className="material-icons">content_copy</span>
                    <span>Copy</span>
                  </button>
                  <button 
                    type="button" 
                    className="immi-card-tool-btn download-action-btn" 
                    onClick={handleDownloadPdf}
                    disabled={isDownloadingPdf}
                    title="Download Official VEVO Entitlement Check Document"
                  >
                    <span className="material-icons">{isDownloadingPdf ? 'hourglass_top' : 'file_download'}</span>
                    <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download'}</span>
                  </button>
                  <button type="button" className="immi-card-tool-btn" onClick={onOpenEmailModal} title="Share visa confirmation">
                    <span className="material-icons">share</span>
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Expanded Comprehensive VEVO / Visa Details Section */}
          {isDetailsExpanded && (
            <div className="immi-expanded-details-panel">
              <div className="immi-expanded-header">
                <h4>Official Visa Entitlement & Grant Details</h4>
                <div className="expanded-header-btns no-print">
                  <button 
                    type="button" 
                    className="btn-pdf-download" 
                    onClick={handleDownloadPdf}
                    disabled={isDownloadingPdf}
                  >
                    <span className="material-icons">download</span> 
                    {isDownloadingPdf ? 'Generating PDF...' : 'Download Official PDF'}
                  </button>
                  <button type="button" className="btn-pdf-print" onClick={handlePrint}>
                    <span className="material-icons">print</span> Print
                  </button>
                  <button type="button" className="btn-email-share" onClick={onOpenEmailModal}>
                    <span className="material-icons">email</span> Email Details
                  </button>
                </div>
              </div>

              {/* Verification Stamp Banner */}
              <div className="immi-verification-badge">
                <span className="material-icons check-icon">verified</span>
                <div>
                  <strong>Official Home Affairs Visa Record</strong>
                  <p>Checked at: {data.checkTimestamp || new Date().toLocaleString('en-AU')}</p>
                </div>
              </div>

              <div className="immi-details-sections-grid">
                {/* Holder Details */}
                <div className="immi-section-box">
                  <h5 className="section-box-title">Visa Holder Details</h5>
                  <div className="detail-rows">
                    <div className="row-item">
                      <span className="lbl">Full Name:</span>
                      <span className="val font-bold">{data.fullName || applicantName}</span>
                    </div>
                    <div className="row-item">
                      <span className="lbl">Date of Birth:</span>
                      <span className="val">{data.dateOfBirth || '15 August 1995'}</span>
                    </div>
                    <div className="row-item">
                      <span className="lbl">Document Type:</span>
                      <span className="val">{data.documentType || 'Passport'}</span>
                    </div>
                    <div className="row-item">
                      <span className="lbl">Document Number:</span>
                      <span className="val font-mono">{data.documentNumber || 'Z8493021'}</span>
                    </div>
                    <div className="row-item">
                      <span className="lbl">Country of Citizenship:</span>
                      <span className="val">{data.countryOfCitizenship || 'India'}</span>
                    </div>
                  </div>
                </div>

                {/* Visa Grant Details */}
                <div className="immi-section-box">
                  <h5 className="section-box-title">Visa Grant Information</h5>
                  <div className="detail-rows">
                    <div className="row-item">
                      <span className="lbl">Visa Class / Subclass:</span>
                      <span className="val">{data.visaClass || 'FA'} / {data.visaSubclass || '600'}</span>
                    </div>
                    <div className="row-item">
                      <span className="lbl">Visa Grant Number:</span>
                      <span className="val font-mono">{data.visaGrantNumber || '9014882910394'}</span>
                    </div>
                    <div className="row-item">
                      <span className="lbl">Visa Grant Date:</span>
                      <span className="val">{data.visaGrantDate || '10 February 2026'}</span>
                    </div>
                    <div className="row-item">
                      <span className="lbl">Visa Expiry Date:</span>
                      <span className="val">{data.visaExpiryDate || '10 February 2027'}</span>
                    </div>
                    <div className="row-item">
                      <span className="lbl">Entries Allowed:</span>
                      <span className="val">{data.entriesAllowed || 'Multiple entries'}</span>
                    </div>
                    <div className="row-item">
                      <span className="lbl">Period of Stay:</span>
                      <span className="val">{data.periodOfStay || '3 Month(s) from each arrival'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attached Supporting Documents List */}
              {data.documents && data.documents.length > 0 && (
                <div className="immi-section-box" style={{ marginTop: '16px' }}>
                  <h5 className="section-box-title">Attached Supporting Documents</h5>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '10px 14px' }}>
                    {data.documents.map((doc, idx) => (
                      <span 
                        key={idx} 
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          padding: '4px 10px', 
                          background: '#ECFDF5', 
                          color: '#065F46', 
                          border: '1px solid #A7F3D0', 
                          borderRadius: '14px', 
                          fontSize: '12.5px', 
                          fontWeight: '600' 
                        }}
                      >
                        ✓ {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Conditions List */}
              <div className="immi-conditions-container">
                <h5 className="section-box-title">Visa Conditions</h5>
                <div className="conditions-cards-list">
                  {data.conditions && data.conditions.length > 0 ? (
                    data.conditions.map((c, i) => (
                      <div key={i} className="condition-card">
                        <div className="condition-code-badge">{c.code}</div>
                        <div className="condition-desc-wrap">
                          <strong>{c.title}</strong>
                          <p>{c.desc}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="condition-card">
                      <div className="condition-code-badge">8101</div>
                      <div className="condition-desc-wrap">
                        <strong>NO WORK</strong>
                        <p>You must not engage in work in Australia while holding this visa.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Pagination matching screenshot */}
        <div className="immi-list-footer-pagination no-print">
          <div className="immi-pagination-meta">
            <span>1 - 1 of 1 results</span>
            <span className="page-select-wrap">
              Page 
              <select className="immi-page-select" defaultValue="1">
                <option value="1">1</option>
              </select>
            </span>
            <span className="nav-arrows">◀ ▶</span>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Gov Footer Links matching screenshot */}
      <footer className="immi-gov-footer no-print">
        <ul className="immi-footer-legal-links">
          <li><a href="#accessibility">Accessibility</a></li>
          <li className="pipe">|</li>
          <li><a href="#security">Online Security</a></li>
          <li className="pipe">|</li>
          <li><a href="#privacy">Privacy</a></li>
          <li className="pipe">|</li>
          <li><a href="#copyright">Copyright &amp; Disclaimer</a></li>
        </ul>
      </footer>

      {/* Hidden high-res container for generating the exact official PDF document format */}
      <div className="vevo-hidden-pdf-container" style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '794px' }}>
        <VevoOfficialCertificateDoc data={data} id="vevo-official-pdf-doc" />
      </div>
    </div>
  );
};

export default VevoResultView;
