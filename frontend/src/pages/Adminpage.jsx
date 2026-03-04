import React, { useEffect, useState } from "react";
import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { motion } from "framer-motion";

import Analytics from "../components/Analytics";
import CreateProductForm from "../components/CreateProductForm";
import ProductList from "../components/ProductList";

import { useProductStore } from "../store/useProductStore";

const tabs = [
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "products", label: "Products", icon: ShoppingBasket },
  { id: "analytics", label: "Analytics", icon: BarChart },
];

const Adminpage = () => {
  const [activeTab, setActiveTab] = useState("create");
  const { fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return (
    <div className="min-h-screen pt-20">
      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.h1
          className="text-4xl font-black mb-10 text-gradient text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Admin Dashboard
        </motion.h1>

        {/* Tab Buttons */}
        <div className="flex justify-center mb-10 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                  ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-lg shadow-sky-500/20"
                  : "bg-slate-800/50 text-slate-400 border border-white/5 hover:border-white/15 hover:text-white"
                }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === "create" && <CreateProductForm />}
        {activeTab === "products" && <ProductList />}
        {activeTab === "analytics" && <Analytics />}
      </div>
    </div>
  );
};

export default Adminpage;
