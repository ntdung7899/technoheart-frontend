import { NextResponse } from "next/server";

const API_URL =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3000/api/v1.0";

export async function GET(
    _req: Request,
    context: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await context.params;

        const response = await fetch(
            `${API_URL}/orders/status/${encodeURIComponent(code)}`,
            {
                method: "GET",
                cache: "no-store",
            }
        );

        const result = await response.json().catch(() => null);

        return NextResponse.json(result || { success: response.ok }, {
            status: response.status,
        });
    } catch (error) {
        console.error("ORDER_STATUS_PROXY_ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Không thể kiểm tra trạng thái đơn hàng",
            },
            { status: 500 }
        );
    }
}