import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

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
        <div className="min-h-screen flex flex-col">
            <Navbar />
            
            <div className="flex-grow flex items-center justify-center py-12 px-4 relative">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/assets/bg.png')" }}></div>
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                <div className="max-w-md w-full bg-cream-50/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 relative z-10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                        <p className="text-gray-600 mt-2">Join our marketplace today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                placeholder="John Doe"
                                required
                            />
                            {errors.name && (
                                <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                placeholder="you@example.com"
                                required
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                placeholder="••••••••"
                                required
                            />
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                I want to join as
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-brand-500 transition-colors">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="customer"
                                        checked={data.role === 'customer'}
                                        onChange={(e) => setData('role', e.target.value)}
                                        className="mr-3 h-4 w-4 text-brand-600 focus:ring-brand-500"
                                    />
                                    <div>
                                        <div className="font-semibold text-gray-900">Customer</div>
                                        <div className="text-sm text-gray-500">Hire services</div>
                                    </div>
                                </label>
                                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-brand-500 transition-colors">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="freelancer"
                                        checked={data.role === 'freelancer'}
                                        onChange={(e) => setData('role', e.target.value)}
                                        className="mr-3 h-4 w-4 text-brand-600 focus:ring-brand-500"
                                    />
                                    <div>
                                        <div className="font-semibold text-gray-900">Freelancer</div>
                                        <div className="text-sm text-gray-500">Offer services</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-brand-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50"
                        >
                            {processing ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <a href="/login" className="text-brand-600 font-semibold hover:text-brand-700">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
