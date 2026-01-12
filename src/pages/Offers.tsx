import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import {
  Tag,
  Calendar,
  MapPin,
  Building2,
  Scissors,
  Star,
  Filter,
  X,
} from "lucide-react";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useActiveOffers, Offer } from "@/hooks/useOffers";
import { useCities } from "@/hooks/useBookingData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Offers = () => {
  const [cityFilter, setCityFilter] = useState<string | null>(null);
  const [salonFilter, setSalonFilter] = useState<string | null>(null);

  const { data: cities } = useCities();
  const { data: offers, isLoading } = useActiveOffers({
    cityId: cityFilter,
    salonId: salonFilter,
  });

  // Fetch salons based on city filter
  const { data: salons } = useQuery({
    queryKey: ["salons-for-filter", cityFilter],
    queryFn: async () => {
      let query = supabase
        .from("salons")
        .select("id, name, area")
        .eq("is_active", true)
        .order("name");
      
      if (cityFilter) {
        query = query.eq("city_id", cityFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const featuredOffers = offers?.filter((o) => o.is_featured) || [];
  const regularOffers = offers?.filter((o) => !o.is_featured) || [];

  const clearFilters = () => {
    setCityFilter(null);
    setSalonFilter(null);
  };

  const hasFilters = cityFilter || salonFilter;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="relative py-16 lg:py-24 bg-gradient-to-b from-luxury-cream/50 to-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="text-sm tracking-widest text-primary uppercase mb-4 block">
                Exclusive Offers
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-6">
                Special Promotions
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover exclusive offers and seasonal promotions across all Jean-Claude Biguine salons.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border bg-card/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="w-4 h-4" />
                <span>Filter by:</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Select
                  value={cityFilter || "all"}
                  onValueChange={(v) => {
                    setCityFilter(v === "all" ? null : v);
                    setSalonFilter(null);
                  }}
                >
                  <SelectTrigger className="w-[180px] bg-background">
                    <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities?.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={salonFilter || "all"}
                  onValueChange={(v) => setSalonFilter(v === "all" ? null : v)}
                >
                  <SelectTrigger className="w-[220px] bg-background">
                    <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="All Salons" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Salons</SelectItem>
                    {salons?.map((salon) => (
                      <SelectItem key={salon.id} value={salon.id}>
                        {salon.name} - {salon.area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {hasFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-2xl h-96 animate-pulse"
                  />
                ))}
              </div>
            ) : offers?.length === 0 ? (
              <div className="text-center py-20">
                <Tag className="w-16 h-16 text-muted-foreground/50 mx-auto mb-6" />
                <h3 className="text-2xl font-serif text-foreground mb-3">
                  No Active Offers
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  {hasFilters
                    ? "No offers match your filters. Try adjusting your selection."
                    : "Check back soon for exclusive promotions and seasonal offers."}
                </p>
                {hasFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Featured Offers */}
                {featuredOffers.length > 0 && (
                  <div className="mb-16">
                    <h2 className="text-2xl font-serif text-foreground mb-8 flex items-center gap-3">
                      <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                      Featured Offers
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {featuredOffers.map((offer, index) => (
                        <FeaturedOfferCard key={offer.id} offer={offer} index={index} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Regular Offers */}
                {regularOffers.length > 0 && (
                  <div>
                    {featuredOffers.length > 0 && (
                      <h2 className="text-2xl font-serif text-foreground mb-8">
                        All Offers
                      </h2>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <AnimatePresence mode="popLayout">
                        {regularOffers.map((offer, index) => (
                          <OfferCard key={offer.id} offer={offer} index={index} />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-luxury-champagne/20 to-luxury-cream/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
              Ready to Book?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Experience luxury hair care at any of our 50+ salons across India.
              Your offers will be automatically applied.
            </p>
            <Button asChild size="lg" className="px-8">
              <Link to="/book">Book Appointment</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

// Featured Offer Card (Larger)
const FeaturedOfferCard = ({ offer, index }: { offer: Offer; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500"
  >
    {/* Banner */}
    <div className="relative h-56 lg:h-64 bg-gradient-to-br from-luxury-champagne to-luxury-cream">
      {offer.banner_image_url ? (
        <img
          src={offer.banner_image_url}
          alt={offer.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Tag className="w-20 h-20 text-primary/30" />
        </div>
      )}
      
      {/* Discount Badge */}
      <div className="absolute top-4 left-4">
        <div className="bg-primary text-primary-foreground font-bold text-xl px-5 py-2 rounded-full shadow-lg">
          {offer.discount_type === "percentage"
            ? `${offer.discount_value}% OFF`
            : `₹${offer.discount_value} OFF`}
        </div>
      </div>

      {/* Featured Badge */}
      <div className="absolute top-4 right-4">
        <div className="bg-yellow-400 text-yellow-900 p-2 rounded-full">
          <Star className="w-5 h-5 fill-current" />
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="p-6 lg:p-8">
      <h3 className="text-xl lg:text-2xl font-serif text-foreground mb-3">
        {offer.title}
      </h3>
      
      {offer.description && (
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {offer.description}
        </p>
      )}

      {/* Valid Until */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Calendar className="w-4 h-4" />
        <span>
          Valid until {format(new Date(offer.end_date), "MMMM d, yyyy")}
        </span>
      </div>

      {/* Applicable To */}
      <div className="flex flex-wrap gap-2 mb-6">
        {offer.offer_services?.slice(0, 3).map((os: any) => (
          <Badge key={os.service_id} variant="secondary" className="gap-1">
            <Scissors className="w-3 h-3" />
            {os.services?.name}
          </Badge>
        ))}
        {(offer.offer_services?.length || 0) > 3 && (
          <Badge variant="secondary">
            +{(offer.offer_services?.length || 0) - 3} more
          </Badge>
        )}
        {(!offer.offer_services || offer.offer_services.length === 0) && (
          <Badge variant="secondary">All Services</Badge>
        )}
      </div>

      <Button asChild className="w-full" size="lg">
        <Link to="/book">Book Now & Save</Link>
      </Button>
    </div>
  </motion.div>
);

// Regular Offer Card
const OfferCard = ({ offer, index }: { offer: Offer; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    layout
    className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
  >
    {/* Banner */}
    <div className="relative h-40 bg-gradient-to-br from-luxury-champagne/50 to-luxury-cream/50">
      {offer.banner_image_url ? (
        <img
          src={offer.banner_image_url}
          alt={offer.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Tag className="w-12 h-12 text-primary/20" />
        </div>
      )}

      {/* Discount Badge */}
      <div className="absolute top-3 left-3">
        <Badge className="bg-primary text-primary-foreground font-bold text-base px-3 py-1">
          {offer.discount_type === "percentage"
            ? `${offer.discount_value}% OFF`
            : `₹${offer.discount_value} OFF`}
        </Badge>
      </div>
    </div>

    {/* Content */}
    <div className="p-5">
      <h3 className="font-semibold text-foreground mb-2 line-clamp-1">
        {offer.title}
      </h3>

      {offer.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {offer.description}
        </p>
      )}

      {/* Valid Until */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <Calendar className="w-3.5 h-3.5" />
        <span>Until {format(new Date(offer.end_date), "MMM d, yyyy")}</span>
      </div>

      {/* Applicable Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {offer.offer_cities?.slice(0, 2).map((oc: any) => (
          <Badge key={oc.city_id} variant="outline" className="text-xs">
            {oc.cities?.name}
          </Badge>
        ))}
        {offer.offer_salons?.slice(0, 2).map((os: any) => (
          <Badge key={os.salon_id} variant="outline" className="text-xs">
            {os.salons?.name}
          </Badge>
        ))}
        {(
          (offer.offer_cities?.length || 0) +
          (offer.offer_salons?.length || 0)
        ) === 0 && (
          <Badge variant="outline" className="text-xs">All Locations</Badge>
        )}
      </div>

      <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <Link to="/book">Book Now</Link>
      </Button>
    </div>
  </motion.div>
);

export default Offers;
