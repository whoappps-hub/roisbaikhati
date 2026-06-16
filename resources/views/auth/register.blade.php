@extends('layouts.app')

@section('title', 'Daftar Anggota - E-Pustaka Smart Library')

@section('content')
<div class="max-w-5xl mx-auto my-4 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 transition-all duration-300">
    
    <!-- Left Aspect: Branding and Info -->
    <div class="lg:col-span-5 bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
        <!-- Subtle Pattern Overlay -->
        <div class="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div class="space-y-6 relative z-10">
            <div class="flex items-center gap-3">
                <div class="w-11 h-11 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                    <svg class="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <div>
                    <span class="heading-font font-bold text-xl tracking-tight text-white block">E-Pustaka Blade</span>
                    <span class="text-[10px] font-mono font-bold tracking-widest text-emerald-450 uppercase">Laravel Module</span>
                </div>
            </div>

            <div class="space-y-3 pt-4">
                <h1 class="heading-font text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-white">
                    Pendaftaran Anggota Mandiri
                </h1>
                <p class="text-xs text-slate-300/90 leading-relaxed max-w-sm">
                    Buat akun baru untuk mulai meminjam buku fisik di rak, memberikan penilaian ulasan bintang, dan berkontribusi ke komunitas literasi sekolah.
                </p>
            </div>
        </div>

        <div class="space-y-4 pt-12 relative z-10">
            <div class="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-xs">
                <div class="flex items-center gap-2 mb-1.5 text-blue-200 font-bold uppercase tracking-wider font-mono text-[10px]">
                    <span>🔑 HAK AKSES SISTEM</span>
                </div>
                <p class="text-slate-300 text-[11px] leading-relaxed">
                    Setiap pendaftar baru akan menerima ID Anggota unik secara otomatis setelah persetujuan pendaftaran.
                </p>
            </div>

            <p class="text-[10px] text-slate-400 font-mono">
                &copy; {{ date('Y') }} E-Pustaka Engine. All rights reserved.
            </p>
        </div>
    </div>

    <!-- Right Aspect: Form -->
    <div class="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
        
        <div class="max-w-md w-full mx-auto space-y-6">
            
            <div>
                <h2 class="heading-font text-2xl font-extrabold tracking-tight text-slate-900">
                    Form Pendaftaran Anggota
                </h2>
                <p class="text-xs text-slate-500 mt-1">
                    Silakan isi informasi diri Anda secara lengkap dan benar.
                </p>
            </div>

            @if ($errors->any())
                <div class="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-805 text-xs">
                    <p class="font-bold text-rose-900 mb-1">Harap koreksi kesalahan berikut:</p>
                    <ul class="list-disc list-inside space-y-0.5 text-rose-700">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <!-- Tab Buttons layout mirroring React style -->
            <div class="p-1 bg-slate-100 rounded-xl border border-slate-200/60 flex gap-1">
                <a href="{{ route('login') }}" class="flex-1 py-1.5 text-xs font-bold rounded-lg text-center text-slate-500 hover:text-slate-850">
                    Masuk Port
                </a>
                <a href="{{ route('register') }}" class="flex-1 py-1.5 text-xs font-bold rounded-lg text-center bg-white text-slate-900 shadow-sm border border-slate-200/50">
                    Daftar Baru
                </a>
            </div>

            <form action="{{ route('register.post') }}" method="POST" class="space-y-4">
                @csrf
                
                <!-- Full Name field -->
                <div class="space-y-1">
                    <label class="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 block font-mono">
                        Nama Lengkap *
                    </label>
                    <div class="relative">
                        <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">👤</span>
                        <input
                            required
                            type="text"
                            name="name"
                            value="{{ old('name') }}"
                            placeholder="Contoh: Achmad Naufal"
                            class="w-full px-4 py-3 pl-10 rounded-xl bg-slate-55 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
                        />
                    </div>
                </div>

                <!-- Email field -->
                <div class="space-y-1">
                    <label class="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 block font-mono">
                        Alamat Email *
                    </label>
                    <div class="relative">
                        <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">📧</span>
                        <input
                            required
                            type="email"
                            name="email"
                            value="{{ old('email') }}"
                            placeholder="Contoh: naufal@perpus.id"
                            class="w-full px-4 py-3 pl-10 rounded-xl bg-slate-55 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
                        />
                    </div>
                </div>

                <!-- Password field -->
                <div class="space-y-1">
                    <label class="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 block font-mono">
                        Kata Sandi *
                    </label>
                    <div class="relative">
                        <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
                        <input
                            required
                            type="password"
                            name="password"
                            placeholder="Masukan minimal 6 karakter"
                            class="w-full px-4 py-3 pl-10 rounded-xl bg-slate-55 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
                        />
                    </div>
                </div>

                <!-- Submit Button -->
                <button
                    type="submit"
                    class="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                    <span>Setujui & Daftar Anggota</span>
                    <span>➡️</span>
                </button>

            </form>

        </div>

    </div>

</div>
@endsection
