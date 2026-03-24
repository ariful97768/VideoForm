"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ContinueButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function ContinueButton({
  onClick,
  disabled,
}: ContinueButtonProps) {
  const [canContinue, setCanContinue] = useState(5);
  // 5-second delay logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCanContinue((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  // if (!canContinue) return null;

  return (
    <div className="h-full w-full flex flex-col">
      <div
        // ={canContinue === 0}
        className={`${
          canContinue === 0 ? "invisible" : ""
        } text-lg font-medium text-white/80`}
      >
        Interagissez en {canContinue}s
      </div>
      <motion.button
        onClick={onClick}
        disabled={disabled || canContinue > 0}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
        className="px-20 w-full my-auto py-5 bg-white 
               text-black font-sans text-xl font-semibold uppercase
               disabled:bg-opacity-10 disabled:text-opacity-50 disabled:cursor-not-allowed lg:max-w-sm mx-auto
               transition-all duration-300 shadow-2xl  
               flex items-center justify-center"
      >
        <span>Continuer</span>
      </motion.button>
    </div>
  );
}
