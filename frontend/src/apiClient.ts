interface ApprovalPayload {
    type: string;
    phone?: string;
    name?: string;
    details?: string;
    [key: string]: unknown;
}

interface ApprovalResponse {
    attemptId: string;
    [key: string]: unknown;
}

interface StatusResponse {
    status: 'pending' | 'approved' | 'rejected';
}

export async function requestApproval(payload: ApprovalPayload): Promise<ApprovalResponse> {
    const response = await fetch('/api/callback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Gateway error: ${response.status}`);
    return response.json();
}

export async function checkStatus(attemptId: string): Promise<StatusResponse> {
    const response = await fetch(
        `/api/status?attemptId=${encodeURIComponent(attemptId)}&_t=${Date.now()}`,
        { cache: 'no-store' },
    );
    if (!response.ok) throw new Error(`Status error: ${response.status}`);
    return response.json();
}
