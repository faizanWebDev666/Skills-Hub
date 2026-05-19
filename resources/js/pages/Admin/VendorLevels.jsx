import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';

export default function VendorLevels({ vendors, user, sidebarLinks }) {
    const { flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [vendorList, setVendorList] = useState(vendors?.data || []);

    const handleLevelChange = async (vendorId, level) => {
        const response = await fetch(`/admin/vendor-levels/${vendorId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
            },
            body: JSON.stringify({ vendor_level: level }),
        });

        if (response.ok) {
            setVendorList((current) => current.map((vendor) => {
                if (vendor.id === vendorId) {
                    return { ...vendor, vendor_level: level };
                }
                return vendor;
            }));
        } else {
            const errorData = await response.json().catch(() => null);
            alert(errorData?.message || 'Unable to update vendor level.');
        }
    };

    return (
        <div className="min-h-screen bg-cream-50">
            <Navbar user={user} />

            <div className="flex">
                <AdminSidebar user={user} sidebarLinks={sidebarLinks} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 min-w-0">
                    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                        <div className="mb-8">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Vendor Levels</h1>
                            <p className="text-gray-500 mt-1 text-sm">Control vendor levels and display the correct level on gig pages.</p>
                        </div>

                        {flash?.success && (
                            <div className="mb-6 rounded-2xl bg-success-50 border border-success-200 p-4 text-success-700">
                                {flash.success}
                            </div>
                        )}
                        {flash?.error && (
                            <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-700">
                                {flash.error}
                            </div>
                        )}

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-gray-500 border-b">
                                            <th className="pb-3 font-medium">Vendor</th>
                                            <th className="pb-3 font-medium">Category</th>
                                            <th className="pb-3 font-medium">Member Since</th>
                                            <th className="pb-3 font-medium">Completed Orders</th>
                                            <th className="pb-3 font-medium">Rating</th>
                                            <th className="pb-3 font-medium">Current Level</th>
                                            <th className="pb-3 font-medium">Assign Level</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vendorList.map((vendor) => (
                                            <tr key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-brand-600 text-white grid place-items-center font-bold">
                                                            {vendor.name?.charAt(0) || 'V'}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{vendor.name}</p>
                                                            <p className="text-xs text-gray-500">{vendor.email}</p>
                                                            <p className="text-xs text-gray-500">Joined {new Date(vendor.created_at).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-gray-900 font-medium">{vendor.service_type || vendor.primary_category || 'Uncategorized'}</td>
                                                <td className="py-4 text-gray-900">{new Date(vendor.created_at).toLocaleDateString()}</td>
                                                <td className="py-4 text-gray-900 font-bold">{vendor.completed_orders_count ?? 0}</td>
                                                <td className="py-4 text-gray-900 font-bold">{vendor.avg_rating ? Number(vendor.avg_rating).toFixed(1) : '—'}</td>
                                                <td className="py-4 text-gray-900 font-bold">{vendor.vendor_level || 1}</td>
                                                <td className="py-4">
                                                    <select
                                                        defaultValue={vendor.vendor_level || 1}
                                                        onChange={(event) => handleLevelChange(vendor.id, Number(event.target.value))}
                                                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                                                    >
                                                        {[1, 2, 3, 4].map((level) => (
                                                            <option key={level} value={level}>{`Level ${level}`}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                                <p>{vendors?.total ?? vendorList.length} vendors found.</p>
                                <div className="space-x-2">
                                    {vendors?.links?.map((link, index) => (
                                        link.url ? (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className={`px-3 py-1 rounded ${link.active ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                                            />
                                        ) : (
                                            <span key={index} dangerouslySetInnerHTML={{ __html: link.label }} className="px-3 py-1 text-gray-400" />
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
