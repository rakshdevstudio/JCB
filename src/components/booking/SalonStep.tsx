import { motion } from "framer-motion";
import { Building2, MapPin, Star, Clock, ChevronRight, Loader2 } from "lucide-react";
import { City, Salon, useSalonsByCity } from "@/hooks/useBookingData";

interface SalonStepProps {
  city: City;
  onSelect: (salon: Salon) => void;
}

export const SalonStep = ({ city, onSelect }: SalonStepProps) => {
  const { data: salons, isLoading } = useSalonsByCity(city.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

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
          <Building2 className="w-4 h-4 text-primary" />
          <span className="text-xs uppercase tracking-[0.2em] text-primary">
            Step 2 of 6
          </span>
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
          Choose Your Salon
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Select from our luxury salons in{" "}
          <span className="text-primary font-medium">{city.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {salons?.map((salon, index) => (
          <motion.button
            key={salon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(salon)}
            className="group relative bg-card border border-border hover:border-primary/50 transition-all duration-500 overflow-hidden hover:shadow-elevated text-left"
          >
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0 overflow-hidden">
                <img
                  src={salon.image_url || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800"}
                  alt={salon.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent md:bg-gradient-to-r" />
              </div>

              {/* Content */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-serif text-foreground mb-1 group-hover:text-primary transition-colors">
                      {salon.name}
                    </h3>
                    <p className="text-sm text-primary font-medium">
                      {salon.area}
                    </p>
                  </div>
                  {salon.rating && (
                    <div className="flex items-center gap-1 bg-primary/10 px-2 py-1">
                      <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                      <span className="text-sm font-medium text-primary">
                        {salon.rating}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{salon.address}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      {salon.open_time?.slice(0, 5)} - {salon.close_time?.slice(0, 5)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-primary group-hover:translate-x-1 transition-transform">
                    <span>Select</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {salon.review_count && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {salon.review_count} reviews
                  </p>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {(!salons || salons.length === 0) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No salons found in this city. Please select another city.
          </p>
        </div>
      )}
    </motion.div>
  );
};
