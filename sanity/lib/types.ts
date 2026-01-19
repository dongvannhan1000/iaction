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
    category: string;
    items: string;
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
    productsSubtitle?: string;
    coursesSubtitle?: string;
    blogSubtitle?: string;
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

export interface SanityCourse {
    _id: string;
    title: string;
    slug: string;
    description: string;
    thumbnail?: {
        _type: "image";
        asset: {
            _ref: string;
        };
    };
    iconType?: "academy" | "video" | "book" | "certificate" | "code" | "chart";
    level?: "beginner" | "intermediate" | "advanced";
    duration?: string;
    lessonsCount?: number;
    price: number;
    originalPrice?: number;
    isPaid: boolean;
    featured: boolean;
    courseUrl?: string;
}

export interface SanityBlogPost {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    thumbnail?: {
        _type: "image";
        asset: {
            _ref: string;
        };
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: any[]; // Portable Text blocks
    category?: "tech" | "business" | "lifestyle" | "tutorial";
    author?: string;
    publishedAt?: string;
    readTime?: number;
    featured: boolean;
}

