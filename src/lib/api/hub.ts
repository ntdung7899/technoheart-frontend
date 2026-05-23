import { apiFetch, unwrapData, type ApiResponse } from "./client";
import { getAuthToken } from "./auth";

export type HubOrderStatus =
  | "ASSIGNED"
  | "ACCEPTED"
  | "REJECTED"
  | "TIMEOUT"
  | "COMPLETED"
  | "CANCELLED";

export type HubOrder = {
  id: string;
  orderId: string;
  hubId: string;
  routingStep?: string;
  reason?: string;
  status: HubOrderStatus | string;
  assignedAt: string;
  timeoutAt: string;
  note?: string | null;
  createdAt: string;
  order?: {
    id: string;
    total?: number;
    address?: {
      street?: string;
      ward?: string;
      city?: string;
      state?: string;
      name?: string;
      phone?: string;
    } | null;
    [key: string]: unknown;
  } | null;
};

export type HubOrdersResponse = {
  rows: HubOrder[];
  count: number;
};

export type HubInventoryItem = {
  id: string;
  hubId: string;
  productId: string;
  quantity: number;
  reservedQty: number;
  updatedAt?: string;
  product?: {
    id: string;
    name?: string;
    images?: string[];
  } | null;
};

export type HubInventoryResponse = {
  rows: HubInventoryItem[];
  count: number;
};

function getRequiredToken() {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  return token;
}

function buildQuery(params?: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  const suffix = query.toString();
  return suffix ? `?${suffix}` : "";
}

export async function getHubOrders(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<HubOrdersResponse> {
  const token = getRequiredToken();

  const response = await apiFetch<
    ApiResponse<HubOrdersResponse> | HubOrdersResponse
  >(`/hub/orders${buildQuery(params)}`, { token });

  return unwrapData<HubOrdersResponse>(response);
}

export async function acceptHubOrder(id: string): Promise<unknown> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<unknown> | unknown>(
    `/hub/orders/${id}/accept`,
    { method: "POST", token, body: JSON.stringify({}) }
  );

  return unwrapData(response);
}

export async function rejectHubOrder(
  id: string,
  note: string
): Promise<unknown> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<unknown> | unknown>(
    `/hub/orders/${id}/reject`,
    { method: "POST", token, body: JSON.stringify({ note }) }
  );

  return unwrapData(response);
}

export async function completeHubOrder(id: string): Promise<unknown> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<unknown> | unknown>(
    `/hub/orders/${id}/complete`,
    { method: "POST", token, body: JSON.stringify({}) }
  );

  return unwrapData(response);
}

export async function getHubInventory(params?: {
  page?: number;
  limit?: number;
}): Promise<HubInventoryResponse> {
  const token = getRequiredToken();

  const response = await apiFetch<
    ApiResponse<HubInventoryResponse> | HubInventoryResponse
  >(`/hub/inventory${buildQuery(params)}`, { token });

  return unwrapData<HubInventoryResponse>(response);
}

export async function updateHubInventory(
  productId: string,
  quantity: number
): Promise<HubInventoryItem> {
  const token = getRequiredToken();

  const response = await apiFetch<
    ApiResponse<HubInventoryItem> | HubInventoryItem
  >(`/hub/inventory/${productId}`, {
    method: "PUT",
    token,
    body: JSON.stringify({ quantity }),
  });

  return unwrapData<HubInventoryItem>(response);
}
