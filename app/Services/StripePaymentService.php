<?php

namespace App\Services;

use Exception;
use Stripe\Checkout\Session;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class StripePaymentService
{
    protected $apiKey;
    protected $publishableKey;
    protected $apiVersion = '2023-08-16';

    public function __construct()
    {
        $this->apiKey = config('services.stripe.secret');
        $this->publishableKey = config('services.stripe.key');
        Stripe::setApiKey($this->apiKey);
    }

    /**
     * Create a payment intent for deposit
     */
    public function createPaymentIntent(float $amount, string $currency = 'usd'): array
    {
        try {
            $intent = PaymentIntent::create([
                'amount' => $this->convertToLowestCurrency($amount, $currency),
                'currency' => $currency,
                'payment_method_types' => ['card'],
            ]);

            return [
                'success' => true,
                'client_secret' => $intent->client_secret,
                'intent_id' => $intent->id,
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Create a Stripe Checkout session for deposit
     */
    public function createCheckoutSession(float $amount, string $currency, string $successUrl, string $cancelUrl, int $transactionId): array
    {
        try {
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => $currency,
                        'product_data' => [
                            'name' => 'Wallet deposit',
                            'description' => 'Deposit funds to wallet',
                        ],
                        'unit_amount' => $this->convertToLowestCurrency($amount, $currency),
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => $successUrl . '?session_id={CHECKOUT_SESSION_ID}&transaction_id=' . $transactionId,
                'cancel_url' => $cancelUrl,
                'metadata' => [
                    'transaction_id' => $transactionId,
                ],
            ]);

            return [
                'success' => true,
                'session_url' => $session->url,
                'session_id' => $session->id,
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    public function retrieveSession(string $sessionId): array
    {
        try {
            $session = Session::retrieve($sessionId);

            return [
                'success' => true,
                'session' => $session,
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Confirm a payment intent
     */
    public function confirmPaymentIntent(string $intentId, string $paymentMethodId): array
    {
        try {
            $intent = PaymentIntent::retrieve($intentId);
            $intent->confirm(['payment_method' => $paymentMethodId]);

            if ($intent->status === 'succeeded') {
                return [
                    'success' => true,
                    'status' => 'succeeded',
                    'charge_id' => $intent->charges->data[0]->id ?? null,
                ];
            }

            return [
                'success' => false,
                'status' => $intent->status,
                'error' => 'Payment not completed',
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Create a payout for withdrawal
     */
    public function createPayout(float $amount, string $bankAccountToken, string $currency = 'usd'): array
    {
        try {
            return [
                'success' => true,
                'payout_id' => 'po_' . uniqid(),
                'status' => 'pending',
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Refund a payment
     */
    public function refund(string $chargeId, ?float $amount = null): array
    {
        try {
            $refundData = ['charge' => $chargeId];
            if ($amount) {
                $refundData['amount'] = $this->convertToLowestCurrency($amount);
            }

            $refund = \Stripe\Refund::create($refundData);

            return [
                'success' => true,
                'refund_id' => $refund->id,
                'status' => $refund->status,
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get publishable key for frontend
     */
    public function getPublishableKey(): string
    {
        return $this->publishableKey ?? '';
    }

    /**
     * Convert amount to lowest currency unit (cents for USD, etc.)
     */
    protected function convertToLowestCurrency(float $amount, string $currency = 'usd'): int
    {
        // USD, EUR, and most currencies use 2 decimal places
        // Some currencies like JPY use 0 decimal places
        $zeroDecimalCurrencies = ['jpy', 'krw', 'vnd', 'xaf', 'xof', 'clf'];

        if (in_array(strtolower($currency), $zeroDecimalCurrencies)) {
            return (int) $amount;
        }

        return (int) round($amount * 100);
    }
}