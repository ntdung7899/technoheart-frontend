import { apiFetch, unwrapData, type ApiResponse } from "./client";
import { getAuthToken } from "./auth";

export type Wallet = {
  id: string;
  affiliateId: string;
  balance: number;
  lockedBalance: number;
  totalCredited: number;
  totalDebited: number;
  createdAt?: string;
  updatedAt?: string;
};

export type WalletTransactionType = "CREDIT" | "DEBIT";

export type WalletTransactionSource =
  | "MANAGEMENT_BONUS"
  | "MATCHING_BONUS"
  | "WITHDRAWAL"
  | "HUB_ROYALTY"
  | "HUB_OPERATION"
  | "COMMISSION"
  | "ADJUSTMENT";

export type WalletTransaction = {
  id: string;
  type: WalletTransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  source: WalletTransactionSource | string;
  sourceId?: string | null;
  createdAt: string;
};

export type WalletTransactionsResponse = {
  rows: WalletTransaction[];
  count: number;
};

export type WalletTransactionParams = {
  page?: number;
  limit?: number;
  type?: WalletTransactionType;
  source?: string;
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

export async function getWallet(): Promise<Wallet> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<Wallet> | Wallet>("/me/wallet", {
    token,
  });

  return unwrapData<Wallet>(response);
}

export async function getWalletTransactions(
  params?: WalletTransactionParams
): Promise<WalletTransactionsResponse> {
  const token = getRequiredToken();

  const response = await apiFetch<
    ApiResponse<WalletTransactionsResponse> | WalletTransactionsResponse
  >(`/me/wallet/transactions${buildQuery(params)}`, {
    token,
  });

  return unwrapData<WalletTransactionsResponse>(response);
}
