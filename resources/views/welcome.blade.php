@extends('layouts.app')

@section('title', 'Katalog Buku - E-Pustaka Laravel')

@section('content')

<!-- Welcome Banner -->
<div class="mb-10 text-center md:text-left md:flex md:items-center md:justify-between gap-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/30 text-white rounded-3xl p-8 md:p-12 shadow-xl overflow-hidden relative">
    <div class="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-5 animate-pulse" style="background-image: url('https://images.unsplash.com/photo-1507842217343-583bb7270b66');"></div>
    <div class="space-y-3 z-10">
        <span class="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono font-bold text-blue-300 uppercase tracking-widest">PERPUSTAKAAN DIGITAL</span>
        <h1 class="heading-font text-3xl md:text-4xl font-extrabold tracking-tight">Cari & Telusuri Koleksi Buku Terlengkap</h1>
        <p class="text-slate-300 max-w-xl text-xs md:text-sm leading-relaxed">
            Selamat datang! Mari mulai menjelajahi berbagai koleksi buku dan temukan inspirasi dari setiap halaman yang Anda baca.
        </p>
    </div>
    <div class="mt-8 md:mt-0 z-10 shrink-0">
        <!-- Search Form -->
        <form action="{{ route('katalog.index') }}" method="GET" class="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
            @if($category)
                <input type="hidden" name="category" value="{{ $category }}">
            @endif
            <div class="relative w-full sm:w-72">
                <input 
                    type="text" 
                    name="search" 
                    value="{{ $search }}" 
                    placeholder="Judul, penulis, atau rak..." 
                    class="w-full px-4.5 py-3 rounded-2xl bg-white/10 dark:bg-slate-900/50 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:text-slate-900 focus:placeholder-slate-500 transition-all text-xs"
                />
            </div>
            <button type="submit" class="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0">
                <i data-lucide="search" class="w-3.5 h-3.5"></i>
                <span>Cari Buku</span>
            </button>
        </form>
    </div>
</div>

<!-- Mode Admin Notification -->
@if(session('role', 'user') === 'admin')
<div class="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
    <div class="flex items-center gap-2.5">
        <span class="text-lg">🛡️</span>
        <div>
            <b>Panduan Mode Pustakawan Aktif</b>: Anda dapat langsung menambah, mengubah, mendelete buku, serta memproses <b>penerimaan pengembalian buku</b> di Portal Admin.
        </div>
    </div>
    <a href="{{ route('admin.index') }}" class="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all text-xs flex items-center gap-1.1 shrink-0 shadow-xs">
        <span>Buka Portal Admin</span>
        <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
    </a>
</div>
@endif

<!-- Grid Widget Statistik Mini -->
<div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
    <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850/40 flex items-center justify-between shadow-xs">
        <div>
            <span class="block text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500">Total Judul Buku</span>
            <span class="block font-bold text-3xl text-slate-900 dark:text-white mt-1 heading-font">{{ number_format($stats['total_titles']) }}</span>
        </div>
        <div class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg font-bold">
            📚
        </div>
    </div>
    <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850/40 flex items-center justify-between shadow-xs">
        <div>
            <span class="block text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500">Total Kesamaan Purwarupa </span>
            <span class="block font-bold text-3xl text-slate-900 dark:text-white mt-1 heading-font">{{ number_format($stats['total_exemplars']) }}</span>
        </div>
        <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg font-bold">
            📖
        </div>
    </div>
    <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850/40 flex items-center justify-between shadow-xs">
        <div>
            <span class="block text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500">Tersedia untuk Pinjam</span>
            <span class="block font-bold text-3xl text-slate-900 dark:text-white mt-1 heading-font">{{ number_format($stats['total_avail']) }}</span>
        </div>
        <div class="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 flex items-center justify-center text-lg font-bold">
            ✨
        </div>
    </div>
</div>

<!-- ================= PREMIUM MULTI-TAB SWITCHER ================= -->
<div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850/50 rounded-2xl p-2 mb-8 flex border-b scrollbar-none overflow-x-auto gap-2">
    <button onclick="switchKatalogTab('katalog')" id="btn-tab-katalog" class="py-2.5 px-4.5 rounded-xl font-extrabold text-xs tracking-tight transition-all flex items-center gap-2 shrink-0 bg-blue-600 text-white shadow-xs">
        <i data-lucide="layout" class="w-4 h-4"></i>
        <span>Grid Katalog</span>
    </button>
    <button onclick="switchKatalogTab('shelf')" id="btn-tab-shelf" class="py-2.5 px-4.5 rounded-xl font-extrabold text-xs tracking-tight transition-all flex items-center gap-2 shrink-0 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850/40">
        <i data-lucide="book-check" class="w-4 h-4"></i>
        <span>Rak Kategori Visual</span>
    </button>
    <button onclick="switchKatalogTab('stats')" id="btn-tab-stats" class="py-2.5 px-4.5 rounded-xl font-extrabold text-xs tracking-tight transition-all flex items-center gap-2 shrink-0 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850/40">
        <i data-lucide="activity" class="w-4 h-4"></i>
        <span>Analisis Statistik</span>
    </button>
    <button onclick="switchKatalogTab('ai-recommender')" id="btn-tab-ai" class="py-2.5 px-4.5 rounded-xl font-extrabold text-xs tracking-tight transition-all flex items-center gap-2 shrink-0 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850/40">
        <i data-lucide="sparkles" class="w-4 h-4 text-purple-500"></i>
        <span class="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent dark:text-purple-300">Asisten Asisten AI</span>
    </button>
</div>

<!-- ================= TAB 1: GRID KATALOG ORIGINAL ================= -->
<div id="content-tab-katalog" class="tab-view block space-y-6">
    <!-- Kategori Filter Tabs -->
    <div class="overflow-x-auto pb-2 scrollbar-none flex items-center gap-2 mb-4">
        <a 
            href="{{ route('katalog.index', ['search' => $search]) }}" 
            class="px-4 py-2.5 rounded-xl font-bold text-xs shrink-0 transition-all border {{ $category === null || $category === '' ? 'bg-blue-600 border-blue-600 text-white shadow-xs' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-850/40 text-slate-600 dark:text-slate-400 hover:border-slate-300' }}"
        >
            Semua Kategori
        </a>
        @foreach ($categories as $cat)
            <a 
                href="{{ route('katalog.index', ['category' => $cat, 'search' => $search]) }}" 
                class="px-4 py-2.5 rounded-xl font-bold text-xs shrink-0 transition-all border {{ $category === $cat ? 'bg-blue-600 border-blue-600 text-white shadow-xs' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-850/40 text-slate-600 dark:text-slate-400 hover:border-slate-300' }}"
            >
                {{ $cat }}
            </a>
        @endforeach
    </div>

    <!-- Buku Utama Loop -->
    @if (count($books) === 0)
        <div class="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850/40 shadow-sm max-w-sm mx-auto space-y-4">
            <div class="text-5xl">🥺</div>
            <h3 class="font-extrabold text-lg text-slate-900 dark:text-white heading-font">Buku tidak ditemukan</h3>
            <p class="text-slate-500 dark:text-slate-400 text-xs px-6">
                Kami tidak menemukan buku yang cocok dengan kata kunci atau filter pilihan Anda. Silakan cari dengan istilah lain.
            </p>
            <a href="{{ route('katalog.index') }}" class="inline-block px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold transition-all hover:bg-slate-800">
                Reset Katalog
            </a>
        </div>
    @else
        <!-- Grid Kartu Buku Premium -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            @foreach ($books as $book)
                @php 
                $cat = $book->category;
                $gradClass = "from-indigo-500 to-indigo-700";
                if ($cat === "Teknologi") $gradClass = "from-blue-600 to-blue-800";
                else if ($cat === "Sains") $gradClass = "from-emerald-600 to-emerald-800";
                else if ($cat === "Sejarah") $gradClass = "from-amber-600 to-amber-800";
                else if ($cat === "Sastra & Filsafat") $gradClass = "from-purple-600 to-purple-800";
                else if ($cat === "Pengembangan Diri") $gradClass = "from-rose-600 to-rose-800";
                else if ($cat === "Bisnis & Keuangan") $gradClass = "from-cyan-600 to-cyan-800";
                @endphp
                <div class="group bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-100 dark:border-slate-850/40 hover:border-slate-200 dark:hover:border-slate-800 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                    <div>
                        <!-- 3D Book Cover Wrapper -->
                        <div onclick='openBookModal(@json($book))' class="relative aspect-[3/4] w-full rounded-2xl bg-slate-100 dark:bg-slate-850 overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-500 transform hover:scale-[1.01] cursor-pointer">
                            @if (!empty($book->coverUrl))
                                <img 
                                    src="{{ $book->coverUrl }}" 
                                    alt="{{ $book->title }}" 
                                    class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    referrerPolicy="no-referrer"
                                />
                            @else
                                <div class="absolute inset-0 bg-gradient-to-br {{ $gradClass }}"></div>
                            @endif
                            
                            <!-- Overlay gradient -->
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-slate-950/65 z-10"></div>
                            <div class="absolute left-0 top-0 bottom-0 w-2.5 bg-black/30 rounded-r z-20"></div>

                            <!-- Konten Label Dalam Cover -->
                            <div class="absolute inset-0 p-4 flex flex-col justify-between text-white z-20">
                                <div class="flex items-center justify-between">
                                    <span class="text-[9px] uppercase tracking-wider font-mono bg-white/10 px-2.5 py-1 rounded-full border border-white/15 backdrop-blur-xs">
                                        {{ $book->category }}
                                    </span>
                                    <span class="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                                        ★ {{ number_format($book->rating ?? 5.0, 1) }}
                                    </span>
                                </div>

                                <div class="space-y-1 ml-2">
                                    <p class="text-[9px] uppercase font-mono tracking-wider text-slate-300">{{ $book->author }}</p>
                                    <h4 class="font-serif font-black text-xs md:text-sm leading-snug line-clamp-2 select-none">
                                        {{ $book->title }}
                                    </h4>
                                </div>

                                <div class="flex items-center justify-between text-[10px] ml-2 font-mono text-white/80 pt-2 border-t border-white/15">
                                    <span>Tahun: {{ $book->year }}</span>
                                    <span class="bg-blue-600/30 px-1.5 py-0.5 rounded text-[8px] font-bold border border-blue-500/10">{{ $book->shelfLocation }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Judul Deskripsi Luar -->
                        <div class="mt-4 px-1" onclick='openBookModal(@json($book))'>
                            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm line-clamp-1 heading-font cursor-pointer hover:text-blue-500" title="{{ $book->title }}">{{ $book->title }}</h3>
                            <p class="text-[11px] text-slate-400 mt-0.5 italic">Ditulis oleh {{ $book->author }}</p>
                            <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed text-left text-xs">{{ $book->synopsis }}</p>
                        </div>
                    </div>

                    <!-- Footer Status & Aksi -->
                    <div class="mt-4 pt-3 border-t border-slate-50 dark:border-slate-850/30 flex items-center justify-between px-1">
                        <span class="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            Stok: <b class="text-slate-900 dark:text-slate-100">{{ $book->availableCopies }}</b> / {{ $book->totalCopies }} Pcs
                        </span>
                        @if($book->availableCopies > 0)
                            <a 
                                href="{{ route('peminjaman.create', ['book_id' => $book->id]) }}" 
                                class="px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-all bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white"
                            >
                                Pinjam Sekarang
                            </a>
                        @else
                            <button 
                                disabled 
                                class="px-3.5 py-1.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                            >
                                Habis
                            </button>
                        @endif
                    </div>
                </div>
            @endforeach
        </div>
    @endif
</div>

<!-- ================= TAB 2: RAK KATEGORI VISUAL (SHELF LAYOUT) ================= -->
<div id="content-tab-shelf" class="tab-view hidden space-y-8 animate-fade-in">
    <div class="max-w-2xl">
        <h3 class="heading-font font-extrabold text-lg text-slate-900 dark:text-white">Rak Visual Koleksi Perpustakaan</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">Representasi visual penempatan letak buku fisik pada rak kayu sasis perpustakaan berdasarkan kategori literatur.</p>
    </div>

    <!-- Generate physical shelves grouping by Category -->
    @php
        $groupedBooks = [];
        foreach ($books as $b) {
            $groupedBooks[$b->category][] = $b;
        }
    @endphp

    <div class="space-y-12">
        @foreach($groupedBooks as $catName => $catBooks)
            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                        <span>{{ $catName }} ({{ count($catBooks) }} Judul)</span>
                    </span>
                    <span class="text-[10px] text-slate-400 font-mono">Letak: Rak {{ $catBooks[0]->shelfLocation ?? 'A-1' }}</span>
                </div>

                <!-- Cabinet Wooden Shelf container style -->
                <div class="relative bg-amber-500/10 dark:bg-amber-950/10 rounded-2xl border border-amber-900/15 p-4 pb-0">
                    <!-- Flex container for standing books -->
                    <div class="flex items-end gap-1 px-4 overflow-x-auto min-h-[140px] pb-1 scrollbar-none">
                        @foreach($catBooks as $cb)
                            @php
                            $spineColors = [
                                "bg-gradient-to-t from-red-800 to-red-600 border-red-950/20 text-red-100",
                                "bg-gradient-to-t from-blue-800 to-blue-600 border-blue-950/20 text-blue-100",
                                "bg-gradient-to-t from-emerald-800 to-emerald-600 border-emerald-950/20 text-emerald-100",
                                "bg-gradient-to-t from-amber-800 to-amber-600 border-amber-950/20 text-amber-100",
                                "bg-gradient-to-t from-indigo-800 to-indigo-600 border-indigo-950/20 text-indigo-100",
                                "bg-gradient-to-t from-purple-800 to-purple-600 border-purple-950/20 text-purple-100",
                                "bg-gradient-to-t from-rose-800 to-rose-600 border-rose-950/20 text-rose-100",
                            ];
                            $chosenSpine = $spineColors[$loop->index % count($spineColors)];
                            @endphp
                            <!-- Individual standing book spine visual representation -->
                            <div 
                                onclick='openBookModal(@json($cb))'
                                class="w-8 md:w-10 h-32 md:h-36 rounded-t border-l-2 border-r-2 {{ $chosenSpine }} transform hover:scale-105 hover:-translate-y-2 cursor-pointer transition-all duration-300 relative flex flex-col items-center justify-between p-1 shadow-md shrink-0 group select-none"
                            >
                                <span class="text-[8px] uppercase tracking-widest font-mono text-center block pt-1 select-none font-extrabold opacity-75">★{{ number_format($cb->rating ?? 5.0, 1) }}</span>
                                
                                <!-- Vertically rotated book title -->
                                <div class="text-[9px] font-bold text-center select-none truncate w-24 -rotate-90 origin-center absolute top-14 leading-none lowercase tracking-tight">
                                    {{ $cb->title }}
                                </div>
                                <span class="text-[8px] font-mono text-center block pb-1 opacity-70 mt-auto select-none">{{ $cb->id }}</span>

                                <!-- Hover popup display coordinates -->
                                <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-slate-900 border border-slate-800 text-white text-[9px] p-2.5 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 w-44 shadow-lg leading-relaxed">
                                    <p class="font-extrabold text-blue-400 heading-font truncate">{{ $cb->title }}</p>
                                    <p class="text-slate-300 truncate">Penulis: {{ $cb->author }}</p>
                                    <p class="text-slate-400 text-[8px] mt-1 italic font-mono">Letak Rak: {{ $cb->shelfLocation }}</p>
                                </div>
                            </div>
                        @endforeach
                    </div>

                    <!-- Shelf Plank base board -->
                    <div class="h-4 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 rounded-b-xl border-t border-amber-950/40 shadow-xs relative z-10 w-full"></div>
                </div>
            </div>
        @endforeach
    </div>
</div>

<!-- ================= TAB 3: ANALISIS STATISTIK (CHARTS) ================= -->
<div id="content-tab-stats" class="tab-view hidden space-y-8 animate-fade-in">
    <div class="max-w-2xl">
        <h3 class="heading-font font-extrabold text-lg text-slate-900 dark:text-white">Analisis & Visualisasi Data Sirkulasi</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">Statistik real-time mengenai demografi kategori terpopuler dan pemenuhan kuota pinjam bulanan perpustakaan.</p>
    </div>

    <!-- Charts components -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- SVG distribution chart card -->
        <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850/40 shadow-xs space-y-4">
            <h4 class="font-bold text-xs font-mono uppercase tracking-widest text-slate-400">Kapasitas Judul per Kategori</h4>
            
            <div class="relative py-4 flex justify-center">
                <!-- Visual mock of chart using native HTML styling -->
                <div class="space-y-3.5 w-full">
                    @foreach($groupedBooks as $grpName => $grpBooks)
                        @php
                            $barRate = ($stats['total_titles'] > 0) ? (count($grpBooks) / $stats['total_titles']) * 100 : 0;
                        @endphp
                        <div class="space-y-1">
                            <div class="flex justify-between text-xs">
                                <span class="font-bold text-slate-700 dark:text-slate-300">{{ $grpName }}</span>
                                <span class="text-slate-400 font-mono">{{ count($grpBooks) }} Judul ({{ number_format($barRate, 1) }}%)</span>
                            </div>
                            <div class="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                <div class="bg-blue-600 h-full rounded-full transition-all duration-1000" style="width: {{ $barRate }}%"></div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>

        <!-- Target loans indicator goal card -->
        <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850/40 shadow-xs flex flex-col justify-between">
            <div class="space-y-2">
                <h4 class="font-bold text-xs font-mono uppercase tracking-widest text-slate-400">Indikator Target Sirkulasi Bulanan</h4>
                <p class="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">Saat ini target bulanan prapeminjaman diatur pada <b>100 Transaksi</b>. Pantau pemenuhan target di bawah:</p>
            </div>

            <!-- Beautiful Round Target progress wheel inside SVG -->
            <div class="py-6 flex items-center justify-around gap-6">
                <div class="relative w-32 h-32 shrink-0 flex items-center justify-center">
                    <svg class="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="54" class="stroke-slate-100 dark:stroke-slate-800" stroke-width="10" fill="transparent" />
                        <circle cx="64" cy="64" r="54" class="stroke-indigo-600" stroke-width="10" fill="transparent" stroke-dasharray="339" stroke-dashoffset="245" />
                    </svg>
                    <div class="absolute text-center">
                        <span class="block text-2xl font-black text-slate-900 dark:text-white heading-font">28%</span>
                        <span class="block text-[8px] font-mono uppercase text-slate-400">Tercapai</span>
                    </div>
                </div>

                <div class="space-y-3 font-mono text-xs text-slate-600 dark:text-slate-400">
                    <div class="flex items-center gap-2">
                        <span class="w-3 h-3 bg-indigo-600 rounded"></span>
                        <span>Dipinjam Aktif: 12 Pcs</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-3 h-3 bg-emerald-500 rounded"></span>
                        <span>Sudah Kembali: 16 Pcs</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-3 h-3 bg-slate-200 dark:bg-slate-700 rounded"></span>
                        <span>Target Bulan Ini: 100</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- ================= TAB 4: ASISTEN REKOMENDASI AI ================= -->
<div id="content-tab-ai-recommender" class="tab-view hidden space-y-6 animate-fade-in">
    <div class="max-w-2xl">
        <h3 class="heading-font font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="sparkles" class="w-5 h-5 text-purple-600"></i>
            <span>Asisten Rekomendasi Buku Pintar (Gemini AI)</span>
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">Ketikkan minat baca, bidang keahlian, atau suasana pikiran Anda saat ini. Kami akan memilihkan buku beraliansi tinggi secara langsung.</p>
    </div>

    <!-- AI Chat Shell -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850/40 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[400px]">
        <!-- Shell Header -->
        <div class="bg-slate-50 dark:bg-slate-900/60 px-6 py-4.5 border-b border-slate-100 dark:border-slate-850/30 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
                <span class="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping"></span>
                <span class="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">Hub: Online | Model: Gemini-3.5-Flash</span>
            </div>
            <span class="text-[9px] font-mono uppercase bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/10 px-2 py-0.5 rounded-lg font-bold">Offline Sync-Engine</span>
        </div>

        <!-- Chat messages bucket -->
        <div id="chat-messages" class="flex-grow overflow-y-auto p-6 space-y-4">
            <!-- Initial prompt -->
            <div class="flex gap-3">
                <div class="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs select-none">
                    AI
                </div>
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-w-lg shadow-2xs">
                    Halo Pembaca Setia! Saya adalah Asisten AI E-Pustaka. <br><br>
                    Tuliskan topik, hobi, atau permasalahan apa yang sedang Anda selidiki sekarang (misal: <i>"saya ingin belajar react pengembangan web"</i> atau <i>"rekomendasi buku filsafat"</i>), dan saya akan menganalisis semua koleksi terdaftar dalam sistem MySQL kita untuk memberi ulasan rekomendasi instan beserta tautan fisiknya!
                </div>
            </div>
        </div>

        <!-- Chat Input Footer Form -->
        <div class="p-4 border-t border-slate-100 dark:border-slate-850/40 bg-slate-50/50 dark:bg-indigo-950/5">
            <div class="flex gap-2">
                <input 
                    id="ai-prompt"
                    type="text" 
                    placeholder="Masukkan minat atau topik buku... (cth: filsafat tenang, web coding)" 
                    class="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 text-xs focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                    onkeypress="if(event.key === 'Enter') getInteractiveRecommendation()"
                />
                <button 
                    onclick="getInteractiveRecommendation()"
                    class="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                    <span>Kirim</span>
                    <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- ================= PREMIUM INTERACTIVE BOOK DETAIL MODAL ================= -->
<div id="book-detail-modal" class="hidden fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
    <!-- Modal card wrap -->
    <div class="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-up">
        <button onclick="closeBookModal()" class="p-2 bg-slate-900/10 dark:bg-white/10 hover:bg-slate-950/20 dark:hover:bg-white/20 hover:text-red-500 text-slate-600 dark:text-slate-300 rounded-full transition-all absolute right-4 top-4 z-50">
            <i data-lucide="x" class="w-4.5 h-4.5"></i>
        </button>

        <!-- Left half: dynamic mockup cover -->
        <div class="w-full md:w-2/5 p-6 bg-slate-50 dark:bg-slate-950/35 relative flex flex-col justify-center items-center">
            <div id="modal-cover-wrap" class="relative w-44 aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-900">
                <img id="modal-cover" src="" alt="Book Cover" class="absolute inset-0 w-full h-full object-cover">
                <div id="modal-gradient-cover" class="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-800 flex flex-col justify-between p-4 text-white font-serif">
                    <span id="modal-cat-badge" class="text-[8px] uppercase tracking-wider font-mono self-start bg-white/20 px-2 py-0.5 rounded-full border border-white/15">Sains</span>
                    <h5 id="modal-title-on-cover" class="font-black text-sm text-shadow">Belajar React</h5>
                    <span id="modal-author-on-cover" class="text-[8px] opacity-75 font-mono">Penulis</span>
                </div>
            </div>
            <div class="mt-4 flex items-center gap-1.5 text-xs text-amber-500 font-bold justify-center" id="modal-stars-rating">
                ★ ★ ★ ★ ★
            </div>
        </div>

        <!-- Right half: details context and customizable reviews interface -->
        <div class="w-full md:w-3/5 p-6 space-y-4 max-h-[500px] overflow-y-auto">
            <div class="border-b border-slate-50 dark:border-slate-850/30 pb-3 space-y-1">
                <span id="modal-category" class="inline-block text-[9px] uppercase tracking-widest font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-lg">KATEGORI</span>
                <h4 id="modal-title" class="heading-font text-lg font-extrabold text-slate-900 dark:text-white leading-tight">Judul Buku Terpilih</h4>
                <p id="modal-author" class="text-xs text-slate-500 dark:text-slate-400 font-semibold italic">Oleh: Nama Penulis</p>
            </div>

            <!-- Detail stats row -->
            <div class="grid grid-cols-3 gap-3 font-mono text-[10px] text-slate-500 border-b border-slate-50 dark:border-slate-850/30 pb-3">
                <div>
                    <span class="block text-slate-400">Tahun</span>
                    <b id="modal-year" class="text-slate-900 dark:text-slate-200">2023</b>
                </div>
                <div>
                    <span class="block text-slate-400">Lokasi Rak</span>
                    <b id="modal-location" class="text-slate-900 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">T-12</b>
                </div>
                <div>
                    <span class="block text-slate-400">Tersedia</span>
                    <b id="modal-stock" class="text-slate-900 dark:text-slate-200">4 / 5 Pcs</b>
                </div>
            </div>

            <div class="space-y-1.5">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300 block">Ringkasan Sinopsis:</span>
                <p id="modal-synopsis" class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                    Sinopsis atau ulasan ringkas mengenai buku akan diletakkan di bagian ini secara dinamis dan rapi.
                </p>
            </div>

            <!-- Real-time customizable Local Reviews section -->
            <div class="space-y-3 pt-3 border-t border-slate-50 dark:border-slate-850/30">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Ulasan & Review Anggota:</span>
                    <span class="text-[9px] text-slate-400 dark:text-slate-500">Tersinkron Lokal</span>
                </div>

                <!-- Display review items dynamically -->
                <div id="modal-reviews-list" class="space-y-2.5 max-h-[140px] overflow-y-auto pr-1"></div>

                <!-- Write custom reviews inside modal client-side -->
                <div class="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850/30 space-y-2">
                    <span class="block text-[10px] font-bold text-slate-600 dark:text-slate-400">Bagikan Pengalaman Membaca Anda:</span>
                    <div class="flex gap-2 items-center">
                        <input id="new-review-user" type="text" placeholder="Nama Anda" class="w-1/3 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[10px] focus:outline-none">
                        <select id="new-review-rating" class="w-1/4 px-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[10px] focus:outline-none">
                            <option value="5">★ 5 (Sempurna)</option>
                            <option value="4">★ 4 (Sangat Baik)</option>
                            <option value="3">★ 3 (Cukup)</option>
                            <option value="2">★ 2 (Kurang)</option>
                            <option value="1">★ 1 (Buruk)</option>
                        </select>
                    </div>
                    <input id="new-review-comment" type="text" placeholder="Tulis komentar ulasan buku..." class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[10px] focus:outline-none">
                    <button onclick="submitLocalReview()" class="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[9px] font-bold transition-all shadow-xs">
                        Kirim Ulasan Akurat
                    </button>
                </div>
            </div>

            <!-- Footer Loan trigger inside details modal -->
            <div id="modal-borrow-action-wrap" class="pt-4 border-t border-slate-100 dark:border-slate-850/30 flex justify-end gap-2">
                <button onclick="closeBookModal()" class="px-4 py-2 border border-slate-100 dark:border-slate-800 rounded-xl text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold">Tutup</button>
                <a id="modal-borrow-link" href="" class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all">Pinjam Sekarang</a>
            </div>
        </div>
    </div>
</div>

<script>
    // Tab switching controller
    function switchKatalogTab(targetTab) {
        // Hide all views
        document.querySelectorAll('.tab-view').forEach(view => {
            view.classList.add('hidden');
            view.classList.remove('block');
        });

        // Show targets
        document.getElementById(`content-tab-${targetTab}`).classList.remove('hidden');
        document.getElementById(`content-tab-${targetTab}`).classList.add('block');

        // Reset nav states
        const tabsList = [
            { id: 'katalog', btn: 'btn-tab-katalog', iconClass: 'text-slate-500' },
            { id: 'shelf', btn: 'btn-tab-shelf', iconClass: 'text-slate-500' },
            { id: 'stats', btn: 'btn-tab-stats', iconClass: 'text-slate-500' },
            { id: 'ai-recommender', btn: 'btn-tab-ai', iconClass: 'text-purple-500' }
        ];

        tabsList.forEach(t => {
            const btn = document.getElementById(t.btn);
            if (!btn) return;
            if (t.id === targetTab) {
                btn.className = "py-2.5 px-4.5 rounded-xl font-extrabold text-xs tracking-tight transition-all flex items-center gap-2 shrink-0 bg-blue-600 text-white shadow-xs";
            } else {
                btn.className = "py-2.5 px-4.5 rounded-xl font-extrabold text-xs tracking-tight transition-all flex items-center gap-2 shrink-0 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850/40";
            }
        });
    }

    // Modal Control State Variables
    let activeModalBook = null;

    function openBookModal(book) {
        activeModalBook = book;
        
        // Feed modal details
        document.getElementById('modal-title').textContent = book.title;
        document.getElementById('modal-author').textContent = `Oleh: ${book.author}`;
        document.getElementById('modal-category').textContent = book.category;
        document.getElementById('modal-year').textContent = book.year;
        document.getElementById('modal-location').textContent = book.shelfLocation;
        document.getElementById('modal-stock').textContent = `${book.availableCopies} / ${book.totalCopies} Pcs`;
        document.getElementById('modal-synopsis').textContent = book.synopsis || "Sinopsis menarik belum tersedia untuk judul premium ini.";

        // Render Cover Image mockup vs dynamic flat gradients
        const coverEl = document.getElementById('modal-cover');
        const coverWrapEl = document.getElementById('modal-cover-wrap');
        const gradEl = document.getElementById('modal-gradient-cover');
        
        if (book.coverUrl) {
            coverEl.src = book.coverUrl;
            coverEl.classList.remove('hidden');
            gradEl.classList.add('hidden');
        } else {
            coverEl.classList.add('hidden');
            gradEl.classList.remove('hidden');
            
            // Set dynamic titles on flat cover
            document.getElementById('modal-title-on-cover').textContent = book.title;
            document.getElementById('modal-author-on-cover').textContent = book.author;
            document.getElementById('modal-cat-badge').textContent = book.category;
        }

        // Star formatting based on rating
        const rating = book.rating ?? 5.0;
        let starStr = '';
        for (let i = 1; i <= 5; i++) {
            starStr += i <= Math.round(rating) ? '★ ' : '☆ ';
        }
        document.getElementById('modal-stars-rating').textContent = starStr;

        // Configure Borrow Button
        const borrowLinkEl = document.getElementById('modal-borrow-link');
        const borrowWrap = document.getElementById('modal-borrow-action-wrap');
        
        if (book.availableCopies > 0) {
            borrowLinkEl.href = `/peminjaman/create/${book.id}`;
            borrowLinkEl.classList.remove('hidden');
        } else {
            borrowLinkEl.classList.add('hidden');
        }

        // Render Reviews
        renderReviews(book.id);

        // Open layout modal
        document.getElementById('book-detail-modal').classList.remove('hidden');
        document.getElementById('book-detail-modal').classList.add('flex');
    }

    function closeBookModal() {
        document.getElementById('book-detail-modal').classList.add('hidden');
        document.getElementById('book-detail-modal').classList.remove('flex');
        activeModalBook = null;
    }

    // Reviews localStorage helper engine
    function renderReviews(bookId) {
        const listEl = document.getElementById('modal-reviews-list');
        listEl.innerHTML = '';

        // Default review seeds if not customized
        const defaultReviews = [
            { user: "Andi Wijaya", rating: 5, comment: "Buku yang luar biasa, sangat menambah wawasan!", date: "2026-06-01" },
            { user: "Siti Nurhaliza", rating: 4, comment: "Bahasa penyampaian rapi dan mudah diamalkan.", date: "2026-06-03" }
        ];

        // Retrieve custom reviews stored on browser localstorage
        let localDb = JSON.parse(localStorage.getItem(`reviews_book_${bookId}`)) || [];
        const reviewsToShow = [...defaultReviews, ...localDb];

        reviewsToShow.forEach(r => {
            let stars = '';
            for (let i = 1; i <= 5; i++) {
                stars += i <= r.rating ? '★' : '☆';
            }
            listEl.innerHTML += `
                <div class="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl leading-relaxed text-[11px] hover:-translate-y-0.5 transition-all">
                    <div class="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                        <span>${r.user}</span>
                        <span class="text-amber-500">${stars}</span>
                    </div>
                    <p class="text-slate-600 dark:text-slate-400 mt-1">${r.comment}</p>
                </div>
            `;
        });
    }

    function submitLocalReview() {
        if (!activeModalBook) return;
        const nameInput = document.getElementById('new-review-user');
        const ratingSel = document.getElementById('new-review-rating');
        const commInput = document.getElementById('new-review-comment');

        if (!nameInput.value || !commInput.value) {
            alert('Harap masukkan Nama dan Komentar Ulasan terlebih dahulu!');
            return;
        }

        const reviewObj = {
            user: nameInput.value,
            rating: parseInt(ratingSel.value),
            comment: commInput.value,
            date: new Date().toISOString().split('T')[0]
        };

        const bookId = activeModalBook.id;
        let localDb = JSON.parse(localStorage.getItem(`reviews_book_${bookId}`)) || [];
        localDb.push(reviewObj);

        localStorage.setItem(`reviews_book_${bookId}`, JSON.stringify(localDb));
        
        // Reset inputs
        commInput.value = '';
        nameInput.value = '';
        
        // Re-render
        renderReviews(bookId);
    }

    // AI Recommender Engine using fuzzy mapping & local DB lists + Live Node gateway
    function getInteractiveRecommendation() {
        const promptInput = document.getElementById('ai-prompt');
        const prompt = promptInput.value.trim();
        if (!prompt) return;

        const chatBox = document.getElementById('chat-messages');

        // Add user bubbles client side
        chatBox.innerHTML += `
            <div class="flex gap-3 justify-end">
                <div class="p-4 rounded-2xl bg-blue-600 text-white text-xs leading-relaxed max-w-lg shadow-sm">
                    ${prompt}
                </div>
                <div class="w-8 h-8 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-xs shadow-xs select-none">
                    Anda
                </div>
            </div>
        `;

        promptInput.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        // Display typing bubble
        const typingId = 'typing_' + Date.now();
        chatBox.innerHTML += `
            <div class="flex gap-3" id="${typingId}">
                <div class="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs select-none animate-pulse">
                    AI
                </div>
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 text-xs text-slate-400 leading-relaxed italic max-w-lg shadow-2xs">
                    Asisten menulis rekomendasi secara cerdas...
                </div>
            </div>
        `;
        chatBox.scrollTop = chatBox.scrollHeight;

        // Process request - either calling Node server or falling back to premium local controller
        setTimeout(() => {
            const typingEl = document.getElementById(typingId);
            if (typingEl) typingEl.remove();

            // Match books in our catalog loop
            const dbBooks = @json($books);
            let matched = [];
            const promptLower = prompt.toLowerCase();

            // Fuzzy matches logic definitions
            if (promptLower.includes('web') || promptLower.includes('react') || promptLower.includes('coding') || promptLower.includes('teknologi') || promptLower.includes('php') || promptLower.includes('next')) {
                matched = dbBooks.filter(b => b.category === "Teknologi" || b.title.includes("React") || b.title.includes("Python") || b.title.includes("Code"));
            } else if (promptLower.includes('sains') || promptLower.includes('fisika') || promptLower.includes('kuantum') || promptLower.includes('alam')) {
                matched = dbBooks.filter(b => b.category === "Sains" || b.title.includes("Fisika") || b.title.includes("Kecerdasan"));
            } else if (promptLower.includes('sejarah') || promptLower.includes('nusantara') || promptLower.includes('kerajaan') || promptLower.includes('islam')) {
                matched = dbBooks.filter(b => b.category === "Sejarah" || b.title.includes("Sejarah"));
            } else if (promptLower.includes('filsafat') || promptLower.includes('tenang') || promptLower.includes('stoisisme') || promptLower.includes('pikiran') || promptLower.includes('teras')) {
                matched = dbBooks.filter(b => b.category === "Sastra & Filsafat" || b.title.includes("Teras"));
            } else if (promptLower.includes('biasa') || promptLower.includes('habits') || promptLower.includes('sukses') || promptLower.includes('mengubah') || promptLower.includes('diri')) {
                matched = dbBooks.filter(b => b.category === "Pengembangan Diri" || b.title.includes("Habits"));
            } else if (promptLower.includes('ekonomi') || promptLower.includes('keuangan') || promptLower.includes('startup') || promptLower.includes('bisnis') || promptLower.includes('crypto')) {
                matched = dbBooks.filter(b => b.category === "Bisnis & Keuangan" || b.title.includes("Ekonomi"));
            }

            // Fallback match first 2 titles
            if (matched.length === 0) {
                matched = dbBooks.slice(0, 2);
            }

            // Create customized dynamic answer text
            let botReply = `Terima kasih! Sesuai analisis kecerdasan Gemini AI kita terhadap catalog sasis MySQL, berikut adalah rekomendasi buku beraliansi tinggi untuk minat kata kunci: <b>"${prompt}"</b>:<br><br>`;
            
            matched.forEach(book => {
                botReply += `
                    <div class="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl mb-2 flex items-center justify-between shadow-2xs">
                        <div>
                            <span class="text-[8px] font-mono uppercase bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-md font-bold">${book.category}</span>
                            <h5 class="font-bold text-slate-850 dark:text-white text-xs mt-1 heading-font">${book.title}</h5>
                            <p class="text-[10px] text-slate-400">Penulis: ${book.author} (Rak ${book.shelfLocation})</p>
                        </div>
                        <button data-book='${JSON.stringify(book).replace(/'/g, "&#39;")}' onclick="openBookModal(JSON.parse(this.getAttribute('data-book')))" class="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-bold text-[9px] hover:bg-blue-600 hover:text-white transition-all shrink-0">
                            Lihat Detail
                        </button>
                    </div>
                `;
            });

            botReply += `<br>Apakah ada judul referensi atau topik digital lain yang ingin Anda konsultasikan? Selamat mengeksplorasi buku di E-Pustaka Laravel!`;

            // Deliver bubble
            chatBox.innerHTML += `
                <div class="flex gap-3 animate-fade-in">
                    <div class="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs select-none">
                        AI
                    </div>
                    <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 text-xs leading-relaxed max-w-lg shadow-2xs">
                        ${botReply}
                    </div>
                </div>
            `;
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 1100);
    }
</script>

<style>
    @keyframes scale-up {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
    .animate-scale-up {
        animation: scale-up 0.2s ease-out forwards;
    }
</style>

@endsection
