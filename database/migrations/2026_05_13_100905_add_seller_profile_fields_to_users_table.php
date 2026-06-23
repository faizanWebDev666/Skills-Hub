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
        Schema::table('users', function (Blueprint $table) {
            // Basic Information
            if (! Schema::hasColumn('users', 'professional_title')) {
                $table->string('professional_title')->nullable();
            }
            if (! Schema::hasColumn('users', 'country')) {
                $table->string('country')->nullable();
            }
            if (! Schema::hasColumn('users', 'city')) {
                $table->string('city')->nullable();
            }
            if (! Schema::hasColumn('users', 'address')) {
                $table->text('address')->nullable();
            }
            if (! Schema::hasColumn('users', 'languages')) {
                $table->json('languages')->nullable();
            }
            if (! Schema::hasColumn('users', 'years_of_experience')) {
                $table->string('years_of_experience')->nullable();
            }

            // Identity Verification
            if (! Schema::hasColumn('users', 'cnic')) {
                $table->string('cnic')->nullable();
            }
            if (! Schema::hasColumn('users', 'selfie_verification')) {
                $table->string('selfie_verification')->nullable();
            }
            if (! Schema::hasColumn('users', 'business_registration')) {
                $table->string('business_registration')->nullable();
            }

            // Portfolio
            if (! Schema::hasColumn('users', 'portfolio_images')) {
                $table->json('portfolio_images')->nullable();
            }
            if (! Schema::hasColumn('users', 'portfolio_videos')) {
                $table->json('portfolio_videos')->nullable();
            }
            if (! Schema::hasColumn('users', 'previous_work_links')) {
                $table->json('previous_work_links')->nullable();
            }
            if (! Schema::hasColumn('users', 'resume_cv')) {
                $table->string('resume_cv')->nullable();
            }
            if (! Schema::hasColumn('users', 'certifications')) {
                $table->json('certifications')->nullable();
            }

            // Service Settings
            if (! Schema::hasColumn('users', 'hourly_rate')) {
                $table->decimal('hourly_rate', 8, 2)->nullable();
            }
            if (! Schema::hasColumn('users', 'delivery_time')) {
                $table->string('delivery_time')->nullable();
            }
            if (! Schema::hasColumn('users', 'available_days')) {
                $table->json('available_days')->nullable();
            }
            if (! Schema::hasColumn('users', 'service_type')) {
                $table->string('service_type')->nullable(); // online/offline
            }
            if (! Schema::hasColumn('users', 'emergency_service')) {
                $table->boolean('emergency_service')->default(false);
            }

            // Social Links
            if (! Schema::hasColumn('users', 'linkedin')) {
                $table->string('linkedin')->nullable();
            }
            if (! Schema::hasColumn('users', 'github')) {
                $table->string('github')->nullable();
            }
            if (! Schema::hasColumn('users', 'behance')) {
                $table->string('behance')->nullable();
            }
            if (! Schema::hasColumn('users', 'dribbble')) {
                $table->string('dribbble')->nullable();
            }
            if (! Schema::hasColumn('users', 'website')) {
                $table->string('website')->nullable();
            }
            if (! Schema::hasColumn('users', 'facebook')) {
                $table->string('facebook')->nullable();
            }
            if (! Schema::hasColumn('users', 'instagram')) {
                $table->string('instagram')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columns = [
                'professional_title',
                'country',
                'city',
                'address',
                'languages',
                'years_of_experience',
                'cnic',
                'selfie_verification',
                'business_registration',
                'portfolio_images',
                'portfolio_videos',
                'previous_work_links',
                'resume_cv',
                'certifications',
                'hourly_rate',
                'delivery_time',
                'available_days',
                'service_type',
                'emergency_service',
                'linkedin',
                'github',
                'behance',
                'dribbble',
                'website',
                'facebook',
                'instagram',
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('users', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
