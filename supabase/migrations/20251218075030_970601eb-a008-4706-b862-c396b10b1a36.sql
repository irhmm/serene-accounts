-- Tambah policy public SELECT untuk tabel franchises
CREATE POLICY "Anyone can view franchises"
ON public.franchises
FOR SELECT
USING (true);

-- Tambah policy public SELECT untuk tabel workers
CREATE POLICY "Anyone can view workers"
ON public.workers
FOR SELECT
USING (true);