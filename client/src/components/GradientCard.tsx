import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GradientCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export function GradientCard({
  children,
  className = "",
  delay = 0,
  hover = true,
}: GradientCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      whileHover={hover ? { y: -8 } : {}}
      className={`relative group ${className}`}
    >
      {/* Gradient Border */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00D9FF] via-[#6A0572] to-[#FF006E] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg" />

      {/* Card Content */}
      <div className="relative bg-white rounded-xl p-6 shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
        {children}
      </div>
    </motion.div>
  );
}
