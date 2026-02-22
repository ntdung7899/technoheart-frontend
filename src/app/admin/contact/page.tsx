"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Mail, Phone, MapPin, Globe, Instagram, Twitter,
    Facebook, MessageSquare, Save, Loader2, Check,
    Trash2, ChevronDown, ChevronUp, Search,
    MailOpen, MailCheck, ExternalLink, Inbox, Clock,
    ArrowUpRight, Reply
} from "lucide-react";

interface ContactInfo {
    id: string;
    email: string; emailSub: string;
    phone: string; phoneSub: string;
    address: string; addressSub: string;
    facebook: string; instagram: string; twitter: string; website: string;
    mapEmbed: string;
}

interface Message {
    id: string;
    name: string;
    email: string;
    subject: string;
    body: string;
    read: boolean;
    createdAt: string;
}

export default function AdminContactPage() {
    const [tab, setTab] = useState<"info" | "messages">("info");
    const [info, setInfo] = useState<ContactInfo | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loadingInfo, setLoadingInfo] = useState(true);
    const [loadingMsg, setLoadingMsg] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">("all");

    useEffect(() => {
        fetch("/api/contact-info")
            .then(r => r.json())
            .then(d => { setInfo(d); setLoadingInfo(false); });
        fetch("/api/contact")
            .then(r => r.json())
            .then(d => { setMessages(Array.isArray(d) ? d : []); setLoadingMsg(false); });
    }, []);

    const setField = (key: keyof ContactInfo, val: string) => {
        setInfo(prev => prev ? { ...prev, [key]: val } : prev);
    };

    const handleSave = async () => {
        if (!info) return;
        setSaving(true);
        await fetch("/api/contact-info", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(info),
        });
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const toggleRead = async (msg: Message) => {
        const updated = { ...msg, read: !msg.read };
        setMessages(prev => prev.map(m => m.id === msg.id ? updated : m));
        await fetch(`/api/contact/${msg.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ read: !msg.read }),
        });
    };

    const deleteMsg = async (id: string) => {
        if (!confirm("Xoá tin nhắn này?")) return;
        setMessages(prev => prev.filter(m => m.id !== id));
        await fetch(`/api/contact/${id}`, { method: "DELETE" });
    };

    const filtered = messages.filter(m => {
        const q = search.toLowerCase();
        const matchSearch = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q);
        const matchFilter = filterRead === "all" || (filterRead === "read" ? m.read : !m.read);
        return matchSearch && matchFilter;
    });

    const unreadCount = messages.filter(m => !m.read).length;
    const totalCount = messages.length;

    const inputCls = "w-full h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-zinc-300";
    const labelCls = "text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 block";

    const formatDate = (d: string) => {
        const date = new Date(d);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const mins = Math.floor(diff / 60000);
        const hrs = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (mins < 1) return "Vừa xong";
        if (mins < 60) return `${mins} phút trước`;
        if (hrs < 24) return `${hrs} giờ trước`;
        if (days < 7) return `${days} ngày trước`;
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
    };

    return (
        <div className="space-y-8 pb-20 max-w-5xl">
            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Quản lý</p>
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900">Trang liên hệ</h1>
                    <p className="text-sm text-zinc-400 mt-1">Chỉnh sửa thông tin liên hệ và xem tin nhắn từ khách hàng</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/contact"
                        target="_blank"
                        className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-zinc-200 text-zinc-600 text-xs font-bold hover:bg-zinc-50 transition-all"
                    >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Xem trang
                    </Link>
                    {tab === "info" && (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`inline-flex items-center gap-2 h-10 px-5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all disabled:opacity-60 ${saved
                                    ? "bg-emerald-500 text-white shadow-emerald-500/20"
                                    : "bg-primary text-primary-foreground shadow-primary/20 hover:scale-[1.02] active:scale-95"
                                }`}
                        >
                            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
                            {saved ? "Đã lưu" : "Lưu thay đổi"}
                        </button>
                    )}
                </div>
            </div>

            {/* ── Stats row ── */}
            <div className="grid grid-cols-3 gap-4">
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 flex items-center gap-4">
                    <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Inbox className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-zinc-900">{totalCount}</p>
                        <p className="text-xs text-zinc-400 font-semibold">Tổng tin nhắn</p>
                    </div>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 flex items-center gap-4">
                    <div className="h-11 w-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                        <Mail className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-zinc-900">{unreadCount}</p>
                        <p className="text-xs text-zinc-400 font-semibold">Chưa đọc</p>
                    </div>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 flex items-center gap-4">
                    <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <MailCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-zinc-900">{totalCount - unreadCount}</p>
                        <p className="text-xs text-zinc-400 font-semibold">Đã đọc</p>
                    </div>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="flex items-center gap-6 border-b border-zinc-200">
                <button
                    onClick={() => setTab("info")}
                    className={`relative pb-3 text-sm font-bold transition-colors ${tab === "info" ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Thông tin liên hệ
                    </span>
                    {tab === "info" && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                </button>
                <button
                    onClick={() => setTab("messages")}
                    className={`relative pb-3 text-sm font-bold transition-colors ${tab === "messages" ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Tin nhắn
                        {unreadCount > 0 && (
                            <span className="h-5 min-w-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-black flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </span>
                    {tab === "messages" && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                </button>
            </div>

            {/* ═══════════ TAB: Contact Info ═══════════ */}
            {tab === "info" && (
                <div className="space-y-5">
                    {loadingInfo ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 className="h-7 w-7 animate-spin text-primary" />
                        </div>
                    ) : info && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {/* Email */}
                            <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-zinc-900">Email</p>
                                        <p className="text-[11px] text-zinc-400">Địa chỉ email liên hệ</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className={labelCls}>Địa chỉ email</label>
                                        <input type="email" value={info.email} onChange={e => setField("email", e.target.value)} placeholder="email@example.com" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Mô tả</label>
                                        <input type="text" value={info.emailSub} onChange={e => setField("emailSub", e.target.value)} placeholder="VD: Hỗ trợ kỹ thuật" className={inputCls} />
                                    </div>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-zinc-900">Điện thoại</p>
                                        <p className="text-[11px] text-zinc-400">Số hotline liên hệ</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className={labelCls}>Số điện thoại</label>
                                        <input type="text" value={info.phone} onChange={e => setField("phone", e.target.value)} placeholder="0901 234 567" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Giờ làm việc</label>
                                        <input type="text" value={info.phoneSub} onChange={e => setField("phoneSub", e.target.value)} placeholder="VD: Thứ 2 - Chủ Nhật, 8:00 - 22:00" className={inputCls} />
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-zinc-900">Địa chỉ</p>
                                        <p className="text-[11px] text-zinc-400">Địa chỉ văn phòng</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className={labelCls}>Địa chỉ đầy đủ</label>
                                        <input type="text" value={info.address} onChange={e => setField("address", e.target.value)} placeholder="123 Đường ABC, Quận 1, TP.HCM" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Mô tả</label>
                                        <input type="text" value={info.addressSub} onChange={e => setField("addressSub", e.target.value)} placeholder="VD: Trụ sở chính" className={inputCls} />
                                    </div>
                                </div>
                            </div>

                            {/* Map */}
                            <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-zinc-900">Google Maps</p>
                                        <p className="text-[11px] text-zinc-400">Embed URL bản đồ</p>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>URL Embed</label>
                                    <input type="text" value={info.mapEmbed} onChange={e => setField("mapEmbed", e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." className={inputCls} />
                                </div>
                                {info.mapEmbed && (
                                    <div className="h-36 rounded-xl overflow-hidden border border-zinc-100">
                                        <iframe src={info.mapEmbed} className="w-full h-full border-0" allowFullScreen loading="lazy" />
                                    </div>
                                )}
                            </div>

                            {/* Social — full width */}
                            <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                                        <Globe className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-zinc-900">Mạng xã hội</p>
                                        <p className="text-[11px] text-zinc-400">Liên kết đến các trang mạng xã hội</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { key: "facebook", label: "Facebook", icon: Facebook, color: "text-[#1877F2]" },
                                        { key: "instagram", label: "Instagram", icon: Instagram, color: "text-[#E1306C]" },
                                        { key: "twitter", label: "Twitter", icon: Twitter, color: "text-[#1DA1F2]" },
                                        { key: "website", label: "Website", icon: Globe, color: "text-zinc-700" },
                                    ].map(({ key, label, icon: Icon, color }) => (
                                        <div key={key} className="space-y-1.5">
                                            <label className={labelCls}>
                                                <span className={`flex items-center gap-1.5 ${color}`}><Icon className="h-3.5 w-3.5" />{label}</span>
                                            </label>
                                            <input
                                                type="url"
                                                value={(info as any)[key]}
                                                onChange={e => setField(key as keyof ContactInfo, e.target.value)}
                                                placeholder="https://..."
                                                className={inputCls}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ═══════════ TAB: Messages ═══════════ */}
            {tab === "messages" && (
                <div className="space-y-5">
                    {/* Filters */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Tìm theo tên, email hoặc chủ đề..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all"
                            />
                        </div>
                        <div className="flex gap-0.5 bg-zinc-100 rounded-xl p-0.5">
                            {([["all", "Tất cả", null], ["unread", "Chưa đọc", unreadCount], ["read", "Đã đọc", totalCount - unreadCount]] as [string, string, number | null][]).map(([val, label, count]) => (
                                <button
                                    key={val}
                                    onClick={() => setFilterRead(val as any)}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${filterRead === val
                                            ? "bg-white text-zinc-900 shadow-sm"
                                            : "text-zinc-500 hover:text-zinc-700"
                                        }`}
                                >
                                    {label}
                                    {count !== null && count > 0 && (
                                        <span className={`text-[10px] ${filterRead === val ? "text-zinc-500" : "text-zinc-400"}`}>({count})</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loadingMsg ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 className="h-7 w-7 animate-spin text-primary" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="rounded-2xl border border-zinc-200 bg-white py-20 flex flex-col items-center justify-center gap-4">
                            <div className="h-16 w-16 rounded-2xl bg-zinc-50 flex items-center justify-center">
                                <Inbox className="h-8 w-8 text-zinc-300" />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-zinc-600 mb-1">Chưa có tin nhắn nào</p>
                                <p className="text-sm text-zinc-400">Tin nhắn từ khách hàng sẽ hiện tại đây</p>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
                            {filtered.map((msg, idx) => (
                                <div key={msg.id} className={`${idx > 0 ? "border-t border-zinc-100" : ""} ${!msg.read ? "bg-blue-50/40" : ""} transition-colors`}>
                                    {/* Row header */}
                                    <div
                                        className="flex items-start gap-4 p-5 cursor-pointer group hover:bg-zinc-50/60 transition-colors"
                                        onClick={() => {
                                            setExpandedId(expandedId === msg.id ? null : msg.id);
                                            if (!msg.read) toggleRead(msg);
                                        }}
                                    >
                                        {/* Avatar */}
                                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm ${!msg.read
                                                ? "bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg shadow-primary/20"
                                                : "bg-zinc-100 text-zinc-500"
                                            }`}>
                                            {msg.name.slice(0, 1).toUpperCase()}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className={`text-sm ${!msg.read ? "font-bold text-zinc-900" : "font-semibold text-zinc-600"}`}>{msg.name}</span>
                                                {!msg.read && <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
                                            </div>
                                            <p className={`text-sm truncate mb-1 ${!msg.read ? "font-semibold text-zinc-800" : "text-zinc-500"}`}>{msg.subject}</p>
                                            <div className="flex items-center gap-3 text-xs text-zinc-400">
                                                <span className="font-medium">{msg.email}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatDate(msg.createdAt)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <a
                                                href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                                                onClick={e => e.stopPropagation()}
                                                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-zinc-400 hover:text-blue-600 transition-all"
                                                title="Trả lời"
                                            >
                                                <Reply className="h-4 w-4" />
                                            </a>
                                            <button
                                                onClick={e => { e.stopPropagation(); toggleRead(msg); }}
                                                title={msg.read ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc"}
                                                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-primary transition-all"
                                            >
                                                {msg.read ? <MailOpen className="h-4 w-4" /> : <MailCheck className="h-4 w-4" />}
                                            </button>
                                            <button
                                                onClick={e => { e.stopPropagation(); deleteMsg(msg.id); }}
                                                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                            {expandedId === msg.id ? <ChevronUp className="h-4 w-4 text-zinc-300" /> : <ChevronDown className="h-4 w-4 text-zinc-300" />}
                                        </div>
                                    </div>

                                    {/* Expanded body */}
                                    {expandedId === msg.id && (
                                        <div className="px-5 pb-5">
                                            <div className="ml-[60px] space-y-3">
                                                <div className="p-5 rounded-xl bg-zinc-50 border border-zinc-100 text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                                                    {msg.body}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <a
                                                        href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                                                        className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
                                                    >
                                                        <Reply className="h-3.5 w-3.5" /> Trả lời qua email
                                                    </a>
                                                    <span className="text-zinc-200">|</span>
                                                    <button
                                                        onClick={() => deleteMsg(msg.id)}
                                                        className="text-xs text-red-400 font-bold hover:text-red-600 hover:underline flex items-center gap-1"
                                                    >
                                                        <Trash2 className="h-3 w-3" /> Xoá
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
