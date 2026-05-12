import { apiFetch, unwrapData, type ApiResponse } from "./client";
import { getAuthToken } from "./auth";

export type AccountSummary = {
  user: {
    id: string;
    email: string;
    name?: string | null;
    points?: number;
  };
  totalOrders: number;
  pendingOrders: number;
  wishlistCount: number;
};

export async function getAccountSummary(): Promise<AccountSummary> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  const response = await apiFetch<ApiResponse<AccountSummary> | AccountSummary>(
    "/account/summary",
    {
      token,
    }
  );

  return unwrapData<AccountSummary>(response);
}

export type AccountAddress = {
  id: string;
  label: string | null;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  isDefault: boolean;
  name?: string;
  phone?: string;
  ward?: string;
};

export type AddressPayload = {
  id?: string;
  label?: string | null;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  latitude?: string | number | null;
  longitude?: string | number | null;
  isDefault?: boolean;
  name?: string;
  phone?: string;
  ward?: string;
};

export async function getAddresses(): Promise<AccountAddress[]> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  const response = await apiFetch<
    ApiResponse<AccountAddress[]> | AccountAddress[]
  >("/account/addresses", {
    token,
  });

  return unwrapData<AccountAddress[]>(response);
}

export async function createAddress(
  payload: AddressPayload
): Promise<AccountAddress> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  const response = await apiFetch<
    ApiResponse<AccountAddress> | AccountAddress
  >("/account/addresses", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });

  return unwrapData<AccountAddress>(response);
}

export async function updateAddress(
  payload: AddressPayload & { id: string }
): Promise<AccountAddress> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  const response = await apiFetch<
    ApiResponse<AccountAddress> | AccountAddress
  >("/account/addresses", {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });

  return unwrapData<AccountAddress>(response);
}

export async function deleteAddress(id: string): Promise<void> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  await apiFetch(`/account/addresses?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    token,
  });
}

export async function setDefaultAddress(id: string): Promise<AccountAddress> {
  return updateAddress({
    id,
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "Việt Nam",
    isDefault: true,
  });
}

export type AccountOrderItem = {
  id: string;
  quantity: number;
  price: string | number;
  product: {
    id?: string;
    name: string;
    images: string[];
    price?: string | number;
  };
};

export type AccountOrder = {
  id: string;
  total: string | number;
  shippingFee: string | number;
  status: string;
  paymentStatus?: string;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt?: string;
  items: AccountOrderItem[];
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    name?: string;
    phone?: string;
    ward?: string;
  };
};

export async function getAccountOrders(): Promise<AccountOrder[]> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  const response = await apiFetch<ApiResponse<AccountOrder[]> | AccountOrder[]>(
    "/account/orders",
    {
      token,
    }
  );

  return unwrapData<AccountOrder[]>(response);
}

export async function getAccountOrderById(id: string): Promise<AccountOrder> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  const response = await apiFetch<ApiResponse<AccountOrder> | AccountOrder>(
    `/account/orders/${id}`,
    {
      token,
    }
  );

  return unwrapData<AccountOrder>(response);
}

export type WishlistProduct = {
  id: string;
  name: string;
  description?: string;
  price: string | number;
  stock?: number;
  images: string[];
  categoryId?: string | null;
};

export type AccountWishlistItem = {
  id: string;
  userId: string;
  productId: string;
  createdAt?: string;
  product: WishlistProduct;
};

export async function getWishlist(): Promise<AccountWishlistItem[]> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  const response = await apiFetch<
    ApiResponse<AccountWishlistItem[]> | AccountWishlistItem[]
  >("/account/wishlist", {
    token,
  });

  return unwrapData<AccountWishlistItem[]>(response);
}

export async function addToWishlist(productId: string): Promise<unknown> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  const response = await apiFetch<ApiResponse<unknown> | unknown>(
    "/account/wishlist",
    {
      method: "POST",
      token,
      body: JSON.stringify({ productId }),
    }
  );

  return unwrapData(response);
}

export async function removeFromWishlist(productId: string): Promise<unknown> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  const response = await apiFetch<ApiResponse<unknown> | unknown>(
    `/account/wishlist?productId=${encodeURIComponent(productId)}`,
    {
      method: "DELETE",
      token,
    }
  );

  return unwrapData(response);
}

export type UserProfile = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  avatar: string | null;
};

export type UpdateProfilePayload = {
  name?: string | null;
  phone?: string | null;
  avatar?: string | null;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export async function updateAccountProfile(
  payload: UpdateProfilePayload
): Promise<UserProfile> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  const response = await apiFetch<ApiResponse<UserProfile> | UserProfile>(
    "/account/profile",
    {
      method: "PUT",
      token,
      body: JSON.stringify(payload),
    }
  );

  return unwrapData<UserProfile>(response);
}

export async function changeAccountPassword(
  payload: ChangePasswordPayload
): Promise<unknown> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  const response = await apiFetch<ApiResponse<unknown> | unknown>(
    "/account/password",
    {
      method: "PUT",
      token,
      body: JSON.stringify(payload),
    }
  );

  return unwrapData(response);
}

export type LoginHistoryItem = {
  id: string;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
};

export async function getAccountSecurityHistory(): Promise<LoginHistoryItem[]> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  const response = await apiFetch<
    ApiResponse<LoginHistoryItem[]> | LoginHistoryItem[]
  >("/account/security/history", {
    token,
  });

  return unwrapData<LoginHistoryItem[]>(response);
}