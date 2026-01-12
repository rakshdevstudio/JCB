import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, Check } from "lucide-react";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Salon, Service, useBookingsForDate, generateTimeSlots, TimeSlot } from "@/hooks/useBookingData";
import { cn } from "@/lib/utils";

interface DateTimeStepProps {
  salon: Salon;
  service: Service;
  onSelect: (date: Date, time: string) => void;
}

export const DateTimeStep = ({ salon, service, onSelect }: DateTimeStepProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const today = startOfDay(new Date());
  const maxDate = addDays(today, 30); // Allow booking up to 30 days ahead

  const dateString = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const { data: existingBookings } = useBookingsForDate(salon.id, dateString);

  const timeSlots = useMemo(() => {
    if (!selectedDate || !salon.open_time || !salon.close_time) return [];
    
    const bookings = existingBookings?.map(b => ({
      booking_time: b.booking_time,
      duration: b.duration
    })) || [];
    
    return generateTimeSlots(
      salon.open_time,
      salon.close_time,
      service.duration,
      bookings
    );
  }, [selectedDate, salon, service, existingBookings]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onSelect(selectedDate, selectedTime);
    }
  };

  // Group time slots by period
  const morningSlots = timeSlots.filter((slot) => {
    const hour = parseInt(slot.time.split(":")[0]);
    return hour < 12;
  });

  const afternoonSlots = timeSlots.filter((slot) => {
    const hour = parseInt(slot.time.split(":")[0]);
    return hour >= 12 && hour < 17;
  });

  const eveningSlots = timeSlots.filter((slot) => {
    const hour = parseInt(slot.time.split(":")[0]);
    return hour >= 17;
  });

  const renderTimeSlots = (slots: TimeSlot[], label: string) => {
    if (slots.length === 0) return null;

    return (
      <div className="mb-6">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">{label}</h4>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {slots.map((slot) => (
            <button
              key={slot.time}
              onClick={() => slot.available && handleTimeSelect(slot.time)}
              disabled={!slot.available}
              className={cn(
                "px-3 py-2.5 text-sm font-medium transition-all duration-200",
                slot.available
                  ? selectedTime === slot.time
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:border-primary/50 text-foreground"
                  : "bg-muted text-muted-foreground cursor-not-allowed line-through opacity-50"
              )}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 mb-6"
        >
          <CalendarIcon className="w-4 h-4 text-primary" />
          <span className="text-xs uppercase tracking-[0.2em] text-primary">
            Step 5 of 6
          </span>
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
          Select Date & Time
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Choose your preferred appointment slot. Greyed out times are unavailable.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border p-6"
        >
          <h3 className="text-lg font-serif text-foreground mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Select Date
          </h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) =>
              isBefore(date, today) || isBefore(maxDate, date)
            }
            className="pointer-events-auto"
          />
        </motion.div>

        {/* Time Slots */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border p-6"
        >
          <h3 className="text-lg font-serif text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Select Time
          </h3>

          {selectedDate ? (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Available slots for{" "}
                <span className="text-foreground font-medium">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </span>
              </p>

              {timeSlots.length > 0 ? (
                <>
                  {renderTimeSlots(morningSlots, "Morning")}
                  {renderTimeSlots(afternoonSlots, "Afternoon")}
                  {renderTimeSlots(eveningSlots, "Evening")}
                </>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No available slots for this date.
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              <p>Please select a date first</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Confirm Button */}
      {selectedDate && selectedTime && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-4 bg-primary/5 border border-primary/20 mb-6">
            <div className="text-sm text-muted-foreground">
              Selected:{" "}
              <span className="text-foreground font-medium">
                {format(selectedDate, "EEE, MMM d")}
              </span>{" "}
              at{" "}
              <span className="text-foreground font-medium">{selectedTime}</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirm}
            className="px-10 py-4 bg-primary text-primary-foreground text-sm uppercase tracking-[0.2em] font-medium hover:shadow-luxury transition-all duration-500 flex items-center gap-3 mx-auto"
          >
            <Check className="w-4 h-4" />
            Confirm Time Slot
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};
