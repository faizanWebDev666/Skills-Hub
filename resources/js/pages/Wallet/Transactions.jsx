import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import Navbar from "../../components/Navbar";
import CustomerSidebar from "../../components/CustomerSidebar";
import VendorNavbar from "../../components/VendorNavbar";
import VendorSidebar from "../../components/VendorSidebar";

export default function Transactions({ transactions, filters, wallet, user, conversations, totalUnreadMessages }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { flash, auth } = usePage().props;
    const isVendor = auth?.user?.roles?.some(role => ['freelancer', 'vendor', 'admin'].includes(role.name));

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

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters };
        if (value) {
            newFilters[key] = value;
        } else {
            delete newFilters[key];
        }

        router.get("/wallet/transactions", newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getTransactionIcon = (type) => {
        switch (type) {
            case "deposit":
                return (
                    <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16l-4-4m0 0l4-4m-4 4h18"
                        />
                    </svg>
                );
            case "withdrawal":
                return (
                    <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H3"
                        />
                    </svg>
                );
            case "payment":
                return (
                    <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                    </svg>
                );
            case "commission":
                return (
                    <svg
                        className="w-5 h-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                    </svg>
                );
            case "refund":
                return (
                    <svg
                        className="w-5 h-5 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 21l-4-4 4-4"
                        />
                    </svg>
                );
            default:
                return (
                    <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                );
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "failed":
                return "bg-red-100 text-red-800";
            case "cancelled":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="min-h-screen bg-cream-50">
            {isVendor ? (
                <VendorNavbar user={user || auth.user} />
            ) : (
                <Navbar user={auth.user} />
            )}

            <div className="flex">
                {isVendor ? (
                    <VendorSidebar
                        user={user || auth.user}
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                        conversations={conversations || []}
                        totalUnreadMessages={totalUnreadMessages || 0}
                    />
                ) : (
                    <CustomerSidebar
                        user={auth.user}
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                )}

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
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Transaction History
                                    </h1>
                                    <p className="mt-2 text-gray-600">
                                        View and filter all your wallet
                                        transactions
                                    </p>
                                </div>
                                <Link
                                    href="/wallet"
                                    className="px-4 py-2 bg-white text-brand-600 border border-brand-600 rounded-2xl font-semibold hover:bg-brand-50 transition-colors"
                                >
                                    ← Back to Wallet
                                </Link>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 mb-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Filters
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Type
                                    </label>
                                    <select
                                        value={filters.type || ""}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "type",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                                    >
                                        <option value="">All Types</option>
                                        <option value="deposit">Deposit</option>
                                        <option value="withdrawal">
                                            Withdrawal
                                        </option>
                                        <option value="payment">Payment</option>
                                        <option value="commission">
                                            Commission
                                        </option>
                                        <option value="refund">Refund</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={filters.status || ""}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "status",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="completed">
                                            Completed
                                        </option>
                                        <option value="pending">Pending</option>
                                        <option value="failed">Failed</option>
                                        <option value="cancelled">
                                            Cancelled
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.start_date || ""}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "start_date",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.end_date || ""}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "end_date",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {(filters.type ||
                                filters.status ||
                                filters.start_date ||
                                filters.end_date) && (
                                <div className="mt-4">
                                    <button
                                        onClick={() =>
                                            router.get(
                                                "/wallet/transactions",
                                                {},
                                                { preserveState: true },
                                            )
                                        }
                                        className="text-sm text-brand-600 hover:text-brand-700 font-semibold"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Transactions List */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                            {transactions.data.length > 0 ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Transaction
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Type
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Amount
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Balance
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
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div
                                                                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                                                            transaction.amount >
                                                                            0
                                                                                ? "bg-green-100"
                                                                                : "bg-red-100"
                                                                        }`}
                                                                    >
                                                                        {getTransactionIcon(
                                                                            transaction.type,
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-sm font-medium text-gray-900">
                                                                            {
                                                                                transaction.description
                                                                            }
                                                                        </div>
                                                                        <div className="text-sm text-gray-500">
                                                                            ID:{" "}
                                                                            {
                                                                                transaction.id
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                                                                    {
                                                                        transaction.type
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span
                                                                    className={`text-sm font-semibold ${
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
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {formatCurrency(
                                                                    transaction.balance_after,
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span
                                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusBadge(transaction.status)}`}
                                                                >
                                                                    {
                                                                        transaction.status
                                                                    }
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

                                    {/* Pagination */}
                                    {transactions.last_page > 1 && (
                                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-gray-700">
                                                    Showing {transactions.from}{" "}
                                                    to {transactions.to} of{" "}
                                                    {transactions.total}{" "}
                                                    transactions
                                                </div>
                                                <div className="flex space-x-1">
                                                    {transactions.links.map(
                                                        (link, index) => (
                                                            <button
                                                                key={index}
                                                                onClick={() =>
                                                                    link.url &&
                                                                    router.get(
                                                                        link.url,
                                                                        {},
                                                                        {
                                                                            preserveState: true,
                                                                            preserveScroll: true,
                                                                        },
                                                                    )
                                                                }
                                                                className={`px-3 py-1 text-sm rounded ${
                                                                    link.active
                                                                        ? "bg-brand-600 text-white"
                                                                        : link.url
                                                                          ? "text-brand-600 hover:bg-brand-50"
                                                                          : "text-gray-400 cursor-not-allowed"
                                                                }`}
                                                                disabled={
                                                                    !link.url
                                                                }
                                                            >
                                                                {link.label
                                                                    .replace(
                                                                        "&laquo;",
                                                                        "«",
                                                                    )
                                                                    .replace(
                                                                        "&raquo;",
                                                                        "»",
                                                                    )}
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
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
                                        No transactions found
                                    </h3>
                                    <p className="text-gray-500">
                                        {filters.type ||
                                        filters.status ||
                                        filters.start_date ||
                                        filters.end_date
                                            ? "Try adjusting your filters to see more transactions."
                                            : "Your transaction history will appear here once you start using your wallet."}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
