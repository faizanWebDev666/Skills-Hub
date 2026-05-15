import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminSidebar from '../../../components/AdminSidebar';

export default function Withdrawals({ withdrawals, filters }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
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

    const handleApprove = (withdrawal) => {
        router.post(`/admin/wallet/withdrawals/${withdrawal.id}/approve`, {}, {
            preserveScroll: true,
        });
    };

    const handleReject = (withdrawal) => {
        setSelectedWithdrawal(withdrawal);
        setShowRejectModal(true);
    };

    const submitRejection = () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }

        router.post(`/admin/wallet/withdrawals/${selectedWithdrawal.id}/reject`, {
            reason: rejectionReason,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowRejectModal(false);
                setRejectionReason('');
                setSelectedWithdrawal(null);
            },
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

                        {/* Error Flash */}
                        {flash?.error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-3.5 rounded-lg text-sm font-medium flex items-center gap-3">
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {flash.error}
                            </div>
                        )}

                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Withdrawal Requests</h1>
                                    <p className="mt-2 text-gray-600">Approve or reject user withdrawal requests</p>
                                </div>
                                <Link
                                    href="/admin/wallet"
                                    className="px-4 py-2 bg-white text-brand-600 border border-brand-600 rounded-2xl font-semibold hover:bg-brand-50 transition-colors"
                                >
                                    ← Back to Dashboard
                                </Link>
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex gap-3">
                                {[
                                    { value: 'pending_approval', label: 'Pending Approval' },
                                    { value: 'pending', label: 'Processing' },
                                    { value: 'completed', label: 'Completed' },
                                    { value: 'cancelled', label: 'Rejected' },
                                ].map((status) => (
                                    <button
                                        key={status.value}
                                        onClick={() => router.get('/admin/wallet/withdrawals', { status: status.value }, { preserveScroll: true })}
                                        className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                                            filters.status === status.value
                                                ? 'bg-brand-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {status.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Withdrawals List */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                            {withdrawals.data.length > 0 ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Method</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Requested</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {withdrawals.data.map((withdrawal) => (
                                                    <tr key={withdrawal.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {withdrawal.wallet.user.name}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {withdrawal.wallet.user.email}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                            {formatCurrency(Math.abs(withdrawal.amount))}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                            {withdrawal.metadata?.payment_method && (
                                                                <span className="capitalize">
                                                                    {withdrawal.metadata.payment_method.replace('_', ' ')}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                                                                withdrawal.status === 'pending_approval'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : withdrawal.status === 'pending'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : withdrawal.status === 'completed'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {withdrawal.status.replace('_', ' ')}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {formatDate(withdrawal.created_at)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            {withdrawal.status === 'pending_approval' && (
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => handleApprove(withdrawal)}
                                                                        className="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg font-semibold transition-colors"
                                                                    >
                                                                        Approve
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleReject(withdrawal)}
                                                                        className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-semibold transition-colors"
                                                                    >
                                                                        Reject
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {withdrawals.last_page > 1 && (
                                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-gray-700">
                                                    Showing {withdrawals.from} to {withdrawals.to} of {withdrawals.total} withdrawals
                                                </div>
                                                <div className="flex space-x-1">
                                                    {withdrawals.links.map((link, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                                                            className={`px-3 py-1 text-sm rounded ${
                                                                link.active
                                                                    ? 'bg-brand-600 text-white'
                                                                    : link.url
                                                                    ? 'text-brand-600 hover:bg-brand-50'
                                                                    : 'text-gray-400 cursor-not-allowed'
                                                            }`}
                                                            disabled={!link.url}
                                                        >
                                                            {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No withdrawals</h3>
                                    <p className="text-gray-500">There are no pending withdrawal requests at the moment.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full mx-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reject Withdrawal</h2>
                        <p className="text-gray-600 mb-4">
                            Please provide a reason for rejecting this withdrawal request. The user will be notified and their funds will be refunded.
                        </p>

                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all mb-6"
                            rows={4}
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitRejection}
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-2xl font-semibold hover:bg-red-700 transition-colors"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}