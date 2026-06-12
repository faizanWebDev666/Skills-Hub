import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import SearchFilters from "../../components/SearchFilters";
import Modal from "../../components/Modal";

export default function Users({ users, filters, roles, user, sidebarLinks }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const userList = Array.isArray(users?.data)
        ? users.data.filter(Boolean)
        : Array.isArray(users)
          ? users.filter(Boolean)
          : [];
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        userUuid: null,
        userName: "",
    });
    const [banUnbanModal, setBanUnbanModal] = useState({
        isOpen: false,
        userUuid: null,
        userName: "",
        isBanning: false, // true = ban, false = unban
    });
    const [processing, setProcessing] = useState(false);

    const handleDeleteUser = async () => {
        if (!deleteModal.userUuid) return;
        setProcessing(true);
        try {
            await fetch(`/admin/users/${deleteModal.userUuid}`, {
                method: "DELETE",
                headers: {
                    "X-CSRF-TOKEN":
                        document.querySelector('meta[name="csrf-token"]')
                            ?.content || "",
                },
            });
            window.location.reload();
        } catch (error) {
            console.error("Error deleting user:", error);
        } finally {
            setProcessing(false);
            setDeleteModal({ isOpen: false, userUuid: null, userName: "" });
        }
    };

    const handleBanUnban = async () => {
        if (!banUnbanModal.userUuid) return;
        const endpoint = banUnbanModal.isBanning
            ? `/admin/users/${banUnbanModal.userUuid}/ban`
            : `/admin/users/${banUnbanModal.userUuid}/unban`;
        setProcessing(true);
        try {
            await fetch(endpoint, {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN":
                        document.querySelector('meta[name="csrf-token"]')
                            ?.content || "",
                },
            });
            window.location.reload();
        } catch (error) {
            console.error("Error changing user status:", error);
        } finally {
            setProcessing(false);
            setBanUnbanModal({
                isOpen: false,
                userUuid: null,
                userName: "",
                isBanning: false,
            });
        }
    };

    const usersSearchFields = [
        {
            type: "search",
            name: "search",
            label: "user name or email",
            placeholder: "Search user name or email...",
        },
        {
            type: "select",
            name: "role",
            label: "roles",
            placeholder: "All roles",
            options: (roles || []).map((role) => ({ label: role, value: role })),
        },
        {
            type: "select",
            name: "status",
            label: "status",
            placeholder: "All status",
            options: [
                { label: "Active", value: "active" },
                { label: "Banned", value: "banned" },
            ],
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
                            isOpen={deleteModal.isOpen}
                            onClose={() =>
                                setDeleteModal({
                                    isOpen: false,
                                    userUuid: null,
                                    userName: "",
                                })
                            }
                            title="Delete User"
                            message={`Are you sure you want to delete user "${deleteModal.userName}"? All their data will be permanently removed. This action cannot be undone.`}
                            type="error"
                            confirmText="Delete"
                            onConfirm={handleDeleteUser}
                            isProcessing={processing}
                        />
                        <Modal
                            isOpen={banUnbanModal.isOpen}
                            onClose={() =>
                                setBanUnbanModal({
                                    isOpen: false,
                                    userUuid: null,
                                    userName: "",
                                    isBanning: false,
                                })
                            }
                            title={`Confirm ${banUnbanModal.isBanning ? 'Ban' : 'Unban'}`}
                            message={`Are you sure you want to ${banUnbanModal.isBanning ? 'ban' : 'unban'} user "${banUnbanModal.userName}"?${banUnbanModal.isBanning ? " They will no longer be able to log in or use the platform." : ""}`}
                            type={banUnbanModal.isBanning ? 'error' : 'success'}
                            confirmText={`Yes, ${banUnbanModal.isBanning ? 'Ban' : 'Unban'}`}
                            onConfirm={handleBanUnban}
                            isProcessing={processing}
                        />
                        <div className="mb-8">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                                Users Management
                            </h1>
                            <p className="text-gray-500 mt-1 text-sm">
                                Manage all users on the platform
                            </p>
                        </div>

                        <div className="mb-6">
                            <SearchFilters
                                filters={filters}
                                searchFields={usersSearchFields}
                                onSubmit={(formFilters) => {
                                    const params = new URLSearchParams();
                                    Object.entries(formFilters).forEach(([key, value]) => {
                                        if (value) params.set(key, value);
                                    });
                                    window.location.href = `/admin/users?${params.toString()}`;
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
                                                Role
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Status
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userList.map((u, index) => {
                                            if (!u?.uuid) return null;
                                            const chatHref = route(
                                                "chat.with-user",
                                                u.uuid,
                                            );

                                            return (
                                                <tr
                                                    key={u.id ?? index}
                                                    className="border-b border-gray-100"
                                                >
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={
                                                                    u.avatar ||
                                                                    "/assets/user.png"
                                                                }
                                                                alt={u.name}
                                                                onError={(e) => {
                                                                    e.target.src =
                                                                        "/assets/user.png";
                                                                }}
                                                                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                            />
                                                            <span className="font-medium text-gray-900">
                                                                {u.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 text-gray-600">
                                                        {u.email}
                                                    </td>
                                                    <td className="py-4">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                u.roles?.[0]
                                                                    ?.name ===
                                                                "admin"
                                                                    ? "bg-danger-100 text-danger-700"
                                                                    : u
                                                                            .roles?.[0]
                                                                            ?.name ===
                                                                        "vendor"
                                                                      ? "bg-brand-100 text-brand-700"
                                                                      : "bg-success-100 text-success-700"
                                                            }`}
                                                        >
                                                            {u.roles?.[0]
                                                                ?.name ||
                                                                "customer"}
                                                        </span>
                                                    </td>
                                                    <td className="py-4">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                u.banned_at
                                                                    ? "bg-danger-100 text-danger-700"
                                                                    : "bg-success-100 text-success-700"
                                                            }`}
                                                        >
                                                            {u.banned_at
                                                                ? "Banned"
                                                                : "Active"}
                                                        </span>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="flex gap-2 flex-wrap">
                                                            <select
                                                                defaultValue={
                                                                    u.roles?.[0]
                                                                        ?.name ||
                                                                    "customer"
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    fetch(
                                                                        `/admin/users/${u.uuid}/role`,
                                                                        {
                                                                            method: "PUT",
                                                                            headers:
                                                                                {
                                                                                    "Content-Type":
                                                                                        "application/json",
                                                                                    "X-CSRF-TOKEN":
                                                                                        document.querySelector(
                                                                                            'meta[name="csrf-token"]',
                                                                                        )
                                                                                            ?.content ||
                                                                                        "",
                                                                                },
                                                                            body: JSON.stringify(
                                                                                {
                                                                                    role: e
                                                                                        .target
                                                                                        .value,
                                                                                },
                                                                            ),
                                                                        },
                                                                    ).then(() =>
                                                                        window.location.reload(),
                                                                    );
                                                                }}
                                                                className="px-2 py-1 text-xs border rounded-lg"
                                                            >
                                                                {roles?.map(
                                                                    (role) => (
                                                                        <option
                                                                            key={
                                                                                role
                                                                            }
                                                                            value={
                                                                                role
                                                                            }
                                                                        >
                                                                            {
                                                                                role
                                                                            }
                                                                        </option>
                                                                    ),
                                                                )}
                                                            </select>
                                                            {!u.banned_at ? (
                                                                <button
                                                                    onClick={() =>
                                                                        setBanUnbanModal({
                                                                            isOpen: true,
                                                                            userUuid: u.uuid,
                                                                            userName: u.name,
                                                                            isBanning: true,
                                                                        })
                                                                    }
                                                                    className="px-2 py-1 text-xs bg-warning-100 text-warning-700 rounded-lg hover:bg-warning-200"
                                                                >
                                                                    Ban
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() =>
                                                                        setBanUnbanModal({
                                                                            isOpen: true,
                                                                            userUuid: u.uuid,
                                                                            userName: u.name,
                                                                            isBanning: false,
                                                                        })
                                                                    }
                                                                    className="px-2 py-1 text-xs bg-success-100 text-success-700 rounded-lg hover:bg-success-200"
                                                                >
                                                                    Unban
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() =>
                                                                    setDeleteModal({
                                                                        isOpen: true,
                                                                        userUuid: u.uuid,
                                                                        userName: u.name,
                                                                    })
                                                                }
                                                                className="px-2 py-1 text-xs bg-danger-100 text-danger-700 rounded-lg hover:bg-danger-200"
                                                            >
                                                                Delete
                                                            </button>
                                                            {u.id !==
                                                                user?.id && (
                                                                <Link
                                                                    href={
                                                                        chatHref
                                                                    }
                                                                    className="px-2 py-1 text-xs bg-brand-100 text-brand-700 rounded-lg hover:bg-brand-200"
                                                                >
                                                                    Message
                                                                </Link>
                                                            )}
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
