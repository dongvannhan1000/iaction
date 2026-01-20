import { Resend } from "resend";
import { client } from "../../../sanity/lib/client";
import {
    productWithSensitiveDataQuery,
    courseWithSensitiveDataQuery,
    siteSettingsQuery,
} from "../../../sanity/lib/queries";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderInfo {
    orderCode: string;
    customerName: string;
    customerEmail: string;
    productId: string;
    productName: string;
    amount: number;
}

interface EnrollmentInfo {
    customerName: string;
    customerEmail: string;
    courseId: string;
    courseName: string;
}

interface SiteSettings {
    siteName: string;
    email: string;
}

interface ProductSensitiveData {
    _id: string;
    name: string;
    productUrl: string | null;
    usageGuide: string | null;
}

interface CourseSensitiveData {
    _id: string;
    title: string;
    courseUrl: string | null;
}

// Get sender email - prioritize SENDER_EMAIL env var for Resend compatibility
// For Resend free tier, use: onboarding@resend.dev
async function getSenderEmail(): Promise<string> {
    // First check env variable (required for Resend free tier)
    if (process.env.SENDER_EMAIL) {
        return process.env.SENDER_EMAIL;
    }

    // Fallback to site settings (only works with verified domain)
    try {
        const settings: SiteSettings | null = await client.fetch(siteSettingsQuery);
        return settings?.email || "onboarding@resend.dev";
    } catch (error) {
        console.error("[Email] Failed to get sender email:", error);
        return "onboarding@resend.dev";
    }
}

// Get site name for email subject
async function getSiteName(): Promise<string> {
    try {
        const settings: SiteSettings | null = await client.fetch(siteSettingsQuery);
        return settings?.siteName || "IAction";
    } catch (error) {
        console.error("[Email] Failed to get site name:", error);
        return "IAction";
    }
}

// Fetch product sensitive data (productUrl, usageGuide) - BACKEND ONLY
async function getProductSensitiveData(productId: string): Promise<ProductSensitiveData | null> {
    try {
        const data = await client.fetch(productWithSensitiveDataQuery, { productId });
        return data;
    } catch (error) {
        console.error("[Email] Failed to fetch product data:", error);
        return null;
    }
}

// Fetch course sensitive data (courseUrl) - BACKEND ONLY
async function getCourseSensitiveData(courseId: string): Promise<CourseSensitiveData | null> {
    try {
        const data = await client.fetch(courseWithSensitiveDataQuery, { courseId });
        return data;
    } catch (error) {
        console.error("[Email] Failed to fetch course data:", error);
        return null;
    }
}

// Format price in VND
function formatPrice(price: number): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
}

// Get site URL for images
function getSiteUrl(): string {
    return process.env.NEXT_PUBLIC_SITE_URL || "https://iaction.vn";
}

// Get banner image URL
function getBannerUrl(): string {
    return `${getSiteUrl()}/brand/banner-v2.png`;
}

// Generate payment confirmation email HTML
function generatePaymentEmailHtml(
    order: OrderInfo,
    productData: ProductSensitiveData | null,
    siteName: string
): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận thanh toán</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden;">
                    <!-- Header with Banner -->
                    <tr>
                        <td style="padding: 30px 40px 20px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <img src="${getBannerUrl()}" alt="${siteName}" style="max-width: 200px; height: auto;" />
                        </td>
                    </tr>
                    
                    <!-- Success Icon -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center;">
                            <div style="width: 80px; height: 80px; background: rgba(34, 197, 94, 0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                                <span style="font-size: 40px;">✓</span>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 0 40px 40px;">
                            <h2 style="margin: 0 0 10px; color: #ffffff; font-size: 24px; text-align: center;">Thanh toán thành công!</h2>
                            <p style="margin: 0 0 30px; color: #9ca3af; font-size: 16px; text-align: center;">
                                Xin chào <strong style="color: #ffffff;">${order.customerName}</strong>, cảm ơn bạn đã mua hàng.
                            </p>
                            
                            <!-- Order Details -->
                            <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                                <h3 style="margin: 0 0 15px; color: #ffffff; font-size: 16px;">Chi tiết đơn hàng</h3>
                                <table width="100%" style="color: #9ca3af; font-size: 14px;">
                                    <tr>
                                        <td style="padding: 8px 0;">Mã đơn hàng:</td>
                                        <td style="text-align: right; color: #ffffff; font-family: monospace;">${order.orderCode}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">Sản phẩm:</td>
                                        <td style="text-align: right; color: #ffffff;">${order.productName}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">Số tiền:</td>
                                        <td style="text-align: right; color: #ef4444; font-weight: bold;">${formatPrice(order.amount)}</td>
                                    </tr>
                                </table>
                            </div>
                            
                            ${productData?.productUrl ? `
                            <!-- Access Button -->
                            <div style="text-align: center; margin-bottom: 30px;">
                                <a href="${productData.productUrl}" style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: bold;">
                                    🔗 Truy cập sản phẩm
                                </a>
                            </div>
                            ` : ''}
                            
                            ${productData?.usageGuide ? `
                            <!-- Usage Guide -->
                            <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                                <h3 style="margin: 0 0 15px; color: #ef4444; font-size: 16px;">📖 Hướng dẫn sử dụng</h3>
                                <p style="margin: 0; color: #d1d5db; font-size: 14px; white-space: pre-wrap; line-height: 1.6;">${productData.usageGuide}</p>
                            </div>
                            ` : ''}
                            
                            <p style="margin: 0; color: #6b7280; font-size: 13px; text-align: center;">
                                Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 40px; background: rgba(0,0,0,0.3); text-align: center;">
                            <p style="margin: 0; color: #6b7280; font-size: 12px;">
                                © ${new Date().getFullYear()} ${siteName}. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}

// Generate free product registration email HTML
function generateFreeProductEmailHtml(
    customerName: string,
    productName: string,
    productData: ProductSensitiveData | null,
    siteName: string
): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng ký thành công</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden;">
                    <!-- Header with Banner -->
                    <tr>
                        <td style="padding: 30px 40px 20px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <img src="${getBannerUrl()}" alt="${siteName}" style="max-width: 200px; height: auto;" />
                        </td>
                    </tr>
                    
                    <!-- Success Icon -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center;">
                            <div style="width: 80px; height: 80px; background: rgba(34, 197, 94, 0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                                <span style="font-size: 40px;">🎉</span>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 0 40px 40px;">
                            <h2 style="margin: 0 0 10px; color: #ffffff; font-size: 24px; text-align: center;">Đăng ký thành công!</h2>
                            <p style="margin: 0 0 30px; color: #9ca3af; font-size: 16px; text-align: center;">
                                Xin chào <strong style="color: #ffffff;">${customerName}</strong>, bạn đã nhận được sản phẩm miễn phí.
                            </p>
                            
                            <!-- Product Info -->
                            <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin-bottom: 30px; text-align: center;">
                                <h3 style="margin: 0 0 10px; color: #22c55e; font-size: 18px;">${productName}</h3>
                                <span style="color: #22c55e; font-size: 14px;">✨ Miễn phí</span>
                            </div>
                            
                            ${productData?.productUrl ? `
                            <!-- Access Button -->
                            <div style="text-align: center; margin-bottom: 30px;">
                                <a href="${productData.productUrl}" style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: bold;">
                                    🔗 Truy cập sản phẩm
                                </a>
                            </div>
                            ` : ''}
                            
                            ${productData?.usageGuide ? `
                            <!-- Usage Guide -->
                            <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                                <h3 style="margin: 0 0 15px; color: #22c55e; font-size: 16px;">📖 Hướng dẫn sử dụng</h3>
                                <p style="margin: 0; color: #d1d5db; font-size: 14px; white-space: pre-wrap; line-height: 1.6;">${productData.usageGuide}</p>
                            </div>
                            ` : ''}
                            
                            <p style="margin: 0; color: #6b7280; font-size: 13px; text-align: center;">
                                Cảm ơn bạn đã quan tâm đến sản phẩm của chúng tôi!
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 40px; background: rgba(0,0,0,0.3); text-align: center;">
                            <p style="margin: 0; color: #6b7280; font-size: 12px;">
                                © ${new Date().getFullYear()} ${siteName}. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}

// Generate course enrollment email HTML
function generateCourseEnrollmentEmailHtml(
    enrollment: EnrollmentInfo,
    courseData: CourseSensitiveData | null,
    siteName: string,
    isPaid: boolean
): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng ký khóa học thành công</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden;">
                    <!-- Header with Banner -->
                    <tr>
                        <td style="padding: 30px 40px 20px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <img src="${getBannerUrl()}" alt="${siteName}" style="max-width: 200px; height: auto;" />
                        </td>
                    </tr>
                    
                    <!-- Success Icon -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center;">
                            <div style="width: 80px; height: 80px; background: rgba(59, 130, 246, 0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                                <span style="font-size: 40px;">🎓</span>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 0 40px 40px;">
                            <h2 style="margin: 0 0 10px; color: #ffffff; font-size: 24px; text-align: center;">
                                ${isPaid ? "Thanh toán thành công!" : "Đăng ký thành công!"}
                            </h2>
                            <p style="margin: 0 0 30px; color: #9ca3af; font-size: 16px; text-align: center;">
                                Xin chào <strong style="color: #ffffff;">${enrollment.customerName}</strong>, 
                                ${isPaid ? "cảm ơn bạn đã mua khóa học." : "bạn đã đăng ký khóa học miễn phí."}
                            </p>
                            
                            <!-- Course Info -->
                            <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin-bottom: 30px; text-align: center;">
                                <h3 style="margin: 0 0 10px; color: #3b82f6; font-size: 18px;">📚 ${enrollment.courseName}</h3>
                                <span style="color: ${isPaid ? '#ef4444' : '#22c55e'}; font-size: 14px;">
                                    ${isPaid ? '💳 Đã thanh toán' : '✨ Miễn phí'}
                                </span>
                            </div>
                            
                            ${courseData?.courseUrl ? `
                            <!-- Access Button -->
                            <div style="text-align: center; margin-bottom: 30px;">
                                <a href="${courseData.courseUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: bold;">
                                    🎬 Bắt đầu học ngay
                                </a>
                            </div>
                            ` : ''}
                            
                            <p style="margin: 0; color: #6b7280; font-size: 13px; text-align: center;">
                                Chúc bạn học tập hiệu quả! Nếu có câu hỏi, hãy liên hệ với chúng tôi.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 40px; background: rgba(0,0,0,0.3); text-align: center;">
                            <p style="margin: 0; color: #6b7280; font-size: 12px;">
                                © ${new Date().getFullYear()} ${siteName}. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}

// ==========================================
// PUBLIC API: Send emails
// ==========================================

/**
 * Send payment confirmation email after successful payment
 */
export async function sendPaymentConfirmationEmail(order: OrderInfo): Promise<boolean> {
    try {
        const [senderEmail, siteName, productData] = await Promise.all([
            getSenderEmail(),
            getSiteName(),
            getProductSensitiveData(order.productId),
        ]);

        const html = generatePaymentEmailHtml(order, productData, siteName);

        const { error } = await resend.emails.send({
            from: `${siteName} <${senderEmail}>`,
            to: order.customerEmail,
            subject: `✅ Xác nhận thanh toán - ${order.productName}`,
            html,
        });

        if (error) {
            console.error("[Email] Failed to send payment confirmation:", error);
            return false;
        }

        console.log(`[Email] Payment confirmation sent to: ${order.customerEmail}`);
        return true;
    } catch (error) {
        console.error("[Email] Error sending payment confirmation:", error);
        return false;
    }
}

/**
 * Send free product registration email
 */
export async function sendFreeProductEmail(
    customerName: string,
    customerEmail: string,
    productId: string,
    productName: string
): Promise<boolean> {
    try {
        const [senderEmail, siteName, productData] = await Promise.all([
            getSenderEmail(),
            getSiteName(),
            getProductSensitiveData(productId),
        ]);

        const html = generateFreeProductEmailHtml(customerName, productName, productData, siteName);

        const { error } = await resend.emails.send({
            from: `${siteName} <${senderEmail}>`,
            to: customerEmail,
            subject: `🎉 Bạn đã nhận được ${productName}`,
            html,
        });

        if (error) {
            console.error("[Email] Failed to send free product email:", error);
            return false;
        }

        console.log(`[Email] Free product email sent to: ${customerEmail}`);
        return true;
    } catch (error) {
        console.error("[Email] Error sending free product email:", error);
        return false;
    }
}

/**
 * Send course enrollment confirmation email
 */
export async function sendCourseEnrollmentEmail(
    enrollment: EnrollmentInfo,
    isPaid: boolean
): Promise<boolean> {
    try {
        const [senderEmail, siteName, courseData] = await Promise.all([
            getSenderEmail(),
            getSiteName(),
            getCourseSensitiveData(enrollment.courseId),
        ]);

        const html = generateCourseEnrollmentEmailHtml(enrollment, courseData, siteName, isPaid);

        const { error } = await resend.emails.send({
            from: `${siteName} <${senderEmail}>`,
            to: enrollment.customerEmail,
            subject: isPaid
                ? `✅ Xác nhận thanh toán khóa học - ${enrollment.courseName}`
                : `🎓 Chào mừng đến với khóa học ${enrollment.courseName}`,
            html,
        });

        if (error) {
            console.error("[Email] Failed to send course enrollment email:", error);
            return false;
        }

        console.log(`[Email] Course enrollment email sent to: ${enrollment.customerEmail}`);
        return true;
    } catch (error) {
        console.error("[Email] Error sending course enrollment email:", error);
        return false;
    }
}
