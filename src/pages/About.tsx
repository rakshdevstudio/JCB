import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, Star, Globe, Award, Users } from "lucide-react";

const About = () => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation />

            {/* Cinematic Hero */}
            <section className="relative h-[80vh] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=2000&auto=format&fit=crop')] 
          bg-cover bg-center bg-no-repeat bg-fixed parallax-container"
                    style={{ transform: "scale(1.1)" }}
                >
                    <div className="absolute inset-0 bg-black/40 overlay-cinematic"></div>
                </div>

                <div className="relative h-full flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto z-10">
                    <span className="text-white/90 text-sm md:text-base uppercase tracking-[0.3em] mb-6 animate-fade-down">
                        Since 1982
                    </span>
                    <h1 className="text-display text-white mb-8 max-w-4xl mx-auto animate-fade-up">
                        The Jean-Claude Biguine Legacy
                    </h1>
                    <p className="text-white/80 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto animate-fade-up delay-200">
                        From the streets of Paris to the heart of India, defining luxury beauty for over four decades.
                    </p>
                </div>
            </section>

            {/* The Story Section */}
            <section className="section-padding bg-card relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1 animate-fade-right">
                            <div className="relative">
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80"
                                    alt="Salon Interior"
                                    className="rounded-sm shadow-luxury relative z-10"
                                />
                                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary rounded-sm -z-0"></div>
                            </div>
                        </div>

                        <div className="order-1 md:order-2 animate-fade-left">
                            <span className="text-caption text-primary mb-4 block">Our Origins</span>
                            <h2 className="text-headline mb-8">Parisian Roots, <br /><span className="italic text-primary">Global Excellence</span></h2>
                            <div className="space-y-6 text-muted-foreground font-light leading-relaxed">
                                <p>
                                    Jean-Claude Biguine is not just a brand; it is a philosophy of beauty born in Paris. What began as a single salon has blossomed into a global phenomenon, bringing French finesse to discerning clients worldwide.
                                </p>
                                <p>
                                    In India, our journey has been one of redefined standards. With over 50 salons across major cities, we have established ourselves as the premier destination for luxury hair and beauty services, blending international trends with an understanding of Indian aesthetic needs.
                                </p>
                            </div>

                            <div className="mt-10 grid grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-4xl font-serif text-primary mb-2">50+</h4>
                                    <p className="text-sm uppercase tracking-wider text-muted-foreground">Salons in India</p>
                                </div>
                                <div>
                                    <h4 className="text-4xl font-serif text-primary mb-2">40+</h4>
                                    <p className="text-sm uppercase tracking-wider text-muted-foreground">Years Legacy</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-24 bg-background text-center">
                <div className="container mx-auto px-4">
                    <span className="text-caption mb-6 block">Our Philosophy</span>
                    <h2 className="text-headline mb-16 mx-auto max-w-3xl">
                        "We believe true luxury lies in the perfect balance of French Finesse and Indian Expertise."
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Star className="w-8 h-8 text-primary" />,
                                title: "Premium Hospitality",
                                desc: "Every visit is an experience. We curate an atmosphere of calm, confidence, and absolute luxury."
                            },
                            {
                                icon: <Award className="w-8 h-8 text-primary" />,
                                title: "Global Standards",
                                desc: "Our stylists are trained in the latest international techniques, ensuring you get world-class service."
                            },
                            {
                                icon: <Users className="w-8 h-8 text-primary" />,
                                title: "Personalized Care",
                                desc: "We understand that beauty is personal. Our experts tailor every service to your unique needs."
                            }
                        ].map((item, index) => (
                            <div key={index} className="p-8 bg-card/50 hover:bg-card transition-colors duration-500 rounded-sm group">
                                <div className="mb-6 inline-block p-4 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-medium font-serif mb-4">{item.title}</h3>
                                <p className="text-muted-foreground font-light leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 bg-secondary/30">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-serif mb-8">Experience the Biguine Difference</h2>
                    <div className="flex flex-col md:flex-row justify-center gap-6">
                        <a href="/book" className="btn-luxury inline-flex items-center justify-center gap-2">
                            Book Appointment <ArrowRight className="w-4 h-4" />
                        </a>
                        <a href="/find-salon" className="btn-outline-luxury">
                            Find a Salon
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
