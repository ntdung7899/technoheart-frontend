import { apiFetch, unwrapData, type ApiResponse } from "./client";
import { getAuthToken } from "./auth";

export type AdminOrderListItem = {
  id: string;
  total: string | number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  transactionId?: string | null;
  shippingFee?: number;
  createdAt: string;
  updatedAt?: string;
  user: {
    id?: string;
    name: string | null;
    email: string;
  };
  _count: {
    items: number;
  };
};

export type AdminOrderDetail = {
  id: string;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  transactionId?: string | null;
  shippingFee?: number;
  referralCode?: string | null;
  createdAt: string;
  updatedAt?: string;
  user: {
    id?: string;
    name: string | null;
    email: string;
  };
  address: {
    id: string;
    label?: string;
    name?: string;
    fullName?: string;
    phone?: string;
    street?: string;
    ward?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  } | null;
  items: Array<{
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      images: string[];
    } | null;
  }>;
};

export type UpdateAdminOrderPayload = {
  status?: string;
  paymentStatus?: string;
};

function getRequiredToken() {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  return token;
}

export async function getAdminOrders(): Promise<AdminOrderListItem[]> {
  const token = getRequiredToken();

  const response = await apiFetch<
    ApiResponse<AdminOrderListItem[]> | AdminOrderListItem[]
  >("/admin/orders", {
    token,
  });

  return unwrapData<AdminOrderListItem[]>(response);
}

export async function getAdminOrderById(
  id: string
): Promise<AdminOrderDetail> {
  const token = getRequiredToken();

  const response = await apiFetch<
    ApiResponse<AdminOrderDetail> | AdminOrderDetail
  >(`/admin/orders/${id}`, {
    token,
  });

  return unwrapData<AdminOrderDetail>(response);
}

export async function updateAdminOrder(
  id: string,
  payload: UpdateAdminOrderPayload
): Promise<AdminOrderDetail> {
  const token = getRequiredToken();

  const response = await apiFetch<
    ApiResponse<AdminOrderDetail> | AdminOrderDetail
  >(`/admin/orders/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });

  return unwrapData<AdminOrderDetail>(response);
}

