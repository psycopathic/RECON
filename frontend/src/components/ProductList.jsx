import React, { useEffect, useState } from "react";
import { Trash, Star, ExternalLink, ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import { motion, AnimatePresence } from "framer-motion";

const PLATFORMS = [
  { value: "amazon", label: "Amazon" },
  { value: "flipkart", label: "Flipkart" },
  { value: "snapdeal", label: "Snapdeal" },
  { value: "meesho", label: "Meesho" },
];

const PriceComparisonEditor = ({ product }) => {
  const { updatePriceComparisons } = useProductStore();
  const [isOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState(
    product.priceComparisons?.length > 0
      ? product.priceComparisons.map((e) => ({
          platform: e.platform,
          price: String(e.price),
          url: e.url,
        }))
      : []
  );

  const addEntry = () => {
    setEntries([...entries, { platform: "", price: "", url: "" }]);
  };

  const removeEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const updateEntry = (index, field, value) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    setEntries(updated);
  };

  const handleSave = async () => {
    const validEntries = entries.filter((e) => e.platform && e.price && e.url);
    await updatePriceComparisons(
      product._id,
      validEntries.map((e) => ({ ...e, price: Number(e.price) }))
    );
    setIsOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl text-sky-400 hover:bg-sky-500/10 transition-all flex items-center gap-1"
        title="Edit price comparison"
      >
        <ExternalLink className="h-4 w-4" />
        <span className="text-xs hidden sm:inline">Compare</span>
        {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute left-0 right-0 top-full mt-1 z-50 bg-slate-800 border border-white/10 rounded-xl p-4 shadow-xl"
            style={{ minWidth: "500px" }}
          >
            <h4 className="text-sm font-semibold text-white mb-3">Price Comparison Links</h4>

            <div className="space-y-2 mb-3">
              {entries.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={entry.platform}
                    onChange={(e) => updateEntry(index, "platform", e.target.value)}
                    className="py-1.5 px-2 bg-slate-900/60 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500/50 w-28 flex-shrink-0"
                  >
                    <option value="">Platform</option>
                    {PLATFORMS.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Price"
                    value={entry.price}
                    onChange={(e) => updateEntry(index, "price", e.target.value)}
                    className="py-1.5 px-2 bg-slate-900/60 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 w-24 flex-shrink-0"
                  />
                  <input
                    type="url"
                    placeholder="Product URL"
                    value={entry.url}
                    onChange={(e) => updateEntry(index, "url", e.target.value)}
                    className="py-1.5 px-2 bg-slate-900/60 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 flex-1 min-w-0"
                  />
                  <button
                    onClick={() => removeEntry(index)}
                    className="p-1 text-red-400 hover:text-red-300 flex-shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={addEntry}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
              >
                <Plus size={12} /> Add Platform
              </button>

              <div className="flex-1" />

              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 text-white hover:from-sky-500 hover:to-indigo-500 transition-all"
              >
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
      <div className="overflow-x-auto">
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
              <tr key={product._id} className="hover:bg-white/[0.02] transition-colors relative">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img className="h-10 w-10 rounded-xl object-cover" src={product.image} alt={product.name} />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-white">{product.name}</div>
                      {product.priceComparisons?.length > 0 && (
                        <div className="text-[10px] text-slate-500">
                          {product.priceComparisons.length} comparison link{product.priceComparisons.length > 1 ? "s" : ""}
                        </div>
                      )}
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
                  <div className="flex items-center gap-1 relative">
                    <PriceComparisonEditor product={product} />
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ProductList;
