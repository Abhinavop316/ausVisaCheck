import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import VevoHomePage from "./pages/VevoHomePage";
import VevoPortalPage from "./pages/VevoPortalPage";
import "./index.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<VevoHomePage />} />
      <Route
        path="/visas/already-have-a-visa/check-visa-details-and-conditions/check-conditions-online"
        element={<VevoHomePage />}
      />
      <Route
        path="/visas/already-have-a-visa/check-visa-details-and-conditions/check-conditions-online/:subtab"
        element={<VevoHomePage />}
      />
      {/* VEVO for Visa Holders Enquiry Dedicated Portal */}
      <Route path="/check-visa" element={<VevoPortalPage />} />
      <Route path="/evo/firstParty" element={<VevoPortalPage />} />
      <Route path="/vevo-enquiry" element={<VevoPortalPage />} />
      <Route path="/visa-holder-enquiry" element={<VevoPortalPage />} />
      <Route path="/client-application-status" element={<VevoPortalPage />} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
