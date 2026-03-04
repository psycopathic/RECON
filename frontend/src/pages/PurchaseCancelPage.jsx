import React from 'react'
import { XCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PurchaseCancelPage = () => {
	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="max-w-md w-full glass-card rounded-2xl overflow-hidden relative z-10"
			>
				<div className="p-8">
					<div className="flex justify-center mb-4">
						<div className="p-4 rounded-full bg-red-500/10 border border-red-500/20">
							<XCircle className="text-red-400 w-12 h-12" />
						</div>
					</div>
					<h1 className="text-2xl sm:text-3xl font-black text-center text-red-400 mb-2">
						Purchase Cancelled
					</h1>
					<p className="text-slate-400 text-center text-sm mb-6">
						Your order has been cancelled. No charges have been made.
					</p>
					<div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-white/5">
						<p className="text-xs text-slate-500 text-center">
							If you encountered any issues during the checkout process, please don&apos;t hesitate to
							contact our support team.
						</p>
					</div>
					<Link
						to="/"
						className="w-full bg-slate-800/50 border border-white/10 hover:border-sky-500/20 text-slate-300 font-medium py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm"
					>
						<ArrowLeft size={16} />
						Return to Shop
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default PurchaseCancelPage;