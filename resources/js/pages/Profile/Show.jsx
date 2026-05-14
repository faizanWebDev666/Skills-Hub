import React, { useState, useRef } from 'react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import Navbar from '../../components/Navbar';
import CustomerSidebar from '../../components/CustomerSidebar';

export default function ProfileShow({ user, stats, recentOrders }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);
    const { flash } = usePage().props;

    const profileForm = useForm({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        phone: user?.phone || '',
        location: user?.location || '',
        country: user?.country || '',
        city: user?.city || '',
        address: user?.address || '',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result);
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('avatar', file);

            profileForm.transform(() => formData);
            profileForm.post('/profile/avatar', {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => setAvatarPreview(null),
            });
        }
    };

    const handleRemoveAvatar = () => {
        profileForm.delete('/profile/avatar', {
            preserveScroll: true,
        });
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.put('/profile', {
            preserveScroll: true,
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.put('/profile/password', {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
            },
        });
    };

    const handleSectionChange = (section) => {
        setActiveTab(section);
    };

    return (
        <div className="min-h-screen bg-cream-50">
            <Navbar user={user} />

            <div className="flex">
                <CustomerSidebar user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

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

                        {/* Profile Header */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 mb-8">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-3xl bg-brand-600 text-white flex items-center justify-center text-3xl font-bold overflow-hidden">
                                        {user?.avatar ? (
                                            <img
                                                src={avatarPreview || `/storage/${user.avatar}`}
                                                alt={user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span>{user?.name?.charAt(0) || 'U'}</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
                                        title="Change photo"
                                    >
                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg,image/webp"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Your Profile</p>
                                    <h1 className="text-3xl font-bold text-gray-900">{user?.name || 'Your Name'}</h1>
                                    <p className="mt-1 text-sm text-gray-600">{user?.email}</p>
                                </div>
                                {user?.avatar && (
                                    <button
                                        onClick={handleRemoveAvatar}
                                        className="ml-auto text-sm text-gray-400 hover:text-red-500 transition-colors font-medium"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="mb-0">
                            <div className="flex flex-wrap border-b border-gray-200 gap-0">
                                {[
                                    { id: 'profile', label: 'Personal Info' },
                                    { id: 'password', label: 'Password' },
                                    { id: 'orders', label: 'My Orders' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleSectionChange(tab.id)}
                                        className={`px-5 py-3.5 text-sm font-semibold transition-all border-b-2 -mb-px whitespace-nowrap ${
                                            activeTab === tab.id
                                                ? 'text-brand-600 border-brand-600'
                                                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Profile Section */}
                        {activeTab === 'profile' && (
                            <form onSubmit={handleProfileSubmit}>
                                <div className="bg-white rounded-b-3xl shadow-sm border border-t-0 border-gray-200 p-6 sm:p-8">
                                    <div className="mb-6">
                                        <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                                    </div>
                                    <div className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={profileForm.data.name}
                                                    onChange={(e) => profileForm.setData('name', e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                                                <input
                                                    type="email"
                                                    value={profileForm.data.email}
                                                    onChange={(e) => profileForm.setData('email', e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                                                <input
                                                    type="text"
                                                    value={profileForm.data.phone}
                                                    onChange={(e) => profileForm.setData('phone', e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
                                                <input
                                                    type="text"
                                                    value={profileForm.data.location}
                                                    onChange={(e) => profileForm.setData('location', e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Country</label>
                                                <input
                                                    type="text"
                                                    value={profileForm.data.country}
                                                    onChange={(e) => profileForm.setData('country', e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
                                                <input
                                                    type="text"
                                                    value={profileForm.data.city}
                                                    onChange={(e) => profileForm.setData('city', e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
                                            <textarea
                                                value={profileForm.data.address}
                                                onChange={(e) => profileForm.setData('address', e.target.value)}
                                                rows={2}
                                                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm resize-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">About You</label>
                                            <textarea
                                                value={profileForm.data.bio}
                                                onChange={(e) => profileForm.setData('bio', e.target.value)}
                                                rows={4}
                                                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm resize-none"
                                                placeholder="Tell us a bit about yourself."
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white border-t border-gray-200 p-6 sm:p-8 rounded-b-3xl">
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={profileForm.processing}
                                            className="px-8 py-3 bg-brand-600 text-white text-sm font-bold rounded-2xl hover:bg-brand-700 transition-colors disabled:opacity-50"
                                        >
                                            {profileForm.processing ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* Password Section */}
                        {activeTab === 'password' && (
                            <form onSubmit={handlePasswordSubmit}>
                                <div className="bg-white rounded-b-3xl shadow-sm border border-t-0 border-gray-200 p-6 sm:p-8">
                                    <div className="mb-6">
                                        <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
                                    </div>
                                    <div className="max-w-xl space-y-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current Password</label>
                                            <input
                                                type="password"
                                                value={passwordForm.data.current_password}
                                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                                            <input
                                                type="password"
                                                value={passwordForm.data.password}
                                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={passwordForm.data.password_confirmation}
                                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white border-t border-gray-200 p-6 sm:p-8 rounded-b-3xl">
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={passwordForm.processing}
                                            className="px-8 py-3 bg-brand-600 text-white text-sm font-bold rounded-2xl hover:bg-brand-700 transition-colors disabled:opacity-50"
                                        >
                                            {passwordForm.processing ? 'Changing...' : 'Update Password'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* Orders Section */}
                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-b-3xl shadow-sm border border-t-0 border-gray-200 p-6 sm:p-8">
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-gray-900">My Orders</h2>
                                </div>
                                {recentOrders && recentOrders.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentOrders.map((order) => (
                                            <div key={order.id} className="p-4 sm:p-5 border border-gray-200 rounded-2xl hover:border-brand-300 transition-colors">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-cream-100 flex items-center justify-center shrink-0">
                                                            {order.gig?.image ? (
                                                                <img
                                                                    src={`/storage/${order.gig.image}`}
                                                                    alt={order.gig.title}
                                                                    className="w-full h-full rounded-2xl object-cover"
                                                                />
                                                            ) : (
                                                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-800">{order.gig?.title || 'Service'}</h3>
                                                            <p className="text-sm text-gray-500">
                                                                Ordered {new Date(order.created_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-900">${parseFloat(order.total || order.gig?.price || 0).toFixed(2)}</p>
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold mt-1 ${
                                                            order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                            order.status === 'delivered' ? 'bg-purple-100 text-purple-700' :
                                                            order.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                            {order.status || 'pending'}
                                                        </span>
                                                        {order.status === 'delivered' && (
                                                            <div className="mt-3">
                                                                <button 
                                                                    onClick={() => {
                                                                        if(confirm('Are you sure you want to complete this order? The funds will be released to the freelancer.')) {
                                                                            router.post(`/orders/${order.id}/complete`);
                                                                        }
                                                                    }}
                                                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl transition-colors text-xs"
                                                                >
                                                                    Accept & Complete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No orders yet</h3>
                                        <p className="text-gray-500 mb-4">Browse services to get started!</p>
                                        <Link href="/gigs" className="inline-flex items-center px-6 py-2.5 bg-brand-600 text-white text-sm font-bold rounded-2xl hover:bg-brand-700 transition-colors">
                                            Browse Services
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
