import React from "react";
import { ArrowLeft, User, Smartphone, DollarSign, CheckCircle } from "lucide-react";

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

const instructionsTitleStyle = {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "16px",
    marginTop: "24px",
};

const stepStyle = {
    display: "flex",
    gap: "12px",
    marginBottom: "14px",
    lineHeight: "1.6",
};

const stepNumberStyle = {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #e40000 0%, #c40000 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "700",
    flexShrink: 0,
};

const stepTextStyle = {
    fontSize: "14px",
    color: "#333",
    flex: 1,
};

const noteBoxStyle = {
    background: "#fff3e0",
    border: "1px solid #ffb74d",
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

interface DepositPageProps {
    onBack: () => void;
    loanAmount?: number;
    userName?: string;
    AirtelCongoAccount?: string;
}

export default function DepositPage({
    onBack,
    loanAmount = 50,
    userName = "Test",
    AirtelCongoAccount = "0991234567"
}: DepositPageProps) {
    const requiredDeposit = (loanAmount * 0.1).toFixed(0);

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
                <h1 style={titleStyle}>Déposer des Fonds</h1>
            </div>

            <div style={cardStyle}>
                {/* Account Information */}
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

                <div style={{
                    ...infoRowStyle,
                    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "24px",
                }}>
                    <div style={labelStyle}>
                        <DollarSign size={14} style={{ display: "inline", marginRight: "6px" }} />
                        Dépôt de Garantie Requis (10%)
                    </div>
                    <div style={{
                        fontSize: "32px",
                        fontWeight: "900",
                        background: "linear-gradient(135deg, #e40000 0%, #c40000 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}>${requiredDeposit}</div>
                </div>

                {/* Instructions */}
                <div style={instructionsTitleStyle}>Instructions de Dépôt :</div>

                <div style={stepStyle}>
                    <div style={stepNumberStyle}>1</div>
                    <div style={stepTextStyle}>
                        Ouvrez votre application My Airtel ou composez le <strong>*501#</strong> ou <strong>*151#</strong> sur votre téléphone.
                    </div>
                </div>

                <div style={stepStyle}>
                    <div style={stepNumberStyle}>2</div>
                    <div style={stepTextStyle}>
                        Sélectionnez <strong>« Envoyer de l'argent »</strong> ou <strong>« Dépôt »</strong>.
                    </div>
                </div>

                <div style={stepStyle}>
                    <div style={stepNumberStyle}>3</div>
                    <div style={stepTextStyle}>
                        Entrez votre numéro de compte Airtel Money : <strong>{AirtelCongoAccount}</strong>.
                    </div>
                </div>

                <div style={stepStyle}>
                    <div style={stepNumberStyle}>4</div>
                    <div style={stepTextStyle}>
                        Entrez le montant : <strong>${requiredDeposit} USD</strong> (ou plus).
                    </div>
                </div>

                <div style={stepStyle}>
                    <div style={stepNumberStyle}>5</div>
                    <div style={stepTextStyle}>
                        Confirmez la transaction avec votre code PIN Airtel Money.
                    </div>
                </div>

                <div style={stepStyle}>
                    <div style={stepNumberStyle}>6</div>
                    <div style={stepTextStyle}>
                        Attendez le SMS de confirmation officiel d'Airtel RDC.
                    </div>
                </div>

                {/* Note Box */}
                <div style={noteBoxStyle}>
                    <div style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "#e65100",
                        marginBottom: "8px",
                    }}>💡 Conseil Utile</div>
                    <div style={{
                        fontSize: "13px",
                        color: "#e65100",
                        lineHeight: "1.6",
                    }}>
                        Si vous ne disposez pas des 10%, vous pouvez demander à un proche de transférer le montant sur votre compte Airtel Money RDC.
                    </div>
                </div>

                <div style={{
                    background: "#e8f5e9",
                    border: "1px solid #4CAF50",
                    borderRadius: "12px",
                    padding: "16px",
                    marginTop: "16px",
                }}>
                    <div style={{
                        fontSize: "13px",
                        color: "#2e7d32",
                        lineHeight: "1.6",
                    }}>
                        <strong>✓ Une fois le dépôt confirmé</strong>, les fonds de votre prêt seront débloqués pour retrait.
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
                    <CheckCircle size={20} />
                    J'ai Effectué le Dépôt
                </button>
            </div>
        </div>
    );
}
