import React from "react";
import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "../store/useCartStore";

const FeaturedProducts = ({ featuredProducts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else if (window.innerWidth < 1280) setItemsPerPage(3);
      else setItemsPerPage(4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => prev + itemsPerPage);
  const prevSlide = () => setCurrentIndex((prev) => prev - itemsPerPage);

  const isStartDisabled = currentIndex === 0;
  const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-black text-gradient mb-3">
            Featured
          </h2>
          <p className="text-slate-400">Hand-picked products just for you</p>
          <div className="w-16 h-1 bg-gradient-to-r from-sky-500 to-indigo-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
              }}
            >
              {featuredProducts?.map((product) => (
                <div
                  key={product._id}
                  className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2"
                >
                  <div className="glass-card rounded-2xl overflow-hidden h-full transition-all duration-300 hover:border-sky-500/30 hover:shadow-lg hover:shadow-sky-500/10 group">
                    <div className="overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-52 object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-semibold mb-2 text-white group-hover:text-sky-300 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gradient font-bold text-lg mb-4">
                        ₹{product.price.toFixed(2)}
                      </p>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            disabled={isStartDisabled}
            className={`absolute top-1/2 -left-3 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${isStartDisabled
                ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                : "bg-slate-800 text-white border border-white/10 hover:border-sky-500/30 hover:shadow-lg hover:shadow-sky-500/20"
              }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            disabled={isEndDisabled}
            className={`absolute top-1/2 -right-3 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${isEndDisabled
                ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                : "bg-slate-800 text-white border border-white/10 hover:border-sky-500/30 hover:shadow-lg hover:shadow-sky-500/20"
              }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
