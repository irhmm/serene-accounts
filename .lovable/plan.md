
# Rencana: Fitur Total Pendapatan Franchise Belum Dibayar dengan Filter Franchise

## Ringkasan
Menambahkan fitur untuk melihat total pendapatan franchise yang belum dibayarkan (status "pending") dan menambahkan filter berdasarkan nama franchise pada halaman Keuangan Franchise.

## Perubahan yang Akan Dilakukan

### 1. Tambah Filter Franchise pada Search Filter

**File**: `src/components/franchiseFinance/FranchiseFinanceSearchFilter.tsx`

Menambahkan dropdown filter untuk memilih franchise tertentu:
- Opsi "Semua Franchise" (default)
- Daftar nama franchise dari data yang ada
- Filter akan memfilter data berdasarkan `franchiseId`

Props baru yang diperlukan:
- `franchiseFilter: string` - ID franchise yang dipilih
- `onFranchiseFilterChange: (value: string) => void`
- `availableFranchises: { id: string; name: string }[]` - Daftar franchise tersedia

### 2. Tambah Summary Card "Belum Dibayar"

**File**: `src/components/franchiseFinance/FranchiseFinanceSummaryCards.tsx`

Menambahkan card baru yang menampilkan:
- **Total Belum Dibayar**: Sum `komisiMitra` dari record dengan `statusPembayaran === 'pending'`
- Icon: `AlertCircle` atau `Clock` (pending indicator)
- Warna: Amber/warning untuk menarik perhatian
- Admin only: Ya (sama seperti card finansial lainnya)

### 3. Update Logic di Halaman Utama

**File**: `src/pages/KeuanganFranchise.tsx`

Perubahan:
1. Tambah state `franchiseFilter` untuk menyimpan pilihan filter franchise
2. Update `filteredFinances` untuk menyertakan filter franchise
3. Tambah perhitungan `totalBelumDibayar` dalam `totals` useMemo
4. Ekstrak daftar franchise unik untuk dropdown filter
5. Pass props baru ke komponen filter dan summary cards

## Detail Implementasi

### FranchiseFinanceSearchFilter.tsx - Props Baru
```typescript
interface FranchiseFinanceSearchFilterProps {
  // ... props existing
  franchiseFilter: string;
  onFranchiseFilterChange: (value: string) => void;
  availableFranchises: { id: string; name: string }[];
}
```

### FranchiseFinanceSearchFilter.tsx - UI Baru
Menambahkan dropdown setelah filter status:
```tsx
<Select value={franchiseFilter} onValueChange={onFranchiseFilterChange}>
  <SelectTrigger className="w-full sm:w-[180px]">
    <SelectValue placeholder="Franchise" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">Semua Franchise</SelectItem>
    {availableFranchises.map((franchise) => (
      <SelectItem key={franchise.id} value={franchise.id}>
        {franchise.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

### FranchiseFinanceSummaryCards.tsx - Prop & Card Baru
```typescript
interface FranchiseFinanceSummaryCardsProps {
  // ... existing props
  totalBelumDibayar: number;  // Baru
}
```

Card baru:
```tsx
{
  title: 'Total Belum Dibayar',
  value: formatCurrency(totalBelumDibayar),
  icon: Clock,  // atau AlertCircle
  adminOnly: true,
  highlight: true,  // styling khusus warning
}
```

### KeuanganFranchise.tsx - State & Logic Baru

State baru:
```tsx
const [franchiseFilter, setFranchiseFilter] = useState('all');
```

Daftar franchise tersedia:
```tsx
const availableFranchises = useMemo(() => {
  const franchiseMap = new Map<string, string>();
  finances.forEach((f) => {
    if (f.franchiseId && f.franchiseName) {
      franchiseMap.set(f.franchiseId, f.franchiseName);
    }
  });
  return Array.from(franchiseMap.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}, [finances]);
```

Update filter logic:
```tsx
// Di dalam filteredFinances useMemo
const matchesFranchise = franchiseFilter === 'all' || 
  finance.franchiseId === franchiseFilter;
```

Update totals:
```tsx
const totals = useMemo(() => {
  return filteredFinances.reduce(
    (acc, finance) => ({
      // ... existing totals
      totalBelumDibayar: acc.totalBelumDibayar + 
        (finance.statusPembayaran === 'pending' ? finance.komisiMitra : 0),
    }),
    { /* ... existing initial values, */ totalBelumDibayar: 0 }
  );
}, [filteredFinances]);
```

## Urutan Implementasi

1. **Update `FranchiseFinanceSearchFilter.tsx`**
   - Tambah props baru untuk franchise filter
   - Tambah dropdown UI untuk filter franchise

2. **Update `FranchiseFinanceSummaryCards.tsx`**
   - Tambah prop `totalBelumDibayar`
   - Tambah card baru dengan styling warning/amber

3. **Update `KeuanganFranchise.tsx`**
   - Tambah state `franchiseFilter`
   - Tambah useMemo `availableFranchises`
   - Update filter logic
   - Update totals calculation
   - Pass props baru ke komponen child

## Hasil Akhir

User akan dapat:
1. Melihat total pendapatan franchise yang belum dibayar pada summary card
2. Memfilter data berdasarkan nama franchise tertentu
3. Kombinasi filter (franchise + bulan/tahun + status) untuk analisis lebih detail
4. Total belum dibayar akan update sesuai filter yang diterapkan
