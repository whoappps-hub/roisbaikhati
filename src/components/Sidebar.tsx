import React from "react";
import { BookOpen, Sparkles, Activity, MapPin, Landmark, Shield, ToggleLeft, ToggleRight, Database, LogOut } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: "member" | "admin";
  setRole: (role: "member" | "admin") => void;
  booksCount: number;
  currentUser: { name: string; role: "member" | "admin"; id: string; email: string } | null;
  onLogout: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  role,
  setRole,
  booksCount,
  currentUser,
  onLogout,
}: SidebarProps) {
  
  const navItems = [
    {
      id: "katalog",
      label: "Dashboard & Katalog",
      icon: BookOpen,
      badge: booksCount > 0 ? `${booksCount} Buku` : undefined,
    },
    {
      id: "ai-recommend",
      label: "Asisten AI",
      icon: Sparkles,
      badge: "Gemini",
    },
    {
      id: "dashboard",
      label: "Riwayat Saya",
      icon: Activity,
    },
    {
      id: "rak",
      label: "Peta Rak Fisik",
      icon: MapPin,
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 shrink-0 z-40 transition-colors duration-200">
      
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/60">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 transform hover:scale-105 transition-transform duration-200">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        <div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent block">
            Smart Library
          </span>
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#10b981] dark:text-[#34d399] flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping shrink-0"></span> Online Hub
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-350 border-r-4 border-blue-600 dark:border-blue-500 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-850 dark:hover:text-white"
              }`}
            >
              <Icon className={`w-4.5 h-4.5 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`} />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  isActive 
                    ? "bg-blue-100 text-blue-850 dark:bg-blue-900/60 dark:text-blue-200" 
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-450"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Librarian tab option shown directly in main lists if role is admin */}
        {role === "admin" && (
          <button
            id="nav-tab-admin-panel"
            onClick={() => setActiveTab("admin-panel")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer ${
              activeTab === "admin-panel"
                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-r-4 border-amber-600 dark:border-amber-500 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-850 dark:hover:text-white"
            }`}
          >
            <Landmark className="w-4.5 h-4.5 text-amber-500 dark:text-amber-400" />
            <span className="flex-1 truncate">Librarian Panel</span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 uppercase">
              Admin
            </span>
          </button>
        )}
      </nav>

      {/* Admin Mode Bottom Widget Panel */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
        <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-2xl p-4 shadow-md border border-slate-850 dark:border-slate-800/60">
          <div className="flex items-center gap-1.5 mb-2">
            <Database className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Sesi Sasis Aktif</p>
          </div>
          
          <div className="space-y-1.5 text-xs">
            <p className="text-slate-200 font-bold truncate">{currentUser?.name || "Achmad Naufal"}</p>
            <p className="text-[10px] text-slate-450 font-mono flex items-center justify-between">
              <span>ID: {currentUser?.id || "M-101"}</span>
              <span className="capitalize px-1.5 py-0.5 rounded-md bg-slate-800 text-blue-300 text-[9px] font-bold">
                {role === "admin" ? "Pustakawan" : "Anggota"}
              </span>
            </p>
            <p className="text-[10px] text-slate-500 flex items-center gap-1 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span>Online Terhubung</span>
            </p>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-800 flex flex-col gap-2">
            {/* Real Logout Action */}
            <button
              onClick={onLogout}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-550 hover:scale-[1.01] active:scale-[0.99] transition-all rounded-xl text-[11px] font-bold text-center text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-rose-900/10"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span>Keluar Sesi</span>
            </button>
          </div>
        </div>
      </div>

    </aside>
  );
}
