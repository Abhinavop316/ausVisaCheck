import React, { useEffect, useState } from "react";
import { getAClients, updateClient } from "../api/client.api";
import "../styles/NewApplication.css";

function EditAppplication({ onOpenFaq }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [selectedClient, setSelectedClient] = useState(null);

  const [formData, setFormData] = useState({
    Category: "",
    FullName: "",
    FamilyName: "",
    GivenNames: "",
    Email: "",
    Gender: "Male",
    Address: "",
    telephone: "",
    DOB: "",
    POB: "",
    CountryofCitizenship: "",
    PassportNumber: "",
    Status: "Pending",
    Paragraph: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const standardDocOptions = [
    "Aadhar",
    "Photo",
    "Passport",
    "Qualification",
    "Tickets",
  ];

  const [selectedDocs, setSelectedDocs] = useState([]);
  const [isOtherChecked, setIsOtherChecked] = useState(false);
  const [otherDocInput, setOtherDocInput] = useState("");
  const [customDocs, setCustomDocs] = useState([]);

  const categories = [
    { id: "Student Visa", name: "Student Visa (Subclass 600)" },
    { id: "Tourist Visa", name: "Tourist Visa (Subclass 500)" },
    { id: "Work Visa", name: "Temporary Skill Shortage Visa (Subclass 482)" },
  ];

  const statuses = [
    { id: "Pending", name: "Pending (Under Review)" },
    { id: "Issued", name: "Issued (In Effect / Active)" },
    { id: "Refused", name: "Refused" },
    { id: "Revoked", name: "Revoked" },
  ];

  useEffect(() => {
    document.title = "Search & Edit Application - Department of Home Affairs";
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchError("Please enter an Email or Passport / Reference Number to search.");
      return;
    }

    setIsSearching(true);
    setSearchError("");
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const payload = searchQuery.includes("@")
        ? { Email: searchQuery.trim() }
        : { PassportNumber: searchQuery.trim(), identNum: searchQuery.trim() };

      const client = await getAClients(payload);
      setSelectedClient(client);

      let famName = client.FamilyName !== undefined ? client.FamilyName : "";
      let givNames = client.GivenNames !== undefined ? client.GivenNames : "";
      if (!famName && !givNames && client.FullName) {
        if (client.FullName.includes(",")) {
          const parts = client.FullName.split(",");
          famName = parts[0].trim();
          givNames = parts.slice(1).join(" ").trim();
        } else {
          const parts = client.FullName.trim().split(" ");
          if (parts.length > 1) {
            famName = parts[parts.length - 1];
            givNames = parts.slice(0, parts.length - 1).join(" ");
          } else {
            famName = "";
            givNames = client.FullName;
          }
        }
      }

      setFormData({
        Category: client.Category || "Student Visa",
        FullName: client.FullName || "",
        FamilyName: famName,
        GivenNames: givNames,
        Email: client.Email || "",
        Gender: client.Gender || "Male",
        Address: client.Address || "",
        telephone: client.telephone || "",
        DOB: client.DOB ? client.DOB.split("T")[0] : "",
        POB: client.POB || "",
        CountryofCitizenship: client.CountryofCitizenship || "",
        PassportNumber: client.PassportNumber || "",
        Status: client.Status || "Pending",
        Paragraph: client.Paragraph || "",
      });

      const clientDocs = client.Documents || [];
      const standardSelected = clientDocs.filter((d) => standardDocOptions.includes(d));
      const customSelected = clientDocs.filter((d) => !standardDocOptions.includes(d));

      setSelectedDocs(standardSelected);
      setCustomDocs(customSelected);
      setIsOtherChecked(customSelected.length > 0);

      setIsSearching(false);
    } catch (err) {
      setIsSearching(false);
      setSelectedClient(null);
      setSearchError(err.message || "No visa application found matching your criteria.");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMsg("");
    setSuccessMsg("");
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
    if (!selectedClient || !selectedClient._id) {
      setErrorMsg("No client application loaded to edit.");
      return;
    }

    if (
      !formData.Category ||
      (!formData.FullName && !formData.GivenNames) ||
      !formData.Email ||
      !formData.PassportNumber
    ) {
      setErrorMsg("Please fill in required fields (Category, Given Name / Full Name, Email, Passport Number).");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const given = (formData.GivenNames || "").trim();
      const surname = (formData.FamilyName || "").trim();
      const fullName = surname ? (given ? `${given} ${surname}` : surname) : given || formData.FullName;

      const payload = {
        ...formData,
        FullName: fullName,
        FamilyName: surname,
        GivenNames: given,
        Documents: [...selectedDocs, ...customDocs],
      };
      const updated = await updateClient(selectedClient._id, payload);
      setSelectedClient(updated);
      setIsSubmitting(false);
      setSuccessMsg(`Visa record for ${updated.FullName} (${updated.PassportNumber}) has been updated successfully!`);
      window.scrollTo({ top: 150, behavior: "smooth" });
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg(err.message || "Failed to update visa application.");
      window.scrollTo({ top: 150, behavior: "smooth" });
    }
  };

  return (
    <div style={{ maxWidth: "880px", margin: "0 auto" }}>
      <div className="section-heading">
        <h1 className="section-heading__title">Edit Visa Application &amp; Status</h1>
        <p className="section-heading__desc">
          Search existing visa records by Passport Number or Email and update client status, remarks, or personal details.
        </p>
      </div>

      {/* Search Box Card */}
      <div className="admin-card">
        <h2 className="admin-card__title">Search Visa Record</h2>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: "240px" }}>
            <label htmlFor="searchQuery" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#002B49", marginBottom: "6px" }}>
              Passport / Document Number or Email Address
            </label>
            <input
              id="searchQuery"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Z8493021 or applicant@example.com"
              style={{ width: "100%", padding: "9px 12px", border: "1px solid #94A3B8", borderRadius: "3px" }}
            />
          </div>
          <button type="submit" className="primary-button" disabled={isSearching} style={{ minHeight: "40px" }}>
            {isSearching ? "Searching..." : "Search Application"}
          </button>
        </form>

        {searchError && (
          <div className="alert-box alert-box--error" style={{ marginTop: "14px" }} role="alert">
            <strong>⚠ </strong>
            <span>{searchError}</span>
          </div>
        )}
      </div>

      {/* Success / Error alerts */}
      {successMsg && (
        <div className="alert-box alert-box--success" role="alert">
          <strong>✓ </strong>
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="alert-box alert-box--error" role="alert">
          <strong>⚠ </strong>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Edit Form */}
      {selectedClient && (
        <form onSubmit={handleSubmit}>
          {/* Section 1: Visa Status & Decision Remarks */}
          <div className="admin-card">
            <h2 className="admin-card__title">Visa Decision &amp; Processing Status</h2>

            <div className="form-grid-2col">
              <div className="form-group">
                <label htmlFor="editStatus">
                  Visa Status <span className="req">*</span>
                </label>
                <select
                  id="editStatus"
                  value={formData.Status}
                  onChange={(e) => handleChange("Status", e.target.value)}
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
                <label htmlFor="editCategory">
                  Visa Category <span className="req">*</span>
                </label>
                <select
                  id="editCategory"
                  value={formData.Category}
                  onChange={(e) => handleChange("Category", e.target.value)}
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="editParagraph">Official Status Explanation Paragraph</label>
              <textarea
                id="editParagraph"
                rows="3"
                value={formData.Paragraph}
                onChange={(e) => handleChange("Paragraph", e.target.value)}
                placeholder="This message will be rendered to applicant on VEVO status checks..."
              />
            </div>
          </div>

          {/* Section 2: Applicant Personal Details */}
          <div className="admin-card">
            <h2 className="admin-card__title">Applicant Personal Details</h2>

            <div className="form-grid-2col">
              <div className="form-group">
                <label htmlFor="editGivenNames">
                  Given Name(s) <span className="req">*</span>
                </label>
                <input
                  id="editGivenNames"
                  type="text"
                  value={formData.GivenNames}
                  onChange={(e) => {
                    const val = e.target.value;
                    const fam = formData.FamilyName || "";
                    handleChange("GivenNames", val);
                    handleChange("FullName", fam.trim() ? `${val.trim()} ${fam.trim()}` : val.trim());
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="editFamilyName">
                  Surname / Family Name <span style={{ fontSize: "0.82rem", color: "#64748B", fontWeight: "normal" }}>(Optional)</span>
                </label>
                <input
                  id="editFamilyName"
                  type="text"
                  value={formData.FamilyName}
                  onChange={(e) => {
                    const val = e.target.value;
                    const giv = formData.GivenNames || "";
                    handleChange("FamilyName", val);
                    handleChange("FullName", val.trim() ? `${giv.trim()} ${val.trim()}` : giv.trim());
                  }}
                  placeholder="Leave blank if not applicable"
                />
              </div>
            </div>

            <div className="form-grid-2col">
              <div className="form-group">
                <label htmlFor="editPassport">
                  Passport Number <span className="req">*</span>
                </label>
                <input
                  id="editPassport"
                  type="text"
                  value={formData.PassportNumber}
                  onChange={(e) => handleChange("PassportNumber", e.target.value)}
                  required
                  style={{ fontFamily: "monospace", textTransform: "uppercase" }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="editEmail">
                  Email Address <span className="req">*</span>
                </label>
                <input
                  id="editEmail"
                  type="email"
                  value={formData.Email}
                  onChange={(e) => handleChange("Email", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-grid-2col">
              <div className="form-group">
                <label htmlFor="editCitizenship">Country of Citizenship</label>
                <input
                  id="editCitizenship"
                  type="text"
                  value={formData.CountryofCitizenship}
                  onChange={(e) => handleChange("CountryofCitizenship", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="editDob">Date of Birth</label>
                <input
                  id="editDob"
                  type="date"
                  value={formData.DOB}
                  onChange={(e) => handleChange("DOB", e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid-2col">
              <div className="form-group">
                <label htmlFor="editPhone">Telephone</label>
                <input
                  id="editPhone"
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => handleChange("telephone", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="editPob">Place of Birth</label>
                <input
                  id="editPob"
                  type="text"
                  value={formData.POB}
                  onChange={(e) => handleChange("POB", e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="editAddress">Residential Address</label>
              <input
                id="editAddress"
                type="text"
                value={formData.Address}
                onChange={(e) => handleChange("Address", e.target.value)}
              />
            </div>
          </div>

          {/* Section 3: Lodged Supporting Documents */}
          <div className="admin-card">
            <h2 className="admin-card__title">3. Uploaded Supporting Documents</h2>
            <p style={{ fontSize: "0.85rem", color: "#64748B", margin: "-6px 0 12px" }}>
              Update verified documents lodged and attached with this application:
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

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                type="submit"
                className="primary-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving Changes..." : "Save Application Changes"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default EditAppplication;
