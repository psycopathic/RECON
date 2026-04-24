import React from "react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="relative bg-slate-950 w-full text-slate-400 z-40 border-t border-white/5">
      {/* Top Glow Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <h2
              onClick={() => navigate("/")}
              className="text-3xl font-black cursor-pointer text-gradient"
            >
              RE-CON
            </h2>
            <p className="text-sm leading-relaxed text-slate-500">
              Smart, secure & scalable multi-vendor eCommerce platform built
              for performance and growth.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Home", path: "/" },
                { label: "Categories", path: "/category" },
                { label: "Shop", path: "/shop" },
                { label: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <span
                    onClick={() => navigate(link.path)}
                    className="cursor-pointer hover:text-sky-400 transition-colors duration-300"
                  >
                    {link.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-5">
              Help & Support
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Support", path: "/support" },
                { label: "Track Order", path: "/orders" },
              ].map((link) => (
                <li key={link.label}>
                  <span
                    onClick={() => navigate(link.path)}
                    className="cursor-pointer hover:text-sky-400 transition-colors duration-300"
                  >
                    {link.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-5">
              Contact Info
            </h3>
            <div className="space-y-3 text-sm">
              <p className="hover:text-sky-400 transition-colors">admin@RE-CON.com</p>
              <p className="hover:text-sky-400 transition-colors">+91 12345 67890</p>
              <p className="hover:text-sky-400 transition-colors">New Delhi, India</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-5">
        <p className="text-center text-xs text-slate-600">
          © {new Date().getFullYear()} RE-CON — Powered by Secure Commerce Engine
        </p>
      </div>
    </footer>
  );
}
