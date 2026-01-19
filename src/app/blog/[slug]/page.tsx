import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { getBlogPostBySlug, getBlogPosts } from "../../../../sanity/lib/fetch";
import { urlFor } from "../../../../sanity/lib/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSiteSettings } from "../../../../sanity/lib/fetch";

export const revalidate = 60;

// Generate static params for all blog posts
export async function generateStaticParams() {
    const posts = await getBlogPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

const categoryLabels: Record<string, { text: string; color: string }> = {
    tech: { text: "Technology", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    business: { text: "Business", color: "bg-green-500/20 text-green-400 border-green-500/30" },
    lifestyle: { text: "Lifestyle", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    tutorial: { text: "Tutorial", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
};

// Custom components for Portable Text rendering
const portableTextComponents = {
    types: {
        image: ({ value }: { value: { asset: { _ref: string }; caption?: string; alt?: string } }) => (
            <figure className="my-8">
                <img
                    src={urlFor(value).width(800).url()}
                    alt={value.alt || "Blog image"}
                    className="rounded-xl w-full"
                />
                {value.caption && (
                    <figcaption className="text-center text-gray-500 mt-2 text-sm">
                        {value.caption}
                    </figcaption>
                )}
            </figure>
        ),
        code: ({ value }: { value: { code: string; language?: string } }) => (
            <pre className="my-6 p-4 rounded-xl bg-gray-900/80 overflow-x-auto">
                <code className={`language-${value.language || "javascript"} text-sm`}>
                    {value.code}
                </code>
            </pre>
        ),
    },
    block: {
        h2: ({ children }: { children?: React.ReactNode }) => (
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">{children}</h2>
        ),
        h3: ({ children }: { children?: React.ReactNode }) => (
            <h3 className="text-xl font-bold text-white mt-6 mb-3">{children}</h3>
        ),
        h4: ({ children }: { children?: React.ReactNode }) => (
            <h4 className="text-lg font-bold text-white mt-4 mb-2">{children}</h4>
        ),
        blockquote: ({ children }: { children?: React.ReactNode }) => (
            <blockquote className="border-l-4 border-red-500 pl-4 my-6 italic text-gray-400">
                {children}
            </blockquote>
        ),
        normal: ({ children }: { children?: React.ReactNode }) => (
            <p className="text-gray-300 leading-relaxed mb-4">{children}</p>
        ),
    },
    marks: {
        link: ({ children, value }: { children?: React.ReactNode; value?: { href: string } }) => (
            <a
                href={value?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:text-red-300 underline"
            >
                {children}
            </a>
        ),
        code: ({ children }: { children?: React.ReactNode }) => (
            <code className="bg-gray-800 px-2 py-1 rounded text-red-400 text-sm">
                {children}
            </code>
        ),
    },
};

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const [post, settings] = await Promise.all([
        getBlogPostBySlug(slug),
        getSiteSettings(),
    ]);

    if (!post) {
        notFound();
    }

    const categoryInfo = categoryLabels[post.category || "tech"];

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16">
                <article className="max-w-4xl mx-auto px-6">
                    {/* Back link */}
                    <Link
                        href="/#blog"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Quay lại Blog
                    </Link>

                    {/* Header */}
                    <header className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryInfo.color}`}>
                                {categoryInfo.text}
                            </span>
                            {post.readTime && (
                                <span className="text-sm text-gray-500">{post.readTime} phút đọc</span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                            {post.title}
                        </h1>

                        <p className="text-xl text-gray-400 mb-6">{post.excerpt}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-500 pb-8 border-b border-white/10">
                            <span>Bởi {post.author || "Anonymous"}</span>
                            <span>•</span>
                            <span>{formatDate(post.publishedAt)}</span>
                        </div>
                    </header>

                    {/* Featured Image */}
                    {post.thumbnail && (
                        <div className="mb-8 rounded-2xl overflow-hidden">
                            <img
                                src={urlFor(post.thumbnail).width(1200).height(600).url()}
                                alt={post.title}
                                className="w-full h-auto"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-invert max-w-none">
                        {post.content && (
                            <PortableText
                                value={post.content}
                                components={portableTextComponents}
                            />
                        )}
                    </div>

                    {/* Back to blog */}
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <Link
                            href="/#blog"
                            className="btn-outline px-6 py-3 rounded-full font-medium inline-flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Xem thêm bài viết
                        </Link>
                    </div>
                </article>
            </main>
            <Footer settings={settings} />
        </>
    );
}
