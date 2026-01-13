import { useState, useMemo } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Phone, Search, Navigation as NavIcon } from "lucide-react";
import { cities, salons, Salon } from "@/data/bookingData";

const FindSalon = () => {
    const [selectedCity, setSelectedCity] = useState<string>("all");
    const [selectedArea, setSelectedArea] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredSalons = useMemo(() => {
        return salons.filter((salon) => {
            const matchesCity = selectedCity === "all" || salon.cityId === selectedCity;
            const matchesArea = selectedArea === "all" || salon.area === selectedArea;
            const matchesSearch =
                salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                salon.address.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesCity && matchesArea && matchesSearch;
        });
    }, [selectedCity, selectedArea, searchQuery]);

    // Get unique areas for the selected city
    const availableAreas = useMemo(() => {
        if (selectedCity === "all") {
            return Array.from(new Set(salons.map(s => s.area))).sort();
        }
        return Array.from(new Set(salons.filter(s => s.cityId === selectedCity).map(s => s.area))).sort();
    }, [selectedCity]);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation />

            {/* Page Header */}
            <div className="bg-secondary/30 pt-32 pb-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-display mb-4 text-center">Find Your Salon</h1>
                    <p className="text-center text-muted-foreground font-light text-lg max-w-2xl mx-auto">
                        Locate your nearest Jean-Claude Biguine salon for a luxurious pampering session.
                    </p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="sticky top-[70px] z-30 bg-background/95 backdrop-blur shadow-sm py-4 border-b">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-wrap gap-4 w-full md:w-auto">
                            {/* City Selector */}
                            <select
                                className="px-4 py-2 border rounded-sm bg-background text-sm min-w-[150px] focus:ring-1 focus:ring-primary outline-none"
                                value={selectedCity}
                                onChange={(e) => {
                                    setSelectedCity(e.target.value);
                                    setSelectedArea("all");
                                }}
                            >
                                <option value="all">All Cities</option>
                                {cities.map((city) => (
                                    <option key={city.id} value={city.id}>{city.name}</option>
                                ))}
                            </select>

                            {/* Area Selector */}
                            <select
                                className="px-4 py-2 border rounded-sm bg-background text-sm min-w-[150px] focus:ring-1 focus:ring-primary outline-none"
                                value={selectedArea}
                                onChange={(e) => setSelectedArea(e.target.value)}
                                disabled={availableAreas.length === 0}
                            >
                                <option value="all">All Areas</option>
                                {availableAreas.map((area) => (
                                    <option key={area} value={area}>{area}</option>
                                ))}
                            </select>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by name or location..."
                                className="w-full pl-10 pr-4 py-2 border rounded-sm bg-background text-sm focus:ring-1 focus:ring-primary outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Salons Grid */}
            <div className="container mx-auto px-4 py-12">
                {filteredSalons.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredSalons.map((salon) => (
                            <SalonCard key={salon.id} salon={salon} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-serif text-muted-foreground">No salons found matching your criteria.</h3>
                        <button
                            className="mt-4 text-primary hover:underline"
                            onClick={() => {
                                setSelectedCity("all");
                                setSelectedArea("all");
                                setSearchQuery("");
                            }}
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

const SalonCard = ({ salon }: { salon: Salon }) => {
    return (
        <div className="card-luxury group h-full flex flex-col">
            <div className="relative h-64 overflow-hidden">
                <img
                    src={salon.image}
                    alt={salon.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-xs uppercase tracking-wider bg-primary px-2 py-1 mb-2 inline-block rounded-sm">
                        {salon.area}
                    </span>
                    <h3 className="text-xl font-serif">{salon.name}</h3>
                </div>
            </div>

            <div className="p-6 flex-grow flex flex-col animate-fade-up">
                <div className="space-y-3 mb-6 flex-grow">
                    <div className="flex items-start gap-3 text-muted-foreground text-sm">
                        <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                        <p className="leading-relaxed">{salon.address}</p>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground text-sm">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <p>{salon.phone}</p>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <p>Open Today: {salon.openTime} - {salon.closeTime}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-auto">
                    <a href="/book" className="btn-luxury text-center py-3 text-xs">
                        Book Now
                    </a>
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(salon.name + " " + salon.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-outline-luxury text-center py-3 text-xs flex items-center justify-center gap-2"
                    >
                        <NavIcon className="w-3 h-3" />
                        Directions
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FindSalon;
