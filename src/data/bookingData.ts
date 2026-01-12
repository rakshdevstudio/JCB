// Types for the booking system
export interface City {
  id: string;
  name: string;
  state: string;
  salonCount: number;
}

export interface Salon {
  id: string;
  name: string;
  cityId: string;
  area: string;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  image: string;
  openTime: string;
  closeTime: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
}

export interface Service {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  duration: number; // in minutes
  price: number;
  image?: string;
}

export interface Staff {
  id: string;
  name: string;
  salonId: string;
  role: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  image: string;
  experience: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BookingData {
  city: City | null;
  salon: Salon | null;
  service: Service | null;
  staff: Staff | null;
  date: Date | null;
  time: string | null;
}

// Mock Data
export const cities: City[] = [
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", salonCount: 18 },
  { id: "delhi", name: "Delhi NCR", state: "Delhi", salonCount: 12 },
  { id: "bangalore", name: "Bangalore", state: "Karnataka", salonCount: 8 },
  { id: "hyderabad", name: "Hyderabad", state: "Telangana", salonCount: 5 },
  { id: "chennai", name: "Chennai", state: "Tamil Nadu", salonCount: 4 },
  { id: "pune", name: "Pune", state: "Maharashtra", salonCount: 3 },
];

export const salons: Salon[] = [
  {
    id: "salon-1",
    name: "JCB Phoenix Mills",
    cityId: "mumbai",
    area: "Lower Parel",
    address: "Phoenix Mills Compound, Lower Parel, Mumbai 400013",
    phone: "+91 22 2496 1234",
    rating: 4.9,
    reviewCount: 342,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
    openTime: "10:00",
    closeTime: "21:00",
  },
  {
    id: "salon-2",
    name: "JCB Bandra",
    cityId: "mumbai",
    area: "Bandra West",
    address: "Hill Road, Bandra West, Mumbai 400050",
    phone: "+91 22 2640 5678",
    rating: 4.8,
    reviewCount: 287,
    image: "https://images.unsplash.com/photo-1633681122611-56e74c411a43?w=800",
    openTime: "09:00",
    closeTime: "20:00",
  },
  {
    id: "salon-3",
    name: "JCB Juhu",
    cityId: "mumbai",
    area: "Juhu",
    address: "Juhu Tara Road, Juhu, Mumbai 400049",
    phone: "+91 22 2620 9012",
    rating: 4.7,
    reviewCount: 198,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
    openTime: "10:00",
    closeTime: "20:00",
  },
  {
    id: "salon-4",
    name: "JCB Connaught Place",
    cityId: "delhi",
    area: "Connaught Place",
    address: "Block A, Connaught Place, New Delhi 110001",
    phone: "+91 11 2334 5678",
    rating: 4.8,
    reviewCount: 412,
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=800",
    openTime: "10:00",
    closeTime: "21:00",
  },
  {
    id: "salon-5",
    name: "JCB Saket",
    cityId: "delhi",
    area: "Saket",
    address: "Select Citywalk, Saket, New Delhi 110017",
    phone: "+91 11 2956 7890",
    rating: 4.9,
    reviewCount: 356,
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800",
    openTime: "10:00",
    closeTime: "22:00",
  },
  {
    id: "salon-6",
    name: "JCB Indiranagar",
    cityId: "bangalore",
    area: "Indiranagar",
    address: "100 Feet Road, Indiranagar, Bangalore 560038",
    phone: "+91 80 2520 1234",
    rating: 4.8,
    reviewCount: 267,
    image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800",
    openTime: "09:00",
    closeTime: "20:00",
  },
  {
    id: "salon-7",
    name: "JCB Koramangala",
    cityId: "bangalore",
    area: "Koramangala",
    address: "5th Block, Koramangala, Bangalore 560095",
    phone: "+91 80 2553 5678",
    rating: 4.7,
    reviewCount: 189,
    image: "https://images.unsplash.com/photo-1470259078422-826894b933aa?w=800",
    openTime: "10:00",
    closeTime: "21:00",
  },
  {
    id: "salon-8",
    name: "JCB Jubilee Hills",
    cityId: "hyderabad",
    area: "Jubilee Hills",
    address: "Road No. 36, Jubilee Hills, Hyderabad 500033",
    phone: "+91 40 2355 9012",
    rating: 4.9,
    reviewCount: 234,
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800",
    openTime: "10:00",
    closeTime: "20:00",
  },
];

export const serviceCategories: ServiceCategory[] = [
  { id: "hair", name: "Hair", icon: "Scissors" },
  { id: "color", name: "Color", icon: "Palette" },
  { id: "spa", name: "Spa & Wellness", icon: "Sparkles" },
  { id: "makeup", name: "Makeup", icon: "Heart" },
  { id: "nails", name: "Nails", icon: "Hand" },
  { id: "bridal", name: "Bridal", icon: "Crown" },
];

export const services: Service[] = [
  // Hair Services
  {
    id: "haircut-women",
    name: "Women's Haircut & Styling",
    categoryId: "hair",
    description: "Precision cut with wash, blow-dry and styling",
    duration: 60,
    price: 1500,
  },
  {
    id: "haircut-men",
    name: "Men's Haircut",
    categoryId: "hair",
    description: "Classic or modern cut with styling",
    duration: 30,
    price: 800,
  },
  {
    id: "blowdry",
    name: "Blow Dry & Styling",
    categoryId: "hair",
    description: "Professional blow-dry with heat styling",
    duration: 45,
    price: 1000,
  },
  {
    id: "keratin",
    name: "Keratin Treatment",
    categoryId: "hair",
    description: "Smoothing treatment for frizz-free hair",
    duration: 180,
    price: 8000,
  },
  {
    id: "hair-spa",
    name: "Hair Spa Treatment",
    categoryId: "hair",
    description: "Deep conditioning with scalp massage",
    duration: 60,
    price: 2000,
  },
  // Color Services
  {
    id: "global-color",
    name: "Global Hair Color",
    categoryId: "color",
    description: "Full head color application",
    duration: 120,
    price: 4000,
  },
  {
    id: "highlights",
    name: "Highlights / Balayage",
    categoryId: "color",
    description: "Hand-painted or foil highlights",
    duration: 150,
    price: 6000,
  },
  {
    id: "root-touch",
    name: "Root Touch-up",
    categoryId: "color",
    description: "Regrowth color coverage",
    duration: 60,
    price: 2500,
  },
  // Spa Services
  {
    id: "facial-luxury",
    name: "Luxury Facial",
    categoryId: "spa",
    description: "Premium facial with anti-aging treatment",
    duration: 90,
    price: 5000,
  },
  {
    id: "body-massage",
    name: "Full Body Massage",
    categoryId: "spa",
    description: "Relaxing Swedish or deep tissue massage",
    duration: 60,
    price: 3500,
  },
  {
    id: "cleanup",
    name: "Face Clean-up",
    categoryId: "spa",
    description: "Deep cleansing and exfoliation",
    duration: 45,
    price: 1500,
  },
  // Makeup
  {
    id: "party-makeup",
    name: "Party Makeup",
    categoryId: "makeup",
    description: "Glamorous makeup for special occasions",
    duration: 60,
    price: 4000,
  },
  {
    id: "bridal-makeup",
    name: "Bridal Makeup",
    categoryId: "makeup",
    description: "Complete bridal look with HD airbrush",
    duration: 120,
    price: 25000,
  },
  // Nails
  {
    id: "manicure",
    name: "Classic Manicure",
    categoryId: "nails",
    description: "Nail shaping, cuticle care, and polish",
    duration: 45,
    price: 800,
  },
  {
    id: "gel-nails",
    name: "Gel Nail Art",
    categoryId: "nails",
    description: "Long-lasting gel polish with nail art",
    duration: 75,
    price: 2000,
  },
  {
    id: "pedicure",
    name: "Spa Pedicure",
    categoryId: "nails",
    description: "Luxurious pedicure with foot massage",
    duration: 60,
    price: 1200,
  },
];

export const staff: Staff[] = [
  {
    id: "staff-1",
    name: "Priya Sharma",
    salonId: "salon-1",
    role: "Senior Stylist",
    specialties: ["Hair Cutting", "Balayage", "Bridal"],
    rating: 4.9,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400",
    experience: "12 years",
  },
  {
    id: "staff-2",
    name: "Rahul Kapoor",
    salonId: "salon-1",
    role: "Creative Director",
    specialties: ["Hair Color", "Hair Styling", "Keratin"],
    rating: 4.95,
    reviewCount: 203,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    experience: "15 years",
  },
  {
    id: "staff-3",
    name: "Meera Patel",
    salonId: "salon-1",
    role: "Makeup Artist",
    specialties: ["Bridal Makeup", "HD Makeup", "Hair Styling"],
    rating: 4.85,
    reviewCount: 178,
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400",
    experience: "10 years",
  },
  {
    id: "staff-4",
    name: "Amit Singh",
    salonId: "salon-2",
    role: "Senior Stylist",
    specialties: ["Men's Cuts", "Beard Styling", "Hair Color"],
    rating: 4.8,
    reviewCount: 134,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    experience: "8 years",
  },
  {
    id: "staff-5",
    name: "Sneha Reddy",
    salonId: "salon-2",
    role: "Spa Therapist",
    specialties: ["Facials", "Body Massage", "Aromatherapy"],
    rating: 4.9,
    reviewCount: 167,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    experience: "9 years",
  },
  {
    id: "staff-6",
    name: "Kavita Menon",
    salonId: "salon-4",
    role: "Senior Stylist",
    specialties: ["Hair Cutting", "Highlights", "Styling"],
    rating: 4.85,
    reviewCount: 189,
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
    experience: "11 years",
  },
  {
    id: "staff-7",
    name: "Vikram Joshi",
    salonId: "salon-6",
    role: "Creative Director",
    specialties: ["Hair Color", "Balayage", "Hair Treatments"],
    rating: 4.92,
    reviewCount: 221,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    experience: "14 years",
  },
];

// Helper function to generate time slots
export const generateTimeSlots = (
  openTime: string,
  closeTime: string,
  serviceDuration: number,
  bookedSlots: string[] = []
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const [openHour, openMin] = openTime.split(":").map(Number);
  const [closeHour, closeMin] = closeTime.split(":").map(Number);

  let currentHour = openHour;
  let currentMin = openMin;

  while (
    currentHour < closeHour ||
    (currentHour === closeHour && currentMin < closeMin)
  ) {
    const timeString = `${currentHour.toString().padStart(2, "0")}:${currentMin
      .toString()
      .padStart(2, "0")}`;

    // Simulate some random bookings (in real app, this would come from database)
    const isBooked = bookedSlots.includes(timeString) || Math.random() < 0.2;

    slots.push({
      time: timeString,
      available: !isBooked,
    });

    // Add 30 minutes
    currentMin += 30;
    if (currentMin >= 60) {
      currentMin = 0;
      currentHour += 1;
    }
  }

  return slots;
};

// Get salons by city
export const getSalonsByCity = (cityId: string): Salon[] => {
  return salons.filter((salon) => salon.cityId === cityId);
};

// Get staff by salon
export const getStaffBySalon = (salonId: string): Staff[] => {
  return staff.filter((s) => s.salonId === salonId);
};

// Get services by category
export const getServicesByCategory = (categoryId: string): Service[] => {
  return services.filter((service) => service.categoryId === categoryId);
};
