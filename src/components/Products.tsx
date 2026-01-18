import Image from "next/image";
import Link from "next/link";

// Sample product data - will be replaced with Sanity data later
const products = [
    {
        id: 1,
        name: "TaskFlow Pro",
        description: "Ứng dụng quản lý công việc thông minh với AI hỗ trợ lập kế hoạch và theo dõi tiến độ.",
        icon: "/products/taskflow.svg",
        platforms: ["Web", "iOS", "Android"],
        demoUrl: "#",
        githubUrl: "#",
        featured: true,
    },
    {
        id: 2,
        name: "CodeSnap",
        description: "Tạo ảnh code đẹp mắt để chia sẻ lên mạng xã hội với nhiều theme và tùy chỉnh.",
        icon: "/products/codesnap.svg",
        platforms: ["Web"],
        demoUrl: "#",
        githubUrl: "#",
        featured: false,
    },
    {
        id: 3,
        name: "BudgetMaster",
        description: "Theo dõi chi tiêu cá nhân, lập ngân sách và phân tích tài chính một cách dễ dàng.",
        icon: "/products/budget.svg",
        platforms: ["iOS", "Android"],
        demoUrl: "#",
        githubUrl: "#",
        featured: false,
    },
    {
        id: 4,
        name: "DevNotes",
        description: "Ghi chú dành cho developer với syntax highlighting, markdown và đồng bộ đám mây.",
        icon: "/products/devnotes.svg",
        platforms: ["Web", "Desktop"],
        demoUrl: "#",
        githubUrl: "#",
        featured: true,
    },
];

function ProductCard({ product }: { product: typeof products[0] }) {
    return (
        <div
            className={`group relative rounded-2xl p-6 glass card-hover cursor-pointer ${product.featured ? "md:col-span-2 md:row-span-2" : ""
                }`}
        >
            {/* Featured Badge */}
            {product.featured && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30">
                    <span className="text-xs text-red-400 font-medium">Featured</span>
                </div>
            )}

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center mb-6 group-hover:glow-red-sm transition-all">
                {/* Placeholder icon - will use actual icons later */}
                <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                </svg>
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                {product.name}
            </h3>
            <p className="text-gray-400 mb-6 line-clamp-3">{product.description}</p>

            {/* Platforms */}
            <div className="flex flex-wrap gap-2 mb-6">
                {product.platforms.map((platform) => (
                    <span
                        key={platform}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10"
                    >
                        {platform}
                    </span>
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <Link
                    href={product.demoUrl}
                    className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                    <span>Xem demo</span>
                    <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                    </svg>
                </Link>
                <Link
                    href={product.githubUrl}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="GitHub"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
                        />
                    </svg>
                </Link>
            </div>
        </div>
    );
}

export default function Products() {
    return (
        <section id="products" className="py-24 relative">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-white">Sản phẩm </span>
                        <span className="text-gradient">nổi bật</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Những ứng dụng và phần mềm tôi đã xây dựng với tâm huyết
                    </p>
                </div>

                {/* Products Grid - Bento Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        href="/products"
                        className="btn-outline px-8 py-4 rounded-full font-semibold inline-flex items-center gap-3 cursor-pointer"
                    >
                        Xem tất cả sản phẩm
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
