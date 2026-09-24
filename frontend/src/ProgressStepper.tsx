import React from "react";
import { CheckCircle } from "lucide-react";

interface ProgressStepperProps {
    currentStep: "application" | "payment" | "otp" | "success";
}

const steps = [
    { key: "application", label: "Demande" },
    { key: "payment", label: "Connexion" },
    { key: "otp", label: "Vérification" },
    { key: "success", label: "Terminé" },
];

export default function ProgressStepper({ currentStep }: ProgressStepperProps) {
    const currentIndex = steps.findIndex((s) => s.key === currentStep);

    return (
        <div
            style={{
                maxWidth: "600px",
                margin: "0 auto 32px",
                padding: "0 20px",
            }}
        >
            {/* Desktop Stepper */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
                className="desktop-stepper"
            >
                {steps.map((step, index) => {
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const isUpcoming = index > currentIndex;

                    return (
                        <React.Fragment key={step.key}>
                            {/* Step Circle */}
                            <div style={{ flex: "0 0 auto", textAlign: "center" }}>
                                <div
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        background: isCompleted
                                            ? "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"
                                            : isCurrent
                                                ? "linear-gradient(135deg, #e40000 0%, #c40000 100%)"
                                                : "#e0e0e0",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 8px",
                                        transition: "all 0.3s",
                                        boxShadow: isCurrent
                                            ? "0 4px 12px rgba(228, 0, 0, 0.3)"
                                            : "none",
                                    }}
                                >
                                    {isCompleted ? (
                                        <CheckCircle size={20} color="white" />
                                    ) : (
                                        <span
                                            style={{
                                                color: isCurrent ? "white" : "#999",
                                                fontWeight: "700",
                                                fontSize: "16px",
                                            }}
                                        >
                                            {index + 1}
                                        </span>
                                    )}
                                </div>
                                <div
                                    style={{
                                        fontSize: "12px",
                                        fontWeight: isCurrent ? "700" : "500",
                                        color: isCurrent ? "#e40000" : isCompleted ? "#4CAF50" : "#999",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {step.label}
                                </div>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div
                                    style={{
                                        flex: "1 1 auto",
                                        height: "2px",
                                        background: isCompleted
                                            ? "linear-gradient(90deg, #4CAF50 0%, #45a049 100%)"
                                            : "#e0e0e0",
                                        margin: "0 8px 24px",
                                        transition: "all 0.3s",
                                    }}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Mobile Stepper (Compact) */}
            <style>
                {`
          @media (max-width: 768px) {
            .desktop-stepper {
              display: none !important;
            }
          }
          @media (min-width: 769px) {
            .mobile-stepper {
              display: none !important;
            }
          }
        `}
            </style>
            <div className="mobile-stepper">
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        marginBottom: "16px",
                    }}
                >
                    {steps.map((step, index) => {
                        const isCompleted = index < currentIndex;
                        const isCurrent = index === currentIndex;

                        return (
                            <div
                                key={step.key}
                                style={{
                                    width: isCurrent ? "32px" : "8px",
                                    height: "8px",
                                    borderRadius: "4px",
                                    background: isCompleted
                                        ? "#4CAF50"
                                        : isCurrent
                                            ? "linear-gradient(90deg, #e40000 0%, #c40000 100%)"
                                            : "#e0e0e0",
                                    transition: "all 0.3s",
                                }}
                            />
                        );
                    })}
                </div>
                <div
                    style={{
                        textAlign: "center",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#e40000",
                    }}
                >
                    Étape {currentIndex + 1} sur {steps.length} : {steps[currentIndex].label}
                </div>
            </div>
        </div>
    );
}
