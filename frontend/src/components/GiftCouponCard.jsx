import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "../store/useCartStore";
import React from "react";

const GiftCouponCard = () => {
	const [userInputCode, setUserInputCode] = useState("");
	const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } = useCartStore();

	useEffect(() => {
		getMyCoupon();
	}, [getMyCoupon]);

	useEffect(() => {
		if (coupon) setUserInputCode(coupon.code);
	}, [coupon]);

	const handleApplyCoupon = () => {
		if (!userInputCode) return;
		applyCoupon(userInputCode);
	};

	const handleRemoveCoupon = async () => {
		await removeCoupon();
		setUserInputCode("");
	};

	return (
		<motion.div
			className="glass-card rounded-2xl p-6"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			<div className="space-y-4">
				<div>
					<label htmlFor="voucher" className="block text-sm font-medium text-slate-300 mb-2">
						Do you have a voucher or gift card?
					</label>
					<input
						type="text"
						id="voucher"
						className="w-full py-2.5 px-4 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all"
						placeholder="Enter code here"
						value={userInputCode}
						onChange={(e) => setUserInputCode(e.target.value)}
						required
					/>
				</div>

				<motion.button
					type="button"
					className="w-full flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 py-2.5 text-sm font-medium text-white transition-all duration-300 shadow-lg shadow-sky-500/20"
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={handleApplyCoupon}
				>
					Apply Code
				</motion.button>
			</div>

			{isCouponApplied && coupon && (
				<div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
					<h3 className="text-sm font-medium text-emerald-400">Applied Coupon</h3>
					<p className="mt-1 text-xs text-slate-400">
						{coupon.code} — {coupon.discountPercentage}% off
					</p>
					<motion.button
						type="button"
						className="mt-2 w-full flex items-center justify-center rounded-xl bg-red-500/20 border border-red-500/30 py-2 text-sm font-medium text-red-400 hover:bg-red-500/30 transition-all"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={handleRemoveCoupon}
					>
						Remove Coupon
					</motion.button>
				</div>
			)}

			{coupon && !isCouponApplied && (
				<div className="mt-4 p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
					<h3 className="text-sm font-medium text-sky-400">Your Available Coupon</h3>
					<p className="mt-1 text-xs text-slate-400">
						{coupon.code} — {coupon.discountPercentage}% off
					</p>
				</div>
			)}
		</motion.div>
	);
};

export default GiftCouponCard;