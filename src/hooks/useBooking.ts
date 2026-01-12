import { useState, useCallback } from "react";
import { City, Salon, Service, Staff } from "@/hooks/useBookingData";

export type BookingStep = "city" | "salon" | "service" | "staff" | "datetime" | "confirmation";

const STEPS: BookingStep[] = ["city", "salon", "service", "staff", "datetime", "confirmation"];

export interface BookingData {
  city: City | null;
  salon: Salon | null;
  service: Service | null;
  staff: Staff | null;
  date: Date | null;
  time: string | null;
}

export const useBooking = () => {
  const [currentStep, setCurrentStep] = useState<BookingStep>("city");
  const [bookingData, setBookingData] = useState<BookingData>({
    city: null,
    salon: null,
    service: null,
    staff: null,
    date: null,
    time: null,
  });

  const currentStepIndex = STEPS.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const selectCity = useCallback((city: City) => {
    setBookingData((prev) => ({
      ...prev,
      city,
      salon: null,
      staff: null,
    }));
    setCurrentStep("salon");
  }, []);

  const selectSalon = useCallback((salon: Salon) => {
    setBookingData((prev) => ({
      ...prev,
      salon,
      staff: null,
    }));
    setCurrentStep("service");
  }, []);

  const selectService = useCallback((service: Service) => {
    setBookingData((prev) => ({
      ...prev,
      service,
    }));
    setCurrentStep("staff");
  }, []);

  const selectStaff = useCallback((staff: Staff | null) => {
    setBookingData((prev) => ({
      ...prev,
      staff,
    }));
    setCurrentStep("datetime");
  }, []);

  const selectDateTime = useCallback((date: Date, time: string) => {
    setBookingData((prev) => ({
      ...prev,
      date,
      time,
    }));
    setCurrentStep("confirmation");
  }, []);

  const goBack = useCallback(() => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1]);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: BookingStep) => {
    const targetIndex = STEPS.indexOf(step);
    const currentIndex = STEPS.indexOf(currentStep);
    
    // Only allow going to previous steps
    if (targetIndex < currentIndex) {
      setCurrentStep(step);
    }
  }, [currentStep]);

  const resetBooking = useCallback(() => {
    setBookingData({
      city: null,
      salon: null,
      service: null,
      staff: null,
      date: null,
      time: null,
    });
    setCurrentStep("city");
  }, []);

  const canGoBack = currentStepIndex > 0 && currentStep !== "confirmation";

  return {
    currentStep,
    bookingData,
    progress,
    currentStepIndex,
    totalSteps: STEPS.length,
    selectCity,
    selectSalon,
    selectService,
    selectStaff,
    selectDateTime,
    goBack,
    goToStep,
    resetBooking,
    canGoBack,
  };
};
