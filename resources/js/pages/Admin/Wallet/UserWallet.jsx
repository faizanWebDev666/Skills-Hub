import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import AdminSidebar from "../../../components/AdminSidebar";

export default function UserWallet({ user, wallet, transactions }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { flash } = usePage().props;

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
            <div className="flex">
                <AdminSidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                <main className="flex-1 min-w-0">
                    <div className="px-4 sm:px-6 lg:px-8 py-8">
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

                        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {user.name}'s Wallet
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    View transaction history and wallet balance
                                    for this user.
                                </p>
                            </div>
                            <Link
                                href="/admin/wallet/wallets"
                                className="px-4 py-2 bg-white text-brand-600 border border-brand-600 rounded-2xl font-semibold hover:bg-brand-50 transition-colors"
                            >
                                Back to Wallets
                            </Link>
                        </div>

                        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Balance
                                    </p>
                                    <p className="text-4xl font-bold text-gray-900">
                                        {formatCurrency(wallet.balance)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                        Transactions
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {wallet.transactions_count ??
                                            transactions.data.length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Balance After
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {transactions.data.map(
                                            (transaction) => (
                                                <tr
                                                    key={transaction.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                                                        {transaction.type}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                        {formatCurrency(
                                                            transaction.amount,
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatCurrency(
                                                            transaction.balance_after,
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span
                                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
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
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(
                                                            transaction.created_at,
                                                        )}
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
