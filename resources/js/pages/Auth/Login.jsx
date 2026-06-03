import React, { useState, useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SocialLogin from "../../components/SocialLogin";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });
    const { flash = {} } = usePage().props || {};
    const [lockedUntil, setLockedUntil] = useState(flash.lockedUntil || null);
    const [lockedEmail, setLockedEmail] = useState(flash.lockedEmail || "");

    useEffect(() => {
        setLockedUntil(flash.lockedUntil || null);
        setLockedEmail(flash.lockedEmail || "");
    }, [flash.lockedUntil, flash.lockedEmail]);

    const isEmailLocked = lockedUntil && lockedEmail && lockedEmail === data.email;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEmailLocked) {
            return;
        }
        post("/login");
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
            <Navbar />

            <div className="flex-grow relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.22),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.16),_transparent_20%)] pointer-events-none"></div>
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30"
                    style={{ backgroundImage: "url('/assets/bg.png')" }}
                ></div>
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:py-12 lg:py-16 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:gap-10 lg:grid-cols-[1.4fr_1fr] items-center">
                        <div className="rounded-[32px] border border-slate-200/50 bg-slate-100/90 p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl order-2 lg:order-1">
                            <div className="max-w-2xl">
                                <span className="inline-flex items-center rounded-full bg-brand-500/10 px-3 py-1 text-sm font-semibold text-brand-700 mb-4 sm:mb-6">
                                    Secure marketplace access
                                </span>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950">
                                    Welcome back to SkillHub.
                                </h1>
                                <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-slate-600">
                                    Access your projects, manage orders, and
                                    connect with top service providers
                                    instantly. Sign in to continue where you
                                    left off.
                                </p>

                                <div className="mt-6 sm:mt-10 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
                                    <div className="rounded-3xl border border-slate-200/70 bg-white/95 p-4 sm:p-6">
                                        <div className="text-2xl sm:text-3xl">
                                            ⚡
                                        </div>
                                        <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-slate-950">
                                            Fast login
                                        </h3>
                                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-500">
                                            Secure access in just a few clicks.
                                        </p>
                                    </div>
                                    <div className="rounded-3xl border border-slate-200/70 bg-white/95 p-4 sm:p-6">
                                        <div className="text-2xl sm:text-3xl">
                                            🔒
                                        </div>
                                        <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-slate-950">
                                            Trusted security
                                        </h3>
                                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-500">
                                            Keep your account and payments
                                            protected.
                                        </p>
                                    </div>
                                    <div className="rounded-3xl border border-slate-200/70 bg-white/95 p-4 sm:p-6">
                                        <div className="text-2xl sm:text-3xl">
                                            📱
                                        </div>
                                        <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-slate-950">
                                            Responsive
                                        </h3>
                                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-500">
                                            Works beautifully on desktop and
                                            mobile.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[32px] border border-white/10 bg-slate-900/95 p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl order-1 lg:order-2">
                            <div className="text-center mb-6 sm:mb-8">
                                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                                    Welcome Back
                                </h2>
                                <p className="mt-2 text-sm sm:text-base text-slate-300">
                                    Sign in to your account
                                </p>
                            </div>

                            <SocialLogin />

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5 sm:space-y-6 mt-6 sm:mt-8"
                            >
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-slate-200"
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
                                        placeholder="you@example.com"
                                        required
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-rose-400">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-slate-200"
                                    >
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
                                        placeholder="••••••••"
                                        required
                                    />
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-rose-400">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <label className="flex items-center gap-2 text-sm text-slate-300">
                                        <input
                                            id="remember"
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    "remember",
                                                    e.target.checked,
                                                )
                                            }
                                            className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-brand-500 focus:ring-brand-500"
                                        />
                                        Remember me
                                    </label>
                                    <a
                                        href="/forgot-password"
                                        className="text-sm font-semibold text-brand-300 hover:text-brand-100"
                                    >
                                        Forgot password?
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || isEmailLocked}
                                    className="w-full rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing
                                        ? "Signing in..."
                                        : isEmailLocked
                                        ? "Locked"
                                        : "Sign In"}
                                </button>
                                {isEmailLocked && lockedUntil && (
                                    <p className="mt-3 text-sm text-rose-400">
                                        This email is locked until {new Date(lockedUntil).toLocaleString()}.
                                    </p>
                                )}
                            </form>

                            <div className="mt-6 sm:mt-8 text-center text-slate-400">
                                <p className="text-sm">
                                    Don&apos;t have an account?{" "}
                                    <a
                                        href="/register"
                                        className="font-semibold text-white hover:text-brand-300"
                                    >
                                        Sign up
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
