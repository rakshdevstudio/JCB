-- Create enum for discount types
CREATE TYPE public.discount_type AS ENUM ('percentage', 'flat');

-- Create offers table
CREATE TABLE public.offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  banner_image_url TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  discount_type discount_type NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create junction table for offer-services relationship
CREATE TABLE public.offer_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(offer_id, service_id)
);

-- Create junction table for offer-salons relationship
CREATE TABLE public.offer_salons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(offer_id, salon_id)
);

-- Create junction table for offer-cities relationship (for city-wide offers)
CREATE TABLE public.offer_cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(offer_id, city_id)
);

-- Enable RLS on all tables
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_cities ENABLE ROW LEVEL SECURITY;

-- Offers are publicly readable (for the offers page)
CREATE POLICY "Offers are publicly readable"
ON public.offers
FOR SELECT
USING (true);

-- Only super_admin can manage offers
CREATE POLICY "Super admins can manage offers"
ON public.offers
FOR ALL
USING (has_role(auth.uid(), 'super_admin'));

-- Offer services are publicly readable
CREATE POLICY "Offer services are publicly readable"
ON public.offer_services
FOR SELECT
USING (true);

-- Only super_admin can manage offer services
CREATE POLICY "Super admins can manage offer services"
ON public.offer_services
FOR ALL
USING (has_role(auth.uid(), 'super_admin'));

-- Offer salons are publicly readable
CREATE POLICY "Offer salons are publicly readable"
ON public.offer_salons
FOR SELECT
USING (true);

-- Only super_admin can manage offer salons
CREATE POLICY "Super admins can manage offer salons"
ON public.offer_salons
FOR ALL
USING (has_role(auth.uid(), 'super_admin'));

-- Offer cities are publicly readable
CREATE POLICY "Offer cities are publicly readable"
ON public.offer_cities
FOR SELECT
USING (true);

-- Only super_admin can manage offer cities
CREATE POLICY "Super admins can manage offer cities"
ON public.offer_cities
FOR ALL
USING (has_role(auth.uid(), 'super_admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_offers_updated_at
BEFORE UPDATE ON public.offers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for efficient queries
CREATE INDEX idx_offers_active_dates ON public.offers(is_active, start_date, end_date);
CREATE INDEX idx_offers_featured ON public.offers(is_featured) WHERE is_featured = true;
CREATE INDEX idx_offer_services_offer ON public.offer_services(offer_id);
CREATE INDEX idx_offer_salons_offer ON public.offer_salons(offer_id);
CREATE INDEX idx_offer_cities_offer ON public.offer_cities(offer_id);