import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';

export default function Settings({ settings, categoryCommissions, user, sidebarLinks }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [formData, setFormData] = useState({ ...settings, categoryCommissions: categoryCommissions || [] });

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/admin/settings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
            },
            body: JSON.stringify(formData),
        }).then(() => {
            alert('Settings updated successfully!');
        });
    };

    return (
        <div className="min-h-screen bg-cream-50">
            <Navbar user={user} />

            <div className="flex">
                <AdminSidebar user={user} sidebarLinks={sidebarLinks} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 min-w-0">
                    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                        <div className="mb-8">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Settings</h1>
                            <p className="text-gray-500 mt-1 text-sm">Configure your marketplace settings</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">General Settings</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                                        <input
                                            type="text"
                                            value={formData.siteName}
                                            onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
                                        <input
                                            type="number"
                                            value={formData.commissionRate}
                                            onChange={(e) => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Payout ($)</label>
                                        <input
                                            type="number"
                                            value={formData.minPayout}
                                            onChange={(e) => setFormData({ ...formData, minPayout: parseFloat(e.target.value) })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Gig Price ($)</label>
                                        <input
                                            type="number"
                                            value={formData.minGigPrice}
                                            onChange={(e) => setFormData({ ...formData, minGigPrice: parseFloat(e.target.value) })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Gig Price ($)</label>
                                        <input
                                            type="number"
                                            value={formData.maxGigPrice}
                                            onChange={(e) => setFormData({ ...formData, maxGigPrice: parseFloat(e.target.value) })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                                        />
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Category Commissions (%)</h3>
                                        {formData.categoryCommissions?.length > 0 ? (
                                            <div className="space-y-3">
                                                {formData.categoryCommissions.map((comm, index) => (
                                                    <div key={index} className="flex items-center gap-4">
                                                        <span className="w-1/2 text-sm font-medium text-gray-700 capitalize">{comm.category}</span>
                                                        <input
                                                            type="number"
                                                            value={comm.percentage}
                                                            onChange={(e) => {
                                                                const newComms = [...formData.categoryCommissions];
                                                                newComms[index].percentage = parseFloat(e.target.value);
                                                                setFormData({ ...formData, categoryCommissions: newComms });
                                                            }}
                                                            className="w-1/2 px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                                                            step="0.1"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">No categories found yet. Create a gig to see categories here.</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-brand-600 to-brand-800 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all mt-4"
                                    >
                                        Save Settings
                                    </button>
                                </form>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-brand-500 to-brand-800 rounded-2xl p-6 text-white">
                                    <h3 className="text-xl font-bold mb-2">System Status</h3>
                                    <p className="text-brand-100 text-sm mb-4">Current system configuration</p>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-brand-100">Active Users</span>
                                            <span className="font-semibold">--</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-brand-100">Total Revenue</span>
                                            <span className="font-semibold">$0</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-brand-100">Orders Today</span>
                                            <span className="font-semibold">0</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                                    <div className="space-y-3">
                                        <button className="w-full px-4 py-3 bg-accent-50 text-accent-700 rounded-xl font-medium hover:bg-accent-100 transition-colors">
                                            Clear Cache
                                        </button>
                                        <button className="w-full px-4 py-3 bg-warning-50 text-warning-700 rounded-xl font-medium hover:bg-warning-100 transition-colors">
                                            Run Backup
                                        </button>
                                        <button className="w-full px-4 py-3 bg-success-50 text-success-700 rounded-xl font-medium hover:bg-success-100 transition-colors">
                                            View Logs
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}