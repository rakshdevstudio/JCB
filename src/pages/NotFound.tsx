import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-6">
      <div className="text-center max-w-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif text-8xl md:text-9xl text-champagne mb-6">404</h1>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-serif text-2xl md:text-3xl text-white mb-4"
        >
          Page Not Found
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-white/60 mb-10"
        >
          The page you're looking for seems to have wandered off. 
          Let's get you back to exploring our luxury services.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link to="/">
            <button className="px-8 py-4 bg-white text-charcoal text-sm uppercase tracking-[0.2em] font-medium hover:shadow-luxury transition-all duration-500 inline-flex items-center gap-3">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
