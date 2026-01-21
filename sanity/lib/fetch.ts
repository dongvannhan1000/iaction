import { client } from "./client";
import { productsQuery, siteSettingsQuery, productBySlugQuery, coursesQuery, blogPostsQuery, blogPostBySlugQuery, productCategoriesQuery } from "./queries";
import type { SanityProduct, SanitySiteSettings, SanityCourse, SanityBlogPost, SanityProductCategory } from "./types";

/**
 * Fetch all products from Sanity
 */
export async function getProducts(): Promise<SanityProduct[]> {
    try {
        const products = await client.fetch<SanityProduct[]>(productsQuery);
        return products || [];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

/**
 * Fetch all product categories from Sanity
 */
export async function getProductCategories(): Promise<SanityProductCategory[]> {
    try {
        const categories = await client.fetch<SanityProductCategory[]>(productCategoriesQuery);
        return categories || [];
    } catch (error) {
        console.error("Error fetching product categories:", error);
        return [];
    }
}

/**
 * Fetch site settings from Sanity
 */
export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
    try {
        const settings = await client.fetch<SanitySiteSettings>(siteSettingsQuery);
        return settings;
    } catch (error) {
        console.error("Error fetching site settings:", error);
        return null;
    }
}

/**
 * Fetch single product by slug
 */
export async function getProductBySlug(slug: string): Promise<SanityProduct | null> {
    try {
        const product = await client.fetch<SanityProduct>(productBySlugQuery, { slug });
        return product;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

/**
 * Fetch all courses from Sanity
 */
export async function getCourses(): Promise<SanityCourse[]> {
    try {
        const courses = await client.fetch<SanityCourse[]>(coursesQuery);
        return courses || [];
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
}

/**
 * Fetch all blog posts from Sanity
 */
export async function getBlogPosts(): Promise<SanityBlogPost[]> {
    try {
        const posts = await client.fetch<SanityBlogPost[]>(blogPostsQuery);
        return posts || [];
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return [];
    }
}

/**
 * Fetch single blog post by slug (with full content)
 */
export async function getBlogPostBySlug(slug: string): Promise<SanityBlogPost | null> {
    try {
        const post = await client.fetch<SanityBlogPost>(blogPostBySlugQuery, { slug });
        return post;
    } catch (error) {
        console.error("Error fetching blog post:", error);
        return null;
    }
}

