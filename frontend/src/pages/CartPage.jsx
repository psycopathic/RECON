import { Link } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import CartItem from "../components/CartItem";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import OrderSummary from "../components/OrderSummary";
import GiftCouponCard from "../components/GiftCouponCard";
import React from "react";

const CartPage = () => {
	const { cart } = useCartStore();

	return (
		<div className="min-h-screen pt-20 pb-16">
			<div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
				{/* Page Header */}
				<motion.div
					className="text-center mb-10 mt-8"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<h1 className="text-3xl sm:text-4xl font-black text-gradient mb-2">Your Cart</h1>
					<p className="text-slate-400 text-sm">
						{cart.length > 0
							? `You have ${cart.length} item${cart.length > 1 ? "s" : ""} in your cart`
							: "Your cart is empty"}
					</p>
					<div className="w-12 h-1 bg-gradient-to-r from-sky-500 to-indigo-500 mx-auto mt-4 rounded-full" />
				</motion.div>

				<div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
					<motion.div
						className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						{cart.length === 0 ? (
							<EmptyCartUI />
						) : (
							<div className="space-y-4">
								{cart.map((item) => (
									<CartItem key={item._id} item={item} />
								))}
							</div>
						)}
						{cart.length > 0 && <PeopleAlsoBought />}
					</motion.div>

					{cart.length > 0 && (
						<motion.div
							className="mx-auto mt-6 max-w-4xl flex-1 space-y-4 lg:mt-0 lg:w-full"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
						>
							<OrderSummary />
							<GiftCouponCard />
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CartPage;

const EmptyCartUI = () => (
	<motion.div
		className="flex flex-col items-center justify-center space-y-4 py-20"
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<div className="p-6 rounded-full bg-slate-800/50 border border-white/5">
			<ShoppingCart className="h-16 w-16 text-slate-600" />
		</div>
		<h3 className="text-2xl font-bold text-white">Your cart is empty</h3>
		<p className="text-slate-400 text-sm">Looks like you {"haven't"} added anything to your cart yet.</p>
		<Link
			className="mt-4 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 px-8 py-2.5 text-white font-medium text-sm transition-all duration-300 shadow-lg shadow-sky-500/20"
			to="/"
		>
			Start Shopping
		</Link>
	</motion.div>
);