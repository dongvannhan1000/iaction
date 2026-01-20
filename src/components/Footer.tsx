"use client";

import Link from "next/link";
import type { SanitySiteSettings, SanitySocialLink } from "../../sanity/lib/types";

interface FooterProps {
    settings: SanitySiteSettings | null;
}

// Social icons mapping
const SocialIcons: Record<string, React.ReactNode> = {
    github: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
            />
        </svg>
    ),
    linkedin: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    ),
    twitter: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
    facebook: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    ),
    youtube: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    ),
    email: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
        </svg>
    ),
};

// Default social links
const defaultSocialLinks: SanitySocialLink[] = [
    { platform: "github", url: "https://github.com" },
    { platform: "linkedin", url: "https://linkedin.com" },
    { platform: "twitter", url: "https://twitter.com" },
];

export default function Footer({ settings }: FooterProps) {
    const email = settings?.email || "hello@iaction.dev";
    const socialLinks = settings?.socialLinks?.length ? settings.socialLinks : defaultSocialLinks;
    const siteName = settings?.siteName || "IAction";

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
                            href={`mailto:${email}`}
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

                    {/* Right - Social Links & Contact Info */}
                    <div className="flex flex-col items-center md:items-end gap-4">
                        {/* Social Icons */}
                        <div className="flex gap-4">
                            {socialLinks.map((social, index) => (
                                <Link
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-all cursor-pointer"
                                    aria-label={social.platform}
                                >
                                    {SocialIcons[social.platform] || SocialIcons.email}
                                </Link>
                            ))}
                        </div>

                        {/* Email & Phone */}
                        <div className="flex flex-col sm:flex-row gap-4 text-gray-400">
                            <Link
                                href={`mailto:${email}`}
                                className="flex items-center gap-2 hover:text-red-400 transition-colors"
                            >
                                {SocialIcons.email}
                                <span className="text-sm">{email}</span>
                            </Link>
                            {settings?.phone && (
                                <Link
                                    href={`tel:${settings.phone}`}
                                    className="flex items-center gap-2 hover:text-red-400 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="text-sm">{settings.phone}</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
                    {/* Logo */}
                    <div className="flex items-center gap-1 mb-4 md:mb-0">
                        <img
                            src="/brand/icon-v2.png"
                            alt="IAction Icon"
                            className="h-8 w-auto object-contain drop-shadow-lg"
                        />
                        <img
                            src="/brand/text-v2.png"
                            alt="IAction"
                            className="h-5 w-auto object-contain"
                        />
                    </div>

                    {/* Copyright */}
                    <p className="text-gray-500 text-sm">
                        © 2026 {siteName}.
                    </p>
                </div>
            </div>
        </footer>
    );
}
