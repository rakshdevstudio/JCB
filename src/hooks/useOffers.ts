import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Offer {
  id: string;
  title: string;
  description: string | null;
  banner_image_url: string | null;
  start_date: string;
  end_date: string;
  discount_type: "percentage" | "flat";
  discount_value: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  offer_services?: { service_id: string; services?: { id: string; name: string } }[];
  offer_salons?: { salon_id: string; salons?: { id: string; name: string; area: string } }[];
  offer_cities?: { city_id: string; cities?: { id: string; name: string } }[];
}

export interface CreateOfferData {
  title: string;
  description?: string;
  banner_image_url?: string;
  start_date: string;
  end_date: string;
  discount_type: "percentage" | "flat";
  discount_value: number;
  is_featured?: boolean;
  is_active?: boolean;
  service_ids?: string[];
  salon_ids?: string[];
  city_ids?: string[];
}

// Fetch all offers for admin
export const useOffers = () => {
  return useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select(`
          *,
          offer_services(service_id, services(id, name)),
          offer_salons(salon_id, salons(id, name, area)),
          offer_cities(city_id, cities(id, name))
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Offer[];
    },
  });
};

// Fetch active offers for public page
export const useActiveOffers = (filters?: {
  cityId?: string | null;
  salonId?: string | null;
  serviceId?: string | null;
}) => {
  return useQuery({
    queryKey: ["active-offers", filters],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("offers")
        .select(`
          *,
          offer_services(service_id, services(id, name)),
          offer_salons(salon_id, salons(id, name, area, city_id)),
          offer_cities(city_id, cities(id, name))
        `)
        .eq("is_active", true)
        .lte("start_date", today)
        .gte("end_date", today)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Filter based on provided filters
      let filteredOffers = data as Offer[];

      if (filters?.cityId) {
        filteredOffers = filteredOffers.filter((offer) => {
          // Offer applies to this city directly
          const hasCity = offer.offer_cities?.some((oc: any) => oc.city_id === filters.cityId);
          // Or offer applies to a salon in this city
          const hasSalonInCity = offer.offer_salons?.some(
            (os: any) => os.salons?.city_id === filters.cityId
          );
          // If no cities or salons specified, it's a global offer
          const isGlobal = (!offer.offer_cities || offer.offer_cities.length === 0) && 
                          (!offer.offer_salons || offer.offer_salons.length === 0);
          return hasCity || hasSalonInCity || isGlobal;
        });
      }

      if (filters?.salonId) {
        filteredOffers = filteredOffers.filter((offer) => {
          const hasSalon = offer.offer_salons?.some((os: any) => os.salon_id === filters.salonId);
          const isGlobal = (!offer.offer_salons || offer.offer_salons.length === 0);
          return hasSalon || isGlobal;
        });
      }

      if (filters?.serviceId) {
        filteredOffers = filteredOffers.filter((offer) => {
          const hasService = offer.offer_services?.some((os: any) => os.service_id === filters.serviceId);
          const isGlobal = (!offer.offer_services || offer.offer_services.length === 0);
          return hasService || isGlobal;
        });
      }

      return filteredOffers;
    },
  });
};

// Get applicable offers for a booking
export const useApplicableOffers = (
  salonId: string | null,
  serviceId: string | null
) => {
  return useQuery({
    queryKey: ["applicable-offers", salonId, serviceId],
    queryFn: async () => {
      if (!salonId || !serviceId) return [];

      const today = new Date().toISOString().split("T")[0];

      // Get salon's city
      const { data: salonData } = await supabase
        .from("salons")
        .select("city_id")
        .eq("id", salonId)
        .single();

      const cityId = salonData?.city_id;

      const { data, error } = await supabase
        .from("offers")
        .select(`
          *,
          offer_services(service_id),
          offer_salons(salon_id),
          offer_cities(city_id)
        `)
        .eq("is_active", true)
        .lte("start_date", today)
        .gte("end_date", today);

      if (error) throw error;

      // Filter offers that apply to this booking
      const applicableOffers = (data as Offer[]).filter((offer) => {
        // Check if offer applies to this service
        const hasServiceRestriction = offer.offer_services && offer.offer_services.length > 0;
        const appliesToService = !hasServiceRestriction || 
          offer.offer_services?.some((os) => os.service_id === serviceId);

        // Check if offer applies to this salon
        const hasSalonRestriction = offer.offer_salons && offer.offer_salons.length > 0;
        const appliesToSalon = !hasSalonRestriction ||
          offer.offer_salons?.some((os) => os.salon_id === salonId);

        // Check if offer applies to this city
        const hasCityRestriction = offer.offer_cities && offer.offer_cities.length > 0;
        const appliesToCity = !hasCityRestriction ||
          offer.offer_cities?.some((oc) => oc.city_id === cityId);

        return appliesToService && appliesToSalon && appliesToCity;
      });

      return applicableOffers;
    },
    enabled: !!salonId && !!serviceId,
  });
};

// Create offer mutation
export const useCreateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOfferData) => {
      const { service_ids, salon_ids, city_ids, ...offerData } = data;

      // Create the offer
      const { data: offer, error: offerError } = await supabase
        .from("offers")
        .insert(offerData)
        .select()
        .single();

      if (offerError) throw offerError;

      // Add service relationships
      if (service_ids && service_ids.length > 0) {
        const { error: serviceError } = await supabase
          .from("offer_services")
          .insert(service_ids.map((id) => ({ offer_id: offer.id, service_id: id })));
        if (serviceError) throw serviceError;
      }

      // Add salon relationships
      if (salon_ids && salon_ids.length > 0) {
        const { error: salonError } = await supabase
          .from("offer_salons")
          .insert(salon_ids.map((id) => ({ offer_id: offer.id, salon_id: id })));
        if (salonError) throw salonError;
      }

      // Add city relationships
      if (city_ids && city_ids.length > 0) {
        const { error: cityError } = await supabase
          .from("offer_cities")
          .insert(city_ids.map((id) => ({ offer_id: offer.id, city_id: id })));
        if (cityError) throw cityError;
      }

      return offer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["active-offers"] });
      toast.success("Offer created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create offer");
    },
  });
};

// Update offer mutation
export const useUpdateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateOfferData>;
    }) => {
      const { service_ids, salon_ids, city_ids, ...offerData } = data;

      // Update the offer
      if (Object.keys(offerData).length > 0) {
        const { error: offerError } = await supabase
          .from("offers")
          .update(offerData)
          .eq("id", id);
        if (offerError) throw offerError;
      }

      // Update service relationships if provided
      if (service_ids !== undefined) {
        await supabase.from("offer_services").delete().eq("offer_id", id);
        if (service_ids.length > 0) {
          const { error } = await supabase
            .from("offer_services")
            .insert(service_ids.map((sid) => ({ offer_id: id, service_id: sid })));
          if (error) throw error;
        }
      }

      // Update salon relationships if provided
      if (salon_ids !== undefined) {
        await supabase.from("offer_salons").delete().eq("offer_id", id);
        if (salon_ids.length > 0) {
          const { error } = await supabase
            .from("offer_salons")
            .insert(salon_ids.map((sid) => ({ offer_id: id, salon_id: sid })));
          if (error) throw error;
        }
      }

      // Update city relationships if provided
      if (city_ids !== undefined) {
        await supabase.from("offer_cities").delete().eq("offer_id", id);
        if (city_ids.length > 0) {
          const { error } = await supabase
            .from("offer_cities")
            .insert(city_ids.map((cid) => ({ offer_id: id, city_id: cid })));
          if (error) throw error;
        }
      }

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["active-offers"] });
      toast.success("Offer updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update offer");
    },
  });
};

// Delete offer mutation
export const useDeleteOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("offers").delete().eq("id", id);
      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["active-offers"] });
      toast.success("Offer deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete offer");
    },
  });
};

// Toggle offer active status
export const useToggleOfferStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("offers")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
      return { id, is_active };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["active-offers"] });
      toast.success(`Offer ${data.is_active ? "enabled" : "disabled"}`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update offer status");
    },
  });
};

// Calculate discount for a price
export const calculateDiscount = (
  price: number,
  discountType: "percentage" | "flat",
  discountValue: number
): { discountedPrice: number; savings: number } => {
  let savings = 0;
  if (discountType === "percentage") {
    savings = (price * discountValue) / 100;
  } else {
    savings = Math.min(discountValue, price);
  }
  return {
    discountedPrice: Math.max(0, price - savings),
    savings,
  };
};
