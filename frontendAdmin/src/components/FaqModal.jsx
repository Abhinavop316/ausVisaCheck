import React from "react";
import "../styles/FaqModal.css";

function FaqModal({ onClose }) {
  return (
    <div className="faq-modal">
      <div className="faq-modal__dialog">
        <button
          type="button"
          onClick={onClose}
          className="faq-modal__close"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="faq-modal__title">Client Application Status - Frequently Asked Questions</h2>

        <div className="faq-modal__content">
          <div className="faq-modal__item">
            <h3 className="faq-modal__question">Where can I find my Unique Client Identifier (UCI)?</h3>
            <p className="faq-modal__answer">
              Your UCI (also known as a Client ID) is an 8 or 10-digit number formatted as (xxxx-xxxx) or (xx-xxxx-xxxx). You can find it on official IRCC letters, study/work permits, or permanent resident cards.
            </p>
          </div>

          <div className="faq-modal__item">
            <h3 className="faq-modal__question">How often is the application status updated?</h3>
            <p className="faq-modal__answer">
              Application status information is updated daily. Check back regularly to see progress updates on your file.
            </p>
          </div>

          <div className="faq-modal__item">
            <h3 className="faq-modal__question">What should I do if my contact information changes?</h3>
            <p className="faq-modal__answer">
              You must notify IRCC immediately using the Web Form to update your address, email, or telephone number to prevent missing important updates.
            </p>
          </div>
        </div>

        <div className="faq-modal__actions">
          <button
            type="button"
            onClick={onClose}
            className="primary-button primary-button--small"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default FaqModal;
