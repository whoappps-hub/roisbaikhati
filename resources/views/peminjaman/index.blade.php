@extends('layouts.app')

@section('title', 'Histori Peminjaman - E-Pustaka Laravel')

@section('content')
<div class="mb-8 space-y-2">
    <span class="px-3 py-1 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-mono font-black uppercase tracking-wider">Transaksi Aktif</span>
    <h1 class="heading-font text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Histori Peminjaman & Buku Anggota</h1>
    <p class="text-xs text-slate-500 dark:text-slate-400">Pantau buku yang sedang dipinjam, terlambat (overdue), maupun yang sudah dikembalikan dengan tertib.</p>
</div>

@if(session('role', 'user') !== 'admin')
    <div class="mb-6 p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-900/40 border border-blue-100 dark:border-blue-950/40 text-slate-600 dark:text-slate-400 text-xs sm:text-sm flex items-start gap-3 shadow-2xs">
        <span class="text-lg">💡</span>
        <div>
            <b>Informasi Anggota</b>: Anda sedang melihat histori buku pinjaman Anda. Sesuai kebijakan perpustakaan, pengembalian buku <b>harus divalidasi langsung oleh Pustakawan</b> dan tidak dapat disubmit mandiri oleh siswa.
            <div class="mt-2 text-[11px] text-slate-500 font-mono">
                * Untuk mencoba fitur pengembalian buku, silakan gunakan tombol <b>"Pustakawan (Admin)"</b> di pojok kanan atas sistem simulasi.
            </div>
        </div>
    </div>
@endif

@if (session('success'))
    <div class="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-3">
        <span>✅</span>
        <div><b>Sukses!</b> {{ session('success') }}</div>
    </div>
@endif

@if (session('error'))
    <div class="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/25 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-sm flex items-center gap-3">
        <span>⚠️</span>
        <div><b>Gagal!</b> {{ session('error') }}</div>
    </div>
@endif

<!-- Tabel Transaksi Peminjaman -->
<div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850/40 shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse">
            <thead>
                <tr class="bg-slate-50 dark:bg-slate-900/20 border-b border-slate-100 dark:border-slate-850/30 text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px] tracking-wider">
                    <th class="p-4.5 font-bold">Informasi Peminjam</th>
                    <th class="p-4.5 font-bold">Judul Buku</th>
                    <th class="p-4.5 font-bold">Tanggal Pinjam</th>
                    <th class="p-4.5 font-bold">Batas Pengembalian</th>
                    <th class="p-4.5 font-bold">Status</th>
                    <th class="p-4.5 font-bold text-right">Aksi Tindakan</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-850/20">
                @if (count($loans) === 0)
                    <tr>
                        <td colspan="6" class="p-8 text-center text-slate-400 font-mono text-xs">
                            Belum ada rekam transaksi pengembalian atau peminjaman terdeteksi.
                        </td>
                    </tr>
                @else
                    @foreach ($loans as $loan)
                        <tr class="hover:bg-slate-50/40 dark:hover:bg-slate-850/10 transition-colors">
                            <td class="p-4.5">
                                <div class="font-extrabold text-slate-900 dark:text-slate-100">{{ $loan->memberName }}</div>
                                <div class="text-[10px] text-slate-400 font-mono">ID: {{ $loan->memberId }}</div>
                            </td>
                            <td class="p-4.5">
                                <div class="font-bold text-slate-800 dark:text-slate-200">{{ $loan->bookTitle }}</div>
                                <div class="text-[10px] text-slate-400 font-mono">Buku-ID: {{ $loan->bookId }}</div>
                            </td>
                            <td class="p-4.5 font-mono text-xs text-slate-600 dark:text-slate-400">
                                {{ date('d M Y', strtotime($loan->borrowDate)) }}
                            </td>
                            <td class="p-4.5 font-mono text-xs text-slate-600 dark:text-slate-400">
                                {{ date('d M Y', strtotime($loan->dueDate)) }}
                            </td>
                            <td class="p-4.5">
                                @if ($loan->status == 'returned')
                                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/25 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/10 shrink-0">
                                        Sudah Kembali
                                    </span>
                                @elseif ($loan->status == 'overdue' || (strtotime($loan->dueDate) < time() && $loan->returnDate === null))
                                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/25 text-rose-600 dark:text-rose-450 border border-rose-100 dark:border-rose-900/10 animate-pulse shrink-0">
                                        Terlambat
                                    </span>
                                @else
                                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/25 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/10 shrink-0">
                                        Dipinjam
                                    </span>
                                @endif
                            </td>
                            <td class="p-4.5 text-right">
                                @if ($loan->status !== 'returned')
                                    @if(session('role', 'user') === 'admin')
                                        <form action="{{ route('peminjaman.return', ['loan_id' => $loan->id]) }}" method="POST" class="inline">
                                            @csrf
                                            <button 
                                                type="submit" 
                                                class="px-3.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/15 text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all shadow-xs"
                                                onclick="return confirm('Kembalikan buku ini dan perbarui stok?');"
                                            >
                                                Kembalikan (Admin)
                                            </button>
                                        </form>
                                    @else
                                        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200/50 dark:border-slate-750 text-[10px] font-bold" title="Aksi pengembalian hanya dapat dilakukan oleh Pustakawan/Admin di Portal Admin">
                                            <i data-lucide="lock" class="w-3.5 h-3.5"></i>
                                            <span>Kontrol Pustakawan</span>
                                        </span>
                                    @endif
                                @else
                                    <span class="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100/55 dark:border-emerald-900/10 px-2.5 py-1 rounded-lg">
                                        Lunas ({{ date('d M Y', strtotime($loan->returnDate)) }})
                                    </span>
                                @endif
                            </td>
                        </tr>
                    @endforeach
                @endif
            </tbody>
        </table>
    </div>
</div>
@endsection
