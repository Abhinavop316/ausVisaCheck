import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import NavDrawer from '../components/NavDrawer';
import SearchDialog from '../components/SearchDialog';
import HeroBanner from '../components/HeroBanner';
import OverviewTab from './OverviewTab';
import VisaHoldersTab from './VisaHoldersTab';
import OrganisationsTab from './OrganisationsTab';
import VevoEnquiryForm from '../components/VevoEnquiryForm';
import VevoResultView from '../components/VevoResultView';
import EmailVisaModal from '../components/EmailVisaModal';
import { ChangePasswordModal, TermsModal, VevoSupportModal } from '../components/Modals';
import Footer from '../components/Footer';

const VevoHomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(tabParam);
  const [vevoResultData, setVevoResultData] = useState(null);

  // Modals state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isChangePwdOpen, setIsChangePwdOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    window.scrollTo({ top: 340, behavior: 'smooth' });
  };

  const handleCheckSuccess = (result) => {
    setVevoResultData(result);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleNewCheck = () => {
    setVevoResultData(null);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleSearchSelect = (term) => {
    if (term.toLowerCase().includes('holder') || term.toLowerCase().includes('step')) {
      handleTabChange('visa-holders');
    } else if (term.toLowerCase().includes('org') || term.toLowerCase().includes('employ')) {
      handleTabChange('for-organisations');
    } else {
      handleTabChange('check-portal');
    }
  };

  return (
    <div className="homeaffairs-app-shell">
      {/* Header matching screenshot */}
      <Header 
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCheckVevo={() => handleTabChange('check-portal')}
      />

      {/* Hero Banner with exact diagonal split, apple blossom flowers & attached tabs */}
      <HeroBanner 
        activeTab={activeTab} 
        onSelectTab={handleTabChange} 
      />

      {/* Main Content Area */}
      <main className="vevo-main-content-container" role="main">
        <div className="container">
          {activeTab === 'overview' && (
            <OverviewTab 
              onSelectTab={handleTabChange}
              onOpenCheckPortal={() => handleTabChange('check-portal')}
            />
          )}

          {activeTab === 'visa-holders' && (
            <VisaHoldersTab 
              onSelectTab={handleTabChange}
              onOpenCheckPortal={() => handleTabChange('check-portal')}
              onOpenChangePassword={() => setIsChangePwdOpen(true)}
              onOpenSupportModal={() => setIsSupportOpen(true)}
            />
          )}

          {activeTab === 'for-organisations' && (
            <OrganisationsTab 
              onSelectTab={handleTabChange}
              onOpenCheckPortal={() => handleTabChange('check-portal')}
            />
          )}

          {activeTab === 'check-portal' && (
            <div className="check-portal-container">
              {vevoResultData ? (
                <VevoResultView 
                  data={vevoResultData} 
                  onNewCheck={handleNewCheck}
                  onOpenEmailModal={() => setIsEmailModalOpen(true)}
                />
              ) : (
                <VevoEnquiryForm 
                  onCheckSuccess={handleCheckSuccess}
                  onOpenTerms={() => setIsTermsOpen(true)}
                  onOpenHelp={() => handleTabChange('visa-holders')}
                />
              )}
            </div>
          )}
        </div>
      </main>

      {/* Floating "Ask a question" Orange Button matching screenshot */}
      <button 
        type="button" 
        className="exact-ask-question-floating no-print"
        onClick={() => setIsSupportOpen(true)}
        title="Ask a question / VEVO Support"
      >
        <span>Ask a question</span>
      </button>

      {/* Footer */}
      <Footer 
        onOpenCheckVevo={() => handleTabChange('check-portal')}
        onOpenSupportModal={() => setIsSupportOpen(true)}
        onSelectTab={handleTabChange}
      />

      {/* Slide-out Navigation Drawer */}
      <NavDrawer 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        onSelectTab={handleTabChange}
      />

      {/* Search Dialog */}
      <SearchDialog 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)}
        onSelectSearchResult={handleSearchSelect}
      />

      {/* Email Visa Modal */}
      <EmailVisaModal 
        isOpen={isEmailModalOpen} 
        onClose={() => setIsEmailModalOpen(false)}
        visaData={vevoResultData}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={isChangePwdOpen} 
        onClose={() => setIsChangePwdOpen(false)}
      />

      {/* Terms and Conditions Modal */}
      <TermsModal 
        isOpen={isTermsOpen} 
        onClose={() => setIsTermsOpen(false)}
      />

      {/* VEVO Online Support Modal */}
      <VevoSupportModal 
        isOpen={isSupportOpen} 
        onClose={() => setIsSupportOpen(false)}
      />
    </div>
  );
};

export default VevoHomePage;
