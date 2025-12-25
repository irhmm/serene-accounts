-- Add deadline column to mitra_orders table
ALTER TABLE public.mitra_orders 
ADD COLUMN tanggal_deadline date;