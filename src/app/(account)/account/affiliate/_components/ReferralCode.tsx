"use client";

import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";

interface Props {
    referralCode: string;
}

export function ReferralCode({ referralCode }: Props) {
    const [copied, setCopied] = useState(false);

    const getReferralLink = () =>
        typeof window !== "undefined"
            ? `${window.location.origin}/signup?ref=${referralCode}`
            : "";

    const copyReferralLink = async () => {
        const link = getReferralLink();
        if (!link) return;
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(link);
            } else {
                fallbackCopy(link);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            fallbackCopy(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const fallbackCopy = (text: string) => {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
    };

    const handleShare = () => {
        const link = getReferralLink();
        if (navigator.share) {
            navigator.share({ title: "Technoheart Affiliate", url: link });
        }
    };

    return (
        <div className="rounded-2xl border border-border/40 bg-card/50 p-5">
            <h3 className="text-sm font-bold mb-3">Mã giới thiệu của bạn</h3>
            <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2 rounded-xl bg-secondary/50 px-4 py-3 font-mono text-lg font-semibold tracking-wider">
                    {referralCode}
                </div>
                <button
                    onClick={copyReferralLink}
                    className="flex items-center gap-2 rounded-xl bg-primary text-white px-4 py-3 text-sm font-bold hover:bg-primary/90 transition-all"
                >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span className="hidden sm:inline">{copied ? "Đã copy!" : "Copy link"}</span>
                </button>
                <button
                    onClick={handleShare}
                    className="flex items-center justify-center rounded-xl border border-border/40 bg-card px-3 py-3 text-muted-foreground hover:text-primary transition-colors"
                >
                    <Share2 className="h-4 w-4" />
                </button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
                Link giới thiệu: <code className="text-primary">{getReferralLink()}</code>
            </p>
        </div>
    );
}
