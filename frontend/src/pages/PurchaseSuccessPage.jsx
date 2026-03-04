import React from 'react'
import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import axios from "../lib/axios";
import Confetti from "react-confetti";

const PurchaseSuccessPage = () => {
	const [isProcessing, setIsProcessing] = useState(true);
	const { clearCart } = useCartStore();
	const [error, setError] = useState(null);

	useEffect(() => {
		const handleCheckoutSuccess = async (sessionId) => {
			try {
				await axios.post("/payment/checkoutSuccess", { sessionId });
				clearCart();
			} catch (error) {
				console.log(error);
			} finally {
				setIsProcessing(false);
			}
		};

		const sessionId = new URLSearchParams(window.location.search).get("session_id");
		if (sessionId) {
			handleCheckoutSuccess(sessionId);
		} else {
			setIsProcessing(false);
			setError("No session ID found in the URL");
		}
	}, [clearCart]);

	if (isProcessing) return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="w-10 h-10 border-3 border-slate-700 border-t-sky-500 rounded-full animate-spin" />
		</div>
	);

	if (error) return (
		<div className="min-h-screen flex items-center justify-center">
			<p className="text-red-400">{error}</p>
		</div>
	);

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<Confetti
				width={window.innerWidth}
				height={window.innerHeight}
				gravity={0.1}
				style={{ zIndex: 99 }}
				numberOfPieces={700}
				recycle={false}
			/>

			<div className="max-w-md w-full glass-card rounded-2xl overflow-hidden relative z-10">
				<div className="p-8">
					<div className="flex justify-center mb-4">
						<div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20">
							<CheckCircle className="text-emerald-400 w-12 h-12" />
						</div>
					</div>
					<h1 className="text-2xl sm:text-3xl font-black text-center text-gradient mb-2">
						Purchase Successful!
					</h1>
					<p className="text-slate-400 text-center text-sm mb-1">
						Thank you for your order. {"We're"} processing it now.
					</p>
					<p className="text-sky-400 text-center text-xs mb-6">
						Check your email for order details and updates.
					</p>

					<div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-white/5">
						<div className="flex items-center justify-between mb-2">
							<span className="text-xs text-slate-500">Order number</span>
							<span className="text-xs font-semibold text-sky-400">#12345</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-xs text-slate-500">Estimated delivery</span>
							<span className="text-xs font-semibold text-sky-400">3-5 business days</span>
						</div>
					</div>

					<div className="space-y-3">
						<button className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-medium py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-lg shadow-sky-500/20">
							<HandHeart size={18} />
							Thanks for trusting us!
						</button>
						<Link
							to="/"
							className="w-full bg-slate-800/50 border border-white/10 hover:border-sky-500/20 text-sky-400 font-medium py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm"
						>
							Continue Shopping
							<ArrowRight size={16} />
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PurchaseSuccessPage;