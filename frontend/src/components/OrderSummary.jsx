import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "../store/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight, MapPin } from "lucide-react";
import axios from "../lib/axios";
import { loadStripe } from "@stripe/stripe-js";
import AddressSelector from "./AddressSelector";

const stripePromise = loadStripe('pk_test_51Ro8nhKTGMHqdvzQxTT8aBYnyG27bRjRFUAHFblGqDFWzoBBIpiB0PQplWIzlKdP9IsYdM3CEkBE8ShQ4JOAeZWt002Dbk2bzF');

const OrderSummary = () => {
  const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();
  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const handlePayment = async () => {
    if (!selectedAddressId) {
      return;
    }
    const stripe = await stripePromise;
    const res = await axios.post("/payment/createCheckoutSession", {
      products: cart,
      couponCode: coupon ? coupon.code : null,
      addressId: selectedAddressId,
    });
    const session = res.data;
    const result = await stripe.redirectToCheckout({ sessionId: session.id });
    if (result.error) {
      console.error("Error: ", result.error);
    }
  };

  return (
    <motion.div
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-lg font-bold text-white mb-4">Order Summary</p>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={16} className="text-sky-400" />
          <p className="text-sm font-medium text-white">Shipping Address</p>
        </div>
        <AddressSelector
          selectedAddressId={selectedAddressId}
          onSelectAddress={setSelectedAddressId}
        />
      </div>

      <div className="space-y-3">
        <dl className="flex items-center justify-between">
          <dt className="text-sm text-slate-400">Original price</dt>
          <dd className="text-sm font-medium text-white">₹{formattedSubtotal}</dd>
        </dl>

        {savings > 0 && (
          <dl className="flex items-center justify-between">
            <dt className="text-sm text-slate-400">Savings</dt>
            <dd className="text-sm font-medium text-emerald-400">-₹{formattedSavings}</dd>
          </dl>
        )}

        {coupon && isCouponApplied && (
          <dl className="flex items-center justify-between">
            <dt className="text-sm text-slate-400">Coupon ({coupon.code})</dt>
            <dd className="text-sm font-medium text-emerald-400">-{coupon.discountPercentage}%</dd>
          </dl>
        )}

        <dl className="flex items-center justify-between border-t border-white/10 pt-3">
          <dt className="text-base font-bold text-white">Total</dt>
          <dd className="text-base font-bold text-gradient">₹{formattedTotal}</dd>
        </dl>

        <motion.button
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-white transition-all duration-300 shadow-lg mt-2 ${
            selectedAddressId
              ? "bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-sky-500/20"
              : "bg-slate-700 cursor-not-allowed shadow-none"
          }`}
          whileHover={selectedAddressId ? { scale: 1.02 } : {}}
          whileTap={selectedAddressId ? { scale: 0.98 } : {}}
          onClick={handlePayment}
          disabled={!selectedAddressId}
        >
          {selectedAddressId ? "Proceed to Checkout" : "Select an address to continue"}
        </motion.button>

        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="text-xs text-slate-500">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors"
          >
            Continue Shopping
            <MoveRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
