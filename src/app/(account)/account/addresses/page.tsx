"use client";

import { useEffect, useState } from "react";
import { AddressCard } from "@/components/account/AddressCard";
import { EmptyState } from "@/components/account/EmptyState";
import { MapPin, Plus, Loader2, X } from "lucide-react";

interface Address {
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
}

const emptyForm = {
    label: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "Việt Nam",
    latitude: "",
    longitude: "",
    isDefault: false,
};

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const fetchAddresses = () => {
        fetch("/api/account/addresses")
            .then((r) => r.json())
            .then((data) => setAddresses(data.addresses || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const openAdd = () => {
        setEditId(null);
        setForm(emptyForm);
        setShowForm(true);
        setError("");
    };

    const openEdit = (id: string) => {
        const addr = addresses.find((a) => a.id === id);
        if (!addr) return;
        setEditId(id);
        setForm({
            label: addr.label || "",
            street: addr.street,
            city: addr.city,
            state: addr.state,
            zip: addr.zip,
            country: addr.country,
            latitude: addr.latitude?.toString() || "",
            longitude: addr.longitude?.toString() || "",
            isDefault: addr.isDefault,
        });
        setShowForm(true);
        setError("");
    };

    const handleSave = async () => {
        if (!form.street || !form.city || !form.state || !form.zip || !form.country) {
            setError("Vui lòng điền đầy đủ thông tin");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const method = editId ? "PUT" : "POST";
            const body = editId ? { ...form, id: editId } : form;

            const res = await fetch("/api/account/addresses", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Có lỗi xảy ra");
                return;
            }

            setShowForm(false);
            fetchAddresses();
        } catch {
            setError("Có lỗi xảy ra");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc muốn xoá địa chỉ này?")) return;

        try {
            await fetch(`/api/account/addresses?id=${id}`, { method: "DELETE" });
            setAddresses((prev) => prev.filter((a) => a.id !== id));
        } catch {
            console.error("Delete failed");
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await fetch("/api/account/addresses", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, isDefault: true }),
            });
            fetchAddresses();
        } catch {
            console.error("Set default failed");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Địa chỉ</h1>
                <button
                    onClick={openAdd}
                    className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                >
                    <Plus className="h-3.5 w-3.5" />
                    Thêm
                </button>
            </div>

            {/* Address Form Modal */}
            {showForm && (
                <div className="rounded-2xl border border-border/40 bg-card/50 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold">
                            {editId ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
                        </h2>
                        <button
                            onClick={() => setShowForm(false)}
                            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {error && (
                        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm text-red-500">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Nhãn
                            </label>
                            <input
                                type="text"
                                value={form.label}
                                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                                placeholder="Nhà, Công ty..."
                                className="h-10 w-full rounded-xl border border-border/50 bg-secondary/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Quốc gia
                            </label>
                            <input
                                type="text"
                                value={form.country}
                                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                                className="h-10 w-full rounded-xl border border-border/50 bg-secondary/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Địa chỉ
                        </label>
                        <input
                            type="text"
                            value={form.street}
                            onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
                            placeholder="Số nhà, đường..."
                            className="h-10 w-full rounded-xl border border-border/50 bg-secondary/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Thành phố
                            </label>
                            <input
                                type="text"
                                value={form.city}
                                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                                className="h-10 w-full rounded-xl border border-border/50 bg-secondary/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Tỉnh/Quận
                            </label>
                            <input
                                type="text"
                                value={form.state}
                                onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                                className="h-10 w-full rounded-xl border border-border/50 bg-secondary/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Mã bưu điện
                            </label>
                            <input
                                type="text"
                                value={form.zip}
                                onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))}
                                className="h-10 w-full rounded-xl border border-border/50 bg-secondary/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Vĩ độ (Latitude)
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={form.latitude}
                                onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))}
                                placeholder="10.762622"
                                className="h-10 w-full rounded-xl border border-border/50 bg-secondary/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Kinh độ (Longitude)
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={form.longitude}
                                onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))}
                                placeholder="106.660172"
                                className="h-10 w-full rounded-xl border border-border/50 bg-secondary/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
                            />
                        </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.isDefault}
                            onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
                            className="h-4 w-4 rounded border-border accent-primary"
                        />
                        <span className="text-sm">Đặt làm địa chỉ mặc định</span>
                    </label>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                        {editId ? "Cập nhật" : "Thêm địa chỉ"}
                    </button>
                </div>
            )}

            {/* Address List */}
            {addresses.length === 0 && !showForm ? (
                <EmptyState
                    icon={<MapPin className="h-8 w-8" />}
                    title="Chưa có địa chỉ"
                    description="Thêm địa chỉ giao hàng để đặt hàng nhanh hơn"
                    action={
                        <button
                            onClick={openAdd}
                            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
                        >
                            Thêm địa chỉ
                        </button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                        <AddressCard
                            key={address.id}
                            address={address}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                            onSetDefault={handleSetDefault}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
