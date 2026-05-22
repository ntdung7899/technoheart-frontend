import { apiFetch, unwrapData, type ApiResponse } from "./client";

export type ContactInfo = {
    id?: string;
    email: string;
    emailSub: string;
    phone: string;
    phoneSub: string;
    address: string;
    addressSub: string;
    facebook: string;
    instagram: string;
    twitter: string;
    website: string;
    mapEmbed: string;
};

export type ContactMessagePayload = {
    name: string;
    email: string;
    subject: string;
    body: string;
};

export async function getContactInfo(): Promise<ContactInfo> {
    const response = await apiFetch<ApiResponse<ContactInfo> | ContactInfo>(
        "/contact-info"
    );

    return unwrapData<ContactInfo>(response);
}

export async function sendContactMessage(
    payload: ContactMessagePayload
): Promise<unknown> {
    const response = await apiFetch<ApiResponse<unknown> | unknown>(
        "/contact",
        {
            method: "POST",
            body: JSON.stringify(payload),
        }
    );

    return unwrapData(response);
}