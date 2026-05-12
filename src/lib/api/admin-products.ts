import { apiFetch, unwrapData, type ApiResponse } from "./client";
import { getAuthToken } from "./auth";

export type AdminProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string | null;
  category?: {
    id: string;
    name: string;
  } | null;
  warranty?: string | null;
  shippingInfo?: string | null;
  returnPolicy?: string | null;
  origin?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminProductPayload = {
  name: string;
  description?: string;
  price: string | number;
  stock: string | number;
  categoryId: string;
  imageUrl?: string;
  images?: string[];
  warranty?: string;
  shippingInfo?: string;
  returnPolicy?: string;
  origin?: string;
};

function getRequiredToken() {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  return token;
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<AdminProduct[]> | AdminProduct[]>(
    "/admin/products",
    {
      token,
    }
  );

  return unwrapData<AdminProduct[]>(response);
}

export async function getAdminProductById(id: string): Promise<AdminProduct> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<AdminProduct> | AdminProduct>(
    `/admin/products/${id}`,
    {
      token,
    }
  );

  return unwrapData<AdminProduct>(response);
}

export async function createAdminProduct(
  payload: AdminProductPayload
): Promise<AdminProduct> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<AdminProduct> | AdminProduct>(
    "/admin/products",
    {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }
  );

  return unwrapData<AdminProduct>(response);
}

export async function updateAdminProduct(
  id: string,
  payload: AdminProductPayload
): Promise<AdminProduct> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<AdminProduct> | AdminProduct>(
    `/admin/products/${id}`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    }
  );

  return unwrapData<AdminProduct>(response);
}

export async function deleteAdminProduct(id: string): Promise<unknown> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<unknown> | unknown>(
    `/admin/products/${id}`,
    {
      method: "DELETE",
      token,
    }
  );

  return unwrapData(response);
}