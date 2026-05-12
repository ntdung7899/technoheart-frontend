import { apiFetch, unwrapData, type ApiResponse, ApiError } from "./client";

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  full_name?: string | null;
  phone?: string | null;
  role?: string;
  roles?: string[];
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResult = {
  user?: AuthUser;
  token?: string;
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
  refresh_token?: string;
  [key: string]: unknown;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  referralCode?: string;
};

const TOKEN_KEY = "technoheart_token";
const REFRESH_TOKEN_KEY = "technoheart_refresh_token";

export async function login(payload: LoginPayload): Promise<LoginResult> {
  const response = await apiFetch<ApiResponse<LoginResult> | LoginResult>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        identifier: payload.email,
        password: payload.password,
      }),
    }
  );

  const data = unwrapData<LoginResult>(response);

  const token =
    data.token ||
    data.accessToken ||
    data.access_token ||
    (data as any).access_token ||
    (data as any).accessToken ||
    "";

  const refreshToken =
    data.refreshToken ||
    data.refresh_token ||
    (data as any).refresh_token ||
    (data as any).refreshToken ||
    "";

    if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }

    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }

    window.dispatchEvent(new Event("auth-changed"));

    console.log("LOGIN_TOKEN_SAVED:", {
      hasToken: Boolean(token),
      hasRefreshToken: Boolean(refreshToken),
      data,
    });
  }

  return data;
}

export async function register(payload: RegisterPayload) {
  const response = await apiFetch<ApiResponse<AuthUser> | AuthUser>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify({
        name: payload.name,
        fullName: payload.name,
        email: payload.email,
        password: payload.password,
        referralCode: payload.referralCode,
      }),
    }
  );

  return unwrapData<AuthUser>(response);
}

export function getAuthToken() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("technoheart_token");
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = getAuthToken();

  if (!token) return null;

  try {
    const response = await apiFetch<ApiResponse<AuthUser> | AuthUser>(
      "/auth/me",
      {
        token,
      }
    );

    return unwrapData<AuthUser>(response);
  } catch (error: any) {
    console.error("GET_CURRENT_USER_ERROR:", error);

    if (error?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);

      window.dispatchEvent(new Event("auth-changed"));

      return null;
    }

    throw error;
  }
}

export async function logout() {
  const token = getAuthToken();

  try {
    if (token) {
      await apiFetch("/auth/logout", {
        method: "DELETE",
        token,
      });
    }
  } catch (error) {
    console.warn("LOGOUT_API_ERROR:", error);
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);

      // Xoá thêm các key cũ nếu trước đó từng dùng
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      window.dispatchEvent(new Event("auth-changed"));
    }
  }
}
export async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!refreshToken) return null;

  try {
    const response = await apiFetch<
      ApiResponse<{
        accessToken?: string;
        access_token?: string;
        expiresIn?: string;
      }>
    >("/auth/genNewAccessToken", {
      method: "POST",
      body: JSON.stringify({
        refreshToken,
      }),
    });

    const data = unwrapData(response);

    const newAccessToken = data.accessToken || data.access_token || "";

    if (!newAccessToken) return null;

    localStorage.setItem(TOKEN_KEY, newAccessToken);

    return newAccessToken;
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    return null;
  }
}