import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import VendorNavbar from '../../components/VendorNavbar';
import VendorSidebar from '../../components/VendorSidebar';

export default function VendorGigs({ gigs, counts, user }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedGigs, setSelectedGigs] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(null);
    const { flash } = usePage().props;

    const toggleSelect = (id) => {
        setSelectedGigs(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedGigs.length === gigs.data?.length) {
            setSelectedGigs([]);
        } else {
            setSelectedGigs(gigs.data?.map(g => g.id) || []);
        }
    };

    const handleDelete = (gig) => {
        router.delete(`/vendor/gigs/${gig.uuid}`, {
            onSuccess: () => setShowDeleteModal(null),
        });
    };

    const handleToggle = (gig) => {
        router.patch(`/vendor/gigs/${gig.uuid}/toggle`, {}, {
            preserveScroll: true,
        });
    };

    const filteredGigs = gigs.data?.filter(g =>
        g.title.toLowerCase().includes(search.toLowerCase())
    ) || [];

    return (
        <div className="min-h-screen bg-cream-50">
            <VendorNavbar user={user} />

            <div className="flex items-start">
                <VendorSidebar user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 min-w-0">
                    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                        {/* Flash message */}
                        {flash?.success && (
                            <div className="mb-6 bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3">
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {flash.success}
                            </div>
                        )}
                        {flash?.error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3">
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {flash.error}
                            </div>
                        )}

                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">My Gigs</h1>
                                <p className="text-gray-500 mt-1 text-sm">{counts?.total || 0} total • {counts?.active || 0} active • {counts?.paused || 0} paused</p>
                            </div>
                            <Link
                                href="/vendor/gigs/create"
                                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Gig
                            </Link>
                        </div>

                        {/* Search + Bulk Actions */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
                            <div className="p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                                <div className="relative flex-1 w-full sm:max-w-sm">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search gigs..."
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
                                    />
                                </div>
                                {selectedGigs.length > 0 && (
                                    <span className="text-sm text-gray-600 font-medium">{selectedGigs.length} selected</span>
                                )}
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-t border-gray-100">
                                            <th className="py-3 px-4 text-left">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedGigs.length === filteredGigs.length && filteredGigs.length > 0}
                                                    onChange={toggleSelectAll}
                                                    className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                                                />
                                            </th>
                                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Gig</th>
                                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredGigs.map((gig) => (
                                            <tr key={gig.id} className={`hover:bg-gray-50 transition-colors ${selectedGigs.includes(gig.id) ? 'bg-brand-50/50' : ''}`}>
                                                <td className="py-3 px-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedGigs.includes(gig.id)}
                                                        onChange={() => toggleSelect(gig.id)}
                                                        className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                                                    />
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                                                            {gig.image ? (
                                                                <img src={`/storage/${gig.image}`} alt={gig.title} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-gray-400">
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <Link href={`/gigs/${gig.uuid}`} className="font-semibold text-gray-900 text-sm hover:text-brand-600 truncate block">
                                                                {gig.title}
                                                            </Link>
                                                            <p className="text-xs text-gray-400 mt-0.5">ID: {gig.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 hidden sm:table-cell">
                                                    <span className="text-sm text-gray-600 capitalize">{gig.category?.replace('_', ' ')}</span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="font-semibold text-gray-900 text-sm">${Number(gig.price).toFixed(2)}</span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <button
                                                        onClick={() => handleToggle(gig)}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                                                            gig.active
                                                                ? 'bg-success-100 text-success-700 hover:bg-success-200'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        <span className={`w-1.5 h-1.5 rounded-full ${gig.active ? 'bg-success-500' : 'bg-gray-400'}`}></span>
                                                        {gig.active ? 'Active' : 'Paused'}
                                                    </button>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link
                                                            href={`/vendor/gigs/${gig.uuid}/edit`}
                                                            className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </Link>
                                                        <Link
                                                            href={`/gigs/${gig.uuid}`}
                                                            className="p-2 text-gray-400 hover:text-success-600 hover:bg-success-50 rounded-lg transition-colors"
                                                            title="View"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </Link>
                                                        <button
                                                            onClick={() => setShowDeleteModal(gig)}
                                                            className="p-2 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {filteredGigs.length === 0 && (
                                    <div className="text-center py-16 text-gray-400">
                                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <p className="font-semibold text-lg text-gray-500">No gigs found</p>
                                        <p className="text-sm mt-1">Create your first gig to start selling</p>
                                        <Link href="/vendor/gigs/create" className="mt-4 inline-flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Create Gig
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {gigs.links && gigs.links.length > 3 && (
                                <div className="border-t border-gray-100 px-4 py-3 flex flex-wrap items-center justify-center gap-1">
                                    {gigs.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                                link.active
                                                    ? 'bg-brand-600 text-white'
                                                    : link.url
                                                    ? 'text-gray-600 hover:bg-gray-100'
                                                    : 'text-gray-300 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <div className="text-center">
                            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Gig?</h3>
                            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete "<span className="font-semibold text-gray-700">{showDeleteModal.title}</span>"? This action cannot be undone.</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(null)}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(showDeleteModal)}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
