import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Settings, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { name: "Services", href: "/services" },
  { name: "Offers", href: "/offers" },
  { name: "Find a Salon", href: "/salons" },
  { name: "Bridal", href: "/bridal" },
  { name: "About", href: "/about" },
];

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin, isLoading, signOut, profile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-background/90 backdrop-blur-lg shadow-soft py-4"
            : "bg-transparent py-6"
        }`}
      >
        <nav className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="relative z-10">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col"
              >
                <span className={`font-serif text-xl md:text-2xl font-medium tracking-tight transition-colors duration-300 ${
                  isScrolled ? "text-foreground" : "text-white"
                }`}>
                  Jean-Claude Biguine
                </span>
                <span className={`text-[10px] uppercase tracking-[0.3em] transition-colors duration-300 ${
                  isScrolled ? "text-muted-foreground" : "text-white/70"
                }`}>
                  Salon & Spa
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`link-underline text-sm tracking-wide transition-colors duration-300 ${
                    isScrolled
                      ? "text-foreground hover:text-primary"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              {!isLoading && !user && (
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-3 text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 ${
                      isScrolled
                        ? "text-foreground hover:text-primary"
                        : "text-white/90 hover:text-white"
                    }`}
                  >
                    Login
                  </motion.button>
                </Link>
              )}
              {!isLoading && user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-2 px-4 py-3 text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 ${
                        isScrolled
                          ? "text-foreground hover:text-primary"
                          : "text-white/90 hover:text-white"
                      }`}
                    >
                      <User size={16} />
                      {profile?.full_name || "Account"}
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                            <Settings size={16} />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="flex items-center gap-2 cursor-pointer text-destructive"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Link to="/book">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 ${
                    isScrolled
                      ? "bg-primary text-primary-foreground hover:shadow-luxury"
                      : "bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20"
                  }`}
                >
                  Book Now
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 transition-colors ${
                isScrolled ? "text-foreground" : "text-white"
              }`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-charcoal/95 backdrop-blur-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-background shadow-elevated"
            >
              <div className="flex flex-col h-full pt-24 px-8">
                <div className="space-y-6">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <Link
                        to={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-2xl font-serif text-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-auto pb-12 space-y-4"
                >
                  {!isLoading && !user && (
                    <>
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <button className="w-full py-3 border border-foreground/20 text-foreground hover:bg-foreground/5 transition-colors">
                          Login
                        </button>
                      </Link>
                      <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                        <button className="w-full py-3 border border-primary text-primary hover:bg-primary/10 transition-colors">
                          Sign Up
                        </button>
                      </Link>
                    </>
                  )}
                  {!isLoading && user && isAdmin && (
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full flex items-center justify-center gap-2 py-3 border border-primary text-primary hover:bg-primary/10 transition-colors">
                        <Settings size={18} />
                        Admin Dashboard
                      </button>
                    </Link>
                  )}
                  {!isLoading && user && (
                    <button 
                      onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 py-3 border border-destructive text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  )}
                  <Link to="/book" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full btn-luxury">Book Appointment</button>
                  </Link>
                </motion.div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
