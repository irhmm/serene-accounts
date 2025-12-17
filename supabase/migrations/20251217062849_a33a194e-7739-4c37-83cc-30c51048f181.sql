-- Create franchises table
CREATE TABLE public.franchises (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_franchise text NOT NULL,
    alamat text NOT NULL,
    kontrak_mulai date NOT NULL,
    kontrak_berakhir date NOT NULL,
    keterangan text NOT NULL DEFAULT 'non_verified',
    rekening text,
    catatan text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.franchises ENABLE ROW LEVEL SECURITY;

-- Admin-only policies
CREATE POLICY "Admins can view franchises"
ON public.franchises FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert franchises"
ON public.franchises FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update franchises"
ON public.franchises FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete franchises"
ON public.franchises FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_franchises_updated_at
    BEFORE UPDATE ON public.franchises
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();