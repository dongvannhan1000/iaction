// Sepay Configuration and Types

export interface SepayConfig {
    bankAccount: string;
    bankName: string;
    accountHolder: string;
    webhookApiKey?: string;
    qrBaseUrl: string;
}

export interface SepayWebhookPayload {
    id: number;
    gateway: string;
    transactionDate: string;
    accountNumber: string;
    code: string | null; // Auto-extracted orderCode
    content: string; // Full transfer content
    transferType: "in" | "out";
    transferAmount: number;
    accumulated: number;
    referenceCode: string;
}

export interface SepayPaymentInfo {
    orderId: string;
    orderCode: string;
    bankAccount: string;
    bankName: string;
    accountHolder: string;
    amount: number;
    content: string;
    qrCodeUrl: string;
    expiresAt: string;
}

export function getSepayConfig(): SepayConfig {
    return {
        bankAccount: process.env.SEPAY_BANK_ACCOUNT || "",
        bankName: process.env.SEPAY_BANK_NAME || "BIDV",
        accountHolder: process.env.SEPAY_ACCOUNT_HOLDER || "",
        webhookApiKey: process.env.SEPAY_WEBHOOK_API_KEY,
        qrBaseUrl: "https://qr.sepay.vn/img",
    };
}

// Generate unique order code (IA + date + random)
export function generateOrderCode(): string {
    const date = new Date();
    const dateStr =
        date.getFullYear().toString().slice(-2) +
        String(date.getMonth() + 1).padStart(2, "0") +
        String(date.getDate()).padStart(2, "0");
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `IA${dateStr}${random}`;
}

// Generate QR code URL for Sepay
export function generateQRCodeUrl(orderCode: string, amount: number): string {
    const config = getSepayConfig();
    const params = new URLSearchParams({
        acc: config.bankAccount,
        bank: config.bankName,
        amount: amount.toString(),
        des: orderCode,
    });
    return `${config.qrBaseUrl}?${params.toString()}`;
}

// Verify webhook API key from Authorization header
export function verifyWebhookApiKey(authHeader?: string | null): boolean {
    const config = getSepayConfig();
    if (!config.webhookApiKey) return true; // No key configured = skip check
    if (!authHeader) return false;
    const apiKey = authHeader.replace("Apikey ", "").trim();
    return apiKey === config.webhookApiKey;
}

// Extract order code from webhook payload
export function extractOrderCode(payload: SepayWebhookPayload): string | null {
    if (payload.code) return payload.code.toUpperCase();
    // Fallback: parse from content using regex
    const match = payload.content?.match(/IA[A-Z0-9]+/i);
    return match ? match[0].toUpperCase() : null;
}
