<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Migrate existing wallet_balance data to wallets table
        $users = DB::table('users')->where('wallet_balance', '>', 0)->get();

        foreach ($users as $user) {
            // Check if wallet already exists
            $existingWallet = DB::table('wallets')->where('user_id', $user->id)->first();

            if (! $existingWallet) {
                // Create wallet for user
                DB::table('wallets')->insert([
                    'user_id' => $user->id,
                    'balance' => $user->wallet_balance,
                    'currency' => 'USD',
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Create initial transaction record
                $walletId = DB::getPdo()->lastInsertId();

                DB::table('wallet_transactions')->insert([
                    'wallet_id' => $walletId,
                    'type' => 'deposit',
                    'amount' => $user->wallet_balance,
                    'balance_before' => 0,
                    'balance_after' => $user->wallet_balance,
                    'description' => 'Initial balance migration',
                    'status' => 'completed',
                    'processed_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This migration is not reversible as it would lose transaction history
        // In production, you would need a more sophisticated rollback strategy
    }
};
