import React from 'react';
import '../styles/VevoOfficialDoc.css';

const VevoOfficialCertificateDoc = ({ data, id = 'vevo-official-pdf-doc' }) => {
  if (!data) return null;

  // Compute family and given names
  let familyName = data.familyName !== undefined ? data.familyName : '';
  let givenNames = data.givenNames !== undefined ? data.givenNames : '';

  if (!familyName && !givenNames && data.fullName) {
    if (data.fullName.includes(',')) {
      const parts = data.fullName.split(',');
      familyName = parts[0].trim();
      givenNames = parts.slice(1).join(' ').trim();
    } else {
      const parts = data.fullName.trim().split(' ');
      if (parts.length > 1) {
        familyName = parts[parts.length - 1];
        givenNames = parts.slice(0, parts.length - 1).join(' ');
      } else {
        familyName = '';
        givenNames = data.fullName.trim();
      }
    }
  }

  const now = new Date();
  const defaultTimestamp = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  }) + ' ' + now.toLocaleTimeString('en-US', { hour12: false }) + ' (AEST) Canberra, Australia';

  const validAsAt = data.checkTimestamp || defaultTimestamp;
  const visaDesc = data.visaDescription ? data.visaDescription.toUpperCase() : 'VISITOR (SUBCLASS 500) TOURIST STREAM';
  const passportNum = data.documentNumber || data.passportNumber || 'J5771300';
  const visaClassSubclass = `${data.visaClass || 'FA'} / ${data.visaSubclass || '500'}`;
  const visaApplicant = data.visaApplicant || 'Primary';
  const grantDate = data.visaGrantDate || '10 February 2026';
  const expiryDate = data.visaExpiryDate || '10 February 2027';
  const location = data.locationAtCheck || data.location || 'Offshore';
  const visaStatus = data.visaStatus || (data.status === 'Issued' ? 'Issued (In Effect / Active)' : (data.status || 'Pending (Under Review)'));
  const statusExplanation = data.statusMessage || data.paragraph || 'Currently the status is pending, the application is under review.';
  const submittedDocs = Array.isArray(data.documents) && data.documents.length > 0 
    ? data.documents.join(', ')
    : 'Passport, Photo, Aadhar';

  const entriesAllowed = data.entriesAllowed || 'Multiple entries to and from Australia during the validity of your visa';
  const mustNotArriveAfter = data.mustNotArriveAfter || expiryDate;
  const periodOfStay = data.periodOfStay ? (data.periodOfStay.startsWith('Until') ? data.periodOfStay : `Until ${data.periodOfStay}`) : `Until ${expiryDate}`;

  return (
    <div id={id} className="vevo-official-doc-sheet">
      {/* 1. Header with Official Australian Government Department of Home Affairs Logo */}
      <div className="doc-header-center">
        <div className="doc-crest-wrapper">
          <img 
            src="/logo-dark.png" 
            alt="Australian Government - Department of Home Affairs" 
            className="doc-coat-of-arms-logo"
          />
        </div>
      </div>

      {/* 2. Main Document Title */}
      <div className="doc-title-block">
        <h1 className="doc-main-title">Visa Entitlement Verification Online (VEVO)</h1>
        <h2 className="doc-sub-title">Official Entitlement & Lodgement Verification Statement</h2>
      </div>

      {/* 3. Meaningful Legal & Verification Text (NO LINKS) */}
      <div className="doc-intro-text">
        <p className="doc-intro-p">
          This document contains the official verification record of a Visa Entitlement Verification Online (VEVO) check and is valid as at {validAsAt}.
        </p>
        <p className="doc-intro-p bold-notice">
          Please note: VEVO Entitlement Checks reflect the current status registered in the Department of Home Affairs central repository.
        </p>

        {/* Section: Official Visa Verification Statement */}
        <div className="doc-section-paragraph">
          <h3 className="doc-section-heading">Official Visa Verification Statement</h3>
          <p className="doc-text-p">
            A VEVO check confirms the official processing status, travel authorities, and visa conditions associated with this applicant under Migration Regulations. All submitted documentation and travel identities have been recorded for official immigration compliance.
          </p>
        </div>

        {/* Section: Identity and Travel Document Verification */}
        <div className="doc-section-paragraph">
          <h3 className="doc-section-heading">Identity and Travel Document Verification</h3>
          <p className="doc-text-p">
            <strong>VEVO verification is linked directly to the registered travel document.</strong> The passport or official travel identity document presented must match the particulars listed below for all border clearance and verification purposes.
          </p>
        </div>

        {/* Section: Visa Status and Compliance Directives */}
        <div className="doc-section-paragraph">
          <h3 className="doc-section-heading">Visa Status and Compliance Directives</h3>
          <p className="doc-text-p">
            The visa holder must comply with all statutory conditions and validity terms applicable to their designated visa stream. Any change in personal particulars, travel document details, or residency must be notified immediately.
          </p>
        </div>
      </div>

      {/* 4. Horizontal Line Separator */}
      <hr className="doc-horizontal-divider" />

      {/* 5. Entitlement Check Result Title */}
      <div className="doc-result-header">
        <h2 className="doc-result-title">Entitlement Check Result & Submitted Documents</h2>
        <span className="doc-result-timestamp">Valid as at {validAsAt}</span>
      </div>

      {/* 6. Entitlement Check Result Key-Value Details Table */}
      <div className="doc-details-table-wrapper">
        <table className="doc-details-table">
          <tbody>
            <tr>
              <td className="doc-cell-label font-bold">Family name</td>
              <td className="doc-cell-value">{familyName}</td>
            </tr>
            <tr>
              <td className="doc-cell-label font-bold">Given name(s)</td>
              <td className="doc-cell-value">{givenNames}</td>
            </tr>
            <tr>
              <td className="doc-cell-label font-bold">Visa description</td>
              <td className="doc-cell-value">{visaDesc}</td>
            </tr>
            <tr>
              <td className="doc-cell-label font-bold">Passport / Travel document number</td>
              <td className="doc-cell-value">{passportNum}</td>
            </tr>
            <tr>
              <td className="doc-cell-label font-bold">Visa class / subclass</td>
              <td className="doc-cell-value">{visaClassSubclass}</td>
            </tr>
            <tr style={{ backgroundColor: '#F8FAFC' }}>
              <td className="doc-cell-label font-bold" style={{ color: '#0F172A', fontWeight: 'bold' }}>Current Visa Status</td>
              <td className="doc-cell-value" style={{ fontWeight: 'bold', color: visaStatus.includes('Issued') ? '#15803d' : '#0369a1' }}>
                {visaStatus}
              </td>
            </tr>
            <tr style={{ backgroundColor: '#F8FAFC' }}>
              <td className="doc-cell-label font-bold" style={{ color: '#0F172A', fontWeight: 'bold' }}>Status Explanation / Remarks</td>
              <td className="doc-cell-value" style={{ color: '#334155' }}>
                {statusExplanation}
              </td>
            </tr>
            <tr style={{ backgroundColor: '#F1F5F9' }}>
              <td className="doc-cell-label font-bold" style={{ color: '#0F172A', fontWeight: 'bold' }}>Submitted Documents</td>
              <td className="doc-cell-value" style={{ fontWeight: '600', color: '#1E293B' }}>
                {submittedDocs}
              </td>
            </tr>
            <tr>
              <td className="doc-cell-label font-bold">Visa applicant</td>
              <td className="doc-cell-value">{visaApplicant}</td>
            </tr>
            <tr>
              <td className="doc-cell-label font-bold">Visa grant date</td>
              <td className="doc-cell-value">{grantDate}</td>
            </tr>
            <tr>
              <td className="doc-cell-label font-bold">Visa expiry date</td>
              <td className="doc-cell-value">{expiryDate}</td>
            </tr>
            <tr>
              <td className="doc-cell-label font-bold">Location</td>
              <td className="doc-cell-value">{location}</td>
            </tr>
            <tr>
              <td className="doc-cell-label font-bold">Entries allowed</td>
              <td className="doc-cell-value">{entriesAllowed}</td>
            </tr>
            <tr>
              <td className="doc-cell-label font-bold">Must not arrive after</td>
              <td className="doc-cell-value">{mustNotArriveAfter}</td>
            </tr>
            <tr>
              <td className="doc-cell-label font-bold">Period of stay</td>
              <td className="doc-cell-value">{periodOfStay}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Conditions list if applicable */}
      {data.conditions && data.conditions.length > 0 && (
        <div className="doc-conditions-section">
          <h4 className="doc-conditions-title">Visa Conditions</h4>
          <table className="doc-conditions-table">
            <thead>
              <tr>
                <th style={{ width: '15%' }}>Condition</th>
                <th style={{ width: '35%' }}>Title</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {data.conditions.map((cond, idx) => (
                <tr key={idx}>
                  <td className="font-bold">{cond.code}</td>
                  <td className="font-bold">{cond.title}</td>
                  <td>{cond.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 7. Official Document Footer (NO LINKS) */}
      <div className="doc-footer-meta">
        <div className="doc-footer-left">
          <span>Official Electronic Record — Department of Home Affairs, Commonwealth of Australia</span>
          <span>Valid as at: {validAsAt}</span>
        </div>
        <div className="doc-footer-right">
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
};

export default VevoOfficialCertificateDoc;
