import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "../store/useUserStore";

const Signupage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signup, loading } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    signup({ ...formData, role });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      {/* Background Orbs */}
      <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-56 h-56 bg-sky-500/8 rounded-full blur-3xl pointer-events-none" />

      <AnimatePresence mode="wait">
        {/* STEP 1 — ROLE SELECT */}
        {step === 1 && (
          <motion.div
            key="step1"
            className="w-full max-w-md relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="glass-card rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-black text-gradient mb-2">
                Join RE-CON
              </h2>
              <p className="text-slate-400 text-sm mb-8">Choose your account type</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: "User", icon: "👤", value: "user" },
                  { label: "Vendor", icon: "🏪", value: "vendor" },
                ].map((item) => (
                  <div
                    key={item.value}
                    onClick={() => setRole(item.value)}
                    className={`p-6 rounded-2xl cursor-pointer border transition-all duration-300 ${role === item.value
                        ? "bg-gradient-to-br from-sky-600/20 to-indigo-600/20 border-sky-500/40 shadow-lg shadow-sky-500/10"
                        : "bg-slate-800/40 border-white/5 hover:border-white/15 hover:bg-slate-800/60"
                      }`}
                  >
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="font-medium text-white text-sm">{item.label}</div>
                  </div>
                ))}
              </div>

              <button
                disabled={!role}
                onClick={() => setStep(2)}
                className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 rounded-xl text-white font-medium text-sm disabled:opacity-30 transition-all duration-300 shadow-lg shadow-sky-500/20 cursor-pointer"
              >
                Continue →
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2 — FORM */}
        {step === 2 && (
          <motion.div
            key="step2"
            className="w-full max-w-md relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-gradient">Create Account</h2>
              <p className="text-slate-400 mt-2 text-sm">Fill in your details to get started</p>
            </div>

            <div className="glass-card rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-medium text-sm transition-all duration-300 shadow-lg shadow-sky-500/20 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5" />
                      Sign Up
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link to="/login" className="text-sky-400 hover:text-sky-300 transition-colors font-medium">
                  Login here <ArrowRight className="inline h-4 w-4" />
                </Link>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Signupage;
