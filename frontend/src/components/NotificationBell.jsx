import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import axios from "../lib/axios";

const NotificationBell = () => {
	const [unreadCount, setUnreadCount] = useState(0);
	const [notifications, setNotifications] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const dropdownRef = useRef(null);

	const fetchUnreadCount = async () => {
		try {
			const res = await axios.get("/notifications/unread-count");
			setUnreadCount(res.data.count);
		} catch (error) {
			// silently fail
		}
	};

	const fetchNotifications = async () => {
		setLoading(true);
		try {
			const res = await axios.get("/notifications");
			setNotifications(res.data.slice(0, 5));
		} catch (error) {
			// silently fail
		} finally {
			setLoading(false);
		}
	};

	const markAsRead = async (id) => {
		try {
			await axios.put(`/notifications/${id}/read`);
			setNotifications((prev) =>
				prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
			);
			setUnreadCount((prev) => Math.max(0, prev - 1));
		} catch (error) {
			// silently fail
		}
	};

	useEffect(() => {
		fetchUnreadCount();
		const interval = setInterval(fetchUnreadCount, 30000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (isOpen) {
			fetchNotifications();
		}
	}, [isOpen]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="relative text-slate-300 hover:text-white p-2 rounded-full hover:bg-white/5 transition-all duration-300"
			>
				<Bell size={20} />
				{unreadCount > 0 && (
					<span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-pulse-badge">
						{unreadCount > 9 ? "9+" : unreadCount}
					</span>
				)}
			</button>

			{isOpen && (
				<div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
					<div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
						<p className="text-sm font-medium text-white">Notifications</p>
						{unreadCount > 0 && (
							<span className="text-xs text-sky-400">{unreadCount} new</span>
						)}
					</div>

					<div className="max-h-72 overflow-y-auto">
						{loading ? (
							<p className="text-sm text-slate-400 text-center py-6">Loading...</p>
						) : notifications.length === 0 ? (
							<p className="text-sm text-slate-500 text-center py-6">No notifications</p>
						) : (
							notifications.map((n) => (
								<div
									key={n._id}
									onClick={() => !n.isRead && markAsRead(n._id)}
									className={`px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all ${
										!n.isRead ? "bg-sky-500/5" : ""
									}`}
								>
									<p className="text-xs text-white leading-relaxed">{n.message}</p>
									{n.shippingAddress && (
										<p className="text-[10px] text-sky-400/80 mt-1 flex items-start gap-1">
											<span className="shrink-0">📍</span>
											<span>
												{n.shippingAddress.street}, {n.shippingAddress.city}, {n.shippingAddress.state} {n.shippingAddress.zipCode}, {n.shippingAddress.country}
											</span>
										</p>
									)}
									<p className="text-[10px] text-slate-500 mt-1">
										{new Date(n.createdAt).toLocaleDateString("en-IN", {
											day: "numeric",
											month: "short",
											hour: "2-digit",
											minute: "2-digit",
										})}
									</p>
								</div>
							))
						)}
					</div>

					<div className="px-4 py-2 border-t border-white/10">
						<a
							href="/secretDashboard"
							className="text-xs text-sky-400 hover:text-sky-300 transition-colors block text-center"
						>
							View all in Dashboard
						</a>
					</div>
				</div>
			)}
		</div>
	);
};

export default NotificationBell;
