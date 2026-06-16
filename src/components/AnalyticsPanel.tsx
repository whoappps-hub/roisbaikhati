import React, { useEffect, useState } from "react";
import { LibraryStats } from "../types";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { Loader2, TrendingUp, Inbox, Disc, Activity, AlertCircle, RefreshCw, Layers } from "lucide-react";

interface AnalyticsPanelProps {
  stats: LibraryStats | null;
  loading: boolean;
  onRefresh: () => void;
}

export default function AnalyticsPanel({ stats, loading, onRefresh }: AnalyticsPanelProps) {
  const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#f43f5e", "#06b6d4", "#ec4899"];

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-center space-y-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-xs text-slate-500 font-mono">Menyusun rekap statistik visual...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="py-12 text-center text-xs text-slate-400 space-y-2">
        <AlertCircle className="w-8 h-8 mx-auto text-rose-500" />
        <p>Gagal memuat visual analytics.</p>
        <button onClick={onRefresh} className="px-4 py-2 bg-slate-100 rounded-xl hover:bg-slate-200">
          Muat Ulang
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top action header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Laporan Analisa & Statistik Bulanan</h2>
          <p className="text-[11px] text-slate-400">Ikhtisar tren pembaca, sirkulasi buku, dan performa perpustakaan</p>
        </div>
        <button
          onClick={onRefresh}
          className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-600 dark:text-slate-400 cursor-pointer flex items-center gap-1 text-[11px] font-bold"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Segarkan Grafik
        </button>
      </div>

      {/* Librarian main highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 text-blue-900 dark:text-blue-200 shadow-sm">
          <Activity className="w-5 h-5 text-blue-500" />
          <p className="text-[10px] uppercase font-mono font-black mt-2 text-slate-450 tracking-wider">Perputaran Peminjaman</p>
          <h3 className="text-2xl font-black mt-1">{stats.borrowedCount} Buku Aktif</h3>
          <p className="text-[10px] mt-1 text-slate-500">Buku sedang dipelajari di luar</p>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 shadow-sm">
          <Inbox className="w-5 h-5 text-emerald-500" />
          <p className="text-[10px] uppercase font-mono font-black mt-2 text-slate-450 tracking-wider">Kapasitas Maksimal</p>
          <h3 className="text-2xl font-black mt-1">{stats.totalCopies} Eks</h3>
          <p className="text-[10px] mt-1 text-slate-500">Mencakup {stats.booksCount} ragam judul buku</p>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-violet-500/10 to-purple-500/5 border border-violet-500/20 text-violet-900 dark:text-violet-200 shadow-sm">
          <TrendingUp className="w-5 h-5 text-violet-500" />
          <p className="text-[10px] uppercase font-mono font-black mt-2 text-slate-450 tracking-wider">Target Literasi Bulan Ini</p>
          <h3 className="text-2xl font-black mt-1">{( (stats.borrowedCount + 12) / stats.monthlyTarget * 100).toFixed(0)}%</h3>
          <p className="text-[10px] mt-1 text-slate-500">Target sirkulasi {stats.monthlyTarget} transaksi harian</p>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-500/10 to-pink-500/5 border border-rose-500/20 text-rose-900 dark:text-rose-200 shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-500" />
          <p className="text-[10px] uppercase font-mono font-black mt-2 text-slate-450 tracking-wider">Tingkat Tunggakan</p>
          <h3 className="text-2xl font-black mt-1">{stats.overdueCount} Pembaca</h3>
          <p className="text-[10px] mt-1 text-slate-500">Batas waktu terlewati minggu ini</p>
        </div>

      </div>

      {/* Recharts chart matrices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly line graph tracking loans vs returns */}
        <div className="lg:col-span-7 p-5 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Tren Sirkulasi & Keterbacaan Semester Ini</h3>
            <p className="text-[11px] text-slate-400">Membandingkan frekuensi peminjaman berbanding pengembalian terdata</p>
          </div>

          <div className="h-[280px] w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyLendingTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderRadius: '12px', 
                    color: '#fff', 
                    border: 'none',
                    fontSize: '11px'
                  }} 
                />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="loans" name="Buku Dipinjam" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="returns" name="Buku Kembali" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories break-down bar chart */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Preferensi Kategori Terbanyak</h3>
            <p className="text-[11px] text-slate-405 text-slate-400">Menampilkan pengelompokan minat baca pengunjung perpustakaan</p>
          </div>

          <div className="h-[285px] w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryChartData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="name" type="category" stroke="#64748b" width={80} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderRadius: '12px', 
                    color: '#fff', 
                    border: 'none',
                    fontSize: '11px' 
                  }} 
                />
                <Bar dataKey="value" name="Peminjaman" radius={[0, 8, 8, 0]}>
                  {stats.categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
