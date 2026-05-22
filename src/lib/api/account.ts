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

  const payload = unwrapData<any>(response);

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.responseData)) return payload.responseData;
  if (Array.isArray(payload?.responseData?.data)) {
    return payload.responseData.data;
  }

  return [];
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
  referralCode?: string | null;
  createdAt: string;
  updatedAt?: string;
  items: AccountOrderItem[];

  itemCount?: number;
  itemsCount?: number;
  orderItemCount?: number;
  productCount?: number;
  totalItems?: number;
  totalQuantity?: number;
  _count?: {
    items?: number;
    orderItems?: number;
    products?: number;
  };

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

export type AccountOrdersPage = {
  count: number;
  rows: AccountOrder[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

const DEFAULT_PAGE_SIZE = 10;

function getOrderItems(order: any): any[] {
  const items =
    order?.items ||
    order?.orderItems ||
    order?.OrderItems ||
    order?.orderitems ||
    order?.order_items ||
    order?.details ||
    order?.orderDetails ||
    order?.OrderDetails ||
    order?.products ||
    order?.Products ||
    order?.cartItems ||
    order?.CartItems ||
    [];

  return Array.isArray(items) ? items : [];
}

function normalizeProduct(item: any) {
  const product =
    item?.product ||
    item?.Product ||
    item?.products ||
    item?.Products ||
    item;

  return {
    id: product?.id || item?.productId || item?.product_id || "",
    name:
      product?.name ||
      product?.title ||
      item?.productName ||
      item?.product_name ||
      "Sản phẩm",
    images: Array.isArray(product?.images) ? product.images : [],
    price: product?.price || item?.price || 0,
  };
}

function normalizeOrderItem(item: any, index: number): AccountOrderItem {
  return {
    id: item?.id || item?.productId || item?.product_id || `item-${index}`,
    quantity: Number(item?.quantity || item?.qty || 1),
    price: item?.price || item?.unitPrice || item?.unit_price || 0,
    product: normalizeProduct(item),
  };
}

function normalizeOrder(order: any): AccountOrder {
  const items = getOrderItems(order).map(normalizeOrderItem);

  return {
    ...order,
    id: order.id,
    total: Number(order.total || 0),
    shippingFee: Number(order.shippingFee || order.shipping_fee || 0),
    status: order.status || "PENDING",
    paymentStatus: order.paymentStatus || order.payment_status || "UNPAID",
    paymentMethod: order.paymentMethod || order.payment_method || "",
    transactionId: order.transactionId || order.transaction_id || "",
    referralCode: order.referralCode || order.referral_code || null,
    createdAt: order.createdAt || order.created_at,
    updatedAt: order.updatedAt || order.updated_at,
    items,
    address: order.address || order.Address || order.orderAddress || undefined,
  };
}

function normalizeAccountOrdersPage(
  value: AccountOrdersPage | AccountOrder[] | any,
  fallbackPage = 1,
  fallbackPageSize = DEFAULT_PAGE_SIZE
): AccountOrdersPage {
  if (Array.isArray(value)) {
    return {
      count: value.length,
      rows: value.map(normalizeOrder),
      totalPages: 1,
      currentPage: fallbackPage,
      pageSize: fallbackPageSize,
    };
  }

  const pageData =
    Array.isArray(value?.rows)
      ? value
      : Array.isArray(value?.data?.rows)
        ? value.data
        : Array.isArray(value?.responseData?.rows)
          ? value.responseData
          : Array.isArray(value?.responseData?.data?.rows)
            ? value.responseData.data
            : null;

  const rows = Array.isArray(pageData?.rows)
    ? pageData.rows.map(normalizeOrder)
    : [];

  return {
    count: Number(pageData?.count || rows.length || 0),
    rows,
    totalPages: Number(pageData?.totalPages || 1),
    currentPage: Number(pageData?.currentPage || fallbackPage),
    pageSize: Number(pageData?.pageSize || fallbackPageSize),
  };
}

function normalizeAccountOrderDetail(value: any): AccountOrder | null {
  const candidates = [
    value,
    value?.data,
    value?.responseData,
    value?.order,
    value?.data?.order,
    value?.responseData?.order,
    value?.data?.data,
    value?.responseData?.data,
    value?.responseData?.data?.data,
  ];

  const order = candidates.find(
    (item) => item && typeof item === "object" && item.id
  );

  if (!order) return null;

  return normalizeOrder(order);
}

export async function getAccountOrders(params?: {
  currentPage?: number;
  pageSize?: number;
}): Promise<AccountOrdersPage> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  const currentPage = params?.currentPage ?? 1;
  const pageSize = params?.pageSize ?? DEFAULT_PAGE_SIZE;

  const response = await apiFetch<
    ApiResponse<AccountOrdersPage | AccountOrder[]> |
    AccountOrdersPage |
    AccountOrder[]
  >(`/account/orders?currentPage=${currentPage}&pageSize=${pageSize}`, {
    token,
  });

  const payload = unwrapData<any>(response);

  return normalizeAccountOrdersPage(payload, currentPage, pageSize);
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

  const payload = unwrapData<any>(response);

  const order =
    normalizeAccountOrderDetail(payload) ||
    normalizeAccountOrderDetail(response);

  if (!order?.id) {
    console.error("INVALID_ACCOUNT_ORDER_DETAIL_RESPONSE:", {
      response,
      payload,
    });

    throw new Error("Dữ liệu chi tiết đơn hàng không hợp lệ");
  }

  return order;
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

  const payload = unwrapData<any>(response);

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.responseData)) return payload.responseData;
  if (Array.isArray(payload?.responseData?.data)) {
    return payload.responseData.data;
  }

  return [];
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

  const payload = unwrapData<any>(response);

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.responseData)) return payload.responseData;
  if (Array.isArray(payload?.responseData?.data)) {
    return payload.responseData.data;
  }

  return [];
}