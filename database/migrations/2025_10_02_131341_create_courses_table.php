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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('external_url');
            $table->string('duration')->nullable(); // e.g., "4 weeks", "2 hours"
            $table->string('platform'); // e.g., "Coursera", "Udemy", "edX"
            $table->string('image_url')->nullable();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->boolean('have_cert')->default(false);
            $table->enum('level', ['beginner', 'intermediate', 'advanced']);
            $table->timestamps();
            
            // Indexes for better search and filter performance
            $table->index('title');
            $table->index('platform');
            $table->index('level');
            $table->index('have_cert');
            $table->index('category_id');
            $table->index(['platform', 'level']); // Composite index for common filter combinations
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
