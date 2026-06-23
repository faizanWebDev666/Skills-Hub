<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tables = [
            'users',
            'gigs',
            'orders',
            'conversations',
            'messages',
            'notifications',
            'reviews',
            'wishlists',
            'wallets',
            'wallet_transactions',
        ];

        foreach ($tables as $table) {
            // Get all records that don't have a UUID yet
            $records = DB::table($table)->whereNull('uuid')->get();

            foreach ($records as $record) {
                DB::table($table)
                    ->where('id', $record->id)
                    ->update(['uuid' => Str::uuid()]);
            }
        }

        // Handle optional tables
        $optionalTables = ['subscriptions', 'commission_settings'];
        foreach ($optionalTables as $table) {
            if (Schema::hasTable($table)) {
                $records = DB::table($table)->whereNull('uuid')->get();

                foreach ($records as $record) {
                    DB::table($table)
                        ->where('id', $record->id)
                        ->update(['uuid' => Str::uuid()]);
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op: we'll keep UUIDs even if we rollback
    }
};
