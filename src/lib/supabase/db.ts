import { createServiceClient } from "./client";
import type {
    Order,
    Payment,
    CreateOrderInput,
    CreatePaymentInput,
    OrderStatus,
    PaymentStatus,
} from "./types";

// Generate unique order code
function generateOrderCode(): string {
    const date = new Date();
    const dateStr =
        date.getFullYear().toString().slice(-2) +
        String(date.getMonth() + 1).padStart(2, "0") +
        String(date.getDate()).padStart(2, "0");
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `IA${dateStr}${random}`;
}

// =====================================
// ORDER OPERATIONS
// =====================================

export async function createOrder(input: CreateOrderInput): Promise<Order> {
    const supabase = createServiceClient();

    const orderData = {
        order_code: generateOrderCode(),
        product_id: input.productId,
        product_name: input.productName,
        amount: input.amount,
        customer_email: input.customerEmail,
        customer_name: input.customerName || null,
        customer_phone: input.customerPhone || null,
        status: "pending" as OrderStatus,
    };

    const { data, error } = await supabase
        .from("orders")
        .insert(orderData)
        .select()
        .single();

    if (error) {
        console.error("[Supabase] createOrder error:", error);
        throw new Error(`Failed to create order: ${error.message}`);
    }

    console.log(`[Supabase] Order created: ${data.order_code}`);
    return data;
}

export async function getOrderByCode(orderCode: string): Promise<Order | null> {
    const supabase = createServiceClient();

    const { data, error } = await supabase
        .from("orders")
        .select()
        .eq("order_code", orderCode)
        .single();

    if (error) {
        if (error.code === "PGRST116") return null; // Not found
        console.error("[Supabase] getOrderByCode error:", error);
        throw new Error(`Failed to get order: ${error.message}`);
    }

    return data;
}

export async function getOrderById(id: string): Promise<Order | null> {
    const supabase = createServiceClient();

    const { data, error } = await supabase
        .from("orders")
        .select()
        .eq("id", id)
        .single();

    if (error) {
        if (error.code === "PGRST116") return null;
        console.error("[Supabase] getOrderById error:", error);
        throw new Error(`Failed to get order: ${error.message}`);
    }

    return data;
}

export async function updateOrderStatus(
    orderId: string,
    status: OrderStatus
): Promise<Order> {
    const supabase = createServiceClient();

    const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId)
        .select()
        .single();

    if (error) {
        console.error("[Supabase] updateOrderStatus error:", error);
        throw new Error(`Failed to update order: ${error.message}`);
    }

    console.log(`[Supabase] Order ${orderId} updated to status: ${status}`);
    return data;
}

// =====================================
// PAYMENT OPERATIONS
// =====================================

export async function createPayment(input: CreatePaymentInput): Promise<Payment> {
    const supabase = createServiceClient();

    const paymentData = {
        order_id: input.orderId,
        sepay_transaction_id: input.sepayTransactionId || null,
        payment_method: input.paymentMethod || null,
        status: input.status,
        webhook_received_at: null,
        raw_webhook: null,
    };

    const { data, error } = await supabase
        .from("payments")
        .insert(paymentData)
        .select()
        .single();

    if (error) {
        console.error("[Supabase] createPayment error:", error);
        throw new Error(`Failed to create payment: ${error.message}`);
    }

    console.log(`[Supabase] Payment created for order: ${input.orderId}`);
    return data;
}

export async function getPaymentByOrderId(orderId: string): Promise<Payment | null> {
    const supabase = createServiceClient();

    const { data, error } = await supabase
        .from("payments")
        .select()
        .eq("order_id", orderId)
        .single();

    if (error) {
        if (error.code === "PGRST116") return null;
        console.error("[Supabase] getPaymentByOrderId error:", error);
        throw new Error(`Failed to get payment: ${error.message}`);
    }

    return data;
}

export async function getPaymentBySepayId(sepayTransactionId: string): Promise<Payment | null> {
    const supabase = createServiceClient();

    const { data, error } = await supabase
        .from("payments")
        .select()
        .eq("sepay_transaction_id", sepayTransactionId)
        .single();

    if (error) {
        if (error.code === "PGRST116") return null;
        console.error("[Supabase] getPaymentBySepayId error:", error);
        throw new Error(`Failed to get payment: ${error.message}`);
    }

    return data;
}

export async function updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
    webhookData?: Record<string, unknown>
): Promise<Payment> {
    const supabase = createServiceClient();

    const updateData: Partial<Payment> = { status };
    if (webhookData) {
        updateData.webhook_received_at = new Date().toISOString();
        updateData.raw_webhook = webhookData;
    }

    const { data, error } = await supabase
        .from("payments")
        .update(updateData)
        .eq("id", paymentId)
        .select()
        .single();

    if (error) {
        console.error("[Supabase] updatePaymentStatus error:", error);
        throw new Error(`Failed to update payment: ${error.message}`);
    }

    console.log(`[Supabase] Payment ${paymentId} updated to status: ${status}`);
    return data;
}

// =====================================
// IDEMPOTENCY CHECK
// =====================================

export async function isPaymentProcessed(sepayTransactionId: string): Promise<boolean> {
    const payment = await getPaymentBySepayId(sepayTransactionId);
    return payment !== null && payment.status === "success";
}
