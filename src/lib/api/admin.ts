import { apiFetch, unwrapData, type ApiResponse } from "./client";
import { getAuthToken } from "./auth";

export type AdminDashboardStats = {
  totalRevenue: number;
  ordersCount: number;
  usersCount: number;
  productsCount: number;
  revenueTrend: number;
  ordersTrend: number;
  usersTrend: number;
  productsTrend: number;
};

export type AdminRecentOrder = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type AdminDashboardData = {
  stats: AdminDashboardStats;
  recentOrders: AdminRecentOrder[];
};

function getRequiredToken() {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  return token;
}

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  const token = getRequiredToken();

  const response = await apiFetch<
    ApiResponse<AdminDashboardData> | AdminDashboardData
  >("/admin/dashboard", {
    token,
  });

  return unwrapData<AdminDashboardData>(response);
}