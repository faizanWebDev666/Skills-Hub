import React from 'react';
import { useForm } from '@inertiajs/react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function VerifyEmailCode({ email }) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register/verify');
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
            <Navbar />

            <div className="flex-grow flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),_transparent_20%)] pointer-events-none"></div>
                <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/assets/bg.png')" }}></div>
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>

                <div className="relative z-10 w-full max-w-md px-4 py-8">
                    <div className="rounded-[32px] border border-white/10 bg-slate-900/95 p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl">
                        <div className="text-center mb-6 sm:mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white">Verify Your Email</h2>
                            <p className="mt-2 text-sm sm:text-base text-slate-300">
                                We've sent an 8-digit verification code to <strong>{email}</strong>.
                            </p>
                        </div>

                        {errors.error && (
                            <div className="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm">
                                {errors.error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                            <div>
                                <label htmlFor="code" className="block text-sm font-medium text-slate-200">
                                    8-Digit Code
                                </label>
                                <input
                                    id="code"
                                    type="text"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    className="mt-1 block w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 text-center tracking-[0.5em] font-mono text-xl"
                                    placeholder="00000000"
                                    maxLength="8"
                                    required
                                />
                                {errors.code && (
                                    <p className="mt-2 text-sm text-rose-400">{errors.code}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Verifying...' : 'Verify & Complete Registration'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
