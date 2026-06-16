import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AIRecommender from "./components/AIRecommender";
import BookCard from "./components/BookCard";
import BookDetailModal from "./components/BookDetailModal";
import MemberDashboard from "./components/MemberDashboard";
import AdminPanel from "./components/AdminPanel";
import AnalyticsPanel from "./components/AnalyticsPanel";
import ShelfLayout from "./components/ShelfLayout";
import AuthPage from "./components/AuthPage";
import { Book, Loan, LibraryNotification, LibraryStats } from "./types";
import { Sparkles, Search, Filter, BookOpen, AlertCircle, RefreshCw, X, Heart, HelpCircle, Bell, LayoutGrid, Compass, ShieldAlert, BookCheck, Activity, MapPin, Landmark } from "lucide-react";

export default function App() {
  // Global States
  const [books, setBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [notifications, setNotifications] = useState<LibraryNotification[]>([]);
  const [stats, setStats] = useState<LibraryStats | null>(null);

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedYearRange, setSelectedYearRange] = useState("Semua");
  const [sortBy, setSortBy] = useState("terpopuler");

  // App Layout States
  const [activeTab, setActiveTab] = useState<string>("katalog");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [currentUser, setCurrentUser] = useState<{ name: string; role: "member" | "admin"; id: string; email: string } | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [pushEnabled, setPushEnabled] = useState(false);

  // Floating Toast State
  const [toast, setToast] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  // Sync dark mode HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Initial Data Sync
  const fetchData = async () => {
    setLoading(true);
    try {
      const bRes = await fetch("/api/books");
      const bData = await bRes.json();
      setBooks(bData);

      const lRes = await fetch("/api/loans?memberId=M-101");
      const lData = await lRes.json();
      setLoans(lData);

      const nRes = await fetch("/api/notifications");
      const nData = await nRes.json();
      setNotifications(nData);
    } catch (err) {
      console.error("Error fetching library data starting point:", err);
      showToast("error", "Koneksi ke backend perpustakaan terputus. Menggunakan mock data lokal.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const statsRes = await fetch("/api/stats");
      const statsData = await statsRes.json();
      setStats(statsData);
    } catch (err) {
      console.error("Error loading visual analytics stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (role === "admin" || activeTab === "admin-panel") {
      fetchStats();
    }
  }, [role, activeTab, loans]);

  // Trigger floating notifications toast
  const showToast = (type: "success" | "error" | "info", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Push Notifications Toggler
  const togglePushNotifications = () => {
    if (!pushEnabled) {
      setPushEnabled(true);
      showToast("success", "Notifikasi Push Diaktifkan! Kami akan mengingatkan tenggat waktu peminjaman Anda via pemberitahuan browser.");
      
      // Spawn simulation push notification in 2 seconds
      setTimeout(() => {
        showWarningPush();
      }, 3000);
    } else {
      setPushEnabled(false);
      showToast("info", "Notifikasi Push Dinonaktifkan.");
    }
  };

  const showWarningPush = () => {
    const alerts = [
      "Pemberitahuan Sistem: Sisa waktu peminjaman 'Filosofi Teras' tinggal 3 hari lagi. Mohon persiapkan buku Anda.",
      "Navigasi Fisik: Sensor baru mendeteksi buku 'Atomic Habits' diletakkan di koordinat terdekat Rak Psikologi-04."
    ];
    const chosenAlert = alerts[Math.floor(Math.random() * alerts.length)];
    
    // Custom beautiful in-app push simulator
    const audioNode = new Audio();
    audioNode.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA=="; // short silent signal
    audioNode.play().catch(() => {});
    showToast("info", chosenAlert);
  };

  // Borrow Book Online Hook
  const handleBorrow = async (bookId: string) => {
    try {
      const res = await fetch(`/api/books/${bookId}/borrow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: "M-101", memberName: "Achmad Naufal" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal melakukan peminjaman.");
      }

      showToast("success", `Selamat! Buku "${data.book.title}" berhasil dipinjam secara online.`);
      fetchData(); // Sync states
    } catch (err: any) {
      showToast("error", err.message || "Gagal meminjam.");
    }
  };

  // Return Book Hook
  const handleReturn = async (loanId: string) => {
    try {
      const res = await fetch(`/api/loans/${loanId}/return`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal melakukan pengembalian.");
      }

      showToast("success", `Buku "${data.loan.bookTitle}" berhasil dikembalikan. Terima kasih!`);
      fetchData(); // Sync states
    } catch (err: any) {
      showToast("error", err.message || "Gagal mengembalikan.");
    }
  };

  // Submit Review Hook
  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!selectedBook) return;
    try {
      const res = await fetch(`/api/books/${selectedBook.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment, user: "Achmad Naufal" }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Ulasan gagal dikirim.");
      }

      const updatedBookDetail = await res.json();
      setSelectedBook(updatedBookDetail);
      showToast("success", "Ulasan Anda berhasil diintegrasikan ke ulasan komunitas!");
      fetchData(); // Sync general books state
    } catch (err: any) {
      showToast("error", err.message || "Ulasan gagal dibuat.");
    }
  };

  // Admin: Add new book
  const handleAddBook = async (bookData: Omit<Book, "id" | "rating" | "reviews">) => {
    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Gagal menambahkan buku.");
      }

      showToast("success", "Katalog buku berhasil didaftarkan secara real-time!");
      fetchData();
    } catch (err: any) {
      throw err;
    }
  };

  // Admin: Edit book
  const handleEditBook = async (bookId: string, bookData: Partial<Book>) => {
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Gagal memperbarui buku.");
      }

      showToast("success", "Informasi buku diperbarui di cloud database.");
      fetchData();
    } catch (err: any) {
      throw err;
    }
  };

  // Admin: Delete Book
  const handleDeleteBook = async (bookId: string) => {
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Gagal menghapus.");
      }

      showToast("info", "Buku dihapus dari penyimpanan utama.");
      fetchData();
    } catch (err: any) {
      throw err;
    }
  };

  // Mark all alerts read
  const markAllNotificationsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    showToast("success", "Semua pengingat telah ditandai sebagai dibaca.");
  };

  // Filter core logic
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.shelfLocation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "Semua" || book.category === selectedCategory;

    let matchesYear = true;
    if (selectedYearRange === "Terbaru (>= 2022)") {
      matchesYear = book.year >= 2022;
    } else if (selectedYearRange === "Klasik (<= 2021)") {
      matchesYear = book.year <= 2021;
    }

    return matchesSearch && matchesCategory && matchesYear;
  });

  // Sort logic
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === "terpopuler") {
      return b.rating - a.rating;
    }
    if (sortBy === "terbaru") {
      return b.year - a.year;
    }
    if (sortBy === "nama") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const categoriesList = ["Semua", "Teknologi", "Sains", "Sejarah", "Sastra & Filsafat", "Pengembangan Diri", "Bisnis & Keuangan"];

  const activeLoansCount = loans.filter((l) => !l.returned).length;
  const rawOverdueCount = loans.filter((l) => {
    if (l.returned) return false;
    const due = new Date(l.dueDate);
    const now = new Date();
    return due < now;
  }).length;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#080b11] text-slate-800 dark:text-slate-100 transition-all duration-350 select-text">
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 border border-slate-700 text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-305 max-w-sm">
            <div className={`p-1.5 rounded-xl text-white ${toast.type === "success" ? "bg-green-600" : "bg-rose-600"}`}>
              <Bell className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold leading-relaxed">{toast.message}</p>
          </div>
        )}
        <AuthPage
          onLogin={(userData) => {
            setCurrentUser(userData);
            setRole(userData.role);
            if (userData.role === "admin") {
              setActiveTab("admin-panel");
            } else {
              setActiveTab("katalog");
            }
            showToast("success", `Selamat datang kembali, ${userData.name}!`);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 transition-all duration-350 select-text">
      
      {/* Floating interactive toast notifications */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 border border-slate-700 text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 max-w-sm">
          <div className={`p-1.5 rounded-xl text-white ${toast.type === "success" ? "bg-green-600" : toast.type === "error" ? "bg-rose-600" : "bg-blue-600"}`}>
            <Bell className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold leading-relaxed">{toast.message}</p>
          <button onClick={() => setToast(null)} className="p-1 hover:bg-white/10 rounded-full cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Modern Left Sidebar Section - Desktop */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={role}
        setRole={setRole}
        booksCount={books.length}
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          showToast("info", "Anda telah keluar dari sesi perpustakaan.");
        }}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Sleek Top Header with Search and Profile context */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          markAllNotificationsRead={markAllNotificationsRead}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          role={role}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pushEnabled={pushEnabled}
          togglePushNotifications={togglePushNotifications}
        />

        <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto pb-24 md:pb-8">
          
          {/* Active tab content switcher */}
          {activeTab === "katalog" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Stat Grid matching Sleek Design spec */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Stat 1: Buku Dipinjam */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Buku Dipinjam</p>
                    <h3 className="text-3xl font-extrabold mt-1 text-blue-600 dark:text-blue-400">
                      {String(activeLoansCount).padStart(2, '0')}
                    </h3>
                  </div>
                  <div className="mt-4">
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-300" 
                        style={{ width: `${Math.min(100, (activeLoansCount / 10) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5">Maks batas kuota pinjam 10 buku</p>
                  </div>
                </div>

                {/* Stat 2: Batas Kembali */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Batas Kembali</p>
                    <h3 className={`text-3xl font-extrabold mt-1 ${rawOverdueCount > 0 ? "text-rose-500" : "text-amber-500"}`}>
                      {rawOverdueCount > 0 ? "Terlambat" : activeLoansCount > 0 ? "Aman" : "Kosong"}
                    </h3>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-slate-650 dark:text-slate-405">
                      {rawOverdueCount > 0 
                        ? `${rawOverdueCount} buku melewati batas kembali` 
                        : activeLoansCount > 0 
                        ? `Semua pinjaman aktif terpantau tertib`
                        : "Tidak ada tagihan buku"
                      }
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Status diperbarui secara real-time</p>
                  </div>
                </div>

                {/* Stat 3: Tren Literasi Kamu (colspan-2) */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm col-span-1 sm:col-span-2 relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tren Literasi Kamu</p>
                    
                    {/* Horizontal representation or bars matching visual layout details */}
                    <div className="flex items-end gap-2 h-10 mt-3">
                      <div className="bg-blue-100 dark:bg-blue-900/40 w-full h-1/3 rounded-t transition-all duration-300" title="Minggu 1: 2 Buku"></div>
                      <div className="bg-blue-200 dark:bg-blue-900/60 w-full h-2/3 rounded-t transition-all duration-300" title="Minggu 2: 4 Buku"></div>
                      <div className="bg-blue-300 dark:bg-blue-800/80 w-full h-5/6 rounded-t transition-all duration-300" title="Minggu 3: 5 Buku"></div>
                      <div className="bg-blue-500 dark:bg-blue-700 w-full h-1/2 rounded-t transition-all duration-300" title="Minggu 4: 3 Buku"></div>
                      <div className="bg-blue-600 dark:bg-blue-500 w-full h-[95%] rounded-t transition-all duration-300" title="Minggu 5: 6 Buku"></div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                      <span>⚡ +12% Keterbacaan dari bulan lalu</span>
                    </p>
                  </div>
                </div>

              </div>
              
              {/* Elegant Welcome panel banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden">
                <div className="space-y-1.5 z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-350 border border-blue-500/20">
                    ⚡ STATUS ONLINE DAN REAL-TIME AKTIF
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-slate-900 dark:text-white">
                    Katalog Buku Perpustakaan Terlengkap
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
                    Selamat datang kembali, <span className="font-bold text-slate-800 dark:text-slate-200">{role === "member" ? "Achmad Naufal" : "Ibu Pustakawan"}</span>. Jelajahi ketersediaan buku fisik, letak rak lemari, serta ulasan komunitas secara langsung.
                  </p>
                </div>

                {/* AI helper shortcut hook */}
                <div 
                  onClick={() => setActiveTab("ai-recommend")}
                  className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 dark:from-indigo-950/40 dark:to-blue-950/20 border border-indigo-200/40 dark:border-indigo-800/45 text-xs flex items-center gap-3 cursor-pointer transition-all hover:scale-[1.02] shrink-0"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md animate-pulse">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                      Pencarian Pintar AI <span className="text-[9px] bg-indigo-200 dark:bg-indigo-900 text-indigo-700 px-1.5 py-0.5 rounded-full uppercase">Baru</span>
                    </h4>
                    <p className="text-[10px] text-indigo-600/70 dark:text-indigo-400">Tanyakan asisten virtual AI Gemini kami</p>
                  </div>
                </div>
              </div>

              {/* Smart filtration and search panels */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-4">
                
                <div className="flex flex-col md:flex-row items-stretch gap-3">
                  
                  {/* Search query input */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari judul buku, penulis, nama kategori, lokasi rak..."
                      className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-400 text-xs"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Dropdowns filters */}
                  <div className="flex flex-wrap items-center gap-2">
                    
                    {/* Year Range Filter */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider font-mono">Tahun</span>
                      <select
                        value={selectedYearRange}
                        onChange={(e) => setSelectedYearRange(e.target.value)}
                        className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-850 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Semua">Semua Era</option>
                        <option value="Terbaru (>= 2022)">Modern (2022 Keatas)</option>
                        <option value="Klasik (<= 2021)">Klasik (2021 Kebawah)</option>
                      </select>
                    </div>

                    {/* Sorting dropdown */}
                    <div className="flex items-center gap-1.5 font-sans">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-415 uppercase tracking-wider font-mono">Urutkan</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-855 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="terpopuler">Terpopuler (Bintang ★)</option>
                        <option value="terbaru">Tahun Terbaru</option>
                        <option value="nama">Nama (A-Z)</option>
                      </select>
                    </div>

                  </div>

                </div>

                {/* Quick Pills for categories */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                  <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-slate-400 shrink-0">Kategori:</span>
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/15"
                          : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

              </div>

              {/* Books catalog grid display */}
              {loading ? (
                <div className="py-24 text-center space-y-4">
                  <div className="inline-block p-4 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 animate-spin">
                    <RefreshCw className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Menghubungkan Database Pintar...</h4>
                </div>
              ) : sortedBooks.length === 0 ? (
                <div className="py-16 text-center text-slate-500 space-y-2 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800/80">
                  <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
                  <h3 className="font-bold">Buku Tidak Ditemukan</h3>
                  <p className="text-xs">Cobalah mengubah kueri pencarian, kategori seleksi, atau saringan tahun rilisan Anda.</p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("Semua");
                      setSelectedYearRange("Semua");
                    }}
                    className="px-4 py-2 bg-blue-600 mt-2 text-white font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Reset Semua Filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onSelect={() => setSelectedBook(book)}
                      onBorrow={() => handleBorrow(book.id)}
                    />
                  ))}
                </div>
              )}

            </div>
          )}

          {activeTab === "ai-recommend" && (
            <div className="animate-in fade-in duration-205">
              <AIRecommender
                books={books}
                onSelectBook={setSelectedBook}
                onBorrowBook={handleBorrow}
              />
            </div>
          )}

          {activeTab === "dashboard" && (
            <div className="animate-in fade-in duration-200">
              <MemberDashboard
                loans={loans}
                books={books}
                onReturnBook={handleReturn}
                onSelectBook={setSelectedBook}
              />
            </div>
          )}

          {activeTab === "rak" && (
            <div className="animate-in fade-in duration-200">
              <ShelfLayout
                books={books}
                onSelectBook={setSelectedBook}
              />
            </div>
          )}

          {activeTab === "admin-panel" && role === "admin" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              
              {/* Visual reports statistics widget always shown above for Librarians */}
              <AnalyticsPanel
                stats={stats}
                loading={statsLoading}
                onRefresh={fetchStats}
              />

              <AdminPanel
                books={books}
                onAddBook={handleAddBook}
                onEditBook={handleEditBook}
                onDeleteBook={handleDeleteBook}
              />

            </div>
          )}

        </main>

        {/* Embedded Book detail modal info view */}
        {selectedBook && (
          <BookDetailModal
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
            onBorrow={() => handleBorrow(selectedBook.id)}
            onSubmitReview={handleSubmitReview}
          />
        )}

      </div>

      {/* Mobile Sticky Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 flex items-center justify-around px-2 py-1">
        <button
          onClick={() => setActiveTab("katalog")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === "katalog" ? "text-blue-600 font-bold bg-slate-50 dark:bg-slate-800" : "text-slate-500"
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Katalog</span>
        </button>
        <button
          onClick={() => setActiveTab("ai-recommend")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === "ai-recommend" ? "text-indigo-600 font-bold bg-slate-50 dark:bg-slate-800" : "text-slate-500"
          }`}
        >
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <span className="text-[9px] mt-0.5">AI</span>
        </button>
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === "dashboard" ? "text-blue-600 font-bold bg-slate-50 dark:bg-slate-800" : "text-slate-500"
          }`}
        >
          <Activity className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Saya</span>
        </button>
        <button
          onClick={() => setActiveTab("rak")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === "rak" ? "text-blue-600 font-bold bg-slate-50 dark:bg-slate-800" : "text-slate-500"
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Rak</span>
        </button>
        {role === "admin" && (
          <button
            onClick={() => setActiveTab("admin-panel")}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
              activeTab === "admin-panel" ? "text-amber-500 font-bold bg-amber-500/10" : "text-slate-500"
            }`}
          >
            <Landmark className="w-5 h-5 text-amber-500" />
            <span className="text-[9px] mt-0.5">Librarian</span>
          </button>
        )}
      </div>

    </div>
  );
}
