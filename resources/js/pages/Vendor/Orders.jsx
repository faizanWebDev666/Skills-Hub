import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import Navbar from '../../components/Navbar';
import VendorSidebar from '../../components/VendorSidebar';

export default function VendorOrders({ orders, filters, user }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleFilterChange = (status) => {
        router.get('/vendor/orders', { status }, { preserveState: true, preserveScroll: true });
    };

    const handleDeliver = (orderId) => {
        if (confirm('Are you sure you want to mark this order as delivered? The customer will be notified to review and complete the order.')) {
            router.post(`/orders/${orderId}/deliver`, {}, { preserveScroll: true });
        }
    };

    const statusColors = {
        pending_payment: 'bg-gray-100 text-gray-700 ring-gray-200',
        pending: 'bg-yellow-100 text-yellow-700 ring-yellow-200',
        in_progress: 'bg-brand-100 text-brand-700 ring-brand-200',
        delivered: 'bg-purple-100 text-purple-700 ring-purple-200',
        completed: 'bg-success-100 text-success-700 ring-success-200',
        cancelled: 'bg-red-100 text-red-700 ring-red-200',
    };

    const filterTabs = [
        { id: 'all', label: 'All Orders' },
        { id: 'in_progress', label: 'In Progress' },
        { id: 'delivered', label: 'Delivered' },
        { id: 'completed', label: 'Completed' },
    ];

    return (
        <div className="min-h-screen bg-cream-50">
            <Navbar user={user} />

            <div className="flex">
                <VendorSidebar user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Orders Management</h1>
                            <p className="text-gray-500 mt-1 text-sm sm:text-base">View and manage all your active and past orders</p>
                        </div>

                        {/* Filters */}
                        <div className="bg-white rounded-t-2xl border border-gray-200 border-b-0 p-2 sm:p-4 overflow-x-auto">
                            <div className="flex gap-2 min-w-max">
                                {filterTabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleFilterChange(tab.id)}
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                            (filters.status === tab.id || (!filters.status && tab.id === 'all'))
                                                ? 'bg-brand-600 text-white shadow-sm'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Orders List */}
                        <div className="bg-white rounded-b-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <ul className="divide-y divide-gray-100">
                                {orders.data.length > 0 ? orders.data.map((order) => (
                                    <li key={order.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-2xl overflow-hidden shrink-0 border border-gray-200">
                                                    {order.gig?.image ? (
                                                        <img src={`/storage/${order.gig.image}`} alt={order.gig.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-brand-50 text-brand-500">
                                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                                                            {order.gig?.title || 'Custom Service'}
                                                        </h3>
                                                        <span className={`shrink-0 inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ring-1 ${statusColors[order.status] || statusColors.pending}`}>
                                                            {order.status.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                                        <span>Order #{order.id}</span>
                                                        <span>•</span>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-[10px]">
                                                                {order.customer?.name?.charAt(0) || 'C'}
                                                            </div>
                                                            <span className="font-medium text-gray-700">{order.customer?.name || 'Customer'}</span>
                                                        </div>
                                                        <span>•</span>
                                                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                                    </div>

                                                    {order.requirements && (
                                                        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 text-sm text-gray-600 border border-gray-100">
                                                            <p className="font-semibold text-gray-900 mb-1 text-xs uppercase tracking-wider">Requirements</p>
                                                            <p className="line-clamp-2">{order.requirements}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 shrink-0 lg:w-48 pl-0 lg:pl-6 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0">
                                                <div className="text-left lg:text-right">
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</p>
                                                    <p className="text-2xl font-black text-gray-900">${Number(order.amount).toLocaleString()}</p>
                                                </div>
                                                
                                                <div className="flex flex-col gap-2 w-full sm:w-auto">
                                                    {order.status === 'in_progress' && (
                                                        <button
                                                            onClick={() => handleDeliver(order.id)}
                                                            className="w-full sm:w-auto px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
                                                        >
                                                            Deliver Order
                                                        </button>
                                                    )}
                                                    {order.customer?.id && (
                                                        <Link
                                                            href={route('chat.with-user', order.customer.id)}
                                                            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-brand-50 text-brand-700 hover:bg-brand-100 text-sm font-bold rounded-xl transition-all"
                                                        >
                                                            Message Buyer
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )) : (
                                    <li className="py-24 text-center">
                                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 mb-6">
                                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
                                        <p className="text-gray-500 max-w-sm mx-auto">
                                            {filters.status !== 'all' 
                                                ? `You don't have any orders with status '${filters.status.replace('_', ' ')}'.` 
                                                : "You don't have any orders yet. Keep optimizing your gigs to attract buyers!"}
                                        </p>
                                        {filters.status !== 'all' && (
                                            <button 
                                                onClick={() => handleFilterChange('all')}
                                                className="mt-6 text-brand-600 font-semibold hover:text-brand-700"
                                            >
                                                View all orders
                                            </button>
                                        )}
                                    </li>
                                )}
                            </ul>
                            
                            {/* Pagination */}
                            {orders.links?.length > 3 && (
                                <div className="border-t border-gray-100 bg-gray-50 p-4 sm:p-6 flex justify-center">
                                    <div className="flex gap-1">
                                        {orders.links.map((link, i) => (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                    link.active 
                                                        ? 'bg-brand-600 text-white' 
                                                        : !link.url 
                                                            ? 'text-gray-400 cursor-not-allowed' 
                                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
