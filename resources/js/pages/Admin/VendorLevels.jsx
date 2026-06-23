import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import SearchFilters from "../../components/SearchFilters";
import Modal from "../../components/Modal";

export default function VendorLevels({ vendors, user, sidebarLinks }) {
    const { flash, filters, categories, levelCriteria } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [vendorList, setVendorList] = useState(vendors?.data || []);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState("success");
    const [processing, setProcessing] = useState(false);

    const vendorLevelsSearchFields = [
        {
            type: "search",
            name: "search",
            label: "vendor name or email",
            placeholder: "Search vendor name or email...",
        },
        {
            type: "select",
            name: "category",
            label: "categories",
            placeholder: "All categories",
            options: (categories || []).map((cat) => ({ label: cat, value: cat })),
        },
    ];

    const handleLevelChange = async (vendorId, level) => {
        setProcessing(true);
        try {
            const response = await fetch(`/admin/vendor-levels/${vendorId}`, {
                method: "PUT",
                credentials: 'same-origin',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN":
                        document.querySelector('meta[name="csrf-token"]')
                            ?.content || "",
                },
                body: JSON.stringify({ vendor_level: level }),
            });

            if (response.ok) {
                setVendorList((current) =>
                    current.map((vendor) => {
                        if (vendor.id === vendorId) {
                            return { ...vendor, vendor_level: level };
                        }
                        return vendor;
                    }),
                );
                setModalType("success");
                setModalMessage("Vendor level updated successfully!");
                setModalOpen(true);
            } else {
                let message = 'Unable to update vendor level.';
                if (response.status === 419) {
                    message = 'CSRF token mismatch. Please refresh the page.';
                } else if (response.status === 401 || response.status === 403) {
                    message = 'Authentication error. Please login again.';
                } else {
                    const errorData = await response.json().catch(() => null);
                    if (errorData) {
                        if (errorData.message) message = errorData.message;
                        else if (errorData.errors) message = Object.values(errorData.errors).flat().join(' ');
                    }
                }
                setModalType("error");
                setModalMessage(message);
                setModalOpen(true);
            }
        } catch (error) {
            setModalType("error");
            setModalMessage("An unexpected error occurred. Please try again.");
            setModalOpen(true);
        } finally {
            setProcessing(false);
        }
    };

    const handleApplySuggestions = async () => {
        setProcessing(true);
        try {
            const vendorsToUpdate = vendorList.filter(vendor => (vendor.vendor_level || 1) !== vendor.suggested_level);

            if (vendorsToUpdate.length === 0) {
                setModalType("success");
                setModalMessage("All vendors are already at the suggested level!");
                setModalOpen(true);
                return;
            }

            // Update all vendors that need it
            for (const vendor of vendorsToUpdate) {
                await fetch(`/admin/vendor-levels/${vendor.id}`, {
                    method: "PUT",
                    credentials: 'same-origin',
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                        "X-CSRF-TOKEN":
                            document.querySelector('meta[name="csrf-token"]')
                                ?.content || "",
                    },
                    body: JSON.stringify({ vendor_level: vendor.suggested_level }),
                });

                // Update local state
                setVendorList(prev => prev.map(v =>
                    v.id === vendor.id ? { ...v, vendor_level: vendor.suggested_level } : v
                ));
            }

            setModalType("success");
            setModalMessage(`Updated ${vendorsToUpdate.length} vendor(s) to their suggested levels!`);
            setModalOpen(true);
        } catch (error) {
            setModalType("error");
            setModalMessage("An unexpected error occurred while applying suggestions.");
            setModalOpen(true);
        } finally {
            setProcessing(false);
        }
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
                        <Modal
                            isOpen={modalOpen}
                            onClose={() => setModalOpen(false)}
                            title={modalType === "error" ? "Error" : "Success"}
                            message={modalMessage}
                            type={modalType}
                            showCancel={false}
                        />
                        <div className="mb-8">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                                Vendor Levels
                            </h1>
                            <p className="text-gray-500 mt-1 text-sm">
                                Control vendor levels and display the correct level on gig pages.
                            </p>

                            {/* Criteria Card */}
                            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Level Criteria</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {Object.entries(levelCriteria).map(([level, criteria]) => (
                                        <div key={level} className="bg-gray-50 rounded-xl p-4">
                                            <h4 className="font-bold text-brand-600 mb-3">Level {level}</h4>
                                            <div className="space-y-2 text-sm text-gray-700">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500">Min Orders:</span>
                                                    <span className="font-semibold">{criteria.minOrders}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500">Min Reviews:</span>
                                                    <span className="font-semibold">{criteria.minReviews}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500">Min Rating:</span>
                                                    <span className="font-semibold">{criteria.minRating.toFixed(1)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex gap-3">
                                    <Link
                                        href="/admin/settings#vendor-levels"
                                        className="inline-flex items-center justify-center rounded-xl bg-brand-50 text-brand-700 px-4 py-2 text-sm font-semibold hover:bg-brand-100 transition-colors"
                                    >
                                        Edit Criteria
                                    </Link>
                                </div>
                            </div>

                            {/* Search & Actions */}
                            <div className="mt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                <SearchFilters
                                    filters={filters}
                                    searchFields={vendorLevelsSearchFields}
                                    onSubmit={(formFilters) => {
                                        const params = new URLSearchParams();
                                        Object.entries(formFilters).forEach(([key, value]) => {
                                            if (value) params.set(key, value);
                                        });
                                        window.location.href = `/admin/vendor-levels?${params.toString()}`;
                                    }}
                                />

                                {vendorList.some(vendor => (vendor.vendor_level || 1) !== vendor.suggested_level) && (
                                    <button
                                        onClick={handleApplySuggestions}
                                        disabled={processing}
                                        className="rounded-xl bg-success-600 text-white px-4 py-2 text-sm font-semibold hover:bg-success-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {processing ? 'Applying...' : 'Apply All Suggestions'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {flash?.success && (
                            <div className="mb-6 rounded-2xl bg-success-50 border border-success-200 p-4 text-success-700">
                                {flash.success}
                            </div>
                        )}
                        {flash?.error && (
                            <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-700">
                                {flash.error}
                            </div>
                        )}

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-gray-500 border-b">
                                            <th className="pb-3 font-medium">Vendor</th>
                                            <th className="pb-3 font-medium">Category</th>
                                            <th className="pb-3 font-medium">Completed Orders</th>
                                            <th className="pb-3 font-medium">Reviews</th>
                                            <th className="pb-3 font-medium">Avg Rating</th>
                                            <th className="pb-3 font-medium">Current Level</th>
                                            <th className="pb-3 font-medium">Suggested Level</th>
                                            <th className="pb-3 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vendorList.map((vendor) => {
                                            const currentLevel = vendor.vendor_level || 1;
                                            const suggestedLevel = vendor.suggested_level || 1;
                                            const needsLevelChange = currentLevel !== suggestedLevel;

                                            return (
                                                <tr
                                                    key={vendor.id}
                                                    className={`border-b border-gray-100 hover:bg-gray-50 ${needsLevelChange ? 'bg-yellow-50' : ''}`}
                                                >
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-brand-600 text-white grid place-items-center font-bold">
                                                                {vendor.name?.charAt(0) || "V"}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{vendor.name}</p>
                                                                <p className="text-xs text-gray-500">{vendor.email}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    Joined {new Date(vendor.created_at).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 text-gray-900 font-medium">
                                                        {vendor.service_type || vendor.primary_category || "Uncategorized"}
                                                    </td>
                                                    <td className="py-4 text-gray-900 font-bold">
                                                        {vendor.completed_orders_count ?? 0}
                                                    </td>
                                                    <td className="py-4 text-gray-900 font-bold">
                                                        {vendor.reviews_count ?? 0}
                                                    </td>
                                                    <td className="py-4 text-gray-900 font-bold">
                                                        {vendor.avg_rating ? Number(vendor.avg_rating).toFixed(1) : "—"}
                                                    </td>
                                                    <td className="py-4">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                                                            Level {currentLevel}
                                                        </span>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="flex flex-col gap-2">
                                                            <span className={`font-bold ${needsLevelChange ? 'text-yellow-700' : 'text-gray-900'}`}>
                                                                Level {suggestedLevel}
                                                            </span>
                                                            {needsLevelChange && (
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
                                                                        Update Available
                                                                    </span>
                                                                    {suggestedLevel > currentLevel && (
                                                                        <span className="text-xs text-green-600 font-semibold">
                                                                            ↑ Upgrade
                                                                        </span>
                                                                    )}
                                                                    {suggestedLevel < currentLevel && (
                                                                        <span className="text-xs text-orange-600 font-semibold">
                                                                            ↓ Downgrade
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="flex gap-2">
                                                            <select
                                                                defaultValue={vendor.vendor_level || 1}
                                                                onChange={(e) =>
                                                                    handleLevelChange(vendor.id, Number(e.target.value))
                                                                }
                                                                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                                                            >
                                                                {[1, 2, 3, 4].map((level) => (
                                                                    <option key={level} value={level}>{`Level ${level}`}</option>
                                                                ))}
                                                            </select>
                                                            {needsLevelChange && (
                                                                <button
                                                                    onClick={() => handleLevelChange(vendor.id, suggestedLevel)}
                                                                    className="rounded-xl bg-brand-600 text-white px-3 py-2 text-sm font-semibold hover:bg-brand-700 transition-colors"
                                                                >
                                                                    Apply
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                                <p>{vendors?.total ?? vendorList.length} vendors found.</p>
                                <div className="space-x-2">
                                    {vendors?.links?.map((link, index) =>
                                        link.url ? (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className={`px-3 py-1 rounded ${link.active ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-700"}`}
                                            />
                                        ) : (
                                            <span
                                                key={index}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className="px-3 py-1 text-gray-400"
                                            />
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
