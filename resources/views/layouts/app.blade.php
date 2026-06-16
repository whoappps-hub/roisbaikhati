<!DOCTYPE html>
<html lang="id" class="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'E-Pustaka - Sistem Manajemen Perpustakaan Modern')</title>
    <!-- Tailwind CSS Script CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        slate: {
                            750: '#1e293b',
                            850: '#0f172a',
                            950: '#020617',
                        }
                    }
                }
            }
        }
    </script>
    <!-- Google Fonts: Inter & Space Grotesk -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
        .heading-font {
            font-family: 'Space Grotesk', sans-serif;
        }
        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(156, 163, 175, 0.3);
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(156, 163, 175, 0.5);
        }
    </style>
    <!-- Lucide Icons CDN -->
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col antialiased transition-colors duration-200">
    

    
    <!-- Outer Main Wrapper: Flex layout with sidebar -->
    <div class="flex flex-1 flex-col md:flex-row min-h-0 relative">
        
        <!-- Mobile Header Navigation Toggle (Visible on Mobile only) -->
        <div class="md:hidden flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/80 p-4 sticky top-0 z-40 transition-colors duration-200 shadow-xs">
            <a href="{{ route('katalog.index') }}" class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                    <i data-lucide="book-open" class="w-4.5 h-4.5 text-white"></i>
                </div>
                <div>
                    <span class="heading-font font-bold text-sm tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">E-Pustaka</span>
                </div>
            </a>
            
            <div class="flex items-center gap-3">
                <!-- Theme Toggle Button header-right on mobile -->
                <button onclick="toggleDarkMode()" class="p-2 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800/50 transition-colors text-slate-600 dark:text-slate-300 cursor-pointer">
                    <i data-lucide="moon" id="theme-moon-icon-mobile" class="w-4.5 h-4.5 text-indigo-600"></i>
                    <i data-lucide="sun" id="theme-sun-icon-mobile" class="w-4.5 h-4.5 text-amber-400 hidden"></i>
                </button>
                <button onclick="toggleMobileSidebar()" class="p-2 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800/50 transition-all text-slate-600 dark:text-slate-300 cursor-pointer">
                    <i data-lucide="menu" id="menu-toggle-icon" class="w-5 h-5"></i>
                </button>
            </div>
        </div>

        <!-- Sidebar Navigation Layout (Desktop and Mobile drawer) -->
        <aside id="sidebar-panel" class="hidden md:flex flex-col w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-250/30 dark:border-slate-800/80 sticky top-0 h-screen z-30 shrink-0 transform md:transform-none transition-all duration-300">
            <!-- Sidebar Header / Branding Area & Theme Switcher -->
            <div class="p-5 border-b border-slate-100 dark:border-slate-850/40 flex items-center justify-between">
                <a href="{{ route('katalog.index') }}" class="flex items-center gap-3 group">
                    <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
                        <i data-lucide="book-open" class="w-5 h-5 text-white"></i>
                    </div>
                    <div>
                        <span class="heading-font font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:opacity-85 transition-opacity">E-Pustaka</span>
                        <span class="block text-[8px] font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 leading-none mt-0.5">Smart Library</span>
                    </div>
                </a>

                <!-- Theme Toggle Button next to logo -->
                <button onclick="toggleDarkMode()" class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800/50 transition-colors text-slate-600 dark:text-slate-300 cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 duration-150 shrink-0" title="Ganti Tema Visual (Ctrl+D)">
                    <i data-lucide="moon" id="theme-moon-icon" class="w-4.5 h-4.5 text-indigo-600"></i>
                    <i data-lucide="sun" id="theme-sun-icon" class="w-4.5 h-4.5 text-amber-400 hidden"></i>
                </button>
            </div>

            <!-- Scrollable Sidebar navigation items -->
            <div class="flex-grow overflow-y-auto p-4 space-y-7">
                <!-- Main Navigation -->
                <div class="space-y-1.5">
                    <span class="block px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Navigasi Utama</span>
                    
                    <a href="{{ route('katalog.index') }}" class="w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-3 {{ Route::currentRouteName() == 'katalog.index' ? 'text-blue-600 bg-blue-50/50 dark:text-blue-300 dark:bg-blue-500/10 font-extrabold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100' }}">
                        <i data-lucide="layout" class="w-4 h-4 shrink-0"></i>
                        <span>Katalog Buku</span>
                    </a>
                    
                    <a href="{{ route('peminjaman.index') }}" class="w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-3 {{ Route::currentRouteName() == 'peminjaman.index' ? 'text-blue-600 bg-blue-50/50 dark:text-blue-300 dark:bg-blue-500/10 font-extrabold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100' }}">
                        <i data-lucide="history" class="w-4 h-4 shrink-0"></i>
                        <span>Histori Peminjaman</span>
                    </a>

                    @if (session('role', 'user') === 'admin')
                        <a href="{{ route('admin.index') }}" class="w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between {{ Route::currentRouteName() == 'admin.index' ? 'text-amber-500 bg-amber-50/45 dark:text-amber-400 dark:bg-amber-500/10 font-extrabold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100' }}">
                            <div class="flex items-center gap-3">
                                <i data-lucide="shield" class="w-4 h-4 shrink-0 text-amber-500"></i>
                                <span>Portal Admin</span>
                            </div>
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        </a>
                    @else
                        <a href="{{ route('admin.index') }}" class="w-full px-3 py-2.5 rounded-xl text-xs font-medium text-slate-450 dark:text-slate-500/80 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all flex items-center justify-between" title="Masuk ke portal admin dengan mengaktifkan peran Pustakawan">
                            <div class="flex items-center gap-3">
                                <i data-lucide="lock" class="w-4 h-4 shrink-0"></i>
                                <span>Portal Admin</span>
                            </div>
                            <i data-lucide="help-circle" class="w-3.5 h-3.5 opacity-65"></i>
                        </a>
                    @endif
                </div>
            </div>

            <!-- Profile Info / Logout Session Footer inside sidebar -->
            <div class="p-4 border-t border-slate-100 dark:border-slate-850/40 bg-slate-50/50 dark:bg-slate-900/40">
                @if (session()->has('auth_name'))
                    <div class="flex items-center gap-3 pb-3">
                        <div class="w-8.5 h-8.5 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs select-none shadow-sm">
                            {{ substr(session('auth_name'), 0, 2) }}
                        </div>
                        <div class="min-w-0 flex-1">
                            <p class="text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate leading-none">{{ session('auth_name') }}</p>
                            <span class="text-[9px] text-slate-400 font-mono mt-1 uppercase">{{ session('role') }}</span>
                        </div>
                    </div>
                    <a href="{{ route('logout') }}" class="w-full py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-center rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 border border-rose-150/50 dark:border-rose-900/40">
                        <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                        <span>Logout Sesi</span>
                    </a>
                @else
                    <div class="text-center space-y-2 py-2">
                        <a href="{{ route('login') }}" class="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white shadow-xs rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                            <i data-lucide="key" class="w-3.5 h-3.5"></i>
                            <span>Masuk Sesi</span>
                        </a>
                    </div>
                @endif
            </div>
        </aside>

        <!-- Main Content Area Scrollable -->
        <main class="flex-grow overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 min-w-0">
            <!-- Simulated Push Alerts Tray -->
            <div id="alert-tray" class="space-y-3 mb-6 hidden"></div>

            @if (session('success_role'))
                <div id="role-alert" class="mb-6 p-4 rounded-2xl bg-indigo-950 border border-indigo-900 text-white flex items-center justify-between text-xs font-mono shadow-md relative overflow-hidden animate-fade-in animate-duration-300">
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
                    <div class="flex items-center gap-3 relative z-10">
                        <span class="text-sm">🔔</span>
                        <div>
                            <span class="text-indigo-300">Simulasi Sukses:</span>
                            <b class="text-white ml-2">{{ session('success_role') }}</b>
                        </div>
                    </div>
                    <button onclick="document.getElementById('role-alert').style.display='none'" class="text-indigo-300 hover:text-white font-bold px-2.5 py-1 bg-indigo-900/60 rounded-xl relative z-10">Tutup</button>
                </div>
            @endif

            @if (session('error'))
                <div class="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-300 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
                    <span class="text-base mt-0.5">🚫</span>
                    <div>
                        <h5 class="font-bold text-rose-950 dark:text-rose-200 heading-font text-sm leading-none">Akses Terproteksi</h5>
                        <p class="mt-1.5 text-rose-700 dark:text-rose-400 leading-relaxed text-xs">{{ session('error') }}</p>
                        <div class="mt-2 text-[10px] font-mono text-rose-500/80 dark:text-rose-450/75">
                            Petunjuk: Silakan masuk menggunakan akun Pustakawan (Admin) di halaman Masuk Sesi.
                        </div>
                    </div>
                </div>
            @endif

            @yield('content')

            <!-- Footer Status & Copyright -->
            <footer class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 py-5 rounded-2xl mt-12 transition-colors duration-200 shadow-2xs">
                <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <p class="text-[11px] text-slate-400 dark:text-slate-500 font-mono">Status Sistem: Database Terkoneksi (SQLite Dynamic Engine)</p>
                    </div>
                    <p class="text-[11px] text-slate-400 dark:text-slate-500 font-mono">&copy; {{ date('Y') }} E-Pustaka Engine. Dibuat dengan Blade & PHP Laravel.</p>
                </div>
            </footer>
        </main>
        
    </div>

    <!-- Global Application Controllers scripts -->
    <script>
        // Init Lucide Icons dynamically
        lucide.createIcons();

        // Theme management load configuration
        const html = document.documentElement;
        
        function updateThemeUI() {
            const isDark = html.classList.contains('dark');
            
            const moonIcon = document.getElementById('theme-moon-icon');
            const sunIcon = document.getElementById('theme-sun-icon');
            const themeText = document.getElementById('theme-text');
            
            const moonIconMob = document.getElementById('theme-moon-icon-mobile');
            const sunIconMob = document.getElementById('theme-sun-icon-mobile');
            
            if (isDark) {
                if (moonIcon) moonIcon.classList.add('hidden');
                if (sunIcon) sunIcon.classList.remove('hidden');
                if (themeText) themeText.textContent = 'Mode Terang';
                
                if (moonIconMob) moonIconMob.classList.add('hidden');
                if (sunIconMob) sunIconMob.classList.remove('hidden');
            } else {
                if (moonIcon) moonIcon.classList.remove('hidden');
                if (sunIcon) sunIcon.classList.add('hidden');
                if (themeText) themeText.textContent = 'Mode Malam';
                
                if (moonIconMob) moonIconMob.classList.remove('hidden');
                if (sunIconMob) sunIconMob.classList.add('hidden');
            }
        }

        // Initialize state on page load
        if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }

        // Apply immediately
        updateThemeUI();

        document.addEventListener('DOMContentLoaded', () => {
            updateThemeUI();
        });

        function toggleDarkMode() {
            if (html.classList.contains('dark')) {
                html.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                html.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
            updateThemeUI();
        }

        // Keyboard Shortcut Control Option + D / Ctrl + D
        window.addEventListener('keydown', (e) => {
            if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                toggleDarkMode();
            }
        });

        // Mobile sidebar panel toggler function
        function toggleMobileSidebar() {
            const sidebar = document.getElementById('sidebar-panel');
            if (sidebar.classList.contains('hidden')) {
                sidebar.classList.remove('hidden');
                sidebar.classList.add('flex', 'fixed', 'inset-y-0', 'left-0', 'w-72', 'shadow-2xl', 'z-50');
                
                // Add a mobile backdrop click trigger to close
                if (!document.getElementById('sidebar-backdrop')) {
                    const backdrop = document.createElement('div');
                    backdrop.id = 'sidebar-backdrop';
                    backdrop.className = 'fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden';
                    backdrop.onclick = toggleMobileSidebar;
                    document.body.appendChild(backdrop);
                }
            } else {
                sidebar.classList.add('hidden');
                sidebar.classList.remove('flex', 'fixed', 'inset-y-0', 'left-0', 'w-72', 'shadow-2xl', 'z-50');
                
                const backdrop = document.getElementById('sidebar-backdrop');
                if (backdrop) backdrop.remove();
            }
        }

        // Simulated background push reminders
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                const alertTray = document.getElementById('alert-tray');
                if (!alertTray) return;
                
                alertTray.innerHTML = `
                    <div class="p-4 bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 rounded-2xl flex items-start gap-3 text-xs shadow-xs animate-slide-in relative">
                        <span class="text-base">💡</span>
                        <div class="flex-1">
                            <h6 class="font-bold heading-font">Notifikasi Layanan Pintar</h6>
                            <p class="mt-0.5 text-slate-600 dark:text-slate-400">Pengembali Buku 'Filosofi Teras' sudah didekatkan koordinat lokasinya ke Rak Sosial S-01.</p>
                        </div>
                        <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-slate-700 dark:hover:text-white font-extrabold text-sm absolute right-3 top-3">×</button>
                    </div>
                `;
                alertTray.classList.remove('hidden');
            }, 6000);
        });
    </script>
</body>
</html>
