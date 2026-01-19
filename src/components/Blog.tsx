"use client";

import { useState } from "react";
import Link from "next/link";
import type { SanityBlogPost } from "../../sanity/lib/types";
import { urlFor } from "../../sanity/lib/client";

const categoryLabels: Record<string, { text: string; color: string }> = {
    tech: { text: "Technology", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    business: { text: "Business", color: "bg-green-500/20 text-green-400 border-green-500/30" },
    lifestyle: { text: "Lifestyle", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    tutorial: { text: "Tutorial", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
};

interface BlogCardProps {
    post: SanityBlogPost;
}

function BlogCard({ post }: BlogCardProps) {
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
        <Link
            href={`/blog/${post.slug}`}
            className={`group relative rounded-2xl overflow-hidden glass card-hover cursor-pointer block ${post.featured ? "md:col-span-2" : ""
                }`}
        >
            {post.featured && (
                <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30">
                    <span className="text-xs text-red-400 font-medium">Featured</span>
                </div>
            )}

            {/* Thumbnail */}
            {post.thumbnail ? (
                <div className="w-full h-48 overflow-hidden">
                    <img
                        src={urlFor(post.thumbnail).width(600).height(300).url()}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            ) : (
                <div className="w-full h-48 bg-gradient-to-br from-red-500/10 to-red-600/5 flex items-center justify-center">
                    <svg className="w-16 h-16 text-red-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                </div>
            )}

            <div className="p-6">
                {/* Category badge */}
                <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryInfo.color}`}>
                        {categoryInfo.text}
                    </span>
                    {post.readTime && (
                        <span className="text-xs text-gray-500">{post.readTime} phút đọc</span>
                    )}
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors line-clamp-2">
                    {post.title}
                </h3>
                <p className="text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>

                {/* Meta info */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{post.author || "Anonymous"}</span>
                    <span>{formatDate(post.publishedAt)}</span>
                </div>
            </div>
        </Link>
    );
}

interface BlogProps {
    posts: SanityBlogPost[];
}

const INITIAL_POSTS_COUNT = 4;

export default function Blog({ posts }: BlogProps) {
    const [showAll, setShowAll] = useState(false);

    const displayedPosts = showAll
        ? posts
        : posts.slice(0, INITIAL_POSTS_COUNT);

    const hasMorePosts = posts.length > INITIAL_POSTS_COUNT;
    const remainingCount = posts.length - INITIAL_POSTS_COUNT;

    // If no posts from Sanity, show empty state
    if (!posts || posts.length === 0) {
        return (
            <section id="blog" className="py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/5 to-transparent" />
                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="text-white">Bài viết </span>
                            <span className="text-gradient">mới nhất</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Chia sẻ kiến thức và kinh nghiệm về công nghệ
                        </p>
                    </div>
                    <div className="text-center py-12">
                        <p className="text-gray-500">Chưa có bài viết nào. Thêm bài viết trong <a href="/studio" className="text-red-400 hover:underline">Sanity Studio</a>.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="blog" className="py-24 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/5 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-white">Bài viết </span>
                        <span className="text-gradient">mới nhất</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Chia sẻ kiến thức và kinh nghiệm về công nghệ
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedPosts.map((post) => (
                        <BlogCard
                            key={post._id}
                            post={post}
                        />
                    ))}
                </div>

                {hasMorePosts && (
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
                                    Xem thêm {remainingCount} bài viết
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
    );
}
