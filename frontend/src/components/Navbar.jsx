import React, { useState } from "react";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Mic, Search, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { useCartStore } from "../store/useCartStore";

const Navbar = () => {
	const { user, logout } = useUserStore();
	const { cart } = useCartStore();
	const isAdmin = user?.role === "admin";
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const handleMicClick = () => {
		const btn = document.getElementById("voice-control-btn");
		if (btn) btn.click();
	};

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
			setSearchQuery("");
			setMobileMenuOpen(false);
		}
	};

	return (
		<header className="fixed top-0 left-0 w-full bg-slate-900/80 backdrop-blur-xl z-40 border-b border-white/10">
			<div className="container mx-auto px-4 py-3">
				<div className="flex items-center justify-between gap-4">

					{/* Logo */}
					<Link to="/" className="text-2xl font-extrabold tracking-tight flex items-center gap-2 shrink-0">
						<span className="text-gradient">RE-CON</span>
					</Link>

					{/* Search Bar — Desktop */}
					<form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
						<div className="relative w-full">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search products..."
								className="w-full pl-10 pr-4 py-2 bg-slate-800/60 border border-white/10 rounded-full text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all duration-300"
							/>
						</div>
					</form>

					{/* Nav Actions */}
					<nav className="hidden md:flex items-center gap-3">
						<Link
							to="/"
							className="text-slate-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/5 transition-all duration-300 text-sm font-medium"
						>
							Home
						</Link>

						<button
							onClick={handleMicClick}
							className="text-slate-300 hover:text-sky-400 p-2 rounded-full hover:bg-white/5 transition-all duration-300"
							title="Voice Control"
						>
							<Mic size={18} />
						</button>

						{user && (
							<Link
								to="/cart"
								className="relative text-slate-300 hover:text-white p-2 rounded-full hover:bg-white/5 transition-all duration-300"
							>
								<ShoppingCart size={20} />
								{cart.length > 0 && (
									<span className="absolute -top-1 -right-1 bg-sky-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse-badge">
										{cart.length}
									</span>
								)}
							</Link>
						)}

						{isAdmin && (
							<Link
								className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white px-4 py-1.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-1.5 shadow-lg shadow-sky-500/20"
								to="/secretDashboard"
							>
								<Lock size={14} />
								<span className="hidden lg:inline">Dashboard</span>
							</Link>
						)}

						{user ? (
							<button
								className="text-slate-300 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5 transition-all duration-300 flex items-center gap-2 text-sm"
								onClick={logout}
							>
								<LogOut size={16} />
								<span className="hidden lg:inline">Log Out</span>
							</button>
						) : (
							<>
								<Link
									to="/signup"
									className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white px-4 py-1.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-1.5 shadow-lg shadow-sky-500/20"
								>
									<UserPlus size={16} />
									Sign Up
								</Link>
								<Link
									to="/login"
									className="text-slate-300 hover:text-white px-4 py-1.5 rounded-full border border-white/10 hover:bg-white/5 transition-all duration-300 flex items-center gap-1.5 text-sm"
								>
									<LogIn size={16} />
									Login
								</Link>
							</>
						)}
					</nav>

					{/* Mobile Menu Toggle */}
					<div className="flex items-center gap-3 md:hidden">
						{user && (
							<Link to="/cart" className="relative text-slate-300 p-2">
								<ShoppingCart size={20} />
								{cart.length > 0 && (
									<span className="absolute -top-1 -right-1 bg-sky-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
										{cart.length}
									</span>
								)}
							</Link>
						)}
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="text-slate-300 p-2"
						>
							{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div className="md:hidden mt-4 pb-4 space-y-3 border-t border-white/10 pt-4">
						<form onSubmit={handleSearch}>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Search products..."
									className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-full text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 transition-all"
								/>
							</div>
						</form>
						<Link to="/" className="block text-slate-300 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition" onClick={() => setMobileMenuOpen(false)}>Home</Link>
						{isAdmin && (
							<Link to="/secretDashboard" className="block text-slate-300 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
						)}
						{user ? (
							<button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full text-left text-slate-300 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition">Log Out</button>
						) : (
							<>
								<Link to="/signup" className="block text-center bg-gradient-to-r from-sky-500 to-indigo-500 text-white py-2.5 rounded-full font-medium text-sm" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
								<Link to="/login" className="block text-center text-slate-300 border border-white/10 py-2.5 rounded-full text-sm" onClick={() => setMobileMenuOpen(false)}>Login</Link>
							</>
						)}
					</div>
				)}
			</div>
		</header>
	);
};

export default Navbar;
