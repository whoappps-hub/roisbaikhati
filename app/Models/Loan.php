<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    use HasFactory;

    protected $fillable = [
        'bookId',
        'bookTitle',
        'memberId',
        'memberName',
        'borrowDate',
        'dueDate',
        'returnDate',
        'status'
    ];

    public function book()
    {
        return $this->belongsTo(Book::class, 'bookId');
    }
}
