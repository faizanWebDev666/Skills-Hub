import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";
import SearchFilters from "../../components/SearchFilters";
import Modal from "../../components/Modal";

export default function OrdersTrash({ orders, filters, user, sidebarLinks }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [restoreModal, setRestoreModal] = useState({
        isOpen: false,
        orderId: null,
        orderUuid: null,
    });
    const [forceDeleteModal, setForceDeleteModal] = useState({
        isOpen: false,
        orderId: null,
        orderUuid: null,
    });
    const [processing, setProcessing] = useState(false);

    const handleRestore = async () => {
        if (!restoreModal.orderUuid) return;
        setProcessing(true);
        try {
            await fetch(`/admin/orders/${restoreModal.orderUuid}/restore`, {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN":
                        document.querySelector('meta[name="csrf-token"]')
                            ?.content || "",
                },
            });
            window.location.reload();
        } catch (error) {
            console.error("Error restoring order:", error);
        } finally {
            setProcessing(false);
            setRestoreModal({
                isOpen: false,
                orderId: null,
                orderUuid: null,
            });
        }
    };

    const handleForceDelete = async () => {
        if (!forceDeleteModal.orderUuid) return;
        setProcessing(true);
        try {
            await fetch(`/admin/orders/${forceDeleteModal.orderUuid}/force`, {
                method: "DELETE",
                headers: {
                    "X-CSRF-TOKEN":
                        document.querySelector('meta[name="csrf-token"]')
                            ?.content || "",
                },
            });
            window.location.reload();
        } catch (error) {
            console.error("Error permanently deleting order:", error);
        } finally {
            setProcessing(false);
            setForceDeleteModal({
                isOpen: false,
                orderId: null,
                orderUuid: null,
            });
        }
    };

    const statusColors = {
        pending: "bg-accent-100 text-accent-700",
        in_progress: "bg-brand-100 text-brand-700",
        completed: "bg-success-100 text-success-700",
        cancelled: "bg-danger-100 text-danger-700",
    };

    const ordersSearchFields = [
        {
            type: "search",
            name: "search",
            label: "order ID, customer, or freelancer",
            placeholder: "Search by order ID, customer, or freelancer...",
        },
        {
            type: "select",
            name: "status",
            label: "status",
            placeholder: "All status",
            options: [
                { label: "Pending", value: "pending" },
                { label: "In Progress", value: "in_progress" },
                { label: "Delivered", value: "delivered" },
                { label: "Completed", value: "completed" },
                { label: "Cancelled", value: "cancelled" },
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
                            isOpen={restoreModal.isOpen}
                            onClose={() =>
                                setRestoreModal({
                                    isOpen: false,
                                    orderId: null,
                                    orderUuid: null,
                                })
                            }
                            title="Restore Order"
                            message={`Are you sure you want to restore order #${restoreModal.orderId}? It will be reactivated on the platform.`}
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
                                    orderId: null,
                                    orderUuid: null,
                                })
                            }
                            title="Permanently Delete Order"
                            message={`Are you sure you want to permanently delete order #${forceDeleteModal.orderId}? All its data will be removed and cannot be recovered. This action is irreversible.`}
                            type="error"
                            confirmText="Delete"
                            onConfirm={handleForceDelete}
                            isProcessing={processing}
                        />
                        <div className="mb-8">
                            <Link 
                                href="/admin/orders" 
                                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Orders
                            </Link>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                                Orders Trash
                            </h1>
                            <p className="text-gray-500 mt-1 text-sm">
                                Manage deleted orders and restore or permanently delete them
                            </p>
                        </div>

                        <div className="mb-6">
                            <SearchFilters
                                filters={filters}
                                searchFields={ordersSearchFields}
                                onSubmit={(formFilters) => {
                                    const params = new URLSearchParams();
                                    Object.entries(formFilters).forEach(([key, value]) => {
                                        if (value) params.set(key, value);
                                    });
                                    window.location.href = `/admin/orders/trash?${params.toString()}`;
                                }}
                            />
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-gray-500 border-b">
                                            <th className="pb-3 font-medium">
                                                Order ID
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Gig
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Customer
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Freelancer
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Amount
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Status
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
                                        {orders?.data?.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="border-b border-gray-100"
                                            >
                                                <td className="py-4 font-medium text-gray-900">
                                                    #{order.id}
                                                </td>
                                                <td className="py-4 text-gray-700">
                                                    {order.gig?.title ||
                                                        "Service"}
                                                </td>
                                                <td className="py-4 text-gray-700">
                                                    {order.customer?.name ||
                                                        "Unknown"}
                                                </td>
                                                <td className="py-4 text-gray-700">
                                                    {order.freelancer?.name ||
                                                        "Unknown"}
                                                </td>
                                                <td className="py-4 font-bold text-gray-900">
                                                    $
                                                    {Number(
                                                        order.amount,
                                                    ).toLocaleString()}
                                                </td>
                                                <td className="py-4">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}
                                                    >
                                                        {order.status?.replace(
                                                            "_",
                                                            " ",
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-gray-500">
                                                    {new Date(order.deleted_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                setRestoreModal({
                                                                    isOpen: true,
                                                                    orderId: order.id,
                                                                    orderUuid: order.uuid,
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
                                                                    orderId: order.id,
                                                                    orderUuid: order.uuid,
                                                                })
                                                            }
                                                            className="px-2 py-1 text-xs bg-danger-100 text-danger-700 rounded-lg hover:bg-danger-200"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {orders?.links && (
                                <div className="mt-6">
                                    {orders.links.map((link, i) =>
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
