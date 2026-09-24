// Utility functions for formatting data

/**
 * Format phone number as: 712 345 6789
 * @param value - Raw phone number string
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // If starts with 7 -> 9 digits
    // If starts with 0 -> 10 digits
    if (digits.startsWith('7')) {
        return digits.slice(0, 9);
    } else if (digits.startsWith('0')) {
        return digits.slice(0, 10);
    }

    // Default fallback
    return digits.slice(0, 10);
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
