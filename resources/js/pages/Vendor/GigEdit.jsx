import React, { useRef, useState } from "react";
import { useForm, Link, usePage } from "@inertiajs/react";
import VendorNavbar from "../../components/VendorNavbar";
import VendorSidebar from "../../components/VendorSidebar";
import CreatableSelect from "react-select/creatable";

const categories = [
    {
        id: "developers",
        name: "Developers",
        icon: "👨‍💻",
        description: "Web, Mobile, & Software Developers",
        color: "from-blue-500 to-cyan-500",
        fields: [
            {
                name: "primary_skills",
                label: "Primary Skills",
                type: "text",
                placeholder: "e.g., Full Stack Developer",
            },
            {
                name: "programming_languages",
                label: "Programming Languages",
                type: "tags",
                placeholder: "Add programming languages...",
                suggestions: [
                    "JavaScript",
                    "TypeScript",
                    "Python",
                    "Java",
                    "PHP",
                    "Go",
                    "Rust",
                    "Swift",
                    "Kotlin",
                    "C#",
                    "C++",
                    "Other",
                ],
            },
            {
                name: "frameworks",
                label: "Frameworks",
                type: "tags",
                placeholder: "Add frameworks...",
                suggestions: [
                    "Laravel",
                    "React",
                    "Vue",
                    "Angular",
                    "Node.js",
                    "Express",
                    "Next.js",
                    "Nuxt.js",
                    "Django",
                    "Flask",
                    "Spring Boot",
                    "Other",
                ],
            },
            {
                name: "databases",
                label: "Databases",
                type: "tags",
                placeholder: "Add databases...",
                suggestions: [
                    "MySQL",
                    "PostgreSQL",
                    "MongoDB",
                    "SQLite",
                    "Redis",
                    "Oracle",
                    "SQL Server",
                    "Firebase",
                    "Other",
                ],
            },
            {
                name: "cloud_platforms",
                label: "Cloud Platforms",
                type: "tags",
                placeholder: "Add cloud platforms...",
                suggestions: [
                    "AWS",
                    "Google Cloud",
                    "Azure",
                    "DigitalOcean",
                    "Vercel",
                    "Netlify",
                    "Heroku",
                    "Firebase",
                    "Other",
                ],
            },
            {
                name: "technologies",
                label: "Technologies",
                type: "tags",
                placeholder: "Add technologies...",
                suggestions: [
                    "Git",
                    "Docker",
                    "Kubernetes",
                    "REST API",
                    "GraphQL",
                    "WebSocket",
                    "Redis",
                    "Elasticsearch",
                    "Other",
                ],
            },
            {
                name: "project_type",
                label: "Project Type",
                type: "tags",
                placeholder: "Add project types...",
                suggestions: [
                    "Web App",
                    "Mobile App",
                    "E-commerce",
                    "API",
                    "Dashboard",
                    "Landing Page",
                    "SaaS",
                    "MVP",
                    "Other",
                ],
            },
        ],
    },
    {
        id: "designers",
        name: "Designers",
        icon: "🎨",
        description: "UI/UX, Graphic, & Product Designers",
        color: "from-pink-500 to-rose-500",
        fields: [
            {
                name: "primary_skills",
                label: "Primary Skills",
                type: "text",
                placeholder: "e.g., UI/UX Designer",
            },
            {
                name: "design_tools",
                label: "Design Tools",
                type: "tags",
                placeholder: "Add design tools...",
                suggestions: [
                    "Figma",
                    "Adobe XD",
                    "Sketch",
                    "Photoshop",
                    "Illustrator",
                    "InDesign",
                    "Canva",
                    "FigJam",
                    "Other",
                ],
            },
            {
                name: "design_specialization",
                label: "Design Specialization",
                type: "tags",
                placeholder: "Add specializations...",
                suggestions: [
                    "UI Design",
                    "UX Design",
                    "Graphic Design",
                    "Product Design",
                    "Web Design",
                    "Mobile Design",
                    "Brand Identity",
                    "Motion Design",
                    "Other",
                ],
            },
            {
                name: "portfolio_link",
                label: "Portfolio Link",
                type: "text",
                placeholder: "https://yourportfolio.com",
            },
        ],
    },
    {
        id: "writers",
        name: "Writers",
        icon: "✍️",
        description: "Content, Copy, & Creative Writers",
        color: "from-emerald-500 to-teal-500",
        fields: [
            {
                name: "primary_skills",
                label: "Primary Skills",
                type: "text",
                placeholder: "e.g., Content Writer",
            },
            {
                name: "writing_specialization",
                label: "Writing Specialization",
                type: "tags",
                placeholder: "Add specializations...",
                suggestions: [
                    "Content Writing",
                    "Copywriting",
                    "Blog Writing",
                    "Technical Writing",
                    "Creative Writing",
                    "SEO Writing",
                    "Social Media",
                    "Ghostwriting",
                    "Other",
                ],
            },
            {
                name: "portfolio_link",
                label: "Portfolio Link",
                type: "text",
                placeholder: "https://yourportfolio.com",
            },
        ],
    },
    {
        id: "photographers",
        name: "Photographers",
        icon: "📸",
        description: "Portrait, Event, & Commercial Photographers",
        color: "from-amber-500 to-orange-500",
        fields: [
            {
                name: "primary_skills",
                label: "Primary Skills",
                type: "text",
                placeholder: "e.g., Wedding Photographer",
            },
            {
                name: "photography_style",
                label: "Photography Style",
                type: "tags",
                placeholder: "Add styles...",
                suggestions: [
                    "Portrait",
                    "Wedding",
                    "Event",
                    "Product",
                    "Fashion",
                    "Landscape",
                    "Street",
                    "Architectural",
                    "Other",
                ],
            },
            {
                name: "portfolio_link",
                label: "Portfolio Link",
                type: "text",
                placeholder: "https://yourportfolio.com",
            },
        ],
    },
    {
        id: "video-editors",
        name: "Video Editors",
        icon: "🎬",
        description: "Video Production & Editing Experts",
        color: "from-purple-500 to-violet-500",
        fields: [
            {
                name: "primary_skills",
                label: "Primary Skills",
                type: "text",
                placeholder: "e.g., Video Editor",
            },
            {
                name: "video_tools",
                label: "Video Tools",
                type: "tags",
                placeholder: "Add tools...",
                suggestions: [
                    "Premiere Pro",
                    "After Effects",
                    "Final Cut Pro",
                    "DaVinci Resolve",
                    "CapCut",
                    "Filmora",
                    "iMovie",
                    "Avid Media Composer",
                    "Other",
                ],
            },
            {
                name: "portfolio_link",
                label: "Portfolio Link",
                type: "text",
                placeholder: "https://yourportfolio.com",
            },
        ],
    },
    {
        id: "musicians",
        name: "Musicians",
        icon: "🎵",
        description: "Producers, Composers, & Audio Engineers",
        color: "from-fuchsia-500 to-pink-500",
        fields: [
            {
                name: "primary_skills",
                label: "Primary Skills",
                type: "text",
                placeholder: "e.g., Music Producer",
            },
            {
                name: "music_genres",
                label: "Music Genres",
                type: "tags",
                placeholder: "Add genres...",
                suggestions: [
                    "Pop",
                    "Rock",
                    "Hip Hop",
                    "Jazz",
                    "Classical",
                    "Electronic",
                    "R&B",
                    "Country",
                    "EDM",
                    "Other",
                ],
            },
            {
                name: "portfolio_link",
                label: "Portfolio Link",
                type: "text",
                placeholder: "https://yourportfolio.com",
            },
        ],
    },
    {
        id: "teachers",
        name: "Teachers",
        icon: "👨‍🏫",
        description: "Tutors & Online Educators",
        color: "from-indigo-500 to-blue-500",
        fields: [
            {
                name: "primary_skills",
                label: "Primary Skills",
                type: "text",
                placeholder: "e.g., Math Tutor",
            },
            {
                name: "subjects",
                label: "Subjects",
                type: "tags",
                placeholder: "Add subjects...",
                suggestions: [
                    "Mathematics",
                    "Physics",
                    "Chemistry",
                    "Biology",
                    "English",
                    "Programming",
                    "History",
                    "Economics",
                    "Other",
                ],
            },
            {
                name: "teaching_level",
                label: "Teaching Level",
                type: "tags",
                placeholder: "Add levels...",
                suggestions: [
                    "Beginner",
                    "Intermediate",
                    "Advanced",
                    "High School",
                    "College",
                    "University",
                    "Professional",
                    "Other",
                ],
            },
        ],
    },
    {
        id: "consultants",
        name: "Consultants",
        icon: "💼",
        description: "Business & Strategy Consultants",
        color: "from-slate-500 to-gray-600",
        fields: [
            {
                name: "primary_skills",
                label: "Primary Skills",
                type: "text",
                placeholder: "e.g., Business Consultant",
            },
            {
                name: "consulting_areas",
                label: "Consulting Areas",
                type: "tags",
                placeholder: "Add areas...",
                suggestions: [
                    "Business Strategy",
                    "Marketing",
                    "Finance",
                    "Operations",
                    "Human Resources",
                    "IT Consulting",
                    "Digital Transformation",
                    "Startups",
                    "Other",
                ],
            },
            {
                name: "portfolio_link",
                label: "Portfolio Link",
                type: "text",
                placeholder: "https://yourportfolio.com",
            },
        ],
    },
];

export default function GigEdit({ gig, user }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        title: gig.title || "",
        description: gig.description || "",
        price: gig.price || "",
        category: gig.category || "",
        tags: gig.tags || [],
        tagInput: "",
        category_fields: gig.category_fields || {},
        category_field_tags: gig.category_fields || {},
        image: null,
        _method: "PUT",
    });
    const fileInputRef = useRef(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const selectedCategory = categories.find((c) => c.id === data.category);

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = { ...data };
        delete submitData.tagInput;
        delete submitData.category_field_tags;
        Object.keys(data.category_field_tags || {}).forEach((key) => {
            submitData.category_fields[key] = data.category_field_tags[key];
        });
        setData(submitData);
        post(`/vendor/gigs/${gig.uuid}`, {
            forceFormData: true,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setData("image", file);
    };

    const removeImage = () => {
        setData("image", null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const addTag = (e) => {
        if (e.key === "Enter" && data.tagInput.trim()) {
            e.preventDefault();
            if (!data.tags.includes(data.tagInput.trim())) {
                setData("tags", [...data.tags, data.tagInput.trim()]);
            }
            setData("tagInput", "");
        }
    };

    const removeTag = (tag) => {
        setData(
            "tags",
            data.tags.filter((t) => t !== tag),
        );
    };

    const handleCategoryFieldChange = (fieldName, value) => {
        setData("category_fields", {
            ...data.category_fields,
            [fieldName]: value,
        });
    };

    const addCategoryTag = (fieldName, e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const input = e.target.value;
            if (input.trim()) {
                const currentTags =
                    data.category_field_tags?.[fieldName] ||
                    data.category_fields?.[fieldName] ||
                    [];
                if (!currentTags.includes(input.trim())) {
                    setData("category_field_tags", {
                        ...data.category_field_tags,
                        [fieldName]: [...currentTags, input.trim()],
                    });
                }
                e.target.value = "";
            }
        }
    };

    const removeCategoryTag = (fieldName, tag) => {
        const currentTags =
            data.category_field_tags?.[fieldName] ||
            data.category_fields?.[fieldName] ||
            [];
        setData("category_field_tags", {
            ...data.category_field_tags,
            [fieldName]: currentTags.filter((t) => t !== tag),
        });
    };

    const getCategoryTags = (fieldName) => {
        return (
            data.category_field_tags?.[fieldName] ||
            data.category_fields?.[fieldName] ||
            []
        );
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
                    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                        {/* Flash messages */}
                        {flash?.success && (
                            <div className="mb-6 bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3">
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
                        {flash?.error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3">
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
                        <div className="mb-6">
                            <Link
                                href="/vendor/gigs"
                                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-3"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                                Back to My Gigs
                            </Link>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                                Edit Gig
                            </h1>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                        >
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                                        Service Details
                                    </h2>
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                value={data.title}
                                                onChange={(e) =>
                                                    setData(
                                                        "title",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all"
                                            />
                                            {errors.title && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.title}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                value={data.description}
                                                onChange={(e) =>
                                                    setData(
                                                        "description",
                                                        e.target.value,
                                                    )
                                                }
                                                rows={6}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all resize-none"
                                            />
                                            {errors.description && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Price ($)
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                                                        $
                                                    </span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="5"
                                                        value={data.price}
                                                        onChange={(e) =>
                                                            setData(
                                                                "price",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all"
                                                    />
                                                </div>
                                                {errors.price && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.price}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Category
                                                </label>
                                                {data.category &&
                                                selectedCategory ? (
                                                    <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 flex items-center gap-3">
                                                        <span className="text-2xl">
                                                            {
                                                                selectedCategory.icon
                                                            }
                                                        </span>
                                                        <span className="font-semibold text-gray-900">
                                                            {
                                                                selectedCategory.name
                                                            }
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={data.category}
                                                        onChange={(e) =>
                                                            setData(
                                                                "category",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all capitalize"
                                                        placeholder="Enter category"
                                                    />
                                                )}
                                                {errors.category && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.category}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {data.category && selectedCategory && (
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                                            {selectedCategory.name} Specific
                                            Details
                                        </h2>
                                        <div className="space-y-6">
                                            {selectedCategory.fields.map(
                                                (field) => (
                                                    <div key={field.name}>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                                            {field.label}
                                                        </label>

                                                        {field.type ===
                                                            "text" && (
                                                            <input
                                                                type="text"
                                                                value={
                                                                    data
                                                                        .category_fields[
                                                                        field
                                                                            .name
                                                                    ] || ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleCategoryFieldChange(
                                                                        field.name,
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all"
                                                                placeholder={
                                                                    field.placeholder
                                                                }
                                                            />
                                                        )}

                                                        {field.type === "tags" && (
                                                            <CreatableSelect
                                                                isMulti
                                                                value={(getCategoryTags(field.name) || []).map((v) => ({
                                                                    value: v,
                                                                    label: v,
                                                                }))}
                                                                onChange={(newValue) => {
                                                                    const tags = newValue
                                                                        ? newValue.map((v) => v.value)
                                                                        : [];
                                                                    setData("category_field_tags", {
                                                                        ...data.category_field_tags,
                                                                        [field.name]: tags,
                                                                    });
                                                                }}
                                                                options={(field.suggestions || []).map((s) => ({
                                                                    value: s,
                                                                    label: s,
                                                                }))}
                                                                placeholder={field.placeholder}
                                                                className="w-full"
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        borderRadius: "0.75rem",
                                                                        borderColor: "#e5e7eb",
                                                                        padding: "0.25rem 0.5rem",
                                                                        "&:hover": {
                                                                            borderColor: "#e5e7eb",
                                                                        },
                                                                    }),
                                                                    multiValue: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: "#dbeafe",
                                                                        color: "#1e40af",
                                                                        borderRadius: "9999px",
                                                                        padding: "0.25rem 0.5rem",
                                                                    }),
                                                                    multiValueLabel: (base) => ({
                                                                        ...base,
                                                                        color: "#1e40af",
                                                                    }),
                                                                    multiValueRemove: (base) => ({
                                                                        ...base,
                                                                        color: "#1e40af",
                                                                        "&:hover": {
                                                                            backgroundColor: "#bfdbfe",
                                                                            color: "#1e3a8a",
                                                                        },
                                                                    }),
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-8">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                    <h2 className="text-lg font-bold text-gray-900 mb-6">
                                        Image
                                    </h2>
                                    {data.image ? (
                                        <div className="relative group">
                                            <img
                                                src={URL.createObjectURL(
                                                    data.image,
                                                )}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-xl border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                            >
                                                ×
                                            </button>
                                            <p className="text-sm text-gray-500 mt-2 truncate">
                                                {data.image.name}
                                            </p>
                                        </div>
                                    ) : gig.image ? (
                                        <div className="relative group">
                                            <img
                                                src={`/storage/${gig.image}`}
                                                alt="Current"
                                                className="w-full h-48 object-cover rounded-xl border border-gray-200"
                                            />
                                            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                                                Current
                                            </div>
                                        </div>
                                    ) : null}
                                    <div
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className={`mt-3 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/50 transition-all`}
                                    >
                                        <svg
                                            className="w-8 h-8 text-gray-400 mx-auto mb-2"
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
                                        <p className="text-gray-600 font-medium">
                                            {gig.image || data.image
                                                ? "Change image"
                                                : "Upload an image"}
                                        </p>
                                        <p className="text-gray-400 text-xs mt-1">
                                            PNG, JPG, WEBP up to 2MB
                                        </p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg,image/webp"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    {errors.image && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.image}
                                        </p>
                                    )}
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                    <h2 className="text-lg font-bold text-gray-900 mb-6">
                                        Tags
                                    </h2>
                                    <input
                                        type="text"
                                        value={data.tagInput}
                                        onChange={(e) =>
                                            setData("tagInput", e.target.value)
                                        }
                                        onKeyPress={addTag}
                                        placeholder="Type a tag and press Enter"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all"
                                    />
                                    {data.tags.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {data.tags.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-100 text-brand-800 font-medium text-sm"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeTag(tag)
                                                        }
                                                        className="hover:text-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                                        Status
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`w-3 h-3 rounded-full ${gig.active ? "bg-success-500" : "bg-gray-400"}`}
                                        ></span>
                                        <span className="text-sm font-medium text-gray-700">
                                            {gig.active ? "Active" : "Paused"}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Toggle status from the gigs list page
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full px-6 py-3 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-colors disabled:opacity-50"
                                    >
                                        {processing
                                            ? "Saving..."
                                            : "Save Changes"}
                                    </button>
                                    <Link
                                        href="/vendor/gigs"
                                        className="w-full px-6 py-3 rounded-xl border border-cream-300 text-gray-700 font-semibold text-center hover:bg-cream-100 transition-colors"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
