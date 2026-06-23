import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import AdminSidebar from "../../../components/AdminSidebar";

export default function Wallets({ wallets, filters }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { flash } = usePage().props;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-cream-50">
            <AdminNavbar />
            <div className="flex">
                <AdminSidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                <main className="flex-1 min-w-0">
                    <div className="px-4 sm:px-6 lg:px-8 py-8">
                        {flash?.success && (
                            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-3.5 rounded-lg text-sm font-medium flex items-center gap-3">
                                <svg
                                    className="w-5 h-5 shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {flash.success}
                            </div>
                        )}

                        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Wallets
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    Search and manage user wallet balances.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    placeholder="Search user name or email"
                                    value={filters.search || ""}
                                    onChange={(e) =>
                                        router.get(
                                            "/admin/wallet/wallets",
                                            {
                                                ...filters,
                                                search: e.target.value,
                                            },
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                            },
                                        )
                                    }
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
                                />
                                <select
                                    value={filters.order || "desc"}
                                    onChange={(e) =>
                                        router.get(
                                            "/admin/wallet/wallets",
                                            {
                                                ...filters,
                                                order: e.target.value,
                                            },
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                            },
                                        )
                                    }
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
                                >
                                    <option value="desc">
                                        Highest balance
                                    </option>
                                    <option value="asc">Lowest balance</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Balance
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {wallets.data.map((wallet) => (
                                            <tr
                                                key={wallet.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {wallet.user?.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {wallet.user?.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                    {formatCurrency(
                                                        wallet.balance,
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        href={`/admin/wallet/users/${wallet.user_id}`}
                                                        className="text-brand-600 hover:text-brand-700"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
