import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Users, Globe, Heart } from "lucide-react";

const stats = [
  { number: "70+", label: "Years of Excellence", icon: Award },
  { number: "50+", label: "Luxury Salons", icon: Globe },
  { number: "500+", label: "Expert Stylists", icon: Users },
  { number: "1M+", label: "Happy Clients", icon: Heart },
];

export const BrandPromise = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-charcoal text-white overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left - Text Content */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-caption text-champagne mb-6"
            >
              The Jean-Claude Biguine Legacy
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-headline text-white mb-8"
            >
              Where Parisian Elegance
              <br />
              Meets <span className="italic text-champagne">Indian Soul</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-white/70 leading-relaxed mb-8"
            >
              Born in Paris in 1955, Jean-Claude Biguine revolutionized the world of 
              hairdressing with an uncompromising vision of beauty. Today, that legacy 
              continues across India, where our master stylists blend French expertise 
              with a deep understanding of Indian beauty traditions.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white/50 text-sm leading-relaxed"
            >
              Every visit to a Jean-Claude Biguine salon is more than a service—it's an 
              experience of transformation, where artistry meets science, and you leave 
              feeling like the most beautiful version of yourself.
            </motion.p>
          </div>

          {/* Right - Stats Grid */}
          <div ref={containerRef}>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="relative p-8 border border-white/10 hover:border-champagne/30 transition-all duration-500 group"
                >
                  <div className="absolute top-4 right-4">
                    <stat.icon className="w-5 h-5 text-champagne/40 group-hover:text-champagne transition-colors" />
                  </div>
                  <div className="font-serif text-4xl md:text-5xl text-champagne mb-2">
                    {stat.number}
                  </div>
                  <div className="text-xs uppercase tracking-[0.15em] text-white/50">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
