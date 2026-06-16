import React from "react";
import { Book, Review } from "../types";
import { Star, MapPin, Eye, Play, Bookmark } from "lucide-react";

interface BookCardProps {
  key?: string;
  book: Book;
  onSelect: () => void;
  onBorrow: () => void;
}

export default function BookCard({ book, onSelect, onBorrow }: BookCardProps) {
  // Generate beautiful background gradients for book covers based on their category
  const getCoverColor = (category: string) => {
    switch (category) {
      case "Teknologi":
        return "from-cyan-500 to-blue-600 dark:from-cyan-600 dark:to-blue-700";
      case "Sains":
        return "from-emerald-400 to-teal-600 dark:from-emerald-500 dark:to-teal-700";
      case "Sejarah":
        return "from-amber-500 to-amber-700 dark:from-amber-600 dark:to-amber-800";
      case "Sastra & Filsafat":
        return "from-violet-500 to-indigo-600 dark:from-violet-600 dark:to-indigo-750";
      case "Pengembangan Diri":
        return "from-rose-400 to-pink-600 dark:from-rose-500 dark:to-pink-700";
      case "Bisnis & Keuangan":
        return "from-yellow-500 to-emerald-600 dark:from-yellow-600 dark:to-emerald-750";
      default:
        return "from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-700";
    }
  };

  const isAvailable = book.availableCopies > 0;
  const borrowRatio = (book.availableCopies / book.totalCopies) * 100;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      
      {/* Decorative top corner tag */}
      <span className="absolute top-0 right-0 h-16 w-16 overflow-hidden rounded-bl-3xl">
        <span className="absolute transform rotate-45 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-350 text-[10px] font-bold py-1 text-center w-28 -right-8 top-1 block select-none">
          REAL-TIME
        </span>
      </span>

      <div>
        {/* Modern 3D Premium Cover Indicator */}
        <div 
          onClick={onSelect}
          className="relative aspect-[3/4] w-full rounded-2xl bg-slate-100 dark:bg-slate-900 overflow-hidden shadow-md group-hover:shadow-lg transition-transform duration-300 cursor-pointer transform hover:scale-[1.02]"
        >
          {book.coverUrl ? (
            <img 
              src={book.coverUrl} 
              alt={book.title} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${getCoverColor(book.category)}`}></div>
          )}
          
          {/* Dark gradient overlay so text is ALWAYS perfectly readable and premium */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-slate-950/65 z-10"></div>
          
          {/* Cover glow mesh */}
          <div className="absolute inset-0 bg-white/5 opacity-40 mix-blend-overlay z-10"></div>
          
          {/* Book spines representation */}
          <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-black/30 rounded-r-md z-25"></div>

          {/* Book content overlay */}
          <div className="absolute inset-0 p-4 flex flex-col justify-between text-white z-20">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-widest font-mono bg-white/15 px-2.5 py-1 rounded-full border border-white/15 backdrop-blur-sm">
                {book.category}
              </span>
              <Bookmark className="w-4 h-4 text-white/70" />
            </div>

            <div className="space-y-1 ml-2">
              <p className="text-[10px] uppercase font-mono tracking-wider text-slate-300">{book.author}</p>
              <h4 className="font-serif font-black text-base sm:text-lg leading-snug line-clamp-2 select-none group-hover:text-blue-100 transition-colors">
                {book.title}
              </h4>
            </div>

            <div className="flex items-center justify-between text-[10px] ml-2 font-mono text-white/85 pt-2 border-t border-white/15">
              <span>Tahun: {book.year}</span>
              <span className="flex items-center gap-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {book.rating}
              </span>
            </div>
          </div>
        </div>

        {/* Info detail and physical location */}
        <div className="mt-4 space-y-3">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 
                onClick={onSelect}
                className="font-extrabold text-sm text-slate-850 dark:text-white line-clamp-1 group-hover:text-blue-500 cursor-pointer transition-colors"
                title={book.title}
              >
                {book.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1">Karya: {book.author}</p>
            </div>
          </div>

          {/* Location details */}
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-200/20 dark:border-slate-800/20">
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-mono truncate" title="Lokasi Fisik di Rak">
              {book.shelfLocation}
            </span>
          </div>

          {/* Real-time book circulation counts status */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className={`flex items-center gap-1.5 ${isAvailable ? 'text-green-600 dark:text-green-400' : 'text-rose-600 dark:text-rose-400'}`}>
                <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500 animate-pulse' : 'bg-rose-500'}`}></span>
                {isAvailable ? "Tersedia Peminjaman" : "Habis Dipinjam"}
              </span>
              <span className="text-slate-500 font-mono">
                {book.availableCopies} / {book.totalCopies} Eks
              </span>
            </div>
            
            {/* Real-time progress bar representing available copies */}
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/10 dark:border-slate-800/10 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  book.availableCopies === 0 
                  ? 'bg-rose-500' 
                  : book.availableCopies <= 2 
                  ? 'bg-amber-500' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                }`}
                style={{ width: `${borrowRatio}%` }}
              ></div>
            </div>
          </div>

        </div>
      </div>

      {/* Primary Action Button Options */}
      <div className="mt-4 pt-3 flex items-center gap-1.5 border-t border-slate-100 dark:border-slate-900/80">
        <button
          onClick={onSelect}
          className="flex-1 text-xs py-2 rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 font-bold transition-all duration-150 flex items-center justify-center gap-1 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" /> Detail
        </button>
        <button
          onClick={onBorrow}
          disabled={!isAvailable}
          className={`flex-1 text-xs py-2 rounded-xl font-bold transition-all duration-150 flex items-center justify-center gap-1 cursor-pointer ${
            isAvailable 
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 hover:-translate-y-0.5' 
              : 'bg-slate-200 text-slate-400 dark:bg-slate-900 dark:text-slate-600 cursor-not-allowed'
          }`}
        >
          <Play className="w-3.5 h-3.5" /> Pinjam
        </button>
      </div>

    </div>
  );
}
