"use client";

import { useState } from "react";
import Link from "next/link";
import PaymentModal from "./PaymentModal";
import type { SanityProduct } from "../../sanity/lib/types";

// Icon components
const Icons = {
    cube: (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    ),
    code: (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
    ),
    chart: (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    document: (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    video: (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    ),
    server: (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
    ),
};

interface ProductCardProps {
    product: SanityProduct;
    onBuyClick: (product: SanityProduct) => void;
}

function ProductCard({ product, onBuyClick }: ProductCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    return (
        <div
            className={`group relative rounded-2xl p-6 glass card-hover cursor-pointer ${product.featured ? "md:col-span-2" : ""
                }`}
        >
            {product.featured && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30">
                    <span className="text-xs text-red-400 font-medium">Featured</span>
                </div>
            )}

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center mb-6 group-hover:glow-red-sm transition-all">
                {Icons[product.iconType as keyof typeof Icons] || Icons.cube}
            </div>

            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                {product.name}
            </h3>
            <p className="text-gray-400 mb-4 line-clamp-2">{product.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
                {product.platforms?.map((platform) => (
                    <span
                        key={platform}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10"
                    >
                        {platform}
                    </span>
                ))}
            </div>

            <div className="mb-4">
                {product.isPaid ? (
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-red-400">
                            {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                                {formatPrice(product.originalPrice)}
                            </span>
                        )}
                    </div>
                ) : (
                    <span className="text-2xl font-bold text-green-400">Miễn phí</span>
                )}
            </div>

            <div className="flex items-center gap-3">
                {product.isPaid ? (
                    <button
                        onClick={() => onBuyClick(product)}
                        className="flex-1 btn-primary py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                        Mua ngay
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </button>
                ) : (
                    <Link
                        href={product.productUrl || "#"}
                        className="flex-1 btn-primary py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                        Dùng ngay
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </Link>
                )}
                {product.demoUrl && (
                    <Link
                        href={product.demoUrl}
                        className="px-4 py-3 rounded-xl btn-outline font-medium text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                        Demo
                    </Link>
                )}
            </div>
        </div>
    );
}

interface ProductsProps {
    products: SanityProduct[];
}

const INITIAL_PRODUCTS_COUNT = 4;

export default function Products({ products }: ProductsProps) {
    const [selectedProduct, setSelectedProduct] = useState<SanityProduct | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const handleBuyClick = (product: SanityProduct) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const displayedProducts = showAll
        ? products
        : products.slice(0, INITIAL_PRODUCTS_COUNT);

    const hasMoreProducts = products.length > INITIAL_PRODUCTS_COUNT;
    const remainingCount = products.length - INITIAL_PRODUCTS_COUNT;

    // If no products from Sanity, show empty state
    if (!products || products.length === 0) {
        return (
            <section id="products" className="py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-transparent" />
                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="text-white">Sản phẩm </span>
                            <span className="text-gradient">nổi bật</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Những ứng dụng và phần mềm tôi đã xây dựng với tâm huyết
                        </p>
                    </div>
                    <div className="text-center py-12">
                        <p className="text-gray-500">Chưa có sản phẩm nào. Thêm sản phẩm trong <a href="/studio" className="text-red-400 hover:underline">Sanity Studio</a>.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section id="products" className="py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-transparent" />

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="text-white">Sản phẩm </span>
                            <span className="text-gradient">nổi bật</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Những ứng dụng và phần mềm tôi đã xây dựng với tâm huyết
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedProducts.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onBuyClick={handleBuyClick}
                            />
                        ))}
                    </div>

                    {hasMoreProducts && (
                        <div className="text-center mt-12">
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="btn-outline px-8 py-4 rounded-full font-semibold inline-flex items-center gap-3 cursor-pointer"
                            >
                                {showAll ? (
                                    <>
                                        Thu gọn
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                    </>
                                ) : (
                                    <>
                                        Xem thêm {remainingCount} sản phẩm
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <PaymentModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                product={selectedProduct ? {
                    id: parseInt(selectedProduct._id.replace(/\D/g, '')) || 1,
                    name: selectedProduct.name,
                    description: selectedProduct.description,
                    price: selectedProduct.price,
                    originalPrice: selectedProduct.originalPrice,
                } : null}
            />
        </>
    );
}
