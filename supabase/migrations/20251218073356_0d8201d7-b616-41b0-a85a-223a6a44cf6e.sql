-- Add new columns to franchise_finances table
ALTER TABLE public.franchise_finances
ADD COLUMN pj_mentor text,
ADD COLUMN status_kelengkapan text NOT NULL DEFAULT 'perlu_adjustment',
ADD COLUMN status_pengerjaan text NOT NULL DEFAULT 'not_started',
ADD COLUMN catatan_handover text;

-- Rename tanggal_order to tanggal_closing_order
ALTER TABLE public.franchise_finances
RENAME COLUMN tanggal_order TO tanggal_closing_order;