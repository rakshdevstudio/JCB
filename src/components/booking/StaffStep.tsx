import { motion } from "framer-motion";
import { User, Star, Award, ChevronRight, Loader2 } from "lucide-react";
import { Salon, Staff, useStaffBySalon } from "@/hooks/useBookingData";

interface StaffStepProps {
  salon: Salon;
  onSelect: (staff: Staff | null) => void;
}

export const StaffStep = ({ salon, onSelect }: StaffStepProps) => {
  const { data: salonStaff, isLoading } = useStaffBySalon(salon.id);

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
          <User className="w-4 h-4 text-primary" />
          <span className="text-xs uppercase tracking-[0.2em] text-primary">
            Step 4 of 6
          </span>
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
          Choose Your Stylist
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Select your preferred stylist at{" "}
          <span className="text-primary font-medium">{salon.name}</span>, or let
          us assign the best available.
        </p>
      </div>

      {/* No Preference Option */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => onSelect(null)}
        className="group w-full p-6 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 mb-6 hover:shadow-elevated"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-serif text-foreground mb-1">
                No Preference
              </h3>
              <p className="text-sm text-muted-foreground">
                We'll assign the best available stylist for your service
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.button>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {salonStaff?.map((member, index) => (
          <motion.button
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index + 1) * 0.1 }}
            onClick={() => onSelect(member)}
            className="group relative bg-card border border-border hover:border-primary/50 transition-all duration-500 overflow-hidden hover:shadow-elevated text-left"
          >
            <div className="flex">
              {/* Image */}
              <div className="relative w-28 h-36 flex-shrink-0 overflow-hidden">
                <img
                  src={member.image_url || "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400"}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Content */}
              <div className="flex-1 p-4 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-serif text-foreground group-hover:text-primary transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm text-primary">{member.role}</p>
                  </div>
                  {member.rating && (
                    <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5">
                      <Star className="w-3 h-3 text-primary fill-primary" />
                      <span className="text-xs font-medium text-primary">
                        {member.rating}
                      </span>
                    </div>
                  )}
                </div>

                {member.experience && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <Award className="w-3 h-3" />
                    <span>{member.experience} experience</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1 mt-auto">
                  {member.specialties?.slice(0, 2).map((specialty) => (
                    <span
                      key={specialty}
                      className="text-xs px-2 py-0.5 bg-muted text-muted-foreground"
                    >
                      {specialty}
                    </span>
                  ))}
                  {(member.specialties?.length || 0) > 2 && (
                    <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground">
                      +{(member.specialties?.length || 0) - 2}
                    </span>
                  )}
                </div>

                {member.review_count && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {member.review_count} reviews
                  </p>
                )}
              </div>
            </div>

            {/* Hover arrow */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </motion.button>
        ))}
      </div>

      {(!salonStaff || salonStaff.length === 0) && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            No specific stylists available. Click "No Preference" to continue.
          </p>
        </div>
      )}
    </motion.div>
  );
};
