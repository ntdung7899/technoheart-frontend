import { apiFetch, unwrapData, type ApiResponse } from "./client";

export type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  stock: number;
  images?: string[] | null;

  categoryId?: string | null;
  category_id?: string | null;

  warranty?: string | null;

  shippingInfo?: string | null;
  shipping_info?: string | null;

  returnPolicy?: string | null;
  return_policy?: string | null;

  origin?: string | null;

  createdAt?: string;
  created_at?: string;

  updatedAt?: string;
  updated_at?: string;

  category?: {
    id: string;
    name: string;
  } | null;
};

export type ProductViewModel = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  images: string[];
  categoryId?: string | null;
  categoryName?: string;
  category?: {
    id: string;
    name: string;
  } | null;
  warranty?: string | null;
  shippingInfo?: string | null;
  returnPolicy?: string | null;
  origin?: string | null;
};

function resolveImageUrl(image?: string | null): string {
  if (!image) return "/placeholder.png";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const cleanImage = image.replace(/^\/+/, "");

  return `${process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:3000"}/${cleanImage}`;
}

function normalizeProduct(product: Product): ProductViewModel {
  const images = Array.isArray(product.images) ? product.images : [];
  const categoryId = product.categoryId || product.category_id || null;

  return {
    id: product.id,
    name: product.name,
    description: product.description || "",
    price: Number(product.price || 0),
    stock: product.stock || 0,
    imageUrl: resolveImageUrl(images[0]),
    images: images.map(resolveImageUrl),
    categoryId,
    categoryName: product.category?.name || "",
    category: product.category || null,
    warranty: product.warranty,
    shippingInfo: product.shippingInfo || product.shipping_info,
    returnPolicy: product.returnPolicy || product.return_policy,
    origin: product.origin,
  };
}

export async function getProducts(): Promise<ProductViewModel[]> {
  const response = await apiFetch<ApiResponse<Product[]> | Product[]>("/products");

  const products = unwrapData<Product[]>(response);

  return products.map(normalizeProduct);
}

export async function getFeaturedProducts(): Promise<ProductViewModel[]> {
  const products = await getProducts();

  return products.slice(0, 8);
}

export async function getProductById(id: string): Promise<ProductViewModel> {
  const response = await apiFetch<ApiResponse<Product> | Product>(
    `/products/${id}`
  );

  const product = unwrapData<Product>(response);

  return normalizeProduct(product);
}

export async function searchProducts(keyword: string): Promise<ProductViewModel[]> {
  const q = keyword.trim();

  if (!q) return [];

  const response = await apiFetch<ApiResponse<Product[]> | Product[]>(
    `/products/search?q=${encodeURIComponent(q)}`
  );

  const products = unwrapData<Product[]>(response);

  return products.map(normalizeProduct);
}