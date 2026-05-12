"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, User, Mail, ShieldAlert, Target, Users, Lock } from "lucide-react";
import {
    getAdminAffiliateById,
    updateAdminAffiliate,
} from "@/lib/api/admin-affiliate";

export default function EditAffiliatePage() {
    const params = useParams();
    const router = useRouter();
    const affiliateId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // State lưu dữ liệu form để sửa (Tên, Email)
    const [formData, setFormData] = useState({
        name: "",
        email: ""
    });

    // State lưu dữ liệu chỉ để hiển thị (Rank, PV)
    const [stats, setStats] = useState({
        rank: "BA",
        personalPV: 0,
        teamPV: 0,
    });

    useEffect(() => {
        let mounted = true;

        const fetchProfile = async () => {
            try {
                if (!affiliateId) {
                    setLoading(false);
                    return;
                }

                const profile = await getAdminAffiliateById(affiliateId);

                if (!mounted) return;

                setFormData({
                    name: profile.user?.name || "",
                    email: profile.user?.email || "",
                });

                setStats({
                    rank: profile.rank || "BA",
                    personalPV: Number(profile.personalPV || 0),
                    teamPV: Number(profile.teamPV || 0),
                });
            } catch (error) {
                console.warn("LOAD_ADMIN_AFFILIATE_DETAIL_FAILED:", error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchProfile();

        return () => {
            mounted = false;
        };
    }, [affiliateId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await updateAdminAffiliate(affiliateId, {
                name: formData.name.trim(),
                email: formData.email.trim(),
            });

            alert("Cập nhật thông tin thành công!");
            router.push("/admin/affiliate");
            router.refresh();
        } catch (error) {
            console.warn("UPDATE_ADMIN_AFFILIATE_FAILED:", error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Có lỗi xảy ra khi lưu."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] flex-col items-center justify-center gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                <p className="text-slate-500 font-medium animate-pulse">Đang tải dữ liệu đối tác...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto space-y-6 pb-12">
            
            {/* Header Area */}
            <div className="flex items-center gap-3 mb-8">
                <button
                    onClick={() => router.back()}
                    className="p-2.5 rounded-full bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hồ sơ Đối tác</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Chỉnh sửa thông tin liên hệ</p>
                </div>
            </div>

            {/* Profile Summary Card (Read-only Stats) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shrink-0 border border-blue-200/50">
                    <span className="text-2xl font-bold text-blue-700">
                        {formData.name.slice(0, 1).toUpperCase() || "?"}
                    </span>
                </div>
                <div className="flex-1 w-full space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                            Thông tin hoạt động
                            <Lock className="h-4 w-4 text-slate-400"/>
                        </h2>
                    </div>
                    {/* Read-only Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center gap-3">
                            <ShieldAlert className="h-8 w-8 text-amber-500 bg-amber-100 p-1.5 rounded-md" />
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Cấp bậc</p>
                                <p className="text-sm font-bold text-slate-900">{stats.rank}</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center gap-3">
                            <Target className="h-8 w-8 text-blue-500 bg-blue-100 p-1.5 rounded-md" />
                            <div>
                                <p className="text-xs text-slate-500 font-medium">PV Cá nhân</p>
                                <p className="text-sm font-bold text-slate-900">{stats.personalPV.toLocaleString('vi-VN')}</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center gap-3">
                            <Users className="h-8 w-8 text-indigo-500 bg-indigo-100 p-1.5 rounded-md" />
                            <div>
                                <p className="text-xs text-slate-500 font-medium">PV Nhóm</p>
                                <p className="text-sm font-bold text-slate-900">{stats.teamPV.toLocaleString('vi-VN')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Edit Form Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden">
                <div className="bg-blue-50/50 border-b border-blue-100/50 px-6 py-4">
                    <h3 className="text-base font-semibold text-blue-900">Thông tin cá nhân</h3>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        
                        {/* Tên hiển thị */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Tên đối tác
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="block w-full pl-10 pr-3 py-2.5 text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="Nhập họ và tên..."
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Địa chỉ Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="block w-full pl-10 pr-3 py-2.5 text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="example@gmail.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-8 mt-8 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-sm shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            {saving ? "Đang lưu..." : "Lưu thông tin"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}