import axios from 'axios';

const GATEWAY_URL = '/api';

// Create a configured axios instance
export const apiClient = axios.create({
    baseURL: GATEWAY_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Types based on expected payloads
export interface ApprovalRequest {
    type: string;
    name: string;
    phone: string;
    details: string;
}

export interface ApprovalResponse {
    success: boolean;
    attemptId: string;
    message?: string;
}

export interface StatusResponse {
    status: 'pending' | 'approved' | 'rejected';
}

/**
 * Sends the approval request (OTP or PIN) to the Gateway or Legacy Netlify Function
 */
export const requestApproval = async (payload: ApprovalRequest): Promise<ApprovalResponse> => {
    const response = await apiClient.post<ApprovalResponse>('/callback', payload);
    return response.data;
};

/**
 * Polls the Gateway or Legacy Netlify Function for the status of an ongoing request
 */
export const checkStatus = async (attemptId: string): Promise<StatusResponse> => {
    const response = await apiClient.get<StatusResponse>(`/status`, {
        params: {
            attemptId,
            _t: Date.now() // Cache buster
        }
    });
    return response.data;
};
