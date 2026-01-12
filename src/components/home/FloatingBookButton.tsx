import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, X } from "lucide-react";

export const FloatingBookButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-50"
        >
          {isExpanded ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-background border border-border shadow-elevated p-6 w-72"
            >
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
              <h4 className="font-serif text-lg text-foreground mb-2">Book Your Visit</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Schedule your appointment at any of our 50+ locations.
              </p>
              <Link to="/book" onClick={() => setIsExpanded(false)}>
                <button className="w-full btn-luxury text-xs py-3">
                  Book Now
                </button>
              </Link>
            </motion.div>
          ) : (
            <motion.button
              onClick={() => setIsExpanded(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-luxury flex items-center justify-center hover:shadow-elevated transition-shadow"
            >
              <Calendar className="w-5 h-5" />
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
