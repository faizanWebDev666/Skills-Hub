import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import VendorNavbar from '../../components/VendorNavbar';
import VendorSidebar from '../../components/VendorSidebar';

export default function VendorSubscriptions({ user, subscription }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { flash } = usePage().props;
    const plans = [
        {
            id: 'starter',
            name: 'Starter Boost',
            price: '$29',
            subtitle: 'Perfect for new sellers',
            features: [
                'Featured gig placement for 7 days',
                'Priority buyer exposure',
                'Boosted search ranking',
            ],
        },
        {
            id: 'growth',
            name: 'Growth Accelerator',
            price: '$59',
            subtitle: 'Best value for growing sellers',
            features: [
                'Featured gig placement for 14 days',
                'High-priority customer matching',
                'Verified seller badge',
                'Dedicated support channel',
            ],
            featured: true,
        },
        {
            id: 'pro',
            name: 'Pro Seller',
            price: '$99',
            subtitle: 'For sellers who want premium demand',
            features: [
                'Featured placement for 30 days',
                'Priority buyer matching & alerts',
                'Premium account badge',
                'Custom gig review & optimization',
            ],
        },
    ];

    const getPlanIndex = (planId) => plans.findIndex(p => p.id === planId);
    
    const getButtonLabel = (planId) => {
        if (!subscription || !subscription.active) return 'Buy Now';
        if (subscription.plan === planId) return 'Current Plan';
        
        const currentIndex = getPlanIndex(subscription.plan);
        const newIndex = getPlanIndex(planId);
        
        return newIndex > currentIndex ? 'Upgrade' : 'Downgrade';
    };

    return (
        <div className="min-h-screen bg-cream-50">
            <VendorNavbar user={user} />

            <div className="flex">
                <VendorSidebar user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 min-w-0">
                    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                        {/* Flash Messages */}
                        {flash?.success && (
                            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-3.5 rounded-xl text-sm font-medium flex items-center gap-3">
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {flash.success}
                            </div>
                        )}
                        {flash?.error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-3.5 rounded-xl text-sm font-medium flex items-center gap-3">
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {flash.error}
                            </div>
                        )}

                        {/* Current Plan Banner */}
                        {subscription && subscription.active && (
                            <div className="mb-8 bg-brand-50 border border-brand-200 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-brand-900">
                                        Current Plan: {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                                    </h2>
                                    <p className="text-sm text-brand-700 mt-1">
                                        Active until {new Date(subscription.expires_at).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="px-4 py-2 bg-white rounded-full border border-brand-200 text-brand-700 font-semibold text-sm">
                                    Active Status
                                </div>
                            </div>
                        )}

                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.35em] text-brand-600 font-semibold mb-3">Subscription Plans</p>
                                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Sell faster with premium seller plans.</h1>
                                    <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-2xl">
                                        Choose the plan that helps you get more orders, greater visibility, and priority buyer connections on the marketplace.
                                    </p>
                                </div>
                                <Link
                                    href="/vendor/dashboard"
                                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
                                >
                                    Back to Dashboard
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {plans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className={`flex flex-col h-full rounded-[28px] border p-4 sm:p-6 shadow-sm transition-all duration-300 ${plan.featured ? 'border-brand-600 bg-white shadow-lg' : 'border-slate-200 bg-slate-50 hover:shadow-md'}`}
                                >
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div>
                                            <h2 className={`text-xl sm:text-2xl font-semibold ${plan.featured ? 'text-slate-900' : 'text-slate-900'}`}>{plan.name}</h2>
                                            <p className="text-xs sm:text-sm text-slate-500 mt-1">{plan.subtitle}</p>
                                        </div>
                                        {plan.featured && (
                                            <span className="inline-flex px-3 py-1 rounded-full bg-brand-600 text-white text-xs font-semibold uppercase tracking-[0.3em]">
                                                Most Popular
                                            </span>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">{plan.price}</div>
                                        <p className="text-xs sm:text-sm text-slate-500 mt-2">One-time upgrade for your gigs</p>
                                    </div>

                                    <div className="space-y-3 mb-4 flex-1">
                                        {plan.features.map((feature) => (
                                            <div key={feature} className="flex items-start gap-3">
                                                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white text-xs font-bold">✓</span>
                                                <p className="text-sm text-slate-600">{feature}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={async () => {
                                            const isUpgrading = subscription && subscription.active && getPlanIndex(plan.id) > getPlanIndex(subscription.plan);
                                            const actionText = subscription && subscription.active ? (isUpgrading ? 'upgrade to' : 'downgrade to') : 'subscribe to';
                                            if (!confirm(`Are you sure you want to ${actionText} ${plan.name} for ${plan.price}?`)) return;
                                            
                                            try {
                                                const response = await fetch(route('vendor.subscriptions.purchase'), {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                                                    },
                                                    body: JSON.stringify({ plan: plan.id }),
                                                });

                                                const data = await response.json();
                                                
                                                if (!response.ok) {
                                                    alert(data.error || 'Unable to initiate payment.');
                                                    return;
                                                }

                                                if (data.session_url) {
                                                    window.location.href = data.session_url;
                                                }
                                            } catch (error) {
                                                console.error('Checkout error:', error);
                                                alert('Payment failed to initialize.');
                                            }
                                        }}
                                        disabled={subscription && subscription.active && subscription.plan === plan.id}
                                        className={`mt-4 sm:mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${plan.featured ? 'bg-brand-600 text-white hover:bg-brand-700' : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-100'}`}
                                        aria-label={`${getButtonLabel(plan.id)} ${plan.name}`}
                                    >
                                        {getButtonLabel(plan.id)}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">Why upgrade?</h3>
                                    <p className="mt-3 text-sm text-slate-600">Subscriptions help your gigs stand out, capture buyer attention faster, and increase your order volume through priority placement and buyer matching.</p>
                                </div>
                                <div>
                                    <div className="space-y-4">
                                        <div className="rounded-3xl bg-cream-100 p-5">
                                            <p className="text-sm font-semibold text-slate-900">Featured Listing</p>
                                            <p className="text-sm text-slate-600 mt-2">Your gigs appear above non-subscribed offers in search and category feeds.</p>
                                        </div>
                                        <div className="rounded-3xl bg-cream-100 p-5">
                                            <p className="text-sm font-semibold text-slate-900">Priority Matching</p>
                                            <p className="text-sm text-slate-600 mt-2">Receive faster buyer requests through our dedicated vendor matching system.</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="space-y-4">
                                        <div className="rounded-3xl bg-cream-100 p-5">
                                            <p className="text-sm font-semibold text-slate-900">Verified Support</p>
                                            <p className="text-sm text-slate-600 mt-2">Enjoy priority access to vendor support and faster approval for gig updates.</p>
                                        </div>
                                        <div className="rounded-3xl bg-cream-100 p-5">
                                            <p className="text-sm font-semibold text-slate-900">Higher Trust</p>
                                            <p className="text-sm text-slate-600 mt-2">Show buyers you’re invested in growth with a premium seller badge.</p>
                                        </div>
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
