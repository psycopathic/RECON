import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft, Loader } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import { useCartStore } from "../store/useCartStore";
import { useUserStore } from "../store/useUserStore";
import PriceComparison from "../components/PriceComparison";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import toast from "react-hot-toast";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { singleProduct, fetchSingleProduct, singleLoading } = useProductStore();
  const { addToCart } = useCartStore();
  const { user } = useUserStore();
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    fetchSingleProduct(id);
  }, [fetchSingleProduct, id]);

  useEffect(() => {
    setImgLoaded(false);
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add to cart", { id: "login" });
      return;
    }
    addToCart(singleProduct);
  };

  if (singleLoading && !singleProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    );
  }

  if (!singleLoading && !singleProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass-card rounded-2xl overflow-hidden">
              {!imgLoaded && (
                <div className="w-full h-96 bg-slate-800 animate-pulse" />
              )}
              <img
                src={singleProduct.image}
                alt={singleProduct.name}
                className={`w-full h-96 object-cover transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0 absolute"}`}
                onLoad={() => setImgLoaded(true)}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="text-xs px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase tracking-wider font-medium">
              {singleProduct.category}
            </span>

            <h1 className="text-3xl sm:text-4xl font-black text-white mt-4 mb-3">
              {singleProduct.name}
            </h1>

            <p className="text-slate-400 leading-relaxed mb-6">
              {singleProduct.description}
            </p>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-4xl font-black text-gradient">
                ₹{singleProduct.price.toLocaleString("en-IN")}
              </span>
              <span className="text-sm text-slate-500">incl. all taxes</span>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 mb-8"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
          </motion.div>
        </div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <PriceComparison
            productId={singleProduct._id}
            ourPrice={singleProduct.price}
            productName={singleProduct.name}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <PeopleAlsoBought />
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
