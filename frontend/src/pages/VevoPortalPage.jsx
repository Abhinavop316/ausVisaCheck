import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAClients } from '../api/client.api';
import VevoResultView from '../components/VevoResultView';
import EmailVisaModal from '../components/EmailVisaModal';
import { ChangePasswordModal, TermsModal, VevoSupportModal } from '../components/Modals';
import '../styles/VevoPortal.css';

const countriesList = [
  "Australia", "Afghanistan", "Albania", "Algeria", "Argentina", "Austria", "Bahamas", "Bahrain",
  "Bangladesh", "Belgium", "Brazil", "Bulgaria", "Cambodia", "Canada", "Chile", "China", "Colombia",
  "Croatia", "Cyprus", "Czech Republic", "Denmark", "Egypt", "Estonia", "Fiji", "Finland", "France",
  "Germany", "Ghana", "Greece", "Hong Kong", "Hungary", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Japan", "Jordan", "Kenya", "Kuwait", "Lebanon", "Malaysia", "Mexico", "Nepal",
  "Netherlands", "New Zealand", "Nigeria", "Norway", "Oman", "Pakistan", "Papua New Guinea", "Peru",
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Saudi Arabia", "Singapore", "South Africa",
  "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Taiwan", "Thailand", "Turkey",
  "United Arab Emirates", "United Kingdom", "United States", "Vietnam", "Zimbabwe"
];

const VevoPortalPage = () => {
  const navigate = useNavigate();

  const [docType, setDocType] = useState('');
  const [referenceType, setReferenceType] = useState('TRN');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [country, setCountry] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [visaResultData, setVisaResultData] = useState(null);

  // Modals
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isChangePwdOpen, setIsChangePwdOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const handleClear = () => {
    setDocType('');
    setReferenceType('TRN');
    setReferenceNumber('');
    setDobDay('');
    setDobMonth('');
    setDobYear('');
    setDocumentNumber('');
    setCountry('');
    setErrorMessage('');
  };

  const handleFillSample = (type = 'tourist') => {
    setDocType('Passport');
    if (type === 'tourist') {
      setDobDay('15');
      setDobMonth('08');
      setDobYear('1995');
      setDocumentNumber('Z8493021');
      setCountry('India');
    } else {
      setDobDay('22');
      setDobMonth('04');
      setDobYear('2001');
      setDocumentNumber('P4829103');
      setCountry('Australia');
    }
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setErrorMessage('');

    if (!docType) {
      setErrorMessage('Please select a document type.');
      return;
    }

    if (!dobDay || !dobMonth || !dobYear) {
      setErrorMessage('Please enter your complete Date of birth (Day, Month and Year).');
      return;
    }

    if (!documentNumber.trim()) {
      setErrorMessage('Please enter your Document number.');
      return;
    }

    if (docType === 'Passport' && !country) {
      setErrorMessage('Please select the Country of document.');
      return;
    }

    setLoading(true);

    const searchPassport = documentNumber.trim();

    try {
      let clientRecord = null;
      try {
        clientRecord = await getAClients({
          PassportNumber: searchPassport,
          identNum: searchPassport,
        });
      } catch (err) {
        console.log('Backend lookup fallback:', err.message);
      }

      const now = new Date();
      const options = { 
        timeZone: 'Australia/Sydney', 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const checkTimestamp = new Intl.DateTimeFormat('en-AU', options).format(now) + ' (AEST)';

      let visaResult;

      if (clientRecord && clientRecord.FullName) {
        const isStudent = clientRecord.Category === 'Student Visa';
        const isWork = clientRecord.Category === 'Work Visa';

        let familyName = clientRecord.FamilyName !== undefined ? clientRecord.FamilyName : '';
        let givenNames = clientRecord.GivenNames !== undefined ? clientRecord.GivenNames : '';

        if (!familyName && !givenNames && clientRecord.FullName) {
          if (clientRecord.FullName.includes(',')) {
            const parts = clientRecord.FullName.split(',');
            familyName = parts[0].trim();
            givenNames = parts.slice(1).join(' ').trim();
          } else {
            const parts = clientRecord.FullName.trim().split(' ');
            if (parts.length > 1) {
              familyName = parts[parts.length - 1];
              givenNames = parts.slice(0, parts.length - 1).join(' ');
            } else {
              familyName = '';
              givenNames = clientRecord.FullName.trim();
            }
          }
        }

        visaResult = {
          fullName: clientRecord.FullName,
          familyName: familyName,
          givenNames: givenNames,
          dateOfBirth: clientRecord.DOB ? new Date(clientRecord.DOB).toLocaleDateString('en-AU', { day: '2-digit', month: 'long', year: 'numeric' }) : `${dobDay}/${dobMonth}/${dobYear}`,
          documentType: docType,
          documentNumber: clientRecord.PassportNumber || searchPassport,
          countryOfCitizenship: clientRecord.CountryofCitizenship || country || 'Australia',
          visaDescription: isStudent 
            ? 'Student (subclass 600) Higher Education Sector' 
            : isWork 
            ? 'Temporary Skill Shortage (subclass 482) Medium-term Stream' 
            : 'Visitor (subclass 500) Tourist Stream',
          visaClass: isStudent ? 'TU' : isWork ? 'TSS' : 'FA',
          visaSubclass: isStudent ? '600' : isWork ? '482' : '500',
          visaStream: isStudent ? 'Higher Education Sector' : isWork ? 'Medium-term Stream' : 'Tourist',
          visaApplicant: 'Primary',
          visaGrantDate: '14 January 2026',
          visaExpiryDate: '14 January 2027',
          entriesAllowed: 'Multiple entries to and from Australia during the validity of your visa',
          periodOfStay: isStudent ? 'Course duration' : isWork ? '2 Year(s) from arrival' : '3 Month(s) from each arrival',
          mustNotArriveAfter: '14 January 2027',
          locationAtCheck: 'Offshore',
          status: clientRecord.Status || 'In effect',
          visaStatus: clientRecord.Status === 'Issued' ? 'Issued (In Effect / Active)' : (clientRecord.Status || 'Pending (Under Review)'),
          statusMessage: clientRecord.Paragraph || 'Your visa application is currently being processed by the Department of Home Affairs.',
          paragraph: clientRecord.Paragraph,
          referenceType: 'Passport',
          referenceNumber: searchPassport,
          checkTimestamp: checkTimestamp,
          conditions: isStudent ? [
            { code: '8105', title: 'WORK LIMITATION', desc: 'You cannot work more than 48 hours per fortnight when your course is in session.' },
            { code: '8202', title: 'MEET COURSE REQUIREMENTS', desc: 'You must remain enrolled in a registered course and maintain satisfactory attendance and progress.' },
            { code: '8501', title: 'MAINTAIN HEALTH INSURANCE', desc: 'You must maintain adequate arrangements for Overseas Student Health Cover (OSHC).' },
            { code: '8533', title: 'INFORM PROVIDER OF ADDRESS', desc: 'You must notify your education provider of your residential address within 7 days of arriving in Australia.' }
          ] : [
            { code: '8101', title: 'NO WORK', desc: 'You must not engage in work in Australia while holding this visa.' },
            { code: '8201', title: 'MAXIMUM 3 MONTHS STUDY', desc: 'You must not study or train for more than 3 months in total in Australia.' },
            { code: '8503', title: 'NO FURTHER STAY', desc: 'The holder will not be entitled to be granted a substantive visa while remaining in Australia.' }
          ],
          documents: clientRecord.Documents && clientRecord.Documents.length > 0 ? clientRecord.Documents : ['Passport', 'Photo', 'Aadhar']
        };
      } else {
        const isStudentRef = searchPassport.startsWith('S');
        visaResult = {
          fullName: 'JOHN MICHAEL CITIZEN',
          familyName: 'CITIZEN',
          givenNames: 'JOHN MICHAEL',
          dateOfBirth: `${dobDay} ${['January','February','March','April','May','June','July','August','September','October','November','December'][parseInt(dobMonth, 10) - 1] || 'August'} ${dobYear}`,
          documentType: docType,
          documentNumber: searchPassport.toUpperCase(),
          countryOfCitizenship: country || 'India',
          visaDescription: isStudentRef ? 'Student (subclass 600) Higher Education Sector' : 'Visitor (subclass 500) Tourist Stream',
          visaClass: isStudentRef ? 'TU' : 'FA',
          visaSubclass: isStudentRef ? '600' : '500',
          visaStream: isStudentRef ? 'Higher Education' : 'Tourist',
          visaApplicant: 'Primary',
          visaGrantDate: '10 February 2026',
          visaExpiryDate: '10 February 2027',
          entriesAllowed: 'Multiple entries',
          periodOfStay: isStudentRef ? 'Course duration' : '3 Month(s) from each arrival',
          mustNotArriveAfter: '10 February 2027',
          locationAtCheck: 'Offshore',
          visaStatus: 'In effect',
          statusMessage: 'Your visa is currently In Effect and valid for travel to and stay in Australia.',
          referenceType: 'Passport',
          referenceNumber: searchPassport,
          checkTimestamp: checkTimestamp,
          conditions: [
            { code: '8101', title: 'NO WORK', desc: 'You must not engage in work in Australia while holding this visa.' },
            { code: '8201', title: 'MAXIMUM 3 MONTHS STUDY', desc: 'You must not study or train for more than 3 months in total in Australia.' },
            { code: '8503', title: 'NO FURTHER STAY', desc: 'The holder will not be entitled to be granted a substantive visa while remaining in Australia.' }
          ]
        };
      }

      setVisaResultData(visaResult);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vevo-portal-wrapper">
      {visaResultData ? (
        <VevoResultView 
          data={visaResultData} 
          onNewCheck={() => setVisaResultData(null)}
          onOpenEmailModal={() => setIsEmailModalOpen(true)}
        />
      ) : (
        <>
          {/* Top Navy Header matching screenshot */}
          <header className="vevo-portal-header no-print">
            <div className="vevo-portal-header-inner">
              <div className="portal-header-left">
                <Link to="/" title="Return to Home Affairs main site">
                  <img 
                    src="/logo.png" 
                    alt="Australian Government - Department of Home Affairs" 
                    className="portal-crest-logo"
                  />
                </Link>
              </div>

              <div className="portal-header-right">
                <div className="portal-help-link-wrap">
                  <button 
                    type="button" 
                    className="portal-help-link"
                    onClick={() => setIsSupportOpen(true)}
                  >
                    <span className="material-icons help-icon-sm">help</span>
                    <span>Help [on]</span>
                  </button>
                </div>
                <h1 className="portal-page-title">VEVO for Visa Holders</h1>
              </div>
            </div>
          </header>

          {/* Main Form Body matching screenshot */}
          <main className="vevo-portal-main">
            <div className="vevo-portal-container">
              <div className="portal-enquiry-card">
                {/* Card Header matching screenshot */}
                <div className="portal-card-header">
                  <h2>Visa holder enquiry</h2>
                </div>

              {/* Card Body */}
              <div className="portal-card-body">
                <p className="portal-instructions">
                  Please complete the following details to view your visa entitlements.<br />
                  Fields marked <span className="req-red">*</span> must be completed.
                </p>

                {errorMessage && (
                  <div className="portal-error-alert" role="alert">
                    <span className="material-icons">error_outline</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Quick Auto-fill bar */}
                <div className="portal-test-bar no-print">
                  <span className="test-label">Demo Test Data:</span>
                  <button type="button" className="test-chip" onClick={() => handleFillSample('tourist')}>
                    Tourist Visa Sample
                  </button>
                  <button type="button" className="test-chip" onClick={() => handleFillSample('student')}>
                    Student Visa Sample
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="portal-table-form" noValidate>
                  {/* Row 1: Document type */}
                  <div className="portal-form-row">
                    <div className="portal-form-label-col">
                      <label htmlFor="docTypeSelect">Document type</label>
                    </div>
                    <div className="portal-form-input-col">
                      <span className="req-red">*</span>
                      <select 
                        id="docTypeSelect"
                        className="portal-select"
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                      >
                        <option value="">Please choose a document type</option>
                        <option value="Passport">Passport</option>
                        <option value="ImmiCard">ImmiCard</option>
                        <option value="Titre de Voyage">Convention travel document (Titre de Voyage)</option>
                        <option value="DFTTA">Document for travel to Australia (DFTTA)</option>
                        <option value="PLO56">PLO56 evidence card</option>
                      </select>
                      <button 
                        type="button" 
                        className="portal-tooltip-icon" 
                        title="Select the travel document you used for your visa"
                        onClick={() => alert("Select the travel document (such as your passport or ImmiCard) linked to your current visa.")}
                      >
                        ?
                      </button>
                    </div>
                  </div>

                  {/* Dynamic fields when document type is chosen */}
                  {docType && (
                    <>
                      {/* Row 2: Date of birth */}
                      <div className="portal-form-row">
                        <div className="portal-form-label-col">
                          <label>Date of birth</label>
                        </div>
                        <div className="portal-form-input-col">
                          <span className="req-red">*</span>
                          <div className="portal-dob-group">
                            <input 
                              type="number"
                              min="1"
                              max="31"
                              className="portal-dob-day"
                              placeholder="DD"
                              value={dobDay}
                              onChange={(e) => setDobDay(e.target.value)}
                              required
                            />
                            <select 
                              className="portal-dob-month"
                              value={dobMonth}
                              onChange={(e) => setDobMonth(e.target.value)}
                              required
                            >
                              <option value="">Month</option>
                              <option value="01">Jan</option>
                              <option value="02">Feb</option>
                              <option value="03">Mar</option>
                              <option value="04">Apr</option>
                              <option value="05">May</option>
                              <option value="06">Jun</option>
                              <option value="07">Jul</option>
                              <option value="08">Aug</option>
                              <option value="09">Sep</option>
                              <option value="10">Oct</option>
                              <option value="11">Nov</option>
                              <option value="12">Dec</option>
                            </select>
                            <input 
                              type="number"
                              min="1900"
                              max="2026"
                              className="portal-dob-year"
                              placeholder="YYYY"
                              value={dobYear}
                              onChange={(e) => setDobYear(e.target.value)}
                              required
                            />
                          </div>
                          <button 
                            type="button" 
                            className="portal-tooltip-icon" 
                            title="Enter your Date of Birth as recorded in passport"
                            onClick={() => alert("Enter your Date of Birth (Day, Month, Year).")}
                          >
                            ?
                          </button>
                        </div>
                      </div>

                      {/* Row 5: Document number */}
                      <div className="portal-form-row">
                        <div className="portal-form-label-col">
                          <label htmlFor="docNumInput">Document number</label>
                        </div>
                        <div className="portal-form-input-col">
                          <span className="req-red">*</span>
                          <input 
                            id="docNumInput"
                            type="text"
                            className="portal-text-input"
                            value={documentNumber}
                            onChange={(e) => setDocumentNumber(e.target.value)}
                            placeholder="e.g. Z8493021"
                            required
                          />
                          <button 
                            type="button" 
                            className="portal-tooltip-icon" 
                            title="Do not confuse 'O' with '0' or 'I' with '1'"
                            onClick={() => alert("Check characters carefully so you do not confuse letter O with number 0.")}
                          >
                            ?
                          </button>
                        </div>
                      </div>

                      {/* Row 6: Country of document */}
                      {docType !== 'ImmiCard' && docType !== 'PLO56' && (
                        <div className="portal-form-row">
                          <div className="portal-form-label-col">
                            <label htmlFor="countrySelect">Country of document</label>
                          </div>
                          <div className="portal-form-input-col">
                            <span className="req-red">*</span>
                            <select 
                              id="countrySelect"
                              className="portal-select"
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              required
                            >
                              <option value="">Please choose a country</option>
                              {countriesList.map((c) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                            <button 
                              type="button" 
                              className="portal-tooltip-icon" 
                              title="Country of issue for the document"
                              onClick={() => alert("Select the issuing country of your travel document.")}
                            >
                              ?
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Row 7: Terms agreement */}
                      <div className="portal-terms-row">
                        <label className="portal-terms-label">
                          <input 
                            type="checkbox" 
                            checked={agreedTerms}
                            onChange={(e) => setAgreedTerms(e.target.checked)}
                          />
                          <span>
                            I have read, understood and agree to the{' '}
                            <button 
                              type="button" 
                              className="portal-terms-link"
                              onClick={() => setIsTermsOpen(true)}
                            >
                              Terms and Conditions
                            </button>.
                          </span>
                        </label>
                      </div>
                    </>
                  )}

                  {/* Form Action Buttons Bar matching screenshot */}
                  <div className="portal-form-actions-bar">
                    <button 
                      type="button" 
                      className="portal-btn portal-btn-clear" 
                      onClick={handleClear}
                      disabled={loading}
                    >
                      Clear
                    </button>
                    <button 
                      type="submit" 
                      className="portal-btn portal-btn-submit" 
                      disabled={loading}
                    >
                      {loading ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Bottom Footer Links matching screenshot */}
            <div className="portal-footer-links-bar no-print">
              <button type="button" className="portal-foot-link" onClick={() => alert("Accessibility guidelines supported.")}>
                Accessibility
              </button>
              <span className="pipe">|</span>
              <button type="button" className="portal-foot-link" onClick={() => alert("All VEVO transactions are encrypted and secured.")}>
                Online Security
              </button>
              <span className="pipe">|</span>
              <button type="button" className="portal-foot-link" onClick={() => alert("Privacy Act 1988 compliance.")}>
                Privacy
              </button>
              <span className="pipe">|</span>
              <button type="button" className="portal-foot-link" onClick={() => alert("Copyright Commonwealth of Australia.")}>
                Copyright & Disclaimer
              </button>
            </div>
          </div>
        </main>
      </>
    )}

      {/* Modals */}
      <EmailVisaModal 
        isOpen={isEmailModalOpen} 
        onClose={() => setIsEmailModalOpen(false)}
        visaData={visaResultData}
      />

      <ChangePasswordModal 
        isOpen={isChangePwdOpen} 
        onClose={() => setIsChangePwdOpen(false)}
      />

      <TermsModal 
        isOpen={isTermsOpen} 
        onClose={() => setIsTermsOpen(false)}
      />

      <VevoSupportModal 
        isOpen={isSupportOpen} 
        onClose={() => setIsSupportOpen(false)}
      />
    </div>
  );
};

export default VevoPortalPage;
