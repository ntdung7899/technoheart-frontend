import { apiFetch, unwrapData, type ApiResponse } from "./client";
import { getAuthToken } from "./auth";

export type AdminAffiliateProfile = {
  id: string;
  userId: string;
  referralCode: string;
  rank: string;
  personalPV: number;
  teamPV: number;
  totalEarnings: number;
  paidEarnings: number;
  isAppCenter: boolean;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    phone?: string | null;
  } | null;
  stats?: {
    commissionsCount: number;
    withdrawalsCount: number;
    pendingWithdrawals: number;
  };
};

export type AdminAffiliateListResponse = {
  items: AdminAffiliateProfile[];
  total: number;
};

export type AdminAffiliateCommission = {
  id: string;
  affiliateId: string;
  orderId: string;
  amount: number;
  rate: number;
  level: number;
  type: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  affiliate?: {
    id: string;
    referralCode: string;
    user?: {
      name: string | null;
      email: string;
    } | null;
  } | null;
};

export type AdminAffiliateCommissionResponse = {
  items: AdminAffiliateCommission[];
  summary: {
    total: number;
    pending: number;
    approved: number;
    paid: number;
  };
};

export type AdminWithdrawalRequest = {
  id: string;
  affiliateId: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  affiliate?: {
    id: string;
    referralCode: string;
    user?: {
      name: string | null;
      email: string;
    } | null;
  } | null;
};

export type UpdateAdminAffiliatePayload = {
  name?: string;
  email?: string;
  rank?: string;
  personalPV?: number;
  teamPV?: number;
  totalEarnings?: number;
  paidEarnings?: number;
  isAppCenter?: boolean;
};

export type UpdateWithdrawalPayload = {
  status: string;
};

function getRequiredToken() {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  return token;
}

export async function getAdminAffiliates(
  params?: Record<string, string | number | boolean | undefined>
): Promise<AdminAffiliateListResponse> {
  const token = getRequiredToken();

  const query = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  const suffix = query.toString() ? `?${query.toString()}` : "";

  const response = await apiFetch<
    ApiResponse<AdminAffiliateListResponse> | AdminAffiliateListResponse
  >(`/admin/affiliate${suffix}`, {
    token,
  });

  return unwrapData<AdminAffiliateListResponse>(response);
}

export async function getAdminAffiliateById(
  id: string
): Promise<AdminAffiliateProfile> {
  const token = getRequiredToken();

  const response = await apiFetch<
    ApiResponse<AdminAffiliateProfile> | AdminAffiliateProfile
  >(`/admin/affiliate/${id}`, {
    token,
  });

  return unwrapData<AdminAffiliateProfile>(response);
}

export async function updateAdminAffiliate(
  id: string,
  payload: UpdateAdminAffiliatePayload
): Promise<AdminAffiliateProfile> {
  const token = getRequiredToken();

  const response = await apiFetch<
    ApiResponse<AdminAffiliateProfile> | AdminAffiliateProfile
  >(`/admin/affiliate/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });

  return unwrapData<AdminAffiliateProfile>(response);
}

export async function bulkUpdateAdminAffiliates(
  payload: {
    ids: string[];
    action: string;
    value?: string | number | boolean;
  }
): Promise<unknown> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<unknown> | unknown>(
    "/admin/affiliate",
    {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    }
  );

  return unwrapData(response);
}

export async function getAdminAffiliateCommissions(
  params?: Record<string, string | number | boolean | undefined>
): Promise<AdminAffiliateCommissionResponse> {
  const token = getRequiredToken();

  const query = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  const suffix = query.toString() ? `?${query.toString()}` : "";

  const response = await apiFetch<
    ApiResponse<AdminAffiliateCommissionResponse> | AdminAffiliateCommissionResponse
  >(`/admin/affiliate/commissions${suffix}`, {
    token,
  });

  return unwrapData<AdminAffiliateCommissionResponse>(response);
}

export async function updateAdminWithdrawalStatus(
  id: string,
  payload: UpdateWithdrawalPayload
): Promise<AdminWithdrawalRequest> {
  const token = getRequiredToken();

  const response = await apiFetch<
    ApiResponse<AdminWithdrawalRequest> | AdminWithdrawalRequest
  >(`/admin/affiliate/withdrawals/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });

  return unwrapData<AdminWithdrawalRequest>(response);
}

export async function getAdminWithdrawals(
  params?: Record<string, string | number | boolean | undefined>
): Promise<AdminWithdrawalRequest[]> {
  const token = getRequiredToken();

  const query = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  const suffix = query.toString() ? `?${query.toString()}` : "";

  const response = await apiFetch<
    ApiResponse<AdminWithdrawalRequest[]> | AdminWithdrawalRequest[]
  >(`/admin/affiliate/withdrawals${suffix}`, {
    token,
  });

  return unwrapData<AdminWithdrawalRequest[]>(response);
}

export async function deleteAdminAffiliate(id: string): Promise<unknown> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<unknown> | unknown>(
    `/admin/affiliate/${id}`,
    {
      method: "DELETE",
      token,
    }
  );

  return unwrapData(response);
}