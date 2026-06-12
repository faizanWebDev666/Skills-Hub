import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";

export default function Settings({
    generalSettings,
    categoryCommissions,
    vendorLevelSettings,
    user,
    sidebarLinks,
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("general");

    // Single form for all general + vendor level settings
    const settingsForm = useForm({
        siteName: generalSettings.siteName,
        commissionRate: generalSettings.commissionRate,
        minPayout: generalSettings.minPayout,
        maxGigPrice: generalSettings.maxGigPrice,
        minGigPrice: generalSettings.minGigPrice,
        vendorLevels: vendorLevelSettings,
    });

    const [commissions, setCommissions] = useState(categoryCommissions);
    const commissionForm = useForm({
        categoryCommissions: commissions,
    });

    const handleGeneralSubmit = (e) => {
        e.preventDefault();
        settingsForm.put(route("admin.settings.update"), {
            preserveScroll: true,
        });
    };

    const handleCommissionSubmit = (e) => {
        e.preventDefault();
        commissionForm.put(route("admin.settings.commissions.update"), {
            preserveScroll: true,
        });
    };

    const handleVendorLevelsSubmit = (e) => {
        e.preventDefault();
        settingsForm.put(route("admin.settings.update"), {
            preserveScroll: true,
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
                                Settings
                            </h1>
                            <p className="text-gray-500 mt-1 text-sm">
                                Configure your marketplace settings
                            </p>
                        </div>

                        {/* Tabs */}
                        <div className="mb-6 border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => setActiveTab("general")}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === "general"
                                            ? "border-brand-600 text-brand-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    General Settings
                                </button>
                                <button
                                    onClick={() => setActiveTab("commissions")}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === "commissions"
                                            ? "border-brand-600 text-brand-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    Commission Settings
                                </button>
                                <button
                                    onClick={() => setActiveTab("vendor-levels")}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === "vendor-levels"
                                            ? "border-brand-600 text-brand-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    Vendor Levels
                                </button>
                            </nav>
                        </div>

                        {/* Tab Content */}
                        {activeTab === "general" && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">
                                    General Settings
                                </h2>
                                <form onSubmit={handleGeneralSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Site Name
                                        </label>
                                        <input
                                            type="text"
                                            value={settingsForm.data.siteName}
                                            onChange={(e) =>
                                                settingsForm.setData("siteName", e.target.value)
                                            }
                                            placeholder="Enter site name"
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Default Commission Rate (%)
                                        </label>
                                        <input
                                            type="number"
                                            value={settingsForm.data.commissionRate}
                                            onChange={(e) =>
                                                settingsForm.setData(
                                                    "commissionRate",
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            placeholder="Enter default commission rate"
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                                            step="0.1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Minimum Payout ($)
                                        </label>
                                        <input
                                            type="number"
                                            value={settingsForm.data.minPayout}
                                            onChange={(e) =>
                                                settingsForm.setData(
                                                    "minPayout",
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            placeholder="Enter minimum payout"
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                                            step="0.01"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Minimum Gig Price ($)
                                        </label>
                                        <input
                                            type="number"
                                            value={settingsForm.data.minGigPrice}
                                            onChange={(e) =>
                                                settingsForm.setData(
                                                    "minGigPrice",
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            placeholder="Enter minimum gig price"
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                                            step="0.01"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Maximum Gig Price ($)
                                        </label>
                                        <input
                                            type="number"
                                            value={settingsForm.data.maxGigPrice}
                                            onChange={(e) =>
                                                settingsForm.setData(
                                                    "maxGigPrice",
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            placeholder="Enter maximum gig price"
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                                            step="0.01"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={settingsForm.processing}
                                        className="w-full bg-gradient-to-r from-brand-600 to-brand-800 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {settingsForm.processing ? "Saving..." : "Save General Settings"}
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === "commissions" && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">
                                    Category Commission Settings
                                </h2>
                                <form onSubmit={handleCommissionSubmit} className="space-y-4">
                                    {commissions?.length > 0 ? (
                                        <div className="space-y-4">
                                            {commissions.map((commission, index) => (
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
                                                            const newCommissions = [...commissions];
                                                            newCommissions[index] = {
                                                                ...newCommissions[index],
                                                                percentage: parseFloat(e.target.value) || 0,
                                                            };
                                                            setCommissions(newCommissions);
                                                            commissionForm.setData(
                                                                "categoryCommissions",
                                                                newCommissions
                                                            );
                                                        }}
                                                        className="w-full md:col-span-2 px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                                                        step="0.1"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            No categories found. Create a gig with a category to manage commissions.
                                        </p>
                                    )}

                                    {commissions?.length > 0 && (
                                        <button
                                            type="submit"
                                            disabled={commissionForm.processing}
                                            className="w-full bg-gradient-to-r from-brand-600 to-brand-800 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {commissionForm.processing
                                                ? "Saving..."
                                                : "Save Commission Settings"}
                                        </button>
                                    )}
                                </form>
                            </div>
                        )}

                        {activeTab === "vendor-levels" && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">
                                    Vendor Level Criteria
                                </h2>
                                <form onSubmit={handleVendorLevelsSubmit} className="space-y-8">
                                    {Object.entries(settingsForm.data.vendorLevels).map(([level, criteria]) => (
                                        <div key={level} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                                Level {level.charAt(5).toUpperCase() + level.slice(6)}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Min Orders Delivered
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={criteria.minOrders}
                                                        onChange={(e) => {
                                                            const newLevels = { ...settingsForm.data.vendorLevels };
                                                            newLevels[level].minOrders = parseInt(e.target.value) || 0;
                                                            settingsForm.setData("vendorLevels", newLevels);
                                                        }}
                                                        placeholder="Enter min orders"
                                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                                                        min="0"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Min Reviews
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={criteria.minReviews}
                                                        onChange={(e) => {
                                                            const newLevels = { ...settingsForm.data.vendorLevels };
                                                            newLevels[level].minReviews = parseInt(e.target.value) || 0;
                                                            settingsForm.setData("vendorLevels", newLevels);
                                                        }}
                                                        placeholder="Enter min reviews"
                                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                                                        min="0"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Min Average Rating
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={criteria.minRating}
                                                        onChange={(e) => {
                                                            const newLevels = { ...settingsForm.data.vendorLevels };
                                                            newLevels[level].minRating = parseFloat(e.target.value) || 0;
                                                            settingsForm.setData("vendorLevels", newLevels);
                                                        }}
                                                        placeholder="Enter min rating"
                                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                                                        min="0"
                                                        max="5"
                                                        step="0.1"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        type="submit"
                                        disabled={settingsForm.processing}
                                        className="w-full bg-gradient-to-r from-brand-600 to-brand-800 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {settingsForm.processing ? "Saving..." : "Save Vendor Level Settings"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
