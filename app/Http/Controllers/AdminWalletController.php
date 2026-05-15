<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminWalletController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('role:admin');
    }

    /**
     * Display wallet dashboard
     */
    public function dashboard()
    {
        $stats = [
            'total_wallets' => Wallet::count(),
            'total_balance' => Wallet::sum('balance'),
            'pending_withdrawals' => WalletTransaction::where('type', 'withdrawal')
                ->where('status', 'pending_approval')
                ->count(),
            'total_transactions' => WalletTransaction::count(),
        ];

        $recentTransactions = WalletTransaction::with('wallet.user')
            ->latest()
            ->take(10)
            ->get();

        $pendingWithdrawals = WalletTransaction::with('wallet.user')
            ->where('type', 'withdrawal')
            ->where('status', 'pending_approval')
            ->latest()
            ->get();

        return Inertia::render('Admin/Wallet/Dashboard', [
            'stats' => $stats,
            'recentTransactions' => $recentTransactions,
            'pendingWithdrawals' => $pendingWithdrawals,
        ]);
    }

    /**
     * Display all wallets
     */
    public function wallets(Request $request)
    {
        $query = Wallet::with('user');

        // Search by user name or email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $request->get('sort', 'balance');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $wallets = $query->paginate(20);

        return Inertia::render('Admin/Wallet/Wallets', [
            'wallets' => $wallets,
            'filters' => $request->only(['search', 'sort', 'order']),
        ]);
    }

    /**
     * Display transactions
     */
    public function transactions(Request $request)
    {
        $query = WalletTransaction::with('wallet.user');

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->whereHas('wallet', function ($q) use ($request) {
                $q->where('user_id', $request->user_id);
            });
        }

        // Filter by date range
        if ($request->filled(['start_date', 'end_date'])) {
            $query->whereBetween('created_at', [
                $request->start_date . ' 00:00:00',
                $request->end_date . ' 23:59:59'
            ]);
        }

        $transactions = $query->latest()->paginate(50);

        return Inertia::render('Admin/Wallet/Transactions', [
            'transactions' => $transactions,
            'filters' => $request->only(['type', 'status', 'user_id', 'start_date', 'end_date']),
        ]);
    }

    /**
     * Display withdrawal requests
     */
    public function withdrawals(Request $request)
    {
        $query = WalletTransaction::with('wallet.user')
            ->where('type', 'withdrawal');

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            // Default to pending approval
            $query->where('status', 'pending_approval');
        }

        $withdrawals = $query->latest()->paginate(50);

        return Inertia::render('Admin/Wallet/Withdrawals', [
            'withdrawals' => $withdrawals,
            'filters' => $request->only(['status']),
        ]);
    }

    /**
     * Approve a withdrawal
     */
    public function approveWithdrawal(WalletTransaction $transaction)
    {
        if ($transaction->type !== 'withdrawal' || $transaction->status !== 'pending_approval') {
            return back()->withErrors(['error' => 'Invalid withdrawal request.']);
        }

        DB::transaction(function () use ($transaction) {
            $wallet = $transaction->wallet;
            $wallet->balance -= abs(floatval($transaction->amount));
            $wallet->save();

            $transaction->update(['status' => 'pending']);
        });

        return back()->with('success', 'Withdrawal request approved. Processing payment...');
    }

    /**
     * Reject a withdrawal
     */
    public function rejectWithdrawal(Request $request, WalletTransaction $transaction)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        if ($transaction->type !== 'withdrawal' || $transaction->status !== 'pending_approval') {
            return back()->withErrors(['error' => 'Invalid withdrawal request.']);
        }

        DB::transaction(function () use ($transaction, $request) {
            $wallet = $transaction->wallet;
            
            // Refund the amount back to wallet
            $wallet->balance += abs(floatval($transaction->amount));
            $wallet->save();

            // Create refund transaction
            $wallet->credit(
                abs(floatval($transaction->amount)),
                'refund',
                "Withdrawal request rejected: {$request->reason}",
                ['original_transaction_id' => $transaction->id]
            );

            $transaction->update([
                'status' => 'cancelled',
                'metadata' => array_merge($transaction->metadata ?? [], [
                    'rejection_reason' => $request->reason,
                    'rejected_at' => now(),
                ])
            ]);
        });

        return back()->with('success', 'Withdrawal request rejected and funds refunded.');
    }

    /**
     * View user wallet details
     */
    public function viewUserWallet(User $user)
    {
        $wallet = $user->wallet ?? Wallet::create([
            'user_id' => $user->id,
            'balance' => 0,
            'currency' => 'USD',
        ]);

        $transactions = $wallet->transactions()->latest()->paginate(50);

        return Inertia::render('Admin/Wallet/UserWallet', [
            'user' => $user,
            'wallet' => $wallet,
            'transactions' => $transactions,
        ]);
    }

    /**
     * Manually adjust wallet balance
     */
    public function adjustBalance(Request $request, User $user)
    {
        $request->validate([
            'amount' => 'required|numeric',
            'description' => 'required|string|max:255',
            'type' => 'required|in:credit,debit',
        ]);

        $wallet = $user->wallet ?? Wallet::create([
            'user_id' => $user->id,
            'balance' => 0,
            'currency' => 'USD',
        ]);

        DB::transaction(function () use ($wallet, $request) {
            $amount = abs($request->amount);

            if ($request->type === 'credit') {
                $wallet->credit(
                    $amount,
                    'adjustment',
                    "[Admin] {$request->description}",
                    ['admin_user_id' => auth()->id()]
                );
            } else {
                if ($wallet->balance < $amount) {
                    throw new \Exception('Insufficient balance for debit operation.');
                }
                $wallet->debit(
                    $amount,
                    'adjustment',
                    "[Admin] {$request->description}",
                    ['admin_user_id' => auth()->id()]
                );
            }
        });

        return back()->with('success', 'Wallet balance adjusted successfully.');
    }

    /**
     * Export transactions report
     */
    public function exportTransactions(Request $request)
    {
        $query = WalletTransaction::with('wallet.user');

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled(['start_date', 'end_date'])) {
            $query->whereBetween('created_at', [
                $request->start_date . ' 00:00:00',
                $request->end_date . ' 23:59:59'
            ]);
        }

        $transactions = $query->latest()->get();

        // Generate CSV
        $filename = 'wallet_transactions_' . date('Y-m-d_His') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => "attachment; filename={$filename}",
        ];

        $handle = fopen('php://output', 'w');
        fputcsv($handle, ['ID', 'User', 'Type', 'Amount', 'Balance After', 'Status', 'Description', 'Date']);

        foreach ($transactions as $transaction) {
            fputcsv($handle, [
                $transaction->id,
                $transaction->wallet->user->name,
                $transaction->type,
                $transaction->amount,
                $transaction->balance_after,
                $transaction->status,
                $transaction->description,
                $transaction->created_at->format('Y-m-d H:i:s'),
            ]);
        }

        fclose($handle);

        return response()->streamDownload(function () use ($handle) {}, $filename, $headers);
    }
}