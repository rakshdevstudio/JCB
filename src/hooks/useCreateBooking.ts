import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CreateBookingData {
  salonId: string;
  serviceId: string;
  staffId: string | null;
  bookingDate: string;
  bookingTime: string;
  duration: number;
  price: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes?: string;
}

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: async (data: CreateBookingData) => {
      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: booking, error } = await supabase
        .from("bookings")
        .insert({
          user_id: user?.id || null,
          salon_id: data.salonId,
          service_id: data.serviceId,
          staff_id: data.staffId,
          booking_date: data.bookingDate,
          booking_time: data.bookingTime,
          duration: data.duration,
          price: data.price,
          customer_name: data.customerName,
          customer_phone: data.customerPhone,
          customer_email: data.customerEmail,
          notes: data.notes,
          status: "pending",
          booking_reference: "TEMP", // Will be overwritten by trigger
        })
        .select()
        .single();

      if (error) throw error;
      return booking;
    },
  });
};
