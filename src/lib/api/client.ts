const API_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3000/api/v1.0";

type RequestOptions = RequestInit & {
  token?: string;
};

export type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  responseData?: T;
};

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, headers, ...rest } = options;

  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: "no-store",
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    console.error("API ERROR:", {
      url,
      status: response.status,
      statusText: response.statusText,
      body: result,
    });

    throw new ApiError(
      result?.message ||
        result?.message_en ||
        `API request failed: ${response.status} ${response.statusText}`,
      response.status,
      result
    );
  }

  return result;
}

export function unwrapData<T>(response: ApiResponse<T> | T): T {
  if (response && typeof response === "object") {
    const apiResponse = response as ApiResponse<T>;

    if (apiResponse.data !== undefined) {
      return apiResponse.data;
    }

    if (apiResponse.responseData !== undefined) {
      return apiResponse.responseData;
    }
  }

  return response as T;
}