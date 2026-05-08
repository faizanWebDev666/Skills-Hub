import React, { useState, useRef } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
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

    const roleLabel = user?.roles?.[0]?.name
        ? user.roles[0].name.charAt(0).toUpperCase() + user.roles[0].name.slice(1)
        : 'Member';

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />

            <div className="flex">
                <CustomerSidebar
                    user={user}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    activeSection={activeTab}
                    onSectionChange={handleSectionChange}
                />

                <main className="flex-1 min-w-0">
                    <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-5xl">
                        {/* Success Flash */}
                        {flash?.success && (
                            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-3.5 rounded-lg text-sm font-medium flex items-center gap-3">
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {flash.success}
                            </div>
                        )}

                        {/* Profile Header */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
                            {/* Banner */}
                            <div className="h-28 sm:h-36 bg-gradient-to-r  relative">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=')] opacity-30"></div>
                            </div>

                            {/* Profile Info */}
                            <div className="px-6 sm:px-8 pb-6">
                                <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-10 sm:-mt-12">
                                    {/* Avatar */}
                                    <div className="relative">
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-brand-600 flex items-center justify-center">
                                            {user?.avatar ? (
                                                <img
                                                    src={avatarPreview || `/storage/${user.avatar}`}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-2xl sm:text-3xl font-bold text-white">
                                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
                                            title="Change photo"
                                        >
                                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
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

                                    {/* Name & Meta */}
                                    <div className="flex-1 pt-1 sm:pb-0.5">
                                        <div className="flex items-center gap-3">
                                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{user?.name}</h1>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-brand-50 text-brand-700 text-xs font-semibold">
                                                {roleLabel}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-gray-500">
                                            <span className="inline-flex items-center gap-1.5">
                                                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                {user?.email}
                                            </span>
                                            {user?.location && (
                                                <span className="inline-flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {user.location}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 sm:mb-0.5">
                                        {user?.avatar && (
                                            <button
                                                onClick={handleRemoveAvatar}
                                                className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
                                            >
                                                Remove photo
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                                    <p className="text-xs text-gray-500">Total Orders</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-brand-600">{stats?.activeOrders || 0}</p>
                                    <p className="text-xs text-gray-500">Active</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-green-600">{stats?.completedOrders || 0}</p>
                                    <p className="text-xs text-gray-500">Completed</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-amber-600">${stats?.totalSpent?.toLocaleString() || '0'}</p>
                                    <p className="text-xs text-gray-500">Total Spent</p>
                                </div>
                            </div>
                        </div>

                        {/* Fiverr-style Tabs */}
                        <div className="mb-0">
                            <div className="flex border-b border-gray-200 gap-0">
                                {[
                                    { id: 'profile', label: 'Profile Info' },
                                    { id: 'password', label: 'Password & Security' },
                                    { id: 'orders', label: 'Orders' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-5 py-3.5 text-sm font-semibold transition-all border-b-2 -mb-px ${
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

                        {/* Tab Content */}
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 p-6 sm:p-8">
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                                    <p className="text-sm text-gray-500 mt-0.5">Update your personal details</p>
                                </div>
                                <form onSubmit={handleProfileSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                                            <input
                                                type="text"
                                                value={profileForm.data.name}
                                                onChange={(e) => profileForm.setData('name', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all text-sm text-gray-900 placeholder-gray-400"
                                                placeholder="Your full name"
                                            />
                                            {profileForm.errors.name && <p className="mt-1 text-xs text-red-600">{profileForm.errors.name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                                            <input
                                                type="email"
                                                value={profileForm.data.email}
                                                onChange={(e) => profileForm.setData('email', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all text-sm text-gray-900 placeholder-gray-400"
                                                placeholder="your@email.com"
                                            />
                                            {profileForm.errors.email && <p className="mt-1 text-xs text-red-600">{profileForm.errors.email}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={profileForm.data.phone}
                                                onChange={(e) => profileForm.setData('phone', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all text-sm text-gray-900 placeholder-gray-400"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                            {profileForm.errors.phone && <p className="mt-1 text-xs text-red-600">{profileForm.errors.phone}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                                            <input
                                                type="text"
                                                value={profileForm.data.location}
                                                onChange={(e) => profileForm.setData('location', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all text-sm text-gray-900 placeholder-gray-400"
                                                placeholder="City, Country"
                                            />
                                            {profileForm.errors.location && <p className="mt-1 text-xs text-red-600">{profileForm.errors.location}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                                        <textarea
                                            value={profileForm.data.bio}
                                            onChange={(e) => profileForm.setData('bio', e.target.value)}
                                            rows={4}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all text-sm text-gray-900 resize-none placeholder-gray-400"
                                            placeholder="Tell us about yourself..."
                                        />
                                        <div className="flex justify-between mt-1">
                                            <p className="text-xs text-gray-400">{profileForm.data.bio?.length || 0}/1000 characters</p>
                                            {profileForm.errors.bio && <p className="text-xs text-red-600">{profileForm.errors.bio}</p>}
                                        </div>
                                    </div>

                                    <div className="pt-2 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={profileForm.processing}
                                            className="px-8 py-2.5 bg-brand-600 text-white text-sm font-bold rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50"
                                        >
                                            {profileForm.processing ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'password' && (
                            <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 p-6 sm:p-8">
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-gray-900">Password & Security</h2>
                                    <p className="text-sm text-gray-500 mt-0.5">Keep your account secure with a strong password</p>
                                </div>

                                <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-lg">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                                        <input
                                            type="password"
                                            value={passwordForm.data.current_password}
                                            onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all text-sm text-gray-900 placeholder-gray-400"
                                            placeholder="Enter current password"
                                        />
                                        {passwordForm.errors.current_password && <p className="mt-1 text-xs text-red-600">{passwordForm.errors.current_password}</p>}
                                    </div>

                                    <div className="border-t border-gray-100 pt-5">
                                        <div className="mb-5">
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                                            <input
                                                type="password"
                                                value={passwordForm.data.password}
                                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all text-sm text-gray-900 placeholder-gray-400"
                                                placeholder="Enter new password"
                                            />
                                            {passwordForm.errors.password && <p className="mt-1 text-xs text-red-600">{passwordForm.errors.password}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={passwordForm.data.password_confirmation}
                                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all text-sm text-gray-900 placeholder-gray-400"
                                                placeholder="Confirm new password"
                                            />
                                            {passwordForm.errors.password_confirmation && <p className="mt-1 text-xs text-red-600">{passwordForm.errors.password_confirmation}</p>}
                                        </div>
                                    </div>

                                    <div className="pt-2 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={passwordForm.processing}
                                            className="px-8 py-2.5 bg-brand-600 text-white text-sm font-bold rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50"
                                        >
                                            {passwordForm.processing ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 p-6 sm:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                                        <p className="text-sm text-gray-500 mt-0.5">Track and manage your service orders</p>
                                    </div>
                                    <Link href="/gigs" className="text-sm text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1">
                                        Browse Services
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>

                                {recentOrders?.length > 0 ? (
                                    <div className="overflow-hidden">
                                        {/* Table Header */}
                                        <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                            <div className="col-span-5">Service</div>
                                            <div className="col-span-2">Status</div>
                                            <div className="col-span-2">Freelancer</div>
                                            <div className="col-span-2 text-right">Amount</div>
                                            <div className="col-span-1 text-right">Date</div>
                                        </div>

                                        {/* Order Rows */}
                                        <div className="divide-y divide-gray-50">
                                            {recentOrders.map((order) => (
                                                <div key={order.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-4 py-4 hover:bg-gray-50 transition-colors items-center">
                                                    <div className="sm:col-span-5">
                                                        <p className="font-semibold text-gray-900 text-sm">{order.gig?.title || 'Service'}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5">Order #{order.id}</p>
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                                                            order.status === 'completed' ? 'bg-green-50 text-green-700' :
                                                            order.status === 'in_progress' ? 'bg-brand-50 text-brand-700' :
                                                            order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                                                            'bg-amber-50 text-amber-700'
                                                        }`}>
                                                            {order.status?.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    <div className="sm:col-span-2 text-sm text-gray-600">
                                                        {order.freelancer?.name || '—'}
                                                    </div>
                                                    <div className="sm:col-span-2 text-right">
                                                        <p className="font-bold text-gray-900 text-sm">${Number(order.amount).toLocaleString()}</p>
                                                    </div>
                                                    <div className="sm:col-span-1 text-right text-xs text-gray-400">
                                                        {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-600 font-semibold">No orders yet</p>
                                        <p className="text-sm text-gray-400 mt-1">Start ordering services from our talented freelancers</p>
                                        <Link href="/gigs" className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white text-sm font-bold rounded-lg hover:bg-brand-700 transition-colors">
                                            Browse Services
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
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
