import React, { useState } from "react";
import "../styles/ReportProblem.css";

function ReportProblem() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [detailText, setDetailText] = useState("");

  const toggleProblem = (id) => {
    if (selectedProblems.includes(id)) {
      setSelectedProblems(selectedProblems.filter((p) => p !== id));
    } else {
      setSelectedProblems([...selectedProblems, id]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="report-problem">
      <div className="report-problem__panel">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="report-problem__toggle"
        >
          <span>Report a problem or mistake on this page</span>
          <span className="report-problem__toggle-icon">
            {isOpen ? "▲" : "▼"}
          </span>
        </button>

        {isOpen && (
          <div className="report-problem__content">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <fieldset className="report-problem__fieldset">
                  <legend className="report-problem__legend">
                    Please select all that apply:
                  </legend>
                  <div className="report-problem__options">
                    {[
                      { id: "p1", label: "Something is broken" },
                      { id: "p2", label: "The page has spelling or grammar mistakes" },
                      { id: "p3", label: "The information is wrong" },
                      { id: "p4", label: "The information is outdated" },
                      { id: "p5", label: "I can't find what I'm looking for" },
                      { id: "p6", label: "Other" },
                    ].map((item) => (
                      <div key={item.id} className="report-problem__option">
                        <input
                          id={item.id}
                          type="checkbox"
                          checked={selectedProblems.includes(item.id)}
                          onChange={() => toggleProblem(item.id)}
                          className="report-problem__checkbox"
                        />
                        <label
                          htmlFor={item.id}
                          className="report-problem__label"
                        >
                          {item.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>

                <div className="report-problem__detail">
                  <label
                    htmlFor="problem-detail"
                    className="report-problem__detail-label"
                  >
                    Provide more details (optional):
                  </label>
                  <input
                    id="problem-detail"
                    type="text"
                    value={detailText}
                    onChange={(e) => setDetailText(e.target.value)}
                    className="report-problem__input"
                  />
                </div>

                <button
                  type="submit"
                  className="primary-button primary-button--small"
                >
                  Submit
                </button>
              </form>
            ) : (
              <div className="report-problem__success">
                <h3 className="report-problem__success-title">
                  Thank you for your help!
                </h3>
                <p className="report-problem__success-text">
                  You will not receive a reply. For enquiries, please{" "}
                  <a
                    href="https://www.canada.ca/en/contact.html"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-link"
                  >
                    contact us
                  </a>
                  .
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="report-problem__version">
        <p>PRD Version 6.16.0_b4 Date: 2026-07-03 13:55</p>
      </div>
    </div>
  );
}

export default ReportProblem;
