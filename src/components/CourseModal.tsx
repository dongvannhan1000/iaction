"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { SepayPaymentInfo } from "@/lib/sepay/config";
import type { SanityCourse } from "../../sanity/lib/types";

interface CourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    course: SanityCourse | null;
}

type ModalState = "form" | "qr" | "success" | "error" | "expired";

export default function CourseModal({ isOpen, onClose, course }: CourseModalProps) {
    const [formData, setFormData] = useState({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalState, setModalState] = useState<ModalState>("form");
    const [paymentInfo, setPaymentInfo] = useState<SepayPaymentInfo | null>(null);
    const [countdown, setCountdown] = useState(600);
    const [copied, setCopied] = useState<string | null>(null);

    const modalRef = useRef<HTMLDivElement>(null);
    const firstInputRef = useRef<HTMLInputElement>(null);
    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    // Focus trap and escape key
    useEffect(() => {
        if (isOpen) {
            firstInputRef.current?.focus();
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    // Countdown timer for paid courses
    useEffect(() => {
        if (modalState !== "qr" || countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    setModalState("expired");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [modalState, countdown]);

    // Poll payment status for paid courses
    useEffect(() => {
        if (modalState !== "qr" || !paymentInfo?.orderId) return;

        const pollStatus = async () => {
            try {
                const res = await fetch(`/api/payment/status/${paymentInfo.orderId}`);
                const data = await res.json();

                if (data.success && data.data.status === "paid") {
                    setModalState("success");
                    if (pollingRef.current) clearInterval(pollingRef.current);
                }
            } catch (error) {
                console.error("Polling error:", error);
            }
        };

        pollingRef.current = setInterval(pollStatus, 3000);
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [modalState, paymentInfo?.orderId]);

    // Click outside to close
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && modalState === "form") {
            onClose();
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.customerName.trim()) {
            newErrors.customerName = "Vui lòng nhập họ tên";
        }

        if (!formData.customerEmail.trim()) {
            newErrors.customerEmail = "Vui lòng nhập email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
            newErrors.customerEmail = "Email không hợp lệ";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !course) return;

        setIsSubmitting(true);

        try {
            // If free course, call enroll API
            if (!course.isPaid || course.price === 0) {
                const res = await fetch("/api/enroll", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: "course",
                        itemId: course._id,
                        itemName: course.title,
                        customerName: formData.customerName,
                        customerEmail: formData.customerEmail,
                        customerPhone: formData.customerPhone || undefined,
                        isPaid: false,
                    }),
                });

                const data = await res.json();
                if (data.success) {
                    setModalState("success");
                } else {
                    setModalState("error");
                }
            } else {
                // Paid course - create payment
                const res = await fetch("/api/payment/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        productId: course._id,
                        productName: course.title,
                        amount: course.price,
                        customerEmail: formData.customerEmail,
                        customerName: formData.customerName,
                        customerPhone: formData.customerPhone || undefined,
                    }),
                });

                const data = await res.json();

                if (data.success) {
                    setPaymentInfo(data.data);
                    setCountdown(600);
                    setModalState("qr");
                } else {
                    setModalState("error");
                }
            }
        } catch (error) {
            console.error("Submit error:", error);
            setModalState("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Copy to clipboard
    const handleCopy = useCallback((text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(null), 2000);
    }, []);

    // Format price
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    // Format countdown
    const formatCountdown = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({ customerName: "", customerEmail: "", customerPhone: "" });
            setErrors({});
            setModalState("form");
            setPaymentInfo(null);
            setCountdown(600);
            if (pollingRef.current) clearInterval(pollingRef.current);
        }
    }, [isOpen]);

    if (!isOpen || !course) return null;

    const isFree = !course.isPaid || course.price === 0;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                ref={modalRef}
                className="relative w-full max-w-md glass rounded-3xl p-8 animate-fade-in-up my-8"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Đóng"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* SUCCESS STATE */}
                {modalState === "success" && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Đăng ký thành công!</h3>
                        <p className="text-gray-400 mb-6">
                            {isFree
                                ? "Bạn đã đăng ký khóa học thành công. Thông tin truy cập sẽ được gửi về email của bạn."
                                : "Cảm ơn bạn đã thanh toán. Thông tin truy cập khóa học sẽ được gửi về email của bạn trong ít phút."
                            }
                        </p>
                        <button
                            onClick={onClose}
                            className="btn-primary px-8 py-3 rounded-xl font-semibold cursor-pointer"
                        >
                            Đóng
                        </button>
                    </div>
                )}

                {/* EXPIRED STATE */}
                {modalState === "expired" && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Đã hết thời gian</h3>
                        <p className="text-gray-400 mb-6">
                            Phiên thanh toán đã hết hạn. Vui lòng thử lại.
                        </p>
                        <button
                            onClick={() => setModalState("form")}
                            className="btn-primary px-8 py-3 rounded-xl font-semibold cursor-pointer"
                        >
                            Thử lại
                        </button>
                    </div>
                )}

                {/* ERROR STATE */}
                {modalState === "error" && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Đã có lỗi xảy ra</h3>
                        <p className="text-gray-400 mb-6">
                            Không thể xử lý yêu cầu. Vui lòng thử lại sau.
                        </p>
                        <button
                            onClick={() => setModalState("form")}
                            className="btn-primary px-8 py-3 rounded-xl font-semibold cursor-pointer"
                        >
                            Thử lại
                        </button>
                    </div>
                )}

                {/* QR CODE STATE - Only for paid courses */}
                {modalState === "qr" && paymentInfo && (
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-white mb-4">Quét mã QR để thanh toán</h2>

                        {/* Countdown */}
                        <div className="mb-4">
                            <span className="text-gray-400">Còn lại: </span>
                            <span className={`font-mono font-bold ${countdown < 60 ? "text-red-400" : "text-green-400"}`}>
                                {formatCountdown(countdown)}
                            </span>
                        </div>

                        {/* QR Code */}
                        <div className="bg-white p-4 rounded-2xl inline-block mb-6">
                            <img
                                src={paymentInfo.qrCodeUrl}
                                alt="QR Code"
                                className="w-48 h-48 mx-auto"
                            />
                        </div>

                        {/* Bank Info */}
                        <div className="space-y-3 text-left">
                            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                <div>
                                    <p className="text-xs text-gray-500">Ngân hàng</p>
                                    <p className="text-white font-medium">{paymentInfo.bankName}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                <div>
                                    <p className="text-xs text-gray-500">Số tài khoản</p>
                                    <p className="text-white font-medium">{paymentInfo.bankAccount}</p>
                                </div>
                                <button
                                    onClick={() => handleCopy(paymentInfo.bankAccount, "account")}
                                    className="text-red-400 hover:text-red-300 text-sm cursor-pointer"
                                >
                                    {copied === "account" ? "Đã copy!" : "Copy"}
                                </button>
                            </div>

                            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                <div>
                                    <p className="text-xs text-gray-500">Chủ tài khoản</p>
                                    <p className="text-white font-medium">{paymentInfo.accountHolder}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                <div>
                                    <p className="text-xs text-gray-500">Số tiền</p>
                                    <p className="text-red-400 font-bold text-lg">{formatPrice(paymentInfo.amount)}</p>
                                </div>
                                <button
                                    onClick={() => handleCopy(paymentInfo.amount.toString(), "amount")}
                                    className="text-red-400 hover:text-red-300 text-sm cursor-pointer"
                                >
                                    {copied === "amount" ? "Đã copy!" : "Copy"}
                                </button>
                            </div>

                            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                <div>
                                    <p className="text-xs text-gray-500">Nội dung</p>
                                    <p className="text-white font-medium font-mono">{paymentInfo.content}</p>
                                </div>
                                <button
                                    onClick={() => handleCopy(paymentInfo.content, "content")}
                                    className="text-red-400 hover:text-red-300 text-sm cursor-pointer"
                                >
                                    {copied === "content" ? "Đã copy!" : "Copy"}
                                </button>
                            </div>
                        </div>

                        <p className="mt-6 text-xs text-gray-500">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                            Đang chờ thanh toán...
                        </p>
                    </div>
                )}

                {/* FORM STATE */}
                {modalState === "form" && (
                    <>
                        {/* Header */}
                        <div className="mb-6">
                            <h2 id="modal-title" className="text-2xl font-bold text-white mb-2">
                                {isFree ? "Đăng ký khóa học" : "Mua khóa học"}
                            </h2>
                            <p className="text-gray-400 text-sm">
                                {isFree
                                    ? "Điền thông tin để nhận quyền truy cập miễn phí"
                                    : "Điền thông tin để nhận quyền truy cập qua email"
                                }
                            </p>
                        </div>

                        {/* Course Summary */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-300">{course.title}</span>
                                <div className="text-right">
                                    {isFree ? (
                                        <span className="text-lg font-bold text-green-400">Miễn phí</span>
                                    ) : (
                                        <>
                                            {course.originalPrice && (
                                                <span className="text-sm text-gray-500 line-through mr-2">
                                                    {formatPrice(course.originalPrice)}
                                                </span>
                                            )}
                                            <span className="text-lg font-bold text-red-400">
                                                {formatPrice(course.price)}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">
                                {isFree
                                    ? "Đăng ký để nhận quyền truy cập ngay"
                                    : "Thanh toán qua VietQR / Chuyển khoản ngân hàng"
                                }
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name Input */}
                            <div>
                                <label htmlFor="customerName" className="block text-sm font-medium text-gray-300 mb-2">
                                    Họ và tên <span className="text-red-500">*</span>
                                </label>
                                <input
                                    ref={firstInputRef}
                                    type="text"
                                    id="customerName"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.customerName ? "border-red-500" : "border-white/10"
                                        } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors`}
                                    placeholder="Nguyễn Văn A"
                                    disabled={isSubmitting}
                                />
                                {errors.customerName && (
                                    <p className="mt-1 text-sm text-red-400" role="alert">
                                        {errors.customerName}
                                    </p>
                                )}
                            </div>

                            {/* Email Input */}
                            <div>
                                <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-300 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="customerEmail"
                                    name="customerEmail"
                                    value={formData.customerEmail}
                                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.customerEmail ? "border-red-500" : "border-white/10"
                                        } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors`}
                                    placeholder="email@example.com"
                                    disabled={isSubmitting}
                                />
                                {errors.customerEmail && (
                                    <p className="mt-1 text-sm text-red-400" role="alert">
                                        {errors.customerEmail}
                                    </p>
                                )}
                            </div>

                            {/* Phone Input (Optional) */}
                            <div>
                                <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-300 mb-2">
                                    Số điện thoại <span className="text-gray-500">(tùy chọn)</span>
                                </label>
                                <input
                                    type="tel"
                                    id="customerPhone"
                                    name="customerPhone"
                                    value={formData.customerPhone}
                                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                                    placeholder="0912345678"
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full btn-primary py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        {isFree ? "Đăng ký ngay" : `Thanh toán ${formatPrice(course.price)}`}
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Security Note */}
                        <p className="mt-4 text-center text-xs text-gray-500">
                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            {isFree ? "Thông tin của bạn được bảo mật" : "Thanh toán an toàn qua Sepay"}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
