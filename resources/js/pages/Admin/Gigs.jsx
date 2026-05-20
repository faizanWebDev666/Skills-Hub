import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';

export default function Gigs({ gigs, categories, filters, user, sidebarLinks }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-cream-50">
            <Navbar user={user} />

            <div className="flex">
                <AdminSidebar user={user} sidebarLinks={sidebarLinks} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 min-w-0">
                    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                        <div className="mb-8">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Gigs Management</h1>
                            <p className="text-gray-500 mt-1 text-sm">Moderate and manage all gigs</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {gigs?.data?.map((gig) => (
                                <div key={gig.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="h-48 bg-gray-100 relative">
                                        {gig.image ? (
                                            <img src={`/storage/${gig.image}`} alt={gig.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-brand-100">
                                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                                            gig.active ? 'bg-success-100 text-success-700' : 'bg-gray-200 text-gray-700'
                                        }`}>
                                            {gig.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-lg text-gray-900 truncate">{gig.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1">by {gig.user?.name || 'Unknown'}</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-3">${Number(gig.price).toLocaleString()}</p>
                                        <div className="flex gap-2 mt-4">
                                            <button
                                                onClick={() => {
                                                    fetch(`/admin/gigs/${gig.uuid}/toggle`, {
                                                        method: 'PATCH',
                                                        headers: {
                                                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                                                        },
                                                    }).then(() => window.location.reload());
                                                }}
                                                className="flex-1 px-3 py-2 bg-brand-100 text-brand-700 rounded-xl text-sm font-medium hover:bg-brand-200"
                                            >
                                                {gig.active ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this gig?')) {
                                                        fetch(`/admin/gigs/${gig.uuid}`, {
                                                            method: 'DELETE',
                                                            headers: {
                                                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                                                            },
                                                        }).then(() => window.location.reload());
                                                    }
                                                }}
                                                className="px-3 py-2 bg-danger-100 text-danger-700 rounded-xl text-sm font-medium hover:bg-danger-200"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {gigs?.links && (
                            <div className="mt-8">
                                {gigs.links.map((link, i) => (
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-3 py-1 mx-1 rounded ${link.active ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                                        />
                                    ) : (
                                        <span key={i} dangerouslySetInnerHTML={{ __html: link.label }} className="px-3 py-1 mx-1 text-gray-400" />
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}