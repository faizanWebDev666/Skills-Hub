import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SocialLogin from "../../components/SocialLogin";

export default function ResetPassword({ email, token }) {
    const { data, setData, post, processing, errors } = useForm({
        email: email || "",
        token: token || "",
        password: "",
        password_confirmation: "",
    });

    const [clientError, setClientError] = useState('');

    const validatePassword = (pwd) => {
        if (!pwd || pwd.length < 8) return 'Password must be at least 8 characters.';
        if (!/[A-Z]/.test(pwd)) return 'Password must include at least one uppercase letter.';
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return 'Password must include at least one special character.';
        return '';
    };

    const submit = (e) => {
        e.preventDefault();
        const err = validatePassword(data.password);
        if (err) {
            setClientError(err);
            return;
        }
        if (data.password !== data.password_confirmation) {
            setClientError('Passwords do not match.');
            return;
        }
        setClientError('');
        post("/password/reset");
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
                                    Reset password
                                </span>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950">
                                    Set a new password
                                </h1>
                                <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-slate-600">
                                    Choose a strong password to keep your
                                    account secure. The link expires in 10
                                    minutes.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-[32px] border border-white/10 bg-slate-900/95 p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl order-1 lg:order-2">
                            <div className="text-center mb-6 sm:mb-8">
                                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                                    Reset Password
                                </h2>
                                <p className="mt-2 text-sm sm:text-base text-slate-300">
                                    Enter your new password below.
                                </p>
                            </div>

                            <form
                                onSubmit={submit}
                                className="space-y-5 sm:space-y-6 mt-6 sm:mt-8"
                            >
                                <input
                                    type="hidden"
                                    name="token"
                                    value={data.token}
                                />
                                <input
                                    type="hidden"
                                    name="email"
                                    value={data.email}
                                />

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-slate-200"
                                    >
                                        New Password
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
                                        minLength={8}
                                    />
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-rose-400">
                                            {errors.password}
                                        </p>
                                    )}
                                    {clientError && (
                                        <p className="mt-2 text-sm text-rose-400">
                                            {clientError}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="password_confirmation"
                                        className="block text-sm font-medium text-slate-200"
                                    >
                                        Confirm Password
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing
                                        ? "Resetting..."
                                        : "Reset Password"}
                                </button>

                                <div className="mt-6 sm:mt-8 text-center text-slate-400">
                                    <p className="text-sm">
                                        Back to{" "}
                                        <a
                                            href="/login"
                                            className="font-semibold text-white hover:text-brand-300"
                                        >
                                            Sign in
                                        </a>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
