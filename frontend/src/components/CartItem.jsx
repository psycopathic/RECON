import React from 'react'
import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from '../store/useCartStore';

const CartItem = ({ item }) => {
	const { removeFromCart, updateQuantity } = useCartStore();

	return (
		<div className="glass-card rounded-2xl p-5 md:p-6">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				{/* Image */}
				<div className="shrink-0">
					<img className="h-20 md:h-28 w-20 md:w-28 rounded-xl object-cover" src={item.image} alt={item.name} />
				</div>

				{/* Info */}
				<div className="flex-1 min-w-0">
					<p className="text-base font-semibold text-white mb-1">{item.name}</p>
					<p className="text-sm text-slate-400 line-clamp-1">{item.description}</p>
				</div>

				{/* Quantity */}
				<div className="flex items-center gap-3">
					<button
						className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 border border-white/10 hover:border-sky-500/30 text-slate-300 hover:text-white transition-all"
						onClick={() => updateQuantity(item._id, item.quantity - 1)}
					>
						<Minus size={14} />
					</button>
					<span className="text-white font-medium w-6 text-center">{item.quantity}</span>
					<button
						className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 border border-white/10 hover:border-sky-500/30 text-slate-300 hover:text-white transition-all"
						onClick={() => updateQuantity(item._id, item.quantity + 1)}
					>
						<Plus size={14} />
					</button>
				</div>

				{/* Price */}
				<div className="text-right">
					<p className="text-lg font-bold text-gradient">₹{item.price}</p>
				</div>

				{/* Delete */}
				<button
					className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
					onClick={() => removeFromCart(item._id)}
				>
					<Trash size={18} />
				</button>
			</div>
		</div>
	)
}

export default CartItem