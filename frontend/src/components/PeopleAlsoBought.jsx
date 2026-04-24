import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import React from "react";

const PeopleAlsoBought = () => {
	const [recommendations, setRecommendations] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchRecommendations = async () => {
			try {
				const res = await axios.get("/products/recommendations");
				setRecommendations(res.data);
			} catch (error) {
				toast.error(error.response?.data?.message || "An error occurred while fetching recommendations");
			} finally {
				setIsLoading(false);
			}
		};
		fetchRecommendations();
	}, []);

	if (isLoading) return (
		<div className="flex justify-center py-12">
			<div className="w-8 h-8 border-2 border-slate-700 border-t-sky-500 rounded-full animate-spin" />
		</div>
	);

	return (
		<div className="mt-10">
			<h3 className="text-xl font-bold text-white mb-1">People Also Bought</h3>
			<div className="w-10 h-0.5 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full mb-6" />
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{recommendations.map((product) => (
					<ProductCard key={product._id} product={product} />
				))}
			</div>
		</div>
	);
};

export default PeopleAlsoBought;