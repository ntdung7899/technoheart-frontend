"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Search,
    Filter,
    Mail,
    ShieldCheck,
    User as UserIcon,
    Calendar,
    Trash2,
    Edit,
    Loader2,
} from "lucide-react";
import {
    getAdminUsers,
    updateAdminUser,
    deleteAdminUser,
    type AdminUser,
} from "@/lib/api/admin-users";

function normalizeUser(user: AdminUser): AdminUser {
    return {
        ...user,
        name: user.name || null,
        role: user.role || "USER",
        ordersCount: Number(user.ordersCount ?? user._count?.orders ?? 0),
    };
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    async function loadUsers() {
        try {
            setLoading(true);

            const data = await getAdminUsers({
                search,
                role: roleFilter,
            });

            setUsers((data.items || []).map(normalizeUser));
        } catch (error) {
            console.error("LOAD_ADMIN_USERS_ERROR:", error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            loadUsers();
        }, 250);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, roleFilter]);

    const filteredUsers = useMemo(() => {
        const keyword = search.toLowerCase().trim();

        return users.filter((user) => {
            const matchSearch =
                !keyword ||
                String(user.name || "").toLowerCase().includes(keyword) ||
                String(user.email || "").toLowerCase().includes(keyword);

            const matchRole =
                !roleFilter ||
                String(user.role || "").toUpperCase() === roleFilter;

            return matchSearch && matchRole;
        });
    }, [users, search, roleFilter]);

    const handleEdit = async (user: AdminUser) => {
        const nextName = window.prompt("Nhập tên người dùng:", user.name || "");

        if (nextName === null) return;

        const nextEmail = window.prompt("Nhập email:", user.email || "");

        if (nextEmail === null) return;

        const nextRole = window.prompt(
            "Nhập vai trò USER hoặc ADMIN:",
            user.role || "USER"
        );

        if (nextRole === null) return;

        try {
            const updated = await updateAdminUser(user.id, {
                name: nextName.trim(),
                email: nextEmail.trim(),
                role: nextRole.trim().toUpperCase(),
            });

            setUsers((prev) =>
                prev.map((item) =>
                    item.id === user.id ? normalizeUser(updated) : item
                )
            );
        } catch (error) {
            console.error("UPDATE_ADMIN_USER_ERROR:", error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Không thể cập nhật người dùng"
            );
        }
    };

    const handleDelete = async (user: AdminUser) => {
        if (
            !window.confirm(
                `Bạn có chắc muốn xóa người dùng "${user.name || user.email}"?`
            )
        ) {
            return;
        }

        try {
            await deleteAdminUser(user.id);

            setUsers((prev) => prev.filter((item) => item.id !== user.id));
        } catch (error) {
            console.error("DELETE_ADMIN_USER_ERROR:", error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Không thể xóa người dùng"
            );
        }
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                    Người dùng
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Quản lý tài khoản khách hàng và phân quyền hệ thống.
                </p>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc email..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    />
                </div>

                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <select
                        value={roleFilter}
                        onChange={(event) => setRoleFilter(event.target.value)}
                        className="h-9 pl-8 pr-8 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                    >
                        <option value="">Vai trò</option>
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                                    Người dùng
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                                    Vai trò
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">
                                    Đơn hàng
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                                    Ngày tham gia
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-12 text-center"
                                    >
                                        <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-400">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Đang tải người dùng...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-12 text-center text-sm text-slate-400"
                                    >
                                        Không tìm thấy người dùng nào.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="group hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">
                                                    {(user.name || user.email || "U")
                                                        .slice(0, 1)
                                                        .toUpperCase()}
                                                </div>

                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">
                                                        {user.name || "N/A"}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-slate-400">
                                                        <Mail className="h-3 w-3" />
                                                        <span className="text-[11px]">
                                                            {user.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${
                                                    user.role === "ADMIN"
                                                        ? "bg-purple-50 text-purple-600"
                                                        : "bg-slate-100 text-slate-600"
                                                }`}
                                            >
                                                {user.role === "ADMIN" ? (
                                                    <ShieldCheck className="h-3 w-3" />
                                                ) : (
                                                    <UserIcon className="h-3 w-3" />
                                                )}
                                                {user.role}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            <span className="text-sm font-medium text-slate-600">
                                                {user.ordersCount}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5 text-slate-500">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span className="text-xs">
                                                    {user.createdAt
                                                        ? new Date(
                                                              user.createdAt
                                                          ).toLocaleDateString(
                                                              "vi-VN",
                                                              {
                                                                  day: "2-digit",
                                                                  month: "2-digit",
                                                                  year: "numeric",
                                                              }
                                                          )
                                                        : "N/A"}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1 text-slate-400">
                                                {user.role === "ADMIN" ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-50 text-purple-400 text-[11px] font-medium">
                                                        <ShieldCheck className="h-3 w-3" />
                                                        Được bảo vệ
                                                    </span>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEdit(user)
                                                            }
                                                            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-100 hover:text-primary transition-colors"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(user)
                                                            }
                                                            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-red-50 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}