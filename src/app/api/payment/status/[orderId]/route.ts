import { NextRequest, NextResponse } from "next/server";
import { getOrderById, getPaymentByOrderId } from "@/lib/supabase";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;

        if (!orderId) {
            return NextResponse.json(
                { success: false, error: "Order ID required" },
                { status: 400 }
            );
        }

        // Get order
        const order = await getOrderById(orderId);
        if (!order) {
            return NextResponse.json(
                { success: false, error: "Order not found" },
                { status: 404 }
            );
        }

        // Get payment
        const payment = await getPaymentByOrderId(orderId);

        return NextResponse.json({
            success: true,
            data: {
                orderId: order.id,
                orderCode: order.order_code,
                status: order.status,
                paymentStatus: payment?.status || "unknown",
                amount: order.amount,
                createdAt: order.created_at,
            },
        });
    } catch (error) {
        console.error("[Status] Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to get status" },
            { status: 500 }
        );
    }
}
