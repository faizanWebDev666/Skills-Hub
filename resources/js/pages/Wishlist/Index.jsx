import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import Navbar from '../../components/Navbar';

export default function Index({ wishlistItems }) {
    const { auth } = usePage().props;

    const handleRemove = (gigId) => {
        router.post(`/wishlist/${gigId}/toggle`, {}, {
            preserveScroll: true,
        });
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB]">
            <Navbar user={auth.user} />

            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 lg:px-8 py-10 lg:py-16">
                    <div className="max-w-3xl">
                        <nav className="flex mb-4 text-sm font-medium text-gray-500" aria-label="Breadcrumb">
                            <ol className="flex items-center space-x-2">
                                <li><Link href="/home" className="hover:text-brand-600 transition-colors">Home</Link></li>
                                <li className="flex items-center space-x-2">
                                    <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" /></svg>
                                    <span className="text-gray-900">Wishlist</span>
                                </li>
                            </ol>
                        </nav>
                        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
                            Your <span className="text-brand-600">Wishlist</span>
                        </h1>
                        <p className="text-lg text-gray-500 font-medium leading-relaxed">
                            Keep track of the services you love. Compare options and book when you're ready.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
                {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                        {wishlistItems.map((item) => (
                            <div key={item.id} className="group bg-white rounded-[32px] border border-gray-100 overflow-hidden hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col h-full">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    {item.gig.image ? (
                                        <img src={`/storage/${item.gig.image}`} alt={item.gig.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-brand-500 to-brand-700 group-hover:scale-110 transition-transform duration-700"></div>
                                    )}
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
                                    
                                    <button 
                                        onClick={() => handleRemove(item.gig.id)}
                                        className="absolute top-4 right-4 w-12 h-12 bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center text-red-500 shadow-xl hover:bg-white hover:scale-110 active:scale-95 transition-all duration-300 group/btn z-10"
                                        title="Remove from wishlist"
                                    >
                                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>

                                    {item.gig.category && (
                                        <div className="absolute bottom-4 left-4 z-10">
                                            <span className="bg-white/95 backdrop-blur-md text-gray-900 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] shadow-lg">
                                                {item.gig.category.replace('_', ' ')}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 lg:p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-600 font-black text-sm border border-gray-100">
                                            {item.gig.user?.name?.charAt(0) || 'S'}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-900 text-sm truncate">{item.gig.user?.name || 'Service Provider'}</p>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Top Rated Seller</p>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-gray-900 text-lg lg:text-xl mb-6 line-clamp-2 leading-[1.4] group-hover:text-brand-600 transition-colors min-h-[56px]">
                                        {item.gig.title}
                                    </h3>

                                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.1em] mb-1">Price starts at</p>
                                            <p className="text-2xl font-black text-gray-900 leading-none">
                                                ${Math.floor(item.gig.price)}
                                                <span className="text-sm text-gray-400 font-bold">.{(item.gig.price % 1).toFixed(2).substring(2)}</span>
                                            </p>
                                        </div>
                                        <Link
                                            href={`/gigs/${item.gig.id}`}
                                            className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white text-sm font-bold rounded-2xl hover:bg-brand-600 hover:shadow-[0_8px_20px_-4px_rgba(var(--brand-600-rgb),0.3)] transform hover:-translate-y-0.5 transition-all duration-300"
                                        >
                                            Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto text-center py-20 lg:py-32 px-6 bg-white rounded-[48px] border border-gray-100 shadow-[0_48px_96px_-32px_rgba(0,0,0,0.04)]">
                        <div className="relative inline-block mb-10">
                            <div className="absolute inset-0 bg-brand-100 rounded-full blur-3xl opacity-50 scale-150"></div>
                            <span className="relative text-[120px] leading-none select-none">💎</span>
                        </div>
                        <h3 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6 tracking-tight">Your collection is empty</h3>
                        <p className="text-gray-500 mb-12 text-lg font-medium leading-relaxed max-w-md mx-auto">
                            Start building your dream team. Explore our top-tier services and save your favorites here.
                        </p>
                        <Link
                            href="/gigs"
                            className="inline-flex items-center gap-3 bg-brand-600 text-white px-10 py-5 rounded-[24px] font-black text-lg hover:bg-gray-900 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.15)] transform hover:-translate-y-1 transition-all duration-500 group"
                        >
                            <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Explore Services
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
