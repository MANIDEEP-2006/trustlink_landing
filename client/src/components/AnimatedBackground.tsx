import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  variant?: "hero" | "section" | "cta";
}

export function AnimatedBackground({ variant = "section" }: AnimatedBackgroundProps) {
  if (variant === "hero") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Large gradient orbs */}
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-[#00D9FF]/20 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-[#FF006E]/20 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
      </div>
    );
  }

  if (variant === "cta") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180] }}
          transition={{ duration: 8, repeat: Infinity as any }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [180, 90, 0] }}
          transition={{ duration: 8, repeat: Infinity as any }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute top-1/4 left-1/3 w-64 h-64 bg-gradient-to-br from-[#6A0572]/10 to-transparent rounded-full blur-2xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />
    </div>
  );
}
