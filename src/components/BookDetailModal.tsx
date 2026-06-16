import React, { useState } from "react";
import { Book, Review } from "../types";
import { X, Star, MapPin, Send, MessageSquare, AlertTriangle, Calendar } from "lucide-react";

interface BookDetailModalProps {
  book: Book;
  onClose: () => void;
  onBorrow: () => void;
  onSubmitReview: (rating: number, comment: string) => Promise<void>;
}

export default function BookDetailModal({ book, onClose, onBorrow, onSubmitReview }: BookDetailModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    setErr(null);

    try {
      await onSubmitReview(rating, comment);
      setComment("");
      setRating(5);
    } catch (error: any) {
      setErr(error.message || "Gagal mengirim ulasan.");
    } finally {
      setSubmitting(false);
    }
  };

  const isAvailable = book.availableCopies > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      
      {/* Dark overlay backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Main modal surface */}
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button overlay */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 max-h-[80vh] overflow-y-auto pr-1">
          
          {/* Cover book description column */}
          <div className="md:col-span-5 space-y-4">
            <div className="aspect-[3/4] w-full rounded-2xl bg-indigo-600 shadow-xl relative overflow-hidden flex flex-col justify-between p-6 text-white group">
              {book.coverUrl ? (
                <img 
                  src={book.coverUrl} 
                  alt={book.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700"></div>
              )}
              
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/70 z-10"></div>
              
              <div className="absolute inset-0 bg-white/5 opacity-40 mix-blend-overlay z-10"></div>
              <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-black/35 rounded-r-md z-25"></div>

              <div className="z-20 bg-white/15 px-3 py-1.5 rounded-full text-[10px] uppercase font-mono tracking-wider w-fit border border-white/15 backdrop-blur-sm">
                {book.category}
              </div>

              <div className="z-20 space-y-1">
                <p className="text-xs uppercase text-indigo-150 font-mono tracking-wider text-slate-300">{book.author}</p>
                <h3 className="font-serif font-black text-xl leading-tight text-white">{book.title}</h3>
              </div>

              <div className="z-20 flex items-center justify-between pt-3 border-t border-white/20">
                <span className="text-[11px] font-mono">Tahun Terbit: {book.year}</span>
                <span className="flex items-center gap-0.5 text-xs font-bold bg-amber-400 text-slate-900 px-2 py-0.5 rounded-lg">
                  ★ {book.rating}
                </span>
              </div>
            </div>

            {/* Details specifications */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-850 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Kategori Utama</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{book.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Penulis Buku</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{book.author}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tahun Publikasi</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{book.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Registrasi Inventaris</span>
                <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-300">ISBN-{book.id}93-01</span>
              </div>
            </div>

            {/* Availability details */}
            <button
              onClick={() => {
                onBorrow();
                onClose();
              }}
              disabled={!isAvailable}
              className={`w-full py-3.5 rounded-xl font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                isAvailable 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10' 
                  : 'bg-slate-200 text-slate-400 dark:bg-slate-900 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              {isAvailable ? "Pinjam Buku Sekarang (Online)" : "Stok Sedang Habis"}
            </button>
          </div>

          {/* Texts metadata information and reviews tab */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Title & Rack Location */}
            <div className="space-y-2">
              <h1 className="text-2xl font-serif font-black tracking-tight text-slate-900 dark:text-white leading-snug">
                {book.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-400/10 px-3 py-1.5 rounded-xl border border-blue-500/20">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Lokasi Fisik: {book.shelfLocation}</span>
                </div>
                <div className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-xl">
                  Stok: <span className="font-bold text-slate-800 dark:text-white">{book.availableCopies}</span> dari <span className="font-bold text-slate-800 dark:text-white">{book.totalCopies}</span> eksemplar
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-slate-850 dark:text-slate-300">Deskripsi & Sinopsis Buku</h3>
              <p className="text-sm text-slate-605 text-slate-600 dark:text-slate-400 leading-relaxed">
                {book.synopsis}
              </p>
            </div>

            {/* Reviews Section */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-900">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4.5 h-4.5 text-blue-500" /> Ulasan Anggota Komunitas ({book.reviews.length})
              </h3>

              {/* Add simple review form */}
              <form onSubmit={handleReviewSubmit} className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-850">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-300">Bagikan Penilaian Anda:</p>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-0.5 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <Star className={`w-5 h-5 ${star <= rating ? "fill-amber-400 text-amber-400" : ""}`} />
                    </button>
                  ))}
                  <span className="text-xs text-slate-550 ml-1 font-mono">({rating} dari 5 Bintang)</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tulis ulasan Anda tentang buku ini..."
                    className="flex-1 px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={submitting}
                  />
                  <button
                    type="submit"
                    disabled={submitting || !comment.trim()}
                    className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer flex items-center justify-center disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                {err && (
                  <p className="text-[10px] text-rose-600 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {err}
                  </p>
                )}
              </form>

              {/* Reviews List */}
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {book.reviews.length === 0 ? (
                  <p className="text-xs text-slate-450 italic py-4 text-center">Belum ada ulasan untuk buku ini. Jadilah yang pertama memberikan review!</p>
                ) : (
                  book.reviews.map((rev) => (
                    <div key={rev.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950/60 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-805 dark:text-slate-300">{rev.user}</span>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-[10px] text-slate-400">{rev.date}</span>
                          <span className="flex items-center text-amber-500 font-bold ml-1 text-[11px]">
                            ★ {rev.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
