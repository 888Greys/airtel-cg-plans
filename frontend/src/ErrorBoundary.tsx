import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console (in production, you'd send to error tracking service)
        console.error("ErrorBoundary caught an error:", error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    handleGoHome = () => {
        this.handleReset();
        window.location.href = "/";
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div
                    style={{
                        minHeight: "100vh",
                        background: "linear-gradient(to bottom, #f0f0f0 0%, #e0e0e0 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "20px",
                    }}
                >
                    <div
                        style={{
                            background: "white",
                            padding: "40px",
                            borderRadius: "16px",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            maxWidth: "500px",
                            width: "100%",
                            textAlign: "center",
                        }}
                    >
                        {/* Error Icon */}
                        <div
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 24px",
                                boxShadow: "0 8px 24px rgba(239, 68, 68, 0.25)",
                            }}
                        >
                            <span style={{ fontSize: "40px", color: "white" }}>⚠️</span>
                        </div>

                        <h1
                            style={{
                                fontSize: "28px",
                                fontWeight: "700",
                                marginBottom: "12px",
                                color: "#1a1a1a",
                            }}
                        >
                            Oops! Something went wrong
                        </h1>

                        <p
                            style={{
                                color: "#666",
                                fontSize: "16px",
                                marginBottom: "24px",
                                lineHeight: "1.6",
                            }}
                        >
                            We encountered an unexpected error. Don't worry, your data is safe.
                        </p>

                        {/* Show error details in development */}
                        {import.meta.env.MODE === "development" && this.state.error && (
                            <details
                                style={{
                                    background: "#f9fafb",
                                    padding: "16px",
                                    borderRadius: "8px",
                                    marginBottom: "24px",
                                    textAlign: "left",
                                    border: "1px solid #e5e7eb",
                                }}
                            >
                                <summary
                                    style={{
                                        cursor: "pointer",
                                        fontWeight: "600",
                                        color: "#ef4444",
                                        marginBottom: "8px",
                                    }}
                                >
                                    Error Details (Development Only)
                                </summary>
                                <pre
                                    style={{
                                        fontSize: "12px",
                                        color: "#374151",
                                        overflow: "auto",
                                        margin: "8px 0 0 0",
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {this.state.error.toString()}
                                    {this.state.errorInfo && (
                                        <>
                                            {"\n\n"}
                                            {this.state.errorInfo.componentStack}
                                        </>
                                    )}
                                </pre>
                            </details>
                        )}

                        {/* Action Buttons */}
                        <div
                            style={{
                                display: "flex",
                                gap: "12px",
                                justifyContent: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            <button
                                onClick={this.handleReset}
                                style={{
                                    padding: "14px 28px",
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                                    transition: "all 0.2s",
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.4)";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
                                }}
                            >
                                Try Again
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                style={{
                                    padding: "14px 28px",
                                    background: "white",
                                    color: "#667eea",
                                    border: "2px solid #667eea",
                                    borderRadius: "8px",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = "#f5f7ff";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = "white";
                                }}
                            >
                                Go to Home
                            </button>
                        </div>

                        {/* Help Text */}
                        <p
                            style={{
                                marginTop: "24px",
                                fontSize: "14px",
                                color: "#999",
                            }}
                        >
                            If the problem persists, please contact support
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
