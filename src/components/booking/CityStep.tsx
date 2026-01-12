import { motion } from "framer-motion";
import { MapPin, ChevronRight, Loader2 } from "lucide-react";
import { useCities, useSalonCounts, City } from "@/hooks/useBookingData";

interface CityStepProps {
  onSelect: (city: City) => void;
}

export const CityStep = ({ onSelect }: CityStepProps) => {
  const { data: cities, isLoading: citiesLoading } = useCities();
  const { data: salonCounts, isLoading: countsLoading } = useSalonCounts();

  const isLoading = citiesLoading || countsLoading;

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
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 mb-6"
        >
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-xs uppercase tracking-[0.2em] text-primary">
            Step 1 of 6
          </span>
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
          Select Your City
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Choose the city where you'd like to book your appointment. We have luxury salons across India.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cities?.map((city, index) => (
          <motion.button
            key={city.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(city)}
            className="group relative p-6 bg-card border border-border hover:border-primary/50 transition-all duration-500 text-left hover:shadow-elevated"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-serif text-foreground mb-1 group-hover:text-primary transition-colors">
                  {city.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {city.state}
                </p>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <MapPin className="w-4 h-4" />
                  <span>{salonCounts?.[city.id] || 0} Salons</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
