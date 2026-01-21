import { groq } from "next-sanity";

// Get all products ordered by 'order' field
// NOTE: productUrl and usageGuide are NOT included for security reasons
// They should only be fetched by backend for email after payment
export const productsQuery = groq`
  *[_type == "product"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    icon,
    iconType,
    "categories": categories[]->{ _id, name, "slug": slug.current },
    price,
    originalPrice,
    isPaid,
    featured,
    demoUrl
  }
`;

// Get all product categories
export const productCategoriesQuery = groq`
  *[_type == "productCategory"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    description
  }
`;


// Get site settings
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    heroTitle,
    heroSubtitle,
    heroBadge,
    productsSubtitle,
    coursesSubtitle,
    blogSubtitle,
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
// NOTE: productUrl and usageGuide are NOT included for security reasons
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
    demoUrl
  }
`;

// Get all courses ordered by 'order' field
// NOTE: courseUrl is NOT included for security reasons
// It should only be fetched by backend for email after payment/enrollment
export const coursesQuery = groq`
  *[_type == "course"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    thumbnail,
    iconType,
    level,
    duration,
    lessonsCount,
    price,
    originalPrice,
    isPaid,
    featured
  }
`;

// Get all blog posts ordered by publishedAt
export const blogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    thumbnail,
    category,
    author,
    publishedAt,
    readTime,
    featured
  }
`;

// Get single blog post by slug (with full content)
export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    thumbnail,
    content,
    category,
    author,
    publishedAt,
    readTime,
    featured
  }
`;

// ==========================================
// BACKEND-ONLY QUERIES (for email service)
// WARNING: These contain sensitive data - NEVER use from frontend
// ==========================================

// Get product with sensitive data for email (backend only)
export const productWithSensitiveDataQuery = groq`
  *[_type == "product" && _id == $productId][0] {
    _id,
    name,
    productUrl,
    usageGuide
  }
`;

// Get course with sensitive data for email (backend only)
export const courseWithSensitiveDataQuery = groq`
  *[_type == "course" && _id == $courseId][0] {
    _id,
    title,
    courseUrl
  }
`;
