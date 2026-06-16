@extends('layouts.app')

@section('title', 'Detail Transaksi Peminjaman - E-Pustaka Laravel')

@section('content')
<div class="max-w-xl mx-auto">
    <div class="mb-8 space-y-2">
        <a href="{{ route('peminjaman.index') }}" class="text-xs text-blue-600 hover:underline font-bold flex items-center gap-1">
            ← Kembali ke Daftar Peminjaman
        </a>
        <h1 class="heading-font text-2xl font-extrabold tracking-tight text-slate-900 mt-2">Detail & Pengembalian Buku</h1>
        <p class="text-xs text-slate-500">Pengolahan transaksi peminjaman buku perpustakaan secara real-time.</p>
    </div>

    <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div class="flex items-center gap-4 py-4 border-b border-slate-50">
            <span class="text-3xl">📄</span>
            <div>
                <h4 class="font-bold text-slate-900">Kode Transaksi: TR-{{ $loan->id ?? 'X' }}</h4>
                <p class="text-xs text-slate-400">Terdaftar pada database tanggal {{ date('d M Y', strtotime($loan->borrowDate ?? now())) }}</p>
            </div>
        </div>

        <div class="space-y-4 text-sm">
            <div class="flex justify-between">
                <span class="text-slate-500">Nama Peminjam / Anggota</span>
                <span class="font-bold text-slate-900">{{ $loan->memberName ?? 'Achmad Naufal' }} ({{ $loan->memberId ?? 'M-101' }})</span>
            </div>
            <div class="flex justify-between">
                <span class="text-slate-500">Buku yang Dipinjam</span>
                <span class="font-bold text-blue-600">{{ $loan->bookTitle ?? 'Judul Buku' }}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-slate-500">Tanggal Pinjam</span>
                <span class="font-mono text-slate-900 font-bold">{{ date('d M Y', strtotime($loan->borrowDate ?? now())) }}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-slate-500">Batas Pengembalian</span>
                <span class="font-mono text-slate-900 font-bold">{{ date('d M Y', strtotime($loan->dueDate ?? now())) }}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-slate-500">Status</span>
                <span>
                    @if (($loan->status ?? 'borrowed') == 'returned')
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
                            Returned (Sudah Kembali)
                        </span>
                    @else
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600">
                            Borrowed (Sedang Dipinjam)
                        </span>
                    @endif
                </span>
            </div>
        </div>

        @if (($loan->status ?? 'borrowed') !== 'returned')
            <form action="{{ route('peminjaman.return', ['loan_id' => $loan->id ?? 1]) }}" method="POST" class="pt-4">
                @csrf
                <button 
                    type="submit" 
                    class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md transition-all uppercase tracking-wider"
                >
                    Kembalikan Buku Sekarang
                </button>
            </form>
        @else
            <div class="p-4 rounded-xl bg-slate-50 text-slate-500 text-center text-xs font-mono font-bold">
                Transaksi ini telah diselesaikan dan ditandatangani buku lunas.
            </div>
        @endif
    </div>
</div>
@endsection
