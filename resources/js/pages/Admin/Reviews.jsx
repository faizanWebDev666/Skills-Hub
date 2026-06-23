import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminNavbar from '../../components/AdminNavbar';
import AdminSidebar from '../../components/AdminSidebar';
import { Star } from 'lucide-react';
import Modal from '../../components/Modal';

export default function Reviews({ vendors, filters, user, sidebarLinks }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // Default filter values
    const [searchParams, setSearchParams] = useState({
        search: filters?.search || '',
        status: filters?.status || '',
        min_rating: filters?.minRating || '',
        sort: filters?.sort || 'rating_desc'
    });

    const vendorList = Array.isArray(vendors?.data)
        ? vendors.data.filter(Boolean)
        : Array.isArray(vendors)
            ? vendors.filter(Boolean)
            : [];

    const handleFilterChange = (key, value) => {
        const newParams = { ...searchParams, [key]: value };
        setSearchParams(newParams);
        
        // Remove empty params to keep URL clean
        const cleanParams = Object.fromEntries(
            Object.entries(newParams).filter(([_, v]) => v !== '')
        );

        router.get('/admin/reviews', cleanParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const [showModal, setShowModal] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [processing, setProcessing] = useState(false);

    const confirmToggleStatus = (vendor) => {
        setSelectedVendor(vendor);
        setShowModal(true);
    };

    const executeToggle = () => {
        if (selectedVendor) {
            setProcessing(true);
            router.post(
                `/admin/reviews/${selectedVendor.uuid}/toggle-status`,
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setShowModal(false);
                        setSelectedVendor(null);
                    },
                    onFinish: () => setProcessing(false)
                },
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-brand-500/30">
            <AdminNavbar user={user} />

            <div className="flex">
                <AdminSidebar user={user} sidebarLinks={sidebarLinks} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 min-w-0">
                    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                        <Modal
                            isOpen={showModal}
                            onClose={() => {
                                setShowModal(false);
                                setSelectedVendor(null);
                            }}
                            title={`Confirm ${selectedVendor?.banned_at ? 'Activation' : 'Deactivation'}`}
                            message={`Are you sure you want to ${selectedVendor?.banned_at ? 'activate' : 'deactivate'} the vendor ${selectedVendor?.name}?${!selectedVendor?.banned_at && " They will no longer be able to log in or receive new orders."}`}
                            type={selectedVendor?.banned_at ? 'success' : 'error'}
                            confirmText={`Yes, ${selectedVendor?.banned_at ? 'Activate' : 'Deactivate'}`}
                            onConfirm={executeToggle}
                            isProcessing={processing}
                        />
                        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Reviews & Ratings</h1>
                                <p className="text-gray-500 mt-1 text-sm">Monitor vendor performance and manage their status</p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchParams.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
                                />
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <select
                                    value={searchParams.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 text-sm bg-white"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="active">Active</option>
                                    <option value="deactivated">Deactivated</option>
                                </select>

                                <select
                                    value={searchParams.min_rating}
                                    onChange={(e) => handleFilterChange('min_rating', e.target.value)}
                                    className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 text-sm bg-white"
                                >
                                    <option value="">Any Rating</option>
                                    <option value="4">4.0 & Up</option>
                                    <option value="3">3.0 & Up</option>
                                    <option value="2">2.0 & Up</option>
                                </select>

                                <select
                                    value={searchParams.sort}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                    className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 text-sm bg-white"
                                >
                                    <option value="rating_desc">Highest Rating</option>
                                    <option value="rating_asc">Lowest Rating</option>
                                    <option value="orders_desc">Most Delivered</option>
                                    <option value="orders_asc">Least Delivered</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-gray-500 border-b">
                                            <th className="pb-3 font-medium">Vendor</th>
                                            <th className="pb-3 font-medium">Performance</th>
                                            <th className="pb-3 font-medium">Delivered Orders</th>
                                            <th className="pb-3 font-medium">Status</th>
                                            <th className="pb-3 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vendorList.map((v, index) => {
                                            if (!v?.id) return null;
                                            const avgRating = Number(v.average_rating || 0).toFixed(1);
                                            
                                            return (
                                                <tr key={v.id ?? index} className="border-b border-gray-100">
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                                {v.name?.charAt(0) || 'V'}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium text-gray-900 block">{v.name}</span>
                                                                <span className="text-xs text-gray-500">{v.email}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                            <span className="font-bold text-gray-900">{avgRating}</span>
                                                            <span className="text-xs text-gray-500">({v.total_reviews || 0} reviews)</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4">
                                                        <span className="font-medium text-gray-900">{v.delivered_orders_count || 0}</span>
                                                    </td>
                                                    <td className="py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            v.banned_at ? 'bg-danger-100 text-danger-700' : 'bg-success-100 text-success-700'
                                                        }`}>
                                                            {v.banned_at ? 'Deactivated' : 'Active'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-2">
                                                            {v.id !== user?.id && (
                                                                <Link
                                                                    href={route('chat.with-user', v.uuid)}
                                                                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-brand-100 text-brand-700 hover:bg-brand-200 transition-colors"
                                                                >
                                                                    Message
                                                                </Link>
                                                            )}
                                                            <Link
                                                                href={`/admin/reviews/${v.uuid}`}
                                                                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                                                            >
                                                                View Details
                                                            </Link>
                                                            <button
                                                                onClick={() => confirmToggleStatus(v)}
                                                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                                                                    v.banned_at 
                                                                        ? 'bg-success-100 text-success-700 hover:bg-success-200' 
                                                                        : 'bg-danger-100 text-danger-700 hover:bg-danger-200'
                                                                }`}
                                                            >
                                                                {v.banned_at ? 'Activate' : 'Deactivate'}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {vendorList.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="py-8 text-center text-gray-500">
                                                    No vendors found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {vendors?.links && vendors.links.length > 3 && (
                                <div className="mt-6 flex flex-wrap gap-1">
                                    {vendors.links.map((link, i) => (
                                        link.url ? (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className={`px-3 py-1 rounded-md text-sm ${link.active ? 'bg-brand-600 text-white font-bold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                            />
                                        ) : (
                                            <span key={i} dangerouslySetInnerHTML={{ __html: link.label }} className="px-3 py-1 text-sm text-gray-400" />
                                        )
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
