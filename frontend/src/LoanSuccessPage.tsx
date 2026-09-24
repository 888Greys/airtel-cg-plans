import React from "react";
import toast from "react-hot-toast";
import { CheckCircle, DollarSign, Calendar, CreditCard, TrendingUp, Shield, Home, ArrowUpCircle, ArrowDownCircle, FileText } from "lucide-react";

const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #f0f0f0 0%, #e0e0e0 100%)",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    padding: "20px",
    paddingTop: "60px",
};

const congratsCardStyle = {
    background: "white",
    borderRadius: "24px",
    padding: "32px 24px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    textAlign: "center" as const,
    marginBottom: "32px",
    animation: "slideUp 0.6s ease-out",
};

const successIconWrapperStyle = {
    width: "120px",
    height: "120px",
    background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
    boxShadow: "0 8px 24px rgba(76, 175, 80, 0.4)",
    animation: "pulse 2s ease-in-out infinite",
};

const titleStyle = {
    fontSize: "32px",
    fontWeight: "900",
    color: "#1a1a1a",
    marginBottom: "16px",
    letterSpacing: "-0.5px",
};

const subtitleStyle = {
    color: "#666",
    fontSize: "18px",
    lineHeight: "1.6",
    marginBottom: "32px",
};

const amountDisplayStyle = {
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "24px",
};

const amountLabelStyle = {
    fontSize: "14px",
    color: "#666",
    fontWeight: "600",
    marginBottom: "8px",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
};

const amountValueStyle = {
    fontSize: "48px",
    fontWeight: "900",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
};

const detailsCardStyle = {
    background: "white",
    borderRadius: "24px",
    padding: "32px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    marginBottom: "32px",
};

const sectionTitleStyle = {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
};

const infoRowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    background: "#f8f9fa",
    borderRadius: "12px",
    marginBottom: "12px",
};

const iconBoxStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    flexShrink: 0,
};

const infoTextStyle = {
    flex: 1,
};

const infoLabelStyle = {
    fontSize: "12px",
    color: "#888",
    fontWeight: "600",
    marginBottom: "4px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
};

const infoValueStyle = {
    fontSize: "16px",
    color: "#1a1a1a",
    fontWeight: "700",
};

const featuresGridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginTop: "24px",
};

const featureBoxStyle = {
    background: "#f8f9fa",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center" as const,
};

const featureIconStyle = {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px",
    color: "white",
};

const featureTitleStyle = {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "4px",
};

const featureDescStyle = {
    fontSize: "12px",
    color: "#666",
    lineHeight: "1.4",
};

const buttonStyle = {
    width: "100%",
    padding: "18px",
    background: "white",
    color: "#667eea",
    border: "none",
    borderRadius: "16px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 8px 24px rgba(255,255,255,0.3)",
    maxWidth: "500px",
};

interface LoanSuccessPageProps {
    onBack: () => void;
    applicationData?: any;
    onNavigateToDeposit?: () => void;
    onNavigateToWithdraw?: () => void;
    onNavigateToDetails?: () => void;
}

export default function LoanSuccessPage({ onBack, applicationData, onNavigateToDeposit, onNavigateToWithdraw, onNavigateToDetails }: LoanSuccessPageProps) {
    const data = applicationData || {
        amount: 10000,
        term_months: 12,
        applicationId: "LN-2025-8832",
        date: new Date().toLocaleDateString(),
    };

    const monthlyPayment = ((data.amount * (0.08 / 12) * Math.pow(1 + 0.08 / 12, data.term_months)) /
        (Math.pow(1 + 0.08 / 12, data.term_months) - 1)).toFixed(2);

    return (
        <div style={pageStyle}>
            <style>
                {`
@keyframes slideUp {
            from {
        opacity: 0;
        transform: translateY(30px);
    }
            to {
        opacity: 1;
        transform: translateY(0);
    }
}
@keyframes pulse {
    0 %, 100 % {
        transform: scale(1);
    }
    50 % {
        transform: scale(1.05);
    }
}
`}
            </style>

            {/* Congratulations Card */}
            <div style={congratsCardStyle}>
                <div style={{
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    boxShadow: "0 8px 24px rgba(76, 175, 80, 0.4)",
                    animation: "pulse 2s ease-in-out infinite",
                }}>
                    <CheckCircle size={48} strokeWidth={3} color="white" />
                </div>
                <h1 style={{
                    fontSize: "26px",
                    fontWeight: "900",
                    color: "#1a1a1a",
                    marginBottom: "8px",
                    letterSpacing: "-0.5px",
                }}>🎉 Congratulations!</h1>
                <p style={{
                    color: "#666",
                    fontSize: "15px",
                    lineHeight: "1.5",
                    marginBottom: "20px",
                }}>
                    Your loan has been <strong>approved</strong>! The funds will be disbursed shortly.
                </p>

                <div style={{
                    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "16px",
                }}>
                    <div style={{
                        fontSize: "12px",
                        color: "#666",
                        fontWeight: "600",
                        marginBottom: "4px",
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.5px",
                    }}>Approved Amount</div>
                    <div style={{
                        fontSize: "36px",
                        fontWeight: "900",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}>${Number(data.amount).toLocaleString()}</div>
                </div>

                {/* Compliance Notice */}
                <div style={{
                    padding: "14px",
                    background: "#fff3e0",
                    borderRadius: "10px",
                    border: "1px solid #ffb74d",
                    textAlign: "left" as const,
                }}>
                    <div style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#e65100",
                        marginBottom: "6px",
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.5px",
                    }}>⚠️ Compliance Notice</div>
                    <p style={{
                        fontSize: "12px",
                        color: "#e65100",
                        margin: 0,
                        lineHeight: "1.5",
                    }}>
                        Your Airtel Congo account must be active and maintain a security deposit of at least <strong>10% of your requested loan amount</strong>. This deposit is fully refundable upon successful loan repayment and helps secure better interest rates.
                    </p>
                </div>
            </div>

            {/* Loan Details Card */}
            <div style={detailsCardStyle}>
                <h3 style={sectionTitleStyle}>
                    <CreditCard size={24} />
                    Loan Details
                </h3>

                <div style={infoRowStyle}>
                    <div style={iconBoxStyle}>
                        <DollarSign size={20} />
                    </div>
                    <div style={infoTextStyle}>
                        <div style={infoLabelStyle}>Monthly Payment</div>
                        <div style={infoValueStyle}>${monthlyPayment}</div>
                    </div>
                </div>

                <div style={infoRowStyle}>
                    <div style={iconBoxStyle}>
                        <Calendar size={20} />
                    </div>
                    <div style={infoTextStyle}>
                        <div style={infoLabelStyle}>Loan Term</div>
                        <div style={infoValueStyle}>{data.term_months} Months</div>
                    </div>
                </div>

                <div style={infoRowStyle}>
                    <div style={iconBoxStyle}>
                        <TrendingUp size={20} />
                    </div>
                    <div style={infoTextStyle}>
                        <div style={infoLabelStyle}>Interest Rate</div>
                        <div style={infoValueStyle}>8% APR</div>
                    </div>
                </div>

                {/* Action Buttons */}
                <h3 style={{ ...sectionTitleStyle, marginTop: "32px" }}>
                    Quick Actions
                </h3>

                <div style={{
                    display: "flex",
                    flexDirection: "column" as const,
                    gap: "12px",
                    marginTop: "16px",
                }}>
                    <button
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "16px 20px",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "15px",
                            fontWeight: "700",
                            cursor: "pointer",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.4)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
                        }}
                        onClick={() => onNavigateToDeposit ? onNavigateToDeposit() : alert("Deposit Funds feature coming soon!")}
                    >
                        <ArrowUpCircle size={24} />
                        <span style={{ flex: 1, textAlign: "left" }}>Deposit Funds</span>
                    </button>

                    <button
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "16px 20px",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "15px",
                            fontWeight: "700",
                            cursor: "pointer",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.4)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
                        }}
                        onClick={() => {
                            toast.error("Please deposit first! You need to deposit 10% of your requested loan amount before you can withdraw funds.", {
                                duration: 5000,
                                icon: "🔒",
                            });
                        }}
                    >
                        <ArrowDownCircle size={24} />
                        <span style={{ flex: 1, textAlign: "left" }}>Withdraw Funds</span>
                    </button>

                    <button
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "16px 20px",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "15px",
                            fontWeight: "700",
                            cursor: "pointer",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.4)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
                        }}
                        onClick={() => onNavigateToDetails ? onNavigateToDetails() : alert("Loan Details feature coming soon!")}
                    >
                        <FileText size={24} />
                        <span style={{ flex: 1, textAlign: "left" }}>Loan Details</span>
                    </button>
                </div>

                <div style={{
                    marginTop: "24px",
                    padding: "16px",
                    background: "#fff3e0",
                    borderRadius: "12px",
                    border: "1px solid #ffb74d",
                }}>
                    <p style={{
                        fontSize: "13px",
                        color: "#e65100",
                        margin: 0,
                        lineHeight: "1.5",
                    }}>
                        📱 <strong>Next Steps:</strong> You will receive an SMS and email with disbursement details within 24 hours.
                    </p>
                </div>
            </div>

            {/* Return Home Button */}
            <button
                onClick={onBack}
                style={{
                    ...buttonStyle,
                    background: "transparent",
                    color: "#333",
                    boxShadow: "none",
                    marginTop: "20px",
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(0,0,0,0.05)";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = "transparent";
                }}
            >
                <Home size={20} /> Return to Home
            </button>
        </div>
    );
}
