import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";

export default function Orders({ orders, filters, user, sidebarLinks }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const statusColors = {
        pending: "bg-accent-100 text-accent-700",
        in_progress: "bg-brand-100 text-brand-700",
        completed: "bg-success-100 text-success-700",
        cancelled: "bg-danger-100 text-danger-700",
    };

    return (
        <div className="min-h-screen bg-cream-50">
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
                        <div className="mb-8">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                                Orders Management
                            </h1>
                            <p className="text-gray-500 mt-1 text-sm">
                                Track and manage all orders
                            </p>
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
                                                <td className="py-4">
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            defaultValue={
                                                                order.status
                                                            }
                                                            onChange={(e) => {
                                                                fetch(
                                                                    `/admin/orders/${order.id}/status`,
                                                                    {
                                                                        method: "PATCH",
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
                                                                                status: e
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
                                                            <option value="pending">
                                                                Pending
                                                            </option>
                                                            <option value="in_progress">
                                                                In Progress
                                                            </option>
                                                            <option value="delivered">
                                                                Delivered
                                                            </option>
                                                            <option value="completed">
                                                                Completed
                                                            </option>
                                                            <option value="cancelled">
                                                                Cancelled
                                                            </option>
                                                        </select>

                                                        {order.status ===
                                                            "completed" &&
                                                            !order.funds_released_at && (
                                                                <button
                                                                    onClick={() => {
                                                                        if (
                                                                            confirm(
                                                                                "Release funds to the vendor? This will deduct platform commission and add the rest to the vendor wallet.",
                                                                            )
                                                                        ) {
                                                                            router.post(
                                                                                `/admin/orders/${order.id}/release-funds`,
                                                                            );
                                                                        }
                                                                    }}
                                                                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg shadow-sm"
                                                                >
                                                                    Release
                                                                    Funds
                                                                </button>
                                                            )}
                                                        {order.funds_released_at && (
                                                            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg">
                                                                Released
                                                            </span>
                                                        )}
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
