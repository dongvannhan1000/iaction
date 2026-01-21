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
    return `${getSiteUrl()}/brand/banner-email.png`;
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
<body style="margin: 0; padding: 0; background-color: #0A0A0F; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0F; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: #111118; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);">
                    <!-- Header with Banner -->
                    <tr>
                        <td style="padding: 0;">
                            <img src="${getBannerUrl()}" alt="${siteName}" style="max-width: 100%; height: auto; display: block;" />
                        </td>
                    </tr>
                    
                    <!-- Red Accent Stripe -->
                    <tr>
                        <td style="height: 4px; background: linear-gradient(90deg, #DC2626 0%, #EF4444 50%, #DC2626 100%);"></td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <!-- Greeting -->
                            <p style="margin: 0 0 8px; color: #71717A; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Xin chào ${order.customerName}</p>
                            <h1 style="margin: 0 0 24px; color: #FAFAFA; font-size: 28px; font-weight: 700; line-height: 1.2;">Thanh toán<br/><span style="color: #22C55E;">thành công!</span></h1>
                            
                            <!-- Divider -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td style="width: 40px; height: 2px; background: #DC2626;"></td>
                                    <td style="height: 2px; background: #27272A;"></td>
                                </tr>
                            </table>
                            
                            <!-- Order Details Card -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: #1C1C24; border-radius: 12px; border-left: 3px solid #DC2626; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0 0 16px; color: #71717A; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Chi tiết đơn hàng</p>
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 8px 0; color: #A1A1AA; font-size: 14px; border-bottom: 1px solid #27272A;">Mã đơn hàng</td>
                                                <td style="padding: 8px 0; color: #FAFAFA; font-size: 14px; font-family: monospace; text-align: right; border-bottom: 1px solid #27272A;">${order.orderCode}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #A1A1AA; font-size: 14px; border-bottom: 1px solid #27272A;">Sản phẩm</td>
                                                <td style="padding: 8px 0; color: #FAFAFA; font-size: 14px; text-align: right; border-bottom: 1px solid #27272A;">${order.productName}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 12px 0; color: #FAFAFA; font-size: 14px; font-weight: 600;">Tổng thanh toán</td>
                                                <td style="padding: 12px 0; color: #DC2626; font-size: 18px; font-weight: 700; text-align: right;">${formatPrice(order.amount)}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            ${productData?.productUrl ? `
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td align="center">
                                        <a href="${productData.productUrl}" style="display: inline-block; background: #DC2626; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 600; letter-spacing: 0.5px;">TRUY CẬP SẢN PHẨM →</a>
                                    </td>
                                </tr>
                            </table>
                            ` : ''}
                            
                            ${productData?.usageGuide ? `
                            <!-- Usage Guide -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: #1C1C24; border-radius: 12px; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0 0 12px; color: #FAFAFA; font-size: 14px; font-weight: 600;">Hướng dẫn sử dụng</p>
                                        <p style="margin: 0; color: #A1A1AA; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${productData.usageGuide}</p>
                                    </td>
                                </tr>
                            </table>
                            ` : ''}
                            
                            <!-- Footer Text -->
                            <p style="margin: 0; color: #52525B; font-size: 13px; line-height: 1.5;">
                                Cảm ơn bạn đã tin tưởng ${siteName}.<br/>
                                Nếu có thắc mắc, đừng ngần ngại liên hệ với chúng tôi.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 40px; background: #0A0A0F; border-top: 1px solid #27272A;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="color: #52525B; font-size: 12px;">© ${new Date().getFullYear()} ${siteName}</td>
                                    <td style="text-align: right; color: #52525B; font-size: 12px;">Made with ❤️ in Vietnam</td>
                                </tr>
                            </table>
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
<body style="margin: 0; padding: 0; background-color: #0A0A0F; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0F; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: #111118; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);">
                    <!-- Header with Banner -->
                    <tr>
                        <td style="padding: 0;">
                            <img src="${getBannerUrl()}" alt="${siteName}" style="max-width: 100%; height: auto; display: block;" />
                        </td>
                    </tr>
                    
                    <!-- Red Accent Stripe -->
                    <tr>
                        <td style="height: 4px; background: linear-gradient(90deg, #DC2626 0%, #EF4444 50%, #DC2626 100%);"></td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <!-- Greeting -->
                            <p style="margin: 0 0 8px; color: #71717A; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Xin chào ${customerName}</p>
                            <h1 style="margin: 0 0 24px; color: #FAFAFA; font-size: 28px; font-weight: 700; line-height: 1.2;">Bạn đã nhận được<br/><span style="color: #22C55E;">${productName}</span></h1>
                            
                            <!-- Divider -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td style="width: 40px; height: 2px; background: #DC2626;"></td>
                                    <td style="height: 2px; background: #27272A;"></td>
                                </tr>
                            </table>
                            
                            <!-- Product Card -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: #1C1C24; border-radius: 12px; border-left: 3px solid #22C55E; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td>
                                                    <p style="margin: 0 0 4px; color: #71717A; font-size: 12px; text-transform: uppercase;">Sản phẩm</p>
                                                    <p style="margin: 0; color: #FAFAFA; font-size: 16px; font-weight: 600;">${productName}</p>
                                                </td>
                                                <td style="text-align: right; vertical-align: middle;">
                                                    <span style="display: inline-block; background: rgba(34, 197, 94, 0.15); color: #22C55E; padding: 6px 12px; border-radius: 100px; font-size: 12px; font-weight: 600;">MIỄN PHÍ</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            ${productData?.productUrl ? `
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td align="center">
                                        <a href="${productData.productUrl}" style="display: inline-block; background: #DC2626; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 600; letter-spacing: 0.5px;">TRUY CẬP NGAY →</a>
                                    </td>
                                </tr>
                            </table>
                            ` : ''}
                            
                            ${productData?.usageGuide ? `
                            <!-- Usage Guide -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: #1C1C24; border-radius: 12px; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0 0 12px; color: #FAFAFA; font-size: 14px; font-weight: 600;">Hướng dẫn sử dụng</p>
                                        <p style="margin: 0; color: #A1A1AA; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${productData.usageGuide}</p>
                                    </td>
                                </tr>
                            </table>
                            ` : ''}
                            
                            <!-- Footer Text -->
                            <p style="margin: 0; color: #52525B; font-size: 13px; line-height: 1.5;">
                                Cảm ơn bạn đã tin tưởng sử dụng sản phẩm của ${siteName}.<br/>
                                Nếu có thắc mắc, đừng ngần ngại liên hệ với chúng tôi.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 40px; background: #0A0A0F; border-top: 1px solid #27272A;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="color: #52525B; font-size: 12px;">© ${new Date().getFullYear()} ${siteName}</td>
                                    <td style="text-align: right; color: #52525B; font-size: 12px;">Made with ❤️ in Vietnam</td>
                                </tr>
                            </table>
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
    const accentColor = isPaid ? '#DC2626' : '#22C55E';
    const statusText = isPaid ? 'ĐÃ THANH TOÁN' : 'MIỄN PHÍ';
    const headingText = isPaid ? 'Thanh toán thành công!' : 'Đăng ký thành công!';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng ký khóa học thành công</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0F; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0F; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: #111118; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);">
                    <!-- Header with Banner -->
                    <tr>
                        <td style="padding: 0;">
                            <img src="${getBannerUrl()}" alt="${siteName}" style="max-width: 100%; height: auto; display: block;" />
                        </td>
                    </tr>
                    
                    <!-- Red Accent Stripe -->
                    <tr>
                        <td style="height: 4px; background: linear-gradient(90deg, #DC2626 0%, #EF4444 50%, #DC2626 100%);"></td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <!-- Greeting -->
                            <p style="margin: 0 0 8px; color: #71717A; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Xin chào ${enrollment.customerName}</p>
                            <h1 style="margin: 0 0 24px; color: #FAFAFA; font-size: 28px; font-weight: 700; line-height: 1.2;">${headingText.split(' ')[0]}<br/><span style="color: #22C55E;">${headingText.split(' ').slice(1).join(' ')}</span></h1>
                            
                            <!-- Divider -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td style="width: 40px; height: 2px; background: #DC2626;"></td>
                                    <td style="height: 2px; background: #27272A;"></td>
                                </tr>
                            </table>
                            
                            <!-- Course Card -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: #1C1C24; border-radius: 12px; border-left: 3px solid #3B82F6; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td>
                                                    <p style="margin: 0 0 4px; color: #71717A; font-size: 12px; text-transform: uppercase;">Khóa học</p>
                                                    <p style="margin: 0; color: #FAFAFA; font-size: 16px; font-weight: 600;">${enrollment.courseName}</p>
                                                </td>
                                                <td style="text-align: right; vertical-align: middle;">
                                                    <span style="display: inline-block; background: rgba(${isPaid ? '220, 38, 38' : '34, 197, 94'}, 0.15); color: ${accentColor}; padding: 6px 12px; border-radius: 100px; font-size: 12px; font-weight: 600;">${statusText}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            ${courseData?.courseUrl ? `
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td align="center">
                                        <a href="${courseData.courseUrl}" style="display: inline-block; background: #3B82F6; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 600; letter-spacing: 0.5px;">BẮT ĐẦU HỌC NGAY →</a>
                                    </td>
                                </tr>
                            </table>
                            ` : ''}
                            
                            <!-- Footer Text -->
                            <p style="margin: 0; color: #52525B; font-size: 13px; line-height: 1.5;">
                                Chúc bạn học tập hiệu quả với ${siteName}!<br/>
                                Nếu có thắc mắc, đừng ngần ngại liên hệ với chúng tôi.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 40px; background: #0A0A0F; border-top: 1px solid #27272A;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="color: #52525B; font-size: 12px;">© ${new Date().getFullYear()} ${siteName}</td>
                                    <td style="text-align: right; color: #52525B; font-size: 12px;">Made with ❤️ in Vietnam</td>
                                </tr>
                            </table>
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
            from: `${siteName} <${senderEmail} > `,
            to: order.customerEmail,
            subject: `✅ Xác nhận thanh toán - ${order.productName} `,
            html,
        });

        if (error) {
            console.error("[Email] Failed to send payment confirmation:", error);
            return false;
        }

        console.log(`[Email] Payment confirmation sent to: ${order.customerEmail} `);
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
            from: `${siteName} <${senderEmail} > `,
            to: customerEmail,
            subject: `🎉 Bạn đã nhận được ${productName} `,
            html,
        });

        if (error) {
            console.error("[Email] Failed to send free product email:", error);
            return false;
        }

        console.log(`[Email] Free product email sent to: ${customerEmail} `);
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
            from: `${siteName} <${senderEmail} > `,
            to: enrollment.customerEmail,
            subject: isPaid
                ? `✅ Xác nhận thanh toán khóa học - ${enrollment.courseName} `
                : `🎓 Chào mừng đến với khóa học ${enrollment.courseName} `,
            html,
        });

        if (error) {
            console.error("[Email] Failed to send course enrollment email:", error);
            return false;
        }

        console.log(`[Email] Course enrollment email sent to: ${enrollment.customerEmail} `);
        return true;
    } catch (error) {
        console.error("[Email] Error sending course enrollment email:", error);
        return false;
    }
}
