import { NextRequest, NextResponse } from "next/server";
import {
    verifyWebhookApiKey,
    extractOrderCode,
    type SepayWebhookPayload,
} from "@/lib/sepay/config";
import {
    getOrderByCode,
    getPaymentByOrderId,
    updateOrderStatus,
    updatePaymentStatus,
    isPaymentProcessed,
} from "@/lib/supabase";
import { sendPaymentConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization");
        const payload: SepayWebhookPayload = await request.json();

        console.log("[Webhook] Received:", JSON.stringify(payload));

        // 1. Verify API key
        if (!verifyWebhookApiKey(authHeader)) {
            console.warn("[Webhook] Invalid API key");
            return NextResponse.json(
                { success: false, message: "Invalid API key" },
                { status: 401 }
            );
        }

        // 2. Only process incoming transfers
        if (payload.transferType !== "in") {
            console.log("[Webhook] Ignored: outgoing transfer");
            return NextResponse.json({ success: true, message: "Ignored" });
        }

        // 3. Extract order code from payment content
        const orderCode = extractOrderCode(payload);
        if (!orderCode) {
            console.log("[Webhook] No order code found in:", payload.content);
            return NextResponse.json({ success: true, message: "No order code" });
        }

        console.log(`[Webhook] Processing order: ${orderCode}`);

        // 4. Idempotency check - already processed?
        if (payload.referenceCode) {
            const alreadyProcessed = await isPaymentProcessed(payload.referenceCode);
            if (alreadyProcessed) {
                console.log(`[Webhook] Already processed: ${payload.referenceCode}`);
                return NextResponse.json({ success: true, message: "Already processed" });
            }
        }

        // 5. Find order by code
        const order = await getOrderByCode(orderCode);
        if (!order) {
            console.log(`[Webhook] Order not found: ${orderCode}`);
            return NextResponse.json({ success: true, message: "Order not found" });
        }

        // 6. Check if order is still pending
        if (order.status !== "pending") {
            console.log(`[Webhook] Order not pending: ${order.status}`);
            return NextResponse.json({ success: true, message: "Order not pending" });
        }

        // 7. Verify amount
        if (payload.transferAmount < Number(order.amount)) {
            console.warn(`[Webhook] Insufficient: ${payload.transferAmount} < ${order.amount}`);
            return NextResponse.json({ success: true, message: "Insufficient amount" });
        }

        // 8. Get payment record
        const payment = await getPaymentByOrderId(order.id);
        if (!payment) {
            console.error(`[Webhook] Payment not found for order: ${order.id}`);
            return NextResponse.json({ success: true, message: "Payment not found" });
        }

        // 9. Update payment status
        await updatePaymentStatus(payment.id, "success", {
            sepayId: payload.id,
            referenceCode: payload.referenceCode,
            transactionDate: payload.transactionDate,
            transferAmount: payload.transferAmount,
        });

        // 10. Update order status
        await updateOrderStatus(order.id, "paid");

        console.log(`[Webhook] SUCCESS: Order ${orderCode} paid!`);

        // 11. Send confirmation email to customer (async, don't wait)
        sendPaymentConfirmationEmail({
            orderCode: order.order_code,
            customerName: order.customer_name || "Quý khách",
            customerEmail: order.customer_email,
            productId: order.product_id,
            productName: order.product_name,
            amount: Number(order.amount),
        }).catch((err) => console.error("[Webhook] Failed to send email:", err));

        return NextResponse.json({
            success: true,
            message: "Payment completed",
            orderCode,
        });
    } catch (error) {
        console.error("[Webhook] Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal error" },
            { status: 500 }
        );
    }
}

// HEAD request for Sepay webhook verification
export async function HEAD() {
    return new NextResponse(null, { status: 200 });
}
