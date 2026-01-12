import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface City {
  id: string;
  name: string;
  state: string;
  country: string;
  is_active: boolean;
}

export interface Salon {
  id: string;
  city_id: string;
  name: string;
  area: string;
  address: string;
  phone: string | null;
  email: string | null;
  rating: number | null;
  review_count: number | null;
  image_url: string | null;
  open_time: string;
  close_time: string;
  is_active: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string | null;
  display_order: number | null;
  is_active: boolean;
}

export interface Service {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  duration: number;
  base_price: number;
  is_active: boolean;
}

export interface Staff {
  id: string;
  salon_id: string;
  name: string;
  role: string;
  specialties: string[] | null;
  rating: number | null;
  review_count: number | null;
  image_url: string | null;
  experience: string | null;
  is_active: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

// Fetch all active cities
export const useCities = () => {
  return useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      return data as City[];
    },
  });
};

// Fetch salons by city
export const useSalonsByCity = (cityId: string | null) => {
  return useQuery({
    queryKey: ["salons", cityId],
    queryFn: async () => {
      if (!cityId) return [];
      
      const { data, error } = await supabase
        .from("salons")
        .select("*")
        .eq("city_id", cityId)
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      return data as Salon[];
    },
    enabled: !!cityId,
  });
};

// Fetch service categories
export const useServiceCategories = () => {
  return useQuery({
    queryKey: ["service_categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      return data as ServiceCategory[];
    },
  });
};

// Fetch services
export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      return data as Service[];
    },
  });
};

// Fetch staff by salon
export const useStaffBySalon = (salonId: string | null) => {
  return useQuery({
    queryKey: ["staff", salonId],
    queryFn: async () => {
      if (!salonId) return [];
      
      const { data, error } = await supabase
        .from("staff")
        .select("*")
        .eq("salon_id", salonId)
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      return data as Staff[];
    },
    enabled: !!salonId,
  });
};

// Fetch existing bookings for a date to check availability
export const useBookingsForDate = (salonId: string | null, date: string | null) => {
  return useQuery({
    queryKey: ["bookings", salonId, date],
    queryFn: async () => {
      if (!salonId || !date) return [];
      
      const { data, error } = await supabase
        .from("bookings")
        .select("booking_time, duration, staff_id")
        .eq("salon_id", salonId)
        .eq("booking_date", date)
        .in("status", ["pending", "confirmed"]);

      if (error) throw error;
      return data;
    },
    enabled: !!salonId && !!date,
  });
};

// Generate available time slots
export const generateTimeSlots = (
  openTime: string,
  closeTime: string,
  serviceDuration: number,
  bookedSlots: { booking_time: string; duration: number }[] = []
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  
  // Parse times (format: "HH:MM:SS" or "HH:MM")
  const parseTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };
  
  const openMinutes = parseTime(openTime);
  const closeMinutes = parseTime(closeTime);
  
  // Generate 30-minute slots
  for (let minutes = openMinutes; minutes < closeMinutes; minutes += 30) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const timeString = `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
    
    // Check if slot overlaps with any booking
    const isBooked = bookedSlots.some((booking) => {
      const bookingStart = parseTime(booking.booking_time);
      const bookingEnd = bookingStart + booking.duration;
      const slotStart = minutes;
      const slotEnd = minutes + serviceDuration;
      
      return slotStart < bookingEnd && slotEnd > bookingStart;
    });
    
    slots.push({
      time: timeString,
      available: !isBooked,
    });
  }
  
  return slots;
};

// Count salons by city
export const useSalonCounts = () => {
  return useQuery({
    queryKey: ["salon_counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("salons")
        .select("city_id")
        .eq("is_active", true);

      if (error) throw error;
      
      // Count salons per city
      const counts: Record<string, number> = {};
      data.forEach((salon) => {
        counts[salon.city_id] = (counts[salon.city_id] || 0) + 1;
      });
      
      return counts;
    },
  });
};
