"use client";

import { motion } from "framer-motion";

interface ContinueButtonProps {
  onClick: () => void;
  disabled?: boolean;
  visible?: boolean;
}

export default function ContinueButton({
  onClick,
  disabled,
  visible = true,
}: ContinueButtonProps) {
  if (!visible) return null;

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-20 my-auto py-5 bg-white hover:bg-white/90
               text-black font-sans text-xl font-semibold uppercase
               disabled:opacity-50 disabled:cursor-not-allowed
               transition-all duration-300 shadow-2xl  
               flex items-center gap-4 group"
    >
      <span>Continuer</span>
    </motion.button>
  );
}
