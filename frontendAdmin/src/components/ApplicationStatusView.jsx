import React from "react";
import "../styles/ApplicationStatusView.css";

function ApplicationStatusView({ clientData, onNewSearch }) {
  const name = clientData?.FullName || clientData?.surname || "N/A";
  const passportNumber = clientData?.PassportNumber || clientData?.identNum || "N/A";
  const pob = clientData?.POB || clientData?.placeOfBirth || "N/A";
  const status = clientData?.Status || "In Process";
  const category = clientData?.Category || "N/A";
  const email = clientData?.Email || "N/A";
  const paragraph = clientData?.Paragraph || "Currently the status is pending, the application is under review.";
  const dob = clientData?.DOB ? new Date(clientData.DOB).toLocaleDateString() : "N/A";

  return (
    <div className="application-status-view">
      <div className="section-heading">
        <h1 className="section-heading__title">Application Status Details</h1>
      </div>

      <div className="status-card">
        <div className="status-card__summary">
          <div>
            <span className="status-card__label">Client Name:</span>{" "}
            <span className="status-card__value">{name}</span>
          </div>
          <div>
            <span className="status-card__label">Passport / ID Number:</span>{" "}
            <span className="status-card__code">{passportNumber}</span>
          </div>
          <div>
            <span className="status-card__label">Category:</span>{" "}
            <span className="status-card__value">{category}</span>
          </div>
          <div>
            <span className="status-card__label">Email:</span>{" "}
            <span className="status-card__value">{email}</span>
          </div>
          <div>
            <span className="status-card__label">Place of Birth:</span>{" "}
            <span className="status-card__value">{pob}</span>
          </div>
          <div>
            <span className="status-card__label">Date of Birth:</span>{" "}
            <span className="status-card__value">{dob}</span>
          </div>
          <div>
            <span className="status-card__label">Current Status:</span>{" "}
            <span className="status-pill">{status}</span>
          </div>
        </div>

        <h2 className="timeline__heading">Comment on Application</h2>
        <p className="timeline__comment">{paragraph}</p>
      </div>

      <div className="status-card__actions">
        <button type="button" onClick={onNewSearch} className="primary-button">
          Check Another Application
        </button>
      </div>
    </div>
  );
}

export default ApplicationStatusView;
