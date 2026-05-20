"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/account/StatusBadge";
import { EmptyState } from "@/components/account/EmptyState";
import { ShoppingBag, ChevronRight, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import {
  getAccountOrders,
  type AccountOrder,
} from "@/lib/api/account";

const tabs = [
  { label: "Tất cả", value: "" },
  { label: "Chờ xử lý", value: "PENDING" },
  { label: "Đang giao", value: "SHIPPED" },
  { label: "Đã giao", value: "DELIVERED" },
  { label: "Đã huỷ", value: "CANCELLED" },
];

type AccountOrdersPageData = {
  count: number;
  rows: AccountOrder[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

const PAGE_SIZE = 10;

function getOrderProductCount(order: any): number {
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

  if (Array.isArray(items)) {
    return items.reduce((total, item) => {
      const quantity = Number(item?.quantity || item?.qty || item?.amount || 1);
      return total + (Number.isFinite(quantity) ? quantity : 1);
    }, 0);
  }

  return Number(
    order?.itemCount ||
      order?.itemsCount ||
      order?.orderItemCount ||
      order?.productCount ||
      order?.totalItems ||
      order?.totalQuantity ||
      order?._count?.items ||
      order?._count?.orderItems ||
      order?._count?.products ||
      0
  );
}

function normalizeOrdersResponse(
  data: any,
  fallbackPage = 1
): AccountOrdersPageData {
  if (Array.isArray(data)) {
    return {
      count: data.length,
      rows: data,
      totalPages: 1,
      currentPage: fallbackPage,
      pageSize: PAGE_SIZE,
    };
  }

  const pageData =
    Array.isArray(data?.rows)
      ? data
      : Array.isArray(data?.data?.rows)
        ? data.data
        : Array.isArray(data?.responseData?.rows)
          ? data.responseData
          : Array.isArray(data?.data)
            ? {
                count: data.data.length,
                rows: data.data,
                totalPages: 1,
                currentPage: fallbackPage,
                pageSize: PAGE_SIZE,
              }
            : null;

  if (!pageData) {
    return {
      count: 0,
      rows: [],
      totalPages: 1,
      currentPage: fallbackPage,
      pageSize: PAGE_SIZE,
    };
  }

  return {
    count: Number(pageData.count || 0),
    rows: Array.isArray(pageData.rows) ? pageData.rows : [],
    totalPages: Number(pageData.totalPages || 1),
    currentPage: Number(pageData.currentPage || fallbackPage),
    pageSize: Number(pageData.pageSize || PAGE_SIZE),
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);

  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  async function loadOrders(page = 1) {
    try {
      setPageLoading(true);

      const data = await getAccountOrders({
        currentPage: page,
        pageSize: PAGE_SIZE,
      });

      console.log("ACCOUNT_ORDERS_DATA:", data);

      setOrders(data.rows);

      const pageData = normalizeOrdersResponse(data, page);

      setOrders(pageData.rows);
      setCurrentPage(pageData.currentPage);
      setTotalPages(pageData.totalPages);
      setTotalOrders(pageData.count);
    } catch (error) {
      console.error("LOAD_ACCOUNT_ORDERS_ERROR:", error);
      setOrders([]);
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  }

  useEffect(() => {
    loadOrders(1);
  }, []);

  const safeOrders = Array.isArray(orders) ? orders : [];

  const filtered = filter
    ? safeOrders.filter((o) => o.status === filter)
    : safeOrders;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-800">
        Đơn hàng
      </h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              filter === tab.value
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="h-8 w-8" />}
          title="Chưa có đơn hàng"
          description="Bạn chưa có đơn hàng nào. Hãy khám phá sản phẩm của chúng tôi!"
          action={
            <Link
              href="/products"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Mua sắm ngay
            </Link>
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            {filtered.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-mono font-medium">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-500 transition-all" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {getOrderProductCount(order)} sản phẩm
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )
                        : "Đang cập nhật"}
                    </p>
                  </div>

                  <p className="text-lg font-bold text-slate-800">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-500">
              Trang{" "}
              <span className="font-semibold text-slate-700">
                {currentPage}
              </span>
              {" / "}
              <span className="font-semibold text-slate-700">
                {totalPages}
              </span>
              {" · Tổng "}
              <span className="font-semibold text-slate-700">
                {totalOrders}
              </span>{" "}
              đơn hàng
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1 || pageLoading}
                onClick={() => loadOrders(currentPage - 1)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Trước
              </button>

              <button
                type="button"
                disabled={currentPage >= totalPages || pageLoading}
                onClick={() => loadOrders(currentPage + 1)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pageLoading ? "Đang tải..." : "Sau"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}