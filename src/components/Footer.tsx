"use client";

import Link from "next/link";

export default function Footer() {
    const socialLinks = [
        {
            name: "GitHub",
            href: "https://github.com",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
                    />
                </svg>
            ),
        },
        {
            name: "LinkedIn",
            href: "https://linkedin.com",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            ),
        },
        {
            name: "Twitter",
            href: "https://twitter.com",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
        },
        {
            name: "Email",
            href: "mailto:hello@iaction.dev",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                </svg>
            ),
        },
    ];

    // Handle scroll to section
    const scrollToContact = (e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById("contact");
        if (element) {
            const offsetTop = element.offsetTop - 100;
            window.scrollTo({ top: offsetTop, behavior: "smooth" });
        }
    };

    return (
        <footer id="contact" className="relative py-16 border-t border-white/5">
            {/* Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-red-600/10 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
                    {/* Left - CTA */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            <span className="text-white">Có ý tưởng? </span>
                            <span className="text-gradient">Hãy kết nối!</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-6">
                            Tôi luôn sẵn sàng lắng nghe những ý tưởng mới và cơ hội hợp tác thú vị.
                        </p>
                        <Link
                            href="mailto:hello@iaction.dev"
                            className="btn-primary px-8 py-4 rounded-full font-semibold inline-flex items-center gap-3 cursor-pointer"
                        >
                            Gửi email cho tôi
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

                    {/* Right - Social Links */}
                    <div className="flex justify-center md:justify-end gap-4">
                        {socialLinks.map((social) => (
                            <Link
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-all cursor-pointer"
                                aria-label={social.name}
                            >
                                {social.icon}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">I</span>
                        </div>
                        <span className="text-lg font-bold text-white">Action</span>
                    </div>

                    {/* Copyright - Use static year to avoid hydration mismatch */}
                    <p className="text-gray-500 text-sm">
                        © 2025 IAction. Tất cả quyền được bảo lưu.
                    </p>
                </div>
            </div>
        </footer>
    );
}
