import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/VevoPage.css';

const orgAccessMatrix = [
  { org: 'Employers', category: 'Work entitlements', desc: 'Allows you to check the work rights of visa holders who are either prospective and/or current employees. VEVO will display whether a person has: unlimited work rights, limited work rights including a description of the work conditions, or no work rights.' },
  { org: 'Educational institutions', category: 'Study entitlements', desc: 'Allows you to check the study rights of students. VEVO will display whether a person has: unlimited study rights, limited study rights including study conditions, or no study rights.' },
  { org: 'Licensing authorities', category: 'Licensing eligibility', desc: 'Enables authorised licensing authorities to check the residence status and work rights of a person applying for a licence.' },
  { org: 'Commercial organisations', category: 'Residence status', desc: 'Allows organisations that need to know a person\'s residence status (such as telecommunication providers, real estate agents and financial institutions) to check if a person is living permanently or temporarily in Australia.' },
  { org: 'Government organisations', category: 'Immigration status', desc: 'Enables government departments and agencies to check whether a person is a temporary or permanent resident, or New Zealand citizen.' },
  { org: 'Medicare Australia', category: 'Medicare eligibility', desc: 'Only staff from Medicare/Services Australia can register for this category.' },
  { org: 'Migration agents', category: 'Migration agent', desc: 'Only Registered Migration Agents (RMA) with a valid MARN can register for this category to view all details of their client\'s in-effect visa.' }
];

const OrganisationsTab = ({ onSelectTab }) => {
  const navigate = useNavigate();

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
          <li className="exact-sidebar-item">
            <button 
              type="button" 
              className="exact-side-link"
              onClick={() => onSelectTab('visa-holders')}
            >
              Visa holders
            </button>
          </li>
          <li className="exact-sidebar-item active">
            <button 
              type="button" 
              className="exact-side-link active-link"
              onClick={() => onSelectTab('for-organisations')}
            >
              Organisations
            </button>
          </li>
        </ul>
      </aside>

      {/* Right Content Column */}
      <div className="exact-main-col">
        <h2 className="exact-h2-title">VEVO for organisations</h2>

        <h3 className="exact-h2-title mt-4" style={{ fontSize: '20px' }}>Register an organisation for VEVO</h3>
        <p className="exact-paragraph">
          Eligible organisations with a legitimate business need can access VEVO through ImmiAccount. Follow the instructions to create or join an organisation ImmiAccount.
        </p>

        <p className="exact-paragraph">
          The types of organisations that{' '}
          <a 
            href="/check-visa" 
            target="_blank" 
            rel="noopener noreferrer"
            className="exact-inline-action-link"
          >
            register for VEVO <span className="exact-arrow-up">↗</span>
          </a>{' '}
          include: Registered Migration Agents (RMAs), employers, labour suppliers, sharing economy organisations, education providers, financial institutions, real estate agents, telecommunication companies, and government agencies.
        </p>

        <h4 className="exact-h2-title mt-4" style={{ fontSize: '17px' }}>Step 1. Your identification numbers required</h4>
        <p className="exact-paragraph">
          To register you must have an Australian Business Number (ABN), Migration Agent Registration Number (MARN) if applicable, or CRICOS/RTO number for educational providers.
        </p>

        <h4 className="exact-h2-title mt-4" style={{ fontSize: '17px' }}>Step 2. Create an ImmiAccount</h4>
        <p className="exact-paragraph">
          Select Organisation, select Visa Entitlement Verification Online (VEVO) for organisations.
        </p>

        {/* Access Table */}
        <h3 className="exact-h2-title mt-4" style={{ fontSize: '20px' }}>Type of access given to organisations</h3>
        <div style={{ overflowX: 'auto', margin: '20px 0', border: '1px solid #CBD5E1' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F0F3F6', borderBottom: '2px solid #CBD5E1' }}>
                <th style={{ padding: '12px 16px', color: '#001B2E', width: '25%' }}>Organisation</th>
                <th style={{ padding: '12px 16px', color: '#001B2E', width: '25%' }}>Category</th>
                <th style={{ padding: '12px 16px', color: '#001B2E' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {orgAccessMatrix.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: '#002B49' }}>{item.org}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '500', color: '#006699' }}>{item.category}</td>
                  <td style={{ padding: '12px 16px', color: '#334155' }}>{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="exact-h2-title mt-4" style={{ fontSize: '20px' }}>Check someone's visa details with VEVO</h3>
        <p className="exact-paragraph">
          Only registered organisations that have a visa holder's permission can check visa details.
        </p>
        <a 
          href="/check-visa" 
          target="_blank" 
          rel="noopener noreferrer"
          className="exact-inline-action-link"
          style={{ fontWeight: '600', fontSize: '15px' }}
        >
          Check visa details online now <span className="exact-arrow-up">↗</span>
        </a>
      </div>
    </div>
  );
};

export default OrganisationsTab;
