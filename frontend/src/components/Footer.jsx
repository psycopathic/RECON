import React from "react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-linear-to-br from-[#1f1f1f] to-[#0f0f0f] w-full text-gray-300 z-40 py-12 border-t border-gray-700">
      <div
        className="max-w-7xl mx-auto px-6 grid gap-10 text-center md:text-left"
        
      >
        {/* Brand */}
        <div className="space-y-3">
          <h2
            onClick={() => navigate("/")}
            className="text-white text-3xl font-bold cursor-pointer tracking-wide hover:text-blue-400 transition"
          >
            RE-CON
          </h2>

          <p className="text-sm leading-relaxed text-gray-400">
            Smart, secure & scalable multi-vendor eCommerce platform built
            for performance and growth.
          </p>

        </div>

        {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li
                onClick={() => navigate("/")}
                className="cursor-pointer hover:text-white"
              >
                Home
              </li>
              <li
                onClick={() => navigate("/category")}
                className="cursor-pointer hover:text-white"
              >
                Categories
              </li>
              <li
                onClick={() => navigate("/shop")}
                className="cursor-pointer hover:text-white"
              >
                Shop
              </li>
              <li
                onClick={() => navigate("/contact")}
                className="cursor-pointer hover:text-white"
              >
                Contact
              </li>
            </ul>
          </div>

        {/* Support */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Help & Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li
                onClick={() => navigate("/support")}
                className="cursor-pointer hover:text-white"
              >
                Support
              </li>
              <li
                onClick={() => navigate("/orders")}
                className="cursor-pointer hover:text-white"
              >
                Track Order
              </li>
            </ul>
          </div>


        {/* Contact */}
        <div className="space-y-2">
          <h3 className="text-white text-lg font-semibold mb-4">
            Contact Info
          </h3>
          <p className="text-sm">admin@RE_CON.com</p>
          <p className="text-sm">+91 12345 67890</p>
          <p className="text-sm">New Delhi, India</p>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-xs text-gray-500 mt-12 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} RE-CON — Powered by Secure Commerce
        Engine
      </div>
    </footer>
  );
}
