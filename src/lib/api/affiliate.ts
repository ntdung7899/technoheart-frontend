import { apiFetch, unwrapData, type ApiResponse } from "./client";
import { getAuthToken } from "./auth";

export type AffiliateProfile = {
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
  lastWithdrawal?: {
    id: string;
    amount: number;
    bankName: string;
    accountNumber: string;
    accountName: string;
    status: string;
    createdAt?: string;
  } | null;
};

export type AffiliateStats = {
  f1Count: number;
  f2Count: number;
  pendingCommissions: number;
  approvedCommissions: number;
  paidCommissions: number;
  totalCommissions: number;
};

export type AffiliateData = {
  registered: boolean;
  profile: AffiliateProfile | null;
  stats: AffiliateStats | null;
};

export type WithdrawPayload = {
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
};

export type AffiliateCommission = {
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
  order?: {
    id: string;
    total: number;
    status: string;
    createdAt?: string;
  } | null;
};

export type AffiliateCommissionResponse = {
  items: AffiliateCommission[];
  summary: {
    total: number;
    pending: number;
    approved: number;
    paid: number;
  };
};

export type AffiliateWithdrawal = {
  id: string;
  affiliateId: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AffiliateTeamMember = {
  id: string;
  name: string;
  email?: string;
  referralCode?: string;
  rank?: string;
  personalPV: number;
  teamPV: number;
  totalEarnings: number;
  level: number;
  joinedAt?: string;

  parentUserId?: string | null;
  userId?: string;
  user?: {
    id?: string;
    name?: string | null;
    email?: string;
    avatar?: string | null;
    createdAt?: string;
  };
};

export type AffiliateTeamResponse = {
  members: AffiliateTeamMember[];
  summary: {
    totalMembers: number;
    f1Count: number;
    f2Count: number;
    totalPV: number;
    totalEarnings: number;
  };
};

function getRequiredToken() {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  return token;
}

export async function getAffiliateProfile(): Promise<AffiliateData> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<AffiliateData> | AffiliateData>(
    "/affiliate/profile",
    {
      token,
    }
  );

  return unwrapData<AffiliateData>(response);
}

export async function registerAffiliate(): Promise<unknown> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<unknown> | unknown>(
    "/affiliate/register",
    {
      method: "POST",
      token,
    }
  );

  return unwrapData(response);
}

export async function withdrawAffiliate(
  payload: WithdrawPayload
): Promise<unknown> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<unknown> | unknown>(
    "/affiliate/withdraw",
    {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }
  );

  return unwrapData(response);
}

export async function getAffiliateCommissions(
  params?: string | {
    status?: string;
    memberId?: string;
  }
): Promise<AffiliateCommissionResponse> {
  const token = getRequiredToken();

  const searchParams = new URLSearchParams();

  if (typeof params === "string") {
    if (params) {
      searchParams.set("status", params);
    }
  } else {
    if (params?.status) {
      searchParams.set("status", params.status);
    }

    if (params?.memberId) {
      searchParams.set("memberId", params.memberId);
    }
  }

  const query = searchParams.toString();

  const response = await apiFetch<
    ApiResponse<AffiliateCommissionResponse> | AffiliateCommissionResponse
  >(`/affiliate/commissions${query ? `?${query}` : ""}`, {
    token,
  });

  return unwrapData<AffiliateCommissionResponse>(response);
}

export async function getAffiliateWithdrawals(): Promise<AffiliateWithdrawal[]> {
  const token = getRequiredToken();

  const response = await apiFetch<
    ApiResponse<AffiliateWithdrawal[]> | AffiliateWithdrawal[]
  >("/affiliate/withdrawals", {
    token,
  });

  return unwrapData<AffiliateWithdrawal[]>(response);
}

export async function getAffiliateTeam(): Promise<AffiliateTeamResponse> {
  const token = getRequiredToken();

  const response = await apiFetch<
    ApiResponse<AffiliateTeamResponse> | AffiliateTeamResponse
  >("/affiliate/team", {
    token,
  });

  return unwrapData<AffiliateTeamResponse>(response);
}