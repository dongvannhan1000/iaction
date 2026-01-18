"use client";

import { handleScrollClick } from "@/lib/scroll";

export default function Hero() {
    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid"
        >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-radial-glow" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-500/5 rounded-full blur-3xl animate-float animate-delay-200" />

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in-up">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm text-gray-300">
                        Khám phá các sản phẩm mới nhất
                    </span>
                </div>

                {/* Main Heading */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in-up animate-delay-100">
                    <span className="text-white">From </span>
                    <span className="text-gradient">Idea</span>
                    <br />
                    <span className="text-white">to </span>
                    <span className="text-gradient text-glow-red">Action</span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in-up animate-delay-200">
                    Nơi tôi chia sẻ những ứng dụng và phần mềm được tạo ra với đam mê.
                    Mỗi sản phẩm là một hành trình từ ý tưởng đến hiện thực.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-300">
                    <a
                        href="#products"
                        onClick={(e) => handleScrollClick(e, "products")}
                        className="btn-primary px-8 py-4 rounded-full font-semibold text-lg inline-flex items-center gap-3 cursor-pointer"
                    >
                        Xem sản phẩm
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
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </a>
                    <a
                        href="#about"
                        onClick={(e) => handleScrollClick(e, "about")}
                        className="btn-outline px-8 py-4 rounded-full font-semibold text-lg inline-flex items-center gap-3 cursor-pointer"
                    >
                        Về tác giả
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
                    </a>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center p-2">
                        <div className="w-1.5 h-3 bg-red-500 rounded-full" />
                    </div>
                </div>
            </div>
        </section>
    );
}
