import React, { useState, useRef } from "react";
import { useForm, usePage } from "@inertiajs/react";
import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminProfile({ user, sidebarLinks }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);
    const { flash } = usePage().props;

    const profileForm = useForm({
        name: user?.name || "",
        email: user?.email || "",
        bio: user?.bio || "",
        phone: user?.phone || "",
        location: user?.location || "",
        country: user?.country || "",
        city: user?.city || "",
        address: user?.address || "",
    });

    const passwordForm = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setAvatarPreview(URL.createObjectURL(file));
        profileForm.setData("avatar", file);

        const formData = new FormData();
        formData.append("avatar", file);

        profileForm.post(route("admin.profile.avatar"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setAvatarPreview(null);
            },
            onFinish: () => {
                profileForm.reset("avatar");
            },
        });
    };

    const handleRemoveAvatar = () => {
        profileForm.delete(route("admin.profile.avatar.remove"), {
            preserveScroll: true,
        });
    };

    const handleProfileSubmit = (event) => {
        event.preventDefault();
        profileForm.put(route("admin.profile.update"), {
            preserveScroll: true,
        });
    };

    const handlePasswordSubmit = (event) => {
        event.preventDefault();
        passwordForm.put(route("admin.profile.password"), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    const [activeTab, setActiveTab] = useState("personal");

    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-brand-500/30">
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
                        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                                    Admin Profile
                                </h1>
                                <p className="text-gray-500 mt-1 text-sm">
                                    Manage your avatar, bio, contact details, and password.
                                </p>
                            </div>
                        </div>

                        {flash?.success && (
                            <div className="mb-6 rounded-2xl bg-green-50 border border-green-200 p-4 text-green-700">
                                {flash.success}
                            </div>
                        )}

                        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
                            <section className="space-y-6">
                                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-20 h-20 rounded-3xl bg-brand-600 text-white flex items-center justify-center text-3xl font-bold overflow-hidden">
                                                {avatarPreview ? (
                                                    <img
                                                        src={avatarPreview}
                                                        alt={user?.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : user?.avatar ? (
                                                    <img
                                                        src={`/storage/${user.avatar}`}
                                                        alt={user?.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span>{user?.name?.charAt(0) || "A"}</span>
                                                )}
                                            </div>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarChange}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {user?.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-3">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition"
                                        >
                                            Change Photo
                                        </button>
                                        {user?.avatar && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveAvatar}
                                                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                                            >
                                                Remove Photo
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-6">
                                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <div className="mb-6 flex flex-wrap gap-2 bg-gray-100 rounded-full p-1">
                                        {[
                                            { id: "personal", label: "Personal Information" },
                                            { id: "security", label: "Security" },
                                        ].map((tab) => (
                                            <button
                                                key={tab.id}
                                                type="button"
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                                    activeTab === tab.id
                                                        ? "bg-brand-600 text-white"
                                                        : "text-gray-600 hover:bg-white"
                                                }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    {activeTab === "personal" ? (
                                        <div className="space-y-4">
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                Personal Information
                                            </h2>

                                            <form onSubmit={handleProfileSubmit} className="space-y-4">
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Full Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={profileForm.data.name}
                                                            onChange={(e) => profileForm.setData("name", e.target.value)}
                                                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                                                        />
                                                        {profileForm.errors.name && (
                                                            <p className="mt-1 text-xs text-danger-600">
                                                                {profileForm.errors.name}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Email Address
                                                        </label>
                                                        <input
                                                            type="email"
                                                            value={profileForm.data.email}
                                                            onChange={(e) => profileForm.setData("email", e.target.value)}
                                                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                                                        />
                                                        {profileForm.errors.email && (
                                                            <p className="mt-1 text-xs text-danger-600">
                                                                {profileForm.errors.email}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Bio
                                                    </label>
                                                    <textarea
                                                        rows={4}
                                                        value={profileForm.data.bio}
                                                        onChange={(e) => profileForm.setData("bio", e.target.value)}
                                                        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                                                    />
                                                    {profileForm.errors.bio && (
                                                        <p className="mt-1 text-xs text-danger-600">
                                                            {profileForm.errors.bio}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Phone
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={profileForm.data.phone}
                                                            onChange={(e) => profileForm.setData("phone", e.target.value)}
                                                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Location
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={profileForm.data.location}
                                                            onChange={(e) => profileForm.setData("location", e.target.value)}
                                                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Country
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={profileForm.data.country}
                                                            onChange={(e) => profileForm.setData("country", e.target.value)}
                                                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            City
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={profileForm.data.city}
                                                            onChange={(e) => profileForm.setData("city", e.target.value)}
                                                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Address
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={profileForm.data.address}
                                                        onChange={(e) => profileForm.setData("address", e.target.value)}
                                                        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                                                    />
                                                </div>

                                                <button
                                                    type="submit"
                                                    className="w-full rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition"
                                                >
                                                    Save Profile
                                                </button>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                Security
                                            </h2>

                                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Current Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={passwordForm.data.current_password}
                                                        onChange={(e) => passwordForm.setData("current_password", e.target.value)}
                                                        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                                                    />
                                                    {passwordForm.errors.current_password && (
                                                        <p className="mt-1 text-xs text-danger-600">
                                                            {passwordForm.errors.current_password}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={passwordForm.data.password}
                                                        onChange={(e) => passwordForm.setData("password", e.target.value)}
                                                        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                                                    />
                                                    {passwordForm.errors.password && (
                                                        <p className="mt-1 text-xs text-danger-600">
                                                            {passwordForm.errors.password}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Confirm New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={passwordForm.data.password_confirmation}
                                                        onChange={(e) => passwordForm.setData("password_confirmation", e.target.value)}
                                                        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                                                    />
                                                </div>

                                                <button
                                                    type="submit"
                                                    className="w-full rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition"
                                                >
                                                    Update Password
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
