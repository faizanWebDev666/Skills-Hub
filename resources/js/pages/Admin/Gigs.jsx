import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import SearchFilters from "../../components/SearchFilters";
import Pagination from "../../components/Pagination";
import Modal from "../../components/Modal";

export default function Gigs({
    gigs,
    categories,
    filters,
    user,
    sidebarLinks,
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState("list");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [selectedGig, setSelectedGig] = useState(null);
    const [modalProcessing, setModalProcessing] = useState(false);

    const searchFields = [
        {
            type: "search",
            name: "search",
            label: "gig title",
            placeholder: "Search by gig title...",
        },
        {
            type: "search",
            name: "seller",
            label: "seller name or email",
            placeholder: "Search by seller name or email...",
        },
        {
            type: "select",
            name: "category",
            label: "category",
            placeholder: "All categories",
            options: (categories || []).map((cat) => ({ label: cat, value: cat })),
        },
        {
            type: "select",
            name: "status",
            label: "status",
            placeholder: "All statuses",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
        },
    ];

    const handleFilterSubmit = (formFilters) => {
        const params = new URLSearchParams();

        Object.entries(formFilters).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            }
        });

        window.location.href = `/admin/gigs?${params.toString()}`;
    };

    const openConfirmModal = (gig, action) => {
        setSelectedGig(gig);
        setModalAction(action);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedGig(null);
        setModalAction(null);
        setModalProcessing(false);
    };

    const handleConfirmAction = async () => {
        if (!selectedGig || !modalAction) return;

        setModalProcessing(true);

        const url =
            modalAction === "delete"
                ? `/admin/gigs/${selectedGig.uuid}`
                : `/admin/gigs/${selectedGig.uuid}/toggle`;
        const method = modalAction === "delete" ? "DELETE" : "PATCH";

        const token = document.querySelector('meta[name="csrf-token"]')?.content || "";

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "X-CSRF-TOKEN": token,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Unable to complete action.");
            }

            window.location.reload();
        } catch (error) {
            console.error(error);
            setModalProcessing(false);
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

                <main className="flex-1 min-w-0" style={{ zoom: 0.78 }}>
                    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                        <Modal
                            isOpen={modalOpen}
                            onClose={closeModal}
                            title={
                                modalAction === "delete"
                                    ? "Confirm Delete"
                                    : selectedGig?.active
                                    ? "Confirm Deactivation"
                                    : "Confirm Activation"
                            }
                            message={
                                modalAction === "delete"
                                    ? `Are you sure you want to delete ${selectedGig?.title}? This cannot be undone.`
                                    : selectedGig?.active
                                    ? `Are you sure you want to deactivate ${selectedGig?.title}?`
                                    : `Are you sure you want to activate ${selectedGig?.title}?`
                            }
                            type={modalAction === "delete" ? "error" : "warning"}
                            confirmText={modalAction === "delete" ? "Delete" : selectedGig?.active ? "Deactivate" : "Activate"}
                            cancelText="Cancel"
                            onConfirm={handleConfirmAction}
                            showCancel={true}
                            isProcessing={modalProcessing}
                        />
                        <div className="mb-8">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                                Gigs Management
                            </h1>
                            <p className="text-gray-500 mt-1 text-sm">
                                Manage all gigs, filter by seller, category and status, and review performance.
                            </p>
                        </div>

                        <div className="mb-6 rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Filter Gigs</h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Search by gig title, seller, category, or active status.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                                        {gigs?.total ?? 0} gigs found
                                    </span>
                                    <span className="rounded-full bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-600">
                                        {gigs?.data?.filter((gig) => gig.active).length ?? 0} active
                                    </span>
                                    <span className="rounded-full bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-600">
                                        {gigs?.data?.filter((gig) => !gig.active).length ?? 0} inactive
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                <SearchFilters
                                    filters={filters}
                                    searchFields={searchFields}
                                    onSubmit={handleFilterSubmit}
                                />

                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="text-sm text-slate-600">
                                        Display mode:
                                        <button
                                            type="button"
                                            onClick={() => setViewMode("grid")}
                                            className={`ml-3 rounded-full px-4 py-2 text-sm font-semibold transition ${
                                                viewMode === "grid"
                                                    ? "bg-brand-600 text-white"
                                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                            }`}
                                        >
                                            Grid
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setViewMode("list")}
                                            className={`ml-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                                                viewMode === "list"
                                                    ? "bg-brand-600 text-white"
                                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                            }`}
                                        >
                                            List
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                                            {gigs?.total ?? 0} gigs found
                                        </span>
                                        <span className="rounded-full bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-600">
                                            {gigs?.data?.filter((gig) => gig.active).length ?? 0} active
                                        </span>
                                        <span className="rounded-full bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-600">
                                            {gigs?.data?.filter((gig) => !gig.active).length ?? 0} inactive
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {viewMode === "grid" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {gigs?.data?.map((gig) => (
                                    <Link
                                        key={gig.id}
                                        href={`/gigs/${gig.uuid}`}
                                        className="group block overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <div className="relative h-48 bg-gray-100">
                                            {gig.image ? (
                                                <img
                                                    src={`/storage/${gig.image}`}
                                                    alt={gig.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center bg-brand-100 text-white">
                                                    <span className="text-4xl">📦</span>
                                                </div>
                                            )}
                                            <span
                                                className={`absolute top-3 right-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                    gig.active
                                                        ? "bg-success-100 text-success-700"
                                                        : "bg-rose-100 text-rose-700"
                                                }`}
                                            >
                                                {gig.active ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-semibold text-lg text-slate-900 truncate">
                                                {gig.title}
                                            </h3>
                                            <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                                                {gig.description || "No description available."}
                                            </p>
                                            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
                                                <span>{gig.user?.name || "Unknown seller"}</span>
                                                <span className="font-semibold text-slate-900">
                                                    ${Number(gig.price).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                                <span>{gig.category || "Uncategorized"}</span>
                                                <span>•</span>
                                                <span>{new Date(gig.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="px-6 py-4 text-left font-semibold text-slate-700">Gig</th>
                                                <th className="px-6 py-4 text-left font-semibold text-slate-700">Seller</th>
                                                <th className="px-6 py-4 text-left font-semibold text-slate-700">Category</th>
                                                <th className="px-6 py-4 text-right font-semibold text-slate-700">Price</th>
                                                <th className="px-6 py-4 text-center font-semibold text-slate-700">Status</th>
                                                <th className="px-6 py-4 text-left font-semibold text-slate-700">Created</th>
                                                <th className="px-6 py-4 text-right font-semibold text-slate-700">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 bg-white">
                                            {gigs?.data?.map((gig) => (
                                                <tr key={gig.id} className="hover:bg-slate-50">
                                                    <td className="px-6 py-4 max-w-sm">
                                                        <Link
                                                            href={`/gigs/${gig.uuid}`}
                                                            className="block text-slate-900 font-semibold hover:text-brand-700"
                                                        >
                                                            {gig.title}
                                                        </Link>
                                                        <div className="text-xs text-gray-500 truncate">
                                                            {gig.description ?? "No description"}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-slate-900">{gig.user?.name || "Unknown"}</div>
                                                        <div className="text-xs text-gray-500">{gig.user?.email || "—"}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-900">{gig.category || "Uncategorized"}</td>
                                                    <td className="px-6 py-4 text-right font-semibold text-slate-900">
                                                        ${Number(gig.price).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                                gig.active
                                                                    ? "bg-success-100 text-success-700"
                                                                    : "bg-rose-100 text-rose-700"
                                                            }`}
                                                        >
                                                            {gig.active ? "Active" : "Inactive"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500">{new Date(gig.created_at).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 text-right space-x-2">
                                                        <button
                                                            onClick={() => openConfirmModal(gig, "toggle")}
                                                            className="inline-flex items-center rounded-xl bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-100"
                                                        >
                                                            {gig.active ? "Deactivate" : "Activate"}
                                                        </button>
                                                        <button
                                                            onClick={() => openConfirmModal(gig, "delete")}
                                                            className="inline-flex items-center rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <div className="mt-6">
                            <Pagination links={gigs?.links} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
