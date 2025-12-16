-- Create ENUM for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create transactions table
CREATE TABLE public.transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tanggal date NOT NULL DEFAULT CURRENT_DATE,
    detail text NOT NULL,
    type text NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
    jumlah_masuk_dp bigint NOT NULL DEFAULT 0,
    jumlah_keluar_dp bigint NOT NULL DEFAULT 0,
    saldo_akhir bigint NOT NULL DEFAULT 0,
    keterangan_freelance text NOT NULL DEFAULT 'other' CHECK (keterangan_freelance IN ('design', 'development', 'writing', 'consulting', 'marketing', 'other')),
    status_pengeluaran text NOT NULL DEFAULT 'pending' CHECK (status_pengeluaran IN ('pending', 'completed', 'cancelled', 'refunded')),
    catatan text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS for user_roles: users can view their own roles
CREATE POLICY "Users can view own roles" 
ON public.user_roles FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- RLS for transactions: Anyone can READ (public)
CREATE POLICY "Anyone can view transactions" 
ON public.transactions FOR SELECT 
USING (true);

-- Only admin can INSERT
CREATE POLICY "Admins can insert transactions" 
ON public.transactions FOR INSERT 
TO authenticated 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admin can UPDATE
CREATE POLICY "Admins can update transactions" 
ON public.transactions FOR UPDATE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

-- Only admin can DELETE
CREATE POLICY "Admins can delete transactions" 
ON public.transactions FOR DELETE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();