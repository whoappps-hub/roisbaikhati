@extends('layouts.app')

@section('title', 'Masuk Sistem - E-Pustaka Smart Library')

@section('content')
<div class="max-w-4xl mx-auto my-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 transition-all duration-300">
    
    <!-- Left Aspect: Branding and Info -->
    <div class="lg:col-span-5 bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
        <!-- Subtle Pattern Overlay -->
        <div class="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div class="space-y-6 relative z-10">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                    <svg class="w-5.5 h-5.5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <div>
                    <span class="heading-font font-bold text-lg tracking-tight text-white block">E-Pustaka</span>
                    <span class="text-[9px] font-mono font-bold tracking-widest text-emerald-400 uppercase leading-none">Laravel Module</span>
                </div>
            </div>

            <div class="space-y-3 pt-2">
                <h1 class="heading-font text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight text-white">
                    Sirkulasi Buku Modern
                </h1>
                <p class="text-[11px] text-slate-300/80 leading-relaxed max-w-sm">
                    Gunakan portal login ini untuk masuk ke perpustakaan pintar, mengelola ulasan sastra, melakukan peminjaman buku, serta mengakses integrasi administrative.
                </p>
            </div>
        </div>

        <div class="pt-8 relative z-10">
            <p class="text-[10px] text-slate-400 font-mono">
                &copy; {{ date('Y') }} E-Pustaka Engine. All rights reserved.
            </p>
        </div>
    </div>

    <!-- Right Aspect: Form -->
    <div class="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800">
        
        <div class="max-w-md w-full mx-auto space-y-5">
            
            <div>
                <h2 class="heading-font text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Selamat Datang Kembali
                </h2>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Silakan masuk menggunakan kredensial akun Anggota atau Pustakawan Anda.
                </p>
            </div>

            <!-- Flash alerts -->
            @if (session('success'))
                <div class="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2.5 shadow-2xs">
                    <span class="text-base">✅</span>
                    <span>{{ session('success') }}</span>
                </div>
            @endif

            @if (session('success_auth'))
                <div class="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/25 border border-blue-200 dark:border-blue-905/40 text-blue-800 dark:text-blue-300 text-xs flex items-start gap-2.5 shadow-2xs">
                    <span class="text-base">ℹ️</span>
                    <span>{{ session('success_auth') }}</span>
                </div>
            @endif

            @if ($errors->any())
                <div class="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/25 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-300 text-xs shadow-2xs">
                    <p class="font-bold text-rose-950 dark:text-rose-250 mb-1">Harap koreksi kesalahan berikut:</p>
                    <ul class="list-disc list-inside space-y-0.5 text-rose-700 dark:text-rose-450">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <!-- Tab Buttons layout mirroring React style -->
            <div class="p-1 bg-slate-100 dark:bg-slate-850 rounded-xl border border-slate-200/60 dark:border-slate-800 flex gap-1">
                <a href="{{ route('login') }}" class="flex-1 py-1.5 text-xs font-bold rounded-lg text-center bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200/50 dark:border-slate-800/80">
                    Masuk Port
                </a>
                <a href="{{ route('register') }}" class="flex-1 py-1.5 text-xs font-bold rounded-lg text-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
                    Daftar Baru
                </a>
            </div>

            <form action="{{ route('login.post') }}" method="POST" class="space-y-4">
                @csrf
                
                <!-- Email field -->
                <div class="space-y-1">
                    <label class="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400 block font-mono">
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
                            class="w-full px-4 py-3 pl-10 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
                        />
                    </div>
                </div>

                <!-- Password field -->
                <div class="space-y-1">
                    <div class="flex items-center justify-between">
                        <label class="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400 block font-mono">
                            Kata Sandi *
                        </label>
                        <a href="#" class="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline">
                            Lupa Sandi?
                        </a>
                    </div>
                    <div class="relative">
                        <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔑</span>
                        <input
                            required
                            type="password"
                            name="password"
                            placeholder="Masukan minimal 6 karakter"
                            class="w-full px-4 py-3 pl-10 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
                        />
                    </div>
                </div>

                <!-- Submit Button -->
                <button
                    type="submit"
                    class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                    <span>Masuk ke Dashboard</span>
                    <span>➡️</span>
                </button>

            </form>

        </div>

    </div>

</div>
@endsection
