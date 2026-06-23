import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import Modal from "../../components/Modal";

export default function GigsTrash({
    gigs,
    categories,
    filters,
    user,
    sidebarLinks,
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [restoreModal, setRestoreModal] = useState({
        isOpen: false,
        gigUuid: null,
        gigTitle: "",
    });
    const [forceDeleteModal, setForceDeleteModal] = useState({
        isOpen: false,
        gigUuid: null,
        gigTitle: "",
    });
    const [processing, setProcessing] = useState(false);

    const handleRestore = async () => {
        if (!restoreModal.gigUuid) return;
        setProcessing(true);
        try {
            await fetch(`/admin/gigs/${restoreModal.gigUuid}/restore`, {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN":
                        document.querySelector('meta[name="csrf-token"]')
                            ?.content || "",
                },
            });
            window.location.reload();
        } catch (error) {
            console.error("Error restoring gig:", error);
        } finally {
            setProcessing(false);
            setRestoreModal({
                isOpen: false,
                gigUuid: null,
                gigTitle: "",
            });
        }
    };

    const handleForceDelete = async () => {
        if (!forceDeleteModal.gigUuid) return;
        setProcessing(true);
        try {
            await fetch(`/admin/gigs/${forceDeleteModal.gigUuid}/force`, {
                method: "DELETE",
                headers: {
                    "X-CSRF-TOKEN":
                        document.querySelector('meta[name="csrf-token"]')
                            ?.content || "",
                },
            });
            window.location.reload();
        } catch (error) {
            console.error("Error permanently deleting gig:", error);
        } finally {
            setProcessing(false);
            setForceDeleteModal({
                isOpen: false,
                gigUuid: null,
                gigTitle: "",
            });
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
                            isOpen={restoreModal.isOpen}
                            onClose={() =>
                                setRestoreModal({
                                    isOpen: false,
                                    gigUuid: null,
                                    gigTitle: "",
                                })
                            }
                            title="Restore Gig"
                            message={`Are you sure you want to restore gig "${restoreModal.gigTitle}"? It will be reactivated on the platform.`}
                            type="success"
                            confirmText="Restore"
                            onConfirm={handleRestore}
                            isProcessing={processing}
                        />
                        <Modal
                            isOpen={forceDeleteModal.isOpen}
                            onClose={() =>
                                setForceDeleteModal({
                                    isOpen: false,
                                    gigUuid: null,
                                    gigTitle: "",
                                })
                            }
                            title="Permanently Delete Gig"
                            message={`Are you sure you want to permanently delete gig "${forceDeleteModal.gigTitle}"? All its data will be removed and cannot be recovered. This action is irreversible.`}
                            type="error"
                            confirmText="Delete"
                            onConfirm={handleForceDelete}
                            isProcessing={processing}
                        />
                        <div className="mb-8">
                            <Link 
                                href="/admin/gigs" 
                                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Gigs
                            </Link>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                                Gigs Trash
                            </h1>
                            <p className="text-gray-500 mt-1 text-sm">
                                Manage deleted gigs and restore or permanently delete them
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {gigs?.data?.map((gig) => (
                                <div
                                    key={gig.id}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                                >
                                    <div className="h-48 bg-gray-100 relative">
                                        {gig.image ? (
                                            <img
                                                src={`/storage/${gig.image}`}
                                                alt={gig.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-brand-100">
                                                <svg
                                                    className="w-12 h-12 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                        <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                                            Deleted
                                        </span>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-lg text-gray-900 truncate">
                                            {gig.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            by {gig.user?.name || "Unknown"}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Deleted: {new Date(gig.deleted_at).toLocaleDateString()}
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mt-3">
                                            $
                                            {Number(gig.price).toLocaleString()}
                                        </p>
                                        <div className="flex gap-2 mt-4">
                                            <button
                                                onClick={() =>
                                                    setRestoreModal({
                                                        isOpen: true,
                                                        gigUuid: gig.uuid,
                                                        gigTitle: gig.title,
                                                    })
                                                }
                                                className="flex-1 px-3 py-2 bg-success-100 text-success-700 rounded-xl text-sm font-medium hover:bg-success-200"
                                            >
                                                Restore
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setForceDeleteModal({
                                                        isOpen: true,
                                                        gigUuid: gig.uuid,
                                                        gigTitle: gig.title,
                                                    })
                                                }
                                                className="px-3 py-2 bg-danger-100 text-danger-700 rounded-xl text-sm font-medium hover:bg-danger-200"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {gigs?.links && (
                            <div className="mt-8">
                                {gigs.links.map((link, i) =>
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                            className={`px-3 py-1 mx-1 rounded ${link.active ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-700"}`}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                            className="px-3 py-1 mx-1 text-gray-400"
                                        />
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
