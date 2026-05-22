import React, { useEffect, useRef } from "react";
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
} from "lucide-react";

export default function Home({ user, featuredGigs = [] }) {
    const categories = [
        {
            id: "developers",
            name: "Developers",
            icon: Code2,
            count: 2850,
            color: "from-blue-500 to-cyan-500",
            description: "Web, Mobile, & Software Developers",
        },
        {
            id: "designers",
            name: "Designers",
            icon: Paintbrush,
            count: 1850,
            color: "from-purple-500 to-pink-500",
            description: "UI/UX, Graphic, & Product Designers",
        },
        {
            id: "tutors",
            name: "Tutors",
            icon: GraduationCap,
            count: 1420,
            color: "from-green-500 to-emerald-500",
            description: "Online & In-Person Tutoring Experts",
        },
        {
            id: "electricians",
            name: "Electricians",
            icon: Zap,
            count: 890,
            color: "from-yellow-500 to-orange-500",
            description: "Licensed Electrical Services",
        },
        {
            id: "repair_experts",
            name: "Repair Experts",
            icon: Wrench,
            count: 1180,
            color: "from-red-500 to-rose-500",
            description: "Home, Auto, & Tech Repair Specialists",
        },
        {
            id: "agencies",
            name: "Agencies",
            icon: Building,
            count: 520,
            color: "from-indigo-500 to-violet-500",
            description: "Full-Service Creative & Marketing Agencies",
        },
        {
            id: "freelancers",
            name: "Freelancers",
            icon: Briefcase,
            count: 3240,
            color: "from-teal-500 to-cyan-500",
            description: "All-in-One Multi-Talented Professionals",
        },
        {
            id: "writers",
            name: "Writers",
            icon: Feather,
            count: 950,
            color: "from-amber-500 to-yellow-500",
            description: "Content, Copy, & Creative Writers",
        },
    ];

    const carouselRef = useRef(null);
    const pauseRef = useRef(false);

    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        let frameId;
        const speed = 1;

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
        <div className="min-h-screen flex flex-col">
            <Navbar user={user} />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-slate-950 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.22),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.18),_transparent_30%)]"></div>
                <div className="pointer-events-none absolute top-14 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl sm:h-72 sm:w-72"></div>
                <div className="pointer-events-none absolute -top-6 right-6 h-28 w-28 rounded-full bg-violet-500/15 blur-3xl sm:h-40 sm:w-40"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid gap-10 lg:grid-cols-2 items-center py-12 sm:py-14 lg:py-20">
                        <div className="max-w-full min-w-0">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs sm:text-sm text-slate-100 backdrop-blur">
                                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                Trusted by 50,000+ businesses globally
                            </span>

                            <h1 className="mt-7 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                                Build smarter with elite freelance talent.
                            </h1>

                            <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-300 max-w-3xl leading-relaxed">
                                Discover top-rated experts, scale your projects quickly, and deliver modern work with confidence.
                            </p>

                            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                                <a
                                    href="/gigs"
                                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-105"
                                >
                                    Find Talent
                                    <svg
                                        className="ml-2 h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                                        />
                                    </svg>
                                </a>
                                <a
                                    href="/register"
                                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
                                >
                                    Start Selling
                                </a>
                            </div>

                            <div className="mt-10 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-xl shadow-lg shadow-slate-950/20">
                                    <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-slate-400">Fast delivery</p>
                                    <p className="mt-3 text-2xl sm:text-3xl font-semibold text-white">24h avg.</p>
                                </div>
                                <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-xl shadow-lg shadow-slate-950/20">
                                    <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-slate-400">Positive reviews</p>
                                    <p className="mt-3 text-2xl sm:text-3xl font-semibold text-white">4.9★</p>
                                </div>
                                <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-xl shadow-lg shadow-slate-950/20">
                                    <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-slate-400">Talent pool</p>
                                    <p className="mt-3 text-2xl sm:text-3xl font-semibold text-white">8k+</p>
                                </div>
                            </div>

                            <div className="mt-8 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-3xl bg-slate-900/70 p-4 sm:p-5 border border-white/10">
                                    <p className="text-xs sm:text-sm text-slate-400">Verified vendors</p>
                                    <p className="mt-2 text-lg sm:text-xl font-semibold text-white">1,000+</p>
                                </div>
                                <div className="rounded-3xl bg-slate-900/70 p-4 sm:p-5 border border-white/10">
                                    <p className="text-xs sm:text-sm text-slate-400">Secure payments</p>
                                    <p className="mt-2 text-lg sm:text-xl font-semibold text-white">Built in</p>
                                </div>
                                <div className="rounded-3xl bg-slate-900/70 p-4 sm:p-5 border border-white/10">
                                    <p className="text-xs sm:text-sm text-slate-400">Satisfaction</p>
                                    <p className="mt-2 text-lg sm:text-xl font-semibold text-white">Guarantee</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative w-full max-w-xl mx-auto min-w-0">
                            <div className="absolute -right-8 top-8 h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-cyan-400/20 blur-3xl"></div>
                            <div className="absolute left-4 bottom-0 h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-violet-500/20 blur-3xl"></div>

                            <div className="relative w-full rounded-[36px] border border-white/10 bg-white/5 p-5 sm:p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl overflow-hidden">
                                <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl"></div>
                                <div className="absolute -bottom-20 left-0 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl"></div>
                                <div className="relative grid gap-4">
                                    <div className="rounded-[28px] bg-slate-950/70 p-6 border border-white/5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Top category</p>
                                                <h3 className="mt-3 text-2xl font-semibold text-white">Design & Branding</h3>
                                            </div>
                                            <div className="rounded-3xl bg-cyan-400/15 px-3 py-2 text-cyan-300 text-xs font-semibold">Trending</div>
                                        </div>
                                        <p className="mt-4 text-sm leading-relaxed text-slate-300">Modern visual systems, UI refreshes, and identity work from award-winning creators.</p>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="rounded-[28px] bg-white/5 p-5 border border-white/10">
                                            <p className="text-sm text-slate-400">Secure booking</p>
                                            <p className="mt-3 text-xl font-semibold text-white">Instant setup</p>
                                        </div>
                                        <div className="rounded-[28px] bg-white/5 p-5 border border-white/10">
                                            <p className="text-sm text-slate-400">Project launch</p>
                                            <p className="mt-3 text-xl font-semibold text-white">Launch in days</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 md:py-20 lg:py-24 bg-cream-100">
                <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="text-center mb-10 md:mb-16">
                        <p className="text-sm uppercase tracking-[0.35em] font-semibold text-brand-600 mb-4">
                            Featured Categories
                        </p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 md:mb-5 leading-tight">
                            Find trusted expertise in every major category.
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
                            Explore categories built for businesses and
                            individuals who want professional talent, fast.
                        </p>
                    </div>

                    <div className="relative overflow-hidden">
                        <div
                            ref={carouselRef}
                            onMouseEnter={() => (pauseRef.current = true)}
                            onMouseLeave={() => (pauseRef.current = false)}
                            className="flex gap-6 md:gap-8 overflow-hidden px-4 py-4 md:px-6 md:py-6"
                        >
                            {[...categories, ...categories].map(
                                (category, index) => (
                                    <div
                                        key={`${category.id}-${index}`}
                                        onClick={() =>
                                            (window.location.href = `/gigs?category=${category.id}`)
                                        }
                                        className="min-w-[240px] sm:min-w-[260px] md:min-w-[280px] lg:min-w-[300px] snap-center group cursor-pointer h-full"
                                    >
                                        <div className="h-full rounded-[40px] border border-slate-200 bg-white shadow-[0_24px_70px_-35px_rgba(15,23,42,0.18)] transition-all duration-300 group hover:-translate-y-1.5 hover:shadow-[0_32px_90px_-40px_rgba(15,23,42,0.22)] overflow-hidden flex flex-col">
                                            <div className="relative flex-1 px-6 py-10 md:px-8 md:py-12">
                                                <div className="absolute inset-x-6 top-0 h-24 rounded-[32px] bg-gradient-to-br from-white/80 to-slate-100 blur-2xl opacity-80"></div>
                                                <div className="relative flex flex-col items-center text-center gap-5">
                                                    <div className={`relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-[28px] bg-gradient-to-br ${category.color} text-white shadow-xl`}>
                                                        <category.icon className="h-10 w-10 md:h-12 md:w-12" aria-hidden="true" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <h3 className="text-xl md:text-2xl font-semibold text-slate-950">
                                                            {category.name}
                                                        </h3>
                                                        <p className="text-sm md:text-base text-slate-500 max-w-xs mx-auto leading-relaxed">
                                                            {category.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="border-t border-slate-100 bg-slate-50 px-6 py-5 md:px-7 md:py-6">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <p className="text-[11px] uppercase tracking-[0.32em] text-slate-400">
                                                            Experts
                                                        </p>
                                                        <p className="mt-1 text-sm md:text-base font-semibold text-slate-950">
                                                            {category.count.toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <span className="inline-flex items-center justify-center rounded-full bg-brand-600/10 text-brand-700 w-11 h-11">
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
                                                                d="M9 5l7 7-7 7"
                                                            />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                        <div className="mt-8 flex justify-center">
                            <a
                                href="/gigs"
                                className="inline-flex items-center justify-center rounded-full bg-brand-600 px-8 py-3 text-sm md:text-base font-semibold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-700 transition-colors"
                            >
                                View All Services
                                <svg
                                    className="w-4 h-4 ml-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Gigs Section */}
            <section className="py-12 md:py-16 lg:py-20">
                <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-10 md:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                            Popular Gigs
                        </h2>
                        <a
                            href="/gigs"
                            className="inline-flex items-center justify-center rounded-full bg-brand-600 px-8 py-3 text-sm md:text-base font-semibold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-700 transition-colors"
                        >
                            View All Gigs
                            <svg
                                className="w-4 h-4 ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </a>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                        {featuredGigs.map((gig) => (
                            <div
                                key={gig.id}
                                className="bg-white rounded-lg md:rounded-xl lg:rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="h-32 sm:h-40 md:h-48 overflow-hidden">
                                    {gig.image ? (
                                        <img
                                            src={`/storage/${gig.image}`}
                                            alt={gig.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-r from-brand-400 to-brand-600"></div>
                                    )}
                                </div>
                                <div className="p-3 md:p-4 lg:p-6">
                                    <h3 className="font-semibold text-xs md:text-sm lg:text-lg mb-1 md:mb-2 lg:mb-3 line-clamp-2">
                                        {gig.title}
                                    </h3>
                                    <div className="flex items-center mb-2 md:mb-3 lg:mb-4">
                                        <div className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 bg-gray-300 rounded-full mr-2"></div>
                                        <span className="text-xs md:text-sm lg:text-base text-gray-600">
                                            {gig.user?.name || "Seller"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs md:text-sm">
                                        <div className="flex items-center">
                                            <span className="text-yellow-500 mr-1">
                                                ★
                                            </span>
                                            <span className="font-semibold">
                                                {gig.user
                                                    ?.reviews_received_avg_rating
                                                    ? Number(
                                                          gig.user
                                                              .reviews_received_avg_rating,
                                                      ).toFixed(1)
                                                    : "New"}
                                            </span>
                                            <span className="text-gray-500 ml-1">
                                                (
                                                {gig.user
                                                    ?.reviews_received_count ??
                                                    0}
                                                )
                                            </span>
                                        </div>
                                        <div className="font-bold text-brand-600 md:text-base lg:text-lg">
                                            ${gig.price}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-12 md:py-16 lg:py-20 bg-cream-100">
                <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 md:mb-12 lg:mb-16">
                        How It Works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
                        <div className="text-center">
                            <div className="w-16 md:w-18 lg:w-20 h-16 md:h-18 lg:h-20 bg-brand-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                                <span className="text-white text-2xl md:text-3xl lg:text-4xl font-bold">
                                    1
                                </span>
                            </div>
                            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">
                                Find the Right Talent
                            </h3>
                            <p className="text-sm md:text-base text-gray-600">
                                Browse through our marketplace and find the
                                perfect freelancer for your project needs.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 md:w-18 lg:w-20 h-16 md:h-18 lg:h-20 bg-brand-800 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                                <span className="text-white text-2xl md:text-3xl lg:text-4xl font-bold">
                                    2
                                </span>
                            </div>
                            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">
                                Hire and Collaborate
                            </h3>
                            <p className="text-sm md:text-base text-gray-600">
                                Communicate directly with freelancers, share
                                requirements, and get your project started.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-success-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-white text-3xl font-bold">
                                    3
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Get Work Done
                            </h3>
                            <p className="text-gray-600">
                                Receive high-quality work on time, with secure
                                payments and satisfaction guaranteed.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
