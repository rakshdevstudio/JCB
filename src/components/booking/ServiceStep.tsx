import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scissors,
  Palette,
  Sparkles,
  Heart,
  Hand,
  Crown,
  Clock,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useServiceCategories, useServices, Service, ServiceCategory } from "@/hooks/useBookingData";
import { cn } from "@/lib/utils";

interface ServiceStepProps {
  onSelect: (service: Service) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Scissors,
  Palette,
  Sparkles,
  Heart,
  Hand,
  Crown,
};

export const ServiceStep = ({ onSelect }: ServiceStepProps) => {
  const { data: categories, isLoading: categoriesLoading } = useServiceCategories();
  const { data: services, isLoading: servicesLoading } = useServices();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const isLoading = categoriesLoading || servicesLoading;

  // Set default category when data loads
  if (categories && categories.length > 0 && !selectedCategory) {
    setSelectedCategory(categories[0].id);
  }

  const filteredServices = services?.filter(
    (s) => s.category_id === selectedCategory
  ) || [];

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
          <Scissors className="w-4 h-4 text-primary" />
          <span className="text-xs uppercase tracking-[0.2em] text-primary">
            Step 3 of 6
          </span>
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
          Choose Your Service
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Select from our premium range of beauty and wellness services
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories?.map((category) => {
          const Icon = iconMap[category.icon || "Sparkles"] || Sparkles;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-300",
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredServices.map((service, index) => (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(service)}
              className="group relative p-6 bg-card border border-border hover:border-primary/50 transition-all duration-500 text-left hover:shadow-elevated"
            >
              <div className="flex flex-col h-full">
                <h3 className="text-lg font-serif text-foreground mb-2 group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  {service.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration} min</span>
                    </div>
                    <div className="text-lg font-semibold text-foreground">
                      ₹{Number(service.base_price).toLocaleString("en-IN")}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
