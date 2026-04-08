import { getSession } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateReferralCode } from "@/lib/affiliate-utils";

export async function POST() {
    try {
        const session = await getSession();
        if (!session?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.id as string;
        if (!userId || typeof userId !== "string") {
            return NextResponse.json({ error: "Invalid session" }, { status: 401 });
        }

        // Verify user exists in DB (session could be stale)
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return NextResponse.json({ error: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại" }, { status: 401 });
        }

        // Check if already registered
        const existing = await prisma.affiliateProfile.findUnique({
            where: { userId },
        });
        if (existing) {
            return NextResponse.json({ error: "Bạn đã đăng ký affiliate" }, { status: 409 });
        }

        // Generate unique referral code
        let referralCode = generateReferralCode();
        let attempts = 0;
        while (attempts < 10) {
            const exists = await prisma.affiliateProfile.findUnique({
                where: { referralCode },
            });
            if (!exists) break;
            referralCode = generateReferralCode();
            attempts++;
        }

        const profile = await prisma.affiliateProfile.create({
            data: {
                userId,
                referralCode,
                rank: "BA",
                personalPV: 0,
                teamPV: 0,
                totalEarnings: 0,
            },
        });

        return NextResponse.json({ profile }, { status: 201 });
    } catch (error) {
        console.error("Affiliate register error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
