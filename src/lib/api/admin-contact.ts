import { apiFetch, unwrapData, type ApiResponse } from "./client";
import { getAuthToken } from "./auth";

export type AdminContactInfo = {
    id: string;
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

export type AdminContactMessage = {
    id: string;
    name: string;
    email: string;
    subject: string;
    body: string;
    read: boolean;
    createdAt: string;
};

export type UpdateContactMessagePayload = {
    read?: boolean;
};

function getRequiredToken() {
    const token = getAuthToken();

    if (!token) {
        throw new Error("Bạn chưa đăng nhập");
    }

    return token;
}

export async function getAdminContactInfo(): Promise<AdminContactInfo> {
    const token = getRequiredToken();

    const response = await apiFetch<
        ApiResponse<AdminContactInfo> | AdminContactInfo
    >("/admin/contact-info", {
        token,
    });

    return unwrapData<AdminContactInfo>(response);
}

export async function updateAdminContactInfo(
    payload: AdminContactInfo
): Promise<AdminContactInfo> {
    const token = getRequiredToken();

    const response = await apiFetch<
        ApiResponse<AdminContactInfo> | AdminContactInfo
    >("/admin/contact-info", {
        method: "PATCH",
        token,
        body: JSON.stringify(payload),
    });

    return unwrapData<AdminContactInfo>(response);
}

export async function getAdminContactMessages(): Promise<AdminContactMessage[]> {
    const token = getRequiredToken();

    const response = await apiFetch<
        ApiResponse<AdminContactMessage[]> | AdminContactMessage[]
    >("/admin/contact-messages", {
        token,
    });

    return unwrapData<AdminContactMessage[]>(response);
}

export async function updateAdminContactMessage(
    id: string,
    payload: UpdateContactMessagePayload
): Promise<AdminContactMessage> {
    const token = getRequiredToken();

    const response = await apiFetch<
        ApiResponse<AdminContactMessage> | AdminContactMessage
    >(`/admin/contact-messages/${id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify(payload),
    });

    return unwrapData<AdminContactMessage>(response);
}

export async function deleteAdminContactMessage(id: string): Promise<unknown> {
    const token = getRequiredToken();

    const response = await apiFetch<ApiResponse<unknown> | unknown>(
        `/admin/contact-messages/${id}`,
        {
            method: "DELETE",
            token,
        }
    );

    return unwrapData(response);
}