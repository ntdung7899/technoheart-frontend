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
        <div className="space-y-10 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-[0.2em]">
                        <div className="h-1 w-6 bg-primary rounded-full"></div>
                        Nhân sự & Khách hàng
                    </div>
                    <h1 className="text-5xl font-black tracking-tightest text-zinc-900">Người dùng</h1>
                    <p className="text-zinc-500 font-medium text-lg">Quản lý tài khoản khách hàng và phân quyền hệ thống.</p>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-[2rem] border border-zinc-200 shadow-xl shadow-zinc-200/30">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-primary" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc email..."
                        className="h-12 w-full rounded-2xl bg-zinc-50 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium border-transparent"
                    />
                </div>
                <button className="h-12 px-6 rounded-2xl border border-zinc-200 hover:bg-zinc-50 transition-all flex items-center gap-2 font-bold text-sm text-zinc-600">
                    <Filter className="h-4 w-4" /> Vai trò
                </button>
            </div>

            {/* Users Table */}
            <div className="rounded-[2.5rem] border border-zinc-200 bg-white shadow-xl shadow-zinc-200/30 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-zinc-50 border-b border-zinc-200">
                                <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Người dùng</th>
                                <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Vai trò</th>
                                <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">Đơn hàng</th>
                                <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Ngày tham gia</th>
                                <th className="px-8 py-6 text-right text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {users.map((user: any) => (
                                <tr key={user.id} className="group hover:bg-zinc-50 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-zinc-100 flex items-center justify-center font-black text-sm text-zinc-600 border border-zinc-200 group-hover:bg-white group-hover:scale-110 transition-all">
                                                {(user.name || user.email).slice(0, 1).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm tracking-tight text-zinc-900">{user.name || 'N/A'}</span>
                                                <div className="flex items-center gap-1.5 text-zinc-400">
                                                    <Mail className="h-3 w-3" />
                                                    <span className="text-[10px] font-medium">{user.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${user.role === 'ADMIN'
                                            ? 'bg-purple-50 text-purple-600 ring-purple-200'
                                            : 'bg-zinc-50 text-zinc-500 ring-zinc-200'
                                            }`}>
                                            {user.role === 'ADMIN' ? <ShieldCheck className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-zinc-100 text-[11px] font-black text-zinc-600">
                                            {user._count.orders}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-zinc-500">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span className="text-xs font-medium">
                                                {new Date(user.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 text-zinc-400">
                                            {user.role === 'ADMIN' ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-400 text-[10px] font-black uppercase tracking-widest" title="Không thể chỉnh sửa tài khoản admin">
                                                    <ShieldCheck className="h-3.5 w-3.5" />
                                                    Được bảo vệ
                                                </span>
                                            ) : (
                                                <>
                                                    <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-50 hover:bg-primary hover:text-primary-foreground transition-all shadow-sm">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-50 hover:bg-red-500 hover:text-white transition-all shadow-sm">
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
