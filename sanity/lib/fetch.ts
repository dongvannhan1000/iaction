import { client } from "./client";
import { productsQuery, siteSettingsQuery, productBySlugQuery } from "./queries";
import type { SanityProduct, SanitySiteSettings } from "./types";

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
