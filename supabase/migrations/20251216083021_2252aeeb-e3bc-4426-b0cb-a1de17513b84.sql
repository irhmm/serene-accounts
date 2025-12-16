-- Update semua saldo_akhir yang salah menjadi perhitungan per-baris (amountIn - amountOut)
UPDATE transactions 
SET saldo_akhir = jumlah_masuk_dp - jumlah_keluar_dp
WHERE saldo_akhir != (jumlah_masuk_dp - jumlah_keluar_dp);