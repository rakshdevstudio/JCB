import { useState } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { cities } from "@/data/bookingData";
import { toast } from "sonner";
import { Calendar, Heart, Star, Sparkles, User, Mail, Phone, MapPin } from "lucide-react";

const Bridal = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        city: "",
        date: "",
        message: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Bridal Enquiry:", formData);
        toast.success("Thank you for your enquiry. Our bridal consultant will contact you shortly.");
        setFormData({ name: "", phone: "", email: "", city: "", date: "", message: "" });
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation />

            {/* Hero Section */}
            <section className="relative h-screen w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=2000&auto=format&fit=crop')] 
          bg-cover bg-center bg-no-repeat"
                >
                    <div className="absolute inset-0 bg-black/30 overlay-cinematic"></div>
                </div>

                <div className="relative h-full flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto z-10">
                    <span className="text-white/90 text-sm md:text-base uppercase tracking-[0.3em] mb-6 animate-fade-down">
                        The Big Day
                    </span>
                    <h1 className="text-display text-white mb-8 animate-fade-up">
                        Biguine Brides
                    </h1>
                    <p className="text-white/90 text-xl font-light tracking-wide max-w-2xl mx-auto animate-fade-up delay-200">
                        For the modern bride who seeks elegance, grace, and perfection.
                    </p>
                    <a href="#enquiry" className="mt-10 btn-luxury bg-white text-black hover:bg-white/90 animate-fade-up delay-300">
                        Book Consultation
                    </a>
                </div>
            </section>

            {/* Intro Section */}
            <section className="section-padding bg-card">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-headline mb-8">Curated for You</h2>
                    <p className="max-w-3xl mx-auto text-muted-foreground font-light leading-relaxed text-lg">
                        At Jean-Claude Biguine, we understand that your wedding day is one of the most important days of your life.
                        Our team of expert stylists and makeup artists work with you to create a look that is uniquely yours —
                        timeless, radiant, and breathtaking.
                    </p>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ServiceCard
                            title="Bridal Makeup"
                            desc="High-definition airbrush makeup that lasts all day and looks perfect in every photo."
                            img="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80"
                        />
                        <ServiceCard
                            title="Couture Hair"
                            desc="From classic updos to flowing waves, we craft hairstyles that complement your bridal attire."
                            img="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80"
                        />
                        <ServiceCard
                            title="Pre-Wedding Grooming"
                            desc="Radiance facials, body polishing, and spa rituals to prep your skin for the big day."
                            img="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80"
                        />
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-20 bg-secondary/20">
                <div className="container mx-auto px-4">
                    <h2 className="text-headline mb-12 text-center">Real Brides</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <GalleryImage src="https://images.unsplash.com/photo-1519744434687-1db7f72230a1?w=800&q=80" />
                        <GalleryImage src="https://images.unsplash.com/photo-1520698188049-307567705183?w=800&q=80" />
                        <GalleryImage src="https://images.unsplash.com/photo-1522869038234-a4f61c390a88?w=800&q=80" />
                        <GalleryImage src="https://images.unsplash.com/photo-1546193430-c2d207739ed7?w=800&q=80" />
                    </div>
                </div>
            </section>

            {/* Enquiry Form */}
            <section id="enquiry" className="section-padding bg-background relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto bg-card shadow-luxury p-8 md:p-12 rounded-sm border border-border/50">
                        <h2 className="text-headline mb-2 text-center">Begin Your Journey</h2>
                        <p className="text-center text-muted-foreground mb-10">Share your details and we'll get in touch to plan your bridal consultation.</p>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        required
                                        type="text"
                                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-sm focus:border-primary outline-none transition-colors"
                                        placeholder="Your Full Name"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        required
                                        type="tel"
                                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-sm focus:border-primary outline-none transition-colors"
                                        placeholder="+91 98765 43210"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        required
                                        type="email"
                                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-sm focus:border-primary outline-none transition-colors"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">City</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <select
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-sm focus:border-primary outline-none transition-colors appearance-none"
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    >
                                        <option value="">Select City</option>
                                        {cities.map(city => (
                                            <option key={city.id} value={city.name}>{city.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Wedding Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        required
                                        type="date"
                                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-sm focus:border-primary outline-none transition-colors"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Additional Details</label>
                                <textarea
                                    className="w-full p-4 bg-background border border-border rounded-sm focus:border-primary outline-none transition-colors min-h-[100px]"
                                    placeholder="Tell us more about your requirements (e.g., number of functions, bridal party size, etc.)"
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="md:col-span-2 pt-4 text-center">
                                <button type="submit" className="btn-luxury w-full md:w-auto min-w-[200px]">
                                    Submit Enquiry
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

const ServiceCard = ({ title, desc, img }: { title: string, desc: string, img: string }) => (
    <div className="group cursor-pointer">
        <div className="overflow-hidden mb-4 rounded-sm">
            <img
                src={img}
                alt={title}
                className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
            />
        </div>
        <h3 className="text-2xl font-serif mb-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-muted-foreground font-light leading-relaxed text-sm">{desc}</p>
    </div>
);

const GalleryImage = ({ src }: { src: string }) => (
    <div className="overflow-hidden rounded-sm relative group aspect-[3/4]">
        <img
            src={src}
            alt="Bridal Look"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
);

export default Bridal;
