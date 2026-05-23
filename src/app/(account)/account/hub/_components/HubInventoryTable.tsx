"use client";

import { useState } from "react";
import { Boxes, Loader2, Pencil, Check, X } from "lucide-react";
import { EmptyState } from "@/components/account/EmptyState";
import { updateHubInventory, type HubInventoryItem } from "@/lib/api/hub";
import { getApiErrorMessage } from "@/lib/format-meu";

export function HubInventoryTable({
  items,
  onUpdated,
}: {
  items: HubInventoryItem[];
  onUpdated: () => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  function startEdit(item: HubInventoryItem) {
    setEditingId(item.productId);
    setDraft(String(item.quantity));
  }

  async function save(item: HubInventoryItem) {
    const quantity = Number(draft);
    if (Number.isNaN(quantity) || quantity < 0) return;

    setSavingId(item.productId);
    try {
      await updateHubInventory(item.productId, quantity);
      setEditingId(null);
      onUpdated();
    } catch (err) {
      alert(getApiErrorMessage(err, "Không thể cập nhật tồn kho"));
    } finally {
      setSavingId(null);
    }
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Boxes className="h-7 w-7" />}
        title="Chưa có tồn kho"
        description="Tồn kho của Hub sẽ hiển thị tại đây."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-4 py-3 font-semibold">Sản phẩm</th>
            <th className="px-4 py-3 font-semibold">Tồn</th>
            <th className="px-4 py-3 font-semibold">Đã giữ</th>
            <th className="px-4 py-3 font-semibold">Khả dụng</th>
            <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => {
            const available = item.quantity - item.reservedQty;
            const isOut = available <= 0;
            const isEditing = editingId === item.productId;
            return (
              <tr key={item.id} className={isOut ? "bg-red-50/50" : ""}>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {item.product?.name || item.productId}
                </td>
                <td className="px-4 py-3">
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      className="w-20 rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-th-blue focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    item.quantity
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500">{item.reservedQty}</td>
                <td className="px-4 py-3">
                  <span
                    className={`font-semibold ${
                      isOut ? "text-red-600" : "text-emerald-600"
                    }`}
                  >
                    {available}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {isEditing ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => save(item)}
                        disabled={savingId === item.productId}
                        className="rounded-md bg-emerald-600 p-1.5 text-white hover:bg-emerald-700 disabled:opacity-60"
                      >
                        {savingId === item.productId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded-md border border-slate-300 p-1.5 text-slate-500 hover:bg-slate-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(item)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Sửa
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
