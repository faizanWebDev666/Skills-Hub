<?php

namespace App\Mail;

use App\Models\WalletTransaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TransactionNotification extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $transaction;

    /**
     * Create a new message instance.
     */
    public function __construct(WalletTransaction $transaction)
    {
        $this->transaction = $transaction;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = match ($this->transaction->type) {
            'deposit' => 'Deposit Confirmed',
            'withdrawal' => 'Withdrawal Request Received',
            'payment' => 'Payment Processed',
            'commission' => 'Commission Earned',
            'refund' => 'Refund Processed',
            'transfer' => 'Money Transferred',
            default => 'Transaction Notification',
        };

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.transaction-notification',
            with: [
                'transaction' => $this->transaction,
                'user' => $this->transaction->wallet->user,
                'amount' => number_format(abs($this->transaction->amount), 2),
                'balance' => number_format($this->transaction->balance_after, 2),
                'type' => $this->getTransactionTypeLabel(),
                'icon' => $this->getTransactionIcon(),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }

    /**
     * Get human-readable transaction type label
     */
    private function getTransactionTypeLabel(): string
    {
        return match ($this->transaction->type) {
            'deposit' => 'Deposit',
            'withdrawal' => 'Withdrawal',
            'payment' => 'Payment',
            'commission' => 'Commission',
            'refund' => 'Refund',
            'transfer' => 'Transfer',
            default => 'Transaction',
        };
    }

    /**
     * Get emoji icon for transaction type
     */
    private function getTransactionIcon(): string
    {
        return match ($this->transaction->type) {
            'deposit' => '📥',
            'withdrawal' => '📤',
            'payment' => '💳',
            'commission' => '💰',
            'refund' => '↩️',
            'transfer' => '↔️',
            default => '📋',
        };
    }
}
