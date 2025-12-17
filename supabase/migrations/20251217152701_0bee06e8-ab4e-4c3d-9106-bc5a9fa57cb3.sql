-- Create franchise_orders table
CREATE TABLE public.franchise_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nomor_order TEXT NOT NULL,
  detail_order TEXT NOT NULL,
  tanggal_masuk DATE NOT NULL DEFAULT CURRENT_DATE,
  catatan TEXT,
  deadline DATE,
  pj_franchisee TEXT NOT NULL,
  total_pembayaran BIGINT NOT NULL DEFAULT 0,
  status_kelengkapan TEXT NOT NULL DEFAULT 'perlu_detail',
  catatan_handover TEXT,
  pj_mentor TEXT NOT NULL,
  tanggal_selesai DATE,
  status_pengerjaan TEXT NOT NULL DEFAULT 'not_started',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.franchise_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view franchise_orders"
ON public.franchise_orders
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert franchise_orders"
ON public.franchise_orders
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update franchise_orders"
ON public.franchise_orders
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete franchise_orders"
ON public.franchise_orders
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));