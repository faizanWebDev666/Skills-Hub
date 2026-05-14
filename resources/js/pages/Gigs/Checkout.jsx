import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import Navbar from '../../components/Navbar';
import { ChevronRight, ShieldCheck, CreditCard } from 'lucide-react';

export default function Checkout({ gig, user }) {
    const { flash } = usePage().props;
    const [requirements, setRequirements] = useState('');
    const [processingOrder, setProcessingOrder] = useState(false);

    const handleOrderSubmit = (e) => {
        e.preventDefault();
        
        setProcessingOrder(true);
        router.post(`/gigs/${gig.id}/order`, { requirements }, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setProcessingOrder(false),
        });
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-brand-500/30">
            <Navbar user={user} />

            {flash?.error && (
                <div className="container mx-auto px-4 lg:px-8 py-4">
                    <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium">
                        {flash.error}
                    </div>
                </div>
            )}

            {/* Breadcrumbs */}
            <div className="border-b border-gray-200 bg-white">
                <div className="container mx-auto px-4 lg:px-8 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <Link href="/home" className="hover:text-brand-600 transition-colors">Home</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <Link href="/gigs" className="hover:text-brand-600 transition-colors">Services</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <Link href={`/gigs/${gig.id}`} className="hover:text-brand-600 transition-colors">{gig.title}</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-gray-900">Checkout</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Secure Checkout</h1>
                    
                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Left Column - Order Form */}
                        <div className="flex-1 space-y-8">
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">1. Order Requirements</h2>
                                <p className="text-gray-600 mb-6">
                                    Please provide detailed requirements to help the seller understand exactly what you need.
                                </p>
                                
                                <form id="checkout-form" onSubmit={handleOrderSubmit}>
                                    <textarea
                                        value={requirements}
                                        onChange={(e) => setRequirements(e.target.value)}
                                        rows={6}
                                        required
                                        className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all text-sm text-gray-900 bg-gray-50/50"
                                        placeholder="Describe your project, attach relevant links, and specify any preferences..."
                                    />
                                </form>
                            </div>
                            
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">2. Payment Method</h2>
                                <div className="p-4 border-2 border-brand-500 bg-brand-50 rounded-2xl flex items-center gap-4 cursor-pointer">
                                    <div className="w-6 h-6 rounded-full border-[6px] border-brand-500 bg-white"></div>
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="w-6 h-6 text-brand-600" />
                                        <span className="font-bold text-gray-900">Pay Securely with Stripe</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-4">
                                    You will be redirected to Stripe to complete your payment securely.
                                </p>
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <aside className="lg:w-[400px] flex-shrink-0">
                            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-8 sticky top-8">
                                <h3 className="font-bold text-gray-900 text-xl mb-6">Order Summary</h3>
                                
                                <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                        {gig.image ? (
                                            <img src={`/storage/${gig.image}`} alt={gig.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-brand-50 flex items-center justify-center">
                                                <span className="text-brand-300 font-bold">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm line-clamp-2 mb-1">{gig.title}</h4>
                                        <p className="text-xs text-gray-500 font-medium">By {gig.user?.name}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Service Fee</span>
                                        <span className="font-medium text-gray-900">${gig.price}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Processing Fee</span>
                                        <span className="font-medium text-gray-900">$0.00</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-8 pt-6 border-t border-gray-100">
                                    <span className="font-bold text-gray-900 text-lg">Total</span>
                                    <span className="font-black text-brand-600 text-2xl">${gig.price}</span>
                                </div>

                                <button
                                    form="checkout-form"
                                    type="submit"
                                    disabled={processingOrder}
                                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {processingOrder ? 'Processing...' : 'Confirm Purchase'}
                                </button>
                                
                                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 font-medium">
                                    <ShieldCheck className="w-4 h-4 text-green-500" />
                                    SSL Secure Payment
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
}
