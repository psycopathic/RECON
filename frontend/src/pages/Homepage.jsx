import React from "react";
import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../store/useProductStore";
import FeaturedProducts from "../components/FeaturedProduct";
import Slider from "../components/Slider";
import Footer from "../components/Footer";

const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
  { href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
  { href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
  { href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
  { href: "/watches", name: "Watches", imageUrl: "/watch.jpg" },
  { href: "/gadgets", name: "Gadgets", imageUrl: "/gadget.jpg" },
  { href: "/accessories", name: "Accessories", imageUrl: "/accesories.jpg" },
];

const Homepage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Slider />

      {/* Categories Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gradient mb-4">
            Explore Our Categories
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Discover the latest trends in eco-friendly fashion
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-sky-500 to-indigo-500 mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>

        {!isLoading && products.length > 0 && (
          <FeaturedProducts featuredProducts={products} />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Homepage;
