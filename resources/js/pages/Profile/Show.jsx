import React, { useState, useRef } from 'react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import Navbar from '../../components/Navbar';
import CustomerSidebar from '../../components/CustomerSidebar';

const StarRating = ({ name = "rating" }) => {
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    return (
        <div className="flex items-center gap-1">
            <input type="hidden" name={name} value={rating} />
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="focus:outline-none"
                >
                    <svg className={`w-8 h-8 transition-colors ${(hover || rating) >= star ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </button>
            ))}
        </div>
    );
};

export default function ProfileShow({ user, stats, orders, pendingReviews, submittedReviews }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);
    const { flash } = usePage().props;

    const [confirmReviewModal, setConfirmReviewModal] = useState(null);
    const [confirmCompleteModal, setConfirmCompleteModal] = useState(null);
    const [orderFilter, setOrderFilter] = useState('all');

    const safeDate = (dateString) => {
        if (!dateString) return '';
        const d = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
        return new Date(d).toLocaleDateString();
    };

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

    const handleReviewSubmit = (e, orderId) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        setConfirmReviewModal({
            orderId,
            rating: formData.get('rating'),
            comment: formData.get('comment'),
            formTarget: e.target
        });
    };

    const confirmReview = () => {
        if (!confirmReviewModal) return;
        const { orderId, rating, comment, formTarget } = confirmReviewModal;
        router.post(`/orders/${orderId}/reviews`, {
            rating,
            comment,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                formTarget.reset();
                setConfirmReviewModal(null);
            }
        });
    };

    const confirmCompleteOrder = () => {
        if (!confirmCompleteModal) return;
        router.post(`/orders/${confirmCompleteModal}/complete`, {}, {
            preserveScroll: true,
            onSuccess: () => setConfirmCompleteModal(null)
        });
    };

    const filteredOrders = orders?.filter(order => {
        if (orderFilter === 'all') return true;
        return order.status === orderFilter;
    }) || [];

    return (
        <div className="min-h-screen bg-cream-50">
            <Navbar user={user} />

            <div className="flex items-start">
                <CustomerSidebar 
                    user={user} 
                    sidebarOpen={sidebarOpen} 
                    setSidebarOpen={setSidebarOpen} 
                    activeSection={activeTab}
                    onSectionChange={setActiveTab}
                />

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
                                    { id: 'reviews', label: 'Pending Reviews' },
                                    { id: 'my_reviews', label: 'My Reviews' },
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
                                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <h2 className="text-lg font-bold text-gray-900">My Orders</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {['all', 'pending_payment', 'pending', 'in_progress', 'delivered', 'completed', 'cancelled'].map(status => (
                                            <button
                                                key={status}
                                                onClick={() => setOrderFilter(status)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                                    orderFilter === status 
                                                        ? 'bg-brand-600 text-white' 
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            >
                                                {status === 'all' ? 'All Orders' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {filteredOrders && filteredOrders.length > 0 ? (
                                    <div className="space-y-4">
                                        {filteredOrders.map((order) => (
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
                                                                    onClick={() => setConfirmCompleteModal(order.id)}
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

                        {/* Pending Reviews Section */}
                        {activeTab === 'reviews' && (
                            <div className="bg-white rounded-b-3xl shadow-sm border border-t-0 border-gray-200 p-6 sm:p-8">
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-gray-900">Pending Reviews</h2>
                                </div>
                                {pendingReviews && pendingReviews.length > 0 ? (
                                    <div className="space-y-6">
                                        {pendingReviews.map((order) => (
                                            <div key={order.id} className="p-5 border border-gray-200 rounded-2xl">
                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-cream-100 flex items-center justify-center shrink-0">
                                                        {order.gig?.image ? (
                                                            <img src={`/storage/${order.gig.image}`} alt={order.gig.title} className="w-full h-full rounded-2xl object-cover" />
                                                        ) : (
                                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800">{order.gig?.title || 'Service'}</h3>
                                                        <p className="text-sm text-gray-500">
                                                            Freelancer: {order.freelancer?.name} • Completed {new Date(order.completed_at || order.updated_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <form onSubmit={(e) => handleReviewSubmit(e, order.id)} className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                                                        <StarRating name="rating" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Review Comment</label>
                                                        <textarea 
                                                            name="comment" 
                                                            rows="3" 
                                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm resize-none" 
                                                            placeholder="Write your experience with this freelancer... (optional)"
                                                        ></textarea>
                                                    </div>
                                                    <button type="submit" className="px-6 py-2.5 bg-brand-600 text-white font-bold text-sm rounded-xl hover:bg-brand-700 transition-colors shadow-sm">
                                                        Submit Review
                                                    </button>
                                                </form>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No pending reviews</h3>
                                        <p className="text-gray-500 mb-4">You have reviewed all your completed orders.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* My Reviews Section */}
                        {activeTab === 'my_reviews' && (
                            <div className="bg-white rounded-b-3xl shadow-sm border border-t-0 border-gray-200 p-6 sm:p-8">
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-gray-900">My Reviews</h2>
                                </div>
                                {submittedReviews && submittedReviews.length > 0 ? (
                                    <div className="space-y-4">
                                        {submittedReviews.map((review) => (
                                            <div key={review.id} className="p-5 border border-gray-200 rounded-2xl bg-slate-50/50">
                                                <div className="flex items-start gap-4 mb-3">
                                                    <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
                                                        {review.order?.gig?.image ? (
                                                            <img src={`/storage/${review.order.gig.image}`} alt={review.order.gig.title} className="w-full h-full rounded-xl object-cover" />
                                                        ) : (
                                                            <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800 text-sm">{review.order?.gig?.title || 'Service'}</h3>
                                                        <p className="text-xs text-gray-500">
                                                            Freelancer: {review.reviewee?.name} • Reviewed on {safeDate(review.created_at)}
                                                        </p>
                                                    </div>
                                                    <div className="ml-auto flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-sm">
                                                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        <span className="text-sm font-bold text-gray-700">{review.rating}.0</span>
                                                    </div>
                                                </div>
                                                {review.comment && (
                                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mt-3">
                                                        <p className="text-sm text-gray-600 italic">"{review.comment}"</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                        </svg>
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No reviews yet</h3>
                                        <p className="text-gray-500 mb-4">You haven't submitted any reviews.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Confirmation Modal for Review */}
            {confirmReviewModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Submit Review</h3>
                        <p className="text-gray-500 text-center mb-8">
                            Are you sure you want to submit this review? It cannot be changed later.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setConfirmReviewModal(null)}
                                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmReview}
                                className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-amber-500/30"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal for Complete Order */}
            {confirmCompleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Accept & Complete Order</h3>
                        <p className="text-gray-500 text-center mb-8">
                            Are you sure you want to complete this order? The funds will be released to the freelancer. This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setConfirmCompleteModal(null)}
                                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmCompleteOrder}
                                className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-500/30"
                            >
                                Yes, Complete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
