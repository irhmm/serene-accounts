-- Create table for mitra orders
CREATE TABLE public.mitra_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nomor_order text NOT NULL,
  detail_order text NOT NULL,
  type_order text NOT NULL DEFAULT 'jasa_tugas',
  nama_pj_freelance text NOT NULL,
  catatan text,
  tanggal_start date NOT NULL DEFAULT CURRENT_DATE,
  status_pembayaran text NOT NULL DEFAULT 'belum_bayar',
  total_dp bigint NOT NULL DEFAULT 0,
  kekurangan bigint NOT NULL DEFAULT 0,
  total_pembayaran bigint NOT NULL DEFAULT 0,
  fee_freelance bigint NOT NULL DEFAULT 0,
  tanggal_end date,
  status text NOT NULL DEFAULT 'pending',
  status_pelunasan text NOT NULL DEFAULT 'belum_lunas',
  catatan_admin text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.mitra_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view mitra_orders" 
ON public.mitra_orders 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert mitra_orders" 
ON public.mitra_orders 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update mitra_orders" 
ON public.mitra_orders 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete mitra_orders" 
ON public.mitra_orders 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_mitra_orders_updated_at
BEFORE UPDATE ON public.mitra_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();