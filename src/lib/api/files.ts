import { getAuthToken } from "./auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1.0";

const API_ORIGIN = API_URL.replace(/\/api\/v[\d.]+\/?$/, "");

function unwrapUploadResponse(response: any) {
  return (
    response?.data?.data ||
    response?.responseData?.data ||
    response?.data ||
    response?.responseData ||
    response
  );
}

function toPublicFileUrl(path: string) {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function uploadFile(file: File): Promise<string> {
  const token = getAuthToken();

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/files`, {
    method: "POST",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
    body: formData,
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message ||
        result?.message_en ||
        `Upload file thất bại: ${response.status}`
    );
  }

  const data = unwrapUploadResponse(result);

  const rawPath =
    data?.original ||
    data?.url ||
    data?.path ||
    data?.filePath ||
    data?.filename;

  if (!rawPath) {
    console.error("INVALID_UPLOAD_FILE_RESPONSE:", result);
    throw new Error("Upload thành công nhưng không lấy được đường dẫn ảnh");
  }

  return toPublicFileUrl(rawPath);
}