import React from "react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dailySalesData, setDailySalesData] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get("/analytics");
        setAnalyticsData(response.data.analyticsData);
        setDailySalesData(response.data.dailySalesData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-3 border-slate-700 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AnalyticsCard title="Total Users" value={analyticsData.users.toLocaleString()} icon={Users} />
        <AnalyticsCard title="Total Products" value={analyticsData.products.toLocaleString()} icon={Package} />
        <AnalyticsCard title="Total Sales" value={analyticsData.totalSales.toLocaleString()} icon={ShoppingCart} />
        <AnalyticsCard title="Total Revenue" value={`₹${analyticsData.totalRevenue.toLocaleString()}`} icon={DollarSign} />
      </div>

      <motion.div
        className="glass-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <h3 className="text-white font-semibold mb-4">Sales & Revenue</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dailySalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
            <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#f1f5f9",
              }}
            />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#38bdf8" activeDot={{ r: 6 }} name="Sales" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#818cf8" activeDot={{ r: 6 }} name="Revenue" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon }) => (
  <motion.div
    className="glass-card rounded-2xl p-5 relative overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex justify-between items-start">
      <div className="z-10">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-white text-2xl font-bold">{value}</h3>
      </div>
      <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20">
        <Icon className="h-5 w-5 text-sky-400" />
      </div>
    </div>
    <div className="absolute -bottom-6 -right-6 text-sky-500/5">
      <Icon className="h-24 w-24" />
    </div>
  </motion.div>
);
