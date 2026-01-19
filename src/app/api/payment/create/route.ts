import { NextRequest, NextResponse } from "next/server";
import {
    getSepayConfig,
    generateOrderCode,
    generateQRCodeUrl,
    type SepayPaymentInfo,
} from "@/lib/sepay/config";
import { createOrder, createPayment } from "@/lib/supabase";

interface CreatePaymentBody {
    productId: string;
    productName: string;
    amount: number;
    customerEmail: string;
    customerName?: string;
    customerPhone?: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: CreatePaymentBody = await request.json();

        // Validate required fields
        if (!body.productId || !body.amount || !body.customerEmail) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.customerEmail)) {
            return NextResponse.json(
                { success: false, error: "Invalid email format" },
                { status: 400 }
            );
        }

        const config = getSepayConfig();

        // Check if Sepay is configured
        if (!config.bankAccount || !config.accountHolder) {
            return NextResponse.json(
                { success: false, error: "Payment system not configured" },
                { status: 500 }
            );
        }

        // Create order in database
        const order = await createOrder({
            productId: body.productId,
            productName: body.productName,
            amount: body.amount,
            customerEmail: body.customerEmail,
            customerName: body.customerName,
            customerPhone: body.customerPhone,
        });

        // Create pending payment record
        await createPayment({
            orderId: order.id,
            status: "pending",
        });

        // Generate QR code URL
        const qrCodeUrl = generateQRCodeUrl(order.order_code, body.amount);

        // Calculate expiry time (10 minutes from now)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

        const paymentInfo: SepayPaymentInfo = {
            orderId: order.id,
            orderCode: order.order_code,
            bankAccount: config.bankAccount,
            bankName: config.bankName,
            accountHolder: config.accountHolder,
            amount: body.amount,
            content: order.order_code,
            qrCodeUrl,
            expiresAt,
        };

        console.log(`[Payment] Created order: ${order.order_code} for ${body.customerEmail}`);

        return NextResponse.json({
            success: true,
            data: paymentInfo,
        });
    } catch (error) {
        console.error("[Payment] Create error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create payment" },
            { status: 500 }
        );
    }
}
