import { apiFetch, unwrapData, type ApiResponse } from "./client";
import { getAuthToken } from "./auth";

export type OrderItemPayload = {
  productId: string;
  quantity: number;
};

export type OrderAddressPayload = {
  fullName: string;
  phone: string;
  street: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
};

export type CreateOrderPayload = {
  userId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  paymentMethod: "COD" | "BANK" | string;
  referralCode?: string;
  shippingFee?: number;
  address: OrderAddressPayload;
  items: OrderItemPayload[];
};

export type CreateOrderResult = {
  id: string;
  code: string;
  transactionId: string;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
};

export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResult> {
  const token = getAuthToken();

  const response = await apiFetch<
    ApiResponse<CreateOrderResult> | CreateOrderResult
  >("/orders", {
    method: "POST",
    token: token || undefined,
    body: JSON.stringify(payload),
  });

  return unwrapData<CreateOrderResult>(response);
}

export type OrderStatusResult = {
  id: string;
  orderId?: string;
  code?: string;
  transactionId?: string;
  total?: number;
  status: string;
  paymentStatus?: string;
  payment_status?: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://localhost:3000/api/v1.0";

export async function checkOrderStatus(
  code: string
): Promise<OrderStatusResult> {
  const url = `${API_URL}/orders/status/${encodeURIComponent(code)}`;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message ||
        result?.message_en ||
        `Không thể kiểm tra trạng thái đơn hàng: ${response.status}`
    );
  }

  return unwrapData<OrderStatusResult>(result);
}