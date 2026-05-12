import { apiFetch, unwrapData, type ApiResponse } from "./client";
import { getAuthToken } from "./auth";

export type AdminNews = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string | null;
  featured: boolean;
  published: boolean;
  readTime: string;
  authorId?: string | null;
  newsCategoryId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminNewsPayload = {
  title: string;
  excerpt?: string;
  content: string;
  category?: string;
  image?: string | null;
  imageUrl?: string | null;
  featured?: boolean;
  published?: boolean;
  readTime?: string;
  newsCategoryId?: string | null;
};

function getRequiredToken() {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  return token;
}

export async function getAdminNews(): Promise<AdminNews[]> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<AdminNews[]> | AdminNews[]>(
    "/admin/news",
    {
      token,
    }
  );

  return unwrapData<AdminNews[]>(response);
}

export async function getAdminNewsById(id: string): Promise<AdminNews> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<AdminNews> | AdminNews>(
    `/admin/news/${id}`,
    {
      token,
    }
  );

  return unwrapData<AdminNews>(response);
}

export async function createAdminNews(
  payload: AdminNewsPayload
): Promise<AdminNews> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<AdminNews> | AdminNews>(
    "/admin/news",
    {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }
  );

  return unwrapData<AdminNews>(response);
}

export async function updateAdminNews(
  id: string,
  payload: AdminNewsPayload
): Promise<AdminNews> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<AdminNews> | AdminNews>(
    `/admin/news/${id}`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    }
  );

  return unwrapData<AdminNews>(response);
}

export async function deleteAdminNews(id: string): Promise<unknown> {
  const token = getRequiredToken();

  const response = await apiFetch<ApiResponse<unknown> | unknown>(
    `/admin/news/${id}`,
    {
      method: "DELETE",
      token,
    }
  );

  return unwrapData(response);
}