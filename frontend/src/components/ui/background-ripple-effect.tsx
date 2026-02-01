"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export const BackgroundRippleEffect: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      
      {/* Ripple circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-primary/20"
            initial={{ width: 100, height: 100, opacity: 0 }}
            animate={{
              width: [100 + i * 150, 800 + i * 200],
              height: [100 + i * 150, 800 + i * 200],
              opacity: [0.4, 0],
            }}
            transition={{
              duration: 4,
              delay: i * 1,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Static gradient rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[300px] w-[300px] rounded-full bg-gradient-to-r from-primary/5 to-primary/10 blur-3xl" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-primary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BackgroundRippleEffect;
