import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote: "The attention to detail and expertise at Jean-Claude Biguine is unmatched. Every visit feels like a luxury retreat. My stylist truly understands what works for me.",
    author: "Priya Sharma",
    role: "Mumbai",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop",
  },
  {
    id: 2,
    quote: "From my wedding day to every special occasion since, JCB has been my go-to. The bridal team created magic that I still cherish in my photos.",
    author: "Ananya Reddy",
    role: "Bangalore",
    rating: 5,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop",
  },
  {
    id: 3,
    quote: "The Trica Hair Clinic treatment transformed my hair completely. After years of damage, I finally have healthy, beautiful hair again.",
    author: "Meera Kapoor",
    role: "Delhi",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop",
  },
];

export const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="section-padding bg-cream overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div ref={containerRef} className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-caption text-primary mb-4"
            >
              Client Stories
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-headline text-foreground"
            >
              Voices of <span className="italic">Confidence</span>
            </motion.h2>
          </div>

          {/* Testimonial Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Quote Icon */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Quote className="w-5 h-5 text-primary-foreground" />
            </div>

            {/* Testimonial Content */}
            <div className="bg-background p-8 md:p-16 shadow-elevated relative">
              <div className="text-center">
                {/* Stars */}
                <div className="flex items-center justify-center gap-1 mb-8">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>

                {/* Quote */}
                <motion.blockquote
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="font-serif text-xl md:text-2xl text-foreground leading-relaxed mb-10"
                >
                  "{testimonials[activeIndex].quote}"
                </motion.blockquote>

                {/* Author */}
                <motion.div
                  key={`author-${activeIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-center justify-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={testimonials[activeIndex].image}
                      alt={testimonials[activeIndex].author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground">
                      {testimonials[activeIndex].author}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonials[activeIndex].role}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Navigation */}
              <div className="absolute bottom-8 right-8 flex items-center gap-2">
                <button
                  onClick={prevTestimonial}
                  className="w-10 h-10 border border-border hover:border-primary flex items-center justify-center transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-10 h-10 border border-border hover:border-primary flex items-center justify-center transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Dots */}
              <div className="absolute bottom-8 left-8 flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeIndex ? "w-6 bg-primary" : "bg-border"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
