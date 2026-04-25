import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import slide1 from "../../assets/silder.png";
import slide2 from "../../assets/silder1.png";
import slide3 from "../../assets/silder2.png";

const slides = [
  {
    image: slide1,
    title: "RUN ON AIR",
    subtitle: "DO IT NOW.",
    description: "Running Shoes",
    button: "DISCOVER",
    category: "shoes",
  },
  {
    image: slide2,
    title: "STYLE & COMFORT",
    subtitle: "NEW COLLECTION",
    description: "Women's Fashion Accessories",
    button: "DISCOVER",
    category: "accessories",
  },
  {
    image: slide3,
    title: "STEP INTO POWER",
    subtitle: "FEEL THE SPEED",
    description: "Smart Gadgets for Smart People",
    button: "DISCOVER",
    category: "gadgets",
  },
];

export default function Slider() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-[92vh] overflow-hidden bg-slate-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-start justify-center px-8 md:px-20 lg:px-32">
            <motion.span
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block px-4 py-1.5 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-400 text-xs md:text-sm font-semibold uppercase tracking-[0.2em] mb-4"
            >
              {slides[current].subtitle}
            </motion.span>

            <motion.h1
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-3 leading-tight drop-shadow-2xl"
            >
              {slides[current].description}
            </motion.h1>

            <motion.p
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-base md:text-xl text-slate-300 mb-8 max-w-lg"
            >
              {slides[current].title}
            </motion.p>

            <motion.button
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(56, 189, 248, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold rounded-full shadow-xl shadow-sky-500/25 transition-all duration-300 text-sm md:text-base tracking-wide"
              onClick={() => navigate(`/category/${slides[current].category}`)}
            >
              {slides[current].button} →
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className="relative group"
          >
            <div className={`h-2.5 rounded-full transition-all duration-500 ${index === current
                ? "w-10 bg-gradient-to-r from-sky-400 to-indigo-400 shadow-lg shadow-sky-500/40"
                : "w-2.5 bg-white/30 hover:bg-white/50"
              }`} />
          </button>
        ))}
      </div>

      {/* Decorative Gradient Orbs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "3s" }} />
    </div>
  );
}
