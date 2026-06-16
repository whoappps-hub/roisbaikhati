import React, { useState } from "react";
import { Book } from "../types";
import { MapPin, Library, Search, Layers, Compass, BookOpen } from "lucide-react";

interface ShelfLayoutProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

export default function ShelfLayout({ books, onSelectBook }: ShelfLayoutProps) {
  // Extract unique shelf coordinates or general group names
  const shelfCategories = [
    { id: "all", name: "Semua Rak Perpustakaan", desc: "Akses seluruh isi penyimpanan fisik", floor: "Lantai 1 & 2" },
    { id: "T-1", name: "Rak Teknologi T-12 / T-15", pattern: "Teknologi", desc: "Sumbu Komputasi & AI", floor: "Lantai 1 - Sayap Kiri" },
    { id: "S-0", name: "Rak Sains S-08", pattern: "Sains", desc: "Sains Murni & Fisika Kuantum", floor: "Lantai 1 - Sayap Kanan" },
    { id: "S-1", name: "Rak Sosial S-01", pattern: "Filsafat", desc: "Sastra & Filsafat Ringkas", floor: "Lantai 2 - Sayap Tengah" },
    { id: "H-0", name: "Rak Sejarah H-03", pattern: "Sejarah", desc: "Arsip Kronologi & Antropologi", floor: "Lantai 2 - Sektor Timur" },
    { id: "P-0", name: "Rak Psikologi P-04", pattern: "Pengembangan Diri", desc: "Psikologi & Kebiasaan Praktis", floor: "Lantai 2 - Sektor Selatan" },
    { id: "B-0", name: "Rak Bisnis B-09", pattern: "Bisnis", desc: "Ilmu Ekonomi & Finansial Modern", floor: "Lantai 1 - Sektor Barat" }
  ];

  const [selectedShelf, setSelectedShelf] = useState("all");

  const filteredBooks = books.filter((book) => {
    if (selectedShelf === "all") return true;
    
    // Find matching category pattern config
    const active = shelfCategories.find((sc) => sc.id === selectedShelf);
    if (!active) return true;

    return book.category.toLowerCase().includes(active.pattern!.toLowerCase()) || 
           book.shelfLocation.toLowerCase().includes(active.pattern!.toLowerCase());
  });

  return (
    <div className="space-y-6">
      
      {/* Introduction banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 shadow-md">
        <div className="flex items-center gap-2.5 text-blue-600 dark:text-blue-400">
          <Compass className="w-5.5 h-5.5 animate-spin-slow" />
          <h3 className="font-extrabold text-sm text-slate-850 dark:text-slate-200">Asisten Lokasi Fisik & Titik Rak</h3>
        </div>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
          Sistem Smart Library terintegrasi langsung dengan titik navigasi fisik perpustakaan. Pilih rak di bawah untuk mengetahui kode rak, letak tumpukan lantai buku, dan seketika menyaring isi buku spesifik di titik tersebut tanpa perlu tersesat mencari di perpustakaan fisik.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Shelf categories filters */}
        <div className="lg:col-span-5 space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Daftar Rak / Lemari Utama</h4>
          
          <div className="space-y-2">
            {shelfCategories.map((sc) => (
              <button
                key={sc.id}
                onClick={() => setSelectedShelf(sc.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex justify-between items-center ${
                  selectedShelf === sc.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10"
                    : "bg-white dark:bg-slate-950 border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                <div>
                  <h5 className="font-extrabold text-xs">{sc.name}</h5>
                  <p className={`text-[10px] mt-0.5 ${selectedShelf === sc.id ? "text-blue-105" : "text-slate-500"}`}>
                    {sc.desc}
                  </p>
                  <span className={`inline-block text-[9px] font-mono mt-1 px-2 py-0.5 rounded-full ${selectedShelf === sc.id ? 'bg-white/15' : 'bg-slate-100 dark:bg-slate-900 text-slate-450 dark:text-slate-500'}`}>
                    📍 Letak: {sc.floor}
                  </span>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${selectedShelf === sc.id ? 'bg-white/20' : 'bg-slate-50 dark:bg-slate-900'}`}>
                  <MapPin className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filtered books list at this coordinates */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Isi Buku pada Lokasi Rak Terpilih ({filteredBooks.length})
            </h4>
            <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-extrabold">
              {selectedShelf === "all" ? "Semua Rak" : shelfCategories.find((s) => s.id === selectedShelf)?.pattern}
            </span>
          </div>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {filteredBooks.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-950 border border-dashed rounded-3xl">
                Tidak ada entri buku fisik pada rak ini saat ini.
              </div>
            ) : (
              filteredBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => onSelectBook(book)}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 hover:border-blue-500 dark:border-slate-850 hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-14 rounded-lg bg-indigo-50 dark:bg-slate-900 flex flex-col items-center justify-center text-indigo-500 font-bold text-[8px] font-serif border border-slate-200/40 shrink-0">
                      <span>BOOK</span>
                      <span>CODE</span>
                    </div>
                    <div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold font-sans">
                        {book.category}
                      </span>
                      <h5 className="font-extrabold text-xs text-slate-900 dark:text-white mt-1 group-hover:text-blue-500">
                        {book.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">Penulis: {book.author}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-blue-600/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg font-bold border border-blue-500/10">
                      📍 {book.shelfLocation}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">Stok di Rak: {book.availableCopies} Eks</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
