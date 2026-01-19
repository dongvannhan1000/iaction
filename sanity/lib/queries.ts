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

// Get all courses ordered by 'order' field
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
    featured,
    courseUrl
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

