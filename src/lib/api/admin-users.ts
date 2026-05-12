import { apiFetch, unwrapData, type ApiResponse } from "./client";
import { getAuthToken } from "./auth";

export type AdminUser = {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt?: string;
    ordersCount: number;
    _count?: {
        orders: number;
    };
};

export type AdminUsersResponse = {
    items: AdminUser[];
    total: number;
};

export type UpdateAdminUserPayload = {
    name?: string;
    email?: string;
    role?: string;
};

function getRequiredToken() {
    const token = getAuthToken();

    if (!token) {
        throw new Error("Bạn chưa đăng nhập");
    }

    return token;
}

export async function getAdminUsers(
    params?: Record<string, string | number | boolean | undefined>
): Promise<AdminUsersResponse> {
    const token = getRequiredToken();

    const query = new URLSearchParams();

    Object.entries(params || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
            query.set(key, String(value));
        }
    });

    const suffix = query.toString() ? `?${query.toString()}` : "";

    const response = await apiFetch<
        ApiResponse<AdminUsersResponse> | AdminUsersResponse
    >(`/admin/users${suffix}`, {
        token,
    });

    return unwrapData<AdminUsersResponse>(response);
}

export async function updateAdminUser(
    id: string,
    payload: UpdateAdminUserPayload
): Promise<AdminUser> {
    const token = getRequiredToken();

    const response = await apiFetch<ApiResponse<AdminUser> | AdminUser>(
        `/admin/users/${id}`,
        {
            method: "PATCH",
            token,
            body: JSON.stringify(payload),
        }
    );

    return unwrapData<AdminUser>(response);
}

export async function deleteAdminUser(id: string): Promise<unknown> {
    const token = getRequiredToken();

    const response = await apiFetch<ApiResponse<unknown> | unknown>(
        `/admin/users/${id}`,
        {
            method: "DELETE",
            token,
        }
    );

    return unwrapData(response);
}