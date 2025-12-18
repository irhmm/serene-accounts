-- Ubah tipe kolom pj_mentor dari text ke uuid
ALTER TABLE public.franchise_finances 
ALTER COLUMN pj_mentor TYPE uuid USING pj_mentor::uuid;

-- Tambah foreign key constraint
ALTER TABLE public.franchise_finances
ADD CONSTRAINT fk_franchise_finances_pj_mentor
FOREIGN KEY (pj_mentor) REFERENCES public.workers(id)
ON DELETE SET NULL;