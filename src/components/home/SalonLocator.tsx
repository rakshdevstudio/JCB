import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Phone, ChevronRight, Star } from "lucide-react";

const cities = [
  { name: "Mumbai", salons: 18 },
  { name: "Delhi NCR", salons: 12 },
  { name: "Bangalore", salons: 8 },
  { name: "Chennai", salons: 5 },
  { name: "Hyderabad", salons: 4 },
  { name: "Pune", salons: 3 },
];

const featuredSalons = [
  {
    id: 1,
    name: "Bandra West",
    city: "Mumbai",
    address: "Ground Floor, Linking Road",
    rating: 4.9,
    reviews: 320,
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=2536&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Khan Market",
    city: "Delhi",
    address: "First Floor, Middle Lane",
    rating: 4.8,
    reviews: 285,
    image: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Indiranagar",
    city: "Bangalore",
    address: "100 Feet Road, CMH Road",
    rating: 4.9,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2670&auto=format&fit=crop",
  },
];

export const SalonLocator = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [selectedCity, setSelectedCity] = useState("Mumbai");

  return (
    <section className="section-padding bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-caption text-primary mb-4"
            >
              50+ Locations
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-headline text-foreground"
            >
              Find Your <span className="italic">Nearest</span>
              <br />
              Sanctuary
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/find-salon">
              <button className="btn-outline-luxury flex items-center gap-2">
                View All Salons
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* City Selector */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3"
          >
            <div className="bg-card p-6 shadow-soft">
              <h3 className="font-serif text-xl mb-6 text-foreground">Select City</h3>
              <div className="space-y-2">
                {cities.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => setSelectedCity(city.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-300 ${selectedCity === city.name
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent text-foreground"
                      }`}
                  >
                    <span className="text-sm font-medium">{city.name}</span>
                    <span className={`text-xs ${selectedCity === city.name ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {city.salons} salons
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Featured Salons */}
          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSalons.map((salon, index) => (
              <motion.div
                key={salon.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link to={`/find-salon?id=${salon.id}`} className="block group">
                  <div className="card-luxury">
                    {/* Image */}
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url('${salon.image}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />

                      {/* Rating Badge */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                        <span className="text-xs font-medium text-charcoal">{salon.rating}</span>
                        <span className="text-xs text-muted-foreground">({salon.reviews})</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors">
                            {salon.name}
                          </h3>
                          <p className="text-xs text-primary font-medium uppercase tracking-wide">
                            {salon.city}
                          </p>
                        </div>
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {salon.address}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
