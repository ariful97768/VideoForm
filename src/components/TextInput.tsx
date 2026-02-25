"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface TextInputProps {
  placeholder?: string;
  inputType?: "text" | "textarea";
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

export default function TextInput({
  placeholder = "",
  inputType = "text",
  onSubmit,
  disabled,
}: TextInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSubmit(value.trim());
    }
  };

  const InputComponent = inputType === "textarea" ? "textarea" : "input";

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="w-full h-full flex flex-col justify-center space-y-5 max-w-[640px] mx-auto"
    >
      <div className="grow">
        <InputComponent
          type={inputType === "text" ? "text" : undefined}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={inputType === "textarea" ? 4 : undefined}
          className="w-full h-full px-6 py-5 pr-16 bg-transparent 
                   rounded-2xl text-white  font-sans text-lg
                   outline-none ring-0
                   focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                   resize-none"
        />
      </div>
      <div className="flex items-center justify-center">
        <motion.button
          type="submit"
          disabled={!value.trim() || disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mx-auto p-7 bg-[rgba(14,19,57,1)] rounded-full disabled:bg-gray-500/40 disabled:cursor-not-allowed  transition-all duration-300 shadow-lg"
        >
          <ArrowRight className="w-8 h-8 text-white" />
        </motion.button>
      </div>
    </motion.form>
  );
}
