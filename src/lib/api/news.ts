import { apiFetch, unwrapData, type ApiResponse } from "./client";

export type News = {
  id: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  category?: string | null;
  image?: string | null;
  featured?: boolean;
  published?: boolean;
  readTime?: string | null;
  read_time?: string | null;
  authorId?: string | null;
  author_id?: string | null;
  authorName?: string | null;
  author_name?: string | null;
  newsCategoryId?: string | null;
  news_category_id?: string | null;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
};

export type NewsViewModel = {
  authorName: string | null | undefined;
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  featured: boolean;
  published: boolean;
  readTime: string;
  authorId?: string | null;
  newsCategoryId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type NewsDetailApiResponse = {
  article: News;
  related: News[];
};

function resolveImageUrl(image?: string | null): string {
  if (!image) return "/placeholder.png";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const cleanImage = image.replace(/^\/+/, "");

  return `${process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:3000"}/${cleanImage}`;
}

function normalizeNews(item: News): NewsViewModel {
  return {
    id: item.id,
    title: item.title,
    excerpt: item.excerpt || "",
    content: item.content || "",
    category: item.category || "Tin tức",
    imageUrl: resolveImageUrl(item.image),
    featured: Boolean(item.featured),
    published: Boolean(item.published),
    readTime: item.readTime || item.read_time || "5 phút đọc",
    authorId: item.authorId || item.author_id,
    authorName: item.authorName || item.author_name || null,
    newsCategoryId: item.newsCategoryId || item.news_category_id,
    createdAt: item.createdAt || item.created_at,
    updatedAt: item.updatedAt || item.updated_at,
  };
}

export async function getNews(): Promise<NewsViewModel[]> {
  const response = await apiFetch<ApiResponse<News[]> | News[]>("/news");

  const data = unwrapData<News[]>(response);

  return data.map(normalizeNews);
}

export async function getFeaturedNews(): Promise<NewsViewModel[]> {
  const response = await apiFetch<ApiResponse<News[]> | News[]>(
    "/news?featured=true"
  );

  const data = unwrapData<News[]>(response);

  return data.map(normalizeNews);
}

export async function getNewsById(id: string): Promise<{
  article: NewsViewModel;
  related: NewsViewModel[];
}> {
  const response = await apiFetch<
    ApiResponse<NewsDetailApiResponse> | NewsDetailApiResponse
  >(`/news/${id}`);

  const data = unwrapData<NewsDetailApiResponse>(response);

  return {
    article: normalizeNews(data.article),
    related: data.related.map(normalizeNews),
  };
}