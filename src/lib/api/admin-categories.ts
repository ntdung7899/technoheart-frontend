import { apiFetch, unwrapData, type ApiResponse } from "./client";
import { getAuthToken } from "./auth";

export type AdminCategory = {
  id: string;
  name: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    products: number;
  };
};

export type AdminCategoryPayload = {
  name: string;
  image?: string;
};

function getRequiredToken() {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  return token;
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const token = getRequiredToken();

  const response = await apiFetch<
    ApiResponse<AdminCategory[]> | AdminCategory[]
  >("/admin/categories", {
    token,
  });

  return unwrapData<AdminCategory[]>(response);
}

export async function createAdminCategory(
  payload: AdminCategoryPayload
): Promise<AdminCategory> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<AdminCategory> | AdminCategory>(
    "/admin/categories",
    {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }
  );

  return unwrapData<AdminCategory>(response);
}

export async function updateAdminCategory(
  id: string,
  payload: AdminCategoryPayload
): Promise<AdminCategory> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<AdminCategory> | AdminCategory>(
    `/admin/categories/${id}`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    }
  );

  return unwrapData<AdminCategory>(response);
}

export async function deleteAdminCategory(id: string): Promise<unknown> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<unknown> | unknown>(
    `/admin/categories/${id}`,
    {
      method: "DELETE",
      token,
    }
  );

  return unwrapData(response);
}