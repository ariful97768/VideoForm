"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, CheckCircle, X } from "lucide-react";

interface CompletionScreenProps {
  title: string;
  message: string;
  calendarUrl?: string;
}

export default function CompletionScreen({
  title,
  message,
  calendarUrl,
}: CompletionScreenProps) {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row">
      {/* Success Info Section */}
      <div className="flex flex-col lg:hidden items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8 max-w-2xl"
        >
          {/* Mobile-only: Open Calendar Button */}
          {calendarUrl && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => setShowCalendar(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden mt-8 px-5 w-full py-5 bg-white text-black font-sans text-lg font-semibold tracking-wide
                       transition-all duration-300 shadow-2xl
                       flex items-center gap-3 mx-auto group"
            >
              <Calendar className="w-6 h-6" />
              <span>Réservez une réunion</span>
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Desktop: Calendar inline on the right */}
      {calendarUrl && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="hidden lg:block w-full h-full bg-white rounded-md overflow-hidden shadow-2xl"
        >
          <iframe
            src={calendarUrl}
            className="w-full h-full border-0"
            title="Schedule Appointment"
          />
        </motion.div>
      )}

      {/* Mobile: Fullscreen Calendar Overlay */}
      <AnimatePresence>
        {showCalendar && calendarUrl && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCalendar(false)}
              className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="lg:hidden fixed inset-0 bg-white z-50 overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowCalendar(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full
                         shadow-lg transition-all duration-200 group"
              >
                <X className="w-6 h-6 text-gray-700 group-hover:text-primary transition-colors" />
              </button>

              <iframe
                src={calendarUrl}
                className="w-full h-full border-0"
                title="Schedule Appointment"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
