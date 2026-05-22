import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";
import { Star, ArrowLeft } from "lucide-react";

export default function VendorReviews({ vendor, reviews, user, sidebarLinks }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const reviewsList = Array.isArray(reviews?.data)
        ? reviews.data.filter(Boolean)
        : Array.isArray(reviews)
          ? reviews.filter(Boolean)
          : [];

    const [showModal, setShowModal] = useState(false);

    const handleToggleStatus = () => {
        setShowModal(true);
    };

    const executeToggle = () => {
        router.post(
            `/admin/reviews/${vendor.uuid}/toggle-status`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => setShowModal(false),
            },
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const formattedString = dateString.endsWith("Z")
            ? dateString
            : `${dateString}Z`;
        const date = new Date(formattedString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const avgRating = Number(vendor.average_rating || 0).toFixed(1);

    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-brand-500/30">
            <Navbar user={user} />

            <div className="flex">
                <AdminSidebar
                    user={user}
                    sidebarLinks={sidebarLinks}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                <main className="flex-1 min-w-0">
                    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/admin/reviews"
                                    className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Link>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                                        {vendor.name}'s Reviews
                                    </h1>
                                    <p className="text-gray-500 mt-1 text-sm">
                                        Detailed feedback and gig performance
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleToggleStatus}
                                className={`px-4 py-2 font-bold rounded-xl transition-colors shadow-sm ${
                                    vendor.banned_at
                                        ? "bg-success-600 text-white hover:bg-success-700"
                                        : "bg-danger-600 text-white hover:bg-danger-700"
                                }`}
                            >
                                {vendor.banned_at
                                    ? "Activate Vendor"
                                    : "Deactivate Vendor"}
                            </button>
                        </div>

                        {/* Vendor Stats Header */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="w-14 h-14 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600">
                                    <Star className="w-6 h-6 fill-brand-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                        Average Rating
                                    </p>
                                    <p className="text-2xl font-black text-gray-900">
                                        {avgRating}{" "}
                                        <span className="text-base font-medium text-gray-500">
                                            ({vendor.total_reviews} reviews)
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="w-14 h-14 bg-success-100 rounded-xl flex items-center justify-center text-success-600">
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                        Delivered Orders
                                    </p>
                                    <p className="text-2xl font-black text-gray-900">
                                        {vendor.delivered_orders_count || 0}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div
                                    className={`w-14 h-14 rounded-xl flex items-center justify-center ${vendor.banned_at ? "bg-danger-100 text-danger-600" : "bg-success-100 text-success-600"}`}
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        {vendor.banned_at ? (
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        ) : (
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                                            />
                                        )}
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                        Account Status
                                    </p>
                                    <p
                                        className={`text-2xl font-black ${vendor.banned_at ? "text-danger-600" : "text-success-600"}`}
                                    >
                                        {vendor.banned_at
                                            ? "Deactivated"
                                            : "Active"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Reviews List */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900">
                                    Review History
                                </h2>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {reviewsList.length > 0 ? (
                                    reviewsList.map((review) => (
                                        <div
                                            key={review.id}
                                            className="p-6 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-bold text-gray-900">
                                                            {review.reviewer
                                                                ?.name ||
                                                                "Unknown User"}
                                                        </span>
                                                        <span className="text-gray-400 text-sm">
                                                            •
                                                        </span>
                                                        <span className="text-sm text-gray-500 font-medium">
                                                            {formatDate(
                                                                review.created_at,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <Link
                                                        href={`/gigs/${review.order?.gig?.uuid}`}
                                                        className="text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline"
                                                    >
                                                        Service:{" "}
                                                        {review.order?.gig
                                                            ?.title ||
                                                            "Unknown Service"}
                                                    </Link>
                                                </div>
                                                <div className="flex text-amber-400 shrink-0">
                                                    {[...Array(5)].map(
                                                        (_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 ${i < review.rating ? "fill-amber-400" : "text-gray-200"}`}
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                "{review.comment}"
                                            </p>

                                            {review.reply && (
                                                <div className="mt-4 ml-6 p-4 bg-brand-50 border border-brand-100 rounded-xl relative">
                                                    <div className="absolute -left-6 top-6 w-4 h-px bg-brand-200"></div>
                                                    <div className="absolute -left-6 top-0 h-6 w-px bg-brand-200"></div>
                                                    <p className="text-sm font-bold text-brand-800 mb-1">
                                                        Vendor's Reply
                                                    </p>
                                                    <p className="text-gray-700 text-sm">
                                                        {review.reply}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center text-gray-500">
                                        <svg
                                            className="w-12 h-12 text-gray-300 mx-auto mb-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                            />
                                        </svg>
                                        <p className="font-medium">
                                            No reviews have been submitted for
                                            this vendor yet.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {reviews?.links && reviews.links.length > 3 && (
                                <div className="p-6 border-t border-gray-100 flex flex-wrap gap-1">
                                    {reviews.links.map((link, i) =>
                                        link.url ? (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                                className={`px-3 py-1 rounded-md text-sm ${link.active ? "bg-brand-600 text-white font-bold" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                                            />
                                        ) : (
                                            <span
                                                key={i}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                                className="px-3 py-1 text-sm text-gray-400"
                                            />
                                        ),
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Confirm{" "}
                                {vendor?.banned_at
                                    ? "Activation"
                                    : "Deactivation"}
                            </h3>
                            <p className="text-gray-600">
                                Are you sure you want to{" "}
                                {vendor?.banned_at ? "activate" : "deactivate"}{" "}
                                the vendor <strong>{vendor?.name}</strong>?
                                {!vendor?.banned_at &&
                                    " They will no longer be able to log in or receive new orders."}
                            </p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeToggle}
                                className={`px-4 py-2 text-sm font-bold text-white rounded-xl transition-colors ${
                                    vendor?.banned_at
                                        ? "bg-success-600 hover:bg-success-700"
                                        : "bg-danger-600 hover:bg-danger-700"
                                }`}
                            >
                                Yes,{" "}
                                {vendor?.banned_at ? "Activate" : "Deactivate"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
