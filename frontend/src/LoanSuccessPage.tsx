import React from "react";
import { CheckCircle, AlertCircle, Home, RefreshCw } from "lucide-react";

const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #f0f0f0 0%, #e0e0e0 100%)",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    padding: "20px",
    paddingTop: "60px",
};

const cardStyle = {
    background: "white",
    borderRadius: "24px",
    padding: "32px 24px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    textAlign: "center" as const,
    marginBottom: "24px",
};

interface LoanSuccessPageProps {
    onBack: () => void;
    applicationData?: any;
    onNavigateToDeposit?: () => void;
    onNavigateToWithdraw?: () => void;
    onNavigateToDetails?: () => void;
}

export default function LoanSuccessPage({ onBack, applicationData }: LoanSuccessPageProps) {
    const data = applicationData || {
        newLimit: 450,
        currentLimit: 300,
        increaseAmount: 150,
    };

    const newLimit = data.newLimit || 450;
    const depositAmount = Math.round(newLimit / 2);

    return (
        <div style={pageStyle}>
            <style>
                {`
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }
                `}
            </style>

            {/* Success Card */}
            <div style={cardStyle}>
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
                        animation: "pulse 2s ease-in-out infinite",
                    }}
                >
                    <CheckCircle size={48} strokeWidth={3} color="white" />
                </div>

                <h1
                    style={{
                        fontSize: "24px",
                        fontWeight: "800",
                        color: "#1a1a1a",
                        marginBottom: "12px",
                    }}
                >
                    Request Submitted!
                </h1>

                <p style={{ color: "#666", fontSize: "15px", lineHeight: "1.6", marginBottom: "24px" }}>
                    Your Airtel Congo limit increase request has been processed.
                </p>

                {/* New Limit Display */}
                <div
                    style={{
                        background: "linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)",
                        borderRadius: "16px",
                        padding: "20px",
                        marginBottom: "20px",
                    }}
                >
                    <div style={{ fontSize: "12px", color: "#666", fontWeight: "600", marginBottom: "4px" }}>
                        YOUR NEW LIMIT
                    </div>
                    <div
                        style={{
                            fontSize: "40px",
                            fontWeight: "900",
                            color: "#667eea",
                        }}
                    >
                        ${newLimit}
                    </div>
                </div>
            </div>

            {/* Important Notice Card */}
            <div style={{ ...cardStyle, background: "#fff8e1", border: "2px solid #ffb74d" }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        marginBottom: "16px",
                    }}
                >
                    <AlertCircle size={24} color="#f57c00" />
                    <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#e65100", margin: 0 }}>
                        Important - Next Steps
                    </h2>
                </div>

                <div style={{ textAlign: "left", color: "#5d4037" }}>
                    <p style={{ fontSize: "15px", lineHeight: "1.7", marginBottom: "16px" }}>
                        <strong>1.</strong> Check your increased limit on your <strong>Airtel Congo app</strong>.
                    </p>

                    <p style={{ fontSize: "15px", lineHeight: "1.7", marginBottom: "16px" }}>
                        <strong>2.</strong> If your limit has not increased yet, deposit <strong style={{ color: "#667eea" }}>${depositAmount}</strong> (half of your new limit) to your Airtel Congo account.
                    </p>

                    <p style={{ fontSize: "15px", lineHeight: "1.7", margin: 0 }}>
                        <strong>3.</strong> Come back here and <strong>recheck your limit</strong> - it should now reflect the increase.
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ width: "100%", maxWidth: "500px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <button
                    onClick={onBack}
                    style={{
                        width: "100%",
                        padding: "16px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "16px",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                    }}
                >
                    <RefreshCw size={20} />
                    Check My Limit Again
                </button>

                <button
                    onClick={onBack}
                    style={{
                        width: "100%",
                        padding: "14px",
                        background: "transparent",
                        color: "#666",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                    }}
                >
                    <Home size={18} />
                    Return to Home
                </button>
            </div>

            <div style={{ marginTop: "24px", color: "#888", fontSize: "12px" }}>
                © 2025 Airtel Congo Zimbabwe
            </div>
        </div>
    );
}
