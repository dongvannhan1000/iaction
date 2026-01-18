"use client";

import { useState, useEffect, useRef } from "react";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
}

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

export default function PaymentModal({ isOpen, onClose, product }: PaymentModalProps) {
    const [formData, setFormData] = useState({
        customerName: "",
        customerEmail: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const modalRef = useRef<HTMLDivElement>(null);
    const firstInputRef = useRef<HTMLInputElement>(null);

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

    // Click outside to close
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
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

        if (!validateForm() || !product) return;

        setIsSubmitting(true);
        setSubmitStatus("loading");

        try {
            // Mock API call - will be replaced with actual payment API
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Simulate success
            setSubmitStatus("success");

            // In real implementation, redirect to Sepay payment page
            // window.location.href = paymentUrl;
        } catch {
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Format price
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({ customerName: "", customerEmail: "" });
            setErrors({});
            setSubmitStatus("idle");
        }
    }, [isOpen]);

    if (!isOpen || !product) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                ref={modalRef}
                className="relative w-full max-w-md glass rounded-3xl p-8 animate-fade-in-up"
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

                {/* Success State */}
                {submitStatus === "success" ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Đang chuyển hướng...</h3>
                        <p className="text-gray-400 mb-6">
                            Bạn sẽ được chuyển đến trang thanh toán. Sau khi thanh toán thành công,
                            thông tin truy cập sẽ được gửi về email của bạn.
                        </p>
                        <div className="animate-pulse flex justify-center">
                            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="mb-6">
                            <h2 id="modal-title" className="text-2xl font-bold text-white mb-2">
                                Mua {product.name}
                            </h2>
                            <p className="text-gray-400 text-sm">
                                Điền thông tin để nhận quyền truy cập qua email
                            </p>
                        </div>

                        {/* Product Summary */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-300">{product.name}</span>
                                <div className="text-right">
                                    {product.originalPrice && (
                                        <span className="text-sm text-gray-500 line-through mr-2">
                                            {formatPrice(product.originalPrice)}
                                        </span>
                                    )}
                                    <span className="text-lg font-bold text-red-400">
                                        {formatPrice(product.price)}
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">
                                Thanh toán qua VietQR / Chuyển khoản ngân hàng
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

                            {/* Error Message */}
                            {submitStatus === "error" && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30" role="alert">
                                    <p className="text-sm text-red-400">
                                        Đã có lỗi xảy ra. Vui lòng thử lại sau.
                                    </p>
                                </div>
                            )}

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
                                        Thanh toán {formatPrice(product.price)}
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
                            Thanh toán an toàn qua Sepay
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
