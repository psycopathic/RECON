import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../store/useUserStore";
import { useCartStore } from "../store/useCartStore";
import { Link } from "react-router-dom";
import React from "react";

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();

	const handleAddToCart = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (!user) {
			toast.error("Please login to add to cart", { id: "login" });
			return;
		} else {
			addToCart(product);
		}
	};

	return (
		<Link to={`/product/${product._id}`} className="block w-full">
			<div className="glass-card rounded-2xl overflow-hidden group transition-all duration-300 hover:border-sky-500/30 hover:shadow-lg hover:shadow-sky-500/10 flex flex-col">
				<div className="relative overflow-hidden flex-shrink-0">
					<img
						className="w-full h-56 object-cover transition-transform duration-500 ease-out group-hover:scale-110"
						src={product.image}
						alt={product.name}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
				</div>

				<div className="p-5 flex flex-col flex-1">
					<h5 className="text-base font-semibold text-white mb-1 group-hover:text-sky-300 transition-colors truncate" title={product.name}>
						{product.name}
					</h5>
					<div className="flex items-center gap-2 mb-3">
						<p className="text-xs text-slate-500 truncate">{product.category}</p>
						{product.createdBy?.name && (
							<>
								<span className="text-xs text-slate-600">·</span>
								<p className="text-xs text-sky-400/70 truncate">by {product.createdBy.name}</p>
							</>
						)}
					</div>
					<div className="mt-auto">
						<p className="text-gradient text-xl font-bold mb-3">
							₹{product.price.toLocaleString("en-IN")}
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
			</div>
		</Link>
	);
};

export default ProductCard;