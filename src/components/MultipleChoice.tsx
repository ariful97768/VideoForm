"use client";

import { motion } from "framer-motion";
import ContactForm from "./ContactForm";

interface MultipleChoiceProps {
  options: { id: string; label: string }[];
  onSelect: (value: string) => void;
  disabled?: boolean;
  isForm?: boolean;
}

export default function MultipleChoice({
  options,
  onSelect,
  disabled,
}: MultipleChoiceProps) {
  return (
    <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-accent/50 scrollbar-track-transparent">
      <div className="space-y-3 flex flex-col justify-center items-center h-full w-full max-w-[340px] mx-auto p-1">
        {options.map((option, index) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(option.id)}
            disabled={disabled}
            className="w-full max-w-[340px] text-left px-8 py-1.5 bg-white/10 backdrop-blur-sm rounded-full   transition-all duration-300 disabled:opacity-50  disabled:cursor-not-allowed shadow-lg hover:border-white border-2 border-transparent group"
          >
            <span className="text-white font-sans text-lg tracking-wide transition-colors">
              {option.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
