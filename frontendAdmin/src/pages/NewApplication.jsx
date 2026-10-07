import React, { useEffect, useState } from "react";
import { createClient } from "../api/client.api";
import "../styles/NewApplication.css";

function NewApplication({ onOpenFaq }) {
  const [formData, setFormData] = useState({
    applicationCategory: "Student Visa",
    givenName: "",
    surname: "",
    gender: "Male",
    address: "",
    email: "",
    phone: "",
    dob: "",
    countryOfCitizenship: "",
    placeOfBirth: "",
    passportNumber: "",
    status: "Pending",
    paragraph: "Currently the status is pending, the application is under review.",
    agreedToTerms: true,
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [submittedClient, setSubmittedClient] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const standardDocOptions = [
    "Aadhar",
    "Photo",
    "Passport",
    "Qualification",
    "Tickets",
  ];

  const [selectedDocs, setSelectedDocs] = useState(["Passport", "Photo"]);
  const [isOtherChecked, setIsOtherChecked] = useState(false);
  const [otherDocInput, setOtherDocInput] = useState("");
  const [customDocs, setCustomDocs] = useState([]);

  const categories = [
    { id: "Student Visa", name: "Student Visa (Subclass 600)" },
    { id: "Tourist Visa", name: "Tourist Visa (Subclass 500)" },
    { id: "Work Visa", name: "Temporary Skill Shortage Visa (Subclass 482)" },
  ];

  const genders = [
    { id: "Male", name: "Male" },
    { id: "Female", name: "Female" },
    { id: "Other", name: "Other" }
  ];

  const statuses = [
    { id: "Pending", name: "Pending (Under Review)" },
    { id: "Issued", name: "Issued (In Effect / Active)" },
    { id: "Refused", name: "Refused" },
    { id: "Revoked", name: "Revoked" },
  ];

  useEffect(() => {
    document.title = "Create New Visa Application - Department of Home Affairs";
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMsg("");
  };

  const handleToggleStandardDoc = (docName) => {
    setSelectedDocs((prev) =>
      prev.includes(docName) ? prev.filter((d) => d !== docName) : [...prev, docName]
    );
  };

  const handleToggleOther = () => {
    setIsOtherChecked((prev) => !prev);
  };

  const handleAddCustomDoc = () => {
    const trimmed = otherDocInput.trim();
    if (trimmed && !customDocs.includes(trimmed) && !selectedDocs.includes(trimmed)) {
      setCustomDocs((prev) => [...prev, trimmed]);
      setOtherDocInput("");
    }
  };

  const handleRemoveCustomDoc = (indexToRemove) => {
    setCustomDocs((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.applicationCategory ||
      !formData.givenName ||
      !formData.email ||
      !formData.dob ||
      !formData.address ||
      !formData.phone ||
      !formData.placeOfBirth ||
      !formData.countryOfCitizenship ||
      !formData.passportNumber
    ) {
      setErrorMsg("Please fill in all required fields marked with *.");
      window.scrollTo({ top: 150, behavior: "smooth" });
      return;
    }

    if (!formData.agreedToTerms) {
      setErrorMsg("You must accept the officer certification to log this application.");
      window.scrollTo({ top: 150, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const given = formData.givenName.trim();
    const surname = (formData.surname || "").trim();
    const fullName = surname ? `${given} ${surname}` : given;

    const payload = {
      Category: formData.applicationCategory,
      FullName: fullName,
      FamilyName: surname,
      GivenNames: given,
      Email: formData.email.trim(),
      Gender: formData.gender,
      Address: formData.address.trim(),
      telephone: formData.phone.trim(),
      DOB: formData.dob,
      POB: formData.placeOfBirth.trim(),
      CountryofCitizenship: formData.countryOfCitizenship.trim(),
      PassportNumber: formData.passportNumber.trim(),
      Status: formData.status || "Pending",
      Paragraph: formData.paragraph || "Currently the status is pending, the application is under review.",
      Documents: [...selectedDocs, ...customDocs],
    };

    try {
      const result = await createClient(payload);
      setSubmittedClient(result);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setErrorMsg(err.message || "An error occurred while creating client application.");
      setIsSubmitting(false);
      window.scrollTo({ top: 150, behavior: "smooth" });
    }
  };

  const handleReset = () => {
    setFormData({
      applicationCategory: "Student Visa",
      givenName: "",
      surname: "",
      gender: "Male",
      address: "",
      email: "",
      phone: "",
      dob: "",
      countryOfCitizenship: "",
      placeOfBirth: "",
      passportNumber: "",
      status: "Pending",
      paragraph: "Currently the status is pending, the application is under review.",
      agreedToTerms: true,
    });
    setSelectedDocs(["Passport", "Photo"]);
    setIsOtherChecked(false);
    setOtherDocInput("");
    setCustomDocs([]);
    setSubmittedClient(null);
    setErrorMsg("");
  };

  if (submittedClient) {
    return (
      <div style={{ maxWidth: "850px", margin: "0 auto" }}>
        <div className="section-heading">
          <h1 className="section-heading__title">Application Lodged Successfully</h1>
          <p className="section-heading__desc">
            Official visa record logged into the Department of Home Affairs central repository.
          </p>
        </div>

        <div className="admin-card">
          <div className="alert-box alert-box--success">
            <div>
              <strong style={{ fontSize: "1.05rem", display: "block" }}>
                ✓ Record Registered with Reference: {submittedClient.PassportNumber || submittedClient._id}
              </strong>
              <p style={{ margin: "4px 0 0", fontSize: "0.88rem" }}>
                The applicant record is active and will now return accurate results on VEVO and ImmiAccount checks.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", margin: "20px 0", background: "#F8FAFC", padding: "16px", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
            <div>
              <span style={{ fontSize: "0.8rem", color: "#64748B", display: "block" }}>Visa Category:</span>
              <strong style={{ color: "#002B49" }}>{submittedClient.Category}</strong>
            </div>
            <div>
              <span style={{ fontSize: "0.8rem", color: "#64748B", display: "block" }}>Applicant Full Name:</span>
              <strong style={{ color: "#002B49" }}>{submittedClient.FullName}</strong>
            </div>
            <div>
              <span style={{ fontSize: "0.8rem", color: "#64748B", display: "block" }}>Passport Number:</span>
              <strong style={{ fontFamily: "monospace", color: "#004D79" }}>{submittedClient.PassportNumber}</strong>
            </div>
            <div>
              <span style={{ fontSize: "0.8rem", color: "#64748B", display: "block" }}>Email Address:</span>
              <span>{submittedClient.Email}</span>
            </div>
            <div>
              <span style={{ fontSize: "0.8rem", color: "#64748B", display: "block" }}>Initial Visa Status:</span>
              <span className={`status-badge ${submittedClient.Status?.toLowerCase()}`}>
                {submittedClient.Status || "Pending"}
              </span>
            </div>
          </div>

          {submittedClient.Documents && submittedClient.Documents.length > 0 && (
            <div style={{ margin: "16px 0 20px", padding: "14px", background: "#F8FAFC", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
              <span style={{ fontSize: "0.8rem", color: "#64748B", display: "block", marginBottom: "8px", fontWeight: 600 }}>
                Uploaded Supporting Documents:
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {submittedClient.Documents.map((doc, idx) => (
                  <span key={idx} className="doc-pill">
                    ✓ {doc}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            <button type="button" onClick={handleReset} className="primary-button">
              + Add Another Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "880px", margin: "0 auto" }}>
      <div className="section-heading">
        <h1 className="section-heading__title">Create New Visa Application</h1>
        <p className="section-heading__desc">
          Enroll new visa applicant data into the Department of Home Affairs processing database.
        </p>
      </div>

      {errorMsg && (
        <div className="alert-box alert-box--error" role="alert">
          <strong>⚠ </strong>
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Section 1: Visa Category */}
        <div className="admin-card">
          <h2 className="admin-card__title">1. Visa Stream &amp; Classification</h2>

          <div className="form-group">
            <label htmlFor="applicationCategory">
              Select Visa Category <span className="req">*</span>
            </label>
            <select
              id="applicationCategory"
              value={formData.applicationCategory}
              onChange={(e) => handleChange("applicationCategory", e.target.value)}
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section 2: Personal Information */}
        <div className="admin-card">
          <h2 className="admin-card__title">2. Applicant Personal &amp; Identification Details</h2>

          <div className="form-grid-2col">
            <div className="form-group">
              <label htmlFor="givenName">
                Given Name(s) <span className="req">*</span>
              </label>
              <input
                id="givenName"
                type="text"
                value={formData.givenName}
                onChange={(e) => handleChange("givenName", e.target.value)}
                placeholder="First and middle names as in passport"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="surname">
                Surname / Family Name <span style={{ fontSize: "0.82rem", color: "#64748B", fontWeight: "normal" }}>(Optional)</span>
              </label>
              <input
                id="surname"
                type="text"
                value={formData.surname}
                onChange={(e) => handleChange("surname", e.target.value)}
                placeholder="e.g. CITIZEN (Leave blank if not applicable)"
              />
            </div>
          </div>

          <div className="form-grid-2col">
            <div className="form-group">
              <label htmlFor="gender">
                Gender <span className="req">*</span>
              </label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                required
              >
                {genders.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dob">
                Date of Birth <span className="req">*</span>
              </label>
              <input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-grid-2col">
            <div className="form-group">
              <label htmlFor="countryOfCitizenship">
                Country of Citizenship <span className="req">*</span>
              </label>
              <input
                id="countryOfCitizenship"
                type="text"
                value={formData.countryOfCitizenship}
                onChange={(e) => handleChange("countryOfCitizenship", e.target.value)}
                placeholder="e.g. Australia, India, United Kingdom"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="placeOfBirth">
                Place of Birth <span className="req">*</span>
              </label>
              <input
                id="placeOfBirth"
                type="text"
                value={formData.placeOfBirth}
                onChange={(e) => handleChange("placeOfBirth", e.target.value)}
                placeholder="City / State of birth"
                required
              />
            </div>
          </div>

          <div className="form-grid-2col">
            <div className="form-group">
              <label htmlFor="passportNumber">
                Passport / Travel Document Number <span className="req">*</span>
              </label>
              <input
                id="passportNumber"
                type="text"
                value={formData.passportNumber}
                onChange={(e) => handleChange("passportNumber", e.target.value)}
                placeholder="e.g. Z8493021"
                required
                style={{ fontFamily: "monospace", textTransform: "uppercase" }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                Telephone Number <span className="req">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+61 400 000 000"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">
              Residential Address <span className="req">*</span>
            </label>
            <input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Street address, City, State, Postcode"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email Address <span className="req">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="applicant@example.com"
              required
            />
          </div>
        </div>

        {/* Section 3: Lodged Supporting Documents */}
        <div className="admin-card">
          <h2 className="admin-card__title">3. Uploaded Supporting Documents</h2>
          <p style={{ fontSize: "0.85rem", color: "#64748B", margin: "-6px 0 12px" }}>
            Select verified documents lodged and attached with this application:
          </p>

          <div className="doc-checkbox-grid">
            {standardDocOptions.map((doc) => {
              const isChecked = selectedDocs.includes(doc);
              return (
                <label
                  key={doc}
                  className={`doc-checkbox-item ${isChecked ? "checked" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleStandardDoc(doc)}
                  />
                  <span>{doc}</span>
                </label>
              );
            })}

            <label
              className={`doc-checkbox-item ${isOtherChecked ? "checked" : ""}`}
            >
              <input
                type="checkbox"
                checked={isOtherChecked}
                onChange={handleToggleOther}
              />
              <span>Other</span>
            </label>
          </div>

          {isOtherChecked && (
            <div style={{ marginTop: "14px", padding: "12px", background: "#F8FAFC", borderRadius: "4px", border: "1px solid #E2E8F0" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#002B49", display: "block", marginBottom: "6px" }}>
                Add Other Document:
              </label>
              <div className="other-doc-input-wrap" style={{ marginTop: 0 }}>
                <input
                  type="text"
                  value={otherDocInput}
                  onChange={(e) => setOtherDocInput(e.target.value)}
                  placeholder="Enter other document name (e.g. Bank Statement, Police Clearance)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomDoc();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomDoc}
                  className="primary-button"
                  style={{ padding: "8px 16px", whiteSpace: "nowrap" }}
                >
                  + Add Document
                </button>
              </div>

              {customDocs.length > 0 && (
                <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {customDocs.map((doc, idx) => (
                    <span key={idx} className="doc-pill">
                      ✓ {doc}
                      <button
                        type="button"
                        className="doc-pill-remove"
                        onClick={() => handleRemoveCustomDoc(idx)}
                        title="Remove document"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 4: Status & Assessment Notes */}
        <div className="admin-card">
          <h2 className="admin-card__title">4. Initial Visa Status &amp; Processing Directives</h2>

          <div className="form-group">
            <label htmlFor="status">
              Initial Status <span className="req">*</span>
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              required
            >
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="paragraph">Status Explanation / Officer Remark</label>
            <textarea
              id="paragraph"
              rows="3"
              value={formData.paragraph}
              onChange={(e) => handleChange("paragraph", e.target.value)}
              placeholder="Enter assessment remarks or instruction paragraph displayed on enquiry portals"
            />
          </div>

          <div style={{ marginTop: "16px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <input
              id="agreeTerms"
              type="checkbox"
              checked={formData.agreedToTerms}
              onChange={(e) => handleChange("agreedToTerms", e.target.checked)}
              style={{ width: "18px", height: "18px", marginTop: "2px", cursor: "pointer" }}
            />
            <label htmlFor="agreeTerms" style={{ fontSize: "0.85rem", color: "#475569", cursor: "pointer" }}>
              I certify that all applicant details have been verified against original travel documents in compliance with Migration Regulations.
            </label>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Lodging Application..." : "+ Create Visa Application"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="outline-button"
            >
              Clear Form
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default NewApplication;
