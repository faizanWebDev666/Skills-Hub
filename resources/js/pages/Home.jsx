import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    Code2,
    Paintbrush,
    GraduationCap,
    Zap,
    Wrench,
    Building,
    Briefcase,
    Feather,
    Star,
    TrendingUp,
    CheckCircle,
    Users,
    Award,
} from "lucide-react";

export default function Home({ user, featuredGigs = [] }) {
    const [hoveredCategory, setHoveredCategory] = useState(null);

    const categories = [
        {
            id: "developers",
            name: "Development",
            icon: Code2,
            count: 2850,
            color: "from-blue-500 to-cyan-500",
            description: "Web, Mobile, & Software Development",
            bgImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
        {
            id: "designers",
            name: "Design",
            icon: Paintbrush,
            count: 1850,
            color: "from-purple-500 to-pink-500",
            description: "UI/UX, Graphic, & Product Design",
            bgImage: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        },
        {
            id: "tutors",
            name: "Education",
            icon: GraduationCap,
            count: 1420,
            color: "from-green-500 to-emerald-500",
            description: "Online & In-Person Tutoring",
            bgImage: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        },
        {
            id: "electricians",
            name: "Services",
            icon: Zap,
            count: 890,
            color: "from-yellow-500 to-orange-500",
            description: "Technical & Professional Services",
            bgImage: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        },
        {
            id: "repair_experts",
            name: "Repair & Maintenance",
            icon: Wrench,
            count: 1180,
            color: "from-red-500 to-rose-500",
            description: "Home, Auto, & Tech Repair",
            bgImage: "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)",
        },
        {
            id: "agencies",
            name: "Agencies",
            icon: Building,
            count: 520,
            color: "from-indigo-500 to-violet-500",
            description: "Full-Service Creative Teams",
            bgImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
        {
            id: "freelancers",
            name: "Consulting",
            icon: Briefcase,
            count: 3240,
            color: "from-teal-500 to-cyan-500",
            description: "Expert Consulting & Strategy",
            bgImage: "linear-gradient(135deg, #06ffa5 0%, #086788 100%)",
        },
        {
            id: "writers",
            name: "Writing & Content",
            icon: Feather,
            count: 950,
            color: "from-amber-500 to-yellow-500",
            description: "Content & Copywriting Experts",
            bgImage: "linear-gradient(135deg, #ffd89b 0%, #19547b 100%)",
        },
    ];

    const carouselRef = useRef(null);
    const pauseRef = useRef(false);

    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        let frameId;
        const speed = 0.5;

        const step = () => {
            if (!pauseRef.current) {
                carousel.scrollLeft += speed;
                if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
                    carousel.scrollLeft -= carousel.scrollWidth / 2;
                }
            }
            frameId = requestAnimationFrame(step);
        };

        frameId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frameId);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
            <Navbar user={user} />

            {/* HERO SECTION - Premium Design */}
            <section className="relative w-full overflow-hidden pt-6 pb-12 sm:pt-8 sm:pb-16 md:pt-16 md:pb-24 lg:pt-20 lg:pb-32">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-32 -right-32 sm:-top-40 sm:-right-40 w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-br from-blue-400/30 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-10 sm:top-20 -left-24 sm:-left-32 w-60 h-60 sm:w-72 sm:h-72 bg-gradient-to-br from-cyan-400/20 to-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="hidden md:block absolute bottom-0 right-1/3 w-96 h-96 bg-gradient-to-br from-violet-300/20 to-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="w-full max-w-full">
                    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
                        <div className="grid gap-8 sm:gap-10 md:gap-12 lg:gap-16 lg:grid-cols-2 items-center">
                            {/* Left Content */}
                            <div className="space-y-5 sm:space-y-6 md:space-y-8 w-full">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-gradient-to-r from-white to-slate-50 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 text-[11px] sm:text-xs md:text-sm font-medium text-slate-700 shadow-sm">
                                    <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="truncate sm:truncate">Join 50,000+ successful businesses</span>
                                </div>

                                {/* Main Heading */}
                                <div className="space-y-3 sm:space-y-4 md:space-y-6 w-full">
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 leading-tight tracking-tight break-words">
                                        Hire Experts.
                                        <br />
                                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                            Scale Fast.
                                        </span>
                                    </h1>
                                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-lg">
                                        Connect with top-rated freelancers and agencies. Get professional work done in days, not months. Perfect for startups, businesses, and enterprises.
                                    </p>
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex flex-col xs:flex-row gap-2.5 sm:gap-3 md:gap-4 pt-3 sm:pt-4 md:pt-6 w-full">
                                    <a
                                        href="/gigs"
                                        className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-xs sm:text-sm md:text-base font-semibold text-white shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 flex-shrink-0"
                                    >
                                        Find Talent
                                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 ml-1.5 sm:ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </a>
                                    <a
                                        href="/register"
                                        className="group inline-flex items-center justify-center rounded-full border-2 border-slate-300 bg-white px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-xs sm:text-sm md:text-base font-semibold text-slate-900 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 active:bg-slate-100 flex-shrink-0"
                                    >
                                        Start Selling
                                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 ml-1.5 sm:ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </a>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 pt-6 sm:pt-8 md:pt-12 border-t border-slate-200 w-full">
                                    <div>
                                        <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 uppercase tracking-wider font-medium">Avg. Delivery</p>
                                        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mt-1 sm:mt-2">24h</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 uppercase tracking-wider font-medium">Avg. Rating</p>
                                        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mt-1 sm:mt-2">4.9★</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 uppercase tracking-wider font-medium">Total Experts</p>
                                        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mt-1 sm:mt-2">8k+</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Visual */}
                            <div className="relative hidden lg:flex justify-end">
                                <div className="relative w-full max-w-md">
                                    {/* Floating Cards */}
                                    <div className="absolute -top-10 -right-0 w-64 sm:w-72 h-80 bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 transform hover:scale-105 transition-transform duration-300 z-20">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex-shrink-0"></div>
                                                <div className="space-y-1 min-w-0">
                                                    <p className="font-semibold text-slate-900 truncate">Alex Johnson</p>
                                                    <p className="text-xs text-slate-500">UX Designer</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-600">Completed 200+ projects</p>
                                            <div className="flex items-center gap-1 flex-wrap">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                ))}
                                                <span className="text-xs text-slate-500 ml-2">4.98 (125 reviews)</span>
                                            </div>
                                            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-shadow">
                                                View Profile
                                            </button>
                                        </div>
                                    </div>

                                    {/* Bottom Card */}
                                    <div className="absolute -bottom-20 left-0 w-72 sm:w-80 h-auto bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 transform hover:scale-105 transition-transform duration-300 z-10">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-sm font-semibold text-slate-900">Project in Progress</span>
                                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium whitespace-nowrap">Active</span>
                                            </div>
                                            <p className="text-sm text-slate-600">Website Redesign - E-commerce</p>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-slate-500">Progress</span>
                                                    <span className="font-semibold text-slate-900">75%</span>
                                                </div>
                                                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                                    <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full"></div>
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full -ml-3"></div>
                                                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full -ml-3"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
            </section>

            {/* CATEGORIES SECTION - Enhanced Design */}
            <section className="w-full overflow-hidden py-12 sm:py-16 md:py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-white relative">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-10 sm:top-20 left-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-blue-100/30 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 sm:bottom-20 right-1/4 w-56 h-56 sm:w-96 sm:h-96 bg-purple-100/20 rounded-full blur-3xl"></div>
                </div>

                <div className="w-full max-w-full">
                    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
                        {/* Section Header */}
                        <div className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20 space-y-3 sm:space-y-4">
                            <p className="text-xs sm:text-sm md:text-base uppercase tracking-[0.35em] font-bold text-blue-600">
                                EXPLORE CATEGORIES
                            </p>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 leading-tight">
                                Find Expertise in Every Field
                            </h2>
                            <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto px-2">
                                Browse through 50+ specialized categories and connect with top talent across all industries.
                            </p>
                        </div>

                        {/* Categories Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    onClick={() => (window.location.href = `/gigs?category=${category.id}`)}
                                    onMouseEnter={() => setHoveredCategory(category.id)}
                                    onMouseLeave={() => setHoveredCategory(null)}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 active:translate-y-0">
                                        {/* Background Image/Gradient */}
                                        <div
                                            className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                                            style={{
                                                background: category.bgImage,
                                            }}
                                        ></div>

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-60 transition-opacity duration-300"></div>

                                        {/* Content */}
                                        <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 flex flex-col justify-end p-4 sm:p-6 md:p-8">
                                            {/* Icon */}
                                            <div className="mb-4 sm:mb-6 inline-flex h-11 w-11 sm:h-12 sm:w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-lg transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/30">
                                                <category.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
                                            </div>

                                            {/* Text */}
                                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{category.name}</h3>
                                            <p className="text-xs sm:text-sm md:text-base text-white/90 mb-3 sm:mb-4 line-clamp-2">{category.description}</p>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/20">
                                                <div>
                                                    <p className="text-[10px] sm:text-xs text-white/70 uppercase tracking-wider font-medium">Experts</p>
                                                    <p className="text-base sm:text-lg md:text-xl font-bold text-white mt-0.5 sm:mt-1">{category.count.toLocaleString()}</p>
                                                </div>
                                                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-lg group-hover:bg-white group-hover:text-slate-900 transition-all duration-300">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* View All Button */}
                        <div className="flex justify-center mt-10 sm:mt-12 md:mt-16">
                            <a
                                href="/gigs"
                                className="group inline-flex items-center gap-2 sm:gap-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold text-white shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
                            >
                                View All Categories
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* GIGS SECTION - Premium Cards */}
            <section className="w-full overflow-hidden py-12 sm:py-16 md:py-24 lg:py-32 bg-white relative">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 sm:-top-40 -right-32 sm:-right-40 w-64 h-64 sm:w-96 sm:h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
                </div>

                <div className="w-full max-w-full">
                    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
                        {/* Section Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-10 sm:mb-12 md:mb-16">
                            <div className="space-y-2">
                                <p className="text-xs sm:text-sm md:text-base uppercase tracking-[0.35em] font-bold text-blue-600">
                                    TOP SELLERS
                                </p>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
                                    Trending Gigs
                                </h2>
                            </div>
                            <a
                                href="/gigs"
                                className="group inline-flex items-center gap-2 rounded-full border-2 border-slate-300 bg-white px-5 sm:px-6 md:px-8 py-2 md:py-3 text-xs sm:text-sm md:text-base font-semibold text-slate-900 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 whitespace-nowrap active:bg-slate-100"
                            >
                                View All Gigs
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </a>
                        </div>

                        {/* Gigs Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                            {featuredGigs.map((gig) => (
                                <a
                                    key={gig.id}
                                    href={`/gigs/${gig.id}`}
                                    className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 active:translate-y-0"
                                >
                                    {/* Image Container */}
                                    <div className="relative overflow-hidden h-40 sm:h-48 md:h-56 bg-gradient-to-br from-slate-200 to-slate-300">
                                        {gig.image ? (
                                            <img
                                                src={`/storage/${gig.image}`}
                                                alt={gig.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                                <span className="text-white/30 text-4xl sm:text-5xl">📦</span>
                                            </div>
                                        )}
                                        {/* Badge */}
                                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 inline-flex items-center gap-1 bg-white/95 backdrop-blur-lg px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold text-slate-900 shadow-lg">
                                            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                                            <span>
                                                {gig.user?.reviews_received_avg_rating
                                                    ? Number(gig.user.reviews_received_avg_rating).toFixed(1)
                                                    : "New"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                                        {/* Seller Info */}
                                        <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-slate-200">
                                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                                                {gig.user?.name?.charAt(0) || "S"}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                                                    {gig.user?.name || "Seller"}
                                                </p>
                                                <div className="flex items-center gap-0.5">
                                                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-[10px] sm:text-xs text-slate-600">
                                                        (
                                                        {gig.user?.reviews_received_count ?? 0}
                                                        )
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Gig Title */}
                                        <h3 className="text-xs sm:text-sm md:text-base font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {gig.title}
                                        </h3>

                                        {/* Description snippet */}
                                        <p className="text-[10px] sm:text-xs md:text-sm text-slate-600 line-clamp-2">
                                            {gig.description || "Professional service"}
                                        </p>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-slate-200">
                                            <div className="space-y-0.5 sm:space-y-1">
                                                <p className="text-[10px] sm:text-xs text-slate-500">Starting at</p>
                                                <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                                                    ${gig.price}
                                                </p>
                                            </div>
                                            <div className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-600 transition-colors duration-300 flex-shrink-0">
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="mt-10 sm:mt-12 md:mt-16 lg:mt-20 text-center">
                            <p className="text-slate-600 text-sm sm:text-base md:text-lg mb-4 md:mb-6">Ready to get started?</p>
                            <a
                                href="/gigs"
                                className="group inline-flex items-center gap-2 sm:gap-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 sm:px-8 md:px-12 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold text-white shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
                            >
                                Explore All Gigs
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST SECTION */}
            <section className="w-full overflow-hidden py-12 sm:py-16 md:py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 sm:top-0 -right-32 sm:-right-40 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="w-full max-w-full">
                    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
                            <div className="text-center md:text-left space-y-3 sm:space-y-4">
                                <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-emerald-400 flex-shrink-0" />
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">Verified Professionals</h3>
                                </div>
                                <p className="text-xs sm:text-sm md:text-base text-slate-300">Every freelancer is verified and reviewed. Only the best talent makes it to our platform.</p>
                            </div>
                            <div className="text-center md:text-left space-y-3 sm:space-y-4">
                                <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    <Award className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-yellow-400 flex-shrink-0" />
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">Secure Payments</h3>
                                </div>
                                <p className="text-xs sm:text-sm md:text-base text-slate-300">Pay safely with our secure payment system. Money is held until you're satisfied with the work.</p>
                            </div>
                            <div className="text-center md:text-left space-y-3 sm:space-y-4">
                                <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-400 flex-shrink-0" />
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">24/7 Support</h3>
                                </div>
                                <p className="text-xs sm:text-sm md:text-base text-slate-300">Our support team is always available to help you get the best results from your project.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
