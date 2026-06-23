import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, router } from "@inertiajs/react";
import Navbar from "../../components/Navbar";
import Pagination from "../../components/Pagination";
import GigSkeleton from "../../components/GigSkeleton";

const categories = [
    { id: "all", name: "All Services", icon: "✨" },
    { id: "developers", name: "Developers", icon: "👨‍💻" },
    { id: "designers", name: "Designers", icon: "🎨" },
    { id: "tutors", name: "Tutors", icon: "👨‍🏫" },
    { id: "electricians", name: "Electricians", icon: "⚡" },
    { id: "repair_experts", name: "Repair Experts", icon: "🔧" },
    { id: "agencies", name: "Agencies", icon: "🏢" },
    { id: "freelancers", name: "Freelancers", icon: "💼" },
    { id: "writers", name: "Writers", icon: "✍️" },
];

const sortOptions = [
    { id: "recommended", name: "Recommended" },
    { id: "newest", name: "Newest" },
    { id: "price_low", name: "Price: Low to High" },
    { id: "price_high", name: "Price: High to Low" },
    { id: "rating", name: "Top Rated" },
];

const deliveryTimeOptions = [
    { id: "any", name: "Any Time" },
    { id: "24h", name: "Within 24 Hours" },
    { id: "3d", name: "Within 3 Days" },
    { id: "7d", name: "Within 7 Days" },
];

const sellerLevelOptions = [
    { id: "any", name: "Any Level" },
    { id: "top_rated", name: "Top Rated" },
    { id: "level_2", name: "Level 2" },
    { id: "level_1", name: "Level 1" },
    { id: "new", name: "New Seller" },
];

export default function Index({
    gigs,
    user,
    filters = {},
    wishlistGigIds = [],
}) {
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [selectedCategory, setSelectedCategory] = useState(
        filters.category || "all",
    );
    const [sortBy, setSortBy] = useState(filters.sort || "recommended");
    const [deliveryTime, setDeliveryTime] = useState("any");
    const [sellerLevel, setSellerLevel] = useState("any");
    const [showFilters, setShowFilters] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const searchRef = useRef(null);

    // Listen for Inertia page transitions
    useEffect(() => {
        const handleStart = () => setIsTransitioning(true);
        const handleFinish = () => setIsTransitioning(false);

        const removeStartListener = router.on("start", handleStart);
        const removeFinishListener = router.on("finish", handleFinish);

        return () => {
            removeStartListener();
            removeFinishListener();
        };
    }, []);

    // Wishlist Toggle
    const handleWishlistToggle = (gigId) => {
        if (!user) {
            router.get("/login");
            return;
        }

        router.post(
            `/wishlist/${gigId}/toggle`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    // Helper to build query params and navigate via Inertia
    const applyFilters = useCallback(
        (overrides = {}) => {
            const params = {
                category: overrides.category ?? selectedCategory,
                search: overrides.search ?? searchQuery,
                sort: overrides.sort ?? sortBy,
            };

            // Remove default/empty values to keep URL clean
            const cleanParams = {};
            if (params.category && params.category !== "all")
                cleanParams.category = params.category;
            if (params.search) cleanParams.search = params.search;
            if (params.sort && params.sort !== "recommended")
                cleanParams.sort = params.sort;

            router.get("/gigs", cleanParams, {
                preserveState: true,
                preserveScroll: true,
            });
        },
        [selectedCategory, searchQuery, sortBy],
    );

    // When category changes, immediately apply filter
    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        applyFilters({ category: categoryId });
    };

    // When sort changes, immediately apply filter
    const handleSortChange = (sortValue) => {
        setSortBy(sortValue);
        applyFilters({ sort: sortValue });
    };

    const handleSuggestionSelect = (suggestion) => {
        setSearchQuery(suggestion);
        applyFilters({ search: suggestion });
        setIsSuggestionsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setIsSuggestionsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const query = searchQuery.trim();

        if (query.length < 2) {
            setSuggestions([]);
            setIsSuggestionsOpen(false);
            return;
        }

        const controller = new AbortController();
        const timeout = setTimeout(async () => {
            setIsLoadingSuggestions(true);
            try {
                const response = await fetch(
                    `/gigs/suggestions?q=${encodeURIComponent(query)}`,
                    {
                        signal: controller.signal,
                        headers: {
                            Accept: "application/json",
                            "X-Requested-With": "XMLHttpRequest",
                        },
                    },
                );

                if (response.ok) {
                    const data = await response.json();
                    setSuggestions(data);
                    setIsSuggestionsOpen(data.length > 0);
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Suggestion fetch failed:", error);
                }
            } finally {
                setIsLoadingSuggestions(false);
            }
        }, 300);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [searchQuery]);

    // Debounced search: apply after user stops typing
    useEffect(() => {
        const timer = setTimeout(() => {
            // Only trigger if the search value actually changed from what the server sent
            if (searchQuery !== (filters.search || "")) {
                applyFilters({ search: searchQuery });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Handle clear all filters
    const handleClearAll = () => {
        setSelectedCategory("all");
        setSortBy("recommended");
        setDeliveryTime("any");
        setSellerLevel("any");
        setSearchQuery("");
        router.get(
            "/gigs",
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <div className="min-h-screen bg-cream-50">
            <Navbar user={user} />

            <div className="bg-gradient-to-br from-cream-100 to-cream-200 border-b border-cream-300">
                <div className="container mx-auto px-4 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                            <div className="relative" ref={searchRef}>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg
                                        className="h-6 w-6 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search for any service, skill, or keyword..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    onFocus={() => {
                                        if (suggestions.length > 0) {
                                            setIsSuggestionsOpen(true);
                                        }
                                    }}
                                    className="w-full pl-12 sm:pl-14 pr-4 py-3 sm:py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all text-base sm:text-lg shadow-sm"
                                />

                                {isSuggestionsOpen && (
                                    <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-3xl border border-brand-200 bg-white shadow-2xl">
                                        {isLoadingSuggestions ? (
                                            <div className="px-4 py-3 text-sm text-slate-500">
                                                Loading suggestions...
                                            </div>
                                        ) : suggestions.length > 0 ? (
                                            <ul className="divide-y divide-brand-100">
                                                {suggestions.map(
                                                    (suggestion, index) => (
                                                        <li key={index}>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleSuggestionSelect(
                                                                        suggestion,
                                                                    )
                                                                }
                                                                className="w-full text-left px-4 py-3 hover:bg-brand-50 text-sm text-slate-700 transition-colors"
                                                            >
                                                                {suggestion}
                                                            </button>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        ) : (
                                            <div className="px-4 py-3 text-sm text-slate-500">
                                                No suggestions found.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden flex items-center gap-2 px-6 py-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                />
                            </svg>
                            Filters
                        </button>
                    </div>

                    <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2 mt-4">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() =>
                                    handleCategoryChange(category.id)
                                }
                                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all truncate ${
                                    selectedCategory === category.id
                                        ? "bg-brand-500 text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                                }`}
                            >
                                <span className="mr-1 sm:mr-2">
                                    {category.icon}
                                </span>
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <aside
                        className={`lg:w-72 shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}
                    >
                        <div className="lg:sticky top-24 space-y-8">
                            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
                                <div className="flex items-center justify-between mb-4 sm:mb-6">
                                    <h3 className="font-bold text-base sm:text-lg text-gray-900">
                                        Filters
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={handleClearAll}
                                            className="text-xs sm:text-sm text-brand-500 hover:text-brand-600 font-medium"
                                        >
                                            Clear All
                                        </button>
                                        <button
                                            onClick={() =>
                                                setShowFilters(false)
                                            }
                                            className="lg:hidden text-gray-400 hover:text-gray-600 p-1"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h4 className="font-semibold text-gray-900 mb-4">
                                        Delivery Time
                                    </h4>
                                    <div className="space-y-3">
                                        {deliveryTimeOptions.map((option) => (
                                            <label
                                                key={option.id}
                                                className="flex items-center cursor-pointer"
                                            >
                                                <input
                                                    type="radio"
                                                    name="deliveryTime"
                                                    value={option.id}
                                                    checked={
                                                        deliveryTime ===
                                                        option.id
                                                    }
                                                    onChange={(e) =>
                                                        setDeliveryTime(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-4 h-4 text-brand-500 border-gray-300 focus:ring-brand-500"
                                                />
                                                <span className="ml-3 text-gray-700">
                                                    {option.name}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h4 className="font-semibold text-gray-900 mb-4">
                                        Seller Level
                                    </h4>
                                    <div className="space-y-3">
                                        {sellerLevelOptions.map((option) => (
                                            <label
                                                key={option.id}
                                                className="flex items-center cursor-pointer"
                                            >
                                                <input
                                                    type="radio"
                                                    name="sellerLevel"
                                                    value={option.id}
                                                    checked={
                                                        sellerLevel ===
                                                        option.id
                                                    }
                                                    onChange={(e) =>
                                                        setSellerLevel(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-4 h-4 text-brand-500 border-gray-300 focus:ring-brand-500"
                                                />
                                                <span className="ml-3 text-gray-700">
                                                    {option.name}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h4 className="font-semibold text-gray-900 mb-4">
                                        Budget
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex gap-3">
                                            <input
                                                type="number"
                                                placeholder="Min"
                                                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Max"
                                                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <main className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {selectedCategory === "all"
                                        ? "All Services"
                                        : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace("_", " ")}`}
                                </h2>
                                <p className="text-gray-500 mt-1">
                                    {gigs.data?.length || 0} services available
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-sm text-gray-500">
                                    Sort by:
                                </span>
                                <select
                                    value={sortBy}
                                    onChange={(e) =>
                                        handleSortChange(e.target.value)
                                    }
                                    className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 focus:ring-2 focus:ring-brand-100 focus:border-brand-500 text-sm"
                                >
                                    {sortOptions.map((option) => (
                                        <option
                                            key={option.id}
                                            value={option.id}
                                        >
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                                <Link
                                    href="/gigs/create"
                                    className="bg-brand-500 hover:bg-brand-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold transition-colors flex items-center gap-2 text-sm sm:text-base"
                                >
                                    <svg
                                        className="w-4 h-4 sm:w-5 sm:h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                    <span className="hidden sm:inline">
                                        Become a Seller
                                    </span>
                                    <span className="sm:hidden">Sell</span>
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
                            {isTransitioning
                                ? // Show skeleton loaders while page is transitioning
                                  Array(12)
                                      .fill(0)
                                      .map((_, index) => (
                                          <GigSkeleton key={index} />
                                      ))
                                : // Show actual gigs when loaded
                                  gigs.data?.map((gig) => (
                                <div
                                    key={gig.id}
                                    className="group bg-white rounded-lg sm:rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="relative">
                                        <div className="h-32 sm:h-40 md:h-48 overflow-hidden">
                                            {gig.image ? (
                                                <img
                                                    src={`/storage/${gig.image}`}
                                                    alt={gig.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600 group-hover:scale-105 transition-transform duration-300"></div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleWishlistToggle(gig.uuid)
                                            }
                                            className="absolute top-2 sm:top-3 right-2 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                                        >
                                            <svg
                                                className={`w-5 h-5 transition-colors ${wishlistGigIds.includes(gig.id) ? "text-red-500 fill-current" : "text-gray-600 hover:text-red-500"}`}
                                                fill={
                                                    wishlistGigIds.includes(
                                                        gig.id,
                                                    )
                                                        ? "currentColor"
                                                        : "none"
                                                }
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                />
                                            </svg>
                                        </button>
                                        {gig.category && (
                                            <div className="absolute bottom-3 left-3">
                                                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                                                    {gig.category
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        gig.category
                                                            .slice(1)
                                                            .replace("_", " ")}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-3 sm:p-5">
                                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-brand-500 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm ring-2 ring-white shadow-sm">
                                                {gig.user?.name?.charAt(0) ||
                                                    "S"}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                                                    {gig.user?.name ||
                                                        "Service Provider"}
                                                </p>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-brand-500 text-xs">
                                                        ✓
                                                    </span>
                                                    <span className="text-xs text-gray-500 hidden sm:inline">
                                                        Level 2 Seller
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 sm:mb-3 line-clamp-2 group-hover:text-brand-600 transition-colors">
                                            {gig.title}
                                        </h3>

                                        <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-500 text-xs sm:text-sm">
                                                    ★
                                                </span>
                                                <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                                                    4.9
                                                </span>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-100 pt-2 sm:pt-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-gray-500 hidden sm:block">
                                                    Starting at
                                                </p>
                                                <p className="text-base sm:text-xl font-bold text-gray-900">
                                                    ${gig.price}
                                                </p>
                                            </div>
                                            <Link
                                                href={`/gigs/${gig.uuid}`}
                                                className="bg-white hover:bg-cream-100 text-gray-900 px-2 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold border border-cream-300 transition-all hover:border-brand-500 hover:text-brand-600 text-xs sm:text-sm"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {(!gigs.data || gigs.data.length === 0) && (
                            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
                                <div className="text-7xl mb-6">🔍</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    No services found
                                </h3>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    Try adjusting your search or filters. Be the
                                    first to create a gig in this category!
                                </p>
                                <Link
                                    href="/gigs/create"
                                    className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-xl font-bold transition-colors"
                                >
                                    Create Your First Gig
                                </Link>
                            </div>
                        )}

                        {gigs.links && gigs.links.length > 0 && (
                            <div className="mt-8 sm:mt-12">
                                <Pagination links={gigs.links} />
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
