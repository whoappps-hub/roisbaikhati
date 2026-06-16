<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Book;
use App\Models\Loan;
use Carbon\Carbon;

class LoanController extends Controller
{
    public function index()
    {
        $loans = Loan::orderBy('id', 'desc')->get();
        return view('peminjaman.index', compact('loans'));
    }

    public function create($book_id)
    {
        $book = Book::findOrFail($book_id);
        if ($book->availableCopies <= 0) {
            return redirect()->back()->with('error', 'Maaf, stok eksemplar buku tersebut sedang habis!');
        }
        return view('peminjaman.create', compact('book'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id',
            'memberName' => 'required|string|max:255',
            'memberId' => 'required|string|max:50'
        ]);

        $book = Book::findOrFail($request->book_id);
        if ($book->availableCopies <= 0) {
            return redirect()->back()->with('error', 'Maaf, stok eksemplar buku tersebut habis');
        }

        $borrowDate = Carbon::now();
        $dueDate = Carbon::now()->addDays(7);

        Loan::create([
            'bookId' => $book->id,
            'bookTitle' => $book->title,
            'memberId' => $request->memberId,
            'memberName' => $request->memberName,
            'borrowDate' => $borrowDate->toDateString(),
            'dueDate' => $dueDate->toDateString(),
            'status' => 'borrowed'
        ]);

        // Kurangi ketersediaan kuantitas buku
        $book->decrement('availableCopies');

        return redirect()->route('peminjaman.index')->with('success', "Sukses Meminjam Buku \"{$book->title}\"! Batas waktu pengembalian " . $dueDate->translatedFormat('d F Y'));
    }

    public function returnBook($loan_id)
    {
        if (session('role', 'user') !== 'admin') {
            return redirect()->back()->with('error', 'Akses Ditolak! Hanya Admin/Pustakawan yang berhak untuk menerima & memproses pengembalian buku anggota.');
        }

        $loan = Loan::findOrFail($loan_id);
        if ($loan->status === 'returned') {
            return redirect()->back()->with('error', 'Buku sudah dikembalikan sebelumnya');
        }

        $loan->update([
            'status' => 'returned',
            'returnDate' => Carbon::now()->toDateString()
        ]);

        // Kembalikan sasis kuantitas buku
        $book = Book::find($loan->bookId);
        if ($book) {
            $book->increment('availableCopies');
        }

        return redirect()->back()->with('success', "Buku \"{$loan->bookTitle}\" berhasil dikembalikan oleh anggota \"{$loan->memberName}\". Terima kasih!");
    }
}
