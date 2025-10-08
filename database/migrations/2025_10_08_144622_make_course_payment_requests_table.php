<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('course_payment_requests', function (Blueprint $table) {
            $table->id();

            $table->foreignId('course_id')->constrained()->cascadeOnDelete();

            $table->string('full_name');
            $table->string('phone', 50);
            $table->string('email');
            $table->string('identity_image')->nullable(); // path in storage/app/public/...
            $table->text('reason');

            // workflow status
            $table->enum('status', ['pending', 'reviewing', 'approved', 'rejected', 'contacted'])
                  ->default('pending');

            // optional admin notes
            $table->text('admin_note')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_payment_requests');
    }
};
