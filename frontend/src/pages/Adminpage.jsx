import React, { useEffect, useState } from "react";
import { BarChart, PlusCircle, ShoppingBasket, Bell } from "lucide-react";
import { motion } from "framer-motion";

import Analytics from "../components/Analytics";
import CreateProductForm from "../components/CreateProductForm";
import ProductList from "../components/ProductList";

import { useProductStore } from "../store/useProductStore";

const tabs = [
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "products", label: "My Products", icon: ShoppingBasket },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "analytics", label: "Analytics", icon: BarChart },
];

const Adminpage = () => {
  const [activeTab, setActiveTab] = useState("create");
  const { fetchMyProducts } = useProductStore();

  useEffect(() => {
    fetchMyProducts();
  }, [fetchMyProducts]);

  return (
    <div className="min-h-screen pt-20">
      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.h1
          className="text-4xl font-black mb-10 text-gradient text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Vendor Dashboard
        </motion.h1>

        <div className="flex justify-center mb-10 gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                  ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-lg shadow-sky-500/20"
                  : "bg-slate-800/50 text-slate-400 border border-white/5 hover:border-white/15 hover:text-white"
                }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === "create" && <CreateProductForm />}
        {activeTab === "products" && <ProductList />}
        {activeTab === "notifications" && <VendorNotifications />}
        {activeTab === "analytics" && <Analytics />}
      </div>
    </div>
  );
};

const VendorNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const axios = (await import("../lib/axios")).default;
      const res = await axios.get("/notifications");
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const axios = (await import("../lib/axios")).default;
      await axios.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const axios = (await import("../lib/axios")).default;
      await axios.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <motion.div
      className="glass-card rounded-2xl p-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="text-sky-400" size={20} />
          <h2 className="text-lg font-bold text-white">Order Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-sky-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-slate-400 text-sm text-center py-8">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-8">No notifications yet. When customers order your products, you'll see alerts here.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`rounded-xl p-4 border transition-all duration-300 ${
                notification.isRead
                  ? "bg-slate-800/30 border-white/5"
                  : "bg-sky-500/5 border-sky-500/20"
              }`}
            >
              <div className="flex items-start gap-3">
                {notification.product?.image && (
                  <img
                    src={notification.product.image}
                    alt={notification.product.name}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{notification.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-slate-500">
                      {new Date(notification.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {notification.order && (
                      <span className="text-xs text-slate-600">
                        Order ₹{notification.order.totalAmount?.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="text-xs text-sky-400 hover:text-sky-300 shrink-0 whitespace-nowrap"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Adminpage;
