import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";

export default function CommissionSettings({
    categoryCommissions,
    user,
    sidebarLinks,
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [formData, setFormData] = useState({
        categoryCommissions: categoryCommissions || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("/admin/settings/commissions", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN":
                    document.querySelector('meta[name="csrf-token"]')
                        ?.content || "",
            },
            body: JSON.stringify(formData),
        }).then(() => {
            alert("Commission settings updated successfully!");
        });
    };

    return (
        <div className="min-h-screen bg-cream-50">
            <AdminNavbar user={user} />

            <div className="flex">
                <AdminSidebar
                    user={user}
                    sidebarLinks={sidebarLinks}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                <main className="flex-1 min-w-0">
                    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                        <div className="mb-8">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                                Commission Settings
                            </h1>
                            <p className="text-gray-500 mt-1 text-sm">
                                Adjust commission percentages for each category.
                            </p>
                            <div className="mt-4">
                                <Link
                                    href="/admin/settings"
                                    className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-700 px-4 py-2 text-sm font-semibold hover:bg-gray-200"
                                >
                                    Back to General Settings
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {formData.categoryCommissions?.length > 0 ? (
                                    <div className="space-y-4">
                                        {formData.categoryCommissions.map(
                                            (commission, index) => (
                                                <div
                                                    key={commission.category}
                                                    className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                                                >
                                                    <span className="font-medium text-gray-900 capitalize">
                                                        {commission.category}
                                                    </span>
                                                    <input
                                                        type="number"
                                                        value={commission.percentage}
                                                        onChange={(e) => {
                                                            const newCommissions = [...formData.categoryCommissions];
                                                            newCommissions[index] = {
                                                                ...newCommissions[index],
                                                                percentage: parseFloat(e.target.value) || 0,
                                                            };
                                                            setFormData({
                                                                ...formData,
                                                                categoryCommissions: newCommissions,
                                                            });
                                                        }}
                                                        className="w-full md:col-span-2 px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                                                        step="0.1"
                                                    />
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        No categories found. Create a gig with a category to manage commissions.
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-brand-600 to-brand-800 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all mt-4"
                                >
                                    Save Commission Settings
                                </button>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
