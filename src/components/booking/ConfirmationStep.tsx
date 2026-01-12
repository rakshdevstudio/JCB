import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  User,
  Scissors,
  Check,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { City, Salon, Service, Staff } from "@/hooks/useBookingData";
import { useCreateBooking } from "@/hooks/useCreateBooking";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface BookingData {
  city: City | null;
  salon: Salon | null;
  service: Service | null;
  staff: Staff | null;
  date: Date | null;
  time: string | null;
}

interface ConfirmationStepProps {
  bookingData: BookingData;
  onReset: () => void;
}

export const ConfirmationStep = ({ bookingData, onReset }: ConfirmationStepProps) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [bookingReference, setBookingReference] = useState<string | null>(null);

  const createBooking = useCreateBooking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!bookingData.salon || !bookingData.service || !bookingData.date || !bookingData.time) {
      toast.error("Missing booking information");
      return;
    }

    try {
      const result = await createBooking.mutateAsync({
        salonId: bookingData.salon.id,
        serviceId: bookingData.service.id,
        staffId: bookingData.staff?.id || null,
        bookingDate: format(bookingData.date, "yyyy-MM-dd"),
        bookingTime: bookingData.time,
        duration: bookingData.service.duration,
        price: Number(bookingData.service.base_price),
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
      });

      setBookingReference(result.booking_reference);
      toast.success("Booking confirmed! Check your email for details.");
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error(error.message || "Failed to create booking. Please try again.");
    }
  };

  if (bookingReference) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-100 flex items-center justify-center"
        >
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </motion.div>

        <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
          Booking Confirmed!
        </h2>
        <p className="text-muted-foreground mb-2 max-w-md mx-auto">
          Your booking reference is:
        </p>
        <p className="text-2xl font-mono text-primary font-bold mb-6">
          {bookingReference}
        </p>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          We've sent a confirmation email to{" "}
          <span className="text-foreground font-medium">{customerInfo.email}</span>{" "}
          with all your appointment details.
        </p>

        <div className="bg-card border border-border p-6 mb-8 text-left">
          <h3 className="text-lg font-serif text-foreground mb-4">
            Appointment Summary
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Salon</span>
              <span className="text-foreground font-medium">
                {bookingData.salon?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service</span>
              <span className="text-foreground font-medium">
                {bookingData.service?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date & Time</span>
              <span className="text-foreground font-medium">
                {bookingData.date && format(bookingData.date, "EEE, MMM d")} at{" "}
                {bookingData.time}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stylist</span>
              <span className="text-foreground font-medium">
                {bookingData.staff?.name || "Any Available"}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-border">
              <span className="text-foreground font-medium">Total</span>
              <span className="text-primary font-bold text-lg">
                ₹{Number(bookingData.service?.base_price).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-primary text-primary-foreground text-sm uppercase tracking-[0.2em] font-medium hover:shadow-luxury transition-all duration-500"
            >
              Back to Home
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReset}
            className="px-8 py-4 border border-border text-foreground text-sm uppercase tracking-[0.2em] font-medium hover:border-primary transition-all duration-500"
          >
            Book Another
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 mb-6"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs uppercase tracking-[0.2em] text-primary">
            Final Step
          </span>
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
          Confirm Your Booking
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Review your appointment details and complete your booking
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border p-6 h-fit"
        >
          <h3 className="text-lg font-serif text-foreground mb-6">
            Appointment Details
          </h3>

          <div className="space-y-4">
            {/* Salon */}
            <div className="flex items-start gap-4 pb-4 border-b border-border">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Salon</p>
                <p className="text-foreground font-medium">
                  {bookingData.salon?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {bookingData.salon?.area}, {bookingData.city?.name}
                </p>
              </div>
            </div>

            {/* Service */}
            <div className="flex items-start gap-4 pb-4 border-b border-border">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Scissors className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="text-foreground font-medium">
                  {bookingData.service?.name}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-muted-foreground">
                    {bookingData.service?.duration} minutes
                  </p>
                  <p className="text-primary font-semibold">
                    ₹{Number(bookingData.service?.base_price).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Stylist */}
            <div className="flex items-start gap-4 pb-4 border-b border-border">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stylist</p>
                <p className="text-foreground font-medium">
                  {bookingData.staff?.name || "Any Available Stylist"}
                </p>
                {bookingData.staff && (
                  <p className="text-sm text-muted-foreground">
                    {bookingData.staff.role}
                  </p>
                )}
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <p className="text-foreground font-medium">
                  {bookingData.date &&
                    format(bookingData.date, "EEEE, MMMM d, yyyy")}
                </p>
                <p className="text-primary font-medium flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {bookingData.time}
                </p>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-lg font-serif text-foreground">Total</span>
              <span className="text-2xl font-bold text-primary">
                ₹{Number(bookingData.service?.base_price).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Customer Info Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="bg-card border border-border p-6">
            <h3 className="text-lg font-serif text-foreground mb-6">
              Your Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={customerInfo.name}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, name: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, phone: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={customerInfo.email}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, email: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                You'll receive a confirmation email and SMS with appointment details.
              </p>
            </div>

            <motion.button
              type="submit"
              disabled={createBooking.isPending}
              whileHover={{ scale: createBooking.isPending ? 1 : 1.02 }}
              whileTap={{ scale: createBooking.isPending ? 1 : 0.98 }}
              className="w-full mt-6 px-8 py-4 bg-primary text-primary-foreground text-sm uppercase tracking-[0.2em] font-medium hover:shadow-luxury transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {createBooking.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Confirm Booking
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};
