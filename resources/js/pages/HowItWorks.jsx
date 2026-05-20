import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function HowItWorks({ user }) {
    return (
        <div className="min-h-screen flex flex-col bg-cream-50">
            <Head title="How It Works" />
            <Navbar user={user} />

            <main className="flex-1">
                <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-slate-950 to-slate-900 text-white py-20 sm:py-24">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_40%)]"></div>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <p className="text-sm uppercase tracking-[0.35em] text-brand-300 mb-4">Getting started</p>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-5 leading-tight">
                                How it works
                            </h1>
                            <p className="mx-auto max-w-3xl text-base sm:text-lg md:text-xl text-slate-200 leading-relaxed">
                                Multi Venter connects buyers and service providers with a seamless marketplace experience. Learn how to hire talent, sell your skills, and complete work securely from start to finish.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                                <a href="/gigs" className="inline-flex items-center justify-center rounded-full bg-white text-slate-950 px-6 py-3 text-sm font-semibold shadow-lg shadow-slate-900/10 hover:bg-slate-100 transition-colors">
                                    Browse Services
                                </a>
                                <a href="/register" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 text-white px-6 py-3 text-sm font-semibold hover:bg-white/20 transition-colors">
                                    Start Selling
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 sm:py-20 lg:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                            <div>
                                <p className="text-sm uppercase tracking-[0.35em] text-brand-600 mb-4">Marketplace flow</p>
                                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                                    Build trust and get results in three simple steps.
                                </h2>
                                <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                                    Whether you are hiring a freelancer or selling your services, Multi Venter makes the process intuitive, secure, and fast. From posting a project to delivery, every step is designed to keep your work moving forward.
                                </p>
                            </div>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="rounded-3xl bg-white border border-cream-200 p-6 shadow-sm">
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 text-white text-xl font-bold mb-4">
                                        1
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Find the right fit</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Search curated gigs, filter by category, and review seller ratings so you can choose the best expert for your project.
                                    </p>
                                </div>
                                <div className="rounded-3xl bg-white border border-cream-200 p-6 shadow-sm">
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-800 text-white text-xl font-bold mb-4">
                                        2
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Communicate clearly</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Use built-in messaging to discuss requirements, ask questions, and confirm timelines before you buy.
                                    </p>
                                </div>
                                <div className="rounded-3xl bg-white border border-cream-200 p-6 shadow-sm">
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 text-white text-xl font-bold mb-4">
                                        3
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Secure payment</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Pay through our secure checkout and keep funds safe until the work is delivered and approved.
                                    </p>
                                </div>
                                <div className="rounded-3xl bg-white border border-cream-200 p-6 shadow-sm">
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 text-white text-xl font-bold mb-4">
                                        4
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Receive delivery</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Receive work, request revisions, and complete the order when you are fully satisfied with the final deliverable.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 sm:py-20 lg:py-24 bg-cream-100">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-14">
                            <p className="text-sm uppercase tracking-[0.35em] text-brand-600 mb-4">Why choose us</p>
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Designed for buyers and sellers</h2>
                            <p className="text-base text-slate-600 leading-relaxed">
                                We combine fast discovery, trusted profiles, and payment protections so both buyers and sellers can grow with confidence.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="rounded-3xl bg-white border border-cream-200 p-6 shadow-sm">
                                <h3 className="text-xl font-semibold text-slate-900 mb-3">Verified talent</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Every seller is rated and reviewed, so you can trust service quality before you buy.
                                </p>
                            </div>
                            <div className="rounded-3xl bg-white border border-cream-200 p-6 shadow-sm">
                                <h3 className="text-xl font-semibold text-slate-900 mb-3">Simplified workflow</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Manage conversations, orders and payouts from one central marketplace dashboard.
                                </p>
                            </div>
                            <div className="rounded-3xl bg-white border border-cream-200 p-6 shadow-sm">
                                <h3 className="text-xl font-semibold text-slate-900 mb-3">Fast results</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Launch projects quickly with prebuilt service listings and expert support from vetted sellers.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 sm:py-20 lg:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10 bg-brand-950 rounded-3xl p-10 sm:p-12 lg:p-16 text-white">
                            <div className="max-w-3xl">
                                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to start?</h2>
                                <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
                                    Explore services, connect with skilled professionals, and grow your business with confidence on Multi Venter.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a href="/gigs" className="inline-flex items-center justify-center rounded-full bg-white text-slate-950 px-6 py-3 text-sm font-semibold hover:bg-slate-100 transition-colors">
                                    Explore Services
                                </a>
                                <a href="/register" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 text-white px-6 py-3 text-sm font-semibold hover:bg-white/20 transition-colors">
                                    Join as Seller
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
