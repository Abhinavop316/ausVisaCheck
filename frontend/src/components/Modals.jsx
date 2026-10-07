import React, { useState } from 'react';
import '../styles/Modals.css';

export const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [docNum, setDocNum] = useState('');
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (newPwd.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPwd !== confirmPwd) {
      setError('New password and confirmation password do not match.');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <span className="material-icons modal-icon">lock</span>
            <h3>Change VEVO Password</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        {success ? (
          <div className="modal-body modal-success-body">
            <span className="material-icons success-big-icon">check_circle</span>
            <h4>Password Updated Successfully</h4>
            <p>Your VEVO access password has been updated in Home Affairs systems.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body">
            {error && (
              <div className="modal-alert-error">
                <span className="material-icons">error_outline</span>
                <span>{error}</span>
              </div>
            )}

            <div className="modal-form-group">
              <label className="modal-label">Passport / Document Number <span className="req-star">*</span></label>
              <input 
                type="text" 
                className="modal-input" 
                placeholder="e.g. Z8493021"
                value={docNum}
                onChange={(e) => setDocNum(e.target.value)}
                required
              />
            </div>

            <div className="modal-form-group">
              <label className="modal-label">Current VEVO Password <span className="req-star">*</span></label>
              <input 
                type="password" 
                className="modal-input" 
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                required
              />
            </div>

            <div className="modal-form-group">
              <label className="modal-label">New VEVO Password <span className="req-star">*</span></label>
              <input 
                type="password" 
                className="modal-input" 
                placeholder="Minimum 8 characters"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                required
              />
            </div>

            <div className="modal-form-group">
              <label className="modal-label">Confirm New Password <span className="req-star">*</span></label>
              <input 
                type="password" 
                className="modal-input" 
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                required
              />
            </div>

            <div className="modal-footer-actions">
              <button type="button" className="modal-btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="modal-btn-primary">
                Save Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-card-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <span className="material-icons modal-icon">policy</span>
            <h3>VEVO Terms and Conditions of Use</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="modal-body terms-scrollable-body">
          <h4>1. Authorised Access & Purpose</h4>
          <p>
            The Visa Entitlement Verification Online (VEVO) service is provided by the Australian Department of Home Affairs to verify current visa details and work/study conditions of non-citizens in Australia.
          </p>

          <h4>2. Privacy & Personal Information</h4>
          <p>
            Your personal information is protected by law, including the <em>Privacy Act 1988 (Cth)</em>. Personal information provided when using VEVO is collected for the purpose of verifying visa entitlement and administering Australian immigration law.
          </p>

          <h4>3. Accuracy of Search Data</h4>
          <p>
            VEVO information is extracted directly from Department systems at the date and time of request. Visa holders and authorised third parties must ensure accurate details are supplied.
          </p>

          <h4>4. Work & Study Conditions</h4>
          <p>
            Visa holders must comply with all conditions listed on their in-effect visa. Breaching visa conditions may result in cancellation of the visa under the <em>Migration Act 1958</em>.
          </p>
        </div>

        <div className="modal-footer-actions">
          <button type="button" className="modal-btn-primary" onClick={onClose}>
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};

export const VevoSupportModal = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [passport, setPassport] = useState('');
  const [issue, setIssue] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <span className="material-icons modal-icon">contact_support</span>
            <h3>Visa Entitlement Online Enquiry Form</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        {submitted ? (
          <div className="modal-body modal-success-body">
            <span className="material-icons success-big-icon">task_alt</span>
            <h4>Enquiry Submitted to Home Affairs</h4>
            <p>Your enquiry reference is <strong>HA-VEVO-{(Math.random() * 1000000).toFixed(0)}</strong>. A departmental support officer will respond within 2 business days.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body">
            <p className="modal-intro-text">
              Use this departmental form if you receive an error message or need assistance retrieving your reference number.
            </p>

            <div className="modal-form-group">
              <label className="modal-label">Full Name <span className="req-star">*</span></label>
              <input 
                type="text" 
                className="modal-input" 
                placeholder="Full name as on passport"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="modal-form-group">
              <label className="modal-label">Email Address <span className="req-star">*</span></label>
              <input 
                type="email" 
                className="modal-input" 
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="modal-form-group">
              <label className="modal-label">Passport / Travel Document Number <span className="req-star">*</span></label>
              <input 
                type="text" 
                className="modal-input" 
                placeholder="e.g. Z8493021"
                value={passport}
                onChange={(e) => setPassport(e.target.value)}
                required
              />
            </div>

            <div className="modal-form-group">
              <label className="modal-label">Description of Enquiry / Error Message <span className="req-star">*</span></label>
              <textarea 
                className="modal-textarea" 
                rows="4"
                placeholder="Explain the issue encountered or copy the exact error message text..."
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                required
              />
            </div>

            <div className="modal-footer-actions">
              <button type="button" className="modal-btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="modal-btn-primary">
                Submit Enquiry
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export const LanguageModal = ({ isOpen, onClose, currentLanguage, onSelectLanguage }) => {
  if (!isOpen) return null;

  const languages = [
    { code: 'en', name: 'English (Original)', native: 'English' },
    { code: 'zh', name: 'Chinese (Simplified)', native: '简体中文' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
    { code: 'ar', name: 'Arabic', native: 'العربية' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'ko', name: 'Korean', native: '한국어' },
    { code: 'ja', name: 'Japanese', native: '日本語' },
    { code: 'tl', name: 'Tagalog / Filipino', native: 'Tagalog' },
    { code: 'fr', name: 'French', native: 'Français' },
    { code: 'de', name: 'German', native: 'Deutsch' },
    { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
    { code: 'th', name: 'Thai', native: 'ไทย' },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <span className="material-icons modal-icon">translate</span>
            <h3>Select Language / Translation</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-intro-text">
            Choose your preferred display language for Home Affairs information:
          </p>

          <div className="language-grid">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                className={`language-choice-btn ${currentLanguage === lang.name ? 'active-lang' : ''}`}
                onClick={() => {
                  onSelectLanguage(lang.name);
                  onClose();
                }}
              >
                <strong>{lang.name}</strong>
                <span className="native-lang-label">{lang.native}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="modal-footer-actions">
          <button type="button" className="modal-btn-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
