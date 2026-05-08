import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home({ user }) {
    const categories = [
        { id: 'developers', name: 'Developers', icon: '�‍�', count: 2850, color: 'from-blue-500 to-cyan-500', description: 'Web, Mobile, & Software Developers' },
        { id: 'designers', name: 'Designers', icon: '🎨', count: 1850, color: 'from-purple-500 to-pink-500', description: 'UI/UX, Graphic, & Product Designers' },
        { id: 'tutors', name: 'Tutors', icon: '👨‍🏫', count: 1420, color: 'from-green-500 to-emerald-500', description: 'Online & In-Person Tutoring Experts' },
        { id: 'electricians', name: 'Electricians', icon: '⚡', count: 890, color: 'from-yellow-500 to-orange-500', description: 'Licensed Electrical Services' },
        { id: 'repair_experts', name: 'Repair Experts', icon: '🔧', count: 1180, color: 'from-red-500 to-rose-500', description: 'Home, Auto, & Tech Repair Specialists' },
        { id: 'agencies', name: 'Agencies', icon: '�', count: 520, color: 'from-indigo-500 to-violet-500', description: 'Full-Service Creative & Marketing Agencies' },
        { id: 'freelancers', name: 'Freelancers', icon: '💼', count: 3240, color: 'from-teal-500 to-cyan-500', description: 'All-in-One Multi-Talented Professionals' },
        { id: 'writers', name: 'Writers', icon: '✍️', count: 950, color: 'from-amber-500 to-yellow-500', description: 'Content, Copy, & Creative Writers' },
    ];

    const featuredGigs = [
        { id: 1, title: 'Build a Modern React Website', price: 500, seller: 'John Doe', rating: 4.9, reviews: 128 },
        { id: 2, title: 'Professional Logo Design', price: 150, seller: 'Jane Smith', rating: 5.0, reviews: 89 },
        { id: 3, title: 'SEO Optimization for Your Site', price: 300, seller: 'Mike Johnson', rating: 4.8, reviews: 203 },
        { id: 4, title: 'Custom WordPress Theme', price: 450, seller: 'Sarah Wilson', rating: 4.9, reviews: 156 },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar user={user} />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 text-white">
                <div className="absolute inset-0 bg-[url('https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=abstract%20network%20connections%20digital%20marketplace%20background%20with%20dots%20and%20waves&image_size=landscape_16_9')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-600/80 to-brand-800/80"></div>
                
                <div className="container mx-auto px-4 lg:px-8 relative z-10">
                    <div className="pt-20 pb-28 lg:pt-32 lg:pb-40">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    <span className="text-sm font-medium">Trusted by 50,000+ businesses</span>
                                </div>
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                                    Hire Expert Freelancers
                                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-700">
                                        For Your Next Project
                                    </span>
                                </h1>
                                <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed">
                                    Connect with talented professionals from around the world. Get high-quality work done at amazing prices.
                                    Your vision, delivered.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                                    <a
                                        href="/gigs"
                                        className="group bg-white text-brand-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-cream-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                    >
                                        <span>Find Talent</span>
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </a>
                                    <a
                                        href="/register"
                                        className="group border-3 border-white text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white hover:text-brand-600 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                    >
                                        <span>Start Selling</span>
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </a>
                                </div>

                                <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
                                    <div className="text-center">
                                        <div className="text-4xl md:text-5xl font-bold mb-1">50K+</div>
                                        <div className="text-white/80 text-sm md:text-base">Active Freelancers</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl md:text-5xl font-bold mb-1">$5M+</div>
                                        <div className="text-white/80 text-sm md:text-base">Projects Completed</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl md:text-5xl font-bold mb-1">4.9★</div>
                                        <div className="text-white/80 text-sm md:text-base">Average Rating</div>
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
            <section className="py-20 bg-cream-100">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                            Hire Experts in Every Field
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Find skilled professionals ready to help you get your project done right
                        </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                onClick={() => window.location.href = `/gigs?category=${category.id}`}
                                className="group cursor-pointer"
                            >
                                <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group-hover:border-transparent">
                                    <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-3 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <span className="text-2xl sm:text-3xl">{category.icon}</span>
                                    </div>
                                    <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-brand-600 transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-4 hidden sm:block">
                                        {category.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-gray-700">
                                        {category.count.toLocaleString()} experts
                                        </span>
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Gigs Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl font-bold">Popular Gigs</h2>
                        <a href="/gigs" className="text-brand-600 font-semibold hover:text-brand-700">
                            View All →
                        </a>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                        {featuredGigs.map((gig) => (
                            <div key={gig.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="h-32 sm:h-48 overflow-hidden">
                                    {gig.image ? (
                                        <img src={`/storage/${gig.image}`} alt={gig.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-r from-brand-400 to-brand-600"></div>
                                    )}
                                </div>
                                <div className="p-3 sm:p-6">
                                    <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2 line-clamp-2">{gig.title}</h3>
                                    <div className="flex items-center mb-2 sm:mb-4">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full mr-2"></div>
                                        <span className="text-xs sm:text-sm text-gray-600">{gig.seller}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span className="text-yellow-500 mr-1">★</span>
                                            <span className="font-semibold text-xs sm:text-sm">{gig.rating}</span>
                                            <span className="text-gray-500 ml-1 text-xs sm:text-sm">({gig.reviews})</span>
                                        </div>
                                        <div className="text-base sm:text-xl font-bold text-brand-600">${gig.price}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 bg-cream-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-white text-3xl font-bold">1</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Find the Right Talent</h3>
                            <p className="text-gray-600">
                                Browse through our marketplace and find the perfect freelancer for your project needs.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-brand-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-white text-3xl font-bold">2</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Hire and Collaborate</h3>
                            <p className="text-gray-600">
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
