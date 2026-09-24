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

interface WithdrawPageProps {
    onBack: () => void;
    loanAmount?: number;
    userName?: string;
    AirtelCongoAccount?: string;
}

export default function WithdrawPage({
    onBack,
    loanAmount = 109,
    userName = "Client",
    AirtelCongoAccount = "0991234567"
}: WithdrawPageProps) {
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
                <h1 style={titleStyle}>Retirer des Fonds</h1>
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
                        Montant du Prêt Disponible
                    </div>
                    <div style={{
                        fontSize: "32px",
                        fontWeight: "900",
                        background: "linear-gradient(135deg, #e40000 0%, #c40000 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}>${loanAmount}</div>
                </div>

                {/* Instructions */}
                <div style={instructionsTitleStyle}>Instructions de Retrait :</div>

                <div style={stepStyle}>
                    <div style={stepNumberStyle}>1</div>
                    <div style={stepTextStyle}>
                        Ouvrez l'application Airtel Money ou composez le <strong>*501#</strong> ou <strong>*151#</strong> sur votre mobile.
                    </div>
                </div>

                <div style={stepStyle}>
                    <div style={stepNumberStyle}>2</div>
                    <div style={stepTextStyle}>
                        Sélectionnez <strong>« Retirer de l'argent »</strong> ou l'option de transfert souhaitée.
                    </div>
                </div>

                <div style={stepStyle}>
                    <div style={stepNumberStyle}>3</div>
                    <div style={stepTextStyle}>
                        Entrez le montant que vous souhaitez retirer (jusqu'à <strong>${loanAmount} USD</strong>).
                    </div>
                </div>

                <div style={stepStyle}>
                    <div style={stepNumberStyle}>4</div>
                    <div style={stepTextStyle}>
                        Suivez les instructions pour finaliser le virement vers votre compte Airtel Money RDC.
                    </div>
                </div>

                <div style={stepStyle}>
                    <div style={stepNumberStyle}>5</div>
                    <div style={stepTextStyle}>
                        Attendez le SMS de confirmation officiel d'Airtel RDC.
                    </div>
                </div>

                <div style={stepStyle}>
                    <div style={stepNumberStyle}>6</div>
                    <div style={stepTextStyle}>
                        Assurez-vous que votre dépôt de garantie de 10% a bien été vérifié.
                    </div>
                </div>

                {/* Note Box */}
                <div style={noteBoxStyle}>
                    <div style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "#1976d2",
                        marginBottom: "8px",
                    }}>ℹ️ Avis Important</div>
                    <div style={{
                        fontSize: "13px",
                        color: "#1976d2",
                        lineHeight: "1.6",
                    }}>
                        Les retraits s'effectuent instantanément sur votre solde Airtel Money une fois les conditions remplies.
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
                        <strong>✓ Une fois le retrait confirmé</strong>, les fonds seront utilisables immédiatement via Airtel Money ou en agence.
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
                    J'ai Effectué le Retrait
                </button>
            </div>
        </div>
    );
}
