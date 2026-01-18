// Database types for Supabase

export type OrderStatus = "pending" | "paid" | "cancelled" | "refunded";
export type PaymentStatus = "pending" | "success" | "failed";
export type PaymentMethod = "vietqr" | "bank_transfer" | "card";

export interface Order {
    id: string;
    order_code: string;
    product_id: string;
    product_name: string;
    amount: number;
    customer_email: string;
    customer_name: string | null;
    customer_phone: string | null;
    status: OrderStatus;
    created_at: string;
    updated_at: string;
}

export interface Payment {
    id: string;
    order_id: string;
    sepay_transaction_id: string | null;
    payment_method: PaymentMethod | null;
    status: PaymentStatus;
    webhook_received_at: string | null;
    raw_webhook: Record<string, unknown> | null;
    created_at: string;
}

// Supabase Database type definition
export interface Database {
    public: {
        Tables: {
            orders: {
                Row: Order;
                Insert: Omit<Order, "id" | "created_at" | "updated_at">;
                Update: Partial<Omit<Order, "id" | "created_at">>;
            };
            payments: {
                Row: Payment;
                Insert: Omit<Payment, "id" | "created_at">;
                Update: Partial<Omit<Payment, "id" | "created_at">>;
            };
        };
    };
}

// Helper types for API
export interface CreateOrderInput {
    productId: string;
    productName: string;
    amount: number;
    customerEmail: string;
    customerName?: string;
    customerPhone?: string;
}

export interface CreatePaymentInput {
    orderId: string;
    sepayTransactionId?: string;
    paymentMethod?: PaymentMethod;
    status: PaymentStatus;
}
