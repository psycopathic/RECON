import Notification from "../models/notificationModel.js";

export const getNotifications = async (req, res) => {
	try {
		const notifications = await Notification.find({ vendor: req.user._id })
			.sort({ createdAt: -1 })
			.populate("order", "totalAmount createdAt")
			.populate("product", "name image price");
		res.json(notifications);
	} catch (error) {
		console.log("Error in getNotifications controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getUnreadCount = async (req, res) => {
	try {
		const count = await Notification.countDocuments({ vendor: req.user._id, isRead: false });
		res.json({ count });
	} catch (error) {
		console.log("Error in getUnreadCount controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const markAsRead = async (req, res) => {
	try {
		const notification = await Notification.findOneAndUpdate(
			{ _id: req.params.id, vendor: req.user._id },
			{ isRead: true },
			{ new: true }
		);
		if (!notification) {
			return res.status(404).json({ message: "Notification not found" });
		}
		res.json(notification);
	} catch (error) {
		console.log("Error in markAsRead controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const markAllAsRead = async (req, res) => {
	try {
		await Notification.updateMany(
			{ vendor: req.user._id, isRead: false },
			{ isRead: true }
		);
		res.json({ message: "All notifications marked as read" });
	} catch (error) {
		console.log("Error in markAllAsRead controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
