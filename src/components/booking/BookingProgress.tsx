import { motion } from "framer-motion";
import { Check, MapPin, Building2, Scissors, User, Calendar, Sparkles } from "lucide-react";
import { BookingStep } from "@/hooks/useBooking";
import { cn } from "@/lib/utils";

interface BookingProgressProps {
  currentStep: BookingStep;
  currentStepIndex: number;
  onStepClick: (step: BookingStep) => void;
}

const steps: { key: BookingStep; label: string; icon: React.ElementType }[] = [
  { key: "city", label: "City", icon: MapPin },
  { key: "salon", label: "Salon", icon: Building2 },
  { key: "service", label: "Service", icon: Scissors },
  { key: "staff", label: "Stylist", icon: User },
  { key: "datetime", label: "Date & Time", icon: Calendar },
  { key: "confirmation", label: "Confirm", icon: Sparkles },
];

export const BookingProgress = ({
  currentStep,
  currentStepIndex,
  onStepClick,
}: BookingProgressProps) => {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto px-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = step.key === currentStep;
          const isClickable = index < currentStepIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex items-center">
              <button
                onClick={() => isClickable && onStepClick(step.key)}
                disabled={!isClickable}
                className={cn(
                  "flex flex-col items-center gap-2 transition-all duration-300",
                  isClickable && "cursor-pointer hover:opacity-80",
                  !isClickable && !isCurrent && "opacity-40"
                )}
              >
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted
                      ? "hsl(var(--primary))"
                      : isCurrent
                      ? "hsl(var(--primary))"
                      : "hsl(var(--muted))",
                  }}
                  className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center",
                    "transition-colors duration-300"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-primary-foreground" />
                  ) : (
                    <Icon
                      className={cn(
                        "w-5 h-5",
                        isCurrent ? "text-primary-foreground" : "text-muted-foreground"
                      )}
                    />
                  )}
                </motion.div>
                <span
                  className={cn(
                    "text-xs font-medium hidden md:block",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </button>

              {index < steps.length - 1 && (
                <div className="w-8 md:w-16 lg:w-24 h-px mx-2 relative">
                  <div className="absolute inset-0 bg-border" />
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: index < currentStepIndex ? 1 : 0 }}
                    className="absolute inset-0 bg-primary origin-left"
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
