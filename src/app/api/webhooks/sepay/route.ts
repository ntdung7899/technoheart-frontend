import { NextResponse } from "next/server";
import { forwardSePayWebhookToBackend } from "@/lib/api/webhooks";

export async function POST(req: Request) {
    try {
        const authorization = req.headers.get("Authorization");
        const payload = await req.json();

        console.log("SEPAY_WEBHOOK_FE_RECEIVED:", {
            authorization: Boolean(authorization),
            payload,
        });

        const result = await forwardSePayWebhookToBackend(
            payload,
            authorization
        );

        console.log("SEPAY_WEBHOOK_FE_FORWARDED:", {
            status: result.status,
            body: result.body,
        });

        return NextResponse.json(result.body || { success: true }, {
            status: result.status,
        });
    } catch (error) {
        console.error("SEPAY_WEBHOOK_ROUTE_ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Webhook proxy error",
            },
            {
                status: 500,
            }
        );
    }
}