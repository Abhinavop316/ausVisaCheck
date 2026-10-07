import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/VevoPage.css';

const visaTermsDictionary = [
  { term: 'Current date and time', meaning: 'Details of the time and date you checked VEVO.' },
  { term: 'Name', meaning: 'Shows your name as recorded in our systems.' },
  { term: 'Document / ImmiCard number', meaning: 'The travel document number that you used to make the VEVO query.' },
  { term: 'Visa class and subclass', meaning: 'Details of the visa you have been granted.' },
  { term: 'Visa streams or Education sector', meaning: 'The stream associated to the visa class and subclass of your visa. For example, Visitor Visa Tourist stream, Student Non-Award Sector.' },
  { term: 'Visa description', meaning: 'Type of visa granted, for example, Student, Visitor, Resident Return.' },
  { term: 'Visa applicant', meaning: 'Shows if you are the main (primary) visa applicant or a family member (secondary) applicant.' },
  { term: 'Visa grant date', meaning: 'The date the department made a decision to give you a visa.' },
  { term: 'Visa expiry date', meaning: 'For temporary visa holders: date period of stay ends. For permanent visa holders: date travel facility ends.' },
  { term: 'Visa status', meaning: '"In effect" means that your visa has started, but it will not be activated until you enter Australia. "Temporarily ceased" means your Visitor visa has temporarily ceased.' },
  { term: 'Visa grant number', meaning: 'The number that identifies your visa.' },
  { term: 'Entries allowed', meaning: 'Single entry (enter once) or Multiple entry (travel to and from Australia as many times as you want while visa is valid).' },
  { term: 'Must not arrive after date', meaning: 'You must enter Australia before this date. As long as you enter Australia before this date you are allowed to be in Australia for the stay period listed for your visa.' },
  { term: 'Period of stay', meaning: 'Tells you how long you are allowed to stay in Australia on your visa.' },
  { term: 'Location', meaning: 'Whether you are inside or outside Australia when you make a VEVO check.' },
  { term: 'Work entitlements', meaning: 'This will let you know whether you are allowed to work in Australia while holding the visa.' },
  { term: 'Workplace rights', meaning: 'Information to help you to understand your Australian workplace rights and protections.' },
  { term: 'Study entitlements', meaning: 'This will let you know whether you can undertake a course of study on your current visa.' },
  { term: 'Visa conditions', meaning: 'Tells you what you can and cannot do while in Australia on your visa.' }
];

const VisaHoldersTab = ({ onSelectTab, onOpenChangePassword }) => {
  const navigate = useNavigate();
  const [searchTableQuery, setSearchTableQuery] = useState('');

  const filteredTerms = visaTermsDictionary.filter(item => 
    item.term.toLowerCase().includes(searchTableQuery.toLowerCase()) ||
    item.meaning.toLowerCase().includes(searchTableQuery.toLowerCase())
  );

  return (
    <div className="exact-two-col-layout">
      {/* Left Sidebar Menu box */}
      <aside className="exact-sidebar-box no-print">
        <ul className="exact-sidebar-menu">
          <li className="exact-sidebar-item">
            <button 
              type="button" 
              className="exact-side-link"
              onClick={() => onSelectTab('overview')}
            >
              Check conditions online (VEVO)
            </button>
          </li>
          <li className="exact-sidebar-item active">
            <button 
              type="button" 
              className="exact-side-link active-link"
              onClick={() => onSelectTab('visa-holders')}
            >
              Visa holders
            </button>
          </li>
          <li className="exact-sidebar-item">
            <button 
              type="button" 
              className="exact-side-link"
              onClick={() => onSelectTab('for-organisations')}
            >
              Organisations
            </button>
          </li>
        </ul>
      </aside>

      {/* Right Content Column */}
      <div className="exact-main-col">
        <h2 className="exact-h2-title">VEVO for visa holders</h2>

        <h3 className="exact-h2-title mt-4" style={{ fontSize: '20px' }}>Using VEVO</h3>
        <p className="exact-paragraph">
          As a visa holder you can see your current visa details and conditions by using our{' '}
          <a 
            href="/check-visa" 
            target="_blank" 
            rel="noopener noreferrer"
            className="exact-inline-action-link"
          >
            Visa Entitlement Verification Online system (VEVO) <span className="exact-arrow-up">↗</span>
          </a>.
        </p>
        <p className="exact-paragraph">
          VEVO does not provide information on your previous visas or new applications that the Department may be assessing.
        </p>

        <h4 className="exact-h2-title mt-4" style={{ fontSize: '17px' }}>Step 1. Access VEVO</h4>
        <p className="exact-paragraph">
          You can access VEVO online at any time at{' '}
          <a 
            href="/check-visa" 
            target="_blank" 
            rel="noopener noreferrer"
            className="exact-inline-action-link"
          >
            Visa Entitlement Verification Online (VEVO) <span className="exact-arrow-up">↗</span>
          </a>.
        </p>

        <h4 className="exact-h2-title mt-4" style={{ fontSize: '17px' }}>Step 2. Have your travel document and reference number ready</h4>
        <p className="exact-paragraph">
          To see your visa details and conditions you will need information from a travel document such as your passport or ImmiCard. You will also need one of the following:
        </p>
        <ul className="exact-paragraph" style={{ paddingLeft: '24px', listStyleType: 'disc' }}>
          <li>transaction reference number (TRN)</li>
          <li>visa grant number</li>
          <li>visa evidence number</li>
        </ul>

        <h4 className="exact-h2-title mt-4" style={{ fontSize: '17px' }}>Step 3. Select 'Check your own visa details with VEVO'</h4>
        <p className="exact-paragraph">
          The visa holder enquiry screen will display.
        </p>

        <h4 className="exact-h2-title mt-4" style={{ fontSize: '17px' }}>Step 4. Select the type of travel document</h4>
        <p className="exact-paragraph">
          VEVO accepts: passport, ImmiCard, convention travel document – also known as a Titre de Voyage, document for travel to Australia (DFTTA), or PLO56 evidence card.
        </p>

        <h4 className="exact-h2-title mt-4" style={{ fontSize: '17px' }}>Step 5. Enter your personal information</h4>
        <p className="exact-paragraph">Enter your date of birth as recorded on your travel document.</p>

        <h4 className="exact-h2-title mt-4" style={{ fontSize: '17px' }}>Step 6. Enter your travel document number &amp; country</h4>
        <p className="exact-paragraph">When entering your travel document number, check that the details you entered are correct.</p>

        <h4 className="exact-h2-title mt-4" style={{ fontSize: '17px' }}>Step 7. Submit the information</h4>
        <p className="exact-paragraph">Click the box to accept VEVO terms and conditions, then select 'Submit'.</p>

        {/* Section: Understand your visa details and conditions */}
        <h3 className="exact-h2-title mt-4" style={{ fontSize: '20px' }}>Understand your visa details and conditions</h3>
        <p className="exact-paragraph">
          VEVO can show you the following details and conditions on your visa:
        </p>

        <div style={{ overflowX: 'auto', margin: '20px 0', border: '1px solid #CBD5E1' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F0F3F6', borderBottom: '2px solid #CBD5E1' }}>
                <th style={{ padding: '12px 16px', color: '#001B2E', width: '35%' }}>Visa details in VEVO</th>
                <th style={{ padding: '12px 16px', color: '#001B2E' }}>What it means</th>
              </tr>
            </thead>
            <tbody>
              {filteredTerms.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: '#002B49' }}>{row.term}</td>
                  <td style={{ padding: '12px 16px', color: '#334155' }}>{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VisaHoldersTab;
