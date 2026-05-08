import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import Navbar from '../../components/Navbar';

export default function Show({ gig, user, isInWishlist = false }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [quantity, setQuantity] = useState(1);

    const handleWishlistToggle = () => {
        if (!user) {
            router.get('/login');
            return;
        }

        router.post(`/wishlist/${gig.id}/toggle`, {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const packageTabs = [
        { id: 'basic', name: 'Basic', price: gig.price, description: 'Essential package' },
        { id: 'standard', name: 'Standard', price: gig.price * 1.5, description: 'Standard package' },
        { id: 'premium', name: 'Premium', price: gig.price * 2.5, description: 'Premium package' },
    ];

    const reviews = [
        { id: 1, user: 'Jane Smith', rating: 5, comment: 'Excellent work! Very professional and delivered on time.', date: '2 weeks ago' },
        { id: 2, user: 'Mike Johnson', rating: 5, comment: 'Great communication and high-quality work. Highly recommend!', date: '1 month ago' },
        { id: 3, user: 'Sarah Williams', rating: 4, comment: 'Good service, would work with them again.', date: '2 months ago' },
    ];

    return (
        <div className="min-h-screen bg-cream-50">
            <Navbar user={user} />

            <div className="bg-cream-100 border-b border-cream-300">
                <div className="container mx-auto px-4 lg:px-8 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/home" className="hover:text-brand-600 transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/gigs" className="hover:text-brand-600 transition-colors">Services</Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">{gig.title}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                        <div className="rounded-2xl h-80 lg:h-[500px] mb-8 overflow-hidden">
                            {gig.image ? (
                                <img src={`/storage/${gig.image}`} alt={gig.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600"></div>
                            )}
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold text-xl ring-4 ring-white shadow-lg">
                                {gig.user?.name?.charAt(0) || 'S'}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-lg">{gig.user?.name || 'Service Provider'}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-brand-500">✓</span>
                                    <span className="text-sm text-gray-500">Level 2 Seller</span>
                                </div>
                            </div>
                        </div>

                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">{gig.title}</h1>

                        <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-500 text-xl">★</span>
                                <span className="font-bold text-gray-900">4.9</span>
                                <span className="text-gray-500">({reviews.length} reviews)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400">👥</span>
                                <span className="text-gray-700">{Math.floor(Math.random() * 500) + 100} orders</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400">⏱️</span>
                                <span className="text-gray-700">3 Days Delivery</span>
                            </div>
                        </div>

                        <div className="flex gap-8 mb-8 border-b border-gray-200">
                            {['overview', 'about-the-seller', 'reviews'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 font-semibold transition-all ${
                                        activeTab === tab
                                            ? 'text-brand-600 border-b-2 border-brand-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'overview' && (
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Service</h2>
                                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {gig.description}
                                </div>
                            </div>
                        )}

                        {activeTab === 'about-the-seller' && (
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">About the Seller</h2>
                                <div className="flex items-start gap-6 p-6 bg-cream-100 rounded-2xl">
                                    <div className="w-20 h-20 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold text-3xl ring-4 ring-white shadow-lg">
                                        {gig.user?.name?.charAt(0) || 'S'}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{gig.user?.name || 'Service Provider'}</h3>
                                        <p className="text-gray-600 mb-4">Passionate about delivering high-quality work and helping clients achieve their goals.</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-gray-900">4.9</p>
                                                <p className="text-sm text-gray-500">Rating</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
                                                <p className="text-sm text-gray-500">Reviews</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-gray-900">{Math.floor(Math.random() * 500) + 100}</p>
                                                <p className="text-sm text-gray-500">Orders</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-gray-900">2+</p>
                                                <p className="text-sm text-gray-500">Years on Platform</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Reviews</h2>
                                <div className="space-y-6">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="p-6 bg-cream-100 rounded-2xl">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-cream-300 rounded-full flex items-center justify-center text-gray-700 font-bold">
                                                        {review.user.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{review.user}</p>
                                                        <p className="text-sm text-gray-500">{review.date}</p>
                                                    </div>
                                                </div>
                                                <div className="flex text-yellow-500">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-700">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <aside className="lg:w-96 flex-shrink-0">
                        <div className="sticky top-24">
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-baseline justify-between mb-6">
                                        <div>
                                            <p className="text-sm text-gray-500">From</p>
                                            <p className="text-4xl font-bold text-gray-900">${gig.price}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-500">★</span>
                                            <span className="font-semibold text-gray-900">4.9</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        {packageTabs.map((pkg) => (
                                            <button
                                                key={pkg.id}
                                                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                                    pkg.id === 'basic'
                                                        ? 'border-brand-500 bg-brand-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold text-gray-900">{pkg.name}</span>
                                                    <span className="font-bold text-gray-900">${pkg.price}</span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">{pkg.description}</p>
                                            </button>
                                        ))}
                                    </div>

                                    <button className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-xl transition-colors mb-4">
                                        Continue
                                    </button>

                                    <button 
                                        onClick={handleWishlistToggle}
                                        className={`w-full font-bold py-4 rounded-xl border transition-colors flex items-center justify-center gap-2 ${
                                            isInWishlist 
                                                ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                                                : 'bg-white border-cream-300 text-gray-700 hover:bg-cream-100'
                                        }`}
                                    >
                                        <svg 
                                            className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        {isInWishlist ? 'Saved' : 'Save'}
                                    </button>

                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <span className="text-brand-500">✓</span>
                                                <span>3 Days Delivery</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <span className="text-brand-500">✓</span>
                                                <span>Unlimited Revisions</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <span className="text-brand-500">✓</span>
                                                <span>100% Satisfaction Guaranteed</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
