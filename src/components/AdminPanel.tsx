import React, { useState } from "react";
import { Book } from "../types";
import { PlusCircle, Edit3, Trash2, Tag, BookOpen, Layers, Archive, AlertCircle, Save, CheckCircle2 } from "lucide-react";

interface AdminPanelProps {
  books: Book[];
  onAddBook: (bookData: Omit<Book, "id" | "rating" | "reviews">) => Promise<void>;
  onEditBook: (bookId: string, bookData: Partial<Book>) => Promise<void>;
  onDeleteBook: (bookId: string) => Promise<void>;
}

export default function AdminPanel({ books, onAddBook, onEditBook, onDeleteBook }: AdminPanelProps) {
  // Tab within Admin Panel: 'add' or 'list'
  const [adminTab, setAdminTab] = useState<"list" | "add" | "edit">("list");
  const [selectedBookToEdit, setSelectedBookToEdit] = useState<Book | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Teknologi");
  const [year, setYear] = useState(new Date().getFullYear());
  const [shelfLocation, setShelfLocation] = useState("Rak Baru A-1");
  const [totalCopies, setTotalCopies] = useState(5);
  const [synopsis, setSynopsis] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setCategory("Teknologi");
    setYear(new Date().getFullYear());
    setShelfLocation("Rak Baru A-1");
    setTotalCopies(5);
    setSynopsis("");
    setCoverUrl("");
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !shelfLocation) {
      setErrorMsg("Semua field berlogo bintang * wajib diisi!");
      return;
    }

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await onAddBook({
        title,
        author,
        category,
        year,
        shelfLocation,
        totalCopies,
        availableCopies: totalCopies,
        synopsis: synopsis || "Belum disediakan ringkasan.",
        coverUrl: coverUrl || undefined,
      });

      setSuccessMsg(`Buku "${title}" sukses didaftarkan secara real-time!`);
      resetForm();
      setAdminTab("list");
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menyimpan buku baru.");
    } finally {
      setLoading(false);
    }
  };

  const startEditFlow = (book: Book) => {
    setSelectedBookToEdit(book);
    setTitle(book.title);
    setAuthor(book.author);
    setCategory(book.category);
    setYear(book.year);
    setShelfLocation(book.shelfLocation);
    setTotalCopies(book.totalCopies);
    setSynopsis(book.synopsis);
    setCoverUrl(book.coverUrl || "");
    setAdminTab("edit");
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookToEdit) return;

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await onEditBook(selectedBookToEdit.id, {
        title,
        author,
        category,
        year,
        shelfLocation,
        totalCopies,
        synopsis,
        coverUrl: coverUrl || undefined,
      });

      setSuccessMsg(`Update data buku "${title}" selesai!`);
      setSelectedBookToEdit(null);
      resetForm();
      setAdminTab("list");
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengubah detail buku.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFlow = async (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus buku "${name}" beserta seluruh rekam datanya?`)) {
      try {
        await onDeleteBook(id);
        alert(`Buku "${name}" telah dihapus.`);
      } catch (err: any) {
        alert(err.message || "Gagal menghapus.");
      }
    }
  };

  const categories = [
    "Teknologi",
    "Sains",
    "Sejarah",
    "Sastra & Filsafat",
    "Pengembangan Diri",
    "Bisnis & Keuangan",
    "Sastra",
    "Agama"
  ];

  return (
    <div className="space-y-6">
      
      {/* Tab select desk */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setAdminTab("list");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              adminTab === "list"
                ? "bg-slate-900 text-white dark:bg-slate-800"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
            }`}
          >
            Daftar Inventaris ({books.length})
          </button>
          
          <button
            onClick={() => {
              setAdminTab("add");
              resetForm();
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              adminTab === "add"
                ? "bg-slate-900 text-white dark:bg-slate-800"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <PlusCircle className="w-4 h-4" /> Tambah Ragam Buku Baru
          </button>
        </div>

        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span> Real-time Hub
        </span>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-green-500/10 border border-green-200 dark:border-green-950/50 text-green-700 dark:text-green-300 flex items-center gap-2 text-xs font-bold font-sans">
          <CheckCircle2 className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-200 dark:border-rose-950/50 text-rose-700 dark:text-rose-300 flex items-center gap-2 text-xs font-bold">
          <AlertCircle className="w-4 h-4" /> {errorMsg}
        </div>
      )}

      {/* Main Panel Content views */}
      {adminTab === "list" ? (
        <div className="overflow-x-auto rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 shadow-md">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/40 text-slate-500 font-bold border-b border-slate-200/50 dark:border-slate-800/50">
                <th className="p-4">Cover / Judul Buku</th>
                <th className="p-4 hidden md:table-cell">Kategori</th>
                <th className="p-4 hidden md:table-cell">Tahun</th>
                <th className="p-4">Lokasi Fisik Rak</th>
                <th className="p-4 text-center">Tersedia / Stok</th>
                <th className="p-4 text-center">Aksi Operasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {book.coverUrl ? (
                        <img 
                          src={book.coverUrl} 
                          alt={book.title} 
                          className="w-9 h-12 rounded-lg object-cover shrink-0 border border-slate-205 dark:border-slate-850"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-9 h-12 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0 font-serif">
                          S-L
                        </div>
                      )}
                      <div>
                        <p className="font-extrabold text-slate-900 dark:text-white line-clamp-1">{book.title}</p>
                        <p className="text-[10px] text-slate-500">Karya: {book.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 rounded-lg text-slate-600 dark:text-slate-400 font-medium">
                      {book.category}
                    </span>
                  </td>
                  <td className="p-4 hidden md:table-cell font-mono">{book.year}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-slate-650 font-sans">
                      <Tag className="w-3.5 h-3.5 text-blue-500" />
                      <span className="font-mono text-[11px] truncate">{book.shelfLocation}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center font-mono font-bold">
                    <span className={book.availableCopies === 0 ? "text-rose-500" : "text-green-600 dark:text-green-400"}>
                      {book.availableCopies}
                    </span> / <span className="text-slate-500">{book.totalCopies}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => startEditFlow(book)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-yellow-500/10 text-slate-600 hover:text-yellow-600 dark:text-slate-400 transition-all cursor-pointer"
                        title="Edit data koordinat buku"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteFlow(book.id, book.title)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-rose-500/10 text-slate-600 hover:text-rose-600 dark:text-slate-400 transition-all cursor-pointer"
                        title="Hapus buku permanen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Add or Edit Form Panel Layout */
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 shadow-md">
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-slate-100 dark:border-slate-900">
            <Archive className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {adminTab === "edit" ? `Edit Data Buku: ${title}` : "Pendaftaran Buku Baru Perpustakaan"}
            </h3>
          </div>

          <form onSubmit={adminTab === "edit" ? handleUpdateSubmit : handleCreateSubmit} className="space-y-4 text-xs">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-705 dark:text-slate-350">Judul Buku *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Seni Hidup Minimalis"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-705 dark:text-slate-350">Nama Penulis / Sastra *</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Contoh: Francine Jay"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-750">Kategori Buku *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-755">Tahun Terbit *</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="font-bold text-slate-755">Spesifik Titik Lokasi Fisik Rak *</label>
                <input
                  type="text"
                  value={shelfLocation}
                  onChange={(e) => setShelfLocation(e.target.value)}
                  placeholder="Contoh: Rak Pengembangan P-03"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-750">Total Kuantitas Buku (Eksemplar) *</label>
                <input
                  type="number"
                  value={totalCopies}
                  onChange={(e) => setTotalCopies(Number(e.target.value))}
                  min={1}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="font-bold text-slate-750">URL Gambar Cover Buku (Opsional)</label>
                <input
                  type="text"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="Contoh: https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-750">Sinopsis Singkat & Resume Buku</label>
              <textarea
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                placeholder="Tuliskan ide pokok atau paragraf sinopsis mengenai buku..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-4 flex items-center gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-blue-500/10"
              >
                <Save className="w-4 h-4" /> {loading ? "Menyimpan..." : "Simpan Berkas Buku"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdminTab("list");
                  resetForm();
                  setSelectedBookToEdit(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition-colors"
              >
                Batal
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
