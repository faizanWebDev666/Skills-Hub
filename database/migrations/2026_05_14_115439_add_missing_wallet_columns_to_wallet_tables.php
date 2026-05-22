<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('wallets', function (Blueprint $table) {
            if (! Schema::hasColumn('wallets', 'currency')) {
                $table->string('currency')->default('USD')->after('balance');
            }

            if (! Schema::hasColumn('wallets', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('currency');
            }

            if (! Schema::hasColumn('wallets', 'metadata')) {
                $table->json('metadata')->nullable()->after('is_active');
            }
        });

        Schema::table('wallet_transactions', function (Blueprint $table) {
            if (! Schema::hasColumn('wallet_transactions', 'balance_before')) {
                $table->decimal('balance_before', 15, 2)->default(0)->after('amount');
            }

            if (! Schema::hasColumn('wallet_transactions', 'balance_after')) {
                $table->decimal('balance_after', 15, 2)->default(0)->after('balance_before');
            }

            if (! Schema::hasColumn('wallet_transactions', 'reference_type')) {
                $table->string('reference_type')->nullable()->after('balance_after');
            }

            if (! Schema::hasColumn('wallet_transactions', 'reference_id')) {
                $table->unsignedBigInteger('reference_id')->nullable()->after('reference_type');
            }

            if (! Schema::hasColumn('wallet_transactions', 'status')) {
                $table->string('status')->default('completed')->after('description');
            }

            if (! Schema::hasColumn('wallet_transactions', 'metadata')) {
                $table->json('metadata')->nullable()->after('status');
            }

            if (! Schema::hasColumn('wallet_transactions', 'processed_at')) {
                $table->timestamp('processed_at')->nullable()->after('metadata');
            }

            if (! Schema::hasColumn('wallet_transactions', 'transactionable_type') && ! Schema::hasColumn('wallet_transactions', 'transactionable_id')) {
                $table->string('transactionable_type')->nullable()->after('reference_id');
                $table->unsignedBigInteger('transactionable_id')->nullable()->after('transactionable_type');
            }

            if (! Schema::hasColumn('wallet_transactions', 'status') && Schema::hasColumn('wallet_transactions', 'description')) {
                // no-op, status already added above
            }

            // Check if indexes don't already exist before adding them
            $indexes = DB::select("SELECT INDEX_NAME FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_NAME = 'wallet_transactions' AND TABLE_SCHEMA = DATABASE()");
            $indexNames = array_column($indexes, 'INDEX_NAME');

            if (! in_array('wallet_transactions_wallet_id_type_index', $indexNames)) {
                $table->index(['wallet_id', 'type']);
            }
            if (! in_array('wallet_transactions_reference_type_reference_id_index', $indexNames)) {
                $table->index(['reference_type', 'reference_id']);
            }
        });

        DB::table('wallet_transactions')->whereNull('balance_before')->update([
            'balance_before' => 0,
            'balance_after' => DB::raw('amount'),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wallet_transactions', function (Blueprint $table) {
            if (Schema::hasColumn('wallet_transactions', 'processed_at')) {
                $table->dropColumn('processed_at');
            }
            if (Schema::hasColumn('wallet_transactions', 'metadata')) {
                $table->dropColumn('metadata');
            }
            if (Schema::hasColumn('wallet_transactions', 'status')) {
                $table->dropColumn('status');
            }
            if (Schema::hasColumn('wallet_transactions', 'reference_id')) {
                $table->dropColumn('reference_id');
            }
            if (Schema::hasColumn('wallet_transactions', 'reference_type')) {
                $table->dropColumn('reference_type');
            }
            if (Schema::hasColumn('wallet_transactions', 'balance_after')) {
                $table->dropColumn('balance_after');
            }
            if (Schema::hasColumn('wallet_transactions', 'balance_before')) {
                $table->dropColumn('balance_before');
            }
            if (Schema::hasColumn('wallet_transactions', 'transactionable_id')) {
                $table->dropColumn('transactionable_id');
            }
            if (Schema::hasColumn('wallet_transactions', 'transactionable_type')) {
                $table->dropColumn('transactionable_type');
            }
        });

        Schema::table('wallets', function (Blueprint $table) {
            if (Schema::hasColumn('wallets', 'metadata')) {
                $table->dropColumn('metadata');
            }
            if (Schema::hasColumn('wallets', 'is_active')) {
                $table->dropColumn('is_active');
            }
            if (Schema::hasColumn('wallets', 'currency')) {
                $table->dropColumn('currency');
            }
        });
    }
};
