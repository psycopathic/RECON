import User from "../models/userModel.js";

export const getAddresses = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		res.json(user.addresses || []);
	} catch (error) {
		console.log("Error in getAddresses controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addAddress = async (req, res) => {
	try {
		const { street, city, state, zipCode, country } = req.body;
		if (!street || !city || !state || !zipCode || !country) {
			return res.status(400).json({ message: "Please fill all address fields" });
		}

		const user = await User.findById(req.user._id);
		const newAddress = { street, city, state, zipCode, country, isDefault: user.addresses.length === 0 };
		user.addresses.push(newAddress);
		await user.save();

		res.status(201).json(user.addresses);
	} catch (error) {
		console.log("Error in addAddress controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateAddress = async (req, res) => {
	try {
		const { addressId } = req.params;
		const { street, city, state, zipCode, country } = req.body;

		const user = await User.findById(req.user._id);
		const address = user.addresses.id(addressId);
		if (!address) {
			return res.status(404).json({ message: "Address not found" });
		}

		if (street !== undefined) address.street = street;
		if (city !== undefined) address.city = city;
		if (state !== undefined) address.state = state;
		if (zipCode !== undefined) address.zipCode = zipCode;
		if (country !== undefined) address.country = country;

		await user.save();
		res.json(user.addresses);
	} catch (error) {
		console.log("Error in updateAddress controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteAddress = async (req, res) => {
	try {
		const { addressId } = req.params;

		const user = await User.findById(req.user._id);
		const address = user.addresses.id(addressId);
		if (!address) {
			return res.status(404).json({ message: "Address not found" });
		}

		const wasDefault = address.isDefault;
		address.deleteOne();

		if (wasDefault && user.addresses.length > 0) {
			user.addresses[0].isDefault = true;
		}

		await user.save();
		res.json(user.addresses);
	} catch (error) {
		console.log("Error in deleteAddress controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const setDefaultAddress = async (req, res) => {
	try {
		const { addressId } = req.params;

		const user = await User.findById(req.user._id);
		const address = user.addresses.id(addressId);
		if (!address) {
			return res.status(404).json({ message: "Address not found" });
		}

		user.addresses.forEach((addr) => {
			addr.isDefault = addr._id.toString() === addressId;
		});

		await user.save();
		res.json(user.addresses);
	} catch (error) {
		console.log("Error in setDefaultAddress controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
