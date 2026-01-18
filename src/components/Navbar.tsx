"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { handleScrollClick } from "@/lib/scroll";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "home", label: "Trang chủ" },
        { href: "products", label: "Sản phẩm" },
        { href: "about", label: "Về tôi" },
        { href: "contact", label: "Liên hệ" },
    ];

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav
            className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 rounded-2xl ${isScrolled
                    ? "glass shadow-lg shadow-black/20"
                    : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center glow-red-sm group-hover:animate-pulse-glow transition-all">
                            <span className="text-white font-bold text-lg">I</span>
                        </div>
                        <span className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                            Action
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={`#${link.href}`}
                                onClick={(e) => handleScrollClick(e, link.href)}
                                className="text-gray-300 hover:text-white transition-colors relative group cursor-pointer"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all group-hover:w-full" />
                            </a>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:block">
                        <a
                            href="#contact"
                            onClick={(e) => handleScrollClick(e, "contact")}
                            className="btn-primary px-6 py-2.5 rounded-full font-medium text-sm inline-flex items-center gap-2 cursor-pointer"
                        >
                            Liên hệ ngay
                            <svg
                                className="w-4 h-4"
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

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white p-2 cursor-pointer"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4">
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={`#${link.href}`}
                                    onClick={(e) => handleScrollClick(e, link.href, 100, closeMobileMenu)}
                                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <a
                                href="#contact"
                                onClick={(e) => handleScrollClick(e, "contact", 100, closeMobileMenu)}
                                className="btn-primary px-6 py-2.5 rounded-full font-medium text-sm text-center mt-2 cursor-pointer"
                            >
                                Liên hệ ngay
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
