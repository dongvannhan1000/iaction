import { groq } from "next-sanity";

// Get all products ordered by 'order' field
export const productsQuery = groq`
  *[_type == "product"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    icon,
    iconType,
    platforms,
    price,
    originalPrice,
    isPaid,
    featured,
    demoUrl,
    productUrl
  }
`;

// Get site settings
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    heroTitle,
    heroSubtitle,
    heroBadge,
    aboutTitle,
    aboutContent,
    aboutAvatar,
    aboutName,
    aboutRole,
    stats,
    skills,
    email,
    phone,
    socialLinks
  }
`;

// Get single product by slug
export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    description,
    icon,
    iconType,
    platforms,
    price,
    originalPrice,
    isPaid,
    featured,
    demoUrl,
    productUrl
  }
`;
