// Utility functions for formatting data

/**
 * Format phone number without spaces
 * Max 10 digits if starts with 0, max 9 if starts with 7
 * @param value - Raw phone number string
 * @returns Formatted phone number (no spaces)
 */
export const formatPhoneNumber = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Determine max length based on first digit
    let maxLength = 10; // default
    if (digits.startsWith('7')) {
        maxLength = 9;
    } else if (digits.startsWith('0')) {
        maxLength = 10;
    }

    // Limit to max length (no spaces)
    return digits.slice(0, maxLength);
};

/**
 * Get max phone length based on first digit
 * @param value - Current phone value
 * @returns Max length allowed
 */
export const getPhoneMaxLength = (value: string): number => {
    const digits = value.replace(/\D/g, '');
    if (digits.startsWith('7')) {
        return 9;
    }
    return 10;
};

/**
 * Calculate monthly loan payment
 * @param amount - Loan amount
 * @param termMonths - Loan term in months
 * @param interestRate - Annual interest rate (e.g., 0.08 for 8%)
 * @returns Monthly payment amount
 */
export const calculateMonthlyPayment = (
    amount: number,
    termMonths: number,
    interestRate: number = 0.08
): number => {
    const monthlyRate = interestRate / 12;
    const payment =
        (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1);
    return payment;
};
