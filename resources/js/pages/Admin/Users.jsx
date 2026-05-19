import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';

export default function Users({ users, filters, roles, user, sidebarLinks }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const userList = Array.isArray(users?.data)
        ? users.data.filter(Boolean)
        : Array.isArray(users)
            ? users.filter(Boolean)
            : [];

    return (
        <div className="min-h-screen bg-cream-50">
            <Navbar user={user} />

            <div className="flex">
                <AdminSidebar user={user} sidebarLinks={sidebarLinks} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 min-w-0">
                    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                        <div className="mb-8">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Users Management</h1>
                            <p className="text-gray-500 mt-1 text-sm">Manage all users on the platform</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-gray-500 border-b">
                                            <th className="pb-3 font-medium">Name</th>
                                            <th className="pb-3 font-medium">Email</th>
                                            <th className="pb-3 font-medium">Role</th>
                                            <th className="pb-3 font-medium">Status</th>
                                            <th className="pb-3 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userList.map((u, index) => {
                                            if (!u?.id) return null;
                                            const chatHref = typeof route !== 'undefined'
                                                ? route('chat.with-user', u.id)
                                                : `/chat/user/${u.id}`;

                                            return (
                                                <tr key={u.id ?? index} className="border-b border-gray-100">
                                                        <td className="py-4">
                                                            <div className="flex items-center gap-3">
                                                                {u.avatar ? (
                                                                    <img
                                                                        src={u.avatar}
                                                                        alt={u.name}
                                                                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                                    />
                                                                ) : (
                                                                    <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                                        {u.name?.charAt(0) || 'U'}
                                                                    </div>
                                                                )}
                                                                <span className="font-medium text-gray-900">{u.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 text-gray-600">{u.email}</td>
                                                        <td className="py-4">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                u.roles?.[0]?.name === 'admin' ? 'bg-danger-100 text-danger-700' :
                                                                u.roles?.[0]?.name === 'vendor' ? 'bg-brand-100 text-brand-700' :
                                                                'bg-success-100 text-success-700'
                                                            }`}>
                                                                {u.roles?.[0]?.name || 'customer'}
                                                            </span>
                                                        </td>
                                                        <td className="py-4">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                u.banned_at ? 'bg-danger-100 text-danger-700' : 'bg-success-100 text-success-700'
                                                            }`}>
                                                                {u.banned_at ? 'Banned' : 'Active'}
                                                            </span>
                                                        </td>
                                                        <td className="py-4">
                                                            <div className="flex gap-2 flex-wrap">
                                                                <select
                                                                    defaultValue={u.roles?.[0]?.name || 'customer'}
                                                                    onChange={(e) => {
                                                                        fetch(`/admin/users/${u.id}/role`, {
                                                                            method: 'PUT',
                                                                            headers: {
                                                                                'Content-Type': 'application/json',
                                                                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                                                                            },
                                                                            body: JSON.stringify({ role: e.target.value }),
                                                                        }).then(() => window.location.reload());
                                                                    }}
                                                                    className="px-2 py-1 text-xs border rounded-lg"
                                                                >
                                                                    {roles?.map((role) => (
                                                                        <option key={role} value={role}>{role}</option>
                                                                    ))}
                                                                </select>
                                                                {!u.banned_at ? (
                                                                    <button
                                                                        onClick={() => {
                                                                            fetch(`/admin/users/${u.id}/ban`, {
                                                                                method: 'POST',
                                                                                headers: {
                                                                                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                                                                                },
                                                                            }).then(() => window.location.reload());
                                                                        }}
                                                                        className="px-2 py-1 text-xs bg-warning-100 text-warning-700 rounded-lg hover:bg-warning-200"
                                                                    >
                                                                        Ban
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => {
                                                                            fetch(`/admin/users/${u.id}/unban`, {
                                                                                method: 'POST',
                                                                                headers: {
                                                                                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                                                                                },
                                                                            }).then(() => window.location.reload());
                                                                        }}
                                                                        className="px-2 py-1 text-xs bg-success-100 text-success-700 rounded-lg hover:bg-success-200"
                                                                    >
                                                                        Unban
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => {
                                                                        if (confirm('Are you sure you want to delete this user?')) {
                                                                            fetch(`/admin/users/${u.id}`, {
                                                                                method: 'DELETE',
                                                                                headers: {
                                                                                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                                                                                },
                                                                            }).then(() => window.location.reload());
                                                                        }
                                                                    }}
                                                                    className="px-2 py-1 text-xs bg-danger-100 text-danger-700 rounded-lg hover:bg-danger-200"
                                                                >
                                                                    Delete
                                                                </button>
                                                                {u.id !== user?.id && (
                                                                    <Link
                                                                        href={chatHref}
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
                                    {users.links.map((link, i) => (
                                        link.url ? (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className={`px-3 py-1 mx-1 rounded ${link.active ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                                            />
                                        ) : (
                                            <span key={i} dangerouslySetInnerHTML={{ __html: link.label }} className="px-3 py-1 mx-1 text-gray-400" />
                                        )
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}