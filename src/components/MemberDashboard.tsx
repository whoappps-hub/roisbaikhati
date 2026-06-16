import React from "react";
import { Loan, Book } from "../types";
import { Clock, CheckCircle2, RotateCcw, AlertTriangle, Bookmark, BookOpen, AlertCircle } from "lucide-react";

interface MemberDashboardProps {
  loans: Loan[];
  books: Book[];
  onReturnBook: (loanId: string) => void;
  onSelectBook: (book: Book) => void;
}

export default function MemberDashboard({ loans, books, onReturnBook, onSelectBook }: MemberDashboardProps) {
  const activeLoans = loans.filter((l) => l.status === "borrowed" || l.status === "overdue");
  const pastLoans = loans.filter((l) => l.status === "returned");

  // Calculate stats
  const totalBorrowed = loans.length;
  const returnedCount = pastLoans.length;
  const outstandingCount = activeLoans.length;
  const penaltyCount = loans.filter((l) => l.status === "overdue").length;

  const getDaysRemaining = (dueDateStr: string): number => {
    const due = new Date(dueDateStr);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Stats Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Total Peminjaman</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{totalBorrowed} Buku</h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Telah Dikembalikan</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{returnedCount} Buku</h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Aktif Meminjam</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{outstandingCount} Buku</h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Terlambat Kembali</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{penaltyCount} Buku</h3>
          </div>
        </div>

      </div>

      {/* Main active loans row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active loans table panel */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 shadow-md">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-900">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Peminjaman Buku Aktif Anda</h3>
                <p className="text-[11px] text-slate-500">Kembalikan tepat waktu untuk menjaga reputasi peminjaman</p>
              </div>
              <span className="text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 font-bold rounded-full font-mono">
                {activeLoans.length} Aktif
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {activeLoans.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-450 space-y-2">
                  <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>Anda sedang tidak meminjam buku apapun dari perpustakaan.</p>
                  <p className="text-[10px] text-slate-400">Buka Katalog Buku dan pilih buku favorit Anda untuk dipinjam online.</p>
                </div>
              ) : (
                activeLoans.map((loan) => {
                  const daysLeft = getDaysRemaining(loan.dueDate);
                  const isOverdue = loan.status === "overdue" || daysLeft < 0;

                  return (
                    <div
                      key={loan.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isOverdue
                          ? "bg-rose-500/5 hover:bg-rose-500/10 border-rose-200 dark:border-rose-950/40 text-rose-900 dark:text-rose-200"
                          : daysLeft <= 2
                          ? "bg-amber-500/5 hover:bg-amber-500/10 border-amber-200 dark:border-amber-950/40 text-amber-900 dark:text-amber-200"
                          : "bg-slate-50/50 hover:bg-slate-50 border-slate-150 dark:bg-slate-900/30 dark:border-slate-900"
                      }`}
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 
                            onClick={() => {
                              const bObj = books.find((b) => b.id === loan.bookId);
                              if (bObj) onSelectBook(bObj);
                            }}
                            className="font-bold text-sm text-slate-900 dark:text-white cursor-pointer hover:underline"
                          >
                            {loan.bookTitle}
                          </h4>
                          {isOverdue && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-rose-600 font-bold text-[9px] text-white uppercase rounded-md tracking-wider">
                              TERLAMBAT
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-500">
                          <span>Dipinjam: {loan.borrowDate}</span>
                          <span>•</span>
                          <span>Kembali: {loan.dueDate}</span>
                        </div>
                      </div>

                      {/* Timeline Counter Badge */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 min-w-[200px]">
                        <div>
                          {isOverdue ? (
                            <p className="text-xs text-rose-600 font-extrabold flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" /> Denda dsb Aktif
                            </p>
                          ) : (
                            <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">
                              Tersisa: <span className="font-mono text-blue-600 dark:text-blue-400 font-extrabold">{daysLeft} Hari</span>
                            </p>
                          )}
                          <p className="text-[10px] text-slate-400 font-mono">Batas: {loan.dueDate}</p>
                        </div>

                        <button
                          onClick={() => onReturnBook(loan.id)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10 cursor-pointer flex items-center gap-1 hover:-translate-y-0.5 transition-all"
                        >
                          <RotateCcw className="w-3 h-3" /> Kembalikan
                        </button>
                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

        {/* Historical reading logs table sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 shadow-md">
            
            <div className="pb-4 border-b border-slate-100 dark:border-slate-900">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Riwayat Buku yang Dibaca</h3>
              <p className="text-[11px] text-slate-400">Arsip seluruh buku yang berhasil dituntaskan</p>
            </div>

            <div className="mt-4 space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {pastLoans.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400 italic">Belum ada riwayat buku yang dikembalikan.</p>
              ) : (
                pastLoans.map((loan) => (
                  <div
                    key={loan.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/30 dark:bg-slate-900/10 flex items-center gap-2.5 text-xs justify-between"
                  >
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{loan.bookTitle}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Kembali: {loan.returnDate}</p>
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-0.5 text-green-600 dark:text-green-400 font-bold bg-green-500/10 px-2 py-1 rounded-lg text-[9px] uppercase tracking-wide">
                      ✔ Selesai
                    </span>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
