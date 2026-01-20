import { NextRequest, NextResponse } from "next/server";
import { sendFreeProductEmail, sendCourseEnrollmentEmail } from "@/lib/email";

interface EnrollmentRequest {
    type: "product" | "course";
    itemId: string;
    itemName: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    isPaid?: boolean;
}

export async function POST(request: NextRequest) {
    try {
        const body: EnrollmentRequest = await request.json();

        console.log("[Enroll] Received:", body);

        // Validate required fields
        if (!body.type || !body.itemId || !body.itemName || !body.customerName || !body.customerEmail) {
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

        let emailSent = false;

        if (body.type === "product") {
            // Send free product email
            emailSent = await sendFreeProductEmail(
                body.customerName,
                body.customerEmail,
                body.itemId,
                body.itemName
            );
        } else if (body.type === "course") {
            // Send course enrollment email
            emailSent = await sendCourseEnrollmentEmail(
                {
                    customerName: body.customerName,
                    customerEmail: body.customerEmail,
                    courseId: body.itemId,
                    courseName: body.itemName,
                },
                body.isPaid || false
            );
        }

        if (emailSent) {
            console.log(`[Enroll] Success: ${body.type} enrollment for ${body.customerEmail}`);
            return NextResponse.json({
                success: true,
                message: "Enrollment successful, email sent",
            });
        } else {
            console.warn(`[Enroll] Email failed for: ${body.customerEmail}`);
            // Still return success to user, but log the failure
            return NextResponse.json({
                success: true,
                message: "Enrollment successful",
                warning: "Email delivery may be delayed",
            });
        }
    } catch (error) {
        console.error("[Enroll] Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to process enrollment" },
            { status: 500 }
        );
    }
}
