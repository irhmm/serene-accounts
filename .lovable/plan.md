
# Rencana: Menambahkan Pembatas Bulan pada Semua Tabel

## Ringkasan
Menerapkan fitur pembatas bulan (month separator) yang sudah ada di `TransactionTable` ke tabel-tabel lain yang relevan. Pembatas bulan akan mengelompokkan data berdasarkan bulan/tahun dengan header pemisah yang menampilkan nama bulan dan summary data per bulan.

## Tabel yang Akan Diubah

### 1. OrderTable (Jadwal Order Mitra)
- **Field referensi tanggal**: `tanggalStart` (Tanggal Start Order)
- **Summary per bulan**: Total Order, Total Pembayaran, Total Fee Mitra

### 2. FranchiseFinanceTable (Keuangan Franchise)
- **Field referensi tanggal**: `tanggalClosingOrder` (Tanggal Closing Order)
- **Summary per bulan**: Total Order, Total Revenue, Total Fee Mentor, Total Keuntungan

## Tabel yang TIDAK Diubah
- **FranchiseTable** - Data master (tanggal kontrak, bukan tanggal aktivitas)
- **WorkerTable** - Data master tanpa field tanggal relevan
- **UserTable** - Data master (tanggal daftar, bukan transaksi)

## Tampilan Pembatas Bulan (Referensi dari TransactionTable)
```
┌─────────────────────────────────────────────────────────────┐
│ Februari 2026                    Masuk: Rp X  Keluar: Rp Y  │
├─────────────────────────────────────────────────────────────┤
│ 1 │ 03 Feb 2026 │ DP Order 879 │ Pemasukan │ Rp 300.000    │
├─────────────────────────────────────────────────────────────┤
│ Desember 2025                    Masuk: Rp X  Keluar: Rp Y  │
├─────────────────────────────────────────────────────────────┤
│ 2 │ 18 Des 2025 │ DP Order 879 │ Pemasukan │ Rp 500.000    │
└─────────────────────────────────────────────────────────────┘
```

---

## Detail Teknis

### Perubahan pada OrderTable.tsx

1. **Import tambahan**: `Fragment` dari React, `useMemo`

2. **Logika grouping per bulan**:
   - Kelompokkan orders berdasarkan `tanggalStart` (bulan/tahun)
   - Urutkan grup berdasarkan `sortOrder` (desc/asc)
   - Hitung summary per grup:
     - `totalOrders`: Jumlah order dalam bulan
     - `totalPembayaran`: Sum dari `totalPembayaran`
     - `totalFeeMitra`: Sum dari `feeFreelance`

3. **Render struktur baru**:
   - Loop `groupedOrders` dengan `Fragment`
   - Setiap grup dimulai dengan `TableRow` header bulan (colspan penuh)
   - Diikuti oleh `TableRow` untuk setiap order dalam grup tersebut

4. **Penyesuaian nomor baris**: 
   - Nomor baris dihitung secara kontinyu antar grup (bukan reset per bulan)
   - Hapus penggunaan `currentPage * perPage + index + 1` karena pagination ditangani di level page

### Perubahan pada FranchiseFinanceTable.tsx

1. **Import tambahan**: `Fragment` dari React, `useMemo`

2. **Logika grouping per bulan**:
   - Kelompokkan finances berdasarkan `tanggalClosingOrder` (bulan/tahun)
   - Urutkan grup berdasarkan `sortOrder` (desc/asc)
   - Hitung summary per grup:
     - `totalOrders`: Jumlah record dalam bulan
     - `totalRevenue`: Sum dari `totalPaymentCust`
     - `totalFeeMentor`: Sum dari `feeMentor`
     - `totalKeuntungan`: Sum dari `keuntunganBersih`

3. **Render struktur baru**:
   - Loop `groupedFinances` dengan `Fragment`
   - Setiap grup dimulai dengan `TableRow` header bulan
   - Diikuti oleh `TableRow` untuk setiap finance dalam grup tersebut

4. **Penyesuaian nomor baris**:
   - Nomor baris kontinyu berdasarkan `startIndex` + posisi dalam semua data
   - Tidak reset per bulan

### Styling Header Pembatas Bulan

Menggunakan style yang sama dengan TransactionTable:
```tsx
<TableRow className="bg-muted/30 hover:bg-muted/30 border-y border-muted">
  <TableCell colSpan={totalColumns} className="py-2">
    <div className="flex justify-between items-center">
      <span className="font-semibold text-foreground text-sm">
        {format(new Date(year, month - 1), "MMMM yyyy", { locale: id })}
      </span>
      <div className="flex gap-4 text-xs">
        {/* Summary values */}
      </div>
    </div>
  </TableCell>
</TableRow>
```

### Format Currency
Menggunakan helper function yang sudah ada:
```tsx
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};
```

---

## Urutan Implementasi

1. Update `src/components/order/OrderTable.tsx`:
   - Tambah import Fragment dan useMemo
   - Buat logika grouping berdasarkan tanggalStart
   - Update render dengan month separator
   - Tambah summary per bulan (jumlah order, total pembayaran, total fee)

2. Update `src/components/franchiseFinance/FranchiseFinanceTable.tsx`:
   - Tambah import Fragment dan useMemo
   - Buat logika grouping berdasarkan tanggalClosingOrder
   - Update render dengan month separator
   - Tambah summary per bulan (jumlah order, total revenue, fee mentor, keuntungan)

## Hasil Akhir

Setelah implementasi, semua tabel dengan data berbasis tanggal aktivitas akan memiliki pembatas bulan yang konsisten dengan tampilan TransactionTable, membuat data lebih mudah dibaca dan dianalisis per periode bulanan.
