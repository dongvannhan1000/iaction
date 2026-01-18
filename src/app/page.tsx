import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import About from "@/components/About";
import Footer from "@/components/Footer";
import { getProducts, getSiteSettings } from "../../sanity/lib/fetch";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  // Fetch data from Sanity (server-side)
  const [products, settings] = await Promise.all([
    getProducts(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Products products={products} />
        <About settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
