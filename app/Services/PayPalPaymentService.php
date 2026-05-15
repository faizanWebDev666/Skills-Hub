<?php

namespace App\Services;

use Exception;

class PayPalPaymentService
{
    protected $clientId;
    protected $clientSecret;
    protected $mode;
    protected $apiEndpoint;

    public function __construct()
    {
        $this->clientId = config('services.paypal.client_id');
        $this->clientSecret = config('services.paypal.secret');
        $this->mode = config('services.paypal.mode', 'sandbox');
        $this->apiEndpoint = $this->mode === 'live'
            ? 'https://api.paypal.com/v1'
            : 'https://api.sandbox.paypal.com/v1';
    }

    /**
     * Get access token from PayPal
     */
    protected function getAccessToken(): ?string
    {
        try {
            $response = $this->makeRequest('POST', '/oauth2/token', [
                'grant_type' => 'client_credentials',
            ], [
                'Authorization' => 'Basic ' . base64_encode("{$this->clientId}:{$this->clientSecret}"),
            ]);

            return $response['access_token'] ?? null;
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * Create a payment for deposit
     */
    public function createPayment(float $amount, string $currency = 'USD', string $returnUrl = null, string $cancelUrl = null): array
    {
        try {
            $accessToken = $this->getAccessToken();
            if (!$accessToken) {
                throw new Exception('Failed to obtain PayPal access token');
            }

            $paymentData = [
                'intent' => 'sale',
                'payer' => [
                    'payment_method' => 'paypal',
                ],
                'transactions' => [
                    [
                        'amount' => [
                            'total' => number_format($amount, 2, '.', ''),
                            'currency' => $currency,
                            'details' => [
                                'subtotal' => number_format($amount, 2, '.', ''),
                            ],
                        ],
                        'description' => 'Deposit funds to wallet',
                    ],
                ],
                'redirect_urls' => [
                    'return_url' => $returnUrl ?? route('wallet.deposit.success'),
                    'cancel_url' => $cancelUrl ?? route('wallet.deposit.cancel'),
                ],
            ];

            $response = $this->makeRequest('POST', '/payments/payment', $paymentData, [
                'Authorization' => "Bearer {$accessToken}",
            ]);

            $approvalUrl = null;
            if (isset($response['links']) && is_array($response['links'])) {
                foreach ($response['links'] as $link) {
                    if (($link['rel'] ?? '') === 'approval_url') {
                        $approvalUrl = $link['href'];
                        break;
                    }
                }
            }

            return [
                'success' => true,
                'payment_id' => $response['id'] ?? null,
                'approval_url' => $approvalUrl,
                'status' => $response['state'] ?? 'pending',
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Execute an approved payment
     */
    public function executePayment(string $paymentId, string $payerID): array
    {
        try {
            $accessToken = $this->getAccessToken();
            if (!$accessToken) {
                throw new Exception('Failed to obtain PayPal access token');
            }

            $response = $this->makeRequest(
                'POST',
                "/payments/payment/{$paymentId}/execute",
                ['payer_id' => $payerID],
                ['Authorization' => "Bearer {$accessToken}"]
            );

            return [
                'success' => $response['state'] === 'approved',
                'payment_id' => $response['id'] ?? null,
                'transaction_id' => $response['transactions'][0]['related_resources'][0]['sale']['id'] ?? null,
                'status' => $response['state'] ?? 'pending',
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
    public function refund(string $saleId, ?float $amount = null): array
    {
        try {
            $accessToken = $this->getAccessToken();
            if (!$accessToken) {
                throw new Exception('Failed to obtain PayPal access token');
            }

            $refundData = [];
            if ($amount) {
                $refundData = [
                    'amount' => [
                        'total' => number_format($amount, 2, '.', ''),
                        'currency' => 'USD',
                    ],
                ];
            }

            $response = $this->makeRequest(
                'POST',
                "/payments/sale/{$saleId}/refund",
                $refundData,
                ['Authorization' => "Bearer {$accessToken}"]
            );

            return [
                'success' => true,
                'refund_id' => $response['id'] ?? null,
                'status' => $response['state'] ?? 'completed',
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Make HTTP request to PayPal API
     */
    protected function makeRequest(string $method, string $endpoint, array $data = [], array $headers = []): array
    {
        $url = $this->apiEndpoint . $endpoint;

        $defaultHeaders = [
            'Content-Type' => 'application/json',
        ];

        $options = [
            'headers' => array_merge($defaultHeaders, $headers),
            'json' => $data,
            'timeout' => 10,
        ];

        $client = new \GuzzleHttp\Client();
        $response = $client->request($method, $url, $options);

        return json_decode((string) $response->getBody(), true) ?? [];
    }
}