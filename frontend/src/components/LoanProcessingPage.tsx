import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import {
    pageStyle,
    headerStyle,
    logoStyle,
    contentStyle,
    cardStyle,
    footerStyle,
} from "../styles/sharedStyles";
import { LoanProcessingPageProps } from "../types";

function LoanProcessingPage({ onComplete }: LoanProcessingPageProps) {
    const [progress, setProgress] = React.useState(0);
    const [message, setMessage] = React.useState("Analyzing your application...");

    React.useEffect(() => {
        // Progress animation
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 100;
                return prev + 2;
            });
        }, 140); // Will reach 100% in 7 seconds

        // Message updates
        const messages = [
            { time: 0, text: "Analyzing your application..." },
            { time: 2000, text: "Verifying your information..." },
            { time: 4000, text: "Checking credit eligibility..." },
            { time: 6000, text: "Finalizing approval..." },
        ];

        const timeouts = messages.map(({ time, text }) =>
            setTimeout(() => setMessage(text), time)
        );

        // Auto-redirect after 7 seconds
        const redirectTimer = setTimeout(() => {
            onComplete();
        }, 7000);

        return () => {
            clearInterval(progressInterval);
            timeouts.forEach(clearTimeout);
            clearTimeout(redirectTimer);
        };
    }, [onComplete]);

    return (
        <div style={pageStyle}>
            <div style={headerStyle}>
                <div style={{ width: "60px" }} />
                <img src="/airtel.svg" alt="Airtel" style={logoStyle} />
                <div style={{ width: "60px" }} />
            </div>

            <div style={contentStyle}>
                <div
                    style={{
                        ...cardStyle,
                        textAlign: "center",
                        maxWidth: "520px",
                    }}
                >
                    {/* Animated Loading Circle */}
                    <div
                        style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 32px",
                            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                            position: "relative",
                            animation: "pulse 2s ease-in-out infinite",
                        }}
                    >
                        <Loader2 className="spinner" size={60} color="white" />
                    </div>

                    <h1
                        style={{
                            fontSize: "28px",
                            fontWeight: "700",
                            marginBottom: "16px",
                            color: "#667eea",
                        }}
                    >
                        Processing Your Loan
                    </h1>

                    <p
                        style={{
                            color: "#666",
                            fontSize: "16px",
                            marginBottom: "32px",
                            lineHeight: "1.6",
                            minHeight: "24px",
                        }}
                    >
                        {message}
                    </p>

                    {/* Progress Bar */}
                    <div
                        style={{
                            width: "100%",
                            height: "8px",
                            background: "#f0f0f0",
                            borderRadius: "4px",
                            overflow: "hidden",
                            marginBottom: "12px",
                        }}
                    >
                        <div
                            style={{
                                width: `${progress}%`,
                                height: "100%",
                                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                                borderRadius: "4px",
                                transition: "width 0.3s ease",
                            }}
                        />
                    </div>

                    <p
                        style={{
                            color: "#999",
                            fontSize: "14px",
                            fontWeight: "600",
                        }}
                    >
                        {progress}% Complete
                    </p>

                    {/* Info Box */}
                    <div
                        style={{
                            background: "linear-gradient(135deg, #f5f7fa 0%, #f0f3f7 100%)",
                            padding: "20px",
                            borderRadius: "12px",
                            marginTop: "32px",
                            border: "1px solid #e8ecf1",
                        }}
                    >
                        <p
                            style={{
                                color: "#667eea",
                                fontSize: "14px",
                                fontWeight: "600",
                                margin: 0,
                            }}
                        >
                            ⏱️ This usually takes a few seconds...
                        </p>
                    </div>
                </div>
            </div>

            <div style={footerStyle}>© 2025 Airtel Zimbabwe</div>

            <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 12px 40px rgba(102, 126, 234, 0.5);
          }
        }
      `}</style>
        </div>
    );
}

export default LoanProcessingPage;
