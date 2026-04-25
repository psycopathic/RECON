import React, { useState, useEffect } from "react";
import { MapPin, Plus, Trash2, Star, Edit, Save, X } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../store/useUserStore";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import AddressForm from "../components/AddressForm";

const Profile = () => {
	const { user } = useUserStore();
	const [addresses, setAddresses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showAddForm, setShowAddForm] = useState(false);
	const [editingId, setEditingId] = useState(null);

	const fetchAddresses = async () => {
		try {
			const res = await axios.get("/address");
			setAddresses(res.data);
		} catch (error) {
			toast.error("Failed to load addresses");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAddresses();
	}, []);

	const handleAddAddress = async (formData) => {
		try {
			const res = await axios.post("/address", formData);
			setAddresses(res.data);
			setShowAddForm(false);
			toast.success("Address added");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to add address");
		}
	};

	const handleUpdateAddress = async (formData) => {
		try {
			const res = await axios.put(`/address/${editingId}`, formData);
			setAddresses(res.data);
			setEditingId(null);
			toast.success("Address updated");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to update address");
		}
	};

	const handleDeleteAddress = async (id) => {
		try {
			const res = await axios.delete(`/address/${id}`);
			setAddresses(res.data);
			toast.success("Address deleted");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to delete address");
		}
	};

	const handleSetDefault = async (id) => {
		try {
			const res = await axios.put(`/address/${id}/default`);
			setAddresses(res.data);
			toast.success("Default address updated");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to set default");
		}
	};

	return (
		<div className="min-h-screen pt-24 pb-16">
			<div className="relative z-10 max-w-3xl mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<div className="glass-card rounded-2xl p-8 mb-6">
						<h1 className="text-3xl font-black text-gradient mb-2">My Profile</h1>
						<p className="text-slate-400 text-sm">Manage your account and addresses</p>
						<div className="mt-6 space-y-2">
							<p className="text-sm text-white">
								<span className="text-slate-400">Name:</span> {user?.name}
							</p>
							<p className="text-sm text-white">
								<span className="text-slate-400">Email:</span> {user?.email}
							</p>
							<p className="text-sm text-white">
								<span className="text-slate-400">Role:</span>{" "}
								{user?.role === "admin" ? "Vendor" : "Customer"}
							</p>
						</div>
					</div>

					<div className="glass-card rounded-2xl p-8">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-2">
								<MapPin size={20} className="text-sky-400" />
								<h2 className="text-lg font-bold text-white">My Addresses</h2>
							</div>
							{!showAddForm && !editingId && (
								<button
									onClick={() => setShowAddForm(true)}
									className="flex items-center gap-1.5 text-sm text-sky-400 hover:text-sky-300 transition-colors"
								>
									<Plus size={16} />
									Add Address
								</button>
							)}
						</div>

						{loading ? (
							<p className="text-slate-400 text-sm text-center py-4">Loading addresses...</p>
						) : (
							<div className="space-y-4">
								{addresses.map((addr) => (
									<div key={addr._id} className="relative">
										{editingId === addr._id ? (
											<div className="bg-slate-800/50 rounded-xl p-4 border border-sky-500/20">
												<AddressForm
													initialData={{
														street: addr.street,
														city: addr.city,
														state: addr.state,
														zipCode: addr.zipCode,
														country: addr.country,
													}}
													onSave={handleUpdateAddress}
													onCancel={() => setEditingId(null)}
												/>
											</div>
										) : (
											<div className="bg-slate-800/30 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all">
												<div className="flex items-start justify-between gap-3">
													<div>
														<div className="flex items-center gap-2 mb-1">
															<p className="text-sm text-white">{addr.street}</p>
															{addr.isDefault && (
																<span className="text-[10px] bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full">
																	Default
																</span>
															)}
														</div>
														<p className="text-xs text-slate-400">
															{addr.city}, {addr.state} - {addr.zipCode}
														</p>
														<p className="text-xs text-slate-500">{addr.country}</p>
													</div>
													<div className="flex items-center gap-1 shrink-0">
														{!addr.isDefault && (
															<button
																onClick={() => handleSetDefault(addr._id)}
																className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
																title="Set as default"
															>
																<Star size={14} />
															</button>
														)}
														<button
															onClick={() => setEditingId(addr._id)}
															className="p-1.5 rounded-lg text-slate-500 hover:text-sky-400 hover:bg-sky-500/10 transition-all"
															title="Edit"
														>
															<Edit size={14} />
														</button>
														<button
															onClick={() => handleDeleteAddress(addr._id)}
															className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
															title="Delete"
														>
															<Trash2 size={14} />
														</button>
													</div>
												</div>
											</div>
										)}
									</div>
								))}

								{showAddForm && (
									<div className="bg-slate-800/50 rounded-xl p-4 border border-sky-500/20">
										<AddressForm
											onSave={handleAddAddress}
											onCancel={() => setShowAddForm(false)}
										/>
									</div>
								)}

								{!showAddForm && addresses.length === 0 && (
									<p className="text-sm text-slate-500 text-center py-6">
										No addresses saved yet. Add your first shipping address.
									</p>
								)}
							</div>
						)}
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default Profile;
