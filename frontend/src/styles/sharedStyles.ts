// Shared style definitions used across multiple components

export const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #f0f0f0 0%, #e0e0e0 100%)",
    display: "flex",
    flexDirection: "column" as const,
};

export const headerStyle = {
    padding: "24px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
};

export const logoStyle = {
    height: "42px",
    objectFit: "contain" as const,
};

export const menuButtonStyle = {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#333",
    padding: "8px",
    borderRadius: "8px",
    transition: "background 0.2s",
};

export const contentStyle = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
};

export const cardStyle = {
    background: "white",
    borderRadius: "16px",
    padding: "36px 24px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
};

export const footerStyle = {
    textAlign: "center" as const,
    padding: "24px",
    color: "#888",
    fontSize: "13px",
    fontWeight: "500" as const,
};

export const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "inherit",
};

export const labelStyle = {
    display: "block",
    fontSize: "15px",
    color: "#444",
    marginBottom: "10px",
    fontWeight: "600" as const,
};

export const buttonStyle = {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(135deg, #e40000 0%, #c40000 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600" as const,
    cursor: "pointer",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 4px 12px rgba(228, 0, 0, 0.35)",
};

export const errorStyle = {
    color: "#ff4444",
    fontSize: "13px",
    marginTop: "6px",
    display: "block",
    fontWeight: "500" as const,
};
