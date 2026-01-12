-- Add explicit policy to require authentication for profiles access
-- This ensures anonymous users cannot access any profile data
CREATE POLICY "Require authentication for profiles access"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- Add explicit policy to require authentication for bookings access
-- This ensures anonymous users cannot read booking data
CREATE POLICY "Require authentication for bookings read"
ON public.bookings
FOR SELECT
TO anon
USING (false);

-- Also ensure anonymous users cannot read bookings through any other means
CREATE POLICY "Require authentication for bookings update"
ON public.bookings
FOR UPDATE
TO anon
USING (false);

CREATE POLICY "Require authentication for bookings delete"
ON public.bookings
FOR DELETE
TO anon
USING (false);