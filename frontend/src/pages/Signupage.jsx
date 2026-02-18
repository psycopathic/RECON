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
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <AnimatePresence mode="wait">
        {/* STEP 1 — ROLE SELECT */}
        {step === 1 && (
          <motion.div
            key="step1"
            className="sm:mx-auto sm:w-full sm:max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="min-h-screen flex items-center justify-center">
              <div className="bg-gray-800 py-8 px-6 shadow sm:rounded-lg text-center">
                <h2 className="text-3xl font-bold text-sky-400 mb-6">
                  Choose Account Type
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: "User", icon: "👤", value: "user" },
                    { label: "Vendor", icon: "🏪", value: "vendor" },
                  ].map((item) => (
                    <div
                      key={item.value}
                      onClick={() => setRole(item.value)}
                      className={`p-6 rounded-xl cursor-pointer border transition
                      ${
                        role === item.value
                          ? "bg-sky-600 border-sky-400"
                          : "bg-gray-700 border-gray-600 hover:bg-gray-600"
                      }`}
                    >
                      <div className="text-3xl">{item.icon}</div>
                      <div className="mt-2">{item.label}</div>
                    </div>
                  ))}
                </div>

                <button
                  disabled={!role}
                  onClick={() => setStep(2)}
                  className="w-full py-2 bg-sky-400 rounded-md hover:bg-sky-500 text-black disabled:opacity-50 hover:cursor-pointer"
                >
                  Continue →
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2 — FORM */}
        {step === 2 && (
          <motion.div
            key="step2"
            className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-10 py-2 bg-gray-700 border border-gray-600 rounded-md"
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-10 py-2 bg-gray-700 border border-gray-600 rounded-md"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-10 py-2 bg-gray-700 border border-gray-600 rounded-md"
                  />
                </div>

                {/* Confirm */}
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full pl-10 py-2 bg-gray-700 border border-gray-600 rounded-md"
                  />
                </div>

                {/* Submit */}
                <button
                  disabled={loading}
                  className="w-full py-2 bg-sky-600 rounded-md hover:bg-sky-700 disabled:opacity-50 flex justify-center"
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-5 w-5" />
                      Sign Up
                    </>
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="text-sky-400 hover:text-sky-300">
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
