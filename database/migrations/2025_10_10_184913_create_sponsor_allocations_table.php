<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Represents money GIVEN from a sponsor to a person for a (optional) course
    public function up(): void
    {
        Schema::create('sponsor_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sponsor_id')->constrained()->cascadeOnDelete();

            // Who received it (free text, required)
            $table->string('recipient_full_name');

            // Link to a course if exists (nullable for deleted/no course cases)
            $table->foreignId('course_id')->nullable()->constrained()->nullOnDelete();

            // Backup external URL in case course is gone
            $table->string('course_external_url')->nullable();

            // Money given
            $table->decimal('amount', 12, 2);

            // Optional admin note
            $table->text('admin_note')->nullable();

            $table->timestamps();

            $table->index(['sponsor_id', 'recipient_full_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sponsor_allocations');
    }
};
