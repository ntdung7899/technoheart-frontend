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
            .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
            .then(d => { setInfo(d); })
            .catch(() => {})
            .finally(() => setLoadingInfo(false));
        fetch("/api/contact")
            .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
            .then(d => { setMessages(Array.isArray(d) ? d : []); })
            .catch(() => {})
            .finally(() => setLoadingMsg(false));
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

    const inputCls = "w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-slate-300";
    const labelCls = "text-xs font-medium text-slate-500 mb-1 block";

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
        <div className="space-y-6 pb-12 max-w-5xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Trang liên hệ</h1>
                    <p className="text-slate-500 text-sm mt-1">Chỉnh sửa thông tin liên hệ và xem tin nhắn từ khách hàng.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/contact"
                        target="_blank"
                        className="h-9 px-3 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Xem trang
                    </Link>
                    {tab === "info" && (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`h-9 px-4 rounded-lg text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-60 ${saved
                                    ? "bg-emerald-500 text-white"
                                    : "bg-primary text-primary-foreground hover:opacity-90"
                                }`}
                        >
                            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
                            {saved ? "Đã lưu" : "Lưu"}
                        </button>
                    )}
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <Inbox className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-slate-900">{totalCount}</p>
                        <p className="text-xs text-slate-400">Tổng tin nhắn</p>
                    </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                        <Mail className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-slate-900">{unreadCount}</p>
                        <p className="text-xs text-slate-400">Chưa đọc</p>
                    </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <MailCheck className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-slate-900">{totalCount - unreadCount}</p>
                        <p className="text-xs text-slate-400">Đã đọc</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-4 border-b border-slate-200">
                <button
                    onClick={() => setTab("info")}
                    className={`relative pb-2.5 text-sm font-medium transition-colors ${tab === "info" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
                >
                    <span className="flex items-center gap-1.5">
                        <Phone className="h-4 w-4" />
                        Thông tin liên hệ
                    </span>
                    {tab === "info" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
                </button>
                <button
                    onClick={() => setTab("messages")}
                    className={`relative pb-2.5 text-sm font-medium transition-colors ${tab === "messages" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
                >
                    <span className="flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4" />
                        Tin nhắn
                        {unreadCount > 0 && (
                            <span className="h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-medium flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </span>
                    {tab === "messages" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
                </button>
            </div>

            {/* ═══════════ TAB: Contact Info ═══════════ */}
            {tab === "info" && (
                <div className="space-y-4">
                    {loadingInfo ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-7 w-7 animate-spin text-primary" />
                        </div>
                    ) : info && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Email */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-900">Email</p>
                                </div>
                                <div className="space-y-2">
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
                            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-900">Điện thoại</p>
                                </div>
                                <div className="space-y-2">
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
                            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-900">Địa chỉ</p>
                                </div>
                                <div className="space-y-2">
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
                            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-900">Google Maps</p>
                                </div>
                                <div>
                                    <label className={labelCls}>URL Embed</label>
                                    <input type="text" value={info.mapEmbed} onChange={e => setField("mapEmbed", e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." className={inputCls} />
                                </div>
                                {info.mapEmbed && (
                                    <div className="h-32 rounded-lg overflow-hidden border border-slate-100">
                                        <iframe src={info.mapEmbed} className="w-full h-full border-0" allowFullScreen loading="lazy" />
                                    </div>
                                )}
                            </div>

                            {/* Social — full width */}
                            <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 space-y-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                                        <Globe className="h-4 w-4" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-900">Mạng xã hội</p>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                    {[
                                        { key: "facebook", label: "Facebook", icon: Facebook, color: "text-[#1877F2]" },
                                        { key: "instagram", label: "Instagram", icon: Instagram, color: "text-[#E1306C]" },
                                        { key: "twitter", label: "Twitter", icon: Twitter, color: "text-[#1DA1F2]" },
                                        { key: "website", label: "Website", icon: Globe, color: "text-slate-700" },
                                    ].map(({ key, label, icon: Icon, color }) => (
                                        <div key={key}>
                                            <label className={labelCls}>
                                                <span className={`flex items-center gap-1 ${color}`}><Icon className="h-3 w-3" />{label}</span>
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
                <div className="space-y-4">
                    {/* Filters */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Tìm theo tên, email hoặc chủ đề..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                            />
                        </div>
                        <div className="flex gap-0.5 bg-slate-100 rounded-lg p-0.5">
                            {([["all", "Tất cả", null], ["unread", "Chưa đọc", unreadCount], ["read", "Đã đọc", totalCount - unreadCount]] as [string, string, number | null][]).map(([val, label, count]) => (
                                <button
                                    key={val}
                                    onClick={() => setFilterRead(val as any)}
                                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${filterRead === val
                                            ? "bg-white text-slate-900 shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    {label}
                                    {count !== null && count > 0 && (
                                        <span className="text-[10px] text-slate-400">({count})</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loadingMsg ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-7 w-7 animate-spin text-primary" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="rounded-xl border border-slate-200 bg-white py-16 flex flex-col items-center justify-center gap-2">
                            <Inbox className="h-8 w-8 text-slate-300" />
                            <p className="text-sm text-slate-500">Chưa có tin nhắn nào</p>
                            <p className="text-xs text-slate-400">Tin nhắn từ khách hàng sẽ hiện tại đây</p>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                            {filtered.map((msg, idx) => (
                                <div key={msg.id} className={`${idx > 0 ? "border-t border-slate-100" : ""} ${!msg.read ? "bg-blue-50/30" : ""} transition-colors`}>
                                    <div
                                        className="flex items-start gap-3 p-4 cursor-pointer group hover:bg-slate-50/60 transition-colors"
                                        onClick={() => {
                                            setExpandedId(expandedId === msg.id ? null : msg.id);
                                            if (!msg.read) toggleRead(msg);
                                        }}
                                    >
                                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-medium ${!msg.read
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-slate-100 text-slate-500"
                                            }`}>
                                            {msg.name.slice(0, 1).toUpperCase()}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className={`text-sm ${!msg.read ? "font-semibold text-slate-900" : "font-medium text-slate-600"}`}>{msg.name}</span>
                                                {!msg.read && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                                            </div>
                                            <p className={`text-sm truncate ${!msg.read ? "font-medium text-slate-800" : "text-slate-500"}`}>{msg.subject}</p>
                                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                                                <span>{msg.email}</span>
                                                <span>·</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatDate(msg.createdAt)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <a
                                                href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                                                onClick={e => e.stopPropagation()}
                                                className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                                            >
                                                <Reply className="h-3.5 w-3.5" />
                                            </a>
                                            <button
                                                onClick={e => { e.stopPropagation(); toggleRead(msg); }}
                                                className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors"
                                            >
                                                {msg.read ? <MailOpen className="h-3.5 w-3.5" /> : <MailCheck className="h-3.5 w-3.5" />}
                                            </button>
                                            <button
                                                onClick={e => { e.stopPropagation(); deleteMsg(msg.id); }}
                                                className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                            {expandedId === msg.id ? <ChevronUp className="h-4 w-4 text-slate-300" /> : <ChevronDown className="h-4 w-4 text-slate-300" />}
                                        </div>
                                    </div>

                                    {expandedId === msg.id && (
                                        <div className="px-4 pb-4">
                                            <div className="ml-12 space-y-2">
                                                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                                    {msg.body}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <a
                                                        href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                                                        className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                                                    >
                                                        <Reply className="h-3 w-3" /> Trả lời qua email
                                                    </a>
                                                    <span className="text-slate-200">|</span>
                                                    <button
                                                        onClick={() => deleteMsg(msg.id)}
                                                        className="text-xs text-red-400 font-medium hover:text-red-600 hover:underline flex items-center gap-1"
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
