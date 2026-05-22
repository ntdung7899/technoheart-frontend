import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { setSession } from "@/lib/auth-utils";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email và mật khẩu là bắt buộc" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Email hoặc mật khẩu không chính xác" },
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Email hoặc mật khẩu không chính xác" },
                { status: 401 }
            );
        }

        // Set session cookie
        await setSession(user);

        // Remove password from user object
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            message: "Đăng nhập thành công!",
            user: userWithoutPassword,
        });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Đã có lỗi xảy ra. Vui lòng thử lại sau." },
            { status: 500 }
        );
    }
}