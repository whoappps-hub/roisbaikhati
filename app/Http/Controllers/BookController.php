<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Book;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $category = $request->input('category');

        $categories = Book::distinct()->orderBy('category')->pluck('category');

        $query = Book::query();

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%")
                  ->orWhere('shelfLocation', 'like', "%{$search}%");
            });
        }

        if ($category) {
            $query->where('category', $category);
        }

        $books = $query->orderBy('id', 'desc')->get();

        // Statistik Perpustakaan
        $stats = [
            'total_titles' => Book::count(),
            'total_exemplars' => Book::sum('totalCopies'),
            'total_avail' => Book::sum('availableCopies')
        ];

        return view('welcome', compact('books', 'categories', 'stats', 'search', 'category'));
    }

    public function adminIndex()
    {
        if (session('role', 'user') !== 'admin') {
            return redirect()->route('katalog.index')->with('error', 'Akses Ditolak! Halaman Admin/Pustakawan hanya dapat diakses setelah beralih peran ke Admin.');
        }
        $books = Book::orderBy('id', 'desc')->get();
        $loans = \App\Models\Loan::orderBy('id', 'desc')->get();
        return view('admin.index', compact('books', 'loans'));
    }

    public function store(Request $request)
    {
        if (session('role', 'user') !== 'admin') {
            return redirect()->route('katalog.index')->with('error', 'Akses Ditolak! Hanya Admin/Pustakawan yang dapat menambahkan koleksi buku.');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'category' => 'required|string',
            'year' => 'required|integer',
            'shelfLocation' => 'required|string',
            'totalCopies' => 'required|integer|min:1',
            'coverUrl' => 'nullable|url',
        ]);

        Book::create([
            'title' => $request->title,
            'author' => $request->author,
            'category' => $request->category,
            'year' => $request->year,
            'shelfLocation' => $request->shelfLocation,
            'totalCopies' => $request->totalCopies,
            'availableCopies' => $request->totalCopies,
            'synopsis' => $request->synopsis ?: 'Ringkasan belum tersedia.',
            'coverUrl' => $request->coverUrl ?: null,
            'rating' => 5.0
        ]);

        return redirect()->route('admin.index')->with('success', "Sukses mendaftarkan buku baru \"{$request->title}\" secara real-time!");
    }

    public function destroy(Book $book)
    {
        if (session('role', 'user') !== 'admin') {
            return redirect()->route('katalog.index')->with('error', 'Akses Ditolak! Hanya Admin/Pustakawan yang dapat menghapus buku.');
        }

        $book->delete();
        return redirect()->route('admin.index')->with('success', "Sukses menghapus data buku \"{$book->title}\" dari sasis database.");
    }
}
