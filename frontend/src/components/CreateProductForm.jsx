import React, { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader, Plus, X } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import { categorySlugs } from "../constants/categories";

const PLATFORMS = [
  { value: "amazon", label: "Amazon" },
  { value: "flipkart", label: "Flipkart" },
  { value: "snapdeal", label: "Snapdeal" },
  { value: "meesho", label: "Meesho" },
];

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  const [priceComparisons, setPriceComparisons] = useState([]);

  const { createProduct, loading } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct({ ...newProduct, priceComparisons });
      setNewProduct({ name: "", description: "", price: "", category: "", image: "" });
      setPriceComparisons([]);
    } catch {
      console.log("error creating a product");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const addComparisonEntry = () => {
    setPriceComparisons([...priceComparisons, { platform: "", price: "", url: "" }]);
  };

  const removeComparisonEntry = (index) => {
    setPriceComparisons(priceComparisons.filter((_, i) => i !== index));
  };

  const updateComparisonEntry = (index, field, value) => {
    const updated = [...priceComparisons];
    updated[index] = { ...updated[index], [field]: value };
    setPriceComparisons(updated);
  };

  return (
    <motion.div
      className="glass-card rounded-2xl p-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl font-bold mb-6 text-white">Create New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="w-full py-2.5 px-4 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1.5">
            Description
          </label>
          <textarea
            id="description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            rows="3"
            className="w-full py-2.5 px-4 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-slate-300 mb-1.5">
            Price
          </label>
          <input
            type="number"
            id="price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            step="0.01"
            className="w-full py-2.5 px-4 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1.5">
            Category
          </label>
          <select
            id="category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            className="w-full py-2.5 px-4 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all"
            required
          >
            <option value="">Select a category</option>
            {categorySlugs.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            id="image"
            className="sr-only"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label
            htmlFor="image"
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-slate-300 hover:border-sky-500/30 hover:text-white transition-all"
          >
            <Upload className="h-4 w-4" />
            Upload Image
          </label>
          {newProduct.image && (
            <span className="text-xs text-emerald-400">✓ Image uploaded</span>
          )}
        </div>

        <div className="pt-4 border-t border-white/5">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-slate-300">
              Price Comparison Links
            </label>
            <button
              type="button"
              onClick={addComparisonEntry}
              className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors"
            >
              <Plus size={14} />
              Add Platform
            </button>
          </div>

          {priceComparisons.length === 0 && (
            <p className="text-xs text-slate-500">No comparison links added. Click "Add Platform" to add one.</p>
          )}

          <div className="space-y-3">
            {priceComparisons.map((entry, index) => (
              <div key={index} className="flex items-start gap-2">
                <select
                  value={entry.platform}
                  onChange={(e) => updateComparisonEntry(index, "platform", e.target.value)}
                  className="py-2 px-3 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500/50 transition-all w-32 flex-shrink-0"
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
                  onChange={(e) => updateComparisonEntry(index, "price", e.target.value)}
                  className="py-2 px-3 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 transition-all w-24 flex-shrink-0"
                />

                <input
                  type="url"
                  placeholder="Product URL"
                  value={entry.url}
                  onChange={(e) => updateComparisonEntry(index, "url", e.target.value)}
                  className="py-2 px-3 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 transition-all flex-1 min-w-0"
                />

                <button
                  type="button"
                  onClick={() => removeComparisonEntry(index)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-medium text-sm transition-all duration-300 shadow-lg shadow-sky-500/20 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <PlusCircle className="h-5 w-5" />
              Create Product
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
