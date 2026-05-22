const API_URL =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3000/api/v1.0";

export type SePayWebhookPayload = {
    transferAmount?: number | string;
    content?: string;
    description?: string;
    transferContent?: string;
    [key: string]: unknown;
};

export type ForwardWebhookResult = {
    status: number;
    body: unknown;
};

export async function forwardSePayWebhookToBackend(
    payload: SePayWebhookPayload,
    authorization?: string | null
): Promise<ForwardWebhookResult> {
    const url = `${API_URL}/webhooks/sepay`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(authorization ? { Authorization: authorization } : {}),
        },
        body: JSON.stringify(payload),
        cache: "no-store",
    });

    const body = await response.json().catch(() => null);

    return {
        status: response.status,
        body:
            body || {
                success: response.ok,
                message: response.ok ? "OK" : "Webhook backend error",
            },
    };
}