import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../store/useUserStore";
import { useCartStore } from "../store/useCartStore";
import React from "react";

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();

	const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add to cart", { id: "login" });
			return;
		} else {
			addToCart(product);
		}
	};

	return (
		<div className="glass-card rounded-2xl overflow-hidden group transition-all duration-300 hover:border-sky-500/30 hover:shadow-lg hover:shadow-sky-500/10 w-full">
			<div className="relative overflow-hidden">
				<img
					className="w-full h-60 object-cover transition-transform duration-500 ease-out group-hover:scale-110"
					src={product.image}
					alt={product.name}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
			</div>

			<div className="p-5">
				<h5 className="text-lg font-semibold text-white mb-2 group-hover:text-sky-300 transition-colors">
					{product.name}
				</h5>
				<p className="text-gradient text-2xl font-bold mb-4">
					₹{product.price}
				</p>
				<button
					className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30"
					onClick={handleAddToCart}
				>
					<ShoppingCart size={18} />
					Add to Cart
				</button>
			</div>
		</div>
	);
};

export default ProductCard;