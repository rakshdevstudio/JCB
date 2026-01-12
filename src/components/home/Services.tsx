import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Scissors, Sparkles, Crown, Heart, Palette, Stethoscope, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Scissors,
    title: "Hair",
    subtitle: "Cuts • Color • Styling",
    description: "Master stylists trained in Paris, delivering precision cuts and bespoke color artistry.",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2669&auto=format&fit=crop",
  },
  {
    icon: Sparkles,
    title: "Beauty",
    subtitle: "Facials • Skincare",
    description: "Luxurious treatments using premium products to reveal your natural radiance.",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2670&auto=format&fit=crop",
  },
  {
    icon: Palette,
    title: "Nails",
    subtitle: "Manicure • Pedicure • Art",
    description: "Express yourself with flawless nail care and creative artistry.",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=2574&auto=format&fit=crop",
  },
  {
    icon: Crown,
    title: "Bridal",
    subtitle: "Makeup • Hair • Packages",
    description: "Your perfect day deserves perfection. Bespoke bridal transformations.",
    image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=2574&auto=format&fit=crop",
  },
  {
    icon: Heart,
    title: "Makeup",
    subtitle: "HD • Airbrush • Glam",
    description: "Professional artistry for every occasion, from subtle to stunning.",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=2671&auto=format&fit=crop",
  },
  {
    icon: Stethoscope,
    title: "Trica Hair Clinic",
    subtitle: "Treatment • Therapy",
    description: "Advanced solutions for hair health, restoration, and scalp wellness.",
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=2680&auto=format&fit=crop",
  },
];

export const Services = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-caption text-primary mb-4"
          >
            Our Services
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-headline text-foreground mb-6"
          >
            Crafted Experiences for
            <br />
            <span className="italic">Extraordinary</span> You
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-elegant max-w-2xl mx-auto"
          >
            From precision haircuts to rejuvenating spa treatments, every service is an 
            experience designed to elevate your beauty and well-being.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to="/services" className="block group">
                <div className="card-luxury h-full">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url('${service.image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                    
                    {/* Icon Badge */}
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                      <service.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-2">
                      {service.subtitle}
                    </p>
                    <h3 className="font-serif text-2xl text-foreground mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary font-medium">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link to="/services">
            <button className="btn-outline-luxury">View All Services</button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
