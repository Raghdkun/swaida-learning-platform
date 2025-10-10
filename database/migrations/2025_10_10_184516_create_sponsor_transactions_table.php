<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Logs money MOVEMENTS into a sponsor: top-ups, manual adjustments, refunds (from allocation edits/deletes)
    public function up(): void
    {
        Schema::create('sponsor_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sponsor_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['top_up', 'adjustment', 'refund'])->index();
            $table->decimal('amount', 12, 2); // positive numbers only; sign semantics via 'type'
            $table->string('reference')->nullable(); // optional external reference / note title
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['sponsor_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sponsor_transactions');
    }
};
