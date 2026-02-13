import { logout } from "@/lib/auth-utils";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await logout();
        return NextResponse.json({ message: "Đăng xuất thành công" });
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
