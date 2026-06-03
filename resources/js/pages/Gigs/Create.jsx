import React, { useState, useRef } from "react";
import { useForm, Link } from "@inertiajs/react";
import Navbar from "../../components/Navbar";
import VendorNavbar from "../../components/VendorNavbar";
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

export default function Create({ user, submitPath, cancelPath }) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        price: "",
        category: "",
        tags: [],
        tagInput: "",
        category_fields: {},
        category_field_tags: {},
        image: null,
    });
    const fileInputRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [modalStep, setModalStep] = useState(1);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showGigForm, setShowGigForm] = useState(false);
    
    // Check if terms were already accepted in this session
    const hasAcceptedTerms = localStorage.getItem('terms_accepted') === 'true';

    const isVendor = user?.roles?.some(
        (role) => role.name === "freelancer" || role.name === "vendor",
    );
    const NavbarComponent = isVendor ? VendorNavbar : Navbar;

    const selectedCategory = categories.find((c) => c.id === data.category);

    const handleCategorySelect = (categoryId) => {
        setData("category", categoryId);
        if (hasAcceptedTerms) {
            // If terms already accepted, skip modal and show form directly
            setShowGigForm(true);
            setShowModal(false);
        } else {
            setShowModal(true);
            setModalStep(1);
            setTermsAccepted(false);
            setShowGigForm(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = { ...data };
        delete submitData.tagInput;
        delete submitData.category_field_tags;
        Object.keys(data.category_field_tags || {}).forEach((key) => {
            submitData.category_fields[key] = data.category_field_tags[key];
        });
        setData(submitData);
        post(submitPath || "/gigs", {
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
            <NavbarComponent user={user} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                            Create New Service
                        </h1>
                        <p className="mt-2 text-lg text-gray-600 font-medium">
                            Share your skills and start getting hired by amazing
                            clients.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {!data.category ? (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">
                                    Step 1: Choose a category
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {categories.map((category) => (
                                        <div
                                            key={category.id}
                                            onClick={() =>
                                                handleCategorySelect(category.id)
                                            }
                                            className="p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] border-gray-200 hover:border-gray-300 bg-white"
                                        >
                                            <div className="text-center">
                                                <span className="text-3xl sm:text-4xl mb-2 sm:mb-3 block">
                                                    {category.icon}
                                                </span>
                                                <h3 className="font-bold text-sm sm:text-lg text-gray-900">
                                                    {category.name}
                                                </h3>
                                                <p className="text-xs sm:text-sm mt-1 text-gray-500">
                                                    {category.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : !showGigForm ? (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">
                                    You've selected a category!
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Please review and accept our terms to continue.
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${selectedCategory?.color} text-white`}>
                                        {selectedCategory?.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">
                                            {selectedCategory?.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {selectedCategory?.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setData("category", "")}
                                        className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                                    >
                                        Change Category
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (hasAcceptedTerms) {
                                                setShowGigForm(true);
                                            } else {
                                                setShowModal(true);
                                            }
                                        }}
                                        className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors"
                                    >
                                        {hasAcceptedTerms ? 'Continue to Create Gig' : 'Continue to Terms'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                            <span
                                                className={`w-10 h-10 bg-gradient-to-br ${selectedCategory.color} rounded-xl flex items-center justify-center text-white text-lg font-bold`}
                                            >
                                                2
                                            </span>
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
                                                    placeholder="e.g., Build a professional website"
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
                                                    placeholder="Describe your service in detail..."
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
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all"
                                                            placeholder="50"
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
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setData(
                                                                    "category",
                                                                    "",
                                                                )
                                                            }
                                                            className="ml-auto text-sm text-gray-500 hover:text-gray-700"
                                                        >
                                                            Change
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                            <span
                                                className={`w-10 h-10 bg-gradient-to-br ${selectedCategory.color} rounded-xl flex items-center justify-center text-white text-lg font-bold`}
                                            >
                                                3
                                            </span>
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

                                                        {field.type ===
                                                            "tags" && (
                                                            <CreatableSelect
                                                                isMulti
                                                                value={(
                                                                    getCategoryTags(
                                                                        field.name,
                                                                    ) || []
                                                                ).map((v) => ({
                                                                    value: v,
                                                                    label: v,
                                                                }))}
                                                                onChange={(
                                                                    newValue,
                                                                ) => {
                                                                    const tags =
                                                                        newValue
                                                                            ? newValue.map(
                                                                                  (
                                                                                      v,
                                                                                  ) =>
                                                                                      v.value,
                                                                              )
                                                                            : [];
                                                                    setData(
                                                                        "category_field_tags",
                                                                        {
                                                                            ...data.category_field_tags,
                                                                            [field.name]:
                                                                                tags,
                                                                        },
                                                                    );
                                                                }}
                                                                options={(
                                                                    field.suggestions ||
                                                                    []
                                                                ).map((s) => ({
                                                                    value: s,
                                                                    label: s,
                                                                }))}
                                                                placeholder={
                                                                    field.placeholder
                                                                }
                                                                className="w-full"
                                                                styles={{
                                                                    control: (
                                                                        base,
                                                                    ) => ({
                                                                        ...base,
                                                                        borderRadius:
                                                                            "0.75rem",
                                                                        borderColor:
                                                                            "#e5e7eb",
                                                                        padding:
                                                                            "0.25rem 0.5rem",
                                                                        "&:hover":
                                                                            {
                                                                                borderColor:
                                                                                    "#e5e7eb",
                                                                            },
                                                                    }),
                                                                    multiValue:
                                                                        (
                                                                            base,
                                                                        ) => ({
                                                                            ...base,
                                                                            backgroundColor:
                                                                                "#dbeafe",
                                                                            color: "#1e40af",
                                                                            borderRadius:
                                                                                "9999px",
                                                                            padding:
                                                                                "0.25rem 0.5rem",
                                                                        }),
                                                                    multiValueLabel:
                                                                        (
                                                                            base,
                                                                        ) => ({
                                                                            ...base,
                                                                            color: "#1e40af",
                                                                        }),
                                                                    multiValueRemove:
                                                                        (
                                                                            base,
                                                                        ) => ({
                                                                            ...base,
                                                                            color: "#1e40af",
                                                                            "&:hover":
                                                                                {
                                                                                    backgroundColor:
                                                                                        "#bfdbfe",
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
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                            <span
                                                className={`w-10 h-10 bg-gradient-to-br ${selectedCategory.color} rounded-xl flex items-center justify-center text-white text-lg font-bold`}
                                            >
                                                4
                                            </span>
                                            Service Image
                                        </h2>

                                        <div>
                                            {data.image ? (
                                                <div className="relative group">
                                                    <img
                                                        src={URL.createObjectURL(
                                                            data.image,
                                                        )}
                                                        alt="Preview"
                                                        className="w-full h-56 object-cover rounded-xl border border-gray-200"
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
                                            ) : (
                                                <div
                                                    onClick={() =>
                                                        fileInputRef.current?.click()
                                                    }
                                                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/50 transition-all"
                                                >
                                                    <svg
                                                        className="w-12 h-12 text-gray-400 mx-auto mb-3"
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
                                                        Click to upload an image
                                                    </p>
                                                    <p className="text-gray-400 text-sm mt-1">
                                                        PNG, JPG, WEBP up to 2MB
                                                    </p>
                                                </div>
                                            )}
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
                                    </div>

                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                            <span
                                                className={`w-10 h-10 bg-gradient-to-br ${selectedCategory.color} rounded-xl flex items-center justify-center text-white text-lg font-bold`}
                                            >
                                                5
                                            </span>
                                            Tags
                                        </h2>

                                        <div>
                                            <input
                                                type="text"
                                                value={data.tagInput}
                                                onChange={(e) =>
                                                    setData(
                                                        "tagInput",
                                                        e.target.value,
                                                    )
                                                }
                                                onKeyPress={addTag}
                                                placeholder="Type a tag and press Enter"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all"
                                            />
                                            {data.tags.length > 0 && (
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {data.tags.map(
                                                        (tag, index) => (
                                                            <span
                                                                key={index}
                                                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 text-brand-800 font-medium text-sm"
                                                            >
                                                                {tag}
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeTag(
                                                                            tag,
                                                                        )
                                                                    }
                                                                    className="hover:text-red-600 transition-colors"
                                                                >
                                                                    ×
                                                                </button>
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {data.category && showGigForm && (
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link
                                    href={cancelPath || "/gigs"}
                                    className="flex-1 px-8 py-4 rounded-xl border-2 border-cream-300 text-gray-700 font-bold hover:bg-cream-100 transition-all text-center"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-800 text-white font-bold hover:shadow-lg hover:shadow-brand-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing
                                        ? "Creating Service..."
                                        : "Publish Service"}
                                </button>
                            </div>
                        )}
                    </form>

                    {/* Terms & Conditions Modal */}
                    {showModal && (
                        <div className="fixed inset-0 z-50 overflow-y-auto">
                            <div className="flex min-h-screen items-center justify-center p-4">
                                {/* Backdrop */}
                                <div
                                    className="fixed inset-0 bg-black/50 transition-opacity"
                                    onClick={() => setShowModal(false)}
                                />
                                
                                {/* Modal Content */}
                                <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                                    {/* Modal Header */}
                                    <div className="p-6 sm:p-8 border-b border-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-2xl font-extrabold text-gray-900">
                                                {modalStep === 1 ? "Terms & Conditions" : "Gig Guidelines"}
                                            </h2>
                                            <button
                                                onClick={() => setShowModal(false)}
                                                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        {/* Step Indicator */}
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${modalStep >= 1 ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                                    1
                                                </div>
                                                <span className={`font-semibold ${modalStep >= 1 ? 'text-brand-600' : 'text-gray-400'}`}>
                                                    Terms
                                                </span>
                                            </div>
                                            <div className={`h-0.5 w-12 flex-1 max-w-24 ${modalStep >= 2 ? 'bg-brand-600' : 'bg-gray-200'}`} />
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${modalStep >= 2 ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                                    2
                                                </div>
                                                <span className={`font-semibold ${modalStep >= 2 ? 'text-brand-600' : 'text-gray-400'}`}>
                                                    Guidelines
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Body */}
                                    <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                                        {modalStep === 1 ? (
                                            <div className="space-y-6">
                                                <div className="bg-cream-50 rounded-2xl p-6 border border-cream-200">
                                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Terms & Conditions</h3>
                                                    <div className="space-y-4 text-gray-600">
                                                        <p>
                                                            <strong>1. Service Quality:</strong> You agree to provide high-quality services that meet the expectations set in your gig description.
                                                        </p>
                                                        <p>
                                                            <strong>2. Communication:</strong> You must maintain professional and timely communication with clients throughout the project.
                                                        </p>
                                                        <p>
                                                            <strong>3. Pricing:</strong> All prices listed must be transparent and include all necessary fees. No hidden charges are allowed.
                                                        </p>
                                                        <p>
                                                            <strong>4. Delivery:</strong> You agree to deliver services within the timeframe specified in your gig.
                                                        </p>
                                                        <p>
                                                            <strong>5. Compliance:</strong> You must comply with all local laws and regulations regarding the services you offer.
                                                        </p>
                                                        <p>
                                                            <strong>6. Accountability:</strong> You are responsible for the content of your gigs and ensuring they do not violate our community guidelines.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                                                    <input
                                                        type="checkbox"
                                                        id="terms-checkbox"
                                                        checked={termsAccepted}
                                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                                        className="mt-1 w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
                                                    />
                                                    <label htmlFor="terms-checkbox" className="text-gray-700 font-medium">
                                                        I agree to all Terms & Conditions
                                                    </label>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Gig Creation Best Practices</h3>
                                                    <div className="space-y-4 text-gray-600">
                                                        <div className="flex gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                                                                ✓
                                                            </div>
                                                            <div>
                                                                <strong className="text-gray-900">Clear Title:</strong> Use a descriptive title that accurately represents your service.
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                                                                ✓
                                                            </div>
                                                            <div>
                                                                <strong className="text-gray-900">Detailed Description:</strong> Explain exactly what clients will receive.
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                                                                ✓
                                                            </div>
                                                            <div>
                                                                <strong className="text-gray-900">High-Quality Images:</strong> Upload clear, professional images that showcase your work.
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                                                                ✓
                                                            </div>
                                                            <div>
                                                                <strong className="text-gray-900">Fair Pricing:</strong> Set competitive prices that reflect the value of your services.
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                                                                ✓
                                                            </div>
                                                            <div>
                                                                <strong className="text-gray-900">Relevant Tags:</strong> Use tags that help clients find your service easily.
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="p-6 sm:p-8 border-t border-gray-100 flex gap-3">
                                        {modalStep === 1 ? (
                                            <>
                                                <button
                                                    onClick={() => setShowModal(false)}
                                                    className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => setModalStep(2)}
                                                    disabled={!termsAccepted}
                                                    className="flex-1 px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Next: View Guidelines
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => setModalStep(1)}
                                                    className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                                                >
                                                    Back to Terms
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        // Save terms acceptance to localStorage
                                                        localStorage.setItem('terms_accepted', 'true');
                                                        setShowModal(false);
                                                        setShowGigForm(true);
                                                    }}
                                                    className="flex-1 px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors"
                                                >
                                                    Continue to Create Gig
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
