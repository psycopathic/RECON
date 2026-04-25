import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const { searchProducts, products, loading } = useProductStore();

    useEffect(() => {
        if (query.trim()) {
            searchProducts(query.trim());
        }
    }, [query, searchProducts]);

    return (
        <div className="min-h-screen pt-20">
            <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20">
                            <Search size={28} className="text-sky-400" />
                        </div>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-gradient mb-3">
                        Search Results
                    </h1>
                    {query && (
                        <p className="text-lg text-slate-400">
                            Showing results for{" "}
                            <span className="font-semibold text-sky-400">"{query}"</span>
                        </p>
                    )}
                    <div className="w-16 h-1 bg-gradient-to-r from-sky-500 to-indigo-500 mx-auto mt-4 rounded-full" />
                </motion.div>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-3 border-slate-700 border-t-sky-500 rounded-full animate-spin" />
                    </div>
                )}

                {/* Results grid */}
                {!loading && (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {products?.length === 0 && (
                            <h2 className="text-2xl font-semibold text-slate-500 text-center col-span-full py-20">
                                No products found for "{query}"
                            </h2>
                        )}

                        {products?.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SearchResultsPage;
