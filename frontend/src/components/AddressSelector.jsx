import React, { useState, useEffect } from "react";
import { MapPin, Plus, Check } from "lucide-react";
import AddressForm from "./AddressForm";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const AddressSelector = ({ selectedAddressId, onSelectAddress }) => {
	const [addresses, setAddresses] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchAddresses();
	}, []);

	const fetchAddresses = async () => {
		try {
			const res = await axios.get("/address");
			setAddresses(res.data);
			if (res.data.length > 0 && !selectedAddressId) {
				const defaultAddr = res.data.find((a) => a.isDefault) || res.data[0];
				onSelectAddress(defaultAddr._id);
			}
		} catch (error) {
			toast.error("Failed to load addresses");
		} finally {
			setLoading(false);
		}
	};

	const handleAddAddress = async (formData) => {
		try {
			const res = await axios.post("/address", formData);
			setAddresses(res.data);
			const newAddr = res.data[res.data.length - 1];
			onSelectAddress(newAddr._id);
			setShowForm(false);
			toast.success("Address added");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to add address");
		}
	};

	if (loading) {
		return (
			<div className="glass-card rounded-2xl p-6">
				<p className="text-slate-400 text-sm">Loading addresses...</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{addresses.length > 0 && (
				<div className="space-y-2">
					{addresses.map((addr) => (
						<div
							key={addr._id}
							onClick={() => onSelectAddress(addr._id)}
							className={`glass-card rounded-xl p-4 cursor-pointer transition-all duration-300 border-2 ${
								selectedAddressId === addr._id
									? "border-sky-500/50 bg-sky-500/5"
									: "border-transparent hover:border-white/10"
							}`}
						>
							<div className="flex items-start gap-3">
								<MapPin
									size={18}
									className={
										selectedAddressId === addr._id
											? "text-sky-400 mt-0.5 shrink-0"
											: "text-slate-500 mt-0.5 shrink-0"
									}
								/>
								<div className="flex-1 min-w-0">
									<p className="text-sm text-white">{addr.street}</p>
									<p className="text-xs text-slate-400">
										{addr.city}, {addr.state} - {addr.zipCode}
									</p>
									<p className="text-xs text-slate-500">{addr.country}</p>
								</div>
								{selectedAddressId === addr._id && (
									<Check size={18} className="text-sky-400 shrink-0" />
								)}
							</div>
						</div>
					))}
				</div>
			)}

			{showForm ? (
				<div className="glass-card rounded-2xl p-6">
					<p className="text-sm font-medium text-white mb-3">Add New Address</p>
					<AddressForm
						onSave={handleAddAddress}
						onCancel={() => setShowForm(false)}
					/>
				</div>
			) : (
				<button
					onClick={() => setShowForm(true)}
					className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/10 hover:border-sky-500/30 py-3 text-sm text-slate-400 hover:text-sky-400 transition-all duration-300"
				>
					<Plus size={16} />
					Add New Address
				</button>
			)}
		</div>
	);
};

export default AddressSelector;
