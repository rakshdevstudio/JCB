import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

const ServiceSection = ({
    title,
    description,
    image,
    index
}: {
    title: string;
    description: string;
    image: string;
    index: number;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24 py-24`}
        >
            <div className="w-full lg:w-1/2 aspect-[4/5] overflow-hidden relative group">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7 }}
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
                <h2 className="text-4xl lg:text-5xl font-serif text-neutral-900">{title}</h2>
                <div className="w-12 h-0.5 bg-neutral-900 mx-auto lg:mx-0" />
                <p className="text-neutral-600 leading-relaxed text-lg max-w-md mx-auto lg:mx-0 font-light">
                    {description}
                </p>
                <button className="text-sm tracking-widest uppercase border-b border-neutral-900 pb-1 hover:text-neutral-600 hover:border-neutral-600 transition-all">
                    View Menu
                </button>
            </div>
        </motion.div>
    );
};

const Services = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const services = [
        {
            title: "Hair Couture",
            description: "From precision cuts to bespoke coloring, our expert stylists craft looks that complement your personality and lifestyle. Experience the transformative power of French hairdressing.",
            image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=1226&auto=format&fit=crop"
        },
        {
            title: "Beauty & Esthetics",
            description: "Rejuvenate your skin with our premium facial treatments and beauty rituals. We use only the finest international products to ensure your skin glows with health and vitality.",
            image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop"
        },
        {
            title: "Spa & Wellness",
            description: "Escape the city's chaos in our tranquil spa sanctuaries. indulge in therapeutic massages and body treatments designed to restore balance to your body and mind.",
            image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop"
        },
        {
            title: "Bridal Suite",
            description: "For your special day, trust the experts at Jean-Claude Biguine. Our bridal packages offer comprehensive pre-bridal and bridal services to make you look ethereal.",
            image: "https://images.unsplash.com/photo-1595181734674-32d32fe55a9c?q=80&w=1080&auto=format&fit=crop"
        }
    ];

    return (
        <div className="min-h-screen bg-[#FDFBF7]" ref={containerRef}>
            <Navigation />

            {/* Cinematic Hero */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <motion.div
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                        className="w-full h-full"
                    >
                        <div className="absolute inset-0 bg-black/20 z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=2070&auto=format&fit=crop"
                            alt="Luxury Salon"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>

                <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto space-y-8">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-base md:text-lg tracking-[0.2em] uppercase font-light"
                    >
                        French Finesse. Personalized Expertise.
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-tight"
                    >
                        The Art of Beauty, <br />
                        <span className="italic font-light">Curated</span>
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1, duration: 0.8 }}
                    >
                        <button
                            onClick={() => navigate('/book')}
                            className="mt-8 px-10 py-4 bg-white text-neutral-900 text-sm tracking-widest uppercase hover:bg-neutral-100 transition-colors duration-300"
                        >
                            Book Appointment
                        </button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white z-20 flex flex-col items-center gap-2"
                >
                    <span className="text-[10px] tracking-[0.2em] uppercase opacity-80">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <ArrowDown className="w-5 h-5 opacity-80" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Signature Services */}
            <section className="py-24 lg:py-32 px-6 lg:px-12 max-w-[1400px] mx-auto">
                <div className="text-center mb-24 space-y-4">
                    <span className="text-xs tracking-[0.2em] uppercase text-neutral-500">Our Expertise</span>
                    <h2 className="text-4xl lg:text-5xl font-serif text-neutral-900">Signature Services</h2>
                </div>

                <div className="space-y-12">
                    {services.map((service, index) => (
                        <ServiceSection key={service.title} {...service} index={index} />
                    ))}
                </div>
            </section>

            {/* Quote Section */}
            <section className="py-32 bg-neutral-900 text-white text-center px-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h3 className="text-3xl md:text-5xl font-serif leading-snug italic opacity-90">
                        "Beauty is not just about how you look, but how you feel right in your own skin."
                    </h3>
                    <p className="text-sm tracking-widest uppercase text-neutral-400">— Jean-Claude Biguine</p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Services;
