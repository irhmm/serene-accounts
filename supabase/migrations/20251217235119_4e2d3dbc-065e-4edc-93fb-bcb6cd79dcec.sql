-- Create franchise_finances table
CREATE TABLE public.franchise_finances (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tanggal_order DATE NOT NULL DEFAULT CURRENT_DATE,
    detail_order TEXT NOT NULL,
    nomor_order TEXT NOT NULL,
    franchise_id UUID REFERENCES public.franchises(id) ON DELETE SET NULL,
    total_payment_cust BIGINT NOT NULL DEFAULT 0,
    tanggal_pembayaran_franchisee DATE,
    status_pembayaran TEXT NOT NULL DEFAULT 'pending',
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.franchise_finances ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view franchise_finances"
ON public.franchise_finances
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert franchise_finances"
ON public.franchise_finances
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update franchise_finances"
ON public.franchise_finances
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete franchise_finances"
ON public.franchise_finances
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_franchise_finances_updated_at
BEFORE UPDATE ON public.franchise_finances
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();