import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Courses from "@/components/Courses";
import Blog from "@/components/Blog";
import About from "@/components/About";
import Footer from "@/components/Footer";
import { getProducts, getSiteSettings, getCourses, getBlogPosts } from "../../sanity/lib/fetch";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  // Fetch data from Sanity (server-side)
  const [products, settings, courses, blogPosts] = await Promise.all([
    getProducts(),
    getSiteSettings(),
    getCourses(),
    getBlogPosts(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Products products={products} />
        <Courses courses={courses} />
        <Blog posts={blogPosts} />
        <About settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  );
}

