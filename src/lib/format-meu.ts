import { formatPrice } from "./utils";

export const PV_RATE = 26000;

export function pvToVnd(pv: number): number {
  return Number(pv || 0) * PV_RATE;
}

export function formatPV(pv: number | string): string {
  return `${Number(pv || 0).toLocaleString("vi-VN")} PV`;
}

export function formatVND(amount: number | string): string {
  return formatPrice(amount);
}

type StatusStyle = { label: string; className: string };

export const STATUS_STYLE: Record<string, StatusStyle> = {
  PENDING: {
    label: "Chờ xử lý",
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  APPROVED: {
    label: "Đã duyệt",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  PROCESSING: {
    label: "Đang xử lý",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  PAID: {
    label: "Đã thanh toán",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  REJECTED: {
    label: "Từ chối",
    className: "bg-red-500/10 text-red-600 border-red-500/20",
  },
  CANCELLED: {
    label: "Đã huỷ",
    className: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  },
  // Hub order statuses
  ASSIGNED: {
    label: "Chờ nhận",
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  ACCEPTED: {
    label: "Đã nhận",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  TIMEOUT: {
    label: "Quá hạn",
    className: "bg-red-500/10 text-red-600 border-red-500/20",
  },
  COMPLETED: {
    label: "Hoàn thành",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
};

export function getStatusStyle(status: string): StatusStyle {
  return (
    STATUS_STYLE[status] || {
      label: status,
      className: "bg-secondary text-muted-foreground border-border",
    }
  );
}

export const RANK_DISPLAY: Record<string, { label: string; color: string }> = {
  DDKD: { label: "Đại diện kinh doanh", color: "#8B5CF6" },
  G1: { label: "Giám đốc khu vực", color: "#3B82F6" },
  G2: { label: "Giám đốc vùng", color: "#06B6D4" },
  G3: { label: "Đại sứ TH Quốc gia", color: "#F59E0B" },
  G4: { label: "Đại sứ TH Toàn cầu", color: "#EF4444" },
};

export function getRankDisplay(rank: string | null | undefined) {
  if (!rank) return null;
  return RANK_DISPLAY[rank] || { label: rank, color: "#64748B" };
}

const API_ERROR_MESSAGES: Record<string, string> = {
  WITHDRAWAL_CLOSED: "Cổng rút tiền hiện đang đóng.",
  NO_OPEN_CYCLE: "Hệ thống chưa mở cổng tháng này.",
  INSUFFICIENT_BALANCE: "Số dư ví không đủ để thanh toán.",
  AFFILIATE_NOT_FOUND: "Bạn chưa đăng ký affiliate.",
  WITHDRAWAL_REQUEST_NOT_FOUND: "Không tìm thấy yêu cầu rút tiền.",
  PERMISSION_DENIED: "Bạn không có quyền thực hiện thao tác này.",
  CANNOT_CANCEL_WITHDRAWAL: "Không thể huỷ yêu cầu này.",
};

export function getApiErrorCode(error: unknown): string | undefined {
  const body = (error as { body?: { code?: string } } | undefined)?.body;
  return body?.code;
}

export function getApiErrorMessage(error: unknown, fallback = "Đã có lỗi xảy ra"): string {
  const code = getApiErrorCode(error);

  if (code && API_ERROR_MESSAGES[code]) {
    return API_ERROR_MESSAGES[code];
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
