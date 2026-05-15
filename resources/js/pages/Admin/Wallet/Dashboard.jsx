import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminSidebar from '../../../components/AdminSidebar';

export default function Dashboard({ stats, recentTransactions, pendingWithdrawals }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { flash } = usePage().props;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="min-h-screen bg-cream-50">
            <div className="flex">
                <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 min-w-0">
                    <div className="px-4 sm:px-6 lg:px-8 py-8">
                        {/* Success Flash */}
                        {flash?.success && (
                            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-3.5 rounded-lg text-sm font-medium flex items-center gap-3">
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {flash.success}
                            </div>
                        )}

                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">Wallet Management</h1>
                            <p className="mt-2 text-gray-600">Manage user wallets, transactions, and withdrawals</p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                                <div className="text-gray-500 text-sm font-semibold mb-2">Total Wallets</div>
                                <div className="text-3xl font-bold text-gray-900">{stats.total_wallets}</div>
                            </div>

                            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                                <div className="text-gray-500 text-sm font-semibold mb-2">Total Balance</div>
                                <div className="text-3xl font-bold text-gray-900">{formatCurrency(stats.total_balance)}</div>
                            </div>

                            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                                <div className="text-gray-500 text-sm font-semibold mb-2">Pending Withdrawals</div>
                                <div className="text-3xl font-bold text-brand-600">{stats.pending_withdrawals}</div>
                            </div>

                            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                                <div className="text-gray-500 text-sm font-semibold mb-2">Total Transactions</div>
                                <div className="text-3xl font-bold text-gray-900">{stats.total_transactions}</div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <Link
                                href="/admin/wallet/withdrawals"
                                className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Pending Withdrawals</h3>
                                        <p className="text-sm text-gray-500">Review and approve withdrawal requests</p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href="/admin/wallet/wallets"
                                className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">All Wallets</h3>
                                        <p className="text-sm text-gray-500">View and manage all user wallets</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Pending Withdrawals */}
                        {pendingWithdrawals.length > 0 && (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 mb-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Pending Withdrawals</h2>
                                    <Link
                                        href="/admin/wallet/withdrawals"
                                        className="text-brand-600 hover:text-brand-700 font-semibold text-sm"
                                    >
                                        View All →
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    {pendingWithdrawals.slice(0, 5).map((withdrawal) => (
                                        <div key={withdrawal.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                                            <div>
                                                <p className="font-semibold text-gray-900">{withdrawal.wallet.user.name}</p>
                                                <p className="text-sm text-gray-500">{withdrawal.description}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-red-600">-{formatCurrency(Math.abs(withdrawal.amount))}</p>
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                    Pending
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Transactions */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                                <Link
                                    href="/admin/wallet/transactions"
                                    className="text-brand-600 hover:text-brand-700 font-semibold text-sm"
                                >
                                    View All →
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {recentTransactions.map((transaction) => (
                                            <tr key={transaction.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {transaction.wallet.user.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                                                        {transaction.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                    {formatCurrency(transaction.amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                                                        transaction.status === 'completed'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {transaction.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(transaction.created_at)}
                                                </td>
                                            </tr>
                                        ))}
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