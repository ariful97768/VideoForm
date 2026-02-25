"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel";
  placeholder?: string;
  required?: boolean;
}

interface ContactFormProps {
  fields: FormField[];
  onSubmit: (data: { [key: string]: string }) => void;
  disabled?: boolean;
}

export default function ContactForm({
  fields,
  onSubmit,
  disabled,
}: ContactFormProps) {
  const [formData, setFormData] = useState<{ [key: string]: string }>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {}),
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (field: FormField, value: string): string => {
    if (field.required && !value.trim()) {
      return "Ce champ est requis";
    }

    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Email invalide";
      }
    }

    if (field.type === "tel" && value) {
      const phoneRegex = /^[\d\s+()-]+$/;
      if (!phoneRegex.test(value)) {
        return "Numéro de téléphone invalide";
      }
    }

    return "";
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    fields.forEach((field) => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="w-full h-full flex flex-col justify-center space-y-5 max-w-[640px] mx-auto"
    >
      <h2 className="text-xl text-white/90 font-normal! mb-8">
        Avant la prochaine question, quels sont tes coordonnées afin que nous
        puissions te recontacter ?
      </h2>
      {fields.map((field, index) => (
        <motion.div
          key={field.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          className="space-y-2"
        >
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={formData[field.name]}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            className={`w-full pb-3 bg-transparent backdrop-blur-sm border-b-2 
                     text-white placeholder-white/50 font-sans text-lg outline-none focus:outline-none ring-0
                     focus:bg-transparent transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed
                     ${errors[field.name] ? "border-red-400 focus:border-red-400" : "border-white/20 focus:border-white"}`}
          />

          {errors[field.name] && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-300 text-sm ml-2"
            >
              {errors[field.name]}
            </motion.p>
          )}
        </motion.div>
      ))}

      <motion.button
        type="submit"
        disabled={disabled}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-5 md:px-20 py-5 mt-10 bg-white hover:bg-white/90
               text-black font-sans text-xl font-semibold 
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-all duration-300 shadow-xl  
                 flex items-center justify-center gap-3 group"
      >
        <span>Prochaine étape ⟶</span>
        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </motion.form>
  );
}
