import prisma from "@/lib/prisma";
import {
    Users,
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    ShieldCheck,
    User as UserIcon,
    Calendar,
    Trash2,
    Edit
} from "lucide-react";

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { orders: true }
            }
        }
    });

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Người dùng</h1>
                <p className="text-slate-500 text-sm mt-1">Quản lý tài khoản khách hàng và phân quyền hệ thống.</p>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc email..."
                        className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    />
                </div>
                <button className="h-9 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm text-slate-600">
                    <Filter className="h-3.5 w-3.5" /> Vai trò
                </button>
            </div>

            {/* Users Table */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Người dùng</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Vai trò</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">Đơn hàng</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Ngày tham gia</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.map((user: any) => (
                                <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">
                                                {(user.name || user.email).slice(0, 1).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{user.name || 'N/A'}</p>
                                                <div className="flex items-center gap-1 text-slate-400">
                                                    <Mail className="h-3 w-3" />
                                                    <span className="text-[11px]">{user.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${user.role === 'ADMIN'
                                            ? 'bg-purple-50 text-purple-600'
                                            : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {user.role === 'ADMIN' ? <ShieldCheck className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-sm font-medium text-slate-600">{user._count.orders}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5 text-slate-500">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span className="text-xs">
                                                {new Date(user.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1 text-slate-400">
                                            {user.role === 'ADMIN' ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-50 text-purple-400 text-[11px] font-medium">
                                                    <ShieldCheck className="h-3 w-3" />
                                                    Được bảo vệ
                                                </span>
                                            ) : (
                                                <>
                                                    <button className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-100 hover:text-primary transition-colors">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-red-50 hover:text-red-500 transition-colors">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
