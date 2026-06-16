<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('bookId');
            $table->string('bookTitle');
            $table->string('memberId');
            $table->string('memberName');
            $table->date('borrowDate');
            $table->date('dueDate');
            $table->date('returnDate')->nullable();
            $table->string('status')->default('borrowed');
            $table->timestamps();

            $table->foreign('bookId')->references('id')->on('books')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};
