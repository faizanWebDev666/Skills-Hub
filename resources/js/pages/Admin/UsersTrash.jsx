import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import SearchFilters from "../../components/SearchFilters";
import Modal from "../../components/Modal";

export default function UsersTrash({ users, filters, user, sidebarLinks }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const userList = Array.isArray(users?.data)
        ? users.data.filter(Boolean)
        : Array.isArray(users)
          ? users.filter(Boolean)
          : [];
    const [restoreModal, setRestoreModal] = useState({
        isOpen: false,
        userUuid: null,
        userName: "",
    });
    const [forceDeleteModal, setForceDeleteModal] = useState({
        isOpen: false,
        userUuid: null,
        userName: "",
    });
    const [processing, setProcessing] = useState(false);

    const handleRestore = async () => {
        if (!restoreModal.userUuid) return;
        setProcessing(true);
        try {
            await fetch(`/admin/users/${restoreModal.userUuid}/restore`, {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN":
                        document.querySelector('meta[name="csrf-token"]')
                            ?.content || "",
                },
            });
            window.location.reload();
        } catch (error) {
            console.error("Error restoring user:", error);
        } finally {
            setProcessing(false);
            setRestoreModal({
                isOpen: false,
                userUuid: null,
                userName: "",
            });
        }
    };

    const handleForceDelete = async () => {
        if (!forceDeleteModal.userUuid) return;
        setProcessing(true);
        try {
            await fetch(`/admin/users/${forceDeleteModal.userUuid}/force`, {
                method: "DELETE",
                headers: {
                    "X-CSRF-TOKEN":
                        document.querySelector('meta[name="csrf-token"]')
                            ?.content || "",
                },
            });
            window.location.reload();
        } catch (error) {
            console.error("Error permanently deleting user:", error);
        } finally {
            setProcessing(false);
            setForceDeleteModal({
                isOpen: false,
                userUuid: null,
                userName: "",
            });
        }
    };

    const trashSearchFields = [
        {
            type: "search",
            name: "search",
            label: "user name or email",
            placeholder: "Search user name or email...",
        },
    ];

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
                                    userUuid: null,
                                    userName: "",
                                })
                            }
                            title="Restore User"
                            message={`Are you sure you want to restore user "${restoreModal.userName}"? They will be reactivated on the platform.`}
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
                                    userUuid: null,
                                    userName: "",
                                })
                            }
                            title="Permanently Delete User"
                            message={`Are you sure you want to permanently delete user "${forceDeleteModal.userName}"? All their data will be removed and cannot be recovered. This action is irreversible.`}
                            type="error"
                            confirmText="Delete"
                            onConfirm={handleForceDelete}
                            isProcessing={processing}
                        />
                        <div className="mb-8">
                            <Link 
                                href="/admin/users" 
                                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Users
                            </Link>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                                Users Trash
                            </h1>
                            <p className="text-gray-500 mt-1 text-sm">
                                Manage deleted users and restore or permanently delete them
                            </p>
                        </div>

                        <div className="mb-6">
                            <SearchFilters
                                filters={filters}
                                searchFields={trashSearchFields}
                                onSubmit={(formFilters) => {
                                    const params = new URLSearchParams();
                                    Object.entries(formFilters).forEach(([key, value]) => {
                                        if (value) params.set(key, value);
                                    });
                                    window.location.href = `/admin/users/trash?${params.toString()}`;
                                }}
                            />
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-gray-500 border-b">
                                            <th className="pb-3 font-medium">
                                                Name
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Email
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Deleted At
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userList.map((u, index) => {
                                            if (!u?.uuid) return null;

                                            return (
                                                <tr
                                                    key={u.id ?? index}
                                                    className="border-b border-gray-100"
                                                >
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            {u.avatar ? (
                                                                <img
                                                                    src={
                                                                        u.avatar
                                                                    }
                                                                    alt={u.name}
                                                                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                                    {u.name?.charAt(
                                                                        0,
                                                                    ) || "U"}
                                                                </div>
                                                            )}
                                                            <span className="font-medium text-gray-900">
                                                                {u.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 text-gray-600">
                                                        {u.email}
                                                    </td>
                                                    <td className="py-4 text-gray-500">
                                                        {new Date(u.deleted_at).toLocaleString()}
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="flex gap-2 flex-wrap">
                                                            <button
                                                                onClick={() =>
                                                                    setRestoreModal({
                                                                        isOpen: true,
                                                                        userUuid: u.uuid,
                                                                        userName: u.name,
                                                                    })
                                                                }
                                                                className="px-2 py-1 text-xs bg-success-100 text-success-700 rounded-lg hover:bg-success-200"
                                                            >
                                                                Restore
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    setForceDeleteModal({
                                                                        isOpen: true,
                                                                        userUuid: u.uuid,
                                                                        userName: u.name,
                                                                    })
                                                                }
                                                                className="px-2 py-1 text-xs bg-danger-100 text-danger-700 rounded-lg hover:bg-danger-200"
                                                            >
                                                                Delete Permanently
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {users?.links && (
                                <div className="mt-6">
                                    {users.links.map((link, i) =>
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
                    </div>
                </main>
            </div>
        </div>
    );
}
