import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password, referralCode } = body;

        // --- Validation ---
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email và mật khẩu là bắt buộc" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Email không hợp lệ" },
                { status: 400 }
            );
        }

        // Validate password length
        if (password.length < 6) {
            return NextResponse.json(
                { error: "Mật khẩu phải có ít nhất 6 ký tự" },
                { status: 400 }
            );
        }

        // --- Check if email already exists ---
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Email này đã được sử dụng" },
                { status: 409 }
            );
        }

        // --- Hash password ---
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // --- Create user ---
        const user = await prisma.user.create({
            data: {
                name: name?.trim() || null,
                email: email.toLowerCase().trim(),
                password: hashedPassword,
            },
        });

        // Return user data without the password
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user;

        // --- Handle referral code ---
        if (referralCode) {
            try {
                const referrerProfile = await prisma.affiliateProfile.findUnique({
                    where: { referralCode: referralCode.trim().toUpperCase() },
                });

                if (referrerProfile && referrerProfile.userId !== user.id) {
                    // Create F1 referral (direct)
                    await prisma.referral.create({
                        data: {
                            referrerId: referrerProfile.userId,
                            refereeId: user.id,
                            level: 1,
                        },
                    });

                    // Check if the referrer has their own referrer for F2
                    const referrerOfReferrer = await prisma.referral.findFirst({
                        where: { refereeId: referrerProfile.userId, level: 1 },
                    });

                    if (referrerOfReferrer) {
                        // Create F2 referral (indirect)
                        await prisma.referral.create({
                            data: {
                                referrerId: referrerOfReferrer.referrerId,
                                refereeId: user.id,
                                level: 2,
                            },
                        });
                    }
                }
            } catch (refError) {
                console.error("Referral processing error:", refError);
                // Don't fail signup if referral fails
            }
        }

        return NextResponse.json(
            {
                message: "Đăng ký thành công!",
                user: userWithoutPassword,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Đã có lỗi xảy ra. Vui lòng thử lại sau." },
            { status: 500 }
        );
    }
}
