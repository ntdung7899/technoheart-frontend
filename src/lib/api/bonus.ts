import { apiFetch, unwrapData, type ApiResponse } from "./client";
import { getAuthToken } from "./auth";

export type RankSnapshot = {
  managementRankAchieved: string | null;
  finalRankCode: string;
  teamPV: number;
  personalPV: number;
  qualifyingBranches: Record<string, unknown>;
  cycleId: string;
  membershipTier?: string;
};

export type PvLedgerType = "ORDER" | "ADJUSTMENT" | "CORRECTION";

export type PvLedger = {
  id: string;
  orderId: string | null;
  pvAmount: number;
  type: PvLedgerType | string;
  cycleYear: number;
  cycleMonth: number;
  note?: string | null;
  createdAt: string;
};

export type PvLedgersResponse = {
  rows: PvLedger[];
  count: number;
};

export type BonusStatus = "PENDING" | "PAID" | "CANCELLED";

export type ManagementBonus = {
  id: string;
  cycleId: string;
  rankCode: string;
  basePV: number;
  bonusRate: number;
  bonusAmount: number;
  isRetroactive: boolean;
  status: BonusStatus | string;
  createdAt: string;
  updatedAt?: string;
};

export type MatchingBonus = {
  id: string;
  f1AffiliateId: string;
  cycleId: string;
  baseManagementBonusId: string;
  matchingRate: number;
  bonusAmount: number;
  status: BonusStatus | string;
  createdAt: string;
  updatedAt?: string;
};

export type PagedResponse<T> = {
  rows: T[];
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

export async function getRankSnapshot(cycleId?: string): Promise<RankSnapshot> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<RankSnapshot> | RankSnapshot>(
    `/me/rank-snapshot${cycleId ? `?cycleId=${encodeURIComponent(cycleId)}` : ""}`,
    { token }
  );

  return unwrapData<RankSnapshot>(response);
}

export async function getPvLedgers(params?: {
  page?: number;
  limit?: number;
  year?: number;
  month?: number;
}): Promise<PvLedgersResponse> {
  const token = getRequiredToken();

  const response = await apiFetch<
    ApiResponse<PvLedgersResponse> | PvLedgersResponse
  >(`/me/pv-ledgers${buildQuery(params)}`, { token });

  return unwrapData<PvLedgersResponse>(response);
}

export async function getManagementBonus(params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<PagedResponse<ManagementBonus>> {
  const token = getRequiredToken();

  const response = await apiFetch<
    ApiResponse<PagedResponse<ManagementBonus>> | PagedResponse<ManagementBonus>
  >(`/me/management-bonus${buildQuery(params)}`, { token });

  return unwrapData<PagedResponse<ManagementBonus>>(response);
}

export async function getMatchingBonus(params?: {
  page?: number;
  limit?: number;
}): Promise<PagedResponse<MatchingBonus>> {
  const token = getRequiredToken();

  const response = await apiFetch<
    ApiResponse<PagedResponse<MatchingBonus>> | PagedResponse<MatchingBonus>
  >(`/me/matching-bonus${buildQuery(params)}`, { token });

  return unwrapData<PagedResponse<MatchingBonus>>(response);
}
