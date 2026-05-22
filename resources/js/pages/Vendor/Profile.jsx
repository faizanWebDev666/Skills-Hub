import React, { useState, useRef } from "react";
import { Link, useForm, usePage, router } from "@inertiajs/react";
import VendorNavbar from "../../components/VendorNavbar";
import VendorSidebar from "../../components/VendorSidebar";

const languagesList = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Korean",
    "Arabic",
    "Hindi",
    "Urdu",
    "Portuguese",
    "Russian",
];
const daysList = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const fileSizeLimits = {
    avatar: 2 * 1024 * 1024, // 2 MB
    certificate: 5 * 1024 * 1024, // 5 MB
    portfolioImage: 5 * 1024 * 1024, // 5 MB
    portfolioVideo: 50 * 1024 * 1024, // 50 MB
    resume: 5 * 1024 * 1024, // 5 MB
};

const formatFileSize = (bytes) => {
    if (bytes >= 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }
    if (bytes >= 1024) {
        return (bytes / 1024).toFixed(1) + " KB";
    }
    return bytes + " B";
};

export default function VendorProfile({ user, profileCompletion }) {
    const [activeTab, setActiveTab] = useState("personal");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [uploadProgress, setUploadProgress] = useState({});
    const [uploadErrors, setUploadErrors] = useState({});
    const fileInputRef = useRef(null);
    const certificateInputRef = useRef(null);
    const portfolioImageInputRef = useRef(null);
    const portfolioVideoInputRef = useRef(null);
    const resumeInputRef = useRef(null);
    const { flash } = usePage().props;

    const profileForm = useForm({
        name: user?.name || "",
        email: user?.email || "",
        bio: user?.bio || "",
        phone: user?.phone || "",
        location: user?.location || "",
        professional_title: user?.professional_title || "",
        country: user?.country || "",
        city: user?.city || "",
        address: user?.address || "",
        languages: user?.languages || [],
        years_of_experience: user?.years_of_experience || "",
        hourly_rate: user?.hourly_rate || "",
        delivery_time: user?.delivery_time || "",
        available_days: user?.available_days || [],
        service_type: user?.service_type || "",
        emergency_service: user?.emergency_service || false,
        linkedin: user?.linkedin || "",
        github: user?.github || "",
        behance: user?.behance || "",
        dribbble: user?.dribbble || "",
        website: user?.website || "",
        facebook: user?.facebook || "",
        instagram: user?.instagram || "",
        previous_work_links: user?.previous_work_links || [],
        previous_work_input: "",
    });

    const roleLabel = user?.roles?.[0]?.name
        ? user.roles[0].name.charAt(0).toUpperCase() +
          user.roles[0].name.slice(1)
        : "Freelancer";

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > fileSizeLimits.avatar) {
                setUploadErrors((prev) => ({
                    ...prev,
                    avatar: `File is too large (${formatFileSize(file.size)}). Max size is ${formatFileSize(fileSizeLimits.avatar)}.`,
                }));
                return;
            }
            setUploadErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.avatar;
                return newErrors;
            });

            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result);
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append("avatar", file);

            profileForm.transform(() => formData);
            profileForm.post(route("vendor.profile.avatar"), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    setAvatarPreview(null);
                    router.reload({ only: ["user", "profileCompletion"] });
                },
            });
        }
    };

    const handleRemoveAvatar = () => {
        profileForm.delete(route("vendor.profile.avatar.remove"), {
            preserveScroll: true,
            onSuccess: () =>
                router.reload({ only: ["user", "profileCompletion"] }),
        });
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        const currentData = { ...profileForm.data };
        delete currentData.previous_work_input;

        console.log("Submitting data:", currentData);

        profileForm.setData(currentData);
        profileForm.put(route("vendor.profile.update"), {
            preserveScroll: true,
            onSuccess: () => {
                console.log("Successfully updated!");
                router.reload({ only: ["user", "profileCompletion"] });
            },
            onError: (errors) => {
                console.error("Errors:", errors);
            },
        });
    };

    const handleSectionChange = (section) => {
        setActiveTab(section);
    };

    const toggleArrayItem = (field, item) => {
        const current = profileForm.data[field] || [];
        const newValue = current.includes(item)
            ? current.filter((i) => i !== item)
            : [...current, item];
        profileForm.setData(field, newValue);
    };

    const addPreviousWorkLink = () => {
        if (profileForm.data.previous_work_input.trim()) {
            profileForm.setData("previous_work_links", [
                ...(profileForm.data.previous_work_links || []),
                profileForm.data.previous_work_input.trim(),
            ]);
            profileForm.setData("previous_work_input", "");
        }
    };

    const removePreviousWorkLink = (link) => {
        profileForm.setData(
            "previous_work_links",
            (profileForm.data.previous_work_links || []).filter(
                (l) => l !== link,
            ),
        );
    };

    const handleCertificateUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > fileSizeLimits.certificate) {
                setUploadErrors((prev) => ({
                    ...prev,
                    certificate: `File is too large (${formatFileSize(file.size)}). Max size is ${formatFileSize(fileSizeLimits.certificate)}.`,
                }));
                return;
            }
            setUploadErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.certificate;
                return newErrors;
            });

            const formData = new FormData();
            formData.append("certificate", file);
            profileForm.transform(() => formData);

            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15 + 5;
                if (progress >= 90) {
                    progress = 90;
                    clearInterval(interval);
                }
                setUploadProgress((prev) => ({
                    ...prev,
                    certificate: Math.round(progress),
                }));
            }, 300);

            profileForm.post(route("vendor.profile.certificates.upload"), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    clearInterval(interval);
                    setUploadProgress((prev) => ({
                        ...prev,
                        certificate: 100,
                    }));
                    setTimeout(() => {
                        if (certificateInputRef.current)
                            certificateInputRef.current.value = "";
                        setUploadProgress((prev) => ({
                            ...prev,
                            certificate: null,
                        }));
                        router.reload({ only: ["user", "profileCompletion"] });
                    }, 500);
                },
                onError: () => {
                    clearInterval(interval);
                    setUploadProgress((prev) => ({
                        ...prev,
                        certificate: null,
                    }));
                },
            });
        }
    };

    const handleRemoveCertificate = (index) => {
        profileForm.delete(
            route("vendor.profile.certificates.remove", { index }),
            {
                preserveScroll: true,
                onSuccess: () =>
                    router.reload({ only: ["user", "profileCompletion"] }),
            },
        );
    };

    const handlePortfolioImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > fileSizeLimits.portfolioImage) {
                setUploadErrors((prev) => ({
                    ...prev,
                    portfolioImage: `File is too large (${formatFileSize(file.size)}). Max size is ${formatFileSize(fileSizeLimits.portfolioImage)}.`,
                }));
                return;
            }
            setUploadErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.portfolioImage;
                return newErrors;
            });

            const formData = new FormData();
            formData.append("portfolio_image", file);
            profileForm.transform(() => formData);

            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15 + 5;
                if (progress >= 90) {
                    progress = 90;
                    clearInterval(interval);
                }
                setUploadProgress((prev) => ({
                    ...prev,
                    portfolioImage: Math.round(progress),
                }));
            }, 300);

            profileForm.post(route("vendor.profile.portfolio.images.upload"), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    clearInterval(interval);
                    setUploadProgress((prev) => ({
                        ...prev,
                        portfolioImage: 100,
                    }));
                    setTimeout(() => {
                        if (portfolioImageInputRef.current)
                            portfolioImageInputRef.current.value = "";
                        setUploadProgress((prev) => ({
                            ...prev,
                            portfolioImage: null,
                        }));
                        router.reload({ only: ["user", "profileCompletion"] });
                    }, 500);
                },
                onError: () => {
                    clearInterval(interval);
                    setUploadProgress((prev) => ({
                        ...prev,
                        portfolioImage: null,
                    }));
                },
            });
        }
    };

    const handleRemovePortfolioImage = (index) => {
        profileForm.delete(
            route("vendor.profile.portfolio.images.remove", { index }),
            {
                preserveScroll: true,
                onSuccess: () =>
                    router.reload({ only: ["user", "profileCompletion"] }),
            },
        );
    };

    const handlePortfolioVideoUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > fileSizeLimits.portfolioVideo) {
                setUploadErrors((prev) => ({
                    ...prev,
                    portfolioVideo: `File is too large (${formatFileSize(file.size)}). Max size is ${formatFileSize(fileSizeLimits.portfolioVideo)}.`,
                }));
                return;
            }
            setUploadErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.portfolioVideo;
                return newErrors;
            });

            const formData = new FormData();
            formData.append("portfolio_video", file);
            profileForm.transform(() => formData);

            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 10 + 3;
                if (progress >= 90) {
                    progress = 90;
                    clearInterval(interval);
                }
                setUploadProgress((prev) => ({
                    ...prev,
                    portfolioVideo: Math.round(progress),
                }));
            }, 400);

            profileForm.post(route("vendor.profile.portfolio.videos.upload"), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    clearInterval(interval);
                    setUploadProgress((prev) => ({
                        ...prev,
                        portfolioVideo: 100,
                    }));
                    setTimeout(() => {
                        if (portfolioVideoInputRef.current)
                            portfolioVideoInputRef.current.value = "";
                        setUploadProgress((prev) => ({
                            ...prev,
                            portfolioVideo: null,
                        }));
                        router.reload({ only: ["user", "profileCompletion"] });
                    }, 500);
                },
                onError: () => {
                    clearInterval(interval);
                    setUploadProgress((prev) => ({
                        ...prev,
                        portfolioVideo: null,
                    }));
                },
            });
        }
    };

    const handleRemovePortfolioVideo = (index) => {
        profileForm.delete(
            route("vendor.profile.portfolio.videos.remove", { index }),
            {
                preserveScroll: true,
                onSuccess: () =>
                    router.reload({ only: ["user", "profileCompletion"] }),
            },
        );
    };

    const handleResumeUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > fileSizeLimits.resume) {
                setUploadErrors((prev) => ({
                    ...prev,
                    resume: `File is too large (${formatFileSize(file.size)}). Max size is ${formatFileSize(fileSizeLimits.resume)}.`,
                }));
                return;
            }
            setUploadErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.resume;
                return newErrors;
            });

            const formData = new FormData();
            formData.append("resume", file);
            profileForm.transform(() => formData);

            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15 + 5;
                if (progress >= 90) {
                    progress = 90;
                    clearInterval(interval);
                }
                setUploadProgress((prev) => ({
                    ...prev,
                    resume: Math.round(progress),
                }));
            }, 300);

            profileForm.post(route("vendor.profile.resume.upload"), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    clearInterval(interval);
                    setUploadProgress((prev) => ({ ...prev, resume: 100 }));
                    setTimeout(() => {
                        if (resumeInputRef.current)
                            resumeInputRef.current.value = "";
                        setUploadProgress((prev) => ({
                            ...prev,
                            resume: null,
                        }));
                        router.reload({ only: ["user", "profileCompletion"] });
                    }, 500);
                },
                onError: () => {
                    clearInterval(interval);
                    setUploadProgress((prev) => ({ ...prev, resume: null }));
                },
            });
        }
    };

    const handleRemoveResume = () => {
        profileForm.delete(route("vendor.profile.resume.remove"), {
            preserveScroll: true,
            onSuccess: () =>
                router.reload({ only: ["user", "profileCompletion"] }),
        });
    };

    return (
        <div className="min-h-screen bg-cream-50">
            <VendorNavbar user={user} />

            <div className="flex items-start">
                <VendorSidebar
                    user={user}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                <main className="flex-1 min-w-0">
                    <div className="px-4 sm:px-6 lg:px-8 py-8">
                        {/* Success Flash */}
                        {flash?.success && (
                            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-3.5 rounded-lg text-sm font-medium flex items-center gap-3">
                                <svg
                                    className="w-5 h-5 shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {flash.success}
                            </div>
                        )}
                        {/* Error Flash */}
                        {flash?.error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-3.5 rounded-lg text-sm font-medium flex items-center gap-3">
                                <svg
                                    className="w-5 h-5 shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {flash.error}
                            </div>
                        )}

                        {/* Profile Header */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 mb-8">
                            {/* Profile Completion */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-gray-700">
                                        Profile Completion
                                    </span>
                                    <span className="text-sm font-bold text-brand-600">
                                        {profileCompletion}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
                                    <div
                                        className="bg-gradient-to-r from-brand-500 to-brand-700 h-3 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${profileCompletion}%`,
                                        }}
                                    ></div>
                                </div>
                                {profileCompletion < 100 && (
                                    <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                                        <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Complete more fields to reach 100%
                                        profile completion!
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-3xl bg-brand-600 text-white flex items-center justify-center text-3xl font-bold overflow-hidden">
                                        {user?.avatar ? (
                                            <img
                                                src={
                                                    avatarPreview ||
                                                    `/storage/${user.avatar}`
                                                }
                                                alt={user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span>
                                                {user?.name?.charAt(0) || "U"}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
                                        title="Change photo"
                                    >
                                        <svg
                                            className="w-4 h-4 text-gray-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg,image/webp"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Your Profile
                                    </p>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {user?.name || "Your Name"}
                                    </h1>
                                    <div className="mt-2 flex flex-wrap gap-2 items-center">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-sm font-semibold">
                                            {roleLabel}
                                        </span>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-cream-100 text-gray-600 text-sm">
                                            {user?.email}
                                        </span>
                                    </div>
                                </div>
                                {user?.avatar && (
                                    <button
                                        onClick={handleRemoveAvatar}
                                        className="ml-auto text-sm text-gray-400 hover:text-red-500 transition-colors font-medium"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            {uploadErrors.avatar && (
                                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium">
                                    {uploadErrors.avatar}
                                </div>
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="mb-0">
                            <div className="flex flex-wrap border-b border-gray-200 gap-0">
                                {[
                                    { id: "personal", label: "Personal Info" },
                                    {
                                        id: "professional",
                                        label: "Professional",
                                    },
                                    { id: "portfolio", label: "Portfolio" },
                                    { id: "social", label: "Social Links" },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-5 py-3.5 text-sm font-semibold transition-all border-b-2 -mb-px whitespace-nowrap ${
                                            activeTab === tab.id
                                                ? "text-brand-600 border-brand-600"
                                                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <form onSubmit={handleProfileSubmit}>
                            {activeTab === "personal" && (
                                <div className="bg-white rounded-b-3xl shadow-sm border border-t-0 border-gray-200 p-6 sm:p-8">
                                    <div className="mb-6">
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Personal Information
                                        </h2>
                                    </div>
                                    <div className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        profileForm.data.name
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            "name",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={
                                                        profileForm.data.email
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            "email",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                    Phone
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        profileForm.data.phone
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            "phone",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                    Location
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        profileForm.data
                                                            .location
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            "location",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                    Country
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        profileForm.data.country
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            "country",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        profileForm.data.city
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            "city",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Address
                                            </label>
                                            <textarea
                                                value={profileForm.data.address}
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        "address",
                                                        e.target.value,
                                                    )
                                                }
                                                rows={2}
                                                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm resize-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                About You
                                            </label>
                                            <textarea
                                                value={profileForm.data.bio}
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        "bio",
                                                        e.target.value,
                                                    )
                                                }
                                                rows={4}
                                                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm resize-none"
                                                placeholder="Tell clients what you do best and why they should work with you."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "professional" && (
                                <div className="bg-white rounded-b-3xl shadow-sm border border-t-0 border-gray-200 p-6 sm:p-8">
                                    <div className="mb-6">
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Professional Details
                                        </h2>
                                    </div>
                                    <div className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                    Professional Title
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        profileForm.data
                                                            .professional_title
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            "professional_title",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                    placeholder="e.g., Full Stack Developer"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                    Years of Experience
                                                </label>
                                                <select
                                                    value={
                                                        profileForm.data
                                                            .years_of_experience
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            "years_of_experience",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                >
                                                    <option value="">
                                                        Select...
                                                    </option>
                                                    <option value="Less than 1 year">
                                                        Less than 1 year
                                                    </option>
                                                    <option value="1-3 years">
                                                        1-3 years
                                                    </option>
                                                    <option value="3-5 years">
                                                        3-5 years
                                                    </option>
                                                    <option value="5-10 years">
                                                        5-10 years
                                                    </option>
                                                    <option value="10+ years">
                                                        10+ years
                                                    </option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                    Hourly Rate ($)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={
                                                        profileForm.data
                                                            .hourly_rate
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            "hourly_rate",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                    placeholder="25"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                    Delivery Time
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        profileForm.data
                                                            .delivery_time
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            "delivery_time",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                    placeholder="e.g., 2-3 days"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                    Service Type
                                                </label>
                                                <select
                                                    value={
                                                        profileForm.data
                                                            .service_type
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            "service_type",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                >
                                                    <option value="">
                                                        Select...
                                                    </option>
                                                    <option value="Online">
                                                        Online
                                                    </option>
                                                    <option value="Offline">
                                                        Offline
                                                    </option>
                                                    <option value="Both">
                                                        Both
                                                    </option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="vendor_emergency"
                                                checked={
                                                    profileForm.data
                                                        .emergency_service
                                                }
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        "emergency_service",
                                                        e.target.checked,
                                                    )
                                                }
                                                className="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500"
                                            />
                                            <label
                                                htmlFor="vendor_emergency"
                                                className="text-sm font-semibold text-gray-700"
                                            >
                                                Emergency Service Available
                                            </label>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Languages
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {languagesList.map((lang) => (
                                                    <button
                                                        key={lang}
                                                        type="button"
                                                        onClick={() =>
                                                            toggleArrayItem(
                                                                "languages",
                                                                lang,
                                                            )
                                                        }
                                                        className={`px-3 py-1.5 rounded-2xl border-2 transition-all duration-200 font-medium text-sm ${
                                                            (
                                                                profileForm.data
                                                                    .languages ||
                                                                []
                                                            ).includes(lang)
                                                                ? "border-transparent bg-gradient-to-r from-brand-600 to-brand-800 text-white"
                                                                : "border-gray-200 hover:border-gray-300 text-gray-700"
                                                        }`}
                                                    >
                                                        {lang}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Available Days
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {daysList.map((day) => (
                                                    <button
                                                        key={day}
                                                        type="button"
                                                        onClick={() =>
                                                            toggleArrayItem(
                                                                "available_days",
                                                                day,
                                                            )
                                                        }
                                                        className={`px-3 py-1.5 rounded-2xl border-2 transition-all duration-200 font-medium text-sm ${
                                                            (
                                                                profileForm.data
                                                                    .available_days ||
                                                                []
                                                            ).includes(day)
                                                                ? "border-transparent bg-gradient-to-r from-brand-600 to-brand-800 text-white"
                                                                : "border-gray-200 hover:border-gray-300 text-gray-700"
                                                        }`}
                                                    >
                                                        {day}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "portfolio" && (
                                <div className="bg-white rounded-b-3xl shadow-sm border border-t-0 border-gray-200 p-6 sm:p-8">
                                    <div className="mb-6">
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Portfolio & Certifications
                                        </h2>
                                    </div>
                                    <div className="space-y-8">
                                        {/* Certificates */}
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <svg
                                                    className="w-5 h-5 text-brand-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.8}
                                                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"
                                                    />
                                                </svg>
                                                Certificates
                                            </h3>
                                            <div
                                                onClick={() =>
                                                    certificateInputRef.current?.click()
                                                }
                                                className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/50 transition-all mb-4"
                                            >
                                                <svg
                                                    className="w-10 h-10 text-gray-400 mx-auto mb-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                    />
                                                </svg>
                                                <p className="text-gray-600 font-semibold">
                                                    Click to upload certificate
                                                </p>
                                                <div className="mt-2 space-y-1">
                                                    <p className="text-xs text-amber-600 font-medium flex items-center justify-center gap-1">
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        Allowed formats: JPG,
                                                        PNG, PDF
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        Maximum file size: 5 MB
                                                    </p>
                                                </div>
                                            </div>
                                            {uploadProgress.certificate !==
                                                null && (
                                                <div className="mb-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-semibold text-brand-600">
                                                            Uploading
                                                            certificate...
                                                        </span>
                                                        <span className="text-sm font-bold text-brand-600">
                                                            {
                                                                uploadProgress.certificate
                                                            }
                                                            %
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                                        <div
                                                            className="bg-brand-600 h-2 rounded-full transition-all duration-300"
                                                            style={{
                                                                width: `${uploadProgress.certificate}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}
                                            {uploadErrors.certificate && (
                                                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium">
                                                    {uploadErrors.certificate}
                                                </div>
                                            )}
                                            <input
                                                ref={certificateInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/jpg,image/webp,application/pdf"
                                                onChange={
                                                    handleCertificateUpload
                                                }
                                                className="hidden"
                                            />
                                            {(user?.certifications || [])
                                                .length > 0 && (
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                    {(
                                                        user?.certifications ||
                                                        []
                                                    ).map((cert, index) => (
                                                        <div
                                                            key={index}
                                                            className="relative group"
                                                        >
                                                            <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center">
                                                                {cert.endsWith(
                                                                    ".pdf",
                                                                ) ? (
                                                                    <div className="text-center p-4">
                                                                        <svg
                                                                            className="w-10 h-10 text-red-500 mx-auto mb-2"
                                                                            fill="currentColor"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM9 11h6v2H9v-2zm0 4h6v2H9v-2zm0-8h4v2H9V7z" />
                                                                        </svg>
                                                                        <p className="text-xs text-gray-500 truncate px-2">
                                                                            Certificate{" "}
                                                                            {index +
                                                                                1}
                                                                        </p>
                                                                    </div>
                                                                ) : (
                                                                    <img
                                                                        src={`/storage/${cert}`}
                                                                        alt={`Certificate ${index + 1}`}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                )}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRemoveCertificate(
                                                                        index,
                                                                    )
                                                                }
                                                                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Portfolio Images */}
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <svg
                                                    className="w-5 h-5 text-brand-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.8}
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                Portfolio Images
                                            </h3>
                                            <div
                                                onClick={() =>
                                                    portfolioImageInputRef.current?.click()
                                                }
                                                className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/50 transition-all mb-4"
                                            >
                                                <svg
                                                    className="w-10 h-10 text-gray-400 mx-auto mb-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                    />
                                                </svg>
                                                <p className="text-gray-600 font-semibold">
                                                    Click to upload portfolio
                                                    image
                                                </p>
                                                <div className="mt-2 space-y-1">
                                                    <p className="text-xs text-amber-600 font-medium flex items-center justify-center gap-1">
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        Allowed formats: JPG,
                                                        PNG, WebP
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        Maximum file size: 5 MB
                                                    </p>
                                                </div>
                                            </div>
                                            {uploadProgress.portfolioImage !==
                                                null && (
                                                <div className="mb-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-semibold text-brand-600">
                                                            Uploading portfolio
                                                            image...
                                                        </span>
                                                        <span className="text-sm font-bold text-brand-600">
                                                            {
                                                                uploadProgress.portfolioImage
                                                            }
                                                            %
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                                        <div
                                                            className="bg-brand-600 h-2 rounded-full transition-all duration-300"
                                                            style={{
                                                                width: `${uploadProgress.portfolioImage}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}
                                            {uploadErrors.portfolioImage && (
                                                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium">
                                                    {
                                                        uploadErrors.portfolioImage
                                                    }
                                                </div>
                                            )}
                                            <input
                                                ref={portfolioImageInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                                onChange={
                                                    handlePortfolioImageUpload
                                                }
                                                className="hidden"
                                            />
                                            {(user?.portfolio_images || [])
                                                .length > 0 && (
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                    {(
                                                        user?.portfolio_images ||
                                                        []
                                                    ).map((image, index) => (
                                                        <div
                                                            key={index}
                                                            className="relative group"
                                                        >
                                                            <img
                                                                src={`/storage/${image}`}
                                                                alt={`Portfolio ${index + 1}`}
                                                                className="aspect-square w-full object-cover rounded-2xl border border-gray-200"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRemovePortfolioImage(
                                                                        index,
                                                                    )
                                                                }
                                                                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Portfolio Videos */}
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <svg
                                                    className="w-5 h-5 text-brand-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.8}
                                                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                Portfolio Videos
                                            </h3>
                                            <div
                                                onClick={() =>
                                                    portfolioVideoInputRef.current?.click()
                                                }
                                                className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/50 transition-all mb-4"
                                            >
                                                <svg
                                                    className="w-10 h-10 text-gray-400 mx-auto mb-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                    />
                                                </svg>
                                                <p className="text-gray-600 font-semibold">
                                                    Click to upload portfolio
                                                    video
                                                </p>
                                                <div className="mt-2 space-y-1">
                                                    <p className="text-xs text-amber-600 font-medium flex items-center justify-center gap-1">
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        Allowed formats: MP4,
                                                        MOV, AVI, WebM
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        Maximum file size: 50 MB
                                                    </p>
                                                </div>
                                            </div>
                                            {uploadProgress.portfolioVideo !==
                                                null && (
                                                <div className="mb-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-semibold text-brand-600">
                                                            Uploading portfolio
                                                            video...
                                                        </span>
                                                        <span className="text-sm font-bold text-brand-600">
                                                            {
                                                                uploadProgress.portfolioVideo
                                                            }
                                                            %
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                                        <div
                                                            className="bg-brand-600 h-2 rounded-full transition-all duration-300"
                                                            style={{
                                                                width: `${uploadProgress.portfolioVideo}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}
                                            {uploadErrors.portfolioVideo && (
                                                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium">
                                                    {
                                                        uploadErrors.portfolioVideo
                                                    }
                                                </div>
                                            )}
                                            <input
                                                ref={portfolioVideoInputRef}
                                                type="file"
                                                accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
                                                onChange={
                                                    handlePortfolioVideoUpload
                                                }
                                                className="hidden"
                                            />
                                            {(user?.portfolio_videos || [])
                                                .length > 0 && (
                                                <div className="space-y-3">
                                                    {(
                                                        user?.portfolio_videos ||
                                                        []
                                                    ).map((video, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between p-4 bg-cream-100 rounded-2xl border border-gray-200"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center">
                                                                    <svg
                                                                        className="w-6 h-6 text-brand-600"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={
                                                                                2
                                                                            }
                                                                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-gray-800">
                                                                        Video{" "}
                                                                        {index +
                                                                            1}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {video
                                                                            .split(
                                                                                "/",
                                                                            )
                                                                            .pop()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRemovePortfolioVideo(
                                                                        index,
                                                                    )
                                                                }
                                                                className="text-red-500 hover:text-red-700 font-semibold"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Resume/CV */}
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <svg
                                                    className="w-5 h-5 text-brand-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.8}
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                                Resume/CV
                                            </h3>
                                            {user?.resume_cv ? (
                                                <div className="flex items-center justify-between p-4 bg-cream-100 rounded-2xl border border-gray-200">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                                                            <svg
                                                                className="w-6 h-6 text-amber-700"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        1.8
                                                                    }
                                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-800">
                                                                Resume/CV
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {user.resume_cv
                                                                    .split("/")
                                                                    .pop()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <a
                                                            href={`/storage/${user.resume_cv}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-brand-600 hover:text-brand-800 font-semibold text-sm"
                                                        >
                                                            View
                                                        </a>
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                handleRemoveResume
                                                            }
                                                            className="text-red-500 hover:text-red-700 font-semibold text-sm"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() =>
                                                        resumeInputRef.current?.click()
                                                    }
                                                    className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/50 transition-all"
                                                >
                                                    <svg
                                                        className="w-10 h-10 text-gray-400 mx-auto mb-2"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={1.5}
                                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                        />
                                                    </svg>
                                                    <p className="text-gray-600 font-semibold">
                                                        Click to upload
                                                        Resume/CV
                                                    </p>
                                                    <div className="mt-2 space-y-1">
                                                        <p className="text-xs text-amber-600 font-medium flex items-center justify-center gap-1">
                                                            <svg
                                                                className="w-4 h-4"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                            Allowed formats:
                                                            PDF, DOC, DOCX
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            Maximum file size: 5
                                                            MB
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {uploadProgress.resume !== null && (
                                                <div className="mb-4 mt-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-semibold text-brand-600">
                                                            Uploading resume...
                                                        </span>
                                                        <span className="text-sm font-bold text-brand-600">
                                                            {
                                                                uploadProgress.resume
                                                            }
                                                            %
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                                        <div
                                                            className="bg-brand-600 h-2 rounded-full transition-all duration-300"
                                                            style={{
                                                                width: `${uploadProgress.resume}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}
                                            {uploadErrors.resume && (
                                                <div className="mb-4 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium">
                                                    {uploadErrors.resume}
                                                </div>
                                            )}
                                            <input
                                                ref={resumeInputRef}
                                                type="file"
                                                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                onChange={handleResumeUpload}
                                                className="hidden"
                                            />
                                        </div>

                                        {/* Previous Work Links */}
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <svg
                                                    className="w-5 h-5 text-brand-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.8}
                                                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                                    />
                                                </svg>
                                                Previous Work Links
                                            </h3>
                                            <div className="flex gap-2">
                                                <input
                                                    type="url"
                                                    value={
                                                        profileForm.data
                                                            .previous_work_input
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            "previous_work_input",
                                                            e.target.value,
                                                        )
                                                    }
                                                    onKeyPress={(e) =>
                                                        e.key === "Enter" &&
                                                        (e.preventDefault(),
                                                        addPreviousWorkLink())
                                                    }
                                                    className="flex-1 px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                    placeholder="https://yourwork.com"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={
                                                        addPreviousWorkLink
                                                    }
                                                    className="px-4 py-2.5 bg-brand-600 text-white rounded-2xl font-semibold hover:bg-brand-700 transition-colors"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                            {(user?.previous_work_links || [])
                                                .length > 0 && (
                                                <div className="mt-3 space-y-2">
                                                    {(
                                                        user?.previous_work_links ||
                                                        []
                                                    ).map((link, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex items-center justify-between px-3 py-2 bg-cream-100 rounded-2xl border border-gray-200"
                                                        >
                                                            <a
                                                                href={link}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-sm text-brand-600 hover:underline truncate"
                                                            >
                                                                {link}
                                                            </a>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removePreviousWorkLink(
                                                                        link,
                                                                    )
                                                                }
                                                                className="text-red-500 hover:text-red-700 font-semibold"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "social" && (
                                <div className="bg-white rounded-b-3xl shadow-sm border border-t-0 border-gray-200 p-6 sm:p-8">
                                    <div className="mb-6">
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Social Links
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                LinkedIn
                                            </label>
                                            <input
                                                type="url"
                                                value={
                                                    profileForm.data.linkedin
                                                }
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        "linkedin",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                placeholder="https://linkedin.com/in/yourprofile"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                GitHub
                                            </label>
                                            <input
                                                type="url"
                                                value={profileForm.data.github}
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        "github",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                placeholder="https://github.com/yourusername"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Behance
                                            </label>
                                            <input
                                                type="url"
                                                value={profileForm.data.behance}
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        "behance",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                placeholder="https://behance.net/yourusername"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Dribbble
                                            </label>
                                            <input
                                                type="url"
                                                value={
                                                    profileForm.data.dribbble
                                                }
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        "dribbble",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                placeholder="https://dribbble.com/yourusername"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Website
                                            </label>
                                            <input
                                                type="url"
                                                value={profileForm.data.website}
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        "website",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                placeholder="https://yourwebsite.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Facebook
                                            </label>
                                            <input
                                                type="url"
                                                value={
                                                    profileForm.data.facebook
                                                }
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        "facebook",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                placeholder="https://facebook.com/yourprofile"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Instagram
                                            </label>
                                            <input
                                                type="url"
                                                value={
                                                    profileForm.data.instagram
                                                }
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        "instagram",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
                                                placeholder="https://instagram.com/yourusername"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(activeTab === "personal" ||
                                activeTab === "professional" ||
                                activeTab === "social") && (
                                <div className="bg-white border-t border-gray-200 p-6 sm:p-8 rounded-b-3xl">
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={profileForm.processing}
                                            className="px-8 py-3 bg-brand-600 text-white text-sm font-bold rounded-2xl hover:bg-brand-700 transition-colors disabled:opacity-50"
                                        >
                                            {profileForm.processing
                                                ? "Saving..."
                                                : "Save Changes"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
