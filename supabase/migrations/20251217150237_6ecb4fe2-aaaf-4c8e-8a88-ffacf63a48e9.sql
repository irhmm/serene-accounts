-- Drop existing public SELECT policy on transactions
DROP POLICY IF EXISTS "Anyone can view transactions" ON public.transactions;

-- Create admin-only SELECT policy for transactions
CREATE POLICY "Admins can view transactions" 
ON public.transactions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));