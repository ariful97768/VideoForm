"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VideoPlayer from "./VideoPlayer";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}
import MultipleChoice from "./MultipleChoice";
import TextInput from "./TextInput";
import ContactForm from "./ContactForm";
import ContinueButton from "./ContinueButton";
import CompletionScreen from "./CompletionScreen";
import { FormStep as FormStepType, FormData } from "@/types/form";
import { formSteps } from "@/config/formSteps";

const STORAGE_KEY = "video-form-progress";
const SESSION_ID = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export default function FormContainer() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [videoTime, setVideoTime] = useState(0);
  const [canContinue, setCanContinue] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUserUnmuted, setHasUserUnmuted] = useState(false);
  const isDesktop = useIsDesktop();

  const currentStep = formSteps[currentStepIndex];
  const isLastStep = currentStepIndex === formSteps.length - 1;

  // Load saved progress from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { stepIndex, data } = JSON.parse(saved);
        setCurrentStepIndex(stepIndex);
        setFormData(data);
      } catch (e) {
        console.error("Failed to load saved progress:", e);
      }
    }
  }, []);

  // Save progress to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ stepIndex: currentStepIndex, data: formData }),
    );
  }, [currentStepIndex, formData]);

  // 5-second delay logic
  useEffect(() => {
    setCanContinue(false);
    setVideoTime(0);

    const timer = setTimeout(() => {
      setCanContinue(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentStepIndex]);

  // Submit data to backend
  const submitToBackend = async (finalData: FormData) => {
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...finalData,
          sessionId: SESSION_ID,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      // Clear saved progress
      sessionStorage.removeItem(STORAGE_KEY);

      return await response.json();
    } catch (error) {
      console.error("Error submitting form:", error);
      throw error;
    }
  };

  const handleNextStep = useCallback(() => {
    if (currentStepIndex < formSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [currentStepIndex]);

  const handleMultipleChoiceSelect = async (
    fieldName: string,
    value: string,
  ) => {
    const newData = { ...formData, [fieldName]: value };
    setFormData(newData);

    // If this is the last data-collecting step, submit before moving to completion
    if (currentStepIndex === formSteps.length - 2) {
      setIsSubmitting(true);
      try {
        await submitToBackend(newData);
      } catch (error) {
        alert("Erreur lors de la soumission. Veuillez réessayer.");
        return;
      } finally {
        setIsSubmitting(false);
      }
    }

    handleNextStep();
  };

  const handleTextInputSubmit = async (fieldName: string, value: string) => {
    const newData = { ...formData, [fieldName]: value };
    setFormData(newData);

    if (currentStepIndex === formSteps.length - 2) {
      setIsSubmitting(true);
      try {
        await submitToBackend(newData);
      } catch (error) {
        alert("Erreur lors de la soumission. Veuillez réessayer.");
        return;
      } finally {
        setIsSubmitting(false);
      }
    }

    handleNextStep();
  };

  const handleFormSubmit = async (data: { [key: string]: string }) => {
    const newData = { ...formData, ...data };
    setFormData(newData);

    setIsSubmitting(true);
    try {
      await submitToBackend(newData);
      handleNextStep();
    } catch (error) {
      alert("Erreur lors de la soumission. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    if (!currentStep) return null;

    switch (currentStep.type) {
      case "info":
        return (
          <div className="flex items-center justify-center h-full">
            <ContinueButton
              onClick={handleNextStep}
              visible={canContinue}
              disabled={isSubmitting}
            />
          </div>
        );

      case "multiple-choice":
        return (
          <MultipleChoice
            options={currentStep.options}
            onSelect={(value) =>
              handleMultipleChoiceSelect(currentStep.fieldName, value)
            }
            disabled={!canContinue || isSubmitting}
          />
        );

      case "text-input":
        return (
          <TextInput
            placeholder={currentStep.placeholder}
            inputType={currentStep.inputType}
            onSubmit={(value) =>
              handleTextInputSubmit(currentStep.fieldName, value)
            }
            disabled={!canContinue || isSubmitting}
          />
        );

      case "form":
        return (
          <ContactForm
            fields={currentStep.fields}
            onSubmit={handleFormSubmit}
            disabled={!canContinue || isSubmitting}
          />
        );

      case "completion":
        return (
          <CompletionScreen
            title={currentStep.title}
            message={currentStep.message}
            calendarUrl={process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_URL}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      {/* Desktop Layout - Split Screen */}
      <div className="hidden lg:grid lg:grid-cols-2 h-full">
        {/* Left Pane - Video */}
        <div className="relative">
          {isDesktop && (
            <VideoPlayer
              videoUrl={currentStep.videoUrl}
              onTimeUpdate={setVideoTime}
              hasUserUnmuted={hasUserUnmuted}
              onUnmute={() => setHasUserUnmuted(true)}
            />
          )}

          {/* Question Overlay */}
          {currentStep.question && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute top-12 left-12 max-w-xl"
            >
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-white leading-tight drop-shadow-2xl">
                {currentStep.question}
              </h2>
            </motion.div>
          )}
        </div>

        {/* Right Pane - Interactions */}
        <div className="bg-[rgb(59,10,10)] flex flex-col items-center justify-center p-12">
          <div className="w-full h-full max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
              className="h-full"
                key={currentStepIndex}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.4 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Full Screen with Overlays */}
      <div className="lg:hidden relative h-full">
        {isDesktop === false && (
          <VideoPlayer
            videoUrl={currentStep.videoUrl}
            onTimeUpdate={setVideoTime}
            hasUserUnmuted={hasUserUnmuted}
            onUnmute={() => setHasUserUnmuted(true)}
          />
        )}

        {/* Question Overlay - Top */}
        {currentStep.question && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight">
              {currentStep.question}
            </h2>
          </motion.div>
        )}

        {/* Interaction Overlay - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/80 to-transparent">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.4 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
