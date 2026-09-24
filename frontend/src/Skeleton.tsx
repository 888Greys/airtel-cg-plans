import React from "react";

interface SkeletonProps {
    variant?: "text" | "card" | "circle" | "rectangular";
    width?: string;
    height?: string;
    size?: string; // For circle variant
    className?: string;
}

export default function Skeleton({
    variant = "text",
    width = "100%",
    height,
    size,
    className = "",
}: SkeletonProps) {
    const getStyles = (): React.CSSProperties => {
        const baseStyles: React.CSSProperties = {
            background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s ease-in-out infinite",
            borderRadius: "4px",
        };

        switch (variant) {
            case "text":
                return {
                    ...baseStyles,
                    width: width,
                    height: height || "16px",
                    marginBottom: "8px",
                };
            case "circle":
                const circleSize = size || "40px";
                return {
                    ...baseStyles,
                    width: circleSize,
                    height: circleSize,
                    borderRadius: "50%",
                };
            case "card":
                return {
                    ...baseStyles,
                    width: width,
                    height: height || "200px",
                    borderRadius: "12px",
                };
            case "rectangular":
                return {
                    ...baseStyles,
                    width: width,
                    height: height || "100px",
                };
            default:
                return baseStyles;
        }
    };

    return (
        <>
            <div style={getStyles()} className={className} />
            <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
        </>
    );
}

// Preset skeleton layouts for common use cases
export function FormSkeleton() {
    return (
        <div style={{ padding: "20px" }}>
            <Skeleton variant="text" width="150px" height="20px" />
            <Skeleton variant="rectangular" width="100%" height="48px" />
            <div style={{ marginTop: "20px" }}>
                <Skeleton variant="text" width="150px" height="20px" />
                <Skeleton variant="rectangular" width="100%" height="48px" />
            </div>
            <div style={{ marginTop: "20px" }}>
                <Skeleton variant="text" width="150px" height="20px" />
                <Skeleton variant="rectangular" width="100%" height="48px" />
            </div>
            <div style={{ marginTop: "30px" }}>
                <Skeleton variant="rectangular" width="100%" height="50px" />
            </div>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div
            style={{
                background: "white",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                <Skeleton variant="circle" size="60px" />
                <div style={{ marginLeft: "16px", flex: 1 }}>
                    <Skeleton variant="text" width="60%" height="20px" />
                    <Skeleton variant="text" width="40%" height="16px" />
                </div>
            </div>
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="80%" />
            <div style={{ marginTop: "20px" }}>
                <Skeleton variant="rectangular" width="120px" height="40px" />
            </div>
        </div>
    );
}

export function PageSkeleton() {
    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <Skeleton variant="text" width="200px" height="32px" />
            <div style={{ marginTop: "20px" }}>
                <Skeleton variant="card" height="300px" />
            </div>
            <div style={{ marginTop: "20px" }}>
                <Skeleton variant="card" height="200px" />
            </div>
        </div>
    );
}
