import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';

export default function WishlistDrawer({ isOpen, onClose }) {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchWishlist();
        }
    }, [isOpen]);

    const fetchWishlist = async () => {
        setLoading(true);
        try {
            const response = await fetch('/wishlist/items', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setWishlistItems(data);
            } else {
                console.error('Failed to fetch wishlist, status:', response.status);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = (gigId) => {
        router.post(`/wishlist/${gigId}/toggle`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setWishlistItems(prev => prev.filter(item => item.gig_id !== gigId));
            }
        });
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300"
                    onClick={onClose}
                ></div>
            )}

            {/* Drawer */}
            <div 
                className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[70] transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header block with dark background */}
                <div className="bg-[#1e3a4c] text-white p-6 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-wider mb-1 font-sans">My Wishlist</h2>
                        <p className="text-gray-300 font-sans text-sm">View your wishlist</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 border border-white/30 rounded flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <h3 className="text-xl font-bold mb-6 font-sans">My Wishlist</h3>
                    
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                        </div>
                    ) : wishlistItems.length > 0 ? (
                        <div className="space-y-4">
                            {wishlistItems.map((item) => (
                                <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-center">
                                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                        <img 
                                            src={item.gig.image ? `/storage/${item.gig.image}` : 'https://placehold.co/400x300?text=No+Image'} 
                                            alt={item.gig.title} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/gigs/${item.gig.id}`}>
                                            <h4 className="font-bold text-gray-900 truncate font-sans">{item.gig.title}</h4>
                                        </Link>
                                        <div className="text-gray-900 font-bold mt-1">${item.gig.price}</div>
                                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                                            <svg className="w-4 h-4 text-red-500 fill-current" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                            </svg>
                                            <span>3 loved</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleRemove(item.gig.id)}
                                        className="text-gray-400 hover:text-red-500 text-sm flex items-center gap-1 transition-colors ml-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-white border border-gray-200 rounded-xl">
                            <div className="text-gray-400 mb-3">
                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Your wishlist is empty</h3>
                            <p className="text-gray-500 text-sm">Save items you like to view them later.</p>
                            <Link href="/gigs" onClick={onClose} className="mt-4 inline-block bg-brand-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors">
                                Browse Gigs
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
