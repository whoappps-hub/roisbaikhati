@extends('layouts.app')

@section('title', 'Form Peminjaman Buku - E-Pustaka Laravel')

@section('content')
<div class="max-w-2xl mx-auto">
    <div class="mb-8 space-y-2">
        <a href="{{ route('katalog.index') }}" class="text-xs text-blue-600 hover:underline font-bold flex items-center gap-1">
            ← Kembali ke Katalog
        </a>
        <h1 class="heading-font text-2xl font-extrabold tracking-tight text-slate-900 mt-2">Formulir Peminjaman Buku</h1>
        <p class="text-xs text-slate-500 font-medium">Buku yang dipilih: <span class="text-slate-900 font-bold">"{{ $book->title }}"</span></p>
    </div>

    @if (session('error'))
        <div class="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
            <b>Gagal!</b> {{ session('error') }}
        </div>
    @endif

    <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8">
        <!-- Mini Info Buku -->
        <div class="w-full md:w-1/3 space-y-3 shrink-0">
            <div class="aspect-[3/4] w-full rounded-2xl bg-slate-100 relative overflow-hidden shadow-md">
                @if (!empty($book->coverUrl))
                    <img src="{{ $book->coverUrl }}" alt="" class="absolute inset-0 w-full h-full object-cover">
                @else
                    <div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white font-serif font-black text-xl">
                        {{ substr($book->title, 0, 2) }}
                    </div>
                @endif
            </div>
            <div>
                <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600">{{ $book->category }}</span>
                <h4 class="font-bold text-slate-900 text-sm mt-1 line-clamp-2 leading-relaxed">{{ $book->title }}</h4>
                <p class="text-[11px] text-slate-400 mt-0.5">Karya {{ $book->author }}</p>
                <div class="text-[10px] font-mono text-slate-500 mt-2">
                    Lokasi: <span class="text-blue-600 font-extrabold">{{ $book->shelfLocation }}</span>
                </div>
            </div>
        </div>

        <!-- Formulir Member input -->
        <form action="{{ route('peminjaman.store') }}" method="POST" class="w-full space-y-5">
            @csrf
            <input type="hidden" name="book_id" value="{{ $book->id }}">

            <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-600 block">ID Anggota *</label>
                <input 
                    required 
                    type="text" 
                    name="memberId" 
                    value="M-101" 
                    placeholder="Contoh: M-101" 
                    class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                />
            </div>

            <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-600 block">Nama Anggota *</label>
                <input 
                    required 
                    type="text" 
                    name="memberName" 
                    value="Achmad Naufal" 
                    placeholder="Nama Lengkap Anggota" 
                    class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                />
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                    <label class="text-xs font-bold text-slate-400 block">Tanggal Pinjam</label>
                    <input 
                        disabled 
                        type="text" 
                        value="{{ date('d M Y') }}" 
                        class="w-full px-4 py-2.5 rounded-xl border border-slate-150 text-slate-400 text-sm bg-slate-50 cursor-not-allowed"
                    />
                </div>
                <div class="space-y-1.5">
                    <label class="text-xs font-bold text-slate-400 block">Batas Pengembalian</label>
                    <input 
                        disabled 
                        type="text" 
                        value="{{ date('d M Y', strtotime('+7 days')) }}" 
                        class="w-full px-4 py-2.5 rounded-xl border border-slate-150 text-slate-400 text-sm bg-slate-50 cursor-not-allowed"
                    />
                </div>
            </div>

            <button 
                type="submit" 
                class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/10 transition-all pt-3.5"
            >
                Konfirmasi Peminjaman
            </button>
        </form>
    </div>
</div>
@endsection
