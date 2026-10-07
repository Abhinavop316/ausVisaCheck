import React from 'react';
import '../styles/VevoPage.css';

const OverviewTab = ({ onSelectTab }) => {
  return (
    <div className="exact-two-col-layout">
      {/* Left Sidebar Menu box */}
      <aside className="exact-sidebar-box no-print">
        <ul className="exact-sidebar-menu">
          <li className="exact-sidebar-item active">
            <button 
              type="button" 
              className="exact-side-link active-link"
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
        {/* Main Heading */}
        <h2 className="exact-h2-title">Check conditions online (VEVO)</h2>

        {/* Lead paragraph */}
        <p className="exact-paragraph">
          Visa Entitlement Verification Online (VEVO) allows visa holders, employers, education providers and other organisations to check visa conditions.
        </p>

        <p className="exact-paragraph">
          VEVO can only provide current visa information about visa holders whose details are available in our systems. You may not have a searchable record if you migrated to Australia before 1990 and have not travelled out of Australia. If this applies to you, you may need to request an{' '}
          <button 
            type="button" 
            className="exact-inline-link"
            onClick={() => onSelectTab('visa-holders')}
          >
            electronic record of your permanent visa
          </button>.
        </p>

        <p className="exact-paragraph">
          Some people may have an ImmiCard issued by us. You can check your{' '}
          <button 
            type="button" 
            className="exact-inline-link"
            onClick={() => onSelectTab('visa-holders')}
          >
            eligibility for an ImmiCard
          </button>. Government agencies can then use the ImmiCard to check a visa holder’s commencement of identity in Australia.
        </p>

        <p className="exact-paragraph">
          Australian citizens have unlimited work and study rights in Australia. You cannot use VEVO to confirm Australian citizenship. You can provide a copy of your Australian citizenship certificate or your Australian passport as proof of your Australian citizenship.
        </p>

        {/* Section: Workplace rights */}
        <h2 className="exact-h2-title mt-4">Workplace rights of visa holders</h2>
        <p className="exact-paragraph">
          Everyone working in Australia has basic rights and protections in the workplace, including minimum pay and conditions. Learn more about{' '}
          <button 
            type="button" 
            className="exact-inline-link"
            onClick={() => onSelectTab('visa-holders')}
          >
            workplace rights in Australia
          </button>.
        </p>

        {/* Section: Visa holders - opens in new tab */}
        <h2 className="exact-h2-title mt-4">Visa holders</h2>
        <p className="exact-paragraph">
          You can use VEVO to{' '}
          <a 
            href="/check-visa" 
            target="_blank" 
            rel="noopener noreferrer"
            className="exact-inline-action-link"
          >
            check your visa details and conditions <span className="exact-arrow-up">↗</span>
          </a>. Use VEVO to send proof of your visa conditions to others, for example, employers, landlords or the government of a country you would like to visit.
        </p>
        <p className="exact-paragraph">
          Learn{' '}
          <button 
            type="button" 
            className="exact-inline-link"
            onClick={() => onSelectTab('visa-holders')}
          >
            how to use VEVO
          </button>
        </p>

        {/* Section: Organisations - opens in new tab */}
        <h2 className="exact-h2-title mt-4">Organisations</h2>
        <p className="exact-paragraph">
          Registered organisations can{' '}
          <a 
            href="/check-visa" 
            target="_blank" 
            rel="noopener noreferrer"
            className="exact-inline-action-link"
          >
            check someone's visa details <span className="exact-arrow-up">↗</span>
          </a>.
        </p>
        <p className="exact-paragraph">
          <a 
            href="/check-visa" 
            target="_blank" 
            rel="noopener noreferrer"
            className="exact-inline-action-link"
          >
            Register for an ImmiAccount <span className="exact-arrow-up">↗</span>
          </a>{' '}
          and then use VEVO to see the visa conditions of visa holders who have given you permission.
        </p>
        <p className="exact-paragraph">
          Learn how to use{' '}
          <button 
            type="button" 
            className="exact-inline-link"
            onClick={() => onSelectTab('for-organisations')}
          >
            VEVO for organisations
          </button>.
        </p>
      </div>
    </div>
  );
};

export default OverviewTab;
