import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api/client.api";

function AdminLogin({ isAdminLoggedIn, onLoginSuccess, onLogout }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin Authentication - Department of Home Affairs";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMsg("Please enter both username and password.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = await adminLogin({ username: username.trim(), password });
      setIsSubmitting(false);
      onLoginSuccess(response.token || "admin-authenticated");
      navigate("/new-application");
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg(err.message || "Invalid admin credentials. Access denied.");
    }
  };

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      <div className="section-heading">
        <h1 className="section-heading__title">Department of Home Affairs — Administration Portal</h1>
        <p className="section-heading__desc">
          Authorised system access for Department of Home Affairs visa processing officers.
        </p>
      </div>

      {isAdminLoggedIn ? (
        <div className="admin-card">
          <div className="alert-box alert-box--success">
            <div>
              <strong style={{ display: "block", fontSize: "1.05rem", marginBottom: "4px" }}>
                ✓ Authenticated as Administrator
              </strong>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>
                You have active administrative privileges to create and update visa applications in the Home Affairs database.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="primary-button"
              onClick={() => navigate("/new-application")}
            >
              + Create New Application
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/edit-application")}
            >
              Search &amp; Edit Application
            </button>
            <button
              type="button"
              className="danger-button"
              onClick={onLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      ) : (
        <div className="admin-card">
          <h2 className="admin-card__title">Officer Login</h2>

          {errorMsg && (
            <div className="alert-box alert-box--error" role="alert">
              <strong>⚠ </strong>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="admin-username">
                Username <span className="req">*</span>
              </label>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter officer username"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="admin-password">
                Password <span className="req">*</span>
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter officer password"
                required
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                type="submit"
                className="primary-button"
                disabled={isSubmitting}
                style={{ padding: "10px 28px" }}
              >
                {isSubmitting ? "Authenticating..." : "Log In to Portal"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminLogin;
