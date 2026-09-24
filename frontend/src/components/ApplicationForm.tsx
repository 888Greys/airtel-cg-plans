import React, { useState } from "react";
import axios from "axios";
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
    inputStyle,
    labelStyle,
    buttonStyle,
    errorStyle,
} from "../styles/sharedStyles";
import { formatPhoneNumber } from "../utils/formatters";
import { ApplicationFormProps, ApplicationData } from "../types";

function ApplicationForm({ apiUrl, onBack, onSubmitSuccess }: ApplicationFormProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<ApplicationData>({
        product_id: "1",
        amount: "",
        term_months: "12",
        purpose: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        employment_status: "Employed",
        annual_income: "",
    });
    const [errors, setErrors] = useState<any>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        const processedValue = name === "phone" ? formatPhoneNumber(value) : value;

        setFormData((prev) => ({ ...prev, [name]: processedValue }));
        if (errors[name]) {
            setErrors((prev: any) => ({ ...prev, [name]: "" }));
        }
    };

    const validateStep = (step: number) => {
        const newErrors: any = {};

        if (step === 1) {
            if (!formData.amount || Number(formData.amount) <= 0) {
                newErrors.amount = "Veuillez entrer un montant de prêt valide";
            }
            if (!formData.purpose) {
                newErrors.purpose = "Veuillez préciser le motif du prêt";
            }
        }

        if (step === 2) {
            if (!formData.first_name) newErrors.first_name = "Le prénom est requis";
            if (!formData.last_name) newErrors.last_name = "Le nom est requis";
            if (!formData.email) {
                newErrors.email = "L'adresse e-mail est requise";
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = "L'adresse e-mail n'est pas valide";
            }

            const phoneDigits = formData.phone.replace(/\D/g, "");
            if (!formData.phone) {
                newErrors.phone = "Le numéro de téléphone est requis";
            } else if (phoneDigits.length < 8) {
                newErrors.phone = "Veuillez entrer un numéro de téléphone valide (ex: 099 123 4567)";
            }
        }

        if (step === 3) {
            if (!formData.annual_income || Number(formData.annual_income) <= 0) {
                newErrors.annual_income = "Veuillez entrer un revenu annuel valide";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (!validateStep(currentStep)) {
            toast.error("Veuillez remplir correctement les champs indiqués");
            return;
        }

        setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep(3)) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }

        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            toast.success("🎉 Demande soumise avec succès !");
            onSubmitSuccess({
                ...formData,
                applicationId: Math.floor(Math.random() * 1000000),
            });
        } catch (error: any) {
            console.error("Full submission error object:", error);
            toast.error("Une erreur est survenue lors de la soumission");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={pageStyle}>
            <div style={headerStyle}>
                <button
                    onClick={onBack}
                    style={{
                        background: "none",
                        border: "none",
                        color: "#333",
                        cursor: "pointer",
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px",
                        borderRadius: "8px",
                        fontWeight: "600",
                        transition: "background 0.2s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "#f0f0f0")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "none")}
                >
                    <ArrowLeft size={20} /> Retour
                </button>
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
                <div style={{ ...cardStyle, maxWidth: "650px" }}>
                    <h1
                        style={{
                            textAlign: "center",
                            fontSize: "30px",
                            fontWeight: "700",
                            marginBottom: "12px",
                            color: "#1a1a1a",
                        }}
                    >
                        Demande de Prêt
                    </h1>
                    <p
                        style={{
                            textAlign: "center",
                            color: "#777",
                            marginBottom: "32px",
                            fontSize: "15px",
                        }}
                    >
                        Étape {currentStep} sur 3
                    </p>

                    {/* Progress dots */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "12px",
                            marginBottom: "36px",
                        }}
                    >
                        {[1, 2, 3].map((step) => (
                            <div
                                key={step}
                                style={{
                                    width: "40px",
                                    height: "6px",
                                    borderRadius: "3px",
                                    background:
                                        currentStep >= step
                                            ? "linear-gradient(135deg, #e40000 0%, #c40000 100%)"
                                            : "#e0e0e0",
                                    transition: "all 0.3s",
                                }}
                            />
                        ))}
                    </div>

                    <form onSubmit={handleSubmit}>
                        {currentStep === 1 && (
                            <div>
                                <div style={{ marginBottom: "20px" }}>
                                    <label style={labelStyle}>Type de prêt</label>
                                    <select
                                        name="product_id"
                                        value={formData.product_id}
                                        onChange={handleChange}
                                        style={{ ...inputStyle, cursor: "pointer" }}
                                    >
                                        <option value="1">Prêt Personnel</option>
                                        <option value="2">Prêt Immobilier</option>
                                        <option value="3">Prêt Commercial / Entreprise</option>
                                        <option value="4">Prêt Études</option>
                                        <option value="5">Prêt Automobile</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: "22px" }}>
                                    <label style={labelStyle}>Montant du prêt ($)</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        placeholder="Entrez le montant"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        style={{
                                            ...inputStyle,
                                            border: errors.amount
                                                ? "2px solid #ff4444"
                                                : "2px solid #e0e0e0",
                                        }}
                                        onFocus={(e) => {
                                            if (!errors.amount) e.currentTarget.style.borderColor = "#e40000";
                                        }}
                                        onBlur={(e) => {
                                            if (!errors.amount) e.currentTarget.style.borderColor = "#e0e0e0";
                                        }}
                                    />
                                    {errors.amount && <span style={errorStyle}>{errors.amount}</span>}
                                </div>

                                <div style={{ marginBottom: "20px" }}>
                                    <label style={labelStyle}>Durée du prêt</label>
                                    <select
                                        name="term_months"
                                        value={formData.term_months}
                                        onChange={handleChange}
                                        style={{ ...inputStyle, cursor: "pointer" }}
                                    >
                                        <option value="6">6 Mois</option>
                                        <option value="12">12 Mois</option>
                                        <option value="24">24 Mois</option>
                                        <option value="36">36 Mois</option>
                                        <option value="48">48 Mois</option>
                                        <option value="60">60 Mois</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: "20px" }}>
                                    <label style={labelStyle}>Motif du prêt</label>
                                    <input
                                        type="text"
                                        name="purpose"
                                        placeholder="À quoi servira ce prêt ?"
                                        value={formData.purpose}
                                        onChange={handleChange}
                                        style={{
                                            ...inputStyle,
                                            border: errors.purpose ? "1px solid #ff4444" : "1px solid #ddd",
                                        }}
                                    />
                                    {errors.purpose && <span style={errorStyle}>{errors.purpose}</span>}
                                </div>

                                <button type="button" onClick={nextStep} style={buttonStyle}>
                                    ÉTAPE SUIVANTE
                                </button>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div>
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: "15px",
                                        marginBottom: "20px",
                                    }}
                                >
                                    <div>
                                        <label style={labelStyle}>Prénom</label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            placeholder="Ex: Jean"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            style={{
                                                ...inputStyle,
                                                border: errors.first_name
                                                    ? "1px solid #ff4444"
                                                    : "1px solid #ddd",
                                            }}
                                        />
                                        {errors.first_name && (
                                            <span style={errorStyle}>{errors.first_name}</span>
                                        )}
                                    </div>

                                    <div>
                                        <label style={labelStyle}>Nom de famille</label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            placeholder="Ex: Kabila"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            style={{
                                                ...inputStyle,
                                                border: errors.last_name
                                                    ? "1px solid #ff4444"
                                                    : "1px solid #ddd",
                                            }}
                                        />
                                        {errors.last_name && (
                                            <span style={errorStyle}>{errors.last_name}</span>
                                        )}
                                    </div>
                                </div>

                                <div style={{ marginBottom: "20px" }}>
                                    <label style={labelStyle}>Adresse E-mail</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="nom@exemple.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        style={{
                                            ...inputStyle,
                                            border: errors.email ? "1px solid #ff4444" : "1px solid #ddd",
                                        }}
                                    />
                                    {errors.email && <span style={errorStyle}>{errors.email}</span>}
                                </div>

                                <div style={{ marginBottom: "30px" }}>
                                    <label style={labelStyle}>Numéro de Téléphone (RDC)</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="+243 099 123 4567"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        style={{
                                            ...inputStyle,
                                            border: errors.phone ? "1px solid #ff4444" : "1px solid #ddd",
                                        }}
                                    />
                                    {errors.phone && <span style={errorStyle}>{errors.phone}</span>}
                                </div>

                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        style={{
                                            ...buttonStyle,
                                            background: "#e0e0e0",
                                            color: "#333",
                                        }}
                                    >
                                        PRÉCÉDENT
                                    </button>
                                    <button type="button" onClick={nextStep} style={buttonStyle}>
                                        ÉTAPE SUIVANTE
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div>
                                <div style={{ marginBottom: "20px" }}>
                                    <label style={labelStyle}>Situation Professionnelle</label>
                                    <select
                                        name="employment_status"
                                        value={formData.employment_status}
                                        onChange={handleChange}
                                        style={{ ...inputStyle, cursor: "pointer" }}
                                    >
                                        <option value="Employed">Employé(e)</option>
                                        <option value="Self-Employed">Indépendant(e) / Entrepreneur</option>
                                        <option value="Unemployed">Sans emploi</option>
                                        <option value="Student">Étudiant(e)</option>
                                        <option value="Retired">Retraité(e)</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: "30px" }}>
                                    <label style={labelStyle}>Revenu Annuel Estimé ($)</label>
                                    <input
                                        type="number"
                                        name="annual_income"
                                        placeholder="Ex: 5,000"
                                        value={formData.annual_income}
                                        onChange={handleChange}
                                        style={{
                                            ...inputStyle,
                                            border: errors.annual_income
                                                ? "1px solid #ff4444"
                                                : "1px solid #ddd",
                                        }}
                                    />
                                    {errors.annual_income && (
                                        <span style={errorStyle}>{errors.annual_income}</span>
                                    )}
                                </div>

                                <div
                                    style={{
                                        background: "#f8f9fa",
                                        padding: "20px",
                                        borderRadius: "8px",
                                        marginBottom: "30px",
                                    }}
                                >
                                    <h3 style={{ fontSize: "16px", marginBottom: "15px", color: "#333" }}>
                                        Résumé de la Demande
                                    </h3>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        <span style={{ color: "#666", fontSize: "14px" }}>
                                            Montant du prêt :
                                        </span>
                                        <strong style={{ color: "#333", fontSize: "14px" }}>
                                            ${Number(formData.amount).toLocaleString()}
                                        </strong>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        <span style={{ color: "#666", fontSize: "14px" }}>Durée :</span>
                                        <strong style={{ color: "#333", fontSize: "14px" }}>
                                            {formData.term_months} mois
                                        </strong>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        <span style={{ color: "#666", fontSize: "14px" }}>Motif :</span>
                                        <strong style={{ color: "#333", fontSize: "14px" }}>
                                            {formData.purpose}
                                        </strong>
                                    </div>
                                    <div
                                        style={{ display: "flex", justifyContent: "space-between" }}
                                    >
                                        <span style={{ color: "#666", fontSize: "14px" }}>Demandeur :</span>
                                        <strong style={{ color: "#333", fontSize: "14px" }}>
                                            {formData.first_name} {formData.last_name}
                                        </strong>
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        style={{
                                            ...buttonStyle,
                                            background: "#e0e0e0",
                                            color: "#333",
                                        }}
                                    >
                                        PRÉCÉDENT
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            ...buttonStyle,
                                            background: loading ? "#ccc" : "linear-gradient(135deg, #e40000 0%, #c40000 100%)",
                                            cursor: loading ? "not-allowed" : "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="spinner" size={18} />
                                                ENVOI EN COURS...
                                            </>
                                        ) : (
                                            "SOUMETTRE LA DEMANDE"
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            <div style={footerStyle}>© 2025 Airtel RDC</div>
        </div>
    );
}

export default ApplicationForm;
