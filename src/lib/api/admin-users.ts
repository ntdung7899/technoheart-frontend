import { apiFetch, unwrapData, type ApiResponse } from "./client";
import { getAuthToken } from "./auth";

export type AdminUser = {
    id: string;
    name: string | null;
    email: string;
    phone?: string | null;
    role: string;
    createdAt?: string;
    updatedAt?: string;
    ordersCount: number;
    _count?: {
        orders: number;
    };
};

export type AdminUsersResponse = {
    items: AdminUser[];
    total: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
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

    if (!query.has("currentPage")) {
        query.set("currentPage", "1");
    }

    if (!query.has("pageSize")) {
        query.set("pageSize", "10");
    }

    const suffix = query.toString() ? `?${query.toString()}` : "";

    const response = await apiFetch<any>(`/admin/users${suffix}`, {
        token,
    });

    const payload = unwrapData<any>(response);

    const items =
        payload?.items ||
        payload?.rows ||
        payload?.users ||
        payload?.data?.items ||
        payload?.data?.rows ||
        payload?.data?.users ||
        payload?.responseData?.items ||
        payload?.responseData?.rows ||
        payload?.responseData?.users ||
        response?.responseData?.items ||
        response?.responseData?.rows ||
        response?.responseData?.users ||
        [];

    const total =
        payload?.total ||
        payload?.count ||
        payload?.data?.total ||
        payload?.data?.count ||
        payload?.responseData?.total ||
        payload?.responseData?.count ||
        response?.responseData?.total ||
        response?.responseData?.count ||
        items.length;

    const currentPage =
        Number(
            payload?.currentPage ||
                payload?.data?.currentPage ||
                payload?.responseData?.currentPage ||
                response?.responseData?.currentPage ||
                query.get("currentPage") ||
                1
        ) || 1;

    const pageSize =
        Number(
            payload?.pageSize ||
                payload?.data?.pageSize ||
                payload?.responseData?.pageSize ||
                response?.responseData?.pageSize ||
                query.get("pageSize") ||
                10
        ) || 10;

    const totalPages =
        Number(
            payload?.totalPages ||
                payload?.data?.totalPages ||
                payload?.responseData?.totalPages ||
                response?.responseData?.totalPages ||
                Math.max(1, Math.ceil(Number(total || 0) / pageSize))
        ) || 1;

    return {
        items: Array.isArray(items) ? items : [],
        total: Number(total || 0),
        totalPages,
        currentPage,
        pageSize,
    };
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