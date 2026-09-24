// TypeScript type definitions

export type ViewType =
    | "landing"
    | "application"
    | "payment"
    | "loanSubmitted"
    | "otp"
    | "processing"
    | "success"
    | "deposit"
    | "withdraw"
    | "details";

export interface ApplicationData {
    phone: string;
    currentLimit?: number;
    newLimit?: number;
    increaseAmount?: number;
    // Legacy fields for compatibility
    product_id?: string;
    amount?: string;
    term_months?: string;
    purpose?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    employment_status?: string;
    annual_income?: string;
    applicationId?: number;
}

export interface LandingPageProps {
    onApply: () => void;
}

export interface ApplicationFormProps {
    apiUrl?: string;
    onBack: () => void;
    onSubmitSuccess: (data: any) => void;
}

export interface PaymentConfirmationProps {
    applicationData: ApplicationData | null;
    onBack: () => void;
    onComplete: () => void;
}

export interface LoanSubmittedPageProps {
    onComplete: () => void;
}

export interface OtpVerificationPageProps {
    phoneNumber: string;
    onComplete: () => void;
    onBack: () => void;
}

export interface LoanProcessingPageProps {
    onComplete: () => void;
}

export interface SuccessPageProps {
    onBack: () => void;
}
