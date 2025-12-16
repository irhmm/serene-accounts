-- Drop existing SELECT policy that allows anyone to view workers
DROP POLICY IF EXISTS "Anyone can view workers" ON public.workers;

-- Create new admin-only SELECT policy
CREATE POLICY "Admins can view workers"
ON public.workers
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));