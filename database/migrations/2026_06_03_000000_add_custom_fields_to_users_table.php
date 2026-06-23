<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'custom_years_of_experience')) {
                $table->string('custom_years_of_experience')->nullable();
            }
            if (! Schema::hasColumn('users', 'custom_service_type')) {
                $table->string('custom_service_type')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'custom_years_of_experience')) {
                $table->dropColumn('custom_years_of_experience');
            }
            if (Schema::hasColumn('users', 'custom_service_type')) {
                $table->dropColumn('custom_service_type');
            }
        });
    }
};
