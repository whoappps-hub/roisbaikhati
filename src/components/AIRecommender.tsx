import React, { useState } from "react";
import { Sparkles, ArrowRight, Loader2, BookOpen, AlertCircle, RefreshCw } from "lucide-react";
import { Book } from "../types";

interface AIRecommenderProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onBorrowBook: (id: string) => void;
}

export default function AIRecommender({ books, onSelectBook, onBorrowBook }: AIRecommenderProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendationResult, setRecommendationResult] = useState<{
    explanation: string;
    recommendedBookIds: string[];
    externalSuggestions: { title: string; author: string; reason: string }[];
  } | null>(null);

  const handleRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: query }),
      });

      if (!response.ok) {
        throw new Error("Gagal menghubungkan ke asisten AI.");
      }

      const data = await response.json();
      setRecommendationResult(data);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  // Pre-configured suggestions to trigger faster
  const presets = [
    "Saya ingin membaca sesuatu tentang ketenangan pikiran dan filsafat stoisisme praktis.",
    "Buku apa yang terbaik untuk belajar pemrograman web modern dan React?",
    "Saya mencari buku sejarah Nusantara kuno",
    "Rekomendasikan buku fiksi ilmiah sains populer"
  ];

  // Match recommended IDs with our catalog books
  const matchedBooks = recommendationResult
    ? books.filter((b) => recommendationResult.recommendedBookIds.includes(b.id))
    : [];

  return (
    <div className="space-y-6">
      
      {/* Premium AI Banner Card */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl border border-indigo-200 dark:border-indigo-950/80 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 text-white shadow-xl shadow-indigo-600/10">
        
        {/* Abstract vector spheres */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl transform translate-x-12 -translate-y-12"></div>
        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-blue-500/10 rounded-full blur-xl"></div>

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold tracking-wider uppercase border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-indigo-200 animate-spin" /> PUSTAKAWAN PINTAR GEMINI
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight leading-tight">
              Temukan Bacaan Terbaik Anda Berbasis Kecerdasan Buatan (AI)
            </h2>
            <p className="text-sm text-indigo-100/90 leading-relaxed max-w-xl">
              Cukup ketik minat, hobi, atau suasana hati Anda dalam satu kalimat penuh. Kecerdasan Buatan kami akan merinci rekomendasi buku dari database Smart Library terbaik untuk Anda mendalam secara real-time.
            </p>
          </div>
        </div>

        {/* Form Search Prompt */}
        <form onSubmit={handleRecommend} className="relative mt-8 max-w-3xl flex flex-col sm:flex-row items-stretch gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Contoh: 'Saya ingin mulai rajin membaca buku tentang kebiasaan baik dan kesuksesan...'"
              className="w-full px-5 py-4 pl-5 rounded-2xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 border border-transparent shadow-lg text-sm transition-all"
              disabled={loading}
            />
            {loading && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
          >
            {loading ? "Menganalisis..." : "Tanya AI"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Prompt Presets */}
        <div className="mt-6">
          <p className="text-xs text-indigo-200 font-medium tracking-wide">💡 Ketuk contoh pertanyaan cepat berikut:</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuery(preset)}
                className="text-[11px] px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/5 hover:border-white/20 text-white transition-all text-left"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Recommendations Results Block */}
      {loading && (
        <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 rounded-2xl bg-white dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50">
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Asisten AI Sedang Berpikir</h4>
            <p className="text-xs text-slate-500 max-w-md">Menganalisis koleksi katalog perpustakaan, mengaitkan kecocokan topik, dan merangkum kesimpulan terbaik...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-rose-500" />
          <div>
            <h4 className="font-bold text-sm">Masalah Koneksi AI</h4>
            <p className="text-xs mt-1 text-rose-600 dark:text-rose-400">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-xs font-semibold text-rose-900 dark:text-rose-200 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Coba Lagi
            </button>
          </div>
        </div>
      )}

      {recommendationResult && !loading && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Main thoughts card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 shadow-md">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-3">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <h3 className="font-bold text-base">Analisa & Tanggapan Pustakawan AI</h3>
            </div>
            <p className="text-sm text-slate-705 dark:text-slate-300 leading-relaxed text-slate-700">
              "{recommendationResult.explanation}"
            </p>
          </div>

          {/* Local books recommended */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-300 tracking-wide uppercase px-1">
              📚 Koleksi Perpustakaan Kami yang Sangat Cocok
            </h4>
            
            {matchedBooks.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-dashed border-slate-200 dark:border-slate-8次">
                Topik spesifik ini tidak ditemukan di koleksi rak kami saat ini. Tapi kami menyarankan usulan tambahan di bawah!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchedBooks.map((book) => (
                  <div
                    key={book.id}
                    className="flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-20 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center justify-center shrink-0">
                        <BookOpen className="w-6 h-6 text-indigo-500" />
                        <span className="text-[8px] font-mono mt-1 uppercase text-slate-400">Smart</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300 font-semibold font-sans">
                          {book.category}
                        </span>
                        <h5
                          onClick={() => onSelectBook(book)}
                          className="font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer line-clamp-1"
                        >
                          {book.title}
                        </h5>
                        <p className="text-xs text-slate-550 dark:text-slate-400">oleh {book.author}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{book.synopsis}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-900/80 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-450 dark:text-slate-500">
                        Lokasi: {book.shelfLocation}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onSelectBook(book)}
                          className="text-xs text-slate-600 dark:text-slate-400 hover:underline px-2.5 py-1"
                        >
                          Rincian
                        </button>
                        <button
                          onClick={() => onBorrowBook(book.id)}
                          disabled={book.availableCopies === 0}
                          className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-xl disabled:opacity-50"
                        >
                          Pinjam Online
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* External additional suggestions */}
          {recommendationResult.externalSuggestions && recommendationResult.externalSuggestions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase px-1">
                🌐 Perspektif Tambahan: Referensi Buku Luar yang Direkomendasikan
              </h4>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-indigo-950/20 border border-blue-100 dark:border-indigo-950 text-xs">
                <div className="space-y-3">
                  {recommendationResult.externalSuggestions.map((ext, idx) => (
                    <div key={idx} className="flex gap-2">
                      <div className="font-bold text-indigo-500 shrink-0">#{idx + 1}</div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white inline-block">
                          {ext.title} <span className="font-normal text-slate-500 text-[11px]">oleh {ext.author}</span>
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                          {ext.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
