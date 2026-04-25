import React, { useState } from "react";
import { MapPin, Save } from "lucide-react";

const AddressForm = ({ initialData, onSave, onCancel }) => {
	const [formData, setFormData] = useState(
		initialData || {
			street: "",
			city: "",
			state: "",
			zipCode: "",
			country: "",
		}
	);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSave(formData);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-3">
			<div>
				<input
					type="text"
					name="street"
					value={formData.street}
					onChange={handleChange}
					placeholder="Street Address"
					required
					className="w-full py-2.5 px-4 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all"
				/>
			</div>
			<div className="grid grid-cols-2 gap-3">
				<input
					type="text"
					name="city"
					value={formData.city}
					onChange={handleChange}
					placeholder="City"
					required
					className="w-full py-2.5 px-4 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all"
				/>
				<input
					type="text"
					name="state"
					value={formData.state}
					onChange={handleChange}
					placeholder="State"
					required
					className="w-full py-2.5 px-4 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all"
				/>
			</div>
			<div className="grid grid-cols-2 gap-3">
				<input
					type="text"
					name="zipCode"
					value={formData.zipCode}
					onChange={handleChange}
					placeholder="ZIP Code"
					required
					className="w-full py-2.5 px-4 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all"
				/>
				<input
					type="text"
					name="country"
					value={formData.country}
					onChange={handleChange}
					placeholder="Country"
					required
					className="w-full py-2.5 px-4 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all"
				/>
			</div>
			<div className="flex gap-2">
				<button
					type="submit"
					className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300"
				>
					<Save size={16} />
					{initialData ? "Update Address" : "Save Address"}
				</button>
				{onCancel && (
					<button
						type="button"
						onClick={onCancel}
						className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-xl border border-white/10 hover:border-white/20 transition-all"
					>
						Cancel
					</button>
				)}
			</div>
		</form>
	);
};

export default AddressForm;
