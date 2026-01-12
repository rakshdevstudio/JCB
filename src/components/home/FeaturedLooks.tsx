import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Instagram, ArrowUpRight } from "lucide-react";

const looks = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2669&auto=format&fit=crop",
    category: "Bridal",
    title: "Eternal Elegance",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?q=80&w=2574&auto=format&fit=crop",
    category: "Hair Color",
    title: "Midnight Rose",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=2680&auto=format&fit=crop",
    category: "Hair Style",
    title: "Modern Chic",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2574&auto=format&fit=crop",
    category: "Makeup",
    title: "Golden Hour",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=2535&auto=format&fit=crop",
    category: "Nails",
    title: "Sculptural Art",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1500840216050-6ffa99d75160?q=80&w=2697&auto=format&fit=crop",
    category: "Hair Style",
    title: "Soft Waves",
  },
];

export const FeaturedLooks = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-caption text-primary mb-4"
            >
              Inspiration Gallery
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-headline text-foreground"
            >
              Looks We <span className="italic">Love</span>
            </motion.h2>
          </div>
          <motion.a
            href="https://instagram.com/jcbiguineindia"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors group"
          >
            <Instagram className="w-5 h-5" />
            <span className="link-underline">Follow @jcbiguineindia</span>
          </motion.a>
        </div>

        {/* Masonry Grid */}
        <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {looks.map((look, index) => (
            <motion.div
              key={look.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative group cursor-pointer ${
                index === 0 || index === 5 ? "md:row-span-2" : ""
              }`}
            >
              <div className={`relative overflow-hidden ${
                index === 0 || index === 5 ? "aspect-[3/4]" : "aspect-square"
              }`}>
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${look.image}')` }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/60 transition-all duration-500" />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-champagne mb-1">
                    {look.category}
                  </p>
                  <h3 className="font-serif text-lg md:text-xl text-white">
                    {look.title}
                  </h3>
                </div>

                {/* Arrow Icon */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/0 group-hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <ArrowUpRight className="w-5 h-5 text-charcoal" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
