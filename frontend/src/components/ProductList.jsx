import React, { useEffect } from "react";
import { Trash, Star } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import { motion } from "framer-motion";

const ProductList = () => {
  const { deleteProduct, toggleFeaturedProduct, products, fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return (
    <motion.div
      className="glass-card rounded-2xl overflow-hidden max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <table className="min-w-full divide-y divide-white/5">
        <thead className="bg-slate-800/50">
          <tr>
            {["Product", "Price", "Category", "Featured", "Actions"].map((header) => (
              <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-white/5">
          {products?.map((product) => (
            <tr key={product._id} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img className="h-10 w-10 rounded-xl object-cover" src={product.image} alt={product.name} />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-white">{product.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-300">₹{product.price.toFixed(2)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-white/5">
                  {product.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => toggleFeaturedProduct(product._id)}
                  className={`p-2 rounded-xl transition-all duration-300 ${product.isFeatured
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/20"
                      : "bg-slate-800/50 text-slate-500 border border-white/5 hover:text-amber-400"
                    }`}
                  aria-label="Toggle featured"
                >
                  <Star className="h-4 w-4" fill={product.isFeatured ? "currentColor" : "none"} strokeWidth={2} />
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ProductList;
