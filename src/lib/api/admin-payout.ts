import { apiFetch, unwrapData, type ApiResponse } from "./client";
import { getAuthToken } from "./auth";

export type PayoutCycleStatus = "OPEN" | "PROCESSING" | "CLOSED";

export type PayoutCycle = {
  id: string;
  year: number;
  month: number;
  status: PayoutCycleStatus | string;
  createdAt?: string;
  updatedAt?: string;
};

function getRequiredToken() {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  return token;
}

function normalizeList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];

  const obj = payload as { rows?: T[]; items?: T[] } | null | undefined;
  if (Array.isArray(obj?.rows)) return obj!.rows;
  if (Array.isArray(obj?.items)) return obj!.items;

  return [];
}

export async function getPayoutCycles(): Promise<PayoutCycle[]> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<unknown> | unknown>(
    "/admin/payout-cycles",
    { token }
  );

  return normalizeList<PayoutCycle>(unwrapData(response));
}

export async function createPayoutCycle(payload: {
  year: number;
  month: number;
}): Promise<PayoutCycle> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<PayoutCycle> | PayoutCycle>(
    "/admin/payout-cycles",
    {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }
  );

  return unwrapData<PayoutCycle>(response);
}

export async function updatePayoutCycle(
  id: string,
  payload: { status: PayoutCycleStatus | string }
): Promise<PayoutCycle> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<PayoutCycle> | PayoutCycle>(
    `/admin/payout-cycles/${id}`,
    {
      method: "PUT",
      token,
      body: JSON.stringify(payload),
    }
  );

  return unwrapData<PayoutCycle>(response);
}

export async function runRankCalculation(cycleId: string): Promise<unknown> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<unknown> | unknown>(
    "/admin/rank-calculation/run",
    {
      method: "POST",
      token,
      body: JSON.stringify({ cycleId }),
    }
  );

  return unwrapData(response);
}

export async function updateManagementBonus(
  id: string,
  payload: { status: string }
): Promise<unknown> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<unknown> | unknown>(
    `/admin/management-bonus/${id}`,
    {
      method: "PUT",
      token,
      body: JSON.stringify(payload),
    }
  );

  return unwrapData(response);
}

export async function updateMatchingBonus(
  id: string,
  payload: { status: string }
): Promise<unknown> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<unknown> | unknown>(
    `/admin/matching-bonus/${id}`,
    {
      method: "PUT",
      token,
      body: JSON.stringify(payload),
    }
  );

  return unwrapData(response);
}
