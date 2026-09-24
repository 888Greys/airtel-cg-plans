import React from "react";
import { ArrowLeft, User, Smartphone, DollarSign, CheckCircle, Info } from "lucide-react";

const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #f0f0f0 0%, #e0e0e0 100%)",
    display: "flex",
    flexDirection: "column" as const,
    padding: "20px",
};

const headerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "32px",
    paddingTop: "20px",
};

const backButtonStyle = {
    background: "rgba(0, 0, 0, 0.05)",
    border: "none",
    borderRadius: "12px",
    padding: "12px",
    color: "#333",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s",
};

const titleStyle = {
    fontSize: "24px",
    fontWeight: "700",
    color: "#333",
    margin: 0,
};

const cardStyle = {
    background: "white",
    borderRadius: "24px",
    padding: "32px 24px",
    maxWidth: "500px",
    width: "100%",
    margin: "0 auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
};

const infoRowStyle = {
    marginBottom: "20px",
};

const labelStyle = {
    fontSize: "13px",
    fontWeight: "700",
    color: "#666",
    marginBottom: "6px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
};

const valueStyle = {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1a1a1a",
};

const highlightBoxStyle = {
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "20px",
};

const qualifiedBadgeStyle = {
    display: "inline-block",
    background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
    color: "white",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "700",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
};

const tipBoxStyle = {
    background: "#e3f2fd",
    border: "1px solid #2196F3",
    borderRadius: "12px",
    padding: "16px",
    marginTop: "20px",
};

const buttonStyle = {
    width: "100%",
    padding: "18px",
    background: "linear-gradient(135deg, #e40000 0%, #c40000 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "24px",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 4px 12px rgba(228, 0, 0, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
};

interface LoanDetailsPageProps {
    onBack: () => void;
    userName?: string;
    AirtelCongoAccount?: string;
    loanAmount?: number;
}

export default function LoanDetailsPage({
    onBack,
    userName = "Client",
    AirtelCongoAccount = "0991234567",
    loanAmount = 109
}: LoanDetailsPageProps) {
    const requestedAmount = loanAmount;
    const requiredDeposit = (requestedAmount * 0.1).toFixed(2);
    const loanWithBonus = (requestedAmount * 1.1).toFixed(2);

    return (
        <div style={pageStyle}>
            <div style={headerStyle}>
                <button
                    onClick={onBack}
                    style={backButtonStyle}
                    onMouseOver={(e) => e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)"}
                    onMouseOut={(e) => e.currentTarget.style.background = "rgba(0, 0, 0, 0.05)"}
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 style={titleStyle}>Détails du Prêt</h1>
            </div>

            <div style={cardStyle}>
                {/* User Information */}
                <div style={infoRowStyle}>
                    <div style={labelStyle}>
                        <User size={14} style={{ display: "inline", marginRight: "6px" }} />
                        Nom
                    </div>
                    <div style={valueStyle}>{userName}</div>
                </div>

                <div style={infoRowStyle}>
                    <div style={labelStyle}>
                        <Smartphone size={14} style={{ display: "inline", marginRight: "6px" }} />
                        Compte Airtel Money RDC
                    </div>
                    <div style={valueStyle}>{AirtelCongoAccount}</div>
                </div>

                {/* Requested Amount */}
                <div style={highlightBoxStyle}>
                    <div style={labelStyle}>
                        <DollarSign size={14} style={{ display: "inline", marginRight: "6px" }} />
                        Montant du Prêt Demandé
                    </div>
                    <div style={{
                        fontSize: "28px",
                        fontWeight: "900",
                        background: "linear-gradient(135deg, #e40000 0%, #c40000 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}>${requestedAmount}</div>
                </div>

                {/* Required Deposit */}
                <div style={infoRowStyle}>
                    <div style={labelStyle}>
                        Dépôt de Garantie Requis (10%)
                    </div>
                    <div style={valueStyle}>${requiredDeposit}</div>
                </div>

                {/* Loan Amount with Bonus */}
                <div style={infoRowStyle}>
                    <div style={labelStyle}>
                        Montant Total (avec bonus 10%)
                    </div>
                    <div style={valueStyle}>${loanWithBonus}</div>
                </div>

                {/* Qualified Badge */}
                <div style={{ textAlign: "center", marginTop: "24px" }}>
                    <div style={qualifiedBadgeStyle}>
                        <CheckCircle size={16} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
                        Éligible & Qualifié
                    </div>
                </div>

                {/* Tip Box */}
                <div style={tipBoxStyle}>
                    <div style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "#1976d2",
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                    }}>
                        <Info size={16} />
                        Conseil
                    </div>
                    <div style={{
                        fontSize: "13px",
                        color: "#1976d2",
                        lineHeight: "1.6",
                    }}>
                        Pour débloquer et retirer vos fonds, veillez à maintenir le dépôt de garantie de 10% sur votre compte Airtel Money RDC.
                    </div>
                </div>

                <button
                    onClick={onBack}
                    style={buttonStyle}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(228, 0, 0, 0.4)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(228, 0, 0, 0.3)";
                    }}
                >
                    <ArrowLeft size={20} />
                    Retour au Récapitulatif
                </button>
            </div>
        </div>
    );
}
