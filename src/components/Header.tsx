import React, { useState } from "react";
import { Bell, Sun, Moon, Search, ShieldAlert, Sparkles, X } from "lucide-react";
import { LibraryNotification } from "../types";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  notifications: LibraryNotification[];
  markAllNotificationsRead: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  role: "member" | "admin";
  activeTab: string;
  setActiveTab: (val: string) => void;
  pushEnabled: boolean;
  togglePushNotifications: () => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  notifications,
  markAllNotificationsRead,
  darkMode,
  setDarkMode,
  role,
  activeTab,
  setActiveTab,
  pushEnabled,
  togglePushNotifications,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200">
      
      {/* Search Input bar */}
      <div className="relative w-full max-w-sm sm:max-w-md mr-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            // Auto switch back to catalog search if necessary
            if (activeTab !== "katalog" && activeTab !== "rak" && e.target.value.trim() !== "") {
              setActiveTab("katalog");
            }
          }}
          placeholder="Tanya AI: 'Cari buku fiksi' atau telusuri koleksi..."
          className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-sans text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-400 shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Control Tools and Profile Details */}
      <div className="flex items-center gap-4 sm:gap-6 shrink-0">
        
        {/* Dark Mode Switcher */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 transition-colors duration-150 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 cursor-pointer"
          title="Tukar Mode Gelap"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* Dynamic Alert and Notifications drop-down */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800/80 rounded-xl transition-all text-slate-500 hover:text-slate-800 dark:text-slate-450 dark:hover:text-white cursor-pointer flex items-center justify-center shadow-sm"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-600 border border-white dark:border-slate-900 text-[9px] font-black text-white leading-none animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-xl z-50 animate-in fade-in-50 slide-in-from-top-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-150 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-blue-500" /> Pusat Notifikasi
                  </h3>
                  <p className="text-[10px] text-slate-500">Pengingat batas waktu & keamanan</p>
                </div>
                <button
                  onClick={() => {
                    markAllNotificationsRead();
                    setShowNotifications(false);
                  }}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
                >
                  Tandai dibaca
                </button>
              </div>

              <div className="mt-3 space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-[11px] text-slate-400">Tidak ada pengingat aktif.</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-xl border transition-all text-[11px] ${
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
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          ) : (
                            <Bell className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          )}
                        </span>
                        <div>
                          <div className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
                            {notif.title}
                            {!notif.read && (
                              <span className="w-1.5 h-1.5 bg-rose-600 rounded-full inline-block"></span>
                            )}
                          </div>
                          <p className="mt-1 text-slate-600 dark:text-slate-300 leading-snug">
                            {notif.message}
                          </p>
                          <p className="mt-1 font-mono text-[9px] text-slate-400">Jatuh Tempo: {notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Notifikasi Push Browser</span>
                <button
                  onClick={togglePushNotifications}
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all duration-150 ${
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

        {/* User Identity Avatar Profile Box matching design spec */}
        <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4 sm:pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-extrabold text-slate-850 dark:text-white">
              {role === "member" ? "Achmad Naufal" : "Ibu Pustakawan"}
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              {role === "member" ? "Premium Member" : "Sistem Administrator"}
            </p>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-slate-800 dark:to-slate-900 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700 shrink-0 flex items-center justify-center font-bold text-xs text-blue-600 dark:text-blue-300 shadow-sm">
            <img
              src={`https://ui-avatars.com/api/?name=${role === "member" ? "Achmad+Naufal" : "Pustakawan"}&background=0284c7&color=fff&size=128`}
              alt="Avatar Profile"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>

    </header>
  );
}
