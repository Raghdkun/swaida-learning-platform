<?php

// database/migrations/2025_01_05_000020_add_password_lifecycle_to_sponsors_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('sponsors', function (Blueprint $table) {
            // ensure unique email for auth
            if (!Schema::hasColumn('sponsors', 'password')) {
                $table->string('password')->nullable()->after('email');
            }
            if (!Schema::hasColumn('sponsors', 'remember_token')) {
                $table->rememberToken();
            }
            if (!Schema::hasColumn('sponsors', 'last_login_at')) {
                $table->timestamp('last_login_at')->nullable();
            }
            $table->boolean('must_change_password')->default(true)->after('password');
            $table->timestamp('password_changed_at')->nullable()->after('must_change_password');
        });
    }

    public function down(): void {
        Schema::table('sponsors', function (Blueprint $table) {
            $table->dropColumn(['must_change_password', 'password_changed_at']);
            // keep password + remember_token + last_login_at if you already used them elsewhere
        });
    }
};
