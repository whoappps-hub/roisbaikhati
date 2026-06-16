<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'category',
        'year',
        'shelfLocation',
        'totalCopies',
        'availableCopies',
        'synopsis',
        'rating',
        'coverUrl'
    ];

    public function loans()
    {
        return $this->hasMany(Loan::class, 'bookId');
    }
}
