"use client";

import { motion } from "framer-motion";

interface MultipleChoiceProps {
  options: { id: string; label: string; number: string }[];
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export default function MultipleChoice({
  options,
  onSelect,
  disabled,
}: MultipleChoiceProps) {
  return (
    <div className="w-full z-20 h-56 lg:h-full overflow-y-auto scrollbar-thin scrollbar-thumb-black/50 scrollbar-track-transparent">
      <div className="space-y-5 flex flex-col items-center lg:justify-center h-full w-full max-w-[340px] mx-auto p-1">
        {options.map((option, index) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(option.id)}
            disabled={disabled}
            className="w-full max-w-[340px] text-left px-3.5 py-2 bg-black/50 lg:bg-white/10 rounded-full transition-all duration-300 disabled:opacity-50  disabled:cursor-not-allowed shadow-lg hover:border-white border-2 border-transparent group"
          >
            <div className="flex gap-4 items-center">
              <div>
                <div className="bg-white text-black rounded-full border-2 h-8 w-8 flex items-center justify-center text-center">
                  {option.number}
                </div>
              </div>
              <span className="text-white font-sans text-lg ">
                {option.label}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
