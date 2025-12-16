-- Buat tabel workers
CREATE TABLE public.workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  nomor_wa text NOT NULL,
  rekening text,
  role text NOT NULL DEFAULT 'freelancer',
  status text NOT NULL DEFAULT 'active',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;

-- Policy: Semua orang bisa melihat (SELECT)
CREATE POLICY "Anyone can view workers"
ON public.workers FOR SELECT
USING (true);

-- Policy: Hanya admin yang bisa INSERT
CREATE POLICY "Admins can insert workers"
ON public.workers FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Hanya admin yang bisa UPDATE
CREATE POLICY "Admins can update workers"
ON public.workers FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Hanya admin yang bisa DELETE
CREATE POLICY "Admins can delete workers"
ON public.workers FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger untuk update timestamp
CREATE TRIGGER update_workers_updated_at
BEFORE UPDATE ON public.workers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();