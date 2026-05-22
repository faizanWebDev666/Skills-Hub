import React, { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import Navbar from "../../components/Navbar";
import CustomerSidebar from "../../components/CustomerSidebar";

export default function Show({ wallet, transactions, balance }) {
    const [activeTab, setActiveTab] = useState("overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [depositError, setDepositError] = useState(null);
    const { flash } = usePage().props;

    const depositForm = useForm({
        amount: "",
        payment_method: "stripe",
        reference: "",
    });

    const withdrawForm = useForm({
        amount: "",
        payment_method: "bank_transfer",
        account_details: {
            account_number: "",
            routing_number: "",
        },
    });

    const transferForm = useForm({
        recipient_email: "",
        amount: "",
        message: "",
    });

    const handleDepositSubmit = async (e) => {
        e.preventDefault();
        setDepositError(null);

        const amount = depositForm.data.amount;
        const method = depositForm.data.payment_method;

        if (method === "stripe" || method === "paypal") {
            const endpoint =
                method === "stripe"
                    ? "/wallet/deposit/stripe"
                    : "/wallet/deposit/paypal";
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({ amount }),
            });

            const data = await response.json();
            if (!response.ok) {
                setDepositError(data.error || "Unable to initiate payment.");
                return;
            }

            window.location.href = data.session_url || data.approval_url;
            return;
        }

        depositForm.post("/wallet/deposit", {
            preserveScroll: true,
            onSuccess: () => {
                depositForm.reset();
            },
        });
    };

    const handleWithdrawSubmit = (e) => {
        e.preventDefault();
        withdrawForm.post("/wallet/withdraw", {
            preserveScroll: true,
            onSuccess: () => {
                withdrawForm.reset();
            },
        });
    };

    const handleTransferSubmit = (e) => {
        e.preventDefault();
        transferForm.post("/wallet/transfer", {
            preserveScroll: true,
            onSuccess: () => {
                transferForm.reset();
            },
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen bg-cream-50">
            <Navbar user={usePage().props.auth.user} />

            <div className="flex">
                <CustomerSidebar
                    user={usePage().props.auth.user}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                <main className="flex-1 min-w-0">
                    <div className="px-4 sm:px-6 lg:px-8 py-8">
                        {/* Success Flash */}
                        {flash?.success && (
                            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-3.5 rounded-lg text-sm font-medium flex items-center gap-3">
                                <svg
                                    className="w-5 h-5 shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {flash.success}
                            </div>
                        )}

                        {/* Error Flash */}
                        {flash?.error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-3.5 rounded-lg text-sm font-medium flex items-center gap-3">
                                <svg
                                    className="w-5 h-5 shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {flash.error}
                            </div>
                        )}

                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Wallet
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Manage your funds and view transaction history
                            </p>
                        </div>

                        {/* Balance Card */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 mb-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Available Balance
                                    </p>
                                    <p className="text-4xl font-bold text-gray-900">
                                        {formatCurrency(balance)}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setActiveTab("deposit")}
                                        className="px-6 py-3 bg-brand-600 text-white rounded-2xl font-semibold hover:bg-brand-700 transition-colors"
                                    >
                                        Deposit Funds
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("withdraw")}
                                        className="px-6 py-3 bg-white text-brand-600 border border-brand-600 rounded-2xl font-semibold hover:bg-brand-50 transition-colors"
                                    >
                                        Withdraw
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="mb-6">
                            <div className="flex flex-wrap border-b border-gray-200 gap-0">
                                {[
                                    { id: "overview", label: "Overview" },
                                    {
                                        id: "transactions",
                                        label: "All Transactions",
                                    },
                                    { id: "deposit", label: "Deposit" },
                                    { id: "withdraw", label: "Withdraw" },
                                    { id: "transfer", label: "Transfer" },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-5 py-3.5 text-sm font-semibold transition-all border-b-2 -mb-px whitespace-nowrap ${
                                            activeTab === tab.id
                                                ? "text-brand-600 border-brand-600"
                                                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Overview Tab */}
                        {activeTab === "overview" && (
                            <div className="space-y-6">
                                {/* Recent Transactions */}
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Recent Transactions
                                        </h2>
                                        <Link
                                            href="/wallet/transactions"
                                            className="text-brand-600 hover:text-brand-700 font-semibold text-sm"
                                        >
                                            View All
                                        </Link>
                                    </div>

                                    {transactions.data.length > 0 ? (
                                        <div className="space-y-4">
                                            {transactions.data
                                                .slice(0, 5)
                                                .map((transaction) => (
                                                    <div
                                                        key={transaction.id}
                                                        className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div
                                                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                                    transaction.amount >
                                                                    0
                                                                        ? "bg-green-100"
                                                                        : "bg-red-100"
                                                                }`}
                                                            >
                                                                {transaction.amount >
                                                                0 ? (
                                                                    <svg
                                                                        className="w-5 h-5 text-green-600"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={
                                                                                2
                                                                            }
                                                                            d="M7 16l-4-4m0 0l4-4m-4 4h18"
                                                                        />
                                                                    </svg>
                                                                ) : (
                                                                    <svg
                                                                        className="w-5 h-5 text-red-600"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={
                                                                                2
                                                                            }
                                                                            d="M17 16l4-4m0 0l-4-4m4 4H3"
                                                                        />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900">
                                                                    {
                                                                        transaction.description
                                                                    }
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    {formatDate(
                                                                        transaction.created_at,
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p
                                                                className={`font-bold text-lg ${
                                                                    transaction.amount >
                                                                    0
                                                                        ? "text-green-600"
                                                                        : "text-red-600"
                                                                }`}
                                                            >
                                                                {transaction.amount >
                                                                0
                                                                    ? "+"
                                                                    : ""}
                                                                {formatCurrency(
                                                                    Math.abs(
                                                                        transaction.amount,
                                                                    ),
                                                                )}
                                                            </p>
                                                            <span
                                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                    transaction.status ===
                                                                    "completed"
                                                                        ? "bg-green-100 text-green-800"
                                                                        : transaction.status ===
                                                                            "pending"
                                                                          ? "bg-yellow-100 text-yellow-800"
                                                                          : "bg-red-100 text-red-800"
                                                                }`}
                                                            >
                                                                {
                                                                    transaction.status
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <svg
                                                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1}
                                                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                />
                                            </svg>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                No transactions yet
                                            </h3>
                                            <p className="text-gray-500">
                                                Your transaction history will
                                                appear here once you start using
                                                your wallet.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Transactions Tab */}
                        {activeTab === "transactions" && (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        All Transactions
                                    </h2>
                                    <Link
                                        href="/wallet/transactions"
                                        className="text-brand-600 hover:text-brand-700 font-semibold text-sm"
                                    >
                                        View Detailed History →
                                    </Link>
                                </div>

                                {transactions.data.length > 0 ? (
                                    <div className="space-y-4">
                                        {transactions.data.map(
                                            (transaction) => (
                                                <div
                                                    key={transaction.id}
                                                    className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div
                                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                                transaction.amount >
                                                                0
                                                                    ? "bg-green-100"
                                                                    : "bg-red-100"
                                                            }`}
                                                        >
                                                            {transaction.amount >
                                                            0 ? (
                                                                <svg
                                                                    className="w-5 h-5 text-green-600"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M7 16l-4-4m0 0l4-4m-4 4h18"
                                                                    />
                                                                </svg>
                                                            ) : (
                                                                <svg
                                                                    className="w-5 h-5 text-red-600"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M17 16l4-4m0 0l-4-4m4 4H3"
                                                                    />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                {
                                                                    transaction.description
                                                                }
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {formatDate(
                                                                    transaction.created_at,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p
                                                            className={`font-bold text-lg ${
                                                                transaction.amount >
                                                                0
                                                                    ? "text-green-600"
                                                                    : "text-red-600"
                                                            }`}
                                                        >
                                                            {transaction.amount >
                                                            0
                                                                ? "+"
                                                                : ""}
                                                            {formatCurrency(
                                                                Math.abs(
                                                                    transaction.amount,
                                                                ),
                                                            )}
                                                        </p>
                                                        <span
                                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                transaction.status ===
                                                                "completed"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : transaction.status ===
                                                                        "pending"
                                                                      ? "bg-yellow-100 text-yellow-800"
                                                                      : "bg-red-100 text-red-800"
                                                            }`}
                                                        >
                                                            {transaction.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <svg
                                            className="w-16 h-16 text-gray-300 mx-auto mb-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1}
                                                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            />
                                        </svg>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            No transactions yet
                                        </h3>
                                        <p className="text-gray-500">
                                            Your transaction history will appear
                                            here once you start using your
                                            wallet.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Deposit Tab */}
                        {activeTab === "deposit" && (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">
                                    Deposit Funds
                                </h2>

                                <form
                                    onSubmit={handleDepositSubmit}
                                    className="space-y-6"
                                >
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Amount
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                $
                                            </span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                max="10000"
                                                value={depositForm.data.amount}
                                                onChange={(e) =>
                                                    depositForm.setData(
                                                        "amount",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full pl-8 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
                                                placeholder="0.00"
                                                required
                                            />
                                        </div>
                                        {depositForm.errors.amount && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {depositForm.errors.amount}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Payment Method
                                        </label>
                                        <select
                                            value={
                                                depositForm.data.payment_method
                                            }
                                            onChange={(e) =>
                                                depositForm.setData(
                                                    "payment_method",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
                                        >
                                            <option value="stripe">
                                                Credit/Debit Card (Stripe)
                                            </option>
                                            <option value="paypal">
                                                PayPal
                                            </option>
                                            <option value="bank_transfer">
                                                Bank Transfer
                                            </option>
                                        </select>
                                        {depositForm.errors.payment_method && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {
                                                    depositForm.errors
                                                        .payment_method
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Reference (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={depositForm.data.reference}
                                            onChange={(e) =>
                                                depositForm.setData(
                                                    "reference",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
                                            placeholder="Transaction reference or note"
                                        />
                                        {depositForm.errors.reference && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {depositForm.errors.reference}
                                            </p>
                                        )}
                                        {depositError && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {depositError}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={depositForm.processing}
                                        className="w-full px-6 py-3 bg-brand-600 text-white rounded-2xl font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {depositForm.processing
                                            ? "Processing..."
                                            : "Deposit Funds"}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Withdraw Tab */}
                        {activeTab === "withdraw" && (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">
                                    Withdraw Funds
                                </h2>

                                <form
                                    onSubmit={handleWithdrawSubmit}
                                    className="space-y-6"
                                >
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Amount
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                $
                                            </span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                max={balance}
                                                value={withdrawForm.data.amount}
                                                onChange={(e) =>
                                                    withdrawForm.setData(
                                                        "amount",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full pl-8 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
                                                placeholder="0.00"
                                                required
                                            />
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Available balance:{" "}
                                            {formatCurrency(balance)}
                                        </p>
                                        {withdrawForm.errors.amount && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {withdrawForm.errors.amount}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Payment Method
                                        </label>
                                        <select
                                            value={
                                                withdrawForm.data.payment_method
                                            }
                                            onChange={(e) =>
                                                withdrawForm.setData(
                                                    "payment_method",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
                                        >
                                            <option value="bank_transfer">
                                                Bank Transfer
                                            </option>
                                            <option value="paypal">
                                                PayPal
                                            </option>
                                            <option value="check">Check</option>
                                        </select>
                                        {withdrawForm.errors.payment_method && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {
                                                    withdrawForm.errors
                                                        .payment_method
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Account Details
                                        </h3>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Account Number
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    withdrawForm.data
                                                        .account_details
                                                        .account_number
                                                }
                                                onChange={(e) =>
                                                    withdrawForm.setData(
                                                        "account_details",
                                                        {
                                                            ...withdrawForm.data
                                                                .account_details,
                                                            account_number:
                                                                e.target.value,
                                                        },
                                                    )
                                                }
                                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
                                                placeholder="Enter account number"
                                                required
                                            />
                                            {withdrawForm.errors[
                                                "account_details.account_number"
                                            ] && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {
                                                        withdrawForm.errors[
                                                            "account_details.account_number"
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Routing Number (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    withdrawForm.data
                                                        .account_details
                                                        .routing_number
                                                }
                                                onChange={(e) =>
                                                    withdrawForm.setData(
                                                        "account_details",
                                                        {
                                                            ...withdrawForm.data
                                                                .account_details,
                                                            routing_number:
                                                                e.target.value,
                                                        },
                                                    )
                                                }
                                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
                                                placeholder="Enter routing number"
                                            />
                                            {withdrawForm.errors[
                                                "account_details.routing_number"
                                            ] && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {
                                                        withdrawForm.errors[
                                                            "account_details.routing_number"
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={withdrawForm.processing}
                                        className="w-full px-6 py-3 bg-brand-600 text-white rounded-2xl font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {withdrawForm.processing
                                            ? "Processing..."
                                            : "Request Withdrawal"}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Transfer Tab */}
                        {activeTab === "transfer" && (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">
                                    Transfer Funds
                                </h2>

                                <form
                                    onSubmit={handleTransferSubmit}
                                    className="space-y-6"
                                >
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Recipient Email
                                        </label>
                                        <input
                                            type="email"
                                            value={
                                                transferForm.data
                                                    .recipient_email
                                            }
                                            onChange={(e) =>
                                                transferForm.setData(
                                                    "recipient_email",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
                                            placeholder="recipient@example.com"
                                            required
                                        />
                                        {transferForm.errors
                                            .recipient_email && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {
                                                    transferForm.errors
                                                        .recipient_email
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Amount
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                $
                                            </span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                max={balance}
                                                value={transferForm.data.amount}
                                                onChange={(e) =>
                                                    transferForm.setData(
                                                        "amount",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full pl-8 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
                                                placeholder="0.00"
                                                required
                                            />
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Available balance:{" "}
                                            {formatCurrency(balance)}
                                        </p>
                                        {transferForm.errors.amount && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {transferForm.errors.amount}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Message (Optional)
                                        </label>
                                        <textarea
                                            value={transferForm.data.message}
                                            onChange={(e) =>
                                                transferForm.setData(
                                                    "message",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
                                            placeholder="Add a note for the recipient"
                                            rows={4}
                                        />
                                        {transferForm.errors.message && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {transferForm.errors.message}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={transferForm.processing}
                                        className="w-full px-6 py-3 bg-brand-600 text-white rounded-2xl font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {transferForm.processing
                                            ? "Sending..."
                                            : "Send Transfer"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
