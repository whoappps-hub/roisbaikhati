@extends('layouts.app')

@section('title', 'Admin Portal - E-Pustaka Laravel')

@section('content')
<div class="mb-4">
    <span class="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-mono font-black uppercase tracking-wider">Pustakawan Dashboard</span>
    <h1 class="heading-font text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">Pusat Administrasi & Sirkulasi</h1>
    <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Kelola metadata katalog buku fisik atau proses pengembalian sirkulasi buku anggota secara real-time.</p>
</div>

@if (session('success'))
    <div class="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-3 shadow-2xs">
        <span class="text-lg">✅</span>
        <div><b>Sukses Operasi!</b> {{ session('success') }}</div>
    </div>
@endif

@if ($errors->any())
    <div class="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-sm space-y-1 shadow-2xs">
        <div class="flex items-center gap-2 font-bold text-rose-950 dark:text-rose-200">
            <span>⚠️</span>
            <span>Gagal Menyimpan Data!</span>
        </div>
        <ul class="list-disc list-inside text-xs mt-1 text-rose-700 dark:text-rose-400">
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<!-- Dynamic Tab Switcher Bar -->
<div class="mb-8 flex border-b border-slate-200 dark:border-slate-800 scrollbar-none overflow-x-auto gap-4">
    <button onclick="switchAdminTab('koleksi')" id="btn-tab-koleksi" class="py-3 px-5 font-bold text-sm tracking-tight border-b-2 transition-all flex items-center gap-2 shrink-0 border-blue-600 text-blue-600">
        <i data-lucide="book-open" class="w-4 h-4"></i>
        <span>Manajemen Koleksi Buku</span>
    </button>
    <button onclick="switchAdminTab('sirkulasi')" id="btn-tab-sirkulasi" class="py-3 px-5 font-bold text-sm tracking-tight border-b-2 transition-all flex items-center gap-2 shrink-0 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
        <i data-lucide="refresh-cw" class="w-4 h-4"></i>
        <span>Sirkulasi & Pengembalian</span>
        <span class="ml-1 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 text-[10px] font-black px-2 py-0.5 rounded-full">
            {{ count($loans->where('status', 'borrowed')) }} Aktif
        </span>
    </button>
</div>

<!-- ================= PANAL TAB KOLEKSI ================= -->
<div id="panel-tab-koleksi" class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Formulir Pendaftaran Buku -->
        <div class="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850/40 shadow-xs space-y-4 h-fit">
            <div class="border-b border-slate-100 dark:border-slate-850/30 pb-3">
                <h3 class="heading-font font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <i data-lucide="plus-circle" class="w-5 h-5 text-blue-600"></i>
                    <span>Registrasi Buku Baru</span>
                </h3>
                <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Sandi sasis database terupdate secara otomatis dan aman.</p>
            </div>
            
            <form action="{{ route('admin.books.store') }}" method="POST" class="space-y-4">
                @csrf
                <div class="space-y-1">
                    <label class="text-xs font-bold text-slate-600 dark:text-slate-450 block">Kategori Buku *</label>
                    <select name="category" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-750 text-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        <option value="Teknologi">Teknologi</option>
                        <option value="Sains">Sains</option>
                        <option value="Sejarah">Sejarah</option>
                        <option value="Sastra & Filsafat">Sastra & Filsafat</option>
                        <option value="Pengembangan Diri">Pengembangan Diri</option>
                        <option value="Bisnis & Keuangan">Bisnis & Keuangan</option>
                    </select>
                </div>

                <div class="space-y-1">
                    <label class="text-xs font-bold text-slate-600 dark:text-slate-450 block">Judul Buku *</label>
                    <input required type="text" name="title" placeholder="Contoh: Belajar PHP Modern" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-750 text-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400">
                </div>

                <div class="space-y-1">
                    <label class="text-xs font-bold text-slate-600 dark:text-slate-450 block">Nama Penulis *</label>
                    <input required type="text" name="author" placeholder="Contoh: Dr. Herman" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-750 text-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400">
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <label class="text-xs font-bold text-slate-600 dark:text-slate-450 block">Tahun Terbit</label>
                        <input type="number" name="year" value="{{ date('Y') }}" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-750 text-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    </div>
                    <div class="space-y-1">
                        <label class="text-xs font-bold text-slate-600 dark:text-slate-450 block">Stok Buku</label>
                        <input type="number" name="totalCopies" value="5" min="1" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-750 text-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    </div>
                </div>

                <div class="space-y-1">
                    <label class="text-xs font-bold text-slate-600 dark:text-slate-450 block">Lokasi Rak Buku *</label>
                    <input required type="text" name="shelfLocation" value="Rak Baru A-1" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-750 text-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                </div>

                <div class="space-y-1">
                    <label class="text-xs font-bold text-slate-600 dark:text-slate-450 block">URL Gambar Cover (Opsional)</label>
                    <input type="text" name="coverUrl" placeholder="https://images.unsplash.com/promo-cover" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-750 text-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400">
                </div>

                <div class="space-y-1">
                    <label class="text-xs font-bold text-slate-600 dark:text-slate-450 block">Ringkasan Sinopsis</label>
                    <textarea name="synopsis" rows="4" placeholder="Sinopsis menarik mengenai buku..." class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-750 text-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400"></textarea>
                </div>

                <button type="submit" class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/10 transition-all">
                    Simpan Buku ke Sistem
                </button>
            </form>
        </div>

        <!-- Tabel Kelola Buku -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850/40 shadow-xs overflow-hidden flex flex-col justify-between">
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr class="bg-slate-50 dark:bg-slate-900/20 border-b border-slate-100 dark:border-slate-850/30 text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px] tracking-wider">
                            <th class="p-4.5 font-bold">Informasi Buku</th>
                            <th class="p-4.5 font-bold">Kategori</th>
                            <th class="p-4.5 font-bold text-center">Stok (Tersedia)</th>
                            <th class="p-4.5 font-bold">Lokasi Rak</th>
                            <th class="p-4.5 font-bold text-right">Tindakan</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-850/20">
                        @if(count($books) === 0)
                            <tr>
                                <td colspan="5" class="p-8 text-center text-slate-400 font-mono text-xs">
                                    Belum ada data buku terdaftar di sistem.
                                </td>
                            </tr>
                        @else
                            @foreach ($books as $b)
                                <tr class="hover:bg-slate-50/40 dark:hover:bg-slate-850/10 transition-colors">
                                    <td class="p-4.5">
                                        <div class="flex items-center gap-3">
                                            @if (!empty($b->coverUrl))
                                                <img src="{{ $b->coverUrl }}" alt="" class="w-8 h-10.5 rounded object-cover shrink-0 shadow-xs" referrerPolicy="no-referrer">
                                            @else
                                                <div class="w-8 h-10.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-black text-[8px] flex items-center justify-center shadow-xs">B-O</div>
                                            @endif
                                            <div>
                                                <div class="font-extrabold text-slate-900 dark:text-slate-100 line-clamp-1 text-xs sm:text-sm">{{ $b->title }}</div>
                                                <div class="text-[10px] text-slate-400 font-mono">Oleh: {{ $b->author }} • {{ $b->year }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="p-4.5">
                                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                            {{ $b->category }}
                                        </span>
                                    </td>
                                    <td class="p-4.5 text-center font-mono text-xs">
                                        <b class="text-slate-900 dark:text-slate-150">{{ $b->availableCopies }}</b> / <span class="text-slate-400">{{ $b->totalCopies }}</span>
                                    </td>
                                    <td class="p-4.5 text-xs text-slate-500 dark:text-slate-400 font-bold font-mono">
                                        {{ $b->shelfLocation }}
                                    </td>
                                    <td class="p-4.5 text-right">
                                        <form action="{{ route('admin.books.destroy', $b->id) }}" method="POST" class="inline">
                                            @csrf
                                            @method('DELETE')
                                            <button 
                                                type="submit" 
                                                class="text-xs text-rose-600 dark:text-rose-400 font-extrabold hover:underline"
                                                onclick="return confirm('Apakah Anda yakin ingin menghapus buku ini? Semua data peminjaman terkait akan ikut terhapus!');"
                                            >
                                                Hapus
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            @endforeach
                        @endif
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- ================= PANAL TAB SIRKULASI ================= -->
<div id="panel-tab-sirkulasi" class="hidden space-y-6">
    <!-- Row Mini Widget Stats Khusus Kearsipan -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-indigo-50/50 dark:bg-slate-900/40 border border-indigo-150/70 dark:border-indigo-900/30 p-5 rounded-2xl flex items-center justify-between">
            <div>
                <span class="block text-[10px] uppercase font-mono tracking-wider text-indigo-500 dark:text-indigo-400 font-bold">Total Transaksi</span>
                <span class="block font-black text-2xl text-indigo-950 dark:text-slate-100 mt-1 heading-font">{{ count($loans) }} Transaksi</span>
            </div>
            <span class="text-2xl opacity-80">📖</span>
        </div>
        <div class="bg-rose-50/50 dark:bg-slate-900/40 border border-rose-150/70 dark:border-rose-900/30 p-5 rounded-2xl flex items-center justify-between">
            <div>
                <span class="block text-[10px] uppercase font-mono tracking-wider text-rose-500 dark:text-rose-400 font-bold font-mono">Aktif Dipinjam</span>
                <span class="block font-black text-2xl text-rose-950 dark:text-slate-100 mt-1 heading-font">{{ count($loans->where('status', 'borrowed')) }} Orang</span>
            </div>
            <span class="text-2xl animate-pulse">⏳</span>
        </div>
        <div class="bg-emerald-50/50 dark:bg-slate-900/40 border border-emerald-150/70 dark:border-emerald-900/30 p-5 rounded-2xl flex items-center justify-between">
            <div>
                <span class="block text-[10px] uppercase font-mono tracking-wider text-emerald-500 dark:text-emerald-400 font-bold font-mono">Selesai/Kembali</span>
                <span class="block font-black text-2xl text-emerald-950 dark:text-slate-100 mt-1 heading-font">{{ count($loans->where('status', 'returned')) }} Kali</span>
            </div>
            <span class="text-2xl">🌱</span>
        </div>
    </div>

    <!-- Tabel Rekam Sirkulasi & Aksi Pengembalian -->
    <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850/40 shadow-xs overflow-hidden">
        <div class="p-5 border-b border-slate-100 dark:border-slate-850/30 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            <div>
                <h3 class="heading-font font-bold text-slate-900 dark:text-white text-sm">Daftar Peminjam Seluruh Anggota</h3>
                <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Hanya Pustakawan yang berhak menandatangani tanda terima laporan lunas buku.</p>
            </div>
            <span class="text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900/20">
                Librarian Access Control
            </span>
        </div>
        
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm border-collapse">
                <thead>
                    <tr class="bg-slate-50 dark:bg-slate-900/20 border-b border-slate-100 dark:border-slate-850/30 text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px] tracking-wider">
                        <th class="p-4.5 font-bold">Peminjam (Siswa)</th>
                        <th class="p-4.5 font-bold">Buku yang Dipinjam</th>
                        <th class="p-4.5 font-bold">Tgl Pinjam</th>
                        <th class="p-4.5 font-bold">Tgl Jatuh Tempo</th>
                        <th class="p-4.5 font-bold">Status Buku</th>
                        <th class="p-4.5 font-bold text-right">Proses Verifikasi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-850/20">
                    @if (count($loans) === 0)
                        <tr>
                            <td colspan="6" class="p-12 text-center text-slate-400 font-mono text-xs">
                                Tidak ada data sirkulasi histori peminjaman di database.
                            </td>
                        </tr>
                    @else
                        @foreach ($loans as $loan)
                            <tr class="hover:bg-slate-50/40 dark:hover:bg-slate-850/10 transition-colors">
                                <td class="p-4.5">
                                    <div class="font-extrabold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">{{ $loan->memberName }}</div>
                                    <div class="text-[10px] text-slate-400 font-mono">ID: {{ $loan->memberId }}</div>
                                </td>
                                <td class="p-4.5">
                                    <div class="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">{{ $loan->bookTitle }}</div>
                                    <div class="text-[10px] text-slate-400 font-mono">ID Buku: #{{ $loan->bookId }}</div>
                                </td>
                                <td class="p-4.5 font-mono text-xs text-slate-600 dark:text-slate-400">
                                    {{ date('d M Y', strtotime($loan->borrowDate)) }}
                                </td>
                                <td class="p-4.5 font-mono text-xs text-slate-600 dark:text-slate-400">
                                    {{ date('d M Y', strtotime($loan->dueDate)) }}
                                </td>
                                <td class="p-4.5">
                                    @if ($loan->status == 'returned')
                                        <span class="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/10">
                                            <span>●</span> <span>Selesai</span>
                                        </span>
                                    @elseif (strtotime($loan->dueDate) < time() && $loan->returnDate === null)
                                        <span class="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[10px] bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 border border-rose-100 dark:border-rose-900/10 animate-pulse">
                                            <span>●</span> <span>Terlambat</span>
                                        </span>
                                    @else
                                        <span class="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[10px] bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/10">
                                            <span>●</span> <span>Dipinjam</span>
                                        </span>
                                    @endif
                                </td>
                                <td class="p-4.5 text-right">
                                    @if ($loan->status !== 'returned')
                                        <form action="{{ route('peminjaman.return', ['loan_id' => $loan->id]) }}" method="POST" class="inline">
                                            @csrf
                                            <button 
                                                type="submit" 
                                                class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs"
                                                onclick="return confirm('Apakah Anda yakin buku fisik telah diterima dengan baik di rak perpustakaan?');"
                                            >
                                                Terima Kembali ✔
                                            </button>
                                        </form>
                                    @else
                                        <div class="text-right">
                                            <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-md border border-emerald-100 dark:border-emerald-900/10">
                                                Diterima ({{ date('d/m/Y', strtotime($loan->returnDate)) }})
                                            </span>
                                        </div>
                                    @endif
                                </td>
                            </tr>
                        @endforeach
                    @endif
                </tbody>
            </table>
        </div>
    </div>
</div>

<script>
    function switchAdminTab(tabName) {
        const tabKoleksi = document.getElementById('panel-tab-koleksi');
        const tabSirkulasi = document.getElementById('panel-tab-sirkulasi');
        const btnKoleksi = document.getElementById('btn-tab-koleksi');
        const btnSirkulasi = document.getElementById('btn-tab-sirkulasi');
        
        if (tabKoleksi && tabSirkulasi && btnKoleksi && btnSirkulasi) {
            if (tabName === 'koleksi') {
                tabKoleksi.classList.remove('hidden');
                tabSirkulasi.classList.add('hidden');
                
                btnKoleksi.className = "py-3 px-5 font-bold text-sm tracking-tight border-b-2 transition-all flex items-center gap-2 shrink-0 border-blue-600 text-blue-600";
                btnSirkulasi.className = "py-3 px-5 font-bold text-sm tracking-tight border-b-2 transition-all flex items-center gap-2 shrink-0 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100";
                window.location.hash = 'koleksi';
            } else {
                tabKoleksi.classList.add('hidden');
                tabSirkulasi.classList.remove('hidden');
                
                btnKoleksi.className = "py-3 px-5 font-bold text-sm tracking-tight border-b-2 transition-all flex items-center gap-2 shrink-0 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-150";
                btnSirkulasi.className = "py-3 px-5 font-bold text-sm tracking-tight border-b-2 transition-all flex items-center gap-2 shrink-0 border-blue-600 text-blue-600";
                window.location.hash = 'sirkulasi';
            }
        }
    }

    // Persist active tab across form submissions and returns
    window.addEventListener('DOMContentLoaded', () => {
        if (window.location.hash === '#sirkulasi') {
            switchAdminTab('sirkulasi');
        } else {
            switchAdminTab('koleksi');
        }
    });
</script>
@endsection
