import { getAuthToken } from "./auth";
import { ApiError, apiFetch, unwrapData, type ApiResponse } from "./client";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "http://localhost:3000/api/v1.0";

export type AdminTopProduct = {
    name: string;
    revenue: number;
    quantity: number;
};

export type AdminAnalyticsData = {
    totalRevenue: number;
    deliveredRevenue: number;
    totalOrders: number;
    deliveredOrders: number;
    avgOrderValue: number;
    topProducts: AdminTopProduct[];
};

export type AdminAnalyticsParams = {
    from?: string;
    to?: string;
};

    function getRequiredToken() {
    const token = getAuthToken();

    if (!token) {
        throw new Error("Bạn chưa đăng nhập");
    }

    return token;
}

function buildQuery(params?: AdminAnalyticsParams) {
    const query = new URLSearchParams();

    if (params?.from) query.set("from", params.from);
    if (params?.to) query.set("to", params.to);

    return query.toString() ? `?${query.toString()}` : "";
}

export async function getAdminAnalytics(
    params?: AdminAnalyticsParams,
    ): Promise<AdminAnalyticsData> {
    const token = getRequiredToken();
    const suffix = buildQuery(params);

    const response = await apiFetch<
        ApiResponse<AdminAnalyticsData> | AdminAnalyticsData
    >(`/admin/analytics${suffix}`, {
        token,
    });

    const data = unwrapData<AdminAnalyticsData>(response);

    return {
        totalRevenue: Number(data.totalRevenue || 0),
        deliveredRevenue: Number(data.deliveredRevenue || 0),
        totalOrders: Number(data.totalOrders || 0),
        deliveredOrders: Number(data.deliveredOrders || 0),
        avgOrderValue: Number(data.avgOrderValue || 0),
        topProducts: Array.isArray(data.topProducts)
        ? data.topProducts.map((item) => ({
            name: item.name || "Sản phẩm",
            revenue: Number(item.revenue || 0),
            quantity: Number(item.quantity || 0),
            }))
        : [],
    };
}

export async function exportAdminAnalytics(
    params?: AdminAnalyticsParams,
    ): Promise<Blob> {
    const token = getRequiredToken();
    const suffix = buildQuery(params);

    const response = await fetch(`${API_URL}/admin/analytics/export${suffix}`, {
        method: "GET",
        headers: {
        Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new ApiError(
        result?.message ||
            result?.message_en ||
            `API request failed: ${response.status} ${response.statusText}`,
        response.status,
        result,
        );
    }

    return response.blob();
}
