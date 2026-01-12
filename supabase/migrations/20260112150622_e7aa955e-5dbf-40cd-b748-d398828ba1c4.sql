-- =============================================
-- JEAN-CLAUDE BIGUINE BOOKING SYSTEM SCHEMA
-- =============================================

-- Create enum for booking status
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');

-- Create enum for user roles (admin system)
CREATE TYPE public.app_role AS ENUM ('super_admin', 'city_manager', 'salon_manager', 'staff', 'customer');

-- =============================================
-- 1. CITIES TABLE
-- =============================================
CREATE TABLE public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Cities are publicly readable (for booking flow)
CREATE POLICY "Cities are publicly readable" ON public.cities
  FOR SELECT USING (true);

-- =============================================
-- 2. SALONS TABLE
-- =============================================
CREATE TABLE public.salons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  area TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  image_url TEXT,
  open_time TIME NOT NULL DEFAULT '09:00',
  close_time TIME NOT NULL DEFAULT '21:00',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;

-- Salons are publicly readable (for booking flow)
CREATE POLICY "Salons are publicly readable" ON public.salons
  FOR SELECT USING (true);

-- =============================================
-- 3. SERVICE CATEGORIES TABLE
-- =============================================
CREATE TABLE public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

-- Categories are publicly readable
CREATE POLICY "Service categories are publicly readable" ON public.service_categories
  FOR SELECT USING (true);

-- =============================================
-- 4. SERVICES TABLE
-- =============================================
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.service_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- in minutes
  base_price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Services are publicly readable
CREATE POLICY "Services are publicly readable" ON public.services
  FOR SELECT USING (true);

-- =============================================
-- 5. SALON SERVICES (pricing per salon)
-- =============================================
CREATE TABLE public.salon_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL, -- salon-specific price
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(salon_id, service_id)
);

-- Enable RLS
ALTER TABLE public.salon_services ENABLE ROW LEVEL SECURITY;

-- Salon services are publicly readable
CREATE POLICY "Salon services are publicly readable" ON public.salon_services
  FOR SELECT USING (true);

-- =============================================
-- 6. PROFILES TABLE (user data)
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  preferred_city_id UUID REFERENCES public.cities(id),
  preferred_salon_id UUID REFERENCES public.salons(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- 7. USER ROLES TABLE (separate for security)
-- =============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  salon_id UUID REFERENCES public.salons(id) ON DELETE CASCADE, -- for salon_manager/staff
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE, -- for city_manager
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role, salon_id)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can view their own roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- 8. STAFF TABLE
-- =============================================
CREATE TABLE public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- optional link to user account
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Stylist',
  specialties TEXT[],
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  image_url TEXT,
  experience TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Staff are publicly readable (for booking flow)
CREATE POLICY "Staff are publicly readable" ON public.staff
  FOR SELECT USING (true);

-- =============================================
-- 9. STAFF SCHEDULES TABLE
-- =============================================
CREATE TABLE public.staff_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(staff_id, day_of_week)
);

-- Enable RLS
ALTER TABLE public.staff_schedules ENABLE ROW LEVEL SECURITY;

-- Schedules are publicly readable
CREATE POLICY "Staff schedules are publicly readable" ON public.staff_schedules
  FOR SELECT USING (true);

-- =============================================
-- 10. BOOKINGS TABLE
-- =============================================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- optional for guest bookings
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE RESTRICT,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  staff_id UUID REFERENCES public.staff(id) ON DELETE SET NULL, -- optional staff preference
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  price DECIMAL(10,2) NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can create bookings
CREATE POLICY "Anyone can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (true);

-- Users can update their own pending bookings
CREATE POLICY "Users can update their own pending bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- =============================================
-- 11. BLOCKED SLOTS TABLE (for staff availability)
-- =============================================
CREATE TABLE public.blocked_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE,
  salon_id UUID REFERENCES public.salons(id) ON DELETE CASCADE,
  blocked_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (staff_id IS NOT NULL OR salon_id IS NOT NULL)
);

-- Enable RLS
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;

-- Blocked slots are publicly readable (for availability check)
CREATE POLICY "Blocked slots are publicly readable" ON public.blocked_slots
  FOR SELECT USING (true);

-- =============================================
-- SECURITY DEFINER FUNCTION FOR ROLE CHECKING
-- =============================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to check if user manages a salon
CREATE OR REPLACE FUNCTION public.manages_salon(_user_id UUID, _salon_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
    AND (
      role = 'super_admin'
      OR (role = 'salon_manager' AND salon_id = _salon_id)
      OR (role = 'city_manager' AND city_id = (SELECT city_id FROM public.salons WHERE id = _salon_id))
    )
  )
$$;

-- =============================================
-- ADMIN POLICIES FOR MANAGEMENT
-- =============================================

-- Super admins can do everything on cities
CREATE POLICY "Admins can manage cities" ON public.cities
  FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- Admins can manage salons
CREATE POLICY "Admins can manage salons" ON public.salons
  FOR ALL USING (public.manages_salon(auth.uid(), id) OR public.has_role(auth.uid(), 'super_admin'));

-- Admins can manage services
CREATE POLICY "Admins can manage services" ON public.services
  FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- Admins can manage service categories
CREATE POLICY "Admins can manage service categories" ON public.service_categories
  FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- Salon managers can manage their salon services
CREATE POLICY "Managers can manage salon services" ON public.salon_services
  FOR ALL USING (public.manages_salon(auth.uid(), salon_id));

-- Salon managers can manage their staff
CREATE POLICY "Managers can manage staff" ON public.staff
  FOR ALL USING (public.manages_salon(auth.uid(), salon_id));

-- Salon managers can manage schedules
CREATE POLICY "Managers can manage schedules" ON public.staff_schedules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.staff s 
      WHERE s.id = staff_id AND public.manages_salon(auth.uid(), s.salon_id)
    )
  );

-- Salon managers can view/manage bookings for their salon
CREATE POLICY "Managers can manage salon bookings" ON public.bookings
  FOR ALL USING (public.manages_salon(auth.uid(), salon_id));

-- Managers can manage blocked slots
CREATE POLICY "Managers can manage blocked slots" ON public.blocked_slots
  FOR ALL USING (
    (salon_id IS NOT NULL AND public.manages_salon(auth.uid(), salon_id))
    OR 
    (staff_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.staff s 
      WHERE s.id = staff_id AND public.manages_salon(auth.uid(), s.salon_id)
    ))
  );

-- Super admin can manage all user roles
CREATE POLICY "Super admin can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- =============================================
-- AUTO-CREATE PROFILE TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  -- Assign default customer role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_cities_updated_at BEFORE UPDATE ON public.cities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_salons_updated_at BEFORE UPDATE ON public.salons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON public.staff FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- BOOKING REFERENCE GENERATOR
-- =============================================
CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_reference := 'JCB' || TO_CHAR(NOW(), 'YYMMDD') || '-' || UPPER(SUBSTRING(NEW.id::text, 1, 6));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER generate_booking_ref
  BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.generate_booking_reference();

-- =============================================
-- SEED DATA: CITIES
-- =============================================
INSERT INTO public.cities (name, state) VALUES
  ('Mumbai', 'Maharashtra'),
  ('Delhi NCR', 'Delhi'),
  ('Bangalore', 'Karnataka'),
  ('Hyderabad', 'Telangana'),
  ('Chennai', 'Tamil Nadu'),
  ('Pune', 'Maharashtra');

-- =============================================
-- SEED DATA: SERVICE CATEGORIES
-- =============================================
INSERT INTO public.service_categories (name, icon, display_order) VALUES
  ('Hair', 'Scissors', 1),
  ('Color', 'Palette', 2),
  ('Spa & Wellness', 'Sparkles', 3),
  ('Makeup', 'Heart', 4),
  ('Nails', 'Hand', 5),
  ('Bridal', 'Crown', 6);

-- =============================================
-- SEED DATA: SERVICES
-- =============================================
INSERT INTO public.services (category_id, name, description, duration, base_price) 
SELECT c.id, s.name, s.description, s.duration, s.base_price
FROM public.service_categories c
CROSS JOIN LATERAL (
  VALUES 
    ('Hair', 'Women''s Haircut & Styling', 'Precision cut with wash, blow-dry and styling', 60, 1500),
    ('Hair', 'Men''s Haircut', 'Classic or modern cut with styling', 30, 800),
    ('Hair', 'Blow Dry & Styling', 'Professional blow-dry with heat styling', 45, 1000),
    ('Hair', 'Keratin Treatment', 'Smoothing treatment for frizz-free hair', 180, 8000),
    ('Hair', 'Hair Spa Treatment', 'Deep conditioning with scalp massage', 60, 2000),
    ('Color', 'Global Hair Color', 'Full head color application', 120, 4000),
    ('Color', 'Highlights / Balayage', 'Hand-painted or foil highlights', 150, 6000),
    ('Color', 'Root Touch-up', 'Regrowth color coverage', 60, 2500),
    ('Spa & Wellness', 'Luxury Facial', 'Premium facial with anti-aging treatment', 90, 5000),
    ('Spa & Wellness', 'Full Body Massage', 'Relaxing Swedish or deep tissue massage', 60, 3500),
    ('Spa & Wellness', 'Face Clean-up', 'Deep cleansing and exfoliation', 45, 1500),
    ('Makeup', 'Party Makeup', 'Glamorous makeup for special occasions', 60, 4000),
    ('Makeup', 'Bridal Makeup', 'Complete bridal look with HD airbrush', 120, 25000),
    ('Nails', 'Classic Manicure', 'Nail shaping, cuticle care, and polish', 45, 800),
    ('Nails', 'Gel Nail Art', 'Long-lasting gel polish with nail art', 75, 2000),
    ('Nails', 'Spa Pedicure', 'Luxurious pedicure with foot massage', 60, 1200)
) AS s(category_name, name, description, duration, base_price)
WHERE c.name = s.category_name;