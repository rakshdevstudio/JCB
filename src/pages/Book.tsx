import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { BookingProgress } from "@/components/booking/BookingProgress";
import { CityStep } from "@/components/booking/CityStep";
import { SalonStep } from "@/components/booking/SalonStep";
import { ServiceStep } from "@/components/booking/ServiceStep";
import { StaffStep } from "@/components/booking/StaffStep";
import { DateTimeStep } from "@/components/booking/DateTimeStep";
import { ConfirmationStep } from "@/components/booking/ConfirmationStep";
import { useBooking } from "@/hooks/useBooking";

const Book = () => {
  const {
    currentStep,
    bookingData,
    currentStepIndex,
    selectCity,
    selectSalon,
    selectService,
    selectStaff,
    selectDateTime,
    goBack,
    goToStep,
    resetBooking,
    canGoBack,
  } = useBooking();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20">
        {/* Header */}
        <div className="bg-gradient-to-b from-muted/50 to-background border-b border-border">
          <div className="container mx-auto px-6 lg:px-12 py-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {canGoBack ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goBack}
                    className="p-2 bg-card border border-border hover:border-primary/50 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                  </motion.button>
                ) : (
                  <Link to="/">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-card border border-border hover:border-primary/50 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-foreground" />
                    </motion.button>
                  </Link>
                )}
                <div>
                  <h1 className="text-2xl md:text-3xl font-serif text-foreground">
                    Book Appointment
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Schedule your luxury salon experience
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <BookingProgress
              currentStep={currentStep}
              currentStepIndex={currentStepIndex}
              onStepClick={goToStep}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="container mx-auto px-6 lg:px-12 py-12">
          <AnimatePresence mode="wait">
            {currentStep === "city" && (
              <CityStep key="city" onSelect={selectCity} />
            )}

            {currentStep === "salon" && bookingData.city && (
              <SalonStep
                key="salon"
                city={bookingData.city}
                onSelect={selectSalon}
              />
            )}

            {currentStep === "service" && (
              <ServiceStep key="service" onSelect={selectService} />
            )}

            {currentStep === "staff" && bookingData.salon && (
              <StaffStep
                key="staff"
                salon={bookingData.salon}
                onSelect={selectStaff}
              />
            )}

            {currentStep === "datetime" &&
              bookingData.salon &&
              bookingData.service && (
                <DateTimeStep
                  key="datetime"
                  salon={bookingData.salon}
                  service={bookingData.service}
                  onSelect={selectDateTime}
                />
              )}

            {currentStep === "confirmation" && (
              <ConfirmationStep
                key="confirmation"
                bookingData={bookingData}
                onReset={resetBooking}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Book;
