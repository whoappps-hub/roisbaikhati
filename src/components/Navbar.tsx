import React, { useState } from "react";
import { BookOpen, Bell, Sun, Moon, User, Landmark, ShieldAlert, Sparkles, Check } from "lucide-react";
import { LibraryNotification } from "../types";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  role: "member" | "admin";
  setRole: (val: "member" | "admin") => void;
  notifications: LibraryNotification[];
  markAllNotificationsRead: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pushEnabled: boolean;
  togglePushNotifications: () => void;
}

export default function Navbar({
  darkMode,
  setDarkMode,
  role,
  setRole,
  notifications,
  markAllNotificationsRead,
  activeTab,
  setActiveTab,
  pushEnabled,
  togglePushNotifications,
}: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200 border-b glassmorphism border-slate-200/80 dark:border-slate-800/80">
      <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("katalog")}>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20 text-white transform hover:scale-105 transition-transform duration-200">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 font-sans">
              Smart<span className="text-blue-600 dark:text-blue-400">Library</span>
            </h1>
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 tracking-wider uppercase">Sistem Pintar Real-time</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 font-medium text-sm">
          <button
            onClick={() => setActiveTab("katalog")}
            className={`px-4 py-2 rounded-lg transition-colors duration-150 ${
              activeTab === "katalog"
                ? "bg-blue-50 text-blue-600 dark:bg-slate-800/60 dark:text-blue-400"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Katalog Buku
          </button>
          
          <button
            onClick={() => setActiveTab("ai-recommend")}
            className={`px-4 py-2 rounded-lg transition-all duration-150 flex items-center gap-1.5 ${
              activeTab === "ai-recommend"
                ? "bg-indigo-50 text-indigo-600 dark:bg-slate-800/80 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            Asisten AI
          </button>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded-lg transition-colors duration-150 ${
              activeTab === "dashboard"
                ? "bg-blue-50 text-blue-600 dark:bg-slate-800/60 dark:text-blue-400"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Dashboard Anggota
          </button>

          <button
            onClick={() => setActiveTab("rak")}
            className={`px-4 py-2 rounded-lg transition-colors duration-150 ${
              activeTab === "rak"
                ? "bg-blue-50 text-blue-600 dark:bg-slate-800/60 dark:text-blue-400"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Daftar Lokasi Rak
          </button>

          {role === "admin" && (
            <button
              onClick={() => setActiveTab("admin-panel")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-150 flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20`}
            >
              <Landmark className="w-4 h-4" />
              Librarian Panel
            </button>
          )}
        </nav>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          
          {/* Role pill selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 text-xs">
            <button
              onClick={() => {
                setRole("member");
                if (activeTab === "admin-panel") setActiveTab("katalog");
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all duration-150 ${
                role === "member"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"
              }`}
            >
              Anggota
            </button>
            <button
              onClick={() => {
                setRole("admin");
                setActiveTab("admin-panel");
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all duration-150 flex items-center gap-1 ${
                role === "admin"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"
              }`}
            >
              Librarian
            </button>
          </div>

          {/* Dark Mode buttons */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 transition-colors duration-150 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/40 dark:border-slate-800/40 text-slate-600 dark:text-slate-300"
            title="Saran visual malam hari"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 transition-colors duration-150 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/40 dark:border-slate-800/40 text-slate-600 dark:text-slate-300 flex items-center justify-center"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white leading-none animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications panel dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-xl z-50 animate-in fade-in-50 slide-in-from-top-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-blue-500" /> Pusat Notifikasi
                    </h3>
                    <p className="text-[11px] text-slate-500">Pengingat batas waktu & keamanan</p>
                  </div>
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                  >
                    Tandai dibaca
                  </button>
                </div>

                <div className="mt-3 space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">Tidak ada pengingat atau peringatan aktif.</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 rounded-xl border transition-all text-xs ${
                          notif.read
                            ? "bg-slate-50/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-900"
                            : notif.type === "alert"
                            ? "bg-rose-500/10 border-rose-200 dark:border-rose-950/50 text-rose-900 dark:text-rose-200"
                            : "bg-amber-500/10 border-amber-200 dark:border-amber-950/50 text-amber-900 dark:text-amber-200"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="mt-0.5">
                            {notif.type === "alert" ? (
                              <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                            ) : (
                              <Bell className="w-4 h-4 text-amber-500 shrink-0" />
                            )}
                          </span>
                          <div>
                            <div className="font-bold flex items-center gap-1.5">
                              {notif.title}
                              {!notif.read && (
                                <span className="w-1.5 h-1.5 bg-rose-600 rounded-full inline-block"></span>
                              )}
                            </div>
                            <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                              {notif.message}
                            </p>
                            <p className="mt-1.5 font-mono text-[9px] text-slate-400">Jatuh Tempo: {notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">Notifikasi Push Browser</span>
                  <button
                    onClick={togglePushNotifications}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all duration-150 ${
                      pushEnabled
                        ? "bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {pushEnabled ? "● Aktif" : "○ Aktifkan"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User profile identifier */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-xs ring-2 ring-blue-500/10">
              {role === "member" ? "AN" : "LB"}
            </div>
            <div className="text-[11px] leading-tight">
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {role === "member" ? "Achmad Naufal" : "Ibu Pustakawan"}
              </p>
              <p className="text-slate-400 font-mono">
                {role === "member" ? "ID: M-101" : "Pers. ID: L-04"}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Submenu tabs */}
      <div className="md:hidden flex items-center justify-around py-1 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/90 dark:bg-slate-900/90 px-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab("katalog")}
          className={`py-1.5 px-3 rounded-lg ${
            activeTab === "katalog" ? "text-blue-600 font-bold bg-slate-150 dark:bg-slate-800" : "text-slate-500"
          }`}
        >
          Katalog
        </button>
        <button
          onClick={() => setActiveTab("ai-recommend")}
          className={`py-1.5 px-3 rounded-lg flex items-center gap-1 ${
            activeTab === "ai-recommend" ? "text-indigo-600 font-bold bg-slate-150 dark:bg-slate-800" : "text-slate-500"
          }`}
        >
          👋 AI Asisten
        </button>
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`py-1.5 px-3 rounded-lg ${
            activeTab === "dashboard" ? "text-blue-600 font-bold bg-slate-150 dark:bg-slate-800" : "text-slate-500"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("rak")}
          className={`py-1.5 px-3 rounded-lg ${
            activeTab === "rak" ? "text-blue-600 font-bold bg-slate-150 dark:bg-slate-800" : "text-slate-500"
          }`}
        >
          Rak Fisik
        </button>
      </div>

    </header>
  );
}
