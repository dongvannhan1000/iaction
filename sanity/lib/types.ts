export interface SanityProduct {
    _id: string;
    name: string;
    slug: string;
    description: string;
    icon?: {
        _type: "image";
        asset: {
            _ref: string;
        };
    };
    iconType?: "cube" | "code" | "chart" | "document" | "video" | "server";
    platforms: string[];
    price: number;
    originalPrice?: number;
    isPaid: boolean;
    featured: boolean;
    demoUrl?: string;
    productUrl?: string;
}

export interface SanitySkill {
    name: string;
    level: number;
}

export interface SanityStat {
    value: string;
    label: string;
}

export interface SanitySocialLink {
    platform: "github" | "linkedin" | "twitter" | "facebook" | "youtube";
    url: string;
}

export interface SanitySiteSettings {
    siteName: string;
    heroTitle: string;
    heroSubtitle: string;
    heroBadge: string;
    aboutTitle: string;
    aboutContent: unknown[]; // Portable Text blocks
    aboutAvatar?: {
        _type: "image";
        asset: {
            _ref: string;
        };
    };
    aboutName: string;
    aboutRole: string;
    stats: SanityStat[];
    skills: SanitySkill[];
    email: string;
    phone?: string;
    socialLinks: SanitySocialLink[];
}
