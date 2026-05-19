import React, { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home({ user, featuredGigs = [] }) {
    const categories = [
        { id: 'developers', name: 'Developers', icon: '👨‍💻', count: 2850, color: 'from-blue-500 to-cyan-500', description: 'Web, Mobile, & Software Developers' },
        { id: 'designers', name: 'Designers', icon: '🎨', count: 1850, color: 'from-purple-500 to-pink-500', description: 'UI/UX, Graphic, & Product Designers' },
        { id: 'tutors', name: 'Tutors', icon: '👨‍🏫', count: 1420, color: 'from-green-500 to-emerald-500', description: 'Online & In-Person Tutoring Experts' },
        { id: 'electricians', name: 'Electricians', icon: '⚡', count: 890, color: 'from-yellow-500 to-orange-500', description: 'Licensed Electrical Services' },
        { id: 'repair_experts', name: 'Repair Experts', icon: '🔧', count: 1180, color: 'from-red-500 to-rose-500', description: 'Home, Auto, & Tech Repair Specialists' },
        { id: 'agencies', name: 'Agencies', icon: '🏢', count: 520, color: 'from-indigo-500 to-violet-500', description: 'Full-Service Creative & Marketing Agencies' },
        { id: 'freelancers', name: 'Freelancers', icon: '💼', count: 3240, color: 'from-teal-500 to-cyan-500', description: 'All-in-One Multi-Talented Professionals' },
        { id: 'writers', name: 'Writers', icon: '✍️', count: 950, color: 'from-amber-500 to-yellow-500', description: 'Content, Copy, & Creative Writers' },
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
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
                <div className="absolute inset-0 bg-[url('https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=abstract%20network%20connections%20digital%20marketplace%20background%20with%20dots%20and%20waves&image_size=landscape_16_9')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-slate-900/80"></div>

                <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
                    <div className="pt-12 pb-16 sm:pt-16 sm:pb-20 md:pt-20 md:pb-24 lg:pt-28 lg:pb-32">
                        <div className="max-w-5xl mx-auto">
                            <div className="text-center">
                                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full mb-6 md:mb-8 text-xs md:text-sm">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                    <span className="font-medium text-slate-200">Trusted by 50,000+ businesses</span>
                                </div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 leading-tight tracking-tight">
                                    Hire expert freelancers
                                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-200">
                                        for your next project
                                    </span>
                                </h1>
                                <p className="text-sm sm:text-base md:text-lg mb-8 md:mb-10 text-slate-300 max-w-3xl mx-auto leading-relaxed">
                                    Work with vetted professionals across design, development, marketing and more. Get dependable results from experts who deliver on time.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-10 md:mb-12">
                                    <a
                                        href="/gigs"
                                        className="group bg-white text-slate-950 px-6 md:px-9 py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold text-sm md:text-base hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                    >
                                        <span>Find Talent</span>
                                        <svg className="w-4 md:w-5 h-4 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </a>
                                    <a
                                        href="/register"
                                        className="group border border-white/20 text-white px-6 md:px-9 py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold text-sm md:text-base hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                    >
                                        <span>Start Selling</span>
                                        <svg className="w-4 md:w-5 h-4 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </a>
                                </div>

                                <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 md:gap-5 max-w-3xl mx-auto">
                                    <div className="rounded-xl md:rounded-3xl border border-white/10 bg-white/5 p-3 md:p-6">
                                        <div className="text-2xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2">50K+</div>
                                        <div className="text-xs md:text-sm lg:text-base text-slate-300 line-clamp-2">Active Freelancers</div>
                                    </div>
                                    <div className="rounded-xl md:rounded-3xl border border-white/10 bg-white/5 p-3 md:p-6">
                                        <div className="text-2xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2">$5M+</div>
                                        <div className="text-xs md:text-sm lg:text-base text-slate-300 line-clamp-2">Projects Completed</div>
                                    </div>
                                    <div className="rounded-xl md:rounded-3xl border border-white/10 bg-white/5 p-3 md:p-6">
                                        <div className="text-2xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2">4.9★</div>
                                        <div className="text-xs md:text-sm lg:text-base text-slate-300 line-clamp-2">Average Rating</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F6EEDE"/>
                    </svg>
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
                            Explore categories built for businesses and individuals who want professional talent, fast.
                        </p>
                    </div>

                    <div className="relative overflow-hidden">
                        <div
                            ref={carouselRef}
                            onMouseEnter={() => (pauseRef.current = true)}
                            onMouseLeave={() => (pauseRef.current = false)}
                            className="flex gap-6 md:gap-8 overflow-hidden px-4 py-4 md:px-6 md:py-6"
                        >
                            {[...categories, ...categories].map((category, index) => (
                                <div
                                    key={`${category.id}-${index}`}
                                    onClick={() => window.location.href = `/gigs?category=${category.id}`}
                                    className="min-w-[240px] sm:min-w-[260px] md:min-w-[280px] lg:min-w-[300px] snap-center group cursor-pointer h-full"
                                >
                                    <div className="h-full rounded-[32px] border border-cream-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col">
                                        <div className="flex flex-col items-center text-center px-6 py-8 md:px-8 md:py-10 gap-4">
                                            <div className={`flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-gradient-to-br ${category.color} text-white text-2xl md:text-3xl shadow-lg`}>
                                                <span>{category.icon}</span>
                                            </div>
                                            <div className="space-y-3">
                                                <h3 className="text-xl md:text-2xl font-semibold text-slate-900">
                                                    {category.name}
                                                </h3>
                                                <p className="text-sm md:text-base text-slate-500 max-w-xs mx-auto leading-relaxed">
                                                    {category.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="border-t border-cream-200 bg-cream-100 px-6 py-4 md:px-7 md:py-5">
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="text-sm md:text-base font-semibold text-slate-700">
                                                    {category.count.toLocaleString()} experts
                                                </span>
                                                <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white text-brand-600 shadow-sm transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 flex justify-center">
                            <a
                                href="/gigs"
                                className="inline-flex items-center justify-center rounded-full bg-brand-600 px-8 py-3 text-sm md:text-base font-semibold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-700 transition-colors"
                            >
                                View All Services
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Popular Gigs</h2>
                        <a
                            href="/gigs"
                            className="inline-flex items-center justify-center rounded-full bg-brand-600 px-8 py-3 text-sm md:text-base font-semibold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-700 transition-colors"
                        >
                            View All Gigs
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                        {featuredGigs.map((gig) => (
                            <div key={gig.id} className="bg-white rounded-lg md:rounded-xl lg:rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="h-32 sm:h-40 md:h-48 overflow-hidden">
                                    {gig.image ? (
                                        <img src={`/storage/${gig.image}`} alt={gig.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-r from-brand-400 to-brand-600"></div>
                                    )}
                                </div>
                                <div className="p-3 md:p-4 lg:p-6">
                                    <h3 className="font-semibold text-xs md:text-sm lg:text-lg mb-1 md:mb-2 lg:mb-3 line-clamp-2">{gig.title}</h3>
                                    <div className="flex items-center mb-2 md:mb-3 lg:mb-4">
                                        <div className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 bg-gray-300 rounded-full mr-2"></div>
                                        <span className="text-xs md:text-sm lg:text-base text-gray-600">{gig.user?.name || 'Seller'}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs md:text-sm">
                                        <div className="flex items-center">
                                            <span className="text-yellow-500 mr-1">★</span>
                                            <span className="font-semibold">{gig.user?.reviews_received_avg_rating ? Number(gig.user.reviews_received_avg_rating).toFixed(1) : 'New'}</span>
                                            <span className="text-gray-500 ml-1">({gig.user?.reviews_received_count ?? 0})</span>
                                        </div>
                                        <div className="font-bold text-brand-600 md:text-base lg:text-lg">${gig.price}</div>
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
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 md:mb-12 lg:mb-16">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
                        <div className="text-center">
                            <div className="w-16 md:w-18 lg:w-20 h-16 md:h-18 lg:h-20 bg-brand-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                                <span className="text-white text-2xl md:text-3xl lg:text-4xl font-bold">1</span>
                            </div>
                            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Find the Right Talent</h3>
                            <p className="text-sm md:text-base text-gray-600">
                                Browse through our marketplace and find the perfect freelancer for your project needs.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 md:w-18 lg:w-20 h-16 md:h-18 lg:h-20 bg-brand-800 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                                <span className="text-white text-2xl md:text-3xl lg:text-4xl font-bold">2</span>
                            </div>
                            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Hire and Collaborate</h3>
                            <p className="text-sm md:text-base text-gray-600">
                                Communicate directly with freelancers, share requirements, and get your project started.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-success-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-white text-3xl font-bold">3</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Get Work Done</h3>
                            <p className="text-gray-600">
                                Receive high-quality work on time, with secure payments and satisfaction guaranteed.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
