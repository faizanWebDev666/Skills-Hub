<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Services\StripePaymentService;
use App\Services\PayPalPaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class WalletController extends Controller
{
    protected $stripeService;
    protected $paypalService;

    public function __construct(StripePaymentService $stripeService, PayPalPaymentService $paypalService)
    {
        $this->stripeService = $stripeService;
        $this->paypalService = $paypalService;
    }

    public function show()
    {
        $user = auth()->user();

        // Get or create wallet for user
        $wallet = $user->wallet ?? $this->createWalletForUser($user);

        $transactions = $wallet->transactions()
            ->with('wallet.user')
            ->paginate(20);

        return Inertia::render('Wallet/Show', [
            'wallet' => $wallet,
            'transactions' => $transactions,
            'balance' => $wallet->available_balance,
            'stripePublishableKey' => $this->stripeService->getPublishableKey(),
        ]);
    }

    public function transactions(Request $request)
    {
        $user = auth()->user();
        $wallet = $user->wallet ?? $this->createWalletForUser($user);

        $query = $wallet->transactions()->with('wallet.user');

        // Filter by type
        if ($request->filled('type')) {
            $query->byType($request->type);
        }

        // Filter by date range
        if ($request->filled(['start_date', 'end_date'])) {
            $query->whereBetween('created_at', [
                $request->start_date . ' 00:00:00',
                $request->end_date . ' 23:59:59'
            ]);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $transactions = $query->paginate(20)->appends($request->query());

        return Inertia::render('Wallet/Transactions', [
            'transactions' => $transactions,
            'filters' => $request->only(['type', 'start_date', 'end_date', 'status']),
            'wallet' => $wallet,
        ]);
    }

    public function deposit(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.01|max:10000',
            'payment_method' => 'required|string|in:bank_transfer',
            'reference' => 'nullable|string|max:255',
        ]);

        $user = auth()->user();
        $wallet = $user->wallet ?? $this->createWalletForUser($user);

        $wallet->transactions()->create([
            'type' => 'deposit',
            'amount' => $request->amount,
            'balance_before' => $wallet->balance,
            'balance_after' => $wallet->balance,
            'description' => 'Bank transfer deposit request',
            'status' => 'pending',
            'metadata' => [
                'payment_method' => 'bank_transfer',
                'reference' => $request->reference,
            ],
        ]);

        return back()->with('success', 'Deposit request submitted. Funds will be credited once the transfer is confirmed.');
    }

    public function createStripeCheckout(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.01|max:10000',
        ]);

        $user = auth()->user();
        $wallet = $user->wallet ?? $this->createWalletForUser($user);

        $transaction = $wallet->transactions()->create([
            'type' => 'deposit',
            'amount' => $request->amount,
            'balance_before' => $wallet->balance,
            'balance_after' => $wallet->balance,
            'description' => 'Stripe deposit',
            'status' => 'pending',
            'metadata' => [
                'payment_method' => 'stripe',
            ],
        ]);

        $session = $this->stripeService->createCheckoutSession(
            $request->amount,
            'usd',
            route('wallet.deposit.success'),
            route('wallet.deposit.cancel'),
            $transaction->id
        );

        if (! $session['success']) {
            $transaction->update(['status' => 'failed', 'metadata' => array_merge($transaction->metadata ?? [], ['error' => $session['error']])]);
            return response()->json(['error' => $session['error']], 500);
        }

        $transaction->update(['metadata' => array_merge($transaction->metadata ?? [], ['stripe_session_id' => $session['session_id']])]);

        return response()->json(['session_url' => $session['session_url']]);
    }

    public function createPayPalPayment(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.01|max:10000',
        ]);

        $user = auth()->user();
        $wallet = $user->wallet ?? $this->createWalletForUser($user);

        $transaction = $wallet->transactions()->create([
            'type' => 'deposit',
            'amount' => $request->amount,
            'balance_before' => $wallet->balance,
            'balance_after' => $wallet->balance,
            'description' => 'PayPal deposit',
            'status' => 'pending',
            'metadata' => [
                'payment_method' => 'paypal',
            ],
        ]);

        $payment = $this->paypalService->createPayment(
            $request->amount,
            'USD',
            route('wallet.deposit.success'),
            route('wallet.deposit.cancel')
        );

        if (! $payment['success']) {
            $transaction->update(['status' => 'failed', 'metadata' => array_merge($transaction->metadata ?? [], ['error' => $payment['error']])]);
            return response()->json(['error' => $payment['error']], 500);
        }

        $transaction->update(['metadata' => array_merge($transaction->metadata ?? [], ['paypal_payment_id' => $payment['payment_id']])]);

        return response()->json(['approval_url' => $payment['approval_url']]);
    }

    public function withdraw(Request $request)
    {
        $request->validate([
            'amount' => [
                'required',
                'numeric',
                'min:0.01',
                Rule::when(auth()->user()->wallet, function ($rule) {
                    return $rule->max(auth()->user()->wallet->available_balance);
                }),
            ],
            'payment_method' => 'required|string|in:bank_transfer,paypal',
            'account_details' => 'required|array',
            'account_details.account_number' => 'required|string',
            'account_details.routing_number' => 'nullable|string',
        ]);

        $user = auth()->user();
        $wallet = $user->wallet ?? $this->createWalletForUser($user);

        if (!$wallet->canDebit($request->amount)) {
            return back()->withErrors(['amount' => 'Insufficient available balance.']);
        }

        $wallet->transactions()->create([
            'type' => 'withdrawal',
            'amount' => -abs($request->amount),
            'balance_before' => $wallet->balance,
            'balance_after' => $wallet->balance,
            'description' => 'Withdrawal request to ' . str_replace('_', ' ', $request->payment_method),
            'status' => 'pending_approval',
            'metadata' => [
                'payment_method' => $request->payment_method,
                'account_details' => $request->account_details,
            ],
        ]);

        return back()->with('success', 'Withdrawal request submitted. An admin will review your request.');
    }

    public function transfer(Request $request)
    {
        $request->validate([
            'recipient_email' => 'required|email|exists:users,email',
            'amount' => [
                'required',
                'numeric',
                'min:0.01',
                Rule::when(auth()->user()->wallet, function ($rule) {
                    return $rule->max(auth()->user()->wallet->available_balance);
                }),
            ],
            'message' => 'nullable|string|max:500',
        ]);

        $sender = auth()->user();
        $recipient = \App\Models\User::where('email', $request->recipient_email)->first();

        if (! $recipient) {
            return back()->withErrors(['recipient_email' => 'Recipient email does not match an active user.']);
        }

        if ($sender->id === $recipient->id) {
            return back()->withErrors(['recipient_email' => 'You cannot transfer to yourself.']);
        }

        $senderWallet = $sender->wallet ?? $this->createWalletForUser($sender);
        $recipientWallet = $recipient->wallet ?? $this->createWalletForUser($recipient);

        if (!$senderWallet->canDebit($request->amount)) {
            return back()->withErrors(['amount' => 'Insufficient available balance.']);
        }

        DB::transaction(function () use ($senderWallet, $recipientWallet, $request, $sender, $recipient) {
            $message = $request->message ? " - {$request->message}" : '';

            $senderWallet->debit(
                $request->amount,
                'transfer',
                "Transfer to {$recipient->name}" . $message,
                ['recipient_id' => $recipient->id]
            );

            $recipientWallet->credit(
                $request->amount,
                'transfer',
                "Transfer from {$sender->name}" . $message,
                ['sender_id' => $sender->id]
            );
        });

        return back()->with('success', 'Transfer completed successfully!');
    }

    public function stripeSuccess(Request $request)
    {
        $sessionId = $request->query('session_id');
        $transactionId = $request->query('transaction_id');

        if (! $sessionId || ! $transactionId) {
            return redirect()->route('wallet.show')->with('error', 'Unable to verify Stripe payment.');
        }

        $transaction = WalletTransaction::find($transactionId);
        if (! $transaction || $transaction->status !== 'pending') {
            return redirect()->route('wallet.show')->with('error', 'Invalid transaction.');
        }

        $session = $this->stripeService->retrieveSession($sessionId);
        if (! $session['success']) {
            return redirect()->route('wallet.show')->with('error', $session['error']);
        }

        $wallet = $transaction->wallet;
        $wallet->balance += $transaction->amount;
        $wallet->save();

        $transaction->update([
            'status' => 'completed',
            'balance_after' => $wallet->balance,
            'processed_at' => now(),
            'metadata' => array_merge($transaction->metadata ?? [], ['stripe_session_id' => $sessionId]),
        ]);

        return redirect()->route('wallet.show')->with('success', 'Stripe deposit completed successfully.');
    }

    public function paymentSuccess(Request $request)
    {
        $paymentId = $request->query('paymentId');
        $payerID = $request->query('PayerID');
        $sessionId = $request->query('session_id');
        $transactionId = $request->query('transaction_id');

        if ($sessionId && $transactionId) {
            $transaction = WalletTransaction::find($transactionId);
            if (! $transaction || $transaction->status !== 'pending') {
                return redirect()->route('wallet.show')->with('error', 'Invalid transaction.');
            }

            $session = $this->stripeService->retrieveSession($sessionId);
            if (! $session['success']) {
                return redirect()->route('wallet.show')->with('error', $session['error']);
            }

            $wallet = $transaction->wallet;
            $wallet->balance += $transaction->amount;
            $wallet->save();

            $transaction->update([
                'status' => 'completed',
                'balance_after' => $wallet->balance,
                'processed_at' => now(),
                'metadata' => array_merge($transaction->metadata ?? [], ['stripe_session_id' => $sessionId]),
            ]);

            return redirect()->route('wallet.show')->with('success', 'Stripe deposit completed successfully.');
        }

        if ($paymentId && $payerID) {
            $transaction = WalletTransaction::where('metadata->paypal_payment_id', $paymentId)->first();
            if (! $transaction || $transaction->status !== 'pending') {
                return redirect()->route('wallet.show')->with('error', 'Invalid transaction.');
            }

            $result = $this->paypalService->executePayment($paymentId, $payerID);
            if (! $result['success']) {
                return redirect()->route('wallet.show')->with('error', $result['error']);
            }

            $wallet = $transaction->wallet;
            $wallet->balance += $transaction->amount;
            $wallet->save();

            $transaction->update([
                'status' => 'completed',
                'balance_after' => $wallet->balance,
                'processed_at' => now(),
                'metadata' => array_merge($transaction->metadata ?? [], ['paypal_payment_id' => $paymentId, 'paypal_payer_id' => $payerID]),
            ]);

            return redirect()->route('wallet.show')->with('success', 'PayPal deposit completed successfully.');
        }

        return redirect()->route('wallet.show')->with('error', 'Unable to verify payment.');
    }

    protected function processStripeDeposit(WalletTransaction $transaction, Request $request)
    {
        // Verify the payment intent status
        try {
            if ($request->stripePaymentIntentId) {
                // In production, verify the intent with Stripe
                $transaction->update([
                    'status' => 'completed',
                    'balance_after' => $transaction->wallet->balance + $transaction->amount,
                    'processed_at' => now(),
                    'metadata' => array_merge($transaction->metadata ?? [], [
                        'stripe_intent_id' => $request->stripePaymentIntentId,
                    ]),
                ]);

                $wallet = $transaction->wallet;
                $wallet->balance += $transaction->amount;
                $wallet->save();
            }
        } catch (\Exception $e) {
            $transaction->update(['status' => 'failed', 'metadata' => ['error' => $e->getMessage()]]);
        }
    }

    protected function processPayPalDeposit(WalletTransaction $transaction, Request $request)
    {
        // Handle PayPal approval flow
        // This would typically redirect to PayPal and then webhook updates the transaction
        $transaction->update(['status' => 'pending']);
    }

    protected function processBankTransferDeposit(WalletTransaction $transaction, Request $request)
    {
        // Bank transfers require manual verification
        $transaction->update(['status' => 'pending']);
    }

    protected function createWalletForUser($user): Wallet
    {
        return $user->wallet()->create([
            'balance' => $user->wallet_balance ?? 0,
            'currency' => 'USD',
        ]);
    }

    public function depositSuccess()
    {
        return redirect('/wallet')->with('success', 'Deposit completed successfully!');
    }

    public function depositCancel()
    {
        return redirect('/wallet')->with('error', 'Deposit cancelled. Please try again.');
    }
}