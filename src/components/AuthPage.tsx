import React, { useState } from "react";
import { BookOpen, Key, Mail, User, Shield, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

interface AuthPageProps {
  onLogin: (userData: { name: string; role: "member" | "admin"; id: string; email: string }) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Persistent simulated user accounts to allow real signups and logins!
  const [users, setUsers] = useState<Array<{ name: string; email: string; pass: string; id: string; role: "member" | "admin" }>>(() => {
    const saved = localStorage.getItem("perpus_simulated_users");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      { name: "Ibu Pustakawan (Admin)", email: "admin@perpus.id", pass: "admin123", id: "A-101", role: "admin" }
    ];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isLogin) {
      if (!email || !password) {
        setError("Harap isi alamat email dan kata sandi Anda!");
        return;
      }

      const match = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!match) {
        setError("Alamat email belum terdaftar di sistem. Silakan daftarkan diri sebagai Anggota terlebih dahulu.");
        return;
      }

      if (match.pass !== password) {
        setError("Kombinasi email dan kata sandi Anda salah!");
        return;
      }

      onLogin({
        name: match.name,
        role: match.role,
        id: match.id,
        email: match.email
      });
    } else {
      // Signup flow simulation for members only
      if (!fullName.trim() || !email.trim() || !password) {
        setError("Harap lengkapi semua field yang ditandai bintang!");
        return;
      }
      
      const emailLower = email.trim().toLowerCase();
      if (users.some(u => u.email.toLowerCase() === emailLower)) {
        setError("Alamat email ini sudah terdaftar!");
        return;
      }

      const generatedId = `M-${Math.floor(100 + Math.random() * 900)}`;
      const newUser = {
        name: fullName.trim(),
        email: emailLower,
        pass: password,
        id: generatedId,
        role: "member" as const
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem("perpus_simulated_users", JSON.stringify(updatedUsers));

      setSuccess(`Pendaftaran Berhasil! ID Anggota Anda adalah ${generatedId}. Silakan masuk`);
      
      // Clear inputs
      setFullName("");
      
      // Auto toggle to Login with filled states
      setTimeout(() => {
        setIsLogin(true);
        setSuccess("");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#080b11] p-4 sm:p-6 transition-colors duration-300">
      
      {/* Background Ambience Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-5xl bg-white dark:bg-[#0e131f] rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 transition-all duration-300">
        
        {/* Left Aspect: Branding and Welcoming Info */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-grid-white/[0.03] pointer-events-none"></div>
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <BookOpen className="w-6 h-6 text-blue-200" />
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight text-white block">Smart Library</span>
                <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-450 uppercase">v2.1 Stable</span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <h1 className="text-3xl sm:text-4xl font-serif font-black leading-tight tracking-tight text-white">
                Sistem Penjelajahan Buku Pintar
              </h1>
              <p className="text-xs text-slate-300/90 leading-relaxed font-sans max-w-sm">
                Akses katalog buku fisik premium, sinkronisasi sirkulasi mandiri, rekomendasi AI Gemini, dan pemonitoran rak nirkabel dalam satu genggaman.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-12 relative z-10">
            <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-xs">
              <div className="flex items-center gap-2 mb-1.5 text-blue-200 font-bold uppercase tracking-wider font-mono text-[10px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Teknologi Integrasi AI</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                "Masuk untuk langsung bisa berinteraksi dengan AI Librarian untuk rekomendasi baca dan cari asisten buku digital."
              </p>
            </div>

            <p className="text-[10px] text-slate-400 font-mono">
              &copy; 2026 E-Pustaka Modern Co. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Aspect: Authentication Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-[#0e131f]">
          
          <div className="max-w-md w-full mx-auto space-y-6">
            
            {/* Tab Toggles for Login / Signup */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-black tracking-tight text-slate-900 dark:text-white">
                  {isLogin ? "Selamat Datang Kembali" : "Buat Akun Anggota baru"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isLogin ? "Silakan masuk untuk menyambung ke sasis katalog perpustakaan." : "Isi form pendaftaran anggota di bawah dengan cermat."}
                </p>
              </div>
            </div>

            {/* Notification messages */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2.5">
                <span className="text-sm">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Mode Switcher Buttons */}
            <div className="p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800/80 flex gap-1">
              <button
                type="button"
                onClick={() => { setIsLogin(true); setError(""); setSuccess(""); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isLogin
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-slate-800"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                Masuk Sistem
              </button>
              <button
                type="button"
                onClick={() => { setIsLogin(false); setError(""); setSuccess(""); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  !isLogin
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-slate-800"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                Daftar Anggota
              </button>
            </div>

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400 block font-mono">
                    Nama Lengkap *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Contoh: Achmad Naufal"
                      className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-55 dark:bg-slate-950 border border-slate-250 dark:border-slate-800/80 text-xs text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
                    />
                  </div>
                </div>
              )}

              {/* Email ID input */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400 block font-mono">
                  Alamat Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Contoh: naufal@perpus.id"
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-55 dark:bg-slate-950 border border-slate-250 dark:border-slate-800/80 text-xs text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Password ID input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400 block font-mono">
                    Kata Sandi *
                  </label>
                  {isLogin && (
                    <a href="#" className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline">
                      Lupa Sandi?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukan minimal 6 karakter"
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-55 dark:bg-slate-950 border border-slate-250 dark:border-slate-800/80 text-xs text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Submit Action Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-550 hover:to-indigo-550 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{isLogin ? "Masuk ke Dashboard" : "Setujui & Daftar Anggota"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}
