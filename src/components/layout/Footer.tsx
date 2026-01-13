import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Twitter, MapPin, Phone, Mail } from "lucide-react";

const footerLinks = {
  services: [
    { name: "Hair", href: "/services?category=hair" },
    { name: "Beauty & Skincare", href: "/services?category=beauty" },
    { name: "Nails", href: "/services?category=nails" },
    { name: "Bridal", href: "/bridal" },
    { name: "Makeup", href: "/services?category=makeup" },
    { name: "Trica Hair Clinic", href: "/services?category=trica" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Story", href: "/about#story" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Press", href: "/press" },
  ],
  support: [
    { name: "Find a Salon", href: "/find-salon" },
    { name: "Book Appointment", href: "/book" },
    { name: "Gift Cards", href: "/gift-cards" },
    { name: "Contact Us", href: "/contact" },
    { name: "FAQ", href: "/faq" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/jcbiguineindia", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com/jcbiguineindia", label: "Facebook" },
  { icon: Youtube, href: "https://youtube.com/jcbiguineindia", label: "YouTube" },
  { icon: Twitter, href: "https://twitter.com/jcbiguineindia", label: "Twitter" },
];

export const Footer = () => {
  return (
    <footer className="bg-charcoal text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <h3 className="font-serif text-2xl text-white">Jean-Claude Biguine</h3>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
                Salon & Spa • India
              </p>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-8 max-w-sm">
              Where Parisian elegance meets Indian soul. Experience world-class
              beauty services at 50+ luxury salons across India.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-8">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-3 text-sm text-white/60 hover:text-champagne transition-colors"
              >
                <Phone className="w-4 h-4" />
                +91 98765 43210
              </a>
              <a
                href="mailto:hello@jcbiguine.in"
                className="flex items-center gap-3 text-sm text-white/60 hover:text-champagne transition-colors"
              >
                <Mail className="w-4 h-4" />
                hello@jcbiguine.in
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/20 flex items-center justify-center hover:border-champagne hover:bg-champagne/10 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-white mb-6">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/60 hover:text-champagne transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-white mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/60 hover:text-champagne transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-white mb-6">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/60 hover:text-champagne transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} Jean-Claude Biguine India. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-xs text-white/40 hover:text-white/60 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-xs text-white/40 hover:text-white/60 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-xs text-white/40 hover:text-white/60 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
