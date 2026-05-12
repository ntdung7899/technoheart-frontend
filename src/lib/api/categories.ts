import { apiFetch, unwrapData, type ApiResponse } from "./client";

export type Category = {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
  productCount?: number;
  _count?: {
    products: number;
  };
};

export async function getCategories(params?: {
  take?: number;
  limit?: number;
  search?: string;
}): Promise<Category[]> {
  const query = new URLSearchParams();

  if (params?.take) query.set("take", String(params.take));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search);

  const endpoint = query.toString()
    ? `/categories?${query.toString()}`
    : "/categories";

  const response = await apiFetch<ApiResponse<Category[]> | Category[]>(
    endpoint
  );

  return unwrapData<Category[]>(response);
}