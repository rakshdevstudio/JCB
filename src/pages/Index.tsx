import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { BrandPromise } from "@/components/home/BrandPromise";
import { Services } from "@/components/home/Services";
import { SalonLocator } from "@/components/home/SalonLocator";
import { FeaturedLooks } from "@/components/home/FeaturedLooks";
import { Testimonials } from "@/components/home/Testimonials";
import { BookingCTA } from "@/components/home/BookingCTA";
import { FloatingBookButton } from "@/components/home/FloatingBookButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <BrandPromise />
        <Services />
        <SalonLocator />
        <FeaturedLooks />
        <Testimonials />
        <BookingCTA />
      </main>
      <Footer />
      <FloatingBookButton />
    </div>
  );
};

export default Index;
