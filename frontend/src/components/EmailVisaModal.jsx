import React, { useState } from 'react';
import '../styles/Modals.css';

const EmailVisaModal = ({ isOpen, onClose, visaData }) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderEmail, setSenderEmail] = useState(visaData?.Email || '');
  const [notes, setNotes] = useState('');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!recipientEmail || !senderEmail) {
      alert('Please provide both recipient and sender email addresses.');
      return;
    }

    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 2000);
    }, 1000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <span className="material-icons modal-icon">email</span>
            <h3>Email Visa Details from VEVO</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        {sentSuccess ? (
          <div className="modal-body modal-success-body">
            <span className="material-icons success-big-icon">check_circle</span>
            <h4>Official VEVO Statement Sent!</h4>
            <p>
              An official copy of the visa entitlement verification statement has been dispatched to <strong>{recipientEmail}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="modal-body">
            <p className="modal-intro-text">
              VEVO contains your personal information. Verify the recipient's email address carefully before transmitting your visa record.
            </p>

            <div className="modal-form-group">
              <label className="modal-label">Recipient email address <span className="req-star">*</span></label>
              <input 
                type="email" 
                className="modal-input" 
                placeholder="e.g. employer@company.com.au or admissions@university.edu.au"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
              />
            </div>

            <div className="modal-form-group">
              <label className="modal-label">Your email address <span className="req-star">*</span></label>
              <input 
                type="email" 
                className="modal-input" 
                placeholder="e.g. yourname@example.com"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                required
              />
            </div>

            <div className="modal-form-group">
              <label className="modal-label">Optional message / reference</label>
              <textarea 
                className="modal-textarea" 
                rows="3"
                placeholder="Include any application reference or note for the recipient..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="modal-attachment-notice">
              <span className="material-icons">attachment</span>
              <span>Attached: Official Australian Home Affairs VEVO Status Certificate (PDF)</span>
            </div>

            <div className="modal-footer-actions">
              <button type="button" className="modal-btn-cancel" onClick={onClose} disabled={sending}>
                Cancel
              </button>
              <button type="submit" className="modal-btn-primary" disabled={sending}>
                {sending ? 'Sending VEVO Statement...' : 'Send Email'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EmailVisaModal;
