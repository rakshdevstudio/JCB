-- Fix the bookings SELECT policy to protect guest booking data
-- Drop the existing policy
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;

-- Create new policy: Users can only view their OWN bookings (not guest bookings)
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

-- Guest bookings can only be viewed by managers/admins (already covered by existing manager policy)