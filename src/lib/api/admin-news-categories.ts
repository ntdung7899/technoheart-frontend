import { apiFetch, unwrapData, type ApiResponse } from "./client";
import { getAuthToken } from "./auth";

export type AdminNewsCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  _count: {
    news: number;
  };
};

export type AdminNewsCategoryPayload = {
  name: string;
  description?: string;
  color?: string;
};

function getRequiredToken() {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  return token;
}

export async function getAdminNewsCategories(): Promise<AdminNewsCategory[]> {
  const token = getRequiredToken();

  const response = await apiFetch<
    ApiResponse<AdminNewsCategory[]> | AdminNewsCategory[]
  >("/admin/news-categories", {
    token,
  });

  return unwrapData<AdminNewsCategory[]>(response);
}

export async function createAdminNewsCategory(
  payload: AdminNewsCategoryPayload
): Promise<AdminNewsCategory> {
  const token = getRequiredToken();

  const response = await apiFetch<
    ApiResponse<AdminNewsCategory> | AdminNewsCategory
  >("/admin/news-categories", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });

  return unwrapData<AdminNewsCategory>(response);
}

export async function updateAdminNewsCategory(
  id: string,
  payload: AdminNewsCategoryPayload
): Promise<AdminNewsCategory> {
  const token = getRequiredToken();

  const response = await apiFetch<
    ApiResponse<AdminNewsCategory> | AdminNewsCategory
  >(`/admin/news-categories/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });

  return unwrapData<AdminNewsCategory>(response);
}

export async function deleteAdminNewsCategory(id: string): Promise<unknown> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<unknown> | unknown>(
    `/admin/news-categories/${id}`,
    {
      method: "DELETE",
      token,
    }
  );

  return unwrapData(response);
}