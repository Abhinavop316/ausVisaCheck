import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Head from "./components/Head";
import Breadcrumbs from "./components/Breadcrumbs";
import NewApplication from "./pages/NewApplication";
import ReportProblem from "./components/ReportProblem";
import FaqModal from "./components/FaqModal";
import Footer from "./components/Footer";
import "./styles/App.css";
import EditAppplication from "./pages/EditAppplication";
import AdminLogin from "./pages/AdminLogin";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem("adminAuthToken") ? true : false;
  });

  const handleSearchSubmit = (query) => {
    if (!query) return;
    alert(`Searching IRCC for: "${query}"`);
  };

  const handleLoginSuccess = (token) => {
    sessionStorage.setItem("adminAuthToken", token || "authenticated");
    setIsAdminLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthToken");
    setIsAdminLoggedIn(false);
  };

  return (
    <div className="app-shell">
      <Head
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      <Breadcrumbs isAdminLoggedIn={isAdminLoggedIn} />

      <main className="app-shell__main" role="main">
        <Routes>
          <Route path="/" element={<Navigate to="/Admin-Login" replace />} />
          <Route
            path="/Admin-Login"
            element={
              <AdminLogin
                isAdminLoggedIn={isAdminLoggedIn}
                onLoginSuccess={handleLoginSuccess}
                onLogout={handleLogout}
              />
            }
          />
          <Route
            path="/new-application"
            element={
              isAdminLoggedIn ? (
                <NewApplication onOpenFaq={() => setIsFaqOpen(true)} />
              ) : (
                <Navigate to="/Admin-Login" replace />
              )
            }
          />
          <Route
            path="/edit-application"
            element={
              isAdminLoggedIn ? (
                <EditAppplication onOpenFaq={() => setIsFaqOpen(true)} />
              ) : (
                <Navigate to="/Admin-Login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/Admin-Login" replace />} />
        </Routes>

        <ReportProblem />
      </main>

      {isFaqOpen && <FaqModal onClose={() => setIsFaqOpen(false)} />}

      <Footer />
    </div>
  );
}

export default App;
