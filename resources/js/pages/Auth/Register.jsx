import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SocialLogin from '../../components/SocialLogin';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'customer',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
            <Navbar />

            <div className="flex-grow relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),_transparent_20%)] pointer-events-none"></div>
                <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/assets/bg.png')" }}></div>
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:py-12 lg:py-16 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:gap-10 lg:grid-cols-[1.3fr_1fr] items-center">
                        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl order-2 lg:order-1">
                            <div className="max-w-xl">
                                <span className="inline-flex items-center rounded-full bg-brand-500/10 px-3 py-1 text-sm font-semibold text-brand-100 mb-4 sm:mb-6">
                                    Professional freelance marketplace
                                </span>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                                    Start hiring or selling services with confidence.
                                </h1>
                                <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-slate-300">
                                    Whether you want to source expert work or grow your service business, our platform connects customers and freelancers with fast, secure, and reliable transactions.
                                </p>

                                <div className="mt-6 sm:mt-10 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
                                    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 sm:p-6">
                                        <div className="text-2xl sm:text-3xl">👥</div>
                                        <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-white">Hire talent</h3>
                                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-400">Find trusted professionals for every project.</p>
                                    </div>
                                    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 sm:p-6">
                                        <div className="text-2xl sm:text-3xl">💼</div>
                                        <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-white">Offer services</h3>
                                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-400">Showcase skills, set your rates, and earn more.</p>
                                    </div>
                                    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 sm:p-6">
                                        <div className="text-2xl sm:text-3xl">📈</div>
                                        <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-white">Grow faster</h3>
                                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-400">Scale your work with customers who value quality.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[32px] border border-white/10 bg-slate-900/95 p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl order-1 lg:order-2">
                            <div className="text-center mb-6 sm:mb-8">
                                <h2 className="text-2xl sm:text-3xl font-bold text-white">Create Account</h2>
                                <p className="mt-2 text-sm sm:text-base text-slate-300">Sign up and start using the marketplace today.</p>
                            </div>

                            <SocialLogin />

                            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 mt-6 sm:mt-8">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-200">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
                                        placeholder="John Doe"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-rose-400">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-200">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1 block w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
                                        placeholder="you@example.com"
                                        required
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-rose-400">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-slate-200">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="mt-1 block w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
                                        placeholder="••••••••"
                                        required
                                    />
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-rose-400">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-slate-200">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="mt-1 block w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-200 mb-3">
                                        I want to join as
                                    </label>
                                    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                                        <label className={`flex cursor-pointer items-center rounded-2xl border p-4 transition ${data.role === 'customer' ? 'border-brand-500 bg-brand-500/10' : 'border-slate-700 bg-slate-950/80 hover:border-slate-500'}`}>
                                            <input
                                                type="radio"
                                                name="role"
                                                value="customer"
                                                checked={data.role === 'customer'}
                                                onChange={(e) => setData('role', e.target.value)}
                                                className="mr-3 h-4 w-4 text-brand-500"
                                            />
                                            <div>
                                                <div className="font-semibold text-white">Customer</div>
                                                <div className="text-sm text-slate-400">Hire services</div>
                                            </div>
                                        </label>
                                        <label className={`flex cursor-pointer items-center rounded-2xl border p-4 transition ${data.role === 'freelancer' ? 'border-brand-500 bg-brand-500/10' : 'border-slate-700 bg-slate-950/80 hover:border-slate-500'}`}>
                                            <input
                                                type="radio"
                                                name="role"
                                                value="freelancer"
                                                checked={data.role === 'freelancer'}
                                                onChange={(e) => setData('role', e.target.value)}
                                                className="mr-3 h-4 w-4 text-brand-500"
                                            />
                                            <div>
                                                <div className="font-semibold text-white">Freelancer</div>
                                                <div className="text-sm text-slate-400">Offer services</div>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? 'Creating account...' : 'Create Account'}
                                </button>
                            </form>

                            <div className="mt-6 sm:mt-8 text-center text-slate-400">
                                <p className="text-sm">
                                    Already have an account?{' '}
                                    <a href="/login" className="font-semibold text-white hover:text-brand-300">
                                        Sign in
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
